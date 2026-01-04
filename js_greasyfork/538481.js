// ==UserScript==
// @name         Torn - Big Al's Gun Shop Auto Selector
// @namespace    duck.wowow
// @version      0.1
// @description  Adds a UI to auto select items to sell and includes a filter to keep the top quality item/s for each of the selected items. Works on PDA.
// @author       Baccy
// @match        https://www.torn.com/bigalgunshop.php
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538481/Torn%20-%20Big%20Al%27s%20Gun%20Shop%20Auto%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/538481/Torn%20-%20Big%20Al%27s%20Gun%20Shop%20Auto%20Selector.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const interval = setInterval(() => {
        const element = document.querySelector('div.sell-items-wrap');
        if (!element) return;

        clearInterval(interval);

        const container = document.createElement('div');
        container.style.cssText = `
            border: 1px solid #444;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #1e1e1e;
            color: #f0f0f0;
            border-radius: 8px;
        `;

        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = 'Find Items';
        toggleBtn.style.cssText = `
            margin-right: 10px;
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        `;

        const selectBtn = document.createElement('button');
        selectBtn.textContent = 'Select Items';
        selectBtn.style.cssText = `
            margin-right: 10px;
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
        `;

        const skipInput = document.createElement('input');
        skipInput.type = 'text';
        skipInput.value = '0';
        skipInput.placeholder = 'Skip top';
        skipInput.style.cssText = `
            width: 60px;
            background-color: #222;
            color: #fff;
            border: 1px solid #555;
            padding: 6px 4px;
            border-radius: 4px;
        `;

        const itemListContainer = document.createElement('div');
        itemListContainer.style.cssText = `
            margin-top: 10px;
            color: #ddd;
        `;

        container.appendChild(toggleBtn);
        container.appendChild(selectBtn);
        container.appendChild(skipInput);
        container.appendChild(itemListContainer);
        element.parentElement.insertBefore(container, element);

        let itemMap = new Map();

        toggleBtn.addEventListener('click', () => {
            itemMap.clear();
            itemListContainer.innerHTML = '';

            const itemssec = document.querySelector('.sell-items-wrap');
            const choices = itemssec.querySelectorAll('div.choice-container');

            choices.forEach((choice) => {
                const liParent = choice.parentElement.parentElement;
                const nameElem = liParent.querySelector('span.name') || liParent.querySelector('label span');
                const imgElem = liParent.querySelector('img');
                const valueElem = liParent.querySelector('li.value');
                const valueText = valueElem ? valueElem.textContent.trim() : 'Unknown';

                if (nameElem) {
                    const name = nameElem.textContent.trim();
                    if (!itemMap.has(name)) {
                        itemMap.set(name, {
                            name,
                            imgSrc: imgElem ? imgElem.src : null,
                            value: valueText
                        });
                    }
                }
            });

            itemMap.forEach((item, name) => {
                const wrapper = document.createElement('label');
                wrapper.style.display = 'block';
                wrapper.style.cursor = 'pointer';
                wrapper.style.margin = '5px 0';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.dataset.itemName = name;

                if (item.imgSrc) {
                    const img = document.createElement('img');
                    img.src = item.imgSrc;
                    img.style.width = '24px';
                    img.style.height = '24px';
                    img.style.verticalAlign = 'middle';
                    img.style.marginRight = '8px';
                    wrapper.appendChild(img);
                }

                const span = document.createElement('span');
                span.textContent = `${name} (${item.value})`;
                span.style.marginLeft = '5px';

                wrapper.appendChild(checkbox);
                wrapper.appendChild(span);
                itemListContainer.appendChild(wrapper);
            });
        });

        selectBtn.addEventListener('click', () => {
            const skipCount = parseInt(skipInput.value, 10) || 0;

            const selectedNames = Array.from(itemListContainer.querySelectorAll('input[type="checkbox"]:checked'))
                .map(cb => cb.dataset.itemName);

            if (selectedNames.length === 0) return;

            const itemssec = document.querySelector('.sell-items-wrap');
            const choices = Array.from(itemssec.querySelectorAll('div.choice-container'));

            const itemSkippedCounts = {};
            let selectedCount = 0;

            choices.forEach((choice) => {
                const liParent = choice.parentElement.parentElement;
                const nameElem = liParent.querySelector('span.name') || liParent.querySelector('label span');

                if (nameElem) {
                    const name = nameElem.textContent.trim();

                    if (selectedNames.includes(name)) {
                        itemSkippedCounts[name] = itemSkippedCounts[name] || 0;

                        if (itemSkippedCounts[name] < skipCount) {
                            itemSkippedCounts[name]++;
                            return;
                        }

                        const input = choice.querySelector('input[type="checkbox"]');
                        if (input && !input.checked) {
                            input.checked = true;
                            input.value = "1";
                            input.setAttribute("name", "amount");
                            input.classList.add('checked');

                            input.dispatchEvent(new Event('input', { bubbles: true }));
                            input.dispatchEvent(new Event('change', { bubbles: true }));
                            input.dispatchEvent(new Event('click', { bubbles: true }));

                            selectedCount++;
                        }
                    }
                }
            });

            if (selectedCount > 0) {
                const $sellBtn = window.jQuery('.sell-act .sell .torn-btn');
                $sellBtn.prop('disabled', false);
            }
        });

    }, 300);
})();
