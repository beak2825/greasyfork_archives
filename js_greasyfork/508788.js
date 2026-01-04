// ==UserScript==
// @name         跳过 NOI 报名网站验证码
// @namespace    http://tampermonkey.net/
// @description  跳过 NOI 报名网站验证码。
// @version      11.45.14
// @author       €€￡
// @license      MIT
// @match        *://cspsjtest.noi.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=noi.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508788/%E8%B7%B3%E8%BF%87%20NOI%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/508788/%E8%B7%B3%E8%BF%87%20NOI%20%E6%8A%A5%E5%90%8D%E7%BD%91%E7%AB%99%E9%AA%8C%E8%AF%81%E7%A0%81.meta.js
// ==/UserScript==

(function()
{
    'use strict';
    window.onload=function()
    {
        $('#loginForm').validate().settings.rules.checkCode={checkCode:true};
        $('#loginForm').validate().settings.rules={};
        $('#loginForm').validate().settings.messages={};
        $('button[type="submit"]').off('click').on('click',function(event)
        {
            event.preventDefault();
            $('#loginForm').submit();
        });
        $('#checkCode').closest('.form-group').hide();
        $('#codeImg').hide();
    };
})();