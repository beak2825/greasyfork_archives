// ==UserScript==
// @name         hCaptcha 手动点击（测试用）
// @namespace    yournamespace
// @version      1.1
// @description  在右键菜单里添加一个选项，点击后尝试点选 hCaptcha 复选框
// @match        https://assets-cn1.hcaptcha.com/captcha/*
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546709/hCaptcha%20%E6%89%8B%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E6%B5%8B%E8%AF%95%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546709/hCaptcha%20%E6%89%8B%E5%8A%A8%E7%82%B9%E5%87%BB%EF%BC%88%E6%B5%8B%E8%AF%95%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 注册右键菜单命令
    GM_registerMenuCommand("点我触发 hCaptcha 点击", () => {
        const checkbox = document.querySelector('div[role="checkbox"]');
        if (checkbox) {
            console.log("找到 hCaptcha 复选框，尝试点击...");

            // 尝试原生点击
            checkbox.click();

            // 再模拟鼠标事件，确保能触发
            const evt = new MouseEvent('mousedown', { bubbles: true });
            const evt2 = new MouseEvent('mouseup', { bubbles: true });
            const evt3 = new MouseEvent('click', { bubbles: true });
            checkbox.dispatchEvent(evt);
            checkbox.dispatchEvent(evt2);
            checkbox.dispatchEvent(evt3);

            console.log("点击事件已触发。");
        } else {
            console.log("未找到 hCaptcha 复选框。");
        }
    });
})();
