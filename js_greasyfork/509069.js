// ==UserScript==
// @name         Symfony 翻译文档 service_container/debug.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/debug.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/debug.html
// @match        https://symfony.com/doc/6.4/service_container/debug.html
// @match        https://symfony.com/doc/7.1/service_container/debug.html
// @match        https://symfony.com/doc/7.2/service_container/debug.html
// @match        https://symfony.com/doc/current/service_container/debug.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509069/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerdebughtml.user.js
// @updateURL https://update.greasyfork.org/scripts/509069/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerdebughtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Debug the Service Container & List Services\n        \n            ': '如何调试服务容器及列出服务',
        'You can find out what services are registered with the container using the\nconsole. To show all services (public and private) and their PHP classes, run:': '你可以使用控制台查看注册到容器中的服务。要显示所有服务（公共和私有）及其 PHP 类，可以运行以下命令：',
        'To see a list of all of the available types that can be used for autowiring, run:': '要查看可用于自动装配的所有可用类型的列表，可以运行以下命令：',
        'Debugging Service Tags': '调试服务标签',
        'Run the following command to find out what services are tagged\nwith a specific tag:': '运行以下命令以查看带有特定<a href="tags.html" class="reference internal">标签</a>的服务：',
        'Partial search is also available:': '部分搜索也是可用的：',
        'The partial search was introduced in Symfony 6.2.': '部分搜索功能是在 Symfony 6.2 中引入的。',
        'Detailed Info about a Single Service': '获取单个服务的详细信息',
        'You can get more detailed information about a particular service by specifying\nits id:': '你可以通过指定服务 ID 来获取特定服务的更详细信息：',
    };

    fanyi(translates, 1);
})($);
