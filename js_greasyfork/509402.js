// ==UserScript==
// @name         Symfony 翻译文档 service_container/factories.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/factories.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/factories.html
// @match        https://symfony.com/doc/6.4/service_container/factories.html
// @match        https://symfony.com/doc/7.1/service_container/factories.html
// @match        https://symfony.com/doc/7.2/service_container/factories.html
// @match        https://symfony.com/doc/current/service_container/factories.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509402/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerfactorieshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/509402/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerfactorieshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using a Factory to Create Services\n        \n            ': '使用工厂模式创建服务',
        'Symfony\'s Service Container provides multiple features to control the creation\nof objects, allowing you to specify arguments passed to the constructor as well\nas calling methods and setting parameters.': 'Symfony 的服务容器提供了多种功能来控制对象的创建，允许你指定传递给构造函数的参数，以及调用方法和设置参数。',
        'However, sometimes you need to apply the factory design pattern to delegate\nthe object creation to some special object called "the factory". In those cases,\nthe service container can call a method on your factory to create the object\nrather than directly instantiating the class.': '然而，有时候你需要应用工厂设计模式，将对象的创建委托给一个称为“工厂”的特殊对象。在这种情况下，服务容器可以通过调用你的工厂方法来创建对象，而不是直接实例化该类。',
        'Static Factories': '静态工厂',
        'Suppose you have a factory that configures and returns a new NewsletterManager\nobject by calling the static createNewsletterManager() method:': '假设你有一个工厂，通过调用静态方法 <code translate="no" class="notranslate">createNewsletterManager()</code> 来配置并返回一个新的 <code translate="no" class="notranslate">NewsletterManager</code> 对象：',
        'To make the NewsletterManager object available as a service, use the\nfactory option to define which method of which class must be called to\ncreate its object:': '为了让 <code translate="no" class="notranslate">NewsletterManager</code> 对象作为服务可用，可以使用 <code translate="no" class="notranslate">factory</code> 选项来定义应调用哪个类的哪个方法来创建其对象：',
        'When using a factory to create services, the value chosen for class\nhas no effect on the resulting service. The actual class name\nonly depends on the object that is returned by the factory. However,\nthe configured class name may be used by compiler passes and therefore\nshould be set to a sensible value.': '当使用工厂来创建服务时，所选择的类值对最终的服务没有影响。实际的类名仅取决于工厂返回的对象。然而，配置的类名可能会被编译器传递使用，因此应该设置一个合理的值。',
        'Using the Class as Factory Itself': '使用类本身作为工厂',
        'When the static factory method is on the same class as the created instance,\nthe class name can be omitted from the factory declaration.\nLet\'s suppose the NewsletterManager class has a create() method that needs\nto be called to create the object and needs a sender:': '当静态工厂方法位于与创建实例相同的类上时，可以在工厂声明中省略类名。假设 <code translate="no" class="notranslate">NewsletterManager</code> 类有一个 <code translate="no" class="notranslate">create()</code> 方法，需要调用该方法来创建对象，并且需要一个发送者：',
        'You can omit the class on the factory declaration:': '你可以在工厂声明中省略类名：',
        'It is also possible to use the constructor option, instead of passing null\nas the factory class:': '也可以使用 <code translate="no" class="notranslate">constructor</code> 选项，而不是将工厂类设置为 <code translate="no" class="notranslate">null</code>：',
        'The constructor option was introduced in Symfony 6.3.': '<code translate="no" class="notranslate">constructor</code> 选项是在 Symfony 6.3 中引入的。',
        'Non-Static Factories': '非静态工厂',
        'If your factory is using a regular method instead of a static one to configure\nand create the service, instantiate the factory itself as a service too.\nConfiguration of the service container then looks like this:': '如果你的工厂使用的是普通方法而不是静态方法来配置和创建服务，那么也需要将工厂本身作为一个服务实例化。服务容器的配置如下所示：',
        'Invokable Factories': '可调用工厂',
        'Suppose you now change your factory method to __invoke() so that your\nfactory service can be used as a callback:': '假设你现在将工厂方法改为 <code translate="no" class="notranslate">__invoke()</code>，以便你的工厂服务可以作为回调函数使用。',
        'Services can be created and configured via invokable factories by omitting the\nmethod name:': '服务可以通过省略方法名称的可调用工厂来创建和配置。',
        'Using Expressions in Service Factories': '在服务工厂中使用表达式',
        'Using expressions as factories was introduced in Symfony 6.1.': '在 Symfony 6.1 中引入了使用表达式作为工厂的功能。',
        'Instead of using PHP classes as a factory, you can also use\nexpressions. This allows you to\ne.g. change the service based on a parameter:': '你可以使用<a href="expression_language.html" class="reference internal">表达式</a>作为工厂，而不必使用 PHP 类。这允许你根据参数来改变服务，例如：',
        'Passing Arguments to the Factory Method': '向工厂方法传递参数',
        'Arguments to your factory method are autowired if\nthat\'s enabled for your service.': '如果你的服务启用了<a href="../service_container.html#services-autowire" class="reference internal">自动装配</a>，那么你的工厂方法的参数也会被自动注入。',
        'If you need to pass arguments to the factory method you can use the arguments\noption. For example, suppose the createNewsletterManager() method in the\nprevious examples takes the templating service as an argument:': '如果你需要向工厂方法传递参数，你可以使用 <code translate="no" class="notranslate">arguments</code> 选项。例如，假设前文中的 <code translate="no" class="notranslate">createNewsletterManager()</code> 方法需要 <code translate="no" class="notranslate">templating</code> 服务作为参数：',
    };

    fanyi(translates, 1);
})($);
