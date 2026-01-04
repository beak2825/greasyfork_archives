// ==UserScript==
// @name         fuck tencent news
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除腾讯新闻右侧的视频
// @author       kassadin
// @match        https://new.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424212/fuck%20tencent%20news.user.js
// @updateURL https://update.greasyfork.org/scripts/424212/fuck%20tencent%20news.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var laji = $("#RIGHT")
    if(laji) laji.remove();
    laji = $("#GoTop > div > a:nth-child(1)")
    if(laji) laji.remove();
})();