// ==UserScript==
// @name         W3CPlus恢复默认复制
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to restore default copy event
// @author       You
// @match        https://www.w3cplus.com/**/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40638/W3CPlus%E6%81%A2%E5%A4%8D%E9%BB%98%E8%AE%A4%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/40638/W3CPlus%E6%81%A2%E5%A4%8D%E9%BB%98%E8%AE%A4%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取全局的jQuery对象
    var $ = window.jQuery;
    // DOM加载完成后
    $(document).ready(function(){
        // 取消body监听的复制事件
        $('body').off('copy');
    });
})();