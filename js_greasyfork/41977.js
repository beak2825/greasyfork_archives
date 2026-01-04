// ==UserScript==
// @name         修复中国大陆登录Ameba的reCAPTCHA验证问题
// @namespace    colife
// @version      0.2.1
// @description  Take it easy to use reCAPTCHA!
// @author       CoLife
// @match        https://dauth.user.ameba.jp/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/41977/%E4%BF%AE%E5%A4%8D%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%99%BB%E5%BD%95Ameba%E7%9A%84reCAPTCHA%E9%AA%8C%E8%AF%81%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/41977/%E4%BF%AE%E5%A4%8D%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E7%99%BB%E5%BD%95Ameba%E7%9A%84reCAPTCHA%E9%AA%8C%E8%AF%81%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var timer = setInterval(function(){
        var reCaptchaElement = $('.g-recaptcha');
        if (reCaptchaElement.length && !$('.g-recaptcha').attr('data-mirror-used')) {
            clearInterval(timer);

            $('.g-recaptcha').attr('data-mirror-used', '1');

            $('[name="accountId"]').attr('placeholder', '电子邮件地址或Ameba ID');
            $('[name="password"]').attr('placeholder', '密码');
            $('.c-checkbox__label').text('显示');
            $('button[type="submit"]').text('登录Ameba');

            reCaptchaElement.before('<span style="font-size: 12px; color: #666; line-height: 30px;">验证码加载需要30秒左右的时间，请耐心等待</span>');

            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = "https://recaptcha.net/recaptcha/api.js";
            $("head").append(s);
        }
    }, 100);
})();