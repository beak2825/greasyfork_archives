// ==UserScript==
// @name         Weibo GitHub Link Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  在微博正文中提取github.com下的网址，并在页面上显示一个带超链接的按钮，点击能够跳转到对应的网址上去。
// @author       flaging
// @match        https://www.weibo.com
// @match        https://weibo.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517032/Weibo%20GitHub%20Link%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/517032/Weibo%20GitHub%20Link%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮
    const button = document.createElement('button');
    button.textContent = '查看GitHub链接';
    button.style.marginLeft = '10px'; // 添加一些左边距，以便按钮不会紧贴着前面的元素
    button.style.display = 'none'; // 默认隐藏

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 找到目标元素
        const targetElement = document.querySelector('.detail_wbtext_4CRf9');
        if (targetElement) {
            // 将按钮插入到目标元素之后
            targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
        }

        // 使用 MutationObserver 监听 DOM 变化
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // 提取GitHub链接
                    extractGitHubLinks();
                }
            });
        });

        // 开始观察 body 元素及其子元素的变化
        observer.observe(document.body, { childList: true, subtree: true });

        // 提取正文中的github链接
        function extractGitHubLinks() {
            const contents = document.querySelectorAll('.detail_wbtext_4CRf9'); // 微博正文内容
            let githubLinks = [];

            contents.forEach(content => {
                const text = content.textContent;
                // const links = text.match(/(github\.com\S*)/g) || text.match(/([\w.-]*\.github\.io[/?\w.-]*)/g) || [];
                const links = text.match(/(github\.com[/?\w.-]*)/g) || text.match(/([\w.-]*\.github\.io[/?\w.-]*)/g) || [];
                if (links.length > 0) {
                    links.forEach(link=>{
                        if (link.includes('github')) {
                            //console.log(link)
                            githubLinks = githubLinks.concat(link);
                        }
                    });
                }
            });
            //console.log(githubLinks);
            console.log(button.style.display);

            if (githubLinks.length > 0 && button.style.display == 'none') {
                button.style.display = 'inline-block';
                button.onclick = () => {
                    window.open('https://'+githubLinks[0], '_blank');
                };
                window.open('https://'+githubLinks[0]);
            } else {
                console.log('link:'+githubLinks[0]);
            }
        }
    });
})();
