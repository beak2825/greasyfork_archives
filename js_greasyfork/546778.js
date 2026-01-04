// ==UserScript==
// @name         屏蔽91md.me的MfXKwV广告函数
// @namespace    https://greasyfork.org/users/your-profile
// @version      1.0
// @description  在91md.me网站中屏蔽MfXKwV()函数调用
// @author       YourName
// @match        *://*.91md.me/*
// @match        *://91md.me/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546778/%E5%B1%8F%E8%94%BD91mdme%E7%9A%84MfXKwV%E5%B9%BF%E5%91%8A%E5%87%BD%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/546778/%E5%B1%8F%E8%94%BD91mdme%E7%9A%84MfXKwV%E5%B9%BF%E5%91%8A%E5%87%BD%E6%95%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 双重域名匹配确保覆盖所有子域名
    if (!/91md\.me/.test(window.location.hostname)) return;
    
    // 使用严格模式覆盖函数
    window.MfXKwV = function() {
        console.warn('[脚本拦截] MfXKwV函数已被屏蔽');
        return null;
    };
    
    // 防止函数被重新定义
    Object.defineProperty(window, 'MfXKwV', {
        configurable: false,
        writable: false
    });
})();