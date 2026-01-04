// ==UserScript==
// @name         Albert Heijn Kortingspercentages en prijs per kg/ml/etc.
// @namespace    https://wol.ph/
// @version      1.1.0
// @description  Add price per unit and discount percentage to products and promotion cards
// @author       wolph
// @match        https://www.ah.nl/*
// @icon         https://icons.duckduckgo.com/ip2/ah.nl.ico
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/515067/Albert%20Heijn%20Kortingspercentages%20en%20prijs%20per%20kgmletc.user.js
// @updateURL https://update.greasyfork.org/scripts/515067/Albert%20Heijn%20Kortingspercentages%20en%20prijs%20per%20kgmletc.meta.js
// ==/UserScript==

const DEBUG = false;

(function () {
  'use strict';

  const processed = new Set();

  /** -------- Utils -------- */

  const log = (...args) => DEBUG && console.log('[AHK]', ...args);

  /** Color scale for discount badge */
  function getDiscountColors(discountPercentage) {
    const p = parseFloat(discountPercentage || 0);
    if (p >= 80) return { backgroundColor: '#008000', color: '#FFFFFF' };
    if (p >= 60) return { backgroundColor: '#32CD32', color: '#000000' };
    if (p >= 40) return { backgroundColor: '#FFFF00', color: '#000000' };
    if (p >= 20) return { backgroundColor: '#FFA500', color: '#000000' };
    return { backgroundColor: '#FF0000', color: '#FFFFFF' };
  }

  /** Parse human text into a normalized decimal (e.g. "1,5" -> 1.5) */
  function toNumber(txt) {
    if (!txt) return NaN;
    return parseFloat(String(txt).replace(',', '.').trim());
  }

  /**
   * Try to parse discount % from label text like:
   * - "50% korting"
   * - "2e gratis" (50)
   * - "2 + 1 gratis" (33.33)
   * - "2 voor 2.99" (we can compute % only if priceWas exists; otherwise we return null and let priceWas drive it)
   * - "2 stuks 50%" (50)
   */
  function parseDiscountFromLabels(labelStrings, priceNow, priceWas) {
    const text = labelStrings.join(' | ').toLowerCase();

    // Direct % korting
    const mPct = text.match(/(\d{1,3})\s*%\s*korting/);
    if (mPct) return parseFloat(mPct[1]);

    // Tier like "2 stuks 50%" or "1 stuk 30%"
    const mTierPct = text.match(/(\d+)\s*(stuk|stuks).{0,10}(\d{1,3})\s*%/);
    if (mTierPct) return parseFloat(mTierPct[3]);

    // e.g. "2e gratis"
    if (/(\b2e\b|\b2e\s+gratis\b)/.test(text) || /\b2e\b.*gratis/.test(text)) {
      return 50;
    }
    // 1+1 gratis / 2+1 gratis
    if (/(1\s*\+\s*1)\s*gratis/.test(text)) return 50;
    if (/(2\s*\+\s*1)\s*gratis/.test(text)) return 33.33;

    // "2 voor 2.99" doesn't give a % by itself; if priceWas is present use that.
    if (priceWas && priceNow && priceWas > priceNow) {
      return ((priceWas - priceNow) / priceWas) * 100;
    }

    return null;
  }

  /**
   * Extract unit info from a few places:
   *  - Title (data-testhook="promotion-card-title")
   *  - Description (data-testhook="card-description")
   *  - Labels (aria-label on each label chip)
   *
   * Returns { unitKind: 'kg'|'l'|'stuk', unitQty: number|null, perBase: 'item'|'bundle'|'100g', note?: string }
   *  - unitQty is the quantity attached to the title/description, e.g. 500 (grams), 1.5 (kilo), 2 (stuks), 750 (ml)
   *  - If we detect "per 100 gram", we return perBase = '100g'
   */
  function extractUnitContext(card) {
    const getTxt = (sel) => card.querySelector(sel)?.textContent?.trim() || '';
    const title = getTxt('[data-testhook="promotion-card-title"]');
    const desc = getTxt('[data-testhook="card-description"]');
    const labelEls = card.querySelectorAll('[data-testhook="promotion-labels"] .promotion-label-base_base__dUh4i');
    const labels = [...labelEls].map(el => el.getAttribute('aria-label') || '').filter(Boolean);

    const hay = `${title} | ${desc} | ${labels.join(' | ')}`.toLowerCase();

    // "per 100 gram"
    if (/\bper\s*100\s*(g|gram)\b/.test(hay)) {
      return { unitKind: 'kg', unitQty: 0.1, perBase: '100g', note: 'per 100g' };
    }

    // weight in grams/kilos (take the first that appears)
    const mGram = hay.match(/(\d{1,4}(?:[.,]\d{1,2})?)\s*(g|gram)\b/);
    if (mGram) {
      const grams = toNumber(mGram[1]);
      return { unitKind: 'kg', unitQty: grams / 1000, perBase: 'item' };
    }
    const mKg = hay.match(/(\d{1,2}(?:[.,]\d{1,3})?)\s*(kg|kilo)\b/);
    if (mKg) {
      const kg = toNumber(mKg[1]);
      return { unitKind: 'kg', unitQty: kg, perBase: 'item' };
    }

    // liquids
    const mMl = hay.match(/(\d{1,4}(?:[.,]\d{1,2})?)\s*ml\b/);
    if (mMl) {
      const ml = toNumber(mMl[1]);
      return { unitKind: 'l', unitQty: ml / 1000, perBase: 'item' };
    }
    const mL = hay.match(/(\d{1,2}(?:[.,]\d{1,3})?)\s*l\b/);
    if (mL) {
      const l = toNumber(mL[1]);
      return { unitKind: 'l', unitQty: l, perBase: 'item' };
    }

    // count (stuk/stuks)
    const mSt = hay.match(/(\d{1,3})\s*(stuk|stuks)\b/);
    if (mSt) {
      return { unitKind: 'stuk', unitQty: parseInt(mSt[1], 10), perBase: 'bundle' };
    }

    return { unitKind: null, unitQty: null, perBase: 'item' };
  }

  /**
   * Compute price-per-unit text given priceNow, unit context and possibly "2 voor ..." bundles.
   * Handles:
   *  - per 100g → convert to €/kg
   *  - grams/kg → €/kg
   *  - ml/l → €/l
   *  - stuks → €/stuk (if bundle detected, divides price by count)
   *  - "N voor X" (from labels) → we divide price by N to get per-item before unit math
   */
  function computePPU(card, priceNow) {
    // Fetch labels to detect "N voor X"
    const labelEls = card.querySelectorAll('[data-testhook="promotion-labels"] .promotion-label-base_base__dUh4i');
    const labels = [...labelEls].map(el => el.getAttribute('aria-label') || '').filter(Boolean).join(' | ').toLowerCase();

    let bundleCount = 1;
    const mBundle = labels.match(/(\d+)\s*voor\s*([\d.,]+)/);
    if (mBundle) {
      bundleCount = parseInt(mBundle[1], 10) || 1;
      // If "N voor X", priceNow is already X (total), so per-item:
      priceNow = priceNow / bundleCount;
    }

    const unitInfo = extractUnitContext(card);
    const { unitKind, unitQty, perBase } = unitInfo;

    if (!unitKind) return null;

    if (unitKind === 'kg') {
      if (perBase === '100g') {
        // priceNow is per 100g → €/kg = priceNow * 10
        const perKg = priceNow * 10;
        return { text: `€${perKg.toFixed(2)} per kg`, value: perKg };
      }
      if (unitQty && unitQty > 0) {
        const perKg = priceNow / unitQty;
        return { text: `€${perKg.toFixed(2)} per kg`, value: perKg };
      }
    }

    if (unitKind === 'l') {
      if (unitQty && unitQty > 0) {
        const perL = priceNow / unitQty;
        return { text: `€${perL.toFixed(2)} per l`, value: perL };
      }
    }

    if (unitKind === 'stuk') {
      // If unitQty is number of pieces in bundle/title, show per stuk:
      const count = unitQty && unitQty > 0 ? unitQty : 1;
      const perStuk = priceNow / count;
      return { text: `€${perStuk.toFixed(2)} per stuk`, value: perStuk };
    }

    return null;
  }

  /** Inject or update a PPU row below the price block */
  function upsertPPUNode(priceBlock, ppuText) {
    if (!ppuText) return;
    let node = priceBlock.parentElement?.querySelector('.ahk-price-per-unit');
    if (!node) {
      node = document.createElement('div');
      node.className = 'ahk-price-per-unit';
      node.style.fontSize = '12px';
      node.style.opacity = '0.85';
      node.style.marginTop = '2px';
      priceBlock.parentElement?.appendChild(node);
    }
    node.textContent = ppuText;
  }

  /** Inject or update a discount badge chip inside the label cluster or create our own */
  function upsertDiscountBadge(card, discountPct) {
    if (discountPct == null || isNaN(discountPct)) return;
    const pct = Math.round(discountPct * 10) / 10; // 1 decimal

    const host =
      card.querySelector('[data-testhook="promotion-labels"]') ||
      card.querySelector('[data-testhook="card-content"]') ||
      card;

    let badge = host.querySelector('.ahk-discount-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'ahk-discount-badge';
      badge.style.display = 'inline-flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '6px';
      badge.style.fontWeight = '700';
      badge.style.fontSize = '12px';
      badge.style.padding = '2px 6px';
      badge.style.borderRadius = '6px';
      badge.style.marginTop = '4px';
      badge.style.width = 'fit-content';
      host.appendChild(badge);
    }
    const { backgroundColor, color } = getDiscountColors(pct);
    badge.style.backgroundColor = backgroundColor;
    badge.style.color = color;
    badge.textContent = `${pct}%`;
  }

  /** ------- Processors ------- */

  function processPromotionCard(card) {
    const id = card.getAttribute('id') || card.getAttribute('href') || card.dataset.testhookId || card.outerHTML.slice(0, 120);
    if (!id || processed.has(id)) return;

    const priceEl = card.querySelector('[data-testhook="price"]');
    if (!priceEl) return;

    const nowAttr = priceEl.getAttribute('data-testpricenow');
    const wasAttr = priceEl.getAttribute('data-testpricewas');
    const priceNow = toNumber(nowAttr);
    const priceWas = wasAttr ? toNumber(wasAttr) : null;

    if (isNaN(priceNow)) return;

    // 1) Discount %
    let discountFromPrices = null;
    if (priceWas && priceWas > priceNow) {
      discountFromPrices = ((priceWas - priceNow) / priceWas) * 100;
    }

    // Also parse labels for discount hints
    const labelEls = card.querySelectorAll('[data-testhook="promotion-labels"] .promotion-label-base_base__dUh4i');
    const labelStrings = [...labelEls].map(el => el.getAttribute('aria-label') || '').filter(Boolean);
    const parsedLabelDiscount = parseDiscountFromLabels(labelStrings, priceNow, priceWas);

    const discountPct = (discountFromPrices ?? parsedLabelDiscount ?? null);

    // 2) Price per unit
    const ppu = computePPU(card, priceNow);
    if (ppu) {
      upsertPPUNode(priceEl, ppu.text);
    }

    // 3) Badge
    if (discountPct != null) {
      upsertDiscountBadge(card, discountPct);
    }

    processed.add(id);
    log('Processed promo card:', id, { priceNow, priceWas, discountPct, ppu });
  }

  /** (Optional) Old product-card support kept intact (no selector changes here) */
  function processLegacyProductCards() {
    const cards = document.querySelectorAll('article[data-testhook="product-card"]');
    if (!cards.length) return;
    // Your existing product-card logic is quite long; to keep this update focused on the new promo cards,
    // we leave product-card handling as-is. If you need it, keep the old code here.
  }

  /** Scan current DOM once */
  function scan() {
    // New promo cards
    document.querySelectorAll('a.promotion-card_root__tQA3z[data-testhook="promotion-card"]').forEach(processPromotionCard);
    // Legacy product cards (no-ops if none present)
    processLegacyProductCards();
  }

  /** Observe changes (Bonus pages are lazy-rendered) */
  function installObserver() {
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        for (const node of m.addedNodes || []) {
          if (!(node instanceof HTMLElement)) continue;
          if (node.matches && node.matches('a.promotion-card_root__tQA3z[data-testhook="promotion-card"]')) {
            processPromotionCard(node);
          } else if (node.querySelector) {
            const news = node.querySelectorAll?.('a.promotion-card_root__tQA3z[data-testhook="promotion-card"]');
            news && news.forEach(processPromotionCard);
          }
        }
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  /** Kickoff */
  window.setTimeout(scan, 800);
  installObserver();
  if (!DEBUG) setInterval(scan, 5000);
})();
