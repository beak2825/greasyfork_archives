// ==UserScript==
// @name         清除Drone License提示
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  清除Drone的License超限提示框,Drone,drone
// @author       Laev
// @match        *://drone.xxx.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544807/%E6%B8%85%E9%99%A4Drone%20License%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/544807/%E6%B8%85%E9%99%A4Drone%20License%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLicenseMessage() {
        // 使用XPath查找包含特定文本的元素
        const elements = document.evaluate(
            "//div[contains(text(), 'License Limit is Exceeded')]",
            document,
            null,
            XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
            null
        );

        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            const parent = element.closest('div[class*="license_"], div[class*="system-message_"]');
            if (parent) {
                parent.remove();
                return true;
            }
        }
        return false;
    }

    // 设置执行间隔
    const CHECK_INTERVAL = 500; // 缩短到500ms
    const MAX_ATTEMPTS = 20; // 最多检查10秒
    let attempts = 0;

    // 定期检查和移除
    const intervalId = setInterval(() => {
        if (removeLicenseMessage() || attempts >= MAX_ATTEMPTS) {
            clearInterval(intervalId);
        }
        attempts++;
    }, CHECK_INTERVAL);

    // 首次执行
    removeLicenseMessage();

    // 添加样式屏蔽
    const style = document.createElement('style');
    style.textContent = `
        div[class*="license_system-messages-wrapper"],
        div[class*="system-message_wrapper"],
        div[class*="license_message"],
        div[class*="message"]:has(a[href*="license"]) {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
})();