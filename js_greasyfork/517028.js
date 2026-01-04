// ==UserScript==
// @name         重庆普法考试2024-挂视频用-代刷vx:shuake345
// @namespace    代刷vx:shuake345
// @version      0.4
// @description  刷视频|代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        *://ks.cqsdx.cn/exam/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cqsdx.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517028/%E9%87%8D%E5%BA%86%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%952024-%E6%8C%82%E8%A7%86%E9%A2%91%E7%94%A8-%E4%BB%A3%E5%88%B7vx%3Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/517028/%E9%87%8D%E5%BA%86%E6%99%AE%E6%B3%95%E8%80%83%E8%AF%952024-%E6%8C%82%E8%A7%86%E9%A2%91%E7%94%A8-%E4%BB%A3%E5%88%B7vx%3Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function tiquTM(){
        document.querySelector('iframe').contentWindow.document.querySelector("body > div > div > div> button").click()
    }
    setInterval(tiquTM,5512)
    function BFbmiju(){
        if(document.getElementsByTagName('video').length!==0){

            if(document.getElementsByTagName('video')[0].paused){
                if(document.querySelectorAll("div > div.swal2-actions> button")!==null){
                    if(document.querySelectorAll("div > div.swal2-actions> button")[0].innerText=='确认'){
                        document.querySelectorAll("div > div.swal2-actions> button")[0].click()
                    }else{
                        document.getElementsByTagName('video')[0].play()
                    }
                }

            }
        }
        if(document.querySelectorAll(".badge.bg-muted")!==null){
            document.querySelectorAll(".badge.bg-muted")[0].parentElement.nextElementSibling.nextElementSibling.querySelector('a').click()
        }
    }
    setInterval(BFbmiju,6545)
})();