// ==UserScript==
// @name         百度网盘视频倍速
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  为网页版百度网盘视频，添加倍速按钮（1.5倍， 1.75倍， 2倍）
// @author       Tes90
// @match        *://pan.baidu.com/play/video*
// @run-at       document-idle
// @grant        unsafeWindow
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/382594/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/382594/%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var faster = 0;

    function changePlayback(){
        if(faster==0){
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.5);
            $("#fps").html("切换为: 1.75速度");
            faster = faster + 1;
        }else if (faster ==1){
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1.75);
            $("#fps").html("切换为: 2.0倍速");
            faster = faster+1;
        }else if (faster ==2){
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(2);
            $("#fps").html("切换为: 正常倍速");
            faster = faster+1;
        }else{
            videojs.getPlayers("video-player").html5player.tech_.setPlaybackRate(1);
            $("#fps").html("切换为: 1.5倍速");
            faster = 0;
        }
    }
    var tb = document.getElementsByClassName("g-button")[2];
    var cb = document.createElement("a");
    cb.innerHTML='<a class="g-button" href="javascript:;" title="1.5倍速">'+
    '<span class="g-button-right">'+
        '<em class="icon icon-appeal" title="1.5倍速"></em>'+
        '<span id="fps" class="text" style="width: auto;">切换为: 1.5倍速</span></span></a>'
    tb.after(cb);
    cb.addEventListener ("click", changePlayback , false);



})();