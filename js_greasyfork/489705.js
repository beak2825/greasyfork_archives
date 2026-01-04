// ==UserScript==
// @name         定时页面滚动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每隔3秒自动翻页
// @author       你的名字
// @match        https://linux.do/t/topic/**
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489705/%E5%AE%9A%E6%97%B6%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/489705/%E5%AE%9A%E6%97%B6%E9%A1%B5%E9%9D%A2%E6%BB%9A%E5%8A%A8.meta.js
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
