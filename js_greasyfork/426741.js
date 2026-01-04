// ==UserScript==
// @name         Yahoo新聞去廣告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隱藏新聞間穿插的廣告
// @author       You
// @match        https://tw.news.yahoo.com/*
// @icon         https://www.google.com/s2/favicons?domain=yahoo.com
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/426741/Yahoo%E6%96%B0%E8%81%9E%E5%8E%BB%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/426741/Yahoo%E6%96%B0%E8%81%9E%E5%8E%BB%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.native-ad-item').parent().hide();
})();