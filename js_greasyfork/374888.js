// ==UserScript==
// @name         csdn-reader-more
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  csdn去除阅读更多需登录步骤
// @author       You
// @match        https://*.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374888/csdn-reader-more.user.js
// @updateURL https://update.greasyfork.org/scripts/374888/csdn-reader-more.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById('article_content').style=""
    document.getElementsByClassName('hide-article-box')[0].style="display:none"
    // Your code here...
})();