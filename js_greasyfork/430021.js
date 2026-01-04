// ==UserScript==
// @note 楚寒帅
// @name         小刀娱乐网网站广告xd
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  楚寒帅。
// @author       JustinQQQ
// @match        https://www.x6d.com/
// @include      *://*.x6d.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430021/%E5%B0%8F%E5%88%80%E5%A8%B1%E4%B9%90%E7%BD%91%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8Axd.user.js
// @updateURL https://update.greasyfork.org/scripts/430021/%E5%B0%8F%E5%88%80%E5%A8%B1%E4%B9%90%E7%BD%91%E7%BD%91%E7%AB%99%E5%B9%BF%E5%91%8Axd.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    //首页banner广告
    [...document.querySelectorAll('.addd')].map(x => x.hidden = "hidden");
 
 
})();
 
 