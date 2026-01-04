// ==UserScript==
// @name         停止显示谷歌搜索下拉提示
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       www.litreily.top
// @include      https://www.google.com/*
// @include      https://www.google.com.hk/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/391123/%E5%81%9C%E6%AD%A2%E6%98%BE%E7%A4%BA%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%B8%8B%E6%8B%89%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/391123/%E5%81%9C%E6%AD%A2%E6%98%BE%E7%A4%BA%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E4%B8%8B%E6%8B%89%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // for google search
    $("div[jscontroller='tg8oTe']").remove()

    // for bing search
    // $('div#sw_as').remove()
})();