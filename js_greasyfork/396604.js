// ==UserScript==
// @name         慕课网自动播放下一节Plus版
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动播放下一节视频,解放你的双手
// @author       Lionxxw
// @match        *://*.imooc.com/*
// @icon         https://www.imooc.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396604/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82Plus%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/396604/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E8%8A%82Plus%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var loop = setInterval(function () {
        var nextMask = document.getElementById('next-mask')
        if (nextMask.className === 'next-mask in'){
            var next = document.getElementsByClassName('next-btn js-next-media')
            if (next != null && next != undefined){
                next[0].click()
            }
        }
    }, 1000);
})();