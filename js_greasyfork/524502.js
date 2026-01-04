// ==UserScript==
// @name         妖火首页获取热门帖
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在妖火论坛首页插入热门帖子列表
// @author       SiXi
// @icon         https://yaohuo.me/css/favicon.ico
// @match        *://www.yaohuo.me/
// @match        *://yaohuo.me/
// @match        *://www.yaohuo.me/wapindex.aspx
// @match        *://yaohuo.me/wapindex.aspx
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524502/%E5%A6%96%E7%81%AB%E9%A6%96%E9%A1%B5%E8%8E%B7%E5%8F%96%E7%83%AD%E9%97%A8%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/524502/%E5%A6%96%E7%81%AB%E9%A6%96%E9%A1%B5%E8%8E%B7%E5%8F%96%E7%83%AD%E9%97%A8%E5%B8%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hotPostsUrl = 'https://www.yaohuo.me/bbs/book_list_hot.aspx?classid=0&days=1';
    // 发起请求获取热门帖子页面内容
    GM_xmlhttpRequest({
        method: 'GET',
        url: hotPostsUrl,
        onload: function(response) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const posts = doc.querySelectorAll('.listdata.line1, .listdata.line2');

            // 创建一个数组来存储帖子标题和链接
            const postList = [];
            posts.forEach((post, index) => {
                const link = post.querySelector('a.topic-link');
                if (link) {
                    postList.push({
                        title: link.textContent.trim(),
                        href: link.getAttribute('href')
                    });
                }
            });

            // 如果获取到了帖子，则插入到页面中
            if (postList.length > 0) {
                insertHotPosts(postList);
            }
        },
        onerror: function(error) {
            console.error('获取热门帖失败:', error);
        }
    });

    // 插入热门帖子到首页
    function insertHotPosts(postList) {
        const targetScript = document.querySelector('script[src*="/Template/search/index.js"]');
        if (!targetScript) return;

        // 创建热门帖显示位置
        const titleDiv = document.createElement('div');
        titleDiv.className = 'title';
        titleDiv.innerHTML = '【<a class="brackets" href="bbs/book_list_hot.aspx?classid=0&days=1">全站热门</a>】<a href="bbs/book_list_hot.aspx?classid=0&days=3">三天</a><span class="separate"> </span><a href="bbs/book_list_hot.aspx?classid=0&days=7">一周</a>';

        // 创建热门帖列表
        const listDiv = document.createElement('div');
        listDiv.className = 'list';
        postList.forEach((post, index) => {
            const postLink = document.createElement('a');
            postLink.href = post.href;
            postLink.textContent = `${index + 1}.${post.title}`;
            listDiv.appendChild(postLink);
            listDiv.appendChild(document.createElement('br'));
        });

        targetScript.parentNode.insertBefore(titleDiv, targetScript.nextSibling);
        targetScript.parentNode.insertBefore(listDiv, titleDiv.nextSibling);
    }
})();