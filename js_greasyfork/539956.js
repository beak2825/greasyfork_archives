// ==UserScript==
// @name         Hide Discord Sidebar
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Hides the Discord server and/or channel list for a cleaner interface. Provides auto-hiding modes and manual override buttons.
// @author       https://github.com/patrickxchong/hide-discord-sidebar
// @match        https://discord.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-body
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/539956/Hide%20Discord%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/539956/Hide%20Discord%20Sidebar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- USER CONFIGURATION ---
    const DEFAULT_CONFIG = {
        active: true, // true: 脚本默认启用, false: 默认禁用
        // "server-autohide": 窗口窄时自动隐藏, "server-disable": 总是隐藏, "server-show": 总是显示
        servers: "server-autohide",
        // "channel-autohide": 窗口窄时自动隐藏, "channel-hide": 总是隐藏, "channel-show": 总是显示
        channels: "channel-autohide",
        // "自动隐藏"模式下，触发隐藏的窗口宽度（单位：像素）
        smallWindowWidth: 1100
    };

    // --- INJECTED CSS ---
    const styles = `
        body.hide-dis-bar .container-3gCOGc { z-index: 0; }
        #hds-btn, #hds-btn-channels { display: none; }

        body.hide-dis-bar #hds-btn,
        body.hide-dis-bar #hds-btn-channels {
            display: block;
            background: #4f5660;
            color: white;
            padding: 4px 8px;
            position: absolute;
            top: 5px;
            z-index: 1000;
            border-radius: 4px;
            border: none;
            cursor: pointer;
            font-size: 12px;
            font-weight: 500;
            height: 24px;
            box-sizing: border-box;
            -webkit-user-select: none; /* Safari */
            -ms-user-select: none; /* IE 10+ */
            user-select: none; /* Standard syntax */
        }
        body.hide-dis-bar #hds-btn:hover,
        body.hide-dis-bar #hds-btn-channels:hover {
            background: #6a717c;
        }

        /* Positioning for the buttons */
        body.hide-dis-bar #hds-btn {
            right: 212px; /* Position for server button */
            width: 95px;
        }
        body.hide-dis-bar #hds-btn-channels {
            right: 104px; /* Position for channel button */
            width: 102px;
        }

        /* === CHANNEL HIDING LOGIC (FIXED) === */
        /* Use the more specific 'sidebarList_' selector as identified */
        body.hide-dis-bar.channel-hide div[class*="sidebarList_"] {
            transition: width 0.2s ease, min-width 0.2s ease, padding 0.2s ease;
            width: 0 !important;
            min-width: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
        }
        body.hide-dis-bar.channel-hide div[class*="sidebarList_"]:hover {
            width: 240px !important;
        }
        body.hide-dis-bar.channel-hide div[class*="sidebarList_"] > * {
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s 0.2s, opacity 0.2s linear;
        }
        body.hide-dis-bar.channel-hide div[class*="sidebarList_"]:hover > * {
            visibility: visible;
            opacity: 1;
            transition: opacity 0.2s linear 0.1s;
        }
    `;
    GM_addStyle(styles);

    // --- SCRIPT LOGIC (Unchanged) ---
    const HDS = {
        state: {},
        $refs: {
            guildsWrapper: null,
            btnServers: null,
            btnChannels: null,
        },

        async loadState() {
            const savedState = await GM_getValue('hds_state', null);
            this.state = savedState ? { ...DEFAULT_CONFIG, ...JSON.parse(savedState) } : { ...DEFAULT_CONFIG };
        },

        async saveState() {
            await GM_setValue('hds_state', JSON.stringify(this.state));
        },

        stateChangeHandler() {
            try {
                if (!this.$refs.btnServers || !this.$refs.btnChannels) return false;

                const isSmallWindow = window.innerWidth <= this.state.smallWindowWidth;
                document.body.classList.toggle("hide-dis-bar", this.state.active);

                const shouldHideServers = this.state.active &&
                    (this.state.servers === 'server-disable' || (this.state.servers === 'server-autohide' && isSmallWindow));

                const guildsWrapper = this.getServers();
                if (guildsWrapper) {
                    guildsWrapper.style.display = shouldHideServers ? 'none' : 'flex';
                    this.$refs.btnServers.textContent = shouldHideServers ? "Show Servers" : "Hide Servers";
                }

                const shouldHideChannels = this.state.active &&
                    (this.state.channels === 'channel-hide' || (this.state.channels === 'channel-autohide' && isSmallWindow));

                document.body.classList.toggle("channel-hide", shouldHideChannels);
                this.$refs.btnChannels.textContent = shouldHideChannels ? "Show Channels" : "Hide Channels";

                return true;
            } catch (error) {
                // console.error(error);
                return false;
            }
        },

        getServers() {
            return document.querySelector('[class*="guildsWrapper"]') ||
                   document.querySelector('[class*="wrapper-"][class*="guilds"]') ||
                   document.querySelector("nav[class*=wrapper-]") ||
                   document.querySelector("nav[class*=guilds]") ||
                   document.querySelector("nav[aria-label*='Servers']");
        },

        init() {
            if (!this.getServers() || document.getElementById("hds-btn")) {
                return !!document.getElementById("hds-btn");
            }

            const btnServers = document.createElement("button");
            btnServers.id = "hds-btn";
            btnServers.onclick = () => {
                const guildsWrapper = this.getServers();
                const isHidden = !guildsWrapper || guildsWrapper.style.display === 'none';
                this.state.servers = isHidden ? 'server-show' : 'server-disable';
                this.saveState();
                this.stateChangeHandler();
            };
            document.body.appendChild(btnServers);
            this.$refs.btnServers = btnServers;

            const btnChannels = document.createElement("button");
            btnChannels.id = "hds-btn-channels";
            btnChannels.onclick = () => {
                const isHidden = document.body.classList.contains('channel-hide');
                this.state.channels = isHidden ? 'channel-show' : 'channel-hide';
                this.saveState();
                this.stateChangeHandler();
            };
            document.body.appendChild(btnChannels);
            this.$refs.btnChannels = btnChannels;

            let resizeTimeout;
            window.addEventListener('resize', () => {
                clearTimeout(resizeTimeout);
                resizeTimeout = setTimeout(() => this.stateChangeHandler(), 250);
            });

            return true;
        },
    };

    // --- MAIN EXECUTION ---
    async function main() {
        await HDS.loadState();

        const logStyles = 'background: linear-gradient(180deg, #667eea 0%, #764ba2 100%); border: 1px solid #3E0E02; color: white; display: block; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3); line-height: 40px; text-align: center; font-weight: bold; font-size: 18px;';

        let initialised = false;
        const initInterval = setInterval(() => {
            if (!initialised) {
                initialised = HDS.init();
            }

            if (initialised) {
                const handlerSuccess = HDS.stateChangeHandler();
                if (handlerSuccess) {
                    console.log('%c Hide Discord Sidebar (Userscript) Activated ', logStyles);
                    clearInterval(initInterval);
                }
            }
        }, 500);
    }

    main();
})();