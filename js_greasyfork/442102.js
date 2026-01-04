// ==UserScript==
// @name         【图灵】推特自动点关注/转推  Discord自动接受邀请
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  【推特必须是中文的，在设置里面设置好】【推特必须是中文的，在设置里面设置好】【推特必须是中文的，在设置里面设置好】
// @author       You
// @match        *twitter.com/intent/retweet*
// @match        *twitter.com/intent/follow*
// @match        *twitter.com/intent/tweet*
// @match        *discord.com/invite/*
// @match        *secondlive.world/task
// @icon         https://www.google.com/s2/favicons?domain=twitter.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442102/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E6%8E%A8%E7%89%B9%E8%87%AA%E5%8A%A8%E7%82%B9%E5%85%B3%E6%B3%A8%E8%BD%AC%E6%8E%A8%20%20Discord%E8%87%AA%E5%8A%A8%E6%8E%A5%E5%8F%97%E9%82%80%E8%AF%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442102/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91%E6%8E%A8%E7%89%B9%E8%87%AA%E5%8A%A8%E7%82%B9%E5%85%B3%E6%B3%A8%E8%BD%AC%E6%8E%A8%20%20Discord%E8%87%AA%E5%8A%A8%E6%8E%A5%E5%8F%97%E9%82%80%E8%AF%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    (() => {
        waitForTitle();

        //自动连钱包
        setTimeout(()=>{
            try{
                var dom=document.querySelector("div[class*=Header__ConnectorWrapper] > div > div")
                if(!dom.textContent.includes("0x")){
                    dom.click()
                    setTimeout(()=>{
                        document.querySelector("#connect-METAMASK").click();
                    },1000)
                }
            }
            catch
            {

            }
        },7000)


        setInterval(() => {
            //【推特自动转发】 暴力循环检测按钮 检测到就自动点击
            if (window.location.href.includes("twitter.com/intent/retweet")) {
                var list = document.querySelectorAll("div[role=group][tabindex='0'] div[dir=auto] > span > span")
                //循环查询出来的元素 text 等于  转推
                for (var i = 0; i < list.length; i++) {
                    var txt = list[i].innerText
                    if (txt == "转推") {
                        setTimeout(() => {
                            list[i].click();
                            console.log("成功找到!", txt, list[i]);
                            document.title = "●3秒关闭【自动转推完成】";
                            end = true;

                            setTimeout(() => {
                                window.close();
                            }, 3000);
                        }, 2000);
                        break;
                    }
                }
            }
            //【推特自动点关注,仅针对弹窗关注的类型】 暴力循环检测按钮 检测到就自动点击
            if (window.location.href.includes("twitter.com/intent/follow")) {
                var list = document.querySelectorAll("div[role=group][tabindex='0'] div[dir=auto] > span > span")
                //循环查询出来的元素 text 等于  转推
                for (var i = 0; i < list.length; i++) {
                    var txt = list[i].innerText
                    if (txt == "关注") {
                        setTimeout(() => {
                            list[i].click();
                            console.log("成功找到!", txt, list[i]);
                            document.title = "●3秒关闭【自动关注完成】";
                            end = true;

                            setTimeout(() => {
                                window.close();
                            }, 3000);
                        }, 2000);
                        break;
                    }
                }
            }
            //【推特自动发推  自动弹窗只需要点发推按钮的】 暴力循环检测按钮 检测到就自动点击
            if (window.location.href.includes("twitter.com/intent/tweet")) {
                var list = document.querySelectorAll("div[role=group][tabindex='0'] div[dir=auto] > span > span")
                //循环查询出来的元素 text 等于  转推
                for (var i = 0; i < list.length; i++) {
                    var txt = list[i].innerText
                    if (txt == "发推") {
                        setTimeout(() => {
                            list[i].click();
                            console.log("成功找到!", txt, list[i]);
                            document.title = "●3秒关闭【自动发推完成】";
                            end = true;

                            setTimeout(() => {
                                window.close();
                            }, 3000);
                        }, 2000);
                        break;
                    }
                }
            }

            //【Discord自动接收邀请】 暴力循环检测按钮 检测到就自动点击 只点击一次 防止满了后多次点击
            if (window.location.href.includes("discord.com/invite")) {
                if (discordok) return;
                var list = document.querySelectorAll("button")
                //循环查询出来的元素 text 等于  接受邀请
                for (var i = 0; i < list.length; i++) {
                    var txt = list[i].innerText
                    if (txt == "接受邀请") {
                        setTimeout(() => {
                            list[i].click();
                            console.log("成功找到!", txt, list[i]);
                            document.title = "●【自动接受邀请成功】";
                            end = true;
                            discordok = true;
                        }, 2000);
                        break;
                    }
                }
            }



        }, 100);
    })()
    var end = false;
    var discordok = false;
    var oldtitle = "";
    //异步等待document.title 不为空则记录到全局变量
    async function waitForTitle() {
        while (document.title == "") {
            await sleep(100);
            return waitForTitle();
        }
        oldtitle = document.title;
        document.title = "" + oldtitle;
        // 处理中动态效果 ...
        changeTitle();
        return true;
    }
    //document.title 前面增加 处理中... 每隔1秒多一个.  3秒后去掉所有.重新循环
    async function changeTitle(num = 0) {
        if (end) return;
        if (document.title.indexOf("●【") > -1) {
            return;
        }
        if (num > 3) num = 0;
        var ntitle = "●处理中";
        //ntitle 循环增加 num 个 .
        for (var i = 0; i < num; i++) {
            ntitle += ".";
        }

        await sleep(500);
        document.title = ntitle + " - " + oldtitle;
        await changeTitle(num + 1);
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


})();