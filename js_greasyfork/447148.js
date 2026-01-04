// ==UserScript==
// @name         清览题库导出题目
// @namespace    https://greasyfork.org/zh-CN/scripts/447148-清览题库导出题目
// @version      0.2
// @description  此插件用于导出青揽览题库的题目和答案，进入单题训练，点击提交看答案，会自动将题目和答案复制到剪贴板，格式为：题目----答案
// @author       Main
// @blog         www.mainblog.cn
// @license MIT
// @match        *://www.qingline.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447148/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%E5%AF%BC%E5%87%BA%E9%A2%98%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/447148/%E6%B8%85%E8%A7%88%E9%A2%98%E5%BA%93%E5%AF%BC%E5%87%BA%E9%A2%98%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.onload = function () {
        var button = document.getElementsByClassName('submit_answer')[0];
        button.addEventListener("click", function (e) {
            setTimeout(check, 1000);
            console.log('ok');
        })
    }

    function check() {
        let text1 = document.getElementsByClassName('stem')[0].innerHTML
        let patt1 = text1.match(/<div>(.*)</s)[1];
        let text2 = document.getElementsByClassName('textContent')[0].innerHTML
        if (text2 == 1) {
            text2 = "正确"
        } else if (text2 == 0) {
            text2 = "错误"
        }
        let str = patt1 + "----" + text2
        navigator.clipboard.writeText(str);
        console.log(str);
    };
})();