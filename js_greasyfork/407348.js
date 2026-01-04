// ==UserScript==
// @name         bilibili空间粉色透明化额外内容
// @namespace    https://github.com/wuxintlh/
// @version      0.1.0.5
// @description  将空间变得更加粉色透明
// @author       桜wuxin
// @match        https://message.bilibili.com/*
// @match        https://t.bilibili.com/*
// @match        https://manga.bilibili.com/*
// @match        https://live.bilibili.com/blackboard/*
// @match        https://www.bilibili.com/page-proxy/*
// @grant        none
// @QQgroup      793513923
// @downloadURL https://update.greasyfork.org/scripts/407348/bilibili%E7%A9%BA%E9%97%B4%E7%B2%89%E8%89%B2%E9%80%8F%E6%98%8E%E5%8C%96%E9%A2%9D%E5%A4%96%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/407348/bilibili%E7%A9%BA%E9%97%B4%E7%B2%89%E8%89%B2%E9%80%8F%E6%98%8E%E5%8C%96%E9%A2%9D%E5%A4%96%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var div = null;
    if((div = document.querySelector('.im-root')) != undefined){
        div = document.querySelector('.im-root').querySelector('.im-list-box');
        div.style.background = 'rgba(255,192,203, .8)';
    };
    if((div = document.querySelector('.out-container')) != undefined){
        div = document.querySelector('.out-container');
    div.style.backgroundColor = 'rgba(255,192,203, .8)';
    };
    if((div = document.querySelector('.app-layout'))){
       div = document.querySelector('.app-layout');
       div.style.backgroundColor = 'rgba(255,192,203, .8)';
    }
    if((div = document.querySelector('.live-box'))){
        div = document.querySelector('.live-box');
        div.style.backgroundColor = 'rgba(255,192,203, .8)';
    }
    if((div = document.querySelector('.box'))){
        div = document.querySelector('.box');
        div.style.backgroundColor = 'rgba(255,192,203, .8)';
    }
})();