// ==UserScript==
// @name         Skroutz sponsored remover
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  Removes all sponsored products from product list (sponsored products are dublicates, so you will see them at their natural order).
// @author       Sotiris Kipouros
// @license      MIT
// @match        https://www.skroutz.gr/c/*
// @match        https://www.skroutz.gr/s/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=skroutz.gr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481045/Skroutz%20sponsored%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/481045/Skroutz%20sponsored%20remover.meta.js
// ==/UserScript==

// console.log('skroutz-sponsored-remover is RUNNING'); // DEBUGGING - shows that script is running on this page

// Get product list element in products category list to detect mutations or set to false in order for the observer to not initialize
const skuList = document.querySelector("#sku-list") || false

// Get sponsored products card in product page
const sponsoredProductsCard = document.querySelector(".sponsored-product-cards") || false

// Detect content changes (e.g. changing search filters) and remove again the ads
const mutationObserver = new MutationObserver(function (mutations) {
    // console.log("Content changed!"); // Notify in the console when the content has changed
    removeAdsFromCategory(getAds())
})

// Finds all sponsored products into current product list (in a category)
function getAds() {
    return document.querySelectorAll('.labeled-product, .labeled-item')
}

// Removes the sponsored products in category list
function removeAdsFromCategory(list) {
    // return false; // DEBUGGING - stops the ad removal
    
    // Iterate the HTMLcollection and change the opacity for all sponsores products
    [...list].map((element) => {
        sponsoredStyle(element)
    })
}

// Removes the "sponsored" card from product page
function removeAdsFromProductPage(element) {
    sponsoredStyle(element)
}

// Style modification for sponsored elements - Applies to all kind of sponsored elements
function sponsoredStyle(element) {
    // element.style.opacity = 0.2 // DEBUGGING - grays out sponsored (comment the other css modifications)
    element.style.display = "none"
}

// Initialize the script
(function () {
    'use strict';

    // Initialize content changes detection in product category list
    if (skuList) {
        mutationObserver.observe(skuList, {
            attributes: true
        })
    }

    // Find all sponsored items and remove them on page's first load
    const ads = getAds()
    removeAdsFromCategory(ads)

    if (sponsoredProductsCard) {
        removeAdsFromProductPage(sponsoredProductsCard)
    }
})()
