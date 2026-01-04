// ==UserScript==
// @name         B站视频3倍速
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站视频倍速选项卡增加3.0倍速和2.0倍速
// @author       huhu727
// @match        https://www.bilibili.com/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469423/B%E7%AB%99%E8%A7%86%E9%A2%913%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/469423/B%E7%AB%99%E8%A7%86%E9%A2%913%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var ul_inner_html='<li class="bpx-player-ctrl-playbackrate-menu-item" data-value="3">3.0x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="2.5">2.5x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="2">2.0x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="1.5">1.5x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="1.25">1.25x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="1">1.0x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="0.75">0.75x</li><li class="bpx-player-ctrl-playbackrate-menu-item" data-value="0.5">0.5x</li>'

    var loop1 = setInterval(() => {
        if(document.querySelector('ul[class="bpx-player-ctrl-playbackrate-menu"]')!=null){
            document.querySelector('ul[class="bpx-player-ctrl-playbackrate-menu"]').innerHTML=ul_inner_html
            clearInterval(loop1)
            }
    },100)
})();