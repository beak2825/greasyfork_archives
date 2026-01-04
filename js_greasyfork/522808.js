// ==UserScript==
// @name         RSS 订阅链接查找器（扩展版）
// @namespace    https://greasyfork.org/users/1171320
// @version      1.15
// @description  打开网页时，查询常用的 RSS 后缀并验证是否可用，在网页右下角显示，可一键复制。已适配世界 TOP500 网站及绝大部分网站，此外除常见网站、博客， 添加一些自写规则 BiliBili、GitHub、Twitter（七天内更新）
// @author         yzcjd
// @author2       ChatGPT4 辅助
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522808/RSS%20%E8%AE%A2%E9%98%85%E9%93%BE%E6%8E%A5%E6%9F%A5%E6%89%BE%E5%99%A8%EF%BC%88%E6%89%A9%E5%B1%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522808/RSS%20%E8%AE%A2%E9%98%85%E9%93%BE%E6%8E%A5%E6%9F%A5%E6%89%BE%E5%99%A8%EF%BC%88%E6%89%A9%E5%B1%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.self !== window.top) return;

    const rssLinks = new Map();
    const possibleRssPaths = [
        '/rss', '/feed', '/atom.xml', '/rss.xml', '/feed.xml', '/index.xml',
        '/feed.atom', '/rss.json', '/atom', '/index.atom', '/index.rss',
        '/?feed=rss', '/?feed=rss2', '/blog/feed', '/blog/rss', '/latest/rss',
        '/news/atom', '/feed/index.xml', '/articles/feed', '/rss2',
        '/home/rss', '/media/rss', '/feed.rss', '/rss/latest', '/?feed=rss3',
        '/rss/1', '/feed1', '/posts.rss', '/news/rss', '/feed?format=rss',
        '/latest/rss.xml', '/rss/articles', '/rss/latestposts',
        '/rss.json', '/atom.json', '/feed.json', '/news/atom.json', '/rss.xml',
        '/api/v1/feed', '/v1/feed', '/user/feed', '/posts/feed',
        '/author/feed', '/tag/feed', '/category/feed', '/comments/feed',
        '/rss2.0', '/rss2.json', '/atom2.xml', '/topics/feed', '/channel/feed',
        '/user/feed', '/subscribe.rss', '/activity/rss', '/site/rss',
        '/stream/rss', '/events/rss', '/post/rss', '/recent/rss', '/site-rss',
        '/subscribe/feed', '/latest/feed', '/content/rss', '/new-content/rss',
        '/trending/feed', '/updates/feed', '/new/rss', '/articles/rss',
        '/news/feed', '/breaking/rss', '/info/rss', '/comments.rss',
        '/media/rss.xml', '/video/feed', '/video/rss', '/updates/rss', '/global/rss'
    ];

    function addStyle() {
        GM_addStyle(`
            #rss-finder-toggle {
                position: fixed;
                bottom: 40px;
                right: 20px;
                width: 22.5px;
                height: 22.5px;
                border-radius: 50%;
                background: #0078d7;
                color: #fff;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 9999;
                padding: 2px;
                user-select: none;
            }
            #rss-finder-container {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: #fdfdfd;
                border: 1px solid #ccc;
                padding: 10px;
                display: none;
                z-index: 9998;
                font-family: Arial, sans-serif;
                font-size: 14px;
            }
            #rss-finder-container h4 {
                margin: 0 0 5px 0;
                font-size: 1em;
            }
            #rss-finder-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            #rss-finder-list li {
                margin-bottom: 5px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 0.9em;
            }
            #rss-finder-list li a {
                color: blue;
                text-decoration: none;
                word-break: break-all;
                flex-grow: 1;
                margin-right: 10px;
            }
            #rss-finder-list li button {
                font-size: 0.6em;
                padding: 2px 4px;
                cursor: pointer;
                border: 1px solid #ccc;
                background-color: #f0f0f0;
                border-radius: 0;
                user-select: none;
                color: black;
            }
            #rss-finder-list li button.success {
                background-color: #28a745 !important;
                color: white !important;
                border-color: #28a745;
            }
        `);
    }

    function updateRssList() {
        let container = document.getElementById('rss-finder-container');
        let toggle = document.getElementById('rss-finder-toggle');

        if (!toggle) {
            toggle = document.createElement('div');
            toggle.id = 'rss-finder-toggle';
            document.body.appendChild(toggle);
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const visible = container.style.display === 'block';
                container.style.display = visible ? 'none' : 'block';
            });
            document.addEventListener('click', (e) => {
                if (!container.contains(e.target) && !toggle.contains(e.target)) {
                    container.style.display = 'none';
                }
            });
        }

        if (!container) {
            container = document.createElement('div');
            container.id = 'rss-finder-container';
            container.innerHTML = '<h4>可用 RSS 订阅:</h4><ul id="rss-finder-list"></ul>';
            document.body.appendChild(container);
        }

        toggle.textContent = rssLinks.size;

        const list = container.querySelector('#rss-finder-list');
        list.innerHTML = '';

        rssLinks.forEach((label, url) => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = url;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.textContent = label ? `[${label}] ${url}` : url;

            const copyButton = document.createElement('button');
            copyButton.textContent = 'copy';
            copyButton.onclick = function () {
                GM_setClipboard(url);
                copyButton.textContent = 'success';
                copyButton.classList.add('success');
                setTimeout(() => {
                    copyButton.textContent = 'copy';
                    copyButton.classList.remove('success');
                }, 1500);
            };

            li.appendChild(a);
            li.appendChild(copyButton);
            list.appendChild(li);
        });
    }

    function findRssLinks() {
        const links = document.querySelectorAll('link[type*="rss"], link[type*="atom"], link[type="application/feed+json"]');
        links.forEach(link => {
            const href = link.href || link.getAttribute('href');
            if (href) {
                rssLinks.set(href, link.title || '');
            }
        });

        possibleRssPaths.forEach(path => {
            const base = location.origin || (location.protocol + '//' + location.host);
            const url = new URL(path, base).href;
            tryRssUrl(url);
        });

        setTimeout(updateRssList, 800);
    }

    function tryRssUrl(url) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            headers: { 'Accept': 'application/rss+xml, application/xml, text/xml, */*' },
            onload: function (response) {
                if (response.status === 200 && /<rss|<feed|<rdf|<channel/i.test(response.responseText)) {
                    rssLinks.set(url, '');
                    updateRssList();
                }
            }
        });
    }

    addStyle();
    findRssLinks();
})();
