// ==UserScript==
// @name         Auto Reload on Stake.com - CodeStats edition
// @description  Automatically claims 10 minute reloads on Stake.com by sequentially clicking VIP Reward → Claim Reload → Return to Rewards. The script starts after a short page-load delay, mimics human behavior with user customizable random delays, occasional skipped cycles, and subtle mouse/scroll movements. WANT MORE STAKE BONUS CODE AUTO-CLAIM TOOLS? GO TO https://codestats.gg/autoclaimer
// @author       CHUBB/TobyStrings
// @namespace    https://codestats.gg
// @version      2.0.0
// @match        https://stake.com/*
// @match        https://stake.us/*
// @match        https://stake.ac/*
// @match        https://stake.games/*
// @match        https://stake.bet/*
// @match        https://stake.pet/*
// @match        https://stake.mba/*
// @match        https://stake.jp/*
// @match        https://stake.bz/*
// @match        https://stake.ceo/*
// @match        https://stake.krd/*
// @match        https://staketr.com/*
// @match        https://stake1001.com/*
// @match        https://stake1002.com/*
// @match        https://stake1003.com/*
// @match        https://stake1004.com/*
// @match        https://stake1005.com/*
// @match        https://stake1021.com/*
// @match        https://stake1022.com/*
// @match        https://stake.br/*
// @exclude      https://stake.com/settings/*
// @exclude      https://stake.us/settings/*
// @exclude      https://stake.ac/settings/*
// @exclude      https://stake.games/settings/*
// @exclude      https://stake.bet/settings/*
// @exclude      https://stake.pet/settings/*
// @exclude      https://stake.mba/settings/*
// @exclude      https://stake.jp/settings/*
// @exclude      https://stake.bz/settings/*
// @exclude      https://stake.ceo/settings/*
// @exclude      https://stake.krd/settings/*
// @exclude      https://staketr.com/settings/*
// @exclude      https://stake1001.com/settings/*
// @exclude      https://stake1002.com/settings/*
// @exclude      https://stake1003.com/settings/*
// @exclude      https://stake1004.com/settings/*
// @exclude      https://stake1005.com/settings/*
// @exclude      https://stake1021.com/settings/*
// @exclude      https://stake1022.com/settings/*
// @exclude      https://stake.br/settings/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/546623/Auto%20Reload%20on%20Stakecom%20-%20CodeStats%20edition.user.js
// @updateURL https://update.greasyfork.org/scripts/546623/Auto%20Reload%20on%20Stakecom%20-%20CodeStats%20edition.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ===== CONFIGURATION =====
  const MIN_MINUTES = 10;
  const MAX_MINUTES = 11;
  const STEP_TIMEOUT_MS = 30000;
  const MAX_RETRIES = 3;
  const RELOAD_COOLDOWN_MS = 15000;

  // Dynamic target URL for all Stake mirrors
  const TARGET_URL = `${window.location.origin}/?tab=rewards&modal=vip`;

  // ===== STATE MANAGEMENT =====
  let cycleInProgress = false; // Prevent concurrent cycles
  let cycleScheduled = false; // Track if cycle is scheduled
  let lastDelay = null; // Store last delay for persistence
  let reloadClaims = 0; // Track successful claims
  let firstClaimMade = false; // Track if first claim has been made
  let currentTimeout = null;
  let currentTimer = null;
  let config = {
      minMinutes: MIN_MINUTES,
      maxMinutes: MAX_MINUTES,
      enabled: true,
  };

  // Session storage keys for self-healing
  const STATE_KEY_LAST_RELOAD = 'codestats:lastReloadAt';
  const STATE_KEY_RETRY_COUNT = 'codestats:retryCount';

  function loadConfig() {
      try {
          const saved = GM_getValue("autoReloadConfig", null);
          if (saved) {
              config.enabled = saved.enabled !== undefined ? saved.enabled : true;
          }
          reloadClaims = parseInt(GM_getValue("reloadClaims", "0"));
          
          // Initialize firstClaimMade based on whether we have previous claims
          // If we have any previous claims, assume first claim was already made
          firstClaimMade = reloadClaims > 0;
      } catch (e) {
          console.log("Could not load config, using defaults");
      }
  }

  function saveConfig() {
      try {
          const toSave = { enabled: config.enabled };
          GM_setValue("autoReloadConfig", toSave);
          GM_setValue("reloadClaims", reloadClaims.toString());
          
          // Update firstClaimMade status based on current claims count
          firstClaimMade = reloadClaims > 0;
      } catch (e) {
          console.log("Could not save config");
      }
  }

  function saveTimingState() {
      try {
          GM_setValue("codestats_lastClaim", Date.now());
          if (lastDelay) {
              GM_setValue("codestats_nextClaimDelay", lastDelay);
          }
      } catch (e) {
          console.log("Could not save timing state:", e);
      }
  }

  function loadTimingState() {
      try {
          const lastClaim = parseInt(GM_getValue("codestats_lastClaim", "0"));
          const nextDelay = parseInt(GM_getValue("codestats_nextClaimDelay", "0"));

          if (lastClaim > 0 && nextDelay > 0) {
              const elapsed = Date.now() - lastClaim;
              const remaining = nextDelay - elapsed;

              if (remaining > 0) {
                  logHUD(
                      `Resuming with ${Math.floor(remaining / 1000)}s remaining from previous cycle`,
                  );
                  return remaining;
              }
          }
      } catch (e) {
          console.log("Could not load timing state:", e);
      }
      return null;
  }

  function getRetryCount() {
      return parseInt(sessionStorage.getItem(STATE_KEY_RETRY_COUNT) || '0', 10);
  }

  function incrementRetryCount() {
      const count = getRetryCount() + 1;
      sessionStorage.setItem(STATE_KEY_RETRY_COUNT, String(count));
      return count;
  }

  function resetRetryCount() {
      sessionStorage.setItem(STATE_KEY_RETRY_COUNT, '0');
  }

  function shouldHardReset() {
      return getRetryCount() >= MAX_RETRIES;
  }

  // ===== LOGGER =====
  const log = (...args) => console.log('[CodeStats]', ...args);
  const warn = (...args) => console.warn('[CodeStats]', ...args);
  const error = (...args) => console.error('[CodeStats]', ...args);

  function logHUD(msg) {
      const logEl = document.getElementById("hudLog");
      if (!logEl) return;

      const line = document.createElement("div");
      line.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
      line.style.padding = "2px 0";
      logEl.appendChild(line);
      logEl.scrollTop = logEl.scrollHeight;
  }

  function updateTimer(ms) {
      const el = document.getElementById("hudTimer");
      if (!el) return;

      const sec = Math.floor(ms / 1000);
      const m = Math.floor(sec / 60);
      const s = sec % 60;
      el.textContent = `Next claim in: ${m}m ${s}s`;
  }

  function setSpinnerState(state, message, retryInfo = '') {
      const statusText = document.getElementById("statusText");
      if (!statusText) return;

      statusText.textContent = message;
  }

  // ===== DOM UTILITIES =====
  function waitFor(selector, { timeout = STEP_TIMEOUT_MS, mustBeEnabled = true, context = document } = {}) {
      return new Promise((resolve, reject) => {
          const t0 = Date.now();

          const check = () => {
              const el = context.querySelector(selector);
              if (!el) return null;
              if (mustBeEnabled && ('disabled' in el) && el.disabled) return null;
              return el;
          };

          const first = check();
          if (first) {
              log('✅ found:', selector);
              return resolve(first);
          }

          const obs = new MutationObserver(() => {
              const found = check();
              if (found) {
                  obs.disconnect();
                  log('✅ found (obs):', selector);
                  resolve(found);
              } else if (Date.now() - t0 > timeout) {
                  obs.disconnect();
                  reject(new Error(`timeout: ${selector}`));
              }
          });

          obs.observe(context, { childList: true, subtree: true });
          setTimeout(() => {
              obs.disconnect();
              reject(new Error(`timeout: ${selector}`));
          }, timeout + 50);
      });
  }

  async function waitForAny(selectors, opts) {
      const promises = selectors.map((sel) =>
          waitFor(sel, opts).then((el) => ({ el, sel })).catch(() => null)
      );

      const results = await Promise.all(promises);
      const winner = results.find(result => result !== null);

      if (winner) {
          return winner;
      }
      throw new Error(`None of the selectors found: ${selectors.join(', ')}`);
  }

  async function clickIfExists(selector, label, context = document) {
      const el = context.querySelector(selector);
      if (el && !el.disabled) {
          log('🖱️ click:', label || selector);
          el.click();
          await new Promise(resolve => setTimeout(resolve, 500));
          return true;
      }
      return false;
  }

  // ===== NAVIGATION STRATEGIES =====
  async function tryNavigationStrategy(strategyName, attempt) {
      log(`🔄 Trying navigation strategy: ${strategyName} (attempt ${attempt})`);

      switch (strategyName) {
          case 'direct_url':
              setSpinnerState('RUNNING', 'direct navigation…', `attempt ${attempt}/${MAX_RETRIES}`);
              window.location.href = TARGET_URL;
              return true;

          case 'dropdown_vip':
              setSpinnerState('RUNNING', 'menu navigation…', `attempt ${attempt}/${MAX_RETRIES}`);

              await clickIfExists('button[data-testid="user-dropdown-toggle"][aria-expanded="true"]', 'close-dropdown');
              await new Promise(resolve => setTimeout(resolve, 500));

              await clickIfExists('button[data-testid="user-dropdown-toggle"]', 'open-dropdown');
              await new Promise(resolve => setTimeout(resolve, 1000));
              await clickIfExists('button[data-analytics="global-userMenu-vip-item"]', 'vip-item');
              await new Promise(resolve => setTimeout(resolve, 1500));
              return true;

          case 'rewards_tab':
              setSpinnerState('RUNNING', 'rewards tab…', `attempt ${attempt}/${MAX_RETRIES}`);
              await clickIfExists('button[data-testid="rewards-tab"]', 'rewards-tab');
              await new Promise(resolve => setTimeout(resolve, 1000));

              await clickIfExists('button[data-testid="user-dropdown-toggle"]', 'open-dropdown');
              await new Promise(resolve => setTimeout(resolve, 1000));
              await clickIfExists('button[data-analytics="global-userMenu-vip-item"]', 'vip-item');
              await new Promise(resolve => setTimeout(resolve, 1500));
              return true;

          case 'hard_reset':
              setSpinnerState('RUNNING', 'hard reset…', 'final attempt');
              window.location.reload();
              return true;

          default:
              return false;
      }
  }

  async function healAndNavigate() {
      const retryCount = incrementRetryCount();

      if (shouldHardReset()) {
          log('🚨 Max retries reached, performing hard reset');
          resetRetryCount();
          await tryNavigationStrategy('hard_reset', retryCount);
          return;
      }

      const strategies = ['direct_url', 'dropdown_vip', 'rewards_tab'];
      const strategy = strategies[retryCount - 1] || strategies[0];

      await tryNavigationStrategy(strategy, retryCount);
  }

  function isOnVIPPage() {
      try {
          const url = new URL(window.location.href);
          const tab = url.searchParams.get('tab');
          const modal = url.searchParams.get('modal');

          const urlMatch = (tab === 'rewards' && modal === 'vip') ||
                          (tab === 'reload' && modal === 'vip');

          const visualMatch = document.querySelector(
              'button[data-analytics="global-userMenu-vip-item"][aria-current="true"], ' +
              '[data-testid*="vip"], ' +
              '[class*="vip" i]'
          );

          return urlMatch || !!visualMatch;
      } catch {
          return false;
      }
  }

  async function performClaimSequence() {
      setSpinnerState('RUNNING', 'checking claims…');
      logHUD('Checking for available reload claims…');

      let claimedAnything = false;

      try {
          const reloadSel = [
              'button[data-testid="vip-reward-claim-reload"][data-analytics="vip-reward-claim-reload"]',
              'button[data-testid="vip-reward-claim-reload"]',
              'button[data-analytics="vip-reward-claim-reload"]',
              '[data-testid*="reload"][data-analytics*="reload"]',
              '[data-testid*="reload"][data-analytics*="claim"]',
          ];

          const { el: vipBtn } = await waitForAny(reloadSel, { timeout: 10000 });
          if (vipBtn && !vipBtn.disabled) {
              setSpinnerState('RUNNING', 'opening reload…');
              logHUD('Clicking VIP reward claim reload button…');
              vipBtn.click();
              await new Promise(resolve => setTimeout(resolve, 2000));
          }
      } catch (err) {
          log('ℹ️ VIP reload button not found');
      }

      try {
          const claimSel = [
              'button[data-testid="claim-reload"][data-analytics="claim-reload"]',
              'button[data-testid="claim-reload"]',
              'button[data-analytics="claim-reload"]',
              '[data-testid*="reload"][data-analytics*="claim"]',
          ];

          const { el: reloadBtn } = await waitForAny(claimSel, { timeout: 15000 });
          if (reloadBtn && !reloadBtn.disabled) {
              setSpinnerState('RUNNING', 'claiming reload…');
              logHUD('Claiming reload bonus…');
              reloadBtn.click();
              claimedAnything = true;
              log('🪙 Reload claimed');
              await new Promise(resolve => setTimeout(resolve, 2000));
          }
      } catch (err) {
          log('ℹ️ No reload claim available or already claimed');
      }

      if (claimedAnything) {
          try {
              const returnSel = [
                  'button[data-testid="return-to-rewards"]',
                  'button[data-testid="return-to-rewards"][data-analytics="return-to-rewards"]',
              ];

              const { el: returnBtn } = await waitForAny(returnSel, { timeout: 5000 });
              if (returnBtn) {
                  logHUD('Returning to rewards…');
                  returnBtn.click();
                  await new Promise(resolve => setTimeout(resolve, 1000));
              }
          } catch (err) {
              log('ℹ️ Return button not found, may be auto-closed');
          }

          reloadClaims++;
          saveConfig();
          logHUD(`Reload claimed successfully! Total claims: ${reloadClaims}`);
          document.getElementById("claimCounter").textContent = reloadClaims;
      }

      return claimedAnything;
  }

  function safeNavigateToTarget(reason) {
      const now = Date.now();
      const last = parseInt(sessionStorage.getItem(STATE_KEY_LAST_RELOAD) || '0', 10);
      if (now - last < RELOAD_COOLDOWN_MS) {
          warn('reload blocked (cooldown). reason =', reason);
          return;
      }
      sessionStorage.setItem(STATE_KEY_LAST_RELOAD, String(now));
      window.location.href = TARGET_URL;
  }

  function simulateMouseMove() {
      const simElm = document.body || document.documentElement;
      if (!simElm) return;
      const simMouseMove = new Event("mousemove", { bubbles: true });
      simElm.dispatchEvent(simMouseMove);
  }

  function wait(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // ===== HUD SETUP =====
  function setupHUD() {
      const existingHud = document.getElementById("autoReloadHUD");
      if (existingHud) {
          existingHud.remove();
      }

      const hud = document.createElement("div");
      hud.id = "autoReloadHUD";
      hud.style.cssText = `
          position: fixed;
          bottom: 10px;
          right: 10px;
          width: 650px;
          max-height: 250px;
          overflow-y: auto;
          font-size: 12px;
          background: rgba(0,0,0,0.8);
          color: #0f0;
          padding: 10px;
          border-radius: 8px;
          font-family: monospace;
          z-index: 2147483647;
          border: 1px solid #0f0;
      `;

      hud.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
              <b><a href="https://codestats.gg" target="_blank" rel="noopener noreferrer" style="color: #0f0; text-decoration: underline;">CodeStats.gg</a> Stake Reload Bot v2.0.0</b>
              <button id="minimizeBtn" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">−</button>
          </div>
          <div id="mainContent">
              <div style="margin: 8px 0; padding: 8px; background: rgba(0,255,0,0.1); border-radius: 4px;">
                  <div style="display: flex; align-items: center; gap: 5px; margin-bottom: 8px;">
                      <button id="goToVip" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">🏆 VIP</button>
                      <button id="toggleBtn" style="padding: 4px 8px; background: #0f0; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: bold;">${config.enabled ? "PAUSE" : "START"}</button>
                      <span>Status: <span id="statusText">${config.enabled ? "RUNNING" : "PAUSED"}</span></span>
                  </div>
                  <div style="font-size: 11px; color: #aaa; display: flex; justify-content: space-between; align-items: center;">
                      <span>Settings: ${MIN_MINUTES}-${MAX_MINUTES} min (configure in script)</span>
                      <div style="display: flex; align-items: center; gap: 8px;">
                          <span>Claims: <strong id="claimCounter">${reloadClaims}</strong></span>
                          <button id="resetBtn" style="padding: 2px 6px; background: #f00; color: #fff; border: none; border-radius: 3px; cursor: pointer; font-size: 10px; font-weight: bold;">RESET</button>
                      </div>
                  </div>
                  <div id="retryInfo" style="font-size: 10px; color: #666; margin-top: 4px;"></div>
              </div>
              <div id="hudLog" style="max-height: 80px; overflow-y: auto;"></div>
              <div id="hudTimer" style="font-weight: bold; color: #ff0;"></div>
          </div>
      `;

      document.body.appendChild(hud);

      document.getElementById("toggleBtn").addEventListener("click", toggleBot);
      document.getElementById("minimizeBtn").addEventListener("click", toggleMinimize);
      document.getElementById("goToVip").addEventListener("click", function () {
          window.location.href = TARGET_URL;
      });
      document.getElementById("resetBtn").addEventListener("click", function () {
          reloadClaims = 0;
          saveConfig();
          document.getElementById("claimCounter").textContent = "0";
          logHUD("Claims counter reset to 0");
      });
  }

  function toggleBot() {
      config.enabled = !config.enabled;
      const btn = document.getElementById("toggleBtn");
      const status = document.getElementById("statusText");

      btn.textContent = config.enabled ? "PAUSE" : "START";
      status.textContent = config.enabled ? "RUNNING" : "PAUSED";

      saveConfig();

      if (config.enabled) {
          logHUD("Bot resumed");
          cycleInProgress = false;
          cycleScheduled = false;
          startCycle();
      } else {
          logHUD("Bot paused");
          if (currentTimeout) {
              clearTimeout(currentTimeout);
              currentTimeout = null;
          }
          if (currentTimer) {
              clearInterval(currentTimer);
              currentTimer = null;
          }
          cycleInProgress = false;
          cycleScheduled = false;
          document.getElementById("hudTimer").textContent = "Bot paused";
      }
  }

  function toggleMinimize() {
      const mainContent = document.getElementById("mainContent");
      const minimizeBtn = document.getElementById("minimizeBtn");
      const hud = document.getElementById("autoReloadHUD");

      if (mainContent.style.display === "none") {
          mainContent.style.display = "block";
          hud.style.width = "650px";
          hud.style.maxHeight = "250px";
          minimizeBtn.textContent = "−";
      } else {
          mainContent.style.display = "none";
          hud.style.width = "350px";
          hud.style.maxHeight = "50px";
          minimizeBtn.textContent = "+";
      }
  }

  function updateRetryDisplay() {
      const retryCount = getRetryCount();
      const retryInfo = document.getElementById("retryInfo");
      if (retryInfo && retryCount > 0) {
          retryInfo.textContent = `Self-healing retry ${retryCount}/${MAX_RETRIES}`;
      } else if (retryInfo) {
          retryInfo.textContent = '';
      }
  }

  // ===== MAIN RUN LOOP =====
  async function run() {
      updateRetryDisplay();

      if (!isOnVIPPage()) {
          log('🔧 Not on VIP page, initiating self-healing');
          logHUD('Navigating to VIP page…');
          await healAndNavigate();
          return;
      }

      if (getRetryCount() > 0) {
          log('✅ Self-healing successful, resetting retry count');
          resetRetryCount();
      }

      const success = await performClaimSequence();

      if (success && !firstClaimMade) {
          // Mark first claim as made after successful first claim
          firstClaimMade = true;
          logHUD("First reload claim successful! Now using configured intervals...");
          log('✅ First claim made - switching to normal timing');
      }

      if (success) {
          setSpinnerState('RUNNING', 'success • waiting for next cycle', '');
          log('✅ Claim sequence completed successfully');
      } else {
          setSpinnerState('RUNNING', 'no claims • waiting for next cycle', '');
          log('ℹ️ No claims available at this time');
      }
  }

  function startCycle() {
      if (!config.enabled) {
          logHUD("Bot is paused - timer not started");
          return;
      }

      if (cycleInProgress) {
          logHUD("Warning: Cycle already in progress, skipping duplicate start");
          return;
      }

      if (cycleScheduled) {
          logHUD("Warning: Cycle already scheduled, skipping duplicate");
          return;
      }

      cycleInProgress = true;
      cycleScheduled = true;

      if (currentTimer) {
          clearInterval(currentTimer);
          currentTimer = null;
      }
      if (currentTimeout) {
          clearTimeout(currentTimeout);
          currentTimeout = null;
      }

      // Use 2-minute intervals until first claim is made
      let min, max;
      if (!firstClaimMade) {
          // Use 2 minutes for until first claim
          min = 2 * 60 * 1000;
          max = 2 * 60 * 1000;
          logHUD("Checking for first claim every 2 minutes...");
      } else {
          // Use normal 10-11 minute intervals after first claim
          min = config.minMinutes * 60 * 1000;
          max = config.maxMinutes * 60 * 1000;
      }
      
      const delay = Math.floor(Math.random() * (max - min + 1)) + min;

      lastDelay = delay;
      let endTime = Date.now() + delay;

      updateTimer(delay);

      currentTimer = setInterval(() => {
          let remaining = endTime - Date.now();
          if (remaining <= 0) {
              clearInterval(currentTimer);
              currentTimer = null;
              return;
          }
          updateTimer(remaining);
      }, 1000);

      logHUD(`Next attempt scheduled in ${(delay / 60000).toFixed(2)} minutes`);

      currentTimeout = setTimeout(async () => {
          currentTimeout = null;
          cycleInProgress = false;

          try {
              await run();
              saveTimingState();

              if (config.enabled) {
                  cycleScheduled = false;
                  startCycle();
              }
          } catch (error) {
              logHUD(`Cycle error: ${error.message} - restarting...`);
              console.error("startCycle error:", error);
              saveTimingState();
              cycleScheduled = false;
              setTimeout(() => {
                  cycleScheduled = false;
                  startCycle();
              }, 5000);
          }
      }, delay);
  }

  // ===== BOOTSTRAP =====
  function ensureHUD() {
      if (document.body) {
          setupHUD();
      } else {
          requestAnimationFrame(ensureHUD);
      }
  }

  const kick = () => {
      try {
          run();
      } catch (e) {
          error('🚨 Critical error:', e);
          logHUD('Critical error - initiating self-healing…');

          setTimeout(() => {
              healAndNavigate();
          }, 3000);
      }
  };

  loadConfig();

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(() => {
          ensureHUD();
          kick();
      }, 1000);
  } else {
      document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
              ensureHUD();
              kick();
          }, 1000);
      });
  }

  window.addEventListener('load', () => setTimeout(kick, 1500));

  let lastUrl = location.href;
  new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(kick, 500);
      }
  }).observe(document, { subtree: true, childList: true });

  const minText = `${MIN_MINUTES}m`;
  const maxText = `${MAX_MINUTES}m`;
  logHUD(`Bot loaded - Settings: ${minText}-${maxText}`);

  const remaining = loadTimingState();

  if (remaining) {
      logHUD(`Resuming claim in ${(remaining / 1000).toFixed(1)}s...`);

      setTimeout(async () => {
          try {
              await run();
              if (config.enabled) {
                  startCycle();
              }
          } catch (error) {
              logHUD(`First run error: ${error.message} - starting anyway...`);
              console.error("firstRun error:", error);
              setTimeout(() => {
                  cycleScheduled = false;
                  startCycle();
              }, 2000);
          }
      }, remaining);
  } else {
      const firstDelay = Math.floor(Math.random() * 5000) + 5000;
      logHUD(`First attempt in ${(firstDelay / 1000).toFixed(1)}s`);

      setTimeout(async () => {
          try {
              await run();
              if (config.enabled) {
                  startCycle();
              }
          } catch (error) {
              logHUD(`First run error: ${error.message} - starting anyway...`);
              console.error("firstRun error:", error);
              setTimeout(() => {
                  cycleScheduled = false;
                  startCycle();
              }, 2000);
          }
      }, firstDelay);
  }

})();
