// ==UserScript==
// @name         uview-plus强制关闭广告
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  尝试关闭uview-plus网站上的广告
// @author       CCC
// @match        https://uview-plus.jiangruyi.com/*
// @match        https://uview-plus.lingyun.net/*
// @match        https://uiadmin.net/uview-plus/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518888/uview-plus%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/518888/uview-plus%E5%BC%BA%E5%88%B6%E5%85%B3%E9%97%AD%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 重写 alert 函数
    window.alert = function(message) {
        // 你可以在这里添加日志记录或其他处理逻辑
        console.log("Blocked alert message: " + message);

        // 如果你想完全阻止 alert 弹出，可以不调用原生的 alert 函数
        // 如果你还想保留 alert 的功能，可以调用 originalAlert(message);
        // 抛出异常以阻止后续代码执行
        throw new Error("Alert was blocked and execution stopped.");
    };

    function removeAds() {
        console.log('开始删除广告');

        const noAdTip = document.querySelector('.fc-ab-root');
        if (noAdTip) {
            noAdTip.remove();
            console.log('noAdTip removed');
        } else {
            console.log('noAdTip not found');
        }

        const noSeeAdTip = document.querySelector('.el-dialog__wrapper');
        if (noSeeAdTip) {
            noSeeAdTip.remove();
            console.log('noSeeAdTip removed');
        } else {
            console.log('noSeeAdTip not found');
        }

        const modalMask = document.querySelector('.v-modal');
        if (modalMask) {
            modalMask.remove();
            console.log('modalMask removed');
        } else {
            console.log('modalMask not found');
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOM fully loaded and parsed, 开始删除广告');
        removeAds();
    });

    // 如果广告是动态加载的，使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                removeAds();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();