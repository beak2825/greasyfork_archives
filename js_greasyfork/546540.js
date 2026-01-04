// ==UserScript==
// @name         Poki Fullscreen Button (Always On)
// @namespace    gg.poki.fullscreen
// @version      1.3.0
// @description  Adds a fullscreen button to poki.com when missing, keeps it alive across SPA navigation and fullscreen toggles without heavy DOM observers.
// @match        https://poki.com/*
// @run-at       document-idle
// @noframes
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=poki.com
// @author       jonilul
// @homepageURL  https://greasyfork.org/
// @supportURL   https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/546540/Poki%20Fullscreen%20Button%20%28Always%20On%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546540/Poki%20Fullscreen%20Button%20%28Always%20On%29.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ---------- tiny utils ----------
  const raf = (fn) => requestAnimationFrame(fn);
  const once = (el, type, fn) => el.addEventListener(type, fn, { once: true });

  // Fire a custom event on SPA URL changes
  const initUrlChangeHook = () => {
    const _push = history.pushState;
    const _replace = history.replaceState;
    const fire = () => window.dispatchEvent(new Event('poki-urlchange'));
    history.pushState = function() { _push.apply(this, arguments); fire(); };
    history.replaceState = function() { _replace.apply(this, arguments); fire(); };
    window.addEventListener('popstate', fire);
  };

  // Find the site’s “report bug” button by its icon (stable: #reportIcon)
  const findReportButton = () => {
    const use = document.querySelector("button use[href='#reportIcon'], button use[xlink\\:href='#reportIcon']");
    return use ? use.closest('button') : null;
  };

  const anyFullscreenButtonExists = () => !!document.querySelector('#fullscreen-button');

  // Create our fullscreen button (clone site look as provided)
  const createFullscreenButton = () => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'fullscreen-button';
    // Classes from examples the site uses
    btn.className = 'HPn_GzeLxs8_4nNebuj1 mDTrvHhilj2xlIvo_kXA phlaiC_iad_lookW5__d';
    btn.setAttribute('aria-label', 'Vollbild');

    const iconDiv = document.createElement('div');
    iconDiv.className = 'tqh57qBcKxMV9EdZQoAb';
    iconDiv.innerHTML = `
      <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" class="AUcJqk5uLaoXL0jqRGuH">
        <use xlink:href="#enterFullscreenIcon" href="#enterFullscreenIcon"></use>
      </svg>`;
    btn.append(iconDiv);

    const textDiv = document.createElement('div');
    textDiv.className = 'aAJE6r6D5rwwQuTmZqYG';

    const emptySpan = document.createElement('span');
    emptySpan.className = 'L6WSODmebiIqJJOEi46E Vlw13G6cUIC6W9LiGC_X';
    textDiv.append(emptySpan);

    const label = document.createElement('span');
    label.className = 'L6WSODmebiIqJJOEi46E tz2DEu5qBC9Yd6hJGjoW';
    label.textContent = 'Vollbild';
    textDiv.append(label);

    btn.append(textDiv);

    btn.addEventListener('click', () => {
      const elem = document.documentElement;
      if (!document.fullscreenElement) {
        (elem.requestFullscreen || elem.webkitRequestFullscreen || elem.msRequestFullscreen)?.call(elem);
      } else {
        (document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen)?.call(document);
      }
    });

    return btn;
  };

  // Insert right next to the report button (exactly "after" it)
  const insertAfter = (newNode, referenceNode) => {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  };

  // The lean orchestrator: tries to add only when needed
  let localObserver = null;
  const ensureButton = () => {
    // If site already has fullscreen/minimize button, do nothing
    if (anyFullscreenButtonExists()) return;

    // Try to find the target anchor (report button)
    const reportBtn = findReportButton();
    if (!reportBtn) return;

    // Create and place our button
    const btn = createFullscreenButton();
    insertAfter(btn, reportBtn);

    // Observe ONLY the small control area to restore if the site nukes/changes it
    if (localObserver) localObserver.disconnect();
    localObserver = new MutationObserver(() => {
      // If our button disappeared and site didn't add their own, re-add fast
      if (!anyFullscreenButtonExists()) {
        // Debounce to end of microtask + frame
        localObserver.disconnect();
        Promise.resolve().then(() => raf(ensureButton));
      }
    });
    // Narrow scope: just the parent container where these buttons live
    const scope = reportBtn.parentElement || reportBtn;
    localObserver.observe(scope, { childList: true });

    // Also stop observing if a native fullscreen/minimize button appears
    const stopIfNativeAppears = () => {
      if (anyFullscreenButtonExists() && btn.isConnected && btn !== document.querySelector('#fullscreen-button')) {
        // Our id collides by design, so if a different node with that id exists, remove ours
        btn.remove();
        localObserver?.disconnect();
      }
    };
    once(document, 'fullscreenchange', stopIfNativeAppears);
  };

  // Minimal event hooks (no whole-tree observers):
  // 1) Run on load/idle
  document.addEventListener('readystatechange', () => raf(ensureButton));
  raf(ensureButton);

  // 2) When entering/exiting fullscreen the site often swaps controls
  document.addEventListener('fullscreenchange', () => raf(ensureButton), { passive: true });

  // 3) React to SPA route changes (switching games on poki)
  initUrlChangeHook();
  window.addEventListener('poki-urlchange', () => {
    // Delay a tick to let the new DOM paint
    setTimeout(() => raf(ensureButton), 50);
  }, { passive: true });

  // 4) Very light safety net in case the site hot-swaps without history events
  //    Runs rarely, auto-noops when everything's fine
  setInterval(() => {
    if (!anyFullscreenButtonExists()) ensureButton();
  }, 2500);
})();
