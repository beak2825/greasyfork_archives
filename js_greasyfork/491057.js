// ==UserScript==
// @name         Bangumi Comment Cleaner
// @namespace    https://github.com/Adachi-Git/BangumiCleaner
// @version      0.2
// @description  批量删除 Bangumi 上的回复
// @author       Adachi
// @match        https://*.bangumi.tv/group/my_reply*
// @match        https://*.bgm.tv/group/my_reply*
// @match        https://*.chii.in/group/my_reply*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491057/Bangumi%20Comment%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/491057/Bangumi%20Comment%20Cleaner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var totalTopicsVisited = 0;
    var totalRepliesDeleted = 0;
    var concurrencyLimit = 5; // 并发限制数量
    var requestCount = 0;

    // 获取请求头
    function getHeaders() {
        return {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Connection': 'keep-alive',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Cookie': document.cookie,
            'Host': window.location.hostname,
            'Referer': window.location.href,
            'Sec-Fetch-Dest': 'empty',
            'Sec-Fetch-Mode': 'cors',
            'Sec-Fetch-Site': 'same-origin',
            'User-Agent': navigator.userAgent,
            'X-Requested-With': 'XMLHttpRequest'
        };
    }

    // 解析响应内容，提取删除链接
    function parseDeleteLinks(html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var deleteLinks = doc.querySelectorAll('.erase_post');
        var deleteURLs = [];
        deleteLinks.forEach(function(link) {
            var deleteURL = link.getAttribute('href');
            console.log('删除链接:', deleteURL);
            deleteURLs.push(deleteURL);
        });
        return deleteURLs;
    }

    // 延时函数
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 并发控制器
    function runWithConcurrencyLimit(tasks, limit) {
        let index = 0;
        let activePromises = 0;
        const results = [];

        return new Promise((resolve, reject) => {
            function next() {
                if (index >= tasks.length && activePromises === 0) {
                    return resolve(results);
                }

                while (index < tasks.length && activePromises < limit) {
                    const task = tasks[index++];
                    activePromises++;
                    requestCount++;

                    task().then(result => {
                        results.push(result);
                        activePromises--;
                        next();
                    }).catch(error => {
                        console.error('Task error:', error);
                        activePromises--;
                        next();
                    });

                    // 每访问10次等待1秒
                    if (requestCount % 5 === 0) {
                        return delay(1000).then(() => {
                            activePromises--;
                            next();
                        });
                    }
                }
            }

            next();
        });
    }

    // 创建按钮
    function createDeleteButton() {
        var button = document.createElement('button');
        button.textContent = '清空你的回复吧';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.left = '20px';
        button.style.transform = 'translateY(-50%)';
        button.addEventListener('click', function() {
            var confirmDelete = confirm('确定要批量删除所有回复吗？');
            if (confirmDelete) {
                // 获取所有话题链接
                var topicLinks = document.querySelectorAll('td.subject a');
                var topicURLs = [];

                // 提取话题链接
                topicLinks.forEach(function(link) {
                    var href = link.getAttribute('href');
                    if (href.startsWith('/group/topic/')) {
                        var topicURL = 'https://' + window.location.hostname + href;
                        topicURLs.push(topicURL);
                    }
                });

                // 创建任务列表
                var tasks = topicURLs.map(topicURL => {
                    return function() {
                        return fetch(topicURL, {
                            method: 'GET',
                            headers: getHeaders(),
                            credentials: 'same-origin'
                        })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.text();
                        })
                        .then(html => {
                            console.log('话题URL:', topicURL);
                            console.log('响应内容:', html);

                            // 记录访问的话题数量
                            totalTopicsVisited++;

                            // 解析响应内容，提取删除链接
                            var deleteURLs = parseDeleteLinks(html);
                            if (deleteURLs.length > 0) {
                                // 创建删除任务列表
                                var deleteTasks = deleteURLs.map(deleteURL => {
                                    return function() {
                                        return fetch('https://' + window.location.hostname + deleteURL, {
                                            method: 'GET',
                                            headers: getHeaders(),
                                            credentials: 'same-origin'
                                        })
                                        .then(response => {
                                            if (!response.ok) {
                                                throw new Error('Network response was not ok');
                                            }
                                            return response.text();
                                        }).then(() => {
                                            totalRepliesDeleted++;
                                        });
                                    };
                                });

                                // 执行删除任务
                                return runWithConcurrencyLimit(deleteTasks, concurrencyLimit);
                            }
                        });
                    };
                });

                // 执行任务列表
                runWithConcurrencyLimit(tasks, concurrencyLimit).then(() => {
                    alert('成功删除了 ' + totalRepliesDeleted + ' 个回复，共 ' + totalTopicsVisited + ' 个话题');
                }).catch(error => {
                    console.error('Error in processing tasks:', error);
                });
            }
        });
        document.body.appendChild(button);
    }

    // 初始化
    createDeleteButton();

})();
