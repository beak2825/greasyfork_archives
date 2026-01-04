// ==UserScript==
// @name         Steam, Badge Creator Automate
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  This script automatically craft badge if you have enough cards
// @author       You
// @match        https://steamcommunity.com/id/*/badges/*
// @match        https://steamcommunity.com/id/*/gamecards/*/
// @grant        none
// @runat        document-end
// @nowrap
// @downloadURL https://update.greasyfork.org/scripts/393982/Steam%2C%20Badge%20Creator%20Automate.user.js
// @updateURL https://update.greasyfork.org/scripts/393982/Steam%2C%20Badge%20Creator%20Automate.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var blacklist = [1343890];
    var craftTimeout = 1500;
    var searchTimeout = 1500;

    jQuery(function () {
        setTimeout(function () {
            var $craft = jQuery(".badge_craft_button").filter(function (index, element) {
                for (var i = 0; i < blacklist.length; i++) {
                    if ((element.href || element.onclick || "").toString().indexOf(blacklist[i]) >= 0) return false;
                }
                return true;
            });

            if ($craft.length > 0) {
                var button = Array.prototype.pop.call($craft).click();

                if (location.pathname.indexOf("/gamecards/") >= 0) {
                    setTimeout(function () {
                        jQuery(".profile_small_header_location").first().click();
                    }, craftTimeout);
                }
            }

        }, searchTimeout);
    });
})();