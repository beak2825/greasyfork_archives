// ==UserScript==
// @name         B站长按左键快进、双击后长按快退（保留点击暂停和双击全屏）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  长按鼠标左键快进，双击后长按快退，保留单击暂停和双击全屏功能，左手不用放键盘上了，可以躺着用蓝牙鼠标看视频啦
// @author       PZ Yin (Modified)
// @match        https://www.bilibili.com/video/*
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/limonte-sweetalert2/11.4.4/sweetalert2.all.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535689/B%E7%AB%99%E9%95%BF%E6%8C%89%E5%B7%A6%E9%94%AE%E5%BF%AB%E8%BF%9B%E3%80%81%E5%8F%8C%E5%87%BB%E5%90%8E%E9%95%BF%E6%8C%89%E5%BF%AB%E9%80%80%EF%BC%88%E4%BF%9D%E7%95%99%E7%82%B9%E5%87%BB%E6%9A%82%E5%81%9C%E5%92%8C%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535689/B%E7%AB%99%E9%95%BF%E6%8C%89%E5%B7%A6%E9%94%AE%E5%BF%AB%E8%BF%9B%E3%80%81%E5%8F%8C%E5%87%BB%E5%90%8E%E9%95%BF%E6%8C%89%E5%BF%AB%E9%80%80%EF%BC%88%E4%BF%9D%E7%95%99%E7%82%B9%E5%87%BB%E6%9A%82%E5%81%9C%E5%92%8C%E5%8F%8C%E5%87%BB%E5%85%A8%E5%B1%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置键
    const FORWARD_RATE_KEY = 'bilibili_quick_rate';
    const REWIND_INTERVAL_KEY = 'bilibili_rewind_interval';

    // 获取配置
    let forwardRate = GM_getValue(FORWARD_RATE_KEY) || 3;
    let rewindInterval = GM_getValue(REWIND_INTERVAL_KEY) || 5;

    // 状态变量
    let quickMode = false;      // 是否处于快进模式
    let rewindMode = false;     // 是否处于快退模式
    let originalRate = 1;       // 原始播放速率
    let isLongPress = false;    // 是否长按
    let pressTimer = null;      // 长按计时器
    let rewindTimer = null;     // 快退计时器
    let lastClickTime = 0;      // 上次点击时间
    let isDoubleClick = false;  // 是否双击
    let rewindJustFinished = false; // 快退刚刚结束标志

    // 创建HUD显示
    const createHUD = () => {
        const hud = document.createElement('div');
        Object.assign(hud.style, {
            position: 'fixed',
            top: '10%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '10px',
            fontSize: '18px',
            zIndex: 9999,
            display: 'none',
            pointerEvents: 'none'  // 防止HUD拦截鼠标事件
        });
        hud.id = 'bilibili-control-hud';
        document.body.appendChild(hud);
        return hud;
    };

    const hud = createHUD();

    // 显示/隐藏HUD
    const showHUD = (text) => {
        hud.textContent = text;
        hud.style.display = 'block';

        // 3秒后自动隐藏
        setTimeout(() => {
            if (hud.textContent === text) {
                hideHUD();
            }
        }, 3000);
    };

    const hideHUD = () => {
        hud.style.display = 'none';
    };

    // 初始化函数
    const initialize = () => {
        // 找到视频元素
        const findVideo = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                clearInterval(findVideo);
                setupControls(video);
            }
        }, 500);
    };

    // 设置控制
    const setupControls = (video) => {
        // 获取视频容器
        const container = document.querySelector('.bpx-player-video-wrap') ||
                          document.querySelector('.bilibili-player-video-wrap') ||
                          video.parentElement;

        if (!container) return;

        // 监听鼠标按下
        container.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // 只处理左键

            // 如果快退刚刚结束，忽略这次点击
            if (rewindJustFinished) {
                e.stopPropagation();
                e.preventDefault();
                rewindJustFinished = false;
                return;
            }

            // 检测双击
            const now = Date.now();
            isDoubleClick = (now - lastClickTime < 300);
            lastClickTime = now;

            // 记录原始播放速率
            originalRate = video.playbackRate;
            isLongPress = false;

            // 设置长按计时器
            pressTimer = setTimeout(() => {
                isLongPress = true;

                if (isDoubleClick) {
                    // 双击后长按：快退模式
                    rewindMode = true;

                    // 设置快退计时器
                    rewindTimer = setInterval(() => {
                        // 每隔200ms快退一次
                        video.currentTime = Math.max(0, video.currentTime - rewindInterval);
                    }, 200);

                    showHUD(`快退模式: 每步 ${rewindInterval} 秒`);

                    // 阻止事件传播以防止触发其他操作
                    e.stopPropagation();
                    e.preventDefault();
                } else {
                    // 普通长按：快进模式
                    quickMode = true;
                    video.playbackRate = forwardRate;
                    showHUD(`快进模式: ${forwardRate}x`);
                }
            }, 300); // 300ms判定为长按
        });

        // 防止双击后快退松开触发其他事件
    let preventActionUntil = 0;

    // 监听双击事件来阻止全屏
    container.addEventListener('dblclick', (e) => {
        if (rewindMode || (isLongPress && isDoubleClick)) {
            e.stopPropagation();
            e.preventDefault();
        }
    }, true); // 捕获阶段

    // 监听鼠标松开
    container.addEventListener('mouseup', (e) => {
        if (e.button !== 0) return; // 只处理左键

        // 清除长按计时器
        clearTimeout(pressTimer);

        // 处理快进模式
        if (quickMode) {
            video.playbackRate = originalRate;
            quickMode = false;
            hideHUD();
        }

        // 处理快退模式
        if (rewindMode) {
            clearInterval(rewindTimer);
            rewindMode = false;
            hideHUD();

            // 设置防止操作的时间锁（500ms内不触发其他操作）
            preventActionUntil = Date.now() + 500;

            // 阻止事件传播，防止双击全屏或单击暂停
            e.stopPropagation();
            e.preventDefault();

            // 确保视频播放
            if (video.paused) {
                video.play().catch(() => {});
            } else {
                // 如果视频已经在播放，确保不会被暂停
                // 通过设置一个短暂的间隔来检查和恢复播放状态
                const ensurePlayingInterval = setInterval(() => {
                    if (video.paused) {
                        video.play().catch(() => {});
                    }
                }, 50);

                // 500ms后停止检查
                setTimeout(() => {
                    clearInterval(ensurePlayingInterval);
                    rewindJustFinished = false;
                }, 500);
            }

            // 标记快退刚刚结束，用于阻止后续的点击事件
            rewindJustFinished = true;

            // 要确保之后的几个连续 click 事件也被拦截，设置一个临时的拦截器
            const clickBlocker = (evt) => {
                evt.stopPropagation();
                evt.preventDefault();
                evt.stopImmediatePropagation();
            };

            // 给 document 和 container 都添加事件监听器
            document.addEventListener('click', clickBlocker, true);
            container.addEventListener('click', clickBlocker, true);

            // 500ms 后移除这些监听器
            setTimeout(() => {
                document.removeEventListener('click', clickBlocker, true);
                container.removeEventListener('click', clickBlocker, true);
                rewindJustFinished = false;
            }, 500);

            return false;
        }
    });

    // 在捕获阶段阻止长按和快退后短时间内产生的各种事件
    container.addEventListener('click', (e) => {
        // 阻止快退结束后或长按状态下的点击事件
        if (isLongPress || Date.now() < preventActionUntil) {
            e.stopImmediatePropagation();
            e.preventDefault();
        }
    }, true); // 捕获阶段

        // 处理鼠标离开容器
        container.addEventListener('mouseleave', () => {
            // 清除计时器
            clearTimeout(pressTimer);
            clearInterval(rewindTimer);

            // 重置模式
            if (quickMode) {
                video.playbackRate = originalRate;
                quickMode = false;
            }

            rewindMode = false;
            isLongPress = false;
            hideHUD();
        });

        // 设置快进速率菜单
        GM_registerMenuCommand('设置快进速率', async () => {
            const result = await Swal.fire({
                title: '设置快进速率（0=暂停，最高16）',
                input: 'range',
                inputAttributes: {
                    min: 0,
                    max: 16,
                    step: 0.1,
                },
                inputValue: forwardRate
            });

            if (result.isConfirmed) {
                forwardRate = +result.value;
                GM_setValue(FORWARD_RATE_KEY, forwardRate);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `设置成功，当前快进速率: ${forwardRate}x`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });

        // 设置快退间隔菜单
        GM_registerMenuCommand('设置快退间隔', async () => {
            const result = await Swal.fire({
                title: '设置快退间隔（1-30秒）',
                input: 'range',
                inputAttributes: {
                    min: 1,
                    max: 30,
                    step: 1,
                },
                inputValue: rewindInterval
            });

            if (result.isConfirmed) {
                rewindInterval = +result.value;
                GM_setValue(REWIND_INTERVAL_KEY, rewindInterval);
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: `设置成功，当前快退间隔: ${rewindInterval}秒/步`,
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };

    // 启动脚本
    initialize();
})();