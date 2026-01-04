// ==UserScript==
// @name         修改网页字体
// @namespace    zd-change-font
// @version      0.2
// @description  强制修改网页字体为指定的字体
// @author       zd
// @include      *
// @excludex     *//localhost*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442087/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/442087/%E4%BF%AE%E6%94%B9%E7%BD%91%E9%A1%B5%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
  'use strict';
  // Your code here...
  let fontList = [`'Source Han Serif SCx'`, `'Source Han Sans SCx'`, `'HarmonyOS Sans SC'`];
  let styleTxt = `html *:not(i,[class*="icon"i]) {font-family:${fontList.join(',')} !important}`;
  //GM_addStyle(styleTxt);
  let style = document.createElement('style');
  style.innerHTML = styleTxt;
  if (location.host.includes('baidu.com')) {
    style.setAttribute('data-for', 'zd');
  }
  if (document.head) {
    document.head.append(style);
  } else {
    let timer = window.setInterval(() => {
      if (document.head) {
        clearInterval(timer);
        document.head.append(style);
      }
    }, 10);
  }
})();
