// ==UserScript==
// @name        CSGOSteamMarketHelper
// @namespace   CSGOSteamMarketHelper
// @include     http://steamcommunity.com/market/listings/730/*
// @version     1.02
// @grant       none
// @description 利用CSGO steam社区市场物品AssetID在csgoexchange以及steamanalyst网站查找对应物品
// @downloadURL https://update.greasyfork.org/scripts/11439/CSGOSteamMarketHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/11439/CSGOSteamMarketHelper.meta.js
// ==/UserScript==

var parent = document.getElementById("searchResultsTable");
if (parent != null) {
    //Open SteamAnalyst
    var openSAbtn = document.createElement("a");
    openSAbtn.setAttribute("class", "item_market_action_button item_market_action_button_green");
    openSAbtn.innerHTML = "<span class=\"item_market_action_button_edge item_market_action_button_left\"></span>" +
                    "<span class=\"item_market_action_button_contents\">SteamAnalyst</span>" +
                    "<span class=\"item_market_action_button_edge item_market_action_button_right\"></span>" +
                    "<span class=\"item_market_action_button_preload\"></span>";
    openSAbtn.addEventListener('click', OpenSteamanalyst);
    parent.insertBefore(openSAbtn, parent.children[0]);
    //Open CSGOexchange
    var openCEbtn = document.createElement("a");
    openCEbtn.setAttribute("class", "item_market_action_button item_market_action_button_green");
    openCEbtn.innerHTML = "<span class=\"item_market_action_button_edge item_market_action_button_left\"></span>" +
                    "<span class=\"item_market_action_button_contents\">CSGOexchange</span>" +
                    "<span class=\"item_market_action_button_edge item_market_action_button_right\"></span>" +
                    "<span class=\"item_market_action_button_preload\"></span>";
    openCEbtn.addEventListener('click', OpenCsgoexchange);
    parent.insertBefore(openCEbtn, parent.children[0]);
    parent.insertBefore(document.createTextNode("									"), parent.children[1]);
    //Load按钮
    /*var newbtn = document.createElement("a");
    newbtn.setAttribute("class", "item_market_action_button item_market_action_button_green");
    newbtn.innerHTML = "<span class=\"item_market_action_button_edge item_market_action_button_left\"></span>" +
                    "<span class=\"item_market_action_button_contents\">Load</span>" +
                    "<span class=\"item_market_action_button_edge item_market_action_button_right\"></span>" +
                    "<span class=\"item_market_action_button_preload\"></span>";
    newbtn.addEventListener('click', LoadItemsInfo);
    parent.insertBefore(newbtn, parent.children[0]);*/
}
    

/*function LoadItemsInfo() {
    var cc = g_rgAssets[730][2];
    var n = 0;
    for (var i in cc) {
        var ava = document.getElementsByClassName("market_listing_owner_avatar")[n].children[0].children[0];
        n = n + 1;
        var src;
        if (ava.children.length == 0) src = ava.src;
        else src = ava.children[0].src;
        var address = "http://csgo.exchange/item/" + i;
        ava.outerHTML = "<a href=\"" + address +
            "\"><img id=\"headerUserAvatarIcon\" src=\"" + src + "\" alt=\"\"></a>";
    }
}*/

function OpenCsgoexchange() {
    var cc = g_rgAssets[730][2];
    for (var i in cc) {
        window.open("http://csgo.exchange/item/" + i);
    }
}
function OpenSteamanalyst() {
    var cc = g_rgAssets[730][2];
    for (var i in cc) {
        window.open("http://csgo.steamanalyst.com/float/" + i);
    }
}