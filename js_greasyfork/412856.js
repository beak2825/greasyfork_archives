// ==UserScript==
// @name         9dm每日计算自动填入
// @namespace    http://tampermonkey.net/
// @version      2.4.5
// @description  9dm每日计算验证自动填入；旧的收藏页面地址重定向到新地址；搜索计算自动验证
// @author       liuyubing
// @match        *://www.9dmdamaomod.com/*
// @match        *://www.9dmdamaomod.net/*
// @match        *://www.9damaogame.net/*
// @match        *://www.9damaogames.com/*
// @match        *://www.9dmsgame.com/*
// @match        *://www.9dmsgame.net/*
// @match        *://www.9dmgamemod.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/412856/9dm%E6%AF%8F%E6%97%A5%E8%AE%A1%E7%AE%97%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/412856/9dm%E6%AF%8F%E6%97%A5%E8%AE%A1%E7%AE%97%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';
  /** 当前使用的 host */
  const CURRENT_HOST = 'www.9dmgamemod.com';

  const { search, protocol, pathname, host } = window.location;
  if (/\/gonggao\//.test(pathname) || host !== CURRENT_HOST) {
    // 如果pathname为/gonggao/则为com到net重定向地址
    // 如果当前 host 跟预设 host 不同则重定向
    let tid = '';
    try {
      tid = search.match(/tid=(\d+)/)[1];
    } catch {}
    if (tid) {
      const nHref = `${protocol}//${CURRENT_HOST}/thread-${tid}-1-1.html`;
      window.open(nHref, '_self');
      return;
    }
  }

  window.addEventListener('load', () => {
    // 每日计算自动填入
    setTimeout(() => {
      if (document.getElementsByName('answer').length) {
        document.getElementsByName('answer')[0].value = document
          .querySelector('b')
          .innerText.replace(/[^0-9]/gi, ',')
          .split(',')
          .filter((i) => Number(i))
          .reduce((a, b) => Number(a) + Number(b));
        document.getElementsByName('secqsubmit')[0].click();
      }
    }, 100);

    // 搜索计算自动验证
    const domSearchMask = document.querySelector('.mask');
    domSearchMask && (domSearchMask.style.display = 'none');
  });
})();
