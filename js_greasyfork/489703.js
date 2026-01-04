// ==UserScript==
// @name         Linux.do 自动翻页
// @namespace    http://tampermonkey.net/
// @version      20240314
// @description  每隔3秒自动翻页
// @author       你的名字
// @match        https://linux.do/t/topic/**
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489703/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/489703/Linuxdo%20%E8%87%AA%E5%8A%A8%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var y = window.scrollY;
    setInterval(function () {
        y += window.innerHeight;
        console.log(y);
        window.scrollTo(0, y);
        if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
            // 执行当滚动到底部时的操作
            console.log('已经滚动到页面的最底部了！');
            var list = $('a.title.raw-link.raw-topic-link[href^="/t/topic/"]');
            if(list.length === 0 ){
                list = $('div.recent-topics div.not-found-topic a[href^="/t/topic/"]');
            }
            var topic = $(list[Math.floor(Math.random() * list.length)]).attr('href');
            if (!topic) {
                topic = '/t/topic/' + Math.floor(Math.random() * 5000);
            }
            console.log(topic);
            window.location.href = 'https://linux.do' + topic;
        }
    }, 3000);
})();
