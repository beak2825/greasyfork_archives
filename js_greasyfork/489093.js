// ==UserScript==
// @name         Madelen2KG
// @namespace    https://www.cinelounge.org/
// @version      1.01
// @description  Browse KG from Madelen
// @author       tadanobu
// @match        https://madelen.ina.fr/content/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://ina.fr&size=64
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489093/Madelen2KG.user.js
// @updateURL https://update.greasyfork.org/scripts/489093/Madelen2KG.meta.js
// ==/UserScript==

$(document).ready(function()
{
    $(document.body).append('<div style="position:absolute;top:80px;right:95px;border:1px solid white;font-size:14px;padding:5px;"><a href="https://karagarga.in/browse.php?search=&quot;' + $(document).find("title").text().split(' |')[0] + '&quot;&search_type=torrent" target="_blank"><span style="color: #ffffff !important">KG</span></a> - <a href="https://www.imdb.com/find/?q=' + $(document).find("title").text().split(' |')[0] + '" target="_blank"><span style="color: #ffffff !important">IMDb</span></a></div>');
});