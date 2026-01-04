// ==UserScript==
// @icon            https://exmail.qq.com/exmail_logo.ico
// @name            腾讯企业邮箱，Fuck手机扫码登录-exmail.qq.com
// @namespace       https://www.cnblogs.com/steinven/
// @author          秒年度
// @require         http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @description     越来越多的反人类设计，只能逼得产品经理眼中的SB用户自己想点办法。点击二维码，自动将登录链接复制到剪切板，然后Ctrl+V粘贴到电脑微信里面的某个联系人（比如文件传输助手），点击链接登录就行了
// @match           *://exmail.qq.com/*
// @version         0.0.5
// @grant           GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/427619/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%EF%BC%8CFuck%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95-exmailqqcom.user.js
// @updateURL https://update.greasyfork.org/scripts/427619/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%EF%BC%8CFuck%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E7%99%BB%E5%BD%95-exmailqqcom.meta.js
// ==/UserScript==
( function () {
    'use strict' ;
    $( function () {
        var checkBtn = $("#wechat_scan_auto_login");
        checkBtn.click();
        var baseUrl = "https://exmail.qq.com/qy_mng_logic/wwlogin/scan/";
        $( "body > div > div > div.qrcode_login_content > div.qrcode_wrap > img" ).click( function () {
            var src_url = $("body > div > div > div.qrcode_login_content > div.qrcode_wrap > img").attr("src");
            var token = src_url.split('/')[src_url.split('/').length-1].split('?')[0]
            GM_setClipboard( baseUrl+token);
        });
    });
})();