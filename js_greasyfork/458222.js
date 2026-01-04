// ==UserScript==
// @name         Classin播放进度记录
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  记录Classin回放视频的播放进度
// @author       H-OH
// @match        https://live.eeo.cn/pc.html?*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/458222/Classin%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/458222/Classin%E6%92%AD%E6%94%BE%E8%BF%9B%E5%BA%A6%E8%AE%B0%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let key=window.location.search;
    let data=GM_getValue(key,-1);
    let timer=setInterval(check,300);

    function check()
    {
        let video=document.getElementById("player_html5_api");
        if(video===null)
            return;
        clearInterval(timer);
        if(~data)
            video.currentTime=data;
        setInterval(()=>GM_setValue(key,video.currentTime),1000);
    }
})();