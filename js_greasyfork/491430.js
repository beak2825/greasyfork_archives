// ==UserScript==
// @name         Twig 翻译文档 index.html
// @namespace    fireloong
// @version      0.0.3
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/
// @match        https://twig.symfony.com/doc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491430/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20indexhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/491430/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20indexhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        'Twig Documentation': 'Twig 文档',
        'Twig Reference': 'Twig 参考',
        'Twig Reference for Symfony': 'Symfony 的 Twig 参考',
        'Read the online documentation to learn more about Twig.': '阅读在线文档以了解有关 Twig 的更多信息。',
        '\n        Browse the online reference to learn more about built-in features.\n    ': '浏览在线参考资料，了解有关内置功能的更多信息。',
        '\n\n                Use short URLs to quickly find docs for any built-in\n                tag, filter, function, or test:\n                https://twig.symfony.com/XXX.\n\n            ': '使用短 URL 快速查找任何内置标记、筛选器、函数或测试的文档：<code>https://twig.symfony.com/XXX</code>.',
        '\n        Symfony provides many more features via the symfony/twig-bridge Composer package.\n    ': 'Symfony 通过 <code>symfony/twig-bridge</code> Composer 包提供了更多功能。',
        'Introduction': '介绍',
        'Installation': '安装',
        'Twig for Template Designers': '模板设计师的 Twig',
        'Twig for Developers': '开发者的 Twig',
        'Extending Twig': '扩展 Twig',
        'Twig Internals': 'Twig 内部结构',
        'Deprecated Features': '弃用功能',
        'Twig Recipes': 'Twig 食谱',
        'Coding Standards': '编码标准',
        'License': '许可证',
        'Tags': '标记',
        'Filters': '过滤器',
        'Functions': '函数',
        'Tests': '测试',
        'Operators': '运算符',
    };


    $('.content h1,.content p,.content>.pages a,.content h2, #doc-toc a').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);