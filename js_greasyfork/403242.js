// ==UserScript==
// @name           Troops Fill And Spare
// @namespace      https://greasyfork.org/en/users/560174-adir-avisar
// @description    Auto Fill Troops
// @author         Adir Avisar
// @include        *://*.travian.*/build.php*
// @include        *://*.travian.*.*/build.php*
// @include        *://*/*.travian.*/build.php*
// @include        *://*/*.travian.*.*/build.php*

// @version        2.3.0
// @downloadURL https://update.greasyfork.org/scripts/403242/Troops%20Fill%20And%20Spare.user.js
// @updateURL https://update.greasyfork.org/scripts/403242/Troops%20Fill%20And%20Spare.meta.js
// ==/UserScript==

function OneCodeToRuleThemAll () {
    'use strict';
    var version = '2.3.0';
    var scriptURL = 'https://greasyfork.org/scripts/TO-BE-ADDED';

    var URL = window.location.href // Get URL
    var URL_SPLITED = URL.split('/') // Split the URL
    var page = URL_SPLITED[URL_SPLITED.length -1] // Get the page
    var LANGUAGES = ["שוק", "Marketplace"]

    /**************** Global Vars *******************/
    var GLOBAL_RESOURCES = document.getElementById("contentOuterContainer").getElementsByTagName("script")[0].innerText
    GLOBAL_RESOURCES = JSON.parse(GLOBAL_RESOURCES.slice(GLOBAL_RESOURCES.indexOf('{"'),GLOBAL_RESOURCES.indexOf('}')+1))
    var TroopCost = [
        [100,130,160,70] /*0 - Preatorian*/,
        [150,160,210,80] /*1 - Imperian*/,
        [550, 640, 800, 180] /*2 - Carsaris*/,
        [950, 1350, 600, 90] /*3 - Fire Catapult*/,
        [4567.5,5438,5710, 1532] /*4 - Hammer Equal (AMOUNT = 14) (17247.5)*/,
        [450,515,480,80] /*5 - Teutonic Knight (AMOUNT = 350)*/,
        [95,75,40,40] /*6 - Clubswinger (AMOUNT = 2000)*/,
        [62800,74900,79500, 20860] /*7 - Hammer Equal (AMOUNT = 1) (17247.5)*/]

    var AMOUNT = 292
    var SELECTED_TROOP = 0
    /**************** Global Vars *******************/

    // Normal market
    function SendTroops() {
        document.getElementById("r1").value = (AMOUNT * TroopCost[SELECTED_TROOP][0]).toFixed(0)
        document.getElementById("r2").value = (AMOUNT * TroopCost[SELECTED_TROOP][1]).toFixed(0)
        document.getElementById("r3").value = (AMOUNT * TroopCost[SELECTED_TROOP][2]).toFixed(0)
        document.getElementById("r4").value = (AMOUNT * TroopCost[SELECTED_TROOP][3]).toFixed(0)
    }

    // Trade routes
    function SpareValues() {
        var Resources = [];
        var MaxAmount = 0;
        var MaxAmountRe = [];
        var PrecentageToSave = 15

        jQuery.each(GLOBAL_RESOURCES, function() {
            Resources.push(this)
        });

        for(let i =0;i<3;i++) {
            MaxAmountRe[i] = Resources[i] / TroopCost[SELECTED_TROOP][i]
        }

        MaxAmountRe.sort();
        MaxAmount = parseInt(MaxAmountRe[0])

        var wood = (Resources[0] - TroopCost[SELECTED_TROOP][0] * MaxAmount)
        var clay = (Resources[1] - TroopCost[SELECTED_TROOP][1] * MaxAmount)
        var iron = (Resources[2] - TroopCost[SELECTED_TROOP][2] * MaxAmount)
        var crop = (Resources[3] - TroopCost[SELECTED_TROOP][3] * MaxAmount) + parseInt((Resources[3] / PrecentageToSave).toFixed(0), 10)

        document.getElementById("r1").value = wood
        document.getElementById("r2").value = clay
        document.getElementById("r3").value = iron
        document.getElementById("r4").value = crop
    }

    // Check language
    function checkLanguage() {
        var BuildingName = document.getElementsByClassName("titleInHeader")[0].innerText.split(" ")[0];
        if (LANGUAGES.includes(BuildingName)) { return true }
        else { return false }
    }

    // Check if it contains all values
    function containsAll(needles, haystack){
        for(var i = 0; i < needles.length; i++){
           if($.inArray(needles[i], haystack) == -1) return false;
        }
        return true;
    }


    /********** begin of main code block ************/
    if (checkLanguage())
    {
        if (page.includes("?")) {
            // Getting page values
            var PageValues = page.split("?")[1]

            if (PageValues.includes("&")) {
                // Spliting the values
                PageValues = PageValues.split("&")

                // Check if it is trade routes
                var VALUES_TO_CHECK = ["gid=17", "t=0", "option=1"]
                if (containsAll(VALUES_TO_CHECK, PageValues)) {
                    SpareValues()
                }
                else {
                    SendTroops()
                }
            }
            else {
                SendTroops()
            }

        }
        else {
            SendTroops()
        }

    }
    /********** end of main code block ************/
}

OneCodeToRuleThemAll();