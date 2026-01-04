// ==UserScript==
// @name         BILIBILI去除栏目
// @namespace     none
// @version      1.11
// @description  none
// @author       none
// @match        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414598/BILIBILI%E5%8E%BB%E9%99%A4%E6%A0%8F%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/414598/BILIBILI%E5%8E%BB%E9%99%A4%E6%A0%8F%E7%9B%AE.meta.js
// ==/UserScript==

(function () {
    let css = '#reportFirst2{display:none !important;height:0 !important}';//推广
    css +='#bili_report_read{display:none !important;height:0 !important}';//专栏
    css +='#bili_fashion{display:none !important;height:0 !important}';//时尚
    css +='#bili_ent{display:none !important;height:0 !important}';//娱乐
    css +='#bili_guochuang{display:none !important;height:0 !important}';//国创
    css +='#bili_cinephile{display:none !important;height:0 !important}';//影视
    css +='#bili_information{display:none !important;height:0 !important}';//资讯
    css +='#bili_kichiku{display:none !important;height:0 !important}';//鬼畜
    css +='#bili_douga{display:none !important;height:0 !important}';//动画
    css +='#bili_life{display:none !important;height:0 !important}';//生活
    css +='#bili_animal{display:none !important;height:0 !important}';//动物
    css +='#bili_knowledge{display:none !important;height:0 !important}';//知识
    css +='#bili_sports{display:none !important;height:0 !important}';//运动
    css +='#bili_report_spe_rec{display:none !important;height:0 !important}';//特别推荐
//播放器
    css +='.bilibili-player-popup-area{display:none !important;height:0 !important}';//特别推荐

    loadStyle(css);

    function loadStyle(css) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.rel = 'stylesheet';
        style.appendChild(document.createTextNode(css));
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(style);
    }
})();