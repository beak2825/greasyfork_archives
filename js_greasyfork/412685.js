// weibo-external-link-redirection
// ==UserScript==
// @name         微博外链重定向
// @namespace    weibo-external-link-redirection
// @version      0.0.2
// @description  此脚本用于点击新浪微博外链时自动跳转
// @include     http://t.cn/*
// @require     http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require     https://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @author      AmemiyaKokoro

// @downloadURL https://update.greasyfork.org/scripts/412685/%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412685/%E5%BE%AE%E5%8D%9A%E5%A4%96%E9%93%BE%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
(function () {
  console.log($('.text').html())
  if ($('.text').html().includes('将要访问')) {
    window.location.replace($('.desc').html())
  }
})();
