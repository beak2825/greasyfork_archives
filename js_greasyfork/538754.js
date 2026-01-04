// ==UserScript==
// @name         Torn - Beep on 5M+ Gain (Singleton + Status Toast)
// @namespace    zeshu.money.beep
// @version      4.2
// @description  Beep on 5M+ money gain, suppress if caused by 'Change' button in trade. Singleton per tab. Toast always shown. Periodic fallback for missed changes.
// @author       zeshu
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538754/Torn%20-%20Beep%20on%205M%2B%20Gain%20%28Singleton%20%2B%20Status%20Toast%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538754/Torn%20-%20Beep%20on%205M%2B%20Gain%20%28Singleton%20%2B%20Status%20Toast%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const THRESHOLD = 5000000;
  const SUPPRESS_DURATION_MS = 2000;
  const SINGLETON_KEY = 'moneyBeepActiveTab';
  const LEADER_TIMEOUT = 15000;
  const HEARTBEAT_INTERVAL = 5000;

  let last = 0;
  let suppressBeep = false;
  let isLeader = false;

  // === Toast Display
    let persistentToast;

    function showToast(message) {
        if (!persistentToast) {
            persistentToast = document.createElement('div');
            Object.assign(persistentToast.style, {
                position: 'fixed',
                top: '20px',
                left: '20px',
                background: 'rgba(30, 30, 30, 0.95)',
                color: '#fff',
                padding: '10px 16px',
                borderRadius: '8px',
                fontSize: '14px',
                zIndex: 99999,
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.4)',
                maxWidth: '300px',
                lineHeight: '1.4'
            });
            document.body.appendChild(persistentToast);
        }

        persistentToast.textContent = message;
    }



  // === Audio Setup
  let audioContext;
  function getAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
  }

  ['click', 'keydown', 'touchstart'].forEach(evt =>
    document.addEventListener(evt, () => {
      getAudioContext().resume().catch(console.warn);
    }, { once: true })
  );

  async function pleasantBeep() {
    const ctx = getAudioContext();

    if (ctx.state !== 'running') {
      try {
        await ctx.resume();
      } catch (e) {
        console.warn('[MoneyBeep] AudioContext blocked:', e);
        showToast('⚠️ Beep blocked until user interaction');
        return;
      }
    }

    const gain = ctx.createGain();
    gain.connect(ctx.destination);

    const tone = (f, t, d) => {
      const o = ctx.createOscillator();
      o.type = 'triangle';
      o.frequency.setValueAtTime(f, ctx.currentTime + t);
      o.connect(gain);
      gain.gain.setValueAtTime(0.4, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + t + d);
      o.start(ctx.currentTime + t);
      o.stop(ctx.currentTime + t + d);
    };

    tone(880, 0.0, 0.2);
    tone(660, 0.25, 0.3);
  }

  function watchChangeButtonClicks() {
    document.body.addEventListener('click', (e) => {
      const btn = e.target?.closest('input[type="submit"].torn-btn');
      if (btn && btn.value === 'Change') {
        suppressBeep = true;
        setTimeout(() => suppressBeep = false, SUPPRESS_DURATION_MS);
      }
    });
  }

  function monitorMoney() {
    const el = document.querySelector('#user-money');
    if (!el) {
      console.log('[MoneyBeep] #user-money not found — skipping');
      return;
    }

    const getMoneyValue = () =>
      parseInt(el.getAttribute('data-money')?.replace(/,/g, '') || '0', 10);

    const check = () => {
      const current = getMoneyValue();
      if (last === 0) {
        last = current;
        console.log('[MoneyBeep] Initial money value set:', current);
        return;
      }
      const diff = current - last;
      if (diff >= THRESHOLD && !suppressBeep) {
        console.log(`[MoneyBeep] Gain detected: +${diff.toLocaleString()}`);
        pleasantBeep();
      } else if (diff !== 0) {
        console.log(`[MoneyBeep] Money change: ${diff.toLocaleString()}`);
      }
      last = current;
    };

    // Observe DOM attribute change
    const observer = new MutationObserver(check);
    observer.observe(el, { attributes: true, attributeFilter: ['data-money'] });

    // Periodic fallback
    setInterval(check, 3000);
    check();
  }

  // === Singleton Logic
  function tryBecomeLeader() {
      const now = Date.now();
      const existing = parseInt(localStorage.getItem(SINGLETON_KEY) || '0', 10);
      const active = now - existing < LEADER_TIMEOUT;

      if (!active && document.visibilityState === 'visible') {
          // Claim leadership optimistically
          localStorage.setItem(SINGLETON_KEY, now.toString());

          // Wait briefly, then recheck to see if another tab claimed it too
          setTimeout(() => {
              const check = parseInt(localStorage.getItem(SINGLETON_KEY) || '0', 10);
              const stillMine = Math.abs(check - now) < 100; // close enough match

              if (stillMine) {
                  isLeader = true;
                  const t = new Date().toLocaleTimeString();
                  showToast(`🟢 MoneyBeep active (${t})`);
                  monitorMoney();
                  watchChangeButtonClicks();
                  setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);
              } else {
                  isLeader = false;
                  const t = new Date().toLocaleTimeString();
                  showToast(`🟡 MoneyBeep lost race (${t})`);
              }
          }, 250); // small delay for contention resolution
          return true;
      }

      if (active && document.visibilityState === 'visible') {
          const t = new Date().toLocaleTimeString();
          showToast(`🟡 MoneyBeep passive (${t})`);
      }

      return false;
  }


  function updateHeartbeat() {
    if (isLeader) {
      localStorage.setItem(SINGLETON_KEY, Date.now().toString());
    }
  }

  window.addEventListener('storage', (e) => {
    if (e.key === SINGLETON_KEY && !document.hidden) {
      const now = Date.now();
      const val = parseInt(e.newValue || '0', 10);
      if (now - val < LEADER_TIMEOUT) {
        isLeader = false;
      }
    }
  });

  window.addEventListener('beforeunload', () => {
    if (isLeader) {
      localStorage.removeItem(SINGLETON_KEY);
    }
  });

  // === Defer startup until page idle
  function defer(fn) {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(fn, { timeout: 3000 });
    } else {
      setTimeout(fn, 2000);
    }
  }

  window.addEventListener('load', () => {
    // Avoid running on pages without money display
    if (!document.querySelector('#user-money')) return;

    defer(() => {
      const becameLeader = tryBecomeLeader();
      if (becameLeader) {
        monitorMoney();
        watchChangeButtonClicks();
        setInterval(updateHeartbeat, HEARTBEAT_INTERVAL);
      }
    });
  });
})();
