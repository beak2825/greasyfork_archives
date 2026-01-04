// ==UserScript==
// @name         Yandex Tracker Customizer
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Colors agile-column-header elements, adjusts table cell widths, styles specific columns, styles bubble text, and reorders specific sidebar list by data-id in Yandex Tracker
// @author       Grok
// @match        https://tracker.yandex.ru/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536946/Yandex%20Tracker%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/536946/Yandex%20Tracker%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Coloring: Status-to-color mapping for agile-column-header
    const statusColors = {
        'Новый': '#E8F5E9',
        'Требуется информация': '#EBF5FB',
        'Приостановлено': '#FDEDEC',
        'Будем делать': '#FFCA28',
        'В работе': '#FF7043',
        'На проверку': '#4FC3F7',
        'Нужна доделка': '#FF8A65'
    };

    // Table Styles: Class-to-style mapping for th and td
    const tableStyles = {
        'gt-table__header-cell_id_summary': {
            width: '364px',
            minWidth: '364px',
            maxWidth: '364px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_summary': {
            width: '364px',
            minWidth: '364px',
            maxWidth: '364px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_updated': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_updated': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_status': {
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_status': {
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_author': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_author': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_assignee': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_assignee': {
            width: '119px',
            minWidth: '119px',
            maxWidth: '119px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_67e6a29adfa7655cd4066e89--assignedAPerformer': {
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_67e6a29adfa7655cd4066e89--assignedAPerformer': {
            width: '120px',
            minWidth: '120px',
            maxWidth: '120px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_priority': {
            width: '30px',
            minWidth: '30px',
            maxWidth: '30px',
            paddingLeft: '4px',
            paddingRight: '4px',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_priority': {
            width: '30px',
            minWidth: '30px',
            maxWidth: '30px',
            paddingLeft: '4px',
            paddingRight: '4px',
            whiteSpace: 'nowrap'
        },
        'gt-table__header-cell_id_type': {
            width: '30px',
            minWidth: '30px',
            maxWidth: '30px',
            paddingLeft: '4px',
            paddingRight: '4px',
            whiteSpace: 'nowrap'
        },
        'gt-table__cell_id_type': {
            width: '30px',
            minWidth: '30px',
            maxWidth: '30px',
            paddingLeft: '4px',
            paddingRight: '4px',
            whiteSpace: 'nowrap'
        }
    };

    // Debounce utility to limit function calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Function to set table-layout: fixed on tables
    function setTableLayout() {
        console.log('Setting table layout...');
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (table.style.tableLayout !== 'fixed') {
                table.style.tableLayout = 'fixed';
                console.log('Set table-layout: fixed on table:', table);
            }
        });
    }

    // Function to style columns with specific headers
    function styleSpecialColumns() {
        console.log('Checking for columns to style...');
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            const headers = table.querySelectorAll('th');
            headers.forEach(th => {
                const span = th.querySelector('span.entity-table__cell-text');
                if (span) {
                    const spanText = span.textContent.trim();
                    if (spanText === 'Вернуться к задаче') {
                        const colIndex = th.cellIndex;
                        console.log(`Found header "Вернуться к задаче" in table at column index ${colIndex}`);
                        const rows = table.querySelectorAll('tbody tr');
                        rows.forEach(row => {
                            const cell = row.cells[colIndex];
                            if (cell && cell.tagName.toLowerCase() === 'td' && cell.style.fontWeight !== 'bold') {
                                cell.style.fontWeight = 'bold';
                                console.log(`Bolded cell in column ${colIndex}:`, cell);
                            }
                        });
                    } else if (spanText === 'Дедлайн') {
                        const colIndex = th.cellIndex;
                        console.log(`Found header "Дедлайн" in table at column index ${colIndex}`);
                        const rows = table.querySelectorAll('tbody tr');
                        rows.forEach(row => {
                            const cell = row.cells[colIndex];
                            if (cell && cell.tagName.toLowerCase() === 'td' && (cell.style.fontWeight !== 'bold' || cell.style.color !== 'red')) {
                                cell.style.fontWeight = 'bold';
                                cell.style.color = 'red';
                                console.log(`Styled cell in column ${colIndex} (bold, red):`, cell);
                            }
                        });
                    }
                }
            });
        });
    }

    // Function to style Bubble-Text in specific li elements
    function styleBubbleText() {
        console.log('Checking for Bubble-Text to style...');
        const listItems = document.querySelectorAll('li.FieldView_type_date');
        listItems.forEach(li => {
            const titleDiv = li.querySelector('div.FieldView-Title');
            if (titleDiv) {
                const titleText = titleDiv.textContent.trim();
                const titleAttr = titleDiv.getAttribute('title');
                if (titleText === 'Вернуться к задаче' && titleAttr === 'Вернуться к задаче') {
                    const bubbleText = li.querySelector('div.Bubble-Text.Bubble-Text_align_start');
                    if (bubbleText && bubbleText.style.fontWeight !== 'bold') {
                        bubbleText.style.fontWeight = 'bold';
                        console.log(`Bolded Bubble-Text for "Вернуться к задаче" in li:`, bubbleText);
                    }
                } else if (titleText === 'Дедлайн' && titleAttr === 'Дедлайн') {
                    const bubbleText = li.querySelector('div.Bubble-Text.Bubble-Text_align_start');
                    if (bubbleText && (bubbleText.style.fontWeight !== 'bold' || bubbleText.style.color !== 'red')) {
                        bubbleText.style.fontWeight = 'bold';
                        bubbleText.style.color = 'red';
                        console.log(`Styled Bubble-Text for "Дедлайн" (bold, red) in li:`, bubbleText);
                    }
                }
            }
        });
    }

    // Function to reorder li elements in specific sidebar-category__list by data-id
    function reorderSidebarList() {
        console.log('Reordering sidebar list...');
        const uls = document.querySelectorAll('ul.sidebar-category__list');
        if (!uls.length) {
            console.log('No ul.sidebar-category__list found');
            return;
        }

        uls.forEach(ul => {
            // Skip if ul is under create-issue-sidebar__sidebar
            if (ul.closest('div.create-issue-sidebar__sidebar')) {
                console.log('Skipping ul under create-issue-sidebar__sidebar:', ul);
                return;
            }

            //const desiredOrder = ['status', 'assignee', 'author', 'dueDate', '67e6a29adfa7655cd4066e89--resumeTheTask'];
            const desiredOrder = ['status', 'type', 'priority', 'assignee', 'dueDate', '67e6a29adfa7655cd4066e89--resumeTheTask', '67e6a29adfa7655cd4066e89--theApplicant', 'author'];
            const liElements = Array.from(ul.querySelectorAll('li'));
            const orderedItems = [];
            const remainingItems = [];

            // Check current order to avoid unnecessary reordering
            let currentOrder = liElements.map(li => li.getAttribute('data-id')).filter(id => desiredOrder.includes(id));
            if (JSON.stringify(currentOrder) === JSON.stringify(desiredOrder.slice(0, currentOrder.length))) {
                console.log('Sidebar list already in correct order, skipping reorder for ul:', ul);
                return;
            }

            // Separate li elements
            liElements.forEach(li => {
                const dataId = li.getAttribute('data-id');
                if (dataId && desiredOrder.includes(dataId)) {
                    orderedItems.push({ li, dataId });
                } else {
                    remainingItems.push(li);
                }
            });

            // Sort ordered items
            orderedItems.sort((a, b) => desiredOrder.indexOf(a.dataId) - desiredOrder.indexOf(b.dataId));

            // Reorder using DOM manipulation
            const fragment = document.createDocumentFragment();
            orderedItems.forEach(item => fragment.appendChild(item.li));
            remainingItems.forEach(li => fragment.appendChild(li));
            ul.appendChild(fragment);

            console.log(`Reordered ${orderedItems.length} li elements in ul:`, orderedItems.map(item => item.dataId));
            console.log(`Preserved ${remainingItems.length} remaining li elements in ul:`, ul);
        });
    }

    // Function to apply colors to agile-column-header elements
    function applyHeaderColors() {
        console.log('Applying header colors...');
        const headers = document.querySelectorAll('[class*="agile-column-header"], [class*="column-header"]');
        console.log(`Found ${headers.length} potential header elements`);

        headers.forEach(header => {
            const nameElement = header.querySelector('[class*="agile-column-header__name"], [class*="name"]');
            if (nameElement) {
                const nameText = nameElement.textContent.trim();
                console.log(`Checking header with text: "${nameText}"`);
                Object.keys(statusColors).some(status => {
                    const regex = new RegExp(status.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'), 'i');
                    if (regex.test(nameText) && header.style.backgroundColor !== statusColors[status]) {
                        header.style.backgroundColor = statusColors[status];
                        header.style.padding = '5px';
                        header.style.borderRadius = '5px';
                        console.log(`Colored header for "${status}" with color ${statusColors[status]}`);
                        return true;
                    }
                    return false;
                });
            }
        });
    }

    // Function to apply styles to table cells
    function applyTableStyles() {
        console.log('Applying table cell styles...');
        let totalCells = 0;

        Object.keys(tableStyles).forEach(className => {
            const cells = document.querySelectorAll(`th.${className}, td.${className}`);
            cells.forEach(cell => {
                let needsUpdate = false;
                Object.keys(tableStyles[className]).forEach(style => {
                    const camelCaseStyle = style.replace(/([A-Z])/g, '-$1').toLowerCase();
                    if (cell.style[camelCaseStyle] !== tableStyles[className][style]) {
                        needsUpdate = true;
                    }
                });
                if (needsUpdate) {
                    Object.keys(tableStyles[className]).forEach(style => {
                        cell.style[style] = tableStyles[className][style];
                    });
                    console.log(`Applied styles to cell with class "${className}":`, tableStyles[className]);
                    totalCells++;
                }
            });
        });

        console.log(`Found and styled ${totalCells} matching table cells`);
    }

    // Debounced customization function
    const debouncedCustomize = debounce(() => {
        console.log('Running debounced customization');
        setTableLayout();
        styleSpecialColumns();
        styleBubbleText();
        reorderSidebarList();
        applyHeaderColors();
        applyTableStyles();
    }, 250);

    // Run initial customization after delay
    setTimeout(() => {
        console.log('Initial customization');
        debouncedCustomize();
    }, 5000);

    // Observe DOM changes with debouncing
    const observer = new MutationObserver(debouncedCustomize);
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class']
    });
})();