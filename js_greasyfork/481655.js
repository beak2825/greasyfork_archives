// ==UserScript==
// @name         自定义油猴脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调整b站蔡徐坤用户名为社会你坤哥
// @author       wutian
// @match        https://space.bilibili.com/324287009*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481655/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/481655/%E8%87%AA%E5%AE%9A%E4%B9%89%E6%B2%B9%E7%8C%B4%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
(function() {
    'use strict';
     console.log('自定义的油猴脚本,暗武逢天');
    window.onload = function(){
      $('#h-name').text('社会你坤哥,联系两年半');
    }

    // Your code here...
})();