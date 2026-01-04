// ==UserScript==
// @name         Buslog Table Sorter & Filter with Toggle
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Sort and filter buslog route collection table
// @author petabyte
// @match        https://busmiles.uk/buslog/*/routecollection
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541141/Buslog%20Table%20Sorter%20%20Filter%20with%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/541141/Buslog%20Table%20Sorter%20%20Filter%20with%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createFilterUI(operators, onChange) {
        if (document.getElementById('operator-filter-container')) return null;

        const wrapper = document.createElement('div');
        wrapper.id = 'operator-filter-wrapper';
        wrapper.style.marginBottom = '10px';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Hide Filter';
        toggleButton.style.marginBottom = '5px';
        toggleButton.style.padding = '5px 10px';
        toggleButton.style.cursor = 'pointer';
        toggleButton.style.border = '1px solid #ccc';
        toggleButton.style.borderRadius = '5px';
        toggleButton.style.backgroundColor = '#eee';
        toggleButton.style.fontSize = '14px';

        const container = document.createElement('div');
        container.id = 'operator-filter-container';
        container.style.marginTop = '5px';
        container.style.padding = '10px';
        container.style.border = '1px solid #ccc';
        container.style.backgroundColor = '#f9f9f9';
        container.style.borderRadius = '6px';

        toggleButton.addEventListener('click', () => {
            if (container.style.display === 'none') {
                container.style.display = '';
                toggleButton.textContent = 'Hide Filter';
            } else {
                container.style.display = 'none';
                toggleButton.textContent = 'Show Filter';
            }
        });

        const label = document.createElement('strong');
        label.textContent = 'Filter by operator: ';
        container.appendChild(label);

        operators.forEach(op => {
            const id = `filter-${op.replace(/\s+/g, '-')}`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = true;
            checkbox.id = id;
            checkbox.dataset.operator = op;

            checkbox.addEventListener('change', () => {
                const active = Array.from(container.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => cb.dataset.operator);
                onChange(active);
            });

            const lbl = document.createElement('label');
            lbl.htmlFor = id;
            lbl.style.marginRight = '10px';
            lbl.style.marginLeft = '5px';
            lbl.appendChild(document.createTextNode(op));

            container.appendChild(checkbox);
            container.appendChild(lbl);
        });

        wrapper.appendChild(toggleButton);
        wrapper.appendChild(container);
        return wrapper;
    }

    function makeSortableAndFilterable() {
        const table = document.querySelector("table.table");
        if (!table) return;

        const headers = table.querySelectorAll("thead th");
        const rows = Array.from(table.querySelectorAll("tbody tr"));
        const tbody = table.querySelector("tbody");

        let currentSortIndex = -1;
        let currentSortAsc = true;

        const operatorIndex = 0;
        const allOperators = Array.from(new Set(rows.map(row => row.children[operatorIndex].textContent.trim()))).sort();

        const filterUI = createFilterUI(allOperators, applyFilter);
        if (filterUI) {
            table.parentElement.insertBefore(filterUI, table);
        }

        let visibleOperators = new Set(allOperators);

        function applyFilter(activeOperators) {
            visibleOperators = new Set(activeOperators);
            renderRows();
        }

        function renderRows() {
            const filteredRows = rows.filter(row => {
                const op = row.children[operatorIndex].textContent.trim();
                return visibleOperators.has(op);
            });

            const sortedRows = [...filteredRows];

            if (currentSortIndex !== -1) {
                sortedRows.sort((a, b) => {
                    const tdA = a.children[currentSortIndex].textContent.trim();
                    const tdB = b.children[currentSortIndex].textContent.trim();

                    const numA = parseFloat(tdA.replace(/[^\d.]/g, ""));
                    const numB = parseFloat(tdB.replace(/[^\d.]/g, ""));
                    const isNumber = !isNaN(numA) && !isNaN(numB);

                    let compare;
                    if (isNumber) {
                        compare = numA - numB;
                    } else {
                        compare = tdA.localeCompare(tdB, undefined, { sensitivity: 'base' });
                    }

                    return currentSortAsc ? compare : -compare;
                });
            }

            tbody.innerHTML = '';
            sortedRows.forEach(row => tbody.appendChild(row));
        }

        headers.forEach((th, i) => {
            const span = document.createElement("span");
            span.style.marginLeft = "0.5em";
            th.appendChild(span);

            th.style.cursor = "pointer";
            th.addEventListener("click", () => {
                const isAsc = currentSortIndex === i ? !currentSortAsc : true;
                currentSortIndex = i;
                currentSortAsc = isAsc;

                headers.forEach((header, j) => {
                    header.querySelector("span").textContent = j === i ? (isAsc ? "▲" : "▼") : "";
                });

                renderRows();
            });
        });

        renderRows();
    }

    function waitForTable() {
        const observer = new MutationObserver(() => {
            const table = document.querySelector("table.table");
            if (table && !document.getElementById('operator-filter-wrapper')) {
                makeSortableAndFilterable();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("load", () => {
        waitForTable();
    });
})();
