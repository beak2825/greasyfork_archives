// ==UserScript==
// @name         NT Navigator
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Keyboard shortcuts for faster navigation on Nitro Type
// @author       Rynna Sanchez
// @match        https://www.nitrotype.com/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543174/NT%20Navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/543174/NT%20Navigator.meta.js
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
                case 'l': // Alt + L -> Leagues
                    window.location.href = '/leagues';
                    break;
                case 'a': //Alt + A -> Stats
                    window.location.href = '/stats';
                    break;
                case 'n': //Alt + N -> News
                    window.location.href = '/news';
                    break;
                case 'm': //Alt + M -> Achievements
                    window.location.href = '/achievements';
                    break;
                case 'h': //Alt + H -> Support
                    window.location.href = '/support';
                    break;
            }
        }
    });
})();
