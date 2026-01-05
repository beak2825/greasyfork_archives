// ==UserScript==
// @name         SteamGifts - Remove Unwanted Entries
// @namespace    Royalgamer06
// @version      1.0
// @description  Adds a button that removes entries from giveaways of owned steam games you entered
// @author       Royalgamer06
// @match        https://www.steamgifts.com/giveaways/entered*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/24833/SteamGifts%20-%20Remove%20Unwanted%20Entries.user.js
// @updateURL https://update.greasyfork.org/scripts/24833/SteamGifts%20-%20Remove%20Unwanted%20Entries.meta.js
// ==/UserScript==

//If you want to set your/another SteamID64 manually, state it here between brackets. (For example, to check owned games from someone else)
var manual_steamID = "";

//Do not touch below :)
$(document).ready(function() {
    if (manual_steamID.length == 17) {
        $(".page__heading__breadcrumbs").after("<a id=\"rue\" href=\"javascript:removeUnwanted('" + manual_steamID + "');\">Remove Unwanted Entries</a>");
    } else {
        $.get($(".nav__avatar-outer-wrap").attr("href"), function(data) {
            steamID = $(".sidebar__shortcut-inner-wrap a", data).attr("href").split("profiles/")[1];
            if (steamID.length == 17) {
                $(".page__heading__breadcrumbs").after("<a id=\"rue\" href=\"javascript:removeUnwanted('" + steamID + "');\">Remove Unwanted Entries</a>");
            } else {
                alert("[Clever Sync] ERROR: Could not fetch steamID automatically. Refresh the page to try again, or set manual steamID");
            }
        });
    }
});

unsafeWindow.removeUnwanted = function(steamID) {
    $("#rue").html('<div class="table__gift-feedback-loading"><i class="fa fa-refresh fa-spin"></i> Checking...</div>');
    GM_xmlhttpRequest({
        method: "GET",
        url: "http://steamcommunity.com/profiles/" + steamID + "/games/?xml=1",
        onload: function(data) {
            var xml = $.parseXML(data.responseText);
            var ownedGames = [];
            $("appid", xml).each(function() {
                ownedSteamGames.push($(this).text());
            });
            $("[style*='background-image:url(https://steamcdn-a.akamaihd.net/steam/apps/']").each(function() {
                var appid = $(this).css("background-image").split("/")[5];
                if ($.inArray(appid, ownedGames) > -1) {
                    $(this).parent().parent().parent().find(".table__column__secondary-link").click();
                }
            });
            $("#rue").html("Done!").removeAttr("href");
        }
    });
};