// ==UserScript==
// @name         Spelpaus remover Svenskaspel SE
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes the spelpaus banner on top of the site svenskaspel.se
// @author       You
// @match        https://*.svenskaspel.se/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/376219/Spelpaus%20remover%20Svenskaspel%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/376219/Spelpaus%20remover%20Svenskaspel%20SE.meta.js
// ==/UserScript==

GM_addStyle(".balance-bar {display: none;} .corporate-info-gaming-responsibility {display: none;} .corporate-info-legal-info {display: none;} #main-content {padding-top: 44px;}");

setInterval(function() {
    window.location.reload();
}, 900000);
