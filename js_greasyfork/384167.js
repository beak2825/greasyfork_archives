// ==UserScript==
// @name         Aliexpress show total price
// @namespace    https://greasyfork.org/pl/scripts/384167-aliexpress-show-total-price
// @version      0.1
// @author       Mateusz Kula
// @description  Show total price- remove hide-total-price class
// @icon         https://kulam.pl/script/aliexpress-total-price/icon.jpg
// @icon64       https://kulam.pl/script/aliexpress-total-price/icon.jpg
// @supportURL   https://kulam.pl/kontakt
// @match        *.aliexpress.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @homepageURL  https://kulam.pl


// @downloadURL https://update.greasyfork.org/scripts/384167/Aliexpress%20show%20total%20price.user.js
// @updateURL https://update.greasyfork.org/scripts/384167/Aliexpress%20show%20total%20price.meta.js
// ==/UserScript==
(function() {
    if(document.querySelector("#j-product-operate-wrap > dl.p-property-item.p-total-price.hide-total-price"))
        document.querySelector("#j-product-operate-wrap > dl.p-property-item.p-total-price.hide-total-price").classList.remove("hide-total-price");
else
console.log("Aliexpress show total price: Element not found");
})();