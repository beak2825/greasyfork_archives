// ==UserScript==
// @name         我知道百度知道
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  方便从百度知道摘录内容
// @author       YF
// @match        https://zhidao.baidu.com/question/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418518/%E6%88%91%E7%9F%A5%E9%81%93%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93.user.js
// @updateURL https://update.greasyfork.org/scripts/418518/%E6%88%91%E7%9F%A5%E9%81%93%E7%99%BE%E5%BA%A6%E7%9F%A5%E9%81%93.meta.js
// ==/UserScript==

var e = document.querySelectorAll('#qb-content span');
var re = /[a-z0-9]{11}/;
for (const i of e) {
  if (re.test(i.className) && (i.offsetWidth == 1 && i.clientWidth == 1)) {
      i.parentNode.removeChild(i);
  }
}
