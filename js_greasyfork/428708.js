// ==UserScript==
// @name        修复页面手势滚动
// @namespace   https://github.com/qinxs
// @description 屏蔽input、textarea占用页面滚动快捷键（Ctrl+Home，Ctrl+End, PageUp，PageDown）
// @author      qinxs
// @version     1.0
// @include   http:*
// @include   https:*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/428708/%E4%BF%AE%E5%A4%8D%E9%A1%B5%E9%9D%A2%E6%89%8B%E5%8A%BF%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/428708/%E4%BF%AE%E5%A4%8D%E9%A1%B5%E9%9D%A2%E6%89%8B%E5%8A%BF%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==
(function(){
  
  'use strict';
  document.addEventListener("keydown", function(e) {
    var keyCode = e.keyCode || e.which;
    var ctrlKey = e.ctrlKey || e.metaKey;
    
    if((ctrlKey && [35,36].includes(keyCode)) || [33,34].includes(keyCode)) {
      document.activeElement.blur();
      document.body.click();
    }

    return false;
  })
  
})();