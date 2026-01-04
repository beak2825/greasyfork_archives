// ==UserScript==
// @name         B站循环助手-精简版
// @namespace    bilibili-replayer
// @version      1.46
// @description  稳定可靠的AB点循环工具，适配最新B站页面结构
// @author       dms
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/bangumi/play/ep*
// @match        https://www.bilibili.com/medialist/play/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/527675/B%E7%AB%99%E5%BE%AA%E7%8E%AF%E5%8A%A9%E6%89%8B-%E7%B2%BE%E7%AE%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/527675/B%E7%AB%99%E5%BE%AA%E7%8E%AF%E5%8A%A9%E6%89%8B-%E7%B2%BE%E7%AE%80%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 存储管理
    const Storage = {
        savePoint: (index, value) => {
            try {
                GM_setValue(`Point_${index}`, value);
                return true;
            } catch(e) {
                console.error('保存点位失败:', e);
                return false;
            }
        },
        getPoint: (index) => {
            try {
                return GM_getValue(`Point_${index}`, null);
            } catch(e) {
                console.error('获取点位失败:', e);
                return null;
            }
        }
    };

    // 工具函数
    const Utils = {
        createButton(text, className, parent) {
            const button = document.createElement('div');
            className.split(' ').forEach(c => button.classList.add(c));
            button.innerText = text;
            parent.appendChild(button);
            return button;
        },

        showNotification(text, title = '提示', timeout = 2000) {
            GM_notification({
                text,
                title,
                timeout
            });
        }
    };

    class VideoController {
        constructor(video) {
            this.video = video;
            this.points = [0, video.duration-1];
            this.pointButtons = [];
            this.animationFrameId = null;
            this.lastTime = 0;
        }

        setPoint(index, value) {
            if (this.pointButtons[index].classList.contains('active-button')) {
                this.points[index] = index ? this.video.duration-1 : 0;
                this.pointButtons[index].classList.remove('active-button');
                Storage.savePoint(index, null);
            } else {
                this.points[index] = value;
                this.pointButtons[index].classList.add('active-button');
                Storage.savePoint(index, this.points[index]);
            }
        }

        startLoop(button) {
            if(this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
                button.innerText = '⯈循环';
                return;
            }
            
            button.innerText = '⯀停止';
            const checkLoop = (timestamp) => {
                if (timestamp - this.lastTime > 200) {
                    const A = this.points[0] <= this.points[1] ? this.points[0] : this.points[1];
                    const B = this.points[0] > this.points[1] ? this.points[0] : this.points[1];
                    if(this.video.currentTime >= B) {
                        this.video.currentTime = A;
                    }
                    this.lastTime = timestamp;
                }
                this.animationFrameId = requestAnimationFrame(checkLoop);
            };
            this.animationFrameId = requestAnimationFrame(checkLoop);
        }
    }

    function updateToolbarPosition(toolbarbox) {
        const playerContainer = document.querySelector('.bpx-player-container');
        if (toolbarbox && playerContainer) {
            const isFullscreen = playerContainer.getAttribute('data-screen') === 'full';
            toolbarbox.style.position = 'absolute';
            
            if (isFullscreen) {
                toolbarbox.style.left = '50px'; // 改这里数值可以调整全屏时工具栏的水平位置（左边缘距离）
                toolbarbox.style.right = 'auto';
                toolbarbox.style.bottom = '120px'; // 改这里数值可以调整全屏时工具栏的垂直位置（下边缘距离）
                toolbarbox.style.transform = 'scale(1.2)';
            } else {
                toolbarbox.style.left = 'auto';
                toolbarbox.style.right = '600px'; // 改这里数值可以调整非全屏时工具栏的水平位置（右边缘距离）
                toolbarbox.style.bottom = 'auto'; // 改这里数值可以调整非全屏时工具栏的垂直位置
                toolbarbox.style.transform = 'scale(1)';
            }
        }
    }

    const createToolbar = () => {
        let retryCount = 0;
        const maxRetries = 30;

        const tryCreate = () => {
            const video = document.querySelector('#bilibili-player video');
            const controlBar = document.querySelector('.bpx-player-control-bottom');
            
            if (!video || !controlBar) {
                retryCount++;
                if (retryCount < maxRetries) {
                    setTimeout(tryCreate, 500);
                }
                return;
            }

            const controller = new VideoController(video);

            // 创建工具栏容器
            const toolbarbox = document.createElement('div');
            toolbarbox.className = 'ab-loop-toolbar';
            
            // 设置基础样式
            toolbarbox.style.cssText = `
                display: flex;
                align-items: center;
                height: 20px;
                z-index: 999;
                background-color: rgba(0, 0, 0, 0.35);
                border-radius: 4px;
                padding: 0px 5px;
                position: absolute;
                right: 600px; // 改这里数值可以调整非全屏时工具栏初始的水平位置（右边缘距离）
                bottom: auto;
                transform: scale(1);
            `;

            // 创建自定义样式
            const style = document.createElement('style');
            style.textContent = `
                .tool-item {
                    padding: 0 6px;
                    margin: 0 1px;
                    height: 22px;
                    line-height: 22px;
                    color: #ffffff;
                    cursor: pointer;
                    opacity: 0.85;
                    transition: all 0.2s ease;
                    border-radius: 2px;
                    user-select: none;
                }
                .tool-button:hover {
                    opacity: 1;
                    background-color: rgba(255, 255, 255, 0.1);
                }
                .active-button {
                    background-color: #00a1d6 !important;
                    color: white !important;
                    opacity: 1 !important;
                }
            `;
            document.head.appendChild(style);

            controlBar.appendChild(toolbarbox);

            // 设置初始位置
            updateToolbarPosition(toolbarbox);

            // 创建按钮
            const pointA = Utils.createButton('起点', 'tool-item tool-button', toolbarbox);
            const toA = Utils.createButton('跳A', 'tool-item tool-button', toolbarbox);
            
            Utils.createButton('|', 'tool-item tool-text', toolbarbox);
            const pointB = Utils.createButton('终点', 'tool-item tool-button', toolbarbox);
            const toB = Utils.createButton('跳B', 'tool-item tool-button', toolbarbox);
            
            Utils.createButton('|', 'tool-item tool-text', toolbarbox);
            const Start = Utils.createButton('⯈循环', 'tool-item tool-button', toolbarbox);

            controller.pointButtons = [pointA, pointB];

            // 事件监听
            pointA.addEventListener('click', () => {
                controller.setPoint(0, video.currentTime);
            });

            pointB.addEventListener('click', () => {
                controller.setPoint(1, video.currentTime);
            });

            Start.addEventListener('click', () => controller.startLoop(Start));
            toA.addEventListener('click', () => { video.currentTime = controller.points[0]; });
            toB.addEventListener('click', () => { video.currentTime = controller.points[1]; });

            // 监听全屏切换
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'data-screen') {
                        updateToolbarPosition(toolbarbox);
                    }
                });
            });

            const playerContainer = document.querySelector('.bpx-player-container');
            if (playerContainer) {
                observer.observe(playerContainer, {
                    attributes: true,
                    attributeFilter: ['data-screen']
                });
            }
        };

        tryCreate();
    };

    // 检查页面加载状态
    if (document.readyState === 'complete') {
        createToolbar();
    } else {
        window.addEventListener('load', createToolbar);
    }
})();