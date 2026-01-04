// ==UserScript==
// @name         IdlePixel XP Calculator - TheeMarcel Fork
// @namespace    namespaceuniquetome
// @version      1.5.0
// @description  Calculator for Idle-Pixel.com for Mining / Crafting / Farming / Brewing
// @author       Original Author: shtos || Modded By: GodofNades/TheeMarcel
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/541045/IdlePixel%20XP%20Calculator%20-%20TheeMarcel%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/541045/IdlePixel%20XP%20Calculator%20-%20TheeMarcel%20Fork.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loaded = false;

    const IMAGE_HOST_URL = document
    .querySelector("itembox[data-item=copper] img")
    .src.replace(/\/[^/]+.png$/, "");

    const POTION_XP_MAP = {
        // DOES NOT ACCOUNT SKILLING OUTFITS!!!
        "stardust_potion": 75,
        "energy_potion": 50,
        "anti_disease_potion": 250,
        "tree_speed_potion": 525,
        "smelting_upgrade_potion": 550,
        "breeding_anti_disease_potion": 900,
        "great_stardust_potion": 1925,
        "farming_speed_potion": 500,
        "rare_monster_potion": 2125,
        "cure_animal_disease_potion": 350,
        "super_stardust_potion": 4400,
        "gathering_unique_potion": 3000,
        "heat_potion": 2500,
        "potion_of_twins": 6000,
        "bait_potion": 1000,
        "bone_potion": 1550,
        "furnace_speed_potion": 6000,
        "promethium_potion": 2000,
        //"oil_potion": 5000,
        "super_rare_monster_potion": 6000,
        "ultra_stardust_potion": 12900,
        "cooks_dust_potion": 100000,
        "fighting_dust_potion": 100000,
        "tree_dust_potion": 100000,
        "farm_dust_potion": 100000,
        "cure_all_animal_disease_potion": 1200,
        "magic_shiny_crystal_ball_potion": 7000,
        "birdhouse_potion": 800,
        "rocket_potion": 1500,
        "titanium_potion": 5000,
        "blue_orb_potion": 50000,
        "raids_hp_potion": 17500,
        "geode_potion": 9500,
        "magic_crystal_ball_potion": 12000,
        "stone_converter_potion": 4000,
        "rain_potion": 2500,
        "raids_mana_potion": 21000,
        "combat_loot_potion": 9500,
        "animal_attractor_potion": 8000,
        "gathering_worker_potion": 15000,
        "rotten_potion": 1250,
        "merchant_speed_potion": 50000,
        "green_orb_potion": 200000,
        "ancient_potion": 40000,
        "potion_of_triplets": 12000,
        "raids_crits_potion": 47500,
        "guardian_key_potion": 42500,
        "breeding_feeding_potion": 90000,
        "red_orb_potion": 500000,
        //"infinite_oil_potion": 0
        "faradox_potion": 1475000,
    }

    const INGREDIENT_XP_MAP = {
        "dotted_green_leaf": 25,
        "green_leaf": 100,
        "lime_leaf":250,
        "gold_leaf":800,
        "red_mushroom": 5,
        "strange_leaf":500,
        "moonstone": 250,
        "rocket_fuel": 250,
        "seaweed":0,
        "bones":0,
        "promethium":0,
        "titanium":0,
        "stranger_leaf":2500,
        "strangest_leaf": 10000,
        "crystal_leaf": 2000,
        "super_bait": 0,
        "fruit_skin": 0,
        "maggots":0,
        "stone":0,
        "ancient_ore": 0,
        "blue_shooting_star": 50000,
        "green_shooting_star": 200000,
        "red_shooting_star": 500000,
        "charcoal": 0,
        "feathers": 0,
        "ice_feathers": 0,
        "fire_feathers": 0,
        "cooks_dust": 20000,
        "farm_dust": 20000,
        "fighting_dust": 20000,
        "tree_dust": 20000,
        "pig_grease": 100,
        "dove_feather": 1000,
        "good_pig_grease": 200,
        "great_pig_grease": 500,
        "achievements": 0
    }

    const BARS_XP_MAP = {
        "bronze": 5,
        "iron": 25,
        "silver": 50,
        "gold": 100,
        "promethium": 500,
        "titanium": 2000,
        "ancient": 5000,
        "dragon": "Nan"
    }

    const ORES_XP_MAP = {
        "stone": 0.1,
        "copper": 1,
        "iron": 5,
        "silver": 10,
        "gold": 20,
        "promethium":100,
        "titanium":300,
        "ancient": "NaN",
        "dragon": "NaN"
    }

    const SEEDS_XP_MAP = {
        "red_mushroom_seeds": 40,
        "dotted_green_leaf_seeds": 150,
        "stardust_seeds": 222,
        "green_leaf_seeds": 300,
        "lime_leaf_seeds": 390,
        "gold_leaf_seeds": 1000,
        "crystal_leaf_seeds": 2450,
        "tree_seeds": 3000,
        "oak_tree_seeds": 10000,
        "willow_tree_seeds": 20000,
        "apple_tree_seeds": 20000,
        "maple_tree_seeds": 45000,
        "banana_tree_seeds": 47800,
        "stardust_tree_seeds": 70000,
        "orange_tree_seeds": 72850,
        "pine_tree_seeds": 90000,
        "palm_tree_seeds": 100000,
        "redwood_tree_seeds": 150000,
        "bone_tree_seeds": 200000,
        "lava_tree_seeds": 264000,
        "strange_tree_seeds": 425145,
        "dragon_fruit_tree_seeds": 400000
    }

    const BONEMEAL_SEED_MAP = {
        "red_mushroom_seeds": 0,
        "dotted_green_leaf_seeds": 0,
        "stardust_seeds": 0,
        "green_leaf_seeds": 0,
        "lime_leaf_seeds": 1,
        "gold_leaf_seeds": 5,
        "crystal_leaf_seeds": 25,
        "tree_seeds": 10,
        "oak_tree_seeds": 25,
        "willow_tree_seeds": 50,
        "apple_tree_seeds": 50,
        "maple_tree_seeds": 120,
        "banana_tree_seeds": 70,
        "stardust_tree_seeds": 150,
        "orange_tree_seeds": 120,
        "pine_tree_seeds": 180,
        "palm_tree_seeds": 200,
        "redwood_tree_seeds": 300,
        "bone_tree_seeds": 0,
        "lava_tree_seeds": 300,
        "strange_tree_seeds": 500,
        "dragon_fruit_tree_seeds": 500
    }

    let potionArray = Object.keys(POTION_XP_MAP).toString().split(',');

    const calculatorSettings = {
        mining: {
            targetLevel: 0,
            tool: 'none',
            orb: false,
            hide: false,
            outfit: {
                gloves: false,
                shirt: false,
                pants: false,
                boots: false,
                bonus: 0,
            },
            fullOutfit: false,
        },
        crafting: {
            targetLevel: 0,
            tool: 'none',
            orb: false,
            hide: false,
            perk: false,
            outfit: {
                gloves: false,
                shirt: false,
                pants: false,
                boots: false,
                bonus: 0,
            },
            fullOutfit: false,
        },
        brewing: {
            targetLevel: 0,
            hide: false,
            outfit: {
                gloves: false,
                shirt: false,
                pants: false,
                boots: false,
                bonus: 0,
            },
            fullOutfit: false
        },
        farming: {
            targetLevel: 0,
            hide: false,
            outfit: {
                gloves: false,
                shirt: false,
                pants: false,
                boots: false,
                bonus: 0,
            },
            fullOutfit: false,
        },
        shared: {
            donor: false,
        }
    }


    class XpCalculatorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("xpcalculator", { // unique plugin id, "sample"
                about: { // optional, but highly recommended
                    name: GM_info.script.name + " (ver: " + GM_info.script.version + ")",
                    version: GM_info.script.version,
                    author: GM_info.script.author,
                    description: GM_info.script.description
                }
            });
        }

        onLogin(){


            // CRAFTING HTML

            let html = $('#oil-summary-crafting').children().length ? '#oil-summary-crafting' : '#panel-crafting .progress-bar';
            $(html).after(
                `<hr>
            <div style="display: flex; flex-direction: column;">
<h5>XP Calculator:<button id="crafting-visibility-button">Hide</button></h5>
    <div id="crafting-calculator-div">
    <div>
    <label>Target Level:</label><input id="crafting-target-level" style="width:70px" type="number">
        <span >Required XP: <span id="crafting-xp-required"></span></span>
    <span>Required SD: <span id="crafting-sd-required"></span></span>
     <span>Required bars: <span id="crafting-bars-required">
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/bronze_bar.png"> <span id="crafting-calculator-bronze"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/iron_bar.png"> <span id="crafting-calculator-iron"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/silver_bar.png"> <span id="crafting-calculator-silver"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/gold_bar.png"> <span id="crafting-calculator-gold"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/promethium_bar.png"> <span id="crafting-calculator-promethium"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/titanium_bar.png"> <span id="crafting-calculator-titanium"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/ancient_bar.png"> <span id="crafting-calculator-ancient"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/dragon_bar.png"> <span id="crafting-calculator-dragon"> 0</span> </span>
        </span>
        </span>
    </div>
    <div id="crafting-xp-options" style="
    margin-top: 15px;
">

        <form id="crafting-calculator-form">
            <span>Tool gem: </span><label for="none" style="margin-right: 5px;">None</label><input type="radio" id="none" value="none" name="tool">
            <label for="sapphire" style="margin-right: 5px;">Sapphire</label><input type="radio" id="sapphire" value="sapphire" name="tool">
            <label for="emerald" style="margin-right: 5px;">Emerald</label><input type="radio" id="emerald" value="emerald" name="tool">
            <label for="ruby" style="margin-right: 5px;">Ruby</label><input type="radio" id="ruby" value="ruby" name="tool">
            <label for="diamond" style="margin-right: 5px;">Diamond</label><input type="radio" id="diamond" value="diamond" name="tool">
        </form>
        <span>Donor perk: </span> <input id="crafting-donor-perk-check" type="checkbox" style="margin-right: 10px;">
        <span>Blue orb: </span> <input id="crafting-blue-orb-check" type="checkbox" style="margin-right: 10px;">
        <span>Medium perk: </span> <input id="crafting-medium-achievement-check"  type="checkbox" style="margin-right: 10px;">
        <span>Outfit bonus: </span> <input id="crafting-outfit-check" type="checkbox" style="margin-right: 10px;">
</div>
    </div>
</div>
               `)
            document.querySelector('#crafting-visibility-button').onclick = ()=>{this.handleVisibility('crafting')};
            document.querySelector('#crafting-target-level').onchange = (event)=>{this.calculatorSettingsChanged('crafting', 'targetLevel', event.target.value)};
            document.querySelector('#crafting-calculator-form').onchange = (event)=>{this.calculatorSettingsChanged('crafting', 'tool', event.target.value)};
            document.querySelector('#crafting-blue-orb-check').onchange = (event)=>{this.calculatorSettingsChanged('crafting', 'orb', event.target.checked)};
            document.querySelector('#crafting-medium-achievement-check').onchange = (event)=>{this.calculatorSettingsChanged('crafting', 'perk', event.target.checked)};
            document.querySelector('#crafting-donor-perk-check').onchange = (event)=>{this.calculatorSettingsChanged('shared', 'donor', event.target.checked)};
            document.querySelector('#crafting-outfit-check').onchange = (event)=>{this.calculatorSettingsChanged('crafting', 'fullOutfit', event.target.checked)};
            //
            //
            // MINING HTML
            html = $('#oil-summary-mining').children().length ? '#oil-summary-mining' : '#panel-mining .progress-bar';
            $(html).after(
                `<hr>
            <div style="display: flex; flex-direction: column;">
<h5>XP Calculator:<button id="mining-visibility-button">Hide</button></h5>
<div id="mining-calculator-div">
    <div>
    <label>Target Level:</label><input id="mining-target-level" style="width:70px" type="number">
        <span >Required XP: <span id="mining-xp-required"></span></span>
    <span>Required SD: <span id="mining-sd-required"></span></span>
         <span>Required ores: <span id="mining-ores-required">
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/stone.png"> <span id="mining-calculator-stone"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/copper.png"> <span id="mining-calculator-copper"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/iron.png"> <span id="mining-calculator-iron"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/silver.png"> <span id="mining-calculator-silver"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/gold.png"> <span id="mining-calculator-gold"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/promethium.png"> <span id="mining-calculator-promethium"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/titanium.png"> <span id="mining-calculator-titanium"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/ancient_ore.png"> <span id="mining-calculator-ancient"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/dragon_ore.png"> <span id="mining-calculator-dragon"> 0</span> </span>
        </span>
        </span>
    </div>
    <div id="mining-xp-options" style="
    margin-top: 15px;
">

        <form id="mining-calculator-form">
            <span>Tool gem: </span><label for="none" style="margin-right: 5px;">None</label><input type="radio" id="none" value="none" name="tool">
            <label for="sapphire" style="margin-right: 5px;">Sapphire</label><input type="radio" id="sapphire" value="sapphire" name="tool">
            <label for="emerald" style="margin-right: 5px;">Emerald</label><input type="radio" id="emerald" value="emerald" name="tool">
            <label for="ruby" style="margin-right: 5px;">Ruby</label><input type="radio" id="ruby" value="ruby" name="tool">
            <label for="diamond" style="margin-right: 5px;">Diamond</label><input type="radio" id="diamond" value="diamond" name="tool">
        </form>
        <span>Donor perk: </span> <input id="mining-donor-perk-check" type="checkbox" style="margin-right: 10px;">
        <span>Blue orb: </span> <input id="mining-blue-orb-check" type="checkbox" style="margin-right: 10px;">
        <span>Outfit bonus: </span> <input id="mining-outfit-check" type="checkbox" style="margin-right: 10px;">
</div>
    </div>
</div>
               `)

            document.querySelector('#mining-visibility-button').onclick = ()=>{this.handleVisibility('mining')};
            document.querySelector('#mining-target-level').onchange = (event)=>{this.calculatorSettingsChanged('mining', 'targetLevel', event.target.value)};
            document.querySelector('#mining-calculator-form').onchange = (event)=>{this.calculatorSettingsChanged('mining', 'tool', event.target.value)};
            document.querySelector('#mining-blue-orb-check').onchange = (event)=>{this.calculatorSettingsChanged('mining', 'orb', event.target.checked)};
            document.querySelector('#mining-donor-perk-check').onchange = (event)=>{this.calculatorSettingsChanged('shared', 'donor', event.target.checked)};
            document.querySelector('#mining-outfit-check').onchange = (event)=>{this.calculatorSettingsChanged('mining', 'fullOutfit', event.target.checked)};
            ////////////////////////////////////////////////////////////////////
            //Array.from(document.querySelectorAll('#brewing-table img[src*="potion"]')).forEach((potion)=>potionArray.push(potion.title))
            $("#panel-brewing .progress-bar").first().after(`
            <hr>
            <div style="display: flex; flex-direction: column;">
<h5>XP Calculator:<button id="brewing-visibility-button">Hide</button></h5>
<div id="brewing-calculator-div">
    <div>
    <label>Target Level:</label><input id="brewing-target-level" style="width:70px" type="number">
        <span >Required XP: <span id="brewing-xp-required"></span></span>
         <div style="margin-top: 10px;">Required potions: <span id="brewing-potions-required">

        </span>
        </div>
    </div>
    <div id="brewing-xp-options" style="
    margin-top: 15px;
">
<span>Donor perk: </span> <input id="brewing-donor-perk-check" type="checkbox" style="margin-right: 10px;">
<span>Outfit bonus: </span> <span id="brewing-outfit-bonus" style="margin-right: 10px;">0</span>
</div>
    </div>
</div>`)

            let potionHTML = '';
            potionArray.forEach((potion)=>{
                if(potion != "infinite_oil_potion") {
                    potionHTML += `<span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/${potion}.png"> <span id="brewing-calculator-${potion}"> 0</span> </span>`
                }
            })
            document.querySelector('#brewing-potions-required').innerHTML = potionHTML;
            document.querySelector('#brewing-visibility-button').onclick = ()=>{this.handleVisibility('brewing')};
            document.querySelector('#brewing-target-level').onchange = (event)=>{this.calculatorSettingsChanged('brewing', 'targetLevel', event.target.value)};
            document.querySelector('#brewing-donor-perk-check').onchange = (event)=>{this.calculatorSettingsChanged('shared', 'donor', event.target.checked)};
            //////////////////////////////////////////////////////////////////////
            //Array.from(document.querySelectorAll("#farming-table img[src*=farming]")).forEach((seeds)=>seedsArray.push(seeds.title))
            $("#panel-farming .progress-bar").first().after(`
            <hr>
            <div style="display: flex; flex-direction: column;">
<h5>XP Calculator:<button id="farming-visibility-button">Hide</button></h5>
<div id="farming-calculator-div">
    <div>
    <label>Target Level:</label><input id="farming-target-level" style="width:70px" type="number">
        <span >Required XP: <span id="farming-xp-required"></span></span>
         <div style="margin-top: 10px;">Required Seeds (Bonemeal): <span id="farming-seeds-required">

        </span>
        </div>
    </div>
    <div id="farming-xp-options" style="
    margin-top: 15px;
">
<span>Donor perk: </span> <input id="farming-donor-perk-check" type="checkbox" style="margin-right: 10px;">
<span>Outfit bonus: </span> <span id="farming-outfit-bonus" style="margin-right: 10px;">0</span>
</div>
    </div>
</div>`)

            let farmingHTML = '';
            let seeds = Object.keys(SEEDS_XP_MAP);
            seeds.forEach((seeds)=>{
                farmingHTML += `<span><img style="height: 32px; width: 32px;" src="${IMAGE_HOST_URL}/${seeds}.png"> <span id="farming-calculator-${seeds}"> 0</span> </span>`;
            })
            document.querySelector('#farming-seeds-required').innerHTML = farmingHTML;
            document.querySelector('#farming-visibility-button').onclick = ()=>{this.handleVisibility('farming')};
            document.querySelector('#farming-target-level').onchange = (event)=>{this.calculatorSettingsChanged('farming', 'targetLevel', event.target.value)};
            document.querySelector('#farming-donor-perk-check').onchange = (event)=>{this.calculatorSettingsChanged('shared', 'donor', event.target.checked)};
            ////////////////////////////////////////////////////////////////////

            calculatorSettings.crafting.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('crafting_xp', 0, 'int'))+1;
            document.querySelector('#crafting-target-level').value = calculatorSettings.crafting.targetLevel;
            calculatorSettings.mining.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('mining_xp', 0, 'int'))+1;
            document.querySelector('#mining-target-level').value = calculatorSettings.mining.targetLevel;
            calculatorSettings.brewing.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('brewing_xp', 0, 'int'))+1;
            document.querySelector('#brewing-target-level').value = calculatorSettings.brewing.targetLevel;
            calculatorSettings.farming.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('farming_xp', 0, 'int'))+1;
            document.querySelector('#farming-target-level').value = calculatorSettings.farming.targetLevel;

            if (IdlePixelPlus.getVarOrDefault('diamond_hammer', 0, 'int')) calculatorSettings.crafting.tool = 'diamond'
            else if (IdlePixelPlus.getVarOrDefault('ruby_hammer', 0, 'int')) calculatorSettings.crafting.tool = 'ruby'
            else if (IdlePixelPlus.getVarOrDefault('emerald_hammer', 0, 'int')) calculatorSettings.crafting.tool = 'emerald'
            else if (IdlePixelPlus.getVarOrDefault('sapphire_hammer', 0, 'int')) calculatorSettings.crafting.tool = 'sapphire'
            else calculatorSettings.crafting.tool = 'none'

            if (IdlePixelPlus.getVarOrDefault('diamond_pickaxe', 0, 'int')) calculatorSettings.mining.tool = 'diamond'
            else if (IdlePixelPlus.getVarOrDefault('ruby_pickaxe', 0, 'int')) calculatorSettings.mining.tool = 'ruby'
            else if (IdlePixelPlus.getVarOrDefault('emerald_pickaxe', 0, 'int')) calculatorSettings.mining.tool = 'emerald'
            else if (IdlePixelPlus.getVarOrDefault('sapphire_pickaxe', 0, 'int')) calculatorSettings.mining.tool = 'sapphire'
            else calculatorSettings.mining.tool = 'none'

            if (IdlePixelPlus.getVarOrDefault('blue_hammer_orb_absorbed', 0, 'int')) calculatorSettings.crafting.orb = true;
            if (IdlePixelPlus.getVarOrDefault('blue_pickaxe_orb_absorbed', 0, 'int')) calculatorSettings.mining.orb = true;
            let donorTimestamp = IdlePixelPlus.getVarOrDefault('donor_bonus_xp_timestamp', 0, 'int');
            let hasDonorXpPerk = DonorShop.has_donor_active(donorTimestamp);
            calculatorSettings.shared.donor = hasDonorXpPerk;

            Array.from(document.querySelector('#crafting-calculator-form').children).find(elem=>elem.id == calculatorSettings.crafting.tool).checked = true;
            Array.from(document.querySelector('#mining-calculator-form').children).find(elem=>elem.id == calculatorSettings.mining.tool).checked = true;
            document.querySelector('#mining-donor-perk-check').checked = calculatorSettings.shared.donor;
            document.querySelector('#crafting-donor-perk-check').checked = calculatorSettings.shared.donor;
            document.querySelector('#brewing-donor-perk-check').checked = calculatorSettings.shared.donor;
            document.querySelector('#farming-donor-perk-check').checked = calculatorSettings.shared.donor;

            if(IdlePixelPlus.getVarOrDefault('ach_medium_oil_capacity_1600', 0, 'int') &&
               IdlePixelPlus.getVarOrDefault('ach_medium_smelt_promethium_bar', 0, 'int') &&
               IdlePixelPlus.getVarOrDefault('ach_medium_convert_500_gold_bars', 0, 'int') &&
               IdlePixelPlus.getVarOrDefault('ach_medium_use_charcoal_foundry', 0, 'int') &&
               IdlePixelPlus.getVarOrDefault('ach_medium_craft_10_iron_buckets', 0, 'int') &&
               IdlePixelPlus.getVarOrDefault('ach_medium_crush_50_bones_into_ashes', 0, 'int')) calculatorSettings.crafting.perk = true;
            document.querySelector('#crafting-medium-achievement-check').checked = calculatorSettings.crafting.perk;

            this.checkForSkillingOutfits();
            document.querySelector('#mining-outfit-check').checked = calculatorSettings.mining.fullOutfit;
            document.querySelector('#crafting-outfit-check').checked = calculatorSettings.crafting.fullOutfit;
            //document.querySelector('#farming-outfit-check').checked = calculatorSettings.farming.fullOutfit;


            this.calculateCraftingXP();
            this.calculateMiningXP();
            this.calculateBrewingXP();
            this.calculateFarmingXP();
            this.handleVisibility('mining');
            this.handleVisibility('crafting');
            this.handleVisibility('brewing');
            this.handleVisibility('farming');
            loaded = true;
        }

        calculatorSettingsChanged(skill, type, value){
            if (skill == 'crafting'){
                calculatorSettings.crafting[type] = value;
                this.calculateCraftingXP();
            }
            if (skill == 'mining'){
                calculatorSettings.mining[type] = value;
                this.calculateMiningXP();
            }
            if (skill == 'brewing'){
                calculatorSettings.brewing[type] = value;
                this.calculateBrewingXP();
            }
            if (skill == 'farming'){
                calculatorSettings.farming[type] = value;
                this.calculateFarmingXP();
            }
            if (skill = 'shared'){
                calculatorSettings.shared[type] = value;
                this.calculateCraftingXP();
                this.calculateMiningXP();
                this.calculateBrewingXP();
                this.calculateFarmingXP();
            }

        }

        calculateCraftingXP(){
            let currentXp = IdlePixelPlus.getVarOrDefault('crafting_xp', 0, 'int');
            let requiredXp = get_xp_required(calculatorSettings.crafting.targetLevel);
            let hasDonorPerk = calculatorSettings.shared.donor ? 1.1 : 1;
            //let bonusXp = parseFloat((hasDonorPerk + calculatorSettings.crafting.outfit.bonus / 100).toFixed(2));
            let bonusXp = hasDonorPerk;
            let deltaXp = requiredXp + 1 - currentXp
            let toolGem = this.getSdByGem(calculatorSettings.crafting.tool)
            let hasAchPerk = calculatorSettings.crafting.perk ? 1 : 0;
            let hasBlueorb = calculatorSettings.crafting.orb ? 2 : 0;
            let hasFullOutfit = calculatorSettings.crafting.fullOutfit ? 1 : 0;
            let requiredSd = deltaXp * (toolGem - hasAchPerk - hasBlueorb - hasFullOutfit);

            document.querySelector('#crafting-xp-required').textContent = window.format_number(deltaXp);
            document.querySelector('#crafting-sd-required').textContent = window.format_number(requiredSd);
            let bars = Object.keys(BARS_XP_MAP);
            bars.forEach(bar=>{
                document.querySelector(`#crafting-calculator-${bar}`).textContent = window.format_number(Math.ceil(deltaXp / ((BARS_XP_MAP[bar] * bonusXp ))));
            })
        }

        calculateMiningXP(){
            let currentXp = IdlePixelPlus.getVarOrDefault('mining_xp', 0, 'int');
            let requiredXp = get_xp_required(calculatorSettings.mining.targetLevel);
            let hasDonorPerk = calculatorSettings.shared.donor ? 1.1 : 1;
            //let bonusXp = parseFloat((hasDonorPerk + calculatorSettings.mining.outfit.bonus / 100).toFixed(2));
            let bonusXp = hasDonorPerk;
            let deltaXp = requiredXp + 1 - currentXp
            let toolGem = this.getSdByGem(calculatorSettings.mining.tool)
            let hasBlueOrb = calculatorSettings.mining.orb ? 2 : 0;
            let hasFullOutfit = calculatorSettings.mining.fullOutfit ? 1 : 0;
            let requiredSd = deltaXp * (toolGem - hasBlueOrb - hasFullOutfit);


            document.querySelector('#mining-xp-required').textContent = window.format_number(deltaXp);
            document.querySelector('#mining-sd-required').textContent = window.format_number(requiredSd);
            let ores = Object.keys(ORES_XP_MAP);
            ores.forEach(ore=>{
                document.querySelector(`#mining-calculator-${ore}`).textContent = window.format_number(Math.ceil(deltaXp / ((ORES_XP_MAP[ore] * bonusXp ))));
            })
        }

        calculateFarmingXP(){
            let currentXp = IdlePixelPlus.getVarOrDefault('farming_xp', 0, 'int');
            let requiredXp = get_xp_required(calculatorSettings.farming.targetLevel);
            let hasDonorPerk = calculatorSettings.shared.donor ? 1.1 : 1;
            let bonusXp = hasDonorPerk + calculatorSettings.farming.outfit.bonus;
            let deltaXp = requiredXp + 1 - currentXp
            let hasDonorPatches = IdlePixelPlus.getVarOrDefault('donor_farm_patches_timestamp', 0, 'int');
            let farm_1_XP = 0;
            let farm_2_XP = 0;
            let farm_3_XP = 0;
            let farm_4_XP = 0;
            let farm_5_XP = 0;
            let farm_Total_XP = 0;
            //farm_1_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_1')];
            //farm_2_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_2')];
            //farm_3_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_3')];
            if(SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_1')]) {
                farm_1_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_1')];
            }
            else {
                farm_1_XP = 0;
            }
            if(SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_2')]) {
                farm_2_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_2')];
            }
            else {
                farm_2_XP = 0;
            }
            if(SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_3')]) {
                farm_3_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_3')];
            }
            else {
                farm_3_XP = 0;
            }
            if(hasDonorPatches > 0) {
                if(SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_4')]) {
                    farm_4_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_4')];
                }
                else {
                    farm_4_XP = 0;
                }
                if(SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_5')]) {
                    farm_5_XP = SEEDS_XP_MAP[IdlePixelPlus.getVarOrDefault('farm_5')];
                }
                else {
                    farm_5_XP = 0;
                }
            };
            farm_Total_XP = (farm_1_XP + farm_2_XP + farm_3_XP + farm_4_XP + farm_5_XP) * bonusXp;
            if(deltaXp < 0) {
                deltaXp = 0
            }
            let bonemeal = IdlePixelPlus.getVarOrDefault('bonemeal', 0, 'int');
            document.querySelector('#farming-xp-required').textContent = window.format_number(deltaXp);
            let seeds = Object.keys(SEEDS_XP_MAP);
            let bones = Object.keys(BONEMEAL_SEED_MAP);
            seeds.forEach(seeds=>{
                let bonemealReq = (Math.ceil((deltaXp - farm_Total_XP) / ((SEEDS_XP_MAP[seeds] * bonusXp))) * BONEMEAL_SEED_MAP[seeds]) - bonemeal;
                if(bonemealReq < 0) {
                    bonemealReq = 0;
                }
                document.querySelector(`#farming-calculator-${seeds}`).textContent = window.format_number(Math.ceil((deltaXp - farm_Total_XP) / ((SEEDS_XP_MAP[seeds] * bonusXp)))) + ` (${bonemealReq})`;
            })
        }

        calculateBrewingXP(){

            let currentXp = IdlePixelPlus.getVarOrDefault('brewing_xp', 0, 'int');
            let requiredXp = get_xp_required(calculatorSettings.brewing.targetLevel);
            let hasDonorPerk = calculatorSettings.shared.donor ? 1.1 : 1;
            let bonusXp = hasDonorPerk + calculatorSettings.brewing.outfit.bonus;
            let deltaXp = requiredXp + 1 - currentXp
            document.querySelector('#brewing-xp-required').textContent = window.format_number(deltaXp);
            let potions = Object.keys(POTION_XP_MAP);
            potionArray.forEach(potion=>{
                if(potion != "infinite_oil_potion") {
                    let ingredients = Brewing.get_ingredients(potion);
                    let xpPerPotion = 0;
                    let maxCraftable = Number.MAX_SAFE_INTEGER;
                    for (let i=0;i<ingredients.length;i+=2){
                        xpPerPotion += Math.floor((INGREDIENT_XP_MAP[ingredients[i]] * bonusXp) * parseInt(ingredients[i+1]));
                        let craftable = Math.floor(IdlePixelPlus.getVarOrDefault(ingredients[i], 0, 'int') / parseInt(ingredients[i+1]));
                        craftable < maxCraftable ? maxCraftable = craftable : null;
                    }
                    document.querySelector(`#brewing-calculator-${potion}`).textContent = window.format_number(Math.ceil(deltaXp / xpPerPotion)) + ` (${maxCraftable})`;
                }
            })
        }

        getSdByGem(gem){
            let sd = {none: 13, sapphire: 12, emerald: 11, ruby: 10, diamond: 9}
            return sd[gem]
        }

        handleVisibility(key){
            calculatorSettings[key].hide = !calculatorSettings[key].hide;
            if (calculatorSettings[key].hide) document.querySelector(`#${key}-calculator-div`).style.display = 'none'
            else document.querySelector(`#${key}-calculator-div`).style.display = 'block'
            calculatorSettings[key].hide ? document.querySelector(`#${key}-visibility-button`).textContent = 'Show' : document.querySelector(`#${key}-visibility-button`).textContent = 'Hide';
        }

        onVariableSet(key, valueBefore, valueAfter) {
            if (!loaded) return;
            switch (key){
                case 'crafting_xp':
                    calculatorSettings.crafting.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('crafting_xp', 0, 'int'))+1;
                    document.querySelector('#crafting-target-level').value = calculatorSettings.crafting.targetLevel;
                    this.calculateCraftingXP();
                    break;
                case 'mining_xp':
                    calculatorSettings.mining.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('mining_xp', 0, 'int'))+1;
                    document.querySelector('#mining-target-level').value = calculatorSettings.mining.targetLevel;
                    this.calculateMiningXP();
                    break;
                case 'brewing_xp':
                    calculatorSettings.brewing.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('brewing_xp', 0, 'int'))+1;
                    document.querySelector('#brewing-target-level').value = calculatorSettings.brewing.targetLevel;
                    this.calculateBrewingXP();
                    break;
                case 'farming_xp':
                    calculatorSettings.farming.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('farming_xp', 0, 'int'))+1;
                    document.querySelector('#farming-target-level').value = calculatorSettings.farming.targetLevel;
                    this.calculateFarmingXP();
                    break;
                default:
                    break;
            }
            if (key.includes('skilling')) this.checkForSkillingOutfits();
        }

        checkForSkillingOutfits(){
            ['gloves', 'boots', 'pants', 'shirt'].forEach(item=>{
                ['crafting', 'mining', 'brewing', 'farming'].forEach(skill=>{
                    let hasItem = IdlePixelPlus.getVarOrDefault(`${skill}_skilling_${item}`, 0, 'int')
                    if (hasItem && !calculatorSettings[skill].outfit[item]){
                        calculatorSettings[skill].outfit[item] = true;
                        calculatorSettings[skill].outfit.bonus += 0.01;
                        if (calculatorSettings[skill].outfit.gloves &&
                            calculatorSettings[skill].outfit.shirt &&
                            calculatorSettings[skill].outfit.pants &&
                            calculatorSettings[skill].outfit.boots){
                            calculatorSettings[skill].fullOutfit = true;
                            calculatorSettings[skill].outfit.bonus = 0.05;
                        }
                        this.updateOutfitBonus();
                    }
                })
            })
        }

        updateOutfitBonus(){
            //document.querySelector('#brewing-outfit-bonus').textContent = calculatorSettings.brewing.fullOutfit ? '5%' : calculatorSettings.brewing.outfit.bonus + '%';
            document.querySelector('#brewing-outfit-bonus').textContent = `${calculatorSettings.brewing.outfit.bonus * 100}%`
            document.querySelector('#farming-outfit-bonus').textContent = `${calculatorSettings.farming.outfit.bonus * 100}%`
            this.calculateCraftingXP();
            this.calculateMiningXP();
            this.calculateBrewingXP();
            this.calculateFarmingXP();
        }
    }

    const plugin = new XpCalculatorPlugin();
    IdlePixelPlus.registerPlugin(plugin); // register the plugin

})();