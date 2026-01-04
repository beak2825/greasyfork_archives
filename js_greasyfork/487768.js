// ==UserScript==
// @name         territorial.io script for opening (better TT )
// @license			MIT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press a specific key to trigger an action.
// @author       shivam@singh
// @match        https://territorial.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487768/territorialio%20script%20for%20opening%20%28better%20TT%20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/487768/territorialio%20script%20for%20opening%20%28better%20TT%20%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        // Check if the key pressed is your desired shortcut key
        if (event.key === 'y') {
            // Simulate typing '2' five times
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown',{'key':'2'}));
                    document.dispatchEvent(new KeyboardEvent('keyup',{'key':'2'}));
                }, i * 100);
            }
            // Simulate typing '5' three times
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown',{'key':'5'}));
                    document.dispatchEvent(new KeyboardEvent('keyup',{'key':'5'}));
                }, (i + 5) * 100);
            }
        } else if (event.key === 'u') {
            // Simulate typing '7744'
            const sequence = '7744';
            for (let i = 0; i < sequence.length; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': sequence[i]}));
                    document.dispatchEvent(new KeyboardEvent('keyup', {'key': sequence[i]}));
                }, i * 100);
            }
        } else if (event.key === 'i') {
            // Simulate typing '255'
            const sequence = '255';
            for (let i = 0; i < sequence.length; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': sequence[i]}));
                    document.dispatchEvent(new KeyboardEvent('keyup', {'key': sequence[i]}));
                }, i * 100);
            }
        } else if (event.key === 'o') {
            // Simulate typing '4'
            const sequence = '4';
            for (let i = 0; i < sequence.length; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': sequence[i]}));
                    document.dispatchEvent(new KeyboardEvent('keyup', {'key': sequence[i]}));
                }, i * 100);
            }
        } else if (event.key === 'p') {
            // Simulate typing '776'
            const sequence = '776';
            for (let i = 0; i < sequence.length; i++) {
                setTimeout(() => {
                    document.dispatchEvent(new KeyboardEvent('keydown', {'key': sequence[i]}));
                    document.dispatchEvent(new KeyboardEvent('keyup', {'key': sequence[i]}));
                }, i * 100);
            }
        }
    });
})();
