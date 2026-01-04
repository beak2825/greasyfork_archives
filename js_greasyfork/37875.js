// ==UserScript==
// @name         咪咕直播界面精简
// @version      2018.1.27
// @description  try to take over the world!
// @namespace    https://jeff.wtf
// @author       kindJeff
// @match        http://music.migu.cn/v2/live/*
// @match        https://music.migu.cn/v2/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37875/%E5%92%AA%E5%92%95%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.user.js
// @updateURL https://update.greasyfork.org/scripts/37875/%E5%92%AA%E5%92%95%E7%9B%B4%E6%92%AD%E7%95%8C%E9%9D%A2%E7%B2%BE%E7%AE%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function main(){
        var sheet = window.document.styleSheets[0];
        sheet.insertRule('#J_NormalGifts { display: none; }', sheet.cssRules.length);
        sheet.insertRule('#J_SpecialGift { display: none; }', sheet.cssRules.length);
        $(".live-room-banner").remove();
        $('.hot-words-list').remove();
        $('.bulletin').remove();
        $("#J_WatchSidebarContainer").remove();
        $('#J_GiftsContainer').remove();
        $('#J_SpecialGift').remove();

        $('.container')[3].remove();
        $('.container')[3].remove();
        $('.container')[3].remove();
        $('.container')[3].remove();
        $('.container')[3].remove();

        function clear_danmu(){
            $(".barrage-list").children().remove();
        }

        $("#J_LiveRoom").css('margin-top', '20px');

        document.getElementsByClassName('container')[2].style.width = '70%';
        $("#J_MiguVideoPlayer").css('height', '100%');
        $("#J_MiguVideoPlayer").css('width', '100%');
        $(".live-room").css('height', '100%');
        $(".live-room .video-player-container").css('height', '100%');
        $(".live-room .video-player-container").css('width', '100%');
        $("#J_WatchContainer").css('height', '100%');
    }

    var init_func = function(){
        setTimeout(main, 3000);
    };
    if (document.readyState != 'loading'){
        init_func();
    }else{
        document.addEventListener('DOMContentLoaded', init_func);
    }
})();