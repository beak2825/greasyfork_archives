// ==UserScript==
// @name         Remove Wap.ac Cancelled Orders
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Remove rows with cancelled orders on wap.ac
// @author       iKun
// @match        https://wap.ac/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486758/Remove%20Wapac%20Cancelled%20Orders.user.js
// @updateURL https://update.greasyfork.org/scripts/486758/Remove%20Wapac%20Cancelled%20Orders.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始执行');

    var cancelledRows = document.querySelectorAll('tr td span.label.status-cancelled');

    console.log('找到 ' + cancelledRows.length + ' 行带有 "已取消" 状态');

    cancelledRows.forEach(function(span) {
        var tdElement = span.closest('td');

        if (tdElement) {
            var trElement = tdElement.closest('tr');

            if (trElement) {
                console.log('删除行:', trElement);
                trElement.remove();
            } else {
                console.log('未找到包含 "已取消" 类名的 td 元素所在的 tr 元素');
            }
        } else {
            console.log('未找到包含 "已取消" 类名的 span 元素所在的 td 元素');
        }
    });
    console.log('脚本执行完成');

})();
