// ==UserScript==
// @name         Amazon Japan 预览图下载
// @namespace    https://bgm.tv/user/662064
// @version      1.1
// @description  在 amazon.co.jp 的链接包含 /dp/ 或 /gp/ 的商品页下载产品的预览图
// @author       板斧青凤
// @match        *://www.amazon.co.jp/*
// @icon         https://www.amazon.co.jp/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      m.media-amazon.com
// @downloadURL https://update.greasyfork.org/scripts/523059/Amazon%20Japan%20%E9%A2%84%E8%A7%88%E5%9B%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/523059/Amazon%20Japan%20%E9%A2%84%E8%A7%88%E5%9B%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 仅在 URL 含 /dp/ 或 /gp/ 时执行
    const currentUrl = window.location.href;
    if (!(currentUrl.includes('/dp/') || currentUrl.includes('/gp/'))) {
        return;
    }

    // 避免重复插入按钮
    let isButtonInserted = false;

    /**
     * 尝试在页面的所有 <script type="text/javascript"> 中
     * 查找包含 "ImageBlockATF" 的脚本，并提取 "hiRes" 字段
     */
    function findHiResUrl() {
        const scripts = document.querySelectorAll('script[type="text/javascript"]');
        for (const s of scripts) {
            const content = s.textContent || '';
            // 如果脚本内容含有 "ImageBlockATF"，则进一步找 "hiRes"
            if (content.includes('ImageBlockATF')) {
                const match = content.match(/"hiRes"\s*:\s*"([^"]+)"/);
                if (match) {
                    return match[1]; // 返回 hiRes 链接
                }
            }
        }
        return null;
    }

    /**
     * 去除链接中形如 ._XXX_ 的部分
     * 例如: abc._XXX_.jpg -> abc.jpg
     */
    function removeSegmentBetweenDots(link) {
        const lastDotIndex = link.lastIndexOf('.');
        const secondLastDotIndex = link.lastIndexOf('.', lastDotIndex - 1);
        if (secondLastDotIndex === -1) return link;
        return link.substring(0, secondLastDotIndex) + link.substring(lastDotIndex);
    }

    /**
     * 获取商品标题，作为文件名时去除特殊字符
     */
    function getFileNameFromTitle() {
        const titleSpan = document.getElementById('productTitle');
        if (!titleSpan) return null;

        // 提取文本并去掉首尾空白
        let rawTitle = titleSpan.textContent.trim();

        // 去除可能不适合作为文件名的字符，如 \ / : * ? " < > |
        // 也可以再加一些其他替换逻辑
        rawTitle = rawTitle.replace(/[\\\/:\*\?"<>\|]/g, '_');

        // 给文件名添加后缀
        return rawTitle || 'amazon_image'; // 万一是空，就用一个默认名
    }

    /**
     * 核心处理逻辑：查找 hiRes、生成按钮并插入
     */
    function processPage() {
        if (isButtonInserted) return; // 已插入过就不重复执行

        // 1. 获取 hiRes 链接
        const hiResUrl = findHiResUrl();
        if (!hiResUrl) {
            // 若没找到 "hiRes" 脚本则继续等
            return;
        }

        // 2. 去除 ._XXX_ 段
        const finalUrl = removeSegmentBetweenDots(hiResUrl);

        // 3. 获取商品标题，用于当做文件名
        const fileNameBase = getFileNameFromTitle();
        if (!fileNameBase) {
            // 如果没拿到标题，也可以用一个fallback，如 'amazon_image'
            // 这里我们就继续用amazon_image吧
        }

        // 4. 找到 #title h1 元素
        const titleH1 = document.querySelector('#title');
        if (!titleH1) {
            // console.log('[脚本] 没找到 #title h1, 等待中...');
            return;
        }

        // 5. 创建下载按钮并设置样式
        const downloadButton = document.createElement('button');
        downloadButton.textContent = '下载图片';
        // 白色背景，左右圆角，浅灰边框
        downloadButton.style.backgroundColor = '#fff';
        downloadButton.style.color = '#333';
        downloadButton.style.borderRadius = '9999px'; // 左右半圆
        downloadButton.style.border = '1px solid #ccc';
        downloadButton.style.padding = '4px 10px';
        downloadButton.style.marginLeft = '8px';
        downloadButton.style.cursor = 'pointer';
        downloadButton.style.fontSize = '14px';

        // 6. 按钮点击，跨域下载
        downloadButton.onclick = function() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: finalUrl,
                responseType: 'blob',
                onload: function(response) {
                    if (response.status === 200) {
                        const blob = response.response;
                        const blobUrl = URL.createObjectURL(blob);
                        const tempLink = document.createElement('a');
                        tempLink.href = blobUrl;
                        // 拼接带扩展名的文件名，比如 .jpg
                        // 若想自动识别后缀，需要更多逻辑，如从Content-Type判断
                        tempLink.download = (fileNameBase || 'amazon_image') + '.jpg';
                        document.body.appendChild(tempLink);
                        tempLink.click();
                        URL.revokeObjectURL(blobUrl);
                        document.body.removeChild(tempLink);
                    } else {
                        alert('下载失败：' + response.status);
                    }
                },
                onerror: function() {
                    alert('跨域请求失败，请检查 @connect 设置');
                }
            });
        };

        // 7. 把按钮插入在 #title h1 之后
        // 若 #title 本身是 <h1>，那么 insertAdjacentElement('afterend') 会插到 h1 之后
        titleH1.insertAdjacentElement('afterend', downloadButton);

        isButtonInserted = true; // 标记已插入
    }

    // 使用 MutationObserver 以应对亚马逊可能的异步加载/切换
    const observer = new MutationObserver(() => {
        if (!isButtonInserted) {
            processPage();
        }
        if (isButtonInserted) {
            // 已成功插入后，停止观察
            observer.disconnect();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 也可先尝试执行一次
    processPage();

})();