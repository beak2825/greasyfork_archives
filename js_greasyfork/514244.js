// ==UserScript==
// @name         Hypothes.is Search
// @namespace    https://mjyai.com
// @version      1.0.1
// @description  Search user's Hypothes.is annotations across multiple search engines
// @author       MA Junyi
// @match        https://www.google.com/search*
// @match        https://www.bing.com/search*
// @match        https://duckduckgo.com/*
// @match        https://www.baidu.com/s*
// @match        https://search.brave.com/search*
// @match        https://yandex.com/search*
// @match        https://presearch.com/search*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      api.hypothes.is
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/514244/Hypothesis%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/514244/Hypothesis%20Search.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const ITEMS_PER_PAGE = 10;
    let currentPage = 1;
    let totalAnnotations = [];
    const API_URL = 'https://api.hypothes.is/api/search';

    const styles = `
        :root {
            --md-primary: #1976d2;
            --md-primary-dark: #1565c0;
            --md-surface: #ffffff;
            --md-on-surface: #1f1f1f;
            --md-outline: rgba(0, 0, 0, 0.12);
            --md-shadow-1: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
            --md-shadow-2: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
        }

        #hypothesis-panel {
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
        }

        #hypothesis-panel:hover {
            box-shadow: var(--md-shadow-2) !important;
        }

        #hypothesis-panel h3 {
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
            color: var(--md-on-surface) !important;
            opacity: 0.54 !important;
            transition: opacity 0.2s ease !important;
            padding: 8px !important;
            border-radius: 50% !important;
            background: transparent !important;
        }

        .gear-icon:hover {
            opacity: 0.87 !important;
            background: rgba(0, 0, 0, 0.04) !important;
        }

        .annotation-div {
            margin-bottom: 16px !important;
            padding: 12px !important;
            border-radius: 4px !important;
            border: 1px solid var(--md-outline) !important;
            transition: all 0.2s ease !important;
        }

        .annotation-div:hover {
            border-color: var(--md-primary) !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.12) !important;
        }

        .annotation-div strong {
            display: block !important;
            font-size: 16px !important;
            color: var(--md-on-surface) !important;
            margin-bottom: 8px !important;
        }

        .annotation-div div:nth-child(2) {
            font-size: 14px !important;
            color: rgba(0, 0, 0, 0.87) !important;
            line-height: 1.5 !important;
            margin-bottom: 8px !important;
        }

        .annotation-div a {
            color: var(--md-primary) !important;
            text-decoration: none !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
            transition: color 0.2s ease !important;
        }

        .annotation-div a:hover {
            color: var(--md-primary-dark) !important;
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
            background: rgba(25, 118, 210, 0.04) !important;
        }

        .pagination button:disabled {
            color: rgba(0, 0, 0, 0.38) !important;
            cursor: default !important;
        }

        .page-info {
            color: rgba(0, 0, 0, 0.6) !important;
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
        }

        #settings-panel h3 {
            color: var(--md-on-surface) !important;
            font-size: 20px !important;
            font-weight: 500 !important;
            margin: 0 0 24px 0 !important;
        }

        #settings-panel label {
            color: rgba(0, 0, 0, 0.87) !important;
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
        }

        #settings-panel input:focus {
            outline: none !important;
            border-color: var(--md-primary) !important;
        }

        #settings-panel button {
            background: var(--md-primary) !important;
            color: white !important;
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
            background: rgba(25, 118, 210, 0.04) !important;
        }

        .checkbox-container {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
        }

        .checkbox-container label {
            margin: 0;
        }
    `;

    const getQueryParameter = (param) => new URLSearchParams(window.location.search).get(param);

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
        const currentDomain = Object.keys(searchEngines).find(domain =>
            window.location.hostname.includes(domain));
        return currentDomain ? searchEngines[currentDomain].getQuery() : null;
    };

    const getSettings = () => ({
        username: GM_getValue('hypothesisUsername', ''),
        apiToken: GM_getValue('hypothesisApiToken', ''),
        excludeTags: GM_getValue('hypothesisExcludeTags', ''),
        mergeByUri: GM_getValue('mergeByUri', true)
    });

    const saveSettings = (username, apiToken, excludeTags, mergeByUri) => {
        GM_setValue('hypothesisUsername', username);
        GM_setValue('hypothesisApiToken', apiToken);
        GM_setValue('hypothesisExcludeTags', excludeTags);
        GM_setValue('mergeByUri', mergeByUri);
    };

    const addSettingsIcon = () => {
        const panel = document.getElementById('hypothesis-panel');
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
            <h3>Hypothes.is Settings</h3>
            <label for="username">Username(*):</label><br>
            <input type="text" id="username"><br>
            <label for="apiToken">API Token(*):</label><br>
            <input type="text" id="apiToken"><br>
            <label for="excludeTags">Exclude Tags (comma-separated):</label><br>
            <input type="text" id="excludeTags" placeholder="tag1, tag2, tag3"><br>
            <div class="checkbox-container">
                <label for="mergeByUri">Merge Annots By URI:</label>
                <input type="checkbox" id="mergeByUri" ${settings.mergeByUri ? 'checked' : ''}>
            </div>
            <button id="saveSettings">Save</button>
            <button id="closeSettings">Close</button>
        `;

        document.body.appendChild(settingsPanel);

        document.getElementById('username').value = settings.username;
        document.getElementById('apiToken').value = settings.apiToken;
        document.getElementById('excludeTags').value = settings.excludeTags;
        document.getElementById('mergeByUri').checked = settings.mergeByUri;

        document.getElementById('saveSettings').onclick = () => {
            const username = document.getElementById('username').value;
            const apiToken = document.getElementById('apiToken').value;
            const excludeTags = document.getElementById('excludeTags').value;
            const mergeByUri = document.getElementById('mergeByUri').checked;
            saveSettings(username, apiToken, excludeTags, mergeByUri);
            alert('Settings saved!');
            document.body.removeChild(settingsPanel);
            fetchAnnotations(getCurrentSearchQuery());
        };

        document.getElementById('closeSettings').onclick = () => {
            document.body.removeChild(settingsPanel);
        };
    };

    const createHypothesisPanel = () => {
        const panel = document.createElement('div');
        panel.id = 'hypothesis-panel';
        panel.innerHTML = '<h3>Hypothes.is Annotations</h3><div id="annotations-content"></div>';
        document.body.appendChild(panel);
        addSettingsIcon();
        return panel;
    };

    const displayAnnotations = () => {
        let panel = document.getElementById('hypothesis-panel');
        if (!panel) {
            panel = createHypothesisPanel();
        }

        const contentDiv = document.getElementById('annotations-content');
        if (!contentDiv) {
            console.error('Content div not found');
            return;
        }

        contentDiv.innerHTML = '';

        if (totalAnnotations.length > 0) {
            const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIdx = Math.min(startIdx + ITEMS_PER_PAGE, totalAnnotations.length);
            const currentAnnotations = totalAnnotations.slice(startIdx, endIdx);

            currentAnnotations.forEach(annotation => {
                const annotationDiv = document.createElement('div');
                annotationDiv.className = 'annotation-div';
                annotationDiv.innerHTML = `
                    <div><strong>${annotation.document.title || 'Untitled'}</strong></div>
                    <div>${annotation.text ? annotation.text : ''}</div>
                    <a href="${annotation.uri}" target="_blank">View Annotation</a>
                `;
                contentDiv.appendChild(annotationDiv);
            });

            const totalPages = Math.ceil(totalAnnotations.length / ITEMS_PER_PAGE);
            const paginationDiv = document.createElement('div');
            paginationDiv.className = 'pagination';

            const prevButton = document.createElement('button');
            prevButton.textContent = 'Previous';
            prevButton.disabled = currentPage === 1;
            prevButton.onclick = () => {
                if (currentPage > 1) {
                    currentPage--;
                    displayAnnotations();
                }
            };

            const nextButton = document.createElement('button');
            nextButton.textContent = 'Next';
            nextButton.disabled = currentPage >= totalPages;
            nextButton.onclick = () => {
                if (currentPage < totalPages) {
                    currentPage++;
                    displayAnnotations();
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
            contentDiv.innerHTML = '<p>No annotations found for this query.</p>';
        }
    };

    const fetchAnnotations = (query) => {
        const settings = getSettings();
        if (!settings.username || !settings.apiToken) {
            const contentDiv = document.getElementById('annotations-content');
            if (contentDiv) {
                contentDiv.innerHTML = '<p>Please configure your Hypothes.is username and API token.</p>';
            }
            openSettingsPanel();
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${API_URL}?user=acct:${settings.username}@hypothes.is&limit=200&any=${encodeURIComponent(query)}`,
            headers: { 'Authorization': `Bearer ${settings.apiToken}` },
            onload: function (response) {
                const data = JSON.parse(response.responseText);
                const excludedTags = settings.excludeTags.split(',').map(tag => tag.trim()).filter(Boolean);
                const uniqueUri = new Map();

                data.rows.forEach(annotation => {
                    const hasExcludedTag = annotation.tags && excludedTags.some(excludeTag => annotation.tags.includes(excludeTag));
                    if (!hasExcludedTag) {
                        if (settings.mergeByUri) {
                            uniqueUri.set(annotation.uri, annotation);
                        } else {
                            totalAnnotations.push(annotation);
                        }
                    }
                });

                totalAnnotations = settings.mergeByUri ? Array.from(uniqueUri.values()) : totalAnnotations;
                displayAnnotations();
            },
            onerror: function (err) {
                console.error('Failed to fetch annotations', err);
                const contentDiv = document.getElementById('annotations-content');
                if (contentDiv) {
                    contentDiv.innerHTML = '<p>Failed to fetch annotations. Please check your settings and try again.</p>';
                }
            }
        });
    };

    const query = getCurrentSearchQuery();
    if (query) {
        fetchAnnotations(query);
    }
})();