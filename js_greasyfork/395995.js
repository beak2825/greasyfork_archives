// ==UserScript==
// @name        文泉学堂自动翻页
// @namespace   https://greasyfork.org/users/77567
// @description 双击切换自动滚屏
// @include     http*
// @version     2020.02.03.02
// @author      网易音乐人 小红
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/395995/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/395995/%E6%96%87%E6%B3%89%E5%AD%A6%E5%A0%82%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

;(function(document) {
  var enable = false;
  var handler = 0;

  var dbclick = function() {
    enable = !enable;
    clearTimeout(handler);
    if (enable) aScroll();
  };

  document.body.removeEventListener('dblclick', dbclick);
  document.body.addEventListener('dblclick', dbclick);

  var aScroll = function() {
    if (enable) document.documentElement.scrollTop += 6;
    handler = setTimeout(aScroll, 25);
  };
})(document);