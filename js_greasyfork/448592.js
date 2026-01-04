// ==UserScript==
// @name         FFP
// @namespace    http://tampermonkey.net/
// @version      1.0
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
// @downloadURL https://update.greasyfork.org/scripts/448592/FFP.user.js
// @updateURL https://update.greasyfork.org/scripts/448592/FFP.meta.js
// ==/UserScript==
 
console.log('FFP')

//TRAP SETUPS [WEAPON,BASE,CHARM,CHEESE], available traps/bases/charms/cheese and their shorthands refer to the list below

//FULL-AUTO FOFO
var iDontHaveTimeForThisShit = true

//Foreword Farm
var ffPulloutMode = false //Set to true to cancel papyrus plants before they finish growing and replant immediately aka "Pullout Strategy"
var ffEmptySetup = ['CSW','PB','GILDED','GOUDA'] //Setup when no plants are planted
var ffMulchSetup = ['CSW','PB','GILDED','MSC'] //Setup when mulch plants are planted
var ffPapyrusSetup = ['CSW','PB','GILDED','MSC'] //Setup when papyrus plants are planted


//Prologue Pond
//Will travel you back to Foreword Farm if you run out of stormy and grubben
var ppOverride = false //If set to true will make pp completely manual
var targetLoot = "ink" //"penny" to farm penny, "ink" to farm ink
var pondCycleType = 3 //1 = don't use CC at all, 2 = cc for stormy only, 3 = cc everything
var pondLevel = 6 //Will decide optimal penny thresholds per cycle
var grubSetup = ['CSOS','PB','GILDED','GRUB'] //Setup to use with grubben
var stormySetup = ['CSOS','PB','RULPC','SCLAM'] //Setup to use with stormy


//Table of Contents
var autoCurdFarm = true //SET THIS TO FALSE IF YOU ARE DOING FD PUSH | Automatically does optimal 2D write and retreats if true, will not trigger if 2D bait quantity does not meet minimum threshold 
var curdCycleType = 1
/*Cycle types 
DISCLAIMER: 2D MINLUCK IS 81, THE 2D BAIT REQUIREMENTS ARE ASSUMING YOU CAN REACH 81 LUCK, IF YOU CANNOT, PREPARE A FEW ADDITIONAL PIECES JUST IN CASE
1 = Full CC rush Vol1, retreats once Epic book is reached, minimum 25 2D required
2 = Optimized CC epic, uses 5-6 CC depending on rng to guarantee Epic, minimum 25 2D required
3 = No CC, retreats once Novel is reached, minimum 16 2D required
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
var ppFuelOverride = false

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
    'CSW': 1833, //Chrome Sphynx Wrath
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
    autoCheck()
    setTimeout(() => {
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
            tocPre()
        }
    }, 1000);
  }, 30000);

var seedCount = 0
var mulchCount = 0
var papyCount = 0
var coinCount = 0
var grubCount = 0
var clamCount = 0
var inkCount = 0
var pennyCount = 0
var curdCount = 0
var gpCount = 0

function autoCheck() {
    seedCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[0].innerHTML.replace(/,/g,''))
    mulchCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[1].innerHTML.replace(/,/g,''))
    papyCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[2].innerHTML.replace(/,/g,''))
    coinCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[3].innerHTML.replace(/,/g,''))
    grubCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[4].innerHTML.replace(/,/g,''))
    clamCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[5].innerHTML.replace(/,/g,''))
    inkCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[6].innerHTML.replace(/,/g,''))
    pennyCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[7].innerHTML.replace(/,/g,''))
    curdCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[8].innerHTML.replace(/,/g,''))
    gpCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[9].innerHTML.replace(/,/g,''))
    //FF
    if (user.environment_name == 'Foreword Farm') {
    }
    //PP
    else if (user.environment_name == 'Prologue Pond') {
    }
    //TOC
    else if (user.environment_name == 'Table of Contents') {
    }
}


function ff() {
    var plots = user.quests.QuestForewordFarm.plots
    if (iDontHaveTimeForThisShit && papyCount > 2999) {
        travelTo("PP")
        return
    }
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
    //Override Function
    if (ppOverride) {
        return
    }
    //Stormy amounts based on pond level
    var lim = 48
    if (pondLevel == 5) {
        lim = 24
    }
    else if (pondLevel == 6) {
        lim = 14
    }
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
    //FULL AUTO
    if (iDontHaveTimeForThisShit && inkCount > 2999) {
        travelTo("TOC")
        return
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
    else if (chumCount < (lim*10) && clamCount >= (lim/2*10) && meCount >= (lim/2*11) && pennyCount > (lim*10)) {
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

function tocPre() {
    if (iDontHaveTimeForThisShit) {
        tocAuto()
    }
    else {
        toc()
    }
}

function toc() {
    var wordCount = parseInt(user.enviroment_atts.current_book.word_count)
    var twoD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[1].innerHTML.replace(/,/g,''))
    var finalD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[2].innerHTML.replace(/,/g,''))
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
                if (wordCount > 3999) {
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
        }
    }
    //New Book or Travel or Not Writing
    else {
        //New Book
        if (autoCurdFarm) {
            //Meets cycle requirements, start new book and ends function
            if ((curdCycleType == 1 && twoD > 17) || (curdCycleType == 2 && twoD > 24) || (curdCycleType == 3 && twoD > 15)) {
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

function tocAuto() {
    var gpCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[9].innerHTML.replace(/,/g,''))
    var twoD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[1].innerHTML.replace(/,/g,''))
    var finalD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[2].innerHTML.replace(/,/g,''))
    //Only curd < 3000, farming curd mode
    if (inkCount > 2999 && papyCount > 2999 && curdCount < 3000) {
        toc()
    }
    //Craft up to 46 2D, max FD
    else if (inkCount > 2749 && papyCount > 2749 && curdCount > 2749) {
        //Still writing, do nothing
        if (user.quests.QuestTableOfContents.is_writing) {
            toc()
        }
        //Done writing, awaiting claim rewards
        else if (user.enviroment_atts.can_claim) {
            claimBook()
        }
        //Craft cheese
        else {
            tocCraft()
        }
    }
    //All < 3000, FD push mode
    else if (inkCount < 3000 && curdCount < 3000) {
        tocFD()
    }
    else if (papyCount < 3000) {
        travelTo("FF")
    }
    else {
        travelTo("PP")
    }
}

function tocCraft() {
    var curdCount = parseInt(document.getElementsByClassName("folkloreForestRegionView-environmentInventory-block-quantity quantity")[8].innerHTML.replace(/,/g,''))
    var twoD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[1].innerHTML.replace(/,/g,''))
    var finalD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[2].innerHTML.replace(/,/g,''))
    if (twoD < 50) {
        //2D Gui
        hg.views.HeadsUpDisplayTableOfContentsView.showSecondDraftDialog()
        setTimeout(() => {
            document.getElementsByClassName("upsellItemActionView-action-quantity")[1].value = Math.ceil((34-twoD)/2)
        }, 1500);
        setTimeout(() => {
            document.getElementsByClassName("upsellItemActionView-action-button mousehuntActionButton tiny")[1].click()
        }, 3000);
    }
    //FD Gui
    setTimeout(() => {
        hg.views.HeadsUpDisplayTableOfContentsView.showFinalDraftDialog()
    }, 4500);
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-max")[1].click()
    }, 6000);
    setTimeout(() => {
        document.getElementsByClassName("upsellItemActionView-action-button mousehuntActionButton tiny")[1].click()
    }, 7500);
    setTimeout(() => {
        tocAuto()
    }, 9000);
}

function tocFD() {
    var finalD = parseInt(document.getElementsByClassName("folkloreForestRegionView-bait-quantity quantity")[2].innerHTML.replace(/,/g,''))
    //Writing Setup
    if (user.enviroment_atts.is_writing) {
        cctoggle(true)
        if (finalD > 2) {
            setupChange(['CTOT','PB','RULPC','FD'])
        }
        else {
            setupChange(['CTOT','SSDB','BK','FD'])
        }
    }
    //Writing done, can claim book
    else if (user.enviroment_atts.can_claim) {
        claimBook()
        return
    }
    //Not writing
    else if (!user.enviroment_atts.is_writing) {
        //FD at least 60, start new run, else travel to FF
        if (finalD > 59) {
            newBook()
        }
        else {
            if (papyCount < 3000) {
                travelTo("FF")
            }
            else {
                travelTo("PP")
            }
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
