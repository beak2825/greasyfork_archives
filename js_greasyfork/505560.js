// ==UserScript==
// @name         theresmore Timer Control
// @namespace    http://tampermonkey.net/
// @version      202408280002
// @description  在g8hh游戏theresmore中添加计时器控制以自动点击
// @author       没得名字
// @match        *://theresmoregame.g8hh.com.cn/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505560/theresmore%20Timer%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/505560/theresmore%20Timer%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建并添加表单元素到页面
    function createTimerControls() {
        const container = document.createElement('div');
        container.innerText ='自动点击 间隔毫秒【0则停止】';
        container.style.position = 'fixed';
        container.style.top = '10px';
        container.style.left = '10px';
        container.style.zIndex = '9999';
        container.style.backgroundColor = '#f0f0f0';
        container.style.padding = '10px';
        container.style.borderRadius = '5px';

        const form = document.createElement('form');
        form.style.display = 'flex';
        form.style.flexDirection = 'column';
        form.style.gap = '5px';

        const timerLabels = ['食物 ', '木材', '石头'];//计时器名称
        const timers = {};//存储计时器引用

        timerLabels.forEach((label,index) => {
            const labelElem = document.createElement('label');
            labelElem.textContent = `${label}: `;

            const input = document.createElement('input');
            input.type = 'number';
            input.min = '0';
            input.max = '9999';
            input.step = '1';
            input.value = '0';
            input.addEventListener('input', (event) => {
                const value = parseInt(event.target.value);
                if (isNaN(value)) {
                    // 如果输入无效，则重置输入框并显示错误提示
                    input.value = '0';
                    alert(`请输入有效的整数值 (0-9999)`);
                } else {
                    if (value === 0) {
                        if (timers[label]) {
                            clearInterval(timers[label]); // 清除计时器
                        };
                        delete timers[label]; //删除计时器引用
                        console.log(`已删除 ${label} 自动点击器`);
                    } else {
                        if (timers[label]) {
                            clearInterval(timers[label]); // 清除计时器
                        };
                        delete timers[label]; //删除计时器引用
                        console.log(`已删除 ${label} 自动点击器`);
                        timers[label] = setInterval(() => {
                            $(".tour-manual-resources-container")[0].children[index].click();
                        }, value);
                        console.log(`已启动 ${label} 自动点击器`);
                    }
                    console.log(`运行中的自动点击器：\n ${JSON.stringify(timers,undefined,2)}`);
                }
            });

            labelElem.appendChild(input);
            form.appendChild(labelElem);
        });

        container.appendChild(form);
        document.body.appendChild(container);
    }

    // 检查页面是否已经加载完成
    if (document.readyState === 'complete') {
        createTimerControls();
    } else {
        window.addEventListener('load', createTimerControls);
    }
})();
