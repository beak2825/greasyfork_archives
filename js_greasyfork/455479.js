// ==UserScript==
// @name         青书学堂_自动播放
// @namespace    guokwa.com
// @version      0.4
// @description  青书学堂自动后台静音播放，章节跳过。
// @author       七言
// @match        *://*.qingshuxuetang.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @require           https://unpkg.com/jquery@3.6.0/dist/jquery.min.js
// @license GPL
// @downloadURL https://update.greasyfork.org/scripts/455479/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82_%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/455479/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82_%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

// 添加倍速播放
(
    function () {
        var href = window.location.href
        if (href.indexOf('nodeId') > -1) {
            setTimeout(() => {
                let params = new UrlSearch()
                videoPlay(params)
            }, 5000);
        }
    }
)()

// 获取浏览器参数
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for (var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if (num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
}


// 函数抽离
function videoPlay(params) {
    let video = document.getElementsByTagName('video')[0]
    let currentTime = video.currentTime.toFixed(1)
    console.log('播放进度',currentTime);
    if (!video.src) {
        nexVideoUrl(video, params, false)
    } else {
        createHTML()
        addStyle()
        // 获取播放速度参数
        let speedData = GM_getValue('Speed')
        if (speedData) {
            video.playbackRate = speedData
        } else {
            video.playbackRate = 1 // 默认一倍速播放
        }
        video.muted = true // 静音播放
        video.play()
        nexVideoUrl(video, params, true)
    }


}

// 下一个视频播放链接
function nexVideoUrl(video, params, isVideo) {
    let { courseId, teachPlanId, periodId } = params
    let courseArr = params.nodeId.split('_')

    let nextKey = "" // 下一个视频的key

    if (courseArr.length == 2) {
        nextKey = `kcjs_${Number(courseArr[1]) + 1}`
    } else if (courseArr.length == 3) {
        if (!isVideo) {
            nextKey = `kcjs_${Number(courseArr[1]) + 1}_${Number(1)}`
        } else {
            nextKey = `kcjs_${courseArr[1]}_${Number(courseArr[2]) + 1}`
        }
    }
    const nextUrl = `https://${window.location.host}${window.location.pathname}?teachPlanId=${teachPlanId}&periodId=${periodId}&courseId=${courseId}&nodeId=${nextKey}`

    if (!isVideo) {
        location.replace(nextUrl)
    } else {
        video.addEventListener('ended', function () {
            location.replace(nextUrl)
        })
    }
}

// 设置倍速html 和 样式
function createHTML() {
    let video = document.getElementsByTagName('video')[0]
    var videoContral = `
    <div class="btnList">

        <p>设置播放速度</p>
        <div class="one">1 倍速</div>
        <div class="two">2 倍速</div>
        <div class="thre">3 倍速</div>
    </div>`
    $("body").append(videoContral)
    // 点击事件
    $('.one').click(() => {
        video.playbackRate = 1
        GM_setValue('Speed', 1)
    })

    $('.two').click(() => {
        video.playbackRate = 2
        GM_setValue('Speed', 2)
    })
    $('.thre').click(() => {
        video.playbackRate = 3
        GM_setValue('Speed', 3)
    })
}
function addStyle() {
    let css = `
    .btnList{
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 9999;
        border: 1px solid #ccc;
        height: 100px;
        width: 100px;
        background: white;
    }
    .btnList p {
        color: red;
    }
    .btnList div{
        width: 100%;
        height: 20px;
        text-align: center;
        line-height: 20px;
        cursor: pointer;
        background: #ccc;
        margin-top: 5px;
    }
    `
    GM_addStyle(css)
}
