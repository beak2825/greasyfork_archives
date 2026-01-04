// ==UserScript==
// @name         Starve.io Private Servers.
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  try to take over the world!
// @author       Armax Coder :)
// @match        https://starve.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387247/Starveio%20Private%20Servers.user.js
// @updateURL https://update.greasyfork.org/scripts/387247/Starveio%20Private%20Servers.meta.js
// ==/UserScript==


for (i = i7.Gv[0].length; i > 0; i--) {
    i7.Gv[0][i] = i7.Gv[0][i-1]
}
i7.Gv[0][0] = {nu: '99', m: 64, i:"mf2.starveserver.tk", p: 13355, a: "Europe 0", ssl:1}
javascript:(function(){ $.get("https://starve.sixserver.pl/info") .done(function( data ) { i7.Gv[0].unshift(data); i7.oL(0); $(".md-select").click(); $(".md-select ul li")[1].click() }) .fail(function(data) { alert("Can't connect to server") }); })();