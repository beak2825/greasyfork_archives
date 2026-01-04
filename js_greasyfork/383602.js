// ==UserScript==
// @name         Steam (Counter-Strike: Global Offensive) Universal Plugin
// @namespace    https://steamcommunity.com/id/_DioniS_/
// @namespace    https://csgopatterns.ga
// @version      1.0
// @description  Script for auto find rare pattern!
// @author       DioniS (CS:GO Patterns)
// @match        https://steamcommunity.com/market/*/730/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/383602/Steam%20%28Counter-Strike%3A%20Global%20Offensive%29%20Universal%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/383602/Steam%20%28Counter-Strike%3A%20Global%20Offensive%29%20Universal%20Plugin.meta.js
// ==/UserScript==
// _____  _____   _____ _____    ______     _   _
///  __ \/  ___|_|  __ \  _  |   | ___ \   | | | |
//| /  \/\ `--.(_) |  \/ | | |   | |_/ /_ _| |_| |_ ___ _ __ _ __  ___
//| |     `--. \ | | __| | | |   |  __/ _` | __| __/ _ \ '__| '_ \/ __|
//| \__/\/\__/ /_| |_\ \ \_/ /   | | | (_| | |_| ||  __/ |  | | | \__ \
// \____/\____/(_)\____/\___/    \_|  \__,_|\__|\__\___|_|  |_| |_|___/
//
document.getElementsByClassName('btn_medium market_noncommodity_buyorder_button')[0].remove();
document.getElementById('market_buyorder_info').style.height="30px";
document.getElementById('market_commodity_buyrequests').remove();
document.getElementById('market_buyorder_info_show_details').remove();
var input = document.createElement("input");
input.type = "text";
input.setAttribute("class", "filter_search_box market_search_filter_search_box");
input.style.position="absolute";
input.style.left="5px";
input.placeholder="Enter page number";
input.id="find";
input.style.width="120px";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(input);
var go = document.createElement("a");
go.setAttribute("class", "item_market_action_button btn_green_white_innerfade btn_small");
go.style.position="absolute";
go.style.left="137px";
go.onclick =go_p;
go.innerHTML="go";
go.style.textAlign="center";
go.style.top="11px";
go.style.width="23px";
go.style.height="23px";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(go);
var sed = document.createElement("input");
sed.type = "text";
sed.setAttribute("class", "filter_search_box market_search_filter_search_box");
sed.style.position="absolute";
sed.style.left="164px";
sed.placeholder="Enter patterns through a comma";
sed.id="seed";
sed.style.width="200px";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(sed);
var check = document.createElement("a");
check.setAttribute("class", "item_market_action_button btn_green_white_innerfade btn_small");
check.style.position="absolute";
check.style.left="376px";
check.innerHTML="check";
check.style.textAlign="center";
check.onclick=checksed;
check.style.top="11px";
check.style.width="46px";
check.style.height="23px";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(check);
function go_p(){
    g_oSearchResults.GoToPage(+document.getElementById('find').value-1);
}
function url(){
    setInterval(function(){
for(var i=0;i<document.getElementsByClassName('market_actionmenu_button').length;i++){
document.getElementsByClassName('market_actionmenu_button')[i].onclick=view;
}
    },100);
}
var vie= document.createElement("a");
vie.setAttribute("class", "popup_menu_item");
vie.innerHTML="Get screenshot...";
function view(){
    vie.href="http://csgo.gallery/"+document.getElementById('market_action_popup_itemactions').getElementsByTagName('a')[0].href;
    document.getElementById("market_action_popup_itemactions").appendChild(vie);
}
url();
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
            document.getElementsByClassName('market_listing_item_name')[i].innerHTML="Float: "+response.iteminfo.floatvalue;
            document.getElementsByClassName('market_listing_game_name')[i].innerHTML="Paintseed: "+response.iteminfo.paintseed;
        }

    });
}
var seeds=[];
var button_node = document.createElement("a");
button_node.onclick = c;
button_node.innerText = "Get all info";
button_node.setAttribute("class", "btn_green_white_innerfade btn_medium market_noncommodity_buyorder_button");
button_node.style = "line-height: 30px;font-size: 15px;width:120px;text-align:center";
document.getElementById("market_buyorder_info").childNodes[1].childNodes[1].appendChild(button_node);
function checksed(){
var mas=document.getElementById('seed').value;
function splitString(stringToSplit, separator) {
  var seed = stringToSplit.split(separator);
    for(var i=0;i<seed.length;i++){
        seeds[i]=seed[i];
    }
}
var comma = ',';
splitString(mas, comma);
    k();
}
function k() {
    var items = document.getElementsByClassName("market_actionmenu_button");
    var ids = [];
    for (let i=0;i<items.length;i++)
        ids.push(items[i].id);
    var buttons = document.getElementsByClassName("market_listing_item_name_block");
    for(let i = 0; i < buttons.length-1; i++) {

        l(i);
    }
}

function l(i) {
   var keys = Object.keys(g_rgAssets[730][2]);
   var link = g_rgAssets[730][2][keys[i]].market_actions[0].link;
    link = link.replace('%assetid%', keys[i]);
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.csgofloat.com/?url=' + link,
        onload: response => {
            response = JSON.parse(response.response);
            var seed = response.iteminfo.paintseed;
            for(let j=0;j<seeds.length;j++){
if(seed==seeds[j]){
    document.getElementsByClassName('market_listing_row')[i+1].style.background="#a71616";
    document.getElementsByClassName('market_listing_item_name')[i].innerHTML="Paintseed: "+seed;
}
       }
        }

    });
    document.getElementsByClassName('market_listing_price')[i*3].innerHTML=document.getElementsByClassName('market_listing_price')[i*3].innerHTML+" ✓";
}