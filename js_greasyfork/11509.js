// ==UserScript==
// @name         京东自营自动勾选
// @description  在京东搜索商品时自动勾选京东自营
// @version      0.10
// @author       Vanilla
// @license      MIT
// @match        http://search.jd.com/*
// @grant        none
// @run-at       document-body
// @namespace https://greasyfork.org/users/14035
// @downloadURL https://update.greasyfork.org/scripts/11509/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/11509/%E4%BA%AC%E4%B8%9C%E8%87%AA%E8%90%A5%E8%87%AA%E5%8A%A8%E5%8B%BE%E9%80%89.meta.js
// ==/UserScript==

if(!/wtype=1/.test(window.location.href)) window.location.href = window.location.href + '&wtype=1';