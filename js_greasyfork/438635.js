// ==UserScript==
// @name         bilibili视频自动二倍速
// @namespace    https://greasyfork.org/zh-CN/scripts/438635
// @version      1.0
// @description  看b站视频自动二倍速
// @author       SolitudeFate
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438635/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/438635/bilibili%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E4%BA%8C%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //视频自动开启二倍速
    let interval = setInterval(() => {
        //判断此时是不是二倍速
        if(document.getElementsByClassName('bpx-player-ctrl-playbackrate-result')[0].innerHTML != "2.0x"){
           //开启二倍速
           document.getElementsByClassName('bpx-player-ctrl-playbackrate-menu ')[0].getElementsByTagName("li")[0].click();
           clearInterval(interval);
        }
    }, 100)
})();