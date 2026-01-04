// ==UserScript==
// @name         哔哩极音
// @namespace    https://github.com/xxdz-Official/biliJiyin/blob/main/%E5%93%94%E5%93%A9%E6%9E%81%E9%9F%B3.user.js
// @version      2.1
// @description  把B站改造成实用的音乐播放器！
// @author       小小电子xxdz
// @match        https://www.bilibili.com/list/*
// @icon         https://article.biliimg.com/bfs/new_dyn/6de998bc1c801811007eb1b522a41a603461569935575626.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537188/%E5%93%94%E5%93%A9%E6%9E%81%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/537188/%E5%93%94%E5%93%A9%E6%9E%81%E9%9F%B3.meta.js
// ==/UserScript==


//更新日志
//2.0版本修复了一些性能问题，比如修复了一些不必要的无限循环执行
//可以杜绝视频无法播放的bug（无限加载），不过需要在网页打开后前3秒内播放视频，本次即可正常使用（我尝试过自动在3秒内播放，不过由于屎山代码，没能实现QwQ）
//由于一些用户的反馈建议，新增了是否暂停后重播的开关，此开关可记忆
//修改了音谱音谱的部分UI，去掉了流动色相，改为了更简约的风格，示波器为初音未来应援色，分析器为洛天依应援色UwU
//(>皿<)新增的bug!
//由于屎山代码，新增了俩bug，就是v1版本的修改视频和播放列表位置大小的功能失效了。。
//如果是稍后再看，则不运行哔哩极音，比较稍后再看不一定是打算后台听的音乐嘛
//
(function() {
    'use strict';

        // ========== 检查是否为稍后再看页面，如果是的话就不运行哔哩极音 ==========
    function isWatchLaterPage() {
        return window.location.href.includes('https://www.bilibili.com/list/watchlater/');
    }

    if (isWatchLaterPage()) {
        console.log('检测到稍后再看页面，脚本停止执行 (＞﹏＜)');
        return;
    }

    let hasChangedQuality = false;
    let lastFullCheckTime = 0;
    const FULL_CHECK_INTERVAL = 200;
    let isPageLoaded = false;
    let lastVideoHref = '';
    let isReplaying = false;
    let replayChecker = null;
    let videoStartObserver = null;
    let hasClickedAutoPlay = false;
    let hasModifiedBackground = false;
    let hasAddedCustomText = false;
    let hasAddedOriginalButton = false;
    let hasAddedGitHubButton = false;
    let hasAddedAuthorButton = false;
    let hasAddedReplayToggle = false; // 新增：重播开关！
    // 新增：获取和设置重播功能状态
    function getReplayOnPauseState() {
        const saved = localStorage.getItem('xxdz_replay_on_pause');
        return saved === null ? true : saved === 'true'; // 默认开启
    }

    function setReplayOnPauseState(state) {
        localStorage.setItem('xxdz_replay_on_pause', state.toString());
    }

    function waitForPageLoad() {
        if (document.readyState === 'complete') {
            isPageLoaded = true;
            initializeScript();
        } else {
            window.addEventListener('load', function() {
                isPageLoaded = true;
                initializeScript();
            });
        }
    }

    function initializeScript() {
        console.log('页面已加载，开始初始化脚本（>ω< ）');
        setGradientBackground();
        hideRootBg1();
        modifyPageTitle();
        shrinkTargetElement();
        adjustPlaylistContainerStyle();
        removeNewElements();
        mainCheck();
        clickTargetElement();
        startURLChangeObserver();
        startVideoReplayCheck();
        addVolumeControl();
        startVideoStartObserver();

        // 延迟3秒后加载音频分析器（可以预防视频无法加载的问题，需要在时这按播放）
        setTimeout(startAudioVisualizer, 3000);
    }

    //视频总是从头开始播放
    function startVideoStartObserver() {
        if (videoStartObserver) {
            videoStartObserver.disconnect();
        }

        videoStartObserver = new MutationObserver(function(mutations) {
            const videoElement = document.querySelector('video');
            if (videoElement && !videoElement.hasAttribute('data-xxdz-reset')) {
                videoElement.setAttribute('data-xxdz-reset', 'true');

                // 只在开启重播功能时重置
                if (getReplayOnPauseState()) {
                    resetVideoToStart(videoElement);
                }

                videoElement.addEventListener('play', function() {
                    // 只在开启重播功能时执行重播
                    if (getReplayOnPauseState() && this.currentTime > 0.5) {
                        this.currentTime = 0;
                    }
                });

                console.log('已设置视频总是从头开始播放');
            }
        });

        videoStartObserver.observe(document, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    function resetVideoToStart(videoElement) {
        if (!videoElement || !getReplayOnPauseState()) return;
        try {
            videoElement.currentTime = 0;
        } catch (e) {
            console.error('设置视频从头播放时出错啦＞︿＜:', e);
        }
    }

    function addVolumeControl() {
        const elementToRemove = document.evaluate(
            '//*[@id="mirror-vdcon"]/div[1]/div[1]/div[2]/div/div[4]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (elementToRemove) {
            elementToRemove.remove();
            console.log('已删除元素播放列表容器');
        }

        const targetElement = document.evaluate(
            '//*[@id="mirror-vdcon"]/div[1]/div[1]/div[2]/div/div[3]/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetElement && !targetElement.nextElementSibling?.classList.contains('xxdz-volume-container')) {
            const container = document.createElement('div');
            container.className = 'xxdz-volume-container';
            container.style.cssText = `
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
            `;

            const volumeText = document.createElement('span');
            volumeText.className = 'xxdz-volume-text';
            volumeText.textContent = '音量大小:';
            volumeText.style.cssText = `
                font-size: 12px;
                color: #FFFFFF;
                margin-right: 5px;
            `;
            container.appendChild(volumeText);

            const volumeControl = document.createElement('div');
            volumeControl.className = 'xxdz-volume-control';
            volumeControl.style.cssText = `
                position: relative;
                width: 100px;
                height: 4px;
                background: #ddd;
                border-radius: 2px;
                cursor: pointer;
            `;

            const volumeLevel = document.createElement('div');
            volumeLevel.className = 'xxdz-volume-level';
            volumeLevel.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: #00A1D6;
                border-radius: 2px;
                transform: scaleX(0.7);
                transform-origin: left;
                transition: transform 0.1s ease;
            `;

            const volumeHandle = document.createElement('img');
            volumeHandle.className = 'xxdz-volume-handle';
            volumeHandle.src = 'https://article.biliimg.com/bfs/new_dyn/cf84ec14a28d0585c3fe7ff8057f487f3461569935575626.png';
            volumeHandle.style.cssText = `
                position: absolute;
                top: 50%;
                left: 70%;
                width: 12px;
                height: 12px;
                transform: translate(-50%, -50%);
                transition: left 0.1s ease;
                pointer-events: none;
            `;

            volumeControl.appendChild(volumeLevel);
            volumeControl.appendChild(volumeHandle);
            container.appendChild(volumeControl);
            targetElement.parentNode.insertBefore(container, targetElement.nextSibling);

            const video = document.querySelector('video');
            let currentVolume = video ? video.volume : 0.7;

            function updateVolumeDisplay(volume) {
                volumeLevel.style.transform = `scaleX(${volume})`;
                volumeHandle.style.left = `${volume * 100}%`;
            }

            function setVolume(volume) {
                currentVolume = Math.min(1, Math.max(0, volume));
                updateVolumeDisplay(currentVolume);
                if (video) {
                    video.volume = currentVolume;
                }
            }

            updateVolumeDisplay(currentVolume);

            let isDragging = false;

            volumeControl.addEventListener('mousedown', function(e) {
                isDragging = true;
                const rect = this.getBoundingClientRect();
                const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                setVolume(percent);
            });

            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    const rect = volumeControl.getBoundingClientRect();
                    const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                    setVolume(percent);
                }
            });

            document.addEventListener('mouseup', function() {
                isDragging = false;
            });

            volumeControl.addEventListener('click', function(e) {
                const rect = this.getBoundingClientRect();
                const percent = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
                setVolume(percent);
            });

            console.log('已添加带小电视图标的音量控制条');

            // 新增：在音量控制条右侧添加重播功能开关
            addReplayToggleButton(container);
        }
    }

// 新增：添加重播功能开关按钮
function addReplayToggleButton(volumeContainer) {
    if (hasAddedReplayToggle) return;

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'xxdz-replay-toggle-container';
    toggleContainer.style.cssText = `
        display: inline-flex;
        align-items: center;
        margin-left: 15px;
    `;

    const toggleText = document.createElement('span');
    toggleText.className = 'xxdz-replay-toggle-text';
    toggleText.textContent = '暂停重播:';
    toggleText.style.cssText = `
        font-size: 12px;
        color: #FFFFFF;
        margin-right: 5px;
    `;
    toggleContainer.appendChild(toggleText);

    const toggleSwitch = document.createElement('div');
    toggleSwitch.className = 'xxdz-replay-toggle-switch';
    toggleSwitch.style.cssText = `
        position: relative;
        width: 40px;
        height: 20px;
        background: ${getReplayOnPauseState() ? '#00A1D6' : '#ccc'};
        border-radius: 0px;
        cursor: pointer;
        transition: background 0.3s ease;
    `;

    const toggleHandle = document.createElement('div');
    toggleHandle.className = 'xxdz-replay-toggle-handle';
    toggleHandle.style.cssText = `
        position: absolute;
        top: 2px;
        left: ${getReplayOnPauseState() ? '22px' : '2px'};
        width: 16px;
        height: 16px;
        background: white;
        border-radius: 0px;
        transition: all 0.3s ease; // 改为 all 确保位置和背景色都过渡
        box-shadow: 0 2px 4px rgba(0,0,0,0.2); // 添加阴影增强可见性
    `;
    toggleSwitch.appendChild(toggleHandle);

    // 点击切换功能
    toggleSwitch.addEventListener('click', function() {
        const newState = !getReplayOnPauseState();
        setReplayOnPauseState(newState);

        // 平滑过渡
        toggleSwitch.style.background = newState ? '#00A1D6' : '#ccc';
        toggleHandle.style.left = newState ? '22px' : '2px';

        console.log(`暂停重播功能已${newState ? '开启' : '关闭'}`);

        // 如果重新开启，立即重置当前视频
        if (newState) {
            const video = document.querySelector('video');
            if (video) {
                resetVideoToStart(video);
            }
        }
    });

    toggleContainer.appendChild(toggleSwitch);
    volumeContainer.parentNode.insertBefore(toggleContainer, volumeContainer.nextSibling);

    hasAddedReplayToggle = true;
    console.log('已添加暂停重播功能开关');
}

    function startURLChangeObserver() {
        let oldHref = document.location.href;
        const body = document.querySelector('body');
        const observer = new MutationObserver(mutations => {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                handleURLChange();
            }
        });
        observer.observe(body, { childList: true, subtree: true });
    }

    function handleURLChange() {
        console.log('检测到URL变化，重新检测元素');
        lastVideoHref = '';
        isReplaying = false;
        if (replayChecker) clearInterval(replayChecker);
        if (videoStartObserver) videoStartObserver.disconnect();

        // 重置状态标记
        hasClickedAutoPlay = false;
        hasModifiedBackground = false;
        hasAddedCustomText = false;
        hasAddedOriginalButton = false;
        hasAddedGitHubButton = false;
        hasAddedAuthorButton = false;
        hasAddedReplayToggle = false; // 重置重播开关标记

        mainCheck();
        startVideoReplayCheck();
        startVideoStartObserver();
    }

    function startVideoReplayCheck() {
        let retryCount = 0;
        const maxRetry = 20;
        const checkInterval = 500;

        replayChecker = setInterval(() => {
            if (retryCount++ > maxRetry) {
                clearInterval(replayChecker);
                return;
            }

            const videoPlayer = document.querySelector('.bpx-player-video-wrap video');
            if (videoPlayer) {
                clearInterval(replayChecker);
                // 只在开启重播功能时重播
                if (getReplayOnPauseState()) {
                    replayVideo(videoPlayer);
                }
            }
        }, checkInterval);
    }

    function replayVideo(videoElement) {
        if (isReplaying || !getReplayOnPauseState()) return;
        isReplaying = true;

        try {
            videoElement.pause();
            videoElement.currentTime = 0;
            setTimeout(() => {
                videoElement.play();
            }, 300);
        } catch (e) {
            console.error('视频重播失败＞︿＜:', e);
        }
    }

    function adjustPlaylistContainerStyle() {
        const style = document.createElement('style');
        style.textContent = `
            .playlist-container .playlist-container--right[data-v-2b808d54] {
                width: 950px !important;
                margin-left: 0px !important;
                padding-bottom: 20px !important;
            }
        `;
        document.head.appendChild(style);
        console.log('已调整播放列表容器样式');
    }

    function removeNewElements() {
        const element4 = document.evaluate(
            '//*[@id="mirror-vdcon"]/div[1]/div[4]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (element4) {
            element4.remove();
            console.log('已删除视频简介、标签');
        }

        const element6 = document.evaluate(
            '//*[@id="mirror-vdcon"]/div[1]/div[6]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (element6) {
            element6.remove();
            console.log('已删除元素 //*[@id="mirror-vdcon"]/div[1]/div[6]');
        }

        const danmukuBoxElement = document.evaluate(
            '//*[@id="danmukuBox"]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        if (danmukuBoxElement) {
            danmukuBoxElement.remove();
            console.log('已删除元素 //*[@id="danmukuBox"]/div/div/div/div/div/div/div[1]/div[2]');
        }
    }

    function shrinkTargetElement() {
        const targetElement = document.evaluate(
            '//*[@id="mirror-vdcon"]/div[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetElement) {
            targetElement.style.transform = 'scale(0.98)';
            targetElement.style.transformOrigin = 'top left';
            console.log('已缩小视频播放器元素0.98%');
        }
    }

    function clickTargetElement() {
        if (hasClickedAutoPlay) return;

        let clickCount = 0;
        const maxClicks = 10;
        const clickInterval = 500; // 每次尝试的间隔时间(毫秒)

        const clickAttempt = setInterval(() => {
            if (clickCount >= maxClicks) {
                clearInterval(clickAttempt);
                hasClickedAutoPlay = true;
                return;
            }

            const targetElement = document.querySelector('.bui-radio-input');
            if (targetElement) {
                targetElement.click();
                console.log(`已模拟点击自动连播 (${clickCount + 1}/${maxClicks})`);
            } else {
                console.log(`尝试点击自动连播按钮 (${clickCount + 1}/${maxClicks}) - 元素未找到`);
            }

            clickCount++;
        }, clickInterval);
    }

    function setGradientBackground() {
        const style = document.createElement('style');
        style.textContent = `
            body {
                background: linear-gradient(to bottom, rgb(58, 204, 204), rgb(241, 242, 243)) !important;
                background-attachment: fixed !important;
            }
        `;
        document.head.appendChild(style);
        console.log('已设置渐变背景');
    }

    function hideRootBg1() {
        const style = document.createElement('style');
        style.textContent = `
            :root {
                --bg1: transparent !important;
            }
        `;
        document.head.appendChild(style);
        console.log('已隐藏:root中的--bg1颜色');
    }

    function modifyPageTitle() {
        const originalTitle = document.title;
        if (!originalTitle.startsWith('【哔哩极音】')) {
            document.title = '【哔哩极音】' + originalTitle;
            console.log('已修改页面标题');
        }
    }

    function autoSelectQuality() {
        if (hasChangedQuality || !isPageLoaded) return;

        const qualityBtn = document.querySelector('.bpx-player-ctrl-quality');
        if (!qualityBtn) return;

        const currentQuality = document.querySelector('.bpx-player-ctrl-quality-result');
        if (currentQuality && currentQuality.textContent.includes('360P')) {
            hasChangedQuality = true;
            return;
        }

        qualityBtn.click();

        setTimeout(() => {
            const qualityOption = document.querySelector('.bpx-player-ctrl-quality-menu-item[data-value="16"]');
            if (qualityOption) {
                qualityOption.click();
                console.log('已自动选择360p流畅');
                hasChangedQuality = true;
            }
        }, 800);
    }

    function isDanmuClosed() {
        return document.querySelector('.bpx-player-dm-switch input')?.checked === false;
    }

    function checkDanmuInput() {
        if (isDanmuClosed() || !isPageLoaded) return;

        const danmuInput = document.querySelector('.bpx-player-dm-input');
        if (danmuInput) {
            const dKeyEvent = new KeyboardEvent('keydown', {
                key: 'd',
                code: 'KeyD',
                keyCode: 68,
                which: 68,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(dKeyEvent);
        }
    }

    function removeCommentSection() {
        const commentApp = document.querySelector('div#commentapp');
        if (commentApp) {
            commentApp.remove();
            console.log('已删除评论区域');
        }
    }

    function removeRecommendList() {
        const recommendList = document.querySelector('.recommend-list-container');
        if (recommendList) {
            recommendList.remove();
            console.log('已删除推荐列表区域');
        }
    }

    function removeVideoToolbarRight() {
        const toolbarRight = document.querySelector('.video-toolbar-right');
        if (toolbarRight) {
            toolbarRight.remove();
            console.log('已删除视频工具栏右侧');
        }
    }

    function removeTargetElement() {
        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div/ul[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            element.remove();
            console.log('已删除网页头部的一堆按钮');
        }
    }
// 删除视频标签容器元素
function removeVideoTagContainer() {
    const videoTagContainer = document.querySelector('.video-tag-container');
    if (videoTagContainer) {
        videoTagContainer.remove();
        console.log('已删除视频标签容器 (.video-tag-container)');
    }
}
    function UPintroduce() {
        const element = document.evaluate(
            '/html/body/div[2]/div[2]/div[2]/div[1]/div[1]/div[2]/div[1]/div/div[2]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            element.remove();
            console.log('已删除UP主简介');
        }
    }

    function DeleteVideo() {
        const toolbarRight = document.querySelector('bpx-player-video-perch');
        if (toolbarRight) {
            toolbarRight.remove();
            console.log('已删除视频');
        }
    }

    function changeBackgroundColor() {
        if (hasModifiedBackground) return;

        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            element.style.backgroundColor = 'rgb(58, 204, 204)';
            hasModifiedBackground = true;
            console.log('已修改元素背景颜色为 RGB(58, 204, 204)');
        }
    }

    function addCustomText() {
        if (hasAddedCustomText) return;

        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element && !element.querySelector('.xxdz-custom-text')) {
            const container = document.createElement('span');
            container.className = 'xxdz-custom-text';
            container.style.cssText = `
                display: flex;
                align-items: flex-end;
                margin-right: 5px;
                order: -1;
                height: 30px;
            `;

            const iconImg = document.createElement('img');
            iconImg.src = 'https://article.biliimg.com/bfs/new_dyn/6de998bc1c801811007eb1b522a41a603461569935575626.png';
            iconImg.style.cssText = `
                width: 60px;
                height: 60px;
                margin-bottom: -15px;
                margin-right: 5px;
            `;
            container.appendChild(iconImg);

            const titleSpan = document.createElement('span');
            titleSpan.textContent = '哔哩极音';
            titleSpan.style.cssText = `
                color: white;
                font-size: 25px;
                line-height: 25px;
                padding: 0 0 0 5px;
                background-color: rgba(58,204,204);
                border-radius: 4px 0 0 4px;
            `;

            const subSpan = document.createElement('span');
            subSpan.textContent = '播放器';
            subSpan.style.cssText = `
                color: white;
                font-size: 15px;
                line-height: 15px;
                padding: 0 5px 0 0;
                background-color: rgba(58,204,204);
                border-radius: 0 4px 4px 0;
                margin-bottom: -6px;
                margin-left: 5px;
            `;

            container.appendChild(titleSpan);
            container.appendChild(subSpan);

            const versionSpan = document.createElement('span');
            versionSpan.textContent = '版本：2.1';
            versionSpan.style.cssText = `
                color: white;
                font-size: 10px;
                line-height: 15px;
                padding: 0 5px 0 0;
                background-color: rgba(58,204,204);
                border-radius: 0 4px 4px 0;
                margin-bottom: -13px;
                margin-left: 5px;
            `;
            container.appendChild(versionSpan);

            element.appendChild(container);
            hasAddedCustomText = true;
            console.log('已添加插件名哔哩极音和版本号');
        }
    }

    function addOriginalVideoButton() {
        if (hasAddedOriginalButton) return;

        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element) {
            const videoLinkElement = document.evaluate(
                '//*[@id="mirror-vdcon"]/div[1]/div[1]/div[1]/div/h1/a',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;

            if (videoLinkElement) {
                const currentHref = videoLinkElement.href;
                if (currentHref === lastVideoHref) return;
                lastVideoHref = currentHref;

                let button = element.querySelector('.xxdz-original-video-button');
                if (!button) {
                    button = document.createElement('a');
                    button.className = 'xxdz-original-video-button';
                    button.textContent = '查看该原视频';
                    button.target = '_blank';
                    button.style.cssText = `
                        display: inline-block;
                        color: white;
                        font-size: 14px;
                        margin-left: 10px;
                        padding: 4px 8px;
                        background-color: #FF9500;
                        border-radius: 4px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    `;
                    button.addEventListener('mouseover', () => {
                        button.style.backgroundColor = '#E68500';
                    });
                    button.addEventListener('mouseout', () => {
                        button.style.backgroundColor = '#FF9500';
                    });
                }
                button.href = currentHref;

                let troubleshootButton = element.querySelector('.xxdz-troubleshoot-button');
                if (!troubleshootButton) {
                    troubleshootButton = document.createElement('a');
                    troubleshootButton.className = 'xxdz-troubleshoot-button';
                    troubleshootButton.textContent = '疑难解答';
                    troubleshootButton.href = 'https://www.bilibili.com/opus/1070836978706022405';
                    troubleshootButton.target = '_blank';
                    troubleshootButton.style.cssText = `
                        display: inline-block;
                        color: white;
                        font-size: 14px;
                        margin-left: 10px;
                        padding: 4px 8px;
                        background-color: #FF69B4;
                        border-radius: 4px;
                        text-decoration: none;
                        cursor: pointer;
                        transition: background-color 0.2s;
                    `;
                    troubleshootButton.addEventListener('mouseover', () => {
                        troubleshootButton.style.backgroundColor = '#FF1493';
                    });
                    troubleshootButton.addEventListener('mouseout', () => {
                        troubleshootButton.style.backgroundColor = '#FF69B4';
                    });
                }

                const githubButton = element.querySelector('.xxdz-github-button');
                if (githubButton) {
                    element.insertBefore(troubleshootButton, githubButton);
                    element.insertBefore(button, troubleshootButton);
                } else {
                    element.appendChild(troubleshootButton);
                    element.appendChild(button);
                }
                hasAddedOriginalButton = true;
                console.log('已添加查看原视频按钮和疑难解答按钮');
            }
        }
    }

    function addGitHubButton() {
        if (hasAddedGitHubButton) return;

        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element && !element.querySelector('.xxdz-github-button')) {
            const button = document.createElement('a');
            button.className = 'xxdz-github-button';
            button.textContent = '前往GitHub查看项目源代码';
            button.href = 'https://github.com/xxdz-Official/biliJiyin';
            button.target = '_blank';
            button.style.cssText = `
                display: inline-block;
                color: white;
                font-size: 14px;
                margin-left: 10px;
                padding: 4px 8px;
                background-color: #333;
                border-radius: 4px;
                text-decoration: none;
                cursor: pointer;
                transition: background-color 0.2s;
            `;
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#555';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#333';
            });
            element.appendChild(button);
            hasAddedGitHubButton = true;
            console.log('已添加GitHub按钮');
        }
    }

    function addAuthorButton() {
        if (hasAddedAuthorButton) return;

        const element = document.evaluate(
            '/html/body/div[2]/div[1]/div/div',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (element && !element.querySelector('.xxdz-author-button')) {
            const button = document.createElement('a');
            button.className = 'xxdz-author-button';
            button.textContent = '插件作者 小小电子xxdz';
            button.href = 'https://space.bilibili.com/3461569935575626';
            button.target = '_blank';
            button.style.cssText = `
                display: inline-block;
                color: white;
                font-size: 14px;
                margin-left: 10px;
                padding: 4px 8px;
                background-color: #00A1D6;
                border-radius: 4px;
                text-decoration: none;
                cursor: pointer;
                transition: background-color 0.2s;
            `;
            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#008CBA';
            });
            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#00A1D6';
            });
            element.appendChild(button);
            hasAddedAuthorButton = true;
            console.log('已添加作者xxdz按钮');
        }
    }

    function mainCheck() {
        if (Date.now() - lastFullCheckTime < FULL_CHECK_INTERVAL) return;
        lastFullCheckTime = Date.now();

        autoSelectQuality();
        checkDanmuInput();
        removeCommentSection();
        removeRecommendList();
        removeVideoToolbarRight();
        removeTargetElement();
        UPintroduce();
        DeleteVideo();
        changeBackgroundColor();
        addCustomText();
        addOriginalVideoButton();
        addGitHubButton();
        addAuthorButton();
        removeVideoTagContainer(); // 新增：删除视频标签容器
        setTimeout(mainCheck, FULL_CHECK_INTERVAL);
    }

// 音频分析器功能（带示波器和优化效果）================================
    //ps:每一帧都可以独立保存成png镂空图片！
function startAudioVisualizer() {
    console.log('正在加载音频分析器...');
    const canvas = document.createElement('canvas');
    canvas.className = 'xxdz-audio-visualizer';
    canvas.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 320px;
        height: 140px;
        background: rgba(0,0,0,0.8);
        border-radius: 2px;
        z-index: 10000;
        box-shadow: 0 0 20px rgba(58,204,204,0.7);
        backdrop-filter: blur(5px);
        cursor: move;
        touch-action: none;
    `;
//↑部分参数说明书：
//background:背景透明度（最后的值）0.8
//border-radius:修改圆角为2px
//box-shadow://阴影（发光）：水平/垂直阴影偏移量，阴影模糊半径，阴影颜色RGB和透明度
//backdrop-filter:背景模糊度 5px

    // 拖动功能
    let isDragging = false;
    let startX = 0, startY = 0;
    let initialLeft = null, initialTop = null;

    const handleMouseDown = (e) => {
        isDragging = true;
        const rect = canvas.getBoundingClientRect();
        startX = e.clientX || e.touches[0].clientX;
        startY = e.clientY || e.touches[0].clientY;
        initialLeft = rect.left;
        initialTop = rect.top;
        canvas.style.transition = 'none';
        e.preventDefault();
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;
        const currentX = e.clientX || e.touches[0].clientX;
        const currentY = e.clientY || e.touches[0].clientY;

        const deltaX = currentX - startX;
        const deltaY = currentY - startY;

        let newLeft = initialLeft + deltaX;
        let newTop = initialTop + deltaY;

        // 网页边界检查
        newLeft = Math.max(0, Math.min(window.innerWidth - canvas.offsetWidth, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - canvas.offsetHeight, newTop));

        canvas.style.left = `${newLeft}px`;
        canvas.style.right = 'auto';
        canvas.style.top = `${newTop}px`;
    };

    const handleMouseUp = () => {
        isDragging = false;
        canvas.style.transition = 'all 0.3s ease';
        const rect = canvas.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;
    };

    // 事件监听
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('touchstart', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchend', handleMouseUp);

    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 140;

    // 增强的音频分析配置
    let audioContext, analyser, source;
    let isVisualizing = true;

    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048; // 更高的频率分辨率
            analyser.smoothingTimeConstant = 0.4; // 更灵敏的响应
            analyser.minDecibels = -90;
            analyser.maxDecibels = -10;
        }

        const video = document.querySelector('video');
        if (video && !source) {
            source = audioContext.createMediaElementSource(video);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
        }
    }

    function draw() {
        if (!isVisualizing) return;

        // 获取双通道数据
        const freqData = new Uint8Array(analyser.frequencyBinCount);
        const waveData = new Uint8Array(analyser.fftSize);
        analyser.getByteFrequencyData(freqData);
        analyser.getByteTimeDomainData(waveData);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制示波器（上半部分）
        ctx.beginPath();
        ctx.strokeStyle = '#00FF9D'; // 线条的颜色
        ctx.lineWidth = 1.5;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#39C5BB'; // 线条发的光颜色（初音未来应援色）
        for (let i = 0; i < waveData.length; i++) {
            const x = (i / waveData.length) * canvas.width;
            const y = (1 - waveData[i] / 255) * 60 + 10; // 顶部区域
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        }
        ctx.stroke();

// 绘制频谱（下半部分）- 修改为贴合底边
const barCount = 128; // 更多频段
const barWidth = canvas.width / barCount;
for (let i = 0; i < barCount; i++) {
    const value = freqData[Math.floor(i * 1.5)]; // 增强高频响应
    const height = (value / 255) * 100; // *的值是幅度
    const y = canvas.height - height; // 距离窗口底部的大小 - 修改为从底部开始

    // 微小渐变效果 - 从#66ccff到透明，渐变程度0.2%
    const gradient = ctx.createLinearGradient(0, y, 0, y + height);
    gradient.addColorStop(0, '#66ccff'); // 顶部颜色（天依应援色）
    gradient.addColorStop(0.5, 'transparent'); // 0.5%位置开始渐变到透明

    ctx.fillStyle = gradient;
    ctx.fillRect(
        i * barWidth + 2,
        y,
        barWidth - 4,
        height
    );
}
        // 频段标识（带发光效果）
        ctx.shadowBlur = 8; // 文字发光模糊度
        ctx.shadowColor = 'rgba(255,255,255,0.5)'; // 发光颜色透明度
        ctx.fillStyle = '#FFF';
        ctx.font = 'bold 13px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('高', canvas.width / 4, canvas.height - 15);
        ctx.fillText('♪（>ω<*）', canvas.width / 2, canvas.height - 15);
        ctx.fillText('低', canvas.width * 3 / 4, canvas.height - 15);
    }

    // 60FPS动画循环
    function animate() {
        draw();
        if (isVisualizing) requestAnimationFrame(animate);
    }

    // 自动初始化
    const initVisualizer = () => {
        initAudioContext();
        animate();
    };

    // 视频检测
    new MutationObserver((mutations) => {
        if (document.querySelector('video')) {
            if (!audioContext) initVisualizer();
        }
    }).observe(document.body, { childList: true, subtree: true });

    // 初始检测
    if (document.querySelector('video')) initVisualizer();
}
    // 启动页面加载检测
    waitForPageLoad();
})();
