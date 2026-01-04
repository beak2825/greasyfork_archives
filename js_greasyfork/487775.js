// ==UserScript==
// @name         知乎回答图片缩小(网页版)-超轻量级
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Stop social death when biangushiing
// @author       sdujava2011
// @match        *://www.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://gist.githubusercontent.com/SDUhuaxia/c267468f211d4a2cf921548d456aa959/raw/8cb18ee9c3f7183ec21c417c72ee1ac2cf9cc9d7/waitForKeyElements.js#md5=tft8SDGCQ2aUyQo5PlkbTg==
// @downloadURL https://update.greasyfork.org/scripts/487775/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F%28%E7%BD%91%E9%A1%B5%E7%89%88%29-%E8%B6%85%E8%BD%BB%E9%87%8F%E7%BA%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/487775/%E7%9F%A5%E4%B9%8E%E5%9B%9E%E7%AD%94%E5%9B%BE%E7%89%87%E7%BC%A9%E5%B0%8F%28%E7%BD%91%E9%A1%B5%E7%89%88%29-%E8%B6%85%E8%BD%BB%E9%87%8F%E7%BA%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /* globals jQuery, $, waitForKeyElements */
    waitForKeyElements(".origin_image", function(){
        var imgs = document.querySelectorAll(".origin_image");
        var i;
        for (i = 0; i < imgs.length; i++) {
            $(imgs[i]).css({"width": "50%","max-width": "50%","height": "auto"});
        }
    });
    waitForKeyElements(".ztext-gif", function(){
        var imgs = document.querySelectorAll(".ztext-gif");
        var i;
        for (i = 0; i < imgs.length; i++) {
            $(imgs[i]).css({"width": "50%","max-width": "50%","height": "auto"});
        }
    });
})();