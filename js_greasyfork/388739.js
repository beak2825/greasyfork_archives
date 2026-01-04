// ==UserScript==
// @name         腾讯视频观看自动播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  低版本浏览器、IE浏览器不兼容
// @author       Flcwl
// @match        *://v.qq.com/x/cover/**.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388739/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/388739/%E8%85%BE%E8%AE%AF%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    // 全部添加到window.onload下
    'use strict';
    setTimeout(function() {
        var playV = document.querySelector('.txp_btn.txp_btn_play');
        if(playV && playV.dataset.status ==='play') {
            playV.click();
        }
    }, 3000); // 视频加载完成，网速影响
})();
