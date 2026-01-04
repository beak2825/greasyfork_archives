// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.tripping.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32582/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/32582/New%20Userscript.meta.js
// ==/UserScript==

document.getElementById("search-input").value="paris" ;

setTimeout(function(){ document.getElementById("search").click(); }, 2000);
setTimeout(function(){ $( ".search-without-dates" ).click() ; }, 3000);
