// ==UserScript==
// @name         自动点击按钮
// @namespace    http://your.namespace.com
// @version      0.1
// @description  在 https://v3.dconline.net.cn/student.html#/index/home 页面加载后自动点击第一个“继续学习”或“去学习”按钮，并每隔一段时间检查是否需要点击
// @author       Your Name
// @match        https://v3.dconline.net.cn/student.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492327/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492327/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let clicked = false;

    function clickStartLearningButton() {
        const buttons = document.querySelectorAll('span.project-courseButton'); // 选择所有按钮
        for (let button of buttons) {
            if (!clicked && (button.innerText === '继续学习' || button.innerText === '去学习')) {
                button.click();
                clicked = true;
                break; // 点击第一个匹配到的按钮后跳出循环
            }
        }
    }

    function checkStartLearningButton() {
        const buttons = document.querySelectorAll('span.project-courseButton'); // 选择所有按钮
        for (let button of buttons) {
            if (!clicked && (button.innerText === '继续学习' || button.innerText === '去学习')) {
                clickStartLearningButton();
                break; // 点击第一个匹配到的按钮后跳出循环
            }
        }
    }

    window.addEventListener('load', () => {
        clickStartLearningButton();
        setInterval(checkStartLearningButton, 5000); // 每隔5秒检查一次是否需要点击
    });
})();
