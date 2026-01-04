// ==UserScript==
// @name         【FSU扩展插件】自动点击领取奖励按钮
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  【EAFCFUT模式】SBC任务便捷操作增强器辅助，自动在0.5秒后点击"领取奖励"按钮
// @author       Thadike
// @match        https://www.ea.com/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.easports.com/*/ea-sports-fc/ultimate-team/web-app/*
// @match        https://www.ea.com/*/ea-sports-fc/ultimate-team/web-app/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537413/%E3%80%90FSU%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6%E3%80%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%A2%86%E5%8F%96%E5%A5%96%E5%8A%B1%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/537413/%E3%80%90FSU%E6%89%A9%E5%B1%95%E6%8F%92%E4%BB%B6%E3%80%91%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%A2%86%E5%8F%96%E5%A5%96%E5%8A%B1%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 存储定时器ID，避免重复点击
    let clickTimer = null;
    let activeButton = null;
    let processedButtons = new Set(); // 记录已处理的按钮

    // 创建一个新的MutationObserver实例
    const observer = new MutationObserver(mutationsList => {
        for (const mutation of mutationsList) {
            // 检查添加的节点
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    // 如果添加的节点是元素节点
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 递归检查新添加的节点及其子节点
                        checkForButton(node);
                    }
                }
            }
            // 检查属性变化
            else if (mutation.type === 'attributes' &&
                     mutation.target.classList.contains('btn-standard') &&
                     mutation.target.classList.contains('call-to-action')) {
                checkForButton(mutation.target);
            }
        }
    });

    // 检查节点是否是目标按钮或包含目标按钮
    function checkForButton(element) {
        // 直接查找目标按钮
        const buttons = element.querySelectorAll('button.btn-standard.call-to-action');
        buttons.forEach(button => {
            if (button.textContent.trim() === '领取奖励' && !processedButtons.has(button)) {
                handleButtonFound(button);
            }
        });

        // 如果当前元素是符合条件的按钮
        if (element.tagName === 'BUTTON' &&
            element.classList.contains('btn-standard') &&
            element.classList.contains('call-to-action') &&
            element.textContent.trim() === '领取奖励' &&
            !processedButtons.has(element)) {
            handleButtonFound(element);
        }
    }

    // 获取奖励描述信息
    function getRewardInfo(button) {
        try {
            // 向上查找包含奖励信息的父元素
            let parent = button.closest('.game-rewards-view');
            if (!parent) {
                // 尝试另一种查找方式
                parent = button.closest('div');
                while (parent && !parent.querySelector('.description') && !parent.querySelector('h1')) {
                    parent = parent.parentElement;
                }
            }

            if (parent) {
                // 获取奖励标题
                const titleElement = parent.querySelector('h1');
                const title = titleElement ? titleElement.textContent.trim() : '奖励';

                // 获取奖励描述
                const descriptionElement = parent.querySelector('.description');
                const description = descriptionElement ? descriptionElement.textContent.trim() : '未知奖励';

                return { title, description };
            }
        } catch (error) {
            console.error('获取奖励信息失败:', error);
        }
        return { title: '奖励', description: '未知奖励' };
    }

    // 显示通知
    function showNotification(message, duration = 5000) {
        // 防止重复通知
        if (document.querySelector('.custom-notification')?.textContent === message) {
            return;
        }

        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'custom-notification';
        notification.textContent = message;

        // 设置样式
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #4CAF50;
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            z-index: 9999;
            opacity: 0;
            transform: translateY(-20px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
            word-wrap: break-word;
        `;

        // 添加到页面
        document.body.appendChild(notification);

        // 触发动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);

        // 添加关闭按钮
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '&times;';
        closeBtn.style.cssText = `
            position: absolute;
            top: 5px;
            right: 10px;
            cursor: pointer;
            font-size: 16px;
        `;
        closeBtn.onclick = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        };
        notification.appendChild(closeBtn);

        // 自动关闭
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }

    // 处理找到按钮的情况
    function handleButtonFound(button) {
        // 如果有正在处理的按钮，检查是否是同一个
        if (activeButton === button) return;

        // 如果有其他按钮正在等待点击，取消它
        if (clickTimer) {
            clearTimeout(clickTimer);
            if (activeButton) {
                activeButton.style.backgroundColor = ''; // 重置之前按钮的样式
            }
        }

        // 设置新的活跃按钮
        activeButton = button;
        processedButtons.add(button); // 标记为已处理

        // 设置新的定时器，在0.5秒后点击按钮
        clickTimer = setTimeout(() => {
            try {
                // 添加点击前的视觉反馈
                button.style.backgroundColor = 'red';

                // 创建更完整的点击事件
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: button.getBoundingClientRect().left + button.offsetWidth / 2,
                    clientY: button.getBoundingClientRect().top + button.offsetHeight / 2
                });

                // 触发更真实的点击事件序列
                const mouseOverEvent = new MouseEvent('mouseover', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                const mouseDownEvent = new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                const mouseUpEvent = new MouseEvent('mouseup', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });

                // 触发完整的点击序列
                button.dispatchEvent(mouseOverEvent);
                setTimeout(() => {
                    button.dispatchEvent(mouseDownEvent);
                    setTimeout(() => {
                        button.dispatchEvent(mouseUpEvent);
                        button.dispatchEvent(clickEvent);

                        // 点击后的视觉反馈
                        button.style.backgroundColor = 'green';

                        // 获取奖励信息并显示通知
                        const { title, description } = getRewardInfo(button);
                        const notificationMsg = `【已自动成功获取${title}】：${description}`;
                        showNotification(notificationMsg);

                        console.log(`已自动点击"领取奖励"按钮：${title} - ${description}`);

                        // 点击后检查按钮是否还在DOM中，如果不在则从集合中移除
                        setTimeout(() => {
                            if (!document.contains(button)) {
                                processedButtons.delete(button);
                            }
                        }, 1000);

                    }, 50); // 模拟鼠标按下和释放之间的延迟
                }, 50);

            } catch (error) {
                console.error('点击按钮时出错:', error);
                showNotification(`领取奖励失败：${error.message}`, 8000);
            } finally {
                // 重置状态
                activeButton = null;
                clickTimer = null;
            }
        }, 500);
    }

    // 开始观察DOM变化
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'textContent']
    });

    // 页面加载完成后也检查一次
    window.addEventListener('load', () => {
        checkForButton(document);
    });

    // 添加页面卸载时的清理
    window.addEventListener('unload', () => {
        if (observer) observer.disconnect();
        if (clickTimer) clearTimeout(clickTimer);
        if (activeButton) activeButton.style.backgroundColor = '';
        processedButtons.clear();
    });
})();