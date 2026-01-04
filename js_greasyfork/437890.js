// ==UserScript==
// @name         Auto breeding & mining
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  shiny shiny mining mining
// @author       ChaosOp
// @match        https://www.pokeclicker.com/*
// @match        http://idlegame.gitee.io/pokeclicker/*
// @icon         https://www.google.com/s2/favicons?domain=pokeclicker.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437890/Auto%20breeding%20%20mining.user.js
// @updateURL https://update.greasyfork.org/scripts/437890/Auto%20breeding%20%20mining.meta.js
// ==/UserScript==


(() => {
    'use strict';

    setInterval(async () => {
        await mine();
        await breed();
    }, 5000);

})();

async function mine() {
    return new Promise((resolve) => {

        if (App.game.underground.energy < App.game.underground.getMaxEnergy()) {
            ['Small', 'Medium', 'Large'].forEach((type) => {
                ItemList[`${type}Restore`].use();
            });
        }

        if (App.game.underground.energy) {
            let mine_body = get("#mineBody")[0];
            let i_count = mine_body.childElementCount;
            let j_count = mine_body.firstChild.childElementCount;

            for (let i of new Array(i_count).fill(0).map((e, i) => i)) {
                for (let j of new Array(j_count).fill(0).map((e, i) => i)) {
                    if (Mine.grid[i][j]) Mine.click(i, j, 5);
                }
            }
        }
        resolve();
    });

}

async function breed() {
    return new Promise((resolve) => {

        for (let slot of get("#eggList .eggSlot .clickable")) {
            slot.click();
        }

        for (let pokemon of Array.from(get("#breeding-pokemon .overlay")).filter((pokemon) => pokemon.parentNode.style.display == '')) {
            if (!App.game.breeding.hasFreeEggSlot()) break;
            pokemon.click();
        }

        resolve();
    });
}

function get(selector, ref = document) {
    return ref.querySelectorAll(selector);
}