// ==UserScript==
// @name         xvbt辅助工具
// @namespace    https://greasyfork.org/zh-CN/scripts/442236
// @version      0.1
// @author       You
// @description  磁力链接辅助
// @match        http*://aijkao5.me/*
// @match        http*://xvbt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442236/xvbt%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/442236/xvbt%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    var res = [];
    var i;
    var urls = document.querySelectorAll('.item-title h3 a');
    var s_urls = [];

    for (i = 0; i < urls.length; i++) {
        console.log(i);
        var url = urls[i].href;
       	 res = url.match(/\/hash\/(.*?)\.html/i);
	 console.log('magnet:?xt=urn:btih:'+res[1]);
	 document.querySelectorAll('.item-title h3 a')[i].href='magnet:?xt=urn:btih:'+res[1];
    }
})();