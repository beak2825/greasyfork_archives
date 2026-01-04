// ==UserScript==
// @name                俺的手机视频脚本
// @name:zh-TW          俺的手機視頻腳本
// @name:en             My Phone Video Script
// @name:ja             My Phone Video Script
// @name:ko             My Phone Video Script
// @name:ru             My Phone Video Script
// @description         全屏横屏、快进快退、长按倍速，对各种视频网站的兼容性很强。仅适用于狐猴、kiwi等chromium内核的浏览器。使用前请先关闭同类横屏或手势脚本，以避免冲突。
// @description:zh-TW   全屏橫屏、快進快退、長按倍速，對各種視頻網站的相容性很強。僅適用於狐猴、Kiwi等Chromium核心的瀏覽器。使用前請先關閉同類橫屏或手勢腳本，以避免衝突。
// @description:en      Full-screen landscape, fast-forward and rewind, long-press for speed adjustment. Designed for Kiwi and Lemur browsers.
// @description:ja      Full-screen landscape, fast-forward and rewind, long-press for speed adjustment. Designed for Kiwi and Lemur browsers.
// @description:ko      Full-screen landscape, fast-forward and rewind, long-press for speed adjustment. Designed for Kiwi and Lemur browsers.
// @description:ru      Full-screen landscape, fast-forward and rewind, long-press for speed adjustment. Designed for Kiwi and Lemur browsers.
// @version      1.8.13
// @author       shopkeeperV
// @namespace    https://greasyfork.org/zh-CN/users/150069
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/456542/%E4%BF%BA%E7%9A%84%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456542/%E4%BF%BA%E7%9A%84%E6%89%8B%E6%9C%BA%E8%A7%86%E9%A2%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/*jshint esversion: 8*/
(function () {
    'use strict';
    //有元素全屏时不能选中文字，个别网页会因此影响长按功能
    GM_addStyle(":not(:root):fullscreen{user-select:none !important;}");
    let mutationTimer;
    //getElementsByTagName、getElementsByClassName获取的集合是实时更新的，不需要重新获取，保留引用以提升性能
    let videos = document.getElementsByTagName("video");
    let iframes = document.getElementsByTagName("iframe");
    const baseDomain = location.host.toLowerCase().split('.').slice(-2).join('.');
    let makeVideoAndIframeReady = function () {
        //去除未使用框架的视频的原生全屏按钮
        for (let video of videos) {
            if (video.controls) {
                video.controlsList = ["nofullscreen"];
                console.log("俺的手机视频脚本：获取到未使用框架的视频，已去除全屏按钮。");
            }
        }
        //放开iframe全屏
        for (let iframe of iframes) {
            iframe.allowFullscreen = true;
        }
    }
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
                            console.log(`俺的手机视频脚本：${_window}页面新增了一个${node.tagName.toLowerCase()}，1秒后处理。`);
                            return;
                        }
                    }
                }
            }
        }
    }
    makeVideoAndIframeReady();
    //观察页面变化，为新增的视频和iframe做好相应准备
    new MutationObserver(mutationHandler).observe(document.body, {childList: true, subtree: true});
    //注意，对少数iframe内视频，广告插件或使此脚本不起作用
    let listenTarget = document;
    listen();
    //狐猴浏览器长时间没有访问的标签页会出现与篡改猴断联的bug，尽量规避使用篡改猴存储相关的方法
    let settings = {
        voiced: true,
        speed: true,
        rate: 4,
        sensitivity1: 0.5,
        threshold: 300,
        sensitivity2: 0.2
    }
    for (let settingsKey in settings) {
        let value = GM_getValue(settingsKey);
        //未初始化时篡改猴GM_getValue返回undefined，null==undefined正确，null===undefined错误
        //为避免差异，此处不使用严格相等
        if (value == undefined) {
            GM_setValue(settingsKey, settings[settingsKey]);
        } else settings[settingsKey] = value;
    }
    if (window === top) {
        function registerBoolean(btnName, key) {
            GM_registerMenuCommand(btnName, () => {
                try {
                    GM_setValue(key, !settings[key]);
                    settings[key] = !settings[key];
                    alert(`成功${settings[key] ? "开启" : "关闭"}。`);
                } catch (e) {
                    alert("浏览器bug捕获，刷新页面后重试。\n" + e.message);
                }
            });
        }

        function registerInput(btnName, description, key, integer, minimum, maximum) {
            GM_registerMenuCommand(btnName, () => {
                let input = window.prompt(description, settings[key]);
                //prompt点取消会返回空，不输入点确认返回空串
                if (input === null) return;
                //确认是数字
                input = Number(input);
                //非法输入：NaN 0
                if (input && input > minimum && input <= maximum) {
                    if (integer && !Number.isInteger(input)) {
                        alert("要求整数！");
                        return;
                    }
                    try {
                        GM_setValue(key, input);
                        settings[key] = input;
                    } catch (e) {
                        alert("浏览器bug捕获，刷新页面后重试。\n" + e.message);
                    }
                } else {
                    alert("输入错误！");
                }
            });
        }

        registerBoolean("开关【触摸视频时取消静音】", "voiced");
        registerBoolean("开关【显示播放速度调整按钮】", "speed");
        registerInput("修改长按倍速数值", "请指定需要的倍率，输入0-6的数字即可，可以是小数。", "rate", false, 0, 6);
        registerInput("修改长视频滑动灵敏度", "默认为0.5，可依需求增减，要求0-3之间。", "sensitivity1", false, 0, 3);
        registerInput("修改短视频阈值", "默认300秒，小于此时长的使用短视频滑动灵敏度。", "threshold", true, 0, 36000);
        registerInput("修改短视频滑动灵敏度", "默认为0.2，可依需求增减，要求0-3之间。", "sensitivity2", false, 0, 3);
    }

    function listen() {
        //对视频的查找与控制都是在每次touchstart后重新执行的
        //虽然这样更消耗性能，但是对不同的网站兼容性更强
        //在捕获阶段监听事件，个别网站的视频操作层事件停止冒泡
        listenTarget.addEventListener("touchstart", (e) => {
            //为了代码逻辑在普通视频与iframe内视频的通用性，分别使用了clientX和screenY
            let startX;
            let startY;
            let endX;
            let endY;
            //多根手指不做响应
            if (e.touches.length === 1) {
                //在全屏时，不对边缘5%的区域做响应
                let screenX = e.touches[0].screenX;
                let screenY = e.touches[0].screenY;
                if (document.fullscreenElement) {
                    if (screenX < screen.width * 0.05 || screenX > screen.width * 0.95 ||
                        screenY < screen.height * 0.05 || screenY > screen.height * 0.95)
                        return;
                }
                //单指触摸，记录位置
                startX = Math.ceil(e.touches[0].clientX);
                startY = Math.ceil(screenY);
                endX = startX;
                endY = startY;
            } else return;
            let videoElement;
            //通用情况，触摸的目标如果是视频或一体的视频操控层，那他也是我们绑定手势的目标
            let target = e.target;
            //当操作层不是一体的，比如左右两边各一个操控层，就需要手动指定监听对象
            let others = [{domain: "avbebe.com", selector: ".fp-ui"}];
            for (let other of others) {
                if (baseDomain === other.domain) {
                    let _target = document.querySelector(other.selector);
                    if (target !== _target && !_target.contains(target)) {
                        return;
                    }
                    //触摸的子元素太小得排除
                    if (target.clientWidth < _target.clientWidth * 0.3 ||
                        target.clientHeight < _target.clientHeight * 0.4) {
                        return;
                    }
                    target = _target;
                    break;
                }
            }
            //用于有操控层的网站，保存的是视频与操控层适当尺寸下的最大共同祖先节点，确认后需要在后代内搜索视频元素
            let biggestContainer;
            let targetWidth = target.clientWidth;
            let targetHeight = target.clientHeight;
            //所有大小合适的祖先节点最后一个为biggestContainer
            let suitParents = [];
            //用于判断是否含有包裹视频的a标签，需要禁止其被长按时呼出浏览器菜单
            let allParents = [];
            let temp = target;
            //抖音类短视频网站，特点是视频操控层占据几乎整个屏幕
            let maybeTiktok = false;
            //寻找biggestContainer
            while (true) {
                temp = temp.parentElement;
                if (!temp/*或直接点击到html元素，他将没有父元素*/) {
                    return;
                }
                //allParents全部保存，用于判断是否存在a标签
                allParents.push(temp);
                //这些条件是用来找操作层对应视频的，和指示器、按钮的定位无关
                if (temp.clientWidth > 0 &&
                    temp.clientWidth < targetWidth * 1.2 &&
                    temp.clientHeight > 0 &&
                    temp.clientHeight < targetHeight * 1.2) {
                    suitParents.push(temp);
                }
                //循环结束条件
                if (temp.tagName === "BODY" ||
                    temp.tagName === "HTML" ||
                    !temp.parentElement) {
                    //已找到所有符合条件的祖先节点，取最后一个
                    if (suitParents.length > 0) {
                        biggestContainer = suitParents[suitParents.length - 1];
                    }
                    //没有任何大小合适的祖先元素，且自身不是视频元素，那也肯定不是视频操控层
                    else if (target.tagName !== "VIDEO") {
                        return;
                    }
                    //gc
                    suitParents = null;
                    break;
                }
            }
            //寻找视频元素
            //当触摸的不是视频元素，可能是非视频相关组件，或视频的操控层
            if (target.tagName !== "VIDEO") {
                //尝试获取视频元素
                let videoArray = biggestContainer.getElementsByTagName("video");
                if (videoArray.length > 0) {
                    if (videoArray.length > 1) {
                        //一些短视频会在筛选的祖先元素内有多个视频
                        for (let video of videoArray) {
                            if (video.paused === false) {
                                videoElement = video;
                            }
                        }
                        if (!videoElement) {
                            console.log("触摸位置找到不止一个视频，而且没有正在播放的，无法判断哪个是需要操作的视频元素。");
                            return;
                        }
                    } else videoElement = videoArray[0];
                } else {
                    //非视频相关组件
                    return;
                }
            }
            //触摸的是视频元素，则一切清晰明了
            else {
                videoElement = target;
            }
            //找到视频元素后，可以判断是否可能是短视频
            //非全屏状态下，非iframe内视频，若视频操作层或视频占据大半的屏幕，判断为短视频
            //tiktok没有视频控件，判断这个防止有页面的预览视频铺满了屏幕，这一项只能判断到没有框架的视频
            if (!document.fullscreenElement &&
                top === window &&
                !videoElement.controls &&
                target.clientHeight > window.innerHeight * 0.8 &&
                target.clientWidth > window.innerWidth * 0.8) {
                maybeTiktok = true;
            }
            //如果是视频外很大的容器绝非我们想要的
            //操作层除了短视频没见过高度高视频这么多的，大概率不是视频操控层
            if (!maybeTiktok && targetHeight > videoElement.clientHeight * 1.5) {
                //不是合适的操作层
                return;
            }
            //用于比较单击后，视频的播放状态，如果单击暂停，则恢复播放
            let playing = !videoElement.paused;
            //下面两个连通tiktok变量3个参数用于判断是否要执行touchmove事件处理器
            //过短的视频当做预览视频，在网页上的视频列表可能存在，不要让他们影响网页滚动
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
                videoElement.addEventListener("loadedmetadata", videoReadyHandler, {once: true});
            }
            //一个合适尺寸的最近祖先元素用于显示手势信息与全屏按钮
            let componentContainer = findComponentContainer();
            //指示器元素
            let notice;
            //视频快进快退量
            let timeChange = 0;
            //1表示右滑快进，2表示左滑快退，方向一旦确认就无法更改
            let direction;
            //优化a标签导致的长按手势中断问题（许多网站的视频列表的预览视频都是由a标签包裹）
            makeTagAQuiet();
            //禁止长按视频呼出浏览器菜单，为长按倍速做准备（没有视频框架的视频需要）
            if (!videoElement.getAttribute("disable_contextmenu")/*只添加一次监听器*/) {
                videoElement.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                });
                videoElement.setAttribute("disable_contextmenu", true);
            }
            //禁止图片长按呼出浏览器菜单和拖动（部分框架视频未播放时，触摸到的是预览图，抖音类播放时摸到的都是图片）
            if (target.tagName === "IMG") {
                target.draggable = false;
                if (!target.getAttribute("disable_contextmenu")) {
                    target.addEventListener("contextmenu", (e) => {
                        e.preventDefault();
                    });
                    target.setAttribute("disable_contextmenu", true);
                }
            }
            let sharedCSS = "border-radius:4px;z-index:99999;opacity:0.5;background-color:black;color:white;" +
                "display:flex;justify-content:center;align-items:center;text-align:center;user-select:none;";
            let haveControls = videoElement.controls;
            let longPress = false;
            let rateTimerBack;
            //长按倍速定时器
            let rateTimer = setTimeout(() => {
                if (playing && videoElement.paused) {
                    videoElement.play();
                }
                //添加检测机制，有些视频组件触屏的某些时机会恢复正常播放速度，使长按加速失效
                rateTimerBack = setTimeout(() => {
                    if (videoElement.playbackRate === 1) {
                        videoElement.playbackRate = settings.rate;
                    }
                }, 500);
                videoElement.playbackRate = settings.rate;
                videoElement.controls = false;
                //禁止再快进快退
                target.removeEventListener("touchmove", touchmoveHandler);
                //显示notice
                notice.innerText = "x" + settings.rate;
                notice.style.display = "flex";
                longPress = true;
                rateTimer = null;
                //显示调速按钮
                //仅在全屏时触发
                if (!document.fullscreenElement || videoElement.readyState === 0 || !settings.speed) {
                    return;
                }
                let speedBtn = componentContainer.querySelector(`:scope>.me-speed-btn`/*需要直接子元素*/);
                if (speedBtn) {
                    speedBtn.style.display = "flex";
                } else {
                    speedBtn = document.createElement("div");
                    speedBtn.className = "me-speed-btn";
                    speedBtn.style.cssText = sharedCSS + "position:absolute;width:30px;height:30px;font-size:18px;";
                    speedBtn.style.top = "50px";
                    speedBtn.style.right = "20px";
                    speedBtn.textContent = "速";
                    componentContainer.appendChild(speedBtn);
                    speedBtn.addEventListener("touchstart", showSpeedMenu);
                }
                setTimeout(() => {
                    speedBtn.style.display = "none";
                }, 4000);
                window.addEventListener("resize", () => {
                    speedBtn.style.display = "none";
                }, {once: true});

                function showSpeedMenu(event) {
                    //不阻止会打开按钮组又关闭按钮组
                    event.stopPropagation();
                    speedBtn.style.display = "none";
                    let container = componentContainer.querySelector(`:scope>.me-speed-container`/*需要直接子元素*/);
                    if (container) {
                        container.style.display = "flex";
                    } else {
                        container = document.createElement("div");
                        //在一次全屏状态中不会重复创建容器
                        container.className = "me-speed-container";
                        componentContainer.appendChild(container);
                        let css;
                        //横屏竖屏按钮显示位置不一样
                        if (videoElement.videoHeight > videoElement.videoWidth) {
                            css = `flex-direction:column;top:0;bottom:0;left:${(window.innerWidth * 2) / 3 + 40}px`;
                        } else {
                            css = `flex-direction:row;left:0;right:0;top:${(window.innerHeight / 3) - 30}px`;
                        }
                        container.style.cssText = "display:flex;position:absolute;flex-wrap:nowrap;z-index:99999;justify-content:center;" + css;
                        const values = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2, 3, 4, 5, 6];
                        //创建按钮
                        values.forEach(value => {
                            const button = document.createElement('div');
                            container.appendChild(button);
                            button.className = 'button';
                            button.textContent = value + "";
                            button.style.cssText = sharedCSS + "width:40px;height:30px;margin:2px;font-size:18px;";
                            button.addEventListener('touchstart', (event) => {
                                event.stopPropagation();
                                container.style.display = "none";
                                videoElement.playbackRate = value;
                                //添加检测机制，有些视频组件触屏的某些时机会恢复正常播放速度，使变速失效
                                setTimeout(() => {
                                    if (videoElement.playbackRate === 1) {
                                        videoElement.playbackRate = value;
                                    }
                                }, 500);
                            });
                        });
                    }
                    //触摸空白处关闭container，事件必须和按钮事件一致，一个用touchstart，一个用click，无法确认执行顺序，而且click点击视频时未必触发
                    componentContainer.addEventListener("touchstart", () => {
                        container.style.display = "none";
                    }, {capture: true, once: true});
                    window.addEventListener("resize", () => {
                        container.style.display = "none";
                    }, {once: true});
                }
            }, 800);
            //有些网站预览视频位置实际在屏幕之外，需要加上平移的数值
            let screenWidth = screen.width;
            let componentMoveLeft = componentContainer.offsetLeft;
            let moveNum = Math.floor(componentMoveLeft * 1.1 / screenWidth);
            //添加指示器元素
            //有些视频非全屏时没有操作层，全屏时有操作层，并且视频与操作层为兄弟元素
            //那么在非全屏时只用getElementsByClassName判断是否已经创建me-notice可能会不准确
            notice = componentContainer.querySelector(`:scope>.me-notice`/*需要直接子元素*/);
            if (!notice) {
                notice = document.createElement("div");
                notice.className = "me-notice";
                let noticeWidth = 110;//未带单位，后面需要加单位
                let noticeTop = Math.round(componentContainer.clientHeight / 6);
                let noticeLeft = Math.round(moveNum * screenWidth + componentContainer.clientWidth / 2 - noticeWidth / 2);
                notice.style.cssText = sharedCSS + "font-size:16px;position:absolute;display:none;letter-spacing:normal;";
                notice.style.width = noticeWidth + "px";
                notice.style.height = "30px";
                notice.style.left = noticeLeft + "px";
                notice.style.top = noticeTop + "px";
                componentContainer.appendChild(notice);
                //每次全屏与退出全屏需要重新计算notice的位置
                window.addEventListener("resize", () => {
                    notice.remove();
                }, {once: true});
            }
            //滑动流畅的关键1，passive为false代表处理器内调用preventDefault()不会被浏览器拒绝
            //mdn：文档级节点 Window、Document 和 Document.body默认是true，其他节点默认是false，以防万一还是写上
            //不能使用捕获模式，会出现startX变来变去的bug
            target.addEventListener("touchmove", touchmoveHandler, {passive: false});
            target.addEventListener("touchend", touchendHandler, {once: true});

            function makeTagAQuiet() {
                for (let element of allParents) {
                    if (element.tagName === "A" &&
                        !element.getAttribute("disable_menu_and_drag")) {
                        //禁止长按菜单
                        element.addEventListener("contextmenu", (e) => {
                            e.preventDefault();
                        });
                        //禁止长按拖动
                        element.draggable = false;
                        element.setAttribute("disable_menu_and_drag", true);
                        //没有长按菜单，用target="_blank"属性来平替
                        element.target = "_blank";
                        //不可能a标签嵌套a标签吧
                        break;
                    }
                }
                allParents = null;
            }

            function findComponentContainer() {
                //部分网站特殊，如操控层会在触摸过程中变化，所以将在视频和操控层的最近共同祖先元素中添加组件
                let others = [{domain: "spankbang.com", selector: ".vjs-controls-container"}];
                for (let other of others) {
                    if (baseDomain === other.domain) {
                        return findCommonAncestorWithSize(document.querySelector(other.selector), videoElement);
                    }
                }
                //其余网站使用通用的方案，触摸到的是视频就用视频的父元素，触摸到的是操控层就用操控层本身
                if (target.tagName === "VIDEO") {
                    let temp = videoElement;
                    while (true) {
                        //寻找最近的有长宽数值的祖先节点
                        if (temp.parentElement.clientWidth > 0 &&
                            temp.parentElement.clientHeight > 0) {
                            return temp.parentElement;
                        } else {
                            temp = temp.parentElement;
                        }
                    }
                } else {
                    if (window.getComputedStyle(target).opacity === "0") {
                        //操作层使用opacity来控制透明度时，子元素怎么都不会显示，我们需要修改它
                        target.style.visibility = "hidden";
                        target.style.opacity = "1";
                    }
                    //直接使用触控层，之所以不使用他的祖先元素，是因为有些网站的操作层的所有祖先元素都不合适
                    return target;
                }

                //寻找视频和操控层的最近共同祖先
                function findCommonAncestorWithSize(element1, element2) {
                    // 获取两个元素的所有祖先节点（包括自身）
                    function getAncestors(el) {
                        const ancestors = [];
                        let currentEl = el;
                        while (currentEl) {
                            ancestors.push(currentEl);
                            currentEl = currentEl.parentElement;
                        }
                        return ancestors;
                    }

                    const ancestors1 = getAncestors(element1);
                    const ancestors2 = getAncestors(element2);
                    for (let i = 0; i < ancestors1.length; i++) {
                        for (let j = 0; j < ancestors2.length; j++) {
                            if (ancestors1[i] === ancestors2[j]) {
                                if (ancestors1[i].clientWidth > 0 && ancestors1[i].clientHeight > 0) {
                                    return ancestors1[i];
                                }
                            }
                        }
                    }
                    return null;
                }
            }

            function getClearTimeChange(timeChange) {
                timeChange = Math.abs(timeChange);
                let minute = Math.floor(timeChange / 60);
                let second = timeChange % 60;
                return (minute === 0 ? "" : (minute + "min")) + second + "s";
            }

            function touchmoveHandler(moveEvent) {
                // console.log("手指移动");
                //触摸屏幕后，0.8s内如果有移动，清除长按定时事件
                if (rateTimer) {
                    clearTimeout(rateTimer);
                    rateTimer = null;
                }
                if ((sampleVideo && !maybeTiktok) || !videoReady) {
                    return;
                }
                //滑动流畅的关键2
                moveEvent.preventDefault();
                if (moveEvent.touches.length === 1) {
                    //仅支持单指触摸，记录位置
                    let temp = Math.ceil(moveEvent.touches[0].clientX);
                    //x轴没变化，y轴方向移动也会触发，要避免不必要的运算
                    if (temp === endX) {
                        return;
                    } else {
                        endX = temp;
                    }
                    endY = Math.ceil(moveEvent.touches[0].screenY);
                    //console.log("移动到" + endX + "," + endY);
                }
                //由第一次移动确认手势方向，就不再变更
                //10个像素起
                if (endX > startX + 10) {
                    //快进
                    if (!direction) {
                        //首次移动，记录方向
                        direction = 1;
                    }
                    if (direction === 1) {
                        //方向未变化
                        if (videoElement.duration <= settings.threshold) {
                            timeChange = Math.round((endX - startX - 10) * settings.sensitivity2);
                        } else timeChange = Math.round((endX - startX - 10) * settings.sensitivity1);
                    } else {
                        timeChange = 0;
                    }
                } else if (endX < startX - 10) {
                    //快退
                    if (!direction) {
                        //首次移动，记录方向
                        direction = 2;
                    }
                    if (direction === 2) {
                        //方向未变化
                        if (videoElement.duration <= settings.threshold) {
                            timeChange = Math.round((endX - startX + 10) * settings.sensitivity2);
                        } else timeChange = Math.round((endX - startX + 10) * settings.sensitivity1);
                    } else {
                        timeChange = 0;
                    }

                } else if (timeChange !== 0) {
                    timeChange = 0;
                } else {
                    return;
                }
                if (notice.style.display === "none" /*已经显示了就不管怎么滑动了*/ &&
                    Math.abs(endY - startY) > Math.abs(endX - startX)) {
                    //垂直滑动不显示
                    timeChange = 0;
                    return;
                }
                //未到阈值不显示
                if (direction) {
                    notice.style.display = "flex";
                    notice.innerText = (direction === 1 ? ">>>" : "<<<") + getClearTimeChange(timeChange);
                }
            }

            function touchendHandler() {
                if (notice) notice.style.display = "none";
                // console.log("手指抬起");
                if (settings.voiced) {
                    videoElement.muted = false;
                }
                //所有非短视频自带的全视频区域的单击暂停，给他重新播放，手机不适合单击暂停，需要暂停的使用暂停按钮即可
                //带延迟是为了让网页自带的js先执行，videoElement.paused的状态才会判断准确
                setTimeout(() => {
                    if (playing && videoElement.paused && !maybeTiktok) {
                        videoElement.play();
                    }
                }, 500);
                //一般有chrome自带视频控件的就是没用框架的视频
                //需要替换全屏按钮，不然无法显示快进指示器
                //非长按后手指抬起时才添加全屏按钮
                if (!longPress && videoElement.controls && !document.fullscreenElement) {
                    let btns = componentContainer.getElementsByClassName("me-fullscreen-btn");
                    let btn;
                    if (btns.length === 0) {
                        btn = document.createElement("div");
                        btn.style.cssText = sharedCSS + "position:absolute;width:40px;padding:2px;font-size:14px;font-weight:bold;" +
                            "box-sizing:border-box;border:1px solid white;white-space:normal;line-height:normal;";
                        btn.innerText = "点我\n全屏";
                        //设置id是为了防止多次点击重复添加
                        btn.className = "me-fullscreen-btn";
                        let divHeight = 40;
                        btn.style.height = divHeight + "px";
                        btn.style.top = Math.round(componentContainer.clientHeight / 2 - divHeight / 2 - 10) + "px";
                        btn.style.left = Math.round(moveNum * screenWidth + componentContainer.clientWidth * 5 / 7) + "px";
                        componentContainer.append(btn);
                        btn.addEventListener("touchstart", async function () {
                            btn.style.display = "none";
                            await componentContainer.requestFullscreen();
                        });
                        //屏蔽原生全屏按钮
                        videoElement.controlsList = ["nofullscreen"];
                    } else {
                        btn = btns[0];
                        btn.style.display = "flex";
                    }
                    setTimeout(() => {
                        btn.style.display = "none";
                    }, 2000);
                }
                //滑动长按判断
                if (endX === startX) {
                    //长按
                    //console.log("长按");
                    if (rateTimer) {
                        //定时器也许已经执行，此时清除也没关系
                        clearTimeout(rateTimer);
                    }
                    if (rateTimerBack) {
                        clearTimeout(rateTimerBack);
                        rateTimerBack = null;
                    }
                    if (longPress) {
                        //长按快进结束如果原本有控制器，则恢复
                        videoElement.controls = haveControls;
                        videoElement.playbackRate = 1;
                    }
                } else {
                    if (timeChange !== 0) {
                        //快进
                        videoElement.currentTime += timeChange;
                    }
                    //console.log("x轴移动" + (endX - startX));
                    //console.log("y轴移动" + (endY - startY));
                }
                target.removeEventListener("touchmove", touchmoveHandler);
            }
        }, {capture: true});
    }

    //全屏横屏模块
    //将浏览器锁定方向的方法改掉，防止网页自带的js执行
    //这是因为遇到有网站锁定为any后，且后于此脚本执行，那么手机倒着拿就会直接退出全屏
    window.tempLock = screen.orientation.lock.bind(screen.orientation);
    screen.orientation.lock = async function () {
        console.log("网页自带js试图执行lock()。");
    };
    //顶层窗口负责执行横屏，因为iframe可能开启了沙箱机制无法锁定方向并无法修改
    //top窗口监听来自iframe的横屏通知，不再使用篡改猴的变量监听，规避浏览器偶发的插件储值访问错误
    if (top === window) {
        window.addEventListener("message", async (e) => {
            if (typeof e.data === 'string' && e.data.includes("MeVideoJS")) {
                if (document.fullscreenElement) {
                    await window.tempLock("landscape");
                    console.log("已执行横屏。");
                }
            }
        });
    }
    //全屏后触发resize次数，如果有iframe，每个document可不是共用这个值
    let inTimes = 0;
    //是否此窗口发生resize事件
    let isThisWindow = false;
    //利用window的resize事件监听全屏动作，监听document常用的fullscreenchange事件可能因为后代停止传播而捕获不到
    window.addEventListener("resize", () => {
        //resize事件或先于全屏事件触发，此时判断是否全屏将出错，所以得设置延迟
        setTimeout(fullscreenHandler, 500);
    });

    async function fullscreenHandler() {
        //获取全屏元素，查找视频，判断视频长宽比来锁定方向
        let _fullscreenElement = document.fullscreenElement;
        if (_fullscreenElement) {
            //如果全屏元素是iframe，说明不是视频所在的document执行到这，记录也没用
            if (_fullscreenElement.tagName === "IFRAME") {
                return;
            }
            isThisWindow = true;
            //inTimes==1可代表全屏，>1代表全屏时多余的触发
            inTimes++;
            console.log(inTimes === 1 ? "触发resize事件，进入全屏。" : "进入全屏多余触发。");
        } else if (inTimes > 0) {
            //此代码块可代表退出全屏
            inTimes = 0;
            console.log("触发resize事件，退出全屏。");
        } else {
            if (isThisWindow) {
                console.log("退出全屏多余触发。");
            }
            //退出全屏时多余的触发或者是其他与全屏无关的元素触发resize
            return;
        }
        if (inTimes !== 1) {
            return;
        }
        let videoElement;
        if (_fullscreenElement.tagName !== "VIDEO") {
            //最大的全屏元素不是视频本身，需要寻找视频元素
            let videoArray = _fullscreenElement.getElementsByTagName("video");
            if (videoArray.length > 0) {
                videoElement = videoArray[0];
                if (videoArray.length > 1) {
                    console.log("全屏元素内找到不止一个视频。");
                }
            }
        } else videoElement = _fullscreenElement;
        //也可能不是视频在全屏
        if (videoElement) {
            console.log("已找到视频。");
            let changeHandler = async function () {
                //高度小于宽度，需要转向，landscape会自动调用陀螺仪
                if (videoElement.videoHeight < videoElement.videoWidth) {
                    console.log("高度小于宽度，需要横屏。");
                    //开启沙盒机制的iframe修改sandbox属性无效，需要顶层窗口调用方向锁定
                    //此消息如果是顶层窗口自身发送将无法触发，所以单独处理顶层窗口
                    if (top === window) {
                        console.log("视频位于顶层窗口，直接执行横屏。");
                        await window.tempLock("landscape");
                    } else {
                        console.log("视频位于iframe，通知top窗口横屏。");
                        top.postMessage("MeVideoJS", "*");
                    }
                } else console.log("高度大于宽度，不需要横屏。");
            };
            //视频未加载，在加载后再判断需不需要转向
            if (videoElement.readyState < 1) {
                console.log("视频未加载，等待中...");
                videoElement.addEventListener("loadedmetadata", changeHandler, {once: true});
            } else {
                await changeHandler();
            }
        } else console.log("未找到视频。");
    }
})();