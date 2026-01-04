// ==UserScript==
// @name         🔥吹牛题目修改🐻妖火网插件
// @namespace    yaohuotimu
// @version        2.22.2
// @description    修改题目 增加欧气
// @author         路数
// @match         *://yaohuo.me/*
// @match         *://*.yaohuo.me/*
// @icon           https://yaohuo.me/css/favicon.ico
// @run-at         document-end
// @license         MIT
// @require         https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/471428/%F0%9F%94%A5%E5%90%B9%E7%89%9B%E9%A2%98%E7%9B%AE%E4%BF%AE%E6%94%B9%F0%9F%90%BB%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/471428/%F0%9F%94%A5%E5%90%B9%E7%89%9B%E9%A2%98%E7%9B%AE%E4%BF%AE%E6%94%B9%F0%9F%90%BB%E5%A6%96%E7%81%AB%E7%BD%91%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var data = [{"mymoney":550,"question":"云在青天水在瓶","answer1":"云","answer2":"水"},{"mymoney":550,"question":"奈何囊中羞涩啊","answer1":"羞","answer2":"阔"},{"mymoney":550,"question":"生命在于梭哈","answer1":"梭","answer2":"苟"},{"mymoney":550,"question":"我不爱生活我爱妖火","answer1":"是的","answer2":"艹"},{"mymoney":550,"question":"前天下雨今天下雨明天还下雨","answer1":"🌂","answer2":"🌞"}];
    
    function random(lower, upper) {
        return Math.floor(Math.random() * (upper - lower)) + lower;
    }
    
    var randomNum = random(0, data.length);
    var chiuniu = data[randomNum];
    
    
    $("input[name='mymoney']").val(chiuniu.mymoney);
    $("input[name='question']").val(chiuniu.question);
    $("input[name='answer1']").val(chiuniu.answer1);
    $("input[name='answer2']").val(chiuniu.answer2);

})();