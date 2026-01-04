// ==UserScript==
// @name         hdarkzone adblock
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match      https://www.hdarkzone.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/388247/hdarkzone%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/388247/hdarkzone%20adblock.meta.js
// ==/UserScript==

//setTimeout(function(){if (document.getElementById("p9fe")){document.getElementById("p9fe").remove();} }, 1000);
document.getElementById("p9fe").remove();
//document.getElementById("#p9fe").outerHTML = "";
//$("#p9fe").hide();
