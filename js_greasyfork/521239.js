// ==UserScript==
// @name         自动跳转所有url链接-外链
// @name:zh-CN   🦈 鲨鱼 - Url外链自动跳转
// @namespace    http://problem.pengyuyan.plus/
// @version      5.2.0
// @description  自动跳转url外链链接(包括Base64编码加密的url链接,支持几乎所有需要跳转的网站)，支持通过脚本参数配置设置跳转方式（新标签页打开、直接打开、询问用户确认）
// @author       Breathe.
// @run-at       document-end
// @include      *://*.*.*/*url*
// @include      *://*.*.*/*target*
// @include      *://link.*.*
// @exclude      *://accounts.google.com/*
// @grant        none
// @note         2024/12/20 优化脚本，支持通过脚本参数配置跳转方式
// @downloadURL https://update.greasyfork.org/scripts/521239/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%89%80%E6%9C%89url%E9%93%BE%E6%8E%A5-%E5%A4%96%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/521239/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E6%89%80%E6%9C%89url%E9%93%BE%E6%8E%A5-%E5%A4%96%E9%93%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // &zwnj;**脚本参数配置**&zwnj;
    // 通过修改以下变量来更改跳转方式
    // 0: 新标签页打开
    // 1: 直接打开
    // 2: 询问用户确认
    var jumpMode = 1; // 默认❶直接打开

    // Base64解码函数
    function base64Decode(encodedStr) {
        try {
            return atob(encodedStr);
        } catch (e) {
            console.error('Base64解码失败：', e);
            return null;
        }
    }

    // 检查URL是否有效的函数
    function isValidUrl(url) {
        const urlRegex = /^(https?:\/\/)(?:\w+(?:\.\w+)*(?:\.\w{2,})|(?:[0-9]{1,3}\.){3}[0-9]{1,3})(?::\d+)?(?:\/[^\s]*)?(?:\?[^\s]*)?(?:#[^\s]*)?$/i;
        return urlRegex.test(url);
    }

    // 解析查询参数中的URL函数
    function parseUrlsFromQuery() {
        const urls = [];
        const query = window.location.search.substring(1);
        const params = new URLSearchParams(query);

        for (const [key, value] of params) {
            if (key.toLowerCase() === 'target' || key.toLowerCase() === 'url') {
                let potentialUrl = value;

                // 尝试直接验证URL
                if (isValidUrl(potentialUrl)) {
                    urls.push(potentialUrl);
                } else {
                    // 尝试Base64解码并验证
                    const decodedUrl = base64Decode(potentialUrl);
                    if (decodedUrl && isValidUrl(decodedUrl)) {
                        urls.push(decodedUrl);
                    } else {
                        console.error(`无效的URL：${potentialUrl}，解码后也无效：${decodedUrl || 'null'}`);
                    }
                }
            }
        }

        return urls;
    }

    // 打开URL的函数
    function openUrls(urls) {
        if (urls.length > 0) {
            const urlToOpen = urls[0];
            switch (jumpMode) {
                case 0:
                    window.open(urlToOpen, '_blank'); // 新标签页打开
                    break;
                case 1:
                    window.location.href = urlToOpen; // 直接打开
                    break;
                case 2:
                    if (confirm(`准备跳转到以下链接：\n\n${urlToOpen} \n\n🏡 哆啦A梦！走，我们一起去新的网页 ⤵️`)) {
                        window.location.href = urlToOpen; // 询问用户确认后打开
                    }
                    break;
                default:
                    console.error('无效的跳转方式配置：', jumpMode);
            }
        }
    }

    // 主函数
    function main() {
        const urls = parseUrlsFromQuery();
        if (urls.length > 0) {
            openUrls(urls);
        }
    }

    // 执行主函数
    main();

    // &zwnj;**示例和说明**&zwnj;
    // 要更改跳转方式，请修改上面的 `jumpMode` 变量值。
    // 例如，要在新标签页中打开链接，将 `jumpMode` 设置为 0。
    // 要直接打开链接，将 `jumpMode` 设置为 1（默认值）。
    // 要询问用户确认后打开链接，将 `jumpMode` 设置为 2。
})();
