// ==UserScript==
// @name         Scribd Enhancer All-in-One (v3.5.0)
// @namespace    https://greasyfork.org/users/Eliminater74
// @version      3.5.0
// @description  Scribd Enhancer with OCR, TXT/HTML export, Snapshot PDF (pixel-perfect), Rich HTML (images inlined), page-range + quality controls. Pleasant "Dark Box" UI + floating gear. Toast notifications. Rich HTML de-duplicates layered text/image. + External Downloader button.
// @author       Eliminater74
// @license      MIT
// @match        *://*.scribd.com/*
// @match        *://scribd.vdownloaders.com/*
// @grant        none
// @icon         https://s-f.scribdassets.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/537983/Scribd%20Enhancer%20All-in-One%20%28v350%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537983/Scribd%20Enhancer%20All-in-One%20%28v350%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------- KEYS ----------
  const SETTINGS_KEY = 'scribdEnhancerSettings_v3_5'; 
  const UI_POS_KEY   = 'scribdEnhancer_ui_pos_v3';

  // ---------- SETTINGS ----------
  const defaultSettings = {
    unblur: true,
    autoScrape: false,
    darkMode: false,
    showPreview: false,
    enableOCR: true,
    ocrLang: 'auto',
    splitEvery: 0,
    pageRange: 'all',
    snapshotScale: 2,
    snapshotQuality: 0.92,
    downloaderUrl: 'https://scribd.vdownloaders.com/?url={url}',
  };
  const settings = { ...defaultSettings, ...JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}') };
  const saveSettings = () => localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));

  // ---------- LIBS ----------
  const loadScript = (src) => { const s = document.createElement('script'); s.src = src; document.head.appendChild(s); return s; };
  if (!window.Tesseract) loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@4.0.2/dist/tesseract.min.js');
  if (!window.html2canvas) loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js');
  if (!window.jspdf) loadScript('https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js');

  // ---------- STYLES ----------
  const style = document.createElement('style');
  style.textContent = `
    /* -- TOASTS -- */
    #se-toast-container {
      position: fixed; top: 20px; left: 50%; transform: translateX(-50%); z-index: 2147483647;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    }
    .se-toast {
      background: rgba(33, 37, 43, 0.95); backdrop-filter: blur(10px);
      color: #fff; padding: 12px 24px; border-radius: 50px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3); font-family: 'Segoe UI', system-ui, sans-serif; font-size: 14px; font-weight: 500;
      opacity: 0; transform: translateY(-15px); transition: all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28); pointer-events: auto;
      border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; gap: 10px;
    }
    .se-toast.show { opacity: 1; transform: translateY(0); }

    /* -- GEAR -- */
    #se-gear {
      position: fixed; width: 48px; height: 48px; line-height: 48px; text-align: center;
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      color: #fff; border-radius: 50%;
      cursor: pointer; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4); z-index: 2147483640; user-select: none;
      font-size: 22px; transition: transform 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28), box-shadow 0.3s;
      border: 2px solid rgba(255,255,255,0.2);
    }
    #se-gear:hover { transform: scale(1.1) rotate(10deg); box-shadow: 0 8px 25px rgba(59, 130, 246, 0.6); }

    /* -- PANEL -- */
    #se-panel {
      position: fixed; width: 360px; border-radius: 20px;
      background: rgba(30, 33, 40, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      box-shadow: 0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08);
      z-index: 2147483641; font-family: 'Segoe UI', system-ui, sans-serif; color: #f0f2f5;
      display: none; overflow: hidden; animation: se-pop 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }
    @keyframes se-pop { from { opacity:0; transform: scale(0.95) translateY(10px); } to { opacity:1; transform: scale(1) translateY(0); } }

    #se-header {
      display: flex; align-items: center; justify-content: space-between; padding: 14px 20px;
      cursor: move; background: linear-gradient(to right, rgba(255,255,255,0.03), transparent);
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    #se-header .title { font-size: 15px; font-weight: 700; color: #e2e8f0; letter-spacing: 0.5px; }
    #se-header .controls { display: flex; gap: 8px; }
    
    .se-icon-btn {
      width: 28px; height: 28px; line-height: 28px; text-align: center; border-radius: 8px;
      background: rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; font-size: 14px;
      color: #94a3b8;
    }
    .se-icon-btn:hover { background: rgba(255,255,255,0.15); color: #fff; transform: translateY(-1px); }
    .se-icon-btn.close:hover { background: #ef4444; color: white; }

    #se-body { padding: 20px; max-height: 70vh; overflow-y: auto; }
    #se-body::-webkit-scrollbar { width: 5px; }
    #se-body::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }

    /* -- FORM -- */
    .se-group { margin-bottom: 18px; }
    .se-row { display: flex; gap: 12px; margin-bottom: 10px; }
    .se-row > * { flex: 1; }
    .se-label { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #94a3b8; cursor: pointer; transition: color 0.2s; user-select: none; margin-bottom: 6px; }
    .se-label:hover { color: #fff; }
    
    .se-chk { appearance: none; width: 18px; height: 18px; border: 2px solid #475569; border-radius: 5px; display: grid; place-content: center; transition: 0.2s; margin: 0; cursor: pointer; background: transparent; }
    .se-chk::before { content: ""; width: 10px; height: 10px; transform: scale(0); transition: 0.2s; background: #fff; border-radius: 2px; }
    .se-chk:checked { border-color: #3b82f6; background: #3b82f6; }
    .se-chk:checked::before { transform: scale(1); }

    .se-input, .se-select {
      width: 100%; padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.08);
      background: rgba(15, 23, 42, 0.4); color: #e2e8f0; font-size: 13px; outline: none; transition: all 0.2s;
    }
    .se-input:focus, .se-select:focus { border-color: #3b82f6; background: rgba(15, 23, 42, 0.6); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
    
    .se-btn {
      width: 100%; padding: 11px; border: none; border-radius: 10px;
      background: #334155; color: #f8fafc;
      font-weight: 600; font-size: 13px; cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
      transition: all 0.2s; margin-top: 8px;
    }
    .se-btn:hover { filter: brightness(1.1); transform: translateY(-1px); box-shadow: 0 8px 15px rgba(0,0,0,0.2); }
    .se-btn:active { transform: scale(0.98); }
    .se-btn-primary { background: linear-gradient(135deg, #3b82f6, #2563eb); box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3); } 
    
    /* -- PREVIEW -- */
    #se-preview {
      position: fixed; width: 500px; height: 600px; right: 20px; bottom: 80px;
      background: rgba(30, 33, 40, 0.98); backdrop-filter: blur(16px);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5); z-index: 2147483642;
      display: none; flex-direction: column; overflow: hidden;
      animation: se-fadein 0.2s ease;
    }
    @keyframes se-fadein { from { opacity:0; } to { opacity:1; } }
    
    #se-preview-header {
      padding: 12px 16px; background: rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: center;
      cursor: move; user-select: none; border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    #se-preview-header span { font-size: 13px; font-weight: 600; color: #e2e8f0; }
    #se-preview-content {
      flex: 1; padding: 20px; overflow: auto; font-family: 'Fira Code', Consolas, monospace; font-size: 13px;
      color: #cbd5e1; line-height: 1.6; background: rgba(15, 23, 42, 0.3);
    }
    .se-placeholder { color: #64748b; font-style: italic; text-align: center; margin-top: 60px; }
    
    .se-p-block { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 20px; margin-bottom: 20px; }
    .se-p-title { color: #60a5fa; font-size: 11px; margin-bottom: 8px; opacity: 0.7; }
    .se-p-img { display: block; max-width: 100%; margin: 10px 0; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); }
    .se-ocr-block { margin-top: 8px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px; font-size: 11px; color: #a0aec0; }

    hr { border: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent); margin: 20px 0; }
  `;
  document.head.appendChild(style);

  // ---------- TOAST SYSTEM ----------
  const toastContainer = document.createElement('div');
  toastContainer.id = 'se-toast-container';
  document.body.appendChild(toastContainer);

  function showToast(msg, duration = 3000) {
    const el = document.createElement('div');
    el.className = 'se-toast';
    el.innerHTML = msg;
    toastContainer.appendChild(el);
    void el.offsetWidth; el.classList.add('show');
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 300); }, duration);
  }

  // ---------- HELPERS ----------
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function applyDarkMode() {
    document.documentElement.classList.toggle('se-dark', settings.darkMode);
  }

  function unblurContent() {
    if (!settings.unblur) return;
    const cleanup = () => {
      document.querySelectorAll('.blurred_page, .promo_div, [unselectable="on"]').forEach(el => el.remove());
      document.querySelectorAll('*').forEach(el => {
        const s = el.style;
        if (s.color === 'transparent') s.color = 'inherit';
        if (s.textShadow && s.textShadow.includes('white')) s.textShadow = 'none';
      });
    };
    cleanup();
    new MutationObserver(cleanup).observe(document.body, { childList: true, subtree: true });
  }

  // ---------- DRAGGABLE ----------
  function makeDraggable(el, storageKey, initialFactory) {
    let pos = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (!pos && initialFactory) pos = initialFactory();
    if (pos) { el.style.left = pos.x + 'px'; el.style.top = pos.y + 'px'; }

    let startX, startY, startL, startT, hasMoved = false;

    const onMove = (e) => {
      const c = e.touches ? e.touches[0] : e;
      const dx = c.clientX - startX, dy = c.clientY - startY;
      if (!hasMoved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) { hasMoved = true; el.dataset.dragging = 'true'; }
      if (hasMoved) {
        e.preventDefault();
        el.style.left = clamp(startL + dx, 0, window.innerWidth - el.offsetWidth) + 'px';
        el.style.top = clamp(startT + dy, 0, window.innerHeight - el.offsetHeight) + 'px';
      }
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp);
      document.removeEventListener('touchmove', onMove); document.removeEventListener('touchend', onUp);
      if (hasMoved) {
        const r = el.getBoundingClientRect();
        localStorage.setItem(storageKey, JSON.stringify({ x: r.left, y: r.top }));
        setTimeout(() => { el.dataset.dragging = 'false'; hasMoved = false; }, 50);
      } else el.dataset.dragging = 'false';
    };

    const onDown = (e) => {
      if (e.target.closest('input, select, button, .se-icon-btn:not(.handle)')) return;
      const c = e.touches ? e.touches[0] : e;
      startX = c.clientX; startY = c.clientY;
      const r = el.getBoundingClientRect(); startL = r.left; startT = r.top; hasMoved = false;
      document.addEventListener('mousemove', onMove); document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onMove, { passive: false }); document.addEventListener('touchend', onUp);
    };
    el.addEventListener('mousedown', onDown); el.addEventListener('touchstart', onDown, { passive: false });
  }

  // ---------- UI BUILDER ----------
  function buildUI() {
    const gear = document.createElement('div'); gear.id = 'se-gear'; gear.innerHTML = '⚙️'; gear.title = 'Open Menu';
    document.body.appendChild(gear);
    makeDraggable(gear, UI_POS_KEY + '_gear', () => ({ x: window.innerWidth - 80, y: window.innerHeight - 80 }));

    const panel = document.createElement('div'); panel.id = 'se-panel';
    panel.innerHTML = `
      <div id="se-header"><div class="title">✨ Scribd Tools v3.5</div><div class="controls"><div class="se-icon-btn close" id="se-close-btn">✕</div></div></div>
      <div id="se-body">
        <div class="se-group"><label class="se-label"><input type="checkbox" id="o-unblur" class="se-chk"> <span style="margin-left:8px">Unblur Content</span></label><label class="se-label"><input type="checkbox" id="o-autoscrape" class="se-chk"> <span style="margin-left:8px">Auto-Scrape on Load</span></label></div>
        <div class="se-group"><button class="se-btn se-btn-primary" id="b-toggle-prev">👁️ Show Output Reader</button></div>
        <hr>
        <div class="se-group"><div class="se-row"><div><div class="se-label">OCR Lang</div><select id="o-lang" class="se-select"><option value="auto">Auto</option><option value="eng">English</option><option value="spa">Spanish</option></select></div><div><div class="se-label">Snapshot Scale</div><select id="o-scale" class="se-select"><option value="1">1x</option><option value="2">2x</option><option value="3">3x</option></select></div></div><div class="se-label">Pages (e.g. 1-5, 8)</div><input type="text" id="o-range" class="se-input" placeholder="all"></div>
        <hr>
        <div class="se-group"><div class="se-label">External Downloader</div><div style="display:flex;gap:8px"><input id="o-dl-url" class="se-input" style="flex:1" placeholder="URL Template"><button id="b-dl-go" class="se-btn" style="width:auto;margin:0">Go</button></div></div>
        <hr>
        <div class="se-group"><div class="se-label">ACTIONS</div><button id="b-scrape" class="se-btn se-btn-primary">📖 Scrape Content & Images</button><div class="se-row"><button id="b-txt" class="se-btn">TXT</button><button id="b-html" class="se-btn">HTML</button><button id="b-doc" class="se-btn">DOC</button></div><div style="margin-top:6px"><button id="b-print" class="se-btn" title="System Print (Searchable PDF)">🖨️ Print / Save PDF</button></div><button id="b-snap" class="se-btn">📸 Save Image PDF (Snapshot)</button><button id="b-rich" class="se-btn">🖼️ Save Rich HTML</button></div>
      </div>`;
    document.body.appendChild(panel);
    makeDraggable(panel, UI_POS_KEY + '_panel', () => ({ x: window.innerWidth - 380, y: 100 }));

    const preview = document.createElement('div'); preview.id = 'se-preview';
    preview.innerHTML = `<div id="se-preview-header"><span>📜 Scraper Output</span><div style="display:flex;gap:6px"><div class="se-icon-btn" id="se-prev-clear">🧹</div><div class="se-icon-btn close" id="se-prev-close">✕</div></div></div><div id="se-preview-content"><div class="se-placeholder">Content will appear here...</div></div>`;
    if (settings.showPreview) { document.body.appendChild(preview); preview.style.display = 'flex'; }
    makeDraggable(preview, UI_POS_KEY + '_preview', () => ({ x: 40, y: 40 }));

    // --- BINDINGS ---
    const getEl = (id) => panel.querySelector('#'+id);
    gear.addEventListener('click', () => { if (gear.dataset.dragging !== 'true') panel.style.display = (panel.style.display === 'block') ? 'none' : 'block'; });
    getEl('se-close-btn').onclick = () => panel.style.display = 'none';

    const bindCk = (id, k) => { const el = getEl(id); el.checked = settings[k]; el.onchange = () => { settings[k] = el.checked; saveSettings(); applySideEffects(k); }; };
    const bindVal = (id, k, p=v=>v) => { const el = getEl(id); el.value = settings[k]; el.onchange = () => { settings[k] = p(el.value); saveSettings(); }; };
    bindCk('o-unblur', 'unblur'); bindCk('o-autoscrape', 'autoScrape');
    bindVal('o-lang', 'ocrLang'); bindVal('o-range', 'pageRange');
    bindVal('o-scale', 'snapshotScale', parseInt); bindVal('o-dl-url', 'downloaderUrl');
    
    function applySideEffects(k) { if(k==='darkMode') applyDarkMode(); }

    getEl('b-toggle-prev').onclick = () => { if(!document.body.contains(preview)) document.body.appendChild(preview); const h = preview.style.display==='none'; preview.style.display = h?'flex':'none'; settings.showPreview=h; saveSettings(); };
    preview.querySelector('#se-prev-close').onclick = () => { preview.style.display='none'; settings.showPreview=false; saveSettings(); };
    getEl('b-dl-go').onclick = () => window.open(settings.downloaderUrl.replace('{url}', encodeURIComponent(location.href)), '_blank');

    getEl('b-scrape').onclick = async () => {
      if (!document.body.contains(preview)) document.body.appendChild(preview);
      preview.style.display = 'flex'; settings.showPreview = true; saveSettings();
      
      const pages = [...document.querySelectorAll('.page, .reader_column, [id^="page_container"], .outer_page')];
      if (!pages.length) return showToast('❌ No pages found.');
      
      showToast('📖 Scraping with images...');
      const out = preview.querySelector('#se-preview-content');
      out.innerHTML = '';
      
      for (let i=0; i<pages.length; i++) {
         const p = pages[i];
         p.scrollIntoView({block:'center'}); await sleep(80);
         const block = document.createElement('div'); block.className = 'se-p-block';
         block.innerHTML = `<div class="se-p-title">Page ${i+1}</div>`;
         
         let txt = p.innerText.trim();
         const imgs = [...p.querySelectorAll('img')];
         for (const img of imgs) {
             if (img.naturalWidth > 150 && img.naturalHeight > 150) { 
                 const c = document.createElement('img'); c.className = 'se-p-img'; c.src = img.src; block.appendChild(c);
             }
         }
         if (settings.enableOCR && (!txt || txt.length < 50)) {
            const bigImg = p.querySelector('img'); 
            if (bigImg && window.Tesseract) {
               try {
                 const res = await window.Tesseract.recognize(bigImg.src, settings.ocrLang==='auto'?'eng':settings.ocrLang);
                 if (res.data.text) { txt += `\n${res.data.text}`; block.innerHTML += `<div class="se-ocr-block">[OCR Corrected]</div>`; }
               } catch(e){}
            }
         }
         const txtDiv = document.createElement('div'); txtDiv.innerText = txt || '[No Text]'; block.appendChild(txtDiv);
         out.appendChild(block); out.scrollTop = out.scrollHeight;
      }
      showToast('✅ Scrape Done');
    };
    preview.querySelector('#se-prev-clear').onclick = () => preview.querySelector('#se-preview-content').innerHTML = '<div class="se-placeholder">Cleared.</div>';

    const getHtml = () => preview.querySelector('#se-preview-content').innerHTML;
    const getTxt = () => preview.querySelector('#se-preview-content').innerText;
    
    getEl('b-txt').onclick  = () => downloadBlob(getTxt(), 'scribd_text.txt', 'text/plain');
    getEl('b-html').onclick = () => downloadBlob(`<html><head><style>body{font-family:sans-serif;max-width:800px;margin:auto;padding:20px}img{max-width:100%}.se-p-title{color:#888;border-bottom:1px solid #ddd;margin:20px 0 10px}</style></head><body>${getHtml()}</body></html>`, 'scribd_export.html', 'text/html');
    getEl('b-doc').onclick  = () => {
        const h = `<html><head><meta charset="utf-8"></head><body>${getHtml()}</body></html>`;
        downloadBlob(h, 'scribd_doc.doc', 'application/msword');
    };
    getEl('b-print').onclick = () => { const w = window.open('','_blank'); w.document.write(`<html><body>${getHtml()}</body></html>`); w.close(); w.print(); };

    getEl('b-snap').onclick = async () => {
       const pages = [...document.querySelectorAll('.page, .reader_column')];
       if(!pages.length) return showToast('❌ No pages');
       showToast('📸 Snapshotting...');
       const { jsPDF } = window.jspdf;
       const pdf = new jsPDF({ format:'a4', compress:true });
       const pw = pdf.internal.pageSize.getWidth();
       for(let i=0; i<pages.length; i++) {
          const p = pages[i]; p.scrollIntoView({block:'center'}); await sleep(200);
          const cvs = await window.html2canvas(p, { scale: settings.snapshotScale, useCORS:true, backgroundColor:'#fff' });
          if(i>0) pdf.addPage();
          pdf.addImage(cvs.toDataURL('image/jpeg', settings.snapshotQuality), 'JPEG', 0, 0, pw, pw*(cvs.height/cvs.width));
       }
       pdf.save('snapshot.pdf'); showToast('✅ Saved PDF');
    };
    
    getEl('b-rich').onclick = async () => {
       const pages = [...document.querySelectorAll('.page, .reader_column')];
       showToast('🖼️ Building HTML...');
       const buf = [];
       for (const p of pages) {
         p.scrollIntoView({block:'center'}); await sleep(100);
         const c = p.cloneNode(true); c.querySelectorAll('script,iframe').forEach(n=>n.remove());
         const imgs = [...c.querySelectorAll('img')];
         for (const img of imgs) {
             try { const cvs = document.createElement('canvas'); cvs.width=img.naturalWidth; cvs.height=img.naturalHeight; cvs.getContext('2d').drawImage(img,0,0); img.src = cvs.toDataURL(); } catch(e){}
         }
         buf.push(`<div style="margin:20px auto; max-width:900px; border:1px solid #ddd; padding:20px">${c.innerHTML}</div>`);
       }
       downloadBlob(`<html><body>${buf.join('')}</body></html>`, 'rich.html', 'text/html'); showToast('✅ Saved HTML');
    };
  }

  function downloadBlob(content, name, type) {
    const b = new Blob([content], {type});
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click();
  }

  function init() {
     applyDarkMode(); unblurContent(); buildUI();
     if (location.host.includes('vdownloaders')) {
        const u = new URLSearchParams(location.search).get('url');
        if(u) { const i = document.querySelector('input[name="url"], input[type="url"]'); if(i) i.value=u; }
     }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
