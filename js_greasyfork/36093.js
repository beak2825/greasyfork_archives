// ==UserScript==
// @name         天天美剧百度云盘提取码拼接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动拼接提取码至百度云链接后面
// @author       hunao.me
// @match        http://www.ttmeiju.vip/meiju/*
// @grant        none
// @require      https://code.jquery.com/jquery-latest.js

// @downloadURL https://update.greasyfork.org/scripts/36093/%E5%A4%A9%E5%A4%A9%E7%BE%8E%E5%89%A7%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E6%8F%90%E5%8F%96%E7%A0%81%E6%8B%BC%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/36093/%E5%A4%A9%E5%A4%A9%E7%BE%8E%E5%89%A7%E7%99%BE%E5%BA%A6%E4%BA%91%E7%9B%98%E6%8F%90%E5%8F%96%E7%A0%81%E6%8B%BC%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('td[ectype=linklist][align=left] a[title="百度云盘下载"]').each(function(){
        var tqm = $(this).parent().next().next().html();
        $(this).attr("href",$(this).attr("href")+"#"+tqm);
    });
})();