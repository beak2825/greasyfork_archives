// ==UserScript==
// @name         Azure DevOps In-Page Branch Author Filter
// @namespace    https://github.com/Rubenisme/Azure-DevOps-Branch-Author-Filter
// @version      2.4
// @description  Adds a native-looking, text-input to the Azure DevOps branches page to filter by author
// @author       Rubenisme
// @match        https://dev.azure.com/*/_git/*/branches*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543979/Azure%20DevOps%20In-Page%20Branch%20Author%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/543979/Azure%20DevOps%20In-Page%20Branch%20Author%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let activeFilterCleanup = null;

    /**
     * Manages the visibility of virtual list spacers.
     * @param {boolean} shouldBeVisible True to show spacers, false to hide them.
     */
    function setSpacerVisibility(shouldBeVisible) {
        const table = document.querySelector('table[aria-label="Branches table"]');
        if (table) {
            const spacers = table.querySelectorAll('tbody tr.bolt-list-row-spacer');
            spacers.forEach(spacer => {
                spacer.style.display = shouldBeVisible ? '' : 'none';
            });
        }
    }

    /**
     * The core filtering logic.
     * @param {string} targetAuthor The text to filter by.
     */
    function filterByAuthor(targetAuthor) {
        if (activeFilterCleanup) {
            activeFilterCleanup();
        }

        // --- FILTER IS BEING CLEARED ---
        if (!targetAuthor || typeof targetAuthor !== 'string' || targetAuthor.trim() === '') {
            setSpacerVisibility(true); // Show the spacers again
            return;
        }

        const table = document.querySelector('table[aria-label="Branches table"]');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        if (!tbody) return;

        // --- FILTER IS BEING APPLIED ---
        setSpacerVisibility(false); // Hide the spacers to prevent empty gaps

        const headers = table.querySelectorAll('thead th[data-column-index]');
        let authorColIndex = -1;
        headers.forEach(th => {
            if (th.innerText.trim() === 'Author') {
                authorColIndex = th.getAttribute('data-column-index');
            }
        });

        if (authorColIndex === -1) return;

        const applyFilterToRow = (row) => {
            if (!row.matches('tr.bolt-table-row')) return;
            const authorCell = row.querySelector(`td[data-column-index="${authorColIndex}"]`);
            if (!authorCell) return;
            const authorNameSpan = authorCell.querySelector('span.text-ellipsis');
            const currentAuthor = authorNameSpan ? authorNameSpan.innerText.trim() : '';

            if (currentAuthor.toLowerCase().includes(targetAuthor.toLowerCase())) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        };

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'TR') {
                        applyFilterToRow(node);
                    }
                });
            }
        });

        tbody.querySelectorAll('tr').forEach(applyFilterToRow);
        observer.observe(tbody, { childList: true });

        activeFilterCleanup = () => {
            observer.disconnect();
            if (tbody) {
                tbody.querySelectorAll('tr').forEach(row => row.style.display = '');
            }
            activeFilterCleanup = null;
        };
    }

    /**
     * Creates and injects the filter UI.
     */
    function injectFilterUI(filterBar) {
        const wrapperDiv = document.createElement("div");
        wrapperDiv.className = "flex-column flex-grow bolt-textfield-inline-tabbar-width";
        wrapperDiv.id = "userscript-author-filter-wrapper";
        wrapperDiv.style.marginLeft = "8px";

        const filterContainer = document.createElement("div");
        filterContainer.className = "bolt-text-filterbaritem flex-grow bolt-textfield flex-row flex-center focus-keyboard-only bolt-textfield-inline";

        const iconSpan = document.createElement("span");
        iconSpan.className = "fluent-icons-enabled";
        iconSpan.innerHTML = '<span aria-hidden="true" class="keyword-filter-icon prefix bolt-textfield-icon bolt-textfield-no-text flex-noshrink fabric-icon ms-Icon--Filter medium"></span>';

        const input = document.createElement("input");
        input.className = "bolt-text-filterbaritem-input bolt-textfield-input flex-grow bolt-textfield-input-with-prefix";
        input.placeholder = "Filter by author...";
        input.setAttribute('aria-label', 'Filter by author');
        input.type = "text";

        let debounceTimer;
        input.addEventListener('input', (event) => {
            clearTimeout(debounceTimer);
            const searchText = event.target.value;
            debounceTimer = setTimeout(() => {
                filterByAuthor(searchText);
            }, 500); // 500ms delay
        });

        filterContainer.appendChild(iconSpan);
        filterContainer.appendChild(input);
        wrapperDiv.appendChild(filterContainer);
        filterBar.appendChild(wrapperDiv);
    }

    /**
     * Main execution block.
     */
    const injectionInterval = setInterval(() => {
        const filterBar = document.querySelector(".bolt-inline-keyword-filter-bar");
        const alreadyInjected = document.getElementById("userscript-author-filter-wrapper");

        if (filterBar && !alreadyInjected) {
            clearInterval(injectionInterval);
            injectFilterUI(filterBar);
        }
    }, 500);

})();