// ==UserScript==
// @name         Folklore Forest Assistant
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  :okayge:
// @author       You
// @match        https://longtail-new.mousehuntgame.com/
// @grant        GM_info
// @run-at        document-end
// @include        http://mousehuntgame.com/*
// @include        https://mousehuntgame.com/*
// @include        http://www.mousehuntgame.com/*
// @include        https://www.mousehuntgame.com/*
// @include        http://apps.facebook.com/mousehunt/*
// @include        https://apps.facebook.com/mousehunt/*
// @include        http://hi5.com/friend/games/MouseHunt*
// @include        http://mousehunt.hi5.hitgrab.com/*
// @grant        unsafeWindow
// @grant        GM_info
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/448534/Folklore%20Forest%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/448534/Folklore%20Forest%20Assistant.meta.js
// ==/UserScript==
 
console.log('Folklore Forest Assistant Enabled')

//TRAP SETUPS [WEAPON,BASE,CHARM,CHEESE], available traps/bases/charms/cheese and their shorthands refer to the list below
//Foreword Farm
var ffPulloutMode = false //Set to true to cancel papyrus plants before they finish growing and replant immediately aka "Pullout Strategy"
var ffEmptySetup = ['SBT','PB','GILDED','ESB'] //Setup when no plants are planted
var ffMulchSetup = ['SBT','PB','GILDED','ESB'] //Setup when mulch plants are planted
var ffPapyrusSetup = ['SBT','PB','GILDED','MSC'] //Setup when papyrus plants are planted


//Prologue Pond
//Will travel you back to Foreword Farm if you run out of stormy and grubben
var ppOverride = false //If set to true will make pp completely manual
var targetLoot = "ink" //"penny" to farm penny, "ink" to farm ink
var pondCycleType = 3 //1 = don't use CC at all, 2 = cc for stormy only, 3 = cc everything
var pondLevel = 5 //Will decide optimal penny thresholds per cycle
var grubSetup = ['CSOS','PB','GILDED','GRUB'] //Setup to use with grubben
var stormySetup = ['CSOS','PB','RULPC','SCLAM'] //Setup to use with stormy


//Table of Contents
var autoCurdFarm = false //SET THIS TO FALSE IF YOU ARE DOING FD PUSH | Automatically does optimal 2D write and retreats if true, will not trigger if 2D bait quantity does not meet minimum threshold 
var curdCycleType = 4
/*Cycle types 
DISCLAIMER: 2D MINLUCK IS 81, THE 2D BAIT REQUIREMENTS ARE ASSUMING YOU CAN REACH 81 LUCK, IF YOU CANNOT, PREPARE A FEW ADDITIONAL PIECES JUST IN CASE
1 = Full CC rush epic, retreats once Epic book is reached, minimum 15 2D required
2 = Optimized CC epic, uses 5-6 CC depending on rng to guarantee Epic, minimum 25 2D required
3 = No CC, retreats once Novel is reached, minimum 16 2D required
4 = Full CC rush vol1, requires minimum 23 2D and 5 FD
*/

var travelToFF = true //Automatically travels to FF when not automatically writing another book
var cycle2DSetup = ['CTOT','PB','UAC','2D'] //Setup when 2D is armed during cycling
var cycleFDSetup = ['CTOT','SSDB','UPAC','FD'] //Setup when FD is armmed during cycling
var notWritingSetup = ['CTOT','PB','GILDED','ESB'] //Setup if travelOutAfterBook is false and not writing any book

/*CONDENSED CREATIVITY*/

//Foreword Farm
var ffFuelOverride = false //If set to true the script will not manage fuel for you while in FF, none of the other options will have any effect
var ffPulloutFuel = true //Fuel when using pullout strategy
var ffEmptyFuel = false //Fuel when no plants are planted
var ffMulchFuel = true //Fuel when mulch plants are planted
var ffPapyrusFuel = true //Fuel when papyrus platns are planted

//Prologue Pond
//Already settled above

//Table of Contents
var tocFuelOverride = false //If set to true the script will not manage fuel for you while in ToC, none of the other options will have any effect
var notWritingFuel = false //Fuel when not writing (why would you ever enable this :kekwhr:)


/*END OF SETTINGS*/

/*LIST OF TRAP COMPONENTS
Feel Free to add your own*/
var trap = {
    'CSOS': 3257, //Chrome Shark
    'SOS': 1515, //School of Sharks
    'QFT': 2843, //Queso Fount
    'SBT': 3087, //Slumbering Boulder
    'SST': 3088, //Sleeping Stone
    'GGT': 2845, //Gouging Geyserite
    'CTOT': 3421, //Chrome Thought Obliterator
    'TOT': 3083, //Thought Obliterator
    'TMT': 3084, //Thought Manipulator
    'ILT': 1918, //Infinite Labyrinth
}
 
var charm = {
    'RULPC': 2121, //Rift Ultimate Lucky Power
    'RUPC': 1651, //Rift Ultimate Power
    'RULC': 1650, //Rift Ultimate Luck
    'FULPC': 2524, //Festive Ultimate Lucky Power
    'UPC': 545, //Ultimate Power
    'FUPC': 1289, //Festive Ultimate Power
    'ULPC': 1920, //Ultimate Lucky Power
    'RC': 1692, //Rainbow
    'UAC': 1822, //Ultimate Ancient
    'BK': 1815, //Baitkeep
    'GILDED': 2174, //Gilded
    'ANC': 928, //Ancient
    'UACT': 1823, //Ultimate Attraction
    'UPAC': 2992, //Ultimate Party
}
 
var base = {
    'PB': 2904, //Prestige Base
    'SSDB': 3023, //Signature Series Denture Base
}
 
var bait = {
    'WC': 120, //White Cheddar (lmao finally got use)
    'GOUDA': 98, //狗大
    'SB': 114, //shabi
    'ESB': 1967, //empowered shabi
    'GRUB': 3460, //PP grubben 
    'CLAM': 3457, //PP clamembert 
    'SCLAM': 3462, //PP stormy clamembert
    '1D': 3459, //1st draft
    '2D': 3461, //2nd draft
    'FD':3458, //Final draft
    'MSC': 1426, //Magical String
}
var area = 0

const interval = setInterval(function() {
    if (user.environment_name == 'Foreword Farm') {
        area = 0
        ff()
    }
    else if (user.environment_name == 'Prologue Pond') {
        area = 1
        pp()
    }
    else if (user.environment_name == 'Table of Contents') {
        area = 2
        toc()
    }
  }, 30000);
 
function ff() {
    var seedCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[0].innerHTML.replace(/,/g,''))
    var mulchCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[1].innerHTML.replace(/,/g,''))
    var papyCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[2].innerHTML.replace(/,/g,''))
    var coinCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[3].innerHTML.replace(/,/g,''))
    var plots = user.quests.QuestForewordFarm.plots
    //Harvesting Logic
    if (user.quests.QuestForewordFarm.harvest_bin.can_claim) {
        console.log("Harvesting...")
        document.getElementsByClassName("forewordFarmView-harvestBin-claimButton mousehuntTooltipParent")[0].click()
        setTimeout(()=> {
            document.getElementsByClassName("folkloreForestRegionView-dialog-continueButton")[0].click()
        },3000)
        return
    }
    //Checking for 3rd plot unlocked
    if (user.quests.QuestForewordFarm.plots[1].is_locked || user.quests.QuestForewordFarm.plots[2].is_locked) {
        plant_limited()
    }
    //Checking for all plots empty
    else if (!plots[0].is_growing && !plots[1].is_growing && !plots[2].is_growing) {
        //Checking for enough seeds
        if (seedCount > 29) {
            //Plant 3 papyrus plants
            if (mulchCount > 59) {
                plant("p")
            }
            //Plant 3 mulch plants
            else {
                plant("m")
            }
            return
        }
    }
    if (!user.quests.QuestForewordFarm.plots[2].is_locked && ffPulloutMode) {
        dontFinish()
        return
    }
    //Changing setup
    if (user.quests.QuestForewordFarm.plots[0].plant.type == 'legendary_magic_farm_plant') {
        cctoggle(ffPapyrusFuel)
        setupChange(ffPapyrusSetup)
    }
    else if (user.quests.QuestForewordFarm.plots[0].plant.type == 'ordinary_magic_farm_plant') {
        cctoggle(ffMulchFuel)
        setupChange(ffMulchSetup)
    }
    else {
        cctoggle(ffEmptyFuel)
        setupChange(ffEmptySetup)
    }
}

function pp() {
    if (ppOverride) {
        return
    }
    var lim = 40
    if (pondLevel == 5) {
        lim = 22
    }
    else if (pondLevel == 6) {
        lim = 14
    }
    var grubCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[4].innerHTML.replace(/,/g,''))
    var clamCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[5].innerHTML.replace(/,/g,''))
    var inkCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[6].innerHTML.replace(/,/g,''))
    var pennyCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[7].innerHTML.replace(/,/g,''))
    var chumCount = parseInt(document.getElementsByClassName("prologuePondView-chum-quantity quantity")[0].innerHTML.replace(/,/g,''))
    var grubbenCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[0].innerHTML.replace(/,/g,''))
    var stormyCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[2].innerHTML.replace(/,/g,''))
    var meCount = 0
    if (isInteger(user.enviroment_atts.items.magic_essence_craft_item.quantity)) {
        meCount = user.enviroment_atts.items.magic_essence_craft_item.quantity
    }
    else {
        meCount = parseInt(user.enviroment_atts.items.magic_essence_craft_item.quantity.replace(/,/g,''))
    }
    //Running out of chum
    if (chumCount < 3) {
        craftChum(1)
    }
    //Stormy > 0
    else if (stormyCount > 0) {
        setupChange(stormySetup)
        if (pondCycleType > 1) {
            cctoggle(true)
        } 
        else {
            cctoggle(false)
        }
        if (pennyCount < (lim*13) || targetLoot == "penny") {
            chumToggle(false)
        }
        else {
            chumToggle(true)
        }
    }
    //Can craft another batch of stormy
    else if (clamCount >= (lim/2*10) && meCount >= (lim/2*11) && pennyCount > (lim*10)) {
        craftChum(lim)
    }
    else if (chumCount >= (lim*10)) {
        craftStormy(lim)
    }
    //Grubben > 0
    else if (grubbenCount > 0) {
        setupChange(grubSetup)
        chumToggle(true)
        if (pondCycleType == 3) {
            cctoggle(true)
        }
        else {
            cctoggle(false)
        }
    }
    //Travel Back to FF
    else {
        travelTo("FF")
    }
}

function toc() {
    var curdCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[8].innerHTML.replace(/,/g,''))
    var gpCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[9].innerHTML.replace(/,/g,''))
    var wordCount = parseInt(user.enviroment_atts.current_book.word_count)
    //Can claim
    if (user.enviroment_atts.can_claim) {
        claimBook()
    }
    //Writing
    else if (user.quests.QuestTableOfContents.is_writing) {
        if (autoCurdFarm) {
            //Full CC Rush Epic
            if (curdCycleType == 1) { 
                cctoggle(true)
                setupChange(cycle2DSetup)
                if (wordCount > 1999) {
                    claimBook()
                }
            }
            //Optimized CC Epic
            else if (curdCycleType == 2) {
                setupChange(cycle2DSetup)
                if (wordCount > 1999) {
                    claimBook()
                }
                else if (user.enviroment_atts.current_book.hunts_remaining > 20) {
                    cctoggle(true)
                }
                else if (user.enviroment_atts.current_book.hunts_remaining < 21) {
                    if (user.enviroment_atts.current_book.hunts_remaining == 2 && user.enviroment_atts.next_book.words_required > 130) {
                        cctoggle(true)
                    }
                    else {
                        cctoggle(false)
                    }
                }
            }
            //No CC Novel
            else if (curdCycleType == 3) {
                setupChange(cycle2DSetup) 
                cctoggle(false)
                if (wordCount > 999) {
                    claimBook()
                }
            }
            //FD+2D Vol1
            else if (curdCycleType == 4) {
                cctoggle(true)
                if (wordCount > 3999) {
                    claimBook()
                }
                else if (Math.ceil((4000-wordCount)/135) > user.enviroment_atts.current_book.hunts_remaining) {
                    setupChange(cycleFDSetup)
                }
                else {
                    setupChange(cycle2DSetup)
                }
            }
        }
    }
    //New Book or Travel or Not Writing
    else {
        var two = parseInt(user.enviroment_atts.items.second_draft_derby_cheese.quantity.replace(/,/g,''))
        var final = parseInt(user.enviroment_atts.items.final_draft_derby_cheese.quantity.replace(/,/g,''))
        //New Book
        if (autoCurdFarm) {
            //Meets cycle requirements, start new book and ends function
            if ((curdCycleType == 1 && two > 14) || (curdCycleType == 2 && two > 24) || (curdCycleType == 3 && two > 15) || (curdCycleType == 4 && two > 22 && final > 4)) {
                newBook()
                return
            }
        }
        if (travelToFF) {
            travelTo("FF")
        }
        else {
            cctoggle(notWritingFuel)
            setupChange(notWritingSetup)
        }
    }
}

//FF Helper Functions
function plant(plantType) {
    var arg = 0
    //Opens planting GUI
    document.getElementsByClassName("forewordFarmPlotView-plot-plantButton")[0].click()
    if (plantType == "p") {
        arg = document.getElementsByClassName("forewordFarmPlantDialogView")[0].querySelector('[data-type="legendary_magic_farm_plant"]')
    }
    else if (plantType == "m") {
        arg = document.getElementsByClassName("forewordFarmPlantDialogView")[0].querySelector('[data-type="ordinary_magic_farm_plant"]')
    }
    //Plot 1
    setTimeout(() => {
        console.log("Planting in plot 1...")
        arg.click()
    }, 2000);
    //Plot 2
    setTimeout(() => {
        console.log("Planting in plot 2...")
        arg.click()
    }, 4000);
    //Plot 3
    setTimeout(() => {
        console.log("Planting in plot 3...")
        arg.click()
    }, 6000);
    //Continue
    setTimeout(() => {
        document.getElementsByClassName("folkloreForestRegionView-dialog-continueButton")[0].click()
        ff()
    }, 8000);
}

function plant_limited() {
    var seedCount = user.quests.QuestForewordFarm.items.papyrus_seed_stat_item.quantity
    var plot = 2
    //Do nothing if seed < 10
    if (seedCount < 10) {
        return
    }
    //Check if plot 1 is empty
    if (!user.quests.QuestForewordFarm.plots[0].is_growing) {
        plot = 0
    }
    //Check if plot 2 is unlocked and empty
    else if (!user.quests.QuestForewordFarm.plots[1].is_locked && !user.quests.QuestForewordFarm.plots[1].is_growing) {
        plot = 1
    }
    //Planting logic
    if (plot != 2) {
        console.log("Planting a Mythical Mulch Plant in plot " + (plot+1))
        document.getElementsByClassName("forewordFarmPlotView-plot-plantButton")[plot].click()
        setTimeout(() => {
            document.getElementsByClassName("forewordFarmPlantDialogView")[0].querySelector('[data-type="ordinary_magic_farm_plant"]').click()
        }, 2500);
        setTimeout(() => {
            document.getElementsByClassName("folkloreForestRegionView-dialog-continueButton")[0].click()
            ff()
        }, 5000);
    }
}

function dontFinish() {
    cctoggle(ffPulloutFuel)
    setupChange(ffPapyrusSetup)
    var plots = user.quests.QuestForewordFarm.plots
    var a = "legendary_magic_farm_plant"
    if (plots[0].plant.type == a && plots[1].plant.type == a && plots[2].plant.type == a) {
        //PULL OUT
        if (plots[0].growth > 159 || plots[1].growth > 159 || plots[2].growth > 159) {
            console.log("Cancelling plot 1...")
            document.getElementsByClassName('mousehuntActionButton tiny confirm')[0].click()
            setTimeout(() => {
                console.log("Cancelling plot 2...")
                document.getElementsByClassName('mousehuntActionButton tiny confirm')[1].click()
            }, 2000);
            setTimeout(() => {
                console.log("Cancelling plot 3...")
                document.getElementsByClassName('mousehuntActionButton tiny confirm')[2].click()
            }, 4000);
            setTimeout(() => {
                ff()
            }, 6000);
        }
    }
}

//PP Helper Functions
function craftChum(qty) {
    //Open chum gui
    hg.views.HeadsUpDisplayProloguePondView.showChumDialog()
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-quantity")[0].value = (qty*10)
    }, 1500);
    setTimeout(() => {
        console.log((qty*10) + " Brainstorm Chum crafted")
        document.getElementsByClassName("upsellItemActionView-action-button mousehuntActionButton tiny")[0].click()
    }, 3000);
    setTimeout(() => {
        pp()
    }, 4500);
}

function craftStormy(qty) {
    //Clam GUI
    hg.views.HeadsUpDisplayProloguePondView.showClamembertDialog()
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-quantity")[1].value = (qty*5)
    }, 1500);
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-button mousehuntActionButton tiny")[1].click()
        console.log((qty*10) + " Clamembert Crafted")
    }, 3000);
    //Stormy GUI
    setTimeout(() => {
        hg.views.HeadsUpDisplayProloguePondView.showStormyClamembertDialog()
    }, 4500);
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-quantity")[1].value = (qty/2)
    }, 6000);
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-button mousehuntActionButton tiny")[1].click()
        console.log(qty + " Stormy Clamembert Crafted")
    }, 7500);
    setTimeout(() => {
        pp()
    }, 9000);
}

//TOC Helper Functions
function claimBook() {
    //Early cancel
    if (user.quests.QuestTableOfContents.current_book.hunts_remaining > 0) {
        hg.views.HeadsUpDisplayTableOfContentsView.cancelBook()
    }
    setTimeout(() => {
        if (user.enviroment_atts.can_claim) {
            console.log("Claiming book rewards...")
            hg.views.HeadsUpDisplayTableOfContentsView.claimBookRewards()
        }
    }, 2500);
    setTimeout(() => {
        document.getElementsByClassName("folkloreForestRegionView-dialog-continueButton")[0].click()
    }, 5000);
    setTimeout(() => {
        location.reload()
    }, 7500);
}

function newBook() {
    hg.views.HeadsUpDisplayTableOfContentsView.showStartConfirmDialog()
    setTimeout(() => {
        hg.views.HeadsUpDisplayTableOfContentsView.startWriting()
    }, 2500);
    setTimeout(() => {
        toc()
    }, 5000);
}

//MISC. Helper Functions
function setupChange(trapSetup) {
    var a = trapSetup[0]
    var b = trapSetup[1]
    var c = trapSetup[2]
    var d = trapSetup[3]
    if (parseInt(user.weapon_item_id) != trap[a]) {
        console.log("Trap updated -> " + a)
        hg.utils.TrapControl.setWeapon(trap[a]).go()
    }
    setTimeout(() => {
        if (parseInt(user.base_item_id) != base[b]) {
            console.log("Base updated -> " + b)
            hg.utils.TrapControl.setBase(base[b]).go()
        }
    }, 500)
    setTimeout(() => {
        if (parseInt(user.trinket_item_id) != charm[c]) {
            console.log("Charm updated -> " + c)
            hg.utils.TrapControl.setTrinket(charm[c]).go()
        }
    }, 1000)
    setTimeout(() => {
        if (user.bait_item_id != bait[d]) {
            console.log("Bait updated -> " + d)
            hg.utils.TrapControl.setBait(bait[d]).go()
        }
    }, 1500)
}

function cctoggle(state) {
    var chk = 0
    if (state == false || parseInt(user.enviroment_atts.items.condensed_creativity_stat_item.quantity) == 0) {
        chk = null
    }
    else {
        chk = true
    }
    if (area == 0) {
        if (user.quests.QuestForewordFarm.is_fuel_enabled != chk && !ffFuelOverride) {
            console.log("CC toggled to " + state)
            hg.views.HeadsUpDisplayFolkloreForestRegionView.toggleFuel()
        }
    }
    else if (area == 1) {
        if (user.quests.QuestProloguePond.is_fuel_enabled != chk && !ppFuelOverride) {
            console.log("CC toggled to " + state)
            hg.views.HeadsUpDisplayFolkloreForestRegionView.toggleFuel()
        }
    }
    else if (area == 2) {
        if (user.quests.QuestTableOfContents.is_fuel_enabled != chk && !tocFuelOverride) {
            console.log("CC toggled to " + state)
            hg.views.HeadsUpDisplayFolkloreForestRegionView.toggleFuel()
        }
    }
}

function chumToggle(state) {
    if (state == false || parseInt(user.enviroment_atts.items.brainstorm_chum_stat_item.quantity) == 0) {
        chk = null
    }
    else {
        chk = true
    }
    if (user.enviroment_atts.is_chum_enabled != chk) {
        console.log("Chum toggled to " + state)
        hg.views.HeadsUpDisplayProloguePondView.toggleChum()
    }

}

function travelTo(location) {
    hg.views.HeadsUpDisplayFolkloreForestRegionView.showTravelDialog()
    var loc = {
        "FF" : document.getElementsByClassName("folkloreForestRegionView-button foreword_farm")[0],
        "PP" : document.getElementsByClassName("folkloreForestRegionView-button prologue_pond")[0],
        "TOC" : document.getElementsByClassName("folkloreForestRegionView-button table_of_contents")[0],
    }
    //Travelling
    setTimeout(() => {
        console.log("Travelling to " + location)
        loc[location].click()
    }, 2500);
} 
