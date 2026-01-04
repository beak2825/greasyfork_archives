// ==UserScript==
// @name         VIP视频解析助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  VIP视频解析工具,支持优酷、爱奇艺、腾讯视频等主流视频网站VIP视频免费观看
// @author       You
// @license      MIT
// @match        *://*.youku.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.v.qq.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.mgtv.com/*
// @match        *://*.le.com/*
// @match        *://*.pptv.com/*
// @match        *://*.1905.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/521806/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/521806/VIP%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析接口列表
    const jxApis = [
        { url: 'https://jx.xmflv.com/?url=' },
        { url: 'https://jx.pangujiexi.cc/player.php?url=' },
        { url: 'https://jx.bozrc.com:4433/player/?url=' },
        { url: 'https://jx.parwix.com:4433/player/analysis.php?v=' },
        { url: 'https://www.nxflv.com/?url=' },
        { url: 'https://okjx.cc/?url=' },
        { url: 'https://www.ckmov.vip/api.php?url=' },
        { url: 'https://www.h8jx.com/jiexi.php?url=' },
        { url: 'https://api.jiexi.la/?url=' },
        { url: 'https://jx.jiubojx.com/vip.php?url=' }
    ];

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .parse-button {
            position: fixed;
            top: 150px;
            left: 0;
            z-index: 9999999;
            background: #FF4D4F;
            color: white;
            padding: 8px 16px;
            cursor: pointer;
            border-radius: 0 4px 4px 0;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            transition: all 0.3s;
            display: flex;
            flex-direction: column;
            align-items: center;
            line-height: 1.5;
        }
        .parse-button:hover {
            background: #ff7875;
            transform: translateX(3px);
        }
        .parse-button span {
            display: block;
        }
        .parse-button .line1 {
            font-size: 14px;
        }
        .parse-button .line2 {
            font-size: 14px;
        }
        .verify-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 10000000;
            width: 300px;
            text-align: center;
        }
        .verify-mask {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0,0,0,0.7);
            z-index: 9999999;
        }
        .highlight-text {
            color: #FF4D4F;
            font-weight: bold;
            font-size: 15px;
            margin: 10px 0;
        }
        .verify-input {
            width: 200px;
            height: 32px;
            padding: 4px 11px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
            margin: 10px 0;
            outline: none;
            background: white;
            color: #333;
            z-index: 10000001;
            position: relative;
        }
        .verify-input:focus {
            border-color: #FF4D4F;
            box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
        }
        .toast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            z-index: 10000002;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s;
        }
    `;
    document.head.appendChild(style);

    // 显示提示消息
    function showToast(message, duration = 2000) {
        // 检查是否已存在toast元素,如果有则移除
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;

        // 添加样式
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-size: 14px;
            z-index: 10000002;
            transition: opacity 0.3s;
        `;

        document.body.appendChild(toast);

        // 淡入效果
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });

        // 定时移除
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // 检查验证状态
    function checkVerification() {
        const verifyData = localStorage.getItem('verifyData');
        if (!verifyData) {
            // 检查是否在免费试用期
            const freeTrialData = localStorage.getItem('freeTrialData');
            if (!freeTrialData) {
                // 首次使用,设置7天试用期
                const now = new Date().getTime();
                localStorage.setItem('freeTrialData', JSON.stringify({
                    startTime: now,
                    endTime: now + 7 * 24 * 60 * 60 * 1000
                }));
                return true;
            }

            const trialData = JSON.parse(freeTrialData);
            const now = new Date().getTime();

            if (now < trialData.endTime) {
                return true;
            }
            return false;
        }

        const data = JSON.parse(verifyData);
        const now = new Date().getTime();
        const verifyTime = data.time;
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;

        if (now - verifyTime > sixMonths) {
            localStorage.removeItem('verifyData');
            return false;
        }
        return true;
    }

    // 添加获取剧集列表的函数
    function getEpisodeList() {
        // 不同网站的剧集列表选择器
        const listSelectors = [
            // 爱奇艺
            '.qy-episode-list li a',
            '.episode-list li a',
            // 腾讯视频
            '.episode-list-rect__item a',
            '.episode_list_rect li a',
            // 优酷
            '.anthology-content a',
            '.anthology-list-play a',
            // 芒果TV
            '.episode-item a',
            // 通用选择器
            '[data-episode]',
            '[data-vid]',
            '.episode a',
            '.episodeList a'
        ];

        let episodes = [];
        for (const selector of listSelectors) {
            episodes = Array.from(document.querySelectorAll(selector));
            if (episodes.length > 0) break;
        }

        return episodes;
    }

    // 修改自动下一集功能
    function autoNextEpisode() {
        // 获取剧集列表
        const episodes = getEpisodeList();
        if (episodes.length > 0) {
            // 找到当前集数
            const currentUrl = location.href;
            const currentIndex = episodes.findIndex(ep => {
                const href = ep.href || ep.getAttribute('data-url') || '';
                return href.includes(currentUrl) || currentUrl.includes(href);
            });

            if (currentIndex !== -1 && currentIndex < episodes.length - 1) {
                // 点击下一集
                const nextEpisode = episodes[currentIndex + 1];
                console.log('找到下一集:', nextEpisode);

                // 获取下一集URL
                const nextUrl = nextEpisode.href || nextEpisode.getAttribute('data-url');
                if (nextUrl) {
                    // 直接跳转到下一集
                    location.href = nextUrl;
                    return;
                }

                // 如果无法获取URL，尝试点击
                try {
                    nextEpisode.click();
                    // 如果click()不起作用，尝试触发事件
                    nextEpisode.dispatchEvent(new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }));
                } catch (e) {
                    console.log('点击下一集失败:', e);
                }
            }
        }

        // 如果找不到剧集列表，回退到原来的下一集按钮查找逻辑
        const nextBtnSelectors = [
            // 通用选择器
            '.next-btn',
            '.next-button',
            '.next-episode',
            '.next_btn',
            '[data-title*="下一"]',
            '[title*="下一"]',
            '[class*="next"]',
            // 爱奇艺
            '.iqp-btn-next',
            '.iqp-button-next',
            '.next-trigger',
            // 腾讯视频
            '.txp_btn_next',
            '.txp-btn-next',
            '.txp_btn_next_play',
            // 优酷
            '.control-next-video',
            '.next-position',
            '.next-video-btn',
            // 芒果TV
            '.next-video',
            '.player-next-btn',
            // 哔哩哔哩
            '.bilibili-player-video-btn-next',
            '.bilibili-player-video-next',
            // 通用属性选择器
            'button[title*="下一"]',
            'a[title*="下一"]',
            'div[title*="下一"]',
            '[aria-label*="下一"]'
        ];

        // 查找下一集按钮
        let nextButton = null;
        for (const selector of nextBtnSelectors) {
            const buttons = document.querySelectorAll(selector);
            for (const btn of buttons) {
                // 检查按钮是否可见
                if (btn &&
                    btn.offsetParent !== null &&
                    !btn.disabled &&
                    window.getComputedStyle(btn).display !== 'none' &&
                    window.getComputedStyle(btn).visibility !== 'hidden') {
                    nextButton = btn;
                    break;
                }
            }
            if (nextButton) break;
        }

        if (nextButton) {
            console.log('找到下一集按钮:', nextButton);
            // 模拟真实点击
            nextButton.click();
            // 如果click()不起作用，尝试触发事件
            try {
                nextButton.dispatchEvent(new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                }));
            } catch (e) {
                console.log('点击事件触发失败:', e);
            }

            // 等待页面加载新视频
            setTimeout(() => {
                // 检查URL是否改变
                if (location.href !== lastUrl) {
                    console.log('URL已改变，开始解析新视频');
                    tryParseVideo();
                } else {
                    console.log('URL未改变，可能需要其他方式切换视频');
                    // 尝试其他方式触发下一集
                    const event = new Event('ended', { bubbles: true });
                    document.querySelector('video')?.dispatchEvent(event);
                }
            }, 2000);
        } else {
            console.log('未找到下一集按钮');
            // 可以尝试其他方式切换视频，比如URL参数修改
        }
    }

    // 修改片头片尾检测和跳过功能
    function setupSkipIntroOutro(video) {
        if (!video) return;

        // 常见片头片尾时长(秒)
        const INTRO_DURATION = 90; // 默认片头时长
        const OUTRO_DURATION = 120; // 片尾时长
        const SKIP_THRESHOLD = 5;
        const MIN_AD_DURATION = 15; // 最短广告时长

        // 用于检测画面变化的canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        let lastImageData = null;
        let sameFrameCount = 0;
        let foundIntro = false;

        // 检测画面变化
        function checkSceneChange() {
            try {
                canvas.width = 200; // 降低分辨率以提高性能
                canvas.height = 112;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

                if (lastImageData) {
                    let diff = 0;
                    const data1 = imageData.data;
                    const data2 = lastImageData.data;

                    // 计算画面差异
                    for (let i = 0; i < data1.length; i += 4) {
                        diff += Math.abs(data1[i] - data2[i]); // R
                        diff += Math.abs(data1[i+1] - data2[i+1]); // G
                        diff += Math.abs(data1[i+2] - data2[i+2]); // B
                    }

                    const avgDiff = diff / (canvas.width * canvas.height * 3);

                    if (avgDiff < 10) { // 画面相似
                        sameFrameCount++;
                    } else { // 画面变化明显
                        if (sameFrameCount > 10 && video.currentTime > MIN_AD_DURATION) {
                            // 可能是广告结束，正片开始
                            foundIntro = true;
                            console.log('检测到正片开始位置:', video.currentTime);
                            video.currentTime = video.currentTime + 2; // 跳过2秒确保过渡完成
                            return true;
                        }
                        sameFrameCount = 0;
                    }
                }

                lastImageData = imageData;
                return false;
            } catch (e) {
                console.log('画面检测失败:', e);
                return false;
            }
        }

        // 智能跳过开头
        function smartSkipIntro() {
            if (foundIntro) return;

            // 如果视频时长小于预��片头长度，可能是广告
            if (video.duration && video.duration < INTRO_DURATION) {
                console.log('视频较短，可能是广告，持续检测画面变化');
                return;
            }

            // 检测画面变化
            if (checkSceneChange()) {
                console.log('已跳转到正片位置');
                return;
            }

            // 如果超过默认片头时长仍未找到正片，使用默认跳转
            if (video.currentTime >= INTRO_DURATION && !foundIntro) {
                console.log('使用默认片头时长跳转');
                video.currentTime = INTRO_DURATION;
                foundIntro = true;
            }
        }

        // 监听视频播放事件
        let checkInterval = setInterval(() => {
            if (video.readyState >= 2 && !foundIntro) {
                smartSkipIntro();
            }
        }, 500);

        // 视频播放事件
        video.addEventListener('play', () => {
            foundIntro = false;
            lastImageData = null;
            sameFrameCount = 0;
        });

        // 检测片尾
        function checkOutro() {
            if (!video) return;

            const remainingTime = video.duration - video.currentTime;
            if (remainingTime <= OUTRO_DURATION && remainingTime > SKIP_THRESHOLD) {
                console.log('自动跳过片尾');
                clearInterval(checkInterval);
                autoNextEpisode();
            }
        }

        // 监听视频播放进度
        video.addEventListener('timeupdate', () => {
            if (!foundIntro) {
                smartSkipIntro();
            }
            checkOutro();
        });

        // 清理函数
        return () => {
            clearInterval(checkInterval);
            canvas.remove();
        };
    }

    // 修改视频解析函数中的视频结束检测部分
    function checkVideoEnded(video, iframe) {
        if (!video) return;

        // 添加片头片尾跳过功能
        setupSkipIntroOutro(video);

        let lastTime = 0;
        let sameTimeCount = 0;
        let checkCount = 0;

        const checkInterval = setInterval(() => {
            if (document.hidden) return;

            try {
                checkCount++;
                // 检查视频是否真的结束
                if (video.ended ||
                    (video.currentTime > 0 &&
                     Math.abs(video.currentTime - video.duration) < 1) ||
                    (video.currentTime === lastTime &&
                     video.currentTime > 0 &&
                     !video.paused)) {

                    sameTimeCount++;

                    // 如果连续3次检测到相同时间，认为视频���结束
                    if (sameTimeCount >= 3) {
                        clearInterval(checkInterval);
                        console.log('视频播放结束，准备切换下一集');
                        autoNextEpisode();
                    }
                } else {
                    sameTimeCount = 0;
                }

                // 如果检查超过60次(约1分钟)仍未结束，清除检查
                if (checkCount > 60) {
                    clearInterval(checkInterval);
                }

                lastTime = video.currentTime;
            } catch (e) {
                // 忽略跨域错误
            }
        }, 1000);

        // 同时监听ended事件
        video.addEventListener('ended', () => {
            clearInterval(checkInterval);
            console.log('收到视频结束事件');
            autoNextEpisode();
        });
    }

    // 修改视频解析函数，添加自动下一集检测
    async function tryParseVideo(apiIndex = 0) {
        if (apiIndex >= jxApis.length) {
            showToast('所有接口解析失败，请稍后重试');
            return;
        }

        const videoUrl = location.href;
        // 修改播放器选择器，增加芒果TV特定的选择器
        const videoPlayer = document.querySelector('#player, .player, .video-player, #video-box, #flashbox, #playerbox, .iqp-player, #__playerContainer, #mgtv-player-wrap, #mgtv-player-wrap .video-area, .c-player-video');

        // 如果还是找不到播放器，尝试等待播放器加载
        if (!videoPlayer) {
            // 等待播放器加载
            await new Promise(resolve => {
                const checkPlayer = setInterval(() => {
                    const player = document.querySelector('#player, .player, .video-player, #video-box, #flashbox, #playerbox, .iqp-player, #__playerContainer, #mgtv-player-wrap, #mgtv-player-wrap .video-area, .c-player-video');
                    if (player) {
                        clearInterval(checkPlayer);
                        resolve(player);
                    }
                }, 500);

                // 10秒后超时
                setTimeout(() => {
                    clearInterval(checkPlayer);
                    resolve(null);
                }, 10000);
            });
        }

        // 再次检查播放器
        const player = document.querySelector('#player, .player, .video-player, #video-box, #flashbox, #playerbox, .iqp-player, #__playerContainer, #mgtv-player-wrap, #mgtv-player-wrap .video-area, .c-player-video');
        if (!player) {
            showToast('未找��播放器，请刷新页面重试');
            return;
        }

        // 芒果TV特殊处理
        if (location.hostname.includes('mgtv.com')) {
            // 修改样式处理
            const style = document.createElement('style');
            style.textContent = `
                .video-area > div:not(:first-child),
                .c-player-video > div:not(:first-child),
                .player-mask,
                .m-player-tip,
                .m-player-paytip,
                .m-player-h5-new,
                .video-error-layer,
                .m-player-paytip-title,
                .m-player-paytip-text,
                .m-player-paytip-btn,
                .player-paytip,
                .player-paytip-title,
                .player-paytip-text,
                .player-paytip-btn,
                [class*="player-ad"],
                [class*="player-mask"],
                [class*="player-error"],
                [class*="player-tips"],
                .m-player-error {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                    pointer-events: none !important;
                }
                .video-area,
                .c-player-video,
                .mgtv-player-wrap {
                    position: relative !important;
                    z-index: 2147483647 !important;
                    width: 100% !important;
                    height: 100vh !important;
                    min-height: 600px !important;
                }
                .c-player iframe,
                .video-area iframe,
                .mgtv-player-wrap iframe {
                    position: relative !important;
                    z-index: 2147483647 !important;
                    width: 100% !important;
                    height: 100% !important;
                    min-height: 600px !important;
                    max-width: 100% !important;
                    max-height: 100vh !important;
                    object-fit: contain !important;
                }
                /* 修复播放器容器 */
                #mgtv-player-wrap {
                    width: 100% !important;
                    height: 100vh !important;
                    min-height: 600px !important;
                    max-height: 100vh !important;
                    position: relative !important;
                }
                /* 确保视频区域填满容器 */
                .video-area {
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    background: #000 !important;
                }
            `;
            document.head.appendChild(style);

            // 持续检查并移除遮罩
            const removeOverlays = setInterval(() => {
                const overlays = document.querySelectorAll([
                    '.player-mask',
                    '.m-player-tip',
                    '.m-player-paytip',
                    '.video-error-layer',
                    '.m-player-error',
                    '[class*="player-ad"]',
                    '[class*="player-mask"]',
                    '[class*="player-error"]',
                    '[class*="player-tips"]'
                ].join(','));

                overlays.forEach(overlay => {
                    if (overlay) overlay.remove();
                });
            }, 500);

            // 60秒后停止检查
            setTimeout(() => clearInterval(removeOverlays), 60000);
        }

        showToast(`正在尝试第${apiIndex + 1}个接口...`);

        const iframe = document.createElement('iframe');
        iframe.src = jxApis[apiIndex].url + videoUrl;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            position: relative;
            z-index: 2147483647 !important; /* 使用最大z-index */
        `;
        iframe.setAttribute('allowfullscreen', true);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('scrolling', 'no');
        iframe.setAttribute('allow', 'autoplay; fullscreen');

        // 处理爱奇艺的遮罩层
        if (location.hostname.includes('iqiyi.com')) {
            // 移除或隐藏爱奇艺的提示框和遮罩
            const style = document.createElement('style');
            style.textContent = `
                .iqp-layer,
                .iqp-layer-main,
                .vip-popup,
                .player-vippay-popup,
                .iqp-player-g-vippay,
                #flashbox > div:not(:first-child),
                .iqp-player-videolayer {
                    display: none !important;
                    opacity: 0 !important;
                    visibility: hidden !important;
                }
                .iqp-player {
                    position: relative !important;
                    z-index: 2147483646 !important;
                }
                #player {
                    position: relative !important;
                    z-index: 2147483646 !important;
                }
            `;
            document.head.appendChild(style);

            // 定期检查并移除遮罩
            const removeOverlays = setInterval(() => {
                const overlays = document.querySelectorAll('.iqp-layer, .iqp-layer-main, .vip-popup, .player-vippay-popup, .iqp-player-g-vippay, .iqp-player-videolayer');
                overlays.forEach(overlay => {
                    if (overlay) overlay.remove();
                });
            }, 1000);

            // 60秒后停止检查
            setTimeout(() => clearInterval(removeOverlays), 60000);
        }

        let checkTimeout;

        iframe.onload = () => {
            try {
                checkTimeout = setTimeout(() => {
                    if (!iframe.contentWindow || !iframe.contentWindow.document) {
                        tryParseVideo(apiIndex + 1);
                    } else {
                        // 监听视频播放结束
                        try {
                            const video = iframe.contentWindow.document.querySelector('video');
                            if (video) {
                                checkVideoEnded(video, iframe);
                                // 添加自动跳过片头片尾功能
                                setupSkipIntroOutro(video);
                            }
                        } catch (e) {
                            // 跨域限制，使用轮询检查
                            setInterval(() => {
                                if (document.hidden) return;
                                try {
                                    const video = iframe.contentWindow.document.querySelector('video');
                                    if (video) {
                                        checkVideoEnded(video, iframe);
                                        // 添加自动跳过片头片尾功能
                                        setupSkipIntroOutro(video);
                                    }
                                } catch (e) {
                                    // 忽略跨域错误
                                }
                            }, 5000);
                        }
                    }
                }, 5000);
            } catch (e) {
                clearTimeout(checkTimeout);
                showToast('解析成功');

                // 设置定时器检查视频状态
                setInterval(() => {
                    if (document.hidden) return;
                    try {
                        const video = iframe.contentWindow.document.querySelector('video');
                        if (video && video.ended) {
                            autoNextEpisode();
                        }
                    } catch (e) {
                        // 忽略跨域错误
                    }
                }, 5000);
            }
        };

        iframe.onerror = () => {
            clearTimeout(checkTimeout);
            tryParseVideo(apiIndex + 1);
        };

        videoPlayer.innerHTML = '';
        videoPlayer.appendChild(iframe);
    }

    // 创建验证弹窗
    function createVerifyModal() {
        const mask = document.createElement('div');
        mask.className = 'verify-mask';

        const modal = document.createElement('div');
        modal.className = 'verify-modal';

        const qrCodeUrl = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket=gQH47joAAAAAAAAAASxodHRwOi8vd2VpeGluLnFxLmNvbS9xL2taZ2Z3TVRtNzJXV1Brb3ZhYmJJAAIEZ23sUwMEmm3sUw';

        modal.innerHTML = `
            <h3>首次使用请验证</h3>
            <p class="highlight-text">扫码关注公众号，发送"VIP"获取验证码</p>
            <img src="${qrCodeUrl}" alt="公众号二维码" style="width:200px;height:200px;margin:10px 0;border:1px solid #ddd;">
            <input type="text" class="verify-input" placeholder="请输入验证码" id="verifyInput" autocomplete="off">
            <p style="color:#ff4d4f;margin:5px 0;display:none" class="error-tip">验证码错误，请重新输入</p>
            <button class="verify-btn" style="background:#FF4D4F;color:white;border:none;padding:8px 20px;border-radius:4px;cursor:pointer;margin-top:10px;">验证</button>
            <p style="color:#666;font-size:12px">新用户可免费试用7天</p>
        `;

        document.body.appendChild(mask);
        document.body.appendChild(modal);

        const input = modal.querySelector('#verifyInput');
        setTimeout(() => input.focus(), 100);

        modal.querySelector('.verify-btn').addEventListener('click', () => {
            const code = input.value.trim();

            if(code === '5288') {
                localStorage.setItem('verifyData', JSON.stringify({
                    time: new Date().getTime(),
                    verified: true
                }));
                mask.remove();
                modal.remove();
                tryParseVideo();
            } else {
                modal.querySelector('.error-tip').style.display = 'block';
                input.value = '';
                input.focus();
            }
        });

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                modal.querySelector('.verify-btn').click();
            }
        });

        mask.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // 初始化
    function init() {
        const button = document.createElement('div');
        button.className = 'parse-button';
        button.innerHTML = `
            <span class="line1">视频</span>
            <span class="line2">解析</span>
        `;
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            if (checkVerification()) {
                tryParseVideo();
            } else {
                createVerifyModal();
            }
        });
    }

    // 添加URL变化监听，自动解析新视频
    let lastUrl = location.href;
    setInterval(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            if (checkVerification()) {
                tryParseVideo();
            }
        }
    }, 1000);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();