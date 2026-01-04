// ==UserScript==
// @name         Symfony 翻译文档 service_container/configurators.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/configurators.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/configurators.html
// @match        https://symfony.com/doc/6.4/service_container/configurators.html
// @match        https://symfony.com/doc/7.1/service_container/configurators.html
// @match        https://symfony.com/doc/7.2/service_container/configurators.html
// @match        https://symfony.com/doc/current/service_container/configurators.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508468/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerconfiguratorshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/508468/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerconfiguratorshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Configure a Service with a Configurator\n        \n            ': '如何使用配置器配置服务',
        'The service configurator is a feature of the service container that allows\nyou to use a callable to configure a service after its instantiation.': '服务配置器是服务容器的一个功能，它允许你在服务实例化之后使用一个可调用对象（callable）来配置该服务。',
        'A service configurator can be used, for example, when you have a service\nthat requires complex setup based on configuration settings coming from\ndifferent sources/services. Using an external configurator, you can maintain\nthe service implementation cleanly and keep it decoupled from the other\nobjects that provide the configuration needed.': '例如，当你有一个服务需要根据来自不同来源/服务的配置设置进行复杂的设置时，可以使用服务配置器。通过使用外部配置器，你可以保持服务实现的整洁，并使其与提供所需配置的其他对象解耦。',
        'Another use case is when you have multiple objects that share a common\nconfiguration or that should be configured in a similar way at runtime.': '另一个应用场景是在多个对象共享相同的配置或需要在运行时以类似的方式进行配置的情况下。',
        'For example, suppose you have an application where you send different types\nof emails to users. Emails are passed through different formatters that\ncould be enabled or not depending on some dynamic application settings.\nYou start defining a NewsletterManager class like this:': '例如，假设你有一个应用程序，需要向用户发送不同类型的电子邮件。电子邮件会通过不同的格式化器，这些格式化器是否启用取决于某些动态的应用程序设置。你可以像这样定义一个 <code translate="no" class="notranslate">NewsletterManager</code> 类：',
        'and also a GreetingCardManager class:': '同时，你还可以定义一个 <code translate="no" class="notranslate">GreetingCardManager</code> 类：',
        'As mentioned before, the goal is to set the formatters at runtime depending\non application settings. To do this, you also have an EmailFormatterManager\nclass which is responsible for loading and validating formatters enabled\nin the application:': '正如前面提到的，目标是根据应用程序设置在运行时设置格式化器。为此，你还拥有一个 <code translate="no" class="notranslate">EmailFormatterManager</code> 类，该类负责加载和验证应用程序中启用的格式化器：',
        'If your goal is to avoid having to couple NewsletterManager and\nGreetingCardManager with EmailFormatterManager, then you might want\nto create a configurator class to configure these instances:': '如果你的目标是避免将 <code translate="no" class="notranslate">NewsletterManager</code> 和 <code translate="no" class="notranslate">GreetingCardManager</code> 与 <code translate="no" class="notranslate">EmailFormatterManager</code> 耦合，那么你可能希望创建一个配置类来配置这些实例。',
        'The EmailConfigurator\'s job is to inject the enabled formatters into\nNewsletterManager and GreetingCardManager because they are not aware of\nwhere the enabled formatters come from. On the other hand, the\nEmailFormatterManager holds the knowledge about the enabled formatters and\nhow to load them, keeping the single responsibility principle.': '<code translate="no" class="notranslate">EmailConfigurator</code> 的任务是将启用的格式化程序注入到 <code translate="no" class="notranslate">NewsletterManager</code> 和 <code translate="no" class="notranslate">GreetingCardManager</code> 中，因为它们并不知道启用的格式化程序来自何处。另一方面，<code translate="no" class="notranslate">EmailFormatterManager</code> 拥有关于启用的格式化程序及其加载方式的知识，从而遵守单一职责原则。',
        'While this example uses a PHP class method, configurators can be any valid\nPHP callable, including functions, static methods and methods of services.': '虽然这个例子使用了一个 PHP 类方法，但配置器可以是任何有效的 PHP 可调用对象，包括函数、静态方法和服务的方法。',
        'Using the Configurator': '使用配置器',
        'You can configure the service configurator using the configurator option. If\nyou\'re using the default services.yaml configuration,\nall the classes are already loaded as services. All you need to do is specify the\nconfigurator:': '你可以使用 <code translate="no" class="notranslate">configurator</code> 选项来配置服务配置器。如果你使用的是<a href="../service_container.html#service-container-services-load-example" class="reference internal">默认的 <code translate="no" class="notranslate">services.yaml</code> 配置</a>，所有类都已经作为服务加载。你需要做的只是指定 <code translate="no" class="notranslate">configurator</code>。',
        'Services can be configured via invokable configurators (replacing the\nconfigure() method with __invoke()) by omitting the method name:': '服务可以通过可调用的配置器（通过使用 <code translate="no" class="notranslate">__invoke()</code> 方法代替 <code translate="no" class="notranslate">configure()</code> 方法）来配置，方法名称可以省略。',
        'That\'s it! When requesting the App\\Mail\\NewsletterManager or\nApp\\Mail\\GreetingCardManager service, the created instance will first be\npassed to the EmailConfigurator::configure() method.': '就是这样！当请求 <code translate="no" class="notranslate">App\\Mail\\NewsletterManager</code> 或 <code translate="no" class="notranslate">App\\Mail\\GreetingCardManager</code> 服务时，创建的实例将首先传递给 <code translate="no" class="notranslate">EmailConfigurator::configure()</code> 方法。',
    };

    fanyi(translates, 1);
})($);
