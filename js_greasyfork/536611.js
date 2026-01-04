// ==UserScript==
// @name         KAT Age Filter Tabs with Auto Pagination (Text-based Next Page)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Filter torrents by age, auto-paginate via ">>" button if no match, and remember selected tab on kickasstorrents.to. Hide function removed completely.
// @author       ChatGPT
// @match        https://kickasstorrents.to/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536611/KAT%20Age%20Filter%20Tabs%20with%20Auto%20Pagination%20%28Text-based%20Next%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536611/KAT%20Age%20Filter%20Tabs%20with%20Auto%20Pagination%20%28Text-based%20Next%20Page%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    if (window.location.pathname.endsWith('.html')) return;

    const STORAGE_KEY = 'kat_selected_tab';

    function saveSelectedTab(name) {
        localStorage.setItem(STORAGE_KEY, name);
    }

    function getSelectedTab() {
        return localStorage.getItem(STORAGE_KEY) || 'ALL';
    }

    function clickNextPageIfExists() {
        const nextButtons = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.trim() === '>>');
        if (nextButtons.length > 0) {
            nextButtons[0].click();
        }
    }

    function addFilterTabs() {
        const tableContainer = document.querySelector('table.data')?.parentElement || document.querySelector('.tabs') || document.body;

        const container = document.createElement('div');
        container.id = 'kat-filter-tabs';
        container.style.margin = '10px 0';

        const tabs = [
            {
                name: 'ALL',
                filter: () => true
            },
            {
                name: 'Last 1 Year',
                filter: row => {
                    const cells = row.querySelectorAll('td[title]');
                    return Array.from(cells).some(cell => {
                        const text = cell.textContent.toLowerCase();
                        return text.includes('month') || text.includes('day') || text.includes('hour');
                    });
                }
            },
            {
                name: 'Last 1 Month',
                filter: row => {
                    const cells = row.querySelectorAll('td[title]');
                    return Array.from(cells).some(cell => {
                        const text = cell.textContent.toLowerCase();
                        return text.includes('day') || text.includes('hour');
                    });
                }
            },
            {
                name: '1000+',
                filter: row => {
                    const cells = row.querySelectorAll('td.green');
                    return Array.from(cells).some(cell => {
                        const number = parseInt(cell.textContent.replace(/[^0-9]/g, ''), 10);
                        if (number > 1000) {
                            return true;
                        }
                    });
                }
            },
            {
                name: '500+',
                filter: row => {
                    const cells = row.querySelectorAll('td.green');
                    return Array.from(cells).some(cell => {
                        const number = parseInt(cell.textContent.replace(/[^0-9]/g, ''), 10);
                        if (number > 500) {
                            return true;
                        }
                    });
                }
            },
            {
                name: '100+',
                filter: row => {
                    const cells = row.querySelectorAll('td.green');
                    return Array.from(cells).some(cell => {
                        const number = parseInt(cell.textContent.replace(/[^0-9]/g, ''), 10);
                        if (number > 100) {
                            return true;
                        }
                    });
                }
            }
        ];

        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.textContent = tab.name;
            btn.style.marginRight = '10px';
            btn.style.padding = '5px 10px';
            btn.style.cursor = 'pointer';

            btn.addEventListener('click', () => {
                saveSelectedTab(tab.name);
                updateActiveBtn(btn);
                filterWhenTableReady(tab.filter);
            });

            container.appendChild(btn);

            // Restore selected tab style
            if (tab.name === getSelectedTab()) {
                setTimeout(() => updateActiveBtn(btn), 0);
            }
        });

        function updateActiveBtn(newBtn) {
            container.querySelectorAll('button').forEach(b => {
                b.style.backgroundColor = '';
                b.style.color = '';
                b.style.border = '';
            });
            newBtn.style.backgroundColor = '#4CAF50';
            newBtn.style.color = 'white';
            newBtn.style.border = '1px solid #4CAF50';
        }

        tableContainer.insertBefore(container, tableContainer.firstChild);

        // Auto-run on page load
        const selected = tabs.find(t => t.name === getSelectedTab()) || tabs[0];
        filterWhenTableReady(selected.filter);
    }

    function filterWhenTableReady(filterFn) {
        const interval = setInterval(() => {
            const table = document.querySelector('table.data');
            if (!table) return;

            const rows = table.querySelectorAll('tbody tr');
            if (rows.length === 0) return;

            clearInterval(interval);

            let matched = 0;
            rows.forEach(row => {
                if (row.classList.contains('firstr')) {
                    row.style.display = ''; 
                    return;
                }
                const isMatch = filterFn(row);
                row.style.display = isMatch ? '' : 'none';
                if (isMatch) matched++;
            });

            if (matched === 0) {
                setTimeout(() => clickNextPageIfExists(), 500);
            }
        }, 300);
    }

    // 🚀 Always inject the tab container immediately
    window.addEventListener('load', () => {
        addFilterTabs();
    });
})();
