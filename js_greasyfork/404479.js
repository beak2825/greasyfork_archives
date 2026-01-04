// ==UserScript==
// @name         腾讯课堂送花脚本（暴力版）
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  送花脚本，可能会引起老师不快，慎用！
// @author       shouxh
// @match        https://ke.qq.com/webcourse/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404479/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E9%80%81%E8%8A%B1%E8%84%9A%E6%9C%AC%EF%BC%88%E6%9A%B4%E5%8A%9B%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/404479/%E8%85%BE%E8%AE%AF%E8%AF%BE%E5%A0%82%E9%80%81%E8%8A%B1%E8%84%9A%E6%9C%AC%EF%BC%88%E6%9A%B4%E5%8A%9B%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    var flowerTime = null;
    var sfStatus = false;

    function _init() {
        var sf = document.createElement('button');
        sf.type = "button";
        sf.classList.add("toolbar-icon");
        sf.style.width="70px";
        sf.innerText = "开始送花";
        setTimeout(() => {
            document.querySelector('#toolbar').append(sf);
        }, 3000);
        sf.onclick = function () {
            if (!sfStatus) {
                let rate = parseInt(window.prompt('输入送花倍率，建议1-10之间', 1));
                if (isNaN(rate)) {
                    return;
                }
                sfStatus=!sfStatus;
                sf.innerText="停止送花";
                sendFlower(rate);
            }else{
                sfStatus=!sfStatus;
                sf.innerText = "开始送花";
                clearFlower();
            }
        }
    }
    /**
     *
     * @param {Number} maxCount 最大一次想要送多少朵花，建议1-10之间
     */
    function sendFlower(maxCount = 1) {
        let flower = document.querySelectorAll('#toolbar  button.toolbar-icon')[2];
        flowerTime = setInterval(() => {
            flower.click();
            flower.classList.remove("disabled");
            for (let i = 0; i < maxCount; i++) {
                flower.click();
            }
        }, 1000);
    };

    /**
     *
     * 清除送花的脚本
     */
    function clearFlower() {
        if (flowerTime != null) {
            clearInterval(flowerTime);
            console.warn("送花脚本已停止..");
        } else {
            return;
        }
    }

    window.onload=_init();
})();