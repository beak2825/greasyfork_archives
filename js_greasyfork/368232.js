// ==UserScript==
// @name         Steam Screen Capture Upload Helper
// @namespace    //steamcommunity.com/sharedfiles/edititem/
// @version      0.2
// @description  （测试中）浏览器内上传游戏截图，可以显示在好友动态内
// @author       akmkira 
// @match        https://steamcommunity.com/sharedfiles/edititem/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368232/Steam%20Screen%20Capture%20Upload%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/368232/Steam%20Screen%20Capture%20Upload%20Helper.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.SubmitScreenCapture = function() {
        document.getElementsByName("file_type")[0].value = 5;
        // document.getElementsByName("consumer_app_id")[0].value = 570; // dota2
        SubmitItem( false );
    }
    document.querySelector('.page_controls').insertAdjacentHTML('beforeend', '<a href="#" onclick="window.SubmitScreenCapture()" class="btn_blue_white_innerfade btn_medium" style="margin-left: 10px;margin-right: 10px;"><span>上传为截图</span></a>');

})();