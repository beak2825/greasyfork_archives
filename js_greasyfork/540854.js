// ==UserScript==
// @name         Ultra Popup Blocker v2
// @description  A sleek, modern popup blocker with an Apple-inspired glassmorphism UI and advanced redirect protection.
// @namespace    https://github.com/1Tdd
// @author       1Tdd
// @version      2.0.2
// @license      MIT
// @homepage     https://github.com/1Tdd/ultra-popup-blocker
// @homepageURL  https://github.com/1Tdd/ultra-popup-blocker
// @supportURL   https://github.com/1Tdd/ultra-popup-blocker/issues/new
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhdXJvcmEtZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1ODU2RDYiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGMkQ1NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOTgwQSIvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9InRleHQtbWFzayI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTMlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0Rm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siPlVQQjwvdGV4dD48L21hc2s+PC9kZWZzPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMjIiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIyMiIgZmlsbD0idXJsKCNhdXJvcmEtZ3JhZGllbnQpIiBtYXNrPSJ1cmwoI3RleHQtbWFzaykiIC8+PC9zdmc+
// @compatible   firefox Tampermonkey / Violentmonkey
// @compatible   chrome Tampermonkey / Violentmonkey
// @match        *://*/*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/540854/Ultra%20Popup%20Blocker%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/540854/Ultra%20Popup%20Blocker%20v2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /**
     * Constants and Configuration
     */
    const CONSTANTS = {
        TIMEOUT_SECONDS: 15,
        TOAST_DURATION_MS: 2500,
        MODAL_WIDTH_PC: '550px',
        LOGO_SVG: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhdXJvcmEtZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1ODU2RDYiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGMkQ1NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOTgwQSIvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9InRleHQtbWFzayI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTMlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0Rm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siPlVQQjwvdGV4dD48L21hc2s+PC9kZWZzPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMjIiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIyMiIgZmlsbD0idXJsKCNhdXJvcmEtZ3JhZGllbnQpIiBtYXNrPSJ1cmwoI3RleHQtbWFzaykiIC8+PC9zdmc+",
        STORAGE_KEYS: {
            ALL: "allow_",
            DEN: "deny_",
            IDX: "upb_idx_v7",
            CONFIG: "upb_config"
        }
    };

    const globalScope = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const originalOpen = globalScope.open;

    /**
     * CSS Styles
     */
    const STYLES = `
        .upb-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:10px 20px!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.1)!important;font-size:14px!important;font-weight:600!important;cursor:pointer!important;transition:all .2s ease-out!important;line-height:1.2!important;outline:0!important;white-space:nowrap!important}
        .upb-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.upb-btn:active{transform:scale(.96);filter:brightness(.95)}
        .upb-allow{background:linear-gradient(to right,#24D169,#23C15D)!important;color:#003D11!important;border:0!important}
        .upb-trust{background:linear-gradient(to right,#0B84FF,#3DA0FF)!important;color:#fff!important;border:0!important}
        .upb-deny{background:linear-gradient(to right,#FF3B30,#FF453A)!important;color:#fff!important;border:0!important}
        .upb-denyTemp{background:linear-gradient(to right,#5856D6,#6B69D6)!important;color:#fff!important;border:0!important}
        .upb-neutral{background:rgba(118,118,128,.3)!important;color:#fff!important;border-color:rgba(255,255,255,.15)!important}
        .upb-neutral:hover{background:rgba(118,118,128,.5)!important}
        
        #upb-bar{position:fixed!important;bottom:20px!important;left:50%!important;transform:translateX(-50%)!important;z-index:2147483647!important;width:auto!important;max-width:95%!important;padding:12px!important;border-radius:20px!important;display:none;align-items:center!important;gap:15px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;font-size:14px!important;color:#F5F5F7!important;background:rgba(28,28,30,.85)!important;-webkit-backdrop-filter:blur(25px)!important;backdrop-filter:blur(25px)!important;border:1px solid rgba(255,255,255,.15)!important;box-shadow:0 12px 40px 0 rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.15)}
        
        #upb-modal{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:${CONSTANTS.MODAL_WIDTH_PC}!important;z-index:2147483647!important;border-radius:24px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;color:#F5F5F7!important;background:rgba(28,28,30,.9)!important;-webkit-backdrop-filter:blur(25px)!important;backdrop-filter:blur(25px)!important;border:1px solid rgba(255,255,255,.15)!important;box-shadow:0 12px 40px 0 rgba(0,0,0,.4);overflow:hidden!important;display:flex;flex-direction:column;max-height:90vh!important}
        
        #upb-head{padding:16px!important;text-align:center!important;font-size:18px!important;font-weight:600!important;border-bottom:1px solid rgba(255,255,255,.15)!important;background:rgba(255,255,255,.05)!important;display:flex;align-items:center;justify-content:center;gap:10px}
        #upb-body{padding:20px!important;display:flex!important;justify-content:space-between!important;gap:20px!important;overflow-y:auto}
        .upb-col{width:48%}
        #upb-foot{padding:10px 20px!important;text-align:center!important;border-top:1px solid rgba(255,255,255,.15)!important;background:rgba(0,0,0,.1)!important}
        
        .upb-inp{width:100%!important;padding:10px!important;background:rgba(118,118,128,.24)!important;border:1px solid rgba(118,118,128,.32)!important;border-radius:8px!important;color:#F5F5F7!important;font-size:14px!important;box-sizing:border-box!important}
        .upb-list{margin:0!important;padding:0!important;list-style:none!important;max-height:250px!important;overflow-y:auto!important;background:rgba(118,118,128,.12)!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.08)!important}
        .upb-item{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:10px 12px!important;border-bottom:1px solid rgba(118,118,128,.12)!important}
        .upb-del{width:22px!important;height:22px!important;border-radius:50%!important;background:rgba(118,118,128,.24)!important;color:#F5F5F7!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;transition:.2s}
        .upb-del:hover{background:#FF453A!important}
        
        .upb-actions{display:flex;gap:8px;border-left:1px solid rgba(255,255,255,.15);padding-left:15px}
        .upb-info{display:flex;align-items:center;gap:15px}
        .upb-toast{position:fixed!important;bottom:20px!important;right:20px!important;background:rgba(28,28,30,.75)!important;-webkit-backdrop-filter:blur(10px)!important;backdrop-filter:blur(10px)!important;border:1px solid rgba(255,255,255,.1)!important;color:#fff!important;padding:10px 20px!important;border-radius:99px!important;z-index:2147483647!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;font-size:14px!important;box-shadow:0 4px 20px rgba(0,0,0,.4)!important;transition:all .3s ease-in-out!important;pointer-events:none!important}

        .upb-toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); }
        .upb-toggle-label { font-size: 14px; }
        .upb-toggle-switch { position: relative; display: inline-block; width: 40px; height: 24px; }
        .upb-toggle-switch input { opacity: 0; width: 0; height: 0; }
        .upb-slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(120,120,128,0.32); transition: .4s; border-radius: 34px; }
        .upb-slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 2px; bottom: 2px; background-color: white; transition: .4s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
        input:checked + .upb-slider { background-color: #30D158; }
        input:checked + .upb-slider:before { transform: translateX(16px); }

        /* MOBILE OPTIMIZATION */
        @media (max-width: 700px) {
            #upb-bar { flex-direction: column !important; width: 90% !important; padding: 15px !important; bottom: 15px !important; align-items: stretch !important; gap: 12px !important; }
            .upb-info { justify-content: center; margin-bottom: 5px; text-align: center; }
            .upb-actions { border-left: none !important; padding-left: 0 !important; display: grid !important; grid-template-columns: 1fr 1fr; gap: 10px !important; }
            .upb-actions button:last-child { grid-column: span 2; }
            #upb-modal { width: 92% !important; max-height: 85vh !important; }
            #upb-body { flex-direction: column !important; padding: 15px !important; }
            .upb-col { width: 100% !important; margin-bottom: 20px; }
        }
    `;

    /**
     * Enhanced FakeWindow Proxy
     * Mimics a real window object to fool anti-adblock scripts.
     */
    const FakeWindow = (() => {
        const handler = {
            get: (target, prop) => {
                if (prop === 'closed') return true; // Always appear closed to some checks
                if (prop === 'opener') return globalScope; // Mimic opener
                if (typeof prop === 'string' && prop.startsWith('on')) return null; // Event handlers

                // Recursive proxy for nested properties (e.g., document.write)
                return new Proxy(function () { }, handler);
            },
            set: () => true, // Absorb all writes
            apply: () => undefined, // Absorb all function calls
            construct: () => new Proxy({}, handler) // Absorb constructor calls
        };
        return new Proxy(function () { }, handler);
    })();

    /**
     * Event Bus
     */
    const Events = {
        listeners: {},
        on(event, callback) { (this.listeners[event] = this.listeners[event] || []).push(callback); },
        emit(event, data) { if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data)); }
    };

    /**
     * Domain Manager
     * Handles allowing/denying domains and storage interactions.
     */
    class DomainManager {
        /**
         * Retrieves the current index of allowed/denied domains.
         * @returns {Promise<{a: string[], d: string[]}>} The index object containing allow (a) and deny (d) lists.
         */
        static async getIndex() {
            const data = await GM.getValue(CONSTANTS.STORAGE_KEYS.IDX);
            return (data && data.a) ? data : { a: [], d: [] };
        }

        /**
         * Retrieves the current configuration.
         * @returns {Promise<{strictMode: boolean, notifications: boolean}>} The configuration object.
         */
        static async getConfig() {
            const defaults = { strictMode: false, notifications: true };
            const config = await GM.getValue(CONSTANTS.STORAGE_KEYS.CONFIG);
            return { ...defaults, ...config };
        }

        /**
         * Updates the configuration.
         * @param {Object} newConfig - The new configuration properties to merge.
         */
        static async setConfig(newConfig) {
            const current = await this.getConfig();
            await GM.setValue(CONSTANTS.STORAGE_KEYS.CONFIG, { ...current, ...newConfig });
            Events.emit("configChange");
        }

        /**
         * Parses a URL to extract the relevant hostname.
         * Supports explicit localhost handling and TLD extraction logic.
         * @param {string} url - The URL or hostname to parse.
         * @returns {string|null} The parsed hostname or null if parsing fails.
         */
        static parseDomain(url) {
            try {
                if (url.includes('localhost')) return 'localhost';
                let hostname = url.includes("//") ? new URL(url).hostname : url;
                hostname = hostname.trim().toLowerCase().replace(/^www\./, '');

                // Allow simple hostnames without dots (e.g., localhost, internal names)
                if (!hostname.includes('.')) return hostname;

                // Basic TLD handling - can be improved with a public suffix list if needed,
                // but for a userscript, this heuristic is usually sufficient.
                const parts = hostname.split('.');
                const longTLDs = ["co.uk", "com.au", "com.br", "gov.uk", "ac.uk", "co.jp", "ne.jp"];

                if (parts.length > 2 && longTLDs.includes(parts.slice(-2).join('.'))) {
                    return parts.slice(-3).join('.');
                }
                return parts.slice(-2).join('.');
            } catch { return null; }
        }

        /**
         * Determines the state (allow/deny/ask) for a given domain.
         * @param {string} domain - The domain to check.
         * @returns {Promise<"allow"|"deny"|"ask">} The state of the domain.
         */
        static async getDomainState(domain) {
            if (!domain) return "ask";

            // Check exact match first
            if (await GM.getValue(CONSTANTS.STORAGE_KEYS.ALL + domain)) return "allow";
            if (await GM.getValue(CONSTANTS.STORAGE_KEYS.DEN + domain)) return "deny";

            // Check config for strict mode
            const config = await this.getConfig();
            if (config.strictMode) return "deny";

            return "ask";
        }

        /**
         * Modifies the state of a domain in storage.
         * @param {string} domain - The domain to modify.
         * @param {"allow"|"deny"|"remove"} type - The action to perform.
         */
        static async modifyDomain(domain, type) {
            const index = await this.getIndex();

            // Remove from both lists first to ensure no duplicates
            index.a = index.a.filter(x => x !== domain);
            index.d = index.d.filter(x => x !== domain);

            await GM.deleteValue(CONSTANTS.STORAGE_KEYS.ALL + domain);
            await GM.deleteValue(CONSTANTS.STORAGE_KEYS.DEN + domain);

            if (type === 'allow') {
                index.a.push(domain);
                await GM.setValue(CONSTANTS.STORAGE_KEYS.ALL + domain, 1);
            } else if (type === 'deny') {
                index.d.push(domain);
                await GM.setValue(CONSTANTS.STORAGE_KEYS.DEN + domain, 1);
            }

            await GM.setValue(CONSTANTS.STORAGE_KEYS.IDX, index);
            Events.emit("change");
        }
    }

    /**
     * UI Utilities
     */
    const createButton = (text, className, onClick) => {
        const btn = document.createElement("button");
        btn.className = `upb-btn upb-${className}`;
        const [t1, t2] = text.split(/ (.*)/s);
        btn.innerHTML = `<span>${t1}</span>${t2 ? `<span>${t2}</span>` : ''}`;
        btn.onclick = onClick;
        return btn;
    };

    /**
     * Toast Notification
     * Displays transient messages to the user.
     */
    class Toast {
        constructor() {
            /** @type {HTMLElement|null} */
            this.element = null;
            /** @type {number|null} */
            this.timer = null;
        }

        /**
         * Shows a toast message.
         * @param {string} message - The message to display.
         */
        async show(message) {
            const config = await DomainManager.getConfig();
            if (!config.notifications) return;

            if (this.element) this.element.remove();
            if (!document.body) return;

            this.element = document.createElement("div");
            this.element.className = "upb-toast";
            this.element.textContent = message;
            this.element.style.opacity = "0";
            this.element.style.transform = "translateY(10px)";

            document.body.appendChild(this.element);

            requestAnimationFrame(() => {
                if (this.element) {
                    this.element.style.opacity = "1";
                    this.element.style.transform = "translateY(0)";
                }
            });

            this.timer = setTimeout(() => {
                if (this.element) this.element.remove();
                this.element = null;
            }, CONSTANTS.TOAST_DURATION_MS);
        }
    }

    /**
     * Action Bar (Bottom Bar)
     * Handles the UI interactions when a popup is blocked.
     */
    class NotificationBar {
        constructor() {
            /** @type {HTMLElement|null} */
            this.element = null;
            /** @type {number|null} */
            this.timer = null;
            /** @type {number} */
            this.count = CONSTANTS.TIMEOUT_SECONDS;
        }

        /**
         * Displays the notification bar for a blocked URL.
         * @param {string} url - The URL of the blocked popup.
         */
        show(url) {
            if (!this.element) {
                this.element = document.createElement("div");
                this.element.id = "upb-bar";
                document.body.appendChild(this.element);
            }

            this.count = CONSTANTS.TIMEOUT_SECONDS;
            if (this.timer) clearInterval(this.timer);

            this.element.style.display = "flex";
            this.element.innerHTML = '';
            Shield.arm();

            const domain = DomainManager.parseDomain(location.hostname);
            const denyBtn = createButton(`🚫 Deny (${this.count})`, "denyTemp", () => this.hide());

            const info = document.createElement("div");
            info.className = "upb-info";
            info.innerHTML = `<img src="${CONSTANTS.LOGO_SVG}" style="width:20px;height:20px"><span>Blocked popup to <a href="${url}" target="_blank" style="color:#64D2FF;text-decoration:none">${url.length > 40 ? url.substring(0, 40) + '...' : url}</a></span>`;

            const actions = document.createElement("div");
            actions.className = "upb-actions";
            actions.append(
                createButton("✅ Allow Once", "allow", () => {
                    this.hide();
                    Shield.pass(() => originalOpen(url));
                }),
                createButton("💙 Trust", "trust", () => {
                    this.hide();
                    DomainManager.modifyDomain(domain, 'allow');
                }),
                createButton("❌ Block", "deny", () => {
                    if (confirm(`Permanently block ${domain}?`)) {
                        this.hide();
                        DomainManager.modifyDomain(domain, 'deny');
                    }
                }),
                denyBtn,
                createButton("⚙️", "neutral", () => ConfigUI.show())
            );

            this.element.append(info, actions);

            this.timer = setInterval(() => {
                this.count--;
                const span = denyBtn.querySelector("span:last-child");
                if (span) span.textContent = `Deny (${this.count})`;
                if (this.count <= 0) this.hide();
            }, 1000);
        }

        /**
         * Hides the notification bar and disarms the shield.
         */
        hide() {
            Shield.disarm();
            if (this.timer) clearInterval(this.timer);
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    }

    /**
     * Configuration UI
     * Manages the settings modal and user interactions.
     */
    class ConfigManager {
        constructor() {
            /** @type {HTMLElement|null} */
            this.element = null;
            /** @type {(e: KeyboardEvent) => void} */
            this.escapeHandler = null;

            Events.on("change", () => this.element && this.refreshLists());
            Events.on("configChange", () => this.element && this.refreshConfig());
        }

        /**
         * Toggles the visibility of the configuration modal.
         */
        show() {
            if (this.element) return this.hide();
            InputShield.arm();

            this.element = document.createElement("div");
            this.element.id = "upb-modal";
            this.element.innerHTML = `
                <div id="upb-head"><img src="${CONSTANTS.LOGO_SVG}" style="width:24px">Ultra Popup Blocker</div>
                <div style="padding: 0 20px;">
                    <div class="upb-toggle-row">
                        <span class="upb-toggle-label">Strict Mode (Block All by Default)</span>
                        <label class="upb-toggle-switch">
                            <input type="checkbox" id="upb-strict-mode">
                            <span class="upb-slider"></span>
                        </label>
                    </div>
                    <div class="upb-toggle-row">
                        <span class="upb-toggle-label">Show Toast Notifications</span>
                        <label class="upb-toggle-switch">
                            <input type="checkbox" id="upb-notifications">
                            <span class="upb-slider"></span>
                        </label>
                    </div>
                </div>
                <div id="upb-body"></div>
                <div id="upb-foot"></div>
            `;

            const body = this.element.querySelector("#upb-body");
            body.append(this.createColumn("Allowed", "allow"), this.createColumn("Denied", "deny"));

            this.element.querySelector("#upb-foot").appendChild(createButton("Close", "neutral", () => this.hide()));

            document.body.appendChild(this.element);

            this.refreshLists();
            this.bindConfigEvents();

            this.escapeHandler = e => { if (e.key === 'Escape') this.hide(); };
            window.addEventListener('keydown', this.escapeHandler);
        }

        /**
         * Closes the configuration modal.
         */
        hide() {
            InputShield.disarm();
            if (this.element) this.element.remove();
            this.element = null;
            if (this.escapeHandler) {
                window.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }
        }

        /**
         * Binds event listeners to the configuration toggles.
         */
        async bindConfigEvents() {
            const config = await DomainManager.getConfig();
            const strictCheck = this.element.querySelector('#upb-strict-mode');
            const notifyCheck = this.element.querySelector('#upb-notifications');

            if (strictCheck) {
                strictCheck.checked = config.strictMode;
                strictCheck.onchange = e => DomainManager.setConfig({ strictMode: e.target.checked });
            }
            if (notifyCheck) {
                notifyCheck.checked = config.notifications;
                notifyCheck.onchange = e => DomainManager.setConfig({ notifications: e.target.checked });
            }
        }

        /**
         * Creates a column in the UI for allow/deny lists.
         * @param {string} title - Column title.
         * @param {"allow"|"deny"} type - The list type.
         * @returns {HTMLElement} The column element.
         */
        createColumn(title, type) {
            const col = document.createElement("div");
            col.className = "upb-col";

            const input = document.createElement("input");
            input.className = "upb-inp";
            input.placeholder = "domain.com";
            input.setAttribute("autocorrect", "off");
            input.setAttribute("autocapitalize", "off");
            input.setAttribute("spellcheck", "false");
            input.setAttribute("data-upb-input", "true");

            const list = document.createElement("ul");
            list.className = `upb-list upb-l-${type}`;

            const addBtn = createButton("Add", "trust", () => {
                const domain = DomainManager.parseDomain(input.value);
                if (domain) {
                    input.value = "";
                    DomainManager.modifyDomain(domain, type);
                }
            });

            input.onkeydown = e => e.key === "Enter" && addBtn.click();

            const header = document.createElement("h3");
            header.textContent = title;
            header.style.cssText = "margin:0 0 10px 0;text-align:center";

            const form = document.createElement("div");
            form.style.cssText = "display:flex;gap:8px;margin-bottom:10px";
            form.append(input, addBtn);

            col.append(header, form, list);
            return col;
        }

        /**
         * Refreshes the allow/deny lists from storage.
         */
        async refreshLists() {
            const index = await DomainManager.getIndex();

            const updateList = (selector, items) => {
                const ul = this.element.querySelector(selector);
                if (!ul) return;
                ul.innerHTML = '';
                (items || []).sort().forEach(domain => {
                    const li = document.createElement("li");
                    li.className = "upb-item";
                    li.innerHTML = `<span>${domain}</span>`;

                    const delBtn = document.createElement("div");
                    delBtn.className = "upb-del";
                    delBtn.textContent = "×";
                    delBtn.onclick = () => DomainManager.modifyDomain(domain, 'remove');

                    li.appendChild(delBtn);
                    ul.appendChild(li);
                });
            };

            updateList('.upb-l-allow', index.a);
            updateList('.upb-l-deny', index.d);
        }

        /**
         * Updates the UI to match the current configuration.
         */
        async refreshConfig() {
            // Re-bind to update UI state if changed externally
            this.bindConfigEvents();
        }
    }

    /**
     * Redirect Shield
     * Prevents pages from redirecting the current tab when a popup is blocked.
     */
    const Shield = {
        active: false,
        passing: false,
        handler(e) {
            if (!this.passing) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        },
        arm() {
            if (!this.active) {
                window.addEventListener("beforeunload", this.handler.bind(this), true);
                this.active = true;
            }
        },
        disarm() {
            if (this.active) {
                window.removeEventListener("beforeunload", this.handler.bind(this), true);
                this.active = false;
            }
        },
        pass(callback) {
            this.passing = true;
            if (callback) callback();
            setTimeout(() => this.passing = false, 500);
        }
    };

    /**
     * Input Shield (Anti-PreventDefault Shield)
     * Protects UPB input fields from hostile websites that block keyboard events.
     */
    const InputShield = {
        active: false,
        eventTypes: ['keydown', 'keypress', 'keyup', 'input', 'beforeinput'],

        handler(e) {
            const target = e.target;
            // Check if the event target is a UPB input field
            if (target && target.hasAttribute && target.hasAttribute('data-upb-input')) {
                // Stop the event from reaching hostile site listeners
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        },

        arm() {
            if (this.active) return;
            this.boundHandler = this.handler.bind(this);
            this.eventTypes.forEach(type => {
                // Use capturing phase with highest priority
                document.addEventListener(type, this.boundHandler, true);
            });
            this.active = true;
        },

        disarm() {
            if (!this.active) return;
            this.eventTypes.forEach(type => {
                document.removeEventListener(type, this.boundHandler, true);
            });
            this.active = false;
        }
    };

    // --- INITIALIZATION & MAIN LOGIC ---
    const ConfigUI = new ConfigManager();
    const Notification = new NotificationBar();
    let CurrentState = "ask";
    let DenyToastDebounce = 0;

    async function loadState() {
        const domain = DomainManager.parseDomain(location.hostname);
        CurrentState = await DomainManager.getDomainState(domain);
    }

    function handleDeny() {
        Shield.arm();
        const now = Date.now();
        if (now - DenyToastDebounce > 1000) {
            globalScope._upb_toast.show("🚫 Popup Blocked");
            DenyToastDebounce = now;
        }
        return FakeWindow;
    }

    function trapEvent(e) {
        if (CurrentState === "allow") return;

        let isPopup = false;
        let url = "";

        // Handle Click and AuxClick (Middle Mouse)
        if (e.type === "click" || e.type === "auxclick") {
            const link = e.target.closest("a");
            if (link && link.href && !link.hasAttribute('download')) {
                // Check for target="_blank" or middle click
                const isBlank = link.target === "_blank" || (document.querySelector('base[target="_blank"]') && link.target !== "_self");
                const isMiddleClick = e.type === "auxclick" && e.button === 1;

                if (isBlank || isMiddleClick) {
                    isPopup = true;
                    url = link.href;
                }
            }
        } else if (e.type === "submit") {
            const form = e.target.closest("form");
            if (form && form.target === "_blank") {
                isPopup = true;
                url = form.action || location.href;
            }
        }

        if (isPopup) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (CurrentState === "deny") handleDeny();
            else Notification.show(url);
        }
    }

    function overrideOpen() {
        const handler = {
            value: function (url) {
                if (CurrentState === "allow") return originalOpen.apply(this, arguments);
                if (CurrentState === "deny") return handleDeny();

                Notification.show(url);
                return FakeWindow;
            },
            writable: false,
            configurable: false
        };

        try { Object.defineProperty(globalScope, 'open', handler); }
        catch { globalScope.open = handler.value; }
    }

    // Main Entry Point
    (async () => {
        globalScope._upb_toast = new Toast();

        // Inject CSS
        if (!document.getElementById('upb-css')) {
            const style = document.createElement("style");
            style.id = 'upb-css';
            style.textContent = STYLES;
            (document.head || document.documentElement).appendChild(style);
        }

        await loadState();
        overrideOpen();

        // Event Listeners
        window.addEventListener("click", trapEvent, true);
        window.addEventListener("auxclick", trapEvent, true); // Middle click support
        window.addEventListener("submit", trapEvent, true);

        // Universal pointerdown for robust mobile/PC interaction
        window.addEventListener("pointerdown", e => {
            const link = e.target.closest('a');
            if (link && link.href && link.target !== '_blank' && !link.href.startsWith('javascript:')) {
                Shield.pass();
            }
        }, true);

        // Watch for overrides of window.open
        let mutationTimer;
        const observer = new MutationObserver(() => {
            clearTimeout(mutationTimer);
            mutationTimer = setTimeout(() => {
                if (globalScope.open === originalOpen) overrideOpen();
            }, 200);
        });

        if (document.body) observer.observe(document.body, { childList: true, subtree: true });

        // Listen for state changes
        Events.on("change", async () => {
            await loadState();
            overrideOpen();
        });

        Events.on("configChange", async () => {
            await loadState();
        });

        // Register Menu Command
        GM.registerMenuCommand("⚙️ Settings", () => ConfigUI.show());
    })();
})();
