// ==UserScript==
// @name         Book for Symfony 6 翻译 32-rabbitmq.html
// @namespace    fireloong
// @version      0.1.0
// @description  使用 RabbitMQ 作为消息代理 32-rabbitmq.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/32-rabbitmq.html
// @match        https://symfony.com/doc/current/the-fast-track/en/32-rabbitmq.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503445/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2032-rabbitmqhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503445/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2032-rabbitmqhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using RabbitMQ as a Message Broker\n        \n            ': '使用 RabbitMQ 作为消息代理',
        'RabbitMQ is a very popular message broker that you can use as an alternative to PostgreSQL.': 'RabbitMQ 是一个非常流行的消息代理，你可以用它作为 PostgreSQL 的替代品。',
        'Switching from PostgreSQL to RabbitMQ': '从 PostgreSQL 切换到 RabbitMQ',
        'To use RabbitMQ instead of PostgreSQL as a message broker:': '要使用 RabbitMQ 作为消息代理而不是 PostgreSQL：',
        'We also need to add RabbitMQ support for Messenger:': '我们还需要为 Messenger 添加 RabbitMQ 支持：',
        'Adding RabbitMQ to the Docker Stack': '将 RabbitMQ 添加到 Docker Stack 中',
        'As you might have guessed, we also need to add RabbitMQ to the Docker Compose stack:': '正如你可能已经猜到的，我们还需要将 RabbitMQ 添加到 Docker Compose 堆栈中：',
        'Restarting Docker Services': '重启 Docker 服务',
        'To force Docker Compose to take the RabbitMQ container into account, stop the containers and restart them:': '要强制 Docker Compose 考虑 RabbitMQ 容器，请停止容器并重新启动它们：',
        'Exploring the RabbitMQ Web Management Interface': '探索 RabbitMQ Web 管理界面',
        'If you want to see queues and messages flowing through RabbitMQ, open its web management interface:': '如果你想查看通过 RabbitMQ 流动的队列和消息，请打开其 Web 管理界面：',
        'Or from the web debug toolbar:': '或者从 Web 调试工具栏中：',
        'Use guest/guest to login to the RabbitMQ management UI:': '使用 <code translate="no" class="notranslate">guest</code>/<code translate="no" class="notranslate">guest</code> 登录 RabbitMQ 管理界面：',
        'Deploying RabbitMQ': '部署 RabbitMQ',
        'Adding RabbitMQ to the production servers can be done by adding it to the list of services:': '可以通过将 RabbitMQ 添加到服务列表中来将其添加到生产服务器中：',
        'Reference it in the web container configuration as well and enable the amqp PHP extension:': '同样在 Web 容器配置中引用它，并启用 <code translate="no" class="notranslate">amqp</code> PHP 扩展：',
        'When the RabbitMQ service is installed on a project, you can access its web management interface by opening the tunnel first:': '当 RabbitMQ 服务安装在项目上时，您可以通过首先打开隧道来访问其 Web 管理界面：',
        'Going Further': '深入探索',
        'RabbitMQ docs.': '<a href="https://www.rabbitmq.com/documentation.html" class="reference external" rel="external noopener noreferrer" target="_blank">RabbitMQ 文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Using Redis to Store Sessions': '使用 Redis 存储会话',
        'What\'s Next?': '接下来是什么？'
    };

    fanyi(translates, 2);
})($);
