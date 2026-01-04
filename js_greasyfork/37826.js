// ==UserScript==
// @name         Mal-badges remove fake accounts
// @namespace    https://greasyfork.org/en/users/96096-purplepinapples
// @version      0.1
// @description  Very simple script to hide fraudelent accounts on mal-badges
// @author       PurplePinapples
// @match        http://www.mal-badges.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37826/Mal-badges%20remove%20fake%20accounts.user.js
// @updateURL https://update.greasyfork.org/scripts/37826/Mal-badges%20remove%20fake%20accounts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var account_list = ["xbhrjd", "TsukasaKei", "Lucky_Tanuki", "HunDun", "BabsTheAnimeGod", "Sakura-bot", "OnePunchOtoko", "tsutaee", "Fovez", "MagoDos100Anos", "zerothefallen", "HaremAnimeFinder"];
    for (var i = 0; i < account_list.length; i++) {
        $("tr[data-link='http://www.mal-badges.net/users/" + account_list[i].toLowerCase() + "']").each(function() {$(this).hide();});
    }
})();