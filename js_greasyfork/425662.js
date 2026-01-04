// ==UserScript==
// @name         </> Kurt & Java Haxball Konum
// @version      0.5
// @description  Kurt & Java
// @author       Kurt
// @match        https://www.haxball.com/*
// @match        https://html5.haxball.com/*
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/425662/%3C%3E%20Kurt%20%20Java%20Haxball%20Konum.user.js
// @updateURL https://update.greasyfork.org/scripts/425662/%3C%3E%20Kurt%20%20Java%20Haxball%20Konum.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.querySelectorAll("[class='rightbar']")[0].remove()
}, false);
document.querySelectorAll("[href='game.css']")[0].remove();


var cssTxt  = GM_getResourceText ("IMPORTED_CSS");
console.log(cssTxt);
GM_addStyle (cssTxt);
localStorage.geo = '{"lat":49.8,"lon":6.1296,"code":"EU"}';
localStorage.geo_override = '{"lat":49.8,"lon":6.1296,"code":"EU"}';
