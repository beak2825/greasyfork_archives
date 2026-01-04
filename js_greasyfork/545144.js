// ==UserScript==
// @name         YouTube自动跳过广告 - 增强人类行为模拟
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  YouTube自动跳过广告，支持快进和点击跳过按钮，高度仿真人类鼠标行为
// @match        https://www.youtube.com/watch*
// @author       Enhanced Human-like Behavior
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545144/YouTube%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%20-%20%E5%A2%9E%E5%BC%BA%E4%BA%BA%E7%B1%BB%E8%A1%8C%E4%B8%BA%E6%A8%A1%E6%8B%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/545144/YouTube%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87%E5%B9%BF%E5%91%8A%20-%20%E5%A2%9E%E5%BC%BA%E4%BA%BA%E7%B1%BB%E8%A1%8C%E4%B8%BA%E6%A8%A1%E6%8B%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        enableLogs: true,           // 日志开关
        enableSkipToEnd: false,     // 快进到结尾开关
        enableClickButton: true,    // 点击跳过按钮开关
        skipDelay: 5000,           // 等待几秒后跳过 (毫秒)
        timeBeforeEnd: 1,          // 跳到总时长前几秒
        detectInterval: 500,       // 检测间隔时间 (毫秒)
        minAdDuration: 10,         // 最小广告时长，小于此时长不跳过 (秒)
        clickDelay: 3000,          // 等待几秒后点击跳过按钮 (毫秒)
        humanizeClick: true,       // 模拟人类点击行为
        skipMethod: 'progressive', // 跳过方法: 'direct'=直接跳, 'progressive'=渐进式, 'playbackRate'=倍速
        progressiveStep: 2,        // 渐进式跳过的步长(秒)
        maxPlaybackRate: 16,       // 最大播放倍速

        // 人类行为模拟参数
        mouseMove: {
            enabled: true,              // 启用鼠标移动模拟
            approachSteps: 3,          // 鼠标接近目标的步数
            approachDuration: 800,     // 鼠标接近总时间(ms)
            jitterRange: 3,            // 鼠标抖动范围(px)
            overshootChance: 0.3,      // 鼠标过冲概率
            overshootRange: 15,        // 过冲距离范围(px)
        },
        mouseTimings: {
            hoverDelay: [100, 300],    // 悬停延迟范围(ms)
            focusDelay: [50, 150],     // 获得焦点延迟(ms)
            mouseDownDelay: [80, 200], // 鼠标按下延迟(ms)
            clickHoldTime: [40, 120],  // 点击持续时间(ms)
            mouseUpDelay: [20, 80],    // 鼠标抬起延迟(ms)
        },
        humanBehavior: {
            hesitateChance: 0.2,       // 犹豫概率
            hesitateTime: [200, 600],  // 犹豫时间范围(ms)
            doubleClickChance: 0.1,    // 双击概率
            rightClickChance: 0.05,    // 误触右键概率
        }
    };

    let running = true;
    let lastAdDetected = false;
    let skipTimeout = null;
    let clickTimeout = null;
    let skipButtonDetected = false;
    let currentMousePosition = { x: 0, y: 0 };

    // 日志函数
    function log(message, level = 'info') {
        if (!config.enableLogs) return;

        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[YouTube跳广告 ${timestamp}]`;

        switch(level) {
            case 'warn':
                console.warn(prefix, message);
                break;
            case 'error':
                console.error(prefix, message);
                break;
            default:
                console.log(prefix, message);
        }
    }

    // 生成随机数
    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 生成随机整数
    function randomInt(min, max) {
        return Math.floor(random(min, max + 1));
    }

    // 获取随机延迟时间
    function getRandomDelay(range) {
        return randomInt(range[0], range[1]);
    }

    // 贝塞尔曲线插值 - 更自然的鼠标移动轨迹
    function bezierInterpolation(t, p0, p1, p2, p3) {
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const uuu = uu * u;
        const ttt = tt * t;

        return {
            x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
            y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
        };
    }

    // 生成鼠标移动路径点
    function generateMousePath(start, end, steps) {
        const path = [];
        const distance = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));

        // 控制点生成 - 创建更自然的曲线
        const midX = (start.x + end.x) / 2 + random(-distance * 0.3, distance * 0.3);
        const midY = (start.y + end.y) / 2 + random(-distance * 0.3, distance * 0.3);

        const cp1 = {
            x: start.x + (midX - start.x) * 0.3 + random(-20, 20),
            y: start.y + (midY - start.y) * 0.3 + random(-20, 20)
        };

        const cp2 = {
            x: end.x + (midX - end.x) * 0.3 + random(-20, 20),
            y: end.y + (midY - end.y) * 0.3 + random(-20, 20)
        };

        // 生成路径点
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            // 使用easing函数使移动更自然
            const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            const point = bezierInterpolation(easedT, start, cp1, cp2, end);

            // 添加微小的随机抖动
            point.x += random(-1, 1);
            point.y += random(-1, 1);

            path.push(point);
        }

        return path;
    }

    // 模拟鼠标移动到目标位置
    function moveMouseToTarget(element) {
        return new Promise((resolve) => {
            if (!config.mouseMove.enabled) {
                resolve();
                return;
            }

            const rect = element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // 添加随机偏移，使点击位置更自然
            const offsetX = random(-rect.width * 0.3, rect.width * 0.3);
            const offsetY = random(-rect.height * 0.3, rect.height * 0.3);

            const targetX = centerX + offsetX;
            const targetY = centerY + offsetY;

            // 可能的过冲行为
            let finalTarget = { x: targetX, y: targetY };
            if (Math.random() < config.mouseMove.overshootChance) {
                const overshootX = random(-config.mouseMove.overshootRange, config.mouseMove.overshootRange);
                const overshootY = random(-config.mouseMove.overshootRange, config.mouseMove.overshootRange);
                finalTarget = { x: targetX + overshootX, y: targetY + overshootY };
            }

            const start = currentMousePosition;
            const steps = config.mouseMove.approachSteps;
            const path = generateMousePath(start, finalTarget, steps);
            const stepDuration = config.mouseMove.approachDuration / steps;

            let currentStep = 0;

            function moveStep() {
                if (currentStep >= path.length) {
                    // 如果有过冲，需要修正回目标位置
                    if (finalTarget.x !== targetX || finalTarget.y !== targetY) {
                        const correctionPath = generateMousePath(finalTarget, { x: targetX, y: targetY }, 2);
                        let correctionStep = 0;

                        function correctStep() {
                            if (correctionStep >= correctionPath.length) {
                                currentMousePosition = { x: targetX, y: targetY };
                                resolve();
                                return;
                            }

                            const point = correctionPath[correctionStep];
                            currentMousePosition = point;

                            // 触发鼠标移动事件
                            element.dispatchEvent(new MouseEvent('mousemove', {
                                bubbles: true,
                                cancelable: true,
                                clientX: point.x,
                                clientY: point.y
                            }));

                            correctionStep++;
                            setTimeout(correctStep, getRandomDelay([30, 80]));
                        }

                        setTimeout(correctStep, getRandomDelay([50, 150]));
                    } else {
                        currentMousePosition = finalTarget;
                        resolve();
                    }
                    return;
                }

                const point = path[currentStep];
                currentMousePosition = point;

                // 触发鼠标移动事件
                element.dispatchEvent(new MouseEvent('mousemove', {
                    bubbles: true,
                    cancelable: true,
                    clientX: point.x,
                    clientY: point.y
                }));

                currentStep++;
                const nextDelay = stepDuration + random(-stepDuration * 0.3, stepDuration * 0.3);
                setTimeout(moveStep, nextDelay);
            }

            moveStep();
        });
    }

    // 模拟鼠标悬停和获得焦点
    function simulateHoverAndFocus(element) {
        return new Promise((resolve) => {
            const { x, y } = currentMousePosition;

            // 触发鼠标进入事件
            element.dispatchEvent(new MouseEvent('mouseenter', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            }));

            element.dispatchEvent(new MouseEvent('mouseover', {
                bubbles: true,
                cancelable: true,
                clientX: x,
                clientY: y
            }));

            log('🖱️ 鼠标悬停在跳过按钮上');

            // 随机悬停时间
            const hoverDelay = getRandomDelay(config.mouseTimings.hoverDelay);

            setTimeout(() => {
                // 尝试获得焦点
                if (element.focus) {
                    element.focus();
                    log('🎯 跳过按钮获得焦点');
                }

                // 可能的犹豫行为
                if (Math.random() < config.humanBehavior.hesitateChance) {
                    const hesitateTime = getRandomDelay(config.humanBehavior.hesitateTime);
                    log(`🤔 模拟犹豫 ${hesitateTime}ms`);
                    setTimeout(resolve, hesitateTime);
                } else {
                    setTimeout(resolve, getRandomDelay(config.mouseTimings.focusDelay));
                }
            }, hoverDelay);
        });
    }

    // 模拟完整的鼠标点击序列
    function simulateMouseClick(element) {
        return new Promise((resolve) => {
            const { x, y } = currentMousePosition;

            // 添加最后的微小位置调整和抖动
            const finalX = x + random(-config.mouseMove.jitterRange, config.mouseMove.jitterRange);
            const finalY = y + random(-config.mouseMove.jitterRange, config.mouseMove.jitterRange);

            currentMousePosition = { x: finalX, y: finalY };

            // 可能的误触右键
            if (Math.random() < config.humanBehavior.rightClickChance) {
                element.dispatchEvent(new MouseEvent('contextmenu', {
                    bubbles: true,
                    cancelable: true,
                    clientX: finalX,
                    clientY: finalY
                }));
                log('👆 误触右键菜单');
                setTimeout(() => simulateActualClick(), getRandomDelay([100, 300]));
            } else {
                simulateActualClick();
            }

            function simulateActualClick() {
                // 鼠标按下
                setTimeout(() => {
                    element.dispatchEvent(new MouseEvent('mousedown', {
                        bubbles: true,
                        cancelable: true,
                        button: 0,
                        clientX: finalX,
                        clientY: finalY
                    }));

                    log('⬇️ 鼠标按下');

                    // 持续按下一段时间
                    const holdTime = getRandomDelay(config.mouseTimings.clickHoldTime);

                    setTimeout(() => {
                        // 鼠标抬起
                        element.dispatchEvent(new MouseEvent('mouseup', {
                            bubbles: true,
                            cancelable: true,
                            button: 0,
                            clientX: finalX,
                            clientY: finalY
                        }));

                        log('⬆️ 鼠标抬起');

                        // 点击事件
                        setTimeout(() => {
                            element.dispatchEvent(new MouseEvent('click', {
                                bubbles: true,
                                cancelable: true,
                                button: 0,
                                clientX: finalX,
                                clientY: finalY
                            }));

                            log('👆 执行点击事件');

                            // 可能的双击行为
                            if (Math.random() < config.humanBehavior.doubleClickChance) {
                                setTimeout(() => {
                                    element.dispatchEvent(new MouseEvent('click', {
                                        bubbles: true,
                                        cancelable: true,
                                        button: 0,
                                        clientX: finalX,
                                        clientY: finalY
                                    }));
                                    log('👆👆 双击行为');
                                    resolve();
                                }, getRandomDelay([50, 200]));
                            } else {
                                resolve();
                            }

                        }, getRandomDelay(config.mouseTimings.mouseUpDelay));

                    }, holdTime);

                }, getRandomDelay(config.mouseTimings.mouseDownDelay));
            }
        });
    }

    // 高度仿真的人类点击行为
    async function humanLikeClick(element) {
        if (!config.humanizeClick) {
            element.click();
            return;
        }

        try {
            log('🎭 开始模拟人类点击行为...');

            // 第一步：移动鼠标到目标
            await moveMouseToTarget(element);
            log('✅ 鼠标移动到目标位置');

            // 第二步：悬停和获得焦点
            await simulateHoverAndFocus(element);
            log('✅ 完成悬停和焦点获取');

            // 第三步：执行点击
            await simulateMouseClick(element);
            log('✅ 完成点击操作');

            // 第四步：鼠标离开（可选）
            setTimeout(() => {
                const leaveX = currentMousePosition.x + random(-50, 50);
                const leaveY = currentMousePosition.y + random(-50, 50);

                element.dispatchEvent(new MouseEvent('mouseleave', {
                    bubbles: true,
                    cancelable: true,
                    clientX: leaveX,
                    clientY: leaveY
                }));

                currentMousePosition = { x: leaveX, y: leaveY };
                log('👋 鼠标离开目标区域');
            }, getRandomDelay([100, 500]));

        } catch (error) {
            log(`点击模拟失败: ${error.message}`, 'error');
            // 降级到普通点击
            element.click();
        }
    }

    // 查找元素
    function findElement(selector) {
        return document.querySelector(selector);
    }

    // 检查是否为广告
    function isAdPresent() {
        const adSelectors = [
            '.ytp-ad-player-overlay',
            '.ytp-ad-text',
            '.ytp-ad-preview-text',
            '.ytp-ad-skip-button-container',
            '.ytp-skip-ad-button',
            '.ad-showing',
            '[class*="ad-showing"]',
            '.html5-video-player.ad-showing'
        ];

        for (let selector of adSelectors) {
            const element = findElement(selector);
            if (element) {
                return { detected: true, element: element, selector: selector };
            }
        }

        return { detected: false, element: null, selector: null };
    }

    // 获取跳过按钮
    function getSkipButton() {
        const skipSelectors = [
            '.ytp-skip-ad-button',
            '.ytp-ad-skip-button',
            '[class*="skip"][class*="button"]',
            'button[aria-label*="跳过广告"]',
            'button[aria-label*="Skip ad"]'
        ];

        for (let selector of skipSelectors) {
            const button = findElement(selector);
            if (button && button.offsetParent !== null) {
                return { button: button, selector: selector };
            }
        }
        return { button: null, selector: null };
    }

    // 快进广告到指定位置 - 多种方法
    function skipAdToEnd(video) {
        if (!video || !video.duration) {
            log('视频未加载或无时长信息', 'warn');
            return false;
        }

        if (video.duration <= config.timeBeforeEnd) {
            log('视频时长不足，无法快进', 'warn');
            return false;
        }

        const targetTime = video.duration - config.timeBeforeEnd;

        switch(config.skipMethod) {
            case 'direct':
                video.currentTime = targetTime;
                log(`[直接] 广告快进到 ${targetTime.toFixed(2)}s (总时长: ${video.duration.toFixed(2)}s)`);
                break;

            case 'progressive':
                progressiveSkip(video, targetTime);
                break;

            case 'playbackRate':
                acceleratePlayback(video);
                break;

            default:
                video.currentTime = targetTime;
                log(`广告快进到 ${targetTime.toFixed(2)}s (总时长: ${video.duration.toFixed(2)}s)`);
        }

        return true;
    }

    // 渐进式跳过
    function progressiveSkip(video, targetTime) {
        const currentTime = video.currentTime;
        const totalSteps = Math.ceil((targetTime - currentTime) / config.progressiveStep);
        let step = 0;

        log(`[渐进式] 开始渐进跳过，从 ${currentTime.toFixed(2)}s 到 ${targetTime.toFixed(2)}s，共 ${totalSteps} 步`);

        const progressiveInterval = setInterval(() => {
            if (!isAdPresent().detected || step >= totalSteps) {
                clearInterval(progressiveInterval);
                return;
            }

            step++;
            const nextTime = Math.min(currentTime + (step * config.progressiveStep), targetTime);
            video.currentTime = nextTime;

            log(`[渐进式] 第 ${step}/${totalSteps} 步，跳到 ${nextTime.toFixed(2)}s`);

            if (nextTime >= targetTime) {
                clearInterval(progressiveInterval);
                log(`[渐进式] 渐进跳过完成`);
            }
        }, 200 + Math.random() * 300);
    }

    // 倍速播放
    function acceleratePlayback(video) {
        const originalRate = video.playbackRate;
        video.playbackRate = config.maxPlaybackRate;

        log(`[倍速] 开始 ${config.maxPlaybackRate}x 倍速播放 (原速度: ${originalRate}x)`);

        const speedInterval = setInterval(() => {
            if (!isAdPresent().detected) {
                video.playbackRate = originalRate;
                clearInterval(speedInterval);
                log(`[倍速] 广告结束，恢复 ${originalRate}x 播放速度`);
                return;
            }

            const timeLeft = video.duration - video.currentTime;
            if (timeLeft <= config.timeBeforeEnd + 1) {
                video.playbackRate = originalRate;
                clearInterval(speedInterval);
                log(`[倍速] 接近广告结尾，恢复 ${originalRate}x 播放速度`);
            }
        }, 100);
    }

    // 点击跳过按钮
    async function clickSkipButton() {
        const { button, selector } = getSkipButton();
        if (button) {
            await humanLikeClick(button);
            log(`✨ 已通过人类行为模拟点击跳过按钮: ${selector}`);
            return true;
        }
        return false;
    }

    // 延迟点击跳过按钮
    function scheduleClickSkip() {
        if (clickTimeout) {
            clearTimeout(clickTimeout);
        }

        log(`🕒 检测到跳过按钮，将在 ${config.clickDelay/1000} 秒后模拟人类点击`);

        clickTimeout = setTimeout(async () => {
            if (isAdPresent().detected) {
                const clicked = await clickSkipButton();
                if (!clicked) {
                    log('跳过按钮已消失，取消点击');
                }
            } else {
                log('延迟期间广告已结束，取消点击跳过');
            }
            clickTimeout = null;
            skipButtonDetected = false;
        }, config.clickDelay);
    }

    // 延迟跳过广告
    function scheduleAdSkip(video) {
        if (skipTimeout) {
            clearTimeout(skipTimeout);
        }
        if (clickTimeout) {
            clearTimeout(clickTimeout);
        }

        log(`将在 ${config.skipDelay/1000} 秒后跳过广告`);

        skipTimeout = setTimeout(() => {
            if (isAdPresent().detected) {
                skipAdToEnd(video);
            } else {
                log('延迟期间广告已结束，取消跳过');
            }
            skipTimeout = null;
        }, config.skipDelay);
    }

    // 初始化鼠标位置
    function initMousePosition() {
        // 从页面中心开始，添加随机偏移
        const centerX = window.innerWidth / 2 + random(-200, 200);
        const centerY = window.innerHeight / 2 + random(-200, 200);
        currentMousePosition = { x: centerX, y: centerY };
        log(`🖱️ 初始鼠标位置: (${centerX.toFixed(0)}, ${centerY.toFixed(0)})`);
    }

    // 主检测循环
    function detectAds() {
        if (!running) return;

        const video = findElement('video');
        const adStatus = isAdPresent();

        if (video && adStatus.detected) {
            if (!lastAdDetected) {
                log(`🚫 检测到广告元素: ${adStatus.selector}`);
                log(`📝 广告元素详情: ${adStatus.element.className}`);

                if (config.enableSkipToEnd) {
                    scheduleAdSkip(video);
                } else {
                    log('⏭️ 快进功能已禁用，跳过快进');
                }

                lastAdDetected = true;
                skipButtonDetected = false;
            } else {
                if (config.enableClickButton) {
                    const { button } = getSkipButton();
                    if (button && !skipButtonDetected) {
                        skipButtonDetected = true;
                        scheduleClickSkip();
                    } else if (button && skipButtonDetected) {
                        log('⏰ 跳过按钮已出现，等待延迟点击...');
                    } else if (!button) {
                        log('🔍 广告播放中，跳过按钮尚未出现...');
                    }
                } else {
                    log('🔄 广告播放中，点击按钮功能已禁用');
                }
            }
        } else {
            if (lastAdDetected) {
                log('✅ 广告已结束');
                lastAdDetected = false;
                skipButtonDetected = false;

                if (skipTimeout) {
                    clearTimeout(skipTimeout);
                    skipTimeout = null;
                }
                if (clickTimeout) {
                    clearTimeout(clickTimeout);
                    clickTimeout = null;
                }
            } else {
                log('▶️ 正常播放中，未检测到广告');
            }
        }

        setTimeout(detectAds, config.detectInterval);
    }

    // 初始化
    function init() {
        log('=== 🎭 YouTube广告跳过脚本已启动 - 人类行为模拟版 ===');
        log(`⚙️ 配置: 快进=${config.enableSkipToEnd}, 点击=${config.enableClickButton}, 跳过方式=${config.skipMethod}`);
        log(`⏱️ 延迟: 跳过=${config.skipDelay/1000}s, 点击=${config.clickDelay/1000}s, 检测间隔=${config.detectInterval}ms`);
        log(`🖱️ 鼠标模拟: 启用=${config.mouseMove.enabled}, 接近步数=${config.mouseMove.approachSteps}, 抖动范围=${config.mouseMove.jitterRange}px`);

        initMousePosition();
        detectAds();
    }

    // 页面卸载清理
    window.addEventListener('beforeunload', () => {
        log('📄 页面即将卸载，停止检测循环');
        running = false;
        if (skipTimeout) {
            clearTimeout(skipTimeout);
        }
        if (clickTimeout) {
            clearTimeout(clickTimeout);
        }
    });

    // 启动脚本
    //if (document.readyState === 'loading') {
    //    document.addEventListener('DOMContentLoaded', init);
    //} else {
        init();
   // }

})();