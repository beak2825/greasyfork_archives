// ==UserScript==
// @name         CPP摊位状态监控
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  每60秒检测摊位状态变化并触发通知
// @match        https://www.allcpp.cn/mng/apply.do?t=1&pageNo=1
// @grant        none
// @license      MIT
// @author       liyasan
// @downloadURL https://update.greasyfork.org/scripts/533683/CPP%E6%91%8A%E4%BD%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/533683/CPP%E6%91%8A%E4%BD%8D%E7%8A%B6%E6%80%81%E7%9B%91%E6%8E%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let lastStatusText = '';

    // 请求桌面通知权限
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }

    // 提取页面中所有“摊位审核状态”相关内容
    function extractStatusText() {
        const nodes = Array.from(document.querySelectorAll("div"))
            .filter(div => div.textContent.includes("摊位审核状态"));
        return nodes.map(div => div.textContent.trim()).join("\n");
    }

    // 触发系统通知
    function notifyChange(message) {
        if (Notification.permission === "granted") {
            new Notification("摊位审核状态发生变化", {
                body: message,
                icon: "https://www.allcpp.cn/favicon.ico"
            });
        }
    }

    // 检查状态差异并准备刷新
    function checkForChanges() {
        const currentStatusText = extractStatusText();
        if (lastStatusText && currentStatusText !== lastStatusText) {
            console.log("✅ 检测到状态变化！");
            notifyChange("页面摊位审核状态已更新！");
        } else {
            console.log("⏳ 未检测到变化，等待刷新...");
        }
        lastStatusText = currentStatusText;

        // 每60秒刷新
        setTimeout(() => {
            console.log("🔁 正在刷新页面...");
            location.reload(true);
        }, 60000);
    }

    // 页面加载后开始监控流程
    window.addEventListener('load', () => {
        setTimeout(checkForChanges, 2000); // 等待页面加载稳定后再抓取内容
    });
})();