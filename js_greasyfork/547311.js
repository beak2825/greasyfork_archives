// ==UserScript==
// @name         e621 Tag Extractor 2.0
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Extract tags from e621.net
// @author       cemtrex
// @match        https://e621.net/posts/*
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/560519/e621%20Tag%20Extractor%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/560519/e621%20Tag%20Extractor%2020.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const BTN_ID = 'e621TagExtractButton';
  const MODAL_ID = 'e621TagExtractModal';

  const PREF_KEY = 'e621TagExtractorPrefs_v2';
  const HISTORY_KEY = 'e621TagExtractorHistory_v2';
  const HISTORY_MAX = 50;

  const DEFAULT_PREFS = {
    wordStyle: 'underscores',
    separator: ', ',
    preselectGroups: ['general', 'species', 'character', 'artist', 'copyright', 'meta', 'lore', 'invalid'],
    searchText: '',
    blacklist: '',
    autoApplyBlacklist: true
  };

  const unique = (arr) => Array.from(new Set(arr));
  const clampArray = (arr) => Array.isArray(arr) ? arr : [];

  const loadPrefs = () => {
    try { return Object.assign({}, DEFAULT_PREFS, JSON.parse(localStorage.getItem(PREF_KEY) || '{}')); }
    catch { return { ...DEFAULT_PREFS }; }
  };
  const savePrefs = (p) => { try { localStorage.setItem(PREF_KEY, JSON.stringify(p)); } catch {} };

  const loadHistory = () => {
    try { return clampArray(JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]')); }
    catch { return []; }
  };
  const saveHistory = (arr) => { try { localStorage.setItem(HISTORY_KEY, JSON.stringify(clampArray(arr))); } catch {} };

  function enforceHistoryMax(arr) {
    while (arr.length > HISTORY_MAX) {
      let idx = -1;
      for (let i = arr.length - 1; i >= 0; i--) {
        if (!arr[i]?.pinned) { idx = i; break; }
      }
      if (idx === -1) idx = arr.length - 1;
      arr.splice(idx, 1);
    }
    return arr;
  }

  function upsertHistoryEntry(entry) {
    const arr = loadHistory();
    const idx = arr.findIndex(x => String(x?.postId) === String(entry?.postId));

    if (idx !== -1) {
      const old = arr[idx] || {};
      entry = Object.assign({}, old, entry, {
        pinned: !!old.pinned,
        copiedText: old.copiedText || '',
        copiedCount: old.copiedCount || 0,
        copiedTs: old.copiedTs || 0
      });
      arr.splice(idx, 1);
    } else {
      entry = Object.assign({
        pinned: false,
        copiedText: '',
        copiedCount: 0,
        copiedTs: 0
      }, entry);
    }

    arr.unshift(entry);
    enforceHistoryMax(arr);
    saveHistory(arr);
    return entry;
  }

  function setHistoryPinned(postId, pinned) {
    const arr = loadHistory();
    const idx = arr.findIndex(x => String(x?.postId) === String(postId));
    if (idx === -1) return;
    arr[idx].pinned = !!pinned;
    saveHistory(arr);
  }

  function updateHistoryCopied(postId, copiedText, copiedCount) {
    const arr = loadHistory();
    const idx = arr.findIndex(x => String(x?.postId) === String(postId));
    if (idx === -1) return;
    arr[idx].copiedText = String(copiedText || '');
    arr[idx].copiedCount = Number.isFinite(+copiedCount) ? +copiedCount : (arr[idx].copiedCount || 0);
    arr[idx].copiedTs = Date.now();
    saveHistory(arr);
  }

  function clearHistoryNonPinned() {
    saveHistory(loadHistory().filter(x => x && x.pinned));
  }

  function getCurrentPostId() {
    const m = location.pathname.match(/\/posts\/(\d+)/);
    return m ? m[1] : null;
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
    }
    return Promise.resolve(fallbackCopy(text));
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.setAttribute('readonly', '');
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch {}
    ta.remove();
  }

  async function getTagsFromAPI() {
    const postId = getCurrentPostId();
    if (!postId) return { flat: [], grouped: {}, order: [], postId: null, previewUrl: null };

    try {
      const res = await fetch(`/posts/${postId}.json`, {
        headers: { 'Accept': 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
      });

      if (!res.ok) return { flat: [], grouped: {}, order: [], postId, previewUrl: null };

      const data = await res.json();
      const post = data.post || data;
      const tagGroups = post.tags || {};

      const grouped = Array.isArray(tagGroups)
        ? { general: tagGroups.map(String) }
        : Object.fromEntries(Object.entries(tagGroups).map(([k, v]) => [k, (v || []).map(String)]));

      const preferred = ['artist', 'species', 'character', 'copyright', 'general', 'meta', 'lore', 'invalid'];
      const order = Object.keys(grouped).sort((a, b) => {
        const ia = preferred.indexOf(a);
        const ib = preferred.indexOf(b);
        const sa = ia === -1 ? 1e9 : ia;
        const sb = ib === -1 ? 1e9 : ib;
        return (sa - sb) || a.localeCompare(b);
      });

      const flat = unique(Object.values(grouped).flat().map(t => t.trim()).filter(Boolean));

      const previewUrl =
        (post.preview && post.preview.url) ||
        (post.sample && post.sample.url) ||
        (post.file && post.file.url) ||
        null;

      return { flat, grouped, order, postId, previewUrl };
    } catch (e) {
      console.error('[e621 Tag Extractor] API error:', e);
      return { flat: [], grouped: {}, order: [], postId, previewUrl: null };
    }
  }

  function buildButton() {
    const button = document.createElement('button');
    button.id = BTN_ID;
    button.type = 'button';
    button.textContent = '+';
    button.title = 'Extract, filter, review, and copy tags';
    button.setAttribute('aria-label', 'Extract, filter, review, and copy tags');
    Object.assign(button.style, {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      backgroundColor: '#2563eb',
      color: '#fff',
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      textAlign: 'center',
      fontSize: '24px',
      lineHeight: '50px',
      cursor: 'pointer',
      boxShadow: '2px 2px 6px rgba(0,0,0,0.3)',
      zIndex: 2147483647
    });
    return button;
  }

  function parsePatterns(text) {
    const raw = (text || '')
      .split(/[\n,]+/g)
      .map(s => s.trim())
      .filter(Boolean);

    const out = [];
    for (const p of raw) {
      const m = p.match(/^\/(.+)\/([gimsuy]*)$/);
      if (m) {
        try { out.push({ type: 'regex', re: new RegExp(m[1], m[2]) }); } catch {}
      } else {
        out.push({ type: 'substr', s: p.toLowerCase() });
      }
    }
    return out;
  }

  function matchesAny(tag, patterns) {
    if (!patterns?.length) return false;
    for (const p of patterns) {
      if (p.type === 'regex') {
        try { if (p.re.test(tag)) return true; } catch {}
      } else if (tag.toLowerCase().includes(p.s)) {
        return true;
      }
    }
    return false;
  }

  let toastTimer = null;
  function makeToast(text) {
    clearTimeout(toastTimer);
    const existing = document.getElementById('e621TagExtractorToast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'e621TagExtractorToast';
    toast.textContent = text;

    Object.assign(toast.style, {
      position: 'fixed',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(29,78,216,0.92)',
      border: '1px solid rgba(29,78,216,1)',
      color: '#ffffff',
      padding: '14px 18px',
      borderRadius: '14px',
      zIndex: 2147483647,
      fontSize: '16px',
      fontWeight: '700',
      letterSpacing: '0.2px',
      textAlign: 'center',
      boxShadow: '0 14px 34px rgba(0,0,0,0.55)',
      opacity: '0',
      transition: 'opacity 380ms ease'
    });

    document.body.appendChild(toast);
    requestAnimationFrame(() => { toast.style.opacity = '1'; });

    toastTimer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 420);
    }, 2000);
  }

  function formatTime(ts) {
    try { return new Date(ts).toLocaleString(); } catch { return String(ts); }
  }

  function ymd(ts) {
    try {
      const d = new Date(ts);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${y}-${m}-${day}`;
    } catch { return ''; }
  }

  function makeConfirmWindow({ overlay, title, message, yesText, cancelText, centerTitleOnly, onYes, onClose }) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2147483647
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(420px, 92vw)',
      overflow: 'hidden',
      borderRadius: '12px',
      border: '1px solid #1f2937',
      background: '#0b1220',
      boxShadow: '0 12px 34px rgba(0,0,0,0.6)',
      color: '#e5e7eb',
      display: 'flex',
      flexDirection: 'column'
    });

    const head = document.createElement('div');
    Object.assign(head.style, {
      padding: '14px 14px',
      background: '#111827',
      borderBottom: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: centerTitleOnly ? 'center' : 'space-between',
      gap: '10px',
      fontWeight: '800',
      textAlign: 'center'
    });

    const t = document.createElement('div');
    t.textContent = title || 'Are you sure?';

    const x = document.createElement('button');
    x.type = 'button';
    x.textContent = '✕';
    Object.assign(x.style, {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer',
      fontSize: '16px',
      display: centerTitleOnly ? 'none' : 'inline-block'
    });

    head.append(t);
    if (!centerTitleOnly) head.append(x);

    const body = document.createElement('div');
    Object.assign(body.style, { padding: message ? '14px 14px' : '0', fontSize: '13px', opacity: '0.95', textAlign: 'center' });
    body.textContent = message || '';

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      padding: '12px 14px',
      borderTop: '1px solid #1f2937',
      display: 'flex',
      justifyContent: 'space-between',
      gap: '10px',
      background: '#111827'
    });

    const cancel = document.createElement('button');
    cancel.type = 'button';
    cancel.textContent = cancelText || 'Cancel';
    Object.assign(cancel.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #1d4ed8',
      background: '#2563eb',
      color: '#fff',
      cursor: 'pointer'
    });

    const yes = document.createElement('button');
    yes.type = 'button';
    yes.textContent = yesText || 'Confirm';
    Object.assign(yes.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #7f1d1d',
      background: '#b91c1c',
      color: '#fff',
      cursor: 'pointer'
    });

    actions.append(cancel, yes);

    function close() {
      panel.remove();
      if (typeof onClose === 'function') onClose();
    }

    x.onclick = close;
    cancel.onclick = close;
    yes.onclick = () => { try { onYes?.(); } finally { close(); } };

    panel.appendChild(box);
    box.append(head, message ? body : document.createElement('div'), actions);
    (overlay || document.body).appendChild(panel);

    return { close };
  }

  function makeCopiedTagsWindow({ overlay, text, onClose }) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2147483647
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(760px, 92vw)',
      maxHeight: '80vh',
      overflow: 'hidden',
      borderRadius: '10px',
      border: '1px solid #1f2937',
      background: '#0b1220',
      boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
      color: '#e5e7eb',
      display: 'flex',
      flexDirection: 'column'
    });

    const head = document.createElement('div');
    Object.assign(head.style, {
      padding: '12px 14px',
      background: '#111827',
      borderBottom: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      fontWeight: '600'
    });

    const title = document.createElement('div');
    title.textContent = 'Copied tags';

    const close = document.createElement('button');
    close.type = 'button';
    close.textContent = '✕';
    Object.assign(close.style, {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer',
      fontSize: '16px'
    });

    head.append(title, close);

    const body = document.createElement('div');
    Object.assign(body.style, { padding: '10px 12px', overflowY: 'auto' });

    const ta = document.createElement('textarea');
    ta.value = text || '';
    Object.assign(ta.style, {
      width: '100%',
      height: '260px',
      resize: 'vertical',
      boxSizing: 'border-box',
      padding: '10px',
      borderRadius: '10px',
      border: '1px solid #374151',
      background: '#111827',
      color: '#e5e7eb',
      outline: 'none'
    });
    body.appendChild(ta);

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      padding: '10px 12px',
      borderTop: '1px solid #1f2937',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      background: '#111827'
    });

    const copyAgain = document.createElement('button');
    copyAgain.type = 'button';
    copyAgain.textContent = 'Copy again';
    Object.assign(copyAgain.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #1d4ed8',
      background: '#2563eb',
      color: '#e5e7eb',
      cursor: 'pointer'
    });
    actions.append(copyAgain);

    copyAgain.onclick = async () => {
      const v = ta.value || '';
      if (!v) return;
      await copyToClipboard(v);
      makeToast('Copied');
    };

    function doClose() {
      panel.remove();
      onClose?.();
    }
    close.onclick = doClose;

    panel.appendChild(box);
    box.append(head, body, actions);
    overlay.appendChild(panel);

    return { close: doClose };
  }

  function makeHistoryWindow({ overlay, onCloseEscChange, onClose }) {
    const panel = document.createElement('div');
    Object.assign(panel.style, {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2147483647
    });

    const box = document.createElement('div');
    Object.assign(box.style, {
      width: 'min(820px, 92vw)',
      maxHeight: '82vh',
      overflow: 'hidden',
      borderRadius: '10px',
      border: '1px solid #1f2937',
      background: '#0b1220',
      boxShadow: '0 10px 30px rgba(0,0,0,0.55)',
      color: '#e5e7eb',
      display: 'flex',
      flexDirection: 'column'
    });

    const head = document.createElement('div');
    Object.assign(head.style, {
      padding: '12px 14px',
      background: '#111827',
      borderBottom: '1px solid #1f2937',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px'
    });

    const left = document.createElement('div');
    Object.assign(left.style, { display: 'flex', flexDirection: 'column', gap: '8px', flex: '1' });

    const title = document.createElement('div');
    title.textContent = 'History';
    Object.assign(title.style, { fontWeight: '700' });

    const filters = document.createElement('div');
    Object.assign(filters.style, { display: 'flex', gap: '8px', flexWrap: 'wrap' });

    const idInput = document.createElement('input');
    idInput.type = 'text';
    idInput.placeholder = 'Post ID...';
    Object.assign(idInput.style, {
      flex: '1',
      minWidth: '200px',
      padding: '8px 10px',
      borderRadius: '10px',
      border: '1px solid #374151',
      background: '#0b1220',
      color: '#e5e7eb',
      outline: 'none'
    });

    const dateInput = document.createElement('input');
    dateInput.type = 'date';
    Object.assign(dateInput.style, {
      flex: '1',
      minWidth: '200px',
      padding: '8px 10px',
      borderRadius: '10px',
      border: '1px solid #374151',
      background: '#0b1220',
      color: '#e5e7eb',
      outline: 'none'
    });

    filters.append(idInput, dateInput);
    left.append(title, filters);

    const hClose = document.createElement('button');
    hClose.type = 'button';
    hClose.textContent = '✕';
    Object.assign(hClose.style, {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer',
      fontSize: '16px'
    });

    head.append(left, hClose);

    const body = document.createElement('div');
    Object.assign(body.style, { padding: '10px 12px', overflowY: 'auto' });

    const actions = document.createElement('div');
    Object.assign(actions.style, {
      padding: '10px 12px',
      borderTop: '1px solid #1f2937',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      background: '#111827'
    });

    const clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.textContent = 'Clear';
    Object.assign(clearBtn.style, {
      padding: '8px 10px',
      borderRadius: '8px',
      border: '1px solid #7f1d1d',
      background: '#b91c1c',
      color: '#fff',
      cursor: 'pointer'
    });

    actions.append(clearBtn);

    let copiedWin = null;
    let confirmWin = null;

    function passesFilters(item) {
      const idq = (idInput.value || '').trim();
      const dq = (dateInput.value || '').trim();
      if (idq && !String(item.postId || '').includes(idq)) return false;
      if (dq && ymd(item.ts) !== dq) return false;
      return true;
    }

    function render() {
      body.innerHTML = '';

      let hist = loadHistory().filter(Boolean);
      hist.sort((a, b) => {
        const pa = a.pinned ? 1 : 0;
        const pb = b.pinned ? 1 : 0;
        if (pb !== pa) return pb - pa;
        return (b.ts || 0) - (a.ts || 0);
      });

      hist = hist.filter(passesFilters);

      if (!hist.length) {
        const empty = document.createElement('div');
        empty.textContent = 'No matches.';
        Object.assign(empty.style, { opacity: '0.8', padding: '8px 2px' });
        body.appendChild(empty);
        return;
      }

      for (const item of hist) {
        const row = document.createElement('div');
        row.title = 'Click to open';
        Object.assign(row.style, {
          display: 'grid',
          gridTemplateColumns: '64px 1fr auto',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 10px',
          border: '1px solid #1f2937',
          borderRadius: '10px',
          marginBottom: '8px',
          background: item.pinned ? 'rgba(29,78,216,0.10)' : 'rgba(17,24,39,0.65)',
          cursor: 'pointer',
          transition: 'filter 120ms ease'
        });

        row.addEventListener('mouseenter', () => { row.style.filter = 'brightness(1.10)'; });
        row.addEventListener('mouseleave', () => { row.style.filter = ''; });

        const thumbWrap = document.createElement('div');
        Object.assign(thumbWrap.style, {
          width: '64px',
          height: '64px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #1f2937',
          background: 'rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        });

        if (item.previewUrl) {
          const img = document.createElement('img');
          img.src = item.previewUrl;
          img.alt = `Post ${item.postId}`;
          img.loading = 'lazy';
          Object.assign(img.style, { width: '100%', height: '100%', objectFit: 'cover', display: 'block' });
          thumbWrap.appendChild(img);
        } else {
          const no = document.createElement('div');
          no.textContent = '—';
          Object.assign(no.style, { opacity: 0.6, fontSize: '18px' });
          thumbWrap.appendChild(no);
        }

        const mid = document.createElement('div');
        Object.assign(mid.style, { display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 });

        const top = document.createElement('div');
        top.textContent = `Post #${item.postId}`;
        Object.assign(top.style, { fontWeight: '700' });

        const subRow = document.createElement('div');
        Object.assign(subRow.style, { display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 });

        const sub = document.createElement('div');
        const copiedInfo = item.copiedCount ? ` • copied ${item.copiedCount}` : '';
        sub.textContent = `${formatTime(item.ts)}${copiedInfo}`;
        Object.assign(sub.style, {
          fontSize: '12px',
          opacity: '0.8',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          minWidth: 0
        });

        const starBtn = document.createElement('button');
        starBtn.type = 'button';
        starBtn.textContent = item.pinned ? '★' : '☆';
        starBtn.title = item.pinned ? 'Unpin' : 'Pin';
        Object.assign(starBtn.style, {
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          fontSize: '24px',
          lineHeight: '1',
          padding: '0',
          margin: '0',
          color: item.pinned ? '#fbbf24' : 'rgba(229,231,235,0.85)',
          transform: 'translateY(-1px)'
        });

        starBtn.onmouseenter = () => { starBtn.style.filter = 'brightness(1.15)'; };
        starBtn.onmouseleave = () => { starBtn.style.filter = ''; };
        starBtn.onclick = (e) => {
          e.stopPropagation();
          setHistoryPinned(item.postId, !item.pinned);
          render();
        };

        subRow.append(sub, starBtn);
        mid.append(top, subRow);

        const right = document.createElement('div');
        Object.assign(right.style, { display: 'flex', gap: '8px', alignItems: 'center' });

        const showBtn = document.createElement('button');
        showBtn.type = 'button';
        showBtn.textContent = 'Show copied tags';
        Object.assign(showBtn.style, {
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid #1d4ed8',
          background: '#2563eb',
          color: '#fff',
          cursor: 'pointer'
        });

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = 'Remove';
        Object.assign(delBtn.style, {
          padding: '6px 10px',
          borderRadius: '8px',
          border: '1px solid #7f1d1d',
          background: '#b91c1c',
          color: '#fff',
          cursor: 'pointer'
        });

        row.onclick = () => {
          const url = item.url || (`/posts/${item.postId}`);
          window.open(url, '_blank', 'noopener,noreferrer');
        };

        showBtn.onclick = (e) => {
          e.stopPropagation();
          if (copiedWin) return;
          const latest = loadHistory().find(x => String(x.postId) === String(item.postId)) || item;
          const txt = latest.copiedText || '';
          if (!txt) { makeToast('No copied tags saved'); return; }
          copiedWin = makeCopiedTagsWindow({
            overlay,
            text: txt,
            onClose: () => { copiedWin = null; }
          });
        };

        delBtn.onclick = (e) => {
          e.stopPropagation();
          saveHistory(loadHistory().filter(x => String(x?.postId) !== String(item.postId)));
          render();
        };

        right.append(showBtn, delBtn);
        row.append(thumbWrap, mid, right);
        body.appendChild(row);
      }
    }

    idInput.addEventListener('input', render);
    dateInput.addEventListener('change', render);

    clearBtn.onclick = () => {
      if (confirmWin) return;
      confirmWin = makeConfirmWindow({
        overlay,
        title: 'Clear history?',
        message: 'This will remove all entries exept your favourites.',
        yesText: 'Confirm',
        cancelText: 'Cancel',
        onYes: () => {
          clearHistoryNonPinned();
          render();
          makeToast('Cleared');
        },
        onClose: () => { confirmWin = null; }
      });
    };

    function close() {
      try { confirmWin?.close?.(); } catch {}
      confirmWin = null;
      try { copiedWin?.close?.(); } catch {}
      copiedWin = null;
      panel.remove();
      onCloseEscChange(true);
      onClose?.();
    }

    hClose.onclick = close;

    onCloseEscChange(false);

    panel.appendChild(box);
    box.append(head, body, actions);
    overlay.appendChild(panel);
    render();

    return { close };
  }

  function makeModal(tagsInfo) {
    const prefs = loadPrefs();
    const postId = tagsInfo.postId || getCurrentPostId();

    if (postId) {
      upsertHistoryEntry({
        postId,
        url: location.href,
        ts: Date.now(),
        previewUrl: tagsInfo.previewUrl || null
      });
    }

    const overlay = document.createElement('div');
    overlay.id = MODAL_ID;
    Object.assign(overlay.style, {
      position: 'fixed',
      inset: '0',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 2147483647,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    });

    const modal = document.createElement('div');
    Object.assign(modal.style, {
      background: '#111827',
      color: '#e5e7eb',
      width: 'min(980px, 94vw)',
      maxHeight: '88vh',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid #1f2937'
    });

    const header = document.createElement('div');
    Object.assign(header.style, {
      padding: '12px 16px',
      background: '#0b1220',
      fontWeight: '600',
      position: 'sticky',
      top: '0',
      zIndex: '2',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    });

    const title = document.createElement('div');
    title.textContent = 'e621 Tag Extractor';

    const headerRight = document.createElement('div');
    Object.assign(headerRight.style, { display: 'flex', alignItems: 'center', gap: '10px' });

    const counter = document.createElement('div');
    counter.textContent = 'Selected: 0 / 0';
    Object.assign(counter.style, { fontSize: '12px', opacity: '0.9', fontWeight: '500' });

    const closeX = document.createElement('button');
    closeX.type = 'button';
    closeX.textContent = '✕';
    closeX.title = 'Close';
    Object.assign(closeX.style, {
      width: '32px',
      height: '32px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer',
      fontSize: '16px',
      lineHeight: '30px'
    });

    headerRight.append(counter, closeX);
    header.append(title, headerRight);

    const subline = document.createElement('div');
    subline.textContent = 'Check or uncheck the tags below to include or exclude them before copying:';
    Object.assign(subline.style, {
      padding: '8px 16px',
      fontSize: '13px',
      opacity: '0.8',
      borderBottom: '1px solid #1f2937'
    });

    const content = document.createElement('div');
    Object.assign(content.style, {
      display: 'grid',
      gridTemplateColumns: '320px 1fr',
      gap: '12px',
      padding: '12px 16px',
      overflow: 'hidden'
    });

    const controls = document.createElement('div');
    Object.assign(controls.style, { position: 'sticky', top: '56px', alignSelf: 'start' });

    controls.innerHTML = `
      <style>
        #${MODAL_ID} label { white-space: normal; word-break: break-word; display: block; line-height: 1.4; }
        #${MODAL_ID} input[type=radio], #${MODAL_ID} input[type=checkbox] { margin-right:6px; }
        #${MODAL_ID} .tx { width: 100%; box-sizing: border-box; padding: 8px 10px; border-radius: 8px; border: 1px solid #374151; background:#0b1220; color:#e5e7eb; }
        #${MODAL_ID} .btn { padding: 8px 10px; border-radius: 8px; border: 1px solid #374151; background: #1f2937; color: #e5e7eb; cursor:pointer; }
        #${MODAL_ID} .btn:hover { filter: brightness(1.07); }
        #${MODAL_ID} .btnPrimary { background:#2563eb; border-color:#1d4ed8; }
        #${MODAL_ID} .btnRow { display:flex; gap:8px; flex-wrap:wrap; align-items:center; justify-content:flex-start; }
        #${MODAL_ID} .section { border: 1px solid #1f2937; border-radius: 10px; padding: 10px; background: rgba(11,18,32,0.55); margin-bottom: 10px; }
        #${MODAL_ID} summary { user-select:none; }
        #${MODAL_ID} .rowHidden { display:none !important; }
        #${MODAL_ID} .tagRow:hover { background: rgba(255,255,255,0.04); border-radius: 6px; }
        #${MODAL_ID} .tagRow { padding: 2px 6px; }
        #${MODAL_ID} .small { font-size: 12px; opacity: 0.9; }
        #${MODAL_ID} .blWrap { position: relative; }
        #${MODAL_ID} .suggDropdown {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          border: 1px solid #1f2937;
          border-radius: 10px;
          background: rgba(11,18,32,0.98);
          max-height: 180px;
          overflow-y: auto;
          box-shadow: 0 10px 24px rgba(0,0,0,0.45);
          display: none;
          z-index: 3;
        }
        #${MODAL_ID} .suggItem {
          padding: 8px 10px;
          cursor: pointer;
          font-size: 13px;
          border-bottom: 1px solid rgba(31,41,55,0.6);
        }
        #${MODAL_ID} .suggItem:last-child { border-bottom: none; }
        #${MODAL_ID} .suggItem:hover { filter: brightness(1.12); background: rgba(255,255,255,0.04); }
        #${MODAL_ID} .suggEmpty { padding: 10px; font-size: 12px; opacity: 0.75; }

        #${MODAL_ID} * { scrollbar-width: thin; scrollbar-color: #1d4ed8 rgba(11,18,32,0.70); }
        #${MODAL_ID} *::-webkit-scrollbar { width: 10px; height: 10px; }
        #${MODAL_ID} *::-webkit-scrollbar-track { background: rgba(11,18,32,0.70); border-radius: 999px; }
        #${MODAL_ID} *::-webkit-scrollbar-thumb { background: rgba(29,78,216,0.75); border-radius: 999px; border: 2px solid rgba(11,18,32,0.70); }
        #${MODAL_ID} *::-webkit-scrollbar-thumb:hover { background: rgba(29,78,216,0.95); }
        #${MODAL_ID} *::-webkit-scrollbar-corner { background: rgba(11,18,32,0.70); }
      </style>

      <div class="section">
        <input class="tx" type="text" name="searchText" placeholder="Search..." />
      </div>

      <div class="section">
        <div style="font-weight:600;margin-bottom:8px">Blacklist</div>

        <label class="small" style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <input type="checkbox" name="autoApplyBlacklist" />
          Auto-apply
        </label>

        <div class="blWrap">
          <textarea class="tx" name="blacklist" rows="5" placeholder="One per line or comma-separated"></textarea>
          <div class="suggDropdown" data-suggestions></div>
        </div>

        <div class="btnRow" style="margin-top:10px">
          <button type="button" class="btn btnPrimary" data-act="applyRules" title="Enter also applies">Apply</button>
        </div>
      </div>

      <div class="section">
        <div style="font-weight:600;margin-bottom:8px">Format</div>
        <label><input type="radio" name="wordStyle" value="underscores"> Keep underscores</label>
        <label><input type="radio" name="wordStyle" value="spaces"> Replace underscores with spaces</label>
      </div>

      <div class="section">
        <div style="font-weight:600;margin-bottom:8px">Groups</div>
        ${['general','species','character','artist','copyright','meta','lore','invalid'].map(g=>`
          <label><input type="checkbox" name="grp" value="${g}" checked> ${g}</label>
        `).join('')}
      </div>
    `;

    const rightCol = document.createElement('div');
    Object.assign(rightCol.style, {
      maxHeight: '74vh',
      overflowY: 'auto',
      border: '1px solid #1f2937',
      borderRadius: '8px',
      padding: '8px',
      background: 'rgba(11,18,32,0.25)'
    });

    const footer = document.createElement('div');
    Object.assign(footer.style, {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '10px',
      padding: '12px 16px',
      background: '#0b1220',
      borderTop: '1px solid #1f2937',
      position: 'sticky',
      bottom: '0',
      zIndex: '2'
    });

    const leftBtns = document.createElement('div');
    Object.assign(leftBtns.style, { display: 'flex', gap: '10px', alignItems: 'center' });

    const historyBtn = document.createElement('button');
    historyBtn.type = 'button';
    historyBtn.textContent = 'History';
    Object.assign(historyBtn.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer'
    });

    const resetAllBtn = document.createElement('button');
    resetAllBtn.type = 'button';
    resetAllBtn.textContent = 'Reset';
    Object.assign(resetAllBtn.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #374151',
      background: '#1f2937',
      color: '#e5e7eb',
      cursor: 'pointer'
    });

    leftBtns.append(historyBtn, resetAllBtn);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.textContent = 'Copy';
    Object.assign(copyBtn.style, {
      padding: '8px 12px',
      borderRadius: '8px',
      border: '1px solid #1d4ed8',
      background: '#2563eb',
      color: '#e5e7eb',
      cursor: 'pointer'
    });

    content.append(controls, rightCol);
    modal.append(header, subline, content, footer);
    footer.append(leftBtns, copyBtn);
    overlay.appendChild(modal);

    const { grouped, order } = tagsInfo;
    const allItems = [];
    const allTags = [];

    for (const g of order) {
      const tags = grouped[g] || [];
      if (!tags.length) continue;

      const details = document.createElement('details');
      details.open = true;
      details.style.marginBottom = '10px';

      const summary = document.createElement('summary');
      summary.textContent = `${g} (${tags.length})`;
      Object.assign(summary.style, { cursor: 'pointer', fontWeight: '600', padding: '4px 2px' });
      details.appendChild(summary);

      const section = document.createElement('div');
      section.style.paddingLeft = '6px';

      for (const t of tags) {
        allTags.push(t);

        const row = document.createElement('label');
        row.className = 'tagRow';
        Object.assign(row.style, {
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: '8px',
          alignItems: 'center'
        });
        row.dataset.group = g;
        row.dataset.tag = t;

        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.checked = true;

        const name = document.createElement('span');
        name.textContent = t;

        row.append(cb, name);
        section.appendChild(row);

        allItems.push({ row, cb, tag: t, group: g });
      }

      details.appendChild(section);
      rightCol.appendChild(details);
    }

    const searchInput = controls.querySelector('input[name="searchText"]');
    const blacklistTa = controls.querySelector('textarea[name="blacklist"]');
    const autoApplyCb = controls.querySelector('input[name="autoApplyBlacklist"]');
    const suggDropdown = controls.querySelector('[data-suggestions]');

    let confirmWin = null;
    let escClosesMain = true;
    let historyWin = null;

    const hideDropdown = () => { suggDropdown.style.display = 'none'; suggDropdown.innerHTML = ''; };
    const showDropdown = (nodesOrHtml) => {
      suggDropdown.style.display = 'block';
      if (typeof nodesOrHtml === 'string') {
        suggDropdown.innerHTML = nodesOrHtml;
      } else {
        suggDropdown.innerHTML = '';
        for (const n of nodesOrHtml) suggDropdown.appendChild(n);
      }
    };

    function currentPrefs() {
      const wordStyle = controls.querySelector('input[name="wordStyle"]:checked')?.value || 'underscores';
      const separator = DEFAULT_PREFS.separator;
      const preselectGroups = Array.from(controls.querySelectorAll('input[name="grp"]:checked')).map(i => i.value);
      return {
        wordStyle,
        separator,
        preselectGroups,
        searchText: searchInput.value || '',
        blacklist: blacklistTa.value || '',
        autoApplyBlacklist: !!autoApplyCb.checked
      };
    }

    function updateCounter() {
      const total = allItems.length;
      const selected = allItems.reduce((acc, it) => acc + (it.cb.checked ? 1 : 0), 0);
      counter.textContent = `Selected: ${selected} / ${total}`;
    }

    function applySearchFilter() {
      const q = (searchInput.value || '').trim().toLowerCase();
      for (const it of allItems) {
        const ok = !q || it.tag.toLowerCase().includes(q);
        it.row.classList.toggle('rowHidden', !ok);
      }
    }

    function getAllowedGroupsSet() {
      return new Set(Array.from(controls.querySelectorAll('input[name="grp"]:checked')).map(i => i.value));
    }

    function syncGroupChecks() {
      const allowed = getAllowedGroupsSet();
      for (const it of allItems) {
        if (!it.cb._touched) it.cb.checked = allowed.has(it.group);
      }
      updateCounter();
    }

    function applyRulesManual() {
      const p = currentPrefs();
      const black = parsePatterns(p.blacklist);
      if (!black.length) { makeToast('No blacklist patterns'); return; }

      let changed = 0;
      for (const it of allItems) {
        if (matchesAny(it.tag, black)) {
          if (it.cb.checked) changed++;
          it.cb.checked = false;
          it.cb._touched = true;
        }
      }
      updateCounter();
      makeToast(`Applied: ${changed}`);
    }

    function applyRulesAuto() {
      const p = currentPrefs();
      if (!p.autoApplyBlacklist) return;

      const black = parsePatterns(p.blacklist);
      const allowed = getAllowedGroupsSet();

      for (const it of allItems) {
        if (it.cb._touched) continue;
        const baseline = allowed.has(it.group);
        const blocked = black.length ? matchesAny(it.tag, black) : false;
        it.cb.checked = baseline && !blocked;
      }
      updateCounter();
    }

    function clearManualOverrides() {
      for (const it of allItems) delete it.cb._touched;
    }

    function getActiveToken(text, caretPos) {
      const pos = typeof caretPos === 'number' ? caretPos : text.length;
      const before = text.slice(0, pos);
      const lastSep = Math.max(before.lastIndexOf('\n'), before.lastIndexOf(','));
      const tokenStart = lastSep === -1 ? 0 : lastSep + 1;
      const token = before.slice(tokenStart).trim();
      return { token, tokenStart, pos };
    }

    function updateSuggestions() {
      const { token } = getActiveToken(blacklistTa.value, blacklistTa.selectionStart);

      if (!token || token.startsWith('/')) {
        hideDropdown();
        return;
      }

      const q = token.toLowerCase();
      const matches = allTags.filter(t => t.toLowerCase().includes(q)).slice(0, 15);

      if (!matches.length) {
        showDropdown(`<div class="suggEmpty">No matches</div>`);
        return;
      }

      const nodes = matches.map(t => {
        const div = document.createElement('div');
        div.className = 'suggItem';
        div.textContent = t;
        div.onclick = () => {
          const value = blacklistTa.value;
          const caret = blacklistTa.selectionStart;
          const { tokenStart, pos } = getActiveToken(value, caret);

          const before = value.slice(0, tokenStart);
          const after = value.slice(pos);
          blacklistTa.value = before + t + after;

          const newCaret = before.length + t.length;
          blacklistTa.focus();
          blacklistTa.setSelectionRange(newCaret, newCaret);

          savePrefs(currentPrefs());
          scheduleAutoApply();
          updateSuggestions();
        };
        return div;
      });

      showDropdown(nodes);
    }

    let autoTimer = null;
    function scheduleAutoApply() {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(applyRulesAuto, 250);
    }

    function setEscMode(mainAllowed) { escClosesMain = mainAllowed; }

    function applyPrefsToUI(p) {
      searchInput.value = p.searchText || '';
      blacklistTa.value = p.blacklist || '';
      autoApplyCb.checked = p.autoApplyBlacklist !== false;

      const wsRadio = controls.querySelector(`input[name="wordStyle"][value="${p.wordStyle}"]`);
      if (wsRadio) wsRadio.checked = true;

      const wanted = new Set(p.preselectGroups || DEFAULT_PREFS.preselectGroups);
      for (const gc of Array.from(controls.querySelectorAll('input[name="grp"]'))) {
        gc.checked = wanted.has(gc.value);
      }
    }

    function resetEverythingExceptHistory() {
      hideDropdown();
      clearManualOverrides();
      applyPrefsToUI(DEFAULT_PREFS);
      applySearchFilter();
      syncGroupChecks();
      applyRulesAuto();
      updateCounter();
      savePrefs(currentPrefs());
      makeToast('Reset');
    }

    function closeModal() {
      overlay.remove();
      document.removeEventListener('keydown', onKeydown);
    }

    applyPrefsToUI(prefs);
    applySearchFilter();
    syncGroupChecks();
    applyRulesAuto();
    updateCounter();

    controls.addEventListener('input', (e) => {
      if (e.target === searchInput) applySearchFilter();

      if (e.target === searchInput || e.target === blacklistTa) {
        savePrefs(currentPrefs());
      }
      if (e.target === blacklistTa) {
        updateSuggestions();
        scheduleAutoApply();
      }
    });

    blacklistTa.addEventListener('focus', updateSuggestions);
    blacklistTa.addEventListener('click', updateSuggestions);
    blacklistTa.addEventListener('keyup', updateSuggestions);
    blacklistTa.addEventListener('blur', () => setTimeout(hideDropdown, 120));

    controls.addEventListener('change', (e) => {
      const t = e.target;
      if (!t) return;

      if (t.name === 'grp') {
        syncGroupChecks();
        applyRulesAuto();
      }
      if (t === autoApplyCb && autoApplyCb.checked) applyRulesAuto();

      savePrefs(currentPrefs());
    });

    controls.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      if (btn.getAttribute('data-act') === 'applyRules') {
        applyRulesManual();
        savePrefs(currentPrefs());
      }
    });

    rightCol.addEventListener('change', (e) => {
      const el = e.target;
      if (el && el.type === 'checkbox') {
        el._touched = true;
        updateCounter();
      }
    });

    resetAllBtn.onclick = () => {
      if (confirmWin) return;
      confirmWin = makeConfirmWindow({
        overlay,
        title: 'Are you sure you want to Reset?',
        message: '',
        yesText: 'Confirm',
        cancelText: 'Cancel',
        centerTitleOnly: true,
        onYes: resetEverythingExceptHistory,
        onClose: () => { confirmWin = null; }
      });
    };

    historyBtn.onclick = () => {
      if (historyWin) return;
      historyWin = makeHistoryWindow({
        overlay,
        onCloseEscChange: (mainAllowed) => setEscMode(mainAllowed),
        onClose: () => { historyWin = null; }
      });
    };

    function onKeydown(e) {
      if (e.key === 'Escape') {
        if (!escClosesMain) {
          historyWin?.close?.();
          return;
        }
        closeModal();
        return;
      }

      const active = document.activeElement;
      const tag = active?.tagName?.toLowerCase?.() || '';
      const isTyping = (tag === 'input' || tag === 'textarea');

      if (e.key === '/' && !isTyping && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        searchInput.focus();
        searchInput.select();
        return;
      }

      if (e.key === 'Enter' && active === blacklistTa) {
        e.preventDefault();
        applyRulesManual();
        savePrefs(currentPrefs());
      }
    }

    document.addEventListener('keydown', onKeydown);
    closeX.onclick = closeModal;

    copyBtn.onclick = async () => {
      const prefsNow = currentPrefs();
      savePrefs(prefsNow);

      let selected = allItems.filter(it => it.cb.checked).map(it => it.tag);
      if (prefsNow.wordStyle === 'spaces') selected = selected.map(t => t.replace(/_/g, ' '));

      const text = selected.join(prefsNow.separator);
      if (!text) return;

      await copyToClipboard(text);
      makeToast(`Copied: ${selected.length}`);

      if (postId) updateHistoryCopied(postId, text, selected.length);
    };

    return overlay;
  }

  async function handleClick() {
    const info = await getTagsFromAPI();

    if (!info.flat.length) {
      const anchors = document.querySelectorAll('a.search-tag, aside a[href^="/posts?tags="]');
      const tags = Array.from(anchors).map(a => (a.textContent || '').trim()).filter(Boolean);

      info.grouped = { general: tags };
      info.order = ['general'];
      info.flat = unique(tags);
      info.postId = getCurrentPostId();
      info.previewUrl = null;
    }

    if (!info.flat.length) return;
    document.body.appendChild(makeModal(info));
  }

  function addButtonOnce() {
    if (document.getElementById(BTN_ID)) return;
    const btn = buildButton();
    btn.addEventListener('click', handleClick);
    document.body.appendChild(btn);
  }

  function init() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') addButtonOnce();
    else document.addEventListener('DOMContentLoaded', addButtonOnce, { once: true });

    const mo = new MutationObserver(() => addButtonOnce());
    mo.observe(document.documentElement, { childList: true, subtree: true });
  }

  init();
})();
