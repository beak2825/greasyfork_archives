// ==UserScript==
// @name         花粉俱乐部自动登录
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       ddrrcc
// @match        https://id1.cloud.huawei.com/*
// @match        https://club.huawei.com/*
// @match        https://club.huawei.com/member.php*
// @icon         http://demo.sc.chinaz.com/Files/pic/icons/5917/r13.png
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412242/%E8%8A%B1%E7%B2%89%E4%BF%B1%E4%B9%90%E9%83%A8%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/412242/%E8%8A%B1%E7%B2%89%E4%BF%B1%E4%B9%90%E9%83%A8%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    if($("#loginandreg a:eq(0)").text() == "登录"){
        $("#loginandreg a:eq(0)")[0].click();
     }

    setTimeout(()=>{
        $(".hwid-btn.hwid-btn-primary.hwid-login-btn").click();
    },1500)
})();