// ==UserScript==
// @name         GGn Profile Stats v2
// @description  update api on line 61 - adds pet and mining stats to profile.
// @namespace    https://gazellegames.net/ggn-profile-stats-v2
// @version      1.0.8
// @match        https://gazellegames.net/user.php?id=*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @icon         https://gazellegames.net/favicon.ico
// @author       mactruck
// @supportURL   https://github.com/DiRTYMacTruCK
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537360/GGn%20Profile%20Stats%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/537360/GGn%20Profile%20Stats%20v2.meta.js
// ==/UserScript==

(function() {
  'use strict';

  async function fetchData(url, apiKey) {
    const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    if (!response.ok) throw Object.assign(new Error(`HTTP ${response.status}`), { status: response.status });
    const data = await response.json();
    if (data?.status !== 'success') throw new Error(data?.error || 'API request failed');
    return data;
  }

  function extractUserID() {
    const selectors = [
      '#nav_userinfo a.username',
      '#nav_userinfo a[href*="user.php?id="]',
      'a[href*="user.php?id="]',
      'a[href*="user.php"]',
      'h2 a.username',
      'a.username'
    ];
    for (const selector of selectors) {
      const link = document.querySelector(selector);
      if (link) {
        const id = new URLSearchParams(new URL(link.href, window.location.href).search).get('id');
        if (id) {
          safeGM('setValue', 'you', id);
          return id;
        }
      }
    }
    return null;
  }

  async function getOwnUserID() {
    return new Promise((resolve) => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve(extractUserID());
      } else {
        window.addEventListener('DOMContentLoaded', () => resolve(extractUserID()), { once: true });
      }
    });
  }

  // Replace this with your actual API key
  const apiKey = "api_key_here"; // 

  function safeGM(method, ...args) {
    if (typeof GM !== 'undefined' && typeof GM[method] === 'function') {
      return GM[method](...args).catch(() => {});
    }
    return Promise.resolve();
  }

  const theirUserID = new URLSearchParams(location.search).get('id');
  if (!theirUserID) return;

  (async () => {
    let ownUserID = typeof GM?.getValue === 'function' ? await safeGM('getValue', 'you').then(id => id || getOwnUserID()) : await getOwnUserID();
    if (!ownUserID || theirUserID !== ownUserID) return;

    await Promise.all([
      proceedWithPetLeveling(theirUserID),
      proceedWithMiningStats(theirUserID, ownUserID)
    ]);
  })();

  async function proceedWithPetLeveling(userId) {
    const equipEndpoint = "https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
    const options = {
      method: "GET",
      mode: "same-origin",
      credentials: "omit",
      redirect: "error",
      referrerPolicy: "no-referrer",
      headers: { "X-API-Key": apiKey },
    };

    let equipment;
    try {
      equipment = await (await fetch(equipEndpoint, options)).json();
      if (equipment.status !== "success") {
        if (equipment.status === 401) safeGM('deleteValue', "apiKey");
        return;
      }
    } catch {
      return;
    }

    const userlogEndpoint = `https://gazellegames.net/api.php?request=userlog&search=dropped`;
    let userLog;
    try {
      userLog = await (await fetch(userlogEndpoint, options)).json();
      if (userLog.status !== "success") {
        if (equipment.status === 401) safeGM('deleteValue', "apiKey");
        return;
      }
    } catch {
      return;
    }

    const levelingPetIDs = new Set([
      "2509", "2510", "2511", "2512", "2513", "2514", "2515", "2521",
      "2522", "2523", "2524", "2525", "2529", "2583", "2927", "2928",
      "2929", "2933", "3215", "3216", "3237", "3322", "3323", "3324",
      "3369", "3370", "3371", "3373",
    ]);

    const pets = equipment.response
      .filter(equip => equip.item.equipType === "18" && (levelingPetIDs.has(equip.itemid) || equip.experience > 0))
      .map(equip => ({
        name: equip.item.name,
        xp: parseInt(equip.experience, 10),
        lv: parseInt(equip.level, 10),
        id: String(equip.itemid),
        slot: parseInt(equip.slotid, 10),
      }))
      .sort((a, b) => a.slot - b.slot);

    if (!pets.length) return;

    const box = document.createElement("div");
    const innerBox = document.createElement("div");
    const list = document.createElement("ul");
    const heading = document.createElement("div");

    box.className = "box_personal_history ggn-profile-stats";
    innerBox.className = "box";
    heading.className = "head colhead_dark";
    list.className = "stats nobullet";
    list.style.lineHeight = "1.5";

    heading.appendChild(document.createTextNode("Pet Leveling"));
    innerBox.appendChild(heading);
    innerBox.appendChild(list);
    box.appendChild(innerBox);

    const listItems = [];
    for (const pet of pets) {
      const liItem = document.createElement("li");
      const liXP = document.createElement("li");
      const liXPNext = document.createElement("li");
      const liLevelInput = document.createElement("li");
      const liTimeOutput = document.createElement("li");
      const shopLink = document.createElement("a");

      if (listItems.length) listItems.push(document.createElement("hr"));

      liItem.style.marginTop = "0.6em";
      liXP.style.paddingLeft = "10px";
      liXPNext.style.paddingLeft = "10px";
      liLevelInput.style.paddingLeft = "10px";
      liTimeOutput.style.paddingLeft = "10px";

      shopLink.style.fontWeight = "bold";
      shopLink.href = `/shop.php?ItemID=${pet.id}`;
      shopLink.referrerPolicy = "no-referrer";
      shopLink.title = "Shop for this pet";

      const nextLevel = pet.lv + 1;
      liXP.textContent = `XP: ${pet.xp}`;
      const xpForNextLevel = Math.ceil((nextLevel * nextLevel * 625) / 9);
      liXPNext.textContent = `Next Level XP: ${xpForNextLevel}`;

      const targetLevelInput = document.createElement("input");
      targetLevelInput.type = "number";
      targetLevelInput.required = true;
      targetLevelInput.inputmode = "numeric";
      targetLevelInput.style.width = "3em";
      targetLevelInput.min = nextLevel;
      targetLevelInput.max = Math.max(999, nextLevel);
      targetLevelInput.value = nextLevel;

      const displayTimeDifference = (toLevel) => {
        const missingXP = Math.ceil((toLevel * toLevel * 625) / 9) - pet.xp;
        const days = Math.floor(missingXP / 24);
        const hours = missingXP % 24;
        let timeString = days ? `${days} day${days === 1 ? '' : 's'}` : '';
        if (hours) timeString += (timeString ? ' ' : '') + `${hours} hour${hours === 1 ? '' : 's'}`;
        else if (!timeString) timeString = "0 hours";
        liTimeOutput.textContent = timeString;
      };

      displayTimeDifference(nextLevel);

      targetLevelInput.addEventListener("input", function () {
        if (this.checkValidity()) displayTimeDifference(parseInt(this.value, 10));
      });

      targetLevelInput.addEventListener("change", function () {
        setTimeout(() => { if (!this.reportValidity()) liTimeOutput.textContent = ""; });
      });

      shopLink.appendChild(document.createTextNode(pet.name));
      liItem.appendChild(shopLink);
      liLevelInput.appendChild(document.createTextNode(`Level ${pet.lv} → `));
      liLevelInput.appendChild(targetLevelInput);

      listItems.push(liItem, liXP, liXPNext, liLevelInput, liTimeOutput);

      let lastDroppedItem = "No items found";
      for (const log of userLog.response) {
        const petNameMatch = log.message.match(/level \d+ (.+?) \(\w+ slot\)/);
        const petSlotMatch = log.message.match(/\((\w+) slot\)/);
        const itemName = log.message.match(/dropped(?:\s+a)? (.+)\.$/);
        if (!petNameMatch || !petSlotMatch || !itemName) continue;

        const petSlot = petSlotMatch[1] === "Left" ? 14 : petSlotMatch[1] === "Right" ? 15 : null;
        if (!petSlot || petSlot !== pet.slot || !petNameMatch[1].toLowerCase().includes(pet.name.toLowerCase())) continue;

        const timeZoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
        const dropTime = new Date(log.time);
        const timeDiff = Date.now() - dropTime.getTime() + timeZoneOffset;
        const seconds = Math.floor(timeDiff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        let timeAgo = days > 0 ? `${days} Day${days > 1 ? "s" : ""} ${hours % 24} Hour${hours % 24 > 1 ? "s" : ""} ${minutes % 60} Minute${minutes % 60 > 1 ? "s" : ""} Ago` :
                      hours > 0 ? `${hours} Hour${hours > 1 ? "s" : ""} ${minutes % 60} Minute${minutes % 60 > 1 ? "s" : ""} Ago` :
                      minutes > 0 ? `${minutes} Minute${minutes > 1 ? "s" : ""} ${seconds % 60} Second${seconds % 60 > 1 ? "s" : ""} Ago` :
                      `${seconds} Second${seconds > 1 ? "s" : ""} Ago`;

        lastDroppedItem = `Last dropped a ${itemName[1]} (${timeAgo})`;
        break;
      }

      const lastDroppedItemInfo = document.createElement("li");
      lastDroppedItemInfo.textContent = lastDroppedItem;
      lastDroppedItemInfo.style.paddingBottom = "10px";
      listItems.push(lastDroppedItemInfo);
    }

    list.append(...listItems);
    insertSection(box, 'user_info');
  }

  async function proceedWithMiningStats(theirUserID, ownUserID) {
    const userId = await new Promise((resolve) => {
      const tryExtractUserId = () => {
        const selectors = ['h2 a.username', 'a.username', 'a[href*="user.php?id="]', 'a[href*="user.php"]', 'a[href*="/user.php"]'];
        for (const selector of selectors) {
          const link = document.querySelector(selector);
          if (link) {
            const id = new URL(link.href, window.location.href).searchParams.get('id');
            if (id) return id;
          }
        }
        return null;
      };

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve(tryExtractUserId() || theirUserID);
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          resolve(tryExtractUserId() || theirUserID);
        }, { once: true });
        const observer = new MutationObserver(() => {
          const id = tryExtractUserId();
          if (id) {
            observer.disconnect();
            resolve(id);
          }
        });
        observer.observe(document, { childList: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          resolve(theirUserID);
        }, 10000);
      }
    });

    if (!userId) return;

    let logData, userData;
    try {
      [logData, userData] = await Promise.all([
        fetchData(`https://gazellegames.net/api.php?request=userlog&limit=-1&search=as an irc reward.`, apiKey),
        fetchData(`https://gazellegames.net/api.php?request=user&id=${userId}`, apiKey)
      ]);
    } catch (error) {
      if ([401, 403].includes(error.status)) safeGM('setValue', 'mining_stats_api_key', '');
      return;
    }

    const drops = logData?.response || [];
    const flameEntries = drops.filter(e => e.message.toLowerCase().includes('flame'));
    const flameCounts = flameEntries.reduce((acc, entry) => {
      const msg = entry.message.toLowerCase();
      ['nayru', 'din', 'farore'].forEach(flame => {
        if (msg.includes(`${flame}'s flame`)) acc[flame]++;
      });
      return acc;
    }, { nayru: 0, din: 0, farore: 0 });

    const actualLines = userData?.response?.community?.ircActualLines ?? 0;
    const totalMines = drops.length;
    const totalFlames = flameEntries.length;

    let statsMessage = `Mines: ${totalMines} | Flames: ${totalFlames}\n` +
                      `Nayru: ${flameCounts.nayru}, Din: ${flameCounts.din}, Farore: ${flameCounts.farore}\n` +
                      `Lines/Mine: ${(actualLines / (totalMines || 1)).toFixed(2)}\n` +
                      `Lines/Flame: ${(actualLines / (totalFlames || 1)).toFixed(2)}`;

    const box = document.createElement('div');
    const innerBox = document.createElement('div');
    const list = document.createElement('ul');
    const heading = document.createElement('div');

    box.className = 'box_personal_history ggn-profile-stats';
    innerBox.className = 'box';
    heading.className = 'head colhead_dark';
    list.className = 'stats nobullet';
    list.style.lineHeight = '1.5';

    heading.appendChild(document.createTextNode('Mining Stats'));
    innerBox.appendChild(heading);
    innerBox.appendChild(list);
    box.appendChild(innerBox);

    const statsLines = statsMessage.split('\n');
    statsLines.forEach((line, index) => {
      if (line.trim() === '') return;
      const li = document.createElement('li');
      li.style.paddingLeft = '10px';
      if (index === 0) li.style.marginTop = '0.6em';
      if (index === statsLines.length - 1) li.style.paddingBottom = '10px';
      li.appendChild(document.createTextNode(line));
      list.appendChild(li);
    });

    insertSection(box, 'user_info');
  }

  function insertSection(box, primarySelector) {
    const insert = () => {
      let target = primarySelector.startsWith('.') || primarySelector.startsWith('#') ?
        document.querySelector(primarySelector) : document.getElementsByName(primarySelector)[0];

      if (target) {
        target.after(box);
      } else {
        document.body.appendChild(box);
      }
      return box.isConnected;
    };

    const attemptInsert = () => {
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        if (insert()) return;
      }

      window.addEventListener('DOMContentLoaded', () => {
        if (!box.isConnected) insert();
      }, { once: true });

      if (!box.isConnected) {
        const observer = new MutationObserver(() => {
          if (insert()) observer.disconnect();
        });
        observer.observe(document, { childList: true, subtree: true });
        setTimeout(() => {
          observer.disconnect();
          if (!box.isConnected) document.body.appendChild(box);
        }, 15000);
      }
    };

    setTimeout(attemptInsert, 2000);
  }
})();