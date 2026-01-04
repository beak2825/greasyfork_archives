// ==UserScript==
// @name         分享到饭否
// @namespace    http://tampermonkey.net/
// @version      1.6
// @icon         http://static.fanfou.com/favicon.ico
// @description  将网页标题和链接分享到饭否
// @author       Jing Wang
// @contact      yuzhounh@163.com
// @license      GPL-3.0
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511322/%E5%88%86%E4%BA%AB%E5%88%B0%E9%A5%AD%E5%90%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/511322/%E5%88%86%E4%BA%AB%E5%88%B0%E9%A5%AD%E5%90%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of websites to exclude
    const excludedSites = [
        'https://fanfou.com/sharer/image',
        'https://service.weibo.com/share/share.php',
        'https://x.com/intent/post',
        'https://felo.ai/search',
        'https://claude.ai',
        'https://chatgpt.com',
        'https://app.yinxiang.com',
        'https://www.wiz.cn/xapp'
    ];

    // Check if the current page is in the excluded list
    function isExcludedSite() {
        return excludedSites.some(site => window.location.href.startsWith(site));
    }

    // Function to process the title
    function processTitle(title) {
        // Replace "- cnBeta.COM 移动版(WAP)" with "- cnBeta"
        title = title.replace("- cnBeta.COM 移动版(WAP)", "- cnBeta");

        // Remove "(X+ 封私信 / Y 条消息)" pattern, where X and Y can be any number
        title = title.replace(/\((\d+\+?)\s*封私信\s*\/\s*(\d+\+?)\s*条消息\)/g, "");

        return title.trim(); // Trim any leading or trailing whitespace
    }

    // Check if the current page is not in the excluded list
    if (!isExcludedSite()) {
        // Create share button
        let shareButton = document.createElement('button');
        shareButton.textContent = '分享到饭否';
        shareButton.style.position = 'fixed';
        shareButton.style.bottom = '55px';
        shareButton.style.right = '55px';
        shareButton.style.zIndex = '9999';
        shareButton.style.padding = '10px';
        shareButton.style.backgroundColor = '#0FACD5';
        shareButton.style.color = 'white';
        shareButton.style.border = 'none';
        shareButton.style.borderRadius = '5px';
        shareButton.style.cursor = 'pointer';
        shareButton.style.width = '100px';
        shareButton.style.fontWeight = 'bold';

        // Add click event listener
        shareButton.addEventListener('click', function() {
            let title = processTitle(document.title);
            let url = window.location.href;
            let shareText = encodeURIComponent(title);
            let fanfouUrl = `https://fanfou.com/sharer/image?u=${encodeURIComponent(url)}&t=${shareText}`;

            // Calculate window size and position
            let width = 800;
            let height = 480;
            let left = (window.screen.width - width) / 2;
            let top = (window.screen.height - height) / 2;

            // Open a popup window without address bar and toolbar, centered on the screen
            window.open(fanfouUrl, 'fanfou_share', `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,status=no,scrollbars=no,resizable=no`);
        });

        // Add button to the page
        document.body.appendChild(shareButton);
    }
})();