// ==UserScript==
// @name         学习通刷课防检测愚蠢手段
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  自动刷新网页功能
// @author       dkxpoc
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491815/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E8%AF%BE%E9%98%B2%E6%A3%80%E6%B5%8B%E6%84%9A%E8%A0%A2%E6%89%8B%E6%AE%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/491815/%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%88%B7%E8%AF%BE%E9%98%B2%E6%A3%80%E6%B5%8B%E6%84%9A%E8%A0%A2%E6%89%8B%E6%AE%B5.meta.js
// ==/UserScript==
(function() {
    'use strict';
    let timeout = 1200
    console.log('%s秒后刷新: ', timeout);
    setTimeout(() => {
      location.reload()
    }, timeout*1000);
})();
