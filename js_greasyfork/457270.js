// ==UserScript==
// @name         YouTube Short Redirector on keypress
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press "R" to redirect from a youtube short to a proper youtube video view
// @author       Yamui
// @match        https://www.youtube.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457270/YouTube%20Short%20Redirector%20on%20keypress.user.js
// @updateURL https://update.greasyfork.org/scripts/457270/YouTube%20Short%20Redirector%20on%20keypress.meta.js
// ==/UserScript==


(function() {
    'use strict';

    document.addEventListener('keyup', (event) => {
        const observedKey = "r";

        if (event.key !== observedKey) {
            return;
        }

        const location = document.location;
        if (location.pathname.includes('/shorts/')) {
            location.href = origin + '/watch?v=' + location.pathname.split('/')[2];
        }
    }, true);
})();