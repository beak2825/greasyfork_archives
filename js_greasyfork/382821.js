// ==UserScript==
// @name         东农图书馆验证码计算
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在登录预定网页后可自动计算验证表达式并填入
// @author       Laurence_wang
// @match        http://yd.lib.neau.edu.cn/*
// @grant        none
// @include      http://yd.lib.neau.edu.cn/*
// @downloadURL https://update.greasyfork.org/scripts/382821/%E4%B8%9C%E5%86%9C%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/382821/%E4%B8%9C%E5%86%9C%E5%9B%BE%E4%B9%A6%E9%A6%86%E9%AA%8C%E8%AF%81%E7%A0%81%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var math_code;
    var res;
    math_code = document.getElementById('timutext').innerHTML;
    res = eval(math_code.slice(3, math_code.length - 2));
    document.getElementById('yz').value = res;
    //window.alert(res);
})();