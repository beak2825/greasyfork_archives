// ==UserScript==
// @name         [NDiiong] Bypass Medium
// @namespace    medium.com
// @version      1.8.1
// @description  Support for viewing paid articles for medium.com, with auto-redirect option and clear data function.
// @author       NDiiong
// @license      GPLv3
// @match        *://medium.com/*
// @match        *://*.medium.com/*
// @match        *://*.adelaidenow.com.au/*
// @match        *://*.adweek.com/*
// @match        *://*.afr.com/*
// @match        *://*.plainenglish.io/*
// @match        *://*.ambito/*
// @match        *://*.ampproject.org/*
// @match        *://*.baltimoresun.com/*
// @match        *://*.barrons.com/*
// @match        *://*.bizjournals.com/*
// @match        *://*.bloomberg.com/*
// @match        *://*.bloombergquint.com/*
// @match        *://*.bostonglobe.com/*
// @match        *://*.brisbanetimes.com.au/*
// @match        *://*.britannica.com/*
// @match        *://*.businessinsider.com/*
// @match        *://*.caixinglobal.com/*
// @match        *://*.cen.acs.org/*
// @match        *://*.centralwesterndaily.com.au/*
// @match        *://*.chicagobusiness.com/*
// @match        *://*.chicagotribune.com/*
// @match        *://*.corriere.it/*
// @match        *://*.courant.com/*
// @match        *://*.couriermail.com.au/*
// @match        *://*.dailypress.com/*
// @match        *://*.dailytelegraph.com.au/*
// @match        *://*.delfi.ee/*
// @match        *://*.demorgen.be/*
// @match        *://*.denverpost.com/*
// @match        *://*.df.cl/*
// @match        *://*.dynamed.com/*
// @match        *://*.economist.com/*
// @match        *://*.elmercurio.com/*
// @match        *://*.elmundo.es/*
// @match        *://*.elu24.ee/*
// @match        *://*.entreprenal.com/*
// @match        *://*.examiner.com.au/*
// @match        *://*.expansion.com/*
// @match        *://*.fd.nl/*
// @match        *://*.financialpost.com/*
// @match        *://*.fnlondon.com/*
// @match        *://*.foreignpolicy.com/*
// @match        *://*.fortune.com/*
// @match        *://*.ft.com/*
// @match        *://*.gelocal.it/*
// @match        *://*.genomeweb.com/*
// @match        *://*.glassdoor.com/*
// @match        *://*.globes.co.il/*
// @match        *://*.groene.nl/*
// @match        *://*.haaretz.co.il/*
// @match        *://*.haaretz.com/*
// @match        *://*.harpers.org/*
// @match        *://*.hbr.org/*
// @match        *://*.hbrchina.org/*
// @match        *://*.heraldsun.com.au/*
// @match        *://*.historyextra.com/*
// @match        *://*.humo.be/*
// @match        *://*.ilmanifesto.it/*
// @match        *://*.inc.com/*
// @match        *://*.inquirer.com/*
// @match        *://*.interest.co.nz/*
// @match        *://*.investorschronicle.co.uk/*
// @match        *://*.irishtimes.com/*
// @match        *://*.japantimes.co.jp/*
// @match        *://*.journalnow.com/*
// @match        *://*.kansascity.com/*
// @match        *://*.labusinessjournal.com/*
// @match        *://*.lanacion.com.ar/*
// @match        *://*.lastampa.it/*
// @match        *://*.latercera.com/*
// @match        *://*.latimes.com/*
// @match        *://*.lavoixdunord.fr/*
// @match        *://*.lecho.be/*
// @match        *://*.leparisien.fr/*
// @match        *://*.lesechos.fr/*
// @match        *://*.loebclassics.com/*
// @match        *://*.lrb.co.uk/*
// @match        *://*.mcall.com/*
// @match        *://*.medium.com/*
// @match        *://*.medscape.com/*
// @match        *://*.mercurynews.com/*
// @match        *://*.mv-voice.com/*
// @match        *://*.nationalgeographic.com
// @match        *://*.nationalpost.com/*
// @match        *://*.netdna-ssl.com/*
// @match        *://*.news-gazette.com/*
// @match        *://*.newstatesman.com/*
// @match        *://*.newyorker.com/*
// @match        *://*.nrc.nl/*
// @match        *://*.ntnews.com.au/*
// @match        *://*.nydailynews.com/*
// @match        *://*.nymag.com/*
// @match        *://*.nytimes.com/*
// @match        *://*.nzherald.co.nz/*
// @match        *://*.nzz.ch/*
// @match        *://*.ocregister.com/*
// @match        *://*.orlandosentinel.com/*
// @match        *://*.outbrain.com/*
// @match        *://*.paloaltoonline.com/*
// @match        *://*.parool.nl/*
// @match        *://*.piano.io/*
// @match        *://*.poool.fr/*
// @match        *://*.postimees.ee/*
// @match        *://*.qiota.com/*
// @match        *://*.quora.com/*
// @match        *://*.qz.com/*
// @match        *://*.repubblica.it/*
// @match        *://*.republic.ru/*
// @match        *://*.reuters.com/*
// @match        *://*.sandiegouniontribune.com/*
// @match        *://*.scientificamerican.com/*
// @match        *://*.scmp.com/*
// @match        *://*.seattletimes.com/*
// @match        *://*.seekingalpha.com/*
// @match        *://*.slate.com/*
// @match        *://*.smh.com.au/*
// @match        *://*.sofrep.com/*
// @match        *://*.spectator.co.uk/*
// @match        *://*.spectator.com.au/*
// @match        *://*.spectator.us/*
// @match        *://*.speld.nl/
// @match        *://*.startribune.com/*
// @match        *://*.statista.com/*
// @match        *://*.stuff.co.nz/*
// @match        *://*.sueddeutsche.de/*
// @match        *://*.sun-sentinel.com/*
// @match        *://*.techinasia.com/*
// @match        *://*.technologyreview.com/*
// @match        *://*.telegraaf.nl/*
// @match        *://*.telegraph.co.uk/*
// @match        *://*.the-tls.co.uk/*
// @match        *://*.theadvocate.com.au/*
// @match        *://*.theage.com.au/*
// @match        *://*.theathletic.co.uk/*
// @match        *://*.theathletic.com/*
// @match        *://*.theatlantic.com/*
// @match        *://*.theaustralian.com.au/*
// @match        *://*.thediplomat.com/*
// @match        *://*.theglobeandmail.com/*
// @match        *://*.theherald.com.au/*
// @match        *://*.thehindu.com/*
// @match        *://*.themarker.com/*
// @match        *://*.themercury.com.au/*
// @match        *://*.thenation.com/*
// @match        *://*.thenational.scot/*
// @match        *://*.theolivepress.es/*
// @match        *://*.thesaturdaypaper.com.au/*
// @match        *://*.thestar.com/*
// @match        *://*.thewrap.com/*
// @match        *://*.tijd.be/*
// @match        *://*.time.com/*
// @match        *://*.tinypass.com/*
// @match        *://*.towardsdatascience.com/*
// @match        *://*.trouw.nl/*
// @match        *://*.vanityfair.com/*
// @match        *://*.vn.nl/*
// @match        *://*.volkskrant.nl/*
// @match        *://*.washingtonpost.com/*
// @match        *://*.wired.com/*
// @match        *://*.wsj.com/*
// @match        *://*.zeit.de/*
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/538548/%5BNDiiong%5D%20Bypass%20Medium.user.js
// @updateURL https://update.greasyfork.org/scripts/538548/%5BNDiiong%5D%20Bypass%20Medium.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const DEFAULT_SOURCES = [
        { name: 'freedium-mirror.cfd', url: 'freedium-mirror.cfd', enabled: true },
        { name: 'freedium.cfd', url: 'freedium.cfd', enabled: true },
        { name: 'ReadMedium', url: 'readmedium.com', enabled: true },
        { name: 'Scribe', url: 'scribe.rip', enabled: true }
    ];

    const CONFIG = {
        VERSION: '1.8.1',
        STORAGE_KEY: 'medium_bypass_ndiiong',
        MIN_DRAG_THRESHOLD: 5,
        CACHE_DURATION: 5 * 60 * 1000,
        MAX_SOURCES: 20,
        QUICK_ACCESS_COUNT: 3
    };

    let isDropdownOpen = false;

    class StorageManager {
        static get(key, defaultValue = null) {
            try {
                const value = GM_getValue(key, defaultValue);
                return typeof value === 'string' ? JSON.parse(value) : value;
            } catch (e) {
                console.error(`Storage get error for ${key}:`, e);
                return defaultValue;
            }
        }

        static set(key, value) {
            try {
                const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                GM_setValue(key, serialized);
                return true;
            } catch (e) {
                console.error(`Storage set error for ${key}:`, e);
                return false;
            }
        }

        static clearAll() {
            const keys = ['buttonPosition', 'unlockerSources', 'autoRedirectEnabled', 'compactMode',
                          'quickAccessOrder', 'lastUsedSource', 'stats', 'theme'];
            keys.forEach(key => GM_setValue(key, null));
            return true;
        }

        static getAllData() {
            return {
                buttonPosition: this.get('buttonPosition', { right: '20px', bottom: '20px' }),
                unlockerSources: this.get('unlockerSources', DEFAULT_SOURCES),
                autoRedirectEnabled: this.get('autoRedirectEnabled', false),
                compactMode: this.get('compactMode', false),
                quickAccessOrder: this.get('quickAccessOrder', []),
                lastUsedSource: this.get('lastUsedSource', null),
                stats: this.get('stats', { opens: 0, lastOpened: null }),
                theme: this.get('theme', 'light')
            };
        }
    }

    class StatsTracker {
        static recordOpen(sourceName = null) {
            const stats = StorageManager.get('stats', { opens: 0, lastOpened: null, sources: {} });
            stats.opens = (stats.opens || 0) + 1;
            stats.lastOpened = new Date().toISOString();

            if (sourceName) {
                stats.sources = stats.sources || {};
                stats.sources[sourceName] = (stats.sources[sourceName] || 0) + 1;

                StorageManager.set('lastUsedSource', sourceName);
            }

            StorageManager.set('stats', stats);
            return stats;
        }

        static getStats() {
            return StorageManager.get('stats', { opens: 0, lastOpened: null, sources: {} });
        }

        static getMostUsedSource() {
            const stats = this.getStats();
            if (!stats.sources || Object.keys(stats.sources).length === 0) return null;

            return Object.entries(stats.sources)
                .sort(([, a], [, b]) => b - a)[0][0];
        }
    }

    class ThemeManager {
        static getTheme() {
            return StorageManager.get('theme', 'light');
        }

        static setTheme(theme) {
            StorageManager.set('theme', theme);
            this.applyTheme(theme);
        }

        static applyTheme(theme) {
            const root = document.documentElement;
            const isDark = theme === 'dark';

            document.body.classList.toggle('medium-unlock-dark', isDark);

            if (isDark) {
                root.style.setProperty('--mu-bg', '#1a1a1a');
                root.style.setProperty('--mu-text', '#ffffff');
                root.style.setProperty('--mu-border', '#333');
                root.style.setProperty('--mu-card', '#2d2d2d');
                root.style.setProperty('--mu-primary', '#2ecc71');
                root.style.setProperty('--mu-secondary', '#7f8c8d');
                root.style.setProperty('--mu-danger', '#e74c3c');
                root.style.setProperty('--mu-warning', '#f39c12');
                root.style.setProperty('--mu-shadow', '0 4px 12px rgba(0,0,0,0.5)');
            } else {
                root.style.setProperty('--mu-bg', '#ffffff');
                root.style.setProperty('--mu-text', '#333333');
                root.style.setProperty('--mu-border', '#e0e0e0');
                root.style.setProperty('--mu-card', '#f9f9f9');
                root.style.setProperty('--mu-primary', '#1a8917');
                root.style.setProperty('--mu-secondary', '#666666');
                root.style.setProperty('--mu-danger', '#ff4444');
                root.style.setProperty('--mu-warning', '#ff9800');
                root.style.setProperty('--mu-shadow', '0 4px 12px rgba(0,0,0,0.15)');
            }
        }

        static toggleTheme() {
            const current = this.getTheme();
            const newTheme = current === 'light' ? 'dark' : 'light';
            this.setTheme(newTheme);
            return newTheme;
        }
    }

    class QuickAccessManager {
        static getOrder() {
            return StorageManager.get('quickAccessOrder', []);
        }

        static updateOrder(sourceName) {
            let order = this.getOrder();
            order = order.filter(name => name !== sourceName);
            order.unshift(sourceName);

            if (order.length > CONFIG.QUICK_ACCESS_COUNT) {
                order = order.slice(0, CONFIG.QUICK_ACCESS_COUNT);
            }

            StorageManager.set('quickAccessOrder', order);
            return order;
        }

        static getQuickAccessSources(sources) {
            const order = this.getOrder();
            const quickAccess = [];
            const remaining = [...sources];

            order.forEach(name => {
                const index = remaining.findIndex(s => s.name === name);
                if (index !== -1) {
                    quickAccess.push(remaining[index]);
                    remaining.splice(index, 1);
                }
            });

            return { quickAccess, remaining };
        }
    }

    function getButtonPosition() {
        return StorageManager.get('buttonPosition', { right: '20px', bottom: '20px' });
    }

    function saveButtonPosition(position) {
        StorageManager.set('buttonPosition', position);
    }

    function getSources() {
        return StorageManager.get('unlockerSources', DEFAULT_SOURCES);
    }

    function saveSources(sources) {
        StorageManager.set('unlockerSources', sources);
    }

    function getAutoRedirectState() {
        return StorageManager.get('autoRedirectEnabled', false);
    }

    function saveAutoRedirectState(enabled) {
        StorageManager.set('autoRedirectEnabled', enabled);
    }

    function getCompactMode() {
        return StorageManager.get('compactMode', false);
    }

    function saveCompactMode(enabled) {
        StorageManager.set('compactMode', enabled);
    }

    function clearAllData() {
        const confirmed = confirm(`⚠️ VERSION ${CONFIG.VERSION}\n\nThis will reset ALL settings to default:\n\n• Button position\n• Custom sources\n• Auto-redirect\n• Quick access order\n• Statistics\n• Theme preferences\n\nAre you sure?`);

        if (confirmed) {
            StorageManager.clearAll();

            const toast = showToast('All data cleared successfully!', 'success');
            setTimeout(() => {
                toast.remove();
                window.location.reload();
            }, 1500);
        }
    }

    function exportSettings() {
        const data = StorageManager.getAllData();
        data.exportDate = new Date().toISOString();
        data.version = CONFIG.VERSION;

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `medium-unlocker-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Settings exported successfully!', 'success');
    }

    function importSettings() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.onchange = function (e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                try {
                    const data = JSON.parse(e.target.result);

                    if (!data.version || !data.unlockerSources) {
                        throw new Error('Invalid backup file');
                    }

                    const confirmed = confirm(`Import settings from ${data.exportDate || 'unknown date'}?\n\nVersion: ${data.version}\nSources: ${data.unlockerSources.length}\n\nThis will overwrite current settings.`);

                    if (confirmed) {
                        Object.keys(data).forEach(key => {
                            StorageManager.set(key, data[key]);
                        });

                        showToast('Settings imported successfully!', 'success');
                        setTimeout(() => window.location.reload(), 1000);
                    }
                } catch (error) {
                    showToast('Error importing settings: Invalid file format', 'error');
                }
            };
            reader.readAsText(file);
        };

        input.click();
    }

    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'medium-unlock-toast';
        toast.textContent = message;

        const types = {
            success: '#2ecc71',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };

        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${types[type] || types.info};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
            font-weight: 500;
            z-index: 10001;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 400px;
            text-align: center;
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(-20px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);

        return toast;
    }

    function createSettingsPanel() {
        const panel = document.createElement('div');
        panel.className = 'medium-unlock-settings';
        panel.innerHTML = `
            <div class="settings-overlay"></div>
            <div class="settings-panel">
                <div class="settings-header">
                    <h3>⚙️ Medium Unlocker v${CONFIG.VERSION}</h3>
                    <button class="settings-close" title="Close">✕</button>
                </div>

                <div class="settings-tabs">
                    <button class="tab-btn active" data-tab="sources">Sources</button>
                    <button class="tab-btn" data-tab="appearance">Appearance</button>
                    <button class="tab-btn" data-tab="advanced">Advanced</button>
                    <button class="tab-btn" data-tab="stats">Statistics</button>
                </div>

                <div class="tab-content active" id="tab-sources">
                    <div class="setting-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="auto-redirect-checkbox">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">Auto-redirect to first enabled source</span>
                        </label>
                    </div>

                    <div class="setting-group">
                        <div class="section-header">
                            <h4>Unlocker Sources (${getSources().filter(s => s.enabled).length} enabled)</h4>
                            <span class="hint">Drag to reorder</span>
                        </div>
                        <div class="sources-list" id="sources-list"></div>

                        <div class="add-source-form">
                            <input type="text" id="new-source-name" placeholder="Source name" class="source-input">
                            <input type="text" id="new-source-url" placeholder="Domain (example.com)" class="source-input">
                            <button id="add-source-btn" class="btn-primary">＋ Add</button>
                        </div>
                    </div>
                </div>

                <div class="tab-content" id="tab-appearance">
                    <div class="setting-group">
                        <label class="toggle-switch">
                            <input type="checkbox" id="compact-mode-checkbox">
                            <span class="toggle-slider"></span>
                            <span class="toggle-label">Compact button mode</span>
                        </label>
                    </div>

                    <div class="setting-group">
                        <h4>Theme</h4>
                        <div class="theme-selector">
                            <button class="theme-option active" data-theme="light">
                                <div class="theme-preview light"></div>
                                <span>Light</span>
                            </button>
                            <button class="theme-option" data-theme="dark">
                                <div class="theme-preview dark"></div>
                                <span>Dark</span>
                            </button>
                            <button class="theme-option" data-theme="auto">
                                <div class="theme-preview auto"></div>
                                <span>Auto</span>
                            </button>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h4>Quick Access</h4>
                        <p class="setting-description">Most used sources appear first (max ${CONFIG.QUICK_ACCESS_COUNT})</p>
                    </div>
                </div>

                <div class="tab-content" id="tab-advanced">
                    <div class="setting-group">
                        <h4>Backup & Restore</h4>
                        <div class="button-group">
                            <button id="export-btn" class="btn-secondary">📤 Export Settings</button>
                            <button id="import-btn" class="btn-secondary">📥 Import Settings</button>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h4>Danger Zone</h4>
                        <button id="clear-data-btn" class="btn-danger">🗑️ Clear All Data</button>
                        <p class="warning-text">This will reset all settings to default values</p>
                    </div>
                </div>

                <div class="tab-content" id="tab-stats">
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-value" id="total-opens">0</div>
                            <div class="stat-label">Total Opens</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="last-used">Never</div>
                            <div class="stat-label">Last Used</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" id="top-source">None</div>
                            <div class="stat-label">Top Source</div>
                        </div>
                    </div>

                    <div class="setting-group">
                        <h4>Source Usage</h4>
                        <div id="sources-stats"></div>
                    </div>
                </div>

                <div class="settings-footer">
                    <button id="save-settings-btn" class="btn-primary">Save Settings</button>
                </div>
            </div>
        `;

        document.body.appendChild(panel);
        injectStyles();
        ThemeManager.applyTheme(ThemeManager.getTheme());
        setupEventListeners();
        updateSourcesList(getSources());
        updateStatsDisplay();
    }

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --mu-primary: #1a8917;
                --mu-primary-dark: #147811;
                --mu-secondary: #666;
                --mu-danger: #ff4444;
                --mu-warning: #ff9800;
                --mu-success: #2ecc71;
                --mu-bg: #fff;
                --mu-text: #333;
                --mu-border: #e0e0e0;
                --mu-card: #f9f9f9;
                --mu-shadow: 0 4px 12px rgba(0,0,0,0.15);
            }

            .medium-unlock-dark {
                --mu-bg: #1a1a1a;
                --mu-text: #fff;
                --mu-border: #333;
                --mu-card: #2d2d2d;
                --mu-primary: #2ecc71;
                --mu-secondary: #7f8c8d;
            }
            .settings-panel {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            }

            .settings-header h3 {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 600;
            }

            .tab-btn {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
            }

            .setting-group h4 {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 600;
            }

            .toggle-label {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .source-name {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
            }

            .btn-primary, .btn-secondary, .btn-danger {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
            }

            .section-title {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            .dropdown-item {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .settings-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
                display: none;
            }

            .settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--mu-bg);
                border-radius: 16px;
                box-shadow: var(--mu-shadow);
                z-index: 9999;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                display: flex;
                flex-direction: column;
                display: none;
            }

            .settings-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid var(--mu-border);
            }

            .settings-header h3 {
                margin: 0;
                color: var(--mu-text);
                font-size: 18px;
            }

            .settings-close {
                background: none;
                border: none;
                font-size: 20px;
                cursor: pointer;
                color: var(--mu-text);
                opacity: 0.6;
                transition: opacity 0.2s;
            }

            .settings-close:hover {
                opacity: 1;
            }

            .settings-tabs {
                display: flex;
                padding: 0 20px;
                border-bottom: 1px solid var(--mu-border);
                gap: 4px;
            }

            .tab-btn {
                flex: 1;
                padding: 12px;
                background: none;
                border: none;
                border-bottom: 3px solid transparent;
                cursor: pointer;
                color: var(--mu-text);
                font-weight: 500;
                transition: all 0.2s;
            }

            .tab-btn.active {
                border-bottom-color: var(--mu-primary);
                color: var(--mu-primary);
            }

            .tab-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
                display: none;
            }

            .tab-content.active {
                display: block;
            }

            .setting-group {
                margin-bottom: 24px;
            }

            .setting-group h4 {
                margin: 0 0 12px 0;
                color: var(--mu-text);
                font-size: 15px;
            }

            .toggle-switch {
                display: flex;
                align-items: center;
                cursor: pointer;
                gap: 12px;
            }

            .toggle-switch input {
                display: none;
            }

            .toggle-slider {
                width: 50px;
                height: 26px;
                background: var(--mu-border);
                border-radius: 13px;
                position: relative;
                transition: background 0.3s;
            }

            .toggle-slider:before {
                content: '';
                position: absolute;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: white;
                top: 2px;
                left: 2px;
                transition: transform 0.3s;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }

            input:checked + .toggle-slider {
                background: var(--mu-primary);
            }

            input:checked + .toggle-slider:before {
                transform: translateX(24px);
            }

            .toggle-label {
                color: var(--mu-text);
                font-size: 14px;
            }

            .sources-list {
                margin: 16px 0;
                max-height: 300px;
                overflow-y: auto;
                border: 1px solid var(--mu-border);
                border-radius: 8px;
            }

            .source-item {
                display: flex;
                align-items: center;
                padding: 12px;
                border-bottom: 1px solid var(--mu-border);
                background: var(--mu-card);
                cursor: move;
                transition: background 0.2s;
            }

            .source-item:last-child {
                border-bottom: none;
            }

            .source-item:hover {
                background: color-mix(in srgb, var(--mu-primary) 10%, transparent);
            }

            .source-item.dragging {
                opacity: 0.5;
                background: color-mix(in srgb, var(--mu-primary) 20%, transparent);
            }

            .source-info {
                flex: 1;
                min-width: 0;
            }

            .source-name {
                font-weight: 500;
                color: var(--mu-text);
                margin-bottom: 2px;
                font-size: 14px;
            }

            .source-url {
                color: var(--mu-secondary);
                font-size: 12px;
                font-family: monospace;
                word-break: break-all;
            }

            .source-actions {
                display: flex;
                gap: 8px;
            }

            .btn-icon {
                width: 32px;
                height: 32px;
                border-radius: 6px;
                border: 1px solid var(--mu-border);
                background: var(--mu-bg);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }

            .btn-icon:hover {
                border-color: var(--mu-primary);
                color: var(--mu-primary);
            }

            .btn-icon.delete:hover {
                border-color: var(--mu-danger);
                color: var(--mu-danger);
                background: color-mix(in srgb, var(--mu-danger) 10%, transparent);
            }

            .add-source-form {
                display: grid;
                grid-template-columns: 1fr 1fr auto;
                gap: 8px;
                margin-top: 16px;
            }

            .source-input {
                padding: 10px;
                border: 1px solid var(--mu-border);
                border-radius: 6px;
                background: var(--mu-bg);
                color: var(--mu-text);
                font-size: 14px;
            }

            .source-input:focus {
                outline: none;
                border-color: var(--mu-primary);
            }

            .btn-primary {
                background: var(--mu-primary);
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: background 0.2s;
            }

            .btn-primary:hover {
                background: var(--mu-primary-dark);
            }

            .btn-secondary {
                background: var(--mu-card);
                color: var(--mu-text);
                border: 1px solid var(--mu-border);
                padding: 10px 20px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            }

            .btn-secondary:hover {
                border-color: var(--mu-primary);
                color: var(--mu-primary);
            }

            .btn-danger {
                background: var(--mu-danger);
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
                width: 100%;
            }

            .btn-danger:hover {
                background: #cc0000;
                transform: translateY(-2px);
                box-shadow: 0 4px 8px rgba(255, 68, 68, 0.3);
            }

            .theme-selector {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-top: 12px;
            }

            .theme-option {
                background: var(--mu-card);
                border: 2px solid var(--mu-border);
                border-radius: 8px;
                padding: 12px;
                cursor: pointer;
                transition: all 0.2s;
                text-align: center;
            }

            .theme-option.active {
                border-color: var(--mu-primary);
                background: color-mix(in srgb, var(--mu-primary) 10%, transparent);
            }

            .theme-preview {
                width: 40px;
                height: 40px;
                border-radius: 6px;
                margin: 0 auto 8px;
            }

            .theme-preview.light {
                background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
                border: 1px solid #e0e0e0;
            }

            .theme-preview.dark {
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 1px solid #333;
            }

            .theme-preview.auto {
                background: linear-gradient(135deg, #ffffff 0%, #1a1a1a 100%);
                border: 1px solid #666;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 12px;
                margin-bottom: 24px;
            }

            .stat-card {
                background: var(--mu-card);
                border-radius: 8px;
                padding: 16px;
                text-align: center;
            }

            .stat-value {
                font-size: 24px;
                font-weight: 600;
                color: var(--mu-primary);
                margin-bottom: 4px;
            }

            .stat-label {
                font-size: 12px;
                color: var(--mu-secondary);
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .settings-footer {
                padding: 20px;
                border-top: 1px solid var(--mu-border);
                text-align: right;
            }

            .setting-description {
                color: var(--mu-secondary);
                font-size: 13px;
                margin: 8px 0 0;
            }

            .warning-text {
                color: var(--mu-danger);
                font-size: 12px;
                text-align: center;
                margin-top: 8px;
            }

            .section-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
            }

            .hint {
                color: var(--mu-secondary);
                font-size: 11px;
                font-style: italic;
            }

            .button-group {
                display: flex;
                gap: 12px;
                margin-top: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    function setupEventListeners() {
        const overlay = document.querySelector('.settings-overlay');
        const panel = document.querySelector('.settings-panel');
        const closeBtn = document.querySelector('.settings-close');
        const saveBtn = document.getElementById('save-settings-btn');

        overlay.addEventListener('click', closeSettings);
        closeBtn.addEventListener('click', closeSettings);
        saveBtn.addEventListener('click', saveSettings);

        document.getElementById('add-source-btn').addEventListener('click', addNewSource);
        document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
        document.getElementById('export-btn').addEventListener('click', exportSettings);
        document.getElementById('import-btn').addEventListener('click', importSettings);

        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                switchTab(tab);
            });
        });

        document.querySelectorAll('.theme-option').forEach(option => {
            option.addEventListener('click', () => {
                document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
                option.classList.add('active');
            });
        });

        document.getElementById('new-source-name').addEventListener('keypress', e => {
            if (e.key === 'Enter') addNewSource();
        });

        document.getElementById('new-source-url').addEventListener('keypress', e => {
            if (e.key === 'Enter') addNewSource();
        });
    }

    function switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });

        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab-${tabName}`);
        });
    }

    function updateStatsDisplay() {
        const stats = StatsTracker.getStats();
        const mostUsed = StatsTracker.getMostUsedSource();

        document.getElementById('total-opens').textContent = stats.opens || 0;
        document.getElementById('last-used').textContent = stats.lastOpened
            ? new Date(stats.lastOpened).toLocaleDateString()
        : 'Never';
        document.getElementById('top-source').textContent = mostUsed || 'None';

        const sourcesStats = document.getElementById('sources-stats');
        if (sourcesStats) {
            if (stats.sources && Object.keys(stats.sources).length > 0) {
                sourcesStats.innerHTML = Object.entries(stats.sources)
                    .sort(([, a], [, b]) => b - a)
                    .map(([name, count]) => `
                        <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--mu-border);">
                            <span>${name}</span>
                            <span style="color:var(--mu-primary);font-weight:500;">${count}</span>
                        </div>
                    `).join('');
            } else {
                sourcesStats.innerHTML = '<p style="color:var(--mu-secondary);text-align:center;">No usage data yet</p>';
            }
        }
    }

    function addNewSource() {
        const nameInput = document.getElementById('new-source-name');
        const urlInput = document.getElementById('new-source-url');

        if (nameInput.value && urlInput.value) {
            const sources = getSources();

            if (sources.length >= CONFIG.MAX_SOURCES) {
                showToast(`Maximum ${CONFIG.MAX_SOURCES} sources allowed`, 'error');
                return;
            }

            let url = urlInput.value.trim();
            url = url.replace(/^(https?:\/\/)?(www\.)?/i, '');

            sources.push({
                name: nameInput.value.trim(),
                url: url,
                enabled: true
            });

            updateSourcesList(sources);
            nameInput.value = '';
            urlInput.value = '';
            nameInput.focus();
            showToast('Source added successfully', 'success');
        } else {
            showToast('Please enter both name and URL', 'error');
        }
    }

    function closeSettings() {
        document.querySelector('.settings-overlay').style.display = 'none';
        document.querySelector('.settings-panel').style.display = 'none';
        document.getElementById('new-source-name').value = '';
        document.getElementById('new-source-url').value = '';
    }

    function saveSettings() {
        const autoRedirectEnabled = document.getElementById('auto-redirect-checkbox').checked;
        saveAutoRedirectState(autoRedirectEnabled);

        const compactMode = document.getElementById('compact-mode-checkbox').checked;
        saveCompactMode(compactMode);

        const activeTheme = document.querySelector('.theme-option.active').dataset.theme;
        ThemeManager.setTheme(activeTheme);

        const sources = [];
        document.querySelectorAll('.source-item').forEach(item => {
            sources.push({
                name: item.querySelector('.source-name').textContent,
                url: item.querySelector('.source-url').textContent,
                enabled: item.querySelector('input[type="checkbox"]').checked
            });
        });

        saveSources(sources);
        closeSettings();
        updateUnlockButton();
        showToast('Settings saved successfully!', 'success');
    }

    function deleteSource(index) {
        const sources = getSources();
        const sourceName = sources[index].name;

        if (sources.length <= 1) {
            showToast('You must have at least one source', 'error');
            return;
        }

        if (confirm(`Delete "${sourceName}"?`)) {
            sources.splice(index, 1);
            updateSourcesList(sources);
            showToast(`"${sourceName}" deleted`, 'success');
        }
    }

    function updateSourcesList(sources) {
        const list = document.getElementById('sources-list');
        if (!list) return;

        if (sources.length === 0) {
            list.innerHTML = '<div class="empty-state">No sources added yet</div>';
            return;
        }

        list.innerHTML = sources.map((source, index) => `
            <div class="source-item" data-index="${index}">
                <div class="source-info">
                    <div class="source-name">${source.name}</div>
                    <div class="source-url">${source.url}</div>
                </div>
                <div class="source-actions">
                    <label class="toggle-switch" style="margin:0;">
                        <input type="checkbox" ${source.enabled ? 'checked' : ''}>
                        <span class="toggle-slider"></span>
                    </label>
                    <button class="btn-icon delete" onclick="(${deleteSource.toString()})(${index})" title="Delete">
                        🗑️
                    </button>
                </div>
            </div>
        `).join('');

        setupDragAndDrop();
    }

    function setupDragAndDrop() {
        const list = document.getElementById('sources-list');
        if (!list) return;

        let draggedItem = null;

        list.querySelectorAll('.source-item').forEach(item => {
            item.setAttribute('draggable', 'true');

            item.addEventListener('dragstart', e => {
                draggedItem = item;
                setTimeout(() => item.classList.add('dragging'), 0);
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', item.dataset.index);
            });

            item.addEventListener('dragend', () => {
                item.classList.remove('dragging');
                draggedItem = null;
            });
        });

        list.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(list, e.clientY);
            const draggable = document.querySelector('.dragging');

            if (afterElement == null) {
                list.appendChild(draggable);
            } else {
                list.insertBefore(draggable, afterElement);
            }
        });

        list.addEventListener('drop', e => {
            e.preventDefault();
            const sources = getSources();
            const newSources = [];

            list.querySelectorAll('.source-item').forEach(item => {
                const index = parseInt(item.dataset.index);
                newSources.push(sources[index]);
            });

            saveSources(newSources);
            updateSourcesList(newSources);
        });
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.source-item:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;

            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function createUnlockButton() {
        const sources = getSources().filter(s => s.enabled);
        if (sources.length === 0) return;

        const { quickAccess, remaining } = QuickAccessManager.getQuickAccessSources(sources);
        const compactMode = getCompactMode();
        const position = getButtonPosition();

        const button = document.createElement('div');
        button.id = 'medium-unlock-button';
        button.className = compactMode ? 'compact' : '';
        button.innerHTML = `
            <div class="unlock-button-main">
                <button class="unlock-button-toggle" title="Medium Unlocker">
                    <span class="toggle-icon">🔓</span>
                    ${!compactMode ? '<span class="toggle-text">Unlock</span>' : ''}
                </button>

                <div class="unlock-dropdown" style="display: none;">
                    ${quickAccess.length > 0 ? `
                        <div class="dropdown-section">
                            <div class="section-title">Quick Access</div>
                            ${quickAccess.map(source => `
                                <button class="dropdown-item" data-source="${source.name}">
                                    <span class="item-name">${source.name}</span>
                                    <span class="item-hint">${StatsTracker.getStats().sources?.[source.name] || 0} uses</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${remaining.length > 0 ? `
                        <div class="dropdown-section">
                            <div class="section-title">Other Sources</div>
                            ${remaining.map(source => `
                                <button class="dropdown-item" data-source="${source.name}">
                                    <span class="item-name">${source.name}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    <div class="dropdown-section">
                        <button class="dropdown-item settings-btn">
                            <span class="item-name">⚙️ Settings</span>
                        </button>
                        <button class="dropdown-item stats-btn">
                            <span class="item-name">📊 Statistics</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        button.style.cssText = `
            position: fixed;
            top: ${position.top || '381px'};
            left: ${position.left || '17px'};
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        `;

        document.body.appendChild(button);
        injectButtonStyles();
        setupButtonEvents(button, sources);
    }

    function injectButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #medium-unlock-button {
                --mu-btn-bg: var(--mu-primary);
                --mu-btn-text: white;
                --mu-dropdown-bg: var(--mu-bg);
                --mu-dropdown-border: var(--mu-border);
                --mu-dropdown-shadow: var(--mu-shadow);
            }
            .unlock-button-toggle {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-weight: 500;
            }
            .unlock-button-main {
                position: relative;
            }

            .unlock-button-toggle {
                background: var(--mu-btn-bg);
                color: var(--mu-btn-text);
                border: none;
                border-radius: 24px;
                padding: ${getCompactMode() ? '10px' : '10px 16px'};
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 2px 8px rgba(26, 137, 23, 0.3);
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                min-width: ${getCompactMode() ? '40px' : '100px'};
                justify-content: center;
            }

            .unlock-button-toggle:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(26, 137, 23, 0.4);
            }

            .toggle-icon {
                font-size: 16px;
            }

            .toggle-text {
                display: ${getCompactMode() ? 'none' : 'block'};
            }

            .unlock-dropdown {
                position: absolute;
                bottom: 100%;
                left: 0;
                margin-bottom: 8px;
                background: var(--mu-dropdown-bg);
                border-radius: 12px;
                box-shadow: var(--mu-dropdown-shadow);
                border: 1px solid var(--mu-dropdown-border);
                min-width: 200px;
                z-index: 10000;
                overflow: hidden;
                animation: slideDown 0.2s ease-out;
            }

            .compact .unlock-dropdown {
                left: 50%;
                transform: translateX(-50%);
            }

            .compact .unlock-dropdown:before {
                content: '';
                position: absolute;
                bottom: -6px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 6px solid var(--mu-dropdown-bg);
            }

            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            .dropdown-section {
                padding: 8px 0;
                border-bottom: 1px solid var(--mu-dropdown-border);
            }

            .dropdown-section:last-child {
                border-bottom: none;
            }

            .section-title {
                padding: 8px 16px;
                font-size: 11px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                color: var(--mu-secondary);
                font-weight: 600;
            }

            .dropdown-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                padding: 10px 16px;
                border: none;
                background: none;
                cursor: pointer;
                color: var(--mu-text);
                font-size: 14px;
                text-align: left;
                transition: background 0.2s;
            }

            .dropdown-item:hover {
                background: color-mix(in srgb, var(--mu-primary) 10%, transparent);
            }

            .item-name {
                flex: 1;
            }

            .item-hint {
                font-size: 11px;
                color: var(--mu-secondary);
                background: var(--mu-card);
                padding: 2px 6px;
                border-radius: 10px;
                margin-left: 8px;
            }
        `;
        document.head.appendChild(style);
    }

    function setupButtonEvents(button, sources) {
        const toggle = button.querySelector('.unlock-button-toggle');
        const dropdown = button.querySelector('.unlock-dropdown');
        const settingsBtn = button.querySelector('.settings-btn');
        const statsBtn = button.querySelector('.stats-btn');

        // Toggle dropdown on click
        toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownOpen = !isDropdownOpen;
            dropdown.style.display = isDropdownOpen ? 'block' : 'none';
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (isDropdownOpen && !button.contains(e.target)) {
                isDropdownOpen = false;
                dropdown.style.display = 'none';
            }
        });

        // Close dropdown on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isDropdownOpen) {
                isDropdownOpen = false;
                dropdown.style.display = 'none';
            }
        });

        // Source click events
        button.querySelectorAll('.dropdown-item[data-source]').forEach(item => {
            item.addEventListener('click', (e) => {
                e.stopPropagation();
                const sourceName = item.dataset.source;
                const source = sources.find(s => s.name === sourceName);
                if (source) {
                    isDropdownOpen = false;
                    dropdown.style.display = 'none';
                    openWithSource(source);
                }
            });
        });

        // Settings button
        settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownOpen = false;
            dropdown.style.display = 'none';
            openSettings();
        });

        // Stats button
        statsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            isDropdownOpen = false;
            dropdown.style.display = 'none';
            openStats();
        });

        // Make draggable (only on the toggle button, not dropdown)
        makeDraggable(button, toggle);
    }

    function openWithSource(source) {
        const currentUrl = window.location.href;
        const unlockUrl = `https://${source.url}/${currentUrl}`;

        StatsTracker.recordOpen(source.name);
        QuickAccessManager.updateOrder(source.name);

        window.open(unlockUrl, '_blank');
        showToast(`Opening with ${source.name}...`, 'info');
    }

    function openSettings() {
        document.querySelector('.settings-overlay').style.display = 'block';
        document.querySelector('.settings-panel').style.display = 'flex';

        document.getElementById('auto-redirect-checkbox').checked = getAutoRedirectState();
        document.getElementById('compact-mode-checkbox').checked = getCompactMode();

        const currentTheme = ThemeManager.getTheme();
        document.querySelectorAll('.theme-option').forEach(option => {
            option.classList.toggle('active', option.dataset.theme === currentTheme);
        });

        updateSourcesList(getSources());
    }

    function openStats() {
        openSettings();
        switchTab('stats');
        updateStatsDisplay();
    }

    function makeDraggable(element, handle) {
        handle = handle || element;
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        handle.addEventListener('mousedown', startDrag);

        function startDrag(e) {
            if (e.target.closest('.dropdown-item')) return;

            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(element.style.left) || 17;
            startTop = parseInt(element.style.top) || 381;

            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);

            element.style.cursor = 'grabbing';
            element.style.transition = 'none';
        }

        function drag(e) {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            if (Math.abs(dx) > CONFIG.MIN_DRAG_THRESHOLD || Math.abs(dy) > CONFIG.MIN_DRAG_THRESHOLD) {
                element.style.left = `${startLeft + dx}px`;
                element.style.top = `${startTop + dy}px`;
            }
        }

        function stopDrag() {
            if (!isDragging) return;

            isDragging = false;
            element.style.cursor = '';
            element.style.transition = '';

            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);

            saveButtonPosition({
                left: element.style.left,
                top: element.style.top
            });

            showToast('Position saved', 'info');
        }
    }

    function isMediumArticle() {
        const checks = [
            () => document.querySelector('article') !== null,
            () => document.querySelector('meta[name="generator"][content*="medium"]') !== null,
            () => document.querySelector('.progressiveMedia, .graf--title, .section-content') !== null,
            () => Array.from(document.scripts).some(s => s.src && (s.src.includes('medium.com') || s.src.includes('cdn-client.medium.com'))),
            () => Array.from(document.links).some(l => l.href && (l.href.includes('medium.com') || l.href.includes('cdn-static-1.medium.com')))
        ];

        return checks.filter(check => check()).length >= 2;
    }

    function updateUnlockButton() {
        const oldButton = document.getElementById('medium-unlock-button');
        if (oldButton) oldButton.remove();
        createUnlockButton();
    }

    function init() {
        setTimeout(() => {
            if (isMediumArticle()) {
                if (getAutoRedirectState()) {
                    const excludePaths = ['/', '/search', '/me/', '/new-story'];
                    const path = window.location.pathname;

                    if (!excludePaths.some(p => path.startsWith(p))) {
                        const enabledSources = getSources().filter(s => s.enabled);
                        if (enabledSources.length > 0) {
                            const primarySource = enabledSources[0];
                            const currentUrl = window.location.href;
                            const redirectUrl = `https://${primarySource.url}/${currentUrl}`;

                            console.log(`[Medium Unlocker] Auto-redirecting to ${primarySource.name}...`);
                            window.location.href = redirectUrl;
                            return;
                        }
                    }
                }

                if (!document.querySelector('.medium-unlock-settings')) {
                    createSettingsPanel();
                }
                if (!document.getElementById('medium-unlock-button')) {
                    createUnlockButton();
                }
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            init();
        }

        if (!document.getElementById('medium-unlock-button') && isMediumArticle()) {
            init();
        }
    }).observe(document, { subtree: true, childList: true });

})();