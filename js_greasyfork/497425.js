// ==UserScript==
// @name         西电评教
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  单选、多选、填空均完成、填一次退出重进、每次填需要等几秒钟
// @author       OYearn
// @match        *://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*default/*
// @icon         https://bkimg.cdn.bcebos.com/pic/7aec54e736d12f2ec1809b2345c2d562843568ef?x-bce-process=image/resize,m_lfit,w_268,limit_1/format,f_jpg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497425/%E8%A5%BF%E7%94%B5%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/497425/%E8%A5%BF%E7%94%B5%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var timer = setInterval(function () {
        if (document.querySelector("#txwj-index-card > div:nth-child(1) > div > div:nth-child(2) > div:nth-child(2) > div > label:nth-child(1) > input[type=radio]")) {
            console.log("find bnt");
            setTimeout(function () {
                for (var i = 1; i < 20; i++) {
                    clicker(i);
                }
                for (var i2 = 1; i2 < 50; i2++) {
                    clicker2(i2);
                }
                checkandinput(); // 将其他部分的执行放在setTimeout内，延迟执行
            }, 10000); // 延迟10秒执行

            clearInterval(timer);
        } else {
            console.log("not find");
        }
    }, 1000); // 每隔1秒检查一次页面是否加载完成

    return;
})();

function clicker(index) {
    var num = 2;
    var timer_inner = setInterval(function () {
        try {
            var aaa = document.querySelector("#txwj-index-card > div:nth-child(" + index + ") > div > div:nth-child(" + num + ") > div:nth-child(2) > div > label:nth-child(1) > input[type=radio]");
            console.log(aaa);
            aaa.click();
            num = num + 1;
        }
        catch (err) {
            clearInterval(timer_inner);
        }
    }, 100); // 单选部分的间隔为100毫秒
}

function clicker2(index) {
    var num = 1;
    var timer_inner = setInterval(function () {
        try {
            var aaa = document.querySelector("#txwj-index-card > div:nth-child(11) > div > div:nth-child(" + index + ") > div:nth-child(2) > div > label:nth-child(" + num + ") > input[type=checkbox]");
            console.log(aaa);
            aaa.click();
            num = num + 1;
        }
        catch (err) {
            clearInterval(timer_inner);
        }
    }, 100); // 多选部分的间隔为100毫秒
}

function checkandinput() {
    // 单选非常满意
    let radioBtn = document.querySelectorAll("bh-radio-label");
    for (var i = 0; i < radioBtn.length; i += 4) {
        radioBtn[i].click();
    }

    // 多选框点击前三个
    const cards = document.querySelectorAll('.wjzb-card');
    if (cards.length >= 2) {
        const secondLast2 = cards[cards.length - 2];
        const jskcElements = secondLast2.querySelectorAll('.wjzb-card-jskc');
        jskcElements.forEach(jskcElement => {
            const checkboxes = jskcElement.querySelectorAll('.bh-checkbox-label');
            if (checkboxes.length > 0) {
                checkboxes.forEach((item, index) => {
                    if (index < 3) {
                        item.click();
                    }
                });
            }
        });
    }

    // 填充文本框
    const textall = document.querySelectorAll('textarea');
    for (let i = 0; i < textall.length; i++) {
        textall[i].value = "无";
    }
}