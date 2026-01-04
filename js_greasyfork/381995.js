// ==UserScript==
// @name           百度贴吧重定向2019
// @version        1.0
// @author         cooper1x
// @description    重定向贴吧域名，将样式错乱的新域名tieba.com重定向到老域名tieba.baidu.com
// @include        *//www.tieba.com/*
// @include        *//dq.tieba.com/*
// @run-at         document-start
// @namespace https://greasyfork.org/users/179487
// @downloadURL https://update.greasyfork.org/scripts/381995/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%912019.user.js
// @updateURL https://update.greasyfork.org/scripts/381995/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E9%87%8D%E5%AE%9A%E5%90%912019.meta.js
// ==/UserScript==

//目前发现以下两个域名，其他的似乎都会自动重定向到tieba,baidu,com
//http://www.tieba.com
//https://dq.tieba.com/
var host = document.location.host
document.location.host = host.replace('dq.tieba.com','tieba.baidu.com').replace('www.tieba.com','tieba.baidu.com')