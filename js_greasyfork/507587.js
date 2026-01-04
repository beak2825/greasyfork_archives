// ==UserScript==
// @name         Symfony 翻译文档 service_container/alias_private.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/alias_private.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/alias_private.html
// @match        https://symfony.com/doc/6.4/service_container/alias_private.html
// @match        https://symfony.com/doc/7.1/service_container/alias_private.html
// @match        https://symfony.com/doc/7.2/service_container/alias_private.html
// @match        https://symfony.com/doc/current/service_container/alias_private.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507587/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containeralias_privatehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/507587/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containeralias_privatehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Create Service Aliases and Mark Services as Private\n        \n            ': '如何创建服务别名并标记服务为私有',
        'Marking Services as Public / Private': '将服务标记为公共/私有',
        'When defining a service, it can be made to be public or private. If a service\nis public, it means that you can access it directly from the container at runtime.\nFor example, the doctrine service is a public service:': '在定义一项服务时，它可以被设置为公共（public）或私有（private）。如果一项服务是公共的，这意味着你可以在运行时直接从容器访问它。例如，<code translate="no" class="notranslate">doctrine</code> 服务就是一个公共服务：',
        'But typically, services are accessed using dependency injection.\nAnd in this case, those services do not need to be public.': '但通常情况下，服务是通过<a href="../service_container.html#services-constructor-injection" class="reference internal">依赖注入</a>来访问的。在这种情况下，这些服务不需要设为公共的。',
        'So unless you specifically need to access a service directly from the container\nvia $container->get(), the best-practice is to make your services private.\nIn fact, All services  are private by default.': '因此，除非你需要通过 <code translate="no" class="notranslate">$container-&gt;get()</code> 从容器中直接访问某个服务，否则最佳实践是将你的服务设置为私有的。事实上，所有服务默认都是<a href="../service_container.html#container-public" class="reference internal">私有的</a>。',
        'You can also control the public option on a service-by-service basis:': '你也可以对每个服务单独控制其 <code translate="no" class="notranslate">public</code> 选项：',
        'It is also possible to define a service as public thanks to the #[Autoconfigure]\nattribute. This attribute must be used directly on the class of the service\nyou want to configure:': '也可以通过使用 <code translate="no" class="notranslate">#[Autoconfigure]</code> 注解将一个服务定义为公共的。这个注解必须直接应用于你想要配置的服务类上：',
        'Private services are special because they allow the container to optimize whether\nand how they are instantiated. This increases the container\'s performance. It also\ngives you better errors: if you try to reference a non-existent service, you will\nget a clear error when you refresh any page, even if the problematic code would\nnot have run on that page.': '私有服务是特殊的，因为它们允许容器优化服务的实例化与否以及如何实例化。这可以提高容器的性能。同时，它还能给你带来更好的错误提示：如果你尝试引用一个不存在的服务，在刷新任何页面时都会得到明确的错误信息，即使有问题的代码在该页面上并不会被执行。',
        'Now that the service is private, you must not fetch the service directly\nfrom the container:': '现在服务已经被设置为私有的，你不应该直接从容器中获取该服务：',
        'Thus, a service can be marked as private if you do not want to access it\ndirectly from your code. However, if a service has been marked as private,\nyou can still alias it (see below) to access this service (via the alias).': '因此，如果不想直接从代码中访问某个服务，可以将其标记为私有的。然而，即使一个服务被标记为私有的，你仍然可以通过别名（见下文）来访问这个服务（通过别名）。',
        'Aliasing': '别名',
        'You may sometimes want to use shortcuts to access some services. You can\ndo so by aliasing them and, furthermore, you can even alias non-public\nservices.': '有时你可能希望使用快捷方式来访问某些服务。你可以通过为它们创建别名来实现这一点，并且，你甚至可以为非公共的服务创建别名。',
        'The #[AsAlias] attribute was introduced in Symfony 6.3.': '<code translate="no" class="notranslate">#[AsAlias]</code> 注解是在 Symfony 6.3 中引入的。',
        'This means that when using the container directly, you can access the\nPhpMailer service by asking for the app.mailer service like this:': '这意味着在直接使用容器时，你可以通过请求 <code translate="no" class="notranslate">app.mailer</code> 服务来访问 <code translate="no" class="notranslate">PhpMailer</code> 服务，如下所示：',
        'In YAML, you can also use a shortcut to alias a service:': '在 YAML 中，你也可以使用快捷方式来为服务创建别名：',
        'When using #[AsAlias] attribute, you may omit passing id argument\nif the class implements exactly one interface. MailerInterface will be\nalias of PhpMailer:': '当使用 <code translate="no" class="notranslate">#[AsAlias]</code> 注解时，如果该类恰好实现了一个接口，则可以省略传递 <code translate="no" class="notranslate">id</code> 参数。在这种情况下，<code translate="no" class="notranslate">MailerInterface</code> 将是 <code translate="no" class="notranslate">PhpMailer</code> 的别名：',
        'Deprecating Service Aliases': '弃用服务别名',
        'If you decide to deprecate the use of a service alias (because it is outdated\nor you decided not to maintain it anymore), you can deprecate its definition:': '如果你决定弃用某个服务别名（因为它已经过时或你决定不再维护它），你可以弃用它的定义：',
        'Now, every time this service alias is used, a deprecation warning is triggered,\nadvising you to stop or to change your uses of that alias.': '现在，每次使用这个服务别名时，都会触发一个弃用警告，建议你停止使用或更改对该别名的使用。',
        'The message is actually a message template, which replaces occurrences of the\n%alias_id% placeholder by the service alias id. You must have at least\none occurrence of the %alias_id% placeholder in your template.': '实际上，这条消息是一个消息模板，其中 <code translate="no" class="notranslate">%alias_id%</code> 占位符会被服务别名的 ID 替换。你在模板中必须至少包含一个 <code translate="no" class="notranslate">%alias_id%</code> 占位符。',
        'Anonymous Services': '匿名服务',
        'In some cases, you may want to prevent a service being used as a dependency of\nother services. This can be achieved by creating an anonymous service. These\nservices are like regular services but they don\'t define an ID and they are\ncreated where they are used.': '在某些情况下，你可能希望防止某个服务被其他服务作为依赖使用。这可以通过创建匿名服务来实现。这些服务类似于常规服务，但它们不定义 ID，并且在使用它们的地方被创建。',
        'The following example shows how to inject an anonymous service into another service:': '以下示例展示了如何将一个匿名服务注入到另一个服务中：',
        'Anonymous services do NOT inherit the definitions provided from the\ndefaults defined in the configuration. So you\'ll need to explicitly mark\nservice as autowired or autoconfigured when doing an anonymous service\ne.g.: inline_service(Foo::class)->autowire()->autoconfigure().': '匿名服务不会继承在配置中定义的默认定义。因此，在创建匿名服务时，你需要显式地标记服务为自动注入（autowired）或自动配置（autoconfigured），例如：<code translate="no" class="notranslate">inline_service(Foo::class)-&gt;autowire()-&gt;autoconfigure()</code>。',
        'Using an anonymous service as a factory looks like this:': '使用匿名服务作为工厂的方法如下所示：',
        'Deprecating Services': '弃用服务',
        'Once you have decided to deprecate the use of a service (because it is outdated\nor you decided not to maintain it anymore), you can deprecate its definition:': '一旦你决定弃用某个服务（因为它已经过时或你决定不再维护它），你可以弃用它的定义：',
        'Now, every time this service is used, a deprecation warning is triggered,\nadvising you to stop or to change your uses of that service.': '现在，每次使用这项服务时，都会触发一个弃用警告，建议您停止使用或更改对该服务的使用方式。',
        'The message is actually a message template, which replaces occurrences of the\n%service_id% placeholder by the service\'s id. You must have at least one\noccurrence of the %service_id% placeholder in your template.': '这条消息实际上是一个消息模板，其中会将 <code translate="no" class="notranslate">%service_id%</code> 占位符出现的位置替换为服务的 ID。您的模板中必须至少包含一个 <code translate="no" class="notranslate">%service_id%</code> 占位符。',
        'The deprecation message is optional. If not set, Symfony will show this default\nmessage: The "%service_id%" service is deprecated. You should stop using it,\nas it will soon be removed..': '弃用消息是可选的。如果没有设置，Symfony 将会显示以下默认消息：<code translate="no" class="notranslate">The "%service_id%" service is deprecated. You should stop using it, as it will soon be removed.</code>',
        'It is strongly recommended that you define a custom message because the\ndefault one is too generic. A good message informs when this service was\ndeprecated, until when it will be maintained and the alternative services\nto use (if any).': '强烈建议您定义一个自定义消息，因为默认消息太过泛化。一个好的消息应该告知该服务是在何时被弃用的，它还将被维护到何时，以及推荐使用的替代服务（如果有的话）。',
        'For service decorators (see How to Decorate Services), if the\ndefinition does not modify the deprecated status, it will inherit the status from\nthe definition that is decorated.': '对于服务装饰器（参见<a href="service_decoration.html" class="reference internal">如何装饰服务</a>），如果定义没有修改被装饰服务的弃用状态，则会继承被装饰服务的弃用状态。',
    };

    fanyi(translates, 1);
})($);
