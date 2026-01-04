// ==UserScript==
// @name         TORN Stock Market Filter
// @namespace    kib.stockfilter
// @version      1.0.1
// @author       Kib
// @description  Filters the full list of stocks. You can choose whether to make a list of stock you want to be hidden, or a list of stock you want to be shown.
// @match        https://www.torn.com/stockexchange.php*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/406271/TORN%20Stock%20Market%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/406271/TORN%20Stock%20Market%20Filter.meta.js
// ==/UserScript==
'use strict';

// onlythelist = true, will SHOW only the stock in the STOCKLIST (all other stocks are hidden)
// onlythelist = false, will HIDE only the stock in the STOCKLIST (all other stocks are shown)
var onlythelist = true

// fill the array with the abbreviations you would like to see or hide (see above)
var STOCKLIST= ['HRG','SYM','FHG'];


$(".stock-list > li").each(function() {
    parent = $(this).find("div.acc-header");
    let abbrTxt = $(parent).find("div.abbr-name").text();
    let inlist = STOCKLIST.includes(abbrTxt)
    if ((onlythelist && !inlist) || (!onlythelist && present))
        $(this).hide();
});
