// ==UserScript==
// @name Lumen Linkifier
// @description Make lumen urls clickable
// @namespace dd
// @match https://www.lumendatabase.org/notices/*
// @version 1.1
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/374291/Lumen%20Linkifier.user.js
// @updateURL https://update.greasyfork.org/scripts/374291/Lumen%20Linkifier.meta.js
// ==/UserScript==

var links = document.querySelectorAll("li [id^='infringing_url_']")
links.forEach(function(link) {
link.innerHTML = "<a href='"+link.innerHTML+"'>"+link.innerHTML+"</a>";
});