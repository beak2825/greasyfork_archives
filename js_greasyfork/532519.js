// ==UserScript==
// @name         学习通签到优化
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  当打开https://mobilelearn.chaoxing.com/widget/sign/signIn?activeId=*&ewnCode=* 时，自动跳转到 https://mobilelearn.chaoxing.com/widget/sign/refreshEwn?activeId=*
// @author       You
// @match       https://mobilelearn.chaoxing.com/widget/sign/signIn?activeId=*&ewnCode=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532519/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%BE%E5%88%B0%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/532519/%E5%AD%A6%E4%B9%A0%E9%80%9A%E7%AD%BE%E5%88%B0%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 解析当前 URL 的参数
    const urlParams = new URLSearchParams(window.location.search);
    // 获取 activeId 的值
    const activeId = urlParams.get('activeId');

    if (activeId) {
        // 构建要跳转的 URL
        const targetUrl = `https://mobilelearn.chaoxing.com/widget/sign/refreshEwn?activeId=${activeId}`;
        // 进行页面跳转
        window.location.href = targetUrl;
    }
})();