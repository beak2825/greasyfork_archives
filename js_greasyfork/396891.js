// ==UserScript==
// @name         奥鹏大连理工 cpp autoplay script
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        http://media4.open.com.cn/L602/1509/dagong/gengxin/C_C++/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396891/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20cpp%20autoplay%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/396891/%E5%A5%A5%E9%B9%8F%E5%A4%A7%E8%BF%9E%E7%90%86%E5%B7%A5%20cpp%20autoplay%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentTitle = document.querySelector('#video_title').innerText;
    let lessions = document.querySelectorAll('.isotope-item');
    let currentIndex = 0;

    for (var i = 0; i < lessions.length; ++i) {
        if (lessions[i].querySelector('.portfolio-item-title p').innerText === currentTitle) {
            currentIndex = i;
            break;
        }
    }

    function playNext() {
        const nextIndex = currentIndex + 1;
        lessions[nextIndex].querySelector('i').click();
        currentIndex = nextIndex;
    }

    setInterval(() => {
        const video = document.querySelector('#video_play');
        if (video.duration === video.currentTime) {
            playNext();
        }
        video.play();
        video.volume = 0;
    }, 1000);
})();