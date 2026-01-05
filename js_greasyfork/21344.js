// ==UserScript==
// @name         NGA Auto Pager
// @version      1.02
// @description  NGA自动翻页
// @include      /^http:\/\/(bbs\.ngacn\.cc|nga\.178\.com|bbs\.nga\.cn|bbs\.bigccq\.cn)\/(read\.php|thread\.php)/
// @author       wpscott
// @namespace https://greasyfork.org/users/54591
// @downloadURL https://update.greasyfork.org/scripts/21344/NGA%20Auto%20Pager.user.js
// @updateURL https://update.greasyfork.org/scripts/21344/NGA%20Auto%20Pager.meta.js
// ==/UserScript==

var x = setInterval(function() {
    if(document.body.scrollHeight - document.body.scrollTop < 2000){
        var a = document.querySelector("a.uitxt1[title=加载下一页]");
        (a !== null) ? a.click() : clearInterval(x);
    }
}, 500);