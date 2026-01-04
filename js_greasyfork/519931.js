// ==UserScript==
// @name         风纪委员投票(自用)
// @namespace    http://tampermonkey.net/
// @homepage     https://github.com/asksowhat/BilibiliVote
// @version      1.0
// @description  b站风纪委员投票助手
// @license MIT
// @author       asksowhat
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/judgement*
// @grant        window.close
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/519931/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8%28%E8%87%AA%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/519931/%E9%A3%8E%E7%BA%AA%E5%A7%94%E5%91%98%E6%8A%95%E7%A5%A8%28%E8%87%AA%E7%94%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面加载完后调用 main 函数
    window.onload = main;

    // 主函数：执行整个投票流程
    async function main() {
        // 设置不同的延时，模拟真实投票操作
        setTimeout(await enterVotePage, 3000); // 等待 3 秒后进入投票页面
        setTimeout(await optionsVote, 10000 + Math.round(Math.random() * 10) * 1000); // 等待 10~20 秒后选择投票选项
        setTimeout(await submitVote, 30000 + Math.round(Math.random() * 10) * 1000); // 等待 30~40 秒后提交投票
        setTimeout(await nextVote, 50000 + Math.round(Math.random() * 10) * 1000); // 等待 50~60 秒后进入下一轮投票
        setTimeout(await isClosePage, 64000 + Math.round(Math.random() * 10) * 1000); // 等待 64~74 秒后检查是否已投完
    }

    // 进入投票页面
    async function enterVotePage() {
        var buttons = document.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            // 找到"开始众议"按钮并点击
            if (buttons[i].innerText == "开始众议") {
                buttons[i].click();
                break;
            } 
            // 如果当前显示"无新任务"，则刷新页面
            else if (buttons[i].innerText == "无新任务") {
                await reload();
            }
        }
    }

    // 刷新页面
    async function reload() {
        location.reload();
    }

    // 选择投票选项
    async function optionsVote() {
        var buttons = document.getElementsByTagName("button");
        let option_num_feel = Math.round(Math.random() * 10); // 随机生成一个数字用于选择投票选项
        let option_num_view = Math.round(Math.random() * 20) // 随机生成一个数字用于判断是否观看

        for (let i = 0; i < buttons.length; i++) {
            let buttonName = buttons[i].innerText;

            GM_log("num:" + option_num_feel); // 调试日志，查看随机数值

            // 根据随机数值选择"好"、"普通"、"差"等选项
            if ((buttonName == "好" || buttonName == "合适") && (option_num_feel == 1 || option_num_feel == 2 || option_num_feel % 3 == 0)) {
                buttons[i].click();
            } else if ((buttonName == "普通" || buttonName == "中" || buttonName == "一般") && option_num_feel == 4) {
                buttons[i].click();
            } else if ((buttonName == "差" || buttonName == "不合适") && option_num_feel == 8) {
                buttons[i].click();
            } else if (buttonName == "无法判断" && (option_num_feel == 5 || option_num_feel == 7)) {
                buttons[i].click();
            }

            // 判断是否观看此视频
            if (buttonName == "会观看" && option_num_view == 9) {
                buttons[i].click();
            } else if (buttonName == "不会观看") {
                buttons[i].click();
            }
        }

        // 如果页面上有匿名提交选项，点击匿名提交
        var divs = document.getElementsByClassName("v-check-box__label");
        if (divs.length == 1 && divs[0].classList.length == 1) {
            GM_log(divs); // 调试日志，查看匿名提交选项
            divs[0].click();
            GM_log(divs); // 再次打印调试日志
        }
    }

    // 提交投票
    async function submitVote() {
        var buttons = document.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            // 找到"确认提交"按钮并点击
            if (buttons[i].innerText == "确认提交") {
                buttons[i].click();
            }
        }
        // 提交后进入下一轮投票
        nextVote();
    }

    // 进入下一轮投票
    async function nextVote() {
        var buttons = document.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            // 找到"开始下一个"按钮并点击
            if (buttons[i].innerText == "开始下一个") {
                buttons[i].click();
            }
        }
    }

    // 检查是否已经投票完毕
    async function isClosePage() {
        var buttons = document.getElementsByTagName("button");
        for (let i = 0; i < buttons.length; i++) {
            // 如果显示"投票次数已用完，返回"按钮，跳转回首页
            if (buttons[i].innerText == "投票次数已用完，返回") {
                window.location.href = "https://www.bilibili.com/judgement/index";
            } 
            // 如果显示"投票次数已用完"按钮，跳转回首页
            else if (buttons[i].innerText == "投票次数已用完") {
                window.location.href = "https://www.bilibili.com/judgement/index";
            }
        }
    }

    // 每隔一段时间（随机间隔）重新运行 main 函数
    setInterval(main, 90000 + Math.round(Math.random() * 100) * 3000);

})();
