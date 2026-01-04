// ==UserScript==
// @name         SpaceFrontiers Copier
// @namespace    https://greasyfork.org/
// @version      1.1
// @description  Automatically attach DOI (or the first link) to reference markers and add a copy button (text + hyperlink) for markdown blocks on SpaceFrontiers.org
// @author       Bui Quoc Dung
// @match        https://spacefrontiers.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539059/SpaceFrontiers%20Copier.user.js
// @updateURL https://update.greasyfork.org/scripts/539059/SpaceFrontiers%20Copier.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const sleep = ms => new Promise(res => setTimeout(res, ms));

  async function processMarker(marker) {
    if (marker.dataset.doiProcessed) return;
    marker.dataset.doiProcessed = 'true';

    const popoverId = marker.getAttribute('data-popover-target');
    if (!popoverId) return;

    let popover = document.getElementById(popoverId);
    if (!popover) {
      marker.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
      await sleep(200);
      popover = document.getElementById(popoverId);
    }
    if (!popover) return;

    let linkEl = popover.querySelector('a[href*="doi.org"]');
    if (!linkEl) {
      linkEl = popover.querySelector('a[href]');
    }
    if (!linkEl) return;

    const href = linkEl.href;
    if (!href) return;

    if (marker.tagName.toLowerCase() !== 'a') {
      const a = document.createElement('a');
      a.href = href;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.className = marker.className;
      a.innerHTML = marker.innerHTML;
      a.dataset.doiProcessed = 'true';
      marker.replaceWith(a);
    } else {
      marker.href = href;
      marker.target = '_blank';
      marker.rel = 'noopener noreferrer';
      marker.dataset.doiProcessed = 'true';
    }

    marker.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true }));
  }

  async function processAllMarkers() {
    const markers = document.querySelectorAll('span.reference-marker:not([data-doiProcessed])');
    for (const marker of markers) {
      await processMarker(marker);
    }
  }

  const doiObserver = new MutationObserver(() => {
    processAllMarkers();
  });
  doiObserver.observe(document.body, { childList: true, subtree: true });
  processAllMarkers();

  const markdownObserver = new MutationObserver(() => {
    document.querySelectorAll('div.markdown:not([data-copy-added])').forEach(div => {
      div.setAttribute('data-copy-added', 'true');

      const btnContainer = document.createElement('div');
      btnContainer.style.cssText = `
        text-align: right;
        margin-top: 4px;
      `;

      const button = document.createElement('button');
      button.textContent = 'Copy';
      button.style.cssText = `
        background: #ff9800;
        color: black;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      `;

      btnContainer.appendChild(button);
      div.insertAdjacentElement('afterend', btnContainer);

      button.addEventListener('click', () => {
        const html = div.innerHTML;
        const text = div.innerText;

        const blob = new Blob([html], { type: 'text/html' });
        const data = [new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([text], { type: 'text/plain' })
        })];

        navigator.clipboard.write(data).then(() => {
          button.textContent = 'Copying';
          setTimeout(() => (button.textContent = 'Copy'), 1500);
        }).catch(err => {
          console.error('Clipboard write failed', err);
          alert('❌ Copy failed: ' + err);
        });
      });
    });
  });

  markdownObserver.observe(document.body, { childList: true, subtree: true });
})();
