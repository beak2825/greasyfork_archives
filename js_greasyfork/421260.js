// ==UserScript==
// @name         RYM: Wikipedia Search
// @description  add a link from the release page to search wikipedia for that release
// @match        https://rateyourmusic.com/release/*
// @match        http://rateyourmusic.com/release/*
// @version      1.0
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @namespace    https://greasyfork.org/users/734885
// @downloadURL https://update.greasyfork.org/scripts/421260/RYM%3A%20Wikipedia%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/421260/RYM%3A%20Wikipedia%20Search.meta.js
// ==/UserScript==

const td = '<td colspan="2" style="font-size:0.9em;font-weight:normal;color:var(--mono-5);">'

artist = $(".album_info a.artist").text();
title = $(".page_section .album_title")[0].childNodes[0].nodeValue.trim();

searchterms = encodeURIComponent(artist + " " + title);

data = '<th class="info_hdr">Wiki</th>'
data += td + '<a target="_blank" href="https://en.wikipedia.org/?search='+searchterms+'">Search Wikipedia for this release</a>' + '</td>'

$(".album_info tbody tr:last").after("<tr>" + data + "</tr>");