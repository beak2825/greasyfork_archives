// ==UserScript==
// @name            Select Easy Slayer Task
// @version         1.0.5
// @license         MIT
// @description     A selector listing all easy slayer tasks is added to the slayer task window. Allows you to choose a desired task.
// @author          Tristan-Autin
// @match           https://*.melvoridle.com/*
// @exclude         https://wiki.melvoridle.com*
// @namespace       https://greasyfork.org/en/users/929271
// @downloadURL https://update.greasyfork.org/scripts/447035/Select%20Easy%20Slayer%20Task.user.js
// @updateURL https://update.greasyfork.org/scripts/447035/Select%20Easy%20Slayer%20Task.meta.js
// ==/UserScript==

function EasySlayerTaskChoice() {
  // Monster IDs of Easy Slayer tasks.
  const MONSTER_IDS = [
    37, 111, 5, 35, 38, 67, 36, 81, 71, 4, 28, 82, 0, 59, 68, 75, 8, 14, 1, 9,
    70, 3, 72, 6, 12, 60, 13, 29, 10, 18, 24, 76, 20, 62, 69,
  ];
  const MONSTER_SLAYER_IDS = [18, 20];
  let ACTUAL_MONSTER_ID;

  let slayerText = document.getElementById("combat-slayer-task-name");
  let autoReload = false;

  let easySlayerTaskContainer = document.createElement("div");
  easySlayerTaskContainer.classList.add(...["mt-3", "mb-3", "w-100"]);

  let select = document.createElement("button");
  let optionsContainer = document.createElement("div");
  select.classList.add(...["btn", "btn-secondary", "dropdown-toggle", "w-100"]);
  select.setAttribute("data-toggle", "dropdown");
  select.innerHTML = "Choose your task";
  optionsContainer.classList.add(
    ...["dropdown-menu", "font-size-sm", "overflow-y-auto"]
  );
  optionsContainer.setAttribute(
    "style",
    "max-height: 60vh;z-index: 9999; min-width: 20rem;"
  );
  let reloadBtn = document.createElement("button");
  reloadBtn.classList.add(
    ...["btn", "btn-secondary", "w-100", "mt-3", "d-none"]
  );

  let enableReload = document.createElement("button");
  enableReload.classList.add(
    ...["btn", "btn-secondary", "mt-3", "w-100", "d-none", "btn-danger"]
  );
  enableReload.innerHTML = "Enable auto reload : false";
  enableReload.addEventListener("click", () => setEnableAutoReload());

  reloadBtn.innerHTML = "Reload";
  reloadBtn.addEventListener("click", () => setNewEasyTask(ACTUAL_MONSTER_ID));

  easySlayerTaskContainer.append(
    select,
    optionsContainer,
    reloadBtn,
    enableReload
  );

  combatManager.slayerTask.extendContainer.appendChild(easySlayerTaskContainer);

  for (let i = 0; i < MONSTER_IDS.length; i++) {
    let MONSTER_NAME = getMonsterName(MONSTER_IDS[i]);
    getButton(MONSTER_IDS[i], MONSTER_NAME);
  }

  function getButton(monsterId, monsterName) {
    let option = document.createElement("div");
    option.classList.add(
      ...["dropdown-item", "bank-defaultItemTab-0", "pointer-enabled", "d-flex"]
    );
    option.addEventListener("click", () => setNewEasyTask(monsterId));
    optionsContainer.appendChild(option);

    let img = document.createElement("img");
    img.setAttribute(
      "src",
      `https://cdn.melvor.net/core/v018/${MONSTERS[monsterId].media}`
    );
    img.classList.add(...["skill-icon-xs"]);
    option.appendChild(img);

    let p = document.createElement("p");
    p.innerHTML = monsterName;
    p.classList.add(...["mb-0", "ml-3", "align-self-center"]);
    option.appendChild(p);
    return option;
  }

  function setEnableAutoReload() {
    autoReload = !autoReload;
    if (autoReload) {
      enableReload.classList.remove("btn-danger");
      enableReload.classList.add(...["btn-success"]);
      enableReload.innerHTML = "Enable auto reload : true";
    } else {
      enableReload.classList.remove("btn-success");
      enableReload.classList.add(...["btn-danger"]);
      enableReload.innerHTML = "Enable auto reload : false";
    }
  }

  slayerText.addEventListener(
    "DOMNodeInserted",
    function (event) {
      if (autoReload) {
        var numberOfTask = slayerText.innerHTML
          .replace(/^\D+/g, "")
          .slice(0, 2);
        if (numberOfTask < 5) {
          setNewEasyTask(ACTUAL_MONSTER_ID);
        }
      }
    },
    false
  );

  function setNewEasyTask(id) {
    ACTUAL_MONSTER_ID = id;
    const slayerShopItem = 5;
    const bankItems = bank;
    const isSlayerShopItemInBank = bankItems.some(
      (item) => item.id === slayerShopItem
    );
    if (
      id == MONSTER_SLAYER_IDS[0] ||
      (id == MONSTER_SLAYER_IDS[1] && isSlayerShopItemInBank != true)
    ) {
      notifyPlayer(
        CONSTANTS.skill.Slayer,
        "You can't fight this monster",
        "danger"
      );
      return;
    } else if (combatManager.slayerTask.monster.id == id) {
      combatManager.slayerTask.selectTask(0, false, false);
      while (combatManager.slayerTask.monster.id != id) {
        combatManager.slayerTask.selectTask(0, false, false);
        reloadBtn.classList.remove("d-none");
        enableReload.classList.remove("d-none");
      }
    }

    while (combatManager.slayerTask.monster.id != id) {
      combatManager.slayerTask.selectTask(0, false, false);
      reloadBtn.classList.remove("d-none");
      enableReload.classList.remove("d-none");
    }
  }
}

// Injecting the script when possible
(() => {
  function loadScript() {
    // Load script after the actual Melvor game has loaded
    if (typeof isLoaded !== typeof undefined && isLoaded) {
      clearInterval(scriptLoader);

      const scriptElem = document.createElement("script");
      scriptElem.textContent = `try {(${EasySlayerTaskChoice})();} catch (e) {console.log(e);}`;
      document.body.appendChild(scriptElem).parentNode.removeChild(scriptElem);
    }
  }

  const scriptLoader = setInterval(loadScript, 5000);
})();
