// ==UserScript==
// @name        Melvor Loot Container
// @namespace   github.com/gmiclotte
// @version     0.1.3
// @description For monster drops and pickpocketing: shows drop rates, avg drops per kill, and current number owned.
// @author		GMiclotte
// @include		https://melvoridle.com/*
// @include		https://*.melvoridle.com/*
// @exclude		https://melvoridle.com/index.php
// @exclude		https://*.melvoridle.com/index.php
// @exclude		https://wiki.melvoridle.com/*
// @exclude		https://*.wiki.melvoridle.com/*
// @inject-into page
// @noframes
// @grant		none
// @downloadURL https://update.greasyfork.org/scripts/428711/Melvor%20Loot%20Container.user.js
// @updateURL https://update.greasyfork.org/scripts/428711/Melvor%20Loot%20Container.meta.js
// ==/UserScript==

((main) => {
    const script = document.createElement('script');
    script.textContent = `try { (${main})(); } catch (e) { console.log(e); }`;
    document.body.appendChild(script).parentNode.removeChild(script);
})(() => {
    window.mlc = {};

    mlc.tempContainer = (id, classNames, wrap) => {
        classNames = 'block block-rounded block-link-pop border-top border-4x ' + classNames;
        const container = ''
            + `<div class="${classNames}" style="overflow-x: auto;">`
            + `	<small id ="${id}">`
            + '	</small>'
            + '</div>';
        if (wrap) {
            return ''
                + '<div class="col-12">'
                + container
                + '</div>';
        }
        return container;
    }

    mlc.sortedLoot = {};

    mlc.drawEmptyLootTable = (container) => {
        $(`#${container}`).replaceWith(''
            + `<small id=${container}>`
            + '</small>'
        );
    }

    mlc.drawLootTable = () => {
        let name;
        let container;
        let loot;
        let id;
        let hasBones = false;
        let bones = undefined;
        let lootChance = 1;
        const isDungeon = combatManager.areaType === 'Dungeon';
        const monster = MONSTERS[combatManager.selectedMonster];
        let chanceToDouble = player.modifiers.combatLootDoubleChance / 100;
        if (npcID !== null) {
            container = 'pp-lootContainer';
            if (isDungeon || thievingNPC[npcID] === undefined) {
                drawEmptyLootTable(container);
                return;
            }
            name = thievingNPC[npcID].name;
            loot = thievingNPC[npcID].lootTable;
            id = `pp-${npcID}`;
            chanceToDouble = calculateChanceToDouble(Skills.Thieving, false, 0, 0, 0, false) / 100;
        } else if (combatManager.isInCombat) {
            container = 'cb-lootContainer';
            if (isDungeon || monster === undefined) {
                mlc.drawEmptyLootTable(container);
                return;
            }
            name = monster.name;
            loot = monster.lootTable;
            id = `cb-${combatManager.selectedMonster}`;
            bones = monster.bones;
            hasBones = bones !== undefined && bones !== null;
            if (monster.lootChance !== undefined) {
                lootChance = monster.lootChance / 100;
            }
        } else {
            return;
        }

        // sort the loot if it is not cached
        if (mlc.sortedLoot[id] === undefined) {
            console.log(`sorting ${name} loot`)
            let tmp = [];
            for (let i = 0; i < loot.length; i++) {
                const q = loot[i][2] === undefined ? 1 : loot[i][2];
                const item = items[loot[i][0]];
                if (item.dropTable !== undefined) {
                    let s = item.dropTable.map(x => x[1]).reduce((acc, x) => acc + x, 0);
                    for (let j = 0; j < item.dropTable.length; j++) {
                        tmp.push({
                            itemID: item.dropTable[j][0],
                            w: loot[i][1] * item.dropTable[j][1] / s,
                            qty: q * item.dropQty[j],
                        });
                    }
                } else {
                    tmp.push({
                        itemID: loot[i][0],
                        w: loot[i][1],
                        qty: q,
                    });
                }
            }
            tmp.sort(function (a, b) {
                return b.w - a.w;
            });
            mlc.sortedLoot[id] = tmp;
        }

        // compute values
        const lootTable = mlc.sortedLoot[id];
        if (lootTable.length === 0 && !hasBones) {
            // no loot to insert, so insert an empty placeholder and return
            mlc.drawEmptyLootTable(container);
            return;
        }
        const lootSize = lootTable.map(x => x.w).reduce((acc, x) => acc + x, 0) / lootChance;
        const rate = lootTable.map(x => x.w / lootSize * 100);
        const avg = lootTable.map(x => x.w / lootSize * (1 + x.qty) / 2 * (1 + chanceToDouble));
        const owned = lootTable.map(x => getBankQty(x.itemID));
        const media = lootTable.map(x => items[x.itemID].media);

        // make table
        let header = '<tr>';
        header += '<th scope="col"></th>';
        if (hasBones) {
            header += `<td><img class="skill-icon-xs mr-2" src="${items[bones].media}"></td>`;
        }
        media.forEach(img => {
            header += `<td><img class="skill-icon-xs mr-2" src="${img}"></td>`;
        });
        header += '</tr>';

        let bodyRate = '<tr>';
        bodyRate += '<th scope="col">drop %</th>';
        if (hasBones) {
            bodyRate += `<td/>`;
        }
        rate.forEach(x => {
            bodyRate += `<td>${x.toFixed(2)}</td>`;
        });
        bodyRate += '</tr>';

        let bodyAvg = '';
        bodyAvg += '<tr>';
        bodyAvg += `<th scope="col">avg/${npcID === null ? "kill" : "steal"}</th>`;
        if (hasBones) {
            bodyAvg += `<td/>`;
        }
        avg.forEach(x => {
            bodyAvg += `<td>${formatNumber(1 * x.toFixed(3))}</td>`;
        });
        bodyAvg += '</tr>';

        let bodyOwned = '<tr>';
        bodyOwned += '<th scope="col">owned</th>';
        if (hasBones) {
            bodyOwned += `<td>${getBankQty(bones)}</td>`;
        }
        owned.forEach(x => {
            bodyOwned += `<td>${formatNumber(x)}</td>`;
        });
        bodyOwned += '</tr>';

        // insert table
        $(`#${container}`).replaceWith(''
            + `<small id=${container}>`
            + '<table class="table table-borderless table-sm">'
            + '<thead>'
            + header
            + '</thead>'
            + '<tbody>'
            + bodyRate
            + bodyAvg
            + bodyOwned
            + '</tbody>'
            + '</table>'
            + '</small>'
        );
    }

    mlc.updateInterval = (interval) => {
        mlc.interval = interval;
        clearInterval(mlc.looper);
        mlc.looper = setInterval(mlc.drawLootTable, mlc.interval);
        console.log(`Started Melvor Loot Container with interval ${mlc.interval}`);
    }

    function startLootContainer() {
        $('#combat-area-selection').after(mlc.tempContainer('cb-lootContainer', 'border-combat', false))
        $('#thieving-food-container').parent().parent().parent().next().after(mlc.tempContainer('pp-lootContainer', 'border-thieving', true))
        mlc.updateInterval(500);

        ///////
        //log//
        ///////
        console.log("Melvor Loot Container Loaded");
    }

    function loadScript() {
        if (typeof confirmedLoaded !== typeof undefined && confirmedLoaded) {
            // Only load script after game has opened
            clearInterval(scriptLoader);
            startLootContainer();
        }
    }

    const scriptLoader = setInterval(loadScript, 200);
});