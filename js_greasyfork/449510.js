// ==UserScript==
// @name         天津培训网-网课直通
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  适用于天津事业单位培训网的课程学习。使用方法：进入视频页面后刷新，即可快速学完整门课！
// @license      MIT
// @author       newwbbie
// @match        https://web.chinahrt.com/*
// @match        https://videoadmin.chinahrt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chinahrt.com
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449510/%E5%A4%A9%E6%B4%A5%E5%9F%B9%E8%AE%AD%E7%BD%91-%E7%BD%91%E8%AF%BE%E7%9B%B4%E9%80%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/449510/%E5%A4%A9%E6%B4%A5%E5%9F%B9%E8%AE%AD%E7%BD%91-%E7%BD%91%E8%AF%BE%E7%9B%B4%E9%80%9A.meta.js
// ==/UserScript==

$(document).ready(function () {
    let url = window.location.href;

    // v_selected_course, v_courseDetails
    if (url.indexOf('v_courseDetails') > -1) {
        var startStudy = setInterval(() => {
            let flag = 0
            $('.course-h .cb li .fr').map((item, index, arr) => {
                if (flag == 0) {
                    console.log(index.innerHTML)
                    if (index.innerHTML.indexOf('学习中') > -1) {
                        flag = 1
                        index.click()
                        console.log('开始学习')
                        clearInterval(startStudy)
                    }
                }
            })
        }, 800)
    } else if (url.indexOf('v_video') > -1) {
        setTimeout(() => {
            var e = $("#iframe");
            let s = e.prop('src');
            s = s.replace('ifDrag=0','ifDrag=1');
            s = s.replace('allow_study_same_time=0','allow_study_same_time=1');
            e.prop({'src': s});
        }, 3000)
    } else if (url.indexOf('videoadmin.chinahrt.com') > -1) {
        let randNum = 0;
        var checkVideoPlayingInterval = setInterval(() => {
            let video = null;
            let pauseButton = null;
            video = document.getElementsByTagName("video")[0];
            pauseButton = document.getElementsByClassName("pausecenterchidwhvosfvt")[0];
            let temp = {
                "video": video,
                "pauseButton": pauseButton
            };
            if (temp.video) {
                if (!temp.video.muted) {
                    temp.video.muted = true;
                }
                if (temp.video.paused) {
                    temp.video.paused = false;
                    console.log("正在尝试播放视频")
                    if (randNum == 0) {//尝试使用js的方式播放
                        try {
                            temp.video.play();//尝试使用js的方式播放
                        } catch (e) { }
                        randNum++;
                    } else {
                        try {
                            temp.pauseButton.click();//尝试点击播放按钮播放
                        } catch (e) { }
                        randNum--;
                    }
                } else {
                    console.log("成功播放")
                    clearInterval(checkVideoPlayingInterval);
                    let max = document.querySelector('video').duration
                    console.log(max)
                    document.querySelector('video').currentTime = max
                }
            } else {
                console.log("等待加载")
            }
        }, 800);
    }
})