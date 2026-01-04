// ==UserScript==
// @name         Book for Symfony 6 翻译 index.html
// @namespace    fireloong
// @version      0.0.7
// @description  目录 index.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/index.html
// @match        https://symfony.com/doc/current/the-fast-track/en/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501583/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%20indexhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501583/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%20indexhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        'Symfony: The Fast Track': 'Symfony：快速通道',
        'Acknowledgments': '致谢',
        'What is it about?': '是关于什么的？',
        'Checking your Work Environment': '检查你的工作环境',
        'Introducing the Project': '项目介绍',
        'Going from Zero to Production': '从零到生产',
        'Adopting a Methodology': '采用方法',
        'Troubleshooting Problems': '故障排查',
        'Creating a Controller': '创建控制器',
        'Setting up a Database': '设置数据库',
        'Describing the Data Structure': '描述数据结构',
        'Setting up an Admin Backend': '设置管理后端',
        'Building the User Interface': '构建用户界面',
        'Branching the Code': '代码分支',
        'Listening to Events': '监听事件',
        'Managing the Lifecycle of Doctrine Objects': '管理 Doctrine 对象的生命周期',
        'Accepting Feedback with Forms': '使用表单接收反馈',
        'Securing the Admin Backend': '保护管理后台的安全',
        'Preventing Spam with an API': '使用 API 防止垃圾邮件',
        'Testing': '测试',
        'Going Async': '异步处理',
        'Making Decisions with a Workflow': '使用工作流程做出决策',
        'Emailing Admins': '向管理员发送电子邮件',
        'Caching for Performance': '缓存以提高性能',
        'Styling the User Interface with Webpack': '使用 Webpack 样式化用户界面',
        'Resizing Images': '调整图像大小',
        'Running Crons': '运行 Cron 任务（或 Cron 作业）',
        'Notifying by all Means': '用尽一切手段通知',
        'Exposing an API with API Platform': '使用 API Platform 公开 API',
        'Building an SPA': '构建单页面应用（SPA）',
        'Localizing an Application': '本地化应用程序',
        'Managing Performance': '管理性能',
        'Discovering Symfony Internals': '发现 Symfony 的内部机制',
        'Using Redis to Store Sessions': '使用 Redis 存储会话',
        'Using RabbitMQ as a Message Broker': '使用 RabbitMQ 作为消息代理',
        'What\'s Next?': '接下来是什么？',
    };

    fanyi(translates, '.toctree a,h1');
})($);
