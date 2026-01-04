// ==UserScript==
// @name        微博大字体
// @description 以更大的字体浏览微博
// @namespace   https://greasyfork.org/zh-CN/users/695817-kk-yuan
// @version     1.0.0
// @author      KK Yuan
// @include     *://weibo.com/*
// @include     *://www.weibo.com/*
// @license     GPL License
// @downloadURL https://update.greasyfork.org/scripts/413602/%E5%BE%AE%E5%8D%9A%E5%A4%A7%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/413602/%E5%BE%AE%E5%8D%9A%E5%A4%A7%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function () {
  'use strict';

    var style=document.createElement("style")

    style.innerText=".WB_feed_v3 .WB_text, .detail_words_np3w6{font-size:25px;font-weight:100;text-align:justify;line-height:2em;}.WB_feed_v3 .WB_expand .WB_text{line-height:2em;} .WB_feed_v3 .WB_feed_detail {padding: 20px 40px 4px 20px;} .WB_feed_v3 .WB_expand {padding: 4px 40px 1px 80px;} .WB_feed_repeat .WB_face.W_fl img{opacity:0}"
  
    document.body.appendChild(style)

}());