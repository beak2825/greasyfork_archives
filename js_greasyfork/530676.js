// ==UserScript==
// @name         Universal Content Blocker
// @namespace    https://github.com/your-username/universal-content-blocker
// @version      1.0.0
// @description  A comprehensive content blocker that removes ads, trackers, and unwanted content using filter lists and host files
// @author       Jack Zhang
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      easylist.to
// @connect      adguardteam.github.io
// @connect      raw.githubusercontent.com
// @connect      *
// @run-at       document-start
// @homepage     https://github.com/your-username/universal-content-blocker
// @supportURL   https://github.com/your-username/universal-content-blocker/issues
// @downloadURL https://update.greasyfork.org/scripts/530676/Universal%20Content%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530676/Universal%20Content%20Blocker.meta.js
// ==/UserScript==

/* 
Universal Content Blocker - A powerful userscript to block unwanted content
MIT License - https://opensource.org/licenses/MIT
*/

(function() {
    'use strict';

    // Host Blocker Implementation
    class HostBlocker {
        constructor() {
            this.blockedHosts = new Set();
            this.lastUpdate = 0;
        }

        async loadHostFile(url) {
            try {
                const response = await this.fetchHostFile(url);
                this.parseHostFile(response);
                this.lastUpdate = Date.now();
                return true;
            } catch (error) {
                console.error('Failed to load host file:', error);
                return false;
            }
        }

        fetchHostFile(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject
                });
            });
        }

        parseHostFile(content) {
            const lines = content.split('\n');
            
            for (const line of lines) {
                if (line.startsWith('#') || !line.trim()) continue;

                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2) {
                    const domain = parts[1].toLowerCase();
                    this.blockedHosts.add(domain);

                    if (!domain.startsWith('www.')) {
                        this.blockedHosts.add(`www.${domain}`);
                    }
                }
            }
        }

        shouldBlockDomain(url) {
            try {
                const hostname = new URL(url).hostname.toLowerCase();
                
                if (this.blockedHosts.has(hostname)) return true;

                return Array.from(this.blockedHosts).some(blockedHost => 
                    hostname.endsWith(`.${blockedHost}`)
                );
            } catch (error) {
                console.error('Error parsing URL:', error);
                return false;
            }
        }

        addBlockedHost(domain) {
            domain = domain.toLowerCase();
            this.blockedHosts.add(domain);
            
            if (!domain.startsWith('www.')) {
                this.blockedHosts.add(`www.${domain}`);
            }
        }

        removeBlockedHost(domain) {
            domain = domain.toLowerCase();
            this.blockedHosts.delete(domain);
            this.blockedHosts.delete(`www.${domain}`);
        }

        getBlockedHosts() {
            return Array.from(this.blockedHosts);
        }

        clearBlockedHosts() {
            this.blockedHosts.clear();
        }

        exportHostFile() {
            return Array.from(this.blockedHosts)
                .map(host => `0.0.0.0 ${host}`)
                .join('\n');
        }
    }

    // UI Implementation
    class BlockerUI {
        constructor(contentBlocker) {
            this.contentBlocker = contentBlocker;
            this.createUI();
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'content-blocker-ui';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 5px;
                padding: 15px;
                z-index: 999999;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                font-family: Arial, sans-serif;
                max-width: 300px;
                display: none;
            `;

            const toggleButton = document.createElement('button');
            toggleButton.textContent = '☰ Content Blocker';
            toggleButton.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 999999;
                padding: 5px 10px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 3px;
                cursor: pointer;
            `;

            toggleButton.addEventListener('click', () => {
                container.style.display = container.style.display === 'none' ? 'block' : 'none';
            });

            const content = this.createContent();
            container.appendChild(content);

            document.body.appendChild(toggleButton);
            document.body.appendChild(container);
        }

        createContent() {
            const content = document.createElement('div');

            const title = document.createElement('h2');
            title.textContent = 'Content Blocker Settings';
            title.style.margin = '0 0 15px 0';

            const stats = document.createElement('div');
            const blockerStats = this.contentBlocker.getStats();
            stats.innerHTML = `
                <p>Blocked items: <span id="blocked-count">${blockerStats.blockedCount}</span></p>
                <p>Active rules: <span id="rules-count">${blockerStats.rulesCount}</span></p>
            `;

            const filterLists = document.createElement('div');
            filterLists.innerHTML = `
                <h3>Filter Lists</h3>
                <div id="filter-lists">
                    ${this.contentBlocker.config.filterLists.map(list => `
                        <div class="filter-list-item">
                            <input type="checkbox" checked>
                            <span>${list}</span>
                        </div>
                    `).join('')}
                </div>
                <button id="add-filter-list">Add Filter List</button>
            `;

            const customRules = document.createElement('div');
            customRules.innerHTML = `
                <h3>Custom Rules</h3>
                <textarea id="custom-rules" rows="4" style="width: 100%">${
                    this.contentBlocker.config.customCssRules.join('\n')
                }</textarea>
                <button id="save-custom-rules">Save Rules</button>
            `;

            const controls = document.createElement('div');
            controls.style.marginTop = '15px';
            controls.innerHTML = `
                <button id="update-lists">Update Lists</button>
                <button id="reset-settings">Reset Settings</button>
            `;

            content.appendChild(title);
            content.appendChild(stats);
            content.appendChild(filterLists);
            content.appendChild(customRules);
            content.appendChild(controls);

            this.addEventListeners(content);

            return content;
        }

        addEventListeners(content) {
            content.querySelector('#add-filter-list').addEventListener('click', () => {
                const url = prompt('Enter filter list URL:');
                if (url) {
                    this.contentBlocker.config.filterLists.push(url);
                    this.contentBlocker.saveConfig();
                    this.contentBlocker.updateFilterLists();
                    this.updateUI();
                }
            });

            content.querySelector('#save-custom-rules').addEventListener('click', () => {
                const rules = content.querySelector('#custom-rules').value.split('\n');
                this.contentBlocker.config.customCssRules = rules;
                this.contentBlocker.saveConfig();
                this.contentBlocker.filterList.applyCosmeticRules();
            });

            content.querySelector('#update-lists').addEventListener('click', () => {
                this.contentBlocker.updateFilterLists();
            });

            content.querySelector('#reset-settings').addEventListener('click', () => {
                if (confirm('Reset all settings to default?')) {
                    this.contentBlocker.config = DEFAULT_CONFIG;
                    this.contentBlocker.saveConfig();
                    this.contentBlocker.init();
                    this.updateUI();
                }
            });
        }

        updateUI() {
            const container = document.getElementById('content-blocker-ui');
            if (!container) return;

            const stats = this.contentBlocker.getStats();
            container.querySelector('#blocked-count').textContent = stats.blockedCount;
            container.querySelector('#rules-count').textContent = stats.rulesCount;

            const filterListsContainer = container.querySelector('#filter-lists');
            filterListsContainer.innerHTML = this.contentBlocker.config.filterLists.map(list => `
                <div class="filter-list-item">
                    <input type="checkbox" checked>
                    <span>${list}</span>
                </div>
            `).join('');

            const customRulesTextarea = container.querySelector('#custom-rules');
            customRulesTextarea.value = this.contentBlocker.config.customCssRules.join('\n');
        }
    }

    // Configuration
    const DEFAULT_CONFIG = {
        filterLists: [
            'https://easylist.to/easylist/easylist.txt',
            'https://easylist.to/easylist/easyprivacy.txt',
            'https://adguardteam.github.io/AdGuardSDNSFilter/Filters/filter.txt'
        ],
        hostFile: 'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
        customCssRules: [
            'div[id^="ad-"]',
            '.banner',
            '[class*="advertisement"]',
            '[id*="sponsor"]'
        ],
        blockedScripts: [
            'analytics.js',
            'ga.js',
            'doubleclick.net',
            'facebook.com/plugins',
            'google-analytics.com'
        ],
        updateInterval: 24 * 60 * 60 * 1000 // 24 hours
    };

    // Core Filter Implementation
    class FilterRule {
        constructor(rule) {
            this.originalRule = rule;
            this.parse(rule);
        }

        parse(rule) {
            rule = rule.split('#')[0].trim();
            if (!rule) return;

            if (rule.startsWith('||')) {
                this.type = 'domain';
                this.pattern = rule.slice(2).replace(/\^/g, '');
            } else if (rule.startsWith('/') && rule.endsWith('/')) {
                this.type = 'regex';
                this.pattern = new RegExp(rule.slice(1, -1));
            } else if (rule.startsWith('##')) {
                this.type = 'cosmetic';
                this.pattern = rule.slice(2);
            } else {
                this.type = 'basic';
                this.pattern = rule;
            }
        }

        matches(url) {
            if (!this.pattern) return false;

            switch (this.type) {
                case 'domain':
                    return url.includes(this.pattern);
                case 'regex':
                    return this.pattern.test(url);
                case 'basic':
                    return url.includes(this.pattern);
                default:
                    return false;
            }
        }
    }

    class FilterList {
        constructor() {
            this.rules = new Set();
            this.cosmeticRules = new Set();
        }

        addRule(rule) {
            if (typeof rule !== 'string' || !rule.trim()) return;
            
            const filterRule = new FilterRule(rule);
            if (filterRule.type === 'cosmetic') {
                this.cosmeticRules.add(filterRule.pattern);
            } else {
                this.rules.add(filterRule);
            }
        }

        shouldBlock(url) {
            for (const rule of this.rules) {
                if (rule.matches(url)) return true;
            }
            return false;
        }

        applyCosmeticRules() {
            if (this.cosmeticRules.size > 0) {
                const cssRules = Array.from(this.cosmeticRules).join(',\n');
                GM_addStyle(`${cssRules} { display: none !important; }`);
            }
        }
    }

    class ContentBlocker {
        constructor() {
            this.filterList = new FilterList();
            this.hostBlocker = new HostBlocker();
            this.config = this.loadConfig();
            this.blockedCount = 0;
            this.init();
        }

        loadConfig() {
            const savedConfig = GM_getValue('blockerConfig');
            return savedConfig ? JSON.parse(savedConfig) : DEFAULT_CONFIG;
        }

        saveConfig() {
            GM_setValue('blockerConfig', JSON.stringify(this.config));
        }

        async init() {
            await this.updateFilterLists();
            await this.updateHostFile();
            this.setupMutationObserver();
            this.blockInitialContent();
            
            // Initialize UI after DOM is ready
            if (document.body) {
                this.ui = new BlockerUI(this);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    this.ui = new BlockerUI(this);
                });
            }
            
            // Set up periodic updates
            setInterval(() => {
                this.updateFilterLists();
                this.updateHostFile();
            }, this.config.updateInterval);
        }

        async updateFilterLists() {
            for (const url of this.config.filterLists) {
                try {
                    const response = await this.fetchFilterList(url);
                    const rules = response.split('\n');
                    for (const rule of rules) {
                        this.filterList.addRule(rule);
                    }
                } catch (error) {
                    console.error(`Failed to fetch filter list from ${url}:`, error);
                }
            }
            this.filterList.applyCosmeticRules();
            if (this.ui) this.ui.updateUI();
        }

        async updateHostFile() {
            if (this.config.hostFile) {
                await this.hostBlocker.loadHostFile(this.config.hostFile);
            }
        }

        fetchFilterList(url) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        if (response.status === 200) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject
                });
            });
        }

        setupMutationObserver() {
            const observer = new MutationObserver((mutations) => {
                for (const mutation of mutations) {
                    if (mutation.type === 'childList') {
                        this.processNewNodes(mutation.addedNodes);
                    }
                }
            });

            if (document.body) {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                });
            }
        }

        processNewNodes(nodes) {
            nodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    this.blockScripts(node);
                    this.blockIframes(node);
                    this.blockImages(node);
                }
            });
        }

        blockInitialContent() {
            if (document.body) {
                this.blockScripts(document);
                this.blockIframes(document);
                this.blockImages(document);
            }
        }

        shouldBlock(url) {
            return this.filterList.shouldBlock(url) || this.hostBlocker.shouldBlockDomain(url);
        }

        blockScripts(root) {
            const scripts = root.getElementsByTagName('script');
            for (const script of scripts) {
                const src = script.src;
                if (src && this.shouldBlock(src)) {
                    script.remove();
                    this.blockedCount++;
                }
            }
        }

        blockIframes(root) {
            const iframes = root.getElementsByTagName('iframe');
            for (const iframe of iframes) {
                const src = iframe.src;
                if (src && this.shouldBlock(src)) {
                    iframe.remove();
                    this.blockedCount++;
                }
            }
        }

        blockImages(root) {
            const images = root.getElementsByTagName('img');
            for (const img of images) {
                const src = img.src;
                if (src && this.shouldBlock(src)) {
                    img.remove();
                    this.blockedCount++;
                }
            }
        }

        getStats() {
            return {
                blockedCount: this.blockedCount,
                rulesCount: this.filterList.rules.size + this.filterList.cosmeticRules.size + this.hostBlocker.blockedHosts.size
            };
        }
    }

    // Initialize the content blocker
    const blocker = new ContentBlocker();
})(); 