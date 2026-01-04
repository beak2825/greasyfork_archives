// ==UserScript==
// @name         隐藏dock栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏你的dock栏
// @author       禾呈讠成
// @match        https://hcyc.rthe.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412327/%E9%9A%90%E8%97%8Fdock%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/412327/%E9%9A%90%E8%97%8Fdock%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
document.getElementById("dock").style.display = "none";
})();