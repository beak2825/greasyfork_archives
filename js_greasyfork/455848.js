// ==UserScript==
// @name         传智自动播放视频,题目会自动跳过
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  自动播放传智播客课程视频, 原作者博客:http://www.nothamor.cn
// @author       blueSatchel
// @match        *.ityxb.com/*
// @grant        GM_xmlhttpRequest
// @connect      *
 // @license MIT 

// @downloadURL https://update.greasyfork.org/scripts/455848/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%2C%E9%A2%98%E7%9B%AE%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/455848/%E4%BC%A0%E6%99%BA%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E8%A7%86%E9%A2%91%2C%E9%A2%98%E7%9B%AE%E4%BC%9A%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87.meta.js
// ==/UserScript==
(function() {
    'use strict';
    /**
    在原作者代码上做了删减
amendment: 删除了题目查询,修改了url匹配
*/
console.log("欢迎使用传智自动播放插件,习题查询已经失效,修改为自动跳过");
setTimeout(function () {
    let url = window.location.href;
    if (url.includes("https://stu.ityxb.com/preview/detail/")||url.includes("http://stu.ityxb.com/preview/detail/")) {
        auto_play();
        console.log("检测到为视频播放页面, 开始自动播放视频");
    }
}, 5000);

function auto_play() {
    const CLASS_LIST = document.getElementsByClassName("point-progress-box");
    const CLASS_NAME = document.getElementsByClassName("point-text ellipsis");
    let question_text = document.getElementsByTagName("pre")[0];
    let player = document.getElementsByTagName("video")[0].id;
    let question_text_value;
    document.getElementById(player).click();
    let counter = 0;
    const TIMER = setInterval(function () {
        let percent = CLASS_LIST[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
        let title_name = CLASS_NAME[counter].innerHTML.replace(/\ +/g, "").replace(/[\r\n]/g, "");
        if (percent.includes("100%") && counter == (CLASS_LIST.length - 1)) {
            clearInterval(TIMER);
            alert("当前页所有视频均已播放完成");
        } else if (percent.includes("100%")) {
            CLASS_LIST[counter + 1].click();
            player = document.getElementsByTagName("video")[0].id;
            document.getElementById(player).click();
            counter++;
        }
        if (title_name.includes("习题")) {
            CLASS_LIST[counter + 1].click();
            player = document.getElementsByTagName("video")[0].id;
            document.getElementById(player).click();
            counter++;


        }
    }, 2000);
}
})();