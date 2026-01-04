// ==UserScript==
// @name         Find Missing Entries
// @namespace    https://greasyfork.org/en/users/96096
// @version      1.0.4
// @description  Opens all pages on MAL that are not on your list.
// @author       PurplePinapples
// @license      WTFPL
// @match        https://myanimelist.net/*
// @run-at       document-end
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/37533/Find%20Missing%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/37533/Find%20Missing%20Entries.meta.js
// ==/UserScript==

function exit_script () {
    "use strict";
    GM_setValue("reloadPageFailed", 0);
    location.href = (location.href.replace("&autoOpenMissingEntries=true", ""));
}

(function() {
    "use strict";
    var RELOAD_IF_FAIL_MAX = 5;
    if (location.href.toString().indexOf("&autoOpenMissingEntries=true") === -1) {
        //place menu option
        $(".header-menu-dropdown.header-list-dropdown.arrow_box").find("li:contains('Manga List')").after("<li><a href=\"https://myanimelist.net/anime.php?o=9&c%5B0%5D=a&c%5B1%5D=d&cv=2&w=1&autoOpenMissingEntries=true\">Open Missing</a></li>");
    } else {
        //on the starting page, check for errors then open pages
        if ($("html").find("div.js-block-list").find("tr").length === 0) { //if page failed (i.e. no MAL entries loaded into table)
            GM_setValue("reloadPageFailed", GM_getValue("reloadPageFailed", 0) + 1);
            window.location.reload(); //reload the page
        } else {
            GM_setValue("reloadPageFailed", 0); //if page didnt fail, set it back to 0.
        }
        if (GM_getValue("reloadPageFailed", 0) >= RELOAD_IF_FAIL_MAX) { //if we've failed 5 times, stop
            window.alert("Failed too many times. Exiting Script");
            exit_script();
            return;
        }
        if ($(".btn-login").text().trim() === "Login") { //if user isnt logged in
            window.alert("You aren't logged in. Please login and try again.");
            exit_script();
            return;
        }
        //open pages not on your list
        $('tr a.Lightbox_AddEdit[href*="ownlist/anime/add"]').each(function() {
            const link = $(this).parent().find('a[href*="myanimelist.net/anime"')
            window.open($(link).attr("href"));
        });
        if (location.href.indexOf("&show") === -1) {
            location.href = location.href + "&show=50";
        } else {
            var parts = location.href.split("&show=");
            location.href = parts[0] + "&show=" + (+parts[1] + 50).toString();
        }
    }
})();
