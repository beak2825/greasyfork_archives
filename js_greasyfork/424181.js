// ==UserScript==
// @name         IMCraftingSum
// @namespace    http://tamper.net/
// @version      0.10
// @description  Estimates inventory crafting xp
// @author       Holychikenz
// @match        *://*.idlescape.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424181/IMCraftingSum.user.js
// @updateURL https://update.greasyfork.org/scripts/424181/IMCraftingSum.meta.js
// ==/UserScript==

function printCraftingXP() {
    // This is meant to give an idea of the exact crafting xp in inventory, this includes
    // the discrete nature of crafting (with the enchant) as resources spent smithing and cooking.
    // At the end intuition food and dono buff are assumed.
    // Verbose option for debugging, can be disabled, though it just prints to console.
    let verbose = false; // Set to true to see some extra print outs in the console
    function vp(text){
        if( verbose ) console.log(text);
    }
    // Internal Helper Functions for styling the message
    function sxp(xp, p=1, w=100){
        return `<b style="color:#66ccff;display:inline-block;width:${w}px;">${dnum(xp,p)} xp</b>`
    }
    function sgold(gold, p=1, w=100){
        return `<b style="color:#ffc107;display:inline-block;width:${w}px;">${dnum(gold,p)} gp</b>`
    }
    function lbar(key){
        return `<img src="/images/smithing/${key.toLowerCase()}_bar.png" style="display:inline;height:1em;">`
    }
    function lgem(key){
        return `<img src="/images/mining/${key.toLowerCase().replace(/ /g,"_")}.png" style="display:inline;height:1em;">`
    }
    let spn = `<span style="display: inline-block; width: 300px;">`
    // Default enchants assumed here, edit these if they do not apply
    let efficiency = 8; // gloves: Applies to smithing and Cooking
    let crafting = 6;
    let maplesInsteadOfPyreYews = false;

    let eMod = 1+0.01*efficiency;
    let cMod = 1-0.02*crafting;
    let buff = 1.3; // donation + intuition
    // Get the player inventory (or stash if that's open instead)
    var inventory = getInventory();
    var totalXP = 0;
    var totalHeat = 0; // Required to complete operations
    let msg = "<hr><h5>Crafting XP Report</h5><hr>";
    // Fert and branches, move above, also for ore need to save some logs
    // Lets assume sand is always the missing part, so lets just count sand
    // ******************************
    // Misc (Fert, Branch, Oil, Sage)
    // ******************************
    msg += `<div style="margin-left: 20px;">`;
    let fertCount = Math.floor(get(inventory, "Sand", 0) / 10 / cMod );
    let fertXP = fertCount * 20 * buff;
    msg += `${spn}${fertCount} fertilizer </span>${sxp(fertXP)}<br/>`;
    totalXP += fertXP;
    let branchCraft = Math.floor(get(inventory, "Branch", 0) / 20 / cMod )
    let branchXP = branchCraft * 10 * buff
    msg += `${spn}${branchCraft} branches </span>${sxp(branchXP)} <br/>`;
    vp(`Starting with ${inventory['Log']} logs`)
    // If no logs, set logs to zero
    inventory["Log"] = "Log" in inventory ? inventory["Log"] : 0;
    inventory["Oak Log"] = "Oak Log" in inventory ? inventory["Oak Log"] : 0;
    inventory["Willow Log"] = "Willow Log" in inventory ? inventory["Willow Log"] : 0;
    inventory["Maple Log"] = "Maple Log" in inventory ? inventory["Maple Log"] : 0;
    inventory["Yew Log"] = "Yew Log" in inventory ? inventory["Yew Log"] : 0;
    inventory['Log'] += branchCraft;
    vp(`Crafting ${branchCraft} branches brings us to ${inventory['Log']} logs`)
    let sageCount = Math.floor(get(inventory, "Sageberry Bush Seed", 0) / cMod)
    let sageXP = sageCount * 5000 * buff;
    msg += `${spn}${sageCount} sage </span>${sxp(sageXP)}<br/>`;
    totalXP += sageXP;
    // **********************
    // Smithing Tools
    // **********************
    let barxp = 0;
    let barcost = 0;
    // Save Styg and Rune, sell the rest, lets also account for used logs
    // Btw we assume pyro ring but no food (heat is infinite for IM race through pyres)
    let bardata = {
        "Bronze":     {"Ores":1,  "Heat": 1,   "XP": 130,    "gp":800,    "craftcount":40,  "logtype":"Log",        "logs":20},
        "Iron":       {"Ores":3,  "Heat": 3,   "XP": 480,    "gp":6000,   "craftcount":75,  "logtype":"Oak Log",    "logs":35},
        "Mithril":    {"Ores":5,  "Heat": 25,  "XP": 2893,   "gp":52000,  "craftcount":130, "logtype":"Willow Log", "logs":65},
        "Adamantite": {"Ores":10, "Heat": 50,  "XP": 8600,   "gp":480000, "craftcount":200, "logtype":"Maple Log",  "logs":100},
        "Runite":     {"Ores":15, "Heat": 100, "XP": 22013,  "gp":7200*0, "craftcount":270, "logtype":"Yew Log",    "logs":55},
        "Stygian":    {"Ores":25, "Heat": 250, "XP": 63000,  "gp":9600*0, "craftcount":350, "logtype":"Ichor",      "logs":175}
    }
    let daggerdata = {
        "Bronze":     {"Ores":1,  "Heat": 1,   "XP": 58,     "gp":400,    "craftcount":20,  "logtype":"Log",        "logs":5},
        "Iron":       {"Ores":3,  "Heat": 3,   "XP": 280,    "gp":4000,   "craftcount":50,  "logtype":"Oak Log",    "logs":10},
        "Mithril":    {"Ores":5,  "Heat": 25,  "XP": 2113,   "gp":52000,  "craftcount":100, "logtype":"Willow Log", "logs":25},
        "Adamantite": {"Ores":10, "Heat": 50,  "XP": 6580,   "gp":480000, "craftcount":160, "logtype":"Maple Log",  "logs":30},
        "Runite":     {"Ores":15, "Heat": 100, "XP": 18338,  "gp":7200*0, "craftcount":225, "logtype":"Yew Log",    "logs":45},
        "Stygian":    {"Ores":25, "Heat": 250, "XP": 50400,  "gp":9600*0, "craftcount":300, "logtype":"Ichor",      "logs":60}
    }
    msg += `</div><h6 style='margin-top:4px;margin-bottom:0px;'>Tools [Dagger, Hoe]</h6><div style="margin-left: 20px;">`;
    for( let key in bardata ){
        // First smelt the bars (subtracting needed heat), then craft and report remainders
        let value = bardata[key];
        let current_bars = get(inventory, `${key} Bar`, 0);
        let current_ore = get(inventory, `${key} Ore`, 0);
        current_ore = (key == "Bronze") ? Math.min( get(inventory, "Copper Ore", 0), get(inventory, "Tin Ore", 0) ) : current_ore;
        let new_bars = Math.floor(current_ore / value.Ores);
        let req_heat = new_bars * value.Heat;
        new_bars = Math.floor(new_bars * eMod)
        vp(`  Smith ${current_ore} ${key} into ${new_bars} bars using ${req_heat} heat`)
        // Split between daggers and hoes efficiently
        let dagger = daggerdata[key];
        let daggerCost = Math.ceil(dagger.craftcount*cMod);
        let hoeCost = Math.ceil(value.craftcount*cMod);
        let dagHoe = daggersAndHoes(new_bars+current_bars, daggerCost, hoeCost);
        let nDaggers = dagHoe[0];
        let nHoes = dagHoe[1];
        let barCost = nDaggers*daggerCost + nHoes*hoeCost;
        let woodCost = nDaggers*Math.ceil(dagger.logs*cMod) + nHoes*Math.ceil(value.logs*cMod);

        let bar_gold = nDaggers*dagger.gp + nHoes*value.gp
        // Do we have enough logs?
        //let logs_used = realLogCost * craftAttempts;
        if( woodCost > get(inventory, value.logtype, 0) ){
           msg += `<b style="color: red;">!! Need more ${value.logtype} for ${key} tools ${woodCost} > ${get(inventory, value.logtype, 0)} !!</b><br>`;
        }
        inventory[value.logtype] = inventory[value.logtype] - woodCost

        let leftOvers = (new_bars + current_bars) - barCost// realCraftCost*craftAttempts
        let dagHoeXP = nDaggers*dagger.XP*buff + nHoes*value.XP*buff
        //msg += `${spn}[${nDaggers},${nHoes}] ${key} tools (${leftOvers} excess)</span>${sxp(dagHoeXP)}${sgold(bar_gold)}<br/>`
        msg += `${spn}${lbar(key)} ${nDaggers} daggers, and ${nHoes} hoes (${leftOvers} excess)</span>${sxp(dagHoeXP)}${sgold(bar_gold)}<br/>`
        totalXP += dagHoeXP;
        barxp += dagHoeXP;
        barcost += bar_gold;
        totalHeat += req_heat;
    }
    vp(`Used ${totalHeat} heat for smithing (mith and up)`)
    // **********************
    // Jewelry + Gold Bars
    // **********************
    // Loop through gems to count max rings and compare with rings from gold
    msg += `</div><h6 style='margin-top:4px;margin-bottom:0px;'>Jewelry</h6><div style="margin-left: 20px;">`;
    let gemdata = {
        "Black Opal": {"XP": 6600, "gp":1500000},
        "Diamond": {"XP": 5600, "gp":300000},
        "Ruby": {"XP": 4600, "gp":200000},
        "Emerald": {"XP": 3600, "gp":140000},
        "Sapphire": {"XP": 2600, "gp":120000}
    }
    // How much gold do we have actually??
    let jew_gold = 0;
    let gold_bar_count = get(inventory, "Gold Bar", 0);
    let gold_ore = get(inventory, "Gold Ore", 0);
    let new_gold_bars = Math.floor( gold_ore / 10 );
    let gold_heat = new_gold_bars * 10;
    new_gold_bars = Math.floor( new_gold_bars * eMod );
    totalHeat += gold_heat;
    vp(`Up to ${totalHeat} heat used after gold`)
    //msg += `Smith ${new_gold_bars} Gold bars using ${gold_heat} heat<br>`;
    gold_bar_count += new_gold_bars;
    // let nrings = Math.floor( gold_bar_count / 150 / cMod ); // corrected by Kugan
    // With infinite gems, what is the maximum ring outcome?
    let finalRealRings = Math.floor( gold_bar_count / (50*cMod + 100*cMod**2) );
    let craftedRings = Math.ceil( finalRealRings * cMod )
    msg += `<i>Prepare ${craftedRings} gold rings to make ${finalRealRings} jewelry</i><br/>`
    // Gems time
    for( let key in gemdata ){
        let value = gemdata[key];
        let ngems = get(inventory, key, 0);
        if( craftedRings >= ngems ){
            let realGems = Math.floor( ngems / cMod );
            let gemxp = value.XP * realGems*buff;
            jew_gold += value.gp * realGems;
            totalXP += gemxp;
            craftedRings -= ngems;
            //msg += `${spn}${realGems} ${key} rings</span>${sxp(gemxp)}${sgold(value.gp*realGems)}<br>`
            msg += `${spn}${lgem(key)} ${realGems} rings</span>${sxp(gemxp)}${sgold(value.gp*realGems)}<br>`
        } else {
            let realGems = Math.floor( craftedRings / cMod );
            let gemxp = value.XP * realGems*buff;
            jew_gold += value.gp * realGems;
            totalXP += gemxp;
            msg += `${spn}${lgem(key)} ${realGems} rings</span>${sxp(gemxp)}${sgold(value.gp*realGems)}<br>`
            craftedRings = 0;
        }
    }
    msg += `</div><h6 style='margin-top:4px;margin-bottom:0px;'>Oils</h6><div style="margin-left: 20px;">`;
    // Lets make some pyres if we have fish oil
    let fishdata = {
        "Raw Shrimp": {"Heat": 5, "Oil": 0.05},
        "Raw Anchovy": {"Heat": 5, "Oil": 0.05},
        "Raw Trout": {"Heat": 10, "Oil": 0.1},
        "Raw Salmon": {"Heat": 10, "Oil": 0.1},
        "Raw Lobster": {"Heat": 15, "Oil": 0.15},
        "Raw Tuna": {"Heat": 15, "Oil": 0.15},
        "Raw Shark": {"Heat": 20, "Oil": 0.20}
    }
    let fish_oil = get(inventory, "Fish Oil", 0);
    for( let key in fishdata ){
        let value = fishdata[key];
        let current_fish = get(inventory, key, 0);
        let new_oil = Math.floor(value.Oil * current_fish * eMod);
        let req_heat = value.Heat * new_oil / value.Oil;
        totalHeat += req_heat;
        fish_oil += new_oil;
        //msg += `Cook ${key} for ${new_oil} oil, using ${req_heat} heat<br>`;
    }
    vp(`now at ${totalHeat} heat from cooking fish`)
    // Logs
    let logs = get(inventory, "Log", 0);
    let oaks = get(inventory, "Oak Log", 0);
    let willows = get(inventory, "Willow Log", 0);
    let maples = get(inventory, "Maple Log", 0);
    let yews = get(inventory, "Yew Log", 0);
    vp(`new log count is ${logs}`)
    // Do we have enough yews?
    if( maplesInsteadOfPyreYews ){
        if( maples/10 < fish_oil/4 ){
            msg += `<b style="color: red;">!! Need ${ fish_oil*4 - 10*maples } more Maple Logs for Pyres !!</b><br>`;
        } else {
            let pyreCount = Math.floor( fish_oil / 4 / cMod );
            maples -= Math.ceil( pyreCount * 10 * cMod );
            totalXP += pyreCount * 200 * buff
            let burnHeat = 800 * pyreCount
            totalHeat -= burnHeat
            //msg += `Craft ${pyreCount} pyre yew logs gaining ${burnHeat} heat<br>`
            msg += `${spn}${pyreCount} pyre maples</span>${sxp(pyreCount*200*buff)}</br>`
        }
    } else {
        if( yews < 2*fish_oil ){
            msg += `<b style="color: red;">!! Need ${ fish_oil*2 - yews } more Yew Logs for Pyres !!</b><br>`;
        } else {
            let pyreCount = Math.floor( fish_oil / 5 / cMod );
            yews -= Math.ceil( pyreCount * 10 * cMod );
            totalXP += pyreCount * 250 * buff
            let burnHeat = 3000 * pyreCount
            totalHeat -= burnHeat
            //msg += `Craft ${pyreCount} pyre yew logs gaining ${burnHeat} heat<br>`
            msg += `${spn}${pyreCount} pyre yews</span>${sxp(pyreCount*250*buff)}</br>`
        }
    }
    vp(`burning pyre brings the heat required to ${totalHeat}`)
    msg += `</div><h6 style='margin-top:4px;margin-bottom:0px;'>Ashes</h6><div style="margin-left: 20px;">`;
    // Finally ash some logs, takes 100 heat per try
    let inventory_heat = get(inventory, "Heat", 0) - totalHeat;
    //inventory_heat = 100e6 - totalHeat; // Infinite heat can help with pyre estimates
    vp(`Inventory - required heat: ${inventory_heat}`)
    // Check if we even have enough Yew logs to pay our heat debt
    if( inventory_heat + yews*200 <= 0 ){
        let k = Math.ceil( Math.abs(inventory_heat + yews*100)/100 )
        msg += `<b style="color: red;">!! Need ${ k } more Yew Logs to pay heat debt !!</b><br>`;
    }

    let ashxp = 0;
    let logAsh = Math.floor(logs / 30 / cMod);
    let oakAsh = Math.floor(oaks / 25 / cMod);
    let willowAsh = Math.floor(willows / 20 / cMod);
    let mapleAsh = Math.floor(maples / 15 / cMod);
    let currentAsh = logAsh + oakAsh + willowAsh + mapleAsh
    let ashHeat = Math.ceil( currentAsh * 100 * cMod )
    inventory_heat -= ashHeat
    vp(`Burn ${ashHeat} heat for ashing up to maple, bring us to ${inventory_heat}`)
    //msg += `Craft ${currentAsh} ash (up to Maple) using ${ashHeat} heat<br>`
    let burntYews = 0
    if( inventory_heat < 0 ){
        let burnYews = Math.ceil(Math.abs(inventory_heat/100))
        if( burnYews > yews ){
            msg += `<b style="color: red;">!! Need ${ burnYews - yews } more Yew Logs to pay heat debt !!</b><br>`;
        } else {
            //msg += `>> Need to quickly burn ${burnYews} yew logs for heat<br>`
        }
        yews -= burnYews;
        vp(`Need to burn ${burnYews} to keep up`)
        inventory_heat += burnYews*200;
    }
    // Yews are tricky, it takes 10.5 per to pay the heat, unless we ALREADY have enough heat, then just 10 per, so start with those
    let remainingAshHeat = Math.floor(inventory_heat / 100 / cMod)
    let firstYewAsh = Math.min(remainingAshHeat, Math.floor(yews/10/cMod))
    vp(`with ${remainingAshHeat} ashes, we can make ${firstYewAsh}`)
    // Remaining yews
    if( yews > 0 ){
        let yewAsh = Math.floor(yews/10 / cMod)
        //burntYews += Math.ceil(yewAsh / 2 * cMod)
        //msg += `Craft ${yewAsh} ash from Yews, burning ${burntYew} yew logs for heat<br>`
        currentAsh += yewAsh
    }

    ashxp = currentAsh * 50 * buff;
    totalXP += ashxp;
    msg += `${spn}${currentAsh} ashes </span>${sxp(ashxp)}<br>`
    msg += `</div>`
    msg += `<hr><div style="margin-left:20px;">${spn}<b>New Resources</b></span>${sxp( totalXP, 3)}${sgold(jew_gold + barcost, 3)}</div>`
    // Include current xp and gold
    let currentCraftXP = parseFloat( getSkills()["Crafting"] );
    let currentGold = getGold();
    msg += `<div style="margin-left:20px;">${spn}<b>Total</b></span>${sxp( totalXP+currentCraftXP, 3)}${sgold(currentGold + jew_gold + barcost, 3)}</div><hr>`
    let d = document.createElement("div");
    d.className = "chat-message"
    //d.innerHTML = `>> Crafting XP: ${totalXP.toFixed(0)}`;
    d.innerHTML = msg;
    document.getElementsByClassName("css-y1c0xs")[1].append(d);
}

// Maybe we could do something real quick here with cooking as well
function printCookingXP(IMRace=true){
    // Two ways to do this:
    // 1. Calculate all possible cooking (skip important veggies though)
    // 2. Optimize for the IM race.
    // Could optimize a lot more if we knew the burn chance formula
    // IMPORTANT: Due to the nature of the cooking time formula, the optimal cook weight is 14.38
    // so recipes after ~15 start to get penalized. Time per ingredient is stable between 10-20, below
    // 10 it goes up dramatically, so avoid that region.
    // RECIPES (sweet spot is 70 or 80 with salt)
    // 1. 4 ichor (salt required)
    // 2. 4 ash 1 ichor
    // 3. 4 tuna + (salmon | trout | anchovy | shrimp)
    // 4. 2 tuna 2 shark
    // 5. 1 banana 4 apple
}

function CookChance(xp, elvl, clvl=0){
    return Math.max(0, Math.min(1, (100 - 3*(xp/5)**(5/2)/elvl + 4*clvl)/100));
}

function CookTime(size){
    return 4**(0.95 + 0.05*size);
}

function daggersAndHoes(bars, dag, hoe) {
    // Assumption, Hoes are best, but only just, so we try for hoes
    // before daggers, but favor minimizing remaining bars over all else.
    let maxBig = Math.floor(bars/hoe);
    let hoeNots = 0
    let left = 1e6
    for( let s=0; s < maxBig+1; s++ ){
        let leftovers = bars - hoe*(maxBig - s);
        let final = leftovers%dag
        if( final < left ){
            left = final
            hoeNots = s
        }
    }
    let hoes = maxBig - hoeNots
    let daggers = Math.floor((bars - hoes*hoe)/dag)
    return [daggers, hoes]
}

// Helper functions to grab inventory
function getReactInstance(dom) {
    for( let key in dom ) {
        if( key.startsWith("__reactInternalInstance$") ) {
            return dom[key];
        }
    }
    return null;
}

function getReactHandler(dom) {
    for( let key in dom ){
        if( key.startsWith("__react") ){
            return dom[key];
        }
    }
    return null;
}

function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

function getSkills(){
    let skills = ["miningHeader", "foragingHeader", "fishingHeader", "farmingHeader", "enchantingHeader",
                  "runecraftingHeader", "smithingHeader", "craftingHeader", "cookingHeader", "constitutionHeader",
                  "attackHeader", "strengthHeader", "defenseHeader"];
    let skdict = {};

    try {
        for(let sk=0; sk<skills.length; sk++){
            let skill = document.getElementById(skills[sk]);
            let spans = skill.getElementsByTagName("span");
            let name = spans[0].getElementsByTagName("b")[0].innerHTML;
            let xp = spans[2].innerHTML.replace(/\D/g,'');
            skdict[name] = xp;
        }
    } catch(err) {}
    return skdict;
}

function getInventory() {
    let inventory_set = document.getElementsByClassName("inventory-container-all-items")[0];
    let dict = {};
    try{
        let inventory = inventory_set.getElementsByClassName("item");

        for(let i=0; i<inventory.length; i++) {
            let itemdiv = inventory[i];
            try {
                let k = getReactInstance(itemdiv);
                let item = k.return.pendingProps.item;
                let quant = k.return.pendingProps.quantity;
                dict[item.name] = quant;
            }
            catch(err){}
        }
        dict = sortObjectByKeys(dict);
        // Add heat and gold
        dict.Gold = getGold();
        dict.Heat = getHeat();
        let xp = getSkills();
        for(let k in xp) {
            dict[k] = xp[k];
        }
        dict.time = Date.now();
    }
    catch(err){}
    return dict;
}

function dnum(num, p) {
    let snum = ""
    if( num > 1000000 ){
        snum = `${(num/1e6).toFixed(p)} M`
    }
    else if( num > 1000 ){
        snum = `${(num/1e3).toFixed(p)} k`
    }
    else{
        snum = `${num}`
    }
    return snum
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function getGold(){
    try {
        return parseInt(document.getElementById("gold-tooltip").getElementsByTagName("span")[0].innerHTML.replace(/,/g, "").replace(/\./g, ""));
    }
    catch(err){
        return 0;
    }
}

function getHeat(){
    try{
        return parseInt(document.getElementById("heat-tooltip").getElementsByTagName("span")[0].innerHTML.replace(/,/g, "").replace(/\./g, ""));
    }
    catch(err){
        return 0;
    }
}

function sortObjectByKeys(o){
    return Object.keys(o).sort().reduce((r,k) => (r[k] = o[k], r), {});
}


// Modal Settings
(function() {
    var modal_css = document.createElement("style");

    modal_css.innerHTML =
`
.ps_settings {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.ps_settings_content {
  background-color: rgba(25, 66, 100, 0.90);
  border-radius: 5px;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}
.close_ps_settings {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}
.close_ps_settings:hover, close_ps_settings:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
.ps_button {
	background-color:transparent;
	border-radius:4px;
	border:2px solid #7f7f7f;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	padding:7px 25px;
	text-decoration:none;
	text-shadow:0px 1px 0px #e1e2ed;
}
.ps_button:hover {
	background-color:rgba(255,255,255,0);
}
.ps_button:active {
	position:relative;
	top:1px;
}
`

    document.body.appendChild(modal_css);

    // Crafting button
    var craft_button = document.createElement("BUTTON");
    craft_button.id = "craftingbtn";
    craft_button.setAttribute("style", "position: absolute; top: 5px; left: 20%;");
    craft_button.zIndex = "7000";
    craft_button.className = "ps_button";
    craft_button.innerHTML = "CraftXP";
    craft_button.onclick = () => printCraftingXP();
    document.body.appendChild(craft_button);
})();