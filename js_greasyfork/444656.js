// ==UserScript==
// @name         蓝湖优化
// @namespace    Pudon
// @match        *://*.lanhuapp.com/*
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/1.12.4/jquery.min.js
// @version      0.0.2
// @grant        none
// @license      MIT
// @description  去除蓝湖顶部绑定手机提示bar,增加产品原型文档搜索
// @downloadURL https://update.greasyfork.org/scripts/444656/%E8%93%9D%E6%B9%96%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/444656/%E8%93%9D%E6%B9%96%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
  document.addEventListener('DOMNodeInserted', (e) => {
    var _el = e.target
    // 清除顶部绑定手机bar
    if (_el.className === 'onboarding' || _el.className === 'onboarding-top') {
        _el.remove()
    }
  }, false)
})();