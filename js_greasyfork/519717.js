// ==UserScript==
// @name         Snickelmarket
// @namespace    https://greasyfork.org/en/scripts/519717-snickelmarket/
// @version      0.1.9
// @description  Add quality and bonus percent to the item market, auction house, and bazaars.
// @author       https://www.torn.com/profiles.php?XID=2487979
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/amarket.php*
// @match        https://www.torn.com/bazaar.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/519717/Snickelmarket.user.js
// @updateURL https://update.greasyfork.org/scripts/519717/Snickelmarket.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const DEFAULT_USER_SETTINGS = {
        enableItemMarket: true,
        enableAuctionHouse: true,
        enableBazaar: true,
        enableQuality: true,
        enableBonus: true,
        enableFilter: true,
        enableColourTiers: true
    };
    function loadUserSettings() {
        try {
            const stored = localStorage.getItem('snickelmarketSettings');
            if (stored) {
                const parsedSettings = JSON.parse(stored);
                return { ...DEFAULT_USER_SETTINGS, ...parsedSettings };
            }
        } catch (e) {
            console.warn('[Snickelmarket] Failed to load settings from storage, using defaults:', e);
        }
        return { ...DEFAULT_USER_SETTINGS };
    }
    function saveUserSettings(settings) {
        try {
            localStorage.setItem('snickelmarketSettings', JSON.stringify(settings));
        } catch (e) {
            console.warn('[Snickelmarket] Failed to save settings to storage:', e);
        }
    }
    const USER_SETTINGS = loadUserSettings();
    const CONFIG = {
        scriptName: "[Snickelmarket]",
        debounce: {
            websocket: 15
        },
        timeouts: {
            filterCheck: 2000,
            itemCheck: 3000,
            checkInterval: 5
        },
        colors: {
            quality: {
                default: '#00e5ff'
            },
            bonus: {
                light: 'green',
                dark: 'lightgreen'
            },
            tiers: {
                teal: { dark: '#00d4aa', light: '#009688' },
                blue: { dark: '#43a6f3', light: '#1565c0' },
                purple: { dark: '#c286ff', light: '#7b1fa2' },
                gold: { dark: '#ffd700', light: '#f57c00' }
            },
            heatMap: {
                dark: 'rgba(30, 144, 255, 0.7)',
                light: 'rgba(70, 130, 180, 0.6)'
            }
        },
        style: {
            containerLineHeight: '1',
            qualityBox: {
                position: 'absolute',
                top: '2px',
                left: '2px',
                padding: '1px 3px',
                borderRadius: '3px',
                fontSize: '11px',
                fontWeight: 'bold',
                zIndex: '2'
            }
        }
    };
    const STYLE_OVERRIDES = `
    .itemTile___cbw7w {
        padding: 5px 3px 0 !important;
    }
    .itemTile___cbw7w .title___bQI0h {
        padding: 5px 0 0px !important;
    }
    .snickel-bonuses div {
        font-size: 11px !important;
    }
    .snickel-settings-button .arrow-icon {
        transition: transform 0.2s ease;
        margin-left: 8px;
        display: inline-block;
        width: 12px;
        height: 12px;
    }
    .snickel-settings-button.expanded .arrow-icon {
        transform: rotate(90deg);
    }
    .snickel-submenu {
        display: none;
        background: var(--default-bg-panel-color);
        border-top: 1px solid var(--default-panel-divider-outer-side-color);
    }
    .snickel-submenu.active {
        display: block;
    }
    .snickel-submenu .setting {
        cursor: pointer;
    }
    .snickel-submenu .setting:hover {
        background: var(--default-bg-panel-active-color);
    }
    .snickel-submenu .setting-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
    .snickel-submenu .setting-name {
        flex: 1;
    }
    .snickel-websocket-highlight {
        box-shadow: inset 0 0 0 2px #ff0000;
        animation: snickel-pulse 1s ease-in-out;
        transition: box-shadow 1.5s ease-out;
        box-sizing: border-box;
    }
    @keyframes snickel-pulse {
        0% { box-shadow: inset 0 0 0 2px #ff0000; }
        50% { box-shadow: inset 0 0 8px 2px #ff0000; }
        100% { box-shadow: inset 0 0 0 2px #ff0000; }
    }
    .snickel-websocket-highlight.permanent {
        box-shadow: inset 0 0 0 2px rgba(255, 0, 0, 0.3);
    }
    `;
    const state = {
        processedElements: new WeakSet(),
        theme: {
            observer: null,
            colors: {
                quality: CONFIG.colors.quality.default,
                bonus: CONFIG.colors.bonus.light
            }
        },
        filters: {
            qualityMin: 0,
            qualityMax: 300,
            bonusMin: 0,
            bonusMax: 100
        },
        gameFilter: {
            selectedBonus: null,
            isAbsoluteScaling: false,
            absoluteBonusName: null,
            specificPieceType: null,
            specificSetName: null
        },
        hashChanged: false,
        debounce: {
            websocket: { timeout: null, pending: false }
        },
        pages: {
            itemMarket: {
                fetchResponseCache: [],
                sockets: [],
                currentCategory: null,
                isInitialized: false,
                backgroundMonitor: null,
                sliderInsertionAttempts: 0
            }
        }
    };
    const BONUS_INFO = {
        50: { name: 'Achilles', min: 50, max: 149 },
        72: { name: 'Assassinate', min: 50, max: 148 },
        52: { name: 'Backstab', min: 30, max: 96 },
        54: { name: 'Berserk', min: 20, max: 87 },
        57: { name: 'Bleed', min: 20, max: 67 },
        51: { name: 'Blindside', min: 25, max: 96 },
        85: { name: 'Bloodlust', min: 10, max: 17 },
        67: { name: 'Comeback', min: 50, max: 127 },
        55: { name: 'Conserve', min: 25, max: 49 },
        45: { name: 'Cripple', min: 20, max: 58 },
        49: { name: 'Crusher', min: 50, max: 133 },
        47: { name: 'Cupid', min: 50, max: 157 },
        63: { name: 'Deadeye', min: 25, max: 123 },
        62: { name: 'Deadly', min: 2, max: 9 },
        86: { name: 'Disarm', min: 3, max: 15 },
        74: { name: 'Double-edged', min: 10, max: 32 },
        105: { name: 'Double Tap', min: 15, max: 54 },
        87: { name: 'Empower', min: 52, max: 206 },
        56: { name: 'Eviscerate', min: 15, max: 34 },
        75: { name: 'Execute', min: 15, max: 28 },
        1: { name: 'Expose', min: 7, max: 21 },
        82: { name: 'Finale', min: 10, max: 17 },
        79: { name: 'Focus', min: 15, max: 32 },
        80: { name: 'Frenzy', min: 5, max: 14 },
        64: { name: 'Fury', min: 10, max: 34 },
        53: { name: 'Grace', min: 20, max: 66 },
        83: { name: 'Home Run', min: 50, max: 93 },
        61: { name: 'Motivation', min: 15, max: 35 },
        59: { name: 'Paralyze', min: 5, max: 18 },
        84: { name: 'Parry', min: 50, max: 92 },
        101: { name: 'Penetrate', min: 25, max: 49 },
        21: { name: 'Plunder', min: 20, max: 49 },
        68: { name: 'Powerful', min: 15, max: 49 },
        14: { name: 'Proficience', min: 20, max: 59 },
        66: { name: 'Puncture', min: 20, max: 57 },
        88: { name: 'Quicken', min: 50, max: 219 },
        65: { name: 'Rage', min: 4, max: 18 },
        41: { name: 'Revitalize', min: 10, max: 24 },
        43: { name: 'Roshambo', min: 50, max: 132 },
        44: { name: 'Slow', min: 20, max: 64 },
        73: { name: 'Smurf', min: 1, max: 4 },
        71: { name: 'Specialist', min: 20, max: 52 },
        20: { name: 'Stricken', min: 30, max: 96 },
        58: { name: 'Stun', min: 10, max: 40 },
        60: { name: 'Suppress', min: 25, max: 49 },
        78: { name: 'Sure Shot', min: 3, max: 11 },
        48: { name: 'Throttle', min: 50, max: 170 },
        81: { name: 'Warlord', min: 15, max: 45 },
        46: { name: 'Weaken', min: 20, max: 63 },
        76: { name: 'Wind-up', min: 125, max: 221 },
        42: { name: 'Wither', min: 20, max: 63 },
        102: { name: 'Irradiate', min: 0, max: 38 },
        120: { name: 'Shock', min: 75, max: 90 },
        33: { name: 'Blindfire', min: 15, max: 20 },
        30: { name: 'Burn', min: 30, max: 50 },
        36: { name: 'Demoralize', min: 20, max: 23 },
        38: { name: 'Freeze', min: 20, max: 26 },
        89: { name: 'Lacerate', min: 35, max: 45 },
        32: { name: 'Poison', min: 85, max: 100 },
        35: { name: 'Spray', min: 20, max: 24 },
        103: { name: 'Toxin', min: 30, max: 44 },
        104: { name: 'Smash', min: 100, max: 100 },
        106: { name: 'Emasculate', min: 15, max: 16 },
        107: { name: 'Hazardous', min: 20, max: 31 },
        108: { name: 'Sleep', min: 0, max: 0 },
        109: { name: 'Storage', min: 100, max: 100 }
    };
    const ARMOR_BONUS_RANGES = {
        'Delta': {
            'Invulnerable': {
                'Gas Mask': { min: 12, max: 14 },
                'Body': { min: 8, max: 10 },
                'Pants': { min: 7, max: 9 },
                'Gloves': { min: 4, max: 6 },
                'Boots': { min: 4, max: 7 }
            },
            uniformRange: false
        },
        'Marauder': {
            'Imperviable': {
                'Face Mask': { min: 5, max: 7 },
                'Body': { min: 7, max: 10 },
                'Pants': { min: 4, max: 6 },
                'Gloves': { min: 2, max: 3 },
                'Boots': { min: 2, max: 3 }
            },
            uniformRange: false
        },
        'Sentinel': {
            'Immutable': {
                'Helmet': { min: 30, max: 40 },
                'Body': { min: 40, max: 50 },
                'Pants': { min: 25, max: 30 },
                'Gloves': { min: 15, max: 18 },
                'Boots': { min: 15, max: 19 }
            },
            uniformRange: false
        },
        'Vanguard': {
            'Irrepressible': {
                'Helmet': { min: 30, max: 39 },
                'Body': { min: 40, max: 52 },
                'Pants': { min: 25, max: 33 },
                'Gloves': { min: 15, max: 18 },
                'Boots': { min: 15, max: 19 }
            },
            uniformRange: false
        },
        'EOD': {
            'Impassable': {
                'Helmet': { min: 20, max: 29 },
                'Apron': { min: 20, max: 29 },
                'Pants': { min: 20, max: 29 },
                'Gloves': { min: 20, max: 29 },
                'Boots': { min: 20, max: 29 }
            },
            uniformRange: true
        },
        'Riot': {
            'Impregnable': {
                'Helmet': { min: 20, max: 29 },
                'Body': { min: 20, max: 29 },
                'Pants': { min: 20, max: 29 },
                'Gloves': { min: 20, max: 29 },
                'Boots': { min: 20, max: 29 }
            },
            uniformRange: true
        },
        'Assault': {
            'Impenetrable': {
                'Helmet': { min: 20, max: 29 },
                'Body': { min: 20, max: 29 },
                'Pants': { min: 20, max: 29 },
                'Gloves': { min: 20, max: 29 },
                'Boots': { min: 20, max: 29 }
            },
            uniformRange: true
        },
        'Dune': {
            'Insurmountable': {
                'Helmet': { min: 30, max: 38 },
                'Vest': { min: 30, max: 38 },
                'Pants': { min: 30, max: 38 },
                'Gloves': { min: 30, max: 38 },
                'Boots': { min: 30, max: 38 }
            },
            uniformRange: true
        }
    };
    const ARMORY_SET_MAP = {
        eod: 'EOD',
        riot: 'Riot',
        assault: 'Assault',
        dune: 'Dune',
        delta: 'Delta',
        marauder: 'Marauder',
        sentinel: 'Sentinel',
        vanguard: 'Vanguard',
    };
    const BASE_DAMAGE_VALUES = {
        1: 17, 2: 16, 3: 20, 4: 11, 5: 21, 6: 25, 7: 28, 8: 34, 9: 40, 10: 61,
        11: 58, 12: 28, 13: 29, 14: 32, 15: 36, 16: 44, 17: 48, 18: 52, 19: 55, 20: 59,
        21: 64, 22: 41, 23: 39, 24: 45, 25: 48, 26: 56, 27: 55, 28: 59, 29: 61, 30: 64,
        31: 67, 63: 72, 76: 52, 98: 59, 99: 33, 100: 64, 108: 65, 109: 77, 110: 27, 111: 39,
        146: 65, 147: 22, 170: 60, 173: 24, 174: 50, 175: 1, 177: 61, 189: 42, 217: 57, 218: 35,
        219: 63, 223: 69, 224: 23, 225: 56, 227: 38, 228: 50, 230: 18, 231: 60, 232: 62, 233: 61,
        234: 31, 235: 22, 236: 35, 237: 62, 238: 29, 240: 78, 241: 50, 243: 30, 244: 15, 245: 13,
        247: 52, 248: 62, 249: 46, 250: 50, 251: 53, 252: 49, 253: 27, 254: 47, 255: 67, 289: 70,
        290: 70, 291: 70, 292: 70, 346: 40, 359: 16, 360: 53, 382: 75, 387: 67, 388: 74, 391: 57,
        393: 14, 395: 61, 397: 71, 398: 69, 399: 68, 400: 63, 401: 26, 402: 51, 438: 18, 439: 19,
        440: 1, 483: 42, 484: 46, 485: 40, 486: 38, 487: 39, 488: 37, 489: 35, 490: 46, 539: 36,
        545: 79, 546: 76, 547: 78, 548: 77, 549: 80, 599: 60, 600: 61, 604: 43, 605: 45, 612: 65,
        613: 47, 614: 60, 615: 64, 632: 48, 790: 5, 792: 17, 805: 18, 830: 95, 831: 54, 832: 21,
        837: 66, 838: 63, 839: 60, 844: 15, 845: 58, 846: 56, 850: 58, 871: 5, 874: 68, 1053: 41,
        1055: 35, 1056: 40, 1152: 76, 1153: 74, 1154: 73, 1155: 70, 1156: 68, 1157: 69, 1158: 62,
        1159: 51, 1173: 37, 1231: 29, 1255: 54, 1257: 1, 1296: 27
    };
    const BASE_ACCURACY_VALUES = {
        1: 55, 2: 57, 3: 52, 4: 62, 5: 45, 6: 55, 7: 60, 8: 52, 9: 58, 10: 23,
        11: 52, 12: 53, 13: 52, 14: 56, 15: 54, 16: 58, 17: 51, 18: 49, 19: 38, 20: 36,
        21: 30, 22: 63, 23: 65, 24: 51, 25: 51, 26: 52, 27: 47, 28: 55, 29: 47, 30: 45,
        31: 41, 63: 28, 76: 24, 98: 24, 99: 57, 100: 24, 108: 43, 109: 39, 110: 52, 111: 51,
        146: 49, 147: 15, 170: 24, 173: 55, 174: 56, 175: 54, 177: 53, 189: 54, 217: 49, 218: 63,
        219: 55, 223: 52, 224: 52, 225: 62, 227: 48, 228: 48, 230: 22, 231: 46, 232: 50, 233: 55,
        234: 52, 235: 59, 236: 55, 237: 56, 238: 52, 240: 25, 241: 57, 243: 57, 244: 39, 245: 55,
        247: 55, 248: 53, 249: 47, 250: 53, 251: 51, 252: 62, 253: 41, 254: 52, 255: 39, 289: 54,
        290: 54, 291: 54, 292: 54, 346: 63, 359: 50, 360: 57, 382: 62, 387: 63, 388: 45, 391: 65,
        393: 54, 395: 60, 397: 28, 398: 50, 399: 57, 400: 35, 401: 33, 402: 60, 438: 42, 439: 43,
        440: 63, 483: 52, 484: 41, 485: 54, 486: 45, 487: 43, 488: 41, 489: 48, 490: 24, 539: 55,
        545: 38, 546: 47, 547: 46, 548: 45, 549: 36, 599: 48, 600: 41, 604: 45, 605: 48, 612: 52,
        613: 63, 614: 62, 615: 52, 632: 48, 790: 29, 792: 57, 805: 55, 830: 45, 831: 53, 832: 54,
        837: 36, 838: 60, 839: 45, 844: 45, 845: 53, 846: 52, 850: 50, 871: 59, 874: 57, 1053: 65,
        1055: 49, 1056: 47, 1152: 42, 1153: 44, 1154: 40, 1155: 45, 1156: 36, 1157: 49, 1158: 39,
        1159: 56, 1173: 67, 1231: 59, 1255: 52, 1257: 59, 1296: 58
    };
    const BASE_ARMOR_VALUES = {
        32: 20, 33: 32, 34: 34, 49: 31, 50: 36, 176: 23, 178: 30, 332: 38, 333: 40, 334: 42,
        348: 10, 538: 25, 640: 32, 641: 34, 642: 30, 643: 30, 644: 34, 645: 30, 646: 24, 647: 20,
        648: 20, 649: 20, 650: 20, 651: 38, 652: 38, 653: 38, 654: 38, 655: 35, 656: 45, 657: 45,
        658: 45, 659: 45, 660: 44, 661: 44, 662: 44, 663: 44, 664: 44, 665: 46, 666: 46, 667: 46,
        668: 46, 669: 46, 670: 49, 671: 49, 672: 49, 673: 49, 674: 49, 675: 40, 676: 52, 677: 52,
        678: 52, 679: 52, 680: 55, 681: 55, 682: 55, 683: 55, 684: 55, 848: 32, 1164: 38, 1165: 50,
        1166: 50, 1167: 50, 1168: 50, 1174: 39, 1307: 53, 1308: 53, 1309: 53, 1310: 53, 1311: 53,
        1355: 48, 1356: 48, 1357: 48, 1358: 48, 1359: 48
    };
    const BASE_STATS_MAP = Object.keys({
        ...BASE_DAMAGE_VALUES,
        ...BASE_ACCURACY_VALUES,
        ...BASE_ARMOR_VALUES
    }).reduce((map, id) => {
        map[id] = {
            baseDamage: BASE_DAMAGE_VALUES[id] ?? 0,
            baseAccuracy: BASE_ACCURACY_VALUES[id] ?? 0,
            baseArmor: BASE_ARMOR_VALUES[id] ?? 0
        };
        return map;
    }, {});
    const BONUS_INFO_BY_NAME = Object.freeze(Object.entries(BONUS_INFO).reduce((acc, [id, info]) => {
        acc[info.name] = { ...info, id: Number(id) };
        return acc;
    }, {}));
    Object.freeze(BONUS_INFO);
    Object.freeze(BASE_DAMAGE_VALUES);
    Object.freeze(BASE_ACCURACY_VALUES);
    Object.freeze(BASE_ARMOR_VALUES);
    Object.freeze(BASE_STATS_MAP);
    const NUMBER_REGEX = /(\d+(?:\.\d+)?)/;
    const utils = {
        log: (message, ...args) => console.log(`${CONFIG.scriptName} ${message}`, ...args),
        warn: (message, ...args) => console.warn(`${CONFIG.scriptName} ${message}`, ...args),
        error: (message, ...args) => console.error(`${CONFIG.scriptName} ${message}`, ...args),
        querySelector: (selector, parent = document) => {
            try {
                return parent.querySelector(selector);
            } catch (e) {
                utils.error(`Failed to query selector: ${selector}`, e);
                return null;
            }
        },
        querySelectorAll: (selector, parent = document) => {
            try {
                return Array.from(parent.querySelectorAll(selector));
            } catch (e) {
                utils.error(`Failed to query selector: ${selector}`, e);
                return [];
            }
        },
        createElement: (tag, attributes = {}, children = []) => {
            const element = document.createElement(tag);
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'dataset' && typeof value === 'object') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element[key] = value;
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') {
                    element.appendChild(document.createTextNode(child));
                } else if (child) {
                    element.appendChild(child);
                }
            });
            return element;
        },
        waitForElement: (selector, timeout = CONFIG.timeouts.filterCheck) => {
            return new Promise((resolve) => {
                const checkInterval = CONFIG.timeouts.checkInterval;
                let elapsedTime = 0;
                const check = () => {
                    const element = utils.querySelector(selector);
                    if (element) {
                        resolve(element);
                    } else if (elapsedTime >= timeout) {
                        utils.warn(`Timed out waiting for element: ${selector}`);
                        resolve(null);
                    } else {
                        elapsedTime += checkInterval;
                        setTimeout(check, checkInterval);
                    }
                };
                check();
            });
        },
        debounce: (func, wait, immediate) => {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },
        isProcessed: (element) => state.processedElements.has(element),
        markProcessed: (element) => state.processedElements.add(element),
        injectGlobalStyle: (css, id = null) => {
            if (id && document.getElementById(id)) return;
            const style = document.createElement('style');
            if (id) style.id = id;
            style.textContent = css;
            (document.body || document.documentElement).appendChild(style);
        },
        isDisarmBonus: (bonusName) => {
            if (!bonusName) return false;
            return bonusName.toLowerCase() === 'disarm'
        },
        isUnitlessBonus: (bonusName) => {
            if (!bonusName) return false;
            const unitless = ['disarm', 'irradiate'];
            return unitless.includes(bonusName.toLowerCase());
        },
        parseHash: () => {
            const hash = location.hash.startsWith('#') ? location.hash.slice(1) : location.hash;
            let paramString = '';
            if (hash.includes('view=search&')) {
                const searchIndex = hash.indexOf('view=search&');
                if (searchIndex !== -1) {
                    paramString = hash.substring(searchIndex + 'view=search&'.length);
                }
            } else {
                paramString = hash.replace(/^.*\?/, '');
            }
            const params = new URLSearchParams(paramString);
            const category = params.get('categoryName') || params.get('itemType') || null;
            const armourySet = params.get('armourySet') || null;
            const itemID = params.get('itemID') || null;
            const itemName = params.get('itemName') || null;
            const bonusIds = [];
            for (const [key, value] of params.entries()) {
                if (key.startsWith('bonuses[')) {
                    bonusIds.push(Number(value));
                }
            }
            return { category, bonusIds, armourySet, itemID, itemName };
        },
        addHashListener: (cb) => {
            window.addEventListener('hashchange', cb);
            window.addEventListener('popstate', cb);
        },
        getActualRawBonusRange: (cache, bonusName) => {
            if (!Array.isArray(cache) || cache.length === 0) return null;
            let min = Infinity;
            let max = -Infinity;
            let found = false;
            cache.forEach(item => {
                (item.bonuses || []).forEach(b => {
                    if (b.title === bonusName) {
                        found = true;
                        const v = b.value ?? 0;
                        if (v < min) min = v;
                        if (v > max) max = v;
                    }
                });
            });
            return found ? { min, max } : null;
        }
    };
    const theme = {
        _isDarkCached: null,
        _cacheFrame: -1,
        isDark: () => {
            const currentFrame = performance.now() >> 4;
            if (theme._cacheFrame !== currentFrame) {
                theme._isDarkCached = document.body.classList.contains('dark-mode');
                theme._cacheFrame = currentFrame;
            }
            return theme._isDarkCached;
        },
        updateColors: () => {
            const isDark = theme.isDark();
            state.theme.colors.bonus = isDark ? CONFIG.colors.bonus.dark : CONFIG.colors.bonus.light;
        },
        getQualityBoxBackground: () => {
            return theme.isDark() ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
        },
        setupObserver: () => {
            if (state.theme.observer) {
                state.theme.observer.disconnect();
                const index = cleanup.observers.indexOf(state.theme.observer);
                if (index > -1) cleanup.observers.splice(index, 1);
            }
            state.theme.observer = new MutationObserver((mutations) => {
                const hasClassChange = mutations.some(mutation =>
                    mutation.type === 'attributes' && mutation.attributeName === 'class'
                );
                if (!hasClassChange) return;
                theme._cacheFrame = -1;
                theme.updateColors();
                setTimeout(() => colors.updateAll(), 50);
            });
            state.theme.observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
            cleanup.addObserver(state.theme.observer);
        }
    };
    const calculations = {
        quality: (itemID, damage, accuracy, armor) => {
            const baseStats = BASE_STATS_MAP[itemID];
            if (!baseStats) {
                utils.warn(`Base stats not found for itemID: ${itemID}`);
                return "N/A";
            }
            const { baseDamage, baseAccuracy, baseArmor } = baseStats;
            let quality;
            if (armor != '0' && armor != 0) {
                const armorDifference = armor - baseArmor;
                quality = armorDifference * 20;
            } else {
                const damageDifference = damage - baseDamage;
                const accuracyDifference = accuracy - baseAccuracy;
                quality = (damageDifference + accuracyDifference) * 10;
            }
            if (quality < 0) {
                utils.warn(`Calculated quality is negative (${quality.toFixed(1)}%) for itemID: ${itemID}. Please let Snickelfritz know.`);
            }
            return quality.toFixed(1);
        },
        bonusPercent: (bonusID, bonusValue, itemData = null) => {
            if (itemData?.type === "Defensive") {
                const itemName = itemData.itemName || '';
                const bonusName = BONUS_INFO[bonusID]?.name || '';
                for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                    for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                        if (bonusType === 'uniformRange') continue;
                        if (bonusName !== bonusType) continue;
                        for (const [pieceType, range] of Object.entries(pieceRanges)) {
                            const pieceKeywords = pieceType.toLowerCase().split(' ');
                            const itemNameLower = itemName.toLowerCase();
                            const matches = pieceKeywords.every(keyword => itemNameLower.includes(keyword));
                            if (!matches) continue;
                            if (range.max === range.min) return bonusValue >= range.max ? 100 : 0;
                            const percentage = ((bonusValue - range.min) / (range.max - range.min)) * 100;
                            return Math.max(0, Math.min(100, percentage));
                        }
                    }
                }
            }
            const range = BONUS_INFO[bonusID];
            if (!range) return 0;
            if (range.max === range.min) return bonusValue >= range.max ? 100 : 0;
            const percentage = ((bonusValue - range.min) / (range.max - range.min)) * 100;
            return Math.max(0, Math.min(100, percentage));
        },
        extractBonusPercent: (bonus, itemData = null) => {
            let bonusValue;
            if (bonus.value !== undefined) {
                bonusValue = bonus.value;
            } else {
                const rawValueMatch = bonus.description.match(NUMBER_REGEX);
                if (!rawValueMatch) return 0;
                bonusValue = parseFloat(rawValueMatch[1]);
            }
            const bonusID = bonus.bonusID ?? BONUS_INFO_BY_NAME[bonus.title]?.id;
            if (bonusID && BONUS_INFO[bonusID]) {
                return calculations.bonusPercent(bonusID, bonusValue, itemData);
            }
            let armorSetInfo = null;
            for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                for (const [bonusName, pieceRanges] of Object.entries(setData)) {
                    if (bonusName === 'uniformRange') continue;
                    if (bonusName === bonus.title) {
                        if (setData.uniformRange) {
                            const firstPiece = Object.values(pieceRanges)[0];
                            armorSetInfo = { min: firstPiece.min, max: firstPiece.max };
                            break;
                        }
                    }
                }
                if (armorSetInfo) break;
            }
            if (armorSetInfo) {
                if (armorSetInfo.max === armorSetInfo.min) return bonusValue >= armorSetInfo.max ? 100 : 0;
                const percentage = ((bonusValue - armorSetInfo.min) / (armorSetInfo.max - armorSetInfo.min)) * 100;
                return Math.max(0, Math.min(100, percentage));
            }
            if (!itemData || itemData.type !== "Defensive" || !itemData.itemName) return 0;
            const itemNameLower = itemData.itemName.toLowerCase();
            for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                    if (bonusType === 'uniformRange') continue;
                    if (bonus.title !== bonusType) continue;
                    for (const [pieceType, range] of Object.entries(pieceRanges)) {
                        const pieceKeywords = pieceType.toLowerCase().split(' ');
                        const matches = pieceKeywords.every(keyword => itemNameLower.includes(keyword));
                        if (!matches) continue;
                        if (range.max === range.min) return bonusValue >= range.max ? 100 : 0;
                        const percentage = ((bonusValue - range.min) / (range.max - range.min)) * 100;
                        return Math.max(0, Math.min(100, percentage));
                    }
                }
            }
            return 0;
        }
    };
    const colors = {
        getTierColor: (position, range) => {
            const quarter = range / 4;
            const isDark = theme.isDark();
            if (position <= quarter) {
                return isDark ? CONFIG.colors.tiers.teal.dark : CONFIG.colors.tiers.teal.light;
            } else if (position <= quarter * 2) {
                return isDark ? CONFIG.colors.tiers.blue.dark : CONFIG.colors.tiers.blue.light;
            } else if (position <= quarter * 3) {
                return isDark ? CONFIG.colors.tiers.purple.dark : CONFIG.colors.tiers.purple.light;
            } else {
                return isDark ? CONFIG.colors.tiers.gold.dark : CONFIG.colors.tiers.gold.light;
            }
        },
        getQualityColor: (quality, filterMin, filterMax) => {
            if (!USER_SETTINGS.enableColourTiers) {
                return state.theme.colors.bonus;
            }
            if (filterMin === filterMax) return CONFIG.colors.quality.default;
            const range = filterMax - filterMin;
            const position = quality - filterMin;
            return colors.getTierColor(position, range);
        },
        getBonusColor: (bonusPercent, filterMin, filterMax) => {
            if (!USER_SETTINGS.enableColourTiers) {
                return state.theme.colors.bonus;
            }
            if (filterMin === filterMax) return CONFIG.colors.quality.default;
            const range = filterMax - filterMin;
            const position = bonusPercent - filterMin;
            return colors.getTierColor(position, range);
        },
        updateAll: () => {
            colors.updateQualityBoxes();
            colors.updateBonusElements();
        },
        updateQualityBoxes: () => {
            const qualityBoxes = utils.querySelectorAll('.snickel-quality-box');
            const { qualityMin, qualityMax } = filters.getCurrentValues();
            qualityBoxes.forEach(box => {
                const qualityText = utils.querySelector('.label-value', box)?.textContent;
                if (qualityText) {
                    const qualityMatch = qualityText.match(/Q ([\d.]+)%/);
                    if (qualityMatch) {
                        const quality = parseFloat(qualityMatch[1]);
                        box.style.color = colors.getQualityColor(quality, qualityMin, qualityMax);
                    }
                }
                box.style.background = theme.getQualityBoxBackground();
            });
        },
        updateBonusElements: () => {
            const bonusElements = utils.querySelectorAll('div[data-bonus-name]');
            const { bonusMin, bonusMax } = filters.getCurrentValues();
            bonusElements.forEach(element => {
                const bonusName = element.dataset.bonusName;
                const rawValueStr = element.dataset.rawValue;
                if (!bonusName || rawValueStr === undefined) {
                    element.style.color = state.theme.colors.bonus;
                    return;
                }
                const rawValue = parseFloat(rawValueStr);
                const percent = parseFloat(element.dataset.bonusPercent);
                if (state.gameFilter.isAbsoluteScaling && bonusName === state.gameFilter.selectedBonus) {
                    element.style.color = colors.getBonusColor(rawValue, bonusMin, bonusMax);
                    return;
                }
                if (!isNaN(percent)) {
                    element.style.color = colors.getBonusColor(percent, 0, 100);
                } else {
                    element.style.color = state.theme.colors.bonus;
                }
            });
        }
    };
    const elements = {
        createBonusElement: (bonus, bonusPercent = null, itemData = null) => {
            const { bonusMin, bonusMax } = filters.getCurrentValues();
            const bonusInfo = BONUS_INFO[bonus.bonusID];
            const bonusName = bonusInfo?.name || bonus.title;
            let bonusValueText;
            let dataset = {};
            let color = state.theme.colors.bonus;
            let rawValue = null;
            if (bonus.value !== undefined) {
                rawValue = bonus.value;
            } else {
                const rawValueMatch = bonus.description.match(NUMBER_REGEX);
                if (rawValueMatch) {
                    rawValue = parseFloat(rawValueMatch[1]);
                }
            }
            const isMeaninglessBonus = bonusName.toLowerCase() === 'radiation protection';
            if (rawValue !== null && !isMeaninglessBonus) {
                dataset.rawValue = rawValue;
                dataset.bonusName = bonusName;
                dataset.bonusId = bonus.bonusID;
            }
            const isFixedBonus = bonusInfo && bonusInfo.min === bonusInfo.max;
            if (bonusName.toLowerCase() === 'irradiate') {
                bonusValueText = '';
            } else if (isFixedBonus || isMeaninglessBonus) {
                bonusValueText = '';
            } else if (rawValue !== null) {
                const unit = utils.isUnitlessBonus(bonusName) ? ' turns' : '%';
                bonusValueText = `${rawValue}${unit}`;
            } else {
                bonusValueText = 'N/A';
            }
            const text = bonusValueText ? `${bonusName}: ${bonusValueText}` : bonusName;
            if (bonusPercent === null) {
                const fallbackItemData = itemData || {
                    type: rawValue !== null ? 'Defensive' : 'Offensive',
                    itemName: ''
                };
                bonusPercent = calculations.extractBonusPercent(bonus, fallbackItemData);
            }
            if (bonusPercent !== null) {
                color = colors.getBonusColor(bonusPercent, 0, 100);
                dataset.bonusPercent = bonusPercent.toFixed(1);
            }
            return utils.createElement('div', {
                textContent: text,
                style: { color },
                dataset
            });
        },
        injectQualityBox: (imageContainer, qualityValue) => {
            if (!USER_SETTINGS.enableQuality) return;
            if (!imageContainer || utils.querySelector('.snickel-quality-box', imageContainer)) return;
            const { qualityMin, qualityMax } = filters.getCurrentValues();
            const quality = parseFloat(qualityValue);
            const color = colors.getQualityColor(quality, qualityMin, qualityMax);
            const span = utils.createElement('span', {
                className: 'label-value t-overflow',
                textContent: `Q ${qualityValue}%`
            });
            const qualityBox = utils.createElement('div', {
                className: 'snickel-quality-box container___Go0NJ',
                style: {
                    ...CONFIG.style.qualityBox,
                    background: theme.getQualityBoxBackground(),
                    color
                }
            }, [span]);
            const style = window.getComputedStyle(imageContainer);
            if (style.position === 'static') {
                imageContainer.style.position = 'relative';
            }
            imageContainer.appendChild(qualityBox);
        }
    };
    const filters = {
        getCurrentValues: () => {
            if (!USER_SETTINGS.enableFilter) {
                const firstItem = state.pages.itemMarket.fetchResponseCache?.[0];
                const category = firstItem?.type === 'Defensive' ? 'Armor' : 'Weapon';
                let bonusMin = 0, bonusMax = 100;
                if (state.gameFilter.isAbsoluteScaling) {
                    const bonusName = state.gameFilter.absoluteBonusName;
                    let bonusInfo = BONUS_INFO_BY_NAME[bonusName];
                    if (!bonusInfo) {
                        if (state.gameFilter.specificPieceType && state.gameFilter.specificSetName) {
                            const setData = ARMOR_BONUS_RANGES[state.gameFilter.specificSetName];
                            if (setData) {
                                for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                                    if (bonusType === 'uniformRange') continue;
                                    if (bonusType === bonusName && pieceRanges[state.gameFilter.specificPieceType]) {
                                        const pieceRange = pieceRanges[state.gameFilter.specificPieceType];
                                        bonusInfo = { min: pieceRange.min, max: pieceRange.max };
                                        break;
                                    }
                                }
                            }
                        }
                        if (!bonusInfo) {
                            for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                                for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                                    if (bonusType === 'uniformRange') continue;
                                    if (bonusType === bonusName && setData.uniformRange) {
                                        const firstPiece = Object.values(pieceRanges)[0];
                                        bonusInfo = { min: firstPiece.min, max: firstPiece.max };
                                        break;
                                    }
                                }
                                if (bonusInfo) break;
                            }
                        }
                    }
                    if (bonusInfo) {
                        bonusMin = bonusInfo.min;
                        bonusMax = bonusInfo.max;
                        const actualRange = utils.getActualRawBonusRange(state.pages.itemMarket.fetchResponseCache, bonusName);
                        if (actualRange) {
                            bonusMin = Math.min(bonusMin, Math.floor(actualRange.min));
                            bonusMax = Math.max(bonusMax, Math.ceil(actualRange.max));
                        }
                    }
                }
                return {
                    qualityMin: 0,
                    qualityMax: category === 'Armor' ? 100 : 300,
                    bonusMin,
                    bonusMax
                };
            }
            return { ...state.filters };
        },
        getSelectedBonusValue: (itemElement) => {
            if (!state.gameFilter.selectedBonus) return -1;
            const bonusElements = utils.querySelectorAll('div[data-bonus-name]', itemElement);
            for (const element of bonusElements) {
                if (element.dataset.bonusName === state.gameFilter.selectedBonus) {
                    return parseFloat(element.dataset.rawValue || '-1');
                }
            }
            return -1;
        },
        apply: () => {
            const firstItem = state.pages.itemMarket.fetchResponseCache?.[0];
            const category = firstItem?.type === 'Defensive' ? 'Armor' : 'Weapon';
            const qualityMaxDefault = category === 'Armor' ? 100 : 300;
            const qualityDefault = state.filters.qualityMin === 0 && state.filters.qualityMax === qualityMaxDefault;
            let bonusDefault = false;
            if (state.gameFilter.isAbsoluteScaling) {
                const bonusName = state.gameFilter.selectedBonus;
                let knownRange = BONUS_INFO_BY_NAME[bonusName];
                if (!knownRange) {
                    for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                        for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                            if (bonusType === 'uniformRange') continue;
                            if (bonusType === bonusName) {
                                if (setData.uniformRange) {
                                    const firstPiece = Object.values(pieceRanges)[0];
                                    knownRange = { min: firstPiece.min, max: firstPiece.max };
                                }
                                else if (state.gameFilter.specificPieceType && state.gameFilter.specificSetName === setName) {
                                    const pieceRange = pieceRanges[state.gameFilter.specificPieceType];
                                    if (pieceRange) {
                                        knownRange = { min: pieceRange.min, max: pieceRange.max };
                                    }
                                }
                                break;
                            }
                        }
                        if (knownRange) break;
                    }
                }
                if (knownRange) {
                    let min = knownRange.min;
                    let max = knownRange.max;
                    const actualRange = itemMarket.getActualRawBonusRangeFromCache(bonusName);
                    if (actualRange) {
                        min = Math.min(min, Math.floor(actualRange.min));
                        max = Math.max(max, Math.ceil(actualRange.max));
                    }
                    bonusDefault = state.filters.bonusMin === min && state.filters.bonusMax === max;
                } else {
                    bonusDefault = true;
                }
            } else {
                bonusDefault = state.filters.bonusMin === 0 && state.filters.bonusMax === 100;
            }
            const listItems = utils.querySelectorAll('#item-market-root li');
            const itemsToProcess = [];
            listItems.forEach(li => {
                const tile = utils.querySelector('.itemTile___cbw7w', li);
                if (!tile) return;
                let isVisible = true;
                if (!qualityDefault) {
                    const q = parseFloat(tile.dataset.quality || '-1');
                    if (q < state.filters.qualityMin || q > state.filters.qualityMax) {
                        isVisible = false;
                    }
                }
                if (isVisible && !bonusDefault) {
                    let b = -1;
                    if (state.gameFilter.isAbsoluteScaling) {
                        b = filters.getSelectedBonusValue(tile);
                    } else {
                        if (!tile.dataset.bonusPercent) {
                            b = -1;
                        } else {
                            b = parseFloat(tile.dataset.bonusPercent);
                        }
                    }
                    if (b < state.filters.bonusMin || b > state.filters.bonusMax) {
                        isVisible = false;
                    }
                }
                itemsToProcess.push({ li, isVisible });
            });
            requestAnimationFrame(() => {
                itemsToProcess.forEach(({ li, isVisible }) => {
                    li.style.display = isVisible ? "" : "none";
                });
                charts.updateHeatMaps();
                colors.updateAll();
            });
        },
        reinitializeFiltersIfNeeded: () => {
            const newCategory = itemMarket.detectCategory();
            const currentCategory = state.pages.itemMarket.currentCategory;
            if (newCategory !== currentCategory) {
                state.pages.itemMarket.currentCategory = newCategory;
                filters.apply();
            }
        }
    };
    const charts = {
        generateHeatMapData: (filterType, min, max) => {
            const visibleItems = utils.querySelectorAll('#item-market-root li')
                .filter(li => li.style.display !== 'none');
            if (visibleItems.length === 0) return null;
            const binCount = Math.min(50, max - min + 1);
            const data = new Array(binCount).fill(0);
            const binSize = (max - min + 1) / binCount;
            visibleItems.forEach(li => {
                const tile = utils.querySelector('.itemTile___cbw7w', li);
                if (!tile || !utils.isProcessed(tile)) return;
                let value;
                if (filterType === 'quality') {
                    value = parseFloat(tile.dataset.quality || '0');
                    if (isNaN(value) || tile.dataset.quality === undefined) return;
                } else if (filterType === 'bonus') {
                    if (state.gameFilter.isAbsoluteScaling) {
                        value = -1;
                        const bonusElements = utils.querySelectorAll('div[data-bonus-name]', tile);
                        for (const element of bonusElements) {
                            if (element.dataset.bonusName === state.gameFilter.selectedBonus) {
                                value = parseFloat(element.dataset.rawValue);
                                break;
                            }
                        }
                        if (value === -1 || isNaN(value)) return;
                    } else {
                        if (!tile.dataset.bonusPercent) return;
                        value = parseFloat(tile.dataset.bonusPercent);
                        if (isNaN(value) || value < 0) return;
                    }
                } else {
                    return;
                }
                if (value < min || value > max) return;
                const binIndex = Math.floor((value - min) / binSize);
                if (binIndex >= 0 && binIndex < data.length) {
                    data[binIndex]++;
                }
            });
            return data;
        },
        createHeatMapChart: (container, data, min, max) => {
            if (!data || data.length === 0) return;
            const maxCount = Math.max(...data);
            if (maxCount === 0) return;
            const chartContainer = utils.createElement('div', {
                className: 'chart___FojOk',
                style: {
                    display: 'flex',
                    height: '10px',
                    justifyContent: 'space-between',
                    margin: '0 auto',
                    width: 'calc(100% - 23px)'
                }
            });
            const isDark = theme.isDark();
            const binColor = isDark ? CONFIG.colors.heatMap.dark : CONFIG.colors.heatMap.light;
            data.forEach((count) => {
                const heightRatio = count > 0 ? Math.max(0.3, count / maxCount) : 0;
                const height = Math.max(3, heightRatio * 10);
                const column = utils.createElement('div', {
                    className: 'chartColumn___QN_Ja',
                    style: {
                        height: `${height}px`,
                        width: '2px',
                        backgroundColor: count > 0 ? binColor : 'transparent',
                        transition: 'height 0.2s ease'
                    }
                });
                chartContainer.appendChild(column);
            });
            container.appendChild(chartContainer);
        },
        updateHeatMaps: () => {
            const sliders = [
                { selector: '.snickel-sliders .sliderWrapper___w2TgH:first-child', type: 'quality' },
                { selector: '.snickel-sliders .sliderWrapper___w2TgH:last-child', type: 'bonus' }
            ];
            sliders.forEach(({ selector, type }) => {
                const slider = utils.querySelector(selector);
                if (!slider) return;
                const minInput = utils.querySelector('input.sliderMin___B8QGA', slider);
                const maxInput = utils.querySelector('input.sliderMax___J3vAy', slider);
                if (!minInput || !maxInput) return;
                const min = parseInt(minInput.min);
                const max = parseInt(maxInput.max);
                const data = charts.generateHeatMapData(type, min, max);
                const existingChart = utils.querySelector('.chart___FojOk', slider);
                if (existingChart) existingChart.remove();
                const trackContainer = utils.querySelector('.track___umhux', slider);
                if (trackContainer && data) {
                    charts.createHeatMapChart(trackContainer.parentElement, data, min, max);
                }
            });
        }
    };
    const itemMarket = {
        handleWebSocket: (event) => {
            if (typeof event.data !== "string" || !event.data.trim().startsWith("{")) return;
            try {
                const message = JSON.parse(event.data);
                const msg = message?.push?.pub?.data?.message;
                if (msg?.namespace !== "item-market" || !Array.isArray(msg.data)) return;
                if (!hasValidCategory()) {
                    return;
                }
                const action = msg.action;
                const itemDataArray = msg.data;
                if (state.debounce.websocket.pending) return;
                state.debounce.websocket.pending = true;
                if (state.debounce.websocket.timeout) {
                    clearTimeout(state.debounce.websocket.timeout);
                }
                state.debounce.websocket.timeout = setTimeout(async () => {
                    const cache = state.pages.itemMarket.fetchResponseCache;
                    const newListingIDs = [];
                    if (action === "add") {
                        itemDataArray.forEach(itemData => {
                            const exists = cache.some(item => item.listingID === itemData.listingID);
                            if (!exists) {
                                cache.push(itemData);
                                newListingIDs.push(itemData.listingID);
                            }
                        });
                    } else if (action === "remove") {
                        itemDataArray.forEach(itemData => {
                            const index = cache.findIndex(item => item.listingID === itemData.listingID);
                            if (index !== -1) {
                                cache.splice(index, 1);
                            }
                        });
                    }
                    await itemMarket.processItems();
                    if (action === "add" && newListingIDs.length > 0) {
                        itemMarket.highlightNewItems(newListingIDs);
                    }
                    state.debounce.websocket.pending = false;
                }, CONFIG.debounce.websocket);
            } catch (err) {
                utils.error('Error handling WebSocket message:', err);
            }
        },
        highlightNewItems: (listingIDs) => {
            listingIDs.forEach(listingID => {
                const items = utils.querySelectorAll('.itemTile___cbw7w');
                items.forEach(item => {
                    const cache = state.pages.itemMarket.fetchResponseCache;
                    const itemData = cache.find(data => {
                        const price = parseInt(utils.querySelector('.priceAndTotal___eEVS7 span', item)?.textContent.replace(/[^\d]/g, ''), 10);
                        const damage = parseFloat(utils.querySelector('.properties___QCPEP .property___SHm8e:nth-of-type(1) .value___cwqHv', item)?.textContent.trim());
                        const accuracy = parseFloat(utils.querySelector('.properties___QCPEP .property___SHm8e:nth-of-type(2) .value___cwqHv', item)?.textContent.trim());
                        return data.listingID === listingID &&
                            data.minPrice === price &&
                            (data.damage === damage || data.accuracy === accuracy);
                    });
                    if (itemData) {
                        item.classList.add('snickel-websocket-highlight');
                        setTimeout(() => {
                            item.classList.add('permanent');
                        }, 3000);
                    }
                });
            });
        },
        detectCategory: () => {
            const firstItem = state.pages.itemMarket.fetchResponseCache?.[0];
            if (!firstItem) return null;
            return firstItem.type === "Defensive" ? "Armor" :
                (["Primary", "Secondary", "Melee"].includes(firstItem.type) ? "Weapon" : null);
        },
        getActualRawBonusRangeFromCache: (bonusName) => utils.getActualRawBonusRange(state.pages.itemMarket.fetchResponseCache, bonusName),
        cloneSliderWrapper: (originalWrapper, labelText, min, max, onChange) => {
            const wrapper = originalWrapper.cloneNode(true);
            wrapper.style.pointerEvents = 'auto';
            wrapper.style.opacity = '';
            wrapper.removeAttribute('disabled');
            utils.querySelectorAll('.chart___FojOk', wrapper).forEach(chart => chart.remove());
            utils.querySelectorAll('.icon___SKQ_P', wrapper).forEach(icon => icon.remove());
            const isAbsolute = labelText === 'Bonus (Known Range)';
            const isUnitless = isAbsolute && utils.isUnitlessBonus(state.gameFilter.absoluteBonusName);
            const textContainer = utils.querySelector('.text___Lu3Pl', wrapper);
            if (!textContainer) return wrapper;
            const labelDiv = utils.querySelector('.leftText___R0Rwj div:last-child', textContainer);
            if (labelDiv) {
                labelDiv.textContent = labelText;
            }
            const valueDiv = utils.querySelector(':scope > div:last-child', textContainer);
            if (valueDiv) {
                const unit = isUnitless ? '' : '%';
                let minText, maxText;
                if (isAbsolute) {
                    minText = `${min}${unit}`;
                    maxText = `${max}${unit}`;
                } else {
                    minText = `${min}%`;
                    maxText = (max === 100 || max === 300) ? 'All' : `${max}%`;
                }
                valueDiv.textContent = `${minText} - ${maxText}`;
                wrapper._valueDiv = valueDiv;
            }
            const minInput = utils.querySelector('input.sliderMin___B8QGA', wrapper);
            const maxInput = utils.querySelector('input.sliderMax___J3vAy', wrapper);
            const trackContainer = utils.querySelector('.track___umhux', wrapper);
            if (!minInput || !maxInput) return wrapper;
            [minInput, maxInput].forEach(input => {
                input.disabled = false;
                input.removeAttribute('disabled');
                input.min = min;
                input.max = max;
            });
            minInput.value = min;
            maxInput.value = max;
            if (trackContainer) {
                trackContainer.innerHTML = '';
                const segmentCount = Math.max(1, max - min);
                for (let i = 0; i < segmentCount; i++) {
                    const segment = utils.createElement('div', {
                        className: 'trackSegment___W9PLv inRange___IL2UG'
                    });
                    trackContainer.appendChild(segment);
                }
            }
            const textUpdate = (e) => {
                if (parseFloat(minInput.value) > parseFloat(maxInput.value)) {
                    if (e.target === minInput) maxInput.value = minInput.value;
                    else minInput.value = maxInput.value;
                }
                const unit = isUnitless ? '' : '%';
                let minText, maxText;
                if (isAbsolute) {
                    minText = `${minInput.value}${unit}`;
                    maxText = `${maxInput.value}${unit}`;
                } else {
                    minText = `${minInput.value}%`;
                    maxText = (maxInput.value == max) ? 'All' : `${maxInput.value}%`;
                }
                if (wrapper._valueDiv) {
                    wrapper._valueDiv.textContent = `${minText} - ${maxText}`;
                }
                if (trackContainer) {
                    const segments = utils.querySelectorAll('.trackSegment___W9PLv', trackContainer);
                    const minVal = parseFloat(minInput.value);
                    const maxVal = parseFloat(maxInput.value);
                    segments.forEach((segment, index) => {
                        const value = min + index;
                        segment.classList.toggle('inRange___IL2UG', value >= minVal && value <= maxVal);
                    });
                }
            };
            const filterUpdate = () => {
                onChange(parseFloat(minInput.value), parseFloat(maxInput.value));
            };
            minInput.addEventListener('input', textUpdate);
            maxInput.addEventListener('input', textUpdate);
            minInput.addEventListener('change', filterUpdate);
            maxInput.addEventListener('change', filterUpdate);
            return wrapper;
        },
        insertCustomSliders: () => {
            if (state.pages.itemMarket.sliderInsertionAttempts >= 10) {
                return false;
            }
            state.pages.itemMarket.sliderInsertionAttempts++;
            const filtersWrapper = utils.querySelector('.filtersWrapper___pZ6sQ');
            if (!filtersWrapper) {
                return false;
            }
            if (utils.querySelector('.snickel-sliders')) {
                state.pages.itemMarket.sliderInsertionAttempts = 0;
                return true;
            }
            const firstItem = state.pages.itemMarket.fetchResponseCache?.[0];
            const category = firstItem?.type === 'Defensive' ? 'Armor' : 'Weapon';
            const qualityMax = category === 'Armor' ? 100 : 300;
            const slidersRoot = utils.createElement('div', {
                className: 'sliders___klujr snickel-sliders'
            });
            filtersWrapper.appendChild(slidersRoot);
            const template = utils.querySelector('.sliderWrapper___w2TgH', filtersWrapper);
            if (!template) {
                utils.error('Could not find template slider to clone.');
                return false;
            }
            const qualityWrapper = itemMarket.cloneSliderWrapper(template, 'Quality', 0, qualityMax, (min, max) => {
                state.filters.qualityMin = min;
                state.filters.qualityMax = max;
                filters.apply();
            });
            const qualityMinInput = utils.querySelector('input.sliderMin___B8QGA', qualityWrapper);
            const qualityMaxInput = utils.querySelector('input.sliderMax___J3vAy', qualityWrapper);
            if (qualityMinInput && qualityMaxInput) {
                qualityMinInput.value = state.filters.qualityMin;
                qualityMaxInput.value = state.filters.qualityMax;
                qualityMinInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            let bonusMin = 0, bonusMax = 100, bonusLabel = 'Bonus (Relative)';
            if (state.gameFilter.isAbsoluteScaling) {
                const bonusName = state.gameFilter.absoluteBonusName;
                let bonusInfo = BONUS_INFO_BY_NAME[bonusName];
                if (!bonusInfo) {
                    if (state.gameFilter.specificPieceType && state.gameFilter.specificSetName) {
                        const setData = ARMOR_BONUS_RANGES[state.gameFilter.specificSetName];
                        if (setData) {
                            for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                                if (bonusType === 'uniformRange') continue;
                                if (bonusType === bonusName && pieceRanges[state.gameFilter.specificPieceType]) {
                                    const pieceRange = pieceRanges[state.gameFilter.specificPieceType];
                                    bonusInfo = { min: pieceRange.min, max: pieceRange.max };
                                    break;
                                }
                            }
                        }
                    }
                    if (!bonusInfo) {
                        for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                            for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                                if (bonusType === 'uniformRange') continue;
                                if (bonusType === bonusName) {
                                    if (setData.uniformRange) {
                                        const firstPiece = Object.values(pieceRanges)[0];
                                        bonusInfo = { min: firstPiece.min, max: firstPiece.max };
                                    }
                                    break;
                                }
                            }
                            if (bonusInfo) break;
                        }
                    }
                }
                if (bonusInfo) {
                    bonusLabel = 'Bonus (Known Range)';
                    bonusMin = bonusInfo.min;
                    bonusMax = bonusInfo.max;
                    const actualRange = itemMarket.getActualRawBonusRangeFromCache(bonusName);
                    if (actualRange) {
                        bonusMin = Math.min(bonusMin, Math.floor(actualRange.min));
                        bonusMax = Math.max(bonusMax, Math.ceil(actualRange.max));
                    }
                }
            }
            const bonusWrapper = itemMarket.cloneSliderWrapper(template, bonusLabel, bonusMin, bonusMax, (min, max) => {
                state.filters.bonusMin = min;
                state.filters.bonusMax = max;
                filters.apply();
            });
            const bonusMinInput = utils.querySelector('input.sliderMin___B8QGA', bonusWrapper);
            const bonusMaxInput = utils.querySelector('input.sliderMax___J3vAy', bonusWrapper);
            if (bonusMinInput && bonusMaxInput) {
                bonusMinInput.value = state.filters.bonusMin;
                bonusMaxInput.value = state.filters.bonusMax;
                bonusMinInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
            slidersRoot.appendChild(qualityWrapper);
            slidersRoot.appendChild(utils.createElement('div', { className: 'divider___NZcI1' }));
            slidersRoot.appendChild(bonusWrapper);
            state.pages.itemMarket.sliderInsertionAttempts = 0;
            return true;
        },
        injectData: (itemElement, itemData) => {
            const titleElement = utils.querySelector("div > div.title___bQI0h", itemElement);
            if (!titleElement) return;
            const quality = calculations.quality(itemData.itemID, itemData.damage, itemData.accuracy, itemData.armor);
            itemElement.dataset.quality = quality;
            const existingBonuses = utils.querySelector('.snickel-bonuses', itemElement);
            if (existingBonuses) existingBonuses.remove();
            if (USER_SETTINGS.enableBonus) {
                const bonusContainer = utils.createElement('div', {
                    className: 'snickel-bonuses',
                    style: {
                        lineHeight: CONFIG.style.containerLineHeight
                    }
                });
                let maxBonusPct = 0;
                (itemData.bonuses || []).forEach(bonus => {
                    const bonusPercent = calculations.extractBonusPercent(bonus, itemData);
                    if (bonusPercent > maxBonusPct) maxBonusPct = bonusPercent;
                    bonusContainer.appendChild(elements.createBonusElement(bonus, bonusPercent, itemData));
                });
                if (itemData.bonuses && itemData.bonuses.length > 0) {
                    itemElement.dataset.bonusPercent = maxBonusPct;
                }
                if (bonusContainer.children.length > 0) {
                    titleElement.appendChild(bonusContainer);
                }
            } else {
                let maxBonusPct = 0;
                (itemData.bonuses || []).forEach(bonus => {
                    const bonusPercent = calculations.extractBonusPercent(bonus, itemData);
                    if (bonusPercent > maxBonusPct) maxBonusPct = bonusPercent;
                });
                if (itemData.bonuses && itemData.bonuses.length > 0) {
                    itemElement.dataset.bonusPercent = maxBonusPct;
                }
            }
            const imageWrapper = utils.querySelector('.imageWrapper___RqvUg', itemElement);
            elements.injectQualityBox(imageWrapper, quality);
            utils.markProcessed(itemElement);
        },
        processItems: async () => {
            if (!hasValidCategory()) {
                return;
            }
            let needsReinit = state.hashChanged;
            if (state.hashChanged) {
                state.hashChanged = false;
            }
            const newCategory = itemMarket.detectCategory();
            if (newCategory !== state.pages.itemMarket.currentCategory) {
                needsReinit = true;
            }
            const hashInfo = utils.parseHash();
            const newSelectedBonusId = (hashInfo.bonusIds.length === 1 && BONUS_INFO[hashInfo.bonusIds[0]]) ? hashInfo.bonusIds[0] : null;
            let newSelectedBonusName = newSelectedBonusId ? BONUS_INFO[newSelectedBonusId].name : null;
            const armourySetName = ARMORY_SET_MAP[hashInfo.armourySet];
            if (!newSelectedBonusName && armourySetName && ARMOR_BONUS_RANGES[armourySetName]) {
                const setData = ARMOR_BONUS_RANGES[armourySetName];
                for (const [bonusName, pieceRanges] of Object.entries(setData)) {
                    if (bonusName !== 'uniformRange') {
                        newSelectedBonusName = bonusName;
                        break;
                    }
                }
            }
            state.gameFilter.specificPieceType = null;
            state.gameFilter.specificSetName = null;
            if (!newSelectedBonusName && hashInfo.itemName && hashInfo.category === 'Defensive') {
                const itemNameLower = hashInfo.itemName.toLowerCase();
                for (const [setName, setData] of Object.entries(ARMOR_BONUS_RANGES)) {
                    for (const [bonusType, pieceRanges] of Object.entries(setData)) {
                        if (bonusType === 'uniformRange') continue;
                        for (const pieceType of Object.keys(pieceRanges)) {
                            const setKeywords = setName.toLowerCase().split(' ');
                            const pieceKeywords = pieceType.toLowerCase().split(' ');
                            const setMatches = setKeywords.some(keyword => itemNameLower.includes(keyword));
                            const pieceMatches = pieceKeywords.every(keyword => itemNameLower.includes(keyword));
                            if (setMatches && pieceMatches) {
                                newSelectedBonusName = bonusType;
                                state.gameFilter.specificPieceType = pieceType;
                                state.gameFilter.specificSetName = setName;
                                break;
                            }
                        }
                        if (newSelectedBonusName) break;
                    }
                    if (newSelectedBonusName) break;
                }
            }
            let shouldUseAbsoluteScaling = false;
            if (newSelectedBonusName) {
                const isIndividualItem = hashInfo.itemName && hashInfo.category === 'Defensive';
                const isSetFilter = hashInfo.armourySet && ARMORY_SET_MAP[hashInfo.armourySet];
                if (isIndividualItem) {
                    shouldUseAbsoluteScaling = true;
                } else if (isSetFilter) {
                    const setName = ARMORY_SET_MAP[hashInfo.armourySet];
                    const setData = ARMOR_BONUS_RANGES[setName];
                    shouldUseAbsoluteScaling = setData && setData.uniformRange;
                } else if (hashInfo.bonusIds.length === 1) {
                    shouldUseAbsoluteScaling = true;
                }
            }
            if (newSelectedBonusName !== state.gameFilter.selectedBonus || shouldUseAbsoluteScaling !== state.gameFilter.isAbsoluteScaling) {
                needsReinit = true;
            }
            if (needsReinit) {
                const allItems = utils.querySelectorAll('#item-market-root li');
                allItems.forEach(li => { li.style.display = ''; });
                state.pages.itemMarket.sliderInsertionAttempts = 0;
                state.pages.itemMarket.currentCategory = newCategory;
                state.gameFilter.selectedBonus = newSelectedBonusName;
                state.gameFilter.isAbsoluteScaling = shouldUseAbsoluteScaling;
                state.gameFilter.absoluteBonusName = newSelectedBonusName;
                if (!shouldUseAbsoluteScaling || !newSelectedBonusName) {
                    state.gameFilter.specificPieceType = null;
                    state.gameFilter.specificSetName = null;
                }
                const existingSliders = utils.querySelector('.snickel-sliders');
                if (existingSliders) {
                    existingSliders.remove();
                }
                if (USER_SETTINGS.enableFilter) {
                    itemMarket.insertCustomSliders();
                }
            } else if (!utils.querySelector('.snickel-sliders') && USER_SETTINGS.enableFilter) {
                itemMarket.insertCustomSliders();
            }
            let itemTileElements = utils.querySelectorAll('.itemTile___cbw7w');
            const fetchDataList = state.pages.itemMarket.fetchResponseCache;
            if (itemTileElements.length === 0) {
                if (fetchDataList.length > 0) {
                    setTimeout(() => {
                        itemMarket.processItems();
                    }, 25);
                    return;
                }
            }
            if (!fetchDataList.length) {
                return;
            }
            const unprocessedItems = itemTileElements.filter(item => !utils.isProcessed(item));
            if (fetchDataList.length > itemTileElements.length && unprocessedItems.length === 0) {
                if (!state.pages.itemMarket.backgroundMonitor) {
                    itemMarket.startBackgroundMonitor();
                }
            }
            const category = itemMarket.detectCategory();
            let processedCount = 0;
            itemTileElements.forEach((itemElement) => {
                if (utils.isProcessed(itemElement)) return;
                const price = parseInt(utils.querySelector('.priceAndTotal___eEVS7 span', itemElement)?.textContent.replace(/[^\d]/g, ''), 10);
                const damageVal = parseFloat(utils.querySelector('.properties___QCPEP .property___SHm8e:nth-of-type(1) .value___cwqHv', itemElement)?.textContent.trim());
                const accuracyVal = parseFloat(utils.querySelector('.properties___QCPEP .property___SHm8e:nth-of-type(2) .value___cwqHv', itemElement)?.textContent.trim());
                const armorVal = parseFloat(utils.querySelector('.properties___QCPEP .property___SHm8e:nth-of-type(1) .value___cwqHv', itemElement)?.textContent.trim());
                const fetchData = fetchDataList.find(data => {
                    if (category === "Armor") {
                        return data.minPrice === price && data.armor === armorVal;
                    } else {
                        return data.minPrice === price && data.damage === damageVal && data.accuracy === accuracyVal;
                    }
                });
                if (fetchData) {
                    itemMarket.injectData(itemElement, fetchData);
                    processedCount++;
                }
            });
            if (processedCount > 0 || needsReinit) {
                filters.apply();
            }
        },
        waitForItemsAndProcess: () => {
            const checkInterval = CONFIG.timeouts.checkInterval;
            const timeout = CONFIG.timeouts.itemCheck;
            let elapsedTime = 0;
            const intervalId = setInterval(() => {
                const itemTiles = utils.querySelectorAll('.itemTile___cbw7w');
                const fetchDataList = state.pages.itemMarket.fetchResponseCache;
                if (fetchDataList.length > 0 && itemTiles.length > 0) {
                    clearInterval(intervalId);
                    itemMarket.processItems();
                } else {
                    elapsedTime += checkInterval;
                    if (elapsedTime >= timeout) {
                        clearInterval(intervalId);
                        utils.warn(`Timed out waiting for items to appear. Fetch data: ${fetchDataList.length}, Item tiles: ${itemTiles.length}`);
                    }
                }
            }, checkInterval);
        },
        waitForItemsWithRetry: () => {
            const maxRetries = 20;
            const retryDelay = 50;
            let retryCount = 0;
            const attemptProcessing = () => {
                if (!hasValidCategory()) {
                    return;
                }
                const itemTiles = utils.querySelectorAll('.itemTile___cbw7w');
                const fetchDataList = state.pages.itemMarket.fetchResponseCache;
                if (fetchDataList.length > 0 && itemTiles.length > 0) {
                    itemMarket.processItems();
                } else if (retryCount < maxRetries) {
                    retryCount++;
                    let delay;
                    if (retryCount <= 5) delay = retryDelay;
                    else if (retryCount <= 10) delay = 100;
                    else if (retryCount <= 15) delay = 200;
                    else delay = 300;
                    setTimeout(attemptProcessing, delay);
                }
            };
            attemptProcessing();
        },
        startBackgroundMonitor: () => {
            if (state.pages.itemMarket.backgroundMonitor) {
                clearInterval(state.pages.itemMarket.backgroundMonitor);
            }
            let checkCount = 0;
            const maxChecks = 30;
            const checkInterval = 50;
            state.pages.itemMarket.backgroundMonitor = setInterval(() => {
                checkCount++;
                if (!hasValidCategory()) {
                    clearInterval(state.pages.itemMarket.backgroundMonitor);
                    state.pages.itemMarket.backgroundMonitor = null;
                    return;
                }
                const unprocessedItems = utils.querySelectorAll('.itemTile___cbw7w').filter(item =>
                    !utils.isProcessed(item)
                );
                if (unprocessedItems.length > 0 && state.pages.itemMarket.fetchResponseCache.length > 0) {
                    itemMarket.processItems();
                }
                if (checkCount >= maxChecks || state.pages.itemMarket.fetchResponseCache.length === 0) {
                    clearInterval(state.pages.itemMarket.backgroundMonitor);
                    state.pages.itemMarket.backgroundMonitor = null;
                }
            }, checkInterval);
        },
        setupScrollMonitor: () => {
            const scrollContainer = document.getElementById('item-market-root') || document;
            let scrollTimeout;
            const debouncedScrollHandler = () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (!hasValidCategory()) {
                        return;
                    }
                    const unprocessedItems = utils.querySelectorAll('.itemTile___cbw7w').filter(item =>
                        !utils.isProcessed(item)
                    );
                    if (unprocessedItems.length > 0 && state.pages.itemMarket.fetchResponseCache.length > 0) {
                        itemMarket.processItems();
                    }
                }, 50);
            };
            scrollContainer.addEventListener('scroll', debouncedScrollHandler, { passive: true });
            window.addEventListener('scroll', debouncedScrollHandler, { passive: true });
            cleanup.addListener(scrollContainer, 'scroll', debouncedScrollHandler);
            cleanup.addListener(window, 'scroll', debouncedScrollHandler);
        },
        setupDOMObserver: () => {
            const itemMarketRoot = document.getElementById('item-market-root');
            if (!itemMarketRoot) {
                return;
            }
            let processingTimeout = null;
            const observer = new MutationObserver((mutations) => {
                let hasNewItems = false;
                for (const mutation of mutations) {
                    if (mutation.type !== 'childList') continue;
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== Node.ELEMENT_NODE) continue;
                        const isItemTile = node.classList && node.classList.contains('itemTile___cbw7w');
                        const hasItemTiles = utils.querySelectorAll('.itemTile___cbw7w', node).length > 0;
                        if (isItemTile || hasItemTiles) {
                            hasNewItems = true;
                        }
                    }
                }
                if (hasNewItems && state.pages.itemMarket.fetchResponseCache.length > 0) {
                    if (processingTimeout) clearTimeout(processingTimeout);
                    if (hasValidCategory()) {
                        processingTimeout = setTimeout(() => itemMarket.processItems(), 10);
                    }
                }
            });
            observer.observe(itemMarketRoot, {
                childList: true,
                subtree: true
            });
            cleanup.addObserver(observer);
        },
        runInitialization: () => {
            if (state.pages.itemMarket.isInitialized) {
                return;
            }
            if (USER_SETTINGS.enableFilter) {
                try {
                    itemMarket.insertCustomSliders();
                } catch (e) {
                    utils.error('Error inserting custom sliders:', e);
                }
            }
            if (state.pages.itemMarket.fetchResponseCache.length > 0) {
                const itemTiles = utils.querySelectorAll('.itemTile___cbw7w');
                if (itemTiles.length > 0) {
                    itemMarket.processItems();
                } else {
                    itemMarket.waitForItemsWithRetry();
                }
            }
            state.pages.itemMarket.sockets.forEach(ws => {
                ws.addEventListener('message', itemMarket.handleWebSocket);
            });
            try {
                itemMarket.setupScrollMonitor();
            } catch (e) {
                utils.error('Error setting up scroll monitor:', e);
            }
            try {
                itemMarket.setupDOMObserver();
            } catch (e) {
                utils.error('Error setting up DOM observer:', e);
            }
            state.pages.itemMarket.isInitialized = true;
        },
        init: async () => {
            try {
                theme.setupObserver();
            } catch (e) {
                utils.error('Error setting up theme observer:', e);
            }
            try {
                const templateSlider = await utils.waitForElement('.filtersWrapper___pZ6sQ .sliderWrapper___w2TgH');
                if (templateSlider) {
                    itemMarket.runInitialization();
                } else {
                    utils.error('Timed out waiting for filter UI to appear.');
                }
            } catch (e) {
                utils.error('Error in waitForElement or runInitialization:', e);
            }
        }
    };
    const auctionHouse = {
        injectData: (itemElement) => {
            if (utils.isProcessed(itemElement)) return;
            const hoverSpan = utils.querySelector('.item-hover', itemElement);
            const itemID = hoverSpan ? hoverSpan.getAttribute('item') : null;
            if (!itemID) return;
            const itemNameElement = utils.querySelector('.item-name', itemElement);
            const itemName = itemNameElement ? itemNameElement.textContent.trim() : '';
            let damage = 0, accuracy = 0, armor = 0;
            utils.querySelectorAll('.infobonuses span.bonus-attachment', itemElement).forEach(span => {
                const iconCls = utils.querySelector('i', span)?.className || '';
                const value = parseFloat(utils.querySelector('.label-value', span)?.textContent) || 0;
                if (iconCls.includes('damage')) damage = value;
                else if (iconCls.includes('accuracy')) accuracy = value;
                else if (iconCls.includes('defence')) armor = value;
            });
            if (damage === 0 && accuracy === 0 && armor === 0) return;
            const quality = calculations.quality(itemID, damage, accuracy, armor);
            const titleElement = utils.querySelector('.title', itemElement);
            if (!titleElement) return;
            const imgWrap = utils.querySelector('.img-wrap', itemElement);
            elements.injectQualityBox(imgWrap, quality);
            const existingBonuses = utils.querySelector('.snickel-bonuses', titleElement);
            if (existingBonuses) existingBonuses.remove();
            if (USER_SETTINGS.enableBonus) {
                const bonusContainer = utils.createElement('div', {
                    className: 'snickel-bonuses',
                    style: {
                        lineHeight: CONFIG.style.containerLineHeight
                    }
                });
                let maxBonusPct = 0;
                utils.querySelectorAll('.iconsbonuses .bonus-attachment-icons', itemElement).forEach(iconSpan => {
                    const raw = iconSpan.getAttribute('title');
                    if (!raw) return;
                    const tmp = utils.createElement('div');
                    tmp.innerHTML = raw;
                    const title = utils.querySelector('b', tmp)?.textContent || '';
                    const description = tmp.textContent.replace(title, '').trim();
                    const itemData = { itemName, type: armor > 0 ? 'Defensive' : 'Offensive' };
                    const bonus = { title, description };
                    const bonusPercent = calculations.extractBonusPercent(bonus, itemData);
                    if (bonusPercent > maxBonusPct) maxBonusPct = bonusPercent;
                    if (title) bonusContainer.appendChild(elements.createBonusElement(bonus, bonusPercent, itemData));
                });
                if (bonusContainer.children.length > 0) {
                    titleElement.appendChild(bonusContainer);
                }
                const rarityLine = utils.querySelector('p.t-gray-6', titleElement);
                if (rarityLine) rarityLine.style.display = 'none';
            }
            utils.markProcessed(itemElement);
        },
        processItems: () => {
            const visibleTab = utils.querySelector('#auction-house-tabs .tabContent:not([style*="display: none"])');
            if (!visibleTab) return;
            const listItems = utils.querySelectorAll('ul.items-list li', visibleTab);
            listItems.forEach(li => {
                if (!utils.isProcessed(li)) {
                    auctionHouse.injectData(li);
                }
            });
        },
        init: () => {
            const auctionHouseRoot = document.getElementById('auction-house-tabs');
            if (!auctionHouseRoot) {
                utils.error('Auction House root not found');
                return;
            }
            auctionHouse.processItems();
            const observer = new MutationObserver(auctionHouse.processItems);
            observer.observe(auctionHouseRoot, { childList: true, subtree: true });
            cleanup.addObserver(observer);
        }
    };
    const bazaar = {
        injectData: (tileElement) => {
            if (utils.isProcessed(tileElement)) return;
            const imgElement = utils.querySelector('.imgContainer___Ec4I5 img', tileElement);
            if (!imgElement) return;
            const idMatch = imgElement.src.match(/\/images\/items\/(\d+)\//);
            if (!idMatch) return;
            const itemID = idMatch[1];
            if (!BASE_STATS_MAP[itemID]) return;
            const itemNameElement = utils.querySelector('.name___B0RW3', tileElement);
            const itemName = itemNameElement ? itemNameElement.textContent.trim() : '';
            let damage = 0, accuracy = 0, armor = 0;
            utils.querySelectorAll('.infoBonuses___g8QdG .container___Go0NJ', tileElement).forEach(c => {
                const iconCls = utils.querySelector('i', c)?.className || '';
                const val = parseFloat(utils.querySelector('span', c)?.textContent) || 0;
                if (iconCls.includes('damage')) damage = val;
                else if (iconCls.includes('accuracy')) accuracy = val;
                else if (iconCls.includes('defence')) armor = val;
            });
            if (damage === 0 && accuracy === 0 && armor === 0) return;
            const quality = calculations.quality(itemID, damage, accuracy, armor);
            const descElement = utils.querySelector('.description___Y2Nrl', tileElement);
            if (!descElement) return;
            const existingBonuses = utils.querySelector('.snickel-bonuses', descElement);
            if (existingBonuses) existingBonuses.remove();
            if (USER_SETTINGS.enableBonus) {
                const stockElement = utils.querySelector('.amount___K8sOQ', descElement);
                if (stockElement) stockElement.style.display = 'none';
                const bonusContainer = utils.createElement('div', {
                    className: 'snickel-bonuses',
                    style: {
                        lineHeight: CONFIG.style.containerLineHeight
                    }
                });
                const bonusIcons = utils.querySelectorAll('.iconBonuses____iFjZ i', tileElement);
                if (bonusIcons.length > 0) {
                    let maxBonusPct = 0;
                    bonusIcons.forEach(icon => {
                        const title = icon.getAttribute('data-bonus-attachment-title') || icon.title || '';
                        const description = icon.getAttribute('data-bonus-attachment-description') || '';
                        const itemData = { itemName, type: armor > 0 ? 'Defensive' : 'Offensive' };
                        const bonus = { title, description };
                        const bonusPercent = calculations.extractBonusPercent(bonus, itemData);
                        if (bonusPercent > maxBonusPct) maxBonusPct = bonusPercent;
                        if (title) bonusContainer.appendChild(elements.createBonusElement(bonus, bonusPercent, itemData));
                    });
                    if (bonusContainer.children.length > 0) {
                        descElement.insertBefore(bonusContainer, stockElement || null);
                    }
                }
            }
            const imgBar = utils.querySelector('.imgBar___Dbu1b', tileElement);
            elements.injectQualityBox(imgBar, quality);
            utils.markProcessed(tileElement);
        },
        processItems: () => {
            const bazaarTileElements = utils.querySelectorAll('.item___GYCYJ.item___khvF6');
            bazaarTileElements.forEach(tileElement => {
                if (!utils.isProcessed(tileElement)) {
                    bazaar.injectData(tileElement);
                }
            });
        },
        setupLayoutShiftFix: () => {
            const bazaarRoot = document.getElementById('bazaarRoot');
            if (!bazaarRoot) return;
            let lastKnownTop = null;
            let isMonitoring = false;
            const checkForLayoutShift = () => {
                const virtualizedGrid = utils.querySelector('.ReactVirtualized__Grid', bazaarRoot);
                if (!virtualizedGrid) return;
                const rect = virtualizedGrid.getBoundingClientRect();
                const currentTop = rect.top + window.scrollY;
                if (lastKnownTop === null) {
                    lastKnownTop = currentTop;
                    return;
                }
                const shift = Math.abs(currentTop - lastKnownTop);
                if (shift > 50) {
                    window.dispatchEvent(new Event('resize'));
                    lastKnownTop = currentTop;
                }
            };
            if (window.ResizeObserver) {
                const resizeObserver = new ResizeObserver(() => {
                    if (isMonitoring) {
                        setTimeout(checkForLayoutShift, 100);
                    }
                });
                resizeObserver.observe(document.body);
                cleanup.addObserver(resizeObserver);
            }
            const layoutObserver = new MutationObserver((mutations) => {
                if (!isMonitoring) return;
                const hasLayoutChanges = mutations.some(mutation => {
                    if (mutation.addedNodes.length > 0) {
                        for (const node of mutation.addedNodes) {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                if (node.tagName === 'IMG' ||
                                    node.querySelector && node.querySelector('img')) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                });
                if (hasLayoutChanges) {
                    setTimeout(checkForLayoutShift, 500);
                }
            });
            layoutObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
            cleanup.addObserver(layoutObserver);
            setTimeout(() => {
                isMonitoring = true;
                checkForLayoutShift();
            }, 1000);
            const resizeHandler = utils.debounce(() => {
                if (isMonitoring) {
                    setTimeout(checkForLayoutShift, 100);
                }
            }, 250);
            cleanup.addListener(window, 'resize', resizeHandler);
        },
        init: () => {
            const bazaarRoot = document.getElementById('bazaarRoot');
            if (!bazaarRoot) {
                utils.error('Bazaar root not found');
                return;
            }
            bazaar.setupLayoutShiftFix();
            const observer = new MutationObserver((mutations, obs) => {
                const itemsContainer = utils.querySelector('div[class*="itemsContainner"]', bazaarRoot);
                if (!itemsContainer) return;
                const itemObserver = new MutationObserver(() => {
                    bazaar.processItems();
                });
                itemObserver.observe(itemsContainer, { childList: true, subtree: true });
                cleanup.addObserver(itemObserver);
                bazaar.processItems();
                obs.disconnect();
            });
            observer.observe(bazaarRoot, { childList: true, subtree: true });
            cleanup.addObserver(observer);
        }
    };
    const cleanup = {
        observers: [],
        timeouts: [],
        listeners: [],
        addObserver: (observer) => {
            cleanup.observers.push(observer);
        },
        addTimeout: (timeout) => {
            cleanup.timeouts.push(timeout);
        },
        addListener: (element, event, handler) => {
            element.addEventListener(event, handler);
            cleanup.listeners.push({ element, event, handler });
        },
        disconnectAll: () => {
            cleanup.observers.forEach(observer => {
                if (observer && typeof observer.disconnect === 'function') {
                    observer.disconnect();
                }
            });
            cleanup.observers = [];
            cleanup.timeouts.forEach(timeout => {
                if (timeout) clearTimeout(timeout);
            });
            cleanup.timeouts = [];
            cleanup.listeners.forEach(({ element, event, handler }) => {
                if (element && typeof element.removeEventListener === 'function') {
                    element.removeEventListener(event, handler);
                }
            });
            cleanup.listeners = [];
            if (state.pages.itemMarket.backgroundMonitor) {
                clearInterval(state.pages.itemMarket.backgroundMonitor);
                state.pages.itemMarket.backgroundMonitor = null;
            }
            state.processedElements = new WeakSet();
            state.pages.itemMarket.fetchResponseCache = [];
            state.pages.itemMarket.sockets = [];
            state.pages.itemMarket.isInitialized = false;
        }
    };
    window.addEventListener('beforeunload', cleanup.disconnectAll);
    window.addEventListener('pagehide', cleanup.disconnectAll);
    const settingsMenu = {
        isExpanded: false,
        pendingSettings: null,
        menuObserver: null,
        addMenuItem: () => {
            const menu = utils.querySelector('li.avatar ul');
            if (!menu || utils.querySelector('.snickel-settings-button')) return;
            const li = utils.createElement('li', {
                className: 'link snickel-settings-button'
            });
            const a = utils.createElement('a', {
                href: '#'
            });
            const iconDiv = utils.createElement('div', {
                className: 'icon-wrapper'
            });
            const arrowSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            arrowSvg.setAttribute('class', 'default arrow-icon');
            arrowSvg.setAttribute('fill', '#fff');
            arrowSvg.setAttribute('width', '12');
            arrowSvg.setAttribute('height', '12');
            arrowSvg.setAttribute('viewBox', '0 0 12 12');
            const arrowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            arrowPath.setAttribute('d', 'M4 2L8 6L4 10');
            arrowSvg.appendChild(arrowPath);
            iconDiv.appendChild(arrowSvg);
            const span = utils.createElement('span', {
                textContent: 'Snickelmarket'
            });
            a.appendChild(iconDiv);
            a.appendChild(span);
            li.appendChild(a);
            const submenu = settingsMenu.createSubmenu();
            li.appendChild(submenu);
            a.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                settingsMenu.toggleSubmenu();
            });
            const logoutButton = utils.querySelector('li.logout', menu);
            if (logoutButton) {
                menu.insertBefore(li, logoutButton);
            } else {
                menu.appendChild(li);
            }
        },
        createSubmenu: () => {
            const submenu = utils.createElement('ul', {
                className: 'snickel-submenu'
            });
            const settings = [
                { key: 'enableItemMarket', label: 'Item Market' },
                { key: 'enableAuctionHouse', label: 'Auction House' },
                { key: 'enableBazaar', label: 'Bazaar' },
                { key: 'enableQuality', label: 'Quality' },
                { key: 'enableBonus', label: 'Bonus' },
                { key: 'enableFilter', label: 'Filter' },
                { key: 'enableColourTiers', label: 'Colour Tiers' }
            ];
            settings.forEach(setting => {
                const li = settingsMenu.createSettingItem(setting);
                submenu.appendChild(li);
            });
            const refreshLi = settingsMenu.createRefreshButton();
            submenu.appendChild(refreshLi);
            return submenu;
        },
        createSettingItem: (setting) => {
            const li = utils.createElement('li', {
                className: 'setting'
            });
            const label = utils.createElement('label', {
                className: 'setting-container'
            });
            const nameSpan = utils.createElement('span', {
                className: 'setting-name',
                textContent: setting.label
            });
            const choiceContainer = utils.createElement('div', {
                className: 'choice-container'
            });
            const checkbox = utils.createElement('input', {
                type: 'checkbox',
                className: 'checkbox-css dark-bg',
                id: `snickel-${setting.key}`,
                checked: USER_SETTINGS[setting.key]
            });
            const checkboxLabel = utils.createElement('label', {
                className: 'marker-css',
                htmlFor: `snickel-${setting.key}`
            });
            checkbox.addEventListener('change', () => {
                settingsMenu.handleSettingChange(setting.key, checkbox.checked);
            });
            choiceContainer.appendChild(checkbox);
            choiceContainer.appendChild(checkboxLabel);
            label.appendChild(nameSpan);
            label.appendChild(choiceContainer);
            li.appendChild(label);
            return li;
        },
        createRefreshButton: () => {
            const li = utils.createElement('li', {
                className: 'snickel-refresh-button',
                style: { display: 'none' }
            });
            const button = utils.createElement('button', {
                className: 'setting-container',
                textContent: 'Refresh to Apply Changes',
                style: {
                    width: '100%',
                    padding: '8px 16px',
                    backgroundColor: 'var(--default-bg-panel-active-color)',
                    border: '1px solid var(--default-panel-divider-outer-side-color)',
                    borderRadius: '4px',
                    color: 'var(--default-color)',
                    cursor: 'pointer',
                    fontSize: '12px',
                    textAlign: 'center'
                }
            });
            button.addEventListener('mouseenter', () => {
                button.style.backgroundColor = 'var(--default-bg-panel-hover-color)';
            });
            button.addEventListener('mouseleave', () => {
                button.style.backgroundColor = 'var(--default-bg-panel-active-color)';
            });
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                settingsMenu.applyPendingSettings();
            });
            li.appendChild(button);
            return li;
        },
        toggleSubmenu: () => {
            const button = utils.querySelector('.snickel-settings-button');
            const submenu = utils.querySelector('.snickel-submenu');
            if (!button || !submenu) return;
            settingsMenu.isExpanded = !settingsMenu.isExpanded;
            if (settingsMenu.isExpanded) {
                button.classList.add('expanded');
                submenu.classList.add('active');
            } else {
                button.classList.remove('expanded');
                submenu.classList.remove('active');
            }
        },
        showRefreshButton: () => {
            const refreshButton = utils.querySelector('.snickel-refresh-button');
            if (refreshButton) {
                refreshButton.style.display = '';
            }
        },
        hideRefreshButton: () => {
            const refreshButton = utils.querySelector('.snickel-refresh-button');
            if (refreshButton) {
                refreshButton.style.display = 'none';
            }
        },
        handleSettingChange: (key, value) => {
            if (!settingsMenu.pendingSettings) {
                settingsMenu.pendingSettings = { ...USER_SETTINGS };
            }
            settingsMenu.pendingSettings[key] = value;
            settingsMenu.showRefreshButton();
        },
        applyPendingSettings: () => {
            if (!settingsMenu.pendingSettings) return;
            const hasChanges = Object.keys(settingsMenu.pendingSettings).some(
                key => settingsMenu.pendingSettings[key] !== USER_SETTINGS[key]
            );
            if (hasChanges) {
                saveUserSettings(settingsMenu.pendingSettings);
            }
            settingsMenu.pendingSettings = null;
            settingsMenu.hideRefreshButton();
        },
        setupMenuObserver: () => {
            let checkInterval;
            const checkForAvatar = () => {
                const avatarLi = utils.querySelector('li.avatar');
                if (!avatarLi) return;
                clearInterval(checkInterval);
                settingsMenu.menuObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                            const isActive = avatarLi.classList.contains('active');
                            if (isActive) {
                                setTimeout(() => {
                                    settingsMenu.addMenuItem();
                                    if (!settingsMenu.pendingSettings) {
                                        settingsMenu.hideRefreshButton();
                                    }
                                }, 50);
                            } else {
                                settingsMenu.applyPendingSettings();
                                settingsMenu.isExpanded = false;
                            }
                        }
                    });
                });
                settingsMenu.menuObserver.observe(avatarLi, {
                    attributes: true,
                    attributeFilter: ['class']
                });
                cleanup.addObserver(settingsMenu.menuObserver);
            };
            checkInterval = setInterval(checkForAvatar, 100);
        },
        init: () => {
            settingsMenu.setupMenuObserver();
        }
    };
    function hasValidCategory() {
        const validCategories = ['Melee', 'Primary', 'Secondary', 'Defensive'];
        const hash = window.location.hash;
        let urlParams;
        if (hash.includes('view=search&')) {
            const searchIndex = hash.indexOf('view=search&');
            const paramString = hash.substring(searchIndex + 'view=search&'.length);
            urlParams = new URLSearchParams(paramString);
        } else {
            urlParams = new URLSearchParams(hash.replace(/^.*\?/, ''));
        }
        const categoryName = urlParams.get('categoryName');
        const itemType = urlParams.get('itemType');
        const itemID = urlParams.get('itemID');
        return validCategories.includes(categoryName) ||
               validCategories.includes(itemType) ||
               (itemID && itemID.trim() !== '');
    }
    function interceptRequests() {
        const nativeFetch = window.fetch;
        window.fetch = async function (url, options) {
            const response = await nativeFetch(url, options);
            if (typeof url !== 'string') {
                return response;
            }
            if (!url.includes('sid=iMarket')) {
                return response;
            }
            if (!hasValidCategory()) {
                return response;
            }
            const clone = response.clone();
            clone.json().then(data => {
                if (!data.items || data.items.length === 0) {
                    return;
                }
                const existingCache = state.pages.itemMarket.fetchResponseCache;
                const newItems = data.items.filter(newItem => {
                    return !existingCache.some(existing =>
                        existing.listingID === newItem.listingID ||
                        (existing.minPrice === newItem.minPrice &&
                         existing.damage === newItem.damage &&
                         existing.accuracy === newItem.accuracy &&
                         existing.armor === newItem.armor)
                    );
                });
                state.pages.itemMarket.fetchResponseCache = [...existingCache, ...newItems];
                itemMarket.waitForItemsWithRetry();
                itemMarket.startBackgroundMonitor();
            }).catch(err => {
                utils.error(`Error parsing intercepted response for ${url}:`, err);
            });
            return response;
        };
    }
    function interceptWebSocket() {
        const nativeWebSocket = window.WebSocket;
        window.WebSocket = function (...args) {
            const socket = new nativeWebSocket(...args);
            state.pages.itemMarket.sockets.push(socket);
            if (location.href.includes('sid=ItemMarket')) {
                socket.addEventListener('message', itemMarket.handleWebSocket);
            }
            return socket;
        };
    }
    function init() {
        utils.injectGlobalStyle(STYLE_OVERRIDES, 'snickel-style-overrides');
        settingsMenu.init();
        interceptRequests();
        interceptWebSocket();
        document.addEventListener("DOMContentLoaded", () => {
            const href = window.location.href;
            let pageEnabled = false;
            let pageType = null;
            if (href.includes('sid=ItemMarket')) {
                pageEnabled = USER_SETTINGS.enableItemMarket;
                pageType = 'itemMarket';
            } else if (href.includes('amarket.php')) {
                pageEnabled = USER_SETTINGS.enableAuctionHouse;
                pageType = 'auctionHouse';
            } else if (href.includes('bazaar.php')) {
                pageEnabled = USER_SETTINGS.enableBazaar;
                pageType = 'bazaar';
            }
            if (!pageEnabled) {
                utils.log('Script disabled for current page');
                return;
            }
            theme.updateColors();
            theme.setupObserver();
            if (pageType === 'itemMarket') {
                utils.log('Initializing Item Market.');
                itemMarket.init();
                utils.addHashListener(() => {
                    state.pages.itemMarket.fetchResponseCache = [];
                    state.processedElements = new WeakSet();
                    state.pages.itemMarket.sliderInsertionAttempts = 0;
                    state.filters.qualityMin = 0;
                    state.filters.qualityMax = 300;
                    state.filters.bonusMin = 0;
                    state.filters.bonusMax = 100;
                    state.hashChanged = true;
                });
            } else if (pageType === 'auctionHouse') {
                utils.log('Initializing Auction House.');
                auctionHouse.init();
            } else if (pageType === 'bazaar') {
                utils.log('Initializing Bazaar.');
                bazaar.init();
            }
        });
    }
    init();
})();