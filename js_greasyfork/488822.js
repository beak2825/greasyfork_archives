// ==UserScript==
// @name         Symfony 翻译文档 index.html
// @namespace   fireloong
// @version      0.1.4
// @description  翻译文档
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/index.html
// @match        https://symfony.com/doc/6.4/index.html
// @match        https://symfony.com/doc/7.1/index.html
// @match        https://symfony.com/doc/7.2/index.html
// @match        https://symfony.com/doc/current/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488822/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20indexhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/488822/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20indexhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Symfony Documentation\n        \n            ': 'Symfony 文档',
        '\n        \n                    Symfony 7.2 Documentation\n        \n            ': 'Symfony 7.2 文档',
        '\n        \n                    Symfony 6.4 Documentation\n        \n            ': 'Symfony 6.4 文档',
        '\n        \n                    Symfony 5.x Documentation\n        \n            ': 'Symfony 5.x 文档',
        '\n        \n                    Getting Started\n        \n            ': '开始',
        'Setup / Installation': '设置 / 安装',
        'Creating Pages':'创建页面',
        'Routing / Generating URLs': '路由 / 生成URL',
        'Controllers': '控制器',
        'Templates / Twig': '模板 / Twig',
        'Configuration / Env Vars': '配置 / 环境变量',
        '\n        \n                    Architecture\n        \n            ': '结构',
        'Requests / Responses': '请求 / 响应',
        'Kernel': '内核',
        'Services / DI': '服务 / DI',
        'Events': '事件',
        'Databases / Doctrine': '数据库 / Doctrine',
        'Forms': '表单',
        'Tests': '测试',
        'Cache': '缓存',
        'Logger': '日志器',
        'Errors / Debugging': '错误 / 调试',
        'Console': '控制台',
        'Validation': '验证',
        'Notifications': '通知',
        'Serialization': '序列化',
        'Translation / i18n': '翻译 / i18n',
        '\n        \n                    Security\n        \n            ': '安全',
        'Introduction': '介绍',
        'Users': '用户',
        'Authentication / Firewalls': '身份验证 / 防火墙',
        'Authorization / Voters': '授权 / Voters',
        'Passwords': '密码',
        '\n        \n                    Front-end\n        \n            ': '前端',
        'Files / Filesystem': '文件 / 文件系统',
        '\n        \n                    Production\n        \n            ': '生产',
        'Deployment': '部署',
        'Performance': '性能',
        'HTTP Cache': 'HTTP 缓存',
        'YAML Parser': 'YAML 解析器'
    };

    fanyi(translates, 'h1,.doc-index-links h2,.doc-index-links a');
})($);
