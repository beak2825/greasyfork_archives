// ==UserScript==
// @name         IdlePixel Slap Chop Private - TheeMarcel Fork
// @namespace    com.anwinity.idlepixel
// @version      3.2.1
// @description  Ain't nobody got time for that! Adds some QoL 1-click actions.
// @author       Original Author: Anwinity || Modded By: GodofNades/mippo/TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require      https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js?anticache=20220905
// @downloadURL https://update.greasyfork.org/scripts/542039/IdlePixel%20Slap%20Chop%20Private%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/542039/IdlePixel%20Slap%20Chop%20Private%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Overall Declarations for different variables used throughout the script
    let IPP, getVar, getThis, singleOverride;
    let foundryToggle = true;
    let smelteryToggle = true;
    const IMAGE_URL_BASE = document
    .querySelector("itembox[data-item=copper] img")
    .src.replace(/\/[^/]+.png$/, "");
    let loaded = false;
    let onLoginLoaded = false;

    // Start New Code Base Const/Functions
    const misc = function () {
        return {
            initStyles: function () {
                var style = document.createElement("style");
                style.id = "styles-slapchop";
                style.innerHTML = `
                    #slapchop-quickfight {
                        position: relative;
                    }

                    .slapchop-quickfight {
                        position: relative;
                    }

                    #slapchop-quickpreset-mining > .slapchop-quickpreset-mining-buttons {
                        display: flex;
                        flex-direction: row;
                        justify-content: start;
                    }

                    #slapchop-quickpreset-mining > .slapchop-quickpreset-mining-buttons > div {
                        display: flex;
                        flex-direction: column;
                        justify-content: start;
                    }

					#slapchop-quickpreset-mining button {
                    margin: 0.125em;
                    }

					.combat-presets-area,
                    .combat-potions-area,
                    .combat-cannon-area {
                        vertical-align: text-top;
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

                    #brewing-shortcut-table .slapchop-quickbrew-button {
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

                    #brewing-shortcut-table .slapchop-quickbrew-button:hover {
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

                    #quick-lamp-zone {
                        display: flex;
                        flex-direction: row;
                        flex-wrap: wrap;
                    }

                    #lamp-zone-all {
                        display: inline-flex;
                    }

                    #melee-lamp-zone {
                        display: flex;
                        flex-direction: column;
                        justify-content: start;
                        align-items: center;
                        position: relative;
                    }

                    #archery-lamp-zone {
                        display: flex;
                        flex-direction: column;
                        justify-content: start;
                        align-items: center;
                        position: relative;
                        padding-left: 20px;
                    }

                    #magic-lamp-zone {
                        display: flex;
                        flex-direction: column;
                        justify-content: start;
                        align-items: center;
                        position: relative;
                        padding-left: 20px;
                    }

                    .fighting-monster-loot-potion {
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

                    .fighting-monster-rain-potion {
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

                    .lumberjack-rain-pot-woodcutting {
                        width:100px;
                        height:100px;
                        display: inline-block;
                        vertical-align: text-top;
                        border:1px solid rgb(66, 66, 66);
                        background: rgb(8,115,0);
                        background: linear-gradient(0deg, rgba(8,115,0,1) 6%, rgba(55,45,253,1) 25%, rgba(55,45,253,1) 50%, rgba(101,101,101,1) 75%, rgba(52,52,52,1) 100%);
                        border-radius: 5pt;
                        color:white;
                        margin-bottom: 15px;
                    }

                    #rare_monster_potion-brew {
                        padding: 3px;
                        width: 50px;
                    }

                    #rare_monster_potion-use {
                        padding: 3px;
                        width: 50px;
                    }

                    #super_rare_monster_potion-brew {
                        padding: 3px;
                        width: 50px;
                    }

                    #super_rare_monster_potion-use {
                        padding: 3px;
                        width: 50px;
                    }

                    #combat_loot_potion-label {
                        color: white;
                    }

                    #rain_potion-in-combat-label {
                        color: white;
                    }

                    #rain_potion-brew {
                        padding: 3px;
                        width: 50px;
                    }

                    #rain_potion-use {
                        padding: 3px;
                        width: 50px;
                    }

                    .itembox-fight-center {
                        margin-top: 0.55rem;
                        text-align: center;
                    }

                    .center-flex {
                        display: flex;
                        justify-content: center;
                        text-align: center;
                    }
                `;
                document.head.appendChild(style);
            },

            updateButtons: function () {
                let potions = ["rare_monster_potion", "super_rare_monster_potion"];
                potions.forEach((potion) => {
                    let useButton = document.getElementById(`${potion}-use`);
                    let brewButton = document.getElementById(`${potion}-brew`);
                    getVar(potion, 0, "int")
                        ? (useButton.style.color = "white")
                    : (useButton.style.color = "red");
                    sCBrewing().canBrew(potion)
                        ? (brewButton.style.color = "white")
                    : (brewButton.style.color = "red");
                });
                let combatLootPotionsAmount = document.getElementById(
                    "combat_loot_potion-label"
                );
                combatLootPotionsAmount.textContent =
                    getVar("combat_loot_potion_timer", 0, "int") == 0
                    ? "Loot Potions: " + getVar("combat_loot_potion", 0, "int")
                : format_time(getVar("combat_loot_potion_timer", 0, "int"));
                let rainPotionsAmount = document.getElementById(
                    "rain_potion-in-combat-label"
                );
                rainPotionsAmount.textContent =
                    getVar("rain_potion_timer", 0, "int") == 0
                    ? "Rain Potions: " + getVar("rain_potion", 0, "int")
                : format_time(getVar("rain_potion_timer", 0, "int"));
            },
        };
    };

    const actionType = function () {
        return {
            primary: function (event) {
                const prop = getThis.getConfig("primaryActionKey") || "none";
                if (prop == "none") {
                    return !(event.altKey || event.ctrlKey || event.shiftKey);
                } else {
                    return event[prop];
                }
            },

            alt: function (event) {
                const prop = getThis.getConfig("altActionKey") || "altKey";
                return event[prop];
            },
        };
    };

    const mining_crafting = function () {
        window.SCMACHINES = [
            "drill",
            "crusher",
            "giant_drill",
            "excavator",
            "giant_excavator",
            "massive_excavator",
        ];

        window.SCMINERAL = [
            "amber_mineral",
            "amethyst_mineral",
            "blood_crystal_mineral",
            "blue_marble_mineral",
            "clear_marble_mineral",
            "dense_marble_mineral",
            "fluorite_mineral",
            "frozen_mineral",
            "jade_mineral",
            "lime_quartz_mineral",
            "magnesium_mineral",
            "opal_mineral",
            "purple_quartz_mineral",
            "sea_crystal_mineral",
            "smooth_pearl_mineral",
            "sulfer_mineral",
            "tanzanite_mineral",
            "topaz_mineral",
        ];

        window.SCMINING = [
            "small_stardust_prism",
            "medium_stardust_prism",
            "large_stardust_prism",
            "huge_stardust_prism",
            "xp_geode",
            "stone_geode",
            "grey_geode",
            "blue_geode",
            "green_geode",
            "red_geode",
            "cyan_geode",
            "ancient_geode",
            "meteor",
        ];

        window.SCSMELTABLES = [
            "copper",
            "iron",
            "silver",
            "gold",
            "promethium",
            "titanium",
            "ancient_ore",
            "dragon_ore",
            "faradox_ore",
        ];

        return {
            // Quick Smelting
            initQuickSmelt: function () {
                let htmlMining = `
                    <div id="slapchop-quicksmelt-mining" class="slapchop-quickfight">
                      <h5>Quick Smelt:</h5>
                      <div class="slapchop-quicksmelt-buttons">
                    `;
                SCSMELTABLES.forEach((ore) => {
                    htmlMining += `
                        <button type="button" onclick="sCMiningCrafting().quickSmelt('${ore}')">
                            <img src="${IMAGE_URL_BASE}/${ore}.png" class="img-20" />
                            ${ore
                        .replace(/_/g, " ")
                        .replace(/(^|\s)\w/g, (s) => s.toUpperCase())}
                            (<span data-slap="max-smelt-${ore}">?</span>)
                        </button>
                    `;
                });
                htmlMining += `
                        </div>
                        <hr>
                    </div>
                `;
                const panelMining = document.querySelector("#panel-mining .panel-logo-xp-area");
                panelMining.insertAdjacentHTML("afterend", htmlMining);

                let htmlCrafting = `
                    <div id="slapchop-quicksmelt-crafting" class="slapchop-quickfight">
                        <h5>Quick Smelt:</h5>
                        <div class="slapchop-quicksmelt-buttons">
                 `;
                SCSMELTABLES.forEach((ore) => {
                    htmlCrafting += `
                        <button type="button" onclick="sCMiningCrafting().quickSmelt('${ore}')">
                            <img src="${IMAGE_URL_BASE}/${ore}.png" class="img-20" />
                            ${ore
                        .replace(/_/g, " ")
                        .replace(/(^|\s)\w/g, (s) => s.toUpperCase())}
                           (<span data-slap="max-smelt-${ore}">?</span>)
                        </button>
                    `;
                });
                htmlCrafting += `
                        </div>
                        <hr>
                    </div>
                `;

                const panelCrafting = document.querySelector("#panel-crafting .panel-logo-xp-area");
                panelCrafting.insertAdjacentHTML("afterend", htmlCrafting);

                SCSMELTABLES.forEach((ore) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${ore}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickSmeltRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCMiningCrafting().quickSmelt(ore, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            maxSmeltable: function (ore) {
                const oilPerOre = Crafting.getOilPerBar(ore);
                const charcoalPerOre = Crafting.getCharcoalPerBar(ore);
                const lavaPerOre = Crafting.getLavaPerBar(ore);
                const plasmaPerOre = Crafting.getPlasmaPerBar(ore);

                const oil = getVar("oil", 0, "int");
                const capacity = Furnace.getFurnaceCapacity();
                const oreCount = getVar(ore, 0, "int");
                const maxSmeltFromOil = Math.floor(oil / oilPerOre);
                let maxSmeltCount = Math.min(capacity, oreCount, maxSmeltFromOil);

                if (charcoalPerOre > 0) {
                    const charcoal = getVar("charcoal", 0, "int");
                    const maxSmeltFromCharcoal = Math.floor(charcoal / charcoalPerOre);
                    maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromCharcoal);
                }
                if (lavaPerOre > 0) {
                    const lava = getVar("lava", 0, "int");
                    const maxSmeltFromLava = Math.floor(lava / lavaPerOre);
                    maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromLava);
                }
                if (plasmaPerOre > 0) {
                    const plasma = getVar("plasma", 0, "int");
                    const maxSmeltFromPlasma = Math.floor(plasma / plasmaPerOre);
                    maxSmeltCount = Math.min(maxSmeltCount, maxSmeltFromPlasma);
                }
                if (ore == "dragon_ore") {
                    const dragonFire = getVar("dragon_fire", 0, "int");
                    maxSmeltCount = Math.min(maxSmeltCount, dragonFire);
                }
                if (ore == "faradox_ore") {
                    const ghostEssence = getVar("ghost_essence", 0, "int");
                    const maxSmeltFromGhostEssence = Math.floor(ghostEssence / 100000);
                    maxSmeltCount = Math.min(oreCount, maxSmeltFromGhostEssence);
                }
                if (ore == "copper") {
                    maxSmeltCount = Math.min(capacity, oreCount);
                }
                return maxSmeltCount || 0;
            },

            quickSmelt: function (ore) {
                if (smelteryToggle) {
                    smelteryToggle = false;
                    const current = getVar("furnace_ore_type", "none");
                    if (current == "none") {
                        const max = sCMiningCrafting().maxSmeltable(ore);
                        if (max > 0) {
                            IdlePixelPlus.sendMessage(`SMELT=${ore}~${max}`);
                        }
                    }
                    setTimeout(function () {
                        smelteryToggle = true;
                    }, 1000);
                }
            },

            maxCraftable: function () {
                const oilPerFuel = 5000;
                const charcoalPerFuel = 20;
                const lavaPerFuel = 1;
                const oil = getVar("oil", 0, "int");
                const maxFuelFromOil = Math.floor(oil / oilPerFuel);
                let maxFuelCount = Math.min(maxFuelFromOil);
                if (charcoalPerFuel > 0) {
                    const charcoal = getVar("charcoal", 0, "int");
                    const maxCraftFromCharcoal = Math.floor(charcoal / charcoalPerFuel);
                    maxFuelCount = Math.min(maxFuelCount, maxCraftFromCharcoal);
                }
                if (lavaPerFuel > 0) {
                    const lava = getVar("lava", 0, "int");
                    const maxCraftFromLava = Math.floor(lava / lavaPerFuel);
                    maxFuelCount = Math.min(maxFuelCount, maxCraftFromLava);
                }
                return maxFuelCount || 0;
            },

            updateMaxCraftable: function () {
                const max = sCMiningCrafting().maxCraftable();
                const maxText = "Quick Craft Max (" + max + ")";
                const oilMax = 5000 * max;
                const oilText = "5,000 (" + oilMax.toLocaleString() + ") (oil)";
                const coalMax = 20 * max;
                const coalText = "20 (" + coalMax.toLocaleString() + ") (charcoal)";
                const lavaMax = 1 * max;
                const lavaText = "1 (" + lavaMax.toLocaleString() + ") (lava)";
                const label = document.querySelector(
                    "#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item]"
                ).dataset.materialsItem;

                const maxCraftableButton = document.querySelector(
                    "#crafting-table .slapchop-rocketfuelmax-button"
                );
                const oilTableCell = document.querySelector(
                    "#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=oil]"
                );
                const coalTableCell = document.querySelector(
                    "#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=charcoal]"
                );
                const lavaTableCell = document.querySelector(
                    "#crafting-table tbody tr[data-crafting-item=rocket_fuel] td item-crafting-table[data-materials-item=lava"
                );
                const singleCraftButton = document.querySelector(
                    "#crafting-table .slapchop-rocketfuelsingle-button"
                );

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
                        singleCraftButton.style.display = "none";
                    } else {
                        singleCraftButton.style.display = "block";
                    }
                }
            },

            updateQuickSmelt: function () {
                SCSMELTABLES.forEach((ore) => {
                    const max = sCMiningCrafting().maxSmeltable(ore);
                    const elements = document.querySelectorAll(
                        `[data-slap="max-smelt-${ore}"]`
					);
                    elements.forEach((element) => {
                        element.textContent = max;
                    });
                });
            },

            // Quick Mining
            initQuickMining: function () {
                SCMINING.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickMiningRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCMiningCrafting().quickMining(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            quickMining: function (item, alt) {
                let n = getVar(item, 0, "int");
                if (alt || singleOverride) {
                    console.log("Inside the minus: " + singleOverride);
                    n--;
                }
                if (n > 0) {
                    if (item.includes("_stardust_prism")) {
                        IdlePixelPlus.sendMessage(`SMASH_STARDUST_PRISM=${item}~${n}`);
                    } else if (item.includes("_geode")) {
                        IdlePixelPlus.sendMessage(`CRACK_GEODE=${item}~${n}`);
                    } else if (item == "meteor") {
                        websocket.send(`MINE_METEOR`);
                    }
                }
            },

            // Quick Mineral
            initQuickMineral: function () {
                SCMINERAL.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickMineralRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCMiningCrafting().quickMineral(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            quickMineral: function (item, alt) {
                let n = getVar(item, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`MINERAL_XP=${item}~${n}`);
                }
            },

            // Mining Machine Presets
            initMiningPresets: function () {
                let html = `
                    <div id="miningmachines-presets">
                        <h5>Mining Machine Presets:</h5>
                        <div id="slapchop-quickpreset-mining">
                            <div class="slapchop-quickpreset-mining-buttons">
                                <div>
                                    <button onclick="sCMiningCrafting().noMachines()">None</button>
                                </div>
                                <div>
                                    <button onclick="sCMiningCrafting().miningPresetSave(2)">Save 2</button>
                                    <button onclick="sCMiningCrafting().miningPresetLoad(2)">Load 2</button>
                                </div>
                                <div>
                                    <button onclick="sCMiningCrafting().miningPresetSave(3)">Save 3</button>
                                    <button onclick="sCMiningCrafting().miningPresetLoad(3)">Load 3</button>
                                </div>
                                <div>
                                    <button onclick="sCMiningCrafting().miningPresetSave(4)">Save 4</button>
                                    <button onclick="sCMiningCrafting().miningPresetLoad(4)">Load 4</button>
                                </div>
                                <div>
                                    <button onclick="sCMiningCrafting().allMachines()">&ensp;All&ensp;</button>
                                </div>
                            </div>
                        </div>
                        <hr>
                    </div>
                `;
                document
                    .querySelector("div.fresh-account-buy-pickaxe-text")
                    .insertAdjacentHTML("beforebegin", html);
            },

            miningPresetSave: function (presetNumber) {
                let presetData = {};
                let presetName = `Preset ${presetNumber}`;
                let username = getVar("username", "", "string");

                SCMACHINES.forEach(function (machine) {
                    let machineCount = `${machine}_on`;
                    let ippMachineOnCount = getVar(machineCount, 0, "int");
                    presetData[machine] = ippMachineOnCount;
                });

                let allPresets =
                    JSON.parse(localStorage.getItem(`${username}.miningPresets`)) || {};

                allPresets[presetName] = presetData;

                localStorage.setItem(
                    `${username}.miningPresets`,
                    JSON.stringify(allPresets)
                );
            },

            miningPresetLoad: function (presetNumber) {
                SCMACHINES.forEach(function (machine) {
                    let machineCount = `${machine}_on`;
                    let ippMachineOnCount = getVar(machineCount, 0, "int");
                    let ippMachineCrafted = getVar(machine, 0, "int");
                    let i = ippMachineOnCount;
                    while (i > 0) {
                        i--;
                        websocket.send(`MACHINERY=${machine}~decrease`);
                    }
                });

                let username = getVar("username", "", "string");
                let allPresets =
                    JSON.parse(localStorage.getItem(`${username}.miningPresets`)) || {};
                let presetName = `Preset ${presetNumber}`;
                let presetData = allPresets[presetName];

                if (!presetData) {
                    return;
                }

                SCMACHINES.forEach(function (machine) {
                    let machineCount = `${machine}_on`;
                    let ippMachineOnCount = getVar(machineCount, 0, "int");
                    let ippMachinePresetCount = presetData[machine] || 0;

                    let i = 0;

                    while (i < ippMachinePresetCount) {
                        i++;
                        websocket.send(`MACHINERY=${machine}~increase`);
                    }
                });
            },

            allMachines: function () {
                SCMACHINES.forEach(function (machine) {
                    let machineCount = `${machine}_on`;
                    let ippMachineOnCount = getVar(machineCount, 0, "int");
                    let ippMachineCrafted = getVar(machine, 0, "int");
                    let i = ippMachineOnCount;
                    while (i < ippMachineCrafted) {
                        i++;
                        websocket.send(`MACHINERY=${machine}~increase`);
                    }
                });
            },

            noMachines: function () {
                SCMACHINES.forEach(function (machine) {
                    let machineCount = `${machine}_on`;
                    let ippMachineOnCount = getVar(machineCount, 0, "int");
                    let ippMachineCrafted = getVar(machine, 0, "int");
                    let i = ippMachineOnCount;
                    while (i > 0) {
                        i--;
                        websocket.send(`MACHINERY=${machine}~decrease`);
                    }
                });
            },

            // Rocket Fuel Crafting
            initQuickRocketFuel: function () {
                const rows = document.querySelectorAll(
                    "#crafting-table tbody tr[data-crafting-item=rocket_fuel]"
                );
                rows.forEach((row) => {
                    const craft = row.getAttribute("data-crafting-item");
                    if (!craft) {
                        return;
                    }

                    const fourthTd = row.querySelector("td:nth-child(4)");
                    if (fourthTd) {
                        fourthTd.insertAdjacentHTML(
                            "beforeend",
                            `
                            <div class="slapchop-rocketfuelsingle-button"
                                onclick="event.stopPropagation(); sCMiningCrafting().quickCraftSingle()">Quick Craft 1</div>
                            <div class="slapchop-rocketfuelmax-button"
                                onclick="event.stopPropagation(); sCMiningCrafting().quickCraft()">Quick Craft Max</div>
                        `
						);
                    }
                });
            },

            quickCraft: function () {
                const max = sCMiningCrafting().maxCraftable();
                if (max > 0) {
                    IdlePixelPlus.sendMessage(`CRAFT=rocket_fuel~${max}`);
                }
            },

            quickCraftSingle: function () {
                IdlePixelPlus.sendMessage(`CRAFT=rocket_fuel~1`);
            },
        };
    };

    const gathering = function () {
        window.SCLOOT_BAGS = Array.from(
            document.querySelectorAll(`itembox[data-item^="gathering_loot_bag_"]`)
        ).map((el) => el.getAttribute("data-item"));

        return {
            quickGather: function (bag, alt) {
                let n = getVar(bag, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(
                        `OPEN_GATHERING_LOOT=${bag.replace("gathering_loot_bag_", "")}~${n}`
					);
                }
            },

            initQuickGather: function () {
                SCLOOT_BAGS.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickGatherRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCGathering().quickGather(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },
        };
    };

    const farming = function () {
        window.SCBONEMEALABLE = [
            "bones",
            "big_bones",
            "ice_bones",
            "ashes",
            "blood_bones",
        ];

        window.SCPLANTABLES = Array.from(
            document.querySelectorAll('itembox[data-item$="_seeds"]')
        ).map((el) => el.getAttribute("data-item"));

        return {
            quickBone: function (item, alt) {
                if (getVar("bonemeal_bin", 0, "int") != 0) {
                    let n = getVar(item, 0, "int");
                    singleOverride = getThis.getConfig("autoSingleEnabled");
                    if (alt || singleOverride) {
                        n--;
                    }
                    if (n > 0) {
                        IdlePixelPlus.sendMessage(`ADD_BONEMEAL=${item}~${n}`);
                    }
                }
            },

            initQuickBones: function () {
                SCBONEMEALABLE.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickBoneRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCFarming().quickBone(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            initQuickHarvest: function () {
                const firstItemBox = document.querySelector("#panel-farming itembox[data-item=green_leaf_buddy]");
                if (firstItemBox) {
                    firstItemBox.insertAdjacentHTML(
                        "beforebegin",
                        `
                        <itembox id="slapchop-bob" class="shadow hover" data-item="slapchop_bob" onclick="sCFarming().quickHarvest()">
                            <div class="center mt-1"><img width="50" height="50" src="data:image/png;base64,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"></div>
                            <div class="center mt-2">Harvest</div>
                        </itembox>
                    `
					);
                }

                const notificationFarmingReady = document.querySelector(
                    "#notification-farming-ready"
                );
                if (notificationFarmingReady) {
                    if (getThis.getConfig("quickHarvestNotificationEnabled")) {
                        notificationFarmingReady.setAttribute(
                            "onclick",
                            `sCFarming().quickHarvest(); switch_panels('panel-farming')`
						);
                    } else {
                        notificationFarmingReady.setAttribute(
                            "onclick",
                            `switch_panels('panel-farming')`
						);
                    }
                }
            },

            quickHarvest: function () {
                for (let i = 1; i <= 5; i++) {
                    let status = getVar("farm_stage_" + i, 0, "int");
                    if (status == 4) {
                        IdlePixelPlus.sendMessage("CLICKS_PLOT=" + i);
                    }
                }
            },

            quickPlant: function (seed, alt) {
                let n = getVar(seed, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (!alt && !singleOverride && n > 1) {
                    n = 1;
                }
                const donor = DonorShop.has_donor_active(
                    Items.getItem("donor_farm_patches_timestamp")
                );
                const maxPlot = donor ? 5 : 3;
                for (let plot = 1; plot <= maxPlot && n > 0; plot++) {
                    if (getVar(`farm_${plot}`) == "none") {
                        IdlePixelPlus.sendMessage(`PLANT=${seed}~${plot}`);
                        n--;
                    }
                }
            },

            initQuickPlant: function () {
                SCPLANTABLES.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickPlantRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    if (getThis.getConfig("quickPlantHarvestRightClickEnabled")) {
                                        sCFarming().quickHarvest();
                                    }
                                    sCFarming().quickPlant(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },
        };
    };

    const brewing = function () {
        window.POTIONS = Object.keys(Brewing.POTION_TIMERS);

        window.POTIONSNOTIMER = [
            "cooks_dust_potion",
            "fighting_dust_potion",
            "tree_dust_potion",
            "farm_dust_potion",
        ];

        POTIONSNOTIMER.forEach((potion) => {
            POTIONS.push(potion);
        });

        return {
            canBrew: function (potion) {
                let ingredients = Brewing.get_ingredients(potion);
                for (let i = 0; i < ingredients.length; i += 2) {
                    if (getVar(ingredients[i], 0, "int") < ingredients[i + 1])
                        return false;
                }
                return true;
            },

            quickPotion: function (potion, alt) {
                let n = getVar(potion, 0, "int");
                //console.log(potion);
                if (alt || singleOverride) {
                    n--;
                }
                if (!alt && !singleOverride && n > 1) {
                    n = 1;
                }
                if (n > 0) {
                    if (
                        potion == "combat_loot_potion" &&
                        var_combat_loot_potion_timer == 0
                    ) {
                        websocket.send(`BREWING_DRINK_COMBAT_LOOT_POTION`);
                    } else if (
                        potion == "rotten_potion" &&
                        var_rotten_potion_timer == 0
                    ) {
                        websocket.send(`BREWING_DRINK_ROTTEN_POTION`);
                    } else if (
                        potion == "merchant_speed_potion" &&
                        var_merchant_speed_potion_timer == 0
                    ) {
                        websocket.send(`BREWING_DRINK_MERCHANT_SPEED_POTION`);
                    } else {
                        IdlePixelPlus.sendMessage(`DRINK=${potion}`);
                    }
                }
            },

            initQuickPotions: function () {
                POTIONS.forEach((item) => {
                    const itemBoxes = document.querySelectorAll(`[data-item="${item}"]`);
                    itemBoxes.forEach((itemBox) => {
                        itemBox.oncontextmenu = "";

                        if (itemBox) {
                            itemBox.addEventListener("contextmenu", (event) => {
                                if (getThis.getConfig("quickPotionRightClickEnabled")) {
                                    const primary = sCActionType().primary(event);
                                    const alt = sCActionType().alt(event);
                                    if (primary || alt) {
                                        sCBrewing().quickPotion(item, !primary);
                                        event.stopPropagation();
                                        event.preventDefault();
                                        return false;
                                    }
                                } else {
                                    // Open default right-click menu
                                    Modals.open_brew_dialogue(itemBox.getAttribute('data-item'));
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            });
                        }
                    });
                });

                const combatLootPotion = document.querySelector(
                    '[data-item="combat_loot_potion"]'
                );
                combatLootPotion.oncontextmenu = "";

                if (combatLootPotion) {
                    combatLootPotion.addEventListener("contextmenu", (event) => {
                        if (getThis.getConfig("quickPotionRightClickEnabled")) {
                            const primary = sCActionType().primary(event);
                            const alt = sCActionType().alt(event);
                            if (primary || alt) {
                                sCBrewing().quickPotion("combat_loot_potion", !primary);
                                event.stopPropagation();
                                event.preventDefault();
                                return false;
                            }
                        } else {
                            // Open default right-click menu
                            Modals.open_brew_dialogue(combatLootPotion.getAttribute('data-item'));
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    });
                }

                const merchantSpeedPotion = document.querySelector(
                    '[data-item="merchant_speed_potion"]'
                );
                merchantSpeedPotion.oncontextmenu = "";

                if (merchantSpeedPotion) {
                    merchantSpeedPotion.addEventListener("contextmenu", (event) => {
                        if (getThis.getConfig("quickPotionRightClickEnabled")) {
                            const primary = sCActionType().primary(event);
                            const alt = sCActionType().alt(event);
                            if (primary || alt) {
                                this.quickPotion("merchant_speed_potion", !primary);
                                event.stopPropagation();
                                event.preventDefault();
                                return false;
                            }
                        } else {
                            // Open default right-click menu
                            Modals.open_brew_dialogue(merchantSpeedPotion.getAttribute('data-item'));
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    });
                }

                const rottenPotion = document.querySelector(
                    '[data-item="rotten_potion"]'
                );
                rottenPotion.oncontextmenu = "";

                if (rottenPotion) {
                    rottenPotion.addEventListener("contextmenu", (event) => {
                        if (getThis.getConfig("quickPotionRightClickEnabled")) {
                            const primary = sCActionType().primary(event);
                            const alt = sCActionType().alt(event);
                            if (primary || alt) {
                                sCBrewing().quickPotion("rotten_potion", !primary);
                                event.stopPropagation();
                                event.preventDefault();
                                return false;
                            }
                        } else {
                            // Open default right-click menu
                            Modals.open_brew_dialogue(rottenPotion.getAttribute('data-item'));
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    });
                }
            },

            quickBrew: function (potion) {
                IdlePixelPlus.sendMessage(`BREW=${potion}~1`);
            },

            initQuickBrew: function () {
                const rows = document.querySelectorAll(
                    "#brewing-table tbody tr[data-brewing-item]"
                );
                rows.forEach((row) => {
                    const potion = row.getAttribute("data-brewing-item");
                    if (!potion) {
                        return;
                    }

                    const fourthTd = row.querySelector("td:nth-child(4)");
                    if (fourthTd) {
                        fourthTd.insertAdjacentHTML(
                            "beforeend",
                            `
                            <div class="slapchop-quickbrew-button"
                              onclick="event.stopPropagation(); sCBrewing().quickBrew('${potion}')">Quick Brew 1</div>
                        `
						);
                    }
                });
            },
        };
    };

    const woodcutting = function () {
        window.SCLOGS = Object.keys(Cooking.LOG_HEAT_MAP);

        return {
            quickBurn: function (item, alt) {
                let n = getVar(item, 0, "int");
                singleOverride = getThis.getConfig("autoSingleEnabled");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`ADD_HEAT=${item}~${n}`);
                }
            },

            initQuickBurn: function () {
                SCLOGS.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickBurnRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCWoodcutting().quickBurn(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            initQuickFoundry: function () {
                let html = `
                    <div id="slapchop-quickfoundry" class="slapchop-quickfight">
                        <h5>Quick Foundry:</h5>
                        <div class="slapchop-quicksmelt-buttons">
                    `;
                SCLOGS.forEach((log) => {
                    if (log != "dense_logs") {
                        html += `
                            <button id="slapchop-quickfoundry-${log}" type="button" onclick="sCWoodcutting().quickFoundry('${log}')">
                                <img src="${IMAGE_URL_BASE}/${log}.png" class="img-20" />
                                ${log
                            .replace("_logs", "")
                            .replace(/_/g, " ")
                            .replace(/(^|\s)\w/g, (s) => s.toUpperCase())}
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

                const panelWoodcutting = document.querySelector(
                    "#panel-woodcutting .panel-logo-xp-area"
                );
                if (panelWoodcutting) {
                    panelWoodcutting.insertAdjacentHTML("afterend", html);
                }
            },

            updateQuickFoundry: function () {
                const foundryBusy = getVar("foundry_amount", 0, "int") != 0;
                SCLOGS.forEach((log) => {
                    if (log != "dense_logs") {
                        const max = sCWoodcutting().maxFoundry(log);
                        const maxFoundryElement = document.querySelector(
                            `[data-slap="max-foundry-${log}"]`
						);
                        if (maxFoundryElement) {
                            maxFoundryElement.textContent = max;
                        }

                        const button = document.querySelector(
                            `#slapchop-quickfoundry-${log}`
						);
                        if (button) {
                            button.disabled = foundryBusy || max <= 0;
                        }
                    }
                });
            },

            quickFoundry: function (log) {
                if (foundryToggle) {
                    foundryToggle = false;
                    const max = sCWoodcutting().maxFoundry(log);
                    if (max > 0) {
                        IdlePixelPlus.sendMessage(`FOUNDRY=${log}~${max}`);
                    }
                    setTimeout(function () {
                        foundryToggle = true;
                    }, 1000);
                }
            },

            maxFoundry: function (log) {
                if (getVar("charcoal_foundry_crafted", "0") != "1") {
                    return 0;
                }
                let max = getVar(log, 0, "int");
                let foundryStorage = getVar("foundry_storage_crafted", 0, "int");

                if (max >= 1000 && foundryStorage == 1) {
                    max = 1000;
                } else if (max > 100 && foundryStorage != 1) {
                    max = 100;
                }

                let oilMax = Math.floor(getVar("oil", 0, "int") / 10);
                if (max > oilMax) {
                    max = oilMax;
                }
                return max;
            },

            initQuickChop: function () {
                const panelWoodcutting = document.querySelector("#panel-woodcutting");
                const firstItembox = panelWoodcutting.querySelector("itembox[data-item=chop_all_ent_special]");

                const lumberjackHtml = `
                    <itembox id="slapchop-lumberjack" class="shadow hover" data-item="slapchop_lumberjack" onclick="sCWoodcutting().quickChop()">
                        <div class="center mt-1"><img width="50" height="50" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AABnZSURBVHhe7Z0HfBRl+sd/23t2N2XTO+mQBEIEkiAISBWQKqKIoJycHDZO8fQvwnl6CNY7j0NPz3K2O5FTDoQgCAhJKAGSEEJ675uyu8n29n9nMgGUFjzCbnJ8/Yy77zvvDpl55mnzlsEtbnGLW/yP88zatROZr7e4TtjM5w2luLj4s0X33vvq0aM5XkzVLfpIvwgkOSkRC+bPe+bNt97OfHH9+gim+hZ9oF8EArAwKjUVd8+endLd3ZX3q0ceWbXj229kzM5bXIV+EYhAKACLxYJcLscd4++QRUdHv5P5/b6CV155+RmmyS2uAIv5vKGsW7fu6xUPLZ9bWl4Oo9HE1ALZ2dkwmkxNzS0t++B0QigUVvmGRW7duO75JqbJ/zwc5vOGMmr06NTIyIg0iVgCna6LqQWCg4MRFhoqGzZ0aFJCQnySUqEYV1la/LBfcEjQyNFp2sK803VM0/9Z+kVD3n777XSxRHxwxtSp3LyCM3A4HOc3DodDm7OLIVqDHw8f7vIOH5r44hMrqpnq/0n6RUP27NlTl5IycsTw5KRYPo+P/IICnM7PQ3FJKZqbm2Gz28Dn8+mNgsflgsfjCb74+P3ipsbGk3TlDWDdq69PhNOxYNLY0euGBPosGXlb6hJweKy161+yZe78j5pp5lb0i4ZQvPba5jE8Pj+bEkDRuXOQSaXEbThhtdrg4eEBNpsNokXEj4gQFBgIlbc3so4dw7T5CwOmpo3+r3zK63/dGv3DF+9vETcWTBwitUBwUehisAHldiU6paGb7nns2U0r71vUzuxyC/pFQyj+9PZbjbm5uTaNRlMyYviIhbNm3rXRZLG+1qY3tpw7d85PwOP6ctgceHOtMGjaUFVTg8bmVpSXluWfzj1RwBzmunn1L1tlOV/9/UScNjcpUGgHjwiDtpBkoz75pOzLNUFmbksvbOyaeLak/L2eX7oH/aYhVyN94mQSGNvziZOPTgqQgUOulMXhxIH8CkydM3fkYyse/sVma/Gy5U94HP/kTX+hjT45NvmfmAsIya3HJcIg/wzMdqDLSjRFz4Mj/cEFn7z/t209v3Y9/aYhV6OuqsIWE59wtkPXxXaYjEkqTw9aKOpOLTZveu0RptkvQiV0vhaLxhBPAdEEUc/mQVxVr1BE5FPKA7yEgI/AgcNNiF+5+vEP9+/bR4yZ6+mXxLAv7Nm188CBzN0PGMHJclK3LcHPQ4B5i+9fQheukxde+WPs4qkZR0ZbCtMTPMmxxD0X/2o2QEEENY+bP7Ti7Kmd2WeL3OJJgssE0ou6y7itUd1Gfw8PCoCuqW7Zlq1bqUvZZ9Y8/4J/2c4PMycZj6QnKntMVV/xI34muOw/E7f88Q/zmSqX4nKBRMYP/aBBo6cjHRKEISpIdcfO73YH0Tv7SN7JfB+VpTVEciUxsrjgCmWQeIdCKFeBzSH27CIihEaU/rA9nim6FJcLZMvmjV0WjmhPl95IR0FBPp5oa268rmdeQWEhMIA4hougjGCJloUqcQwS5v4ayUuexdCFjyJx8VNIXPQkwsYtQKXDGweb2NAT72E2m3t+6GJcLhCKxJSR22pae9IBiUiAuFD/Rc8893wIXdEHggL9weJciE88gmMhHXk3/mMIx/QF90Hk5U/HvHabHQ67A1yJB3xihiNm0gIc7vbC9w0s8D1JGzfALQSSmjF2Z7cNRT2uHQjwUigPfJ/Z517H29LGNGk58iaIFdA4hJAkT0FYwnBsXbMYUgEXpXUt+PeRAny29zhaNXraNOrNFgyLDMKXGx7BhDAx0qfPZY7mWtxCICQzt3kHhnxR19hMl3095VAp5ev3Hj0eRldcAx8/v06DNOBk1JzVYCfOQKvOAJGAB4VUjFYSSq949RN8uOMAtnxzENt+OI6C0mpM/+2f8NDGT4jW2KDheMDOEe5kDudSXJKHXI6ImNj8dnXr0jA/Hxn18JHLYcszD2btlnvIDDNmzXznvmXLuZm7dhUxzX9CeFTsUIVZ/WZ6fAhyShphtFgRG+JH75OKRZiZkQSpkI8QfxVWzMxAxaksWHkkLmaxkRjuj2+r7fvHTJv91s7t2yz0j1yIW2gIxZcff6RlST33msjFpCBmC2yz/hmWw/nqihTvpfbinK8evP/eyz7mKD1bBDnJ+qhnZeUNzahuaiMZek/wS9VxTN3wM9ZjUogAfFItFYkRp+RgxZSR0FjZmL3i8T0r71t0oZ/AhbiNQCjGpKX9Lb+4jNh9HiJ9lQhX8Cb6K0ULPMRCzMuIQ7zcsYLkHClM8/MkDE8qOtekzapp1aChuQ0l1Q0/ecSvUPkifepMJIwcTQvI4bDirgljET8kDO0aHdT1tUxL1+M2Avnw6/94VRYXvn5veixuj/ZGUrAUj04fiVVTkoVccm0pRzxtVBxqq6suCYnXrlppixiRMe+xd3edPJhfjvKmdhiJ0/4J1AEYunQ6SGQycHg8dGg0eHPTJmaP63EbgRza9e+XZkVJR8WHBxBz46TvZOoujwhU0SErhUQoQARHO3H0HVOUdMVF2CzmiIbGphSb3Y6alg5U1jXB6bDDSvKLbqMZpWUVKDpbiIryMrCddhi6u2iz9mNBBRobG5mjuJ4Leu1C/vndnpCiHR/nLZ2QqKQEcTU+25eLN74+5KfpaG9hqmjihyX+tuhMwWbqO4fNRjRx6ueqL3+hpQIO4sICMSo+Ap/uO0GiZa+nG+tqX2N2uxS30JDsI1nGhjZtE3VnX2T6L4HSmC4bq/TpFzd0M1Xn0XZ2nn8WZXc4rigMim6zHSdKavHOvw9C06VHcnISs8f1uIVA3n7lJbU0avi07SX67bnFV3awXQYT6k3c755//Dd6porm2d+/HG00mX7xVeUIRMw31+M2PuStP75c++d3tswrqG6mNYGC+mzQmNDabYHZZMLW7fsx5s7pl3jg2sryeLPFJmSK103OoYMjHn9mrVs87XULH3IxTzz68JHpQ6TpkcSZn6nTorrDCOLiESa24sfDJ/Fm5olL/uZ9p86kOJ2OxmVzZ+9tbW4aKhQKYTLoMTZxCO3ga5rbYbXZmdY9glaShDHAwwPDx49FLAkWajq0sEpllUnjJ6x9YsXDLutBdDuB/Gv3ntQjW//w46+npwobNEYUanl0li0XsKBrqkEFyzvPIFB+FREd88Zjy5eeH4X3uxfXK48fPZpJnP3jUQnDcO7ksR8+XTNfKBIJ0K03oYIki5XtRoj8IhEaFYPWnd+Ax+djynO/g93uRGVVDRr3ZeKjf31bnbF8+YPP/e65Q8yhbypu8+ikF6W379BEiX5ZoIQKc3kI8vdFjJ8MgUoRwoL9kRwk9zO21k3MOpI1NOPOGSUnjh+jH4Al3jbaMjRx2Bkxh51u7GxPio6PG5OeFMs1cqWozi1GcOJojJm1CNFxCfDz84VYroC6ohZDMtJgs7HQ3NKK+qxjkLS1Kar54qjAyCGflJ0rctB/1E3E7TTksdWrXp2n0jzj5SGCUBUKFvvy94zeZEHmyTJk1xs+HhIVs7+kpGSuiGW9O0BdjxlzZiFyeDycbB4a2zTwDQiFQBVCTBWV3zAHoHGgRd2KDp0R9XU1qN22HS1VVQi9715UqbVr3vvzW28wDW8abieQBZPTP3l6UtQSZVAE2Jxr9+R2dhlxpqoRaUmx4MFGZ+SXzWTIsezkfhcEJ4DlHUHOvCeeoeKH3C++RO7R4+CSBNHS1Y3YKeNwuMOQ8/7nn6fRjW4ibhNl9eItk6QI+LwrasbPUcpEuD0xElynlc7ur5hW2m3gOG2w1ebDXHwILJOGrqY0Jv7OiTBrNLAaSQDhdMDc3gEJn+eSeS1uJxBYDfEshxU24yW53w2DbeiApfhHOLQ9yb7IywczN6xD0pwZCCGmbsxTa2ASilzSP+JWAjlw6vREf4WUvm0tup6RKP2GnWhUczFTACxmC9rqWtBaXofM/QfRZba4JPR1K4FoNVo4zMx4NWJKHLaevpFeqPyhd7sROBmzSB1O3dEOtVaDap0Op88U/fXzD/++h955k3Ergdw9Yfz+GjP7pNlGpGEzwdhcSTSlg9nLQl6tDgdK2rDvnBqtgkAc3X8GhTlnie3/ZSNG2KKesXE2sxn1hw7D1NQMtY/PsZTbx79A73ABbpeHjJuzqLWxonRhjK+M3LhUmEpCIw4PbDYLdZ1GdBqIfyHhkrZDh3P/3guz1YGio0UwEs3y8vcEl9vXU2KBGzQM4IuhqW/A7j//BTUisemuVavnr35oWQXT6KbjdgI5duRw8Yg7Z/PKSstuDyD+RMxzwmo2wcERQBA2HA111CQralqDGQKSYWesXI7RS5fBc+gI6PgKtOafgUTCI1EuOTWiaCyxHCwByTKtBvK7C6aOJZCCQwmE1EmUUhR26U1WL9Xsl//vuSM9LVyD2wmEIic750DMhLlf7S5okHazpcnDx02BYsRUSLxUyM89geq6RlTVNaOmqRV8uRdiU1JhcbKg0XTju3Wb4J0yHn4jM8D2CUebwBddGjtJMoPA8w4BWxEIniocerYnGorOwScsBMfzzuJ4/pm1/3j/b58yf4LLcEuBUJw6lqMuKyv9JmP2orbMo/lBPxzObskrPNeSnZvHr66pE3V2G2GUSPfzvX0iYiLD6G7ZNrUaJZl74ZucCFl4JEzk9KqqqrF3w8toJybOL3U0TGwByupbsfeVzajJL4Bvagre++Djf4QEBT6XdSTrpj8q+Tlul6lfi217vw9545WNCpWvL1Y+/ljVt39/VzcqMBAmiwV6Ytoq/vk1ybQnwjMykk76mjo1aNq5C8qIcCRMnQgdEUyrVouOQ0dIlMWCcfQoi0/4kGHrfrumlPknXMqAE8jPeWTOtAqPk2ciLMSfGB0OeIrFEEpF9AA4o7YbbXY7VAIBuDwuPIP80FxWjQ6yz5vUaUjY0D1u3NrPP/7YbUY5DHiBzL/7rk+e/82vl9isNnRqNDj+1jtIWTAXoaNvo516ZX09iv/+MQIThyHlnvn045E6Et6WfPEv7Fe3N+3IzglgDuUWuN+jk+vEgzh6eUg4ZEGhEHj6wECSS45QCI+AIMiDwyDzUcFM/I2daIqEfJcHhxIH70/MmxU6Hn8fcxi3YcALROChhMFkpmf3WogfMeoNsFmsPWW6zgoT0QoLaWMjpqq33m61QsDhiB59+tlf3PXbH7htlNVXJkyZMofT1ZnU3tyEhupKVOSehCw4CDa2A2pimspKS9CQlw+2REzCXRVaaqpQUV1N8pU8NLZVxWvNzuDy8vJvmMO5nAHvQ6bPnT/ZL+9kptxmh4GYJQVx1mIPCTFRlFPXo8Npga9IRG49DiR+HlAbtNgtmoJJ3CMQsK34sUp3csETL6StXbXS5QOtKQa8hjy0anUkW8RfMmnhXKgS4qEtK0PctKkIzYgDL6AOwWlCeA3jQ89hQUtMGl/gQAvbHw6uEFaeN3jWzgBZcNTRrIMHyphDupQB70OSRwzPqe7WNwii4tAoC4UkSoX6lnMk//geogAHBGIWOERBWD4KlIvSkC1dCIMkGqXiCciTzkKtbBS8PD3dZizpgNeQTz943+LvKfevOLgz7VSlDlxrE0y6Fih8LRCJHDBbBajURCK363ZUYRhMPB+iHWKwWBywOFyYHHx4CnQVuVmHsplDupQB70Mo7l9y32ZVfc5vO7n+qEQE5GI+WoQx4FDJn8WDnKTjil3CdpsZ8o7Mb47u2z6HqXIpA95kUXgovdBpE6JGMgpN/BhUiNOIz/CBzkYtcsO6av88h8OHzuhI/2LXbreY9TkoBELykA+ztUp1qzgRXIk30QhK8Xu3a0CaOBTJPl/848vxTI1LGRQC+ei9d4s8A8KaqM4sNldALvL1nBYLbGkgalss67LPFrlcSwaFQCg85L1LlVxeKyhh0b2PzHf6QRcDm02cu3RY7AdbP1jJVLmMQSMQ6rHJT+np/rVbDLDpW8E1NYDXmQtNwacF1rJ/ldqMnXQbGhbREokK+3Mq5n+5a/cls7NuJoNGIK3NP5lQBbu5G/a6vSYfc872JGX54ihJedLDC0Ym1RfuS7pn7rjxQt3p2l6NoWCTMJirSok/8P33Ll3Ktg9eb2DgFZKU75/xRGLvKWmLd5g2PLNo9vJFC/fSFT/jnvuWzj3Z4v21UDWUlHp+QwmI3fR94f0LxqWuXbXywvq2N5FBoSGZx06H+IYnBZ+/v5xOkos4tFcSBsWcpb/6zgs1ex22n5o6Pct3qLq6YjpTvOkMCoGcOZ6l4PKF520/daeLPLyuukzgosnpptvThz3paMkh7Xsm87BIdMZXhOHIiUKXrVc/KASSc/gQLDYWLQgKp92C1tryyy7DcTGbN7xY5C3QbrLpqWGrPQ6eI/SAV0D4XXTBBQwKgbS0kgvKlzIlkujZrQgJDWRKV2fylPGbZKbCzounY1c0dLos0hoUAjEaDGDzLgiEMkHhYX3rKl+35vF2PrqWO/RNtO+hYHE8Etdt3DSVLtxkBoVAxk+emuLk9k5tJvmHzQR/Zd97Zp9/8pEscXdBEbUGCjWQ26mIx75DeS6ZlTsoBEKMVDw1cZNyypTp4XMcqK+u7vP8jhnTpqnDAkRbTJ01pMQCV+CBNpv/0jmLH3iop8XNY1AIREAv8E+dSo/JsVpMaGhWX7Jq0NXIOnxg2/lx2kRLeN7xXHUXbxlTc9MYFAIxWcxZHIeB1g5KMDxFJOp5Y16/Y/YDfR7FbtN3E1NnOR+pUZri7eOVzhRuGoNCIHy+oMiuqzZdPJFHoAhBSWVrn6Ol+Qvv6fZ2lO7RNxeSUo+mUWO5bjaDQiAbN6wvFdjb852OC8+mKNgkFL578QN9Ml1bt2zRP/Xsk2vYTmoGF9WjwkJheSeeXrf+ukzff8ugEAjFkHDfbRY99UoQJnQlpksRO1PZZeK9Qlf0gfVrHk9hCxU9BaJtoqAxOH2mqs+/vxEMGoEseXB5ljdHTfuRXuhHIfy+j+MIHRJzv0AezJTI79kcVHeIJk+ZNj2Zqep3Bo1A7kiNK5Bz2n8ypYCatW4zUzOn+kZTfSNYPGYZcipAIP/JAhLBEsq/nTJ91k1ZinzQCEQh99T7Bcm+sxmoSaKUlpCNOOVajWRM4ojU/3vkiaeumXl7KmUYkxCAyWmxWDQtGb9aMAZPPTwTSx79fUhAaPjXTLN+ZdAIhCI2OuxUyhAPTMuIxfxJQ/HArFQ8+uhq2cq1b74kEHl8xDS7IlabrSo9yRdjR4QjYUgAgv2UkIr4kEjlUAXHRfxzzw/97uAHlUCcZi4WzJuFtOQIJMWGICrUByGBPggIiSb6IuDvyT561Xfzzpg7b1Np4QmmdAHKLwWHxfG3ffrRLKaq3xhUAunubB9hNmqZ0gWoC6pUhSg3PL3mqnf42lUrK436ThIM9PYgOmE2dUPXWo2mulLqLUBMCNZ/DCqBRIaHFXXr2mC3WWHSa9DZXI6msmNoOHcEGnWdA2zONVcYkHBNn727ebX+yOcvQZe/HcbiXeC1HkPFsR0IDY/YzzTrNy6ktoOE5156ueLUsZMRk0ZEoaWlEQZ9z3qZrTqT5bmNr6UNj4+/5gvHNvxl89S8fQd3J4UFw2yxwGI2kuMYwPMKzPrTO1symGb9woDVEE2XNt5g7L5kYNsrLzwf6espyWvVaOG86NGHSi7mf/PF59SIhmvy4qqn9wi5woK4hKFIGzsWGXfcidtGjUFDVXn6lq1b+3Uw3YAViEImLxKLpJd9AaV/QOA+pacXomJjzyeKLKcDdVXlfRri8/XX2/xtJr1/TtYR/PjDfhw+sB9nCvIgE3Dw3c6d/TpMaFD5kF5sdvs/DmUf7ayrqbngoMnW3FAfv37DhmsmeK+/8WYIy27ziYmNQ9KIVCQkjUBiUjKUHjISyekfenXzpr71D/8CBqVABHw+UlNSlMNTUpmaHgJVnti7Z/c173CRUDBfJODSWpH14wHk5hzG8WNHYbHZ4CkRyNrV6nuZpjecAe/Up0+bMlml8psvlUmFlZWV+9s6Opv8/XzDLbrOrQlDQuj+9otp6zJi7KRpw3+z+rE8puoSHli8sFnOsfs6GHN3MdQj+dpO4zff7dnbL/NJBqyGUO86vPfeRbuUfGQ6dS0rdPUVSzy59o8ifTwyxTbD1lBf5SXCoBBxgJ07dy5gipdA9sm6Oju4V1q9kcfjwmaxxB89mtMv06kHrEAa6urGalvqpytkEkglYsikYsg9pPCUk00ho9/bfjmodhKh4Irjro4dPz6Gz2V7XUY5aBwOJ7wUsuiS0tJopuqGMmAFUllVlSIT/7Kb1NjVsyLp5dixYweEnKtfFpbditLi4n4Z3ThgBWLQd4N/jdXjqLuZCnupSIua2ibic5EcqsLMscODicm57HsSu9paICbh7dVQinloa6zpl/72ASuQuLjYiXHBfiQq6bnovRefR+5uL6kAsYFemJkShjvjg/Do1OH09qs7kzEhMQRWi1VkNJouq14+QSGIDvBCmEoOmZAHCYm2JESQCjEfvgoJYshxJwwLRXdX/yxjO2CjrCeffHKqylT/bcawSH67wU4EwaJfIsml1sAy6FHVpnecqW8/pjY4+RmRXikSsdBktliFWqNVm9/Qtemzf3512a7ZP27cKDPWFp6bnhgUSPkm6rVITieLRFdWennz2rYuFLV0l5apTXM+//LLa44fvl4GdNi7bPny+Uqu9VW5WBBhtjnQ1KLeb3TyGh1szqnpM2acfnDpg4eIafLSanUpAQF+jWazJYBc5DOxcQmXzfB7+c3q1dH1laWr2OZuJY/thMFog8lhR9SwFPBFkk8nTZx48K677nKLpThucYtb3OIWt+gB+H8ajA/HL9a+bQAAAABJRU5ErkJggg=="></div>
                        <div class="center mt-2">Chop</div>
                    </itembox>
                `;
                const rainPotHtml = `
                    <itembox id="slapchop-rain-pot" class="shadow hover" data-item="slapchop_rainpot" onclick="websocket.send('DRINK=rain_potion')">
                        <div class="center mt-1"><img width="50" height="50" src="${IMAGE_URL_BASE}/rain_potion.png" title="rain_potion"></div>
                        <div class="center mt-2">Chop</div>
                    </itembox>
                `;
                const rainPotDivHtml = `
                    <div id="rain_pot-woodcutting" class="lumberjack-rain-pot-woodcutting" data-tooltip="rain_pot">
                        <div class="itembox-fight-center"><img src="${IMAGE_URL_BASE}/rain_potion.png" title="rain_potion"></div>
                        <div class="center-flex">
                            <div id="rain_potion-brew" class="hover" onclick="sCBrewing().quickBrew('rain_potion')">BREW</div>
                            <div id="rain_potion-use" class="hover" onclick="websocket.send('DRINK=rain_potion')">USE</div>
                        </div>
                    </div>
                `;

                if (firstItembox) {
                    firstItembox.insertAdjacentHTML("afterend", lumberjackHtml);
                    firstItembox.insertAdjacentHTML("afterend", rainPotHtml);
                    document
                        .querySelector("#slapchop-lumberjack")
                        .insertAdjacentHTML("afterend", rainPotDivHtml);
                }

                const notificationTreesReady = document.querySelector(
                    "#notification-trees-ready"
                );
                if (notificationTreesReady) {
                    if (
                        IdlePixelPlus.plugins.slapchop.getConfig(
                            "quickTreeNotificationHarvestEnabled"
                        )
                    ) {
                        notificationTreesReady.setAttribute(
                            "onClick",
                            "sCWoodcutting().quickChop(); switch_panels('panel-woodcutting')"
                        );
                    } else {
                        notificationTreesReady.setAttribute(
                            "onClick",
                            "switch_panels('panel-woodcutting')"
                        );
                    }
                }
            },

            quickChop: function () {
                for (let i = 1; i <= 5; i++) {
                    let status = getVar("tree_stage_" + i, 0, "int");
                    let treeType = getVar("tree_" + i, "none");
                    let sdCut = getThis.getConfig("quickChopSDTreesEnabled");
                    let regCut = getThis.getConfig("quickChopRegTreesEnabled");
                    if (
                        (status == 4 &&
                         treeType != "stardust_tree" &&
                         treeType != "tree") ||
                        (status == 4 && treeType == "stardust_tree" && sdCut) ||
                        (status == 4 && treeType == "tree" && regCut)
                    ) {
                        IdlePixelPlus.sendMessage("CHOP_TREE=" + i);
                    }
                }
            },
        };
    };

    const cooking = function () {
        window.SCEDIBLES = Object.keys(Cooking.ENERGY_MAP).filter(
            (s) => !s.startsWith("raw_")
        );

        window.SCCOOKABLES = Object.keys(Cooking.FOOD_HEAT_REQ_MAP);

        return {
            initQuickCook: function () {
                SCCOOKABLES.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickCookRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCCooking().quickCook(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            maxCookable: function (food) {
                return Cooking.can_cook_how_many(food) || 0;
            },

            quickCook: function (food, alt) {
                const max = sCCooking().maxCookable(food);
                let n = max;
                if (alt || singleOverride) {
                    const owned = getVar(food, 0, "int");
                    if (owned == max || singleOverride) {
                        n--;
                    }
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`COOK=${food}~${n}`);
                }
            },

            quickEat: function (food, alt) {
                let n = getVar(food, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`CONSUME=${food}~${n}`);
                }
            },

            initQuickEat: function () {
                SCEDIBLES.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickEatRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCCooking().quickEat(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },
        };
    };

    const fishing = function () {
        window.SCBOATS = Array.from(
            document.querySelectorAll(
                `itembox[data-item$="_boat"], itembox[data-item$="_ship"]`
			)
        ).map((el) => el.getAttribute("data-item"));

        window.SCBAITS = Array.from(
            document.querySelectorAll(`itembox[data-item$="bait"]`)
        ).map((el) => el.getAttribute("data-item"));

        return {
            quickBoat: function (item) {
                const n = getVar(`${item}_timer`);
                if (n == "1") {
                    IdlePixelPlus.sendMessage(`BOAT_COLLECT=${item}`);
                } else {
                    IdlePixelPlus.sendMessage(`BOAT_SEND=${item}`);
                }
            },

            initQuickBoat: function () {
                SCBOATS.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickBoatRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCFishing().quickBoat(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            quickBait: function (item) {
                var baitUse = "THROW_" + item.toUpperCase();
                websocket.send(`${baitUse}`);
            },

            initQuickBait: function () {
                SCBAITS.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickBaitRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCFishing().quickBait(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },
        };
    };

    const invention = function () {
        window.SCGRINDABLE = Array.from(
            document.querySelectorAll(
                `#panel-invention itembox[data-item^="blood_"][onclick^="Invention.clicks_limb"]`
			)
        ).map((el) => el.getAttribute("data-item"));

        return {
            initQuickGrind: function () {
                SCGRINDABLE.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickGrindRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCInvention().quickGrind(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            quickGrind: function (item, alt) {
                let n = getVar(item, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (!alt && !singleOverride && n > 1) {
                    n = 1;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`GRIND=${item}~${n}`);
                }
            },

            quickCleanse: function (item, alt) {
                let n = getVar(item, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`CLEANSE_EVIL_BLOOD=${item}~${n}`);
                }
            },

            initQuickCleanse: function () {
                const itembox = document.querySelector(
                    `itembox[data-item="evil_blood"]`
				);
                itembox.addEventListener("contextmenu", (event) => {
                    if (getThis.getConfig("quickCleanseRightClickEnabled")) {
                        const primary = sCActionType().primary(event);
                        const alt = sCActionType().alt(event);
                        if (primary || alt) {
                            sCInvention().quickCleanse("evil_blood", !primary);
                            event.stopPropagation();
                            event.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            },
        };
    };

    const combat = function () {
        window.SCNEEDLEABLE = [
            "lizard_mask",
            "lizard_body",
            "lizard_legs",
            "lizard_boots",
            "lizard_gloves",
            "bat_mask",
            "bat_body",
            "bat_legs",
            "bat_boots",
            "bat_gloves",
            "bear_mask",
            "bear_body",
            "bear_legs",
            "bear_boots",
            "bear_gloves",
            "crocodile_mask",
            "crocodile_body",
            "crocodile_legs",
            "crocodile_boots",
            "crocodile_gloves",
            "reaper_hood",
            "reaper_body",
            "reaper_skirt",
            "reaper_boots",
            "reaper_gloves",
        ];

        window.SCFEATHER2ARROW = {
            feathers: {
                craft: "wooden_arrows",
                required: {
                    feathers: 15,
                    logs: 5,
                    iron_bar: 5,
                },
            },
            fire_feathers: {
                craft: "fire_arrows",
                required: {
                    fire_feathers: 15,
                    oak_logs: 5,
                    silver_bar: 5,
                },
            },
            ice_feathers: {
                craft: "ice_arrows",
                required: {
                    ice_feathers: 15,
                    willow_logs: 5,
                    gold_bar: 5,
                },
            },
            ancient_feathers: {
                craft: "ancient_arrows",
                required: {
                    ancient_feathers: 15,
                    redwood_logs: 5,
                    ancient_bars: 5,
                },
            },
        };

    window.SCEXPLOSIVES = ["bomb", "tnt", "large_tnt", "mega_bomb"];

    return {
        initQuickFight: async function () {
            let html = `
                    <div id="slapchop-quickfight">
                        <h5>Quick Fight:</h5>
                    <div class="slapchop-quickfight-buttons">
                `;
                Object.values(IdlePixelPlus.info.combatZones).forEach((zone) => {
                    html += `
                        <div id="slapchop-quickfight-${
													zone.id
                }" class="slapchop-quickfight-zone m-1 ${
						zone.blood ? "blood" : ""
                }">
                            <button type="button" onclick="sCCombat().quickFight('${
															zone.id
                }')">${zone.id
                        .replace(/_/g, " ")
                        .replace(/(^|\s)\w/g, (s) => s.toUpperCase())}
                            </button>
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
                    <div id="slapchop-quickfight-pirate" class="slapchop-quickfight-zone m-1 pirate">
                        <button type="button" onclick="websocket.send('FIGHT_EVIL_PIRATE')">Evil Pirate</button>
                        <div class="slapchop-quickfight-fightpoints slapchop-quickfight-progress-container" title="Fight Points: Pirate">
                            <span class="slapchop-quickfight-progress-value">2,000 FP</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                        <div class="slapchop-quickfight-energy slapchop-quickfight-progress-container" title="Evil Pirate Count">
                            <span class="slapchop-quickfight-progress-value">0</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                    </div>
                `;
                html += `
                    <div id="slapchop-quickfight-castle" class="slapchop-quickfight-zone m-1 castle">
                        <button type="button" onclick="Castle.clicks_castle_entrance(); document.getElementById('combat-stats').style.display = 'none'; document.getElementById('game-panels-combat-items-area').style.display = 'none'; Combat.refresh_small_icons_combat_selection();">Faradox Castle</button>
                        <div class="slapchop-quickfight-fightpoints slapchop-quickfight-progress-container" title="Fight Points: Castle">
                            <span class="slapchop-quickfight-progress-value">No FP to Enter</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                        <div class="slapchop-quickfight-energy slapchop-quickfight-progress-container" title="Energy: Castle">
                            <span class="slapchop-quickfight-progress-value">No Energy to Enter</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                    </div>
                `;
                html += `
                    <div id="slapchop-quickfight-trios" class="slapchop-quickfight-zone m-1 trios">
                        <button type="button" onclick="websocket.send('FIGHT_GUARDIAN=4')">Trio Fight</button>
                        <div class="slapchop-quickfight-fightpoints slapchop-quickfight-progress-container" title="Key Sets: Trios">
                            <span class="slapchop-quickfight-progress-value">0</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                        <div class="slapchop-quickfight-energy slapchop-quickfight-progress-container" title="Energy: Guardian Trios">
                            <span class="slapchop-quickfight-progress-value">100,000 Energy</span>
                            <div class="slapchop-quickfight-progress"></div>
                        </div>
                    </div>
                </div>
                <hr>
                </div>
                `;
                const panelCombat = document.getElementById("combat-stats").querySelectorAll("div")[4];
                if (panelCombat) {
                    panelCombat.insertAdjacentHTML("afterend", html);
                }

                const gamePanelsCombatItemsArea = document.getElementById(
                    "itembox-fight-guardians"
                );
                if (gamePanelsCombatItemsArea) {
                    gamePanelsCombatItemsArea.insertAdjacentHTML(
                        "afterend",
                        `
                        <div id="rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
                            <div class="itembox-fight-center"><img src="${IMAGE_URL_BASE}/rare_monster_potion.png" title="fight"></div>
                            <div class="center-flex">
                                <div id="rare_monster_potion-brew" class="hover" onclick="sCBrewing().quickBrew('rare_monster_potion')">BREW</div>
                                <div id="rare_monster_potion-use" class="hover" onclick="Modals.clicks_rare_monster_potion()">USE</div>
                            </div>
                        </div>
                    `
					);
                }

                const rareMonsterPotInCombatTab = document.querySelector(
                    "#rare-monster-pot-in-combat-tab"
                );
                if (rareMonsterPotInCombatTab) {
                    rareMonsterPotInCombatTab.insertAdjacentHTML(
                        "afterend",
                        `
                        <div id="super_rare-monster-pot-in-combat-tab" class="itembox-fight" data-tooltip="fight">
                            <div class="itembox-fight-center"><img src="${IMAGE_URL_BASE}/super_rare_monster_potion.png" title="fight"></div>
                            <div class="center-flex">
                                <div id="super_rare_monster_potion-brew" class="hover" onclick="sCBrewing().quickBrew('super_rare_monster_potion')">BREW</div>
                                <div id="super_rare_monster_potion-use" class="hover" onclick="Modals.clicks_super_rare_monster_potion()">USE</div>
                            </div>
                        </div>
                    `
					);
                }

                const fightLeftBorderCombatBottomPanel = document.querySelector(
                    ".fight-left-border .td-combat-bottom-panel"
                );
                if (fightLeftBorderCombatBottomPanel) {
                    fightLeftBorderCombatBottomPanel.insertAdjacentHTML(
                        "afterend",
                        `
                        <div id="fighting-combat_loot_potion" onclick="websocket.send('BREWING_DRINK_COMBAT_LOOT_POTION')" class="fighting-monster-loot-potion hover shadow">
                            <img src="${IMAGE_URL_BASE}/combat_loot_potion.png" title="combat_loot_potion_icon">
                            <span id="combat_loot_potion-label">Loot Potions: 0</span>
                        </div>
                    `
					);
                }

                const fightLeftBorderFightingCombatLootPotion = document.querySelector(
                    ".fight-left-border #fighting-combat_loot_potion"
                );
                if (fightLeftBorderFightingCombatLootPotion) {
                    fightLeftBorderFightingCombatLootPotion.insertAdjacentHTML(
                        "afterend",
                        `
                        <div id="fighting-rain_potion" onclick="websocket.send('DRINK=rain_potion')" class="fighting-monster-rain-potion hover shadow">
                            <img src="${IMAGE_URL_BASE}/rain_potion.png" title="rain_potion_in_combat_icon">
                            <span id="rain_potion-in-combat-label">Rain Potions: 0</span>
                        </div>
                    `
					);
                }
            },

            useLamps: function (typeLamp) {
                var lampCount = getVar("combat_xp_lamp", 0, "int");
                for (let i = lampCount; i > 0; i--) {
                    websocket.send("COMBAT_XP_LAMP=" + typeLamp);
                }
            },

            initQuickLamps: function () {
                const quickLampContainerHtml = `
                    <div id="quick-lamp-container">
                        <div id="quick-lamp-zone">
                            <h5>Quick Lamps:</h5>
                            <div id="lamp-zone-all">
                                <div id="melee-lamp-zone">
                                    <div id="melee-zone-label">Melee</div>
                                    <button id="lamp-melee-max" onclick="sCCombat().useLamps('melee')">Max</button>
                                </div>
                                <div id="archery-lamp-zone">
                                    <div id="archery-zone-label">Archery</div>
                                    <button id="lamp-archery-max" onclick="sCCombat().useLamps('archery')">Max</button>
                                </div>
                                <div id="magic-lamp-zone">
                                    <div id="magic-zone-label">Magic</div>
                                    <button id="lamp-magic-max" onclick="sCCombat().useLamps('magic')">Max</button>
                                </div>
                            </div>
                        </div>
                        <hr>
                    </div>
                `;

                const gamePanelsCombatItemsArea = document.querySelector(
                    "#game-panels-combat-items-area"
                );
                if (gamePanelsCombatItemsArea) {
                    gamePanelsCombatItemsArea.insertAdjacentHTML(
                        "beforebegin",
                        quickLampContainerHtml
                    );
                }

                const lamps = getVar("combat_xp_lamp", 0, "int");
                const quickLampContainer = document.getElementById("quick-lamp-container");
                if (quickLampContainer) {
                    if (lamps === 0) {
                        quickLampContainer.style.display = "none";
                    } else {
                        quickLampContainer.style.display = "block";
                    }
                }
            },

            updateQuickFight: function () {
                const fp = getVar("fight_points", 0, "int");
                const energy = getVar("energy", 0, "int");
                const evilPirate = getVar("evil_pirate", 0, "int");
                const g1Key = getVar("green_gaurdian_key", 0, "int");
                const g2Key = getVar("blue_gaurdian_key", 0, "int");
                const g3Key = getVar("purple_gaurdian_key", 0, "int");
                const maxTrio = Math.min(g1Key, g2Key, g3Key);

                Object.values(IdlePixelPlus.info.combatZones).forEach((zone) => {
                    let disabled = fp < zone.fightPointCost || energy < zone.energyCost;
                    let disabledPirate = fp < 2000 || evilPirate == 0;
                    let disabledTrios = energy < 100000 || maxTrio == 0;
                    let fpPercent = (fp / zone.fightPointCost).toFixed(2).split(".");
                    let fpPiratePercent = (fp / 2000).toFixed(2).split(".");
                    let energyPercent = (energy / zone.energyCost).toFixed(2).split(".");
                    let trioEnergyPercent = (energy / 100000).toFixed(2).split(".");

                    let fpLabel = `&times; ${fpPercent[0]} + ${fpPercent[1].replace(
                        /^0/,
                        ""
                    )}%`;
                    let fpPirateLabel = `&times; ${
						fpPiratePercent[0]
                    } + ${fpPiratePercent[1].replace(/^0/, "")}%`;
                    let energyTrioLabel = `&times; ${
						trioEnergyPercent[0]
                    } + ${trioEnergyPercent[1].replace(/^0/, "")}%`;
                    let energyLabel = `&times; ${
						energyPercent[0]
                    } + ${energyPercent[1].replace(/^0/, "")}%`;

                    if (
                        zone.id === "volcano" &&
                        IdlePixelPlus.getVar("volcano_unlocked") !== "1"
                    ) {
                        disabled = true;
                    } else if (
                        zone.id === "northern_field" &&
                        IdlePixelPlus.getVar("northern_field_unlocked") !== "1"
                    ) {
                        disabled = true;
                    } else if (
                        zone.id === "mansion" &&
                        IdlePixelPlus.getVar("mansion_unlocked") !== "1"
                    ) {
                        disabled = true;
                    } else if (
                        (zone.id === "blood_field" ||
                         zone.id === "blood_forest" ||
                         zone.id === "blood_cave" ||
                         zone.id === "blood_volcano") &&
                        IdlePixelPlus.getVar("blood_moon_active") !== "1"
                    ) {
                        disabled = true;
                    }

                    const button = document.querySelector(
                        `#slapchop-quickfight-${zone.id} button`
					);
                    button.disabled = disabled;

                    const fpProgress = document.querySelector(
                        `#slapchop-quickfight-${zone.id} .slapchop-quickfight-fightpoints .slapchop-quickfight-progress`
					);
                    const energyProgress = document.querySelector(
                        `#slapchop-quickfight-${zone.id} .slapchop-quickfight-energy .slapchop-quickfight-progress`
					);
                    const fpProgressValue = document.querySelector(
                        `#slapchop-quickfight-${zone.id} .slapchop-quickfight-fightpoints .slapchop-quickfight-progress-value`
					);
                    const energyProgressValue = document.querySelector(
                        `#slapchop-quickfight-${zone.id} .slapchop-quickfight-energy .slapchop-quickfight-progress-value`
					);
                    const fpProgressPirate = document.querySelector(
                        `#slapchop-quickfight-pirate .slapchop-quickfight-fightpoints .slapchop-quickfight-progress`
					);
                    const fpPirateProgressValue = document.querySelector(
                        `#slapchop-quickfight-pirate .slapchop-quickfight-fightpoints .slapchop-quickfight-progress-value`
					);
                    const energyPirateProgressValue = document.querySelector(
                        `#slapchop-quickfight-pirate .slapchop-quickfight-energy .slapchop-quickfight-progress-value`
					);
                    const energyTrioProgressValue = document.querySelector(
                        `#slapchop-quickfight-trios .slapchop-quickfight-energy .slapchop-quickfight-progress-value`
					);
                    const fpTrioProgressValue = document.querySelector(
                        `#slapchop-quickfight-trios .slapchop-quickfight-fightpoints .slapchop-quickfight-progress-value`
					);

                    const buttonPirate = document.querySelector(
                        `#slapchop-quickfight-pirate button`
					);
                    const buttonTrios = document.querySelector(
                        `#slapchop-quickfight-trios button`
					);
                    buttonPirate.disabled = disabledPirate;

                    buttonTrios.disabled = disabledTrios;

                    fpProgress.style.width = `${fpPercent}%`;
                    fpProgressPirate.style.width = `${fpPiratePercent}%`;
                    energyProgress.style.width = `${energyPercent}%`;
                    fpProgressValue.innerHTML = fpLabel;
                    fpPirateProgressValue.innerHTML = fpPirateLabel;
                    fpTrioProgressValue.innerHTML = `${maxTrio} Remaining`;

                    energyProgressValue.innerHTML = energyLabel;
                    energyPirateProgressValue.innerHTML = `${evilPirate} Remaining`;
                    energyTrioProgressValue.innerHTML = energyTrioLabel;

                });
            },

            quickFight: function (zoneId) {
                const confirm = getThis.getConfig("quickFightConfirm");
                if (confirm) {
                    if (
                        sCCombat().confirm(
                            `FIGHT: ${zoneId
                            .replace(/_/g, " ")
                            .replace(/(^|\s)\w/g, (s) => s.toUpperCase())} ?`
						)
                    ) {
                        if (zoneId.startsWith("blood_")) {
                            Combat.modal_blood_area_last_selected = zoneId;
                        } else {
                            Combat.modal_area_last_selected = zoneId;
                        }
                        Globals.last_area_fight = zoneId;
                        IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
                    }
                } else {
                    if (zoneId.startsWith("blood_")) {
                        Combat.modal_blood_area_last_selected = zoneId;
                    } else {
                        Combat.modal_area_last_selected = zoneId;
                    }
                    Globals.last_area_fight = zoneId;
                    IdlePixelPlus.sendMessage(`START_FIGHT=${zoneId}`);
                }
            },

            quickExplode: function (item) {
                IdlePixelPlus.sendMessage(`USE_${item.toUpperCase()}`);
            },

            initQuickExplode: function () {
                SCEXPLOSIVES.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickExplosionEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCCombat().quickExplode(item);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            quickNeedle: function (item, alt) {
                let n = getVar(item, 0, "int");
                if (alt || singleOverride) {
                    n--;
                }
                if (n > 0) {
                    IdlePixelPlus.sendMessage(`USE_NEEDLE=${item}~${n}`);
                }
            },

            initQuickNeedle: function () {
                SCNEEDLEABLE.forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickNeedleRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCCombat().quickNeedle(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },

            maxCraftableArrows: function (feather) {
                const data = SCFEATHER2ARROW[feather];
                if (!data) return 0;

                let max = Number.MAX_SAFE_INTEGER;
                Object.keys(data.required).forEach((item) => {
                    const needed = data.required[item];
                    const owned = getVar(item, 0, "int");
                    const craftable = Math.floor(owned / needed);
                    max = Math.min(max, craftable);
                });
                return max;
            },

            quickFeather2Arrow: function (item, alt) {
                let n = sCCombat().maxCraftableArrows(item);
                if (n > 0) {
                    IdlePixelPlus.sendMessage(
                        `CRAFT=${SCFEATHER2ARROW[item].craft}~${n}`
					);
                }
            },

            initQuickFeather2Arrow: function () {
                Object.keys(SCFEATHER2ARROW).forEach((item) => {
                    const itemboxes = document.querySelectorAll(
                        `itembox[data-item="${item}"]`
					);
                    itemboxes.forEach((itembox) => {
                        itembox.addEventListener("contextmenu", (event) => {
                            if (getThis.getConfig("quickCraftArrowRightClickEnabled")) {
                                const primary = sCActionType().primary(event);
                                const alt = sCActionType().alt(event);
                                if (primary || alt) {
                                    sCCombat().quickFeather2Arrow(item, !primary);
                                    event.stopPropagation();
                                    event.preventDefault();
                                    return false;
                                }
                            }
                            return true;
                        });
                    });
                });
            },
        };
    };

    window.sCMisc = misc;
    window.sCActionType = actionType;
    window.sCMiningCrafting = mining_crafting;
    window.sCGathering = gathering;
    window.sCFarming = farming;
    window.sCBrewing = brewing;
    window.sCWoodcutting = woodcutting;
    window.sCCooking = cooking;
    window.sCFishing = fishing;
    window.sCInvention = invention;
    window.sCCombat = combat;

    // End New Code Base Const/Functions

    class SlapChopPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("slapchop", {
                about: {
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description,
                },
                config: [
                    {
                        label:
                        "------------------------------------------------<br/>Key Binds<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "primaryActionKey",
                        label: "Primary Action Key",
                        type: "select",
                        options: [
                            { value: "none", label: "None" },
                            { value: "altKey", label: "Alt" },
                            { value: "shiftKey", label: "Shift" },
                            { value: "ctrlKey", label: "Ctrl" },
                        ],
                        default: "none",
                    },
                    {
                        id: "altActionKey",
                        label: "Alt Action Key",
                        type: "select",
                        options: [
                            { value: "altKey", label: "Alt" },
                            { value: "shiftKey", label: "Shift" },
                            { value: "ctrlKey", label: "Ctrl" },
                        ],
                        default: "altKey",
                    },
                    {
                        id: "autoSingleEnabled",
                        label:
                        "Enable the ability to use items without having to hold the 'ALT' key<br/>to keep a single item for slapchop commands.",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Brewing<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickBrewButtonEnabled",
                        label: "Quick Brew (buttons): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickPotionRightClickEnabled",
                        label: "Quick Potion (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Combat<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickCraftArrowRightClickEnabled",
                        label:
                        "Quick Craft Arrow (right-click feather, primary=max): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickExplosionEnabled",
                        label:
                        "Quick Detonation - Quickly use explosives in combat window (right-click): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickFightEnabled",
                        label: "Quick Fight: Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickFightConfirm",
                        label: "Quick Fight: Confirm",
                        type: "boolean",
                        default: false,
                    },
                    {
                        id: "quickFightEnergyBar",
                        label: "Quick Fight: Energy Bar",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickFightFPBar",
                        label: "Quick Fight: FP Bar",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickLampShow",
                        label: "Quick Lamp Show (When you have Lamps)",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickNeedleRightClickEnabled",
                        label:
                        "Quick Needle (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Cooking/Eating<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickCookRightClickEnabled",
                        label: "Quick Cook (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickEatRightClickEnabled",
                        label: "Quick Eat (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Farming<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickBoneRightClickEnabled",
                        label:
                        "Quick Bonemeal (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickHarvestEnabled",
                        label: "Quick Harvest (Bob): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickHarvestNotificationEnabled",
                        label:
                        "Harvest Farm plots when clicking on the notification: Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickPlantRightClickEnabled",
                        label: "Quick Plant (right-click, primary=1, alt=max): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickPlantHarvestRightClickEnabled",
                        label:
                        "Quick Harvest And Plant (right-click, primary=1, alt=max): Enabled",
                        type: "boolean",
                        default: false,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Fishing<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickBaitRightClickEnabled",
                        label: "Quick Bait (right-click): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickBoatRightClickEnabled",
                        label: "Quick Boat (right-click): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Foundry/Mining/Smelting<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickFoundryEnabled",
                        label: "Quick Foundry (buttons): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickMiningRightClickEnabled",
                        label: "Quick Geode / Prism Use (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickMineralRightClickEnabled",
                        label:
                        "Quick Mineral XP Conversion (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickSmeltEnabled",
                        label: "Quick Smelt (buttons): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickSmeltRightClickEnabled",
                        label: "Quick Smelt (right-click, primary=max): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickPresetsEnabled",
                        label: "Mining Machine Presets: Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Gathering<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickGatherRightClickEnabled",
                        label:
                        "Quick Gather (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Invention<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickGrindRightClickEnabled",
                        label: "Quick Blood Grind (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickCleanseRightClickEnabled",
                        label:
                        "Quick Cleanse Blood in Invention (right-click, primary=1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        label:
                        "------------------------------------------------<br/>Woodcutting<br/>------------------------------------------------",
                        type: "label",
                    },
                    {
                        id: "quickBurnRightClickEnabled",
                        label:
                        "Quick Burn Logs (right-click, primary=max, alt=keep-1): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickChopEnabled",
                        label: "Quick Chop (Lumberjack): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickChopRegTreesEnabled",
                        label: "Quick Chop (Normal Trees Lumberjack): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickChopSDTreesEnabled",
                        label: "Quick Chop (SD Trees Lumberjack): Enabled",
                        type: "boolean",
                        default: true,
                    },
                    {
                        id: "quickTreeNotificationHarvestEnabled",
                        label: "Harvest Trees when clicking on the notification: Enabled",
                        type: "boolean",
                        default: true,
                    },
                ],
            });
        }

        onPanelChanged(panelBefore, panelAfter) {
            if (Globals.currentPanel == "panel-woodcutting") {
                let woodCuttingElite = Achievements.has_completed_set(
                    "woodcutting",
                    "elite"
                );
                if (woodCuttingElite) {
                    document.getElementById("rain_pot-woodcutting").style.display = "";
                } else {
                    document.getElementById("rain_pot-woodcutting").style.display =
                        "none";
                }
                if (Globals.currentPanel == "panel-combat") {
                    var lamps = getVar("combat_xp_lamp", 0, "int");
                    if (lamps == 0) {
                        document.getElementById("quick-lamp-container").style.display =
                            "none";
                    } else {
                        document.getElementById("quick-lamp-container").style.display = "";
                    }
                    sCMisc().updateQuickFight();
                }
            }
        }

        onConfigsChanged() {
            if (onLoginLoaded) {
                sCMisc().updateButtons();

                const slapchopQuickFight = document.querySelector(
                    "#slapchop-quickfight"
                );
                const slapchopQuickFoundry = document.querySelector(
                    "#slapchop-quickfoundry"
                );
                const slapchopQuickMachinePreset = document.getElementById(
                    "miningmachines-presets"
                );
                const slapchopQuickFightFPBar = document.querySelectorAll(
                    ".slapchop-quickfight-fightpoints"
                );
                const slapchopQuickFightEnergyBar = document.querySelectorAll(
                    ".slapchop-quickfight-energy"
                );
                const slapchopQuickSmeltMining = document.getElementById(
                    "slapchop-quicksmelt-mining"
                );
                const slapchopQuickSmeltCrafting = document.getElementById(
                    "slapchop-quicksmelt-crafting"
                );
                const slapchopQuickBrewButton = document.querySelectorAll(
                    ".slapchop-quickbrew-button"
                );

                singleOverride = getThis.getConfig("autoSingleEnabled");

                if (getThis.getConfig("quickFightEnabled")) {
                    slapchopQuickFight.style.display = "block";
                } else {
                    slapchopQuickFight.style.display = "none";
                }

                if (getThis.getConfig("quickFoundryEnabled")) {
                    slapchopQuickFoundry.style.display = "block";
                } else {
                    slapchopQuickFoundry.style.display = "none";
                }

                if (getThis.getConfig("quickPresetsEnabled")) {
                    slapchopQuickMachinePreset.style.display = "block";
                } else {
                    slapchopQuickMachinePreset.style.display = "none";
                }

                if (getThis.getConfig("quickFightFPBar")) {
                    slapchopQuickFightFPBar.forEach((bar) => {
                        bar.style.display = "block";
                    });
                } else {
                    slapchopQuickFightFPBar.forEach((bar) => {
                        bar.style.display = "none";
                    });
                }

                if (getThis.getConfig("quickFightEnergyBar")) {
                    slapchopQuickFightEnergyBar.forEach((bar) => {
                        bar.style.display = "block";
                    });
                } else {
                    slapchopQuickFightEnergyBar.forEach((bar) => {
                        bar.style.display = "none";
                    });
                }

                if (getThis.getConfig("quickSmeltEnabled")) {
                    slapchopQuickSmeltMining.style.display = "block";
                    slapchopQuickSmeltCrafting.style.display = "block";
                } else {
                    slapchopQuickSmeltMining.style.display = "none";
                    slapchopQuickSmeltCrafting.style.display = "none";
                }

                if (getThis.getConfig("quickBrewButtonEnabled")) {
                    slapchopQuickBrewButton.forEach((button) => {
                        button.style.display = "block";
                    });
                } else {
                    slapchopQuickBrewButton.forEach((button) => {
                        button.style.display = "none";
                    });
                }

                if (
                    getThis.getConfig("quickLampShow") &&
                    getVar("combat_xp_lamp", 0, "int") > 0
                ) {
                    document.getElementById("quick-lamp-container").style.display = "";
                } else {
                    document.getElementById("quick-lamp-container").style.display =
                        "none";
                }

                if (getThis.getConfig("quickHarvestEnabled")) {
                    window.var_slapchop_bob = "1";
                } else {
                    window.var_slapchop_bob = "0";
                }

                if (getThis.getConfig("quickChopEnabled")) {
                    window.var_slapchop_lumberjack = "1";
                } else {
                    window.var_slapchop_lumberjack = "0";
                }

                const notificationTreesReady = document.getElementById(
                    "notification-trees"
                );
                if (getThis.getConfig("quickTreeNotificationHarvestEnabled")) {
                    notificationTreesReady.setAttribute(
                        "onClick",
                        `sCWoodcutting().quickChop(); switch_panels('panel-woodcutting')`
					);
                } else {
                    notificationTreesReady.setAttribute(
                        "onClick",
                        `switch_panels('panel-woodcutting')`
					);
            }
            }
        }

        onLogin() {
            IPP = IdlePixelPlus;
            getVar = IdlePixelPlus.getVarOrDefault;
            getThis = IdlePixelPlus.plugins.slapchop;
            singleOverride = getThis.getConfig("autoSingleEnabled");
            sCMisc().initStyles();
            sCCombat().initQuickFight();
            sCMiningCrafting().initQuickSmelt();
            sCCooking().initQuickCook();
            sCCooking().initQuickEat();
            sCFarming().initQuickPlant();
            sCFarming().initQuickBones();
            sCBrewing().initQuickPotions();
            sCFishing().initQuickBoat();
            sCFishing().initQuickBait();
            sCCombat().initQuickNeedle();
            sCBrewing().initQuickBrew();
            sCGathering().initQuickGather();
            sCWoodcutting().initQuickBurn();
            sCCombat().initQuickFeather2Arrow();
            sCWoodcutting().initQuickFoundry();
            sCWoodcutting().initQuickChop();
            sCFarming().initQuickHarvest();
            sCInvention().initQuickGrind();
            sCMiningCrafting().initQuickRocketFuel();
            sCMiningCrafting().initQuickMining();
            sCInvention().initQuickCleanse();
            sCMiningCrafting().initQuickMineral();
            sCMiningCrafting().initMiningPresets();
            sCCombat().initQuickExplode();
            sCCombat().initQuickLamps();

            sCCombat().updateQuickFight();
            sCMiningCrafting().updateQuickSmelt();
            sCWoodcutting().updateQuickFoundry();

            setTimeout(function () {
                onLoginLoaded = true;
                IdlePixelPlus.plugins.slapchop.onConfigsChanged();
            }, 5000);
            loaded = true;
        }

        onVariableSet(key, valueBefore, valueAfter) {
            if (onLoginLoaded) {
                if (Globals.currentPanel != "panel-combat-canvas") {
                    if (Globals.currentPanel == "panel-combat") {
                        if (key.includes("combat_xp_lamp")) {
                            var lamps = getVar("combat_xp_lamp", 0, "int");
                            if (lamps == 0 || !getThis.getConfig("quickLampShow")) {
                                document.getElementById("quick-lamp-container").style.display =
                                    "none";
                            } else {
                                document.getElementById("quick-lamp-container").style.display =
                                    "";
                            }
                        }
                    }
                    if (
                        [
                            "fight_points",
                            "energy",
                            "volcano_unlocked",
                            "northern_field_unlocked",
                            "blood_moon_active",
                        ].includes(key)
                    ) {
                        sCCombat().updateQuickFight();
                    }
                }

                if (
                    Globals.currentPanel == "panel-mining" ||
                    Globals.currentPanel == "panel-crafting"
                ) {
                    if (
                        [
                            SCSMELTABLES,
                            "oil",
                            "charcoal",
                            "lava",
                            "dragon_fire",
                            "stone_furnace",
                            "bronze_furnace",
                            "iron_furnace",
                            "silver_furnace",
                            "gold_furnace",
                            "promethium_furnace",
                            "titanium_furnace",
                            "ancient_furnace",
                            "dragon_furnace",
                        ].includes(key)
                    ) {
                        sCMiningCrafting().updateQuickSmelt();
                        sCMiningCrafting().updateMaxCraftable();
                    }
                }

                if (Globals.currentPanel == "panel-woodcutting") {
                    if ([SCLOGS, "oil", "foundry_amount"].includes(key)) {
                        sCWoodcutting().updateQuickFoundry();
                    }
                }

                if (!loaded) {
                    this.delay();
                    return;
                }

                let variables = [
                    "dotted_green_leaf",
                    "strange_leaf",
                    "red_mushroom",
                    "rare_monster_potion",
                    "super_rare_monster_potion",
                    "combat_loot_potion",
                    "combat_loot_potion_timer",
                    "rain_potion",
                    "rain_potion_timer",
                ];
                if (variables.includes(key)) {
                    sCMisc().updateButtons();
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

            sCMisc().updateButtons();
        }
    }

    const plugin = new SlapChopPlugin();
    IdlePixelPlus.registerPlugin(plugin);
})();