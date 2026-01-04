// ==UserScript==
// @name         CND Force Parameter
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  force parameter for cdn link
// @author       Nikitin
// @match        https://cdn.tangiblee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tangiblee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519214/CND%20Force%20Parameter.user.js
// @updateURL https://update.greasyfork.org/scripts/519214/CND%20Force%20Parameter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.top !== window.self) {
    console.log("Script is running inside an iframe. Exiting...");
    return;
  }

  // ===== GW vs Embed are mutually exclusive; DirectLink is independent =====
  const EXCLUSIVE_GROUPS = [
    ["availableGalleryWidget", "availableIntegratedEmbedIframe"]
  ];
  const EXCLUSIVE_PRECEDENCE = {
    availableGalleryWidget: 0,
    availableIntegratedEmbedIframe: 1
  };

  (function enforceExclusiveOnLoad() {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    let changed = false;

    EXCLUSIVE_GROUPS.forEach(group => {
      const active = group.filter(k => params.has(k));
      if (active.length > 1) {
        const keep = active.sort((a, b) =>
          (EXCLUSIVE_PRECEDENCE[a] ?? 999) - (EXCLUSIVE_PRECEDENCE[b] ?? 999)
        )[0];
        group.forEach(k => { if (k !== keep) params.delete(k); });
        changed = true;
        console.log(`[CND] Resolved GW/Embed conflict: kept "${keep}".`);
      }
    });

    if (changed) window.location.replace(url.toString());
  })();

// ================== Styles ==================
const style = document.createElement('style');
style.innerHTML = `
  .panel-container{position:fixed;z-index:999999999;background:#fff;border:1px solid #ccc;border-radius:5px;box-shadow:0 4px 6px rgba(0,0,0,.1);display:flex;flex-direction:column;gap:5px;padding:0;width:max-content;transition:all .3s;}
  .panel-header{display:flex;gap:6px;align-items:center;justify-content:space-between;background:#f5f5f5;padding:5px 8px;border-bottom:1px solid #ccc;user-select:none;cursor:grab;touch-action:none;}
  .panel-header.vk-dragging{cursor:grabbing;}
  .drag-handle{background:transparent;border:0;padding:0;margin:0;width:20px;height:20px;pointer-events:auto;font-size:12px;line-height:20px;}
  .header-right{display:flex;gap:6px;align-items:center;}
  .layout-toggle,.collapse-toggle{font-size:14px;background:transparent;border:0;cursor:pointer;padding:2px 6px;border-radius:4px;}
  .layout-toggle[disabled]{opacity:.45;cursor:not-allowed;}
  .collapse-toggle{font-size:12px;}
  .panel-buttons{display:flex;flex-direction:column;padding:10px;gap:5px;max-width:90vw;}
  .panel-container.horizontal .panel-buttons{flex-direction:row;flex-wrap:wrap;}
  .panel-container.collapsed .panel-buttons{display:none;}
  .panel-button{padding:5px 10px;border:1px solid #ccc;border-radius:3px;cursor:pointer;background:#f0f0f0;color:#333;font-size:12px;transition:all .3s;}
  .panel-button.active{background:#4caf50 !important;color:#fff !important;}
  input[type=number]::-webkit-outer-spin-button,input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;margin:0;}
  input[type=number]{-moz-appearance:textfield;}

  /* Visible Key: host highlight */
  .vk-highlight{
    outline:1px dashed rgba(76,175,80,.6);
    outline-offset:2px;
    border-radius:3px;
    position:relative;
    pointer-events:auto !important;

    /* Новое: чтобы работал ellipsis */
    display:inline-block;
    max-width:100%;
    vertical-align:top;
  }

  /* Visible Key: inner span — сброс форматирования, уменьшение, курсор + ellipsis */
  .vk-key{
    display:inline-block;
    font-size:0.9em !important;
    text-transform:none !important;
    font-style:normal !important;
    font-weight:inherit;
    letter-spacing:normal !important;
    text-decoration:none !important;
    line-height:inherit;
    color:inherit;
    cursor:copy !important;
    user-select:text;
    pointer-events:auto !important;

    /* Новое: обрезаем длинные ключи */
    max-width:90%;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .vk-highlight, .vk-highlight *{ cursor:copy !important; }

  /* Если ключ внутри кнопки/таба — не даём содержимому расползаться */
  body[data-vk-enabled="1"] button:has(.vk-highlight),
  body[data-vk-enabled="1"] [role="tab"]:has(.vk-highlight){
    overflow:hidden;
  }

  /* Популярные контейнеры текста в свитчере — тоже прячем переполнение */
  body[data-vk-enabled="1"] .experience-switcher__text,
  body[data-vk-enabled="1"] .mode-switcher-item{
    overflow:hidden;
  }

  /* Гасим клики у активных линий при VK */
  body[data-vk-enabled="1"] .charm-builder-steps__active-line{ pointer-events:none !important; }
  body[data-vk-enabled="1"] [class*="active-line"]{ pointer-events:none !important; }

  /* Тост */
  .vk-toast{
    position:fixed;
    z-index:999999999;
    left:12px; bottom:12px;
    background:rgba(60,60,60,.95);
    color:#fff;
    font-size:12px;
    padding:6px 10px;
    border-radius:6px;
    box-shadow:0 4px 10px rgba(0,0,0,.25);
    pointer-events:none;
    opacity:0; transform:translateY(6px);
    transition:opacity .15s ease, transform .15s ease;
  }
  .vk-toast.show{ opacity:1; transform:translateY(0); }
`;
document.head.appendChild(style);

  // ================== UI ==================
  const parameters = [
    { key: "mode", value: "admin-preview", name: "Admin Preview" },
    { key: "directLink", value: "1", name: "Direct Link" },
    { key: "xtng_dev_on", value: "1", name: "Dev Mode" },
    { key: "availableGalleryWidget", value: "1", name: "Gallery Widget" },
    { key: "availableIntegratedEmbedIframe", value: "1", name: "Embed Iframe" }
  ];

  const container = document.createElement("div");
  container.className = "panel-container";
  container.setAttribute("data-vk-skip", "1"); // исключаем панель из VK

  const MOBILE_MAX = 768; // px

  // restore layout (user pref)
  const savedLayout = localStorage.getItem("layoutMode"); // 'horizontal' | 'vertical'
  if (savedLayout === "horizontal") container.classList.add("horizontal");

  // restore collapsed
  const savedCollapsed = localStorage.getItem("panelCollapsed") === "1";
  if (savedCollapsed) container.classList.add("collapsed");

  // header
  const header = document.createElement("div");
  header.className = "panel-header";

  const dragHandle = document.createElement("button");
  dragHandle.className = "drag-handle";
  dragHandle.innerHTML = "☰";
  header.appendChild(dragHandle);

  // header right controls (always visible)
  const headerRight = document.createElement("div");
  headerRight.className = "header-right";

  const layoutToggle = document.createElement("button");
  layoutToggle.className = "layout-toggle";
  layoutToggle.title = "Переключить отображение";

  const collapseToggle = document.createElement("button");
  collapseToggle.className = "collapse-toggle";
  collapseToggle.title = "Свернуть панель";

  function updateLayoutIcon() {
    const isHorizontal = container.classList.contains("horizontal");
    layoutToggle.textContent = isHorizontal ? "⇄" : "⇅";
    layoutToggle.style.fontSize = isHorizontal ? "14px" : "13px";
  }
  function updateCollapseIcon() {
    const isCollapsed = container.classList.contains("collapsed");
    collapseToggle.textContent = isCollapsed ? "▣" : "✕"; // ✕ свернуть, ▣ развернуть
    collapseToggle.title = isCollapsed ? "Развернуть панель" : "Свернуть панель";
  }
  updateLayoutIcon();
  updateCollapseIcon();

  headerRight.appendChild(layoutToggle);
  headerRight.appendChild(collapseToggle);
  header.appendChild(headerRight);
  container.appendChild(header);

  // buttons
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className = "panel-buttons";
  container.appendChild(buttonWrapper);

  const urlParamsAtBuild = new URL(window.location.href).searchParams;

  parameters.forEach(({ key, value, name }) => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.className = "panel-button";
    btn.setAttribute("data-param-key", key);
    if (urlParamsAtBuild.get(key) === value) btn.classList.add("active");
    btn.addEventListener("click", () => toggleParameter(key, value));
    buttonWrapper.appendChild(btn);
  });

  // Visible Key button
  const visibleKeyBtn = document.createElement("button");
  visibleKeyBtn.textContent = "Visible Key";
  visibleKeyBtn.className = "panel-button";
  buttonWrapper.appendChild(visibleKeyBtn);

  // contextModeId + screenshot
  const screenBlock = document.createElement("div");
  screenBlock.style.display = "flex";
  screenBlock.style.gap = "5px";
  screenBlock.style.alignItems = "center";

  const contextInput = document.createElement("input");
  contextInput.type = "number";
  contextInput.placeholder = "ID";
  contextInput.style.width = "50px";
  contextInput.style.textAlign = "center";
  contextInput.style.fontSize = "12px";
  contextInput.style.padding = "5px 3px";
  contextInput.style.border = "1px solid #ccc";
  contextInput.style.borderRadius = "3px";
  contextInput.style.MozAppearance = "textfield";
  contextInput.style.webkitAppearance = "none";
  contextInput.style.appearance = "textfield";

  const screenButton = document.createElement("button");
  screenButton.textContent = "Static";
  screenButton.className = "panel-button";

  screenBlock.appendChild(contextInput);
  screenBlock.appendChild(screenButton);
  buttonWrapper.appendChild(screenBlock);

  document.body.appendChild(container);

  const currentParams = new URL(window.location.href).searchParams;
  const currentContextId = currentParams.get("contextModeId");
  const isScreenshot = currentParams.get("screenshot") === "1";
  if (currentContextId && isScreenshot) {
    contextInput.value = currentContextId;
    screenButton.classList.add("active");
  }
  screenButton.addEventListener("click", () => {
    const id = contextInput.value.trim();
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const isActive = params.get("contextModeId") === id && params.get("screenshot") === "1";
    if (isActive) {
      params.delete("contextModeId");
      params.delete("screenshot");
      screenButton.classList.remove("active");
    } else if (id) {
      params.set("contextModeId", id);
      params.set("screenshot", "1");
      screenButton.classList.add("active");
    }
    window.location.href = url.toString();
  });

  layoutToggle.addEventListener("click", () => {
    if (layoutToggle.hasAttribute('disabled')) return;
    container.classList.toggle("horizontal");
    localStorage.setItem("layoutMode", container.classList.contains("horizontal") ? "horizontal" : "vertical");
    updateLayoutIcon();
    ensurePanelInViewport();
  });

  collapseToggle.addEventListener("click", () => {
    container.classList.toggle("collapsed");
    localStorage.setItem("panelCollapsed", container.classList.contains("collapsed") ? "1" : "0");
    updateCollapseIcon();
    ensurePanelInViewport();
  });

  // ================== URL params logic ==================
  function toggleParameter(paramKey, paramValue) {
    const url = new URL(window.location.href);
    const params = url.searchParams;
    const isActive = params.get(paramKey) === paramValue;

    if (isActive) {
      params.delete(paramKey);
      updateButtonState(paramKey, false);
      window.location.href = url.toString();
      return;
    }

    params.set(paramKey, paramValue);
    updateButtonState(paramKey, true);

    EXCLUSIVE_GROUPS.forEach(group => {
      if (group.includes(paramKey)) {
        group.forEach(k => {
          if (k !== paramKey) {
            params.delete(k);
            updateButtonState(k, false);
          }
        });
      }
    });

    window.location.href = url.toString();
  }

  function updateButtonState(paramKey, isActive) {
    const btn = document.querySelector(`[data-param-key="${paramKey}"]`);
    if (btn) btn.classList.toggle("active", isActive);
  }

  // ================== Visible Key implementation ==================
  const VK_STORAGE_KEY = "vk_mode_enabled";
  let vkEnabled = localStorage.getItem(VK_STORAGE_KEY) === "1";
  let vkObserver = null;
  const VK_BLOCKED_EVENTS = ['click','mousedown','mouseup','pointerdown','pointerup','touchstart','touchend'];
  let vkEventHandlers = [];

  // toast
  let toastEl;
  function showToast(msg){
    if (!toastEl){
      toastEl = document.createElement('div');
      toastEl.className = 'vk-toast';
      toastEl.setAttribute('data-vk-skip','1');
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(()=>toastEl.classList.remove('show'), 900);
  }

  function isInSkipZone(el){ return !!(el && el.closest && el.closest('[data-vk-skip]')); }

  function applyVisibleKeyToElement(el) {
    if (!el || !el.getAttribute || !el.hasAttribute('data-key') || isInSkipZone(el)) return;
    if (!el.dataset.vkOriginal) {
      el.dataset.vkOriginal = el.innerHTML;
      el.classList.add('vk-highlight');
      const key = el.getAttribute('data-key') || '';
      el.innerHTML = `<span class="vk-key" data-vk-label>${key}</span>`;
    }
  }

  function revertVisibleKeyFromElement(el) {
    if (!el || !el.dataset) return;
    if (el.dataset.vkOriginal !== undefined) {
      el.innerHTML = el.dataset.vkOriginal;
      el.classList.remove('vk-highlight');
      delete el.dataset.vkOriginal;
    }
  }

  async function copyToClipboard(text){
    try{
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        ta.setAttribute('readonly','');
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast(`Copied: ${text}`);
    }catch(e){ showToast('Copy failed'); }
  }

  function addVKBlockers(){
    VK_BLOCKED_EVENTS.forEach(type => {
      const handler = (e) => {
        const targetEl = e.target instanceof Element ? e.target.closest('[data-key]') : null;
        if (!targetEl || isInSkipZone(targetEl)) return;
        e.preventDefault();
        e.stopPropagation();
        if (type === 'click') {
          const key = targetEl.getAttribute('data-key') || '';
          if (key) copyToClipboard(key);
        }
      };
      document.addEventListener(type, handler, true);
      vkEventHandlers.push({type, handler});
    });
  }

  function removeVKBlockers(){
    vkEventHandlers.forEach(({type, handler}) => {
      document.removeEventListener(type, handler, true);
    });
    vkEventHandlers = [];
  }

  function enableVisibleKey() {
    document.body.setAttribute('data-vk-enabled','1');
    document.querySelectorAll('[data-key]').forEach(applyVisibleKeyToElement);

    if (vkObserver) vkObserver.disconnect();
    vkObserver = new MutationObserver(mutations => {
      for (const m of mutations) {
        m.addedNodes && m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (isInSkipZone(node)) return;
          if (node.hasAttribute && node.hasAttribute('data-key')) applyVisibleKeyToElement(node);
          node.querySelectorAll && node.querySelectorAll('[data-key]').forEach(n => {
            if (!isInSkipZone(n)) applyVisibleKeyToElement(n);
          });
        });
      }
    });
    vkObserver.observe(document.documentElement, {childList:true, subtree:true, attributes:true, attributeFilter:['data-key']});
    addVKBlockers();
  }

  function disableVisibleKey() {
    document.body.removeAttribute('data-vk-enabled');
    if (vkObserver) { vkObserver.disconnect(); vkObserver = null; }
    removeVKBlockers();
    document.querySelectorAll('[data-key]').forEach(revertVisibleKeyFromElement);
  }

  // init Visible Key
  if (vkEnabled) {
    visibleKeyBtn.classList.add("active");
    enableVisibleKey();
  }
  visibleKeyBtn.addEventListener("click", () => {
    vkEnabled = !vkEnabled;
    localStorage.setItem(VK_STORAGE_KEY, vkEnabled ? "1" : "0");
    visibleKeyBtn.classList.toggle("active", vkEnabled);
    if (vkEnabled) enableVisibleKey();
    else disableVisibleKey();
  });

  // ================== Dragging & position (Pointer Events with click-safe toggle) ==================
  let isPointerDown = false, isDragging = false;
  let startX = 0, startY = 0, offsetX = 0, offsetY = 0, activePointerId = null;
  const DRAG_THRESHOLD = 4; // px

  function clamp(v, min, max){ return Math.min(Math.max(v, min), max); }

  function canStartDragFrom(target){
    if (!target) return false;
    if (target.closest('[data-vk-skip]') !== container) return false;
    if (target.closest('.layout-toggle') || target.closest('.collapse-toggle') || target.closest('.panel-button')) return false;
    if (target.closest('.drag-handle')) return true;
    return target.closest('.panel-header') === header;
  }

  function dragStart(e){
    const t = e.target;
    if (!canStartDragFrom(t)) return;

    isPointerDown = true;
    isDragging = false;
    activePointerId = e.pointerId ?? null;

    const rect = container.getBoundingClientRect();
    startX = e.clientX; startY = e.clientY;
    offsetX = startX - rect.left;
    offsetY = startY - rect.top;

    header.classList.add('vk-dragging');
    container.style.transition = 'none';

    if (header.setPointerCapture && activePointerId !== null) {
      try { header.setPointerCapture(activePointerId); } catch {}
    }
  }

  function dragMove(e){
    if (!isPointerDown) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (!isDragging && (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD)) {
      isDragging = true;
    }
    if (!isDragging) return;

    const maxLeft = window.innerWidth - container.offsetWidth;
    const maxTop  = window.innerHeight - container.offsetHeight;
    const newLeft = clamp(e.clientX - offsetX, 0, maxLeft);
    const newTop  = clamp(e.clientY - offsetY, 0, maxTop);

    container.style.left = `${(newLeft / window.innerWidth) * 100}%`;
    container.style.top  = `${(newTop  / window.innerHeight) * 100}%`;

    if (e.cancelable) e.preventDefault();
  }

  function dragEnd(){
    if (!isPointerDown) return;

    if (isDragging) {
      container.style.transition = 'all .3s';
      let leftPercent = (container.offsetLeft / window.innerWidth) * 100;
      let topPercent  = (container.offsetTop  / window.innerHeight) * 100;
      leftPercent = clamp(leftPercent, 0, 95);
      topPercent  = clamp(topPercent, 0, 95);
      localStorage.setItem("panelPosition", JSON.stringify({ left: leftPercent, top: topPercent }));
    }

    isPointerDown = false;
    isDragging = false;
    header.classList.remove('vk-dragging');

    if (header.releasePointerCapture && activePointerId !== null) {
      try { header.releasePointerCapture(activePointerId); } catch {}
    }
    activePointerId = null;
  }

  if ('PointerEvent' in window) {
    header.addEventListener('pointerdown', (e) => {
      if (typeof e.button === 'number' && e.button !== 0) return;
      dragStart(e);
    });
    window.addEventListener('pointermove', dragMove, { passive: false });
    window.addEventListener('pointerup',   dragEnd);
    window.addEventListener('pointercancel', dragEnd);
  } else {
    // Фолбэк: touch + mouse
    const getTouch = (ev) => (ev.touches && ev.touches[0]) || (ev.changedTouches && ev.changedTouches[0]);
    header.addEventListener('touchstart', (e) => {
      if (!canStartDragFrom(e.target)) return;
      const t = getTouch(e); if (!t) return;
      isPointerDown = true; isDragging = false;
      const rect = container.getBoundingClientRect();
      startX = t.clientX; startY = t.clientY;
      offsetX = startX - rect.left; offsetY = startY - rect.top;
      header.classList.add('vk-dragging');
      container.style.transition = 'none';
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isPointerDown) return;
      const t = getTouch(e); if (!t) return;
      const dx = t.clientX - startX, dy = t.clientY - startY;
      if (!isDragging && (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD)) isDragging = true;
      if (!isDragging) return;
      const maxLeft = window.innerWidth - container.offsetWidth;
      const maxTop  = window.innerHeight - container.offsetHeight;
      const newLeft = clamp(t.clientX - offsetX, 0, maxLeft);
      const newTop  = clamp(t.clientY - offsetY, 0, maxTop);
      container.style.left = `${(newLeft / window.innerWidth) * 100}%`;
      container.style.top  = `${(newTop  / window.innerHeight) * 100}%`;
      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchend', dragEnd);
    window.addEventListener('touchcancel', dragEnd);

    header.addEventListener('mousedown', (e) => {
      if (e.button !== 0) return;
      if (!canStartDragFrom(e.target)) return;
      const rect = container.getBoundingClientRect();
      isPointerDown = true; isDragging = false;
      startX = e.clientX; startY = e.clientY;
      offsetX = startX - rect.left; offsetY = startY - rect.top;
      header.classList.add('vk-dragging');
      container.style.transition = 'none';
    });
    document.addEventListener('mousemove', (e) => {
      if (!isPointerDown) return;
      const dx = e.clientX - startX, dy = e.clientY - startY;
      if (!isDragging && (Math.abs(dx) + Math.abs(dy) > DRAG_THRESHOLD)) isDragging = true;
      if (!isDragging) return;
      const maxLeft = window.innerWidth - container.offsetWidth;
      const maxTop  = window.innerHeight - container.offsetHeight;
      const newLeft = clamp(e.clientX - offsetX, 0, maxLeft);
      const newTop  = clamp(e.clientY - offsetY, 0, maxTop);
      container.style.left = `${(newLeft / window.innerWidth) * 100}%`;
      container.style.top  = `${(newTop  / window.innerHeight) * 100}%`;
      e.preventDefault();
    });
    document.addEventListener('mouseup', dragEnd);
  }

  // ===== Position restore & correction =====
  function ensurePanelInViewport(){
    const rect = container.getBoundingClientRect();
    const maxLeft = Math.max(0, window.innerWidth - container.offsetWidth);
    const maxTop  = Math.max(0, window.innerHeight - container.offsetHeight);

    let left = container.offsetLeft;
    let top  = container.offsetTop;

    if (left > maxLeft) container.style.left = `${(maxLeft / window.innerWidth) * 100}%`;
    if (top  > maxTop ) container.style.top  = `${(maxTop  / window.innerHeight) * 100}%`;
    if (left < 0) container.style.left = "2%";
    if (top  < 0) container.style.top  = "2%";
  }

  // restore position
  const savedPosition = JSON.parse(localStorage.getItem("panelPosition") || "null");
  if (savedPosition) {
    const left = Math.min(Math.max(savedPosition.left, 0), 95);
    const top  = Math.min(Math.max(savedPosition.top, 0), 95);
    container.style.left = `${left}%`;
    container.style.top  = `${top}%`;
  } else {
    container.style.left = "3%";
    container.style.top  = "3%";
  }

  ensurePanelInViewport();

  // Автокоррекция при ресайзе окна + responsive rules
  window.addEventListener("resize", () => {
    ensurePanelInViewport();
    applyResponsiveLayout();
  });

  // responsive init after ensure
  function applyResponsiveLayout() {
    const small = window.innerWidth < MOBILE_MAX;
    if (small) {
      // layout toggle visible but disabled; collapse available
      layoutToggle.setAttribute('disabled', 'true');
      localStorage.setItem("layoutMode", "vertical");
      container.classList.remove("horizontal");
    } else {
      layoutToggle.removeAttribute('disabled');
      // keep saved layout
      const pref = localStorage.getItem("layoutMode");
      if (pref === "horizontal") container.classList.add("horizontal");
    }
    updateLayoutIcon();
    updateCollapseIcon();
  }
  applyResponsiveLayout();

})();