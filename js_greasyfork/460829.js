// ==UserScript==
// @name         屏蔽360doc干扰元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description 去掉360doc购买弹窗
// @author       kongfu
// @license      MIT
// @grant			none
// @match       http://www.360doc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dandelioncloud.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460829/%E5%B1%8F%E8%94%BD360doc%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/460829/%E5%B1%8F%E8%94%BD360doc%E5%B9%B2%E6%89%B0%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $('vipnewtips_v2').hide();
})();