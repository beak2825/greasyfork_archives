// ==UserScript==
// @name          视频倍速与快进-快捷方式
// @version       1.2.9
// @description   快捷键倍速播放、快进(支持B站、腾爱优、百度网盘、油管)。【倍速键】C 加速0.25，S 加速0.5；X 减速0.25，A 减速0.5。数字键1 2 3分别直达对应速率。【快进键】数字7/9分别快进30/60秒，6/8则快退相应值
// @author        interest2
// @license       GPL-3.0-only
// @match         *://www.bilibili.com/video/*
// @match         *://www.bilibili.com/list/*
// @match         *://www.bilibili.com/cheese/*
// @match         *://v.qq.com/x/page/*
// @match         *://v.qq.com/x/cover/*
// @match         https://www.iqiyi.com/*
// @match         https://v.youku.com/*
// @match         https://pan.baidu.com/pfile/video?path=*
// @match         https://www.youtube.com/*
// @grant         GM_addStyle
// @namespace https://greasyfork.org/users/1034870
// @downloadURL https://update.greasyfork.org/scripts/529137/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E4%B8%8E%E5%BF%AB%E8%BF%9B-%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529137/%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%E4%B8%8E%E5%BF%AB%E8%BF%9B-%E5%BF%AB%E6%8D%B7%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==
/* globals $ waitForKeyElements */
!function() {
    "use strict";
    // 自定义的基础速度
    const BASE_RATE = 1.25;

//     快进、快退的快捷键的自定义修改
    const BACKWARD_30 = '6';
    const FORWARD_30 = '7';
    const BACKWARD_60 = '8';
    const FORWARD_60 = '9';
    const BUTTON_TRIPLE = '0';

//     加速、减速的快捷键的自定义修改
    const DEC_SMALL = 'x';
    const INC_SMALL = 'c';
    const DEC_BIG = 'a';
    const INC_BIG = 's';
    const BASIC_SPEED = 'z';

    // 速度提示框的显示时长（毫秒）
    const DURATION = 1200;
    // B站合集视频列表展示高度占据网页高度的比例
    const PLAYLIST_HEIGHT_RATIO = 0.6;

    const url = window.location.href;
    console.log("url: "+url);

    let site = 0;
    if(url.indexOf("bilibili") > -1){
        site = 0;
    }else if(url.indexOf("qq.com") > -1){
        site = 1;
    }else if(url.indexOf("iqiyi.com") > -1){
        site = 2;
    }else if(url.indexOf("baidu.com") > -1){
        site = 3;
    }else if(url.indexOf("youtube.com") > -1){
        site = 4;
    }else if(url.indexOf("youku.com") > -1){
        site = 5;
    }
    console.log("site: "+site);

    var box = getBox();
    console.log("box: "+box);

    function getBox(){
        var box = document.createElement("div");
        box.classList.add("tool-box");
        box.id = "tool-box";
        return box;
    }

    function getVideo(){
        const videoWithSrc = Array.from(document.querySelectorAll('video')).find(video => {
            let src = video.getAttribute('src');
            return src && typeof src === 'string' && src.trim() !== '';
        });
        let toolBox = document.getElementById("tool-box");
        if(isEmpty(toolBox) && !isEmpty(videoWithSrc)){
            console.log("插入box");
            if(site === 4){
                box.style.position = "relative";
                box.style.bottom = "-15rem";
                box.style.fontSize = "2rem";
                console.log(box);
            }
            videoWithSrc.insertAdjacentElement("afterend", box);
        }
        return videoWithSrc;
    }

    const intervalTime = 100; // 每次检查的间隔时间（毫秒）
    const maxChecks = 5000/intervalTime; // 最大检查次数

    let objCss = "";
    let checkCount = 0;
    let specificSite = [3, 4];
    let rawRateBarSite = [1, 3];

    const intervalId = setInterval(() => {
        const element = getVideo();
        checkCount++;

        if (!isEmpty(element)) {
            if(!specificSite.includes(site)){
                setRate();
                console.log("元素已找到:", element);
                console.log(checkCount);
                clearInterval(intervalId); // 停止循环
            }
        } else if (checkCount >= maxChecks) {
            console.log("已达到最大检查次数，未找到元素");
            clearInterval(intervalId); // 停止循环
        }
    }, intervalTime);

    // 特殊处理：① 首次延迟 ② 每隔1秒重设速度，避免暂停键的异常影响
    if(specificSite.includes(site)){
        setTimeout(setRate, 2000);
        setInterval(function() {
            setRecentRate();
        }, 1000);
    }

    let playbackRate = BASE_RATE;

    function setRecentRate(){
        let recentRate = sessionStorage.getItem("recentRate");
        if(!isEmpty(recentRate)){
            playbackRate = parseFloat(recentRate);
        }
        let video = getVideo();
//         百网盘切集后刚取到可能空，再取一次
        if(isEmpty(video)){
            video = getVideo();
            if(isEmpty(video)){
                console.log("video is empty");
                return;
            }

        }
        setTimeout(function(){
            // 重新取一次，否则src属性可能消失
            video = getVideo();
            video.playbackRate = playbackRate;
            showBaiduRateBar(playbackRate);
        }, 1000);
        console.log("playbackRate after: "+playbackRate);
    }

        // 百度网盘倍速条文字提示
    function showBaiduRateBar(playbackRate){
        const pattern = /倍速|X/i;
        let rateCss="vp-video__control-bar--button is-text";
        let rateItems=document.getElementsByClassName(rateCss);
        if(rateItems.length>0){
            for (let i = 0; i < rateItems.length; i++) {
                console.log(rateItems[i].textContent);
                if(pattern.test(rateItems[i].textContent)){
                    rateItems[i].textContent=playbackRate+"X";
                    break;
                }
            }
        }
    }

    // 覆盖默认的url改变触发的方法
    (function(history) {
        var pushState = history.pushState;
        var replaceState = history.replaceState;
        let video = getVideo();

        history.pushState = function(state) {
            pushState.apply(history, arguments);
            console.log('pushState URL changed to:', window.location.href);
            setRecentRate();
        };

        history.replaceState = function(state) {
            replaceState.apply(history, arguments);
            console.log('replaceState URL changed to:', window.location.href);
            setRecentRate();
        };
    })(window.history);

    let likeCss = "#arc_toolbar_report > div.video-toolbar-left > div > div:nth-child(1) > div";

    function setRate(){
        //B站右侧如果有分集列表，则给予更多展示高度
        if(site === 0){
            let playlist = document.querySelector("#mirror-vdcon > div.right-container > div > div.rcmd-tab > div.video-pod.video-pod > div.video-pod__body");
            if(!isEmpty(playlist)){
                const pageHeight = window.innerHeight;
                console.log("网页高度:", pageHeight);
                let top = playlist.getBoundingClientRect().top;

                playlist.style.maxHeight = pageHeight - top - 80 + "px";
                console.log(pageHeight, top);

            }
        }

        let video = getVideo();

        // 初始化倍速
        setRecentRate();
        let toolBox= document.getElementById("tool-box");

        // 监听键盘事件
        document.addEventListener('keydown', (event) => {
            let displayRateFlag = false;
            let setSessionRateFlag = true;
            let likeItem;

            switch (event.key.toLowerCase()) {
                case BASIC_SPEED:
                    console.log(video.playbackRate);
                    // 如果已经是基础速度了，则切回上次的倍速
                    if(video.playbackRate === BASE_RATE){
                        let recentRate = sessionStorage.getItem("recentRate");
                        if(!isEmpty(recentRate)){
                            playbackRate = parseFloat(recentRate);
                            displayRateFlag = true;
                        }
                    }else{
                    // 否则，恢复到自定义的基础速度
                        playbackRate = BASE_RATE;
                    }
                    displayRateFlag = true;
                    setSessionRateFlag = false;
                    break;
                case INC_BIG:
                    displayRateFlag = true;
                    playbackRate += 0.5;
                    break;
                case DEC_BIG:
                    playbackRate -= 0.5;
                    displayRateFlag = true;
                    if (playbackRate < 0.25) {
                        playbackRate = 0.5; // 设置最低倍速
                    }
                    break;
                case INC_SMALL:
                    playbackRate += 0.25;
                    displayRateFlag = true;
                    break;
                case DEC_SMALL:
                    playbackRate -= 0.25;
                    displayRateFlag = true;
                    if (playbackRate < 0.25) {
                        playbackRate = 0.25; // 最低倍速为0.25
                    }
                    break;
                case 'f':
                    if(site !== 0 && site !== 4){ // B站、油管本身支持F全屏键，若不排除会有小问题
                        if(isFullscreen()){
                            document.exitFullscreen();
                        }else{
                            video.requestFullscreen();
                        }
                    }
                    break;
                case '1':
                    playbackRate = 1.0;
                    displayRateFlag = true;
                    break;
                case '2':
                    playbackRate = 2.0;
                    displayRateFlag = true;
                    break;
                case '3':
                    playbackRate = 3.0;
                    displayRateFlag = true;
                    break;
                case '4':
                    playbackRate = 1.5;
                    displayRateFlag = true;
                    break;
                case '5':
                    playbackRate = 2.5;
                    displayRateFlag = true;
                    break;
                case BACKWARD_30:
                    video.currentTime -= 30;
                    break;
                case FORWARD_30:
                    video.currentTime += 30;
                    break;
                case BACKWARD_60:
                    video.currentTime -= 60;
                    break;
                case FORWARD_60:
                    video.currentTime += 60;
                    break;
                case BUTTON_TRIPLE:
                    likeItem = document.querySelector(likeCss);
                    longPress(likeItem);
                    break;
            }
            console.log("now rate is "+playbackRate);
            video = getVideo();
            video.playbackRate = playbackRate;
            if(setSessionRateFlag){
                sessionStorage.setItem("recentRate", playbackRate);
            }

            if(displayRateFlag){
                // 自定义的速度提示
                if(!rawRateBarSite.includes(site)){
                    toolBox.innerText = playbackRate;
                    toolBox.style.display = "block";

                    let showCount = sessionStorage.getItem("show");
                    if(isEmpty(showCount)){
                        sessionStorage.setItem("show", 1);
                    }else{
                        sessionStorage.setItem("show", parseInt(showCount) + 1);
                    }

                    setTimeout(() => {
                        let showCount2 = sessionStorage.getItem("show");
                        if(showCount2 <= 1){
                            toolBox.style.display = "none";
                            sessionStorage.setItem("show", "");
                        }else{
                            sessionStorage.setItem("show", parseInt(showCount2) - 1);
                        }
                    }, DURATION);


                // 原生控制条的速度提示
                }else{
                    showBaiduRateBar(playbackRate);
                    if(site === 1){
                        const element = document.querySelector("#player > div.plugin_ctrl_txp_bottom");
                        element.classList.remove("txp_none");

                        setTimeout(() => {
                            element.classList.add("txp_none");
                        }, DURATION);
                    }
                }

            }

        });
    }

    function isEmpty(item){
        if(item===null || item===undefined || item.length===0){
            return true;
        }else{
            return false;
        }
    }

    function isFullscreen() {
        return (
            document.fullscreenElement ||
            document.msFullscreenElement ||
            document.mozFullScreenElement ||
            document.webkitFullscreenElement ||
            false
        );
    }

    function longPress(element) {
        // 触发鼠标按下事件
        element.dispatchEvent(new MouseEvent('mousedown', { clientX: element.getBoundingClientRect().left + 1, clientY: element.getBoundingClientRect().top + 1 }));

        // 在指定的持续时间后触发鼠标释放事件
        setTimeout(() => {
            element.dispatchEvent(new MouseEvent('mouseup', { clientX: element.getBoundingClientRect().left + 1, clientY: element.getBoundingClientRect().top + 1 }));
        }, 3200);
    }

 function addCustomStyles() {
        var css = `
        .tool-box {
            display: none;   !important;
            position: absolute;   !important;
            bottom: 40%;   !important;
            left: 5%;   !important;
            transform: translate(-50%, 0%);   !important;
            width: 3.3rem;   !important;
            background: rgba(0, 0, 0, 0.7);   !important;
            color: white;   !important;
            padding: 0.5rem;   !important;
            border-radius: 5px;   !important;
            font-size: 1.4rem;   !important;
            text-align: center;   !important;
            z-index: 2147483647   !important;
        }
    `;
        GM_addStyle(css);
    }
    addCustomStyles();


}();