// ==UserScript==
// @name         手機視頻腳本 (iPhone Safari版)
// @description  原腳本為【俺的手機視頻腳本】。修改為更適合iPhone Safari瀏覽器使用，新增0~10倍速播放功能。
// @author       酷安：lying_flat，原腳本作者： shopkeeperV
// @namespace    https://greasyfork.org/users/1304874
// @version      1.8.3-fork-0.2-iphone
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/533289/%E6%89%8B%E6%A9%9F%E8%A6%96%E9%A0%BB%E8%85%B3%E6%9C%AC%20%28iPhone%20Safari%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533289/%E6%89%8B%E6%A9%9F%E8%A6%96%E9%A0%BB%E8%85%B3%E6%9C%AC%20%28iPhone%20Safari%E7%89%88%29.meta.js
// ==/UserScript==
/*jshint esversion: 8*/

/**
 * @param {HTMLVideoElement} video
 * @param {HTMLDivElement} container */
function addSpeedControl(video, container) {
    'use strict';

    // 修改為更適合iPhone的樣式
    const open = {
        container: `margin: 0; padding: 0;
width: 50px;
border-radius: 8px;
position: fixed;
top: 50%;
left: 10px;
transform: translateY(-50%);
z-index: 999999;
height: 60vh;
background-color: rgba(255,255,255,0.9);
white-space: collapse nowrap;
border-radius: 8px;
box-shadow: 0 0 10px rgba(0,0,0,0.3);`, // 添加陰影效果
        toggle: `margin: 0; padding: 0;
width: 100%;
height: 40px;
font-size: 18px;
text-align: center;
color: black;
display: block;
font-weight: bold;`, // 加大字體
        range: `margin: 0; padding: 0;
width: 100%;
height: calc(60vh - 90px);
appearance: slider-vertical;
writing-mode: vertical-lr;
direction: rtl;
display: block`,
        reset: `margin: 10px auto; padding: 0;
width: 40px;
height: 40px;
display: block;
background-color: rgba(0,0,0,0.1);
border-radius: 50%;`, // 圓形按鈕
    };

    const close = {
        container: `margin: 0; padding: 0; 
width: 50px;
border-radius: 8px;
position: fixed;
top: 20px;
left: 10px;
z-index: 999999;
max-height: 50px;
background-color: rgba(0,0,0,0.25);`,
        toggle: `margin: 0; padding: 0;
width: 100%;
font-size: 18px;
text-align: center;
height: 50px;
color: white;
background-color: rgba(0, 0, 0, 0.25);
border-radius: 25px;
box-sizing: border-box;
font-weight: bold;`, // 加大字體
        range: `margin: 0; padding: 0;
display: none;`,
        reset: `margin: 0; padding: 0;
display: none;`,
    };

    // 使用更明顯的圖標
    const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>';
    
    // 修改HTML結構
    const html = `<button class="toggle" type="button">×1.0</button>
<input class="range" type="range" name="speed" value="10" step="1" min="0" max="100" defaultValue="10" orient="vertical" />
<button class="reset" type="button">${svg}</button>`;

    /**
     * @param {HTMLVideoElement} video
     * @param {HTMLDivElement} container */
    addSpeedControl = (video, container) => {
        container.classList.add('close');
        container.insertAdjacentHTML('beforeend', html);
        
        // 獲取元素
        const toggleButton = container.querySelector('.toggle');
        const rangeInput = container.querySelector('.range');
        const resetButton = container.querySelector('.reset');

        container.style.cssText = close.container;
        toggleButton.style.cssText = close.toggle;
        rangeInput.style.cssText = close.range;
        resetButton.style.cssText = close.reset;

        // 設置播放速率
        function updatePlaybackRate(event) {
            const value = parseInt(rangeInput.value);
            video.playbackRate = value / 10;
            toggleButton.innerHTML = valueToString(value);
            event.stopPropagation();
        }

        // 重置播放速率
        function resetPlaybackRate(event) {
            video.playbackRate = 1;
            toggleButton.innerHTML = '×1.0';
            rangeInput.value = 10;
            event.stopPropagation();
        }

        // 綁定事件 - 修改為更適合觸摸的事件處理
        toggleButton.addEventListener('click', (event) => {
            container.classList.toggle('close');
            const css = container.classList.contains('close') ? close : open;
            container.style.cssText = css.container;
            toggleButton.style.cssText = css.toggle;
            rangeInput.style.cssText = css.range;
            resetButton.style.cssText = css.reset;
            event.stopPropagation();
        });
        
        // 添加觸摸事件支持
        rangeInput.addEventListener('touchstart', (e) => e.stopPropagation());
        rangeInput.addEventListener('touchmove', (e) => e.stopPropagation());
        rangeInput.addEventListener('input', updatePlaybackRate);
        rangeInput.addEventListener('change', updatePlaybackRate);
        
        resetButton.addEventListener('touchend', resetPlaybackRate);
        resetButton.addEventListener('click', resetPlaybackRate);
    };
    
    function valueToString(v) {
        if (v == 0) return '⏸';
        const r = v % 10;
        if (r == 0) return `×${v/10}.0`;
        return `×${(v-r)/10}.${r}`;
    }

    // 首次調用
    addSpeedControl(video, container);
}

(function () {
    'use strict';
    
    // 檢測是否為iPhone Safari
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
    
    // 去除未使用框架的視頻的原生全屏按鈕
    let videos = document.getElementsByTagName('video');
    for (let video of videos) {
        if (video.controls) {
            video.controlsList = ['nofullscreen'];
            // 針對iOS Safari添加playsinline屬性
            if (isIOS) {
                video.setAttribute('playsinline', 'true');
                video.setAttribute('webkit-playsinline', 'true');
            }
        }
    }
    
    // 放開iframe全屏
    let iframes = document.getElementsByTagName('iframe');
    for (let iframe of iframes) {
        iframe.allowFullscreen = true;
        iframe.allow = 'fullscreen';
    }
    
    // 部分網站阻止視頻操作層觸摸事件傳播，需要指定監聽目標，默認是document
    let listenTarget = document;
    
    // YouTube使用無刷新網頁，需要監聽地址變化重新監聽操控層
    if (window.location.host === 'm.youtube.com') {
        let refresh = function () {
            console.log('手機視頻腳本：頁面刷新...');
            if (window.location.href.search('watch') >= 0) {
                let waitForVideo = function () {
                    console.log('手機視頻腳本：正在獲取視頻...');
                    let videos = document.getElementsByTagName('video');
                    let listenTargetArray = document.getElementsByClassName('player-controls-background');
                    if (videos.length > 0) {
                        let video = videos[0];
                        if (video.readyState > 1 && !video.paused && !video.muted) {
                            listenTarget = listenTargetArray[0];
                            if (listenTarget.getAttribute('me_video_js')) {
                                return;
                            }
                            listenTarget.setAttribute('me_video_js', 'me_video_js');
                            console.log('手機視頻腳本：開始監聽手勢。');
                            listen();
                            return;
                        }
                    }
                    setTimeout(waitForVideo, 500);
                };
                waitForVideo();
            }
        };
        refresh();
        
        if (/xmonkey|tampermonkey/i.test(GM_info.scriptHandler)) {
            window.addEventListener('urlchange', refresh);
        } else {
            const originalPushState = history.pushState;
            const originalReplaceState = history.replaceState;
            history.pushState = function (state) {
                originalPushState.apply(history, arguments);
                console.log('監聽到地址變化。pushState()調用。');
                setTimeout(refresh, 500);
            };
            history.replaceState = function (state) {
                originalReplaceState.apply(history, arguments);
                console.log('監聽到地址變化，replaceState()調用。');
                setTimeout(refresh, 500);
            };
        }
    }
    
    // 通用監聽
    listen();
    
    if (window === top) {
        if (GM_getValue('voiced') == null) {
            GM_setValue('voiced', true);
        }
        if (GM_getValue('speed') == null) {
            GM_setValue('speed', true);
        }
        let diyConfig = function (configName, key) {
            GM_registerMenuCommand(configName, () => {
                let value = GM_getValue(key);
                GM_setValue(key, !value);
                alert(`成功設置為${!value}，頁面將刷新。`);
                window.location.reload();
            });
        };
        diyConfig('啟用/關閉【觸摸視頻時取消靜音】', 'voiced');
        diyConfig('顯示/隱藏【播放速度調整按鈕】', 'speed');
    }

    function listen() {
        if (listenTarget.tagName) {
            listenTarget.setAttribute('listen_mark', true);
        }
        
        // 修改觸摸事件處理以更好地支持iPhone
        listenTarget.addEventListener('touchstart', (e) => {
            if (e.touches.length !== 1) return;
            
            let startX = e.touches[0].clientX;
            let startY = e.touches[0].clientY;
            let endX = startX;
            let endY = startY;
            
            let videoElement;
            let target = e.target;
            let biggestContainer;
            let targetWidth = target.clientWidth;
            let targetHeight = target.clientHeight;
            let suitParents = [];
            let allParents = [];
            let temp = target;
            let findAllSuitParent = false;
            let maybeTiktok = false;
            let scrollHeightOut = false;
            
            // 尋找合適的容器
            while (true) {
                temp = temp.parentElement;
                if (!temp) return;
                
                allParents.push(temp);
                if (!findAllSuitParent && temp.clientWidth > 0 && temp.clientWidth < targetWidth * 1.2 && temp.clientHeight > 0 && temp.clientHeight < targetHeight * 1.2) {
                    if (document.fullscreenElement) {
                        suitParents.push(temp);
                    } else {
                        if (temp.scrollHeight < targetHeight * 1.2) {
                            suitParents.push(temp);
                        } else {
                            findAllSuitParent = true;
                            scrollHeightOut = true;
                        }
                    }
                }
                
                if (temp.tagName === 'BODY' || temp.tagName === 'HTML' || !temp.parentElement) {
                    if (suitParents.length > 0) {
                        biggestContainer = suitParents[suitParents.length - 1];
                    } else if (target.tagName !== 'VIDEO') {
                        return;
                    }
                    suitParents = null;
                    break;
                }
            }
            
            // 尋找視頻元素
            if (target.tagName !== 'VIDEO') {
                let videoArray = biggestContainer.getElementsByTagName('video');
                if (videoArray.length > 0) {
                    videoElement = videoArray[0];
                    if (!document.fullscreenElement && top === window && !videoElement.controls && scrollHeightOut && target.clientHeight > window.innerHeight * 0.8) {
                        maybeTiktok = true;
                    }
                    if (!maybeTiktok && targetHeight > videoElement.clientHeight * 1.5) {
                        return;
                    }
                    if (videoArray.length > 1) {
                        console.log('觸摸位置找到不止一個視頻。');
                    }
                } else {
                    return;
                }
            } else {
                videoElement = target;
            }
            
            let playing = !videoElement.paused;
            let sampleVideo = false;
            let videoReady = false;
            let videoReadyHandler = function () {
                videoReady = true;
                if (videoElement.duration < 30) {
                    sampleVideo = true;
                }
            };
            
            if (videoElement.readyState > 0) {
                videoReadyHandler();
            } else {
                videoElement.addEventListener('loadedmetadata', videoReadyHandler, { once: true });
            }
            
            let componentContainer = findComponentContainer();
            let notice;
            let timeChange = 0;
            let direction;
            
            // 針對iOS優化
            makeTagAQuiet();
            if (!videoElement.getAttribute('disable_contextmenu')) {
                videoElement.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });
                videoElement.setAttribute('disable_contextmenu', true);
            }
            
            if (target.tagName === 'IMG') {
                target.draggable = false;
                if (!target.getAttribute('disable_contextmenu')) {
                    target.addEventListener('contextmenu', (e) => {
                        e.preventDefault();
                    });
                    target.setAttribute('disable_contextmenu', true);
                }
            }
            
            // 修改樣式以更適合iPhone
            let sharedCSS = 'border-radius:8px;z-index:99999;opacity:0.8;background-color:rgba(0,0,0,0.7);color:white;' + 
                          'display:flex;justify-content:center;align-items:center;text-align:center;user-select:none;' +
                          'font-size:16px;font-weight:bold;';
            
            let haveControls = videoElement.controls;
            let longPress = false;
            let rateTimer = setTimeout(() => {
                videoElement.playbackRate = 4;
                videoElement.controls = false;
                target.removeEventListener('touchmove', touchmoveHandler);
                notice.innerText = 'x4';
                notice.style.display = 'flex';
                longPress = true;
                rateTimer = null;
                
                if (!document.fullscreenElement || videoElement.readyState === 0 || !GM_getValue('speed')) {
                    return;
                }
                
                {
                    let containers = componentContainer.getElementsByClassName('me-speed-container');
                    let container;
                    if (containers.length > 0) {
                        container = containers[0];
                        container.style.display = 'block';
                    } else {
                        container = document.createElement('div');
                        container.className = 'me-speed-container';
                        try {
                            addSpeedControl(videoElement, container);
                        } catch (error) {
                            console.error(`addSpeedControl函數運行出錯：${error}`);
                        }
                        componentContainer.appendChild(container);
                    }
                    
                    target.addEventListener('touchstart', () => {
                        container.style.display = 'none';
                    }, { once: true });
                    
                    window.addEventListener('resize', () => {
                        container.style.display = 'none';
                    }, { once: true });
                }
            }, 800);
            
            let screenWidth = screen.width;
            let componentMoveLeft = componentContainer.offsetLeft;
            let moveNum = Math.floor((componentMoveLeft * 1.1) / screenWidth);
            
            // 添加指示器元素
            let notices = componentContainer.getElementsByClassName('me-notice');
            if (notices.length === 0) {
                notice = document.createElement('div');
                notice.className = 'me-notice';
                let noticeWidth = 120;
                let noticeTop = Math.round(componentContainer.clientHeight / 6);
                let noticeLeft = Math.round(moveNum * screenWidth + componentContainer.clientWidth / 2 - noticeWidth / 2);
                notice.style.cssText = sharedCSS + 'position:absolute;display:none;letter-spacing:normal;';
                notice.style.width = noticeWidth + 'px';
                notice.style.height = '40px'; // 加大高度
                notice.style.left = noticeLeft + 'px';
                notice.style.top = noticeTop + 'px';
                componentContainer.appendChild(notice);
                
                window.addEventListener('resize', () => {
                    notice.remove();
                }, { once: true });
            } else {
                notice = notices[0];
            }
            
            // 修改為更適合觸摸的事件處理
            target.addEventListener('touchmove', touchmoveHandler, { passive: false });
            target.addEventListener('touchend', touchendHandler, { once: true });

            function makeTagAQuiet() {
                for (let element of allParents) {
                    if (element.tagName === 'A' && !element.getAttribute('disable_menu_and_drag')) {
                        element.addEventListener('contextmenu', (e) => {
                            e.preventDefault();
                        });
                        element.draggable = false;
                        element.setAttribute('disable_menu_and_drag', true);
                        element.target = '_blank';
                        break;
                    }
                }
                allParents = null;
            }

            function findComponentContainer() {
                let temp = videoElement;
                while (true) {
                    if (temp.parentElement.clientWidth > 0 && temp.parentElement.clientHeight > 0) {
                        return temp.parentElement;
                    } else {
                        temp = temp.parentElement;
                    }
                }
            }

            function getClearTimeChange(timeChange) {
                timeChange = Math.abs(timeChange);
                let minute = Math.floor(timeChange / 60);
                let second = timeChange % 60;
                return (minute === 0 ? '' : minute + '分') + second + '秒'; // 改為中文顯示
            }

            function touchmoveHandler(moveEvent) {
                if (rateTimer) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
                
                if (maybeTiktok || sampleVideo || !videoReady) {
                    return;
                }
                
                moveEvent.preventDefault();
                if (moveEvent.touches.length === 1) {
                    let temp = Math.ceil(moveEvent.touches[0].clientX);
                    if (temp === endX) {
                        return;
                    } else {
                        endX = temp;
                    }
                    endY = Math.ceil(moveEvent.touches[0].screenY);
                }
                
                // 增加觸摸靈敏度
                if (endX > startX + 20) {
                    if (!direction) {
                        direction = 1;
                    }
                    if (direction === 1) {
                        timeChange = endX - startX - 20;
                    } else {
                        timeChange = 0;
                    }
                } else if (endX < startX - 20) {
                    if (!direction) {
                        direction = 2;
                    }
                    if (direction === 2) {
                        timeChange = endX - startX + 20;
                    } else {
                        timeChange = 0;
                    }
                } else if (timeChange !== 0) {
                    timeChange = 0;
                } else {
                    return;
                }
                
                if (notice.style.display === 'none' && Math.abs(endY - startY) > Math.abs(endX - startX)) {
                    timeChange = 0;
                    return;
                }
                
                if (direction) {
                    notice.style.display = 'flex';
                    notice.innerText = (direction === 1 ? '快進' : '快退') + getClearTimeChange(timeChange);
                }
            }

            function touchendHandler() {
                if (notice) notice.style.display = 'none';
                
                if (GM_getValue('voiced')) {
                    videoElement.muted = false;
                }
                
                setTimeout(() => {
                    if (playing && videoElement.paused && !maybeTiktok) {
                        videoElement.play().catch(e => console.log('播放失敗:', e));
                    }
                }, 200);
                
                if (!longPress && videoElement.controls && !document.fullscreenElement) {
                    let btns = componentContainer.getElementsByClassName('me-fullscreen-btn');
                    let btn;
                    if (btns.length === 0) {
                        btn = document.createElement('div');
                        btn.style.cssText = sharedCSS + 'position:absolute;width:60px;padding:5px;font-size:16px;' + 
                                          'box-sizing:border-box;border:2px solid white;white-space:normal;';
                        btn.innerText = '全屏';
                        btn.className = 'me-fullscreen-btn';
                        let divHeight = 50;
                        btn.style.height = divHeight + 'px';
                        btn.style.top = Math.round(componentContainer.clientHeight / 2 - divHeight / 2 - 10) + 'px';
                        btn.style.left = Math.round(moveNum * screenWidth + (componentContainer.clientWidth * 5) / 7) + 'px';
                        componentContainer.append(btn);
                        
                        btn.addEventListener('touchstart', async function (e) {
                            e.stopPropagation();
                            btn.style.display = 'none';
                            try {
                                await componentContainer.requestFullscreen();
                            } catch (err) {
                                console.log('全屏失敗:', err);
                            }
                        });
                        
                        videoElement.controlsList = ['nofullscreen'];
                    } else {
                        btn = btns[0];
                        btn.style.display = 'flex';
                    }
                    
                    setTimeout(() => {
                        if (btn) btn.style.display = 'none';
                    }, 2000);
                }
                
                if (endX === startX) {
                    if (rateTimer) {
                        clearTimeout(rateTimer);
                    }
                    if (longPress) {
                        videoElement.controls = haveControls;
                        videoElement.playbackRate = 1;
                    }
                } else {
                    if (timeChange !== 0) {
                        videoElement.currentTime += timeChange;
                    }
                }
                
                target.removeEventListener('touchmove', touchmoveHandler);
            }
        });
    }

    // 全屏橫屏模塊 - 針對iOS優化
    window.tempLock = screen.orientation.lock;
    let myLock = function () {
        console.log('網頁自帶js試圖執行lock()');
    };
    screen.orientation.lock = myLock;
    
    if (top === window) {
        GM_setValue('doLock', false);
        GM_addValueChangeListener('doLock', async function (key, oldValue, newValue) {
            if (document.fullscreenElement && newValue) {
                try {
                    screen.orientation.lock = window.tempLock;
                    if (!isIOS) { // iOS不支持orientation.lock
                        await screen.orientation.lock('landscape');
                    }
                    screen.orientation.lock = myLock;
                    GM_setValue('doLock', false);
                } catch (e) {
                    console.log('鎖定方向失敗:', e);
                }
            }
        });
    }
    
    let inTimes = 0;
    window.addEventListener('resize', () => {
        setTimeout(fullscreenHandler, 500);
    });

    function fullscreenHandler() {
        let _fullscreenElement = document.fullscreenElement;
        if (_fullscreenElement) {
            if (_fullscreenElement.tagName === 'IFRAME') {
                return;
            }
            inTimes++;
        } else if (inTimes > 0) {
            inTimes = 0;
        } else {
            return;
        }
        
        if (inTimes !== 1) {
            return;
        }
        
        let videoElement;
        if (_fullscreenElement.tagName !== 'VIDEO') {
            let videoArray = _fullscreenElement.getElementsByTagName('video');
            if (videoArray.length > 0) {
                videoElement = videoArray[0];
                if (videoArray.length > 1) {
                    console.log('全屏元素內找到不止一個視頻。');
                }
            }
        } else {
            videoElement = _fullscreenElement;
        }
        
        if (videoElement) {
            let changeHandler = function () {
                if (videoElement.videoHeight < videoElement.videoWidth && !isIOS) {
                    GM_setValue('doLock', true);
                }
            };
            
            if (videoElement.readyState < 1) {
                videoElement.addEventListener('loadedmetadata', changeHandler, { once: true });
            } else {
                changeHandler();
            }
        }
    }
})();