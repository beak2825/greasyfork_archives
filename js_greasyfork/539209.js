// ==UserScript==
// @name         FLBOT_NO1
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  free crypto + Dice roll
// @author       Peckovic
// @license      MIT
// @match        *://*.suipick.io/*
// @match        *://*.tonpick.game/*
// @match        *://*.polpick.io/*
// @match        *://*.solpick.io/*
// @match        *://*.tronpick.io/*
// @match        *://*.dogepick.io/*
// @match        *://*.bnbpick.io/*
// @match        *://*.litepick.io/*
// @match        *://*.freetron.in/*
// @match        *://*.freebnb.in/*
// @match        *://*.freexrp.in/*
// @match        *://*.freetoncoin.in/*
// @match        *://*.usdpick.io/*
// @match        *://*.freeshib.in/*
// @match        *://*.freebitco.in/*
// @match        *://*.freetrump.in/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539209/FLBOT_NO1.user.js
// @updateURL https://update.greasyfork.org/scripts/539209/FLBOT_NO1.meta.js
// ==/UserScript==

(function () {
  // Debug log za proveru pokretanja
  console.log("[FLBOT] SKRIPTA POKRENUTA!");

  if (window.top !== window.self || window.FLBOTv5_started) {
    console.log("[FLBOT] Skripta se već izvršava ili je u iframe-u");
    return;
  }
  window.FLBOTv5_started = true;
  console.log("[FLBOT] Inicijalizujem bot...");

  // Tab focus management
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      window.focus();
      if (!window.flbotAudio) {
        window.flbotAudio = new Audio();
        window.flbotAudio.src = "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEgBTGH0fPTgDAFJnrC7+ONQQ0PVqzn77BdGAU+ltryxnkpBSl+zPLZgTMIGWq+8OShUgwLU6fj8LhjHgg2jdXzzn0vBSF0xe/eizELDlOq5O+zYBoGPJPY88p9KwUme8rx2oQ2Bylt1O3Nhx4FO5Pz8x1eHgMvecGCa5BGMZVGrGFt1xGj7OBkOhKfbU6I1KLh7eSr1bvq";
        window.flbotAudio.loop = true;
        window.flbotAudio.volume = 0;
      }
      window.flbotAudio.play().catch(e => console.log("[FLBOT] Audio play prevented:", e));
    }
  });

  // Funkcije za čuvanje dice bot stanja
  function getDiceBotStateKey() {
    return `flbot_dicebot_states`;
  }

  function loadDiceBotStates() {
    const stateKey = getDiceBotStateKey();
    const saved = localStorage.getItem(stateKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log("[FLBOT] Greška pri učitavanju dice bot stanja:", e);
        return {};
      }
    }
    return {};
  }

  function saveDiceBotState(hostname, isEnabled) {
    const stateKey = getDiceBotStateKey();
    const states = loadDiceBotStates();
    states[hostname] = isEnabled;
    localStorage.setItem(stateKey, JSON.stringify(states));
    console.log(`[FLBOT] Dice bot stanje za ${hostname}:`, isEnabled ? 'ON' : 'OFF');
  }

  function isDiceBotEnabled(hostname) {
    const states = loadDiceBotStates();
    // Ako nema sačuvano stanje, default je ON
    return states[hostname] !== false;
  }

  // Poboljšane funkcije za čuvanje statistika
  function getStatsKey() {
    return `flbot_stats_${location.hostname}`;
  }

  function loadStats() {
    const statsKey = getStatsKey();
    const saved = localStorage.getItem(statsKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.log("[FLBOT] Greška pri učitavanju statistika:", e);
        return { profit: 0, totalBet: 0, rolls: 0, wins: 0, losses: 0, lastUpdate: Date.now() };
      }
    }
    return { profit: 0, totalBet: 0, rolls: 0, wins: 0, losses: 0, lastUpdate: Date.now() };
  }

  function saveStats(stats) {
    const statsKey = getStatsKey();
    stats.lastUpdate = Date.now();
    localStorage.setItem(statsKey, JSON.stringify(stats));
  }

  function resetStats() {
    const statsKey = getStatsKey();
    localStorage.removeItem(statsKey);
    console.log("[FLBOT] Statistike resetovane za", location.hostname);
  }

  function mergeStats(oldStats, newStats) {
    // Spaja stare i nove statistike, uzimajući veće vrednosti za ključne metrike
    return {
      profit: Math.max(oldStats.profit || 0, newStats.profit || 0),
      totalBet: Math.max(oldStats.totalBet || 0, newStats.totalBet || 0),
      rolls: Math.max(oldStats.rolls || 0, newStats.rolls || 0),
      wins: Math.max(oldStats.wins || 0, newStats.wins || 0),
      losses: Math.max(oldStats.losses || 0, newStats.losses || 0),
      lastUpdate: Date.now()
    };
  }

  const sites = [
    { host: "suipick.io", aff: "https://suipick.io/?ref=peckovic", dice: "https://suipick.io/dice.php", minBet: 0.000010000, usesIframe: false },
    { host: "tonpick.game", aff: "https://tonpick.game/?ref=ba1tazar666", dice: "https://tonpick.game/dice.php", minBet: 0.00001000, usesIframe: false },
    { host: "polpick.io", aff: "https://polpick.io/?ref=ba1tazar666", dice: "https://polpick.io/dice.php", minBet: 0.00001000, usesIframe: false },
    { host: "solpick.io", aff: "https://solpick.io/?ref=ba1tazar666", dice: "https://solpick.io/dice.php", minBet: 0.00000010, usesIframe: false },
    { host: "tronpick.io", aff: "https://tronpick.io/?ref=ba1tazar666", dice: "https://tronpick.io/dice.php", minBet: 0.000100, usesIframe: false },
    { host: "dogepick.io", aff: "https://dogepick.io/?ref=ba1tazar666", dice: "https://dogepick.io/dice.php", minBet: 0.00010000, usesIframe: false },
    { host: "bnbpick.io", aff: "https://bnbpick.io/?ref=ba1tazar666", dice: "https://bnbpick.io/dice.php", minBet: 0.00000001, usesIframe: false },
    { host: "litepick.io", aff: "https://litepick.io/?ref=ba1tazar666", dice: "https://litepick.io/dice.php", minBet: 0.00000010, usesIframe: false },
    { host: "freetron.in", aff: "https://freetron.in/faucet", dice: "https://freetron.in/games/dice", minBet: 0.0005, usesIframe: true },
    { host: "freebnb.in", aff: "https://freebnb.in/faucet", dice: "https://freebnb.in/games/dice", minBet: 0.00000010, usesIframe: true },
    { host: "freexrp.in", aff: "https://freexrp.in/faucet", dice: "https://freexrp.in/games/dice", minBet: 0.000050, usesIframe: true },
    { host: "freetoncoin.in", aff: "https://freetoncoin.in/faucet", dice: "https://freetoncoin.in/games/dice", minBet: 0.00001000, usesIframe: true },
    { host: "usdpick.io", aff: "https://usdpick.io/faucet", dice: "https://usdpick.io/games/dice", minBet: 0.00005, usesIframe: false },
    { host: "freeshib.in", aff: "https://freeshib.in/faucet", dice: "https://freeshib.in/games/dice", minBet: 10.00000000, usesIframe: true },
    { host: "freebitco.in", aff: "https://freebitco.in/?op=home#", dice: "https://freebitco.in/?op=home#", minBet: 0.00000001, usesIframe: false },
    { host: "freetrump.in", aff: "https://freetrump.in?ref=5fsHx6sPFX", dice: "https://freetrump.in/games/dice", minBet: 0.00003, usesIframe: true, mainUrl: "https://freetrump.in/faucet" }
  ];

  console.log("[FLBOT] Lista sajtova učitana, ukupno:", sites.length);

  const ROTATE_IN = 60;
  let countdown = ROTATE_IN;
  let wentToDice = false;
  let index = parseInt(localStorage.getItem("flbot_index") || "0");
  let botIsPlaying = false;
  let diceBotActive = false;
  let currentBet = 0;
  let baseBet = 0;
  let winChance = 49.5;
  let high = true;
  let autoMode = true;
  let dicePanel = null;
  let togglePanel = null;

  function nextSite() {
    let nextIndex = (index + 1) % sites.length;
    let attempts = 0;
    const maxAttempts = sites.length;

    // Proverava da li je dice bot uključen za sledeći sajt
    while (attempts < maxAttempts) {
      const nextSite = sites[nextIndex];

      // Ako je freebitco.in, uvek preskači dice bot proveru
      if (nextSite.host === "freebitco.in" || isDiceBotEnabled(nextSite.host)) {
        index = nextIndex;
        localStorage.setItem("flbot_index", index);
        console.log("[FLBOT] Prelazim na sajt:", nextSite.host,
                   nextSite.host === "freebitco.in" ? "(freebitco.in - nema dice)" :
                   isDiceBotEnabled(nextSite.host) ? "(dice bot ON)" : "");
        return nextSite;
      } else {
        console.log(`[FLBOT] Preskačem sajt ${nextSite.host} (dice bot OFF)`);
        nextIndex = (nextIndex + 1) % sites.length;
        attempts++;
      }
    }

    // Fallback - ako su svi sajti OFF, idi na sledeći u nizu
    index = (index + 1) % sites.length;
    localStorage.setItem("flbot_index", index);
    console.log("[FLBOT] Svi dice bot-ovi su OFF, prelazim na:", sites[index].host);
    return sites[index];
  }

  function getCurrentIndex() {
    const currentSite = getCurrentSite();
    if (!currentSite) return 0;
    return sites.findIndex(site => site.host === currentSite.host);
  }

  function getCurrentSite() {
    const site = sites.find(site => location.hostname.includes(site.host));
    if (site) {
      console.log("[FLBOT] Trenutni sajt:", site.host);
    } else {
      console.log("[FLBOT] Sajt nije prepoznat:", location.hostname);
    }
    return site;
  }

  function getCurrentBalance() {
    const balanceSelectors = [
      'span.balance',
      '.balance',
      '#balance',
      'span[id*="balance"]',
      'div[id*="balance"]',
      '.user-balance',
      'span.text-xs.font-bold',
      '#user_balance',
      'span.user-balance',
      '.wallet-balance',
      '#wallet_balance',
      'span.amount',
      '.amount',
      '#amount',
      'span[class*="balance"]',
      'div[class*="balance"]',
    ];

    // Prvo proveri glavni dokument
    for (const selector of balanceSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const balanceText = element.textContent || element.innerText || '';
        const balanceMatch = balanceText.match(/[\d,.]+/);
        if (balanceMatch) {
          const balance = parseFloat(balanceMatch[0].replace(/,/g, ''));
          if (!isNaN(balance)) {
            console.log(`[FLBOT] Pronađen balans: ${balance} (selektor: ${selector})`);
            return balance;
          }
        }
      }
    }

    // Ako nije pronađeno u glavnom dokumentu, proveri iframe
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentDocument) {
      for (const selector of balanceSelectors) {
        const element = iframe.contentDocument.querySelector(selector);
        if (element) {
          const balanceText = element.textContent || element.innerText || '';
          const balanceMatch = balanceText.match(/[\d,.]+/);
          if (balanceMatch) {
            const balance = parseFloat(balanceMatch[0].replace(/,/g, ''));
            if (!isNaN(balance)) {
              console.log(`[FLBOT] Pronađen balans u iframe-u: ${balance} (selektor: ${selector})`);
              return balance;
            }
          }
        }
      }
    }

    console.log("[FLBOT] Balans nije pronađen ili je 0");
    return 0;
  }

  function isBalanceSufficient(currentBalance, requiredBet) {
    const bufferMultiplier = 10;
    const requiredBalance = requiredBet * bufferMultiplier;
    return currentBalance >= requiredBalance;
  }

  function switchToNextSiteDueToBalance() {
    if (diceBotActive) {
      console.log("[FLBOT] ⚠️ Dice bot je aktivan - neću prebaciti na sljedeći sajt zbog balansa");
      return;
    }

    console.log("[FLBOT] ⚠️ Nedovoljan balans - prebacujem na sljedeći sajt");
    botIsPlaying = false;
    updatePanel();

    setTimeout(() => {
      const next = nextSite();
      location.href = next.mainUrl || next.aff;
    }, 3000);
  }

  function getMainPanelHeight() {
    const mainPanel = document.getElementById("flbotPanel");
    if (mainPanel) {
      return mainPanel.offsetHeight;
    }
    return 0;
  }

  function getTogglePanelHeight() {
    if (togglePanel) {
      return togglePanel.offsetHeight;
    }
    return 0;
  }

  function updateDicePanelPosition() {
    if (dicePanel) {
      const mainPanelHeight = getMainPanelHeight();
      const togglePanelHeight = getTogglePanelHeight();
      dicePanel.style.bottom = `${mainPanelHeight + togglePanelHeight + 30}px`;
      dicePanel.style.right = '10px';
    }
  }

  function updateTogglePanelPosition() {
    if (togglePanel) {
      const mainPanelHeight = getMainPanelHeight();
      togglePanel.style.bottom = `${mainPanelHeight + 10}px`;
      togglePanel.style.right = '10px';
    }
  }

  function createTogglePanel() {
    if (togglePanel) return togglePanel;

    const currentSite = getCurrentSite();
    if (!currentSite) return null;

    // Ne prikazuj toggle panel za freebitco.in
    if (currentSite.host === "freebitco.in") return null;

    const isEnabled = isDiceBotEnabled(currentSite.host);

    togglePanel = document.createElement('div');
    togglePanel.id = 'flbotTogglePanel';
    togglePanel.style.cssText = `
      position: fixed;
      bottom: 280px;
      right: 10px;
      background: rgba(25, 25, 25, 0.95);
      color: #fff;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 8px;
      width: 260px;
      z-index: 9999997;
      box-shadow: 0 0 10px #000;
      border: 2px solid ${isEnabled ? '#4a9' : '#a94'};
    `;

    togglePanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 8px; text-align: center; color: #fff;">
        🎮 DICE BOT CONTROL - ${currentSite.host}
      </div>
      <div style="display: flex; gap: 5px; margin-bottom: 8px;">
        <button id="flbot-toggle-on" style="
          flex: 1;
          background: ${isEnabled ? '#4a9' : '#444'};
          color: #fff;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
          transition: all 0.2s ease;
        ">ON</button>
        <button id="flbot-toggle-off" style="
          flex: 1;
          background: ${!isEnabled ? '#a94' : '#444'};
          color: #fff;
          border: none;
          padding: 6px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          font-size: 12px;
          transition: all 0.2s ease;
        ">OFF</button>
      </div>
      <div style="text-align: center; font-size: 11px; color: #ccc;">
        Current: <span id="flbot-toggle-status" style="color: ${isEnabled ? '#4a9' : '#a94'}; font-weight: bold;">
          ${isEnabled ? 'ON' : 'OFF'}
        </span>
      </div>
    `;

    document.body.appendChild(togglePanel);
    updateTogglePanelPosition();

    // Event listeners za toggle dugmad
    const onBtn = document.getElementById('flbot-toggle-on');
    const offBtn = document.getElementById('flbot-toggle-off');
    const toggleStatus = document.getElementById('flbot-toggle-status');

    if (onBtn) {
      onBtn.addEventListener('click', () => {
        saveDiceBotState(currentSite.host, true);

        // Ažuriraj UI
        onBtn.style.background = '#4a9';
        offBtn.style.background = '#444';
        toggleStatus.textContent = 'ON';
        toggleStatus.style.color = '#4a9';
        togglePanel.style.border = '2px solid #4a9';

        console.log(`[FLBOT] Dice bot za ${currentSite.host} UKLJUČEN`);
        updatePanel();
      });
    }

    if (offBtn) {
      offBtn.addEventListener('click', () => {
        saveDiceBotState(currentSite.host, false);

        // Ažuriraj UI
        offBtn.style.background = '#a94';
        onBtn.style.background = '#444';
        toggleStatus.textContent = 'OFF';
        toggleStatus.style.color = '#a94';
        togglePanel.style.border = '2px solid #a94';

        console.log(`[FLBOT] Dice bot za ${currentSite.host} ISKLJUČEN`);
        updatePanel();
      });
    }

    return togglePanel;
  }

  function createDicePanel() {
    if (dicePanel) return dicePanel;

    const site = getCurrentSite();
    if (!site) return null;

    const currentBalance = getCurrentBalance();
    let stats = loadStats();
    let { profit, totalBet, rolls, wins, losses } = stats;

    dicePanel = document.createElement('div');
    dicePanel.id = 'flbotDicePanel';
    dicePanel.style.cssText = `
      position: fixed;
      bottom: 360px;
      right: 10px;
      background: rgba(17, 17, 17, 0.95);
      color: #4a9;
      font-family: monospace;
      font-size: 12px;
      padding: 10px;
      border-radius: 8px;
      width: 260px;
      z-index: 9999998;
      box-shadow: 0 0 10px #000;
      border: 2px solid #4a9;
    `;

    dicePanel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 6px; text-align: center; color: #4a9;">🎲 DICE BOT - ${site.host}</div>
      <div>Balance: <span id="flbot-balance-display">${currentBalance.toFixed(8)}</span></div>
      <div>Rolls: <span id="flbot-rolls">${rolls}</span></div>
      <div>Wins: <span id="flbot-wins">${wins}</span></div>
      <div>Losses: <span id="flbot-losses">${losses}</span></div>
      <div>Profit: <span id="flbot-profit">${profit.toFixed(8)}</span></div>
      <div>Total Bet: <span id="flbot-total">${totalBet.toFixed(8)}</span></div>
      <button id="flbot-reset" style="background:#a94;color:#fff;border:none;padding:5px;margin-top:5px;border-radius:4px;cursor:pointer;width:100%;">Reset Stats</button>
    `;

    document.body.appendChild(dicePanel);
    updateDicePanelPosition();

    return dicePanel;
  }

  function createPanel() {
    console.log("[FLBOT] Kreiram glavni panel...");

    const panel = document.createElement("div");
    panel.id = "flbotPanel";
    panel.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      background: rgba(0,0,0,0.8);
      color: #fff;
      font-family: Arial, sans-serif;
      font-size: 12px;
      padding: 10px;
      border-radius: 8px;
      width: auto;
      min-width: 260px;
      max-width: 100%;
      max-height: none;
      overflow-y: visible;
      z-index: 9999999;
      box-shadow: 0 0 10px #000;
    `;

    panel.innerHTML = `
      <div style="font-weight: bold; margin-bottom: 6px; text-align: center;">FLBOT Panel v1.2.3</div>
      <div>Tab Status: <span id="flbotFocusStatus" style="color: #4a9;">Active</span></div>
      <div>Countdown: <span id="flbotCountdown">${countdown}</span>s</div>
      <div>Status: <span id="flbotStatus">Čekam...</span></div>
      <div>Balance: <span id="flbotBalance">Provjeram...</span></div>
      <div style="margin-top: 8px; font-weight: bold;">Sajtovi:</div>
      <ul id="flbotSiteList" style="padding-left: 18px; margin: 4px 0 0 0; white-space: nowrap;"></ul>

      <div id="flbot-step1" style="
        position: absolute;
        top: 90px;
        left: 170px;
        color: white;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
      ">
        Step 1<br>
        <span style="font-size: 20px; color: #4a9;">↓</span>
      </div>

      <button id="flbot-play" disabled style="
        margin-top: 10px;
        background: gray;
        color: white;
        border: none;
        padding: 6px 50px;
        font-size: 14px;
        font-weight: bold;
        border-radius: 4px;
        cursor: not-allowed;
        display: block;
        margin-left:auto;
        margin-right: 0;
      ">Auto Play</button>

      <div id="flbot-Step2" style="
        position: absolute;
        bottom: 10px;
        left: 20%;
        transform: translateX(-50%);
        color: white;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        line-height: 1.2;
      ">
        <span style="font-size: 12px; font-weight: bold;">Step 2</span>
        <span style="font-size: 20px; margin-left: 5px; color: #4a9;">→</span>
      </div>
    `;

    document.body.appendChild(panel);
    console.log("[FLBOT] Panel kreiran i dodat na stranicu");

    if (window.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        updateDicePanelPosition();
        updateTogglePanelPosition();
      });
      resizeObserver.observe(panel);
    }
  }

  function updatePanel() {
    const countdownEl = document.getElementById("flbotCountdown");
    if (countdownEl) countdownEl.textContent = countdown;

    const statusEl = document.getElementById("flbotStatus");
    if (statusEl) {
      statusEl.textContent = botIsPlaying ? "Bot igra..." : "Čekam...";
      statusEl.style.color = botIsPlaying ? "#4a9" : "#fff";
    }

    const focusStatusEl = document.getElementById("flbotFocusStatus");
    if (focusStatusEl) {
      focusStatusEl.textContent = document.hidden ? "Inactive" : "Active";
      focusStatusEl.style.color = document.hidden ? "#a94" : "#4a9";
    }

    const balanceEl = document.getElementById("flbotBalance");
    if (balanceEl) {
      const currentBalance = getCurrentBalance();
      if (currentBalance > 0) {
        balanceEl.textContent = currentBalance.toFixed(8);
        balanceEl.style.color = "#4a9";
      } else {
        balanceEl.textContent = "0 ili N/A";
        balanceEl.style.color = "#a94";
      }
    }

    const siteListEl = document.getElementById("flbotSiteList");
    if (!siteListEl) return;

    siteListEl.innerHTML = "";
    const currentSite = getCurrentSite();

    // Dodajemo sve postojeće sajtove
    sites.forEach((site, i) => {
      const li = document.createElement("li");
      li.style.cssText = `
        cursor: default;
        padding: 2px 6px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      `;
      li.title = site.mainUrl || site.aff;

      const siteText = document.createElement("span");
      const diceBotStatus = site.host === "freebitco.in" ? "" : (isDiceBotEnabled(site.host) ? " ON" : " OFF");
      const statusColor = site.host === "freebitco.in" ? "" : (isDiceBotEnabled(site.host) ? "color: #4a9;" : "color: #a94;");
      siteText.innerHTML = `${i + 1}. ${site.host}<span style="${statusColor} font-weight: bold;">${diceBotStatus}</span>`;

      const regBtn = document.createElement("button");
      regBtn.textContent = "REG";
      regBtn.style.cssText = `
        background: #333;
        color: #fff;
        border: 1px solid #555;
        padding: 2px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 10px;
        margin-left: 5px;
        min-width: 105px;
        height: 20px;
        transition: transform 0.2s ease;
      `;

      regBtn.onmouseover = () => regBtn.style.transform = "scale(1.1)";
      regBtn.onmouseout = () => regBtn.style.transform = "scale(1)";
      regBtn.onclick = () => location.href = site.aff;

      li.appendChild(siteText);
      li.appendChild(regBtn);

      if (site === currentSite) {
        li.style.backgroundColor = "#4a9";
        li.style.fontWeight = "bold";
        li.style.color = "#fff";
      } else {
        li.style.backgroundColor = "transparent";
        li.style.color = "#ccc";
      }

      siteListEl.appendChild(li);
    });

    // Dodajemo "soon" sajt na kraju liste
    const soonLi = document.createElement("li");
    soonLi.style.cssText = `
      cursor: default;
      padding: 2px 6px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ccc;
    `;

    const soonText = document.createElement("span");
    soonText.innerHTML = `17. soon`;

    const disabledRegBtn = document.createElement("button");
    disabledRegBtn.textContent = "REG";
    disabledRegBtn.style.cssText = `
      background: #222;
      color: #666;
      border: 1px solid #333;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      margin-left: 5px;
      min-width: 105px;
      height: 20px;
      cursor: not-allowed;
    `;
    disabledRegBtn.disabled = true;

    soonLi.appendChild(soonText);
    soonLi.appendChild(disabledRegBtn);
    siteListEl.appendChild(soonLi);

    updateDicePanelPosition();
    updateTogglePanelPosition();
  }

  function startCountdown() {
    console.log("[FLBOT] Pokrećem countdown timer...");

    const timer = setInterval(() => {
      countdown--;
      updatePanel();

      if (countdown <= 10 && !wentToDice) {
        const site = getCurrentSite();
        if (site) {
          if (site.host === "freebitco.in") {
            wentToDice = true;
            const next = nextSite();
            location.href = next.mainUrl || next.aff;
            clearInterval(timer);
          } else if (!location.href.includes("/dice") && !location.href.includes("/games/dice")) {
            // Proverava da li je dice bot uključen pre prelaska na dice stranicu
            if (isDiceBotEnabled(site.host)) {
              wentToDice = true;
              console.log(`[FLBOT] Idem na dice stranicu: ${site.dice} (dice bot ON)`);
              location.href = site.dice;
              clearInterval(timer);
            } else {
              console.log(`[FLBOT] Dice bot je OFF za ${site.host}, prelazim na sledeći sajt`);
              wentToDice = true;
              const next = nextSite();
              location.href = next.mainUrl || next.aff;
              clearInterval(timer);
            }
          }
        }
      }

      if (countdown <= 0) {
        if (diceBotActive) {
          console.log("[FLBOT] ⚠️ Dice bot je aktivan - neću prebaciti na sljedeći sajt zbog timeout-a");
          return;
        }

        const next = nextSite();
        location.href = next.mainUrl || next.aff;
        clearInterval(timer);
      }
    }, 1000);
  }

  function startDiceTimeout() {
    console.log('[FLBOT] Pokrećem 10-sekundni timeout za dice...');
    setTimeout(() => {
      if (!botIsPlaying) {
        console.log('[FLBOT] ⏰ Timeout - bot ne igra, prelazim na sledeći sajt');
        const next = nextSite();
        location.href = next.mainUrl || next.aff;
      } else {
        console.log('[FLBOT] Bot igra, ne prekidam...');
      }
    }, 10000);
  }

  const TURNSTILE_RESPONSE_SELECTOR = 'input[name="cf-turnstile-response"]';
  const CLAIM_BUTTON_TEXT = 'claim';
  let isClaimClicked = false;

  function isVerificationComplete() {
    const input = document.querySelector(TURNSTILE_RESPONSE_SELECTOR);
    return input && input.value.trim() !== '';
  }

  function clickClaimButton() {
    if (isClaimClicked) return;
    const buttons = Array.from(document.querySelectorAll('button, input[type="submit"], input[type="button"]'));
    for (const btn of buttons) {
      const text = (btn.textContent || btn.value || "").trim().toLowerCase();
      if (text === CLAIM_BUTTON_TEXT) {
        console.log("[FLBOT] Verifikacija ok, klik na Claim dugme");
        btn.click();
        isClaimClicked = true;
        break;
      }
    }
  }

  function checkClaimLoop() {
    if (isVerificationComplete()) {
      clickClaimButton();
    } else {
      console.log("[FLBOT] Čekam turnstile verifikaciju...");
    }
  }

  function waitForEl(selector, callback, maxAttempts = 20) {
    let attempts = 0;
    const checkElement = () => {
      const el = document.querySelector(selector);
      if (el) return callback(el);
      attempts++;
      if (attempts < maxAttempts) setTimeout(checkElement, 500);
      else console.warn(`[FLBOT] Element ${selector} nije pronađen nakon ${maxAttempts} pokušaja`);
    };
    checkElement();
  }

  function getIframeDocument(iframe) {
    try {
      return iframe.contentDocument || iframe.contentWindow.document;
    } catch (e) {
      console.error("[FLBOT] Greška pri pristupu iframe dokumentu:", e);
      return null;
    }
  }

  function getDiceElements() {
    const currentSite = getCurrentSite();
    if (!currentSite) return null;

    if (currentSite.usesIframe) {
      const iframe = document.querySelector('iframe');
      if (!iframe) return null;

      const iframeDoc = getIframeDocument(iframe);
      if (!iframeDoc) return null;

      return {
        betInput: iframeDoc.querySelector('#bet_amount'),
        rollBtn: iframeDoc.querySelector('#roll_dice'),
        resultSpan: iframeDoc.querySelector('.result_maker span')
      };
    } else {
      return {
        betInput: document.querySelector('#bet_amount'),
        rollBtn: document.querySelector('#roll_dice'),
        resultSpan: document.querySelector('.result_maker span')
      };
    }
  }

  function startDiceBot() {
    console.log('[FLBOT] Pokrećem dice bot...');

    const site = getCurrentSite();
    if (!site) return;

    // Proverava da li je dice bot uključen za trenutni sajt
    if (!isDiceBotEnabled(site.host)) {
      console.log(`[FLBOT] ⚠️ Dice bot je isključen za ${site.host}, prelazim na sledeći sajt`);
      setTimeout(() => {
        const next = nextSite();
        location.href = next.mainUrl || next.aff;
      }, 3000);
      return;
    }

    const currentBalance = getCurrentBalance();
    const requiredBet = site.minBet;

    if (!isBalanceSufficient(currentBalance, requiredBet)) {
      console.log(`[FLBOT] ⚠️ Nedovoljan balans! Trenutni: ${currentBalance}, Potreban: ${requiredBet * 10}`);
      switchToNextSiteDueToBalance();
      return;
    }

    botIsPlaying = true;
    diceBotActive = true;
    updatePanel();

    baseBet = site.minBet;
    currentBet = baseBet;
    winChance = 49.5;
    high = true;
    autoMode = true;

    let stats = loadStats();
    let { profit, totalBet, rolls, wins, losses } = stats;

    createDicePanel();

    const resetBtn = document.getElementById('flbot-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetStats();
        profit = 0;
        totalBet = 0;
        rolls = 0;
        wins = 0;
        losses = 0;
        updateDisplay();
        console.log('[FLBOT] Statistike resetovane');
      });
    }

    const updateDisplay = () => {
      const currentStats = loadStats();
      const rollsEl = document.getElementById('flbot-rolls');
      const winsEl = document.getElementById('flbot-wins');
      const lossesEl = document.getElementById('flbot-losses');
      const profitEl = document.getElementById('flbot-profit');
      const totalEl = document.getElementById('flbot-total');
      const balanceDisplayEl = document.getElementById('flbot-balance-display');

      if (rollsEl) rollsEl.textContent = currentStats.rolls;
      if (winsEl) winsEl.textContent = currentStats.wins;
      if (lossesEl) lossesEl.textContent = currentStats.losses;
      if (profitEl) profitEl.textContent = currentStats.profit.toFixed(8);
      if (totalEl) totalEl.textContent = currentStats.totalBet.toFixed(8);

      const newBalance = getCurrentBalance();
      if (balanceDisplayEl) {
        balanceDisplayEl.textContent = newBalance.toFixed(8);
      }
    };

    const play = () => {
      if (!autoMode) return;

      // Proverava ponovo da li je dice bot još uvek uključen
      if (!isDiceBotEnabled(site.host)) {
        console.log(`[FLBOT] ⚠️ Dice bot je isključen tokom igre za ${site.host}, prekidam`);
        botIsPlaying = false;
        diceBotActive = false;
        autoMode = false;
        setTimeout(() => {
          const next = nextSite();
          location.href = next.mainUrl || next.aff;
        }, 3000);
        return;
      }

      const diceElements = getDiceElements();
      if (!diceElements || !diceElements.betInput || !diceElements.rollBtn || !diceElements.resultSpan) {
        console.warn('[FLBOT] Nedostaju elementi za dice igru');
        setTimeout(play, 5000);
        return;
      }

      const currentBalance = getCurrentBalance();
      if (!isBalanceSufficient(currentBalance, currentBet)) {
        console.log(`[FLBOT] ⚠️ Nedovoljan balans za bet ${currentBet}! Trenutni balans: ${currentBalance}`);
        botIsPlaying = false;
        diceBotActive = false;
        setTimeout(() => {
          const next = nextSite();
          location.href = next.mainUrl || next.aff;
        }, 10000);
        return;
      }

      try {
        diceElements.betInput.value = currentBet.toFixed(8);
      } catch (e) {
        console.error('[FLBOT] Greška pri postavljanju vrednosti bet-a:', e);
        setTimeout(play, 5000);
        return;
      }

      console.log("[FLBOT] ⏳ Čekam 10 sekundi prije klika na ROLL DICE...");
      setTimeout(() => {
        const balanceBeforeRoll = getCurrentBalance();
        if (!isBalanceSufficient(balanceBeforeRoll, currentBet)) {
          console.log(`[FLBOT] ⚠️ Balans se promijenio! Čekam 10s...`);
          setTimeout(play, 10000);
          return;
        }

        try {
          diceElements.rollBtn.click();
          console.log("[FLBOT] 🎲 Kliknuo ROLL DICE");

          setTimeout(() => {
            try {
              const resultText = diceElements.resultSpan.textContent;
              const result = parseFloat(resultText);
              if (isNaN(result)) {
                console.warn('[FLBOT] Nevalidan rezultat:', resultText);
                setTimeout(play, 5000);
                return;
              }

              totalBet += currentBet;

              const isWin = (high && result > 100 - winChance) || (!high && result < winChance);
              if (isWin) {
                wins++;
                profit += currentBet * (100 / winChance - 1);
                currentBet = baseBet;

                rolls++;
                const newStats = { profit, totalBet, rolls, wins, losses };
                const mergedStats = mergeStats(loadStats(), newStats);
                saveStats(mergedStats);
                updateDisplay();

                console.log('[FLBOT] ✅ WIN - Čekam 10s i rotiram sajt');
                botIsPlaying = false;
                diceBotActive = false;
                autoMode = false;

                setTimeout(() => {
                  const next = nextSite();
                  location.href = next.mainUrl || next.aff;
                }, 10000);
                return;
              } else {
                losses++;
                currentBet *= 2;

                const nextBalance = getCurrentBalance();
                if (!isBalanceSufficient(nextBalance, currentBet)) {
                  console.log(`[FLBOT] ⚠️ Sljedeći bet prevelik. Čekam 10s i rotiram`);
                  const newStats = { profit, totalBet, rolls, wins, losses };
                  const mergedStats = mergeStats(loadStats(), newStats);
                  saveStats(mergedStats);
                  botIsPlaying = false;
                  diceBotActive = false;
                  autoMode = false;

                  setTimeout(() => {
                    const next = nextSite();
                    location.href = next.mainUrl || next.aff;
                  }, 10000);
                  return;
                }
              }

              rolls++;
              const newStats = { profit, totalBet, rolls, wins, losses };
              const mergedStats = mergeStats(loadStats(), newStats);
              saveStats(mergedStats);
              updateDisplay();

              if (autoMode) setTimeout(play, 10000);
            } catch (e) {
              console.error('[FLBOT] Greška pri obradi rezultata:', e);
              setTimeout(play, 10000);
            }
          }, 1500);
        } catch (e) {
          console.error('[FLBOT] Greška pri kliku na roll dugme:', e);
          setTimeout(play, 10000);
        }
      }, 10000);
    };

    play();
  }

  function handleFreeBitcoin() {
    function clickFreeBtcAfterDelay() {
      const freePlayBtn = document.getElementById("free_play_form_button");
      if (freePlayBtn && !freePlayBtn.disabled) {
        console.log("[FLBOT] Čekam 30 sekundi pre klika FREE BTC dugmeta na freebitco.in");
        setTimeout(() => {
          console.log("[FLBOT] Klikćem FREE BTC dugme na freebitco.in");
          freePlayBtn.click();
        }, 30000);
      } else {
        setTimeout(clickFreeBtcAfterDelay, 1000);
      }
    }
    clickFreeBtcAfterDelay();
  }

  // Glavna inicijalizacija
  try {
    console.log("[FLBOT] Pokrećem glavnu inicijalizaciju...");

    // Kreiraj panel
    createPanel();

    const currentIndex = getCurrentIndex();
    if (currentIndex !== -1) {
      index = currentIndex;
      localStorage.setItem("flbot_index", index);
    }

    const currentSite = getCurrentSite();
    console.log("[FLBOT] Trenutna lokacija:", location.href);

    // For freetrump.in, always use the faucet URL as main page
    if (currentSite && currentSite.host === "freetrump.in" && !location.href.includes("/faucet") && !location.href.includes("/games/dice")) {
      console.log("[FLBOT] Redirecting freetrump.in to faucet page");
      location.href = currentSite.mainUrl;
      return;
    }

    // Kreiraj toggle panel
    createTogglePanel();

    if (currentSite && (location.href.includes("/dice") || location.href.includes("/games/dice"))) {
      console.log("[FLBOT] Detektovana dice stranica");

      // Proverava da li je dice bot uključen pre pokretanja
      if (!isDiceBotEnabled(currentSite.host)) {
        console.log(`[FLBOT] ⚠️ Dice bot je isključen za ${currentSite.host}, prelazim na sledeći sajt`);
        setTimeout(() => {
          const next = nextSite();
          location.href = next.mainUrl || next.aff;
        }, 3000);
        return;
      }

      startDiceTimeout();

      if (currentSite.usesIframe) {
        console.log('[FLBOT] Detektovana dice stranica sa iframe-om');
        const waitForIframe = setInterval(() => {
          const iframe = document.querySelector("iframe");
          if (iframe) {
            clearInterval(waitForIframe);
            console.log("[FLBOT] Iframe pronađen, pokrećem dice bot");
            setTimeout(() => {
              startDiceBot();
            }, 3000);
          }
        }, 1000);
      } else {
        console.log('[FLBOT] Detektovana dice stranica bez iframe-a');
        waitForEl("#bet_amount", () => {
          waitForEl("#roll_dice", () => {
            waitForEl(".result_maker span", startDiceBot);
          });
        });
      }
    } else {
      console.log("[FLBOT] Pokrećem countdown na glavnoj stranici");
      startCountdown();
      setInterval(checkClaimLoop, 3000);

      if (location.hostname.includes("freebitco.in")) {
        handleFreeBitcoin();
      }
    }

    updatePanel();

    setInterval(updatePanel, 5000);

    setInterval(() => {
      if (document.hidden) {
        window.focus();
      }
    }, 5000);

    console.log("[FLBOT] ✅ Skripta uspešno pokrenuta!");

  } catch (error) {
    console.error("[FLBOT] ❌ Greška pri pokretanju skripte:", error);
  }

})();