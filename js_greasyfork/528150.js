// ==UserScript==
// @name                自用手机视频脚本（百分比滑动）
// @description         原脚本为【俺的手机视频脚本】。方便自用新增了百分比滑动（根据视频总时长动态调节滑动距离与跳转时长的比例关系）。内置两种滑动模式：百分比滑动和固定灵敏度滑动，两者只能同时启用其中一种。
// @version      1.8.10-merged
// @author       tcch
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @namespace https://greasyfork.org/users/992160
// @downloadURL https://update.greasyfork.org/scripts/528150/%E8%87%AA%E7%94%A8%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%88%E7%99%BE%E5%88%86%E6%AF%94%E6%BB%91%E5%8A%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528150/%E8%87%AA%E7%94%A8%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC%EF%BC%88%E7%99%BE%E5%88%86%E6%AF%94%E6%BB%91%E5%8A%A8%EF%BC%89.meta.js
// ==/UserScript==
/*jshint esversion: 8*/
(function () {
    'use strict';
    let mutationTimer;
    // 获取 video 与 iframe 的实时集合
    let videos = document.getElementsByTagName("video");
    let iframes = document.getElementsByTagName("iframe");
    let makeVideoAndIframeReady = function () {
        for (let video of videos) {
            if (video.controls) {
                video.controlsList = ["nofullscreen"];
                console.log("俺的手机视频脚本：已去除未使用框架视频的全屏按钮。");
            }
        }
        for (let iframe of iframes) {
            iframe.allowFullscreen = true;
        }
    };
    let mutationHandler = function (mutationsList) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName.toLowerCase() === 'video' || node.tagName.toLowerCase() === 'iframe') {
                            let _window = `${top === window ? "top" : "iframe"}>${location.host}`;
                            if (mutationTimer) {
                                clearTimeout(mutationTimer);
                                console.log(`俺的手机视频脚本：${_window}清除定时任务。`);
                            }
                            mutationTimer = setTimeout(() => {
                                mutationTimer = 0;
                                makeVideoAndIframeReady();
                                console.log(`俺的手机视频脚本：${_window}处理完成。`);
                            }, 1000);
                            console.log(`俺的手机视频脚本：${_window}页面新增${node.tagName.toLowerCase()}，1秒后处理。`);
                            return;
                        }
                    }
                }
            }
        }
    };
    makeVideoAndIframeReady();
    new MutationObserver(mutationHandler).observe(document.body, {childList: true, subtree: true});
    
    // 默认监听目标为 document
    let listenTarget = document;
    if (window.location.host === "m.youtube.com") {
        let listenTargetArray = document.getElementsByClassName("player-controls-background");
        let shortListenTargetArray = document.getElementsByClassName("reel-player-overlay-main-content");
        let refresh = function () {
            console.log("俺的手机视频脚本：页面刷新...");
            if (window.location.href.search("\/(watch|shorts)") >= 0) {
                let waitForVideo = function () {
                    console.log("俺的手机视频脚本：正在获取视频...");
                    if (videos.length > 0 && (listenTargetArray.length > 0 || shortListenTargetArray.length > 0)) {
                        let video = videos[0];
                        if (video.readyState > 1 && !video.paused && !video.muted) {
                            listenTarget = window.location.href.includes("watch") ? listenTargetArray[0] : shortListenTargetArray[0];
                            if (listenTarget.getAttribute("me_video_js")) {
                                console.log("俺的手机视频脚本：防止重复添加。");
                                return;
                            }
                            listenTarget.setAttribute("me_video_js", "me_video_js");
                            console.log("俺的手机视频脚本：开始监听手势。");
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
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        history.pushState = function (state) {
            originalPushState.apply(history, arguments);
            console.log("监听到地址变化，pushState()调用。");
            setTimeout(refresh, 500);
        };
        history.replaceState = function (state) {
            originalReplaceState.apply(history, arguments);
            console.log("监听到地址变化，replaceState()调用。");
            setTimeout(refresh, 500);
        };
    }
    listen();
    
    // 设置项：固定模式与百分比模式参数
    let settings = {
        voiced: true,
        speed: true,
        rate: 4,
        // 固定模式参数（原始）：
        sensitivity1: 3,
        sensitivity2: 0.2,
        threshold: 300,
        // 百分比模式参数（长短视频分类）：
        skipPercentLong: 60,
        skipPercentShort: 60,
        // 模式开关：true 为百分比模式，false 为固定模式
        usePercentage: true
    };
    for (let key in settings) {
        let value = GM_getValue(key);
        if (value === undefined) {
            GM_setValue(key, settings[key]);
        } else {
            settings[key] = value;
        }
    }
    if (window === top) {
        function registerBoolean(btnName, key) {
            GM_registerMenuCommand(btnName, () => {
                try {
                    GM_setValue(key, !settings[key]);
                    settings[key] = !settings[key];
                    alert(`成功切换为：${key==="usePercentage" ? (settings.usePercentage ? "百分比模式" : "固定模式") : (settings[key] ? "开启" : "关闭")}`);
                } catch (e) {
                    alert("浏览器bug捕获，请刷新页面后重试。\n" + e.message);
                }
            });
        }
        function registerInput(btnName, description, key, integer, minimum, maximum) {
            GM_registerMenuCommand(btnName, () => {
                let input = window.prompt(description, settings[key]);
                if (input === null) return;
                input = Number(input);
                if (input && input >= minimum && input <= maximum) {
                    if (integer && !Number.isInteger(input)) {
                        alert("要求整数！");
                        return;
                    }
                    try {
                        GM_setValue(key, input);
                        settings[key] = input;
                    } catch (e) {
                        alert("浏览器bug捕获，请刷新页面后重试。\n" + e.message);
                    }
                } else {
                    alert("输入错误！");
                }
            });
        }
        // 切换滑动模式命令
        GM_registerMenuCommand("切换滑动模式 (百分比模式/固定灵敏度模式)", () => {
            GM_setValue("usePercentage", !settings.usePercentage);
            settings.usePercentage = !settings.usePercentage;
            alert("滑动模式已切换为：" + (settings.usePercentage ? "百分比模式" : "固定灵敏度模式"));

        });
        registerBoolean("开关【触摸视频时取消静音】", "voiced");
        registerBoolean("开关【显示播放速度调整按钮】", "speed");
        registerInput("修改长按倍速数值", "请指定倍速，输入0-6的数字即可，可为小数。", "rate", false, 0, 6);
        // 固定模式参数
        registerInput("修改长视频滑动灵敏度", "默认为3，要求0-3之间。", "sensitivity1", false, 0, 3);
        registerInput("修改短视频滑动灵敏度", "默认为0.2，要求0-3之间。", "sensitivity2", false, 0, 3);
        registerInput("修改长短视频阈值", "默认300秒，要求0-36000之间。", "threshold", true, 0, 36000);
        // 百分比模式参数（长短视频分类）
        registerInput("修改长视频滑动百分比", "默认为60，有效范围0-100。", "skipPercentLong", false, 0, 100);
        registerInput("修改短视频滑动百分比", "默认为60，有效范围0-100。", "skipPercentShort", false, 0, 100);
    }
    
    // 辅助函数：格式化时间，若时长>=3600秒则显示为 HH:MM:SS，否则 MM:SS
    function formatTime(t) {
        if (isNaN(t) || t < 0) return "00:00";
        if (t >= 3600) {
            let hours = Math.floor(t / 3600);
            let minutes = Math.floor((t % 3600) / 60);
            let seconds = Math.floor(t % 60);
            return (hours < 10 ? "0" : "") + hours + ":" +
                   (minutes < 10 ? "0" : "") + minutes + ":" +
                   (seconds < 10 ? "0" : "") + seconds;
        } else {
            let minutes = Math.floor(t / 60);
            let seconds = Math.floor(t % 60);
            return (minutes < 10 ? "0" : "") + minutes + ":" +
                   (seconds < 10 ? "0" : "") + seconds;
        }
    }
    
    // 固定模式下的提示格式
    function getClearTimeChange(timeChange) {
        timeChange = Math.abs(timeChange);
        let minute = Math.floor(timeChange / 60);
        let second = timeChange % 60;
        return (minute === 0 ? "" : (minute + "min")) + second + "s";
    }
    
    function listen() {
        if (listenTarget.tagName) {
            listenTarget.setAttribute("listen_mark", true);
        }
        listenTarget.addEventListener("touchstart", (e) => {
            let startX, startY, endX, endY;
            if (e.touches.length === 1) {
                let screenX = e.touches[0].screenX;
                let screenY = e.touches[0].screenY;
                if (document.fullscreenElement) {
                    if (screenX < screen.width * 0.05 || screenX > screen.width * 0.95 ||
                        screenY < screen.height * 0.05 || screenY > screen.height * 0.95)
                        return;
                }
                startX = Math.ceil(e.touches[0].clientX);
                startY = Math.ceil(screenY);
                endX = startX;
                endY = startY;
            } else return;
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
            while (true) {
                temp = temp.parentElement;
                if (!temp) return;
                allParents.push(temp);
                if (!findAllSuitParent &&
                    temp.clientWidth > 0 &&
                    temp.clientWidth < targetWidth * 1.2 &&
                    temp.clientHeight > 0 &&
                    temp.clientHeight < targetHeight * 1.2) {
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
                if (temp.tagName === "BODY" || temp.tagName === "HTML" || !temp.parentElement) {
                    if (suitParents.length > 0) {
                        biggestContainer = suitParents[suitParents.length - 1];
                    } else if (target.tagName !== "VIDEO") {
                        return;
                    }
                    suitParents = null;
                    break;
                }
            }
            if (target.tagName !== "VIDEO") {
                let videoArray = biggestContainer.getElementsByTagName("video");
                if (videoArray.length > 0) {
                    videoElement = videoArray[0];
                    if (!document.fullscreenElement &&
                        top === window &&
                        !videoElement.controls &&
                        scrollHeightOut &&
                        target.clientHeight > window.innerHeight * 0.8) {
                        maybeTiktok = true;
                    }
                    if (!maybeTiktok && targetHeight > videoElement.clientHeight * 1.5) {
                        return;
                    }
                    if (videoArray.length > 1) {
                        console.log("触摸位置找到不止一个视频。");
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
                if (videoElement.duration < 30) { sampleVideo = true; }
            };
            if (videoElement.readyState > 0) {
                videoReadyHandler();
            } else {
                videoElement.addEventListener("loadedmetadata", videoReadyHandler, {once: true});
            }
            let componentContainer = findComponentContainer();
            let notice;
            let timeChange = 0;
            let direction;
            makeTagAQuiet();
            if (!videoElement.getAttribute("disable_contextmenu")) {
                videoElement.addEventListener("contextmenu", (e) => { e.preventDefault(); });
                videoElement.setAttribute("disable_contextmenu", true);
            }
            if (target.tagName === "IMG") {
                target.draggable = false;
                if (!target.getAttribute("disable_contextmenu")) {
                    target.addEventListener("contextmenu", (e) => { e.preventDefault(); });
                    target.setAttribute("disable_contextmenu", true);
                }
            }
            let sharedCSS = "border-radius:4px;z-index:99999;opacity:0.5;background-color:black;color:white;" +
                            "display:flex;justify-content:center;align-items:center;text-align:center;user-select:none;";
            let haveControls = videoElement.controls;
            let longPress = false;
            let rateTimer = setTimeout(() => {
                videoElement.playbackRate = settings.rate;
                videoElement.controls = false;
                target.removeEventListener("touchmove", touchmoveHandler);
                notice.innerText = "x" + settings.rate;
                notice.style.display = "flex";
                longPress = true;
                rateTimer = null;
                if (!document.fullscreenElement || videoElement.readyState === 0 || !settings.speed) { return; }
                let speedBtns = componentContainer.getElementsByClassName("me-speed-btn");
                let speedBtn;
                if (speedBtns.length > 0) {
                    speedBtn = speedBtns[0];
                    speedBtn.style.display = "flex";
                } else {
                    speedBtn = document.createElement("div");
                    speedBtn.className = "me-speed-btn";
                    speedBtn.style.cssText = sharedCSS + "position:absolute;width:30px;height:30px;font-size:18px;";
                    speedBtn.style.top = "50px";
                    speedBtn.style.right = "20px";
                    speedBtn.textContent = "速";
                    componentContainer.appendChild(speedBtn);
                    speedBtn.addEventListener("click", showSpeedMenu);
                }
                setTimeout(() => { speedBtn.style.display = "none"; }, 3000);
                window.addEventListener("resize", () => { speedBtn.style.display = "none"; }, {once: true});
                function showSpeedMenu() {
                    speedBtn.style.display = "none";
                    let containers = componentContainer.getElementsByClassName("me-speed-container");
                    let container;
                    if (containers.length > 0) {
                        container = containers[0];
                        container.style.display = "flex";
                    } else {
                        container = document.createElement("div");
                        container.className = "me-speed-container";
                        componentContainer.appendChild(container);
                        let css;
                        if (videoElement.videoHeight > videoElement.videoWidth) {
                            css = `flex-direction:column;top:0;bottom:0;left:${(window.innerWidth * 2) / 3 + 40}px`;
                        } else {
                            css = `flex-direction:row;left:0;right:0;top:${(window.innerHeight / 3) - 30}px`;
                        }
                        container.style.cssText = "display:flex;position:absolute;flex-wrap:nowrap;z-index:99999;justify-content:center;" + css;
                        const values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 6];
                        values.forEach(value => {
                            const button = document.createElement('div');
                            container.appendChild(button);
                            button.className = 'button';
                            button.textContent = value + "";
                            button.style.cssText = sharedCSS + "width:40px;height:30px;margin:2px;font-size:18px;";
                            button.addEventListener('click', () => {
                                container.style.display = "none";
                                videoElement.playbackRate = value;
                            });
                        });
                    }
                    target.addEventListener("touchstart", () => { container.style.display = "none"; }, {once: true});
                    window.addEventListener("resize", () => { container.style.display = "none"; }, {once: true});
                }
            }, 800);
            // 创建自适应宽度且采用最终版本notice提示格式的 notice 元素
            let notices = componentContainer.getElementsByClassName("me-notice");
            if (notices.length === 0) {
                notice = document.createElement("div");
                notice.className = "me-notice";
                let noticeTop = Math.round(componentContainer.clientHeight / 6);
                notice.style.cssText = sharedCSS + "font-size:16px;position:absolute;display:none;letter-spacing:normal;padding:0 10px;min-height:30px;width:auto;max-width:90vw;white-space:nowrap;";
                notice.style.left = "50%";
                notice.style.top = noticeTop + "px";
                notice.style.transform = "translateX(-50%)";
                componentContainer.appendChild(notice);
                window.addEventListener("resize", () => { notice.remove(); }, {once: true});
            } else {
                notice = notices[0];
            }
            target.addEventListener("touchmove", touchmoveHandler);
            target.addEventListener("touchend", touchendHandler, {once: true});
            function makeTagAQuiet() {
                for (let element of allParents) {
                    if (element.tagName === "A" && !element.getAttribute("disable_menu_and_drag")) {
                        element.addEventListener("contextmenu", (e) => { e.preventDefault(); });
                        element.draggable = false;
                        element.setAttribute("disable_menu_and_drag", true);
                        element.target = "_blank";
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
            function touchmoveHandler(moveEvent) {
                if (rateTimer) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
                if (maybeTiktok || sampleVideo || !videoReady) return;
                moveEvent.preventDefault();
                if (moveEvent.touches.length === 1) {
                    let temp = Math.ceil(moveEvent.touches[0].clientX);
                    if (temp === endX) return;
                    endX = temp;
                    endY = Math.ceil(moveEvent.touches[0].screenY);
                }
                let containerWidth = listenTarget.clientWidth || window.innerWidth;
                let deltaX = endX - startX;
                // 根据模式选择算法
                if (settings.usePercentage) {
                    // 百分比模式（长短视频分类）
                    if (Math.abs(deltaX) > 10) {
                        if (!videoElement.duration || isNaN(videoElement.duration)) return;
                        let swipeFraction = (Math.abs(deltaX) - 10) / containerWidth;
                        let skipPercent = videoElement.duration <= settings.threshold ? settings.skipPercentShort : settings.skipPercentLong;
                        timeChange = Math.round(videoElement.duration * swipeFraction * (skipPercent / 100));
                        if (deltaX < 0) timeChange = -timeChange;
                        direction = deltaX > 0 ? 1 : 2;
                        notice.style.display = "flex";
                        let newTime = videoElement.currentTime + timeChange;
                        notice.innerText = (direction === 1 ? ">>>" : "<<<") + formatTime(newTime) + "/" + formatTime(videoElement.duration);
                    } else {
                        timeChange = 0;
                    }
                } else {
                    // 固定模式
                    if (deltaX > 10) {
                        if (!direction) { direction = 1; }
                        if (direction === 1) {
                            if (videoElement.duration <= settings.threshold) {
                                timeChange = Math.round((deltaX - 10) * settings.sensitivity2);
                            } else {
                                timeChange = Math.round((deltaX - 10) * settings.sensitivity1);
                            }
                        } else {
                            timeChange = 0;
                        }
                    } else if (deltaX < -10) {
                        if (!direction) { direction = 2; }
                        if (direction === 2) {
                            if (videoElement.duration <= settings.threshold) {
                                timeChange = Math.round((deltaX + 10) * settings.sensitivity2);
                            } else {
                                timeChange = Math.round((deltaX + 10) * settings.sensitivity1);
                            }
                        } else {
                            timeChange = 0;
                        }
                    } else if (timeChange !== 0) {
                        timeChange = 0;
                    } else {
                        return;
                    }
                    notice.style.display = "flex";
                    notice.innerText = (direction === 1 ? ">>>" : "<<<") + getClearTimeChange(timeChange);
                }
            }
            function touchendHandler() {
                if (notice) notice.style.display = "none";
                setTimeout(() => {
                    if (playing && videoElement.paused && !maybeTiktok) {
                        videoElement.play();
                    }
                }, 200);
                if (!longPress && videoElement.controls && !document.fullscreenElement) {
                    let btns = componentContainer.getElementsByClassName("me-fullscreen-btn");
                    let btn;
                    if (btns.length === 0) {
                        btn = document.createElement("div");
                        btn.style.cssText = sharedCSS + "position:absolute;width:40px;padding:2px;font-size:14px;font-weight:bold;" +
                                          "box-sizing:border-box;border:1px solid white;white-space:normal;line-height:normal;";
                        btn.innerText = "点我\n全屏";
                        btn.className = "me-fullscreen-btn";
                        let divHeight = 40;
                        btn.style.height = divHeight + "px";
                        btn.style.top = Math.round(componentContainer.clientHeight / 2 - divHeight / 2 - 10) + "px";
                        btn.style.left = Math.round((componentContainer.clientWidth * 5 / 7)) + "px";
                        componentContainer.append(btn);
                        btn.addEventListener("touchstart", async function () {
                            btn.style.display = "none";
                            await componentContainer.requestFullscreen();
                        });
                        videoElement.controlsList = ["nofullscreen"];
                    } else {
                        btn = btns[0];
                        btn.style.display = "flex";
                    }
                    setTimeout(() => { btn.style.display = "none"; }, 2000);
                }
                if (endX === startX) {
                    if (rateTimer) clearTimeout(rateTimer);
                    if (longPress) {
                        videoElement.controls = haveControls;
                        videoElement.playbackRate = 1;
                    }
                } else {
                    if (timeChange !== 0) {
                        videoElement.currentTime += timeChange;
                    }
                }
                target.removeEventListener("touchmove", touchmoveHandler);
            }
        });
    }
    
    // 全屏横屏模块：拦截网页自带方向锁调用，并在全屏时自动横屏
    window.tempLock = screen.orientation.lock;
    let myLock = function () {
        console.log("网页自带js试图执行lock()");
    };
    screen.orientation.lock = myLock;
    if (top === window) {
        window.addEventListener("message", async (e) => {
            if (typeof e.data === 'string' && e.data.includes("MeVideoJS")) {
                if (document.fullscreenElement) {
                    screen.orientation.lock = window.tempLock;
                    await screen.orientation.lock("landscape");
                    screen.orientation.lock = myLock;
                }
            }
        });
    }
    let inTimes = 0;
    window.addEventListener("resize", () => { setTimeout(fullscreenHandler, 500); });
    function fullscreenHandler() {
        let _fullscreenElement = document.fullscreenElement;
        if (_fullscreenElement) {
            if (_fullscreenElement.tagName === "IFRAME") return;
            inTimes++;
        } else if (inTimes > 0) {
            inTimes = 0;
        } else { return; }
        if (inTimes !== 1) return;
        let videoElement;
        if (_fullscreenElement.tagName !== "VIDEO") {
            let videoArray = _fullscreenElement.getElementsByTagName("video");
            if (videoArray.length > 0) {
                videoElement = videoArray[0];
                if (videoArray.length > 1) {
                    console.log("全屏内找到多个视频。");
                }
            }
        } else {
            videoElement = _fullscreenElement;
        }
        if (videoElement) {
            let changeHandler = function () {
                if (videoElement.videoHeight < videoElement.videoWidth) {
                    top.postMessage("MeVideoJS", "*");
                }
            };
            if (videoElement.readyState < 1) {
                videoElement.addEventListener("loadedmetadata", changeHandler, {once: true});
            } else { changeHandler(); }
        }
    }
})();
