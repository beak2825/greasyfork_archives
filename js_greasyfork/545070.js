// ==UserScript==
// @name         MooMoo.io Scroll Wheel Inventory Minimod
// @namespace    https://greasyfork.org/users/137913
// @author       TigerYT
// @description  Adds Minecraft-style inventory selection using the scroll wheel.
// @version      3.0.0
// @match        *://moomoo.io/*
// @match        *://dev.moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=moomoo.io
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545070/MooMooio%20Scroll%20Wheel%20Inventory%20Minimod.user.js
// @updateURL https://update.greasyfork.org/scripts/545070/MooMooio%20Scroll%20Wheel%20Inventory%20Minimod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @module ScrollWheelMod
     * @description Main module for the Scroll Wheel Inventory script.
     * Encapsulates all state, data, and logic to avoid polluting the global scope.
     */
    const ScrollWheelMod = {
        // --- CONFIGURATION ---
        /**
         * @property {object} config - Holds user-configurable settings for the script.
         */
        config: {
            /** @property {boolean} DEBUG_MODE - Set to true to see detailed logs in the console. */
            DEBUG_MODE: false,
            /** @property {string} SELECTION_BORDER_STYLE - The CSS border style for the selected item. */
            SELECTION_BORDER_STYLE: '2px solid white',
        },

        // --- STATE MANAGEMENT ---
        /**
         * @property {object} state - Holds the dynamic state of the script, changing as the user plays.
         */
        state: {
            /** @property {boolean} isListenerActive - Tracks if the 'wheel' event listener has been attached. */
            isListenerActive: false,
            /** @property {boolean} isSandbox - Tracks if the player is in sandbox mode for item limits. */
            isSandbox: window.location.host.startsWith('sandbox.'),
            /** @property {WebSocket|null} gameSocket - A reference to the game's main WebSocket instance. */
            gameSocket: null,
            /** @property {object|null} gameEncoder - A reference to the game's msgpack encoder instance. */
            gameEncoder: null,
            /** @property {object|null} gameDecoder - A reference to the game's msgpack decoder instance. */
            gameDecoder: null,
            /** @property {number} selectedItemIndex - The current index within the list of *equipable* items. */
            selectedItemIndex: -1,
            /** @property {number} lastSelectedWeaponIndex - The index of the last selected weapon, used to auto-switch back after using an item. */
            lastSelectedWeaponIndex: -1,
            /** @property {number} playerId - The client player's unique ID assigned by the server. */
            playerId: -1,
            /** @property {{food: number, wood: number, stone: number, gold: number}} playerResources - The player's current resource counts. */
            playerResources: { food: 0, wood: 0, stone: 0, gold: 0 },
            /** @property {Map<number, number>} playerPlacedItemCounts - Maps an item's limit group ID to the number of items placed from that group. */
            playerPlacedItemCounts: new Map(),
        },

        // --- CORE DATA ---
        /**
         * @property {object} data - Contains structured, static data about the game, such as items and packet definitions.
         */
        data: {
            /** @property {Map<number, object>} _itemDataByServerId - A map for quickly looking up item data by its server-side ID. */
            _itemDataByServerId: new Map(),
            /** @property {Map<number, object[]>} _itemDataBySlot - A map for grouping items by their action bar slot. */
            _itemDataBySlot: new Map(),

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

            /** @property {object} _packetNames - Maps packet ID codes to human-readable names for logging. */
            _packetNames: {
                'io-init': 'Initial Connection',
                '0': 'Ping',
                '1': 'Clan Disbanded',
                '2': 'Clan Join Request',
                '3': 'Leave / Disband Clan',
                '4': 'Clan Member Update',
                '5': 'Store / Shop State Update',
                '6': 'Chat Message Received',
                '7': 'Unknown Event',
                '8': 'Player Hit Effect?',
                'A': 'All Clans List',
                'C': 'Client Player Initialization',
                'D': 'Other Player Spawn',
                'E': 'Player Despawn',
                'G': 'Leaderboard Update',
                'H': 'Create Map Objects',
                'I': 'All Animals / NPCs State Update',
                'J': 'Boss Skill / Animation Trigger',
                'K': 'Player Attack Animation',
                'L': 'Object Damaged',
                'M': 'Turret Fired',
                'N': 'Resource Update',
                'O': 'Player Health Update',
                'P': 'Player Death / Reset',
                'Q': 'Remove Map Object',
                'R': 'Remove Player-Placed Objects',
                'S': 'Item Count Update',
                'T': 'Player XP Update / Age Up',
                'U': 'Upgrade / Buy Item',
                'V': 'Ability State Update?',
                'X': 'Create Projectile',
                'Y': 'Projectile Distance?',
                'a': 'All Players State Update',
                'g': 'Clan Created'
            },

            /** @property {object} _packetFormatters - Maps packet IDs to functions that format raw packet data into structured objects for easier use and logging. */
            _packetFormatters: {
                'io-init': ([socketID]) => ({ socketID }),
                '0': () => ({}),
                '1': ([clanSID]) => ({ clanSID }),
                '2': ([requestingPlayerName, requestingPlayerID]) => ({ requestingPlayerName, requestingPlayerID }),
                '3': (data) => ({ data }),
                '4': (members) => ({ members: members.map(([id, name]) => ({ id, name })) }),
                '5': ([action, itemID, state]) => ({ action, itemID, state }),
                '6': ([playerID, message]) => ({ playerID, message }),
                '7': ([state]) => ({ state }),
                '8': ([x, y, size, type]) => ({ x, y, size, type }),
                'A': ([data]) => data,
                'C': ([playerID]) => ({ playerID }),
                'D': ([data, isClientPlayer]) => ({ socketID: data[0], id: data[1], nickname: data[2], x: data[3], y: data[4], angle: data[5], health: data[6], maxHealth: data[7], size: data[8], skinID: data[9], isClientPlayer }),
                'E': ([socketID]) => ({ socketID }),
                'G': (args) => {
                    const leaderboard = [];
                    for (let i = 0; i < args.length; i += 3) leaderboard.push({ rank: args[i], name: args[i+1], score: args[i+2] });
                    return { leaderboard };
                },
                'H': (args) => ({ objectCount: args.length / 8 }), 
                'I': (args) => ({ npcCount: args.length / 7 }),
                'J': ([animationID]) => ({ animationID }),
                'K': ([attackingPlayerID, victimPlayerID, unknown]) => ({ attackingPlayerID, victimPlayerID, unknown }),
                'L': ([playerAnimAngle, objectID]) => ({ playerAnimAngle, objectID }),
                'M': ([turretObjectID, angle]) => ({ turretObjectID, angle }),
                'N': ([resourceType, newAmount, source]) => ({ resourceType: resourceType === 'points' ? 'gold' : resourceType, newAmount, source }),
                'O': ([playerID, newHealth]) => ({ playerID, newHealth }),
                'P': () => ({}),
                'Q': ([objectID]) => ({ objectID }),
                'R': ([playerID]) => ({ playerID }),
                'S': ([serverItemID, newCount]) => ({ serverItemID, newCount }),
                'T': (args) => ({ currentExp: args[0], requiredExp: args[1], nextAge: args[2] }),
                'U': ([serverItemID, levelOrCount]) => ({ serverItemID, levelOrCount }),
                'V': (args) => args.length === 1 ? { data: args[0] } : { data: args[0], unknown: args[1] },
                'X': ([x, y, angle, type, speed, range, ownerID, damage]) => ({ x, y, angle, type, speed, range, ownerID, damage }),
                'Y': ([unknown, value]) => ({ unknown, value }),
                'a': (args) => ({ playerCount: args.length / 13 }),
                'g': (data) => ({ newClan: data[0] })
            },
            
            /**
             * Processes the raw item data from `_rawItems` into the lookup maps for efficient access.
             * This function is called once during the script's initialization.
             */
            initialize() {
                const itemTypes = {
                    PRIMARY_WEAPONS: { itemType: 0, slot: 8 },
                    SECONDARY_WEAPONS: { itemType: 1, slot: 9 },
                    FOOD: { itemType: 2, slot: 0 },
                    WALLS: { itemType: 3, slot: 1 },
                    SPIKES: { itemType: 4, slot: 2 },
                    WINDMILLS: { itemType: 5, slot: 3 },
                    FARMS: { itemType: 6, slot: 6 },
                    TRAPS: { itemType: 7, slot: 4 },
                    EXTRAS: { itemType: 8, slot: 5 },
                    SPAWN_PADS: { itemType: 9, slot: 7 },
                };

                for (const category in this._rawItems) {
                    const { itemType, slot } = itemTypes[category];
                    this._rawItems[category].forEach(item => {
                        const fullItemData = {
                            ...item,
                            itemType,
                            slot,
                            cost: { food: 0, wood: 0, stone: 0, gold: 0, ...item.cost } // Ensure all costs are defined
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

        // --- UTILITY FUNCTIONS ---

        /**
         * Sends a WebSocket packet to the server to equip an item.
         * @param {{id: number, itemType: number}} itemData - The data object for the item to equip.
         */
        sendEquipItem(itemData) {
            try {
                const isWeapon = itemData.itemType <= 1;
                const message = ['z', [itemData.id, isWeapon]];
                this.state.gameSocket.send(this.state.gameEncoder.encode(message));
            } catch (err) {
                Logger.error("Failed to send equip packet.", err);
            }
        },
        
        /**
         * Extracts the server-side item ID from a DOM element's ID attribute.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {RegExpMatchArray|null} A match array where index 1 is the ID, or null if no match.
         */
        getItemIdFromElem(itemElem) {
            return itemElem.id.match(/^actionBarItem(\d+)$/);
        },
        
        /**
         * Retrieves the full data object for an item from its corresponding DOM element.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {object|undefined} The item data object, or undefined if not found.
         */
        getItemFromElem(itemElem) {
            const serverItemId = parseInt(this.getItemIdFromElem(itemElem)[1]);
            return this.data._itemDataByServerId.get(serverItemId);
        },
        
        /**
         * Checks if the player has sufficient resources to afford an item.
         * @param {object} itemData - The item's data object, containing a `cost` property.
         * @returns {boolean} True if the item is affordable or has no cost, false otherwise.
         */
        isAffordableItem(itemData) {
            if (!itemData || !itemData.cost) return true; // Free items are always affordable

            return this.state.playerResources.food >= itemData.cost.food &&
                   this.state.playerResources.wood >= itemData.cost.wood &&
                   this.state.playerResources.stone >= itemData.cost.stone;
        },
        
        /**
         * Checks if an item element in the action bar is currently visible and represents a valid item.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {boolean} True if the item is available for selection.
         */
        isAvailableItem(itemElem) {
            const isVisible = itemElem.style.display !== 'none';
            if (!isVisible) return false;

            return !!this.getItemIdFromElem(itemElem);
        },
        
        /**
         * Determines if an item can be equipped by checking its availability, affordability, and placement limits.
         * @param {HTMLElement} itemElem - The action bar item element.
         * @returns {boolean} True if the item can be equipped.
         */
        isEquipableItem(itemElem) {
            if (!this.isAvailableItem(itemElem)) return false;

            const itemData = this.getItemFromElem(itemElem);
            if (!itemData) return false;

            // Check 1: Resource affordability
            if (!this.isAffordableItem(itemData)) return false;

            // Check 2: Placement limit
            if (itemData.limitGroup) {
                const limit = this.state.isSandbox && itemData.sandboxLimit ? itemData.sandboxLimit : itemData.limit;
                const currentCount = this.state.playerPlacedItemCounts.get(itemData.limitGroup) || 0;
                if (currentCount >= limit) {
                    return false;
                }
            }
            
            return true; // If all checks pass
        },

        /**
         * Programmatically selects an item by its index in the list of equipable items, sends the equip packet, and updates the UI.
         * This is used for direct selection via hotkeys or clicks.
         * @param {number} newIndex - The index of the item to select in the list of currently equipable items.
         */
        selectItemByIndex(newIndex) {
            const equipableItems = Array.from(document.getElementById('actionBar').children).filter(el => this.isEquipableItem(el));
            if (newIndex < 0 || newIndex >= equipableItems.length) return;

            this.state.selectedItemIndex = newIndex;
            this.refreshEquipableState(0, true); // Refresh state without scrolling, but force equip
        },

        /**
         * The master function for refreshing the inventory selection state and UI.
         * It is called by user scrolling and by network events (e.g., resource updates).
         * @param {number} [scrollDirection=0] - The direction of the scroll. Use 1 for down, -1 for up. A value of 0 refreshes the UI without changing selection.
         */
        refreshEquipableState(scrollDirection = 0) {
            // 1. Get all items from the DOM
            const actionBar = document.getElementById('actionBar');
            if (!actionBar) return;

            const equipableItems = Array.from(actionBar.children).filter((itemElem) => this.isEquipableItem(itemElem));

            if (equipableItems.length === 0) {
                Logger.warn("No equipable items available.");
                this.state.selectedItemIndex = -1; // Reset index
                this.updateSelectionUI(null, []); // Clear the UI
                return;
            }

            // 2. Calculate the new index. This handles scrolling and corrects the index if the item list changes.
            this.state.selectedItemIndex = (this.state.selectedItemIndex + scrollDirection + equipableItems.length) % equipableItems.length;
            
            // Stores the last active weapon's index, defaulting to primary if a secondary isn't equipable.
            if (this.state.selectedItemIndex <= 1) this.state.lastSelectedWeaponIndex = (this.getItemFromElem(equipableItems[1]).itemType > 1) ? 0 : this.state.selectedItemIndex;

            // 3. Get the selected item element
            const selectedElement = equipableItems[this.state.selectedItemIndex];
            if (!selectedElement) return;

            // 4. If we scrolled, send the equip packet. If it's just a refresh, we don't.
            if (scrollDirection !== 0) {
                const itemToEquip = this.getItemFromElem(selectedElement);

                if (itemToEquip) {
                    this.sendEquipItem(itemToEquip);
                }
            }
            
            // 5. Always update the UI to reflect the current state
            this.updateSelectionUI(selectedElement, equipableItems);
        },
        
        /**
         * Updates the action bar UI to highlight the selected item and apply styles to others.
         * @param {HTMLElement|null} selectedItem - The element to highlight as selected. Can be null to clear selection.
         * @param {HTMLElement[]} equipableItems - All currently equipable item elements.
         */
        updateSelectionUI(selectedItem, equipableItems) {
            const actionBar = document.getElementById('actionBar');
            if (!actionBar) return;

            const availableItems = Array.from(actionBar.children).filter((itemElem) => this.isAvailableItem(itemElem));
            const availableButNotEquipable = availableItems.filter(element => !equipableItems.includes(element));
            const availableButNotSelected = availableItems.filter(element => selectedItem != element);

            availableButNotSelected.forEach((item) => {
                item.style.border = 'none';
                item.style.filter = 'grayscale(0) brightness(1)';
            });
            availableButNotEquipable.forEach((item) => {
                item.style.filter = 'grayscale(1) brightness(0.75)';
            });

            if (selectedItem) {
                selectedItem.style.border = this.config.SELECTION_BORDER_STYLE;
                selectedItem.style.filter = 'grayscale(0) brightness(1)';
            }
        },

        // --- EVENT HANDLERS & NETWORK ---
        
        /**
         * The main handler for the 'wheel' event on the document. Orchestrates the item selection process on scroll.
         * @param {WheelEvent} event - The DOM wheel event.
         */
        handleInventoryScroll(event) {
            // Do not scroll if a menu is open or the game is not connected.
            const isVisible = (elem) => elem && elem.style.display === 'block';
            const chatHolder = document.getElementById('chatHolder');
            const storeMenu = document.getElementById('storeMenu');
            const allianceMenu = document.getElementById('allianceMenu');

            if (isVisible(storeMenu) || isVisible(allianceMenu) || isVisible(chatHolder) || !this.state.gameSocket || this.state.gameSocket.readyState !== WebSocket.OPEN) return;
            
            event.preventDefault();

            // Determine scroll direction and send to refresh selection UI function.
            const scrollDirection = event.deltaY > 0 ? 1 : -1;
            this.refreshEquipableState(scrollDirection);
        },

        /**
         * Handles keyboard shortcuts for direct item selection (e.g., '1'-'9', 'Q').
         * @param {KeyboardEvent} event - The DOM keyboard event.
         */
        handleKeyPress(event) {
            // Do not scroll if a menu is open or the game is not connected.
            const isVisible = (elem) => elem && elem.style.display === 'block';
            const chatHolder = document.getElementById('chatHolder');
            const storeMenu = document.getElementById('storeMenu');
            const allianceMenu = document.getElementById('allianceMenu');

            if (isVisible(storeMenu) || isVisible(allianceMenu) || isVisible(chatHolder) || !this.state.gameSocket || this.state.gameSocket.readyState !== WebSocket.OPEN) return;

            const key = event.key.toUpperCase();
            let targetElement = null;

            const availableItems = Array.from(document.getElementById('actionBar').children).filter(el => this.isAvailableItem(el));
            if (availableItems.length === 0) return;

            if (key >= '1' && key <= '9') {
                targetElement = availableItems[parseInt(key) - 1];
            } else if (key === 'Q') {
                targetElement = availableItems.find(el => this.getItemFromElem(el)?.itemType === 2);
            }

            if (targetElement && this.isEquipableItem(targetElement)) {
                const equipableItems = Array.from(document.getElementById('actionBar').children).filter(el => this.isEquipableItem(el));
                const newIndex = equipableItems.findIndex(el => el.id === targetElement.id);
                if (newIndex !== -1) {
                    this.selectItemByIndex(newIndex);
                }
            }
        },

        /**
         * Handles direct item selection by clicking on the action bar.
         * @param {MouseEvent} event - The DOM mouse event.
         */
        handleItemClick(event) {
            // Do not scroll if a menu is open or the game is not connected.
            const isVisible = (elem) => elem && elem.style.display === 'block';
            const chatHolder = document.getElementById('chatHolder');
            const storeMenu = document.getElementById('storeMenu');
            const allianceMenu = document.getElementById('allianceMenu');

            if (isVisible(storeMenu) || isVisible(allianceMenu) || isVisible(chatHolder) || !this.state.gameSocket || this.state.gameSocket.readyState !== WebSocket.OPEN) return;

            const clickedElement = event.target.closest('.actionBarItem');
            if (clickedElement && this.isEquipableItem(clickedElement)) {
                const equipableItems = Array.from(document.getElementById('actionBar').children).filter(el => this.isEquipableItem(el));
                const newIndex = equipableItems.findIndex(el => el.id === clickedElement.id);
                if (newIndex !== -1) {
                    this.selectItemByIndex(newIndex);
                }
            }
        },

        /**
         * Intercepts and processes incoming WebSocket messages to track game state changes.
         * @param {MessageEvent} event - The WebSocket message event containing the game data.
         */
        handleSocketMessage(event) {
            if (!this.state.gameDecoder) return;

            try {
                const [packetID, ...argsArr] = this.state.gameDecoder.decode(new Uint8Array(event.data));
                const args = argsArr[0]; // The game nests args in another array for some reason

                const packetName = this.data._packetNames[packetID] || 'Unknown Packet';
                const packetData = this.data._packetFormatters[packetID] ? this.data._packetFormatters[packetID](args) : { rawData: args };
                switch (packetName) {
                    case 'Client Player Initialization': {
                        this.data.playerId = packetData.playerID;
                    }
                    case 'Other Player Spawn': {
                        if (this.data.playerId == packetData.id && packetData.isClientPlayer) {
                            setTimeout(() => this.onGameReady(), 0);
                        }

                        break;
                    }
                    case 'Resource Update': {
                        const resourceType = packetData.resourceType === 'points' ? 'gold' : packetData.resourceType;

                        const oldAmount = this.state.playerResources[resourceType];
                        this.state.playerResources[resourceType] = packetData.newAmount;

                        // If item was used, switch back to weapon.
                        if (resourceType != 'gold' && packetData.newAmount < oldAmount) {
                            this.state.selectedItemIndex = this.state.lastSelectedWeaponIndex;
                        }

                        this.refreshEquipableState(); // Refresh UI, may now be affordable
                        break;
                    }
                    case 'Item Count Update': {
                        const itemData = this.data._itemDataByServerId.get(packetData.serverItemID);
                        if (itemData && itemData.limitGroup) {
                            this.state.playerPlacedItemCounts.set(itemData.limitGroup, packetData.newCount);
                            this.refreshEquipableState(0); // Refresh UI, an item may have hit its placement limit
                        }
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
                    const ignoredPackets = ['I', 'a', '0', '7'];
                    // const ignoredPackets = ['I', 'a', '0', '7', 'H', 'G', 'K', 'L', 'T'];
                    if (ignoredPackets.includes(packetID.toString())) return;
                    // if (packetID.toString() === 'O' && packetData.playerID !== this.state.playerId) return;

                    const dataString = Object.keys(packetData).length > 0 ? JSON.stringify(packetData) : '{}';
                    Logger.log(`Packet ID: ${packetID} - Name: ${packetName} - ${dataString}`, args);
                }
            } catch (e) { /* Ignore decoding errors for packets we don't care about */ }
        },

        // --- INITIALIZATION & HOOKING ---

        /**
         * Finds the game's msgpack encoder/decoder instances by hooking into Object.prototype.
         * It temporarily redefines a property setter on Object.prototype. When the game's code
         * creates an object with a specific property (like 'initialBufferSize'), our setter
         * fires, allowing us to grab a reference to that object.
         * @param {string} propName - The unique property name to watch for.
         * @param {Function} onFound - The callback to execute when the object is found.
         */
        hookIntoPrototype(propName, onFound) {
            const originalDesc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
            Object.defineProperty(Object.prototype, propName, {
                set(value) {
                    // Restore original setter behavior
                    if (originalDesc && originalDesc.set) {
                        originalDesc.set.call(this, value);
                    } else {
                        this[`_${propName}`] = value;
                    }

                    // Check and callback
                    if (this && this[propName] !== undefined) {
                        Object.defineProperty(Object.prototype, propName, originalDesc || { value, writable: true, configurable: true });
                        onFound(this);
                    }
                },
                get() {
                    return originalDesc && originalDesc.get ? originalDesc.get.call(this) : this[`_${propName}`];
                },
                configurable: true,
            });
        },
        
        /**
         * Sets up all necessary hooks to integrate with the game's internal objects and network traffic.
         */
        initializeHooks() {
            // Hook 1: Find msgpack codecs to encode/decode network packets.
            let codecsFound = 0;
            const onCodecFound = () => {
                codecsFound++;
                if (codecsFound === 2 && !this.state.isListenerActive) {
                    // Once both codecs are found, attach our event listeners.
                    document.addEventListener('wheel', this.handleInventoryScroll.bind(this), { passive: false });
                    document.addEventListener('keydown', this.handleKeyPress.bind(this));
                    document.getElementById('actionBar').addEventListener('click', this.handleItemClick.bind(this));
                    this.state.isListenerActive = true;
                }
            };
            this.hookIntoPrototype("initialBufferSize", (obj) => { this.state.gameEncoder = obj; onCodecFound(); });
            this.hookIntoPrototype("maxExtLength", (obj) => { this.state.gameDecoder = obj; onCodecFound(); });

            // Hook 2: Intercept WebSocket creation to add our message listener.
            const originalWebSocket = window.WebSocket;
            window.WebSocket = new Proxy(originalWebSocket, {
                construct: (target, args) => {
                    const wsInstance = new target(...args);
                    
                    this.state.gameSocket = wsInstance;
                    wsInstance.addEventListener('message', this.handleSocketMessage.bind(this));
                    
                    // Restore the original WebSocket constructor now that we're done
                    window.WebSocket = originalWebSocket;

                    return wsInstance;
                }
            });
        },

        /**
         * Runs once the WebSocket is established and the player has spawned.
         * Performs initial setup that requires the DOM to be populated, like UI tweaks and scraping initial resources.
         */
        onGameReady() {
            try {
                const storeMenu = document.getElementById('storeMenu');
                storeMenu.style.transform = 'translateY(0px)';
                storeMenu.style.top = '20px';
                storeMenu.style.height = 'calc(100% - 240px)';

                const storeHolder = document.getElementById('storeHolder');
                storeHolder.style.height = '100%';

                const resElements = document.getElementById('resDisplay').children;
                this.state.playerResources = {
                    food: parseInt(resElements[0].textContent) || 0,
                    wood: parseInt(resElements[1].textContent) || 0,
                    stone: parseInt(resElements[2].textContent) || 0,
                    gold: parseInt(resElements[3].textContent) || 0
                };
            } catch(e) {
                Logger.error("Could not scrape initial resources.", e);
            }
        },

        /**
         * The main entry point for the script. Initializes data and sets up hooks.
         */
        init() {
            Logger.log(`--- Scroll Wheel Script Initializing ---`, "color: #ffb700; font-weight: bold;");
            this.data.initialize();
            this.initializeHooks();
            
            // Expose for debugging if needed
            window.ScrollWheelMod = this;
        }
    };

    /**
     * @description A simple, configurable logger to prefix messages and avoid cluttering the console.
     * It respects the `DEBUG_MODE` flag in the main module's config.
     */
    const Logger = {
        /** Logs a standard message. */
        log: (message, ...args) => ScrollWheelMod.config.DEBUG_MODE && console.log(`%c[SWI-Mod] ${message}`, ...args),
        /** Logs an informational message. */
        info: (message, ...args) => ScrollWheelMod.config.DEBUG_MODE && console.info(`%c[SWI-Mod] ${message}`, ...args),
        /** Logs a warning. */
        warn: (message, ...args) => ScrollWheelMod.config.DEBUG_MODE && console.warn(`[SWI-Mod] ${message}`, ...args),
        /** Logs an error. Always shown regardless of DEBUG_MODE. */
        error: (message, ...args) => console.error(`[SWI-Mod] ${message}`, ...args),
    };

    // --- START THE SCRIPT ---
    ScrollWheelMod.init();

})();