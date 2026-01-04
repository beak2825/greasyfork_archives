// ==UserScript==
// @name           Praetorian Fill And Spare
// @namespace      https://greasyfork.org/en/users/560174-adir-avisar
// @description    Auto fill 300 in the market or send the spare amount in the trade routes
// @author         Adir Avisar
// @include        *://*.travian.*/build.php*
// @include        *://*.travian.*.*/build.php*
// @include        *://*/*.travian.*/build.php*
// @include        *://*/*.travian.*.*/build.php*

// @version        2.0.0
// @downloadURL https://update.greasyfork.org/scripts/403410/Praetorian%20Fill%20And%20Spare.user.js
// @updateURL https://update.greasyfork.org/scripts/403410/Praetorian%20Fill%20And%20Spare.meta.js
// ==/UserScript==

function OneCodeToRuleThemAll () {
    'use strict';
    var vergsion = '2.0.0';
    var scriptURL = 'https://greasyfork.org/scripts/TO-BE-ADDED';
    
    var URL = window.location.href // Get URL
    var URL_SPLITED = URL.split('/') // Split the URL
    var page = URL_SPLITED[URL_SPLITED.length -1] // Get the page
    var LANGUAGES = ["שוק", "Marketplace"]

    /**************** Global Vars *******************/
    var GLOBAL_RESOURCES = document.getElementById("contentOuterContainer").getElementsByTagName("script")[0].innerText
    GLOBAL_RESOURCES = JSON.parse(GLOBAL_RESOURCES.slice(GLOBAL_RESOURCES.indexOf('{"'),GLOBAL_RESOURCES.indexOf('}')+1))
    var PREATORIAN = [100,130,160,70]
    /**************** Global Vars *******************/
    
    // Normal market
    function SendPreatorian() {
        var AMOUNT = 300

        document.getElementById("r1").value = AMOUNT * PREATORIAN[0]
        document.getElementById("r2").value = AMOUNT * PREATORIAN[1]
        document.getElementById("r3").value = AMOUNT * PREATORIAN[2]
        document.getElementById("r4").value = AMOUNT * PREATORIAN[3]
    }
    
    // Trade routes
    function SpareValues() {
        var Resources = [];
        var MaxAmount = 0;
        var MaxAmountRe   = [];
        var Preatorian  = [100,130,160];
        var PrecentageToSave = 15
       
        jQuery.each(GLOBAL_RESOURCES, function() {
            Resources.push(this)
        });

        for(let i =0;i<3;i++) {
            MaxAmountRe[i] = Resources[i] / Preatorian[i]
        }

        MaxAmountRe.sort();
        MaxAmount = parseInt(MaxAmountRe[0])

        var wood = (Resources[0] - PREATORIAN[0] * MaxAmount)
        var clay = (Resources[1] - PREATORIAN[1] * MaxAmount)
        var iron = (Resources[2] - PREATORIAN[2] * MaxAmount)
        var crop = (Resources[3] - PREATORIAN[3] * MaxAmount) + parseInt((Resources[3] / PrecentageToSave).toFixed(0), 10)
        
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
                    SendPreatorian()
                }
            }
            else {
                SendPreatorian()
            }

        }
        else {
            SendPreatorian()
        }

    }
    /********** end of main code block ************/
}

OneCodeToRuleThemAll();