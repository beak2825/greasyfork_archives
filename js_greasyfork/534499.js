// ==UserScript==
// @name         Block Sites and Redirect
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动屏蔽某博、某乎、某早报等指定网站，跳转百度
// @author       YourName
// @match        *://*.weibo.com/*
// @match        *://*.zhihu.com/*
// @match        *://*.tophub.today/*
// @match        *://*.zaobao.com.sg/*
// @match        *://*.zaobao.com/*
// @run-at       document-start
// @grant        none
// @license      GPL version 3
// @downloadURL https://update.greasyfork.org/scripts/534499/Block%20Sites%20and%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/534499/Block%20Sites%20and%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化的匹配列表（直接检查域名关键词更高效）
    const blockedHosts = [
        'weibo.com',
        'zaobao.com',
        'zaobao.com.sg',
        'tophub.today',
        'zhihu.com'
    ];

    const currentHost = window.location.hostname.toLowerCase();

    // 检查当前域名是否包含在黑名单中
    const shouldBlock = blockedHosts.some(domain =>
        currentHost === domain || currentHost.endsWith('.' + domain)
    );

    if (shouldBlock) {
        // 防止在百度搜素时无限循环（虽然百度不在名单里，但这是个好习惯）
        if (currentHost !== 'www.baidu.com') {
            window.location.replace('https://www.baidu.com/');
        }
    }
})();