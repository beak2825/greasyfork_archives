// ==UserScript==
// @name           NWPb- Grinding Script 2.0
// @description    Automatically selects professions for empty slots
// @include        https://gateway.playneverwinter.com
// @include        https://gateway.playneverwinter.com/*
// @include        https://gatewaysitedown.playneverwinter.com
// @include        https://gatewaysitedown.playneverwinter.com/*
// @include        http://gateway.playneverwinter.com
// @include        http://gateway.playneverwinter.com/*
// @include        http://gatewaysitedown.playneverwinter.com
// @include        http://gatewaysitedown.playneverwinter.com/*
// @version        2.0.1
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_listValues
// @grant          GM_deleteValue
// @namespace https://greasyfork.org/users/4679-oldbaldyone
// @downloadURL https://update.greasyfork.org/scripts/4763/NWPb-%20Grinding%20Script%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/4763/NWPb-%20Grinding%20Script%2020.meta.js
// ==/UserScript==

/* RELEASE NOTES
0.2.1 
-   Added BlackIce proffession
-   Added wont waste assets on all professions
0.1.0 
-   Initial release
 */

// Make sure it's running on the main page, no frames
if (window.self !== window.top) {
    throw "";
}

(function () {
    
    var image_pause = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAY" +
        "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" +
        "BNp57TyT3+MAAAAASUVORK5CYII=",
        
        image_play = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYA" +
        "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",
        
        image_prefs = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
        "AMAAAAoLQ9TAAAAllBMVEUAGQASEhIfHx8fJy8pKSk2NjZBQUFJR0ZQUE9RUVFSUlJNX3No" +
        "aGhsaWdramlycG1meY98fHx+fn5wgpV0iqKKh4R4jaR9jJx8kad9kad/mbONmaWEnrmEnrq" +
        "koZy3t7fIx8bKyMHT0c3S0dDU09DV1NPP1t3W1dXY2Njb2tfe29bf3tzj4uHr6+js6+r39/" +
        "f5+PgAAABrL3yvAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxMAAAsTA" +
        "QCanBgAAAAHdElNRQfWBRoFKh31UQ8DAAAAgUlEQVQY022OxxLCMAwFRSc4BEIPJZQQ08v+" +
        "/8+RsTExDDpIe3ijfSJ/hx9g62Dt4GaAI+8YT0t27+BxxvvE/no5pYT10lGFrE34Ja40W3g" +
        "1oMGmW7YZ6hnCYexKTPVkXivuvWe1Cz1aKqPNI3N0slI2TNYZiARJX30qERc7wBPKC4WRDz" +
        "WdWHfmAAAAAElFTkSuQmCC",
        
        image_close = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQC" +
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
    var dfdNextRun = $.Deferred();
    
    var timeoutHandle; // handle for setTimeouted dfdNextRun.reject();
    
    var delay = {
        SHORT: 1000,
        MEDIUM: 5000,
        LONG: 30000,
        DEFAULT: 6000, // default delay
        TIMEOUT: 60000, // delay for cycle processing timeout
    };
    
    
    /*
     * Tasklist can be modified to configure the training you want to perform.
     * The configurable options window sets how many profession slots you want to use for each profession.
     * The level array below for each professions specifies the tasks you want to learn at each crafting level.
     * Each craft slot will pick the first task that meets requirements.
     */
    var taskList = [{
        // Leadership
        taskName: "Leadership",
        level: {
            0:["Leadership_Tier0_Intro_1"],
            1:["Leadership_Tier0_Intro_5", "Leadership_Tier0_Intro_4","Leadership_Tier0_Intro_3", "Leadership_Tier0_Intro_2"],
            2:["Leadership_Tier1_2_Guardduty"],
            3:["Leadership_Tier1_2_Guardduty"],
            4:["Leadership_Tier1_4_Protect"],
            5:["Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore"],
            6:["Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore"],
            7:["Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore"],
            8:["Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore"],
            9:["Leadership_Tier1_4_Protect","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],
            10:["Leadership_Tier1_4_Protect","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            11:["Leadership_Tier1_4_Protect","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            12:["Leadership_Tier1_4_Protect","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            
            // Current model
            13:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            14:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            15:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier1_4_Protect","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            16:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier3_16_Fight","Leadership_Tier1_5_Explore","Leadership_Tier2_10_Battle"],
            17:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier3_17_Deliver","Leadership_Tier3_16_Fight","Leadership_Tier1_5_Explore","Leadership_Tier2_12_Taxes","Leadership_Tier2_10_Battle"],
            18:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier3_17_Deliver","Leadership_Tier3_16_Fight","Leadership_Tier1_5_Explore","Leadership_Tier2_12_Taxes","Leadership_Tier2_10_Battle"],
            19:["Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier3_17_Deliver","Leadership_Tier3_16_Fight","Leadership_Tier1_5_Explore","Leadership_Tier2_12_Taxes","Leadership_Tier2_10_Battle"],
            20:["Leadership_Tier3_20r_Master2","Leadership_Tier3_20r_Master1","Leadership_Tier3_20r_Master3","Leadership_Tier3_20_Destroy","Leadership_Tier3_17_Deliver","Leadership_Tier3_13r_Protectdiamonds","Leadership_Tier2_12_Taxes","Leadership_Tier3_16_Fight","Leadership_Tier3_13_Patrol","Leadership_Tier2_9_Chart","Leadership_Tier1_5_Explore"],
            //19:["Patrol the Mines","Chart Region","Deliver Metals","Fight Off Spellplagued","Explore Local Area","Collect Taxes","Train a Guard","Battle Undead","Hire a Mercenary"],
            //20:["Assault Enemy Stronghold","Follow Map to an Unknown Location","Recover Large Mineral Claim","Destroy Enemy Camp","Deliver Metals","Protect Diamond Shipment","Collect Taxes","Fight Off Spellplagued","Patrol the Mines","Chart Region","Explore Local Area"],
            
            // Training Mode
            /*
            13:["Leadership_Tier3_13_Recruit","Leadership_Tier2_7_Recruit","Leadership_Tier1_2_Recruit"],
            14:["Leadership_Tier3_13_Recruit","Leadership_Tier2_7_Recruit","Leadership_Tier1_2_Recruit"],
            15:["Leadership_Tier3_13_Recruit","Leadership_Tier2_7_Recruit","Leadership_Tier1_2_Recruit"],
            16:["Leadership_Tier3_13_Recruit","Leadership_Tier2_7_Recruit","Leadership_Tier1_2_Recruit"],
            17:["Leadership_Tier3_13_Recruit","Leadership_Tier2_7_Recruit","Leadership_Tier1_2_Recruit"],
            */
        },
    }, {
        // Mailsmithing
        taskName:"Armorsmithing_Med",
        level: {
            1:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			2:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			3:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			4:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			5:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			6:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			7:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			8:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			9:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			10:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			11:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			12:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			13:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			14:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master"],
			15:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			16:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			17:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			18:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			19:["Med_Armorsmithing_Tier3_Gather_Basic_Mass","Med_Armorsmithing_Tier3_Recruit_Master","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
			20:["Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier3_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier2_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic","Med_Armorsmithing_Tier1_Gather_Basic"],
        },
    }, {
        // Platesmithing
        taskName:"Armorsmithing_Heavy",
        level: {
            0:["Hvy_Armorsmithing_Tier0_Intro"],
            1:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			2:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			3:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			4:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			5:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			6:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			7:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			8:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			9:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			10:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			11:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			12:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			13:["Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			14:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			15:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			16:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			17:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			18:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			19:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Recruit_Master","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
			20:["Hvy_Armorsmithing_Tier3_Gather_Basic_Mass","Hvy_Armorsmithing_Tier3_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier2_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic","Hvy_Armorsmithing_Tier1_Gather_Basic"],
         },
    }, {
        // Leatherworking
        taskName:"Leatherworking",
        level: {
            1:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			2:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			3:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			4:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			5:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			6:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			7:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			8:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			9:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			10:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			11:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			12:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			13:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
			14:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
			15:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
			16:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
			17:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
            18:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
            19:["Leatherworking_Tier3_Gather_Basic_Mass","Leatherworking_Tier3_Recruit_Master"],
            20:["Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier3_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier2_Gather_Basic","Leatherworking_Tier1_Gather_Basic","Leatherworking_Tier1_Gather_Basic"],
        },
    }, {
        // Tailoring
        taskName:"Tailoring",
        level: {
            0:["Tailoring_Tier0_Intro"],
            1:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			2:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			3:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			4:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			5:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			6:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			7:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			8:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			9:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			10:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			11:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			12:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			13:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			14:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master"],
			15:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			16:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			17:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			18:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			19:["Tailoring_Tier3_Gather_Basic_Mass","Tailoring_Tier3_Recruit_Master","Tailoring_Tier2_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
			20:["Tailoring_Tier3_Gather_Basic","Tailoring_Tier2_Gather_Basic","Tailoring_Tier1_Gather_Basic"],
        },
    }, {
        // Artificing
        taskName: "Artificing",
        level: {
            0:["Artificing_Tier0_Intro_1"],
            1:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			2:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			3:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			4:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			5:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			6:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			7:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			8:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			9:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			10:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			11:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			12:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			13:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			14:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			15:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			16:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			17:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			18:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			19:["Artificing_Tier3_Gather_Basic_Mass","Artificing_Tier3_Recruit_Master","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
			20:["Artificing_Tier3_Gather_Basic","Artificing_Tier3_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier2_Gather_Basic","Artificing_Tier1_Gather_Basic","Artificing_Tier1_Gather_Basic"],
        },
    }, {
        // Weaponsmithing
        taskName: "Weaponsmithing",
        level: {
            0: ["Hire your first Smelter"],
            1:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			2:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			3:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			4:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			5:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			6:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			7:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			8:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			9:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			10:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			11:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			12:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			13:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			14:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			15:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			16:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			17:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			18:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			19:["Weaponsmithing_Tier3_Gather_Basic_Mass","Weaponsmithing_Tier3_Recruit_Master","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
			20:["Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier3_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier2_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic","Weaponsmithing_Tier1_Gather_Basic"],
        },
    }, {
        // Alchemy
        taskName: "Alchemy",
        level: {
            /* Grinding Aqua Regia */
			/*
            0:["Alchemy_Tier0_Intro_1"],
            1:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            2:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            3:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            4:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            5:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            6:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            7:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            8:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            9:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            10:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            11:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            12:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            13:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            14:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            15:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            16:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            17:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            18:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            19:["Alchemy_Tier2_Aquaregia","Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            20:["Alchemy_Tier1_Aquavitae","Alchemy_Tier1_Refine_Basic","Alchemy_Tier1_Gather_Components"],
            /*
            /* Leveling */
            
            0:["Alchemy_Tier0_Intro_1"],
            1:["Alchemy_Tier1_Experiment_Rank2","Alchemy_Tier1_Experimentation_Rank1","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            2:["Alchemy_Tier1_Experiment_Rank3","Alchemy_Tier1_Experimentation_Rank2","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            3:["Alchemy_Tier1_Experiment_Rank4","Alchemy_Tier1_Experimentation_Rank3","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            4:["Alchemy_Tier1_Experiment_Rank5","Alchemy_Tier1_Experimentation_Rank4","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            5:["Alchemy_Tier1_Experiment_Rank6","Alchemy_Tier1_Experimentation_Rank5","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            6:["Alchemy_Tier1_Experiment_Rank7","Alchemy_Tier1_Experimentation_Rank6","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            7:["Alchemy_Tier2_Experiment_Rank08","Alchemy_Tier2_Experimentation_Rank07","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            8:["Alchemy_Tier2_Experiment_Rank09","Alchemy_Tier2_Experimentation_Rank08","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            9:["Alchemy_Tier2_Experiment_Rank10","Alchemy_Tier2_Experimentation_Rank09","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            10:["Alchemy_Tier2_Experiment_Rank11","Alchemy_Tier2_Experimentation_Rank10","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            11:["Alchemy_Tier2_Experiment_Rank12","Alchemy_Tier2_Experimentation_Rank11","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            12:["Alchemy_Tier2_Experiment_Rank13","Alchemy_Tier2_Experimentation_Rank12","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            13:["Alchemy_Tier2_Experiment_Rank14","Alchemy_Tier2_Experimentation_Rank13","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            14:["Alchemy_Tier3_Experiment_Rank15","Alchemy_Tier3_Experimentation_Rank14","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            15:["Alchemy_Tier3_Experiment_Rank16","Alchemy_Tier3_Experimentation_Rank15","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            16:["Alchemy_Tier3_Experiment_Rank17","Alchemy_Tier3_Experimentation_Rank16","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            17:["Alchemy_Tier3_Experiment_Rank18","Alchemy_Tier3_Experimentation_Rank17","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            18:["Alchemy_Tier3_Experiment_Rank19","Alchemy_Tier3_Experimentation_Rank18","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            19:["Alchemy_Tier3_Experiment_Rank20","Alchemy_Tier3_Experimentation_Rank19","Alchemy_Tier3_Gather_Components","Alchemy_Tier2_Gather_Components","Alchemy_Tier1_Gather_Components"],
            20:["Alchemy_Tier3_Experimentation_Rank20"],
            
        },
    }, {
        // Black Ice
        taskName:"BlackIce",
        level: {
            0:["Blackice_Tier1_Mass_Process_Blackice","Blackice_Tier1_Process_Blackice"],
            1:["Blackice_Tier2_Purified_Enchantment_Healthsteal_Lesser","Blackice_Tier2_Corrupt_Enchantment_Lesser","Blackice_Tier1_Process_Blackice"],
            2:["Blackice_Tier3_Corrupt_Enchantment_Greater","Blackice_Tier3_Purified_Enchantment_Healthsteal_Greater","Blackice_Tier2_Purified_Enchantment_Healthsteal_Lesser","Blackice_Tier2_Corrupt_Enchantment_Lesser","Blackice_Tier1_Process_Blackice"],           
            //Blackice_Tier1_Process_Blackice
            //Blackice_Tier1_Mass_Process_Blackice
            //Blackice_Tier2_Corrupt_Enchantment_Lesser
            //Blackice_Tier2_Purified_Enchantment_Healthsteal_Lesser
            //Blackice_Tier2_Purified_Enchantment_Deflect_Lesser
            //Blackice_Tier2_Purified_Enchantment_Lesser
            //Blackice_Tier3_Corrupt_Enchantment_Greater
            //Blackice_Tier3_Purified_Enchantment_Healthsteal_Greater
            //Blackice_Tier3_Purified_Enchantment_Deflect_Greater
            //Blackice_Tier3_Purified_Enchantment_Greater
            //Blackice_Tier2_Corrupt_Enchantment_Lesser,Blackice_Tier2_Purified_Enchantment_Healthsteal_Lesser,
            //Blackice_Tier3_Corrupt_Enchantment_Greater,Blackice_Tier3_Purified_Enchantment_Healthsteal_Greater,
        },
    }, ];
              
    // settings definitions
    var globalSettingNames = [
        {name: 'paused',            title: 'Pause Script',                          def: false, type: 'checkbox',   tooltip: 'Disable All Automation'}, 
        {name: 'trainassets',       title: 'Train additional assets if needed',     def: false, type: 'checkbox',   tooltip: 'Enable to train/recruit assets if required by a task'},
        {name: 'preservelog',       title: 'Preserve log',                          def: false, type: 'checkbox',   tooltip: 'Enable to preserve log between page reloads'}, 
        {name: 'optionals',         title: 'Fill Optional Assets',                  def: false, type: 'checkbox',   tooltip: 'Enable to include selecting the optional assets of tasks'}, 
        {name: 'autopurchase',      title: 'Auto Purchase Resources',               def: true,  type: 'checkbox',   tooltip: 'Automatically purchase required resources from gateway shop (100 at a time)'}, 
        {name: 'refinead',          title: 'Gather AD',                             def: true,  type: 'checkbox',   tooltip: 'Enable refining of AD on character switch'}, 
        {name: 'autoreload',        title: 'Auto Reload',                           def: false, type: 'checkbox',   tooltip: 'Enabling this will reload the gateway periodically'}, 
        {name: 'autologin',         title: 'Attempt to login automatically',        def: false, type: 'checkbox',   tooltip: 'Automatically attempt to login to the neverwinter gateway site'}, 
        {name: 'nw_username',       title: '  Neverwinter Username',                def: '',    type: 'text',       tooltip: ''}, 
        {name: 'nw_password',       title: '  Neverwinter Password',                def: '',    type: 'password',   tooltip: ''}, 

    ];
    
    var charSettingNames = [
        {name: 'entity',                title: 'Entity',            def: 'character@handle',    type: 'text',   tooltip: 'Entity'}, 
        {name: 'Leadership',            title: 'Leadership',        def: '9',                   type: 'text',   tooltip: 'Number of slots to assign to Leadership'}, 
        {name: 'Armorsmithing_Med',     title: 'Mailsmithing',      def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Mailsmithing'},
        {name: 'Armorsmithing_Heavy',   title: 'Platesmithing',     def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Platesmithing'}, 
        {name: 'Leatherworking',        title: 'Leatherworking',    def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Leatherworking'}, 
        {name: 'Tailoring',             title: 'Tailoring',         def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Tailoring'}, 
        {name: 'Artificing',            title: 'Artificing',        def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Artificing'}, 
        {name: 'Weaponsmithing',        title: 'Weaponsmithing',    def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Weaponsmithing'}, 
        {name: 'Alchemy',               title: 'Alchemy',           def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to Alchemy'}, 
        {name: 'BlackIce',              title: 'Black Ice Shaping', def: '0',                   type: 'text',   tooltip: 'Number of slots to assign to BlackIce'},

    ];
                            
    // Load global settings from persistent store
    var globalSettings = JSON.parse(GM_getValue('mlng_globalSettings', "{}"));
                            
    // Set defaults if not found for each setting
    globalSettingNames.forEach(function (element, index, array) {
    // Ignore label types
    if (element.type === 'label') {
    return;
    }
    if (globalSettings[element.name] === undefined) {
        globalSettings[element.name] = element.def;
    }
    // call the onsave for the setting if it exists
    if (typeof (element.onsave) === "function") {
        _log("Calling 'onsave' for", element.name);
        element.onsave(globalSettings[element.name], globalSettings[element.name]);
    }
});

// write back in case new defaults were merged
GM_setValue('mlng_globalSettings', JSON.stringify(globalSettings));

// Load character settings from persistent store
var charSettings = JSON.parse(GM_getValue('mlng_charSettings', "{}"));

// Page definitions
var pages = {
    LOGIN: {
        name: "Login",
        path: "div#login"
    },
    GUARD: {
        name: "Account Guard",
        path: "div#page-accountguard"
    },
    CHARSELECT: {
        name: "Character Select",
        path: "div.page-characterselect"
    },
    FRONTPAGE: {
        name: "Front Page",
        path: "div.page-front"
    },
    PROFESSIONS: {
        name: "Professions",
        path: "div.page-professions"
    },
};

function _log(msg) {
    var _el = $("#logWindow");
    // append msg to log window
    _el.append('<p>[' + new Date().toLocaleString() + '] ' + msg + '</p>');
    // if user doesn't hover the div, scroll it; warning: buggy in jquery 1.9.x
    if (!_el.is(':hover')) {
        _el.prop('scrollTop', _el.prop('scrollHeight'));
    }
}

function settingsCharacterInjectHTML() {
    // replace HTML containing character settings UI.
    
    var _text = '';
    Object.keys(charSettings).forEach(function (i) {
        _text += '<li><input type="radio" name="radio_position" id="value_' + i.replace(' ', '_') + '" value="' + i.replace(' ', '_') + '" /><label for="value_' + i.replace(' ', '_') + '">' + charSettings[i].entity + '</label>';
        _text += '<div id="charContainer_' + i.replace(' ', '_') + '" style="display:none"><ul style="list-style: none outside none;overflow:none;">';
        charSettingNames.forEach(function (element) {
            var id = 'charsettings_' + i.replace(' ', '_') + '_' + element.name;
            _text += '<li title="' + element.tooltip + '"><input style="margin:4px" name="' + id + '" id="' + id + '" type="text" value="' + charSettings[i][element.name] + '"/><label for="' + id + '">' + element.title + '</label></li>';
        });
        _text += '</ul></li></div>';
    });
    $("#charSettings ul").html(_text);
}

function settingsCharacterAdd() {
    var _entity, i;
    
    _entity = prompt("Enter your character's entity / ingame mail address", "character@handle");
    
    if (_entity === null || _entity.match(/\w@\w/) === null) {
        alert('Incorrect data, use charactername@accountname format');
        return;
    }
    charSettings[_entity] = {};
    for (i = 0; i < charSettingNames.length; i++) {
        charSettings[_entity][charSettingNames[i].name] = charSettingNames[i].name === 'entity' ? _entity : charSettingNames[i].def;
    }
    settingsCharacterInjectHTML();
}

function settingsCharacterWipe() {
    charSettings = {};
    GM_deleteValue('mlng_charSettings');
    
    settingsCharacterAdd();
    _log('Character settings wiped');
}

function settingsSave() {
    var name, el, value, i, j;
    
    // Global Settings
    for (i = 0; i < globalSettingNames.length; i++) {
        name = globalSettingNames[i].name;
        el = $('#globalsettings_' + name);
        value = false;
        switch (globalSettingNames[i].type) {
            case "checkbox":
                value = el.prop("checked");
                break;
            case "text":
            case "password":
            case "select":
                value = el.val();
                break;
            case "label":
                // Labels don't have values
                continue;
        }
        if (typeof (globalSettingNames[i].onsave) === "function") {
            _log("Calling 'onsave' for: " + name);
            globalSettingNames[i].onsave(value, globalSettings[name]);
        }
        if (globalSettings[name] !== value) {
            globalSettings[name] = value;
        }
    }
    GM_setValue('mlng_globalSettings', JSON.stringify(globalSettings));
    
    // Get character settings from UI
    for (i in charSettings) {
        for (j in charSettingNames) {
            name = charSettingNames[j].name;
            value = $('#charsettings_' + i.replace('@', '\\@').replace(' ', '_') + '_' + name).val();
            if (charSettings[i][name] !== value) {
                charSettings[i][name] = value;
            }
        }
    }
    // Check if entity changed
    for (i in charSettings) {
        if (charSettings[i].entity !== i) {
            charSettings[charSettings[i].entity] = charSettings[i];
            delete charSettings[i];
        }
    }
    GM_setValue('mlng_charSettings', JSON.stringify(charSettings));
    
    settingsCharacterInjectHTML();
    _log('Settings saved.');
}

function AddCss(cssString) {
    var newCss = document.createElement('style');
    
    newCss.type = "text/css";
    newCss.innerHTML = cssString;
    
    document.getElementsByTagName('head')[0].appendChild(newCss);
}

function injectHTML() {
    if ($("#settingsButton").length) {
        return;
    }
    // Add the required CSS
    AddCss("\
#logWindow{ position: fixed; right:0px; bottom:0px; width:50%; height:20%; overflow:auto;z-index: 1000; background: none rgb(238, 238, 238); text-align:left;font: 12px sans-serif; border:1px solid rgb(102, 102, 102);}\
#logWindow * { margin:0.2em; }\
#settingsButtons{ position: fixed; right: 0px; top: 0px; z-index: 1000; background: none rgb(238, 238, 238);}\
#settingsButtons div {float:left; border-right: 1px solid rgb(102, 102, 102);}\
#settingsButtons a, #settingsButtons a:visited {display:block; width: 22px; height: 22px; text-decoration: none; font-weight:bold; text-align:center; line-height:22px; color:black;}\
#settingsButtons img { background: repeat scroll 0% 0%; padding: 3px;}\
#settingsPanel{border-bottom: 1px solid rgb(102, 102, 102); border-right: 1px solid rgb(102, 102, 102); background: none repeat scroll 0% 0% rgb(238, 238, 238); color: rgb(0, 0, 0); position: fixed; overflow: auto; right: 0px; top: 0px; width: 350px;max-height:750px;font: 12px sans-serif; text-align: left; display: block; z-index: 1000;}\
#settings_title{font-weight: bolder; background: none repeat scroll 0% 0% rgb(204, 204, 204); border-bottom: 1px solid rgb(102, 102, 102); padding: 3px;}\
#settingsPanelButtonContainer {background: none repeat scroll 0% 0% rgb(204, 204, 204); border-top: 1px solid rgb(102, 102, 102);padding: 3px;text-align:center} \
#charPanel {width:340px;max-height:400px;overflow:auto;display:block;padding:3px;}\
");
    
    // Add settings panel to page body
    $("body").append(
        '<div id="settingsPanel">\
<div id="settings_title">\
<img src=' + image_prefs + ' style="float: left; vertical-align: text-bottom;">\
<img id="settings_cancel" src=' + image_close + ' title="Click to hide preferences" style="float: right; vertical-align: text-bottom; cursor: pointer; display: block;">\
<span style="margin:3px">Settings</span>\
</div>\
<div>\
<form style="margin: 0px; padding: 0px">\
<div id="globalSettings">\
<span>Global Settings</span>\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto; margin: 3px; padding: 0px;">\
</ul>\
</div>\
<div id="charSettings">\
<span>Character Settings</span>\
<ul style="list-style: none outside none; max-height: 500px; overflow: auto; margin: 3px; padding: 0px;">\
</ul>\
</div>\
<div id="settingsPanelButtonContainer">\
<input id="settings_addchar" type="button" value="Add Character">\
<input id="settings_save" type="button" value="Save and Apply">\
<input id="settings_close" type="button" value="Close">\
<input id="settings_wipechar" type="button" value="Wipe" title="Wipe character settings">\
</div>\
</form>\
</div>\
</div>\
');
    
    // Add pause & open settings buttons to page
    $("body").append('\
<div id="settingsButtons">\
<div id="pauseButton">\
<img src="' + (globalSettings.paused ? image_play : image_pause) + '" title="Click to ' + (globalSettings.paused ? "resume" : "pause") + ' task script" style="cursor: pointer; display: block;">\
</div>\
<div id="logButton">\
<a title="Click to toggle log window" href="javascript:void(0)">L</a>\
</div>\
<div id="settingsButton">\
<img src="' + image_prefs + '" title="Click to show preferences" style="cursor: pointer; display: block;">\
</div>\
</div>\
');
    
    // Add log window
    $("body").append('\
<div id="logWindow" />\
');
    // restore log contents
    var _el = $("#logWindow");
    _el.append(GM_getValue('mlng_log', ""));
    _el.prop('scrollTop', _el.prop('scrollHeight'));
    
    
    // Add global settings
    var settingsList = $("div#globalSettings ul");
    for (var i = 0; i < globalSettingNames.length; i++) {
        var id = 'globalsettings_' + globalSettingNames[i].name;
        
        switch (globalSettingNames[i].type) {
            case "checkbox":
                settingsList.append('<li title="' + globalSettingNames[i].tooltip + '"><input style="margin:4px" name="' + id + '" id="' + id + '" type="checkbox" /><label for="' + id + '">' + globalSettingNames[i].title + '</label></li>');
                $('#' + id).prop('checked', globalSettings[globalSettingNames[i].name]);
                break;
            case "text":
                settingsList.append('<li title="' + globalSettingNames[i].tooltip + '"><label for="' + id + '">' + globalSettingNames[i].title + '</label><input style="margin:4px" name="' + id + '" id="' + id + '" type="text" /></li>');
                $('#' + id).val(globalSettings[globalSettingNames[i].name]);
                break;
            case "password":
                settingsList.append('<li title="' + globalSettingNames[i].tooltip + '"><label for="' + id + '">' + globalSettingNames[i].title + '</label><input style="margin:4px" name="' + id + '" id="' + id + '" type="password" /></li>');
                $('#' + id).val(globalSettings[globalSettingNames[i].name]);
                break;
            case "select":
                settingsList.append('<li title="' + globalSettingNames[i].tooltip + '"><label style="padding-left:4px" for="' + id + '">' + globalSettingNames[i].title + '</label><select style="margin:4px" name="' + id + '" id="' + id + '" /></li>');
                var options = globalSettingNames[i].opts;
                var select = $('#' + id);
                for (var j = 0; j < options.length; j++) {
                    if (globalSettings[globalSettingNames[i].name] == options[j].path) select.append('<option value="' + options[j].path + '" selected="selected">' + options[j].name + '</option>');
                    else select.append('<option value="' + options[j].path + '">' + options[j].name + '</option>');
                }
                break;
            case "label":
                settingsList.append('<li title="' + globalSettingNames[i].tooltip + '"><label>' + globalSettingNames[i].title + '</label></li>');
                break;
        }
    }
    
    // Add character settings for each char
    settingsCharacterInjectHTML();
    
    $("#settingsPanel, #logWindow").hide();
    
    // Add click handlers
    $("#charSettings").on('click', 'input[name=radio_position]', function () {
        var _container = "#charContainer_" + $(this).attr('value').replace('@', '\\@');
        console.log(_container);
        $("#charSettings div[id^=charContainer_]").each(function () {
            $(this).hide();
        });
        $(_container).show();
        
    });
    $("#settingsButton, #settings_close, #settings_cancel").click(function () {
        $("#settingsButtons, #settingsPanel").toggle();
    });
    $("#logButton").click(function () {
        $("#logWindow").toggle();
    });
    $("#pauseButton").click(function () {
        globalSettings.paused = !globalSettings.paused;
        setTimeout(function () {
            GM_setValue('mlng_globalSettings', JSON.stringify(globalSettings));
        }, 0);
        $("#globalsettings_paused").prop("checked", globalSettings.paused);
        $("#pauseButton img").attr("src", (globalSettings.paused ? image_play : image_pause));
        $("#pauseButton img").attr("title", "Click to " + (globalSettings.paused ? "resume" : "pause") + " task script");
    });
    $("#settings_save").click(function () {
        setTimeout(function () {
            settingsSave();
        }, 0);
    });
    $("#settings_wipechar").click(function () {
        setTimeout(function () {
            settingsCharacterWipe();
        }, 0);
    });
    $("#settings_addchar").click(function () {
        setTimeout(function () {
            settingsCharacterAdd();
        }, 0);
    });
    $(unsafeWindow).one('beforeunload', function () {
        setTimeout(function () {
            if (globalSettings.preservelog === true) {
                GM_setValue('mlng_log', $('#logWindow').html());
            } else {
                GM_deleteValue('mlng_log');
            }
        }, 0);
    });
}
/**
     * Uses the page settings to determine which page is currently displayed
     */
function getCurrentPage() {
    var _page, i;
    
    for (i in pages) {
        if ($(pages[i].path).filter(":visible").length) {
            _page = pages[i];
            break;
        }
    }
    _log('Current page is: ' + (_page ? _page.name : 'Unknown'));
    return _page;
}

function characterGetCurrent() {
    try {
        var _ent = unsafeWindow.client.dataModel.model.ent.main;
        return _ent.name + '@' + _ent.publicaccountname;
    } catch (e) {}
    return undefined;
}

function characterGetNext() {
    // we need to get the next char in charSettings that actually is available for the logged in account.
    
    var _available, // array of characters available to the current account
        _filtered, // array of characters from charSettings containing only those in _available
        _currentChar = characterGetCurrent(); // current character
    
    // assignment finish time info
    characterGetNext.assignmentFinish = characterGetNext.assignmentFinish || {};
    
    // save current characters earliest assignment finish time
    if (_currentChar !== undefined) {
        characterGetNext.assignmentFinish[_currentChar] = Math.min.apply(Math,unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments.map(function(x) {
            return new Date(x.ufinishdate).getTime() === 946684800000 ? 8640000000000000 : new Date(x.ufinishdate).getTime();
        }));
    }
    
    try {
        
        _available = unsafeWindow.client.dataModel.model.loginInfo.choices.map(function (element) {
            return element.name + '@' + element.pubaccountname;
        });
        
        _filtered = Object.keys(charSettings).filter(function (element) {
            return _available.indexOf(element) !== -1;
        });
        if (_filtered.length === Object.keys(characterGetNext.assignmentFinish).length) {
            // assignment finish times are available for all chars, return character with earliest finish
            return Object.keys(characterGetNext.assignmentFinish).sort(function (a, b) { return characterGetNext.assignmentFinish[a] - characterGetNext.assignmentFinish[b]; })[0];
        }
        // assignment finish times not available for all chars, return next char in list
        return _filtered[_filtered.indexOf(_currentChar) + 1] || _filtered[0]; // working for _currentChar === undefined just fine, because indexOf() will return -1
        
    } catch (e) {}
    return undefined;
}

function characterSwitch() {
    // TODO: make switching priority based on time left to completion; no point in switching back and forth every delay.DEFAULT when we're waiting for tasks anyway.
    var _currentChar, _nextChar;
    
    _log('Switching characters:');
    
    _currentChar = characterGetCurrent();
    
    _nextChar = characterGetNext();
    
    if (_nextChar && unsafeWindow.location.hash === '#/characterselect') {
        _log('-->Selected character: ' + _nextChar);
        unsafeWindow.location.hash = '#char(' + _nextChar + ')/';
    } else if (_nextChar === _currentChar) {
        _log('-->Current character: ' + _currentChar + ' equals next character: ' + _nextChar + '. Doing nothing');
    } else if (_nextChar && _currentChar) {
        _log('-->Switching character from: ' + _currentChar + ' to: ' + _nextChar);
        // fix for memory leak?
        unsafeWindow.client.dataModel.rmgr.rmgr.dicts.PersonalProject[unsafeWindow.client.dataModel.model.ent.main.id]._requesters = [];
        unsafeWindow.location.hash = unsafeWindow.location.hash.replace(_currentChar, _nextChar);
    } else {
        _log('-->.logininfo not available. Switching chars failed.');
    }
    dfdNextRun.resolve();
}

function utilGatherAD() {
    // refine AD; WARNING: this function doesn't resolve()!
    if (globalSettings.refinead === false) {
        return;
    }
    
    try {
        var lv_cur = unsafeWindow.client.dataModel.model.ent.main.currencies;
        if (lv_cur && lv_cur.roughdiamonds && lv_cur.diamondsconvertleft) {
            unsafeWindow.client.sendCommand('Gateway_ConvertNumeric', 'Astral_Diamonds');
            _log('Gatherd AD');
        }
    } catch (e) {}
    //TODO: wait for message back from server
}

function professionCollectRewards() {
    // collect profession rewards if they exist; WARNING: this function doesn't resolve()!
    var _dfd, _collected, _ia;
    
    _dfd = $.Deferred();
    _collected = false;
    
    try {
        _ia = unsafeWindow.client.dataModel.model.ent.main.itemassignments;
        if (_ia.complete && _ia.complete > 0) {
            _ia.assignments.forEach(function (element) {
                if (element.rewards) {
                    unsafeWindow.client.professionTaskCollectRewards(JSON.stringify(element.uassignmentid));
                    _collected = true;
                }
            });
        }
    } catch (e) {}
    
    if (_collected === true) {
        _log('Collected profession rewards');
        setTimeout(function () {
            professionCollectRewards()
            .then( function() {
                unsafeWindow.client.dataModel.model.craftinglist = {}; // need to invalidate the old craftinglists, they refresh after a few secs
                _dfd.resolve();
            });
        }, delay.SHORT);
    } else {
        _dfd.resolve();
    }
    return _dfd.promise();
    
}

/**
     * Will continually test for the given query state and resolve the given deferred object when the state is reached
     * and the loading symbol is not visible
     *
     * @param {string} query The query for the state to wait for
     */
function WaitForElement(selector) {
    var _dfd, _check;
    
    _dfd = $.Deferred();
    _check = setInterval(function () {
        if ((selector === '' || $(selector).length) && $("div.loading-image:visible").length === 0) {
            clearInterval(_check);
            _dfd.resolve();
        }
    }, 300);
    
    return _dfd.promise();
}

function WaitForProperty(property) {
    // need to use eval() because of GM userscript being wrapped in an anonymous function
    // didn't want to have it work for unsafeWindow[property] only
    // could rewrite not to use exceptions, but meh, performance loss from stack trace should be negligible in this case
    var _dfd, _check;
    
    _dfd = $.Deferred();
    _check = setInterval(function () {
        try {
            if (eval(property) === undefined) {
                throw ''; //needed when foo exists && foo.bar doesn't exist
            }
            clearInterval(_check);
            _dfd.resolve();
        } catch (e) {}
    }, 300);
    
    return _dfd.promise();
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
    WaitForElement("")
    .then(function () {
        var specialItems = $("div.modal-item-list a.Special");
        var goldItems = $("div.modal-item-list a.Gold");
        var silverItems = $("div.modal-item-list a.Silver");
        var bronzeItems = $("div.modal-item-list a.Bronze");
        var clicked = false;
        
        // Try to avoid using up higher rank assets needlessly  
        // Comment out for random use of all high assets
         
        if (prof.taskName === "Leadership") {
            var mercenarys = $("div.modal-item-list a.Bronze:contains('Mercenary')");
            var guards = $("div.modal-item-list a.Bronze:contains('Guard')");
            var footmen = $("div.modal-item-list a.Bronze:contains('Footman')");
            var manatarms = $("div.modal-item-list a.Silver:contains('Man-at-Arms')");
            var adventurers = $("div.modal-item-list a.Gold:contains('Adventurer')");
            var heros = $("div.modal-item-list a.Special:contains('Hero')");

            if (mercenarys.length) {
                clicked = true;
                mercenarys[0].click();
            } else if (guards.length) {
                clicked = true;
                guards[0].click();
            } else if (footmen.length) {
                clicked = true;
                footmen[0].click();
            } else if (manatarms.length) {
                clicked = true;
                manatarms[0].click();
            } else if (adventurers.length) {
                clicked = true;
                adventurers[0].click();
            } else if (heros.length) {
                clicked = true;
                heros[0].click();
            }
        }
        
        if (prof.taskName === "Armorsmithing_Med") {
            var prospectors = $("div.modal-item-list a.Bronze:contains('Prospector')");
            var blacksmiths = $("div.modal-item-list a.Bronze:contains('Blacksmith')");
            var amailsmiths = $("div.modal-item-list a.Bronze:contains('Assistant Mailsmith')");
            var mailsmiths = $("div.modal-item-list a.Silver:contains('Mailsmith')");
            var mmailsmiths = $("div.modal-item-list a.Gold:contains('Master Mailsmith')");
            var gmailsmiths = $("div.modal-item-list a.Special:contains('Grandmaster Mailsmith')");
            
            if (prospectors.length) {
                clicked = true;
                prospectors[0].click();
            } else if (blacksmiths.length) {
                clicked = true;
                blacksmiths[0].click();
            } else if (amailsmiths.length) {
                clicked = true;
                amailsmiths[0].click();
            } else if (mailsmiths.length) {
                clicked = true;
                mailsmiths[0].click();
            } else if (mmailsmiths.length) {
                clicked = true;
                mmailsmiths[0].click();
            } else if (gmailsmiths.length) {
                clicked = true;
                gmailsmiths[0].click();
            }
        }

        if (prof.taskName === "Armorsmithing_Heavy") {
            var miners = $("div.modal-item-list a.Bronze:contains('Miner')");
            var armorers = $("div.modal-item-list a.Bronze:contains('Armorer')");
            var aplatesmiths = $("div.modal-item-list a.Bronze:contains('Assistant Platesmith')");
            var platsmiths = $("div.modal-item-list a.Silver:contains('Platsmith')");
            var mplatsmiths = $("div.modal-item-list a.Gold:contains('Master Platsmith')");
            var gplatsmiths = $("div.modal-item-list a.Special:contains('Grandmaster Platsmith')");
            
            if (miners.length) {
                clicked = true;
                miners[0].click();
            } else if (armorers.length) {
                clicked = true;
                armorers[0].click();
            } else if (aplatesmiths.length) {
                clicked = true;
                aplatesmiths[0].click();
            } else if (platsmiths.length) {
                clicked = true;
                platsmiths[0].click();
            } else if (mplatsmiths.length) {
                clicked = true;
                mplatsmiths[0].click();
            } else if (gplatsmiths.length) {
                clicked = true;
                gplatsmiths[0].click();
            }
        }
        
        if (prof.taskName === "Leatherworking") {
            var skinners = $("div.modal-item-list a.Bronze:contains('Skinner')");
            var tanners = $("div.modal-item-list a.Bronze:contains('Tanner')");
            var aleatherworkers = $("div.modal-item-list a.Bronze:contains('Assistant Leatherworker')");
            var leatherworkers = $("div.modal-item-list a.Silver:contains('Leatherworker')");
            var mleatherworkers = $("div.modal-item-list a.Gold:contains('Master Leatherworker')");
            var gleatherworkers = $("div.modal-item-list a.Special:contains('Grandmaster Leatherworker')");
            
            if (skinners.length) {
                clicked = true;
                skinners[0].click();
            } else if (tanners.length) {
                clicked = true;
                tanners[0].click();
            } else if (aleatherworkers.length) {
                clicked = true;
                aleatherworkers[0].click();
            } else if (leatherworkers.length) {
                clicked = true;
                leatherworkers[0].click();
            } else if (mleatherworkers.length) {
                clicked = true;
                mleatherworkers[0].click();
            } else if (gleatherworkers.length) {
                clicked = true;
                gleatherworkers[0].click();
            }
        }
        
        if (prof.taskName === "Tailoring") {
            var weavers = $("div.modal-item-list a.Bronze:contains('Weaver')");
            var outfitters = $("div.modal-item-list a.Bronze:contains('Outfitter')");
            var atailors = $("div.modal-item-list a.Bronze:contains('Assistant Tailor')");
            var tailors = $("div.modal-item-list a.Silver:contains('Leatherworker')");
            var mtailors = $("div.modal-item-list a.Gold:contains('Master Tailor')");
            var gtailors = $("div.modal-item-list a.Special:contains('Grandmaster Tailor')");
            
            if (weavers.length) {
                clicked = true;
                weavers[0].click();
            } else if (outfitters.length) {
                clicked = true;
                outfitters[0].click();
            } else if (atailors.length) {
                clicked = true;
                atailors[0].click();
            } else if (tailors.length) {
                clicked = true;
                tailors[0].click();
            } else if (mtailors.length) {
                clicked = true;
                mtailors[0].click();
            } else if (gtailors.length) {
                clicked = true;
                gtailors[0].click();
            }
        }
        if (prof.taskName === "Artificing") {
            var carvers = $("div.modal-item-list a.Bronze:contains('Carver')");
            var engravers = $("div.modal-item-list a.Bronze:contains('Engraver')");
            var aartificers = $("div.modal-item-list a.Bronze:contains('Assistant Artificer')");
            var artificers = $("div.modal-item-list a.Silver:contains('Artificer')");
            var martificers = $("div.modal-item-list a.Gold:contains('Master Artificer')");
            var gartificers = $("div.modal-item-list a.Special:contains('Grandmaster Artificer')");
            
            if (carvers.length) {
                clicked = true;
                carvers[0].click();
            } else if (engravers.length) {
                clicked = true;
                engravers[0].click();
            } else if (aartificers.length) {
                clicked = true;
                aartificers[0].click();
            } else if (aartificers.length) {
                clicked = true;
                aartificers[0].click();
            } else if (martificers.length) {
                clicked = true;
                martificers[0].click();
            } else if (gartificers.length) {
                clicked = true;
                gartificers[0].click();
            }
        }
        if (prof.taskName === "Weaponsmithing") {
            var smelters = $("div.modal-item-list a.Bronze:contains('Smelter')");
            var grinders = $("div.modal-item-list a.Bronze:contains('Grinder')");
            var aweaponsmiths = $("div.modal-item-list a.Bronze:contains('Assistant Weaponsmith')");
            var weaponsmiths = $("div.modal-item-list a.Silver:contains('Weaponsmith')");
            var mweaponsmiths = $("div.modal-item-list a.Gold:contains('Master Weaponsmith')");
            var gweaponsmiths = $("div.modal-item-list a.Special:contains('Grandmaster Weaponsmith')");
            
            if (smelters.length) {
                clicked = true;
                smelters[0].click();
            } else if (grinders.length) {
                clicked = true;
                grinders[0].click();
            } else if (aweaponsmiths.length) {
                clicked = true;
                aweaponsmiths[0].click();
            } else if (weaponsmiths.length) {
                clicked = true;
                weaponsmiths[0].click();
            } else if (mweaponsmiths.length) {
                clicked = true;
                mweaponsmiths[0].click();
            } else if (gweaponsmiths.length) {
                clicked = true;
                gweaponsmiths[0].click();
            }
        }
        if (prof.taskName === "Alchemy") {
            var apothecarys = $("div.modal-item-list a.Bronze:contains('Apothecary')");
            var mixologists = $("div.modal-item-list a.Bronze:contains('Mixologist')");
            var aalchemists = $("div.modal-item-list a.Bronze:contains('Assistant Alchemist')");
            var alchemists = $("div.modal-item-list a.Silver:contains('Alchemist')");
            var malchemists = $("div.modal-item-list a.Gold:contains('Master Alchemist')");
            var galchemists = $("div.modal-item-list a.Special:contains('Grandmaster Alchemist')");
            
            if (apothecarys.length) {
                clicked = true;
                apothecarys[0].click();
            } else if (mixologists.length) {
                clicked = true;
                mixologists[0].click();
            } else if (aalchemists.length) {
                clicked = true;
                aalchemists[0].click();
            } else if (alchemists.length) {
                clicked = true;
                alchemists[0].click();
            } else if (malchemists.length) {
                clicked = true;
                malchemists[0].click();
            } else if (galchemists.length) {
                clicked = true;
                galchemists[0].click();
            }
        }
        if (prof.taskName === "BlackIce") {
            var chillwrights = $("div.modal-item-list a.Bronze:contains('Apothecary')");
            var black_ice_smiths = $("div.modal-item-list a.Bronze:contains('Black Ice Smith')");
            var acryomancers = $("div.modal-item-list a.Bronze:contains('Assistant Cryomancer')");
            var cryomancers = $("div.modal-item-list a.Silver:csontains('Cryomancer')");
            var mcryomancers = $("div.modal-item-list a.Gold:contains('Master Cryomancer')");
            var gcryomancers = $("div.modal-item-list a.Special:contains('Grandmaster Cryomancer')");
            
            if (chillwrights.length) {
                clicked = true;
                chillwrights[0].click();
            } else if (black_ice_smiths.length) {
                clicked = true;
                black_ice_smiths[0].click();
            } else if (acryomancers.length) {
                clicked = true;
                acryomancers[0].click();
            } else if (cryomancers.length) {
                clicked = true;
                cryomancers[0].click();
            } else if (mcryomancers.length) {
                clicked = true;
                mcryomancers[0].click();
            } else if (gcryomancers.length) {
                clicked = true;
                gcryomancers[0].click();
            }
        }

        if (!clicked) {
            // Click the highest slot
            if (specialItems.length) {
                specialItems[0].click();
            } else if (goldItems.length) {
                goldItems[0].click();
            } else if (silverItems.length) {
                silverItems[0].click();
            } else if (bronzeItems.length) {
                bronzeItems[0].click();
            } else {
                $("button.close-button").click();
            }
        }
        
        _log("Clicked item");
        
        return true;
    })
    .then( function () {
        return WaitForElement("");
    })
    .then(function () {
        // Get the new set of select buttons created since the other ones are removed when the asset loads
        var buttonList = $("h3:contains('Optional Assets:')").closest("div").find("button");
        if (i < buttonList.length - 1) {
            SelectItemFor(buttonList, i + 1, def, prof);
        } else {
            _log('all optional slots populated');
            // Let main loop continue
            def.resolve();
        }
    });
    
}

function professionBuyResource(item, count) {
    _log("Purchasing resources:" + item);
    
    count = count || 2;
    
    var resourceID = {
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
    
    // fetch store; we don't really need the vars to be populated, just that the buy command won't execute unless we send this 1st;
    unsafeWindow.client.dataModel.fetchVendor('Nw_Gateway_Professions_Merchant');
    //send an 'analytic tick', that's what the outer client function does ...
    unsafeWindow.client.analyticTick("User:BuyItem", count);
    // Make purchase
    unsafeWindow.client.sendCommand(
        "GatewayVendor_PurchaseVendorItem", {
            vendor: 'Nw_Gateway_Professions_Merchant',
            store: 'Store_Crafting_Resources',
            idx: resourceID[item],
            count: count
        });
    // Wait for the notification and close it
    WaitForElement("button.closeNotification").done(function () {
        $('button.closeNotification').click();
    });
}

function searchForTask(taskname, profName) {
    // assuming we are on the correct profession page - NEEDS FIX;
    // looks through ALL available tasks, even if they are not visible on the page (i.e. paginated or filtered)
    var _dfd = $.Deferred();
    
    var searchItem = null;
    var searchAsset = false;
    
    try {
        
        // Return first object that matches exact craft name
        var thisTask = unsafeWindow.client.dataModel.model.craftinglist['craft_' + profName].entries.filter(function (entry) {
            return entry.def && entry.def.name == taskname;
        })[0];
        
        // If no task is returned then we have three of this task already or wrong name in settings
        if (!thisTask) {
            _log('searchForTask: Task ' + taskname + ' not available.');
            _dfd.resolve(false);
            return _dfd.promise();
        }
        // start task if requirements are met
        if (!thisTask.failedrequirementsreasons.length) {
            _dfd.resolve(thisTask.def.name);
            return _dfd.promise();
        }
        // Too high level
        if (thisTask.failslevelrequirements) {
            _log("searchForTask: Wrong task settings: task level is too high: " + taskname);
            _dfd.resolve(false);
            return _dfd.promise();
        }
        // Missing assets or ingredients
        if (thisTask.failsresourcesrequirements) {
            var failedAssets = thisTask.required.filter(function (entry) {
                return !entry.fillsrequirements;
            });
            
            // Missing required assets
            if (failedAssets.length) {
                var failedCrafter = failedAssets.filter(function (entry) {
                    return entry.categories.indexOf("Person") >= 0;
                });
                if (failedCrafter.length && globalSettings.trainassets) {
                    _log("searchForTask: Crafting: " + failedCrafter[0].icon);
                    searchItem = failedCrafter[0].icon;
                    searchAsset = true;
                } else {
                    _log("searchForTask: Auto crafting assets disabled, missing: " + failedCrafter[0].icon);
                    _dfd.resolve(false);
                    return _dfd.promise();
                }
            } else {
                // Check for craftable or buyable ingredients
                var failedResources = thisTask.consumables.filter(function (entry) {
                    return entry.required && !entry.fillsrequirements;
                });
                
                // Check first required ingredient only
                // If it fails to buy or craft task cannot be completed anyway
                // If it succeeds script will search for tasks anew
                var itemName = failedResources[0].hdef.match(/\[(\w+)\]/)[1];
                
                // purchase buyable resources
                if (itemName.match(/^Crafting_Resource_(Charcoal|Rocksalt|Spool_Thread|Porridge|Solvent|Brimstone|Coal|Moonseasalt|Quicksilver|Spool_Threadsilk)$/)) {
                    if (globalSettings.autopurchase) {
                        professionBuyResource(itemName);
                        _dfd.resolve(null);
                        return _dfd.promise();
                    }
                    _log("searchForTask: Auto resource purchasing disabled, missing: " + itemName);
                    _dfd.resolve(false);
                    return _dfd.promise();
                }
                // craft ingredient items
                _log("searchForTask: Crafting: " + itemName);
                searchItem = itemName;
            }
        }
        
        // either no craftable items/assets found or other task requirements are not met
        // Skip crafting ingredient tasks for Leadership
        if (searchItem === null || !searchItem.length || (profName == 'Leadership' && !searchAsset && !searchItem.match(/Crafting_Asset_Craftsman/))) {
            _log("searchForTask: Failed to resolve item requirements for task: " + taskname);
            _dfd.resolve(false);
            return _dfd.promise();
        }
        
        // Generate list of available tasks to search ingredients/assets from
        _log("searchForTask: Searching tasks for ingredient: " + searchItem);
        var taskList = unsafeWindow.client.dataModel.model.craftinglist['craft_' + profName].entries.filter(function (entry) {
            // remove header lines first to avoid null def
            if (entry.isheader) {
                return false;
            }
            // Too high level
            if (entry.failslevelrequirements) {
                return false;
            }
            // Rewards do not contain item we want to make
            if (searchAsset === true) {
                if (entry.def.icon != searchItem || entry.def.name.indexOf('Recruit') === -1 || entry.def.requiredrank > 14) {
                    return false;
                }
            } else {
                if (!(entry.rewards.some(function (itm) {
                    return (itm.hdef.indexOf(searchItem) !== -1);
                }))) {
                    return false;
                }
            }
            // Skip mass production tasks
            if (entry.def.displayname.match(/^(Batch|Mass|Deep|Intensive) /)) {
                return false;
            }
            // Skip trading tasks
            if (entry.def.displayname.indexOf('Trading') !== -1) {
                return false;
            }
            // Skip looping Transmute tasks
            if (entry.def.displayname.match(/^(Transmute|Create) /)) {
                return false;
            }
            return true;
        });
        
        if (!taskList.length) {
            _log("searchForTask: Unable to find tasks for ingredient: " + searchItem);
            _dfd.resolve(false);
            return _dfd.promise();
            
        }
        
        // Use more efficient Empowered task for Aqua Vitae if available.
        if (searchItem == "Crafting_Resource_Aquavitae" && taskList.length > 1) {
            taskList.shift();
        }
        
        // Should really only be one result now
        _log("searchForTask: Attempting to find task for ingredient: " + taskList[0].def.name);
        searchForTask(taskList[0].def.name, profName)
        .then( function (task) {
            _dfd.resolve(task);
        });
        return _dfd.promise();
        
    } catch (e) {}
    
    _log('searchForTask: No valid task found for: ' + taskname);
    _dfd.resolve(false);
    return _dfd.promise();
}

function professionGetCurrentLevel(professionName) {
    var _level;
    
    _level = 0;
    if (professionName !== undefined) {
        try {
            unsafeWindow.client.dataModel.model.ent.main.itemassignmentcategories.categories.some(function(entry) {
                if(entry.name == professionName) {
                    _level = entry.currentrank;
                    return true;
                }
                return false; 
            });
        } catch (e) {}
    }
    return _level;
}

// TO BE REPLACED
function professionStartTask() {
    var _dfd = $.Deferred();
    
    //Get the start task button if it is enabled
    var enabledButton = $("div.footer-body > div.input-field.button:not('.disabled') > button:contains('Start Task')");
    if (enabledButton.length) {
        _log("professionStartTask(): clicking Start Task button");
        enabledButton.click();
    } else { // Button not enabled, something required was probably missing
        _log('professionStartTask(): something went wrong, start task button not enabled.');
    }
    
    // an ugly hack, not sure how to go about waiting for the task to actually start/fail
    // 2 options: either read notifications or hook client functions; both ugly
    setTimeout(function () {
        _dfd.resolve();
    }, delay.SHORT);
    
    return _dfd.promise();
}

// TO BE REPLACED
function professionSlotItems(prof) {
    var _dfd, _buttonList;
    
    _dfd = $.Deferred();
    
    if (!globalSettings.optionals) {
        _dfd.resolve();
    } else {
        _buttonList = $("h3:contains('Optional Assets:')").closest("div").find("button");
        if (_buttonList.length) {
            _log('createNextTask: populating optional slots.');
            SelectItemFor(_buttonList, 0, _dfd, prof);
        } else {
            _dfd.resolve();
        }
    }
    
    return _dfd.promise();
}

function professionGetCraftingList(profName) {
    // resolving with the actual craftinglist, not used atm
    var _dfd, _craftingList;
    
    _dfd = $.Deferred();
    
    _craftingList = unsafeWindow.client.dataModel.model.craftinglist;
    if (_craftingList && _craftingList['craft_' + profName]) {
        _log('professionGetTaskList(): ' + profName + ' craftlist available.');
        _dfd.resolve(_craftingList['craft_' + profName]);
    } else {
        _log('professionGetTaskList(): ' + profName + '  craftlist not available, fetching.');
        unsafeWindow.client.professionFetchTaskList('craft_' + profName);
        WaitForProperty('unsafeWindow.client.dataModel.model.craftinglist["craft_' + profName + '"]')
        .then(function() {
            _log('professionGetTaskList(): done fetching ' + profName + ' craftlist');
            _dfd.resolve(unsafeWindow.client.dataModel.model.craftinglist['craft_' + profName]);
        });
    }
    return _dfd.promise();
}

// TO BE REPLACED
/**
     * Iterative approach to finding the next task to assign to an open slot.
     *
     * @param {Array} list The list of task names to try in order of precedence
     * @param {int} i The current attempt number. Will try to find the i'th task.
     */
function createNextTask(prof, i) {
    var _dfd = $.Deferred();
    
    // get tasks for current profession and rank
    var list = prof.level[ professionGetCurrentLevel(prof.taskName) ];
    
    if (list.length <= i) {
        _log("Nothing Found");
        _dfd.resolve();
    } else {
        var taskName = list[i];
        _log("createNextTask: searching for: " + list.length + ' ' + i + ' ' + taskName);
        professionGetCraftingList(prof.taskName)
        .then( function () {
            return searchForTask(taskName, prof.taskName);
        })
        .then( function (task) {
            if (task == null) {
                _log("Skipping task selection to purchase resources");
                _dfd.resolve();
            } else if (task) {
                _log('createNextTask: found: ' + task);
                
                // navigate to task details page
                unsafeWindow.location.hash = unsafeWindow.location.hash.replace(/\)\/.+/, ')' + '/professions-tasks/' + prof.taskName + '/' + task);
                WaitForElement("div.page-professions-taskdetails")
                .then(function () {
                    // fill optional slots if needed
                    return professionSlotItems(prof);
                })
                .then(function () {
                    // start the task
                    return professionStartTask();
                })
                .then(function() {
                    _dfd.resolve();
                });
                
            } else {
                _log('createNextTask: finding next task.');
                createNextTask(prof, i + 1)
                .then( function() { _dfd.resolve(); });
            }
        });
    }
    
    return _dfd.promise();
}

function pageCHARSELECT() {
    //select next character
    characterSwitch();
    dfdNextRun.resolve();
}

function pageFRONTPAGE() {
    // go to professions page
    _log('pageFRONTPAGE: switching to professions page.');
    $("a.professions").click();
    dfdNextRun.resolve();
}

function professionAssignTasks() {
    // returns true if work still needs to be done, false if finished
    var _assignments, _currentTasks, _craftingList, i;
    
    try {
        
        _assignments = unsafeWindow.client.dataModel.model.ent.main.itemassignments.assignments;
        
        // check if slots available
        if (!_assignments.filter(function (entry) {
            return (!entry.islockedslot && !entry.uassignmentid);
        }).length) {
            _log("professionAssignTasks(): No available task slots.");
            return false;
        }
        
        // Go through the professions to assign tasks until specified slots filled
        for (i = 0; i < taskList.length; i++) {
            _currentTasks = _assignments.filter(function (entry) {
                return entry.category == taskList[i].taskName;
            });
            if (_currentTasks.length < charSettings[characterGetCurrent()][taskList[i].taskName]) {
                _log(taskList[i].taskName + ': ' + _currentTasks.length + '/' + charSettings[characterGetCurrent()][taskList[i].taskName] + ' filled.');
                
                createNextTask(taskList[i], 0)
                .then( function() {
                    _log('createNextTask(): done.');
                    dfdNextRun.resolve();
                });
                return true;
            }
        }
        _log("professionAssignTasks(): All task counts assigned.");
        return false;
    } catch (e) { }
    // if we got here stuff is still loading, let's wait another cycle
    _log('professionAssignTasks(): assignments still loading, wating.');
    dfdNextRun.resolve();
    return true;
}


function pagePROFESSIONS() {
    
    WaitForElement("")
    .then(function () {
        return professionCollectRewards();
    })
    .then( function () {
        // assign tasks if slots available
        if (professionAssignTasks()) {
            //                dfdNextRun.resolve();
            return;
        }
        // switch characters
        characterSwitch();
    });
}

function pageLOGIN() {
    if (globalSettings.autologin === true) {
        _log('pageLOGIN: logging in.');
        $("input#user").val(globalSettings.nw_username);
        $("input#pass").val(globalSettings.nw_password);
        $("div#login > input").click();
    } else {
        _log('pageLOGIN: auto logging in disabled.');
    }
    dfdNextRun.resolve(delay.LONG);
}

/**
     * The main process loop:
     * - Determine which page we are on and call the page specific logic
     * - When processing is complete, process again later
     *   - Use a short timer when something changed last time through
     *   - Use a longer timer when waiting for tasks to complete
     */
function process() {
    _log('starting cycle');
    // Make sure our custom HTML is injected and working
    injectHTML();
    
    
    // Check if timer is paused
    if (globalSettings.paused) {
        // Just continue later - the deferred object is still set and nothing will resolve it until we get past this point
        _log('Paused...');
        // clear the timeout
        clearTimeout(timeoutHandle);
        window.setTimeout(function () {
            process();
        }, delay.DEFAULT);
        return;
    }
    
    
    // refine AD; page doesn't matter, no need to do resolve();
    utilGatherAD();
    
    switch (getCurrentPage()) {
            
        case pages.CHARSELECT:
            pageCHARSELECT();
            break;
        case pages.FRONTPAGE:
            pageFRONTPAGE();
            break;
        case pages.PROFESSIONS:
            pagePROFESSIONS();
            break;
        case pages.LOGIN:
            pageLOGIN();
            break;
        default:
            //                _log('No logic defined for current page, sleeping for: ' + delay.LONG + 'ms.');
            //                dfdNextRun.resolve(delay.LONG);
    }
    
    // Continue again later
    dfdNextRun.done(function (delayTimer) {
        var _cycleDelay = delayTimer || delay.DEFAULT;
        var _cycleTimeout = _cycleDelay + delay.TIMEOUT;
        
        _log('Scheduling next cycle in: ' + _cycleDelay + 'ms. Timeout in: ' + _cycleTimeout + 'ms.');
        
        dfdNextRun = $.Deferred();
        // cycle succeeded, clear the timeout
        clearTimeout(timeoutHandle);
        // setting timeout for next cycle
        timeoutHandle = setTimeout(function () {
            dfdNextRun.reject(_cycleTimeout);
        }, _cycleTimeout);
        
        // scheduling next cycle
        setTimeout(function () {
            process();
        }, _cycleDelay);
        
    }).fail(function (timeout) {
        _log('Last cycle took longer than: ' + timeout + 'ms. Reloading gateway...');
        unsafeWindow.location.href = "http://gateway.playneverwinter.com";
    });
}


// inject our HTML and schedule main loop
injectHTML();
_log('Script started.');
dfdNextRun.resolve();

setTimeout(function () {
    process();
}, delay.SHORT);
})();