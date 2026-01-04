// ==UserScript==
// @name         Salescenter - filtr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Dodaje pole do filtrowania ofert po ID produktu na stronie asortymentu Allegro
// @author       Paweł Kaczmarek
// @match        https://salescenter.allegro.com/my-assortment*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543410/Salescenter%20-%20filtr.user.js
// @updateURL https://update.greasyfork.org/scripts/543410/Salescenter%20-%20filtr.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    function createFilterPanel(table) {
        if (document.getElementById('allegro-id-filter-panel') || document.getElementById('allegro-vsearch-btn')) return;

        const vSearchBtn = document.createElement('button');
        vSearchBtn.id = 'allegro-vsearch-btn';
        vSearchBtn.innerText = 'vSearch';
        vSearchBtn.style.position = 'absolute';
        vSearchBtn.style.top = '10px';
        vSearchBtn.style.right = '30px';
        vSearchBtn.style.zIndex = '10001';
        vSearchBtn.style.background = '#23272e';
        vSearchBtn.style.color = '#fff';
        vSearchBtn.style.border = 'none';
        vSearchBtn.style.padding = '8px 18px';
        vSearchBtn.style.fontSize = '16px';
        vSearchBtn.style.borderRadius = '8px';
        vSearchBtn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
        vSearchBtn.style.cursor = 'pointer';
        vSearchBtn.style.letterSpacing = '1px';
        vSearchBtn.style.fontWeight = 'bold';
        vSearchBtn.style.transition = 'background 0.2s';
        vSearchBtn.onmouseenter = () => vSearchBtn.style.background = '#ff5a00';
        vSearchBtn.onmouseleave = () => vSearchBtn.style.background = '#23272e';

        vSearchBtn.onclick = function() {
            vSearchBtn.style.display = 'none';
            panel.style.display = 'flex';
            setTimeout(() => input.focus(), 100);
        };
        table.parentElement.style.position = 'relative';
        table.parentElement.insertBefore(vSearchBtn, table);

        const panel = document.createElement('div');
        panel.id = 'allegro-id-filter-panel';
        panel.style.background = '#23272e';
        panel.style.border = '1px solid #ff5a00';
        panel.style.padding = '18px 24px';
        panel.style.margin = '16px 0';
        panel.style.marginTop = '60px';
        panel.style.borderRadius = '12px';
        panel.style.display = 'none';
        panel.style.alignItems = 'center';
        panel.style.gap = '16px';
        panel.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
        panel.style.position = 'relative';
        panel.style.zIndex = '10000';
        panel.style.removeProperty('max-width');
        panel.style.minWidth = '340px';
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '✕';
        closeBtn.title = 'Zamknij';
        closeBtn.style.position = 'absolute';
        closeBtn.style.top = '2px'; // wyżej
        closeBtn.style.right = '2px'; // bardziej w prawo
        closeBtn.style.background = 'transparent';
        closeBtn.style.color = '#fff';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '22px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.fontWeight = 'bold';
        closeBtn.style.padding = '4px 8px';
        closeBtn.onmouseenter = () => closeBtn.style.color = '#ff5a00';
        closeBtn.onmouseleave = () => closeBtn.style.color = '#fff';
        closeBtn.onclick = function() {
            panel.style.display = 'none';
            vSearchBtn.style.display = 'inline-block';
        };
        panel.appendChild(closeBtn);

        const label = document.createElement('label');
        label.innerText = 'Filtruj ID/SKU produktu:';
        label.style.fontWeight = 'bold';
        label.style.marginRight = '8px';
        label.style.color = '#fff';
        label.htmlFor = 'allegro-id-filter-input';

        const input = document.createElement('input');
        input.type = 'text';
        input.id = 'allegro-id-filter-input';
        input.placeholder = 'np. 1772318739, SKU1234';
        input.title = 'np. 1772318739, SKU1234';
        input.style.padding = '10px 16px';
        input.style.fontSize = '18px';
        input.style.border = '1px solid #ff5a00';
        input.style.borderRadius = '6px';
        input.style.flex = '1';
        input.style.background = '#181a1f';
        input.style.color = '#fff';
        input.style.outline = 'none';
        input.onfocus = () => input.style.border = '1.5px solid #ff5a00';
        input.onblur = () => input.style.border = '1px solid #ff5a00';

        const button = document.createElement('button');
        button.innerText = 'Filtruj';
        button.style.background = '#ff5a00';
        button.style.color = '#fff';
        button.style.border = 'none';
        button.style.padding = '10px 28px';
        button.style.fontSize = '14px';
        button.style.borderRadius = '6px';
        button.style.cursor = 'pointer';
        button.style.marginLeft = '8px';
        button.style.fontWeight = 'bold';
        button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.10)';
        button.onmouseenter = () => button.style.background = '#23272e';
        button.onmouseleave = () => button.style.background = '#ff5a00';
        const reset = document.createElement('button');
        reset.innerText = 'Pokaż wszystko';
        reset.style.background = '#444';
        reset.style.color = '#fff';
        reset.style.border = 'none';
        reset.style.padding = '10px 18px';
        reset.style.fontSize = '14px';
        reset.style.borderRadius = '6px';
        reset.style.cursor = 'pointer';
        reset.style.marginLeft = '8px';
        reset.style.fontWeight = 'bold';
        reset.onmouseenter = () => reset.style.background = '#ff5a00';
        reset.onmouseleave = () => reset.style.background = '#444';
        panel.appendChild(label);
        panel.appendChild(input);
        panel.appendChild(button);
        panel.appendChild(reset);
        table.parentElement.insertBefore(panel, table);
        const selectAllDiv = document.createElement('div');
        selectAllDiv.style.display = 'flex';
        selectAllDiv.style.alignItems = 'center';
        selectAllDiv.style.gap = '8px';
        selectAllDiv.style.margin = '0 0 8px 0';
        selectAllDiv.style.fontSize = '15px';
        selectAllDiv.style.fontWeight = 'bold';
        selectAllDiv.style.color = '#fff';
        selectAllDiv.style.background = 'transparent';
        selectAllDiv.style.userSelect = 'none';

        const selectAllCheckbox = document.createElement('input');
        selectAllCheckbox.type = 'checkbox';
        selectAllCheckbox.id = 'allegro-select-all-visible';
        selectAllCheckbox.style.width = '18px';
        selectAllCheckbox.style.height = '18px';
        selectAllCheckbox.style.cursor = 'pointer';
        selectAllCheckbox.style.accentColor = '#ff5a00';
        selectAllCheckbox.style.margin = '0';

        const selectAllLabel = document.createElement('label');
        selectAllLabel.innerText = 'zaznacz wyszukane';
        selectAllLabel.htmlFor = 'allegro-select-all-visible';
        selectAllLabel.style.cursor = 'pointer';

        selectAllDiv.appendChild(selectAllCheckbox);
        selectAllDiv.appendChild(selectAllLabel);
        table.parentElement.insertBefore(selectAllDiv, table);
        function setVisibleCheckboxes(checked) {
            const tbody = table.querySelector('tbody');
            if (!tbody) return;
            Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
                if (tr.style.display === 'none') return;
                const td = tr.querySelector('td');
                if (!td) return;
                const input = td.querySelector('input[type="checkbox"]');
                if (input && !input.disabled) {
                    if (input.checked !== checked) {
                        input.click(); 
                    }
                }
            });
        }
        selectAllCheckbox.addEventListener('change', function() {
            setVisibleCheckboxes(this.checked);
        });
        function resetSelectAllCheckbox() {
            selectAllCheckbox.checked = false;
        }

        function filterRows() {
            const val = input.value.trim();
            if (!val) {
                showAllRows(table);
                resetSelectAllCheckbox();
                return;
            }
            const filters = val.replace(/\s+/g, ',').split(',').map(x => x.trim()).filter(Boolean);
            filterTableByIdsOrSku(table, filters);
            resetSelectAllCheckbox();
        }

        button.onclick = filterRows;
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') filterRows();
        });
        input.addEventListener('input', debounce(filterRows, 500));
        reset.onclick = function () {
            input.value = '';
            showAllRows(table);
        };
    }

    function showAllRows(table) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
            tr.style.display = '';
        });
    }
    function filterTableByIds(table, ids) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        const idSet = new Set(ids);
        Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
            const hasDataCy = tr.hasAttribute('data-cy');
            const idCell = tr.querySelector('span._b4f97_bk6uO');
            if (!hasDataCy && !idCell) {
                return;
            }
            let id = idCell ? idCell.innerText.trim() : null;
            if (!id && hasDataCy) {
                id = tr.getAttribute('data-cy');
            }
            if (!id) {
                tr.style.display = 'none';
                return;
            }
            if (idSet.has(id)) {
                tr.style.display = '';
            } else {
                tr.style.display = 'none';
            }
        });
    }
    function filterTableByIdsOrSku(table, filters) {
        const tbody = table.querySelector('tbody');
        if (!tbody) return;
        Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
            // Ignoruj puste wiersze (np. z paddingiem na dole)
            const hasDataCy = tr.hasAttribute('data-cy');
            const idCells = tr.querySelectorAll('span._b4f97_bk6uO');
            if (!hasDataCy && idCells.length === 0) {
                return;
            }
            let id = null;
            if (hasDataCy) id = tr.getAttribute('data-cy');
            let sku = null;
            if (idCells.length > 1) {
                sku = idCells[1].innerText.trim();
            } else if (idCells.length === 1) {
                sku = idCells[0].innerText.trim();
            }
            let visible = false;
            for (const f of filters) {
                if ((id && id === f) || (sku && sku.toLowerCase().includes(f.toLowerCase()))) {
                    visible = true;
                    break;
                }
            }
            tr.style.display = visible ? '' : 'none';
        });
    }
    function tryInjectPanel() {
        const table = document.querySelector('table[aria-label="lista ofert"]');
        if (table) {
            createFilterPanel(table);
            // Dodajemy MutationObserver na <tbody> do dynamicznego filtrowania
            const tbody = table.querySelector('tbody');
            if (tbody && !tbody._allegroFilterObserver) {
                const observer = new MutationObserver(() => {
                    // Pobierz aktualne ID z inputa
                    const input = document.getElementById('allegro-id-filter-input');
                    if (!input) return;
                    const val = input.value.trim();
                    if (!val) {
                        showAllRows(table);
                        return;
                    }
                    const filters = val.replace(/\s+/g, ',').split(',').map(x => x.trim()).filter(Boolean);
                    filterTableByIdsOrSku(table, filters);
                });
                observer.observe(tbody, { childList: true, subtree: true });
                tbody._allegroFilterObserver = observer;
            }
        }
    }
    const observer = new MutationObserver(() => {
        tryInjectPanel();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('load', () => {
        setTimeout(tryInjectPanel, 1000);
    });
})();
