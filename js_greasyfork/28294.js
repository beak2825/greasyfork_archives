// ==UserScript==
// @name         SteamGifts - Train Opener
// @namespace    Royalgamer06
// @version      1.0
// @description  Opens all train giveaways in new tabs
// @author       Royalgamer06
// @include      /^https://www.steamgifts.com/giveaway/.+$/
// @require      http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/28294/SteamGifts%20-%20Train%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/28294/SteamGifts%20-%20Train%20Opener.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);
$(document).ready(function() {
    $("a[href*='/giveaway/']:contains('next'), a[href*='/giveaway/']:contains('Next'), a[href*='/giveaway/']:contains('NEXT'), a[href*='/giveaway/']:contains('>'), a[href*='/giveaway/']:contains('>>'), a[href*='/giveaway/']:contains('>>>'), a[href*='/giveaway/']:contains('->'), a[href*='/giveaway/']:contains('=>')").each(function() {
        var link = this.href;
        var visited = localStorage.getItem("visited_giveaways") ? localStorage.getItem("visited_giveaways").split(",") : [];
        if ($.inArray(link, visited) == -1) {
            window.open(link, "_blank");
            visited.push(link);
            localStorage.setItem("visited_giveaways", visited.join(","));
        }
    });
});