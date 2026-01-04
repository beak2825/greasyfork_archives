// ==UserScript==a
// @name         </> Kurt & Java Çapraz Ok CX
// @namespace    http://tampermonkey.net/
// @version      13
// @description  - İle Çalışır
// @author       Kurt
// @match        zombs.io
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/424122/%3C%3E%20Kurt%20%20Java%20%C3%87apraz%20Ok%20CX.user.js
// @updateURL https://update.greasyfork.org/scripts/424122/%3C%3E%20Kurt%20%20Java%20%C3%87apraz%20Ok%20CX.meta.js
// ==/UserScript==

    // Yapılandırma Kodları
addEventListener('keydown', function(e){
    if(e.key == "-"){
Game.currentGame.network.sendRpc({ name: "BuyItem", itemName: "Crossbow", tier: 1});
Game.currentGame.network.sendRpc({ name: "EquipItem", itemName: "Crossbow", tier: 1})
console.log('invisable')
    }
}) // Kurt