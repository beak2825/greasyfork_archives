// ==UserScript==
// @name         viu加寬播放器
// @namespace    https://greasyfork.org/users/179168/
// @version      0.2
// @description  加寬非全螢幕模式下的viu播放器和隱藏水印
// @author       YellowPlus
// @match        https://www.viu.com/ott/hk/zh-hk/vod/*
// @grant        none
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/374569/viu%E5%8A%A0%E5%AF%AC%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/374569/viu%E5%8A%A0%E5%AF%AC%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function(){
        $(".v-player").width(1170).height(658);
        $(".video-grid-s .video-cmd").parent().parent().prepend($(".v-player-list"));
        $(".fp-play-now").css("visibility", "hidden");
    });
})();