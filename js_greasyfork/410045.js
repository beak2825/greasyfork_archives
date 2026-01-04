// ==UserScript==
// @name         Space Hair Sniper
// @namespace    Updated by Coco
// @version      1.0
// @description  Automatically purchases an item for a set price or less.
// @author       Someone else
// @match        https://www.roblox.com/catalog/564449640...ace-People
// @match        https://roblox.com/catalog/564449640/Bea...ace-People
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410045/Space%20Hair%20Sniper.user.js
// @updateURL https://update.greasyfork.org/scripts/410045/Space%20Hair%20Sniper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var purchaseprice = 1000; //Max price you'd pay
    var stringprice = document.getElementsByClassName('text-robux-lg')[0].innerHTML;
    var price = stringprice.replace(',','');
    if (price <= purchaseprice) {
        var confirmbutton = document.getElementsByClassName("btn-fixed-width-lg btn-growth-lg PurchaseButton");
        for (var x=0;x<confirmbutton.length; x++) {
            confirmbutton[x].click();
        }
        document.getElementById("confirm-btn").click();
    } else {
        document.location.reload();
    }
})();

