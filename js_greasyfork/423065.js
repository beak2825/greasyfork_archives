// ==UserScript==
// @name         B站视频往下移
// @namespace    bilibili-polar
// @version      0.2
// @description  B站视频往下移，琪琪专用
// @author       Polar
// @match        *://www.bilibili.com/video/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423065/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BE%80%E4%B8%8B%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/423065/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%BE%80%E4%B8%8B%E7%A7%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        var $player = $('#playerWrap');
        $player.css('margin-top', 400);
    });
})();