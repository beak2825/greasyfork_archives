// ==UserScript==
// @name           Change Wikipedia skin to the previous one
// @name:ja        Wikipediaのスキンを以前のものに変更する
// @namespace      https://greasyfork.org/users/783910
// @version        1.1.3
// @description    Change Japanese Wikipedia skin to vector
// @description:ja Wikipediaのスキンをvectorに変更する
// @author         ysnr777
// @match          *://*.wikipedia.org/*
// @icon           https://www.google.com/s2/favicons?domain=wikipedia.org
// @grant          none
// @license        WTFPL
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/447684/Wikipedia%E3%81%AE%E3%82%B9%E3%82%AD%E3%83%B3%E3%82%92%E4%BB%A5%E5%89%8D%E3%81%AE%E3%82%82%E3%81%AE%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/447684/Wikipedia%E3%81%AE%E3%82%B9%E3%82%AD%E3%83%B3%E3%82%92%E4%BB%A5%E5%89%8D%E3%81%AE%E3%82%82%E3%81%AE%E3%81%AB%E5%A4%89%E6%9B%B4%E3%81%99%E3%82%8B.meta.js
// ==/UserScript==

const url = new URL(location.href);
if (!url.searchParams.has('useskin')) {
  url.searchParams.set('useskin', 'vector');
  location.replace(url);
}

/**
 * ページ内リンクのurlにパラメータ付与 ※ver1.1.0で削除
 */
// document.addEventListener('DOMContentLoaded', () => {
//   for (const el of document.getElementsByTagName('a')) {
//     if (0 < el.href.length) {
//       const href = new URL(el.href);
//       if (href.origin == url.origin && !href.searchParams.has('useskin')) {
//         href.searchParams.set('useskin', 'vector');
//         el.href = href.href;
//       }
//     }
//   }
// });
