// ==UserScript==
// @name         西电评教系统速填
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  进入等十秒，填一次刷新一次
// @author       bszydxh
// @match        https://ehall.xidian.edu.cn/jwapp/sys/wspjyyapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446627/%E8%A5%BF%E7%94%B5%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E9%80%9F%E5%A1%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/446627/%E8%A5%BF%E7%94%B5%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F%E9%80%9F%E5%A1%AB.meta.js
// ==/UserScript==
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
    }, 1E2)
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
    }, 1E2)
}
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
        }, 1E4)

        clearInterval(timer);
    } else {
        console.log("not find");
    }
}, 1E3)
