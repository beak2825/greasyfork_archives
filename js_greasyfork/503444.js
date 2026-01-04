// ==UserScript==
// @name         Book for Symfony 6 翻译 31-redis.html
// @namespace    fireloong
// @version      0.1.0
// @description  使用 Redis 存储会话 31-redis.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/31-redis.html
// @match        https://symfony.com/doc/current/the-fast-track/en/31-redis.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503444/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2031-redishtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503444/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2031-redishtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using Redis to Store Sessions\n        \n            ': '使用 Redis 存储会话',
        'Depending on the website traffic and/or its infrastructure, you might want to use Redis to manage user sessions instead of PostgreSQL.': '根据你的网站流量和/或其基础架构，您可能想要使用 Redis 来管理用户会话，而不是 PostgreSQL。',
        'When we talked about branching the project\'s code to move sessions from the filesystem to the database, we listed all the needed step to add a new service.': '当我们谈到将项目的代码分支化，以将会话从文件系统迁移到数据库时，我们列出了添加新服务所需的所有步骤。',
        'Here is how you can add Redis to your project in one patch:': '以下是如何在一次补丁中将 Redis 添加到你的项目中：',
        'Isn\'t it beautiful?': '是不是很漂亮?',
        '"Reboot" Docker to start the Redis service:': '“重启”Docker 以启动 Redis 服务：',
        'Test locally by browsing the website; everything should still work as before.': '通过浏览网站在本地进行测试；一切应该仍然像以前一样工作。',
        'Commit and deploy as usual:': '像往常一样提交并部署：',
        'Going Further': '深入探索',
        'Redis docs.': '<a href="https://redis.io/documentation" class="reference external" rel="external noopener noreferrer" target="_blank">Redis 文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Discovering Symfony Internals': '发现 Symfony 的内部机制',
        'Using RabbitMQ as a Message Broker': '使用 RabbitMQ 作为消息代理'
    };

    fanyi(translates, 2);
})($);
