// ==UserScript==
// @name         知网解除复制限制及过滑动验证码
// @namespace    http://tampermonkey.net/
// @version      2025-03-13
// @description  仅移除kns.cnki.net网站复制事件监听器
// @author       xiaoning
// @match        https://vpn.nynu.edu.cn/https/*/nzkhtml/xmlRead/trialRead.html*
// @match        https://kns.cnki.net/nzkhtml/xmlRead/trialRead.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nynu.edu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538518/%E7%9F%A5%E7%BD%91%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%8F%8A%E8%BF%87%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/538518/%E7%9F%A5%E7%BD%91%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6%E5%8F%8A%E8%BF%87%E6%BB%91%E5%8A%A8%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function removeCopyListener() {
        const wrapDiv = document.querySelector('#study-cen');
        if (wrapDiv) {
            // 移除复制事件监听器
            wrapDiv.removeEventListener('copy', null, true);

            // 移除可能阻止复制的内联事件处理程序
            wrapDiv.oncopy = null;

            console.log('已移除复制相关事件监听器');
        }
    }

    // 页面加载完成后执行
    window.addEventListener('load', removeCopyListener);

    function autoSlide() {
        const slider = document.querySelector('.handler.handler_bg');
        if (slider) {
            console.log('滑块元素找到');
            const sliderBox = document.querySelector('.slider-wrapper');
            if (sliderBox) {
                console.log('滑块容器找到');
                const boxRect = sliderBox.getBoundingClientRect();
                const sliderRect = slider.getBoundingClientRect();

                const startX = sliderRect.left + sliderRect.width / 2;
                const startY = sliderRect.top + sliderRect.height / 2;
                const endX = boxRect.right - sliderRect.width / 2;

                console.log(`开始位置: (${startX}, ${startY}), 结束位置: (${endX}, ${startY})`);

                // 模拟鼠标按下
                slider.dispatchEvent(new MouseEvent('mousedown', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: startX,
                    clientY: startY
                }));
                console.log('模拟鼠标按下事件已触发');

                // 模拟鼠标移动（增加多个中间点）
                const steps = 10;
                for (let i = 1; i <= steps; i++) {
                    const currentX = startX + (endX - startX) * (i / steps);
                    document.dispatchEvent(new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: currentX,
                        clientY: startY
                    }));
                    console.log(`模拟鼠标移动事件已触发 (${currentX}, ${startY})`);
                }

                // 模拟鼠标松开
                document.dispatchEvent(new MouseEvent('mouseup', {
                    bubbles: true,
                    cancelable: true,
                    view: window,
                    clientX: endX,
                    clientY: startY
                }));
                console.log('模拟鼠标松开事件已触发');
            } else {
                console.log('未找到滑块容器');
            }
        } else {
            console.log('未找到滑块元素');
        }
    }

    // 创建一个MutationObserver来监视DOM变化
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                const slider = document.querySelector('.handler.handler_bg');
                if (slider) {
                    console.log('检测到滑块元素，准备执行自动滑动');
                    autoSlide();
                    observer.disconnect(); // 滑块出现后停止观察
                    console.log('观察器已断开连接');
                    break;
                }
            }
        }
    });

    // 配置observer选项
    const config = { childList: true, subtree: true };

    // 开始观察document.body的变化
    observer.observe(document.body, config);
    console.log('DOM观察器已启动');

    // 添加手动触发按钮（用于调试）
    const debugButton = document.createElement('button');
    //debugButton.textContent = '手动触发自动滑动';
    debugButton.style.position = 'fixed';
    debugButton.style.top = '10px';
    debugButton.style.left = '10px';
    debugButton.style.zIndex = '9999';
    debugButton.addEventListener('click', autoSlide);
    document.body.appendChild(debugButton);
})();