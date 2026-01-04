// ==UserScript==
// @name         Douban无缝转发
// @namespace    https://www.douban.com/
// @version      0.1
// @description  自动加载豆瓣帖子中的特定格式转发内容，从当前页开始加载后续页面内容，判断最后一页
// @match        https://www.douban.com/group/topic/*?type=rec*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/515952/Douban%E6%97%A0%E7%BC%9D%E8%BD%AC%E5%8F%91.user.js
// @updateURL https://update.greasyfork.org/scripts/515952/Douban%E6%97%A0%E7%BC%9D%E8%BD%AC%E5%8F%91.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isLoading = false;
    let hasNextPage = true;

    // 获取帖子 ID
    const topicId = window.location.pathname.match(/\/topic\/(\d+)\//)[1];

    // 确定起始页码
    const urlParams = new URLSearchParams(window.location.search);
    let page = urlParams.has('start') ? parseInt(urlParams.get('start')) / 30 + 1 : 1;  // 从当前页的下一页开始

    // 插入符合条件的转发内容
    function addRepostsToPage(reposts) {
        const container = document.querySelector('.list.topic-rec-list ul');
        reposts.forEach(repost => {
            const hasRequiredElements = repost.querySelector('.pic') &&
                                        repost.querySelector('.content') &&
                                        repost.querySelector('.pubtime');
            if (hasRequiredElements) {
                container.appendChild(repost.cloneNode(true));
            }
        });
    }

    // 加载下一页
    function loadMoreReposts() {
        if (isLoading || !hasNextPage) return;
        isLoading = true;

        // 构建 URL
        const url = `https://www.douban.com/group/topic/${topicId}/?type=rec&start=${page * 30}`;

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, 'text/html');
                const reposts = doc.querySelectorAll('.list.topic-rec-list ul > li');

                if (reposts.length === 0) {
                    hasNextPage = false;
                    return;
                }

                addRepostsToPage(reposts);

                // 检查是否还有下一页
                const nextButton = doc.querySelector('.paginator > span.next > a');
                if (!nextButton) {
                    hasNextPage = false;
                }

                isLoading = false;
                page++;  // 增加页数，准备加载下一页
            },
            onerror: function () {
                isLoading = false;
            }
        });
    }

    // 监听滚动事件，滚动到底部时加载更多
    window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            loadMoreReposts();
        }
    });

    // 初始不加载，等用户滚动到底部时再加载下一页
})();
