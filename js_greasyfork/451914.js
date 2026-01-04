// ==UserScript==
// @name         Youtube Sort & Filter Playlists When Saving Video
// @version      2025.10.27.10
// @namespace    https://gist.github.com/CaptainJack0404
// @description  Add sort & filter controls to the "Save video to..." dialog
// @author       CaptainJack0404
// @match        https://www.youtube.com/*
// @match        https://youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @noframes     true
// @downloadURL https://update.greasyfork.org/scripts/451914/Youtube%20Sort%20%20Filter%20Playlists%20When%20Saving%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/451914/Youtube%20Sort%20%20Filter%20Playlists%20When%20Saving%20Video.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const selectorApp = 'ytd-app';
  const selectorPopupContainer = 'ytd-popup-container';
  const selectorPopupDialogTag = 'tp-yt-iron-dropdown';

  // const debugMode = false;
  // const dlog = (m)=>{ if (debugMode) console.log(`**** YT TM SCRIPT >>> ${m}`); };
  const debugMode = false;
  const dlog = debugMode ? (m) => console.log(`**** YT TM SCRIPT >>> ${m}`) : () => {};

  const titleSel = '.ytListViewModelHost .yt-list-item-view-model__title';

  function getSaveDropdown() {
    const container = document.querySelector(selectorPopupContainer);
    if (!container) return null;
    const dropdowns = container.querySelectorAll(selectorPopupDialogTag);

    for (const dd of dropdowns) {
      const cs = getComputedStyle(dd);
      const r  = dd.getBoundingClientRect();
      const visible = r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
      if (!visible) continue;

      const listHost = dd.querySelector('yt-list-view-model.ytListViewModelHost');
      if (!listHost) continue;

      const hasSaveHeader = !!dd.querySelector('yt-panel-header-view-model[aria-label*="Save"]');
      const footerTxt = dd.querySelector('.yt-spec-button-shape-next__button-text-content')?.textContent || '';
      const hasNewPlaylist = /new playlist/i.test(footerTxt);

      if (hasSaveHeader || hasNewPlaylist) return dd;
    }
    return null;
  }

  // Return the actual row element that is the flex item
  function getRow(fromEl) {
    return fromEl.closest('toggleable-list-item-view-model') ||
           fromEl.closest('yt-list-item-view-model'); // fallback
  }

  function keyupSearch(e = null) {
    const dd = getSaveDropdown();
    if (!dd) return;
    const list = dd.querySelector('yt-list-view-model.ytListViewModelHost');
    if (!list) return;

    // Ensure flex so `order` works
    list.style.display = 'flex';
    list.style.flexDirection = 'column';

    const titlesEls = dd.querySelectorAll(titleSel);
    const q = (e?.target?.value || '').toLowerCase().trim();
    const showAll = !q;

    titlesEls.forEach(elTitle => {
      const row = getRow(elTitle);
      if (!row) return;
      if (showAll) {
        row.style.display = '';
      } else {
        const text = (elTitle.textContent || '').toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      }
    });

    const lastRow = dd.querySelector('yt-list-view-model toggleable-list-item-view-model:last-of-type');
    if (lastRow) lastRow.style.marginBottom = '16px';
  }

  function shieldControl(el) {
    ['pointerdown','mousedown','mouseup','click','touchstart','touchend','pointerup']
      .forEach(t => el.addEventListener(t, e => { e.stopPropagation(); }, false));
    el.style.pointerEvents = 'auto';
  }

  // Clear filter + relax heights each time the sheet (re)opens
  function resetFilterAndHeight(dd) {
    const input = dd.querySelector('.filter_save_to');
    if (input && input.value) {
      input.value = '';
    }

    // Show all rows explicitly
    dd.querySelectorAll(titleSel).forEach(elTitle => {
      const row = getRow(elTitle);
      if (row) row.style.display = '';
    });

    // Ensure the list is flex and not artificially constrained
    const list = dd.querySelector('yt-list-view-model.ytListViewModelHost');
    if (list) {
      list.style.display = 'flex';
      list.style.flexDirection = 'column';
      list.style.removeProperty('max-height');
      // Force a reflow then ensure display remains flex (nudges layout to recalc height)
      // eslint-disable-next-line no-unused-expressions
      list.offsetHeight;
      list.style.display = 'flex';
    }

    // If the outer sheet capped itself earlier, remove its inline max-height
    const sheet = dd.querySelector('yt-sheet-view-model');
    if (sheet) {
      sheet.style.removeProperty('max-height');
    }

    // You preferred no wrapper overflow tweak
    // const wrapper = dd.querySelector('#contentWrapper');
    // if (wrapper) wrapper.style.overflow = 'visible';
  }

  // NEW: keep the dropdown fully within the viewport (first open fix for position)
  function clampDropdownIntoViewport(dd, margin = 8) {
    const r = dd.getBoundingClientRect();
    let newTop  = r.top;
    let newLeft = r.left;

    // If bottom overflows, pull up; if top is above, push down
    if (r.bottom > window.innerHeight - margin) {
      newTop = Math.max(margin, window.innerHeight - margin - r.height);
    }
    if (r.top < margin) {
      newTop = Math.max(newTop, margin);
    }

    // If right overflows, pull left; if left is off, push right
    if (r.right > window.innerWidth - margin) {
      newLeft = Math.max(margin, window.innerWidth - margin - r.width);
    }
    if (r.left < margin) {
      newLeft = Math.max(newLeft, margin);
    }

    // Only write if changed (dd uses fixed positioning with inline left/top)
    if (Math.round(newTop) !== Math.round(r.top)) {
      dd.style.top = `${Math.round(newTop)}px`;
    }
    if (Math.round(newLeft) !== Math.round(r.left)) {
      dd.style.left = `${Math.round(newLeft)}px`;
    }
  }

  // Normalize after dialog is fully open & laid out (height + position)
  function afterOpenNormalize(dd) {
    const run = () => {
      resetFilterAndHeight(dd);
      clampDropdownIntoViewport(dd, 8);
    };
    // Next two frames
    requestAnimationFrame(() => {
      requestAnimationFrame(run);
    });
    // Small delayed pass, in case YT flips inline styles after paint
    setTimeout(run, 120);
    // Belt-and-suspenders: a slightly later pass for first-open quirks
    setTimeout(run, 240);
  }

  function addSortAndFilterToPopup() {
    const dd = getSaveDropdown();
    if (!dd) return;

    const list = dd.querySelector('yt-list-view-model.ytListViewModelHost');
    if (!list) return;

    if (dd.dataset.ytSfInjected === '1') {
      // If we're seeing a reopened sheet, ensure we reset state once per open.
      if (dd.dataset.ytSfOpen !== '1') {
        dd.dataset.ytSfOpen = '1';
        resetFilterAndHeight(dd);
        afterOpenNormalize(dd); // ensure first frame resize + position are correct
      }
      return;
    }

    dlog('addSortAndFilterToPopup');

    const headerButtonsSel = `.ytPanelHeaderViewModelTrailingButtons`;
    const headerButtons = dd.querySelector(headerButtonsSel);
    if (!headerButtons) return;

    // Make sure flex is enabled so order takes effect
    list.style.display = 'flex';
    list.style.flexDirection = 'column';

    const containerDiv = document.createElement('div');
    // Make the header controls more compact
    containerDiv.style.margin = '4px 0 0 8px';
    containerDiv.style.pointerEvents = 'auto';

    const sortButton = document.createElement('button');
    sortButton.id = 'sort_save_to';
    sortButton.type = 'button';
    sortButton.style.cssText =
      'background:#f8f8f8;border:1px solid rgb(211,211,211);border-radius:2px;' +
      'color:#000;padding:4px 8px;margin-right:8px;line-height:1.1;font-size:12px;';
    sortButton.textContent = 'A-Z ↓';

    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.className = 'filter_save_to';
    filterInput.placeholder = 'Filter playlists...';
    filterInput.autocomplete = 'off';
    filterInput.style.cssText =
      'background:#fff;color:#111;padding:4px 8px;border:1px solid rgb(211,211,211);' +
      'border-radius:2px;width:45%;line-height:1.1;font-size:12px;';
    filterInput.style.pointerEvents = 'auto';

    shieldControl(sortButton);
    shieldControl(filterInput);

    containerDiv.appendChild(sortButton);
    containerDiv.appendChild(filterInput);
    headerButtons.appendChild(containerDiv);

    filterInput.addEventListener('input', keyupSearch);
    filterInput.addEventListener('keyup',  keyupSearch);

    let isPlaylistSorted = false;

    sortButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();

      // Ensure flex
      list.style.display = 'flex';
      list.style.flexDirection = 'column';

      const titleNodes = Array.from(dd.querySelectorAll(titleSel));
      if (!titleNodes.length) return;

      if (!isPlaylistSorted) {
        const rows = titleNodes.map((tn, i) => ({
          row: getRow(tn),
          title: (tn.textContent || '').trim(),
          origIndex: i
        })).filter(x => x.row);

        rows.forEach((x, i) => {
          if (!x.row.hasAttribute('data-origOrder')) {
            x.row.setAttribute('data-origOrder', String(i));
          }
        });

        rows.sort((a,b) => a.title.localeCompare(b.title, undefined, { sensitivity:'base' }));

        rows.forEach((x, idx) => {
          x.row.style.order = String(idx + 1);
          x.row.style.display = '';
        });

        const lastRow = dd.querySelector('yt-list-view-model toggleable-list-item-view-model:last-of-type');
        if (lastRow) lastRow.style.marginBottom = '16px';

        isPlaylistSorted = true;
        sortButton.style.background = '#88d988';
      } else {
        titleNodes.forEach(tn => {
          const row = getRow(tn);
          if (!row) return;
          const orig = row.getAttribute('data-origOrder');
          row.style.order = (orig != null) ? String(Number(orig) + 1) : '';
        });

        const lastRow = dd.querySelector('yt-list-view-model toggleable-list-item-view-model:last-of-type');
        if (lastRow) lastRow.style.marginBottom = '16px';

        isPlaylistSorted = false;
        sortButton.style.background = '#f8f8f8';
      }
    }, false);

    dd.dataset.ytSfInjected = '1';
    dd.dataset.ytSfOpen = '1'; // mark as open now
    resetFilterAndHeight(dd);   // ensure clean state on first injection
    afterOpenNormalize(dd);     // also clamp position on first open
    keyupSearch();
  }

  // Debounce to avoid MO bursts
  let injectTimer = null;
  function scheduleInject() {
    if (injectTimer) clearTimeout(injectTimer);
    injectTimer = setTimeout(() => {
      injectTimer = null;

      // Detect open/close transitions and react accordingly
      const container = document.querySelector(selectorPopupContainer);
      if (container) {
        container.querySelectorAll(selectorPopupDialogTag).forEach(dd => {
          const cs = getComputedStyle(dd);
          const r  = dd.getBoundingClientRect();
          const visible = r.width > 0 && r.height > 0 && cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';

          if (visible) {
            if (dd.dataset.ytSfOpen !== '1') {
              // just opened
              dd.dataset.ytSfOpen = '1';
              if (dd.dataset.ytSfInjected === '1') {
                resetFilterAndHeight(dd);
                afterOpenNormalize(dd); // normalize height + clamp position
              }
            }
          } else {
            if (dd.dataset.ytSfOpen === '1') {
              // just closed
              dd.dataset.ytSfOpen = '0';
            }
          }
        });
      }

      const dd = getSaveDropdown();
      if (!dd) return;
      addSortAndFilterToPopup();
    }, 80);
  }

  const observePopupContainer = new MutationObserver(() => {
    const dd = getSaveDropdown();
    if (dd) {
      dlog('MutationObserver (save dropdown present)');
    }
    scheduleInject();
  });

  function startObservingContainer() {
    const container = document.querySelector(selectorPopupContainer);
    if (!container) return;

    observePopupContainer.observe(container, {
      childList: true,
      attributes: true,
      attributeFilter: ['style','class','aria-hidden','hidden','inert'],
      subtree: true
    });

    const dd = getSaveDropdown();
    if (dd) {
      dlog('Initial check (save dropdown present)');
      scheduleInject();
    }
  }

  function waitForPopupContainerLoad() {
    if (document.querySelector(selectorPopupContainer)) {
      startObservingContainer();
    } else {
      const t = setInterval(() => {
        if (document.querySelector(selectorPopupContainer)) {
          clearInterval(t);
          startObservingContainer();
        }
      }, 250);
    }
  }

  function waitForAppLoad() {
    dlog('waitForAppLoad');
    if (document.querySelector(selectorApp)) {
      waitForPopupContainerLoad();
    } else {
      const t = setInterval(() => {
        if (document.querySelector(selectorApp)) {
          clearInterval(t);
          waitForPopupContainerLoad();
        }
      }, 250);
    }
  }

  waitForAppLoad();
})();
