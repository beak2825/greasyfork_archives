// ==UserScript==
// @name         茶水监控提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  监控茶水数量并提示
// @author       YourName
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532596/%E8%8C%B6%E6%B0%B4%E7%9B%91%E6%8E%A7%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/532596/%E8%8C%B6%E6%B0%B4%E7%9B%91%E6%8E%A7%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建提示容器（基于原有样式调整位置）
    const alertContainer = document.createElement('div');
    Object.assign(alertContainer.style, {
        position: 'fixed',
        top: '20%',  // 调整到屏幕偏上位置
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontSize: '48px',
        fontWeight: 'bold',
        color: 'rgba(255, 0, 0, 0.7)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'none'
    });
    alertContainer.textContent = '茶快喝完了！';
    document.body.appendChild(alertContainer);

    // 检测消耗品数量
    function checkConsumables() {
        const slots = document.querySelectorAll('.ConsumableSlot_consumableSlotContainer__2DwgD');
        let hasEmpty = false;

        slots.forEach(slot => {
            const countElement = slot.querySelector('.Item_count__1HVvv');
            if (countElement && parseInt(countElement.textContent) <= 20) {
                hasEmpty = true;
            }
        });

        alertContainer.style.display = hasEmpty ? 'block' : 'none';
    }

    // 每2秒检测一次
    setInterval(checkConsumables, 2000);
    checkConsumables(); // 初始检测

})();