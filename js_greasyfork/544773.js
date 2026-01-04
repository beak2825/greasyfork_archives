// ==UserScript==
// @name         滑动时暂停所有动画与视频（保留音频）- 增强版
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  页面滑动时暂停多种动画和视频资源，松手后恢复，仅保留音频播放，并增强了对GIF和Three.js的支持。
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544773/%E6%BB%91%E5%8A%A8%E6%97%B6%E6%9A%82%E5%81%9C%E6%89%80%E6%9C%89%E5%8A%A8%E7%94%BB%E4%B8%8E%E8%A7%86%E9%A2%91%EF%BC%88%E4%BF%9D%E7%95%99%E9%9F%B3%E9%A2%91%EF%BC%89-%20%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544773/%E6%BB%91%E5%8A%A8%E6%97%B6%E6%9A%82%E5%81%9C%E6%89%80%E6%9C%89%E5%8A%A8%E7%94%BB%E4%B8%8E%E8%A7%86%E9%A2%91%EF%BC%88%E4%BF%9D%E7%95%99%E9%9F%B3%E9%A2%91%EF%BC%89-%20%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 配置项 ====================
    // 是否在滑动时暂停音频 (默认为 false，因为原需求是保留音频)
    // 如果你想在滑动时也暂停音频，请将此项设置为 true。
    const PAUSE_AUDIO_ON_SCROLL = false;

    // ==================== 状态存储 ====================
    const animationStates = new Map(); // 存储CSS动画、SVG动画、Web Animations API等的状态
    const videoStates = new Map();     // 存储视频播放状态
    const audioStates = new Map();     // 存储音频播放状态
    const gifStates = new Map();       // 存储GIF原始src和display状态

    // 用于劫持和取消JavaScript定时器和requestAnimationFrame
    let rafIds = [];
    let intervalIds = [];
    let timeoutIds = [];

    // Web Worker状态 (注意：Web Worker的恢复通常需要页面重新初始化，这里只是记录并终止)
    const workerStates = new Map();

    // ==================== 工具函数 ====================

    // 节流函数，优化滚动事件
    function throttle(fn, wait) {
        let lastCall = 0;
        let timeoutId = null;
        return function (...args) {
            const now = performance.now();
            const remaining = wait - (now - lastCall);

            if (remaining <= 0 || remaining > wait) {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                    timeoutId = null;
                }
                lastCall = now;
                fn.apply(this, args);
            } else if (!timeoutId) {
                timeoutId = setTimeout(() => {
                    lastCall = performance.now();
                    timeoutId = null;
                    fn.apply(this, args);
                }, remaining);
            }
        };
    }

    // 透明1x1像素的Base64图片，用于替换GIF的src
    const TRANSPARENT_PIXEL_GIF = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    // ==================== 动画暂停/恢复函数 ====================

    // 暂停CSS动画
    function pauseCSSAnimations() {
        const elements = document.querySelectorAll('[style*="animation"]');
        elements.forEach((element) => {
            const computedStyle = getComputedStyle(element);
            if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState !== 'paused') {
                animationStates.set(element, element.style.animationPlayState || 'running');
                element.style.animationPlayState = 'paused';
            }
        });
    }

    // 暂停CSS过渡
    function pauseCSSTransitions() {
        const elements = document.querySelectorAll('[style*="transition"]');
        elements.forEach((element) => {
            const computedStyle = getComputedStyle(element);
            // 检查是否有实际的过渡属性，避免不必要的存储和操作
            if (computedStyle.transitionProperty && computedStyle.transitionProperty !== 'none') {
                 // 存储完整的 transition 属性值，以便精确恢复
                animationStates.set(element, element.style.transition || computedStyle.transition);
                element.style.transition = 'none'; // 移除过渡效果
            }
        });
    }

    // 暂停CSS背景动画（关键帧驱动的背景）
    function pauseCSSBackgroundAnimations() {
        const elements = document.querySelectorAll('[style*="background"]');
        elements.forEach((element) => {
            const computedStyle = getComputedStyle(element);
            // 检查是否有动画名且背景包含渐变或图片，这通常是背景动画的迹象
            if (computedStyle.animationName !== 'none' && computedStyle.animationPlayState !== 'paused' &&
                (computedStyle.background.includes('gradient') || computedStyle.background.includes('url('))) {
                animationStates.set(element, element.style.animationPlayState || 'running');
                element.style.animationPlayState = 'paused';
            }
        });
    }

    // 恢复CSS动画、过渡和背景动画
    function resumeCSSAnimations() {
        animationStates.forEach((state, element) => {
            // 根据存储的状态类型进行恢复
            if (typeof state === 'string') { // 可能是animationPlayState或transition属性
                if (state.includes('paused') || state.includes('running')) { // animationPlayState
                    element.style.animationPlayState = state;
                } else { // transition属性
                    element.style.transition = state;
                }
            }
        });
        animationStates.clear();
    }

    // 暂停JavaScript动画 (劫持 requestAnimationFrame, setInterval, setTimeout)
    function pauseJavaScriptAnimations() {
        // 确保只劫持一次
        if (!window.__originalRAF) {
            window.__originalRAF = window.requestAnimationFrame;
            window.requestAnimationFrame = function (callback) {
                // 不执行callback，只记录ID，以便后续取消
                const id = window.__originalRAF(() => { /* do nothing */ }); // 提交一个空帧，获取ID
                rafIds.push(id);
                return id;
            };
        }

        if (!window.__originalSetInterval) {
            window.__originalSetInterval = window.setInterval;
            window.setInterval = function (callback, delay) {
                const id = window.__originalSetInterval(() => { /* do nothing */ }, delay);
                intervalIds.push(id);
                return id;
            };
        }

        if (!window.__originalSetTimeout) {
            window.__originalSetTimeout = window.setTimeout;
            window.setTimeout = function (callback, delay) {
                const id = window.__originalSetTimeout(() => { /* do nothing */ }, delay);
                timeoutIds.push(id);
                return id;
            };
        }

        // 取消所有已知的动画帧和定时器
        rafIds.forEach((id) => window.__originalRAF(id)); // cancelAnimationFrame
        intervalIds.forEach((id) => window.__originalSetInterval(id)); // clearInterval
        timeoutIds.forEach((id) => window.__originalSetTimeout(id)); // clearTimeout

        rafIds = [];
        intervalIds = [];
        timeoutIds = [];
    }

    // 恢复JavaScript动画
    function resumeJavaScriptAnimations() {
        // 恢复原始函数
        if (window.__originalRAF) {
            window.requestAnimationFrame = window.__originalRAF;
            delete window.__originalRAF;
        }
        if (window.__originalSetInterval) {
            window.setInterval = window.__originalSetInterval;
            delete window.__originalSetInterval;
        }
        if (window.__originalSetTimeout) {
            window.setTimeout = window.__originalSetTimeout;
            delete window.__originalSetTimeout;
        }
        // 注意：此方法只能确保新的requestAnimationFrame/setInterval/setTimeout调用生效。
        // 之前被取消的动画（如果它们没有在页面逻辑中重新启动）不会自动恢复。
        // 页面通常需要自行重新触发这些动画。
    }

    // 暂停视频（保留音频）
    function pauseVideos() {
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {
            if (!video.paused) {
                videoStates.set(video, true); // 记录视频原本在播放
                video.pause();
                video.muted = false; // 确保音频继续播放，符合用户需求
            } else {
                videoStates.set(video, false); // 记录视频原本就暂停
            }
        }
    }

    // 恢复视频
    function resumeVideos() {
        videoStates.forEach((wasPlaying, video) => {
            if (wasPlaying && video.paused) {
                // 尝试播放视频，捕获可能的用户手势限制错误
                video.play().catch((err) => {
                    if (err.name === 'NotAllowedError') {
                        console.warn('Video resume failed: Autoplay was prevented by browser policies. User interaction may be required.', video);
                    } else {
                        console.warn('Video resume failed:', err, video);
                    }
                });
            }
        });
        videoStates.clear();
    }

    // 暂停音频 (可选功能，默认关闭)
    function pauseAudios() {
        if (!PAUSE_AUDIO_ON_SCROLL) return; // 根据配置决定是否执行

        const audios = document.getElementsByTagName('audio');
        for (let audio of audios) {
            if (!audio.paused) {
                audioStates.set(audio, true);
                audio.pause();
            } else {
                audioStates.set(audio, false);
            }
        }
    }

    // 恢复音频 (可选功能，默认关闭)
    function resumeAudios() {
        if (!PAUSE_AUDIO_ON_SCROLL) return; // 根据配置决定是否执行

        audioStates.forEach((wasPlaying, audio) => {
            if (wasPlaying && audio.paused) {
                audio.play().catch((err) => {
                    if (err.name === 'NotAllowedError') {
                        console.warn('Audio resume failed: Autoplay was prevented by browser policies. User interaction may be required.', audio);
                    } else {
                        console.warn('Audio resume failed:', err, audio);
                    }
                });
            }
        });
        audioStates.clear();
    }

    // 暂停Canvas动画（2D/WebGL）
    function pauseCanvasAnimations() {
        const canvases = document.getElementsByTagName('canvas');
        for (let canvas of canvases) {
            // 检查是否有requestAnimationFrame ID存储在dataset中
            if (canvas.dataset.rafId) {
                window.cancelAnimationFrame(parseInt(canvas.dataset.rafId));
                // 清除ID，避免重复取消
                delete canvas.dataset.rafId;
            }
            // 对于Three.js等库，其动画循环可能不直接绑定到canvas的dataset上
            // 这部分逻辑已移至 pauseThirdPartyAnimations
        }
    }

    // 恢复Canvas动画 (通常需要页面重新启动其渲染循环，这里不做自动恢复)
    function resumeCanvasAnimations() {
        // Canvas动画的恢复通常依赖于页面本身的渲染循环逻辑。
        // 脚本无法自动“重启”被取消的requestAnimationFrame循环，除非页面重新发起。
        // 因此，这里无需特殊恢复逻辑。
    }

    // 暂停SVG动画
    function pauseSVGAAnimations() {
        // 查找所有SMIL动画元素
        const svgElements = document.querySelectorAll('svg animate, svg animateMotion, svg animateTransform, svg set');
        svgElements.forEach((element) => {
            // 检查元素是否正在播放
            if (element.beginElement && element.pauseElement && !element.classList.contains('__paused_by_script')) {
                try {
                    element.pauseElement(); // 尝试暂停SMIL动画
                    animationStates.set(element, true); // 记录为已暂停
                    element.classList.add('__paused_by_script'); // 添加一个标记类
                } catch (e) {
                    // 某些浏览器或SVG实现可能不支持pauseElement
                    console.warn('Failed to pause SVG animation:', element, e);
                }
            }
        });
    }

    // 恢复SVG动画
    function resumeSVGAAnimations() {
        animationStates.forEach((wasPlaying, element) => {
            if (element.tagName.toLowerCase().startsWith('animate') || element.tagName.toLowerCase() === 'set') {
                if (wasPlaying && element.beginElement && element.classList.contains('__paused_by_script')) {
                    try {
                        element.beginElement(); // 尝试恢复SMIL动画
                        element.classList.remove('__paused_by_script');
                    } catch (e) {
                        console.warn('Failed to resume SVG animation:', element, e);
                    }
                }
            }
        });
    }

    // 暂停Web Animations API (WAAPI)
    function pauseWebAnimations() {
        document.getAnimations().forEach((animation) => {
            if (animation.playState === 'running') {
                animationStates.set(animation, true); // 记录为正在运行
                animation.pause();
            } else {
                animationStates.set(animation, false); // 记录为非运行状态
            }
        });
    }

    // 恢复Web Animations API (WAAPI)
    function resumeWebAnimations() {
        animationStates.forEach((wasRunning, animation) => {
            if (wasRunning && animation.playState === 'paused') {
                animation.play();
            }
        });
    }

    // 暂停GIF动画（通过替换src为透明像素）
    function pauseGIFs() {
        // 查找所有以.gif或.apng结尾的图片
        const images = document.querySelectorAll('img[src$=".gif"], img[src$=".apng"]');
        images.forEach((img) => {
            if (!img.dataset.originalSrc) { // 避免重复处理
                img.dataset.originalSrc = img.src; // 存储原始src
                gifStates.set(img, {
                    src: img.src,
                    display: img.style.display || '' // 存储原始display状态
                });
                img.src = TRANSPARENT_PIXEL_GIF; // 替换为透明像素
                img.style.display = 'block'; // 确保替换后可见，但内容透明
            }
        });
    }

    // 恢复GIF动画
    function resumeGIFs() {
        gifStates.forEach((originalState, img) => {
            if (img.dataset.originalSrc) {
                img.src = originalState.src; // 恢复原始src
                img.style.display = originalState.display; // 恢复原始display状态
                delete img.dataset.originalSrc; // 清理标记
            }
        });
        gifStates.clear();
    }

    // 暂停Web Workers (注意：终止后无法恢复，需要页面重新创建)
    function pauseWebWorkers() {
        // 这是一个非常激进的暂停方式，因为terminate()会彻底销毁Worker。
        // 恢复通常需要页面重新创建并初始化Worker。
        // 如果页面将Worker实例存储在全局变量如 window.workers 中，可以尝试访问。
        if (window.workers && Array.isArray(window.workers)) {
            window.workers.forEach((worker, index) => {
                // 仅当Worker尚未被脚本终止时才处理
                if (!workerStates.has(worker)) {
                    workerStates.set(worker, { originalWorker: worker, index: index });
                    worker.terminate(); // 终止Worker
                    console.warn('Web Worker terminated. Resumption requires page-specific re-initialization.');
                }
            });
        }
        // 更复杂的方案可能包括劫持 new Worker() 构造函数，但超出了此脚本的通用性范围。
    }

    // 恢复Web Workers（需页面重新初始化）
    function resumeWebWorkers() {
        // 再次强调：Web Worker的恢复通常需要页面重新创建。
        // 此脚本无法自动重新创建和初始化已终止的Worker。
        // 这里的恢复函数主要用于清理状态，并提醒开发者。
        workerStates.clear();
    }

    // 暂停第三方库动画（如GSAP、Three.js）
    function pauseThirdPartyAnimations() {
        // GSAP (GreenSock Animation Platform)
        if (typeof window.gsap !== 'undefined' && window.gsap.globalTimeline) {
            if (window.gsap.globalTimeline.paused() === false) {
                animationStates.set('gsapGlobalTimeline', true); // 记录为未暂停
                window.gsap.globalTimeline.pause();
            } else {
                animationStates.set('gsapGlobalTimeline', false); // 记录为已暂停
            }
        }
        // Three.js (假设存在全局renderer或场景，且有动画循环)
        if (typeof window.THREE !== 'undefined' && window.threeRenderer) {
            // Three.js的动画循环通常通过 renderer.setAnimationLoop 实现
            if (window.threeRenderer.getAnimationLoop()) {
                animationStates.set('threejsAnimationLoop', window.threeRenderer.getAnimationLoop());
                window.threeRenderer.setAnimationLoop(null); // 停止动画循环
                console.warn('Three.js animation loop paused.');
            }
        }
        // 其他可能的库：例如 PixiJS, Babylon.js 等，需要类似地查找其主循环并暂停
    }

    // 恢复第三方库动画
    function resumeThirdPartyAnimations() {
        // GSAP
        if (typeof window.gsap !== 'undefined' && window.gsap.globalTimeline && animationStates.get('gsapGlobalTimeline')) {
            window.gsap.globalTimeline.play();
        }
        // Three.js
        if (typeof window.THREE !== 'undefined' && window.threeRenderer && animationStates.has('threejsAnimationLoop')) {
            const originalLoop = animationStates.get('threejsAnimationLoop');
            if (originalLoop) {
                window.threeRenderer.setAnimationLoop(originalLoop); // 恢复原始动画循环
                console.warn('Three.js animation loop resumed.');
            }
        }
    }

    // 暂停Iframe动画（简单隐藏）
    function pauseIframeAnimations() {
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            // 仅当iframe可见时才隐藏并记录状态
            if (iframe.style.display !== 'none') {
                animationStates.set(iframe, iframe.style.display || 'block');
                iframe.style.display = 'none';
            } else {
                animationStates.set(iframe, 'none'); // 记录原本就隐藏
            }
        }
    }

    // 恢复Iframe动画
    function resumeIframeAnimations() {
        animationStates.forEach((state, iframe) => {
            if (iframe.tagName.toLowerCase() === 'iframe') {
                if (state !== 'none') { // 仅恢复那些原本可见的iframe
                    iframe.style.display = state;
                }
            }
        });
    }

    // 监控动态DOM变化
    function observeDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length && isScrolling) {
                    // 当有新节点添加且当前正在滚动时，对新内容进行暂停处理
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查新增节点是否包含需要暂停的元素
                            // 这里可以优化为只对新增节点及其子节点进行检查，而不是全局重新查询
                            if (node.matches('video')) pauseVideos();
                            if (node.matches('canvas')) pauseCanvasAnimations();
                            if (node.matches('svg animate, svg animateTransform, svg animateMotion, svg set')) pauseSVGAAnimations();
                            if (node.matches('img[src$=".gif"], img[src$=".apng"]')) pauseGIFs();
                            if (node.matches('[style*="animation"], [style*="transition"]')) {
                                pauseCSSAnimations();
                                pauseCSSTransitions();
                                pauseCSSBackgroundAnimations();
                            }
                            if (node.matches('iframe')) pauseIframeAnimations();
                            if (node.matches('audio') && PAUSE_AUDIO_ON_SCROLL) pauseAudios();

                            // 深度遍历新增节点内部，查找子元素
                            node.querySelectorAll('video').forEach(pauseVideos);
                            node.querySelectorAll('canvas').forEach(pauseCanvasAnimations);
                            node.querySelectorAll('svg animate, svg animateTransform, svg animateMotion, svg set').forEach(pauseSVGAAnimations);
                            node.querySelectorAll('img[src$=".gif"], img[src$=".apng"]').forEach(pauseGIFs);
                            node.querySelectorAll('[style*="animation"], [style*="transition"]').forEach(el => {
                                // 避免重复调用全局暂停函数，只处理新增元素
                                if (el.matches('[style*="animation"]')) pauseCSSAnimations();
                                if (el.matches('[style*="transition"]')) pauseCSSTransitions();
                                if (el.matches('[style*="background"]')) pauseCSSBackgroundAnimations();
                            });
                            node.querySelectorAll('iframe').forEach(pauseIframeAnimations);
                            if (PAUSE_AUDIO_ON_SCROLL) node.querySelectorAll('audio').forEach(pauseAudios);
                        }
                    });
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // ==================== 滑动事件处理 ====================

    let isScrolling = false;
    let scrollEndTimeout = null;
    const SCROLL_END_DELAY = 200; // 滚动停止后多久算作“滑动结束”

    const scrollHandler = throttle(() => {
        if (!isScrolling) {
            isScrolling = true;
            console.log('Scrolling started - pausing animations.');
            // 执行所有暂停操作
            pauseCSSAnimations();
            pauseCSSTransitions();
            pauseCSSBackgroundAnimations();
            pauseJavaScriptAnimations();
            pauseVideos();
            if (PAUSE_AUDIO_ON_SCROLL) pauseAudios(); // 根据配置暂停音频
            pauseCanvasAnimations();
            pauseSVGAAnimations();
            pauseWebAnimations();
            pauseGIFs(); // 增强的GIF暂停
            pauseWebWorkers(); // 激进的Worker暂停
            pauseThirdPartyAnimations(); // 增强的第三方库暂停
            pauseIframeAnimations();
        }

        // 每次滚动事件发生时，重置滑动结束的定时器
        if (scrollEndTimeout) {
            clearTimeout(scrollEndTimeout);
        }
        scrollEndTimeout = setTimeout(handleScrollEnd, SCROLL_END_DELAY);
    }, 100); // 节流延迟

    // 滑动结束处理
    function handleScrollEnd() {
        if (isScrolling) {
            isScrolling = false;
            console.log('Scrolling ended - resuming animations.');
            // 执行所有恢复操作
            resumeCSSAnimations();
            resumeJavaScriptAnimations();
            resumeVideos();
            if (PAUSE_AUDIO_ON_SCROLL) resumeAudios(); // 根据配置恢复音频
            resumeCanvasAnimations(); // 实际不恢复，只清理状态
            resumeSVGAAnimations();
            resumeWebAnimations();
            resumeGIFs(); // 增强的GIF恢复
            resumeWebWorkers(); // 实际不恢复，只清理状态
            resumeThirdPartyAnimations(); // 增强的第三方库恢复
            resumeIframeAnimations();
        }
        if (scrollEndTimeout) {
            clearTimeout(scrollEndTimeout);
            scrollEndTimeout = null;
        }
    }

    // 监听滚动和交互事件
    document.addEventListener('scroll', scrollHandler, { passive: true }); // 使用passive: true优化滚动性能
    // 'scrollend' 事件支持度有限，因此我们用setTimeout模拟
    document.addEventListener('touchend', handleScrollEnd);
    document.addEventListener('mouseup', handleScrollEnd);

    // 初始化DOM监控
    observeDOM();

    // 清理事件监听器
    window.addEventListener('unload', () => {
        document.removeEventListener('scroll', scrollHandler);
        document.removeEventListener('touchend', handleScrollEnd);
        document.removeEventListener('mouseup', handleScrollEnd);
        if (scrollEndTimeout) {
            clearTimeout(scrollEndTimeout);
        }
    });

    console.log('滑动时暂停动画脚本已加载。');
})();

