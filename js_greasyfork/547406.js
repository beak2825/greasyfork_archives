// ==UserScript==
// @name         TESTE CAO
// @namespace    https://discord.gg/7bYHWYgb
// @version      1.751
// @description  Overlay CyberSoul Animes no WPlace com tabela de cores, filtros, tooltips (desktop+mobile). Corrige posição do botão e bloqueio de deslize ao pintar.
// @author       Víkish
// @match        https://wplace.live/*
// @icon         https://i.imgur.com/TBeJokm.jpeg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547406/TESTE%20CAO.user.js
// @updateURL https://update.greasyfork.org/scripts/547406/TESTE%20CAO.meta.js
// ==/UserScript==

(async function () {
'use strict';

/* -------------------------
Configuração do overlay
------------------------- */
const CHUNK_WIDTH = 1000;
const CHUNK_HEIGHT = 1000;

const overlays = [
  {
    url: "https://i.imgur.com/jkHLyev.png",
    chunk: [731, 1193],
    coords: [731250, 1193250]
  }
];

async function prepareOverlays() {
  for (const obj of overlays) {
    obj.chunksString = `/${obj.chunk[0]}/${obj.chunk[1]}.png`;
    const { img, width, height } = await loadImage(obj.url);
    const overlayCanvas = new OffscreenCanvas(CHUNK_WIDTH, CHUNK_HEIGHT);
    const overlayCtx = overlayCanvas.getContext("2d");
    // desenha a imagem no canvas de chunk (posicionando pelo offset)
    overlayCtx.drawImage(img, obj.coords[0] % 1000, obj.coords[1] % 1000, width, height);
    obj.imageData = overlayCtx.getImageData(0, 0, CHUNK_WIDTH, CHUNK_HEIGHT);
    obj.totalPixels = countOverlayPixels(obj.imageData.data);
  }
}
await prepareOverlays();

/* -------------------------
Modos
------------------------- */
const OVERLAY_MODES = ["overlay", "original", "chunks"];
let overlayMode = OVERLAY_MODES[0];

/* -------------------------
Contadores centrais
------------------------- */
const pixelErrorCounter = document.createElement("div");
pixelErrorCounter.id = "pixel-error-counter";
Object.assign(pixelErrorCounter.style, {
  position: "fixed",
  top: "10px",
  left: "50%",
  transform: "translateX(-50%)",
  backgroundColor: "rgba(0,0,0,0.7)",
  color: "#fff",
  fontWeight: "700",
  fontSize: "11px",
  padding: "5px 10px",
  borderRadius: "8px",
  zIndex: "99999",
  pointerEvents: "none",
  textAlign: "center",
  lineHeight: "1.2"
});
const pixelsText = document.createElement("div"); pixelsText.textContent = `Remaining pixels: 0`;
const progressText = document.createElement("div"); progressText.textContent = `Current progress: 0,00%`;
pixelErrorCounter.appendChild(pixelsText);
pixelErrorCounter.appendChild(progressText);
document.body.appendChild(pixelErrorCounter);

/* -------------------------
Color name map (lowercase hex keys)
------------------------- */
const COLOR_NAME_MAP = {
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
UI: container da tabela de cores
------------------------- */
const colorStatsContainer = document.createElement("div");
Object.assign(colorStatsContainer.style, {
  position: "fixed",
  top: "170px",
  left: "7px",
  backgroundColor: "rgba(8,8,10,0.55)",
  color: "#fff",
  fontSize: "12px",
  padding: "4px",
  borderRadius: "8px",
  zIndex: "100000",
  pointerEvents: "auto",
  minWidth: "80px",
  maxWidth: "160px",
  maxHeight: "420px",
  boxSizing: "border-box",
  backdropFilter: "blur(6px)",
  touchAction: "none", // evita scroll ao interagir com a UI
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  gap: "4px"
});
document.body.appendChild(colorStatsContainer);

/* -------------------------
Styles (including tooltip)
------------------------- */
const styleTag = document.createElement("style");
styleTag.textContent = `
.color-header { display:flex; align-items:center; gap:6px; padding:2px 4px; box-sizing:border-box; }
.color-title { font-size:12px; font-weight:700; margin:0; padding:0 2px; flex:1 1 auto; text-align:left; }
.minimize-btn { width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; border-radius:6px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.02); cursor:pointer; font-weight:700; font-size:14px; color:white; padding:0; }
.color-divider { height:1px; background: rgba(255,255,255,0.08); margin:2px 0; border-radius:2px; }
.color-controls { display:flex; align-items:center; gap:6px; padding:0 4px; }
.color-list-scroll { overflow-y:auto; max-height:300px; padding-right:6px; box-sizing:border-box; -webkit-overflow-scrolling: touch; }
.color-item { display:flex; align-items:center; gap:6px; padding:4px 6px; border-radius:4px; font-size:13px; }
.color-checkbox { width:14px; height:14px; margin:0; cursor:pointer; transform:scale(0.9); }
.color-square { width:14px; height:14px; border-radius:3px; box-shadow: inset 0 0 0 1px rgba(0,0,0,0.12); }
.color-count { color:#fff; font-size:12px; }
.color-stats-collapsed { width:32px !important; height:32px !important; min-width:32px !important; max-width:32px !important; padding:0 !important; border-radius:6px !important; display:inline-flex !important; align-items:center !important; justify-content:center !important; overflow:visible !important; }
.color-stats-collapsed .color-list-scroll, .color-stats-collapsed .color-item, .color-stats-collapsed .color-controls, .color-stats-collapsed .color-divider, .color-stats-collapsed .color-title { display:none !important; }
.color-stats-collapsed .minimize-btn { width:100%; height:100%; border-radius:6px; }
.color-tooltip {
  position: fixed;
  padding: 6px 10px;
  background: rgba(0,0,0,0.9);
  color: #fff;
  font-size: 11px;
  border-radius: 6px;
  white-space: nowrap;
  pointer-events: none;
  transform: translate(-50%, -120%);
  opacity: 0;
  transition: opacity 0.12s;
  z-index: 200000;
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
}
`;
document.head.appendChild(styleTag);

/* -------------------------
Header, controls, list
------------------------- */
const header = document.createElement("div"); header.className = "color-header";
const titleEl = document.createElement("div"); titleEl.className = "color-title"; titleEl.textContent = "Color Chart";
const minimizeBtn = document.createElement("button"); minimizeBtn.className = "minimize-btn"; minimizeBtn.textContent = "−";
minimizeBtn.title = "Minimize";
header.appendChild(titleEl); header.appendChild(minimizeBtn);

const divider = document.createElement("div"); divider.className = "color-divider";

const controlsBox = document.createElement("div"); controlsBox.className = "color-controls";
const showAllCheckbox = document.createElement("input"); showAllCheckbox.type = "checkbox"; showAllCheckbox.checked = true; showAllCheckbox.className = "color-checkbox";
const showAllLabel = document.createElement("div"); showAllLabel.style.fontSize = "12px"; showAllLabel.textContent = "Show all";
controlsBox.appendChild(showAllCheckbox); controlsBox.appendChild(showAllLabel);

const listScroll = document.createElement("div"); listScroll.className = "color-list-scroll";

colorStatsContainer.appendChild(header);
colorStatsContainer.appendChild(divider);
colorStatsContainer.appendChild(controlsBox);
colorStatsContainer.appendChild(listScroll);

/* -------------------------
Tooltip element (shared)
------------------------- */
const tooltip = document.createElement("div"); tooltip.className = "color-tooltip"; document.body.appendChild(tooltip);
let tooltipHideTimer = null;
function showTooltip(text, clientX, clientY) {
  clearTimeout(tooltipHideTimer);
  tooltip.textContent = text;
  tooltip.style.opacity = "1";
  tooltip.style.left = '0px'; tooltip.style.top = '0px'; tooltip.style.visibility = 'hidden'; tooltip.style.opacity = '0';
  // force reflow
  document.body.offsetWidth;
  const w = tooltip.offsetWidth || 80;
  const h = tooltip.offsetHeight || 24;
  tooltip.style.visibility = ''; tooltip.style.opacity = '1';
  const pad = 8;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  let left = clientX;
  let top = clientY - 12;
  if (left < pad + w/2) left = pad + w/2;
  if (left > vw - pad - w/2) left = vw - pad - w/2;
  if (top < pad + h) top = clientY + 12;
  tooltip.style.left = `${left}px`; tooltip.style.top = `${top}px`;
}
function hideTooltipImmediate() { clearTimeout(tooltipHideTimer); tooltip.style.opacity = "0"; }
function hideTooltipDelayed(delay = 100) { clearTimeout(tooltipHideTimer); tooltipHideTimer = setTimeout(()=> tooltip.style.opacity = "0", delay); }

/* -------------------------
Collapse state (minimized by default)
------------------------- */
let collapsed = true;
function updateCollapse() {
  if (collapsed) {
    colorStatsContainer.classList.add("color-stats-collapsed");
    minimizeBtn.textContent = "+";
    minimizeBtn.title = "Maximize";
  } else {
    colorStatsContainer.classList.remove("color-stats-collapsed");
    minimizeBtn.textContent = "−";
    minimizeBtn.title = "Minimize";
  }
}
updateCollapse();
minimizeBtn.addEventListener("click", (e) => { e.stopPropagation(); collapsed = !collapsed; updateCollapse(); });
colorStatsContainer.addEventListener("dblclick", () => { collapsed = !collapsed; updateCollapse(); });

/* -------------------------
Color state: hex -> bool (true = show color)
------------------------- */
let colorStateByHex = {};
showAllCheckbox.addEventListener("change", () => {
  const val = !!showAllCheckbox.checked;
  Object.keys(colorStateByHex).forEach(hex => colorStateByHex[hex] = val);
  listScroll.querySelectorAll("input.color-checkbox").forEach(cb => cb.checked = val);
});

/* -------------------------
Fetch proxy: apply overlay, count colors, build list
------------------------- */
fetch = new Proxy(fetch, {
  apply: async (target, thisArg, argList) => {
    const urlString = typeof argList[0] === "object" ? argList[0].url : argList[0];
    let url;
    try { url = new URL(urlString); } catch { return target.apply(thisArg, argList); }

    if (overlayMode === "overlay") {
      if (url.hostname === "backend.wplace.live" && url.pathname.startsWith("/files/")) {
        for (const obj of overlays) {
          if (url.pathname.endsWith(obj.chunksString)) {
            const originalResponse = await target.apply(thisArg, argList);
            if (!originalResponse || !originalResponse.ok) return originalResponse;
            const originalBlob = await originalResponse.blob();
            const originalImage = await blobToImage(originalBlob);
            const width = originalImage.width;
            const height = originalImage.height;

            const canvas = new OffscreenCanvas(width, height);
            const ctx = canvas.getContext("2d", { willReadFrequently: true });
            ctx.drawImage(originalImage, 0, 0, width, height);
            const originalData = ctx.getImageData(0, 0, width, height);
            const resultData = ctx.getImageData(0, 0, width, height);

            const d1 = originalData.data;
            const d2 = obj.imageData.data;
            const dr = resultData.data;
            let pixelErrorCount = 0;
            const localColorCount = Object.create(null);

            for (let i = 0; i < d1.length; i += 4) {
              const a2 = d2[i+3];
              if (a2 === 0) {
                dr[i] = d1[i]; dr[i+1] = d1[i+1]; dr[i+2] = d1[i+2]; dr[i+3] = d1[i+3];
                continue;
              }
              const hex = rgbToHex(d2[i], d2[i+1], d2[i+2]);
              localColorCount[hex] = (localColorCount[hex] || 0) + 1;

              const showColor = (hex in colorStateByHex) ? colorStateByHex[hex] : true;

              const same = d1[i] === d2[i] && d1[i+1] === d2[i+1] && d1[i+2] === d2[i+2] && d1[i+3] === d2[i+3];
              if (same) {
                dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
              } else {
                if (!showColor) {
                  dr[i] = 0; dr[i+1] = 255; dr[i+2] = 0; dr[i+3] = 255;
                } else {
                  dr[i] = d2[i]; dr[i+1] = d2[i+1]; dr[i+2] = d2[i+2]; dr[i+3] = d2[i+3];
                }
                pixelErrorCount++;
              }
            }

            const total = obj.totalPixels || 1;
            const progresso = (((total - pixelErrorCount) / total) * 100).toFixed(2).replace('.', ',');
            pixelsText.textContent = `Remaining pixels: ${pixelErrorCount}`;
            progressText.textContent = `Current progress: ${progresso}%`;

            // rebuild color list
            rebuildColorList(localColorCount);

            ctx.putImageData(resultData, 0, 0);
            const blob = await canvas.convertToBlob();
            return new Response(blob, { headers: { "Content-Type": "image/png" } });
          }
        }
      }
    }
    return target.apply(thisArg, argList);
  }
});

/* -------------------------
Rebuild list UI from counts
------------------------- */
function rebuildColorList(localColorCount) {
  listScroll.innerHTML = "";
  Object.keys(localColorCount).forEach(hex => { if (!(hex in colorStateByHex)) colorStateByHex[hex] = true; });
  const entries = Object.entries(localColorCount).sort((a,b)=>b[1]-a[1]);
  if (entries.length === 0) {
    const ph = document.createElement("div"); ph.style.opacity = "0.7"; ph.style.padding = "6px"; ph.textContent = "No overlay colors in this chunk";
    listScroll.appendChild(ph);
    return;
  }

  entries.forEach(([hex, count]) => {
    const item = document.createElement("div"); item.className = "color-item";

    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.className = "color-checkbox";
    cb.checked = !!colorStateByHex[hex];
    cb.dataset.hex = hex;
    cb.addEventListener("change", () => {
      colorStateByHex[hex] = !!cb.checked;
      const allChecked = Object.keys(colorStateByHex).every(k => colorStateByHex[k]);
      showAllCheckbox.checked = allChecked;
    });

    const square = document.createElement("div"); square.className = "color-square";
    square.style.backgroundColor = hex;
    const name = COLOR_NAME_MAP[hex] || hex.toUpperCase();
    // mouse tooltip
    square.addEventListener("mouseenter", (e) => showTooltip(name, e.clientX, e.clientY));
    square.addEventListener("mouseleave", () => hideTooltipDelayed(80));
    // touch tooltip (prevent default to avoid gestures) - passive:false
    square.addEventListener("touchstart", function (e) {
      if (!e.touches || e.touches.length === 0) return;
      e.preventDefault();
      const t = e.touches[0];
      showTooltip(name, t.clientX, t.clientY);
    }, { passive: false });
    square.addEventListener("touchend", () => hideTooltipDelayed(80), { passive: true });
    square.addEventListener("touchcancel", () => hideTooltipImmediate(), { passive: true });

    const label = document.createElement("div"); label.className = "color-count"; label.textContent = count;

    item.appendChild(cb);
    item.appendChild(square);
    item.appendChild(label);
    listScroll.appendChild(item);
  });

  showAllCheckbox.checked = Object.keys(colorStateByHex).every(k => colorStateByHex[k]);
}

/* -------------------------
Restored patchUI (inserção no local antigo do site)
------------------------- */
function patchUI() {
  if (document.getElementById("overlay-blend-button")) return;

  const blendButton = document.createElement("button");
  blendButton.id = "overlay-blend-button";
  blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);

  Object.assign(blendButton.style, {
    backgroundColor: "#0e0e0e7f",
    color: "white",
    border: "solid",
    borderColor: "#1d1d1d7f",
    borderRadius: "4px",
    padding: "5px 10px",
    cursor: "pointer",
    backdropFilter: "blur(2px)"
  });

  blendButton.addEventListener("click", () => {
    overlayMode = OVERLAY_MODES[(OVERLAY_MODES.indexOf(overlayMode) + 1) % OVERLAY_MODES.length];
    blendButton.textContent = overlayMode.charAt(0).toUpperCase() + overlayMode.slice(1);
  });

  const buttonContainer = document.querySelector("div.gap-4:nth-child(1) > div:nth-child(2)");
  const leftSidebar = document.querySelector("html body div div.disable-pinch-zoom.relative.h-full.overflow-hidden.svelte-6wmtgk div.absolute.right-2.top-2.z-30 div.flex.flex-col.gap-4.items-center");

  if (buttonContainer) {
    buttonContainer.appendChild(blendButton);
    buttonContainer.classList.remove("items-center");
    buttonContainer.classList.add("items-end");
  }

  if (leftSidebar) {
    leftSidebar.classList.add("items-end");
    leftSidebar.classList.remove("items-center");
  }
}

const observer = new MutationObserver(() => {
  patchUI();
});

const observerRoot = document.querySelector("div.gap-4:nth-child(1)");
if (observerRoot) {
  observer.observe(observerRoot, {
    childList: true,
    subtree: true
  });
} else {
  // fallback: observe body so we can still insert when the UI loads later
  observer.observe(document.body, { childList: true, subtree: true });
}

patchUI();

/* -------------------------
Prevent page scroll while touching the main canvas (painting)

Finds the largest visible canvas and blocks touchmove while touching it.
------------------------- */
let canvasTouchBlockingAttached = false;
function findMainCanvas() {
  const canvases = Array.from(document.querySelectorAll("canvas")).filter(c => c.offsetParent !== null);
  if (canvases.length === 0) return null;
  // pick largest by area (likely the map)
  canvases.sort((a,b) => (b.width * b.height) - (a.width * a.height));
  return canvases[0];
}

function attachCanvasTouchBlockOnce() {
  if (canvasTouchBlockingAttached) return;
  const canvas = findMainCanvas();
  if (!canvas) {
    // try again later
    setTimeout(attachCanvasTouchBlockOnce, 800);
    return;
  }
  canvasTouchBlockingAttached = true;

  let touching = false;
  function onTouchStart(e) {
    if (!e.touches || e.touches.length === 0) return;
    touching = true;
    // while touching canvas, prevent page scrolling on touchmove
    // listener added on document to capture moves
  }
  function onTouchMove(e) {
    if (!touching) return;
    // Prevent default to block scrolling while painting
    e.preventDefault();
  }
  function onTouchEnd() {
    touching = false;
  }

  // Important: non-passive listener to allow preventDefault where needed
  canvas.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });
  document.addEventListener("touchend", onTouchEnd, { passive: true });
  document.addEventListener("touchcancel", onTouchEnd, { passive: true });

  // Also attach pointer events for pointer-based devices to avoid page drag while pointerdown on canvas
  canvas.addEventListener("pointerdown", () => { /* no-op, but could be used to track state */ }, { passive: true });
}

setTimeout(attachCanvasTouchBlockOnce, 500);
new MutationObserver(() => attachCanvasTouchBlockOnce()).observe(document, { childList: true, subtree: true });

/* -------------------------
Aux functions
------------------------- */
function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
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
function countOverlayPixels(data) {
  let count = 0;
  for (let i = 0; i < data.length; i += 4) if (data[i+3] !== 0) count++;
  return count;
}
function rgbToHex(r,g,b) {
  return "#" + [r,g,b].map(x => x.toString(16).padStart(2,"0")).join("").toLowerCase();
}

})();