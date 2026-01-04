// ==UserScript==
// @name         ๖ۣۜİntikam Reis༄☠𝕋𝕠𝕨𝕖𝕣 ℍ𝕖𝕒𝕝
// @namespace    http://tampermonkey.net/
// @version      Small
// @description  DK
// @author       İntikam...
// @match        http://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390259/%E0%B9%96%DB%A3%DB%9C%C4%B0ntikam%20Reis%E0%BC%84%E2%98%A0%F0%9D%95%8B%F0%9D%95%A0%F0%9D%95%A8%F0%9D%95%96%F0%9D%95%A3%20%E2%84%8D%F0%9D%95%96%F0%9D%95%92%F0%9D%95%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/390259/%E0%B9%96%DB%A3%DB%9C%C4%B0ntikam%20Reis%E0%BC%84%E2%98%A0%F0%9D%95%8B%F0%9D%95%A0%F0%9D%95%A8%F0%9D%95%96%F0%9D%95%A3%20%E2%84%8D%F0%9D%95%96%F0%9D%95%92%F0%9D%95%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
setInterval(() => {
Game.currentGame.network.sendRpc({
    name: "CastSpell",
    spell : "HealTowersSpell",
    x: Math.round(Game.currentGame.ui.playerTick.position.x),
    y: Math.round(Game.currentGame.ui.playerTick.position.y),
    tier: 1
})
12}, 2000)