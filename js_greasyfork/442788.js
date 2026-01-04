// ==UserScript==
// @name        饰品磨损查看功能
// @namespace    http://tampermonkey.net/
// @version      0.1-SNAPSHOT
// @description  在steam市场页面查看饰品磨损
// @author       陈
// @include      http*://steamcommunity.com/market/listings/730/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442788/%E9%A5%B0%E5%93%81%E7%A3%A8%E6%8D%9F%E6%9F%A5%E7%9C%8B%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/442788/%E9%A5%B0%E5%93%81%E7%A3%A8%E6%8D%9F%E6%9F%A5%E7%9C%8B%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

function c() {
    var items = document.getElementsByClassName("market_actionmenu_button");
    var ids = [];
    for (let i=0;i<items.length;i++)
        ids.push(items[i].id);
    var buttons = document.getElementsByClassName("market_listing_item_name_block");
    for(let i = 0; i < buttons.length-1; i++) {
        let node = document.createElement("a");
        node.innerText = "查看磨损";
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
button_node.innerText = "点击查看检视图";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);