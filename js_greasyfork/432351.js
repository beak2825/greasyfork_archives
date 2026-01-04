// ==UserScript==
// @name         跳过bilibili充电鸣谢
// @namespace    怒火无边
// @version      4.0
// @description  跳过bilibili充电鸣谢，自动连续播放
// @author       怒火无边
// @match        https://www.bilibili.com/video/*
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @grant        GM_deleteValue
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/432351/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/432351/%E8%B7%B3%E8%BF%87bilibili%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    var myVar;
    function myFunction() {
        myVar = setTimeout(function func(){
            console.log("东哥牛A");
            if(document.getElementsByTagName('bwp-video').length>0){
                console.log("东哥牛B")
                document.getElementsByTagName('bwp-video')[0].onended=function(){
                    if(document.getElementsByClassName('bilibili-player-video-btn-next')[0]){
                        document.getElementsByClassName('bilibili-player-video-btn-next')[0].click()
                    }
                    if(document.getElementsByClassName('bpx-player-ctrl-next')[0]){
                        document.getElementsByClassName('bpx-player-ctrl-next')[0].click()
                    }
                }
            }
            if(document.getElementsByTagName('video').length>0){
                console.log("东哥牛C")
                document.getElementsByTagName('video')[0].onended=function(){
                    if(document.getElementsByClassName('bilibili-player-video-btn-next')[0]){
                        document.getElementsByClassName('bilibili-player-video-btn-next')[0].click()
                    }
                    if(document.getElementsByClassName('bpx-player-ctrl-next')[0]){
                        document.getElementsByClassName('bpx-player-ctrl-next')[0].click()
                    }
                }
            }
        }, 5000);
    }
    myFunction();
})();