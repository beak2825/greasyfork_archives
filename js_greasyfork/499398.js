// ==UserScript==
// @name         メーカー在庫表を一括コピー
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  メーカーの在庫表を一括コピーできるボタンを右上に追加。（おまけ：重量情報を取得して表示）
// @license      MIT
// @match        https://detail.1688.com/offer/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/499398/%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%82%92%E4%B8%80%E6%8B%AC%E3%82%B3%E3%83%94%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/499398/%E3%83%A1%E3%83%BC%E3%82%AB%E3%83%BC%E5%9C%A8%E5%BA%AB%E8%A1%A8%E3%82%92%E4%B8%80%E6%8B%AC%E3%82%B3%E3%83%94%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    .copyButton {
        position: fixed;
        right: 10px;
        z-index: 1000;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-family: Arial, sans-serif;
        margin-bottom: 5px;
    }
    .concatButton {
        background-color: gray !important;
        color: white;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: Arial, sans-serif;
    }
    .concatButton.active {
        background-color: orange !important;
    }
    .checkboxList {
        position: fixed;
        top: 30px;
        right: 10px;
        background-color: white;
        border: 1px solid #ccc;
        padding: 20px;
        max-height: 90vh;
        overflow-y: auto;
        z-index: 2000;
        font-size: 15px;
        min-width: 230px;
    }
    .checkboxList button {
        margin-top: 10px;
        background-color: #28a745;
        color: white;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }
    .checkboxList .cancelButton {
        background-color: #dc3545;

        font-family: Arial, sans-serif;
    }
    .checkboxList label {
        display: block;
        margin-bottom: 5px;
        white-space: nowrap;
    }
    .button-container {
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        position: sticky;
        bottom: -20px;
        background-color: white;
        padding: 10px 0;
        border-top: 1px solid #ccc;
    }
    .selectButton {
        background-color: #007bff !important;
        color: white !important;
        padding: 5px 8px;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-family: Arial, sans-serif;
    }
    .ok-cancel-container {
        display: flex;
        justify-content: flex-end;
    }
`);

    let isConcatMode = false;

    function toggleConcatMode(button) {
        isConcatMode = !isConcatMode;
        button.classList.toggle('active', isConcatMode);
    }

    function showCheckboxList(columnTexts, callback) {
        let existingList = document.querySelector('.checkboxList');
        if (existingList) {
            document.body.removeChild(existingList);
        }

        const longestTextLength = Math.max(...columnTexts.map(text => text.length));
        const listWidth = Math.max(200, Math.min(600, longestTextLength * 21));

        const listContainer = document.createElement('div');
        listContainer.className = 'checkboxList';
        listContainer.style.width = `${listWidth}px`;

        columnTexts.forEach((text, index) => {
            const label = document.createElement('label');

            const number = document.createTextNode(`${index + 1}. `);

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.value = text;

            label.appendChild(number);
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(text));
            listContainer.appendChild(label);
        });

        const selectButton = document.createElement('button');
        selectButton.className = 'selectButton';
        selectButton.innerText = '全解除';

        selectButton.addEventListener('click', () => {
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

            checkboxes.forEach(checkbox => {
                checkbox.checked = !allChecked;
            });

            selectButton.innerText = allChecked ? '全選択' : '全解除';
        });

        listContainer.addEventListener('change', () => {
            const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
            selectButton.innerText = allChecked ? '全解除' : '全選択';
        });

        const concatButton = document.createElement('button');
        concatButton.className = "concatButton";
        concatButton.innerText = '連結';

        isConcatMode = false;
        concatButton.classList.remove('active');

        concatButton.addEventListener('click', () => {
            toggleConcatMode(concatButton);
        });

        const okButton = document.createElement('button');
        okButton.innerText = 'OK';

        okButton.addEventListener('click', () => {
            const selectedItems = Array.from(listContainer.querySelectorAll('input:checked')).map(checkbox => checkbox.value);
            cancelCheckboxList();
            callback(selectedItems);
        });

        const cancelButton = document.createElement('button');
        cancelButton.className = 'cancelButton';
        cancelButton.innerText = '✕';
        document.body.appendChild(cancelButton);

        let tooltipTimeout;
        let tooltip;

        cancelButton.addEventListener('dblclick', () => {
            clearTimeout(tooltipTimeout);
            cancelCheckboxList();
        });

        cancelButton.addEventListener('click', () => {
            clearTimeout(tooltipTimeout);
            tooltipTimeout = setTimeout(showTooltip, 300);
        });

        function showTooltip() {
            if (tooltip) {
                tooltip.remove();
            }

            tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerText = 'ダブルクリックかEscで閉じる';

            tooltip.style.position = 'absolute';
            tooltip.style.backgroundColor = '#333';
            tooltip.style.color = '#fff';
            tooltip.style.padding = '5px 10px';
            tooltip.style.borderRadius = '4px';
            tooltip.style.fontSize = '12px';
            tooltip.style.zIndex = '10001';
            tooltip.style.fontFamily = 'Arial, sans-serif';

            const buttonRect = cancelButton.getBoundingClientRect();
            const tooltipWidth = 120;

            let tooltipLeft = buttonRect.right + window.scrollX + 5;
            if (tooltipLeft + tooltipWidth > window.innerWidth) {
                tooltipLeft = buttonRect.left + window.scrollX - tooltipWidth - 5;
            }
            tooltip.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
            tooltip.style.left = `${tooltipLeft}px`;

            document.body.appendChild(tooltip);

            setTimeout(() => {
                if (tooltip) tooltip.remove();
            }, 2000);
        }

        const leftContainer = document.createElement('div');
        leftContainer.style.flex = '1';
        leftContainer.appendChild(selectButton);

        const rightContainer = document.createElement('div');
        rightContainer.style.display = 'flex';
        rightContainer.style.gap = '3px';
        rightContainer.appendChild(concatButton);
        rightContainer.appendChild(okButton);
        rightContainer.appendChild(cancelButton);

        const actionButtonsContainer = document.createElement('div');
        actionButtonsContainer.style.display = 'flex';
        actionButtonsContainer.style.justifyContent = 'space-between';
        actionButtonsContainer.style.position = 'sticky';
        actionButtonsContainer.style.bottom = '-30px';
        actionButtonsContainer.style.borderTop = '1px solid #ccc';
        actionButtonsContainer.style.paddingBottom = '20px';
        actionButtonsContainer.style.backgroundColor = '#ffffff';

        actionButtonsContainer.appendChild(leftContainer);
        actionButtonsContainer.appendChild(rightContainer);

        listContainer.appendChild(actionButtonsContainer);

        document.body.appendChild(listContainer);

        function handleEscKey(event) {
            if (event.key === 'Escape') {
                cancelCheckboxList();
            }
        }
        document.addEventListener('keydown', handleEscKey);

        function cancelCheckboxList() {
            document.body.removeChild(listContainer);
            document.removeEventListener('keydown', handleEscKey);
        }
    }

    function getUniqueItemCount(copyColumn) {
        const columnTexts = new Set();
        document.querySelectorAll(`.next-table .next-table-body .next-table-cell[data-next-table-col="${copyColumn}"]`).forEach(cell => {
            const text = cell.innerText.trim();
            if (text) {
                columnTexts.add(text);
            }
        });
        return columnTexts.size;
    }

    function addButtons() {
        const headers = document.querySelectorAll('.next-table .next-table-header-inner th .next-table-cell-wrapper');
        let priceColumnIndex = -1;
        headers.forEach((header, index) => {
            const headerText = header.innerText.trim();
            if (headerText.includes('价格')) {
                priceColumnIndex = index;
            }
        });

        let topPosition = 35;
        headers.forEach((header, index) => {
            const headerText = header.innerText.trim();
            if (index >= priceColumnIndex) {
                return;
            }

            const button = document.createElement('button');
            button.className = 'copyButton';
            button.style.top = `${topPosition}px`;
            button.innerText = `${headerText}をコピー（0件）`;
            document.body.appendChild(button);

            function updateButtonCount() {
                const itemCount = getUniqueItemCount(index);
                button.innerText = `${headerText}をコピー（${itemCount}件）`;
            }

            button.addEventListener('click', () => {
                const columnTexts = new Set();
                document.querySelectorAll(`.next-table .next-table-body .next-table-cell[data-next-table-col="${index}"]`).forEach(cell => {
                    const text = cell.innerText.trim();
                    if (text) {
                        columnTexts.add(text);
                    }
                });

                showCheckboxList(Array.from(columnTexts), selectedItems => {
                    const separator = isConcatMode ? '、' : '\n';
                    const textToCopy = selectedItems.join(separator);
                    GM_setClipboard(textToCopy);
                    button.innerText = `${selectedItems.length}件コピーしました`;

                    setTimeout(updateButtonCount, 2000);
                });

                setTimeout(updateButtonCount, 2000);
            });

            const observer = new MutationObserver(updateButtonCount);
            observer.observe(document.querySelector('.next-table .next-table-body'), { childList: true, subtree: true });

            updateButtonCount();
            topPosition += 50;
        });
    }

    addButtons();

    function initSecondScript() {
        let skuButton, propButton, bulkButton;

        GM_addStyle(`
            .bulkCopyButton {
                position: fixed;
                right: 10px;
                z-index: 1000;
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                font-family: Arial, sans-serif;
                margin-bottom: 5px;
            }
        `);

        function createButton(id, className, display = 'none') {
            const button = document.createElement("button");
            button.id = id;
            button.className = className;
            button.style.display = display;
            document.body.appendChild(button);
            return button;
        }

        function toggleConcatMode(button) {
            isConcatMode = !isConcatMode;
            button.classList.toggle('active', isConcatMode);
        }

        function showCheckboxList(columnTexts, callback) {
            let existingList = document.querySelector('.checkboxList');
            if (existingList) {
                document.body.removeChild(existingList);
            }

            const longestTextLength = Math.max(...columnTexts.map(text => text.length));
            const listWidth = Math.max(200, Math.min(600, longestTextLength * 21));

            const listContainer = document.createElement('div');
            listContainer.className = 'checkboxList';
            listContainer.style.width = `${listWidth}px`;

            columnTexts.forEach((text, index) => {
                const label = document.createElement('label');

                const number = document.createTextNode(`${index + 1}. `);

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.value = text;

                label.appendChild(number);
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(text));
                listContainer.appendChild(label);
            });

            const selectButton = document.createElement('button');
            selectButton.className = 'selectButton';
            selectButton.innerText = '全解除';

            selectButton.addEventListener('click', () => {
                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);

                checkboxes.forEach(checkbox => {
                    checkbox.checked = !allChecked;
                });

                selectButton.innerText = allChecked ? '全選択' : '全解除';
            });

            listContainer.addEventListener('change', () => {
                const checkboxes = listContainer.querySelectorAll('input[type="checkbox"]');
                const allChecked = Array.from(checkboxes).every(checkbox => checkbox.checked);
                selectButton.innerText = allChecked ? '全解除' : '全選択';
            });

            const concatButton = document.createElement('button');
            concatButton.className = "concatButton";
            concatButton.innerText = '連結';

            isConcatMode = false;
            concatButton.classList.remove('active');

            concatButton.addEventListener('click', () => {
                toggleConcatMode(concatButton);
            });

            const okButton = document.createElement('button');
            okButton.innerText = 'OK';

            okButton.addEventListener('click', () => {
                const selectedItems = Array.from(listContainer.querySelectorAll('input:checked')).map(checkbox => checkbox.value);
                cancelCheckboxList();
                callback(selectedItems);
            });

            const cancelButton = document.createElement('button');
            cancelButton.className = 'cancelButton';
            cancelButton.innerText = '✕';
            document.body.appendChild(cancelButton);

            let tooltipTimeout;
            let tooltip;

            cancelButton.addEventListener('dblclick', () => {
                clearTimeout(tooltipTimeout);
                cancelCheckboxList();
            });

            cancelButton.addEventListener('click', () => {
                clearTimeout(tooltipTimeout);
                tooltipTimeout = setTimeout(showTooltip, 300);
            });

            function showTooltip() {
                if (tooltip) {
                    tooltip.remove();
                }

                tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.innerText = 'ダブルクリックかEscで閉じる';

                tooltip.style.position = 'absolute';
                tooltip.style.backgroundColor = '#333';
                tooltip.style.color = '#fff';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '12px';
                tooltip.style.zIndex = '10001';
                tooltip.style.fontFamily = 'Arial, sans-serif';

                const buttonRect = cancelButton.getBoundingClientRect();
                const tooltipWidth = 120;

                let tooltipLeft = buttonRect.right + window.scrollX + 5;
                if (tooltipLeft + tooltipWidth > window.innerWidth) {
                    tooltipLeft = buttonRect.left + window.scrollX - tooltipWidth - 5;
                }
                tooltip.style.top = `${buttonRect.bottom + window.scrollY + 5}px`;
                tooltip.style.left = `${tooltipLeft}px`;

                document.body.appendChild(tooltip);

                setTimeout(() => {
                    if (tooltip) tooltip.remove();
                }, 2000);
            }

            const leftContainer = document.createElement('div');
            leftContainer.style.flex = '1';
            leftContainer.appendChild(selectButton);

            const rightContainer = document.createElement('div');
            rightContainer.style.display = 'flex';
            rightContainer.style.gap = '3px';
            rightContainer.appendChild(concatButton);
            rightContainer.appendChild(okButton);
            rightContainer.appendChild(cancelButton);

            const actionButtonsContainer = document.createElement('div');
            actionButtonsContainer.style.display = 'flex';
            actionButtonsContainer.style.justifyContent = 'space-between';
            actionButtonsContainer.style.position = 'sticky';
            actionButtonsContainer.style.bottom = '-30px';
            actionButtonsContainer.style.borderTop = '1px solid #ccc';
            actionButtonsContainer.style.paddingBottom = '20px';
            actionButtonsContainer.style.backgroundColor = '#ffffff';

            actionButtonsContainer.appendChild(leftContainer);
            actionButtonsContainer.appendChild(rightContainer);

            listContainer.appendChild(actionButtonsContainer);

            document.body.appendChild(listContainer);

            function handleEscKey(event) {
                if (event.key === 'Escape') {
                    cancelCheckboxList();
                }
            }
            document.addEventListener('keydown', handleEscKey);

            function cancelCheckboxList() {
                document.body.removeChild(listContainer);
                document.removeEventListener('keydown', handleEscKey);
            }
        }

        function initButtons() {
            let topPosition = 35;

            skuButton = createButton("skuCopyButton", "copyButton");
            propButton = createButton("propCopyButton", "copyButton");

            if (skuButton) {
                skuButton.style.top = `${topPosition}px`;
                topPosition += 50;
            }

            if (propButton) {
                propButton.style.top = `${topPosition}px`;
                topPosition += 50;
            }

            bulkButton = createButton("bulkCopyButton", "bulkCopyButton", "block");
            bulkButton.style.top = `${topPosition}px`;
            topPosition += 50;

            function updateButtonText() {
                let propNames = document.querySelectorAll(".sku-prop-module-name");
                if (propNames.length === 0) {
                    propNames = document.querySelectorAll(".sku-selector-name");
                }
                const propTexts = Array.from(propNames).map(el => el.textContent.trim());

                let skuItems = document.querySelectorAll(".sku-item-name");
                if (skuItems.length === 0) {
                    skuItems = document.querySelectorAll(".sku-item-name-text");
                }
                let propItems = document.querySelectorAll(".prop-name");
                if (propItems.length === 0) {
                    propItems = document.querySelectorAll(".prop-item-text");
                }

                let topPosition = 35;

                if (propTexts.length >= 2) {
                    const uniquePropItems = Array.from(new Set(Array.from(propItems).map(item => item.textContent.trim()).filter(text => text)));
                    const uniqueSkuItems = Array.from(new Set(Array.from(skuItems).map(item => item.textContent.trim()).filter(text => text)));

                    skuButton.innerText = `${propTexts[0]}をコピー（${uniquePropItems.length}件）`;
                    propButton.innerText = `${propTexts[1]}をコピー（${uniqueSkuItems.length}件）`;
                    skuButton.style.top = `${topPosition}px`;
                    skuButton.style.display = "block";
                    topPosition += 50;
                    propButton.style.top = `${topPosition}px`;
                    propButton.style.display = "block";
                    topPosition += 50;
                } else {
                    skuButton.style.display = "none";
                    propButton.style.display = "none";
                }

                const totalUniqueItems = new Set([...propItems, ...skuItems].map(item => item.textContent.trim()).filter(text => text)).size;
                bulkButton.innerText = `一括コピー（${totalUniqueItems}件）`;
                bulkButton.style.top = `${topPosition}px`;
            }

            function copyItems(items, button) {
                const uniqueItems = Array.from(new Set(Array.from(items).map(item => item.textContent.trim()).filter(text => text)));
                if (uniqueItems.length > 0) {
                    showCheckboxList(uniqueItems, selectedItems => {
                        const separator = isConcatMode ? '、' : '\n';
                        const textToCopy = selectedItems.join(separator);
                        GM_setClipboard(textToCopy);
                        button.innerText = `${selectedItems.length}件コピーしました`;

                        setTimeout(updateButtonText, 2000);
                    });
                }
            }

            skuButton.addEventListener("click", () => {
                copyItems(document.querySelectorAll(".prop-name, .prop-item-text"), skuButton);
            });

            propButton.addEventListener("click", () => {
                copyItems(document.querySelectorAll(".sku-item-name, .sku-item-name-text"), propButton);
            });

            bulkButton.addEventListener("click", () => {
                const skuItems = document.querySelectorAll(".sku-item-name, .sku-item-name-text");
                const propItems = document.querySelectorAll(".prop-name, .prop-item-text");

                const uniqueSkuItems = Array.from(new Set(Array.from(skuItems).map(item => item.textContent.trim()).filter(text => text)));
                const uniquePropItems = Array.from(new Set(Array.from(propItems).map(item => item.textContent.trim()).filter(text => text)));

                showCheckboxList([...uniquePropItems, ...uniqueSkuItems], selectedItems => {
                    const separator = isConcatMode ? '、' : '\n';
                    const textToCopy = selectedItems.join(separator);
                    GM_setClipboard(textToCopy);
                    bulkButton.innerText = `${selectedItems.length}件コピーしました`;

                    setTimeout(updateButtonText, 2000);
                });
            });

            const debouncedUpdateButtonText = debounce(updateButtonText, 500);
            const observer = new MutationObserver(debouncedUpdateButtonText);
            observer.observe(document.body, { childList: true, subtree: true });

            updateButtonText();
        }

        function debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        }

        initButtons();
    }

    window.addEventListener('load', () => {
        const specElement = Array.from(document.querySelectorAll('.next-table .next-table-header-inner th .next-table-cell-wrapper')).find(el => el.textContent.includes('(元)'));
        if (specElement) {
            addButtons();
        } else {
            initSecondScript();
        }
    });

    const style = `
        #weight-display {
            position: fixed;
            bottom: 160px;
            right: 20px;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #ddd;
            padding: 10px;
            font-size: 14px;
            font-family: Arial, sans-serif;
            z-index: 1999;
            text-align: center;
            white-space: pre-line;
        }
        #help-button {
            position: fixed;
            bottom: 205px;
            right: 21px;
            font-size: 12px;
            font-family: Arial, sans-serif;
            cursor: pointer;
            z-index: 10000;
            text-decoration: none;
        }
        #help-button:hover {
            color: #0056b3;
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = style;
    document.head.appendChild(styleSheet);

    function findWeightColumnIndex() {
        const headerCells = document.querySelectorAll('.od-pc-offer-table thead tr th');
        for (let i = 0; i < headerCells.length; i++) {
            if (headerCells[i].textContent.trim() === '重量(g)') {
                return i;
            }
        }
        return -1;
    }

    function fetchAllWeightInfo(columnIndex) {
        if (columnIndex === -1) return [];
        const weightCells = document.querySelectorAll(`.od-pc-offer-table tbody tr td:nth-child(${columnIndex + 1})`);
        const weights = Array.from(weightCells).map(cell => {
            const weight = cell.getAttribute('title') || cell.textContent.trim();
            return parseFloat(weight);
        }).filter(value => !isNaN(value));
        return weights;
    }

    function calculateMinMax(weights) {
        if (weights.length === 0) return null;
        const min = Math.min(...weights);
        const max = Math.max(...weights);
        return { min, max };
    }

    const displayDiv = document.createElement('div');
    displayDiv.id = 'weight-display';
    displayDiv.textContent = '重量情報を取得中...';

    const helpButton = document.createElement('div');
    helpButton.id = 'help-button';
    helpButton.textContent = '？';
    helpButton.title = '※この情報はページ下部から取得している情報です。\n　情報が別の場所にある場合は取得できません。';

    document.body.appendChild(helpButton);
    document.body.appendChild(displayDiv);

    function updateWeightDisplay() {
        observer.disconnect();

        const columnIndex = findWeightColumnIndex();
        if (columnIndex !== -1) {
            const weights = fetchAllWeightInfo(columnIndex);
            const range = calculateMinMax(weights);
            if (range) {
                if (range.min === range.max) {
                    displayDiv.textContent = `重量(g)\n${range.min}`;
                } else {
                    displayDiv.textContent = `重量(g)\n${range.min} ～ ${range.max}`;
                }
            } else {
                displayDiv.textContent = '重量不明';
            }
        } else {
            displayDiv.textContent = '重量不明';
        }

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.target !== displayDiv) {
                updateWeightDisplay();
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    updateWeightDisplay();
})();