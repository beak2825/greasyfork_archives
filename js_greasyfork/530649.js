// ==UserScript==
// @name         Steam Games Export with WebSocket
// @namespace    steamutils
// @version      0.7.4
// @description  Auto-exports Steam games list with WebSocket login automation support
// @author       mustafachyi
// @match        *://steamcommunity.com/*
// @grant        GM_cookie
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      steamcommunity.com
// @connect      localhost
// @connect      127.0.0.1
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530649/Steam%20Games%20Export%20with%20WebSocket.user.js
// @updateURL https://update.greasyfork.org/scripts/530649/Steam%20Games%20Export%20with%20WebSocket.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Configuration
    const CONFIG = {
        urls: {
            base: 'https://steamcommunity.com',
            login: '/login/home/',
            games: '/games'
        },
        storage: {
            profiles: 'steam_exported_profiles',
            username: 'steam_last_username',
            mode: 'steam_export_mode'
        },
        retry: { max: 20, delay: 500, loginCheck: 1500 },
        ui: { notifyDuration: 3000, animDuration: 300 },
        keys: { logout: { ctrl: true, alt: true, key: 'l' } },
        ws: { url: 'ws://127.0.0.1:27060', fallback: true }
    };

    // URL utilities
    const url = {
        isLogin: () => location.href.includes('/login/home'),
        isGames: () => location.pathname.includes('/games'),
        isProfile: () => /\/(?:id|profiles)\/[^\/]+(?:\/home|\/?$)/.test(location.pathname),
        isFamilyPin: () => location.href.includes('/my/goto'),
        getBase: () => (location.href.match(/(.*\/(?:id|profiles)\/[^\/]+)(?:\/home)?/) || [])[1] || null,
        getSteamId: () => {
            const match = location.pathname.match(/\/(?:id|profiles)\/([^\/]+)(?:\/home)?/);
            return match ? match[1] : null;
        },
        resolveVanityURL: async (vanityURL) => {
            return utils.request(`https://steamcommunity.com/id/${vanityURL}?xml=1`, {
                parser: res => {
                    const steamID64 = res.responseText.match(/<steamID64>(\d+)<\/steamID64>/);
                    return steamID64 ? steamID64[1] : null;
                }
            });
        }
    };

    // Early URL handling
    if (location.href === `${CONFIG.urls.base}/` || location.href === CONFIG.urls.base) {
        location.replace(`${CONFIG.urls.base}${CONFIG.urls.login}`);
        return;
    }

    const profileMatch = location.pathname.match(/^\/(id|profiles)\/([^\/]+)(?:\/(?:home)?)?$/);
    if (profileMatch) {
        const [, type, id] = profileMatch;
        try {
            const profiles = JSON.parse(localStorage.getItem(CONFIG.storage.profiles) || '{}');
            if (profiles[id] === undefined) {
                location.replace(`${CONFIG.urls.base}/${type}/${id}${CONFIG.urls.games}`);
                return;
            }
        } catch {}
    }

    // Utilities
    const utils = {
        setReactValue(input, value) {
            Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(input, value);
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        },

        async handleLogin(loginButton) {
            const [userInput, passInput] = document.querySelectorAll('input._2GBWeup5cttgbTw8FM3tfx');
            
            if (userInput && passInput && loginButton) {
                try {
                    loginButton.click();
                    setTimeout(() => {
                        if (url.isLogin()) ws.send({ type: 'login_failed' });
                    }, CONFIG.retry.loginCheck);
                    return true;
                } catch (e) {
                    console.log('Login error:', e);
                }
            }
            
            const form = document.querySelector('form._2v60tM463fW0V7GDe92E5f');
            if (form) {
                try {
                    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
                    setTimeout(() => {
                        if (url.isLogin()) ws.send({ type: 'login_failed' });
                    }, CONFIG.retry.loginCheck);
                    return true;
                } catch (e) {
                    console.log('Form submission error:', e);
                }
            }
            
            return false;
        },

        request: (url, { method = 'GET', parser } = {}) => new Promise(resolve => 
            GM_xmlhttpRequest({
                method,
                url,
                onload: res => resolve(parser ? parser(res) : res),
                onerror: () => resolve(null)
            })
        )
    };

    // WebSocket handler
    const ws = {
        conn: null,
        connected: false,
        mode: localStorage.getItem(CONFIG.storage.mode) || 'manual',
        
        connect() {
            if (this.conn?.readyState <= WebSocket.OPEN) return;
            
            try {
                this.conn = new WebSocket(CONFIG.ws.url);
                
                this.conn.onopen = () => {
                    this.send({ type: 'identify', client: 'userscript', version: '0.7.4' });
                    this.connected = true;
                };
                
                this.conn.onmessage = ({ data }) => {
                    try {
                        const msg = JSON.parse(data);
                        const handler = this.handlers[msg.type];
                        handler && handler(msg);
                    } catch {}
                };
                
                this.conn.onclose = this.conn.onerror = () => {
                    this.cleanup();
                    if (CONFIG.ws.fallback && url.isLogin()) this.fallback = true;
                };
            } catch {
                this.cleanup();
                if (CONFIG.ws.fallback && url.isLogin()) this.fallback = true;
            }
        },

        handlers: {
            connected(msg) {
                if (ws.mode === msg.mode) return;
                ws.mode = msg.mode;
                localStorage.setItem(CONFIG.storage.mode, ws.mode);
                ui.notify('Connected', `Server connected in ${ws.mode} mode`);
            },
            manual_mode() {
                if (ws.mode === 'manual') return;
                ws.mode = 'manual';
                localStorage.setItem(CONFIG.storage.mode, 'manual');
                ui.notify('Mode Changed', 'Switched to manual mode');
            },
            account_data(msg) {
                const [user, pass] = msg.credentials.split(':').map(s => s.trim());
                auth.fillCredentials(user, pass);
            },
            all_done() {
                ui.notify('Complete', 'All accounts have been processed');
            }
        },

        send(data) {
            return this.conn?.readyState === WebSocket.OPEN && this.conn.send(JSON.stringify(data));
        },

        cleanup() {
            if (this.conn) {
                this.conn.close();
                this.conn = null;
                this.connected = false;
            }
        }
    };

    // UI components
    const ui = {
        styles: `
            .steam_export_notification{position:fixed;bottom:20px;right:20px;background:#1b2838;border:1px solid #66c0f4;color:#fff;padding:15px;border-radius:3px;box-shadow:0 0 10px rgba(0,0,0,.5);z-index:9999;font-family:"Motiva Sans",Arial,sans-serif;animation:steamNotificationSlide .3s ease-out;display:flex;align-items:center;gap:10px;min-width:280px}
            .steam_export_notification .icon{width:24px;height:24px;background:#66c0f4;border-radius:3px;display:flex;align-items:center;justify-content:center}
            .steam_export_notification .content{flex-grow:1}
            .steam_export_notification .title{font-weight:700;margin-bottom:3px;color:#66c0f4}
            .steam_export_notification .message{font-size:12px;color:#acb2b8}
            @keyframes steamNotificationSlide{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
            .steam_export_btn{display:inline-flex;align-items:center;padding:0 15px;line-height:24px;border-radius:2px;background:#101822;color:#fff;margin-left:10px;cursor:pointer;border:none;font-family:"Motiva Sans",Arial,sans-serif;transition:all .25s ease}
            .steam_export_btn:hover{background:#4e92b9}
            body.login .responsive_page_frame{height:100vh!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}
            body.login .responsive_page_content{flex:1!important;overflow:hidden!important;display:flex!important;flex-direction:column!important}
            body.login .responsive_page_template_content{flex:1!important;display:flex!important;flex-direction:column!important;justify-content:center!important;align-items:center!important;min-height:0!important}
            body.login .page_content{margin:0!important;padding:0 16px!important;width:100%!important;max-width:740px!important;box-sizing:border-box!important}
            body.login #footer,body.login #global_header,body.login .responsive_header{position:relative!important}
            body.login #footer{margin-top:auto!important;padding:16px 0!important}
            body.login #footer_spacer{display:none!important}
            body.login #global_header{padding:16px 0!important}
            body.login .responsive_header{padding:12px 0!important}
            body.login .login_bottom_row{margin:16px 0!important}
            body.login [data-featuretarget="login"]{margin:0!important;padding:16px!important;background:rgba(0,0,0,0.2)!important;border-radius:4px!important;box-shadow:0 0 10px rgba(0,0,0,0.3)!important}
        `.replace(/\s+/g, ' '),

        init() {
            const style = document.createElement('style');
            style.textContent = this.styles;
            (document.head || document.documentElement).appendChild(style);
        },

        notify(title, message) {
            const el = document.createElement('div');
            el.className = 'steam_export_notification';
            el.innerHTML = `<div class="icon">✓</div><div class="content"><div class="title">${title}</div><div class="message">${message}</div></div>`;
            document.body.appendChild(el);
            
            setTimeout(() => {
                el.style.animation = 'steamNotificationSlide 0.3s ease-in reverse';
                setTimeout(() => el.remove(), CONFIG.ui.animDuration);
            }, CONFIG.ui.notifyDuration);
        },

        addExportButton() {
            const btn = document.createElement('a');
            btn.className = 'steam_export_btn';
            btn.textContent = 'Export Games';
            btn.onclick = () => games.exportFromConfig();

            const observer = new MutationObserver((_, obs) => {
                const header = document.querySelector('.profile_small_header_text');
                if (header) {
                    header.appendChild(btn);
                    obs.disconnect();
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        }
    };

    // Storage management
    const storage = {
        get(key) {
            try {
                return JSON.parse(localStorage.getItem(key) || '{}');
            } catch {
                return {};
            }
        },

        set(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },

        markExported(steamId, count) {
            const profiles = this.get(CONFIG.storage.profiles);
            profiles[steamId] = count;
            this.set(CONFIG.storage.profiles, profiles);
        },

        shouldExport(steamId, count) {
            const profiles = this.get(CONFIG.storage.profiles);
            return profiles[steamId] === undefined || profiles[steamId] !== count;
        }
    };

    // Games management
    const games = {
        async waitForData(retries = 0) {
            const config = document.getElementById('gameslist_config')?.dataset.profileGameslist;
            if (!config) {
                if (retries < CONFIG.retry.max) {
                    setTimeout(() => this.waitForData(retries + 1), CONFIG.retry.delay);
                }
                return;
            }

            try {
                const data = JSON.parse(config);
                if (!data.rgGames?.length) return;

                if (storage.shouldExport(data.strSteamId, data.rgGames.length)) {
                    await this.export(data, true);
                    storage.markExported(data.strSteamId, data.rgGames.length);
                }
                !document.querySelector('.steam_export_btn') && ui.addExportButton();
            } catch {}
        },

        async exportFromConfig() {
            const config = document.getElementById('gameslist_config')?.dataset.profileGameslist;
            if (!config) return;

            try {
                const data = JSON.parse(config);
                if (data.rgGames?.length) {
                    await this.export(data);
                    storage.markExported(data.strSteamId, data.rgGames.length);
                }
            } catch {}
        },

        async export(data, isAutoExport = false) {
            const username = localStorage.getItem(CONFIG.storage.username) || data.strProfileName || 'unknown';
            const content = data.rgGames.map(g => g.name).join('\n');
            const url = URL.createObjectURL(new Blob([content], { type: 'text/plain' }));
            const cleanup = setTimeout(() => URL.revokeObjectURL(url), 30000);

            try {
                await new Promise((resolve, reject) => {
                    GM_download({
                        url,
                        name: `steam_games/${username}_games.txt`,
                        saveAs: false,
                        onload: resolve,
                        onerror: reject
                    });
                });

                ui.notify('Games List Exported', `Saved ${data.rgGames.length} games to steam_games/${username}_games.txt`);
                isAutoExport && typeof Logout === 'function' && setTimeout(Logout, 1000);
            } catch (error) {
                if (error.includes('No such file or directory')) {
                    await new Promise(resolve => {
                        GM_download({
                            url: 'data:text/plain;base64,',
                            name: 'steam_games/.folder',
                            saveAs: false,
                            onload: resolve
                        });
                    });
                    return this.export(data, isAutoExport);
                }
                ui.notify('Export Failed', 'Could not save games list. Please try again.');
            } finally {
                clearTimeout(cleanup);
                URL.revokeObjectURL(url);
            }
        },

        async resolveID(idOrVanity) {
            if (/^\d+$/.test(idOrVanity)) return idOrVanity;
            return await url.resolveVanityURL(idOrVanity) || idOrVanity;
        },

        async getCount(idOrVanity) {
            const resolvedID = await this.resolveID(idOrVanity);
            const urlPath = /^\d+$/.test(resolvedID) ? `profiles/${resolvedID}` : `id/${resolvedID}`;
            return utils.request(`${CONFIG.urls.base}/${urlPath}/games`, {
                parser: res => {
                    const doc = new DOMParser().parseFromString(res.responseText, 'text/html');
                    const data = JSON.parse(doc.getElementById('gameslist_config')?.dataset.profileGameslist || '{}');
                    return data.rgGames?.length || null;
                }
            });
        }
    };

    // Authentication
    const auth = {
        setupLoginCapture() {
            const observer = new MutationObserver((_, obs) => {
                const form = document.querySelector('form._2v60tM463fW0V7GDe92E5f');
                if (!form) return;

                const [userInput, passInput] = form.querySelectorAll('input._2GBWeup5cttgbTw8FM3tfx');
                if (!userInput || !passInput) return;
                
                const loginButton = form.querySelector('button.DjSvCZoKKfoNSmarsEcTS');
                if (!loginButton) return;

                userInput.addEventListener('paste', e => {
                    const text = (e.clipboardData || window.clipboardData).getData('text');
                    if (!text.includes(':')) return;
                    e.preventDefault();
                    const [user, pass] = text.split(':').map(s => s.trim());
                    this.fillCredentials(user, pass);
                });

                if (!ws.fallback) {
                    ws.connect();
                    setTimeout(() => ws.send({ type: 'ready_for_login' }), 500);
                }

                loginButton.addEventListener('click', () => {
                    const username = userInput.value.trim();
                    username && localStorage.setItem(CONFIG.storage.username, username);
                });

                obs.disconnect();
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        },

        fillCredentials(user, pass) {
            if (!user || !pass) return;
            
            const form = document.querySelector('form._2v60tM463fW0V7GDe92E5f');
            if (!form) return;

            const [userInput, passInput] = form.querySelectorAll('input._2GBWeup5cttgbTw8FM3tfx');
            const loginButton = form.querySelector('button.DjSvCZoKKfoNSmarsEcTS');
            if (!userInput || !passInput || !loginButton) return;

            utils.setReactValue(userInput, user);
            utils.setReactValue(passInput, pass);
            localStorage.setItem(CONFIG.storage.username, user);
            ui.notify('Credentials Filled', 'Username and password have been entered');

            ws.connected && setTimeout(() => {
                ws.send({ type: 'credentials_filled' });
                utils.handleLogin(loginButton);
            }, 1000);
        },

        async checkState() {
            return utils.request(`${CONFIG.urls.base}/my/`, {
                parser: res => !res.finalUrl.includes('/login')
            });
        },

        setupLogout() {
            document.addEventListener('keydown', e => {
                const { ctrl, alt, key } = CONFIG.keys.logout;
                if ((!ctrl || e.ctrlKey) && (!alt || e.altKey) && e.key.toLowerCase() === key) {
                    e.preventDefault();
                    typeof Logout === 'function' && Logout();
                }
            }, true);
        }
    };

    // Login page optimization
    if (location.href.includes('/login/home')) {
        const blockStyle = document.createElement('style');
        blockStyle.textContent = `#footer,#global_header,.login_bottom_row{display:none!important;visibility:hidden!important;opacity:0!important;pointer-events:none!important;position:absolute!important;width:0!important;height:0!important;overflow:hidden!important;clip:rect(0,0,0,0)!important}`;
        document.documentElement.appendChild(blockStyle);

        const observer = new MutationObserver(mutations => {
            for (const { addedNodes } of mutations) {
                for (const node of addedNodes) {
                    if (node.nodeType !== 1) continue;
                    if (node.matches?.('#footer,#global_header,.login_bottom_row') && node.parentNode) {
                        node.remove();
                    }
                    if (node.querySelectorAll) {
                        node.querySelectorAll('#footer,#global_header,.login_bottom_row').forEach(el => {
                            if (el && el.parentNode) el.remove();
                        });
                    }
                }
            }
        });

        observer.observe(document.documentElement, { childList: true, subtree: true });
        window.addEventListener('load', () => observer.disconnect(), { once: true });
    }

    // Initialization
    document.addEventListener('DOMContentLoaded', async () => {
        ui.init();
        auth.setupLogout();

        if (url.isLogin()) return auth.setupLoginCapture();
        if (url.isGames()) return games.waitForData();
        if (url.isFamilyPin()) {
            ui.notify('Family Pin Protected', 'Account is protected by family pin. Logging out...');
            setTimeout(() => typeof Logout === 'function' && Logout(), 1000);
            return;
        }
        if (!await auth.checkState()) return (location.href = CONFIG.urls.login);
        
        if (url.isProfile()) {
            const steamId = url.getSteamId();
            if (!steamId) return;

            const profiles = storage.get(CONFIG.storage.profiles);
            const idKey = await games.resolveID(steamId);
            const prevCount = profiles[idKey];
            
            if (prevCount !== undefined) {
                const currCount = await games.getCount(steamId);
                if (!currCount || currCount === prevCount) return;
            }

            const base = url.getBase();
            base && (location.href = base + CONFIG.urls.games);
        }
    });
})();