// ==UserScript==
// @name         分享到微博
// @namespace    http://tampermonkey.net/
// @version      0.6
// @icon         https://weibo.com/favicon.ico
// @description  将网页标题和链接分享到微博
// @author       Jing Wang
// @contact      yuzhounh@163.com
// @license      GPL-3.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511328/%E5%88%86%E4%BA%AB%E5%88%B0%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/511328/%E5%88%86%E4%BA%AB%E5%88%B0%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process the title
    function processTitle(title) {
        // Replace "- cnBeta.COM 移动版(WAP)" with "- cnBeta"
        title = title.replace("- cnBeta.COM 移动版(WAP)", "- cnBeta");

        // Remove "(X+ 封私信 / Y 条消息)" pattern, where X and Y can be any number
        title = title.replace(/\(\d+\+?\s*封私信\s*\/\s*\d+\s*条消息\)/g, "");

        return title.trim(); // Trim any leading or trailing whitespace
    }

    // Create share button
    if (!window.location.href.startsWith('https://fanfou.com/sharer/image') && !window.location.href.startsWith('https://service.weibo.com/share/share.php') && !window.location.href.startsWith('https://x.com/intent/post')) {
        let shareButton = document.createElement('button');
        shareButton.textContent = '分享到微博'; // "Share to Weibo" in Chinese
        shareButton.style.position = 'fixed';
        shareButton.style.bottom = '110px';
        shareButton.style.right = '55px';
        shareButton.style.zIndex = '9999';
        shareButton.style.padding = '10px';
        shareButton.style.backgroundColor = '#FF8200'; // Weibo orange
        shareButton.style.color = 'white';
        shareButton.style.border = 'none';
        shareButton.style.borderRadius = '5px';
        shareButton.style.cursor = 'pointer';
        shareButton.style.width = '100px'; // 设置按钮宽度
        shareButton.style.fontWeight = 'bold'; // 可选：使文字加粗

        // Add click event listener
        shareButton.addEventListener('click', function() {
            let title = processTitle(document.title);
            let url = window.location.href;
            let shareText = encodeURIComponent(title);
            let weiboUrl = `https://service.weibo.com/share/share.php?url=${encodeURIComponent(url)} &title=${shareText}`;

            // Open in a new tab instead of a popup window
            window.open(weiboUrl, '_blank');
        });

        // Add button to the page
        document.body.appendChild(shareButton);
    }
})();