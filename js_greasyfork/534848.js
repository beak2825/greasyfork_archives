// ==UserScript==
// @name         bp ad whitelister
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ad whitelister for bp
// @author       zuv
// @match        *://*.brickplanet.com/*
// @grant        none
// @license      https://www.gnu.org/licenses/gpl-3.0.txt
// @downloadURL https://update.greasyfork.org/scripts/534848/bp%20ad%20whitelister.user.js
// @updateURL https://update.greasyfork.org/scripts/534848/bp%20ad%20whitelister.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const FALLBACK = [
    { img: 'https://www.brickplanet.com/cdn/ads/i3qmdSJNZVCPt5ytGmJt3xFGmIhzgewRH3D4.png', link: 'https://www.brickplanet.com/ad/click/xyjfudnczgaje6qz-ndjsymvo5izhkmza' },
    { img: 'https://www.brickplanet.com/cdn/ads/IgpYXCqulyZR7zAce80I1ZWvbv5AtMv9sjmO.png', link: 'https://www.brickplanet.com/ad/click/nibk8powsf0eft6d-d14id6eop04xqnmw' },
    { img: 'https://www.brickplanet.com/cdn/ads/8UAVMiDSfanv8uUbR9YrreJbbUlo1qik7n2i.png', link: 'https://www.brickplanet.com/ad/click/3dld9hmzpmszxjah-7xmftowmzved2xkb' },
    { img: 'https://www.brickplanet.com/cdn/ads/Zj1ZdlcGIMxOX7tKnyvCxymhNzVzaIyJnaJx.jpg', link: 'https://www.brickplanet.com/ad/click/xcpdwfkpvdaqcjpx-y6d3gsrqao3z9tpl' },
    { img: 'https://www.brickplanet.com/cdn/ads/2cW1VewidxlfgIpV88yfTMUHC5uZ91x7D4cG.png', link: 'https://www.brickplanet.com/ad/click/wakkelrziueb7bfr-stasmdqcmixui0z2' }
  ];

  const WHITELIST = [
    'https://www.brickplanet.com/ad/click/eb1l20yuj1eqkril-vd7wba3blfxon8do',
    'https://www.brickplanet.com/ad/click/1mqu61mvspna0zjs-j9dznufydqqke06v',
    'https://www.brickplanet.com/ad/click/xyjfudnczgaje6qz-ndjsymvo5izhkmza',
    'https://www.brickplanet.com/ad/click/rtse71mnrgzkh5z5-rz3v82xgihgirtff',
    'https://www.brickplanet.com/ad/click/yfikos7wxlc5eyfj-37hzi22eltuf9ge',
    'https://www.brickplanet.com/ad/click/fsza2fmvrdpdac71-7cm6senqqx5y2jbv',
    'https://www.brickplanet.com/ad/click/25mn5jvmcqsk75w5-j07bs0ngi6jrbybi',
    'https://www.brickplanet.com/ad/click/ikjemz7xbjnudmfb-wfyhvfwxifwyloqc',
    'https://www.brickplanet.com/ad/click/xof6ua6gnknfumoc-wifkfkisdqezgh00',
    'https://www.brickplanet.com/ad/click/qbuezjv6gidpxx7n-4kgj1b9crn0zhat5',
    'https://www.brickplanet.com/ad/click/wakkelrziueb7bfr-stasmdqcmixui0z2',
  ];

  const handled = new WeakSet();

  function replaceAd(el) {
    if (handled.has(el)) return;
    handled.add(el);
    const ad = FALLBACK[Math.floor(Math.random() * FALLBACK.length)];
    const img = document.createElement('img');
    img.src = ad.img;
    img.width = 728;
    img.height = 90;
    img.style.margin = '0 auto';
    const link = document.createElement('a');
    link.href = ad.link;
    link.appendChild(img);
    el.replaceWith(link);
  }

  function scanAds() {
    document.querySelectorAll('a[href*="/ad/click/"]').forEach(a => {
      if (handled.has(a)) return;
      if (a.closest('.card.card-body.mb-4.text-center')) return;

      const href = a.getAttribute('href');
      if (!WHITELIST.includes(href)) replaceAd(a);
      else handled.add(a);
    });
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      m.addedNodes.forEach(n => {
        if (n.nodeType === 1) scanAds();
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(scanAds, 1000);
})();
