// ==UserScript==
// @name         funkysouls
// @namespace    http://funkysouls.com/
// @version      0.1
// @description  remove link tag from posts' title
// @author       You
// @match        http://funkysouls.com/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/398095/funkysouls.user.js
// @updateURL https://update.greasyfork.org/scripts/398095/funkysouls.meta.js
// ==/UserScript==

$(function() {
	$("h2").each(function(i) {
        const txt = $(this).find("a").text();
        $(this).text(txt);
    });
})