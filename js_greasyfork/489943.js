// ==UserScript==
// @name         Steam解锁不可描述游戏商店页
// @namespace    https://my.ksust.com/kstore.htm?aff=4326
// @version      1.1
// @description  Steam Store (Turn on mature content in some region)
// @author       Dogfight360
// @match        http*://store.steampowered.com/
// @icon         http://store.steampowered.com/favicon.ico
// @enable      true
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489943/Steam%E8%A7%A3%E9%94%81%E4%B8%8D%E5%8F%AF%E6%8F%8F%E8%BF%B0%E6%B8%B8%E6%88%8F%E5%95%86%E5%BA%97%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/489943/Steam%E8%A7%A3%E9%94%81%E4%B8%8D%E5%8F%AF%E6%8F%8F%E8%BF%B0%E6%B8%B8%E6%88%8F%E5%95%86%E5%BA%97%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    document.cookie="wants_mature_content=1"
    document.cookie="birthtime=22503171"
})();