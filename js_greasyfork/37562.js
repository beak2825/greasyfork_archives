// ==UserScript==
// @name         Open Aired Entries
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.1.3
// @description  Opens the first 15 entries on your PTW that are currently airing or that have aired.
// @author       PurplePinapples
// @include      /^https?:\/\/(www\.)?myanimelist\.net\/profile\/[^\/]*\/?
// @exclude      /^https?:\/\/(www\.)?myanimelist\.net\/profile\/[^\/]*\/(friends|clubs|reviews|reccomendations)
// @include      /^https?:\/\/(www\.)?myanimelist\.net\/animelist\/[^\/]*?order=-16&status=6&openuserscript=true
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/37562/Open%20Aired%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/37562/Open%20Aired%20Entries.meta.js
// ==/UserScript==

var OPEN_MAX_PAGES = 15;

(function () {
    "use strict";
    if (location.href.indexOf("/profile/") !== -1) { //if were on the profile page
        var planToWatch = $("div.anime").find("ul.stats-status.fl-l").children(":last-child");
        $(planToWatch).removeClass("mb12");
        $(planToWatch).addClass("mb8");
        $(planToWatch).after("<li class=\"clearfix mb4\" style=\"margin-left: 25px;\">┗ <a href=\"https://myanimelist.net/animelist/" + $("h1").first().find("span").text().trim().slice(0, -10) + "?order=-16&status=6&openuserscript=true\">Open Aired Entries</a></li>");
    } else { //else if were on the page which this opens pages from
        var openedPages = 0;
        $(".data.title.clearfix").each(function () {
            var contentStatus = $(this).find(".content-status").text().trim();
            console.log(contentStatus);
            if (contentStatus === "Airing" || contentStatus === "") {
                if (openedPages < OPEN_MAX_PAGES) {
                    window.open($(this).find(".link.sort").attr("href"));
                    openedPages = openedPages + 1;
                }
            }
        });
        //leave this page
        if ($(".username").text().trim() === "Your") {
            location.href = $("div.list-menu-float").find("a.profile").attr("href");
        } else if ($(".username").text().trim() !== "") {
            location.href = $(".username").attr("href");
        } else {
            location.href = "/";
        }
    }
})();