// ==UserScript==
// @name         浙江大学教学管理一键评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动拖动评分进度条
// @author       Your Name
// @match        *alt.zju.edu.cn/studentEvaluationBackend/evaluationPage*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498990/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/498990/%E6%B5%99%E6%B1%9F%E5%A4%A7%E5%AD%A6%E6%95%99%E5%AD%A6%E7%AE%A1%E7%90%86%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.onload = function() {
        // 等待一段时间以确保所有元素都已加载
        setTimeout(function() {
            // 定位所有的进度条
            let sliders = document.querySelectorAll('#root > div > div:nth-child(3) > div > div:nth-child(2) > div > div > div:nth-child(7) > div:nth-child(1) > form .ant-slider');

            sliders.forEach(function(slider) {
                // 获取进度条的宽度
                let sliderWidth = slider.clientWidth;

                // 计算目标位置（100%）
                let targetPosition = sliderWidth;

                // 定位滑块
                let handle = slider.querySelector('.ant-slider-handle');

                // 创建鼠标事件
                let mouseDownEvent = new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: handle.getBoundingClientRect().left,
                    clientY: handle.getBoundingClientRect().top
                });

                let mouseMoveEvent = new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: handle.getBoundingClientRect().left + targetPosition,
                    clientY: handle.getBoundingClientRect().top
                });

                let mouseUpEvent = new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: handle.getBoundingClientRect().left + targetPosition,
                    clientY: handle.getBoundingClientRect().top
                });

                // 触发拖动事件
                handle.dispatchEvent(mouseDownEvent);
                handle.dispatchEvent(mouseMoveEvent);
                handle.dispatchEvent(mouseUpEvent);
            });

            // 如果有提交按钮，自动点击提交
            // document.querySelector('#submit_button_id').click();  // 将此行取消注释并替换为实际的提交按钮ID

        }, 1000);  // 视情况调整等待时间
    };
})();
