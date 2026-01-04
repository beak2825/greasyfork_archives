// ==UserScript==
// @name            B站SEO页面重定向
// @version         1.0.7.20220708
// @namespace       laster2800
// @author          Laster2800
// @description     从B站 SEO 页面重定向至常规页面
// @icon            https://www.bilibili.com/favicon.ico
// @homepageURL     https://greasyfork.org/zh-CN/scripts/430227
// @supportURL      https://greasyfork.org/zh-CN/scripts/430227/feedback
// @license         LGPL-3.0
// @noframes
// @include         *://www.bilibili.com/s/video/*
// @grant           none
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/430227/B%E7%AB%99SEO%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/430227/B%E7%AB%99SEO%E9%A1%B5%E9%9D%A2%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

location.replace(location.href.replace('/s', ''))
