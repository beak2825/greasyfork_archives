// ==UserScript==
// @name         CCF 选手注册页面验证码自动填充
// @namespace    http://tampermonkey.net/
// @version      1
// @description  CCF txdy!
// @author       rainy
// @match        http://rg.noi.cn/index.php
// @grant        none
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/403958/CCF%20%E9%80%89%E6%89%8B%E6%B3%A8%E5%86%8C%E9%A1%B5%E9%9D%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/403958/CCF%20%E9%80%89%E6%89%8B%E6%B3%A8%E5%86%8C%E9%A1%B5%E9%9D%A2%E9%AA%8C%E8%AF%81%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

$(window).load(function(){
    'use strict';
    $("#checkCode")[0].value = $("#hiddenCheckCode")[0].value;
});