// ==UserScript==
// @name         B站分享链接净化器 - 保留时间戳与分P (Bilibili URL Cleaner)
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  自动清理B站视频链接中的追踪参数，只保留时间戳(t)和分P(p)参数。
// @author       BiBiCi
// @icon         https://www.bilibili.com/favicon.ico
// @match        *://www.bilibili.com/video/BV*
// @match        *://*.bilibili.com/video/av*
// @match        *://*.bilibili.com/v/topic/detail/*
// @match        *://m.bilibili.com/video/*
// @match        *://www.bilibili.com/list/*
// @license      MIT
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539706/B%E7%AB%99%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8%20-%20%E4%BF%9D%E7%95%99%E6%97%B6%E9%97%B4%E6%88%B3%E4%B8%8E%E5%88%86P%20%28Bilibili%20URL%20Cleaner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539706/B%E7%AB%99%E5%88%86%E4%BA%AB%E9%93%BE%E6%8E%A5%E5%87%80%E5%8C%96%E5%99%A8%20-%20%E4%BF%9D%E7%95%99%E6%97%B6%E9%97%B4%E6%88%B3%E4%B8%8E%E5%88%86P%20%28Bilibili%20URL%20Cleaner%29.meta.js
// ==/UserScript==

(function() {
    // 1. 检查浏览器是否支持剪贴板 API
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== 'function') {
        return;
    }

    // 2. 缓存原始的 writeText 函数，防止递归调用或被其他脚本修改
    const originalWriteText = navigator.clipboard.writeText.bind(navigator.clipboard);

    // 3. 重写剪贴板的 writeText 方法
    navigator.clipboard.writeText = async (text) => {
        const inputString = String(text);

        // 用于匹配 URL 的正则表达式（涵盖了常见的 http/https 链接）
        const urlRegex = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?/gi;

        let processedText = "";
        let lastIndex = 0;
        let match;

        // 重置正则匹配索引
        urlRegex.lastIndex = 0;

        // 4. 遍历字符串，寻找所有的 URL
        while ((match = urlRegex.exec(inputString)) !== null) {
            const matchedUrl = match[0];
            // 将匹配到 URL 之前的部分先加入结果字符串
            processedText += inputString.slice(lastIndex, match.index);

            let urlObj;
            try {
                urlObj = new URL(matchedUrl);
            } catch (e) {
                // 如果不是合法的 URL，原样放回
                processedText += matchedUrl;
                lastIndex = urlRegex.lastIndex;
                continue;
            }

            // 5. 核心逻辑：判断是否为 B 站视频链接
            if (urlObj.hostname === "www.bilibili.com" && urlObj.pathname.startsWith("/video/")) {
                // 提取视频 ID (BV 或 av 号)
                const videoIdMatch = urlObj.pathname.match(/^\/video\/(BV[a-zA-Z0-9_]+|av\d+)/i);
                const videoId = videoIdMatch ? videoIdMatch[1] : null;

                if (videoId) {
                    const searchParams = new URLSearchParams(urlObj.search);
                    let paramsToKeep = [];

                    // 仅保留 'p' (分P) 和 't' (时间戳) 参数
                    if (searchParams.has("p")) {
                        paramsToKeep.push(`p=${searchParams.get("p")}`);
                    }
                    if (searchParams.has("t")) {
                        paramsToKeep.push(`t=${searchParams.get("t")}`);
                    }

                    // 重新拼接干净的 URL
                    const cleanUrl = paramsToKeep.length === 0
                        ? `https://www.bilibili.com/video/${videoId}`
                        : `https://www.bilibili.com/video/${videoId}?${paramsToKeep.join("&")}`;

                    processedText += cleanUrl;
                } else {
                    processedText += matchedUrl;
                }
            } else {
                // 非 B 站视频链接，不做处理
                processedText += matchedUrl;
            }

            lastIndex = urlRegex.lastIndex;
        }

        // 拼接最后剩余的字符串
        processedText += inputString.slice(lastIndex);

        // 6. 调用原始的 writeText 将净化后的内容写入剪贴板
        await originalWriteText(processedText);
    };
})();
