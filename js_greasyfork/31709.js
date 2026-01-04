// ==UserScript==
// @name         吾爱破解论坛回帖自动填写验证问题答案
// @namespace    http://bmqy.net/
// @version      1.0
// @description  吾爱破解论坛点击回帖内容输入框后，自动填写验证问题答案
// @author       bmqy
// @match        http://*.52pojie.cn/*
// @match        https://*.52pojie.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31709/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%B8%96%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%AA%8C%E8%AF%81%E9%97%AE%E9%A2%98%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/31709/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%9B%9E%E5%B8%96%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E9%AA%8C%E8%AF%81%E9%97%AE%E9%A2%98%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSpecialTextByElement(obj){
        var sAnswerText = '';
        var reg = /(?<=答案：)(.*)/g;
        if(reg.test(obj.innerText)){
            sAnswerText = RegExp.$1;
        }
        return sAnswerText;
    }

    document.addEventListener('DOMNodeInserted', function(e){
        var oInput = document.querySelector('input[name=secanswer]');
        if(oInput){
            var oAnswer = oInput.parentNode.parentNode.querySelector('.p_pop.p_opt');
            var sAnswer = getSpecialTextByElement(oAnswer);
            document.querySelector('input[name=secanswer]').value = sAnswer;
        }
    });
})();