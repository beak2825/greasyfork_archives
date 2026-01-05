// ==UserScript==
// @name        AutoScroll
// @namespace   https://greasyfork.org/users/11909
// @description AutoScroll - 双击切换自动滚屏
// @include     http*
// @version     2016.03.07.01
// @author      OscarKoo
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/17851/AutoScroll.user.js
// @updateURL https://update.greasyfork.org/scripts/17851/AutoScroll.meta.js
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
    if (enable) document.documentElement.scrollTop += 3;
    handler = setTimeout(aScroll, 25);
  };
})(document);