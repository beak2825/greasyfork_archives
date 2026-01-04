// ==UserScript==
// @name         Refund companion 3
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify displayed value and add a copy button
// @author       Ahmed Esslaoui
// @match        https://cherdak.console3.com/global/intercity/orders/*
// @grant        none
// @icon         https://www.svgrepo.com/download/51300/money.svg
// @downloadURL https://update.greasyfork.org/scripts/498682/Refund%20companion%203.user.js
// @updateURL https://update.greasyfork.org/scripts/498682/Refund%20companion%203.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const isValidNumber = (str) => {
        const num = parseFloat(str.replace(/,/g, ''));
        return !isNaN(num) && isFinite(num);
    };

    const createCopyButton = (value) => {
        const button = document.createElement('button');
        button.textContent = 'Copy';
        button.style.cssText = `
            background-color: #007aff; /* iMessage blue */
            color: white;
            border: none;
            border-radius: 12px;
            padding: 5px 10px;
            font-size: 12px;
            cursor: pointer;
            margin-left: 5px;
        `;
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(value).then(() => {
                button.style.backgroundColor = '#4CAF50'; 
                button.textContent = '✔️';
                button.disabled = true;
            });
        });
        return button;
    };

    const modifyValueAndAddButton = () => {
        const feeLabel = 'Fee Amount:';
        const elements = document.querySelectorAll('.view__Value-kPAIBO.jxWMTc');

        elements.forEach(element => {
            const isFeeAmount = element.previousElementSibling && element.previousElementSibling.textContent.includes(feeLabel);
            if (isFeeAmount && isValidNumber(element.textContent) && element.getAttribute('data-modified') !== 'true') {
                
                element.setAttribute('data-modified', 'true');

               
                let originalValue = element.textContent;
                let modifiedValue = (parseFloat(originalValue.replace(/,/g, '')) / 100).toFixed(2);
                element.textContent = modifiedValue;

                const copyButton = createCopyButton(modifiedValue);
                element.after(copyButton);
            }
        });
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                modifyValueAndAddButton();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    modifyValueAndAddButton();
})();
