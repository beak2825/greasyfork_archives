// ==UserScript==
// @name         Tiller.com - Sort Connected Accounts
// @namespace    http://tampermonkey.net/
// @version      2025-06-17
// @description  Add "Sort By" dropdown to connected accounts page
// @author       You
// @match        https://my.tiller.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tiller.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540007/Tillercom%20-%20Sort%20Connected%20Accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/540007/Tillercom%20-%20Sort%20Connected%20Accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[TM] Script loaded');
    let currentSortBy = 'lastRefreshedAt';
    let lastRenderedState = '';
    let mutationTimeout = null;

    function computeDomStateHash() {
        const elements = Array.from(document.querySelectorAll('[data-testid="connected-institution"]'));
        return elements.map(el => el.querySelector('[data-testid="institution-name"]')?.textContent?.trim()).join('|');
    }

    function parseStatus(status, lastRefreshedAt) {
        const now = new Date();
        const refreshedDate = new Date(lastRefreshedAt);
        const diff = (now - refreshedDate) / (1000 * 60 * 60);

        const UNKNOWN = 4;
        const RED = 3;
        const YELLOW = 2;
        const GREEN = 1;

        if (status === 'FAILURE') return RED;
        if (status === 'SUCCESS' && diff < 36) return GREEN;
        if (status === 'SUCCESS' && diff >= 36) return YELLOW;
        return UNKNOWN;
    }

    function calculateTotalBalance(accountData) {
        let totalBalance = 0;
        accountData.forEach(account => {
            const balance = account.balance?.amount?.value || 0;
            totalBalance += parseFloat(balance);
        });
        return totalBalance;
    }

    function gatherConnectionData(apiData) {
        return apiData.items.map(item => {
            const totalBalance = calculateTotalBalance(item.accounts);
            const statusValue = parseStatus(item.refreshInfo.status, item.refreshInfo.lastRefreshedAt);

            return {
                id: item.id,
                name: item.name,
                totalBalance: totalBalance,
                statusValue: statusValue,
                lastRefreshedAt: item.refreshInfo.lastRefreshedAt,
                accounts: item.accounts
            };
        });
    }

    function reorderConnections(sortBy) {
        console.log('[TM] Reordering by:', sortBy);

        const domElements = Array.from(document.querySelectorAll('[data-testid="connected-institution"]'));
        console.log(`[TM] Found ${domElements.length} connected institution elements`);

        if (!window.apiData) {
            console.warn('[TM] apiData not loaded');
            return;
        }

        const matched = [];

        domElements.forEach(el => {
            const institutionName = el.querySelector('[data-testid="institution-name"]')?.textContent?.trim();

            let accountKeys = Array.from(el.querySelectorAll('[data-testid="account-number"]'))
                .map(n => n.textContent.trim())
                .filter(n => n.length > 0);

            let matchKeyType = 'number';

            if (accountKeys.length === 0) {
                accountKeys = Array.from(el.querySelectorAll('[data-testid="account-name"]'))
                    .map(n => n.textContent.trim())
                    .filter(n => n.length > 0);
                matchKeyType = 'name';
            }

            if (!institutionName || accountKeys.length === 0) {
                console.warn('[TM] Could not extract identifiers from element', el);
                return;
            }

            const match = window.apiData.find(data => {
                if (data.name !== institutionName) return false;

                const dataKeys = data.accounts.map(a =>
                    matchKeyType === 'number' ? a.number : a.name
                );

                return accountKeys.every(k => dataKeys.includes(k));
            });

            if (match) {
                matched.push({
                    el,
                    ...match
                });
            }
        });

        if (matched.length === 0) {
            console.warn('[TM] No DOM elements matched to API data');
            return;
        }

        const parent = matched[0].el.parentElement;

        matched.sort((a, b) => {
            const aVal = a[sortBy];
            const bVal = b[sortBy];
            if (sortBy === 'lastRefreshedAt') {
                return new Date(aVal) - new Date(bVal);
            }
            return bVal - aVal;
        });

        matched.forEach(d => {
            parent.appendChild(d.el);
            console.log(`[TM] Moved: ${d.name} (${sortBy} = ${d[sortBy]})`);
        });

        lastRenderedState = computeDomStateHash();

        console.log('[TM] Sorting complete');
    }


    function createDropdown() {
        const sel = document.createElement('select');
        sel.id = 'tm-sort-dropdown';
        ['lastRefreshedAt', 'statusValue', 'totalBalance'].forEach(val => {
            const opt = document.createElement('option');
            opt.value = val;
            opt.text = {
                lastRefreshedAt: 'Last Refreshed At',
                statusValue: 'Connection Status',
                totalBalance: 'Total Balance'
            } [val];
            if (val === currentSortBy) opt.selected = true;
            sel.add(opt);
        });
        sel.style.margin = '10px';

        sel.addEventListener('change', () => {
            currentSortBy = sel.value;
            lastRenderedState = '';
            reorderConnections(currentSortBy);
        });

        return sel;
    }

    function insertDropdown() {
        const headers = Array.from(document.querySelectorAll('h3'));
        const targetHeader = headers.find(h => h.textContent.trim().startsWith('Connected Account'));

        if (targetHeader) {
            console.log('[TM] Found target header:', targetHeader.textContent.trim());
        } else {
            console.warn('[TM] Could not find "Connected Account" header');
            return;
        }

        const existingDropdown = document.getElementById('tm-sort-dropdown');
        if (existingDropdown) {
            console.log('[TM] Dropdown already inserted');
            return;
        }

        const parent = targetHeader.closest('.mt-0.mb-3.d-flex.flex-column');
        if (!parent) {
            console.warn('[TM] Parent element not found for sorting');
            return;
        }
        window.tmParentElement = parent;

        const dropdown = createDropdown();
        targetHeader.insertAdjacentElement('afterend', dropdown);
        console.log('[TM] Dropdown inserted after "Connected Account" header');
    }

    const originalFetch = window.fetch;

    window.fetch = async function(...args) {
        const url = args[0];
        try {
            if (url.includes('/api/v2/provider-accounts')) {
                const response = await originalFetch.apply(this, args);
                const clonedResponse = response.clone();
                const data = await clonedResponse.json();
                window.apiData = gatherConnectionData(data);
                return response;
            }
            return originalFetch.apply(this, args);
        } catch (error) {
            console.error('[TM] Error in fetch interception:', error);
            throw error;
        }
    };

    const observer = new MutationObserver(() => {
        if (mutationTimeout) return;

        mutationTimeout = setTimeout(() => {
            mutationTimeout = null;

            const headers = Array.from(document.querySelectorAll('h3'));
            const targetHeader = headers.find(h => h.textContent.trim().startsWith('Connected Account'));

            if (targetHeader && window.apiData) {
                insertDropdown();

                const currentHash = computeDomStateHash();
                if (currentHash !== lastRenderedState) {
                    reorderConnections(currentSortBy);
                }
            }
        }, 200);
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
