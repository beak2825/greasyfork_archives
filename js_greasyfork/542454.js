// ==UserScript==
// @name         Bypass Ysm lol
// @namespace    liebert
// @version      4.0
// @description  self explain
// @match        *://biharkhabar.net/*
// @match        *://newkhabar24.com/*
// @match        *://insurance.odiadance.com/*
// @match        *://goodmorningimg.com/*
// @match        *://go.just2earn.com/*
// @match        *://*.ysmteam.xyz/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542454/Bypass%20Ysm%20lol.user.js
// @updateURL https://update.greasyfork.org/scripts/542454/Bypass%20Ysm%20lol.meta.js
// ==/UserScript==

(function () {
  'use strict';

  if (window.hadesFinalScriptLoaded) return;
  window.hadesFinalScriptLoaded = true;

  const host = location.hostname;
  const path = location.pathname;

  if (
    host === 'biharkhabar.net' ||
    host === 'newkhabar24.com' ||
    host === 'insurance.odiadance.com' ||
    host === 'goodmorningimg.com'
  ) {
    const interval = setInterval(() => {
      const button = document.querySelector('center a button#tp-snp2') ||
        [...document.querySelectorAll('center a button')]
          .find(b => b.innerText.toUpperCase().includes('COUNTIUE'));
      const href = button?.closest('a')?.href;
      if (href) {
        clearInterval(interval);
        location.href = href;
      }
    }, 100);
  }

  if (host === 'go.just2earn.com') {
    const interval = setInterval(() => {
      const timer = document.querySelector('#timer');
      const button = document.querySelector('.get-link');
      if (timer && button) {
        const time = parseInt(timer.innerText);
        if (time === 0 && !button.classList.contains('disabled')) {
          clearInterval(interval);
          button.click();
        }
      }
    }, 300);
  }

  if (
    (host === 'ysmteam.xyz' || host === 'www.ysmteam.xyz') &&
    !path.includes('/public/key/active.php')
  ) {
    const key_elem = document.querySelector('p.key')?.innerText;
    const key_url = new URLSearchParams(location.search).get('key');
    const key = key_elem || key_url;
    if (key) navigator.clipboard.writeText(key);
  }
})();