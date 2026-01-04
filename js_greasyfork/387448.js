// ==UserScript==
// @name         Starve.io Better Private Servers.
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  try to take over the world!
// @author       Armax Coder :)
// @match        https://starve.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387448/Starveio%20Better%20Private%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/387448/Starveio%20Better%20Private%20Servers.meta.js
// ==/UserScript==

//NOTE:IF MESSAGE : Can't connect to server , THAT MEAN SERVER IS CLOSED WELL....

javascript:(function(){ $.get("https://starve.sixserver.pl/info") .done(function( data ) { i7.Gv[0].unshift(data); i7.oL(0); $(".md-select").click(); $(".md-select ul li")[1].click() }) .fail(function(data) { alert("Can't connect to server") }); })();

javascript:(function(){ $.get("https://mf2.starveserver.tk/info") .done(function( data ) { i7.Gv[0].unshift(data); i7.oL(0); $(".md-select").click(); $(".md-select ul li")[1].click() }) .fail(function(data) { alert("Can't connect to server") }); })();