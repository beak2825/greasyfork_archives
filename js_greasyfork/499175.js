// ==UserScript==
// @name         Torn: Execute
// @namespace    https://firestore.cloud
// @version      2.8
// @description  Highlights Secondary for an Execution using the original green background + 3px green border
// @author       811 [1921241], Whiskey_Jack [1994581]
// @match        https://www.torn.com/loader.php?sid=attack*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499175/Torn%3A%20Execute.user.js
// @updateURL https://update.greasyfork.org/scripts/499175/Torn%3A%20Execute.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Enter execute % below
  const DEFAULT_THRESHOLD = 0.24;

  const getThreshold = () => {
    const v = localStorage.getItem('executeThreshold');
    const n = v ? Number(v) : NaN;
    return Number.isFinite(n) && n > 0 && n < 1 ? n : DEFAULT_THRESHOLD;
  };

  addStyles(`
#weapon_second.execute-highlighted {
  background-color: green !important;
  border: 3px solid green !important;
  border-radius: 8px; /* keeps corners tidy; remove if you prefer square */
}
  `);

  function addStyles(css) {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }

  function waitFor(sel, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
      const start = performance.now();
      (function tick() {
        const el = document.querySelector(sel);
        if (el) return resolve(el);
        if (performance.now() - start > timeoutMs) return reject(new Error(`Timeout waiting for ${sel}`));
        requestAnimationFrame(tick);
      })();
    });
  }

  function parseHealthFromText(txt) {
    if (!txt) return null;
    const nums = (txt.match(/\d[\d,]*/g) || []).map(s => parseInt(s.replace(/,/g, ''), 10)).filter(Number.isFinite);
    if (nums.length >= 2 && nums[1] > 0) return { current: nums[0], max: nums[1] };
    return null;
  }

  function findActiveHeaderNodes() {
    const header = document.querySelector('.header___gISeK.activeHeader___Ika7F');
    if (!header) return null;
    const healthEntry = header.querySelector('.textEntries___bbjd5 .entry___m0IK_ i.iconHealth___Ojjg3')?.parentElement || null;
    const visibleSpan = healthEntry ? (healthEntry.querySelector('span[aria-live="polite"], span') || null) : null;
    const srOnly = header.querySelector('.srOnly___AEss3[aria-live="polite"]') || null;
    return { header, visibleSpan, srOnly };
  }

  function getLifeValues() {
    const nodes = findActiveHeaderNodes();
    if (!nodes) return null;

    if (nodes.visibleSpan) {
      const p = parseHealthFromText(nodes.visibleSpan.textContent);
      if (p) return p;
    }
    if (nodes.srOnly) {
      const p = parseHealthFromText(nodes.srOnly.textContent);
      if (p) return p;
    }
    return null;
  }

  function getSecondaryWeapon() {
    const el = document.querySelector('#weapon_second');
    if (!el) return null;
    const hasExecute = !!el.querySelector('.bonus-attachment-execute');
    return { el, hasExecute };
  }

  function applyHighlight(el) {
    el.classList.add('execute-highlighted');
  }
  function removeHighlight(el) {
    el.classList.remove('execute-highlighted');
  }

  function recompute() {
    const weapon = getSecondaryWeapon();
    if (!weapon || !weapon.el) return;

    // Only highlight if the Secondary actually has the Execute attachment
    if (!weapon.hasExecute) {
      removeHighlight(weapon.el);
      return;
    }

    const life = getLifeValues();
    if (!life) return;

    const pct = life.current / life.max;
    const th = getThreshold();

    if (pct < th) applyHighlight(weapon.el);
    else removeHighlight(weapon.el);
  }

  async function main() {
    try {
      await waitFor('#weapon_second');
      await waitFor('.header___gISeK.activeHeader___Ika7F');
    } catch {
      return;
    }

    // First pass
    recompute();

    // Observe header for health updates
    const nodes = findActiveHeaderNodes();
    if (nodes?.header) {
      const obs = new MutationObserver(() => recompute());
      obs.observe(nodes.header, { childList: true, subtree: true, characterData: true });
    }

    // Poll as a safety net (React often swaps nodes)
    let ticks = 0;
    const id = setInterval(() => {
      recompute();
      if (++ticks > 180) clearInterval(id); // ~72s
    }, 400);

    // React may replace the weapon node; watch its parent
    const slotParent = document.querySelector('#weapon_second')?.parentElement;
    if (slotParent) {
      const obs2 = new MutationObserver(() => recompute());
      obs2.observe(slotParent, { childList: true });
    }

    // Allow live threshold tweaks
    window.addEventListener('storage', (e) => {
      if (e.key === 'executeThreshold') recompute();
    });
  }

  main();
})();
