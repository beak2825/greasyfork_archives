// ==UserScript==
// @name         Automatically show sensitive material on Twitter Media Tab
// @namespace    http://tampermonkey.net/
// @version      2024-04-09
// @description  automatically show "sensitive" material on a Twitter user's media tab
// @author       Jimmy Klont
// @license      MIT
// @match        https://twitter.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492103/Automatically%20show%20sensitive%20material%20on%20Twitter%20Media%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/492103/Automatically%20show%20sensitive%20material%20on%20Twitter%20Media%20Tab.meta.js
// ==/UserScript==

(function() {
    'use strict';

    (new MutationObserver(check)).observe(document, {childList: true, subtree: true});

    function check(changes, observer) {
        const matches = document.querySelectorAll("span");
        matches.forEach((element) => {
            if (element.innerHTML=="Show"){
                element.click();
            }
        });
    }
})();