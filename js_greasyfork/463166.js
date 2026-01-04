// ==UserScript==
// @name 🚀哔哩哔哩（bilibili)倍速与多P剩余时长显示增强脚本
// @namespace http://tampermonkey
// @version 2.7
// @description  🌟让您的b站（bilibili，哔哩哔哩）视频观看更加轻松愉快！本脚本支持：⭐倍速播放：按下 "Z" 恢复默认速度， "X" 降低速度， "C" 加快速度⭐显示多 P 视频的剩余时间,让您掌握自己的观看进度，随时调整观看计划！⭐屏蔽adblock导致的提示框，快来试试吧！🎉
// @updateNote   v2.7 - 菜单项增加了「启用/禁用记忆倍速」功能。
// @updateNote   v2.6 - 修复了切换视频时间统计不更新的问题。
// @updateNote   v2.5 - 修复了视频跳转、页面显示相关问题。
// @updateNote   v2.4 - 修复了某些情况下多P失效的问题。
// @updateNote   v2.3 - 现在按下 'Z' 键可以切换默认倍速和记忆倍速，修复了某些情况下倍速失效的问题。
// @updateNote   v2.2 - 速度调节提示框位置优化，屏蔽adblock提示。
// @updateNote   v2.1 - 倍速步长调节（默认0.1），倍速功能启用/禁用，多P视频信息剩余时间展示启用/禁用。
// @updateNote   v2.0 - 增加了倍速功能，每次步进为0.25，记忆上一次播放速度，优化多P视频信息剩余时间计算性能，修复了已知的一些问题，提高了脚本的稳定性和兼容性。
// @updateNote   v1.1 - 开源协议调整。
// @updateNote   v1.0 - 第一版发布，多P视频的剩余时间显示。
// @author txsxcy
// @license GPL
// @match         *://www.bilibili.com/*
// @icon         chrome://favicon/http://www.bilibili.com/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/463166/%F0%9F%9A%80%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%29%E5%80%8D%E9%80%9F%E4%B8%8E%E5%A4%9AP%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/463166/%F0%9F%9A%80%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%EF%BC%88bilibili%29%E5%80%8D%E9%80%9F%E4%B8%8E%E5%A4%9AP%E5%89%A9%E4%BD%99%E6%97%B6%E9%95%BF%E6%98%BE%E7%A4%BA%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const style = `
     .video-info {
        overflow: hidden;
        text-align: center;
        box-sizing: border-box;
        height: 100%;
        width: 100%;
        background-color: rgb(241, 242, 243);
        border-radius: 6px;
        font-size: 15px;
        line-height: 30px;
        margin-bottom: 25px;
        padding: 10px 10px 0px 10px;
        pointer-events: all;
    }

    .video-info li {
        width: 30%;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
        list-style: none;
    }

    .video-info ul li:hover {
        background-color: rgb(255, 255, 255);
        border-radius: 12px;
        color: #00aeec;
        cursor:pointer

    }

    .video-info ul li:hover span {
        color: #00aeec;
    }

    .video-info span {
        display: block;
        width: 100%;
    }

    .video-info li span:first-child {
        color: #222;
        font-weight: 700;
    }

    .video-info li span:last-child {
        font-size: 12px;
        color: #18191c;
    }
    `;
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
})();
(function () {
    'use strict';
    const style = `
    #speed {
      position: absolute;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 50%;
      left: 50%;
      width: 100px;
      height: 32px;
      padding: 8px;
      color: #000;
      font-size: 20px;
      border-radius: 7px;
      background-color: hsla(0, 0%, 100%, .6);
      transform: translate(-50%, -50%);
      z-index: 77;
      visibility: hidden;
    }
  `;
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
})();
(function () {
    // 隐藏adblock提示
    let banner = document.querySelector('.adblock-tips');
    if (banner) {
        // 隐藏横幅元素
        banner.style.display = 'none';
    }
})();
(function () {
    const SPEED_INTERVAL = 1000
    // 倍速步长
    let SPEED_DELTA = GM_getValue("SPEED_DELTA", 0.1);
    // 菜单栏设置项
    let speedEnabled = GM_getValue("speedEnabled", true);
    let timeEnabled = GM_getValue("timeEnabled", true);
    // 存储记忆倍速的状态
    let rememberSpeedEnabled = GM_getValue("rememberSpeedEnabled", true);
    GM_registerMenuCommand("设置倍速步长", setSpeed);
    GM_registerMenuCommand("启用/禁用倍速视频功能", toggleSpeed);
    GM_registerMenuCommand("启用/禁用展示时间信息功能", toggleTime);
    GM_registerMenuCommand("启用/禁用记忆倍速", toggleRememberSpeed);
    // 原始播放速度
    let originalPlaybackRate = 1
    // 是否多p视频
    let isMultiPVideo = false
    //实现保存Z键切换速率
    let savedSpeed = 1
    let video = document.querySelector('video') || document.querySelector('bwp-video')
    if (speedEnabled) {
        // 初始化倍速
        let playbackRateStorage = localStorage.getItem('playbackRate')
        if (playbackRateStorage) {
            originalPlaybackRate = parseFloat(playbackRateStorage)
        }
        // 保存初始倍速
        if (video) {
            video.playbackRate = originalPlaybackRate
        }
    }
    // 对按键监听函数进行节流
    const throttleKeydown = throttle((event) => {
        if (!speedEnabled) {
            // 视频功能禁用
            return
        }
        if (!event.ctrlKey) {
            let video = document.querySelector('video') || document.querySelector('bwp-video')

            let keyValue = event.key.toUpperCase()
            if (keyValue === 'X' && video.playbackRate > SPEED_DELTA) {
                video.playbackRate = formatNumber(video.playbackRate - SPEED_DELTA)
                showSpeed(video.playbackRate)
            }
            if (keyValue === 'C' && video.playbackRate < 16) {
                video.playbackRate = formatNumber(video.playbackRate + SPEED_DELTA)
                showSpeed(video.playbackRate)
            }
            if (keyValue === 'Z') {
                if (video.playbackRate === 1) {
                    video.playbackRate = savedSpeed
                } else {
                    savedSpeed = video.playbackRate
                    video.playbackRate = 1
                }
                showSpeed(video.playbackRate)

            }

            localStorage.setItem('playbackRate', video.playbackRate.toString())
            if (isMultiPVideo) {
                showRemainingDuration(video.playbackRate)
            }
        }
    })
    // 对 document 的 keydown 事件进行绑定，调用节流函数
    document.addEventListener('keydown', throttleKeydown)
    // 监听 URL 变化并恢复倍速
    let currentUrl = window.location.href
    setInterval(() => {

        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href
            if (video) {
                let playbackRateStorage = localStorage.getItem('playbackRate')
                if (playbackRateStorage) {
                    let playbackRate = parseFloat(playbackRateStorage)
                    if (playbackRate !== video.playbackRate) {
                        // 如果记忆倍速被启用，则恢复上次播放速度
                        if (rememberSpeedEnabled) {
                            if (playbackRate !== video.playbackRate) {
                                video.playbackRate = playbackRate;
                                showSpeed(playbackRate);
                            }
                        } else {
                            // 禁用记忆倍速时，设置为默认倍速1
                            video.playbackRate = 1;
                            showSpeed(video.playbackRate);
                        }
                        if (isMultiPVideo) {
                            setTimeout(() => {
                                showRemainingDuration(video.playbackRate);
                            }, 500);
                        }
                    }
                }
            }
        }
    }, 100)
    let videoTimes = [];

    // 等待元素加载完成
    onReady('.bpx-player-video-area', function () {
        const div = document.createElement('div');
        div.setAttribute('id', 'speed');
        div.innerHTML = '<span></span>';
        document.querySelector('.bpx-player-video-area').appendChild(div);
    }, 100)

    onReady('.stats .duration', function () {
        setTimeout(() => {
            // 兼容性检查
            if (checkThirdPartyScript()) {
                return
            }
            isMultiPVideo = true;
            videoTimes = getVideoTimes();
            showRemainingDuration(video.playbackRate);
        }, 3000);
    }, 100)

    // 小数精度处理
    function formatNumber(num) {
        let decimalNum = Number(num.toString().match(/\.\d+/));
        if (isNaN(decimalNum)) {
            return num;
        } else if (decimalNum === Math.round(decimalNum)) {
            return num.toFixed(1);
        } else {
            return num.toFixed(2);
        }
    }

    // 设置节流函数
    function throttle(fn) {
        let timer = null
        return function (...args) {
            if (!timer) {
                timer = setTimeout(() => {
                    fn.apply(this, args)
                    timer = null
                }, 100)
            }
        }
    }

    // 获取视频播放时间数组
    function getVideoTimes() {
        if (videoTimes.length > 0) {
            return videoTimes;
        }
        let lis = document.querySelectorAll('.stats .duration');
        if (lis.length === 0) {
            lis = document.querySelectorAll('.video-sections-item .video-episode-card__info-duration')
        }
        lis.forEach((currentValue, index) => {
            const time = currentValue.innerText.replace(/\.\d+/g, '');
            videoTimes.push({
                timeStr: time,
                timeSeconds: timeToSeconds(time)
            });
        });
        return videoTimes;
    }


    function showRemainingDuration(speed = 1) {
        if (!timeEnabled) {
            return
        }
        let currentspeed = speed
        let matches = document.querySelector('.amt').innerText.match(/\（(\d+)\/(\d+)\）/);
        let start = parseInt(matches[1]);
        let end = parseInt(matches[2]);
        let videoData = document.querySelector('#danmukuBox');
        // let videoData = document.querySelector('#viewbox_report');
        let duration = calTime(start, end);
        // 获取要插入的元素的父元素
        let parent = videoData.parentElement;
        // 查找是否有类名为 "video-info" 的元素
        let info = parent.querySelector(".video-info");
        // 如果存在，则删除它
        if (info) {
            info.remove();
        }
        const videoInfo = [{
            title: '总时长',
            duration: durationToString(calTime(1, end).total)
        }, {
            title: '已看时长',
            duration: durationToString(calTime(1, start - 1).total)
        }, {
            title: '剩余时长',
            duration: durationToString(calTime(start, end).total)
        }, {
            title: '1.5x',
            duration: durationToString(Math.floor(duration.total / 1.5))
        }, {
            title: '2x',
            duration: durationToString(Math.floor(duration.total / 2))
        }, {
            title: `${currentspeed}x`,
            duration: durationToString(Math.floor(duration.total / currentspeed))
        }];

        let html = '';
        videoInfo.forEach(info => {
            html += `<li>
            <span>${info.title}</span>
            <span>${info.duration}</span>
        </li>`;
        });

        html = `<div>
            <ul>
                ${html}
            </ul>
        </div>`;

        videoData.insertAdjacentHTML('afterend', `<div class="video-info">${html}</div>`);


    }

    // 根据视频播放时间数组和范围计算时间数据
    function calTime(start, end) {
        const duration = {
            total: 0,
            watched: 0,
            remaining: 0
        };
        const endIndex = Math.min(videoTimes.length, end);
        for (let i = start - 1; i < endIndex; i++) {
            const data = videoTimes[i];
            if (i < end - 1) {
                duration.watched += data.timeSeconds;
            } else {
                duration.remaining += data.timeSeconds;
            }
            duration.total += data.timeSeconds;
        }
        return duration;
    }

    // 秒转hh:mm:ss
    function durationToString(duration) {
        const h = parseInt(duration / 3600);
        const m = parseInt(duration / 60) % 60;
        const s = duration % 60;

        if (h > 0) {
            return `${h}h ${m}min ${s}s`;
        } else {
            return `${m}min ${s}s`;
        }
    }

    // 等待元素加载完成函数
    function onReady(selector, func, times = -1, interval = 20) {
        let intervalId = setInterval(() => {
            if (times === 0) {
                clearInterval(intervalId)
            } else {
                times -= 1
            }
            if (document.querySelector(selector)) {
                clearInterval(intervalId)
                func()
            }
        }, interval)
    }

    // 显示速度函数
    function showSpeed(speed, index = 1) {
        let speedDiv = document.querySelector(`#speed`);
        if (!speedDiv) {
            const div = document.createElement('div');
            div.setAttribute('id', 'speed');
            div.innerHTML = '<span></span>';
            document.querySelector('.bpx-player-video-area').appendChild(div);
            speedDiv = div;
        }
        let speedSpan = speedDiv.querySelector('span')
        if (index == 1) {
            speedSpan.innerHTML = `${speed} X`
        } else {
            speedSpan.innerHTML = `${speed}`
        }
        speedDiv.style.visibility = 'visible'
        clearTimeout(window.speedTimer)
        window.speedTimer = setTimeout(() => {
            speedDiv.style.visibility = 'hidden'
        }, SPEED_INTERVAL)
    }

    // 检测第三方倍速插件
    function checkThirdPartyScript() {
        //没有开倍速就不用检测了
        if (!speedEnabled) {
            return false
        }
        if (document.querySelector(".html_player_enhance_tips")) {
            document.querySelector('#danmukuBox').insertAdjacentHTML('afterend', `<div class="video-info"><div> 请禁用第三方倍速脚本<br>- 🚀Bilibili 倍速与多P剩余时长显示增强脚本 - </div></div>`);
            return true;
        } else {
            return false;
        }
    }

    // 将时间字符串转换为秒数
    function timeToSeconds(time) {
        const timeArr = time.split(':');
        let timeSeconds = 0;
        if (timeArr.length === 3) {
            timeSeconds += Number(timeArr[0]) * 60 * 60;
            timeSeconds += Number(timeArr[1]) * 60;
            timeSeconds += Number(timeArr[2]);
        } else {
            timeSeconds += Number(timeArr[0]) * 60;
            timeSeconds += Number(timeArr[1]);
        }
        return timeSeconds;
    }

    // 菜单栏切换倍速功能状态
    function toggleSpeed() {
        speedEnabled = !speedEnabled;
        GM_setValue("speedEnabled", speedEnabled);
        if (speedEnabled) {
            showSpeed("倍速：启用", 2)
        } else {
            showSpeed("倍速：禁用", 2)
        }
    }

    // 菜单栏切换时间展示功能状态
    function toggleTime() {
        timeEnabled = !timeEnabled;
        GM_setValue("timeEnabled", timeEnabled);
        if (timeEnabled) {
            showSpeed("展示：启用", 2)
            showRemainingDuration(video.playbackRate);
        } else {
            showSpeed("展示：禁用", 2)
            let info = document.querySelector('#danmukuBox').parentElement.querySelector(".video-info");
            // 如果存在，则删除它
            if (info) {
                info.remove();
            }
        }
    }

    // 菜单栏设置倍速步长
    function setSpeed() {
        var input = prompt("请输入倍速步长（默认0.1）：", SPEED_DELTA);
        if (input === null) {
            return;
        }
        if (isNaN(input) || input === "") {
            alert("请输入数字！");
        } else {
            if (Number(input) > 0) {
                SPEED_DELTA = Number(input);
                GM_setValue("SPEED_DELTA", SPEED_DELTA);
            }
        }
    }

    //  菜单栏切换记忆倍速功能的状态
    function toggleRememberSpeed() {
        rememberSpeedEnabled = !rememberSpeedEnabled;
        GM_setValue("rememberSpeedEnabled", rememberSpeedEnabled);
        if (rememberSpeedEnabled) {
            showSpeed("记忆倍速：启用", 2)
        } else {
            showSpeed("记忆倍速：禁用", 2)

        }
    }
})
()