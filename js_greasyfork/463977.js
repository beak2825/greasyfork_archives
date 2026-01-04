// ==UserScript==
// @name         删除磁力链接Tracker Remover Magnet Link Tracker 
// @name:zh-cn   删除磁力链接Tracker
// @namespace    lanhaha
// @version      1.2
// @description  Remove trackers from magnet links
// @description:zh-cn  删除磁力链接Tracker
// @match        *://*/*
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/463977/%E5%88%A0%E9%99%A4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5Tracker%20Remover%20Magnet%20Link%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/463977/%E5%88%A0%E9%99%A4%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5Tracker%20Remover%20Magnet%20Link%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get all the links on the page
    var links = document.getElementsByTagName("a");

    // Loop through the links
    for (var i = 0; i < links.length; i++) {
        // Get the href attribute of the link
        var href = links[i].href;

        // Check if the link is a magnet link
        if (href.startsWith("magnet:?")) {
            // Split the link by "&" to get the parameters
            var params = href.split("&");

            // Loop through the parameters
            for (var j = 0; j < params.length; j++) {
                // Check if the parameter is a tracker
                if (params[j].startsWith("tr=")) {
                    // Remove the parameter from the array
                    params.splice(j, 1);

                    // Decrement j to avoid skipping the next parameter
                    j--;
                }
                // Join the parameters back with "&"
            var newHref = params.join("&");

            // Replace the link's href attribute with the new one
            links[i].href = newHref;



            }


        }
    }
})();