// ==UserScript==
// @name         Lordswm progress bars
// @namespace    https://github.com/spapanik
// @version      0.1.3
// @description  Add progress bars to lordswm
// @author       spapanik
// @match        https://www.lordswm.com/home.php
// @license      LGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/448536/Lordswm%20progress%20bars.user.js
// @updateURL https://update.greasyfork.org/scripts/448536/Lordswm%20progress%20bars.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const expArrays = {
    combat: [
      0, 1500, 4500, 15000, 32000, 90000, 190000, 400000, 860000, 1650000,
      3000000, 5000000, 8500000, 14500000, 25000000, 43000000, 70000000,
      108000000, 160000000, 230000000, 325000000, 500000000, 800000000,
    ],
    faction: [
      0, 20, 50, 90, 160, 280, 500, 900, 1600, 2900, 5300, 9600, 17300, 35000,
      70000,
    ],
    labourer: [
      0, 90, 180, 360, 720, 1500, 3000, 5000, 8000, 12000, 17000, 23000, 30000,
      38000, 47000, 57000, 70000, 90000, 120000,
    ],
    hunter: [
      0, 16, 60, 180, 400, 700, 1200, 2000, 3000, 4300, 6000, 8000, 10500,
      13100, 16000,
    ],
    mercenary: [
      0, 50, 120, 300, 600, 1000, 1500, 2200, 3000, 4000, 5500, 7800, 11000,
      14500, 18200, 22200,
    ],
    leader: [
      80, 180, 300, 440, 600, 780, 990, 1230, 1500, 2200, 3200, 4500, 7000,
      11000,
    ],
    watcher: [0, 60, 200, 450, 850, 1500, 2700, 4500, 7200, 10500],
    thief: [
      0, 50, 120, 240, 400, 600, 840, 1200, 2000, 3000, 4300, 6000, 8000, 10800,
      14000, 17600, 21600, 26000, 30800, 36600, 43600, 52000, 65000,
    ],
    ranger: [
      0, 100, 240, 480, 800, 1200, 1680, 2400, 4000, 6000, 8600, 12000, 16000,
      21600,
    ],
    commander: [
      0, 150, 350, 750, 1400, 2200, 3200, 4300, 5600, 7000, 8500, 10000, 11700,
      14500,
    ],
    gambler: [
      0, 10, 30, 60, 100, 150, 210, 280, 360, 450, 550, 660, 800, 1000, 1300,
      2000, 3000, 6000, 10000, 17000, 25000,
    ],
    adventurer: [0, 1600, 3600],
    smith: [0, 30, 80, 165, 310, 555, 970, 1680, 2885, 5770],
    enchanter: [0, 104, 588, 2200, 7000, 10000],
    enchanterSpecialisation: [
      0, 8, 29, 71, 155, 295, 505, 799, 1191, 1695, 6000, 12000,
    ],
  };

  const factionNames = [
    "Knight",
    "Necromancer",
    "Wizard",
    "Elf",
    "Barbarian",
    "Dark elf",
    "Demon",
    "Dwarf",
    "Tribal",
    "Pharaoh",
  ];

  const bareTerms = [
    "Hunters' guild",
    "Laborers' guild",
    "Gamblers' guild",
    "Thieves' guild",
    "Rangers' guild",
    "Mercenaries' guild",
    "Commanders' guild",
    "Watchers' guild",
    "Adventurers' guild",
    "Leaders' Guild",
    "Smiths' guild",
    "Enchanters' guild",
    "Weaponsmith",
    "Armorer",
    "Jewelcrafter",
  ];

  function getTagByText(tagName, text) {
    let tags = mainTr.getElementsByTagName(tagName);
    for (let tag of tags) {
      if (tag.textContent.includes(text)) {
        return tag;
      }
    }
  }

  function getActiveFunctionTag() {
    for (let faction of factionNames) {
      let activeFactionTag = getTagByText("b", `${faction}`);
      if (activeFactionTag !== undefined) {
        return activeFactionTag;
      }
    }
  }

  function addPercentageBar(tag, expArray, adjustment = 1) {
    let expTag = tag.nextSibling;
    let currentLevel = adjustment + parseInt(tag.innerText.split(":")[1], 10);
    let currentExp = parseFloat(expTag.textContent.replace(/[,()]/g, ""));
    if (currentExp === 0.0) {
      return;
    }
    let previousExp = expArray[currentLevel - 1];
    let nextExp = expArray[currentLevel];
    let percentage = (currentExp - previousExp) / (nextExp - previousExp);
    tag.nextSibling.nextSibling.innerHTML += `<br/>&nbsp;&nbsp;&nbsp;<progress value="${percentage}" max="1">
         </progress>`;
  }

  function replaceWithSpan(tag, term) {
    let regex = new RegExp(`${term}: (\\d+)`);
    tag.innerHTML = tag.innerHTML.replace(regex, `<span>${term}: $1</span>`);
  }

  a();
  let mainTd = document.getElementsByClassName("wbwhite")[0];
  let mainTr = mainTd.getElementsByTagName("tr")[1];
  let rightTable = mainTr.children[1];

  let hunterLevel = rightTable.getElementsByTagName("a")[0].textContent;
  rightTable.removeChild(rightTable.children[22]);
  rightTable.innerHTML = rightTable.innerHTML.replace(
    "Hunters' guild:",
    `Hunters' guild: ${hunterLevel}`,
  );
  let enchantersGuild = document.getElementById("home_2");
  enchantersGuild.removeChild(enchantersGuild.children[1]);
  enchantersGuild.children[0].nextSibling.remove();
  enchantersGuild.children[0].nextSibling.remove();

  for (let term of bareTerms) {
    replaceWithSpan(rightTable, term);
  }

  addPercentageBar(getActiveFunctionTag(), expArrays.faction);
  addPercentageBar(getTagByText("b", "Combat level"), expArrays.combat, 0);
  addPercentageBar(getTagByText("span", "Hunters' guild"), expArrays.hunter);
  addPercentageBar(getTagByText("span", "Thieves' guild"), expArrays.thief);
  addPercentageBar(getTagByText("span", "Rangers' guild"), expArrays.ranger);
  addPercentageBar(getTagByText("span", "Smiths' guild"), expArrays.smith);
  addPercentageBar(getTagByText("span", "Watchers' guild"), expArrays.watcher);
  addPercentageBar(getTagByText("span", "Laborers' guild"), expArrays.labourer);
  addPercentageBar(getTagByText("span", "Gamblers' guild"), expArrays.gambler);
  addPercentageBar(
    getTagByText("span", "Mercenaries' guild"),
    expArrays.mercenary,
  );
  addPercentageBar(
    getTagByText("span", "Commanders' guild"),
    expArrays.commander,
  );
  addPercentageBar(
    getTagByText("span", "Adventurers' guild"),
    expArrays.adventurer,
  );
  addPercentageBar(getTagByText("span", "Leaders' Guild"), expArrays.leader);
  addPercentageBar(
    getTagByText("span", "Enchanters' guild"),
    expArrays.enchanter,
  );
  addPercentageBar(
    getTagByText("span", "Weaponsmith"),
    expArrays.enchanterSpecialisation,
  );
  addPercentageBar(
    getTagByText("span", "Armorer"),
    expArrays.enchanterSpecialisation,
  );
  addPercentageBar(
    getTagByText("span", "Jewelcrafter"),
    expArrays.enchanterSpecialisation,
  );
})();
