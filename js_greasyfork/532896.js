// ==UserScript==
// @name         国家中小学智慧教育平台助手（修复版）
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  智慧教育平台功能增强：实际倍速播放、伪装播放速率、自动播放、后台播放、自动切换下一节、保持活跃
// @author       wsbg
// @match        https://basic.smartedu.cn/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532896/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/532896/%E5%9B%BD%E5%AE%B6%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B%EF%BC%88%E4%BF%AE%E5%A4%8D%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 用户配置
    const CONFIG = {
        playbackRate: 1.5,      // 实际播放速度
        fakeRate: 1.0,          // 伪装的播放速度
        autoPlay: true,         // 自动播放
        backgroundPlay: true,   // 后台播放
        autoNext: true,         // 自动切换下一节
        keepActive: true,       // 保持活跃
        keepActiveInterval: 60  // 活跃间隔（秒）
    };

    // 全局变量
    let videoPlayer = null;
    let originalPlaybackRateDescriptor = null;

    // 主函数，等待视频元素加载
    const initEnhancement = () => {
        // 查找视频元素
        const video = findVideoElement();
        if (!video) {
            console.log('[智慧教育平台助手] 等待视频元素...');
            setTimeout(initEnhancement, 1000);
            return;
        }

        console.log('[智慧教育平台助手] 视频元素已找到，开始增强功能');
        videoPlayer = video;
        enhanceVideo(video);
    };

    // 查找视频元素
    const findVideoElement = () => {
        // 尝试查找可能的视频元素
        const videoElements = document.querySelectorAll('video');
        if (videoElements.length > 0) {
            return videoElements[0];
        }

        // 寻找可能嵌入在iframe中的视频
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const iframeVideos = iframeDoc.querySelectorAll('video');
                if (iframeVideos.length > 0) {
                    return iframeVideos[0];
                }
            } catch (e) {
                // 跨域iframe无法访问
                console.log('[智慧教育平台助手] 无法访问iframe内容');
            }
        }

        return null;
    };

    // 增强视频功能
    const enhanceVideo = (video) => {
        // 保存视频引用
        videoPlayer = video;

        try {
            // 1. 实际倍速播放与伪装播放速率
            applyPlaybackRateHack(video);

            // 2. 自动播放
            if (CONFIG.autoPlay) {
                applyAutoPlay(video);
            }

            // 3. 后台播放
            if (CONFIG.backgroundPlay) {
                applyBackgroundPlay();
            }

            // 4. 视频播放完自动切换下一节
            if (CONFIG.autoNext) {
                applyAutoNext(video);
            }

            // 5. 保持活跃
            if (CONFIG.keepActive) {
                applyKeepActive();
            }

            // 添加控制面板
            addControlPanel();
        } catch (e) {
            console.error('[智慧教育平台助手] 增强视频功能时出错:', e);
        }
    };

    // 应用播放速率hack
    const applyPlaybackRateHack = (video) => {
        try {
            // 方法1: 直接设置视频元素的播放速率
            const directPlaybackRateSet = () => {
                // 存储原始播放速率
                const originalRate = video.playbackRate;
                console.log(`[智慧教育平台助手] 原始播放速率: ${originalRate}`);

                // 使用原始的setter设置实际播放速率
                video.playbackRate = CONFIG.playbackRate;
                console.log(`[智慧教育平台助手] 已设置播放速率: ${CONFIG.playbackRate}x`);

                // 监听速率变化，保持我们想要的速率
                const playbackObserver = new MutationObserver(function() {
                    if (video.playbackRate !== CONFIG.playbackRate) {
                        console.log(`[智慧教育平台助手] 检测到播放速率被修改为 ${video.playbackRate}，重置为 ${CONFIG.playbackRate}`);
                        video.playbackRate = CONFIG.playbackRate;
                    }
                });

                // 定期检查播放速率
                setInterval(() => {
                    if (video.playbackRate !== CONFIG.playbackRate) {
                        console.log(`[智慧教育平台助手] 定期检查: 播放速率被修改为 ${video.playbackRate}，重置为 ${CONFIG.playbackRate}`);
                        video.playbackRate = CONFIG.playbackRate;
                    }
                }, 1000);

                // 方法2: 尝试拦截可能的播放速率API
                try {
                    // 为视频播放器添加自定义属性
                    video._originalPlaybackRate = video.playbackRate;
                    video._customPlaybackRate = CONFIG.playbackRate;

                    // 保存原始描述符
                    originalPlaybackRateDescriptor = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'playbackRate');

                    if (originalPlaybackRateDescriptor) {
                        // 重写playbackRate属性
                        Object.defineProperty(video, 'playbackRate', {
                            get: function() {
                                return CONFIG.fakeRate; // 返回伪装的速率
                            },
                            set: function(value) {
                                console.log(`[智慧教育平台助手] 拦截到播放速率设置: ${value}，实际使用: ${CONFIG.playbackRate}`);
                                this._originalPlaybackRate = value; // 记录原始请求的速率
                                originalPlaybackRateDescriptor.set.call(this, CONFIG.playbackRate); // 使用我们想要的速率
                            },
                            configurable: true
                        });
                    }
                } catch(e) {
                    console.error('[智慧教育平台助手] 重写playbackRate属性失败:', e);
                }
            };

            // 执行播放速率设置
            directPlaybackRateSet();

            // 视频恢复播放时，确保速率正确
            video.addEventListener('play', function() {
                setTimeout(() => {
                    video.playbackRate = CONFIG.playbackRate;
                }, 100);
            });

            console.log(`[智慧教育平台助手] 已应用播放速率：实际${CONFIG.playbackRate}x，伪装${CONFIG.fakeRate}x`);

        } catch (e) {
            console.error('[智慧教育平台助手] 应用播放速率hack失败:', e);
        }
    };

    // 应用自动播放
    const applyAutoPlay = (video) => {
        try {
            const tryPlay = () => {
                if (video && video.paused) {
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => {
                            console.log('[智慧教育平台助手] 自动播放被阻止，等待用户交互:', error);

                            // 监听用户交互后再播放
                            const playOnInteraction = () => {
                                if (video && video.paused) {
                                    video.play().catch(e => console.log('[智慧教育平台助手] 用户交互后播放失败:', e));
                                }
                                document.removeEventListener('click', playOnInteraction);
                                document.removeEventListener('keydown', playOnInteraction);
                            };
                            document.addEventListener('click', playOnInteraction);
                            document.addEventListener('keydown', playOnInteraction);
                        });
                    }
                }
            };

            // 尝试自动播放
            setTimeout(tryPlay, 1000);

            // 处理可能的暂停事件
            video.addEventListener('pause', () => {
                if (CONFIG.autoPlay && !video.ended) {
                    console.log('[智慧教育平台助手] 视频被暂停，尝试继续播放');
                    setTimeout(() => {
                        if (video && video.paused && !video.ended) {
                            video.play().catch(e => console.log('[智慧教育平台助手] 无法自动恢复播放:', e));
                        }
                    }, 500);
                }
            });

            console.log('[智慧教育平台助手] 已应用自动播放');
        } catch (e) {
            console.error('[智慧教育平台助手] 应用自动播放失败:', e);
        }
    };

    // 应用后台播放
    const applyBackgroundPlay = () => {
        try {
            // 覆盖页面可见性API
            let originalVisibilityState = null;
            try {
                originalVisibilityState = Object.getOwnPropertyDescriptor(Document.prototype, 'visibilityState');
                Object.defineProperty(Document.prototype, 'visibilityState', {
                    get: function() {
                        return 'visible';
                    }
                });
            } catch (e) {
                console.error('[智慧教育平台助手] 覆盖visibilityState失败:', e);
            }

            let originalHidden = null;
            try {
                originalHidden = Object.getOwnPropertyDescriptor(Document.prototype, 'hidden');
                Object.defineProperty(Document.prototype, 'hidden', {
                    get: function() {
                        return false;
                    }
                });
            } catch (e) {
                console.error('[智慧教育平台助手] 覆盖hidden失败:', e);
            }

            // 阻止visibilitychange事件
            const visibilityHandler = (e) => {
                e.stopImmediatePropagation();
            };

            document.addEventListener('visibilitychange', visibilityHandler, true);

            // 定期检查视频是否因为后台而暂停
            setInterval(() => {
                if (CONFIG.backgroundPlay && videoPlayer && videoPlayer.paused && !videoPlayer.ended) {
                    console.log('[智慧教育平台助手] 检测到可能的后台暂停，尝试继续播放');
                    videoPlayer.play().catch(e => {});
                }
            }, 2000);

            console.log('[智慧教育平台助手] 已应用后台播放');
        } catch (e) {
            console.error('[智慧教育平台助手] 应用后台播放失败:', e);
        }
    };

    // 应用自动切换下一节
    const applyAutoNext = (video) => {
        try {
            const endedHandler = () => {
                console.log('[智慧教育平台助手] 视频播放完毕，准备切换下一节');

                // 等待一段时间，确保所有结束处理已完成
                setTimeout(() => {
                    // 查找可能的"下一节"按钮
                    const nextButtons = findNextButton();

                    if (nextButtons.length > 0) {
                        console.log('[智慧教育平台助手] 找到下一节按钮，点击切换');
                        nextButtons[0].click();
                    } else {
                        console.log('[智慧教育平台助手] 未找到下一节按钮，尝试其他方法');

                        // 另一种尝试：查找可能的下一章节链接
                        tryFindNextChapter();
                    }
                }, 2000);
            };

            // 监听视频结束事件
            video.addEventListener('ended', endedHandler);

            console.log('[智慧教育平台助手] 已应用自动切换下一节');
        } catch (e) {
            console.error('[智慧教育平台助手] 应用自动切换下一节失败:', e);
        }
    };

    // 查找下一节按钮
    const findNextButton = () => {
        // 尝试多种可能的选择器和文本内容
        const buttonSelectors = [
            'button', '.btn', '.button', '[class*="next"]', '[id*="next"]',
            '[class*="下一"]', '[id*="下一"]', 'a[href]', '.ant-btn'
        ];

        const possibleNextTexts = ['next', '下一', '下一节', '下一课', '继续学习', '继续', '下一页'];

        // 搜集所有可能的按钮
        const allPossibleButtons = [];
        buttonSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(btn => {
                allPossibleButtons.push(btn);
            });
        });

        // 过滤可能的"下一节"按钮
        return allPossibleButtons.filter(el => {
            const text = (el.textContent || '').toLowerCase();
            return possibleNextTexts.some(nextText => text.includes(nextText));
        });
    };

    // 尝试查找下一章节
    const tryFindNextChapter = () => {
        // 尝试查找章节列表中的活跃项，然后点击下一个
        const chapterItems = document.querySelectorAll('.chapter-item, .lesson-item, [class*="chapter"], [class*="lesson"]');
        let activeIndex = -1;

        // 查找当前活跃章节
        for (let i = 0; i < chapterItems.length; i++) {
            if (chapterItems[i].classList.contains('active') ||
                chapterItems[i].querySelector('.active')) {
                activeIndex = i;
                break;
            }
        }

        // 如果找到活跃章节，点击下一个
        if (activeIndex !== -1 && activeIndex < chapterItems.length - 1) {
            console.log('[智慧教育平台助手] 尝试点击下一章节');
            chapterItems[activeIndex + 1].click();
        }
    };

    // 应用保持活跃
    const applyKeepActive = () => {
        try {
            const keepAliveInterval = setInterval(() => {
                if (!CONFIG.keepActive) {
                    clearInterval(keepAliveInterval);
                    return;
                }

                // 模拟鼠标移动
                const eventOptions = {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: Math.floor(Math.random() * window.innerWidth),
                    clientY: Math.floor(Math.random() * window.innerHeight)
                };

                const moveEvent = new MouseEvent('mousemove', eventOptions);
                document.dispatchEvent(moveEvent);

                // 额外模拟轻微鼠标移动，更逼真
                setTimeout(() => {
                    const smallMoveEvent = new MouseEvent('mousemove', {
                        ...eventOptions,
                        clientX: eventOptions.clientX + 5,
                        clientY: eventOptions.clientY + 3
                    });
                    document.dispatchEvent(smallMoveEvent);
                }, 100);

                console.log('[智慧教育平台助手] 模拟活跃操作');

                // 检查视频是否播放，如果暂停了就尝试继续播放
                if (videoPlayer && videoPlayer.paused && !videoPlayer.ended && CONFIG.autoPlay) {
                    videoPlayer.play().catch(e => {});
                }

                // 检查并重置播放速率
                if (videoPlayer && videoPlayer.playbackRate !== CONFIG.playbackRate) {
                    videoPlayer.playbackRate = CONFIG.playbackRate;
                }

            }, CONFIG.keepActiveInterval * 1000);

            console.log('[智慧教育平台助手] 已应用保持活跃');
        } catch (e) {
            console.error('[智慧教育平台助手] 应用保持活跃失败:', e);
        }
    };

    // 添加控制面板
    const addControlPanel = () => {
        try {
            // 检查是否已存在面板
            if (document.getElementById('edu-helper-panel')) {
                return;
            }

            const panel = document.createElement('div');
            panel.id = 'edu-helper-panel';
            panel.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 10px;
                border-radius: 5px;
                z-index: 9999;
                font-size: 12px;
                transition: opacity 0.3s;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            `;

            panel.innerHTML = `
                <div style="text-align: center; margin-bottom: 5px; font-weight: bold;">智慧教育平台助手</div>
                <div>
                    <label>实际倍速:
                        <input type="number" id="edu-helper-rate" min="0.5" max="16" step="0.25" value="${CONFIG.playbackRate}" style="width: 50px; background: rgba(255, 255, 255, 0.2); color: white; border: 1px solid #555;">
                    </label>
                </div>
                <div style="margin-top: 5px;">
                    <label><input type="checkbox" id="edu-helper-autoplay" ${CONFIG.autoPlay ? 'checked' : ''}> 自动播放</label>
                </div>
                <div>
                    <label><input type="checkbox" id="edu-helper-background" ${CONFIG.backgroundPlay ? 'checked' : ''}> 后台播放</label>
                </div>
                <div>
                    <label><input type="checkbox" id="edu-helper-autonext" ${CONFIG.autoNext ? 'checked' : ''}> 自动下一节</label>
                </div>
                <div>
                    <label><input type="checkbox" id="edu-helper-keepactive" ${CONFIG.keepActive ? 'checked' : ''}> 保持活跃</label>
                </div>
                <div style="margin-top: 5px; text-align: center; font-size: 10px; opacity: 0.7;">
                    点击面板外区域隐藏
                </div>
            `;

            // 悬浮效果
            let isPanelVisible = true;
            panel.addEventListener('mouseenter', () => {
                panel.style.opacity = '1';
            });

            panel.addEventListener('mouseleave', () => {
                if (!isPanelVisible) {
                    panel.style.opacity = '0.3';
                }
            });

            document.addEventListener('click', (e) => {
                if (!panel.contains(e.target)) {
                    isPanelVisible = false;
                    panel.style.opacity = '0.3';
                } else {
                    isPanelVisible = true;
                    panel.style.opacity = '1';
                }
            });

            document.body.appendChild(panel);

            // 添加事件监听
            document.getElementById('edu-helper-rate').addEventListener('change', (e) => {
                CONFIG.playbackRate = parseFloat(e.target.value);
                if (videoPlayer) {
                    videoPlayer.playbackRate = CONFIG.playbackRate;
                    console.log(`[智慧教育平台助手] 已更新播放速率: ${CONFIG.playbackRate}x`);
                }
            });

            document.getElementById('edu-helper-autoplay').addEventListener('change', (e) => {
                CONFIG.autoPlay = e.target.checked;
                console.log(`[智慧教育平台助手] 自动播放: ${CONFIG.autoPlay ? '开启' : '关闭'}`);
            });

            document.getElementById('edu-helper-background').addEventListener('change', (e) => {
                CONFIG.backgroundPlay = e.target.checked;
                console.log(`[智慧教育平台助手] 后台播放: ${CONFIG.backgroundPlay ? '开启' : '关闭'}`);
            });

            document.getElementById('edu-helper-autonext').addEventListener('change', (e) => {
                CONFIG.autoNext = e.target.checked;
                console.log(`[智慧教育平台助手] 自动下一节: ${CONFIG.autoNext ? '开启' : '关闭'}`);
            });

            document.getElementById('edu-helper-keepactive').addEventListener('change', (e) => {
                CONFIG.keepActive = e.target.checked;
                console.log(`[智慧教育平台助手] 保持活跃: ${CONFIG.keepActive ? '开启' : '关闭'}`);
            });

            console.log('[智慧教育平台助手] 已添加控制面板');
        } catch (e) {
            console.error('[智慧教育平台助手] 添加控制面板失败:', e);
        }
    };

    // 启动脚本
    setTimeout(initEnhancement, 1500);

    console.log('[智慧教育平台助手] 脚本已加载');
})();