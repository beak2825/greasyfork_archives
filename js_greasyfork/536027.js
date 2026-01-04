// ==UserScript==
// @name         eBay Sponsored Listing Exploder 9000
// @namespace    http://tampermonkey.net/
// @version      2
// @description  "Exploders" sponsored listings on the search page
// @author       sir rob
// @match        *://*.ebay.com/sch/i.html?_nkw=*
// @exclude      *://*.ebay.com/sch/i.html?_ssn=*
// @exclude      *://*.www.ebay.com/usr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ebay.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536027/eBay%20Sponsored%20Listing%20Exploder%209000.user.js
// @updateURL https://update.greasyfork.org/scripts/536027/eBay%20Sponsored%20Listing%20Exploder%209000.meta.js
// ==/UserScript==

// Known bugs: Must be logged in - #2 listing isn't always first visible, will have to work on further detection

// Changelog:
// v1.0 several attempts at finding actual sponsored listings
// v1.1 first working detection, horribly unreliable and depends on..luck basically
// v1.2 first reliable working detection, marks sponsored listings in red 100% of the time
// v1.3 first version that detects and deletes sponsored listings, then deletes all of the rest of the listings as it finds a new span
// v1.4 reliably deletes sponsored listings, very slow due to how large of a delay it needed
// v1.5 solid build of much faster script, no more delay - just lock in the original span for the listing we sniff
// v1.51 fix script running when viewing user store
// v1.52 fix script running on user store again (of course I only have issues when I post the script)
// v1.53 add adjustment for where a sponsored listing occurs
// v1.54 removed adjustable toggle, added logic to use last listing automatically from sort url sop.
// v1.55 compare sort option from div, url sop is default
// v1.56 removed debug, add toggle for debug UI, add languages for sort detection backup
// v2 aka 1.6 but it actually updates* few hours of testing, minor changes, freeGPT made it cleaner


(function () {
  'use strict';

  let refClass = null;
  const SHOW_DEBUG_UI = false;
  const MODE_KEY = 'ebayCleanerUseLastListing';
  const OVERRIDE_KEY = 'ebayCleanerOverride';
  const PREFER_SOP_KEY = 'ebayCleanerPreferSop';

  let useLastListing = false;
  let userHasOverridden = false;
  let preferSop = localStorage.getItem(PREFER_SOP_KEY) === 'true'; // if error is logged change to false

  const sopMap = {
    '12': 'best match',
    '1': 'ending soonest',
    '10': 'newly listed',
    '15': 'lowest first',
    '16': 'highest first',
    '7': 'nearest first'
  };

  const bestMatchLabels = [ // if preferSop is false and your preferred language isn't working, add/change one of these without a "-"
    'best match',
    'pertinence',
    'rilevanza',
    'beste ergebnisse',
    'mejor resultado'
  ];

  function getSopValueFromUrl() {
    const match = window.location.search.match(/[\?&]_sop=(\d+)/);
    return match ? match[1] : null;
  }

  function getSortLabelFromButton() {
    const btn = document.querySelector('button[aria-label*="Sort selector"] span.btn__cell');
    return btn ? btn.innerText.trim().toLowerCase() : null;
  }

  function labelLooksLikeBestMatch(label) {
    return bestMatchLabels.some(phrase => label.includes(phrase));
  }

  function createToggleUI() {
    const container = document.createElement('div');
    Object.assign(container.style, {
      position: 'fixed',
      top: '10px',
      left: '10px',
      zIndex: '9999',
      background: '#222',
      color: '#fff',
      fontSize: '12px',
      borderRadius: '6px',
      padding: '8px',
      fontFamily: 'sans-serif',
      userSelect: 'none',
      boxShadow: '0 0 4px rgba(0,0,0,0.3)'
    });

    const overrideBtn = document.createElement('div');
    overrideBtn.style.cursor = 'pointer';
    overrideBtn.style.marginBottom = '6px';
    overrideBtn.innerText = `Override: ${userHasOverridden ? 'ON' : 'OFF'}`;
    overrideBtn.onclick = () => {
      userHasOverridden = !userHasOverridden;
      overrideBtn.innerText = `Override: ${userHasOverridden ? 'ON' : 'OFF'}`;
      if (!userHasOverridden) {
        localStorage.removeItem(MODE_KEY);
        localStorage.setItem(OVERRIDE_KEY, 'false');
      } else {
        localStorage.setItem(OVERRIDE_KEY, 'true');
        localStorage.setItem(MODE_KEY, useLastListing);
      }
      refClass = null;
      initReference();
    };

    const refToggle = document.createElement('div');
    refToggle.style.cursor = 'pointer';
    refToggle.innerText = `Ref from: ${useLastListing ? 'Last Listing' : '2nd Listing'}`;
    refToggle.onclick = () => {
      if (!userHasOverridden) {
        alert("Enable override to manually set reference mode.");
        return;
      }
      useLastListing = !useLastListing;
      localStorage.setItem(MODE_KEY, useLastListing);
      refToggle.innerText = `Ref from: ${useLastListing ? 'Last Listing' : '2nd Listing'}`;
      refClass = null;
      initReference();
    };

    const sourceToggle = document.createElement('div');
    sourceToggle.style.cursor = 'pointer';
    sourceToggle.style.marginTop = '6px';
    sourceToggle.innerText = `Use source: ${preferSop ? 'URL (sop=xx)' : 'Sort Button'}`;
    sourceToggle.onclick = () => {
      preferSop = !preferSop;
      localStorage.setItem(PREFER_SOP_KEY, preferSop);
      sourceToggle.innerText = `Use source: ${preferSop ? 'URL (sop=xx)' : 'Sort Button'}`;
      refClass = null;
      initReference();
    };

    container.appendChild(overrideBtn);
    container.appendChild(refToggle);
    container.appendChild(sourceToggle);
    document.body.appendChild(container);
  }

  function initReference() {
    const items = Array.from(document.querySelectorAll('li.s-item'))
      .filter(el => el.querySelector('div[aria-hidden="true"]'));
    if (items.length < 3) return;

    if (!userHasOverridden) {
      const sop = getSopValueFromUrl();
      const label = getSortLabelFromButton();
      const expectedLabel = sopMap[sop] || 'unknown';

      if (sop && label && !label.includes(expectedLabel) && !labelLooksLikeBestMatch(label)) {
        console.error(`[eBay Cleaner ERROR ):] Sort mismatch: sop=${sop} (${expectedLabel}) but sort button says "${label}"`);
      }

      useLastListing = preferSop
        ? sop !== '12'
        : !(label && labelLooksLikeBestMatch(label));

      console.log(`[eBay Cleaner Debugger 9000] Auto mode (${preferSop ? 'sop' : 'button'}): using ${useLastListing ? 'last' : '2nd'} listing`);
    }

    const index = useLastListing ? items.length - 1 : 2;
    const targetItem = items[index];
    if (!targetItem) return;

    const sponsorDiv = targetItem.querySelector('div[aria-hidden="true"]');
    if (!sponsorDiv) return;

    const wrapper = sponsorDiv.closest('span');
    if (!wrapper || !wrapper.className) return;

    refClass = wrapper.className.trim();
    console.log(`[eBay Cleaner] refClass set from ${useLastListing ? 'last' : '2nd'} listing:`, refClass);

    removeByReference();
  }

  function removeByReference() {
    if (!refClass) return;
    const selector = 'span.' + refClass.split(/\s+/).join('.');
    document.querySelectorAll(selector).forEach(span => {
      const li = span.closest('li.s-item');
      if (li) {
        console.log('[eBay Cleaner] Removing sponsored listing:', li);
        li.remove();
      }
    });
  }

  function setup() {
    userHasOverridden = localStorage.getItem(OVERRIDE_KEY) === 'true';
    if (userHasOverridden) {
      useLastListing = localStorage.getItem(MODE_KEY) === 'true';
      console.log(`[eBay Cleaner eBay Cleaner Debugger 9000] Override ON: ${useLastListing ? 'Last Listing' : '2nd Listing'}`);
    }

    if (SHOW_DEBUG_UI) {
      createToggleUI();
    }
    initReference();

    new MutationObserver(() => {
      if (!refClass) {
        initReference();
      } else {
        removeByReference();
      }
    }).observe(document.body, { childList: true, subtree: true });
  }

  function waitForReady() {
    const check = () => {
      const hasItems = document.querySelectorAll('li.s-item').length >= 3;
      const hasSortBtn = document.querySelector('button[aria-label*="Sort selector"] span.btn__cell');
      if (hasItems && hasSortBtn) {
        setup();
      } else {
        setTimeout(check, 300);
      }
    };
    check();
  }

  window.addEventListener('load', waitForReady);
})();

