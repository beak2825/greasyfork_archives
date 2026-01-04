// ==UserScript==
// @name         21tb_2021_OpenURL
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       You
// @match        *://*.21tb.com/nms-frontend/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389186/21tb_2021_OpenURL.user.js
// @updateURL https://update.greasyfork.org/scripts/389186/21tb_2021_OpenURL.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var time = "190000"
    var id1 = "c1aa7629bc94424da2d44599bffd44be"
    var id2 = "85fc996f92cb46058337cf9e5398737f"
    var id3 = "02f709e0a6844932adabcdc42f38bdc2"
    var id4 = "04d014e7fd4b43e48725bceb19f91bdd"
    var id5 = "b35fa28ebbbd40ad98f27aa4cf5d9e1c"
    var id6 = "aaea6e9d14944e08adabd2f199bf0eba"
    var id7 = "ab99669e6e714198b8ab133e3e4a3bff"

    var id8 = "b3bb0f02a7324cb895bbe36a84460324"
    var id9 = "3f8891c5e586404c95ff0c5ca127ec5d"
    var id10 = "8d1918fc2e804e7fb66bc5c3dabaf102"
    var id11 = "d35b8d793ea343e3bdd9f8d6733cf249"
    var id12 = "c3b4b11d67054a98877437c79bbf1d16"
    var id13 = "c83de9a8b0bc4815bc2d6f75f8b657bf"

    var url1 = "https://cqrl.21tb.com/els/html/courseStudyItem/courseStudyItem.learn.do?courseId="
    var url2 = "&courseType=NEW_COURSE_CENTER"

    window.onload = function() {
        setTimeout(open,3000);
    }

    function open() {
        if (window.confirm("\n确定要打开课程链接开始学习吗")) {
            setTimeout(function(){window.open(url1 + id1 + url2);},1000);
            setTimeout(function(){window.open(url1 + id2 + url2);},time*1);
            setTimeout(function(){window.open(url1 + id3 + url2);},time*2);
            setTimeout(function(){window.open(url1 + id4 + url2);},time*3);
            setTimeout(function(){window.open(url1 + id5 + url2);},time*4);
            setTimeout(function(){window.open(url1 + id6 + url2);},time*5);
            setTimeout(function(){window.open(url1 + id7 + url2);},time*6);
            setTimeout(function(){window.open(url1 + id8 + url2);},time*7);
            setTimeout(function(){window.open(url1 + id9 + url2);},time*8);
            setTimeout(function(){window.open(url1 + id10 + url2);},time*9);
            setTimeout(function(){window.open(url1 + id11 + url2);},time*10);
            setTimeout(function(){window.open(url1 + id12 + url2);},time*11);
            setTimeout(function(){window.open(url1 + id13 + url2);},time*12);
            setTimeout(function(){alert("\n课程链接打开已完成")},time*13);
        } else {
            return false;
        }
    }
    // Your code here...
})();