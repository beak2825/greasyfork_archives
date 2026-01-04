// ==UserScript==
// @name         Symfony 翻译文档 controller/service.html
// @namespace    fireloong
// @version      0.1.4
// @description  翻译文档 controller/service.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/controller/service.html
// @match        https://symfony.com/doc/6.4/controller/service.html
// @match        https://symfony.com/doc/7.1/controller/service.html
// @match        https://symfony.com/doc/7.2/controller/service.html
// @match        https://symfony.com/doc/current/controller/service.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500796/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerservicehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/500796/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerservicehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Define Controllers as Services\n        \n            ': '如何将控制器定义为服务',
        "In Symfony, a controller does not need to be registered as a service. But if\nyou're using the default services.yaml configuration,\nand your controllers extend the AbstractController class, they are automatically\nregistered as services. This means you can use dependency injection like any\nother normal service.": '在 Symfony 中，控制器不需要注册为服务。但如果你使用的是<a href="../service_container.html#service-container-services-load-example" class="reference internal">默认 services.yaml 配置</a>，并且你的控制器继承自 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" rel="external noopener noreferrer" target="_blank">AbstractController</a> 类，它们将自动注册为服务。这意味着你可以像其它正常服务一样使用依赖注入。',
        "If your controllers don't extend the AbstractController class, you must\nexplicitly mark your controller services as public. Alternatively, you can\napply the controller.service_arguments tag to your controller services. This\nwill make the tagged services public and will allow you to inject services\nin method parameters:": '如果你的控制器没有继承 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" rel="external noopener noreferrer" target="_blank">AbstractController</a> 类，你必须明确地将你的控制器服务标记为 <code translate="no" class="notranslate">public</code>。另外，你也可以在你的控制器服务上应用 <code translate="no" class="notranslate">controller.service_arguments</code> 标签。这将使标记的服务成为 <code translate="no" class="notranslate">public</code>，并允许你在方法参数中注入服务：',
        "If you don't use either autowiring\nor autoconfiguration and you extend the\nAbstractController, you'll need to apply other tags and make some method\ncalls to register your controllers as services:": '如果你不使用 <a href="../service_container/autowiring.html" class="reference internal">autowiring</a> 或 <a href="../service_container.html#services-autoconfigure" class="reference internal">autoconfiguration</a>，而是继承 <code translate="no" class="notranslate">AbstractController</code> 类，你将需要应用其它标签并调用一些方法来将你的控制器注册为服务：',
        'If you prefer, you can use the #[AsController] PHP attribute to automatically\napply the controller.service_arguments tag to your controller services:': '如果你愿意，你可以使用 <code translate="no" class="notranslate">#[AsController]</code> PHP 注解来自动将 <code translate="no" class="notranslate">controller.service_arguments</code> 标签应用于你的控制器服务：',
        'Registering your controller as a service is the first step, but you also need to\nupdate your routing config to reference the service properly, so that Symfony\nknows to use it.': '将你的控制器注册为服务是第一步，但你也需要更新你的路由配置以正确引用该服务，这样 Symfony 就知道要使用它。',
        'Use the service_id::method_name syntax to refer to the controller method.\nIf the service id is the fully-qualified class name (FQCN) of your controller,\nas Symfony recommends, then the syntax is the same as if the controller was not\na service like: App\\Controller\\HelloController::index:': '使用 <code translate="no" class="notranslate">service_id::method_name</code> 语法来引用控制器方法。如果服务 ID 是控制器的完全限定类名（FQCN），如 Symfony 所推荐的那样，那么语法与控制器不是服务时相同，例如：<code translate="no" class="notranslate">App\\Controller\\HelloController::index</code>。',
        'Invokable Controllers': '调用控制器',
        'Controllers can also define a single action using the __invoke() method,\nwhich is a common practice when following the ADR pattern\n(Action-Domain-Responder):': '控制器还可以使用 <code translate="no" class="notranslate">__invoke()</code> 方法来定义一个单一的操作，这是遵循 ADR 模式（Action-Domain-Responder）时的常见做法：',
        'Alternatives to base Controller Methods': '基础控制器方法的替代方案',
        "When using a controller defined as a service, you can still extend the\nAbstractController base controller\nand use its shortcuts. But, you don't need to! You can choose to extend nothing,\nand use dependency injection to access different services.": '当使用定义为服务的控制器时，你仍然可以扩展 <a href="../controller.html#the-base-controller-class-services" class="reference internal">AbstractController 基础控制器</a>并使用其快捷方法。但是，你并不需要这样做！你可以选择不扩展任何内容，并使用依赖注入来访问不同的服务。',
        'The base Controller class source code is a great way to see how to accomplish\ncommon tasks. For example, $this->render() is usually used to render a Twig\ntemplate and return a Response. But, you can also do this directly:': '基础<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" rel="external noopener noreferrer" target="_blank">控制器类的源代码</a>是查看如何完成常见任务的好方法。例如，<code translate="no" class="notranslate">$this-&gt;render()</code> 通常用于渲染 Twig 模板并返回一个响应。但是，你也可以直接这样做：',
        "In a controller that's defined as a service, you can instead inject the twig\nservice and use it directly:": '在定义为服务的控制器中，你可以注入 <code translate="no" class="notranslate">twig</code> 服务并直接使用它：',
        'You can also use a special action-based dependency injection\nto receive services as arguments to your controller action methods.': '你也可以使用<a href="../controller.html#controller-accessing-services" class="reference internal">基于动作的特殊依赖注入</a>来接收服务作为你的控制器动作方法的参数。',
        'Base Controller Methods and Their Service Replacements': '基础控制器方法及其服务替代方案',
        'The best way to see how to replace base Controller convenience methods is to\nlook at the AbstractController class that holds its logic.': '了解如何替换基础 <code translate="no" class="notranslate">Controller</code> 便利方法的最佳方式是查看包含其逻辑的 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" rel="external noopener noreferrer" target="_blank">AbstractController</a> 类。',
        'If you want to know what type-hints to use for each service, see the\ngetSubscribedServices() method in AbstractController.': '如果你想知道每个服务应该使用什么类型提示，请查看 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" rel="external noopener noreferrer" target="_blank">AbstractController</a> 中的 <code translate="no" class="notranslate">getSubscribedServices()</code> 方法。',
    };

    fanyi(translates, 1);
})($);
