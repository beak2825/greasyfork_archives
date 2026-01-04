// ==UserScript==
// @name         Mass Disenchant
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://waifugame.com/cards*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waifugame.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461386/Mass%20Disenchant.user.js
// @updateURL https://update.greasyfork.org/scripts/461386/Mass%20Disenchant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let btn = document.getElementById("toggleMulti");
let btn2 = btn.cloneNode();
btn.before(btn2);
btn2.id = 'massDisenchant';
btn2.innerHTML = "<i class=\"fas fa-recycle\"></i> Mass Disenchant";
btn.parentElement.style.display = "flex";
btn.parentElement.style.flexDirection = "row";
btn.parentElement.style.justifyContent = "space-between";
btn2.onclick = function () {
    massDisenchant();
}

function massDisenchant() {
    document.getElementById("toggleMulti").click();
    let disenchantList = ["Common", "Uncommon", "Rare", "Epic", "Legendary"]
    for (let rarity of disenchantList) {
        let selector = 'a[data-card*="\\"rarityText\\":\\"' + rarity + '\\""][data-card*="\\"lock\\":false"]';
        let filtered = document.querySelectorAll(selector);
        for (let i = 0; i < filtered.length; i++) {
            filtered[i].click();
        }
    }
    document.getElementsByClassName("btn font-14 btn-block rounded-s bg-blue-dark text-center")[0].click();
    document.getElementsByClassName("btn close-menu btn-full btn-m bg-green-dark font-600 rounded-s continueText")[0].click();
}
})();