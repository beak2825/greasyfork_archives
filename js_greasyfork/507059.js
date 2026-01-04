// ==UserScript==
// @name         自动点击确认按钮（动态选择器版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  适应动态变化的 iframe 选择器，自动查找并点击 iframe 内的确认按钮
// @author       You
// @match        https://onlinenew.enetedu.com/gdlnnu/Common/VideoPlayHFiveAli*
// @match        https://onlinenew.enetedu.com/gdlnnu/Common/VideoPlayChoiceHFiveAli*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507059/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E6%8C%89%E9%92%AE%EF%BC%88%E5%8A%A8%E6%80%81%E9%80%89%E6%8B%A9%E5%99%A8%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/507059/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%A1%AE%E8%AE%A4%E6%8C%89%E9%92%AE%EF%BC%88%E5%8A%A8%E6%80%81%E9%80%89%E6%8B%A9%E5%99%A8%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastLogTime = 0;
    const logInterval = 30000;

    // 打印调试信息，限制日志频率为每 30 秒一次
    function debugLog(message) {
        const now = new Date().getTime();
        if (now - lastLogTime > logInterval) {
            console.log(`[DEBUG] ${message}`);
            lastLogTime = now;
        }
    }

    // 查找并点击确认按钮
    function clickConfirmButton(iframeDocument) {
        debugLog('尝试找到确认按钮...');
        let confirmButton = iframeDocument.querySelector('#cdnad_box > div > div > button');
        if (confirmButton) {
            debugLog('找到确认按钮');
            let event = new MouseEvent('click', { bubbles: true });
            confirmButton.dispatchEvent(event); // 模拟点击
            debugLog('已点击确认按钮');
        } else {
            debugLog('未找到确认按钮，稍后重试...');
        }
    }

    // 查找并处理所有符合条件的 iframe
    function checkAllIframes() {
        let iframes = document.querySelectorAll('iframe'); // 查找所有 iframe
        debugLog(`页面上找到 ${iframes.length} 个 iframe`);
        
        iframes.forEach(iframe => {
            let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDocument) {
                let confirmButton = iframeDocument.querySelector('#cdnad_box > div > div > button');
                if (confirmButton) {
                    debugLog('在 iframe 中找到确认按钮，点击它...');
                    clickConfirmButton(iframeDocument);
                }
            }
        });
    }

    // 防抖机制：限制触发频率
    let debounceTimeout;
    function debounce(func, delay) {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(func, delay);
    }

    // 监听 DOM 变化，动态加载时触发
    function observeDOMChanges() {
        const observer = new MutationObserver(() => {
            // 在 DOM 变化时使用防抖机制，防止频繁触发
            debounce(checkAllIframes, 500); // 500 毫秒防抖
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 脚本初始化
    function init() {
        debugLog('脚本已启动，开始查找 iframe 并点击确认按钮...');
        checkAllIframes(); // 初次检查所有 iframe
        setInterval(checkAllIframes, 60000); // 每 1 分钟检查一次
        observeDOMChanges(); // 监听 DOM 变化，处理动态加载的 iframe
    }

    init(); // 执行初始化函数
})();
