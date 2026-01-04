// ==UserScript==
// @name         bv2av
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  Change bv to av
// @author       ouuan
// @license      MIT
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398535/bv2av.user.js
// @updateURL https://update.greasyfork.org/scripts/398535/bv2av.meta.js
// ==/UserScript==

(function () {
  // https://socialsisteryi.github.io/bilibili-API-collect/docs/misc/bvid_desc.html#bv-av%E7%AE%97%E6%B3%95

  const XOR_CODE = 23442827791579n;
  const MASK_CODE = 2251799813685247n;
  const BASE = 58n;

  const data = 'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';

  function dec(bvid) {
    const bvidArr = Array.from(bvid);
    [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
    [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
    bvidArr.splice(0, 3);
    const tmp = bvidArr.reduce(
      (pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)),
      0n,
    );
    // eslint-disable-next-line no-bitwise
    return `av${Number((tmp & MASK_CODE) ^ XOR_CODE)}`;
  }

  function bv2av(x) {
    if (!x.match('www.bilibili.com')) return x;
    if (x.includes('/watchlater')) return x;
    const bvs = x.match(
      /[bB][vV][fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF]{10}/g,
    );
    if (bvs) {
      for (const bv of bvs) {
        x = x.replace(bv, () => dec(bv));
      }
    }
    if (x.match(/bilibili.com\/av\d+/)) {
      x = x.replace(/(av\d+)/, 'video/$1');
    }
    return x;
  }

  setInterval(() => {
    const url = window.location.href;
    const newUrl = bv2av(url);
    if (url !== newUrl) {
      window.history.replaceState(null, null, newUrl);
    }
  }, 1000);

  setInterval(() => {
    const as = document.querySelectorAll('a');
    for (const o of as) {
      if (o.href) o.href = bv2av(o.href);
    }
    const divs = document.querySelectorAll('div');
    for (const o of divs) {
      if (o.title) o.title = bv2av(o.title);
    }
  }, 500);

  if ('navigation' in window) {
    window.navigation.addEventListener('navigate', (e) => {
      const { url } = e.destination;
      const newUrl = bv2av(url);
      if (url !== newUrl) {
        window.history.replaceState(null, null, newUrl);
      }
    });
  }
}());
