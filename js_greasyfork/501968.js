// ==UserScript==
// @name         B站 网页宽屏
// @namespace    https://greasyfork.org/users/91873
// @version      1.0.0.2
// @description  Bilibili Autoplay & WideScreen
// @author       wujixian
// @match        http*://*bilibili.com/video/*
// @match        https*//*bilibili.com/bangumi/play/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/501968/B%E7%AB%99%20%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501968/B%E7%AB%99%20%E7%BD%91%E9%A1%B5%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SN = '[B站 网页宽屏]' // script name
    console.log(SN, '油猴脚本开始')

    setTimeout(function(){
        $('.bilibili-player-video-btn-widescreen').click();
        console.log(SN, 'Done');
    }, 5000);
})();
