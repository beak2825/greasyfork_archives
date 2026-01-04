// ==UserScript==
// @name         Hentai Heroes notifications disabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Disables those idiotic daily contest objectives notifications.
// @author       randomfapper34
// @match        http*://nutaku.haremheroes.com/*
// @match        http*://*.hentaiheroes.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/407015/Hentai%20Heroes%20notifications%20disabler.user.js
// @updateURL https://update.greasyfork.org/scripts/407015/Hentai%20Heroes%20notifications%20disabler.meta.js
// ==/UserScript==

function waitForElement() {
    //await construction of objective popup variable in game script
    if (typeof objectivePopup !== 'undefined' && objectivePopup !== null) {
        //replace objective popup display function with an empty one
        objectivePopup.show = function show(data) {
            return;
        };
    }
    else {
        setTimeout(waitForElement, 200);
    }
}

waitForElement();