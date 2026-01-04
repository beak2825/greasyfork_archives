// ==UserScript==
// @name         SVC - Steam Viewer Cards
// @namespace    Steam
// @version      1.211
// @description  Fixes the "Trading Cards" button in the category block
// @author       gignorie
// @match        https://store.steampowered.com/app/*
// @grant        none
// @require      https://code.jquery.com/jquery-1.11.0.min.js
// @icon         https://steamcommunity.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/404743/SVC%20-%20Steam%20Viewer%20Cards.user.js
// @updateURL https://update.greasyfork.org/scripts/404743/SVC%20-%20Steam%20Viewer%20Cards.meta.js
// ==/UserScript==

var game_title = /app\/(.+?)\/(.*)\//.exec(location.href)[2].replace('_','+');
var cards_url = 'https://steamcommunity.com/market/search?q=cards+'+game_title;
//var username = /id\/(.*)\/home\//.exec($J('#global_header').find('a.menuitem.supernav.username')[0].href)[1];
var category_block = $J("#category_block").find('div.game_area_details_specs');

for(var i=1; i<category_block.length;i++){
    var cards_href = category_block[i].getElementsByClassName('name')[0].href;
    var cards_id = i;
    if(cards_href == 'https://store.steampowered.com/search/?category2=29&snr=1_5_9__423'){
        break;
    } else cards_href = null;
}

if(cards_href === null)return console.log('SVC Debug: Category Cards - Undefined');

category_block[cards_id].getElementsByClassName('icon')[0].children[0].href = cards_url;
category_block[cards_id].getElementsByClassName('name')[0].href = cards_url;