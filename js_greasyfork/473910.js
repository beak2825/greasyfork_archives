// ==UserScript==
// @name         住院医师规范化培训|冰河传媒|网课不暂停
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  阻止网课自动暂停!
// @author       zhang ruichao
// @match        http://2023zhupei01.iceriverbj.com/video/play/id/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=iceriverbj.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473910/%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%7C%E5%86%B0%E6%B2%B3%E4%BC%A0%E5%AA%92%7C%E7%BD%91%E8%AF%BE%E4%B8%8D%E6%9A%82%E5%81%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/473910/%E4%BD%8F%E9%99%A2%E5%8C%BB%E5%B8%88%E8%A7%84%E8%8C%83%E5%8C%96%E5%9F%B9%E8%AE%AD%7C%E5%86%B0%E6%B2%B3%E4%BC%A0%E5%AA%92%7C%E7%BD%91%E8%AF%BE%E4%B8%8D%E6%9A%82%E5%81%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here..
    //检测是否暂停
    var thisvideo=document.querySelector("video")
    function detective()
    {
        if(thisvideo.paused==true){
            thisvideo.play();
            thisvideo.playbackRate=2;
        }
        if(thisvideo.ended==true || document.getElementById('layui-layer1')!=null){
            window.location.href="http://2023zhupei01.iceriverbj.com/index/index"
        }
    }
    setInterval(detective,1000)
})();