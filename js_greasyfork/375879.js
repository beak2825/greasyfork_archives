// ==UserScript==
// @name         JavBus去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除网页上下的广告
// @author       DobySAMA
// @match        https://www.javbus.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375879/JavBus%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/375879/JavBus%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
var n = document.getElementsByClassName("ad-list")[0];
n.parentNode.removeChild(n);
var ad = document.getElementsByClassName('ad-list');
var ad_parent = ad[0].parentNode;
ad_parent.removeChild(ad[0]);
    // Your code here...
})();