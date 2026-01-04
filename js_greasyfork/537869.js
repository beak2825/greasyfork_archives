// ==UserScript==
// @name         Erome Age Warn Skipper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Skips the age warning automatically
// @author       RMS Carpathia
// @license      MIT
// @match        *://*.erome.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erome.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537869/Erome%20Age%20Warn%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/537869/Erome%20Age%20Warn%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let count = 0;
    const skip_warn = () => {
        const button_enter = document.getElementsByClassName('enter'); // get button

        if(count >= 15) return; // max 15 try.

        if (button_enter.length === 0) {
            count++;
            setTimeout(skip_warn, 30); // try again in 30ms;
            return;
        }

        button_enter[0].click(); // click on first button
        console.log('[AGE WARN SKIPPER]: WARN SKIPPED!');
    }

    console.log('[LOADED]: AGE WARN SKIPPER');
    skip_warn();
})();