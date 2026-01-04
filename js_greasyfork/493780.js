// ==UserScript==
// @name         Twig 翻译文档 api.html
// @namespace    fireloong
// @version      0.0.3
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/api.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493780/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20apihtml.user.js
// @updateURL https://update.greasyfork.org/scripts/493780/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20apihtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let cssStyle='code, pre{background:var(--code-background);}';
    GM_addStyle(cssStyle);

    $('#sln').hide();

    const translates = {
        'Twig for Developers': '开发者的 Twig',
        'Basics': '基础知识',
        'Rendering Templates': '渲染模板',
        'Environment Options': '环境的选择',
        'Loaders': '加载器',
        'Compilation Cache': '编译缓存',
        'Built-in Loaders': '内置的加载器',
        'Create your own Loader': '创建自己的加载器',
        'Using Extensions': '使用扩展',
        'Built-in Extensions': '内置的扩展',
        'Core Extension': '核心扩展',
        'Escaper Extension': 'Escaper 扩展',
        'Sandbox Extension': '沙盒扩展',
        'Profiler Extension': '探查器扩展',
        'Optimizer Extension': '优化器扩展',
        'Exceptions': '异常',
        'This chapter describes the API to Twig and not the template language. It will\nbe most useful as reference to those implementing the template interface to\nthe application and not those who are creating Twig templates.': '本章描述的是 Twig 的 API，而不是模板语言。对于那些实现应用程序模板接口的人，而不是那些正在创建 Twig 模板的人，它将是最有用的参考。',
        'Twig uses a central object called the environment (of class\n\\Twig\\Environment). Instances of this class are used to store the\nconfiguration and extensions, and are used to load templates.': 'Twig 使用一个名为 <strong>environment</strong> 的中心对象（属于类 <code translate="no" class="notranslate">\\Twig\\Environment</code>）。此类的实例用于存储配置和扩展，并用于加载模板。',
        'Most applications create one \\Twig\\Environment object on application\ninitialization and use that to load templates. In some cases, it might be useful\nto have multiple environments side by side, with different configurations.': '大多数应用程序在应用程序初始化时创建一个 <code translate="no" class="notranslate">\\Twig\\Environment</code> 对象，并使用它来加载模板。在某些情况下，使用不同的配置并排使用多个环境可能会很有用。',
         'The typical way to configure Twig to load templates for an application looks\nroughly like this:': '配置 Twig 为应用程序加载模板的典型方法大致如下：',
        'This creates a template environment with a default configuration and a loader\nthat looks up templates in the /path/to/templates/ directory. Different\nloaders are available and you can also write your own if you want to load\ntemplates from a database or other resources.': '这将创建一个具有默认配置的模板环境和一个加载器，该加载器在 <code translate="no" class="notranslate">/path/to/templates/</code> 目录中查找模板。可以使用不同的加载器，如果想从数据库或其他资源加载模板，也可以编写自己的加载器。',
        'Notice that the second argument of the environment is an array of options.\nThe cache option is a compilation cache directory, where Twig caches\nthe compiled templates to avoid the parsing phase for sub-sequent\nrequests. It is very different from the cache you might want to add for\nthe evaluated templates. For such a need, you can use any available PHP\ncache library.': '注意，环境的第二个参数是一个选项数组。缓存选项是一个编译缓存目录，在这里，Twig 缓存编译后的模板，以避免后续请求的解析阶段。它与您可能希望为求值模板添加的缓存非常不同。对于这种需要，您可以使用任何可用的 PHP 缓存库。',
        'To load a template from a Twig environment, call the load() method which\nreturns a \\Twig\\TemplateWrapper instance:': '要从 Twig 环境中加载模板，调用 <code translate="no" class="notranslate">load()</code> 方法，它会返回一个 <code translate="no" class="notranslate">\\Twig\\TemplateWrapper</code> 实例：',
        'To render the template with some variables, call the render() method:': '要用一些变量渲染模板，调用 <code translate="no" class="notranslate">render()</code> 方法：',
        'The display() method is a shortcut to output the rendered template.': '<code translate="no" class="notranslate">display()</code> 方法是输出渲染模板的快捷方式。',
        'You can also load and render the template in one fell swoop:': '还可以一次加载并渲染模板：',
        'If a template defines blocks, they can be rendered individually via the\nrenderBlock() call:': '如果模板定义了块，它们可以通过 <code translate="no" class="notranslate">renderBlock()</code> 调用单独渲染：',
    };

    $('#doc-toc a,.section h1 a,.section h2 a,.section h3 a,.section p,.section li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);