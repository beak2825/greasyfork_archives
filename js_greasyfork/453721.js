// ==UserScript==
// @name         Silver-Pexer 2
// @namespace    https://silver-world.net/?silver-pexer
// @version      1.3
// @description  XP automatique sur le jeu Silver-World
// @author       Goodq
// @match        https://silver-world.net/*
// @icon         https://www.google.com/s2/favicons?domain=silver-world.net
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/453721/Silver-Pexer%202.user.js
// @updateURL https://update.greasyfork.org/scripts/453721/Silver-Pexer%202.meta.js
// ==/UserScript==

"use strict";

// src/utils/doThenWait.ts
function doThenWait(action, until) {
  return new Promise((resolve, reject) => {
    try {
      action();
    } catch (e) {
      reject(e);
    }
    const interval = setInterval(() => {
      if (until()) {
        clearInterval(interval);
        resolve();
      }
    }, config.waitInterval);
    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("waitUntilTextUpdated timeout"));
    }, config.waitTimeout);
  });
}

// src/utils/silverPexerSettings.ts
var Skills = /* @__PURE__ */ ((Skills2) => {
  Skills2["constitution"] = "constitution";
  Skills2["force"] = "force";
  Skills2["agilite"] = "agilite";
  Skills2["intelligence"] = "intelligence";
  return Skills2;
})(Skills || {});
var Shortcuts = {
  first: "0",
  second: "1",
  third: "2"
};
var SILVER_PEXER_SETTINGS_KEY = "silver-pexer-settings";
function setItem(key, value) {
  const settings = JSON.parse(localStorage.getItem(SILVER_PEXER_SETTINGS_KEY) ?? "{}");
  const newSettings = { ...settings };
  newSettings[key] = value;
  localStorage.setItem(SILVER_PEXER_SETTINGS_KEY, JSON.stringify(newSettings));
}
function getItem(key) {
  const existingSettings = JSON.parse(localStorage.getItem("silver-pexer-settings") ?? "{}");
  return existingSettings[key];
}
function setLevelUp(skill, value) {
  const levelUp = getItem("levelUp");
  const newLevelUp = { ...levelUp };
  newLevelUp[skill] = value;
  const sum = Object.values(newLevelUp).reduce((partialSum, s) => partialSum + +s, 0);
  if (sum > 5) {
    throw new Error("sum cannot be over 5");
  }
  setItem("levelUp", newLevelUp);
}
function getLevelUp(skill) {
  const levelUp = getItem("levelUp");
  return levelUp?.[skill];
}
function addMonsterOption(monsterOption) {
  const monsterOptions = getItem("monsterOptions") ?? [];
  const newMonsterOptions = [...monsterOptions.filter((mo) => mo.name !== monsterOption.name), monsterOption];
  setItem("monsterOptions", newMonsterOptions);
}
var SilverPexerSettings = {
  setItem,
  getItem,
  setLevelUp,
  getLevelUp,
  addMonsterOption
};

// src/plugins/autoAttack.ts
async function apply() {
  const monsterToAttack = SilverPexerSettings.getItem("monster");
  const attackWith = SilverPexerSettings.getItem("attack");
  if (!monsterToAttack || !attackWith) {
    return;
  }
  const paElement = document.querySelector(".label-pa");
  const paMatches = paElement.innerText.match(/[0-9]+/);
  if (paMatches) {
    const minPa = SilverPexerSettings.getItem("minPa") ?? config.minPa;
    if (+paMatches[0] <= +minPa) {
      return;
    }
  }
  const monsters = Array.from(document.querySelectorAll(".monster-card") ?? []);
  const monster = monsters.find((m) => m.innerHTML.includes(monsterToAttack));
  if (monster) {
    const rapidAttackButton = monster.querySelector(`img[src$="${attackWith}"]`);
    const initialHtml = monster.innerHTML;
    const monsterKilledOrInjured = () => !document.body.contains(monster) || initialHtml !== monster.innerHTML;
    monster.style.opacity = "0.8";
    await doThenWait(() => rapidAttackButton.click(), () => monsterKilledOrInjured());
    monster.style.opacity = "1";
  }
}
var autoAttack = {
  name: "auto-attack",
  apply,
  loop: true
};

// src/utils/sleep.ts
function sleep(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// src/plugins/autoHeal.ts
async function apply2() {
  const lifeGauge = document.querySelector(".carac-gauge > .life");
  if (!lifeGauge) {
    return;
  }
  const lifePercentText = lifeGauge.style.width;
  const groups = lifePercentText.match(/^([0-9]+)(.[0-9]+)?%$/);
  if (!groups) {
    return;
  }
  const lifePercent = +groups[1];
  if (lifePercent < 100) {
    const healIndex = +(SilverPexerSettings.getItem("heal") ?? NaN);
    if (isNaN(healIndex)) {
      return;
    }
    const quickShortcuts = document.querySelectorAll(".character-details .label-name a > img");
    const healShortcut = quickShortcuts[healIndex];
    healShortcut.click();
    await sleep(100);
  }
}
var autoHeal = {
  name: "auto-heal",
  apply: apply2,
  loop: true
};

// src/plugins/autoLevelUp.ts
var skillsMap = {
  ["constitution" /* constitution */]: "constitution" /* constitution */,
  ["force" /* force */]: "puissance",
  ["agilite" /* agilite */]: "agilite" /* agilite */,
  ["intelligence" /* intelligence */]: "intelligence" /* intelligence */
};
function apply3() {
  const levelUp = SilverPexerSettings.getItem("levelUp");
  if (!levelUp) {
    return;
  }
  let count = 0;
  for (const [key, value] of Object.entries(levelUp)) {
    const increaseButton = document.querySelector(`input.btn-success[onclick*="${skillsMap[key]}"]`);
    if (increaseButton) {
      for (let i = 0; i < +value; i++) {
        increaseButton.click();
        count++;
      }
    }
  }
  if (count === 5) {
    setTimeout(() => {
      const submitButton = document.querySelector('input[type="submit"].btn-action');
      submitButton.click();
    }, config.levelUpTimeout);
  }
}
var autoLevelUp = {
  name: "auto-levelup",
  apply: apply3
};

// src/plugins/autoLoot.ts
async function apply4() {
  const itemsOnGround = Array.from(document.querySelectorAll(".element_on_floor > img") ?? []).reverse();
  for (const item of itemsOnGround) {
    const parent = item.parentElement;
    if (!parent) {
      return;
    }
    const initialText = parent.innerText;
    const itemUpdated = () => initialText !== parent.innerText || !document.body.contains(item);
    await doThenWait(() => item.click(), itemUpdated);
  }
}
var autoLoot = {
  name: "auto-loot",
  apply: apply4,
  loop: true
};

// src/plugins/disableNotificationAnimation.ts
function apply5() {
  var style = document.createElement("style");
  style.innerHTML = `.marquee-text-text {
        -webkit-animation: none !important;
        -moz-animation: none !important;
        -o-animation: none !important;
        -ms-animation: none !important;
        animation: none !important;
    }`;
  document.head.appendChild(style);
}
var disableNotificationAnimation = {
  name: "disable-notification-animation",
  apply: apply5
};

// src/plugins/fixCharacter.ts
function apply6() {
  var style = document.createElement("style");
  style.innerHTML = `
    /* remove tabs scrolling */
    .items-container {
        overflow: visible !important;
        height: auto !important;
    }

    .item-description {
        overflow: visible !important;
        max-height: unset !important;
        min-height: 100px !important;
    }

    /* remove challenges scrolling */
    #tab-challenges > div {
        overflow: visible !important;
        height: auto !important;
    }
    `;
  document.head.appendChild(style);
}
var fixChallenges = {
  name: "fix-challenges",
  apply: apply6
};

// src/plugins/fixImagesSize.ts
function apply7() {
  var style = document.createElement("style");
  style.innerHTML = `
    img[src^="/storage/members/"] {
        max-width: 80px;
        max-height: 80px;
    }
    img[src^="/storage/items/"] {
        max-width: 70px;
        max-height: 70px;
    }
    `;
  document.head.appendChild(style);
}
var fixImagesSize = {
  name: "fix-images-size",
  apply: apply7
};

// src/plugins/fixShop.ts
function apply8() {
  var style = document.createElement("style");
  style.innerHTML = `
    #shopElements, #characterElements {
        overflow-y: visible !important;
        height: auto !important;
    }
    `;
  document.head.appendChild(style);
}
var fixShop = {
  name: "fix-shop",
  apply: apply8
};

// src/plugins/privatePlugins.ts
var privatePlugins = {
  map: [autoHeal, autoLoot, autoAttack],
  levelup: [autoLevelUp],
  guild: [],
  castle: [],
  shop: [fixImagesSize, fixShop],
  character: [fixChallenges],
  default: [disableNotificationAnimation]
};

// src/config.ts
var config = {
  minPa: "50",
  levelUpTimeout: 1500,
  loopInterval: 100,
  waitInterval: 10,
  waitTimeout: 2500,
  plugins: privatePlugins
};

// src/silverHtml.ts
var attacks = {
  attaque: "sword3.png",
  berserk: "sword4.png",
  sort1: "magic.png",
  sort2: "magic2.png"
};

// src/options/buildSelect.ts
function buildSelect(options, settingKey) {
  const select = document.createElement("select");
  select.style.maxWidth = "120px";
  const emptyOption = document.createElement("option");
  emptyOption.innerText = "-";
  emptyOption.value = `disable-auto-${settingKey}`;
  select.appendChild(emptyOption);
  const entries = Object.entries(options).sort();
  for (const [key, value] of entries) {
    const option = document.createElement("option");
    option.innerText = key;
    option.value = `${value}`;
    option.selected = value === SilverPexerSettings.getItem(settingKey);
    select.appendChild(option);
  }
  select.addEventListener("change", () => {
    SilverPexerSettings.setItem(settingKey, select.value);
  });
  return select;
}

// src/options/pickMonster.ts
function pickMonster() {
  let picking = true;
  const previousCursor = document.body.style.cursor;
  document.body.style.cursor = "crosshair";
  const monsters = Array.from(document.querySelectorAll(".monster"));
  for (const monster of monsters) {
    const bg = monster.style.backgroundColor;
    monster.addEventListener("mouseover", () => {
      if (!picking)
        return;
      monster.style.backgroundColor = "rgba(255, 255, 255, .3)";
    });
    monster.addEventListener("mouseout", () => {
      if (!picking)
        return;
      monster.style.backgroundColor = bg;
    });
    monster.addEventListener("click", (e) => {
      if (!picking)
        return;
      monster.style.backgroundColor = bg;
      const name = monster.innerText;
      const image = monster.querySelector("a > .img_container > img")?.getAttribute("src");
      if (!image) {
        alert(`Error monster without image: ${name}`);
      } else {
        SilverPexerSettings.addMonsterOption({ name, image });
        refreshAutoAttack();
      }
      picking = false;
      document.body.style.cursor = previousCursor;
      e.preventDefault();
    });
  }
}

// src/options/autoAttack.ts
function buildAutoAttackTable() {
  const autoAttackTable = document.createElement("table");
  autoAttackTable.innerHTML = `
    <tr>
        <td><label for="swp-monster-select">Monstre XP</label>&nbsp;</td>
        <td id="swp-monster"></td>
        <td>&nbsp;<a href="javascript:void(0)" id="monsters-pick">ajouter</a></td>
    </tr>
    <tr>
        <td><label for="swp-attack-select">Attaque</label>&nbsp;</td>
        <td id="swp-attack"></td>
        <td></td>
    </tr>
    <tr>
        <td><label for="swp-heal-select">Heal</label>&nbsp;</td>
        <td id="swp-heal"></td>
        <td></td>
    </tr>
    <tr>
        <td><label for="swp-minpa-input">Min PA</label>&nbsp;</td>
        <td><input id="swp-minpa-input" type="number" style="max-width: 10ch" /></td>
        <td></td>
    </tr>
    `;
  const monsterOptions = (SilverPexerSettings.getItem("monsterOptions") ?? []).reduce((accumulator, monster) => {
    return { ...accumulator, [monster.name]: monster.image };
  }, {});
  const monsterSelect = buildSelect(monsterOptions, "monster");
  monsterSelect.id = "swp-monster-select";
  autoAttackTable.querySelector("#swp-monster")?.appendChild(monsterSelect);
  const attackSelect = buildSelect(attacks, "attack");
  attackSelect.id = "swp-attack-select";
  autoAttackTable.querySelector("#swp-attack")?.appendChild(attackSelect);
  const healSelect = buildSelect(Shortcuts, "heal");
  healSelect.id = "swp-heal-select";
  autoAttackTable.querySelector("#swp-heal")?.appendChild(healSelect);
  const monsterPick = autoAttackTable.querySelector("#monsters-pick");
  monsterPick.addEventListener("click", pickMonster);
  const minPaInput = autoAttackTable.querySelector("#swp-minpa-input");
  if (minPaInput) {
    minPaInput.value = SilverPexerSettings.getItem("minPa") ?? config.minPa;
    minPaInput?.addEventListener("change", () => {
      SilverPexerSettings.setItem("minPa", minPaInput.value);
    });
  }
  return autoAttackTable;
}
function refreshAutoAttack() {
  const autoAttackTable = buildAutoAttackTable();
  document.querySelector("#swp-autoattack")?.replaceChildren(autoAttackTable);
}

// src/options/buildLevelUp.ts
function buildLevelUpTable() {
  const skills = Object.values(Skills);
  const table = document.createElement("table");
  for (const skill of skills) {
    const line = document.createElement("tr");
    line.innerHTML = `
        <td><label for="swp-level-up-${skill}-input">${skill}&nbsp;</label></td>
        <td id="swp-level-up-${skill}"></td>
        `;
    const input = document.createElement("input");
    input.id = `swp-level-up-${skill}-input`;
    input.type = "number";
    input.min = "0";
    input.max = "5";
    input.style.maxWidth = "10ch";
    input.value = SilverPexerSettings.getLevelUp(skill) ?? "0";
    input.addEventListener("change", () => {
      try {
        SilverPexerSettings.setLevelUp(skill, input.value);
      } catch (e) {
        input.value = (+input.value - 1).toString();
      }
    });
    line.querySelector(`td#swp-level-up-${skill}`)?.appendChild(input);
    table.appendChild(line);
  }
  return table;
}

// src/options/buildSettings.ts
function buildSettings() {
  const settingsDiv = document.createElement("div");
  settingsDiv.className = "card";
  settingsDiv.style.position = "absolute";
  settingsDiv.style.bottom = "57px";
  settingsDiv.style.right = "10px";
  settingsDiv.style.display = "none";
  settingsDiv.style.width = "270px";
  const settingsBody = document.createElement("div");
  settingsBody.className = "card-body";
  settingsBody.innerHTML = `
    <h5>SilverPexer Settings</h5>
    
    <h6 style="margin-top: 1em;">Auto Attack</h6>
    <div id="swp-autoattack"></div>
    
    <h6 style="margin-top: 1em;">Level Up</h6>
    <div id="swp-levelup"></div>

    <h6 style="margin-top: 1em;">Autres</h6>
    <ul>
        <li><a href="javascript:void(0)" id="monsters-empty">Reset liste monstres</a></li>
    </ul>
    `;
  const autoAttackTable = buildAutoAttackTable();
  settingsBody.querySelector("#swp-autoattack")?.appendChild(autoAttackTable);
  const levelUpTable = buildLevelUpTable();
  settingsBody.querySelector("#swp-levelup")?.appendChild(levelUpTable);
  settingsBody.querySelector("#monsters-empty")?.addEventListener("click", () => {
    const ok = confirm("Voulez-vous enlever tous les monstres ajout\xE9s ?");
    if (ok) {
      SilverPexerSettings.setItem("monsterOptions", void 0);
      SilverPexerSettings.setItem("monster", void 0);
      refreshAutoAttack();
    }
  });
  settingsDiv.appendChild(settingsBody);
  return settingsDiv;
}

// src/options/addOptions.ts
function addOptions() {
  const messengerFixed = document.querySelector("#MessengerFixedController");
  if (!messengerFixed) {
    return;
  }
  const settingsDiv = buildSettings();
  const settingsImage = document.createElement("img");
  settingsImage.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Icons8_flat_settings.svg/32px-Icons8_flat_settings.svg.png";
  settingsImage.className = "img-fluid";
  settingsImage.style.width = "24px";
  settingsImage.style.height = "24px";
  settingsImage.alt = "SilverPexer Settings";
  settingsImage.addEventListener("click", () => {
    if (settingsDiv.style.display === "none") {
      settingsDiv.style.display = "block";
    } else {
      settingsDiv.style.display = "none";
    }
  });
  const optionsDiv = document.createElement("div");
  optionsDiv.appendChild(settingsImage);
  const optionsListItem = document.createElement("li");
  optionsListItem.appendChild(optionsDiv);
  messengerFixed?.appendChild(settingsDiv);
  messengerFixed?.querySelector("ul")?.appendChild(optionsListItem);
}

// src/utils/loop.ts
async function loop(action, interval) {
  while (true) {
    try {
      await action();
    } catch (e) {
      console.error("loop error:", e);
    }
    await sleep(interval);
  }
}

// src/index.ts
(async function() {
  "use strict";
  addOptions();
  const groups = window.location.pathname.match(/^\/([^\/]+)(?:\/)?([^\/]+)?/);
  if (!groups) {
    console.warn("Could not parse pathname: ", window.location.pathname);
    return;
  }
  const [_path, page, _subPage] = groups;
  const plugins = [...config.plugins.default ?? [], ...config.plugins[page] ?? []];
  const oncePlugins = plugins.filter((p) => !p.loop);
  for (const plugin of oncePlugins) {
    await plugin.apply();
  }
  const loopPlugins = plugins.filter((p) => p.loop);
  await loop(async () => {
    for (const plugin of loopPlugins) {
      await plugin.apply();
    }
  }, config.loopInterval);
})().catch(console.error);
