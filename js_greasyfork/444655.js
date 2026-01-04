// ==UserScript==
// @name         飞极速优化
// @namespace    Pudon
// @include      *://*feijisu*/*
// @include      *://*fjisu*/*
// @version      0.0.1
// @grant        none
// @license      MIT
// @description  飞极速去广告
// @downloadURL https://update.greasyfork.org/scripts/444655/%E9%A3%9E%E6%9E%81%E9%80%9F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444655/%E9%A3%9E%E6%9E%81%E9%80%9F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  document.addEventListener('DOMNodeInserted', e => {
    var _el = e.target
    var _adList = ['HMRichBox', 'HMcoupletDivright', 'HMcoupletDivleft']
    // 清除广告
    if (_adList.indexOf(_el.id) > -1) {
      _el.remove()
    }
  }, false)
})();
