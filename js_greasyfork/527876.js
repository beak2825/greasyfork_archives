// ==UserScript==
// @name         LoLdle Auto Solver
// @namespace    https://loldle.net/
// @version      1.0.0
// @description  Auto-complete loldle.net games with one key (ALT + S)
// @author       dekku
// @license      MIT
// @match        https://loldle.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=loldle.net
// @downloadURL https://update.greasyfork.org/scripts/527876/LoLdle%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/527876/LoLdle%20Auto%20Solver.meta.js
// ==/UserScript==

(async function () {
  "use strict";

  async function getChampions() {
    const localData = localStorage.getItem("lolChampions");
    if (localData) return JSON.parse(localData);

    try {
      const versionResponse = await fetch("https://ddragon.leagueoflegends.com/api/versions.json");
      const versions = await versionResponse.json();
      const latestVersion = versions[0];

      const response = await fetch(`https://ddragon.leagueoflegends.com/cdn/${latestVersion}/data/en_US/champion.json`);
      const jsonData = await response.json();

      const champions = Object.values(jsonData.data).map(champ => champ.name);
      localStorage.setItem("lolChampions", JSON.stringify(champions));
      return champions;
    } catch (error) {
      console.error("Error getting champions:", error);
      return [];
    }
  }

  async function enterChampions() {
    const champions = await getChampions();
    const input = document.querySelector('input[placeholder="Type champion name ..."]');
    if (!input) return;

    for (const champion of champions) {
      input.value = champion;
      input.dispatchEvent(new Event("input", { bubbles: true }));

      input.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", code: "Enter", keyCode: 13, which: 13, bubbles: true }),
      );
      await new Promise(resolve => setTimeout(resolve, 10));
    }
  }

  document.addEventListener("keydown", event => {
    if (event.altKey && event.key === "s") {
      enterChampions();
    }
  });
})();
