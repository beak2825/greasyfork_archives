// ==UserScript==
// @name         Nitro Type Shortcut Navigator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Keyboard shortcuts for faster navigation on Nitro Type
// @author       Ayaan Noor
// @match        https://www.nitrotype.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542250/Nitro%20Type%20Shortcut%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/542250/Nitro%20Type%20Shortcut%20Navigator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        if (e.altKey && !e.shiftKey && !e.ctrlKey) {
            switch (e.key.toLowerCase()) {
                case 'p': // Alt + P -> Profile
                    window.location.href = '/profile';
                    break;
                case 'g': // Alt + G -> Garage
                    window.location.href = '/garage';
                    break;
                case 'r': // Alt + R -> Race
                    window.location.href = '/race';
                    break;
                case 'f': // Alt + F -> Friends
                    window.location.href = '/friends';
                    break;
                case 's': // Alt + S -> Shop
                    window.location.href = '/shop';
                    break;
            }
        }
    });
})();
