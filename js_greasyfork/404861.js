// ==UserScript==
// @name         青年大摸鱼
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  快速跳过视频，节省时间。
// @author       a_handsome_guy
// @match        *://h5.cyol.com/*
// @match        *://dxx.cyol.com/*
// @grant        none
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/404861/%E9%9D%92%E5%B9%B4%E5%A4%A7%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/404861/%E9%9D%92%E5%B9%B4%E5%A4%A7%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var sb = document.getElementById("Bvideo");
    var superSB="http://h5.cyol.com/special/daxuexi/wzquanhui/m.html"
    var url = window.location.href;
    if(url == superSB)
    {
        document.querySelector("body > div.section4").className="section4 topindex1";
    }
    else
    {
        var url1=url.split("?");
        if(url1[0]==superSB)
        {
            document.querySelector("body > div.section4").className="section4 topindex1";
        }
        else
        {
            document.querySelector("body> div.container > div.section3").className="section3 topindex1";
            //from https://greasyfork.org/zh-CN/scripts/406800-%E9%9D%92%E5%B9%B4%E5%A4%A7%E5%AD%A6%E4%B9%A0%E8%A7%86%E9%A2%91%E8%B7%B3%E8%BF%87
        }
    }
    //If both fails,use original skip video method
    var i=0;
    //sb.addEventListener("timeupdate",function(){setTimeout(function(){ sb.currentTime=10000; }, 1000);})
    setInterval(
        function(){
            var videos = document.getElementsByTagName('video');
            for(var i = 0; i < videos.length; i++) {
            videos[i].currentTime=114514;}
        }
        ,1000);

})();