// ==UserScript==
// @name         remove ugly player
// @version      0.1
// @description  downsizes the buttons on youtube player
// @author       Kyle Boyd
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/826218
// @downloadURL https://update.greasyfork.org/scripts/436925/remove%20ugly%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/436925/remove%20ugly%20player.meta.js
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
waitForElm('#movie_player').then(function(elm) {document.getElementById("movie_player").classList.remove("ytp-larger-tap-buttons")});