// ==UserScript==
// @name         移动版网站自动跳转到电脑版
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动将移动版网站重定向到对应的电脑版
// @author       XX NB
// @match        *://m.thepaper.cn/*
// @match        *://m.huaban.com/*
// @match        *://m.manhuagui.com/*
// @match        *://m.duitang.com/*
// @match        *://m-2.duitang.com/*
// @match        *://m.douban.com/*
// @match        *://m.zhipin.com/*
// @match        *://m.jiemian.com/*
// @match        *://m.weibo.cn/*
// @match        *://m.cnbeta.com.tw/*
// @match        *://m.ac.qq.com/*
// @match        *://m.hupu.com/*
// @match        *://m.ximalaya.com/*
// @match        *://m.sohu.com/*
// @match        *://*.m.wikipedia.org/*
// @match        *://m.tianyancha.com/*
// @match        *://m.liepin.com/*
// @match        *://m.bookschina.com/*
// @match        *://m.dongman.la/*
// @match        *://m.92mh.com/*
// @match        *://m.dm5.com/*
// @match        *://m.twitch.tv/*
// @match        *://m.fx361.com/*
// @match        *://m.dongqiudi.com/*
// @match        *://translate.ltaaa.cn/mobile/*
// @match        *://m.ltaaa.cn/*
// @match        *://m-apps.qoo-app.com/*
// @match        *://waptieba.baidu.com/*
// @match        *://wapforum.baidu.com/*
// @include      /^https?:\/\/m\.(?:[a-z0-9-]+\.)?bendibao\.com\/.*/
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532548/%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/532548/%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E5%88%B0%E7%94%B5%E8%84%91%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentURL = window.location.href;
    let desktopURL = '';

    const simpleDomains = [
        'dongqiudi.com', 'huaban.com', 'manhuagui.com', 'douban.com', 'zhipin.com',
        'jiemian.com', 'ximalaya.com', 'sohu.com', 'tianyancha.com', 'liepin.com',
        'bookschina.com', 'dongman.la', '92mh.com', 'dm5.com', 'twitch.tv', 'fx361.com'
    ];

    // Bendibao 处理逻辑（匹配 m.bendibao.com 和 m.*.bendibao.com）
    if (/^https?:\/\/m\.(?:[a-z0-9-]+\.)?bendibao\.com\//i.test(currentURL)) {
        document.addEventListener('DOMContentLoaded', function() {
            const canonicalLink = document.querySelector('link[rel="canonical"]');
            if (canonicalLink && canonicalLink.href) {
                location.replace(canonicalLink.href);
            }
        });
        return; // 防止后续规则执行
    }

    for (const domain of simpleDomains) {
        if (currentURL.includes(`m.${domain}`)) {
            desktopURL = currentURL.replace(`m.${domain}`, domain);
            break;
        }
    }

    if (currentURL.includes('m.duitang.com')) {
        desktopURL = currentURL.replace('m.duitang.com', 'duitang.com');
    } else if (currentURL.includes('m-2.duitang.com')) {
        desktopURL = currentURL.replace('m-2.duitang.com', 'duitang.com');
    } else if (currentURL.match(/m\.thepaper\.cn\/kuaibao_detail\.jsp\?contid=(\d+)/)) {
        const contid = currentURL.match(/contid=(\d+)/)[1];
        desktopURL = `https://www.thepaper.cn/newsDetail_forward_${contid}`;
    } else if (currentURL.match(/([a-z]+)\.m\.wikipedia\.org/)) {
        const lang = currentURL.match(/([a-z]+)\.m\.wikipedia\.org/)[1];
        desktopURL = currentURL.replace(`${lang}.m.wikipedia.org`, `${lang}.wikipedia.org`);
    } else if (currentURL.includes('translate.ltaaa.cn/mobile/article/')) {
        desktopURL = currentURL.replace('/mobile/article/', '/article/');
    } else if (currentURL.match(/m\.ltaaa\.cn\/article\/(\d+)/)) {
        const id = currentURL.match(/m\.ltaaa\.cn\/article\/(\d+)/)[1];
        desktopURL = `https://translate.ltaaa.cn/article/${id}`;
    } else if (currentURL.match(/m-apps\.qoo-app\.com\/([\w_]+)\/app\/(\d+)/)) {
        const matches = currentURL.match(/m-apps\.qoo-app\.com\/([\w_]+)\/app\/(\d+)/);
        const id = matches[2];
        desktopURL = `https://apps.qoo-app.com/app/${id}`;
    } else if (/m\.weibo\.cn\/status\//.test(currentURL)) {

    // 等 MWeibo 把 $render_data 注入
    const tryWeiboJump = () => {
        try {
            if (typeof $render_data !== 'undefined' &&
                $render_data.status &&
                $render_data.status.user &&
                $render_data.status.bid
            ) {
                const uid = $render_data.status.user.id;
                const bid = $render_data.status.bid;

                if (uid && bid) {
                    const pcURL = `https://weibo.com/${uid}/${bid}`;
                    window.location.replace(pcURL);
                    return true;
                }
            }
        } catch (e) {}
        return false;
    };

    // 立即尝试一次
    if (!tryWeiboJump()) {
        // `m.weibo.cn/status/xxx` 多数数据在 Vue 渲染后才出现，需要轮询等待
        const timer = setInterval(() => {
            if (tryWeiboJump()) {
                clearInterval(timer);
            }
        }, 300);

        // 最多等待 5 秒
        setTimeout(() => clearInterval(timer), 5000);
    }

    return;
} else if (currentURL.match(/m\.cnbeta\.com\.tw\/view\/(\d+)\.htm/)) {
        const id = currentURL.match(/m\.cnbeta\.com\.tw\/view\/(\d+)\.htm/)[1];
        desktopURL = `https://www.cnbeta.com.tw/articles/tech/${id}.htm`;
    } else if (currentURL.match(/m\.ac\.qq\.com\/chapter\/index\/id\/(\d+)\/cid\/(\d+)/)) {
        const matches = currentURL.match(/m\.ac\.qq\.com\/chapter\/index\/id\/(\d+)\/cid\/(\d+)/);
        const id = matches[1];
        const cid = matches[2];
        desktopURL = `https://ac.qq.com/ComicView/index/id/${id}/cid/${cid}`;
    } else if (currentURL.match(/m\.ac\.qq\.com\/comic\/index\/id\/(\d+)/)) {
        const id = currentURL.match(/m\.ac\.qq\.com\/comic\/index\/id\/(\d+)/)[1];
        desktopURL = `https://ac.qq.com/Comic/comicInfo/id/${id}`;
    } else if (currentURL.match(/m\.hupu\.com\/bbs\/(\d+)/)) {
        const id = currentURL.match(/m\.hupu\.com\/bbs\/(\d+)/)[1];
        desktopURL = `https://bbs.hupu.com/${id}.html`;
    } else if (currentURL.includes('waptieba.baidu.com') || currentURL.includes('wapforum.baidu.com')) {
        desktopURL = currentURL.replace(/wap(?:tieba|forum)\.baidu\.com/, 'tieba.baidu.com');
    }

    if (desktopURL) {
        window.location.replace(desktopURL);
    }
})();
