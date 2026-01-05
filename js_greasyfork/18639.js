// ==UserScript==
// @name           MyAnimeList(MAL) - Recommendations direct link
// @version        1.0.6
// @description    When you click on a recommendation picture in a anime/manga page, you go directly to the anime/manga and not the recommendation page.
// @author         Cpt_mathix
// @match          https://myanimelist.net/anime/*
// @match          https://myanimelist.net/manga/*
// @match          https://myanimelist.net/anime.php?*
// @match          https://myanimelist.net/manga.php?*
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/[^0-9]+/
// @exclude        /^https?:\/\/myanimelist\.net\/(anime|manga)\/\d+\/.+\/.+/
// @grant          none
// @namespace https://greasyfork.org/users/16080
// @downloadURL https://update.greasyfork.org/scripts/18639/MyAnimeList%28MAL%29%20-%20Recommendations%20direct%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/18639/MyAnimeList%28MAL%29%20-%20Recommendations%20direct%20link.meta.js
// ==/UserScript==

var type = 'anime';
if (/^https?:\/\/myanimelist\.net\/manga*/.test(document.location.href)) {
	type = 'manga';
}

var allElements;
allElements = document.evaluate(
    '//*[@id="' + type + '_recommendation"]/div[3]/ul/li[*]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

for (var i = 0; i < allElements.snapshotLength; i++) {
    var linkEl = allElements.snapshotItem(i).firstChild;
    var href = linkEl.href;
    var id = href.match(/\d+/g);
    var self = document.location.href.match(/\d+/g)[0];
    linkEl.href = href.replace(self,'').replace('-','').replace('\/recommendations','');
}