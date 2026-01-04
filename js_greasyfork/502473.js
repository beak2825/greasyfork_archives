// ==UserScript==
// @name         ELIDŻIBILITY SUMMARY
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Tworzy tabelkę zliczającą ilość pickerów na danych ścieżkach
// @author       @nowaratn
// @match        https://fc-eligibility-website-dub.aka.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502473/ELID%C5%BBIBILITY%20SUMMARY.user.js
// @updateURL https://update.greasyfork.org/scripts/502473/ELID%C5%BBIBILITY%20SUMMARY.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elementsToInclude = JSON.parse(localStorage.getItem('elementsToInclude')) || [];
    let rowsToExclude = JSON.parse(localStorage.getItem('rowsToExclude')) || [];
    let detectedElements = new Set();

    function generateSummaryTable() {
        const elementCounts = {};
        const rows = document.querySelectorAll('tr');

        rows.forEach((row) => {
            const cells = row.children[4]?.querySelectorAll('.ng-binding');
            if (cells) {
                let shouldExcludeRow = false;
                let hasIncludedElement = false;

                cells.forEach((cell) => {
                    const text = cell.innerText.trim();
                    if (text && text != "PICKER ELIGIBILITIES") {
                        detectedElements.add(text);

                        if (rowsToExclude.includes(text)) {
                            shouldExcludeRow = true;
                        }

                        if (elementsToInclude.includes(text)) {
                            hasIncludedElement = true;
                            if (!shouldExcludeRow) {
                                if (elementCounts[text]) {
                                    elementCounts[text]++;
                                } else {
                                    elementCounts[text] = 1;
                                }
                            }
                        }
                    }
                });

                if (shouldExcludeRow && hasIncludedElement) {
                    Object.keys(elementCounts).forEach((key) => {
                        elementCounts[key]--;
                        if (elementCounts[key] === 0) {
                            delete elementCounts[key];
                        }
                    });
                }
            }
        });

        const summaryTable = document.createElement('div');
        summaryTable.id = 'summary-table';
        summaryTable.style.display = 'flex';
        summaryTable.style.border = '1px solid black';
        summaryTable.style.padding = '10px';
        summaryTable.style.marginBottom = '10px';
        summaryTable.style.flexWrap = 'wrap';

        const filterButtonContainer = document.createElement('div');
        filterButtonContainer.style.marginRight = '10px';

        const filterButton = document.createElement('button');
        filterButton.innerText = 'Filters';
        filterButton.onclick = showFilterMenu;
        filterButtonContainer.appendChild(filterButton);

        summaryTable.appendChild(filterButtonContainer);

        Object.keys(elementCounts).forEach((key) => {
            const container = document.createElement('div');
            container.style.border = '1px solid black';
            container.style.margin = '5px';
            container.style.padding = '5px';
            container.style.minWidth = '100px';
            container.style.textAlign = 'center';

            const elementText = document.createElement('div');
            elementText.innerText = key;

            const countText = document.createElement('div');
            countText.innerText = elementCounts[key];

            container.appendChild(elementText);
            container.appendChild(countText);

            summaryTable.appendChild(container);
        });

        return summaryTable;
    }

    function showFilterMenu() {
        let menu = document.getElementById('filter-menu');
        if (menu) {
            menu.remove();
        }

        menu = document.createElement('div');
        menu.id = 'filter-menu';
        menu.style.position = 'absolute';
        menu.style.top = '100px';
        menu.style.left = '100px';
        menu.style.padding = '10px';
        menu.style.border = '1px solid black';
        menu.style.backgroundColor = '#f0f0f0';
        menu.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        menu.style.zIndex = '1000';
        menu.style.width = 'auto';

        const header = document.createElement('div');
        header.style.cursor = 'move';
        header.style.padding = '5px';
        header.style.backgroundColor = '#ddd';
        header.style.borderBottom = '1px solid black';
        header.innerHTML = '&nbsp;';
        menu.appendChild(header);

        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        const headerRow = table.insertRow();
        const includeHeader = document.createElement('th');
        includeHeader.innerText = 'Podliczaj te ścieżki:';
        includeHeader.style.border = '1px solid black';
        includeHeader.style.padding = '5px';
        includeHeader.style.backgroundColor = '#ddd';
        headerRow.appendChild(includeHeader);

        const excludeHeader = document.createElement('th');
        excludeHeader.innerText = 'Ignoruj jeżeli Picker ma którekolwiek:';
        excludeHeader.style.border = '1px solid black';
        excludeHeader.style.padding = '5px';
        excludeHeader.style.backgroundColor = '#ddd';
        headerRow.appendChild(excludeHeader);

        detectedElements.forEach((element) => {
            const row = table.insertRow();

            // Include Elements column
            const includeCell = row.insertCell();
            includeCell.style.border = '1px solid black';
            includeCell.style.padding = '5px';

            const includeCheckbox = document.createElement('input');
            includeCheckbox.type = 'checkbox';
            includeCheckbox.checked = elementsToInclude.includes(element);
            includeCheckbox.onchange = () => toggleIncludeElement(element, includeCheckbox.checked);

            includeCell.appendChild(includeCheckbox);
            includeCell.appendChild(document.createTextNode(element));

            // Exclude Rows Containing column
            const excludeCell = row.insertCell();
            excludeCell.style.border = '1px solid black';
            excludeCell.style.padding = '5px';

            const excludeCheckbox = document.createElement('input');
            excludeCheckbox.type = 'checkbox';
            excludeCheckbox.checked = rowsToExclude.includes(element);
            excludeCheckbox.onchange = () => toggleExcludeElement(element, excludeCheckbox.checked);

            excludeCell.appendChild(excludeCheckbox);
            excludeCell.appendChild(document.createTextNode(element));
        });

        menu.appendChild(table);

        const saveButton = document.createElement('button');
        saveButton.innerText = 'Zapisz ustawienia';
        saveButton.style.marginTop = '10px';
        saveButton.onclick = saveSettings;
        menu.appendChild(saveButton);

        const closeButton = document.createElement('button');
        closeButton.innerText = 'Zamknij';
        closeButton.style.marginTop = '10px';
        closeButton.style.marginLeft = '10px';
        closeButton.onclick = () => menu.remove();
        menu.appendChild(closeButton);

        document.body.appendChild(menu);

        // Enable dragging
        let offsetX, offsetY;
        header.onmousedown = (e) => {
            e.preventDefault();
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            document.onmousemove = (e) => {
                e.preventDefault();
                menu.style.left = `${e.clientX - offsetX}px`;
                menu.style.top = `${e.clientY - offsetY}px`;
            };
            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    function toggleIncludeElement(element, isChecked) {
        if (isChecked) {
            elementsToInclude.push(element);
        } else {
            elementsToInclude = elementsToInclude.filter(item => item !== element);
        }
        refreshSummaryTable();
    }

    function toggleExcludeElement(element, isChecked) {
        if (isChecked) {
            rowsToExclude.push(element);
        } else {
            rowsToExclude = rowsToExclude.filter(item => item !== element);
        }
        refreshSummaryTable();
    }

    function saveSettings() {
        localStorage.setItem('elementsToInclude', JSON.stringify(elementsToInclude));
        localStorage.setItem('rowsToExclude', JSON.stringify(rowsToExclude));
        alert('Settings saved!');
    }

    function refreshSummaryTable() {
        const existingTable = document.getElementById('summary-table');
        if (existingTable) {
            existingTable.remove();
        }
        const targetElement = document.querySelector('.table.table-striped');
        if (targetElement) {
            const summaryTable = generateSummaryTable();
            targetElement.parentNode.insertBefore(summaryTable, targetElement);
        }
    }

    function waitForElement(selector, callback) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(() => {
                const element = document.querySelector(selector);
                if (element) {
                    callback(element);
                    observer.disconnect();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    waitForElement('.table.table-striped', () => {
        refreshSummaryTable();
    });

})();
