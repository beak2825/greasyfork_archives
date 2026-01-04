// ==UserScript==
// @name         屏蔽百度云开屏云一朵、云U盘弹窗及左侧上部几个功能
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  依然是自用型脚本
// @author       Kurisuame
// @match        *://pan.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475231/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91%E5%BC%80%E5%B1%8F%E4%BA%91%E4%B8%80%E6%9C%B5%E3%80%81%E4%BA%91U%E7%9B%98%E5%BC%B9%E7%AA%97%E5%8F%8A%E5%B7%A6%E4%BE%A7%E4%B8%8A%E9%83%A8%E5%87%A0%E4%B8%AA%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/475231/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E4%BA%91%E5%BC%80%E5%B1%8F%E4%BA%91%E4%B8%80%E6%9C%B5%E3%80%81%E4%BA%91U%E7%9B%98%E5%BC%B9%E7%AA%97%E5%8F%8A%E5%B7%A6%E4%BE%A7%E4%B8%8A%E9%83%A8%E5%87%A0%E4%B8%AA%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    //给！我！爬！
    $('.nd-chat-guide').hide();
    $('.nd-chat-guide__modal').hide();
    $('.wp-s-aside-nav__main-top').hide();
    $('.wp-s-aside-nav-bubble-close').hide();
    $('.wp-s-aside-nav-bubble-title').hide();
    $('.wp-s-aside-nav-bubble-desc').hide();
    $('.wp-s-aside-nav-bubble-use').hide();
    $('.nd-chat-ai-btn__open').hide();
    $('.nd-operate-guidance').hide();
    $('.business-ad-content').hide();
    $('.nd-chat-normal__open-img').hide();
    $('.nd-chat-normal').hide();

    //
    setTimeout(function(){
    $('.nd-chat-guide').hide();
    $('.nd-chat-guide__modal').hide();
    }, 1000);
    setTimeout(function(){
    $('.wp-s-aside-nav-bubble-close').hide();
    $('.wp-s-aside-nav-bubble-title').hide();
    $('.wp-s-aside-nav-bubble-desc').hide();
    $('.wp-s-aside-nav-bubble-use').hide();
    $('.nd-chat-ai-btn__open').hide();
    $('.nd-chat-normal__open-img').hide();
    }, 2000);
    setTimeout(function(){
    $('.wp-s-aside-nav__main-top').hide();
    $('.nd-operate-guidance').hide();
    $('.business-ad-content').hide();
    $('.nd-chat-normal').hide();
    $('.').hide();
    }, 3000);
    setTimeout(function(){
    $('.nd-operate-guidance').hide();
    $('.').hide();
    }, 8000);


})();

