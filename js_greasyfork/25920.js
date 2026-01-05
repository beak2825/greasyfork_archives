// ==UserScript==
// @name         SteamGifts - Giveaway Error Link
// @namespace    Royalgamer06
// @version      0.2
// @description  https://www.steamgifts.com/discussion/VuO2j/the-link-in-you-dont-have-permission-to-view-this-giveaway-should-point-to-the-game-page-on-steam
// @author       Royalgamer06
// @include      /https?\:\/\/(www\.)?steamgifts\.com\/giveaway\/[A-z0-9]{5}\/.+/
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/25920/SteamGifts%20-%20Giveaway%20Error%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/25920/SteamGifts%20-%20Giveaway%20Error%20Link.meta.js
// ==/UserScript==

/*
const change_to_steam_search = false; //If true, searches steam instead of steamgifts

$(document).ready(function() {
    var elem = $(".table__column__secondary-link");
    if (elem.length == 1) elem[0].href = (change_to_steam_search ? "http://store.steampowered.com/search/?term=" : "https://www.steamgifts.com/giveaways/search?q=") + encodeURIComponent(elem[0].innerHTML);
});*/

if (confirm("Userscript '" + GM_info.script.name + "' is now part of 'Enhanced SteamGifts & SteamTrades'. Please remove this userscript. Press OK to get the new userscript.")) location.href = "https://github.com/rafaelgs18/ESGST/raw/master/ESGST.user.js";