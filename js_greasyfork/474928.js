// ==UserScript==
// @name        图像预览修正 - telegra.ph
// @namespace   uk.jixun
// @match       https://telegra.ph/*
// @grant       none
// @version     1.1
// @author      Jixun
// @run-at      document-start
// @description 通过更改引用来源规则来让 telegra.ph 的图片能正常加载。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/474928/%E5%9B%BE%E5%83%8F%E9%A2%84%E8%A7%88%E4%BF%AE%E6%AD%A3%20-%20telegraph.user.js
// @updateURL https://update.greasyfork.org/scripts/474928/%E5%9B%BE%E5%83%8F%E9%A2%84%E8%A7%88%E4%BF%AE%E6%AD%A3%20-%20telegraph.meta.js
// ==/UserScript==

const BURST_TIMER_THRESHOLD = 1000 * 60 * 60 * 30; // keep the same burst timer for 30 days
const CLEAR_REFERRER_ORIGINS = [
  'https://mmbiz.qpic.cn',
  /^https:\/\/[-\w]+.xhscdn.com$/
];

const matchOrigin = originForTest => {
  return (rule) => {
    if (rule === originForTest) return true;
    if (rule instanceof RegExp) {
      return rule.test(originForTest);
    }
    return false;
  }
};

function main() {
  const now = Date.now();
  let cacheBurstTimer = localStorage.cacheBurstTimer || (localStorage.cacheBurstTimer = now);
  if (now - parseInt(cacheBurstTimer, 10) > BURST_TIMER_THRESHOLD) {
    localStorage.cacheBurstTimer = cacheBurstTimer = now;
  }

  // Cache burst without referrer
  for(const img of document.querySelectorAll('img')) {
    img.referrerPolicy = 'no-referrer';
    img.loading = 'lazy';
    const url = new URL(img.src);
    const shouldBurstReferrer = CLEAR_REFERRER_ORIGINS.some(matchOrigin(url.origin));
    if (shouldBurstReferrer) {
      url.search += `${url.search ? `&` : '?'}_=${cacheBurstTimer}`;
      img.src = String(url);
    }
  }
}

addEventListener('DOMContentLoaded', main);
window?.body && main();
