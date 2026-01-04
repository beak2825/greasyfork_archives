// ==UserScript==
// @name         MIB-CMDB-其他样式修改
// @namespace    http://tampermonkey.net/
// @version      0.7
// @author       feiazifeiazi@163.com
// @description  修改样式。
// @match        https://cmdbtest.xcreditech.com/*
// @match        https://cmdb.xcreditech.com/*
// @exclude      https://cmdb.xcreditech.com/dashboard/
// @exclude      https://cmdbtest.xcreditech.com/dashboard/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xcreditech.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474995/MIB-CMDB-%E5%85%B6%E4%BB%96%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/474995/MIB-CMDB-%E5%85%B6%E4%BB%96%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==


(function() {

    // 使用jQuery选择所有具有类名“p-table-input”的元素并设置min-height
    $('.p-table-input').css('min-height', '280px');

     // 应用 .main 类的样式
    $('.main').css({
        'margin-left': '0px',
        'padding': '0px'
    });

    // 应用 .main-con 类的样式
    $('.main-con').css({
        'padding': '12px',
        'min-height': '550px'
    });
   // 去除左边框
   $('aside.sidebar').hide();



})();