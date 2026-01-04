// ==UserScript==
// @name         U校园增加时长（LuckyM）
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  生命短暂而美好,没时间纠结,没时间计较
// @author       handsometaoa
// @match        https://ucontent.unipus.cn/_pc_default/pc.html?cid=*
// @grant        none
// @license      GPL-3.0
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/497525/U%E6%A0%A1%E5%9B%AD%E5%A2%9E%E5%8A%A0%E6%97%B6%E9%95%BF%EF%BC%88LuckyM%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/497525/U%E6%A0%A1%E5%9B%AD%E5%A2%9E%E5%8A%A0%E6%97%B6%E9%95%BF%EF%BC%88LuckyM%EF%BC%89.meta.js
// ==/UserScript==

// 表示每个页面停留[minMinute分minSeconds秒，maxMinute分钟maxSeconds秒],可以自己设置
var minMinute = 4; // 最小分钟
var minSeconds = 30; // 最小秒数
var maxMinute = 5; // 最大分钟
var maxSeconds = 30; // 最大秒数

// 计算实际停留时间，防止每个页面停留时间相同
function realTime() {
    let rate = Math.random();
    return (minMinute * 60 + minSeconds + ((maxMinute - minMinute) * 60 + maxSeconds - minSeconds) * rate) * 1000;
}

// 自动点击必修弹窗和麦克风弹窗 3000表示延迟3秒，因为弹窗有延迟，主要看反应速度。
setTimeout(() => {
    // 关闭必修提示弹窗
    var x = document.getElementsByClassName("dialog-header-pc--close-yD7oN");
    if (x.length > 0) {
        x[0].click();
    }
    var dialogHeader = document.querySelector("div.dialog-header-pc--dialog-header-2qsXD");
    if (dialogHeader) {
        dialogHeader.parentElement.querySelector('button').click();
    }
}, 3000);

// 自动播放视频
function playVideo() {
    var videos = document.querySelectorAll('video');
    videos.forEach(video => {
        video.play();
    });
}

// 跳转下一节
function switch_next(selector, classFlag) {
    let flag = false;
    for (let [index, unit] of document.querySelectorAll(selector).entries()) {
        if (flag) {
            unit.click();
            // 防止必修弹窗失效，跳转便刷新页面，1000表示跳转1秒后刷新页面
            setTimeout(() => {
                location.reload();
            }, 1000);
            flag = false;
            break;
        }
        if (unit.classList.contains(classFlag)) {
            flag = true;
        }
    }
}

setTimeout(() => {
    playVideo();
}, 4000); // 在页面加载后4秒开始播放视频

setTimeout(() => {
    switch_next('.layoutHeaderStyle--circleTabsBox-jQdMo a', 'selected');
    switch_next('#header .TabsBox li', 'active');
    switch_next('#sidemenu li.group', 'active');
}, realTime());
