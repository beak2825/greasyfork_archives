// ==UserScript==
// @name         2024-6-1 学完的那种. 河北省2023年中小学幼儿园教师全员远程培训项目
// @namespace    http://tampermonkey.net/
// @version      2024-03-17
// @description  河北省2023年中小学幼儿园教师全员远程培训项目,自动学习,打开科目3秒学完.
// @author       You
// @match        http://study.yanxiu.jsyxsq.com/proj/studentwork/study.htm*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jsyxsq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496229/2024-6-1%20%E5%AD%A6%E5%AE%8C%E7%9A%84%E9%82%A3%E7%A7%8D%20%E6%B2%B3%E5%8C%97%E7%9C%812023%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/496229/2024-6-1%20%E5%AD%A6%E5%AE%8C%E7%9A%84%E9%82%A3%E7%A7%8D%20%E6%B2%B3%E5%8C%97%E7%9C%812023%E5%B9%B4%E4%B8%AD%E5%B0%8F%E5%AD%A6%E5%B9%BC%E5%84%BF%E5%9B%AD%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E8%BF%9C%E7%A8%8B%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 延迟5秒后执行代码
    setTimeout(function() {
        let courseDurationText = document.querySelector("body > div.main_video.clear > div.video_r.fl > div.title_tab_lists > div.title_tab_list.introduce.p30 > div:nth-child(4)").textContent.trim();
        let splitText = courseDurationText.split("：")[1].trim(); // "58 分钟"
        let minutes = splitText.split(" ")[0]; // "58"
        let zonggong=document.querySelector("#zonggong").innerText.replace("分钟","")

        document.form2.passedtime.value = minutes * 60-zonggong*60+60;
        updateStudyTime();
    }, 3000);

    // 延迟6秒后尝试关闭当前选项卡
    setTimeout(function() {
        window.close();
    }, 6000);


    // Your code here...
})();