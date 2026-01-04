// ==UserScript==
// @name Bilibili自定义倍速播放
// @namespace http://tampermonkey.net/
// @version 0.8
// @description  B站自定义倍速播放
// @updateNote   添加类似 Potplayer 的功能，默认倍速和记忆倍速，方便用户快速切换播放速度；2.修复了某些情况下倍速失效的问题。
// @author 小明
// @license MIT
// @match        https://www.bilibili.com/*
// @icon         chrome://favicon/http://www.bilibili.com/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/456242/Bilibili%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/456242/Bilibili%E8%87%AA%E5%AE%9A%E4%B9%89%E5%80%8D%E9%80%9F%E6%92%AD%E6%94%BE.meta.js
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
    let SPEED_DELTA = GM_getValue("SPEED_DELTA", 0.05);
    // 菜单栏设置项
    let speedEnabled = GM_getValue("speedEnabled", true);
    let timeEnabled = GM_getValue("timeEnabled", true);
    GM_registerMenuCommand("设置倍速步长", setSpeed);
    GM_registerMenuCommand("启用/禁用倍速视频功能", toggleSpeed);
    GM_registerMenuCommand("启用/禁用展示时间信息功能", toggleTime);
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
		//拦截器1
        if (!speedEnabled) {
            // 视频功能禁用
            return
        }
		//拦截器2
		if(iSearching()){
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
                        if (speedEnabled) {
                            video.playbackRate = playbackRate
                            showSpeed(playbackRate)
                        }
                        if (isMultiPVideo) {
                            showRemainingDuration(video.playbackRate)
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
    onReady('.list-box .duration', function () {
        // 兼容性检查
        if (checkThirdPartyScript()) {
            return
        }
        isMultiPVideo = true;
        videoTimes = getVideoTimes();
        showRemainingDuration(video.playbackRate)
    }, 100)
    onReady('.video-episode-card__info', function () {
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
        let lis = document.querySelectorAll('.list-box .duration');
        if (lis.length === 0) {
            lis = document.querySelectorAll('.video-sections-item .video-episode-card__info-duration')
        }
        lis.forEach((currentValue, index) => {
            const time = currentValue.innerText.replace(/\.\d+/g, '');
            videoTimes.push({
                timeStr: time, timeSeconds: timeToSeconds(time)
            });
        });
        return videoTimes;
    }


    function showRemainingDuration(speed = 1) {
        if (!timeEnabled) {
            return
        }
        let currentspeed = speed
        let matches = document.querySelector('.cur-page').innerText.match(/\((\d+)\/(\d+)\)/);
        let start = parseInt(matches[1]);
        let end = parseInt(matches[2]);
        let videoData = document.querySelector('#danmukuBox');
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
            title: '总时长', duration: durationToString(calTime(1, end).total)
        }, {
            title: '已看时长', duration: durationToString(calTime(1, start - 1).total)
        }, {
            title: '剩余时长', duration: durationToString(calTime(start, end).total)
        }, {
            title: '1.5x', duration: durationToString(Math.floor(duration.total / 1.5))
        }, {
            title: '2x', duration: durationToString(Math.floor(duration.total / 2))
        }, {
            title: `${currentspeed}x`, duration: durationToString(Math.floor(duration.total / currentspeed))
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
        const duration = {total: 0, watched: 0, remaining: 0};
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
        var input = prompt("请输入倍速步长（默认0.05）：", SPEED_DELTA);
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
	
	//在搜索栏输入文字时不调整倍速
	function iSearching(){
		let s1 = false;
		let s2 = false;
		//焦点在搜索框	
		if(document.getElementById('nav-searchform').length>0){
			s1 = document.getElementById('nav-searchform').classList.contains('is-actived');
		}
		//焦点在评论区
		if(document.getElementsByClassName('reply-box-textarea').length>0){
			s2 = document.getElementsByClassName('reply-box-textarea')[0].classList.contains('focus');
		}
		let s = s1 || s2;
		return s;
	}
})();

(function () {
	//标题简洁
	setTimeout(function(){
		ptile();
	},6000)
})();


//--------------标题简洁 函数--------------------start
//标题简洁风
function ptile(){
	if(document.getElementsByClassName('base-video-sections-v1') == null){
		return;
	}
    console.info('---ptile---');

	let arr = document.querySelectorAll('.video-episode-card .video-episode-card__info-title');
	let prefix = findPrefix();
	for(var i = 0;i<arr.length;i++){
		var str = arr[i].innerText;
		str = str.replace(prefix,'');
		arr[i].innerText = str;
	}
}

//寻找标题公共前缀
function findPrefix(){
	var prefix = '';
	// NodeList 不是一个数组，是一个类似数组的对象.可以使用 Array.from() 将其转换为数组
	var liArr = document.querySelectorAll('.video-episode-card .video-episode-card__info-title');
	liArr = Array.from(liArr);
	var arr = liArr.map( (item, index) => {
		return item.title
	})

	//console.log("a标签的title集合", arr)
	if(arr.length>=3){

		//随机采样
		var index1 = getRndInteger(0,arr.length);
		var index2 = getRndInteger(0,arr.length);
		var index3 = getRndInteger(0,arr.length);
		var s1s2 = [arr[index1],arr[index2]];
		var s2s3 = [arr[index2],arr[index3]];
		console.info(s1s2);
		console.info(s2s3);
		var s1s2_Pre = longestCommonPrefix(s1s2);
		var s2s3_Pre = longestCommonPrefix(s2s3);
		if(s1s2_Pre == s2s3_Pre){
			prefix = s1s2_Pre;
		}
	}
	return prefix;
}


//JavaScript 最长公共前缀
function longestCommonPrefix(strs) {
    if(strs.length == 0)
        return "";
    let ans = strs[0];
    for(let i =1;i<strs.length;i++) {
        let j=0;
        for(;j<ans.length && j < strs[i].length;j++) {
            if(ans[j] != strs[i][j])
                break;
        }
        ans = ans.substr(0, j);
        if(ans === "")
            return ans;
    }
    return ans;
};

//返回 min（包含）～ max（不包含）之间的数字
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
//--------------标题简洁 函数--------------------end