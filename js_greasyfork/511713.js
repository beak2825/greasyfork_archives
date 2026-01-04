// ==UserScript==
// @name         Share to X
// @namespace    http://tampermonkey.net/
// @version      0.5
// @icon         https://x.com/favicon.ico
// @description  Share the webpage title and link to X
// @author       Jing Wang
// @contact      yuzhounh@163.com
// @license      GPL-3.0
// @match        *://*/*
// @exclude      https://x.com/intent/post*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511713/Share%20to%20X.user.js
// @updateURL https://update.greasyfork.org/scripts/511713/Share%20to%20X.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to process the title
    function processTitle(title) {
        // Replace "- cnBeta.COM 移动版(WAP)" with "- cnBeta"
        title = title.replace("- cnBeta.COM 移动版(WAP)", "- cnBeta");

        // Remove "(X+ 封私信 / Y 条消息)" pattern, where X and Y can be any number
        title = title.replace(/\(\d+\+?\s*封私信\s*\/\s*\d+\s*条消息\)/g, "");

        // Remove "(X)" pattern, where X can be any number
        title = title.replace(/\(\d+\)/g, "");

        return title.trim(); // Trim any leading or trailing whitespace
    }

    // 自定义编码函数
    function encodeForX(str) {
        return str.replace(/ /g, '+')
                  .replace(/:/g, '%3A')
                  .replace(/\//g, '%2F')
                  .replace(/\?/g, '%3F')
                  .replace(/=/g, '%3D')
                  .replace(/&/g, '%26')
                  .replace(/#/g, '%23');
    }

    // Check if the current page is not an X share page
    if (!window.location.href.startsWith('https://fanfou.com/sharer/image') && !window.location.href.startsWith('https://service.weibo.com/share/share.php') && !window.location.href.startsWith('https://x.com/intent/post')) {
        // Create share button
        let shareButton = document.createElement('button');
        shareButton.textContent = 'Share to X';
        shareButton.style.position = 'fixed';
        shareButton.style.bottom = '165px';
        shareButton.style.right = '55px';
        shareButton.style.zIndex = '9999';
        shareButton.style.padding = '10px';
        shareButton.style.backgroundColor = '#000000'; // X's new brand color
        shareButton.style.color = 'white';
        shareButton.style.border = 'none';
        shareButton.style.borderRadius = '5px';
        shareButton.style.cursor = 'pointer';
        shareButton.style.width = '100px'; // Set button width
        shareButton.style.fontWeight = 'bold'; // bold font

        // Add click event listener
        shareButton.addEventListener('click', function() {
            let title = processTitle(document.title);
            let url = window.location.href;
            let shareText = encodeForX(title + ' ' + url + ' ');
            let xUrl = `https://x.com/intent/post?text=${shareText}`;

            // Open the link in a new tab
            window.open(xUrl, '_blank');
        });

        // Add button to the page
        document.body.appendChild(shareButton);
    }
})();

