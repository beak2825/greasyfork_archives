// ==UserScript==
// @name         SinaBlog Mobile to PC
// @namespace    https://muxueqz.top
// @version      1.0
// @description  新浪博客手机版自动跳转到PC版
// @author       muxueqz
// @match        http*://blog.sina.cn/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402169/SinaBlog%20Mobile%20to%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/402169/SinaBlog%20Mobile%20to%20PC.meta.js
// ==/UserScript==


(function() {
  var new_url, sina_blog_mobile_prefix;

  sina_blog_mobile_prefix = 'http://blog.sina.cn/';

  console.log(location.href.indexOf(sina_blog_mobile_prefix));

  if (location.href.indexOf(sina_blog_mobile_prefix === 0)) {
    new_url = location.href.replace(/blog.sina.cn\/dpool\/blog/g, 'blog.sina.com');
    location = new_url;
  }

}).call(this);
