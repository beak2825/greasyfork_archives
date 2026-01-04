// ==UserScript==
// @name         Mining and Crafting XP Calculator
// @namespace    namespaceuniquetome
// @version      1.3
// @description  lol
// @author       shtos
// @license      MIT
// @match        *://idle-pixel.com/login/play*
// @grant        none
// @require https://greasyfork.org/scripts/441206-idlepixel/code/IdlePixel+.js
// @downloadURL https://update.greasyfork.org/scripts/451293/Mining%20and%20Crafting%20XP%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/451293/Mining%20and%20Crafting%20XP%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let loaded = false;

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
        "bone_potion": 1550,
        "promethium_potion": 2000,
        "super_rare_monster_potion": 6000,
        "ultra_stardust_potion": 12900
    }
    const INGREDIENT_XP_MAP = {
        "dotted_green_leaf": 25,
        "green_leaf": 100,
        "lime_leaf":250,
        "gold_leaf":800,
        "red_mushroom": 5,
        "strange_leaf":500,
        "moonstone": 249,
        "rocket_fuel": 250,
        "seaweed":0,
        "bones":0,
        "promethium":0,
        "titanium":0
    }

    const BARS_XP_MAP = {
        "bronze": 5,
        "iron": 25,
        "silver": 50,
        "gold": 100,
        "promethium": 500
    }
    const ORES_XP_MAP = {
        "stone": 0.1,
        "copper": 1,
        "iron": 5,
        "silver": 10,
        "gold": 20,
        "promethium":100,
    }
    let potionArray = [];

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
        shared: {
            donor: false,
        }
    }


    class XpCalculatorPlugin extends IdlePixelPlusPlugin {
        constructor() {
            super("xpcalculator", { // unique plugin id, "sample"
                about: { // optional, but highly recommended
                    name: GM_info.script.name,
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
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/bronze_bar.png"> <span id="crafting-calculator-bronze"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/iron_bar.png"> <span id="crafting-calculator-iron"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/silver_bar.png"> <span id="crafting-calculator-silver"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/gold_bar.png"> <span id="crafting-calculator-gold"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/promethium_bar.png"> <span id="crafting-calculator-promethium"> 0</span> </span>
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
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/stone.png"> <span id="mining-calculator-stone"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/copper.png"> <span id="mining-calculator-copper"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/iron.png"> <span id="mining-calculator-iron"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/silver.png"> <span id="mining-calculator-silver"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/gold.png"> <span id="mining-calculator-gold"> 0</span> </span>
        <span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/promethium.png"> <span id="mining-calculator-promethium"> 0</span> </span>
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

            Array.from(document.querySelectorAll("#brewing-table img[src*=potion]")).forEach((potion)=>potionArray.push(potion.title))
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
                potionHTML += `<span><img style="height: 32px; width: 32px;" src="https://d1xsc8x7nc5q8t.cloudfront.net/images/${potion}.png"> <span id="brewing-calculator-${potion}"> 0</span> </span>`
            })
            document.querySelector('#brewing-potions-required').innerHTML = potionHTML;
           document.querySelector('#brewing-visibility-button').onclick = ()=>{this.handleVisibility('brewing')};
           document.querySelector('#brewing-target-level').onchange = (event)=>{this.calculatorSettingsChanged('brewing', 'targetLevel', event.target.value)};
           document.querySelector('#brewing-donor-perk-check').onchange = (event)=>{this.calculatorSettingsChanged('shared', 'donor', event.target.checked)};

           calculatorSettings.crafting.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('crafting_xp', 0, 'int'))+1;
           document.querySelector('#crafting-target-level').value = calculatorSettings.crafting.targetLevel;
           calculatorSettings.mining.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('mining_xp', 0, 'int'))+1;
           document.querySelector('#mining-target-level').value = calculatorSettings.mining.targetLevel;
           calculatorSettings.brewing.targetLevel = get_level(IdlePixelPlus.getVarOrDefault('brewing_xp', 0, 'int'))+1;
           document.querySelector('#brewing-target-level').value = calculatorSettings.brewing.targetLevel;

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


           this.calculateCraftingXP();
           this.calculateMiningXP();
           this.calculateBrewingXP();
           this.handleVisibility('mining');
           this.handleVisibility('crafting');
           this.handleVisibility('brewing');
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
            if (skill = 'shared'){
                calculatorSettings.shared[type] = value;
                this.calculateCraftingXP();
                this.calculateMiningXP();
                this.calculateBrewingXP();
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

        calculateBrewingXP(){

            let currentXp = IdlePixelPlus.getVarOrDefault('brewing_xp', 0, 'int');
            let requiredXp = get_xp_required(calculatorSettings.brewing.targetLevel);
            let hasDonorPerk = calculatorSettings.shared.donor ? 1.1 : 1;
            let bonusXp = hasDonorPerk + calculatorSettings.brewing.outfit.bonus;
            let deltaXp = requiredXp + 1 - currentXp
            document.querySelector('#brewing-xp-required').textContent = window.format_number(deltaXp);
            let potions = Object.keys(POTION_XP_MAP);
            potionArray.forEach(potion=>{
                let ingredients = Brewing.get_ingredients(potion);
                let xpPerPotion = 0;
                let maxCraftable = Number.MAX_SAFE_INTEGER;
                for (let i=0;i<ingredients.length;i+=2){
                    xpPerPotion += Math.floor((INGREDIENT_XP_MAP[ingredients[i]] * bonusXp) * parseInt(ingredients[i+1]));
                    let craftable = Math.floor(IdlePixelPlus.getVarOrDefault(ingredients[i], 0, 'int') / parseInt(ingredients[i+1]));
                    craftable < maxCraftable ? maxCraftable = craftable : null;
                }
                document.querySelector(`#brewing-calculator-${potion}`).textContent = window.format_number(Math.ceil(deltaXp / xpPerPotion)) + ` (${maxCraftable})`;
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
                default:
                    break;
            }
            if (key.includes('skilling')) this.checkForSkillingOutfits();
        }

        checkForSkillingOutfits(){
            ['gloves', 'boots', 'pants', 'shirt'].forEach(item=>{
                ['crafting', 'mining', 'brewing'].forEach(skill=>{
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
            this.calculateCraftingXP();
            this.calculateMiningXP();
            this.calculateBrewingXP();
        }
    }

    const plugin = new XpCalculatorPlugin();
    IdlePixelPlus.registerPlugin(plugin); // register the plugin

})();