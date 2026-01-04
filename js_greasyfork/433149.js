// ==UserScript==
// @name         Hupub Crawler
// @namespace    http://whis.wang/
// @version      0.0.1
// @description  Hupub 爬虫
// @author       wqcsimple
// @match        https://whis.wang
// @icon         https://www.google.com/s2/favicons?domain=aliyun.com
// @grant        none
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/433149/Hupub%20Crawler.user.js
// @updateURL https://update.greasyfork.org/scripts/433149/Hupub%20Crawler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('hello world')

    $('body').prepend("<button id='fuck-me'>按我</button>")

    $("#fuck-me").click(function() {
        alert("丢雷老母")
    })
})();