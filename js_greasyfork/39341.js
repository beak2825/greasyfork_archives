// ==UserScript==
// @name         MyAnimeList Hide Manga Store
// @namespace    https://greasyfork.org/en/users/96096-purplepinapples
// @version      0.8
// @description  Hides the Manga Store Ads on MyAnimeList.
// @author       PurplePinapples
// @match        https://myanimelist.net/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/39341/MyAnimeList%20Hide%20Manga%20Store.user.js
// @updateURL https://update.greasyfork.org/scripts/39341/MyAnimeList%20Hide%20Manga%20Store.meta.js
// ==/UserScript==

(function() {
    "use strict";
    $(".mal-ad-unit").hide()
    $(".left-info-block-manga-store-button").parent().removeClass();
    $(".left-info-block-manga-store-button").hide();
    $(".manga-store-preview").hide();
    $(".manga-store-information").hide();
    $(".btn-affiliate.manga-store").hide();
    $(".btn-forum-manga-store").hide();
    // if we're on the forum
    if (window.location.href.indexOf("topicid=") != -1) {
        $("div > h2:contains('Manga Store')").parent().hide()
    } else {
        //on anime/manga page
        let c = window.location.href
        if (c.indexOf("/anime/") != -1 || c.indexOf("/manga/") != -1 || c.indexOf("anime.php?id=") != -1 || c.indexOf("manga.php?id=") != -1) {
            $('h2:contains("Manga Store")').parent().hide();
        }
    }
})();