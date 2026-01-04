// ==UserScript==
// @name         Universal Manual Blur
// @namespace    https://greasyfork.org/en/users/1451802
// @version      1.0
// @icon         https://www.svgrepo.com/show/416283/blur-drop-water.svg
// @author       NormalRandomPeople (https://github.com/NormalRandomPeople)
// @description  Manual blur anywhere. Client-side.
// @match        *://*/*
// @grant        GM_addStyle
// @run-at       document-idle
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @compatible   brave
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545615/Universal%20Manual%20Blur.user.js
// @updateURL https://update.greasyfork.org/scripts/545615/Universal%20Manual%20Blur.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const DEFAULT_SLIDER_VALUE = 40;
  const REGION_BG_MIN_ALPHA = 0.02;
  const UI_ZINDEX = 2147483647;
  const HANDLE_SIZE = 12;

  const css = `
  .umb-toolbar {
    position: fixed;
    right: 12px;
    bottom: 12px;
    z-index: ${UI_ZINDEX};
    background: rgba(16,16,16,0.88);
    color: #fff;
    border-radius: 10px;
    padding: 8px;
    font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    display:flex;
    gap:8px;
    align-items:center;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5);
    backdrop-filter: blur(6px);
    transition: box-shadow .18s ease, transform .12s linear, background .18s ease;
  }

  .umb-toolbar .umb-toggle-edit {
    transition: box-shadow .18s ease, transform .12s linear;
  }
  .umb-toolbar.umb-editing .umb-toggle-edit {
    box-shadow: 0 4px 18px rgba(255,60,60,0.28), inset 0 0 6px rgba(255,60,60,0.06);
    transform: translateY(-1px);
    border-radius: 6px;
  }

  .umb-toolbar button, .umb-toolbar select {
    background:#222; color:#fff; border: none; padding:6px 8px; border-radius:6px; cursor:pointer;
  }
  .umb-toolbar input[type=range] { width:140px; }
  .umb-help { font-size:12px; color:#ddd; margin-left:8px; }

  .umb-toolbar.umb-collapsed {
    width:44px;
    height:44px;
    padding:6px;
    gap:0;
    justify-content:center;
  }
  .umb-toolbar.umb-collapsed > *:not(.umb-toggle-collapse) { display:none; }

  .umb-toggle-collapse { font-weight:700; padding:6px 8px; }

  .umb-overlay {
    position: absolute;
    top: 0; left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: ${UI_ZINDEX - 1};
  }

  .umb-region {
    position: absolute;
    box-sizing: border-box;
    background: rgba(255,255,255,${REGION_BG_MIN_ALPHA});
    -webkit-backdrop-filter: blur(6px);
    backdrop-filter: blur(6px);
    border: 2px dashed rgba(255,255,255,0.6);
    pointer-events: none;
    overflow: visible;
  }

  .umb-region.ellipse { border-radius: 50%; }

  .umb-region.editing { border-style: solid; box-shadow: 0 6px 20px rgba(0,0,0,0.6); }

  .umb-handle {
    position: absolute;
    width: ${HANDLE_SIZE}px;
    height: ${HANDLE_SIZE}px;
    background: #fff;
    border-radius: 3px;
    border: 1px solid #333;
    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
    transform: translate(-50%,-50%);
    cursor: nwse-resize;
    z-index: ${UI_ZINDEX + 1};
  }
  .umb-handle.hidden { display: none; }

  .umb-bubble {
    position: fixed;
    z-index: ${UI_ZINDEX + 2};
    background: rgba(0,0,0,0.88);
    color: #fff;
    padding:8px 10px;
    border-radius:8px;
    font-size:13px;
    pointer-events: auto;
    max-width: 320px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.6);
  }

  .umb-bubble small { display:block; color:#bbb; margin-top:6px; font-size:12px; }
  `;

  try { GM_addStyle(css); } catch (e) {
    const s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
  }

  function mapSliderToBlurAndAlpha(sliderValue) {
    const v = Math.max(0, Math.min(100, Number(sliderValue) || 0));
    const blurPx = Math.round(Math.pow(v / 100, 1.1) * 90);
    const alpha = Math.min(0.65, Math.max(REGION_BG_MIN_ALPHA, 0.02 + blurPx / 180));
    return { blurPx, alpha };
  }

  const toolbar = document.createElement('div');
  toolbar.className = 'umb-toolbar';
  toolbar.innerHTML = `
    <button class="umb-toggle-collapse" id="umb-collapse-btn">⏵</button>
    <button class="umb-toggle-edit" id="umb-toggle-edit">Enter edit</button>
    <button id="umb-new-rect">New rectangle</button>
    <button id="umb-new-ellipse">New ellipse</button>
    <label class="umb-tag">Blur: <input id="umb-global-blur" type="range" min="0" max="100" value="${DEFAULT_SLIDER_VALUE}" /></label>
    <button id="umb-clear-all">Clear all</button>
    <button id="umb-help-btn">Help</button>
  `;
  document.body.appendChild(toolbar);

  const btnEdit = toolbar.querySelector('#umb-toggle-edit');
  const btnNewRect = toolbar.querySelector('#umb-new-rect');
  const btnNewEllipse = toolbar.querySelector('#umb-new-ellipse');
  const inputGlobalBlur = toolbar.querySelector('#umb-global-blur');
  const btnClear = toolbar.querySelector('#umb-clear-all');
  const btnHelp = toolbar.querySelector('#umb-help-btn');
  const btnCollapse = toolbar.querySelector('#umb-collapse-btn');

  const overlay = document.createElement('div');
  overlay.className = 'umb-overlay';
  overlay.style.top = '0px';
  overlay.style.left = '0px';
  document.body.appendChild(overlay);
  function updateOverlaySize() {
    overlay.style.width = Math.max(document.documentElement.scrollWidth, window.innerWidth) + 'px';
    overlay.style.height = Math.max(document.documentElement.scrollHeight, window.innerHeight) + 'px';
  }
  window.addEventListener('resize', updateOverlaySize);
  window.addEventListener('scroll', updateOverlaySize);
  const mo = new MutationObserver(updateOverlaySize);
  mo.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  updateOverlaySize();

  let regions = [];
  let editing = false;
  let selectedRegion = null;
  let isPointerDown = false;
  let drawMode = null;
  let drawStart = null;
  let perRegionBubble = null;
  let helpBubble = null;

  function createRegion({ left = 100, top = 100, width = 240, height = 120, sliderValue = DEFAULT_SLIDER_VALUE, shape = 'rect' } = {}) {
    const el = document.createElement('div');
    el.className = 'umb-region' + (shape === 'ellipse' ? ' ellipse' : '');
    el.style.left = left + 'px';
    el.style.top = top + 'px';
    el.style.width = width + 'px';
    el.style.height = height + 'px';
    el.style.pointerEvents = editing ? 'auto' : 'none';
    el.style.zIndex = UI_ZINDEX - 0;
    overlay.appendChild(el);

    const region = { el, left, top, width, height, sliderValue, shape, handles: null };
    applyMappedStyleToRegion(region);

    el.addEventListener('pointerdown', regionPointerDown);
    el.addEventListener('dblclick', () => {
      region.shape = region.shape === 'rect' ? 'ellipse' : 'rect';
      el.classList.toggle('ellipse', region.shape === 'ellipse');
      applyMappedStyleToRegion(region);
    });

    regions.push(region);
    return region;
  }

  function applyMappedStyleToRegion(region) {
    const { blurPx, alpha } = mapSliderToBlurAndAlpha(region.sliderValue);
    region.el.style.left = region.left + 'px';
    region.el.style.top = region.top + 'px';
    region.el.style.width = Math.max(2, region.width) + 'px';
    region.el.style.height = Math.max(2, region.height) + 'px';
    region.el.style.background = `rgba(255,255,255,${alpha})`;
    if (blurPx === 0) {
      region.el.style.backdropFilter = 'none';
      region.el.style.webkitBackdropFilter = 'none';
    } else {
      region.el.style.backdropFilter = `blur(${blurPx}px)`;
      region.el.style.webkitBackdropFilter = `blur(${blurPx}px)`;
    }
    region.el.classList.toggle('ellipse', region.shape === 'ellipse');
  }

  function setGlobalBlurToRegions(sliderValue) {
    regions.forEach(r => { r.sliderValue = sliderValue; applyMappedStyleToRegion(r); });
  }

  function selectRegion(region) {
    if (selectedRegion && selectedRegion !== region) deselectRegion(selectedRegion);
    selectedRegion = region;
    if (!region) return;
    region.el.classList.add('editing');
    addHandles(region);
    showPerRegionBubble(region);
  }

  function deselectRegion(region) {
    if (!region) return;
    region.el.classList.remove('editing');
    removeHandles(region);
    hidePerRegionBubble();
    if (selectedRegion === region) selectedRegion = null;
  }

  function addHandles(region) {
    removeHandles(region);
    const pos = ['nw','n','ne','e','se','s','sw','w'];
    region.handles = {};
    pos.forEach(p => {
      const h = document.createElement('div');
      h.className = 'umb-handle';
      h.dataset.pos = p;
      h.style.pointerEvents = editing ? 'auto' : 'none';
      overlay.appendChild(h);
      region.handles[p] = h;
      h.addEventListener('pointerdown', handlePointerDown);
    });
    positionHandles(region);
  }

  function removeHandles(region) {
    if (!region || !region.handles) return;
    for (const k in region.handles) {
      const h = region.handles[k];
      if (h && h.parentNode) h.parentNode.removeChild(h);
    }
    region.handles = null;
  }

  function positionHandles(region) {
    if (!region.handles) return;
    const x = region.left, y = region.top, w = region.width, h = region.height;
    const centers = { nw: [x, y], n: [x + w/2, y], ne: [x + w, y], e: [x + w, y + h/2], se: [x + w, y + h], s: [x + w/2, y + h], sw: [x, y + h], w: [x, y + h/2] };
    for (const p in centers) {
      const [cx, cy] = centers[p];
      const el = region.handles[p];
      el.style.left = (cx - window.scrollX) + 'px';
      el.style.top = (cy - window.scrollY) + 'px';
      el.style.display = editing ? '' : 'none';
      el.style.pointerEvents = editing ? 'auto' : 'none';
      el.style.position = 'fixed';
    }
  }

  let activeAction = null;

  overlay.addEventListener('pointerdown', (ev) => {
    if (!editing) return;
    if (ev.target !== overlay) return;
    if (!drawMode) return;
    isPointerDown = true;
    const docX = ev.pageX, docY = ev.pageY;
    drawStart = { x: docX, y: docY };
    const region = createRegion({ left: docX, top: docY, width: 2, height: 2, sliderValue: Number(inputGlobalBlur.value), shape: drawMode === 'ellipse' ? 'ellipse' : 'rect' });
    activeAction = { type: 'draw', region, startX: docX, startY: docY };
    selectRegion(region);
    ev.preventDefault();
  });

  function regionPointerDown(ev) {
    if (!editing) return;
    ev.stopPropagation();
    isPointerDown = true;
    const el = ev.currentTarget;
    const region = regions.find(r => r.el === el);
    if (!region) return;
    selectRegion(region);
    const docX = ev.pageX, docY = ev.pageY;
    activeAction = { type: 'move', region, startX: docX, startY: docY, origLeft: region.left, origTop: region.top };
    el.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  function handlePointerDown(ev) {
    if (!editing) return;
    ev.stopPropagation();
    isPointerDown = true;
    const handle = ev.currentTarget;
    const region = regions.find(r => r.handles && Object.values(r.handles).includes(handle));
    if (!region) return;
    selectRegion(region);
    activeAction = { type: 'resize', region, handlePos: handle.dataset.pos, startX: ev.pageX, startY: ev.pageY, orig: { left: region.left, top: region.top, width: region.width, height: region.height } };
    handle.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  }

  window.addEventListener('pointermove', (ev) => {
    if (!editing || !isPointerDown || !activeAction) return;
    const a = activeAction;
    const dx = ev.pageX - a.startX, dy = ev.pageY - a.startY;

    if (a.type === 'draw') {
      const left = Math.min(a.startX, ev.pageX);
      const top = Math.min(a.startY, ev.pageY);
      const w = Math.max(2, Math.abs(ev.pageX - a.startX));
      const h = Math.max(2, Math.abs(ev.pageY - a.startY));
      a.region.left = left; a.region.top = top; a.region.width = w; a.region.height = h;
      applyMappedStyleToRegion(a.region);
      positionHandles(a.region);
    } else if (a.type === 'move') {
      a.region.left = a.origLeft + dx; a.region.top = a.origTop + dy;
      applyMappedStyleToRegion(a.region);
      positionHandles(a.region);
    } else if (a.type === 'resize') {
      const orig = a.orig;
      let { left, top, width, height } = orig;
      const minSize = 6; const hp = a.handlePos;
      if (hp.includes('n')) { const newTop = top + dy; const newHeight = height - dy; if (newHeight > minSize) { top = newTop; height = newHeight; } }
      if (hp.includes('s')) { const newHeight = height + dy; if (newHeight > minSize) { height = newHeight; } }
      if (hp.includes('w')) { const newLeft = left + dx; const newWidth = width - dx; if (newWidth > minSize) { left = newLeft; width = newWidth; } }
      if (hp.includes('e')) { const newWidth = width + dx; if (newWidth > minSize) { width = newWidth; } }
      a.region.left = left; a.region.top = top; a.region.width = width; a.region.height = height;
      applyMappedStyleToRegion(a.region);
      positionHandles(a.region);
    }
    ev.preventDefault();
  });

  window.addEventListener('pointerup', (ev) => {
    if (!editing) return;
    if (!isPointerDown) return;
    isPointerDown = false;
    if (activeAction && activeAction.type === 'draw') {
      const r = activeAction.region;
      if (r.width < 6 || r.height < 6) removeRegion(r);
      else { applyMappedStyleToRegion(r); positionHandles(r); positionPerRegionBubble(r); }
    } else if (activeAction && activeAction.type === 'move') {
      if (activeAction.region) positionPerRegionBubble(activeAction.region);
    } else if (activeAction && activeAction.type === 'resize') {
      if (activeAction.region) positionPerRegionBubble(activeAction.region);
    }
    if (activeAction && activeAction.region && activeAction.region.el) {
      try { activeAction.region.el.releasePointerCapture(ev.pointerId); } catch (e) {}
    }
    activeAction = null;
  });

  function removeRegion(region) {
    if (!region) return;
    if (region.el && region.el.parentNode) region.el.parentNode.removeChild(region.el);
    removeHandles(region);
    if (selectedRegion === region) selectedRegion = null;
    regions = regions.filter(r => r !== region);
    hidePerRegionBubble();
  }

  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      if (editing) toggleEdit(false);
    }
    if ((ev.key === 'Delete' || ev.key === 'Backspace') && selectedRegion) {
      removeRegion(selectedRegion);
    }
    if ((ev.key === '+' || ev.key === '=') && selectedRegion) {
      selectedRegion.sliderValue = Math.min(100, (selectedRegion.sliderValue || DEFAULT_SLIDER_VALUE) + 5);
      applyMappedStyleToRegion(selectedRegion);
      updatePerRegionBubbleSlider(selectedRegion);
    }
    if ((ev.key === '-' || ev.key === '_') && selectedRegion) {
      selectedRegion.sliderValue = Math.max(0, (selectedRegion.sliderValue || DEFAULT_SLIDER_VALUE) - 5);
      applyMappedStyleToRegion(selectedRegion);
      updatePerRegionBubbleSlider(selectedRegion);
    }
  });

  function toggleEdit(state = !editing) {
    editing = state;
    overlay.style.pointerEvents = editing ? 'auto' : 'none';
    regions.forEach(r => {
      r.el.style.pointerEvents = editing ? 'auto' : 'none';
      if (r.handles) {
        for (const k in r.handles) {
          r.handles[k].style.display = editing ? '' : 'none';
          r.handles[k].style.pointerEvents = editing ? 'auto' : 'none';
        }
      }
    });
    btnEdit.textContent = editing ? 'Exit edit' : 'Enter edit';

    if (editing) {
      toolbar.classList.add('umb-editing');
      btnCollapse.title = 'Collapse toolbar (you are in edit mode)';
    } else {
      toolbar.classList.remove('umb-editing');
      btnCollapse.title = 'Collapse toolbar';
    }

    if (!editing && selectedRegion) deselectRegion(selectedRegion);
    if (helpBubble) positionHelpBubble();
  }

  btnEdit.addEventListener('click', () => toggleEdit(!editing));
  btnNewRect.addEventListener('click', () => {
    const left = window.scrollX + (window.innerWidth - 320) / 2;
    const top = window.scrollY + (window.innerHeight - 160) / 2;
    const r = createRegion({ left, top, width: 320, height: 160, sliderValue: Number(inputGlobalBlur.value), shape: 'rect' });
    applyMappedStyleToRegion(r); positionHandles(r); selectRegion(r);
    if (!editing) toggleEdit(true);
  });
  btnNewEllipse.addEventListener('click', () => {
    const left = window.scrollX + (window.innerWidth - 240) / 2;
    const top = window.scrollY + (window.innerHeight - 240) / 2;
    const r = createRegion({ left, top, width: 240, height: 240, sliderValue: Number(inputGlobalBlur.value), shape: 'ellipse' });
    applyMappedStyleToRegion(r); positionHandles(r); selectRegion(r);
    if (!editing) toggleEdit(true);
  });

  inputGlobalBlur.addEventListener('input', () => {
    const v = Number(inputGlobalBlur.value);
    setGlobalBlurToRegions(v);
  });

  btnClear.addEventListener('click', () => {
    if (!confirm('Clear all blur regions?')) return;
    for (const r of [...regions]) removeRegion(r);
  });

  function showPerRegionBubble(region) {
    hidePerRegionBubble();
    perRegionBubble = document.createElement('div');
    perRegionBubble.className = 'umb-bubble';
    perRegionBubble.innerHTML = `
      <div><strong>Region</strong></div>
      <div style="margin-top:8px;">Blur: <input id="umb-region-blur" type="range" min="0" max="100" value="${region.sliderValue}" /></div>
      <small>Double-click shape to toggle rect/ellipse • Drag to move • Handles to resize</small>
    `;
    document.body.appendChild(perRegionBubble);

    const slider = perRegionBubble.querySelector('#umb-region-blur');
    slider.addEventListener('input', () => {
      region.sliderValue = Number(slider.value);
      applyMappedStyleToRegion(region);
    });

    function positionBubble() {
      if (!perRegionBubble || !region) return;
      const vx = region.left - window.scrollX;
      const vy = region.top - window.scrollY;
      const bubbleW = perRegionBubble.offsetWidth || 220;
      const bubbleH = perRegionBubble.offsetHeight || 80;
      let left = vx + region.width + 12;
      let top = vy;
      if (left + bubbleW > window.innerWidth - 12) { left = vx - bubbleW - 12; }
      if (left < 12) left = 12;
      if (top + bubbleH > window.innerHeight - 12) top = Math.max(12, window.innerHeight - bubbleH - 12);
      perRegionBubble.style.left = left + 'px';
      perRegionBubble.style.top = top + 'px';
    }
    positionBubble();
    window.addEventListener('scroll', positionBubble);
    window.addEventListener('resize', positionBubble);
    perRegionBubble._positionHandler = positionBubble;
  }

  function updatePerRegionBubbleSlider(region) {
    if (!perRegionBubble) return;
    const slider = perRegionBubble.querySelector('#umb-region-blur');
    if (slider) slider.value = region.sliderValue;
  }

  function hidePerRegionBubble() {
    if (!perRegionBubble) return;
    window.removeEventListener('scroll', perRegionBubble._positionHandler);
    window.removeEventListener('resize', perRegionBubble._positionHandler);
    perRegionBubble.remove();
    perRegionBubble = null;
  }

  function positionPerRegionBubble(region) {
    if (!perRegionBubble || !region) return;
    const vx = region.left - window.scrollX;
    const vy = region.top - window.scrollY;
    const bubbleW = perRegionBubble.offsetWidth || 220;
    const bubbleH = perRegionBubble.offsetHeight || 80;
    let left = vx + region.width + 12;
    let top = vy;
    if (left + bubbleW > window.innerWidth - 12) { left = vx - bubbleW - 12; }
    if (left < 12) left = 12;
    if (top + bubbleH > window.innerHeight - 12) top = Math.max(12, window.innerHeight - bubbleH - 12);
    perRegionBubble.style.left = left + 'px';
    perRegionBubble.style.top = top + 'px';
  }

  btnCollapse.addEventListener('click', () => {
    const collapsed = toolbar.classList.toggle('umb-collapsed');
    btnCollapse.textContent = collapsed ? '⏴' : '⏵';
    if (collapsed && helpBubble) hideHelpBubble();
    if (!collapsed && helpBubble) positionHelpBubble();
  });

  btnHelp.addEventListener('click', () => {
    if (helpBubble) { hideHelpBubble(); return; }
    helpBubble = document.createElement('div');
    helpBubble.className = 'umb-bubble';
    helpBubble.innerHTML = `
      <strong>Universal Manual Blur - Help</strong>
      <div style="margin-top:6px; color:#ddd; font-size:13px;">
        • Enter edit to create and edit blur regions (New rectangle / New ellipse).<br/>
        • Drag on empty page (in edit + after New) to draw a region.<br/>
        • Drag region to move; use handles to resize; double-click to toggle rect/ellipse.<br/>
        • Use the global slider or per-region slider (visible when a region is selected).<br/>
        • Exit edit to interact with the page; regions remain but are non-interactive.<br/>
        • Right-click the toolbar to copy a JSON snapshot of regions.<br/>
        • Ctrl+Shift+e to paste/import a snapshot<br/>
      </div>
    `;
    document.body.appendChild(helpBubble);
    positionHelpBubble();
    window.addEventListener('scroll', positionHelpBubble);
    window.addEventListener('resize', positionHelpBubble);
  });

  function positionHelpBubble() {
    if (!helpBubble) return;
    const rect = toolbar.getBoundingClientRect();
    const bw = helpBubble.offsetWidth || 320;
    let left = Math.max(8, rect.left + rect.width/2 - bw/2);
    let top = rect.top - helpBubble.offsetHeight - 10;
    if (toolbar.classList.contains('umb-collapsed') || top < 8) {
      top = rect.bottom + 10;
    }
    helpBubble.style.left = left + 'px';
    helpBubble.style.top = top + 'px';
  }

  function hideHelpBubble() {
    if (!helpBubble) return;
    window.removeEventListener('scroll', positionHelpBubble);
    window.removeEventListener('resize', positionHelpBubble);
    helpBubble.remove();
    helpBubble = null;
  }

  function updateAllHandles() {
    regions.forEach(r => positionHandles(r));
    if (perRegionBubble && selectedRegion) perRegionBubble._positionHandler && perRegionBubble._positionHandler();
  }
  window.addEventListener('scroll', updateAllHandles);
  window.addEventListener('resize', updateAllHandles);

  toolbar.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    const exportData = regions.map(r => ({ left: r.left, top: r.top, width: r.width, height: r.height, sliderValue: r.sliderValue, shape: r.shape }));
    prompt('Copy JSON snapshot (paste with Ctrl+Shift+e):', JSON.stringify(exportData));
  });
  window.addEventListener('keydown', (ev) => {
    if (ev.ctrlKey && ev.shiftKey && ev.key.toLowerCase() === 'e') {
      const raw = prompt('Paste JSON snapshot to import blur regions:');
      if (!raw) return;
      try {
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr)) throw new Error('Not an array');
        for (const r of [...regions]) removeRegion(r);
        for (const it of arr) {
          const rr = createRegion({ left: it.left, top: it.top, width: it.width, height: it.height, sliderValue: it.sliderValue || DEFAULT_SLIDER_VALUE, shape: it.shape || 'rect' });
          applyMappedStyleToRegion(rr); positionHandles(rr);
        }
        alert('Imported ' + arr.length + ' regions.');
      } catch (e) {
        alert('Import failed: ' + e.message);
      }
    }
  });

  function supportsBackdropFilter() {
    const test = document.createElement('div');
    test.style.webkitBackdropFilter = 'blur(2px)';
    test.style.backdropFilter = 'blur(2px)';
    return (test.style.webkitBackdropFilter.length > 0) || (test.style.backdropFilter.length > 0);
  }
  if (!supportsBackdropFilter()) {
    const warn = document.createElement('div');
    warn.style.position = 'fixed';
    warn.style.left = '12px';
    warn.style.bottom = '12px';
    warn.style.zIndex = UI_ZINDEX;
    warn.style.background = 'rgba(200,60,60,0.95)';
    warn.style.color = '#fff';
    warn.style.padding = '8px 10px';
    warn.style.borderRadius = '8px';
    warn.style.fontFamily = 'system-ui, Arial';
    warn.style.fontSize = '13px';
    warn.textContent = 'Notice: your browser may not support backdrop-filter; blur may not appear. Use Chromium, Edge or Firefox for best results.';
    document.body.appendChild(warn);
    setTimeout(() => { try { warn.remove(); } catch (e) {} }, 12000);
  }

  window.addEventListener('beforeunload', () => {
    try { overlay.remove(); toolbar.remove(); } catch (e) {}
  });
})();