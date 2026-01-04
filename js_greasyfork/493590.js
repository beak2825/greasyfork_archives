// ==UserScript==
// @name         Copy ID Button
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  copy button
// @author       Ahmed
// @match        https://cherdak.console3.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493590/Copy%20ID%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/493590/Copy%20ID%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const selectors = [
        "#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(2) > div > div:nth-child(1) > dd > a",
        "#single-spa-application\\:\\@cherdak\\/new-order-module > div.Box-sc-dse4m4-0.cXHdXy > main > div > div:nth-child(2) > div:nth-child(2) > div > div.styles__InfoWrapper-ioCrot.vJNBD > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > div:nth-child(1) > dd > a"
    ];

    function createAndAttachCopyButton(element) {
        let copyButton = document.createElement('button');
        copyButton.innerHTML = `<img src="data:image/svg+xml,%3Csvg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 1.938V2H2V17H1.937C1.42328 17 0.930592 16.7959 0.567334 16.4327C0.204076 16.0694 2.58155e-07 15.5767 2.58155e-07 15.063V1.938C-0.000131107 1.68355 0.0498739 1.43156 0.147158 1.19644C0.244443 0.961312 0.387101 0.747661 0.566981 0.567688C0.746861 0.387715 0.960439 0.244947 1.19551 0.147541C1.43058 0.0501354 1.68255 2.24379e-07 1.937 2.58288e-07H13.062C13.3165 -0.000131184 13.5686 0.0499069 13.8038 0.147254C14.039 0.244601 14.2527 0.387348 14.4327 0.567334C14.6127 0.74732 14.7554 0.961016 14.8527 1.1962C14.9501 1.43139 15.0001 1.68346 15 1.938ZM16.062 3C16.3165 2.99987 16.5686 3.04991 16.8038 3.14725C17.039 3.2446 17.2527 3.38735 17.4327 3.56733C17.6127 3.74732 17.7554 3.96102 17.8527 4.1962C17.9501 4.43139 18.0001 4.68346 18 4.938V18.063C18 18.3175 17.9499 18.5694 17.8525 18.8045C17.7551 19.0396 17.6123 19.2531 17.4323 19.433C17.2523 19.6129 17.0387 19.7556 16.8036 19.8528C16.5684 19.9501 16.3165 20.0001 16.062 20H4.937C4.68263 20 4.43075 19.9499 4.19574 19.8526C3.96073 19.7552 3.7472 19.6125 3.56733 19.4327C3.38747 19.2528 3.24479 19.0393 3.14745 18.8043C3.0501 18.5693 3 18.3174 3 18.063V4.938C2.99987 4.68355 3.04987 4.43156 3.14716 4.19644C3.24444 3.96131 3.3871 3.74766 3.56698 3.56769C3.74686 3.38771 3.96044 3.24495 4.19551 3.14754C4.43058 3.05014 4.68255 3 4.937 3H16.062ZM16 18V5H5V18H16Z' fill='%23338FFC'/%3E%3C/svg%3E%0A" alt="Copy">`;
        copyButton.style.cssText = `
            padding: 0;
            border: none;
            background: none;
            cursor: pointer;
            margin-left: 10px;
        `;
        copyButton.addEventListener('click', function() {
            const userId = element.textContent;
            navigator.clipboard.writeText(userId).then(() => {
                console.log('Copied to clipboard: ' + userId);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        });

        if (element.parentNode.style.display === 'flex') {
            element.parentNode.appendChild(copyButton);
        } else {
            element.parentNode.style.display = 'flex';
            element.parentNode.style.alignItems = 'center';
            element.parentNode.appendChild(copyButton);
        }
    }

    function addCopyButtonWithSelectors() {
        selectors.forEach(selector => {
            const element = document.querySelector(selector);
            if (element && !element.classList.contains('copy-button-added')) {
                createAndAttachCopyButton(element);
                element.classList.add('copy-button-added');
            }
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes) {
                addCopyButtonWithSelectors();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    addCopyButtonWithSelectors();
})();