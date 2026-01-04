// ==UserScript==
// @name         2024-三科统编教材培训
// @namespace    
// @version      2024-08-26
// @description  2024年三科统编教材培训
// @author       You
// @match        https://bjpep.gensee.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505392/2024-%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/505392/2024-%E4%B8%89%E7%A7%91%E7%BB%9F%E7%BC%96%E6%95%99%E6%9D%90%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==
var log = console.log;
window.onload =( function () {
    setInterval(() => {
        if (document.URL.search("vod/play") > 1) {
            var temp = document.querySelector('.stop-reporting-text');
            if(temp.innerText == "本视频已播放结束"){
                //log(temp.innerText);
                window.location.href = "https://wp.pep.com.cn/web/index.php?/px/index/127";
            }
            var v = document.querySelector('video');
            if(v){
                v.muted = true;
                //v.playbackRate = 1;//倍速
                v.play();//播放
            }
        }
    }, 2e3)
})();