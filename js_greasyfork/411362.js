// ==UserScript==
// @name         复制网页链接
// @namespace    copy-url
// @description  左键双击页面即可复制页面链接，改善 edge-dev 版不能复制 url 的问题
// @version      1.4
// @author       huhan_y@163.com
// @include      *
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/411362/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/411362/%E5%A4%8D%E5%88%B6%E7%BD%91%E9%A1%B5%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.body.addEventListener('dblclick', function() {
    if(navigator.clipboard){
      navigator.clipboard.writeText(window.location.href);
    }else{
      var input = document.createElement('input');
      document.body.appendChild(input);
      input.value = window.location.href;
      var selection = window.getSelection();
      var range = selection.getRangeAt(0);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  });
})();