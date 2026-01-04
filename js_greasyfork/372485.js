// ==UserScript==
// @name         精简QQ邮箱界面 Mail Decorator
// @namespace    https://greasyfork.org/zh-CN/users/372485
// @version      0.0.1
// @description  精简QQ邮箱界面
// @author       Chegde
// @match        *://mail.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372485/%E7%B2%BE%E7%AE%80QQ%E9%82%AE%E7%AE%B1%E7%95%8C%E9%9D%A2%20Mail%20Decorator.user.js
// @updateURL https://update.greasyfork.org/scripts/372485/%E7%B2%BE%E7%AE%80QQ%E9%82%AE%E7%AE%B1%E7%95%8C%E9%9D%A2%20Mail%20Decorator.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (location.pathname.indexOf('frame_html') >= 0) { }
    window.addEventListener('load', function () { });

    var getQueryParameter = function (name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };


    var remove = function (dom) {
        if (dom instanceof HTMLElement) {
            dom.remove();
            return;
        }
        var s = document.querySelector(dom);
        if (s) {
            s.remove();
        }
    }

    var list = [
        // 左上角logo
        '.imglogo',
        '.header_logo',

        // 首页中间横屏展示
        '#todayMain2',
        '#todayTool2',
        '#TodayRightInbox',

        // 更多应用
        '#folder_morefunction_td',

        // favicon
        "link[rel*='icon']",
        '#folder_129_td',

        // 底部
        '.todaybottominfo',
    ];


    for (var i = 0; i < list.length; i = i + 1) {
        remove(list[i]);
    }

    // 顶部个人信息
    var info = document.querySelector('#logotips');
    if (info) {
        info.style.marginLeft = '20px';
    }

    // 自助查询 重新写入
    var TodayInBox = document.querySelector('#TodayInBox');
    var staticQuery = document.createElement("li");
    var queryUrl = "./help_static_login?sid=" + getQueryParameter('sid');
    staticQuery.innerHTML = '<a href="' + queryUrl + '">自助查询</a>';
    TodayInBox.appendChild(staticQuery);

    // 删除文字
    var commerce = document.querySelectorAll('span');
    for (var commerceIndex = 0; commerceIndex < commerce.length; commerceIndex = commerceIndex + 1) {
        if (commerce[commerceIndex].innerText.indexOf('Tencent') >= 0) {
            commerce[commerceIndex].innerText = commerce[commerceIndex].innerText.replace('Tencent', '');
        }
    }
})();