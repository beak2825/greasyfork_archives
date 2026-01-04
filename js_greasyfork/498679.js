// ==UserScript==
// @name         Refund companion 1
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Paste the last copied value from the clipboard to the input field if it is numeric and contains a decimal point
// @author       Ahmed Esslaoui
// @match        https://podval.console3.com/podval/payment/*
// @icon         https://www.svgrepo.com/download/51300/money.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/498679/Refund%20companion%201.user.js
// @updateURL https://update.greasyfork.org/scripts/498679/Refund%20companion%201.meta.js
// ==/UserScript==

(function() {
    'use strict';

   
    function isNumericWithDecimal(value) {
        return !isNaN(value) && value.includes('.');
    }

    
    async function pasteClipboardValue() {
        try {
            const text = await navigator.clipboard.readText();
            if (isNumericWithDecimal(text)) {
                const inputField = document.querySelector("#MultiPaymentGiftForm_sum");
                if (inputField) {
                    inputField.value = text;
                } else {
                    console.error("Input field not found");
                }
            } else {
                console.log("Clipboard content is not numeric or doesn't contain a decimal point");
            }
        } catch (err) {
            console.error("Failed to read clipboard contents: ", err);
        }
    }

    
    window.addEventListener('load', pasteClipboardValue);

})();
