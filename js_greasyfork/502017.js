// ==UserScript==
// @name         白嫖搜书吧
// @namespace    com.cnm.sb
// @version      1.14515
// @description  搜书
// @author       sb
// @match        https://www.tesla.soushu2034.com/forum.php?mod=viewthread&tid=*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/502017/%E7%99%BD%E5%AB%96%E6%90%9C%E4%B9%A6%E5%90%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/502017/%E7%99%BD%E5%AB%96%E6%90%9C%E4%B9%A6%E5%90%A7.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /* globals jQuery，$,waitForKeyElements */
    var s = ["1","1","1"];
    var n= $(".buttons a").attr("href");
    var aa = n.match(/\d{3,}/g);
    s.unshift(aa[0]);
    s.push(aa[1])
    var k = s.join("|");
    var a = "?mod=attachment&aid="+window.btoa(k);
    var b = $(".buttons");
    if(b.length ==1){$(b).html('<a href='+a+' target="_self">下载</a>')}
})();