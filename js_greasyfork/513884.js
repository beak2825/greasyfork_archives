// ==UserScript==
// @name         SGSYJCM Automation
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Show mouse coordinates and simulate a click after button press.
// @author       ααααα
// @match        https://web.sanguosha.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513884/SGSYJCM%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/513884/SGSYJCM%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个显示坐标的div
    const coordinateDisplay = document.createElement('div');
    coordinateDisplay.style.position = 'fixed';
    coordinateDisplay.style.left = '10px';
    coordinateDisplay.style.bottom = '290px';
    coordinateDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    coordinateDisplay.style.padding = '5px';
    coordinateDisplay.style.borderRadius = '5px';
    coordinateDisplay.style.zIndex = '9999';

    // 创建一个初始主界面到开始武将列传按钮
    const button = document.createElement('button');
    button.innerText = '主界面进入平定魏延';
    button.style.position = 'fixed';
    button.style.left = '10px';
    button.style.bottom = '255px';
    button.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    button.style.padding = '5px';
    button.style.borderRadius = '5px';
    button.style.zIndex = '9999';

    // 创建一个重进武将列传按钮
    const button1 = document.createElement('button');
    button1.innerText = '重新开始平定魏延';
    button1.style.position = 'fixed';
    button1.style.left = '10px';
    button1.style.bottom = '220px';
    button1.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    button1.style.padding = '5px';
    button1.style.borderRadius = '5px';
    button1.style.zIndex = '9999';

    // 创建一个将灵出征按钮
    const button2 = document.createElement('button');
    button2.innerText = '将灵出征(未完善)';
    button2.style.position = 'fixed';
    button2.style.left = '10px';
    button2.style.bottom = '185px';
    button2.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    button2.style.padding = '5px';
    button2.style.borderRadius = '5px';
    button2.style.zIndex = '9999';

    // 创建一个扫荡十次按钮
    const button3 = document.createElement('button');
    button3.innerText = '扫荡十次';
    button3.style.position = 'fixed';
    button3.style.left = '10px';
    button3.style.bottom = '150px';
    button3.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    button3.style.padding = '5px';
    button3.style.borderRadius = '5px';
    button3.style.zIndex = '9999';

    // 创建一个领取工会红包按钮
    const button4 = document.createElement('button');
    button4.innerText = '领取工会红包';
    button4.style.position = 'fixed';
    button4.style.left = '10px';
    button4.style.bottom = '115px';
    button4.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    button4.style.padding = '5px';
    button4.style.borderRadius = '5px';
    button4.style.zIndex = '9999';

    // 添加鼠标移动事件监听器
    document.body.addEventListener('mousemove', function(e) {
        coordinateDisplay.innerText = `(${e.clientX}, ${e.clientY})`;
    });

    // 添加按钮点击事件监听器
    button.addEventListener('click', function() {
        setTimeout(() => {
            const x = 600;
            const y = 830;
            simulateMouseMoveAndClick(x, y);// 冒险场
        }, 500);
        setTimeout(() => {
            const x = 1500;
            const y = 400;
            simulateMouseMoveAndClick(x, y);// 武将列传
        }, 1000);
        setTimeout(() => {
            const x = 1400;
            const y = 800;
            simulateMouseMoveAndClick(x, y);// 名将传
        }, 1500);
        setTimeout(() => {
            const x = 600;
            const y = 300;
            simulateMouseMoveAndClick(x, y);// 遗计杀魏延
        }, 2000);
        setTimeout(() => {
            const x = 1400;
            const y = 800;
            simulateMouseMoveAndClick(x, y);// 进入
        }, 2500);
        setTimeout(() => {
            const x = 1400;
            const y = 300;
            simulateMouseMoveAndClick(x, y);// 杨仪
        }, 3000);
        setTimeout(() => {
            const x = 1600;
            const y = 600;
            simulateMouseMoveAndClick(x, y);// 下一步
        }, 3500);
        setTimeout(() => {
            const x = 1600;
            const y = 600;
            simulateMouseMoveAndClick(x, y);// 魏延
        }, 4000);
        setTimeout(() => {
            const x = 1200;
            const y = 750;
            simulateMouseMoveAndClick(x, y);// 开始挑战
        }, 4500);
        setTimeout(() => {
            const x = 850;
            const y = 750;
            simulateMouseMoveAndClick(x, y);// 缮甲确认
        }, 13000);
    });

    // 添加按钮点击事件监听器
    button1.addEventListener('click', function() {
         setTimeout(() => {
            const x = 950;
            const y = 880;
            simulateMouseMoveAndClick(x, y);// 任意键
        }, 500);
        setTimeout(() => {
            const x = 950;
            const y = 880;
            simulateMouseMoveAndClick(x, y);// 任意键
        }, 2500);
        setTimeout(() => {
            const x = 950;
            const y = 880;
            simulateMouseMoveAndClick(x, y);// 返回
        }, 3000);
        setTimeout(() => {
            const x = 1730;
            const y = 80;
            simulateMouseMoveAndClick(x, y);// 右上角返回
        }, 3500);
        setTimeout(() => {
            const x = 800;
            const y = 630;
            simulateMouseMoveAndClick(x, y);// 放弃记录
        }, 4000);
        setTimeout(() => {
            const x = 600;
            const y = 300;
            simulateMouseMoveAndClick(x, y);// 遗计杀魏延
        }, 4500);
        setTimeout(() => {
            const x = 1400;
            const y = 800;
            simulateMouseMoveAndClick(x, y);// 进入
        }, 5000);
        setTimeout(() => {
            const x = 1400;
            const y = 300;
            simulateMouseMoveAndClick(x, y);// 杨仪
        }, 5500);
        setTimeout(() => {
            const x = 1600;
            const y = 600;
            simulateMouseMoveAndClick(x, y);// 下一步
        }, 6000);
        setTimeout(() => {
            const x = 1600;
            const y = 600;
            simulateMouseMoveAndClick(x, y);// 魏延
        }, 6500);
        setTimeout(() => {
            const x = 1200;
            const y = 750;
            simulateMouseMoveAndClick(x, y);// 开始挑战
        }, 7000);
        setTimeout(() => {
            const x = 850;
            const y = 750;
            simulateMouseMoveAndClick(x, y);// 缮甲确认
        }, 15000);
    });

    // 添加按钮点击事件监听器
    button3.addEventListener('click', function() {
        for (let i = 1; i < 22; i++) {
            setTimeout(() => {
                const x = 1350;
                const y = 770;
                simulateMouseMoveAndClick(x, y);// 任意键
            }, 100*i);
        }

    });

    button4.addEventListener('click', function() {
        var k=0
        for (let i = 1; i < 3; i++) {
            k++;
            for (let j = 0; j < 3; j++) {
                setTimeout(() => {
                    const x = 1110;;
                    const y = 320+160*j
                    simulateMouseMoveAndClick(x, y);// 任意键
                }, 500*k);
            }
        }

    });

    // 模拟鼠标移动并点击的函数
    function simulateMouseMoveAndClick(x, y) {
        // 模拟鼠标移动到指定位置
        const moveEvent = new MouseEvent('mousemove', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        document.documentElement.dispatchEvent(moveEvent);

        // 获取当前位置下的元素
        const targetElement = document.elementFromPoint(x, y);

        // 模拟鼠标按下
        const downEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        if (targetElement) {
            targetElement.dispatchEvent(downEvent);
        }

        // 模拟鼠标释放（即点击）
        const upEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        if (targetElement) {
            targetElement.dispatchEvent(upEvent);
        }

        // 模拟点击事件
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y
        });
        if (targetElement) {
            targetElement.dispatchEvent(clickEvent);
        }

        var element = document.elementFromPoint(x, y);
        if (element) {
            element.dispatchEvent(clickEvent);
            addVisualFeedback(x, y);
        }
    }

    function addVisualFeedback(x, y) {
        const dot = document.createElement('div');
        dot.style.position = 'absolute';
        dot.style.left = `${x - 5}px`;
        dot.style.top = `${y - 5}px`;
        dot.style.width = '10px';
        dot.style.height = '10px';
        dot.style.backgroundColor = 'red';
        dot.style.borderRadius = '50%';
        dot.style.zIndex = '9999999';
        dot.style.pointerEvents = 'none';

        document.body.appendChild(dot);

        setTimeout(() => {
            document.body.removeChild(dot);
        }, 1000); // 延迟500毫秒（0.5秒）后移除标记
    }
    // 将元素添加到页面
    document.body.appendChild(coordinateDisplay);
    document.body.appendChild(button);
    document.body.appendChild(button1);
    document.body.appendChild(button2);
    document.body.appendChild(button3);
    document.body.appendChild(button4);
})();