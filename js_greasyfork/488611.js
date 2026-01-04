// ==UserScript==
// @name         Codex Keysystem Bypass
// @namespace    http://tampermonkey.net/
// @version      1
// @license      MIT
// @description  easy to make only take 3 mins to make
// @match        https://linkvertise.com/654032/codex-gateway-2?o=sharing
// @match        https://loot-links.com/s?mK6Z
// @match        https://loot-link.com/s?oiQO
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488611/Codex%20Keysystem%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/488611/Codex%20Keysystem%20Bypass.meta.js
// ==/UserScript==

(function() {
    var currentURL = window.location.href;
    
    if (currentURL.includes("linkvertise.com/654032/codex-gateway-2?o=sharing") || 
        currentURL.includes("loot-links.com/s?mK6Z") || 
        currentURL.includes("loot-link.com/s?oiQO")) {
        window.location.href = "https://mobile.codex.lol/";
    }
})();
