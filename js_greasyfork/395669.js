// ==UserScript==
// @name        tms-inject-jquery
// @version     1.0.13
// @description 为页面注入jQuery引用节点,便于使用控制台调试jQuery选择器等.
// @license     MIT
// @namespace   https://github.com/fjxhkj/tms-inject-jquery
// @supportURL  https://github.com/fjxhkj/tms-inject-jquery
// @match       *://*/*
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/395669/tms-inject-jquery.user.js
// @updateURL https://update.greasyfork.org/scripts/395669/tms-inject-jquery.meta.js
// ==/UserScript==

(function() {
  'use strict';
  console.log('check jquery');
  waitForEl('body', function() {
    if ((typeof $) === 'undefined') {
      var scheme = window.location.protocol;
      var node = document.createElement('script');
      node.setAttribute('src',
           scheme + '//cdn.staticfile.org/jquery/1.12.4/jquery.min.js');
      document.body.appendChild(node);
      console.log('jQuery v1.12.4 append!');
    }
    else {
      console.log('jQuery already exists, ver: ' + $.fn.jquery);
    }
  }, 3000);

  /**
   * 等待指定CSS选择器的DOM元素出现
   *
   * @param selector [CSS选择器语法参考](https://www.runoob.com/cssref/css-selectors.html)
   * @param callback 回调函数,如果超时则回调函数参数为null,否则为目标DOM元素
   * @param maxtries 尝试次数,设为0时至少会尝试一次,设为 false 则一直尝试,设为大于0的整数则尝试该次数
   * @param interval 尝试间隔,单位毫秒
   */
  function waitForEl(selector, callback, maxtries = false, interval = 100) {
    var poller = setInterval(function() {
      var el = document.querySelector(selector);
      var retry = maxtries === false || maxtries-- > 0;
      if (el === null && retry) {
        return;
      }
      clearInterval(poller);
      callback(el || null);
    }, interval);
  }

})();