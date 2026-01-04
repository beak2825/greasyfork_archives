// ==UserScript==
// @name         Idlescape Resources Tracker
// @namespace    NGI
// @version      1.0.2
// @description  Show a summary for all resources gained/lost since you logged in
// @author       Dael
// @match        *://*.idlescape.com/game*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426858/Idlescape%20Resources%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/426858/Idlescape%20Resources%20Tracker.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let initialTime = new Date();
    let resources = {};
    let tracker;

    // Intercept socket init
    if( typeof WebSocket.prototype._send == "undefined" ){
        WebSocket.prototype._send = WebSocket.prototype.send;
    }
    WebSocket.prototype.send = function(data){
        this._send(data);
        if( typeof window.IdlescapeSocket == "undefined" ){
            window.IdlescapeSocket = this;
            this.send = this._send;
        }
    }

    class Resource {
        initialStockPile = 0;
        initialVault = 0;
        currentStockPile = 0;
        currentVault = 0;
        initialEquipped = 0;
        currentEquipped = 0;

        gain(){
            return (this.currentStockPile - this.initialStockPile) + (this.currentVault - this.initialVault) + (this.currentEquipped - this.initialEquipped);
        }
    }

    class ResourceTracker {
        isInitialInventoryPopulated = false;
        currentEquipment = {ring: '', body: '', helm: '', legs: '', hatchet: '', hoe: '', pickaxe: '', boots: '', gloves: '', necklace: '', shield: '', weapon: ''};

        parseUpdatePlayerMessage(message){
            if (message[1]['portion'] === "all") {
                this._initialInventoryUpdate(message[1]['value']);
            } else if (Array.isArray(message[1]['portion']) && message[1]['portion'].includes("equipment")) {
                for (const [position, item] of Object.entries(message[1]['value'])) {
                    this._updateEquipment(position, item);
                }
            }
        }

        parseUpdateInventoryMessage(message){
            let action = message[1]['action'];
            if (action === "update" || action === "add" || action === "delete") {
                let resource = message[1]['item'];
                let inventoryType = message[1]['inventory'];
                this._updateCurrentResources(resource, inventoryType);
            } else {
                console.log(`Unknown update inventory message type ${message[1]}`);
            }
        }

        _updateEquipment(position, item){
            let previousItemSignature = (this.currentEquipment)[position];
            let newItemSignature = this._getItemSignature(item);
            if (previousItemSignature !== newItemSignature){
                if (previousItemSignature !== '') resources[previousItemSignature].currentEquipped = 0;
                if (newItemSignature !== '') resources[newItemSignature].currentEquipped = 1;
                (this.currentEquipment)[position] = newItemSignature;
            }
        }

        _updateCurrentResources(item, inventoryType){
            let itemSignature = this._getItemSignature(item);
            if (resources[itemSignature] === undefined) resources[itemSignature] = new Resource();
            if (inventoryType === 'stockpile') resources[itemSignature].currentStockPile = item['stackSize'];
            else if (inventoryType === 'vault') resources[itemSignature].currentVault = item['stackSize'];
            else {
                console.log(`New Inventory Type! ${inventoryType} ->`);
                console.log(item);
            }
        }

        _initialInventoryUpdate(message){
            if (this.isInitialInventoryPopulated) return;

            const inventoryItems = message['stockpile'];
            const vaultItems = message['vault'];
            const equipment = message['equipment'];

            this._populateInitialItemsStackSize(inventoryItems, 'stockpile');
            this._populateInitialItemsStackSize(vaultItems, 'vault');
            this._populateInitialItemsStackSize(equipment, 'equipment');
            this.isInitialInventoryPopulated = true;
        }

        _populateInitialItemsStackSize(itemDictionary, inventoryType){
            for (const [id, item] of Object.entries(itemDictionary)) {
                let itemSignature = this._getItemSignature(item);
                if (resources[itemSignature] === undefined) resources[itemSignature] = new Resource();
                if (inventoryType === 'stockpile') {
                    resources[itemSignature].initialStockPile = item['stackSize'];
                    resources[itemSignature].currentStockPile = item['stackSize'];
                } else if (inventoryType === 'vault'){
                    resources[itemSignature].initialVault = item['stackSize'];
                    resources[itemSignature].currentVault = item['stackSize'];
                } else if (inventoryType === 'equipment'){
                    // equipment slot can be empty
                    if (itemSignature.length > 0){
                        resources[itemSignature].initialEquipped = item['stackSize'];
                        resources[itemSignature].currentEquipped = item['stackSize'];
                        (this.currentEquipment)[id] = itemSignature;
                    }
                } else console.log(`New Inventory Type! ${inventoryType}`);
            }
        }

        _getItemSignature(item){
            if (item === null) return '';
            let augmentations = item['augmentations'] !== undefined ? item['augmentations'] : 0;
            let enchantmentID = item['enchantmentID'] !== undefined ? item['enchantmentID'] : 0;
            let enchantmentStrength = item['enchantmentStrength'] !== undefined ? item['enchantmentStrength'] : 0;
            return `${item['itemID']}_${augmentations}_${enchantmentID}_${enchantmentStrength}`;
        }

        getItemIdFromSignature(itemSignature){
            return itemSignature.split('_')[0];
        }
    }

    class IdlescapeWebSocket {

        start(){
            let setupSocket = setInterval(()=> {
                if( typeof window.IdlescapeSocket !== "undefined" ){
                    clearInterval(setupSocket);
                    window.IdlescapeSocket.addEventListener('message', (e) => this._socketMessageHandler(e));
                    window.IdlescapeSocket.addEventListener('close', () => this._reconnect());
                    console.log('Resources Tracker Summary: Attached to socket!');
                }
            }, 100);
        }

        _socketMessageHandler(e) {
            let msg = ( (e.data).match(/^[0-9]+(\[.+)$/) || [] )[1];
            if( msg != null ) {
                let msg_parsed = JSON.parse(msg);
                this._parseMessage(msg_parsed);
            }
        }

        _parseMessage(message){
            switch (message[0]){
                case "update player":
                    tracker.parseUpdatePlayerMessage(message);
                    break;
                case "update inventory":
                    tracker.parseUpdateInventoryMessage(message);
                    break;
                default:
                    break;
            }
        }

        _reconnect(){
            console.log("Socket connection closed at "+ new Date().toUTCString());
            window.IdlescapeSocket = undefined;
            this.start();
        }
    }

    class IdlescapeGameData {
        gameResources = {"1":{"name":"Gold","icon":"/images/money_icon.png","class":"gold"},"2":{"name":"Heat","icon":"/images/heat_icon.png","class":"heat"},"3":{"name":"Air Essence","icon":"/images/runecrafting/air_essence.png","class":"rune"},"4":{"name":"Earth Essence","icon":"/images/runecrafting/earth_essence.png","class":"rune"},"5":{"name":"Fire Essence","icon":"/images/runecrafting/fire_essence.png","class":"rune"},"6":{"name":"Water Essence","icon":"/images/runecrafting/water_essence.png","class":"rune"},"7":{"name":"Blood Essence","icon":"/images/runecrafting/blood_essence.png","class":"rune"},"8":{"name":"Death Essence","icon":"/images/runecrafting/death_essence.png","class":"rune"},"9":{"name":"Chaos Essence","icon":"/images/runecrafting/chaos_essence.png","class":"rune"},"10":{"name":"Nature Essence","icon":"/images/runecrafting/nature_essence.png","class":"rune"},"11":{"name":"Mind Essence","icon":"/images/runecrafting/mind_essence.png","class":"rune"},"12":{"name":"Cosmic Essence","icon":"/images/runecrafting/cosmic_essence.png","class":"rune"},"50":{"name":"Book","icon":"/images/misc/book.png","class":"gem"},"60":{"name":"Raw Shrimp","icon":"/images/fishing/raw_shrimp.png","class":"fish"},"61":{"name":"Raw Anchovy","icon":"/images/fishing/raw_anchovy.png","class":"fish"},"62":{"name":"Raw Trout","icon":"/images/fishing/raw_trout.png","class":"fish"},"63":{"name":"Raw Salmon","icon":"/images/fishing/raw_salmon.png","class":"fish"},"64":{"name":"Raw Lobster","icon":"/images/fishing/raw_lobster.png","class":"fish"},"65":{"name":"Raw Tuna","icon":"/images/fishing/raw_tuna.png","class":"fish"},"66":{"name":"Raw Shark","icon":"/images/fishing/raw_shark.png","class":"fish"},"95":{"name":"Burnt Fish","icon":"/images/cooking/burnt_fish.png","class":"cookedFish"},"96":{"name":"Burnt Food","icon":"/images/cooking/burnt_food.png","class":"cookedFish"},"101":{"name":"Copper Ore","icon":"/images/mining/copper_ore.png","class":"ore"},"102":{"name":"Tin Ore","icon":"/images/mining/tin_ore.png","class":"ore"},"103":{"name":"Iron Ore","icon":"/images/mining/iron_ore.png","class":"ore"},"104":{"name":"Gold Ore","icon":"/images/mining/gold_ore.png","class":"ore"},"105":{"name":"Mithril Ore","icon":"/images/mining/mithril_ore.png","class":"ore"},"106":{"name":"Adamantite Ore","icon":"/images/mining/adamantite_ore.png","class":"ore"},"107":{"name":"Runite Ore","icon":"/images/mining/runite_ore.png","class":"ore"},"108":{"name":"Clay","icon":"/images/mining/clay.png","class":"ore"},"109":{"name":"Stone","icon":"/images/mining/stone.png","class":"ore"},"110":{"name":"Sand","icon":"/images/mining/sand.png","class":"ore"},"111":{"name":"Silver","icon":"/images/mining/silver.png","class":"ore"},"112":{"name":"Coal","icon":"/images/mining/coal.png","class":"ore"},"113":{"name":"Rune Slate","icon":"/images/runecrafting/rune_slate.png","class":"ore"},"114":{"name":"Stygian Ore","icon":"/images/mining/stygian_ore.png","class":"ore"},"150":{"name":"Fertilizer","icon":"/images/farming/fertilizer.png","class":"seed"},"151":{"name":"Carrot Seed","icon":"/images/farming/carrot_seed.png","class":"seed"},"152":{"name":"Peppercorn Seed","icon":"/images/farming/peppercorn_seed.png","class":"seed"},"153":{"name":"Sugarcane Seed","icon":"/images/farming/sugarcane_seed.png","class":"seed"},"154":{"name":"Wheat Seed","icon":"/images/farming/wheat_seed.png","class":"seed"},"155":{"name":"Potato Seed","icon":"/images/farming/potato_seed.png","class":"seed"},"156":{"name":"Rice Seed","icon":"/images/farming/rice_seed.png","class":"seed"},"157":{"name":"Tomato Seed","icon":"/images/farming/tomato_seed.png","class":"seed"},"158":{"name":"Wildberry Bush Seed","icon":"/images/farming/wildberry_bush_seed.png","class":"seed"},"159":{"name":"Chili Pepper Seed","icon":"/images/farming/chili_pepper_seed.png","class":"seed"},"160":{"name":"Pumpkin Seed","icon":"/images/farming/pumpkin_seed.png","class":"seed"},"161":{"name":"Mushroom Spore","icon":"/images/farming/mushroom_spore.png","class":"seed"},"170":{"name":"Tree Seed","icon":"/images/farming/tree_seed.png","class":"seed"},"171":{"name":"Oak Tree Seed","icon":"/images/farming/oak_tree_seed.png","class":"seed"},"172":{"name":"Willow Tree Seed","icon":"/images/farming/willow_tree_seed.png","class":"seed"},"173":{"name":"Maple Tree Seed","icon":"/images/farming/maple_tree_seed.png","class":"seed"},"174":{"name":"Yew Tree Seed","icon":"/images/farming/yew_tree_seed.png","class":"seed"},"175":{"name":"Banana Tree Seed","icon":"/images/farming/banana_tree_seed.png","class":"seed"},"176":{"name":"Apple Tree Seed","icon":"/images/farming/apple_tree_seed.png","class":"seed"},"177":{"name":"Elder Tree Seed","icon":"/images/farming/elder_tree_seed.png","class":"seed"},"180":{"name":"Sageberry Bush Seed","icon":"/images/farming/sageberry_seed.png","class":"seed"},"185":{"name":"Mysterious Seed","icon":"/images/farming/mysterious_seed.png","class":"seed"},"201":{"name":"Bronze Bar","icon":"/images/smithing/bronze_bar.png","class":"bar"},"202":{"name":"Iron Bar","icon":"/images/smithing/iron_bar.png","class":"bar"},"203":{"name":"Gold Bar","icon":"/images/smithing/gold_bar.png","class":"bar"},"204":{"name":"Mithril Bar","icon":"/images/smithing/mithril_bar.png","class":"bar"},"205":{"name":"Adamantite Bar","icon":"/images/smithing/adamantite_bar.png","class":"bar"},"206":{"name":"Runite Bar","icon":"/images/smithing/runite_bar.png","class":"bar"},"207":{"name":"Stygian Bar","icon":"/images/smithing/stygian_bar.png","class":"bar"},"301":{"name":"Branch","icon":"/images/foraging/branch.png","class":"log"},"302":{"name":"Log","icon":"/images/foraging/log.png","class":"log"},"303":{"name":"Oak Log","icon":"/images/foraging/oak_log.png","class":"log"},"304":{"name":"Willow Log","icon":"/images/foraging/willow_log.png","class":"log"},"305":{"name":"Maple Log","icon":"/images/foraging/maple_log.png","class":"log"},"306":{"name":"Yew Log","icon":"/images/foraging/yew_log.png","class":"log"},"400":{"name":"Sapphire","icon":"/images/mining/sapphire.png","class":"gem"},"401":{"name":"Emerald","icon":"/images/mining/emerald.png","class":"gem"},"402":{"name":"Ruby","icon":"/images/mining/ruby.png","class":"gem"},"403":{"name":"Diamond","icon":"/images/mining/diamond.png","class":"gem"},"404":{"name":"Black Opal","icon":"/images/mining/black_opal.png","class":"gem"},"500":{"name":"Air Talisman","icon":"/images/runecrafting/air_talisman.png","class":"rune"},"501":{"name":"Earth Talisman","icon":"/images/runecrafting/earth_talisman.png","class":"rune"},"502":{"name":"Fire Talisman","icon":"/images/runecrafting/fire_talisman.png","class":"rune"},"503":{"name":"Water Talisman","icon":"/images/runecrafting/water_talisman.png","class":"rune"},"504":{"name":"Blood Talisman","icon":"/images/runecrafting/blood_talisman.png","class":"rune"},"505":{"name":"Death Talisman","icon":"/images/runecrafting/death_talisman.png","class":"rune"},"506":{"name":"Chaos Talisman","icon":"/images/runecrafting/chaos_talisman.png","class":"rune"},"507":{"name":"Nature Talisman","icon":"/images/runecrafting/nature_talisman.png","class":"rune"},"508":{"name":"Mind Talisman","icon":"/images/runecrafting/mind_talisman.png","class":"rune"},"509":{"name":"Cosmic Talisman","icon":"/images/runecrafting/cosmic_talisman.png","class":"rune"},"510":{"name":"Air Rune","icon":"/images/runecrafting/air_rune.png","class":"rune"},"511":{"name":"Earth Rune","icon":"/images/runecrafting/earth_rune.png","class":"rune"},"512":{"name":"Fire Rune","icon":"/images/runecrafting/fire_rune.png","class":"rune"},"513":{"name":"Water Rune","icon":"/images/runecrafting/water_rune.png","class":"rune"},"514":{"name":"Blood Rune","icon":"/images/runecrafting/blood_rune.png","class":"rune"},"515":{"name":"Death Rune","icon":"/images/runecrafting/death_rune.png","class":"rune"},"516":{"name":"Chaos Rune","icon":"/images/runecrafting/chaos_rune.png","class":"rune"},"517":{"name":"Nature Rune","icon":"/images/runecrafting/nature_rune.png","class":"rune"},"518":{"name":"Mind Rune","icon":"/images/runecrafting/mind_rune.png","class":"rune"},"519":{"name":"Cosmic Rune","icon":"/images/runecrafting/cosmic_rune.png","class":"rune"},"600":{"name":"Bronze Pickaxe","icon":"/images/mining/bronze_pickaxe.png","class":"equipment"},"601":{"name":"Iron Pickaxe","icon":"/images/mining/iron_pickaxe.png","class":"equipment"},"602":{"name":"Mithril Pickaxe","icon":"/images/mining/mithril_pickaxe.png","class":"equipment"},"603":{"name":"Adamantite Pickaxe","icon":"/images/mining/adamantite_pickaxe.png","class":"equipment"},"604":{"name":"Runite Pickaxe","icon":"/images/mining/rune_pickaxe.png","class":"equipment"},"605":{"name":"Stygian Pickaxe","icon":"/images/mining/stygian_pickaxe.png","class":"equipment"},"610":{"name":"Bronze Hatchet","icon":"/images/foraging/bronze_hatchet.png","class":"equipment"},"611":{"name":"Iron Hatchet","icon":"/images/foraging/iron_hatchet.png","class":"equipment"},"612":{"name":"Mithril Hatchet","icon":"/images/foraging/mithril_hatchet.png","class":"equipment"},"613":{"name":"Adamantite Hatchet","icon":"/images/foraging/adamantite_hatchet.png","class":"equipment"},"614":{"name":"Runite Hatchet","icon":"/images/foraging/rune_hatchet.png","class":"equipment"},"615":{"name":"Stygian Hatchet","icon":"/images/foraging/stygian_hatchet.png","class":"equipment"},"620":{"name":"Sapphire Ring","icon":"/images/jewellery/sapphire_ring.png","class":"equipment"},"621":{"name":"Sapphire Necklace","icon":"/images/jewellery/sapphire_necklace.png","class":"equipment"},"622":{"name":"Emerald Ring","icon":"/images/jewellery/emerald_ring.png","class":"equipment"},"623":{"name":"Emerald Necklace","icon":"/images/jewellery/emerald_necklace.png","class":"equipment"},"624":{"name":"Ruby Ring","icon":"/images/jewellery/ruby_ring.png","class":"equipment"},"625":{"name":"Ruby Necklace","icon":"/images/jewellery/ruby_necklace.png","class":"equipment"},"626":{"name":"Diamond Ring","icon":"/images/jewellery/diamond_ring.png","class":"equipment"},"627":{"name":"Diamond Necklace","icon":"/images/jewellery/diamond_necklace.png","class":"equipment"},"628":{"name":"Prismatic Necklace","icon":"/images/jewellery/prismatic_necklace.png","class":"equipment"},"629":{"name":"Prismatic Ring","icon":"/images/jewellery/prismatic_ring.png","class":"equipment"},"630":{"name":"Black Opal Ring","icon":"/images/jewellery/black_opal_ring.png","class":"equipment"},"631":{"name":"Black Opal Necklace","icon":"/images/jewellery/black_opal_necklace.png","class":"equipment"},"640":{"name":"Gold Ring","icon":"/images/jewellery/gold_ring.png","class":"equipment"},"641":{"name":"Gold Necklace","icon":"/images/jewellery/gold_necklace.png","class":"equipment"},"642":{"name":"Corrupted Ring","icon":"/images/jewellery/corrupted_ring.png","class":"equipment"},"660":{"name":"Bronze Hoe","icon":"/images/farming/bronze_hoe.png","class":"equipment"},"661":{"name":"Iron Hoe","icon":"/images/farming/iron_hoe.png","class":"equipment"},"662":{"name":"Mithril Hoe","icon":"/images/farming/mithril_hoe.png","class":"equipment"},"663":{"name":"Adamantite Hoe","icon":"/images/farming/adamantite_hoe.png","class":"equipment"},"664":{"name":"Runite Hoe","icon":"/images/farming/runite_hoe.png","class":"equipment"},"665":{"name":"Stygian Hoe","icon":"/images/farming/stygian_hoe.png","class":"equipment"},"690":{"name":"Fishing Net","icon":"/images/fishing/net.png","class":"fish"},"691":{"name":"Fly Fishing Rod","icon":"/images/fishing/fishing_rod.png","class":"fish"},"692":{"name":"Cage","icon":"/images/fishing/fishing_cage_2.png","class":"fish"},"693":{"name":"Harpoon","icon":"/images/fishing/harpoon.png","class":"fish"},"700":{"name":"Feather","icon":"images/fishing/feather.png","class":"fish"},"701":{"name":"Fish Oil","icon":"/images/cooking/fish_oil.png","class":"cookedFish"},"702":{"name":"Pyre Log","icon":"/images/foraging/pyre.png","class":"log"},"703":{"name":"Pyre Oak Log","icon":"/images/foraging/oak_pyre.png","class":"log"},"704":{"name":"Pyre Willow Log","icon":"/images/foraging/willow_pyre.png","class":"log"},"705":{"name":"Pyre Maple Log","icon":"/images/foraging/maple_pyre.png","class":"log"},"706":{"name":"Pyre Yew Log","icon":"/images/foraging/yew_pyre.png","class":"log"},"800":{"name":"Ichor","icon":"/images/smithing/ichor.png","class":"bar"},"900":{"name":"Geode","icon":"/images/misc/geode.png","class":"gem"},"901":{"name":"Bird's Nest","icon":"/images/misc/bird_nest.png","class":"gem"},"902":{"name":"Sunken Treasure","icon":"/images/misc/sunken_treasure.png","class":"gem"},"903":{"name":"Satchel","icon":"/images/misc/satchel.png","class":"gem"},"1000":{"name":"Bronze Scimitar","icon":"/images/combat/equipment/bronze_scimitar_icon.png","class":"equipment"},"1001":{"name":"Bronze Battleaxe","icon":"/images/combat/equipment/bronze_battleaxe_icon.png","class":"equipment"},"1002":{"name":"Bronze Daggers","icon":"/images/combat/equipment/bronze_daggers_icon.png","class":"equipment"},"1003":{"name":"Bronze Greatsword","icon":"/images/combat/equipment/bronze_2h_sword_icon.png","class":"equipment"},"1004":{"name":"Iron Scimitar","icon":"/images/combat/equipment/iron_scimitar_icon.png","class":"equipment"},"1005":{"name":"Iron Battleaxe","icon":"/images/combat/equipment/iron_battleaxe_icon.png","class":"equipment"},"1006":{"name":"Iron Daggers","icon":"/images/combat/equipment/iron_daggers_icon.png","class":"equipment"},"1007":{"name":"Iron Greatsword","icon":"/images/combat/equipment/iron_2h_sword_icon.png","class":"equipment"},"1008":{"name":"Obsidian Scimitar","icon":"/images/combat/equipment/black_scimitar_icon.png","class":"equipment"},"1009":{"name":"Obsidian Battleaxe","icon":"/images/combat/equipment/black_battleaxe_icon.png","class":"equipment"},"1010":{"name":"Obsidian Daggers","icon":"/images/combat/equipment/black_daggers_icon.png","class":"equipment"},"1011":{"name":"Obsidian Greatsword","icon":"/images/combat/equipment/black_2h_sword_icon.png","class":"equipment"},"1012":{"name":"Mithril Scimitar","icon":"/images/combat/equipment/mithril_scimitar_icon.png","class":"equipment"},"1013":{"name":"Mithril Battleaxe","icon":"/images/combat/equipment/mithril_battleaxe_icon.png","class":"equipment"},"1014":{"name":"Mithril Daggers","icon":"/images/combat/equipment/mithril_daggers_icon.png","class":"equipment"},"1015":{"name":"Mithril Greatsword","icon":"/images/combat/equipment/mithril_2h_sword_icon.png","class":"equipment"},"1016":{"name":"Adamantite Scimitar","icon":"/images/combat/equipment/adamantite_scimitar_icon.png","class":"equipment"},"1017":{"name":"Adamantite Battleaxe","icon":"/images/combat/equipment/adamantite_battleaxe_icon.png","class":"equipment"},"1018":{"name":"Adamantite Daggers","icon":"/images/combat/equipment/adamantite_daggers_icon.png","class":"equipment"},"1019":{"name":"Adamantite Greatsword","icon":"/images/combat/equipment/adamantite_2h_sword_icon.png","class":"equipment"},"1020":{"name":"Runite Scimitar","icon":"/images/combat/equipment/rune_scimitar_icon.png","class":"equipment"},"1021":{"name":"Runite Battleaxe","icon":"/images/combat/equipment/rune_battleaxe_icon.png","class":"equipment"},"1022":{"name":"Runite Daggers","icon":"/images/combat/equipment/rune_daggers_icon.png","class":"equipment"},"1023":{"name":"Runite Greatsword","icon":"/images/combat/equipment/rune_2h_sword_icon.png","class":"equipment"},"1024":{"name":"Stygian Scimitar","icon":"/images/combat/equipment/stygian_scimitar_icon.png","class":"equipment"},"1025":{"name":"Stygian Battleaxe","icon":"/images/combat/equipment/stygian_battleaxe_icon.png","class":"equipment"},"1026":{"name":"Stygian Daggers","icon":"/images/combat/equipment/stygian_daggers_icon.png","class":"equipment"},"1027":{"name":"Stygian Greatsword","icon":"/images/combat/equipment/stygian_2h_sword_icon.png","class":"equipment"},"1050":{"name":"Bronze Helm","icon":"/images/combat/equipment/bronze_med_helm_icon.png","class":"equipment"},"1051":{"name":"Iron Helm","icon":"/images/combat/equipment/iron_med_helm_icon.png","class":"equipment"},"1052":{"name":"Obsidian Helm","icon":"/images/combat/equipment/black_med_helm_icon.png","class":"equipment"},"1053":{"name":"Mithril Helm","icon":"/images/combat/equipment/mithril_med_helm_icon.png","class":"equipment"},"1054":{"name":"Adamantite Helm","icon":"/images/combat/equipment/adamantite_med_helm_icon.png","class":"equipment"},"1055":{"name":"Runite Helm","icon":"/images/combat/equipment/rune_med_helm_icon.png","class":"equipment"},"1056":{"name":"Stygian Helm","icon":"/images/combat/equipment/stygian_med_helm_icon.png","class":"equipment"},"1060":{"name":"Bronze Full Helm","icon":"/images/combat/equipment/bronze_full_helm.png","class":"equipment"},"1061":{"name":"Iron Full Helm","icon":"/images/combat/equipment/iron_full_helm.png","class":"equipment"},"1062":{"name":"Obsidian Full Helm","icon":"/images/combat/equipment/black_full_helm.png","class":"equipment"},"1063":{"name":"Mithril Full Helm","icon":"/images/combat/equipment/mithril_full_helm.png","class":"equipment"},"1064":{"name":"Adamantite Full Helm","icon":"/images/combat/equipment/adamantite_full_helm.png","class":"equipment"},"1065":{"name":"Runite Full Helm","icon":"/images/combat/equipment/rune_full_helm.png","class":"equipment"},"1066":{"name":"Stygian Full Helm","icon":"/images/combat/equipment/stygian_full_helm.png","class":"equipment"},"1070":{"name":"Bronze Shield","icon":"/images/combat/equipment/bronze_shield_icon.png","class":"equipment"},"1071":{"name":"Iron Shield","icon":"/images/combat/equipment/iron_shield_icon.png","class":"equipment"},"1072":{"name":"Obsidian Shield","icon":"/images/combat/equipment/black_shield_icon.png","class":"equipment"},"1073":{"name":"Mithril Shield","icon":"/images/combat/equipment/mithril_shield_icon.png","class":"equipment"},"1074":{"name":"Adamantite Shield","icon":"/images/combat/equipment/adamantite_shield_icon.png","class":"equipment"},"1075":{"name":"Runite Shield","icon":"/images/combat/equipment/rune_shield_icon.png","class":"equipment"},"1076":{"name":"Stygian Shield","icon":"/images/combat/equipment/stygian_shield_icon.png","class":"equipment"},"1090":{"name":"Bronze Breastplate","icon":"/images/combat/equipment/bronze_platebody.png","class":"equipment"},"1091":{"name":"Bronze Chainmail","icon":"/images/combat/equipment/bronze_chainbody.png","class":"equipment"},"1092":{"name":"Iron Breastplate","icon":"/images/combat/equipment/iron_platebody.png","class":"equipment"},"1093":{"name":"Iron Chainmail","icon":"/images/combat/equipment/iron_chainbody.png","class":"equipment"},"1094":{"name":"Obsidian Breastplate","icon":"/images/combat/equipment/black_platebody.png","class":"equipment"},"1095":{"name":"Obsidian Chainmail","icon":"/images/combat/equipment/black_chainbody.png","class":"equipment"},"1096":{"name":"Mithril Breastplate","icon":"/images/combat/equipment/mithril_platebody.png","class":"equipment"},"1097":{"name":"Mithril Chainmail","icon":"/images/combat/equipment/mithril_chainbody.png","class":"equipment"},"1098":{"name":"Adamantite Breastplate","icon":"/images/combat/equipment/adamantite_platebody.png","class":"equipment"},"1099":{"name":"Adamantite Chainmail","icon":"/images/combat/equipment/adamantite_chainbody.png","class":"equipment"},"1100":{"name":"Runite Breastplate","icon":"/images/combat/equipment/rune_platebody.png","class":"equipment"},"1101":{"name":"Runite Chainmail","icon":"/images/combat/equipment/rune_chainbody.png","class":"equipment"},"1102":{"name":"Stygian Breastplate","icon":"/images/combat/equipment/stygian_platebody.png","class":"equipment"},"1103":{"name":"Stygian Chainmail","icon":"/images/combat/equipment/stygian_chainbody.png","class":"equipment"},"1110":{"name":"Bronze Plate Leggings","icon":"/images/combat/equipment/bronze_platelegs.png","class":"equipment"},"1111":{"name":"Iron Plate Leggings","icon":"/images/combat/equipment/iron_platelegs.png","class":"equipment"},"1112":{"name":"Obsidian Plate Leggings","icon":"/images/combat/equipment/black_platelegs.png","class":"equipment"},"1113":{"name":"Mithril Plate Leggings","icon":"/images/combat/equipment/mithril_platelegs.png","class":"equipment"},"1114":{"name":"Adamantite Plate Leggings","icon":"/images/combat/equipment/adamantite_platelegs.png","class":"equipment"},"1115":{"name":"Runite Plate Leggings","icon":"/images/combat/equipment/rune_platelegs.png","class":"equipment"},"1116":{"name":"Stygian Plate Leggings","icon":"/images/combat/equipment/stygian_platelegs.png","class":"equipment"},"1130":{"name":"Bronze Boots","icon":"/images/combat/equipment/bronze_boots_icon.png","class":"equipment"},"1131":{"name":"Iron Boots","icon":"/images/combat/equipment/iron_boots_icon.png","class":"equipment"},"1132":{"name":"Obsidian Boots","icon":"/images/combat/equipment/black_boots_icon.png","class":"equipment"},"1133":{"name":"Mithril Boots","icon":"/images/combat/equipment/mithril_boots_icon.png","class":"equipment"},"1134":{"name":"Adamantite Boots","icon":"/images/combat/equipment/adamantite_boots_icon.png","class":"equipment"},"1135":{"name":"Runite Boots","icon":"/images/combat/equipment/rune_boots_icon.png","class":"equipment"},"1136":{"name":"Stygian Boots","icon":"/images/combat/equipment/stygian_boots_icon.png","class":"equipment"},"1150":{"name":"Bronze Gloves","icon":"/images/combat/equipment/bronze_gloves.png","class":"equipment"},"1151":{"name":"Iron Gloves","icon":"/images/combat/equipment/iron_gloves.png","class":"equipment"},"1152":{"name":"Obsidian Gloves","icon":"/images/combat/equipment/black_gloves.png","class":"equipment"},"1153":{"name":"Mithril Gloves","icon":"/images/combat/equipment/mithril_gloves.png","class":"equipment"},"1154":{"name":"Adamantite Gloves","icon":"/images/combat/equipment/adamantite_gloves.png","class":"equipment"},"1155":{"name":"Runite Gloves","icon":"/images/combat/equipment/rune_gloves.png","class":"equipment"},"1156":{"name":"Stygian Gloves","icon":"/images/combat/equipment/stygian_gloves.png","class":"equipment"},"1500":{"name":"Santa Hat","icon":"/images/combat/equipment/santa_hat.png","class":"equipment"},"1501":{"name":"Snowman Head","icon":"/images/combat/equipment/snowman_head.png","class":"equipment"},"1502":{"name":"Tophat","icon":"/images/combat/equipment/tophat.png","class":"equipment"},"1503":{"name":"Lesser Ladle","icon":"/images/combat/equipment/lesser_ladle.png","class":"equipment"},"1504":{"name":"Ladle","icon":"/images/combat/equipment/ladle.png","class":"equipment"},"1505":{"name":"Greater Ladle","icon":"/images/combat/equipment/greater_ladle.png","class":"equipment"},"1506":{"name":"Moss Maul","icon":"/images/combat/equipment/moss_maul_icon.png","class":"equipment"},"1507":{"name":"Modified Diving Gloves","icon":"/images/combat/equipment/modified_diving_gloves_icon.png","class":"equipment"},"1508":{"name":"King's Crown","icon":"/images/combat/equipment/kings_crown.png","class":"equipment"},"1509":{"name":"Fire Orb","icon":"/images/combat/equipment/fire_orb.png","class":"equipment"},"1510":{"name":"Kalanahmatti","icon":"/images/combat/equipment/kalanahmatti.png","class":"bar"},"1511":{"name":"Shard of Kalanahmatti","icon":"/images/combat/equipment/shard_of_kalanahmatti_icon.png","class":"equipment"},"1512":{"name":"Zero Edge","icon":"/images/combat/equipment/zero_edge_icon.png","class":"equipment"},"1513":{"name":"Crest of Chaos","icon":"/images/combat/equipment/crest_of_chaos_icon.png","class":"equipment"},"1514":{"name":"Forgotten Soul","icon":"/images/combat/equipment/forgotten-soul-sad-icon.png","class":"equipment"},"1515":{"name":"Forgotten Soul","icon":"/images/combat/equipment/forgotten-soul-crazy-icon.png","class":"equipment"},"1516":{"name":"Forgotten Soul","icon":"/images/combat/equipment/forgotten-soul-mad-icon.png","class":"equipment"},"1517":{"name":"Gargoyle Chainmail","icon":"/images/combat/equipment/gargoyle_chain.png","class":"equipment"},"1518":{"name":"Gargoyle Legs","icon":"/images/combat/equipment/gargoyle_pants.png","class":"equipment"},"1519":{"name":"Gargoyle Boots","icon":"/images/combat/equipment/gargoyle_boots_icon.png","class":"equipment"},"1520":{"name":"Gargoyle Helm","icon":"/images/combat/equipment/gargoyle_helm_icon.png","class":"equipment"},"1521":{"name":"Gargoyle Shield","icon":"/images/combat/equipment/gargoyle_shield_1.png","class":"equipment"},"1522":{"name":"Gargoyle Falchion","icon":"/images/combat/equipment/gargoyle_falcion_icon.png","class":"equipment"},"1523":{"name":"Gargoyle Daggers","icon":"/images/combat/equipment/dagger_gargoyle_icon.png","class":"equipment"},"1524":{"name":"Gargoyle Glaive","icon":"/images/combat/equipment/gargoyle_glaive_icon.png","class":"equipment"},"1525":{"name":"Infernal Lance","icon":"/images/combat/equipment/infernal_lance_icon.png","class":"equipment"},"1526":{"name":"Black Knight Great Helm","icon":"/images/combat/equipment/black_black_knight_great_helm_icon.png","class":"equipment"},"1527":{"name":"Chorus of Souls","icon":"/images/combat/equipment/chorus_of_souls_icon.png","class":"equipment"},"1528":{"name":"Decayed Cloak","icon":"/images/combat/equipment/decayed_cloak_hood.png","class":"equipment"},"1530":{"name":"Mysterious Man","icon":"/images/combat/equipment/hatcontest_mysterious_man_icon.png","class":"equipment"},"1531":{"name":"Corny Joke","icon":"/images/combat/equipment/hatcontest_cornyjoke_icon.png","class":"equipment"},"1532":{"name":"Death Metal Wig","icon":"/images/combat/equipment/hatcontest_death_metal_wig_icon.png","class":"equipment"},"1540":{"name":"Shrimp Carapace","icon":"/images/combat/equipment/shrimp_armor_icon.png","class":"equipment"},"1541":{"name":"Shrimp Greaves","icon":"/images/combat/equipment/shrimp_pants.png","class":"equipment"},"1542":{"name":"Shrimp Helm","icon":"/images/combat/equipment/shrimp_helm_icon.png","class":"equipment"},"1543":{"name":"Shrimp Shell","icon":"/images/combat/equipment/shrimp_shield_icon.png","class":"equipment"},"1544":{"name":"Naga's Bracelet","icon":"/images/combat/equipment/nagas_bracelet.png","class":"equipment"},"1600":{"name":"Scroll","icon":"/images/enchanting/scroll.png","class":"enchanted-scroll"},"1601":{"name":"Scroll of Embers","icon":"/images/enchanting/scroll_of_embers.png","class":"enchanted-scroll"},"1602":{"name":"Scroll of the Prospector","icon":"/images/enchanting/scroll_of_the_prospector.png","class":"enchanted-scroll"},"1603":{"name":"Scroll of the Scholar","icon":"/images/enchanting/scroll_of_the_scholar.png","class":"enchanted-scroll"},"1604":{"name":"Scroll of Gathering","icon":"/images/enchanting/scroll_of_gathering.png","class":"enchanted-scroll"},"1605":{"name":"Scroll of Superheating","icon":"/images/enchanting/scroll_of_superheating.png","class":"enchanted-scroll"},"1606":{"name":"Scroll of Pyromancy","icon":"/images/enchanting/scroll_of_pyromancy.png","class":"enchanted-scroll"},"1607":{"name":"Scroll of Wealth","icon":"/images/enchanting/scroll_of_wealth.png","class":"enchanted-scroll"},"1608":{"name":"Scroll of Haste","icon":"/images/enchanting/scroll_of_haste.png","class":"enchanted-scroll"},"1609":{"name":"Scroll of Naturalist","icon":"/images/enchanting/scroll_of_naturalist_v2.png","class":"enchanted-scroll"},"1610":{"name":"Scroll of Acrobatics","icon":"/images/enchanting/scroll_of_naturalist_v2.png","class":"enchanted-scroll"},"1611":{"name":"Scroll of Critical Strike","icon":"/images/enchanting/scroll_of_critical_strike.png","class":"enchanted-scroll"},"1612":{"name":"Scroll of Poisoning","icon":"/images/enchanting/scroll_of_naturalist_v2.png","class":"enchanted-scroll"},"1613":{"name":"Scroll of Accuracy","icon":"/images/enchanting/scroll_of_critical_strike.png","class":"enchanted-scroll"},"1614":{"name":"Scroll of Deflect","icon":"/images/enchanting/scroll_of_naturalist_v2.png","class":"enchanted-scroll"},"1615":{"name":"Scroll of Force","icon":"/images/enchanting/scroll_of_force.png","class":"enchanted-scroll"},"1616":{"name":"Scroll of Healing","icon":"/images/enchanting/scroll_of_healing.png","class":"enchanted-scroll"},"1617":{"name":"Scroll of Weakening","icon":"/images/enchanting/scroll_of_weakening.png","class":"enchanted-scroll"},"1618":{"name":"Scroll of Reinforcement","icon":"/images/enchanting/scroll_of_reinforcement.png","class":"enchanted-scroll"},"1619":{"name":"Scroll of Protection","icon":"/images/enchanting/scroll_of_reinforcement.png","class":"enchanted-scroll"},"1620":{"name":"Scroll of Counterattack","icon":"/images/enchanting/scroll_of_naturalist_v2.png","class":"enchanted-scroll"},"1621":{"name":"Scroll of Recklessness","icon":"/images/enchanting/scroll_of_recklessness.png","class":"enchanted-scroll"},"1622":{"name":"Scroll of Efficiency","icon":"/images/enchanting/scroll_of_efficiency.png","class":"enchanted-scroll"},"1623":{"name":"Scroll of Fishing","icon":"/images/enchanting/scroll_of_fishing.png","class":"enchanted-scroll"},"1624":{"name":"Scroll of Cooking","icon":"/images/enchanting/scroll_of_cooking.png","class":"enchanted-scroll"},"1625":{"name":"Scroll of Crafting","icon":"/images/enchanting/scroll_of_efficiency.png","class":"enchanted-scroll"},"1626":{"name":"Scroll of Refining","icon":"/images/enchanting/scroll_of_refining.png","class":"enchanted-scroll"},"1627":{"name":"Scroll of Runecrafting","icon":"/images/enchanting/scroll_of_runecrafting.png","class":"enchanted-scroll"},"1628":{"name":"Scroll of Chances","icon":"/images/enchanting/scroll_of_chances.png","class":"enchanted-scroll"},"1629":{"name":"Scroll of the Shrimp Lord","icon":"/images/enchanting/scroll_of_the_shrimp_lord.png","class":"enchanted-scroll"},"1630":{"name":"Scroll of Enlightenment","icon":"/images/enchanting/scroll_of_enlightment.png","class":"enchanted-scroll"},"1631":{"name":"Scroll of Prolonging","icon":"/images/enchanting/scroll_of_boosting.png","class":"enchanted-scroll"},"1632":{"name":"Scroll of the Treasure Hunter","icon":"/images/enchanting/scroll_of_treasure_hunter.png","class":"enchanted-scroll"},"1633":{"name":"Scroll of Inferno","icon":"/images/enchanting/scroll_of_inferno.png","class":"enchanted-scroll"},"1634":{"name":"Scroll of Destructive Testing","icon":"/images/enchanting/scroll_of_destructive_testing.png","class":"enchanted-scroll"},"1635":{"name":"Scroll of Nature","icon":"/images/enchanting/scroll_of_the_nature.png","class":"enchanted-scroll"},"1636":{"name":"Scroll of Root Digging","icon":"/images/enchanting/scroll_of_root_digging.png","class":"enchanted-scroll"},"1637":{"name":"Scroll of Patience","icon":"/images/enchanting/scroll_of_patience.png","class":"enchanted-scroll"},"1638":{"name":"Scroll of Overhealing","icon":"/images/enchanting/scroll_of_overhealing.png","class":"enchanted-scroll"},"1639":{"name":"Scroll of Farming","icon":"/images/enchanting/scroll_farming.png","class":"enchanted-scroll"},"1640":{"name":"Scroll of the Gold Digger","icon":"/images/enchanting/scroll_golddigger.png","class":"enchanted-scroll"},"1641":{"name":"Scroll of Fertilizing","icon":"/images/enchanting/scroll_fertilizing.png","class":"enchanted-scroll"},"1642":{"name":"Scroll of Cultivation","icon":"/images/enchanting/scroll_cultivation.png","class":"enchanted-scroll"},"2000":{"name":"Raw Chicken","icon":"/images/cooking/raw_chicken.png","class":"cooking-ingredient"},"2001":{"name":"Raw Beef","icon":"/images/cooking/raw_beef.png","class":"cooking-ingredient"},"2009":{"name":"Spider Legs","icon":"/images/cooking/spider_legs.png","class":"cooking-ingredient"},"2010":{"name":"Goblin Brain","icon":"/images/cooking/goblin_brain.png","class":"cooking-ingredient"},"2012":{"name":"Pepper","icon":"/images/cooking/pepper.png","class":"cooking-ingredient"},"2013":{"name":"Salt","icon":"/images/cooking/salt.png","class":"cooking-ingredient"},"2014":{"name":"Ashes","icon":"/images/cooking/ashes.png","class":"cooking-ingredient"},"2015":{"name":"Sugar","icon":"/images/cooking/sugar.png","class":"cooking-ingredient"},"2016":{"name":"Honey","icon":"/images/cooking/honey.png","class":"cooking-ingredient"},"2017":{"name":"Milk","icon":"/images/cooking/milk.png","class":"cooking-ingredient"},"2018":{"name":"Butter","icon":"/images/cooking/butter.png","class":"cooking-ingredient"},"2019":{"name":"Egg","icon":"/images/cooking/egg.png","class":"cooking-ingredient"},"2020":{"name":"Mushroom","icon":"/images/cooking/mushroom.png","class":"cooking-ingredient"},"2021":{"name":"Carrot","icon":"/images/cooking/carrot.png","class":"cooking-ingredient"},"2022":{"name":"Chili Pepper","icon":"/images/cooking/chili_pepper.png","class":"cooking-ingredient"},"2023":{"name":"Potato","icon":"/images/cooking/potato.png","class":"cooking-ingredient"},"2024":{"name":"Pumpkin","icon":"/images/cooking/pumpkin.png","class":"cooking-ingredient"},"2025":{"name":"Tomato","icon":"/images/cooking/tomato.png","class":"cooking-ingredient"},"2026":{"name":"Apple","icon":"/images/cooking/apple.png","class":"cooking-ingredient"},"2027":{"name":"Wildberry","icon":"/images/cooking/wildberry.png","class":"cooking-ingredient"},"2028":{"name":"Banana","icon":"/images/cooking/banana.png","class":"cooking-ingredient"},"2029":{"name":"Wheat","icon":"/images/cooking/wheat.png","class":"cooking-ingredient"},"2030":{"name":"Rice","icon":"/images/cooking/rice.png","class":"cooking-ingredient"},"2031":{"name":"Sageberry","icon":"/images/farming/sage_berry.png","class":"cooking-ingredient"},"2100":{"name":"Questionable Food","icon":"/images/cooking/questionable_food.png","class":"cooking-ingredient"},"2101":{"name":"Monster Surprise","icon":"/images/cooking/monster_surprise.png","class":"cooking-ingredient"},"2102":{"name":"Seared Steak","icon":"/images/cooking/seared_steak.png","class":"cooking-ingredient"},"2103":{"name":"Seared Fish","icon":"/images/cooking/seared_fish.png","class":"cooking-ingredient"},"2104":{"name":"Seared Poultry","icon":"/images/cooking/seared_bird.png","class":"cooking-ingredient"},"2105":{"name":"Birdie Pasta","icon":"/images/cooking/birdie_pasta.png","class":"cooking-ingredient"},"2106":{"name":"Spaghetti & Meat","icon":"/images/cooking/spaghetti_meat.png","class":"cooking-ingredient"},"2107":{"name":"Sushi","icon":"/images/cooking/sushi.png","class":"cooking-ingredient"},"2108":{"name":"Birdie Pie","icon":"/images/cooking/birdie_pie.png","class":"cooking-ingredient"},"2109":{"name":"Cottage Pie","icon":"/images/cooking/cottage_pie.png","class":"cooking-ingredient"},"2110":{"name":"Fisherman's Pie","icon":"/images/cooking/fisherman_pie.png","class":"cooking-ingredient"},"2111":{"name":"Fruit Pie","icon":"/images/cooking/fruit_pie.png","class":"cooking-ingredient"},"2112":{"name":"Demon Cake","icon":"/images/cooking/demon_cake.png","class":"cooking-ingredient"},"2113":{"name":"Cake","icon":"/images/cooking/cake.png","class":"cooking-ingredient"},"2114":{"name":"Fruit Cake","icon":"/images/cooking/fruit_cake.png","class":"cooking-ingredient"},"2115":{"name":"Grain Cake","icon":"/images/cooking/grain_cake.png","class":"cooking-ingredient"},"2116":{"name":"Omelette","icon":"/images/cooking/omelette.png","class":"cooking-ingredient"},"2117":{"name":"Monster Omelette","icon":"/images/cooking/monster_omelette.png","class":"cooking-ingredient"},"2118":{"name":"Meaty Omelette","icon":"/images/cooking/meat_omelette.png","class":"cooking-ingredient"},"2119":{"name":"Veggie Crepe","icon":"/images/cooking/veggie_crepe.png","class":"cooking-ingredient"},"2120":{"name":"Fruity Crepe","icon":"/images/cooking/fruit_crepe.png","class":"cooking-ingredient"},"2121":{"name":"Eggnog","icon":"/images/cooking/egg_nog.png","class":"cooking-ingredient"},"2122":{"name":"Meat Roast","icon":"/images/cooking/meat_roast.png","class":"cooking-ingredient"},"2123":{"name":"Fried Fruit","icon":"/images/cooking/fried_fruit.png","class":"cooking-ingredient"},"2124":{"name":"Grilled Veggies","icon":"/images/cooking/grilled_veggies.png","class":"cooking-ingredient"},"2125":{"name":"Kebabs","icon":"/images/cooking/kababs.png","class":"cooking-ingredient"},"2126":{"name":"Candied Fruit","icon":"/images/cooking/candied_fruit.png","class":"cooking-ingredient"},"2127":{"name":"Milkshake","icon":"/images/cooking/milkshake.png","class":"cooking-ingredient"},"2128":{"name":"Vegetable Stew","icon":"/images/cooking/veggie_stew.png","class":"cooking-ingredient"},"2129":{"name":"Meaty Stew","icon":"/images/cooking/meaty_stew.png","class":"cooking-ingredient"},"2130":{"name":"Monster Stew","icon":"/images/cooking/monster_stew.png","class":"cooking-ingredient"},"2131":{"name":"Jerky","icon":"/images/cooking/jerky.png","class":"cooking-ingredient"},"2132":{"name":"Pudding","icon":"/images/cooking/pudding.png","class":"cooking-ingredient"},"2133":{"name":"Ice Cream","icon":"/images/cooking/icecream.png","class":"cooking-ingredient"},"2134":{"name":"Monster Curry","icon":"/images/cooking/monster_curry.png","class":"cooking-ingredient"},"2135":{"name":"Birdie Curry","icon":"/images/cooking/birdie_curry.png","class":"cooking-ingredient"},"2136":{"name":"Beast Curry","icon":"/images/cooking/beast_curry.png","class":"cooking-ingredient"},"2137":{"name":"Seafood Curry","icon":"/images/cooking/seafood_curry.png","class":"cooking-ingredient"},"2138":{"name":"Monster Gelato","icon":"/images/cooking/monster_gelato.png","class":"cooking-ingredient"},"5000":{"name":"Shrimp Bauble","icon":"/images/misc/shrimp_bauble.png","class":"key"},"5001":{"name":"Shrimp","icon":"/images/misc/schfftph_fzzglgl.png","class":"fish"},"5002":{"name":"Shrimp Ascendant","icon":"/images/misc/schfftph_fzzglgl_kakfzz.png","class":"fish"},"6000":{"name":"Gold Medal","icon":"/images/ui/highscore_gold.png","class":"gold-medal"},"6001":{"name":"Silver Medal","icon":"/images/ui/highscore_silver.png","class":"silver-medal"},"6002":{"name":"Bronze Medal","icon":"/images/ui/highscore_bronze.png","class":"bronze-medal"},"6950":{"name":"Event Token","icon":"/images/misc/event_token.png","class":"gold-medal"},"7000":{"name":"Snow","icon":"/images/christmas/snow.png","class":"christmas-drop"},"7001":{"name":"Snowball","icon":"/images/christmas/snowball.png","class":"christmas-drop"},"7002":{"name":"Wrapping Paper","icon":"/images/christmas/wrapping_paper.png","class":"christmas-drop"},"7003":{"name":"Present","icon":"/images/christmas/present.png","class":"christmas-present"},"7004":{"name":"Cookie Dough","icon":"/images/christmas/cookie_dough.png","class":"christmas-food"},"7005":{"name":"Cookie","icon":"/images/christmas/cookie.png","class":"christmas-food"},"7006":{"name":"Gummy Fish","icon":"/images/christmas/gummy_fish.png","class":"christmas-drop"},"7007":{"name":"Gummy Shark Fin","icon":"/images/christmas/gummy_shark_fin.png","class":"christmas-drop"},"7008":{"name":"Krampus' Horn","icon":"/images/christmas/krampus_horn.png","class":"christmas-drop"},"7009":{"name":"Candy Buttons","icon":"/images/christmas/candy_buttons.png","class":"christmas-drop"},"7010":{"name":"Scarf","icon":"/images/christmas/scarf.png","class":"christmas-drop"},"7011":{"name":"Evergreen Log","icon":"/images/christmas/evergreen_log.png","class":"christmas-drop"},"7012":{"name":"Corrupted Evergreen Log","icon":"/images/christmas/corrupted_evergreen_log.png","class":"christmas-drop"},"7013":{"name":"Magic Ice","icon":"/images/christmas/magic_ice.png","class":"christmas-drop"},"7014":{"name":"Inferior Bearded Wanderer","icon":"/images/christmas/christmas_helmet.png","class":"christmas-tier1"},"7015":{"name":"Inferior Reindeer Hunters' Armor","icon":"/images/christmas/christmas_chestplate.png","class":"christmas-tier1"},"7016":{"name":"Inferior Reindeer Hunters' Leggings","icon":"/images/christmas/christmas_leggings.png","class":"christmas-tier1"},"7017":{"name":"Inferior Christmas Lights","icon":"/images/christmas/christmas_weapon.png","class":"christmas-tier1"},"7018":{"name":"SuperSled 1337","icon":"/images/christmas/christmas_shield.png","class":"christmas-tier1"},"7019":{"name":"Bearded Wanderer","icon":"/images/christmas/christmas_helmet.png","class":"christmas-tier2"},"7020":{"name":"Reindeer Hunters' Armor","icon":"/images/christmas/christmas_chestplate.png","class":"christmas-tier2"},"7021":{"name":"Reindeer Hunters' Leggings","icon":"/images/christmas/christmas_leggings.png","class":"christmas-tier2"},"7022":{"name":"Christmas Lights","icon":"/images/christmas/christmas_weapon.png","class":"christmas-tier2"},"7023":{"name":"SuperSled 9000","icon":"/images/christmas/christmas_shield.png","class":"christmas-tier2"},"7024":{"name":"Superior Bearded Wanderer","icon":"/images/christmas/christmas_helmet.png","class":"christmas-tier3"},"7025":{"name":"Superior Reindeer Hunters' Armor","icon":"/images/christmas/christmas_chestplate.png","class":"christmas-tier3"},"7026":{"name":"Superior Reindeer Hunters' Leggings","icon":"/images/christmas/christmas_leggings.png","class":"christmas-tier3"},"7027":{"name":"Superior Christmas Lights","icon":"/images/christmas/christmas_weapon.png","class":"christmas-tier3"},"7028":{"name":"SuperSled 9001","icon":"/images/christmas/christmas_shield.png","class":"christmas-tier3"},"7029":{"name":"Magical Snowball","icon":"/images/christmas/magical_snowball.png","class":"equipment"},"7030":{"name":"Candy Cane Daggers","icon":"/images/christmas/candy_cane_daggers_icon.png","class":"equipment"},"7031":{"name":"Festive Shroud","icon":"/images/christmas/festive_shroud_hood.png","class":"equipment"},"7050":{"name":"Snowglobe","icon":"/images/christmas/snowglobe.png","class":"christmas-globe"},"7060":{"name":"Chicken","icon":"/images/combat/monsters/chicken.png","class":"gem"},"8000":{"name":"RISE OF INFO","icon":"/images/misc/Elite_Scroll.png","class":"gem"},"8001":{"name":"Black Knight's Trial","icon":"/images/misc/elite/Elite_Scroll_BK.png","class":"gem"},"8002":{"name":"Giant Scroll","icon":"/images/misc/elite/Elite_Scroll_Giant.png","class":"gem"},"8003":{"name":"Corroded Scroll","icon":"/images/misc/elite/Elite_Scroll_Corroded.png","class":"gem"},"8004":{"name":"Stew Stained Page","icon":"/images/misc/elite/Elite_Scroll_Goblin.png","class":"gem"},"8005":{"name":"Cluster-Cluck","icon":"/images/misc/elite/Elite_Scroll_Chicken.png","class":"gem"},"8006":{"name":"Demonic Trial","icon":"/images/misc/elite/Elite_Scroll_Demon.png","class":"gem"},"8007":{"name":"Taproot Scroll","icon":"/images/misc/elite/Elite_Scroll_Spriggan.png","class":"gem"}};
        enchantments = {"0":{"name":"","buffIcon":"/images/misc/unknown_buff.png"},"1":{"name":"Embers","buffIcon":"/images/magic/buffs/embers_icon.png"},"2":{"name":"Prospector","buffIcon":"/images/magic/buffs/prospector_icon.png"},"3":{"name":"Scholar","buffIcon":"/images/magic/buffs/scholar_icon.png"},"4":{"name":"Gathering","buffIcon":"/images/magic/buffs/gathering_icon.png"},"5":{"name":"Superheating","buffIcon":"/images/magic/buffs/superheated_icon.png"},"6":{"name":"Pyromancy","buffIcon":"/images/magic/buffs/pyromancy.png"},"7":{"name":"Wealth","buffIcon":"/images/magic/buffs/wealth_icon.png"},"8":{"name":"Haste","buffIcon":"/images/magic/buffs/haste_icon.png"},"9":{"name":"Naturalist","buffIcon":"/images/magic/buffs/naturalist_icon.png"},"10":{"name":"Acrobatics","buffIcon":"/images/misc/unknown_buff.png"},"11":{"name":"Critical Strike","buffIcon":"/images/magic/buffs/critical_strike_icon.png"},"12":{"name":"Poisoning","buffIcon":"/images/misc/unknown_buff.png"},"13":{"name":"Accuracy","buffIcon":"/images/magic/buffs/accuracy_icon.png"},"14":{"name":"Deflect","buffIcon":"/images/misc/unknown_buff.png"},"15":{"name":"Force","buffIcon":"/images/magic/buffs/force_icon.png"},"16":{"name":"Healing","buffIcon":"/images/magic/buffs/healing_icon.png"},"17":{"name":"Weakening","buffIcon":"/images/magic/buffs/weakening_icon.png"},"18":{"name":"Reinforcement","buffIcon":"/images/magic/buffs/reinforcement_icon.png"},"19":{"name":"Protection","buffIcon":"/images/magic/buffs/protection_icon.png"},"20":{"name":"Counterattack","buffIcon":"/images/misc/unknown_buff.png"},"21":{"name":"Recklessness","buffIcon":"/images/magic/buffs/recklessness_icon.png"},"22":{"name":"Efficiency","buffIcon":"/images/magic/buffs/efficiency_icon.png"},"23":{"name":"Fishing","buffIcon":"/images/magic/buffs/fishing.png"},"24":{"name":"Cooking","buffIcon":"/images/magic/buffs/cooking_icon.png"},"25":{"name":"Crafting","buffIcon":"/images/magic/buffs/crafting_icon.png"},"26":{"name":"Refining","buffIcon":"/images/magic/buffs/refining_icon.png"},"27":{"name":"Runecrafting","buffIcon":"/images/magic/buffs/runecrafting_icon.png"},"28":{"name":"Chances","buffIcon":"/images/magic/buffs/chances-icon.png"},"29":{"name":"Shrimp Lord","buffIcon":"/images/magic/buffs/shrimlord_icon.png"},"30":{"name":"Enlightenment","buffIcon":"/images/magic/buffs/enlightenment_icon.png"},"31":{"name":"Prolonging","buffIcon":"/images/magic/buffs/prolonging_icon.png"},"32":{"name":"Treasure Hunter","buffIcon":"/images/magic/buffs/treasurehunter_icon.png"},"33":{"name":"Inferno","buffIcon":"/images/magic/buffs/inferno_icon.png"},"34":{"name":"Destructive Testing","buffIcon":"/images/magic/buffs/destructivetesting_icon.png"},"35":{"name":"Nature","buffIcon":"/images/magic/buffs/nature_icon.png"},"36":{"name":"Root Digging","buffIcon":"/images/magic/buffs/rootdigging_icon.png"},"37":{"name":"Patience","buffIcon":"/images/magic/buffs/patience_icon.png"},"38":{"name":"Overhealing","buffIcon":"/images/magic/buffs/overhealing_icon.png"},"39":{"name":"Farming","buffIcon":"/images/magic/buffs/farming_icon.png"},"40":{"name":"Gold Digger","buffIcon":"/images/magic/buffs/golddigger_icon.png"},"41":{"name":"Fertilizing","buffIcon":"/images/magic/buffs/fertilizing_icon.png"},"42":{"name":"Cultivation","buffIcon":"/images/magic/buffs/cultivation_icon.png"},"43":{"name":"Corruption","buffIcon":"/images/magic/buffs/cultivation_icon.png"},"1000":{"name":"Impenetrable Defense","buffIcon":"/images/magic/buffs/impenetrabledefence_icon.png"},"2000":{"name":"Nimble","buffIcon":"/images/magic/buffs/nimble.png"},"2001":{"name":"Demon Skin","buffIcon":"/images/magic/buffs/demon_skin.png"},"2002":{"name":"Intuition","buffIcon":"/images/magic/buffs/xp_increased.png"},"5000":{"name":"schfftph fzzz","buffIcon":"/images/magic/buffs/shrimlord_icon.png"},"7000":{"name":"Christmas Spirit","buffIcon":"/images/christmas/snow.png"},"7001":{"name":"Easter","buffIcon":"/images/cooking/34573r_3gg.png"},"8000":{"name":"Weakness","buffIcon":"/images/magic/buffs/weakening_icon.png"},"8001":{"name":"Corrosion","buffIcon":"/images/magic/buffs/protection_icon.png"},"8002":{"name":"Sick","buffIcon":"/images/magic/buffs/prolonging_icon.png"},"8003":{"name":"Blind","buffIcon":"/images/magic/buffs/accuracy_icon.png"},"8004":{"name":"Stunned","buffIcon":"/images/magic/buffs/patience_icon.png"}};
    }

    class UI {
        _gameData = new IdlescapeGameData();

        setupUI(){
            const buttonId = "rgsTrigger";
            const imageButtonHtml = `<img src="/images/money_icon.png" id="${buttonId}" alt="Resources Tracker" class="header-league-icon">`;
            document.getElementById('usersOnline').insertAdjacentHTML('beforeend', imageButtonHtml);
            let imageButton = document.getElementById(buttonId);
            let that = this;
            imageButton.addEventListener("click",function(){
                that._showSummary();
            },false);
        }

        _showSummary(){
            let now = new Date();
            let elapsedSeconds = (now.getTime() - initialTime.getTime()) / 1000;
            let elapsedTime = this._timeForHumans(elapsedSeconds);

            let trackedResources = [];
            for (const [signature, resource] of Object.entries(resources).sort(function (a,b){return tracker.getItemIdFromSignature(a[0]) - tracker.getItemIdFromSignature(b[0]);})) {
                let gain = resource.gain();
                if (gain !== 0) trackedResources[signature] = gain;
            }

            let itemsHtml = this._generateItemsHtml(trackedResources);
            this._displayPopUp(itemsHtml, elapsedTime);
        }

        _generateItemsHtml(trackedResources){
            let itemsHtml = '';
            for (const [signature, stack] of Object.entries(trackedResources)) {
                let [id, augmentations, enchantmentID] = signature.split('_');
                if (this._gameData.gameResources[id] === undefined) console.log(`can't find id ${id} on the gameResources`);
                let stacksColourClass = stack < 0 ? 'lightred-text' : '';
                let itemStack = this._shortenNumber(stack);

                let itemHtml = `<div class="item ${this._gameData.gameResources[id]['class']}" data-tip="true">`;
                if (augmentations > 0) itemHtml += `<img class="augmentation-glow-background" src="/images/augmentation_glow.png" style="position: absolute;">`;
                itemHtml += `<img src="${this._gameData.gameResources[id]['icon']}" class="item-icon" alt="${this._gameData.gameResources[id]['name']}"><div class="centered ${stacksColourClass}">${itemStack}</div>`;
                if (enchantmentID > 0) itemHtml += `<div class="item-enchant"><img src="${this._gameData.enchantments[enchantmentID]['buffIcon']}"></div>`;
                if (augmentations > 0) itemHtml += `<div class="item-augment" style="color: rgb(227, 251, 227);">+${augmentations}</div>`;
                itemHtml += `<span style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></span></div>`;
                itemsHtml += itemHtml;
            }
            return itemsHtml;
        }

        _displayPopUp(itemsHtml, elapsedTimeString){
            const popUpId = "rgsSummary";
            const popUpCloseId = 'rgsSummaryClose';
            const popUpTemplate = `<div role="presentation" id="${popUpId}" class="MuiDialog-root donate-dialog feedback-dialog sell-item-dialog popup-dialog" style="position: fixed; z-index: 1300; inset: 0;">
                           <div class="MuiBackdrop-root" aria-hidden="true" style="opacity: 1; transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"></div>
                           <div tabindex="0" data-test="sentinelStart"></div>
                           <div class="MuiDialog-container MuiDialog-scrollPaper" role="none presentation" tabindex="-1" style="opacity: 1;transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;">
                              <div class="MuiPaper-root MuiDialog-paper MuiDialog-paperScrollPaper MuiDialog-paperWidthSm MuiPaper-elevation24 MuiPaper-rounded" role="dialog">
                                 <div class="MuiDialogTitle-root">
                                    <h2 class="MuiTypography-root MuiTypography-h6">Resources Tracker</h2>
                                 </div>
                                 <p class="MuiTypography-root MuiDialogContentText-root MuiTypography-body1 MuiTypography-colorTextSecondary"> Resources variance tracked in ${elapsedTimeString}</p>
                                 <div class="offline-progress-box all-items">
                                    ${itemsHtml}
                                 </div>
                                 <div class="MuiDialogActions-root MuiDialogActions-spacing">
                                    <div class="button-container-250px">
                                       <div variant="contained" color="secondary" id="${popUpCloseId}" class="close-dialog-button idlescape-button idlescape-button-red">Close</div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           <div tabindex="0" data-test="sentinelEnd"></div>
                        </div>`;
            document.getElementsByTagName('body')[0].insertAdjacentHTML('beforeend', popUpTemplate);
            document.getElementById(popUpCloseId).addEventListener("click",function(){
                document.getElementById(popUpId).remove();
            },false);
        }

        _shortenNumber(number){
            if (Math.abs(number) < 1e4) return number;

            const SYMBOL = ["", "K", "M", "B", "T", "P", "E"];
            let tier = Math.log10(Math.abs(number)) / 3 | 0;

            let suffix = SYMBOL[tier];
            let scale = Math.pow(10, tier * 3);

            let scaled = number / scale;

            return Math.floor(scaled) + suffix;
        }

        _timeForHumans (seconds) {
            // https://stackoverflow.com/questions/8211744/convert-time-interval-given-in-seconds-into-more-human-readable-form
            let levels = [
                [Math.floor(seconds / 31536000), 'years'],
                [Math.floor((seconds % 31536000) / 86400), 'days'],
                [Math.floor(((seconds % 31536000) % 86400) / 3600), 'hours'],
                [Math.floor((((seconds % 31536000) % 86400) % 3600) / 60), 'minutes'],
                [Math.floor((((seconds % 31536000) % 86400) % 3600) % 60), 'seconds'],
            ];
            let returnText = '';

            for (let i = 0, max = levels.length; i < max; i++) {
                if ( levels[i][0] === 0 ) continue;
                returnText += ' ' + levels[i][0] + ' ' + (levels[i][0] === 1 ? levels[i][1].substr(0, levels[i][1].length-1): levels[i][1]);
            }
            return returnText.trim();
        }
    }

    function _onGameReady(callback) {
        const gameContainer = document.getElementsByClassName("play-area-container");
        if(gameContainer.length === 0) {
            setTimeout(function(){_onGameReady(callback);}, 250 );
        } else {
            callback();
        }
    }

    function start(){
        tracker = new ResourceTracker();
        new IdlescapeWebSocket().start();
        _onGameReady(function(){new UI().setupUI()});
    }

    start();
})();