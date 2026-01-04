// ==UserScript==
// @name         MineBBS自动签到
// @namespace    https://www.minebbs.com/
// @version      1.6
// @description  检测 MineBBS 签到模块并自动提交，已签到不重复执行
// @author       智障兔
// @match        https://www.minebbs.com/
// @match        https://minebbs.com/
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533583/MineBBS%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533583/MineBBS%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('MB自动签到脚本加载中...');

    function checkAndSign() {
        //检查是否已签到
        const signedMsg = document.querySelector('.mjc-main-message');
        if (signedMsg && signedMsg.textContent.includes('今日签到已完成')) {
            console.log('已签到，跳过提交');
            return true;
        }

        //检查是否有签到表单
        const form = document.querySelector('form[action="/credits/clock"]');
        if (form) {
            console.log('发现签到表单，准备提交...');
            form.submit();
            return true;
        }

        //暂未加载到签到区
        return false;
    }

    // 初次尝试（页面加载完成后）
    if (!checkAndSign()) {
        // 页面如果是异步渲染的，监听DOM变化
        const observer = new MutationObserver(() => {
            if (checkAndSign()) observer.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        console.log('等待签到模块加载...');
    }
})();
