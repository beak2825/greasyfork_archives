// ==UserScript==
// @name         极客分享弹窗优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去掉极客分享网站烦人的弹窗
// @author       You
// @match        *://www.geek-share.com/*
// @icon         https://www.geek-share.com/favicon.ico
// @require https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446260/%E6%9E%81%E5%AE%A2%E5%88%86%E4%BA%AB%E5%BC%B9%E7%AA%97%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/446260/%E6%9E%81%E5%AE%A2%E5%88%86%E4%BA%AB%E5%BC%B9%E7%AA%97%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
   // let box = document.querySelector("body > div.ThinkBox-wrapper.ThinkBox-default");
   // let wrapper = document.querySelector("body > div.ThinkBox-modal-blackout.ThinkBox-modal-blackout-default");
   // box.remove();
   // wrapper.remove();
    $("body > div.ThinkBox-wrapper.ThinkBox-default").remove();
    $("body > div.ThinkBox-modal-blackout.ThinkBox-modal-blackout-default").remove();
})();