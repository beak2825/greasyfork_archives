// ==UserScript==
// @name         星阵围棋死活题 - “下一题”体验优化
// @namespace    https://github.com/Trichiurus-lepturus
// @version      0.2
// @description  [体验优化] 通过键盘/滚轮控制题目切换：回车/↓/滚轮下 - 下一题；↑/滚轮上 - 上一题；倒计时0s时自动点击下一题或查看结果
// @author       Poland Expression
// @match        *://www.19x19.com/engine/ldp/*
// @grant        none
// @license      BSD 2-Clause
// @antifeature  none
// @downloadURL https://update.greasyfork.org/scripts/534662/%E6%98%9F%E9%98%B5%E5%9B%B4%E6%A3%8B%E6%AD%BB%E6%B4%BB%E9%A2%98%20-%20%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A2%98%E2%80%9D%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/534662/%E6%98%9F%E9%98%B5%E5%9B%B4%E6%A3%8B%E6%AD%BB%E6%B4%BB%E9%A2%98%20-%20%E2%80%9C%E4%B8%8B%E4%B8%80%E9%A2%98%E2%80%9D%E4%BD%93%E9%AA%8C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==


(function () {
    'use strict';

    /**
     * Find and click buttons matching the specified text
     * @param {string} text - Text to match in button content
     */
    function findAndClickButtons(text) {
        const buttons = document.querySelectorAll('.scale-button');
        Array.from(buttons).filter(button => button.textContent.includes(text))
            .forEach(button => button.click());
    }

    // Store button text states to detect countdown zeroing
    const lastTexts = new WeakMap();

    /**
     * Monitor countdown zeroing and automatically trigger button clicks
     */
    function checkZeroButton() {
        document.querySelectorAll('.scale-button').forEach(btn => {
            const currentText = btn.textContent.trim();
            const lastText = lastTexts.get(btn) || '';
            if (lastText.includes("1s") && currentText.includes("0s")) {
                btn.click();
            }
            lastTexts.set(btn, currentText);
        });
    }

    /**
     * Wheel event handler for navigation
     * @param {WheelEvent} event - Wheel event object
     */
    function handleWheel(event) {
        if (event.deltaY > 0) {
            findAndClickButtons('Next Question');
        } else if (event.deltaY < 0) {
            findAndClickButtons('Previous Question');
        }
    }

    /**
     * Keyboard event handler for navigation
     * @param {KeyboardEvent} event - Keyboard event object
     */
    function handleKeyDown(event) {
        if (event.key === 'Enter' || event.key === 'ArrowDown') {
            findAndClickButtons('Next Question');
        } else if (event.key === 'ArrowUp') {
            findAndClickButtons('Previous Question');
        }
    }

    // Debounce function to prevent high-frequency triggering
    let lastActionTime = 0;
    const DEBOUNCE_TIME = 200;
    function debounce(func) {
        return function (...args) {
            const now = Date.now();
            if (now - lastActionTime > DEBOUNCE_TIME) {
                func.apply(this, args);
                lastActionTime = now;
            }
        };
    }

    // Register event listeners
    document.addEventListener('keydown', debounce(handleKeyDown));
    document.addEventListener('wheel', debounce(handleWheel));

    // Periodically check countdown status
    setInterval(checkZeroButton, 200);
})();
