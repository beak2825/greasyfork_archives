// ==UserScript==
// @name         斗鱼精简只留画面最高画质
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match           *://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/topic/*
// @match        *://msg.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420541/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80%E5%8F%AA%E7%95%99%E7%94%BB%E9%9D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420541/%E6%96%97%E9%B1%BC%E7%B2%BE%E7%AE%80%E5%8F%AA%E7%95%99%E7%94%BB%E9%9D%A2%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';
let intID1 = setInterval(() => {
    if (document.getElementsByClassName("tip-e3420a").length > 0) {
        clearInterval(intID1);
        document.querySelectorAll('.panelFill-8b4614')[0].click();
        document.querySelectorAll(".tip-e3420a > ul > li")[0].click();
    }}, 1000);
var object1 = document.getElementById('js-player-toolbar');
    if (object1 != null){
        object1.parentNode.removeChild(object1);
    }
var object3 = document.getElementsByClassName('layout-Player-videoProxy')[0];
    if (object3 != null){
        object3.parentNode.removeChild(object3);
    }

var object4 = document.getElementsByClassName('layout-Player-videoAbove')[0];
    if (object4 != null){
        object4.parentNode.removeChild(object4);
    }
var object5 = document.getElementsByClassName('layout-Bottom')[0];
    if (object5 != null){
        object5.parentNode.removeChild(object5);
    }
var object6 = document.getElementById('js-player-title');
    if (object6 != null){
        object6.parentNode.removeChild(object6);
    }
var object7 = document.getElementsByClassName('layout-Player-aside')[0];
    if (object7 != null){
        object7.parentNode.removeChild(object7);
    }

})();