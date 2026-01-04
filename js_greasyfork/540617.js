// ==UserScript==
// @name         SpicyChat Avatar Preview
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Click avatar to show full uncropped version
// @author       Orgacord
// @match        *://spicychat.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540617/SpicyChat%20Avatar%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/540617/SpicyChat%20Avatar%20Preview.meta.js
// ==/UserScript==

(function () {
  'use strict';

  GM_addStyle(`
    .avatar-preview-fixed {
      position: fixed;
      bottom: 20px;
      left: 280px;
      width: 400px;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 5px 25px rgba(0, 0, 0, 0.5);
      background: #000;
      z-index: 9999;
    }

    .avatar-preview-fixed img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #000;
    }

    .avatar-preview-fixed .close-btn {
      position: absolute;
      top: 6px;
      right: 8px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      width: 20px;
      height: 20px;
      font-size: 14px;
      font-weight: bold;
      color: #000;
      text-align: center;
      line-height: 20px;
      cursor: pointer;
    }
  `);

  function getFullImageUrl(src) {
    const url = new URL(src);
    url.searchParams.delete('class');
    return url.toString();
  }

  function removePreview() {
    document.querySelector('.avatar-preview-fixed')?.remove();
  }

  function showPreview(src) {
    removePreview();

    const container = document.createElement('div');
    container.className = 'avatar-preview-fixed';

    const closeBtn = document.createElement('div');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = removePreview;

    const img = document.createElement('img');
    img.src = getFullImageUrl(src);

    container.appendChild(img);
    container.appendChild(closeBtn);
    document.body.appendChild(container);
  }

  function bindAvatars() {
    const avatars = document.querySelectorAll('img[src*="avatar"]:not([data-full-preview-bound])');
    avatars.forEach(img => {
      img.dataset.fullPreviewBound = 'true';
      img.addEventListener('click', e => {
        e.stopPropagation();
        showPreview(img.src);
      });
    });
  }

  // Initial bind + observe DOM changes
  bindAvatars();
  new MutationObserver(bindAvatars).observe(document.body, { childList: true, subtree: true });

  // Observe URL changes (detect single-page navigation)
  let lastUrl = location.href;
  setInterval(() => {
    if (location.href !== lastUrl) {
      lastUrl = location.href;
      removePreview();
    }
  }, 500);
})();
