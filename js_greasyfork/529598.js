// ==UserScript==
// @name            通用视频倍速播放控制
// @namespace       http://tampermonkey.net/
// @version         3.5
// @description     为各类网站视频提供通用的倍速播放控制功能
// @author          ming2k
// @match           https://www.bilibili.com/video/*
// @match           https://www.youtube.com/*
// @match           https://www.iyf.tv/play/*
// @grant           none
// @run-at          document-idle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/529598/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/529598/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置信息 - 针对慢加载视频优化
    const config = {
        // 默认初始播放速度
        defaultSpeed: 1.0,
        // 变速步长
        speedStep: 0.1,
        // 最小速度
        minSpeed: 0.1,
        // 最大速度
        maxSpeed: 4.0,
        // 提示显示时间(毫秒)
        notificationDuration: 1500,
        // 快捷键设置（与MPV兼容）
        hotkeys: {
            increaseSpeed: ']', // 增加速度
            decreaseSpeed: '[', // 减少速度
            resetSpeed: '{',    // 重置速度
            doubleSpeed: '}'    // 2倍速
        },
        // 启用详细日志
        debug: true,
        // 尝试间隔(毫秒) - 增加间隔以处理慢速加载
        retryInterval: 2000,
        // 最大尝试次数 - 大幅增加以处理慢速加载
        maxRetries: 40,
        // 延长初始等待时间(毫秒)
        initialWaitTime: 5000,
        // 长时间监控 - 持续时间(毫秒)
        longTermMonitoring: 300000, // 5分钟
        // 长时间监控 - 检查间隔(毫秒)
        longTermCheckInterval: 8000
    };

    // 状态变量
    let videoElement = null;
    let retryCount = 0;
    let notificationTimer = null;
    let notification = null;
    // 统一的存储键名
    const storageKey = 'video_playback_speed';
    let lastStoredSpeed = parseFloat(localStorage.getItem(storageKey)) || config.defaultSpeed;
    let isInitialized = false;
    let videoObserver = null;
    let speedApplied = false;
    let currentVideoUrl = location.href; // 记录当前视频URL
    let longTermMonitoringTimer = null;
    let videoFoundTime = null;
    let pendingSpeedPromise = null;
    let waitingForVideo = false;

    // 日志函数
    function log(message, force = false) {
        if (config.debug || force) {
            console.log(`[视频倍速控制] ${message}`);
        }
    }

    // 添加样式
    function addStyles() {
        const styles = `
            .speed-notification {
                position: fixed;
                top: 70px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 9999999;
                font-size: 16px;
                font-weight: bold;
                opacity: 0;
                transition: opacity 0.3s ease;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                text-align: center;
                pointer-events: none;
            }
            .speed-notification.show {
                opacity: 1;
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        document.head.appendChild(styleElement);
        log('样式已添加');
    }

    // 创建通知元素
    function createNotification() {
        notification = document.createElement('div');
        notification.className = 'speed-notification';
        document.body.appendChild(notification);
        log('通知元素已创建');
    }

    // 显示通知
    function showNotification(message) {
        if (!notification) {
            createNotification();
        }

        notification.textContent = message;
        notification.classList.add('show');

        // 清除之前的定时器
        if (notificationTimer) {
            clearTimeout(notificationTimer);
        }

        // 设置新定时器隐藏通知
        notificationTimer = setTimeout(() => {
            notification.classList.remove('show');
        }, config.notificationDuration);
    }

    // 检查视频是否可用函数 - 更严格的可用性检查
    function isVideoPlayable(video) {
        if (!video) return false;

        try {
            // 检查视频是否有效
            if (video.readyState === 0) {
                log('视频元素存在但尚未初始化 (readyState=0)');
                return false;
            }

            // 检查视频是否有效源或内容
            const hasSource = video.src ||
                              video.querySelector('source') ||
                              video.readyState > 0;

            // 检查视频是否在文档中
            const isInDocument = document.contains(video);

            // 检查视频是否有尺寸
            const hasDimensions = (video.videoWidth > 0 && video.videoHeight > 0) ||
                                 (video.offsetWidth > 0 && video.offsetHeight > 0);

            // 基本检查
            if (!hasSource) {
                log('视频元素没有有效源');
                return false;
            }

            if (!isInDocument) {
                log('视频元素不在文档中');
                return false;
            }

            // 额外检查 - 可选
            if (!hasDimensions && video.readyState <= 1) {
                log('视频元素没有尺寸且readyState低');
                // 注意：某些网站可能隐藏了视频尺寸，所以这不是硬性条件
                // 如果视频的readyState > 1，我们认为它是可用的，即使没有尺寸
                if (video.readyState <= 1) {
                    return false;
                }
            }

            return true;
        } catch (e) {
            log(`检查视频可用性时出错: ${e.message}`);
            return false;
        }
    }

    // 增强版查找视频元素
    function findVideoElement() {
        // 检查现有的视频元素是否仍然有效
        if (videoElement && isVideoPlayable(videoElement)) {
            return videoElement;
        }

        log('开始查找视频元素...');

        // 尝试多种选择器
        const selectors = [
            'video',                         // 标准视频标签
            '.video-container video',        // 从HTML结构分析得出的可能选择器
            '.video-box video',              // 另一个可能的选择器
            'vg-player video',               // Videogular
            'aa-videoplayer video',          // 自定义播放器
            '*[id*="player"] video',         // ID中包含player的元素内的视频
            '*[class*="player"] video',      // class中包含player的元素内的视频
            // 增加更多选择器用于慢加载网站
            '*[id*="video"] video',          // ID中包含video的元素
            '*[class*="video"] video',       // class中包含video的元素
            'iframe[src*="player"] video',   // iframe中的播放器视频
            'video[preload]',                // 预加载的视频
            '.container video',              // 常见容器内的视频
            'main video',                    // 主内容区域的视频
            'article video',                 // 文章内的视频
            'div > video',                   // div直接子元素的视频
            'video[src]',                    // 有src属性的视频
            'video > source',                // 有source子元素的视频
        ];

        let foundVideos = [];

        // 收集所有视频元素
        for (const selector of selectors) {
            const elements = document.querySelectorAll(selector);
            if (elements && elements.length > 0) {
                for (const video of elements) {
                    // 获取实际视频元素（可能是source的父元素）
                    const actualVideo = video.tagName.toLowerCase() === 'video' ? video : video.closest('video');
                    if (actualVideo && !foundVideos.includes(actualVideo) && isVideoPlayable(actualVideo)) {
                        foundVideos.push(actualVideo);
                        log(`找到可能的视频元素: ${selector}`);
                    }
                }
            }
        }

        // 如果找到多个视频，尝试找出主视频
        if (foundVideos.length > 1) {
            log(`找到${foundVideos.length}个视频元素，尝试确定主视频`);

            // 按照可能性排序：
            // 1. 可见的
            // 2. 更大的
            // 3. 位于视口中的
            foundVideos.sort((a, b) => {
                const aVisible = isElementVisible(a);
                const bVisible = isElementVisible(b);

                // 可见性优先
                if (aVisible && !bVisible) return -1;
                if (!aVisible && bVisible) return 1;

                // 然后是尺寸
                const aSize = (a.offsetWidth || 0) * (a.offsetHeight || 0);
                const bSize = (b.offsetWidth || 0) * (b.offsetHeight || 0);
                if (aSize > bSize) return -1;
                if (aSize < bSize) return 1;

                // 最后是视口中的位置
                const aInViewport = isInViewport(a);
                const bInViewport = isInViewport(b);
                if (aInViewport && !bInViewport) return -1;
                if (!aInViewport && bInViewport) return 1;

                return 0;
            });

            log(`选择最可能的主视频元素`);
            return foundVideos[0];
        } else if (foundVideos.length === 1) {
            return foundVideos[0];
        }

        // 尝试搜索所有iframe
        const iframes = document.querySelectorAll('iframe');
        for (let iframe of iframes) {
            try {
                if (iframe.contentDocument) {
                    const iframeVideo = iframe.contentDocument.querySelector('video');
                    if (iframeVideo && isVideoPlayable(iframeVideo)) {
                        log('在iframe中找到视频');
                        return iframeVideo;
                    }
                }
            } catch (e) {
                // 跨域iframe无法访问内容
                log('无法访问iframe内容: ' + e.message);
            }
        }

        // 深度搜索
        function deepSearch(element, depth = 0) {
            if (!element || depth > 15) return null; // 增加搜索深度

            if (element.tagName && element.tagName.toLowerCase() === 'video' && isVideoPlayable(element)) {
                return element;
            }

            // 搜索shadowDOM
            if (element.shadowRoot) {
                const shadowVideo = element.shadowRoot.querySelector('video');
                if (shadowVideo && isVideoPlayable(shadowVideo)) return shadowVideo;

                // 深度搜索shadowDOM
                const allShadowElements = element.shadowRoot.querySelectorAll('*');
                for (const shadowEl of allShadowElements) {
                    const found = deepSearch(shadowEl, depth + 1);
                    if (found) return found;
                }
            }

            for (let i = 0; i < element.children.length; i++) {
                const found = deepSearch(element.children[i], depth + 1);
                if (found) return found;
            }

            return null;
        }

        const deepSearchResult = deepSearch(document.body);
        if (deepSearchResult) {
            log('通过深度搜索找到视频');
            return deepSearchResult;
        }

        // 最后尝试通过动态加载的iframe查找
        // 某些网站可能延迟加载包含视频的iframe
        try {
            // 查找所有iframe，包括新加载的
            const allIframes = document.querySelectorAll('iframe');
            for (const iframe of allIframes) {
                try {
                    // 尝试判断iframe是否是视频播放器
                    const isVideoFrame = iframe.src.includes('player') ||
                                       iframe.src.includes('video') ||
                                       iframe.src.includes('embed') ||
                                       iframe.id.includes('player') ||
                                       iframe.className.includes('player');

                    if (isVideoFrame) {
                        log('找到可能包含视频的iframe，但无法直接访问内容');
                        // 不能直接返回iframe，但可以记录它存在
                        // 一些网站可能需要特殊处理
                    }
                } catch (e) {
                    // 忽略跨域错误
                }
            }
        } catch (e) {
            log(`检查iframe时出错: ${e.message}`);
        }

        log('未找到视频元素');
        return null;
    }

    // 检查元素是否可见
    function isElementVisible(element) {
        if (!element) return false;

        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               style.opacity !== '0' &&
               element.offsetWidth > 0 &&
               element.offsetHeight > 0;
    }

    // 检查元素是否在视口中
    function isInViewport(element) {
        if (!element) return false;

        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // 获取最后使用的速度
    function getLastSpeed() {
        try {
            const savedSpeed = parseFloat(localStorage.getItem(storageKey));
            if (!isNaN(savedSpeed) && savedSpeed > 0) {
                log(`从localStorage加载速度: ${savedSpeed}x`);
                return savedSpeed;
            }
        } catch (e) {
            log(`无法读取保存的速度: ${e.message}`);
        }
        log(`未找到保存的速度，使用默认速度 ${config.defaultSpeed}x`);
        return config.defaultSpeed;
    }

    // 保存最后使用的速度
    function saveLastSpeed(speed) {
        lastStoredSpeed = speed;
        try {
            localStorage.setItem(storageKey, speed);
            log(`已保存播放速度 ${speed}x 到localStorage`);
        } catch (e) {
            log(`无法保存速度: ${e.message}`);
        }
    }

    // 尝试多种方法设置播放速度 - 添加承诺等待功能
    function setPlaybackSpeed(speed, showNotifFlag = true) {
        // 确保速度在范围内
        speed = Math.max(config.minSpeed, Math.min(config.maxSpeed, speed));
        speed = parseFloat(speed.toFixed(1)); // 保留一位小数

        // 如果已经有等待设置的承诺，则取消它
        if (pendingSpeedPromise) {
            clearTimeout(pendingSpeedPromise);
            pendingSpeedPromise = null;
        }

        // 查找视频元素
        const video = findVideoElement();
        if (video) {
            try {
                video.playbackRate = speed;
                log(`使用标准方式设置速度: ${speed}x`);
                if (showNotifFlag) {
                    showNotification(`播放速度: ${speed}x`);
                }
                saveLastSpeed(speed);
                return true;
            } catch (e) {
                log(`标准方式设置速度失败: ${e.message}`);
            }
        } else {
            // 如果没找到视频但脚本已运行一段时间，设置一个延迟尝试
            log(`未找到视频元素，设置延迟尝试设置速度: ${speed}x`);
            waitingForVideo = true;
            pendingSpeedPromise = setTimeout(() => {
                log(`执行延迟设置速度: ${speed}x`);
                setPlaybackSpeed(speed, showNotifFlag);
                pendingSpeedPromise = null;
            }, 5000);

            // 返回false表示当前未成功设置
            return false;
        }

        // 尝试使用JavaScript注入
        try {
            const script = document.createElement('script');
            script.textContent = `
                (function() {
                    try {
                        const videos = document.querySelectorAll('video');
                        let success = false;
                        if (videos.length > 0) {
                            videos.forEach(v => {
                                try {
                                    // 检查视频是否有效
                                    if (v && !v.ended && v.readyState > 0) {
                                        v.playbackRate = ${speed};
                                        success = true;
                                    }
                                } catch(e) {
                                    console.error('无法设置视频速度:', e);
                                }
                            });
                        }

                        // 尝试从全局变量中找到播放器
                        const playerVars = ['player', 'videoPlayer', 'vgPlayer', 'mediaPlayer', 'ytPlayer', 'videojs'];
                        for (const varName of playerVars) {
                            if (window[varName]) {
                                // 尝试不同的方法设置速度
                                try {
                                    if (typeof window[varName].setPlaybackRate === 'function') {
                                        window[varName].setPlaybackRate(${speed});
                                        success = true;
                                    } else if (window[varName].player && typeof window[varName].player.setPlaybackRate === 'function') {
                                        window[varName].player.setPlaybackRate(${speed});
                                        success = true;
                                    } else if (window[varName].getMedia && window[varName].getMedia()) {
                                        window[varName].getMedia().playbackRate = ${speed};
                                        success = true;
                                    } else if (window[varName].video && window[varName].video.playbackRate !== undefined) {
                                        window[varName].video.playbackRate = ${speed};
                                        success = true;
                                    } else if (window[varName].el && window[varName].el.playbackRate !== undefined) {
                                        window[varName].el.playbackRate = ${speed};
                                        success = true;
                                    }
                                } catch(e) {
                                    console.error('尝试通过全局变量设置速度失败:', e);
                                }
                            }
                        }

                        // 尝试在Angular组件中查找
                        if (window.ng && window.ng.probe) {
                            const playerElements = document.querySelectorAll('vg-player, [class*="player"]');
                            playerElements.forEach(el => {
                                try {
                                    const componentInstance = window.ng.probe(el);
                                    if (componentInstance && componentInstance.componentInstance) {
                                        const instance = componentInstance.componentInstance;
                                        if (instance.media && instance.media.playbackRate !== undefined) {
                                            instance.media.playbackRate = ${speed};
                                            success = true;
                                        }
                                    }
                                } catch(e) {}
                            });
                        }

                        // 尝试特定网站API
                        // YouTube
                        if (typeof document.querySelector('.html5-video-player') !== 'undefined') {
                            const ytPlayer = document.querySelector('.html5-video-player');
                            if (ytPlayer && ytPlayer.getPlayer) {
                                try {
                                    ytPlayer.getPlayer().setPlaybackRate(${speed});
                                    success = true;
                                } catch(e) {}
                            }
                        }

                        // HTML5 video API - 再次尝试
                        document.querySelectorAll('video').forEach(v => {
                            if (v && v.readyState > 0) {
                                try {
                                    v.playbackRate = ${speed};
                                    success = true;
                                } catch(e) {}
                            }
                        });

                        window._speedChangeSuccess = success;
                    } catch(e) {
                        console.error('播放速度注入脚本错误:', e);
                        window._speedChangeSuccess = false;
                    }
                })();
            `;
            document.body.appendChild(script);
            document.body.removeChild(script);

            // 检查是否成功
            if (window._speedChangeSuccess) {
                log(`通过脚本注入设置速度: ${speed}x`);
                if (showNotifFlag) {
                    showNotification(`播放速度: ${speed}x`);
                }
                saveLastSpeed(speed);
                return true;
            }
        } catch (e) {
            log(`脚本注入设置失败: ${e.message}`);
        }

        if (showNotifFlag) {
            log('无法设置播放速度，将在视频加载后重试', true);
            showNotification(`已保存速度设置，等待视频加载...`);

            // 保存要设置的速度，以便在视频加载后应用
            saveLastSpeed(speed);
        }
        return false;
    }

    // 修改播放速度
    function changeSpeed(delta) {
        const video = findVideoElement();
        const currentSpeed = video ? video.playbackRate : lastStoredSpeed;
        const newSpeed = Math.round((currentSpeed + delta) * 10) / 10; // 保留一位小数
        if (setPlaybackSpeed(newSpeed)) {
            lastStoredSpeed = newSpeed; // 确保当前调整的速度被记录为"最后一次速度"
        } else {
            // 如果设置失败但视频尚未加载，仍保存速度以便之后应用
            lastStoredSpeed = newSpeed;
            saveLastSpeed(newSpeed);
        }
    }

    // 播放速度控制相关函数
    function resetSpeed() {
        setPlaybackSpeed(config.defaultSpeed);
    }

    function doubleSpeed() {
        setPlaybackSpeed(2.0);
    }

    // 改进版：只处理特定按键的冲突而不是禁用所有键盘事件
    function handleConflictingKeyBindings() {
        // 创建包含我们需要拦截的按键数组
        const ourHotkeys = Object.values(config.hotkeys);
        log(`我们的热键: ${ourHotkeys.join(', ')}`);

        // 替代注入脚本，只阻止特定按键的事件
        const script = document.createElement('script');
        script.textContent = `
            (function() {
                try {
                    // 获取我们需要处理的快捷键
                    const keysToCatch = ${JSON.stringify(ourHotkeys)};

                    // 创建更精确的事件监听器，在捕获阶段先拦截
                    document.addEventListener('keydown', function(event) {
                        // 只拦截我们关心的按键，且不在输入框中
                        if (keysToCatch.includes(event.key) &&
                            event.target.tagName !== 'INPUT' &&
                            event.target.tagName !== 'TEXTAREA') {
                            // 标记这个事件已被我们的脚本处理
                            event._handledBySpeedController = true;
                        }
                    }, true);

                    // 如果网站使用特定库，修改它们的行为而不是完全禁用

                    // 处理keyboardJS库
                    if (window.keyboardJS && typeof window.keyboardJS.bind === 'function') {
                        const originalBind = window.keyboardJS.bind;
                        window.keyboardJS.bind = function(key, pressHandler, releaseHandler) {
                            // 如果绑定的是我们使用的键，则包装其处理程序
                            if (keysToCatch.includes(key)) {
                                const wrappedPressHandler = function(e) {
                                    if (e._handledBySpeedController) return;
                                    if (pressHandler) pressHandler(e);
                                };
                                const wrappedReleaseHandler = function(e) {
                                    if (e._handledBySpeedController) return;
                                    if (releaseHandler) releaseHandler(e);
                                };
                                return originalBind.call(this, key, wrappedPressHandler, wrappedReleaseHandler);
                            }
                            // 其他键正常绑定
                            return originalBind.apply(this, arguments);
                        };
                        console.log('已修改keyboardJS.bind以处理冲突键');
                    }

                    // 处理Mousetrap库
                    if (window.Mousetrap && typeof window.Mousetrap.bind === 'function') {
                        const originalBind = window.Mousetrap.prototype.bind;
                        window.Mousetrap.prototype.bind = function(keys, callback, action) {
                            // 检查单个键或键数组
                            const keysArray = Array.isArray(keys) ? keys : [keys];
                            const hasConflict = keysArray.some(k => keysToCatch.includes(k));

                            if (hasConflict) {
                                // 包装回调函数
                                const wrappedCallback = function(e, combo) {
                                    if (e._handledBySpeedController) return;
                                    if (callback) return callback(e, combo);
                                };
                                return originalBind.call(this, keys, wrappedCallback, action);
                            }
                            // 其他键正常绑定
                            return originalBind.apply(this, arguments);
                        };
                        console.log('已修改Mousetrap.bind以处理冲突键');
                    }

                    console.log('成功设置冲突按键处理');
                } catch(e) {
                    console.error('设置按键冲突处理失败:', e);
                }
            })();
        `;
        document.body.appendChild(script);
        document.body.removeChild(script);

        log('已设置按键冲突处理');
    }

    // 键盘事件处理，使用捕获阶段以确保我们的处理器先运行
    function handleKeyPress(event) {
        // 忽略在输入框中的按键事件
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const key = event.key;

        // 检查是否匹配我们的快捷键
        let handled = false;
        switch (key) {
            case config.hotkeys.increaseSpeed:
                changeSpeed(config.speedStep);
                handled = true;
                break;
            case config.hotkeys.decreaseSpeed:
                changeSpeed(-config.speedStep);
                handled = true;
                break;
            case config.hotkeys.resetSpeed:
                resetSpeed();
                handled = true;
                break;
            case config.hotkeys.doubleSpeed:
                doubleSpeed();
                handled = true;
                break;
        }

        if (handled) {
            // 如果处理了快捷键，阻止事件冒泡和默认行为
            event.stopPropagation();
            event.preventDefault();
        }
    }

    // 处理URL变化的函数 - 增强检测
    function handleUrlChange() {
        const newUrl = location.href;
        if (newUrl !== currentVideoUrl) {
            log(`检测到URL变化，从 ${currentVideoUrl} 到 ${newUrl}`);
            currentVideoUrl = newUrl;

            // URL变化时重置视频元素和状态
            videoElement = null;
            speedApplied = false;

            // 重置视频记录时间
            videoFoundTime = null;

            // 重新查找视频元素，使用渐进式延迟
            const delays = [500, 1000, 2000, 3000, 5000, 8000, 13000];

            delays.forEach((delay, index) => {
                setTimeout(() => {
                    if (!videoElement) {
                        log(`URL变更后第${index + 1}次查找视频 (延迟${delay}ms)`);
                        videoElement = findVideoElement();
                        if (videoElement) {
                            log('URL变化后找到视频元素');
                            applyInitialSpeed();
                        }
                    }
                }, delay);
            });
        }
    }

    // 设置MutationObserver监视DOM变化
    function setupVideoObserver() {
        if (videoObserver) {
            videoObserver.disconnect();
        }

        videoObserver = new MutationObserver((mutations) => {
            // 如果还没找到视频元素，继续尝试
            if (!videoElement) {
                videoElement = findVideoElement();

                if (videoElement) {
                    log('MutationObserver找到视频元素');
                    speedApplied = false;
                    applyInitialSpeed();
                }
            }

            // 检查是否有新的视频加载（例如切换到新一集）
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeName === 'VIDEO' ||
                            (node.nodeType === Node.ELEMENT_NODE && node.querySelector('video'))) {
                            const newVideo = node.nodeName === 'VIDEO' ? node : node.querySelector('video');
                            if (newVideo && newVideo !== videoElement && isVideoPlayable(newVideo)) {
                                log('检测到新的视频元素');
                                videoElement = newVideo;
                                speedApplied = false;
                                applyInitialSpeed();
                            }
                        }
                    }
                }
            }

            // 检查视频src变化，可能是同一个视频元素载入新内容
            if (videoElement && !speedApplied) {
                applyInitialSpeed();
            }
        });

        videoObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });

        log('已设置视频元素观察器');
    }

    // 改进版应用初始播放速度 - 减少自动干预但改进对慢加载视频的处理
    function applyInitialSpeed() {
        // 如果已经应用过速度，不重复应用
        if (speedApplied) {
            return;
        }

        if (videoElement) {
            // 记录找到视频的时间
            if (!videoFoundTime) {
                videoFoundTime = Date.now();
            }

            const speed = getLastSpeed();
            log(`准备应用上次使用的速度: ${speed}x`);

            // 首次应用速度，增加延迟等待视频完全加载
            setTimeout(() => {
                try {
                    // 检查视频readyState是否足够应用速度
                    if (videoElement.readyState >= 2) {
                        videoElement.playbackRate = speed;
                        log(`成功应用播放速度: ${speed}x (readyState=${videoElement.readyState})`);
                        showNotification(`应用播放速度: ${speed}x`);
                        speedApplied = true;

                        // 添加事件监听，但只在播放开始时检查一次，不持续监听
                        videoElement.addEventListener('play', function() {
                            // 只在播放开始时检查一次
                            if (videoElement.playbackRate !== speed) {
                                log(`检测到播放开始时速度不正确，重新应用: ${speed}x`);
                                videoElement.playbackRate = speed;
                            }
                        }, { once: true });

                        // 监听loadeddata事件确保在数据加载后应用速度
                        videoElement.addEventListener('loadeddata', function() {
                            if (videoElement.playbackRate !== speed) {
                                log(`检测到视频数据加载后速度不正确，重新应用: ${speed}x`);
                                videoElement.playbackRate = speed;
                            }
                        }, { once: true });
                    } else {
                        // 视频尚未准备好，设置重试
                        log(`视频元素readyState不足 (${videoElement.readyState})，设置重试`);

                        // 使用条件触发的事件监听器
                        const eventTypes = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'];

                        // 为每个事件类型添加一次性监听器
                        eventTypes.forEach(eventType => {
                            videoElement.addEventListener(eventType, function() {
                                if (!speedApplied && videoElement.readyState >= 2) {
                                    log(`在 ${eventType} 事件后应用速度 ${speed}x`);
                                    try {
                                        videoElement.playbackRate = speed;
                                        showNotification(`应用播放速度: ${speed}x`);
                                        speedApplied = true;
                                    } catch (e) {
                                        log(`在 ${eventType} 事件后设置速度失败: ${e.message}`);
                                    }
                                }
                            }, { once: true });
                        });

                        // 添加备用延迟尝试，以防事件未触发
                        setTimeout(() => {
                            if (!speedApplied) {
                                log('使用备用延迟尝试应用速度');
                                try {
                                    videoElement.playbackRate = speed;
                                    log(`延迟备用设置成功 (readyState=${videoElement.readyState})`);
                                    showNotification(`应用播放速度: ${speed}x`);
                                    speedApplied = true;
                                } catch (e) {
                                    log(`延迟备用设置失败: ${e.message}`);
                                }
                            }
                        }, 4000);
                    }
                } catch (e) {
                    log(`应用播放速度失败: ${e.message}`);

                    // 设置递增延迟的备用尝试
                    const retryDelays = [2000, 4000, 8000];

                    retryDelays.forEach((delay, index) => {
                        setTimeout(() => {
                            if (!speedApplied) {
                                try {
                                    log(`第${index + 1}次重试应用速度 ${speed}x`);
                                    videoElement.playbackRate = speed;
                                    log(`重试成功`);
                                    showNotification(`应用播放速度: ${speed}x`);
                                    speedApplied = true;
                                } catch (err) {
                                    log(`第${index + 1}次重试失败: ${err.message}`);
                                }
                            }
                        }, delay);
                    });
                }
            }, 1000); // 给视频更多时间加载
        } else if (waitingForVideo) {
            // 如果在等待视频但没有找到，不执行额外操作
            log('等待视频元素出现...');
        } else {
            // 启动长期监控以处理非常慢的视频加载
            startLongTermMonitoring();
        }
    }

    // 启动长期监控以处理特别慢的视频加载
    function startLongTermMonitoring() {
        if (longTermMonitoringTimer) {
            clearInterval(longTermMonitoringTimer);
        }

        log('启动长期监控以等待视频加载');
        let monitoringStartTime = Date.now();

        longTermMonitoringTimer = setInterval(() => {
            const elapsedTime = Date.now() - monitoringStartTime;

            // 如果监控时间过长，停止监控
            if (elapsedTime > config.longTermMonitoring) {
                log('长期监控超时，停止监控');
                clearInterval(longTermMonitoringTimer);
                return;
            }

            // 如果已经找到视频并应用了速度，停止监控
            if (videoElement && speedApplied) {
                log('视频已找到并应用了速度，停止长期监控');
                clearInterval(longTermMonitoringTimer);
                return;
            }

            // 如果找到了视频但还没应用速度
            if (videoElement && !speedApplied) {
                log('发现视频尚未应用速度，尝试应用');
                applyInitialSpeed();
                return;
            }

            // 尝试再次查找视频
            log(`长期监控：第${Math.floor(elapsedTime / config.longTermCheckInterval)}次尝试查找视频`);
            videoElement = findVideoElement();
            if (videoElement) {
                log('长期监控找到视频元素');
                applyInitialSpeed();
            }
        }, config.longTermCheckInterval);
    }

    // 主初始化函数
    function initialize() {
        log('初始化中...');

        // 加载保存的速度
        lastStoredSpeed = getLastSpeed();
        log(`初始化时加载速度: ${lastStoredSpeed}x`);

        // 添加样式
        addStyles();

        // 创建通知元素
        createNotification();

        // 处理冲突按键而不是禁用所有键盘事件
        handleConflictingKeyBindings();

        // 监听键盘事件 - 使用捕获阶段以确保我们的处理器先运行
        document.addEventListener('keydown', handleKeyPress, true);

        // 监听URL变化
        if (window.history && window.history.pushState) {
            // 监听popstate事件
            window.addEventListener('popstate', handleUrlChange);

            // 重写history方法以捕获SPA页面变化
            const originalPushState = window.history.pushState;
            window.history.pushState = function() {
                originalPushState.apply(this, arguments);
                handleUrlChange();
            };

            const originalReplaceState = window.history.replaceState;
            window.history.replaceState = function() {
                originalReplaceState.apply(this, arguments);
                handleUrlChange();
            };
        }

        // 定期检查URL变化（用于不触发history事件的变化）
        setInterval(handleUrlChange, 4000);

        // 设置视频观察器
        setupVideoObserver();

        // 延迟查找视频以处理慢加载
        log(`等待${config.initialWaitTime / 1000}秒后开始查找视频...`);
        setTimeout(() => {
            // 立即尝试查找视频
            videoElement = findVideoElement();
            if (videoElement) {
                log('初始化时找到视频元素');
                applyInitialSpeed();
                return;
            }

            // 如果没有立即找到，定期尝试
            log('未立即找到视频，启动定期查找');
            let findVideoInterval = setInterval(() => {
                retryCount++;

                videoElement = findVideoElement();
                if (videoElement) {
                    log(`在第${retryCount}次尝试时找到视频元素`);
                    clearInterval(findVideoInterval);
                    applyInitialSpeed();
                    return;
                }

                if (retryCount >= config.maxRetries) {
                    log('达到最大尝试次数，仍未找到视频元素');
                    clearInterval(findVideoInterval);

                    // 最后尝试一次并启动长期监控
                    setTimeout(() => {
                        videoElement = findVideoElement();
                        if (videoElement) {
                            log('最后一次常规尝试找到视频元素');
                            applyInitialSpeed();
                        } else {
                            log('常规查找未找到视频，切换到长期监控');
                            startLongTermMonitoring();
                        }
                    }, 10000);
                }
            }, config.retryInterval);
        }, config.initialWaitTime);

        // 显示通知脚本已加载
        showNotification('视频倍速控制已加载 [慢视频优化版]');
    }

    // 等待页面加载完成并初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1000));
    } else {
        setTimeout(initialize, 1000); // 给页面更多时间加载JS
    }
})();