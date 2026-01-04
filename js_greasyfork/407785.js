// ==UserScript==
// @name          Melvor CombatDropChance
// @namespace     http://tampermonkey.net
// @version       0.4
// @description   Displays percentage drop chance for monsters and chests on inspect. Accounts for monster loot table chance.
// @author        The Dream #4219
// @match         https://*.melvoridle.com/*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/407785/Melvor%20CombatDropChance.user.js
// @updateURL https://update.greasyfork.org/scripts/407785/Melvor%20CombatDropChance.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(main => {
    let script = document.createElement('script');
    script.textContent = `try {(${main})();} catch (e) {console.log(e);}`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {

    console.log('Melvor Combat Drop Chance Loaded.');

    function viewDankItemContents(itemID) {
        if (itemID === null || itemID === -1) {
            itemID = selectedBankItem;
        }
      
        let html = 'Possible Items:<br><small>';

        const item = items[itemID];

        const drops = item.dropTable.map(([itemID, weight, ...rest], id) => ({itemID, weight, id}));
        const totalWeight = drops.map(drop => drop.weight).reduce((prev, curr) => prev + curr, 0);

        drops.sort((a, b) => b.weight - a.weight);

        drops.forEach(drop => {
            const dropItem = items[drop.itemID];
            const dropChance = ((drop.weight / totalWeight) * 100).toFixed(2);

            html += `Up to ${numberWithCommas(item.dropQty[drop.id])}x <img class="skill-icon-xs mr-2" src="${dropItem.media}">${dropItem.name} - ${dropChance}%<br>`;
        });

        Swal.fire({
            title: item.name,
            html: html,
            imageUrl: item.media,
            imageWidth: 64,
            imageHeight: 64,
            imageAlt: item.name
        });
    }

    // [min, max) 
    // This is how it is in combat.js
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function viewDankMonsterDrops(monsterID) {
        /* ORIGINAL CODE located in banks.js */

        /* Code is functionally unmodified, albeit cleaned up a little. A drop chance has been added to the text. */
        if (monsterID === null || monsterID === -1) {
            monsterID = combatManager.enemy.data.id;
        }

        const monster = MONSTERS[monsterID];

        if (monsterID >= 0 && monster.lootTable !== undefined) {
            let html = '';
            const lootChance = (monster.lootChance || 100) / 100;  // lootChance is a percentage initially

            if (monster.bones !== null || monster.dropCoins !== null) {
                html += 'Always Drops:<br>';

                if (monster.bones !== null) {
                    const bones = items[monster.bones];
                    html += `<small><img class="skill-icon-xs mr-2" src="${bones.media}">${bones.name}</small><br>`;
                }
                if (monster.dropCoins !== null) {
                    const gold = randomNumber(monster.dropCoins[0], monster.dropCoins[1]);
                    const goldMedia = "assets/media/main/coins.svg";
                    html += `<small><img class="skill-icon-xs mr-2" src="${goldMedia}">${monster.dropCoins[0]} - ${monster.dropCoins[1]} GP</small><br>`;
                }
            }

            html += `<br>Possible Extra Drops (${lootChance * 100}%):<small><br>`

            // For some reason, the lootTable entries are arrays, map them into objects.
            const drops = monster.lootTable.map(([itemID, weight, quantity, ...rest]) => ({itemID, weight, quantity}));
            const totalWeight = drops.map(drop => drop.weight).reduce((prev, curr) => prev + curr, 0)

            drops.sort((a, b) => b.weight - a.weight);

            drops.forEach(drop => {
                const item = items[drop.itemID];
                const dropChance = ((drop.weight / totalWeight) * 100 * lootChance).toFixed(2);

                html += `Up to ${drop.quantity}x <img class="skill-icon-xs mr-2" src="${item.media}">${item.name} - ${dropChance}%<br>`;
            });

            Swal.fire({
                title: monster.name,
                html: html,
                imageUrl: monster.media,
                imageWidth: 64,
                imageHeight: 64,
                imageAlt: monster.name
            });
        }
    }

    window.viewMonsterDrops = viewDankMonsterDrops;
    window.viewItemContents = viewDankItemContents;
});