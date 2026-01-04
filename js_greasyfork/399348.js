// ==UserScript==
// @name        链接新标签页打开
// @namespace   Violentmonkey Scripts
// @match       http://*/*
// @match       https://*/*
// @grant       none
// @version     1.1
// @author      liang
// @grant       unsafeWindow
// @description 设置链接新标签页打开
// @downloadURL https://update.greasyfork.org/scripts/399348/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/399348/%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
(function(){
  'use strict';
  var a = document.getElementsByTagName('a')
  for(var i = 0;i < a.length - 1 ;i++){
    a[i].setAttribute('target','_blank');
  }
})();