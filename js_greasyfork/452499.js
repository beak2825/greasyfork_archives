// ==UserScript==
// @name         Scuffed Ass ToC farm
// @namespace    http://tampermonkey.net/
// @version      1
// @description  yee yee ass script ty geruciapamer
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
// @downloadURL https://update.greasyfork.org/scripts/452499/Scuffed%20Ass%20ToC%20farm.user.js
// @updateURL https://update.greasyfork.org/scripts/452499/Scuffed%20Ass%20ToC%20farm.meta.js
// ==/UserScript==

console.log('Scuffed Ass ToC farm')

//Table of Contents
var autoCurdFarm = true //SET THIS TO FALSE IF YOU ARE DOING FD PUSH | Automatically does optimal 2D write and retreats if true, will not trigger if 2D bait quantity does not meet minimum threshold
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