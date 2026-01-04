// ==UserScript==
// @name         跳过 百度（Baidu） App 下载提示 (No Popup)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  跳过下载引导，防止跳转和 prompt 弹窗
// @author       viewtheard
// @license      GPL-3.0
// @match        *://*.baidu.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537851/%E8%B7%B3%E8%BF%87%20%E7%99%BE%E5%BA%A6%EF%BC%88Baidu%EF%BC%89%20App%20%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA%20%28No%20Popup%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537851/%E8%B7%B3%E8%BF%87%20%E7%99%BE%E5%BA%A6%EF%BC%88Baidu%EF%BC%89%20App%20%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA%20%28No%20Popup%29.meta.js
// ==/UserScript==

(function () {
    // 模拟 userAgent 为百度App
    Object.defineProperty(navigator, 'userAgent', {
        get: function () {
            return 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) baiduboxapp/13.5.0.10 Mobile Safari/537.36';
        }
    });

    // 提前定义 swanInvoke，阻止跳转
    window.swanInvoke = function (args) {
        console.log('[油猴] 假装已打开小程序: ', args);
    };

    // 阻止 history.back，留在当前页
    history.back = function () {
        console.log('[油猴] 阻止 history.back 调用');
    };

    // 屏蔽 JSBridge 的 prompt 弹窗调用
    window.prompt = function (msg) {
        if (typeof msg === 'string' && msg.startsWith('BdboxApp:')) {
            console.log('[油猴] 拦截 JSBridge prompt 调用: ', msg);
            return ''; // 返回空字符串，避免触发异常逻辑
        }
        return null;
    };

    // 防止 swanInvoke 脚本加载
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            for (const node of mutation.addedNodes) {
                if (node.tagName === 'SCRIPT' && node.src && node.src.includes('swanInvoke')) {
                    node.parentElement.removeChild(node);
                    console.log('[油猴] 移除 swanInvoke 脚本');
                }
            }
        }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
})();