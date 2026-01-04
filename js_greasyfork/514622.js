// ==UserScript==
// @name     淘宝元宝自动获取助手
// @version  1.0.1
// @description  自动签到、做任务领取淘宝元宝
// @match    https://jianghu.taobao.com/coin.html*
// @match    https://jianghu.taobao.com/challenge.html*
// @match    https://jianghu.taobao.com/detail/*
// @match    https://huodong.taobao.com/wow/z/tbhome/pc-growth/signin-play*
// @grant    none
// @namespace https://greasyfork.org/users/1387918
// @downloadURL https://update.greasyfork.org/scripts/514622/%E6%B7%98%E5%AE%9D%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/514622/%E6%B7%98%E5%AE%9D%E5%85%83%E5%AE%9D%E8%87%AA%E5%8A%A8%E8%8E%B7%E5%8F%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";
    function coinStart() {
        const buttons = document.querySelectorAll(".task-btn-go");
        if (buttons) {
            const buttonsArray = [...buttons];
            buttonsArray.forEach((button) => {
                setTimeout(() => {
                    console.log("点击参与");
                    button.click();
                }, 500);
            });
        } else {
            console.log("暂时没有活动了");
        }
    }
    function coinAward() {
        const awardButtons = document.querySelectorAll(".task-btn-award");
        if (awardButtons) {
            const awardButtonsArray = [...awardButtons];
            awardButtonsArray.forEach((button) => {
                setTimeout(() => {
                    console.log("点击领取");
                    button.click();
                }, 500);
            });
        } else {
            console.log("暂时没有可领取的了");
        }
    }

    function challengeStart() {
        var items = document.querySelectorAll(".theme-list-content-item");
        items.forEach(function (node) {
            if (node.innerText.indexOf("谁家宝贝不爱樱花粉呢") !== -1) {
                node.querySelector(".use").click();
                setTimeout(() => {
                    document.querySelector('[class*="confirm--"]').click();
                }, 1000);
            }
        });
    }

    function replyStart() {
        try {
            var emoNodes = document.querySelectorAll(".tox-tbtn");
            emoNodes.forEach(function (emoNode) {
                if (emoNode.ariaLabel == "表情") {
                    emoNode.click();
                }
            });

            setTimeout(() => {
                var emojiNodes = document.querySelectorAll(
                    ".tox-collection__item"
                );
                emojiNodes.forEach(function (node) {
                    if (node.ariaLabel == "爱心") {
                        node.click();
                    }
                });
            }, 500);

            setTimeout(() => {
                var btnNode = document.querySelector("#J_postReply").click();
            }, 1000);
        } catch (error) {}
    }
    function giveStart() {
        try {
            document.querySelector("#J_CoinBtn").click();
            setTimeout(() => {
                var btnNodes = document.querySelectorAll(".tip-count-item");
                btnNodes.forEach(function (node) {
                    if (node.innerText == "1") {
                        node.click();
                    }
                });
            }, 500);
            setTimeout(() => {
                var btnNodes = document.querySelectorAll(".dialog-btn-confirm");
                btnNodes.forEach(function (node) {
                    if (node.innerText == "打赏") {
                        node.click();
                    }
                });
            }, 800);
        } catch (error) {}
    }

    function huodongStart() {
        // 定时得元宝
        var btnNodes = document.querySelectorAll('[class^="btn--"]');
        btnNodes.forEach(function (node) {
            if (node.innerText == "领取") {
                node.click();
            }
        });
        // 签到
        var btnNodes = document.querySelectorAll('[class^="signButton--"]');
        btnNodes.forEach(function (node) {
            if (node.innerText.indexOf("立即签到") !== -1) {
                node.click();
            }
        });
        // 做任务
        var btnNodes = document.querySelectorAll('[class^="taskBtn--"]');
        btnNodes.forEach(function (node) {
            if (node.innerText.indexOf("去完成") !== -1) {
                node.click();
            }
        });
        // 做任务-领取
        setTimeout(() => {
            var btnNodes = document.querySelectorAll('[class^="taskBtn--"]');
            btnNodes.forEach(function (node) {
                if (node.innerText.indexOf("领取") !== -1) {
                    node.click();
                }
            });
        }, 2000);
    }

    window.addEventListener("load", function () {
        // 元宝页面
        if (
            window.location.href.indexOf(
                "https://jianghu.taobao.com/coin.html"
            ) !== -1
        ) {
            coinStart();
            setTimeout(coinAward, 20 * 1000); // 等待20秒，领取元宝
            window.open(
                "https://huodong.taobao.com/wow/z/tbhome/pc-growth/signin-play"
            ); // 打开天天领元宝页面
            window.open("https://jianghu.taobao.com/detail/10609710"); // 打开一篇帖子
        }
        // 使用皮肤页面
        if (
            window.location.href.indexOf(
                "https://jianghu.taobao.com/challenge.html"
            ) !== -1
        ) {
            challengeStart();
        }
        // 帖子详情页面
        if (
            window.location.href.indexOf(
                "https://jianghu.taobao.com/challenge.html"
            ) !== -1
        ) {
            replyStart(); // 回复
            giveStart(); // 打赏
        }
        // 天天领元宝页面
        if (
            window.location.href.indexOf(
                "https://huodong.taobao.com/wow/z/tbhome/pc-growth/signin-play"
            ) !== -1
        ) {
            huodongStart();
        }
    });
})();
