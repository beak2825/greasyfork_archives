// ==UserScript==
// @name         分派电影不想关注
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  不想关注分派电影公众号获取验证码,直接获得云盘链接
// @author       kukushouhou
// @match        https://ifenpaidy.com/*
// @icon         https://www.google.com/s2/favicons?domain=ifenpaidy.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431749/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E4%B8%8D%E6%83%B3%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431749/%E5%88%86%E6%B4%BE%E7%94%B5%E5%BD%B1%E4%B8%8D%E6%83%B3%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".post-code-container").hide();
    $(".otherPost").show();
})();