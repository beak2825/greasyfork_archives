// ==UserScript==
// @name         btsow磁力链接辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
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

    var i,urlstr,str,addstr;
    var getclass=jQuery('div.row a');
    for(i=0;i<getclass.length;i++)
    {
        console.log(i);
        urlstr=getclass[i].href;
        console.log(urlstr);
        str = urlstr.match('[0-9a-zA-Z]{40}');
        console.log(str);
        getclass[i].innerHTML= getclass[i].innerHTML+' <a href="magnet:?xt=urn:btih:'+str+'">下载</a>';

    }
})();