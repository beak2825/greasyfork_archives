// ==UserScript==
// @name         Google链接域名替换
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  实现saraba1st到stage1st的自动跳转
// @author       Youmiya Hina(Deepseek)
// @match        *://www.google.com/search*
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/535196/Google%E9%93%BE%E6%8E%A5%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/535196/Google%E9%93%BE%E6%8E%A5%E5%9F%9F%E5%90%8D%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 增强版域名替换函数
    const replaceDomain = url => {
        try {
            const urlObj = new URL(url);
            // 处理直接链接
            let processedHost = urlObj.hostname
                .replace(/(^|\.)(www|bbs)\.(?=saraba1st\.com)/g, '$1') // 移除前缀
                .replace(/saraba1st\.com$/, 'stage1st.com');            // 替换主域名

            // 处理Google重定向链接
            const params = new URLSearchParams(urlObj.search);
            if(params.has('url')) {
                const decoded = decodeURIComponent(params.get('url'));
                const cleanUrl = decoded
                    .replace(/(https?:\/\/)(www|bbs)\.(?=saraba1st\.com)/g, '$1')
                    .replace(/saraba1st\.com/g, 'stage1st.com');
                params.set('url', encodeURIComponent(cleanUrl));
            }

            // 构建最终URL
            urlObj.hostname = processedHost;
            urlObj.search = params.toString();
            return urlObj.toString();
        } catch(e) {
            return url;
        }
    };

    // 点击拦截逻辑（保持不变）
    document.addEventListener('click', function(e) {
        let target = e.target.closest('a');
        if(target && target.href) {
            const newUrl = replaceDomain(target.href);
            if(newUrl !== target.href) {
                e.preventDefault();
                GM_openInTab(newUrl, { active: true });
            }
        }
    }, true);

    // 地址栏显示优化（增强处理）
    const modifyLinks = () => {
        document.querySelectorAll('a[href]').forEach(a => {
            const newHref = replaceDomain(a.href);
            if(newHref !== a.href) {
                a.dataset.originalHref = a.href;
                a.href = newHref;
            }
        });
    };

    // 使用MutationObserver监听动态加载
    new MutationObserver(mutations => {
        mutations.forEach(() => modifyLinks());
    }).observe(document, { childList: true, subtree: true });

    // 初始处理
    modifyLinks();
})();