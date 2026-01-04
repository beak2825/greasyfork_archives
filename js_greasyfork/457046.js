// ==UserScript==
// @name         沈阳市信息工程学校雨课堂/学堂云平台刷课脚本
// @name:zh-TW   瀋陽市信息工程學校雨課堂/（學堂雲）網課自動化腳本
// @namespace    自动化辅助
// @version      1.1
// @description  校网课型公共基础课线上平台自动化辅助
// @description:zh-TW  校網路公共基礎課程數位平台輔助
// @author       2022InternetofThings_LingBowen
// @icon         https://qn-next.xuetangx.com/15795112672513.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @match        https://syxxgc.yuketang.cn/pro/*
// @run-at       document-end
// @license      MIT
// @require https://cdn.bootcss.com/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/457046/%E6%B2%88%E9%98%B3%E5%B8%82%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%AD%A6%E6%A0%A1%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%AD%A6%E5%A0%82%E4%BA%91%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/457046/%E6%B2%88%E9%98%B3%E5%B8%82%E4%BF%A1%E6%81%AF%E5%B7%A5%E7%A8%8B%E5%AD%A6%E6%A0%A1%E9%9B%A8%E8%AF%BE%E5%A0%82%E5%AD%A6%E5%A0%82%E4%BA%91%E5%B9%B3%E5%8F%B0%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 多长时间刷新一下页面，单位 分钟
    const reloadTime = 10;
    // 视频播放速率,可选值 [1,1.25,1.5,2],默认为二倍速
    const rate = 2;

    window.onload = function () {
        // 网课页面跳转
        function getElTooltipItemList() {
            return document.getElementsByClassName("el-tooltip leaf-detail");
        }

        function getElTooltipList() {
            return document.getElementsByClassName("el-tooltip f12 item");
        }

        // 静音
        function claim() {
            $(
                "#video-box > div > xt-wrap > xt-controls > xt-inner > xt-volumebutton > xt-icon"
            ).click();
        }

        function fun(className, selector)
        {
            var mousemove = document.createEvent("MouseEvent");
            mousemove.initMouseEvent("mousemove", true, true, unsafeWindow, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, null);
            document.getElementsByClassName(className)[0].dispatchEvent(mousemove);
            document.querySelector(selector).click();
        }

        // 加速
        function speed() {
            let keyt = '';
            if(rate === 2 || rate === 1){
                keyt = "[keyt='" + rate + ".00']"
            }else{
                keyt = "[keyt='" + rate + "']"
            }
            fun("xt_video_player_speed", keyt);
        }



        const getElementInterval = setInterval(function () {
            const elTooltipList = getElTooltipList();
            const elTooltipItemList = getElTooltipItemList();
            if (elTooltipList) {
                for (let index = 0; index < elTooltipList.length; index++) {
                    const element = elTooltipList[index];
                    const textContent = element.textContent;
                    //const textContent = ''
                    if (textContent === "未开始" || textContent === "未读") {
                        // 判断是否是习题
                        if(elTooltipItemList[index].innerText.indexOf('习题')!= -1){
                            continue;
                        }
                        if(elTooltipItemList[index].innerText.indexOf('作业')!= -1){
                            continue;
                        }
                        // 判断是否已过学习时间
                        if (elTooltipItemList[index].children[1].children[0].innerText.indexOf("已过") != -1) {
                            continue;
                        }
                        window.clearInterval(getElementInterval);
                        GM_setValue("rowUrl", window.location.href.toString());
                        // 网课页面跳转
                        elTooltipItemList[index].click();
                        window.close();
                        break;
                    }
                }
            }
        }, 1000);

        let video;
        const videoPlay = setInterval(function () {
            // 获取播放器
            video = document.getElementsByClassName("xt_video_player")[0];
            if (!video) {
                return;
            }
            setTimeout(function () {
                // 视频开始5s之后再开启倍速
                speed()
            },5000);
            claim();
            window.clearInterval(videoPlay);
        }, 500);

        // 是否播放完成的检测
        const playTimeOut = setInterval(function () {
            if (!video) {
                return;
            }
            video.play();

            // 没有静音
            if (video.volume != 0) {
                claim();
            }
            const completeness = $(
                "#app > div.app-wrapper > div.wrap > div.viewContainer.heightAbsolutely > div > div.video-wrap > div > div > section.title > div.title-fr > div > div > span"
            );
            if (!completeness) {
                return;
            }
            if (typeof completeness[0] == "undefined") {
                return;
            }
            const videoText = completeness[0].innerHTML
            if (videoText) {
                let str = videoText.toString();
                const succ = str.substring(4, str.length - 1);
                const succNum = parseInt(succ);
                if (succ >= 95) {
                    const url = GM_getValue("rowUrl");
                    if(url){
                        window.clearInterval(playTimeOut);
                        window.location.replace(url);
                    }
                }
            }

        }, 1000);

        // 是否为阅读类型
        const readInterval = setInterval(function () {
            const read = $(
                "#app > div.app-wrapper > div.wrap > div.viewContainer.heightAbsolutely > div > div.graph-wrap > div > div > section.title > div.title-fr > div > div"
            );
            if(!read){
                return
            }
            if (typeof read[0] == "undefined") {
                return;
            }
            const readText = read[0].innerHTML
            if(readText){
                if(readText.toString() === '已读'){
                    window.clearInterval(readInterval);
                    window.location.replace(GM_getValue("rowUrl"));
                }
            }
        }, 1000);

        // 为了防止页面假死，定时刷新一下页面
        setTimeout(function () {
            // 如果保存了课程列表路径就回退的课程列表页面
            if(GM_getValue("rowUrl")){
                window.location.replace(GM_getValue("rowUrl"));
            }
            location.reload()
        },reloadTime * 60 * 1000);
    };
})();
