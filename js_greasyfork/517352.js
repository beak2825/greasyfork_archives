// ==UserScript==
// @name         Linkwarden Search
// @namespace    https://mjyai.com
// @version      1.3.0
// @description  Search user's Linkwarden bookmarks across multiple search engines
// @author       MA Junyi
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @match        https://duckduckgo.com/*
// @match        https://www.baidu.com/s*
// @match        https://search.brave.com/search*
// @match        https://yandex.com/search*
// @match        https://presearch.com/search*
// @match        *://*/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      cloud.linkwarden.app
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/517352/Linkwarden%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/517352/Linkwarden%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    let totalItems = [];

    const styles = `
        :root {
            --md-primary: #1976d2;
            --md-primary-dark: #1565c0;
            --md-surface: #ffffff;
            --md-on-surface: #1f1f1f;
            --md-outline: rgba(0, 0, 0, 0.12);
            --md-text-primary: rgba(0, 0, 0, 0.87);
            --md-text-secondary: rgba(0, 0, 0, 0.6);
            --md-text-disabled: rgba(0, 0, 0, 0.38);
            --md-hover-overlay: rgba(0, 0, 0, 0.04);
            --md-shadow-1: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
            --md-shadow-2: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
        }

        @media (prefers-color-scheme: dark) {
            :root {
                --md-primary: #90caf9;
                --md-primary-dark: #82b1ff;
                --md-surface: #1e1e1e;
                --md-on-surface: #ffffff;
                --md-outline: rgba(255, 255, 255, 0.12);
                --md-text-primary: rgba(255, 255, 255, 0.87);
                --md-text-secondary: rgba(255, 255, 255, 0.6);
                --md-text-disabled: rgba(255, 255, 255, 0.38);
                --md-hover-overlay: rgba(255, 255, 255, 0.04);
                --md-shadow-1: 0 2px 4px -1px rgba(0,0,0,.4), 0 4px 5px 0 rgba(0,0,0,.34), 0 1px 10px 0 rgba(0,0,0,.32);
                --md-shadow-2: 0 5px 5px -3px rgba(0,0,0,.4), 0 8px 10px 1px rgba(0,0,0,.34), 0 3px 14px 2px rgba(0,0,0,.32);
            }
        }

        #linkwarden-panel {
            position: fixed !important;
            top: 100px !important;
            right: 20px !important;
            width: 360px !important;
            min-height: 100px !important;
            max-height: 80vh !important;
            background: var(--md-surface) !important;
            border-radius: 8px !important;
            box-shadow: var(--md-shadow-1) !important;
            padding: 16px !important;
            overflow-y: auto !important;
            z-index: 99999 !important;
            font-family: Roboto, Arial, sans-serif !important;
            transition: box-shadow 0.3s ease !important;
            opacity: 0.95 !important;
            color: var(--md-text-primary) !important;
        }

        #linkwarden-panel:hover {
            opacity: 1 !important;
            box-shadow: var(--md-shadow-2) !important;
        }

        #linkwarden-panel h3 {
            color: var(--md-on-surface) !important;
            font-size: 20px !important;
            font-weight: 500 !important;
            margin: 0 0 16px 0 !important;
            padding-right: 24px !important;
        }

        .gear-icon {
            position: absolute !important;
            top: 16px !important;
            right: 16px !important;
            cursor: pointer !important;
            color: var(--md-text-secondary) !important;
            opacity: 0.87 !important;
            transition: opacity 0.2s ease !important;
            padding: 8px !important;
            border-radius: 50% !important;
            background: transparent !important;
        }

        .gear-icon:hover {
            opacity: 1 !important;
            background: var(--md-hover-overlay) !important;
        }

        .item-div {
            margin-bottom: 16px !important;
            padding: 12px !important;
            border-radius: 4px !important;
            border: 1px solid var(--md-outline) !important;
            transition: all 0.2s ease !important;
            color: var(--md-text-primary) !important;
            cursor: pointer !important;
            text-decoration: none !important;
            display: block !important;
        }

        .item-div:hover {
            border-color: var(--md-primary) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;
            background: var(--md-hover-overlay) !important;
        }

        .item-div strong {
            display: block !important;
            font-size: 16px !important;
            color: var(--md-primary) !important;
            margin-bottom: 8px !important;
        }

        .item-div div:nth-child(2) {
            font-size: 14px !important;
            color: var(--md-text-primary) !important;
            line-height: 1.5 !important;
            margin-bottom: 8px !important;
        }

        .pagination {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-top: 16px !important;
            padding: 8px 0 !important;
            border-top: 1px solid var(--md-outline) !important;
        }

        .pagination button {
            background: transparent !important;
            color: var(--md-primary) !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-transform: uppercase !important;
            cursor: pointer !important;
            transition: background-color 0.2s ease !important;
        }

        .pagination button:hover:not(:disabled) {
            background: var(--md-hover-overlay) !important;
        }

        .pagination button:disabled {
            color: var(--md-text-disabled) !important;
            cursor: default !important;
        }

        .page-info {
            color: var(--md-text-secondary) !important;
            font-size: 14px !important;
        }

        #settings-panel {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            background: var(--md-surface) !important;
            border-radius: 8px !important;
            box-shadow: var(--md-shadow-2) !important;
            padding: 24px !important;
            z-index: 100001 !important;
            min-width: 320px !important;
            max-width: 400px !important;
            color: var(--md-text-primary) !important;
        }

        #settings-panel h3 {
            color: var(--md-on-surface) !important;
            font-size: 20px !important;
            font-weight: 500 !important;
            margin: 0 0 24px 0 !important;
        }

        #settings-panel label {
            color: var(--md-text-primary) !important;
            font-size: 14px !important;
            margin-bottom: 4px !important;
            display: block !important;
        }

        #settings-panel input {
            width: 100% !important;
            padding: 8px 12px !important;
            margin: 4px 0 16px 0 !important;
            border: 1px solid var(--md-outline) !important;
            border-radius: 4px !important;
            font-size: 16px !important;
            transition: border-color 0.2s ease !important;
            box-sizing: border-box;
            background: var(--md-surface) !important;
            color: var(--md-text-primary) !important;
        }

        #settings-panel input:focus {
            outline: none !important;
            border-color: var(--md-primary) !important;
        }

        #settings-panel button {
            background: var(--md-primary) !important;
            color: var(--md-surface) !important;
            border: none !important;
            padding: 8px 16px !important;
            border-radius: 4px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-transform: uppercase !important;
            cursor: pointer !important;
            margin-left: 8px !important;
            transition: background-color 0.2s ease !important;
        }

        #settings-panel button:hover {
            background: var(--md-primary-dark) !important;
        }

        #settings-panel button:first-child {
            margin-left: 0 !important;
        }

        #settings-panel button#closeSettings {
            background: transparent !important;
            color: var(--md-primary) !important;
        }

        #settings-panel button#closeSettings:hover {
            background: var(--md-hover-overlay) !important;
        }

        .checkbox-container {
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
            margin-bottom: 16px !important;
            padding: 8px 0 !important;
        }

        .checkbox-container input[type="checkbox"] {
            width: auto !important;
            margin: 0 !important;
        }

        .checkbox-container label {
            display: inline !important;
            margin: 0 !important;
            cursor: pointer !important;
        }
    `;

    const getQueryParameter = (param) => new URLSearchParams(window.location.search).get(param);

    const isSearxNG = () => {
        return (
            document.querySelector('meta[name="generator"][content*="searxng"]') !== null ||
            document.querySelector('a[href*="searx/preferences"]') !== null ||
            document.querySelector('a[href*="searx/settings"]') !== null ||
            document.querySelector('label[for="time_range"]') !== null
        );
    };

    const searchEngines = {
        'google.com': { getQuery: () => getQueryParameter('q') },
        'bing.com': { getQuery: () => getQueryParameter('q') },
        'duckduckgo.com': { getQuery: () => getQueryParameter('q') },
        'baidu.com': { getQuery: () => getQueryParameter('wd') },
        'brave.com': { getQuery: () => getQueryParameter('q') },
        'yandex.com': { getQuery: () => getQueryParameter('text') },
        'presearch.com': { getQuery: () => getQueryParameter('q') }
    };

    GM_addStyle(styles);

    const getCurrentSearchQuery = () => {
        const searxngEnabled = GM_getValue('searxngEnabled', false);

        if (searxngEnabled && isSearxNG()) {
            return getQueryParameter('q');
        }

        const currentDomain = Object.keys(searchEngines).find(domain =>
            window.location.hostname.includes(domain));
        return currentDomain ? searchEngines[currentDomain].getQuery() : null;
    };

    const getSettings = () => ({
        baseUrl: GM_getValue('linkwardenUrl', 'https://cloud.linkwarden.app'),
        apiToken: GM_getValue('linkwardenApiToken', ''),
        searxngEnabled: GM_getValue('searxngEnabled', false)
    });

    const saveSettings = (baseUrl, apiToken) => {
        GM_setValue('linkwardenUrl', baseUrl);
        GM_setValue('linkwardenApiToken', apiToken);
        GM_setValue('searxngEnabled', searxngEnabled);
    };

    const addSettingsIcon = () => {
        const panel = document.getElementById('linkwarden-panel');
        if (!panel) return;

        let gear = panel.querySelector('.gear-icon');
        if (!gear) {
            gear = document.createElement('span');
            gear.className = 'gear-icon';
            gear.textContent = '⚙️';
            gear.title = 'Settings';
            gear.addEventListener('click', openSettingsPanel);
            panel.appendChild(gear);
        }
    };

    const openSettingsPanel = () => {
        let settingsPanel = document.getElementById('settings-panel');
        if (settingsPanel) return;

        const settings = getSettings();
        settingsPanel = document.createElement('div');
        settingsPanel.id = 'settings-panel';

        settingsPanel.innerHTML = `
            <h3>Linkwarden Settings</h3>
            <label for="baseUrl">Url(*):</label><br>
            <input type="text" id="baseUrl"><br>
            <label for="apiToken">API Token(*):</label><br>
            <input type="text" id="apiToken"><br>
            <div class="checkbox-container">
                <label for="searxngEnabled">SearXNG Support</label>
                <input type="checkbox" id="searxngEnabled" ${settings.searxngEnabled ? 'checked' : ''}>
            </div>
            <button id="saveSettings">Save</button>
            <button id="closeSettings">Close</button>
        `;

        document.body.appendChild(settingsPanel);

        document.getElementById('baseUrl').value = settings.baseUrl;
        document.getElementById('apiToken').value = settings.apiToken;
        document.getElementById('searxngEnabled').checked = settings.searxngEnabled;

        document.getElementById('saveSettings').onclick = () => {
            const baseUrl = document.getElementById('baseUrl').value;
            const apiToken = document.getElementById('apiToken').value;
            const searxngEnabled = document.getElementById('searxngEnabled').checked;
            saveSettings(baseUrl, apiToken, searxngEnabled);
            alert('Settings saved!');
            document.body.removeChild(settingsPanel);
            fetchItems(getCurrentSearchQuery());
        };

        document.getElementById('closeSettings').onclick = () => {
            document.body.removeChild(settingsPanel);
        };
    };

    const createLinkwardenPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'linkwarden-panel';
        panel.innerHTML = '<h3>Linkwarden Bookmarks</h3><div id="items-content"></div>';
        document.body.appendChild(panel);
        addSettingsIcon();
        return panel;
    };

    const displayItems = () => {
        let panel = document.getElementById('linkwarden-panel');
        if (!panel) {
            panel = createLinkwardenPanel();
        }

        const contentDiv = document.getElementById('items-content');
        if (!contentDiv) {
            console.error('Content div not found');
            return;
        }

        contentDiv.innerHTML = '';

        if (totalItems.length > 0) {
            const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalItems.length);
            const currentItems = totalItems.slice(startIdx, endIdx);

            currentItems.forEach(item => {
                const itemDiv = document.createElement('a');
                itemDiv.className = 'item-div';
                itemDiv.href = item.url;
                itemDiv.target = '_blank';
                itemDiv.innerHTML = `
                    <div><strong>${item.name || 'Untitled'}</strong></div>
                    <div>${item.description ? item.description : ''}</div>
                `;
                contentDiv.appendChild(itemDiv);
            });

            const totalPages = Math.ceil(totalItems.length / ITEMS_PER_PAGE);
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination';

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = currentPage === 1;
            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayItems();
                }
            };

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = currentPage >= totalPages;
            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayItems();
                }
            };

            const pageInfo = document.createElement('span');
            pageInfo.className = 'page-info';
            pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

            paginationDiv.appendChild(prevButton);
            paginationDiv.appendChild(pageInfo);
            paginationDiv.appendChild(nextButton);
            contentDiv.appendChild(paginationDiv);
        } else {
            contentDiv.innerHTML = '<p>No bookmarks found for this query.</p>';
        }
    };

    const fetchItems = (query) => {
        const settings = getSettings();
        if (!settings.baseUrl || !settings.apiToken) {
            const contentDiv = document.getElementById('items-content');
            if (contentDiv) {
                contentDiv.innerHTML = '<p>Please configure your Linkwarden baseUrl and API token.</p>';
            }
            openSettingsPanel();
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${settings.baseUrl}/api/v1/links?searchByName=true&searchByUrl=true&searchByDescription=true&searchByTextContent=true&searchByTags=true&searchQueryString=${encodeURIComponent(query)}`,
            headers: { 'Authorization': `Bearer ${settings.apiToken}` },
            onload: function (response) {
                const data = JSON.parse(response.responseText);

                data.response.forEach(item => {
                    totalItems.push(item);
                });

                displayItems();
            },
            onerror: function (err) {
                console.error('Failed to fetch bookmarks', err);
                const contentDiv = document.getElementById('items-content');
                if (contentDiv) {
                    contentDiv.innerHTML = '<p>Failed to fetch bookmarks. Please check your settings and try again.</p>';
                }
            }
        });
    };

    const query = getCurrentSearchQuery();
    if (query) {
        fetchItems(query);
    }
})();