// ==UserScript==
// @name         T411 - Download torrents from nfo link on search page
// @name:fr      T411 - Télécharger les .torrent depuis le lien nfo des pages de recherche
// @namespace    https://greasyfork.org/fr/scripts/24002-t411-download-torrents-from-nfo-link-on-search-page
// @version      1.3.0
// @description  Simple script to download torrents directly from the nfo link on T411
// @description:fr  Ce script vous permet de télécharger des torrents directement depuis le lien nfo de la page de recherche / les listes de torrents.
// @author       Levi59
// @match        *://*.t411.li/torrents/search/*
// @match        *://*.t411.li/top/week/*
// @match        *://*.t411.li/top/today/*
// @match        *://*.t411.li/top/month/*
// @match        *://*.t411.li/my/bookmarks/*
// @match        *://*.t411.ai/torrents/search/*
// @match        *://*.t411.ai/top/week/*
// @match        *://*.t411.ai/top/today/*
// @match        *://*.t411.ai/top/month/*
// @match        *://*.t411.ai/my/bookmarks/*
// @grant        none   
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/24002/T411%20-%20Download%20torrents%20from%20nfo%20link%20on%20search%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/24002/T411%20-%20Download%20torrents%20from%20nfo%20link%20on%20search%20page.meta.js
// ==/UserScript==

var regex = /(\/torrents\/)nfo(\/\?id\=.+)/i;
var regClass = /ajax\ nfo/i;

var allLinks, thisLinks;
allLinks = document.evaluate(
    "//a[@class='ajax nfo']",
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);
for (var i = 0; i < allLinks.snapshotLength; i++) {
    amodifier = allLinks.snapshotItem(i);
    amodifier.appendChild = amodifier.appendChild(document.createTextNode("Télécharger"));
    //amodifier.setAttribute("STYLE","color:white'");
    amodifier.href = amodifier.href.replace(regex,"$1download$2");
    amodifier.className = amodifier.className.replace(regClass,"block");
}