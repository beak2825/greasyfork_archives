// ==UserScript==
// @name         Twitch Stream Zoom and Pan
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Barre zoom à côté de la recherche Twitch, ZQSD = déplacement (shift pour + rapide), A/E/R = zoom/dézoom/reset
// @author       Guile93
// @match        *://*.twitch.tv/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496638/Twitch%20Stream%20Zoom%20and%20Pan.user.js
// @updateURL https://update.greasyfork.org/scripts/496638/Twitch%20Stream%20Zoom%20and%20Pan.meta.js
// ==/UserScript==

(() => {
  'use strict';
  let zoomLevel = 1;
  const minZoom = 1;
  const maxZoom = 3;
  const zoomStep = 0.1;
  let panX = 0;
  let panY = 0;
  const panStep = 20;
  const $ = (sel, root = document) => root.querySelector(sel);
  const updateTransform = () => {
    const v = $('video');
    if (!v) return;
    v.style.transformOrigin = 'center center';
    v.style.transition = 'transform 0.15s ease-out';
    v.style.transform = `scale(${zoomLevel}) translate(${panX / zoomLevel}px, ${panY / zoomLevel}px)`;
  };
  const makeBtn = (id, label, title, onClick) => {
    const b = document.createElement('button');
    b.id = id;
    b.type = 'button';
    b.textContent = label;
    b.title = title || '';
    b.style.cssText = `
      border: none;
      padding: 4px 8px;
      margin: 0 2px;
      border-radius: 6px;
      background: #3a3a3a;
      color: #fff;
      font: 500 12px/1 system-ui;
      cursor: pointer;
    `;
    b.addEventListener('mouseenter', () => (b.style.background = '#4a4a4a'));
    b.addEventListener('mouseleave', () => (b.style.background = '#3a3a3a'));
    b.addEventListener('click', onClick);
    return b;
  };
  const buildToolbar = () => {
    const bar = document.createElement('div');
    bar.className = 'twitch-zoom-toolbar';
    bar.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      background: #2b2b2b;
      border: 1px solid #444;
      border-radius: 8px;
      padding: 4px 6px;
      margin-left: 8px;
      height: 32px;
    `;
    const indicator = document.createElement('span');
    indicator.id = 'zoomIndicator';
    indicator.style.cssText = 'margin-left: 6px; font: 600 12px/1 system-ui; color: #ddd; opacity: .9;';
    const updInd = () => (indicator.textContent = `×${zoomLevel.toFixed(1)}`);
    const plus = makeBtn('zoomIn', '+', 'Zoom (+ ou A si zoom actif)', () => {
      zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
      updateTransform();
      updInd();
    });
    const minus = makeBtn('zoomOut', '−', 'Dézoom (− ou E si zoom actif)', () => {
      zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
      updateTransform();
      updInd();
    });
    const reset = makeBtn('resetZoom', 'R', 'Reset (R si zoom actif)', () => {
      if (zoomLevel > 1) {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        updateTransform();
        updInd();
      }
    });
    updInd();
    bar.append(plus, minus, reset, indicator);
    return { bar, updInd };
  };
  const { bar, updInd } = buildToolbar();
  const mount = () => {
    const tray = $('[data-a-target="tray-search-input"].tw-combo-input');
    if (!tray || !tray.parentElement) return false;
    const parent = tray.parentElement;
    parent.style.display = 'flex';
    parent.style.alignItems = 'center';
    parent.style.gap = '8px';
    tray.style.flex = '0 1 auto';
    parent.insertBefore(bar, tray.nextSibling);
    return true;
  };
  if (!mount()) {
    const obs = new MutationObserver(() => {
      if (mount()) obs.disconnect();
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => obs.disconnect(), 15000);
  }
  const isTyping = (t) => {
    if (!t) return false;
    const tag = (t.tagName || '').toLowerCase();
    return t.isContentEditable || ['input', 'textarea', 'select'].includes(tag);
  };
  document.addEventListener('keydown', (e) => {
    if (isTyping(e.target)) return;
    const k = e.key.toLowerCase();
    const move = e.shiftKey ? panStep * 3 : panStep;
    if (zoomLevel > 1) {
      if (k === 'z') {
        panY += move;
        updateTransform();
      } else if (k === 's') {
        panY -= move;
        updateTransform();
      } else if (k === 'q') {
        panX += move;
        updateTransform();
      } else if (k === 'd') {
        panX -= move;
        updateTransform();
      } else if (k === 'a') {
        zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
        updateTransform();
        updInd();
      } else if (k === 'e') {
        zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
        updateTransform();
        updInd();
      } else if (k === 'r') {
        zoomLevel = 1;
        panX = 0;
        panY = 0;
        updateTransform();
        updInd();
      }
    }
    if (k === '+' || k === '=') {
      zoomLevel = Math.min(maxZoom, zoomLevel + zoomStep);
      updateTransform();
      updInd();
    } else if (k === '-') {
      zoomLevel = Math.max(minZoom, zoomLevel - zoomStep);
      updateTransform();
      updInd();
    }
  });
  updateTransform();
})();
