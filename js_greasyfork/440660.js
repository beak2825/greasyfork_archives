// ==UserScript==
// @name         为全员培训播放器增加倍速按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  培训的视频播放器,没有倍速功能,加了个按钮.
// @author       You
// @match        https://hbt.gpa.enetedu.com/Common/RecordPlayBack*
// @icon         https://www.google.com/s2/favicons?domain=enetedu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440660/%E4%B8%BA%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/440660/%E4%B8%BA%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%8A%A0%E5%80%8D%E9%80%9F%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function go()
    {
        // Your code here...
        var a=document.createElement("button");

        var x=document.createTextNode("1倍速");
        a.appendChild(x);
        a.style="    position: absolute;    z-index: 9999;    top: 0;    left: 40px;"
        a.onclick=function (){document.querySelector("video").playbackRate=1;}


        document.querySelector(".videoCourse").append(a);

        a=document.createElement("button");

        x=document.createTextNode("2倍速");
        a.appendChild(x);
        a.style="    position: absolute;    z-index: 9999;    top: 0;    left: 0px;"
        a.onclick=function (){document.querySelector("video").playbackRate=2;}

        document.querySelector(".videoCourse").append(a);




    }
    setTimeout(go,3000)
})();