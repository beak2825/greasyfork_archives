// ==UserScript==
// @name         攀升学堂助手
// @namespace    https://txq.life
// @version      2022.07.20.1200
// @description  钉钉授课学堂助手
// @author       tanxinqi
// @match        https://app1730.eapps.dingtalkcloud.com/*
// @match        https://im.dingtalk.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437756/%E6%94%80%E5%8D%87%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/437756/%E6%94%80%E5%8D%87%E5%AD%A6%E5%A0%82%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


function GM_addStyle(css) {
    const style = document.getElementById("GM_addStyleBy8626") || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = "GM_addStyleBy8626";
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || [])
        .length);
}

GM_addStyle(
    `#layout-main {
width: 100%;
flex: 1;
}`
);
GM_addStyle(
    `#body {
height: 100%}`);


(function() {
    'use strict';

    alert("授课学堂助手正在启动");
    var button = null;
    var list = null;

    Date.prototype.format = function(fmt = "yyyy-MM-dd hh:mm:ss.S") {
        var o = {
            "M+": this.getMonth() + 1,
            "d+": this.getDate(),
            "h+": this.getHours(),
            "m+": this.getMinutes(),
            "s+": this.getSeconds(),
            "q+": Math.floor((this.getMonth() + 3) / 3),
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")")
                .test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ?
                    (o[k]) : (("00" + o[k])
                        .substr(("" + o[k])
                            .length)));
            }
        }
        return fmt;
    }

    function log(obj) {
        console.log(obj + "         授课学堂助手---" + (new Date())
            .format());
    }

    setInterval(function() {




        try {
            list = document.querySelectorAll(".el-button.el-button--primary");
            if (list) {
                list.forEach(function(element) {
                    switch (element.innerText.trim()) {
                        case "我在":
                        case "知道了":
                        case "下一课":
                            log("click " + element.innerText.trim());
                            element.click();
                            break;
                        default:
                            break;
                    }
                });
            }
        } catch {}



        try {
            button = document.querySelector(".el-button.el-button--default.el-button--small.el-button--primary");
            if (button) {
                if (button.innerText.trim() == "确定") {
                    button.click();
                    log("click " + button.innerText.trim());
                }

            }
        } catch {}



        try {
            button = document.querySelector(".start.join.bg-color");
            if (button) {
                if (button.innerText.trim() == "加入选修") {
                    button.click();
                    log("click " + button.innerText.trim());
                    return;
                }

            }
        } catch {}

        try {
            button = document.querySelector(".el-button.el-button--default.el-button--small.el-button--primary");
            if (button) {
                if (button.innerText.trim() == "加入选修") {
                    button.click();
                    log("click " + button.innerText.trim());
                    return;
                }

            }
        } catch {}

        //如果正在播放直接返回
        try {
            if (document.querySelector(".video-js.vjs-default-skin.vjs-big-play-centered.my-player-dimensions.vjs-controls-enabled.vjs-workinghover.vjs-v6.vjs-playing.vjs-has-started.vjs-user-inactive")) {
                log("视频正在播放 return");
                return;
            }
        } catch {}


        //如果学习中直接返回
        try {

            if (document.querySelector(".time-show-button")
                .innerText.trim() == "学习中") {
                log("学习中 return");
                return;
            }
        } catch {}




        try {
            button = document.querySelector(".iconfont.order.icon-shijian-tianchong.orderLearning");
            if (button) {
                button.click();
                log("click " + button.innerText.trim());
                return;
            }
        } catch {}



        try {
            button = document.querySelector(".iconfont.order.icon-bofang1");
            if (button) {
                button.click();
                log("click " + button.innerText.trim());
                return;
            }
        } catch {}






        try {

            button = document.querySelector(".vjs-big-play-button");
            if (button) {
                button.click();
                log("click " + button.innerText.trim());
                return;
            }
        } catch {}



        try {
            if (document.querySelector(".fraction")
                .innerText == "0 .0分") {
                list = document.querySelectorAll(".iconfont.icon-xingxing");
                console.log(list.length - 1);
                list[list.length - 1].click();

                //提交打分
                button = document.querySelector(".click.font-color.border-color");
                if (button) {
                    if (button.innerText.trim() == "提交") {
                        button.click();
                        log("click " + button.innerText.trim());
                    }

                }
            }
        } catch {}

    }, 2000)



})();