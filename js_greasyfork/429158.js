// ==UserScript==
// @name         58招聘自动刷新
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Auto refresher.
// @author       hldh214
// @match        https://vip.58.com/vcenter/myinfo/*
// @match        https://zppost.58.com/zhaopin/update/*
// @match        https://zppost.58.com/zhaopin/post/success/*
// @icon         https://www.google.com/s2/favicons?domain=58.com
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/429158/58%E6%8B%9B%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/429158/58%E6%8B%9B%E8%81%98%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval = 8; // 操作间隔 (秒)

    // 检测成功直接返回列表页
    if (/success/.test(window.location.href)) {
        location.replace('https://vip.58.com/vcenter/myinfo/');
        return;
    }

    if (/myinfo/.test(window.location.href)) {
        GM_notification({text: `检测到职位管理页面, ${interval}秒后进入最后一个职位的编辑`, timeout: 4000});
    } else {
        GM_notification({text: `检测到职位详情页面, ${interval}秒后直接提交保存`, timeout: 4000});
    }

    var refresh_interval = setInterval(() => {
        if (/myinfo/.test(window.location.href)) {
            // 列表页页面, 点击最后一个职位的编辑
            // window.scrollTo(0,document.body.scrollHeight);

            var infoid = $('#ContainerFrame').contents().find('.list-box')[0].lastChild.querySelector('span').getAttribute('infoid');

            location.replace(`https://zppost.58.com/zhaopin/update/${infoid}`);

        } else {
            // 详情页面, 直接提交保存
            // window.scrollTo(0,document.body.scrollHeight);

            $('#submit').click();
        }

    }, interval * 1000);
})();