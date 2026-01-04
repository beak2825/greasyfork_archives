// ==UserScript==
// @name         国开大学视频网课，一网一平台自动化脚本
// @namespace    https://github.com/ijinfeng/jp_video
// @version      1.1
// @description  国开大学网课一网一平台视频自动化播放，快进，解放你的双手🔥支持最高16倍倍速播放，播完后自动播放下一集
// @author       jinfeng
// @match        *://menhu.pt.ouchn.cn/*
// @match        *://lms.ouchn.cn/course/*
// @license      GPL License
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.
// @grant        GM_addStyle
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/466486/%E5%9B%BD%E5%BC%80%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E7%BD%91%E8%AF%BE%EF%BC%8C%E4%B8%80%E7%BD%91%E4%B8%80%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466486/%E5%9B%BD%E5%BC%80%E5%A4%A7%E5%AD%A6%E8%A7%86%E9%A2%91%E7%BD%91%E8%AF%BE%EF%BC%8C%E4%B8%80%E7%BD%91%E4%B8%80%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {
    // 通过脚本点击开始播放
    let startPlay = false;
    // 当前的播放对象(视频专题)
    let currentPlayObj = null;
    // 最高播放速率
    const kHighestRate = 16.0;

    function readTitleFromItem(item) {
        if (!item) return null;
        let title = item.querySelector('.activity-title')
        let span = title.querySelector('span')
        let distitle = span.getAttribute('original-title')
        return distitle;
    }

    function isVideo(item) {
        const icon = item.getElementsByClassName('full-screen-activity-icon')[0];
        const ot = icon.getAttribute('original-title');
        // console.log(`- ${ot}`);
        return ot === '音视频教材';
    }

    /// 寻找当前打开的专题
    /// @param selected: 播放选中,否则播放最新的
    function findCurrentOpenedTopic(selected) {
        let currentItem = null;
        let nextItem = null;
        let targetIndex = undefined;
        let items = document.getElementsByClassName('activity ng-scope') // 选中：activity ng-scope active
        // let items = document.getElementsByClassName('activity-menu-item')
        let videoItems = []
        for (const item of items) {
            if (isVideo(item) == false) {
                continue;
            }
            videoItems.push(item)
        }
        if (videoItems.length == 0) {
            console.log("Can't find any video item, you should select a special topic first!");
            return;
        }
        let findedTarget = false;
        for (let index = 0; index < videoItems.length; index++) {
            const item = videoItems[index];
            currentItem = nextItem;
            nextItem = item;
            const isActive = item.classList.contains('active');
            let distitle = readTitleFromItem(item);
            console.log(`+ ${distitle}|${isActive}`);
            if (distitle) {
                // find lock
                if (selected) {
                    if (isActive) {
                        findedTarget = true;
                        targetIndex = index;
                        break;
                    }
                } else {
                    let lock = item.querySelector('.is-locked');
                    if (lock) {
                        findedTarget = true;
                        targetIndex = index - 1;
                        break
                    }
                }
            }
        }
        if (findedTarget) {
            if (targetIndex == undefined) {
                targetIndex = videoItems.length - 1;
            }
            currentItem = videoItems[targetIndex];
            if (targetIndex < videoItems.length - 1) {
                nextItem = videoItems[targetIndex+1];
            }
            console.log(`💪 Successfully find the video at index: ${targetIndex} that you want to play!`);
            console.log(`Current title of video is ${readTitleFromItem(currentItem)}`);
        } else {
            console.log('Failed find the video in curren topic scope.');
            return null;
        }
        if (targetIndex >= videoItems.length) {
            console.log('There are no more videos to play!');
        } else {
            console.log(`The next video is ${readTitleFromItem(nextItem)}`);
        }
        return {
            current: currentItem,
            items: videoItems,
            index: targetIndex
        };
    }

    function logCurrentPlayObj() {
        if (!currentPlayObj) {
            console.log('👀 Current video topic is empty.');
            return;
        }
        console.log(`🖨️ Video items count: ${currentPlayObj.items.length}, index: ${currentPlayObj.index}, curTtitle: ${readTitleFromItem(currentPlayObj.current)}`);
    }

    function selectedTargetItemAt(index) {
        if (!index || !currentPlayObj) {
            console.log('Target item is empty!');
            return;
        }
        if (index > currentPlayObj.items.length - 1) {
            console.log(`The target index: ${index} out of bounds: {0, ${currentPlayObj.items.length}}`);
            return;
        }
        currentPlayObj.index = index;
        const item = currentPlayObj.items[index];
        currentPlayObj.current = item;

        let clickEvent = new Event('click');
        item.querySelector('.activity-menu-item').dispatchEvent(clickEvent);

        console.log(`Auto select video item named: ${readTitleFromItem(item)}`);
    }

    function playEnded() {
        console.log(`play end - [${currentPlayObj.index}, ${currentPlayObj.items.length}]`);
        if (isLastOne(currentPlayObj)) {
            console.log('There are no more videos in playlist.');
            alert('There are no more videos in playlist.');
            startPlay = false;
            return;
        }
        // hover
        let nextItem = getNextPlayItem(currentPlayObj);
        console.log(`Ready to find next video named: ${readTitleFromItem(nextItem)}`);
        // 先检查下是否存在锁
        const isExsitLock = exsitLock(nextItem);
        if (isExsitLock) {
            console.log('Find a lock in this video item, try remove it.');
            tryRemoveLock(nextItem);
            console.log('🚌 Wait 1 second to continue...');
            let t = setTimeout(() => {
                console.log('OK, start the next step!');
                selectedTargetItemAt(currentPlayObj.index + 1);
                startPlayVideo();
                logCurrentPlayObj();
                clearTimeout(t);
            }, 1000);
        } else {
            selectedTargetItemAt(currentPlayObj.index + 1);
            startPlayVideo();
            logCurrentPlayObj();
        }
    }

    function exsitLock(item) {
        let lock = item.querySelector('.is-locked');
        return lock != undefined || lock != null;
    }

    function startPlayVideo() {
        if (!currentPlayObj) return;
        isElementLoaded('.mvp-toggle-play').then(() => {
            let playBtn = document.querySelector(".mvp-toggle-play");
            let clickEvent = new Event('click');
            playBtn.dispatchEvent(clickEvent);

            isElementLoaded('video').then(() => {
                let video = document.querySelector('video');
                video.currentTime = 0;
                video.playbackRate = currentPlayObj.playrate;
                video.play();
                video.removeEventListener('ended', playEnded);
                video.addEventListener('ended', playEnded);
            });
        });
    }

    // 继续播放，这种情况一般是失去焦点导致的
    function resumePlayer() {
        console.log('resume player');
        isElementLoaded('.mvp-toggle-play').then(() => {
            isElementLoaded('video').then(() => {
                let video = document.querySelector('video');
                console.log(`Find video player is paused: ${video.paused}, rate: ${video.playbackRate}`);
                if (!video.paused) {
                    return;
                }
                let playBtn = document.querySelector(".mvp-toggle-play");
                let clickEvent = new Event('click');
                playBtn.dispatchEvent(clickEvent);
                if (!video.paused) {
                    return;
                }
                video.play();     
            });
        });
    }

    // Element loaded
    const isElementLoaded = async selector => {
        while (document.querySelector(selector) === null) {
            await new Promise(resolve => requestAnimationFrame(resolve))
        }
        return document.querySelector(selector);
    };

    function isLastOne(playObj) {
        return playObj.index >= playObj.items.length - 1;
    }

    function getNextPlayItem(playObj) {
        if (!playObj) return null;
        if (isLastOne(playObj)) return null;
        return playObj.items[playObj.index + 1];
    }

    function setNextPlayItemReady(playObj) {
        if (!playObj) return null;
        if (isLastOne(playObj)) return null;
        playObj.index++;
        playObj.current = playObj.items[playObj.index];
    }

    function tryRemoveLock(item) {
        let locks = item.querySelectorAll('.right');
        for (const lock of locks) {
            if (lock) {
                lock.innerHTML = "";
            }
        }
    }

    /// 用户交互界面
    function createUserInterface() {
        let box = document.createElement('div');
        box.className = 'jp-box';
        box.innerHTML = `
        <p class="jp-title">国开网课脚本</p>
        <label class="jp-rate-label">
            播放速率: 
            <input type="text" value="16" class="jp-rate-input">
        </label>
        <button class="jp-play-btn" id="jp-play1">从最新项开始播放</button>
        <button class="jp-play-btn" id="jp-play2">从选中项开始播放</button>
        <button class="jp-play-btn" id="jp-play-stop">停止运行脚本</button>
        `
        document.body.appendChild(box);
        setUserCss()

        const playBtn1 = document.querySelector('#jp-play1');
        playBtn1.onclick = userClickStartPlayByNew;

        const playBtn2 = document.querySelector('#jp-play2');
        playBtn2.onclick = userClickStartPlayBySelected;

        const playStopBtn = document.querySelector('#jp-play-stop');
        playStopBtn.onclick = userClickStopRunScript;
    }

    function setUserCss() {
        let css = `
        .jp-box {
            position: fixed;
            right: 30px;
            bottom: 100px;
            width: 140px;
            height: 160px;
            display: flex;
            flex-direction: column;
            align-items: center !important;
            justify-content: center !important;
            background-color: #f4f5f6;
            border-radius: 8px;
            font-size: 12px !important;
            text-align: center !important;
            border: 1px solid #999;
            overflow: hidden;
            z-index: 10;
        }

        .jp-title {
            color: #333333;
            line-height: 30px !important;
            background-color: antiquewhite;
            width: 100%;
            margin: 0;
            text-align: center;
        }

        .jp-rate-label {
            margin-top: 6px;
            margin-bottom: 6px;
        }

        .jp-rate-input {
            width: 40px !important;
            height: 25px !important;
            display: inline-block !important;
            background-color: rgb(185, 226, 226) !important;
        }

        .jp-play-btn {
            font-size: 12px !important;
            height: 20px;
            line-height: 20px;
            padding: 0 16px;
            margin-bottom: 5px;
        }
        `
        GM_addStyle(css)
    }

    function userClickStartPlayByNew() {
        const state = userReadyClickPlayVideo();
        isElementLoaded('video').then(() => {
            console.log('Video is loaded!');
            let playObj = findCurrentOpenedTopic();
            if (!playObj) {
                userClickStopRunScript();
                return;
            }
            currentPlayObj = playObj;
            playObj.playrate = state.rate;
            selectedTargetItemAt(playObj.index);
            startPlayVideo();
        })
    }

    function userClickStartPlayBySelected() {
        const state = userReadyClickPlayVideo();
        isElementLoaded('video').then(() => {
            console.log('Video is loaded!');
            let playObj = findCurrentOpenedTopic(true);
            if (!playObj) {
                userClickStopRunScript();
                return;
            }
            currentPlayObj = playObj;
            playObj.playrate = state.rate;
            selectedTargetItemAt(playObj.index);
            startPlayVideo();
        })
    }

    function userReadyClickPlayVideo() {
        startPlay = true;
        let rate = document.querySelector('.jp-rate-input').value;
        if (rate > kHighestRate) {
            rate = kHighestRate;
            console.log(`The highest playback rate is ${kHighestRate}`);
        }
        console.log(`On click play video with playrate: ${rate}`);
        listenBlur();
        return {
            rate: rate
        };
    }

    function userClickStopRunScript() {
        console.log('Stop run jp_script');
        startPlay = false;
        isElementLoaded('video').then(() => {
            let video = document.querySelector('video');
            video.removeEventListener('ended', playEnded);
        });
    }

    function listenBlur() {
        console.log('Start listen focus/blur events');
        unsafeWindow.onblur = function () {
            if (startPlay) {
                resumePlayer();
            }
        }
    }

    console.log('Welcome to use ef_video script!');
    // 创建用户界面
    createUserInterface();
})();