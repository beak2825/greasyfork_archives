// ==UserScript==a
// @name         </> Kurt & Java Kule İyileştirici
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Kurt & Java
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424126/%3C%3E%20Kurt%20%20Java%20Kule%20%C4%B0yile%C5%9Ftirici.user.js
// @updateURL https://update.greasyfork.org/scripts/424126/%3C%3E%20Kurt%20%20Java%20Kule%20%C4%B0yile%C5%9Ftirici.meta.js
// ==/UserScript==

// Tier 1 den Yukarı Olursa Res Yersiniz
(function() {
    'use strict';
})();
setInterval(() => {
Game.currentGame.network.sendRpc({
    name: "CastSpell",
    spell : "HealTowersSpell",
    x: Math.round(Game.currentGame.ui.playerTick.position.x),
    y: Math.round(Game.currentGame.ui.playerTick.position.y),
    tier: 1
})
}, 2000)