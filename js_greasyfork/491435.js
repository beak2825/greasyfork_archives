// ==UserScript==
// @name         Twig 翻译文档 intro.html
// @namespace    fireloong
// @version      0.0.2
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/intro.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491435/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20introhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/491435/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20introhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        'Prerequisites': '先决条件',
        'Installation': '安装',
        'Basic API Usage': '基本 API 用法',
        'Introduction': '介绍',
        'Welcome to the documentation for Twig, the flexible, fast, and secure template\nengine for PHP.': '欢迎来到 Twig 的文档，这是一个灵活、快速、安全的 PHP 模板引擎。',
        "Twig is both designer and developer friendly by sticking to PHP's principles and\nadding functionality useful for templating environments.": 'Twig 通过坚持 PHP 的原则和添加对模板环境有用的功能，对设计人员和开发人员都很友好。',
        'The key-features are...': '主要特点是……',
        'Fast: Twig compiles templates down to plain optimized PHP code. The\noverhead compared to regular PHP code was reduced to the very minimum.': '<em>快速</em>：Twig 将模板编译为简单优化的 PHP 代码。与常规 PHP 代码相比，开销减少到了最低限度。',
        'Secure: Twig has a sandbox mode to evaluate untrusted template code. This\nallows Twig to be used as a template language for applications where users\nmay modify the template design.': '<em>安全</em>：Twig 有一个沙盒模式来评估不受信任的模板代码。这使得 Twig 可以用作应用程序的模板语言，用户可以在其中修改模板设计。',
        'Flexible: Twig is powered by a flexible lexer and parser. This allows the\ndeveloper to define their own custom tags and filters, and to create their own DSL.': '<em>灵活</em>：Twig 由灵活的词法分析器和解析器提供支持。这允许开发人员定义他们自己的自定义标记和过滤器，并创建他们自己的 DSL。',
        'Twig is used by many Open-Source projects like Symfony, Drupal8, eZPublish,\nphpBB, Matomo, OroCRM; and many frameworks have support for it as well like\nSlim, Yii, Laravel, and Codeigniter — just to name a few.': '许多开源项目都使用了 Twig，比如 Symfony、Drupal8、eZPublish、phpBB、Matomo、OroCRM；许多框架也支持它，比如 Slim、Yii、Laravel 和 Codeigniter——仅举几例。',
        'Like to learn from video tutorials? Check out the SymfonyCasts Twig Tutorial!': '喜欢从视频教程中学习?看看 <a href="https://symfonycasts.com/screencast/twig" class="reference external" rel="external noopener noreferrer" target="_blank">symfonycast Twig 教程</a>！',
        'Twig 3.x needs at least PHP 7.2.5 to run.': 'Twig 3.x 至少需要 <strong>PHP 7.2.5</strong> 才能运行。',
        'The recommended way to install Twig is via Composer:': '推荐的安装 Twig 的方法是通过 Composer：',
        'This section gives you a brief introduction to the PHP API for Twig:': '本节将简要介绍 Twig 的 PHP API：',
        'Twig uses a loader (\\Twig\\Loader\\ArrayLoader) to locate templates, and an\nenvironment (\\Twig\\Environment) to store its configuration.': 'Twig 使用装载器(<code translate="no" class="notranslate">\\Twig\\Loader\\ArrayLoader</code>)来定位模板，并使用环境(<code translate="no" class="notranslate">\\Twig\\Environment</code>)来存储其配置。',
        'The render() method loads the template passed as a first argument and\nrenders it with the variables passed as a second argument.': '<code translate="no" class="notranslate">render()</code> 方法加载作为第一个参数传递的模板，并将其与作为第二个参数传递的变量一起渲染。',
        'As templates are generally stored on the filesystem, Twig also comes with a\nfilesystem loader:': '由于模板通常存储在文件系统中，Twig 还附带了一个文件系统加载器：',
    };


    $('#doc-toc a,.section h1 a,.section h2 a,.section p,.section li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);