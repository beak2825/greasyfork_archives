// ==UserScript==
// @name         Wanta
// @namespace    http://tampermonkey.net/
// @version      0.6.1
// @description  移除跳转外链提示
// @author       PRO
// @match        *://www.jianshu.com/p/*
// @match        *://juejin.cn/post/*
// @match        *://gitee.com/*
// @match        *://zhuanlan.zhihu.com/*
// @match        *://*.feishu.cn/*
// @match        *://leetcode.cn/problems/*
// @match        *://weibo.com/*
// @match        *://www.mcmod.cn/*
// @match        *://play.mcmod.cn/*
// @match        *://www.mcbbs.net/*
// @match        *://www.minecraftforum.net/*
// @match        *://www.curseforge.com/minecraft/mc-mods/*
// @match        *://h5.qzone.qq.com/*
// @icon         https://greasyfork.org/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMWhLQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--2831c7f8ea43fc8b8e3eed3818b98e88bb689285/%E5%B1%8F%E5%B9%95%E6%88%AA%E5%9B%BE%202022-07-16%20105357.png?locale=zh-CN
// @grant        none
// @license      gpl-3.0
// @downloadURL https://update.greasyfork.org/scripts/447932/Wanta.user.js
// @updateURL https://update.greasyfork.org/scripts/447932/Wanta.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const error = (...args) => console.error(`[Wanta ERROR]`, ...args);
    const debug = (...args) => console.log(`[Wanta DEBUG]`, ...args);
    // domain: [link_prefix query_parameter main_article_path decode_func]
    // query_parameter = '': Get the last part of url
    function same(orig) {
        return orig;
    }
    function b64Decode(orig) {
        return decodeURIComponent(atob(orig));
    }
    function mcmod(orig) {
        let parts = orig.split("@");
        return parts.map(b64Decode).join("?");
    }

    const fuck = {
        'www.jianshu.com': ['https://links.jianshu.com/go', 'to', 'article', decodeURIComponent],
        'juejin.cn': ['https://link.juejin.cn', 'target', '#juejin > div.view-container > main > div > div.main-area.article-area > article', decodeURIComponent],
        'gitee.com': ['https://gitee.com/link', 'target', '.markdown-body', decodeURIComponent],
        'zhuanlan.zhihu.com': ['https://link.zhihu.com/', 'target', 'div.Post-RichTextContainer', decodeURIComponent],
        '.*\.feishu\.cn': ['https://security.feishu.cn/link/safety', 'target', 'div#mainBox', decodeURIComponent],
        'leetcode.cn': ['https://leetcode.cn/link/', 'target', '#__next', same],
        'weibo.com': ['https://weibo.cn/sinaurl?', 'u', '#app div[class^=Main_full]', decodeURIComponent],
        'www.mcmod.cn': ['https://link.mcmod.cn/target/', '', 'body > div.col-lg-12.common-frame > div > div.col-lg-12.center > div.col-lg-12.right', mcmod],
        'play.mcmod.cn': ['https://link.mcmod.cn/target/', '', 'body > div.col-lg-12.common-frame > div > div.col-lg-12.center', mcmod],
        'www.mcbbs.net': ['https://www.mcbbs.net/plugin.php?id=link_redirect', 'target', 'div#ct', decodeURIComponent],
        'www.minecraftforum.net': ['https://www.minecraftforum.net/linkout', 'remoteUrl', '.listing-container', decodeURIComponent],
        'www.curseforge.com': ['https://www.curseforge.com/linkout', 'remoteUrl', '.project-page', decodeURIComponent],
        'h5.qzone.qq.com': ['https://www.urlshare.cn/umirror_url_check', 'url', '#page-detail > .feed-list > .feed.dataItem', decodeURIComponent],
    };
    let domain = window.location.hostname;
    if (!(domain in fuck)) {
        for (let d in fuck) {
            if (domain.match(d)) {
                domain = d;
                break;
            }
        }
    }
    const prefix = fuck[domain][0];
    const queryName = fuck[domain][1];
    const mainPath = fuck[domain][2];
    const decodeFunc = fuck[domain][3];
    const attrFlag = "wanta-purified";
    const maxDepth = 5;
    function purify(link) {
        let new_href;
        if (queryName.length == 0) {
            let l = link.href.split('/');
            new_href = l[l.length - 1];
        } else {
            const params = new URL(link.href).searchParams;
            new_href = params.get(queryName);
        }
        try {
            new_href = decodeFunc(new_href);
        } catch (error) {
            error(`Failed to purify link "${link.href}".`)
            return false;
        }
        if (new_href) {
            debug(`${link.href} -> ${new_href}`);
            link.href = new_href;
            return true;
        } else {
            error(`Failed to purify link "${link.href}".`)
            return false;
        }
    }
    function handler(e) {
        let ele = e.target;
        for (let depth = 0; depth < maxDepth; depth++) {
            if (ele.hasAttribute(attrFlag)) {
                break;
            }
            if (ele.tagName == 'A') {
                debug(`Intercepted link: ${ele.href}`);
                if (!ele.href.startsWith(prefix) || purify(ele)) { // Note: If not starts with prefix, `purify` won't be called
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    ele.setAttribute(attrFlag, "success");
                    ele.dispatchEvent(new MouseEvent(e.type, e));
                    break;
                } else {
                    ele.setAttribute(attrFlag, "failed");
                    error(`Failed to purify link: ${ele.href}`);
                }
            }
            ele = ele.parentElement;
        }
    }
    const main_article = document.querySelector(mainPath);
    if (main_article) {
        main_article.addEventListener('mousedown', handler, true);
        main_article.addEventListener('click', handler, true);
    } else {
        error("Failed to find main article.");
    }
})();
