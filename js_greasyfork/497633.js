// ==UserScript==
// @name         百度搜索结果页更干净
// @namespace    http://tampermonkey.net/
// @version      2024-06-11
// @description  隐藏百度查询结果页面的广告列表、不精准的推荐搜索关键词
// @author       suchcl
// @match        *://*.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/497633/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%9B%B4%E5%B9%B2%E5%87%80.user.js
// @updateURL https://update.greasyfork.org/scripts/497633/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E9%A1%B5%E6%9B%B4%E5%B9%B2%E5%87%80.meta.js
// ==/UserScript==
/* globals jQuery, $ */

(function() {
    'use strict';
    document.querySelector("#content_right").remove();
    $("#searchTag").remove();

})();