// ==UserScript==
// @name         Supremacy1914 but no gold
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  No more gold missclicks
// @author       Somka
// @match *://www.supremacy1914.pl/*
// @match *://www.supremacy1914.com/*
// @match *://www.supremacy1914.fr/*
// @match *://www.supremacy1914.de/*
// @match *://www.supremacy1914.ru/*
// @match *://www.supremacy1914.nl/*
// @match *://www.supremacy1914.es/*
// @match *://www.supremacy1914.it/*
// @icon         https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/PZL.37A_72.11.jpg/1280px-PZL.37A_72.11.jpg
// @license CC BY-NC-ND
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462031/Supremacy1914%20but%20no%20gold.user.js
// @updateURL https://update.greasyfork.org/scripts/462031/Supremacy1914%20but%20no%20gold.meta.js
// ==/UserScript==

function deleting(className){
    const elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

setInterval(function(){
    deleting("button_tile premium layout_row marginate_small");
    deleting("button_premium_decrease");
    deleting("button_tile premium dynamic_size row_formation");
    deleting("button_premium_increase func_order_table_premium_buy_button");
    deleting("button_premium_speedup_big func_building_speedup");
    deleting("button_premium_speedup province_bar_button");
    deleting("button_premium_increase");
    deleting("button_premium_speedup_big func_production_speedup");
}, 11);