// ==UserScript==
// @name         Numpad Dot to Comma
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace numpad dot with comma
// @match        https://*.visitcube.de/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547468/Numpad%20Dot%20to%20Comma.user.js
// @updateURL https://update.greasyfork.org/scripts/547468/Numpad%20Dot%20to%20Comma.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if target is an input or textarea
        const isEditable = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
        if (!isEditable) return;

        // Check if it's the numpad decimal key
        if (e.code === 'NumpadDecimal') {
            e.preventDefault();

            // Insert comma at the current cursor position
            const input = e.target;
            const value = input.value;
            const start = input.selectionStart;
            const end = input.selectionEnd;

            input.value = value.substring(0, start) + ',' + value.substring(end);
            input.selectionStart = input.selectionEnd = start + 1;
        }
    });
})();
