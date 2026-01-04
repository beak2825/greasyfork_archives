// ==UserScript==
// @name         TESTE OMEP
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  Overlay da Missão para o site WPlace (com auto-close de paleta via MutationObserver)
// @author       Víkish
// @match        https://wplace.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=partidomissao.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547009/TESTE%20OMEP.user.js
// @updateURL https://update.greasyfork.org/scripts/547009/TESTE%20OMEP.meta.js
// ==/UserScript==

(async function () {
'use strict';

/* =========================
   CONFIG & DETECÇÕES DE RECURSOS
   ========================= */

const CHUNK_WIDTH = 1000;
const CHUNK_HEIGHT = 1000;
const UI_DEBOUNCE_MS = 200;       // debounce para atualização da UI
const TOUCH_SWIPE_THRESHOLD = 12; // px para considerar swipe (global)
const TOUCH_TAP_MAX_MS = 400;     // máximo de tempo para considerar tap

const SUPPORTS_OFFSCREEN = (typeof OffscreenCanvas !== 'undefined');
const SUPPORTS_CREATEIMAGEBITMAP = (typeof createImageBitmap === 'function');
const SUPPORTS_NOTIFICATION = (typeof Notification !== 'undefined');

let STORAGE_AVAILABLE = true;
try { localStorage && localStorage.getItem && localStorage.setItem; } catch (e) { STORAGE_AVAILABLE = false; }

/* =========================
   WRAPPERS: safe canvas / localStorage / notification
   ========================= */

function createSafeCanvas(width, height) {
    if (SUPPORTS_OFFSCREEN) {
        try { return new OffscreenCanvas(width, height); } catch (e) { /* fallthrough to DOM canvas */ }
    }
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    return c;
}

function safeLocalStorageGet(key) {
    try {
        return STORAGE_AVAILABLE ? localStorage.getItem(key) : null;
    } catch (e) {
        return null;
    }
}

function safeLocalStorageSet(key, value) {
    try {
        if (STORAGE_AVAILABLE) localStorage.setItem(key, value);
    } catch (e) { /* ignore */ }
}

/* in-page toast fallback for notifications (works on mobile & desktop) */
function showInPageNotification(title, body, icon, duration = 6000) {
    try {
        let container = document.getElementById('__overlay_toast_container');
        if (!container) {
            container = document.createElement('div');
            container.id = '__overlay_toast_container';
            Object.assign(container.style, {
                position: 'fixed',
                right: '12px',
                top: '12px',
                zIndex: 2147483647,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: 'none',
                maxWidth: '320px'
            });
            document.body.appendChild(container);
        }
        const box = document.createElement('div');
        Object.assign(box.style, {
            pointerEvents: 'auto',
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            background: 'rgba(0,0,0,0.85)',
            color: '#fff',
            padding: '10px 12px',
            borderRadius: '10px',
            boxShadow: '0 8px 28px rgba(0,0,0,0.45)',
            transform: 'translateX(20px)',
            opacity: '0',
            transition: 'opacity 220ms ease, transform 220ms ease',
            fontSize: '13px',
            lineHeight: '1.2'
        });
        if (icon) {
            const img = document.createElement('img');
            img.src = icon;
            Object.assign(img.style, { width:'36px', height:'36px', borderRadius:'6px', flex:'0 0 auto' });
            box.appendChild(img);
        }
        const inner = document.createElement('div');
        const t = document.createElement('div'); t.textContent = title; t.style.fontWeight = '700';
        const b = document.createElement('div'); b.textContent = body; b.style.opacity = '0.95'; b.style.fontSize = '12px';
        inner.appendChild(t); inner.appendChild(b);
        box.appendChild(inner);
        container.appendChild(box);
        // animate in
        requestAnimationFrame(()=>{ box.style.opacity = '1'; box.style.transform = 'translateX(0)'; });
        const hide = () => {
            box.style.opacity = '0'; box.style.transform = 'translateX(20px)';
            setTimeout(()=>{ try { box.remove(); } catch(e){} }, 260);
        };
        const timeout = setTimeout(hide, duration);
        box.addEventListener('click', ()=>{ clearTimeout(timeout); hide(); });
    } catch (e) {
        // ignore
    }
}

function safeNotify(title, opt) {
    try {
        // Always attempt to show native Notification if supported and permitted
        if (SUPPORTS_NOTIFICATION) {
            if (Notification.permission === 'granted') {
                try { new Notification(title, opt); } catch (e) { /* ignore */ }
            } else if (Notification.permission !== 'denied') {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        try { new Notification(title, opt); } catch (e) { /* ignore */ }
                    } else {
                        // fallback UI toast
                        showInPageNotification(title, opt && opt.body ? opt.body : '', opt && opt.icon ? opt.icon : null);
                    }
                }).catch(()=>{ showInPageNotification(title, opt && opt.body ? opt.body : '', opt && opt.icon ? opt.icon : null); });
            } else {
                // permission denied
                showInPageNotification(title, opt && opt.body ? opt.body : '', opt && opt.icon ? opt.icon : null);
            }
        } else {
            // notifications not supported: use in-page toast
            showInPageNotification(title, opt && opt.body ? opt.body : '', opt && opt.icon ? opt.icon : null);
        }
    } catch (e) {
        // as ultimate fallback show console + toast
        console.log('Notification fallback:', title, opt);
        showInPageNotification(title, opt && opt.body ? opt.body : '', opt && opt.icon ? opt.icon : null);
    }
}

/* =========================
   HELPERS ASYNC: carregar overlays iniciais
   ========================= */

async function fetchData() {
    const response = await fetch("https://gist.githubusercontent.com/yl99a/45ec3df57cc75c4b93c45251b87eb20b/raw/overlays.json?" + Date.now());
    return await response.json();
}

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve({ img, width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = reject;
        img.src = src;
    });
}

function blobToImage(blob) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
    });
}

/* =========================
   WORKER / PROCESSAMENTO: cria worker dinamicamente (processamento pesado)
   Quando OffscreenCanvas não existe, cairemos para o processamento na thread principal.
   ========================= */

let pixelWorker = null;
let workerReqId = 0;
const pendingWorker = new Map();

async function processInMainThread(blob, overlayBuffer, overlayWidth, overlayHeight, selectedArr) {
    try {
        const overlayArr = new Uint8ClampedArray(overlayBuffer);
        const selectedSet = new Set(selectedArr || []);
        let imgBitmap = null;
        if (SUPPORTS_CREATEIMAGEBITMAP) {
            try { imgBitmap = await createImageBitmap(blob); } catch (e) { imgBitmap = null; }
        }
        const width = imgBitmap ? imgBitmap.width : overlayWidth || CHUNK_WIDTH;
        const height = imgBitmap ? imgBitmap.height : overlayHeight || CHUNK_HEIGHT;
        const canvas = createSafeCanvas(width, height);
        const ctx = canvas.getContext('2d');
        if (imgBitmap) {
            ctx.drawImage(imgBitmap, 0, 0, width, height);
        } else {
            const img = await blobToImage(blob);
            ctx.drawImage(img, 0, 0, width, height);
        }
        const originalData = ctx.getImageData(0, 0, width, height);
        const resultData = ctx.getImageData(0, 0, width, height);
        const d1 = originalData.data;
        const dr = resultData.data;
        const d2 = overlayArr;
        let wrongPixels = 0;
        let totalTargetPixels = 0;
        const localColorCount = Object.create(null);
        for (let i = 0; i < d1.length; i += 4) {
            const a2 = d2[i + 3];
            const isTransparent = a2 === 0;
            if (!isTransparent) totalTargetPixels++;
            const samePixel = d1[i] === d2[i] &&
                              d1[i+1] === d2[i+1] &&
                              d1[i+2] === d2[i+2] &&
                              d1[i+3] === d2[i+3];
            const key = d2[i] + ',' + d2[i+1] + ',' + d2[i+2];
            if (!samePixel && !isTransparent) {
                wrongPixels++;
                localColorCount[key] = (localColorCount[key] || 0) + 1;
            }
            if (samePixel && !isTransparent) {
                dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
            } else if (!isTransparent) {
                if (selectedSet.has(key)) {
                    dr[i] = d2[i]; dr[i+1] = d2[i+1]; dr[i+2] = d2[i+2]; dr[i+3] = d2[i+3];
                } else {
                    dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
                }
            }
        }
        ctx.putImageData(resultData, 0, 0);
        let outBlob;
        if (canvas instanceof OffscreenCanvas && typeof canvas.convertToBlob === 'function') {
            outBlob = await canvas.convertToBlob();
        } else {
            outBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
        }
        return { blob: outBlob, wrongPixels, totalTargetPixels, colorCounts: localColorCount };
    } catch (err) {
        return Promise.reject(err);
    }
}

if (SUPPORTS_OFFSCREEN) {
    const workerCode = `
self.onmessage = async function(e) {
  const data = e.data;
  if (!data || data.type !== 'process') return;
  const id = data.id;
  try {
    const blob = data.blob;
    const overlayBuf = data.overlayBuffer;
    const overlayWidth = data.overlayWidth;
    const overlayHeight = data.overlayHeight;
    const selectedArr = data.selectedColors || [];
    const selectedSet = new Set(selectedArr);
    const imgBitmap = await createImageBitmap(blob);
    const width = imgBitmap.width;
    const height = imgBitmap.height;
    const off = new OffscreenCanvas(width, height);
    const ctx = off.getContext('2d');
    ctx.drawImage(imgBitmap, 0, 0, width, height);
    const originalData = ctx.getImageData(0, 0, width, height);
    const resultData = ctx.getImageData(0, 0, width, height);
    const d1 = originalData.data;
    const dr = resultData.data;
    const d2 = new Uint8ClampedArray(overlayBuf);
    let wrongPixels = 0;
    let totalTargetPixels = 0;
    const localColorCount = Object.create(null);
    for (let i = 0; i < d1.length; i += 4) {
      const a2 = d2[i + 3];
      const isTransparent = a2 === 0;
      if (!isTransparent) totalTargetPixels++;
      const samePixel = d1[i] === d2[i] &&
                        d1[i+1] === d2[i+1] &&
                        d1[i+2] === d2[i+2] &&
                        d1[i+3] === d2[i+3];
      const key = d2[i] + ',' + d2[i+1] + ',' + d2[i+2];
      if (!samePixel && !isTransparent) {
        wrongPixels++;
        localColorCount[key] = (localColorCount[key] || 0) + 1;
      }
      if (samePixel && !isTransparent) {
        dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
      } else if (!isTransparent) {
        if (selectedSet.has(key)) {
          dr[i] = d2[i]; dr[i+1] = d2[i+1]; dr[i+2] = d2[i+2]; dr[i+3] = d2[i+3];
        } else {
          dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
        }
      }
    }
    ctx.putImageData(resultData, 0, 0);
    const outBlob = await off.convertToBlob();
    self.postMessage({ id, blob: outBlob, wrongPixels, totalTargetPixels, colorCounts: localColorCount });
  } catch (err) {
    self.postMessage({ id, error: String(err) });
  }
};
`;
    try {
        const workerBlob = new Blob([workerCode], { type: "application/javascript" });
        const workerUrl = URL.createObjectURL(workerBlob);
        pixelWorker = new Worker(workerUrl);
        pixelWorker.onmessage = (ev) => {
            const data = ev.data;
            if (!data || typeof data.id === 'undefined') return;
            const id = data.id;
            const entry = pendingWorker.get(id);
            if (!entry) return;
            pendingWorker.delete(id);
            if (data.error) return entry.reject(new Error(data.error));
            entry.resolve(data);
        };
    } catch (e) {
        pixelWorker = null;
        console.warn("Worker creation failed, falling back to main-thread processing.", e);
    }
}

/* =========================
   Carregar overlays e extrair imageData (usa canvas compatível)
   ========================= */

const overlays = await (async () => {
    const arr = await fetchData();
    for (const obj of arr) {
        obj.chunksString = `/${obj.chunk[0]}/${obj.chunk[1]}.png`;
        const { img, width, height } = await loadImage(obj.url);
        const overlayCanvas = createSafeCanvas(1000, 1000);
        const overlayCtx = overlayCanvas.getContext("2d");
        overlayCtx.drawImage(img, obj.coords[0], obj.coords[1], width, height);
        const imageData = overlayCtx.getImageData(0, 0, 1000, 1000);
        obj.imageData = imageData;
    }
    return arr;
})();

/* =========================
   Variáveis UI e estado
   ========================= */

const OVERLAY_MODES = ["overlay", "original", "chunks"];

let overlayMode = OVERLAY_MODES[0];

const counterContainer = document.createElement("div");
counterContainer.id = "pixel-counter";
Object.assign(counterContainer.style, {
    position: "fixed", top: "5px", left: "50%", transform: "translateX(-50%)",
    zIndex: "10000", padding: "6px 10px", fontFamily: "Arial, sans-serif",
    backgroundColor: "rgba(0,0,0,0.66)", color: "white", borderRadius: "6px",
    pointerEvents: "none", backdropFilter: "blur(3px)", lineHeight: "1.25",
    textAlign: "center", display: "flex", flexDirection: "column", gap: "2px"
});
document.body.appendChild(counterContainer);

const pixelCounter = document.createElement("div");
pixelCounter.textContent = "Pixeis restantes: 0";
pixelCounter.style.fontSize = "11px";
counterContainer.appendChild(pixelCounter);

const percentageCounter = document.createElement("div");
percentageCounter.textContent = "Progresso atual: 0,00%";
percentageCounter.style.fontSize = "11px";
counterContainer.appendChild(percentageCounter);

/* =========================
   UI: painel de cores (compacto)
   ========================= */

const colorStatsContainer = document.createElement("div");
Object.assign(colorStatsContainer.style, {
    position: "fixed", top: "170px", left: "10px",
    backgroundColor: "rgba(8,8,10,0.55)", color: "white", fontSize: "11px",
    padding: "0px", borderRadius: "8px", zIndex: "10000",
    maxHeight: "600px", pointerEvents: "auto",
    minWidth: "110px", maxWidth: "320px", boxSizing: "border-box",
    backdropFilter: "blur(6px)", touchAction: "manipulation"
});
document.body.appendChild(colorStatsContainer);

const styleTag = document.createElement('style');
styleTag.textContent = `
.color-list-scroll { overflow-y: auto; padding-right: 28px; position: relative; -ms-overflow-style: none; scrollbar-width: none; }
.color-list-scroll::-webkit-scrollbar { width: 0; height: 0; }
.color-checkbox { transform: scale(0.85); margin-left: 8px; margin-right: 2px; }
.color-item { display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; }
.color-item:hover { background: rgba(255,255,255,0.03); }
.color-square { width: 18px; height: 18px; border-radius:3px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12); flex: 0 0 auto; }
.color-count { white-space: nowrap; pointer-events: auto; cursor: pointer; font-size: 11px; color: #fff; }
.color-header { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:8px 10px; }
.color-title { font-weight:600; font-size:13px; padding-right:6px; }
.color-divider { height:1px; background: rgba(255,255,255,0.06); margin:0 8px 6px 8px; }
.minimize-btn { width:28px; height:28px; display:inline-flex; align-items:center; justify-content:center; border-radius:4px; border: 1px solid rgba(255,255,255,0.8); background: rgba(255,255,255,0.02); cursor:pointer; flex:0 0 auto; padding:3px; box-sizing: border-box; color: white; font-weight:600; }
.color-header.minimized-centered { justify-content: center; padding: 6px 0; }
.color-stats-collapsed {
  width: 30px !important; height: 30px !important; min-width: 30px !important; max-width: 30px !important;
  padding: 0 !important; border-radius: 6px !important; overflow: hidden; display:flex; align-items:center; justify-content:center;
}
.color-stats-collapsed .color-header { padding: 0; justify-content: center; width:100%; height:100%; }
.color-stats-collapsed .color-title, .color-stats-collapsed .color-divider, .color-stats-collapsed .controls-box, .color-stats-collapsed .color-list-scroll { display:none !important; }
.btn-square-max { width:20px; height:20px; border-radius:4px; border:1.5px solid white !important; background:transparent !important; display:inline-flex; align-items:center; justify-content:center; padding:0; touch-action: none; }
.btn-square-min { width:28px; height:28px; border-radius:4px; border:1.5px solid white !important; background:transparent !important; display:inline-flex; align-items:center; justify-content:center; padding:0; font-size:16px; line-height:1; }
.custom-scroll-track { position:absolute; right:6px; width:16px; display:block; box-sizing:border-box; z-index:10001; pointer-events:auto; }
.custom-scroll-btn { position:absolute; left:0; right:0; height:18px; display:flex; align-items:center; justify-content:center; font-size:10px; user-select:none; cursor:pointer; background: rgba(255,255,255,0.02); border-radius:4px; }
.custom-scroll-btn.up { top:0; } .custom-scroll-btn.down { bottom:0; }
.custom-scroll-thumb { position:absolute; left:0; right:0; border-radius:8px; background: rgba(255,255,255,0.12); cursor:grab; min-height:20px; box-sizing:border-box; transition: background 120ms ease; }
.custom-scroll-thumb:active { cursor:grabbing; background: rgba(255,255,255,0.18); }
`;
document.head.appendChild(styleTag);

// HEADER e botões
const header = document.createElement('div');
header.className = 'color-header';
header.style.width = '100%';
header.style.boxSizing = 'border-box';
const title = document.createElement('div'); title.className = 'color-title'; title.textContent = 'Tabela de Cores'; header.appendChild(title);
const minimizeBtn = document.createElement('button');
minimizeBtn.className = 'minimize-btn btn-square-min';
minimizeBtn.title = 'Minimizar';
minimizeBtn.style.pointerEvents = 'auto';
minimizeBtn.innerHTML = '-';
header.appendChild(minimizeBtn);
colorStatsContainer.appendChild(header);

const divider = document.createElement('div'); divider.className = 'color-divider'; colorStatsContainer.appendChild(divider);
const controlsBox = document.createElement('div'); controlsBox.className = 'controls-box';
Object.assign(controlsBox.style, { padding: '6px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' });
controlsBox.style.pointerEvents = 'auto'; colorStatsContainer.appendChild(controlsBox);

const showAllWrapper = document.createElement('label'); showAllWrapper.className = 'controls-label'; showAllWrapper.style.cursor = 'pointer';
const showAllCheckbox = document.createElement('input'); showAllCheckbox.type = 'checkbox'; showAllCheckbox.checked = true; showAllCheckbox.style.marginRight = '6px'; showAllCheckbox.className = 'color-checkbox';
const showAllText = document.createElement('span'); showAllText.textContent = 'Mostrar todos';
showAllWrapper.appendChild(showAllCheckbox); showAllWrapper.appendChild(showAllText); controlsBox.appendChild(showAllWrapper);

const colorListWrapper = document.createElement('div'); colorListWrapper.className = 'color-list-scroll';
colorListWrapper.style.padding = '6px 8px 10px 8px'; colorListWrapper.style.position = 'relative'; colorListWrapper.style.overflowY = 'auto'; colorListWrapper.style.pointerEvents = 'auto';
colorStatsContainer.appendChild(colorListWrapper);
const colorList = document.createElement('div'); colorList.style.display = 'block'; colorListWrapper.appendChild(colorList);

// custom scrollbar
const customTrack = document.createElement('div'); customTrack.className = 'custom-scroll-track'; customTrack.style.position = 'absolute'; customTrack.style.pointerEvents = 'auto';
const customUpBtn = document.createElement('div'); customUpBtn.className = 'custom-scroll-btn up'; customUpBtn.textContent = '▲';
const customDownBtn = document.createElement('div'); customDownBtn.className = 'custom-scroll-btn down'; customDownBtn.textContent = '▼';
const customThumb = document.createElement('div'); customThumb.className = 'custom-scroll-thumb';
customTrack.appendChild(customUpBtn); customTrack.appendChild(customThumb); customTrack.appendChild(customDownBtn);
colorStatsContainer.appendChild(customTrack);

// popup nome da cor
const namePopup = document.createElement("div");
Object.assign(namePopup.style, { position: "fixed", left: "0px", top: "0px", transform: "translate(-50%,-100%)", backgroundColor: "rgba(0,0,0,0.9)", color: "white", padding: "6px 8px", borderRadius: "6px", fontSize: "12px", whiteSpace: "nowrap", display: "none", zIndex: "10001", pointerEvents: "none" });
document.body.appendChild(namePopup);

/* =========================
   Estado e controle UI
   ========================= */

const selectedColors = new Set();
let lastColorCounts = {};
let showAll = true;
let savedCollapsed = safeLocalStorageGet('overlay_color_list_collapsed');
let listVisible = savedCollapsed === null ? false : (savedCollapsed === '0');
let initialSelectionDone = false;

/* debounce / merge updates */
let pendingColorCounts = null;
let uiDebounceTimer = null;

function scheduleColorUIUpdate(newCounts, wrongPixels, totalTarget) {
    pendingColorCounts = newCounts || {};
    if (typeof wrongPixels === 'number') {
        pixelCounter.textContent = `Pixeis restantes: ${wrongPixels}`;
        const percentage = totalTarget === 0 ? "100,00" : (((totalTarget - wrongPixels) / totalTarget) * 100).toFixed(2).replace(".", ",");
        percentageCounter.textContent = `Progresso atual: ${percentage}%`;
    }
    if (uiDebounceTimer) clearTimeout(uiDebounceTimer);
    uiDebounceTimer = setTimeout(() => {
        lastColorCounts = Object.fromEntries(Object.entries(pendingColorCounts || {}).filter(([,c])=>c>0));
        if (showAll) {
            for (const k of Object.keys(lastColorCounts)) selectedColors.add(k);
        }
        renderColorListImmediate();
        uiDebounceTimer = null;
    }, UI_DEBOUNCE_MS);
}

/* =========================
   Detecção global touch start/move/end para diferenciar swipe/tap
   ========================= */

let globalTouch = { startX:0, startY:0, startTime:0, isSwipe:false };
document.addEventListener('touchstart', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    globalTouch.startX = t.clientX; globalTouch.startY = t.clientY; globalTouch.startTime = Date.now(); globalTouch.isSwipe = false;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
    if (!e.touches || !e.touches[0]) return;
    const t = e.touches[0];
    if (Math.abs(t.clientX - globalTouch.startX) > TOUCH_SWIPE_THRESHOLD || Math.abs(t.clientY - globalTouch.startY) > TOUCH_SWIPE_THRESHOLD) {
        globalTouch.isSwipe = true;
    }
}, { passive: true });

document.addEventListener('touchend', (e) => {
    setTimeout(()=>{ globalTouch.isSwipe = false; }, 50);
}, { passive: true });

/* =========================
   Funções de render / interação
   ========================= */

function rgbToHex(r,g,b){ const toHex=(v)=>v.toString(16).padStart(2,'0'); return `#${toHex(r)}${toHex(g)}${toHex(b)}`; }

/* -------------------------
   Mapa de nomes de cores (maior, vindo do script anterior)
   chaves em lowercase
   ------------------------- */
const colorNameMap = {
"#000000":"Black","#3c3c3c":"Dark gray","#787878":"Gray","#aaaaaa":"Medium gray","#d2d2d2":"Light gray","#ffffff":"White",
"#600018":"Deep red","#a50e1e":"Dark red","#ed1c24":"Red","#fa8072":"Light red",
"#e45c1a":"Dark orange","#ff7f27":"Orange","#f6aa09":"Gold","#f9dd3b":"Yellow","#fffabc":"Light yellow",
"#9c8431":"Dark goldenrod","#c5ad31":"Goldenrod","#e8d45f":"Light goldenrod",
"#4a6b3a":"Dark olive","#5a944a":"Olive","#84c573":"Light olive",
"#0eb968":"Dark green","#13e67b":"Green","#87ff5e":"Light green",
"#0c816e":"Dark teal","#10aea6":"Teal","#13e1be":"Light teal",
"#0f799f":"Dark cyan","#60f7f2":"Cyan","#bbfaf2":"Light cyan",
"#28509e":"Dark blue","#4093e4":"Blue","#7dc7ff":"Light blue",
"#4d31b8":"Dark indigo","#6b50f6":"Indigo","#99b1fb":"Light indigo",
"#4a4284":"Dark slate blue","#7a71c4":"Slate blue","#b5aef1":"Light slate blue",
"#780c99":"Dark purple","#aa38b9":"Purple","#e09ff9":"Light purple",
"#cb007a":"Dark pink","#ec1f80":"Pink","#f38da9":"Light pink",
"#9b5249":"Dark peach","#d18078":"Peach","#fab6a4":"Light peach",
"#684634":"Dark brown","#95682a":"Brown","#dba463":"Light brown",
"#7b6352":"Dark tan","#9c846b":"Tan","#d6b594":"Light tan",
"#d18051":"Dark beige","#f8b277":"Beige","#ffc5a5":"Light beige",
"#6d643f":"Dark stone","#948c6b":"Stone","#cdc59e":"Light stone",
"#333941":"Dark slate","#6d758d":"Slate","#b3b9d1":"Light slate"
};

/* -------------------------
Attaches handlers to show popup names (pointer + touch)
------------------------- */
function attachNameHandlers(el, hex) {

    el.addEventListener('pointerenter', (ev) => {
        if (ev.pointerType === 'touch') return;
        clearPopupTimers();
        showColorName(hex, el.getBoundingClientRect());
    });

    el.addEventListener('pointerleave', (ev) => {
        if (ev.pointerType === 'touch') return;
        clearPopupTimers();
        popupHideTimeout = setTimeout(()=>{ hideColorName(); }, 120);
    });

    el.addEventListener('click', (ev) => {
        if (ev.pointerType === 'touch') return;
        clearPopupTimers();
        showColorName(hex, el.getBoundingClientRect(), 1200);
    });

    let localTouchStartTime = 0;

    el.addEventListener('touchstart', (ev) => {
        if (!ev.touches || !ev.touches[0]) return;
        localTouchStartTime = Date.now();
    }, { passive: true });

    el.addEventListener('touchend', (ev) => {
        const dur = Date.now() - localTouchStartTime;
        if (globalTouch.isSwipe) return;
        if (dur > TOUCH_TAP_MAX_MS) return;
        clearPopupTimers();
        showColorName(hex, el.getBoundingClientRect(), 1200);
    }, { passive: true });

}

let popupShowTimeout = null, popupHideTimeout = null, popupPersistentTimeout = null;

function clearPopupTimers(){
    if (popupShowTimeout){ clearTimeout(popupShowTimeout); popupShowTimeout = null; }
    if (popupHideTimeout){ clearTimeout(popupHideTimeout); popupHideTimeout = null; }
    if (popupPersistentTimeout){ clearTimeout(popupPersistentTimeout); popupPersistentTimeout = null; }
}

function showColorName(hex, rect, persistForMs = 0) {

    clearPopupTimers();

    namePopup.textContent = colorNameMap[hex] || hex;

    const left = rect.left + rect.width/2;

    let top = rect.top - 6;

    if (top < 8) top = rect.top + rect.height + 6;

    namePopup.style.left = `${left}px`; namePopup.style.top = `${top}px`; namePopup.style.display = 'block';

    if (persistForMs > 0) popupPersistentTimeout = setTimeout(()=>{ hideColorName(); }, persistForMs);

}

function hideColorName(){ clearPopupTimers(); namePopup.style.display = 'none'; }

/* =========================
   renderColorListImmediate
   ========================= */

function renderColorListImmediate() {

    colorList.innerHTML = "";

    const entries = Object.entries(lastColorCounts || {}).filter(([,cnt]) => cnt > 0).sort((a,b)=>b[1]-a[1]);

    if (!initialSelectionDone && showAll) {

        for (const [key] of entries) selectedColors.add(key);

        initialSelectionDone = true;

    }

    for (const [key, count] of entries) {

        const [r,g,b] = key.split(",").map(Number);

        const hex = rgbToHex(r,g,b);

        const item = document.createElement('div');

        item.className = 'color-item'; item.style.pointerEvents = 'auto';

        const colorSquare = document.createElement('div'); colorSquare.className = 'color-square';

        colorSquare.style.backgroundColor = `rgb(${r}, ${g}, ${b})`; colorSquare.title = colorNameMap[hex] || '';

        const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'color-checkbox';

        checkbox.checked = selectedColors.has(key);

        checkbox.addEventListener('change', (e)=> {

            if (e.target.checked) selectedColors.add(key); else selectedColors.delete(key);

            const allKeys = Object.keys(lastColorCounts).filter(k=>lastColorCounts[k]>0);

            showAll = allKeys.length > 0 && allKeys.every(k=>selectedColors.has(k));

            showAllCheckbox.checked = !!showAll;

            refreshChunks();

            scheduleColorUIUpdate(lastColorCounts);

        });

        const label = document.createElement('span'); label.className = 'color-count'; label.textContent = `${count}`;

        attachNameHandlers(colorSquare, hex); attachNameHandlers(label, hex);

        item.appendChild(colorSquare); item.appendChild(checkbox); item.appendChild(label);

        colorList.appendChild(item);

    }

    if (Object.keys(lastColorCounts).length === 0) {

        const aviso = document.createElement("div"); aviso.textContent = "Sem cores detectadas ainda."; aviso.style.fontSize = "10px"; aviso.style.opacity = "0.85"; aviso.style.marginTop = "4px";

        colorList.appendChild(aviso);

    }

    needsLayoutUpdate = true;

    scheduleUIUpdate();

}

/* ================ fim PARTE 1/2 ================ */

/* =========================
   CONTINUAÇÃO: bindings, fetch proxy que usa o worker, UI helpers e finalização
   ========================= */

/* =========================
   Debounce/Layout scheduler
   ========================= */

let rafScheduled = false;

let needsRenderColors = false;

let needsLayoutUpdate = false;

function scheduleUIUpdate() {

    if (rafScheduled) return;

    rafScheduled = true;

    requestAnimationFrame(() => {

        rafScheduled = false;

        if (needsLayoutUpdate) {

            needsLayoutUpdate = false;

            try { updateListMaxHeight(); updateCustomTrackSize(); updateCustomThumb(); } catch (e) {}

        }

        if (needsRenderColors) {

            needsRenderColors = false;

            try { renderColorListImmediate(); } catch (e) {}

        }

    });

}

/* =========================
   resize/scroll helpers para o painel
   ========================= */

function parsePx(v){ return Math.round(parseFloat(v) || 0); }

function updateListMaxHeight(){

    try {

        let containerH = colorStatsContainer.clientHeight || Math.round(colorStatsContainer.getBoundingClientRect().height || 0);

        const headerH = header.offsetHeight || Math.round(header.getBoundingClientRect().height || 0);

        const dividerH = divider.offsetHeight || Math.round(divider.getBoundingClientRect().height || 0);

        const controlsH = controlsBox.offsetHeight || Math.round(controlsBox.getBoundingClientRect().height || 0);

        const extra = 8;

        if (!containerH || containerH < 80) {

            const vp = Math.round(window.innerHeight || document.documentElement.clientHeight || 600);

            containerH = Math.max(280, Math.round(vp * 0.30));

        }

        let maxH = Math.max(0, containerH - headerH - dividerH - controlsH - extra);

        const MIN_LIST_HEIGHT = 280;

        if (maxH < MIN_LIST_HEIGHT) maxH = Math.max(MIN_LIST_HEIGHT, Math.round(window.innerHeight * 0.25));

        colorListWrapper.style.maxHeight = `${maxH}px`;

        colorListWrapper.style.display = listVisible ? 'block' : colorListWrapper.style.display || 'block';

    } catch (e) {

        colorListWrapper.style.maxHeight = '420px';

        colorListWrapper.style.display = 'block';

    }

}

function updateCustomTrackSize(){

    try {

        const cs = getComputedStyle(colorListWrapper);

        const padTop = parsePx(cs.paddingTop);

        const padBottom = parsePx(cs.paddingBottom);

        const wrapperH = colorListWrapper.clientHeight || Math.round(colorListWrapper.getBoundingClientRect().height || 0);

        const trackInnerH = Math.max(0, wrapperH - padTop - padBottom);

        const wrapperRect = colorListWrapper.getBoundingClientRect();

        const containerRect = colorStatsContainer.getBoundingClientRect();

        const topRel = Math.round(wrapperRect.top - containerRect.top + padTop);

        customTrack.style.top = `${topRel}px`;

        customTrack.style.height = `${trackInnerH}px`;

        const sh = colorListWrapper.scrollHeight;

        const ch = colorListWrapper.clientHeight;

        customTrack.style.display = (sh <= ch) ? 'none' : 'block';

    } catch (e) {

        customTrack.style.top = `6px`;

        customTrack.style.height = `${Math.max(0, colorListWrapper.clientHeight - 12)}px`;

    }

}

function updateCustomThumb(){

    updateCustomTrackSize();

    const trackRect = customTrack.getBoundingClientRect();

    const ch = colorListWrapper.clientHeight;

    const sh = colorListWrapper.scrollHeight;

    const upH = customUpBtn.offsetHeight || 18;

    const downH = customDownBtn.offsetHeight || 18;

    const trackH = Math.max(0, Math.round(trackRect.height));

    const available = Math.max(0, trackH - upH - downH);

    if (sh <= ch || available <= 0) { customThumb.style.height = `${Math.max(0, available)}px`; customThumb.style.top = `${upH}px`; customThumb.style.display = sh <= ch ? 'none' : 'block'; return; }

    customThumb.style.display = 'block';

    const fractionVisible = ch / sh;

    const thumbH = Math.max(20, Math.round(available * fractionVisible));

    customThumb.style.height = `${thumbH}px`;

    const maxScroll = Math.max(0, sh - ch);

    const scrollTop = Math.max(0, Math.min(colorListWrapper.scrollTop, maxScroll));

    const movable = Math.max(0, available - thumbH);

    const frac = maxScroll > 0 ? (scrollTop / maxScroll) : 0;

    const topPos = Math.round(frac * movable);

    customThumb.style.top = `${upH + topPos}px`;

}

colorListWrapper.addEventListener('scroll', ()=>{ updateCustomThumb(); }, { passive: true });

customUpBtn.addEventListener('click', ()=>{ const delta = Math.round(colorListWrapper.clientHeight * 0.6) || 60; colorListWrapper.scrollBy({ top: -delta, behavior: 'smooth' }); });

customDownBtn.addEventListener('click', ()=>{ const delta = Math.round(colorListWrapper.clientHeight * 0.6) || 60; colorListWrapper.scrollBy({ top: delta, behavior: 'smooth' }); });

/* drag thumb */

let dragging = false, dragStartY = 0, startScrollTop = 0;

const getPointerClientY = (ev) => (typeof ev.clientY === 'number') ? ev.clientY : (ev.touches && ev.touches[0] && ev.touches[0].clientY) || 0;

const onPointerMoveWhileDragging = (ev) => {

    if (!dragging) return;

    ev.preventDefault && ev.preventDefault();

    const trackRect = customTrack.getBoundingClientRect(); const upH = customUpBtn.offsetHeight || 18; const downH = customDownBtn.offsetHeight || 18;

    const trackH = Math.max(0, Math.round(trackRect.height)); const available = Math.max(0, trackH - upH - downH);

    const sh = colorListWrapper.scrollHeight; const ch = colorListWrapper.clientHeight; const thumbH = customThumb.offsetHeight;

    const clientY = getPointerClientY(ev); const dy = clientY - dragStartY; const scrollable = Math.max(0, sh - ch);

    const movable = Math.max(1, Math.max(0, available - thumbH)); const deltaScroll = Math.round((dy / movable) * scrollable);

    colorListWrapper.scrollTop = Math.max(0, Math.min(startScrollTop + deltaScroll, scrollable));

};

const stopDragging = (ev) => {

    if (!dragging) return; dragging = false;

    try { document.removeEventListener('pointermove', onPointerMoveWhileDragging); document.removeEventListener('pointerup', stopDragging); document.removeEventListener('touchmove', onPointerMoveWhileDragging); document.removeEventListener('touchend', stopDragging); } catch (e) {}

};

customThumb.addEventListener('pointerdown', (ev) => { ev.preventDefault && ev.preventDefault(); dragging = true; dragStartY = ev.clientY || 0; startScrollTop = colorListWrapper.scrollTop; document.addEventListener('pointermove', onPointerMoveWhileDragging, { passive:false }); document.addEventListener('pointerup', stopDragging); });

customThumb.addEventListener('touchstart', (ev) => { ev.preventDefault && ev.preventDefault(); const t = ev.touches && ev.touches[0]; dragging = true; dragStartY = t ? t.clientY : 0; startScrollTop = colorListWrapper.scrollTop; document.addEventListener('touchmove', onPointerMoveWhileDragging, { passive:false }); document.addEventListener('touchend', stopDragging); });

/* Mutation observer para lista */

const listObserver = new MutationObserver(()=>{ needsLayoutUpdate = true; scheduleUIUpdate(); });

listObserver.observe(colorList, { childList: true, subtree: true });

function refreshChunks(){ /* placeholder */ }

/* =========================
   Min width dinâmico: mínimo = 1/3 da largura atual
   ========================= */

function ensureMinWidth() {

    try {

        const rect = colorStatsContainer.getBoundingClientRect();

        const curWidth = Math.max(rect.width || 220, 220);

        const minW = Math.round(curWidth / 3);

        colorStatsContainer.style.minWidth = `${minW}px`;

    } catch (e) {

        colorStatsContainer.style.minWidth = `${Math.round(220/3)}px`;

    }

}

/* =========================
   Visibilidade / minimizar-maximizar (mantém 30x30 quando minimizado)
   ========================= */

function applyVisibility() {

    if (listVisible) {

        colorStatsContainer.classList.remove('color-stats-collapsed');

        colorStatsContainer.style.minWidth = colorStatsContainer.style.minWidth || '220px';

        colorStatsContainer.style.maxWidth = '320px';

        colorStatsContainer.style.maxHeight = '420px';

        colorListWrapper.style.display = 'block'; controlsBox.style.display = 'flex'; divider.style.display = 'block'; title.style.display = 'block';

        minimizeBtn.classList.remove('btn-square-max'); minimizeBtn.classList.add('btn-square-min'); minimizeBtn.innerHTML = '-'; minimizeBtn.title = 'Minimizar'; header.classList.remove('minimized-centered');

    } else {

        colorStatsContainer.classList.add('color-stats-collapsed');

        colorListWrapper.style.display = 'none'; controlsBox.style.display = 'none'; divider.style.display = 'none'; title.style.display = 'none';

        minimizeBtn.classList.remove('btn-square-min'); minimizeBtn.classList.add('btn-square-max'); minimizeBtn.innerHTML = ''; minimizeBtn.title = 'Maximizar'; header.classList.add('minimized-centered');

    }

    ensureMinWidth();

    needsLayoutUpdate = true;

    scheduleUIUpdate();

}

minimizeBtn.addEventListener('click', (e)=>{ e.stopPropagation && e.stopPropagation(); listVisible = !listVisible; safeLocalStorageSet('overlay_color_list_collapsed', listVisible ? '0' : '1'); applyVisibility(); });

showAllCheckbox.addEventListener('change', (e)=>{ setAllSelected(e.target.checked); });

function setAllSelected(flag) {

    if (!flag) {

        selectedColors.clear(); showAll = false; initialSelectionDone = true; showAllCheckbox.checked = false; refreshChunks(); scheduleColorUIUpdate(lastColorCounts);

        return;

    }

    selectedColors.clear(); for (const key of Object.keys(lastColorCounts)) selectedColors.add(key); showAll = true; showAllCheckbox.checked = true; refreshChunks(); scheduleColorUIUpdate(lastColorCounts);

}

/* =========================
   FETCH PROXY: intercepta requests de chunks e despacha para worker OU main-thread
   Protegido por try/catch caso sobrescrever fetch não seja permitido.
   ========================= */

try {

    const originalFetch = fetch;

    fetch = new Proxy(originalFetch, {

        apply: async (target, thisArg, argList) => {

            const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];

            let url;

            try { url = new URL(urlString); } catch (e) { return target.apply(thisArg, argList); }

            if (overlayMode === "overlay") {

                if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {

                    for (const obj of overlays) {

                        if (url.pathname.endsWith(obj.chunksString)) {

                            const originalResponse = await target.apply(thisArg, argList);

                            const originalBlob = await originalResponse.blob();

                            const overlayCopy = obj.imageData.data.slice();

                            const overlayBuffer = overlayCopy.buffer;

                            if (pixelWorker) {

                                const id = ++workerReqId;

                                const promise = new Promise((resolve, reject) => {

                                    const timeout = setTimeout(()=>{ pendingWorker.delete(id); reject(new Error("Worker timed out")); }, 15000);

                                    pendingWorker.set(id, {

                                        resolve: (data)=>{ clearTimeout(timeout); resolve(data); },

                                        reject: (err)=>{ clearTimeout(timeout); reject(err); }

                                    });

                                });

                                try {

                                    pixelWorker.postMessage({

                                        type: 'process',

                                        id,

                                        blob: originalBlob,

                                        overlayBuffer,

                                        overlayWidth: obj.imageData.width || CHUNK_WIDTH,

                                        overlayHeight: obj.imageData.height || CHUNK_HEIGHT,

                                        selectedColors: Array.from(selectedColors)

                                    }, [overlayBuffer]);

                                } catch (e) {

                                    pixelWorker.postMessage({

                                        type: 'process',

                                        id,

                                        blob: originalBlob,

                                        overlayBuffer,

                                        overlayWidth: obj.imageData.width || CHUNK_WIDTH,

                                        overlayHeight: obj.imageData.height || CHUNK_HEIGHT,

                                        selectedColors: Array.from(selectedColors)

                                    });

                                }

                                let result;

                                try {

                                    result = await promise;

                                } catch (err) {

                                    console.error("Worker processing failed:", err);

                                    return originalResponse;

                                }

                                scheduleColorUIUpdate(result.colorCounts || {}, result.wrongPixels, result.totalTargetPixels);

                                return new Response(result.blob, { headers: { "Content-Type": "image/png" } });

                            } else {

                                let result;

                                try {

                                    result = await processInMainThread(originalBlob, overlayBuffer, obj.imageData.width || CHUNK_WIDTH, obj.imageData.height || CHUNK_HEIGHT, Array.from(selectedColors));

                                } catch (err) {

                                    console.error("Main-thread processing failed:", err);

                                    return originalResponse;

                                }

                                scheduleColorUIUpdate(result.colorCounts || {}, result.wrongPixels, result.totalTargetPixels);

                                return new Response(result.blob, { headers: { "Content-Type": "image/png" } });

                            }

                        }

                    }

                }

            } else if (overlayMode === "chunks") {

                if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {

                    const parts = url.pathname.split("/");

                    const [chunk1, chunk2] = [parts.at(-2), parts.at(-1).split(".")[0]];

                    const canvas = createSafeCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);

                    const ctx = canvas.getContext("2d", { willReadFrequently: true });

                    ctx.strokeStyle = 'red'; ctx.lineWidth = 1; ctx.strokeRect(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);

                    ctx.font = '30px Arial'; ctx.fillStyle = 'red'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

                    ctx.fillText(chunk1 + ", " + chunk2, CHUNK_WIDTH / 2, CHUNK_HEIGHT / 2);

                    let mergedBlob;

                    if (canvas instanceof OffscreenCanvas && typeof canvas.convertToBlob === 'function') {

                        mergedBlob = await canvas.convertToBlob();

                    } else {

                        mergedBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));

                    }

                    return new Response(mergedBlob, { headers: { "Content-Type": "image/png" } });

                }

            }

            return target.apply(thisArg, argList);

        }

    });

} catch (e) {

    console.warn("Não foi possível sobrescrever fetch; o script continuará, mas a funcionalidade de overlay pode ser limitada.", e);

}

/* =========================
   restante: load helpers, event handlers e patch UI
   ========================= */

/* observer para patch UI (botão de trocar overlayMode) */

function patchUI() {

    if (document.getElementById("overlay-blend-button")) return;

    let blendButton = document.createElement("button");

    blendButton.id = "overlay-blend-button";

    blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);

    blendButton.style.backgroundColor = "#0e0e0e7f";

    blendButton.style.color = "white";

    blendButton.style.border = "solid"; blendButton.style.borderColor = "#1d1d1d7f";

    blendButton.style.borderRadius = "4px"; blendButton.style.padding = "5px 10px"; blendButton.style.cursor = "pointer";

    blendButton.style.backdropFilter = "blur(2px)";

    blendButton.addEventListener("click", () => {

        overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];

        blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);

    });

    const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");

    if (buttonContainer) buttonContainer.appendChild(blendButton);

}

const observer = new MutationObserver(()=>{ patchUI(); });

try {

    const rootCandidate = document.querySelector("div.gap-4:nth-child(1)");

    observer.observe(rootCandidate || document.body, { childList: true, subtree: true });

} catch (e) { observer.observe(document.body, { childList: true, subtree: true }); }

patchUI();

/* =========================
   HELPERS ADICIONAIS (atalhos)
   ========================= */

function isEditableElement(el) {

    if (!el) return false;

    const tag = el.tagName && el.tagName.toUpperCase();

    if (tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return true;

    if (tag === 'SELECT') return true;

    return false;

}

function simulateKeyPress(keyChar) {

    try {

        const kd = new KeyboardEvent('keydown', { key: keyChar, code: `Key${keyChar.toUpperCase()}`, keyCode: keyChar.toUpperCase().charCodeAt(0), which: keyChar.toUpperCase().charCodeAt(0), bubbles: true, cancelable: true });

        const ku = new KeyboardEvent('keyup',   { key: keyChar, code: `Key${keyChar.toUpperCase()}`, keyCode: keyChar.toUpperCase().charCodeAt(0), which: keyChar.toUpperCase().charCodeAt(0), bubbles: true, cancelable: true });

        document.dispatchEvent(kd);

        setTimeout(()=>document.dispatchEvent(ku), 15);

    } catch (e) {

        try {

            document.dispatchEvent(new KeyboardEvent('keydown', { key: keyChar, bubbles: true }));

            setTimeout(()=>document.dispatchEvent(new KeyboardEvent('keyup', { key: keyChar, bubbles: true })), 15);

        } catch (ee) {}

    }

}

function isVisible(el) {

    if (!el) return false;

    if (!(el instanceof Element)) return false;

    const rect = el.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) return false;

    const style = getComputedStyle(el);

    if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity || '1') === 0) return false;

    return true;

}

/* --------------------------

   findPaletteButton

   -------------------------- */

function findPaletteButton() {

    try {

        const nodes = Array.from(document.querySelectorAll('div.flex.items-center.gap-2'));

        const found = nodes.find(el => {

            if (!el) return false;

            const txt = (el.textContent || '').trim();

            return txt.length > 0 && txt.startsWith('Pintar');

        });

        if (!found) return null;

        const btn = found.querySelector('button') || found.querySelector('div[role="button"]') || found;

        return btn || found;

    } catch (e) { return null; }

}

/* =========================

   Bind dos novos atalhos:

   Middle click -> conta-gotas (svg.size-4.5)

   Enter -> toggle paleta (botão "Pintar")  e **fecha** paleta quando ela já estiver aberta

   ========================= */

document.addEventListener('mousedown', function(e){

    try {

        if (e.button === 1) {

            if (isEditableElement(document.activeElement)) return;

            e.preventDefault && e.preventDefault();

            e.stopPropagation && e.stopPropagation();

            const svg = document.querySelector('svg.size-4\\.5');

            const target = svg ? (svg.closest('button') || svg.closest('div')) : null;

            if (target && isVisible(target)) {

                target.click();

                return;

            }

            const paintBtn = findPaletteButton();

            if (paintBtn) {

                paintBtn.click();

                setTimeout(()=>{

                    try {

                        const svg2 = document.querySelector('svg.size-4\\.5');

                        const target2 = svg2 ? (svg2.closest('button') || svg2.closest('div')) : null;

                        if (target2 && isVisible(target2)) target2.click();

                    } catch(_) {}

                }, 300);

            }

        }

    } catch (err) {}

}, { passive: false, capture: true });

// ===== Replaced Enter shortcut handlers (robusto contra "zoom") =====
(function(){
  function enterKeyHandler(e){
    try{
      // só nos interessa Enter sem modificadores
      if (!(e.key === 'Enter' || e.keyCode === 13)) return;
      if (isEditableElement(document.activeElement)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return; // não interferir com combos

      // previne tudo o mais cedo possível
      if (e.preventDefault) e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (e.stopPropagation) e.stopPropagation();

      const paintBtn = findPaletteButton();
      if (!paintBtn) return;

      // pega TODOS os botões com a classe e seleciona o ÚLTIMO (provavelmente o X da paleta)
      const closeButtons = document.querySelectorAll('button.btn.btn-circle.btn-sm');
      const closeIcon = (closeButtons && closeButtons.length) ? closeButtons[closeButtons.length - 1] : null;
      const isOpen = closeIcon && isVisible(closeIcon);

      if (isOpen) {
        try { closeIcon.click(); } catch(_) {
          // fallback: se falhar, tenta clicar no paintBtn (algumas UIs fazem toggle)
          try { paintBtn.click(); } catch(_) {}
        }
        // evitar foco residual que possa disparar outras ações
        setTimeout(()=>{
          try { if (document.activeElement && typeof document.activeElement.blur === 'function') document.activeElement.blur(); } catch(e){}
        }, 30);
      } else {
        // abrir a paleta
        try { paintBtn.click(); } catch(_) {}
      }
    }catch(err){}
  }

  function enterKeyUpBlocker(e){
    try{
      if (!(e.key === 'Enter' || e.keyCode === 13)) return;
      if (isEditableElement(document.activeElement)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.preventDefault) e.preventDefault();
      if (e.stopImmediatePropagation) e.stopImmediatePropagation();
      if (e.stopPropagation) e.stopPropagation();
    }catch(err){}
  }

  // usamos capture:true e passive:false para ter prioridade e poder prevenir defaults
  document.addEventListener('keydown', enterKeyHandler, { passive: false, capture: true });
  document.addEventListener('keyup', enterKeyUpBlocker, { passive: false, capture: true });
})();

/* =========================

   ADIÇÃO: Long-press (1s) para ativar BORRACHA e desmarcar pixel (mobile)

   ========================= */

const LONG_PRESS_MS = 1000;

const LONG_PRESS_MOVE_TOLERANCE = 12;

let _lpTimer = null;

let _lpStartX = 0;

let _lpStartY = 0;

let _lpTarget = null;

function getEraserButtonByPath() {

    try {

        const candidates = Array.from(document.querySelectorAll('button.btn.btn-lg.btn-square.sm\\:btn-xl.shadow-md'));

        for (const b of candidates) {

            const path = b.querySelector('svg.size-5 path');

            const d = path && path.getAttribute && path.getAttribute('d');

            if (typeof d === 'string' && d.startsWith('M690')) {

                return b;

            }

        }

        const svgs = Array.from(document.querySelectorAll('svg.size-5'));

        for (const s of svgs) {

            const p = s.querySelector('path');

            const d = p && p.getAttribute && p.getAttribute('d');

            if (typeof d === 'string' && d.startsWith('M690')) {

                return s.closest('button') || s.closest('div') || null;

            }

        }

    } catch (e) {}

    return null;

}

function findCanvasAtPoint(x,y) {

    try {

        let el = document.elementFromPoint(x, y);

        if (el) {

            if (el.tagName && el.tagName.toLowerCase() === 'canvas') return el;

            const c = el.closest && el.closest('canvas');

            if (c && isVisible(c)) return c;

        }

        const canvases = Array.from(document.querySelectorAll('canvas')).filter(isVisible);

        for (const cv of canvases) {

            const r = cv.getBoundingClientRect();

            if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return cv;

        }

        if (canvases.length) {

            canvases.sort((a,b)=>{

                const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();

                return (rb.width*rb.height) - (ra.width*ra.height);

            });

            return canvases[0];

        }

    } catch (e) {}

    return null;

}

async function dispatchPointerClickToCanvas(canvas, clientX, clientY) {

    if (!canvas) return false;

    const rect = canvas.getBoundingClientRect();

    const offsetX = clientX - rect.left;

    const offsetY = clientY - rect.top;

    try {

        const pd = new PointerEvent('pointerdown', { bubbles:true, cancelable:true, composed:true, pointerId:1, pointerType:'touch', clientX, clientY, offsetX, offsetY, pressure:0.5 });

        canvas.dispatchEvent(pd);

    } catch(e){}

    try { canvas.dispatchEvent(new MouseEvent('mousedown', { bubbles:true, cancelable:true, clientX, clientY, button:0 })); } catch(e){}

    try { await new Promise(r => setTimeout(r, 18)); } catch(e){}

    try { canvas.dispatchEvent(new PointerEvent('pointerup', { bubbles:true, cancelable:true, composed:true, pointerId:1, pointerType:'touch', clientX, clientY, offsetX, offsetY, pressure:0 })); } catch(e){}

    try { canvas.dispatchEvent(new MouseEvent('mouseup', { bubbles:true, cancelable:true, clientX, clientY, button:0 })); } catch(e){}

    try { canvas.dispatchEvent(new MouseEvent('click', { bubbles:true, cancelable:true, clientX, clientY, button:0 })); } catch(e){}

    return true;

}

function clearLongPressTimer() {

    if (_lpTimer) { clearTimeout(_lpTimer); _lpTimer = null; }

}

document.addEventListener('touchstart', function(e){

    try {

        if (!e.touches || !e.touches[0]) return;

        if (isEditableElement(document.activeElement)) return;

        if (colorStatsContainer && colorStatsContainer.contains(e.target)) return;

        const t = e.touches[0];

        _lpStartX = t.clientX;

        _lpStartY = t.clientY;

        _lpTarget = e.target;

        clearLongPressTimer();

        _lpTimer = setTimeout(async () => {

            if (globalTouch.isSwipe) { clearLongPressTimer(); return; }

            if (colorStatsContainer && colorStatsContainer.contains(_lpTarget)) { clearLongPressTimer(); return; }

            const eraserBtn = getEraserButtonByPath();

            if (!eraserBtn) { clearLongPressTimer(); return; }

            try { eraserBtn.click(); } catch(e){}

            await new Promise(r => setTimeout(r, 80));

            const canvas = findCanvasAtPoint(_lpStartX, _lpStartY);

            if (canvas) {

                try { await dispatchPointerClickToCanvas(canvas, _lpStartX, _lpStartY); } catch(e){}

            } else {

                try {

                    const el = document.elementFromPoint(_lpStartX, _lpStartY);

                    if (el && !colorStatsContainer.contains(el)) { try { el.click(); } catch(e){} }

                } catch(e){}

            }

            await new Promise(r => setTimeout(r, 90));

            try { eraserBtn.click(); } catch(e){}

            clearLongPressTimer();

        }, LONG_PRESS_MS);

    } catch (err) {

        clearLongPressTimer();

    }

}, { passive: true });

document.addEventListener('touchmove', function(e){

    try {

        if (!e.touches || !e.touches[0]) { clearLongPressTimer(); return; }

        const t = e.touches[0];

        const dx = Math.abs(t.clientX - _lpStartX);

        const dy = Math.abs(t.clientY - _lpStartY);

        if (dx > LONG_PRESS_MOVE_TOLERANCE || dy > LONG_PRESS_MOVE_TOLERANCE) {

            clearLongPressTimer();

        }

    } catch (err) {

        clearLongPressTimer();

    }

}, { passive: true });

document.addEventListener('touchend', function(e){

    clearLongPressTimer();

}, { passive: true });

/* =========================

   ADIÇÃO: lógica de NOTIFICAÇÃO (Onça) — com safeNotify + localStorage protection

   ========================= */

/* estado notificação */

let onca_lastValue = "";

let onca_lastZeroTime = 0;

let onca_notifiedFor = null;

const ONCA_LOCAL_KEY = 'onca_notify_ts';

const ONCA_NOTIFY_DEBOUNCE_MS = 5000; // evita repetição entre abas

/* detecta (0:00) no DOM - observa mudanças */

const oncaDOMObserver = new MutationObserver(() => {

    const el = document.querySelector('span.w-7.text-xs');

    if (el) {

        const txt = (el.textContent || '').trim();

        if (txt === "(0:00)") {

            onca_lastZeroTime = Date.now();

        }

    }

});

try {

    oncaDOMObserver.observe(document.body, { childList: true, subtree: true, characterData: true });

} catch (e) { /* ignore */ }

/* função de envio de notificação segura */

function onca_sendNotification() {

    try {

        const now = Date.now();

        try {

            const last = parseInt(safeLocalStorageGet(ONCA_LOCAL_KEY) || '0', 10) || 0;

            if (now - last < ONCA_NOTIFY_DEBOUNCE_MS) return; // outra aba já notificou recentemente

            safeLocalStorageSet(ONCA_LOCAL_KEY, String(now));

        } catch (e) { /* ignore localStorage errors */ }

        const title = "Hora da onça beber água!";

        const opt = {

            body: "Tinta totalmente recarregada! 🔥",

            icon: "https://i.imgur.com/mz6eWey.png",

            timestamp: Date.now()

        };

        // Use both native notification (if possible) and in-page toast as fallback
        safeNotify(title, opt);
        // Also always show in-page toast to guarantee visibility on mobile
        showInPageNotification(title, opt.body, opt.icon, 7000);

    } catch (e) {

        // swallow

    }

}

/* hook fillText para detectar X/Y no canvas alvo */

const _origFillTextOnca = CanvasRenderingContext2D.prototype.fillText;

CanvasRenderingContext2D.prototype.fillText = function (text, x, y, maxWidth) {

    try {

        const canvas = this.canvas;

        if (!canvas) return _origFillTextOnca.apply(this, arguments);

        const dims = `[${canvas.width}x${canvas.height}]`;

        const txt = String(text).trim();

        // Verifica canvas do X/Y

        if (dims === "[134x39]" && /^\d+\/\d+$/.test(txt)) {

            const [curr, max] = txt.split("/").map(n => parseInt(n,10));

            const [lastCurr, lastMax] = onca_lastValue ? onca_lastValue.split("/").map(n => parseInt(n,10)) : [null, null];

            // detectar transição para full

            if (lastCurr !== null && lastCurr < lastMax && curr === max) {

                const diff = Date.now() - onca_lastZeroTime;

                if (diff >= 0 && diff <= 2000) {

                    // evitar notificar repetidamente para o mesmo valor

                    const keyFor = `${curr}/${max}@${canvas.width}x${canvas.height}`;

                    if (onca_notifiedFor !== keyFor) {

                        onca_notifiedFor = keyFor;

                        onca_sendNotification();

                    }

                }

            }

            // reset notified flag se voltar a gastar tinta

            if (curr < max) {

                onca_notifiedFor = null;

            }

            onca_lastValue = txt;

        }

    } catch (e) {

        // swallow

    }

    return _origFillTextOnca.apply(this, arguments);

};

/* =========================
   ADDED: MutationObserver que fecha automaticamente a paleta quando ela aparece
   (usa os seletores que você indicou e tenta clicar no botão de fechar dentro dela)
   ========================= */

(function(){
  // seletores que identificam a paleta (como você descreveu)
  const PALETTE_SELECTORS = ['.rounded-t-box.bg-base-100', '.relative.px-3'];
  // seletores para encontrar o botão de fechar dentro da paleta
  const CLOSE_BUTTON_SELECTOR = 'button.btn.btn-circle.btn-sm, button.btn.btn-circle, [aria-label="Fechar"], button[title="Fechar"], [data-testid="close"]';

  let lastAutoClose = 0;
  const AUTO_CLOSE_COOLDOWN = 350; // ms

  function tryPerformClick(el){
    if (!el) return false;
    try {
      el.click();
      return true;
    } catch (e) {
      // fallback para dispatch de eventos
    }
    try {
      const rect = el.getBoundingClientRect();
      const cx = Math.max(2, Math.floor(rect.left + 4));
      const cy = Math.max(2, Math.floor(rect.top + 4));
      el.dispatchEvent(new PointerEvent('pointerdown', {bubbles:true, clientX:cx, clientY:cy}));
      el.dispatchEvent(new PointerEvent('pointerup', {bubbles:true, clientX:cx, clientY:cy}));
      el.dispatchEvent(new MouseEvent('click', {bubbles:true, clientX:cx, clientY:cy}));
      return true;
    } catch(e){}
    // last resort: simple Event('click')
    try { el.dispatchEvent(new Event('click', {bubbles:true, cancelable:true})); return true; } catch(e){}
    return false;
  }

  function attemptClosePalette(paletteEl){
    if (!paletteEl) return false;
    const now = Date.now();
    if (now - lastAutoClose < AUTO_CLOSE_COOLDOWN) return false;
    // procura o botão de fechar dentro da paleta (ou global como fallback)
    const closeBtn = paletteEl.querySelector(CLOSE_BUTTON_SELECTOR) || document.querySelector(CLOSE_BUTTON_SELECTOR);
    if (!closeBtn || !isVisible(closeBtn)) return false;
    lastAutoClose = now;
    tryPerformClick(closeBtn);
    return true;
  }

  const paletteObserver = new MutationObserver((mutations) => {
    try {
      for (const m of mutations) {
        if (!m.addedNodes || m.addedNodes.length === 0) continue;
        for (const node of m.addedNodes) {
          if (!(node instanceof Element)) continue;
          // se o próprio node for a paleta
          for (const sel of PALETTE_SELECTORS) {
            if (node.matches && node.matches(sel)) {
              attemptClosePalette(node);
              return; // já fechou uma paleta, sai para não repetir
            }
            // ou se a paleta foi anexada em algum filho
            const found = node.querySelector && node.querySelector(sel);
            if (found) {
              attemptClosePalette(found);
              return;
            }
          }
        }
      }
    } catch (e) {
      // swallow
    }
  });

  // observar o body por elementos adicionados/removidos
  try {
    paletteObserver.observe(document.body, { childList: true, subtree: true });
  } catch (e) {
    // se falhar por qualquer motivo, ignore
    console.warn("Palette auto-close observer failed to start:", e);
  }

})();

/* =========================
   restante final: patch UI, inicialização e fallback
   ========================= */

ensureMinWidth();

applyVisibility();

/* fim do script */

})();