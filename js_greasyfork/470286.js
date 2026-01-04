// ==UserScript==
// @name          B站弹幕自动切大会员专属颜色
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动切大会员弹幕颜色!
// @author       幕夜
// @match        *://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470286/B%E7%AB%99%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%88%87%E5%A4%A7%E4%BC%9A%E5%91%98%E4%B8%93%E5%B1%9E%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/470286/B%E7%AB%99%E5%BC%B9%E5%B9%95%E8%87%AA%E5%8A%A8%E5%88%87%E5%A4%A7%E4%BC%9A%E5%91%98%E4%B8%93%E5%B1%9E%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // A任务：寻找 div.bpx-player-video-btn-dm 并模拟鼠标悬停
    function taskA() {
        var totalCheckTime = 10000; // 总计检查时间 10秒
        var checkInterval = 500;    // 单次检查间隔 0.5秒
        var maxAttempts = totalCheckTime / checkInterval;
        var attempts = 0;

        var timer = setInterval(function() {
            attempts++;
            var targetElement = document.querySelector('div.bpx-player-video-btn-dm');
            if (targetElement || attempts >= maxAttempts) {
                clearInterval(timer);
                if (targetElement) {
                    console.log("发现 div.bpx-player-video-btn-dm 元素，正在模拟鼠标悬停...");

                    // 创建并触发鼠标进入事件
                    var mouseenterEvent = new MouseEvent('mouseenter', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    targetElement.dispatchEvent(mouseenterEvent);

                    // 创建并触发鼠标悬停事件
                    var mouseoverEvent = new MouseEvent('mouseover', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    targetElement.dispatchEvent(mouseoverEvent);

                    // 创建并触发鼠标移动事件
                    var mousemoveEvent = new MouseEvent('mousemove', {
                        bubbles: true,
                        cancelable: true,
                        view: window,
                        clientX: targetElement.offsetLeft + 1, // 确保在元素内部
                        clientY: targetElement.offsetTop + 1
                    });
                    targetElement.dispatchEvent(mousemoveEvent);

                    console.log("已触发鼠标悬停相关事件");

                    // 启动B任务
                    setTimeout(taskB, 100); // 等待动态加载的弹窗元素出现
                } else {
                    console.log("未找到 div.bpx-player-video-btn-dm 元素或超时");
                }
            }
        }, checkInterval);
    }

    // B任务：寻找 div.bpx-player-mode-selection-container 并隐藏它
    function taskB() {
        var totalCheckTime = 5000; // 总计检查时间 5秒
        var checkInterval = 100;   // 单次检查间隔 0.1秒
        var maxAttempts = totalCheckTime / checkInterval;
        var attempts = 0;

        var containerElement = null;

        var timer = setInterval(function() {
            attempts++;
            containerElement = document.querySelector('div.bpx-player-mode-selection-container');
            if (containerElement || attempts >= maxAttempts) {
                clearInterval(timer);
                if (containerElement) {
                    console.log("发现 div.bpx-player-mode-selection-container 元素，正在隐藏...");
                    containerElement.style.display = 'none';
                    console.log("已隐藏 div.bpx-player-mode-selection-container 元素");

                    // 启动C任务
                    setTimeout(taskC, 100); // 确保元素已被隐藏
                } else {
                    console.log("未找到 div.bpx-player-mode-selection-container 元素或超时");
                }
            }
        }, checkInterval);

        return containerElement;
    }

    // C任务：在B任务找到的元素的子节点中寻找 div.row-selection.vip-danmaku-color 并模拟点击
    function taskC() {
        var totalCheckTime = 5000; // 总计检查时间 5秒
        var checkInterval = 100;   // 单次检查间隔 0.1秒
        var maxAttempts = totalCheckTime / checkInterval;
        var attempts = 0;

        var containerElement = document.querySelector('div.bpx-player-mode-selection-container');
        if (!containerElement) {
            console.log("容器元素未找到");
            return;
        }

        // 临时恢复显示
        var originalDisplay = containerElement.style.display;
        containerElement.style.display = ''; // 临时恢复显示

        var timer = setInterval(function() {
            attempts++;
            var targetElement = containerElement.querySelector('div.row-selection.vip-danmaku-color');
            if (targetElement) {
                var subNode = targetElement.querySelector('ul.vip-color-picker-options');
                if (subNode || attempts >= maxAttempts) {
                    clearInterval(timer);
                    if (subNode) {
                        console.log("发现 ul.vip-color-picker-options 子节点，准备进行点击操作...");

                        // 尝试多种方式模拟点击
                        clickElementAndChildren(targetElement);

                        // 模拟鼠标移出A任务中的元素
                        var originalTarget = document.querySelector('div.bpx-player-video-btn-dm');
                        if (originalTarget) {
                            var mouseoutEvent = new MouseEvent('mouseout', {
                                bubbles: true,
                                cancelable: true,
                                view: window
                            });
                            originalTarget.dispatchEvent(mouseoutEvent);
                            console.log("已触发鼠标移出事件");
                        }

                        // 恢复原始显示状态
                        containerElement.style.display = originalDisplay;
                    } else {
                        console.log("未找到 ul.vip-color-picker-options 子节点或超时");

                        // 恢复原始显示状态
                        containerElement.style.display = originalDisplay;
                    }
                }
            } else if (attempts >= maxAttempts) {
                clearInterval(timer);
                console.log("未找到 div.row-selection.vip-danmaku-color 元素或超时");

                // 恢复原始显示状态
                containerElement.style.display = originalDisplay;
            }
        }, checkInterval);
    }

   // 尝试多种方式模拟点击并递归点击所有子节点
    function clickElementAndChildren(element) {
        if (!element) {
            console.error("无效的目标元素");
            return;
        }

        // 直接调用 click() 方法
        console.log(`尝试点击目标元素: ${element.tagName} (class="${element.className}")`);
        element.click();

        // 递归点击所有子节点
        const childNodes = element.querySelectorAll('*');
        if (childNodes.length > 0) {
            console.log(`发现 ${childNodes.length} 个子节点，开始递归点击...`);
            childNodes.forEach(child => {
                try {
                    console.log(`尝试点击子节点: ${child.tagName} (class="${child.className}")`);
                    child.click();
                } catch (error) {
                    console.error(`点击子节点失败: ${child.tagName} (class="${child.className}")`, error);
                }
            });
        } else {
            console.log("没有找到任何子节点");
        }

        // 尝试通过 dispatchEvent 触发 MouseEvent
        console.log("尝试通过 dispatchEvent 触发 MouseEvent...");
        var clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        var result = element.dispatchEvent(clickEvent);
        console.log("dispatchEvent(MouseEvent) 结果:", result);

        // 如果元素有 onclick 属性，则尝试手动调用 onclick
        if (element.hasAttribute('onclick')) {
            console.log("元素有 onclick 属性，尝试手动调用 onclick...");
            var onclick = element.getAttribute('onclick');
            if (typeof onclick === 'function') {
                onclick.call(element);
            } else if (typeof onclick === 'string') {
                new Function(onclick).call(element);
            }
        }

        console.log("所有点击尝试已完成");
    }

    // 页面加载完成后执行
    window.addEventListener('load', function() {
        console.log("页面加载完成，启动A任务...");
        taskA();
    }, false);
})();