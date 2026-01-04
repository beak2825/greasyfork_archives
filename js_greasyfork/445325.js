// ==UserScript==
// @name         JavBus去广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  去除详情页右边的广告以及缩略图下面的广告
// @author       z
// @match        https://www.javbus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445325/JavBus%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/445325/JavBus%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var n = document.getElementsByClassName("ad-box")[0];
    n.parentNode.removeChild(n);
    n = document.getElementsByClassName("ad-box")[0];
    n.parentNode.removeChild(n);
    n = document.getElementsByClassName("col-xs-12 col-md-4 text-center ptb10")[0];
    n.parentNode.remove();
})();