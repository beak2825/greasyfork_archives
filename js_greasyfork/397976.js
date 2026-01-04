// ==UserScript==
// @name         广东继续教育和公需课自动刷课辅助登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动登录
// @author       WCT
// @match        http://ggfw.gdhrss.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397976/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/397976/%E5%B9%BF%E4%B8%9C%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E5%92%8C%E5%85%AC%E9%9C%80%E8%AF%BE%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%E8%BE%85%E5%8A%A9%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = location.href;
    if (url.match(/http:\/\/ggfw.gdhrss.gov.cn\/ssologin\/login/i)) {
        $.ajax({
            type: "get",
            async: false,
            url: "https://localhost:44399/Customer/GetCustomerIsAwait",
            success: function(data){
                $("#username_personal").val(data.account);
                $("#password_personal").val(data.password);
                var img = document.getElementById('codeimg');
                var imgBase64 = getBase64Image(img);
                var ttdata = {
                    "username": "wangchengtian",
                    "password": "wct742368",
                    "image": imgBase64
                }
                $.ajax({
                    type: "post",
                    url: "http://api.ttshitu.com/base64",
                    contentType: "application/json; charset=utf-8",
                    async: false,
                    dataType : "json",
                    data: JSON.stringify(ttdata),
                    success: function(res){
                        if(res.success){
                            $("#vcode_personal").val(res.data.result);
                            fnDoPersonLogin();
                            fnDoNormalLogin();
                        }
                    }
                });
            }
        });
    }
})();

function getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, img.width, img.height);
    var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
    var dataURL = canvas.toDataURL(ext);
    var base64 = dataURL.slice(22);
    return base64;
}
