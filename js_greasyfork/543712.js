// ==UserScript==
// @name         Torn: mad jack5
// @namespace    http://tampermonkey.net/
// @version      3.5
// @description  Toggle starts ON, flips OFF if hospitalized. Last Action enables toggle after med-out or log trigger. 🛡️ whiskey_jack edition.
// @author       ...
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543712/Torn%3A%20mad%20jack5.user.js
// @updateURL https://update.greasyfork.org/scripts/543712/Torn%3A%20mad%20jack5.meta.js
// ==/UserScript==

(function () {
  'use strict';
  console.log('[HospBypass] v3.5 loaded – strict toggle enforcement active');

  const originalFetch = window.fetch;
  let toggleState = true;
  let toggleEl = null;
  let isHolding = false;
  let manualOverride = false;
  let secondaryMonitorActive = false;
  let wasHospitalized = false;
  let f4Held = false;

  const originalConsoleLog = console.log;
  console.log = function (...args) {
    originalConsoleLog.apply(console, args);
    const msg = args.join(' ');

    const lastActionTriggers = [
      '[HospBypass] ⏱️ Last Action text appeared: "1 second"',
      '[HospBypass] ⏱️ Last Action text appeared: ""'
    ];

    if (lastActionTriggers.some(trigger => msg.includes(trigger))) {
      const isOkay = document.querySelector('.profile-container.okay span.main-desc');
      if (!toggleState && isOkay && !wasHospitalized) {
        console.log('[HospBypass] 🔁 Log-triggered re-check of Last Action');
        checkLastAction();
      } else {
        console.log('[HospBypass] 🔁 Log trigger ignored – condition mismatch');
      }
    }
  };

  window.fetch = async (...args) => {
    const [resource] = args;
    if (typeof resource === 'string' && resource.includes('?sid=attackData')) {
      const response = await originalFetch(...args);
      const originalJson = await response.clone().json();
      if (originalJson?.DB?.error?.includes('in hospital')) {
        originalJson.DB.defenderUser.playername += ' [In Hospital]';
        delete originalJson.DB.error;
        delete originalJson.startErrorTitle;
        console.log('[HospBypass] attackData error overridden with "[In Hospital]" tag');
      }
      return new Response(JSON.stringify(originalJson), { status: 200, headers: { 'Content-type': 'application/json' } });
    }
    return originalFetch(...args);
  };

  function updateStartFightState(enabled) {
    if (enabled !== toggleState) return;
    const buttons = document.querySelectorAll('button[type="submit"]');
    for (const btn of buttons) {
      if (btn.textContent.trim().toLowerCase().includes('start fight')) {
        if (enabled) {
          btn.removeAttribute('disabled');
          console.log('[HospBypass] Start Fight ENABLED via toggle.');
          console.trace('[HospBypass] DEBUG TRACE — Start Fight was enabled');
        } else {
          btn.setAttribute('disabled', 'disabled');
          console.log('[HospBypass] Start Fight DISABLED via toggle.');
        }
      }
    }
  }

  function waitForTitleAndInjectToggle() {
    const interval = setInterval(() => {
      const titleContainer = document.querySelector('div.titleContainer___QrlWP');
      if (titleContainer && titleContainer.querySelector('h4.title___rhtB4')) {
        clearInterval(interval);
        injectToggleIntoTitle(titleContainer);
      }
    }, 100);
  }

  function injectToggleIntoTitle(container) {
    if (document.getElementById('sf-toggle')) return;
    container.style.position = 'relative';
    toggleEl = document.createElement('div');
    toggleEl.id = 'sf-toggle';
    Object.assign(toggleEl.style, {
      position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', fontWeight: 'bold',
      fontSize: '12px', padding: '2px 6px', cursor: 'pointer', color: 'white', backgroundColor: 'green',
      borderRadius: '4px', boxShadow: '0 0 4px rgba(0,0,0,0.4)', zIndex: 10
    });
    toggleEl.title = 'Click to toggle Start Fight button enabled/disabled';
    toggleEl.textContent = '🛡️ ON';
    container.appendChild(toggleEl);
    updateStartFightState(toggleState);

    toggleEl.addEventListener('click', () => {
      const wasOn = toggleState;
      toggleState = !toggleState;
      updateToggleVisual();
      updateStartFightState(toggleState);
      console.log(`[HospBypass] Toggle manually ${toggleState ? 'ENABLED' : 'DISABLED'}`);
      const isOkay = document.querySelector('.profile-container.okay span.main-desc');
      if (wasOn && !toggleState && isOkay) {
        manualOverride = true;
        console.log('[HospBypass] Manual OFF with target OK – enabling Last Action watcher');
        startSecondaryEnableWatcher();
      } else {
        manualOverride = false;
      }
    });

    new MutationObserver(() => updateStartFightState(toggleState))
      .observe(document.documentElement, { childList: true, subtree: true });

    detectHospitalTextAndFlipOff();
  }

  function updateToggleVisual() {
    if (!toggleEl) return;
    toggleEl.textContent = toggleState ? '🛡️ ON' : '🛡️ OFF';
    toggleEl.style.backgroundColor = toggleState ? 'green' : 'red';
  }

  function detectHospitalTextAndFlipOff() {
    const hospCheckInterval = setInterval(() => {
      const found = Array.from(document.querySelectorAll('span, div, h1, h4, p'))
        .some(el => el.textContent.includes('[In Hospital]'));
      if (found) {
        toggleState = false;
        wasHospitalized = true;
        updateToggleVisual();
        updateStartFightState(toggleState);
        manualOverride = false;
        console.log('[HospBypass] Toggle flipped to OFF due to "[In Hospital]" in page text');
        clearInterval(hospCheckInterval);
      }
      if (performance.now() > 3000) clearInterval(hospCheckInterval);
    }, 100);
  }

  function checkLastAction() {
    console.log('[HospBypass] ─── checkLastAction() called ───');
    const el = document.querySelector('.tt-mini-data span');
    const text = el?.textContent.trim() || '';
    console.log('[HospBypass] Detected Last Action text:', `"${text}"`);

    // Track if Last Action element is freshly added and empty
    const isBlankAndFresh = el && text === '' && el.offsetParent !== null;

    const valid = ['1 second', 'a second'];
    const isValid = valid.includes(text) || isBlankAndFresh;

    console.log(`[HospBypass] Conditions: isValid=${isValid} toggleState=${toggleState} manualOverride=${manualOverride} wasHospitalized=${wasHospitalized}`);
    if (isValid && !toggleState && !wasHospitalized) {
      toggleState = true;
      updateToggleVisual();
      updateStartFightState(true);
      manualOverride = false;
      console.log('[HospBypass] ✅ Conditions met – enabling toggle');
    } else {
      console.log('[HospBypass] ❌ Not all conditions met – toggle not changed');
    }
  }

  function startSecondaryEnableWatcher() {
    if (secondaryMonitorActive) return;
    secondaryMonitorActive = true;
    const interval = setInterval(() => {
      if (!manualOverride) {
        clearInterval(interval);
        secondaryMonitorActive = false;
        return;
      }
      checkLastAction();
    }, 1000);
  }

  function observeLastActionDirectly() {
    const lastActionParent = document.querySelector('.tt-mini-data');
    if (!lastActionParent) return;
    const observer = new MutationObserver(() => {
      console.log('[HospBypass] Detected change in Last Action DOM');
      checkLastAction();
    });
    observer.observe(lastActionParent, { childList: true, subtree: true, characterData: true });
    console.log('[HospBypass] Direct Last Action observer active');
  }

  function observeLastActionTiming() {
    let lastTimestamp = performance.now();
    const observer = new MutationObserver(() => {
      const el = document.querySelector('.tt-mini-data span');
      if (el) {
        const text = el.textContent.trim();
        const now = performance.now();
        const delta = Math.round(now - lastTimestamp);
        lastTimestamp = now;
        console.log(`[HospBypass] ⏱️ Last Action text appeared: "${text}" | ${delta}ms since last appearance`);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log('[HospBypass] Timing observer for .tt-mini-data activated');
  }

  function autoEnableToggle(source = 'unknown') {
    if (!toggleState && wasHospitalized) {
      toggleState = true;
      manualOverride = false;
      updateToggleVisual();
      updateStartFightState(true);
      wasHospitalized = false;
      console.log(`[HospBypass] Auto-enabled toggle ON via ${source}`);
    } else {
      console.log(`[HospBypass] Auto-enable skipped via ${source} | toggleState=${toggleState}, wasHospitalized=${wasHospitalized}`);
    }
  }

  function observeMiniProfile() {
    const el = document.querySelector('.profile-container');
    if (!el) return;
    const observer = new MutationObserver(() => {
      const okayEl = document.querySelector('.profile-container.okay span.main-desc');
      if (wasHospitalized && okayEl?.textContent.trim() === 'Okay') {
        autoEnableToggle('mini-profile');
      }
      if (manualOverride && !wasHospitalized && !toggleState) {
        console.log('[HospBypass] Mini-profile updated – checking Last Action after refresh');
        checkLastAction();
      }
    });
    observer.observe(el, { childList: true, subtree: true });
    console.log('[HospBypass] Mini-profile observer active');
  }

  function monitorCountdown() {
    const interval = setInterval(() => {
      if (/In hospital for\s+0 seconds/.test(document.body.textContent)) {
        clearInterval(interval);
        setTimeout(() => autoEnableToggle('countdown'), 805);
        console.log('[HospBypass] Countdown hit 0s → attempting toggle');
      }
    }, 500);
  }

  // >>> ONLY CHANGE IS HERE: use new DOM to find "Back to profile" <<<
  function setupF4Hold() {
    document.addEventListener('keydown', (event) => {
      if (event.code === 'F4' && !isHolding) {
        isHolding = true;
        f4Held = true;

        const el = (() => {
          const label = document.querySelector('span.linkTitle____NPyM, span[id^="link-aria-label"]');
          return label ? label.closest('a[role="button"], a[href*="profiles.php"]') : null;
        })();

        if (el) {
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true }));
          setTimeout(() => {
            el.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true }));
            setTimeout(() => {
              const okayEl = document.querySelector('.profile-container.okay span.main-desc');
              if (okayEl?.textContent.trim() === 'Okay') autoEnableToggle('F4');
              if (!wasHospitalized && !toggleState) {
                console.log('[HospBypass] F4 refresh complete – running checkLastAction()');
                checkLastAction();
              }
              isHolding = false;
              f4Held = false;
            }, 200);
          }, 650);
        }
      }
    });
    document.addEventListener('keyup', (event) => {
      if (event.code === 'F4') isHolding = false;
    });
  }

  function startAutoEnableMonitors() {
    observeMiniProfile();
    observeLastActionDirectly();
    monitorCountdown();
    setupF4Hold();
    observeLastActionTiming();
  }

  const titleCheck = setInterval(() => {
    const title = document.querySelector('div.titleContainer___QrlWP');
    if (title) {
      clearInterval(titleCheck);
      waitForTitleAndInjectToggle();
      startAutoEnableMonitors();
    }
  }, 150);
})();