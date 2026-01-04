// ==UserScript==
// @name         mhtall棉花糖自动下一章
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  懒狗
// @author       Hanayo
// @match        https://learning.mhtall.com/play/player.html*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434178/mhtall%E6%A3%89%E8%8A%B1%E7%B3%96%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/434178/mhtall%E6%A3%89%E8%8A%B1%E7%B3%96%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E7%AB%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    //var $ = unsafeWindow.jQuery;
    const video = document.getElementById("video")
    let now, next, nextbig
    //const now = document.getElementsByClassName("course-active")
    video.addEventListener('play', function () { //播放开始执行的函数
        console.log("开始播放");
        now = $(".title.course-active")
        next = now.parents("ul").next()
        nextbig = now.parents("div").next(".chapter-list").children("ul").eq(0).children("li")
    });
    video.addEventListener('ended', function () { //结束
        console.log("播放结束");
        if(next.length>0){
            //下一章
            next.children("li").click()
        } else {
            //下一大章
            nextbig.click()
        }
    }, false);
})();