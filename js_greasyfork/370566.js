// ==UserScript==
// @name         下载japonx的字幕和视频
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  下载japonx的字幕和视频。
// @author       bestYy
// @include     https://www.japonx.net/portal/index/detail/id/*
// @run-at      document-end
// @require      https://code.jquery.com/jquery-latest.js
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/370566/%E4%B8%8B%E8%BD%BDjaponx%E7%9A%84%E5%AD%97%E5%B9%95%E5%92%8C%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/370566/%E4%B8%8B%E8%BD%BDjaponx%E7%9A%84%E5%AD%97%E5%B9%95%E5%92%8C%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function(){
    'use strict';
    var isCall = true;
    var funcCall = function(){
        if(isCall){
            var $btnDiv = $('#d-btn');
            var zmSrc = $('track').attr('src');
            var shipinSrc = $('video').attr('src');
            if(shipinSrc && shipinSrc != 'undefined'){
                GM_addStyle("#d-btn {float: none;margin-left: 100px;margin-top: 5px;}");
                var $spBtn = $('<a style="color:black;width:120px;margin-top:5px;" class="d-btn download" target="_blank" href="'+ shipinSrc +'">下載视频</a>');
                $btnDiv.append($spBtn);
                isCall = false
                clearInterval(timer);
            };
            if(zmSrc && zmSrc != 'undefined'){
                GM_addStyle("#d-btn {float: none;margin-left: 100px;margin-top: 5px;}");
                var zmUrl = "https://" + location.host + zmSrc;
                var $zmBtn = $('<a style="color:black;width:120px;margin-top:5px;" class="d-btn download" target="_blank" href="'+ zmUrl +'">下載字幕</a>');
                $btnDiv.append($zmBtn);
            };
        }
    };
    $('#do_play_2').trigger("click");
   var timer = setInterval(funcCall,1000)
})();