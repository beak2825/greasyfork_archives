// ==UserScript==
// @name         Number Simplifier
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Simplifies reading big numbers.
// @author       Paran
// @licence      MIT
// @match        *://*/*
// @grant        none
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @downloadURL https://update.greasyfork.org/scripts/499929/Number%20Simplifier.user.js
// @updateURL https://update.greasyfork.org/scripts/499929/Number%20Simplifier.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Create a context menu item
    document.addEventListener('contextmenu', function(event) {
        let selectedText = window.getSelection().toString().trim();
        if (isValidNumber(selectedText)) {
            let numberInShortForm = convertNumberToShortForm(selectedText);
            showPopup(numberInShortForm, event.pageX, event.pageY);
        }
    });

    // Also handle double-click
    document.addEventListener('dblclick', function(event) {
        let selectedText = window.getSelection().toString().trim();
        if (isValidNumber(selectedText)) {
            let numberInShortForm = convertNumberToShortForm(selectedText);
            showPopup(numberInShortForm, event.pageX, event.pageY);
        }
    });

    function isValidNumber(text) {
        return /^[\d,.\$\£\€\¥\₹]+$/.test(text.replace(/,/g, '').replace(/[\$\£\€\¥\₹]/g, ''));
    }

    function convertNumberToShortForm(num) {
        num = parseFloat(num.replace(/,/g, '').replace(/[\$\£\€\¥\₹]/g, ''));
        if (num >= 1e12) {
            return (num / 1e12).toFixed(1) + 'T';
        } else if (num >= 1e9) {
            return (num / 1e9).toFixed(1) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        } else {
            return num.toString();
        }
    }

    function showPopup(text, x, y) {
        let popup = document.createElement('div');
        popup.style.position = 'absolute';
        popup.style.left = `${x}px`;
        popup.style.top = `${y + 20}px`;
        popup.style.background = '#fff9c4';
        popup.style.border = '1px solid #ffd700';
        popup.style.padding = '10px';
        popup.style.borderRadius = '4px';
        popup.style.boxShadow = '0px 0px 10px rgba(255, 215, 0, 0.5)';
        popup.style.zIndex = '1000';
        popup.style.transform = 'translateX(-50%)';
        popup.innerText = text;

        let arrow = document.createElement('div');
        arrow.style.position = 'absolute';
        arrow.style.left = '50%';
        arrow.style.top = '-10px';
        arrow.style.width = '0';
        arrow.style.height = '0';
        arrow.style.borderLeft = '10px solid transparent';
        arrow.style.borderRight = '10px solid transparent';
        arrow.style.borderBottom = '10px solid #fff9c4';
        arrow.style.transform = 'translateX(-50%)';
        popup.appendChild(arrow);

        document.body.appendChild(popup);

        setTimeout(() => {
            popup.remove();
        }, 1000);
    }
})();

