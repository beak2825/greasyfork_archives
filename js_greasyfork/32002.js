// ==UserScript==
// @name         阳光宽频网显示评论
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  阳光宽频网显示评论,作者关注,支持点赞
// @author       http://hunao.me
// @match        *.365yg.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/32002/%E9%98%B3%E5%85%89%E5%AE%BD%E9%A2%91%E7%BD%91%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/32002/%E9%98%B3%E5%85%89%E5%AE%BD%E9%A2%91%E7%BD%91%E6%98%BE%E7%A4%BA%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var temp_href = window.location.href;
   window.location.href=temp_href.replace("365yg","ixigua");
})();