// ==UserScript==
// @name        [GC | BETA] - Enhanced UB Search Helper
// @namespace   https://greasyfork.org/en/users/1225524-kaitlin
// @match       https://www.grundos.cafe/market/wizard/*
// @match       https://www.grundos.cafe/island/tradingpost/*
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @license     MIT
// @version     86
// @author      Cupkait
// @description Adds enhanced search features to SW and TP to make the navigation of searching and browsing expensive items easier.
// @downloadURL https://update.greasyfork.org/scripts/484411/%5BGC%20%7C%20BETA%5D%20-%20Enhanced%20UB%20Search%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/484411/%5BGC%20%7C%20BETA%5D%20-%20Enhanced%20UB%20Search%20Helper.meta.js
// ==/UserScript==

if (!localStorage.getItem('scriptAlert-484411')) {
    alert("The UB Search Helper script has been discontinued. You can remove it from your browser from your user script extension's settings.");
    localStorage.setItem('scriptAlert-484411', 'true');
}