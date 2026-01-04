// ==UserScript==
// @name         微博视频下载
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description 微博视频直接点击下载
// @author       You
// @match        https://weibo.com/tv/v/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377143/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377143/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function get_data(){
        var text = $('#playerRoom').html().toString();
        var re_data = /action-data="(.*?)"/;
        var find = 'https:'+text.match(re_data)[1].replace(/&amp/g,'').split('player')[0].split('video_src=')[1].replace(/%2F/g,'/').replace(/%3F/g,'?').replace(/%3D/g,'=').replace(/%26/g,'&').replace(/%2C/g,',').replace(/%25/g,'%').replace(/;/g,'');
        $('.bot_number').after('<div class="bot_number W_fr W_f14 download"><a class="download" target="_blank" style="margin-left: -30px;color: black;    position: relative;top: 1px;" href="'+find+'">下载</a></div>')
    
    }

    get_data()


    // Your code here...
})();