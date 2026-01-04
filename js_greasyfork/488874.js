// ==UserScript==
// @name         Value Modifier and Copy Button Injector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify displayed value and add a copy button
// @author       Ahmed
// @match        https://cherdak.console3.com/global/intercity/orders/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488874/Value%20Modifier%20and%20Copy%20Button%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/488874/Value%20Modifier%20and%20Copy%20Button%20Injector.meta.js
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
        button.addEventListener('click', () => {
            navigator.clipboard.writeText(value);
        });
        return button;
    };

    const modifyValueAndAddButton = () => {
        const feeLabel = 'Fee Amount:';
        const elements = document.querySelectorAll('.view__Value-kPAIBO.jxWMTc');

        elements.forEach(element => {
            const isFeeAmount = element.previousElementSibling && element.previousElementSibling.textContent.includes(feeLabel);
            if (isFeeAmount && isValidNumber(element.textContent) && element.getAttribute('data-modified') !== 'true') {
                // Mark as modified to avoid multiple modifications
                element.setAttribute('data-modified', 'true');

                // Modify the content
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
