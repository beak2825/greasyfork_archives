// ==UserScript==
// @name         [哔哩哔哩直播]-去除马赛克遮罩
// @description  去掉直播间各种烦人的马赛克遮罩,还你一个干净的直播间,增强观看体验,去他的昵称马赛克.
// @author       Asuna
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @version      1.3
// @license      MIT
// @namespace https://greasyfork.org/users/1390050
// @downloadURL https://update.greasyfork.org/scripts/516800/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D-%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/516800/%5B%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%9B%B4%E6%92%AD%5D-%E5%8E%BB%E9%99%A4%E9%A9%AC%E8%B5%9B%E5%85%8B%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 控制台样式化输出工具
    const consoleStyle = {
        // 成功类型：绿色渐变
        success: function(message) {
            console.log(`%c✅ ${message}`, 'color: #fff; background: linear-gradient(270deg, #986fee, #8695e6, #68b7dd, #18d7d3); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 错误类型：红色渐变
        error: function(message) {
            console.log(`%c❌ ${message}`, 'color: #fff; background: linear-gradient(270deg, #ff6b6b, #ff8e8e, #ffa5a5); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 警告类型：橙色渐变
        warning: function(message) {
            console.log(`%c⚠️ ${message}`, 'color: #fff; background: linear-gradient(270deg, #ff9800, #ffb84d, #ffcc80); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        },
        // 信息类型：蓝色渐变
        info: function(message) {
            console.log(`%cℹ️ ${message}`, 'color: #fff; background: linear-gradient(270deg, #2196f3, #64b5f6, #90caf9); padding: 8px 15px; border-radius: 0 15px 0 15px; font-weight: bold;');
        }
    };

    // 保存定时器引用以便清理
    const timers = [];

    // 自动卸载相关配置
    const MAX_EMPTY_CHECKS = 3; // 连续未检测到遮罩的最大次数
    let emptyCheckCount = 0; // 连续未检测到遮罩的计数器
    let isUnloaded = false; // 脚本是否已卸载
    let checkTimer = null; // 定期检查定时器引用
    let isCheckingStarted = false; // 是否已开始定期检查

    //清除等待的遮罩时间,单位为毫秒
    const clear_time = 5000

    //弹幕同屏发送次数,默认为1
    const exp = 1

    //提示的弹幕颜色,支持英文和16进制颜色编码
    const color = "#90EE90"

    //此处调整弹幕滚动速度
    const speed = 0.10

    // 默认固定从左侧开始滚动的位置
    const dm_left = '0%'

    //弹幕距离顶部的位置,如果想要随机可以替换为：`${Math.random() * 100}%`
    const dm_top = '50%'

    //弹幕字号
    const dm_fontSize = '36px'

    //弹幕内容
    const msg = '直播间遮罩删除完毕!'

    // 防止重复创建消息元素的标识
    const MESSAGE_ELEMENT_ID = 'bili-live-remove-mask-message';

    // 检查是否在正确的页面环境
    // 避免在天选时刻弹窗等 iframe 中显示加载消息和处理弹幕
    function isInValidLiveRoom() {
        try {
            // 检查是否存在 #live-player 元素
            const livePlayerDiv = document.getElementById('live-player');
            if (!livePlayerDiv) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    function showFloatingMessage(message, color) {
        // 防止重复加载：检查是否已存在消息元素
        const existingMessage = document.getElementById(MESSAGE_ELEMENT_ID);
        if (existingMessage) {
            // 如果已存在，先移除旧的消息
            existingMessage.remove();
        }

        const div = document.createElement('div');
        div.id = MESSAGE_ELEMENT_ID;
        div.textContent = message;
        div.style.position = 'fixed';
        div.style.top = dm_top;
        div.style.left = dm_left;
        div.style.color = color;
        div.style.fontSize = dm_fontSize;
        div.style.zIndex = '9999';
        div.style.whiteSpace = 'nowrap';
        div.style.willChange = 'transform';
        div.style.transform = 'translateZ(0)';
        div.style.pointerEvents = 'none';
        document.body.appendChild(div);

        function animate() {
            let left = parseFloat(div.style.left);
            if (left > 100) {
                div.remove();
                return;
            }
            div.style.left = `${left + speed}%`;
            requestAnimationFrame(animate);
        }
        animate();

        // 备用清理机制
        const cleanupTimer = setTimeout(() => {
            if (div.parentNode) {
                div.remove();
            }
        }, 10000);
        timers.push(cleanupTimer);
    }

    // 防止重复加载：检查是否已经处理过遮罩
    const PROCESSED_FLAG = 'bili-live-mask-processed';
    let isProcessing = false;

    function removeElementsByClassName(className) {
        // 检查是否在真实直播间
        if (!isInValidLiveRoom()) {
            // 不在真实直播间页面，不处理
            return false;
        }

        // 防止重复执行
        if (isProcessing) {
            consoleStyle.warning('遮罩清理正在进行中，跳过重复执行');
            return false;
        }

        // 检查是否已经处理过
        if (document.body && document.body.getAttribute(PROCESSED_FLAG) === 'true') {
            consoleStyle.info('遮罩已清理，跳过重复处理');
            return false;
        }

        isProcessing = true;

        try {
            const elements = document.getElementsByClassName(className);
            const elementCount = elements.length;

            if (elementCount > 0) {
                while (elements.length > 0) {
                    elements[0].remove();
                }

                // 标记为已处理
                if (document.body) {
                    document.body.setAttribute(PROCESSED_FLAG, 'true');
                }

                // 重置未检测到遮罩的计数器（因为检测到了遮罩）
                emptyCheckCount = 0;

                consoleStyle.success(`成功移除 ${elementCount} 个遮罩元素`);

                for(let i = 0; i < exp; i++){
                    showFloatingMessage(msg, color);
                }

                return true; // 成功清除遮罩
            } else {
                consoleStyle.info('未检测到遮罩元素');
                return false; // 未检测到遮罩
            }
        } catch (error) {
            consoleStyle.error(`移除遮罩时出错: ${error.message || error}`);
            return false;
        } finally {
            isProcessing = false;
        }
    }

    // 启动定期检查函数
    function startPeriodicCheck() {
        // 如果已经开始检查，不重复启动
        if (isCheckingStarted) {
            return;
        }

        isCheckingStarted = true;
        consoleStyle.info('遮罩已清除，开始定期检查新出现的遮罩');

        // 定期检查并清理新出现的遮罩
        checkTimer = setInterval(function() {
            // 如果脚本已卸载，停止检查
            if (isUnloaded) {
                if (checkTimer) {
                    clearInterval(checkTimer);
                }
                return;
            }

            // 再次检查是否在真实直播间
            if (!isInValidLiveRoom()) {
                return;
            }

            const elements = document.getElementsByClassName("web-player-module-area-mask");
            if (elements.length > 0) {
                // 检测到遮罩，重置计数器
                emptyCheckCount = 0;
                consoleStyle.info(`检测到 ${elements.length} 个新的遮罩元素，正在清理...`);
                removeElementsByClassName("web-player-module-area-mask");
            } else {
                // 未检测到遮罩，增加计数器
                emptyCheckCount++;
                consoleStyle.info(`未检测到遮罩元素 (${emptyCheckCount}/${MAX_EMPTY_CHECKS})`);

                // 如果连续3次未检测到遮罩，自动卸载
                if (emptyCheckCount >= MAX_EMPTY_CHECKS) {
                    if (checkTimer) {
                        clearInterval(checkTimer);
                    }
                    cleanup(true); // 自动卸载
                    return;
                }
            }
        }, 2000);
        timers.push(checkTimer);
    }

    // 清理所有资源的函数
    function cleanup(isAutoUnload = false) {
        if (isUnloaded) {
            return; // 防止重复卸载
        }

        // 清理定期检查定时器
        if (checkTimer) {
            clearInterval(checkTimer);
            checkTimer = null;
        }

        // 清理所有定时器
        timers.forEach(timer => {
            if (typeof timer === 'number') {
                clearTimeout(timer);
            } else {
                clearInterval(timer);
            }
        });
        timers.length = 0;

        // 清理消息元素
        const messageElement = document.getElementById(MESSAGE_ELEMENT_ID);
        if (messageElement) {
            messageElement.remove();
        }

        // 标记为已卸载
        isUnloaded = true;

        if (isAutoUnload) {
            consoleStyle.success('连续3次未检测到遮罩，脚本已自动卸载');
        } else {
            consoleStyle.success('脚本资源清理完成');
        }
    }

    // 页面卸载时清理资源
    window.addEventListener('beforeunload', cleanup);

    // 初始化脚本
    consoleStyle.info('哔哩哔哩直播去除马赛克遮罩脚本已加载');

    // 只在真实直播间页面执行
    if (isInValidLiveRoom()) {
        // 延迟执行遮罩清理
        const clearTimer = setTimeout(function() {
            const hasRemoved = removeElementsByClassName("web-player-module-area-mask");
            // 只有在成功清除遮罩后才开始定期检查
            if (hasRemoved) {
                startPeriodicCheck();
            } else {
                // 如果初始检查没有遮罩，直接卸载脚本
                consoleStyle.info('初始检查未检测到遮罩元素，脚本将自动卸载');
                cleanup(true);
            }
        }, clear_time);
        timers.push(clearTimer);
    } else {
        consoleStyle.info('当前页面不是真实直播间，脚本已跳过执行');
    }
})();
