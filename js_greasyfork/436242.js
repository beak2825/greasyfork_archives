// ==UserScript==
// @name Bilibili SEO页面 重定向
// @description Bilibili SEO页面 重定向到普通页面
// @run-at document-start
// @include https://www.bilibili.com/s/video/*
// @namespace https://greasyfork.org/users/710514
// @version 0.0.1.20211129113219
// @downloadURL https://update.greasyfork.org/scripts/436242/Bilibili%20SEO%E9%A1%B5%E9%9D%A2%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/436242/Bilibili%20SEO%E9%A1%B5%E9%9D%A2%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
(function(){
 window.location.replace(location.href.replace('/s/','/'));
 })();
