// ==UserScript==
// @name         搜索引擎落地页重定向
// @namespace    mscststs
// @version      0.1
// @description  bilibili 搜索引擎落地页重定向
// @author       mscststs
// @match        *://www.bilibili.com/s/video/*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433588/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%90%BD%E5%9C%B0%E9%A1%B5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/433588/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E%E8%90%BD%E5%9C%B0%E9%A1%B5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.href = window.location.href.replace("/s/video/","/video/")
})();