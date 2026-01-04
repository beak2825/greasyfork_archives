// ==UserScript==
// @name         Aliexpress Total Price Script
// @version      0.2
// @description  Show Total Price on Aliexpress
// @author       Hamicuia
// @match        *://*.aliexpress.com/item/*
// @match        *://*.aliexpress.com/store/product*
// @grant        none
// @namespace https://greasyfork.org/users/298177
// @downloadURL https://update.greasyfork.org/scripts/382601/Aliexpress%20Total%20Price%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/382601/Aliexpress%20Total%20Price%20Script.meta.js
// ==/UserScript==

var totalPriceClass = document.querySelectorAll(".p-property-item.p-total-price.hide-total-price");

for(var i = 0, max = totalPriceClass.length; i < max; i++) {
    totalPriceClass[i].className="p-property-item p-total-price";
}