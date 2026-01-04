// ==UserScript==
// @name         【电脑打开原网页】QQ/语雀/腾讯文档/京东/淘宝/天猫/知乎.避免中间页的审核拦截风险
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  1.电脑QQ网页拦截 2.电脑语雀/腾讯文档/知乎的网页风险 3.手机京东淘宝天猫链接转为电脑网页链接。
// @author       yezi_jinn
// @match        *://c.pc.qq.com/*
// @match        *://item.m.jd.com/product/*.html*
// @match        *://item.taobao.com/item.htm*
// @match        *://detail.tmall.com/item.htm*
// @match        *://www.yuque.com/r/goto*
// @match        *://docs.qq.com/scenario/link.html*
// @match        *://link.zhihu.com/?target=*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542256/%E3%80%90%E7%94%B5%E8%84%91%E6%89%93%E5%BC%80%E5%8E%9F%E7%BD%91%E9%A1%B5%E3%80%91QQ%E8%AF%AD%E9%9B%80%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E7%9F%A5%E4%B9%8E%E9%81%BF%E5%85%8D%E4%B8%AD%E9%97%B4%E9%A1%B5%E7%9A%84%E5%AE%A1%E6%A0%B8%E6%8B%A6%E6%88%AA%E9%A3%8E%E9%99%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/542256/%E3%80%90%E7%94%B5%E8%84%91%E6%89%93%E5%BC%80%E5%8E%9F%E7%BD%91%E9%A1%B5%E3%80%91QQ%E8%AF%AD%E9%9B%80%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%E5%A4%A9%E7%8C%AB%E7%9F%A5%E4%B9%8E%E9%81%BF%E5%85%8D%E4%B8%AD%E9%97%B4%E9%A1%B5%E7%9A%84%E5%AE%A1%E6%A0%B8%E6%8B%A6%E6%88%AA%E9%A3%8E%E9%99%A9.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 通用函数：快速获取URL参数
    const getUrlParam = (name, url = location.href) => {
        const nameEq = name + '=';
        const queryStart = url.indexOf('?');
        if (queryStart === -1) return null;

        const params = url.slice(queryStart + 1).split('&');
        for (let i = 0; i < params.length; i++) {
            const pair = params[i];
            if (pair.startsWith(nameEq)) {
                return pair.slice(nameEq.length);
            }
        }
        return null;
    };

    // 主处理函数
    const processUrl = () => {
        const { hostname, pathname, search, href } = location;

        // 1. 处理QQ安全拦截页
        if (hostname === 'c.pc.qq.com') {
            const urlParamNames = ['url', 'pfurl', 'redirectUrl'];
            for (const name of urlParamNames) {
                const originalUrl = getUrlParam(name);
                if (!originalUrl) continue;

                try {
                    const decodedUrl = decodeURIComponent(originalUrl);
                    if (/^https?:\/\//i.test(decodedUrl)) {
                        window.stop();
                        location.replace(decodedUrl);
                        return;
                    }
                } catch(e) {/* 忽略解析错误 */}
            }
            return;
        }

        // 2. 处理语雀风险提示页
        if (hostname === 'www.yuque.com' && pathname.startsWith('/r/goto')) {
            const encodedUrl = getUrlParam('url');
            if (!encodedUrl) return;

            try {
                const decodedUrl = decodeURIComponent(encodedUrl);
                if (/^https?:\/\//i.test(decodedUrl)) {
                    window.stop();
                    location.replace(decodedUrl);
                }
            } catch(e) {/* 忽略解析错误 */}
            return;
        }

        // 3. 处理腾讯文档中转页
        if (hostname === 'docs.qq.com' && pathname === '/scenario/link.html') {
            const encodedUrl = getUrlParam('url');
            if (!encodedUrl) return;

            try {
                const decodedUrl = decodeURIComponent(encodedUrl);
                if (/^https?:\/\//i.test(decodedUrl)) {
                    window.stop();
                    location.replace(decodedUrl);
                }
            } catch(e) {/* 忽略解析错误 */}
            return;
        }

        // 4. 处理知乎中转页
        if (hostname === 'link.zhihu.com' && getUrlParam('target')) {
            const encodedUrl = getUrlParam('target');
            if (!encodedUrl) return;

            try {
                const decodedUrl = decodeURIComponent(encodedUrl);
                if (/^https?:\/\//i.test(decodedUrl)) {
                    window.stop();
                    location.replace(decodedUrl);
                }
            } catch(e) {/* 忽略解析错误 */}
            return;
        }

        // 5. 处理电商平台手机页面
        // 京东处理
        if (hostname === 'item.m.jd.com') {
            const idMatch = pathname.match(/\/(\d+)\.html/);
            if (idMatch && idMatch[1]) {
                window.stop();
                location.replace(`https://item.jd.com/${idMatch[1]}.html`);
            }
            return;
        }

        // 淘宝/天猫处理
        if (hostname.includes('taobao.com') || hostname.includes('tmall.com')) {
            // 检查是否已经是简洁链接
            if (search.split('&').length <= 2 && /[?&]id=\d+/.test(search)) {
                return;
            }

            const idParam = getUrlParam('id') || getUrlParam('item_id');
            if (idParam && /^\d+$/.test(idParam)) {
                window.stop();
                location.replace(hostname.includes('tmall')
                    ? `https://detail.tmall.com/item.htm?id=${idParam}`
                    : `https://item.taobao.com/item.htm?id=${idParam}`
                );
            }
        }
    };

    // 立即执行
    try {
        processUrl();
    } catch (e) {
        console.error('链接优化脚本错误:', e);
    }
})();