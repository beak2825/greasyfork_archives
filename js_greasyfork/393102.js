// ==UserScript==
// @name         soTobaidu
// @namespace	 https://greasyfork.org/users/91873
// @version	     1.0.0.0
// @description  360搜索自动跳转到百度搜索
// @author	wujixian
// @grant	none
// @match        *://www.so.com/*
// @downloadURL https://update.greasyfork.org/scripts/393102/soTobaidu.user.js
// @updateURL https://update.greasyfork.org/scripts/393102/soTobaidu.meta.js
// ==/UserScript==
(function () {
    location.href.match(/q=([^&]+)/);
    location.href='https://www.baidu.com/s?ie=UTF-8&wd='+RegExp.$1
}) ();