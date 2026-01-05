// ==UserScript==
// @name         YouTube New UI
// @namespace    http://tampermonkey.net/
// @homepage     https://greasyfork.org/zh-CN/scripts/29403-youtube-new-ui
// @version      0.25
// @description  YouTube new UI with dark mode
// @compatible      chrome
// @compatible      firefox
// @icon            data:image/png;base64,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
// @author       instaer
// @match        *://www.youtube.com/*
// @run-at          document-start
// @license       MIT License
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/29403/YouTube%20New%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/29403/YouTube%20New%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(getCookie("VISITOR_INFO1_LIVE") !== null && getCookie("VISITOR_INFO1_LIVE") !== ""){
        console.log(getCookie("VISITOR_INFO1_LIVE"));
    }else{
        var Days = 7;
        var exp = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie="VISITOR_INFO1_LIVE=fPQ4jCL6EiE;expires=" + exp.toGMTString();
        setTimeout(function() {
            refresh();
        }, 960);
    }
    function getCookie(cookieName) {
        var strCookie = document.cookie;
        var arrCookie = strCookie.split("; ");
        for(var i = 0; i < arrCookie.length; i++){
            var arr = arrCookie[i].split("=");
            if(cookieName == arr[0]){
                return arr[1];
            }
        }
        return "";
    }
    function refresh(){
        var url = window.location.href;
        console.log(url);
        var once = url.split("#");
        if (once[1] != 1) {
            url += "#1";
            self.location.replace(url);
            window.location.reload();
        }
    }
})();