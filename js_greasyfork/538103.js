// ==UserScript==
// @name         Flatmmo+ TESTING
// @namespace    com.Zlef.flatmmo
// @version      0.0.6
// @description  FlatMMO plugin framework (Heavily inspired & copied from Anwinity's IdlePixel+)
// @author       Zlef
// @match        *://flatmmo.com/play.php*
// @grant        none
// ==/UserScript==

// LIVE VERSION = 0.0.6

(function () {
    'use strict';

    const VERSION = "0.0.6";

    if(window.FlatmmoPlus) {
        // already loaded
        return;
    }

    function logFancy(s, color="#00f7ff") {
        console.log("%cFlatmmoPlus: %c"+s, `color: ${color}; font-weight: bold; font-size: 12pt;`, "color: white; font-weight: normal; font-size: 10pt;");
    }


    class FlatmmoPlusPlugin {
        constructor(id, opts = {}) {
            if (typeof id !== "string") {
                throw new TypeError("FlatmmoPlusPlugin constructor requires (id: string, opts?: object)");
            }

            this.id = id;
            this.opts = opts;

            console.log(`[FlatmmoPlusPlugin] Initialising plugin: ${id}`);

            this.config = {}; // placeholder for future config use


            try {
                if (opts.settings) {
                    console.log(`[FlatmmoPlusPlugin] Found settings for ${id}`);

                    if (typeof window.zlef?.SettingsManager !== "function") {
                        throw new Error("zlef.SettingsManager is not defined yet.");
                    }

                    this.settingsManager = new zlef.SettingsManager(id, opts.settings);
                    this.settings = this.settingsManager.getSettings();

                    console.log(`[FlatmmoPlusPlugin] Created SettingsManager for ${id}`);
                    console.log(`[FlatmmoPlusPlugin] Loaded settings for ${id}:`, this.settings);
                }
            } catch (err) {
                console.error(`[FlatmmoPlusPlugin] Failed to initialise settings for "${id}":`, err);
            }


            /*
            if (opts.settings) {
                console.log(`[FlatmmoPlusPlugin] Found settings for ${id}`);

                const sectionTitle = opts.about?.name || id.replace(/([A-Z])/g, ' $1').trim();
                this.settingsManager = new zlef.SettingsManager(id, opts.settings);
                this.settings = this.settingsManager.getSettings();

                console.log(`[FlatmmoPlusPlugin] Created SettingsManager for ${id}`);
                console.log(`[FlatmmoPlusPlugin] Loaded settings for ${id}:`, this.settings);
            }
            */

        }

        getSetting(key, type = null) {
            return window.FlatmmoPlus?.getSetting(`${this.id}.${key}`, type);
        }

        onLogin() {}
        onMessageReceived(data) {}
        onMessageSent(data) {}
        onVariableSet(key, valueBefore, valueAfter) {}
        onSettingsChanged() {}

    }



    class FlatmmoPlus {
        constructor() {
            console.log('[Framework] Initialising');
            logFancy(`VERSION ${VERSION}`);
            this.messageQueue = [];
            this.hookedSockets = new WeakSet();
            this.plugins = {};
            this.login_on_ws = true;
            this._hasLoggedIn = false;

            // Custom panel support
            this.customPanels = []; // { id, pluginId }
            this.customPanelPage = 0;
            this.activePanel = "inventory";
            this.bottomButtons = []; // last 5 interface buttons
            this.customPanelButtons = [];

            this.init();
        }

        getSetting(key, type = null) {
            if (!this.settingsManagers) return undefined;

            const [pluginId, ...path] = key.split(".");
            const manager = this.settingsManagers[pluginId];
            if (!manager) {
                console.warn(`[FlatmmoPlus] No settings manager for plugin "${pluginId}"`);
                return undefined;
            }

            let current = manager.getSettings();

            for (let i = 0; i < path.length; i++) {
                const part = path[i];

                if (!current[part]) return undefined;

                const setting = current[part];

                // If it's a section, go deeper
                if (setting.type === "section") {
                    current = setting.settings;
                } else {
                    // If we're at the last part, return the value with optional coercion
                    if (i === path.length - 1) {
                        let value = setting.value;

                        if (type) {
                            switch (type.toLowerCase()) {
                                case "int":
                                case "integer":
                                    return parseInt(value);
                                case "bool":
                                case "boolean":
                                    return value === true || value === "true";
                                case "string":
                                    return String(value);
                                default:
                                    console.warn(`[FlatmmoPlus] Unknown type coercion '${type}' for setting '${key}'`);
                                    return value;
                            }
                        }

                        return value;
                    } else {
                        // Trying to go deeper into a non-section setting
                        return undefined;
                    }
                }
            }

            return undefined;
        }


        registerPlugin(plugin) {
            if (!(plugin instanceof FlatmmoPlusPlugin)) {
                console.warn(`[Framework] Invalid plugin:`, plugin);
                return;
            }

            const id = plugin.id;
            if (this.plugins[id]) {
                console.warn(`[Framework] Plugin "${id}" already registered.`);
                return;
            }

            this.plugins[id] = plugin;

            if (plugin.settingsManager) {
                if (!this.settingsManagers) this.settingsManagers = {};
                this.settingsManagers[plugin.id] = plugin.settingsManager;
            }


            const version = plugin.opts?.about?.version || "?";
            logFancy(`registered plugin "${id}" (v${version})`);
        }

        broadcast(methodName, ...args) {
            for (const plugin of Object.values(this.plugins)) {
                const fn = plugin[methodName];
                if (typeof fn === "function") {
                    try {
                        fn.apply(plugin, args);
                    } catch (err) {
                        console.error(`[Framework] Error in plugin "${plugin.id}" method "${methodName}":`, err);
                    }
                }
            }
        }

        init() {
            window.FlatmmoPlusSettingsManagers = {};

            this.initCustomCSS();
            this.overrideGlobalWebSocket();
            if (!this.login_on_ws) {
                this.waitForGameVisibility();
            }
        }

        initCustomCSS() {
            const css = `
.fmp-button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 0px;
  justify-content: flex-start;
  align-items: center;
}

.fmp-back-btn {
  display: none;
  width: 15px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  padding: 0;
  text-align: center;
  background: white;
  color: black;
}

.fmp-next-btn {
  display: none;
  width: 15px;
  height: 50px;
  line-height: 50px;
  font-size: 18px;
  padding: 0;
  text-align: center;
  background: white;
  color: black;
}

.fmp-panel-btn {
  width: 50px;
  height: 50px;
  background-size: cover;
  background-position: center;
}

.fmp-custom-panel {
  display: none;
  max-height: 500px;
  overflow-y: auto;
}
            `;
            const style = document.createElement('style');
            style.type = 'text/css';
            style.appendChild(document.createTextNode(css));
            document.head.appendChild(style);
        }

        overrideGlobalWebSocket() {
            const NativeWebSocket = window.WebSocket;
            const self = this;

            console.log('[Framework] Overriding global WebSocket constructor');

            window.WebSocket = function (...args) {
                const ws = new NativeWebSocket(...args);
                setTimeout(() => self.hookSocket(ws), 1000);
                return ws;
            };

            window.WebSocket.prototype = NativeWebSocket.prototype;
            Object.assign(window.WebSocket, NativeWebSocket);
        }

        hookSocket(ws) {
            if (!ws || this.hookedSockets.has(ws)) return;

            this.hookedSockets.add(ws);

            const origSend = ws.send;
            ws.send = (...args) => {
                const data = args[0];
                this.onMessageSent(data);
                return origSend.apply(ws, args);
            };

            const origOnMessage = ws.onmessage;
            ws.onmessage = (event) => {
                if (this.login_on_ws && event.data.startsWith("LOGGED_IN=") && !this._hasLoggedIn) {
                    this._hasLoggedIn = true;
                    this._onLogin();
                    this.onLogin();
                }
                this.onMessageReceived(event.data);
                if (typeof origOnMessage === 'function') {
                    origOnMessage.call(ws, event);
                }
            };
        }

        waitForGameVisibility() {
            const gameDiv = document.getElementById('game');
            if (!gameDiv) return console.warn('[Framework] #game not found');

            const obs = new MutationObserver(() => {
                const visible = window.getComputedStyle(gameDiv).display !== 'none';
                if (visible && !this._hasLoggedIn) {
                    obs.disconnect();
                    this._hasLoggedIn = true;
                    this._onLogin();
                    this.onLogin();
                }
            });

            obs.observe(gameDiv, { attributes: true, attributeFilter: ['style'] });
        }

        injectPluginSettingsUI() {
            const settingsPanel = document.getElementById('ui-panel-settings');
            if (!settingsPanel) return;

            const settingsTable = settingsPanel.querySelector('.settings-ui');
            if (!settingsTable) return;

            const container = document.createElement('div');
            container.style.marginTop = "10px";

            const hr = document.createElement('hr');
            container.appendChild(hr);

            const title = document.createElement('div');
            title.className = "ui-panel-title";
            title.innerText = "PLUGIN SETTINGS";
            container.appendChild(title);

            const btn = document.createElement('button');
            btn.innerText = "Open Plugin Settings";
            btn.className = "btn";
            btn.style.marginTop = "6px";
            btn.onclick = () => this.createMultiSettingsModal();

            container.appendChild(btn);

            settingsPanel.appendChild(container);
        }

        createMultiSettingsModal() {
            const modal = new window.zlef.Modal("Plugin Settings");
            const content = document.createElement('div');

            modal.addTitle(content, "Plugin Settings", 2, 'center');

            for (const [pluginId, manager] of Object.entries(this.settingsManagers)) {
                const sectionTitle = pluginId;
                const section = modal.addSection(content, sectionTitle);

                const build = (settings, parent, parentKey = '') => {
                    for (const key in settings) {
                        const setting = settings[key];
                        const fullKey = parentKey ? `${parentKey}.${key}` : key;
                        const label = setting.label || key;

                        if (setting.type === 'section') {
                            const nested = modal.addSection(parent, label);
                            build(setting.settings, nested, fullKey);
                        } else if (setting.type === 'multicheckbox') {
                            const nested = modal.addSection(parent, label);
                            for (const subKey in setting.values) {
                                modal.addCheckbox(nested, setting.values[subKey], value => {
                                    manager.settingsChanged(fullKey, value, subKey);
                                }, subKey);
                            }
                        } else if (setting.type === 'checkbox') {
                            modal.addCheckbox(parent, setting.value, value => {
                                manager.settingsChanged(fullKey, value);
                            }, label);
                        } else if (setting.type === 'numinput') {
                            modal.addInput(parent, 'number', setting.value, '', setting.minValue, setting.maxValue, value => {
                                manager.settingsChanged(fullKey, value);
                            }, label);
                        } else if (setting.type === 'text') {
                            modal.addInput(parent, 'text', setting.value, setting.placeholder, undefined, undefined, value => {
                                manager.settingsChanged(fullKey, value);
                            }, label);
                        } else if (setting.type === 'radio') {
                            modal.addRadioButtons(parent, label, setting.options, setting.value, value => {
                                manager.settingsChanged(fullKey, value);
                            }, label);
                        } else if (setting.type === 'combobox') {
                            modal.addCombobox(parent, setting.options, setting.value, value => {
                                manager.settingsChanged(fullKey, value);
                            }, label);
                        } else if (setting.type === 'button') {
                            modal.addButton(parent, label, setting.function, 'btn');
                        }
                    }
                };

                build(manager.getSettings(), section);
            }

            modal.addModal(content, "Plugin Settings", 600, "auto", () => {
                for (const [pluginId, manager] of Object.entries(this.settingsManagers)) {
                    manager.saveSettings();

                    if (manager.isDirty()) {
                        const plugin = this.plugins[pluginId];
                        if (plugin && typeof plugin.onSettingsChanged === "function") {
                            plugin.onSettingsChanged();
                        }
                        manager.clearDirty(); // reset after broadcast
                    }
                }
            });
        }

        showCombinedPluginSettings() {
            const modal = new zlef.Modal("AllPluginSettings");
            const content = document.createElement("div");

            modal.addTitle(content, "Plugin Settings", 2, "center");

            for (const [pluginId, manager] of Object.entries(this.settingsManagers)) {
                const sectionName = manager.defaultSettings[pluginId]?.name || pluginId;
                const section = modal.addSection(content, sectionName);

                // Build settings UI directly into section
                manager._buildSettings(manager.settings, section, modal); // Or whatever internal builder logic you extract
            }

            modal.addModal(content, "Plugin Settings", 600, "auto", () => {
                for (const manager of Object.values(this.settingsManagers)) {
                    manager.saveSettings();
                }
            });
        }

        _onLogin(){
            this.captureBottomButtons();
            this.injectPaginationButtons();
            this.hijackSwitchPanels();
            this.injectPluginSettingsUI();
        }

        // Event relays to plugins
        onMessageReceived(data) {
            this.broadcast("onMessageReceived", data);
        }

        onMessageSent(data) {
            this.broadcast("onMessageSent", data);
        }

        onLogin() {
            this.broadcast("onLogin");
        }

        onSettingsChanged() {
            this.broadcast('onSettingsChanged');
        }

        captureBottomButtons() {
            const tdUI = document.querySelector('.td-ui');
            if (!tdUI) return;

            const allButtons = Array.from(tdUI.querySelectorAll('.interface-btn')).filter(btn => btn.id.startsWith('ui-button-'));
            this.bottomButtons = allButtons.slice(-5);
        }


        hijackSwitchPanels() {
            const original = window.switch_panels;
            const self = this;

            window.switch_panels = function(id) {
                const custom = self.customPanels.find(p => p.id === `ui-panel-${id}`);
                if (custom) {
                    document.querySelectorAll('.ui-panel').forEach(p => p.style.display = 'none');
                    const el = document.getElementById(`ui-panel-${id}`);
                    if (el) el.style.display = 'block';
                    self.activePanel = id;
                    return;
                }

                original(id);
                self.activePanel = id;

                self.customPanels.forEach(p => {
                    const el = document.getElementById(p.id);
                    if (el) el.style.display = 'none';
                });
            };
        }

        addPanel(plugin, title = "Untitled", icon = 'https://i.imgur.com/kAp2VY9.png') {
            console.log(plugin);
            const pluginCount = this.customPanels.filter(p => p.pluginId === plugin.id).length;
            const id = `${plugin.id.replace(/\s/g, '')}${pluginCount + 1}`;
            const fullId = `ui-panel-${id}`;

            const div = document.createElement('div');
            div.id = fullId;
            div.className = 'ui-panel fmp-custom-panel';
            div.innerHTML = `
        <div class="ui-panel-title">${title}</div>
    `;

            const after = document.getElementById('ui-panel-worship');
            if (after?.parentNode) after.parentNode.insertBefore(div, after.nextSibling);

            this.customPanels.push({ id: fullId, pluginId: plugin.id, icon });
            this.updatePanelButtons();
            return div;
        }


        injectPaginationButtons() {
            const style = document.createElement('style');
            style.innerHTML = `
        #ui-button-monster_log,
        #ui-button-worship,
        #ui-button-donor-shop,
        #ui-button-settings,
        #ui-button-database {
            margin-right: 4px;
        }
    `;
            document.head.appendChild(style);

            const tdUI = document.querySelector('.td-ui');
            if (!tdUI || this.bottomButtons.length < 5) return;

            const btnContainer = document.createElement('div');
            btnContainer.id = 'fmp-button-container';
            btnContainer.className = 'fmp-button-container';

            // Move existing buttons
            this.bottomButtons.forEach(btn => btnContainer.appendChild(btn));

            // Create back button
            const backBtn = document.createElement('div');
            backBtn.id = 'fmp-back-btn';
            backBtn.className = 'interface-btn hover fmp-back-btn';
            backBtn.innerText = '<';
            backBtn.title = 'Back';
            backBtn.onclick = () => {
                this.customPanelPage--;
                this.updatePanelButtons();
            };
            this.backBtn = backBtn;
            btnContainer.appendChild(backBtn);

            // Create next button
            const nextBtn = document.createElement('div');
            nextBtn.id = 'fmp-next-btn';
            nextBtn.className = 'interface-btn hover fmp-next-btn';
            nextBtn.innerText = '>';
            nextBtn.title = 'Next';
            nextBtn.onclick = () => {
                this.customPanelPage++;
                this.updatePanelButtons();
            };
            this.nextBtn = nextBtn;
            btnContainer.appendChild(nextBtn);

            tdUI.appendChild(btnContainer);
        }

        updatePanelButtons() {
            const total = this.customPanels.length;
            const pages = Math.ceil(total / 5) + 1;

            const showingBaseUI = this.customPanelPage === 0;
            const container = document.getElementById('fmp-button-container');
            if (!container) return;

            this.customPanelButtons.forEach(btn => btn.remove());
            this.customPanelButtons = [];

            this.bottomButtons.forEach(btn => btn.style.display = showingBaseUI ? 'inline-block' : 'none');

            if (this.customPanelPage > 0) {
                const startIndex = (this.customPanelPage - 1) * 5;
                const panelsToShow = this.customPanels.slice(startIndex, startIndex + 5);

                panelsToShow.forEach((panel, i) => {
                    const btn = document.createElement('div');
                    btn.className = 'interface-btn hover fmp-panel-btn';
                    btn.title = `${panel.pluginId} (${i + 1})`;
                    btn.id = `fmp-panel-btn-${i}`;
                    btn.onclick = () => window.switch_panels(panel.id.replace("ui-panel-", ""));

                    btn.style.backgroundImage = `url('${panel.icon}')`;
                    btn.style.backgroundSize = "cover";
                    btn.style.backgroundPosition = "center";

                    if (this.nextBtn && container.contains(this.nextBtn)) {
                        container.insertBefore(btn, this.nextBtn);
                    } else {
                        container.appendChild(btn);
                    }

                    this.customPanelButtons.push(btn);
                });
            }

            if (this.backBtn && this.nextBtn) {
                this.backBtn.style.display = this.customPanelPage > 0 ? 'inline-block' : 'none';
                this.nextBtn.style.display = this.customPanelPage < pages - 1 ? 'inline-block' : 'none';
            }
        }



    }

    // Add to window and init
    window.FlatmmoPlusPlugin = FlatmmoPlusPlugin;
    window.FlatmmoPlus = new FlatmmoPlus();


})();