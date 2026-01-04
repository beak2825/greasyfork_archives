// ==UserScript==
// @name         奥鹏大连理工 - 计算机网络技术
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://media4.open.com.cn/L602/1409/dagong/jisuanjwljs/2_1.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422379/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20-%20%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E6%8A%80%E6%9C%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/422379/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20-%20%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%BD%91%E7%BB%9C%E6%8A%80%E6%9C%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let index = localStorage.getItem('index') || 0;
    console.log(`index: ${index}`);
    const lessons = document.querySelectorAll('.video_link');

    playNext(index);

    function playNext(index) {
        localStorage.setItem('index', index);
        console.log(`play next: ${index}`);

        const idx = index % lessons.length;
        lessons[idx].click();
    }

    setInterval(() => {
        const video = document.querySelector('video');
        if (video) {
            if (video.duration === video.currentTime) {
                playNext(++index);
            }
            video.play();
            video.volume = 0;
            console.log(`video: ${video.currentTime}/${video.duration}`);
        }
    }, 1000);

})();