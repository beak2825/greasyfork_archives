// ==UserScript==
// @name         JanitorAI – Right Arrow Generate Indicator
// @namespace    gf:jai-green-right
// @version      1.0.6
// @description  The right arrow changes color when the next click would generate a new output.
// @match        https://janitorai.com/chats*
// @license      MIT
// @grant        unsafeWindow
// @inject-into  page
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544975/JanitorAI%20%E2%80%93%20Right%20Arrow%20Generate%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/544975/JanitorAI%20%E2%80%93%20Right%20Arrow%20Generate%20Indicator.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const W = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;

  const SEL = {
    right:  'button[aria-label="Right"]',
    left:   'button[aria-label="Left"]',
    slider: 'div[class*="_botChoicesSlider_"]',
  };

  // Styles
  const style = document.createElement('style');
  style.textContent = `
    .jai-green-arrow  { outline: 3px solid #22c55e !important; outline-offset: 2px !important; border-radius: 999px !important; }
    .jai-green-arrow  svg { color: #22c55e !important; fill: currentColor !important; }
    .jai-yellow-arrow { outline: 3px solid #f59e0b !important; outline-offset: 2px !important; border-radius: 999px !important; }
    .jai-yellow-arrow svg { color: #f59e0b !important; fill: currentColor !important; }
  `;
  document.documentElement.appendChild(style);

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  let ctx = { right: null, left: null, slider: null, sliderMO: null, rebinderMO: null, pulseTimer: null };

  // ---------- utils ----------
  function isVisible(el) {
    if (!el) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return false;
    const r = el.getBoundingClientRect();
    return r.width > 8 && r.height > 8;
  }

  function getViewport(slider) {
    let el = slider?.parentElement;
    while (el && el !== document.body) {
      const ox = getComputedStyle(el).overflowX;
      if (ox && ox !== 'visible') return el;
      el = el.parentElement;
    }
    return slider?.parentElement || slider;
  }

  // ---------- pairing ----------
  function bottomMostRight() {
    const candidates = $$(SEL.right).filter(isVisible);
    if (!candidates.length) return null;
    candidates.sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
    return candidates[candidates.length - 1];
  }

  function findNearestSliderFrom(node) {
    let el = node;
    for (let i = 0; el && i < 12; i++, el = el.parentElement) {
      const s = $(SEL.slider, el);
      if (s && isVisible(s)) return s;
    }
    const all = $$(SEL.slider).filter(isVisible);
    return all[all.length - 1] || null;
  }

  function pair() {
    const right = bottomMostRight();
    const slider = right ? findNearestSliderFrom(right) : null;
    const left = slider ? slider.parentElement?.querySelector(SEL.left) : null;

    const changed = right !== ctx.right || slider !== ctx.slider || left !== ctx.left;
    if (!changed) return;

    if (ctx.sliderMO) ctx.sliderMO.disconnect();

    ctx.right = right;
    ctx.slider = slider;
    ctx.left = left;

    if (ctx.right) ctx.right.addEventListener('click', () => pulse(3000), { capture: true });
    if (ctx.left)  ctx.left.addEventListener('click',  () => pulse(2000), { capture: true });

    if (ctx.slider) {
      ctx.sliderMO = new MutationObserver(() => {
        setTimeout(updateTint, 30);
        setTimeout(updateTint, 200);
        setTimeout(updateTint, 700);
      });
      ctx.sliderMO.observe(ctx.slider, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['style', 'class']
      });

      const vp = getViewport(ctx.slider);
      vp.addEventListener('scroll', updateTint, { passive: true });
      vp.addEventListener('transitionend', updateTint, { passive: true });
      vp.addEventListener('animationend', updateTint, { passive: true });
    }

    updateTint();
  }

  // ---------- index detection (no :scope; use children) ----------
  function sliderItems(slider) {
    return Array.from(slider?.children || []).filter(isVisible);
  }

  function indexFromTransform(slider, items) {
    const inline = slider.style.transform || '';
    let m = inline.match(/translateX\((-?\d+(?:\.\d+)?)%\)/);
    if (m) return clamp(Math.round(Math.abs(parseFloat(m[1])) / 100), 0, items.length - 1);

    const comp = getComputedStyle(slider).transform;
    if (comp && comp !== 'none') {
      const mm = comp.match(/matrix\(([^)]+)\)/);
      if (mm) {
        const parts = mm[1].split(',').map(s => parseFloat(s.trim()));
        const tx = parts[4] || 0;
        const w  = items[0]?.getBoundingClientRect().width || 1;
        return clamp(Math.round(Math.abs(tx) / w), 0, items.length - 1);
      }
    }
    return null;
  }

  function indexByViewport(slider, items) {
    const vp = getViewport(slider).getBoundingClientRect();
    const centerV = vp.left + vp.width / 2;
    let best = 0, bestDist = Infinity;
    for (let i = 0; i < items.length; i++) {
      const r = items[i].getBoundingClientRect();
      const dist = Math.abs((r.left + r.width / 2) - centerV);
      if (dist < bestDist) { bestDist = dist; best = i; }
    }
    return best;
  }

  function currentIndex(slider) {
    const items = sliderItems(slider);
    if (!items.length) return 0;
    return indexFromTransform(slider, items) ?? indexByViewport(slider, items);
  }

  function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }

  // ---------- tint logic ----------
  function updateTint() {
    if (!ctx.right || !ctx.slider) return;
    const items = sliderItems(ctx.slider);
    if (!items.length) {
      ctx.right.classList.remove('jai-green-arrow', 'jai-yellow-arrow');
      return;
    }
    const idx = currentIndex(ctx.slider);
    const last = items.length - 1;
    const secondLast = last - 1;

    ctx.right.classList.remove('jai-green-arrow', 'jai-yellow-arrow');
    if (idx >= last) {
      ctx.right.classList.add('jai-green-arrow');      // last -> next click generates
    } else if (idx === secondLast) {
      ctx.right.classList.add('jai-yellow-arrow');     // one before last
    }
  }

  // ---------- keep it fresh ----------
  function pulse(ms) {
    if (ctx.pulseTimer) W.clearInterval(ctx.pulseTimer);
    const endAt = performance.now() + ms;
    ctx.pulseTimer = W.setInterval(() => {
      if (performance.now() > endAt) {
        W.clearInterval(ctx.pulseTimer);
        ctx.pulseTimer = null;
      }
      pair();
      updateTint();
    }, 160);
  }

  function startRebinder() {
    if (ctx.rebinderMO) ctx.rebinderMO.disconnect();
    ctx.rebinderMO = new MutationObserver(() => {
      if (!document.contains(ctx.right) || !document.contains(ctx.slider)) pair();
    });
    ctx.rebinderMO.observe(document.body, { childList: true, subtree: true });
  }

  // Pulse after generation POSTs (hook in PAGE context for TM)
  (function patchNetwork() {
    const looksGen = (url, method) =>
      method === 'POST' &&
      /janitorai\.com/i.test(url) &&
      /(generate|regenerate|completion|completions|respond|messages|chat)/i.test(url);

    const _fetch = W.fetch;
    try {
      W.fetch = function(resource, init = {}) {
        try {
          const url = typeof resource === 'string' ? resource : resource.url;
          const method = (init?.method || 'GET').toUpperCase();
          if (looksGen(url, method)) pulse(5000);
        } catch {}
        return _fetch.apply(this, arguments);
      };
    } catch {}

    const XO = W.XMLHttpRequest && W.XMLHttpRequest.prototype.open;
    const XS = W.XMLHttpRequest && W.XMLHttpRequest.prototype.send;
    if (XO && XS) {
      W.XMLHttpRequest.prototype.open = function(method, url) {
        this._m = (method || 'GET').toUpperCase();
        this._u = url || '';
        return XO.apply(this, arguments);
      };
      W.XMLHttpRequest.prototype.send = function(body) {
        try {
          if (looksGen(this._u || '', this._m || 'GET')) pulse(5000);
        } catch {}
        return XS.apply(this, arguments);
      };
    }
  })();

  function hookSpa() {
    const H = W.history;
    if (H && H.pushState) {
      const origPush = H.pushState;
      H.pushState = function () {
        const r = origPush.apply(this, arguments);
        W.setTimeout(() => { pair(); updateTint(); }, 400);
        return r;
      };
      W.addEventListener('popstate', () => W.setTimeout(() => { pair(); updateTint(); }, 400));
    }
    W.addEventListener('resize', updateTint);
  }

  function boot() {
    pair();
    startRebinder();
    hookSpa();

    // initial retries for late-mount
    let tries = 0;
    const iv = W.setInterval(() => {
      pair();
      if (++tries > 40 || (ctx.right && ctx.slider)) W.clearInterval(iv);
    }, 200);
  }

  boot();
})();
