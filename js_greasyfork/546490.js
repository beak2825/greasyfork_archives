// ==UserScript==
// @name             Kemono/Coomer Blacklist with backup
// @version          2.3.2
// @description      Add authors to Blacklist and hide them and their posts from site
// @author           glauthentica
// @match            https://kemono.cr/*
// @match            https://*.kemono.cr/*
// @match            https://coomer.st/*
// @match            https://*.coomer.st/*
// @run-at           document-idle
// @grant            GM.getValue
// @grant            GM.setValue
// @grant            GM.download
// @grant            GM_download
// @grant            GM_addValueChangeListener
// @license          MIT
// @homepageURL      https://boosty.to/glauthentica
// @contributionURL  https://boosty.to/glauthentica
// @namespace        Kemono/Coomer Blacklist with backup
// @icon             data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/546490/KemonoCoomer%20Blacklist%20with%20backup.user.js
// @updateURL https://update.greasyfork.org/scripts/546490/KemonoCoomer%20Blacklist%20with%20backup.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const getCurrentService = () => {
    const host = location.hostname;
    if (host.includes('kemono')) return 'kemono';
    if (host.includes('coomer')) return 'coomer';
    return 'unknown';
  };
  const CURRENT_SERVICE = getCurrentService();
  const STORAGE_KEY = `blacklist_${CURRENT_SERVICE}_v2`;

  let BL = {};
  let initialized = false;
  let SHOW_HIDDEN = false;
  let lastHiddenCount = 0;

  const SELECTORS = {
    USER_CARD: 'a.user-card[href*="/user/"]',
    POST_CARD: 'article.post-card, .post-card, li.card-list__item, .artist-card',
    CONTENT_CONTAINERS: 'main .card-list__items, main, #user-content',
  };

  const qs = (s, r=document) => r.querySelector(s);
  const qsa = (s, r=document) => Array.from(r.querySelectorAll(s));
  function insertEnd(parent, node) { if (parent && node) try { parent.insertAdjacentElement('beforeend', node); } catch {} }

  // Safer append helper (avoids issues with Element.append in some environments)
  function append(parent, ...children) {
    if (!parent) return;
    for (const ch of children) {
      try {
        if (ch == null) continue;
        if (ch.nodeType) parent.appendChild(ch);
        else parent.appendChild(document.createTextNode(String(ch)));
      } catch {}
    }
  }

  function safeDateStamp() {
    const d = new Date(), pad = n => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
  }

  function downloadTextFile(text, filename, mime='application/json;charset=utf-8') {
    const makeBlobUrl = () => URL.createObjectURL(new Blob([text], { type: mime }));
    const revokeLater = url => setTimeout(() => { try { URL.revokeObjectURL(url); } catch {} }, 20000);
    try {
      const url = makeBlobUrl(), details = { url, name: filename, saveAs: true };
      if (typeof GM !== 'undefined' && GM.download) { GM.download(details); revokeLater(url); return; }
      if (typeof GM_download === 'function') { GM_download(details); revokeLater(url); return; }
      URL.revokeObjectURL(url);
    } catch {}
    try {
      const url = makeBlobUrl(), a = document.createElement('a');
      a.href = url; a.download = filename; a.rel = 'noopener';
      a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
      revokeLater(url);
    } catch (e) {
      alert('Could not save file automatically. Please enable downloads/pop-ups for this site and try again.');
    }
  }

  function pickJsonFileText() {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file'; input.accept = 'application/json,.json'; input.style.display = 'none';
      input.onchange = () => {
        try {
          const file = input.files?.[0];
          if (!file) return reject(new Error('No file selected'));
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = () => reject(reader.error || new Error('File reading error'));
          reader.readAsText(file);
        } catch (e) { reject(e); } finally { input.remove(); }
      };
      document.body.appendChild(input);
      input.click();
    });
  }

  // Import: accept any valid "service:user" keys
  function mergeImportedObject(obj) {
    let added = 0, updated = 0, skipped = 0;
    for (const [rawKey, entry] of Object.entries(obj)) {
      if (!/^[a-z0-9_-]+:[^:]+$/i.test(rawKey)) { skipped++; continue; }
      const [svcFromKey, userFromKey] = rawKey.split(':');
      const service = String((entry.service || svcFromKey || '')).toLowerCase().trim();
      const user = String((entry.user || userFromKey || '')).trim();
      if (!service || !user) { skipped++; continue; }
      const key = `${service}:${user}`;
      const existed = Object.prototype.hasOwnProperty.call(BL, key);
      const prev = BL[key] || {};
      BL[key] = {
        service,
        user,
        label: (entry.label && String(entry.label).trim()) || prev.label || `${service}/${user}`,
        addedAt: prev.addedAt || entry.addedAt || new Date().toISOString()
      };
      existed ? updated++ : added++;
    }
    return { added, updated, skipped };
  }

  async function pickAndImportJsonFile() {
    const fileText = await pickJsonFileText();
    const obj = JSON.parse(fileText);
    if (!obj || typeof obj !== 'object') throw new Error('Invalid JSON format');
    const result = mergeImportedObject(obj);
    await saveBL();
    scheduleRefresh();
    return result;
  }

  function getCreatorKeyFromHref(href) {
    try {
      if (!href) return null;
      const path = href.startsWith('http') ? new URL(href).pathname : new URL(href, location.origin).pathname;
      const m = path.match(/^\/([a-z0-9_-]+)\/user\/([^\/?#]+)/i);
      return m ? `${m[1].toLowerCase()}:${decodeURIComponent(m[2])}` : null;
    } catch { return null; }
  }
  const currentAuthorKey = () => getCreatorKeyFromHref(location.pathname);
  const onAuthorRootPage = () => /^\/([a-z0-9_-]+)\/user\/([^\/?#]+)\/?$/i.test(location.pathname);

  const hasBL = (key) => key && Object.prototype.hasOwnProperty.call(BL, key);
  const saveBL = async () => await GM.setValue(STORAGE_KEY, BL);
  const loadBL = async () => { BL = (await GM.getValue(STORAGE_KEY, {})); if (!BL || typeof BL !== 'object') BL = {}; };

  // Always store neutral label; show ID (user) in UI
  const addToBL = (key) => {
    if (!key) return;
    const [service, user] = key.split(':');
    const prev = BL[key] || {};
    BL[key] = { service, user, label: `${service}/${user}`, addedAt: prev.addedAt || new Date().toISOString() };
    return saveBL();
  };
  const removeFromBL = (key) => { if (key) { delete BL[key]; return saveBL(); } };

  const formatLabel = (entry) => (entry && entry.user) ? String(entry.user) : '';

  let cssInserted = false;
  function insertStyles() {
    if (cssInserted) return; cssInserted = true;
    const style = document.createElement('style');
    style.textContent = `
      .kcbl-rel { position: relative !important; }
      .kcbl-btn { display: inline-flex; align-items: center; cursor: pointer; user-select: none; }
      .kcbl-btn.kcbl--un, .kcbl-btn.kcbl--un span { color: #ff4136 !important; }
      .kcbl-btn__icon { width: 1em; height: 1em; }
      .kcbl-inline-btn {
        position: absolute; top: 8px; right: 6px; z-index: 5;
        padding: 2px 4px; background: transparent; border: none;
        color: #fff !important; text-shadow: 0 0 3px #000;
      }
      .kcbl-inline-btn .kcbl-btn__icon { width: 24px; height: 24px; }
      .kcbl-soft { opacity: 0.35 !important; filter: grayscale(0.2); position: relative; }
      .kcbl-soft::after { content: 'Hidden'; position: absolute; top: 6px; left: 6px; font-size: 11px; padding: 2px 6px; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; z-index: 3; }
      .kcbl-hidden { display: none !important; }
      #kcbl-reveal-toggle { position: fixed; bottom: 60px; right: 16px; z-index: 999999; padding: 8px 10px; font-size: 13px; border-radius: 8px; border: 1px solid #0003; background: #202020e0; color: #fff; cursor: pointer; box-shadow: 0 6px 16px #00000059; }
      #kcbl-fab { position: fixed; bottom: 16px; right: 16px; z-index: 999999; display: inline-flex; align-items: center; gap: 6px; padding: 8px 12px; font-size: 13px; font-weight: 600; border-radius: 999px; border: 1px solid #0003; background: #202020eb; color: #fff; cursor: pointer; box-shadow: 0 6px 16px #00000059; user-select: none; }
      #kcbl-fab .kcbl-btn__icon { width: 18px; height: 18px; }
      #kcbl-badge { position: fixed; bottom: 42px; right: 12px; z-index: 1000000; min-width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; padding: 0 5px; border-radius: 999px; background-color: #d93025; color: white; font-size: 11px; font-weight: 600; line-height: 1; box-shadow: 0 1px 3px #0000004d; pointer-events: none; }
      .kcbl-badge--hidden { display: none !important; }
      .kcbl-modal-link { color: #8ab4f8; text-decoration: none; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .kcbl-modal-link:hover { text-decoration: underline; }
      #kcbl-toggle {
        position: relative;
        top: 0;
      }
      #kcbl-toggle, #kcbl-toggle span {
        color: #fff !important;
      }
      #kcbl-toggle.kcbl--un, #kcbl-toggle.kcbl--un span {
        color: #ff4136 !important;
      }
    `;
    insertEnd(document.head, style);
  }

  const blacklistIconSvg = (klass) => `<svg class="${klass}" viewBox="0 0 24 24" stroke="currentColor" fill="none" stroke-width="2"><circle cx="12" cy="12" r="9"></circle><line x1="6.8" y1="6.8" x2="17.2" y2="17.2"></line></svg>`;

  function updatePageButtonVisual(btn, isBlacklisted) {
    if (!btn) return;
    const textSpan = document.createElement('span');
    textSpan.textContent = isBlacklisted ? 'Unblacklist' : 'Blacklist';
    btn.innerHTML = '';
    append(btn, textSpan);
    btn.title = isBlacklisted ? 'Remove from blacklist' : 'Add to blacklist';
    btn.classList.toggle('kcbl--un', isBlacklisted);
  }

  function ensureBlacklistToggleButton() {
    const key = currentAuthorKey();
    if (!key) return;

    let attempts = 0;
    const maxAttempts = 20;

    const intervalId = setInterval(() => {
      const actions = qs('.user-header__actions');
      attempts++;

      if (actions || attempts >= maxAttempts) {
        clearInterval(intervalId);
        if (!actions) {
          console.log('[KC Blacklist] Could not find the actions container to add the button.');
          return;
        }

        let btn = qs('#kcbl-toggle');
        if (!btn) {
          const favBtn = [...actions.querySelectorAll('button,a')].find(el => el.textContent?.trim().toLowerCase().includes('favorite'));
          btn = document.createElement('button');
          btn.id = 'kcbl-toggle';
          btn.type = 'button';
          btn.style.marginLeft = '8px';
          if (favBtn) {
            btn.className = favBtn.className;
          }
          btn.classList.add('kcbl-btn');
          btn.onclick = async (e) => {
            e.preventDefault(); const k = currentAuthorKey(); if (!k) return;
            const isBlacklisted = hasBL(k);
            if (isBlacklisted) { await removeFromBL(k); }
            else { await addToBL(k); }
            updatePageButtonVisual(btn, !isBlacklisted);
            scheduleRefresh();
          };
          favBtn ? favBtn.insertAdjacentElement('afterend', btn) : insertEnd(actions, btn);
        }
        updatePageButtonVisual(btn, hasBL(key));
      }
    }, 250);
  }

  function ensureInlineButtonsForAuthorCards() {
    qsa(SELECTORS.USER_CARD).forEach(card => {
      if (card.querySelector('.kcbl-inline-btn')) return;
      const key = getCreatorKeyFromHref(card.getAttribute('href')); if (!key) return;
      card.classList.add('kcbl-rel');
      let btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kcbl-inline-btn kcbl-btn';
      btn.innerHTML = blacklistIconSvg('kcbl-btn__icon');
      btn.onclick = async (e) => {
        e.preventDefault(); e.stopPropagation();
        const isBlacklisted = hasBL(key);
        if (isBlacklisted) { await removeFromBL(key); }
        else { await addToBL(key); }
        btn.classList.toggle('kcbl--un', !isBlacklisted);
        scheduleRefresh();
      };
      insertEnd(card, btn);
      btn.classList.toggle('kcbl--un', hasBL(key));
    });
  }

  // Buttons on posts pages (/posts, /posts/popular, etc.)
  function ensureInlineButtonsForPostCards() {
    if (!/^\/posts(\/|$)/.test(location.pathname)) return;

    qsa(SELECTORS.POST_CARD).forEach(card => {
      if (card.querySelector('.kcbl-inline-btn')) return;

      const anyLinkWithId = card.querySelector('a[href*="/user/"]');
      if (!anyLinkWithId) return;

      const key = getCreatorKeyFromHref(anyLinkWithId.getAttribute('href'));
      if (!key) return;

      card.classList.add('kcbl-rel');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'kcbl-inline-btn kcbl-btn';
      btn.title = 'Toggle blacklist for author';
      btn.innerHTML = blacklistIconSvg('kcbl-btn__icon');

      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const isBlacklisted = hasBL(key);
        if (isBlacklisted) { await removeFromBL(key); }
        else { await addToBL(key); }
        btn.classList.toggle('kcbl--un', !isBlacklisted);
        scheduleRefresh();
      };

      insertEnd(card, btn);
      btn.classList.toggle('kcbl--un', hasBL(key));
    });
  }

  function ensureUI(type) {
    let el = qs(`#kcbl-${type}`);
    if (!el) {
      el = document.createElement('button'); el.id = `kcbl-${type}`;
      if (type === 'reveal-toggle') {
        el.onclick = () => { SHOW_HIDDEN = !SHOW_HIDDEN; scheduleRefresh(); };
      } else {
        const serviceName = CURRENT_SERVICE.charAt(0).toUpperCase() + CURRENT_SERVICE.slice(1);
        el.innerHTML = `${blacklistIconSvg('kcbl-btn__icon')} <span>${serviceName} Blacklist</span>`;
        el.title = `Open ${serviceName} blacklist manager`;
        el.onclick = (e) => { e.preventDefault(); showBlacklistModal(); };
      }
      insertEnd(document.body, el);
    }
    return el;
  }

  function ensureBlacklistBadge() {
    let badge = qs('#kcbl-badge');
    if (!badge) {
      badge = document.createElement('div'); badge.id = 'kcbl-badge';
      badge.className = 'kcbl-badge--hidden';
      insertEnd(document.body, badge);
    }
  }

  function updateUI() {
    ensureUI('fab');
    const badge = qs('#kcbl-badge'), revealBtn = ensureUI('reveal-toggle');
    if (onAuthorRootPage() || lastHiddenCount === 0) {
      revealBtn.style.display = 'none';
    } else {
      revealBtn.style.display = '';
      revealBtn.textContent = `${SHOW_HIDDEN ? 'Hide' : 'Show'} hidden (${lastHiddenCount})`;
    }
    if (badge) {
      const count = Object.keys(BL).length;
      badge.textContent = count;
      badge.classList.toggle('kcbl-badge--hidden', count === 0);
    }
  }

  function refreshHiding() {
    if (onAuthorRootPage()) {
      qsa('.kcbl-hidden, .kcbl-soft').forEach(el => el.classList.remove('kcbl-hidden', 'kcbl-soft'));
      lastHiddenCount = 0;
      return;
    }
    const allCards = qsa(`${SELECTORS.USER_CARD}, ${SELECTORS.POST_CARD}`);
    for (const card of allCards) {
      let anchor = card.querySelector('a[href*="/user/"]');
      if (!anchor && card.matches && card.matches('a[href*="/user/"]')) {
        anchor = card;
      }
      const key = anchor ? getCreatorKeyFromHref(anchor.getAttribute('href')) : null;

      const shouldHide = hasBL(key);
      if (shouldHide) {
        if (SHOW_HIDDEN) {
          card.classList.remove('kcbl-hidden');
          card.classList.add('kcbl-soft');
        } else {
          card.classList.remove('kcbl-soft');
          card.classList.add('kcbl-hidden');
        }
      } else {
        card.classList.remove('kcbl-hidden', 'kcbl-soft');
      }
    }
    lastHiddenCount = qsa('.kcbl-hidden, .kcbl-soft').length;
  }

  let rafScheduled = false;
  function scheduleRefresh() {
    if (rafScheduled) return; rafScheduled = true;
    requestAnimationFrame(() => {
      rafScheduled = false;
      insertStyles();
      ensureBlacklistToggleButton();
      ensureInlineButtonsForAuthorCards();
      ensureInlineButtonsForPostCards();
      ensureBlacklistBadge();
      refreshHiding();
      updateUI();
    });
  }

  // Right-side drawer modal (narrow panel)
  function showBlacklistModal() {
    const overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:#0009;z-index:999999;display:flex;align-items:stretch;justify-content:flex-end;padding:0;';
    const modal = document.createElement('div');
    modal.style.cssText = 'position:relative;background:#111;color:#eee;width:400px;max-width:90vw;height:100vh;display:flex;flex-direction:column;border-radius:10px 0 0 10px;padding:14px;box-shadow:0 10px 30px #00000080;font-family:system-ui,sans-serif;';
    const list = document.createElement('div'); list.style.cssText = 'overflow-y:auto;margin-bottom:12px;flex:1 1 auto;';
    const onEsc = (e) => { if (e.key === 'Escape') closeModal(); };
    const closeModal = () => {
      document.removeEventListener('keydown', onEsc, true);
      overlay.remove();
      const fab = qs('#kcbl-fab');
      if (fab) fab.blur();
    };
    document.addEventListener('keydown', onEsc, true);
    overlay.onclick = (e) => { if (e.target === overlay) closeModal(); };

    let currentSort = 'date_desc';

    const renderList = () => {
      list.innerHTML = '';
      let entries = Object.entries(BL);

      switch (currentSort) {
        case 'name_asc':
          entries.sort((a,b) => (a[1].label || a[1].user).localeCompare(b[1].label || b[1].user));
          break;
        case 'date_desc':
        default:
          entries.sort((a,b) => new Date(b[1].addedAt || 0) - new Date(a[1].addedAt || 0));
          break;
      }

      if (entries.length === 0) {
        list.textContent = 'Blacklist is empty.';
        list.style.minHeight = '100px';
        return;
      } else {
        list.style.minHeight = '';
      }

      for (const [key, entry] of entries) {
        const row = document.createElement('div');
        row.className = 'kcbl-modal-row';
        row.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 0;';

        const authorLink = document.createElement('a');
        authorLink.className = 'kcbl-modal-link';
        authorLink.href = `/${entry.service}/user/${encodeURIComponent(entry.user)}`;
        authorLink.target = '_blank';
        authorLink.textContent = authorLink.title = formatLabel(entry);

        const rmBtn = document.createElement('button');
        rmBtn.textContent = 'Remove';
        rmBtn.style.cssText = 'padding:4px 8px;border-radius:6px;border:1px solid #333;background:#222;color:#fff;cursor:pointer;flex-shrink:0;';
        rmBtn.onclick = async () => { await removeFromBL(key); scheduleRefresh(); renderList(); };

        append(row, authorLink, rmBtn);
        append(list, row);
      }
    };

    const searchInput = document.createElement('input');
    searchInput.placeholder = 'Search by name or ID...';
    searchInput.style.cssText = 'width:100%;box-sizing:border-box;padding:8px;background:#222;border:1px solid #444;color:#fff;border-radius:6px;margin-bottom:10px;';
    searchInput.oninput = () => {
      const query = searchInput.value.toLowerCase().trim();
      list.querySelectorAll('.kcbl-modal-row').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(query) ? 'flex' : 'none';
      });
    };

    const sortContainer = document.createElement('div');
    sortContainer.style.cssText = 'display:flex; align-items:center; gap:8px; margin-bottom:12px;';
    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Sort by:';
    sortLabel.style.cssText = 'font-size:14px; color:#ccc;';
    const sortSelect = document.createElement('select');
    sortSelect.style.cssText = 'padding:4px 8px; border-radius:6px; border:1px solid #444; background:#222; color:#fff; cursor:pointer;';
    sortSelect.innerHTML = `
        <option value="date_desc">Date Added (Newest)</option>
        <option value="name_asc">Name (A-Z)</option>
    `;
    sortSelect.onchange = () => {
      currentSort = sortSelect.value;
      renderList();
    };
    append(sortContainer, sortLabel, sortSelect);

    const controls = document.createElement('div');
    controls.style.cssText = 'display:flex;gap:8px;margin-top:auto;flex-wrap:wrap;';

    const exportBtn = document.createElement('button');
    exportBtn.textContent = 'Export JSON';
    exportBtn.style.cssText = 'padding:6px 10px;border-radius:6px;border:1px solid #333;background:#222;color:#fff;cursor:pointer;';
    exportBtn.onclick = () => {
      const serviceName = CURRENT_SERVICE.charAt(0).toUpperCase() + CURRENT_SERVICE.slice(1);
      const datePart = new Date().toISOString().slice(0, 10);
      const filename = `${serviceName} Blacklist backup (${datePart}).json`;
      downloadTextFile(JSON.stringify(BL, null, 2), filename);
    };

    const importBtn = document.createElement('button');
    importBtn.textContent = 'Import JSON';
    importBtn.style.cssText = 'padding:6px 10px;border-radius:6px;border:1px solid #333;background:#222;color:#fff;cursor:pointer;';
    importBtn.onclick = async () => {
      try {
        const { added, updated, skipped } = await pickAndImportJsonFile();
        alert(`Import complete.\nAdded: ${added}, Updated: ${updated}, Skipped: ${skipped}.`);
        renderList();
      } catch (e) { alert('Import error: ' + (e.message || e)); }
    };

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear blacklist';
    clearBtn.style.cssText = 'padding:6px 10px;border-radius:6px;border:1px solid #6b0000;background:#8b0000;color:#fff;cursor:pointer;';
    clearBtn.onclick = async () => {
      const count = Object.keys(BL).length;
      if (!count) { alert('Blacklist is already empty.'); return; }
      if (!confirm(`Clear ${count} entr${count === 1 ? 'y' : 'ies'} from blacklist? This cannot be undone.`)) return;
      BL = {};
      await saveBL();
      scheduleRefresh();
      renderList();
    };

    append(controls, exportBtn, importBtn, clearBtn);

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.cssText = 'position:absolute;top:8px;right:12px;background:none;border:none;color:#aaa;font-size:24px;font-weight:bold;cursor:pointer;line-height:1;padding:0;';
    closeBtn.onmouseover = () => { closeBtn.style.color = '#fff'; };
    closeBtn.onmouseout = () => { closeBtn.style.color = '#aaa'; };
    closeBtn.onclick = closeModal;

    append(modal, closeBtn, sortContainer, searchInput, list, controls);
    append(overlay, modal);
    insertEnd(document.body, overlay);
    renderList();
  }

  let observer = null;
  function startObserver() {
    if (observer) return;
    const targetNode = document.body;
    if (!targetNode) {
      setTimeout(startObserver, 500);
      return;
    }
    observer = new MutationObserver(() => scheduleRefresh());
    observer.observe(targetNode, { childList: true, subtree: true });
    window.addEventListener('popstate', scheduleRefresh, { passive: true });
  }

  async function init() {
    if (initialized) return; initialized = true;
    if (typeof GM_addValueChangeListener === 'function') {
      GM_addValueChangeListener(STORAGE_KEY, (name, oldValue, newValue, remote) => {
        if (remote) {
          try {
            let newBL = newValue;
            if (typeof newBL === 'string') {
              newBL = JSON.parse(newValue || '{}');
            }
            if (newBL && typeof newBL === 'object') {
              BL = newBL;
              scheduleRefresh();
            }
          } catch (err) {
            console.error('[KC-BL Sync] Error processing storage change event:', err);
          }
        }
      });
    }
    await loadBL();
    scheduleRefresh();
    startObserver();
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  }

})();