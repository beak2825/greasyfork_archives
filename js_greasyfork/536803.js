// ==UserScript==
// @name         极速跳转助手 - 绕过网站拦截
// @namespace    https://github.com/pingran
// @version      1.0.0
// @description  自动绕过各大网站的跳转拦截，直接访问目标链接
// @author       Xchen
// @license      MIT
// @match        https://link.juejin.cn/?target=*
// @match        https://c.pc.qq.com/*
// @match        http://link.zhihu.com/?target=*
// @match        https://link.zhihu.com/?target=*
// @match        https://link.csdn.net/?target=*
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi*
// @match        https://www.douban.com/link2/?url=*
// @match        https://jump.bdimg.com/safecheck*
// @grant        none
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?domain=github.com
// @downloadURL https://update.greasyfork.org/scripts/536803/%E6%9E%81%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B%20-%20%E7%BB%95%E8%BF%87%E7%BD%91%E7%AB%99%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/536803/%E6%9E%81%E9%80%9F%E8%B7%B3%E8%BD%AC%E5%8A%A9%E6%89%8B%20-%20%E7%BB%95%E8%BF%87%E7%BD%91%E7%AB%99%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项 - 可以根据需要添加更多网站
    const RULES = {
        // 通用规则
        'target': {
            pattern: /[?&](?:target|url)=([^&]+)/i,
            decode: true
        },
        
        // 网站特定规则
        'c.pc.qq.com': {
            patterns: [
                { match: /pfurl=([^&]+)/i, decode: true },
                { match: /&url=([^&]+)/i, decode: true }
            ]
        },
        'weixin110.qq.com': {
            selector: '.ui-ellipsis-content p',
            isText: true
        },
        'jump.bdimg.com': {
            pattern: /url=([^&]+)/i,
            decode: true
        },
        'www.douban.com': {
            pattern: /url=([^&]+)/i,
            decode: true
        }
    };

    // 主跳转函数
    function processRedirect() {
        const currentHost = window.location.hostname;
        let targetUrl = null;

        // 1. 首先检查通用规则
        if (RULES.target) {
            const match = window.location.href.match(RULES.target.pattern);
            if (match && match[1]) {
                targetUrl = RULES.target.decode ? decodeURIComponent(match[1]) : match[1];
            }
        }

        // 2. 检查特定网站规则
        if (!targetUrl && RULES[currentHost]) {
            const rule = RULES[currentHost];
            
            if (rule.patterns) {
                // 多个模式匹配
                for (const pattern of rule.patterns) {
                    const match = window.location.href.match(pattern.match);
                    if (match && match[1]) {
                        targetUrl = pattern.decode ? decodeURIComponent(match[1]) : match[1];
                        break;
                    }
                }
            } else if (rule.pattern) {
                // 单个模式匹配
                const match = window.location.href.match(rule.pattern);
                if (match && match[1]) {
                    targetUrl = rule.decode ? decodeURIComponent(match[1]) : match[1];
                }
            } else if (rule.selector) {
                // DOM元素选择器
                const element = document.querySelector(rule.selector);
                if (element) {
                    targetUrl = rule.isText ? element.textContent.trim() : element.href;
                }
            }
        }

        // 执行跳转
        if (targetUrl) {
            // 确保URL有协议前缀
            if (!/^https?:\/\//i.test(targetUrl)) {
                targetUrl = 'http://' + targetUrl;
            }
            
            // 替换当前历史记录而不是添加新记录
            window.location.replace(targetUrl);
        } else {
            console.log('[极速跳转助手] 无法解析目标URL');
        }
    }

    // 立即执行并监听DOM变化（对于需要等待元素加载的情况）
    processRedirect();
    if (document.readyState !== 'complete') {
        document.addEventListener('DOMContentLoaded', processRedirect);
    }
})();