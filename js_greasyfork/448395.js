// ==UserScript==
// @name         美团测试
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  获取美团酒店文本测试
// @author       You
// @include      *://eb.meituan.com/ebk/consume/order.html
// @include      *://ebooking.meituan.com/ebk/consume/order.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=meituan.com
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license MIT
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/448395/%E7%BE%8E%E5%9B%A2%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/448395/%E7%BE%8E%E5%9B%A2%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    'use strict';


   setInterval(function () { //每5秒刷新一次图表
         //需要执行的代码写在这里
      window.location.reload()
    }, 60000*30);

})();
