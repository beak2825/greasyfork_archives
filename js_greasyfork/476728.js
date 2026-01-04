// ==UserScript==
// @name         将手机版网页转换为PC版网页 (仅京东淘宝)
// @namespace    none
// @version      1.2
// @description  将京东、淘宝、天猫手机版网页转换为PC版网页
// @author       owovo (modified by user request)
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476728/%E5%B0%86%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5%20%28%E4%BB%85%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/476728/%E5%B0%86%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5%20%28%E4%BB%85%E4%BA%AC%E4%B8%9C%E6%B7%98%E5%AE%9D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // URL转换规则配置 (仅包含京东和淘宝/天猫)
    const urlRules = [
        {
            // 京东商品详情页
            regex: /^https?:\/\/item\.m\.jd\.com\/(?:product\/(\d+)|detail\/(\d+))\.html(?:[\?#].*)?$/,
            replace: (match, p1, p2) => `https://item.jd.com/${p1 || p2}.html`,
            description: "京东商品详情页转换（product/ 或 detail/ 路径）"
        },
        {
            regex: /^https?:\/\/item\.m\.jd\.com\/ware\/view\.action\?.*wareId=(\d+).*$/,
            replace: 'https://item.jd.com/$1.html',
            description: "京东商品详情页转换（wareId 参数）"
        },
        {
            // 京东店铺首页
            regex: /^https?:\/\/shop\.m\.jd\.com\/shop\/home\/(\w+)\.html$/,
            replace: 'https://shop.jd.com/home/popup/shopHome.html?id=$1',
            description: "京东店铺首页转换"
        },
        {
            // 天猫
            regex: /^https?:\/\/detail\.m\.tmall\.com\/item\.htm\?.*id=(\d+).*$/,
            replace: (match, id) => `https://detail.tmall.com/item.htm?id=${id}`,
            description: "天猫商品详情页转换"
        },
        {
            // 淘宝
            regex: /^https?:\/\/h5\.m\.taobao\.com\/awp\/core\/detail\.htm\?.*id=(\d+).*$/,
            replace: (match, id) => `https://item.taobao.com/item.htm?id=${id}`,
            description: "淘宝商品详情页转换"
        }
    ];

    // 工具函数
    const utils = {
        isValidUrl: (url) => {
            try {
                new URL(url);
                return true;
            } catch (e) {
                return false;
            }
        },

        safeReplaceUrl: (url, regex, replace) => {
            try {
                const newUrl = typeof replace === 'function' 
                    ? url.replace(regex, replace)
                    : url.replace(regex, replace);
                return utils.isValidUrl(newUrl) ? newUrl : null;
            } catch (e) {
                return null;
            }
        }
    };

    // 主逻辑
    try {
        const currentUrl = window.location.href;

        const matchedRule = urlRules.find(rule => {
            const { regex, replace } = rule;
            const newUrl = utils.safeReplaceUrl(currentUrl, regex, replace);

            if (newUrl && newUrl !== currentUrl) {
                window.location.replace(newUrl);
                return true;
            }
            return false;
        });
    } catch (e) {
        console.error('URL conversion failed');
    }
})();