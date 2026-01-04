// ==UserScript==
// @name         Symfony 翻译文档 service_container/compiler_passes.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/compiler_passes.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/compiler_passes.html
// @match        https://symfony.com/doc/6.4/service_container/compiler_passes.html
// @match        https://symfony.com/doc/7.1/service_container/compiler_passes.html
// @match        https://symfony.com/doc/7.2/service_container/compiler_passes.html
// @match        https://symfony.com/doc/current/service_container/compiler_passes.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508461/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containercompiler_passeshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/508461/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containercompiler_passeshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Work with Compiler Passes\n        \n            ': '如何处理编译器传递',
        'Compiler passes give you an opportunity to manipulate other\nservice definitions that have been\nregistered with the service container. You can read about how to create them in\nthe components section "Compiling the Container".': '编译器遍历为你提供了操作已注册到服务容器中的其它<a href="definitions.html" class="reference internal">服务定义</a>的机会。你可以阅读组件部分的“<a href="../components/dependency_injection/compilation.html#components-di-separate-compiler-passes" class="reference internal">编译容器</a>”来了解如何创建它们。',
        'Compiler passes are registered in the build() method of the application kernel:': '编译器遍历是在应用内核的 <code translate="no" class="notranslate">build()</code> 方法中注册的。',
        'One of the most common use-cases of compiler passes is to work with tagged\nservices. In those cases, instead of creating a\ncompiler pass, you can make the kernel implement\nCompilerPassInterface\nand process the services inside the process() method:': '编译器传递最常见的用例之一是处理带有<a href="tags.html" class="reference internal">标签服务</a>。在这种情况下，你可以让容器实现 <a href="https://github.com/symfony/symfony/blob/6.4/src/Symfony/Component/DependencyInjection/Compiler/CompilerPassInterface.php" class="reference external" title="Symfony\Component\DependencyInjection\Compiler\CompilerPassInterface" rel="external noopener noreferrer" target="_blank">CompilerPassInterface</a>，并在 <code translate="no" class="notranslate">process()</code> 方法内部处理这些服务。',
        'Working with Compiler Passes in Bundles': '在 Bundles 中使用编译器传递',
        'Bundles can define compiler passes in the build() method of\nthe main bundle class (this is not needed when implementing the process()\nmethod in the extension):': '<a href="../bundles.html" class="reference internal">Bundles</a> 可以在主 bundle 类的 <code translate="no" class="notranslate">build()</code> 方法中定义编译器传递（当在扩展中实现 <code translate="no" class="notranslate">process()</code> 方法时，这不是必需的）：',
        'If you are using custom service tags in a\nbundle then by convention, tag names consist of the name of the bundle\n(lowercase, underscores as separators), followed by a dot, and finally the\n"real" name. For example, if you want to introduce some sort of "transport" tag\nin your AcmeMailerBundle, you should call it acme_mailer.transport.': '如果你在一个 bundle 中使用自定义的<a href="tags.html" class="reference internal">服务标签</a>，按照惯例，标签名称由 bundle 的名称（小写，下划线作为分隔符）组成，后面加上一个点，最后是“真实”的名称。例如，如果你想在你的 AcmeMailerBundle 中引入某种类型的“传输”标签，你应该将其命名为 <code translate="no" class="notranslate">acme_mailer.transport</code>。',
    };

    fanyi(translates, 1);
})($);
