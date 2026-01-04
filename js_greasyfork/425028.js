// ==UserScript==
// @name         CSDN Reading mode togger
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  用于csdn博客阅读时内容区域扩大
// @author       宏斌
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425028/CSDN%20Reading%20mode%20togger.user.js
// @updateURL https://update.greasyfork.org/scripts/425028/CSDN%20Reading%20mode%20togger.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const okBtn = document.createElement('button');
    okBtn.id = 'ReadingMode';
    okBtn.setAttribute('class','option-box');
    okBtn.innerText = 'R'
//    $(".blog-content-box").append(okBtn);
//    $(".more-toolbox").append(okBtn);
    $('.left-toolbox').append(okBtn);
    $("#ReadingMode").css({ width: '50px',height:'50px','border-radius':'2px','background-color':'#fff','font-size':'25px','color':'#fff'});
    $('#ReadingMode').css({"background": 'linear-gradient(145deg, #bcbcbc, #e0e0e0)','box-shadow':  '5px 5px 34px #969696, -5px -5px 34px #ffffff'});
    const mystyles = document.createElement('style');
    mystyles.type = 'text/css';
    $("head").append(mystyles);
    $("#mainBox").css("transition","width 0.3s linear");
    $("#rightAside").css("transition","width 0.3s linear");
    mystyles.innerHTML = `.fillWidth{width: 100% !important} .zeroWidth{width: 0 !important}`;
    $("#ReadingMode").on('click',() => {
    $("#mainBox").toggleClass('fillWidth');
    $('main').toggleClass('fillWidth');
    $("#rightAside").toggleClass("zeroWidth");



})
})();