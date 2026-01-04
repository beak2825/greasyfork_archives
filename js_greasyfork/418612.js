// ==UserScript==
// @name         cnki redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  cnki.com.cn跳转到cnki.net
// @author       feifeizaici
// @match        http://www.cnki.com.cn/Article/CJFDTotal*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418612/cnki%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/418612/cnki%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var cn_url = location.href;
    var re = /CJFDTotal-(\w+).htm/i;
    var filename =  re.exec(cn_url)[1];
    var net_url = "https://kns.cnki.net/KCMS/detail/detail.aspx?dbcode=CJFD&filename=" + filename;
    location.href = net_url
})();