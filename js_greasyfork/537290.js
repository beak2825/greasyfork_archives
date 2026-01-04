// ==UserScript==
// @name         Minesweeper Shortcut Keys for PuzzleMadness
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Adds keyboard shortcuts to PuzzleMadness Minesweeper (Hard) for selecting ╳ (x), 💣 (c), and rubber (z).
// @author       JourneyHua
// @match        https://puzzlemadness.co.uk/minesweeper/*
// @icon         https://puzzlemadness.co.uk/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537290/Minesweeper%20Shortcut%20Keys%20for%20PuzzleMadness.user.js
// @updateURL https://update.greasyfork.org/scripts/537290/Minesweeper%20Shortcut%20Keys%20for%20PuzzleMadness.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function(event) {
        if (event.key === 'x') {
            const notMinePicker = document.querySelector('.number-picker__item.number-picker__item-image-container.js-not-mine-picker');
            if (notMinePicker) {
                notMinePicker.click();
                console.log('Selected ╳ (not-mine-picker)');
            } else {
                console.log('╳ picker not found');
            }
        }
        if (event.key === 'c') {
            const minePicker = document.querySelector('.number-picker__item.number-picker__item-image-container.js-mine-picker');
            if (minePicker) {
                minePicker.click();
                console.log('Selected 💣 (mine-picker)');
            } else {
                console.log('💣 picker not found');
            }
        }
        if (event.key === 'z') {
            const rubberPicker = document.querySelector('.number-picker__item.number-picker__item-image-container.js-rubber-picker');
            if (rubberPicker) {
                rubberPicker.click();
                console.log('Selected Rubber (js-rubber-picker)');
            } else {
                console.log('Rubber picker not found');
            }
        }
    });
})();