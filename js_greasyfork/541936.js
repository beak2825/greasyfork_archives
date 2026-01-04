// ==UserScript==
// @name       Auto Fight Test
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Auto Fight
// @match        *://*.bots4.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541936/Auto%20Fight%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/541936/Auto%20Fight%20Test.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STATS_KEY = 'bots4HUDStats';
  const PAUSE_KEY = 'bots4HUDPaused';
  const BRIGHTNESS_THRESHOLD = 100;
  let isBusy = false;

  let stats = JSON.parse(sessionStorage.getItem(STATS_KEY)) || {
    start: Date.now(),
    fights: 0,
    energy: 0,
    xp: 0,
    kudos: 0,
    broken: 0
  };
  let isPaused = sessionStorage.getItem(PAUSE_KEY) === 'true';
  const saveStats = () => sessionStorage.setItem(STATS_KEY, JSON.stringify(stats));

  function buildHUD() {
    if (document.getElementById('bot4hud-panel')) return;
    const wrapper = document.createElement('div');
    wrapper.id = 'bot4hud-panel';
    wrapper.style = `
      position:fixed;top:20px;left:20px;z-index:9999;
      background:#111;color:#0f0;padding:10px;
      font:12px monospace;border:1px solid lime;
      border-radius:6px;box-shadow:0 0 8px lime;
    `;
    wrapper.innerHTML = `
      <b>⚔️ bots4 HUD</b><br>
      Time: <span id="hud-time">0:00</span><br>
      Fights: <span id="hud-fights">0</span><br>
      Energy: <span id="hud-energy">0</span><br>
      XP: <span id="hud-xp">0</span><br>
      Repairs: <span id="hud-kudos">0</span><br>
      Broken: <span id="hud-broken">0</span><br>
      <button id="pauseBtn">⏸️ Pause</button>
      <button id="resetBtn">♻️ Reset</button>
    `;
    document.body.appendChild(wrapper);

    document.getElementById('pauseBtn').onclick = () => {
      isPaused = !isPaused;
      sessionStorage.setItem(PAUSE_KEY, isPaused);
      document.getElementById('pauseBtn').textContent = isPaused ? '▶️ Resume' : '⏸️ Pause';
    };

    document.getElementById('resetBtn').onclick = () => {
      stats = { start: Date.now(), fights: 0, energy: 0, xp: 0, kudos: 0, broken: 0 };
      saveStats();
    };

    setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - stats.start) / 1000);
      document.getElementById('hud-time').textContent = `${Math.floor(elapsed / 60)}:${(elapsed % 60).toString().padStart(2, '0')}`;
      document.getElementById('hud-fights').textContent = stats.fights;
      document.getElementById('hud-energy').textContent = stats.energy;
      document.getElementById('hud-xp').textContent = stats.xp;
      document.getElementById('hud-kudos').textContent = stats.kudos;
      document.getElementById('hud-broken').textContent = stats.broken;
    }, 1000);
  }

  function parseBattleText(txt) {
    if (/gives you (\d+) energy/i.test(txt)) stats.energy += parseInt(RegExp.$1);
    if (/gains? (\d+) experience/i.test(txt)) stats.xp += parseInt(RegExp.$1);
    if (/repair costs of ([\d,]+) kudos/i.test(txt)) stats.kudos += parseInt(RegExp.$1.replace(/,/g, ''));
    if (/cannot be repaired any further/i.test(txt)) stats.broken += 1;
    saveStats();
  }

  const getRGB = str => {
    const m = str.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return m ? { r: +m[1], g: +m[2], b: +m[3] } : { r: 0, g: 0, b: 0 };
  };
  const getLuminance = ({ r, g, b }) =>
    0.2126 * r + 0.7152 * g + 0.0722 * b;

  const getBrightest = links => {
    const scored = links.map(link => ({
      link,
      lum: getLuminance(getRGB(getComputedStyle(link).color))
    })).filter(s => s.lum > BRIGHTNESS_THRESHOLD);
    return scored.sort((a, b) => b.lum - a.lum)[0]?.link || null;
  };

  const throttleJump = href => {
    if (isBusy || isPaused || !href) return;
    isBusy = true;
    const delay = 1200 + Math.random() * 600;
    setTimeout(() => {
      stats.fights++;
      saveStats();
      window.location.href = href;
    }, delay);
  };

  const clickBackToList = () => {
    const link = [...document.querySelectorAll('a')].find(a => /back to fight list/i.test(a.textContent));
    if (link?.href) throttleJump(link.href);
  };

  function handleBattle() {
    const txt = document.body.innerText;
    parseBattleText(txt);

    const exhausted = /\(\s*0\s+remaining\s*\)/i.test(txt);
    const rematchLinks = [...document.querySelectorAll('a.battle-link')]
      .filter(a => /fight/i.test(a.textContent) && /\/fight\/\d+\/\d+\/\d+$/.test(a.href));

    const bright = getBrightest(rematchLinks);
    const fallback = rematchLinks[0];

    if (exhausted) return clickBackToList();
    if (bright) return throttleJump(bright.href);
    if (fallback) return throttleJump(fallback.href);
    return clickBackToList();
  }

  function handleFightList() {
    const rows = [...document.querySelectorAll('tr.botrow')];
    for (const row of rows) {
      const td = row.querySelectorAll('td');
      const ratio = td[10]?.innerText.trim();
      const energy = parseInt(td[6]?.innerText.trim());
      const numericRatio = parseFloat(ratio);

      if (isNaN(numericRatio) || numericRatio < 0 || numericRatio > 0.6 || isNaN(energy) || energy <= 0) continue;
      const links = [...td[12]?.querySelectorAll('a') || []];
      const target = getBrightest(links);
      if (target) return throttleJump(target.href);
    }
  }

  const detectPage = () => {
    if (isBusy || isPaused) return;
    const txt = document.body.innerText.toLowerCase();
    if (txt.includes('the battle is over')) handleBattle();
    else if (txt.includes('ratio') && txt.includes('energy')) handleFightList();
  };

  buildHUD();
  detectPage();
  new MutationObserver(detectPage).observe(document.body, { childList: true, subtree: true });
})();