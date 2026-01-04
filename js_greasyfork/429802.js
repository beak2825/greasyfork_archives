// ==UserScript==
// @name         Hobby Genki Stock Levels
// @namespace    https://tharglet.me.uk
// @version      1.0
// @description  Displays stock counts on Hobby Genki
// @author       tharglet
// @match        https://hobby-genki.com/*
// @icon         https://www.google.com/s2/favicons?domain=hobby-genki.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429802/Hobby%20Genki%20Stock%20Levels.user.js
// @updateURL https://update.greasyfork.org/scripts/429802/Hobby%20Genki%20Stock%20Levels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const productDetails = document.getElementById("product-details");
    if(productDetails) {
        const productJson = JSON.parse(productDetails.getAttribute("data-product"));
        let stockLevelP = document.createElement('p');
        const t = document.createTextNode(`Stock available: ${productJson.allow_oosp === 1 ? 'Unlimited!' : productJson.quantity}`);
        stockLevelP.appendChild(t);
        const mainTitle = document.getElementsByClassName("h1")[0];
        mainTitle.appendChild(stockLevelP);
    }
})();