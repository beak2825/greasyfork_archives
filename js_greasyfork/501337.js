// ==UserScript==
// @name         问卷星滑块验证码专用
// @namespace    https://blog.furry.ist/
// @version      6.8
// @description  自动滑动拼图验证码。
// @license      MIT
// @author       MingTone
// @match        https://www.wjx.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501337/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%A0%81%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/501337/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%BB%91%E5%9D%97%E9%AA%8C%E8%AF%81%E7%A0%81%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

class CaptchaSolver {
    constructor() {
        this.sliderButton = null;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            console.info('Window loaded, setting up captcha handling.');
            setTimeout(() => {
                this.initializeCaptchaHandling();
            }, 5); // 延迟3500毫秒后执行
        });
    }

    initializeCaptchaHandling() {
        this.sliderButton = document.querySelector('#nc_1_n1z'); // 确保此时获取滑块按钮
        if (this.sliderButton) {
            console.info('Slider button found, setting up event listener.');
            this.startDrag(); // 尝试自动启动滑动
        } else {
            console.error('Slider button not found!');
            // 重新尝试查找按钮
            setTimeout(() => {
                this.initializeCaptchaHandling();
            }, 350); // 1秒后重新尝试
        }
    }

    startDrag() {
        console.info('Starting drag process.');

        // 确保模拟鼠标按下
        const rect = this.sliderButton.getBoundingClientRect();
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + rect.width / 2,
            clientY: rect.top + rect.height / 2,
            button: 0 // 左键
        });
        this.sliderButton.dispatchEvent(mouseDownEvent);
        console.info('Simulated mouse down on slider.');

        // 模拟拖动
        this.performDrag(rect);
    }

    performDrag(rect) {
        console.info('Performing drag operation.');
        let startX = rect.left + this.sliderButton.offsetWidth / 2;
        let endX = startX + 450; // 假定滑动距离稍微小于300px以适应不同的屏幕
        let currentX = startX;

        // 模拟持续拖动的过程
        const step = () => {
            if (currentX < endX) {
                let stepSize = Math.random() * 141; // 增加步长随机性
                let moveX = Math.min(endX, currentX + stepSize);
                const mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: moveX,
                    clientY: rect.top + this.sliderButton.offsetHeight / 2
                });
                this.sliderButton.dispatchEvent(mouseMoveEvent);
                currentX = moveX;
                setTimeout(step, 20 + Math.random() * 114); // 适当增加延迟以模仿人工操作
            } else {
                this.endDrag(rect);
            }
        };

        // 开始拖动前稍作延迟
        setTimeout(step, 500);
    }

    endDrag(rect) {
        console.info('Ending drag operation.');
        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            clientX: rect.left + 450,
            clientY: rect.top + this.sliderButton.offsetHeight / 2
        });
        this.sliderButton.dispatchEvent(mouseUpEvent);
    }
}

new CaptchaSolver();
