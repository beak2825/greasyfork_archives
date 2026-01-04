// ==UserScript==
// @name         MOOMOO.IO Utility Mod! (Scrollable Inventory, Wearables Hotbar, Typing Indicator, & More!)
// @namespace    https://greasyfork.org/users/137913
// @description  Enhances MooMoo.io with mini-mods to level the playing field against cheaters whilst being fair to non-script users.
// @license      GNU GPLv3 with the condition: no auto-heal or instant kill features may be added to the licensed material.
// @author       TigerYT
// @version      1.0.2
// @grant        GM_info
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/463689/MOOMOOIO%20Utility%20Mod%21%20%28Scrollable%20Inventory%2C%20Wearables%20Hotbar%2C%20Typing%20Indicator%2C%20%20More%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/463689/MOOMOOIO%20Utility%20Mod%21%20%28Scrollable%20Inventory%2C%20Wearables%20Hotbar%2C%20Typing%20Indicator%2C%20%20More%21%29.meta.js
// ==/UserScript==

/*
Version numbers: A.B.C
A = Added or made a major change to multiple mini-mods
B = Added or made a major change to a feature (a whole mini-mod, or major parts within a mini-mod)
C = Added patches
*/

(function() {
    'use strict';

    /**
     * Asynchronously retrieves the userscript's metadata object.
     * This is the recommended, universally compatible method.
     *
     * @returns {Promise<object>} A Promise that resolves with the script info object.
     */
    const getGMInfo = async () => {
        // Modern API (Greasemonkey 4+)
        if (typeof GM !== 'undefined' && typeof GM.info === 'function') {
            return await GM.info;
        }

        // Legacy API (Tampermonkey, Violentmonkey, etc.)
        if (typeof GM_info !== 'undefined') {
            return GM_info;
        }

        // If neither is found, reject the promise
        throw new Error("getGMInfoAsync() Error: Userscript manager info object not found. Make sure you have '@grant GM_info' in your script's header.");
    }

    /**
     * @module Logger
     * @description A simple, configurable logger to prefix messages and avoid cluttering the console.
     * It respects the `DEBUG_MODE` flag in the main module's config.
     */
    const Logger = {
        /**
         * Logs a standard message to the console if DEBUG_MODE is enabled.
         * @param {string} message - The primary message to log.
         * @param {...any} args - Additional arguments to pass directly to console.log.
         */
        log: (message, ...args) => MooMooUtilityMod.config.DEBUG_MODE && console.log((args[0] && typeof args[0] == "string" && args[0].startsWith('color') ? '%c' : '') + `[Util-Mod] ${message}`, ...args),
        /**
         * Logs an informational message to the console if DEBUG_MODE is enabled.
         * @param {string} message - The primary message to log.
         * @param {...any} args - Additional arguments to pass directly to console.info.
         */
        info: (message, ...args) => MooMooUtilityMod.config.DEBUG_MODE && console.info((args[0] && typeof args[0] == "string" && args[0].startsWith('color') ? '%c' : '') + `[Util-Mod] ${message}`, ...args),
        /**
         * Logs a warning message to the console if DEBUG_MODE is enabled.
         * @param {string} message - The primary message to log.
         * @param {...any} args - Additional arguments to pass directly to console.warn.
         */
        warn: (message, ...args) => MooMooUtilityMod.config.DEBUG_MODE && console.warn((args[0] && typeof args[0] == "string" && args[0].startsWith('color') ? '%c' : '') + `[Util-Mod] ${message}`, ...args),
        /**
         * Logs an error message. This is always shown, regardless of the DEBUG_MODE setting.
         * @param {string} message - The primary message to log.
         * @param {...any} args - Additional arguments to pass directly to console.error.
         */
        error: (message, ...args) => console.error((args[0] && typeof args[0] == "string" && args[0].startsWith('color') ? '%c' : '') + `[Util-Mod] ${message}`, ...args)
    };

    /**
      * @module MooMooUtilityMod
      * @description The core of the utility mod. It manages shared state, data, network hooks,
      * and initializes all registered "minimods".
      */
    const MooMooUtilityMod = {

        // --- CORE MOD PROPERTIES ---

        /**
         * @property {object} config - Holds user-configurable settings for the script.
         */
        config: {
            /** @property {boolean} DEBUG_MODE - Set to true to see detailed logs in the console. */
            DEBUG_MODE: true
        },

        /**
         * @property {object} state - Holds the dynamic state of the script, changing as the user plays.
         */
        state: {
            /** @property {boolean} enabled - Master toggle for the entire utility mod. Set to false to disable all features. */
            enabled: true,

            /** @property {number} initTimestamp - The UNIX timestamp (in milliseconds) when the script was initiated. */
            initTimestamp: Date.now(),

            /** @property {boolean} codecsReady - Tracks if the msgpack encoder and decoder instances have been successfully captured. */
            codecsReady: false,

            /** @property {boolean} socketReady - Tracks if the game's WebSocket instance has been successfully captured. */
            socketReady: false,

            /** @property {boolean} isSandbox - Tracks if the player is in sandbox mode, which affects item placement limits. */
            isSandbox: window.location.host.startsWith('sandbox'),

            /** @property {WebSocket|null} gameSocket - A direct reference to the game's main WebSocket instance. */
            gameSocket: null,

            /** @property {object|null} gameEncoder - A direct reference to the game's msgpack encoder instance. */
            gameEncoder: null,

            /** @property {object|null} gameDecoder - A direct reference to the game's msgpack decoder instance. */
            gameDecoder: null,

            /** @property {number} playerId - The client player's unique server-side ID, assigned upon joining a game. */
            playerId: -1,

            /** @property {{food: number, wood: number, stone: number, gold: number}} playerResources - The player's current resource counts. */
            playerResources: { food: 0, wood: 0, stone: 0, gold: 0 },

            /** @property {Map<number, number>} playerPlacedItemCounts - Maps an item's limit group ID to the number of items placed from that group. */
            playerPlacedItemCounts: new Map(),

            /** @property {boolean} playerHasRespawned - Tracks if the player has died and respawned, used to manage certain UI elements. */
            playerHasRespawned: false,

            /** @property {Array<MutationObserver|ResizeObserver>} observers - Stores all active observers for easy disconnection and cleanup when the mod is disabled. */
            observers: [],

            /** @property {Array<string>} focusableElementIds - A list of DOM element IDs that should block hotkeys when visible. Minimods can add to this list. */
            focusableElementIds: [],
        },

        /**
         * @property {object} data - Contains structured, static data about the game, such as items and packet definitions.
         */
        data: {
            /** @property {Map<number, object>} _itemDataByServerId - A map for quickly looking up item data by its server-side ID. */
            _itemDataByServerId: new Map(),

            /** @property {Map<number, object[]>} _itemDataBySlot - A map for grouping items by their action bar slot (e.g., Food, Walls, Spikes). */
            _itemDataBySlot: new Map(),

            /**
             * @property {object} constants - A collection of named constants to avoid "magic values" in the code.
             * These are "universal" constants that multiple minimods may need access to.
             */
            constants: {
                PACKET_TYPES: {
                    USE_ITEM: 'F',
                    EQUIP_ITEM: 'z',
                    EQUIP_WEARABLE: 'c',
                    CHAT: '6'
                },
                PACKET_DATA: {
                    WEARABLE_TYPES: {
                        HAT: 'hat',
                        ACCESSORY: 'accessory',
                    },
                    STORE_ACTIONS: {
                        ADD_ITEM: 'buy',
                        UPDATE_EQUIPPED: 'equip',
                    },
                    USE_ACTIONS: {
                        START_USING: 1,
                        STOP_USING: 0,
                    }
                },
                ITEM_TYPES: {
                    PRIMARY_WEAPON: 0,
                    SECONDARY_WEAPON: 1,
                    FOOD: 2,
                    WALL: 3,
                    SPIKE: 4,
                    WINDMILL: 5,
                    FARM: 6,
                    TRAP: 7,
                    EXTRA: 8,
                    SPAWN_PAD: 9
                },
                DOM: {
                    // IDs
                    UTILITY_MOD_STYLES: 'utilityModStyles',
                    UTILITY_MOD_SCRIPTS: 'utilityModScripts',
                    MENU_CONTAINER: 'menuContainer',
                    MAIN_MENU: 'mainMenu',
                    STORE_MENU: 'storeMenu',
                    STORE_HOLDER: 'storeHolder',
                    RESOURCE_DISPLAY: 'resDisplay',
                    CHAT_HOLDER: 'chatHolder',
                    CHAT_BOX: 'chatBox',
                    ALLIANCE_MENU: 'allianceMenu',
                    ACTION_BAR: 'actionBar',
                    GAME_CANVAS: 'gameCanvas',
                    GAME_UI: 'gameUI',
                    DIED_TEXT: 'diedText',
                    ENTER_GAME_BUTTON: 'enterGame',
                    UPGRADE_HOLDER: 'upgradeHolder',
                    UPGRADE_COUNTER: 'upgradeCounter',
                    ITEM_INFO_HOLDER: 'itemInfoHolder',
                    GAME_TITLE: 'gameName',
                    LOADING_TEXT: 'loadingText',
                    LOADING_INFO: 'loadingInfo',
                    AD_HOLDER: 'promoImgHolder',
                    WIDE_AD_CARD: 'wideAdCard',
                    AD_CARD: 'adCard',
                    RIGHT_CARD_HOLDER: 'rightCardHolder',
                    MENU_CARD_HOLDER: 'menuCardHolder',
                    SHUTDOWN_DISPLAY: 'shutdownDisplay',
                    LINKS_CONTAINER: 'linksContainer2',

                    // Selectors / Patterns / Classes
                    ACTION_BAR_ITEM_REGEX: /^actionBarItem(\d+)$/,
                    ACTION_BAR_ITEM_CLASS: '.actionBarItem',
                    STORE_MENU_EXPANDED_CLASS: 'expanded',
                    MENU_CARD_CLASS: 'menuCard',
                    STORE_TAB_CLASS: 'storeTab',
                    MENU_LINK_CLASS: 'menuLink',
                    PASSTHROUGH_CLASS: 'passthrough',
                },
                CSS: {
                    DISPLAY_NONE: 'none',
                    DISPLAY_FLEX: 'flex',
                    DISPLAY_BLOCK: 'block',
                    OPAQUE: 1,
                },
                GAME_STATE: {
                    INITIAL_SELECTED_ITEM_INDEX: 0,
                    WEBSOCKET_STATE_OPEN: 1, // WebSocket.OPEN
                    NO_SCROLL: 0,
                    SCROLL_DOWN: 1,
                    SCROLL_UP: -1,
                },
                TIMEOUTS: {
                    MANUAL_CODEC_SCAN: 2500,
                },
            },

            /** @property {object} _rawItems - The raw item database, grouped by category for readability before processing. */
            _rawItems: {
                PRIMARY_WEAPONS: [
                    { id: 0, server_id: 0, name: "Tool Hammer" },
                    { id: 1, server_id: 1, name: "Hand Axe" },
                    { id: 3, server_id: 3, name: "Short Sword" },
                    { id: 4, server_id: 4, name: "Katana" },
                    { id: 5, server_id: 5, name: "Polearm" },
                    { id: 6, server_id: 6, name: "Bat" },
                    { id: 7, server_id: 7, name: "Daggers" },
                    { id: 8, server_id: 8, name: "Stick" },
                    { id: 2, server_id: 2, name: "Great Axe" },
                ],
                SECONDARY_WEAPONS: [
                    { id: 9, server_id: 9, name: "Hunting Bow", cost: { wood: 4 } },
                    { id: 10, server_id: 10, name: "Great Hammer" },
                    { id: 11, server_id: 11, name: "Wooden Shield" },
                    { id: 12, server_id: 12, name: "Crossbow", cost: { wood: 5 } },
                    { id: 13, server_id: 13, name: "Repeater Crossbow", cost: { wood: 10 } },
                    { id: 14, server_id: 14, name: "MC Grabby" },
                    { id: 15, server_id: 15, name: "Musket", cost: { stone: 10 } },
                ],
                FOOD: [
                    { id: 0, server_id: 16, name: "Apple", cost: { food: 10 } },
                    { id: 1, server_id: 17, name: "Cookie", cost: { food: 15 } },
                    { id: 2, server_id: 18, name: "Cheese", cost: { food: 25 } },
                ],
                WALLS: [
                    { id: 3, server_id: 19, name: "Wood Wall", limitGroup: 1, limit: 30, cost: { wood: 10 } },
                    { id: 4, server_id: 20, name: "Stone Wall", limitGroup: 1, limit: 30, cost: { stone: 25 } },
                    { id: 5, server_id: 21, name: "Castle Wall", limitGroup: 1, limit: 30, cost: { stone: 35 } },
                ],
                SPIKES: [
                    { id: 6, server_id: 22, name: "Spikes", limitGroup: 2, limit: 15, cost: { wood: 20, stone: 5 } },
                    { id: 7, server_id: 23, name: "Greater Spikes", limitGroup: 2, limit: 15, cost: { wood: 30, stone: 10 } },
                    { id: 8, server_id: 24, name: "Poison Spikes", limitGroup: 2, limit: 15, cost: { wood: 35, stone: 15 } },
                    { id: 9, server_id: 25, name: "Spinning Spikes", limitGroup: 2, limit: 15, cost: { wood: 30, stone: 20 } },
                ],
                WINDMILLS: [
                    { id: 10, server_id: 26, name: "Windmill", limitGroup: 3, limit: 7, sandboxLimit: 299, cost: { wood: 50, stone: 10 } },
                    { id: 11, server_id: 27, name: "Faster Windmill", limitGroup: 3, limit: 7, sandboxLimit: 299, cost: { wood: 60, stone: 20 } },
                    { id: 12, server_id: 28, name: "Power Mill", limitGroup: 3, limit: 7, sandboxLimit: 299, cost: { wood: 100, stone: 50 } },
                ],
                FARMS: [
                    { id: 13, server_id: 29, name: "Mine", limitGroup: 4, limit: 1, cost: { wood: 20, stone: 100 } },
                    { id: 14, server_id: 30, name: "Sapling", limitGroup: 5, limit: 2, cost: { wood: 150 } },
                ],
                TRAPS: [
                    { id: 15, server_id: 31, name: "Pit Trap", limitGroup: 6, limit: 6, cost: { wood: 30, stone: 30 } },
                    { id: 16, server_id: 32, name: "Boost Pad", limitGroup: 7, limit: 12, sandboxLimit: 299, cost: { wood: 5, stone: 20 } },
                ],
                EXTRAS: [
                    { id: 17, server_id: 33, name: "Turret", limitGroup: 8, limit: 2, cost: { wood: 200, stone: 150 } },
                    { id: 18, server_id: 34, name: "Platform", limitGroup: 9, limit: 12, cost: { wood: 20 } },
                    { id: 19, server_id: 35, name: "Healing Pad", limitGroup: 10, limit: 4, cost: { food: 10, wood: 30 } },
                    { id: 21, server_id: 37, name: "Blocker", limitGroup: 11, limit: 3, cost: { wood: 30, stone: 25 } },
                    { id: 22, server_id: 38, name: "Teleporter", limitGroup: 12, limit: 2, sandboxLimit: 299, cost: { wood: 60, stone: 60 } },
                ],
                SPAWN_PADS: [
                    { id: 20, server_id: 36, name: "Spawn Pad", limitGroup: 13, limit: 1, cost: { wood: 100, stone: 100 } },
                ],
            },

            /** @property {object} _issueTemplates - Holds raw markdown for pre-filling GitHub issue bodies. */
            _issueTemplates: {}, // MODIFIED: Will be populated by a fetch call.

            // NEW: Added URLs for fetching templates
            /** @property {object} _issueTemplateURLs - URLs to the raw issue templates on GitHub. */
            _issueTemplateURLs: {
                featureRequest: 'https://raw.githubusercontent.com/TimChinye/UserScripts/main/.github/RAW_ISSUE_TEMPLATE/feature_request.md',
                bugReport: 'https://raw.githubusercontent.com/TimChinye/UserScripts/main/.github/RAW_ISSUE_TEMPLATE/bug_report.md'
            },

            /** @property {object} _packetNames - Maps packet ID codes to human-readable names for logging. */
            _packetNames: {
                'io-init': 'Initial Connection',
                'A': 'All Clans List',
                'B': 'Disconnect',
                'C': 'Setup Game',
                'D': 'Add Player',
                'E': 'Remove Player',
                'G': 'Leaderboard Update',
                'H': 'Load Game Objects',
                'I': 'Update AI',
                'J': 'Animate AI',
                'K': 'Gather Animation',
                'L': 'Wiggle Game Object',
                'M': 'Shoot Turret',
                'N': 'Update Player Value',
                'O': 'Update Health',
                'P': 'Client Player Death',
                'Q': 'Kill Object',
                'R': 'Kill Objects',
                'S': 'Update Item Counts',
                'T': 'Update Age',
                'U': 'Update Upgrades',
                'V': 'Update Items',
                'X': 'Add Projectile',
                'Y': 'Remove Projectile',
                'Z': 'Server Shutdown Notice',
                'a': 'Update Players',
                'g': 'Add Alliance',
                '0': 'Ping Response',
                '1': 'Delete Alliance',
                '2': 'Alliance Notification',
                '3': 'Set Player Team',
                '4': 'Set Alliance Players',
                '5': 'Update Store Items',
                '6': 'Receive Chat',
                '7': 'Update Minimap',
                '8': 'Show Text',
                '9': 'Ping Map',
            },

            /** @property {object} _packetFormatters - Maps packet IDs to functions that format raw packet data into structured objects for easier use and logging. */
            _packetFormatters: {
                'io-init': ([socketID]) => ({ socketID }),
                'A': ([data]) => data,
                'B': ([reason]) => ({ reason }),
                'C': ([yourSID]) => ({ yourSID }),
                'D': ([playerData, isYou]) => ({
                    id: playerData[0], sid: playerData[1], name: playerData[2], x: playerData[3], y: playerData[4], dir: playerData[5], health: playerData[6], maxHealth: playerData[7], scale: playerData[8], skinColor: playerData[9], isYou
                }),
                'E': ([id]) => ({ id }),
                'G': (data) => {
                    const leaderboard = [];
                    for (let i = 0; i < data.length; i += 3) leaderboard.push({ sid: data[i], name: data[i + 1], score: data[i + 2] });
                    return { leaderboard };
                },
                'H': (data) => {
                    const objects = [];
                    for (let i = 0; i < data.length; i += 8) objects.push({ sid: data[i], x: data[i+1], y: data[i+2], dir: data[i+3], scale: data[i+4], type: data[i+5], itemID: data[i+6], ownerSID: data[i+7] });
                    return { objects };
                },
                'I': (data) => {
                    const ais = [];
                    for (let i = 0; i < data.length; i += 7) ais.push({ sid: data[i], index: data[i+1], x: data[i+2], y: data[i+3], dir: data[i+4], health: data[i+5], nameIndex: data[i+6] });
                    return { ais };
                },
                'J': ([sid]) => ({ sid }),
                'K': ([sid, didHit, index]) => ({ sid, didHit, weaponIndex: index }),
                'L': ([dir, sid]) => ({ dir, sid }),
                'M': ([sid, dir]) => ({ sid, dir }),
                'N': ([propertyName, value, updateView]) => ({ propertyName, value, updateView }),
                'O': ([sid, newHealth]) => ({ sid, newHealth }),
                'P': () => ({}),
                'Q': ([sid]) => ({ sid }),
                'R': ([sid]) => ({ sid }),
                'S': ([groupID, count]) => ({ groupID, count }),
                'T': ([xp, maxXP, age]) => ({ xp, maxXP, age }),
                'U': ([points, age]) => ({ points, age }),
                'V': ([items, isWeaponList]) => ({ items, isWeaponList }),
                'X': ([x, y, dir, range, speed, index, layer, sid]) => ({ x, y, dir, range, speed, index, layer, sid }),
                'Y': ([sid, newRange]) => ({ sid, newRange }),
                'Z': ([countdown]) => ({ countdown }),
                'a': (data) => {
                    const players = [];
                    for (let i = 0; i < data.length; i += 13) players.push({ sid: data[i], x: data[i+1], y: data[i+2], dir: data[i+3], buildIndex: data[i+4], weaponIndex: data[i+5], weaponVariant: data[i+6], team: data[i+7], isLeader: data[i+8], skinIndex: data[i+9], tailIndex: data[i+10], iconIndex: data[i+11], zIndex: data[i+12] });
                    return { players };
                },
                'g': ([clanData]) => ({ newClan: clanData }),
                '0': () => ({}),
                '1': ([sid]) => ({ sid }),
                '2': ([sid, name]) => ({ sid, name }),
                '3': ([team, isOwner]) => ({ team, isOwner }),
                '4': (data) => {
                    const members = [];
                    for (let i = 0; i < data.length; i += 2) members.push({ sid: data[i], name: data[i+1] });
                    return { members };
                },
                '5': ([action, itemID, itemType]) => {
                    const CoreC = window.MooMooUtilityMod.data.constants;
                    return ({
                        itemType: itemType === 0 ? CoreC.PACKET_DATA.WEARABLE_TYPES.HAT : CoreC.PACKET_DATA.WEARABLE_TYPES.ACCESSORY,
                        itemID,
                        action: action === 0 ? CoreC.PACKET_DATA.STORE_ACTIONS.ADD_ITEM : CoreC.PACKET_DATA.STORE_ACTIONS.UPDATE_EQUIPPED
                    });
                },
                '6': ([sid, message]) => ({ sid, message }),
                '7': (data) => ({ minimapData: data }),
                '8': ([x, y, value, type]) => ({ x, y, value, type }),
                '9': ([x, y]) => ({ x, y })
            },

            /**
             * Processes the raw item data from `_rawItems` into the lookup maps for efficient access.
             * This function is called once during the script's initialization.
             * @function
             * @returns {void}
             */
            initialize() {
                const CoreC = this.constants;
                const itemTypes = {
                    FOOD:              { slot: 0, itemType: CoreC.ITEM_TYPES.FOOD },
                    WALLS:             { slot: 1, itemType: CoreC.ITEM_TYPES.WALL },
                    SPIKES:            { slot: 2, itemType: CoreC.ITEM_TYPES.SPIKE },
                    WINDMILLS:         { slot: 3, itemType: CoreC.ITEM_TYPES.WINDMILL },
                    FARMS:             { slot: 6, itemType: CoreC.ITEM_TYPES.FARM },
                    TRAPS:             { slot: 4, itemType: CoreC.ITEM_TYPES.TRAP },
                    EXTRAS:            { slot: 5, itemType: CoreC.ITEM_TYPES.EXTRA },
                    SPAWN_PADS:        { slot: 7, itemType: CoreC.ITEM_TYPES.SPAWN_PAD },
                    PRIMARY_WEAPONS:   { slot: 8, itemType: CoreC.ITEM_TYPES.PRIMARY_WEAPON },
                    SECONDARY_WEAPONS: { slot: 9, itemType: CoreC.ITEM_TYPES.SECONDARY_WEAPON },
                };

                for (const category in this._rawItems) {
                    const { itemType, slot } = itemTypes[category];
                    this._rawItems[category].forEach(item => {
                        const fullItemData = {
                            ...item,

                            itemType,
                            slot,
                            cost: {
                                food: 0,
                                wood: 0,
                                stone: 0,
                                gold: 0,

                                ...item.cost
                            }
                        };

                        this._itemDataByServerId.set(fullItemData.server_id, fullItemData);

                        if (!this._itemDataBySlot.has(fullItemData.slot)) {
                            this._itemDataBySlot.set(fullItemData.slot, []);
                        }

                        this._itemDataBySlot.get(fullItemData.slot).push(fullItemData);
                    });
                }
            },
        },

        // --- PUBLIC UTILITY FUNCTIONS ---

        /**
         * Disables the entire utility mod, cleaning up all UI, styles, and event listeners.
         * @returns {void}
         */
        disableMod() {
            if (!this.state.enabled) return; // Already disabled
            Logger.warn("Disabling MooMoo Utility Mod...");
            this.state.enabled = false;

            // 1. Cleanup minimods first
            this.miniMods.forEach(mod => {
                if (typeof mod.cleanup === 'function') {
                    Logger.log(`Cleaning up minimod: ${mod.name}`);
                    try {
                        mod.cleanup();
                    } catch (e) {
                        Logger.error(`Error during cleanup of ${mod.name}:`, e);
                    }
                }
            });

            // 2. Cleanup core UI, styles, and observers
            const CoreC = this.data.constants;
            const style = document.getElementById(CoreC.DOM.UTILITY_MOD_STYLES);
            if (style) style.remove();

            const titleElem = document.getElementById(CoreC.DOM.GAME_TITLE);
            if (titleElem) titleElem.innerHTML = 'MOOMOO.io';

            const loadingInfo = document.getElementById(CoreC.DOM.LOADING_INFO);
            if (loadingInfo) loadingInfo.remove();

            this.state.observers.forEach(obs => obs.disconnect());
            this.state.observers.length = 0; // Clear the array

            // 3. Ensure all core UI element styles are unlocked
            this.waitForElementsToLoad({
                mainMenu: CoreC.DOM.MAIN_MENU,
                menuCardHolder: CoreC.DOM.MENU_CARD_HOLDER,
                loadingText: CoreC.DOM.LOADING_TEXT,
                gameUI: CoreC.DOM.GAME_UI,
                diedText: CoreC.DOM.DIED_TEXT,
            }).then(elements => {
                this.unlockStyleUpdates("display", Object.values(elements));
            });

            Logger.warn("Mod disabled. Game reverted to vanilla state.");
        },

        /**
         * Switches the UI to show the main menu.
         * @returns {void}
         */
        goToMainMenu() {
            this.setUIState('showMenu');
        },



        /**
         * Switches the UI to show the in-game interface.
         * @returns {void}
         */
        goToGamePlay() {
            this.setUIState('showGameplay');
        },

        /**
         * Extracts the server-side item ID from a DOM element's ID attribute.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {RegExpMatchArray|null} A match array or null.
         */
        getItemIdFromElem(itemElem) {
            return itemElem.id.match(this.data.constants.DOM.ACTION_BAR_ITEM_REGEX);
        },

        /**
         * Retrieves the full data object for an item from its corresponding DOM element.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {object|undefined} The item's data object.
         */
        getItemFromElem(itemElem) {
            const match = this.getItemIdFromElem(itemElem);
            if (!match) return undefined;

            const serverItemId = parseInt(match[1]);
            return this.data._itemDataByServerId.get(serverItemId);
        },

        /**
         * Checks if the player has sufficient resources to afford an item.
         * @param {object} itemData - The item's data object.
         * @returns {boolean} True if the player can afford the item.
         */
        isAffordableItem(itemData) {
            if (!itemData || !itemData.cost) return true; // Free items are always affordable

            return this.state.playerResources.food >= itemData.cost.food &&
                   this.state.playerResources.wood >= itemData.cost.wood &&
                   this.state.playerResources.stone >= itemData.cost.stone;
        },

        /**
         * Checks if an item element in the action bar is currently visible and represents a valid item.
         * @param {HTMLElement} itemElem - The action bar item element to check.
         * @returns {boolean} True if the item is available.
         */
        isAvailableItem(itemElem) {
            const isVisible = itemElem.style.display !== this.data.constants.CSS.DISPLAY_NONE;
            if (!isVisible) return false;

            return !!this.getItemIdFromElem(itemElem);
        },

        /**
         * Determines if an item can be equipped by checking its availability, affordability, and placement limits.
         * @param {HTMLElement} itemElem - The action bar item element to check.
         * @returns {boolean} True if all conditions are met.
         */
        isEquippableItem(itemElem) {
            if (!this.isAvailableItem(itemElem)) return false;

            const itemData = this.getItemFromElem(itemElem);
            if (!itemData) return false;

            // Check 1: Resource affordability
            if (!this.isAffordableItem(itemData)) return false;

            // Check 2: Placement limit
            if (itemData.limitGroup) {
                const limit = this.state.isSandbox && itemData.sandboxLimit ? itemData.sandboxLimit : itemData.limit;
                const currentCount = this.state.playerPlacedItemCounts.get(itemData.limitGroup) || 0;

                if (currentCount >= limit) return false;
            }

            return true; // If both checks pass
        },

        /**
         * Checks if a user input element is currently focused and visible.
         * @private
         * @returns {boolean} True if an input is focused.
         */
        isInputFocused() {
            const CoreC = this.data.constants;

            const isVisible = (id) => {
                const elem = document.getElementById(id);
                return elem && window.getComputedStyle(elem).display !== CoreC.CSS.DISPLAY_NONE && window.getComputedStyle(elem).opacity == CoreC.CSS.OPAQUE;
            };

            return this.state.focusableElementIds.some(isVisible);
        },

        /**
         * Registers a DOM element ID as a "focusable" element. When this element is visible,
         * most hotkeys will be disabled to prevent conflicts with typing or UI interaction.
         * @param {string} elementId - The ID of the DOM element to register.
         * @returns {void}
         */
        registerFocusableElement(elementId) {
            if (typeof elementId !== 'string' || !elementId) {
                Logger.error("registerFocusableElement: elementId must be a non-empty string.");
                return;
            }
            if (!this.state.focusableElementIds.includes(elementId)) {
                this.state.focusableElementIds.push(elementId);
                Logger.log(`Registered new focusable element: #${elementId}`);
            }
        },

        /**
         * Observes an element until its computed style 'display' is not 'none'.
         * @param {HTMLElement} element - The HTML element to observe.
         * @returns {Promise<HTMLElement>} A promise that resolves with the element.
         */
        waitForVisible(element) {
            if (!element) return Promise.reject();

            // Define the condition check in one place to avoid repetition.
            const isDisplayBlock = () => window.getComputedStyle(element).display !== 'none';

            // Handle the common case: If the element is already visible, resolve immediately.
            if (isDisplayBlock()) return Promise.resolve(element);

            // If not visible, return a promise that sets up the observer.
            return new Promise(resolve => {
                const observer = new MutationObserver(() => {
                    // When any mutation occurs, re-run the check.
                    if (isDisplayBlock()) {
                        // Once the condition is met, clean up and resolve the promise.
                        observer.disconnect();
                        resolve(element);
                    }
                });

                // Start observing the specific element for attribute changes
                observer.observe(element, { attributes: true });
                this.state.observers.push(observer);
            });
        },

        /**
         * Waits for one or more elements to be present in the DOM.
         *
         * @overload
         * @param {string} elementId - The ID of the single element to wait for.
         * @returns {Promise<HTMLElement>} A promise that resolves with the found HTML element.
         *
         * @overload
         * @param {string[]} elementIds - An array of element IDs to wait for.
         * @returns {Promise<HTMLElement[]>} A promise that resolves with an array of the found HTML elements, in the same order as the input array.
         *
         * @overload
         * @param {Object<string, string>} elementMap - An object mapping variable names to element IDs.
         * @returns {Promise<Object<string, HTMLElement>>} A promise that resolves with an object of the found HTML elements, keyed by the provided variable names.
         */
        waitForElementsToLoad(parameter, options = {}) {
            const { timeout = 5000 } = options; // Default timeout of 5 seconds.
            let inputType;
            let elementMap;

            // 1. Normalize Input (this part is largely the same, but slightly refined)
            if (typeof parameter === 'string') {
                inputType = 'string';
                elementMap = { [parameter]: parameter };
            } else if (Array.isArray(parameter)) {
                inputType = 'array';
                // A more modern/declarative way to convert an array to a map
                elementMap = Object.fromEntries(parameter.map(id => [id, id]));
            } else if (typeof parameter === 'object' && parameter !== null && !Array.isArray(parameter)) {
                inputType = 'object';
                elementMap = parameter;
            } else {
                return Promise.reject(new TypeError('Invalid argument. Must be a string, array of strings, or an object.'));
            }

            // 2. Core Waiting Logic (significantly improved)
            const corePromise = new Promise((resolve, reject) => {
                const foundElements = {};
                // Use a Set for efficient lookup and deletion of keys we still need to find.
                const remainingKeys = new Set(Object.keys(elementMap));
                let observer; // Declare here to be accessible in timeout

                const timeoutId = setTimeout(() => {
                    observer?.disconnect(); // Stop observing on timeout
                    const missingIds = Array.from(remainingKeys).map(key => elementMap[key]);
                    reject(new Error(`Timed out after ${timeout}ms. Could not find elements with IDs: ${missingIds.join(', ')}`));
                }, timeout);

                const checkElements = () => {
                    // Only iterate over the keys of elements we haven't found yet.
                    for (const key of remainingKeys) {
                        const id = elementMap[key];
                        const element = document.getElementById(id);
                        if (element) {
                            foundElements[key] = element;
                            remainingKeys.delete(key); // KEY IMPROVEMENT: Stop looking for this element.
                        }
                    }

                    // If the set is empty, we've found everything.
                    if (remainingKeys.size === 0) {
                        clearTimeout(timeoutId); // Success, so clear the timeout.
                        observer?.disconnect();
                        resolve(foundElements);
                    }
                };

                // Set up the observer to only call our efficient checker.
                observer = new MutationObserver(checkElements);

                // Perform an initial check in case elements are already on the page.
                checkElements();

                // If the initial check didn't find everything, start observing.
                if (remainingKeys.size > 0) {
                    observer.observe(document.body, { childList: true, subtree: true });
                    // Assuming 'this.state.observers' exists from your original context
                    if (this.state && this.state.observers) {
                        this.state.observers.push(observer);
                    }
                }
            });

            // 3. Format Output (unchanged, but now attached to the more robust promise)
            return corePromise.then(foundElements => {
                switch (inputType) {
                    case 'string':
                        return Object.values(foundElements)[0];
                    case 'array':
                        return parameter.map(id => foundElements[id]);
                    case 'object':
                        return foundElements;
                    default:
                        throw new Error(`Internal Error: Unhandled inputType "${inputType}" in waitForElementsToLoad.`);
                }
            });
        },

        /**
         * Locks a CSS style property on an array of elements, preventing it from being
         * changed by JavaScript. A 'data-locked-styles' attribute is added to the element
         * for easy inspection, acting as the single source of truth for the lock state.
         *
         * @param {string} propertyName - The name of the style property to lock.
         * @param {HTMLElement[]} elements - An array of HTMLElements to affect.
         * @returns {void}
         */
        lockStyleUpdates(propertyName, elements) {
            if (!Array.isArray(elements)) {
                console.error("Failed to lock style: `elements` must be an array.");
                return;
            }

            elements.forEach(element => {
                if (!(element instanceof HTMLElement)) {
                    console.warn("Skipping item because it is not a valid HTMLElement:", element);
                    return;
                }

                const lockedStyles = (element.getAttribute('data-locked-styles') || '').split(',').filter(Boolean);
                if (lockedStyles.includes(propertyName)) {
                    return; // This property is already locked.
                }

                const styleObj = element.style;
                // Capture the value at the moment of locking.
                let currentValue = styleObj[propertyName];

                Object.defineProperty(styleObj, propertyName, {
                    // This MUST be true so we can 'delete' it later to unlock.
                    configurable: true,
                    enumerable: true,
                    get() {
                        return currentValue;
                    },
                    set(newValue) {
                        console.warn(`Blocked attempt to set locked property "${propertyName}" to "${newValue}" on`, element);
                        // The set operation is completely ignored.
                    }
                });

                // Update the visible HTML attribute.
                lockedStyles.push(propertyName);
                element.setAttribute('data-locked-styles', lockedStyles.join(','));
            });
        },

        /**
        * Unlocks a CSS style property on an array of elements, allowing to be changed by JavaScript. The 'data-locked-styles'
        * attribute is updated or removed.
        *
        * @param {string} propertyName - The name of the style property to unlock.
        * @param {HTMLElement[]} elements - An array of HTMLElements to affect.
        * @returns {void}
        */
        unlockStyleUpdates(propertyName, elements) {
            if (!Array.isArray(elements)) {
                console.error("Failed to unlock style: `elements` must be an array.");
                return;
            }

            elements.forEach(element => {
                if (!(element instanceof HTMLElement)) {
                    return;
                }

                const lockedStylesAttr = element.getAttribute('data-locked-styles');
                if (!lockedStylesAttr || !lockedStylesAttr.includes(propertyName)) {
                    return; // This property isn't locked on this element.
                }

                // --- The Key Step: Delete the override ---
                // This removes our custom get/set and reverts to the default prototype behavior.
                delete element.style[propertyName];

                // Update the visible HTML attribute.
                const updatedLockedStyles = lockedStylesAttr.split(',').filter(p => p !== propertyName);

                if (updatedLockedStyles.length > 0) {
                    element.setAttribute('data-locked-styles', updatedLockedStyles.join(','));
                } else {
                    element.removeAttribute('data-locked-styles');
                }
            });
        },

        /**
         * Returns a Promise that resolves on the next animation frame.
         * @returns {Promise<void>}
         */
        waitTillNextFrame() {
            return new Promise(resolve => requestAnimationFrame(resolve));
        },

        /**
         * Returns a Promise that resolves after a specified delay.
         * @param {number} ms - The delay in milliseconds.
         * @returns {Promise<void>}
         */
        wait(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // --- CORE INTERNAL FUNCTIONS ---

        /**
         * A simple parser for the navigator.userAgent string.
         * @private
         * @returns {{name: string, version: string}}
         */
        _getBrowserInfo() {
            const ua = navigator.userAgent;
            let match = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
            let temp;

            if (/trident/i.test(match[1])) {
                temp = /\brv[ :]+(\d+)/g.exec(ua) || [];
                return { name: 'IE', version: temp[1] || '' };
            }
            if (match[1] === 'Chrome') {
                temp = ua.match(/\b(OPR|Edge)\/(\d+)/);
                if (temp != null) return { name: temp[1].replace('OPR', 'Opera'), version: temp[2] };
            }
            match = match[2] ? [match[1], match[2]] : [navigator.appName, navigator.appVersion, '-?'];
            if ((temp = ua.match(/version\/(\d+)/i)) != null) match.splice(1, 1, temp[1]);

            return { name: match[0], version: match[1] };
        },

        /**
         * Encodes and sends a packet to the game server.
         * @param {string} type - The one-character packet identifier.
         * @param {any[]} data - The payload data for the packet.
         * @returns {void}
         */
        sendGamePacket(type, data) {
            if (!this.state.enabled) return; // Already disabled, no need to proceed.

            const CoreC = this.data.constants;
            try {
                if (this.state.gameSocket && this.state.gameSocket.readyState === CoreC.GAME_STATE.WEBSOCKET_STATE_OPEN) {
                    this.state.gameSocket.send(this.state.gameEncoder.encode([type, data]));
                }
            } catch (err) {
                Logger.error(`Failed to send packet [${type}]`, err);
            }
        },

        /**
         * Intercepts and processes incoming WebSocket messages to track game state changes.
         * @param {MessageEvent} event - The WebSocket message event containing the raw game data.
         * @returns {void}
         */
        handleSocketMessage(event) {
            if (!this.state.enabled || !this.state.gameDecoder) return; // Already disabled or already set up, no need to proceed.

            try {
                const [packetID, ...argsArr] = this.state.gameDecoder.decode(new Uint8Array(event.data));
                const args = argsArr[0]; // The game nests args in another array for some reason
                const packetName = this.data._packetNames[packetID] || 'Unknown Packet';
                const packetData = this.data._packetFormatters[packetID] ? this.data._packetFormatters[packetID](args) : { rawData: args };

                // Dispatch the packet to all minimods
                this.miniMods.forEach(mod => {
                    if (typeof mod.onPacket === 'function') {
                        mod.onPacket(packetName, packetData, args);
                    }
                });

                switch (packetName) {
                    case 'Client Player Death': {
                        if (this.state.playerHasRespawned); // Do nothing
                        else this.state.playerHasRespawned = true

                        break;
                    }

                    case 'Server Shutdown Notice': {
                        const { countdown } = packetData;
                        const CoreC = this.data.constants;
                        const shutdownDisplay = document.getElementById(CoreC.DOM.SHUTDOWN_DISPLAY);

                        if (countdown < 0 || !shutdownDisplay) return;

                        var minutes = Math.floor(countdown / 60);
                        var seconds = countdown % 60;
                        seconds = ("0" + seconds).slice(-2);

                        shutdownDisplay.innerText = "Server restarting in " + minutes + ":" + seconds;
                        shutdownDisplay.hidden = false;

                        break;
                    }
                }

                if (this.config.DEBUG_MODE) {
                    // --- Log Every Packet ---

                    /* Ignore List (mostly due to spam):
                    {
                        'I': 'All Animals / NPCs State Update',
                        'a': 'All Players State Update',
                        '0': 'Ping',
                        '7': 'Unknown Periodic Event'
                        'H': 'Create Map Objects',
                        'G': 'Leaderboard Update',
                        'K': 'Player Attack Animation',
                        'L': 'Object Damaged',
                        'T': 'Player XP Update / Age Up',
                    }
                    */

                    // These four periodically spam, very quickly too.
                    // const ignoredPackets = ['I', 'a', '0', '7', 'Z'];
                    // Some of these are period, some aren't, all are very frequent.
                    const ignoredPackets = ['I', 'a', '0', '7', 'Z', 'H', 'G', 'K', 'L', 'T'];
                    if (ignoredPackets.includes(packetID.toString())) return;
                    // Other people get hurt / heal around you quite often, it's a little annoying:
                    // if (packetID.toString() === 'O' && packetData.playerID !== this.state.playerId) return;

                    const dataString = Object.keys(packetData).length > 0 ? JSON.stringify(packetData) : '{}';
                    Logger.log(`Packet: ${packetName} (${packetID}) -> ${dataString}`, args);
                }
            } catch (e) { /* Ignore decoding errors for packets we don't care about */
                if (this.config.DEBUG_MODE) Logger.error("Failed to decode packet:", event, e);
            }
        },

        // --- INITIALIZATION & HOOKING ---

        // NEW: Fetches issue templates from GitHub to ensure they are always up-to-date.
        async getIssueTemplates() {
            Logger.log("Fetching issue templates from GitHub...");
            const urls = this.data._issueTemplateURLs;
            try {
                // Fetch both templates concurrently for speed
                const [featureText, bugText] = await Promise.all([
                    fetch(urls.featureRequest).then(res => res.ok ? res.text() : ''),
                    fetch(urls.bugReport).then(res => res.ok ? res.text() : '')
                ]);
                this.data._issueTemplates.featureRequest = featureText;
                this.data._issueTemplates.bugReport = bugText;

                if (featureText && bugText) {
                    Logger.log("Successfully fetched issue templates.", "color: #4CAF50;");
                } else {
                    Logger.warn("One or more issue templates failed to load. Links will fall back to default.");
                }
            } catch (error) {
                Logger.error("Failed to fetch issue templates:", error);
                // Ensure the templates object is clean on error
                this.data._issueTemplates = { featureRequest: '', bugReport: '' };
            }
        },

        /**
         * Collects and injects CSS from the core mod and all registered mini-mods.
         * @returns {void}
         */
        injectCSS() {
            const CoreC = this.data.constants;
            const allCSS = [];

            // Add core CSS
            const coreCSS = this.applyCoreCSS().trim();
            if (coreCSS) {
                allCSS.push('/* --- Injecting Core Mod CSS --- */\n' + coreCSS);
            }

            // Add minimod CSS
            this.miniMods.forEach(mod => {
                if (mod && typeof mod.applyCSS === 'function') {
                    const modCSS = mod.applyCSS().trim();
                    if (modCSS) {
                        allCSS.push('/* --- Injecting "' + (mod.name || 'Unnamed Mod') + '" MiniMod CSS --- */\n' + modCSS);
                }
                }
            });

            if (allCSS.length > 0) {
                const style = document.createElement('style');
                style.id = CoreC.DOM.UTILITY_MOD_STYLES;
                style.textContent = allCSS.join('\n\n/* --- CSS Separator --- */\n\n');
                document.head.append(style);
                Logger.log(`Injected CSS from core and ${this.miniMods.filter(m => typeof m.applyCSS === 'function' && m.applyCSS().trim()).length} mini-mod(s).`, "color: #4CAF50;");
            } else {
                Logger.log("No CSS to inject.");
            }
        },

        /**
         * Provides the CSS styles to be applied for the core mod.
         * @returns {string} The CSS string.
         */
        applyCoreCSS() {
            const CoreC = this.data.constants;
            return `
                #${CoreC.DOM.GAME_TITLE} {
                    --text-shadow-colour: oklch(from currentColor calc(l * 0.82) c h);
                    text-shadow: 0 1px 0 var(--text-shadow-colour),   0 2px 0 var(--text-shadow-colour),   0 3px 0 var(--text-shadow-colour),   0 4px 0 var(--text-shadow-colour),   0 5px 0 var(--text-shadow-colour),   0 6px 0 var(--text-shadow-colour),   0 7px 0 var(--text-shadow-colour),   0 8px 0 var(--text-shadow-colour),   0 9px 0 var(--text-shadow-colour);
                
                    & > span {
                        color: oklch(0.95 0.05 92.5);
                    }
                }

                #${CoreC.DOM.LOADING_INFO} {
                    color: #fff;
                    text-align: center;
                    font-size: 22.5px;
                }

                #${CoreC.DOM.AD_HOLDER} {
                    display: block;

                    & > .${CoreC.DOM.MENU_CARD_CLASS} {
                        margin: 0;
                    }
                }

                button.${CoreC.DOM.MENU_LINK_CLASS} {
                    color: #a56dc8;
                    text-decoration: none;
                    background: none;
                    border: none;
                    padding: 0;
                    cursor: pointer;
                    
                    &:hover {
                        color: #795094;
                    }
                }

                #${CoreC.DOM.MAIN_MENU}.${CoreC.DOM.PASSTHROUGH_CLASS} {
                    pointer-events: none;

                    #${CoreC.DOM.MENU_CONTAINER} ~ div {
                        pointer-events: auto;
                    }
                }
            `;
        },

        /**
         * Updates the main menu screen.
         * @returns {void}
         */
        updateMainMenu() {
            const CoreC = this.data.constants;

            this.waitForElementsToLoad(CoreC.DOM.GAME_TITLE).then((titleElem) => {
                if (!this.state.enabled || !window.gmInfo) return;
                titleElem.innerHTML = `MOOMOO<span>.</span>io`;

                const linksContainer = document.getElementById(CoreC.DOM.LINKS_CONTAINER);

                // --- MODIFIED: Dynamic Link Generation ---
                const gmInfo = window.gmInfo;
                const featureTemplate = this.data._issueTemplates.featureRequest;
                const bugTemplate = this.data._issueTemplates.bugReport;

                // 1. Define fallback URLs
                let featureRequestURL = 'https://github.com/TimChinye/UserScripts/issues/new?template=feature_request.md';
                let bugReportURL = 'https://github.com/TimChinye/UserScripts/issues/new?template=bug_report.md';

                // 2. If templates were fetched successfully, create pre-filled URLs
                if (featureTemplate && bugTemplate) {
                    const scriptNameVersion = `${gmInfo.script.name} (v${gmInfo.script.version})`;
                    const browserInfo = this._getBrowserInfo();
                    const environmentDetails = `
- **Browser Name:** <!-- (Required) e.g; Chrome, Firefox, Edge, Safari -->
  > ${browserInfo.name}
- **Browser Version:** <!-- (Optional) e.g; 125.0 -->
  > ${browserInfo.version}
- **Userscript Manager Name:** <!-- (Optional) e.g; Tampermonkey, Violentmonkey -->
  > ${gmInfo.scriptHandler}
- **Userscript Manager Version:** <!-- (Optional) e.g; 5.1.1 -->
  > ${gmInfo.version}
                    `.trim();

                    const featureBody = featureTemplate.replace('{{ SCRIPT_NAME_VERSION }}', scriptNameVersion);
                    const bugBody = bugTemplate.replace('{{ SCRIPT_NAME_VERSION }}', scriptNameVersion).replace('{{ ENVIRONMENT_DETAILS }}', environmentDetails);

                    featureRequestURL += `&body=${encodeURIComponent(featureBody)}`;
                    bugReportURL += `&body=${encodeURIComponent(bugBody)}`;
                }

                // 3. Inject the final HTML with the correct URLs
                linksContainer.insertAdjacentHTML('beforebegin', `
                    <div id="linksContainer1">
                        <a href="https://greasyfork.org/en/scripts/463689/feedback" target="_blank" class="menuLink">Share Thoughts</a>
                         |
                        <a href="${featureRequestURL}" target="_blank" class="menuLink">Got an idea?</a>
                         |
                        <a href="${bugReportURL}" target="_blank" class="menuLink">Report a Bug</a>
                         |
                        <a href="https://github.com/TimChinye/UserScripts/commits/main/MooMoo.io%20Utility%20Mod/script.user.js" target="_blank" class="menuLink">v${gmInfo.script.version}</a>
                    </div>
                `);

                linksContainer.firstElementChild.insertAdjacentHTML('afterend', ' | <a href="https://frvr.com/browse" target="_blank" class="menuLink">Other Games</a>');
            });
        },

        /**
         * Manages the visibility of core game UI screens.
         * @param {'showError' | 'showGameplay' | 'showMenu'} state - The UI state to display.
         * @returns {void}
         */
        setUIState(state) {
            const CoreC = this.data.constants;
            const elementIds = {
                mainMenu: CoreC.DOM.MAIN_MENU,
                menuCardHolder: CoreC.DOM.MENU_CARD_HOLDER,
                loadingText: CoreC.DOM.LOADING_TEXT,
                gameUI: CoreC.DOM.GAME_UI,
                diedText: CoreC.DOM.DIED_TEXT,
            };

            this.waitForElementsToLoad(elementIds).then(elementsMap => {
                const domElements = Object.values(elementsMap);

                // Ensure styles are unlocked before changing them.
                this.unlockStyleUpdates("display", domElements);

                // Reset all to a blank slate.
                domElements.forEach(el => el.style.display = 'none');
                elementsMap.mainMenu.classList.remove(CoreC.DOM.PASSTHROUGH_CLASS);

                // Show only the elements necessary for each screen
                switch (state) {
                    case 'showMenu':
                        elementsMap.mainMenu.style.display = 'block';
                        elementsMap.menuCardHolder.style.display = 'block';
                        break;

                    case 'showGameplay':
                        elementsMap.gameUI.style.display = 'block';
                        elementsMap.menuCardHolder.style.display = 'block';
                        break;

                    case 'showError':
                        elementsMap.mainMenu.style.display = 'block';
                        elementsMap.loadingText.style.display = 'block';
                        elementsMap.mainMenu.classList.add(CoreC.DOM.PASSTHROUGH_CLASS);

                        if (this.state.enabled) {
                            // Disable updating the element display types
                            this.lockStyleUpdates("display", domElements);

                            // Provide useful info to the user.
                            const loadingInfo = document.getElementById(CoreC.DOM.LOADING_INFO);
                            if (loadingInfo) elementsMap.loadingText.childNodes[0].nodeValue = `Re-attempting Connection...`;
                        }
                        break;

                    default:
                        Logger.error(`Invalid UI state provided: ${state}`);
                        break;
                }
            });
        },

        /**
         * Updates the loading/error UI screen with a message to provide feedback during connection attempts.
         * @private
         * @param {string} message - The message to display.
         * @returns {void}
         */
        _updateLoadingUI(message) {
            const CoreC = this.data.constants;

            // Inject custom info element for the reload logic
            const getLoadingInfoElem = () => document.getElementById(CoreC.DOM.LOADING_INFO);
            const menuContainer = document.getElementById(CoreC.DOM.MENU_CONTAINER);
            if (menuContainer && !getLoadingInfoElem()) {
                menuContainer.insertAdjacentHTML('beforeend', `<div id="${CoreC.DOM.LOADING_INFO}" style="display: none;"><br>${message}<br></div>`);

                const loadingText = document.getElementById(CoreC.DOM.LOADING_TEXT);
                const syncDisplayCallback = () => {
                    const newDisplayStyle = window.getComputedStyle(loadingText).display;
                    const loadingInfo = getLoadingInfoElem();
                    if (loadingInfo && loadingInfo.style.display !== newDisplayStyle) {
                        loadingInfo.style.display = newDisplayStyle;
                    }
                };

                const observer = new MutationObserver(syncDisplayCallback);
                observer.observe(loadingText, { attributes: true, attributeFilter: ['style'] });
                this.state.observers.push(observer);
            }
        },

        /**
         * Handles the scenario where the script fails to hook codecs and prompts for a reload.
         * If reload prompt is cancelled, disables mod.
         * @private
         * @param {boolean} [afterGameEnter=false] - If true, indicates failure happened after entering the game.
         * @returns {Promise<void>}
         */
        async handleHookFailureAndReload(afterGameEnter = false) {
            if (!this.state.enabled) return; // Already disabled, no need to proceed.

            const CoreC = this.data.constants;

            const { gameUI, mainMenu } = await this.waitForElementsToLoad({
                gameUI: CoreC.DOM.GAME_UI,
                mainMenu: CoreC.DOM.MAIN_MENU
            });

            if (afterGameEnter) await this.waitForVisible(gameUI);
            else await this.waitForVisible(mainMenu);

            Logger.error("All hooking methods failed. The script cannot function. Reloading...");
            this._updateLoadingUI("Couldn't intercept in time. May be a network issue. Try not entering the game so fast.");
            this.setUIState('showError');

            await this.wait(5000);

            const loadingInfo = document.getElementById(CoreC.DOM.LOADING_INFO);
            if (loadingInfo) {
                loadingInfo.append("If you cancel, you can play the game as normal - without the mod enabled.");

                await this.waitTillNextFrame();
                await this.waitTillNextFrame();
            }

            if (afterGameEnter || window.confirm("Are you sure you want to reload?")) window.location.reload();

            // User cancelled the reload. Disable the mod and restore the UI - play like normal.
            Logger.warn("User cancelled reload. Disabling mod.");
            this.disableMod();

            if (afterGameEnter) {
                this.setUIState('showGameplay');
            } else {
                this.setUIState('showMenu');
            }
        },

        /**
         * Checks if codecs and WebSocket are ready and performs final setup.
         * @private
         * @returns {void}
         */
        attemptFinalSetup() {
            if (!this.state.enabled || !this.state.codecsReady || !this.state.socketReady) return; // Already disabled or already set up, no need to proceed.

            Logger.log("Codecs and WebSocket are ready. Attaching all listeners.", "color: #ffb700;");
            this.state.gameSocket.addEventListener('message', this.handleSocketMessage.bind(this));
            this.miniMods.forEach(mod => {
                if (typeof mod.addEventListeners === 'function') mod.addEventListeners();
            });
        },

        /**
         * Finds game's msgpack instances by hooking into Object.prototype.
         * @private
         * @param {string} propName - The unique property name to watch for.
         * @param {Function} onFound - The callback to execute when the object is found.
         * @returns {void}
         */
        hookIntoPrototype(propName, onFound) {
            if (!this.state.enabled) return; // Already disabled, no need to proceed.

            Logger.log(`Setting up prototype hook for: ${propName}`);
            if (this.state?.codecsReady) return Logger.log("Both codecs found already, cancelling prototype hooks method.", "color: #4CAF50;");

            const originalDesc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
            Object.defineProperty(Object.prototype, propName, {
                set(value) {
                    if (!MooMooUtilityMod.state.enabled) return; // Already disabled, no need to proceed.
                    if (MooMooUtilityMod.state.codecsReady) return Logger.log("Both codecs found already, cancelling prototype hooks method.", "color: #4CAF50;");

                    // Restore the prototype to its original state *before* doing anything else.
                    // This prevents unexpected side effects and race conditions within the hook itself.
                    if (originalDesc) {
                        Object.defineProperty(Object.prototype, propName, originalDesc);
                    } else {
                        delete Object.prototype[propName];
                    }

                    // Now, apply the value to the current instance.
                    this[propName] = value;

                    // Check if this is the object we are looking for and trigger the callback.
                    // We check for the function's existence to be more certain.
                    const isFoundCodec = (targetPropName, codecOperation) => propName === targetPropName && typeof codecOperation === 'function';
                    if (isFoundCodec("initialBufferSize", this.encode) || isFoundCodec("maxStrLength", this.decode)) {
                        Logger.log(`Hook successful for "${propName}". Object found.`, "color: #4CAF50;");
                        onFound(this);
                    }
                },
                configurable: true,
            });
        },

        /**
         * Sets up hooks to capture the game's msgpack encoder and decoder instances.
         * @private
         * @returns {void}
         */
        initializeHooks() {
            // Set up prototype hooks for both encoder and decoder
            const onCodecFound = () => {
                if (this.state.gameEncoder && this.state.gameDecoder) {
                    Logger.log(`Both msgpack codecs found via prototype hooks. ${Date.now() - this.state.initTimestamp}ms`, "color: #4CAF50;");

                    this.state.codecsReady = true;

                    this.attemptFinalSetup();
                }
            };

            this.hookIntoPrototype("initialBufferSize", (obj) => { this.state.gameEncoder = obj; onCodecFound(); });
            this.hookIntoPrototype("maxStrLength", (obj) => { this.state.gameDecoder = obj; onCodecFound(); });
        },

        /**
         * Intercepts and modifies the game's main script to expose codecs.
         * @private
         * @returns {void}
         */
        interceptGameScript() {
            if (!this.state.enabled) return; // Already disabled, no need to proceed.
            Logger.log("Attempting to intercept and modify the game script...");

            const CoreC = this.data.constants;

            const SCRIPT_SELECTOR = "/assets/index-eb87bff7.js";
            const ENCODER_REGEX = /(this\.initialBufferSize=\w,)/;
            const ENCODER_EXPOSURE = `$1 (typeof Logger !== 'undefined' && Logger.log("✅ CAPTURED ENCODER!")), window.gameEncoder = this,`;
            const DECODER_REGEX = /(this\.maxStrLength=\w,)/;
            const DECODER_EXPOSURE = `$1 (typeof Logger !== 'undefined' && Logger.log("✅ CAPTURED DECODER!")), window.gameDecoder = this,`;

            /**
             * Attempts to find and modify the game script to expose the codecs.
             * If found, it disconnects the observer to prevent further attempts.
             * @param {MutationObserver} [observer] - The MutationObserver instance to disconnect if the script is found.
             */
            const leaveBackdoorOpen = (observer) => {
                if (!this.state.enabled) return; // Already disabled, no need to proceed.
                if (this.state?.codecsReady) return Logger.log("Both codecs found already, cancelling prototype hooks method.", "color: #4CAF50;");

                const targetScript = document.querySelector(`script[src*="${SCRIPT_SELECTOR}"]`);
                if (targetScript) {
                    if (observer) observer.disconnect();

                    Logger.log(`Found game script: ${targetScript.src}`);
                    targetScript.type = 'text/plain'; // Neutralize the original script

                    fetch(targetScript.src)
                    .then(res => res.text())
                    .then(scriptText => {
                        if (!this.state.enabled) return; // Already disabled, no need to proceed.
                        if (this.state?.codecsReady) return Logger.log("Both codecs found already, cancelling prototype hooks method.", "color: #4CAF50;");

                        let modifiedScript = scriptText
                            .replace(/(customElements\.define\("altcha-widget".*"verify"\],!1\)\);)/, '')
                            .replace(ENCODER_REGEX, ENCODER_EXPOSURE)
                            .replace(DECODER_REGEX, DECODER_EXPOSURE);

                        if (!modifiedScript.includes("window.gameEncoder") || !modifiedScript.includes("window.gameDecoder")) return Logger.error("Script injection failed! Regex patterns did not match.");

                        const newScript = document.createElement('script');
                        newScript.id = CoreC.DOM.UTILITY_MOD_SCRIPTS;
                        newScript.textContent = modifiedScript;

                        // This is the function we want to run once the DOM is ready.
                        const injectAndFinalize = () => {
                            if (!this.state.enabled) return; // Already disabled, no need to proceed.
                            if (this.state?.codecsReady) return Logger.log("Both codecs found already, cancelling prototype hooks method.", "color: #4CAF50;");

                            // Make sure this only runs once, in case of any edge cases.
                            if (document.body.contains(newScript)) return;

                            document.head.append(newScript);
                            targetScript.remove();

                            Logger.log("Modified game script injected.", "color: #4CAF50;");

                            // Verify capture and finalize setup
                            // Use setTimeout to allow the newly injected script to execute and populate the window object.
                            setTimeout(() => {
                                if (window.gameEncoder && window.gameDecoder) {
                                    Logger.log(`Codec interception successful! ${Date.now() - this.state.initTimestamp}ms`, "color: #4CAF50; font-weight: bold;");

                                    this.state.gameEncoder = window.gameEncoder;
                                    this.state.gameDecoder = window.gameDecoder;
                                    this.state.codecsReady = true;

                                    this.attemptFinalSetup();
                                } else {
                                    Logger.error("Codecs were not found on window after injection.");
                                }
                            }, 0);
                        };

                        // Check if the DOM is already loaded
                        if (document.readyState === 'loading') {
                            // DOM is not ready yet, so wait for the event
                            document.addEventListener('DOMContentLoaded', injectAndFinalize);
                        } else {
                            // DOM is already ready, so execute the function immediately
                            injectAndFinalize();
                        }
                    })
                    .catch(err => {
                        Logger.error("Failed to fetch or process game script:", err);
                    });
                } else { /* Fail silently */ };
            }

            const observer = new MutationObserver((mutations, obs) => leaveBackdoorOpen(obs));
            observer.observe(document.documentElement, { childList: true, subtree: true });
            this.state.observers.push(observer);
        },

        /**
         * Sets up a WebSocket proxy to capture the game's connection instance.
         * @private
         * @returns {void}
         */
        setupWebSocketProxy() {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = new Proxy(originalWebSocket, {
                construct: (target, args) => {
                    const wsInstance = new target(...args);

                    if (this.state.enabled) {
                        if (this.state.gameEncoder && this.state.gameDecoder) {
                            this.state.gameSocket = wsInstance;
                            this.state.socketReady = true;

                            Logger.log("Game WebSocket instance captured.");
                            window.WebSocket = originalWebSocket; // Restore immediately
                            this.attemptFinalSetup();
                        }
                        else {
                            // A final check. If by the time the WS is created NO method has worked, fail.
                            console.error("WebSocket created but codecs were not found. All hooking methods have failed.");
                            this.handleHookFailureAndReload(true);
                        }
                    }

                    return wsInstance;
                }
            });
        },

        /**
         * Runs once the player has spawned, notifying minimods that the game is fully ready.
         * @private
         * @returns {void}
         */
        onGameReady() {
            if (!this.state.enabled) return; // Already disabled, no need to proceed.

            try {
                // Notify minimods that the game is ready
                this.miniMods.forEach(mod => {
                    if (typeof mod.onGameReady === 'function') mod.onGameReady();
                });

                const shutdownDisplay = document.getElementById(this.data.constants.DOM.SHUTDOWN_DISPLAY);
                if (shutdownDisplay) shutdownDisplay.hidden = false;
            } catch(e) {
                Logger.error("Failed during onGameReady setup.", e);
            }
        },

        /**
         * The main entry point for the script.
         * @returns {void}
         */
        init() {
            // Exposes the logger to the global window object for debugging purposes.
            window.Logger = Logger;

            getGMInfo().then((gmInfo) => {
                Logger.log(`--- MOOMOO.IO Utility Mod (v${gmInfo.script.version}) Initializing ---`, "color: #ffb700; font-weight: bold;");
                window.gmInfo = gmInfo;
            })

            // Attempts to find codecs by modifying the game script directly to open a backdoor.
            this.interceptGameScript(); // Typically succeeds 0.025x slower than mainMenu.
            
            // Set up hooks to intercept codecs as they enter the global scope.
            this.initializeHooks(); // Typically succeeds 0.5x slower than mainMenu.
            
            // Set up WebSocket proxy to capture the game's WebSocket instance.
            this.setupWebSocketProxy();
            
            const CoreC = this.data.constants;

            // If codecs aren't found within a reasonable amount of time, assume failure and prompt for reload.
            this.waitForElementsToLoad({ mainMenu: this.data.constants.DOM.MAIN_MENU }).then(({ mainMenu }) => {
                // We use time until main menu is loaded & visible, to get a good baseline for CPU/Network speeds.
                this.waitForVisible(mainMenu).then(() => {
                    setTimeout(() => {
                        if (!this.state.enabled || this.state.codecsReady) return; // Already disabled

                        Logger.error("Hooks failed to find codecs within the time limit.");
                        this.handleHookFailureAndReload();
                    }, ((Date.now() - this.state.initTimestamp) + 250) * 2.5); // If no success after 1.5x the mainMenu, assume failure.
                });
            });

            // Initialize item data and lookups
            this.data.initialize();

            // Inject styles immediately, as document.head is available early.
            this.injectCSS();

            // Wait for the body to load, and get issue templates before trying to update main menu.
            this.getIssueTemplates().then(() => {
                this.updateMainMenu();
            });
            
            this.state.focusableElementIds = [CoreC.DOM.CHAT_HOLDER, CoreC.DOM.STORE_MENU, CoreC.DOM.ALLIANCE_MENU];

            // Initialize all registered minimods
            this.miniMods.forEach(mod => {
                if (typeof mod.init === 'function') {
                    Logger.log(`Initializing minimod: ${mod.name || 'Unnamed Mod'}`);
                    try {
                        mod.init();
                    } catch (e) {
                        Logger.error(`Error during init of ${mod.name || 'Unnamed Mod'}:`, e);
                    }
                }
            });

            // Exposes the core to the global window object for debugging purposes.
            window.MooMooUtilityMod = this;
        },

        // --- MINI-MOD MANAGEMENT ---

        /** @property {Array<object>} miniMods - A list of all registered sub-modules (minimods). */
        miniMods: [],

        /**
         * Adds a mini-mod to the system.
         * @param {object} mod - The mini-mod object to register.
         * @returns {void}
         */
        registerMod(mod) {
            this.miniMods.push(mod);
            mod.core = this; // Give the minimod a reference to the core

            Logger.log(`Registered minimod: ${mod.name || 'Unnamed Mod'}`);
        }
    };

    /**
     * @module SettingsManagerMiniMod
     * @description Manages loading, saving, and displaying a UI for all mod settings.
     */
    const SettingsManagerMiniMod = {
        /** @property {object|null} core - A reference to the core module, set upon registration. */
        core: null,

        /** @property {string} name - The display name of the minimod. */
        name: "Settings Manager",

        /** @property {object} constants - Constants specific to this minimod. */
        constants: {
            LOCALSTORAGE_KEY: 'MooMooUtilMod_Settings',
            DOM: {
                MOD_CARD: 'modCard',
                LEFT_CARD_HOLDER: 'leftCardHolder',
                SETTINGS_LINK: 'settingsLink',
                CAPTCHA_INPUT: 'altcha',
                OTHER_INPUTS: 'otherInputs',
                SETTINGS_ICON: 'settingsIcon',

                SETTINGS_CATEGORY_CLASS: 'settings-category',
                SETTING_ITEM_CLASS: 'setting-item',
                SETTING_ITEM_CONTROL_CLASS: 'setting-item-control',
                KEYBIND_INPUT_CLASS: 'keybind-input',
                RESET_SETTING_BTN_CLASS: 'reset-setting-btn',
                RESET_ALL_BUTTON_CLASS: 'reset-all-button',
            },
            TEXT: {
                MOD_SETTINGS_HEADER: 'Gameplay Settings',
                KEYBIND_FOCUS_TEXT: '...',
                RESET_ALL_CONFIRM: 'Are you sure you want to reset all mod settings to their defaults? The page will reload.',
                RESET_ALL_BUTTON_TEXT: 'Rexset All Settings',
                RESET_BUTTON_TITLE: 'Reset to default',
                RESET_BUTTON_TEXT: 'Reset',
            },
        },

        /** @property {object} state - Dynamic state for this minimod. */
        state: {
            /** @property {object} savedSettings - Settings loaded from localStorage. */
            savedSettings: {},
            /** @property {object} defaultSettings - A temporary store of default settings for the reset feature. */
            defaultSettings: {},
        },

        /** @property {object} config - Holds user-configurable settings. */
        config: {
            /** @property {boolean} isPanelVisible - Toggle whether or not to show/hide the panel. */
            isPanelVisible: true,
        },

        // --- MINI-MOD LIFECYCLE & HOOKS ---

        /**
         * Initializes the settings panel creation.
         * @returns {void}
         */
        init() {
            this.loadSettings();
            this.createAndInjectSettingsCard();

            this.applySettingsToAllMods();
        },

        /**
         * Returns the CSS rules required for styling the settings panel.
         * @returns {string} The complete CSS string.
         */
        applyCSS() {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;

            return `
                #${LocalC.DOM.LEFT_CARD_HOLDER} {
                    display: inline-block;
                    vertical-align: top;
                }

                :is(#${LocalC.DOM.LEFT_CARD_HOLDER}, #${CoreC.DOM.RIGHT_CARD_HOLDER}) > .${CoreC.DOM.MENU_CARD_CLASS} {
                    min-height: 250px;
                }

                #${LocalC.DOM.MOD_CARD} {
                    max-height: 250px;
                    overflow-y: auto;
                    -webkit-overflow-scrolling: touch;
                }

                #${LocalC.DOM.MOD_CARD} > .menuHeader {
                    margin-bottom: 15px;    
                }

                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.SETTINGS_CATEGORY_CLASS} {
                    margin-bottom: 20px;

                    & .menuHeader {
                        font-size: 20px;
                        color: #4a4a4a;
                    }
                }

                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.SETTING_ITEM_CLASS} {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                    font-size: 18px; /* Matched to game's .settingRadio */
                    color: #a8a8a8;
                }
                
                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.SETTING_ITEM_CONTROL_CLASS} {
                    display: flex;
                    align-items: center;
                    gap: 8px; /* Space between input and reset button */
                }

                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.SETTING_ITEM_CLASS} label {
                    line-height: 1.2;
                    width: 180px;
                    color: #777777;
                    
                    & small {
                        display: block;
                        font-size: 14px;
                        color: #c0c0c0;
                    }
                }

                /* Match game's native input look */
                #${LocalC.DOM.MOD_CARD} input[type="text"],
                #${LocalC.DOM.MOD_CARD} input[type="number"] {
                    text-align: center;
                    font-size: 14px;
                    padding: 4px;
                    border: none;
                    outline: none;
                    box-sizing: border-box;
                    color: #4A4A4A;
                    background-color: #e5e3e3;
                    width: calc(8px + 3ch + 20px);
                    border-radius: 4px;

                    &[type="number"] {
                        text-align: start;
                        padding-left: 8px;
                    }
                }
                    
                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.KEYBIND_INPUT_CLASS} {
                    cursor: pointer;
                    text-transform: uppercase;

                    &:focus {
                        background-color: #d0d0d0;
                    }
                }
                
                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.RESET_SETTING_BTN_CLASS} {
                    font-size: 14px;
                    color: #d0635c;
                    cursor: pointer;

                    &:hover {
                        color: #984742;
                        text-decoration: underline;
                    }
                }

                /* Button styling to match game's .menuButton */
                #${LocalC.DOM.MOD_CARD} .${LocalC.DOM.RESET_ALL_BUTTON_CLASS} {
                    font-size: 18px;
                    padding: 5px;
                    margin-top: 10px;
                    background-color: #f75d59; /* Red for reset/danger */
                    
                    &:hover {
                        background-color: #ea6b64;
                    }
                }

                #${LocalC.DOM.OTHER_INPUTS} {
                    height: 100%;
                    display: flex;
                    align-items: center;
                    gap: 9px;
                    
                    > #${LocalC.DOM.SETTINGS_ICON} {
                        display: block;
                        height: 44px;
                        aspect-ratio: 1 / 1;
                        background: url('https://raw.githubusercontent.com/TimChinye/UserScripts/c76a1b7552434f093774949cfcbf4f57c37b6fdd/MooMoo.io%20Utility%20Mod/settings-icon.svg') center / 100% no-repeat;
                        background-clip: border-box;
                        opacity: 0.5;
                        cursor: pointer;
                        border: 4.5px solid transparent;
                        
                        &:hover {
                            filter: opacity(0.75);
                        }

                        & ~ #altcha {
                            flex: 1;
                            order: -1;
                        }
                    }
                }
            `;
        },
        
        /**
         * Cleans up all UI created by this minimod.
         * @returns {void}
         */
        cleanup() {
            const LocalC = this.constants;

            // Restore the original structure
            this.config.isPanelVisible = false;
            this.removeSettingsCard();

            const rightCardHolder = document.getElementById(LocalC.DOM.RIGHT_CARD_HOLDER);
            if (leftCardHolder) rightCardHolder.querySelector('.menuHeader:has(+ .settingRadio)').textContent = 'Settings';

            // Remove the settings panel card
            const leftCardHolder = document.getElementById(LocalC.DOM.LEFT_CARD_HOLDER);
            if (leftCardHolder) leftCardHolder.remove();

            // Unwrap captcha input
            const captchaElem = document.getElementById(LocalC.DOM.CAPTCHA_INPUT);
            if (captchaElem) {
                captchaElem.parentElement.before(captchaElem);
                captchaElem.parentElement.remove();
            }
        },

        // --- CORE LOGIC ---

        /**
         * Loads settings from localStorage into the state.
         * @returns {void}
         */
        loadSettings() {
            try {
                const saved = localStorage.getItem(this.constants.LOCALSTORAGE_KEY);
                this.state.savedSettings = saved ? JSON.parse(saved) : {};

                Logger.log("Settings loaded from localStorage.", "color: lightblue;");
            } catch (e) {
                Logger.error("Failed to load settings from localStorage.", e);
                this.state.savedSettings = {};
            }
        },

        /**
         * Saves a single setting value to localStorage.
         * @param {string} key - The unique ID of the setting.
         * @param {any} value - The value to save.
         * @returns {void}
         */
        saveSetting(key, value) {
            this.state.savedSettings[key] = value;
            localStorage.setItem(this.constants.LOCALSTORAGE_KEY, JSON.stringify(this.state.savedSettings));
        },

        /**
         * Applies all loaded settings to their respective mods' config objects.
         * @returns {void}
         */
        applySettingsToAllMods() {
            this.state.defaultSettings = {}; // Clear previous defaults

            const allMods = this.core.miniMods;
            allMods.forEach(mod => {
                if (!mod.getSettings) return;
                const configObj = mod.name === 'Core' ? this.core.config : mod.config;

                mod.getSettings().forEach(setting => {
                    // Store the default value before creating the input
                    this.state.defaultSettings[setting.id] = mod.config[setting.configKey];

                    const savedValue = this.state.savedSettings[setting.id];
                    if (savedValue !== undefined) {
                        configObj[setting.configKey] = savedValue;
                    }
                });
            });
            Logger.log("Applied saved settings to all modules.");
        },

        /**
         * Clears all mod settings from localStorage and reloads the page.
         * @returns {void}
         */
        resetAllSettings() {
            localStorage.removeItem(this.constants.LOCALSTORAGE_KEY);
            this.state.savedSettings = {};
            // Reload the page to apply all defaults cleanly
            window.location.reload();
        },

        // --- UI GENERATION ---

        /**
         * Rearranges the main menu to create and inject the settings card.
         * @returns {Promise<void>}
         */
        createAndInjectSettingsCard() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;

            const updatePanelVisibility = () => {
                if (this.config.isPanelVisible) this.showSettingsCard();
                else this.removeSettingsCard();
            }

            return this.core.waitForElementsToLoad(CoreC.DOM.MENU_CARD_HOLDER).then((menuCardHolder) => {
                const settingLabel = 'settings_panel_visible';

                // Set panel visibility to it's previous state, using localStorage.
                const panelVisibility = this.state.savedSettings[settingLabel];
                if (typeof panelVisibility === 'boolean') this.config.isPanelVisible = panelVisibility;

                const rightCardHolder = menuCardHolder.lastElementChild;
                if (!rightCardHolder) return; // Safety check
                rightCardHolder.querySelector('.menuHeader:has(+ .settingRadio)').textContent = 'Display Settings';

                const leftCardHolder = rightCardHolder.cloneNode(true);
                leftCardHolder.id = LocalC.DOM.LEFT_CARD_HOLDER;

                const modCard = leftCardHolder.firstElementChild;
                modCard.id = LocalC.DOM.MOD_CARD;
                modCard.innerHTML = ''; // Clear the cloned content

                menuCardHolder.className = Date.now();
                menuCardHolder.prepend(leftCardHolder);

                // Now that panel has been injected into the page, toggle visibility.
                updatePanelVisibility();

                // Now that the card exists, populate it with the settings.
                this.populateSettingsPanel(modCard);

                const captchaElem = document.getElementById(LocalC.DOM.CAPTCHA_INPUT);
                captchaElem.insertAdjacentHTML('beforebegin', `<div id="${LocalC.DOM.OTHER_INPUTS}"><button id="${LocalC.DOM.SETTINGS_ICON}"></button></div>`);
                document.getElementById(LocalC.DOM.OTHER_INPUTS).append(captchaElem);
                document.getElementById(LocalC.DOM.SETTINGS_ICON).addEventListener('click', () => {
                    this.config.isPanelVisible = !this.config.isPanelVisible;

                    updatePanelVisibility();

                    this.saveSetting(settingLabel, this.config.isPanelVisible); // Update localStorage.
                });
            });
        },

        /**
         * Removes the settings card from the DOM.
         * @returns {void}
         */
        showSettingsCard() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;

            const leftCardHolder = document.getElementById(LocalC.DOM.LEFT_CARD_HOLDER);
            if (leftCardHolder) leftCardHolder.style.removeProperty('display');

            const menuCardHolder = document.getElementById(CoreC.DOM.MENU_CARD_HOLDER);
            const promoImgHolder = document.getElementById(CoreC.DOM.AD_HOLDER);
            const wideAdCard = document.getElementById(CoreC.DOM.WIDE_AD_CARD);
            const adCard = document.getElementById(CoreC.DOM.AD_CARD);

            if (menuCardHolder.previousElementSibling !== wideAdCard) menuCardHolder.before(wideAdCard);
            if (promoImgHolder.lastElementChild !== adCard) promoImgHolder.append(adCard);
        },

        /**
         * Removes the settings card from the DOM.
         * @returns {void}
         */
        removeSettingsCard() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;

            const leftCardHolder = document.getElementById(LocalC.DOM.LEFT_CARD_HOLDER);
            if (leftCardHolder) leftCardHolder.style.setProperty('display', 'none');

            const menuCardHolder = document.getElementById(CoreC.DOM.MENU_CARD_HOLDER);
            const promoImgHolder = document.getElementById(CoreC.DOM.AD_HOLDER);
            const wideAdCard = document.getElementById(CoreC.DOM.WIDE_AD_CARD);
            const adCard = document.getElementById(CoreC.DOM.AD_CARD);

            if (menuCardHolder.nextElementSibling !== wideAdCard) menuCardHolder.after(wideAdCard);
            if (menuCardHolder.firstElementChild !== adCard) menuCardHolder.prepend(adCard);
        },

        /**
         * Fills the settings panel with inputs for all registered mods.
         * @param {HTMLElement} panel - The 'modCard' element to fill.
         * @returns {void}
         */
        populateSettingsPanel(panel) {
            const LocalC = this.constants;
            panel.innerHTML = `<div class="menuHeader">${LocalC.TEXT.MOD_SETTINGS_HEADER}</div>`;

            const allMods = this.core.miniMods;

            allMods.forEach(mod => {
                if (!mod.getSettings) return;

                const settings = mod.getSettings();
                if (settings.length === 0) return;

                const categoryDiv = document.createElement('div');
                categoryDiv.className = LocalC.DOM.SETTINGS_CATEGORY_CLASS;
                categoryDiv.innerHTML = `<div class="menuHeader">${mod.name}</div>`;
                panel.append(categoryDiv);

                settings.forEach(setting => {
                    const itemDiv = this.createSettingInput(setting, mod.config, mod);
                    categoryDiv.append(itemDiv);
                });
            });

            const itemDiv = document.createElement('div');
            itemDiv.className = `menuButton ${LocalC.DOM.RESET_ALL_BUTTON_CLASS}`;
            itemDiv.textContent = LocalC.TEXT.RESET_ALL_BUTTON_TEXT;
            itemDiv.addEventListener('click', () => {
                if (window.confirm(LocalC.TEXT.RESET_ALL_CONFIRM)) {
                    this.resetAllSettings();
                }
            });

            panel.append(itemDiv);
        },

        /**
         * Creates a single HTML input element for a given setting definition.
         * @param {object} setting - The setting definition object.
         * @param {object} config - The config object of the mod the setting belongs to.
         * @param {object} mod - The mod object itself.
         * @returns {HTMLElement} The generated setting item element.
         */
        createSettingInput(setting, config, mod) {
            const LocalC = this.constants;
            const itemDiv = document.createElement('div');
            itemDiv.className = LocalC.DOM.SETTING_ITEM_CLASS;
            let currentValue = config[setting.configKey];

            let controlHtml = '';
            switch (setting.type) {
                case 'checkbox':
                    controlHtml = `<input type="checkbox" id="${setting.id}" ${currentValue ? 'checked' : ''}>`;
                    break;
                case 'keybind':
                    controlHtml = `<input type="text" class="${LocalC.DOM.KEYBIND_INPUT_CLASS}" id="${setting.id}" value="${currentValue}" readonly>`;
                    break;
                case 'number':
                    controlHtml = `<input type="number" id="${setting.id}" value="${currentValue}" min="${setting.min || 0}" max="${setting.max || 10000}" step="${setting.step || 1}">`;
                    break;
            }

            // Add a reset button for settings that are not buttons
            const resetButtonHtml = `<div class="${LocalC.DOM.RESET_SETTING_BTN_CLASS}" title="${LocalC.TEXT.RESET_BUTTON_TITLE}">${LocalC.TEXT.RESET_BUTTON_TEXT}</div>`;

            itemDiv.innerHTML = `
                <label for="${setting.id}">
                    ${setting.label}
                    ${setting.desc ? `<small>${setting.desc}</small>` : ''}
                </label>
                <div class="${LocalC.DOM.SETTING_ITEM_CONTROL_CLASS}">
                    ${controlHtml}
                    ${resetButtonHtml}
                </div>
            `;

            const input = itemDiv.querySelector('input');
            const resetButton = itemDiv.querySelector(`.${LocalC.DOM.RESET_SETTING_BTN_CLASS}`);

            const updateSetting = (newValue) => {
                // Update the live config object
                config[setting.configKey] = newValue;

                // Save to local storage if it's not a temporary setting
                if (setting.save !== false) {
                    this.saveSetting(setting.id, newValue);
                }

                // Trigger any immediate callback
                if (setting.onChange) {
                    setting.onChange(newValue, this.core);
                }
            };

            resetButton.addEventListener('click', () => {
                const defaultValue = this.state.defaultSettings[setting.id];
                if (setting.type === 'checkbox') {
                    input.checked = defaultValue;
                } else {
                    input.value = defaultValue;
                }
                updateSetting(defaultValue);
            });

            if (setting.type === 'keybind') {
                input.addEventListener('focus', () => input.value = LocalC.TEXT.KEYBIND_FOCUS_TEXT);
                input.addEventListener('blur', () => input.value = config[setting.configKey]);
                input.addEventListener('keydown', e => {
                    e.preventDefault();
                    const key = e.key.toUpperCase();
                    input.value = key;
                    updateSetting(key);
                    input.blur();
                });
            } else {
                input.addEventListener('change', () => {
                    const value = setting.type === 'checkbox' ? input.checked : (setting.type === 'number' ? Number(input.value) : input.value);
                    updateSetting(value);
                });
            }
            return itemDiv;
        },
    };

    /**
     * @module ScrollInventoryMiniMod
     * @description A minimod for Minecraft-style inventory selection with the scroll wheel and hotkeys.
     */
    const ScrollInventoryMiniMod = {

        // --- MINI-MOD PROPERTIES ---

        /** @property {object|null} core - A reference to the core module. */
        core: null,

        /** @property {string} name - The display name of the minimod. */
        name: "Scrollable Inventory",

        /** @property {object} config - Holds user-configurable settings. */
        config: {
            /** @property {boolean} enabled - Master switch for this minimod. */
            enabled: true,
            /** @property {boolean} INVERT_SCROLL - If true, reverses the scroll direction for item selection. */
            INVERT_SCROLL: false,
            /** @property {boolean} SCROLL_WHEEL_ENABLED - If false, disables the wheel but keeps the UI highlights. */
            SCROLL_WHEEL_ENABLED: true 
        },

        /** @property {object} constants - Constants specific to this minimod. */
        constants: {
            HOTKEYS: {
                USE_FOOD: 'Q',
            },
            CSS: {
                FILTER_EQUIPPABLE: 'grayscale(0) brightness(1)',
                FILTER_UNEQUIPPABLE: 'grayscale(1) brightness(0.75)',
                BORDER_NONE: 'none',
                SELECTION_BORDER_STYLE: '2px solid white',
            },
        },

        /** @property {object} state - Dynamic state for this minimod. */
        state: {
            /** @property {number} selectedItemIndex - The current index within the filtered list of *equippable* items. */
            selectedItemIndex: -1,
            /** @property {number} lastSelectedWeaponIndex - The index of the last selected weapon, used to auto-switch back after using a non-weapon item. */
            lastSelectedWeaponIndex: -1,
            /** @property {object} boundHandlers - Stores bound event handler functions for easy addition and removal of listeners. */
            boundHandlers: {},
        },

        /**
         * Defines the settings for this minimod.
         * @returns {Array<object>} An array of setting definition objects.
         */
        getSettings() {
            return [
                {
                    id: 'scroll_inv_enabled',
                    configKey: 'enabled',
                    label: 'Enable Inventory Mod',
                    desc: 'Adds QOL improvements to the inventory.',
                    type: 'checkbox'
                },
                {
                    id: 'scroll_inv_wheel_enabled',
                    configKey: 'SCROLL_WHEEL_ENABLED',
                    label: 'Enable Mouse Wheel',
                    desc: 'Use scroll wheel to cycle through items.',
                    type: 'checkbox'
                },
                {
                    id: 'scroll_inv_invert',
                    configKey: 'INVERT_SCROLL',
                    label: 'Invert Scroll Direction',
                    desc: 'Changes which way the selection moves.',
                    type: 'checkbox'
                }
            ];
        },

        // --- MINI-MOD LIFECYCLE & HOOKS ---

        /**
         * Handles incoming game packets to update the minimod's state.
         * @param {string} packetName - The human-readable name of the packet.
         * @param {object} packetData - The parsed data object from the packet.
         * @returns {void}
         */
        onPacket(packetName, packetData) {
            if (!this.config.enabled) return;

            switch (packetName) {
                case 'Setup Game': {
                    // Stores the client's player ID upon initial connection.
                    this.core.state.playerId = packetData.yourSID;
                    break;
                }

                case 'Add Player': {
                    // When the client player spawns, trigger the core's onGameReady to finalize setup.
                    if (this.core.state.playerId === packetData.sid && packetData.isYou) {
                        this.core.onGameReady();
                    }
                    break;
                }

                case 'Update Player Value': {
                    // Updates player resource counts and refreshes equippable item states.
                    // If a non-gold resource decreases, assume item usage and try to revert to the last selected weapon.
                    const resourceType = packetData.propertyName;
                    const oldAmount = this.core.state.playerResources[resourceType];
                    this.core.state.playerResources[resourceType] = packetData.value;

                    if (resourceType !== 'points' && packetData.value < oldAmount) {
                        this.state.selectedItemIndex = this.state.lastSelectedWeaponIndex;
                    }

                    this.refreshEquippableState();
                    break;
                }

                case 'Update Item Counts': {
                    // Updates the count of placed items (e.g; walls, traps) and refreshes equippable states.
                    // This is crucial for enforcing placement limits.
                    const itemData = this.core.data._itemDataByServerId.get(packetData.groupID);
                    if (itemData && itemData.limitGroup) {
                        this.core.state.playerPlacedItemCounts.set(itemData.limitGroup, packetData.count);
                        this.refreshEquippableState();
                    }
                    break;
                }

                case 'Update Upgrades': {
                    this.refreshEquippableState();
                    break;
                }
            }
        },

        /**
         * Adds all necessary event listeners for this minimod.
         * @returns {void}
         */
        addEventListeners() {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;

            this.state.boundHandlers.handleInventoryScroll = this.handleInventoryScroll.bind(this);
            this.state.boundHandlers.handleKeyPress = this.handleKeyPress.bind(this);
            this.state.boundHandlers.handleItemClick = this.handleItemClick.bind(this);

            document.addEventListener('wheel', this.state.boundHandlers.handleInventoryScroll, { passive: false });
            document.addEventListener('keydown', this.state.boundHandlers.handleKeyPress);
            document.getElementById(CoreC.DOM.ACTION_BAR).addEventListener('click', this.state.boundHandlers.handleItemClick);
        },

        /**
         * Cleans up by removing all event listeners added by this minimod.
         * @returns {void}
         */
        cleanup() {
            const CoreC = this.core.data.constants;
            document.removeEventListener('wheel', this.state.boundHandlers.handleInventoryScroll);
            document.removeEventListener('keydown', this.state.boundHandlers.handleKeyPress);
            const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
            if (actionBar) {
                actionBar.removeEventListener('click', this.state.boundHandlers.handleItemClick);
            }
        },

        /**
         * Called when the player has spawned. Scrapes initial state and sets up UI.
         * @returns {void}
         */
        onGameReady() {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;

            // Wait for Game UI to load before proceeding
            const gameUI = document.getElementById(CoreC.DOM.GAME_UI);
            this.core.waitForVisible(gameUI).then(() => {
                // Scrape initial state from the DOM
                const resElements = document.getElementById(CoreC.DOM.RESOURCE_DISPLAY).children;
                this.core.state.playerResources = {
                    food: parseInt(resElements[0].textContent) || 0,
                    wood: parseInt(resElements[1].textContent) || 0,
                    stone: parseInt(resElements[2].textContent) || 0,
                    gold: parseInt(resElements[3].textContent) || 0,
                };

                // Set the initial selected item
                this.selectItemByIndex(CoreC.GAME_STATE.INITIAL_SELECTED_ITEM_INDEX);
            });
        },

        // --- EVENT HANDLERS ---

        /**
         * Handles the 'wheel' event to cycle through inventory items.
         * @param {WheelEvent} event - The DOM wheel event.
         * @returns {void}
         */
        handleInventoryScroll(event) {
            // Check both master enabled AND the new scroll wheel specific setting
            if (!this.config.enabled || !this.config.SCROLL_WHEEL_ENABLED) return;

            const CoreC = this.core.data.constants;
            if (this.core.isInputFocused() || !this.core.state.gameSocket || this.core.state.gameSocket.readyState !== CoreC.GAME_STATE.WEBSOCKET_STATE_OPEN) return;

            // Determine scroll direction and send to refresh selection UI function.
            let scrollDirection = event.deltaY > 0 ? CoreC.GAME_STATE.SCROLL_DOWN : CoreC.GAME_STATE.SCROLL_UP;
            if (this.config.INVERT_SCROLL) { scrollDirection *= -1; }
            this.refreshEquippableState(scrollDirection);
        },

        /**
         * Handles keyboard shortcuts for direct item selection.
         * @param {KeyboardEvent} event - The DOM keyboard event.
         * @returns {void}
         */
        handleKeyPress(event) {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;

            if (this.core.isInputFocused()) return;

            const pressedKey = event.key.toUpperCase();
            const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
            if (!actionBar) return;

            const availableItems = Array.from(actionBar.children).filter(el => this.core.isAvailableItem(el));
            if (availableItems.length === 0) return;

            const isNumericHotkey = (key) => key >= '1' && key <= '9';
            const isFoodHotkey = (key) => key === this.constants.HOTKEYS.USE_FOOD;
            const findFoodItem = (items) => items.find(el => this.core.getItemFromElem(el)?.itemType === CoreC.ITEM_TYPES.FOOD);

            let targetElement = null;
            if (isNumericHotkey(pressedKey)) {
                targetElement = availableItems[parseInt(pressedKey) - 1];
            } else if (isFoodHotkey(pressedKey)) {
                targetElement = findFoodItem(availableItems);
            }

            if (targetElement && this.core.isEquippableItem(targetElement)) {
                const equippableItems = Array.from(actionBar.children).filter(el => this.core.isEquippableItem(el));
                const newIndex = equippableItems.findIndex(el => el.id === targetElement.id);
                if (newIndex !== -1) {
                    if (this.state.selectedItemIndex === newIndex) {
                        // Switch to weapon instead.
                        this.selectItemByIndex(this.state.lastSelectedWeaponIndex);
                    }
                    else this.selectItemByIndex(newIndex);
                }
            }
        },

        /**
         * Handles direct item selection by clicking on an item in the action bar.
         * @param {MouseEvent} event - The DOM mouse event.
         * @returns {void}
         */
        handleItemClick(event) {
            if (!this.config.enabled) return;

            if (this.core.isInputFocused()) return;
            const CoreC = this.core.data.constants;
            const clickedElement = event.target.closest(CoreC.DOM.ACTION_BAR_ITEM_CLASS);
            if (clickedElement && this.core.isEquippableItem(clickedElement)) {
                const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
                if (!actionBar) return;
                const equippableItems = Array.from(actionBar.children).filter(el => this.core.isEquippableItem(el));
                const newIndex = equippableItems.findIndex(el => el.id === clickedElement.id);
                if (newIndex !== -1) this.selectItemByIndex(newIndex);
            }
        },

        // --- CORE LOGIC & UI MANIPULATION ---

        /**
         * The master function for refreshing the inventory selection state and UI. It recalculates the list
         * of equippable items, determines the new selection index, sends an equip packet if needed, and updates the UI.
         * @param {number} [scrollDirection=0] - The direction of scroll: 1 for down, -1 for up, 0 for no change.
         * @returns {void}
         */
        refreshEquippableState(scrollDirection = this.core.data.constants.GAME_STATE.NO_SCROLL) {
            const CoreC = this.core.data.constants;
            const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
            if (!actionBar) return;

            const equippableItems = Array.from(actionBar.children).filter(el => this.core.isEquippableItem(el));
            if (equippableItems.length === 0) {
                Logger.warn("No equippable items available.");
                this.state.selectedItemIndex = -1;
                this.updateSelectionUI(null);
                return;
            }

            // Calculate new index, handling scrolling and list changes.
            this.state.selectedItemIndex = (this.state.selectedItemIndex + scrollDirection + equippableItems.length) % equippableItems.length;

            // Store the last active weapon's index.
            if (equippableItems[1]) {
                const secondEquippableItem = this.core.getItemFromElem(equippableItems[1]);
                if (this.state.selectedItemIndex <= CoreC.ITEM_TYPES.SECONDARY_WEAPON) {
                    const isSingleWielder = secondEquippableItem?.itemType > CoreC.ITEM_TYPES.SECONDARY_WEAPON;
                    this.state.lastSelectedWeaponIndex = isSingleWielder ? CoreC.ITEM_TYPES.PRIMARY_WEAPON : this.state.selectedItemIndex;
                }
            }

            const selectedElement = equippableItems[this.state.selectedItemIndex];
            if (!selectedElement) return;

            // If we scrolled, send the equip packet.
            if (scrollDirection !== CoreC.GAME_STATE.NO_SCROLL) {
                const itemToEquip = this.core.getItemFromElem(selectedElement);
                if (itemToEquip) {
                    const isWeapon = itemToEquip.itemType <= CoreC.ITEM_TYPES.SECONDARY_WEAPON;
                    this.core.sendGamePacket(CoreC.PACKET_TYPES.EQUIP_ITEM, [itemToEquip.id, isWeapon]);
                }
            }

            this.updateSelectionUI(selectedElement);
        },

        /**
         * Selects an item by its index in the list of equippable items.
         * @param {number} newIndex - The index of the item to select.
         * @returns {void}
         */
        selectItemByIndex(newIndex) {
            const CoreC = this.core.data.constants;
            const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
            if (!actionBar) return;

            const equippableItems = Array.from(actionBar.children).filter(el => this.core.isEquippableItem(el));
            if (newIndex < 0 || newIndex >= equippableItems.length) return;

            this.state.selectedItemIndex = newIndex;
            this.refreshEquippableState(CoreC.GAME_STATE.NO_SCROLL);
        },

        // --- UI & HELPER FUNCTIONS ---

        /**
         * Updates the action bar UI to highlight the selected item.
         * @param {HTMLElement|null} selectedItem - The element to highlight as selected.
         * @returns {void}
         */
        updateSelectionUI(selectedItem) {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;

            const actionBar = document.getElementById(CoreC.DOM.ACTION_BAR);
            if (!actionBar) return;

            const allItems = Array.from(actionBar.children);
            allItems.forEach(item => {
                item.style.border = item === selectedItem ? LocalC.CSS.SELECTION_BORDER_STYLE : LocalC.CSS.BORDER_NONE;
                item.style.filter = this.core.isEquippableItem(item) ? LocalC.CSS.FILTER_EQUIPPABLE : LocalC.CSS.FILTER_UNEQUIPPABLE;
            });
        }
    };

    /**
     * @module WearablesToolbarMiniMod
     * @description A minimod that adds a clickable, draggable hotbar for equipping wearables.
     */
    const WearablesToolbarMiniMod = {

        // --- MINI-MOD PROPERTIES ---

        /** @property {object|null} core - A reference to the core module. */
        core: null,

        /** @property {string} name - The display name of the minimod. */
        name: "Wearables Toolbar",
        /** @property {object} config - Holds user-configurable settings. */
        config: {
            /** @property {boolean} enabled - Master switch for this minimod. */
            enabled: true,
            /** @property {string} TOGGLE_KEY - The hotkey to show or hide the toolbar. */
            TOGGLE_KEY: 'P',
            /** @property {boolean} START_HIDDEN - If true, the toolbar will be hidden on spawn. */
            START_HIDDEN: false,
            /** @property {boolean} INSTA_PIN_FREE_HATS - If true, all owned wearables are pinned at the start. */
            INSTA_PIN_FREE_HATS: false,
            /** @property {boolean} DRAGGABLE_ENABLED - If true, wearables can be reordered via drag-and-drop. */
            DRAGGABLE_ENABLED: true,
            /** @property {boolean} AUTO_PIN_ON_BUY - If true, automatically pins a wearable upon purchase. */
            AUTO_PIN_ON_BUY: false,
        },

        /** @property {object} constants - Constants specific to this minimod. */
        constants: {
            TEXT: {
                PIN: 'Pin',
                UNPIN: 'Unpin',
                EQUIP_BUTTON_TEXT: 'equip',
            },
            DOM: {
                WEARABLES_TOOLBAR: 'wearablesToolbar',
                WEARABLES_HOTKEY: 'wearablesHotkey',
                WEARABLES_HATS: 'wearablesHats',
                WEARABLES_ACCESSORIES: 'wearablesAccessories',
                WEARABLES_GRID_CLASS: 'wearables-grid',
                WEARABLE_BUTTON_CLASS: 'wearable-btn',
                WEARABLE_BUTTON_ID_PREFIX: 'wearable-btn-',
                JOIN_ALLIANCE_BUTTON_CLASS: 'joinAlBtn',
                PIN_BUTTON_CLASS: 'pinBtn',
                WEARABLE_SELECTED_CLASS: 'selected',
                WEARABLE_DRAGGING_CLASS: 'dragging'
            },
            CSS: {
                DRAGGING_OPACITY: '0.5',
                STORE_MENU_TRANSFORM: 'translateY(0px)',
            },
            REGEX: {
                HAT_IMG: /hat_(\d+)\.png/,
                ACCESSORY_IMG: /access_(\d+)\.png/,
            },
            URLS: {
                BASE_IMG: 'https://moomoo.io/img',
                HAT_IMG_PATH: '/hats/hat_',
                ACCESSORY_IMG_PATH: '/accessories/access_',
                IMG_EXT: '.png',
            },
            TIMEOUTS: {
                DRAG_AND_DROP_VISIBILITY: 0,
            },
        },

        /** @property {object} state - Dynamic state for this minimod. */
        state: {
            /** @property {boolean} isVisible - Whether the toolbar UI is currently shown. */
            isVisible: true,
            /** @property {Set<number>} pinnedWearables - A set of wearable IDs that the user has pinned to the toolbar. */
            pinnedWearables: new Set(),
            /** @property {HTMLElement|null} draggedItem - The wearable button element currently being dragged. */
            draggedItem: null,
            /** @property {object} boundHandlers - Stores bound event handler functions for easy addition and removal of listeners. */
            boundHandlers: {},
            /** @property {Array<MutationObserver|ResizeObserver>} observers - Stores observers for dynamic UI adjustments and cleanup. */
            observers: []
        },

        /**
         * Defines the settings for this minimod.
         * @returns {Array<object>} An array of setting definition objects.
         */
        getSettings() {
            return [
                {
                    id: 'wearables_toolbar_enabled',
                    configKey: 'enabled',
                    label: 'Enable Wearables Toolbar',
                    desc: 'Adds a hotbar for hats & accessories.',
                    type: 'checkbox',
                    onChange: (value) => this.toggleFeature(value)
                },
                {
                    id: 'wearables_toolbar_toggle_key',
                    configKey: 'TOGGLE_KEY',
                    label: 'Toggle Toolbar Key',
                    desc: 'Press to show or hide the toolbar.',
                    type: 'keybind',
                    onChange: (value) => {
                        const wearableHotkeyLabel = document.getElementById(this.constants.DOM.WEARABLES_HOTKEY);
                        if (wearableHotkeyLabel) wearableHotkeyLabel.textContent = `(Press '${value}' to toggle)`;
                    }
                },
                {
                    id: 'wearables_toolbar_start_hidden',
                    configKey: 'START_HIDDEN',
                    label: 'Start Hidden',
                    desc: 'The toolbar will be hidden on spawn.',
                    type: 'checkbox'
                },
                {
                    id: 'wearables_toolbar_insta_pin_free_hats',
                    configKey: 'INSTA_PIN_FREE_HATS',
                    label: 'Insta-pin Free Hats',
                    desc: 'Automatically pins all the free hats, as soon as the game start.',
                    type: 'checkbox'
                },
                {
                    id: 'wearables_toolbar_draggable',
                    configKey: 'DRAGGABLE_ENABLED',
                    label: 'Draggable Wearables',
                    desc: 'Allow reordering wearables by dragging.',
                    type: 'checkbox',
                    onChange: (value) => this.toggleDraggable(value)
                },
                {
                    id: 'wearables_toolbar_auto_pin_on_buy',
                    configKey: 'AUTO_PIN_ON_BUY',
                    label: 'Auto-pin on Buy',
                    desc: 'Automatically pin a wearable when you buy it.',
                    type: 'checkbox'
                }
            ];
        },

        // --- MINI-MOD LIFECYCLE & HOOKS ---

        /**
         * Returns the CSS rules required for this minimod.
         * @returns {string} The complete CSS string.
         */
        applyCSS() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;
            return `
                #${CoreC.DOM.STORE_MENU} {
                    top: 20px;
                    height: calc(100% - 240px);
                    --extended-width: 80px;

                    & .${CoreC.DOM.STORE_TAB_CLASS} {
                        padding: 10px calc(10px + (var(--extended-width) / 4));
                    }

                    & #${CoreC.DOM.STORE_HOLDER} {
                        height: 100%;
                        width: calc(400px + var(--extended-width));
                    }

                    &.${CoreC.DOM.STORE_MENU_EXPANDED_CLASS} {
                        top: 140px;
                        height: calc(100% - 360px);
                    }
                }

                .${LocalC.DOM.PIN_BUTTON_CLASS} {
                    --text-color: hsl(from #80eefc calc(h + 215) s l);
                    color: var(--text-color);
                    padding-right: 5px;

                    &:hover {
                        color: hsl(from var(--text-color) h calc(s * 0.5) calc(l * 0.875));
                    }
                }

                #${CoreC.DOM.ITEM_INFO_HOLDER} {
                    top: calc(20px + var(--top-offset, 0px));
                }

                #${LocalC.DOM.WEARABLES_TOOLBAR} {
                    position: absolute;
                    left: 20px;
                    top: 20px;
                    padding: 7px 10px 5px;
                    width: auto;
                    max-width: 440px;
                    background-color: rgba(0, 0, 0, 0.25);
                    border-radius: 3px;
                    pointer-events: all;
                    
                    & > h1 {
                        margin: 0;
                        color: #fff;
                        font-size: 31px;
                        font-weight: inherit;

                        & > span {
                            font-size: 0.5em;
                            vertical-align: middle;
                        }
                    }
                }

                .${LocalC.DOM.WEARABLES_GRID_CLASS} {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    justify-content: flex-start;
                }

                .${LocalC.DOM.WEARABLE_BUTTON_CLASS} {
                    width: 40px;
                    height: 40px;
                    margin: 4px 0;
                    border: 2px solid rgba(255, 255, 255, 0.25);
                    background-size: contain;
                    background-position: center;
                    background-repeat: no-repeat;
                    cursor: pointer;
                    background-color: rgba(0, 0, 0, 0.125);
                    border-radius: 4px;
                    transition: all 0.2s ease;

                    &:hover {
                        background-color: rgba(255, 255, 255, 0.125);
                        border-color: white;
                    }

                    &.${LocalC.DOM.WEARABLE_SELECTED_CLASS} {
                        background-color: #5b9c52;
                        border-color: lightgreen;
                        box-shadow: 0 0 8px lightgreen;
                    }

                    &.${LocalC.DOM.WEARABLE_DRAGGING_CLASS} {
                        opacity: ${LocalC.CSS.DRAGGING_OPACITY};
                    }
                }
            `
        },

        /**
         * Handles incoming game packets to update wearables.
         * @param {string} packetName - The human-readable name of the packet.
         * @param {object} packetData - The parsed data object from the packet.
         * @returns {void}
         */
        onPacket(packetName, packetData) {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;
            switch (packetName) {
                case 'Update Store Items': {
                    const { itemID, itemType, action } = packetData;

                    if (action === CoreC.PACKET_DATA.STORE_ACTIONS.ADD_ITEM) {
                        this.addWearableButton(itemID, itemType);

                        // If auto-pin is on, pin the new item.
                        if (this.config.AUTO_PIN_ON_BUY && !this.isWearablePinned(itemID)) {
                            this.togglePin(itemID, itemType);
                        }
                    } else if (action === CoreC.PACKET_DATA.STORE_ACTIONS.UPDATE_EQUIPPED) {
                        this.updateEquippedWearable(itemID, itemType);
                    }

                    break;
                }

                case 'Add Player': {
                    if (packetData.isYou) {
                        this.state.isVisible = !this.config.START_HIDDEN;
                    }

                    break;
                }
            }
        },

        /**
         * Called when the player has spawned. Creates the toolbar UI.
         * @returns {void}
         */
        onGameReady() {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;
            const LocalC = this.constants;
            if (!this.core.state.playerHasRespawned && !document.getElementById(LocalC.DOM.WEARABLES_TOOLBAR)) {
                // Wait for Game UI to load before proceeding
                const gameUI = document.getElementById(CoreC.DOM.GAME_UI);
                this.core.waitForVisible(gameUI).then(() => {
                    this.createWearablesToolbarUI();

                    this.setupDynamicPositioning();
                    this.setupStoreMenuObservers();
                        
                    if (this.config.INSTA_PIN_FREE_HATS) {
                        this.instaPinFreeHats();
                    }
                });
            }
        },

        /**
         * Cleans up all UI elements, observers, and event listeners.
         * @returns {void}
         */
        cleanup() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;
            document.getElementById(CoreC.DOM.STORE_MENU)?.style.removeProperty('transform');
            document.getElementById(LocalC.DOM.WEARABLES_TOOLBAR)?.remove();
            document.querySelectorAll(`.${LocalC.DOM.PIN_BUTTON_CLASS}`).forEach((pinElem) => pinElem.remove());
            document.removeEventListener('keydown', this.state.boundHandlers.handleKeyDown);
            this.state.observers.forEach(obs => obs.disconnect());
            this.state.observers.length = 0;
        },

        /**
         * Immediately shows or hides the feature based on the enabled state.
         * @param {boolean} isEnabled - The new enabled state.
         * @returns {void}
         */
        toggleFeature(isEnabled) {
            const toolbar = document.getElementById(this.constants.DOM.WEARABLES_TOOLBAR);
            if (isEnabled) {
                // If enabling, but toolbar doesn't exist, try to create it
                if (!toolbar) this.onGameReady();
                else toolbar.style.display = this.state.isVisible ? 'block' : 'none';
            } else {
                if (toolbar) toolbar.style.display = 'none';
            }
        },

        // --- INITIAL UI SETUP ---

        /**
         * Creates the main HTML structure for the wearables toolbar.
         * @returns {void}
         */
        createWearablesToolbarUI() {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;

            const container = document.createElement('div');
            container.id = LocalC.DOM.WEARABLES_TOOLBAR;
            container.innerHTML = `
                <h1>Wearables Toolbar <span id="${LocalC.DOM.WEARABLES_HOTKEY}">(Press '${this.config.TOGGLE_KEY}' to toggle)</span></h1>
                <div id="${LocalC.DOM.WEARABLES_HATS}" class="${LocalC.DOM.WEARABLES_GRID_CLASS}"></div>
                <div id="${LocalC.DOM.WEARABLES_ACCESSORIES}" class="${LocalC.DOM.WEARABLES_GRID_CLASS}"></div>
            `;

            // Apply start hidden setting
            container.style.display = this.state.isVisible ? CoreC.CSS.DISPLAY_BLOCK : CoreC.CSS.DISPLAY_NONE;

            document.getElementById(CoreC.DOM.GAME_UI).prepend(container);

            const hatsGrid = container.querySelector(`#${LocalC.DOM.WEARABLES_HATS}`);
            const accessoriesGrid = container.querySelector(`#${LocalC.DOM.WEARABLES_ACCESSORIES}`);

            hatsGrid.addEventListener('dragover', this.handleDragOver.bind(this));
            accessoriesGrid.addEventListener('dragover', this.handleDragOver.bind(this));

            this.state.boundHandlers.handleKeyDown = (e) => {
                if (!this.config.enabled || this.core.isInputFocused()) return;

                if (e.key.toUpperCase() === this.config.TOGGLE_KEY) {
                    this.state.isVisible = !this.state.isVisible;
                    container.style.display = this.state.isVisible ? CoreC.CSS.DISPLAY_BLOCK : CoreC.CSS.DISPLAY_NONE;
                }
            };

            document.addEventListener('keydown', this.state.boundHandlers.handleKeyDown);
        },

        /**
         * Sets up observers to dynamically position the toolbar and info box.
         * @returns {void}
         */
        setupDynamicPositioning() {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;
            const toolbar = document.getElementById(LocalC.DOM.WEARABLES_TOOLBAR);
            const infoHolder = document.getElementById(CoreC.DOM.ITEM_INFO_HOLDER);

            if (!toolbar || !infoHolder) return Logger.warn("Could not find toolbar or info holder for dynamic positioning.");

            const updatePosition = () => {
                const isExpanded = infoHolder.offsetHeight > 0;
                infoHolder.style.setProperty('--top-offset', isExpanded ? `${toolbar.offsetHeight + 20}px` : '0px');
            };

            // Observer 1: Reacts to any change in the info holder's size (e.g; appearing/disappearing).
            const infoHolderObserver = new ResizeObserver(updatePosition);
            infoHolderObserver.observe(infoHolder);
            this.state.observers.push(infoHolderObserver);

            // Observer 2: Reacts to significant changes in the toolbar's height,
            // which happens when a new row of wearables is pinned.
            let lastToolbarHeight = toolbar.offsetHeight;
            const toolbarObserver = new ResizeObserver(() => {
                const currentHeight = toolbar.offsetHeight;
                // Only update if the height changes by 10px or more to avoid minor fluctuations.
                if (Math.abs(currentHeight - lastToolbarHeight) >= 10) {
                    updatePosition();
                    lastToolbarHeight = currentHeight; // Update the last known height
                }
            });
            toolbarObserver.observe(toolbar);
            this.state.observers.push(toolbarObserver);

            // Run once at the start to set the initial position.
            updatePosition();
        },

        /**
         * Sets up observers to adjust the store menu and inject pin buttons.
         * @returns {void}
         */
        setupStoreMenuObservers() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;
            const storeMenu = document.getElementById(CoreC.DOM.STORE_MENU);
            storeMenu.style.transform = LocalC.CSS.STORE_MENU_TRANSFORM;

            const upgradeHolder = document.getElementById(CoreC.DOM.UPGRADE_HOLDER);
            const upgradeCounter = document.getElementById(CoreC.DOM.UPGRADE_COUNTER);

            const initialCheck = () => {
                const upgradeHolderVisible = upgradeHolder.style.display === CoreC.CSS.DISPLAY_BLOCK;
                const upgradeCounterVisible = upgradeCounter.style.display === CoreC.CSS.DISPLAY_BLOCK;

                const isExpanded = upgradeHolderVisible && upgradeCounterVisible;
                storeMenu.classList.toggle(CoreC.DOM.STORE_MENU_EXPANDED_CLASS, isExpanded);
            };

            initialCheck();
            const upgradeObserver = new MutationObserver(initialCheck);
            upgradeObserver.observe(upgradeHolder, { attributes: true, attributeFilter: ['style'] });
            upgradeObserver.observe(upgradeCounter, { attributes: true, attributeFilter: ['style'] });
            this.state.observers.push(upgradeObserver);

            const storeMenuObserver = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (storeMenu.style.display === CoreC.CSS.DISPLAY_BLOCK && mutation.oldValue?.includes(`display: ${CoreC.CSS.DISPLAY_NONE}`)) {
                        this.addPinButtons();
                    }
                }
            });
            storeMenuObserver.observe(storeMenu, { attributes: true, attributeFilter: ['style'], attributeOldValue: true });
            this.state.observers.push(storeMenuObserver);

            const storeHolderObserver = new MutationObserver(() => this.addPinButtons());
            storeHolderObserver.observe(document.getElementById(CoreC.DOM.STORE_HOLDER), { childList: true });
            this.state.observers.push(storeHolderObserver);
        },

        // --- UI MANIPULATION & STATE UPDATES ---

        /**
         * Adds a new button for a specific wearable to the toolbar.
         * @param {number} id - The server-side ID of the wearable.
         * @param {string} type - The type of wearable ('hat' or 'accessory').
         * @returns {void}
         */
        addWearableButton(id, type) {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;
            const containerId = type === CoreC.PACKET_DATA.WEARABLE_TYPES.HAT ? LocalC.DOM.WEARABLES_HATS : LocalC.DOM.WEARABLES_ACCESSORIES;
            const container = document.getElementById(containerId);
            if (!container) return;

            const buttonId = `${LocalC.DOM.WEARABLE_BUTTON_ID_PREFIX}${type}-${id}`;
            if (document.getElementById(buttonId)) return;

            const btn = document.createElement('div');
            btn.id = buttonId;
            btn.className = LocalC.DOM.WEARABLE_BUTTON_CLASS;
            btn.draggable = this.config.DRAGGABLE_ENABLED;
            btn.dataset.wearableId = id;

            const imagePath = type === CoreC.PACKET_DATA.WEARABLE_TYPES.HAT ? LocalC.URLS.HAT_IMG_PATH : LocalC.URLS.ACCESSORY_IMG_PATH;
            btn.style.backgroundImage = `url(${LocalC.URLS.BASE_IMG}${imagePath}${id}${LocalC.URLS.IMG_EXT})`;
            btn.title = `Item ID: ${id}`;

            btn.addEventListener('dragstart', () => {
                this.state.draggedItem = btn;
                setTimeout(() => btn.classList.add(LocalC.DOM.WEARABLE_DRAGGING_CLASS), LocalC.TIMEOUTS.DRAG_AND_DROP_VISIBILITY);
            });

            btn.addEventListener('dragend', () => {
                setTimeout(() => {
                    if (this.state.draggedItem) this.state.draggedItem.classList.remove(LocalC.DOM.WEARABLE_DRAGGING_CLASS);
                    this.state.draggedItem = null;
                }, LocalC.TIMEOUTS.DRAG_AND_DROP_VISIBILITY);
            });

            btn.addEventListener('click', () => {
                const isCurrentlySelected = btn.classList.contains(LocalC.DOM.WEARABLE_SELECTED_CLASS);
                const newItemId = isCurrentlySelected ? 0 : id;
                this.core.sendGamePacket(CoreC.PACKET_TYPES.EQUIP_WEARABLE, [0, newItemId, type === CoreC.PACKET_DATA.WEARABLE_TYPES.HAT ? 0 : 1]);
            });

            container.append(btn);
            this.refreshToolbarVisibility();
        },

        /**
         * Updates the visual state of buttons to highlight the equipped wearable.
         * @param {number} id - The server-side ID of the newly equipped wearable.
         * @param {string} type - The type of wearable.
         * @returns {void}
         */
        updateEquippedWearable(id, type) {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;
            const containerId = type === CoreC.PACKET_DATA.WEARABLE_TYPES.HAT ? LocalC.DOM.WEARABLES_HATS : LocalC.DOM.WEARABLES_ACCESSORIES;
            const container = document.getElementById(containerId);
            if (!container) return;

            const currentSelected = container.querySelector(`.${LocalC.DOM.WEARABLE_SELECTED_CLASS}`);
            if (currentSelected) currentSelected.classList.remove(LocalC.DOM.WEARABLE_SELECTED_CLASS);

            if (id > 0) {
                const buttonId = `${LocalC.DOM.WEARABLE_BUTTON_ID_PREFIX}${type}-${id}`;

                const newSelectedBtn = document.getElementById(buttonId);
                if (newSelectedBtn) newSelectedBtn.classList.add(LocalC.DOM.WEARABLE_SELECTED_CLASS);
            }
        },

        /**
         * Hides or shows wearable buttons based on the pinned set.
         * @returns {void}
         */
        refreshToolbarVisibility() {
            const LocalC = this.constants;
            const CoreC = this.core.data.constants;

            const allButtons = document.querySelectorAll(`.${LocalC.DOM.WEARABLE_BUTTON_CLASS}`);
            allButtons.forEach(btn => {
                const buttonId = parseInt(btn.dataset.wearableId);
                if (!isNaN(buttonId)) {
                    btn.style.display = this.state.pinnedWearables.has(buttonId) ? CoreC.CSS.DISPLAY_BLOCK : CoreC.CSS.DISPLAY_NONE;
                }
            });
        },

        // --- PINNING LOGIC ---

        /**
         * Scans the store for all owned wearables and pins them if they aren't already.
         * This is triggered by the 'Start With All Pinned' setting.
         * @returns {void}
         */
        instaPinFreeHats() {
            const CoreC = this.core.data.constants;

            const freeHats = [51, 50, 28, 29, 30, 36, 37, 38, 44, 35, 42, 43, 49];

            freeHats.forEach((storeItemId) => {
                if (!this.isWearablePinned(storeItemId)) {
                    this.togglePin(storeItemId, CoreC.PACKET_DATA.WEARABLE_TYPES.HAT);
                }
            });

            this.refreshToolbarVisibility();
        },


        /**
         * Scans the store menu and adds "Pin" buttons to owned wearables.
         * @returns {void}
         */
        addPinButtons() {
            const CoreC = this.core.data.constants;
            const LocalC = this.constants;

            const storeHolder = document.getElementById(CoreC.DOM.STORE_HOLDER);
            Array.from(storeHolder.children).forEach((storeItem) => {
                const wearableIcon = storeItem.querySelector('img');
                const joinBtn = storeItem.querySelector('.' + LocalC.DOM.JOIN_ALLIANCE_BUTTON_CLASS);
                const hasPinButton = storeItem.querySelector(`.${LocalC.DOM.PIN_BUTTON_CLASS}`);
                const isNotEquipButton = !joinBtn || !joinBtn.textContent.toLowerCase().includes(LocalC.TEXT.EQUIP_BUTTON_TEXT);

                // Check if eligible for a new pin button.
                if (!wearableIcon || hasPinButton || isNotEquipButton) return;
                let id, type;
                const hatMatch = wearableIcon.src.match(LocalC.REGEX.HAT_IMG);
                const accMatch = wearableIcon.src.match(LocalC.REGEX.ACCESSORY_IMG);

                if (hatMatch) {
                    id = parseInt(hatMatch[1]);
                    type = CoreC.PACKET_DATA.WEARABLE_TYPES.HAT;
                } else if (accMatch) {
                    id = parseInt(accMatch[1]);
                    type = CoreC.PACKET_DATA.WEARABLE_TYPES.ACCESSORY;
                } else {
                    return; // Not a wearable item
                }

                const pinButton = document.createElement('div');
                pinButton.className = `${LocalC.DOM.JOIN_ALLIANCE_BUTTON_CLASS} ${LocalC.DOM.PIN_BUTTON_CLASS}`;
                pinButton.style.marginTop = '5px';
                pinButton.textContent = this.isWearablePinned(id) ? LocalC.TEXT.UNPIN : LocalC.TEXT.PIN;
                pinButton.addEventListener('click', () => {
                    pinButton.textContent = this.togglePin(id, type) ? LocalC.TEXT.UNPIN : LocalC.TEXT.PIN;
                    this.refreshToolbarVisibility();
                });
                joinBtn.after(pinButton);
            });
        },

        /**
         * Checks if a wearable is currently pinned.
         * @param {number} id - The ID of the wearable.
         * @returns {boolean} True if pinned.
         */
        isWearablePinned(id) {
            return this.state.pinnedWearables.has(id);
        },

        /**
         * Toggles the pinned state of a wearable.
         * @param {number} id - The ID of the wearable.
         * @param {string} type - The type of the wearable.
         * @returns {boolean} The new pinned state.
         */
        togglePin(id, type) {
            const pinned = this.state.pinnedWearables;
            if (pinned.has(id)) { // Unpin
                pinned.delete(id);
                return false;
            } else { // Pin
                pinned.add(id);
                this.addWearableButton(id, type);
                return true;
            }
        },

        /**
         * Toggles the draggable property on all wearable buttons based on the user setting.
         * @param {boolean} isEnabled - Whether dragging should be enabled.
         * @returns {void}
         */
        toggleDraggable(isEnabled) {
            const LocalC = this.constants;
            const allButtons = document.querySelectorAll(`.${LocalC.DOM.WEARABLE_BUTTON_CLASS}`);
            allButtons.forEach(btn => {
                btn.draggable = isEnabled;
            });
        },


        // --- EVENT HANDLERS (DRAG & DROP) ---

        /**
         * Handles the dragover event for reordering pinned items.
         * @param {DragEvent} e - The DOM drag event.
         * @returns {void}
         */
        handleDragOver(e) {
            e.preventDefault();
            const grid = e.currentTarget;
            const currentlyDragged = this.state.draggedItem;
            if (!currentlyDragged || currentlyDragged.parentElement != grid) return;

            // Determine where the item SHOULD be placed.
            const afterElement = this._getDragAfterElement(grid, e.clientX, e.clientY);

            // Optimization: Prevent DOM updates if position hasn't changed to avoid jitter.
            if (currentlyDragged.nextSibling === afterElement) return;

            grid.insertBefore(currentlyDragged, afterElement);
        },

        // --- HELPER FUNCTIONS ---

        /**
         * Finds the sibling element that should come after the dragged item.
         * @private
         * @param {HTMLElement} container - The grid container element.
         * @param {number} x - The cursor's horizontal position.
         * @param {number} y - The cursor's vertical position.
         * @returns {HTMLElement|null} The sibling element to insert before.
         */
        _getDragAfterElement(container, x, y) {
            const LocalC = this.constants;
            const selector = `.${LocalC.DOM.WEARABLE_BUTTON_CLASS}:not(.${LocalC.DOM.WEARABLE_DRAGGING_CLASS})`;
            const draggableSiblings = [...container.querySelectorAll(selector)];

            for (const sibling of draggableSiblings) {
                const box = sibling.getBoundingClientRect();
                const isVerticallyBefore = y < box.top + box.height / 2;
                const isInRow = y >= box.top && y <= box.bottom;
                const isHorizontallyBefore = x < box.left + box.width / 2;

                if (isVerticallyBefore || (isInRow && isHorizontallyBefore)) {
                    return sibling;
                }
            }

            return null; // If after all other elements
        },
    };

    /**
     * @module TypingIndicatorMiniMod
     * @description Shows a "..." typing indicator in chat while the user is typing.
     */
    const TypingIndicatorMiniMod = {

        // --- MINI-MOD PROPERTIES ---

        /** @property {object|null} core - A reference to the core module. */
        core: null,

        /** @property {string} name - The display name of the minimod. */
        name: "Typing Indicator",

        /** @property {object} config - Holds user-configurable settings. */
        config: {
            /** @property {boolean} enabled - Master switch for this minimod. */
            enabled: true,
            /** @property {number} INDICATOR_INTERVAL - The time in milliseconds between each animation frame. */
            INDICATOR_INTERVAL: 1000,
            /** @property {number} RATE_LIMIT_MS - The cooldown period between sending chat messages. */
            RATE_LIMIT_MS: 550,
            /** @property {number} START_DELAY - A safe buffer before showing the indicator. */
            START_DELAY: 1000,
            /** @property {string[]} ANIMATION_FRAMES - The sequence of strings used for the typing animation. */
            ANIMATION_FRAMES: ['.', '..', '...'],
            /** @property {number} QUEUE_PROCESSOR_INTERVAL - How often to check the message queue for pending messages to send. */
            QUEUE_PROCESSOR_INTERVAL: 100,
        },

        /** @property {object} state - Dynamic state for this minimod. */
        state: {
            /** @property {HTMLElement|null} chatBoxElement - A reference to the game's chat input element. */
            chatBoxElement: null,
            /** @property {number|null} indicatorIntervalId - The ID of the interval used for the typing animation. */
            indicatorIntervalId: null,
            /** @property {number|null} startIndicatorTimeoutId - The ID of the timeout used to delay the start of the indicator. */
            startIndicatorTimeoutId: null,
            /** @property {number|null} queueProcessorIntervalId - The ID of the interval that processes the message queue. */
            queueProcessorIntervalId: null,
            /** @property {number} animationFrameIndex - The current index in the `ANIMATION_FRAMES` array. */
            animationFrameIndex: 0,
            /** @property {number} lastMessageSentTime - The timestamp of the last message sent to the server. */
            lastMessageSentTime: 0,
            /** @property {Array<{type: 'user'|'system', content: string}>} messageQueue - The queue of messages waiting to be sent. */
            messageQueue: [],
            /** @property {object} boundHandlers - Stores bound event handler functions for easy addition and removal of listeners. */
            boundHandlers: {},
        },

        /**
         * Defines the settings for this minimod.
         * @returns {Array<object>} An array of setting definition objects.
         */
        getSettings() {
            return [
                {
                    id: 'typing_indicator_enabled',
                    configKey: 'enabled',
                    label: 'Enable Typing Indicator',
                    desc: 'Shows "..." in chat while you are typing.',
                    type: 'checkbox'
                }
            ]
        },

        // --- MINI-MOD LIFECYCLE & HOOKS ---

        /**
         * Adds all necessary event listeners for this minimod.
         * @returns {void}
         */
        addEventListeners() {
            if (!this.config.enabled) return;

            this.state.chatBoxElement = document.getElementById(this.core.data.constants.DOM.CHAT_BOX);
            if (!this.state.chatBoxElement) return Logger.error("Could not find chatBox element. Mod will not function.");

            this.state.boundHandlers.handleFocus = this.handleFocus.bind(this);
            this.state.boundHandlers.handleBlur = this.handleBlur.bind(this);
            this.state.boundHandlers.handleKeyDown = this.handleKeyDown.bind(this);

            this.state.chatBoxElement.addEventListener('focus', this.state.boundHandlers.handleFocus);
            this.state.chatBoxElement.addEventListener('blur', this.state.boundHandlers.handleBlur);
            this.state.chatBoxElement.addEventListener('keydown', this.state.boundHandlers.handleKeyDown);

            // Start the queue processor, which will run continuously to send queued messages.
            this.startQueueProcessor();
            Logger.log("Typing indicator event listeners attached and queue processor started.");
        },

        /**
         * Cleans up all timers and event listeners.
         * @returns {void}
         */
        cleanup() {
            clearInterval(this.state.indicatorIntervalId);
            clearInterval(this.state.queueProcessorIntervalId);
            clearTimeout(this.state.startIndicatorTimeoutId);
            if (this.state.chatBoxElement) {
                this.state.chatBoxElement.removeEventListener('focus', this.state.boundHandlers.handleFocus);
                this.state.chatBoxElement.removeEventListener('blur', this.state.boundHandlers.handleBlur);
                this.state.chatBoxElement.removeEventListener('keydown', this.state.boundHandlers.handleKeyDown);
            }
        },

        // --- EVENT HANDLERS ---

        /**
         * Handles the `focus` event on the chat box.
         * @returns {void}
         */
        handleFocus() {
            if (!this.config.enabled) return;

            // Instead of starting immediately, set a timeout to begin the animation.
            // This prevents the indicator from flashing for accidental clicks or very fast messages.
            if (this.state.startIndicatorTimeoutId) clearTimeout(this.state.startIndicatorTimeoutId);
            this.state.startIndicatorTimeoutId = setTimeout(() => {
                this.startTypingIndicator();
            }, this.config.START_DELAY);
        },

        /**
         * Handles the `blur` event on the chat box.
         * @returns {void}
         */
        handleBlur() {
            if (!this.config.enabled) return;

            clearTimeout(this.state.startIndicatorTimeoutId);
            this.stopTypingIndicator();
        },

        /**
         * Intercepts the 'Enter' key press to queue the message.
         * @param {KeyboardEvent} event - The DOM keyboard event.
         * @returns {void}
         */
        handleKeyDown(event) {
            if (this.config.enabled && event.key === 'Enter') {
                // Prevent the game from sending the message. We will handle it.
                event.preventDefault();
                clearTimeout(this.state.startIndicatorTimeoutId);

                const message = this.state.chatBoxElement.value.trim();
                if (message) {
                    this.queueUserMessage(message);
                }

                // Clear the chat box and stop the indicator, as the user is done typing.
                this.state.chatBoxElement.value = '';
                this.stopTypingIndicator();
            }
        },

        // --- CORE LOGIC ---

        /**
         * Starts the animation loop.
         * @returns {void}
         */
        startTypingIndicator() {
            if (!this.config.enabled || this.state.indicatorIntervalId) return; // Already running

            Logger.log("Starting typing indicator.");
            this.state.animationFrameIndex = 0;

            // Run once immediately, then start the interval
            this.animateIndicator();
            this.state.indicatorIntervalId = setInterval(this.animateIndicator.bind(this), this.config.INDICATOR_INTERVAL);
        },

        /**
         * Stops the animation loop and cleans up.
         * @returns {void}
         */
        stopTypingIndicator() {
            if (!this.state.indicatorIntervalId) return; // Already stopped

            Logger.log("Stopping typing indicator and cleaning up queue.");
            clearInterval(this.state.indicatorIntervalId);
            this.state.indicatorIntervalId = null;

            // Remove any pending system messages
            this.state.messageQueue = this.state.messageQueue.filter(msg => msg.type !== 'system');

            // Queue one final, empty message to clear the indicator that might be visible in chat.
            this.queueSystemMessage('');
        },

        /**
         * Queues the next frame of the animation to be sent.
         * @returns {void}
         */
        animateIndicator() {
            const frame = this.config.ANIMATION_FRAMES[this.state.animationFrameIndex];
            this.queueSystemMessage(frame);

            // Cycle to the next frame
            this.state.animationFrameIndex = (this.state.animationFrameIndex + 1) % this.config.ANIMATION_FRAMES.length;
        },

        // --- RATE LIMIT & QUEUE MANAGEMENT ---

        /**
         * Starts the interval that processes the message queue.
         * @returns {void}
         */
        startQueueProcessor() {
            if (this.state.queueProcessorIntervalId) return;
            this.state.queueProcessorIntervalId = setInterval(this.processMessageQueue.bind(this), this.config.QUEUE_PROCESSOR_INTERVAL);
        },

        /**
         * Adds a user-typed message to the front of the queue.
         * @param {string} message - The user's chat message.
         * @returns {void}
         */
        queueUserMessage(message) {
            Logger.log(`Queueing user message: "${message}"`);
            this.state.messageQueue.unshift({ type: 'user', content: message });
        },

        /**
         * Adds a system message (like the indicator) to the back of the queue.
         * @param {string} message - The system message content.
         * @returns {void}
         */
        queueSystemMessage(message) {
            // Optimization: Don't queue up a ton of indicator dots. 
            // If the last message in the queue is also an indicator, replace it.
            const lastInQueue = this.state.messageQueue[this.state.messageQueue.length - 1];
            if (lastInQueue && lastInQueue.type === 'system') {
                this.state.messageQueue[this.state.messageQueue.length - 1].content = message;
            } else {
                this.state.messageQueue.push({ type: 'system', content: message });
            }
        },

        /**
         * Checks the queue and sends the next message if the rate limit has passed.
         * @returns {void}
         */
        processMessageQueue() {
            const CoreC = this.core.data.constants;
            const canSendMessage = (Date.now() - this.state.lastMessageSentTime) > this.config.RATE_LIMIT_MS;

            if (canSendMessage && this.state.messageQueue.length > 0) {
                const messageToSend = this.state.messageQueue.shift(); // Get the next message

                this.core.sendGamePacket(CoreC.PACKET_TYPES.CHAT, [messageToSend.content]);
                this.state.lastMessageSentTime = Date.now();

                if (messageToSend.type === 'user') {
                    Logger.log(`Sent queued user message: "${messageToSend.content}"`);
                }
            }
        }
    };

    /**
     * @module ProximityChatMiniMod
     * @description Displays nearby player chats in a Minecraft/Roblox-style chatbox,
     * showing player names, leaderboard ranks, and timestamps.
     */
    const ProximityChatMiniMod = {
        // --- MINI-MOD PROPERTIES ---

        /** @property {object|null} core - A reference to the core module. */
        core: null,

        /** @property {string} name - The display name of the minimod. */
        name: "Proximity Chat",

        /** @property {object} config - Holds user-configurable settings. */
        config: {
            /** @property {boolean} enabled - Master switch for this minimod. */
            enabled: true,
            /** @property {string} TOGGLE_KEY - The hotkey to show or hide the toolbar. */
            TOGGLE_KEY: 'T',
            /** @property {number} maxMessages - The maximum number of messages to keep in the chatbox. */
            maxMessages: 12
        },

        /** @property {object} constants - Constants specific to this minimod. */
        constants: {
            DOM: {
                CHATBOX_CONTAINER_ID: 'proximityChatboxContainer',
                CHATBOX_MESSAGES_ID: 'proximityChatboxMessages',
                CHAT_MESSAGE_CLASS: 'proximityChatMessage'
            }
        },

        /** @property {object} state - Dynamic state for this minimod. */
        state: {
            /** @property {boolean} isVisible - Whether the toolbar UI is currently shown. */
            isVisible: true,
            /** @property {Map<number, object>} players - Maps player SID to their data {id, name}. */
            players: new Map(),
            /** @property {Map<number, number>} leaderboard - Maps player SID to their rank. */
            leaderboard: new Map(),
            /** @property {HTMLElement|null} chatboxContainer - Reference to the main chatbox UI element. */
            chatboxContainer: null,
            /** @property {HTMLElement|null} messagesContainer - Reference to the inner element that holds messages. */
            messagesContainer: null,
            /** @property {object} boundHandlers - Stores bound event handler functions for easy addition and removal of listeners. */
            boundHandlers: {}
        },

        /**
         * Defines the settings for this minimod.
         * @returns {Array<object>} An array of setting definition objects.
         */
        getSettings() {
            return [
                {
                    id: 'proximity_chat_enabled',
                    configKey: 'enabled',
                    label: 'Enable Proximity Chat',
                    desc: 'Shows nearby chats in a custom chatbox.',
                    type: 'checkbox',
                    onChange: (value) => this.toggleFeature(value)
                },
                {
                    id: 'proximity_chat_toggle_key',
                    configKey: 'TOGGLE_KEY',
                    label: 'Toggle Chatbox Key',
                    desc: 'Press to show or hide the chatbox.',
                    type: 'keybind'
                },
                {
                    id: 'proximity_chat_max_messages',
                    configKey: 'maxMessages',
                    label: 'Max Chat Messages',
                    desc: 'The number of messages to show before old ones disappear.',
                    type: 'number', min: 10, max: 500
                }
            ];
        },

        // --- MINI-MOD LIFECYCLE & HOOKS ---

        /**
         * Initializes the minimod by creating the chatbox UI.
         * @returns {void}
         */
        init() {
            if (!this.config.enabled) return;

            const CoreC = this.core.data.constants;

            // Wait for the main game UI to be ready before injecting our chatbox
            this.core.waitForElementsToLoad(CoreC.DOM.GAME_UI).then(gameUI => {
                const chatboxContainer = document.createElement('div');
                chatboxContainer.id = this.constants.DOM.CHATBOX_CONTAINER_ID;

                this.core.registerFocusableElement(chatboxContainer.id);

                const messagesContainer = document.createElement('div');
                messagesContainer.id = this.constants.DOM.CHATBOX_MESSAGES_ID;

                chatboxContainer.appendChild(messagesContainer);
                gameUI.appendChild(chatboxContainer);

                this.state.chatboxContainer = chatboxContainer;
                this.state.messagesContainer = messagesContainer;

                this.state.boundHandlers.handleKeyDown = (e) => {
                    if (!this.config.enabled || this.core.isInputFocused()) return;

                    if (e.key.toUpperCase() === this.config.TOGGLE_KEY) {
                        this.state.isVisible = !this.state.isVisible;
                        this.state.chatboxContainer.style.display = this.state.isVisible ? CoreC.CSS.DISPLAY_FLEX : CoreC.CSS.DISPLAY_NONE;
                    }
                };

                document.addEventListener('keydown', this.state.boundHandlers.handleKeyDown);
            });
        },
        
        /**
         * Returns the CSS rules required for styling the chatbox.
         * @returns {string} The complete CSS string.
         */
        applyCSS() {
            const LocalC = this.constants;
            return `
                #${LocalC.DOM.CHATBOX_CONTAINER_ID} {
                    position: absolute;
                    bottom: 215px; /* Positioned above the action bar */
                    left: 20px;
                    width: 400px;
                    max-width: 50%;
                    height: 250px;
                    opacity: 0.75;
                    background-color: rgba(0, 0, 0, 0.33333);
                    border-radius: 4px;
                    color: white;
                    font-family: 'Hammersmith One', sans-serif;
                    font-size: 16px;
                    display: flex;
                    flex-direction: column-reverse; /* New messages appear at the bottom */
                    pointer-events: all;
                    z-index: 10; /* Ensure it's above most game elements but below menus */
                    
                    /* --- KEY CHANGE: Scrolling is now handled by the main container --- */
                    overflow-y: auto; 
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.3) rgba(0, 0, 0, 0.2);
                    transition: opacity 1s;

                    &:hover {
                        opacity: 1;
                    }

                    &:not(:has(.${LocalC.DOM.CHAT_MESSAGE_CLASS})):is(&, &:hover) {
                        opacity: 0;
                    }
                }

                #${LocalC.DOM.CHATBOX_CONTAINER_ID}::-webkit-scrollbar {
                    width: 6px;
                }

                #${LocalC.DOM.CHATBOX_CONTAINER_ID}::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.2);
                }

                #${LocalC.DOM.CHATBOX_CONTAINER_ID}::-webkit-scrollbar-thumb {
                    background-color: rgba(255, 255, 255, 0.3);
                    border-radius: 3px;
                }

                #${LocalC.DOM.CHATBOX_MESSAGES_ID} {
                    /* --- KEY CHANGE: Removed flex properties and overflow from the inner container --- */
                    padding: 8px;
                    word-wrap: break-word;
                }

                .${LocalC.DOM.CHAT_MESSAGE_CLASS} {
                    margin-top: 4px;
                    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
                    animation: fadeIn 0.3s ease-in-out;
                    transition: 1s;
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .${LocalC.DOM.CHAT_MESSAGE_CLASS} .timestamp {
                    color: #AAAAAA;
                }

                .${LocalC.DOM.CHAT_MESSAGE_CLASS} .player-name {
                    font-weight: bold;
                    color: #FFFFFF;
                }

                .${LocalC.DOM.CHAT_MESSAGE_CLASS} .message-content {
                    color: #FFFFFF;
                }
            `;
        },
        
        /**
         * Cleans up all UI created by this minimod.
         * @returns {void}
         */
        cleanup() {
            this.state.chatboxContainer?.remove();
            this.state.chatboxContainer = null;
            this.state.messagesContainer = null;
            this.state.players.clear();
            this.state.leaderboard.clear();
            
            document.removeEventListener('keydown', this.state.boundHandlers.handleKeyDown);
        },

        /**
         * Toggles the feature's visibility.
         * @param {boolean} isEnabled - The new enabled state.
         */
        toggleFeature(isEnabled) {
            if (this.state.chatboxContainer) {
                this.state.chatboxContainer.style.display = isEnabled ? 'flex' : 'none';
            }
        },

        /**
         * Handles incoming game packets to update the minimod's state.
         * @param {string} packetName - The human-readable name of the packet.
         * @param {object} packetData - The parsed data object from the packet.
         */
        onPacket(packetName, packetData) {
            if (!this.config.enabled) return;

            switch (packetName) {
                case 'Add Player':
                    if (packetData.sid) {
                        this.state.players.set(packetData.sid, { id: packetData.id, name: packetData.name });
                    }
                    break;

                case 'Remove Player': {
                    const idToRemove = packetData.id;
                    for (const [sid, playerData] of this.state.players.entries()) {
                        if (playerData.id === idToRemove) {
                            this.state.players.delete(sid);
                            break;
                        }
                    }
                    break;
                }

                case 'Leaderboard Update':
                    this.state.leaderboard.clear();
                    packetData.leaderboard.forEach((player, index) => {
                        this.state.leaderboard.set(player.sid, index + 1);
                    });
                    break;

                case 'Receive Chat':
                    if (!(/^\.+$/.test(packetData.message))) this.addChatMessage(packetData.sid, packetData.message);
                    break;

                case 'Client Player Death':
                case 'Setup Game': // Clear on respawn or new game
                    this.state.players.clear();
                    this.state.leaderboard.clear();
                    if (this.state.messagesContainer) {
                        this.state.messagesContainer.innerHTML = '';
                    }
                    break;
            }
        },
        
        /**
         * Creates and adds a new chat message to the UI.
         * @param {number} sid - The sender's session ID.
         * @param {string} message - The chat message content.
         */
        async addChatMessage(sid, message) {
            if (!this.config.enabled || !this.state.messagesContainer) return;

            const playerInfo = this.state.players.get(sid);
            const rank = this.state.leaderboard.get(sid);

            let playerName = playerInfo ? playerInfo.name : `Player ${sid}`;
            if (rank) {
                playerName = `[${rank}] ${playerName}`;
            }

            const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

            // Create elements safely to prevent HTML injection
            const msgElement = document.createElement('div');
            msgElement.className = this.constants.DOM.CHAT_MESSAGE_CLASS;

            const timeSpan = document.createElement('span');
            timeSpan.className = 'timestamp';
            timeSpan.textContent = `[${timestamp}] `;
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'player-name';
            nameSpan.textContent = `${playerName}`;
            // Style ranked players differently for emphasis
            if (rank) {
                nameSpan.style.color = '#FFD700'; // Gold color
            }

            const contentSpan = document.createElement('span');
            contentSpan.className = 'message-content';
            contentSpan.textContent = `: ${message}`;

            msgElement.append(timeSpan, nameSpan, contentSpan);
            
            // Add to UI and manage message limit
            this.state.messagesContainer.appendChild(msgElement);

            if (this.state.messagesContainer.children.length > this.config.maxMessages) {
                const lastMessage = this.state.messagesContainer.firstChild;

                lastMessage.style.opacity = '0';
                lastMessage.style.translateY = '-10px';

                await this.core.wait(1000);

                this.state.messagesContainer.removeChild(lastMessage);
            }
        },
    };

    // --- REGISTER MINI-MODS & INITIALIZE ---

    MooMooUtilityMod.registerMod(SettingsManagerMiniMod);
    MooMooUtilityMod.registerMod(ScrollInventoryMiniMod);
    MooMooUtilityMod.registerMod(WearablesToolbarMiniMod);
    MooMooUtilityMod.registerMod(TypingIndicatorMiniMod);
    MooMooUtilityMod.registerMod(ProximityChatMiniMod);

    MooMooUtilityMod.init();
})();