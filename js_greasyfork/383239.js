// ==UserScript==
// @name         AWP | Electric Hive
// @namespace    https://steamcommunity.com/id/_DioniS_/
// @namespace    https://csgopatterns.ga
// @version      1.0
// @description  Script for auto find rare pattern!
// @author       DioniS (CS:GO Patterns)
// @match        https://steamcommunity.com/market/listings/730/AWP%20%7C%20Electric%20Hive*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383239/AWP%20%7C%20Electric%20Hive.user.js
// @updateURL https://update.greasyfork.org/scripts/383239/AWP%20%7C%20Electric%20Hive.meta.js
// ==/UserScript==
// _____  _____   _____ _____    ______     _   _
///  __ \/  ___|_|  __ \  _  |   | ___ \   | | | |
//| /  \/\ `--.(_) |  \/ | | |   | |_/ /_ _| |_| |_ ___ _ __ _ __  ___
//| |     `--. \ | | __| | | |   |  __/ _` | __| __/ _ \ '__| '_ \/ __|
//| \__/\/\__/ /_| |_\ \ \_/ /   | | | (_| | |_| ||  __/ |  | | | \__ \
// \____/\____/(_)\____/\___/    \_|  \__,_|\__|\__\___|_|  |_| |_|___/
//
var sed=[273, 436,902,23,853,262,185,598,851,385,138];
var sed1=[253,54,767,697,42,894,354,835,117,540,384,143,96,376];
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
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="BLUE PATTERN";
}
                if(seed==sed1[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="ORANGE PATTERN";
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