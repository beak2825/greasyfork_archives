// ==UserScript==
// @name         Modify Image URLs in srcset with jQuery
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Modify image URLs by removing the query string in elements with class "PDP_Large_Images"
// @author       Your Name
// @match        https://www.kohls.com/*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/502413/Modify%20Image%20URLs%20in%20srcset%20with%20jQuery.user.js
// @updateURL https://update.greasyfork.org/scripts/502413/Modify%20Image%20URLs%20in%20srcset%20with%20jQuery.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // Function to modify the srcset and src attributes
    function modifyImageURLs() {
        $('.PDP_Large_Images img').each(function() {
            var $img = $(this);
            var srcset = $img.attr('srcset');

            if (srcset) {
                // Split the srcset by commas to get individual URLs
                var newSrcset = srcset.split("?")[0];

                // Set the new srcset without query strings
                $img.attr('srcset', newSrcset);
            }

            var src = $img.attr('src');
            if (src) {
                // Remove the query string from the src
                var newSrc = src.split("?")[0];

                // Set the new src without query strings
                $img.attr('src', newSrc);
            }
        });
    }

    // Create a MutationObserver to monitor the DOM for changes
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                modifyImageURLs();
            }
        });
    });

    // Configuration for the observer
    var config = { childList: true, subtree: true };

    // Start observing the document
    observer.observe(document.body, config);

    // Initial call to modify URLs in case the images are already present
    modifyImageURLs();
})(jQuery);
