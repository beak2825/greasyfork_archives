// ==UserScript==
// @name         Alpha出貨單-D+2日期提醒
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  判斷是否有今日預計出貨日期+2，如果沒有就顯示提醒
// @match        http://192.168.11.24/lkfr41.php
// @match        http://192.168.11.25/lkfr41.php
// @match        http://192.168.11.26/lkfr41.php
// @match        http://192.168.11.27/lkfr41.php
// @match        http://192.168.11.85/lkfr41.php
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/539970/Alpha%E5%87%BA%E8%B2%A8%E5%96%AE-D%2B2%E6%97%A5%E6%9C%9F%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/539970/Alpha%E5%87%BA%E8%B2%A8%E5%96%AE-D%2B2%E6%97%A5%E6%9C%9F%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 建立置中浮動提醒視窗（預設隱藏）
    const reminderBox = document.createElement('div');
    reminderBox.style.position = 'fixed';
    reminderBox.style.top = '10%'; // 上方偏中央
    reminderBox.style.left = '50%';
    reminderBox.style.transform = 'translate(-50%, -50%)'; // 完美置中
    reminderBox.style.zIndex = '9999';
    reminderBox.style.backgroundColor = '#fff3f3';
    reminderBox.style.border = '2px solid red';
    reminderBox.style.padding = '16px 24px';
    reminderBox.style.borderRadius = '10px';
    reminderBox.style.color = '#d00';
    reminderBox.style.fontWeight = 'bold';
    reminderBox.style.fontSize = '20px';
    reminderBox.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    reminderBox.textContent = '⚠️ 通知單出貨日期非 D+2！';
    reminderBox.style.display = 'none'; // 預設隱藏
    document.body.appendChild(reminderBox);

    function getTargetDateStr() {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        return `${yyyy}${mm}${dd}`;
    }

    function checkDateMatch() {
        const container = document.querySelector('div[style*="width: 618px"][style*="height: 243px"]');
        if (!container) return;

        const text = container.innerText || container.textContent || '';
        const target = getTargetDateStr();
        const isMatched = text.includes(target);

        reminderBox.style.display = isMatched ? 'none' : 'block';
    }

    setInterval(checkDateMatch, 300);
})();

