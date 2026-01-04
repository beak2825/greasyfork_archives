// ==UserScript==
// @name         轻学堂课程循环删除
// @namespace    https://www.qingxuetang.com
// @version      0.1
// @description  进入企业课程以后会自动删除课程，这个比较危险
// @license      MIT
// @author       明金同学
// @icon         data:image/x-icon;base64,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
// @match        https://www.qingxuetang.com/admin/course/这里改ID
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470058/%E8%BD%BB%E5%AD%A6%E5%A0%82%E8%AF%BE%E7%A8%8B%E5%BE%AA%E7%8E%AF%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/470058/%E8%BD%BB%E5%AD%A6%E5%A0%82%E8%AF%BE%E7%A8%8B%E5%BE%AA%E7%8E%AF%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 setInterval 来实现循环点击，因为每次点击后都会弹出确认框，必须等待确认框处理完毕才能点击下一个
    var intervalID = setInterval(function() {
        // 获取第一个删除按钮
        var $deleteBtn = $('a.delete.j-delete').first();
        if ($deleteBtn.length) { // 判断是否还有删除按钮
            $deleteBtn.click(); // 模拟点击删除
            // 等待弹出框的动画执行完毕
            setTimeout(function() {
                // 点击确认删除
                var $confirmBtn = $('div.layui-layer-btn a.layui-layer-btn1');
                if ($confirmBtn.length) {
                    $confirmBtn.click();
                }
            }, 1000);
        } else { // 如果没有删除按钮了，清除定时器
            clearInterval(intervalID);
        }
    }, 2000);
})();
