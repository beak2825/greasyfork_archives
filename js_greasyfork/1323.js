// ==UserScript==
// @name		AgileZen Improvements
// @version		1.1
// @description	Fixes janky rendering with story detail links and opens links to other sites in a new tab.
// @match		https://agilezen.com/*
// @require		http://code.jquery.com/jquery-latest.js
// @namespace https://greasyfork.org/users/1858
// @downloadURL https://update.greasyfork.org/scripts/1323/AgileZen%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/1323/AgileZen%20Improvements.meta.js
// ==/UserScript==

$("head").append("<style>body.board .story .story-header .story-ref-number a { padding-right:16px; }</style>");

$(document).on('click', "a[href^='http']:not([href*='"+location.hostname.replace("www.","")+"'])", function(event) {
    event.preventDefault();
    window.open(event.target.href, "_blank");
});
