// ==UserScript==
// @name         Pass CNKI verification code
// @namespace    http://tampermonkey.net/
// @version      2024-11-08
// @description  通过知网的滑动验证码
// @author       You
// @match        https://kns.cnki.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnki.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/516364/Pass%20CNKI%20verification%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/516364/Pass%20CNKI%20verification%20code.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function bezierPath(start, end, control1, control2, steps) {
        const path = [];
        for (let t = 0; t <= 1; t += 1 / steps) {
            const x = (1 - t) ** 3 * start[0] +
                  3 * (1 - t) ** 2 * t * control1[0] +
                  3 * (1 - t) * t ** 2 * control2[0] +
                  t ** 3 * end[0];
            const y = (1 - t) ** 3 * start[1] +
                  3 * (1 - t) ** 2 * t * control1[1] +
                  3 * (1 - t) * t ** 2 * control2[1] +
                  t ** 3 * end[1];
            path.push([x + Math.random() * 2 - 1, y + Math.random() * 2 - 1]);
        }
        return path;
    }

    function simulateSliderMovement(sliderElement, start, end) {
        const control1 = [start[0] + (end[0] - start[0]) / 4, start[1] - 30];
        const control2 = [start[0] + (end[0] - start[0]) * 3 / 4, end[1] + 30];
        const path = bezierPath(start, end, control1, control2, 100);

        // 模拟按下
        sliderElement.dispatchEvent(new MouseEvent('mousedown', {
            clientX: start[0],
            clientY: start[1],
            bubbles: true
        }));

        // 模拟移动
        path.forEach(([x, y], i) => {
            setTimeout(() => {
                sliderElement.dispatchEvent(new MouseEvent('mousemove', {
                    clientX: x,
                    clientY: y,
                    bubbles: true
                }));
            }, i * 1); // 控制速度
        });

        // 模拟释放
        setTimeout(() => {
            sliderElement.dispatchEvent(new MouseEvent('mouseup', {
                clientX: end[0],
                clientY: end[1],
                bubbles: true
            }));
        }, path.length * 10);
    }

    var txt = document.querySelector('.txt').textContent;
    if (txt == "系统检测到您的访问行为异常，请帮助我们完成 验证"){
       // 用法示例
        const sliderElement = document.querySelector('.verify-move-block');
        var start_x = sliderElement.getBoundingClientRect().x;
        var offset = document.querySelector('.verify-gap').offsetLeft;
        simulateSliderMovement(sliderElement, [start_x, 0], [start_x + offset + 30, 0]);
    }
    // Your code here...
})();