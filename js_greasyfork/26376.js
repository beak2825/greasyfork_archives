// ==UserScript==
// @name         Steam auto agree for sales
// @version      0.1
// @namespace    https://greasyfork.org/users/90009
// @description  Automatically checks the agree to SSA agreement when selling an item on Steam
// @author       SynTax
// @match        http://steamcommunity.com/id/*
// @include      https://steamcommunity.com/id/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26376/Steam%20auto%20agree%20for%20sales.user.js
// @updateURL https://update.greasyfork.org/scripts/26376/Steam%20auto%20agree%20for%20sales.meta.js
// ==/UserScript==

try{
    var agree = document.getElementById("market_sell_dialog_accept_ssa");
    agree.checked = true;
}catch(e){
    console.log(e);
}