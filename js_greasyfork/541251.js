// ==UserScript==
// @name         Auto Recruit Units with UI & Countdown
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Recruit otomatis dengan UI lengkap, countdown, dan persistent state
// @match        https://*.tribalwars.net/game.php?village=*&screen=train*
// @match        https://*.tribalwars.net/game.php?village=*&screen=train&*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541251/Auto%20Recruit%20Units%20with%20UI%20%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/541251/Auto%20Recruit%20Units%20with%20UI%20%20Countdown.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ============== VARIABLE & STORAGE =============== ***/
  const qs = new URLSearchParams(window.location.search);
  const villageId = qs.get('village') || 'unknown';
  const STORAGE_KEY_BASE = `TW_AUTO_RECRUIT_${villageId}`;
  
  const LS = {
    lastRun: `${STORAGE_KEY_BASE}_LAST_RUN_TS`,
    lastInterval: `${STORAGE_KEY_BASE}_LAST_INTERVAL_MS`,
    isRunning: `${STORAGE_KEY_BASE}_IS_RUNNING`,
    nextScheduledTime: `${STORAGE_KEY_BASE}_NEXT_SCHEDULED_TIME`,
    spearEnabled: `${STORAGE_KEY_BASE}_SPEAR_ENABLED`,
    lightEnabled: `${STORAGE_KEY_BASE}_LIGHT_ENABLED`,
    swordEnabled: `${STORAGE_KEY_BASE}_SWORD_ENABLED`,
    archerEnabled: `${STORAGE_KEY_BASE}_ARCHER_ENABLED`,
    spearCount: `${STORAGE_KEY_BASE}_SPEAR_COUNT`,
    lightCount: `${STORAGE_KEY_BASE}_LIGHT_COUNT`,
    swordCount: `${STORAGE_KEY_BASE}_SWORD_COUNT`,
    archerCount: `${STORAGE_KEY_BASE}_ARCHER_COUNT`,
    minMinutes: `${STORAGE_KEY_BASE}_MIN_MINUTES`,
    maxMinutes: `${STORAGE_KEY_BASE}_MAX_MINUTES`,
  };

  let timeoutId = null;
  let countdownIntervalId = null;
  let settingsPopup = null;

  // Default settings
  let settings = {
    spearEnabled: true,
    lightEnabled: true,
    swordEnabled: false,
    archerEnabled: false,
    spearCount: 6,
    lightCount: 3,
    swordCount: 0,
    archerCount: 0,
    minMinutes: 30,
    maxMinutes: 37,
  };

  /*** ============== UTILITY FUNCTIONS =============== ***/
  const now = () => Date.now();
  const ts = (t = now()) => new Date(t).toLocaleString();
  const log = (m, x) => x === undefined
    ? console.log(`[${ts()}] ${m}`)
    : console.log(`[${ts()}] ${m}`, x);

  const readInt = (k) => {
    const v = localStorage.getItem(k);
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  const readBool = (k, def = false) => {
    const v = localStorage.getItem(k);
    if (v === null) return def;
    return v === 'true';
  };

  const saveLastRun = (t) => localStorage.setItem(LS.lastRun, String(t));
  const saveLastInterval = (ms) => localStorage.setItem(LS.lastInterval, String(ms));
  const saveNextScheduledTime = (t) => localStorage.setItem(LS.nextScheduledTime, String(t));
  const getLastRun = () => readInt(LS.lastRun);
  const getLastInterval = () => readInt(LS.lastInterval);
  const getNextScheduledTime = () => readInt(LS.nextScheduledTime);
  const getIsRunning = () => readBool(LS.isRunning, false);
  const setIsRunning = (val) => localStorage.setItem(LS.isRunning, String(val));

  function formatCountdown(ms) {
    if (ms <= 0) return '00:00:00';
    
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    const h = String(hours).padStart(2, '0');
    const m = String(minutes % 60).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    
    return `${h}:${m}:${s}`;
  }

  /*** ============== SETTINGS FUNCTIONS =============== ***/
  function loadSettings() {
    settings.spearEnabled = readBool(LS.spearEnabled, true);
    settings.lightEnabled = readBool(LS.lightEnabled, true);
    settings.swordEnabled = readBool(LS.swordEnabled, false);
    settings.archerEnabled = readBool(LS.archerEnabled, false);
    settings.spearCount = readInt(LS.spearCount) || 6;
    settings.lightCount = readInt(LS.lightCount) || 3;
    settings.swordCount = readInt(LS.swordCount) || 0;
    settings.archerCount = readInt(LS.archerCount) || 0;
    settings.minMinutes = readInt(LS.minMinutes) || 30;
    settings.maxMinutes = readInt(LS.maxMinutes) || 37;
  }

  function saveSettings() {
    localStorage.setItem(LS.spearEnabled, String(settings.spearEnabled));
    localStorage.setItem(LS.lightEnabled, String(settings.lightEnabled));
    localStorage.setItem(LS.swordEnabled, String(settings.swordEnabled));
    localStorage.setItem(LS.archerEnabled, String(settings.archerEnabled));
    localStorage.setItem(LS.spearCount, String(settings.spearCount));
    localStorage.setItem(LS.lightCount, String(settings.lightCount));
    localStorage.setItem(LS.swordCount, String(settings.swordCount));
    localStorage.setItem(LS.archerCount, String(settings.archerCount));
    localStorage.setItem(LS.minMinutes, String(settings.minMinutes));
    localStorage.setItem(LS.maxMinutes, String(settings.maxMinutes));
  }

  const nextIntervalMs = () => {
    const minutes = Math.floor(
      Math.random() * (settings.maxMinutes - settings.minMinutes + 1)
    ) + settings.minMinutes;
    const ms = minutes * 60 * 1000;
    log(`Interval baru: ${minutes} menit (${ms} ms).`);
    return ms;
  };

  /*** ============== COUNTDOWN DISPLAY ================ ***/
  function startCountdownDisplay() {
    stopCountdownDisplay();
    
    countdownIntervalId = setInterval(() => {
      const nextTime = getNextScheduledTime();
      if (!nextTime || !getIsRunning()) {
        updateStatusDisplay('Stopped', '');
        return;
      }
      
      const remaining = nextTime - now();
      if (remaining <= 0) {
        updateStatusDisplay('Running...', '00:00:00');
      } else {
        const countdown = formatCountdown(remaining);
        updateStatusDisplay('Next recruit in', countdown);
      }
    }, 1000);
  }

  function stopCountdownDisplay() {
    if (countdownIntervalId !== null) {
      clearInterval(countdownIntervalId);
      countdownIntervalId = null;
    }
  }

  /*** ============== RECRUIT LOGIC ================ ***/
  function findElements() {
    const spearInput = document.querySelector('input[name="spear"]');
    const lightInput = document.querySelector('input[name="light"]');
    const swordInput = document.querySelector('input[name="sword"]');
    const archerInput = document.querySelector('input[name="archer"]');

    const recruitButton =
      document.querySelector('.btn-recruit[value="Recruit"]') ||
      document.querySelector('input.btn-recruit[type="submit"]') ||
      document.querySelector('button.btn-recruit') ||
      document.querySelector('input[type="submit"][value="Recruit"]');

    return { spearInput, lightInput, swordInput, archerInput, recruitButton };
  }

  function recruitOnce() {
    const { spearInput, lightInput, swordInput, archerInput, recruitButton } = findElements();
    
    if (!recruitButton) {
      log('Tombol recruit tidak ditemukan.');
      return false;
    }

    let recruited = false;

    if (settings.spearEnabled && spearInput) {
      spearInput.value = String(settings.spearCount);
      recruited = true;
    }

    if (settings.lightEnabled && lightInput) {
      lightInput.value = String(settings.lightCount);
      recruited = true;
    }

    if (settings.swordEnabled && swordInput) {
      swordInput.value = String(settings.swordCount);
      recruited = true;
    }

    if (settings.archerEnabled && archerInput) {
      archerInput.value = String(settings.archerCount);
      recruited = true;
    }

    if (!recruited) {
      log('Tidak ada unit yang dipilih untuk direkrut.');
      return false;
    }

    recruitButton.click();
    
    let recruitedUnits = [];
    if (settings.spearEnabled && settings.spearCount > 0) recruitedUnits.push(`${settings.spearCount} spear`);
    if (settings.lightEnabled && settings.lightCount > 0) recruitedUnits.push(`${settings.lightCount} light`);
    if (settings.swordEnabled && settings.swordCount > 0) recruitedUnits.push(`${settings.swordCount} sword`);
    if (settings.archerEnabled && settings.archerCount > 0) recruitedUnits.push(`${settings.archerCount} archer`);
    
    log(`Rekrut dijalankan: ${recruitedUnits.join(', ')}.`);
    return true;
  }

  /*** ============== SCHEDULING ================== ***/
  function scheduleNext(delayMs) {
    if (!getIsRunning()) {
      log('Auto recruit dihentikan.');
      stopCountdownDisplay();
      return;
    }

    const nextTime = now() + delayMs;
    saveNextScheduledTime(nextTime);
    
    const min = (delayMs / 60000).toFixed(2);
    log(`Jadwal berikutnya dalam ${min} menit (${ts(nextTime)}).`);

    timeoutId = setTimeout(() => {
      const ok = recruitOnce();
      if (ok) {
        const t = now();
        saveLastRun(t);
        log(`lastRun disimpan: ${ts(t)}`);
      }
      const interval = nextIntervalMs();
      saveLastInterval(interval);
      scheduleNext(interval);
    }, Math.max(0, delayMs));
  }

  function stopRecruit() {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    stopCountdownDisplay();
    setIsRunning(false);
    localStorage.removeItem(LS.nextScheduledTime);
    log('Auto recruit dihentikan.');
    updateStatusDisplay('Stopped', '');
  }

  function startRecruit() {
    setIsRunning(true);
    log('Auto recruit dimulai.');
    
    // Update button state immediately
    updateButtonState(true);
    startCountdownDisplay();

    const lastRun = getLastRun();
    let lastInterval = getLastInterval();
    const nextScheduledTime = getNextScheduledTime();

    // Jika ada jadwal yang tersimpan dan masih valid
    if (nextScheduledTime && nextScheduledTime > now()) {
      const remaining = nextScheduledTime - now();
      log(`Melanjutkan countdown: ${(remaining / 60000).toFixed(2)} menit tersisa.`);
      scheduleNext(remaining);
      return;
    }

    if (lastRun == null || lastInterval == null) {
      log('Histori kosong → jalankan rekrut sekarang.');
      const ok = recruitOnce();
      if (ok) {
        const t = now();
        saveLastRun(t);
      }
      const interval = nextIntervalMs();
      saveLastInterval(interval);
      scheduleNext(interval);
      return;
    }

    const elapsed = now() - lastRun;
    const remaining = lastInterval - elapsed;
    
    log(`lastRun: ${ts(lastRun)}, elapsed: ${(elapsed / 60000).toFixed(2)} min, remaining: ${(Math.max(0, remaining) / 60000).toFixed(2)} min.`);

    if (remaining <= 0) {
      log('Interval terlewati → rekrut segera.');
      const ok = recruitOnce();
      if (ok) {
        const t = now();
        saveLastRun(t);
      }
      const interval = nextIntervalMs();
      saveLastInterval(interval);
      scheduleNext(interval);
    } else {
      scheduleNext(remaining);
    }
  }

  /*** ============== UI FUNCTIONS ================== ***/
  function updateStatusDisplay(text, countdown = '') {
    const statusElement = document.getElementById('recruit-status');
    const countdownElement = document.getElementById('recruit-countdown');
    
    if (statusElement) {
      statusElement.innerText = text;
    }
    if (countdownElement) {
      countdownElement.innerText = countdown;
    }
  }

  function updateButtonState(isRunning) {
    const toggleButton = document.getElementById('toggleRecruitButton');
    if (!toggleButton) return;

    if (isRunning) {
      toggleButton.innerText = 'Stop Recruit';
      toggleButton.style.backgroundColor = '#dc3545';
      toggleButton.style.color = '#fff';
    } else {
      toggleButton.innerText = 'Start Recruit';
      toggleButton.style.backgroundColor = '#28a745';
      toggleButton.style.color = '#fff';
      updateStatusDisplay('Stopped', '');
    }
  }

  function toggleSettingsPopup() {
    if (settingsPopup) {
      settingsPopup.remove();
      settingsPopup = null;
      return;
    }

    settingsPopup = document.createElement('div');
    settingsPopup.style.position = 'fixed';
    settingsPopup.style.bottom = '100px';
    settingsPopup.style.right = '10px';
    settingsPopup.style.backgroundColor = '#222';
    settingsPopup.style.color = '#fff';
    settingsPopup.style.padding = '20px';
    settingsPopup.style.borderRadius = '10px';
    settingsPopup.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    settingsPopup.style.zIndex = '10001';
    settingsPopup.style.width = '220px';
    settingsPopup.style.maxHeight = '500px';
    settingsPopup.style.overflowY = 'auto';

    settingsPopup.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 14px; text-align: center;">Recruit Settings</h3>
      
      <div style="margin-bottom: 15px; padding: 10px; background: #333; border-radius: 5px;">
        <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">
          <input type="checkbox" id="spearEnabled" ${settings.spearEnabled ? 'checked' : ''}> Spear
        </label>
        <input type="number" id="spearCount" value="${settings.spearCount}" min="0"
               style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;">
      </div>

      <div style="margin-bottom: 15px; padding: 10px; background: #333; border-radius: 5px;">
        <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">
          <input type="checkbox" id="lightEnabled" ${settings.lightEnabled ? 'checked' : ''}> Light Cavalry
        </label>
        <input type="number" id="lightCount" value="${settings.lightCount}" min="0"
               style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;">
      </div>

      <div style="margin-bottom: 15px; padding: 10px; background: #333; border-radius: 5px;">
        <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">
          <input type="checkbox" id="swordEnabled" ${settings.swordEnabled ? 'checked' : ''}> Sword
        </label>
        <input type="number" id="swordCount" value="${settings.swordCount}" min="0"
               style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;">
      </div>

      <div style="margin-bottom: 15px; padding: 10px; background: #333; border-radius: 5px;">
        <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">
          <input type="checkbox" id="archerEnabled" ${settings.archerEnabled ? 'checked' : ''}> Archer
        </label>
        <input type="number" id="archerCount" value="${settings.archerCount}" min="0"
               style="width: 100%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;">
      </div>

      <div style="margin-bottom: 10px; padding: 10px; background: #333; border-radius: 5px;">
        <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: bold;">Interval (minutes)</label>
        <div style="display: flex; gap: 5px; align-items: center;">
          <input type="number" id="minMinutes" value="${settings.minMinutes}" min="1"
                 style="width: 50%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;"
                 placeholder="Min">
          <span style="font-size: 12px;">-</span>
          <input type="number" id="maxMinutes" value="${settings.maxMinutes}" min="1"
                 style="width: 50%; padding: 4px; border-radius: 3px; border: 1px solid #444; background: #444; color: #fff;"
                 placeholder="Max">
        </div>
      </div>

      <button id="saveRecruitSettings" 
              style="width: 100%; padding: 8px; background-color: #28a745; color: white; 
                     border: none; border-radius: 5px; cursor: pointer; font-size: 13px;">
        Save Settings
      </button>
    `;

    document.body.appendChild(settingsPopup);

    document.getElementById('saveRecruitSettings').addEventListener('click', () => {
      settings.spearEnabled = document.getElementById('spearEnabled').checked;
      settings.lightEnabled = document.getElementById('lightEnabled').checked;
      settings.swordEnabled = document.getElementById('swordEnabled').checked;
      settings.archerEnabled = document.getElementById('archerEnabled').checked;
      settings.spearCount = parseInt(document.getElementById('spearCount').value, 10) || 0;
      settings.lightCount = parseInt(document.getElementById('lightCount').value, 10) || 0;
      settings.swordCount = parseInt(document.getElementById('swordCount').value, 10) || 0;
      settings.archerCount = parseInt(document.getElementById('archerCount').value, 10) || 0;
      settings.minMinutes = parseInt(document.getElementById('minMinutes').value, 10) || 30;
      settings.maxMinutes = parseInt(document.getElementById('maxMinutes').value, 10) || 37;

      if (settings.minMinutes > settings.maxMinutes) {
        alert('Min minutes tidak boleh lebih besar dari Max minutes!');
        return;
      }

      saveSettings();
      toggleSettingsPopup();
      log('Settings disimpan.');
    });
  }

  function createUI() {
    loadSettings();

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '10px';
    container.style.backgroundColor = '#222';
    container.style.color = '#fff';
    container.style.padding = '12px';
    container.style.borderRadius = '8px';
    container.style.zIndex = '10000';
    container.style.boxShadow = '0px 4px 8px rgba(0, 0, 0, 0.2)';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '5px';
    container.style.backdropFilter = 'blur(5px)';

    // Status Display
    const statusElement = document.createElement('div');
    statusElement.id = 'recruit-status';
    statusElement.style.fontSize = '11px';
    statusElement.style.fontWeight = 'bold';
    statusElement.style.textAlign = 'center';
    statusElement.style.color = '#aaa';
    statusElement.innerText = 'Auto Recruit';
    container.appendChild(statusElement);

    // Countdown Display
    const countdownElement = document.createElement('div');
    countdownElement.id = 'recruit-countdown';
    countdownElement.style.fontSize = '18px';
    countdownElement.style.fontWeight = 'bold';
    countdownElement.style.textAlign = 'center';
    countdownElement.style.fontFamily = 'monospace';
    countdownElement.style.color = '#4CAF50';
    countdownElement.style.marginBottom = '5px';
    countdownElement.innerText = '00:00:00';
    container.appendChild(countdownElement);

    // Button Container
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'space-between';
    buttonContainer.style.width = '100%';
    buttonContainer.style.gap = '5px';

    // Toggle Button
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggleRecruitButton';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.fontSize = '13px';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.flex = '1';
    toggleButton.style.transition = 'background-color 0.3s ease';

    // Settings Button
    const settingsButton = document.createElement('button');
    settingsButton.innerText = 'Settings';
    settingsButton.style.padding = '5px 10px';
    settingsButton.style.fontSize = '13px';
    settingsButton.style.backgroundColor = '#007bff';
    settingsButton.style.color = '#fff';
    settingsButton.style.border = 'none';
    settingsButton.style.borderRadius = '5px';
    settingsButton.style.cursor = 'pointer';
    settingsButton.style.flex = '1';
    settingsButton.style.transition = 'background-color 0.3s ease';
    settingsButton.addEventListener('click', toggleSettingsPopup);

    buttonContainer.appendChild(toggleButton);
    buttonContainer.appendChild(settingsButton);

    container.appendChild(buttonContainer);
    document.body.appendChild(container);

    // Initialize button state and auto-start if needed
    const isRunning = getIsRunning();
    
    // Set initial button appearance based on saved state
    if (isRunning) {
      toggleButton.innerText = 'Stop Recruit';
      toggleButton.style.backgroundColor = '#dc3545';
      toggleButton.style.color = '#fff';
      // Start recruit process
      startRecruit();
    } else {
      toggleButton.innerText = 'Start Recruit';
      toggleButton.style.backgroundColor = '#28a745';
      toggleButton.style.color = '#fff';
      updateStatusDisplay('Stopped', '');
    }

    // Add event listener after initial state is set
    toggleButton.addEventListener('click', function() {
      if (getIsRunning()) {
        stopRecruit();
        updateButtonState(false);
      } else {
        startRecruit();
        updateButtonState(true);
      }
    });

    log('UI created.');
  }

  /*** ============== INIT ====================== ***/
  function init() {
    log('Auto Recruit with UI & Countdown initialized.');
    createUI();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();