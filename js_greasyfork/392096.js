// ==UserScript==
// @name          MangaHideFollowedManga
// @namespace     MangaHideFollowedManga
// @version       1.2
// @description   Hides already rated manga from manga lists & searches
// @author        Owyn
// @match         https://mangadex.org/genre/*
// @match         https://mangadex.org/titles
// @match         https://mangadex.org/featured
// @match         https://mangadex.org/search*
// @match         https://mangadex.org/*/manga/*
// @run-at        document-end
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/392096/MangaHideFollowedManga.user.js
// @updateURL https://update.greasyfork.org/scripts/392096/MangaHideFollowedManga.meta.js
// ==/UserScript==

var list = document.querySelectorAll("span.fa-star");
for (var item of list)
{
    if(item.nextElementSibling.title !== "You have not rated this title.")
    {
	    item.parentNode.parentNode.parentNode.remove();
        console.warn(item.parentNode.parentNode.previousElementSibling.childNodes[3].title + " - title got hidden");
    }
}
