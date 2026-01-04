// ==UserScript==
// @name         CSGO Float Checker
// @namespace    http://tampermonkey.net/
// @version      0.1-SNAPSHOT
// @description  Check CSGO skins's Float in the market
// @author       Masazumi
// @include      http*://steamcommunity.com/market/listings/730/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/375316/CSGO%20Float%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/375316/CSGO%20Float%20Checker.meta.js
// ==/UserScript==

function c() {
    var items = document.getElementsByClassName("market_actionmenu_button");
    var ids = [];
    for (let i=0;i<items.length;i++)
        ids.push(items[i].id);
    var buttons = document.getElementsByClassName("market_listing_item_name_block");
    for(let i = 0; i < buttons.length-1; i++) {
        let node = document.createElement("a");
        node.innerText = "check it!";
        node.onclick = function(){b(i, node);};
        node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
        node.style = "line-height: 20px;font-size: 10px;width:200px;text-align:center";
        buttons[i].appendChild(node);
    }
}

function b(i, node) {
    keys = Object.keys(g_rgAssets[730][2]);
    link = g_rgAssets[730][2][keys[i]].market_actions[0].link;
    link = link.replace('%assetid%', keys[i]);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.csgofloat.com/?url=' + link,
        onload: response => {
            response = JSON.parse(response.response);
            node.innerText = response.iteminfo.floatvalue;
            console.log(response.iteminfo.floatvalue);
        }
    });
}
c();
button_node = document.createElement("a");
button_node.onclick = c;
button_node.innerText = "听话，让我看看";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);