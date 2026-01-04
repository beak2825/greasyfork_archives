// ==UserScript==
// @name         CSDN无敌暴龙版免登录复制
// @version      2.0
// @description  CSDN无敌暴龙版免登录
// @author       ziting
// @match        https://blog.csdn.net/*
// @match        https://www.csdn.net/*
// @icon         https://img0.baidu.com/it/u=1281271954,3771372570&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500
// @grant        none
// @license      MPL
// @namespace    http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/480793/CSDN%E6%97%A0%E6%95%8C%E6%9A%B4%E9%BE%99%E7%89%88%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/480793/CSDN%E6%97%A0%E6%95%8C%E6%9A%B4%E9%BE%99%E7%89%88%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let codes = document.querySelectorALL("code");
    codes.forEach(c => {
        c.contentEditable = "true";
    })
})();