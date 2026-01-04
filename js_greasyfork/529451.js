// ==UserScript==
// @name         Nexus Link Replacer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将网页中的链接替换为Nexus代理地址
// @author       mumumi
// @match        https://mvnrepository.com/artifact/*
// @match        https://dlcdn.apache.org/*
// @match        https://*.apache.org/download/
// @match        https://download.postgresql.org/*
// @run-at       document-start
// @grant        none
// @icon         https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&url=https://repo.sonatype.com/
// @downloadURL https://update.greasyfork.org/scripts/529451/Nexus%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/529451/Nexus%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const replacementRules = {
        'https://repo1.maven.org/maven2/':
            'https://mirror.cityfun.com.cn/repository/maven-group/',
        'https://dlcdn.apache.org/':
            'https://mirror.cityfun.com.cn/repository/apache-proxy/',
        'https://www.apache.org/dyn/closer.lua/':
            'https://mirror.cityfun.com.cn/repository/apache-proxy/',
        'https://apache.org/dist/':
            'https://mirror.cityfun.com.cn/repository/apache-proxy/',
        'https://download.postgresql.org/':
            'https://mirror.cityfun.com.cn/repository/postgresql-proxy/',
        // 添加更多规则...
    };
    // const exts = '.jar|.pom|.tar|.gz|.bz2|.asc|.sha512|.txt|.md|.rpm|.deb|.buildinfo'.split('|');
    // const ltrim = (str, char=' ') => str.replace(new RegExp(`^${char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}+`), '');
    // const selector = exts.map(e => `a[href$=".${ltrim(e, '.')}"]`).join(', ');
    // const selector = exts.map(e => `a[href$="${e}"]`).join(', ');
    const selector = 'a:not([href$="/"])';
    function replaceLinks() {
        const links = document.querySelectorAll(selector);
        links.forEach(link => {
            let originalUrl = resolveAbsoluteUrl(link.href);
            for (const [src, dest] of Object.entries(replacementRules)) {
                if (originalUrl.includes(src)) {
                    link.href = originalUrl.replace(src, dest);
                    // 可选：高亮修改后的链接
                    link.style.border = '1px solid #ff0000';
                    link.title = `已替换为Nexus代理地址: ${dest}`;
                }
            }
        });
    }
    function resolveAbsoluteUrl(url) {
        if (url.startsWith('http://') || url.startsWith('https://')) return url;
        try {
            return new URL(url, window.location.href).href;
        } catch (e) {
            console.warn('无法解析URL:', url, '基于:', window.location.href);
            return null;
        }
    }
    function startObserving() {
        const targetNode = document.body;
        if (!targetNode) {
            //console.warn('document.body not found, retrying...');
            setTimeout(startObserving, 500);
            return;
        }
        const observer = new MutationObserver((mutations) => {
            replaceLinks();
        });
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
        replaceLinks();
    }
    startObserving();
})();