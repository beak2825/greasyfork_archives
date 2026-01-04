// ==UserScript==
// @name         考试宝显示VIP解析
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  考试宝刷题AI解析免费获取，屏蔽开VIP广告
// @author       SophieW
// @match        https://www.zaixiankaoshi.com/online/?paperId*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zaixiankaoshi.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483017/%E8%80%83%E8%AF%95%E5%AE%9D%E6%98%BE%E7%A4%BAVIP%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/483017/%E8%80%83%E8%AF%95%E5%AE%9D%E6%98%BE%E7%A4%BAVIP%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function() {
        removeFooter();
        clickOk();
        setTimeout(pojie, 1500);
    }

    function pojie() {
        var beiTi = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-right.pull-right.lianxi-right > div:nth-child(2) > div.set > p:nth-child(2) > span.pull-right > div")
        if (!beiTi || !beiTi.hasAttribute("aria-checked")) {
            // 打开背题模式
            document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-right.pull-right.lianxi-right > div:nth-child(2) > div.set > p:nth-child(2) > span.pull-right > div > span").click()
        }
        //去除广告
        removeAd();

        var ans = document.querySelector(".answer-analysis")
        if (ans !== null) {
            ans.className = "option"
            var parent = ans.parentNode
            var children11 = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-left.pull-left.lianxi-left > div > div.answer-box > div.answer-box-detail > div > div.answer-analysis-row.hide-height > button")
            if (children11 !== null) {
                parent.removeChild(children11)
            }
        }
    }

    function removeFooter() {
        var children12 = document.querySelector("#body > footer")
        var parent2 = children12.parentNode
        parent2.removeChild(children12)
    }

    function addListener() {
        var button1 = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-left.pull-left.lianxi-left > div > div.topic.no-select > div > div.next-preve > button.el-button.opc-btn.el-button--default.el-button--small")
        var button2 = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-left.pull-left.lianxi-left > div > div.topic.no-select > div > div.next-preve > button.el-button.el-button--primary.el-button--small")
        button1.addEventListener("click", pojie)
        button2.addEventListener("click", pojie)
    }

    function clickOk() {

        var ok = document.querySelector("body > div.el-message-box__wrapper > div > div.el-message-box__btns > button.el-button.el-button--default.el-button--small.el-button--primary")
        if (ok !== null) {
            ok.click()
            setTimeout(tips, 100);
        }else{
            setTimeout(clickOk, 1500);
        }
    }

    function removeAd() {
        var ad = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-left.pull-left.lianxi-left > div > div.vip-quanyi")
        if (ad !== null) {
            var parent3 = ad.parentNode
            parent3.removeChild(ad)
        }
        var ad2 = document.querySelector("#body > div.middle-container.bj-eee > div.layout-container.prative-page > div.clearfix > div.layout-left.pull-left.lianxi-left > div > div.answer-box > div.answer-box-detail > div:nth-child(2)")
        if (ad2 !== null) {
            var parent4 = ad2.parentNode
            parent4.removeChild(ad2)
        }
    }

    function tips() {
        alert("SophieW祝您学习愉快！")
    }

    function blockForHalfSecond() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2000); // 500毫秒等于0.5秒
        });
    }

})();