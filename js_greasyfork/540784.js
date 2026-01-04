// ==UserScript==
// @license MIT
// @name         PhotonGT's Prodigy Cheat
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prodigy Math cheat menu
// @author       PhotonGT
// @match        *://*.prodigygame.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=prodigygame.com
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540784/PhotonGT%27s%20Prodigy%20Cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/540784/PhotonGT%27s%20Prodigy%20Cheat.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const currentURL = window.location.href;
  if (!currentURL.startsWith("https://math.prodigygame.com/?launcher=true&code=")) return;

  // --- Menu Setup ---
  const menu = document.createElement('div');
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.background = 'rgba(0,0,0,0.8)';
  menu.style.color = '#fff';
  menu.style.padding = '10px';
  menu.style.borderRadius = '8px';
  menu.style.fontFamily = 'monospace';
  menu.style.zIndex = 9999;
  menu.style.width = '280px';
  menu.style.userSelect = 'none';
  menu.style.boxShadow = '0 0 10px #0ff';
  menu.tabIndex = 0; // allow input focus & backspace

  // Title (drag handle)
  const title = document.createElement('div');
  title.textContent = 'Prodigy Cheat Menu';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '8px';
  title.style.cursor = 'move';
  menu.appendChild(title);

  // --- Gold input ---
  const goldLabel = document.createElement('label');
  goldLabel.textContent = 'Gold Amount: ';
  goldLabel.htmlFor = 'goldInput';
  menu.appendChild(goldLabel);

  const goldInput = document.createElement('input');
  goldInput.type = 'text';
  goldInput.id = 'goldInput';
  goldInput.placeholder = 'e.g. 1000000';
  goldInput.style.width = '100%';
  goldInput.style.margin = '4px 0 10px';
  goldInput.style.padding = '4px';
  goldInput.style.borderRadius = '4px';
  goldInput.style.border = 'none';
  goldInput.style.fontSize = '14px';
  menu.appendChild(goldInput);

  const goldBtn = document.createElement('button');
  goldBtn.textContent = 'Set Gold';
  goldBtn.style.width = '100%';
  goldBtn.style.padding = '6px';
  goldBtn.style.border = 'none';
  goldBtn.style.borderRadius = '4px';
  goldBtn.style.backgroundColor = '#0ff';
  goldBtn.style.color = '#000';
  goldBtn.style.fontWeight = 'bold';
  goldBtn.style.cursor = 'pointer';
  goldBtn.onmouseover = () => goldBtn.style.backgroundColor = '#0cc';
  goldBtn.onmouseout = () => goldBtn.style.backgroundColor = '#0ff';
  menu.appendChild(goldBtn);

  goldBtn.onclick = () => {
    const raw = goldInput.value.replace(/,/g, '').trim();
    const amt = parseInt(raw);
    if (!isNaN(amt) && isFinite(amt)) {
      const gold = Math.min(amt, 10000000);
      if (typeof Boot !== 'undefined' &&
          Boot.prototype.game &&
          Boot.prototype.game._state &&
          Boot.prototype.game._state._current &&
          Boot.prototype.game._state._current.user &&
          Boot.prototype.game._state._current.user.source &&
          Boot.prototype.game._state._current.user.source.data) {
        Boot.prototype.game._state._current.user.source.data.gold = gold;
        Boot.prototype.game._state._current.user.source.addWin();
        alert(`Gold set to ${gold}!`);
      } else {
        alert('Game not ready yet, wait a sec.');
      }
    } else {
      alert('Put a valid number for gold, fam.');
    }
  };

  // --- WalkSpeed input ---
  const speedLabel = document.createElement('label');
  speedLabel.textContent = 'Walk Speed: ';
  speedLabel.htmlFor = 'speedInput';
  speedLabel.style.marginTop = '15px';
  menu.appendChild(speedLabel);

  const speedInput = document.createElement('input');
  speedInput.type = 'text';
  speedInput.id = 'speedInput';
  speedInput.placeholder = 'e.g. 1.5';
  speedInput.style.width = '100%';
  speedInput.style.margin = '4px 0 10px';
  speedInput.style.padding = '4px';
  speedInput.style.borderRadius = '4px';
  speedInput.style.border = 'none';
  speedInput.style.fontSize = '14px';
  menu.appendChild(speedInput);

  const speedBtn = document.createElement('button');
  speedBtn.textContent = 'Set Walk Speed';
  speedBtn.style.width = '100%';
  speedBtn.style.padding = '6px';
  speedBtn.style.border = 'none';
  speedBtn.style.borderRadius = '4px';
  speedBtn.style.backgroundColor = '#0ff';
  speedBtn.style.color = '#000';
  speedBtn.style.fontWeight = 'bold';
  speedBtn.style.cursor = 'pointer';
  speedBtn.onmouseover = () => speedBtn.style.backgroundColor = '#0cc';
  speedBtn.onmouseout = () => speedBtn.style.backgroundColor = '#0ff';
  menu.appendChild(speedBtn);

  speedBtn.onclick = () => {
    const val = parseFloat(speedInput.value.trim());
    if (!isNaN(val) && isFinite(val)) {
      if (typeof Boot !== 'undefined' &&
          Boot.prototype.game &&
          Boot.prototype.game._state &&
          Boot.prototype.game._state._current &&
          Boot.prototype.game._state._current.user) {
        Boot.prototype.game._state._current.user.walkSpeed = val;
        alert(`Walk Speed set to ${val}!`);
      } else {
        alert('Game not ready yet, wait a sec.');
      }
    } else {
      alert('Put a valid number for walk speed, bro.');
    }
  };

  // --- Unlock weapons & currency ---
  function unlockWeapons(currencyAmount = 9999, weaponAmount = 99) {
    function buildUnlockList(items, count = weaponAmount) {
      let e = [];
      items.forEach(i => e.push(`{"N":"${count}","ID":${i.ID}}`));
      return '[' + e.join(',') + ']';
    }

    try {
      const gameData = Boot.prototype.game._state._states.get("Boot")._gameData;
      const backpack = Boot.prototype.game._state._current.user.source.backpack;

      backpack.data.weapon = JSON.parse(buildUnlockList(gameData.weapon));
      backpack.data.item = JSON.parse(buildUnlockList(gameData.item));
      backpack.data.outfit = JSON.parse(buildUnlockList(gameData.outfit));
      backpack.data.relic = JSON.parse(buildUnlockList(gameData.relic));
      backpack.data.boots = JSON.parse(buildUnlockList(gameData.boots));
      backpack.data.hat = JSON.parse(buildUnlockList(gameData.hat));
      backpack.data.currency = JSON.parse(buildUnlockList(gameData.currency, currencyAmount));
      backpack.data.fossil = JSON.parse(buildUnlockList(gameData.fossil));
      backpack.data.follow = JSON.parse(buildUnlockList(gameData.follow));
      backpack.data.mount = JSON.parse(buildUnlockList(gameData.mount));
      backpack.data.key = JSON.parse(buildUnlockList(gameData.key));
      backpack.data.spellRelic = JSON.parse(buildUnlockList(gameData.spellRelic));

      Boot.prototype.game._state._current.user.source.house.data.items = {};
      let fillObj = { A: [], N: weaponAmount };
      gameData.dorm.forEach(dormItem => {
        Boot.prototype.game._state._current.user.source.house.data.items[dormItem.ID] = fillObj;
      });

      alert(`Unlocked all weapons/items to ${weaponAmount} and currency to ${currencyAmount}!`);
    } catch (e) {
      alert('Failed to unlock weapons, try again after game loads fully.');
      console.error(e);
    }
  }

  const unlockLabel = document.createElement('label');
  unlockLabel.textContent = 'Unlock Amount: ';
  unlockLabel.style.marginTop = '15px';
  menu.appendChild(unlockLabel);

  const unlockInput = document.createElement('input');
  unlockInput.type = 'text';
  unlockInput.id = 'unlockInput';
  unlockInput.placeholder = 'Weapons (default 99)';
  unlockInput.style.width = '100%';
  unlockInput.style.margin = '4px 0 5px';
  unlockInput.style.padding = '4px';
  unlockInput.style.borderRadius = '4px';
  unlockInput.style.border = 'none';
  unlockInput.style.fontSize = '14px';
  menu.appendChild(unlockInput);

  const currencyInput = document.createElement('input');
  currencyInput.type = 'text';
  currencyInput.id = 'currencyInput';
  currencyInput.placeholder = 'Currency (default 9999)';
  currencyInput.style.width = '100%';
  currencyInput.style.margin = '0 0 10px';
  currencyInput.style.padding = '4px';
  currencyInput.style.borderRadius = '4px';
  currencyInput.style.border = 'none';
  currencyInput.style.fontSize = '14px';
  menu.appendChild(currencyInput);

  const unlockBtn = document.createElement('button');
  unlockBtn.textContent = 'Unlock Weapons & Currency';
  unlockBtn.style.width = '100%';
  unlockBtn.style.padding = '6px';
  unlockBtn.style.border = 'none';
  unlockBtn.style.borderRadius = '4px';
  unlockBtn.style.backgroundColor = '#0ff';
  unlockBtn.style.color = '#000';
  unlockBtn.style.fontWeight = 'bold';
  unlockBtn.style.cursor = 'pointer';
  unlockBtn.onmouseover = () => unlockBtn.style.backgroundColor = '#0cc';
  unlockBtn.onmouseout = () => unlockBtn.style.backgroundColor = '#0ff';
  menu.appendChild(unlockBtn);

  unlockBtn.onclick = () => {
    let weapons = parseInt(unlockInput.value.trim());
    let currency = parseInt(currencyInput.value.trim());
    if (isNaN(weapons)) weapons = 99;
    if (isNaN(currency)) currency = 9999;
    unlockWeapons(currency, weapons);
  };

  // --- Walk Anywhere hack ---
  let walkAnywhereEnabled = false;
  const walkAnywhereBtn = document.createElement('button');
  walkAnywhereBtn.textContent = 'Toggle Walk Anywhere';
  walkAnywhereBtn.style.width = '100%';
  walkAnywhereBtn.style.padding = '6px';
  walkAnywhereBtn.style.border = 'none';
  walkAnywhereBtn.style.borderRadius = '4px';
  walkAnywhereBtn.style.backgroundColor = '#0ff';
  walkAnywhereBtn.style.color = '#000';
  walkAnywhereBtn.style.fontWeight = 'bold';
  walkAnywhereBtn.style.cursor = 'pointer';
  walkAnywhereBtn.style.marginTop = '10px';

  walkAnywhereBtn.onmouseover = () => walkAnywhereBtn.style.backgroundColor = '#0cc';
  walkAnywhereBtn.onmouseout = () => walkAnywhereBtn.style.backgroundColor = '#0ff';

  menu.appendChild(walkAnywhereBtn);

  walkAnywhereBtn.onclick = () => {
    try {
      const area = Boot.prototype.game._state._current.area;
      if (!walkAnywhereEnabled) {
        for (let i = 0; i < area.length; i++) {
          area[i] = Array(64).fill(1);
        }
        alert('Walk Anywhere ENABLED');
      } else {
        alert('Walk Anywhere DISABLED (reload to reset)');
      }
      walkAnywhereEnabled = !walkAnywhereEnabled;
    } catch (e) {
      alert('Failed to toggle Walk Anywhere, try after game fully loads.');
      console.error(e);
    }
  };

  // --- Pet unlocker ---
  const petUnlockBtn = document.createElement('button');
  petUnlockBtn.textContent = 'Unlock All Pets';
  petUnlockBtn.style.width = '100%';
  petUnlockBtn.style.padding = '6px';
  petUnlockBtn.style.border = 'none';
  petUnlockBtn.style.borderRadius = '4px';
  petUnlockBtn.style.backgroundColor = '#0ff';
  petUnlockBtn.style.color = '#000';
  petUnlockBtn.style.fontWeight = 'bold';
  petUnlockBtn.style.cursor = 'pointer';
  petUnlockBtn.style.marginTop = '10px';

  petUnlockBtn.onmouseover = () => petUnlockBtn.style.backgroundColor = '#0cc';
  petUnlockBtn.onmouseout = () => petUnlockBtn.style.backgroundColor = '#0ff';

  menu.appendChild(petUnlockBtn);

  petUnlockBtn.onclick = async () => {
    const user_id = Boot.prototype.game._state._current.user.source.userID;
    const levelStr = prompt("Made by rxzyx (rzx). Unlocking all pets, what level do you want them to be?");
    const level = parseInt(levelStr);
    if (!level || level <= 0) {
      alert("Unexpected Answer or invalid level");
      return;
    }
    try {
      const response = await fetch(`https://api.prodigygame.com/game-api/v1/character/${user_id}?userID=${user_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "authorization": sessionStorage.getItem("JWT_TOKEN")
        }
      });
      const charData = await response.json();

      function buildPetsData(includeDetails = true) {
        const petsData = [];
        Boot.prototype.game._state._states.get("Boot")._gameData.pet.forEach(pet => {
          if (includeDetails) {
            petsData.push(JSON.stringify({
              levelCaught: charData.data.level,
              ID: pet.ID,
              stars: 99999,
              catchDate: Date.now(),
              level: level,
              foreignSpells: [61, 67, 55, 58, 70, 81, 75, 78]
            }));
          } else {
            petsData.push(JSON.stringify({
              firstSeenDate: Date.now(),
              ID: pet.ID,
              timesBattled: 1,
              timesRescued: 1
            }));
          }
        });
        return `[${petsData.join(",")}]`;
      }

      charData.pets = JSON.parse(buildPetsData(true));
      charData.encounters.pets = JSON.parse(buildPetsData(false));

      await fetch(`https://api.prodigygame.com/game-api/v3/characters/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "authorization": sessionStorage.getItem("JWT_TOKEN"),
          "Accept": "application/json"
        },
        body: JSON.stringify({
          data: JSON.stringify(charData),
          userID: user_id
        })
      });

      alert("Pets unlocked! You will need to login again.");
      window.location.reload();

    } catch (e) {
      alert("Failed to unlock pets, try again later.");
      console.error(e);
    }
  };

  // --- Append menu ---
  document.body.appendChild(menu);

  // --- Dragging functionality ---
  let dragging = false, offsetX, offsetY;
  title.addEventListener('mousedown', e => {
    dragging = true;
    offsetX = e.clientX - menu.getBoundingClientRect().left;
    offsetY = e.clientY - menu.getBoundingClientRect().top;
    menu.style.transition = 'none';
  });
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => {
    if (dragging) {
      menu.style.left = (e.clientX - offsetX) + 'px';
      menu.style.top = (e.clientY - offsetY) + 'px';
      menu.style.right = 'auto';
      menu.style.bottom = 'auto';
    }
  });

})();
