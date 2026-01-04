// ==UserScript==
// @name         Disable TheHill.com Dark Patterns and General Sociopathy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes ad nag and infuriating auto-playing videos.
// @author       @timfitzzz
// @match        https://thehill.com/*
// @icon         https://www.google.com/s2/favicons?domain=thehill.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433460/Disable%20TheHillcom%20Dark%20Patterns%20and%20General%20Sociopathy.user.js
// @updateURL https://update.greasyfork.org/scripts/433460/Disable%20TheHillcom%20Dark%20Patterns%20and%20General%20Sociopathy.meta.js
// ==/UserScript==

(function() {

    const checkElement = async selector => {
        while ( document.querySelector(selector) === null) {
            await new Promise( function(resolve) { requestAnimationFrame(resolve) })
        }
        return document.querySelector(selector);
    };

    let adRoot = document.getElementsByClassName('fc-ab-root')[0];
    adRoot && adRoot.remove();
    let playerContainer = document.getElementsByClassName('player-container')[0];
    playerContainer && playerContainer.remove();
    let body = document.body
    body.style = ""

    checkElement('.fc-ab-root').then((selector) => {
        console.log(selector)
        selector && selector.remove()
        let body = document.body
        body.style = ""
    });
    // Your code here...
})();
