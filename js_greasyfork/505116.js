// ==UserScript==
// @name         SmartSchool Resultaten Plus (SR+)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Deze script verandert al je slechte punten tot een 100% en Y/Y en blauw (kleur van de beste score) CHECK THE DE DESCRIPTION VAN DE SCRIPT!
// @author       Emree.el op instagram
// @match        https://*.smartschool.be/results/main/results/details/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505116/SmartSchool%20Resultaten%20Plus%20%28SR%2B%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505116/SmartSchool%20Resultaten%20Plus%20%28SR%2B%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Create and style the checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.style.position = 'fixed';
    checkbox.style.right = '20px';
    checkbox.style.top = '50%';
    checkbox.style.zIndex = '9999';
    checkbox.style.backgroundColor = 'black';
    document.body.appendChild(checkbox);

    // Store original values for later restoration
    const originalData = new WeakMap();

    // Function to modify elements
    function modifyElements(enable) {
        const elements = document.querySelectorAll('.evaluation-list-item, .progress-ring__content, .progress-ring__svg__bar');

        elements.forEach((item, index) => {
            const percentageElement = item.querySelector('.progress-ring__content span, .progress-ring__value');
            const scoreElement = item.querySelector('span:not(.progress-ring__content span):not(.progress-ring__value)');
            const circleElement = item.querySelector('.progress-ring__svg__bar');

            if (enable) {
                if (!originalData.has(item)) {
                    originalData.set(item, {
                        percentage: percentageElement ? percentageElement.textContent : '',
                        score: scoreElement ? scoreElement.textContent : '',
                        svg: circleElement ? circleElement.outerHTML : ''
                    });
                }

                // Modify percentage and score elements
                if (percentageElement) {
                    percentageElement.textContent = '100%';
                }

                if (scoreElement) {
                    const [currentScore, maxScore] = scoreElement.textContent.split('/');
                    if (maxScore) {
                        scoreElement.textContent = `${maxScore.trim()}/${maxScore.trim()}`;
                    }
                }

                // Modify SVG circle to be fully filled and blue
                if (circleElement) {
                    circleElement.style.strokeDashoffset = '0px';
                    circleElement.style.stroke = 'var(--c-blue--500)';
                }

                // Change background color of button to blue
                item.classList.remove('c-yellow-combo--100', 'c-red-combo--100', 'c-green-combo--100');
                item.classList.add('c-blue-combo--100');
            } else {
                setTimeout(() => {
                    if (originalData.has(item)) {
                        const original = originalData.get(item);

                        if (percentageElement) {
                            percentageElement.textContent = original.percentage;
                        }

                        if (scoreElement) {
                            scoreElement.textContent = original.score;
                        }

                        if (circleElement) {
                            circleElement.outerHTML = original.svg;
                        }

                        // Restore original background color
                        item.classList.remove('c-blue-combo--100');
                        const className = original.svg.includes('var(--c-yellow--') ? 'c-yellow-combo--100' :
                                          original.svg.includes('var(--c-red--') ? 'c-red-combo--100' : 'c-green-combo--100';
                        item.classList.add(className);
                    }
                }, index * 100); // Delay based on the index to spread out the work
            }
        });
    }

    // Mutation observer to apply changes even on dynamically added elements
    const observer = new MutationObserver(() => {
        modifyElements(checkbox.checked);
    });

    // Observe the entire document
    observer.observe(document.body, { childList: true, subtree: true });

    // Listen for checkbox changes
    checkbox.addEventListener('change', function () {
        modifyElements(checkbox.checked);
    });

    // Ensure elements are modified after page load
    window.addEventListener('load', function () {
        modifyElements(checkbox.checked);
    });

})();
