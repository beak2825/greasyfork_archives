// ==UserScript==
// @name         JVC Image Blacklist + Viewer 
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Blacklist images JVC avec matching STRICT, avatars remplacés, compat ImageViewer, zéro faux positif
// @match        https://www.jeuxvideo.com/*
 // @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547631/JVC%20Image%20Blacklist%20%2B%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/547631/JVC%20Image%20Blacklist%20%2B%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'jvcImageBlacklist';
  const STYLE_ID = 'jvc-img-blacklist-style';
  const PANEL_ID = 'jvc-img-blacklist-panel';
  const TOGGLE_ID = 'jvc-img-blacklist-toggle';
  const DEFAULT_AVATAR = 'https://image.jeuxvideo.com/avatar-md/default.jpg';
  const EXCEPTIONS = ['https://risibank.fr/logo.png'];

  /* ---------------- utils ---------------- */

  function basenameOf(url) {
    if (!url) return '';
    try {
      const u = new URL(url, location.href);
      return u.pathname.split('/').pop().split('?')[0];
    } catch {
      return url.split('/').pop().split('?')[0];
    }
  }

  function normalize(str) {
    return decodeURIComponent(String(str || ''))
      .toLowerCase()
      .replace(/(?:thumb|mini|small|med|preview|vignette)[\._-]?/g, '')
      .replace(/-\d+x\d+(?=\.)/g, '')
      .replace(/[_\-.]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function getKey(display, original) {
    return normalize(basenameOf(original || display));
  }

  function getDisplay(img) {
    return img.dataset.src || img.currentSrc || img.getAttribute('data-src') || img.src || '';
  }

  function getOriginal(img) {
    return img.getAttribute('risibank-original-src') || img.dataset.src || img.alt || img.src || '';
  }

  function isAvatar(img, disp, orig) {
    return (
      img.classList.contains('avatar') ||
      img.classList.contains('user-avatar-msg') ||
      disp.includes('/avatar') ||
      orig.includes('/avatar')
    );
  }

  /* ---------------- storage ---------------- */

  function loadList() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    applyCSS(list);
    updateToggle(list);
  }

  function addToBlacklist(display, original) {
    const key = getKey(display, original);
    if (!key) return;
    if (EXCEPTIONS.includes(display) || EXCEPTIONS.includes(original)) return;

    const list = loadList();
    if (list.some(it => it.key === key)) return;

    list.push({ key, display, original });
    saveList(list);
  }

  function removeFromBlacklist(key) {
    saveList(loadList().filter(it => it.key !== key));
  }

  /* ---------------- CSS ---------------- */

  function applyCSS(list) {
    let style = document.getElementById(STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = STYLE_ID;
      document.head.appendChild(style);
    }

    const hide = list.map(it => `
      .conteneur-message img:not([data-blacklist-preview="1"])[data-jvc-key="${it.key}"] {
        display:none !important;
        pointer-events:none !important;
      }
    `).join('\n');

    style.textContent = `
      .conteneur-message img[data-jvc-avatar="1"] {
        content:url("${DEFAULT_AVATAR}") !important;
        pointer-events:none !important;
      }
      ${hide}
    `;
  }

  /* ---------------- panel ---------------- */

  function createPanel() {
    if (document.getElementById(PANEL_ID)) return;

    const panel = document.createElement('div');
    panel.id = PANEL_ID;
    Object.assign(panel.style, {
      position:'fixed', top:'160px', right:'14px', width:'360px',
      maxHeight:'380px', overflowY:'auto', background:'#1e1e1e',
      border:'1px solid #333', borderRadius:'8px',
      padding:'10px', display:'none', zIndex:999999
    });

    panel.innerHTML = `
      <div style="font-weight:700;margin-bottom:8px">Images blacklistées</div>
      <div id="${PANEL_ID}-content"
           style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px"></div>
    `;

    document.body.appendChild(panel);
  }

  function createToggle() {
    if (document.getElementById(TOGGLE_ID)) return;

    const btn = document.createElement('button');
    btn.id = TOGGLE_ID;
    btn.textContent = '🗑 Blacklist';
    Object.assign(btn.style, {
      position:'fixed', bottom:'18px', right:'18px',
      padding:'8px 12px', background:'#2d2d2d',
      color:'#eee', border:'1px solid #444',
      borderRadius:'8px', cursor:'pointer', display:'none',
      zIndex:999999
    });

    btn.onclick = () => {
      const p = document.getElementById(PANEL_ID);
      p.style.display = p.style.display === 'block' ? 'none' : 'block';
      renderPanel();
    };

    document.body.appendChild(btn);
  }

  function updateToggle(list) {
    const t = document.getElementById(TOGGLE_ID);
    if (t) t.style.display = list.length ? 'block' : 'none';
  }

  function renderPanel() {
    const cont = document.getElementById(PANEL_ID + '-content');
    if (!cont) return;

    const list = loadList();
    cont.innerHTML = '';

    if (!list.length) {
      cont.textContent = 'Aucune image blacklistée.';
      return;
    }

    list.forEach(it => {
      const box = document.createElement('div');
      box.style.textAlign = 'center';

      const img = document.createElement('img');
      img.dataset.blacklistPreview = '1';
      img.src = it.display || it.original;
      Object.assign(img.style, {
        maxWidth:'100px', maxHeight:'90px',
        objectFit:'contain', border:'1px solid #444',
        background:'#111', padding:'4px',
        pointerEvents:'none'
      });

      const btn = document.createElement('button');
      btn.textContent = 'Retirer';
      Object.assign(btn.style, {
        marginTop:'6px', fontSize:'12px',
        background:'#8a2b2b', color:'#fff',
        border:'none', borderRadius:'4px',
        cursor:'pointer'
      });

      btn.onclick = () => {
        removeFromBlacklist(it.key);
        renderPanel();
      };

      box.appendChild(img);
      box.appendChild(btn);
      cont.appendChild(box);
    });
  }

  /* ---------------- core ---------------- */

  function wrap(img) {
    if (img.parentElement?.dataset?.jvcWrap) return img.parentElement;
    const span = document.createElement('span');
    span.dataset.jvcWrap = '1';
    span.style.position = 'relative';
    span.style.display = 'inline-block';
    img.parentNode.insertBefore(span, img);
    span.appendChild(img);
    return span;
  }

  function processImage(img) {
    if (!img.closest('.conteneur-message')) return;
    if (img.dataset.jvcDone) return;

    const disp = getDisplay(img);
    const orig = getOriginal(img);
    const key = getKey(disp, orig);

    img.dataset.jvcKey = key;
    img.dataset.jvcDone = '1';

    const list = loadList();
    const banned = list.some(it => it.key === key);

    if (banned) {
      if (isAvatar(img, disp, orig)) {
        img.dataset.jvcAvatar = '1';
        img.src = DEFAULT_AVATAR;
      } else {
        img.style.display = 'none';
      }
      return;
    }

    const wrapEl = wrap(img);
    const btn = document.createElement('button');
    btn.textContent = '⛔';
    Object.assign(btn.style, {
      position:'absolute', top:'4px', right:'4px',
      background:'rgba(0,0,0,.6)', color:'#fff',
      border:'none', borderRadius:'4px',
      fontSize:'12px', cursor:'pointer',
      display:'none', zIndex:10
    });

    wrapEl.onmouseenter = () => btn.style.display = 'block';
    wrapEl.onmouseleave = () => btn.style.display = 'none';

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopImmediatePropagation();
      e.stopPropagation();
      addToBlacklist(disp, orig);
      processImage(img);
      renderPanel();
      return false;
    }, true);

    wrapEl.appendChild(btn);
  }

  /* ---------------- observe ---------------- */

  function scan() {
    document.querySelectorAll('.conteneur-message img').forEach(processImage);
  }

  const obs = new MutationObserver(scan);

  /* ---------------- init ---------------- */

  function init() {
    createPanel();
    createToggle();
    applyCSS(loadList());
    updateToggle(loadList());
    scan();
    obs.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['src','data-src'] });
  }

  init();

})();
