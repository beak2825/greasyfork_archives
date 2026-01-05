// ==UserScript==
// @name         熊猫TV不用登录就可以一直看超清啦 H5播放器
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  不用登录就可以一直看超清啦；启用了H5播放器，妈妈再也不用担flash问题啦；屏蔽了右侧弹幕，不喜欢弹幕的同学再也不用屏蔽啦；直播间列表点击后在新的页面打开直播间
// @author       HC
// @match        http://www.panda.tv/*
// @include        *://www.panda.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30041/%E7%86%8A%E7%8C%ABTV%E4%B8%8D%E7%94%A8%E7%99%BB%E5%BD%95%E5%B0%B1%E5%8F%AF%E4%BB%A5%E4%B8%80%E7%9B%B4%E7%9C%8B%E8%B6%85%E6%B8%85%E5%95%A6%20H5%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/30041/%E7%86%8A%E7%8C%ABTV%E4%B8%8D%E7%94%A8%E7%99%BB%E5%BD%95%E5%B0%B1%E5%8F%AF%E4%BB%A5%E4%B8%80%E7%9B%B4%E7%9C%8B%E8%B6%85%E6%B8%85%E5%95%A6%20H5%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    localStorage.setItem('panda.tv/user/player', '{"useH5player":true}');
    localStorage.setItem('panda.tv/user/setting','{"forbid_chat_gift":"1","ftq_flash_show":"0","ftq_room_notice":"0","color_speak_card":"0","forbid_flash_gift":"0","chat_msg_color":"","forbid_chat_notice":"1","cate_sort":""}');
    WebSocket = function () {};
})();
$(document).ready(function () {
    var path = window.location.pathname;
    var reg = /[a-zA-Z]+/;    
    if (reg.test(path)) {
        document.querySelectorAll('.video-list-item-wrap').forEach(function (e) {
            e.setAttribute('target', '_blank');
        });        
    }
    delete EventSource;
    PANDA_MONITOR = {
        'commonParams': {}
    };
    
});