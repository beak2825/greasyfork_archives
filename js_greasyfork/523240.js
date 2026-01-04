// ==UserScript==
// @name         FarmRPG - Custom Flea Market
// @namespace    duck.wowow
// @version      0.1
// @description  Adds a dropdown menu to flea market with options to toggle each section and each item in the Juices & More section
// @author       Odung
// @match        https://farmrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523240/FarmRPG%20-%20Custom%20Flea%20Market.user.js
// @updateURL https://update.greasyfork.org/scripts/523240/FarmRPG%20-%20Custom%20Flea%20Market.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let pageLoadTimeout;

    function observePage() {
        const targetNode = document.querySelector('#fireworks');
        if (!targetNode) {
            setTimeout(observePage, 500);
            return;
        }

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-page') {
                    if (mutation.target.getAttribute('data-page') === 'flea') editFleaMarket();
                    else if (pageLoadTimeout) {
                        clearTimeout(pageLoadTimeout);
						pageLoadTimeout = null;
					}
                }
            }
        });

        observer.observe(targetNode, {attributes: true});
    }

    function editFleaMarket() {
        if (document.querySelector('.flea-market-settings')) return;

        const fleaMarketElements = document.querySelector('.page.page-on-center > .page-content > .content-block');
        if (!fleaMarketElements) {
            pageLoadTimeout = setTimeout(editFleaMarket, 500);
            return;
        }

        const resultObject = {};

        if (fleaMarketElements) {
            Array.from(fleaMarketElements.children).forEach((child) => {
                if (child.classList.contains('content-block-title')) {
                    const key = child.innerText.trim();
                    const value = [child, child.nextElementSibling];
                    resultObject[key] = value;
                }
            });
        }

        const newObject = {};

        const juicesAndMore = resultObject['JUICES & MORE (ALWAYS HERE)']?.[1];

        if (juicesAndMore) {
            const strongElements = juicesAndMore.querySelectorAll('.item-title > strong');

            strongElements.forEach((strong) => {
                const key = strong.innerText.trim();
                const value = strong.parentElement?.parentElement?.parentElement?.parentElement;
                if (value) {
                    newObject[key] = value;
                }
            });
        }

        const wrapperElement = document.createElement('div');
        wrapperElement.classList.add('flea-market-settings');

        const toggleLabel = document.createElement('label');
        toggleLabel.innerText = 'Toggle Settings';
        toggleLabel.style.cursor = 'pointer';
        toggleLabel.style.fontSize = '12px';
        toggleLabel.style.backgroundColor = '#333';
        toggleLabel.style.color = '#fff';
        toggleLabel.style.textAlign = 'center';
        toggleLabel.style.width = '100%';
        toggleLabel.style.display = 'block';

        const container = document.createElement('div');
        container.style.display = 'none';

        wrapperElement.appendChild(toggleLabel);
        wrapperElement.appendChild(container);
        fleaMarketElements.prepend(wrapperElement);

        toggleLabel.addEventListener('click', () => {
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        });

        function saveCheckboxStates() {
            const states = { resultObject: {}, newObject: {} };

            Object.keys(resultObject).forEach((key) => {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    states.resultObject[key] = checkbox.checked;
                }
            });

            Object.keys(newObject).forEach((key) => {
                const checkbox = document.getElementById(key);
                if (checkbox) {
                    states.newObject[key] = checkbox.checked;
                }
            });

            localStorage.setItem('fleaMarketStates', JSON.stringify(states));
        }

        function loadCheckboxStates() {
            const states = JSON.parse(localStorage.getItem('fleaMarketStates'));
            if (!states) return;

            Object.entries(states.resultObject || {}).forEach(([key, checked]) => {
                const checkbox = document.getElementById(key);
                const value = resultObject[key];
                if (checkbox) {
                    checkbox.checked = checked;
                    value.forEach((el) => {
                        if (el && el.style) {
                            el.style.display = checked ? 'block' : 'none';
                        }
                    });
                }
            });

            Object.entries(states.newObject || {}).forEach(([key, checked]) => {
                const checkbox = document.getElementById(key);
                const value = newObject[key];
                if (checkbox) {
                    checkbox.checked = checked;
                    if (value && value.style) {
                        value.style.display = checked ? 'block' : 'none';
                    }
                }
            });
        }

        function createCheckboxes(object) {
            const section = document.createElement('div');

            Object.keys(object).forEach((key) => {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = key;
                checkbox.checked = true;

                const checkboxLabel = document.createElement('label');
                checkboxLabel.htmlFor = key;
                checkboxLabel.innerText = key;

                checkbox.addEventListener('change', () => {
                    const value = object[key];
                    if (Array.isArray(value)) {
                        value.forEach((el) => {
                            if (el && el.style) {
                                el.style.display = checkbox.checked ? 'block' : 'none';
                            }
                        });
                    } else if (value && value.style) {
                        value.style.display = checkbox.checked ? 'block' : 'none';
                    }
                    saveCheckboxStates();
                });

                section.appendChild(checkbox);
                section.appendChild(checkboxLabel);
                section.appendChild(document.createElement('br'));
            });

            container.appendChild(section);
        }

        createCheckboxes(resultObject);
        createCheckboxes(newObject);
        loadCheckboxStates();
    }

    observePage();
})();