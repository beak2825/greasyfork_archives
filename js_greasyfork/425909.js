// ==UserScript==
// @name         csgoclicker auto-open and sell
// @namespace    here lol
// @version      1.2
// @description  sell shit and opens or something idk
// @author       Vincent/Ridard
// @match        https://csgoclicker.net/*
// @downloadURL https://update.greasyfork.org/scripts/425909/csgoclicker%20auto-open%20and%20sell.user.js
// @updateURL https://update.greasyfork.org/scripts/425909/csgoclicker%20auto-open%20and%20sell.meta.js
// ==/UserScript==

// Vars vv

var keepprice = 2.3; // change 2.3 to whatever the lowest price you want to sell


// Open script vv

var opencasewait = setInterval(function() { //just makes it wait between opens so you dont get cooldown
    if (document.body.contains(document.getElementsByClassName("openCase")[0])) { // checks for the button
        document.getElementsByClassName("openCase")[0].click(); // clicks open
    } else {
        console.log("Not on case tab; Can't open") // let em know that it wont open without a open button lmaooo
    }
}, 14000); // 14 second delay for the case to open


// Sell script vv


var sellwait = setInterval(function() {
    sell();
}, 28000); // time to wait before selling
// sell might be bugged

function sell() {
if (document.body.contains(document.getElementsByClassName("openCase")[0])) {
    for (var i = 0; i < document.getElementsByClassName("invItem").length; i++) {
        if (Number(document.getElementsByClassName("invItem")[i].getElementsByClassName("price")[0].textContent.replace("$","").replaceAll(",","").replaceAll(".","")) >= keepprice) {
            console.log("Kept!")// If it's a desired item
        } else {
            document.getElementsByClassName("sellSwitch")[0].click();
            document.getElementsByClassName("invItem")[i].click();
            document.getElementsByClassName("sellItemsButton")[0].click();
            console.log("Sold");// Sold
            document.getElementsByClassName("sellSwitch")[0].click();
        }
    }
    } else {
        console.log("Not on case tab; Can't sell") // let em know that it wont open without a open button lmaooo
    }
}