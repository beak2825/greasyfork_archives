// ==UserScript==
// @name         PT 种子详情页隐藏简介
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏PT种子页的简介和IMDB信息
// @author       cnsnet
// @license      MIT
// @include      *://*/details.php?id=*
// @include      *://*/plugin_details.php?id=*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433384/PT%20%E7%A7%8D%E5%AD%90%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9A%90%E8%97%8F%E7%AE%80%E4%BB%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/433384/PT%20%E7%A7%8D%E5%AD%90%E8%AF%A6%E6%83%85%E9%A1%B5%E9%9A%90%E8%97%8F%E7%AE%80%E4%BB%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('#kdescr').hide();
    $('#divdescr').hide();
    $('#kimdb').hide();
    $('#kanidb').hide();
    $('#divtracklist').removeAttr("style");
})();