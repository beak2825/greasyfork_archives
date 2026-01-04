// ==UserScript==
// @name         Five-SeveN | Case Hardened
// @namespace    https://steamcommunity.com/id/_DioniS_/
// @namespace    https://csgopatterns.ga
// @version      1.0
// @description  Script for auto find rare pattern!
// @author       DioniS (CS:GO Patterns)
// @match        https://steamcommunity.com/market/listings/730/Five-SeveN%20%7C%20Case%20Hardened*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383237/Five-SeveN%20%7C%20Case%20Hardened.user.js
// @updateURL https://update.greasyfork.org/scripts/383237/Five-SeveN%20%7C%20Case%20Hardened.meta.js
// ==/UserScript==
// _____  _____   _____ _____    ______     _   _
///  __ \/  ___|_|  __ \  _  |   | ___ \   | | | |
//| /  \/\ `--.(_) |  \/ | | |   | |_/ /_ _| |_| |_ ___ _ __ _ __  ___
//| |     `--. \ | | __| | | |   |  __/ _` | __| __/ _ \ '__| '_ \/ __|
//| \__/\/\__/ /_| |_\ \ \_/ /   | | | (_| | |_| ||  __/ |  | | | \__ \
// \____/\____/(_)\____/\___/    \_|  \__,_|\__|\__\___|_|  |_| |_|___/
//
var sed=[22,107,108,156,158,164,192,195,229,257,301,308,324,338,353,356,384,393,410,427,439,440,449,451,469,473,476,486,491,504,544,546,553,565,608,621,653,660,686,691,695,703,726,731,744,747,748,759,790,805,825,860,867,895,906,929,931,946,952,959,972,976,981];
var sed1=[151,189,278,363,532,631,648,670,690,868,872];
var sed2=[25,151,177,187,189,215,278,363,426,450,532,631,640,690,700,724,844,872,888,927,955];
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
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="GOLD GEM";
}
                if(seed==sed1[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="BLUE GEM";
}
                if(seed==sed2[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+seed;
                    if(document.getElementsByClassName('market_listing_item_name')[i].innerHTML=="BLUE GEM"){
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="BLUE GEM (CS.MONEY GIVES MORE MONEY)";
                    }else{
                    if(document.getElementsByClassName('market_listing_item_name')[i].innerHTML=="GOLD GEM"){
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="GOLD GEM (CS.MONEY GIVES MORE MONEY)";
                       }else{
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="CS.MONEY GIVES MORE MONEY";
                       }
                       }
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