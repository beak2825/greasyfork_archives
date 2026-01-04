// ==UserScript==
// @name         BaiduHideHotSearch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hide the baidu's HotSearch view.
// @author       You
// @match        https://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baidu.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455573/BaiduHideHotSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/455573/BaiduHideHotSearch.meta.js
// ==/UserScript==

(function() {
    'use strict';
                $("#content_right").hide();
                $("#s_lm_wrap").hide();
})();