// ==UserScript==
// @name         B站bilibili直播精简只留画面去弹幕
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站bilibili直精简只留画面,去弹幕
// @author       ET
// @include        /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @downloadURL https://update.greasyfork.org/scripts/420557/B%E7%AB%99bilibili%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E5%8F%AA%E7%95%99%E7%94%BB%E9%9D%A2%E5%8E%BB%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/420557/B%E7%AB%99bilibili%E7%9B%B4%E6%92%AD%E7%B2%BE%E7%AE%80%E5%8F%AA%E7%95%99%E7%94%BB%E9%9D%A2%E5%8E%BB%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==
(function() {
    'use strict';
var object1 = document.getElementsByClassName('bilibili-live-player-video-danmaku')[0];
    if (object1 != null){
        object1.parentNode.removeChild(object1);
    }
var object2 = document.getElementsByClassName('chat-history-panel')[0];
    if (object2 != null){
        object2.parentNode.removeChild(object2);
    }
var object3 = document.getElementsByClassName('z-room-background')[0];
    if (object3 != null){
        object3.parentNode.removeChild(object3);
    }

var object4 = document.getElementsByClassName('gift-control-section p-relative border-box z-gift-control-section')[0];
    if (object4 != null){
        object4.parentNode.removeChild(object4);
    }
var object5 = document.getElementsByClassName('link-footer-ctnr z-link-footer-ctnr')[0];
    if (object5 != null){
        object5.parentNode.removeChild(object5);
    }
var object6 = document.getElementsByClassName('bilibili-live-player-video-operable-container')[0];
    if (object6 != null){
        object6.parentNode.removeChild(object6);
    }
})();