// ==UserScript==
// @name         将手机版网页转换为PC版网页
// @namespace    none
// @version      1.3
// @description  将京东、B站、淘宝、天猫、微博、知乎、豆瓣手机版网页转换为PC版网页
// @author       owovo
// @match        *://item.m.jd.com/*
// @match        *://shop.m.jd.com/*
// @match        *://m.bilibili.com/*
// @match        *://www.bilibili.com/mobile/video/*
// @match        *://m.tmall.com/*
// @match        *://detail.m.tmall.com/*
// @match        *://h5.m.taobao.com/*
// @match        *://m.weibo.cn/*
// @match        *://m.zhihu.com/*
// @match        *://zhuanlan.zhihu.com/*
// @match        *://m.douban.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/389749/%E5%B0%86%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/389749/%E5%B0%86%E6%89%8B%E6%9C%BA%E7%89%88%E7%BD%91%E9%A1%B5%E8%BD%AC%E6%8D%A2%E4%B8%BAPC%E7%89%88%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * @description 检测当前环境是否为移动设备。
     * @returns {boolean} 如果是移动设备，返回 true；否则返回 false。
     */
    const isMobile = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/i.test(navigator.userAgent);

    // 如果是在移动设备上，则不执行任何操作，以避免在移动端浏览器上发生意外跳转。
    if (isMobile()) {
        console.log("M2PC脚本：检测到移动设备，已跳过重定向。");
        return;
    }

    /**
     * @description URL转换规则配置数组。
     * 每个规则对象包含：
     * - {RegExp} regex: 用于匹配移动版URL的正则表达式。
     * - {string|Function} replace: 替换的目标PC版URL格式或一个处理函数。
     * - {string} description: 规则的中文描述。
     */
    const urlRules = [
        {
            // 京东商品详情页 (合并了 product, detail, wareId 等多种情况)
            regex: /^https?:\/\/item\.m\.jd\.com\/(?:product|detail|ware\/view\.action).*?(?:\/|wareId=)(\d+).*$/,
            replace: 'https://item.jd.com/$1.html',
            description: "京东商品详情页转换"
        },
        {
            // 京东店铺首页
            regex: /^https?:\/\/shop\.m\.jd\.com\/(?:shop\/home\/(\w+)|index\.action\?shopId=(\d+)).*$/,
            replace: (match, p1, p2) => `https://shop.jd.com/home/popup/shopHome.html?id=${p1 || p2}`,
            description: "京东店铺首页转换"
        },
        {
            // 哔哩哔哩 (兼容 m.bilibili.com 和 www.bilibili.com/mobile)
            regex: /^https?:\/\/(?:m|www)\.bilibili\.com\/(?:mobile\/)?video\/(av\d+|BV[a-zA-Z0-9]+).*$/,
            replace: 'https://www.bilibili.com/video/$1/',
            description: "哔哩哔哩视频页转换"
        },
        {
            // 天猫
            regex: /^https?:\/\/(?:detail|m)\.m\.tmall\.com\/item\.htm\?.*id=(\d+).*$/,
            replace: 'https://detail.tmall.com/item.htm?id=$1',
            description: "天猫商品详情页转换"
        },
        {
            // 淘宝
            regex: /^https?:\/\/h5\.m\.taobao\.com\/awp\/core\/detail\.htm\?.*id=(\d+).*$/,
            replace: 'https://item.taobao.com/item.htm?id=$1',
            description: "淘宝商品详情页转换"
        },
        {
            // 新浪微博
            regex: /^https?:\/\/m\.weibo\.cn\/(.*)$/,
            replace: 'https://weibo.com/$1',
            description: "新浪微博转换"
        },
        {
            // 知乎 (通用移动版)
            regex: /^https?:\/\/m\.zhihu\.com\/(question\/\d+(\/answer\/\d+)?|p\/\d+)/,
            replace: 'https://www.zhihu.com/$1',
            description: "知乎问题/回答/文章转换"
        },
        {
            // 知乎专栏 (zhuanlan.zhihu.com)
            regex: /^https?:\/\/zhuanlan\.zhihu\.com\/(p\/\w+)/,
            replace: 'https://zhuanlan.zhihu.com/$1',
            description: "知乎专栏文章转换"
        },
        {
            // 豆瓣
            regex: /^https?:\/\/m\.douban\.com\/(.*)$/,
            replace: 'https://www.douban.com/$1',
            description: "豆瓣转换"
        }
    ];

    // --- 主逻辑 ---
    // 脚本的核心执行部分。
    try {
        const currentUrl = window.location.href;

        // 遍历所有规则，查找与当前URL匹配的项。
        for (const rule of urlRules) {
            if (rule.regex.test(currentUrl)) {
                const newUrl = currentUrl.replace(rule.regex, rule.replace);
                
                // 确保URL有效且发生了变化，然后执行重定向。
                if (newUrl && newUrl !== currentUrl) {
                    window.location.replace(newUrl);
                    break; // 找到匹配并成功替换后，立即停止循环，避免不必要的计算。
                }
            }
        }
    } catch (e) {
        console.error('移动版到PC版URL转换脚本失败：', e);
    }
})();
