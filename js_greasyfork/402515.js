// ==UserScript==
// @name         网站v2rayssr去除访问限制
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       LancCJ
// @include      *://*.v2rayssr.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402515/%E7%BD%91%E7%AB%99v2rayssr%E5%8E%BB%E9%99%A4%E8%AE%BF%E9%97%AE%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/402515/%E7%BD%91%E7%AB%99v2rayssr%E5%8E%BB%E9%99%A4%E8%AE%BF%E9%97%AE%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("去除访问限制");
    document.querySelector(".mask").style.display = "none";
})();