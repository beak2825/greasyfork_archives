// ==UserScript==
// @name         通用中转链接跳转器
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  支持搜狗/CSDN/知乎等平台的中转链接跳转
// @author       achtlv
// @match        *://*.sogou.com/web/*
// @match        *://link.csdn.net/*
// @match        *://link.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533253/%E9%80%9A%E7%94%A8%E4%B8%AD%E8%BD%AC%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533253/%E9%80%9A%E7%94%A8%E4%B8%AD%E8%BD%AC%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 站点配置中心（可自由扩展）
    const SITE_CONFIG = {
        // 搜狗搜索
        'm.sogou.com': {
            param: 'url',
            decode: true,
            pattern: /url=(.+?)(&|$)/i
        },
        // CSDN链接
        'link.csdn.net': {
            param: 'target',
            decode: true,
            pattern: /target=(.+?)(&|$)/i
        },
        // 知乎外链
        'link.zhihu.com': {
            param: 'target',
            decode: true,
            pattern: /target=(.+?)(&|$)/i,
            fixEncoding: true
        }
    };

    // 获取当前网站配置
    const currentHost = location.hostname;
    const config = SITE_CONFIG[currentHost];

    if (!config) return;

    // 解析查询参数
    const queryParams = new URLSearchParams(location.search);

    if (queryParams.has(config.param)) {
        let targetUrl = queryParams.get(config.param);

        // 执行URL解码
        if (config.decode) {
            targetUrl = decodeURIComponent(targetUrl);
        }

        // 处理知乎的特殊编码（将"//"前的":"编码修正）
        if (config.fixEncoding) {
            targetUrl = targetUrl.replace(/(https?):\/\//, (m, p1) => {
                return p1 + '://';
            });
        }

        // 立即跳转（替换历史记录）
        window.location.replace(targetUrl);
    }
})();