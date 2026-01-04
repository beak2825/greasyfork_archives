// ==UserScript==
// @name         Carrot Loading Animation for Janitor AI
// @namespace    https://janitorai.com/
// @version      1.0.1
// @description  Viva la carrots
// @author       IWasTheSyntaxError
// @match        https://janitorai.com/chats*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/534468/Carrot%20Loading%20Animation%20for%20Janitor%20AI.user.js
// @updateURL https://update.greasyfork.org/scripts/534468/Carrot%20Loading%20Animation%20for%20Janitor%20AI.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const seenContainers = new WeakSet();
  const carrotFrames = ['🥕', '🥕🥕', '🥕🥕🥕'];
  const carrotFrameInterval = 500;

  function createFloatingCarrotOverlay(p) {
    if (p.dataset.carrotOverlayAttached) return;

    // Find nearest non-static positioned parent
    let parent = p.parentElement;
    while (parent && getComputedStyle(parent).position === 'static') {
      parent = parent.parentElement;
    }
    if (!parent) return;

    // Ensure parent is relatively positioned for absolute overlay
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }

    const overlay = document.createElement('div');
    overlay.style.position = 'absolute';
    overlay.style.pointerEvents = 'none';
    overlay.style.left = `${p.offsetLeft}px`;
    overlay.style.top = `${p.offsetTop}px`;
    overlay.style.font = getComputedStyle(p).font;
    overlay.style.color = getComputedStyle(p).color;
    overlay.style.zIndex = '9999';
    overlay.style.whiteSpace = 'pre';

    const shadow = overlay.attachShadow({ mode: 'open' });
    const span = document.createElement('span');
    shadow.appendChild(span);

    let frameIndex = 0;
    const interval = setInterval(() => {
      if (!document.body.contains(p)) {
        clearInterval(interval);
        overlay.remove();
        return;
      }

      if (!/^replying/i.test(p.innerText.trim())) {
        clearInterval(interval);
        overlay.remove();
        p.removeAttribute('data-carrot-overlay-attached');
        p.style.opacity = '';
        return;
      }

      span.textContent = carrotFrames[frameIndex++ % carrotFrames.length];
    }, carrotFrameInterval);

    parent.appendChild(overlay);
    p.dataset.carrotOverlayAttached = 'true';
    p.style.opacity = '0'; // Hide the original text
  }

  function handleParagraph(p) {
    const text = p.innerText.trim();
    if (/^replying\.*/i.test(text)) {
      createFloatingCarrotOverlay(p);
    }
  }

  function observeContainer(container) {
    if (seenContainers.has(container)) return;
    seenContainers.add(container);
    console.log('[CARROT] Observing container:', container);

    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === 'P') {
              handleParagraph(node);
            } else {
              node.querySelectorAll?.('p')?.forEach(handleParagraph);
            }
          }
        });

        if (mutation.type === 'characterData' && mutation.target.nodeType === 3) {
          const p = mutation.target.parentElement;
          if (p?.tagName === 'P') {
            handleParagraph(p);
          }
        }
      });
    });

    observer.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    container.querySelectorAll('p').forEach(handleParagraph);
  }

  function scanAndObserve() {
    const containers = document.querySelectorAll('div.css-ji4crq');
    const last = containers[containers.length - 1];
    if (last) observeContainer(last);
  }

  scanAndObserve();
  setInterval(scanAndObserve, 500);
})();