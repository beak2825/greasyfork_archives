// ==UserScript==
// @name         自动展开问卷星分页问卷并显示提示
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自动展开问卷星的分页问卷，并在左上角显示提示
// @author       QY
// @match        https://www.wjx.cn/*
// @match        http://www.wjx.cn/*
// @match        https://www.wenjuan.com/*
// @match        http://www.wenjuan.com/*
// @grant        none
// @icon         https://pic.qqtn.com/up/2017-10/2017101813521774869.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/515923/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E9%97%AE%E5%8D%B7%E6%98%9F%E5%88%86%E9%A1%B5%E9%97%AE%E5%8D%B7%E5%B9%B6%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/515923/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E9%97%AE%E5%8D%B7%E6%98%9F%E5%88%86%E9%A1%B5%E9%97%AE%E5%8D%B7%E5%B9%B6%E6%98%BE%E7%A4%BA%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 展开分页问卷
    function expandPage() {
        // 检查是否存在分页并展开
        $('.fieldset').css('display', 'block');
        $('#divSubmit').css('display', 'block');
        $('#divMultiPage').css('display', 'none');
    }

    // 创建提示框
    function createNotification() {
        var notification = document.createElement('div');
        notification.textContent = '检测到问卷有分页，已自动为您展开';
        notification.style.position = 'fixed';
        notification.style.top = '0';
        notification.style.left = '0';
        notification.style.width = '100%';
        notification.style.backgroundColor = 'red';
        notification.style.color = 'white';
        notification.style.textAlign = 'center';
        notification.style.padding = '15px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.zIndex = '9999';
        document.body.appendChild(notification);

        // 5秒后移除提示框
        setTimeout(function() {
            notification.remove();
        }, 1500);
    }

    // 检查是否存在分页
    function checkForPagination() {
        var hasPagination = $('#divMultiPage').length > 0;
        if (hasPagination) {
            expandPage();
            createNotification(); // 创建提示框
        }
    }

    // 绑定事件，在页面加载完成后执行检查分页
    window.addEventListener('load', function() {
        checkForPagination();
    });
})();