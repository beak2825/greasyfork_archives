// ==UserScript==
// @name         bandcamp shortcuts
// @namespace    http://tampermonkey.net/
// @version      2025-03-02
// @description  space to pause, up and down arrows for next/prev song
// @author       yegor c.
// @match        http*://*.bandcamp.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/528586/bandcamp%20shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/528586/bandcamp%20shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space') {
            event.preventDefault();
            const button = document.querySelector('.playbutton');
            if (button) {
                button.click();
            }
        }
        if (event.code === 'ArrowUp') {
            event.preventDefault();
            const button = document.querySelector('.prevbutton');
            if (button) {
                button.click();
            }
        }
        if (event.code === 'ArrowDown') {
            event.preventDefault();
            const button = document.querySelector('.nextbutton');
            if (button) {
                button.click();
            }
        }
    });
})();