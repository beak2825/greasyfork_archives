// ==UserScript==
// @name           村花论坛域名重定向
// @version        1.4
// @author         火心
// @description    重定向村花其他域名到最新域名
// @compatible     chrome
 
// @include        *://*cunhua.wiki
// @include        *://huo.wtf/*
// @include        *://www.huo.wtf/*
// @exclude        *://cunhua.dog
// @exclude        *://www.cunhua.dog
 
// @run-at         document-start
 
// @namespace https://greasyfork.org/users/319402
 
// @downloadURL https://update.greasyfork.org/scripts/426689/%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426689/%E6%9D%91%E8%8A%B1%E8%AE%BA%E5%9D%9B%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.host = "cunhua.dog" //跳转到新域名