// ==UserScript==
// @name         optokingdom.com显示产品页隐藏信息
// @version      1.0.0
// @namespace    https://www.optokingdom.com/
// @description  Specification、Video、 Review等信息
// @author       shinsbo
// @match        *://*.optokingdom.com/*
// @icon         https://www.optokingdom.com/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510391/optokingdomcom%E6%98%BE%E7%A4%BA%E4%BA%A7%E5%93%81%E9%A1%B5%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/510391/optokingdomcom%E6%98%BE%E7%A4%BA%E4%BA%A7%E5%93%81%E9%A1%B5%E9%9A%90%E8%97%8F%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('showtwo').style.display = 'block';
    document.getElementById('showthree').style.display = 'block';
    document.getElementById('goods_reviews').style.display = 'block';
})();