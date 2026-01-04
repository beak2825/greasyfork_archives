// ==UserScript==
// @name         2dfan jump to multiple sites
// @namespace    http://tampermonkey.net/
// @version      0.9.4
// @description  在2dfan游戏条目上添加实用的按钮
// @author       Breaker mod from Sedoruee
// @match       https://2dfan.com/subjects/*
// @match       https://fan2d.top/subjects/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529389/2dfan%20jump%20to%20multiple%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/529389/2dfan%20jump%20to%20multiple%20sites.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取游戏标题
    const gameTitle = document.querySelector('#content > div > div > div.navbar.navbar-inner.block-header.no-border > h3')?.textContent;

    if (gameTitle) {
        const titleContainer = document.querySelector('#content > div > div > div.navbar.navbar-inner.block-header.no-border');

        // 辅助函数：创建按钮
        const createButton = (text, clickHandler) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.marginLeft = '5px';
            if (clickHandler) {
                button.addEventListener('click', clickHandler);
            }
            titleContainer.appendChild(button);
            return button;
        };

        // 单独搜索按钮
        createButton('VNDB', () => {
            window.location.href = `https://vndb.org/v?q=${encodeURIComponent(gameTitle)}`;
        });
        createButton('真红小站', () => {
            window.location.href = `https://www.shinnku.com/search?q=${encodeURIComponent(gameTitle)}`;
        });
        createButton('GGbase', () => {
            window.location.href = `https://ggb.dlgal.com/search.so?p=0&title=${encodeURIComponent(gameTitle)}`;
        });


        // “多搜索”按钮 —— 悬停1秒后触发
        const multiSearchButton = createButton('搜补丁');
        let multiSearchTimer = null;
        let previewWindows = []; // 保存窗口对象的数组
        let monitorInterval = null; // 用于定时监控焦点的定时器
        let focusMonitorDelayTimer = null; // 用于延迟启动焦点监控

        multiSearchButton.addEventListener('mouseenter', () => {
            multiSearchTimer = setTimeout(() => {
                openPreviewWindows();
            }, 1000);
        });
        multiSearchButton.addEventListener('mouseleave', () => {
            if (multiSearchTimer) {
                clearTimeout(multiSearchTimer);
                multiSearchTimer = null;
            }
        });

        // 打开两个预览窗口，固定在屏幕正中并排显示
        function openPreviewWindows() {
            // 如果已有预览窗口，则先关闭它们
            closePreviewWindows();

            // 设置窗口尺寸和间隔
            const winWidth = 800; // 加宽窗口以适应两个窗口
            const winHeight = 1600;
            const gap = 10;
            const totalWidth = winWidth * 2 + gap; // 计算两个窗口的总宽度
            // 屏幕正中位置
            const leftStart = Math.floor((screen.width - totalWidth) / 2);
            const topPos = Math.floor((screen.height - winHeight) / 2);

            // 定义两个预览网址
            const urls = [
                `https://www.ai2.moe/search/?q=${encodeURIComponent(gameTitle)}`,
                `https://www.moyu.moe/search?q=${encodeURIComponent(gameTitle)}`
            ];

            previewWindows = []; // Reset the array before opening new windows
            urls.forEach((url, index) => {
                const leftPos = leftStart + index * (winWidth + gap);
                const features = `width=${winWidth},height=${winHeight},left=${leftPos},top=${topPos},resizable=yes,scrollbars=yes`;
                const newWin = window.open(url, '_blank', features);
                if (newWin) {
                    previewWindows.push(newWin);
                    newWin.onload = () => {
                        newWin.document.addEventListener('click', function(event) {
                            if (event.target.tagName === 'A') {
                                event.preventDefault(); // 阻止默认链接行为在弹窗中打开
                                const href = event.target.href;
                                closePreviewWindows(); // 关闭所有弹窗
                                window.open(href, '_blank'); // 在新标签页中打开链接
                            }
                        });
                    };
                } else {
                    console.warn("弹窗被拦截，无法打开：", url);
                }
            });

            // 延迟 2 秒启动定时器，监控焦点
            focusMonitorDelayTimer = setTimeout(() => {
                startFocusMonitor();
            }, 2000);
        }

        // 关闭所有预览窗口
        function closePreviewWindows() {
            stopFocusMonitor(); // 停止焦点监控定时器
            if (focusMonitorDelayTimer) { // 清除延迟启动定时器
                clearTimeout(focusMonitorDelayTimer);
                focusMonitorDelayTimer = null;
            }
            // 避免在beforeunload事件中重复关闭，使用forEach安全地关闭所有窗口
            previewWindows.forEach(win => {
                if (win && !win.closed) {
                    win.close();
                }
            });
            previewWindows = []; // 清空数组
        }

        //  ---  焦点监控逻辑  ---
        function startFocusMonitor() {
            if (!monitorInterval) {
                monitorInterval = setInterval(monitorFocus, 300); // 每 300ms 检查一次焦点
            }
        }

        function stopFocusMonitor() {
            if (monitorInterval) {
                clearInterval(monitorInterval);
                monitorInterval = null;
            }
        }

        function monitorFocus() {
            // **窗口关闭状态轮询和同步关闭**
            for (let i = 0; i < previewWindows.length; i++) {
                if (previewWindows[i] && previewWindows[i].closed) {
                    closePreviewWindows(); // 检测到任何窗口关闭，立即关闭所有
                    return; // 立即返回，避免重复检查
                }
            }

            // 检查主窗口是否失去焦点 (原有的焦点监控逻辑)
            if (!document.hasFocus()) {
                let previewWindowFocused = false;
                // 检查是否有预览窗口获得焦点
                for (let win of previewWindows) {
                    if (win && !win.closed && win.document.hasFocus()) {
                        previewWindowFocused = true;
                        break;
                    }
                }
                // 如果主窗口和所有预览窗口都失去焦点，则关闭预览窗口
                if (!previewWindowFocused) {
                    closePreviewWindows();
                }
            }
        }
    }
})();

