// ==UserScript==
// @name         Cubecraft Forum Pink Tag
// @namespace    https://landviz.nl/
// @version      0.8496416
// @description  Get a pink name yay
// @author       You
// @match        https://www.cubecraft.net*
// @match        https://www.cubecraft.net/forums/*
// @match        https://www.cubecraft.net/forums*
// @match        https://www.cubecraft.net/threads/*
// @match        https://www.cubecraft.net/members*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38745/Cubecraft%20Forum%20Pink%20Tag.user.js
// @updateURL https://update.greasyfork.org/scripts/38745/Cubecraft%20Forum%20Pink%20Tag.meta.js
// ==/UserScript==


$("a:contains('"+$(".accountUsername span").html()+"')").css("color","#fa53fa");
