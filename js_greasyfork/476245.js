// ==UserScript==
// @name         Hide Image 隐藏图片
// @namespace    https://github.com/yujinpan/tampermonkey-extension
// @version      1.1
// @license      MIT
// @description  Hide all image in website。
// @author       yujinpan
// @include      http*://**
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/476245/Hide%20Image%20%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/476245/Hide%20Image%20%E9%9A%90%E8%97%8F%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function () {
  const style = document.createElement('style');
  style.innerHTML = 'img,video{display:none!important;}*{background-image:none!important;}';
  document.head.append(style);
})();