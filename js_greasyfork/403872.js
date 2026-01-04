// ==UserScript==
// @name         Cracked Games / skip advertisement wait sript
// @namespace    shorturl_skip
// @encoding     utf-8
// @description  Skips shorturl link redirect wait time
// @match        http://crackedgamespc.xyz/*
// @grant        none
// @version 0.0.1.001
// @downloadURL https://update.greasyfork.org/scripts/403872/Cracked%20Games%20%20skip%20advertisement%20wait%20sript.user.js
// @updateURL https://update.greasyfork.org/scripts/403872/Cracked%20Games%20%20skip%20advertisement%20wait%20sript.meta.js
// ==/UserScript==

(function() {
    window.location.replace(decodeURIComponent('http'+window.location.href.split('?xurl=')[1]));
})();