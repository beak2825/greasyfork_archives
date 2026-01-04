// ==UserScript==
// @name         禁止暂停！！！！！！！
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  暂个毛线的停！！！！！！！！！
// @author       萌萌哒萌新
// @match        https://42.51.69.234:8003/*
//                    ↑可更换网址↑
// @icon         http://i0.hdslb.com/bfs/archive/88d0e0013ddd4d990a3c65d9db4e0f44a89c3924.jpg@57w_57h_1c.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435276/%E7%A6%81%E6%AD%A2%E6%9A%82%E5%81%9C%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/435276/%E7%A6%81%E6%AD%A2%E6%9A%82%E5%81%9C%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==


(function() {
    'use strict';
    console.log("111")
    let a=setInterval(function(){
        if($(".pv-icon-btn-play").length>1){
            $(".pv-playpause").click()
        }
                     },500)

})();

//(function() {
//    'use strict';
//    setInterval(function(){
//        document.getElementsByTagName('video')[1].pause=function(){return false};
//        //document.getElementsByTagName('video')[0].pause=function(){return false}
//        //                                  ↑0或1↑
//    },5000);
//})();