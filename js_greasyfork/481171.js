// ==UserScript==
// @name         DE Item Tooltips
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Change color of specific text
// @author       BingGPT + NeKpoT
// @match        *://dungeoneyes.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481171/DE%20Item%20Tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/481171/DE%20Item%20Tooltips.meta.js
// ==/UserScript==

(function() {
    // Function to trim image name
    function trimImageName(src) {
        if (!src) return null; // Return null if src is undefined

        var imageName = src.split('/').pop(); // Get the file name
        imageName = imageName.replace(/\.[^/.]+$/, ""); // Remove extension
        imageName = imageName.replace(/[0-9A-Z]+$/, ""); // Remove trailing digits and capital letters
        return imageName;
    }

    // Function to process item description
    function processItemDescription(itemDescription) {
        var itemName = itemDescription.find('strong').text();
        var itemType = itemDescription.find('em').text();
        var itemEffect = itemDescription.contents().filter(function() {
            return this.nodeType === 3; // Node.TEXT_NODE
        }).get(0).nodeValue.trim();
        var itemWeightValue = itemDescription.contents().filter(function() {
            return this.nodeType === 3; // Node.TEXT_NODE
        }).get(1).nodeValue.trim();
        return itemName + '\n' + itemType + '\n' + itemEffect + '\n' + itemWeightValue;
    }

    // Fetch the item descriptions page
    jQuery.get('/items', function(data) {
        var itemDescriptions = jQuery(data).find('p');

        // Add mouseover event to each image
        jQuery('img').on('mouseover', function() {
            var src = trimImageName(jQuery(this).attr('src'));
            if (!src || !src.startsWith('ITEM')) return; // Skip if src is undefined or does not start with 'ITEM'

            var itemDescription;

            // Find the matching item description
            itemDescriptions.each(function() {
                var itemImgSrc = trimImageName(jQuery(this).find('img').attr('src'));
                if (itemImgSrc && itemImgSrc === src) {
                    itemDescription = jQuery(this);
                    return false; // break the loop
                }
            });

            if (itemDescription) {
                // Process the item description and show the tooltip
                jQuery(this).attr('title', processItemDescription(itemDescription));
            }
        });
    });

})();