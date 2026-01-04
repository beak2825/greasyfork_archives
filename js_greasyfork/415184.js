// ==UserScript==
// @name         動畫瘋被拉成 16:9 的 4:3 修復
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  棋靈王之類的用的 ....
// @author       南蠻酋長
// @match        *://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://i2.bahamut.com.tw/anime/baha_s.png
// @downloadURL https://update.greasyfork.org/scripts/415184/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A2%AB%E6%8B%89%E6%88%90%2016%3A9%20%E7%9A%84%204%3A3%20%E4%BF%AE%E5%BE%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/415184/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A2%AB%E6%8B%89%E6%88%90%2016%3A9%20%E7%9A%84%204%3A3%20%E4%BF%AE%E5%BE%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let initInterval = setInterval(function(){
        let optionPlaneElem = document.getElementById("ani-tab-content-2");
        let documentReady = document.readyState === "complete"
            || (document.readyState !== "loading" && !document.documentElement.doScroll);
        if(optionPlaneElem && documentReady) {
            $('#ani_video_html5_api').css('transform', 'scaleX(0.8)');
            clearInterval(initInterval);
        }
    },500);
})();