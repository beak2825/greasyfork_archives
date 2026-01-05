// ==UserScript==
// @name Neverwinter gateway - PA Edited By nina
// @description Automatically selects professions for empty slots
// @namespace https://greasyfork.org/scripts/7061-neverwinter-gateway-professions-robot/
// @include http://gateway*.playneverwinter.com/*
// @include https://gateway*.playneverwinter.com/*
// @include http://gateway.*.perfectworld.eu/*
// @include https://gateway.*.perfectworld.eu/*
// @originalAuthor Mustex/Bunta
// @modifiedBy NW gateway Professions Bot Developers & Contributors
// @version 1.10.07.06
// @license http://creativecommons.org/licenses/by-nc-sa/3.0/us/
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_listValues
// @grant GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/17163/Neverwinter%20gateway%20-%20PA%20Edited%20By%20nina.user.js
// @updateURL https://update.greasyfork.org/scripts/17163/Neverwinter%20gateway%20-%20PA%20Edited%20By%20nina.meta.js
// ==/UserScript==

/* RELEASE NOTES

 1.10.07.03 - 06
 + Ichor chest opens automatic
 + case check for winterevent(douplle trouple)
 + Leadership XP/RP changes
 1.10.07.02
 + changed Blackice prof. name
 1.10.07.01
 + leadership ZERO value tasklist, version number updated
 1.10.06.08
 + removed "pause" from SCA
 + added Summer Event
 1.10.06.07
 + Added Invocation_Rp_Bag to open rewards
 1.10.06.06
 + added Minor mark potency to junk, updated exclusion list for it
 + SCA tutotrial check from datamodel info, stops flickering in SCA
 + added, junk filter several definitions
 + added, _Alchemy_exclusion list, is active if Alchemy is active, works only if script do rotations
 + rearranged, SCA roll check to avoid unnecessary GM -swaps
 + rearranged, potions Vendor section(user must reslect because names changed)
 + added, Alchemy checks for preventing inifnite "Craft-sell" loop (Alchemy state, True allows Vendoring if selected, is allways False if Alchemy is on work)
 + Swordcoast run auto reset fixed(reset changed to week day based)
 1.10.06.04
 + added Skip 25 (noted as @Kakouras favour ;) )
 + added SCA automation, runs SCA can set by time, ToDo, callback for rolls
 + panel has now info for SCA runs done, 4 times per day
 + banker is not default on
 + reload intervalls now 4 hours(for SCA completion and stability)
 */

// Make sure it's running on the main page, no frames
if (window.self !== window.top) {
    throw "";
}
var current_Gateway = _select_Gateway(); // edited by RottenMind
// Set global console variables
var fouxConsole = {log: function () {
}, info: function () {
}, error: function () {
}, warn: function () {
}};
var console = unsafeWindow.console || fouxConsole;
var chardelay = 0;
var chardiamonds = {};
var definedTask = {};
var startedTask = {};  // stores information about previous (character, taskname, and counter) and currently started task
startedTask["lastTaskChar"] = "";
startedTask["lastTaskName"] = "";
startedTask["lastTaskCount"] = 0;
// Page Reloading function
// Every second the page is idle or loading is tracked
var loading_reset = false; // Enables a periodic reload if this is toggled on by the Auto Reload check box on the settings panel
var s_paused = false;	   // extend the paused setting to the Page Reloading function

// RottenMind (start), multi Url support
function _select_Gateway() { // Check for Gateway used to
    if (window.location.href.indexOf("gatewaytest") > -1) { // detect gatewaytest Url
        console.log("GatewayTEST detected");
        return "http://gatewaytest.playneverwinter.com";
    }
    else if (window.location.href.indexOf("nw.ru.perfectworld") > -1) {
        console.log("GatewayRU detected");
        return "http://gateway.nw.ru.perfectworld.eu";
    }
    else { // must go somewhere
        console.log("Gateway detected");
        return "http://gateway.playneverwinter.com";
    }
}
// RottenMind (END)

(function () {
    var $ = unsafeWindow.$;

    //MAC-NW
    $.fn.waitUntilExists = function (handler, shouldRunHandlerOnce, isChild) {
        var found = 'found';
        var $this = $(this.selector);
        var $elements = $this.not(function () {
            return $(this).data(found);
        }).each(handler).data(found, true);
        if (!isChild) {
            (window.waitUntilExists_Intervals = window.waitUntilExists_Intervals || {})[this.selector] = window.setInterval(function () {
                $this.waitUntilExists(handler, shouldRunHandlerOnce, true);
            }, 500);
        } else if (shouldRunHandlerOnce && $elements.length) {
            window.clearInterval(window.waitUntilExists_Intervals[this.selector]);
        }
        return $this;
    }
    // MAC-NW - Wait for tooltip to come up so we can alter the list
    $('.tooltip-menu button').waitUntilExists(function () {
        // Tooltip has open menu itemtooltip
        if ($('button.tooltip-menu button[data-url-silent^="/inventory/item-open"]') && !$('.tooltip-menu div.tooltip-openall').length && !$('.tooltip-menu button[data-url-silent^="/inventory/item-open"]').hasClass('disabled'))
            try {
                var thisItem = eval("client.dataModel.model." + $('.tooltip-menu button[data-url-silent^="/inventory/item-open"]').attr('data-url-silent').split("=")[1]);
                if (thisItem.count > 1) {
                    if (thisItem.count >= 99)
                        thisItem.count = 99;
                    var openAllClick = "for (i = 1; i <= " + thisItem.count + "; i++){ window.setTimeout(function () {client.sendCommand('GatewayInventory_OpenRewardPack', '" + thisItem.uid + "');}, 500); }";
                    $('div.tooltip-menu').append('<div class="input-field button menu tooltip-openall"><div class="input-bg-left"></div><div class="input-bg-mid"></div><div class="input-bg-right"></div>\
<button class="&nbsp;" onclick="' + openAllClick + '">Open All (' + thisItem.count + ')</button></div>');
                    //$('a.nav-dungeons').trigger('click'); window.setTimeout(function(){ $('a.nav-inventory').trigger('click'); },2000);
                }
            } catch (e) {
                console.log("ERROR: Did not succeed to add open all tooltip.");
            }
    });

    $('.vendor-quantity-block span.attention').waitUntilExists(function () {
        if ($('.vendor-quantity-block span.attention span').length)
            $('.vendor-quantity-block span.attention').replaceWith('<div class="input-field button"><div class="input-bg-left"></div><div class="input-bg-mid"></div><div class="input-bg-right"></div><button onclick="$(\'input[name=inventorySellQty]\').val(\'' + $(".vendor-quantity-block span.attention span").text() + '\');">All (' + $(".vendor-quantity-block span.attention span").text() + ')</button></div>');
    });

    $('div.notification div.messages li').waitUntilExists(function () {
        if ($("div.notification div.messages li").length > 2)
            $("div.notification div.messages li").eq(0).remove();
    });

    // Always disable SCA tutorial if its active, this cause flickering on SCA
    /*$('#help-dimmer.help-cont.whenTutorialActive').waitUntilExists(function () {
        client.toggleHelp();
    });*/

    //MAC-NW

    var state_loading = 0;	  // If "Page Loading" takes longer than 30 seconds, reload page (maybe a javascript error)
    var state_loading_time = 30;  // default of 30 seconds
    var state_idle = 0;	  // If the page is idle for longer than 60 seconds, reload page (maybe a javascript error)
    var state_idle_time = 120; // default of 120 seconds
    var reload_hours = [2, 6, 10, 14, 18, 22, 23]; // logout and reload every three hours - 2:29 - 6:29 - 10:29 - 14:29 - 18:29 - 22:29 - 23:29
    var last_location = "";  // variable to track reference to page URL
    var reload_timer = setInterval(function () {
        if (!s_paused) {
            if (startedTask["lastTaskCount"] >= 20) {
                unsafeWindow.location.href = current_Gateway;
                return;
            }
            if (loading_reset) {
                var loading_date = new Date();
                var loading_sec = Number(loading_date.getSeconds());
                var loading_min = Number(loading_date.getMinutes());
                var loading_hour = Number(loading_date.getHours());
                if (reload_hours.indexOf(loading_hour) >= 0 && loading_min == 29 && loading_sec < 2) {
                    console.log("Auto Reload");
                    unsafeWindow.location.href = current_Gateway; // edited by RottenMind
                    return;
                }
            }

            // check for errors
            if ($("title").text().match(/Error/) || $("div.modal-content h3").text().match(/Disconnected/)) {
                console.log("Error detected - relogging");
                unsafeWindow.location.href = current_Gateway; // edited by RottenMind
                return;
            }

            if ($("div.loading-image:visible").length) {
                last_location = location.href;
                state_idle = 0;
                if (state_loading >= state_loading_time) {
                    console.log("Page Loading too long");
                    state_loading = 0;
                    location.reload(true);
                }
                else {
                    state_loading++;
                    console.log("Page Loading ...", state_loading + "s");
                }
            }
            // TODO: Add check for gateway disconnected
            //<div class="modal-content" id="modal_content"><h3>Disconnected from Gateway</h3><p>You have been disconnected.</p><button type="button" class="modal-button" onclick="window.location.reload(true);">Close</button>


            /* Can't use idle check with dataModel methods
             else if (location.href == last_location) {
             state_loading = 0;
             if (state_idle >= state_idle_time) {
             console.log("Page Idle too long");
             state_idle = 0;
             unsafeWindow.location.href = current_Gateway ; // edited by RottenMind
             }
             else {
             state_idle++;
             // comment out to avoid console spam
             //console.log("Page Idle ...", state_idle + "s");
             }
             }
             */
            else {
                last_location = location.href;
                state_loading = 0;
                state_idle = 0;
            }
        }
    }, 1000);
})();

(function () {

    /**
     * Add a string of CSS to the main page
     *
     * @param {String} cssString The CSS to add to the main page
     */
    function AddCss(cssString) {
        var head = document.getElementsByTagName('head')[0];
        if (!head)
            return;
        var newCss = document.createElement('style');
        newCss.type = "text/css";
        newCss.innerHTML = cssString;
        head.appendChild(newCss);
    }
    function countLeadingSpaces(str) {
        return str.match(/^(\s*)/)[1].length;
    }

    var image_pause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAY" +
        "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" +
        "BNp57TyT3+MAAAAASUVORK5CYII=";
    var image_play = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYA" +
        "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";
    var image_prefs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
        "AMAAAAoLQ9TAAAAllBMVEUAGQASEhIfHx8fJy8pKSk2NjZBQUFJR0ZQUE9RUVFSUlJNX3No" +
        "aGhsaWdramlycG1meY98fHx+fn5wgpV0iqKKh4R4jaR9jJx8kad9kad/mbONmaWEnrmEnrq" +
        "koZy3t7fIx8bKyMHT0c3S0dDU09DV1NPP1t3W1dXY2Njb2tfe29bf3tzj4uHr6+js6+r39/" +
        "f5+PgAAABrL3yvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTA" +
        "QCanBgAAAAHdElNRQfWBRoFKh31UQ8DAAAAgUlEQVQY022OxxLCMAwFRSc4BEIPJZQQ08v+" +
        "/8+RsTExDDpIe3ijfSJ/hx9g62Dt4GaAI+8YT0t27+BxxvvE/no5pYT10lGFrE34Ja40W3g" +
        "1oMGmW7YZ6hnCYexKTPVkXivuvWe1Cz1aKqPNI3N0slI2TNYZiARJX30qERc7wBPKC4WRDz" +
        "WdWHfmAAAAAElFTkSuQmCC";
    var image_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
        "AQAAAC1+jfqAAAAAmJLR0QA/4ePzL8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfW" +
        "BRkTNhxuPxLkAAAAHXRFWHRDb21tZW50AENyZWF0ZWQgd2l0aCBUaGUgR0lNUO9kJW4AAAE" +
        "KSURBVCjPhdGxSgNBFAXQMzpgYWwsLEQUDBJBQgqFIChZEPR7/DA/QCGQTgQtJE1ENoWohY" +
        "UgbGKQyFjErNv52nObe19wqGWg7z0l5YVgVdOu+wUt507tqIVQ4Zodp861ooELe15M5KFI6" +
        "Zfr9u25MIj6Jl4cmSIPBWrq2o5cufO4aOJDYSozNTa2pK4t03PtwUdMKRRykAmW0dTRcyNX" +
        "pBQpI8GJDTR050zkNzK0bMMZLvUNZ8yCfy6Wvbc1NVyi4dloXjqWvds6uvp41pFmpVOKJWd" +
        "6bgwxkmTMIotWKpwrfBkZl7uMonUHf5wSlV2+fUZrjnXdzrmyy7djD8GWTW9e51z557o1Tz" +
        "85FH/WkOkaHQAAAABJRU5ErkJggg==";


    // Setup global closure variables
    var $ = unsafeWindow.jQuery;
    var timerHandle = 0;
    var dfdNextRun = $.Deferred();
    var charcurrent = 0; // current character counter
    var chartimers = {};
    var settingwipe = false; // Use to wipe stored settings
    var delay = {
        SHORT: 1000,
        MEDIUM: 5000,
        LONG: 30000,
        MINS: 300000,
        DEFAULT: 10000, // default delay
        TIMEOUT: 60000, // delay for cycle processing timeout
    };
    var failedProf = [];
    var taskSlots = [];
    var slotsByProf = {};
    var charNameList = []; // better place

    /*
     * Tasklist can be modified to configure the training you want to perform.
     * The configurable options window sets how many profession slots you want to use for each profession.
     * The level array below for each professions specifies the tasks you want to learn at each crafting level.
     * Each craft slot will pick the first task that meets requirements.
     * See http://pastebin.com/VaGntEha for Task Name Map.
     * Updated list, see http://pastebin.com/inR0Hwv0
     * Tools,
     * Tasknames extraction, https://greasyfork.org/en/scripts/7977-nw-profession-names
     * Inventory listing, https://greasyfork.org/en/scripts/8506-nw-inventory-names
     * Some names above do not match, use below code to check:
     * var tasks = client.dataModel.model.craftinglist['craft_' + profname].entries.filter(function(entry) { return entry.def && entry.def.displayname == taskname; }); tasks[0].def.name;
     */

    definedTask["Leadership"] = {
        // modded to prioritize RAD production, added low level task for speeding up levelling up
        taskListName: "Leadership",
        taskName: "Leadership",
        level: {
            0: ["Leadership_Tier0_Intro_1"],
            1: ["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4", "Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
            2: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            3: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            4: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            5: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
            6: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
            7: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
            8: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore", "Leadership_Tier1_2_Guardduty"],
            9: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            // Begin prioritizing "Battle Undead"
            10: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            11: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            12: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            // Add "protect diamonds rare" and the patrol quest as a backup
            13: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            14: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier1_5_Explore"],
            15: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4r_Gatherdiamonds", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier1_4_Protect", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
            // Production mode: Spellplague + Battle Undead
            16: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
            17: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol",  "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
            18: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],
            19: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_13_Patrol","Leadership_Tier2_12_Taxes", "Leadership_Tier2_10r_Seekmaps", "Leadership_Tier2_9_Chart", "Leadership_Tier3_16_Fight", "Leadership_Tier2_8r_Givehome", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_15r_Raidtreasury", "Leadership_Tier1_5_Explore"],

            20: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_20r_Master2",
                 "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier3_20_Destroy",
                 "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

            21: ["Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier3_20r_Master2",
                 "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier3_20_Destroy", "Leadership_Tier4_21_Protectmagic",
                 "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],

            22: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
                 "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1",
                 "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier4_21_Protectmagic",
                 "Leadership_Tier2_12_Taxes", "Leadership_Tier3_13_Patrol", "Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

            23: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
                 "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
                 "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes", "Leadership_Tier2_12_Taxes",
                 "Leadership_Tier4_21_Protectmagic","Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],

            24: ["Leadership_Tier4_22r_Capturebandithq", "Leadership_Tier3_13r_Protectdiamonds",
                 "Leadership_Tier4_24r_Killdragon","Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1",
                 "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes",
                 "Leadership_Tier4_21_Protectmagic","Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],

            25: ["Leadership_Tier4_25r_Huntexperiment","Leadership_Tier4_22r_Capturebandithq",
                 "Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier4_24r_Killdragon",
                 "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
                 "Leadership_Tier3_20_Destroy","Leadership_Tier2_12_Taxes", "Leadership_Tier4_25_Battleelementalcultists",
                 "Leadership_Tier4_21_Protectmagic", "Leadership_Tier3_13_Patrol","Leadership_Tier3_16_Fight",
                 "Leadership_Tier2_10_Battle", "Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
        },
    };

    definedTask["Leadership XP"] = {
        taskListName: "Leadership_XP",
        taskName: "Leadership",
        level: {
            0: ["Leadership_Tier0_Intro_1"],
            1: ["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4", "Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
            2: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            3: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            4: ["Leadership_Tier1_Feedtheneedy", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty", "Leadership_Tier1_2_Training"],
            5: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            6: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            7: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            8: ["Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            9: ["Leadership_Tier1_5_Explore", "Leadership_Tier2_9_Chart", "Leadership_Tier1_4_Protect"],
            10: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            11: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            12: ["Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier1_2_Guardduty"],
            13: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            14: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            15: ["Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            16: ["Leadership_Tier3_16r_Buildshelters","Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            17: ["Leadership_Tier3_16r_Buildshelters","Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            18: ["Leadership_Tier3_16r_Buildshelters","Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart", "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            
            19: ["Leadership_Tier3_16r_Buildshelters","Leadership_Tier3_19_Acquire", "Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart",
            "Leadership_Tier3_13_Training", "Leadership_Tier1_5_Explore","Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            
            20: ["Leadership_Tier3_16r_Buildshelters","Leadership_Tier3_19_Acquire", "Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1",
            "Leadership_Tier3_20r_Master3","Leadership_Tier3_13_Patrol", "Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore",
            "Leadership_Tier3_13_Training", "Leadership_Tier1_4_Protect", "Leadership_Tier2_7_Training"],
            
            // 20: ["Leadership_Tier3_13_Patrol","Leadership_Tier3_13r_Protectdiamonds", "Leadership_Tier3_20r_Master2", "Leadership_Tier3_20r_Master1", "Leadership_Tier3_20r_Master3", "Leadership_Tier3_20_Destroy", "Leadership_Tier2_12_Taxes", "Leadership_Tier3_16_Fight", "Leadership_Tier2_10_Battle", "Leadership_Tier3_13_Patrol"],
            
            21: ["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier4_21_Protectmagic",
            "Leadership_Tier4_21_Training","Leadership_Tier3_19_Acquire","Leadership_Tier3_16r_Buildshelters","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier3_13_Patrol"],
            
            22: ["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
            "Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Training","Leadership_Tier3_19_Acquire",
            "Leadership_Tier3_16r_Buildshelters","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier3_13_Patrol"],
            
            23: ["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
            "Leadership_Tier4_21_Protectmagic","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Protectmagic",
            "Leadership_Tier4_21_Training","Leadership_Tier3_19_Acquire","Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
            
            24: ["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
            "Leadership_Tier4_24_Wizardsseneschal","Leadership_Tier4_22_Guardclerics","Leadership_Tier4_21_Protectmagic",
            "Leadership_Tier4_21_Training","Leadership_Tier3_19_Acquire","Leadership_Tier3_16r_Buildshelters","Leadership_Tier2_9_Chart", "Leadership_Tier1_5_Explore"],
            
            25: ["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3",
            "Leadership_Tier4_24r_Killdragon", "Leadership_Tier4_24_Wizardsseneschal", "Leadership_Tier4_21_Protectmagic",
            "Leadership_Tier4_22_Guardclerics","Leadership_Tier3_19_Acquire","Leadership_Tier3_16r_Buildshelters"],
        },
    };
	
	    
    definedTask["Summer Event"] = {
        taskListName: "SummerEvent",
        taskName: "SummerEvent",
        level: {
             0:["Event_Summer_Tier0_Intro"],
             1:["Event_Summer_Tier1_Rankup","Event_Summer_Tier1_Caprese","Event_Summer_Tier1_Cornchowder","Event_Summer_Tier1_Watermelonsorbet"],
             2:["Event_Summer_Tier2_Rankup","Event_Summer_Tier2_Summerfeast",
				"Event_Summer_Tier2_Partypoppers","Event_Summer_Tier2_Fireworks",
				"Event_Summer_Tier2_Festivalgarblower","Event_Summer_Tier2_Festivalgarbupper",
				"Event_Summer_Tier2_Festivalgarbhead"],
             3:["Event_Summer_Tier3_Sunite_Altar","Event_Summer_Tier3_Festivalgarb_Permanent"],
        },
    };

    definedTask["Winter Event"] = {
        taskListName: "Winterevent",
        taskName: "Winterevent",
        level: {
            /*
             0:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
             1:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
             2:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
             3:["Event_Winter_Tier1_Heros_Feast, Event_Winter_Tier1_Lightwine, Event_Winter_Tier1_Sparkliest_Gem"],
             */

            0: ["Event_Winter_Tier0_Intro"],
            1: ["Event_Winter_Tier1_Rankup", /*"Event_Winter_Tier1_Shiny_Lure",*/"Event_Winter_Tier1_Refine", "Event_Winter_Tier1_Gather"],
            2: ["Event_Winter_Tier1_Rankup_2", /*"Event_Winter_Tier1_Fishingpole_Blue","Event_Winter_Tier1_Shiny_Lure_Mass",*/"Event_Winter_Tier1_Refine_2", "Event_Winter_Tier1_Gather_2"],
            3: [/*"Event_Winter_Tier1_Heros_Feast","Event_Winter_Tier1_Lightwine","Event_Winter_Tier1_Sparkliest_Gem","Event_Winter_Tier1_Mesmerizing_Lure",*/"Event_Winter_Tier1_Gather_3"],
        },
    };

    definedTask["Siege Event"] = {
        taskListName: "Event_Siege",
        taskName: "Event_Siege",
        level: {
            0:["Event_Siege_Tier0_Intro"], // Hire a Siege Master
            1:["Event_Siege_Tier1_Donate_Majorinjury", "Event_Siege_Tier1_Donate_Injury", "Event_Siege_Tier1_Donate_Resources_T3", "Event_Siege_Tier1_Donate_Resources_T2"],
            /*
             0: ["Event_Siege_Tier0_Intro"], // Hire a Siege Master
             //1:["Event_Siege_Tier1_Donate_Minorinjury"], // Create Defense Supplies from Minor Injury Kits
             //1:["Event_Siege_Tier1_Donate_Injury"], // Create Defense Supplies from Injury Kits
             //1:["Event_Siege_Tier1_Donate_Majorinjury"], // Create Defense Supplies from Major Injury Kits
             //1:["Event_Siege_Tier1_Donate_Altar_10"], // Create Defense Supplies from 10 Portable Altars
             //1:["Event_Siege_Tier1_Donate_Altar_50"], // Create Defense Supplies from 50 Portable Altars
             //1:["Event_Siege_Tier1_Donate_Resources_T2"], // Create Defense Supplies from Tier 2 crafting resources
             //1:["Event_Siege_Tier1_Donate_Resources_T3"], // Create Defense Supplies from Tier 3 crafting resources
             1: ["Event_Siege_Tier1_Donate_Resources_T3", "Event_Siege_Tier1_Donate_Resources_T2", "Event_Siege_Tier1_Donate_Minorinjury", "Event_Siege_Tier1_Donate_Injury", "Event_Siege_Tier1_Donate_Majorinjury", "Event_Siege_Tier1_Donate_Altar_10"],
             */
        },
    };

    definedTask["Black Ice Shaping"] = {
        taskListName: "Blackice",
        taskName: "Blackice",
        level: {
            1: ["Blackice_Tier1_Process_Blackice"],
            2: ["Blackice_Tier1_Process_Blackice"],
            3: ["Blackice_Tier1_Process_Blackice"],
            4: ["Blackice_Tier1_Process_Blackice"],
            5: ["Blackice_Tier1_Process_Blackice"],

            /*
             1:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
             2:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
             3:["Forge Hammerstone Pick","Gather Raw Black Ice","Truesilver Pick Grip","Process Raw Black Ice","Upgrade Chillwright","Hire an additional Chillwright"],
             */
        },
    };

    definedTask["Jewelcrafting"] = {
        taskListName: "Jewelcrafting",
        taskName: "Jewelcrafting",
        level: {
            // Gather Mithral Ore and Exotic Pelts (14): Jewelcrafting_Tier3_Gather_Basic,
            // Semi-Precious Gem and Tough Leather Strip Crafting (7): Jewelcrafting_Tier2_Refine_Basic,
            // Gather High Quality Iron Ore and Tough Pelts (7): Jewelcrafting_Tier2_Gather_Basic,
            // Craft Raw Gems and Simple Leather Strips (1): Jewelcrafting_Tier1_Refine_Basic,
            // Gather Iron Ore and Simple Pelts (1):  Jewelcrafting_Tier1_Gather_Basic
            //			0:["Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],

            0: ["Jewelcrafting_Tier0_Intro"],
            1: ["Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            2: ["Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            3: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Offense_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            4: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            5: ["Jewelcrafting_Tier1_Neck_Offense_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            6: ["Jewelcrafting_Tier1_Neck_Misc_1", "Jewelcrafting_Tier1_Waist_Misc_1", "Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            7: ["Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            8: ["Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            9: ["Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Waist_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            10: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            11: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            12: ["Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Neck_Offense_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            13: ["Jewelcrafting_Tier2_Neck_Misc_2", "Jewelcrafting_Tier2_Waist_Misc_2", "Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            14: ["Jewelcrafting_Tier3_Waist_Offense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            15: ["Jewelcrafting_Tier3_Waist_Offense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            16: ["Jewelcrafting_Tier3_Neck_Offense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            17: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            18: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            19: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            20: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            21: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            22: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            23: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            24: ["Jewelcrafting_Tier3_Neck_Defense_3", "Jewelcrafting_Tier3_Waist_Defense_3", "Jewelcrafting_Tier3_Refine_Basic", "Jewelcrafting_Tier3_Gather_Basic", "Jewelcrafting_Tier2_Gather_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            25: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier1_Refine_Basic"],

        },
    };

    definedTask["Mailsmithing"] = {
        taskListName: "Mailsmithing",
        taskName: "Armorsmithing_Med",
        level: {
            //            Med_Armorsmithing_Tier3_Scale_Pants (15)
            //            Med_Armorsmithing_Tier3_Scale_Shirt (14)
            //			      0:["Med_Armorsmithing_Tier3_Scale_Pants", "Med_Armorsmithing_Tier3_Scale_Shirt", "Med_Armorsmithing_Tier2_Scale_Pants_1_Set2", "Med_Armorsmithing_Tier2_Scale_Shirt", "Med_Armorsmithing_Tier1_Scale_Gloves_1", "Med_Armorsmithing_Tier1_Scale_Armor_1", "Med_Armorsmithing_Tier1_Scale_Shirt_1"],

            0: ["Med_Armorsmithing_Tier0_Intro"],
            1: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Med_Armorsmithing_Tier1_Chain_Armor_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier1_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Med_Armorsmithing_Tier1_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
            8: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic"],
            9: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt","Med_Armorsmithing_Tier1_Gather_Basic"],
            10: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_1", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
            11: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            12: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            13: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier2_Chain_Boots_Set_1", "Med_Armorsmithing_Tier2_Chain_Shirt_2", "Med_Armorsmithing_Tier2_Chain_Pants_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            14: ["Med_Armorsmithing_Tier2_Chain_Armor_Set_1", "Med_Armorsmithing_Tier2_Chain_Pants_2", "Med_Armorsmithing_Tier3_Chain_Shirt", "Med_Armorsmithing_Tier3_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            15: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Boots_Set_1","Med_Armorsmithing_Tier1_Gather_Basic"],
            16: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            17: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            18: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            19: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            20: ["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            21 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            22 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            23 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            24 :["Med_Armorsmithing_Tier3_Chain_Armor_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants2", "Med_Armorsmithing_Tier3_Chain_Shirt2", "Med_Armorsmithing_Tier3_Chain_Helm_Set_1", "Med_Armorsmithing_Tier3_Chain_Pants","Med_Armorsmithing_Tier1_Gather_Basic"],
            25 :["Med_Armorsmithing_Tier2_Refine_Basic"],
            //20: ["Med_Armorsmithing_Tier2_Refine_Basic"],
            //19:["Chain Armor +4","Fancy Chain Pants","Fancy Chain Shirt","Chain Helm +4","Ornate Chain Pants","Upgrade Blacksmith","Upgrade Prospector","Hire an additional Prospector"],
            //20:["Forge Steel Rings and Scales"],

        },
    };

    definedTask["Platesmithing"] = {
        taskListName: "Platesmithing",
        taskName: "Armorsmithing_Heavy",
        level: {
            0: ["Hvy_Armorsmithing_Tier0_Intro"],
            1: ["Hvy_Armorsmithing_Tier1_Plate_Boots_1", "Hvy_Armorsmithing_Tier1_Plate_Shirt_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Hvy_Armorsmithing_Tier1_Plate_Armor_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier1_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Hvy_Armorsmithing_Tier1_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt", "Hvy_Armorsmithing_Tier2_Shield_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            8: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            9: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            10: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_1", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            11: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            12: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            13: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier2_Plate_Boots_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Shirt_2", "Hvy_Armorsmithing_Tier2_Plate_Pants_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            14: ["Hvy_Armorsmithing_Tier2_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier2_Plate_Pants_2", "Hvy_Armorsmithing_Tier3_Plate_Shirt", "Hvy_Armorsmithing_Tier3_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            15: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Boots_Set_1","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            16: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            17: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            18: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            19: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            20: ["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            21 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            22 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            23 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            24 :["Hvy_Armorsmithing_Tier3_Plate_Armor_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants2", "Hvy_Armorsmithing_Tier3_Plate_Shirt2", "Hvy_Armorsmithing_Tier3_Plate_Helm_Set_1", "Hvy_Armorsmithing_Tier3_Plate_Pants","Hvy_Armorsmithing_Tier1_Gather_Basic"],
            25 :["Hvy_Armorsmithing_Tier2_Refine_Basic"],
            //20: ["Hvy_Armorsmithing_Tier2_Refine_Basic"],
            //19:["Plate Armor +4","Fancy Plate Pants","Fancy Plate Shirt","Plate Helm +4","Ornate Plate Pants","Upgrade Armorer","Upgrade Miner","Hire an additional Miner"],
            //20:["Forge Steel Plates"],
        },
    };

    definedTask["Leatherworking"] = {
        taskListName: "Leatherworking",
        taskName: "Leatherworking",
        level: {
            /* No Residuum:
             0:["Leatherworking_Tier0_Intro_1"],
             //      1:["Leatherworking_Tier1_Darkleather_Boots_1"],
             1:["Leatherworking_Tier1_Hide_Boots_1"],
             //      1:["Leatherworking_Tier1_Leather_Boots_1"],
             //      1:["Leatherworking_Tier1_Leather_Shirt_1_Set2"],
             //      2:["Leatherworking_Tier1_Darkleather_Armor_1"],
             2:["Leatherworking_Tier1_Hide_Armor_1"],
             //      2:["Leatherworking_Tier1_Leather_Armor_1"],
             //      2:["Leatherworking_Tier1_Leather_Pants_1"],
             //      2:["Leatherworking_Tier1_Leather_Pants_1_Set2"],
             //      3:["Leatherworking_Tier1_Darkleather_Gloves_1"],
             3:["Leatherworking_Tier1_Hide_Gloves_1"],
             4:["Leatherworking_Tier1_Hide_Gloves_1"],
             5:["Leatherworking_Tier1_Hide_Gloves_1"],
             6:["Leatherworking_Tier1_Hide_Gloves_1"],
             //      3:["Leatherworking_Tier1_Leather_Gloves_1"],
             7:["Leatherworking_Tier2_Leather_Shirt"],
             //      7:["Leatherworking_Tier2_Leather_Shirt_Set2"],
             8:["Leatherworking_Tier2_Leather_Pants_1"],
             9:["Leatherworking_Tier2_Leather_Pants_1"],
             10:["Leatherworking_Tier2_Leather_Pants_1"],
             11:["Leatherworking_Tier2_Leather_Pants_1"],
             12:["Leatherworking_Tier2_Leather_Pants_1"],
             13:["Leatherworking_Tier2_Leather_Pants_1"],
             //      8:["Leatherworking_Tier2_Leather_Pants_1_Set2"],
             14:["Leatherworking_Tier3_Leather_Shirt"],
             //      14:["Leatherworking_Tier3_Leather_Shirt_Set2"],
             15:["Leatherworking_Tier3_Leather_Pants"],
             16:["Leatherworking_Tier3_Leather_Pants"],
             17:["Leatherworking_Tier3_Leather_Pants"],
             18:["Leatherworking_Tier3_Leather_Pants"],
             19:["Leatherworking_Tier3_Leather_Pants"],
             20:["Leatherworking_Tier3_Leather_Pants"],
             //      15:["Leatherworking_Tier3_Leather_Pants_Set2"],
             */

            0: ["Leatherworking_Tier0_Intro_1"],
            1: ["Leatherworking_Tier1_Leather_Boots_1", "Leatherworking_Tier1_Leather_Shirt_1","Leatherworking_Tier1_Gather_Basic"],
            2: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
            3: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            4: ["Leatherworking_Tier1_Leather_Armor_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            5: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            6: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier1_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            7: ["Leatherworking_Tier1_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
            8: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
            9: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt","Leatherworking_Tier1_Gather_Basic"],
            10: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_1", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2","Leatherworking_Tier1_Gather_Basic"],
            11: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
            12: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
            13: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Leatherworking_Tier2_Leather_Boots_Set_1", "Leatherworking_Tier2_Leather_Shirt_2", "Leatherworking_Tier2_Leather_Pants_1","Leatherworking_Tier1_Gather_Basic"],
            14: ["Leatherworking_Tier2_Leather_Armor_Set_1", "Leatherworking_Tier2_Leather_Pants_2", "Ornate Leatherworking_Tier1_Leather_Shirt_1", "Leatherworking_Tier3_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            15: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Boots_Set_1","Leatherworking_Tier1_Gather_Basic"],
            16: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            17: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            18: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            19: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            20: ["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            21 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            22 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            23 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            24 :["Leatherworking_Tier3_Leather_Armor_Set_1", "Leatherworking_Tier3_Leather_Pants2", "Leatherworking_Tier3_Leather_Shirt2", "Leatherworking_Tier3_Leather_Helm_Set_1", "Leatherworking_Tier3_Leather_Pants","Leatherworking_Tier1_Gather_Basic"],
            25 :["Leatherworking_Tier2_Refine_Basic"],
            //20: ["Leatherworking_Tier2_Refine_Basic"],
            //19:["Leather Armor +4","Fancy Leather Pants","Fancy Leather Shirt","Leather Helm +4","Ornate Leather Pants","Upgrade Tanner","Upgrade Skinner","Hire an additional Skinner"],
            //20:["Cure Tough Pelts"],
        },
    };

    definedTask["Tailoring"] = {
        taskListName: "Tailoring",
        taskName: "Tailoring",
        level: {
            // power
            //			      0:["Tailoring_Tier3_Cloth_Pants", "Tailoring_Tier3_Cloth_Shirt", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Shirt", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Boots_1"],
            // critical strike
            //			0:["Tailoring_Tier3_Cloth_Pants_Set2", "Tailoring_Tier3_Cloth_Shirt_Set2", "Tailoring_Tier2_Cloth_Pants_1_Set2", "Tailoring_Tier2_Cloth_Shirt_Set2", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Gloves_1", "Tailoring_Tier1_Cloth_Shirt_1_Set2"],

            0: ["Tailoring_Tier0_Intro"],
            1: [ "Tailoring_Tier1_Cloth_Shirt_1","Tailoring_Tier1_Cloth_Boots_1","Tailoring_Tier1_Gather_Basic"],
            2: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
            3: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            4: ["Tailoring_Tier1_Cloth_Armor_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            5: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            6: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier1_Cloth_Shirt_1", "Tailoring_Tier1_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            7: ["Tailoring_Tier1_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
            8: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic"],
            9: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt","Tailoring_Tier1_Gather_Basic"],
            10: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_1", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2","Tailoring_Tier1_Gather_Basic"],
            11: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
            12: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
            13: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier2_Cloth_Boots_Set_1", "Tailoring_Tier2_Cloth_Shirt_2", "Tailoring_Tier2_Cloth_Pants_1","Tailoring_Tier1_Gather_Basic"],
            14: ["Tailoring_Tier2_Cloth_Armor_Set_1", "Tailoring_Tier2_Cloth_Pants_2", "Tailoring_Tier3_Cloth_Shirt", "Tailoring_Tier3_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            15: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Boots_Set_1","Tailoring_Tier1_Gather_Basic"],
            16: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1","Tailoring_Tier1_Gather_Basic"],
            17: ["Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1","Tailoring_Tier1_Gather_Basic"],
            18: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            19: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            20: ["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            21 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            22 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            23 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            24 :["Tailoring_Tier3_Cloth_Armor_Set_3", "Tailoring_Tier3_Cloth_Armor_Set_2","Tailoring_Tier3_Cloth_Pants2", "Tailoring_Tier3_Cloth_Armor_Set_1", "Tailoring_Tier3_Cloth_Pants2_Set2", "Tailoring_Tier3_Cloth_Shirt2", "Tailoring_Tier3_Cloth_Helm_Set_1", "Tailoring_Tier3_Cloth_Pants","Tailoring_Tier1_Gather_Basic"],
            25 :["Tailoring_Tier2_Refine_Basic"],
            //20: ["Tailoring_Tier2_Refine_Basic"],
        },
    };

    definedTask["Artificing"] = {
        taskListName: "Artificing",
        taskName: "Artificing",
        level: {
            0: ["Artificing_Tier0_Intro_1"],
            1: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Symbol_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
            2: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Icon_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
            3: ["Artificing_Tier1_Pactblade_Convergence_1", "Artificing_Tier1_Icon_Virtuous_1", "Artificing_Tier1_Gather_Basic"],
            4: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
            5: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
            6: ["Artificing_Tier1_Pactblade_Convergence_2", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier1_Gather_Basic"],
            7: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            8: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            9: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            10: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            11: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            12: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            13: ["Artificing_Tier2_Pactblade_Temptation_3", "Artificing_Tier1_Icon_Virtuous_2", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            14: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            15: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            16: ["Artificing_Tier3_Pactblade_Temptation_4", "Artificing_Tier3_Icon_Virtuous_4", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            17: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            18: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            19: ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            20:  ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            21 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            22 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            23 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            24 : ["Artificing_Tier3_Pactblade_Temptation_5", "Artificing_Tier3_Icon_Virtuous_5", "Artificing_Tier3_Refine_Basic", "Artificing_Tier2_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            25 :["Artificing_Tier2_Refine_Basic"],
            //20: ["Artificing_Tier2_Refine_Basic"],
            //19:["Virtuous Icon +5","Upgrade Engraver","Upgrade Carver","Hire an additional Carver"],
            //20:["7:Craft Ornamental metal and Carved Wood"],
        },
    };

    definedTask["Weaponsmithing_Axe"] = {
        taskListName: "Weaponsmithing_Axe",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],

            /* No use of Residuum:
             1: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass", "Weaponsmithing_Tier1_Gather_Basic"],
             */
            // We don't have axes until level 2
            1: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Greataxe_1", "Weaponsmithing_Tier1_Battleaxe_1", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Greataxe_2", "Weaponsmithing_Tier1_Battleaxe_2", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Greataxe_2", "Weaponsmithing_Tier1_Battleaxe_2", "Weaponsmithing_Tier1_Gather_Basic"],
            // Just make resources at the new resource level -- they'll be used at higher levels
            // (even though the swords at this level seem more efficient -- they require lower level swords, which we haven't made and don't have inventory space for)
            // (we'll make 24 sets (of 2 each) "refined" resources in 16 hours (with no speed bonuses), which will be used by levels 8 and 9 alone
            7: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            8: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            9: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            10: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            11: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            12: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            13: ["Weaponsmithing_Tier2_Greataxe_3", "Weaponsmithing_Tier2_Battleaxe_3", "Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            // (we'll make 160 sets (of 2 each) "refined" resources in 133.33 hours (5.55 days) (with no speed bonuses)
            14: ["Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            15: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            16: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            17: ["Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            // If we have Fundamental Fire or Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
            18: ["Weaponsmithing_Tier3_Greataxe_Set_2", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_Set_2", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            19: ["Weaponsmithing_Tier3_Greataxe_Set_2", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_Set_2", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            20 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            21 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            22 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            23 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            24 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic", "Weaponsmithing_Tier3_Gather_Basic"],
            25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // 20: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],   // We want Gather here, because the raw materials can be used in other profs
            // If we actually want experience at level 20, these would be the tasks:
            //20: ["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
        },
    };

    definedTask["Weaponsmithing_Bow"] = {
        taskListName: "Weaponsmithing_Bow",
        taskName: "Weaponsmithing",
        level: {
            1: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1"],
            5: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            8: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            9: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            10: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            11: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            12: ["Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier1_Longbow_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            14: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // If we have Desert Rose, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
            17: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Longbow_Set_2", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier2_Longbow_3", "Weaponsmithing_Tier1_Longbow_2", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greataxe_4", "Weaponsmithing_Tier3_Battleaxe_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // 20: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],  // We want Gather here, because the raw materials can be used in other profs
            // If we actually want experience at level 20, these would be the tasks:
            //20: ["Weaponsmithing_Tier3_Longbow_Set_3", "Weaponsmithing_Tier3_Greatsword_Set_3", "Weaponsmithing_Tier3_Longsword_Set_3", "Weaponsmithing_Tier3_Dagger_Set_3", "Weaponsmithing_Tier3_Blades_Set_3", "Weaponsmithing_Tier3_Longbow_4", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
        },
    };

    definedTask["Weaponsmithing_Dagger"] = {
        taskListName: "Weaponsmithing_Dagger",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],
            1: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            8: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            9: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            10: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            11: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            12: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            13: ["Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            14: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
            17: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier3_Dagger_Set_2", "Weaponsmithing_Tier3_Dagger_4", "Weaponsmithing_Tier2_Dagger_3", "Weaponsmithing_Tier1_Dagger_2", "Weaponsmithing_Tier1_Dagger_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
        },
    };

    definedTask["Weaponsmithing_Greatsword"] = {
        taskListName: "Weaponsmithing_Greatsword",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],
            1: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            8: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            9: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            10: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            11: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            12: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            13: ["Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            14: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
            17: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier3_Greatsword_Set_2", "Weaponsmithing_Tier3_Greatsword_4", "Weaponsmithing_Tier2_Greatsword_3", "Weaponsmithing_Tier1_Greatsword_2", "Weaponsmithing_Tier1_Greatsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
        },
    };

    definedTask["Weaponsmithing_Longsword"] = {
        taskListName: "Weaponsmithing_Longsword",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],
            1: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            8: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            9: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            10: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            11: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            12: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            13: ["Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier2_Refine_Basic_Mass", "Weaponsmithing_Tier2_Gather_Basic_Mass"],
            14: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            // If we have Fundamental Ice, we get a bit more exp by using it (and both options are not dependancies of anything else, unlike lower levels)
            17: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier3_Longsword_Set_2", "Weaponsmithing_Tier3_Longsword_4", "Weaponsmithing_Tier2_Longsword_3", "Weaponsmithing_Tier1_Longsword_2", "Weaponsmithing_Tier1_Longsword_1", "Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
        },
    };
    definedTask["Alchemy"] = {
        taskListName: "Alchemy",
        taskName: "Alchemy",
        level: {
            0: ["Alchemy_Tier0_Intro_1"],
            1: ["Alchemy_Tier1_Experiment_Rank2", "Alchemy_Tier1_Experimentation_Rank1"],
            2: ["Alchemy_Tier1_Experiment_Rank3", "Alchemy_Tier1_Experimentation_Rank2"],
            3: ["Alchemy_Tier1_Experiment_Rank4", "Alchemy_Tier1_Experimentation_Rank3"],
            4: ["Alchemy_Tier1_Experiment_Rank5", "Alchemy_Tier1_Experimentation_Rank4"],
            5: ["Alchemy_Tier1_Experiment_Rank6", "Alchemy_Tier1_Experimentation_Rank5"],
            6: ["Alchemy_Tier1_Experiment_Rank7", "Alchemy_Tier1_Experimentation_Rank6"],
            7: ["Alchemy_Tier2_Experiment_Rank08", "Alchemy_Tier2_Experimentation_Rank07"],
            8: ["Alchemy_Tier2_Experiment_Rank09", "Alchemy_Tier2_Experimentation_Rank08"],
            9: ["Alchemy_Tier2_Experiment_Rank10", "Alchemy_Tier2_Experimentation_Rank09"],
            10: ["Alchemy_Tier2_Experiment_Rank11", "Alchemy_Tier2_Experimentation_Rank10"],
            11: ["Alchemy_Tier2_Experiment_Rank12", "Alchemy_Tier2_Experimentation_Rank11"],
            12: ["Alchemy_Tier2_Experiment_Rank13", "Alchemy_Tier2_Experimentation_Rank12"],
            13: ["Alchemy_Tier2_Experiment_Rank14", "Alchemy_Tier2_Experimentation_Rank13"],
            14: ["Alchemy_Tier3_Experiment_Rank15", "Alchemy_Tier3_Experimentation_Rank14"],
            15: ["Alchemy_Tier3_Experiment_Rank16", "Alchemy_Tier3_Experimentation_Rank15"],
            16: ["Alchemy_Tier3_Experiment_Rank17", "Alchemy_Tier3_Experimentation_Rank16"],
            17: ["Alchemy_Tier3_Experiment_Rank18", "Alchemy_Tier3_Experimentation_Rank17"],
            18: ["Alchemy_Tier3_Experiment_Rank19", "Alchemy_Tier3_Experimentation_Rank18"],
            19: ["Alchemy_Tier3_Experiment_Rank20", "Alchemy_Tier3_Experimentation_Rank19"],
            //20: ["Alchemy_Tier3_Protection_Potion_Major", "Alchemy_Tier2_Aquaregia", "Alchemy_Tier3_Refine_Basic", "Alchemy_Tier3_Gather_Components"], //disable for mod6
            20 : ["Alchemy_Tier3_Experiment_Rank21", "Alchemy_Tier3_Experimentation_Rank20"], // Enable for mod6
            21 : ["Alchemy_Tier4_Experiment_Rank22", "Alchemy_Tier4_Experimentation_Rank21"],
            22 : ["Alchemy_Tier4_Experiment_Rank23", "Alchemy_Tier4_Experimentation_Rank22"], //,"Alchemy_Tier4_Aquaregia_2"],
            23 : ["Alchemy_Tier4_Experiment_Rank24", "Alchemy_Tier4_Experimentation_Rank23"],
            24 : ["Alchemy_Tier4_Experiment_Rank25", "Alchemy_Tier4_Experimentation_Rank24"],
            25 : ["Alchemy_Tier4_Experimentation_Rank25","Alchemy_Tier4_Create_Elemental_Unified","Alchemy_Tier4_Create_Elemental_Aggregate","Alchemy_Tier4_Aquaregia_2"], //"Alchemy_Tier2_Aquaregia", "Alchemy_Tier3_Refine_Basic","Alchemy_Tier4_Potency_Potion_Superior", "Alchemy_Tier4_Protection_Potion_Superior"],
        },
    };
	//more tasks GM
	
	definedTask["Weaponsmithing_Axe2"] = {
        taskListName: "Weaponsmithing_Axe2",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],
            1: ["Weaponsmithing_Tier1_Gather_Basic"],
            2: ["Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Gather_Basic"],
            8: ["Weaponsmithing_Tier2_Gather_Basic"],
            9: ["Weaponsmithing_Tier2_Gather_Basic"],
            10: ["Weaponsmithing_Tier2_Gather_Basic"],
            11: ["Weaponsmithing_Tier2_Gather_Basic"],
            12: ["Weaponsmithing_Tier2_Gather_Basic"],
            13: ["Weaponsmithing_Tier2_Gather_Basic"],
            14: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier4_Gather_Basic_Mass"],

        },
    };
	definedTask["Jewelcrafting2"] = {
        taskListName: "Jewelcrafting2",
        taskName: "Jewelcrafting",
        level: {

            0: ["Jewelcrafting_Tier0_Intro"],
            1: ["Jewelcrafting_Tier1_Gather_Basic"],
            2: ["Jewelcrafting_Tier1_Gather_Basic"],
            3: ["Jewelcrafting_Tier1_Gather_Basic"],
            4: ["Jewelcrafting_Tier1_Gather_Basic"],
            5: ["Jewelcrafting_Tier1_Gather_Basic"],
            6: ["Jewelcrafting_Tier1_Gather_Basic"],
            7: ["Jewelcrafting_Tier2_Gather_Basic"],
            8: ["Jewelcrafting_Tier2_Gather_Basic"],
            9: ["Jewelcrafting_Tier2_Gather_Basic"],
            10: ["Jewelcrafting_Tier2_Gather_Basic"],
            11: ["Jewelcrafting_Tier2_Gather_Basic"],
            12: ["Jewelcrafting_Tier2_Gather_Basic"],
            13: ["Jewelcrafting_Tier2_Gather_Basic"],
            14: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
            15: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
            16: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
			17: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
			18: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
			19: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
			20: ["Jewelcrafting_Tier3_Gather_Basic_Mass"],
			21: ["Jewelcrafting_Tier4_Gather_Basic_Mass"],
			22: ["Jewelcrafting_Tier4_Gather_Basic_Mass"],
			23: ["Jewelcrafting_Tier4_Gather_Basic_Mass"],
			24: ["Jewelcrafting_Tier4_Gather_Basic_Mass"],
			25: ["Jewelcrafting_Tier4_Gather_Basic_Mass"],
        },
    };

	    definedTask["Tailoring2"] = {
        taskListName: "Tailoring2",
        taskName: "Tailoring",
        level: {
            
			0: ["Tailoring_Tier0_Intro"],
            1: ["Tailoring_Tier1_Gather_Basic"],
            2: ["Tailoring_Tier1_Gather_Basic"],
            3: ["Tailoring_Tier1_Gather_Basic"],
            4: ["Tailoring_Tier1_Gather_Basic"],
            5: ["Tailoring_Tier1_Gather_Basic"],
            6: ["Tailoring_Tier1_Gather_Basic"],
            7: ["Tailoring_Tier2_Gather_Basic"],
            8: ["Tailoring_Tier2_Gather_Basic"],
            9: ["Tailoring_Tier2_Gather_Basic"],
            10: ["Tailoring_Tier2_Gather_Basic"],
            11: ["Tailoring_Tier2_Gather_Basic"],
            12: ["Tailoring_Tier2_Gather_Basic"],
            13: ["Tailoring_Tier2_Gather_Basic"],
            14: ["Tailoring_Tier3_Gather_Basic_Mass"],
            15: ["Tailoring_Tier3_Gather_Basic_Mass"],
            16: ["Tailoring_Tier3_Gather_Basic_Mass"],
			17: ["Tailoring_Tier3_Gather_Basic_Mass"],
			18: ["Tailoring_Tier3_Gather_Basic_Mass"],
			19: ["Tailoring_Tier3_Gather_Basic_Mass"],
			20: ["Tailoring_Tier3_Gather_Basic_Mass"],
			21: ["Tailoring_Tier4_Gather_Basic_Mass"],
			22: ["Tailoring_Tier4_Gather_Basic_Mass"],
			23: ["Tailoring_Tier4_Gather_Basic_Mass"],
			24: ["Tailoring_Tier4_Gather_Basic_Mass"],
			25: ["Tailoring_Tier4_Gather_Basic_Mass"],
        },
    };
	
	    definedTask["Mailsmithing2"] = {
        taskListName: "Mailsmithing2",
        taskName: "Armorsmithing_Med",
        level: {
        
            0: ["Med_Armorsmithing_Tier0_Intro"],
            1: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Med_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            8: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            9: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            10: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            11: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            12: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            13: ["Med_Armorsmithing_Tier2_Gather_Basic"],
            14: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            20: ["Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
           
        },
    };
	
	definedTask["Platesmithing2"] = {
        taskListName: "Platesmithing2",
        taskName: "Armorsmithing_Heavy",
        level: {
            0: ["Hvy_Armorsmithing_Tier0_Intro"],
            1: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Hvy_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            8: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            9: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            10: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            11: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            12: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            13: ["Hvy_Armorsmithing_Tier2_Gather_Basic"],
            14: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            20: ["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
        },
    };
	
	definedTask["Leatherworking2"] = {
        taskListName: "Leatherworking2",
        taskName: "Leatherworking",
        level: {
            0: ["Leatherworking_Tier0_Intro"],
            1: ["Leatherworking_Tier1_Gather_Basic"],
            2: ["Leatherworking_Tier1_Gather_Basic"],
            3: ["Leatherworking_Tier1_Gather_Basic"],
            4: ["Leatherworking_Tier1_Gather_Basic"],
            5: ["Leatherworking_Tier1_Gather_Basic"],
            6: ["Leatherworking_Tier1_Gather_Basic"],
            7: ["Leatherworking_Tier2_Gather_Basic"],
            8: ["Leatherworking_Tier2_Gather_Basic"],
            9: ["Leatherworking_Tier2_Gather_Basic"],
            10: ["Leatherworking_Tier2_Gather_Basic"],
            11: ["Leatherworking_Tier2_Gather_Basic"],
            12: ["Leatherworking_Tier2_Gather_Basic"],
            13: ["Leatherworking_Tier2_Gather_Basic"],
            14: ["Leatherworking_Tier3_Gather_Basic_Mass"],
            15: ["Leatherworking_Tier3_Gather_Basic_Mass"],
            16: ["Leatherworking_Tier3_Gather_Basic_Mass"],
			17: ["Leatherworking_Tier3_Gather_Basic_Mass"],
			18: ["Leatherworking_Tier3_Gather_Basic_Mass"],
			19: ["Leatherworking_Tier3_Gather_Basic_Mass"],
			20: ["Leatherworking_Tier3_Gather_Basic_Mass"],
			21: ["Leatherworking_Tier4_Gather_Basic_Mass"],
			22: ["Leatherworking_Tier4_Gather_Basic_Mass"],
			23: ["Leatherworking_Tier4_Gather_Basic_Mass"],
			24: ["Leatherworking_Tier4_Gather_Basic_Mass"],
			25: ["Leatherworking_Tier4_Gather_Basic_Mass"],
        },
    };
	
	 definedTask["Artificing2"] = {
        taskListName: "Artificing2",
        taskName: "Artificing",
        level: {
            0: ["Artificing_Tier0_Intro_1"],
            1: ["Artificing_Tier1_Gather_Basic"],
            2: ["Artificing_Tier1_Gather_Basic"],
            3: ["Artificing_Tier1_Gather_Basic"],
            4: ["Artificing_Tier1_Gather_Basic"],
            5: ["Artificing_Tier1_Gather_Basic"],
            6: ["Artificing_Tier1_Gather_Basic"],
            7: ["Artificing_Tier2_Gather_Basic"],
            8: ["Artificing_Tier2_Gather_Basic"],
            9: ["Artificing_Tier2_Gather_Basic"],
            10: ["Artificing_Tier2_Gather_Basic"],
            11: ["Artificing_Tier2_Gather_Basic"],
            12: ["Artificing_Tier2_Gather_Basic"],
            13: ["Artificing_Tier2_Gather_Basic"],
            14: ["Artificing_Tier3_Gather_Basic_Mass"],
            15: ["Artificing_Tier3_Gather_Basic_Mass"],
            16: ["Artificing_Tier3_Gather_Basic_Mass"],
            17: ["Artificing_Tier3_Gather_Basic_Mass"],
            18: ["Artificing_Tier3_Gather_Basic_Mass"],
            19: ["Artificing_Tier3_Gather_Basic_Mass"],
            20:  ["Artificing_Tier3_Gather_Basic_Mass"],
            21 : ["Artificing_Tier4_Gather_Basic_Mass"],
            22 : ["Artificing_Tier4_Gather_Basic_Mass"],
            23 : ["Artificing_Tier4_Gather_Basic_Mass"],
            24 : ["Artificing_Tier4_Gather_Basic_Mass"],
            25 :["Artificing_Tier4_Gather_Basic_Mass"],
        },
    };
	 //more tasks GM RF
	 
	 definedTask["Weaponsmithing_Axe3"] = {
        taskListName: "Weaponsmithing_Axe3",
        taskName: "Weaponsmithing",
        level: {
            0: ["Weaponsmithing_Tier0_Intro"],
            1: ["Weaponsmithing_Tier1_Gather_Basic", "Weaponsmithing_Tier1_Refine_Basic"],
            2: ["Weaponsmithing_Tier1_Refine_Basic", "Weaponsmithing_Tier1_Gather_Basic"],
            3: ["Weaponsmithing_Tier1_Refine_Basic", "Weaponsmithing_Tier1_Gather_Basic"],
            4: ["Weaponsmithing_Tier1_Refine_Basic", "Weaponsmithing_Tier1_Gather_Basic"],
            5: ["Weaponsmithing_Tier1_Refine_Basic", "Weaponsmithing_Tier1_Gather_Basic"],
            6: ["Weaponsmithing_Tier1_Refine_Basic", "Weaponsmithing_Tier1_Gather_Basic"],
            7: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            8: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            9: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            10: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            11: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            12: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            13: ["Weaponsmithing_Tier2_Refine_Basic", "Weaponsmithing_Tier2_Gather_Basic"],
            14: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            20 :["Weaponsmithing_Tier3_Refine_Basic_Mass", "Weaponsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Weaponsmithing_Tier4_Refine_Basic_Mass", "Weaponsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Weaponsmithing_Tier4_Refine_Basic_Mass", "Weaponsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Weaponsmithing_Tier4_Refine_Basic_Mass", "Weaponsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Weaponsmithing_Tier4_Refine_Basic_Mass", "Weaponsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Weaponsmithing_Tier4_Refine_Basic_Mass", "Weaponsmithing_Tier4_Gather_Basic_Mass"],

        },
    };
	definedTask["Jewelcrafting3"] = {
        taskListName: "Jewelcrafting3",
        taskName: "Jewelcrafting",
        level: {

            0: ["Jewelcrafting_Tier0_Intro"],
            1: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            2: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            3: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            4: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            5: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            6: ["Jewelcrafting_Tier1_Refine_Basic", "Jewelcrafting_Tier1_Gather_Basic"],
            7: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            8: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            9: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            10: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            11: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            12: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            13: ["Jewelcrafting_Tier2_Refine_Basic", "Jewelcrafting_Tier2_Gather_Basic"],
            14: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
            15: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
            16: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
			17: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
			18: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
			19: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
			20: ["Jewelcrafting_Tier3_Refine_Basic_Mass", "Jewelcrafting_Tier3_Gather_Basic_Mass"],
			21: ["Jewelcrafting_Tier4_Refine_Basic_Mass", "Jewelcrafting_Tier4_Gather_Basic_Mass"],
			22: ["Jewelcrafting_Tier4_Refine_Basic_Mass", "Jewelcrafting_Tier4_Gather_Basic_Mass"],
			23: ["Jewelcrafting_Tier4_Refine_Basic_Mass", "Jewelcrafting_Tier4_Gather_Basic_Mass"],
			24: ["Jewelcrafting_Tier4_Refine_Basic_Mass", "Jewelcrafting_Tier4_Gather_Basic_Mass"],
			25: ["Jewelcrafting_Tier4_Refine_Basic_Mass", "Jewelcrafting_Tier4_Gather_Basic_Mass"],
        },
    };

	    definedTask["Tailoring3"] = {
        taskListName: "Tailoring3",
        taskName: "Tailoring",
        level: {
            
			0: ["Tailoring_Tier0_Intro"],
            1: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            2: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            3: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            4: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            5: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            6: ["Tailoring_Tier1_Refine_Basic", "Tailoring_Tier1_Gather_Basic"],
            7: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            8: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            9: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            10: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            11: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            12: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            13: ["Tailoring_Tier2_Refine_Basic", "Tailoring_Tier2_Gather_Basic"],
            14: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
            15: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
            16: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
			17: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
			18: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
			19: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
			20: ["Tailoring_Tier3_Refine_Basic", "Tailoring_Tier3_Gather_Basic"],
			21: ["Tailoring_Tier4_Refine_Basic", "Tailoring_Tier4_Gather_Basic"],
			22: ["Tailoring_Tier4_Refine_Basic", "Tailoring_Tier4_Gather_Basic"],
			23: ["Tailoring_Tier4_Refine_Basic", "Tailoring_Tier4_Gather_Basic"],
			24: ["Tailoring_Tier4_Refine_Basic", "Tailoring_Tier4_Gather_Basic"],
			25: ["Tailoring_Tier4_Refine_Basic", "Tailoring_Tier4_Gather_Basic"],
        },
    };
	
	    definedTask["Mailsmithing3"] = {
        taskListName: "Mailsmithing3",
        taskName: "Armorsmithing_Med",
        level: {
        
            0: ["Med_Armorsmithing_Tier0_Intro"],
            1: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Med_Armorsmithing_Tier1_Refine_Basic", "Med_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            8: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            9: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            10: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            11: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            12: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            13: ["Med_Armorsmithing_Tier2_Refine_Basic", "Med_Armorsmithing_Tier2_Gather_Basic"],
            14: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            20: ["Med_Armorsmithing_Tier3_Refine_Basic_Mass", "Med_Armorsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Med_Armorsmithing_Tier4_Refine_Basic_Mass", "Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Med_Armorsmithing_Tier4_Refine_Basic_Mass", "Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Med_Armorsmithing_Tier4_Refine_Basic_Mass", "Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Med_Armorsmithing_Tier4_Refine_Basic_Mass", "Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Med_Armorsmithing_Tier4_Refine_Basic_Mass", "Med_Armorsmithing_Tier4_Gather_Basic_Mass"],
           
        },
    };
	
	definedTask["Platesmithing3"] = {
        taskListName: "Platesmithing3",
        taskName: "Armorsmithing_Heavy",
        level: {
            0: ["Hvy_Armorsmithing_Tier0_Intro"],
            1: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            2: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            3: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            4: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            5: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            6: ["Hvy_Armorsmithing_Tier1_Refine_Basic", "Hvy_Armorsmithing_Tier1_Gather_Basic"],
            7: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            8: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            9: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            10: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            11: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            12: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            13: ["Hvy_Armorsmithing_Tier2_Refine_Basic", "Hvy_Armorsmithing_Tier2_Gather_Basic"],
            14: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            15: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            16: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            17: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            18: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            19: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            20: ["Hvy_Armorsmithing_Tier3_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier3_Gather_Basic_Mass"],
            21 :["Hvy_Armorsmithing_Tier4_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            22 :["Hvy_Armorsmithing_Tier4_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            23 :["Hvy_Armorsmithing_Tier4_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            24 :["Hvy_Armorsmithing_Tier4_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
            25 :["Hvy_Armorsmithing_Tier4_Refine_Basic_Mass", "Hvy_Armorsmithing_Tier4_Gather_Basic_Mass"],
        },
    };
	
	definedTask["Leatherworking3"] = {
        taskListName: "Leatherworking3",
        taskName: "Leatherworking",
        level: {
            0: ["Leatherworking_Tier0_Intro"],
            1: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            2: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            3: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            4: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            5: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            6: ["Leatherworking_Tier1_Refine_Basic", "Leatherworking_Tier1_Gather_Basic"],
            7: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            8: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            9: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            10: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            11: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            12: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            13: ["Leatherworking_Tier2_Refine_Basic", "Leatherworking_Tier2_Gather_Basic"],
            14: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
            15: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
            16: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
			17: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
			18: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
			19: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
			20: ["Leatherworking_Tier3_Refine_Basic_Mass", "Leatherworking_Tier3_Gather_Basic_Mass"],
			21: ["Leatherworking_Tier4_Refine_Basic_Mass", "Leatherworking_Tier4_Gather_Basic_Mass"],
			22: ["Leatherworking_Tier4_Refine_Basic_Mass", "Leatherworking_Tier4_Gather_Basic_Mass"],
			23: ["Leatherworking_Tier4_Refine_Basic_Mass", "Leatherworking_Tier4_Gather_Basic_Mass"],
			24: ["Leatherworking_Tier4_Refine_Basic_Mass", "Leatherworking_Tier4_Gather_Basic_Mass"],
			25: ["Leatherworking_Tier4_Refine_Basic_Mass", "Leatherworking_Tier4_Gather_Basic_Mass"],
        },
    };
	
	 definedTask["Artificing3"] = {
        taskListName: "Artificing3",
        taskName: "Artificing",
        level: {
            0: ["Artificing_Tier0_Intro_1"],
            1: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            2: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            3: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            4: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            5: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            6: ["Artificing_Tier1_Refine_Basic", "Artificing_Tier1_Gather_Basic"],
            7: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            8: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            9: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            10: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            11: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            12: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            13: ["Artificing_Tier2_Refine_Basic", "Artificing_Tier2_Gather_Basic"],
            14: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            15: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            16: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            17: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            18: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            19: ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            20:  ["Artificing_Tier3_Refine_Basic_Mass", "Artificing_Tier3_Gather_Basic_Mass"],
            21 : ["Artificing_Tier4_Refine_Basic_Mass", "Artificing_Tier4_Gather_Basic_Mass"],
            22 : ["Artificing_Tier4_Refine_Basic_Mass", "Artificing_Tier4_Gather_Basic_Mass"],
            23 : ["Artificing_Tier4_Refine_Basic_Mass", "Artificing_Tier4_Gather_Basic_Mass"],
            24 : ["Artificing_Tier4_Refine_Basic_Mass", "Artificing_Tier4_Gather_Basic_Mass"],
            25 :["Artificing_Tier4_Refine_Basic_Mass", "Artificing_Tier4_Gather_Basic_Mass"],
        },
    };
	
    // Load Settings
    var settingnames = [
        {name: 'paused', title: 'Pause Script', def: false, type: 'checkbox', tooltip: 'Disable All Automation'},
        {name: 'debug', title: 'Enable Debug', def: false, type: 'checkbox', tooltip: 'Enable all debug output to console', onsave: function (newValue, oldValue) {
            console = newValue ? unsafeWindow.console || fouxConsole : fouxConsole;
        }},
        {name: 'optionals', title: 'Fill Optional Assets', def: false, type: 'checkbox', tooltip: 'Enable to include selecting the optional assets of tasks'},
        {name: 'autopurchase', title: 'Auto Purchase Resources', def: false, type: 'checkbox', tooltip: 'Automatically purchase required resources from gateway shop (100 at a time)'},
        {name: 'trainassets', title: 'Train Assets', def: false, type: 'checkbox', tooltip: 'Enable training/upgrading of asset worker resources'},
        //{name: 'refinead', title: 'Refine AD', def: false, type: 'checkbox', tooltip: 'Enable refining of AD on character switch'},
        {name: 'openrewards', title: 'Open Reward Chests', def: false, type: 'checkbox', tooltip: 'Enable opeing of leadership chests on character switch'}, //MAC-NW
        {name: 'dailySCA', title: 'Daily SCA roll', def: false, type: 'checkbox', tooltip: 'Runs daily SCA rolls when no task is near to finish'}, //MAC-NW
        {name: 'autoreload', title: 'Auto Reload', def: false, type: 'checkbox', tooltip: 'Enabling this will reload the gateway periodically. (Ensure Auto Login is enabled)'},
        {name: 'autovendor_junk', title: 'Vendor junk..', def: false, type: 'checkbox', tooltip: 'Vendor all (currently) winterfest fireworks+lanterns'}, //MAC-NW
        {name: 'autovendor_kits_altars_limit', title: 'Maintain Altar Node Kit Stacks', def: false, type: 'checkbox', tooltip: 'Limit skill kits stacks to 50/Altars80, vendor kits unusable by class, remove all if player has one bag or full bags'}, // edited by RottenMind
        {name: 'autovendor_kits_altars_all', title: 'Vendor All Altar Node Kit Stacks', def: false, type: 'checkbox', tooltip: 'Sell ALL skill kits  Altars.'}, // RottenMind
        {name: 'autovendor_profresults', title: 'Vendor Prof Crafted & Gathered Items', def: false, type: 'checkbox', tooltip: 'Vendor off Tier 1 to 5 items produced and reused for leveling crafting & Gathered professions items.'},
        {name: 'autovendor_pots_1_2', title: 'Vendor potions (lvl 1 - 29)', def: false, type: 'checkbox', tooltip: 'Vendor Tidespan, Force, Fortification, Reflexes, Accuracy,Rejuvenation -potions, if Alchemy not active.'}, //MAC-NW
        {name: 'autovendor_pots_3_4', title: 'Vendor potions (lvl 30 - 59)', def: false, type: 'checkbox', tooltip: 'Vendor Tidespan, Force, Fortification, Reflexes, Accuracy,Rejuvenation -potions, if Alchemy not active.'}, //MAC-NW
        {name: 'autovendor_pots_5', title: 'Vendor potions (lvl 60)', def: false, type: 'checkbox', tooltip: 'Vendor Tidespan, Force, Fortification, Reflexes, Accuracy,Rejuvenation -potions, if Alchemy not active.'}, //MAC-NW
        {name: 'autovendor_pots_healing', title: 'Vendor Healing potions (Rank 1 -5)', def: false, type: 'checkbox', tooltip: 'Vendor all Rank 1 - 5 healing potions found in player bags, if Alchemy not active.'}, //MAC-NW
        //{name: 'autovendor_rank1', title: 'Auto Vendor enchants & runes Rank 1', def: false, type: 'checkbox', tooltip: 'Vendor all Rank 1 enchantments & runestones found in player bags'}, //MAC-NW
        {name: 'autovendor_rank2', title: 'Vendor enchants & runes Rank 1-2', def: false, type: 'checkbox', tooltip: 'Vendor all Rank 2 enchantments & runestones found in player bags'}, //MAC-NW
        {name: 'autovendor_rank3', title: 'Vendor enchants & runes Rank 3', def: false, type: 'checkbox', tooltip: 'Vendor all Rank 3 enchantments & runestones found in player bags'}, // edited by RottenMind
        {name: 'level_20_skip', title: 'Skip level 20', def: false, type: 'checkbox', tooltip: 'All level 20 profession slots are skipped NOT Leadership'},
        {name: 'purchasePorridge', title: 'Purchase Porridge', def: true, type: 'checkbox', tooltip: 'Purchase Porridge to Advance Leadership Rank'},
        {name: 'level_25_skip', title: 'Skip level 25', def: false, type: 'checkbox', tooltip: 'All level 25 profession slots are skipped NOT Leadership, supersedes skip 20'},
        {name: 'easy_start', title: 'Automatic Banker', def: false, type: 'checkbox', tooltip: 'Get Banker first character etc. works best after reset, turn off if need other character.', border: true},
        {name: 'nw_username', title: 'Neverwinter Username', def: '', type: 'text', tooltip: ''},
        {name: 'nw_password', title: 'Neverwinter Password', def: '', type: 'password', tooltip: ''},
        // MAC-NW AD Consolidation
        {name: 'autoexchange', title: 'Consolidate AD via ZEX', def: false, type: 'checkbox', tooltip: 'Automatically attempt to post, cancel and withdraw AD via ZEX and consolidate to designated character', border: true},
        {name: 'bankchar', title: 'Character Name of Banker', def: '', type: 'text', tooltip: 'Enter name of the character to hold account AD'},
        {name: 'banktransmin', title: 'Min AD for Transfer', def: '5000', type: 'text', tooltip: 'Enter minimum AD limit for it to be cosidered for transfer off a character'},
        {name: 'bankcharmin', title: 'Min Character balance', def: '600', type: 'text', tooltip: 'Enter the amount of AD to always keep available on characters'},
        {name: 'banktransrate', title: 'AD per Zen Rate (in zen)', def: '300', type: 'text', tooltip: 'Enter default rate to use for transfering through ZEX'},
        {name: 'charcount', title: 'Enter number of characters to use (Save and Apply to update settings form)', def: '1', type: 'text', tooltip: 'Enter number of characters to use (Save and Apply to update settings form)', border: true},
        // MAC-NW
    ];

        // Load local settings cache (unsecured)
        var settings = {};
        for (var i = 0; i < settingnames.length; i++) {
        // Ignore label types
        if (settingnames[i].type === 'label') {
            continue;
        }
    settings[settingnames[i].name] = GM_getValue(settingnames[i].name, settingnames[i].def);
    // call the onsave for the setting if it exists
    if (typeof (settingnames[i].onsave) === "function") {
        console.log("Calling 'onsave' for", settingnames[i].name);
        settingnames[i].onsave(settings[settingnames[i].name], settings[settingnames[i].name]);
    }
}

 if (settings["charcount"] < 1) {
 settings["charcount"] = 1;
 }
 if (settings["charcount"] > 99) {
    settings["charcount"] = 99;
}

// Profession priority list by order
var tasklist = [
    definedTask["Summer Event"],
    definedTask["Winter Event"],
    definedTask["Siege Event"],
    definedTask["Black Ice Shaping"],
    definedTask["Alchemy"],
    definedTask["Weaponsmithing_Axe"],
    /*definedTask["Weaponsmithing_Bow"],
         definedTask["Weaponsmithing_Dagger"],
         definedTask["Weaponsmithing_Greatsword"],
         definedTask["Weaponsmithing_Longsword"],*/
    definedTask["Artificing"],
    definedTask["Jewelcrafting"],
    definedTask["Mailsmithing"],
    definedTask["Platesmithing"],
    definedTask["Leatherworking"],
    definedTask["Tailoring"],
    definedTask["Leadership"],
    definedTask["Leadership XP"],
	definedTask["Weaponsmithing_Axe2"],
	definedTask["Artificing2"],
    definedTask["Jewelcrafting2"],
    definedTask["Mailsmithing2"],
    definedTask["Platesmithing2"],
    definedTask["Leatherworking2"],
    definedTask["Tailoring2"],
	definedTask["Weaponsmithing_Axe3"],
	definedTask["Artificing3"],
    definedTask["Jewelcrafting3"],
    definedTask["Mailsmithing3"],
    definedTask["Platesmithing3"],
    definedTask["Leatherworking3"],
    definedTask["Tailoring3"],
];

    var charSettings = [];

for (var i = 0; i < settings["charcount"]; i++) {
    charSettings.push({name: 'nw_charname' + i, title: 'Character', def: 'Character ' + (i + 1), type: 'text', tooltip: 'Characters Name,(set first character name to Character 1 for Automatic char.name fill.'});
    charSettings.push({name: 'Winterevent' + i, title: 'Winter Event', def: '0', type: 'text', tooltip: 'Number of slots to assign to WinterEvent'});
    charSettings.push({name: 'Leadership_XP' + i, title: 'Leadership XP/RP', def: '9', type: 'text', tooltip: 'Number of slots to assign to Leadership focused on XP and after level 21 to refine stones.'});
    charSettings.push({name: 'SummerEvent' + i, title: 'Summer Event', def: '0', type: 'text', tooltip: 'Number of slots to assign to Summer Event'});
    charSettings.push({name: 'Blackice' + i, title: 'Black Ice Shaping', def: '0', type: 'text', tooltip: 'Number of slots to assign to BIS'});
    charSettings.push({name: 'Event_Siege' + i, title: 'Siege Event', def: '0', type: 'text', tooltip: 'Number of slots to assign to Siege Event'});
    charSettings.push({name: 'Alchemy' + i, title: 'Alchemy', def: '0', type: 'text', tooltip: 'Number of slots to assign to Alchemy'});
    charSettings.push({name: 'Weaponsmithing_Axe' + i, title: 'Weaponsmithing/Axes', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Axes'});
    /*charSettings.push({name: 'Weaponsmithing_Dagger' + i, title: 'Weaponsmithing/Daggers', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Daggers'});
         charSettings.push({name: 'Weaponsmithing_Bow' + i, title: 'Weaponsmithing/Bows', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Bows -- choose one of these for every two Daggers/Greatswords/Longswords/Blades (or choose axes)'});
         charSettings.push({name: 'Weaponsmithing_Greatsword' + i, title: 'Weaponsmithing/Greatswords', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Greatswords'});
         charSettings.push({name: 'Weaponsmithing_Longsword' + i, title: 'Weaponsmithing/Longswords', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Longswords'});*/
    charSettings.push({name: 'Artificing' + i, title: 'Artificing', def: '0', type: 'text', tooltip: 'Number of slots to assign to Artificing'});
    charSettings.push({name: 'Jewelcrafting' + i, title: 'Jewelcrafting', def: '0', type: 'text', tooltip: 'Number of slots to assign to Jewelcrafting'});
    charSettings.push({name: 'Mailsmithing' + i, title: 'Mailsmithing', def: '0', type: 'text', tooltip: 'Number of slots to assign to Mailsmithing'});
    charSettings.push({name: 'Platesmithing' + i, title: 'Platesmithing', def: '0', type: 'text', tooltip: 'Number of slots to assign to Platesmithing'});
    charSettings.push({name: 'Leatherworking' + i, title: 'Leatherworking', def: '0', type: 'text', tooltip: 'Number of slots to assign to Leatherworking'});
    charSettings.push({name: 'Tailoring' + i, title: 'Tailoring', def: '0', type: 'text', tooltip: 'Number of slots to assign to Tailoring'});
    charSettings.push({name: 'Leadership' + i, title: 'Leadership', def: '0', type: 'text', tooltip: 'Number of slots to assign to Leadership'});
	    charSettings.push({name: 'Weaponsmithing_Axe2' + i, title: 'Weaponsmithing/Axes2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Axes GM'});
		charSettings.push({name: 'Artificing2' + i, title: 'Artificing2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Artificing GM'});
    charSettings.push({name: 'Jewelcrafting2' + i, title: 'Jewelcrafting2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Jewelcrafting GM'});
    charSettings.push({name: 'Mailsmithing2' + i, title: 'Mailsmithing2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Mailsmithing GM'});
    charSettings.push({name: 'Platesmithing2' + i, title: 'Platesmithing2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Platesmithing GM'});
    charSettings.push({name: 'Leatherworking2' + i, title: 'Leatherworking2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Leatherworking GM'});
    charSettings.push({name: 'Tailoring2' + i, title: 'Tailoring2', def: '0', type: 'text', tooltip: 'Number of slots to assign to Tailoring GM'});
	charSettings.push({name: 'Weaponsmithing_Axe3' + i, title: 'Weaponsmithing/Axes3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Weaponsmithing/Axes GM RM'});
		charSettings.push({name: 'Artificing3' + i, title: 'Artificing3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Artificing GM RM'});
    charSettings.push({name: 'Jewelcrafting3' + i, title: 'Jewelcrafting3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Jewelcrafting GM RM'});
    charSettings.push({name: 'Mailsmithing3' + i, title: 'Mailsmithing3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Mailsmithing GM RM'});
    charSettings.push({name: 'Platesmithing3' + i, title: 'Platesmithing3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Platesmithing GM RM'});
    charSettings.push({name: 'Leatherworking3' + i, title: 'Leatherworking3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Leatherworking GM RM'});
    charSettings.push({name: 'Tailoring3' + i, title: 'Tailoring3', def: '0', type: 'text', tooltip: 'Number of slots to assign to Tailoring GM RM'});
//    charSettings.push({name: 'Leadership_XP' + i, title: 'Leadership XP', def: '0', type: 'text', tooltip: 'Number of slots to assign to Leadership focused on XP'});
}

for (var i = 0; i < charSettings.length; i++) {
    settings[charSettings[i].name] = GM_getValue(charSettings[i].name, charSettings[i].def);
}

function setTaskSlots() {
    // The task list associated with each slot
    taskSlots = [];
    // The total slots for each profession, across task lists
    slotsByProf = {};
    for (var i = 0; i < tasklist.length; i++) slotsByProf[tasklist[i].taskName] = 0;

    for (var i = 0; i < tasklist.length; i++) {
        slotsByProf[tasklist[i].taskName] += parseInt(settings[tasklist[i].taskListName]);
        for (var j = 0; j < settings[tasklist[i].taskListName]; j++) {
            taskSlots.push(tasklist[i].taskListName);
        }
    }

}

// Page Settings
var PAGES = Object.freeze({
    LOGIN: {name: "Login", path: "div#login"},
    GUARD: {name: "Account Guard", path: "div#page-accountguard"},
});

/**
     * Uses the page settings to determine which page is currently displayed
     */
function GetCurrentPage() {
    for(var __kk in PAGES) {
        if (!PAGES.hasOwnProperty(__kk)) continue;
        var page = PAGES[__kk];
        if ($(page["path"]).filter(":visible").length) {
            return page;
        }
    }
}

/**
     * Logs in to gateway
     * No client.dataModel exists at this stage
     */
function page_LOGIN() {
    //if (!$("form > p.error:visible").length && settings["autologin"]) {
    // No previous log in error - attempt to log in
    console.log("Setting username");
    $("input#user").val(settings["nw_username"]);
    console.log("Setting password");
    $("input#pass").val(settings["nw_password"]);
    console.log("Clicking Login Button");
    $("div#login > input").click();
    //}
    dfdNextRun.resolve(delay.LONG);
}

/**
     * Action to perform on account guard page
     */
function page_GUARD() {
    // Do nothing on the guard screen
    dfdNextRun.resolve(delay.LONG);
}

/**
     * Collects rewards for tasks or starts new tasks
     * Function is called once per new task and returns true if an action is created
     * If no action is started function returns false to switch characters
     */
function processCharacter() {
    // Switch to professions page to show task progression
    unsafeWindow.location.hash = "#char(" + encodeURI(unsafeWindow.client.getCurrentCharAtName()) + ")/professions";

    // Collect rewards for completed tasks and restart
    if (unsafeWindow.client.dataModel.model.ent.main.itemassignments.complete) {
        unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.forEach(function (entry) {
            if (entry.hascompletedetails) {
                unsafeWindow.client.professionTaskCollectRewards(entry.uassignmentid);
            }
        });
        dfdNextRun.resolve();
        return true;
    }

    // Check for available slots and start new task
    if (unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function (entry) {
        return (!entry.islockedslot && !entry.uassignmentid);
    }).length) {
        // Go through the professions to assign tasks until specified slots filled
        for (var i = 0; i < tasklist.length; i++) {
            var prof = tasklist[i]
            if (settings[prof.taskListName] > 0) { //MAC-NW
                if (failedProf.length > 0 && failedProf.indexOf(prof.taskListName) > -1) {
                    continue;
                }

                // Check level
                var level = unsafeWindow.client.dataModel.model.ent.main.itemassignmentcategories.categories.filter(function (entry) {
                    return entry.name == prof.taskName; //
                })[0].currentrank;
                var list = prof.level[level];
                var tmpLevel = level;
                while (typeof list === "undefined" && tmpLevel > 0) {
                    list = prof.level[--tmpLevel];
                }
                if (typeof list === "undefined") {
                    continue;
                }
                var currentTasksByTaskList = unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function (entry) {
                    //                        return entry.category == tasklist[i].taskName && list.indexOf(entry.hdef.match(/^@ItemAssignmentDef\[([^\]]*)\]$/)[1]) > -1;
                    return entry.category === prof.taskName && taskSlots[entry.slotindex] === prof.taskListName;
                });
                var currentTasksByProf = unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function (entry) {
                    return entry.category === prof.taskName;
                });
                var currentOpenSlots = unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.filter(function (entry) {
                    return entry.category === "None";
                });
                if (taskSlots[currentOpenSlots[0].slotindex] === prof.taskListName ||
                    (currentTasksByTaskList.length < settings[prof.taskListName] &&
                     currentTasksByProf.length < slotsByProf[prof.taskName])) {
                    unsafeWindow.client.professionFetchTaskList('craft_' + tasklist[i].taskName);
                    window.setTimeout(function () {
                        // todo: How do we propegate the return value of this up the stack?
                        createNextTask(prof, level, list, 0);
                    }, delay.SHORT);
                    return true;
                }
            } //MAC-NW
        }
        console.log("All task counts assigned");
    }
    else {
        console.log("No available task slots");
    }

    // TODO: Add code to get next task finish time
    chartimers[charcurrent] = getNextFinishedTask();

    // Add diamond count
    chardiamonds[charcurrent] = unsafeWindow.client.dataModel.model.ent.main.currencies.diamonds;
    console.log(settings["nw_charname" + charcurrent] + "'s", "Astral Diamonds:", chardiamonds[charcurrent]);
    return false;
}

/**
     * Switch to a character's swordcoast adventures and collect the daily reward
     */
function processSwordCoastDailies(_charStartIndex) {
    var _accountName = unsafeWindow.client.dataModel.model.loginInfo.publicaccountname;
    var _charIndex = (!_charStartIndex || parseInt(_charStartIndex) > (charSettings.length + 1) || parseInt(_charStartIndex) < 0)
    ? 0 : parseInt(_charStartIndex);
    var _fullCharName = settings["nw_charname" + _charIndex] + '@' + _accountName;
    var _hasTutorial_active = "undefined";
    var _hasLoginDaily = 0;
    var _isLastChar = false;
    var _scaHashMatch = /\/adventures$/;
    //if (!settings["paused"])
    //    PauseSettings("pause");

    // Switch to professions page to show task progression
    if (!_scaHashMatch.test(unsafeWindow.location.hash)) {
        return;
    } else if (unsafeWindow.location.hash != "#char(" + encodeURI(_fullCharName) + ")/adventures") {
        unsafeWindow.location.hash = "#char(" + encodeURI(_fullCharName) + ")/adventures";
    }

    if (settings["nw_charname" + (_charIndex + 1)] === undefined)
        _isLastChar = true;

    WaitForState("").done(function () {
        try {
            _hasLoginDaily = client.dataModel.model.gatewaygamedata.dailies.left.logins;
        } catch (e) {
            // TODO: Use callback function
            window.setTimeout(function () {
                processSwordCoastDailies(_charIndex);
            }, delay.SHORT);
            return;
        }
       // check datamodel and disable Tutorial, active = "undefined", disabled = 1
       try {
           _hasTutorial_active = unsafeWindow.client.dataModel.model.gatewaygamedata.tutorial.all;
           if (typeof _hasTutorial_active == "undefined") {
              client.toggleHelp();
              }
           }catch(e) {}

        console.log("Checking SCA Dialy for", _fullCharName, "...");

        // Do SCA daily dice roll if the button comes up
        WaitForState(".daily-dice-intro").done(function () {
            $(".daily-dice-intro button").trigger('click');
            WaitForState(".daily-awards-button").done(function () {
                $(".daily-awards-button button").trigger('click');
            });
        });

        // If Dice roll dialog is non existant
        WaitForNotState(".modal-window.daily-dice").done(function () {
            if (_isLastChar) {
                window.setTimeout(function () {
                    //PauseSettings("unpause");
                }, 3000);
            } else {
                window.setTimeout(function () {
                    processSwordCoastDailies(_charIndex + 1);
                }, 3000);
            }
        });
    });
}

/**
     * Finds the task finishing next & returns the date or NULL otherwise
     *
     * @return {Date} / {null}
     */
function getNextFinishedTask() {
    var tmpNext, next = null;
    unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.forEach(function (entry) {
        if (entry.uassignmentid) {
            tmpNext = new Date(entry.ufinishdate);
            if (!next || tmpNext < next) {
                next = tmpNext;
            }
        }
    });
    if (next) {
        console.log("Next finished task at " + next.toLocaleString());
    } else {
        console.log("No next finishing date found!!");
    }
    return next;
}

/**
     * Recursive approach to finding the next task to assign to an open slot.
     *
     * @param {Array} prof The tasklist for the profession being used
     * @param {int} level The level of the list of tasks (either max level of character's profession, or max defined in the lists above)
     * @param {Array} list The possible list of tasks to start
     * @param {int} i The current task number being attempted
     */
function createNextTask(prof, level, list, i) {

    // TODO: Use callback function
    if (!unsafeWindow.client.dataModel.model.craftinglist || unsafeWindow.client.dataModel.model.craftinglist === null || !unsafeWindow.client.dataModel.model.craftinglist['craft_' + prof.taskName] || unsafeWindow.client.dataModel.model.craftinglist['craft_' + prof.taskName] === null) {
        console.log('Task list not loaded for:', prof.taskName);
        window.setTimeout(function () {
            // todo: How do we propegate the return value of this up the stack?
            createNextTask(prof, level, list, i);
        }, delay.SHORT);
        return false;
    }
    /*// Check level
         var level = unsafeWindow.client.dataModel.model.ent.main.itemassignmentcategories.categories.filter(function (entry) {
         return entry.name == prof.taskName;
         })[0].currentrank;
         var list = prof.level[level];
         if (list.length <= i) {
         console.log("Nothing Found");
         switchChar();*/
    if (list.length <= i) {
        console.log("No more possible tasks at this level to try to start", i);
        console.log("task list: ", list);
        failedProf.push(prof.taskListName);
        dfdNextRun.resolve(delay.SHORT);
        return false;
    }

    console.log(prof.taskName, "is level", level);
    console.log("createNextTask", list.length, i);

    var taskName = list[i];
    console.log("Searching for task:", taskName);

    // Search for task to start
    var task = searchForTask(taskName, prof.taskName, level);
    // Finish createNextTask function
    if (task === null) {
        console.log("Skipping task selection to purchase resources");
        dfdNextRun.resolve();
        return true;
    }
    if (task) {
        startedTask["currTaskName"] = task.def.name;
        task = '/professions-tasks/' + prof.taskName + '/' + task.def.name;
        console.log('Task Found');
        unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + task);
        WaitForState("div.page-professions-taskdetails").done(function () {
            // Click all buttons and select an item to use in the slot
            var def = $.Deferred();
            var buttonList = $('.taskdetails-assets:eq(1)').find("button");
            if (buttonList.length && settings["optionals"]) {
                SelectItemFor(buttonList, 0, def, prof);
            }
            else {
                def.resolve();
            }
            def.done(function () {
                // All items are populated
                console.log("Items Populated");
                // Click the Start Task Button
                //Get the start task button if it is enabled
                var enabledButton = $(".footer-professions-taskdetails .button.epic:not('.disabled') button");
                if (enabledButton.length) {
                    console.log("Clicking Start Task Button");
                    enabledButton.trigger('click');
                    WaitForState("").done(function () {
                        // Done
                        dfdNextRun.resolve(delay.SHORT);
                    });
                    if (startedTask["lastTaskChar"] == startedTask["currTaskChar"] && startedTask["lastTaskName"] == startedTask["currTaskName"]) {
                        startedTask["lastTaskCount"]++;
                        console.log("Task " + startedTask["lastTaskName"] + " started " + startedTask["lastTaskCount"] + " time");
                    } else {
                        startedTask["lastTaskChar"] = startedTask["currTaskChar"];
                        startedTask["lastTaskName"] = startedTask["currTaskName"];
                        startedTask["lastTaskCount"] = 1;
                    }
                    if (startedTask["lastTaskCount"] >= 15) {
                        console.log("LOOP FAILURE x [", Epic_button_error()  , "] times, skip to next task!!!");
                        $(".footer-professions-taskdetails .button button.resetWindow").trigger('click');
                        WaitForState("").done(function () {
                            createNextTask(prof, level, list, i + 1); // try create forced next task to resolve gateway bug
                        });
                    }
                    return true;
                }
                else { // Button not enabled, something required was probably missing
                    // Go back
                    $(".footer-professions-taskdetails .button button.resetWindow").trigger('click');
                    WaitForState("").done(function () {
                        // continue with the next one
                        console.log('Finding next task');
                        // todo: How do we propegate the return value of this up the stack?
                        createNextTask(prof, level, list, i + 1);
                    });
                }
            });
        });
    }
    else {
        console.log('Finding next task');
        return createNextTask(prof, level, list, i + 1)
    }
}

/**
     * Checks task being started for requirements and initiates beginning task if found
     *
     * @param {string} taskname The name of the task being started
     * @param {string} profname The name of the profession being used
     * @param {Deferred} dfd Deferred object to process on return
     */
function searchForTask(taskname, profname, professionLevel) {
    // Return first object that matches exact craft name
    // skip task if proff.level20
    if (settings['level_20_skip'] && profname != 'Leadership' && professionLevel > 19) {
        console.log(profname, "is level", professionLevel,"skipping.");
        return false;
    }if (settings['level_25_skip'] && profname != 'Leadership' && professionLevel > 24) {
        console.log(profname, "is level", professionLevel,"skipping.");
        return false;
    }
    // edited by WloBeb - start Patrol the Mines task only if char has less than 7 Mining Claims if XP prifile limit 100 claims
    var resource_limit = 10;
    if (settings['Leadership_XP'] > 0) {
        var resource_limit = 1000;}
    if (taskname == "Leadership_Tier3_13_Patrol" && countResource("Crafting_Resource_Mining_Claim") >= resource_limit ) {
        console.log("Too many Mining Claims: skiping");
        return false;
    }
    if (taskname == "Leadership_Tier4_21_Protectmagic" && countResource("Crafting_Resource_Clues_Bandit_Hq") >= resource_limit ) {
        console.log("Too many Clues: skiping");
        return false;
    }

    var thisTask = unsafeWindow.client.dataModel.model.craftinglist['craft_' + profname].entries.filter(function (entry) {
        return entry.def && entry.def.name == taskname;
    })[0];

    // If no task is returned we either have three of this task already, the task is a rare that doesn't exist currently, or we have the name wrong in tasklist
    if (!thisTask) {
        console.log('Could not find task for:', taskname);
        return false;
    }

    // start task if requirements are met
    try {
        if (!thisTask.failedrequirementsreasons.length) {
            return thisTask;
        }
    } catch (e) {
        Array_undefine_error();
        unsafeWindow.location.href = current_Gateway;
    }

    // Too high level
    if (thisTask.failslevelrequirements) {
        console.log("Task level is too high:", taskname);
        return false;
    }

    var searchItem = null;
    var searchAsset = false;

    // Check for and buy missing armor & weapon leadership assets
    if (thisTask.failsresourcesrequirements && profname == "Leadership" && settings["autopurchase"]) {
        var failedAssets = thisTask.required.filter(function (entry) {
            return !entry.fillsrequirements;
        });
        var failedArmor = failedAssets.filter(function (entry) {
            return entry.categories.indexOf("Armor") >= 0;
        });
        var failedWeapon = failedAssets.filter(function (entry) {
            return entry.categories.indexOf("Weapon") >= 0;
        });
        if (failedArmor.length || failedWeapon.length) {
            var _buyResult = false;
            var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
            var _charSilver = unsafeWindow.client.dataModel.model.ent.main.currencies.silver;
            var _charCopper = unsafeWindow.client.dataModel.model.ent.main.currencies.copper;
            var _charCopperTotal = _charCopper + (_charSilver*100) + (_charGold*10000);

            // Buy Leadership Armor Asset
            if (failedArmor.length && _charCopperTotal >= 10000) {
                console.log("Buying leadership asset:", failedArmor[0].icon);
                _buyResult = buyTaskAsset(18);
                unsafeWindow.client.professionFetchTaskList("craft_Leadership");
            }
            // Buy Leadership Infantry Weapon Asset
            else if (failedWeapon.length && _charCopperTotal >= 5000) {
                console.log("Buying leadership asset:", failedWeapon[0].icon);
                _buyResult = buyTaskAsset(4);
                unsafeWindow.client.professionFetchTaskList("craft_Leadership");
            }
            if (_buyResult === false)
                return false;
            else
                return null;
        }
    }

    // Missing assets or ingredients
    if (thisTask.failsresourcesrequirements) {
        var failedAssets = thisTask.required.filter(function (entry) {
            return !entry.fillsrequirements;
        });

        // Missing required assets
        if (failedAssets.length) {
            var failedCrafter = failedAssets.filter(function (entry) {
                return entry.icon.indexOf("Follower") >= 0;
            });

            // Train Assets
            if (failedCrafter.length && settings["trainassets"]) {
                if (profname == 'Leadership'&& professionLevel < 3){
                    console.log(profname, "level is [" + professionLevel + "], cant train workers.");
                    return false;
                } else {
                    console.log("Found required asset:", failedCrafter[0].icon);
                    searchItem = failedCrafter[0].icon;
                    searchAsset = true;
                }
            } else {
                // TODO: Automatically purchase item assets from shop
                console.log("Not enough assets for task:", taskname);
                return false;
            }
        }
        // Check for craftable ingredients items and purchasable profession resources (from vendor)
        else {
            var failedResources = thisTask.consumables.filter(function (entry) {
                return entry.required && !entry.fillsrequirements;
            });

            // Check first required ingredient only
            // If it fails to buy or craft task cannot be completed anyway
            // If it succeeds script will search for tasks anew
            var itemName = failedResources[0].hdef.match(/\[(\w+)\]/)[1];

            // Buy purchasable resources if auto-purchase setting is enabled
            if (settings["autopurchase"] && itemName.match(/^Crafting_Resource_(Charcoal|Rocksalt|Spool_Thread|Porridge|Solvent|Brimstone|Coal|Moonseasalt|Quicksilver|Spool_Threadsilk)$/)) {
                // returns null if successful (task will try again) and false if unsuccessful (task will be skipped)
                return buyResource(itemName);
            }
            // Matched profession auto-purchase item found but auto-purchase is not enabled
            else if (!settings["autopurchase"] && itemName.match(/^Crafting_Resource_(Charcoal|Rocksalt|Spool_Thread|Porridge|Solvent|Brimstone|Coal|Moonseasalt|Quicksilver|Spool_Threadsilk)$/)) {
                console.log("Purchasable resource required:",itemName,"for task:", taskname,". Recommend enabling Auto Purchase Resources.");
                return false;
            }
            // craftable ingredient set to search for
            else {
                console.log("Found required ingredient:", itemName);
                searchItem = itemName;
            }
        }
    }


    // either no craftable items/assets found or other task requirements are not met
    // Skip crafting ingredient tasks for Leadership
    if (searchItem === null || !searchItem.length || (profname == 'Leadership' && !searchAsset && !searchItem.match(/Crafting_Asset_Craftsman/))) {
        console.log("Failed to resolve item requirements for task:", taskname);
        return false;
    }
    // Generate list of available tasks to search ingredients/assets from
    console.log("Searching ingredient tasks for:", profname);
    var taskList = unsafeWindow.client.dataModel.model.craftinglist['craft_' + profname].entries.filter(function (entry) {
        // remove header lines first to avoid null def
        if (entry.isheader) {
            return false;
        }

        // Too high level
        if (entry.failslevelrequirements) {
            return false;
        }

        // Rewards do not contain item we want to make
        if (searchAsset) {
            if (entry.def.icon != searchItem || !entry.def.name.match(/Recruit/) || entry.def.requiredrank > 14) {
                return false;
            }
        }
        else {
            if (!(entry.rewards.some(function (itm) {
                try {
                    return itm.hdef.match(/\[(\w+)\]/)[1] == searchItem;
                } catch (e) {
                }
            }))) {
                return false;
            }
        }
        // Skip Mass/Trading/looping Transmute -tasks
        if (entry.def.name.match(/(_Mass|_Transmute_|_Create_|(_Gather|_Refine)_Special)/)) {
            return false;
        }

        return true;
    });

    if (!taskList.length) {
        console.log("No ingredient tasks found for:", taskname, searchItem);
        return false;
    }

    // Use more efficient Empowered task for Aqua Vitae/ Aqua Regia if available.
    if (searchItem == "Crafting_Resource_Aquavitae" && taskList.length > 1) {
        taskList.shift();
    }
    if (searchItem == "Crafting_Resource_Aquaregia" && taskList.length > 1) {
        taskList.shift();
    }
    // Should really only be one result now but lets iterate through anyway.
    for (var i = 0; i < taskList.length; i++) {
        console.log("Attempting search for ingredient task:", taskList[i].def.name);
        var task = searchForTask(taskList[i].def.name, profname, professionLevel);
        if (task === null || task) {
            return task;
        }
    }
    return false;
}
/**
     * Selects the highest level asset for the i'th button in the list. Uses an iterative approach
     * in order to apply a sufficient delay after the asset is assigned
     *
     * @param {Array} The list of buttons to use to click and assign assets for
     * @param {int} i The current iteration number. Will select assets for the i'th button
     * @param {Deferred} jQuery Deferred object to resolve when all of the assets have been assigned
     */
function SelectItemFor(buttonListIn, i, def, prof) {
    buttonListIn[i].click();
    WaitForState("").done(function () {

        var $assets = $("div.modal-item-list a").has("img[src*='_Resource_'],img[src*='_Assets_'],img[src*='_Tools_'],img[src*='_Tool_'],img[src*='_Jewelersloupe_'],img[src*='_Bezelpusher_']"); //edited by RottenMind
        var $persons = $("div.modal-item-list a").has("img[src*='_Follower_']");
        var quality = [".Special", ".Gold", ".Silver", ".Bronze"];
        var ic, $it;

        var clicked = false;

        // Try to avoid using up higher rank assets needlessly
        if (prof.taskName === "Leadership") {
            var mercenarys = $('div.modal-item-list a.Bronze img[src*="Crafting_Follower_Leader_Generic_T1_01"]').parent().parent();
            var guards = $('div.modal-item-list a.Bronze img[src*="Crafting_Follower_Leader_Guard_T2_01"]').parent().parent();
            var footmen = $('div.modal-item-list a.Bronze img[src*="Crafting_Follower_Leader_Private_T2_01"]').parent().parent();

            if (mercenarys.length) {
                clicked = true;
                mercenarys[0].click();
            }
            else if (guards.length) {
                clicked = true;
                guards[0].click();
            }
            else if (footmen.length) {
                clicked = true;
                footmen[0].click();
            }
        }

        // check resources & assets for best quality, in descending order
        for (ic in quality) {
            $it = $assets.filter(quality[ic]);
            if ($it.length) {
                $it[0].click();
                clicked = true;
                break;
            }
        }
        // if no asset was selected, check for persons for best speed, in descending order
        if (!clicked) {
            for (ic in quality) {
                $it = $persons.filter(quality[ic]);
                if ($it.length) {
                    $it[0].click();
                    clicked = true;
                    break;
                }
            }
        }
        // if nothing was found at all, return immediately (skip other optional slots)
        if (!clicked) {
            $("button.close-button").trigger('click');
            console.log("Nothing more to click..");
            WaitForState("").done(function () {
                // Let main loop continue
                def.resolve();
            });
        }
        console.log("Clicked item");
        WaitForState("").done(function () {
            // Get the new set of select buttons created since the other ones are removed when the asset loads
            var buttonList = $('.taskdetails-assets:eq(1)').find("button");
            if (i < buttonList.length - 1) {
                SelectItemFor(buttonList, i + 1, def, prof);
            }
            else {
                // Let main loop continue
                def.resolve();
            }
        });
    });
}
/**
     * Will buy a given purchasable resource
     *
     * @param {String} item The data-tt-item id of the Resource to purchase
     */
function buyResource(item) {
    if (!settings['purchasePorridge'] && item == "Crafting_Resource_Porridge") {
        return false;
    }
    var _resourceID = {
        Crafting_Resource_Charcoal: 0,
        Crafting_Resource_Rocksalt: 1,
        Crafting_Resource_Spool_Thread: 2,
        Crafting_Resource_Porridge: 3,
        Crafting_Resource_Solvent: 4,
        Crafting_Resource_Brimstone: 5,
        Crafting_Resource_Coal: 6,
        Crafting_Resource_Moonseasalt: 7,
        Crafting_Resource_Quicksilver: 8,
        Crafting_Resource_Spool_Threadsilk: 9,
    };
    var _resourceCost = {
        Crafting_Resource_Charcoal: 30,
        Crafting_Resource_Rocksalt: 30,
        Crafting_Resource_Spool_Thread: 30,
        Crafting_Resource_Porridge: 30,
        Crafting_Resource_Solvent: 20,
        Crafting_Resource_Brimstone: 100,
        Crafting_Resource_Coal: 500,
        Crafting_Resource_Moonseasalt: 500,
        Crafting_Resource_Quicksilver: 500,
        Crafting_Resource_Spool_Threadsilk: 500,
    };
    var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
    var _charSilver = unsafeWindow.client.dataModel.model.ent.main.currencies.silver;
    var _charCopper = unsafeWindow.client.dataModel.model.ent.main.currencies.copper;
    var _charCopperTotal = _charCopper + (_charSilver*100) + (_charGold*10000);
    var _resourcePurchasable = Math.floor(_charCopperTotal/_resourceCost[item]);
    // Limit resource purchase to 50 quantity
    var _purchaseCount = (_resourcePurchasable >= 50) ? 50 : _resourcePurchasable;

    if (_purchaseCount < 1) {
        // Not enough gold for 1 resource
        console.log("Purchasing profession resources failed for:",item);
        return false;
    } else {
        // Make purchase
        console.log("Purchasing profession resources:", _purchaseCount + "x",item, ". Total copper available:",_charCopperTotal,". Spending ",(_purchaseCount*_resourceCost[item]),"copper.");
        unsafeWindow.client.sendCommand("GatewayVendor_PurchaseVendorItem", {vendor: 'Nw_Gateway_Professions_Merchant', store: 'Store_Crafting_Resources', idx: _resourceID[item], count: _purchaseCount});
        WaitForState("button.closeNotification").done(function () {
            $("button.closeNotification").trigger('click');
        });
        return null;
    }
}

/** DRAFT
     * Will buy a missing leadership assets
     *
     * @param {String} item reference from assetID
     */
function buyTaskAsset(_itemNo) {
    var _returnHast = unsafeWindow.location.hash;
    unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')/professions/vendor');
    WaitForState("").done(function () {
        if ($('span.alert-red button[data-url-silent="/professions/vendor/Store_Crafting_Assets/' + _itemNo + '"]').length) {
            return false;
        } else if ($('button[data-url-silent="/professions/vendor/Store_Crafting_Assets/' + _itemNo + '"]').length)
        {
            $('button[data-url-silent="/professions/vendor/Store_Crafting_Assets/' + _itemNo + '"]').trigger('click');
            WaitForState(".modal-confirm button").done(function () {
                $('.modal-confirm button').eq(1).trigger('click');
                unsafeWindow.location.hash = _returnHast;
                return null;
            });
        }
    });
}
// Function used to check exchange data model and post calculated AD/Zen for transfer if all requirements are met
function postZexOffer() {
    // Make sure the exchange data is loaded to model
    if (unsafeWindow.client.dataModel.model.exchangeaccountdata) {
        // Check that there is atleast 1 free zex order slot
        if (unsafeWindow.client.dataModel.model.exchangeaccountdata.openorders.length < 5) {
            // Place the order
            var exchangeDiamonds = parseInt(unsafeWindow.client.dataModel.model.exchangeaccountdata.readytoclaimescrow);
            var charDiamonds = parseInt(unsafeWindow.client.dataModel.model.ent.main.currencies.diamonds);
            var ZenRate = parseInt(settings["banktransrate"]);
            var ZenQty = Math.floor((charDiamonds + exchangeDiamonds - parseInt(settings["bankcharmin"])) / ZenRate);
            ZenQty = (ZenQty > 5000) ? 5000 : ZenQty;
            console.log("Posting Zex buy listing for " + ZenQty + " ZEN at the rate of " + ZenRate + " AD/ZEN. AD remainder: " + charDiamonds + " - " + (ZenRate * ZenQty) + " = " + (charDiamonds - (ZenRate * ZenQty)));
            unsafeWindow.client.createBuyOrder(ZenQty, ZenRate);

        } else {
            console.log("Zen Max Listings Reached (5). Skipping Zex Posting..");
        }
    } else {
        console.log("Zen Exchange data did not load in time for transfer. Skipping Zex Posting..");
    }
}

// Function used to check exchange data model and withdraw listed orders that use the settings zen transfer rate
function withdrawZexOffer() {
    // Make sure the exchange data is loaded to model
    if (unsafeWindow.client.dataModel.model.exchangeaccountdata) {
        if (unsafeWindow.client.dataModel.model.exchangeaccountdata.openorders.length >= 1) {

            var charDiamonds = parseInt(unsafeWindow.client.dataModel.model.ent.main.currencies.diamonds);
            var ZenRate = parseInt(settings["banktransrate"]);

            // cycle through the zex listings
            unsafeWindow.client.dataModel.model.exchangeaccountdata.openorders.forEach(function (item) {
                // find any buy orders in the list with our set zen rate
                if (parseInt(item.price) == ZenRate && item.ordertype == "Buy") {
                    // cancel/withdraw the order
                    client.withdrawOrder(item.orderid);
                    console.log("Withdrawing Zex listing for " + item.quantity + " ZEN at the rate of " + item.price + " . Total value in AD: " + item.totaltc);
                }
            });

        } else {
            console.log("No listings found on Zex. Skipping Zex Withrdaw..");
        }
    } else {
        console.log("Zen Exchange data did not load in time for transfer. Skipping Zex Withrdaw..");
    }
}
// MAC-NW
function vendorItemsLimited(_items) {
    var _Alchemy_state = parseInt(settings["Alchemy"]);
    var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
    var _pbags = client.dataModel.model.ent.main.inventory.playerbags;
    var _pbags_crafting = client.dataModel.model.ent.main.inventory.tradebag; //tradebag
    var _delay = 400;
    var _sellCount = 0;
    var _classType = unsafeWindow.client.dataModel.model.ent.main.classtype;
    var _bagCount = unsafeWindow.client.dataModel.model.ent.main.inventory.playerbags.length;
    var _bagUsed = 0;
    var _bagUnused = 0;
    var _tmpBag1 = [];
    var _tmpBag2 = [];
    //var _tmpBag = [];
    var _profitems = [];
    // Pattern for items to leave out of auto vendoring (safeguard)
    var _exclude_Alchemy = /^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)(|_[1-5])$/;
    var _excludeItems = /(Charcoal|Rocksalt|Spool_Thread|Porridge|Solvent|Brimstone|Coal|Moonseasalt|Quicksilver|Spool_Threadsilk|Clues_Bandit_Hq|Clothscraps_T4|Clothbolt_T4|Potion_Potency|Potion_Protection|Taffeta|Crafting_Asset|Craftsman|Aqua|Vitriol|Residuum|Shard|Crystal|District_Map|Local_Map|Bill_Of_Sale|Refugee|Asset_Tool|Tool|Gemfood|Gem_Upgrade_Resource_R[2-9]|Crafting_Resource_Elemental|Elemental|Artifact|Hoard|Coffer|Fuse|Ward|Preservation|Armor_Enhancement|Weapon_Enhancement|T[5-9]_Enchantment|T[5-9]_Runestones|T10_Enchantment|T10_Runestones|4c_Personal|Item_Potion_Companion_Xp|Gateway_Rewardpack|Consumable_Id_Scroll|Dungeon_Delve_Key)/; // edited by RottenMind 08.03.2015
    if (_Alchemy_state !== 0) {
        _excludeItems = new RegExp(_exclude_Alchemy.source + "|" + _excludeItems.source); // make sure that we DONT sell potions if Alchemy is active    
    }
    //console.log(_excludeItems);
    if (settings["autovendor_profresults"]) {
        /** Profession leveling result item cleanup logic for T1-4 crafted results
             * Created by RM on 14.1.2015.
             * List contains crafted_items, based "Mustex/Bunta NW robot 1.05.0.1L crafting list, can be used making list for items what are "Auto_Vendored".
             * Items on list must be checked and tested.
             */
        /*#2, Tier2 - tier3 mixed, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern : /^Crafted_(Jewelcrafting_Neck_Misc_2|Jewelcrafting_Waist_Misc_2|Med_Armorsmithing_T3_Chain_Pants|Hvy_Armorsmithing_Pants_3|Med_Armorsmithing_Chain_Shirt_3|Leatherworking_Shirt_3|Hvy_Armorsmithing_Shirt_3|Leatherworking_Pants_3|Med_Armorsmithing_Chain_Pants_3||Med_Armorsmithing_T3_Chain_Shirt|Hvy_Armorsmithing_T3_Plate_Pants|Hvy_Armorsmithing_T3_Plate_Shirt|Leatherworking_T3_Leather_Pants|Leatherworking_T3_Leather_Shirt|Tailoring_Shirt_3|Tailoring_T3_Cloth_Shirt|Tailoring_T3_Cloth_Shirt_Set2|Tailoring_T3_Cloth_Pants|Tailoring_Shirt_3_Set2|Tailoring_Pants_3_Set2|Tailoring_Pants_3|Artificing_T3_Pactblade_Temptation_4|Artificing_T3_Icon_Virtuous_4|Weaponsmithing_T2_Dagger_3|Weaponsmithing_T2_Dagger_3|Weaponsmithing_T3_Greataxe_4|Weaponsmithing_T3_Battleaxe_4|Weaponsmithing_T3_Greataxe_Set_2|Weaponsmithing_T3_Battleaxe_Set_2)$/,
            limit: 0,
            count: 0
        };
        /*#3, Tier2, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Neck_Offense_2|Jewelcrafting_Waist_Offense_2|Tailoring_T2_Cloth_Shirt|T2_Cloth_Armor_Set_2|Med_Armorsmithing_T2_Chain_Armor_Set_1|Med_Armorsmithing_T2_Chain_Pants_2|Med_Armorsmithing_T2_Chain_Boots_Set_1|Med_Armorsmithing_T2_Chain_Shirt_2|Med_Armorsmithing_T2_Chain_Pants_1|Med_Armorsmithing_T2_Chain_Shirt|Hvy_Armorsmithing_T2_Plate_Armor_Set_1|Hvy_Armorsmithing_T2_Plate_Pants_2|Crafted_Tailoring_Pants_2|Tailoring_T2_Cloth_Armor_Set_1|Crafted_Tailoring_Shirt_2 |Hvy_Armorsmithing_T2_Plate_Boots_Set_1|Hvy_Armorsmithing_T2_Plate_Shirt_2|Med_Armorsmithing_Chain_Pants_2|Hvy_Armorsmithing_T2_Plate_Pants_1|Hvy_Armorsmithing_T2_Shield_Set_1|Hvy_Armorsmithing_T2_Plate_Shirt|Leatherworking_T2_Leather_Shirt|Leatherworking_T2_Leather_Boots_Set_1|Leatherworking_T2_Leather_Shirt_2|Leatherworking_T2_Leather_Pants_1|Leatherworking_T2_Leather_Armor_Set_1|Leatherworking_T2_Leather_Pants_2|Leatherworking_Shirt_3_Set2|Tailoring_T2_Cloth_Armor_Set_1|Tailoring_Pants_2|Tailoring_T2_Cloth_Pants|Tailoring_T2_Cloth_Pants_2|Tailoring_T2_Cloth_Boots_Set_1|Tailoring_T2_Cloth_Shirt_2|Tailoring_T2_Cloth_Pants_1|Artificing_T2_Pactblade_Temptation_3|Artificing_T1_Icon_Virtuous_2|Weaponsmithing_T2_Dagger_2|Weaponsmithing_T2_Greataxe_3|Weaponsmithing_T2_Battleaxe_3)$/,
            limit: 0,
            count: 0
        };
        /*#4, Tier1, upgrade, sell if inventory full, "TierX" is here "TX" */
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Neck_Misc_1|Jewelcrafting_Waist_Misc_1|Tailoring_Cloth_Shirt_1_Set2|Med_Armorsmithing_T1_Chain_Armor_Set_1|Med_Armorsmithing_T1_Chain_Boots_Set_1|Hvy_Armorsmithing_Plate_Armor_1|Hvy_Armorsmithing_T1_Plate_Armor_Set_1|Hvy_Armorsmithing_T1_Plate_Boots_Set_1|Leatherworking_T1_Leather_Boots_Set_1|Leatherworking_T1_Leather_Boots_Set_1|Leatherworking_T1_Leather_Armor_Set_1|Tailoring_T1_Cloth_Armor_1|Tailoring_Cloth_Armor_1|Tailoring_T1_Cloth_Pants_1|Tailoring_T1_Cloth_Boots_Set_1|Artificing_T1_Pactblade_Convergence_2|Artificing_T1_Icon_Virtuous_2|Weaponsmithing_T1_Dagger_1|Weaponsmithing_T2_Greataxe_2|Weaponsmithing_T2_Battleaxe_2)$/,
            limit: 0,
            count: 0
        };
        /*#5, Tier0, upgrade, sell if inventory full, taskilist "Tier1" is here "empty" or "_" must replace (_T1_|_)*/
        _profitems[_profitems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Waist_Offense_1|Jewelcrafting_Neck_Offense_1|Tailoring_Cloth_Pants_1|Med_Armorsmithing_Chain_Boots_1|Med_Armorsmithing_Chain_Shirt_1|Med_Armorsmithing_Chain_Armor_1|Med_Armorsmithing_Chain_Pants_1|Hvy_Armorsmithing_Plate_Boots_1|Hvy_Armorsmithing_Plate_Shirt_1|Hvy_Armorsmithing_Shield_1|Leatherworking_Tier0_Intro_1|Leatherworking_Leather_Boots_1|Leatherworking_Leather_Shirt_1|Tailoring_T1_Cloth_Shirt_Set2|Leatherworking_Leather_Armor_1|Leatherworking_Leather_Pants_1|Tailoring_Cloth_Boots_1|Tailoring_Cloth_Shirt_1|Artificing_T1_Pactblade_Convergence_1|Artificing_Icon_Virtuous_1|Artificing_Symbol_Virtuous_1|Weaponsmithing_Dagger_1|Weaponsmithing_T1_Greatsword_1|Weaponsmithing_T1_Longbow_1|Weaponsmithing_T1_Greataxe_1|Weaponsmithing_T1_Battleaxe_1)$/,
            limit: 0,
            count: 0
        };
    }
    $.each(_pbags, function (bi, bag) {
        bag.slots.forEach(function (slot) {
            // Match unused slots
            if (slot === null || !slot || slot === undefined) {
                _bagUnused++;
            }
            // Match items to exclude from auto vendoring, dont add to _tmpBag: Exclude pattern list - bound - Epic Quality - Blue Quality
            else if (_excludeItems.test(slot.name) || slot.bound || slot.rarity == "Special" || slot.rarity == "Gold") {
                _bagUsed++;
            }
            // Match everything else
            else {
                if (settings["autovendor_profresults"]) {
                    for (i = 0; i < _profitems.length; i++) {
                        if (_profitems[i].pattern.test(slot.name))
                            _profitems[i].count++;
                    }
                }
                _tmpBag1[_tmpBag1.length] = slot;
                _bagUsed++;
            }
        });
    });
    if (settings["autovendor_profresults"] && _charGold < 2) { // this "gold" threshold must be global var and adjustable by users
        //  $.each(_pbags_crafting, function (bi, bag) {
        _pbags_crafting.forEach(function (slot) {
            // Match unused slots
            if (slot === null || !slot || slot === undefined) {
                //  _bagUnused++;
            }
            // Match items to exclude from auto vendoring, dont add to _tmpBag: Exclude pattern list - bound - Epic Quality - Blue Quality - Green Quality(might cause problems)
            else if (_excludeItems.test(slot.name) || slot.bound || slot.rarity == "Special" || slot.rarity == "Gold" || slot.rarity == "Silver") {
                // _bagUsed++;
            }
            // Match everything else
            else {
                if (settings["autovendor_profresults"]) {
                    for (i = 0; i < _profitems.length; i++) {
                        if (_profitems[i].pattern.test(slot.name))
                            _profitems[i].count++;
                    }
                }
                _tmpBag2[_tmpBag2.length] = slot;
                // _bagUsed++;
                console.log(slot.name); // tradebag debug msg
            }
        });
        // });
    }
    var _tmpBag = _tmpBag1.concat(_tmpBag2);

    if (settings["autovendor_profresults"]) {
        _tmpBag.forEach(function (slot) {
            for (i = 0; i < _profitems.length; i++) { // edited by RottenMind
                if (slot && _profitems[i].pattern.test(slot.name) && Inventory_bagspace() <= 9) { // !slot.bound && _profitems[i].count > 3 &&, edited by RottenMind
                    var vendor = {
                        vendor: "Nw_Gateway_Professions_Merchant"
                    };
                    vendor.id = slot.uid;
                    vendor.count = 1;
                    console.log('Selling', vendor.count, slot.name, 'to vendor.');
                    window.setTimeout(function () {
                        client.sendCommand('GatewayVendor_SellItemToVendor', vendor);
                    }, _delay);
                    _profitems[i].count--;
                    break;
                }
            }
        });
    }

    _tmpBag.forEach(function (slot) {
        for (i = 0; i < _items.length; i++) {
            var _Limit = (parseInt(_items[i].limit) > 99) ? 99 : _items[i].limit;
            if (slot && _items[i].pattern.test(slot.name) && !slot.bound) {
                // Node Kits vendor logic for restricted bag space
                if (settings["autovendor_kits_altars_limit"] && /^Item_Consumable_Skill/.test(slot.name)) {
                    if (_bagCount < 2 || _bagUnused < 6 ||
                        (slot.name == "Item_Consumable_Skill_Dungeoneering" && (_classType == "Player_Guardian" || _classType == "Player_Greatweapon")) ||
                        (slot.name == "Item_Consumable_Skill_Arcana" && (_classType == "Player_Controller" || _classType == "Player_Scourge")) ||
                        (slot.name == "Item_Consumable_Skill_Religion" && _classType == "Player_Devoted") ||
                        (slot.name == "Item_Consumable_Skill_Thievery" && _classType == "Player_Trickster") ||
                        (slot.name == "Item_Consumable_Skill_Nature" && _classType == "Player_Archer")
                       ) {
                        _Limit = 0;
                    }
                }
                // Sell Items
                if (slot.count > _Limit) {
                    _sellCount++;
                    var vendor = {
                        vendor: "Nw_Gateway_Professions_Merchant"
                    };
                    vendor.id = slot.uid;
                    vendor.count = slot.count - _Limit;
                    console.log('Selling', vendor.count, slot.name, 'to vendor.');
                    window.setTimeout(function () {
                        client.sendCommand('GatewayVendor_SellItemToVendor', vendor);
                    }, _delay);
                    _delay = _delay + 400;
                    break;
                }
            }
        }
    });

    return _sellCount;
}

function switchChar() {

    failedProf = [];

    setTaskSlots();

    //if (settings["refinead"]) {
    var _currencies = unsafeWindow.client.dataModel.model.ent.main.currencies;
    if (_currencies.diamondsconvertleft && _currencies.roughdiamonds) {
        var refined_diamonds;
        if (_currencies.diamondsconvertleft < _currencies.roughdiamonds) {
            refined_diamonds = _currencies.diamondsconvertleft
        } else {
            refined_diamonds = _currencies.roughdiamonds
        }
        chardiamonds[charcurrent] += refined_diamonds
        console.log("Refining AD for", settings["nw_charname" + charcurrent] + ":", refined_diamonds);
        console.log(settings["nw_charname" + charcurrent] + "'s", "Astral Diamonds:", chardiamonds[charcurrent]);
        unsafeWindow.client.sendCommand('Gateway_ConvertNumeric', 'Astral_Diamonds');
        WaitForState("button.closeNotification").done(function () {
            $("button.closeNotification").click();
        });
    }
    //}
    if (settings["easy_start"]) {
        get_banker();
    }
    // MAC-NW -- AD Consolidation
    if (settings["autoexchange"]) {

        // Check that we dont take money from the character assigned as the banker // Zen Transfer / Listing
        if (settings["bankchar"] != unsafeWindow.client.dataModel.model.ent.main.name) {
            // Check the required min AD amount on character
            if (settings["banktransmin"] && settings["bankcharmin"] && parseInt(unsafeWindow.client.dataModel.model.ent.main.currencies.diamonds) >= (parseInt(settings["banktransmin"]) + parseInt(settings["bankcharmin"]))) {
                // Check that the rate is not less than the min & max
                if (settings["banktransrate"] && parseInt(settings["banktransrate"]) >= 50 && parseInt(settings["banktransrate"]) <= 500) {
                    window.setTimeout(postZexOffer, delay.SHORT);
                }
                // Crash ZEX Domino
                if (unsafeWindow.client.dataModel.model.exchangeaccountdata.openorders.length >= 4) {
                    window.setTimeout(withdrawZexOffer, delay.MEDIUM);
                }
                else {
                    console.log("Zen transfer rate does not meet the minimum (50) or maximum (500). Skipping Zex Posting..");
                }
            } else {
                console.log("Character does not have minimum AD balance to do funds transfer. Skipping Zex Posting..");
            }
        }

    } else {
        console.log("Zen Exchange AD transfer not enabled. Skipping Zex Posting..");
    }

    if (settings["openrewards"]) {
        var _pbags = unsafeWindow.client.dataModel.model.ent.main.inventory.playerbags;
        var _cRewardPat = /Reward_Item_Chest|Gateway_Rewardpack|Invocation_Rp_Bag|Ichor/;
        console.log("Opening Rewards");
        $.each(_pbags, function (bi, bag) {
            bag.slots.forEach(function (slot) {
                if (slot && _cRewardPat.test(slot.name)) {
                    if (slot.count >= 99)
                        slot.count = 99;
                    for (i = 1; i <= slot.count; i++) {
                        window.setTimeout(function () {
                            client.sendCommand('GatewayInventory_OpenRewardPack', slot.uid);
                        }, 500);
                    }
                }
            });
        });
    }

    // Check Vendor Options & Vendor matched items
    vendorJunk();

    // MAC-NW (endchanges)

    console.log("Switching Characters");

    var chardate = null, nowdate = new Date(); // chardelay moved global
    nowdate = nowdate.getTime();
    for (var cc = 0; cc < settings["charcount"]; cc++) {
        if (chartimers[cc] != null) {
            console.log("Date found for " + settings["nw_charname" + cc]);
            if (!chardate || chartimers[cc] < chardate) {
                chardate = chartimers[cc];
                charcurrent = cc;
                chardelay = chardate.getTime() - nowdate - unsafeWindow.client.getServerOffsetSeconds() * 1000;
                if (chardelay < delay.SHORT) {
                    chardelay = delay.SHORT;
                }
            }
        } else {
            charcurrent = cc;
            chardelay = delay.SHORT;
            chardate = null;
            console.log("No date found for " + settings["nw_charname" + cc] + ", switching now.");
            break;
        }
    }

    // Count AD
    var curdiamonds = 0;
    for (var cc = 0; cc < settings["charcount"]; cc++) {
        if (chardiamonds[cc] != null) {
            curdiamonds += Math.floor(chardiamonds[cc] / 50) * 50;
        }
    }

    console.log("Next run for " + settings["nw_charname" + charcurrent] + " in " + parseInt(chardelay / 1000) + " seconds.");
    $("#prinfopane").empty().append("<h3 class='promo-image copy-top prh3'>Professions Robot<br />Next task for " + settings["nw_charname" + charcurrent] + "<br /><span data-timer='" + chardate + "' data-timer-length='2'></span><br />Diamonds: " + curdiamonds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " #SCA[" + GM_getValue("dailyswordcoast", 0) + "]times." + "</h3>");
    GM_setValue("charcurrent", charcurrent);
    dfdNextRun.resolve(chardelay);
}

/**
     * Waits for the loading symbol to be hidden.
     *
     * @return {Deferred} A jQuery defferred object that will be resolved when loading is complete
     */
function WaitForLoad() {
    return WaitForState("");
}
/**
     * Creates a deferred object that will be resolved when the state is reached
     *
     * @param {string} query The query for the state to wait for
     * @return {Deferred} A jQuery defferred object that will be resolved when the state is reached
     */
function WaitForState(query) {
    var dfd = $.Deferred();
    window.setTimeout(function () {
        AttemptResolve(query, dfd);
    }, delay.SHORT); // Doesn't work without a short delay
    return dfd;
}
function WaitForNotState(query) {
    var dfd = $.Deferred();
    window.setTimeout(function () {
        AttemptNotResolve(query, dfd);
    }, delay.SHORT); // Doesn't work without a short delay
    return dfd;
}
/**
     * Will continually test for the given query state and resolve the given deferred object when the state is reached
     * and the loading symbol is not visible
     *
     * @param {string} query The query for the state to wait for
     * @param {Deferred} dfd The jQuery defferred object that will be resolved when the state is reached
     */
function AttemptResolve(query, dfd) {
    if ((query === "" || $(query).length) && $("div.loading-image:visible").length === 0) {
        dfd.resolve();
    }
    else {
        window.setTimeout(function () {
            AttemptResolve(query, dfd);
        }, delay.SHORT); // Try again in a little bit
    }
}
/* Opposite of AttemptResolve, will try to resolve query until it doesn't resolve. */
function AttemptNotResolve(query, dfd) {
    if (!$(query).length && $("div.loading-image:visible").length === 0) {
        dfd.resolve();
    }
    else {
        window.setTimeout(function () {
            AttemptNotResolve(query, dfd);
        }, delay.SHORT); // Try again in a little bit
    }
}
/**
     * The main process loop:
     * - Determine which page we are on and call the page specific logic
     * - When processing is complete, process again later
     *	- Use a short timer when something changed last time through
     *	- Use a longer timer when waiting for tasks to complete
     */
function process() {
    // Make sure the settings button exists
    addSettings();

    // Enable/Disable the unconditional page reload depending on settings
    loading_reset = settings["autoreload"];

    // Check if timer is paused
    s_paused = settings["paused"]; // let the Page Reloading function know the pause state
    if (settings["paused"]) {
        // Just continue later - the deferred object is still set and nothing will resolve it until we get past this point
        var timerHandle = window.setTimeout(function () {
            process();
        }, delay.DEFAULT);
        return;
    }

    // Check for Gateway down
    if (window.location.href.indexOf("gatewaysitedown") > -1) {
        // Do a long delay and then retry the site
        console.log("Gateway down detected - relogging in " + (delay.MINS / 1000) + " seconds");
        window.setTimeout(function () {
            unsafeWindow.location.href = current_Gateway; // edited by RottenMind
        }, delay.MINS);
        return;
    }

    // Check for login or account guard and process accordingly
    var currentPage = GetCurrentPage();
    if (currentPage == PAGES.LOGIN) {
        page_LOGIN();
        return;
    }
    else if (currentPage == PAGES.GUARD) {
        page_GUARD();
        return;
    }

    window.setTimeout(function () {
        loginProcess();
    }, delay.SHORT);

    // Continue again later
    dfdNextRun.done(function (delayTimer) {
        dfdNextRun = $.Deferred();
        timerHandle = window.setTimeout(function () {
            process();
        }, typeof delayTimer !== 'undefined' ? delayTimer : delay.DEFAULT);
    });
}

function loginProcess() {
    // Get logged on account details
    var accountName;
    try {
        accountName = unsafeWindow.client.dataModel.model.loginInfo.publicaccountname;
    }
    catch (e) {
        // TODO: Use callback function
        window.setTimeout(function () {
            loginProcess();
        }, delay.SHORT);
        return;
    }

    // Check if timer is paused again to avoid starting new task between timers
    s_paused = settings["paused"]; // let the Page Reloading function know the pause state
    if (settings["paused"]) {
        // Just continue later - the deferred object is still set and nothing will resolve it until we get past this point
        var timerHandle = window.setTimeout(function () {
            process();
        }, delay.DEFAULT);
        return;
    }

    if (accountName) {
        // load current character position and values
        charcurrent = GM_getValue("charcurrent", 0);
        for (var i = 0; i < (charSettings.length / settings["charcount"]); i++) {
            j = i + (charcurrent * charSettings.length / settings["charcount"]);
            settings[charSettings[j].name.replace(new RegExp(charcurrent + "$"), '')] = settings[charSettings[j].name];
        }

        var charName = settings["nw_charname"];
        var fullCharName = charName + '@' + accountName;

        if (charName.match(/Character/)) {
            if (!settings["paused"])
                PauseSettings("pause");
            console.log("Loading character list", charName);
            charNameList = [];
            client.dataModel.model.loginInfo.choices.forEach(function (char) {
                if (char.name == "Author") return;
                charNameList.push(char.name);
            });
            console.log("Found names: " + charNameList);

            GM_setValue("charcount", charNameList.length);
            charNameList.forEach(function (name, i) {
                GM_setValue("nw_charname" + i, name);
            })
            if (settings["paused"]) {
                window.setTimeout(function () {
                    PauseSettings("unpause");
                }, 3000);
            }
            window.setTimeout(function () {
                unsafeWindow.location.href = current_Gateway;
            }, delay.MEDIUM);
            console.log("ReStarting");
        }

        if (unsafeWindow.client.getCurrentCharAtName() != fullCharName) {
            loadCharacter(fullCharName);
            return;
        }

        // Try to start tasks
        if (processCharacter()) {
            return;
        }

        // Switch characters as necessary
        switchChar();
    }
    dailySCA();
}

function loadCharacter(charname) {
    // Load character and restart next load loop
    console.log("Loading gateway script for", charname);
    startedTask["currTaskChar"] = charname;
    unsafeWindow.client.dataModel.loadEntityByName(charname);

    // MAC-NW -- AD Consolidation -- Banker Withdraw Secion
    try {
        var testChar = unsafeWindow.client.dataModel.model.ent.main.name;
        unsafeWindow.client.dataModel.fetchVendor('Nw_Gateway_Professions_Merchant');
        console.log("Loaded datamodel for", charname);
    }
    catch (e) {
        // TODO: Use callback function
        window.setTimeout(function () {
            loadCharacter(charname);
        }, delay.SHORT);
        return;
    }

    setTaskSlots();

    if (settings["autoexchange"]) {

        unsafeWindow.client.dataModel.fetchExchangeAccountData();

        try {
            var testExData = unsafeWindow.client.dataModel.model.exchangeaccountdata.openorders;
            console.log("Loaded zen exchange data for", charname);
        }
        catch (e) {
            // TODO: Use callback function
            window.setTimeout(function () {
                loadCharacter(charname);
            }, delay.SHORT);
            return;
        }

        // Check to see if this is the designated banker character
        if (settings["bankchar"] == unsafeWindow.client.dataModel.model.ent.main.name) {
            // This is the banker -- withdraw any buy listings that match the transfer rate set in panel
            window.setTimeout(withdrawZexOffer, delay.MEDIUM);
            // withdraw the balance from exchange
            window.setTimeout(function () {
                if (parseInt(client.dataModel.model.exchangeaccountdata.readytoclaimescrow) > 0) {
                    client.sendCommand("GatewayExchange_ClaimTC", client.dataModel.model.exchangeaccountdata.readytoclaimescrow);
                    console.log("Attempting to withdraw exchange balancees... ClaimTC: " + client.dataModel.model.exchangeaccountdata.readytoclaimescrow);
                }
                if (parseInt(client.dataModel.model.exchangeaccountdata.readytoclaimmtc) > 0) {
                    client.sendCommand("GatewayExchange_ClaimMTC", client.dataModel.model.exchangeaccountdata.readytoclaimmtc);
                    console.log("Attempting to withdraw exchange balancees... ClaimMT: " + client.dataModel.model.exchangeaccountdata.readytoclaimmtc);
                }

            }, delay.SHORT);
        }

        WaitForState("button.closeNotification").done(function () {
            $("button.closeNotification").click();
        });

        unsafeWindow.client.dataModel.loadEntityByName(charname);

    } else {
        console.log("Zen Exchange AD transfer not enabled. Skipping Zex Posting..");
    }
    // MAC-NW

    // MAC-NW -- Moved Professoin Merchant loading here with testing/waiting to make sure it loads
    try {
        var testProfMerchant = client.dataModel.model.vendor.items;
        console.log("Loaded profession merchant for", charname);
    }
    catch (e) {
        // TODO: Use callback function
        window.setTimeout(function () {
            loadCharacter(charname);
        }, delay.SHORT);
        return;
    }

    // Check Vendor Options & Vendor matched items
    vendorJunk();

    dfdNextRun.resolve();
}

function addSettings() {
    if ($("#settingsButton").length)
        return;
    // Add the required CSS
    AddCss("\
#settingsButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 0px; top: 0px; padding: 3px; z-index: 1000;}\
#pauseButton{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); display: block; position: fixed; overflow: auto; right: 23px; top: 0px; padding: 3px; z-index: 1000;}\
/* MAC-NW -- Put Panel at a higher layer than status window */ #settingsPanel{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); color: rgb(0, 0, 0); position: fixed; overflow: auto; right: 0px; top: 0px; width: 750px;max-height:800px;font: 12px sans-serif; text-align: left; display: block; z-index: 1001;}\
#settings_title{font-weight: bolder; background: none repeat scroll 0% 0% rgb(204, 204, 204); border-bottom: 1px solid rgb(102, 102, 102); padding: 3px;}\
#settingsPanelButtonContainer {background: none repeat scroll 0% 0% rgb(204, 204, 204); border-top: 1px solid rgb(102, 102, 102);padding: 3px;text-align:center} \
#settingsPanel label.purple {font-weight:bold;color:#7C37F6}\
#settingsPanel label.blue {font-weight:bold;color:#007EFF}\
#settingsPanel label.green {font-weight:bold;color:#8AFF00}\
#settingsPanel label.white {font-weight:bold;color:#FFFFFF}\
#charPanel {width:98%;max-height:400px;overflow:auto;display:block;padding:3px;}\
#charPanel div div ul li { display: inline-block; width: 48%; }\
.inventory-container {float: left; clear: none; width: 270px; margin-right: 20px;}\
#prinfopane {position: fixed; top: 5px; left: 200px; display: block; z-index: 1000;}\
.prh3 {padding: 5px; height: auto!important; width: auto!important; background-color: rgba(0, 0, 0, 0.7);}\
.custom-radio{width:16px;height:16px;display:inline-block;position:relative;z-index:1;top:3px;background-color:#fff;margin:0 4px 0 2px;}\
.custom-radio:hover{background-color:black;} .custom-radio.selected{background-color:red;} .custom-radio-selected-text{color:darkred;font-weight:500;}\
.custom-radio input[type='radio']{margin:1px;position:absolute;z-index:2;cursor:pointer;outline:none;opacity:0;_nofocusline:expression(this.hideFocus=true);-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);filter:alpha(opacity=0);-khtml-opacity:0;-moz-opacity:0}\
#settingsPanel input[type='button'].button-green,#settingsPanel input[type='button'].button-red,#settingsPanel input[type='button'].button-yellow,#settingsPanel input[type='button'].button-blue{color:#eff;border-radius:4px;text-shadow:0 1px 1px rgba(0,0,0,0.2);font-size:110%;font-weight:bold;}\
.pure-button{display:inline-block;*display:inline;zoom:1;line-height:normal;white-space:nowrap;vertical-align:baseline;text-align:center;cursor:pointer;-webkit-user-drag:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.pure-button::-moz-focus-inner{padding:0;border:0}.pure-button{font-family:inherit;font-size:100%;*font-size:90%;*overflow:visible;padding:.5em 1em;color:#444;color:rgba(0,0,0,.8);*color:#444;border:1px solid #999;border:0 rgba(0,0,0,0);background-color:#E6E6E6;text-decoration:none;border-radius:2px}.pure-button-hover,.pure-button:hover,.pure-button:focus{filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#1a000000', GradientType=0);background-image:-webkit-gradient(linear,0 0,0 100%,from(transparent),color-stop(40%,rgba(0,0,0,.05)),to(rgba(0,0,0,.1)));background-image:-webkit-linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));background-image:-moz-linear-gradient(top,rgba(0,0,0,.05) 0,rgba(0,0,0,.1));background-image:-o-linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1));background-image:linear-gradient(transparent,rgba(0,0,0,.05) 40%,rgba(0,0,0,.1))}.pure-button:focus{outline:0}.pure-button-active,.pure-button:active{box-shadow:0 0 0 1px rgba(0,0,0,.15) inset,0 0 6px rgba(0,0,0,.2) inset}.pure-button[disabled],.pure-button-disabled,.pure-button-disabled:hover,.pure-button-disabled:focus,.pure-button-disabled:active{border:0;background-image:none;filter:progid:DXImageTransform.Microsoft.gradient(enabled=false);filter:alpha(opacity=40);-khtml-opacity:.4;-moz-opacity:.4;opacity:.4;cursor:not-allowed;box-shadow:none}.pure-button-hidden{display:none}.pure-button::-moz-focus-inner{padding:0;border:0}.pure-button-primary,.pure-button-selected,a.pure-button-primary,a.pure-button-selected{background-color:#0078e7;color:#fff}\
#settingsPanel input[type='button'].button-green{background:#1cb841; margin: 2px 20px 2px 2px;}\
#settingsPanel input[type='button'].button-red{background:#ca3c3c; margin: 2px 2px 2px 2px;}\
#settingsPanel input[type='button'].button-yellow{background:#df7514; margin: 2px 2px 2px 2px;}\
#settingsPanel input[type='button'].button-blue{background:#42b8dd; margin: 2px 2px 2px 2px;}\
");

    // Add settings panel to page body
    $("body").append(
        '<div id="settingsPanel">\
<div id="settings_title">\
<img src=' + image_prefs + ' style="float: left; vertical-align: text-bottom;"\>\
<img id="settings_close" src=' + image_close + ' title="Click to hide preferences" style="float: right; vertical-align: text-bottom; cursor: pointer; display: block;"\>\
<span style="margin:3px">Settings</span>\
</div>\
<form style="margin: 0px; padding: 0px">\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto; margin: 3px; padding: 0px;">\
</ul>\
</form>\
</div>'
    );

    // Add each setting input
    var settingsList = $("#settingsPanel form ul");
    for (var i = 0; i < settingnames.length; i++) {
        var id = 'settings_' + settingnames[i].name;
        var indent = (countLeadingSpaces(settingnames[i].title) >= 1) ? 1 : 0;
        /*if ((settingnames[i].type == 'text' && settingnames[i-1].type == 'checkbox') || (settingnames[i-1] && settingnames[i].type == 'checkbox' && settingnames[i-1].type == 'text'))
             settingsList.append('<li style="margin-left:0em; width: 48%; display: inline-block;"/>&nbsp;</li>')*/
        var border = "";
        if (settingnames[i].border)
            border = "border-top: #000 solid 1px;"
            switch (settingnames[i].type) {
                case "checkbox":
                    var _checkWidth = "48%";
                    if (i < 9)
                        _checkWidth = "31%";
                    if (settingnames[i].border)
                        _checkWidth = "98%";
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; width: ' + _checkWidth + '; display: inline-block;"><input style="margin:4px" name="' + id + '" id="' + id + '" type="checkbox" /><label class="' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label></li>')
                    $('#' + id).prop('checked', settings[settingnames[i].name]);
                    break;
                case "text":
                    if (settingnames[i].border)
                        _inputkWidth = "95%; padding: 10px";
                    else
                        _inputkWidth = "46%";
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; margin-top:1em; width: ' + _inputkWidth + '; display: inline-block;"<label class="' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label><input style="margin:4px; padding: 2px; min-width: 80%;" name="' + id + '" id="' + id + '" type="text" /></li>')
                    $('#' + id).val(settings[settingnames[i].name]);
                    break;
                case "password":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; margin-top:1em; width: 46%; display: inline-block;"' + settingnames[i].class + '" for="' + id + '">' + settingnames[i].title + '</label><input style="margin:4px; padding: 2px; min-width: 80%;" name="' + id + '" id="' + id + '" type="password" /></li>')
                    $('#' + id).val(settings[settingnames[i].name]);
                    break;
                case "select":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'padding-left:' + indent + 'em; width: 48%; display: inline-block;"' + settingnames[i].class + '" style="padding-left:4px" for="' + id + '">' + settingnames[i].title + '</label><select style="margin:4px" name="' + id + '" id="' + id + '" /></li>')
                    var options = settingnames[i].opts;
                    var select = $('#' + id);
                    for (var j = 0; j < options.length; j++) {
                        if (settings[settingnames[i].name] == options[j].path)
                            select.append('<option value="' + options[j].path + '" selected="selected">' + options[j].name + '</option>');
                        else
                            select.append('<option value="' + options[j].path + '">' + options[j].name + '</option>');
                    }
                    break;
                case "label":
                    settingsList.append('<li title="' + settingnames[i].tooltip + '" style="' + border + 'margin-left:' + indent + 'em;><label class="' + settingnames[i].class + '">' + settingnames[i].title + '</label></li>')
                    break;
            }
    }

    // Add character settings for each char
    var addText = '\
<script type="text/javascript">\
<!--\
function click_position(obj)\
{\
change_position(obj.value)\
}\
\
function customRadio(radioName) {\
var radioButton = $( \'input[name="\'+ radioName +\'"]\');\
$(radioButton).each(function(){\
$(this).wrap( "<span class=\'custom-radio\'></span>" );\
if($(this).is(\':checked\')){\
$(this).parent().addClass("selected");\
$(this).parent().parent().addClass("custom-radio-selected-text");\
}\
});\
$(radioButton).click(function(){\
if($(this).is(\':checked\')){\
$(this).parent().addClass("selected");\
$(this).parent().parent().addClass("custom-radio-selected-text");\
}\
$(radioButton).not(this).each(function(){\
$(this).parent().removeClass("selected");\
$(this).parent().parent().removeClass("custom-radio-selected-text");\
});\
});\
}\
function change_position(val)\
{\
for (var i = 0; i < ' + settings["charcount"] + '; i++)\
{\
document.getElementById("charContainer"+i).style.display="none";\
}\
document.getElementById("charContainer"+val).style.display="block";\
}\
//-->\
</script>\
<div id="charPanel">\
<div style="width:30%;float:left;max-height:400px;overflow:auto;">\
';
    for (var i = 0; i < settings["charcount"]; i++) {
        addText += '\
<div><label for="value_' + i + '" style="display:block;padding-top:2px;"><input autocomplete="off" type="radio" name="radio_position" onclick="click_position(this)" id="value_' + i + '" value="' + i + '" />' + settings["nw_charname" + i] + '</label></div>\
';
    }
    addText += '\
</div>\
<div style="width:69%;float:right;">\
';
    for (var i = 0; i < settings["charcount"]; i++) {
        addText += '\
<div id="charContainer' + i + '" style="display:none">\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto;">\
';
        var k = 0 + (i * charSettings.length / settings["charcount"]);
        var id = 'settings_' + charSettings[k].name;
        addText += '<li title="' + charSettings[k].tooltip + '"><input style="margin:4px; padding: 2px;" name="' + id + '" id="' + id + '" type="text" /></li>';
        for (var j = 1; j < (charSettings.length / settings["charcount"]); j++) {
            k = j + (i * charSettings.length / settings["charcount"]);
            if (charSettings[k].type == 'void') {
                continue;
            }
            id = 'settings_' + charSettings[k].name;
            addText += '<li title="' + charSettings[k].tooltip + '"><input maxlength="2" size="1" style="margin:4px; padding: 2px;" name="' + id + '" id="' + id + '" type="text" /><label class="' + charSettings[k].class + '" for="' + id + '">' + charSettings[k].title + '</label></li>';
        }
        addText += '</ul>\
</div>';
    }
    addText += '\
</div>\
</div>\
';
    $("#settingsPanel form").append(addText);

    // Add values to character input fields
    for (var i = 0; i < charSettings.length; i++) {
        var id = 'settings_' + charSettings[i].name;
        $('#' + id).val(settings[charSettings[i].name]);
    }

    // Add save/cancel buttons to panel
    $("#settingsPanel form").append('\
<div id="settingsPanelButtonContainer">\
<input id="settings_save" class="button-blue pure-button" type="button" value="Save and Apply">\
<input id="settings_close" class="button-yellow pure-button" type="button" value="Close">\
<input id="settings_sca" class="button-red pure-button" type="button" value="Cycle SCA">\
<input id="log_error" class="button-green pure-button" type="button" value="Log Error">\
<input id="settings_wipe" class="button-white pure-button" type="button" value="RESET all">\
</div>');

    // Add open settings button to page
    $("body").append('<div id="settingsButton"><img src="' + image_prefs + '" title="Click to show preferences" style="cursor: pointer; display: block;"></div>');

    // Add pause button to page
    $("body").append('<div id="pauseButton"><img src="' + (settings["paused"] ? image_play : image_pause) + '" title="Click to ' + (settings["paused"] ? "resume" : "pause") + ' task script" style="cursor: pointer; display: block;"></div>');

    // Add info pane
    $("body").append("<div id='prinfopane' class='header-newrelease'>");

    // Add the javascript
    $("#settingsPanel").hide();
    $("#settingsButton").click(function () {
        $("#settingsButton").hide();
        $("#pauseButton").hide();
        $("#settingsPanel").show();
    });
    $("#settings_close,settings_cancel").click(function () {
        $("#settingsButton").show();
        $("#pauseButton").show();
        $("#settingsPanel").hide();
    });
    $("#pauseButton").click(PauseSettings);

    // Use setTimeout to workaround permission issues when calling GM functions from main window
    $("#settings_save").click(function () {
        setTimeout(function () {
            SaveSettings();
        }, 0)
    });
    $("#settings_sca").click(function () {
        $("#settings_close").trigger("click");
        unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + "/adventures");
        processSwordCoastDailies();
    });
    $("#log_error").click(function () {
        setTimeout(function () {
            var epic = GM_getValue("Epic_error", 0);
            var un_def_err = GM_getValue("Undefine_error", 0)
            console.log("Button Epic fails[" + epic +"] & undefine [" + un_def_err + "].");
        }, 0)
    });
    $("#settings_wipe").click(function() {
        setTimeout(function () {
            // Delete all saved settings, EXCEPT password/username
            var keys = GM_listValues();
            for (i = 0; i < keys.length; i++) {
                var key = keys[i];
                if (!key.match(/(username|password)/)) {
                    //console.log("do delete these", key);
                    GM_deleteValue(key);}
            }
        }, 0)
        unsafeWindow.location.href = current_Gateway;
        return;
    });

    customRadio("radio_position");

    $('#update-content-inventory-bags-0 .bag-header').waitUntilExists(function () {
        if ($('#update-content-inventory-bags-0 .bag-header div').length && !$('#update-content-inventory-bags-0 .bag-header div.autovendor').length) {
            $('#update-content-inventory-bags-0 .bag-header').append('<div class="input-field button light autovendor"><div class="input-bg-left"></div><div class="input-bg-mid"></div><div class="input-bg-right"></div><button id="nwprofs-autovendor">Auto Vendor</button></div>');
            $("button#nwprofs-autovendor").on("click", vendorJunk);
        }
    });
}

function PauseSettings(_action) {
    if (_action != "pause" || _action != "unpause")
        _action = "toggle";
    if (_action == "toggle")
        settings["paused"] = !settings["paused"];
    if (_action == "pause")
        settings["paused"] = true;
    if (_action == "unpause")
        settings["paused"] = false;
    setTimeout(function () {
        GM_setValue("paused", settings["paused"]);
    }, 0);
    $("#settings_paused").prop("checked", settings["paused"]);
    $("#pauseButton img").attr("src", (settings["paused"] ? image_play : image_pause));
    $("#pauseButton img").attr("title", "Click to " + (settings["paused"] ? "resume" : "pause") + " task script");
}

function SaveSettings() {
    var charcount = settings["charcount"];

    // Get each value from the UI
    for (var i = 0; i < settingnames.length; i++) {
        var name = settingnames[i].name;
        var el = $('#settings_' + name);
        var value = false;
        switch (settingnames[i].type) {
            case "checkbox":
                value = el.prop("checked");
                break;
            case "text":
                value = el.val();
                break;
            case "password":
                value = el.val();
                break;
            case "select":
                value = el.val();
                break;
            case "label": // Labels don't have values
                continue;
        }
        if (typeof (settingnames[i].onsave) === "function") {
            console.log("Calling 'onsave' for", name);
            settingnames[i].onsave(value, settings[name]);
        }
        if (settings[name] !== value) {
            settings[name] = value;
        } // Save to local cache
        if (GM_getValue(name) !== value) {
            GM_setValue(name, value);
        } // Save to GM cache
    }

    // Get character settings from UI
    for (var i = 0; i < charSettings.length; i++) {
        if (charSettings[i].type == 'void') {
            continue;
        }
        var name = charSettings[i].name;
        var el = $('#settings_' + name);
        var value = el.val();
        // Save to local cache
        if (settings[name] !== value) {
            settings[name] = value;
        }
        // Save to GM cache
        GM_setValue(name, value);
    }

    // If character numbers have changed reload page
    if (charcount != settings["charcount"]) {
        console.log("Reloading gateway to update character count");
        unsafeWindow.location.href = current_Gateway; // edited by RottenMind
        return;
    }

    // Close the panel
    $("#settingsButton").show();
    $("#pauseButton img").attr("src", (settings["paused"] ? image_play : image_pause));
    $("#pauseButton img").attr("title", "Click to " + (settings["paused"] ? "resume" : "pause") + " task script");
    $("#pauseButton").show();
    $("#settingsPanel").hide();
}

function vendorJunk(evnt) {
    var _charGold = unsafeWindow.client.dataModel.model.ent.main.currencies.gold;
    var _vendorItems = [];
    var _sellCount = 0;
    var _Alchemy_state = parseInt(settings["Alchemy"]);
    //console.log(_Alchemy_state === 0, _Alchemy_state, "values out, Alchemy state, True allows Vendoring if selected, is allways False if Alchemy is on work");
    if (settings["autovendor_kits_altars_limit"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Consumable_Skill/, limit: 50};
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Portable_Altar$/, limit: 80};
    }
    if (settings["autovendor_kits_altars_all"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Portable_Altar$/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Consumable_Skill/, limit: 0};
    }
    if (settings["autovendor_rank2"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^T1_Enchantment/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^T1_Runestone/, limit: 0};
    }
    if (settings["autovendor_rank2"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^T2_Enchantment/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^T2_Runestone/, limit: 0};
    }
    if (settings["autovendor_rank3"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^T3_Enchantment/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^T3_Runestone/, limit: 0};
    }
    if (settings["autovendor_pots_1_2"] && (_Alchemy_state === 0)) {
        _vendorItems[_vendorItems.length] = {
            pattern: /^Potion_(Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)(|_2)$/, limit: 0
        };
    }
    if (settings["autovendor_pots_3_4"] && (_Alchemy_state === 0)) {
        _vendorItems[_vendorItems.length] = {
            pattern: /^Potion_(Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)_[3-4]$/,
            limit: 0
        };
    }
    if (settings["autovendor_pots_5"] && (_Alchemy_state === 0)) {
        _vendorItems[_vendorItems.length] = {
            pattern: /^Potion_(Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)_5$/, ///^Potion_(Healing|Tidespan|Force|Fortification|Reflexes|Accuracy|Rejuvenation)(|_[1-5])$/
            limit: 0
        };
    }
    
    if (settings["autovendor_pots_healing"] && (_Alchemy_state === 0)) {
        _vendorItems[_vendorItems.length] = {
            pattern: /^Potion_Healing(|_[1-5])$/,
            limit: 0
        };
    }
    if (settings["autovendor_junk"]) {
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Snowworks_/, limit: 0}; // Winter Festival fireworks small & large
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Skylantern/, limit: 0}; // Winter Festival skylantern
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Partypopper/, limit: 0}; // Party Poppers
        _vendorItems[_vendorItems.length] = {pattern: /^Item_Fireworks/, limit: 0}; // Fireworks
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Plate_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Decoration_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /_Green_T[1-7]_Unid$/, limit: 0}; // Unidentified Green Gear
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Gem_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Jewelry_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Mug_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Object_Trinket_/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Magic Focus$/, limit: 0};
        _vendorItems[_vendorItems.length] = {pattern: /^Gem_Upgrade_Resource_R1$/, limit: 0}; // sells only minor mark trash
    }
    if (settings["autovendor_profresults"] && _charGold < 2) { //this "gold" threshold must be global var and adjustable by users
        _vendorItems[_vendorItems.length] = {
            pattern : /(Crafting_Resource_Pelt)_T[1-3]$/,
            limit : 10
        }; //"Crafting_Resource_Ore_T1"  Pelt_T1
        _vendorItems[_vendorItems.length] = {
            pattern : /(Resource_Wood)_T[1-3]$/,
            limit : 10
        }; //"Crafting_Resource_Ore_T1"  Pelt_T1
        _vendorItems[_vendorItems.length] = {
            pattern : /(Crafting_Resource_Ore)_T[1-3]$/,
            limit : 10
        }; //"Crafting_Resource_Ore_T1"> Pelt_T1
        console.log("copper amount is under sale threshold", _charGold);
    }

    // edited by RottenMind
    if (settings["autovendor_profresults"]) {
        _vendorItems[_vendorItems.length] = {
            pattern: /^Crafted_(Jewelcrafting_Waist_Offense_3|Jewelcrafting_Neck_Defense_3|Jewelcrafting_Waist_Defense_3|Tailoring_T3_Helm_Set_1|Med_Armorsmithing_T3_Chain_Armor_Set_1|Med_Armorsmithing_T3_Chain_Pants2|Med_Armorsmithing_T3_Chain_Shirt2|Med_Armorsmithing_T3_Chain_Helm_Set_1|Med_Armorsmithing_T3_Chain_Pants|Med_Armorsmithing_T3_Chain_Boots_Set_1|Hvy_Armorsmithing_T3_Plate_Armor_Set_1|Hvy_Armorsmithing_T3_Plate_Pants2|Hvy_Armorsmithing_T3_Plate_Shirt2|Hvy_Armorsmithing_T3_Plate_Helm_Set_1|Hvy_Armorsmithing_T3_Plate_Boots_Set_1|Leatherworking_T3_Leather_Armor_Set_1|Leatherworking_T3_Leather_Pants2|Leatherworking_T3_Leather_Shirt2|Leatherworking_T3_Leather_Helm_Set_1|Leatherworking_T3_Leather_Boots_Set_1|Tailoring_T3_Cloth_Boots_Set_1|Tailoring_T3_Cloth_Armor_Set_3|Tailoring_T3_Cloth_Armor_Set_2|Tailoring_T3_Cloth_Armor_Set_1|Tailoring_T3_Cloth_Pants2_Set2|Tailoring_T3_Cloth_Shirt2|Tailoring_T3_Cloth_Helm_Set_1|Artificing_T3_Pactblade_Temptation_5|Artificing_T3_Icon_Virtuous_5|Weaponsmithing_T3_Dagger_4|Weaponsmithing_T3_Longsword_Set_3|Weaponsmithing_T3_Mace_Set_3|Weaponsmithing_T3_Greatsword_Set_3|Weaponsmithing_T3_Dagger_Set_3|Weaponsmithing_T3_Blades_Set_3|Weaponsmithing_T3_Longbow_Set_3)$/, limit: 0};
        _vendorItems[_vendorItems.length] = {
            pattern: /^Potion_(Unstable|Unstable_[1-3])$/,	limit : 0}; // Alchemy experience potions

    }
    // edited by RottenMind
    if (_vendorItems.length > 0) {
        console.log("Attempting to vendor selected items...");
        _sellCount = vendorItemsLimited(_vendorItems);
        if (_sellCount > 0 && !evnt) {
            var _sellWait = _sellCount * 1000;
            PauseSettings("pause");
            window.setTimeout(function () {
                PauseSettings("unpause");
            }, _sellWait);
        }
    }
}

/** Start, Helpers added by users.
     * Adds fetures, options to base script and can be easily removed if needed
     * Add description so anyone can see if they can use Function somewhere
     * Use "brackets" around function start and end //yourname
     */
//RottenMind, returns inventory space, use Inventory_bagspace(); gives current free bags slots, from MAC-NW function
function Inventory_bagspace() {
    var _pbags = client.dataModel.model.ent.main.inventory.playerbags;
    var _bagUnused = 0;
    $.each(_pbags, function (bi, bag) {
        bag.slots.forEach(function (slot) {
            if (slot === null || !slot || slot === undefined) {
                _bagUnused++;
            }
        });
    });
    return _bagUnused;
}

/** Count resouce in bags
     * edited by WloBeb
     * @param {string} name The name of resource
     */
function countResource(name) {
    var count = 0;
    var _bags = unsafeWindow.client.dataModel.model.ent.main.inventory.bags;
    console.log("Checking bags for " + name);
    $.each(_bags, function (bi, bag) {
        bag.slots.forEach(function (slot) {
            if (slot && slot.name === name) {
                count = count + slot.count;
            }
        });
    });
    return count;
}
/** Report error in GM for later  use
     * edited by RM
     *
     */
function Epic_button_error() {
    var counter = GM_getValue('Epic_error', 0);
    // console.log('This script has been run ' + counter + ' times.');
    GM_setValue('Epic_error', ++counter);
    return counter;
}
function Array_undefine_error() {
    var counter = GM_getValue('Undefine_error', 0);
    // console.log('This script has been run ' + counter + ' times.');
    GM_setValue('Undefine_error', ++counter);
    return counter;
}
// This just set Banker to character 1 if its not him all-ready
function get_banker(){
    var me = GM_getValue("nw_charname0",0);
    var banker = GM_getValue("bankchar",0);
    //console.log(me, banker);
    if (me !== banker) {
        GM_setValue('bankchar', me);
        unsafeWindow.location.href = current_Gateway;
        return;
    }
}
/**
 * Created by RM on 29.4.2015.
 * Runs daily SCA -rolls in GAteway Bot
*/
function dailySCA() {
    var char, today, thisday, thishour, dailyroll, dateforlastroll;
    char = settings["charcount"];
    today = new Date();
    thisday = today.getDay();
    thishour = today.getHours();
    if (settings["dailySCA"] && chardelay > 10000 * char && (thishour >= 14 || thishour >= 23)) {
        dailyroll = GM_getValue("dailyswordcoast", 0);
        dateforlastroll = GM_getValue("dateforlastrolls", 0);
        //console.log(thisday, dateforlastroll, dailyroll, chardelay, thishour);
        if (thisday !== dateforlastroll) {
            GM_setValue("dateforlastrolls", thisday);
            GM_setValue("dailyswordcoast", 0);
            dailyroll = 0;
        }
        if (dailyroll < (4 || undefined)) {
            unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + "/adventures");
            processSwordCoastDailies();
            dailyroll++;
            GM_setValue("dailyswordcoast", dailyroll);
            GM_getValue("dailyswordcoast", 0);
        }
    }
}

/** End, Helpers added by users.*/

// Add the settings button and start a process timer
addSettings();
timerHandle = window.setTimeout(function () {
    process();
}, delay.SHORT);
})();