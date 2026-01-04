// ==UserScript==
// @name         dangkezhushou
// @name:zh-CN   党课自动播放脚本         
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  可以自动点击暂停弹窗，自动播放党课
// @author       123guaiguai
// @match        https://dxpx.uestc.edu.cn/jjfz/*
// @license      AGPL-3.0
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454795/dangkezhushou.user.js
// @updateURL https://update.greasyfork.org/scripts/454795/dangkezhushou.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let lesson_li=document.querySelector(".wrap .w1150 .lesson_center_ul .lesson_c_ul").querySelectorAll("li");
    //console.log(lesson_li);
    let lesson_btn=[];
    for(let i=0;i<lesson_li.length;i++){
        lesson_btn.push(lesson_li[i].querySelector(".lesson_center_a .study"));
    }
    console.log(lesson_btn);
    lesson_btn[0].click();
})();