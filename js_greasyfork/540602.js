// ==UserScript==
// @name         Gartic.io Advanced Room Options
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Adding more room configuration options in Gartic.io.
// @author       arcticrevurne
// @icon         https://em-content.zobj.net/source/twitter/408/fox_1f98a.png
// @match        *://*.gartic.io/*
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/540602/Garticio%20Advanced%20Room%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/540602/Garticio%20Advanced%20Room%20Options.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const initialElement = document.querySelector(selector);
        if (initialElement) {
            callback(initialElement);
            return;
        }

        const observer = new MutationObserver(mutations => {
            const element = document.querySelector(selector);
            if (element) {
                observer.disconnect();
                callback(element);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function customizeDropdown(selectSelector, customOptions, defaultSelectedValue) {
        let isModifying = false;

        const performModification = (selectElement) => {
            if (isModifying) {
                return;
            }
            isModifying = true;

            const currentSelectedValue = selectElement.value;
            let valueToSet = defaultSelectedValue;

            if (customOptions.includes(parseInt(currentSelectedValue))) {
                valueToSet = parseInt(currentSelectedValue);
            }

            while (selectElement.firstChild) {
                selectElement.removeChild(selectElement.firstChild);
            }

            customOptions.forEach(value => {
                const option = document.createElement('option');
                option.value = value;
                option.textContent = value;
                selectElement.appendChild(option);
            });

            if (valueToSet !== undefined && customOptions.includes(valueToSet)) {
                selectElement.value = valueToSet;
            } else if (selectElement.options.length > 0) {
                 selectElement.value = selectElement.options[0].value;
            }

            selectElement.dispatchEvent(new Event('change', { bubbles: true }));

            isModifying = false;
        };

        waitForElement(selectSelector, (selectElement) => {
            setTimeout(() => {
                performModification(selectElement);

                const observer = new MutationObserver(mutations => {
                    if (isModifying) {
                        return;
                    }

                    let shouldRemodify = false;
                    for (let mutation of mutations) {
                        if (mutation.type === 'childList' || (mutation.type === 'attributes' && mutation.attributeName === 'value')) {
                            if (selectElement.options.length !== customOptions.length ||
                                !customOptions.every(val => Array.from(selectElement.options).some(opt => parseInt(opt.value) === val))) {
                                shouldRemodify = true;
                                break;
                            }
                        }
                    }

                    if (shouldRemodify) {
                        performModification(selectElement);
                    }
                });

                observer.observe(selectElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['value'] });

            }, 500);
        });
    }

    const desiredPlayerOptions = [];
    for (let i = 5; i <= 75; i++) {
        desiredPlayerOptions.push(i);
    }

    for (let i = 75 + 25; i <= 255; i += 25) {
        if (!desiredPlayerOptions.includes(i)) {
             desiredPlayerOptions.push(i);
        }
    }

    desiredPlayerOptions.push(255);
    desiredPlayerOptions.sort((a, b) => a - b);

    customizeDropdown(
        'select[name="players"]',
        desiredPlayerOptions,
        15
    );

    const desiredPointsOptions = [];

    for (let i = 70; i <= 720; i += 10) {
        desiredPointsOptions.push(i);
    }
    for (let i = 720 + 240; i <= 7200; i += 240) {
        if (!desiredPointsOptions.includes(i)) {
             desiredPointsOptions.push(i);
        }
    }

    desiredPointsOptions.push(65535);
    desiredPointsOptions.sort((a, b) => a - b);

    customizeDropdown(
        'select[name="points"]',
        desiredPointsOptions,
        120
    );

})();