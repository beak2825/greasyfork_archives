// ==UserScript==
// @name         Anti Adblock Nuker + Scroll Unlock (Lite/Adaptive)
// @namespace    boss.tm.antiadblock
// @version      1.6
// @description  Anti Adblock Killer
// @author       Boss
// @match        *://*/*
// @license      MIT
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/546058/Anti%20Adblock%20Nuker%20%2B%20Scroll%20Unlock%20%28LiteAdaptive%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546058/Anti%20Adblock%20Nuker%20%2B%20Scroll%20Unlock%20%28LiteAdaptive%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const SKIP_HOSTS = [
    /web\.whatsapp\.com/i,
    /youtube\.com/i,
    /music\.youtube\.com/i,
    /studio\.youtube\.com/i,
    /mail\.google\.com/i,
    /drive\.google\.com/i,
    /docs\.google\.com/i,
    /discord\.com/i,
    /app\.slack\.com/i
  ];
  if (SKIP_HOSTS.some(rx => rx.test(location.host))) return;

  const NOP = function(){};
  let armed = false;
  let mo;
  let killHandlers = null;

  (function stub() {
    const names = ['BlockAdBlock','blockAdBlock','FuckAdBlock','fuckAdBlock','AdBlockDetector'];
    const bools = ['adblock','adBlock','adblocker','isAdBlockActive','hasAdblock','usesAdblock'];
    const noopCtor = function(){};
    Object.assign(noopCtor.prototype, { setOption: NOP, on: NOP, check: NOP, detect: NOP });

    const def = (k, v) => {
      try { Object.defineProperty(window, k, { configurable: true, get(){return v;}, set(){}}); }
      catch { window[k] = v; }
    };
    names.forEach(n => def(n, noopCtor));
    def('blockAdBlock', new noopCtor());
    bools.forEach(n => def(n, false));
  })();

  const addStyle = css => {
    try { GM_addStyle ? GM_addStyle(css) : (()=>{ const s=document.createElement('style'); s.textContent=css; document.documentElement.appendChild(s); })(); }
    catch {}
  };
  addStyle(`
    /* sembunyikan overlay anti-adblock umum */
    :where([class*="adblock"],[id*="adblock"],[class*="anti-ad"],[id*="anti-ad"],
           [class*="adblocker"],[id*="adblocker"],.fc-ab-root,.tp-backdrop,.tp-modal){
      display:none !important; visibility:hidden !important; pointer-events:none !important;
    }
  `);

  const OVERLAY_RX = /adblock|ad-block|anti.?ad|adblocker|paywall|adsbox|tp-backdrop|fc-ab-root/i;
  const LOCK_CLASSES = ['no-scroll','stop-scrolling','overlay-open','modal-open','disable-scroll','noScroll'];

  const isLocked = () => {
    const de = document.documentElement, b = document.body;
    if (!de || !b) return false;
    const co = (el) => el && getComputedStyle(el);
    const deCS = co(de), bCS = co(b);
    const overflowLocked = (deCS && deCS.overflow !== 'visible' && deCS.overflow !== 'auto') ||
                           (bCS && bCS.overflow !== 'visible' && bCS.overflow !== 'auto');
    const classLocked = LOCK_CLASSES.some(c => de.classList.contains(c) || b.classList.contains(c));
    const bigOverlay = !!document.querySelector([
      '[class*="adblock"]','[id*="adblock"]','[class*="anti-ad"]','[id*="anti-ad"]',
      '.fc-ab-root','.tp-backdrop','.tp-modal','[class*="paywall"]','[id*="paywall"]'
    ].join(','));
    return overflowLocked || classLocked || bigOverlay;
  };

  function arm() {
    if (armed) return;
    armed = true;

    const restore = () => {
      const de = document.documentElement, b = document.body;
      if (!de || !b) return;
      de.style.overflow = 'auto'; b.style.overflow = 'auto'; b.style.position = 'static';
      LOCK_CLASSES.forEach(c => { de.classList.remove(c); b.classList.remove(c); });
    };
    restore();

    const handler = (ev) => {
      if (!isLocked()) return;
      if (ev.cancelable) ev.stopImmediatePropagation();
    };
    ['wheel','mousewheel','DOMMouseScroll','touchmove','scroll','keydown'].forEach(evt => {
      window.addEventListener(evt, handler, { capture: true, passive: false });
      document.addEventListener(evt, handler, { capture: true, passive: false });
    });
    killHandlers = handler;

    mo = new MutationObserver(muts => {
      let touched = false;
      for (const m of muts) {
        for (const n of m.addedNodes) {
          if (n instanceof HTMLElement) {
            const cls = (n.className + ' ' + n.id);
            if (OVERLAY_RX.test(cls)) { n.remove(); touched = true; }
            else {
              const cs = getComputedStyle(n);
              const big = cs.position === 'fixed' && parseInt(cs.zIndex||'0',10) >= 1000 &&
                          n.clientHeight > innerHeight*0.9 && n.clientWidth > innerWidth*0.9;
              if (big) { n.remove(); touched = true; }
            }
          }
        }
      }
      if (touched) restore();
    });
    mo.observe(document.documentElement, { childList: true, subtree: true, attributes: false });
  }

  function maybeArm() {
    if (isLocked()) arm();
  }

  let checks = 0, maxChecks = 20;
  const tick = () => {
    maybeArm();
    checks++;
    if (armed || checks > maxChecks) return;
    setTimeout(tick, 180);
  };
  tick();

  addEventListener('keydown', e => {
    if (e.altKey && e.shiftKey && e.code === 'KeyA') location.reload();
  });

  addEventListener('beforeunload', () => {
    try { mo && mo.disconnect(); } catch {}
    if (killHandlers) {
      ['wheel','mousewheel','DOMMouseScroll','touchmove','scroll','keydown'].forEach(evt => {
        window.removeEventListener(evt, killHandlers, { capture: true });
        document.removeEventListener(evt, killHandlers, { capture: true });
      });
    }
  });
})();
