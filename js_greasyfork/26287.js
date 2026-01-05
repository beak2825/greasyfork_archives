// ==UserScript==
// @name         Steam Market Item Info
// @namespace    SyNTax
// @version      0.2
// @description  Retrieve info on items on current page
// @author       SyNTax
// @match        http://steamcommunity.com*
// @include      https://steamcommunity.com*
// @include      http://steamcommunity.com/market*
// @include      https://steamcommunity.com/market*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26287/Steam%20Market%20Item%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/26287/Steam%20Market%20Item%20Info.meta.js
// ==/UserScript==


var steamID = g_steamID;

if(steamID === false){
    console.log("%cYour STEAMID: %cNot logged in!", "background: #222;color: white","background: #222;color:red");
}else{
    console.log("%cYour STEAMID: " + "%c" + g_steamID, "background: #222;color: white","background: #222;color:green");
}

var itemName = g_rgAssets[730][2];

for(var iname in itemName){
    console.log("%cItem Name: " + "%c" + itemName[iname].market_name, "color: purple", "color: green");
    break;
}

console.log("%cRelease date: " + "%c" + g_timePriceHistoryEarliest, "color: purple", "color: green");

var listingInfo = g_rgListingInfo;

for(var assetId in listingInfo){
    console.log("%cListingID: " + "%c" + listingInfo[assetId].listingid + "\n" +
                "%cAssetID: " + "%c" +listingInfo[assetId].asset.id + "\n" +
                "%cSteam URL: " + "%c" + listingInfo[assetId].asset.market_actions[0].link + "\n",
                "color:green", "color:purple", "color:green",
                "color:purple", "color:green", "color:blue"
               );
}
