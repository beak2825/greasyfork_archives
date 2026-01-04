// ==UserScript==
// @name         医视界考试刷题键盘快捷键
// @namespace    http://tampermonkey.net/
// @match        https://exam.mvwchina.com/pc/student/student.html
// @version      2.0
// @description  键位说明：空格快速刷题，A切换试题，0收藏，1A，2B...7返回，enter答案。系统网址：https://exam.mvwchina.com/
// @author       似梦非梦
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440230/%E5%8C%BB%E8%A7%86%E7%95%8C%E8%80%83%E8%AF%95%E5%88%B7%E9%A2%98%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/440230/%E5%8C%BB%E8%A7%86%E7%95%8C%E8%80%83%E8%AF%95%E5%88%B7%E9%A2%98%E9%94%AE%E7%9B%98%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('keydown', function (event) {
        if (event.keyCode == 104) {
            var arr = document.getElementsByClassName("watermark-item")
            for (var j = 0; j < arr.length; j++) {
                arr[j].parentElement.removeChild(arr[j])
            };
        };
        //         //上一题
        //          if (event.keyCode == 37) {
        //             document.getElementsByClassName("skin_clickEffect")[2].fireClick();
        //         };
        //         //下一题
        //          if (event.keyCode == 39) {
        //             document.getElementsByClassName("skin_clickEffect")[3].fireClick();
        //         };
        //     答案enter
        if (event.keyCode == 13) {
            document.getElementsByClassName("skin_clickEffect")[4].fireClick();
        };
        //空格
        function test() {
            document.getElementsByClassName("skin_clickEffect")[4].fireClick();
        }
        if (event.keyCode == 32) {
            document.getElementsByClassName("skin_clickEffect")[3].fireClick();
            setTimeout(test, 10);
        };
        //         //     左
        //         if (event.keyCode == 37) {
        //             document.getElementsByClassName("skin_clickEffect")[2].fireClick();
        //         };
        //         //     右
        //         if (event.keyCode == 39) {
        //             document.getElementsByClassName("skin_clickEffect")[3].fireClick();
        //         };
        //        收藏0
        if (event.keyCode == 96) {
            document.getElementsByClassName("skin_clickEffect")[5].fireClick();
        };
        //A
        //         if (event.keyCode == 97) {
        //             document.getElementsByClassName("lable_radio_span")[0].click();
        //         };

        if (event.keyCode == 97) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp101_selectionMarkBlock")[0].fireClick();
        };
        //B
        //         if (event.keyCode == 98) {
        //             document.getElementsByClassName("lable_radio_span")[1].click();
        //         };
        if (event.keyCode == 98) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp101_selectionMarkBlock")[1].fireClick()
        };
        //C
        //                 if (event.keyCode == 99) {
        //             document.getElementsByClassName("lable_radio_span")[2].click();
        //         };
        if (event.keyCode == 99) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp101_selectionMarkBlock")[2].fireClick();
        };
        //D
        //                 if (event.keyCode == 100) {
        //             document.getElementsByClassName("lable_radio_span")[3].click();
        //         };
        if (event.keyCode == 100) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp101_selectionMarkBlock")[3].fireClick();
        };
        //E
        //                 if (event.keyCode == 101) {
        //             document.getElementsByClassName("lable_radio_span")[4].click();
        //         };
        if (event.keyCode == 101) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp101_selectionMarkBlock")[4].fireClick();
        };
        //返回7
        if (event.keyCode == 103) {
            document.getElementsByClassName("hFlex parallelStart perpendicularCenter ctrl_headerLeft")[0].fireClick();
        };
        //试题切换A
        if (event.keyCode == 65) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp100_headerButton skin_bgColorIvory_DDD skin_clickEffect")[1].fireClick();
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter change-btn-box")[0].firstElementChild.click();
        };

        //切换试题9
        if (event.keyCode == 105) {
            document.getElementsByClassName("hFlex parallelCenter perpendicularCenter comp100_headerButton skin_bgColorIvory_DDD skin_clickEffect")[1].fireClick();
        };
    });
})();