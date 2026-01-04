// ==UserScript==
// @name         Block Sites and Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动屏蔽微博、联合早报等指定网站，跳转至百度
// @author       YourName
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license     GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/534499/Block%20Sites%20and%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/534499/Block%20Sites%20and%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 正则表达式黑名单（支持多级子域名）
    const blockedRegex = [
        /(^|\.)weibo\.com$/,          // 匹配 weibo.com 及所有子域
        /(^|\.)zaobao\.com(\.|$)/,    // 匹配 zaobao.com 及其多级子域（如zaobao.com.sg）
        /(^|\.)tophub\.today$/        // 匹配 tophub.today 及所有子域
    ];

    // 获取当前域名（转换为小写避免大小写问题）
    const currentHost = window.location.hostname.toLowerCase();

    // 执行正则匹配检测
    const shouldBlock = blockedRegex.some(regex => regex.test(currentHost));

    // 执行屏蔽逻辑
    if (shouldBlock) {
        // 跳转前验证是否已经在目标网站（防止循环跳转）
        if (!/^www\.baidu\.com$/i.test(currentHost)) {
            window.location.replace('https://www.baidu.com/');
        }
    }
})();