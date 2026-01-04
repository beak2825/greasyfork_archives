// ==UserScript==
// @name         CCO Autoopen [Sell-Under update!]
// @namespace    here lol
// @version      3.5F
// @description  Basically an auto-opener and under-value seller for CCO (Cube Collector Online)
// @author       sdoma and Aspect!
// @match        https://cubecollector.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424301/CCO%20Autoopen%20%5BSell-Under%20update%21%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/424301/CCO%20Autoopen%20%5BSell-Under%20update%21%5D.meta.js
// ==/UserScript==



//variables vvv

var lessqubits = 1500; //set to the amount of qubits (balance) you want it to stop opening at (for big afk)
var keepprice = 101200; // value of items to keep







var inv = document.getElementById('inventorylimit'); // dont mind this he's just different..

//open script vvv



(function() {
    'use strict';
    console.log("Loaded!");


    var myInterval = setInterval(function() {
        console.log("Opening..");
        var cash_baby = document.getElementById("navbarcash").textContent;
        var res = cash_baby.replace("Ϙ", "");
        var res2 = res.replace(",", "");
        var resfinal = res2.replace(",", "");

        if (resfinal > lessqubits) {
            open();
        } else {
            console.log("Get more money kid, under lessqubits value");// just output here, meaning it wont open if your cash is smaller than the lessqubits value you placed on line 16
        }
        function open(){
            if (inv.textContent == '250/250 Slots Used') {
                console.log("Full Inv!"); //nothing here to do, don't open unless its <250
            } else {
                if (document.body.contains(document.getElementById("openboxbutton"))) {
                    document.getElementById("openboxbutton").click();
                    console.log("Opened!! Current inv :");
                    console.log(inv.textContent);
                } else {
                    console.log("Go to the 'Spin Cubes' tab to open!")
                }

            }
        }
    }, 13000);
})();



//Sell Function vvv
//WIP


(function() {
    'use strict';
    console.log("Init Sell Script..");

    var intervalSell = setInterval(function() {
        sell()
    }, 90000)
    function sell() {
                     console.log("Preparing to sell..");
                     for (var i = 0; i < document.getElementsByClassName("itemcontainer").length; i++) {
                         if (Number(document.getElementsByClassName("itemcontainer")[i].getElementsByClassName("itemprice")[0].textContent.replace("Ϙ","").replaceAll(",","")) >= keepprice) {
                             console.log("Kept!")// If it's a desired item
                         } else {
                             document.getElementById("selectitemstoggle").click();
                             document.getElementsByClassName("itemcontainer")[i].click();// Naw
                             document.getElementsByClassName("sellallselecteditemsbutton darkbutton")[0].click();
                             console.log("Sold!");
                         }
                     }
                    }

})();

//and to clean things up vv

var intervalClear = setInterval(function() {
    console.clear();
}, 500000)

var intervalDisconnect = setInterval(function() {
    if (document.getElementById("loadingflavors").textContent == "You lost connection to the server. If your computer is struggling to keep up with the game, then consider customizing your performance options.") {  
        Location.reload();
        wait(10000);
        document.getElementById("playgamebutton").click();
        wait(5000);
        document.getElementById("unboxinglink").click();
    } else {
    //nothing, all g
    }
}, 500000)