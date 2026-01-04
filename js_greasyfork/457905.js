// ==UserScript==
// @name         中网院助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动播放视频
// @author       You
// @match        *://cela.e-celap.com/dsfa/nc/pc/course/views/*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @require      http://code.jquery.com/jquery-2.1.1.min.js
// @grant        none
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/457905/%E4%B8%AD%E7%BD%91%E9%99%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/457905/%E4%B8%AD%E7%BD%91%E9%99%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //检查暂停则播放
    function bf(){
        if($('video')[0].paused){
            $('video')[0].play();
        }
    }
    setInterval(bf,1000);

})();