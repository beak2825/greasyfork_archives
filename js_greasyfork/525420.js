// ==UserScript==
// @name         123云盘新域名重定向至123pan.com
// @version      20250226
// @author       狐狸小宮
// @description  自动将新域名跳转至123pan.com
// @include      *.123684.com/*
// @include      *.123865.com/*
// @include      *.123912.com/*

// @grant        none
// @inject-into  auto
// @run-at       document-start
// @namespace https://greasyfork.org/users/1235823
// @downloadURL https://update.greasyfork.org/scripts/525420/123%E4%BA%91%E7%9B%98%E6%96%B0%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3123pancom.user.js
// @updateURL https://update.greasyfork.org/scripts/525420/123%E4%BA%91%E7%9B%98%E6%96%B0%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3123pancom.meta.js
// ==/UserScript==
"use strict";
window.location.replace(location.href.replace(location.hostname, "www.123pan.com"));