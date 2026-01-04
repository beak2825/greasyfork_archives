// ==UserScript==
// @name         更明显的哔哩哔哩进度条
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  让哔哩哔哩视频页面的进度条更明显
// @author       beibeibeibei
// @license      MIT
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/bangumi/play/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/503034/%E6%9B%B4%E6%98%8E%E6%98%BE%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%9B%E5%BA%A6%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/503034/%E6%9B%B4%E6%98%8E%E6%98%BE%E7%9A%84%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E8%BF%9B%E5%BA%A6%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    "use strict";
    //isDebugMode默认false
    let isDebugMode = false;
    if (isDebugMode) {
        console.log("更明显的哔哩哔哩进度条脚本已运行");
    }
    //脚本延迟执行时间
    let delay = 6000;
    //进度条高度
    let limit_height = isDebugMode ? 12 : 6;
    //进度条阴影
    let box_shadow = isDebugMode ? "0 0 2px #FF0000" : "0 0 2px #000000";
    //进度条背景颜色
    let bcolor = isDebugMode ? "rgba(24, 26, 27, 1)" : "rgba(24, 26, 27, 0.7)";
    //进度条渐变色背景颜色(默认35px间隔)
    let bcolor2 = isDebugMode
        ? "repeating-linear-gradient(135deg,rgba(255, 255, 255, 0.7),rgba(0, 0, 0, 0.7) 35px),rgba(255, 255, 255, 0.7) 70px"
        : "repeating-linear-gradient(135deg,rgba(120, 130, 135, 0.7),rgba(0, 0, 0, 0.7) 35px),rgba(120, 130, 135, 0.7) 70px";
    //缓冲进度的背景颜色
    let buffer_color = "hsl(196.47deg 100% 90% / 60%)";
    //高能波浪透明度
    let wavefillOpacity = "0.8";
    // 视频底部控制条的背景颜色 // 62.9%是22/35的结果 35是父节点的高，直接设置颜色不好看，用渐变色截断到22的位置比较好看
    let control_color = "linear-gradient(180deg,#80FFFF80 0%,#80FFFF80 62.9%,#00000000 63%)";

    function core() {
        // 进度条有两种类型，分别为操作进度条和贴底边进度条
        let all_progress = document.querySelectorAll(".bpx-player-progress-schedule");
        if (isDebugMode) {
            console.log(all_progress);
        }

        all_progress.forEach(function (progress) {
            //加高
            if (isDebugMode) {
                console.log(
                    "更明显的进度条：进度条原始高度：" +
                        parseFloat(getComputedStyle(progress).height)
                );
            }
            progress.style.height = limit_height + "px";
            //加阴影
            progress.style.boxShadow = box_shadow;
            //背景颜色
            progress.style.backgroundColor = bcolor;
            //渐变色背景颜色
            progress.style.background = bcolor2;
        });

        //这个是贴底边进度条的容器（因为贴底边，不加高看不出来）
        let progress_parent = document.querySelector(".bpx-player-shadow-progress-area");
        progress_parent.style.height = getComputedStyle(
            document.querySelector(".bpx-player-shadow-progress-area .bpx-player-progress-schedule")
        ).height;

        //更明显的高能进度条的高能波浪
        // let wave = document.querySelector(".bpx-player-pbp > svg > g");
        // if (wave) {
        //     wave.style.fillOpacity = wavefillOpacity;
        // }

        //缓冲进度的背景颜色
        //原背景颜色: rgba(24, 26, 27, 0.3)
        //let buffer_color = getComputedStyle(progress.querySelector(".bpx-player-progress-schedule-buffer")).backgroundColor;
        //let buffer_style = document.createElement("style");
        //buffer_style.type = 'text/css';
        //buffer_style.innerHTML = "/*更明显的哔哩哔哩进度条*/.bpx-player-progress-schedule-buffer { background-color: " + buffer_color + "; }";
        //document.head.appendChild(buffer_style);

        //右下角迷你小窗进度条
        //let mini_style = document.createElement("style");
        //mini_style.type = 'text/css';
        //mini_style.innerHTML = "/*更明显的哔哩哔哩进度条*/.bpx-player-mini-warp .bpx-player-mini-progress { height: " + limit_height + "px !important; }";
        //document.head.appendChild(mini_style);

        //创建一个带有id的样式元素, 以免多次运行导致重复添加样式
        if (!document.getElementById("bilibiliClearProgressBarStyles")) {
            let bilibiliClearProgressBarStyles = document.createElement("style");
            bilibiliClearProgressBarStyles.id = "bilibiliClearProgressBarStyles";
            bilibiliClearProgressBarStyles.innerHTML =
                "/*更明显的哔哩哔哩进度条*/" +
                ".bpx-player-pbp > svg > g {fill-opacity: " + wavefillOpacity + "}"+
                ".bpx-player-progress-schedule-buffer { background-color: " + buffer_color + "; }" +
                ".bpx-player-mini-warp .bpx-player-mini-progress { height: " + limit_height + "px !important; }";
            document.head.appendChild(bilibiliClearProgressBarStyles);
        }

        //.bpx-player-ctrl-btn 播放/时间/清晰度/倍速/字幕/音量/设置/画中画/宽屏/网页宽屏/全屏的按钮
        //.bpx-player-control-bottom 这些按钮的父节点
        // let control_btn_color = "rgb(128 255 255 / 40%)";
        // 单独修改每个按钮的背景颜色时, 个别按钮在hover状态时尺寸会变化, 背景颜色可能会突出一块, 不咋好看, 所以直接修改父节点
        // document.querySelectorAll(".bpx-player-ctrl-btn").forEach((btn)=>{
        //     btn.style.backgroundColor = control_btn_color;
        //     btn.style.boxShadow = control_btn_color + "0px 0px 3px ";
        // });
        // document.querySelector(".bpx-player-ctrl-btn.bpx-player-ctrl-quality").style.boxShadow = control_btn_color + " 10px 0px 3px";
        let control = document.querySelector(".bpx-player-control-bottom");
        control.style.background = control_color;
    }

    //右键菜单
    let id = GM_registerMenuCommand("手动执行", () => {
        core();
    });

    setTimeout(() => {
        requestIdleCallback((deadline) => {
            core();
        });
    }, delay);
    // Your code here...
})();
