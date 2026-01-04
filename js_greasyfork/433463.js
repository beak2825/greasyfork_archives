// ==UserScript==
// @name         Small Player
// @version      0.1
// @description  so cool
// @author       You
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/766674
// @downloadURL https://update.greasyfork.org/scripts/433463/Small%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/433463/Small%20Player.meta.js
// ==/UserScript==

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
};

waitForElm('#movie_player').then(function(elm) {document.getElementById("movie_player").classList.remove("ytp-exp-bigger-button-like-mobile")});