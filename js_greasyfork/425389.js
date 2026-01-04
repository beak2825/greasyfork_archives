// ==UserScript==
// @name        autounping
// @namespace   Violentmonkey Scripts
// @match       *://discord.com/*
// @grant       none
// @version     1.2
// @author      -
// @description Discord mention unpinger
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/425389/autounping.user.js
// @updateURL https://update.greasyfork.org/scripts/425389/autounping.meta.js
// ==/UserScript==

/* jshint esversion: 6 */
'use strict';

let didManuallyClick = false;
function unping() {
    const mentionButton = document.querySelector('[aria-label="Mention"]');
    if(mentionButton !== null) {
        let clickableMention = mentionButton;
        while (!clickableMention.hasAttribute('aria-checked')) {
            clickableMention = clickableMention.parentNode;
        }
        if(!didManuallyClick && clickableMention.getAttribute('aria-checked') == 'true') {
            console.log('unpinging');
            clickableMention.click();
            clickableMention.addEventListener('click', function(_) {
                didManuallyClick = true;
            });
        }
    } else {
        didManuallyClick = false;
    }
}

setInterval(unping, 500);