// ==UserScript==
// @name         AcFun Live Like
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  AcFun直播点赞
// @author       热心群众
// @match        *://live.acfun.cn/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411218/AcFun%20Live%20Like.user.js
// @updateURL https://update.greasyfork.org/scripts/411218/AcFun%20Live%20Like.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var like = function() {
        document.getElementsByClassName('like-btn')[0].click();
    };
    window.setInterval(like, 1000 * 2);
    like();
})();