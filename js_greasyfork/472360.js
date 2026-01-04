// ==UserScript==
// @name         IdlePixel 2.0
// @namespace    com.Ethan.idlepixel2.0
// @version      2.0.0
// @description  Upgrade the Game
// @author       Ethan
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @require      https://cdnjs.cloudflare.com/ajax/libs/anchorme/2.1.2/anchorme.min.js
// @require      https://unpkg.com/react@17/umd/react.production.min.js
// @require      https://unpkg.com/react-dom@17/umd/react-dom.production.min.js
// @require      https://unpkg.com/@reduxjs/toolkit@1.8.5/dist/redux-toolkit.umd.min.js
// @require      https://unpkg.com/react-redux@8.0.2/dist/react-redux.js
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/472360/IdlePixel%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/472360/IdlePixel%2020.meta.js
// ==/UserScript==

 

 
(function() {
    'use strict';
    var singleOverride;
    var foundryToggle = true;
    var smelteryToggle = true;
    const IMAGE_URL_BASE = $("itembox[data-item=copper] img").attr("src").replace(/\/[^/]+.png$/, "");
    const SMELTABLES =  ["copper", "iron", "silver", "gold", "promethium", "titanium","ancient_ore","dragon_ore"];
    const PLANTABLES = $('itembox[data-item$="_seeds"]').toArray().map(el => el.getAttribute("data-item"));
    const EDIBLES = Object.keys(Cooking.ENERGY_MAP).filter(s => !s.startsWith("raw_"));
    const COOKABLES = Object.keys(Cooking.FOOD_HEAT_REQ_MAP);
    const BONEMEALABLE = ["bones", "big_bones", "ice_bones", "ashes", "blood_bones"];
    const POTIONS = Object.keys(Brewing.POTION_TIMERS);
    const BOATS = $(`itembox[data-item$="_boat"], itembox[data-item$="_ship"]`).toArray().map(el => el.getAttribute("data-item"));
    const BAITS = $(`itembox[data-item$="bait"]`).toArray().map(el => el.getAttribute("data-item"));
    const NEEDLEABLE = ["lizard_mask", "lizard_body", "lizard_legs", "lizard_boots", "lizard_gloves", "bat_mask", "bat_body", "bat_legs", "bat_boots", "bat_gloves", "bear_mask", "bear_body", "bear_legs", "bear_boots", "bear_gloves"];
    const MINING = ["small_stardust_prism", "medium_stardust_prism", "large_stardust_prism", "huge_stardust_prism", "grey_geode", "blue_geode", "green_geode", "red_geode", "cyan_geode", "ancient_geode", "meteor"];
    const MINERAL = ["amber_mineral", "amethyst_mineral", "blood_crystal_mineral", "blue_marble_mineral", "clear_marble_mineral", "dense_marble_mineral", "fluorite_mineral", "frozen_mineral", "jade_mineral", "lime_quartz_mineral", "magnesium_mineral", "opal_mineral", "purple_quartz_mineral", "sea_crystal_mineral", "smooth_pearl_mineral", "sulfer_mineral", "tanzanite_mineral", "topaz_mineral"];
    const LOOT_BAGS = $(`itembox[data-item^="gathering_loot_bag_"]`).toArray().map(el => el.getAttribute("data-item"));
    const GRINDABLE = $(`#panel-invention itembox[data-item^="blood_"][onclick^="Invention.clicks_limb"]`).toArray().map(el => el.getAttribute("data-item"));
    const LOGS = Object.keys(Cooking.LOG_HEAT_MAP);
    const EXPLOSIVES = ["bomb", "tnt", "mega_bomb"]
    let loaded = false;
    let onLoginLoaded = false;
    const FEATHER2ARROW = {
        feathers: {
            craft: "wooden_arrows",
            required: {
                feathers: 15,
                logs: 5,
                iron_bar: 5
            }
        },
        fire_feathers: {
            craft: "fire_arrows",
            required: {
                fire_feathers: 15,
                oak_logs: 5,
                silver_bar: 5
            }
        },
        ice_feathers: {
            craft: "ice_arrows",
            required: {
                ice_feathers: 15,
                willow_logs: 5,
                gold_bar: 5
            }
        }
    };
 
    function loadPresets(buttonNum) {
        var loadout = window.localStorage.getItem("preset_" + buttonNum).split(",");
        IdlePixelPlus.sendMessage("UNEQUIP_ALL");
        let i = 0;
        while (i < loadout.length) {
            IdlePixelPlus.sendMessage("EQUIP=" + loadout[i]);
            i++;
        };
    }
 
 
    class TooltipContentNew
    {
        static content = {
            "combat-preset-6": "<span class='color-primary'>PRESETS</span><br /><br />Press 6 to quickload.",
            "combat-preset-7": "<span class='color-primary'>PRESETS</span><br /><br />Press 7 to quickload.",
            "combat-preset-8": "<span class='color-primary'>PRESETS</span><br /><br />Press 8 to quickload.",
            "combat-preset-9": "<span class='color-primary'>PRESETS</span><br /><br />Press 9 to quickload.",
            "combat-preset-10": "<span class='color-primary'>PRESETS</span><br /><br />Press 10 to quickload.",
        }
    };
 
    class SlapChopPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("slapchop", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>Key Binds<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "primaryActionKey",
                        label: "Primary Action Key",
                        type: "select",
                        options: [
                            {value:"none", label:"None"},
                            {value:"altKey", label:"Alt"},
                            {value:"shiftKey", label:"Shift"},
                            {value:"ctrlKey", label:"Ctrl"}
                        ],
                        default: "none"
                    },
                    {
                        id: "altActionKey",
                        label: "Alt Action Key",
                        type: "select",
                        options: [
                            {value:"altKey", label:"Alt"},
                            {value:"shiftKey", label:"Shift"},
                            {value:"ctrlKey", label:"Ctrl"}
                        ],
                        default: "altKey"
                    },
                    {
                        id: "autoSingleEnabled",
                        label: "Enable the ability to use items without having to hold the 'ALT' key<br/>to keep a single item for slapchop commands.",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Brewing<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickBrewButtonEnabled",
                        label: "Quick Brew (buttons): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickPotionRightClickEnabled",
                        label: "Quick Potion (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Combat<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickCraftArrowRightClickEnabled",
                        label: "Quick Craft Arrow (right-click feather, primary=max): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickExplosionEnabled",
                        label: "Quick Detonation - Quickly use explosives in combat window (right-click): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickFightEnabled",
                        label: "Quick Fight: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickFightConfirm",
                        label: "Quick Fight: Confirm",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "quickFightEnergyBar",
                        label: "Quick Fight: Energy Bar",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickFightFPBar",
                        label: "Quick Fight: FP Bar",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickNeedleRightClickEnabled",
                        label: "Quick Needle (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "quickPresetsEnabled",
                        label: "Quick Presets: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Cooking/Eating<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickCookRightClickEnabled",
                        label: "Quick Cook (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickEatRightClickEnabled",
                        label: "Quick Eat (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Farming<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickBoneRightClickEnabled",
                        label: "Quick Bonemeal (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickHarvestEnabled",
                        label: "Quick Harvest (Bob): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickHarvestNotificationEnabled",
                        label: "Harvest Farm plots when clicking on the notification: Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickPlantRightClickEnabled",
                        label: "Quick Plant (right-click, primary=1, alt=max): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickPlantHarvestRightClickEnabled",
                        label: "Quick Harvest And Plant (right-click, primary=1, alt=max): Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>Fishing<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickBaitRightClickEnabled",
                        label: "Quick Bait (right-click): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBoatRightClickEnabled",
                        label: "Quick Boat (right-click): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Foundry/Mining/Smelting<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickFoundryEnabled",
                        label: "Quick Foundry (buttons): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickMiningRightClickEnabled",
                        label: "Quick Geode / Prism Use (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickMineralRightClickEnabled",
                        label: "Quick Mineral XP Conversion (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickSmeltEnabled",
                        label: "Quick Smelt (buttons): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickSmeltRightClickEnabled",
                        label: "Quick Smelt (right-click, primary=max): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Gathering<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickGatherRightClickEnabled",
                        label: "Quick Gather (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Invention<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickGrindRightClickEnabled",
                        label: "Quick Blood Grind (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickCleanseRightClickEnabled",
                        label: "Quick Cleanse Blood in Invention (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Woodcutting<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "quickBurnRightClickEnabled",
                        label: "Quick Burn Logs (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickChopEnabled",
                        label: "Quick Chop (Lumberjack): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickChopRegTreesEnabled",
                        label: "Quick Chop (Normal Trees Lumberjack): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickChopSDTreesEnabled",
                        label: "Quick Chop (SD Trees Lumberjack): Enabled",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickTreeNotificationHarvestEnabled",
                        label: "Harvest Trees when clicking on the notification: Enabled",
                        type: "boolean",
                        default: true
                    }
                ]
            });
        }
 
        isPrimaryAction(event) {
            const prop = this.getConfig("primaryActionKey") || "none";
            if(prop=="none") {
                return !(event.altKey || event.ctrlKey || event.shiftKey);
            }
            else {
                return event[prop];
            }
        }
 
        isAltAction(event) {
            const prop = this.getConfig("altActionKey") || "altKey";
            return event[prop];
        }
 
        setItemBoxOverlay(items, enabled) {
            items.forEach(item => {
                if(enabled) {
                    $(`itembox[data-item=${item}]`).addClass("slapchop-overlay");
                }
                else {
                    $(`itembox[data-item=${item}]`).removeClass("slapchop-overlay");
                }
            });
        }
 
        initStyles() {
            $("head").append(`
            <style id="styles-slapchop">
 
            #slapchop-quickfight, #slapchop-quickpreset {
              position: relative;
            }
            #slapchop-quickpreset > .slapchop-quickpreset-buttons {
              display: flex;
              flex-direction: row;
              justify-content: start;
            }
            #slapchop-quickpreset > .slapchop-quickpreset-buttons > div {
              display: flex;
              flex-direction: column;
              justify-content: start;
            }
            #slapchop-quickpreset > .slapchop-quickpreset-buttons > div > button {
              margin: 0.125em;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons {
              display: flex;
              flex-direction: row;
              flex-wrap: wrap;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone {
              width: 150px;
              max-width: 150px;
              display: flex;
              flex-direction: column;
              justify-content: start;
              align-items: center;
              position: relative;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone.blood button {
              font-weight: 550;
              background-color: rgb(136, 8, 8) !important;
              color: rgb(255,255,255);
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone.blood button:disabled {
              color: rgba(255,255,255,0.3);
              background-color: rgba(136, 8, 8, 0.3) !important;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > * {
              width: 100%;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container {
              width: 100%;
              color: white;
              text-shadow: 1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000;
              text-align: left;
              position: relative;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container > .slapchop-quickfight-progress-value {
              position: relative;
              z-index: 5;
              margin-left: 4px;
              font-weight: bold;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container.slapchop-quickfight-fightpoints {
              background-color: rgba(255, 216, 0, 0.5);
              border: 1px solid rgb(255, 216, 0);
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container.slapchop-quickfight-fightpoints .slapchop-quickfight-progress {
              background-color: #ffd800;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container.slapchop-quickfight-energy {
              background-color: rgba(215, 0, 71, 0.5);
              border: 1px solid rgb(215, 0, 71);
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container.slapchop-quickfight-energy .slapchop-quickfight-progress {
              background-color: #d70047;
            }
            #slapchop-quickfight > .slapchop-quickfight-buttons .slapchop-quickfight-zone > .slapchop-quickfight-progress-container > .slapchop-quickfight-progress {
              position: absolute;
              top: 0;
              left: 0;
              height: 100%;
              width: 0; /* will be overwritten inline */
              z-index: 3;
            }
            #slapchop-quicklamp > .slapchop-quickfight-buttons .slapchop-quickfight-zone {
              width: 150px;
              max-width: 150px;
              display: flex;
              flex-direction: column;
              justify-content: start;
              align-items: center;
              position: relative;
            }
            #brewing-table .slapchop-quickbrew-button {
              border: 1px solid rgba(124, 218, 255, 0.86);
              background-color: rgba(124, 218, 255, 0.1);
              padding: 2px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0.5em auto 0.125em auto;
              max-width: 100px;
            }
            #brewing-table .slapchop-quickbrew-button:hover {
              background-color: rgba(69, 177, 216, 0.5);
            }
            #crafting-table .slapchop-rocketfuelmax-button {
            border: 1px solid rgba(124, 218, 255, 0.86);
              background-color: rgba(124, 218, 255, 0.1);
              padding: 2px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0.5em auto 0.125em auto;
              max-width: 150px;
            }
            #crafting-table .slapchop-rocketfuelmax-button:hover {
              background-color: rgba(69, 177, 216, 0.5);
            }
            #crafting-table .slapchop-rocketfuelsingle-button {
            border: 1px solid rgba(124, 218, 255, 0.86);
              background-color: rgba(124, 218, 255, 0.1);
              padding: 2px;
              display: flex;
              justify-content: center;
              align-items: center;
              margin: 0.5em auto 0.125em auto;
              max-width: 150px;
            }
            #crafting-table .slapchop-rocketfuelsingle-button:hover {
              background-color: rgba(69, 177, 216, 0.5);
            }
            </style>
            `);
        }
 
        async initQuickFight() {
            let html = `
            <div id="slapchop-quickfight">
              <h5>Quick Fight:</h5>
              <div class="slapchop-quickfight-buttons">
            `;
            Object.values(IdlePixelPlus.info.combatZones).forEach(zone => {
                html += `
                <div id="slapchop-quickfight-${zone.id}" class="slapchop-quickfight-zone m-1 ${zone.blood?'blood':''}">
                  <button type="button" onclick="IdlePixelPlus.plugins.slapchop.quickFight('${zone.id}')">${zone.id.replace(/_/g, " ").replace(/(^|\s)\w/g, s => s.toUpperCase())}</button>
                  <div class="slapchop-quickfight-fightpoints slapchop-quickfight-progress-container" title="Fight Points: ${zone.fightPointCost.toLocaleString()}">
                    <span class="slapchop-quickfight-progress-value">0</span>
                    <div class="slapchop-quickfight-progress"></div>
                  </div>
                  <div class="slapchop-quickfight-energy slapchop-quickfight-progress-container" title="Energy: ${zone.energyCost.toLocaleString()}">
                    <span class="slapchop-quickfight-progress-value">0</span>
                    <div class="slapchop-quickfight-progress"></div>
                  </div>
                </div>
                `;
            });
            html += `
              <div id="slapchop-quickfight-castle" class="slapchop-quickfight-zone m-1 castle">
                <button type="button" onclick="Castle.clicks_castle_entrance()">Faradox Castle</button>
                <div class="slapchop-quickfight-fightpoints slapchop-quickfight-progress-container" title="Fight Points: Castle}">
                    <span class="slapchop-quickfight-progress-value">No FP to Enter</span>
                    <div class="slapchop-quickfight-progress"></div>
                  </div>
                  <div class="slapchop-quickfight-energy slapchop-quickfight-progress-container" title="Energy: Castle}">
                    <span class="slapchop-quickfight-progress-value">No Energy to Enter</span>
                    <div class="slapchop-quickfight-progress"></div>
                  </div>
                </div>
                </div>
            `;
            html += `
              </div>
              <hr>
            </div>
            <div id="slapchop-quickpreset">
              <h5>Quick Presets:</h5>
              <div class="slapchop-quickpreset-buttons">
                <div>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=1')">Save 1</button>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=1~1')">Load 1</button>
                </div>
                <div>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=2')">Save 2</button>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=2~1')">Load 2</button>
                </div>
                <div>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=3')">Save 3</button>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=3~1')">Load 3</button>
                </div>
                <div>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=4')">Save 4</button>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=4~1')">Load 4</button>
                </div>
                <div>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_SAVE=5')">Save 5</button>
                  <button onclick="IdlePixelPlus.sendMessage('PRESET_LOAD=5~1')">Load 5</button>
                </div>
                <div>
                  <button onclick="savePresets(6)">Save 6</button>
                  <button onclick="loadPresets(6)">Load 6</button>
                </div>
                <div>
                  <button onclick="savePresets(7)">Save 7</button>
                  <button onclick="loadPresets(7)">Load 7</button>
                </div>
                <div>
                  <button onclick="savePresets(8)">Save 8</button>
                  <button onclick="loadPresets(8)">Load 8</button>
                </div>
                <div>
                  <button onclick="savePresets(9)">Save 9</button>
                  <button onclick="loadPresets(9)">Load 9</button>
                </div>
                <div>
                  <button onclick="savePresets(10)">Save 10</button>
                  <button onclick="loadPresets(10)">Load 10</button>
                </div>
              </div>
              <hr>
            </div>
            <script>
              function savePresets(buttonNum) {
                var head = IdlePixelPlus.getVarOrDefault("head", null, "string");
                var body = IdlePixelPlus.getVarOrDefault("body", null, "string");
                var legs = IdlePixelPlus.getVarOrDefault("legs", null, "string");
                var boots = IdlePixelPlus.getVarOrDefault("boots", null, "string");
                var gloves = IdlePixelPlus.getVarOrDefault("gloves", null, "string");
                var amulet = IdlePixelPlus.getVarOrDefault("amulet", null, "string");
                var weapon = IdlePixelPlus.getVarOrDefault("weapon", null, "string");
                var shield = IdlePixelPlus.getVarOrDefault("shield", null, "string");
                var arrows = IdlePixelPlus.getVarOrDefault("arrows", null, "string");
                var equip = head+","+body+","+legs+","+boots+","+gloves+","+amulet+","+weapon+","+shield+","+arrows;
                var preset_call = "preset_" + buttonNum;
                var obj = {};
                obj[preset_call] = "{preset_" + buttonNum +": "+equip+"}";
                var convert = JSON.stringify(obj[preset_call]);
                //console.log(convert);
                window.localStorage.setItem("preset_" + buttonNum, [head, body, legs, boots, gloves, amulet, weapon, shield, arrows]);
              }
 
              function loadPresets(buttonNum) {
                var loadout = window.localStorage.getItem("preset_" + buttonNum).split(",");
                //console.log(loadout[1]);
                IdlePixelPlus.sendMessage("UNEQUIP_ALL");
                let i = 0;
                while (i < loadout.length) {
                  IdlePixelPlus.sendMessage("EQUIP=" + loadout[i]);
                  i++;
                };
              }
            </script>
          `;
            $("#panel-combat hr").first().after(html);
        }
 
        quickFight(zoneId) {
            const confirm = this.getConfig("quickFightConfirm");
            if(confirm) {
                if(window.confirm(`FIGHT: ${zoneId.replace(/_/g, " ").replace(/(^|\s)\w/g, s => s.toUpperCase())} ?`)) {
                    if(zoneId.startsWith("blood_")) {
                        Combat.modal_blood_area_last_selected = zoneId;
                    }
                    else {
                        Combat.modal_area_last_selected = zoneId;
                    }
                    IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
                }
            }
            else {
                if(zoneId.startsWith("blood_")) {
                    Combat.modal_blood_area_last_selected = zoneId;
                }
                else {
                    Combat.modal_area_last_selected = zoneId;
                }
                IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
            }
        }
 
        initQuickLamps() {
            $("#game-panels-combat-items-area").before(`
            <div id="quick-lamp-zone">
              <h5>Quick Lamps:</h5>
              <div id="lamp-zone-all" style="display: flex; flex-direction: row; flex-wrap: wrap;">
                <div id="melee-lamp-zone"
                  style="display: flex;
                  flex-direction: column;
                  justify-content: start;
                  align-items: center;
                  position: relative;
                  "
                >
                  <div id="melee-zone-label">Melee</div>
                  <button id="lamp-melee-max" onClick=useLamps("melee")>Max</button>
               </div>
               <div id="archery-lamp-zone"
                 style="display: flex;
                 flex-direction: column;
                 justify-content: start;
                 align-items: center;
                 position: relative;
                 padding-left: 20px;
                 "
               >
                 <div id="archery-zone-label">Archery</div>
                 <button id="lamp-archery-max" onClick=useLamps("archery")>Max</button>
               </div>
               <div id="magic-lamp-zone"
                 style="display: flex;
                 flex-direction: column;
                 justify-content: start;
                 align-items: center;
                 position: relative;
                 padding-left: 20px";
               >
                 <div id="magic-zone-label">Magic</div>
                 <button id="lamp-magic-max" onClick=useLamps("magic")>Max</button>
               </div>
             </div>
             <hr>
           </div>
           <script>
             function useLamps(typeLamp) {
               var lampCount = IdlePixelPlus.getVarOrDefault("combat_xp_lamp", 0, "int");
               for (let i = lampCount; i > 0; i--) {
                 websocket.send("COMBAT_XP_LAMP="+typeLamp);
               }
             }
           </script>
        `)
            var lamps = IdlePixelPlus.getVarOrDefault("combat_xp_lamp", 0, "int");
            if(lamps == 0) {
                $("#quick-lamp-zone").hide();
            } else {
                $("#quick-lamp-zone").show();
            }
        }
 
        updateButtons(){
            let potions = ['rare_monster_potion', 'super_rare_monster_potion']
            potions.forEach(potion=>{
                let useButton = document.getElementById(`${potion}-use`)
                let brewButton = document.getElementById(`${potion}-brew`)
                IdlePixelPlus.getVarOrDefault(potion, 0, 'int') ? useButton.style.color = 'white' : useButton.style.color = 'red'
                this.canBrew(potion) ? brewButton.style.color = 'white' : brewButton.style.color = 'red'
            })
            let combatLootPotionsAmount = document.getElementById('combat_loot_potion-label');
            combatLootPotionsAmount.textContent = IdlePixelPlus.getVarOrDefault('combat_loot_potion_timer', 0, 'int') == 0 ?
                'Loot Potions: ' + IdlePixelPlus.getVarOrDefault('combat_loot_potion', 0, 'int') :
            format_time(IdlePixelPlus.getVarOrDefault('combat_loot_potion_timer', 0, 'int'));
            let rainPotionsAmount = document.getElementById('rain_potion-in-combat-label');
            rainPotionsAmount.textContent = IdlePixelPlus.getVarOrDefault('rain_potion_timer', 0, 'int') == 0 ?
                'Rain Potions: ' + IdlePixelPlus.getVarOrDefault('rain_potion', 0, 'int') :
            format_time(IdlePixelPlus.getVarOrDefault('rain_potion_timer', 0, 'int'));
        }
 
        canBrew(potion){
            let ingredients = Brewing.get_ingredients(potion);
            for (let i=0; i<ingredients.length; i+=2){
                if (IdlePixelPlus.getVarOrDefault(ingredients[i], 0, 'int') < ingredients[i+1]) return false;
            }
            return true;
        }
 
        updateQuickFight() {
            const fp = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int");
            const energy = IdlePixelPlus.getVarOrDefault("energy", 0, "int");
 
            Object.values(IdlePixelPlus.info.combatZones).forEach(zone => {
                let disabled = fp < zone.fightPointCost || energy < zone.energyCost;
                let fpPercent = (fp / zone.fightPointCost).toFixed(2).split(".");
                let energyPercent = (energy / zone.energyCost).toFixed(2).split(".");
 
                let fpLabel = `&times; ${fpPercent[0]} + ${fpPercent[1].replace(/^0/, "")}%`;
                let energyLabel = `&times; ${energyPercent[0]} + ${energyPercent[1].replace(/^0/, "")}%`;
 
                if (zone.id === "volcano" && IdlePixelPlus.getVar("volcano_unlocked") !== "1") {
                    disabled = true;
                } else if (zone.id === "northern_field" && IdlePixelPlus.getVar("northern_field_unlocked") !== "1") {
                    disabled = true;
                } else if (zone.id === "mansion" && IdlePixelPlus.getVar("mansion_unlocked") !== "1") {
                    disabled = true;
                } else if ((zone.id === "blood_field" || zone.id === "blood_forest" || zone.id === "blood_cave" || zone.id === "blood_volcano") && IdlePixelPlus.getVar("blood_moon_active") !== "1") {
                    disabled = true;
                }
 
                const button = document.querySelector(`#slapchop-quickfight-${zone.id} button`);
                button.disabled = disabled;
 
                const fpProgress = document.querySelector(`#slapchop-quickfight-${zone.id} .slapchop-quickfight-fightpoints .slapchop-quickfight-progress`);
                const energyProgress = document.querySelector(`#slapchop-quickfight-${zone.id} .slapchop-quickfight-energy .slapchop-quickfight-progress`);
                const fpProgressValue = document.querySelector(`#slapchop-quickfight-${zone.id} .slapchop-quickfight-fightpoints .slapchop-quickfight-progress-value`);
                const energyProgressValue = document.querySelector(`#slapchop-quickfight-${zone.id} .slapchop-quickfight-energy .slapchop-quickfight-progress-value`);
 
                fpProgress.style.width = `${fpPercent}%`;
                energyProgress.style.width = `${energyPercent}%`;
                fpProgressValue.innerHTML = fpLabel;
                energyProgressValue.innerHTML = energyLabel;
            });
        }
 
        maxSmeltable(ore) {
            const oilPerOre = Crafting.getOilPerBar(ore);
            const charcoalPerOre = Crafting.getCharcoalPerBar(ore);
            const lavaPerOre = Crafting.getLavaPerBar(ore);
            const plasmaPerOre = Crafting.getPlasmaPerBar(ore);
 
            const oil = IdlePixelPlus.getVarOrDefault("oil", 0, "int");
            const capacity = Furnace.getFurnaceCapacity();
            const oreCount = IdlePixelPlus.getVarOrDefault(ore, 0, "int");
            const maxSmeltFromOil = Math.floor(oil / oilPerOre);
            const dragonFire = IdlePixelPlus.getVarOrDefault("dragon_fire", 0 ,"int")
            let maxSmeltCount = Math.min(capacity, oreCount, maxSmeltFromOil);
 
            if(charcoalPerOre > 0) {
                const charcoal = IdlePixelPlus.getVarOrDefault("charcoal", 0, "int");
                const maxSmeltFromCharcoal = Math.floor(charcoal / charcoalPerOre);
                maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromCharcoal);
            }
            if(lavaPerOre > 0) {
                const lava = IdlePixelPlus.getVarOrDefault("lava", 0, "int");
                const maxSmeltFromLava = Math.floor(lava / lavaPerOre);
                maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromLava);
            }
            if(plasmaPerOre > 0) {
                const plasma = IdlePixelPlus.getVarOrDefault("plasma", 0, "int");
                const maxSmeltFromPlasma = Math.floor(plasma / plasmaPerOre);
                maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromPlasma);
            }
            if(ore == "dragon_ore") {
                maxSmeltCount = Math.min(maxSmeltCount, dragonFire);
            }
            if(ore == "copper") {
                maxSmeltCount = Math.min(capacity, oreCount);
            }
            return maxSmeltCount || 0;
        }
 
        quickSmelt(ore) {
            if(smelteryToggle) {
                smelteryToggle = false;
                const current = IdlePixelPlus.getVarOrDefault("furnace_ore_type", "none");
                if(current == "none") {
                    const max = this.maxSmeltable(ore);
                    if(max > 0) {
                        IdlePixelPlus.sendMessage(`SMELT=${ore}~${max}`);
                    }
                }
                setTimeout(function() {
                    smelteryToggle = true;
                },1000);
            }
        }
 
        maxCraftable() {
            const oilPerFuel = 5000;
            const charcoalPerFuel = 20;
            const lavaPerFuel = 1;
            const oil = IdlePixelPlus.getVarOrDefault("oil", 0, "int");
            const maxFuelFromOil = Math.floor(oil / oilPerFuel);
            let maxFuelCount = Math.min(maxFuelFromOil);
            if(charcoalPerFuel > 0) {
                const charcoal = IdlePixelPlus.getVarOrDefault("charcoal", 0, "int");
                const maxCraftFromCharcoal = Math.floor(charcoal / charcoalPerFuel);
                maxFuelCount = Math.min(maxFuelCount, maxCraftFromCharcoal);
            }
            if(lavaPerFuel > 0) {
                const lava = IdlePixelPlus.getVarOrDefault("lava", 0, "int");
                const maxCraftFromLava = Math.floor(lava / lavaPerFuel);
                maxFuelCount = Math.min(maxFuelCount, maxCraftFromLava);
            }
            return maxFuelCount || 0;
        }
 
        updateMaxCraftable() {
            const max = this.maxCraftable();
            const maxText = "Quick Craft Max (" + max + ")";
            const oilMax = 5000 * max;
            const oilText = "5,000 (" + oilMax.toLocaleString() + ") (oil)";
            const coalMax = 20 * max;
            const coalText = "20 (" + coalMax.toLocaleString() + ") (charcoal)";
            const lavaMax = 1 * max;
            const lavaText = "1 (" + lavaMax.toLocaleString() + ") (lava)";
            const label = document.querySelector('#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item]').dataset.materialsItem;
 
            const maxCraftableButton = document.querySelector('#crafting-table .slapchop-rocketfuelmax-button');
            const oilTableCell = document.querySelector('#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=oil]');
            const coalTableCell = document.querySelector('#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=charcoal]');
            const lavaTableCell = document.querySelector('#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=lava');
            const singleCraftButton = document.querySelector('#crafting-table .slapchop-rocketfuelsingle-button');
 
            if (maxCraftableButton) {
                maxCraftableButton.textContent = maxText;
            }
 
            if (oilTableCell) {
                oilTableCell.textContent = oilText;
            }
 
            if (coalTableCell) {
                coalTableCell.textContent = coalText;
            }
 
            if (lavaTableCell) {
                lavaTableCell.textContent = lavaText;
            }
 
            if (singleCraftButton) {
                if (max === 0) {
                    singleCraftButton.style.display = 'none';
                } else {
                    singleCraftButton.style.display = 'block';
                }
            }
        }
 
        initQuickSmelt() {
            let html = `
            <div class="slapchop-quicksmelt">
              <h5>Quick Smelt:</h5>
              <div class="slapchop-quicksmelt-buttons">
            `;
            SMELTABLES.forEach(ore => {
                html += `
                  <button type="button" onclick="IdlePixelPlus.plugins.slapchop.quickSmelt('${ore}')">
                    <img src="${IMAGE_URL_BASE}/${ore}.png" class="img-20" />
                    ${ore.replace(/_/g, " ").replace(/(^|\s)\w/g, s => s.toUpperCase())}
                    (<span data-slap="max-smelt-${ore}">?</span>)
                  </button>
                `;
            });
            html += `
              </div>
              <hr>
            </div>
            `;
            $("#panel-mining hr").first().after(html);
            $("#panel-crafting hr").first().after(html);
 
            SMELTABLES.forEach(ore => {
                $(`itembox[data-item="${ore}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickSmeltRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickSmelt(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        updateQuickSmelt() {
            SMELTABLES.forEach(ore => {
                const max = this.maxSmeltable(ore);
                const elements = document.querySelectorAll(`[data-slap="max-smelt-${ore}"]`);
                elements.forEach(element => {
                    element.textContent = max;
                });
            });
        }
 
        initQuickFoundry() {
            let html = `
            <div id="slapchop-quickfoundry" class="slapchop-quickfight">
              <h5>Quick Foundry:</h5>
              <div class="slapchop-quicksmelt-buttons">
            `;
            LOGS.forEach(log => {
                if(log != "dense_logs") {
                    html += `
                  <button id="slapchop-quickfoundry-${log}" type="button" onclick="IdlePixelPlus.plugins.slapchop.quickFoundry('${log}')">
                    <img src="${IMAGE_URL_BASE}/${log}.png" class="img-20" />
                    ${log.replace("_logs", "").replace(/_/g, " ").replace(/(^|\s)\w/g, s => s.toUpperCase())}
                    (<span data-slap="max-foundry-${log}">?</span>)
                  </button>
                `;
                }
            });
            html += `
              </div>
              <hr>
            </div>
            `;
            $("#panel-woodcutting hr").first().after(html);
        }
 
        updateQuickFoundry() {
            const foundryBusy = IdlePixelPlus.getVarOrDefault("foundry_amount", 0, "int") != 0;
            LOGS.forEach(log => {
                if(log != "dense_logs") {
                    const max = this.maxFoundry(log);
                    $(`[data-slap="max-foundry-${log}"]`).text(max);
                    if(!foundryBusy && max > 0) {
                        $(`#slapchop-quickfoundry-${log}`).prop("disabled", false);
                    }
                    else {
                        $(`#slapchop-quickfoundry-${log}`).prop("disabled", true);
                    }
                }
            });
        }
 
        quickFoundry(log) {
            if(foundryToggle) {
                foundryToggle = false;
                const max = this.maxFoundry(log);
                if(max > 0) {
                    IdlePixelPlus.sendMessage(`FOUNDRY=${log}~${max}`);
                }
                setTimeout(function() {
                    foundryToggle = true;
                },1000);
            }
        }
 
        maxFoundry(log) {
            if(IdlePixelPlus.getVarOrDefault("charcoal_foundry_crafted", "0") != "1") {
                return 0;
            }
            let max = IdlePixelPlus.getVarOrDefault(log, 0, "int");
            let foundryStorage = IdlePixelPlus.getVarOrDefault("foundry_storage_crafted", 0, "int");
 
            if(max >= 1000 && foundryStorage == 1) {
                max = 1000;
            } else if(max > 100 && foundryStorage != 1) {
                max = 100;
            }
 
            let oilMax = Math.floor(IdlePixelPlus.getVarOrDefault("oil", 0, "int")/10);
            if(max > oilMax) {
                max = oilMax;
            }
            return max;
        }
 
        initQuickCook() {
            COOKABLES.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickCookRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickCook(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        maxCookable(food) {
            return Cooking.can_cook_how_many(food) || 0;
        }
 
        quickCook(food, alt) {
            const max = this.maxCookable(food);
            let n = max;
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                const owned = IdlePixelPlus.getVarOrDefault(food, 0, "int");
                if(owned==max || singleOverride) {
                    n--;
                }
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`COOK=${food}~${n}`);
            }
        }
 
        quickEat(food, alt) {
            let n = IdlePixelPlus.getVarOrDefault(food, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`CONSUME=${food}~${n}`);
            }
        }
 
        initQuickEat() {
            EDIBLES.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickEatRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickEat(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickPlant(seed, alt) {
            let n = IdlePixelPlus.getVarOrDefault(seed, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(!alt && !singleOverride && n>1) {
                n = 1;
            }
            const donor = DonorShop.has_donor_active(Items.getItem("donor_farm_patches_timestamp"));
            const maxPlot = donor ? 5 : 3;
            for(let plot = 1; plot <= maxPlot && n > 0; plot++) {
                if(IdlePixelPlus.getVar(`farm_${plot}`) == "none") {
                    IdlePixelPlus.sendMessage(`PLANT=${seed}~${plot}`);
                    n--;
                }
            }
        }
 
        initQuickPlant() {
            PLANTABLES.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickPlantRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            if(IdlePixelPlus.plugins.slapchop.getConfig("quickPlantHarvestRightClickEnabled")) {
                                this.quickHarvest();
                            }
                            this.quickPlant(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickMining(item, alt) {
            let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                console.log("Inside the minus: " + singleOverride);
                n--;
            }
            if(n > 0) {
                if(item.includes("_stardust_prism")) {
                    IdlePixelPlus.sendMessage(`SMASH_STARDUST_PRISM=${item}~${n}`);
                } else if(item.includes("_geode")) {
                    IdlePixelPlus.sendMessage(`CRACK_GEODE=${item}~${n}`);
                } else if(item == "meteor") {
                    websocket.send(`MINE_METEOR`);
                }
            }
        }
 
        initQuickMining() {
            MINING.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickMiningRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickMining(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickMineral(item, alt) {
            let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                //console.log(`MINERAL_XP=${item}~${n}`);
                IdlePixelPlus.sendMessage(`MINERAL_XP=${item}~${n}`);
            }
        }
 
        initQuickMineral() {
            MINERAL.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickMineralRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickMineral(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickCleanse(item, alt) {
            let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`CLEANSE_EVIL_BLOOD=${item}~${n}`);
            }
        }
 
        initQuickCleanse() {
            $(`itembox[data-item="evil_blood"]`).on("contextmenu", event => {
                if(this.getConfig("quickCleanseRightClickEnabled")) {
                    const primary = this.isPrimaryAction(event);
                    const alt = this.isAltAction(event);
                    if(primary || alt) {
                        this.quickCleanse("evil_blood", !primary);
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                }
                return true;
            });
        }
 
        quickExplode(item) {
            IdlePixelPlus.sendMessage(`USE_${item.toUpperCase()}`);
        }
 
        initQuickExplode() {
            $(`itembox[data-item="bomb"]`).on("contextmenu", event => {
                if(this.getConfig("quickExplosionEnabled")) {
                    const primary = this.isPrimaryAction(event);
                    const alt = this.isAltAction(event);
                    if(primary || alt) {
                        this.quickExplode("bomb");
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                }
                return true;
            });
            $(`itembox[data-item="tnt"]`).on("contextmenu", event => {
                if(this.getConfig("quickExplosionEnabled")) {
                    const primary = this.isPrimaryAction(event);
                    const alt = this.isAltAction(event);
                    if(primary || alt) {
                        this.quickExplode("tnt");
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                }
                return true;
            });
            $(`itembox[data-item="mega_bomb"]`).on("contextmenu", event => {
                if(this.getConfig("quickExplosionEnabled")) {
                    const primary = this.isPrimaryAction(event);
                    const alt = this.isAltAction(event);
                    if(primary || alt) {
                        this.quickExplode("mega_bomb");
                        event.stopPropagation();
                        event.preventDefault();
                        return false;
                    }
                }
                return true;
            });
        }
 
        quickBone(item, alt) { /* lol */
            if(IdlePixelPlus.getVarOrDefault("bonemeal_bin", 0, "int") != 0) {
                let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
                singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
                if(alt || singleOverride) {
                    n--;
                }
                if(n > 0) {
                    IdlePixelPlus.sendMessage(`ADD_BONEMEAL=${item}~${n}`);
                }
            }
        }
 
        initQuickBones() {
            BONEMEALABLE.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickBoneRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickBone(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickPotion(potion, alt) {
            let n = IdlePixelPlus.getVarOrDefault(potion, 0, "int");
            //console.log(potion);
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(!alt && !singleOverride && n>1) {
                n = 1;
            }
            if(n > 0) {
                if(potion == "combat_loot_potion" && var_combat_loot_potion_timer == 0) {
                    websocket.send(`BREWING_DRINK_COMBAT_LOOT_POTION`);
                }
                else if(potion == "rotten_potion" && var_rotten_potion_timer == 0) {
                    websocket.send(`BREWING_DRINK_ROTTEN_POTION`);
                }
                else if(potion == "merchant_speed_potion" && var_merchant_speed_potion_timer == 0) {
                    websocket.send(`BREWING_DRINK_MERCHANT_SPEED_POTION`);
                }
                else {
                    IdlePixelPlus.sendMessage(`DRINK=${potion}`);
                }
            }
        }
 
        initQuickPotions() {
            POTIONS.forEach(item => {
                const itemBox = document.querySelector(`[data-item="${item}"]`);
                itemBox.oncontextmenu = '';
 
                if (itemBox) {
                    itemBox.addEventListener("contextmenu", event => {
                        if (this.getConfig("quickPotionRightClickEnabled")) {
                            const primary = this.isPrimaryAction(event);
                            const alt = this.isAltAction(event);
                            if (primary || alt) {
                                this.quickPotion(item, !primary);
                                event.stopPropagation();
                                event.preventDefault();
                                return false;
                            }
                        }
                        return true;
                    });
                }
            });
 
            const combatLootPotion = document.querySelector('[data-item="combat_loot_potion"]');
            combatLootPotion.oncontextmenu = '';
 
            if (combatLootPotion) {
                combatLootPotion.addEventListener("contextmenu", event => {
                    if (this.getConfig("quickPotionRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if (primary || alt) {
                            this.quickPotion("combat_loot_potion", !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            }
 
            const merchantSpeedPotion = document.querySelector('[data-item="merchant_speed_potion"]');
            merchantSpeedPotion.oncontextmenu = '';
 
            if (merchantSpeedPotion) {
                merchantSpeedPotion.addEventListener("contextmenu", event => {
                    if (this.getConfig("quickPotionRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if (primary || alt) {
                            this.quickPotion("merchant_speed_potion", !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            }
 
            const rottenPotion = document.querySelector('[data-item="rotten_potion"]');
            rottenPotion.oncontextmenu = '';
 
            if (rottenPotion) {
                rottenPotion.addEventListener("contextmenu", event => {
                    if (this.getConfig("quickPotionRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if (primary || alt) {
                            this.quickPotion("rotten_potion", !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            }
        }
 
        quickBoat(item) {
            const n = IdlePixelPlus.getVar(`${item}_timer`);
            if(n == "1") {
                IdlePixelPlus.sendMessage(`BOAT_COLLECT=${item}`);
            }
            else {
                IdlePixelPlus.sendMessage(`BOAT_SEND=${item}`);
            }
        }
 
        quickBait(item) {
            var baitUse = "THROW_" + item.toUpperCase();
            websocket.send(`${baitUse}`);
        }
 
        initQuickBoat() {
            BOATS.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickBoatRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickBoat(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        initQuickBait() {
            BAITS.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickBaitRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickBait(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickNeedle(item, alt) {
            let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`USE_NEEDLE=${item}~${n}`);
            }
        }
 
        initQuickNeedle() {
            NEEDLEABLE.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickNeedleRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickNeedle(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickGather(bag, alt) {
            let n = IdlePixelPlus.getVarOrDefault(bag, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`OPEN_GATHERING_LOOT=${bag.replace("gathering_loot_bag_", "")}~${n}`);
            }
        }
 
        initQuickGather() {
            LOOT_BAGS.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickGatherRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickGather(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        quickBrew(potion) {
            IdlePixelPlus.sendMessage(`BREW=${potion}~1`);
        }
 
        initQuickBrew() {
            $("#brewing-table tbody tr[data-brewing-item]").each(function() {
                const el = $(this);
                const potion = el.attr("data-brewing-item");
                if(!potion) {
                    return;
                }
                el.find("td:nth-child(4)").append(`
	            <div class="slapchop-quickbrew-button"
		            onclick="event.stopPropagation(); IdlePixelPlus.plugins.slapchop.quickBrew('${potion}')"">Quick Brew 1</div>
	            `);
            });
        }
 
        quickCraft() {
            const max = this.maxCraftable();
            if(max > 0) {
                IdlePixelPlus.sendMessage(`CRAFT=rocket_fuel~${max}`);
            }
 
        }
 
        quickCraftSingle() {
            IdlePixelPlus.sendMessage(`CRAFT=rocket_fuel~1`);
 
 
        }
 
        initQuickRocketFuel() {
            $("#crafting-table tbody tr[data-crafting-item=rocket_fuel]").each(function() {
                const el = $(this);
                const craft = el.attr("data-crafting-item");
                if(!craft) {
                    return;
                }
                el.find("td:nth-child(4)").append(`
                <div class="slapchop-rocketfuelsingle-button"
                onclick="event.stopPropagation(); IdlePixelPlus.plugins.slapchop.quickCraftSingle()"">Quick Craft 1</div>
	            <div class="slapchop-rocketfuelmax-button"
                onclick="event.stopPropagation(); IdlePixelPlus.plugins.slapchop.quickCraft()"">Quick Craft Max</div>
                `);
            });
        }
 
        quickBurn(item, alt) {
            let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
            if(alt || singleOverride) {
                n--;
            }
            if(n > 0) {
                IdlePixelPlus.sendMessage(`ADD_HEAT=${item}~${n}`);
            }
        }
 
        initQuickBurn() {
            LOGS.forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickBurnRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickBurn(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        maxCraftableArrows(feather) {
            const data = FEATHER2ARROW[feather];
            if(!data) return 0;
 
            let max = Number.MAX_SAFE_INTEGER;
            Object.keys(data.required).forEach(item => {
                const needed = data.required[item];
                const owned = IdlePixelPlus.getVarOrDefault(item, 0, "int");
                const craftable = Math.floor(owned/needed);
                max = Math.min(max, craftable);
            });
            return max;
        }
 
        quickFeather2Arrow(item, alt) {
            let n = this.maxCraftableArrows(item);
            if(n > 0) {
                IdlePixelPlus.sendMessage(`CRAFT=${FEATHER2ARROW[item].craft}~${n}`);
            }
        }
 
        initQuickFeather2Arrow() {
            Object.keys(FEATHER2ARROW).forEach(item => {
                $(`itembox[data-item="${item}"]`).on("contextmenu", event => {
                    if(this.getConfig("quickCraftArrowRightClickEnabled")) {
                        const primary = this.isPrimaryAction(event);
                        const alt = this.isAltAction(event);
                        if(primary || alt) {
                            this.quickFeather2Arrow(item, !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            });
        }
 
        initQuickChop() {
            $("#panel-woodcutting itembox").first().before(`
	        <itembox id="slapchop-lumberjack" class="shadow hover" data-item="slapchop_lumberjack" onclick="IdlePixelPlus.plugins.slapchop.quickChop()">
                <div class="center mt-1"><img width="50" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AABnZSURBVHhe7Z0HfBRl+sd/23t2N2XTO+mQBEIEkiAISBWQKqKIoJycHDZO8fQvwnl6CNY7j0NPz3K2O5FTDoQgCAhJKAGSEEJ675uyu8n29n9nMgGUFjzCbnJ8/Yy77zvvDpl55mnzlsEtbnGLW/yP88zatROZr7e4TtjM5w2luLj4s0X33vvq0aM5XkzVLfpIvwgkOSkRC+bPe+bNt97OfHH9+gim+hZ9oF8EArAwKjUVd8+endLd3ZX3q0ceWbXj229kzM5bXIV+EYhAKACLxYJcLscd4++QRUdHv5P5/b6CV155+RmmyS2uAIv5vKGsW7fu6xUPLZ9bWl4Oo9HE1ALZ2dkwmkxNzS0t++B0QigUVvmGRW7duO75JqbJ/zwc5vOGMmr06NTIyIg0iVgCna6LqQWCg4MRFhoqGzZ0aFJCQnySUqEYV1la/LBfcEjQyNFp2sK803VM0/9Z+kVD3n777XSxRHxwxtSp3LyCM3A4HOc3DodDm7OLIVqDHw8f7vIOH5r44hMrqpnq/0n6RUP27NlTl5IycsTw5KRYPo+P/IICnM7PQ3FJKZqbm2Gz28Dn8+mNgsflgsfjCb74+P3ipsbGk3TlDWDdq69PhNOxYNLY0euGBPosGXlb6hJweKy161+yZe78j5pp5lb0i4ZQvPba5jE8Pj+bEkDRuXOQSaXEbThhtdrg4eEBNpsNokXEj4gQFBgIlbc3so4dw7T5CwOmpo3+r3zK63/dGv3DF+9vETcWTBwitUBwUehisAHldiU6paGb7nns2U0r71vUzuxyC/pFQyj+9PZbjbm5uTaNRlMyYviIhbNm3rXRZLG+1qY3tpw7d85PwOP6ctgceHOtMGjaUFVTg8bmVpSXluWfzj1RwBzmunn1L1tlOV/9/UScNjcpUGgHjwiDtpBkoz75pOzLNUFmbksvbOyaeLak/L2eX7oH/aYhVyN94mQSGNvziZOPTgqQgUOulMXhxIH8CkydM3fkYyse/sVma/Gy5U94HP/kTX+hjT45NvmfmAsIya3HJcIg/wzMdqDLSjRFz4Mj/cEFn7z/t209v3Y9/aYhV6OuqsIWE59wtkPXxXaYjEkqTw9aKOpOLTZveu0RptkvQiV0vhaLxhBPAdEEUc/mQVxVr1BE5FPKA7yEgI/AgcNNiF+5+vEP9+/bR4yZ6+mXxLAv7Nm188CBzN0PGMHJclK3LcHPQ4B5i+9fQheukxde+WPs4qkZR0ZbCtMTPMmxxD0X/2o2QEEENY+bP7Ti7Kmd2WeL3OJJgssE0ou6y7itUd1Gfw8PCoCuqW7Zlq1bqUvZZ9Y8/4J/2c4PMycZj6QnKntMVV/xI34muOw/E7f88Q/zmSqX4nKBRMYP/aBBo6cjHRKEISpIdcfO73YH0Tv7SN7JfB+VpTVEciUxsrjgCmWQeIdCKFeBzSH27CIihEaU/rA9nim6FJcLZMvmjV0WjmhPl95IR0FBPp5oa268rmdeQWEhMIA4hougjGCJloUqcQwS5v4ayUuexdCFjyJx8VNIXPQkwsYtQKXDGweb2NAT72E2m3t+6GJcLhCKxJSR22pae9IBiUiAuFD/Rc8893wIXdEHggL9weJciE88gmMhHXk3/mMIx/QF90Hk5U/HvHabHQ67A1yJB3xihiNm0gIc7vbC9w0s8D1JGzfALQSSmjF2Z7cNRT2uHQjwUigPfJ/Z517H29LGNGk58iaIFdA4hJAkT0FYwnBsXbMYUgEXpXUt+PeRAny29zhaNXraNOrNFgyLDMKXGx7BhDAx0qfPZY7mWtxCICQzt3kHhnxR19hMl3095VAp5ev3Hj0eRldcAx8/v06DNOBk1JzVYCfOQKvOAJGAB4VUjFYSSq949RN8uOMAtnxzENt+OI6C0mpM/+2f8NDGT4jW2KDheMDOEe5kDudSXJKHXI6ImNj8dnXr0jA/Hxn18JHLYcszD2btlnvIDDNmzXznvmXLuZm7dhUxzX9CeFTsUIVZ/WZ6fAhyShphtFgRG+JH75OKRZiZkQSpkI8QfxVWzMxAxaksWHkkLmaxkRjuj2+r7fvHTJv91s7t2yz0j1yIW2gIxZcff6RlST33msjFpCBmC2yz/hmWw/nqihTvpfbinK8evP/eyz7mKD1bBDnJ+qhnZeUNzahuaiMZek/wS9VxTN3wM9ZjUogAfFItFYkRp+RgxZSR0FjZmL3i8T0r71t0oZ/AhbiNQCjGpKX9Lb+4jNh9HiJ9lQhX8Cb6K0ULPMRCzMuIQ7zcsYLkHClM8/MkDE8qOtekzapp1aChuQ0l1Q0/ecSvUPkifepMJIwcTQvI4bDirgljET8kDO0aHdT1tUxL1+M2Avnw6/94VRYXvn5veixuj/ZGUrAUj04fiVVTkoVccm0pRzxtVBxqq6suCYnXrlppixiRMe+xd3edPJhfjvKmdhiJ0/4J1AEYunQ6SGQycHg8dGg0eHPTJmaP63EbgRza9e+XZkVJR8WHBxBz46TvZOoujwhU0SErhUQoQARHO3H0HVOUdMVF2CzmiIbGphSb3Y6alg5U1jXB6bDDSvKLbqMZpWUVKDpbiIryMrCddhi6u2iz9mNBBRobG5mjuJ4Leu1C/vndnpCiHR/nLZ2QqKQEcTU+25eLN74+5KfpaG9hqmjihyX+tuhMwWbqO4fNRjRx6ueqL3+hpQIO4sICMSo+Ap/uO0GiZa+nG+tqX2N2uxS30JDsI1nGhjZtE3VnX2T6L4HSmC4bq/TpFzd0M1Xn0XZ2nn8WZXc4rigMim6zHSdKavHOvw9C06VHcnISs8f1uIVA3n7lJbU0avi07SX67bnFV3awXQYT6k3c755//Dd6porm2d+/HG00mX7xVeUIRMw31+M2PuStP75c++d3tswrqG6mNYGC+mzQmNDabYHZZMLW7fsx5s7pl3jg2sryeLPFJmSK103OoYMjHn9mrVs87XULH3IxTzz68JHpQ6TpkcSZn6nTorrDCOLiESa24sfDJ/Fm5olL/uZ9p86kOJ2OxmVzZ+9tbW4aKhQKYTLoMTZxCO3ga5rbYbXZmdY9glaShDHAwwPDx49FLAkWajq0sEpllUnjJ6x9YsXDLutBdDuB/Gv3ntQjW//w46+npwobNEYUanl0li0XsKBrqkEFyzvPIFB+FREd88Zjy5eeH4X3uxfXK48fPZpJnP3jUQnDcO7ksR8+XTNfKBIJ0K03oYIki5XtRoj8IhEaFYPWnd+Ax+djynO/g93uRGVVDRr3ZeKjf31bnbF8+YPP/e65Q8yhbypu8+ikF6W379BEiX5ZoIQKc3kI8vdFjJ8MgUoRwoL9kRwk9zO21k3MOpI1NOPOGSUnjh+jH4Al3jbaMjRx2Bkxh51u7GxPio6PG5OeFMs1cqWozi1GcOJojJm1CNFxCfDz84VYroC6ohZDMtJgs7HQ3NKK+qxjkLS1Kar54qjAyCGflJ0rctB/1E3E7TTksdWrXp2n0jzj5SGCUBUKFvvy94zeZEHmyTJk1xs+HhIVs7+kpGSuiGW9O0BdjxlzZiFyeDycbB4a2zTwDQiFQBVCTBWV3zAHoHGgRd2KDp0R9XU1qN22HS1VVQi9715UqbVr3vvzW28wDW8abieQBZPTP3l6UtQSZVAE2Jxr9+R2dhlxpqoRaUmx4MFGZ+SXzWTIsezkfhcEJ4DlHUHOvCeeoeKH3C++RO7R4+CSBNHS1Y3YKeNwuMOQ8/7nn6fRjW4ibhNl9eItk6QI+LwrasbPUcpEuD0xElynlc7ur5hW2m3gOG2w1ebDXHwILJOGrqY0Jv7OiTBrNLAaSQDhdMDc3gEJn+eSeS1uJxBYDfEshxU24yW53w2DbeiApfhHOLQ9yb7IywczN6xD0pwZCCGmbsxTa2ASilzSP+JWAjlw6vREf4WUvm0tup6RKP2GnWhUczFTACxmC9rqWtBaXofM/QfRZba4JPR1K4FoNVo4zMx4NWJKHLaevpFeqPyhd7sROBmzSB1O3dEOtVaDap0Op88U/fXzD/++h955k3Ergdw9Yfz+GjP7pNlGpGEzwdhcSTSlg9nLQl6tDgdK2rDvnBqtgkAc3X8GhTlnie3/ZSNG2KKesXE2sxn1hw7D1NQMtY/PsZTbx79A73ABbpeHjJuzqLWxonRhjK+M3LhUmEpCIw4PbDYLdZ1GdBqIfyHhkrZDh3P/3guz1YGio0UwEs3y8vcEl9vXU2KBGzQM4IuhqW/A7j//BTUisemuVavnr35oWQXT6KbjdgI5duRw8Yg7Z/PKSstuDyD+RMxzwmo2wcERQBA2HA111CQralqDGQKSYWesXI7RS5fBc+gI6PgKtOafgUTCI1EuOTWiaCyxHCwByTKtBvK7C6aOJZCCQwmE1EmUUhR26U1WL9Xsl//vuSM9LVyD2wmEIic750DMhLlf7S5okHazpcnDx02BYsRUSLxUyM89geq6RlTVNaOmqRV8uRdiU1JhcbKg0XTju3Wb4J0yHn4jM8D2CUebwBddGjtJMoPA8w4BWxEIniocerYnGorOwScsBMfzzuJ4/pm1/3j/b58yf4LLcEuBUJw6lqMuKyv9JmP2orbMo/lBPxzObskrPNeSnZvHr66pE3V2G2GUSPfzvX0iYiLD6G7ZNrUaJZl74ZucCFl4JEzk9KqqqrF3w8toJybOL3U0TGwByupbsfeVzajJL4Bvagre++Djf4QEBT6XdSTrpj8q+Tlul6lfi217vw9545WNCpWvL1Y+/ljVt39/VzcqMBAmiwV6Ytoq/vk1ybQnwjMykk76mjo1aNq5C8qIcCRMnQgdEUyrVouOQ0dIlMWCcfQoi0/4kGHrfrumlPknXMqAE8jPeWTOtAqPk2ciLMSfGB0OeIrFEEpF9AA4o7YbbXY7VAIBuDwuPIP80FxWjQ6yz5vUaUjY0D1u3NrPP/7YbUY5DHiBzL/7rk+e/82vl9isNnRqNDj+1jtIWTAXoaNvo516ZX09iv/+MQIThyHlnvn045E6Et6WfPEv7Fe3N+3IzglgDuUWuN+jk+vEgzh6eUg4ZEGhEHj6wECSS45QCI+AIMiDwyDzUcFM/I2daIqEfJcHhxIH70/MmxU6Hn8fcxi3YcALROChhMFkpmf3WogfMeoNsFmsPWW6zgoT0QoLaWMjpqq33m61QsDhiB59+tlf3PXbH7htlNVXJkyZMofT1ZnU3tyEhupKVOSehCw4CDa2A2pimspKS9CQlw+2REzCXRVaaqpQUV1N8pU8NLZVxWvNzuDy8vJvmMO5nAHvQ6bPnT/ZL+9kptxmh4GYJQVx1mIPCTFRlFPXo8Npga9IRG49DiR+HlAbtNgtmoJJ3CMQsK34sUp3csETL6StXbXS5QOtKQa8hjy0anUkW8RfMmnhXKgS4qEtK0PctKkIzYgDL6AOwWlCeA3jQ89hQUtMGl/gQAvbHw6uEFaeN3jWzgBZcNTRrIMHyphDupQB70OSRwzPqe7WNwii4tAoC4UkSoX6lnMk//geogAHBGIWOERBWD4KlIvSkC1dCIMkGqXiCciTzkKtbBS8PD3dZizpgNeQTz943+LvKfevOLgz7VSlDlxrE0y6Fih8LRCJHDBbBajURCK363ZUYRhMPB+iHWKwWBywOFyYHHx4CnQVuVmHsplDupQB70Mo7l9y32ZVfc5vO7n+qEQE5GI+WoQx4FDJn8WDnKTjil3CdpsZ8o7Mb47u2z6HqXIpA95kUXgovdBpE6JGMgpN/BhUiNOIz/CBzkYtcsO6av88h8OHzuhI/2LXbreY9TkoBELykA+ztUp1qzgRXIk30QhK8Xu3a0CaOBTJPl/848vxTI1LGRQC+ei9d4s8A8KaqM4sNldALvL1nBYLbGkgalss67LPFrlcSwaFQCg85L1LlVxeKyhh0b2PzHf6QRcDm02cu3RY7AdbP1jJVLmMQSMQ6rHJT+np/rVbDLDpW8E1NYDXmQtNwacF1rJ/ldqMnXQbGhbREokK+3Mq5n+5a/cls7NuJoNGIK3NP5lQBbu5G/a6vSYfc872JGX54ihJedLDC0Ym1RfuS7pn7rjxQt3p2l6NoWCTMJirSok/8P33Ll3Ktg9eb2DgFZKU75/xRGLvKWmLd5g2PLNo9vJFC/fSFT/jnvuWzj3Z4v21UDWUlHp+QwmI3fR94f0LxqWuXbXywvq2N5FBoSGZx06H+IYnBZ+/v5xOkos4tFcSBsWcpb/6zgs1ex22n5o6Pct3qLq6YjpTvOkMCoGcOZ6l4PKF520/daeLPLyuukzgosnpptvThz3paMkh7Xsm87BIdMZXhOHIiUKXrVc/KASSc/gQLDYWLQgKp92C1tryyy7DcTGbN7xY5C3QbrLpqWGrPQ6eI/SAV0D4XXTBBQwKgbS0kgvKlzIlkujZrQgJDWRKV2fylPGbZKbCzounY1c0dLos0hoUAjEaDGDzLgiEMkHhYX3rKl+35vF2PrqWO/RNtO+hYHE8Etdt3DSVLtxkBoVAxk+emuLk9k5tJvmHzQR/Zd97Zp9/8pEscXdBEbUGCjWQ26mIx75DeS6ZlTsoBEKMVDw1cZNyypTp4XMcqK+u7vP8jhnTpqnDAkRbTJ01pMQCV+CBNpv/0jmLH3iop8XNY1AIREAv8E+dSo/JsVpMaGhWX7Jq0NXIOnxg2/lx2kRLeN7xXHUXbxlTc9MYFAIxWcxZHIeB1g5KMDxFJOp5Y16/Y/YDfR7FbtN3E1NnOR+pUZri7eOVzhRuGoNCIHy+oMiuqzZdPJFHoAhBSWVrn6Ol+Qvv6fZ2lO7RNxeSUo+mUWO5bjaDQiAbN6wvFdjb852OC8+mKNgkFL578QN9Ml1bt2zRP/Xsk2vYTmoGF9WjwkJheSeeXrf+ukzff8ugEAjFkHDfbRY99UoQJnQlpksRO1PZZeK9Qlf0gfVrHk9hCxU9BaJtoqAxOH2mqs+/vxEMGoEseXB5ljdHTfuRXuhHIfy+j+MIHRJzv0AezJTI79kcVHeIJk+ZNj2Zqep3Bo1A7kiNK5Bz2n8ypYCatW4zUzOn+kZTfSNYPGYZcipAIP/JAhLBEsq/nTJ91k1ZinzQCEQh99T7Bcm+sxmoSaKUlpCNOOVajWRM4ojU/3vkiaeumXl7KmUYkxCAyWmxWDQtGb9aMAZPPTwTSx79fUhAaPjXTLN+ZdAIhCI2OuxUyhAPTMuIxfxJQ/HArFQ8+uhq2cq1b74kEHl8xDS7IlabrSo9yRdjR4QjYUgAgv2UkIr4kEjlUAXHRfxzzw/97uAHlUCcZi4WzJuFtOQIJMWGICrUByGBPggIiSb6IuDvyT561Xfzzpg7b1Np4QmmdAHKLwWHxfG3ffrRLKaq3xhUAunubB9hNmqZ0gWoC6pUhSg3PL3mqnf42lUrK436ThIM9PYgOmE2dUPXWo2mulLqLUBMCNZ/DCqBRIaHFXXr2mC3WWHSa9DZXI6msmNoOHcEGnWdA2zONVcYkHBNn727ebX+yOcvQZe/HcbiXeC1HkPFsR0IDY/YzzTrNy6ktoOE5156ueLUsZMRk0ZEoaWlEQZ9z3qZrTqT5bmNr6UNj4+/5gvHNvxl89S8fQd3J4UFw2yxwGI2kuMYwPMKzPrTO1symGb9woDVEE2XNt5g7L5kYNsrLzwf6espyWvVaOG86NGHSi7mf/PF59SIhmvy4qqn9wi5woK4hKFIGzsWGXfcidtGjUFDVXn6lq1b+3Uw3YAViEImLxKLpJd9AaV/QOA+pacXomJjzyeKLKcDdVXlfRri8/XX2/xtJr1/TtYR/PjDfhw+sB9nCvIgE3Dw3c6d/TpMaFD5kF5sdvs/DmUf7ayrqbngoMnW3FAfv37DhmsmeK+/8WYIy27ziYmNQ9KIVCQkjUBiUjKUHjISyekfenXzpr71D/8CBqVABHw+UlNSlMNTUpmaHgJVnti7Z/c173CRUDBfJODSWpH14wHk5hzG8WNHYbHZ4CkRyNrV6nuZpjecAe/Up0+bMlml8psvlUmFlZWV+9s6Opv8/XzDLbrOrQlDQuj+9otp6zJi7KRpw3+z+rE8puoSHli8sFnOsfs6GHN3MdQj+dpO4zff7dnbL/NJBqyGUO86vPfeRbuUfGQ6dS0rdPUVSzy59o8ifTwyxTbD1lBf5SXCoBBxgJ07dy5gipdA9sm6Oju4V1q9kcfjwmaxxB89mtMv06kHrEAa6urGalvqpytkEkglYsikYsg9pPCUk00ho9/bfjmodhKh4Irjro4dPz6Gz2V7XUY5aBwOJ7wUsuiS0tJopuqGMmAFUllVlSIT/7Kb1NjVsyLp5dixYweEnKtfFpbditLi4n4Z3ThgBWLQd4N/jdXjqLuZCnupSIua2ibic5EcqsLMscODicm57HsSu9paICbh7dVQinloa6zpl/72ASuQuLjYiXHBfiQq6bnovRefR+5uL6kAsYFemJkShjvjg/Do1OH09qs7kzEhMQRWi1VkNJouq14+QSGIDvBCmEoOmZAHCYm2JESQCjEfvgoJYshxJwwLRXdX/yxjO2CjrCeffHKqylT/bcawSH67wU4EwaJfIsml1sAy6FHVpnecqW8/pjY4+RmRXikSsdBktliFWqNVm9/Qtemzf3512a7ZP27cKDPWFp6bnhgUSPkm6rVITieLRFdWennz2rYuFLV0l5apTXM+//LLa44fvl4GdNi7bPny+Uqu9VW5WBBhtjnQ1KLeb3TyGh1szqnpM2acfnDpg4eIafLSanUpAQF+jWazJYBc5DOxcQmXzfB7+c3q1dH1laWr2OZuJY/thMFog8lhR9SwFPBFkk8nTZx48K677nKLpThucYtb3OIWt+gB+H8ajA/HL9a+bQAAAABJRU5ErkJggg=="></div>
                <div class="center mt-2">Chop</div>
            </itembox>
            `);$("#panel-woodcutting itembox").first().after(`
	        <itembox id="slapchop-rain-pot" class="shadow hover" data-item="slapchop_rainpot" onclick="websocket.send(DRINK=rain_potion)">
                <div class="center mt-1"><img width="50" height="50" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rain_potion.png" title="rain_potion"></div>
                <div class="center mt-2">Chop</div>
            </itembox>
            `);
        }
 
        quickChop() {
            for(let i = 1; i <= 5; i++) {
                let status = IdlePixelPlus.getVarOrDefault("tree_stage_"+i, 0, "int");
                let treeType = IdlePixelPlus.getVarOrDefault("tree_"+i, "none");
                let sdCut = this.getConfig("quickChopSDTreesEnabled");
                let regCut = this.getConfig("quickChopRegTreesEnabled");
                if((status == 4 && treeType != "stardust_tree" && treeType != "tree") || (status == 4 && treeType == "stardust_tree" && sdCut) || (status == 4 && treeType == "tree" && regCut)) {
                    IdlePixelPlus.sendMessage("CHOP_TREE="+i);
                }
            }
        }
 
        initQuickHarvest() {
            $("#panel-farming itembox").first().before(`
	        <itembox id="slapchop-bob" class="shadow hover" data-item="slapchop_bob" onclick="IdlePixelPlus.plugins.slapchop.quickHarvest()">
                <div class="center mt-1"><img width="50" height="50" src="data:image/png;base64,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"></div>
                <div class="center mt-2">Harvest</div>
    </itembox>
    `);
        }
 
initPresets() {
    $("#combat-presets-area").append(`
	          <br />
              <br />
              <img data-tooltip="Preset 6<br /><br />Hot key not implemented" id="in-combat-presets-icon-6" onclick="loadPresets(6)" class="combat-presets-combat-icon hover w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee.png" />
              <img data-tooltip="Preset 7<br /><br />Hot key not implemented" id="in-combat-presets-icon-7" onclick="loadPresets(7)" class="combat-presets-combat-icon hover w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee.png" />
              <img data-tooltip="Preset 8<br /><br />Hot key not implemented" id="in-combat-presets-icon-8" onclick="loadPresets(8)" class="combat-presets-combat-icon hover w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee.png" />
              <img data-tooltip="Preset 9<br /><br />Hot key not implemented" id="in-combat-presets-icon-9" onclick="loadPresets(9)" class="combat-presets-combat-icon hover w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee.png" />
              <img data-tooltip="Preset 10<br /><br />Hot key not implemented" id="in-combat-presets-icon-10" onclick="loadPresets(10)" class="combat-presets-combat-icon hover w30" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/melee.png" />
            `);
        }
 
quickHarvest() {
    for(let i = 1; i <= 5; i++) {
        let status = IdlePixelPlus.getVarOrDefault("farm_stage_"+i, 0, "int");
        if(status == 4) {
            IdlePixelPlus.sendMessage("CLICKS_PLOT="+i);
        }
    }
}
 
initQuickGrind() {
    GRINDABLE.forEach(item => {
        $(`#panel-invention itembox[data-item="${item}"]`).on("contextmenu", event => {
            if(this.getConfig("quickGrindRightClickEnabled")) {
                const primary = this.isPrimaryAction(event);
                const alt = this.isAltAction(event);
                if(primary || alt) {
                    this.quickGrind(item, !primary);
                    event.stopPropagation();
                    event.preventDefault();
                    return false;
                }
            }
            return true;
        });
    });
}
 
quickGrind(item, alt) {
    //console.log("quickGrind", {item, alt});
    let n = IdlePixelPlus.getVarOrDefault(item, 0, "int");
    singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
    if(alt || singleOverride) {
        n--;
    }
    if(!alt && !singleOverride && n>1) {
        n = 1;
    }
    if(n > 0) {
        IdlePixelPlus.sendMessage(`GRIND=${item}~${n}`);
    }
}
 
initPresetListener() {
    document.addEventListener('keyup', (e) => {
        switch(e.keyCode)
        {
            case 54: //6
                var chat_focused_6 = $('#chat-area-input').is(':focus');
                if(Globals.currentPanel == "panel-combat-canvas" || (Globals.currentPanel == "panel-combat" && !chat_focused_6)) loadPresets(6);
                break;
            case 55: //7
                var chat_focused_7 = $('#chat-area-input').is(':focus');
                if(Globals.currentPanel == "panel-combat-canvas" || (Globals.currentPanel == "panel-combat" && !chat_focused_7)) loadPresets(7);
                break;
            case 56: //8
                var chat_focused_8 = $('#chat-area-input').is(':focus');
                if(Globals.currentPanel == "panel-combat-canvas" || (Globals.currentPanel == "panel-combat" && !chat_focused_8)) loadPresets(8);
                break;
            case 57: //9
                var chat_focused_9 = $('#chat-area-input').is(':focus');
                if(Globals.currentPanel == "panel-combat-canvas" || (Globals.currentPanel == "panel-combat" && !chat_focused_9)) loadPresets(9);
                break;
            case 48: //0
                var chat_focused_10 = $('#chat-area-input').is(':focus');
                if(Globals.currentPanel == "panel-combat-canvas" || (Globals.currentPanel == "panel-combat" && !chat_focused_10)) loadPresets(10);
                break;
        }
    });
}
 
onPanelChanged(panelBefore, panelAfter) {
    if(Globals.currentPanel == "panel-woodcutting") {
        let woodCuttingElite = Achievements.has_completed_set('woodcutting', 'elite');
        if(woodCuttingElite) {
            $("#rain_pot-woodcutting").show();
        } else {
            $("#rain_pot-woodcutting").hide();
        }
        if(Globals.currentPanel == "panel-combat") {
            var lamps = IdlePixelPlus.getVarOrDefault("combat_xp_lamp", 0, "int");
            if(lamps == 0) {
                $("#quick-lamp-zone").hide();
            } else {
                $("#quick-lamp-zone").show();
            }
            this.updateQuickFight();
        }
    }
}
 
 
onConfigsChanged() {
    if(onLoginLoaded) {
        const slapchopQuickFight = document.querySelector("#slapchop-quickfight");
        const slapchopQuickFoundry = document.querySelector("#slapchop-quickfoundry");
        const slapchopQuickPreset = document.querySelector("#slapchop-quickpreset");
        const slapchopQuickFightFPBar = document.querySelectorAll(".slapchop-quickfight-fightpoints");
        const slapchopQuickFightEnergyBar = document.querySelectorAll(".slapchop-quickfight-energy");
        const slapchopQuickSmelt = document.querySelector("#panel-mining > div.slapchop-quicksmelt");
        const slapchopQuickBrewButton = document.querySelectorAll(".slapchop-quickbrew-button");
 
        if (this.getConfig("quickFightEnabled")) {
            slapchopQuickFight.style.display = "block";
        } else {
            slapchopQuickFight.style.display = "none";
        }
 
        if (this.getConfig("quickFoundryEnabled")) {
            slapchopQuickFoundry.style.display = "block";
        } else {
            slapchopQuickFoundry.style.display = "none";
        }
 
        const presetsUnlocked = IdlePixelPlus.getVar("combat_presets") == "1";
        if (presetsUnlocked && this.getConfig("quickPresetsEnabled")) {
            slapchopQuickPreset.style.display = "block";
        } else {
            slapchopQuickPreset.style.display = "none";
        }
 
        if (this.getConfig("quickFightFPBar")) {
            slapchopQuickFightFPBar.forEach(bar => {
                bar.style.display = "block";
            });
        } else {
            slapchopQuickFightFPBar.forEach(bar => {
                bar.style.display = "none";
            });
        }
 
        if (this.getConfig("quickFightEnergyBar")) {
            slapchopQuickFightEnergyBar.forEach(bar => {
                bar.style.display = "block";
            });
        } else {
            slapchopQuickFightEnergyBar.forEach(bar => {
                bar.style.display = "none";
            });
        }
 
        if (this.getConfig("quickSmeltEnabled")) {
            slapchopQuickSmelt.style.display = "block";
        } else {
            slapchopQuickSmelt.style.display = "none";
        }
 
        if (this.getConfig("quickBrewButtonEnabled")) {
            slapchopQuickBrewButton.forEach(button => {
                button.style.display = "block";
            });
        } else {
            slapchopQuickBrewButton.forEach(button => {
                button.style.display = "none";
            });
        }
 
        if (this.getConfig("quickHarvestEnabled")) {
            window.var_slapchop_bob = "1";
        } else {
            window.var_slapchop_bob = "0";
        }
 
        if (this.getConfig("quickChopEnabled")) {
            window.var_slapchop_lumberjack = "1";
        } else {
            window.var_slapchop_lumberjack = "0";
        }
 
        const notificationTreesReady = document.getElementById("notification-trees-ready");
        if (IdlePixelPlus.plugins.slapchop.getConfig("quickTreeNotificationHarvestEnabled")) {
            notificationTreesReady.setAttribute('onClick', `IdlePixelPlus.plugins.slapchop.quickChop(); switch_panels('panel-woodcutting')`);
        } else {
            notificationTreesReady.setAttribute('onClick', `switch_panels('panel-woodcutting')`);
        }
    }
}
 
onLogin() {
    singleOverride = IdlePixelPlus.plugins.slapchop.getConfig("autoSingleEnabled");
    this.initStyles();
    this.initQuickFight();
    this.initQuickSmelt();
    this.initQuickCook();
    this.initQuickEat();
    this.initQuickPlant();
    this.initQuickBones();
    this.initQuickPotions();
    this.initQuickBoat();
    this.initQuickBait();
    this.initQuickNeedle();
    this.initQuickBrew();
    this.initQuickGather();
    this.initQuickBurn();
    this.initQuickFeather2Arrow();
    this.initQuickFoundry();
    this.initQuickChop();
    this.initQuickHarvest();
    this.initQuickGrind();
    this.initQuickRocketFuel();
    this.initQuickMining();
    this.initQuickCleanse();
    this.initQuickMineral();
    this.initPresets();
    this.initPresetListener();
    this.initQuickExplode();
    this.initQuickLamps();
 
    this.updateQuickFight();
    this.updateQuickSmelt();
    this.updateQuickFoundry();
 
    if(IdlePixelPlus.plugins.slapchop.getConfig("quickTreeNotificationHarvestEnabled")) {
        $("#notification-trees-ready").attr('onClick', `IdlePixelPlus.plugins.slapchop.quickChop(); switch_panels('panel-woodcutting')`);
    } else {
        $("#notification-trees-ready").attr('onClick', `switch_panels('panel-woodcutting')`);
    }
 
    if(IdlePixelPlus.plugins.slapchop.getConfig("quickHarvestNotificationEnabled")) {
        $("#notification-farming-ready").attr('onClick', `IdlePixelPlus.plugins.slapchop.quickHarvest(); switch_panels('panel-farming')`);
    } else {
        $("#notification-farming-ready").attr('onClick', `switch_panels('panel-farming')`);
    }
 
 
    $('head').append(`
               <style id="rare-potion-in-combat-styles">
               .fighting-monster-loot-potion{
                   background-color: rgba(32, 36, 33, 0.67);
                   border-color: rgb(255, 255, 255) rgb(255, 255, 255) rgb(255, 255, 255) rgb(255, 255, 255);
                   color: rgb(232, 230, 227);
                   border: 1px solid black;
                   border-top-color: black;
                   border-top-style: solid;
                   border-top-width: 1px;
                   border-right-color: black;
                   border-bottom-color: black;
                   border-bottom-style: solid;
                   border-bottom-width: 1px;
                   border-left-color: black;
                   border-left-style: solid;
                   border-left-width: 1px;
                   padding: 10px;
                   color: white;
                   border-bottom-right-radius: 5px;
                   border-top-right-radius: 5px;
                   margin-right: -3px;
                   margin-top: 20px;
               }
               .fighting-monster-rain-potion{
                 background-color: rgba(38, 115, 153, 0.67);
                 border-color: rgb(33, 207, 247);
                 color: rgb(232, 230, 227);
                 border: 1px solid black;
                 border-top-color: black;
                 border-top-style: solid;
                 border-top-width: 1px;
                 border-right-color: black;
                 border-bottom-color: black;
                 border-bottom-style: solid;
                 border-bottom-width: 1px;
                 border-left-color: black;
                 border-left-style: solid;
                 border-left-width: 1px;
                 padding: 10px;
                 color: white;
                 border-bottom-right-radius: 5px;
                 border-top-right-radius: 5px;
                 margin-right: -3px;
                 margin-top: 20px;
               }
               </style>
               <style id="lumberjack-rain-pot-woodcutting-style">
               .lumberjack-rain-pot-woodcutting{
                 width:100px;
                 height:100px;
                 display: inline-block;
                 border:1px solid rgb(66, 66, 66);background: rgb(8,115,0);
                 background: linear-gradient(0deg, rgba(8,115,0,1) 6%, rgba(55,45,253,1) 25%, rgba(55,45,253,1) 50%, rgba(101,101,101,1) 75%, rgba(52,52,52,1) 100%);
                 border-radius: 5pt;
                 color:white;
               }
               </style>
            `);
            $('#game-panels-combat-items-area .itembox-fight').first().after(`
            <div id="rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
               <div class="center" style="margin-top: 0.55rem;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rare_monster_potion.png" title="fight"></div>
               <div class="center" style="display: flex; justify-content: center;">
                  <div id="rare_monster_potion-brew" class="hover" style="padding: 3px; width: 50px;" onclick="IdlePixelPlus.plugins.slapchop.quickBrew('rare_monster_potion')">BREW</div>
                  <div id="rare_monster_potion-use" class="hover" style="padding: 3px; width: 50px;" onclick="Modals.clicks_rare_monster_potion()">USE</div>
               </div>
            </div>
      `)
            $('#rare-monster-pot-in-combat-tab').after(`
             <div id="super_rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
               <div class="center" style="margin-top: 0.55rem;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/super_rare_monster_potion.png" title="fight"></div>
               <div class="center" style="display: flex; justify-content: center;">
                  <div id="super_rare_monster_potion-brew" class="hover" style="padding: 3px; width: 50px;" onclick="IdlePixelPlus.plugins.slapchop.quickBrew('super_rare_monster_potion')">BREW</div>
                  <div id="super_rare_monster_potion-use" class="hover" style="padding: 3px; width: 50px;" onclick="Modals.clicks_super_rare_monster_potion()">USE</div>
               </div>
            </div>
`)
            $('.fight-left-border .td-combat-bottom-panel').after(`
            <div style="" id="fighting-combat_loot_potion" onclick="websocket.send('BREWING_DRINK_COMBAT_LOOT_POTION')" class="fighting-monster-loot-potion hover shadow">
               <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/combat_loot_potion.png" title="combat_loot_potion_icon">
               <span id="combat_loot_potion-label" style="color: white;">Loot Potions: 0</span>
            </div>`)
            $('.fight-left-border #fighting-combat_loot_potion').after(`
            <div style="" id="fighting-rain_potion" onclick="websocket.send('DRINK=rain_potion')" class="fighting-monster-rain-potion hover shadow">
               <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/rain_potion.png" title="rain_potion_in_combat_icon">
               <span id="rain_potion-in-combat-label" style="color: white;">Rain Potions: 0</span>
            </div>`)
            $('#slapchop-lumberjack').after(`
             <div id="rain_pot-woodcutting" class="lumberjack-rain-pot-woodcutting" data-tooltip="rain_pot">
               <div class="center" style="margin-top: 0.55rem;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rain_potion.png" title="rain_potion"></div>
               <div class="center" style="display: flex; justify-content: center;">
                  <div id="rain_potion-brew" class="hover" style="padding: 3px; width: 50px;" onclick="IdlePixelPlus.plugins.slapchop.quickBrew('rain_potion')">BREW</div>
                  <div id="rain_potion-use" class="hover" style="padding: 3px; width: 50px;" onclick="websocket.send('DRINK=rain_potion')">USE</div>
               </div>
            </div>`
            )
 
 
            setTimeout(function() {
                onLoginLoaded = true;
                IdlePixelPlus.plugins.slapchop.onConfigsChanged();
            }, 5000);
            loaded = true;
        }
 
 
onVariableSet(key, valueBefore, valueAfter) {
    if(onLoginLoaded) {
        if (Globals.currentPanel != "panel-combat-canvas") {
            //$("#slapchop-rain-pot-woodcutting").show();
            if(Globals.currentPanel == "panel-combat") {
                if(key.includes("combat_xp_lamp")) {
                    var lamps = IdlePixelPlus.getVarOrDefault("combat_xp_lamp", 0, "int");
                    if(lamps == 0) {
                        $("#quick-lamp-zone").hide();
                    } else {
                        $("#quick-lamp-zone").show();
                    }
                }
            }
            if(["fight_points", "energy", "volcano_unlocked", "northern_field_unlocked","blood_moon_active"].includes(key)) {
                this.updateQuickFight();
            }
        }
 
        if(Globals.currentPanel == "panel-mining" || Globals.currentPanel == "panel-crafting") {
            if([...SMELTABLES, "oil", "charcoal", "lava", "dragon_fire", "stone_furnace", "bronze_furnace", "iron_furnace", "silver_furnace", "gold_furnace", "promethium_furnace", "titanium_furnace", "ancient_furnace","dragon_furnace"].includes(key)) {
                this.updateQuickSmelt();
                this.updateMaxCraftable();
            }
        }
 
        if(Globals.currentPanel == "panel-woodcutting") {
            if([...LOGS, "oil", "foundry_amount"].includes(key)) {
                this.updateQuickFoundry();
            }
        }
 
        if (!loaded){
            this.delay()
            return
        }
 
        let variables = ['dotted_green_leaf', 'strange_leaf', 'red_mushroom', 'rare_monster_potion', 'super_rare_monster_potion', 'combat_loot_potion', 'combat_loot_potion_timer', 'rain_potion', 'rain_potion_timer'];
        if (variables.includes(key)){
            this.updateButtons();
        }
 
 
    }
}
 
async delay() {
    await new Promise((resolve) => {
        const checkLoaded = () => {
            if (loaded) {
                resolve();
            } else {
                setTimeout(checkLoaded, 2000);
            }
        };
 
        checkLoaded();
    });
 
    this.updateButtons();
}
}
 
const plugin = new SlapChopPlugin();
IdlePixelPlus.registerPlugin(plugin);
 
})();

(function() {
    'use strict';
    let marketTimer;
    let marketWatcherTimer;
    var marketRunning = false;
 
    const LOCAL_STORAGE_KEY = "plugin_market_watchers";
 
    const MARKET_HISTORY_URL = "https://data.idle-pixel.com/market/api/getMarketHistory.php";
    const MARKET_TRADABLES_URL = "https://data.idle-pixel.com/market/api/getTradables.php";
    const MARKET_POSTINGS_URL = "https://idle-pixel.com/market/browse";
 
    const IMAGE_HOST_URL = "https://d1xsc8x7nc5q8t.cloudfront.net/images";
    const COIN_ICON_URL = `${IMAGE_HOST_URL}/coins.png`;
 
    const XP_PER = {
        stone: 0.1,
        copper: 1,
        iron: 5,
        silver: 10,
        gold: 20,
        promethium: 100,
        titanium: 300,
 
        bronze_bar: 5,
        iron_bar: 25,
        silver_bar: 50,
        gold_bar: 100,
        promethium_bar: 500,
        titanium_bar: 2000,
        ancient_bar: 5000
    };
 
    const BONEMEAL_PER = {
        bones: 1,
        big_bones: 2,
        ice_bones: 3,
        ashes: 2,
        blood_bones: 4
    };
 
    const LEVEL_REQ = {
        // net
        raw_shrimp: "Cooking: 1",
        raw_anchovy: "Cooking: 5",
        raw_sardine: "Cooking: 10",
        raw_crab: "Cooking: 35",
        raw_piranha: "Cooking: 50",
 
        // rod
        raw_salmon: "Cooking: 10",
        raw_trout: "Cooking: 20",
        raw_pike: "Cooking: 35",
        raw_eel: "Cooking: 55",
        raw_rainbow_fish: "Cooking: 70",
 
        // harpoon
        raw_tuna: "Cooking: 35",
        raw_swordfish: "Cooking: 50",
        raw_manta_ray: "Cooking: 75",
        raw_shark: "Cooking: 82",
        raw_whale: "Cooking: 90",
 
        // plant seeds
        dotted_green_leaf_seeds: "Farming: 1<br/>Stop Dying: 15",
        red_mushroom_seeds: "Farming: 1<br/>Cant Die",
        stardust_seeds: "Farming: 8<br/>Cant Die",
        green_leaf_seeds: "Farming: 10<br/>Stop Dying: 25",
        lime_leaf_seeds: "Farming: 25<br/>Stop Dying: 40",
        gold_leaf_seeds: "Farming: 50<br/>Stop Dying: 60",
        crystal_leaf_seeds: "Farming: 70<br/>Stop Dying: 80",
 
        // tree seeds
        tree_seeds: "Farming: 10<br/>Stop Dying: 25",
        oak_tree_seeds: "Farming: 25<br/>Stop Dying: 40",
        willow_tree_seeds: "Farming: 37<br/>Stop Dying: 55",
        maple_tree_seeds: "Farming: 50<br/>Stop Dying: 65",
        stardust_tree_seeds: "Farming: 65<br/>Stop Dying: 80",
        pine_tree_seeds: "Farming: 70<br/>Stop Dying: 85",
        redwood_tree_seeds: "Farming: 80<br/>Stop Dying: 92",
 
        // bows
        long_bow: "Archery: 25",
 
        // melee
        stinger: "Melee: 5 <br /> Invent: 10",
        iron_dagger: "Melee: 10 <br /> Invent: 20",
        skeleton_sword: "Melee: 20 <br /> Invent: 30",
        club: "Melee: 30",
        spiked_club: "Melee: 30",
        scythe: "Melee: 40",
        trident: "Melee: 70",
        rapier: "Melee: 90",
 
        // other equipment
        bone_amulet: "Invent: 40",
 
        // armour
        skeleton_shield: "Melee: 20",
 
        // logs conver rate
        logs: "5% <br/> Convert to Charcoal",
        oak_logs: "10% <br/> Convert to Charcoal",
        willow_logs: "15% <br/> Convert to Charcoal",
        maple_logs: "20% <br/> Convert to Charcoal",
        stardust_logs: "25% <br/> Convert to Charcoal",
        pine_logs: "30% <br/> Convert to Charcoal",
        redwood_logs: "35% <br/> Convert to Charcoal"
    };
 
    const HEAT_PER = {
        raw_chicken: 10,
        raw_meat: 40,
 
        // net
        raw_shrimp: 10,
        raw_anchovy: 20,
        raw_sardine: 40,
        raw_crab: 75,
        raw_piranha: 120,
 
        // rod
        raw_salmon: 20,
        raw_trout: 40,
        raw_pike: 110,
        raw_eel: 280,
        raw_rainbow_fish: 840,
 
        // harpoon
        raw_tuna: 75,
        raw_swordfish: 220,
        raw_manta_ray: 1200,
        raw_shark: 3000,
        raw_whale: 5000,
 
        // net (shiny)
        raw_shrimp_shiny: 10,
        raw_anchovy_shiny: 20,
        raw_sardine_shiny: 40,
        raw_crab_shiny: 75,
        raw_piranha_shiny: 120,
 
        // rod (shiny)
        raw_salmon_shiny: 20,
        raw_trout_shiny: 40,
        raw_pike_shiny: 110,
        raw_eel_shiny: 280,
        raw_rainbow_fish_shiny: 840,
 
        // harpoon (shiny)
        raw_tuna_shiny: 75,
        raw_swordfish_shiny: 220,
        raw_manta_ray_shiny: 1200,
        raw_shark_shiny: 3000,
        raw_whale_shiny: 5000,
 
        // net (mega shiny)
        raw_shrimp_mega_shiny: 10,
        raw_anchovy_mega_shiny: 20,
        raw_sardine_mega_shiny: 40,
        raw_crab_mega_shiny: 75,
        raw_piranha_mega_shiny: 120,
 
        // rod (mega shiny)
        raw_salmon_mega_shiny: 20,
        raw_trout_mega_shiny: 40,
        raw_pike_mega_shiny: 110,
        raw_eel_mega_shiny: 280,
        raw_rainbow_fish_mega_shiny: 840,
 
        // harpoon (mega shiny)
        raw_tuna_mega_shiny: 75,
        raw_swordfish_mega_shiny: 220,
        raw_manta_ray_mega_shiny: 1200,
        raw_shark_mega_shiny: 3000,
        raw_whale_mega_shiny: 5000,
 
        //stardust fish
        raw_small_stardust_fish: 300,
        raw_medium_stardust_fish: 600,
        raw_large_stardust_fish: 2000
    };
 
    const CHARCOAL_PERC = {
        logs: 0.05,
        oak_logs: 0.1,
        willow_logs: 0.15,
        maple_logs: 0.2,
        stardust_logs: 0.25,
        pine_logs: 0.3,
        redwood_logs: 0.35
    };
 
    const CATEGORY_RATIOS = {
        ores: ["Coins/XP"],
        bars: ["Coins/XP"],
        bones: ["Coins/Bonemeal"],
        logs: ["Coins/Heat", "Coins/Charcoal"],
        raw_fish: ["Coins/Energy", "Energy/Heat", "Coins/Heat/Energy"],
        cooked_fish: ["Coins/Energy"]
    };
 
    const THEME_DEFAULTS = {
        default: {
            colorPanelsOutline: "#ffffff",
            colorPanelsBg:      "#ffffff",
            colorItemSlotsBg:   "#00ffdd",
            colorRowOdd:        "#c3ebe9",
            colorRowEven:       "#c3ebe9",
            colorText:          "#000000",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#3232d2",
            colorChartLineMin:      "#509125"
        },
        dark: {
            colorPanelsOutline: "#2a2a2a",
            colorPanelsBg:      "#333333",
            colorItemSlotsBg:   "#333333",
            colorRowOdd:        "#333333",
            colorRowEven:       "#444444",
            colorText:          "#cccccc",
            colorChartLineMax:      "#b41414",
            colorChartLineAverage:  "#0984f7",
            colorChartLineMin:      "#509125"
        }
    };
 
    const configurableStyles = document.createElement("style");
    document.head.appendChild(configurableStyles);
 
    class MarketPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("market", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>General<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "autoMax",
                        label: "Autofill Max Buy",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "marketSoldNotification",
                        label: "Notification on item sold",
                        type: "boolean",
                        default: true
                    },
                    //Zlef
                    {
                        id: "clickBrewIng",
                        label: "Click on a brewing ingredient to go to player market page.",
                        type: "boolean",
                        default: true
                    },
                    //End Zlef
                    {
                        id: "marketGraph",
                        label: "Show a 7-days price history when browsing items.",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Table<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "highlightBest",
                        label: "Highlight Best",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "altIDList",
                        label: "Player ID blacklist for alts",
                        type: "string",
                        max: 200000,
                        default: "PlaceIDsHere"
                    },
                    {
                        id: "heatPotion",
                        label: "Account for heat potion use in heat cost",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "extraInfoColumn",
                        label: "Show Extra Info on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "categoryColumn",
                        label: "Show Category on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyColumn",
                        label: "Show Quick Buy button on table entries",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "quickBuyAmount",
                        label: "Quick Buy button amount (0 = max)",
                        type: "number",
                        default: 1
                    },
                    {
                        id: "quickBuyAllNeedsAltKey",
                        label: "Require Alt-key when right-clicking to quick-buy all",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Theme<br/>------------------------------------------------",
                        type: "label"
                    },
                    {
                        id: "condensed",
                        label: "Condensed UI",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "theme",
                        label: "Bundled theme",
                        type: "select",
                        options: ["Default", "Dark"],
                        default: "Default"
                    },
                    {
                        id: "colorTextEnabled",
                        label: "Change text color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorText",
                        label: "Text color",
                        type: "color",
                        default: THEME_DEFAULTS.default.text
                    },
                    {
                        id: "colorItemSlotsBgEnabled",
                        label: "Change item slots background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorItemSlotsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgItemSlots
                    },
                    {
                        id: "colorPanelsBgEnabled",
                        label: "Change panels background color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsBg",
                        label: "Panels background color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgPanels
                    },
                    {
                        id: "colorPanelsOutlineEnabled",
                        label: "Change panels outline color",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorPanelsOutline",
                        label: "Panels outline color",
                        type: "color",
                        default: THEME_DEFAULTS.default.bgOutline
                    },
                    {
                        id: "colorRowAccentsEnabled",
                        label: "Change table row accent colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorRowOdd",
                        label: "Row accent color 1",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent1
                    },
                    {
                        id: "colorRowEven",
                        label: "Row accent color 2",
                        type: "color",
                        default: THEME_DEFAULTS.default.rowAccent2
                    },
                    {
                        id: "colorChartLineEnabled",
                        label: "Change history chart line colors",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "colorChartLineMax",
                        label: "History chart max price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMax
                    },
                    {
                        id: "colorChartLineAverage",
                        label: "History chart average price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineAverage
                    },
                    {
                        id: "colorChartLineMin",
                        label: "History chart min price line color",
                        type: "color",
                        default: THEME_DEFAULTS.default.colorChartLineMin
                    }
                ]
            });
            this.lastBrowsedItem = "all";
            this.lastCategoryFilter = "all";
            this.historyChart = undefined;
            this.marketAverages = {};
            this.currentTableData = undefined;
            this.lastSortIndex = 0;
            this.loginDone = false;
        }
 
        onConfigsChanged() {
            this.applyCondensed(this.getConfig("condensed"));
            this.loadStyles();
 
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            } else {
                clearInterval(marketTimer);
                clearInterval(marketWatcherTimer);
                marketRunning = false;
                $("#market-sidecar").hide();
            }
 
            if(this.getConfig("marketGraph")) {
                $("#history-chart-div").hide();
            }
 
            if(this.loginDone)
                this.refreshMarket(false);
        }
 
        addMarketNotifications() {
            const sideCar = document.createElement('span');
            sideCar.id = `market-sidecar`;
            sideCar.onclick = function () {
                IdlePixelPlus.plugins.market.collectMarketButton();
            }
            sideCar.style='margin-right: 4px; margin-bottom: 4px; display: none; cursor: pointer;';
 
            var elem = document.createElement("img");
            elem.setAttribute("src", "https://idlepixel.s3.us-east-2.amazonaws.com/images/player_market.png");
            const sideCarIcon = elem;
            sideCarIcon.className = "w20";
 
            const sideCarDivLabel = document.createElement('span');
            sideCarDivLabel.id = `market-sidecar-coins`;
            sideCarDivLabel.innerText = ' 0';
            sideCarDivLabel.className = 'color-white'
 
            sideCar.append("  (", sideCarIcon, sideCarDivLabel, ")");
            document.querySelector('#item-display-coins').after(sideCar);
            $("#market-sidecar").hide();
        };
 
        collectMarketButton() {
            $("#market-sidecar").hide();
            [1, 2, 3].forEach(n => {
                const button = $(`button#player-market-slot-collect-amount-${n}`);
                const collect = parseInt(button.text().replace(/[^0-9]/g,''));
                if(collect > 0){
                    websocket.send(`MARKET_COLLECT=${n}`);
                    button.text(button.text().replace(/[0-9,]+/, '0'));
                }
            });
        }
 
        updateMarketNotifications() {
            if(!marketRunning) {
                marketRunning = true;
                marketTimer = setInterval(function() {
                    websocket.send("MARKET_REFRESH_SLOTS");
 
                    setTimeout(function() {
                        const total = [1, 2, 3].map(n => {
                            const collect = parseInt($(`button#player-market-slot-collect-amount-${n}`).text().replace(/\D/g,''));
                            return isNaN(collect) ? 0 : collect;
                        }).reduce((a, b) => a + b, 0);
                        if(total > 0) {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").show();
                        } else {
                            $("#market-sidecar-coins").text(" " + total.toLocaleString());
                            $("#market-sidecar").hide();
                        }
                    }, 50);
                }, 10000);
                marketWatcherTimer = setInterval(function() {
                    IdlePixelPlus.plugins.market.checkWatchers();
                }, 30000);
            }
        }
 
        applyCondensed(condensed) {
            if(condensed) {
                $("#panel-player-market").addClass("condensed");
                $("#modal-market-select-item").addClass("condensed");
            }
            else {
                $("#panel-player-market").removeClass("condensed");
                $("#modal-market-select-item").removeClass("condensed");
            }
        }
 
        getStyleFromConfig(enableId, colorId) {
            return this.getConfig(enableId) ? this.getConfig(colorId) : THEME_DEFAULTS[this.getConfig("theme").toLowerCase()][colorId];
        }
 
        loadStyles() {
            const colorText = this.getStyleFromConfig("colorTextEnabled", "colorText");
            const colorPanelsOutline = this.getStyleFromConfig("colorPanelsOutlineEnabled", "colorPanelsOutline");
            const colorRowOdd = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowOdd");
            const colorRowEven = this.getStyleFromConfig("colorRowAccentsEnabled", "colorRowEven");
            const colorItemSlotsBg = this.getStyleFromConfig("colorItemSlotsBgEnabled", "colorItemSlotsBg");
            const colorPanelsBg = this.getStyleFromConfig("colorPanelsBgEnabled", "colorPanelsBg");
            const styles = `
            #market-table {
                margin-top: 0.5em !important;
                border-spacing:0 4px !important;
                border-collapse: separate;
                background: ${colorPanelsOutline} !important;
                border-width: 4px;
                border-radius: 5pt;
                padding: 4px;
                > * tr th {
                    background: ${colorPanelsOutline};
                    color: ${colorText};
                }
                > * tr:nth-child(even) {
                    background: ${colorRowOdd};
                    color: ${colorText};
                }
                > * tr:nth-child(odd) {
                    background: ${colorRowEven};
                    color: ${colorText};
                }
                > * tr.cheaper {
                    background-color: rgb(50, 205, 50, 0.25);
                }
                > * td {
                    background: inherit;
                    color: inherit;
                    &:first-child {
                        border-top-left-radius: 5pt;
                        border-bottom-left-radius: 5pt;
                    }
                    &:last-child {
                        border-top-right-radius: 5pt;
                        border-bottom-right-radius: 5pt;
                    }
                    > button {
                        border-radius: 3pt;
                        border: 2px solid #00000022;
                        padding: 4px;
                        box-shadow: none;
                        background-color: ${colorPanelsOutline};
                        color: ${colorText};
                        &:disabled {
                            color: ${colorText + "55"};
                            pointer-events: none;
                        }
                    }
                }
            }
            div[id^=player-market-slot] {
                border-spacing:0 4px;
                border-collapse: separate;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorItemSlotsBg};
                color: ${colorText};
                > div, span {
                    color: ${colorText} !important;
                }
                > button {
                    border-radius: 5pt;
                    border: 2px solid #00000022;
                    box-shadow: none;
                }
            }
            div[id^=player-market-slot-empty] {
                &:hover {
                    outline: 1px solid ${colorText + "55"};
                }
                > #panel-sell-text {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100%;
                    font-size: 20pt;
                    color: ${colorText + "55"} !important;
                }
            }
            #market-watcher-div {
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                margin: 0px;
                color: ${colorText};
                > div[id^=watched-item] {
                    color: black;
                }
            }
            #history-chart-div {
                position: relative;
                margin: 0 auto;
                border-radius: 5pt;
                border: 2px solid #00000022;
                background: ${colorPanelsBg};
                > #history-chart-timespan {
                    position: absolute;
                    top: 6px;
                    right: 6px;
                    font-size: 10pt;
                    border-radius: 3pt;
                    background-color: ${colorPanelsBg};
                    color: ${colorText};
                    &:hover {
                        cursor: pointer;
                    }
                    &:focus-visible {
                        outline: none;
                    }
                }
            }`;
            if(this.historyChart) {
                this.historyChart.options.scales.x.ticks.color = colorText;
                this.historyChart.options.scales.y.ticks.color = colorText;
            }
            else {
                Chart.defaults.color = colorText;
            }
 
            configurableStyles.innerHTML = styles;
        }
 
        async onLogin() {
            this.addMarketNotifications();
            if(this.getConfig("marketSoldNotification")) {
                this.updateMarketNotifications();
            }
            const self = this;
 
            $("head").append(`
            <style id="styles-market">
                #panel-player-market {
                    &.condensed {
                        > center {
                            display: flex;
                            flex-direction: row;
                            justify-content: center;
                        }
                        & div.player-market-slot-base {
                            height: 400px;
                        }
                        & div.player-market-slot-base hr {
                            margin-top: 2px;
                            margin-bottom: 4px;
                        }
                        & div.player-market-slot-base br + div.player-market-slot-base br {
                            display: none;
                        }
                        & div.player-market-slot-base[id^="player-market-slot-occupied"] {
                            > button {
                                padding: 2px;
                            }
                            > button[id^="player-market-slot-see-market"] {
                                width: 90%; 
                                margin-top: 0.5em; 
                                margin-bottom: 0.5em; 
                                background-color: rgb(46, 137, 221);
                            }
                            > h2[id^="player-market-slot-item-item-label"] {
                                font-size: 1.8rem;
                                margin-bottom: 0;
                            } 
                        }
                        & #market-table th {
                            padding: 2px 4px;
                        }
                        & #market-table td {
                            padding: 2px 4px;
                        }
                    }
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory {
                    margin: 6px 6px;
                    padding: 6px 6px;
                }
                #modal-market-select-item.condensed #modal-market-select-item-section .select-item-tradables-catagory hr {
                    margin-top: 2px;
                    margin-bottom: 2px;
                }
                .hide {
                    display: none;
                }
                .bold {
                    font-weight: bold;
                }
                .select-item-tradables-catagory {
                    border-radius: 5pt;
                }
                #market-table th.actions:hover {
                    color: gray;
                    cursor: pointer;
                }
                .context-menu { 
                    position: absolute; 
                } 
                .menu {
                    display: flex;
                    flex-direction: column;
                    background-color: rgb(240, 240, 240);
                    border-radius: 5pt;
                    box-shadow: 4px 4px 8px #0e0e0e;
                    padding: 10px 0;
                    list-style-type: none;
                    > li {
                        font: inherit;
                        border: 0;
                        padding: 4px 36px 4px 16px;
                        width: 100%;
                        display: flex;
                        align-items: center;
                        position: relative;
                        text-decoration: unset;
                        color: #000;
                        transition: 0.5s linear;
                        -webkit-transition: 0.5s linear;
                        -moz-transition: 0.5s linear;
                        -ms-transition: 0.5s linear;
                        -o-transition: 0.5s linear;
                        > span:not(:first-child) {
                            position: absolute;
                            right: 12px;
                        }
                        &:hover {
                            background:#afafaf;
                            color: #15156d;
                            cursor: pointer;
                        }
                    }
                }
                .hoverable-div:hover {
                    box-shadow: 4px 4px 8px #0e0e0e;
                    border-color: #252525;
                    cursor: pointer;
                }
            </style>
            `);
 
            // Market watcher modal
            $("#modal-item-input").after(`
            <div class="modal modal-dim" id="modal-market-configure-item-watcher" tabindex="-1" style="top: 0px; display: none;" aria-modal="true" role="dialog">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title text-secondary">ITEM WATCHER</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="center">
                                <div class="modal-market-sell-image p-2 hard-shadow">
                                    <h2 id="modal-market-configure-item-watcher-label"></h2>
                                    <img id="modal-market-configure-item-watcher-image" width="50px" height="50px" original-width="50px" original-height="50px" src="">
                                </div>
                                <br>
                                <input type="hidden" id="modal-market-configure-item-watcher">
                                <div class="modal-market-watcher-inputs font-small color-grey p-2 shadow">
                                    <br>
                                    <br>
                                    Limit:
                                    <span class="color-gold" id="modal-market-configure-item-watcher-low-limit">N/A</span>
                                    -
                                    <span class="color-gold" id="modal-market-configure-item-watcher-high-limit">N/A</span>
                                    <span class="color-gold"> each</span>
                                    <br>
                                    <img src="${COIN_ICON_URL}" title="coins">
                                    <input type="text" id="modal-market-configure-item-watcher-price-each" width="30%" placeholder="Price Each" original-width="30%">
                                    <select id="modal-market-configure-item-watcher-mode">
                                    <option value="1">Less than</option>
                                    <option value="2">At least</option>
                                    </select>
                                    <br>
                                    <br>
                                    <br>
                                    <br>
                                    <div>
                                        <input type="button" id="modal-market-configure-item-watcher-cancel-button" data-bs-dismiss="modal" value="Cancel">
                                        <input type="button" id="modal-market-configure-item-watcher-ok-button" onclick="IdlePixelPlus.plugins.market.createMarketWatcher()" class="background-primary hover" value="Create Watcher">
                                        <u class="hover" onclick="alert(&quot;You will get a notification when the price crosses the specified threshold.&quot;)">?</u>
                                    </div>
                                    <br>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`);
            
            // Market table sort menu
            $("#panel-player-market").append(`
            <div id="market-sort-context-menu" class="context-menu" style="display: none"> 
                <ul class="menu"> 
                    <li id="context-menu-price-each-item" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-price-each-item\");'>
                        <span> Price Each</span>
                    </li> 
                </ul> 
            </div>`);
 
            const sellSlotWidth = $(".player-market-slot-base").outerWidth();
            document.getElementById("market-table").style.minWidth = sellSlotWidth * 3;
            // History chart
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`).parent().before(`
                <div id="history-chart-div" style="display:block; margin-bottom: 0.5em; width: ${sellSlotWidth * 3}px; height: 200px;">
                    <select id="history-chart-timespan" align="right" onchange='IdlePixelPlus.plugins.market.fetchMarketHistory();'>
                        <option value="1d">24 Hours</option>
                        <option value="7d" selected="selected">7 Days</option>
                        <option value="30d">30 Days</option>
                        <option value="60d">60 Days</option>
                        <option value="120d">120 Days</option>
                    </select>
                    <canvas id="history-chart" style="display: block;" align="middle">
                </div>`);
            Object.assign(Chart.defaults.datasets.line, {
                fill: false,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 1
            });
 
            // Market watcher
            $("#notifications-area").children().last().after(`
                <div id="notification-market-watcher" class="notification hover hide" onclick='highlight_panel_left(document.getElementById(\"left-panel-item_panel-market\")); switch_panels(\"panel-player-market\");' style="margin-right: 4px; margin-bottom: 4px; background-color: rgb(183, 68, 14);">
                    <img src="https://idlepixel.s3.us-east-2.amazonaws.com/images/player_market.png" class="w20" title="market_alert">
                    <span id="notification-market-item-label" class="color-white"> Market Alert</span>
                </div>`);
            $("#history-chart-div").prev().before(`
                <center>
                <div id="market-watcher-div" class="select-item-tradables-catagory shadow" align="left" style="width: ${sellSlotWidth * 3}px; display: none;">
                    <span class="bold">Active watchers</span>
                    <hr style="margin-top: 2px; margin-bottom: 4px;">
                </div>
                </center>`);
 
            // modal-market-configure-item-to-sell-amount
            const sellModal = $("#modal-market-configure-item-to-sell");
            const sellAmountInput = sellModal.find("#modal-market-configure-item-to-sell-amount");
            sellAmountInput.after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountSell()">1</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell()">max</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountSell(true)">max-1</button>
            `);
            const sellPriceInput = sellModal.find("#modal-market-configure-item-to-sell-price-each").after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMinPriceSell()">min</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyLowestPriceSell()">lowest</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMidPriceSell()">mid</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxPriceSell()">max</button>
                <br /><br />
                Total: <span id="modal-market-configure-item-to-sell-total"></span>
            `);
 
            // Extra buttons beside <BROWSE PLAYER MARKET>
            $(`#panel-player-market button[onclick^="Market.clicks_browse_player_market_button"]`)
                .first()
                .after(`<button id="refresh-market-table-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.refreshMarket(true);">
                            Refresh
                        </button>`)
                .after(`<button id="watch-market-item-button" type="button" style="height: 44px; margin-left: 0.5em" onclick="IdlePixelPlus.plugins.market.watchItemOnClick()">
                            Watch Item
                        </button>`);
 
            document.querySelectorAll(`button[id^=player-market-slot-collect-amount]`).forEach(b => {
                // Add See Market button
                const id = b.id.match(/[1-3]/)[0];
                b.nextElementSibling.remove();
                b.insertAdjacentHTML("afterend", `<button type="button" id="player-market-slot-see-market-${id}" onclick="IdlePixelPlus.plugins.market.seeMarketOnClick(${id})">See Market</button>`);
            
                // Add event to reset collection button
                b.addEventListener("click", () => {
                    b.textContent = b.textContent.replace(/[0-9,]+/, '0');
                    $("#market-sidecar").hide();
                    this.refreshMarket(false);
                });
            });
            document.querySelectorAll(`span[id^=player-market-slot-expires]`).forEach(s => s.previousElementSibling.remove());
 
            // Refresh market on purchase
            const purchaseButton = document.querySelector(`input[onclick*="Market.purchase_item()"]`);
            if(purchaseButton)
                purchaseButton.addEventListener("click", () => this.refreshMarket(false));
 
            sellAmountInput.on("input change", () => this.applyTotalSell());
            sellPriceInput.on("input change", () => this.applyTotalSell());
 
            // Zlef
            // Add buttons to brewing ingredients
            const parentDiv = document.getElementById("panel-brewing");
 
            // Loop through all itembox elements within the parent div
            parentDiv.querySelectorAll('itembox').forEach((itemBox) => {
                // Check if it contains 'Primary Ingredient' or 'Secondary Ingredient'
                const tooltip = itemBox.getAttribute("data-bs-original-title");
                if (tooltip && (tooltip.includes("Primary Ingredient") || tooltip.includes("Secondary Ingredient"))) {
                    // Add click event to the itembox
                    itemBox.addEventListener("click", () => this.brewingIngClicked(itemBox));
                }
            });
            //End Zlef
 
            // Observer for brewing modal change 
            const brewingModal = document.getElementById("modal-brew-ingredients");
            const brewingModalObserverOptions = { childList: true, subtree: true};
            const brewingModalObserver = new window.MutationObserver((mutationRecords) => {
                brewingModalObserver.disconnect();
                const record = mutationRecords[0];
                let totalCost = 0;
                const promises = Array.from(record.addedNodes).map((async (node) => {
                        if(node.nodeName === "IMG" && node.nextSibling.nodeName === "#text") {
                            const item = node.src.match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                            if(Market.tradables.find(t => t.item === item)) {
                                const qty = node.nextSibling.textContent.match(/[0-9]+/)[0];
                                const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
                                const data = await response.json();
                                let currentMarketMinPrice = Math.min(...data.map(datum => datum.market_item_price_each));
                                if(!isFinite(currentMarketMinPrice)) {
                                    currentMarketMinPrice = ((item) => this.marketAverages[item])();
                                }
                                const displayedValue = (qty * currentMarketMinPrice > 1000) ? `${(qty * currentMarketMinPrice / 1000).toFixed(2)}k` : qty * currentMarketMinPrice;
                                totalCost += qty * currentMarketMinPrice;
                                node.nextSibling.textContent += ` (`;
                                node.nextElementSibling.insertAdjacentHTML("beforebegin", `<img src="${COIN_ICON_URL}" title="coins"> ${displayedValue})`);
                            }
                        }
                    })
                );
                Promise.all(promises).then(() => {
                    const totalCostElement = document.getElementById("brewing-total-cost");
                    const totalCostStr = `Estimated total cost: ${totalCost > 1000 ? (totalCost / 1000).toFixed(2) + "k" : totalCost}`;
                    if(totalCostElement)
                        totalCostElement.textContent = totalCostStr;
                    else
                        record.target.parentNode.insertAdjacentHTML("afterend", `<span id="brewing-total-cost" class="colorg-grey">${totalCostStr}</span>`);
                    brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);
                });
            });
            brewingModalObserver.observe(brewingModal, brewingModalObserverOptions);
 
            if(this.getConfig("condensed")) {
                // Remove <br> from between <Amount left> and <Price each>, and reinsert it above title
                document.querySelectorAll(`span[id^="player-market-slot-item-amount-left"]`).forEach(e => {
                    const br = e.parentNode.removeChild(e.nextElementSibling);
                    e.parentNode.querySelector(`h2[id^="player-market-slot-item-item-label"]`).before(br);
                });
            }
 
            const buyModal = $("#modal-market-purchase-item");
            const buyAmountInput = buyModal.find("#modal-market-purchase-item-amount-input");
            $(document).on('click', '[onclick*="Modals.market_purchase_item"]', this.handlePurchaseClick.bind(this));
            buyAmountInput.after(`
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyOneAmountBuy()">1</button>
                <button type="button" onclick="IdlePixelPlus.plugins.market.applyMaxAmountBuy()">max</button>
                <br /><br />
                Total: <span id="modal-market-purchase-item-total"></span>
                <br />
                Owned: <item-display data-format="number" data-key="coins"></item-display>
            `);
            buyAmountInput.on("input change", () => this.applyTotalBuy());
 
            // Remove sell buttons
            document.querySelectorAll("div[id^=player-market-slot-empty] button").forEach(b => {
                b.parentElement.onclick = b.onclick;
                const div = document.createElement("div");
                div.setAttribute("id", "panel-sell-text");
                div.classList.add("hover");
                div.innerText = "Sell an item";
                b.replaceWith(div);
            });
 
            // wrap Market.browse_get_table to capture last selected
            Market.browse_get_table = function(item) {
                return self.browseGetTable(item, true);
            }
 
            // Edit tradables modal category names
            new window.MutationObserver((mutationRecords) => {
                const childList = mutationRecords.filter(record => record.type === "childList")[0];
                if(childList && childList.target && childList.target.id === "modal-market-select-item-section") {
                    const elements = document.getElementById(childList.target.id).querySelectorAll(".select-item-tradables-catagory");
                    elements.forEach(e => {
                        let isSellModal = false;
 
                        e.classList.add("bold");
                        e.innerHTML = e.innerHTML.replace(/[a-zA-Z_]+<hr>/, e.textContent.split("_").map(w => w[0].toUpperCase() + w.slice(1).toLowerCase()).join(" ") + "<hr>");
 
                        e.querySelectorAll("div").forEach(d => {
                            isSellModal |= /Modals\.market_configure_item_to_sell/.test(d.onclick.toString());
                            if(d.parentNode.textContent.toLowerCase() != "all") {
                                d.addEventListener("click", function(event) {
                                    event.stopPropagation();
                                });
                                const match = d.onclick.toString().match(/(Modals\.market_configure_item_to_sell|Market\.browse_get_table)\(\"([a-zA-Z0-9_]+)\"/);
                                if(match) {
                                    d.setAttribute("data-bs-toggle", "tooltip");
                                    d.setAttribute("data-bs-placement", "top");
                                    d.setAttribute("data-boundary", "window");
                                    d.setAttribute("title", Items.get_pretty_item_name(match[2]));
                                }
                            }
                        });
                        if(!isSellModal) {
                            e.onclick = () => this.filterButtonOnClick(e.textContent.toLowerCase().replace(" ", "_"));
                            e.classList.add("hoverable-div");
                        }
                    });
                }
            }).observe(document.getElementById("modal-market-select-item"), {
                childList: true,
                subtree: true
            });
 
            // Player ID display
            this.onConfigsChanged();
            var playerID = var_player_id;
            $(`#search-username-hiscores`).after(`<span id="player_id">(ID: ${playerID})</span>`);
 
            this.loadStyles();
            this.applyLocalStorage();
            this.checkWatchers();
            this.getGlobalMarketHistoryAverages(7);
            this.preloadMarketTradables();
            this.loginDone = true;
        }
 
        async fetchBrowseResult(item) {
            const response = await fetch(`${MARKET_POSTINGS_URL}/${item}/`);
            return response.json();
        }
 
        browseGetTable(item, updateGraph) {
            const self = this;
            if(item != this.lastBrowsedItem) {
                self.lastSortIndex = 0;
            }
            this.lastBrowsedItem = item;
            if(item == "all") {
                $("#watch-market-item-button").hide();
                $("#history-chart-div").hide();
            }
            else {
                $("#watch-market-item-button").show();
                $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
                $("#modal-market-configure-item-watcher-label").text(item.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "));
 
                try {
                    if(this.getConfig("marketGraph") && updateGraph) {
                        self.fetchMarketHistory(item);
                    }
                } catch(err) {
                    console.log(err);
                }
            }
 
            // A good chunk of this is taking directly from Market.browse_get_table
            //hide_element("market-table");
            //show_element("market-loading");
            let best = {};
            let bestList = {};
            return $.get(`${MARKET_POSTINGS_URL}/${item}/`).done(async function(data) {
                const xpMultiplier = DonorShop.has_donor_active(IdlePixelPlus.getVar("donor_bonus_xp_timestamp")) ? 1.1 : 1;
                const listofAlts = IdlePixelPlus.plugins.market.getConfig("altIDList").replace(";",",").replace(/\s?,\s?/g, ",").toLowerCase().split(',').map(altId => parseInt(altId));
                const useHeatPot = self.getConfig("heatPotion");
 
                if(data.find(datum => ["logs", "raw_fish"].includes(datum.market_item_category)) !== undefined) {
                    var coinsPerHeat = 100000;
                    const logsData = await self.fetchBrowseResult("logs");
                    coinsPerHeat = 1.01 * Math.min(...logsData.map(datum => datum.market_item_price_each / Cooking.getHeatPerLog(datum.market_item_name)));
                }
 
                // Removes the alts listing from market and calculations
                data = data.filter(datum => listofAlts.indexOf(parseInt(datum.player_id)) == -1);
 
                data.forEach(datum => {
                    //console.log(datum);
                    const priceAfterTax = datum.market_item_price_each * 1.01;
                    switch(datum.market_item_category) {
                        case "bars":
                        case "ores": {
                            let perCoin = (priceAfterTax / (xpMultiplier*XP_PER[datum.market_item_name]));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = isNaN(perCoin) ? "" : `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/xp`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "logs": {
                            let perCoin = (priceAfterTax / (Cooking.getHeatPerLog(datum.market_item_name) * (useHeatPot ? 2 : 1)));
                            let sDPerCoin = (4000 / priceAfterTax);
                            const charcoalMultiplier = 1 * (window.var_titanium_charcoal_foundry_crafted ? 2 : 1) * (window.var_green_charcoal_orb_absorbed ? 2 : 1);
                            let charPerCoin = ((priceAfterTax / CHARCOAL_PERC[datum.market_item_name]) / charcoalMultiplier);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.charPerCoin = charPerCoin;
                            datum.ratios = [perCoin, charPerCoin];
                            if (datum.market_item_name == 'stardust_logs') {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br />${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/coin<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            else {
                                datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/heat<br/>${charPerCoin.toFixed(charPerCoin < 10 ? 2: 1)} ~coins/charcoal`;
                            }
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "raw_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            let energy = (Cooking.get_energy(datum.market_item_name));
                            let heat = (HEAT_PER[datum.market_item_name]);
                            let perHeat = (energy / heat);
                            let comboCoinEnergyHeat = ((priceAfterTax + (heat * coinsPerHeat / (useHeatPot ? 2 : 1))) / energy);
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            datum.perCoin = comboCoinEnergyHeat;
                            datum.perHeat = perHeat;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy || ${perHeat.toFixed(perHeat < 10 ? 2 : 1)} energy/heat<br />${comboCoinEnergyHeat.toFixed(comboCoinEnergyHeat < 10 ? 4 : 1)} coins/heat/energy`;
                            datum.levelReq = levelReq;
                            datum.ratios = [perCoin, perHeat, comboCoinEnergyHeat];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "cooked_fish":{
                            let perCoin = (priceAfterTax / Cooking.get_energy(datum.market_item_name));
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/energy`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "bones": {
                            let perCoin = (priceAfterTax / BONEMEAL_PER[datum.market_item_name]);
                            datum.perCoin = perCoin;
                            datum.perCoinLabel = `${perCoin.toFixed(perCoin < 10 ? 2 : 1)} coins/bonemeal`;
                            datum.levelReq = "N/A";
                            datum.ratios = [perCoin];
                            self.setBest(best, bestList, datum, perCoin);
                            break;
                        }
                        case "seeds": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            let levelReq = (LEVEL_REQ[datum.market_item_name]);
                            let sDPerCoin = (14000 / priceAfterTax);
                            datum.levelReq = levelReq;
                            datum.sDPerCoin = sDPerCoin;
                            datum.perCoinLabel = (datum.market_item_name == "stardust_seeds") ? `${sDPerCoin.toFixed(sDPerCoin < 10 ? 2 : 1)} ~SD/Coin` : "";
                            break;
                        }
                        case "armour":
                        case "other_equipment":
                        case "weapons": {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = LEVEL_REQ[datum.market_item_name] ? LEVEL_REQ[datum.market_item_name] : "N/A";
                            break;
                        }
                        default: {
                            datum.perCoin = Number.MAX_SAFE_INTEGER;
                            datum.perCoinLabel = "";
                            datum.levelReq = "N/A";
                            break;
                        }
                    }
                });
                Object.values(bestList).forEach(bestCatList => bestCatList.forEach(datum => datum.best=true));
 
                //console.log(self.lastCategoryFilter);
                //console.log(self.lastSortIndex);
                //console.log(self.lastBrowsedItem);
                if(item !== self.lastBrowsedItem)
                    self.lastSortIndex = 0;
                self.currentTableData = data;
                self.filterTable(item === "all" ? self.lastCategoryFilter : (data.length > 0 ? data[0].market_item_category : "all"));
                
                hide_element("market-loading");
                show_element("market-table");
            });
 
        }
 
        setBest(best, bestList, datum, ratio) {
            if(!best[datum.market_item_category]) {
                best[datum.market_item_category] = ratio;
                bestList[datum.market_item_category] = [datum];
            }
            else {
                if(ratio == best[datum.market_item_category]) {
                    bestList[datum.market_item_category].push(datum);
                }
                else if(ratio < best[datum.market_item_category]) {
                    bestList[datum.market_item_category] = [datum];
                    best[datum.market_item_category] = ratio;
                }
            }
        }
 
        updateTable() {
            let html = `<tr>
                            <th>ITEM</th>
                            <th style="width: 60px;"></th>
                            <th>AMOUNT</th>
                            <th class="actions" onclick="IdlePixelPlus.plugins.market.marketHeaderOnClick(event);">PRICE EACH</th>`;
            if(this.getConfig("extraInfoColumn"))
                html += `<th>EXTRA INFO</th>`;
            if(this.getConfig("categoryColumn"))
                html += `<th>CATEGORY</th>`;
            html += `<th>EXPIRES IN</th>`;
            if(this.getConfig("quickBuyColumn"))
                html += `<th>QUICK BUY 
                        </th>`;
                html += `<th style="width: 0px;"><u class="hover" style="font-size: 80%; font-weight: 400;" onclick="alert(&quot;You can configure visible table columns in the plugin options.&quot;)">?</u></th>`;
            html += `</tr>`;
            // in case you want to add any extra data to the table but still use this script
            if(typeof window.ModifyMarketDataHeader === "function") {
                html = window.ModifyMarketDataHeader(html);
            }
 
            this.currentTableData.forEach(datum => {
                if(!datum.hidden) {
                    let market_id = datum.market_id;
                    let player_id = datum.player_id;
                    let item_name = datum.market_item_name;
                    let amount = datum.market_item_amount;
                    let price_each = datum.market_item_price_each;
                    let category = datum.market_item_category;
                    let timestamp = datum.market_item_post_timestamp;
                    let perCoinLabel = datum.perCoinLabel;
                    let best = datum.best && this.getConfig("highlightBest");
                    let levelReq = datum.levelReq;
                    let your_entry = "";
 
                    if(Items.getItem("player_id") == player_id) {
                        your_entry = "<span class='font-small'><br /><br />(Your Item)</span>";
                    }
 
                    let rowHtml = "";
                    rowHtml += `<tr onclick="Modals.market_purchase_item('${market_id}', '${item_name}', '${amount}', '${price_each}'); IdlePixelPlus.plugins.market.applyMaxAmountBuyIfConfigured();" class="hover${ best ? ' cheaper' : '' }">`;
                    rowHtml += `<td>${Items.get_pretty_item_name(item_name)}${your_entry}</td>`;
                    rowHtml += `<td style="width: 60px;"><img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${item_name}.png" /></td>`;
                    rowHtml += `<td>${amount}</td>`;
                    rowHtml += `<td><img src="${COIN_ICON_URL}" /> ${Market.get_price_after_tax(price_each)}`;
                    if(perCoinLabel) {
                        rowHtml += `<br /><span style="font-size: 80%; opacity: 0.8">${perCoinLabel}</span>`;
                    }
                    rowHtml += `</td>`;
                    if(this.getConfig("extraInfoColumn"))
                        rowHtml += `<td>${levelReq}</td>`;
                    if(this.getConfig("categoryColumn"))
                        rowHtml += `<td>${category}</td>`;
                    rowHtml += `<td>${Market._get_expire_time(timestamp)}</td>`;
                    if(this.getConfig("quickBuyColumn")) {
                        const qbSetting = this.getConfig("quickBuyAmount");
                        const qbAmount = Math.min(qbSetting, amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)));
                        const qbMaxAmount = Math.min(amount, Math.floor(IdlePixelPlus.getVarOrDefault("coins", 0, "int") / (price_each * 1.01)))
                        const qbButtonStr = (qbSetting == 0) ? "Max" : `${qbAmount}`;
                        rowHtml += `<td>
                                        <button onclick='IdlePixelPlus.plugins.market.quickBuyOnClick(${market_id}, ${qbAmount}); event.stopPropagation();' 
                                                oncontextmenu='IdlePixelPlus.plugins.market.quickBuyOnRightClick(${market_id}, ${qbMaxAmount}, event);' ${qbMaxAmount == 0 ? "disabled": ""}>
                                            Buy ${qbButtonStr}
                                        </button>
                                    </td>`;
                    }
                    rowHtml += `<td style="width:0px;"></td></tr>`;
 
                    // in case you want to add any extra data to the table but still use this script
                    if(typeof window.ModifyMarketDataRow === "function") {
                        rowHtml = window.ModifyMarketDataRow(datum, rowHtml);
                    }
                    html += rowHtml;
                }
            });
            document.getElementById("market-table").innerHTML = html;
        }
 
        quickBuyOnClick(marketId, amount) {
            IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
            this.refreshMarket(false);
        }
 
        quickBuyOnRightClick(marketId, amount, event) {
            const qbAllNeedsAltKey = this.getConfig("quickBuyAllNeedsAltKey");
            event.preventDefault(); 
            event.stopPropagation();
            if(!qbAllNeedsAltKey || event.altKey) {
                IdlePixelPlus.sendMessage("MARKET_PURCHASE=" + marketId + "~" + amount);
                this.refreshMarket(false);
            }
        }
 
        filterButtonOnClick(category) {
            this.lastSortIndex = 0;
            this.lastCategoryFilter = category;
            if(category != "all") { // Patch to prevent clicking the "All" button event coming through to the category listener without double-toggling
                Modals.toggle("modal-market-select-item");
            }
            this.browseGetTable("all", true);
        }
 
        filterTable(category) {
            if(category) {
                this.lastCategoryFilter = category;
            }
            else {
                category = this.lastCategoryFilter || "all";
            }
 
            this.configureTableContextMenu(category);
 
            this.currentTableData.forEach(datum => {
                if(category === "all")
                    datum.hidden = false;
                else
                    datum.hidden = !(category === datum.market_item_category);
            });
 
            this.sortTable(this.lastSortIndex);
            this.updateTable();
        }
 
        sortTable(sortDataIndex) {
            // Split the table data into a visible and hidden array in order to sort the visible one
            const visible = this.currentTableData.filter(datum => !datum.hidden);
            const hidden = this.currentTableData.filter(datum => datum.hidden);
 
            visible.sort((a, b) => {
                switch(sortDataIndex) {
                    case 0:     return a.market_item_price_each - b.market_item_price_each;
                    case 100:   {
                        const a_avg = isNaN(this.marketAverages[a.market_item_name]) ? 0.001 : this.marketAverages[a.market_item_name];
                        const b_avg = isNaN(this.marketAverages[b.market_item_name]) ? 0.001 : this.marketAverages[b.market_item_name];
                        return ((a.market_item_price_each / a_avg) - 1) - ((b.market_item_price_each / b_avg) - 1);
                    }
                    default:    return a.ratios[sortDataIndex - 1] - b.ratios[sortDataIndex - 1];
                }
            });
            this.currentTableData = visible.concat(hidden);
            this.lastSortIndex = sortDataIndex;
        }
 
        refreshMarket(disableButtonForABit) {
            if(this.lastBrowsedItem) {
                this.browseGetTable(this.lastBrowsedItem, false);
                if(disableButtonForABit) { // prevent spam clicking it
                    $("#refresh-market-table-button").prop("disabled", true);
                    setTimeout(() => {
                        $("#refresh-market-table-button").prop("disabled", false);
                    }, 700);
                }
            }
        }
 
        applyOneAmountBuy() {
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(1);
            this.applyTotalBuy();
        }
 
        applyMaxAmountBuyIfConfigured() {
            if(this.getConfig("autoMax")) {
                this.applyMaxAmountBuy();
            }
        }
 
        applyMaxAmountBuy(minus1=false) {
            const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
            const price = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace(/[^\d]+/g, ""));
            const maxAffordable = Math.floor(coinsOwned / price);
            const maxAvailable = parseInt($("#modal-market-purchase-item #modal-market-purchase-item-amount-left").val().replace(/[^\d]+/g, ""));
            let max = Math.min(maxAffordable, maxAvailable);
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val(max);
            this.applyTotalBuy();
        }
 
        parseIntKMBT(s) {
            if(typeof s === "number") {
                return Math.floor(s);
            }
            s = s.toUpperCase().replace(/[^\dKMBT]+/g, "");
            if(s.endsWith("K")) {
                s = s.replace(/K$/, "000");
            }
            else if(s.endsWith("M")) {
                s = s.replace(/M$/, "000000");
            }
            else if(s.endsWith("B")) {
                s = s.replace(/B$/, "000000000");
            }
            else if(s.endsWith("T")) {
                s = s.replace(/T$/, "000000000000");
            }
            return parseInt(s);
        }
 
        // Added by Zlef ->
        handlePurchaseClick() {
            setTimeout(this.displayOwnedInPurchase.bind(this), 100);
        }
 
        displayOwnedInPurchase() {
            const itemNameElement = $("#modal-market-purchase-item-label");
            const itemName = itemNameElement.text();
 
            if (!itemName) {
                return;
            }
 
            const itemNameForQuery = itemName.toLowerCase().replace(/\s/g, '_');
            let itemVar = IdlePixelPlus.getVarOrDefault(itemNameForQuery, "0");
 
            const containerElement = $("#modal-market-purchase-item-image").parent();
 
            // Check if the element already exists before appending
            if (!containerElement.find("#amount-owned").length) {
                containerElement.append(`<p id="amount-owned">You own: ${itemVar}</p>`);
            } else {
                // Update the existing element
                containerElement.find("#amount-owned").text(`You own: ${itemVar}`);
            }
        }
 
        brewingIngClicked(itemBox) {
            if (this.getConfig("clickBrewIng")) {
                const dataItem = itemBox.getAttribute("data-item").toLowerCase();
                if(Market.tradables.find(t => t.item === dataItem)) {
                    this.openMarketToItem(dataItem);
                }
            }
        }
 
        // Function for opening the market to a specific item
        openMarketToItem(dataItem) {
            // Simulate clicking the Player Market panel
            const playerMarketPanel = document.getElementById("left-panel-item_panel-market");
            if (playerMarketPanel) {
                playerMarketPanel.click();
            }
 
            // Make sure to switch to the player market panel (annoys the shit out of me that the notification buttons don't do this)
            highlight_panel_left(playerMarketPanel);
            switch_panels('panel-player-market');
 
            const intervalId = setInterval(() => {
                // Check if the market table element is present
                const marketTable = document.getElementById("market-table");
                if (marketTable) {
                    // If it's present, clear the interval and execute function
                    clearInterval(intervalId);
                    Market.browse_get_table(dataItem);
                }
            }, 100);
        }
        //End Zlef
 
        applyTotalBuy() {
            const amount = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-amount-input").val());
            const price = this.parseIntKMBT($("#modal-market-purchase-item #modal-market-purchase-item-price-each").val().replace("Price each: ", ""));
            const total = amount*price;
            const totalElement = $("#modal-market-purchase-item-total");
            if(isNaN(total)) {
                totalElement.text("");
            }
            else {
                totalElement.text(total.toLocaleString());
                const coinsOwned = IdlePixelPlus.getVarOrDefault("coins", 0, "int");
                if(total > coinsOwned) {
                    totalElement.css("color", "red");
                }
                else {
                    totalElement.css("color", "");
                }
            }
        }
 
        currentItemSell() {
            return $("#modal-market-configure-item-to-sell").val();
        }
 
        applyOneAmountSell() {
            const item = this.currentItemSell();
            const owned = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            $("#modal-market-configure-item-to-sell-amount").val(Math.min(owned, 1));
            this.applyTotalSell();
        }
 
        applyMaxAmountSell(minus1=false) {
            const item = this.currentItemSell();
            let max = IdlePixelPlus.getVarOrDefault(item, 0, "int");
            if(minus1) {
                max--;
            }
            if(max < 0) {
                max = 0;
            }
            $("#modal-market-configure-item-to-sell-amount").val(max);
            this.applyTotalSell();
        }
 
        applyMinPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(min);
            this.applyTotalSell();
        }
 
        async applyLowestPriceSell() {
            var lowest = 100000000000;
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const item = $("#modal-market-configure-item-to-sell-image").attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
            const data = await this.fetchBrowseResult(item);
            lowest = Math.min(...data.map(datum => datum.market_item_price_each));
            $("#modal-market-configure-item-to-sell-price-each").val(Math.max(Math.min(lowest - 1, max), min));
            this.applyTotalSell();
        }
 
        applyMidPriceSell() {
            const min = parseInt($("#modal-market-configure-item-to-sell-label-lower-limit").text().replace(/[^\d]/g, ""));
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            const mid = Math.floor((min+max)/2);
            $("#modal-market-configure-item-to-sell-price-each").val(mid);
            this.applyTotalSell();
        }
 
        applyMaxPriceSell() {
            const max = parseInt($("#modal-market-configure-item-to-sell-label-upper-limit").text().replace(/[^\d]/g, ""));
            $("#modal-market-configure-item-to-sell-price-each").val(max);
            this.applyTotalSell();
        }
 
        applyTotalSell() {
            const amount = this.parseIntKMBT($("#modal-market-configure-item-to-sell-amount").val());
            const price = this.parseIntKMBT($("#modal-market-configure-item-to-sell-price-each").val());
            const total = amount*price;
            if(isNaN(total)) {
                $("#modal-market-configure-item-to-sell-total").text("");
            }
            else {
                $("#modal-market-configure-item-to-sell-total").text(total.toLocaleString());
            }
            // TODO total w/ tax
        }
 
        seeMarketOnClick(sellSlotIndex) {
            try {
                const item = $(`#player-market-slot-item-image-${sellSlotIndex}`).attr("src").match(/\/([a-zA-Z0-9_]+)\.png$/)[1];
                this.browseGetTable(item, true);
            } catch(err) {
                console.error(err);
            }
        }
 
        async fetchMarketHistory(item) {
            const timespanSelect = document.getElementById("history-chart-timespan");
            const timespan = timespanSelect.options[timespanSelect.selectedIndex].value;
            if(item === undefined)
                item = this.lastBrowsedItem;
 
            $("#history-chart-div").show();
 
            const response = await fetch(`${MARKET_HISTORY_URL}?item=${item}&range=${timespan}`);
            const data = await response.json();
            const splitData = this.splitHistoryData(data, timespan == "1d" ? "hours" : "days");
 
            // Create chart object if uninitialized
            if(this.historyChart === undefined){
                this.historyChart = new Chart($("#history-chart"), {
                    type: 'line',
                    options: {
                        maintainAspectRatio: false,
                        scales: {
                            x: {
                                grid: {
                                    color: "#77777744"
                                }
                            },
                            y: {
                                beginAtZero: false,
                                grid: {
                                    color: "#77777744"
                                }
                            }
                        },
                        interaction: {
                            intersect: false,
                            mode: 'index',
                        }
                    }
                });
            }
            this.updateHistoryChart(splitData);
        }
 
        updateHistoryChart(data) {
            const averagePrices = data.map(datum => Math.round(datum.data.map(d => d.price * d.amount)
                                                                              .reduce((a, b) => a + b, 0) / datum.data.map(d => d.amount)
                                                                                                                      .reduce((a, b) => a + b, 0)));
            this.historyChart.options.plugins.tooltip.callbacks.footer = (tooltipItems) => {
                const amountsSum = data[tooltipItems[0].dataIndex].data.map(datum => datum.amount).reduce((a, b) => a + b, 0);
                return `Transaction Volume: ${amountsSum}`;
            }
            this.historyChart.data = {
                labels: data.map(datum => datum.date),
                datasets: [{
                    label: 'Lowest Price',
                    data: data.map(datum => Math.min(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMin")
                },
                {
                    label: 'Average Price',
                    data: averagePrices,
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineAverage")
                },
                {
                    label: 'Highest Price',
                    data: data.map(datum => Math.max(...datum.data.map(d => d.price))),
                    borderColor: this.getStyleFromConfig("colorChartLineEnabled", "colorChartLineMax")
                }]
            };
            this.historyChart.update();
        }
 
        splitHistoryData(data, bucketSize) {
            var splitData = [];
            data.history.forEach(datum => {
                let match;
                const date = new Date(datum.datetime);
                if(bucketSize == "days")
                    match = splitData.filter(dd => dd.date.getDate() == date.getDate() && dd.date.getMonth() == date.getMonth());
                else if(bucketSize == "hours")
                    match = splitData.filter(dd => dd.date.getHours() == date.getHours());
                if(match.length == 0) {
                    splitData.push({
                        date: date,
                        data: [{price: datum.price, amount: datum.amount}]
                    });
                } else {
                    match[0].data.push({price: datum.price, amount: datum.amount});
                }
            });
            if(bucketSize == "days")
                splitData.forEach(datum => datum.date = datum.date.toString().match(/^[a-zA-Z]+\s([a-zA-Z]+\s[0-9]{1,2})\s/)[1]);
            else if(bucketSize == "hours")
                splitData.forEach(datum => datum.date = `${datum.date.getHours()}h`);
            return splitData;
        }
 
        async getGlobalMarketHistoryAverages(timespan) {
            const historyResponse = await fetch(`${MARKET_HISTORY_URL}?item=all&range=${timespan}d`);
            this.marketAverages = await historyResponse.json()
                .then((data) => {
                    const sumDict = {};
                    const avgDict = {};
                    data.history.forEach(datum => {
                        sumDict[datum.item] = {
                            sum: sumDict[datum.item] ? sumDict[datum.item]?.sum + datum.price : datum.price,
                            length: sumDict[datum.item] ? sumDict[datum.item].length + 1 : 1,
                        }
                    });
                    Object.entries(sumDict).forEach(([item, datum]) => { 
                        avgDict[item] = datum.sum / datum.length
                    });
                    return avgDict;
                });
        }
 
        createMarketWatcher() {
            const item = $("#modal-market-configure-item-watcher-label").text().toLowerCase().replace(/\s/g, "_");
            const value = $("#modal-market-configure-item-watcher-price-each").val();
            const lt_gt = $("#modal-market-configure-item-watcher-mode").val() == "1" ? "<" : ">";
 
            Modals.toggle("modal-market-configure-item-watcher");
            $("#modal-market-configure-item-watcher-ok-button").val("Create Watcher");
 
            if($("#market-watcher-div").find(`#watched-item-${item}`).length == 0) {
                this.createWatcherElement(item, value, lt_gt);
                $("#market-watcher-div").show();
            }
            else {
                $(`#watched-item-${item}-label`).text(`${lt_gt} ${value}`);
            }
 
            this.saveToLocalStorage(item, value, lt_gt);
            this.checkWatchers();
        }
 
        createWatcherElement(item, value, lt_gt) {
            $("#market-watcher-div").children().last().after(`
            <div id="watched-item-${item}" class="market-tradable-item p-1 m-1 hover shadow" style="background-color:#ffcccc">
                <div align="left" onclick='IdlePixelPlus.plugins.market.browseGetTable(\"${item}\", true); event.stopPropagation();'>
                    <img class="hover" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/search_white.png" width="15px" height="15px" title="search_white">
                </div>
                <div onclick='IdlePixelPlus.plugins.market.watchedItemOnClick(\"${item}\");' style="margin-top: -15px;">
                <div style="display: block;">
                    <img src="${this.getItemIconUrl(item)}" width="50px" height="50px">
                </div>
                <div style="display: block;">
                    <img src="${COIN_ICON_URL}" title="coins">
                    <span class="market-watched-item" id="watched-item-${item}-label">${lt_gt} ${value}</span>
                </div>
                </div>
            </div>`);
        }
 
        deleteMarketWatcher(item) {
            $(`#watched-item-${item}`).remove();
            if($("#market-watcher-div").find(".market-watched-item").length == 0) {
                $("#market-watcher-div").hide();
            }
            this.removeFromLocalStorage(item);
        }
 
        configureItemWatcherModal(item, create) {
            const tradable = Market.tradables.find(t => t.item == item);
            $("#modal-market-configure-item-watcher-image").attr("src", this.getItemIconUrl(item));
            document.getElementById("modal-market-configure-item-watcher-label").textContent = Items.get_pretty_item_name(item);
            document.getElementById("modal-market-configure-item-watcher-low-limit").textContent = tradable.lower_limit;
            document.getElementById("modal-market-configure-item-watcher-high-limit").textContent = tradable.upper_limit;
            if(create){
                $("#modal-market-configure-item-watcher-price-each").val("");
                $("#modal-market-configure-item-watcher-mode").val("1");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Create Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Cancel");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", "");
            }
            else {
                $("#modal-market-configure-item-watcher-price-each").val($(`#watched-item-${item}-label`).text().match(/[0-9]+/)[0]);
                $("#modal-market-configure-item-watcher-mode").val($(`#watched-item-${item}-label`).text().match(/[><]/)[0] == "<" ? "1" : "2");
                $("#modal-market-configure-item-watcher-ok-button").prop("value", `Edit Watcher`);
                $("#modal-market-configure-item-watcher-cancel-button").prop("value", "Delete Watcher");
                $("#modal-market-configure-item-watcher-cancel-button").attr("onclick", `IdlePixelPlus.plugins.market.deleteMarketWatcher(\"${item}\")`);
            }
        }
 
        watchItemOnClick() {
            this.configureItemWatcherModal(this.lastBrowsedItem, true);
            Modals.toggle("modal-market-configure-item-watcher");
        }
 
        watchedItemOnClick(item) {
            this.configureItemWatcherModal(item, false);
            Modals.toggle("modal-market-configure-item-watcher");
        }
 
        checkWatchers() {
            var itemTriggered = false;
            $(".market-watched-item").each(async function() {
                const id = $(this).attr("id");
                const item = id.match(/watched-item-([a-zA-Z0-9_]+)-label/)[1];
                const price = $(this).text().match(/[0-9]+/)[0];
                const lt_gt = $(this).text().match(/[><]/)[0];
                //console.log("Running watcher checks..");
 
                const response = await fetch(`../../market/browse/${item}/`);
                const data = await response.json();
 
                const sorted = data.map(datum => datum.market_item_price_each * 1.01).toSorted((a, b) => a - b);
                if(sorted.length > 0 && (lt_gt === ">" && sorted[0] >= price) || (lt_gt === "<" && sorted[0] <= price)) {
                    itemTriggered = true;
                    $(`#watched-item-${item}`).css("background-color", "#99ffcc");
                    //console.log("Market watcher triggered for item " + item);
                }
                else {
                    $(`#watched-item-${item}`).css("background-color", "#ffcccc");
                }
            })
 
            setTimeout(() => {
                const e = document.querySelector("#notification-market-watcher");
                if(e)
                    itemTriggered ? e.classList.remove("hide") : e.classList.add("hide");
            }, 2000);
        }
 
        onVariableSet(key, valueBefore, valueAfter) {
 
        }
 
        saveToLocalStorage(item, value, lt_gt) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY);
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
                jsonData.watchers.push({
                    item: item,
                    value: value,
                    lt_gt: lt_gt
                });
            }
            else {
                jsonData = {
                    watchers: [{
                        item: item,
                        value: value,
                        lt_gt: lt_gt
                    }]
                };
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        }
 
        removeFromLocalStorage(item) {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY);
            var jsonData = {};
            if(ls) {
                jsonData = JSON.parse(ls);
                jsonData.watchers = jsonData.watchers.filter(watcher => watcher.item !== item);
            }
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jsonData));
        }
 
        applyLocalStorage() {
            const ls = localStorage.getItem(LOCAL_STORAGE_KEY);
            if(ls) {
                const jsonData = JSON.parse(ls);
                if(jsonData.watchers && jsonData.watchers.length > 0) {
                    jsonData.watchers.forEach(watcher => {
                        this.createWatcherElement(watcher.item, watcher.value, watcher.lt_gt);
                    });
                    $("#market-watcher-div").show();
                }
            }
        }
 
        configureTableContextMenu(category) {
            const contextMenu = document.getElementById("market-sort-context-menu").getElementsByClassName("menu").item(0);
            for(let child of Array.from(contextMenu.querySelectorAll('li:not([id="context-menu-price-each-item"])'))) {
                child.remove();
            }
            if(category in CATEGORY_RATIOS) {
                for(let i = 0; i < CATEGORY_RATIOS[category].length; i++) {
                    contextMenu.innerHTML +=`<li id="context-menu-ratio-${i}" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-ratio-${i}\");'>
                                                <span> ${CATEGORY_RATIOS[category][i]}</span> 
                                            </li>`;
                }
            }
            else if(this.lastSortIndex != 100) {
                this.lastSortIndex = 0;
                this.contextMenuChangeSelected("context-menu-price-each-item");
            }
            contextMenu.innerHTML +=`<li id="context-menu-negative-diff" onclick='IdlePixelPlus.plugins.market.contextMenuSelectOnClick(\"context-menu-negative-diff\");'>
                                        <span> Trending Value (7d)</span> 
                                    </li>`;
            if(this.lastSortIndex == 0)
                this.contextMenuChangeSelected("context-menu-price-each-item");
            else if(this.lastSortIndex == 100)
                this.contextMenuChangeSelected("context-menu-negative-diff");
            else
                this.contextMenuChangeSelected(`context-menu-ratio-${this.lastSortIndex - 1}`);
        }
 
        contextMenuChangeSelected(menuItem) {
            const e = document.getElementById("market-sort-context-menu-selected");
            if(e)
                e.remove();
            document.getElementById(menuItem).innerHTML += `<span id="market-sort-context-menu-selected">&#x2714;</span>`;
        }
 
        contextMenuSelectOnClick(menuItem) {
            this.contextMenuChangeSelected(menuItem);
            let sortDataIndex = 0;
 
            if(menuItem == "context-menu-negative-diff")
                sortDataIndex = 100;
            else if(menuItem != "context-menu-price-each-item")
                sortDataIndex = parseInt(menuItem.replace(/[^0-9]/g, "")) + 1;
            this.sortTable(sortDataIndex);
            this.updateTable();
        }
 
        marketHeaderOnClick(event) { 
            document.addEventListener("click", () => document.getElementById("market-sort-context-menu").style.display = "none", { once: true });
 
            var menu = document.getElementById("market-sort-context-menu");  
            menu.style.display = 'block'; 
            menu.style.left = event.pageX + "px"; 
            menu.style.top = event.pageY + "px";
 
            event.stopPropagation();
        }
 
        async preloadMarketTradables() {
            const response = await fetch(MARKET_TRADABLES_URL);
            const data = await response.json();
            Market.tradables = data.tradables;
        }
 
        getItemIconUrl(item) {
            return `${IMAGE_HOST_URL}/${item}.png`;
        }
    }
 
    const plugin = new MarketPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();

(function() {
    'use strict';
 
    // This is being used by everyone within this plugin. Please be respectful and don't use it for your own needs. It is free and easy to generate your own key if you want. Thanks.
    const EMOJI_API_KEY = "c29b9f6f19b8664dd77f62c236f29d0279e950b6";
 
    class ChatEmojiPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("emojis", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
            this.cache = {};
        }
 
        openSearch() {
            const el = $("#emoji-search");
 
            // moves cursor to end
            const val = el.val();
            el.val("");
            el.val(val);
 
            const button =  $("#emoji-search-button");
            const buttonPosition = button.position();
            const buttonWidth = button.outerWidth();
            el.css("top", Math.round(buttonPosition.top - el.outerHeight() - 4));
            el.css("left", Math.round(buttonPosition.left + buttonWidth - el.outerWidth() + 4));
 
            const input = $("#emoji-search-input");
            const results = $("#emoji-search-results");
            el.show();
            input.focus();
        }
 
        closeSearch() {
            $("#emoji-search").hide();
        }
 
        toggleSearch() {
            if($("#emoji-search").is(":visible")) {
                this.closeSearch();
            }
            else {
                this.openSearch();
            }
        }
 
        injectEmoji(emoji, focus) {
            const input = document.getElementById("chat-area-input");
            const caret = input.selectionStart || 0;
            const value = input.value || "";
            input.value = value.substring(0, caret) + emoji + value.substring(caret);
            input.selectionStart = caret + emoji.length;
            this.closeSearch();
            if(focus) {
                input.focus();
            }
        }
 
        searchEmojis(search, f) {
            search = search.toLowerCase().trim().replace(/\s+/g, " ");
            if(search in this.cache) {
                if(typeof f === "function") {
                    f(this.cache[search], search);
                }
                return;
            }
            fetch(`https://emoji-api.com/emojis?search=${encodeURIComponent(search)}&access_key=${EMOJI_API_KEY}`)
            .then(resp => resp.json())
            .then(resp => {
                let chars = [];
                if(resp) {
                    resp.forEach(result => {
                        if(result.character && result.character.length <= 2) {
                            chars.push(result.character);
                        }
                        if(result.variants) {
                            result.variants.forEach(variant => {
                                if(variant.character && variant.character.length <= 2) {
                                    chars.push(variant.character);
                                }
                            });
                        }
                    });
                }
                chars = chars.filter((c, i) => {
                    return chars.indexOf(c) === i;
                });
                this.cache[search] = chars;
                if(typeof f === "function") {
                    f(this.cache[search], search);
                }
            })
            .catch(err => {
                console.error("Error fetching emoji data.", err);
            });
        }
 
        onLogin() {
            $("#chat-area-input").after(`<button type="button" id="emoji-search-button">🙂</button>`);
            $("#emoji-search-button").on("click", (e) => this.toggleSearch(e));
            $("head").append(`
            <style>
              #emoji-search {
                position: absolute;
                min-width: 180px;
                min-height: 180px;
                max-width: 180px;
                max-height: 180px;
                display: flex;
                flex-direction: column;
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.2);
                border-radius: 2px;
              }
              #emoji-search-results {
                min-width: 180px;
                max-width: 180px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                overflow-y: auto;
              }
              #emoji-search-results.grid {
                display: grid;
                gap: 2px 2px;
                grid-template-columns: repeat(5, 1fr);
              }
              #emoji-search-results.grid > .emoji-result {
                padding: 2px;
                cursor: pointer;
                opacity: 0.8;
              }
              #emoji-search-results.grid > .emoji-result:hover {
                opacity: 1;
              }
 
 
              .emoji-loading-spinner {
                  color: white;
                  display: inline-block;
                  position: relative;
                  width: 80px;
                  height: 80px;
                  margin-left: auto;
                  margin-right: auto;
                  margin-top: 1em;
              }
              .emoji-loading-spinner div {
                  transform-origin: 40px 40px;
                  animation: emoji-loading-spinner 1.2s linear infinite;
              }
              .emoji-loading-spinner div:after {
                  content: " ";
                  display: block;
                  position: absolute;
                  top: 3px;
                  left: 37px;
                  width: 6px;
                  height: 18px;
                  border-radius: 20%;
                  background: black;
              }
              .emoji-loading-spinner div:nth-child(1) {
                  transform: rotate(0deg);
                  animation-delay: -1.1s;
              }
              .emoji-loading-spinner div:nth-child(2) {
                  transform: rotate(30deg);
                  animation-delay: -1s;
              }
              .emoji-loading-spinner div:nth-child(3) {
                  transform: rotate(60deg);
                  animation-delay: -0.9s;
              }
              .emoji-loading-spinner div:nth-child(4) {
                  transform: rotate(90deg);
                  animation-delay: -0.8s;
              }
              .emoji-loading-spinner div:nth-child(5) {
                  transform: rotate(120deg);
                  animation-delay: -0.7s;
              }
              .emoji-loading-spinner div:nth-child(6) {
                  transform: rotate(150deg);
                  animation-delay: -0.6s;
              }
              .emoji-loading-spinner div:nth-child(7) {
                  transform: rotate(180deg);
                  animation-delay: -0.5s;
              }
              .emoji-loading-spinner div:nth-child(8) {
                  transform: rotate(210deg);
                  animation-delay: -0.4s;
              }
              .emoji-loading-spinner div:nth-child(9) {
                  transform: rotate(240deg);
                  animation-delay: -0.3s;
              }
              .emoji-loading-spinner div:nth-child(10) {
                  transform: rotate(270deg);
                  animation-delay: -0.2s;
              }
              .emoji-loading-spinner div:nth-child(11) {
                  transform: rotate(300deg);
                  animation-delay: -0.1s;
              }
              .emoji-loading-spinner div:nth-child(12) {
                  transform: rotate(330deg);
                  animation-delay: 0s;
              }
              @keyframes emoji-loading-spinner {
                  0% {
                      opacity: 1;
                  }
                  100% {
                      opacity: 0;
                  }
              }
 
            </style>
            `);
            $("body").append(`
            <div id="emoji-search" style="display: none">
              <input id="emoji-search-input" type="text" placeholder="search emojis" />
              <div id="emoji-search-results"></div>
            </div>
            `);
 
            var inputTimer;
            $("#emoji-search-input").on("input", () => {
                clearTimeout(inputTimer);
                inputTimer = setTimeout(() => {
                    const input = $("#emoji-search-input");
                    const results = $("#emoji-search-results");
                    const search = input.val();
 
                    results.empty();
                    results.removeClass("grid");
                    results.append('<div class="emoji-loading-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>');
 
                    this.searchEmojis(search, (arr, query) => {
                        if(search == query) {
                            results.empty();
                            if(arr && arr.length) {
                                results.addClass("grid");
                                const html = arr.map(char => `<div class="emoji-result" onclick="IdlePixelPlus.plugins.emojis.injectEmoji('${char}', true)">${char}</div>`);
                                results.append(html);
                            }
                            else {
                                results.removeClass("grid");
                                results.text("No results.");
                            }
                        }
                    });
                }, 700);
            });
 
            if(typeof IdlePixelPlus.registerCustomChatCommand === "function") {
                IdlePixelPlus.registerCustomChatCommand("emoji", (command, message) => {
                    message = (message||"").trim();
                    if(!message) {
                        return;
                    }
                    this.searchEmojis(message, (arr, query) => {
                        const result = (arr && arr.length) ? arr.join(" ") : "No results.";
                        $("#chat-area").append(`<div><strong>Emojis for "${sanitize_input(query)}"</strong>: ${result}</div>`);
                        if(Chat._auto_scroll) {
                            $("#chat-area").scrollTop($("#chat-area")[0].scrollHeight);
                        }
                    });
                }, "Search for emojis.<br /><strong>Usage:</strong> /%COMMAND% &lt;search&gt;");
            }
 
        }
 
 
 
 
    }
 
    const plugin = new ChatEmojiPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();

(function() {
    'use strict';
 
    const items = $("itembox[data-item]").toArray().map(el => el.getAttribute("data-item")).sort();
 
    class ItemHiderPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("itemhider", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    ... items.map(i => {
                        return {
                            id: "hide-"+i,
                            label: "Hide "+i,
                            type: "boolean",
                            default: false
                        }
                    })
                ]
            });
        }
 
        onConfigsChanged() {
            items.forEach(i => {
                const hide = this.getConfig("hide-"+i);
                if(hide) {
                    $(`itembox[data-item="${i}"]`).addClass("force-hidden");
                }
                else {
                    $(`itembox[data-item="${i}"]`).removeClass("force-hidden");
                }
            });
        }
 
 
        onLogin() {
            const self = this;
 
            $("head").append(`
            <style id="styles-itemhider">
 
              itembox.force-hidden {
                display: none !important;
              }
 
            </style>
            `);
 
            this.onConfigsChanged();
        }
 
    }
 
    const plugin = new ItemHiderPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();


 (function() {
    'use strict';
 
    class ChatLinksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("chatlinks", {
                about: {
                    name: GM_info.script.name,
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }
 
        replaceLinks(message) {
            return anchorme({
                input: message,
                options: {
                    attributes: {
                        target: "_blank"
                    }
                }
            }).replace(/<a(.*?)href="(.+?)"(.*?)>(.+?)<\/a>(-+)/g, '<a$1href="$2$5"$3>$4$5</a>');
        }
 
        onChat(data) {
            const el = $("#chat-area > *").last();
            el.html(this.replaceLinks(el.html()));
        }
 
    }
 
    const plugin = new ChatLinksPlugin();
    IdlePixelPlus.registerPlugin(plugin);
 
})();

(function() {
    'use strict';
 
    const LEVELS = function(){
        let result = [];
        result[1] = 0;
        for(let lv = 2; lv <= 100; lv++) {
            result[lv] = Math.ceil(Math.pow(lv, 3+(lv/200)));
        }
        return result;
    }();
 
    const POTION_XP_MAP = {
        "stardust_potion": 75,
        "energy_potion": 50,
        "anti_disease_potion": 250,
        "tree_speed_potion": 525,
        "smelting_upgrade_potion": 550,
        "great_stardust_potion": 1925,
        "farming_speed_potion": 500,
        "rare_monster_potion": 2125,
        "super_stardust_potion": 4400,
        "gathering_unique_potion": 3000,
        "heat_potion": 2500,
        "bait_potion": 1000,
        "bone_potion": 1550,
        "furnace_speed_potion": 6000,
        "promethium_potion": 2000,
        "oil_potion": 5000,
        "super_rare_monster_potion": 6000,
        "ultra_stardust_potion": 12900,
        "magic_shiny_crystal_ball_potion": 7000,
        "birdhouse_potion": 800,
        "rocket_potion": 1500,
        "titanium_potion": 5000,
        "blue_orb_potion": 50000,
        "geode_potion": 9500,
        "magic_crystal_ball_potion": 12000,
        "stone_converter_potion": 4000,
        "rain_potion": 2500,
        "combat_loot_potion": 9500,
        "rotten_potion": 1250,
        "merchant_speed_potion": 50000,
        "green_orb_potion": 200000,
        "guardian_key_potion": 42500,
        "ancient_potion": 40000,
        "red_orb_potion": 500000,
        "cooks_dust_potion": 100000,
        "farm_dust_potion": 100000,
        "fighting_dust_potion": 100000,
        "tree_dust_potion": 100000,
        "infinite_oil_potion": 0
    }
 
    const FISH_ENERGY_MAP = {
        // Normal Raw Fish
        "shrimp": 25,
        "anchovy": 100,
        "sardine": 200,
        "crab": 500,
        "piranha": 1000,
        "salmon": 100,
        "trout": 300,
        "pike": 1000,
        "eel": 3000,
        "rainbow_fish": 30000,
        "tuna": 500,
        "swordfish": 3000,
        "manta_ray": 9000,
        "shark": 20000,
        "whale": 40000,
 
        // Shiny Raw Fish
        "shrimp_shiny": 125,
        "anchovy_shiny": 500,
        "sardine_shiny": 1000,
        "crab_shiny": 2500,
        "piranha_shiny": 5000,
        "salmon_shiny": 500,
        "trout_shiny": 1500,
        "pike_shiny": 5000,
        "eel_shiny": 15000,
        "rainbow_fish_shiny": 150000,
        "tuna_shiny": 2500,
        "swordfish_shiny": 15000,
        "manta_ray_shiny": 45000,
        "shark_shiny": 100000,
        "whale_shiny": 200000,
 
        // Mega Shiny Raw Fish
        "shrimp_mega_shiny": 625,
        "anchovy_mega_shiny": 2500,
        "sardine_mega_shiny": 5000,
        "crab_mega_shiny": 12500,
        "piranha_mega_shiny": 25000,
        "salmon_mega_shiny": 2500,
        "trout_mega_shiny": 7500,
        "pike_mega_shiny": 25000,
        "eel_mega_shiny": 75000,
        "rainbow_fish_mega_shiny": 750000,
        "tuna_mega_shiny": 12500,
        "swordfish_mega_shiny": 75000,
        "manta_ray_mega_shiny": 225000,
        "shark_mega_shiny": 500000,
        "whale_mega_shiny": 1000000,
 
        // Misc Fish
        "small_stardust_fish": 1000,
        "medium_stardust_fish": 2500,
        "large_stardust_fish": 5000,
        "angler_fish": 100000
    }
 
    const FISH_HEAT_MAP = {
        // Normal Raw Fish
        "shrimp": 10,
        "anchovy": 20,
        "sardine": 40,
        "crab": 75,
        "piranha": 120,
        "salmon": 20,
        "trout": 40,
        "pike": 110,
        "eel": 280,
        "rainbow_fish": 840,
        "tuna": 75,
        "swordfish": 220,
        "manta_ray": 1200,
        "shark": 3000,
        "whale": 5000,
 
        //Shiny Raw Fish
        "shrimp_shiny": 10,
        "anchovy_shiny": 20,
        "sardine_shiny": 40,
        "crab_shiny": 75,
        "piranha_shiny": 120,
        "salmon_shiny": 20,
        "trout_shiny": 40,
        "pike_shiny": 110,
        "eel_shiny": 280,
        "rainbow_fish_shiny": 840,
        "tuna_shiny": 75,
        "swordfish_shiny": 220,
        "manta_ray_shiny": 1200,
        "shark_shiny": 3000,
        "whale_shiny": 5000,
 
        //Mega Shiny Raw Fish
        "shrimp_mega_shiny": 10,
        "anchovy_mega_shiny": 20,
        "sardine_mega_shiny": 40,
        "crab_mega_shiny": 75,
        "piranha_mega_shiny": 120,
        "salmon_mega_shiny": 20,
        "trout_mega_shiny": 40,
        "pike_mega_shiny": 110,
        "eel_mega_shiny": 280,
        "rainbow_fish_mega_shiny": 840,
        "tuna_mega_shiny": 75,
        "swordfish_mega_shiny": 220,
        "manta_ray_mega_shiny": 1200,
        "shark_mega_shiny": 3000,
        "whale_mega_shiny": 5000,
 
        // Misc Fish
        "small_stardust_fish": 300,
        "medium_stardust_fish": 600,
        "large_stardust_fish": 2000,
        "angler_fish": 10000
    }
 
    let onLoginLoaded = false;
 
    const initialPing = () => { IdlePixelPlus.sendCustomMessage("botofnades", {
        content: `uitRocket:rocket:ping`
            })
                              };
    let purpleKeyGo;
    const receivedFilter = ['OPEN_DIALOGUE=MESSAGE'];
    const currentTime = new Date();
    let startTime;
    let timeDiff;
    let purpleKeyTimer;
    let del = false;
 
    function onPurpleKey() {
        const onmessageOld = websocket.connected_socket.onmessage;
        websocket.connected_socket.onmessage = function (event) {
            if (purpleKeyGo && event.data.startsWith("OPEN_DIALOGUE=MESSAGE")) {
                const splitData = event.data.split(/~/);
                const fluffRemoval = splitData[2].replace(`"I will keep the purple guardian key safe, master."<br /><br /><span class='color-grey'>The purple guardian key is being held by the monster shown.  The key will be held by another monster in: `, '').replace("</span><br /><br />Loot chance: ", ';');
                const fluffSplit = fluffRemoval.split(';');
                const timeLeft = fluffSplit[0];
                const rarity = fluffSplit[1];
                const imageSrc = splitData[1];
                const monster = imageSrc
                .replace("images/", "")
                .replace("_icon.png", "")
                .replace(/_/g, " ")
                .replace(/\b\w/g, letter => letter.toUpperCase());
 
                const purpleKeyNotification = document.querySelector('#notification-purple_key');
                const imageElement = document.querySelector('#notification-purple_key-image');
                const imageTextElement = document.querySelector('#notification-purple_key-image-text');
                const rarityElement = document.querySelector('#notification-purple_key-rarity');
                const timeElement = document.querySelector('#notification-purple_key-time');
 
                imageElement.setAttribute("src", `https://d1xsc8x7nc5q8t.cloudfront.net/${imageSrc}`);
                imageTextElement.innerText = monster;
                rarityElement.innerText = ` 🔑${rarity}`;
                timeElement.innerText = ` ⏲️${timeLeft}`;
 
                if (rarity === "Very Rare") {
                    purpleKeyNotification.style.backgroundColor = "DarkRed";
                    [imageTextElement, rarityElement, timeElement].forEach(element => element.style.color = "white");
                } else {
                    let textColor = "black";
                    if (rarity === "Rare") {
                        purpleKeyNotification.style.backgroundColor = "orange";
                    } else if (rarity === "Uncommon") {
                        purpleKeyNotification.style.backgroundColor = "gold";
                    } else if (rarity === "Common") {
                        purpleKeyNotification.style.backgroundColor = "DarkGreen";
                        textColor = "white";
                    }
                    [imageTextElement, rarityElement, timeElement].forEach(element => element.style.color = textColor);
                }
                return;
            }
 
            onmessageOld(event);
        }
    }
 
    function xpToLevel(xp) {
        if(xp <= 0) {
            return 1;
        }
        if(xp >= LEVELS[100]) {
            return 100;
        }
        let lower = 1;
        let upper = 100;
        while(lower <= upper) {
            let mid = Math.floor((lower + upper) / 2);
            let midXP = LEVELS[mid];
            let midPlus1XP = LEVELS[mid+1];
            if(xp < midXP) {
                upper = mid;
                continue;
            }
            if(xp > midPlus1XP) {
                lower=mid+1;
                continue;
            }
            if(mid<100 && xp == LEVELS[mid+1]) {
                return mid+1;
            }
            return mid;
        }
    }
 
 
    // will be overwritten if data available in IdlePixelPlus.info
    const SMELT_TIMES = {
        copper: 3 ,
        iron: 6,
        silver: 15,
        gold: 50,
        promethium: 100,
        titanium: 500,
        ancient_ore: 1800,
        dragon_ore: 3600
    };
 
    const copperItemBox = document.querySelector('itembox[data-item=copper] img');
    const IMAGE_URL_BASE = copperItemBox.getAttribute('src').replace(/\/[^/]+.png$/, '');
 
    const FONTS = [];
    const FONT_DEFAULT = "IdlePixel Default";
    const FONT_FAMILY_DEFAULT = "pixel, \"Courier New\", Courier, monospace";
    (async() => {
        const FONTS_CHECK = new Set([
            // Windows 10
            'Arial', 'Arial Black', 'Bahnschrift', 'Calibri', 'Cambria', 'Cambria Math', 'Candara', 'Comic Sans MS', 'Consolas', 'Constantia', 'Corbel', 'Courier New', 'Ebrima', 'Franklin Gothic Medium', 'Gabriola', 'Gadugi', 'Georgia', 'HoloLens MDL2 Assets', 'Impact', 'Ink Free', 'Javanese Text', 'Leelawadee UI', 'Lucida Console', 'Lucida Sans Unicode', 'Malgun Gothic', 'Marlett', 'Microsoft Himalaya', 'Microsoft JhengHei', 'Microsoft New Tai Lue', 'Microsoft PhagsPa', 'Microsoft Sans Serif', 'Microsoft Tai Le', 'Microsoft YaHei', 'Microsoft Yi Baiti', 'MingLiU-ExtB', 'Mongolian Baiti', 'MS Gothic', 'MV Boli', 'Myanmar Text', 'Nirmala UI', 'Palatino Linotype', 'Segoe MDL2 Assets', 'Segoe Print', 'Segoe Script', 'Segoe UI', 'Segoe UI Historic', 'Segoe UI Emoji', 'Segoe UI Symbol', 'SimSun', 'Sitka', 'Sylfaen', 'Symbol', 'Tahoma', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings', 'Wingdings', 'Yu Gothic',
            // macOS
            'American Typewriter', 'Andale Mono', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Arial Unicode MS', 'Avenir', 'Avenir Next', 'Avenir Next Condensed', 'Baskerville', 'Big Caslon', 'Bodoni 72', 'Bodoni 72 Oldstyle', 'Bodoni 72 Smallcaps', 'Bradley Hand', 'Brush Script MT', 'Chalkboard', 'Chalkboard SE', 'Chalkduster', 'Charter', 'Cochin', 'Comic Sans MS', 'Copperplate', 'Courier', 'Courier New', 'Didot', 'DIN Alternate', 'DIN Condensed', 'Futura', 'Geneva', 'Georgia', 'Gill Sans', 'Helvetica', 'Helvetica Neue', 'Herculanum', 'Hoefler Text', 'Impact', 'Lucida Grande', 'Luminari', 'Marker Felt', 'Menlo', 'Microsoft Sans Serif', 'Monaco', 'Noteworthy', 'Optima', 'Palatino', 'Papyrus', 'Phosphate', 'Rockwell', 'Savoye LET', 'SignPainter', 'Skia', 'Snell Roundhand', 'Tahoma', 'Times', 'Times New Roman', 'Trattatello', 'Trebuchet MS', 'Verdana', 'Zapfino',
            // other
            'Helvetica', 'Garamond',
        ].sort());
        await document.fonts.ready;
        for(const font of FONTS_CHECK.values()) {
            if (document.fonts.check(`12px "${font}"`)) {
                FONTS.push(font);
            }
        }
        FONTS.unshift("IdlePixel Default");
    })();
 
    const BG_COLORS = {
        "#chat-area .server_message": "",
        "body": 'rgb(200, 247, 248)',
        ".top-bar": getComputedStyle(document.querySelector(".top-bar")).backgroundColor,
        "#menu-bar": getComputedStyle(document.querySelector("#menu-bar")).backgroundColor,
        "#chat-area": getComputedStyle(document.querySelector("#chat-area")).backgroundColor,
        "#game-chat": getComputedStyle(document.querySelector("#game-chat")).backgroundColor,
        "#panels": getComputedStyle(document.querySelector("#panels")).backgroundColor,
    };
 
    const FONT_COLORS = {
        "#chat-area .server_message": "",
        "#chat-area": document.querySelector("#chat-area") ? getComputedStyle(document.querySelector("#chat-area")).color : "",
        "#chat-area .color-green": document.querySelector("#chat-area .color-green") ? getComputedStyle(document.querySelector("#chat-area .color-green")).color : "",
        "#chat-area .color-grey": document.querySelector("#chat-area .color-grey") ? getComputedStyle(document.querySelector("#chat-area .color-grey")).color : "",
        "#chat-area .chat-username": document.querySelector("#chat-area .chat-username") ? getComputedStyle(document.querySelector("#chat-area .chat-username")).color : "",
        "#panels": document.querySelector("#panels") ? getComputedStyle(document.querySelector("#panels")).color : "",
        "#panels .color-grey": document.querySelector("#panels .color-grey") ? getComputedStyle(document.querySelector("#panels .color-grey")).color : "",
        "#panels .font-large": document.querySelector("#panels .font-large") ? getComputedStyle(document.querySelector("#panels .font-large")).color : ""
    };
 
    const CHAT_UPDATE_FILTER = [
        "#chat-area",
        "#chat-area .color-green",
        "#chat-area .color-grey",
        "#chat-area .chat-username",
        "#chat-area .server_message"
    ];
 
    const PANEL_UPDATE_FILTER = [
        "#panels"
    ];
 
    class UITweaksPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("ui-tweaks", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                },
                config: [
                    {
                        label: "------------------------------------------------<br/>Chat/Images<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "font",
                        label: "Primary Font",
                        type: "select",
                        options: FONTS,
                        default: FONT_DEFAULT
                    },
                    {
                        id: "sideChat",
                        label: "Side Chat",
                        type: "boolean",
                        default: false
                    },
                    /*{
                        id: "pinChat",
                        label: "Pin Chat on Side (Only works if Side Chat is active. Thanks BanBan)",
                        type: "boolean",
                        default: false
                    },*/
                    {
                        id: "chatLimit",
                        label: "Chat Message Limit (&leq; 0 means no limit)",
                        type: "int",
                        min: -1,
                        max: 5000,
                        default: 0
                    },
                    {
                        id: "imageTitles",
                        label: "Image Mouseover",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "tableLabels",
                        label: "Turn on item component labels for crafting/brewing/invention<br/>May require restart to disable",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "lowerToast",
                        label: "Lower Toast (top-right popup)",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>Combat<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "fightPointsStats",
                        label: "Fight Points in Left Menu",
                        type: "boolean",
                        default: true
                    },
                    {
                        id:"combatInfoSideSelect",
                        label: "Choose which side you want to see the<br/>Fight Points / Rare Pot Duration / Loot Pot info on.<br/>Left (Player info) || Right (Enemy Info)",
                        type: "select",
                        default: "left",
                        options: [
                            {value:"left", label:"Left - Player Side"},
                            {value:"right", label:"Right - Enemy Side"}
                        ]
                    },
                    {
                        label: "------------------------------------------------<br/>Condensed Information<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "condenseWoodcuttingPatches",
                        label: "Condensed Woodcutting Patches",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "condenseFarmingPatches",
                        label: "Condensed Farming Patches",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "condenseGatheringBoxes",
                        label: "Condensed Gathering Boxes",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>Fishing<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "heatInFishingTab",
                        label: "Heat In Fishing Tab",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "minusOneHeatInFishingTab",
                        label: "Heat In Fishing Tab (Minus 1 for collectors)",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "hideAquarium",
                        label: "Hide the notification for Aquarium needing to be fed",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "hideBoat",
                        label: "Hide the notification for Boats (Timer and Collect)",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>Invention<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "hideOrbRing",
                        label: "Hide crafted glass orbs and master ring in invention",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>Misc<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "robotReady",
                        label: "Show Robot Ready",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "moveSDWatch",
                        label: "Move Stardust Watch notifications to left side pannel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "showHeat",
                        label: "Show heat on left side pannel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "showPurpleKeyNotification",
                        label: "Show quick button notification for purple key",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "hideCrystalBall",
                        label: "Hide the notification for crystal ball",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "merchantReady",
                        label: "Show Merchant Ready notification",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "mixerTimer",
                        label: "Show Brewing Mixer timer and charges available",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Oil<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "oilSummaryMining",
                        label: "Oil Summary, Mining Panel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "oilSummaryCrafting",
                        label: "Oil Summary, Crafting Panel",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "oilFullNotification",
                        label: "Oil Full",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "oilGainNotification",
                        label: "Oil Gain Timer",
                        type: "boolean",
                        default: true
                    },
                    {
                        label: "------------------------------------------------<br/>Rocket<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "rocketETATimer",
                        label: "Rocket Notification ETA",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "leftSideRocketInfoSection",
                        label: "Enable moving of rocket information to left side (hides notifications)",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "leftSideRocketInfo",
                        label: "Enable Rocket Distance/Travel Time on left side (hides rocket notification)",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "leftSideRocketFuel",
                        label: "Enable Rocket Fuel Info on left side.",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "leftSideRocketPot",
                        label: "Enable Rocket Pot Info on left side. (hides rocket pot notification)",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "hideRocketKM",
                        label: "Rocket Notification Hide KM",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "goodMoon",
                        label: "Good moon distance<br/>(Range: 250,000 - 450,000)<br/>Type entire number without ','",
                        type: "int",
                        default: 300000
                    },
                    {
                        id: "goodSun",
                        label: "Good sun distance<br/>(Range: 100,000,000 - 200,000,000)<br/>Type entire number without ','",
                        type: "int",
                        default: 130000000
                    },
                    {
                        label: "------------------------------------------------<br/>Smelting/Mining<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "miningMachineArrows",
                        label: "Mining Machine Arrows",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "smeltingNotificationTimer",
                        label: "Smelting Notification Timer",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "furnaceEmptyNotification",
                        label: "Furnace Empty Notification",
                        type: "boolean",
                        default: true
                    },
                    {
                        id: "hideDrillNotifications",
                        label: "Hide Active Mining Machine Notifications on top bar",
                        type: "boolean",
                        default: false
                    },
                    {
                        label: "------------------------------------------------<br/>BG Color Overrides<br/>------------------------------------------------",
                        type:"label"
                    },
                    {
                        id: "disableBGColorOverrides",
                        label: "Disable background color overrides (Check = disabled)<br/>Disable the BG Color Overrides if you are wanting to use<br/>the built in settings for the game for your colors<br/>REFRESH REQUIRED WHEN DISABLING THE BG COLORS<br/>",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-enabled-body",
                        label: "Main Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-body",
                        label: "Main Background: Color",
                        type: "color",
                        default: BG_COLORS["body"]
                    },
                    {
                        id: "color-enabled-panels",
                        label: "Panel Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-panels",
                        label: "Panel Background: Color",
                        type: "color",
                        default: BG_COLORS["#panels"]
                    },
                    {
                        id: "color-enabled-top-bar",
                        label: "Top Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-top-bar",
                        label: "Top Background: Color",
                        type: "color",
                        default: BG_COLORS[".top-bar"]
                    },
                    {
                        id: "color-enabled-menu-bar",
                        label: "Menu Background: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-menu-bar",
                        label: "Menu Background: Color",
                        type: "color",
                        default: BG_COLORS["#menu-bar"]
                    },
                    {
                        id: "color-enabled-chat-area",
                        label: "Inner Chat BG: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-chat-area",
                        label: "Inner Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area"]
                    },
                    {
                        id: "color-enabled-game-chat",
                        label: "Outer Chat BG: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-game-chat",
                        label: "Outer Chat BG: Color",
                        type: "color",
                        default: BG_COLORS["#game-chat"]
                    },
                    {
                        id: "color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: BG_COLORS["#chat-area .server_message"]
                    },
                    {
                        label: "Text Color Overrides",
                        type: "label"
                    },
                    {
                        id: "font-color-enabled-chat-area",
                        label: "Chat Text: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area",
                        label: "Chat Text: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"]
                    },
                    {
                        id: "font-color-enabled-chat-area-color-green",
                        label: "Chat Timestamp: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-color-green",
                        label: "Chat Timestamp: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-green"]
                    },
                    {
                        id: "font-color-enabled-chat-area-chat-username",
                        label: "Chat Username: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-chat-username",
                        label: "Chat Username: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .chat-username"]
                    },
                    {
                        id: "font-color-enabled-chat-area-color-grey",
                        label: "Chat Level: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-color-grey",
                        label: "Chat Level: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"]
                    },
                    {
                        id: "font-color-enabled-chat-area-server_message",
                        label: "Server Message Tag: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-chat-area-server_message",
                        label: "Server Message Tag: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .server_message"]
                    },
                    {
                        id: "serverMessageTextOverrideEnabled",
                        label: "Server Message Text: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "serverMessageTextOverrideColor",
                        label: "Server Message Text: Color",
                        type: "color",
                        default: "blue"
                    },
                    {
                        id: "chatBorderOverrideColorEnabled",
                        label: "Chat Border Color: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "chatBorderOverrideColor",
                        label: "Chat Border Color: Color",
                        type: "color",
                        default: "blue"
                    },
                    {
                        id: "font-color-enabled-panels",
                        label: "Panels 1: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-panels",
                        label: "Panels 1: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area"]
                    },
                    {
                        id: "font-color-enabled-panels-color-grey",
                        label: "Panels 2: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-panels-color-grey",
                        label: "Panels 2: Color",
                        type: "color",
                        default: FONT_COLORS["#chat-area .color-grey"]
                    },
                    {
                        id: "font-color-enabled-panels-font-large",
                        label: "Skill Level Color: Enabled",
                        type: "boolean",
                        default: false
                    },
                    {
                        id: "font-color-panels-font-large",
                        label: "Skill Level: Color",
                        type: "color",
                        default: FONT_COLORS["#panels .font-large"]
                    }
                ]
            });
        }
 
        hideOrbsAndRing() {
            if (Globals.currentPanel === 'panel-invention') {
                const masterRing = IdlePixelPlus.getVarOrDefault("master_ring_assembled", 0, "int");
                const fishingOrb = IdlePixelPlus.getVarOrDefault("mega_shiny_glass_ball_fish_assembled", 0, "int");
                const leafOrb = IdlePixelPlus.getVarOrDefault("mega_shiny_glass_ball_leaf_assembled", 0, "int");
                const logsOrb = IdlePixelPlus.getVarOrDefault("mega_shiny_glass_ball_logs_assembled", 0, "int");
                const monstersOrb = IdlePixelPlus.getVarOrDefault("mega_shiny_glass_ball_monsters_assembled", 0, "int");
                const volcanoTab = IdlePixelPlus.getVarOrDefault("volcano_tablette_charged", 0, "int");
                const ancientTab = IdlePixelPlus.getVarOrDefault("ancient_tablette_charged", 0, "int");
 
                const selectors = {
                    masterRing: "#invention-table > tbody [data-invention-item=master_ring]",
                    fishOrb: "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_fish]",
                    leafOrb: "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_leaf]",
                    logsOrb: "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_logs]",
                    monstersOrb: "#invention-table > tbody [data-invention-item=mega_shiny_glass_ball_monsters]",
                };
 
                const uiTweaksConfig = IdlePixelPlus.plugins['ui-tweaks'].getConfig("hideOrbRing");
 
                for (const orb in selectors) {
                    if (selectors.hasOwnProperty(orb)) {
                        const element = document.querySelector(selectors[orb]);
                        if (uiTweaksConfig) {
                            if (orb === 'masterRing' && masterRing === 1) {
                                element.style.display = 'none';
                            } else if (orb === 'fishingOrb' && fishingOrb === 1) {
                                element.style.display = 'none';
                            } else if (orb === 'leafOrb' && leafOrb === 1) {
                                element.style.display = 'none';
                            } else if (orb === 'logsOrb' && logsOrb === 1) {
                                element.style.display = 'none';
                            } else if (orb === 'monstersOrb' && monstersOrb === 1) {
                                element.style.display = 'none';
                            } else {
                                element.style.display = '';
                            }
                        } else {
                            if ((orb !== 'masterRing' && volcanoTab === 1)) {
                                element.style.display = '';
                            } else if (orb === 'masterRing' && ancientTab === 1) {
                                element.style.display = '';
                            } else {
                                element.style.display = 'none';
                            }
                        }
                    }
                }
            }
        }
 
 
        addTableCraftLabels() {
            // Invention Table
            const inventionTableRows = document.querySelectorAll('#invention-table tbody tr[data-tablette-required]');
            inventionTableRows.forEach(row => {
                const outputs = row.querySelectorAll('td:nth-child(4) item-invention-table');
                outputs.forEach(output => {
                    output.textContent = Number(output.textContent).toLocaleString() + " (" + output.getAttribute("data-materials-item").replaceAll("_", " ") + ")";
                });
            });
 
            // Crafting Table
            const craftingTableRows = document.querySelectorAll('#crafting-table tbody tr[data-crafting-item]');
            craftingTableRows.forEach(row => {
                const outputs = row.querySelectorAll('td:nth-child(3) item-crafting-table');
                outputs.forEach(output => {
                    output.textContent = Number(output.textContent).toLocaleString() + " (" + output.getAttribute("data-materials-item").replaceAll("_", " ") + ")";
                });
            });
 
            // Brewing Table
            const brewingTableRows = document.querySelectorAll('#brewing-table tbody tr[data-brewing-item]');
            brewingTableRows.forEach(row => {
                const outputs = row.querySelectorAll('td:nth-child(3) item-brewing-table');
                outputs.forEach(output => {
                    output.textContent = output.textContent + " (" + output.getAttribute("data-materials-item").replaceAll("_", " ") + ")";
                });
            });
        }
 
        updateTableCraftLabels() {
            const brewingTable = document.querySelector("#brewing-table");
            if (brewingTable) {
                const rows = brewingTable.querySelectorAll("tbody tr[data-brewing-item]");
                rows.forEach(row => {
                    const brewingXP = row.querySelector("td:nth-child(6)");
                    if (brewingXP) {
                        const potionName = brewingXP.id.replace("_xp", "");
                        const potionXP = POTION_XP_MAP[potionName].toLocaleString() + " xp";
                        const potionOrig = document.createElement("span");
                        potionOrig.classList.add("font-small", "color-grey");
                        potionOrig.textContent = potionXP;
                        brewingXP.innerHTML = "";
                        brewingXP.appendChild(potionOrig);
                    }
                });
            }
        }
 
        calcFishEnergy() {
            const fishRawEnergy = Object.keys(FISH_ENERGY_MAP);
            const fishHeat = Object.keys(FISH_HEAT_MAP);
            const fishCookedEnergy = Object.keys(FISH_ENERGY_MAP);
            let totalRawEnergy = 0;
            let totalHeat = 0;
            let totalCookedEnergy = 0;
            let oilGainTimer;
            const collectorModeFish = this.getConfig("minusOneHeatInFishingTab");
 
            fishRawEnergy.forEach(fish => {
                let currentRawFish = IdlePixelPlus.getVarOrDefault("raw_" + fish, 0, "int");
                let currentCookedFish = IdlePixelPlus.getVarOrDefault("cooked_" + fish, 0, "int");
 
                if (currentRawFish > 0 && collectorModeFish) {
                    currentRawFish--;
                }
                if (currentCookedFish > 0 && collectorModeFish) {
                    currentCookedFish--;
                }
                const currentRawEnergy = currentRawFish * FISH_ENERGY_MAP[fish];
                const currentHeat = currentRawFish * FISH_HEAT_MAP[fish];
                const currentCookedEnergy = currentCookedFish * FISH_ENERGY_MAP[fish];
                totalRawEnergy += currentRawEnergy;
                totalHeat += currentHeat;
                totalCookedEnergy += currentCookedEnergy;
            });
 
            document.getElementById("raw-fish-energy-number").textContent = totalRawEnergy.toLocaleString();
            document.getElementById("fish-heat-required-number").textContent = totalHeat.toLocaleString();
            document.getElementById("cooked-fish-energy-number").textContent = totalCookedEnergy.toLocaleString();
        }
 
        miningMachTimer() {
            const drillNotifications = this.getConfig("hideDrillNotifications");
 
            if (drillNotifications) {
                document.getElementById("notification-drill").style.display = "none";
                document.getElementById("notification-crusher").style.display = "none";
                document.getElementById("notification-giant_drill").style.display = "none";
                document.getElementById("notification-excavator").style.display = "none";
                document.getElementById("notification-giant_excavator").style.display = "none";
                document.getElementById("notification-massive_excavator").style.display = "none";
            } else {
                const drill = IdlePixelPlus.getVarOrDefault("drill_on", 0, "int");
                const crusher = IdlePixelPlus.getVarOrDefault("crusher_on", 0, "int");
                const giant_drill = IdlePixelPlus.getVarOrDefault("giant_drill_on", 0, "int");
                const excavator = IdlePixelPlus.getVarOrDefault("excavator_on", 0, "int");
                const giant_excavator = IdlePixelPlus.getVarOrDefault("giant_excavator_on", 0, "int");
                const massive_excavator = IdlePixelPlus.getVarOrDefault("massive_excavator_on", 0, "int");
 
                if (drill > 0) {
                    document.getElementById("notification-drill").style.display = "inline-block";
                }
                if (crusher > 0) {
                    document.getElementById("notification-crusher").style.display = "inline-block";
                }
                if (giant_drill > 0) {
                    document.getElementById("notification-giant_drill").style.display = "inline-block";
                }
                if (excavator > 0) {
                    document.getElementById("notification-excavator").style.display = "inline-block";
                }
                if (giant_excavator > 0) {
                    document.getElementById("notification-giant_excavator").style.display = "inline-block";
                }
                if (massive_excavator > 0) {
                    document.getElementById("notification-massive_excavator").style.display = "inline-block";
                }
            }
        }
 
        oilTimerNotification() {
            const notifDiv = document.createElement('div');
            notifDiv.id = 'notification-oil_gain';
            notifDiv.className = 'notification hover';
            notifDiv.style.marginRight = '4px';
            notifDiv.style.marginBottom = '4px';
            notifDiv.style.display = 'none';
 
            const elem = document.createElement('img');
            elem.setAttribute('src', 'https://d1xsc8x7nc5q8t.cloudfront.net/images/oil.png');
            const notifIcon = elem;
            notifIcon.className = 'w20';
 
            const notifDivLabel = document.createElement('span');
            notifDivLabel.id = 'notification-oil_gain-label';
            notifDivLabel.innerText = ' Loading';
            notifDivLabel.className = 'color-white';
 
            notifDiv.appendChild(notifIcon);
            notifDiv.appendChild(notifDivLabel);
 
            const notificationFurnaceAvail = document.getElementById('notification-furnace_avail');
            if(notificationFurnaceAvail){
                notificationFurnaceAvail.parentNode.insertBefore(notifDiv, notificationFurnaceAvail);
                notifDiv.style.display = 'none';
            }
        }
 
        oilGain() {
            const notificationFurnaceAvail = document.getElementById('notification-furnace_avail');
            const oilDelta = IdlePixelPlus.getVarOrDefault("oil_delta", 0, "int");
            const oil = IdlePixelPlus.getVarOrDefault("oil", 0, "int");
            const oilMax = IdlePixelPlus.getVarOrDefault("max_oil", 0, "int");
            const notificationOilGain = document.getElementById("notification-oil_gain");
            const notificationOilGainLabel = document.getElementById("notification-oil_gain-label");
 
            if(notificationOilGainLabel) {
                if (this.getConfig("oilGainNotification")) {
                    if (oilDelta === 0) {
                        notificationOilGainLabel.textContent = ' Balanced';
                        notificationOilGain.style.display = 'inline-block';
                    } else if (oilDelta < 0) {
                        const oilNega = (oilMax - (oilMax - oil)) / (-oilDelta);
                        const oilNegETA = format_time(oilNega);
                        notificationOilGainLabel.textContent = ' ' + oilNegETA + ' Until Empty';
                        notificationOilGain.style.display = 'inline-block';
                    } else if (oilDelta > 0 && oil !== oilMax) {
                        const oilPosi = (oilMax - oil) / oilDelta;
                        const oilPosETA = format_time(oilPosi);
                        notificationOilGainLabel.textContent = ' ' + oilPosETA + ' Until Full';
                        notificationOilGain.style.display = 'inline-block';
                    } else if (oilDelta > 0 && oil === oilMax) {
                        notificationOilGain.style.display = 'none';
                    }
                } else {
                    notificationOilGain.style.display = 'none';
                }
            }
        }
 
        loot_pot_avail() {
            const notifDiv = document.createElement('div');
            notifDiv.id = `notification-loot_pot_avail`;
            notifDiv.className='notification hover';
            notifDiv.style='margin-right: 4px; margin-bottom: 4px; display: none';
            notifDiv.style.display = "inline-block";
 
            var elem = document.createElement("img");
            elem.setAttribute("src", "https://d1xsc8x7nc5q8t.cloudfront.net/images/combat_loot_potion.png");
            const notifIcon = elem;
            notifIcon.className = "w20";
 
            const notifDivLabel = document.createElement('span');
            notifDivLabel.id = `notification-loot_pot_avail-label`;
            notifDivLabel.innerText = ' Loot Pot Active';
            notifDivLabel.className = 'color-white'
 
            notifDiv.append(notifIcon, notifDivLabel)
            document.querySelector('#notifications-area').append(notifDiv)
        }
 
        extendedLevelsUpdate() {
            let overallLevel = 0;
 
            const xpMining = IdlePixelPlus.getVarOrDefault("mining_xp", 0, "int");
            const extendedLevelMining = this.calculateExtendedLevel(xpMining);
 
            const xpCrafting = IdlePixelPlus.getVarOrDefault("crafting_xp", 0, "int");
            const extendedLevelCrafting = this.calculateExtendedLevel(xpCrafting);
 
            const xpGathering = IdlePixelPlus.getVarOrDefault("gathering_xp", 0, "int");
            const extendedLevelGathering = this.calculateExtendedLevel(xpGathering);
 
            const xpFarming = IdlePixelPlus.getVarOrDefault("farming_xp", 0, "int");
            const extendedLevelFarming = this.calculateExtendedLevel(xpFarming);
 
            const xpBrewing = IdlePixelPlus.getVarOrDefault("brewing_xp", 0, "int");
            const extendedLevelBrewing = this.calculateExtendedLevel(xpBrewing);
 
            const xpWoodcutting = IdlePixelPlus.getVarOrDefault("woodcutting_xp", 0, "int");
            const extendedLevelWoodcutting = this.calculateExtendedLevel(xpWoodcutting);
 
            const xpCooking = IdlePixelPlus.getVarOrDefault("cooking_xp", 0, "int");
            const extendedLevelCooking = this.calculateExtendedLevel(xpCooking);
 
            const xpFishing = IdlePixelPlus.getVarOrDefault("fishing_xp", 0, "int");
            const extendedLevelFishing = this.calculateExtendedLevel(xpFishing);
 
            const xpInvention = IdlePixelPlus.getVarOrDefault("invention_xp", 0, "int");
            const extendedLevelInvention = this.calculateExtendedLevel(xpInvention);
 
            const xpMelee = IdlePixelPlus.getVarOrDefault("melee_xp", 0, "int");
            const extendedLevelMelee = this.calculateExtendedLevel(xpMelee);
 
            const xpArchery = IdlePixelPlus.getVarOrDefault("archery_xp", 0, "int");
            const extendedLevelArchery = this.calculateExtendedLevel(xpArchery);
 
            const xpMagic = IdlePixelPlus.getVarOrDefault("magic_xp", 0, "int");
            const extendedLevelMagic = this.calculateExtendedLevel(xpMagic);
 
            overallLevel = extendedLevelMining + extendedLevelCrafting + extendedLevelGathering + extendedLevelFarming + extendedLevelBrewing + extendedLevelWoodcutting + extendedLevelCooking + extendedLevelFishing + extendedLevelInvention + extendedLevelMelee + extendedLevelArchery + extendedLevelMagic;
 
            // Build new levels in place.
            this.updateExtendedLevel("mining", extendedLevelMining);
            this.updateExtendedLevel("crafting", extendedLevelCrafting);
            this.updateExtendedLevel("gathering", extendedLevelGathering);
            this.updateExtendedLevel("farming", extendedLevelFarming);
            this.updateExtendedLevel("brewing", extendedLevelBrewing);
            this.updateExtendedLevel("woodcutting", extendedLevelWoodcutting);
            this.updateExtendedLevel("cooking", extendedLevelCooking);
            this.updateExtendedLevel("fishing", extendedLevelFishing);
            this.updateExtendedLevel("invention", extendedLevelInvention);
            this.updateExtendedLevel("melee", extendedLevelMelee);
            this.updateExtendedLevel("archery", extendedLevelArchery);
            this.updateExtendedLevel("magic", extendedLevelMagic);
 
            this.updateOverallLevel(overallLevel);
 
            // Hide original level elements
            this.hideOriginalLevels();
        }
 
        calculateExtendedLevel(xp) {
            let extendedLevel = 0;
            while (Math.pow(extendedLevel, (3 + (extendedLevel / 200))) < xp) {
                extendedLevel++;
            }
            return extendedLevel - 1;
        }
 
        updateExtendedLevel(skill, extendedLevel) {
            const skillElement = document.querySelector(`#overallLevelExtended-${skill}`);
            const colorStyle = extendedLevel >= 100 ? "color:cyan" : "";
            skillElement.textContent = `(LEVEL ${Math.max(extendedLevel, 1)})`;
            skillElement.setAttribute("style", colorStyle);
        }
 
        updateOverallLevel(overallLevel) {
            const totalElement = document.querySelector("#overallLevelExtended-total");
            if (overallLevel >= 100) {
                totalElement.textContent = ` (${overallLevel})`;
                totalElement.style.color = "cyan";
                /*if(document.querySelector("#top-bar > a:nth-child(4) > item-display")) {
                    document.querySelector("#top-bar > a:nth-child(4) > item-display").style.display = "none";
                } else {
                    document.querySelector("#top-bar > a:nth-child(5) > item-display").style.display = "none";
                }*/
            } else {
                totalElement.textContent = "";
                totalElement.style.display = "none";
            }
        }
 
        hideOriginalLevels() {
            const skills = [
                "mining", "crafting", "gathering", "farming", "brewing", "woodcutting", "cooking",
                "fishing", "invention", "melee", "archery", "magic"
            ];
 
            skills.forEach(skill => {
                const skillElement = document.querySelector(`#menu-bar-${skill}-level`);
                if (skillElement) {
                    skillElement.style.display = "none";
                }
            });
        }
 
        purpleKeyLoop() {
            const purpleKeyUpdates = setInterval(function() {
                if(Globals.currentPanel != "panel-combat-canvas" && purpleKeyGo) {
                    websocket.send('CASTLE_MISC=guardian_purple_key_hint')
                }
            }, 4000)
            }
 
        fightPointsFull() {
            const max = IdlePixelPlus.getVarOrDefault("max_fight_points", 0, "int");
            const current = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int");
            const remaining = max - current;
            const remaining_time = format_time(remaining);
 
            const fightPointsFullTimerMain = document.querySelector("#fight-points-full-id-menu");
            const fightPointsFullTimerCombat = document.querySelector("#fight-points-full-id-combat");
 
 
 
            if (remaining === 0) {
                fightPointsFullTimerMain.textContent = "full";
                fightPointsFullTimerCombat.textContent = "full";
            } else {
                var masterRingEquip = IdlePixelPlus.getVarOrDefault("master_ring_equipped", 0, "int");
                if (masterRingEquip === 1) {
                    fightPointsFullTimerMain.textContent = format_time(remaining / 2);
                    fightPointsFullTimerCombat.textContent = format_time(remaining / 2);
                } else {
                    fightPointsFullTimerMain.textContent = remaining_time;
                    fightPointsFullTimerCombat.textContent = remaining_time;
                }
            }
        }
 
        //////////////////////////////// updateColors Start ////////////////////////////////
        updateColors(filter) {
            const bgColorCheck = this.getConfig("disableBGColorOverrides");
 
            if (!bgColorCheck) {
                Object.keys(BG_COLORS).forEach(selector => {
                    if (!filter || filter.includes(selector)) {
                        const key = selector.replace(/[#\.]/g, '').replace(/-?\s+-?/, "-");
                        const enabled = this.getConfig(`color-enabled-${key}`);
                        const color = enabled ? this.getConfig(`color-${key}`) : BG_COLORS[selector];
                        const selected = document.querySelectorAll(selector);
 
                        for (const element of selected) {
                            element.style.backgroundColor = color;
                        }
                    }
                });
 
                Object.keys(FONT_COLORS).forEach(selector => {
                    if (!filter || filter.includes(selector)) {
                        const key = selector.replace(/[#\.]/g, '').replace(/-?\s+-?/, "-");
                        const enabled = this.getConfig(`font-color-enabled-${key}`);
                        const color = enabled ? this.getConfig(`font-color-${key}`) : FONT_COLORS[selector];
                        const selected = document.querySelectorAll(selector);
 
                        for (const element of selected) {
                            element.style.color = color;
                        }
                    }
                });
 
                const chatBorderOverrideColorEnabled = this.getConfig("chatBorderOverrideColorEnabled");
                const chatBorderOverrideColor = this.getConfig("chatBorderOverrideColor");
                if (chatBorderOverrideColorEnabled) {
                    const chatElements = document.querySelectorAll("#game-chat.chat.m-3");
                    for (const element of chatElements) {
                        element.style.borderColor = chatBorderOverrideColor;
                    }
                }
 
                const serverMessageTextOverrideEnabled = this.getConfig("serverMessageTextOverrideEnabled");
                const serverMessageTextOverrideColor = serverMessageTextOverrideEnabled ? this.getConfig("serverMessageTextOverrideColor") : "blue";
                const serverMessageElements = document.querySelectorAll("#chat-area .server_message");
                for (const element of serverMessageElements) {
                    element.parentElement.style.color = serverMessageTextOverrideColor;
                }
            }
        }
 
        //////////////////////////////// updateColors end ////////////////////////////////
 
 
 
 
        //////////////////////////////// onConfigsChanged Start ////////////////////////////////
        onConfigsChanged() {
            if(onLoginLoaded) {
                initialPing();
                this.fightPointsFull();
                this.miningMachTimer();
 
                document.body.style.fontFamily = '';
                const font = this.getConfig("font");
                if (font && font !== FONT_DEFAULT) {
                    const bodyStyle = document.body.getAttribute("style");
                    document.body.setAttribute("style", `${bodyStyle}; font-family: ${font} !important`);
                }
 
                const sideChat = this.getConfig("sideChat");
                if (sideChat) {
                    document.getElementById("content").classList.add("side-chat");
                } else {
                    document.getElementById("content").classList.remove("side-chat");
                }
 
                /*const pinChat = this.getConfig("pinChat");
                if (sideChat && pinChat) {
                    // Pin when both side chat and pin chat options are enabled
                    document.getElementById("game-chat").style.position = "sticky";
                    document.getElementById("game-chat").style.top = 0;
                } else {
                    // No existing position or top styles for game-chat element so safe to remove them if we've already added them
                    document.getElementById("game-chat").style.position = null;
                    document.getElementById("game-chat").style.top = null;
                }*/
 
                if (this.getConfig("fightPointsStats")) {
                    document.getElementById("menu-bar-fight-points").style.display = "block";
                }
                if (this.getConfig("fightPointsStats")) {
                    document.getElementById("menu-bar-fight-points").style.display = "block";
                    document.getElementById("menu-bar-fight-fight-points").style.display = "block";
                } else {
                    document.getElementById("menu-bar-fight-points").style.display = "none";
                    document.getElementById("menu-bar-fight-fight-points").style.display = "none";
                }
 
                //////
                const condenseWoodcuttingPatches = this.getConfig("condenseWoodcuttingPatches");
                if (condenseWoodcuttingPatches) {
                    const farmingPatchesArea = document.querySelector("#panel-woodcutting .farming-patches-area");
                    farmingPatchesArea.classList.add("condensed");
                    document.querySelectorAll("#panel-woodcutting .farming-patches-area img[id^='img-tree_shiny']").forEach(function (el) {
                        el.removeAttribute("width");
                        el.removeAttribute("height");
                    });
                } else {
                    const farmingPatchesArea = document.querySelector("#panel-woodcutting .farming-patches-area");
                    farmingPatchesArea.classList.remove("condensed");
                    document.querySelectorAll("#panel-woodcutting .farming-patches-area img[id^='img-tree_shiny']").forEach(function (el) {
                        el.setAttribute("width", el.getAttribute("original-width"));
                        el.setAttribute("height", el.getAttribute("original-height"));
                    });
                }
 
                const condenseFarmingPatches = this.getConfig("condenseFarmingPatches");
                if (condenseFarmingPatches) {
                    const farmingPatchesArea = document.querySelector("#panel-farming .farming-patches-area");
                    farmingPatchesArea.classList.add("condensed");
                    document.querySelectorAll("#panel-farming .farming-patches-area img[id^='img-farm_shiny']").forEach(function (el) {
                        el.removeAttribute("width");
                        el.removeAttribute("height");
                    });
                } else {
                    const farmingPatchesArea = document.querySelector("#panel-farming .farming-patches-area");
                    farmingPatchesArea.classList.remove("condensed");
                    document.querySelectorAll("#panel-farming .farming-patches-area img[id^='img-farm_shiny']").forEach(function (el) {
                        el.setAttribute("width", el.getAttribute("original-width"));
                        el.setAttribute("height", el.getAttribute("original-height"));
                    });
                }
 
                const condenseGatheringBoxes = this.getConfig("condenseGatheringBoxes");
                if (condenseGatheringBoxes) {
                    const gatheringBoxes = document.querySelectorAll("#panel-gathering .gathering-box");
                    gatheringBoxes.forEach(function (el) {
                        el.classList.add("condensed");
                    });
                } else {
                    const gatheringBoxes = document.querySelectorAll("#panel-gathering .gathering-box");
                    gatheringBoxes.forEach(function (el) {
                        el.classList.remove("condensed");
                    });
                }
 
                if (this.getConfig("imageTitles")) {
                    const images = document.querySelectorAll("img");
                    images.forEach(function (el) {
                        const src = el.getAttribute("src");
                        if (src && src !== "x") {
                            const title = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                            el.setAttribute("title", title);
                        }
                    });
                } else {
                    const images = document.querySelectorAll("img");
                    images.forEach(function (el) {
                        el.removeAttribute("title");
                    });
                }
 
                if (this.getConfig("miningMachineArrows")) {
                    const panelMining = document.querySelector("#panel-mining");
                    panelMining.classList.add("add-arrow-controls");
                } else {
                    const panelMining = document.querySelector("#panel-mining");
                    panelMining.classList.remove("add-arrow-controls");
                }
                //////
                document.addEventListener("DOMContentLoaded", function() {
                    const toast = document.querySelector(".toast-container");
                    if (toast) {
                        if (this.getConfig("lowerToast")) {
                            toast.classList.remove("top-0");
                            toast.style.top = "45px";
                        } else {
                            toast.style.top = "";
                            toast.classList.add("top-0");
                        }
                    }
                });
 
                const oilSummaryMining = this.getConfig("oilSummaryMining");
                if (oilSummaryMining) {
                    document.getElementById("oil-summary-mining").style.display = "block";
                } else {
                    document.getElementById("oil-summary-mining").style.display = "none";
                }
 
                const oilSummaryCrafting = this.getConfig("oilSummaryCrafting");
                if (oilSummaryCrafting) {
                    document.getElementById("oil-summary-crafting").style.display = "block";
                } else {
                    document.getElementById("oil-summary-crafting").style.display = "none";
                }
 
                const smeltingNotificationTimer = this.getConfig("smeltingNotificationTimer");
                if (smeltingNotificationTimer) {
                    document.getElementById("notification-furnace-timer").style.display = "inline-block";
                } else {
                    document.getElementById("notification-furnace-timer").style.display = "none";
                }
 
                const rocketETATimer = this.getConfig("rocketETATimer");
                if (rocketETATimer) {
                    document.getElementById("notification-rocket-timer").style.display = "inline-block";
                    document.getElementById("notification-mega_rocket-timer").style.display = "inline-block";
                } else {
                    document.getElementById("notification-rocket-timer").style.display = "none";
                    document.getElementById("notification-mega_rocket-timer").style.display = "none";
                }
 
                const hideRocketKM = this.getConfig("hideRocketKM");
                if (hideRocketKM) {
                    document.getElementById("notification-rocket-label").style.display = "none";
                    document.getElementById("notification-mega_rocket-label").style.display = "none";
                } else {
                    document.getElementById("notification-rocket-label").style.display = "inline-block";
                    document.getElementById("notification-mega_rocket-label").style.display = "inline-block";
                }
 
                const heatInFishingTab = this.getConfig("heatInFishingTab");
                const heatFishingTab = document.getElementById("heat-fishing-tab");
                if (heatInFishingTab) {
                    heatFishingTab.style.display = "block";
                    heatFishingTab.setAttribute("data-item", "heat");
                } else {
                    heatFishingTab.style.display = "none";
                    heatFishingTab.removeAttribute("data-item");
                }
 
                const merchantReady = this.getConfig("merchantReady");
                const merchAvail = IdlePixelPlus.getVarOrDefault("merchant");
                const merchantAvailNotification = document.getElementById("notification-merchant_avail");
                if (merchAvail === 1) {
                    if (merchantReady) {
                        merchantAvailNotification.style.display = "inline-block";
                    } else {
                        merchantAvailNotification.style.display = "none";
                    }
                }
 
                const mixerTimer = this.getConfig("mixerTimer");
                const mixerAvail = IdlePixelPlus.getVarOrDefault("brewing_xp_mixer_crafted");
                const brewingMixerTimerNotification = document.getElementById("notification-brewing_mixer_timer");
                if (mixerAvail == 1) {
                    if (mixerTimer) {
                        brewingMixerTimerNotification.style.display = "inline-block";
                    } else {
                        brewingMixerTimerNotification.style.display = "none";
                    }
                }
 
                const robotReady = this.getConfig("robotReady");
                const robotAvail = IdlePixelPlus.getVarOrDefault("robot_crafted");
                const robotAvailNotification = document.getElementById("notification-robot_avail");
                if (robotReady && robotAvailNotification) {
                    if (robotReady) {
                        robotAvailNotification.style.display = "inline-block";
                    } else {
                        robotAvailNotification.style.display = "none";
                    }
                }
 
                const drillNotifications = this.getConfig("hideDrillNotifications");
                if (drillNotifications) {
                    this.miningMachTimer();
                }
 
                //////
                const sdWatchShow = this.getConfig("moveSDWatch");
                const sdWatchUnlocked = IdlePixelPlus.getVarOrDefault("stardust_watch_crafted", 0, "int");
                if (sdWatchShow && sdWatchUnlocked === 1) {
                    document.getElementById("notification-stardust_watch").style.display = "none";
                    document.getElementById("menu-bar-sd_watch").style.display = "block";
                } else if (!sdWatchShow && sdWatchUnlocked === 1) {
                    document.getElementById("notification-stardust_watch").style.display = "inline-block";
                    document.getElementById("menu-bar-sd_watch").style.display = "none";
                } else {
                    document.getElementById("notification-stardust_watch").style.display = "none";
                    document.getElementById("menu-bar-sd_watch").style.display = "none";
                }
 
                const showHeat = this.getConfig("showHeat");
                if (showHeat) {
                    document.getElementById("menu-bar-heat").style.display = "block";
                } else {
                    document.getElementById("menu-bar-heat").style.display = "none";
                }
 
                this.onVariableSet("oil", window.var_oil, window.var_oil);
 
                this.updateColors();
 
                const combatInfoPanel = this.getConfig("combatInfoSideSelect");
                if (combatInfoPanel === "left") {
                    document.getElementById("combat-info-fight_point-left").style.display = "block";
                    document.getElementById("combat-info-rare_pot-left").style.display = "block";
                    document.getElementById("combat-info-loot_pot-left").style.display = "block";
                    document.getElementById("combat-info-fight_point-right").style.display = "none";
                    document.getElementById("combat-info-rare_pot-right").style.display = "none";
                    document.getElementById("combat-info-loot_pot-right").style.display = "none";
                } else {
                    document.getElementById("combat-info-fight_point-left").style.display = "none";
                    document.getElementById("combat-info-rare_pot-left").style.display = "none";
                    document.getElementById("combat-info-loot_pot-left").style.display = "none";
                    document.getElementById("combat-info-fight_point-right").style.display = "block";
                    document.getElementById("combat-info-rare_pot-right").style.display = "block";
                    document.getElementById("combat-info-loot_pot-right").style.display = "block";
                }
 
                const showPurpleKey = this.getConfig("showPurpleKeyNotification");
                const purpleKeyUnlock = IdlePixelPlus.getVarOrDefault("guardian_purple_key_hint", 0, "int");
                if (showPurpleKey && purpleKeyUnlock === 1) {
                    document.getElementById("notification-purple_key").style.display = "inline-block";
                } else {
                    document.getElementById("notification-purple_key").style.display = "none";
                }
 
                const hideBoatNotifications = this.getConfig("hideBoat");
                const pirate_ship_timer = IdlePixelPlus.getVarOrDefault("pirate_ship_timer", 0, "int");
                const row_boat_timer = IdlePixelPlus.getVarOrDefault("row_boat_timer", 0, "int");
                const canoe_boat_timer = IdlePixelPlus.getVarOrDefault("canoe_boat_timer", 0, "int");
                const stardust_boat_timer = IdlePixelPlus.getVarOrDefault("stardust_boat_timer", 0, "int");
                if (hideBoatNotifications) {
                    document.getElementById("notification-row_boat").style.display = "none";
                    document.getElementById("notification-canoe_boat").style.display = "none";
                    document.getElementById("notification-stardust_boat").style.display = "none";
                    document.getElementById("notification-pirate_ship").style.display = "none";
                } else {
                    if (row_boat_timer > 0) {
                        document.getElementById("notification-row_boat").style.display = "inline-block";
                    }
                    if (canoe_boat_timer > 0) {
                        document.getElementById("notification-canoe_boat").style.display = "inline-block";
                    }
                    if (stardust_boat_timer > 0) {
                        document.getElementById("notification-stardust_boat").style.display = "inline-block";
                    }
                    if (pirate_ship_timer > 0) {
                        document.getElementById("notification-pirate_ship").style.display = "inline-block";
                    }
                }
 
                //////
                const rocket_usable = IdlePixelPlus.getVarOrDefault("rocket_usable", 0, "int");
                const rocket_travel_check = IdlePixelPlus.getVarOrDefault("rocket_distance_required", 0, "int");
                const rocket_pot_timer_check = IdlePixelPlus.getVarOrDefault("rocket_potion_timer", 0, "int");
                const rocket_check = IdlePixelPlus.getVarOrDefault("mega_rocket", 0, "int");
 
                if (this.getConfig("leftSideRocketInfoSection") && rocket_usable > 0) {
                    document.getElementById("current-rocket-info").style.display = "block";
 
                    if (this.getConfig("leftSideRocketInfo")) {
                        document.getElementById("rocket-travel-info").style.display = "block";
                        document.getElementById("notification-mega_rocket").style.display = "none";
                        document.getElementById("notification-rocket").style.display = "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 1) {
                        document.getElementById("notification-mega_rocket").style.display = "block";
                        document.getElementById("rocket-travel-info").style.display = "none";
                    } else if (rocket_travel_check > 0 && rocket_check == 0) {
                        document.getElementById("notification-rocket").style.display = "block";
                        document.getElementById("rocket-travel-info").style.display = "none";
                    } else {
                        document.getElementById("rocket-travel-info").style.display = "none";
                    }
 
                    if (this.getConfig("leftSideRocketFuel")) {
                        document.getElementById("current-rocket-fuel-info").style.display = "block";
                    } else {
                        document.getElementById("current-rocket-fuel-info").style.display = "none";
                    }
 
                    if (this.getConfig("leftSideRocketPot")) {
                        document.getElementById("current-rocket-pot-info").style.display = "block";
                        document.getElementById("notification-potion-rocket_potion_timer").style.display = "none";
                    } else if (rocket_pot_timer_check > 0) {
                        document.getElementById("notification-potion-rocket_potion_timer").style.display = "block";
                        document.getElementById("current-rocket-pot-info").style.display = "none";
                    } else {
                        document.getElementById("current-rocket-pot-info").style.display = "none";
                    }
                } else {
                    document.getElementById("current-rocket-info").style.display = "none";
                }
 
                if (rocket_travel_check === 0) {
                    document.getElementById("current-rocket-travel-distances").textContent = "Rocket is IDLE";
                    document.querySelector("img#rocket-type-img-mega").style.transform = "rotate(315deg)";
                    document.querySelector("img#rocket-type-img-mega").style.display = "block";
                }
 
                setTimeout(function () {
                    if(document.getElementById('notification-furnace_avail')) {
                        const furnaceOreTypeVar = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_set", 0, "int");
                        const furnaceNotifVar = IdlePixelPlus.plugins['ui-tweaks'].getConfig("furnaceEmptyNotification");
                        if (furnaceOreTypeVar <= 0 && furnaceNotifVar) {
                            document.getElementById('notification-furnace_avail').style.display = "inline-block";
                        } else {
                            document.getElementById('notification-furnace_avail').style.display = "none";
                        }
                    }
                }, 500);
 
                const purpleKeyGo = this.getConfig("showPurpleKeyNotification");
 
            }
        }
        //////////////////////////////// onConfigsChanged End ////////////////////////////////
 
 
        //////////////////////////////// onLogin Start ////////////////////////////////
        onLogin() {
 
            function addLoadingSpanAfterElement(selector, id) {
                const element = document.querySelector(selector);
                const loadingSpan = document.createElement("span");
                loadingSpan.id = id;
                loadingSpan.textContent = "(Loading)";
                loadingSpan.className = "color-silver";
                element.insertAdjacentElement('afterend', loadingSpan);
            }
            if(document.querySelector("#top-bar > a:nth-child(4) > item-display")) {
                addLoadingSpanAfterElement("#top-bar > a:nth-child(4) > item-display", "overallLevelExtended-total");
            } else {
                addLoadingSpanAfterElement("#top-bar > a:nth-child(5) > item-display", "overallLevelExtended-total");
            }
            addLoadingSpanAfterElement("#menu-bar-mining-level", "overallLevelExtended-mining");
            addLoadingSpanAfterElement("#menu-bar-crafting-level", "overallLevelExtended-crafting");
            addLoadingSpanAfterElement("#menu-bar-gathering-level", "overallLevelExtended-gathering");
            addLoadingSpanAfterElement("#menu-bar-farming-level", "overallLevelExtended-farming");
            addLoadingSpanAfterElement("#menu-bar-brewing-level", "overallLevelExtended-brewing");
            addLoadingSpanAfterElement("#menu-bar-woodcutting-level", "overallLevelExtended-woodcutting");
            addLoadingSpanAfterElement("#menu-bar-cooking-level", "overallLevelExtended-cooking");
            addLoadingSpanAfterElement("#menu-bar-fishing-level", "overallLevelExtended-fishing");
            addLoadingSpanAfterElement("#menu-bar-invention-level", "overallLevelExtended-invention");
            addLoadingSpanAfterElement("#menu-bar-melee-level", "overallLevelExtended-melee");
            addLoadingSpanAfterElement("#menu-bar-archery-level", "overallLevelExtended-archery");
            addLoadingSpanAfterElement("#menu-bar-magic-level", "overallLevelExtended-magic");
 
 
            this.updateColors();
 
            var loot_pot = IdlePixelPlus.getVarOrDefault("combat_loot_potion_active", 0, "int");
            var merchantTiming = IdlePixelPlus.getVarOrDefault("merchant_timer", 0, "int");
            var merchantUnlocked = IdlePixelPlus.getVarOrDefault("merchant", 0, "int");
            let robotTiming = IdlePixelPlus.getVarOrDefault("robot_wave_timer", 0, "int");
            var robotUnlocked = IdlePixelPlus.getVarOrDefault("robot_crafted", 0, "int");
            const tableLabel = this.getConfig("tableLabels");
            this.loot_pot_avail();
            if(tableLabel) {
                this.addTableCraftLabels();
            }
 
            const addBrewerNotifications = (timer, charges) => {
                var mixerUnlocked = IdlePixelPlus.getVarOrDefault("brewing_xp_mixer_crafted");
                const notifDiv = document.createElement('div');
                notifDiv.id = `notification-brewing_mixer_timer`;
                notifDiv.onclick = function () {
                    websocket.send(switch_panels('panel-brewing'));
                    websocket.send(Modals.clicks_brewing_xp_mixer());
                }
                notifDiv.className='notification hover';
                notifDiv.style='margin-bottom: 4px; display: none';
                notifDiv.style.display = "inline-block";
 
                var elem = document.createElement("img");
                elem.setAttribute("src", "https://d1xsc8x7nc5q8t.cloudfront.net/images/brewing_xp_mixer.png");
                const notifIcon = elem;
                notifIcon.className = 'w20';
 
                const notifDivLabel = document.createElement('span');
                notifDivLabel.id = `notification-brewing_mixer_timer-label`;
                notifDivLabel.innerText = " " + timer + " (" +charges+"/5)";
                notifDivLabel.className = 'color-white'
 
                notifDiv.append(notifIcon, notifDivLabel)
                document.querySelector('#notifications-area').prepend(notifDiv)
                if(mixerUnlocked == 0) {
                    document.querySelector('#brewing_mixer_timer').style.display = "none";
                }
            }
 
            const brewingTimer = () => {
                var mixerUnlocked = IdlePixelPlus.getVarOrDefault("brewing_xp_mixer_crafted");
                if(mixerUnlocked == 1) {
                    let playerTimer = IdlePixelPlus.getVarOrDefault("playtime", 0, "int");
                    let chargesUsed = IdlePixelPlus.getVarOrDefault("brewing_xp_mixer_used", 0, "int");
                    let chargesLeft = 5 - chargesUsed;
                    let playTimeMod = (1 - ((playerTimer / (86400)) - Math.floor(playerTimer / (86400))));
                    let etaTimerBrew = format_time(playTimeMod*86400);
 
                    const runBrewingTimer = setInterval(function() {
                        playerTimer = IdlePixelPlus.getVarOrDefault("playtime", 0, "int");
                        chargesUsed = IdlePixelPlus.getVarOrDefault("brewing_xp_mixer_used", 0, "int");
                        chargesLeft = 5 - chargesUsed;
                        playTimeMod = (1 - ((playerTimer / (86400)) - Math.floor(playerTimer / (86400))));
                        etaTimerBrew = format_time(playTimeMod*86400);
                        const brewingLabel = document.querySelector('#notification-brewing_mixer_timer-label')
                        brewingLabel.innerText = ` ${etaTimerBrew} (${chargesLeft}/5)`;
                    }, 1000);
 
                    addBrewerNotifications(etaTimerBrew, chargesLeft);
                }
            }
 
            const addMerchantNotifications = () => {
                var merchantTimerCheck = IdlePixelPlus.getVarOrDefault("merchant_timer", 0, "int");
                var merchantUnlocked = IdlePixelPlus.getVarOrDefault("merchant", 0, "int");
                const notifDiv = document.createElement('div');
                notifDiv.id = `notification-merchant_avail`;
                notifDiv.onclick = function () {
                    websocket.send(switch_panels('panel-shop'));
                }
                notifDiv.className='notification hover';
                notifDiv.style='margin-right: 4px; margin-bottom: 4px; display: none';
                notifDiv.style.display = "inline-block";
 
                var elem = document.createElement("img");
                elem.setAttribute("src", "https://d1xsc8x7nc5q8t.cloudfront.net/images/merchant.png");
                const notifIcon = elem;
                notifIcon.className = "w20";
 
                const notifDivLabel = document.createElement('span');
                notifDivLabel.id = `notification-merchant_avail-label`;
                notifDivLabel.innerText = ' Merchant Ready';
                notifDivLabel.className = 'color-white'
 
                notifDiv.append(notifIcon, notifDivLabel)
                document.querySelector('#notifications-area').prepend(notifDiv)
                if(merchantTimerCheck > 0 || merchantUnlocked == 0) {
                    document.querySelector('#notification-merchant_avail').style.display = "none";
                }
            }
 
            const merchantTimer = () => {
                var merchantUnlocked = IdlePixelPlus.getVarOrDefault("merchant", 0, "int");
                if(merchantUnlocked == 1) {
                    let merchantTiming = IdlePixelPlus.getVarOrDefault("merchant_timer", 0, "int");
                    let etaTimerMerch = format_time(merchantTiming);
                    const runMerchantTimer = setInterval(function() {
                        merchantTiming = IdlePixelPlus.getVarOrDefault("merchant_timer", 0, "int");
                        etaTimerMerch = format_time(merchantTiming);
                        const merchantLabel = document.querySelector('#notification-merchant_avail-label')
                        if(merchantTiming == 0) {
                            merchantLabel.innerText = ` Merchant Ready`;
                            document.querySelector("#notification-merchant_avail").style.display = 'inline-block';
                        }
                        else {
                            document.querySelector("#notification-merchant_avail").style.display = 'none';
                        }
                    }, 1000);
 
                    addMerchantNotifications(etaTimerMerch);
                }
            }
 
            const addFurnaceNotification = () => {
                if(IdlePixelPlus.getVarOrDefault("stone_furnace_crafted", 0, "int") == 1) {
                    var furnaceOreType = IdlePixelPlus.getVarOrDefault("furnace_ore_type", "none", "string");
                    var dragFur = IdlePixelPlus.getVarOrDefault("dragon_furnace", 0, "int");
                    var ancFur = IdlePixelPlus.getVarOrDefault("ancient_furnace_crafted", 0, "int");
                    var titFur = IdlePixelPlus.getVarOrDefault("titanium_furnace_crafted", 0, "int");
                    var promFur = IdlePixelPlus.getVarOrDefault("promethium_furnace_crafted", 0, "int");
                    var goldFur = IdlePixelPlus.getVarOrDefault("gold_furnace_crafted", 0, "int");
                    var silvFur = IdlePixelPlus.getVarOrDefault("silver_furnace_crafted", 0, "int");
                    var ironFur = IdlePixelPlus.getVarOrDefault("iron_furnace_crafted", 0, "int");
                    var bronzeFur = IdlePixelPlus.getVarOrDefault("bronze_furnace_crafted", 0, "int");
                    var stoneFur = IdlePixelPlus.getVarOrDefault("stone_furnace_crafted", 0, "int");
                    var furnImg;
 
                    if(dragFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/dragon_furnace.png";
                    } else if(ancFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/ancient_furnace.png";
                    } else if(titFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/titanium_furnace.png";
                    } else if(promFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/promethium_furnace.png";
                    } else if(goldFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/gold_furnace.png";
                    } else if(silvFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/silver_furnace.png";
                    } else if(ironFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/iron_furnace.png";
                    } else if(bronzeFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/bronze_furnace.png";
                    }  else if(stoneFur == 1) {
                        furnImg = "https://d1xsc8x7nc5q8t.cloudfront.net/images/stone_furnace.png";
                    } else {
                        document.querySelector('#notification-furnace_avail').style.display = 'none';
                    }
 
                    const notifDiv = document.createElement('div');
                    notifDiv.id = `notification-furnace_avail`;
                    notifDiv.onclick = function () {
                        websocket.send(switch_panels('panel-crafting'));
                    }
                    notifDiv.className='notification hover';
                    notifDiv.style='margin-right: 4px; margin-bottom: 4px; display: none';
                    notifDiv.style.display = "inline-block";
 
                    var elem = document.createElement("img");
                    elem.setAttribute("src", furnImg);
                    const notifIcon = elem;
                    notifIcon.className = "w20";
 
                    const notifDivLabel = document.createElement('span');
                    notifDivLabel.id = `notification-furnace_avail-label`;
                    notifDivLabel.innerText = ' Furnace Empty';
                    notifDivLabel.className = 'color-white'
 
                    notifDiv.append(notifIcon, notifDivLabel)
                    document.querySelector('#notifications-area').prepend(notifDiv)
                    var furnaceNotif = this.getConfig("furnaceEmptyNotification");
                    if(furnaceOreType != "none" || !furnaceNotif) {
                        document.querySelector('#notification-furnace_avail').style.display = 'none';
                    }
                }
            }
 
            const addRobotNotifications = () => {
                var robotTimerCheck = IdlePixelPlus.getVarOrDefault("robot_wave_timer", 0, "int");
                var robotUnlocked = IdlePixelPlus.getVarOrDefault("robot_crafted", 0, "int");
                const notifDiv = document.createElement('div');
                notifDiv.id = `notification-robot_avail`;
                notifDiv.onclick = function () {
                    websocket.send(Modals.open_robot_waves());
                }
                notifDiv.className='notification hover';
                notifDiv.style='margin-right: 4px; margin-bottom: 4px; display: none';
                notifDiv.style.display = "inline-block";
 
                var elem = document.createElement("img");
                elem.setAttribute("src", "https://d1xsc8x7nc5q8t.cloudfront.net/images/robot.png");
                const notifIcon = elem;
                notifIcon.className = "w20";
 
                const notifDivLabel = document.createElement('span');
                notifDivLabel.id = `notification-robot_avail-label`;
                notifDivLabel.innerText = ' Waves Ready';
                notifDivLabel.className = 'color-white'
 
                notifDiv.append(notifIcon, notifDivLabel)
                document.querySelector('#notifications-area').prepend(notifDiv)
                if(robotTimerCheck > 0 || robotUnlocked == 0) {
                    document.querySelector('#notification-robot_avail').style.display = 'none';
                }
            }
 
            const robotTimer = () => {
                let robotNotification = false;
                var robotUnlocked = IdlePixelPlus.getVarOrDefault("robot_crafted", 0, "int");
                var thisScript = "";
                if(robotUnlocked == 1) {
                    let robotTiming = IdlePixelPlus.getVarOrDefault("robot_wave_timer", 0, "int");
                    let etaTimerRobot = format_time(robotTiming);
                    const runRobotTimer = setInterval(function() {
                        robotNotification =  IdlePixelPlus.plugins['ui-tweaks'].getConfig("robotReady");
                        robotTiming = IdlePixelPlus.getVarOrDefault("robot_wave_timer", 0, "int");
                        etaTimerRobot = format_time(robotTiming);
                        const robotLabel = document.querySelector('#notification-robot_avail-label')
                        if(robotTiming == 0 && robotNotification) {
                            //console.log(robotNotification);
                            robotLabel.innerText = ` Waves Ready`;
                            document.querySelector("#notification-robot_avail").style.display = 'inline-block';
                        }
                        else {
                            document.querySelector("#notification-robot_avail").style.display = 'none';
                        }
                    }, 1000);
 
                    addRobotNotifications(etaTimerRobot);
                }
            }
 
            brewingTimer();
            merchantTimer();
            robotTimer();
            addFurnaceNotification();
 
            const lootPotAvail = document.querySelector("#notification-loot_pot_avail");
            if (loot_pot == 0) {
                lootPotAvail.style.display = "none";
            } else {
                lootPotAvail.style.display = "inline-block";
            }
 
            const merchantAvail = document.querySelector("#notification-merchant_avail");
            if(merchantAvail) {
                if (merchantTiming > 0 || merchantUnlocked == 0) {
                    merchantAvail.style.display = "none";
                } else {
                    merchantAvail.style.display = "inline-block";
                }
            }
 
            const robotAvail = document.querySelector("#notification-robot_avail");
            if(robotAvail) {
                if (robotTiming > 0 || robotUnlocked == 0) {
                    robotAvail.style.display = "none";
                } else {
                    robotAvail.style.display = "inline-block";
                }
            }
 
 
            const addPurpleKeyNotifications = () => {
                var purpleKeyUnlocked = IdlePixelPlus.getVarOrDefault("guardian_purple_key_hint", 0, "int");
                const notifDiv = document.createElement('div');
                notifDiv.id = `notification-purple_key`;
                notifDiv.onclick = function () {
                    websocket.send('CASTLE_MISC=guardian_purple_key_hint');
                }
                notifDiv.className='notification hover';
                notifDiv.style='margin-right: 4px; margin-bottom: 4px; display: none';
                notifDiv.style.display = "inline-block";
 
                var elem = document.createElement("img");
                elem.setAttribute("src", "");
                const notifIcon = elem;
                notifIcon.className = "w20";
                notifIcon.id = `notification-purple_key-image`;
                notifIcon.innerText = '';
 
                const notifDivImgText = document.createElement('span');
                notifDivImgText.id = `notification-purple_key-image-text`;
                notifDivImgText.innerText = '';
                notifDivImgText.className = 'color-white'
 
                const notifDivRarity = document.createElement('span');
                notifDivRarity.id = `notification-purple_key-rarity`;
                notifDivRarity.innerText = 'Purple Key Info Loading';
                notifDivRarity.className = 'color-white'
 
                const notifDivTime = document.createElement('span');
                notifDivTime.id = `notification-purple_key-time`;
                notifDivTime.innerText = '';
                notifDivTime.className = 'color-white'
 
                notifDiv.append(notifIcon, notifDivImgText, notifDivRarity, notifDivTime)
                document.querySelector('#notifications-area').prepend(notifDiv)
                if(purpleKeyUnlocked == 0) {
                    document.querySelector('#notification-purple_key').style.display = 'none';
                } else {
                    document.querySelector('#notification-purple_key').style.display = 'inline-block';
                }
            };
 
            addPurpleKeyNotifications();
 
            onPurpleKey();
 
            this.purpleKeyLoop();
 
            this.miningMachTimer();
            // fix chat
            purpleKeyGo = this.getConfig("showPurpleKeyNotification");
 
            this.onConfigsChanged();
 
            const style = document.createElement('style');
            style.id = 'styles-ui-tweaks';
            style.textContent = `
            <style id="styles-ui-tweaks">
            #chat-top {
              display: flex;
              flex-direction: row;
              justify-content: left;
            }
            #chat-top > button {
              margin-left: 2px;
              margin-right: 2px;
              white-space: nowrap;
            }
            #content.side-chat {
              display: grid;
              column-gap: 0;
              row-gap: 0;
              grid-template-columns: 2fr minmax(300px, 1fr);
              grid-template-rows: 1fr;
            }
            #content.side-chat #game-chat {
              max-height: calc(100vh - 32px);
            }
            #content.side-chat #game-chat > :first-child {
              display: grid;
              column-gap: 0;
              row-gap: 0;
              grid-template-columns: 1fr;
              grid-template-rows: auto 1fr auto;
              height: calc(100% - 16px);
            }
            #content.side-chat #chat-area {
              height: auto !important;
            }
    	    .farming-patches-area.condensed {
	    	  display: flex;
		      flex-direction: row;
    		  justify-items: flex-start;
    		  width: fit-content;
    	    }
    	    .farming-patches-area.condensed > span {
    		  width: 100px;
    		  max-height: 200px;
    		  border: 1px solid green;
    	    }
    	    .farming-patches-area.condensed img {
    		  width: 100px;
    	    }
	    	#panel-gathering .gathering-box.condensed {
		      height: 240px;
		      position: relative;
              margin: 4px auto;
              padding-left: 4px;
              padding-right: 4px;
		    }
		    #panel-gathering .gathering-box.condensed img.gathering-area-image {
		      position: absolute;
		      top: 10px;
		      left: 10px;
		      width: 68px;
		      height: 68px;
		    }
		    #panel-gathering .gathering-box.condensed br:nth-child(2),
		    #panel-gathering .gathering-box.condensed br:nth-child(3)
		    {
		      display: none;
		    }
            #panel-mining.add-arrow-controls itembox {
              position: relative;
            }
            #panel-mining:not(.add-arrow-controls) itembox .arrow-controls {
              display: none !important;
            }
            itembox .arrow-controls {
              position: absolute;
              top: 0px;
              right: 2px;
              height: 100%;
              padding: 2px;
              display: flex;
              flex-direction: column;
              justify-content: space-around;
              align-items: center;
            }
            itembox .arrow {
              border: solid white;
              border-width: 0 4px 4px 0;
              display: inline-block;
              padding: 6px;
              cursor: pointer;
              opacity: 0.85;
            }
            itembox .arrow:hover {
              opacity: 1;
              border-color: yellow;
            }
            itembox .arrow.up {
              transform: rotate(-135deg);
              -webkit-transform: rotate(-135deg);
              margin-top: 3px;
            }
            itembox .arrow.down {
              transform: rotate(45deg);
              -webkit-transform: rotate(45deg);
              margin-bottom: 3px;
            }
            </style>
            `;
 
            document.head.appendChild(style);
 
            //Left menu energy info
            const menuBarEnergy = document.getElementById('menu-bar-energy');
            const menuBarFightPoints = document.createElement('span');
            menuBarFightPoints.id = 'menu-bar-fight-points'
            menuBarFightPoints.innerHTML = `
  <img id="menu-bar-fight-points-img" class="img-20" src="${IMAGE_URL_BASE}/fight_points.png">
  <item-display data-format="number" data-key="fight_points">0</item-display>
  (<span class="fight-points-full-timmer" id="fight-points-full-id-menu"></span>)
`;
            menuBarEnergy.parentNode.insertBefore(menuBarFightPoints, menuBarEnergy.nextSibling);
 
            const menuBarCrystals = document.getElementById('menu-bar-crystals');
 
            // "Moon & Sun Distance Info
            const rocketInfoSideCar = document.createElement('div');
            rocketInfoSideCar.id = 'rocket-info-side_car'
            rocketInfoSideCar.innerHTML = `
  <hr>
  <span id="rocket-info-label">MOON & SUN DISTANCE</span>
  <br/>
  <style type="text/css">
    .span2 {
      display: inline-block;
      text-align: right;
      width: 100px;
    }
  </style>
  <span onClick="websocket.send(Modals.clicks_rocket())" id="menu-bar-rocket_moon">
    <img id="moon-img" class="img-20" src="https://idle-pixel.wiki/images/4/47/Moon.png">
    <span class="span2 rocket-dist_moon">0</span>
    <span style='margin-left:0.75em;' class="rocket-dist_moon-symbol">🔴</span>
    <img id="moon-rocket-img" class="img-20" src="${IMAGE_URL_BASE}/rocket.png">
    <img id="moon-mega-rocket-img" class="img-20" src="${IMAGE_URL_BASE}/mega_rocket.gif">
    <span class="moon-landed">LANDED</span>
    <br/>
  </span>
  <span onClick="websocket.send(Modals.clicks_rocket())" id="menu-bar-rocket_sun">
    <img id "sun-img" class="img-20" src="https://idle-pixel.wiki/images/6/61/Sun.png">
    <span class="span2 rocket-dist_sun">0</span>
    <span style='margin-left:0.75em;' class="rocket-dist_sun-symbol">🔴</span>
    <img id="sun-rocket-img" class="img-20" src="${IMAGE_URL_BASE}/mega_rocket.gif">
    <span class="sun-landed">LANDED</span>
    <br/>
  </span>
</div>
`;
 
            menuBarCrystals.parentNode.insertBefore(rocketInfoSideCar, menuBarCrystals.nextSibling);
 
 
            // "Current Rocket Info" side car
            const rocketInfoSideCarElement = document.getElementById('rocket-info-side_car');
 
            // Append HTML after #rocket-info-side_car
            const currentRocketInfo = document.createElement('div');
            currentRocketInfo.id = 'current-rocket-info'
            currentRocketInfo.innerHTML = `
  <hr>
  <span id="current-rocket-info-label">CURRENT ROCKET INFO</span>
  <br/>
  <div id="rocket-travel-info">
    <img id="rocket-current-travel-location-moon" class="img-20" src="https://idle-pixel.wiki/images/4/47/Moon.png">
    <img id="rocket-current-travel-location-sun" class="img-20" src="https://idle-pixel.wiki/images/6/61/Sun.png">
    <span id="current-rocket-travel-distances">Loading...</span>
    <br/>
    <img id="rocket-type-img-mega" class="img-20" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/mega_rocket.gif">
    <img id="rocket-type-img-reg" class="img-20" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rocket.gif">
    <span id="current-rocket-travel-times">00:00:00</span>
    <br/>
  </div>
  <div onClick="switch_panels('panel-crafting')" id="current-rocket-fuel-info">
    <img id="rocket-rocket_fuel-img" class="img-20" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rocket_fuel.png">
    <span>Rocket Fuel - </span>
    <span id="rocket-fuel-count">0</span>
    <br/>
  </div>
  <div onClick="switch_panels('panel-brewing')" id="current-rocket-pot-info">
    <img id="rocket-rocket_potion-img" class="img-20" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/rocket_potion.png">
    <span>Rocket Potion </span>
    (<span id="rocket-pot-count">0</span>)
    <span> - </span>
    <span id=rocket-pot-timer>0:00:00</span>
  </div>
</div>
`;
            rocketInfoSideCarElement.parentNode.insertBefore(currentRocketInfo, rocketInfoSideCarElement.nextSibling);
 
            const elementsToHide = [
                'moon-mega-rocket-img',
                'sun-rocket-img',
                'moon-rocket-img',
                'menu-bar-rocket_moon .moon-landed',
                'menu-bar-rocket_sun .sun-landed'
            ];
 
            elementsToHide.forEach((elementId) => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.style.display = 'none';
                }
            });
 
            const currentRocketInfoElement = document.getElementById('current-rocket-info');
            if (currentRocketInfoElement) {
                currentRocketInfoElement.style.display = 'none';
            }
 
            // SD Watch Left Side
 
            const sdWatchElement = document.createElement('span');
            sdWatchElement.innerHTML = `
  <span onClick="websocket.send(Modals.clicks_stardust_watch())" id="menu-bar-sd_watch">
    <img id="sd-watch-img" class="img-20" src="${IMAGE_URL_BASE}/stardust_watch.png">
    <span class="sd-watch-text">Watch Charges</span>
    (<span class="sd-watch-charges">0</span>)
  </span>
`;
 
            menuBarFightPoints.parentNode.insertBefore(sdWatchElement, menuBarFightPoints.nextSibling);
 
 
            // Left Menu Heat
            const menuBarHeat = document.createElement('span');
            menuBarHeat.id = 'menu-bar-heat';
            menuBarHeat.innerHTML = `<img id="sd-heat-img" class="img-20" src="${IMAGE_URL_BASE}/heat.png"><span class="sd-heat-level">0</span>`;
            menuBarHeat.addEventListener('click', function () {
                websocket.send(Modals.clicks_oven());
            });
 
            // Left Menu Energy
            menuBarFightPoints.parentNode.insertBefore(menuBarHeat, menuBarFightPoints);
            menuBarFightPoints.insertAdjacentHTML('beforebegin', '<br/>');
 
            const energyItemDisplay = document.querySelector('#menu-bar-hero item-display[data-key="energy"]');
 
            const menuBarFightPointsCombat = document.createElement('span');
            menuBarFightPointsCombat.id = 'menu-bar-fight-fight-points'
            menuBarFightPointsCombat.innerHTML = `<img id="menu-bar-fight-points-img" class="img-20" src="${IMAGE_URL_BASE}/fight_points.png"><item-display data-format="number" data-key="fight_points"> 0</item-display>(<span class="fight-points-full-timmer" id="fight-points-full-id-combat"></span>)`;
 
            energyItemDisplay.parentElement.insertBefore(menuBarFightPointsCombat, energyItemDisplay.nextSibling);
 
            // Find all item-display elements
            const itemDisplayElements = document.querySelectorAll('item-display');
 
            // Loop through the elements and filter based on text content
            itemDisplayElements.forEach(el => {
                const dataKey = el.getAttribute('data-key');
                if (dataKey && dataKey.endsWith('_xp')) {
                    const parent = el.parentElement;
                    const uiTweaksXpNext = document.createElement('span');
                    uiTweaksXpNext.className = 'ui-tweaks-xp-next';
                    uiTweaksXpNext.innerHTML = '&nbsp;&nbsp;Next Level: ';
                    const itemDisplayNext = document.createElement('item-display');
                    itemDisplayNext.setAttribute('data-format', 'number');
                    itemDisplayNext.setAttribute('data-key', `ipp_${dataKey}_next`);
                    uiTweaksXpNext.appendChild(itemDisplayNext);
                    parent.appendChild(uiTweaksXpNext);
                }
            });
 
            // machine arrows
            const machineryList = ["drill", "crusher", "giant_drill", "excavator", "giant_excavator", "massive_excavator"];
 
            machineryList.forEach(machine => {
                const itemBox = document.querySelector(`itembox[data-item=${machine}]`);
                if (itemBox) {
                    const arrowControlsDiv = document.createElement('div');
                    arrowControlsDiv.className = 'arrow-controls';
                    arrowControlsDiv.onclick = function(event) {
                        event.stopPropagation();
                    };
 
                    const arrowUpDiv = document.createElement('div');
                    arrowUpDiv.className = 'arrow up';
                    arrowUpDiv.onclick = function(event) {
                        event.stopPropagation();
                        IdlePixelPlus.sendMessage(`MACHINERY=${machine}~increase`);
                    };
 
                    const itemDisplay = document.createElement('item-display');
                    itemDisplay.setAttribute('data-format', 'number');
                    itemDisplay.setAttribute('data-key', `${machine}_on`);
                    itemDisplay.innerHTML = '1';
 
                    const arrowDownDiv = document.createElement('div');
                    arrowDownDiv.className = 'arrow down';
                    arrowDownDiv.onclick = function(event) {
                        event.stopPropagation();
                        IdlePixelPlus.sendMessage(`MACHINERY=${machine}~decrease`);
                    };
 
                    arrowControlsDiv.appendChild(arrowUpDiv);
                    arrowControlsDiv.appendChild(itemDisplay);
                    arrowControlsDiv.appendChild(arrowDownDiv);
 
                    itemBox.appendChild(arrowControlsDiv);
                }
            });
 
            // custom notifications
            const notificationsArea = document.getElementById('notifications-area');
 
            if (notificationsArea) {
                const notificationOilFull = document.createElement('div');
                notificationOilFull.id = 'ui-tweaks-notification-oil-full';
                notificationOilFull.style.display = 'none';
                notificationOilFull.classList.add('notification', 'hover');
                notificationOilFull.onclick = function() {
                    switch_panels('panel-mining');
                };
 
                notificationOilFull.innerHTML = `
        <img src="${IMAGE_URL_BASE}/oil.png" class="w20">
        <span class="font-small color-yellow">Oil Full</span>
    `;
 
                notificationsArea.appendChild(notificationOilFull);
            }
 
            const panelMining = document.querySelector('#panel-mining .progress-bar');
            const panelCrafting = document.querySelector('#panel-crafting .progress-bar');
 
            if (panelMining) {
                const oilSummaryMining = document.createElement('div');
                oilSummaryMining.id = 'oil-summary-mining';
                oilSummaryMining.style.marginTop = '0.5em';
 
                const oilLabel = document.createElement('strong');
                oilLabel.textContent = 'Oil: ';
 
                const oilDisplay = document.createElement('item-display');
                oilDisplay.setAttribute('data-format', 'number');
                oilDisplay.setAttribute('data-key', 'oil');
 
                const maxOilDisplay = document.createElement('item-display');
                maxOilDisplay.setAttribute('data-format', 'number');
                maxOilDisplay.setAttribute('data-key', 'max_oil');
 
                const inLabel = document.createElement('strong');
                inLabel.textContent = 'In: ';
 
                const inDisplay = document.createElement('item-display');
                inDisplay.setAttribute('data-format', 'number');
                inDisplay.setAttribute('data-key', 'oil_in');
 
                const outLabel = document.createElement('strong');
                outLabel.textContent = 'Out: ';
 
                const outDisplay = document.createElement('item-display');
                outDisplay.setAttribute('data-format', 'number');
                outDisplay.setAttribute('data-key', 'oil_out');
 
                const deltaLabel = document.createElement('strong');
                deltaLabel.textContent = 'Delta: ';
 
                const deltaDisplay = document.createElement('item-display');
                deltaDisplay.setAttribute('data-format', 'number');
                deltaDisplay.setAttribute('data-key', 'oil_delta');
 
                oilSummaryMining.appendChild(oilLabel);
                oilSummaryMining.appendChild(oilDisplay);
                oilSummaryMining.appendChild(document.createTextNode(' / '));
                oilSummaryMining.appendChild(maxOilDisplay);
                oilSummaryMining.appendChild(document.createElement('br'));
                oilSummaryMining.appendChild(inLabel);
                oilSummaryMining.appendChild(document.createTextNode('+'));
                oilSummaryMining.appendChild(inDisplay);
                oilSummaryMining.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
                oilSummaryMining.appendChild(outLabel);
                oilSummaryMining.appendChild(document.createTextNode('-'));
                oilSummaryMining.appendChild(outDisplay);
                oilSummaryMining.appendChild(document.createElement('br'));
                oilSummaryMining.appendChild(deltaLabel);
                oilSummaryMining.appendChild(deltaDisplay);
 
                panelMining.parentNode.insertBefore(oilSummaryMining, panelMining.nextSibling);
            }
 
            if (panelCrafting) {
                const oilSummaryCrafting = document.createElement('div');
                oilSummaryCrafting.id = 'oil-summary-crafting';
                oilSummaryCrafting.style.marginTop = '0.5em';
 
                const oilLabel = document.createElement('strong');
                oilLabel.textContent = 'Oil: ';
 
                const oilDisplay = document.createElement('item-display');
                oilDisplay.setAttribute('data-format', 'number');
                oilDisplay.setAttribute('data-key', 'oil');
 
                const maxOilDisplay = document.createElement('item-display');
                maxOilDisplay.setAttribute('data-format', 'number');
                maxOilDisplay.setAttribute('data-key', 'max_oil');
 
                const inLabel = document.createElement('strong');
                inLabel.textContent = 'In: ';
 
                const inDisplay = document.createElement('item-display');
                inDisplay.setAttribute('data-format', 'number');
                inDisplay.setAttribute('data-key', 'oil_in');
 
                const outLabel = document.createElement('strong');
                outLabel.textContent = 'Out: ';
 
                const outDisplay = document.createElement('item-display');
                outDisplay.setAttribute('data-format', 'number');
                outDisplay.setAttribute('data-key', 'oil_out');
 
                const deltaLabel = document.createElement('strong');
                deltaLabel.textContent = 'Delta: ';
 
                const deltaDisplay = document.createElement('item-display');
                deltaDisplay.setAttribute('data-format', 'number');
                deltaDisplay.setAttribute('data-key', 'oil_delta');
 
                oilSummaryCrafting.appendChild(oilLabel);
                oilSummaryCrafting.appendChild(oilDisplay);
                oilSummaryCrafting.appendChild(document.createTextNode(' / '));
                oilSummaryCrafting.appendChild(maxOilDisplay);
                oilSummaryCrafting.appendChild(document.createElement('br'));
                oilSummaryCrafting.appendChild(inLabel);
                oilSummaryCrafting.appendChild(document.createTextNode('+'));
                oilSummaryCrafting.appendChild(inDisplay);
                oilSummaryCrafting.appendChild(document.createTextNode('\u00A0\u00A0\u00A0'));
                oilSummaryCrafting.appendChild(outLabel);
                oilSummaryCrafting.appendChild(document.createTextNode('-'));
                oilSummaryCrafting.appendChild(outDisplay);
                oilSummaryCrafting.appendChild(document.createElement('br'));
                oilSummaryCrafting.appendChild(deltaLabel);
                oilSummaryCrafting.appendChild(deltaDisplay);
 
                panelCrafting.parentNode.insertBefore(oilSummaryCrafting, panelCrafting.nextSibling);
            }
 
            document.querySelector("#notification-furnace-label").insertAdjacentHTML('afterend', '<span id="notification-furnace-timer" class="font-small color-white"></span>');
            document.querySelector("#notification-rocket-label").insertAdjacentHTML('afterend', '<span id="notification-rocket-timer" class="font-small color-white"></span>');
            document.querySelector("#notification-mega_rocket-label").insertAdjacentHTML('afterend', '<span id="notification-mega_rocket-timer" class="font-small color-white"></span>');
 
            const fishingNetItembox = document.querySelector('itembox[data-item="fishing_net"]');
            if (fishingNetItembox) {
                const heatFishingTab = document.createElement('itembox');
                heatFishingTab.id = 'heat-fishing-tab';
                heatFishingTab.dataset.item = 'heat';
                heatFishingTab.classList.add('shadow', 'hover');
                heatFishingTab.setAttribute('data-bs-toggle', 'tooltip');
 
                heatFishingTab.innerHTML = `
        <div class="center mt-1">
            <img src="https://d1xsc8x7nc5q8t.cloudfront.net/images/heat.png" width="50px" height="50px">
        </div>
        <div class="center mt-2">
            <item-display data-format="number" data-key="heat"></item-display>
        </div>
    `;
 
                fishingNetItembox.before(heatFishingTab);
            }
 
            // clear chat button
            var chatAutoScrollButton = document.getElementById("chat-auto-scroll-button");
            var chatClearButton = document.createElement("button");
            chatClearButton.id = "chat-clear-button";
            chatClearButton.textContent = "CLEAR";
            chatClearButton.style.color = "green";
            chatClearButton.onclick = function() {
                IdlePixelPlus.plugins['ui-tweaks'].clearChat();
            };
 
            chatAutoScrollButton.insertAdjacentElement('afterend', chatClearButton);
 
            // reorganize chat location
            const self = this;
            const chat = document.querySelector("#game-chat > :first-child");
            const chatTop = document.createElement('div');
            chatTop.id = "chat-top";
            const chatArea = document.querySelector("#chat-area");
            const chatBottom = document.querySelector("#game-chat > :first-child > :last-child");
 
            while (chat.firstChild) {
                chatTop.appendChild(chat.firstChild);
            }
 
            chat.appendChild(chatTop);
            chat.appendChild(chatArea);
            chat.appendChild(chatBottom);
 
            // override for service messages
            const original_yell_to_chat_box = Chat.yell_to_chat_box;
            Chat.yell_to_chat_box = function() {
                original_yell_to_chat_box.apply(Chat, arguments);
                self.updateColors();
            }
 
            var currentFP = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int").toLocaleString();
            var rarePotTimer = IdlePixelPlus.getVarOrDefault("rare_monster_potion_timer", 0, "int");
            var rarePotPlusTimer = IdlePixelPlus.getVarOrDefault("super_rare_monster_potion_timer", 0, "int");
            var rarePotInfo = "";
 
            if (rarePotTimer > 0) {
                rarePotInfo = rarePotTimer;
            } else if (rarePotPlusTimer > 0) {
                rarePotInfo = rarePotPlusTimer;
            } else {
                rarePotInfo = "Inactive";
            }
 
            var combatLootPotActive = IdlePixelPlus.getVarOrDefault("combat_loot_potion_active", 0, "int");
            var combatLootPotTimer = IdlePixelPlus.getVarOrDefault("combat_loot_potion_timer", 0, "int");
            var combatLootPotInfo = "";
 
            if (combatLootPotActive == 1) {
                combatLootPotInfo = "Active";
            } else {
                combatLootPotInfo = "Inactive";
            }
 
            function createCombatStatEntry(id, imgSrc, imgTitle, text, value) {
                const entry = document.createElement("div");
                entry.className = "td-combat-stat-entry";
                entry.id = id;
 
                let content;
 
                if(id == "combat-info-loot_pot-right" || id == "combat-info-loot_pot-left" ) {
                    content = `
                <br>
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-lp">${value}</span>
    `;
                } else if (id == "combat-info-fight_point-right" || id == "combat-info-fight_point-left") {
                    content = `
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-fp">${value}</span>
    `;
                } else {
                    content = `
        <img class="img-15" src="${imgSrc}" title="${imgTitle}">
        <span style="color:white">${text}:</span>
        <span id="${id}-rp">${value}</span>
    `;
                }
 
 
                entry.innerHTML = content;
                return entry;
            }
 
            function insertAfter(newNode, referenceNode) {
                referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            }
 
            var lastChildInPanel = document.querySelector("#panel-combat-canvas > center > table > tbody > tr:nth-child(2) > td.fight-left-border > div.td-combat-bottom-panel.shadow > div:last-child");
            insertAfter(createCombatStatEntry("combat-info-fight_point-right", "https://d1xsc8x7nc5q8t.cloudfront.net/images/fight_points.png", "fight_points_white-right", "FP", currentFP), lastChildInPanel);
            insertAfter(createCombatStatEntry("combat-info-rare_pot-right", "https://d1xsc8x7nc5q8t.cloudfront.net/images/rare_monster_potion.png", "rare_potion_white-right", "Rare Pot", rarePotInfo), lastChildInPanel);
            insertAfter(createCombatStatEntry("combat-info-loot_pot-right", "https://d1xsc8x7nc5q8t.cloudfront.net/images/combat_loot_potion.png", "combat_loot_potion_white-right", "Loot Pot", combatLootPotInfo), lastChildInPanel);
 
            var idleHeroArrowsArea = document.querySelector("#menu-bar-idle-hero-arrows-area-2");
            insertAfter(createCombatStatEntry("combat-info-fight_point-left", "https://d1xsc8x7nc5q8t.cloudfront.net/images/fight_points.png", "fight_points_white-left", "FP", currentFP), idleHeroArrowsArea);
            insertAfter(createCombatStatEntry("combat-info-rare_pot-left", "https://d1xsc8x7nc5q8t.cloudfront.net/images/rare_monster_potion.png", "rare_potion_white-left", "Rare Pot", rarePotInfo), idleHeroArrowsArea);
            insertAfter(createCombatStatEntry("combat-info-loot_pot-left", "https://d1xsc8x7nc5q8t.cloudfront.net/images/combat_loot_potion.png", "combat_loot_potion_white-left", "Loot Pot", combatLootPotInfo), idleHeroArrowsArea);
 
            // Fishing Energy/Heat Info
            const panelFishing = document.querySelector("#panel-fishing");
            const progressBar = panelFishing.querySelector(".progress-bar");
 
            const hrElement = document.createElement("hr");
            progressBar.insertAdjacentElement('afterend', hrElement);
 
            const containerDiv = document.createElement("div");
            containerDiv.style.display = "flex";
            containerDiv.style.flexDirection = "column";
 
            const h5Element = document.createElement("h5");
            h5Element.textContent = "Fish Energy";
 
            const buttonElement = document.createElement("button");
            buttonElement.textContent = "Show";
            buttonElement.id = "fish_energy-visibility-button";
            buttonElement.addEventListener("click", show_hide);
            h5Element.appendChild(buttonElement);
 
            const innerDiv = document.createElement("div");
            innerDiv.id = "fishing-calculator-div";
 
            const rawFishEnergySpan = document.createElement("span");
            rawFishEnergySpan.textContent = "Total Raw Fish Energy: ";
 
            const rawFishEnergyNumberSpan = document.createElement("span");
            rawFishEnergyNumberSpan.textContent = "0";
            rawFishEnergyNumberSpan.id = "raw-fish-energy-number";
            rawFishEnergySpan.appendChild(rawFishEnergyNumberSpan);
 
            const br1Element = document.createElement("br");
 
            const heatToCookAllSpan = document.createElement("span");
            heatToCookAllSpan.textContent = "Heat To Cook All: ";
 
            const fishHeatRequiredNumberSpan = document.createElement("span");
            fishHeatRequiredNumberSpan.textContent = "0";
            fishHeatRequiredNumberSpan.id = "fish-heat-required-number";
            heatToCookAllSpan.appendChild(fishHeatRequiredNumberSpan);
 
            const br2Element = document.createElement("br");
 
            const totalCookedFishEnergySpan = document.createElement("span");
            totalCookedFishEnergySpan.textContent = "Total Cooked Fish Energy: ";
 
            const cookedFishEnergyNumberSpan = document.createElement("span");
            cookedFishEnergyNumberSpan.textContent = "0";
            cookedFishEnergyNumberSpan.id = "cooked-fish-energy-number";
            totalCookedFishEnergySpan.appendChild(cookedFishEnergyNumberSpan);
 
            innerDiv.appendChild(rawFishEnergySpan);
            innerDiv.appendChild(br1Element);
            innerDiv.appendChild(heatToCookAllSpan);
            innerDiv.appendChild(br2Element);
            innerDiv.appendChild(totalCookedFishEnergySpan);
 
            containerDiv.appendChild(h5Element);
            containerDiv.appendChild(innerDiv);
 
            hrElement.insertAdjacentElement('afterend', containerDiv);
 
            function show_hide() {
                const button = document.querySelector("#fish_energy-visibility-button");
                const div = document.querySelector("#fishing-calculator-div");
 
                if (button.textContent === "Hide") {
                    div.style.display = "none";
                    button.textContent = "Show";
                } else {
                    div.style.display = "block";
                    button.textContent = "Hide";
                }
            }
            this.calcFishEnergy();
            document.querySelector("#fishing-calculator-div").style.display = "none";
 
            this.oilTimerNotification();
            setTimeout(function() {
                onLoginLoaded = true;
                const rocket_fuel = IdlePixelPlus.getVarOrDefault("rocket_fuel", 0, "int");
                const rocket_pot_count = IdlePixelPlus.getVarOrDefault("rocket_potion", 0, "int");
                document.querySelector("#rocket-fuel-count").textContent = rocket_fuel;
                document.querySelector("#rocket-pot-count").textContent = rocket_pot_count;
                IdlePixelPlus.plugins['ui-tweaks'].onConfigsChanged();
            }, 20);
        }
        //////////////////////////////// onLogin End ////////////////////////////////
 
 
 
 
        clearChat() {
            const chatArea = document.getElementById('chat-area');
            while (chatArea.firstChild) {
                chatArea.removeChild(chatArea.firstChild);
            }
        }
 
        limitChat() {
            const chatArea = document.getElementById('chat-area');
            const chatLength = chatArea.innerHTML.length;
            const limit = this.getConfig("chatLimit");
 
            if (limit > 0 || chatLength > 190000) {
                const children = chatArea.children;
 
                if (limit > 0) {
                    if (children.length > limit) {
                        const toDelete = children.length - limit;
 
                        for (let i = 0; i < toDelete; i++) {
                            try {
                                chatArea.removeChild(children[i]);
                            } catch (err) {
                                console.error("Error cleaning up chat", err);
                            }
                        }
 
                        if (Chat._auto_scroll) {
                            chatArea.scrollTop = chatArea.scrollHeight;
                        }
                    }
                }
 
                if (chatLength > 190000) {
                    for (let i = 0; i < 3; i++) {
                        try {
                            chatArea.removeChild(children[i]);
                        } catch (err) {
                            console.error("Error cleaning up chat", err);
                        }
                    }
                }
            }
        }
 
 
        onPanelChanged(panelBefore, panelAfter) {
            this.updateTableCraftLabels();
            this.hideOrbsAndRing();
 
            if (panelBefore !== panelAfter && panelAfter === "idlepixelplus") {
                const options = document.querySelectorAll("#idlepixelplus-config-ui-tweaks-font option");
                if (options) {
                    options.forEach(function (el) {
                        const value = el.getAttribute("value");
                        if (value === "IdlePixel Default") {
                            el.style.fontFamily = FONT_FAMILY_DEFAULT;
                        } else {
                            el.style.fontFamily = value;
                        }
                    });
                }
            }
 
            if (["farming", "woodcutting", "combat"].includes(panelAfter) && this.getConfig("imageTitles")) {
                const images = document.querySelectorAll(`#panel-${panelAfter} img`);
                if (images) {
                    images.forEach(function (el) {
                        let src = el.getAttribute("src");
                        if (src && src !== "x") {
                            src = src.replace(/.*\//, "").replace(/\.\w+$/, "");
                            el.setAttribute("title", src);
                        }
                    });
                }
            }
 
            if (Globals.currentPanel === "panel-fishing") {
                this.calcFishEnergy();
            }
        }
 
 
        //////////////////////////////// onVariableSet Start ////////////////////////////////
        onVariableSet(key, valueBefore, valueAfter) {
            if(onLoginLoaded) {
                //console.log(new Date() + " " + document.readyState);
                if (Globals.currentPanel != "panel-combat-canvas") {
                    if(key.endsWith("_on")) {
                        setTimeout(function() {
                            IdlePixelPlus.plugins['ui-tweaks'].miningMachTimer();
                        }, 100);
                    }
 
                    if(Globals.currentPanel == "panel-brewing") {
                        this.updateTableCraftLabels();
                    }
 
                    if(key == "oil") {
                        this.oilGain();
                    }
 
                    if(key.endsWith("_xp")) {
                        const varName = `var_ipp_${key}_next`;
                        const xp = parseInt(valueAfter||'0');
                        const level = xpToLevel(xp);
                        const xpAtNext = LEVELS[level+1];
                        const next = level>=100 ? 0 : xpAtNext-xp;
                        window[varName] = `${next}`;
                    }
 
                    if(["oil", "max_oil"].includes(key)) {
                        const oil = IdlePixelPlus.getVar("oil");
                        const maxOil = IdlePixelPlus.getVar("max_oil");
                        if(oil && oil==maxOil && this.getConfig("oilFullNotification")) {
                            document.querySelector("#ui-tweaks-notification-oil-full").style.display = '';
                        }
                        else {
                            document.querySelector("#ui-tweaks-notification-oil-full").style.display = 'none'
                        }
                    }
 
                    if(["oil_in", "oil_out"].includes(key)) {
                        const oilIn = IdlePixelPlus.getVarOrDefault("oil_in", 0, "int");
                        const oilOut = IdlePixelPlus.getVarOrDefault("oil_out", 0, "int");
                        window.var_oil_delta = `${oilIn-oilOut}`;
                    }
 
                    this.fightPointsFull();
 
                    if(["furnace_ore_type", "furnace_countdown", "furnace_ore_amount_at"].includes(key)) {
                        const el = document.querySelector("#notification-furnace-timer");
                        const ore = IdlePixelPlus.getVarOrDefault("furnace_ore_type", "none");
                        if(ore == "none") {
                            el.textContent = "";
                            return;
                        }
                        const timerRemaining = IdlePixelPlus.getVarOrDefault("furnace_countdown", 0, "int");
                        const timePerOre = SMELT_TIMES[ore] - 1;
                        const startAmount = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_set", 0, "int");
                        const doneAmount = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_at", 0, "int");
                        const remaining = startAmount - doneAmount - 1;
                        const totalTime = (remaining*timePerOre) + timerRemaining;
                        el.textContent = (" - " + format_time(totalTime));
                    }
 
                    ////////////////////////////////////// Rocket Info Start
 
                    if(["rocket_km", "rocket_status"].includes(key) || key.includes("rocket_potion_timer") || key.includes("rocket_fuel") || key.includes("rocket_potion")) {
                        const status = IdlePixelPlus.getVarOrDefault("rocket_status", "none", "string");
                        const km = IdlePixelPlus.getVarOrDefault("rocket_km", 0, "int");
                        var rocket_quest = IdlePixelPlus.getVarOrDefault("junk_planet_quest", 0, "int");
                        var rQComp;
                        if(rocket_quest == -1) {
                            rQComp = 2
                        }
                        else {
                            rQComp = 1
                        }
                        const total = IdlePixelPlus.getVarOrDefault("rocket_distance_required", 0, "int");
                        const rocket_pot = IdlePixelPlus.getVarOrDefault("rocket_potion_timer", 0, "int");
                        const rocket_type = IdlePixelPlus.getVarOrDefault("mega_rocket", 0, "int");
                        const rocket_fuel = IdlePixelPlus.getVarOrDefault("rocket_fuel", 0, "int");
                        const rocket_pot_count = IdlePixelPlus.getVarOrDefault("rocket_potion", 0, "int");
                        const rocket_pot_timer = format_time(rocket_pot);
                        const rocket_speed_moon = rocket_pot * 12 * rQComp;
                        const rocket_speed_sun = rocket_pot * 2400 * rQComp;
                        let pot_diff = "";
                        let pot_diff_mega = "";
                        let label = "";
                        let label_side = "";
                        let label_side_car_dist = "";
                        let label_side_car_eta = "";
                        if(status=="to_moon" || status=="from_moon") {
                            const remaining = status=="to_moon" ? (total-km) / rQComp : km / rQComp;
                            pot_diff = Math.round(remaining / 1.5) - (rocket_pot * 8);
                            let eta = "";
                            if (rocket_pot > 0) {
                                if (rocket_speed_moon <= remaining * rQComp) {
                                    eta = rocket_pot + pot_diff;
                                }
                                else {
                                    eta = Math.round(remaining / 12);
                                }
                            }
                            else {
                                eta = Math.round(remaining / 1.5);
                            }
                            label = format_time(eta);
                            label_side = format_time(eta);
                            if(this.getConfig("rocketETATimer") && !this.getConfig("hideRocketKM")) {
                                label = " - " + label;
                                label_side_car_dist = km.toLocaleString() + "/" + total.toLocaleString();
                                label_side_car_eta = label_side;
                            }
                        }
                        else if(status=="to_sun" || status=="from_sun") {
                            const remaining = status=="to_sun" ? (total-km) / rQComp: km / rQComp;
                            pot_diff_mega = Math.round(remaining / 300) - (rocket_pot * 8);
                            let eta = "";
                            if (rocket_pot > 0) {
                                if (rocket_speed_sun <= (remaining * rQComp)) {
                                    eta = rocket_pot + pot_diff_mega;
                                }
                                else {
                                    eta = Math.round(remaining / 2400);
                                }
                            }
                            else {
                                eta = Math.round(remaining / 300);
                            }
                            label = format_time(eta);
                            label_side = format_time(eta);
                            if(this.getConfig("rocketETATimer") && !this.getConfig("hideRocketKM")) {
                                label = " - " + label;
                                if(km == total) {
                                    label_side_car_dist = "LANDED";
                                } else if(total == 0) {
                                    label_side_car_dist = "ROCKET IS CURRENTLY IDLE";
                                } else {
                                    label_side_car_dist = km.toLocaleString() + "/" + total.toLocaleString();
                                    label_side_car_eta = label_side;
                                }
                            }
                        }
 
                        //rocket-type
                        if(rocket_type == "1") {
                            document.querySelector("#notification-mega_rocket-timer").textContent = label;
                        }
                        else {
                            document.querySelector("#notification-rocket-timer").textContent = label;
                        }
 
                        document.querySelector("#current-rocket-travel-distances").textContent = label_side_car_dist;
                        document.querySelector("#current-rocket-travel-times").textContent = label_side_car_eta;
                        document.querySelector("#rocket-fuel-count").textContent = rocket_fuel;
                        document.querySelector("#rocket-pot-count").textContent = rocket_pot_count;
                        document.querySelector("#rocket-pot-timer").textContent = rocket_pot_timer;
                    }
                    ////////////////////////////////////// Rocket Info End
 
                    ////////////////////////////////////// Rocket Status Start
 
                    const megaRocketType = IdlePixelPlus.getVarOrDefault("mega_rocket", 0, "int");
                    const rocketStatus = IdlePixelPlus.getVarOrDefault("rocket_status", "");
                    const rocketImage = document.querySelector("img#notification-rocket-image");
                    const moonRocketImage = document.querySelector("img#moon-rocket-img");
                    const sunRocketImage = document.querySelector("img#sun-rocket-img");
                    const menuBarRocketMoon = document.querySelector("#menu-bar-rocket_moon");
                    const menuBarRocketSun = document.querySelector("#menu-bar-rocket_sun");
                    const rocketTypeImgReg = document.querySelector("img#rocket-type-img-reg");
                    const rocketTypeImgMega = document.querySelector("img#rocket-type-img-mega");
                    const rocketCurrentTravelLocationMoon = document.querySelector("img#rocket-current-travel-location-moon");
                    const rocketCurrentTravelLocationSun = document.querySelector("img#rocket-current-travel-location-sun");
                    const rocketTravelDistances = document.querySelector("#current-rocket-travel-distances");
 
                    //if (key === "rocket_status") {
                    if (megaRocketType !== 1) {
                        if (rocketStatus === "from_moon") {
                            setTransform(rocketImage, "rotate(180deg)");
                            setTransform(moonRocketImage, "rotate(180deg)");
                            showElement(moonRocketImage);
                            hideElement(document.querySelector("#moon-mega-rocket-img"));
                            hideElement(sunRocketImage);
                            hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                            hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                            setTransform(rocketTypeImgReg, "rotate(180deg)");
                            showElement(rocketTypeImgReg);
                            hideElement(rocketTypeImgMega);
                            showElement(rocketCurrentTravelLocationMoon);
                            hideElement(rocketCurrentTravelLocationSun);
                        } else if (rocketStatus.includes("at_moon")) {
                            hideElement(document.querySelector("#moon-mega-rocket-img"));
                            hideElement(sunRocketImage);
                            hideElement(moonRocketImage);
                            showElement(menuBarRocketMoon.querySelector(".moon-landed"));
                            hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                            showElement(rocketTypeImgReg);
                            showElement(rocketCurrentTravelLocationMoon);
                            hideElement(rocketCurrentTravelLocationSun);
                        } else if (rocketStatus.includes("to_moon")) {
                            clearTransform(rocketImage);
                            clearTransform(moonRocketImage);
                            hideElement(document.querySelector("#moon-mega-rocket-img"));
                            hideElement(sunRocketImage);
                            showElement(moonRocketImage);
                            hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                            hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                            clearTransform(rocketTypeImgReg);
                            showElement(rocketTypeImgReg);
                            hideElement(rocketTypeImgMega);
                            showElement(rocketCurrentTravelLocationMoon);
                            hideElement(rocketCurrentTravelLocationSun);
                        } else {
                            hideElement(document.querySelector("#moon-mega-rocket-img"));
                            hideElement(sunRocketImage);
                            hideElement(moonRocketImage);
                            hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                            hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                            hideElement(rocketTypeImgReg);
                            hideElement(rocketTypeImgMega);
                            hideElement(rocketCurrentTravelLocationMoon);
                            hideElement(rocketCurrentTravelLocationSun);
                            rocketTravelDistances.textContent = "ROCKET IS CURRENTLY IDLE";
                        }
                    } else {
                        if (rocketStatus === "from_sun" || rocketStatus === "from_moon") {
                            setTransform(document.querySelector("#notification-mega_rocket-image"), "rotate(180deg)");
                            if (rocketStatus === "from_sun") {
                                setTransform(sunRocketImage, "rotate(180deg)");
                                showElement(sunRocketImage);
                                hideElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                setTransform(rocketTypeImgMega, "rotate(180deg)");
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                hideElement(rocketCurrentTravelLocationMoon);
                                showElement(rocketCurrentTravelLocationSun);
                            } else {
                                setTransform(document.querySelector("#moon-mega-rocket-img"), "rotate(180deg)");
                                showElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(sunRocketImage);
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                setTransform(rocketTypeImgMega, "rotate(180deg)");
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                showElement(rocketCurrentTravelLocationMoon);
                                hideElement(rocketCurrentTravelLocationSun);
                            }
                        } else {
                            clearTransform(document.querySelector("#notification-mega_rocket-image"));
                            clearTransform(rocketTypeImgMega);
                            if (rocketStatus === "to_sun") {
                                clearTransform(sunRocketImage);
                                showElement(sunRocketImage);
                                hideElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                hideElement(rocketCurrentTravelLocationMoon);
                                showElement(rocketCurrentTravelLocationSun);
                            } else if (rocketStatus === "to_moon") {
                                clearTransform(document.querySelector("#moon-mega-rocket-img"));
                                showElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(sunRocketImage);
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                showElement(rocketCurrentTravelLocationMoon);
                                hideElement(rocketCurrentTravelLocationSun);
                            } else if (rocketStatus === "none") {
                                hideElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(sunRocketImage);
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                hideElement(rocketTypeImgReg);
                                hideElement(rocketTypeImgMega);
                                hideElement(rocketCurrentTravelLocationMoon);
                                hideElement(rocketCurrentTravelLocationSun);
                                rocketTravelDistances.textContent = "ROCKET IS CURRENTLY IDLE";
                            } else if (valueAfter.includes("at_moon")) {
                                hideElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(sunRocketImage);
                                hideElement(moonRocketImage);
                                showElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                hideElement(menuBarRocketSun.querySelector(".sun-landed"));
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                showElement(rocketCurrentTravelLocationMoon);
                                hideElement(rocketCurrentTravelLocationSun);
                            } else {
                                hideElement(document.querySelector("#moon-mega-rocket-img"));
                                hideElement(sunRocketImage);
                                hideElement(moonRocketImage);
                                hideElement(menuBarRocketMoon.querySelector(".moon-landed"));
                                showElement(menuBarRocketSun.querySelector(".sun-landed"));
                                hideElement(rocketTypeImgReg);
                                showElement(rocketTypeImgMega);
                                hideElement(rocketCurrentTravelLocationMoon);
                                showElement(rocketCurrentTravelLocationSun);
                            }
                        }
                    }
                    //}
 
                    const rocket_usable = IdlePixelPlus.getVarOrDefault("rocket_usable", 0, "int");
                    const rocket_travel_check = IdlePixelPlus.getVarOrDefault("rocket_distance_required", 0, "int");
                    const rocket_pot_timer_check = IdlePixelPlus.getVarOrDefault("rocket_potion_timer", 0, "int");
                    const rocket_check = IdlePixelPlus.getVarOrDefault("mega_rocket", 0, "int");
                    if (this.getConfig("leftSideRocketInfoSection") && rocket_usable > 0) {
                        showBlockElement(document.getElementById("current-rocket-info"));
 
                        if (this.getConfig("leftSideRocketInfo")) {
                            showBlockElement(document.getElementById("rocket-travel-info"));
                            hideElement(document.getElementById("notification-mega_rocket"));
                            hideElement(document.getElementById("notification-rocket"));
                        } else if (rocket_travel_check > 0 && rocket_check == 1) {
                            showBlockElement(document.getElementById("notification-mega_rocket"));
                            hideElement(document.getElementById("rocket-travel-info"));
                        } else if (rocket_travel_check > 0 && rocket_check == 0) {
                            showInlineBlockElement(document.getElementById("notification-rocket"));
                            hideElement(document.getElementById("rocket-travel-info"));
                        } else {
                            hideElement(document.getElementById("rocket-travel-info"));
                        }
 
                        if (this.getConfig("leftSideRocketFuel")) {
                            showBlockElement(document.getElementById("current-rocket-fuel-info"));
                        } else {
                            hideElement(document.getElementById("current-rocket-fuel-info"));
                        }
 
                        if (this.getConfig("leftSideRocketPot")) {
                            showBlockElement(document.getElementById("current-rocket-pot-info"));
                            hideElement(document.getElementById("notification-potion-rocket_potion_timer"));
                        } else if (rocket_pot_timer_check > 0) {
                            showInlineBlockElement(document.getElementById("notification-potion-rocket_potion_timer"));
                            hideElement(document.getElementById("current-rocket-pot-info"));
                        } else {
                            hideElement(document.getElementById("current-rocket-pot-info"));
                        }
                    } else {
                        hideElement(document.getElementById("current-rocket-info"));
                    }
 
                    if (rocket_travel_check == 0) {
                        document.getElementById("current-rocket-travel-distances").textContent = "Rocket is IDLE";
                        setTransform(document.querySelector("img#rocket-type-img-mega"), "rotate(315deg)");
                        showBlockElement(document.querySelector("img#rocket-type-img-mega"));
                    }
 
                    if (key == "combat_loot_potion_active") {
                        const loot_pot = IdlePixelPlus.getVarOrDefault("combat_loot_potion_active", 0, "int");
                        if (loot_pot == 0) {
                            hideElement(document.getElementById("notification-loot_pot_avail"));
                        } else {
                            showInlineBlockElement(document.getElementById("notification-loot_pot_avail"));
                        }
                    }
 
                    ////////// Aquarium Notification
                    const hideAquarium = this.getConfig("hideAquarium");
                    const aquariumTimer = IdlePixelPlus.getVarOrDefault("aquarium_timer", 0, "int");
                    const aquariumUnlocked = IdlePixelPlus.getVarOrDefault("aquarium_xp_total", 0, "int");
                    if((hideAquarium && aquariumTimer == 0) || aquariumUnlocked == 0) {
                        document.getElementById("notification-aquarium-idle").style.display = "none"
                    } else if(!hideAquarium && aquariumTimer == 0) {
                        document.getElementById("notification-aquarium-idle").style.display = "inline-block"
                    }
 
                    ////////// SD Watch Notification
                    const sdWatchCrafted = IdlePixelPlus.getVarOrDefault("stardust_watch_crafted", 0, "int");
                    const sdWatchCharges = IdlePixelPlus.getVarOrDefault("stardust_watch_charges", 0, "int");
                    if (this.getConfig("moveSDWatch") && sdWatchCrafted === 1) {
                        hideElement(document.getElementById("notification-stardust_watch"));
                        document.querySelector("#menu-bar-sd_watch .sd-watch-charges").textContent = sdWatchCharges;
                    } else if (!this.getConfig("moveSDWatch") && sdWatchCharges > 0) {
                        showElement(document.getElementById("notification-stardust_watch"));
                    } else {
                        hideElement(document.getElementById("notification-stardust_watch"));
                        hideElement(document.getElementById("menu-bar-sd_watch"));
                    }
 
                    ////////// Current Heat (Left Sidecar)
                    var currentHeat = IdlePixelPlus.getVarOrDefault("heat", 0, "int");
                    document.querySelector(`#menu-bar-heat .sd-heat-level`).textContent = currentHeat.toLocaleString();
 
                    if(key.startsWith("gathering_working_gathering_loot_bag_")) {
                        var today = new Date();
                        var time = today.getHours().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        }) + ":" + today.getMinutes().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        }) + ":" + today.getSeconds().toLocaleString('en-US', {
                            minimumIntegerDigits: 2,
                            useGrouping: false
                        });
                        var location = key.replace("gathering_working_gathering_loot_bag_", "");
                        var bagCount = IdlePixelPlus.getVarOrDefault(key, 0, "int").toLocaleString();
                    }
 
                    if(key.includes("raw_") || key.includes("cooked_")) {
                        if(Globals.currentPanel == "panel-fishing") {
                            this.calcFishEnergy();
                        }
                    }
 
                    if(key.endsWith("_xp")) {
                        this.extendedLevelsUpdate();
                    }
 
                    const hideBoatNotifications = this.getConfig("hideBoat");
                    const pirate_ship_timer = IdlePixelPlus.getVarOrDefault("pirate_ship_timer", 0, "int");
                    const row_boat_timer = IdlePixelPlus.getVarOrDefault("row_boat_timer", 0, "int");
                    const canoe_boat_timer = IdlePixelPlus.getVarOrDefault("canoe_boat_timer", 0, "int");
                    const stardust_boat_timer = IdlePixelPlus.getVarOrDefault("stardust_boat_timer", 0, "int");
                    const submarine_boat_timer = IdlePixelPlus.getVarOrDefault("submarine_boat_timer", 0, "int");
                    if (hideBoatNotifications) {
                        hideElement(document.getElementById("notification-row_boat"));
                        hideElement(document.getElementById("notification-canoe_boat"));
                        hideElement(document.getElementById("notification-stardust_boat"));
                        hideElement(document.getElementById("notification-pirate_ship"));
                        hideElement(document.getElementById("notification-submarine_boat"));
                    } else {
                        if (row_boat_timer > 0) {
                            showElement(document.getElementById("notification-row_boat"));
                        }
                        if (canoe_boat_timer > 0) {
                            showElement(document.getElementById("notification-canoe_boat"));
                        }
                        if (stardust_boat_timer > 0) {
                            showElement(document.getElementById("notification-stardust_boat"));
                        }
                        if (pirate_ship_timer > 0) {
                            showElement(document.getElementById("notification-pirate_ship"));
                        }
                        if (submarine_boat_timer > 0) {
                            showElement(document.getElementById("notification-submarine_boat"));
                        }
                    }
 
                    if (key === "furnace_ore_amount_set") {
                        setTimeout(function () {
                            var furnaceOreTypeVar = IdlePixelPlus.getVarOrDefault("furnace_ore_amount_set", 0, "int");
                            var furnaceNotifVar = IdlePixelPlus.plugins['ui-tweaks'].getConfig("furnaceEmptyNotification");
 
                            if (furnaceOreTypeVar <= 0 && furnaceNotifVar) {
                                document.getElementById('notification-furnace_avail').style.display = "inline-block";
                            } else {
                                hideElement(document.getElementById('notification-furnace_avail'));
                            }
                        }, 500);
                    }
                }
                ////////// Current FP with Timer (Left Sidecar)
                if (Globals.currentPanel == "panel-combat-canvas") {
                    var currentFP = IdlePixelPlus.getVarOrDefault("fight_points", 0, "int").toLocaleString();
                    var rarePotTimer = IdlePixelPlus.getVarOrDefault("rare_monster_potion_timer", 0, "int");
                    var rarePotPlusTimer = IdlePixelPlus.getVarOrDefault("super_rare_monster_potion_timer", 0, "int");
                    var rarePotInfo = "";
 
                    if (rarePotTimer > 0) {
                        rarePotInfo = rarePotTimer;
                    } else if (rarePotPlusTimer > 0) {
                        rarePotInfo = format_time(rarePotPlusTimer);
                    } else {
                        rarePotInfo = "Inactive";
                    }
 
                    var combatLootPotActive = IdlePixelPlus.getVarOrDefault("combat_loot_potion_active", 0, "int");
                    var combatLootPotInfo = combatLootPotActive ? "Active" : "Inactive";
 
                    document.getElementById("combat-info-fight_point-right-fp").textContent = " " + currentFP;
                    document.getElementById("combat-info-fight_point-left-fp").textContent = " " + currentFP;
                    document.getElementById("combat-info-rare_pot-right-rp").textContent = " " + rarePotInfo;
                    document.getElementById("combat-info-rare_pot-left-rp").textContent = " " + rarePotInfo;
                    document.getElementById("combat-info-loot_pot-right-lp").textContent = " " + combatLootPotInfo;
                    document.getElementById("combat-info-loot_pot-left-lp").textContent = " " + combatLootPotInfo;
                }
 
 
                function setTransform(element, transformValue) {
                    element.style.transform = transformValue;
                }
 
                function clearTransform(element) {
                    element.style.transform = "";
                }
 
                function showInlineBlockElement(element) {
                    element.style.display = "inline-block";
                }
 
                function showBlockElement(element) {
                    element.style.display = "block";
                }
 
                function showElement(element) {
                    element.style.display = "";
                }
 
                function showFlexElement(element) {
                    element.style.display = "block";
                }
 
                function hideElement(element) {
                    element.style.display = "none";
                }
 
            }
        }
        //////////////////////////////// onVariableSet end ////////////////////////////////
 
        onCustomMessageReceived(player, content, callbackId) {
            if (player === "botofnades") {
                if (content.startsWith("uitRocket:moon:")) {
                    var distanceMoon = Number(content.substr(15));
                    document.getElementById("menu-bar-rocket_moon").querySelector(".rocket-dist_moon").textContent = Number(content.substr(15)).toLocaleString();
                    var goodMoon = Number(this.getConfig("goodMoon"));
                    var rocketDistMoonSymbol = document.getElementById("menu-bar-rocket_moon").querySelector(".rocket-dist_moon-symbol");
                    rocketDistMoonSymbol.textContent = goodMoon >= distanceMoon ? "🟢" : "🔴";
                } else if (content.startsWith("uitRocket:sun:")) {
                    var distanceSun = Number(content.substr(14));
                    document.getElementById("menu-bar-rocket_sun").querySelector(".rocket-dist_sun").textContent = Number(content.substr(14)).toLocaleString();
                    var goodSun = Number(this.getConfig("goodSun"));
                    var rocketDistSunSymbol = document.getElementById("menu-bar-rocket_sun").querySelector(".rocket-dist_sun-symbol");
                    rocketDistSunSymbol.textContent = goodSun >= distanceSun ? "🟢" : "🔴";
                }
                if(content.startsWith("uitRocket:toggle")) {
                    del = true;
                } else {
                    del = false;
                }
            }
        }
 
        onCombatEnd() {
            this.updateColors(PANEL_UPDATE_FILTER);
        }
 
        onChat(data) {
            this.updateColors(CHAT_UPDATE_FILTER);
            this.limitChat();
 
            const chatArea = document.getElementById('chat-area');
            const children = chatArea.children;
            const lastChild = children[children.length - 1];
 
            const chatFrom = data.username;
            const chatMsgBase = data.message;
 
            if (lastChild) {
                if (chatMsgBase.startsWith("🚀") && chatFrom === "botofnades") {
                    initialPing();
                }
                if(chatFrom == "botofnades" && del) {
                    lastChild.remove();
                }
            }
 
        }
    }
 
 
const elementsWithWidth = document.querySelectorAll('[width]');
elementsWithWidth.forEach(function(el) {
    el.setAttribute('original-width', el.getAttribute('width'));
});
 
const elementsWithHeight = document.querySelectorAll('[height]');
elementsWithHeight.forEach(function(el) {
    el.setAttribute('original-height', el.getAttribute('height'));
});
 
const plugin = new UITweaksPlugin();
IdlePixelPlus.registerPlugin(plugin);
 
})();