// ==UserScript==
// @name          Ironwood RPG - Bargain Finder
// @namespace     http://tampermonkey.net/
// @version       2.5.9
// @description   Highlights listings, plays sounds, random auto-scan, and auto buys specific items. Includes safety checks and purchase logging.
// @author        idk
// @match         https://ironwoodrpg.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @require       https://code.jquery.com/jquery-3.6.4.min.js
// @grant         GM_addStyle
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_deleteValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/527960/Ironwood%20RPG%20-%20Bargain%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/527960/Ironwood%20RPG%20-%20Bargain%20Finder.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // --- Configuration ---
    const CONFIG = {
        LOGGING_ENABLED: true,
        DEFAULT_SCAN_INTERVAL_MIN_MS: 15000,
        DEFAULT_SCAN_INTERVAL_MAX_MS: 30000,
        DEBOUNCE_DELAY_MS: 500,
        TAB_CHANGE_DELAY_MS: 700,
        SOUND_VOLUME_DEFAULT: 0.5,

        TAB_BUY: "Buy",
        TAB_ORDERS: "Orders",
        TAB_LISTINGS: "Listings",

        LOCAL_STORAGE_KEYS: {
            ENABLED: 'bargain-finder-enabled',
            HIGHLIGHT_ENABLED: 'bargain-finder-highlight',
            AUTOSCAN_ENABLED: 'bargain-finder-autoscan',
            AUTOSCAN_DELAY_MIN: 'bargain-finder-autoscan-delay-min',
            AUTOSCAN_DELAY_MAX: 'bargain-finder-autoscan-delay-max',
            AUTOSCAN_DELAY_LEGACY: 'bargain-finder-autoscan-delay', // Cleanup legacy key
            AUTOCLICK_ENABLED: 'bargain-finder-autoclick',
            AUTOBUY_ENABLED: 'bargain-finder-autobuy',
            SOUND_VOLUME: 'bargain-finder-volume',
            ITEM_DATA: 'bargain-finder-item-data'
        },

        SELECTORS: {
            MARKET_LISTINGS_COMPONENT: 'market-listings-component',
            MARKET_TABS_CONTAINER: 'div.tabs',
            ACTIVE_TAB: '.tab-active',
            MARKET_SEARCH_INPUT: 'input[placeholder="Search listings"]',
            MARKET_SORT_CONTAINER: 'div.sort',
            DATE_SORT_BUTTON: "button:contains('Date')",
            MARKET_LISTINGS_GROUP: 'market-listings-component .group',
            LISTING_ROW: '.row',
            LISTING_NAME: '.name',
            LISTING_AMOUNT: '.amount',
            LISTING_COST: '.cost',
            MENU_BUTTON_MARKET: 'div.scroll.custom-scrollbar div.name:contains("Market")',
            MENU_BUTTON_ANY_OTHER: 'div.scroll.custom-scrollbar div.name:not(:contains("Market"))',
            // Auto Buy Selectors
            PURCHASE_MAX_BUTTON: 'button.action.max',
            PURCHASE_BUY_BUTTON: 'button.action:contains("Buy")',
        },

        DEFAULT_ITEM_DATA: [
            { name: "Pine Log", buyAt: 12, sellAt: 70, autoBuy: true },{ name: "Spruce Log", buyAt: 12, sellAt: 70, autoBuy: true },{ name: "Birch Log", buyAt: 22, sellAt: 70, autoBuy: true },{ name: "Teak Log", buyAt: 38, sellAt: 80, autoBuy: true },{ name: "Mahogany Log", buyAt: 42, sellAt: 90, autoBuy: true },{ name: "Ironbark Log", buyAt: 52, sellAt: 100, autoBuy: true },{ name: "Redwood Log", buyAt: 60, sellAt: 110, autoBuy: true },{ name: "Ancient Log", buyAt: 63, sellAt: 120, autoBuy: true },{ name: "Copper Ore", buyAt: null, sellAt: 100, autoBuy: false },{ name: "Iron Ore", buyAt: null, sellAt: 100, autoBuy: false },{ name: "Silver Ore", buyAt: null, sellAt: 100, autoBuy: false },{ name: "Gold Ore", buyAt: 22, sellAt: 100, autoBuy: true },{ name: "Cobalt Ore", buyAt: 28, sellAt: 100, autoBuy: true },{ name: "Obsidian Ore", buyAt: 45, sellAt: 100, autoBuy: true },{ name: "Astral Ore", buyAt: 50, sellAt: 120, autoBuy: true },{ name: "Infernal Ore", buyAt: 60, sellAt: 120, autoBuy: true },{ name: "Copper Bar", buyAt: null, sellAt: 100, autoBuy: false },{ name: "Iron Bar", buyAt: null, sellAt: 100, autoBuy: false },{ name: "Silver Bar", buyAt: null, sellAt: 120, autoBuy: false },{ name: "Gold Bar", buyAt: 90, sellAt: 220, autoBuy: true },{ name: "Cobalt Bar", buyAt: 110, sellAt: 220, autoBuy: true },{ name: "Obsidian Bar", buyAt: 120, sellAt: 220, autoBuy: true },{ name: "Astral Bar", buyAt: 180, sellAt: 270, autoBuy: true },{ name: "Infernal Bar", buyAt: 210, sellAt: 300, autoBuy: true },{ name: "Copper Sword", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Hammer", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Spear", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Scythe", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Bow", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Boomerang", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Rod", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Spade", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Hatchet", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Pickaxe", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Compass", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Boots", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Gloves", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Helmet", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Shield", buyAt: 42, sellAt: 500, autoBuy: true },{ name: "Copper Body", buyAt: 63, sellAt: 500, autoBuy: true },{ name: "Iron Sword", buyAt: 150, sellAt: 500, autoBuy: true },{ name: "Iron Hammer", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Spear", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Scythe", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Bow", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Boomerang", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Rod", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Spade", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Hatchet", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Pickaxe", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Compass", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Boots", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Gloves", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Helmet", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Shield", buyAt: 84, sellAt: 500, autoBuy: true },{ name: "Iron Body", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Sword", buyAt: 180, sellAt: 500, autoBuy: true },{ name: "Silver Hammer", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Spear", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Scythe", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Bow", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Boomerang", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Rod", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Spade", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Hatchet", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Pickaxe", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Compass", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Boots", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Gloves", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Helmet", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Shield", buyAt: 126, sellAt: 500, autoBuy: true },{ name: "Silver Body", buyAt: 189, sellAt: 500, autoBuy: true },{ name: "Gold Sword", buyAt: 200, sellAt: 500, autoBuy: true },{ name: "Gold Hammer", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Spear", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Scythe", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Bow", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Boomerang", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Rod", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Spade", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Hatchet", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Pickaxe", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Compass", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Boots", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Gloves", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Helmet", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Shield", buyAt: 168, sellAt: 500, autoBuy: true },{ name: "Gold Body", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Cobalt Sword", buyAt: 250, sellAt: 500, autoBuy: true },{ name: "Cobalt Hammer", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Spear", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Scythe", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Bow", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Boomerang", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Rod", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Spade", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Hatchet", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Pickaxe", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Compass", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Boots", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Gloves", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Helmet", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Shield", buyAt: 210, sellAt: 500, autoBuy: true },{ name: "Cobalt Body", buyAt: 315, sellAt: 500, autoBuy: true },{ name: "Obsidian Sword", buyAt: 320, sellAt: 500, autoBuy: true },{ name: "Obsidian Hammer", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Spear", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Scythe", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Bow", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Boomerang", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Rod", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Spade", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Hatchet", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Pickaxe", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Compass", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Boots", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Gloves", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Helmet", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Shield", buyAt: 252, sellAt: 500, autoBuy: true },{ name: "Obsidian Body", buyAt: 378, sellAt: 500, autoBuy: true },{ name: "Astral Sword", buyAt: 370, sellAt: 500, autoBuy: true },{ name: "Astral Hammer", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Spear", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Scythe", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Bow", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Boomerang", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Rod", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Spade", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Hatchet", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Pickaxe", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Compass", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Boots", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Gloves", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Helmet", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Shield", buyAt: 294, sellAt: 500, autoBuy: true },{ name: "Astral Body", buyAt: 441, sellAt: 650, autoBuy: true },{ name: "Infernal Sword", buyAt: 340, sellAt: 450, autoBuy: true },{ name: "Infernal Hammer", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Spear", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Scythe", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Bow", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Boomerang", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Rod", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Spade", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Hatchet", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Pickaxe", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Compass", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Boots", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Gloves", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Helmet", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Shield", buyAt: 336, sellAt: 450, autoBuy: true },{ name: "Infernal Body", buyAt: 504, sellAt: 700, autoBuy: true },{ name: "Ruby Essence", buyAt: 20, sellAt: 100, autoBuy: true },{ name: "Topaz Essence", buyAt: 70, sellAt: 250, autoBuy: true },{ name: "Emerald Essence", buyAt: 100, sellAt: 300, autoBuy: true },{ name: "Amethyst Essence", buyAt: 120, sellAt: 300, autoBuy: true },{ name: "Citrine Essence", buyAt: 120, sellAt: 400, autoBuy: true },{ name: "Diamond Essence", buyAt: 130, sellAt: 400, autoBuy: true },{ name: "Moonstone Essence", buyAt: 150, sellAt: 400, autoBuy: true },{ name: "Onyx Essence", buyAt: 220, sellAt: 300, autoBuy: true },{ name: "Peony", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Tulip", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Rose", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Daisy", buyAt: 28, sellAt: 80, autoBuy: true },{ name: "Lilac", buyAt: 32, sellAt: 80, autoBuy: true },{ name: "Hyacinth", buyAt: 38, sellAt: 80, autoBuy: true },{ name: "Nemesia", buyAt: 65, sellAt: 120, autoBuy: true },{ name: "Snapdragon", buyAt: 60, sellAt: 120, autoBuy: false },{ name: "Potato", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Radish", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Onion", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Carrot", buyAt: 32, sellAt: 100, autoBuy: true },{ name: "Tomato", buyAt: null, sellAt: 55, autoBuy: false },{ name: "Corn", buyAt: null, sellAt: 70, autoBuy: false },{ name: "Pumpkin", buyAt: null, sellAt: 80, autoBuy: false },{ name: "Chilli", buyAt: 90, sellAt: 150, autoBuy: true },{ name: "Beginner Logbook", buyAt: 20, sellAt: 100, autoBuy: true },{ name: "Novice Logbook", buyAt: 30, sellAt: 100, autoBuy: true },{ name: "Competent Logbook", buyAt: 35, sellAt: 100, autoBuy: true },{ name: "Skilled Logbook", buyAt: 44, sellAt: 110, autoBuy: true },{ name: "Adept Logbook", buyAt: 60, sellAt: 120, autoBuy: true },{ name: "Advanced Logbook", buyAt: 70, sellAt: 130, autoBuy: true },{ name: "Expert Logbook", buyAt: 80, sellAt: 140, autoBuy: true },{ name: "Elite Logbook", buyAt: 90, sellAt: 150, autoBuy: true },{ name: "Basic Health Potion", buyAt: 42, sellAt: 200, autoBuy: true },{ name: "Basic Gather Level Potion", buyAt: 72, sellAt: 200, autoBuy: true },{ name: "Basic Craft Level Potion", buyAt: 72, sellAt: 200, autoBuy: true },{ name: "Basic Combat Loot Potion", buyAt: 102, sellAt: 350, autoBuy: true },{ name: "Basic Gather Yield Potion", buyAt: 102, sellAt: 350, autoBuy: true },{ name: "Basic Multi Craft Potion", buyAt: 102, sellAt: 350, autoBuy: true },{ name: "Basic Combat XP Potion", buyAt: 132, sellAt: 350, autoBuy: true },{ name: "Basic Gather XP Potion", buyAt: 132, sellAt: 350, autoBuy: true },{ name: "Basic Craft XP Potion", buyAt: 132, sellAt: 350, autoBuy: true },{ name: "Health Potion", buyAt: 132, sellAt: 200, autoBuy: true },{ name: "Gather Level Potion", buyAt: 132, sellAt: 200, autoBuy: true },{ name: "Craft Level Potion", buyAt: 132, sellAt: 200, autoBuy: true },{ name: "Combat Loot Potion", buyAt: 162, sellAt: 350, autoBuy: true },{ name: "Gather Yield Potion", buyAt: 162, sellAt: 350, autoBuy: true },{ name: "Multi Craft Potion", buyAt: 162, sellAt: 350, autoBuy: true },{ name: "Combat XP Potion", buyAt: 192, sellAt: 350, autoBuy: true },{ name: "Gather XP Potion", buyAt: 192, sellAt: 350, autoBuy: true },{ name: "Craft XP Potion", buyAt: 192, sellAt: 350, autoBuy: true },{ name: "Super Health Potion", buyAt: 192, sellAt: 400, autoBuy: true },{ name: "Super Gather Level Potion", buyAt: 192, sellAt: 400, autoBuy: true },{ name: "Super Craft Level Potion", buyAt: 192, sellAt: 400, autoBuy: true },{ name: "Super Combat Loot Potion", buyAt: 222, sellAt: 400, autoBuy: true },{ name: "Super Gather Yield Potion", buyAt: 222, sellAt: 400, autoBuy: true },{ name: "Super Multi Craft Potion", buyAt: 222, sellAt: 400, autoBuy: true },{ name: "Super Combat XP Potion", buyAt: 252, sellAt: 400, autoBuy: true },{ name: "Super Gather XP Potion", buyAt: 252, sellAt: 400, autoBuy: true },{ name: "Super Craft XP Potion", buyAt: 252, sellAt: 400, autoBuy: true },{ name: "Divine Health Potion", buyAt: null, sellAt: 1000, autoBuy: true },{ name: "Divine Gather Level Potion", buyAt: null, sellAt: 1000, autoBuy: true },{ name: "Divine Craft Level Potion", buyAt: null, sellAt: 1000, autoBuy: true },{ name: "Divine Combat Loot Potion", buyAt: 520, sellAt: 1000, autoBuy: true },{ name: "Divine Gather Yield Potion", buyAt: 520, sellAt: 1000, autoBuy: true },{ name: "Divine Multi Craft Potion", buyAt: 520, sellAt: 1000, autoBuy: true },{ name: "Divine Combat XP Potion", buyAt: 500, sellAt: 1000, autoBuy: true },{ name: "Divine Gather XP Potion", buyAt: 500, sellAt: 1000, autoBuy: true },{ name: "Divine Craft XP Potion", buyAt: 500, sellAt: 1000, autoBuy: true },{ name: "Raw Shrimp", buyAt: null, sellAt: 150, autoBuy: false },{ name: "Raw Cod", buyAt: null, sellAt: 150, autoBuy: false },{ name: "Raw Salmon", buyAt: null, sellAt: 150, autoBuy: false },{ name: "Raw Bass", buyAt: 25, sellAt: 150, autoBuy: true },{ name: "Raw Lobster", buyAt: 45, sellAt: 150, autoBuy: true },{ name: "Raw Swordfish", buyAt: 45, sellAt: 150, autoBuy: true },{ name: "Raw Shark", buyAt: 60, sellAt: 150, autoBuy: true },{ name: "Raw King Crab", buyAt: 85, sellAt: 150, autoBuy: true },{ name: "Cooked Shrimp", buyAt: 25, sellAt: 180, autoBuy: true },{ name: "Cooked Cod", buyAt: 50, sellAt: 190, autoBuy: true },{ name: "Cooked Salmon", buyAt: 75, sellAt: 200, autoBuy: true },{ name: "Cooked Bass", buyAt: 100, sellAt: 210, autoBuy: true },{ name: "Cooked Lobster", buyAt: 125, sellAt: 220, autoBuy: true },{ name: "Cooked Swordfish", buyAt: 150, sellAt: 230, autoBuy: true },{ name: "Cooked Shark", buyAt: 175, sellAt: 240, autoBuy: true },{ name: "Cooked King Crab", buyAt: 200, sellAt: 250, autoBuy: true },{ name: "Shrimp Pie", buyAt: 37.5, sellAt: 140, autoBuy: true },{ name: "Cod Pie", buyAt: 75, sellAt: 150, autoBuy: true },{ name: "Salmon Pie", buyAt: 112.5, sellAt: 170, autoBuy: true },{ name: "Bass Pie", buyAt: 150, sellAt: 220, autoBuy: true },{ name: "Lobster Pie", buyAt: 187.5, sellAt: 250, autoBuy: true },{ name: "Swordfish Pie", buyAt: 225, sellAt: 300, autoBuy: true },{ name: "Shark Pie", buyAt: 310, sellAt: 450, autoBuy: true },{ name: "King Crab Pie", buyAt: 350, sellAt: 500, autoBuy: true },{ name: "Bone", buyAt: 30, sellAt: 50, autoBuy: true },{ name: "Fang", buyAt: 65, sellAt: 150, autoBuy: true },{ name: "Medium Bone", buyAt: 80, sellAt: 140, autoBuy: true },{ name: "Medium Fang", buyAt: 80, sellAt: 140, autoBuy: true },{ name: "Large Bone", buyAt: 95, sellAt: 200, autoBuy: true },{ name: "Large Fang", buyAt: 80, sellAt: 180, autoBuy: true },{ name: "Giant Bone", buyAt: 75, sellAt: 180, autoBuy: true },{ name: "Giant Fang", buyAt: 51, sellAt: 180, autoBuy: true },{ name: "Petty Elite Preserve Rune", buyAt: null, sellAt: 700000, autoBuy: false },{ name: "Petty Elite Damage Rune", buyAt: null, sellAt: 700000, autoBuy: false },{ name: "Petty Elite Block Rune", buyAt: null, sellAt: 700000, autoBuy: false },{ name: "Lesser Elite Preserve Rune", buyAt: 250000, sellAt: 750000, autoBuy: false },{ name: "Lesser Elite Damage Rune", buyAt: 625000, sellAt: 1875000, autoBuy: false },{ name: "Lesser Elite Block Rune", buyAt: 1125000, sellAt: 3375000, autoBuy: false },{ name: "Common Elite Preserve Rune", buyAt: 500000, sellAt: 1500000, autoBuy: false },{ name: "Common Elite Damage Rune", buyAt: 1250000, sellAt: 3750000, autoBuy: false },{ name: "Common Elite Block Rune", buyAt: 2250000, sellAt: 6750000, autoBuy: false },{ name: "Uncommon Elite Preserve Rune", buyAt: 1000000, sellAt: 3000000, autoBuy: false },{ name: "Uncommon Elite Damage Rune", buyAt: 2500000, sellAt: 7500000, autoBuy: false },{ name: "Uncommon Elite Block Rune", buyAt: 4500000, sellAt: 13500000, autoBuy: false },{ name: "Greater Elite Preserve Rune", buyAt: 2000000, sellAt: 6000000, autoBuy: false },{ name: "Greater Elite Damage Rune", buyAt: 5000000, sellAt: 15000000, autoBuy: false },{ name: "Greater Elite Block Rune", buyAt: 9000000, sellAt: 27000000, autoBuy: false },{ name: "Grand Elite Preserve Rune", buyAt: 4000000, sellAt: 12000000, autoBuy: true },{ name: "Grand Elite Damage Rune", buyAt: 10000000, sellAt: 30000000, autoBuy: true },{ name: "Grand Elite Block Rune", buyAt: 18000000, sellAt: 54000000, autoBuy: true },{ name: "Petty Forest Damage Rune", buyAt: 93750, sellAt: 281250, autoBuy: false },{ name: "Petty Forest Block Rune", buyAt: 109375, sellAt: 328125, autoBuy: false },{ name: "Petty Mountain Damage Rune", buyAt: 93750, sellAt: 281250, autoBuy: false },{ name: "Petty Mountain Block Rune", buyAt: 109375, sellAt: 328125, autoBuy: false },{ name: "Petty Ocean Damage Rune", buyAt: 93750, sellAt: 281250, autoBuy: false },{ name: "Petty Ocean Block Rune", buyAt: 109375, sellAt: 328125, autoBuy: false },{ name: "Petty Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Petty Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Petty Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Petty Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Petty Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Petty One-handed Rune", buyAt: 125000, sellAt: 375000, autoBuy: false },{ name: "Petty Two-handed Rune", buyAt: 125000, sellAt: 375000, autoBuy: false },{ name: "Petty Ranged Rune", buyAt: 125000, sellAt: 375000, autoBuy: false },{ name: "Petty Defense Rune", buyAt: 156250, sellAt: 468750, autoBuy: false },{ name: "Lesser Forest Damage Rune", buyAt: 187500, sellAt: 562500, autoBuy: false },{ name: "Lesser Forest Block Rune", buyAt: 218750, sellAt: 656250, autoBuy: false },{ name: "Lesser Mountain Damage Rune", buyAt: 187500, sellAt: 562500, autoBuy: false },{ name: "Lesser Mountain Block Rune", buyAt: 218750, sellAt: 656250, autoBuy: false },{ name: "Lesser Ocean Damage Rune", buyAt: 187500, sellAt: 562500, autoBuy: false },{ name: "Lesser Ocean Block Rune", buyAt: 218750, sellAt: 656250, autoBuy: false },{ name: "Lesser Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Lesser Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Lesser Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Lesser Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Lesser Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Lesser One-handed Rune", buyAt: 250000, sellAt: 750000, autoBuy: false },{ name: "Lesser Two-handed Rune", buyAt: 250000, sellAt: 750000, autoBuy: false },{ name: "Lesser Ranged Rune", buyAt: 250000, sellAt: 750000, autoBuy: false },{ name: "Lesser Defense Rune", buyAt: 312500, sellAt: 937500, autoBuy: false },{ name: "Common Forest Damage Rune", buyAt: 375000, sellAt: 1125000, autoBuy: false },{ name: "Common Forest Block Rune", buyAt: 437500, sellAt: 1312500, autoBuy: false },{ name: "Common Mountain Damage Rune", buyAt: 375000, sellAt: 1125000, autoBuy: false },{ name: "Common Mountain Block Rune", buyAt: 437500, sellAt: 1312500, autoBuy: false },{ name: "Common Ocean Damage Rune", buyAt: 375000, sellAt: 1125000, autoBuy: false },{ name: "Common Ocean Block Rune", buyAt: 437500, sellAt: 1312500, autoBuy: false },{ name: "Common Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Common Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Common Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Common Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Common Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Common One-handed Rune", buyAt: 500000, sellAt: 1500000, autoBuy: false },{ name: "Common Two-handed Rune", buyAt: 500000, sellAt: 1500000, autoBuy: false },{ name: "Common Ranged Rune", buyAt: 500000, sellAt: 1500000, autoBuy: false },{ name: "Common Defense Rune", buyAt: 625000, sellAt: 1875000, autoBuy: false },{ name: "Uncommon Forest Damage Rune", buyAt: 750000, sellAt: 2250000, autoBuy: true },{ name: "Uncommon Forest Block Rune", buyAt: 875000, sellAt: 2625000, autoBuy: true },{ name: "Uncommon Mountain Damage Rune", buyAt: 750000, sellAt: 2250000, autoBuy: true },{ name: "Uncommon Mountain Block Rune", buyAt: 875000, sellAt: 2625000, autoBuy: true },{ name: "Uncommon Ocean Damage Rune", buyAt: 750000, sellAt: 2250000, autoBuy: true },{ name: "Uncommon Ocean Block Rune", buyAt: 875000, sellAt: 2625000, autoBuy: true },{ name: "Uncommon Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Uncommon Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Uncommon Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Uncommon Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Uncommon Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Uncommon One-handed Rune", buyAt: 1000000, sellAt: 3000000, autoBuy: true },{ name: "Uncommon Two-handed Rune", buyAt: 1000000, sellAt: 3000000, autoBuy: true },{ name: "Uncommon Ranged Rune", buyAt: 1000000, sellAt: 3000000, autoBuy: true },{ name: "Uncommon Defense Rune", buyAt: 1250000, sellAt: 3750000, autoBuy: true },{ name: "Greater Forest Damage Rune", buyAt: 1500000, sellAt: 4500000, autoBuy: true },{ name: "Greater Forest Block Rune", buyAt: 1750000, sellAt: 5250000, autoBuy: true },{ name: "Greater Mountain Damage Rune", buyAt: 1500000, sellAt: 4500000, autoBuy: true },{ name: "Greater Mountain Block Rune", buyAt: 1750000, sellAt: 5250000, autoBuy: true },{ name: "Greater Ocean Damage Rune", buyAt: 1500000, sellAt: 4500000, autoBuy: true },{ name: "Greater Ocean Block Rune", buyAt: 1750000, sellAt: 5250000, autoBuy: true },{ name: "Greater Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Greater Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Greater Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Greater Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Greater Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Greater One-handed Rune", buyAt: 2000000, sellAt: 6000000, autoBuy: true },{ name: "Greater Two-handed Rune", buyAt: 2000000, sellAt: 6000000, autoBuy: true },{ name: "Greater Ranged Rune", buyAt: 2000000, sellAt: 6000000, autoBuy: true },{ name: "Greater Defense Rune", buyAt: 2500000, sellAt: 7500000, autoBuy: true },{ name: "Grand Forest Damage Rune", buyAt: 3000000, sellAt: 9000000, autoBuy: true },{ name: "Grand Forest Block Rune", buyAt: 3500000, sellAt: 10500000, autoBuy: true },{ name: "Grand Mountain Damage Rune", buyAt: 3000000, sellAt: 9000000, autoBuy: true },{ name: "Grand Mountain Block Rune", buyAt: 3500000, sellAt: 10500000, autoBuy: true },{ name: "Grand Ocean Damage Rune", buyAt: 3000000, sellAt: 9000000, autoBuy: true },{ name: "Grand Ocean Block Rune", buyAt: 3500000, sellAt: 10500000, autoBuy: true },{ name: "Grand Woodcutting Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Grand Mining Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Grand Farming Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Grand Fishing Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Grand Exploring Rune", buyAt: null, sellAt: null, autoBuy: false },{ name: "Grand One-handed Rune", buyAt: 4000000, sellAt: 12000000, autoBuy: true },{ name: "Grand Two-handed Rune", buyAt: 4000000, sellAt: 12000000, autoBuy: true },{ name: "Grand Ranged Rune", buyAt: 4000000, sellAt: 12000000, autoBuy: true },{ name: "Grand Defense Rune", buyAt: 5000000, sellAt: 15000000, autoBuy: true },{ name: "Ruby Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Ruby Efficiency Ring", buyAt: 468750, sellAt: 1406250, autoBuy: true },{ name: "Ruby Loot Amulet", buyAt: 562500, sellAt: 1687500, autoBuy: true },{ name: "Topaz Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Topaz Efficiency Ring", buyAt: 937500, sellAt: 2812500, autoBuy: true },{ name: "Topaz Loot Amulet", buyAt: 1125000, sellAt: 3375000, autoBuy: true },{ name: "Emerald Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Emerald Efficiency Ring", buyAt: 1875000, sellAt: 5625000, autoBuy: true },{ name: "Emerald Loot Amulet", buyAt: 2250000, sellAt: 6750000, autoBuy: true },{ name: "Amethyst Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Amethyst Efficiency Ring", buyAt: 3750000, sellAt: 11250000, autoBuy: true },{ name: "Amethyst Loot Amulet", buyAt: 4500000, sellAt: 13500000, autoBuy: true },{ name: "Citrine Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Citrine Efficiency Ring", buyAt: 7500000, sellAt: 22500000, autoBuy: true },{ name: "Citrine Loot Amulet", buyAt: 9000000, sellAt: 27000000, autoBuy: true },{ name: "Diamond Wisdom Bracelet", buyAt: null, sellAt: null, autoBuy: false },{ name: "Diamond Efficiency Ring", buyAt: 15000000, sellAt: 25000000, autoBuy: true },{ name: "Diamond Loot Amulet", buyAt: 18000000, sellAt: 25000000, autoBuy: true },{ name: "Elite Key 25", buyAt: 170, sellAt: 600, autoBuy: true },{ name: "Elite Key 40", buyAt: 250, sellAt: 600, autoBuy: true },{ name: "Elite Key 55", buyAt: 250, sellAt: 600, autoBuy: true },{ name: "Elite Key 70", buyAt: 280, sellAt: 600, autoBuy: true },{ name: "Elite Key 85", buyAt: 450, sellAt: 600, autoBuy: true },{ name: "Elite Key 100", buyAt: 550, sellAt: 600, autoBuy: true },{ name: "Ruby Crystal", buyAt: null, sellAt: 140, autoBuy: false },{ name: "Topaz Crystal", buyAt: null, sellAt: 140, autoBuy: false },{ name: "Emerald Crystal", buyAt: null, sellAt: 140, autoBuy: false },{ name: "Amethyst Crystal", buyAt: null, sellAt: 140, autoBuy: false },{ name: "Citrine Crystal", buyAt: 43, sellAt: 140, autoBuy: false },{ name: "Diamond Crystal", buyAt: 51, sellAt: 140, autoBuy: true },{ name: "Moonstone Crystal", buyAt: 42, sellAt: 140, autoBuy: true },{ name: "Onyx Crystal", buyAt: 40, sellAt: 140, autoBuy: true },{ name: "Basic Power Sigil", buyAt: 38, sellAt: 114, autoBuy: true },{ name: "Basic Discovery Sigil", buyAt: 76, sellAt: 228, autoBuy: true },{ name: "Basic Wisdom Sigil", buyAt: 114, sellAt: 342, autoBuy: true },{ name: "Regular Power Sigil", buyAt: 152, sellAt: 456, autoBuy: true },{ name: "Regular Discovery Sigil", buyAt: 190, sellAt: 570, autoBuy: true },{ name: "Regular Wisdom Sigil", buyAt: 228, sellAt: 684, autoBuy: true },{ name: "Super Power Sigil", buyAt: 266, sellAt: 798, autoBuy: true },{ name: "Divine Power Sigil", buyAt: 500, sellAt: 1500, autoBuy: true },{ name: "Super Discovery Sigil", buyAt: 320, sellAt: 960, autoBuy: true },{ name: "Super Wisdom Sigil", buyAt: 320, sellAt: 960, autoBuy: true },{ name: "Divine Discovery Sigil", buyAt: 560, sellAt: 1680, autoBuy: true },{ name: "Divine Wisdom Sigil", buyAt: 560, sellAt: 1680, autoBuy: true },{ name: "Large Egg", buyAt: 8000, sellAt: 12000, autoBuy: true },
        ]
    };

    // --- Utility Functions ---
    function log(message, data) {
        if (CONFIG.LOGGING_ENABLED) {
            const prefix = '[BargainFinder]';
            data ? console.log(`${prefix} ${message}`, data) : console.log(`${prefix} ${message}`);
        }
    }

    function warn(message) {
        if (CONFIG.LOGGING_ENABLED) { console.warn(`[BargainFinder] ${message}`); }
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Synchronous wrapper for GM_getValue
    function getSetting(key, defaultValue) {
        let value = GM_getValue(key, defaultValue);
        if (value === null || value === undefined) return defaultValue;
        if (typeof defaultValue === 'boolean' && typeof value === 'string') return value === 'true';
        return value;
    }

    // Synchronous wrapper for GM_setValue
    function setSetting(key, value) {
        GM_setValue(key, value);
    }

    const parseCost = (costString) => {
        costString = costString.replace(/,/g, '').trim().toUpperCase();
        let multiplier = 1;
        if (costString.endsWith('K')) {
            multiplier = 1000;
            costString = costString.slice(0, -1);
        } else if (costString.endsWith('M')) {
            multiplier = 1000000;
            costString = costString.slice(0, -1);
        }
        return parseFloat(costString) * multiplier;
    };

    function getAngularContentAttribute(elem) {
        if (!elem) return null;
        for (let i = 0; i < elem.attributes.length; i++) {
            if (elem.attributes[i].nodeName.includes('_ngcontent-')) {
                return elem.attributes[i].nodeName;
            }
        }
        return null;
    }

    // --- BargainFinder Core Logic ---
    const BargainFinder = {
        currentTab: CONFIG.TAB_BUY,
        isEnabled: false,
        isObserverAttached: false,
        marketFeaturesInitialized: false,
        autoScanInterval: null,
        autoScanTimerInterval: null,
        scanIntervalMinMs: CONFIG.DEFAULT_SCAN_INTERVAL_MIN_MS,
        scanIntervalMaxMs: CONFIG.DEFAULT_SCAN_INTERVAL_MAX_MS,
        nextScanTime: 0,
        debounceTimeout: null,
        angularAttributeName: null,
        itemData: [],
        alertSentForCurrentView: false,
        lastMatchedItem: null,
        isPerformingAutoClick: false,
        matchSound: new Audio('https://www.myinstants.com/media/sounds/mario_coin_sound.mp3'),

        init: function() {
            log('Initializing...');
            this.addStyles();
            this.loadSettings(); // Sync
            this.loadItemData(); // Sync
            this.setupNavigationObserver();
            this.handleCurrentPage(true);
            $(window).on('unload.bargainfinder', () => this.teardownAllFeatures());
            log('Initialized.');
        },

        loadSettings: function() {
            this.isEnabled = getSetting(CONFIG.LOCAL_STORAGE_KEYS.ENABLED, true);
            this.matchSound.volume = getSetting(CONFIG.LOCAL_STORAGE_KEYS.SOUND_VOLUME, CONFIG.SOUND_VOLUME_DEFAULT);

            // 1. Check if new Min/Max keys already exist (returns null if not set)
            const storedMin = GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MIN, null);
            const storedMax = GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MAX, null);

            // 2. Check for legacy single delay key
            const oldDelay = GM_getValue(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_LEGACY, null);

            if (storedMin === null && storedMax === null) {
                if (oldDelay !== null) {
                    // Migration: Use legacy value for both
                    this.scanIntervalMinMs = oldDelay;
                    this.scanIntervalMaxMs = oldDelay;
                    log(`Migrating legacy delay: ${oldDelay}ms`);
                    GM_deleteValue(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_LEGACY);
                } else {
                    // Defaults
                    this.scanIntervalMinMs = CONFIG.DEFAULT_SCAN_INTERVAL_MIN_MS;
                    this.scanIntervalMaxMs = CONFIG.DEFAULT_SCAN_INTERVAL_MAX_MS;
                }
                // Force Save Immediately so keys exist for next load
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MIN, this.scanIntervalMinMs);
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MAX, this.scanIntervalMaxMs);
                log(`Defaults/Migrated saved: Min ${this.scanIntervalMinMs}, Max ${this.scanIntervalMaxMs}`);
            } else {
                // Normal Load
                this.scanIntervalMinMs = storedMin;
                this.scanIntervalMaxMs = storedMax;
            }
        },

        loadItemData: function() {
            const storedItemData = getSetting(CONFIG.LOCAL_STORAGE_KEYS.ITEM_DATA, []);
            let mergedItemData = [...CONFIG.DEFAULT_ITEM_DATA];

            if (Array.isArray(storedItemData) && storedItemData.length > 0) {
                storedItemData.forEach(storedItem => {
                    const existingIndex = mergedItemData.findIndex(defaultItem => defaultItem.name === storedItem.name);
                    if (existingIndex !== -1) {
                        mergedItemData[existingIndex] = {
                            ...mergedItemData[existingIndex],
                            ...storedItem,
                            autoBuy: storedItem.autoBuy === true
                        };
                    } else {
                        mergedItemData.push({ ...storedItem, autoBuy: storedItem.autoBuy === true });
                    }
                });
            }
            this.itemData = mergedItemData;
            setSetting(CONFIG.LOCAL_STORAGE_KEYS.ITEM_DATA, this.itemData);
        },

        saveItemData: function() {
            setSetting(CONFIG.LOCAL_STORAGE_KEYS.ITEM_DATA, this.itemData);
            log('Item data saved.');
        },

        /**
         * Returns true if Quantity is EXACTLY 100 AND Cost is <= 5000.
         */
        isLowValueItem: function(item) {
            const quantity = parseInt(item.amount.replace(/,/g, ''), 10);
            const cost = item.cost;
            return quantity === 100 && cost <= 5000;
        },

        addStyles: function() {
            const css = `
                .highlighted-bargain { background-color: #15344e !important; transition: background-color 0.1s ease; }
                .highlighted-bargain:hover { background-color: color-mix(in srgb, #15344e 80%, #263849 20%); }
                #bargain-finder-container { position: fixed; bottom: 0; right: 0; width: 140px; background-color: #f8f8f8; border: 1px solid #ccc; color: black; z-index: 1000; font-family: Arial, sans-serif; font-size: 12px; border-radius: 5px 0 0 0; overflow: hidden; }
                #bargain-finder-header { background-color: #ccc; padding: 5px; text-align: center; cursor: pointer; font-weight: bold; user-select: none; }
                #bargain-finder-content { padding: 10px; display: none; }
                #bargain-finder-content label { display: block; margin-bottom: 5px; }
                #bargain-finder-content input[type="checkbox"] { float: left; margin: 2px 8px 0 0; }
                #bargain-finder-content input[type="range"] { width: calc(100% - 10px); margin-top: 5px; }

                /* Delay Inputs */
                #bargain-finder-delay-group input[type="number"] { width: 50px; padding: 2px; border: 1px solid #ddd; border-radius: 3px; text-align: center; }
                #bargain-finder-delay-group label { display: inline-block; margin-right: 5px; }
                #bargain-finder-delay-group div { display: flex; align-items: center; justify-content: space-between; margin-bottom: 5px; }

                #bargain-finder-match-details { margin-top: 15px; padding-top: 10px; border-top: 1px solid #eee; }
                #bargain-finder-match-details div { margin-bottom: 5px; }
                #bargain-finder-match-details input[type="number"] { width: 60px; padding: 2px; margin-left: 5px; border: 1px solid #ddd; border-radius: 3px; }
                #bargain-finder-match-details button { width:100%; margin-top: 10px; padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; }
                #bargain-finder-match-details button:hover { background-color: #45a049; }

                #bargain-finder-clear-adjustments, #bargain-finder-copy-data { margin-top: 10px; padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 11px; width: 100%; }
                #bargain-finder-copy-data { background-color: #008CBA; }
                #bargain-finder-clear-adjustments:hover { background-color: #da190b; }
                #bargain-finder-copy-data:hover { background-color: #007B9E; }

                .copy-feedback { position: fixed; bottom: 10px; right: 10px; background-color: #4CAF50; color: white; padding: 8px 15px; border-radius: 5px; z-index: 1001; opacity: 0; transition: opacity 0.5s ease-in-out; }
            `;
            GM_addStyle(css);
        },

        setupNavigationObserver: function() {
            const bodyObserver = new MutationObserver(() => this.handleCurrentPage(true));
            bodyObserver.observe(document.body, { childList: true, subtree: true });

            const originalPushState = history.pushState;
            history.pushState = function() {
                originalPushState.apply(this, arguments);
                BargainFinder.handleCurrentPage(true);
            };
            const originalReplaceState = history.replaceState;
            history.replaceState = function() {
                originalReplaceState.apply(this, arguments);
                BargainFinder.handleCurrentPage(true);
            };
            $(document).on('click.bargainfinder', 'div.scroll.custom-scrollbar div.name', (e) => {
                setTimeout(() => this.handleCurrentPage(true), 100);
            });
        },

        handleCurrentPage: function(isNavigationalEvent = false) {
            const onMarketPage = window.location.pathname.includes("/market");
            const marketComponentExists = $(CONFIG.SELECTORS.MARKET_LISTINGS_COMPONENT).length > 0;

            if (onMarketPage || marketComponentExists) {
                if (!this.marketFeaturesInitialized) {
                    this.initMarketFeatures(true);
                }
            } else {
                if (this.marketFeaturesInitialized) {
                    this.teardownMarketFeatures(isNavigationalEvent);
                }
            }
        },

        initMarketFeatures: function(resetAlertStatus = false) {
            if (!$(CONFIG.SELECTORS.MARKET_LISTINGS_COMPONENT).length) return;
            this.marketFeaturesInitialized = true;
            log('Market logic initialized.');

            if (!$('#bargain-finder-container').length) {
                this.createUI();
            } else {
                this.loadUISettings();
                this.updateMatchDetailsUI();
            }

            if (!this.angularAttributeName) {
                this.angularAttributeName = getAngularContentAttribute($(CONFIG.SELECTORS.MARKET_SORT_CONTAINER).find('button').first()[0]);
            }

            this.setupMarketListeners();
            this.attachListingsObserver();

            if (resetAlertStatus) {
                this.alertSentForCurrentView = false;
            }

            if (this.isEnabled) {
                this.processTab(this.currentTab);
            }

            // Sync check for autoscan
            if(getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_ENABLED, false)) {
                this.startAutoScan();
            }
        },

        teardownMarketFeatures: function(isNavigationalEvent = false) {
            if (!this.marketFeaturesInitialized) return;
            this.teardownMarketListeners();
            this.disconnectListingsObserver();
            this.stopAutoScan();
            $(CONFIG.SELECTORS.MARKET_LISTINGS_GROUP).find(CONFIG.SELECTORS.LISTING_ROW).removeClass('highlighted-bargain');

            if (isNavigationalEvent) {
                this.alertSentForCurrentView = false;
                this.lastMatchedItem = null;
                this.updateMatchDetailsUI();
            }

            if (!window.location.pathname.includes("/market") && $('#bargain-finder-container').length) {
                $('#bargain-finder-container').remove();
            }

            this.marketFeaturesInitialized = false;
            log('Market logic torn down.');
        },

        teardownAllFeatures: function() {
            this.teardownMarketFeatures(true);
            clearTimeout(this.debounceTimeout);
            $(window).off('.bargainfinder');
            $(document).off('.bargainfinder');
        },

        loadUISettings: function() {
            $('#bargain-finder-enable').prop('checked', getSetting(CONFIG.LOCAL_STORAGE_KEYS.ENABLED, true));
            $('#bargain-finder-highlight').prop('checked', getSetting(CONFIG.LOCAL_STORAGE_KEYS.HIGHLIGHT_ENABLED, false));
            $('#bargain-finder-autoscan').prop('checked', getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_ENABLED, false));
            $('#bargain-finder-autoclick').prop('checked', getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOCLICK_ENABLED, false));
            $('#bargain-finder-autobuy').prop('checked', getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOBUY_ENABLED, false));

            const volume = getSetting(CONFIG.LOCAL_STORAGE_KEYS.SOUND_VOLUME, CONFIG.SOUND_VOLUME_DEFAULT);
            $('#bargain-finder-volume').val(volume);
            this.matchSound.volume = volume;

            const delayMinMs = getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MIN, CONFIG.DEFAULT_SCAN_INTERVAL_MIN_MS);
            const delayMaxMs = getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MAX, CONFIG.DEFAULT_SCAN_INTERVAL_MAX_MS);
            $('#bargain-finder-scan-delay-min').val(delayMinMs / 1000);
            $('#bargain-finder-scan-delay-max').val(delayMaxMs / 1000);
            this.scanIntervalMinMs = delayMinMs;
            this.scanIntervalMaxMs = delayMaxMs;
        },

        createUI: function() {
            if ($('#bargain-finder-container').length) return;

            const $container = $('<div id="bargain-finder-container"></div>');
            const $header = $('<div id="bargain-finder-header">Bargain Finder</div>');
            const $content = $('<div id="bargain-finder-content"></div>');

            const createCheckbox = (id, labelText) => {
                const $checkbox = $(`<input type="checkbox" id="${id}">`);
                const $label = $(`<label for="${id}">${labelText}</label>`);
                return [$checkbox, $label];
            };

            // Enable
            const [$enableCheckbox, $enableLabel] = createCheckbox('bargain-finder-enable', 'Enable');
            $enableCheckbox.on('change', function() {
                const checked = $(this).prop('checked');
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.ENABLED, checked);
                BargainFinder.setEnabled(checked);
            });
            $content.append($enableCheckbox, $enableLabel);

            // Highlight
            const [$highlightCheckbox, $highlightLabel] = createCheckbox('bargain-finder-highlight', 'Highlight');
            $highlightCheckbox.on('change', function() {
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.HIGHLIGHT_ENABLED, $(this).prop('checked'));
                if (BargainFinder.isEnabled) {
                    BargainFinder.debounce(() => BargainFinder.processTab(BargainFinder.currentTab), CONFIG.DEBOUNCE_DELAY_MS);
                }
            });
            $content.append($highlightCheckbox, $highlightLabel);

            // Auto Scan
            const [$autoScanCheckbox, $autoScanLabel] = createCheckbox('bargain-finder-autoscan', 'Auto Scan');
            $autoScanCheckbox.on('change', function() {
                const checked = $(this).prop('checked');
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_ENABLED, checked);
                if (checked && BargainFinder.isEnabled) { BargainFinder.startAutoScan(); }
                else { BargainFinder.stopAutoScan(); }
            });
            $content.append($autoScanCheckbox, $autoScanLabel);

            // Delay Group (Min/Max)
            const $delayGroup = $(`<div id="bargain-finder-delay-group" style="margin-left: 22px;"></div>`);
            const $delayInputs = $(`
                <div>
                    <label for="bargain-finder-scan-delay-min">Min (s):</label>
                    <input type="number" id="bargain-finder-scan-delay-min" min="5">
                </div>
                <div>
                    <label for="bargain-finder-scan-delay-max">Max (s):</label>
                    <input type="number" id="bargain-finder-scan-delay-max" min="5">
                </div>
            `);
            $delayGroup.append($delayInputs);

            const updateScanSettings = function() {
                let minSec = parseInt($('#bargain-finder-scan-delay-min').val(), 10);
                let maxSec = parseInt($('#bargain-finder-scan-delay-max').val(), 10);
                minSec = (isNaN(minSec) || minSec < 5) ? 5 : minSec;
                maxSec = (isNaN(maxSec) || maxSec < minSec) ? minSec : maxSec;

                // Only update DOM if value changed (avoids cursor jumping)
                if (parseInt($('#bargain-finder-scan-delay-min').val()) !== minSec) $('#bargain-finder-scan-delay-min').val(minSec);
                if (parseInt($('#bargain-finder-scan-delay-max').val()) !== maxSec) $('#bargain-finder-scan-delay-max').val(maxSec);

                const newMinMs = minSec * 1000;
                const newMaxMs = maxSec * 1000;

                BargainFinder.scanIntervalMinMs = newMinMs;
                BargainFinder.scanIntervalMaxMs = newMaxMs;
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MIN, newMinMs);
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_DELAY_MAX, newMaxMs);

                log(`Saved Intervals: ${minSec}s - ${maxSec}s`);

                if (BargainFinder.autoScanInterval) {
                    BargainFinder.stopAutoScan();
                    BargainFinder.startAutoScan();
                }
            };
            // FIX: Bind event to the input elements within the jquery object before appending to DOM,
            // or bind after appending. Here we bind to the jquery object directly.
            $delayGroup.find('input').on('change', updateScanSettings);
            $content.append($delayGroup);

            const $timerDisplay = $('<div id="bargain-finder-timer" style="margin-top: 5px; color: #555; font-style: italic;">Next refresh: --</div>');
            $content.append($timerDisplay);

            // Auto Click
            const [$autoClickCheckbox, $autoClickLabel] = createCheckbox('bargain-finder-autoclick', 'Auto Click');
            $autoClickCheckbox.on('change', function() {
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOCLICK_ENABLED, $(this).prop('checked'));
            });
            $content.append($('<div style="margin-top:10px;"></div>').append($autoClickCheckbox, $autoClickLabel));

            // Auto Buy
            const [$autoBuyCheckbox, $autoBuyLabel] = createCheckbox('bargain-finder-autobuy', 'Auto Buy');
            $autoBuyCheckbox.on('change', function() {
                const checked = $(this).prop('checked');
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOBUY_ENABLED, checked);
                // Force Auto Scan on if Auto Buy is enabled
                if (checked && !$('#bargain-finder-autoscan').prop('checked')) {
                    $('#bargain-finder-autoscan').prop('checked', true).trigger('change');
                }
            });
            $content.append($autoBuyCheckbox, $autoBuyLabel);

            // Volume
            const $volumeLabel = $('<label for="bargain-finder-volume" style="margin-top:10px;">Volume</label>');
            const $volumeSlider = $('<input type="range" id="bargain-finder-volume" min="0" max="1" step="0.01">');
            $volumeSlider.on('input change', function() {
                const volume = parseFloat($(this).val());
                BargainFinder.matchSound.volume = volume;
                setSetting(CONFIG.LOCAL_STORAGE_KEYS.SOUND_VOLUME, volume);
            });
            $content.append($volumeLabel, $volumeSlider);

            // Match Details
            const $matchDetailsSection = $(`<div id="bargain-finder-match-details">...</div>`).html(`
                <strong>Last Clicked Item:</strong>
                <div id="match-item-name">N/A</div>
                <div id="match-item-cost">Cost: N/A</div>
                <div style="display: flex; justify-content: space-between;">
                    <div>Buy At: <input type="number" id="match-buy-at" placeholder="Max Buy" style="width: 45px;"></div>
                    <div>Sell At: <input type="number" id="match-sell-at" placeholder="Min Sell" style="width: 45px;"></div>
                </div>
                <div style="margin-top: 5px;">Auto Buy: <input type="checkbox" id="match-auto-buy-toggle" style="float: none; margin: 0;"></div>
                <button id="save-match-adjustments">Save Adjustments</button>
            `);
            $content.append($matchDetailsSection);

            $matchDetailsSection.find('#save-match-adjustments').on('click', () => {
                if (!this.lastMatchedItem) return;
                const itemName = this.lastMatchedItem.name;
                const newBuyAt = parseFloat($('#match-buy-at').val());
                const newSellAt = parseFloat($('#match-sell-at').val());
                const newAutoBuy = $('#match-auto-buy-toggle').prop('checked');

                let item = this.itemData.find(i => i.name === itemName);
                if (!item) {
                    item = { name: itemName, buyAt: null, sellAt: null, autoBuy: false };
                    this.itemData.push(item);
                }
                item.buyAt = isNaN(newBuyAt) ? null : newBuyAt;
                item.sellAt = isNaN(newSellAt) ? null : newSellAt;
                item.autoBuy = newAutoBuy;

                this.saveItemData();
                if (this.isEnabled) { this.processTab(this.currentTab); }
            });

            // Copy / Clear
            const $copyDataButton = $('<button id="bargain-finder-copy-data">Copy Item Data</button>');
            $copyDataButton.on('click', () => BargainFinder.copyItemDataToClipboard());
            $content.append($copyDataButton);

            const $clearAdjustmentsButton = $('<button id="bargain-finder-clear-adjustments">Clear Adjustments</button>');
            $clearAdjustmentsButton.on('click', () => {
                if (confirm("Are you sure you want to clear all custom item adjustments and revert to defaults?")) {
                    setSetting(CONFIG.LOCAL_STORAGE_KEYS.ITEM_DATA, CONFIG.DEFAULT_ITEM_DATA);
                    this.itemData = CONFIG.DEFAULT_ITEM_DATA;
                    this.lastMatchedItem = null;
                    this.updateMatchDetailsUI();
                    if (this.isEnabled) { this.processTab(this.currentTab); }
                }
            });
            $content.append($clearAdjustmentsButton);

            $container.append($header, $content);
            $('body').append($container);

            this.loadUISettings();

            $header.on('click', () => $content.slideToggle());
            this.updateMatchDetailsUI();
        },

        updateMatchDetailsUI: function() {
            const $itemName = $('#match-item-name'), $itemCost = $('#match-item-cost'), $buyAtInput = $('#match-buy-at'), $sellAtInput = $('#match-sell-at'), $saveButton = $('#save-match-adjustments'), $autoBuyToggle = $('#match-auto-buy-toggle');

            if (this.lastMatchedItem) {
                const itemConfig = this.itemData.find(item => item.name === this.lastMatchedItem.name);
                const currentBuyAt = itemConfig && itemConfig.buyAt !== null ? itemConfig.buyAt : '';
                const currentSellAt = itemConfig && itemConfig.sellAt !== null ? itemConfig.sellAt : '';
                const currentAutoBuy = itemConfig && itemConfig.autoBuy === true;

                $itemName.text(`Item: ${this.lastMatchedItem.name}`);
                $itemCost.text(`Current Cost: ${this.lastMatchedItem.cost.toLocaleString()}`);
                $buyAtInput.val(currentBuyAt);
                $sellAtInput.val(currentSellAt);
                $autoBuyToggle.prop('checked', currentAutoBuy);

                $saveButton.prop('disabled', false);
            } else {
                $itemName.text('N/A');
                $itemCost.text('Cost: N/A');
                $buyAtInput.val('');
                $sellAtInput.val('');
                $autoBuyToggle.prop('checked', false);
                $saveButton.prop('disabled', true);
            }
        },

        copyItemDataToClipboard: function() {
            let header = "Name\tMax Buy (BuyAt)\tMin Sell (SellAt)\tAutoBuy\n";
            let tableString = header;
            this.itemData.forEach(item => {
                const autoBuyValue = item.autoBuy ? 'TRUE' : 'FALSE';
                tableString += `${item.name}\t${item.buyAt !== null ? item.buyAt : ''}\t${item.sellAt !== null ? item.sellAt : ''}\t${autoBuyValue}\n`;
            });
            navigator.clipboard.writeText(tableString)
                .then(() => this.showCopyFeedback('Item data copied!'))
                .catch(err => {
                    warn('Failed to copy data:', err);
                    this.showCopyFeedback('Copy failed.', true);
                });
        },

        showCopyFeedback: function(message, isError = false) {
            let $feedback = $('.copy-feedback');
            if ($feedback.length === 0) { $feedback = $('<div class="copy-feedback"></div>').appendTo('body'); }
            $feedback.text(message).css('background-color', isError ? '#f44336' : '#4CAF50').css('opacity', '1');
            setTimeout(() => { $feedback.css('opacity', '0'); }, 3000);
        },

        setEnabled: function(value) {
            this.isEnabled = value;
            if (this.isEnabled) {
                this.initMarketFeatures(true);
            } else {
                this.teardownMarketFeatures(true);
            }
        },

        setupMarketListeners: function() {
            const $tabContainer = $(CONFIG.SELECTORS.MARKET_TABS_CONTAINER);
            const $sortContainer = $(CONFIG.SELECTORS.MARKET_SORT_CONTAINER);

            if (!$tabContainer.length || !$sortContainer.length) return;

            $tabContainer.off('.bf').on('click.bf', '.tab', (e) => {
                if (!this.isEnabled) return;
                const oldTab = this.currentTab;
                if ($(e.currentTarget).is('.left')) this.currentTab = CONFIG.TAB_BUY;
                else if ($(e.currentTarget).is('.middle')) this.currentTab = CONFIG.TAB_ORDERS;
                else this.currentTab = CONFIG.TAB_LISTINGS;

                if (oldTab !== this.currentTab) {
                    this.alertSentForCurrentView = false;
                }
                this.debounce(() => this.processTab(this.currentTab), CONFIG.TAB_CHANGE_DELAY_MS);
            });

            $sortContainer.off('.bf').on('click.bf', 'button', () => {
                if (!this.isEnabled) return;
                this.alertSentForCurrentView = false;
                this.debounce(() => this.processTab(this.currentTab), CONFIG.DEBOUNCE_DELAY_MS);
            });

            $(document).off('click.bf-listing').on('click.bf-listing', CONFIG.SELECTORS.LISTING_ROW, (e) => {
                const $row = $(e.currentTarget);
                const name = $row.find(CONFIG.SELECTORS.LISTING_NAME).text().trim();
                const cost = parseCost($row.find(CONFIG.SELECTORS.LISTING_COST).text().trim());

                if (name && !isNaN(cost)) {
                    this.lastMatchedItem = { name, cost, rowElement: $row };
                    this.updateMatchDetailsUI();
                }
            });
        },

        teardownMarketListeners: function() {
            $(CONFIG.SELECTORS.MARKET_TABS_CONTAINER).off('.bf');
            $(CONFIG.SELECTORS.MARKET_SORT_CONTAINER).off('.bf');
            $(document).off('click.bf-listing');
        },

        attachListingsObserver: function() {
            const targetNode = document.querySelector(CONFIG.SELECTORS.MARKET_LISTINGS_GROUP);
            if (!targetNode) return;
            if (this.isObserverAttached) { this.marketObserver.disconnect(); }
            this.marketObserver.observe(targetNode, { childList: true, subtree: true });
            this.isObserverAttached = true;
        },

        disconnectListingsObserver: function() {
            if (this.isObserverAttached) {
                this.marketObserver.disconnect();
                this.isObserverAttached = false;
            }
        },

        marketObserver: new MutationObserver((mutations) => {
            if (!BargainFinder.isEnabled) return;
            let significantMutation = false;
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    significantMutation = true;
                    break;
                }
            }
            if (significantMutation) {
                BargainFinder.debounce(() => BargainFinder.processTab(BargainFinder.currentTab), CONFIG.DEBOUNCE_DELAY_MS);
            }
        }),

        playMatchSound: function() {
            this.matchSound.currentTime = 0;
            this.matchSound.play().catch(e => warn("Failed to play sound:", e.message));
        },

        readMarketListings: function() {
            const listings = [];
            $(CONFIG.SELECTORS.MARKET_LISTINGS_GROUP).find(CONFIG.SELECTORS.LISTING_ROW).each(function() {
                const $row = $(this);
                const name = $row.find(CONFIG.SELECTORS.LISTING_NAME).text().trim();
                const amount = $row.find(CONFIG.SELECTORS.LISTING_AMOUNT).text().trim();
                const cost = parseCost($row.find(CONFIG.SELECTORS.LISTING_COST).text().trim());

                if (name && amount && !isNaN(cost)) {
                    const itemConfig = BargainFinder.itemData.find(item => item.name.toLowerCase() === name.toLowerCase());
                    listings.push({
                        name,
                        amount,
                        cost,
                        rowElement: $row,
                        autoBuy: itemConfig && itemConfig.autoBuy === true
                    });
                }
            });
            return listings;
        },

        searchListings: function(listings, itemsToSearch, tabType) {
            return listings.filter(listing => {
                return itemsToSearch.some(itemToFind => {
                    const nameMatch = listing.name.toLowerCase() === itemToFind.name.toLowerCase();
                    let costMatch = false;
                    if (tabType === CONFIG.TAB_BUY && itemToFind.buyAt != null) { costMatch = listing.cost <= itemToFind.buyAt; }
                    else if (tabType === CONFIG.TAB_ORDERS && itemToFind.sellAt != null) { costMatch = listing.cost >= itemToFind.sellAt; }
                    return nameMatch && costMatch;
                });
            });
        },

        applyHighlighting: async function(matchingItems) {
            const highlightChecked = getSetting(CONFIG.LOCAL_STORAGE_KEYS.HIGHLIGHT_ENABLED, false);
            $(CONFIG.SELECTORS.MARKET_LISTINGS_GROUP).find(CONFIG.SELECTORS.LISTING_ROW).removeClass('highlighted-bargain');
            if (highlightChecked) {
                matchingItems.forEach(item => item.rowElement.addClass('highlighted-bargain'));
            }
        },

        clickFirstMatch: async function(matchingItems) {
            const autoClickEnabled = getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOCLICK_ENABLED, false);
            const autoBuyEnabled = getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOBUY_ENABLED, false);

            if (matchingItems.length > 0) {
                const firstMatch = matchingItems[0];

                // Auto Buy Logic (Tab check included inside performAutoBuy)
                if (autoBuyEnabled && firstMatch.autoBuy && this.currentTab === CONFIG.TAB_BUY) {
                    this.performAutoBuy(firstMatch);
                    return; // Stop processing to avoid double clicking/conflicting actions
                }

                // Fallback: Auto Click
                if (autoClickEnabled) {
                    log(`Auto-clicking match: ${firstMatch.name}`);
                    this.isPerformingAutoClick = true;
                    firstMatch.rowElement.click();
                    setTimeout(() => { this.isPerformingAutoClick = false; }, CONFIG.DEBOUNCE_DELAY_MS + 50);
                }
            }
        },

        performAutoBuy: function(match) {
            // SAFETY CHECK 1: Ensure we are still on the "Buy" tab
            const $activeTab = $(CONFIG.SELECTORS.MARKET_TABS_CONTAINER).find(CONFIG.SELECTORS.ACTIVE_TAB);
            if (!$activeTab.hasClass('left') || $activeTab.text().trim() !== CONFIG.TAB_BUY) {
                warn(`⚠️ AUTO BUY CANCELLED: Wrong tab. Must be 'Buy'.`);
                return;
            }

            // SAFETY CHECK 2: Re-verify price from config
            const itemConfig = this.itemData.find(item => item.name.toLowerCase() === match.name.toLowerCase());
            if (!itemConfig || match.cost > itemConfig.buyAt) {
                warn(`⚠️ AUTO BUY CANCELLED: Price (${match.cost}) > Max Buy (${itemConfig ? itemConfig.buyAt : 'N/A'}).`);
                setTimeout(() => { location.reload(); }, 500); // Reload if data was stale
                return;
            }

            log(`Attempting Auto-Buy: ${match.name} @ ${match.cost}`);

            // 1. Click listing
            match.rowElement.click();

            // 2. Wait for modal -> Click Max
            setTimeout(() => {
                const $maxButton = $(CONFIG.SELECTORS.PURCHASE_MAX_BUTTON);
                if ($maxButton.length) {
                    $maxButton.click();
                    log(`Clicked MAX for ${match.name}.`);

                    // 3. Wait -> Click Buy
                    setTimeout(() => {
                        const $buyButton = $(CONFIG.SELECTORS.PURCHASE_BUY_BUTTON);
                        if ($buyButton.length) {
                            $buyButton.click();
                            log(`🛒 AUTO PURCHASE SUCCESSFUL: ${match.amount} x ${match.name} @ ${match.cost.toLocaleString()}`);
                            // 4. Reload to refresh market
                            setTimeout(() => { location.reload(); }, CONFIG.DEBOUNCE_DELAY_MS + 100);
                        } else {
                            warn(`Could not find BUY button.`);
                        }
                    }, 500);
                } else {
                    warn(`Could not find MAX button.`);
                }
            }, 700);
        },

        isScanPaused: function() {
            const activeTabText = $(CONFIG.SELECTORS.MARKET_TABS_CONTAINER).find(CONFIG.SELECTORS.ACTIVE_TAB).text().trim();
            if (activeTabText !== CONFIG.TAB_BUY && activeTabText !== CONFIG.TAB_ORDERS) { return true; }
            const $searchInput = $(CONFIG.SELECTORS.MARKET_SEARCH_INPUT);
            if ($searchInput.length > 0 && $searchInput.val().trim() !== '') { return true; }
            return false;
        },

        processTab: async function(tabType) {
            const activeTabText = $(CONFIG.SELECTORS.MARKET_TABS_CONTAINER).find(CONFIG.SELECTORS.ACTIVE_TAB).text().trim();
            if (!this.isEnabled || (this.itemData && this.itemData.length === 0) || activeTabText === CONFIG.TAB_LISTINGS) { return; }

            const autoScanChecked = getSetting(CONFIG.LOCAL_STORAGE_KEYS.AUTOSCAN_ENABLED, false);
            if (autoScanChecked && !this.isScanPaused() && !$(CONFIG.SELECTORS.MARKET_SORT_CONTAINER).find(CONFIG.SELECTORS.DATE_SORT_BUTTON).hasClass('sort-active')) {
                $(CONFIG.SELECTORS.MARKET_SORT_CONTAINER).find(CONFIG.SELECTORS.DATE_SORT_BUTTON).click();
            }

            window.requestAnimationFrame(async () => {
                const listings = this.readMarketListings();
                const itemsToSearch = (activeTabText === CONFIG.TAB_BUY) ?
                      this.itemData.filter(item => item.buyAt != null) :
                this.itemData.filter(item => item.sellAt != null);

                let matchingItems = this.searchListings(listings, itemsToSearch, activeTabText);

                await this.applyHighlighting(matchingItems);

                let actionableMatches = matchingItems.filter(item => {
                    const shouldExclude = this.isLowValueItem(item);
                    if (shouldExclude) { log(`Skipping low-value: ${item.name}`); }
                    return !shouldExclude;
                });

                if (actionableMatches.length > 0 && !this.alertSentForCurrentView) {
                    this.playMatchSound();
                    log('Actionable bargain found!', actionableMatches);
                    this.alertSentForCurrentView = true;
                    this.lastMatchedItem = actionableMatches[0];
                    this.updateMatchDetailsUI();
                    await this.clickFirstMatch(actionableMatches);
                } else if (matchingItems.length > 0 && !this.alertSentForCurrentView) {
                    this.lastMatchedItem = matchingItems[0];
                    this.updateMatchDetailsUI();
                }
            });
        },

        debounce: function(func, delay, ...args) {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => func(...args), delay);
        },

        startAutoScan: function() {
            if (this.autoScanInterval) { clearTimeout(this.autoScanInterval); }

            const intervalMs = getRandomInt(this.scanIntervalMinMs, this.scanIntervalMaxMs);
            this.nextScanTime = Date.now() + intervalMs;
            log(`Auto Scan: Next refresh in ${intervalMs / 1000}s`);

            const performScan = () => {
                if (this.isScanPaused()) {
                    // If paused, push the time forward so we don't loop instantly
                    this.nextScanTime = Date.now() + intervalMs;
                    // Re-schedule the check
                    this.autoScanInterval = setTimeout(performScan, intervalMs);
                    return;
                }

                if (!this.isEnabled) {
                    this.stopAutoScan();
                    return;
                }

                log("Performing Auto Scan...");

                // 1. Calculate and set the NEXT scan time immediately
                // This prevents the watchdog from firing again while we are trying to reload
                const newIntervalMs = getRandomInt(this.scanIntervalMinMs, this.scanIntervalMaxMs);
                this.nextScanTime = Date.now() + newIntervalMs;

                // 2. Execute Navigation / Reload
                if (window.location.pathname.includes("/market")) {
                    log("Reloading page...");
                    location.reload();
                } else {
                    const $marketBtn = $(CONFIG.SELECTORS.MENU_BUTTON_MARKET);
                    if ($marketBtn.length) {
                        log("Clicking Market menu button...");
                        $marketBtn.click();
                    } else {
                        warn("Market button not found! Forcing hard reload.");
                        location.reload();
                    }
                }

                // 3. Schedule next run
                this.autoScanInterval = setTimeout(performScan, newIntervalMs);
            };

            // Schedule the initial run
            this.autoScanInterval = setTimeout(performScan, intervalMs);

            // --- THE WATCHDOG TIMER ---
            if (this.autoScanTimerInterval) clearInterval(this.autoScanTimerInterval);

            this.autoScanTimerInterval = setInterval(() => {
                const $timer = $('#bargain-finder-timer');

                if (this.isScanPaused()) {
                    $timer.text('Next refresh: Paused');
                    // Push nextScanTime forward so we don't trigger watchdog immediately upon unpausing
                    if (Date.now() > this.nextScanTime) {
                        this.nextScanTime = Date.now() + intervalMs;
                    }
                    return;
                }

                const now = Date.now();
                const remainingMs = this.nextScanTime - now;

                if (remainingMs > 0) {
                    $timer.text(`Next refresh: ${Math.round(remainingMs / 1000)}s`);
                } else {
                    $timer.text('Refreshing...');

                    // WATCHDOG LOGIC:
                    // If we are "Refreshing..." for more than 5 seconds (grace period),
                    // it means the setTimeout failed (browser throttling) or the page hung.
                    // Force the scan immediately.
                    if (remainingMs < -5000) {
                        warn("Watchdog: Timer hung or throttled. Forcing scan now.");
                        // Clear the stuck timeout
                        clearTimeout(this.autoScanInterval);
                        // Force the function
                        performScan();
                    }
                }
            }, 1000);
        },

        stopAutoScan: function() {
            if (this.autoScanInterval) {
                clearTimeout(this.autoScanInterval);
                this.autoScanInterval = null;
                log("Auto Scan Stopped");
            }
            if (this.autoScanTimerInterval) {
                clearInterval(this.autoScanTimerInterval);
                this.autoScanTimerInterval = null;
            }
            $('#bargain-finder-timer').text('Next refresh: --');
        },
    };

    // --- Start the script ---
    $(document).ready(() => {
        BargainFinder.init();
    });

})(jQuery);