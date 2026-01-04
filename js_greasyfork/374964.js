// ==UserScript==
// @name         DisableAutoPlay
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.panda.tv/
// @match        https://www.douyu.com/
// @require      https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374964/DisableAutoPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/374964/DisableAutoPlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var currentHost = window.location.host;
    if(currentHost.indexOf("panda") > -1){
        $("video#room-h5player-video").removeAttr("autoplay");
        //通过设置地址为空，阻止自动播放
        $("video#room-h5player-video").attr("src","");
    }

    if(currentHost.indexOf("douyu") > -1){
        $("video#__video").removeAttr("autoplay");
        //通过设置地址为空，阻止自动播放
        $("video#__video").attr("src","");
    }
})();