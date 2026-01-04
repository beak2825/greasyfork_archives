// ==UserScript==
// @name         Nexus Mod - Updated Mod Highlighter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Highlight mods that have updated since you last downloaded them
// @author       The1nk
// @match        https://www.nexusmods.com/*/users/myaccount?tab=download+history
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/476074/Nexus%20Mod%20-%20Updated%20Mod%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/476074/Nexus%20Mod%20-%20Updated%20Mod%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function whenAvailable(jQuery, cb) {
        var interval = 200; // ms
        window.setTimeout(function() {
            var loadingIndicator = jQuery("p.history_loading");
            if (loadingIndicator !== undefined && loadingIndicator.css("display") === "none") {
                cb(jQuery);
            } else {
                whenAvailable(cb, jQuery);
            }
        }, interval);
    }

    //var slowButton = document.getElementById('slowDownloadButton');
    jQuery(document).ready(function() {
        whenAvailable(jQuery, function() {
            var rows = jQuery("tr.even,tr.odd");

            rows.each(function() {
                var downloadDate = jQuery(this).children("td.table-download").text();
                var updateDate = jQuery(this).children("td.table-update").text();

                try {
                    var dateDl = Date.parse(downloadDate);
                    var dateUp = Date.parse(updateDate);

                    if (dateDl < dateUp) {
                        jQuery(this).children("td").css("background-color", "#444400");
                    }
                } catch (error) {
                    console.log("Err? " + error)
                }
            });
        });
    });
})();