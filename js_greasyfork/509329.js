// ==UserScript==
// @name         Symfony 翻译文档 service_container/expression_language.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/expression_language.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/expression_language.html
// @match        https://symfony.com/doc/6.4/service_container/expression_language.html
// @match        https://symfony.com/doc/7.1/service_container/expression_language.html
// @match        https://symfony.com/doc/7.2/service_container/expression_language.html
// @match        https://symfony.com/doc/current/service_container/expression_language.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509329/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerexpression_languagehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/509329/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerexpression_languagehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Inject Values Based on Complex Expressions\n        \n            ': '如何根据复杂的表达式注入值',
        'The service container also supports an "expression" that allows you to inject\nvery specific values into a service.': '服务容器还支持一种“表达式”，允许您向服务注入非常特定的值。',
        'For example, suppose you have a service (not shown here), called App\\Mail\\MailerConfiguration,\nwhich has a getMailerMethod() method on it. This returns a string - like sendmail\nbased on some configuration.': '例如，假设您有一个服务（此处未显示），名为 <code translate="no" class="notranslate">App\\Mail\\MailerConfiguration</code>，其中有一个 <code translate="no" class="notranslate">getMailerMethod()</code> 方法。该方法返回一个字符串——比如根据某些配置返回 <code translate="no" class="notranslate">sendmail</code>。',
        'Suppose that you want to pass the result of this method as a constructor argument\nto another service: App\\Mailer. One way to do this is with an expression:': '假设您希望将此方法的结果作为构造函数参数传递给另一个服务：<code translate="no" class="notranslate">App\\Mailer</code>。实现这一点的一种方法是使用表达式：',
        'Learn more about the expression language syntax.': '了解更多关于<a href="../reference/formats/expression_language.html" class="reference internal">表达式语言语法</a>的信息。',
        'In this context, you have access to 3 functions:': '在此上下文中，您可以访问 3 个函数：',
        '\n                            Returns a given service (see the example above).\n                    ': '返回给定的服务（参见上面的例子）。',
        '\n                            Returns a specific parameter value (syntax is like service).\n                    ': '返回特定的参数值（语法类似于 <code translate="no" class="notranslate">service</code>）。',
        '\n                            Returns the value of an env variable.\n                    ': '返回环境变量的值。',
        'The env() function was introduced in Symfony 6.1.': '<code translate="no" class="notranslate">env()</code> 函数是在 Symfony 6.1 中引入的。',
        'You also have access to the Container\nvia a container variable. Here\'s another example:': '您还可以通过 <code translate="no" class="notranslate">container</code> 变量访问<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/DependencyInjection/Container.php" class="reference external" title="Symfony\Component\DependencyInjection\Container" rel="external noopener noreferrer" target="_blank">容器</a>。以下是另一个例子：',
        'Expressions can be used in arguments, properties, as arguments with\nconfigurator, as arguments to calls (method calls) and in\nfactories (service factories).': '表达式可以用于 <code translate="no" class="notranslate">arguments</code>（参数）、<code translate="no" class="notranslate">properties</code>（属性），作为 <code translate="no" class="notranslate">configurator</code>（配置器）的参数、作为 <code translate="no" class="notranslate">calls</code>（方法调用）的参数以及在 <code translate="no" class="notranslate">factories</code>（<a href="factories.html" class="reference internal">服务工厂</a>）中。',
        'Using expressions in factories was introduced in Symfony 6.1.': '在 <code translate="no" class="notranslate">factories</code> 中使用表达式是在 Symfony 6.1 中引入的。',
    };

    fanyi(translates, 1);
})($);
