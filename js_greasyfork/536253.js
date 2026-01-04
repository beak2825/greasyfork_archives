// ==UserScript==
// @name         BGA Flip Seven Card Counter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Card counter for Flip Seven on BoardGameArena
// @author       KuRRe8, fpronto
// @match        https://boardgamearena.com/*/flipseven?table=*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/536253/BGA%20Flip%20Seven%20Card%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/536253/BGA%20Flip%20Seven%20Card%20Counter.meta.js
// ==/UserScript==

(function () {
  "use strict";

  function isInGameUrl(url) {
    return /https:\/\/boardgamearena\.com\/\d+\/flipseven\?table=\d+/.test(url);
  }

  // Card counting data initialization
  function getInitialCardDict() {
    return {
      "12card": 12,
      "11card": 11,
      "10card": 10,
      "9card": 9,
      "8card": 8,
      "7card": 7,
      "6card": 6,
      "5card": 5,
      "4card": 4,
      "3card": 3,
      "2card": 2,
      "1card": 1,
      "0card": 1,
      flip3: 3,
      "Second chance": 3,
      Freeze: 3,
      Plus2: 1,
      Plus4: 1,
      Plus6: 1,
      Plus8: 1,
      Plus10: 1,
      double: 1,
    };
  }

  let cardDict = null;
  let roundCardDict = null; // Current round card counting data
  let playerBoardDict = null; // All players' board cards, array, each element is a player's card object
  let busted_players = {};
  let stayedPlayers = {};
  let frozenPlayers = {};

  function getInitialPlayerBoardDict() {
    // Same structure as cardDict, all values initialized to 0
    return Object.fromEntries(
      Object.keys(getInitialCardDict()).map((k) => [k, 0])
    );
  }

  function clearPlayerBoardDict(idx) {
    // idx: optional, specify player index, if not provided, clear all
    if (Array.isArray(playerBoardDict)) {
      if (typeof idx === "number") {
        Object.keys(playerBoardDict[idx]).forEach(
          (k) => (playerBoardDict[idx][k] = 0)
        );
        // console.log(
        //   `[Flip Seven Counter] Player ${idx + 1} board cleared`,
        //   playerBoardDict[idx]
        // );
      } else {
        playerBoardDict.forEach((dict, i) => {
          Object.keys(dict).forEach((k) => (dict[k] = 0));
        });
        console.log(
          "[Flip Seven Counter] All players board cleared",
          playerBoardDict
        );
      }
    }
  }

  function clearRoundCardDict() {
    if (roundCardDict) {
      Object.keys(roundCardDict).forEach((k) => (roundCardDict[k] = 0));
      console.log(
        "[Flip Seven Counter] Round card data cleared",
        roundCardDict
      );
    }
  }

  function resetBustedPlayers() {
    const playerNames = window.flipsevenPlayerNames || [];
    busted_players = {};
    stayedPlayers = {};
    frozenPlayers = {};
    playerNames.forEach((name) => {
      busted_players[name] = false;
      stayedPlayers[name] = false;
      frozenPlayers[name] = false;
    });
  }

  function createCardCounterPanel() {
    // Create floating panel
    let panel = document.createElement("div");
    panel.id = "flipseven-card-counter-panel";
    panel.style.position = "fixed";
    panel.style.top = "80px";
    panel.style.right = "20px";
    panel.style.zIndex = "99999";
    panel.style.background = "rgba(173, 216, 230, 0.85)"; // light blue semi-transparent
    panel.style.border = "1px solid #5bb";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    panel.style.padding = "12px 16px";
    panel.style.fontSize = "15px";
    panel.style.color = "#222";
    panel.style.maxHeight = "80vh";
    panel.style.overflowY = "auto";
    panel.style.minWidth = "180px";
    panel.style.userSelect = "text";
    panel.style.cursor = "move"; // draggable cursor
    panel.innerHTML =
      '<b>Flip Seven Counter</b><hr style="margin:6px 0;">' +
      renderCardDictTable(cardDict) +
      '<div style="height:18px;"></div>' +
      '<div style="font-size: 1.5em; font-weight: bold; text-align:left;">rate <span style="float:right;">100%</span></div>';
    document.body.appendChild(panel);
    makePanelDraggable(panel);
  }

  function getSafeRate() {
    // Calculate the probability of safe cards (not in any player's hand)
    let safe = 0,
      total = 0;
    for (const k in cardDict) {
      if (!playerBoardDict || playerBoardDict.every((dict) => dict[k] === 0)) {
        safe += cardDict[k];
      }
      total += cardDict[k];
    }
    if (total === 0) return 100;
    return Math.round((safe / total) * 100);
  }

  function getPlayerSafeRate(idx) {
    // Calculate the safe card probability for a specific player
    let safe = 0,
      total = 0;
    if (!playerBoardDict || !playerBoardDict[idx]) return 100;
    for (const k in cardDict) {
      if (playerBoardDict[idx][k] === 0) {
        safe += cardDict[k];
      }
      total += cardDict[k];
    }
    if (total === 0) return 100;
    return Math.round((safe / total) * 100);
  }

  function updateCardCounterPanel(flashKey) {
    const panel = document.getElementById("flipseven-card-counter-panel");
    if (panel) {
      const playerNames = window.flipsevenPlayerNames || [];
      let namesHtml = playerNames
        .map((n, idx) => {
          let shortName = n.length > 6 ? n.slice(0, 6) : n;
          if (busted_players[n]) {
            return `<div style="margin-bottom:2px;"><span style="display:inline-block;max-width:6em;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;">${shortName}</span> <span style='color:#888;font-size:0.95em;'>Busted</span></div>`;
          } else if (frozenPlayers[n]) {
            return `<div style="margin-bottom:2px;"><span style="display:inline-block;max-width:6em;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;">${shortName}</span> <span style='color:#888;font-size:0.95em;'>Frozen</span></div>`;
          } else if (stayedPlayers[n]) {
            return `<div style="margin-bottom:2px;"><span style="display:inline-block;max-width:6em;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;">${shortName}</span> <span style='color:#888;font-size:0.95em;'>Stayed</span></div>`;
          } else {
            let rate = getPlayerSafeRate(idx);
            let rateColor;
            if (rate < 30) rateColor = "#b94a48";
            else if (rate < 50) rateColor = "#bfae3b";
            else rateColor = "#4a7b5b";
            return `<div style="margin-bottom:2px;"><span style="display:inline-block;max-width:6em;overflow:hidden;text-overflow:ellipsis;vertical-align:middle;">${shortName}</span> <span style='color:${rateColor};font-size:0.95em;'>${rate}%</span></div>`;
          }
        })
        .join("");
      panel.innerHTML =
        '<b>Flip Seven Counter</b><hr style="margin:6px 0;">' +
        renderCardDictTable(cardDict) +
        '<div style="height:18px;"></div>' +
        `<div style="font-size: 1.2em; font-weight: bold; text-align:left;">${namesHtml}</div>`;
      if (flashKey) flashNumberCell(flashKey);
    }
  }

  // Draggable panel functionality
  function makePanelDraggable(panel) {
    let isDragging = false;
    let offsetX = 0,
      offsetY = 0;
    panel.addEventListener("mousedown", function (e) {
      isDragging = true;
      offsetX = e.clientX - panel.getBoundingClientRect().left;
      offsetY = e.clientY - panel.getBoundingClientRect().top;
      document.body.style.userSelect = "none";
    });
    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        panel.style.left = e.clientX - offsetX + "px";
        panel.style.top = e.clientY - offsetY + "px";
        panel.style.right = "";
      }
    });
    document.addEventListener("mouseup", function () {
      isDragging = false;
      document.body.style.userSelect = "";
    });
  }

  function renderCardDictTable(dict) {
    let html = '<table style="border-collapse:collapse;width:100%;">';
    const totalLeft = Object.values(dict).reduce((a, b) => a + b, 0) || 1;
    for (const [k, v] of Object.entries(dict)) {
      const percent = Math.round((v / totalLeft) * 100);

      const percentColor = "#888";

      let numColor = "#888";
      if (v === 1 || v === 2) numColor = "#2ecc40";
      else if (v >= 3 && v <= 5) numColor = "#ffdc00";
      else if (v > 5) numColor = "#ff4136";
      html += `<tr><td style='padding:2px 6px;'>${k}</td><td class='flipseven-anim-num' data-key='${k}' style='padding:2px 6px;text-align:right;color:${numColor};font-weight:bold;'>${v} <span style='font-size:0.9em;color:${percentColor};'>(${percent}%)</span></td></tr>`;
    }
    html += "</table>";
    return html;
  }

  function flashNumberCell(key) {
    const cell = document.querySelector(
      `#flipseven-card-counter-panel .flipseven-anim-num[data-key='${key}']`
    );
    if (cell) {
      cell.style.transition = "background 0.2s";
      cell.style.background = "#fff7b2";
      setTimeout(() => {
        cell.style.background = "";
      }, 200);
    }
  }

  function updatePlayerBoardDictFromDOM() {
    // Get player count
    const playerNames = window.flipsevenPlayerNames || [];
    const playerCount = playerNames.length;
    // Process each player
    for (let i = 0; i < playerCount; i++) {
      const container = document.querySelector(
        `#app > div > div > div.f7_scalable.f7_scalable_zoom > div > div.f7_players_container.grid > div:nth-child(${
          i + 1
        }) > div:nth-child(3)`
      );
      if (!container) {
        console.warn(
          `[Flip Seven Counter] Player ${i + 1} board container not found`
        );
        continue;
      }
      // Clear this player's stats
      clearPlayerBoardDict(i);
      // Count all cards
      const cardDivs = container.querySelectorAll(".flippable-front");
      cardDivs.forEach((frontDiv) => {
        // class like 'flippable-front sprite sprite-c8', get the number
        const classList = frontDiv.className.split(" ");
        const spriteClass = classList.find((cls) => cls.startsWith("sprite-c"));
        if (spriteClass) {
          const num = spriteClass.replace("sprite-c", "");
          if (/^\d+$/.test(num)) {
            const key = num + "card";
            if (playerBoardDict[i].hasOwnProperty(key)) {
              playerBoardDict[i][key] += 1;
            }
          }
        }
      });
      // console.log(`[Flip Seven Counter] Player ${i+1} board:`, JSON.parse(JSON.stringify(playerBoardDict[i])));
    }
  }

  // Periodic event: check every 300ms
  function startPlayerBoardMonitor() {
    setInterval(updatePlayerBoardDictFromDOM, 300);
  }

  // Log monitor
  let lc = 0; // log counter
  function startLogMonitor() {
    setInterval(() => {
      const logElem = document.getElementById("log_" + lc);
      if (!logElem) return; // No such log, wait for next
      // Check for new round
      const firstDiv = logElem.querySelector("div");
      console.log(
        `[Flip Seven Counter] firstDiv.innerText = ${firstDiv.innerText.trim()} `
      );
      if (
        firstDiv?.innerText &&
        (firstDiv.innerText.trim().includes("新的一轮") ||
          /new round/gi.exec(firstDiv.innerText))
      ) {
        clearRoundCardDict();
        resetBustedPlayers();
        updateCardCounterPanel();
        lc++;
        return;
      }
      if (
        firstDiv?.innerText &&
        (firstDiv.innerText.includes("弃牌堆洗牌") ||
          /shuffle/gi.exec(firstDiv.innerText))
      ) {
        cardDict = getInitialCardDict();
        for (const k in roundCardDict) {
          if (cardDict.hasOwnProperty(k)) {
            cardDict[k] = Math.max(0, cardDict[k] - roundCardDict[k]);
          }
        }
        updateCardCounterPanel();
        lc++;
        return;
      }
      if (
        firstDiv?.innerText &&
        (firstDiv.innerText.includes("爆牌") ||
          /bust/gi.exec(firstDiv.innerText))
      ) {
        // 查找 span.playername
        const nameSpan = firstDiv.querySelector("span.playername");
        if (nameSpan) {
          const bustedName = nameSpan.innerText.trim();
          if (busted_players.hasOwnProperty(bustedName)) {
            busted_players[bustedName] = true;
            updateCardCounterPanel();
          }
        }
      }
      if (firstDiv?.innerText && /stay/gi.exec(firstDiv.innerText)) {
        const nameSpan = firstDiv.querySelector("span.playername");
        if (nameSpan) {
          const stayedName = nameSpan.innerText.trim();
          if (stayedPlayers.hasOwnProperty(stayedName)) {
            stayedPlayers[stayedName] = true;
            updateCardCounterPanel();
          }
        }
      }
      if (firstDiv?.innerText && /freezes/gi.exec(firstDiv.innerText)) {
        const nameSpan = firstDiv.querySelector("span.playername");
        if (nameSpan) {
          const frozenName = nameSpan.innerText.trim();
          if (frozenPlayers.hasOwnProperty(frozenName)) {
            frozenPlayers[frozenName] = true;
            updateCardCounterPanel();
          }
        }
      }
      if (
        firstDiv?.innerText &&
        ((firstDiv.innerText.includes("第二次机会") &&
          firstDiv.innerText.includes("卡牌被弃除")) ||
          /second chance/gi.exec(firstDiv.innerText))
      ) {
        if (cardDict["Second chance"] > 0) {
          cardDict["Second chance"]--;
          console.log(
            '[Flip Seven Counter] "第二次机会"卡牌被弃除，cardDict[Second chance]--，当前剩余：',
            cardDict["Second chance"]
          );
          updateCardCounterPanel("Second chance");
        }
      }
      // Check for card type
      const cardElem = logElem.querySelector(
        ".visible_flippable.f7_token_card.f7_logs"
      );
      if (!cardElem) {
        lc++;
        return; // No card, skip
      }
      // Find the only child div's only child div
      let frontDiv = cardElem;
      frontDiv = frontDiv.children[0];
      frontDiv = frontDiv.children[0];
      if (!frontDiv?.className) {
        lc++;
        return;
      }
      // Parse className
      const classList = frontDiv.className.split(" ");
      const spriteClass = classList.find((cls) => cls.startsWith("sprite-"));
      if (!spriteClass) {
        lc++;
        return;
      }
      // Handle number cards
      let key = null;
      if (/^sprite-c(\d+)$/.test(spriteClass)) {
        const num = spriteClass.match(/^sprite-c(\d+)$/)[1];
        key = num + "card";
      } else if (/^sprite-s(\d+)$/.test(spriteClass)) {
        // Plus2/4/6/8/10
        const num = spriteClass.match(/^sprite-s(\d+)$/)[1];
        key = "Plus" + num;
      } else if (spriteClass === "sprite-sf") {
        key = "Freeze";
      } else if (spriteClass === "sprite-sch") {
        key = "Second chance";
      } else if (spriteClass === "sprite-sf3") {
        key = "flip3";
      } else if (spriteClass === "sprite-sx2") {
        key = "double";
      }
      if (
        key &&
        cardDict.hasOwnProperty(key) &&
        roundCardDict.hasOwnProperty(key)
      ) {
        if (cardDict[key] > 0) cardDict[key]--;
        roundCardDict[key]++;
        console.log(
          `[Flip Seven Counter] log_${lc} found ${key}, global left ${cardDict[key]}, round used ${roundCardDict[key]}`
        );
        updateCardCounterPanel(key);
      } else {
        console.log("spriteClass -> ", spriteClass);
        console.log(
          `[Flip Seven Counter] log_${lc} unknown card type`,
          spriteClass
        );
      }
      lc++;
      if (lc) {
        console.log(`[Flip Seven Counter] ${lc} unknown card type`);
      }
    }, 200);
  }

  function initializeGame() {
    cardDict = getInitialCardDict();
    roundCardDict = Object.fromEntries(
      Object.keys(cardDict).map((k) => [k, 0])
    );
    playerBoardDict = Array.from({ length: 12 }, () =>
      getInitialPlayerBoardDict()
    );
    resetBustedPlayers();
    console.log("[Flip Seven Counter] Card data initialized", cardDict);
    console.log(
      "[Flip Seven Counter] Round card data initialized",
      roundCardDict
    );
    console.log(
      "[Flip Seven Counter] All players board initialized",
      playerBoardDict
    );
    createCardCounterPanel();
    startPlayerBoardMonitor();
    startLogMonitor();
    // You can continue to extend initialization logic here
  }

  function runLogic() {
    setTimeout(() => {
      // Detect all player names
      let playerNames = [];
      for (let i = 1; i <= 12; i++) {
        const selector = `#app > div > div > div.f7_scalable.f7_scalable_zoom > div > div.f7_players_container > div:nth-child(${i}) > div.f7_player_name.flex.justify-between > div:nth-child(1)`;
        const nameElem = document.querySelector(selector);
        if (nameElem?.innerText?.trim()) {
          playerNames.push(nameElem.innerText.trim());
        } else {
          break;
        }
      }
      alert(
        `[Flip Seven Counter] Entered game room. Player list:\n` +
          playerNames.map((n, idx) => `${idx + 1}. ${n}`).join("\n")
      );
      window.flipsevenPlayerNames = playerNames; // global access
      initializeGame();
      // You can continue your logic here
    }, 1500);
  }

  // First enter page
  if (isInGameUrl(window.location.href)) {
    runLogic();
  }

  // Listen for SPA navigation
  function onUrlChange() {
    if (isInGameUrl(window.location.href)) {
      runLogic();
    }
  }
  const _pushState = history.pushState;
  const _replaceState = history.replaceState;
  history.pushState = function () {
    _pushState.apply(this, arguments);
    setTimeout(onUrlChange, 0);
  };
  history.replaceState = function () {
    _replaceState.apply(this, arguments);
    setTimeout(onUrlChange, 0);
  };
  window.addEventListener("popstate", onUrlChange);
})();