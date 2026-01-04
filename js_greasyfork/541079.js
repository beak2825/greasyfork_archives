// ==UserScript==
// @name         Torn Chain Timer – Draggable Toggle
// @namespace    http://tampermonkey.net/
// @version      1.1 beta
// @description  Adds a draggable toggle to the Torn chain timer so you can float it anywhere or snap it back to the sidebar. Removes the link when floating.
// @author       13lackfir3
// @license      MIT
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541079/Torn%20Chain%20Timer%20%E2%80%93%20Draggable%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/541079/Torn%20Chain%20Timer%20%E2%80%93%20Draggable%20Toggle.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const STORAGE_STATE = 'd4ChainFloating';
  const STORAGE_POS   = 'd4ChainPosition';

  let originalParent, placeholder, originalHref;

  function init() {
    const chainBar = document.querySelector('.chain-bar___vjdPL');
    if (!chainBar) {
      return setTimeout(init, 500);
    }

    // capture href just once
    if (originalHref === undefined) {
      originalHref = chainBar.getAttribute('href');
    }

    // if toggle already exists, just reapply
    if (chainBar.querySelector('.d4-chain-toggle')) {
      applyState();
      return;
    }

    // stash the original container
    originalParent = chainBar.parentNode;
    placeholder    = document.createElement('div');
    placeholder.style.width  = chainBar.offsetWidth + 'px';
    placeholder.style.height = chainBar.offsetHeight + 'px';
    originalParent.insertBefore(placeholder, chainBar);

    // allow absolute positioning
    chainBar.style.position = 'relative';

    // build the ⚙ button
    const btn = document.createElement('button');
    btn.className = 'd4-chain-toggle';
    btn.textContent = '⚙';
    Object.assign(btn.style, {
      position:      'absolute',
      top:           '4px',
      right:         '4px',
      zIndex:        9999,
      pointerEvents: 'auto',
      background:    'rgba(0,0,0,0.6)',
      border:        'none',
      color:         '#fff',
      fontSize:      '14px',
      cursor:        'pointer',
      padding:       '2px 4px',
      borderRadius:  '3px',
      userSelect:    'none'
    });
    chainBar.appendChild(btn);

    // capture click before <a> can fire
    btn.addEventListener('click', toggleFloating, { capture: true });

    // drag setup
    let dragging = false, sx = 0, sy = 0, ox = 0, oy = 0;
    chainBar.addEventListener('mousedown', function(e) {
      if (localStorage.getItem(STORAGE_STATE) !== 'true') return;
      dragging = true;
      sx       = e.clientX;
      sy       = e.clientY;
      const r  = chainBar.getBoundingClientRect();
      ox       = r.left;
      oy       = r.top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup',   onMouseUp);
      e.preventDefault();
    });

    function onMouseMove(e) {
      if (!dragging) return;
      chainBar.style.left = (ox + e.clientX - sx) + 'px';
      chainBar.style.top  = (oy + e.clientY - sy) + 'px';
    }

    function onMouseUp() {
      if (!dragging) return;
      dragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup',   onMouseUp);
      localStorage.setItem(STORAGE_POS, JSON.stringify({
        left: parseInt(chainBar.style.left, 10),
        top:  parseInt(chainBar.style.top,  10)
      }));
    }

    applyState();
  }

  function toggleFloating(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    const now = localStorage.getItem(STORAGE_STATE) === 'true';
    localStorage.setItem(STORAGE_STATE, String(!now));
    applyState();
  }

  function applyState() {
    const chainBar = document.querySelector('.chain-bar___vjdPL');
    if (!chainBar) return;
    const floating = localStorage.getItem(STORAGE_STATE) === 'true';

    if (floating) {
      // float
      document.body.appendChild(chainBar);
      chainBar.style.position = 'fixed';
      chainBar.style.zIndex   = '10000';
      const pos = JSON.parse(localStorage.getItem(STORAGE_POS) || '{}');
      chainBar.style.left = (pos.left  ?? 10) + 'px';
      chainBar.style.top  = (pos.top   ?? 10) + 'px';
      chainBar.removeAttribute('href');
      chainBar.style.cursor = 'move';
    } else {
      // dock back
      // 1) if placeholder is still in the DOM, use it...
      if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.replaceChild(chainBar, placeholder);
      }
      // 2) otherwise, re-insert into originalParent
      else if (originalParent) {
        originalParent.insertBefore(chainBar, originalParent.firstChild);
      }

      // restore styles & link
      chainBar.style.position = '';
      chainBar.style.left     = '';
      chainBar.style.top      = '';
      chainBar.style.zIndex   = '';
      if (originalHref) {
        chainBar.setAttribute('href', originalHref);
        chainBar.style.cursor = '';
      }
    }
  }

  // init on load & after ajax swaps
  init();
  document.addEventListener('ajaxComplete', init);

})();
