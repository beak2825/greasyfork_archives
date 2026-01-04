// ==UserScript==
// @name         哔哩哔哩倍速
// @namespace    https://github.com/Mzying2001/bilibili_speed/
// @version      1.0.0
// @description  让B站支持三倍速和四倍速
// @author       Mzying2001
// @match        http*://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/484120/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/484120/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function () {
    var intervalId = setInterval(function () {
        var ulElement = document.querySelector('.bpx-player-ctrl-playbackrate-menu');
        if (ulElement) {
            var newLiHTML = '<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="4">4.0x</li>' +
                '<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="3">3.0x</li>';
            ulElement.insertAdjacentHTML('afterbegin', newLiHTML);
            clearInterval(intervalId);
            console.log('done');
        }
    }, 1000)
})()
