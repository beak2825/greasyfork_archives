// ==UserScript==
// @name         希音批量催审
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license MIT
// @description  按下 Insert 键后自动点击页面上的催审按钮
// @author       LYW
// @match        https://sso.geiwohuo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522912/%E5%B8%8C%E9%9F%B3%E6%89%B9%E9%87%8F%E5%82%AC%E5%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/522912/%E5%B8%8C%E9%9F%B3%E6%89%B9%E9%87%8F%E5%82%AC%E5%AE%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let intervalId; // 存储定时器的 ID

    const met = () => {
        const test = document.querySelectorAll('tbody .so-table-fixed-right.so-table-fixed-first.so-table-ignore-right-border');
        let found = false;

        for (let i = 0; i < test.length; i++) {
            const btn = test[i].querySelector('button');
            if (btn && btn.children[0].textContent === '催审') {
                btn.click();
                console.log('按钮已点击');
                found = true;
                break;
            }
        }

        if (!found) {
            clearInterval(intervalId);
            intervalId = null; // 重置定时器 ID
            console.log('未找到目标按钮，定时器已停止');
        }
    };

    // 处理键盘按下事件
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Insert') { // 检测 'Insert' 键
            if (!intervalId) { // 如果定时器还未启动
                intervalId = setInterval(met, 1500); // 每 1.5 秒检查一次
                console.log('定时器已启动');
            } else {
                console.log('定时器已在运行中');
            }
        } else if (event.key === 'Escape') { // 检测 'Escape' 键
            if (intervalId) {
                clearInterval(intervalId); // 停止定时器
                intervalId = null; // 重置定时器 ID
                console.log('定时器已停止');
            } else {
                console.log('没有正在运行的定时器');
            }
        }
    });

})();
