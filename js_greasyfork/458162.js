// ==UserScript==
// @name        Mousehunt - CC Farming Script
// @namespace   http://tampermonkey.net/
// @version     1.8
// @description Uses 1 FD (with CC) + 1 2D (without CC)
// @author       REDACTED
// @match        https://longtail-new.mousehuntgame.com/
// @grant		GM_info
// @run-at		document-end
// @include		http://mousehuntgame.com/*
// @include		https://mousehuntgame.com/*
// @include		http://www.mousehuntgame.com/*
// @include		https://www.mousehuntgame.com/*
// @include		http://apps.facebook.com/mousehunt/*
// @include		https://apps.facebook.com/mousehunt/*
// @include		http://hi5.com/friend/games/MouseHunt*
// @include		http://mousehunt.hi5.hitgrab.com/*
// @grant		unsafeWindow
// @grant		GM_info
// @run-at		document-end
// @downloadURL https://update.greasyfork.org/scripts/458162/Mousehunt%20-%20CC%20Farming%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/458162/Mousehunt%20-%20CC%20Farming%20Script.meta.js
// ==/UserScript==

//TRAPS - CTOT:3421 - TOT:3083 - TMT:3084 - ILT:1918
//BASE - PB:2904
//CHARMS - UPAC:2992 - ANC: 928 - RULPC:2121 - RUPC:1651 - RBC:1692 - UAC:1882
//BAITS - 2D:3461 - FD:3458

(function() {
    const interval = setInterval(function() {
        setupChange()
        setTimeout(() => {
            location.reload()
        }, 40000);
    }, 20000); // set checking interval here (in miliseconds, 5000 = 5s)
})();

function setupChange() {
    var wordCount = parseInt(user.enviroment_atts.current_book.word_count)
    // if not in TOC, do nothing
    if (user.environment_name != "Table of Contents") {
        return;
    }
    // if writing
    //change id accordingly for whichever account you're using it for
    //add user by adding "|| user.user_id ==" after the first id
    if (user.user_id == 123) { //replace "123" with your id
        if (user.quests.QuestTableOfContents.is_writing) {
            if (wordCount < 100) { //Toggles CC + change setup
                cctoggle(true);
                if (user.trinket_item_id != 2121) hg.utils.TrapControl.setTrinket(2121).go();
                if (user.base_item_id != 2904) hg.utils.TrapControl.setBase(2904).go();
                if (user.weapon_item_id != 3421) hg.utils.TrapControl.setWeapon(3421).go();
                if (user.bait_item_id != 3458) hg.utils.TrapControl.setBait(3458).go();
            }
            else if (wordCount > 101 && wordCount < 939) { //if you catch a 2d mouse first, it'll hunt 2 hunts of FD (incase of TC)
                cctoggle(false);
                if (user.trinket_item_id != 2121) hg.utils.TrapControl.setTrinket(2121).go();
                if (user.base_item_id != 2904) hg.utils.TrapControl.setBase(2904).go();
                if (user.weapon_item_id != 3421) hg.utils.TrapControl.setWeapon(3421).go();
                if (user.bait_item_id != 3458) hg.utils.TrapControl.setBait(3458).go();
            }
            else if (wordCount == 940) { //Changes to 2d once u catch 1 bitter grammarian
                cctoggle(false);
                if (user.trinket_item_id != 928) hg.utils.TrapControl.setTrinket(928).go();
                if (user.base_item_id != 2904) hg.utils.TrapControl.setBase(2904).go();
                if (user.weapon_item_id != 3421) hg.utils.TrapControl.setWeapon(3421).go();
                if (user.bait_item_id != 3461) hg.utils.TrapControl.setBait(3461).go();
            }
            else if (wordCount > 1000) { //claims book once wordcount is more than 1k
                claimBook()
                newBook()
            }
        }
        else if (user.enviroment_atts.can_claim) {
            hg.views.HeadsUpDisplayTableOfContentsView.claimBookRewards(this)
            newBook()
        }
        else //Auto enters a new book if not writing
            newBook()
    }
}

//DONT TOUCH
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

// new book function DONT TOUCH
function newBook() {
    hg.views.HeadsUpDisplayTableOfContentsView.showStartConfirmDialog()
    setTimeout(() => {
        hg.views.HeadsUpDisplayTableOfContentsView.startWriting()
    }, 2500);
    setTimeout(() => {
        toc()
    }, 5000);
}

//DONT TOUCH
function cctoggle(state) {
    var chk = 0
    if (state == false || parseInt(user.enviroment_atts.items.condensed_creativity_stat_item.quantity) == 0) {
        chk = null
    }
    else {
        chk = true
    }
    if (user.quests.QuestTableOfContents.is_fuel_enabled != chk) {
        console.log("CC toggled to " + state)
        hg.views.HeadsUpDisplayFolkloreForestRegionView.toggleFuel()
    }
}