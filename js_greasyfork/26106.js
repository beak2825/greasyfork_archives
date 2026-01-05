// ==UserScript==
// @name        MCBBS 允许选中文字和右键菜单
// @description 强行允许在 mcbbs 选择文字，以及弹出右键菜单
// @namespace   org.mcbbs.text-select-contextmenu
// @include     *://www.mcbbs.net/*
// @include     *://mcbbs.net/*
// @version     1.1
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/26106/MCBBS%20%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E5%92%8C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/26106/MCBBS%20%E5%85%81%E8%AE%B8%E9%80%89%E4%B8%AD%E6%96%87%E5%AD%97%E5%92%8C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function (patcher) {
  document.addEventListener('readystatechange', patcher, false);
})(function () {
  document.onselectstart = null;
  document.oncontextmenu = null;
  [].map.call(document.getElementsByTagName('style'), function (style) {
    if (~ style.textContent.indexOf('user-select')) {
      style.textContent = '/* Text-selection patch by Jixun */';
    }
  });
});
