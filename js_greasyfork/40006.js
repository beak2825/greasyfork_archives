// ==UserScript==
// @name         隐藏v2ex用户名和头像
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       oliverhuang
// @match        https://*.v2ex.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40006/%E9%9A%90%E8%97%8Fv2ex%E7%94%A8%E6%88%B7%E5%90%8D%E5%92%8C%E5%A4%B4%E5%83%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/40006/%E9%9A%90%E8%97%8Fv2ex%E7%94%A8%E6%88%B7%E5%90%8D%E5%92%8C%E5%A4%B4%E5%83%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementById('Rightbar').getElementsByTagName('table')[0].style.display='None';
})();