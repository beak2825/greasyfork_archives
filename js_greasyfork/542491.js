// ==UserScript==
// @name         Samsung → Slickdeals Deal Finder
// @namespace    https://github.com/sinazadeh/userscripts
// @version      1
// @description  Search on Slickdeals for deals.
// @match        https://www.samsung.com/us/*
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/542491/Samsung%20%E2%86%92%20Slickdeals%20Deal%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/542491/Samsung%20%E2%86%92%20Slickdeals%20Deal%20Finder.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForElement(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;

      const check = () => {
        const el = document.querySelector(selector);
        if (el) resolve(el);
        else if ((elapsed += interval) >= timeout) reject("Element not found: " + selector);
        else setTimeout(check, interval);
      };
      check();
    });
  }

  waitForElement("h1[class*='H1_']").then(h1 => {
    const fullTitle = h1.textContent.trim();  // ⬅️ no year removal

    // Optional: trim to first 8 words
    const trimmedTitle = fullTitle.split(/\s+/).slice(0, 8).join(' ');

    // Final search URL using your preferred pattern
    const query = encodeURIComponent(trimmedTitle);
    const searchUrl = `https://slickdeals.net/search?q=${query}&searchtype=normal&filters%5Bforum%5D%5B%5D=&sort=recent&filters%5Brating%5D%5B%5D=all&filters%5Bdate%5D%5B%5D=30&filters%5Bprice%5D%5Bmin%5D=&filters%5Bprice%5D%5Bmax%5D=&page=1`;

    const button = document.createElement('button');
    button.textContent = `🔍 Slickdeals: ${trimmedTitle}`;
    button.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      padding: 12px 18px;
      font-size: 15px;
      background: #ffce00;
      color: #000;
      border: none;
      border-radius: 8px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      cursor: pointer;
    `;
    button.onclick = () => window.open(searchUrl, '_blank');
    document.body.appendChild(button);
  }).catch(console.error);
})();
