// ==UserScript==
// @name         Twitch remove referrer=raid
// @description  automatically remove ?referrer=raid from twitch urls
// @namespace    https://github.com/adrianmgg
// @version      2.0.2
// @author       amgg
// @license      MIT
// @compatible   chrome
// @compatible   firefox
// @match        https://www.twitch.tv/*
// @match        https://www.twitch.tv
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/409807/Twitch%20remove%20referrer%3Draid.user.js
// @updateURL https://update.greasyfork.org/scripts/409807/Twitch%20remove%20referrer%3Draid.meta.js
// ==/UserScript==

// i can't think of what to name this function right now
function doTheThing(url) {
    // doing it this way (referrer=raid without the ?) since this works when there are other url params
    if(url.includes("referrer=raid")) {
        document.location.href = url.replace("referrer=raid", "");
    }
}

const PUSHSTATE = unsafeWindow.history.pushState;
unsafeWindow.history.pushState = function(state, title, url) {
    doTheThing(url);
    return PUSHSTATE.apply(this, arguments);
};

// just in case we were brought to the page directly rather than through pushstate
doTheThing(document.location.href);

