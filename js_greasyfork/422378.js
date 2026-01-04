// ==UserScript==
// @name         奥鹏大连理工 - 软件工程
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://media6.open.com.cn/media001/1609/dagong/ruanjiangc/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422378/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20-%20%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/422378/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20-%20%E8%BD%AF%E4%BB%B6%E5%B7%A5%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log(`hello`);

    let index = localStorage.getItem('index') || 0;
    console.log(`index: ${index}`);
    const lessons = document.querySelectorAll('.video-popup');

    const fakeVideo = document.createElement('video');
    fakeVideo.setAttribute('id', 'fakeVideo');
    document.body.appendChild(fakeVideo);

    playNext(index);

    function playNext(index) {
        localStorage.setItem('index', index);
        console.log(`play next: ${index}`);

        const close = document.querySelector('.fancybox-close')
        if (close) {
            close.click();
        }

        const idx = index % lessons.length;
        lessons[idx].click();

        const fakeVideo = document.querySelector('#fakeVideo');
        fakeVideo.src = lessons[idx].getAttribute('href');
    }

    setInterval(() => {
        const video = document.querySelector('#fakeVideo');
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