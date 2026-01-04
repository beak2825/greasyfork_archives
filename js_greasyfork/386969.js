// ==UserScript==
// @name         91 will switch 去广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除91will switch 页面底部左右两边广告
// @author       hans
// @match        https://www.91wii.com
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386969/91%20will%20switch%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/386969/91%20will%20switch%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
  $("aaaaaa").hide();
  $("iframe").hide();
  $(".a_cn").hide();
  $(".a_cn").next("div").hide();
})();