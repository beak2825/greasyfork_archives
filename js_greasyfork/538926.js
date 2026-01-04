// ==UserScript==
// @name         瑞数后缀Hook脚本
// @namespace    PyHaoCoder
// @version      1.0
// @description  通过重写XMLHttpRequest的open方法来拦截加密前的明文URL，可以通过脚本查看接口的查询参数
// @author       PyHaoCoder
// @icon         https://www.riversecurity.com/images/blueIcon2.png
// @match        https://*/*
// @license      Proprietary
// @copyright    2025, PyHaoCoder (All Rights Reserved)
// @downloadURL https://update.greasyfork.org/scripts/538926/%E7%91%9E%E6%95%B0%E5%90%8E%E7%BC%80Hook%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/538926/%E7%91%9E%E6%95%B0%E5%90%8E%E7%BC%80Hook%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
  const originalOpen = XMLHttpRequest.prototype.open;

  // 重写 open 方法
  XMLHttpRequest.prototype.open = function(method, url) {
    console.log(`拦截到明文请求: ${method} ${url}`);
    originalOpen.apply(this, arguments);
  };

})();