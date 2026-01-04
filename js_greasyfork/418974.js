// ==UserScript==
// @name         Melvor drop chance
// @version      0.1.2
// @description  Adds drop chances to the view drops screen (percentage to 3 significant figures)
// @author       8992
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace    http://tampermonkey.net/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/418974/Melvor%20drop%20chance.user.js
// @updateURL https://update.greasyfork.org/scripts/418974/Melvor%20drop%20chance.meta.js
// ==/UserScript==

let loadCheckInterval = setInterval(() => {
  if (isLoaded) {
    clearInterval(loadCheckInterval);
    loadScript();
  }
}, 200);

function loadScript() {
  window.viewMonsterDrops = (monsterID) => {
    if (monsterID === null) monsterID = combatData.enemy.id;
    if (monsterID >= 0 && MONSTERS[monsterID].lootTable !== undefined) {
      let drops = "";
      let dropsOrdered = [];
      let totalWeight = MONSTERS[monsterID].lootTable.reduce((sum, a) => sum + a[1], 0);
      if (MONSTERS[monsterID].lootChance != undefined) {
        totalWeight = totalWeight * 100 / MONSTERS[monsterID].lootChance;
      }
      for (let i = 0; i < MONSTERS[monsterID].lootTable.length; i++) {
        dropsOrdered.push({
          itemID: MONSTERS[monsterID].lootTable[i][0],
          w: MONSTERS[monsterID].lootTable[i][1],
          qty: MONSTERS[monsterID].lootTable[i][2],
          chance: ` (${(MONSTERS[monsterID].lootTable[i][1] / totalWeight * 100).toPrecision(3)}%)`
        });
      }
      dropsOrdered.sort(function (a, b) {
        return b.w - a.w;
      });
      for (let i = 0; i < dropsOrdered.length; i++) {
        drops +=
          "Up to " +
          dropsOrdered[i].qty +
          ' x <img class="skill-icon-xs mr-2" src="' +
          getItemMedia(dropsOrdered[i].itemID) +
          '">' +
          items[dropsOrdered[i].itemID].name +
          dropsOrdered[i].chance +
          "<br>";
      }
      let bones = "";
      if (MONSTERS[monsterID].bones !== null)
        bones =
          'Always Drops:<br><small><img class="skill-icon-xs mr-2" src="' +
          getItemMedia(MONSTERS[monsterID].bones) +
          '">' +
          items[MONSTERS[monsterID].bones].name +
          "</small><br><br>";
      Swal.fire({
        title: MONSTERS[monsterID].name,
        html:
          bones +
          "Possible Extra Drops:<br><small>In order of most common to least common<br>" +
          drops,
        imageUrl: MONSTERS[monsterID].media,
        imageWidth: 64,
        imageHeight: 64,
        imageAlt: MONSTERS[monsterID].name,
      });
    }
  }

  window.viewItemContents = (itemID = -1) => {
    if (itemID < 0) itemID = selectedBankItem;
    let drops = "";
    let dropsOrdered = [];
    let totalWeight = items[itemID].dropTable.reduce((sum, a) => sum + a[1], 0);
    for (let i = 0; i < items[itemID].dropTable.length; i++) {
      dropsOrdered.push({
        itemID: items[itemID].dropTable[i][0],
        w: items[itemID].dropTable[i][1],
        id: i,
        chance: ` (${(items[itemID].dropTable[i][1] / totalWeight * 100).toPrecision(3)}%)`,
      });
    }
    dropsOrdered.sort(function (a, b) {
      return b.w - a.w;
    });
    for (let i = 0; i < dropsOrdered.length; i++) {
      drops +=
        "Up to " +
        numberWithCommas(items[itemID].dropQty[dropsOrdered[i].id]) +
        ' x <img class="skill-icon-xs mr-2" src="' +
        getItemMedia(dropsOrdered[i].itemID) +
        '">' +
        items[dropsOrdered[i].itemID].name +
        dropsOrdered[i].chance +
        "<br>";
    }
    Swal.fire({
      title: items[itemID].name,
      html: "Possible Items:<br><small>" + drops,
      imageUrl: getItemMedia(itemID),
      imageWidth: 64,
      imageHeight: 64,
      imageAlt: items[itemID].name,
    });
  }
}
