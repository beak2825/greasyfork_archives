// ==UserScript==
// @name         微博移动版网页自动跳转PC版网页
// @namespace    http://tampermonkey.net/
// @version      A1.2
// @description  微博手机版(支持国际版)分享网页自动跳转PC版! 新增用户主页、profile页面和根域名跳转支持
// @author       coco AKiSA07 DeepSeek
// @match        https://share.api.weibo.cn/*
// @match        https://weibo.com/ajax/side/cards/sideUser?*
// @match        https://m.weibo.cn/*
// @match        https://weibo.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/533028/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/533028/%E5%BE%AE%E5%8D%9A%E7%A7%BB%E5%8A%A8%E7%89%88%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%ACPC%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var WeiboUtil = {
        // 62进制字典
        str62keys: [
            "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
            "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z",
            "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
        ],
    };

    // ... (保留原有的 WeiboUtil 方法，与之前相同) ...

    function replaceShareUrl2CardUrl() {
        let ret = window.location.href.match(/weibo_id=(\d+)/);
        let weiboMobileId = ret[1];
        let ajaxUrl = `https://weibo.com/ajax/side/cards/sideUser?id=${weiboMobileId}&idType=mid`;
        window.location.replace(ajaxUrl);
    }

    function replaceCardUrl2PcUrl() {
        const hrefRet = window.location.href.match(/sideUser\?id=(\d+)&/);
        const weiboMobileId = hrefRet[1];
        const docHtml = document.documentElement.innerHTML;
        const htmlRet = docHtml.match(/{"user":{"id":(\d+),/);
        const weiboUid = htmlRet[1];
        const weiboPcId = WeiboUtil.mid2url(weiboMobileId);
        const pcUrl = `https://weibo.com/${weiboUid}/${weiboPcId}`;
        window.location.replace(pcUrl);
    }

    function replaceNormalMobile2PcUrl() {
        const currentUrl = window.location.href;

        // 处理 m.weibo.cn 根域名跳转
        if (currentUrl === 'https://m.weibo.cn/' || currentUrl === 'https://m.weibo.cn') {
            window.location.replace('https://weibo.com');
            return;
        }

        // 处理 profile 页面跳转
        if (currentUrl.match(/^https?:\/\/m\.weibo\.cn\/profile\/(\d+)/)) {
            const uid = RegExp.$1;
            window.location.replace(`https://weibo.com/profile/${uid}`);
            return;
        }

        // 处理用户主页URL
        if (currentUrl.match(/^https?:\/\/m\.weibo\.cn\/u\/(\d+)/)) {
            const uid = RegExp.$1;
            window.location.replace(`https://weibo.com/u/${uid}`);
            return;
        }

        // 原有处理微博内容的逻辑
        try {
            const html = document.documentElement.innerHTML;
            const mid = html.match(/"mid":\s"(.*?)"/)[1];
            const uid = html.match(/https:\/\/m\.weibo\.cn\/u\/(.*?)\?/)[1];
            var id = "";
            if (document.location.href.match(/^.*m\.weibo\.cn\/(status|detail)\/(\w+)\??.*$/i) && !/^\d+$/.test(RegExp.$2)) {
                id = RegExp.$2;
            } else {
                id = WeiboUtil.mid2url(mid);
            }
            const href = `https://weibo.com/${uid}/${id}`;
            window.location.replace(href);
        } catch (e) {
            // 如果其他匹配都失败，尝试直接替换域名
            window.location.replace(currentUrl.replace('m.weibo.cn', 'weibo.com'));
        }
    }

    try {
        if (window.location.href.match(/share.api.weibo.cn/)) {
            replaceShareUrl2CardUrl();
        }
        else if (window.location.href.match(/weibo.com\/ajax\/side\/cards/)) {
            replaceCardUrl2PcUrl();
        }
        else {
            replaceNormalMobile2PcUrl();
        }
    } catch (e) {
        console.log('[WeiboPcGo] 解析失败', e);
        // 最后尝试直接替换域名
        window.location.replace(window.location.href.replace('m.weibo.cn', 'weibo.com'));
    }
})();