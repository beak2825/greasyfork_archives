// ==UserScript==
// @name         muah.ai - Unblur Images + Remove VIP Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Removes blur-effect and deletes Unlock VIP buttons across muah.ai pages, including dynamic content
// @author       you
// @license      MIT
// @match        https://muah.ai/*
// @match        https://*.muah.ai/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546679/muahai%20-%20Unblur%20Images%20%2B%20Remove%20VIP%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/546679/muahai%20-%20Unblur%20Images%20%2B%20Remove%20VIP%20Button.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // Hard override via CSS to defeat re-applied styles
  const style = document.createElement('style');
  style.textContent = `
    .blur-effect { filter: none !important; -webkit-filter: none !important; }
    button.unlock-vip, .unlock-vip, button.premium-btn.unlock-vip { display: none !important; }
  `;
  (document.documentElement || document.head || document.body).appendChild(style);

  const cleanNode = (root) => {
    if (!root || root.nodeType !== 1) return;

    // Unblur elements carrying the class
    if (root.classList && root.classList.contains('blur-effect')) {
      root.classList.remove('blur-effect');
      root.style.filter = 'none';
      root.style.webkitFilter = 'none';
    }
    root.querySelectorAll('.blur-effect').forEach(el => {
      el.classList.remove('blur-effect');
      el.style.filter = 'none';
      el.style.webkitFilter = 'none';
    });

    // Remove Unlock VIP buttons everywhere
    root.querySelectorAll('button.unlock-vip, .unlock-vip, button.premium-btn').forEach(el => {
      const txt = (el.textContent || '').trim().toLowerCase();
      if (txt.includes('unlock vip') || el.classList.contains('unlock-vip')) {
        el.remove();
      }
    });
  };

  const cleanPage = () => cleanNode(document);

  // Run ASAP
  cleanPage();

  // MutationObserver for dynamic changes and class flips
  const obs = new MutationObserver(muts => {
    for (const m of muts) {
      if (m.type === 'childList') {
        m.addedNodes.forEach(n => cleanNode(n));
      } else if (m.type === 'attributes' && m.attributeName === 'class') {
        cleanNode(m.target);
      }
    }
  });
  obs.observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class']
  });

  // Redundant sweep in case of shadow DOM or script shenanigans
  setInterval(cleanPage, 1000);
})();

/*
MIT License

Copyright (c) 2025 <your name>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files, to deal in the Software
without restriction, including without limitation the rights to use, copy,
modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED
"AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT.
*/
