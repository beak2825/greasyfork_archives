// ==UserScript==
// @name         Symfony 翻译文档 service_container/calls.html
// @namespace    fireloong
// @version      0.1.2
// @description  翻译文档 service_container/calls.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/calls.html
// @match        https://symfony.com/doc/6.4/service_container/calls.html
// @match        https://symfony.com/doc/7.1/service_container/calls.html
// @match        https://symfony.com/doc/7.2/service_container/calls.html
// @match        https://symfony.com/doc/current/service_container/calls.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508396/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containercallshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/508396/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containercallshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Service Method Calls and Setter Injection\n        \n            ': '服务方法调用和 Setter 注入',
        'If you\'re using autowiring, you can use #[Required] to\nautomatically configure method calls.': '如果你使用自动装配，可以使用 <code translate="no" class="notranslate">#[Required]</code> 来自动配置方法调用。',
        'Usually, you\'ll want to inject your dependencies via the constructor. But sometimes,\nespecially if a dependency is optional, you may want to use "setter injection". For\nexample:': '通常，你希望通过构造函数注入依赖项。但有时，特别是当一个依赖项是可选的时候，你可能想使用“setter 注入”。例如：',
        'To configure the container to call the setLogger method, use the calls key:': '要配置容器调用 <code translate="no" class="notranslate">setLogger</code> 方法，可以使用 <code translate="no" class="notranslate">calls</code> 键：',
        'To provide immutable services, some classes implement immutable setters.\nSuch setters return a new instance of the configured class\ninstead of mutating the object they were called on:': '为了提供不可变的服务，一些类实现了不可变的 setter。这样的 setter 返回一个新的已配置类的实例，而不是修改调用它们的对象：',
        'Because the method returns a separate cloned instance, configuring such a service means using\nthe return value of the wither method ($service = $service->withLogger($logger);).\nThe configuration to tell the container it should do so would be like:': '因为该方法返回一个独立的克隆实例，配置这样的服务意味着使用 wither 方法的返回值（如 <code translate="no" class="notranslate">$service = $service-&gt;withLogger($logger);</code>）。告诉容器应该这样做的配置如下：',
        'If autowire is enabled, you can also use attributes; with the previous\nexample it would be:': '如果启用了自动装配，你也可以使用属性；以上述例子为例，它可以表示为：',
        'If you don\'t want a method with a static return type and\na #[Required] attribute to behave as a wither, you can\nadd a @return $this annotation to disable the returns clone\nfeature.': '如果你不希望一个具有 <code translate="no" class="notranslate">static</code> 返回类型且带有 <code translate="no" class="notranslate">#[Required]</code> 属性的方法表现成一个 wither 方法，你可以添加一个 <code translate="no" class="notranslate">@return $this</code> 注解来禁用返回克隆功能。',
    };

    fanyi(translates, 1);
})($);
