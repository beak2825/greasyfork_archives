// ==UserScript==
// @name         奥鹏大连理工通识教育 中国传统文化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://media6.open.com.cn/media001/1609/dagong/zhongguoctwhysxwl1/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396893/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E9%80%9A%E8%AF%86%E6%95%99%E8%82%B2%20%E4%B8%AD%E5%9B%BD%E4%BC%A0%E7%BB%9F%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/396893/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%E9%80%9A%E8%AF%86%E6%95%99%E8%82%B2%20%E4%B8%AD%E5%9B%BD%E4%BC%A0%E7%BB%9F%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var lessions = ["video/0-0.htm", "video/1-1.htm", "video/1-2.htm", "video/1-3.htm", "video/1-4.htm", "video/1-5.htm", "video/1-6.htm", "video/2-1.htm", "video/2-2.htm", "video/2-3.htm", "video/2-4.htm", "video/2-5.htm", "video/3-1.htm", "video/3-2.htm", "video/3-3.htm", "video/3-4.htm", "video/4-1.htm", "video/4-2.htm", "video/4-3.htm", "video/4-4.htm", "video/4-5.htm", "video/5-1.htm", "video/5-2.htm", "video/5-3.htm", "video/5-4.htm", "video/5-5.htm", "video/5-6.htm", "video/5-7.htm", "video/5-8.htm", "video/5-9.htm", "video/5-10.htm", "video/5-11.htm", "video/6-1.htm", "video/6-2.htm", "video/6-3.htm", "video/6-4.htm", "video/6-5.htm", "video/6-6.htm", "video/6-7.htm", "video/6-8.htm", "video/6-9.htm", "video/7-1.htm", "video/7-2.htm", "video/7-3.htm", "video/7-4.htm", "video/7-5.htm", "video/7-6.htm", "video/7-7.htm", "video/7-8.htm", "video/7-9.htm", "video/7-10.htm", "video/8-1.htm", "video/8-2.htm", "video/8-3.htm", "video/8-4.htm", "video/8-5.htm", "video/8-6.htm", "video/8-7.htm", "video/8-8.htm", "video/8-9.htm", "video/8-10.htm", "video/8-11.htm", "video/9-1.htm", "video/9-2.htm", "video/9-3.htm", "video/9-4.htm", "video/9-5.htm", "video/9-6.htm", "video/9-7.htm", "video/9-8.htm"];
    var current = document.URL.match(/(video\/\d+-\d+\.htm)$/g)[0];
    var currentIndex = lessions.indexOf(current);
    var nextLession = lessions[currentIndex+1];
    var nextUrl = document.URL.replace(current, nextLession);

    function playNext() {
        window.location.href = nextUrl
    }

    setInterval(() => {
        const video = document.querySelector('video');
        if (video.duration === video.currentTime) {
            playNext();
        }
        video.play();
        video.volume = 0;
    }, 1000);
})();