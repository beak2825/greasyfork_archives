// ==UserScript==
// @name         GGn Profile Stats
// @description  Adds pet and mining stats to user profile.
// @namespace    https://gazellegames.net/ggn-profile-stats-v2
// @version      1.0.13
// @match        https://gazellegames.net/user.php?id=*
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @icon         https://gazellegames.net/favicon.ico
// @author       mactruck
// @supportURL   https://github.com/DiRTYMacTruCK
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540259/GGn%20Profile%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/540259/GGn%20Profile%20Stats.meta.js
// ==/UserScript==

(async () => {
  'use strict';

  async function getApiKey() {
    let apiKey = await GM.getValue('apiKey');
    if (!apiKey) {
      apiKey = prompt('Please enter your API key:');
      if (apiKey) {
        await GM.setValue('apiKey', apiKey);
      } else {
        return null;
      }
    }
    return apiKey;
  }

  async function fetchData(url, apiKey) {
    const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (data?.status !== 'success') throw new Error('API request failed');
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
          GM.setValue('you', id);
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

  const theirUserID = new URLSearchParams(location.search).get('id');
  if (!theirUserID) return;

  const apiKey = await getApiKey();
  if (!apiKey) return;

  let ownUserID = await GM.getValue('you') || await getOwnUserID();
  if (!ownUserID || theirUserID !== ownUserID) return;

  // Run pet leveling first, then mining stats to ensure correct order
  await proceedWithPetLeveling(theirUserID, apiKey);
  await proceedWithMiningStats(theirUserID, ownUserID, apiKey);

  async function proceedWithPetLeveling(userId, apiKey) {
    const equipEndpoint = "https://gazellegames.net/api.php?request=items&type=users_equipped&include_info=true";
    const userlogEndpoint = "https://gazellegames.net/api.php?request=userlog&search=dropped";
    let equipment, userLog;

    try {
      [equipment, userLog] = await Promise.all([
        fetchData(equipEndpoint, apiKey),
        fetchData(userlogEndpoint, apiKey)
      ]);
    } catch {
      return;
    }

    const levelingPetIDs = new Set([
      "2509", "2510", "2511", "2512", "2513", "2514", "2515", "2521",
      "2522", "2523", "2524", "2525", "2529", "2583", "2927", "2928",
      "2929", "2933", "3215", "3216", "3237", "3322", "3323", "3324",
      "3369", "3370", "3371", "3373"
    ]);

    const pets = equipment.response
      .filter(equip => equip.item.equipType === "18" && (levelingPetIDs.has(equip.itemid) || equip.experience > 0))
      .map(equip => ({
        name: equip.item.name,
        xp: parseInt(equip.experience, 10),
        lv: parseInt(equip.level, 10),
        id: String(equip.itemid),
        slot: parseInt(equip.slotid, 10)
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

    heading.textContent = "Pet Leveling";
    innerBox.append(heading, list);
    box.appendChild(innerBox);

    const listItems = [];
    for (const pet of pets) {
      const liItem = document.createElement("li");
      const liXP = document.createElement("li");
      const liXPNext = document.createElement("li");
      const liLevelInput = document.createElement("li");
      const liTimeOutput = document.createElement("li");
      const liAvgDropTime = document.createElement("li");
      const shopLink = document.createElement("a");

      if (listItems.length) listItems.push(document.createElement("hr"));

      liItem.style.marginTop = "0.6em";
      liXP.style.paddingLeft = "10px";
      liXPNext.style.paddingLeft = "10px";
      liLevelInput.style.paddingLeft = "10px";
      liTimeOutput.style.paddingLeft = "10px";
      liAvgDropTime.style.paddingLeft = "10px";
      liAvgDropTime.style.paddingBottom = "10px";

      shopLink.style.fontWeight = "bold";
      shopLink.href = `/shop.php?ItemID=${pet.id}`;
      shopLink.referrerPolicy = "no-referrer";
      shopLink.title = "Shop for this pet";
      shopLink.textContent = pet.name;

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
        timeString += hours ? (timeString ? ' ' : '') + `${hours} hour${hours === 1 ? '' : 's'}` : !timeString ? "0 hours" : '';
        liTimeOutput.textContent = timeString;
      };

      displayTimeDifference(nextLevel);

      targetLevelInput.addEventListener("input", function () {
        if (this.checkValidity()) displayTimeDifference(parseInt(this.value, 10));
      });

      targetLevelInput.addEventListener("change", function () {
        setTimeout(() => { if (!this.reportValidity()) liTimeOutput.textContent = ""; });
      });

      liItem.appendChild(shopLink);
      liLevelInput.append(`Level ${pet.lv} → `, targetLevelInput);

      let avgDropTimeText = "No drops found";
      const petDrops = [];
      for (const log of userLog.response) {
        const petNameMatch = log.message.match(/level \d+ (.+?) \(\w+ slot\)/);
        const petSlotMatch = log.message.match(/\((\w+) slot\)/);
        const itemName = log.message.match(/dropped(?:\s+a)? (.+)\.$/);
        if (!petNameMatch || !petSlotMatch || !itemName) continue;

        const petSlot = petSlotMatch[1] === "Left" ? 14 : petSlotMatch[1] === "Right" ? 15 : null;
        if (!petSlot || petSlot !== pet.slot || !petNameMatch[1].toLowerCase().includes(pet.name.toLowerCase())) continue;

        petDrops.push(new Date(log.time).getTime());
      }

      if (petDrops.length >= 2) {
        petDrops.sort((a, b) => a - b);
        const intervals = [];
        for (let i = 1; i < petDrops.length; i++) {
          intervals.push((petDrops[i] - petDrops[i - 1]) / 1000);
        }
        const avgSeconds = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
        const days = Math.floor(avgSeconds / (3600 * 24));
        const hours = Math.floor((avgSeconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((avgSeconds % 3600) / 60);
        let parts = [];
        if (days > 0) parts.push(`${days} day${days === 1 ? '' : 's'}`);
        if (hours > 0 || days > 0) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
        parts.push(`${minutes} minute${minutes === 1 ? '' : 's'}`);
        avgDropTimeText = `Avg time between drops: ${parts.join(' ')}`;
      } else if (petDrops.length === 1) {
        avgDropTimeText = "Only one drop found";
      }

      liAvgDropTime.textContent = avgDropTimeText;

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

      listItems.push(liItem, liXP, liXPNext, liLevelInput, liTimeOutput, liAvgDropTime, lastDroppedItemInfo);
    }

    list.append(...listItems);
    insertSection(box, 'user_info');
  }

  async function proceedWithMiningStats(theirUserID, ownUserID, apiKey) {
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
        return theirUserID;
      };

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        resolve(tryExtractUserId());
      } else {
        window.addEventListener('DOMContentLoaded', () => resolve(tryExtractUserId()), { once: true });
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

    let logData, userData;
    try {
      [logData, userData] = await Promise.all([
        fetchData(`https://gazellegames.net/api.php?request=userlog&limit=-1&search=as an irc reward.`, apiKey),
        fetchData(`https://gazellegames.net/api.php?request=user&id=${userId}`, apiKey)
      ]);
    } catch {
      return;
    }

    const drops = logData.response || [];
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

    let linesSinceLastMine = 0;
    const storedKey = `lastMineData_${userId}`;
    const storedData = await GM.getValue(storedKey);
    const lastMineData = storedData ? JSON.parse(storedData) : null;

    if (drops.length > 0) {
      const sortedDrops = drops.sort((a, b) => new Date(b.time) - new Date(a.time));
      const mostRecentMine = sortedDrops[0];
      const lastMineTime = new Date(mostRecentMine.time).getTime();

      if (lastMineData && lastMineData.time === lastMineTime) {
        linesSinceLastMine = actualLines - lastMineData.linesAtMine;
      } else {
        await GM.setValue(storedKey, JSON.stringify({
          time: lastMineTime,
          linesAtMine: actualLines
        }));
        linesSinceLastMine = 0;
      }
    } else {
      linesSinceLastMine = actualLines;
    }

    const statsMessage = `Mines: ${totalMines} | Flames: ${totalFlames}\n` +
                        `Nayru: ${flameCounts.nayru}, Din: ${flameCounts.din}, Farore: ${flameCounts.farore}\n` +
                        `Lines/Mine: ${(actualLines / (totalMines || 1)).toFixed(2)}\n` +
                        `Lines/Flame: ${(actualLines / (totalFlames || 1)).toFixed(2)}\n` +
                        `Lines since last mine: ${linesSinceLastMine}`;

    const box = document.createElement('div');
    const innerBox = document.createElement('div');
    const list = document.createElement('ul');
    const heading = document.createElement('div');

    box.className = 'box_personal_history ggn-profile-stats';
    innerBox.className = 'box';
    heading.className = 'head colhead_dark';
    list.className = 'stats nobullet';
    list.style.lineHeight = '1.5';

    heading.textContent = 'Mining Stats';
    innerBox.append(heading, list);
    box.appendChild(innerBox);

    statsMessage.split('\n').forEach((line, index) => {
      if (!line.trim()) return;
      const li = document.createElement('li');
      li.style.paddingLeft = '10px';
      if (index === 0) li.style.marginTop = '0.6em';
      if (index === statsMessage.split('\n').length - 1) li.style.paddingBottom = '10px';
      li.textContent = line;
      list.appendChild(li);
    });

    insertSection(box, 'user_info');
  }

  function insertSection(box, primarySelector) {
    const insert = () => {
      const target = document.querySelector(primarySelector) || document.getElementsByName(primarySelector)[0];
      if (target) {
        target.after(box);
      } else {
        document.body.appendChild(box);
      }
      return box.isConnected;
    };

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
  }
})();