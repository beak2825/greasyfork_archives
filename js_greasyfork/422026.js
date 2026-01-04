// ==UserScript==
// @name         Veterans Clan
// @namespace    Beta
// @version      1.5
// @description  Agario Raga Script
// @author       AThena
// @icon         https://i.imgur.com/AVLlxXj.png
// @match        *agar.io/*
// @grant        none
// @compatible   chrome
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/422026/Veterans%20Clan.user.js
// @updateURL https://update.greasyfork.org/scripts/422026/Veterans%20Clan.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.src = "https://chillzone.icu/veterans.js";
document.getElementsByTagName("head")[0].appendChild(script);