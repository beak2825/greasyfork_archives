// ==UserScript==
// @name        open shadow-root
// @namespace   Tutu
// @icon        https://i.loli.net/2021/06/07/fCELVSNKiqDUTyv.png
// @match       http*://*.bilibili.com/*
// @run-at      document-start
// @version     1.1
// @author      Tutu
// @description 改变 shadow-root 节点的状态, 将 close 改成 open
// @downloadURL https://update.greasyfork.org/scripts/427616/open%20shadow-root.user.js
// @updateURL https://update.greasyfork.org/scripts/427616/open%20shadow-root.meta.js
// ==/UserScript==
(function() {
  const originalAttachShadow = Element.prototype.attachShadow
  Element.prototype.attachShadow = function (args) {
      args.mode = 'open'
      return originalAttachShadow.call(this, args)
  }
  // 直接修改 useragent 变成不支持 shadow-dom 的浏览器 如 Firefox 63 以下的是不支持的
  let customUserAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:61.0) Gecko/20100101 Firefox/61.0';
  Object.defineProperty(navigator, 'userAgent', {
      value: customUserAgent,
      writable: false
  });
console.log(navigator.userAgent);
})();
