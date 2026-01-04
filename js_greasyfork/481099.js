// ==UserScript==
// @name         CC98账号名隐匿
// @namespace    cc98
// @version      0.3
// @description  隐藏98用户名，防止实验室同学在大屏幕上窥探到用户名
// @author       CJYiBei
// @match        https://www.cc98.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481099/CC98%E8%B4%A6%E5%8F%B7%E5%90%8D%E9%9A%90%E5%8C%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/481099/CC98%E8%B4%A6%E5%8F%B7%E5%90%8D%E9%9A%90%E5%8C%BF.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var name = "杜江峰";
    // var imgURL = "https://file.cc98.org/v2-upload/rizxybm4.jpg";
    var imgURL = "https://file.cc98.org/v2-upload/2024-04-04/nbkntnt4.webp";

    var s = setInterval(function () {
        /*右上*/
        var text1 = document.getElementsByClassName('topBarUserName');
        //if(text1[0].textContent == name)
        if(text1 != null){
            text1[0].textContent = name;
        }
        var img1 = document.querySelector('[class="topBarUserImg"] img')
        if (img1 != null) {
            img1.setAttribute('src', imgURL);
        }

        /*左上*/
        /*如果最后clearInterval(s)，那么下面的显示有时候不会出现*/
        var text2 = document.querySelector("#root > div > div.focus-root > div.focus > div#card-mode-area.card-topic-area > div.card-topic-area-left > div.card-topic-area-left-content > div.card-user > div.card-user-portrait > a");
        if (text2 != null) {
            text2.textContent = name;
        }
        var img2 = document.querySelector('[class="card-user-portrait"] img')
        if (img2 != null) {
            img2.setAttribute('src', imgURL);
        }

        /*个人页面*/
        var text3 = document.getElementById('userId');
        if (text3 != null) {
            let text = text3.getElementsByTagName('p');
            if (text != null) {
                text[0].textContent = name;
            }
        }

        var img3 = document.querySelector('[class="user-avatar"] img')
        if (img3 != null) {
            img3.setAttribute('src', imgURL);
        }
        // if (flag >= 1) {
        //     clearInterval(s);
        // }

    }, 100);
})();