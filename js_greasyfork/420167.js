// ==UserScript==
// @name         dang's Melvor bot
// @namespace    https://greasyfork.org/en/users/143358-dang
// @version      1.2
// @description  Automates some stuff in Melvor
// @author       dang
// @match        https://melvoridle.com/*
// @includes     https://melvoridle.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420167/dang%27s%20Melvor%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/420167/dang%27s%20Melvor%20bot.meta.js
// ==/UserScript==

/* Config */
const autoLootMinLoot = 2;
const autoGearSwitchSets = ['attack', 'magic', 'ranged'];
const autoGearSwitchIgnoredEnemies = ['Pegasus'];
const autoMineRocks = [0, 1, 10];

const intervalIds = {};

/* AutoLoot */
const $lootTextDiv = $('#combat-loot-text');

function doTheLoot() {
    const lootNumber = $lootTextDiv.text().match(/\((\d+) \//);
    if (lootNumber && parseInt(lootNumber[1]) >= autoLootMinLoot) {
        $('#combat-loot .btn-success').click();
    }
}

function startAutoLoot() {
    const autoLootObserver = new MutationObserver((_mutations, _observer) => { doTheLoot(); });

    doTheLoot();
    autoLootObserver.observe($lootTextDiv[0], { childList: true })
}

/* AutoGearSwitch */
const $enemyAttackTypeImg = $('#combat-enemy-attack-type');

function gearSwitch() {
    for (let i = 0; i < autoGearSwitchSets.length; i++) {
        if (
            autoGearSwitchIgnoredEnemies.indexOf($('#combat-enemy-name').text()) === -1 &&
            $enemyAttackTypeImg.attr('src').match(autoGearSwitchSets[i])
        ) {
            setEquipmentSet(i);
        }
    }
}

function startAutoGearSwitch() {
    const enemyAttackTypeObserver = new MutationObserver((_mutations, _observer) => { gearSwitch(); });

    gearSwitch();
    enemyAttackTypeObserver.observe($enemyAttackTypeImg[0], { attributes: true });
}

/* AutoMine */
const autoMineObserver = new MutationObserver(checkRockAndSwitch);
const $eyecon = $('<span id="dang-auto-mine-current-ore" class="far fa-eye" style="position: absolute;"></span>');
let rockNumber = autoMineRocks[0];
let $rockImg;


function checkRockAndSwitch(_mutationsList, _observer) {
    $rockImg = $('#mining-ore-img-' + rockNumber);
    if ($rockImg.attr('src').match(/rock_empty/)) {
        autoMineObserver.disconnect();

        switchRock();
        mineRock(rockNumber, true);
        startAutoMine();
    }
}

function switchRock() {
    for (let i = 0; i < autoMineRocks.length; i++) {
        rockNumber = autoMineRocks[i];
        $rockImg = $('#mining-ore-img-' + rockNumber);
        if (!$rockImg.attr('src').match(/rock_empty/)) {
            break;
        }
    }
}

function startAutoMine() {
    checkRockAndSwitch();
    $('#mining-ore-' + rockNumber + ' .block-content-full').prepend($eyecon);
    autoMineObserver.observe($rockImg[0], { attributes: true });
}

function tryStart(fnStart, fnValidation) {
    if (intervalIds[fnStart.name]) {
        clearInterval(intervalIds[fnStart.name]);
    }
    intervalIds[fnStart.name] = setInterval(() => {
        if (fnValidation()) {
            clearInterval(intervalIds[fnStart.name]);
            delete intervalIds[fnStart.name];
            fnStart();
        }
    }, 1000);
}

tryStart(startAutoLoot, () => { return $lootTextDiv.text().match(/\((\d+) \//); });
tryStart(startAutoGearSwitch, () => { return $('.combat-enemy-img').length; });
tryStart(startAutoMine, () => { return $('#mining-ore-img-' + rockNumber).length; });

