// ==UserScript==
// @name         Auto Slayer Skip
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Automate easy slayer rerolls for Melvor Idle v0.18.2
// @author       Tristo7
// @match        https://*.melvoridle.com/*
// @exclude      https://wiki.melvoridle.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/420407/Auto%20Slayer%20Skip.user.js
// @updateURL https://update.greasyfork.org/scripts/420407/Auto%20Slayer%20Skip.meta.js
// ==/UserScript==

const getMonsterHtml = () => {
    const monsterList = MONSTERS.filter((monster, index) => getMonsterCombatLevel(index, true) <= SLAYER.task.Easy.maxLevel && monster.canSlayer);
    // sort alphanumeric ascending by monster name
    monsterList.sort((a,b) => {
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });
    let html = ``;
    monsterList.forEach(monster => html += `<option value="${monster.id}">${monster.name}</option>`);
    return html;
};

const autoSkip = () => {
    const mySwitch = document.getElementById("autoSkip");
    return mySwitch !== null && mySwitch.checked;
};

const getSkipHtml = () =>
`<span>AutoSkip</span> <input id="autoSkip" type="checkbox">
<select id="monsterSelect">
    ${getMonsterHtml()}
</select>`;

const loadHtml = setInterval(() => {
    if (!isLoaded) {
        return;
    }
    clearInterval(loadHtml);

    console.log("Auto Slayer Skip Adding...");
    document
        .getElementById("combat-slayer-task-container")
        .insertAdjacentHTML("afterbegin", getSkipHtml());
}, 100);

const slayerSkip = () => {
    if (!autoSkip() || !slayerTask[0])
        return;

    if (slayerTask[0].monsterID != document.getElementById("monsterSelect").value) {
        selectNewSlayerTask(0);
    }
}

setInterval(slayerSkip, 2000);