// ==UserScript==
// @name         阅读更多 csdn,soho
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// match        *://blog.csdn.net/*
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://bbs.csdn.net/topics/*
// @match        *://www.sohu.com/a/*
// @grant        none

// @run-at       document-idle
// require      https://code.jquery.com/jquery-latest.js
// require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/377900/%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%20csdn%2Csoho.user.js
// @updateURL https://update.greasyfork.org/scripts/377900/%E9%98%85%E8%AF%BB%E6%9B%B4%E5%A4%9A%20csdn%2Csoho.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('CSDN read more!');
    // Your code here...
    var currentURL = window.location.href;

    if(/bbs.csdn.net/.test(currentURL)){
        $("label:contains('查看全部')").click();
    }
    else if(/blog.csdn.net/.test(currentURL)){
        if($(".btn:contains('阅读全文')").length>0){
            $(".btn:contains('阅读全文')").click();
            console.log('阅读全文!');
        }
        else if($(".btn:contains('阅读更多')").length>0){
            $(".btn:contains('阅读更多')").click();
            console.log('阅读更多!');
        }
        else if($(".btn-readmore").length > 0) {
            $(".btn-readmore").click();
        }
    }
    else if(/www.sohu.com/.test(currentURL)){
        if($("section.lookall>a").length>0){
            $("section.lookall>a").click();
            console.log('展开全文!');
        }
    }
})();