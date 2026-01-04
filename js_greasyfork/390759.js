// ==UserScript==
// @name         干他妈的agmov自动暂停
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  干掉https://agmov.com的自动暂停
// @author       bllli & f5fly
// @match        https://agmov.com/video/play/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390759/%E5%B9%B2%E4%BB%96%E5%A6%88%E7%9A%84agmov%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/390759/%E5%B9%B2%E4%BB%96%E5%A6%88%E7%9A%84agmov%E8%87%AA%E5%8A%A8%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var fucking = window.setInterval(function(){
        console.log("fucking...");
        if (typeof videojs == 'undefined') {console.log("还没加载好 等一下"); return;}
        // 视频还没加载好的话，这里直接报错
        var player = videojs('playVideo');
        // console.log('player', player)
        // 测试效果
        player.on('pause', function(){console.log("pause")});
        player.off('timeupdate');
        clearInterval(fucking);
        console.log('fucked');
    }, 3000);

})();