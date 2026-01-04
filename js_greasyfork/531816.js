// ==UserScript==
// @name         巴哈姆特动画广告跳过助手
// @namespace    https://greasyfork.org/zh-CN/scripts/531816
// @version      0.6
// @description  自动点击年龄确认和跳过广告按钮，暂停时隐藏界面元素以便截屏，鼠标悬停进度条区域显示控制器
// @author       YourName
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531816/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/531816/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%E5%8A%A8%E7%94%BB%E5%B9%BF%E5%91%8A%E8%B7%B3%E8%BF%87%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 处理年龄确认按钮
    function clickAdultConfirm() {
        const adultBtn = document.getElementById('adult');
        if (adultBtn) {
            console.log('找到年龄确认按钮，自动点击');
            adultBtn.click();
            setTimeout(monitorSkipButton, 1000);
        } else {
            setTimeout(clickAdultConfirm, 500);
        }
    }

    // 2. 监控跳过广告按钮
    function monitorSkipButton() {
        const skipButton = document.getElementById('adSkipButton');
        if (!skipButton) {
            setTimeout(monitorSkipButton, 500);
            return;
        }

        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'class') {
                    const currentClass = skipButton.getAttribute('class');
                    if (currentClass.includes('enable')) {
                        console.log('检测到可跳过的广告按钮，自动点击');
                        skipButton.click();
                        observer.disconnect();
                    }
                }
            });
        });

        const config = { attributes: true, attributeFilter: ['class'] };
        observer.observe(skipButton, config);

        if (skipButton.classList.contains('enable')) {
            console.log('初始检查发现可跳过的广告按钮，自动点击');
            skipButton.click();
            observer.disconnect();
        }
    }

    // 3. 监控页面变化以捕获动态加载的年龄确认界面
    function observePage() {
        const observer = new MutationObserver(function(mutations) {
            const adultBtn = document.getElementById('adult');
            if (adultBtn) {
                console.log('动态检测到年龄确认按钮，触发点击');
                clickAdultConfirm();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 4. 暂停时隐藏界面元素，播放时恢复，鼠标悬停进度条区域显示控制器
    function setupPauseHide() {
        const video = document.querySelector('video');
        if (!video) {
            setTimeout(setupPauseHide, 500);
            return;
        }

        // 目标元素
        const elementsToHide = [
            '.vjs-big-play-button', // 右下角播放按钮
            '.top-tool-bar',        // 顶部阴影工具栏
            '.control-bar-mask'     // 底部阴影遮罩
        ];
        const controlBarSelector = '.vjs-control-bar'; // 底部控制条（进度条等）

        // 保存原始 display 状态
        const originalDisplay = new Map();

        // 隐藏元素（不包括控制条）
        function hideElements() {
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    if (!originalDisplay.has(selector)) {
                        originalDisplay.set(selector, element.style.display || 'block');
                    }
                    element.style.display = 'none';
                    console.log(`隐藏元素: ${selector}`);
                }
            });
        }

        // 隐藏控制条
        function hideControlBar() {
            const controlBar = document.querySelector(controlBarSelector);
            if (controlBar) {
                if (!originalDisplay.has(controlBarSelector)) {
                    originalDisplay.set(controlBarSelector, controlBar.style.display || 'block');
                }
                controlBar.style.display = 'none';
                console.log(`隐藏控制条: ${controlBarSelector}`);
            }
        }

        // 显示控制条
        function showControlBar() {
            const controlBar = document.querySelector(controlBarSelector);
            if (controlBar) {
                controlBar.style.display = originalDisplay.get(controlBarSelector) || 'block';
                console.log(`显示控制条: ${controlBarSelector}`);
            }
        }

        // 恢复所有元素
        function showElements() {
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    element.style.display = originalDisplay.get(selector) || 'block';
                    console.log(`恢复元素: ${selector}`);
                }
            });
            showControlBar(); // 确保控制条也恢复
        }

        // 暂停时隐藏元素的逻辑
        function onPause() {
            hideElements();
            hideControlBar();
            setupControlBarHover(); // 设置鼠标悬停逻辑
        }

        // 设置鼠标悬停显示控制条
        function setupControlBarHover() {
            const videoContainer = document.querySelector('.vjs-control-bar')?.parentElement || document.querySelector('video').parentElement;
            if (!videoContainer) {
                console.log('未找到视频容器，重试');
                setTimeout(setupControlBarHover, 500);
                return;
            }

            // 鼠标进入时显示控制条
            videoContainer.addEventListener('mouseenter', function handler(e) {
                if (video.paused) {
                    showControlBar();
                }
            });

            // 鼠标离开时隐藏控制条
            videoContainer.addEventListener('mouseleave', function handler(e) {
                if (video.paused) {
                    hideControlBar();
                }
            });
        }

        // 监听视频暂停和播放事件
        video.addEventListener('pause', onPause);
        video.addEventListener('play', showElements);

        // 初始检查：如果视频已经暂停
        if (video.paused) {
            onPause();
        }
    }

    // 页面加载后执行
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(clickAdultConfirm, 1000);
        observePage();
        setTimeout(setupPauseHide, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', function() {
            setTimeout(clickAdultConfirm, 1000);
            observePage();
            setTimeout(setupPauseHide, 1000);
        });
    }
})();