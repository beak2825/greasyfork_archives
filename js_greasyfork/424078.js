// ==UserScript==
// @name         白嫖机场随机账号
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        http://cxkv2.xyz/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/424078/%E7%99%BD%E5%AB%96%E6%9C%BA%E5%9C%BA%E9%9A%8F%E6%9C%BA%E8%B4%A6%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/424078/%E7%99%BD%E5%AB%96%E6%9C%BA%E5%9C%BA%E9%9A%8F%E6%9C%BA%E8%B4%A6%E5%8F%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href =window.location.href;
    if(href.indexOf("register") != -1){
        function randomString(length) {
            var str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            var result = '';
            for (var i = length; i > 0; --i)
                result += str[Math.floor(Math.random() * str.length)];
            return result;
        };
        var items = ['@qq.com','@163.com','@126.com','@gmail.com','@foxmail.com','@sina.com','@sohu.com'];
        var item = items[Math.floor(Math.random()*items.length)];
        var len = random(5, 15);
        var mail=randomString(len)+item;
        $('#name').attr('value',mail);
        $('#email').attr('value',mail);
        $('#passwd').attr('value',mail);
        $('#repasswd').attr('value',mail);
        $('#imtype').attr('value','1');
        $('#wechat').attr('value',mail);
        GM_setValue("mail",mail);
        function random(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }

    }else if(href.indexOf("login") != -1){

        $('#email').attr('value',GM_getValue("mail"));
        $('#passwd').attr('value',GM_getValue("mail"));
  GM_setValue("mail",mail);
    }else if(href.indexOf("user") != -1){
  GM_setValue("mail",mail);

    }

})();