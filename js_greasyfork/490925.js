// ==UserScript==
// @name         Dynast.io E Spam (Activate by press SHIFT)
// @namespace    http://your-namespace.example.com
// @version      1.1
// @description  Spams the letter 'e' when the shift key is pressed on Dynast.io
// @match        https://dynast.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/490925/Dynastio%20E%20Spam%20%28Activate%20by%20press%20SHIFT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/490925/Dynastio%20E%20Spam%20%28Activate%20by%20press%20SHIFT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetElement = document.body;

    function simulateKeyPress(event) {
        if (event.key === 'Shift') {
            const eKeyEvent = new KeyboardEvent('keydown', {
                key: 'e',
                code: 'KeyE',
                keyCode: 69,
                which: 69,
                charCode: 0,
                shiftKey: true
            });

            targetElement.dispatchEvent(eKeyEvent);
        }
    }

    function simulateKeyRelease(event) {
        if (event.key === 'Shift') {
            const eKeyEvent = new KeyboardEvent('keyup', {
                key: 'e',
                code: 'KeyE',
                keyCode: 69,
                which: 69,
                charCode: 0,
                shiftKey: true
            });

            targetElement.dispatchEvent(eKeyEvent);
        }
    }

    document.addEventListener('keydown', simulateKeyPress);
    document.addEventListener('keyup', simulateKeyRelease);
})();