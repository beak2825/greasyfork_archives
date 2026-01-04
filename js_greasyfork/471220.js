// ==UserScript==
// @name         删除bing公益页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  删除bing搜索无结果时的公益页面
// @author       Aaron
// @match        https://cn.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471220/%E5%88%A0%E9%99%A4bing%E5%85%AC%E7%9B%8A%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/471220/%E5%88%A0%E9%99%A4bing%E5%85%AC%E7%9B%8A%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

$('.mchild_content').remove();