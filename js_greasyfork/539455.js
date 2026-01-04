// ==UserScript==
// @name         网站黑名单自动关闭
// @namespace    https://greasyfork.org/zh-CN/users/yangxiongj
// @version      0.5
// @description  自动关闭黑名单中的网站，支持*通配符匹配
// @author       yx
// @license      GPL-3.0-only
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/539455/%E7%BD%91%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/539455/%E7%BD%91%E7%AB%99%E9%BB%91%E5%90%8D%E5%8D%95%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 网站黑名单列表（支持*通配符）
    const blacklist = [
        'internetdownloadmanager.com'
    ];

    // 将通配符模式转换为正则表达式
    function wildcardToRegExp(pattern) {
        // 转义正则表达式特殊字符，但保留*
        const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&');
        // 将*替换为正则表达式中的.*（匹配任意字符）
        const regexPattern = escaped.replace(/\*/g, '.*');
        // 创建完整的正则表达式，^和$确保匹配整个字符串
        return new RegExp(`^${regexPattern}$`);
    }

    // 检查当前网站是否在黑名单中
    function checkBlacklist() {
        const currentHost = window.location.hostname;

        for (let i = 0; i < blacklist.length; i++) {
            const pattern = blacklist[i];
            // 如果模式中包含通配符，使用正则表达式匹配
            if (pattern.includes('*')) {
                const regex = wildcardToRegExp(pattern);
                if (regex.test(currentHost)) {
                    console.log('检测到黑名单网站（通配符匹配）：' + currentHost);
                    closeCurrentPage();
                    return true;
                }
            }
            // 否则使用简单的包含检查
            else if (currentHost.includes(pattern)) {
                console.log('检测到黑名单网站（精确匹配）：' + currentHost);
                closeCurrentPage();
                return true;
            }
        }
        return false;
    }
    // 关闭当前页面的函数
    function closeCurrentPage() {
        // 尝试关闭窗口
        window.close();
        // 如果window.close()被浏览器阻止，则重定向到空白页
        if (window.location.href !== 'about:blank') {
            window.location.href = 'about:blank';
        }
    }

    // 执行黑名单检查
    if (checkBlacklist()) {
        return; // 如果是黑名单网站，终止后续执行
    }
})();