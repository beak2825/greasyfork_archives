// ==UserScript==
// @name         imooc慕课网隐藏作者介绍连续播放
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动关闭慕课视频播放界面的作者介绍，自动播放下一节。
// @author       xxyangyoulin
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @license         GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/441173/imooc%E6%85%95%E8%AF%BE%E7%BD%91%E9%9A%90%E8%97%8F%E4%BD%9C%E8%80%85%E4%BB%8B%E7%BB%8D%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/441173/imooc%E6%85%95%E8%AF%BE%E7%BD%91%E9%9A%90%E8%97%8F%E4%BD%9C%E8%80%85%E4%BB%8B%E7%BB%8D%E8%BF%9E%E7%BB%AD%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(()=>{
        let closeBtn = document.querySelector(".imv2-close.video-panel-close")
        if(closeBtn){
            closeBtn.click()
        }
    },500);
    // Your code here...

    var playNextBtn = document.querySelector('.J-next-btn');

    var loop = setInterval(function () {
        if (!playNextBtn.classList.contains('hide')) {
            console.log('end');
            playNextBtn.dispatchEvent(new MouseEvent('click'));
        }
    }, 1000);
})();