// ==UserScript==
// @name         慕享刷课
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  慕享自动刷课脚本
// @antifeature  慕享自动刷课脚本
// @author       zhanghua65
// @license      MIT
// @match        *://*.moycp.com/*
// @grant        window.onurlchange
// @require      https://lib.baomitu.com/jquery/2.1.4/jquery.min.js
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/450091/%E6%85%95%E4%BA%AB%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/450091/%E6%85%95%E4%BA%AB%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

var setting = {
        // 自动登录功能配置区
        //登录账号
        username: '',
        //登录密码
        password: '',
        isLogin: true,
        //分数未满40分
        mark: '40分',
        //默认 播放速度 1.5
        playbackRate: 1.5,
        play: false,
        timer: '',
        courseIndex: 0
    }, _self = unsafeWindow,
    url = location.pathname;

$(function () {
    'use strict';

    function init() {
        let urls = location.pathname;
        switch (urls) {
            case '/login':
                //登录
                console.log("登录");
                login();
                break;
            case '/studyCenter/studying':
                //学习中心
                console.log("学习中心");
                studying();
                break;
            case '/courseDetail/catalog':
                //课程目录
                console.log("课程目录");
                catalog();
                break;
            case '/courseware2':
                //观看视频
                console.log("观看视频");
                courseware2();
                break;
            default:
                location.href = "https://web.moycp.com/login";
                break
        }
    }

    //自动登录
    function login() {
        if (!setting.username && !setting.password) {
            return;
        }
        console.log("登录ing");
        let object = $(".choosed[style='display: none;']")
        if (object == null) {
            $(".free-login").click();
        } else {
            console.log("已经勾选")
        }
        $(":text").attr("autocomplete", "off");
        $(":password").attr("autocomplete", "new-password");
        var focus = new Event('focus');
        var input = new Event('input');
        var change = new Event('change');
        var blur = new Event('blur');

        let username = document.getElementsByClassName("username")[0];
        username.value = setting.username;
        username.dispatchEvent(focus);
        username.dispatchEvent(input);
        username.dispatchEvent(change);
        username.dispatchEvent(blur);
        let password = document.getElementsByClassName("password")[0];
        password.value = setting.password;
        password.dispatchEvent(focus);
        password.dispatchEvent(input);
        password.dispatchEvent(change);
        password.dispatchEvent(blur);
        //七天自动登录
        if (setting.isLogin) {
            $(".el-button.login-btn").click();
            setting.isLogin = false
        }
    }

    //选择未学习的课程 （ 分数未满40分）
    function studying() {
        let infoList = document.querySelectorAll(".detail-info");
        for (let i = 0; i < infoList.length; i++) {

            let courseName = infoList[i].getElementsByClassName("course-name")[0].innerText;
            //跳过新手课程
            console.log("courseName", courseName);
            if (courseName.indexOf("新手课程") === -1) {
                let score = infoList[i].getElementsByClassName("score")[0].innerText;
                if (score.indexOf(setting.mark) === -1) {
                    infoList[i].getElementsByClassName("learn")[0].click();
                    break;
                }
            }
        }
    }

    function catalog() {
        //显示所有的课件和闯关
        let oStudy = document.querySelectorAll(".study-buttons");
        if (oStudy.length !== 0) {
            for (let i = 0; i < oStudy.length; i++) {
                oStudy[i].style.display = "flex"
            }
            //找到列表中未完成的课
            let oDt = document.getElementsByTagName("dd");
            for (let i = 0; i < oDt.length; i++) {
                let oProgress = oDt[i].getElementsByClassName("progress");
                for (let j = 0; j < oProgress.length; j++) {
                    let oSpan = oProgress[j].lastChild;
                    if (oSpan.style.width !== '100%') {
                        let studys = oDt[i].getElementsByClassName("study")[0];
                        if (studys.innerText === '课件') {
                            oDt[i].getElementsByClassName("study")[0].click();
                            return
                        }
                    }
                    if (i === oDt.length - 1) {
                        location.href = "https://web.moycp.com/studyCenter/studying";
                    }
                }
            }
        }
    }

    function courseware2() {
        // 查询播放进度
        let text = $(".vertical-line-right > .alreadystudy").text();
        let playerDocument = document.getElementById("player");
        // 检查加载动画是否隐藏
        let isLoadingVisible = $("div.pv-loading").is(':visible');
        if (playerDocument && !isLoadingVisible) {
            // 判断视频插件加载
            let videoElements = playerDocument.getElementsByTagName("video");
            // 判断视频出现在正中央
            if (playerDocument.children.length > 0 && videoElements.length > 0) {
                if (text.indexOf("100%") === -1) {
                    // console.log("未完成的视频，需要开始播放");
                    iconfontClick();
                } else {
                    // console.log("进入已经播放完成的视频");
                    nextSection();
                }
            }
        }
    }

    //点击按钮   开始按钮 \ue653  暂停按钮
    function iconfontClick() {
        if ($("pv-controls > pv-controls-left")) {
            var leftDocument = document.getElementsByClassName("pv-controls-left");
            let video = document.getElementsByTagName("video")[0];
            if (leftDocument !== null && leftDocument !== undefined && leftDocument !== '') {
                let pvButton = $(".pv-controls-left > button:first");
                let maxProgress = $(".pv-progress-current:first").css("width");
                let Progress = $(".pv-progress-current > .pv-progress-current-bg:first").css("width");
                if (maxProgress === Progress && pvButton.hasClass("pv-icon-btn-play")) {
                    // console.log("播放完成，自动停止");
                    nextSection();
                } else if (pvButton.hasClass("pv-icon-pause")) {
                    // console.log("播放中");
                } else {
                    // console.log("未开始播放")
                    let volumebtn = $("button.pv-volumebtn:first");
                    if (volumebtn.hasClass("pv-icon-volumeon")) {
                        volumebtn.click();
                        $("div.pv-volume-current").css("height", "0%");
                    }
                    video.muted = "0";
                    video.playbackRate = setting.playbackRate;
                    pvButton.click()
                }
            }
        }
    }

    function nextSection() {
        // huang
        // 获取课程全部元素
        let section = $("dd > .catalog-item-section-col2:not(.finish)").parent(".catalog-item-section");
        //已经刷完的跳转 主页
        if (section && section.length > 0) {
            for (let i = 0; i < section.length; i++) {
                // 获取当前选中元素
                let node = section[i];
                if (!node.classList.contains("current")) {
                    node.click();
                    return
                }
                if (i === section.length - 1) {
                    location.href = "https://web.moycp.com/studyCenter/studying";
                }
            }
        } else {
            location.href = "https://web.moycp.com/studyCenter/studyin";
        }
    }

    setting.timer = setInterval(function () {
        if (window.onurlchange === null) {
            // 监听url变化
            window.addEventListener('urlchange', (info) => {
                console.log("变化", info);
                console.log("我运行了");
            });
            // 判断页面是否加载完成
            if (document.readyState === "complete") {
                init();
            }
        }
    }, 500);
});
