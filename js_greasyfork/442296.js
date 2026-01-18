// ==UserScript==
// @name         btsow磁力链接辅助
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  磁力链接辅助下载
// @author       You
// @match        https://btsow.*/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442296/btsow%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/442296/btsow%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var getclass = jQuery('div.row a');
    getclass.each(function() {
        var urlstr = this.href;
        var str = urlstr.match(/[0-9a-zA-Z]{40}/);
        if (str) {
            this.innerHTML += ' <a href="magnet:?xt=urn:btih:' + str[0] + '">下载</a>';
        }
    });
})();
