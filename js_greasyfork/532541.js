// ==UserScript==
// @name         GMINVENT Barcode Formatter v2
// @namespace    https://greasyfork.org/users/your-username
// @version      1.1
// @description  Automatically formats barcodes and simulates Enter key behavior on TAB in GMINVENT input fields.
// @match        https://bgmdolly.gminvent.fr/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/532541/GMINVENT%20Barcode%20Formatter%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/532541/GMINVENT%20Barcode%20Formatter%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function simulateCarriageReturn(inputField) {
        inputField.value += '\r';
        inputField.dispatchEvent(new Event('input', { bubbles: true }));
        inputField.dispatchEvent(new Event('change', { bubbles: true }));
        inputField.blur();

        const isDorian = inputField.classList.contains('doriainput');

        setTimeout(() => {
            if (isDorian) {
                ['keydown', 'keypress', 'keyup'].forEach(type => {
                    inputField.dispatchEvent(new KeyboardEvent(type, {
                        key: 'Enter',
                        code: 'Enter',
                        keyCode: 13,
                        which: 13,
                        bubbles: true,
                        cancelable: true
                    }));
                });
            } else {
                inputField.dispatchEvent(new KeyboardEvent('keydown', {
                    key: 'Enter',
                    code: 'Enter',
                    keyCode: 13,
                    which: 13,
                    bubbles: true
                }));
            }
        }, 300);
    }

    document.addEventListener('keydown', function (event) {
        if (event.key !== 'Tab') return;

        const inputFields = document.querySelectorAll("input[id$='input']");
        const inputField = Array.from(inputFields).find(field => field === event.target);
        if (!inputField) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        const original = inputField.value.trim();
        let formatted = null;

        const match = original.match(/^(la|re|ch|cm)(\d+)$/i);
        if (match) {
            const [_, prefix, digits] = match;
            formatted = "SEMLG" + prefix + digits.padStart(10 - prefix.length, '0');
        } else if (original.startsWith("A ")) {
            formatted = "cmdb0a000" + original.slice(2);
        }

        if (formatted !== null) {
            inputField.value = formatted;
            inputField.dispatchEvent(new Event('input', { bubbles: true }));
            inputField.dispatchEvent(new Event('change', { bubbles: true }));
        }

        simulateCarriageReturn(inputField);
    });
})();
