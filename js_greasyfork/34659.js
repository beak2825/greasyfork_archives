// ==UserScript==
// @name         B站直播新UI临时用礼物简易屏蔽
// @version      0.3
// @namespace    http://jybdpy123.com/GMjs
// @description  就是个小工具 屏蔽礼物信息
// @author       white_thorn
// @include      *://live.bilibili.com/neptune/*
// @include      *://live.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/34659/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%96%B0UI%E4%B8%B4%E6%97%B6%E7%94%A8%E7%A4%BC%E7%89%A9%E7%AE%80%E6%98%93%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/34659/B%E7%AB%99%E7%9B%B4%E6%92%AD%E6%96%B0UI%E4%B8%B4%E6%97%B6%E7%94%A8%E7%A4%BC%E7%89%A9%E7%AE%80%E6%98%93%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
    }
    addGlobalStyle('.chat-item.gift-item { display: none ! important; }');
    addGlobalStyle('.gift-msg { display: none ! important; }');
    addGlobalStyle('.z-live-haruna { display: none ! important; }');
    addGlobalStyle('.live-haruna-ctnr { display: none ! important; }');
    addGlobalStyle('.chat-item.welcome-msg { display: none ! important; }');
})();