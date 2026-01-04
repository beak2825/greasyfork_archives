// ==UserScript==
// @name         风纪委员投票
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/asksowhat/BilibiliVote
// @version      0.1.1
// @description  b站风纪委员投票助手
// @license MIT
// @author       asksowhat
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com
// @match        https://www.bilibili.com/judgement*
// @grant        window.close
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/452475/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/452475/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = main;
    async function main() {
        //在此时间段不运行
        if (await checkAuditTime("01:00", "7:00")){
            window.location.href="https://www.bilibili.com/judgement/index";
            return;
        }
        setTimeout(await enterVotePage, 3000);
        setTimeout(await optionsVote, 10000 + Math.round(Math.random()*10)*1000);
        setTimeout(await submitVote, 30000 + Math.round(Math.random()*10)*1000);
        setTimeout(await nextVote, 50000 + Math.round(Math.random()*10)*1000);
        setTimeout(await isClosePage, 64000 + Math.round(Math.random()*10)*1000);
    }

    async function enterVotePage(){
        var buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            if (buttons[i].innerText == "开始众议") {
                buttons[i].click();
                break;
            } else if (buttons[i].innerText == "无新任务") {
                await reload();
            }
        }
    }

    async function reload() {
        location.reload();
    }

    async function optionsVote(){
        var buttons = document.getElementsByTagName("button");
        let option_num_feel = Math.round(Math.random()*10);
        let option_num_view = Math.round(Math.random()*20)
        for (let i=0; i < buttons.length; i++) {
            let buttonName = buttons[i].innerText;
            //类型

            GM_log("num:"+option_num_feel);
            if ((buttonName == "好" || buttonName == "合适") && (option_num_feel == 1 || option_num_feel == 2 || option_num_feel%3 == 0)) {
                buttons[i].click();
            } else if ((buttonName == "普通" || buttonName == "中" || buttonName == "一般") && option_num_feel == 4) {
                buttons[i].click();
            } else if ((buttonName == "差" || buttonName == "不合适") && option_num_feel == 8) {
                buttons[i].click();
            }else if (buttonName == "无法判断" && (option_num_feel == 5 || option_num_feel == 7)) {
                buttons[i].click();
            }

            //是否会观看此视频

            if (buttonName == "会观看" && option_num_view == 9) {
                buttons[i].click();
            } else if (buttonName == "不会观看") {
                buttons[i].click();
            }
        }
        //匿名提交
        var divs = document.getElementsByClassName("v-check-box__label");
        if (divs.length == 1 && divs[0].classList.length == 1) {
            GM_log(divs);
            divs[0].click();
            GM_log(divs);
        }

    }

    async function submitVote() {
        var buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            if (buttons[i].innerText == "确认提交") {
                buttons[i].click();
            }
        }
        nextVote();
    }

    async function nextVote() {
        var buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            if (buttons[i].innerText == "开始下一个") {
                buttons[i].click();
            }
        }
    }

    async function isClosePage() {
        var buttons = document.getElementsByTagName("button");
        for (let i=0; i < buttons.length; i++) {
            if (buttons[i].innerText == "投票次数已用完，返回") {
                window.location.href="https://www.bilibili.com/judgement/index";
            } else if (buttons[i].innerText == "投票次数已用完") {
                window.location.href="https://www.bilibili.com/judgement/index";
            }
        }
    }

    function checkAuditTime(beginTime, endTime) {
        var nowDate = new Date();
        var beginDate = new Date(nowDate);
        var endDate = new Date(nowDate);

        var beginIndex = beginTime.lastIndexOf("\:");
        var beginHour = beginTime.substring(0, beginIndex);
        var beginMinue = beginTime.substring(beginIndex + 1, beginTime.length);
        beginDate.setHours(beginHour, beginMinue, 0, 0);

        var endIndex = endTime.lastIndexOf("\:");
        var endHour = endTime.substring(0, endIndex);
        var endMinue = endTime.substring(endIndex + 1, endTime.length);
        endDate.setHours(endHour, endMinue, 0, 0);
        return nowDate.getTime() - beginDate.getTime() >= 0 && nowDate.getTime() <= endDate.getTime();
    }

    setInterval(main,90000 + Math.round(Math.random()*100)*3000);
    // Your code here...
})();