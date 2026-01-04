// ==UserScript==
// @name	Temu Link Cleaner
// @namespace	https://github.com/Springers
// @description	Simplify Temu links. Cleans up temu.com links into temu.com/g-[PRODUCTID].html format and updates the address bar.
// @version	1.021
// @author	Springer
// @homepageURL	https://github.com/Springers/UserScripts/blob/main/Temu_Link_Cleaner.user.js
// @homepageURL	https://github.com/Springers
// @homepageURL	https://greasyfork.org/en/scripts/539519-temu-link-cleaner
// @homepageURL	https://greasyfork.org/en/users/1448667
// @icon	https://www.google.com/s2/favicons?sz=64&domain=temu.com
// @icon	https://aimg.kwcdn.com/upload_aimg/web/c9653751-0a91-46f1-806a-b639dd32931b.png
// @icon	https://aimg.kwcdn.com/upload_aimg/web/c9653751-0a91-46f1-806a-b639dd32931b.png.slim.png
// @match	*://*.temu.com/*
// @grant	none
// @run-at	
// @license	Non-Commercial Use Only
// @downloadURL https://update.greasyfork.org/scripts/539519/Temu%20Link%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/539519/Temu%20Link%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the product ID from Temu URLs
    function getProductID(url) {
        const match = url.match(/g-(\d+)\.html/); // Match the product ID in the format "g-12345.html"
        return match ? match[1] : null;
    }

    // Function to create the cleaned-up URL
    function createCleanURL(productID) {
        return `https://www.temu.com/g-${productID}.html`;
    }

    // Main logic
    const currentURL = window.location.href;

    // Check if the URL already contains "g-[ProductID].html"
    const productID = getProductID(currentURL);

    if (productID) {
        const cleanURL = createCleanURL(productID);

        // Replace the current URL in the browser's address bar
        if (currentURL !== cleanURL) {
            window.history.replaceState(null, null, cleanURL);
        }
    }
})();
