// ==UserScript==
// @name         你的神秘女友
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉了百度贴吧首页的部分功能，送给星川 \(^o^)/
// @author       girlfriend
// @match        https://tieba.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381932/%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%A7%98%E5%A5%B3%E5%8F%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/381932/%E4%BD%A0%E7%9A%84%E7%A5%9E%E7%A7%98%E5%A5%B3%E5%8F%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

   	var parent = document.querySelector(".top-sec");
    var parent1 = document.querySelector(".index-forum-num-ten-millions");
    var parent2 = document.querySelector(".r-left-sec");
    var parent3 = document.querySelector(".r-top-sec");
    var child = document.getElementById("rec_left");
    var child1 = document.getElementById("rec_right");
    var child2 = document.getElementById("spage_liveshow_slide");
    var child3 = document.querySelector(".forum_recommend");
    parent.removeChild(child);
    parent1.removeChild(child1);
     parent2.removeChild(child2);
     parent3.removeChild(child3);
    alert("星川~");
})();