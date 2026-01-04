// ==UserScript==
// @name         CZ75-Auto | Polymer
// @namespace    https://steamcommunity.com/id/_DioniS_/
// @namespace    https://csgopatterns.ga
// @version      1.0
// @description  Script for auto find rare pattern!
// @author       DioniS (CS:GO Patterns)
// @match        https://steamcommunity.com/market/listings/730/CZ75-Auto%20%7C%20Polymer*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383238/CZ75-Auto%20%7C%20Polymer.user.js
// @updateURL https://update.greasyfork.org/scripts/383238/CZ75-Auto%20%7C%20Polymer.meta.js
// ==/UserScript==
// _____  _____   _____ _____    ______     _   _
///  __ \/  ___|_|  __ \  _  |   | ___ \   | | | |
//| /  \/\ `--.(_) |  \/ | | |   | |_/ /_ _| |_| |_ ___ _ __ _ __  ___
//| |     `--. \ | | __| | | |   |  __/ _` | __| __/ _ \ '__| '_ \/ __|
//| \__/\/\__/ /_| |_\ \ \_/ /   | | | (_| | |_| ||  __/ |  | | | \__ \
// \____/\____/(_)\____/\___/    \_|  \__,_|\__|\__\___|_|  |_| |_|___/
//
var sed=[45,81,90,102,122,165,215,216,254,288,329,385,403,464,551,559,577,687,699,700,724,769,841,843,856,914,923,931,950,952,958,968,971,974,985,997];
var sed1=[337,343,678,705, 736,772,778,784, 814,822,844, 847,868,890,896, 935,967,970,991];
var sed2=[175, 543, 638, 861];
function c() {
    var items = document.getElementsByClassName("market_actionmenu_button");
    var ids = [];
    for (let i=0;i<items.length;i++)
        ids.push(items[i].id);
    var buttons = document.getElementsByClassName("market_listing_item_name_block");
    for(let i = 0; i < buttons.length-1; i++) {

        b(i);
    }
}

function b(i) {
   var keys = Object.keys(g_rgAssets[730][2]);
   var link = g_rgAssets[730][2][keys[i]].market_actions[0].link;
    link = link.replace('%assetid%', keys[i]);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.csgofloat.com/?url=' + link,
        onload: response => {
            response = JSON.parse(response.response);
            var seed = response.iteminfo.paintseed;
            for(let j=0;j<40;j++){
if(seed==sed[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="BLUE POLYMER";
}
                if(seed==sed1[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="EMERALD POLYMER";
}
                if(seed==sed2[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="BLACK POLYMER";
}
            }
        }

    });
    document.getElementsByClassName('market_listing_price')[i*3].innerHTML=document.getElementsByClassName('market_listing_price')[i*3].innerHTML+" ✓";
}
var button_node = document.createElement("a");
button_node.onclick = c;
button_node.innerText = "Check";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);