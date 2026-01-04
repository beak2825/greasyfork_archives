// ==UserScript==
// @name         智学网自动打卡
// @namespace    http://tampermonkey.net/
// @include      https://www.zhixue.com/zbpttools/*
// @description  通过发送click消息,实现智学网自动打卡
// @version      11.4514
// @author       TheKOG
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430893/%E6%99%BA%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/430893/%E6%99%BA%E5%AD%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jq = document.createElement('script');
    jq.setAttribute('src', 'https://libs.baidu.com/jquery/1.9.0/jquery.js');
    document.body.append(jq);
    setTimeout(() => {
        setInterval(() => {
            console.log("自动签到中....");
            if(document.getElementsByClassName("btn").length!=0){
                console.log("fuckpps");
                setTimeout(() => {
                    document.getElementsByClassName("btn")[0].click();
                }, 1000);
                console.log("%c签到成功，时间：" + (new Date().getMonth() + 1) + "/" + String(new Date()).replace(/[a-zA-Z]/g, "").substring(2).replace(/\+.*/g, ""), 'color:green;');
            }
        }, 1000);
    }, 2000);
})();