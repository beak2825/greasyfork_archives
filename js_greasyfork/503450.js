// ==UserScript==
// @name         Book for Symfony 6 翻译 next.html
// @namespace    fireloong
// @version      0.1.0
// @description  接下来是什么？ next.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/next.html
// @match        https://symfony.com/doc/current/the-fast-track/en/next.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503450/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%20nexthtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503450/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%20nexthtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    What\'s Next?\n        \n            ': '接下来是什么？',
        'I hope you enjoyed the ride. I have tried to give you enough information to\nhelp you get started faster with your Symfony projects. We have barely\nscratched the surface of the Symfony world. Now, dive into the rest of the\nSymfony documentation to learn more about each feature we have discovered\ntogether.': '我希望你喜欢这次旅程。我已经尝试给你足够的信息，帮助你更快地开始你的 Symfony 项目。我们刚刚触及了 Symfony 世界的表面。现在，深入 Symfony 文档的其余部分，以了解更多我们共同发现的功能。',
        'Happy Symfony coding!': '祝你 Symfony 编程愉快！',
        'Previous page': '上一页',
        'Using RabbitMQ as a Message Broker': '使用 RabbitMQ 作为消息代理'
    };

    fanyi(translates, 2);
})($);
