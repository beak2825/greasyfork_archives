// ==UserScript==
// @name         GoComics control with arrow keys
// @namespace    https://github.com/AbdurazaaqMohammed/userscripts
// @version      1.1
// @description  Use arrow keys to go back and forth on comics on GoComics, long press to go to first/last comic
// @author       Abdurazaaq Mohammed
// @license      The Unlicense
// @homepage     https://github.com/AbdurazaaqMohammed/userscripts
// @supportURL   https://github.com/AbdurazaaqMohammed/userscripts/issues
// @match        https://www.gocomics.com/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490029/GoComics%20control%20with%20arrow%20keys.user.js
// @updateURL https://update.greasyfork.org/scripts/490029/GoComics%20control%20with%20arrow%20keys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let leftPressTimer, rightPressTimer;

    document.addEventListener('keydown', function(e) {
        const key = e.key;

        if (key === "ArrowLeft") {
            leftPressTimer = setTimeout(function() {
                const fastBackward = document.querySelector('a.fa.btn.btn-outline-secondary.btn-circle.fa.fa-backward.sm');
                if (fastBackward && fastBackward.href !== window.location.href) {
                    fastBackward.click(); // Fast backward on long press
                }
            }, 500); // 500ms delay for long press detection

        } else if (key === "ArrowRight") {
            rightPressTimer = setTimeout(function() {
                const fastForward = document.querySelector('a.fa.btn.btn-outline-secondary.btn-circle.fa-forward.sm');
                if (fastForward && fastForward.href !== window.location.href) {
                    fastForward.click(); // Fast forward on long press
                }
            }, 500); // 500ms delay for long press detection
        }
    });

    document.addEventListener('keyup', function(e) {
        const key = e.key;

        if (key === "ArrowLeft") {
            clearTimeout(leftPressTimer);
            const previous = document.querySelector('.js-previous-comic.sm.fa-caret-left.btn-circle.btn-outline-secondary.btn.fa');
            if (previous && previous.href !== window.location.href) {
                previous.click(); // Go to previous comic release if href is different
            }
        } else if (key === "ArrowRight") {
            clearTimeout(rightPressTimer);
            const next = document.querySelector('.sm.fa-caret-right.btn-circle.btn-outline-secondary.btn.fa');
            if (next && next.href !== window.location.href) {
                next.click(); // Go to next comic release if href is different
            }
        }
    });
})();
