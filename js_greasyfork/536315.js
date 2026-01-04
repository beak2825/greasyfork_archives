// ==UserScript==
// @name         Guild Wars 69 - Electric Boogaloo - Elnaeth's RNG OmniPower Guild tool
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  Elnaeth's RNG guild helper tool - For tracking guild members and their activities.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=manarion.com
// @match        *://manarion.com/*
// @grant        none
// @author       Elnaeth
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536315/Guild%20Wars%2069%20-%20Electric%20Boogaloo%20-%20Elnaeth%27s%20RNG%20OmniPower%20Guild%20tool.user.js
// @updateURL https://update.greasyfork.org/scripts/536315/Guild%20Wars%2069%20-%20Electric%20Boogaloo%20-%20Elnaeth%27s%20RNG%20OmniPower%20Guild%20tool.meta.js
// ==/UserScript==


/*
 ======= Changelog =======
 v1.3.4
 Start tracking ethereal refinery

 v1.3.0 to v1.3.3
 Automated the pushing to do it once every 4 hours automatically

 v1.1.0 to v1.1.2
 Added in pushing the exports to a server in the cloud, owned by me 

 v1.0.1
 Added total action count to members

 v1.0.0
 Built and integrated into the guild page

*/
const BoostTypes = Object.freeze({
  BASE_SPELLPOWER: 1,
  BASE_WARD: 2,

  STAT_INTELLECT: 3,
  STAT_STAMINA: 4,
  STAT_FOCUS: 5,
  STAT_SPIRIT: 6,
  STAT_MANA: 7,

  FIRE_MASTERY: 10,
  WATER_MASTERY: 11,
  NATURE_MASTERY: 12,
});

const ItemTypes = Object.freeze({
  MANA_DUST: { id: 1, name: "Mana Dust", rarity: "common" },
  ELEMENTAL_SHARDS: { id: 2, name: "Elemental Shards", rarity: "common" },
  CODEX: { id: 3, name: "Codex", rarity: "epic" },

  FIRE_ESSENCE: { id: 4, name: "Fire Essence", rarity: "uncommon" },
  WATER_ESSENCE: { id: 5, name: "Water Essence", rarity: "uncommon" },
  NATURE_ESSENCE: { id: 6, name: "Nature Essence", rarity: "uncommon" },

  FISH: { id: 7, name: "Fish", rarity: "common" },
  WOOD: { id: 8, name: "Wood", rarity: "common" },
  IRON: { id: 9, name: "Iron", rarity: "common" },

  ASBESTOS: { id: 10, name: "Asbestos", rarity: "uncommon" },
  IRONBARK: { id: 11, name: "Ironbark", rarity: "uncommon" },
  FISH_SCALES: { id: 12, name: "Fish Scales", rarity: "uncommon" },

  TOME_OF_FIRE: { id: 13, name: "Tome of Fire", rarity: "uncommon" },
  TOME_OF_WATER: { id: 14, name: "Tome of Water", rarity: "uncommon" },
  TOME_OF_NATURE: { id: 15, name: "Tome of Nature", rarity: "uncommon" },

  TOME_OF_MANA_SHIELD: { id: 16, name: "Tome of Mana Shield", rarity: "epic" },

  ENCHANT_FIRE_RESISTANCE: { id: 17, name: "Formula: Fire Resistance", rarity: "epic" },
  ENCHANT_WATER_RESISTANCE: { id: 18, name: "Formula: Water Resistance", rarity: "epic" },
  ENCHANT_NATURE_RESISTANCE: { id: 19, name: "Formula: Nature Resistance", rarity: "epic" },
  ENCHANT_INFERNO: { id: 20, name: "Formula: Inferno", rarity: "epic" },
  ENCHANT_TIDAL_WRATH: { id: 21, name: "Formula: Tidal Wrath", rarity: "epic" },
  ENCHANT_WILDHEART: { id: 22, name: "Formula: Wildheart", rarity: "epic" },
  ENCHANT_INSIGHT: { id: 23, name: "Formula: Insight", rarity: "epic" },
  ENCHANT_BOUNTIFUL_HARVEST: { id: 24, name: "Formula: Bountiful Harvest", rarity: "epic" },
  ENCHANT_PROSPERITY: { id: 25, name: "Formula: Prosperity", rarity: "epic" },
  ENCHANT_FORTUNE: { id: 26, name: "Formula: Fortune", rarity: "epic" },
  ENCHANT_GROWTH: { id: 27, name: "Formula: Growth", rarity: "epic" },
  ENCHANT_VITALITY: { id: 28, name: "Formula: Vitality", rarity: "epic" },

  REAGENT_ELDERWOOD: { id: 29, name: "Elderwood", rarity: "uncommon" },
  REAGENT_LODESTONE: { id: 30, name: "Lodestone", rarity: "uncommon" },
  REAGENT_WHITE_PEARL: { id: 31, name: "White Pearl", rarity: "uncommon" },
  REAGENT_FOUR_LEAF_CLOVER: { id: 32, name: "Four Leaf Clover", rarity: "uncommon" },
  REAGENT_ENCHANTED_DROPLET: { id: 33, name: "Enchanted Droplet", rarity: "uncommon" },
  REAGENT_INFERNAL_HEART: { id: 34, name: "Infernal Heart", rarity: "uncommon" },

  ORB_OF_POWER: { id: 35, name: "Orb of Power", rarity: "rare" },
  ORB_OF_CHAOS: { id: 36, name: "Orb of Chaos", rarity: "epic" },
  ORB_OF_DIVINITY: { id: 37, name: "Orb of Divinity", rarity: "legendary" },

  SUNPETAL: { id: 39, name: "Sunpetal", rarity: "rare" },
  SAGEROOT: { id: 40, name: "Sageroot", rarity: "common" },
  BLOOMWELL: { id: 41, name: "Bloomwell", rarity: "common" },

  DONATED_EXPERIENCE: { id: 42, name: "Experience", rarity: "common" },
});

// function that formats huge numbers humanly-readable
const formatNumber = (num) => {
  if (num >= 1e15) return (num / 1e15).toFixed(2) + "Qa";
  if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(2) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(2) + "M";
  if (num >= 1e3) return (num / 1e3).toFixed(2) + "K";
  return (num/1).toFixed(2).toString();
};

// converts minutes to 1h 30m strings
const formatTime = (minutesTotal) => {
  const hours = Math.floor(minutesTotal / 60);
  const minutes = Math.floor(minutesTotal % 60);
  return `${hours}h ${minutes}m`;
};

(() => {
  "use strict";

  let uiInitialized = false;
  let isOnGuildPage = false;

  const scrapeData = () => {
    if (!manarion || !manarion.guild || !manarion.guild.Roster) return;

    const currentTime = new Date();

    const members = manarion.guild.Roster.map((member) => ({
      Timestamp: currentTime,

      ID: member.ID,

      Name: member.Name,

      BattleLevel: member.Level,
      MiningLevel: member.MiningLevel,
      FishingLevel: member.FishingLevel,
      WoodcuttingLevel: member.WoodcuttingLevel,

      TotalActions: member.TotalActions,
      LastFatigued: new Date(member.LastFatigue * 1000),
      ActionStreak: member.Active ? parseInt((currentTime - member.LastFatigue * 1000) / 3000) : parseInt((currentTime - member.LastFatigue * 1000) / 3000) * -1,

      Contributions: {
        Codex: member.Contributions[ItemTypes.CODEX.id] || 0,
        ManaDust: parseInt(member.Contributions[ItemTypes.MANA_DUST.id]) || 0,
        ElementalShards: parseInt(member.Contributions[ItemTypes.ELEMENTAL_SHARDS.id]) || 0,
        Fish: parseInt(member.Contributions[ItemTypes.FISH.id]) || 0,
        Wood: parseInt(member.Contributions[ItemTypes.WOOD.id]) || 0,
        Iron: parseInt(member.Contributions[ItemTypes.IRON.id]) || 0,
        Experience: parseInt(member.Contributions[ItemTypes.DONATED_EXPERIENCE.id]) || 0,
      },
    }));

    const buildings = {
      CouncilChamber: manarion.guild.Upgrades[1],
      CloakRoom: manarion.guild.Upgrades[2],
      NexusCrystal: manarion.guild.Upgrades[3],
      MagicalAccounting: manarion.guild.Upgrades[4],
      ManaConduit: manarion.guild.Upgrades[5],
      StudyRoom: manarion.guild.Upgrades[6],
      SleepingQuarters: manarion.guild.Upgrades[7],
      EtherealRefinery: manarion.guild.Upgrades[8],
    };

    const data = {
      GuildLevel: manarion.guild.Level,
      Buildings: buildings,
      Members: members.sort((a, b) => a.Name.localeCompare(b.Name)),
    };

    return data;
  };

  const uploadData = (data) => {
    const key = localStorage.getItem("elnaeth-guild-secret-key");
    if (!key) {
      alert("No secret key found in local storage. Please set it first, ask Elnaeth for instructions.");
      return;
    }

    // fetch("http://localhost:5000/api/snapshot/ingest", {
    fetch("https://manarion-guild-tracker.now-we-wait.com/api/snapshot/ingest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Secret-Token": key,
      },
      body: data,
    })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.text();
      })
      .then((data) => console.log("Snapshot submitted successfully:", data))
      .catch((err) => console.error("Failed to send snapshot:", err));
  };

  const createUI = () => {
    if (uiInitialized) return;
    uiInitialized = true;

    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Export members";
    toggleBtn.className =
      "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50   shrink-0  outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-input bg-background dark:bg-primary/30 shadow-xs hover:bg-accent dark:hover:bg-primary/50 hover:text-accent-foreground cursor-pointer h-9 px-4 py-2";

    const firstGuildButton = document.querySelector("main.grow > div > div.flex.flex-wrap > div > button");
    firstGuildButton.insertAdjacentElement("beforebegin", toggleBtn);

    toggleBtn.addEventListener("click", () => {
      const data = scrapeData();

      // export data as JSON
      const jsonData = JSON.stringify(data);

      // write JSON to clipboard
      navigator.clipboard.writeText(jsonData);

      const popupWindow = window.open("", null, "popup");
      buildTable(popupWindow.document, data);

      // also upload the data to the  cloud for safekeeping
      uploadData(jsonData);
    });
  };

  const wait = async (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  const pushToRoute = (path) => {
    console.log("navigating");
    history.pushState({}, "", path);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const fullAutoUpload = async () => {
    // upon entering this function, remember where the user was
    const currentPath = window.location.pathname;

    // then, redirect the user to the guild page, triggering the game to populate the guild roster with fresh data
    pushToRoute("/guild");

    await wait(1000);

    // scrape, serialize, upload
    const data = scrapeData();
    const json = JSON.stringify(data);
    uploadData(json);

    await wait(1000);

    // finally, back the way you came
    pushToRoute(currentPath);

    console.log("Full auto upload completed at", new Date().toLocaleString());
  };

  const buildTable = (document, data) => {
    // clear everything out
    document.body.innerHTML = "";

    document.body.innerHTML = `<style>
    table {
      width: 100%;
      border-collapse: collapse;
      font-family: sans-serif;
      font-size: 14px;
    }

    thead {
      background-color: #f4f4f4;
    }

    th, td {
      padding: 6px 8px;
      border: 1px solid #ddd;
      text-align: left;
    }

    tr:nth-child(even) {
      background-color: #fafafa;
    }

    tr:hover {
      background-color: #f1f1f1;
    }
  </style>`;

    const alertText = document.createElement("h3");
    alertText.textContent = "Data in the following table has also been exported as JSON and copied to your clipboard";
    document.body.appendChild(alertText);

    const wrapper = document.createElement("div");
    Object.assign(wrapper.style, {
      fontFamily: "arial",
      background: "white",
      border: "1px solid black",
    });

    const table = document.createElement("table");
    table.id = "guild-data-table";
    table.style.borderCollapse = "collapse";
    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          
          <th>Battle</th>
          <th>Experience</th>
          
          <th>Fishing</th>
          <th>Mining</th>
          <th>Woodcutting</th>

          <th>Codexes</th>
          <th>Mana dust</th>
          <th>Elemental shards</th>
          
          <th>Food</th>
          <th>Iron</th>
          <th>Wood</th>

          <th>Total actions</th>
          <th>Last fatigued at</th>
          <th>Action streak</th>

          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    wrapper.appendChild(table);
    document.body.appendChild(wrapper);

    const tbody = document.querySelector("#guild-data-table tbody");
    if (!tbody) return;

    tbody.innerHTML = "";
    data.Members.forEach((member) => {
      const row = document.createElement("tr");
      row.innerHTML = `
      <td>${member.Name}</td>
      
      <td>${member.BattleLevel}</td>
      <td>${member.Contributions.Experience}</td>
      
      <td>${member.FishingLevel}</td>
      <td>${member.MiningLevel}</td>
      <td>${member.WoodcuttingLevel}</td>
      
      <td>${member.Contributions.Codex}</td>
      <td>${member.Contributions.ManaDust}</td>
      <td>${member.Contributions.ElementalShards}</td>

      <td>${member.Contributions.Food}</td>
      <td>${member.Contributions.Iron}</td>
      <td>${member.Contributions.Wood}</td>

      <td>${member.TotalActions}</td>
      <td>${member.LastFatigued.toLocaleString()}</td>
      <td>${parseInt(member.ActionStreak)}</td>
      
      <td>${member.Timestamp.toLocaleString()}</td>
      `;

      tbody.appendChild(row);
    });
  };

  const isGuildPage = () => location.pathname.startsWith("/guild");

  const render = () => {
    createUI();
    uiInitialized = true;
  };

  const checkPathChange = () => {
    if (isGuildPage() && !isOnGuildPage) {
      isOnGuildPage = true;
      render();
    } else if (!isGuildPage() && isOnGuildPage) {
      // teardown
      isOnGuildPage = false;
      uiInitialized = false;
    }
  };

  // monitor path changes using MutationObserver
  const observePathChanges = () => {
    // react to DOM changes
    const observer = new MutationObserver(checkPathChange);
    observer.observe(document.body, { childList: true, subtree: true });
  };

  // start watching for route changes after page loaded
  window.addEventListener("load", () => {
    // first an initial check after waiting, then hook into the DOM watching for changes
    setTimeout(() => {
      checkPathChange();
      observePathChanges();
    }, 500);

    // check every 5 seconds to see if we are due for a full auto data upload
    let lastUpload = new Date();
    setInterval(async () => {
      if (!manarion || !manarion.player || !manarion.guild) return;

      const currentPlayer = manarion.player.Name.toLowerCase();
      const currentTime = new Date();

      // only upload once every 4 hours
      if (currentTime.getHours() % 4 !== 0) return;

      // only upload once per hour per timeslot per player
      if (currentTime.getHours() === lastUpload.getHours()) return;

      // elnaeth uploads at the top of every hour
      if (currentTime.getMinutes() === 0 && currentPlayer === "elnaeth") {
        await fullAutoUpload();
        lastUpload = currentTime;
      }

      // weeble uploads at 20 minutes past the hour
      if (currentTime.getMinutes() === 20 && currentPlayer === "weeble") {
        await fullAutoUpload();
        lastUpload = currentTime;
      }

      // lethalshot uploads at 40 minutes past the hour
      if (currentTime.getMinutes() === 40 && currentPlayer === "lethalshot") {
        await fullAutoUpload();
        lastUpload = currentTime;
      }
    }, 5000);
  });
})();

