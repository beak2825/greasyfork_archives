// ==UserScript==
// @name         SpeeeedUp YQYC
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  SpeedUp YQYC Video
// @author       Y
// @match        https://app.hrss.xm.gov.cn/px/Pages/*
// @match        https://yqyc.fjylzbrt.com:8090/px/Pages/CourseVideoPlay.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423111/SpeeeedUp%20YQYC.user.js
// @updateURL https://update.greasyfork.org/scripts/423111/SpeeeedUp%20YQYC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var ask_permission = false;
    setTimeout(function() {
        if(ask_permission == false) {
            Notification.requestPermission();
            ask_permission = true;
        }

        var speedup = setInterval(function() {
            if(document.getElementById("divVideoMain") != undefined) {
                //document.getElementsByTagName("video")[0].playbackRate=16;
                console.log("speed up to 16x !")
                clearInterval(speedup);
            }
        }, 5000);

        setInterval(function() {
            if(document.querySelector(".layui-layer-btn0") != undefined) {
                console.log("close dialog !")
                setTimeout(function(){
                    document.querySelector(".layui-layer-btn0").click()
                }, 1000);
            }
        }, 5000);
    }, 1000);
})();