// ==UserScript==
// @name         Mac斗鱼播放器
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  用Mac斗鱼打开直播间
// @author       Garyon
// @match        *://*.douyu.com/*
// @grant        none
// @tampermonkey-safari-promotion-code-request e9aabaa5-8459-4444-a031-f469c396be5f
// @downloadURL https://update.greasyfork.org/scripts/36608/Mac%E6%96%97%E9%B1%BC%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/36608/Mac%E6%96%97%E9%B1%BC%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    function openMacVideo() {
        try {
            var count = 0;
            var sin = setInterval(() => {
                var title_a = document.querySelector(".Title-report");
                var ooo = document.querySelector('.PhoneWatch-qrcodeTitle');
                if (title_a && ooo) {
                    console.log(title_a);
                    var roomid = /\d+/.exec(title_a.href)[0];
                    ooo.innerHTML='<li><span id="openMacPlayer"><a href = "dy://room/'+roomid+'">Mac斗鱼</span></li>';
                    clearInterval(sin);
                }
                if (count > 50) {clearInterval(sin);} else {count++; }
            }, 100);}
        catch(error){
            console.error(error);
        }
    }
    window.onload = openMacVideo;
})();