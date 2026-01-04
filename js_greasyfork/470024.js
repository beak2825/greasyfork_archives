// ==UserScript==
// @name         禁用切屏检测
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  禁用职教云网页切屏检测
// @author       mmuyu
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470024/%E7%A6%81%E7%94%A8%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/470024/%E7%A6%81%E7%94%A8%E5%88%87%E5%B1%8F%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

Object.defineProperty(document, 'visibilityState', {
    configurable: true,
    get: function() {
        return 'visible';
    }
});
Object.defineProperty(document, 'hasFocus', {
  value: () => true,
});
Object.defineProperty(document, 'hidden', {
  configurable: true,
  get: function() {
    return false;
  },
});
(function() {
  var originalOnBlur = window.onblur;

  window.onblur = function() {
    // 阻止事件执行
    return false;
  };

  // 在必要的时候调用原始的 window.onblur
  window.restoreOnBlur = function() {
    window.onblur = originalOnBlur;
  };
})();