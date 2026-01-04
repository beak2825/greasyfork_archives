// ==UserScript==
// @name        CSDN免关注阅读全文
// @namespace   http://tampermonkey.net/
// @version        0.1
// @description   CSDN自动展开阅读全文，不用关注博主
// @author          CoderBen
// @match          https://blog.csdn.net/*
// @grant           none
// @icon            https://g.csdnimg.cn/static/logo/favicon32.ico
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/449561/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/449561/CSDN%E5%85%8D%E5%85%B3%E6%B3%A8%E9%98%85%E8%AF%BB%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    document.querySelector('#article_content').style.height = 'auto'
    document.querySelector('.hide-article-box').style.display = 'none'
})()