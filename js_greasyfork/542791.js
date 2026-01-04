// ==UserScript==
// @name         Bilibili Cid
// @namespace    http://tampermonkey.net/
// @version      2025-07-25
// @description  显示bilibili视频的cid
// @author       aoi
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542791/Bilibili%20Cid.user.js
// @updateURL https://update.greasyfork.org/scripts/542791/Bilibili%20Cid.meta.js
// ==/UserScript==

(function () {
  ('use strict');

  function waitForElm(selector) {
    return new Promise((resolve) => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }

      const observer = new MutationObserver((mutations) => {
        if (document.querySelector(selector)) {
          observer.disconnect();
          resolve(document.querySelector(selector));
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });
    });
  }

  waitForElm('.bpx-player-dm-hint').then((target) => {
    const cidButton = document.createElement('button');
    cidButton.textContent = cid;
    cidButton.type = 'button';
    cidButton.style.marginRight = '5px';
    cidButton.id = 'cid-button';

    cidButton.addEventListener('click', async () => {
      const newCid = cid;
      cidButton.textContent = newCid;

      try {
        await navigator.clipboard.writeText(newCid);
        console.log('Copied:', newCid);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    });

    target.replaceWith(cidButton);
  });
})();
