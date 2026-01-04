// ==UserScript==
// @name         Symfony 翻译文档 configuration/micro_kernel_trait.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 configuration/micro_kernel_trait.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/configuration/micro_kernel_trait.html
// @match        https://symfony.com/doc/6.4/configuration/micro_kernel_trait.html
// @match        https://symfony.com/doc/7.1/configuration/micro_kernel_trait.html
// @match        https://symfony.com/doc/7.2/configuration/micro_kernel_trait.html
// @match        https://symfony.com/doc/current/configuration/micro_kernel_trait.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505311/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationmicro_kernel_traithtml.user.js
// @updateURL https://update.greasyfork.org/scripts/505311/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationmicro_kernel_traithtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Building your own Framework with the MicroKernelTrait\n        \n            ': '使用 MicroKernelTrait 构建你自己的框架',
        'The default Kernel class included in Symfony applications uses a\nMicroKernelTrait to configure\nthe bundles, the routes and the service container in the same class.': 'Symfony 应用程序中默认包含的 <code translate="no" class="notranslate">Kernel</code> 类使用了 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Kernel/MicroKernelTrait.php" class="reference external" title="Symfony\Bundle\FrameworkBundle\Kernel\MicroKernelTrait" rel="external noopener noreferrer" target="_blank">MicroKernelTrait</a> 来在同一类中配置组件、路由和服务容器。',
        'This micro-kernel approach is flexible, allowing you to control your application\nstructure and features.': '这种微型内核的方法非常灵活，允许你控制应用程序的结构和特性。',
        'A Single-File Symfony Application': '单文件 Symfony 应用程序',
        'Start with a completely empty directory and install these Symfony components\nvia Composer:': '从一个完全空的目录开始，并通过 Composer 安装以下 Symfony 组件：',
        'Next, create an index.php file that defines the kernel class and runs it:': '接下来，创建一个 <code translate="no" class="notranslate">index.php</code> 文件，该文件定义内核类并运行它：',
        'The PHP attributes notation has been introduced in Symfony 6.1.': 'PHP 属性注解是在 Symfony 6.1 中引入的。',
        'In addition to the index.php file, you\'ll need to create a directory called\nconfig/ in your project (even if it\'s empty because you define the configuration\noptions inside the configureContainer() method).': '除了 <code translate="no" class="notranslate">index.php</code> 文件之外，你还需要在项目中创建一个名为 <code translate="no" class="notranslate">config/</code> 的目录（即使它是空的，因为你是在 <code translate="no" class="notranslate">configureContainer()</code> 方法内部定义配置选项）。',
        'That\'s it! To test it, start the Symfony Local Web Server:': '就是这样！要测试它，启动 <a href="../setup/symfony_server.html" class="reference internal">Symfony 本地 Web 服务器</a>：',
        'Then see the JSON response in your browser: http://localhost:8000/random/10': '然后在浏览器中查看 JSON 响应：<a href="http://localhost:8000/random/10" class="reference external" rel="external noopener noreferrer" target="_blank">http://localhost:8000/random/10</a>',
        'The Methods of a "Micro" Kernel': '“微型”内核的方法',
        'When you use the MicroKernelTrait, your kernel needs to have exactly three methods\nthat define your bundles, your services and your routes:': '当你使用 <code translate="no" class="notranslate">MicroKernelTrait</code> 时，你的内核需要恰好有三个方法来定义你的组件、服务和路由：',
        '\n                            This is the same registerBundles() that you see in a normal kernel.\n                    ': '这与你在常规内核中看到的 <code translate="no" class="notranslate">registerBundles()</code> 方法是相同的。',
        '\n                            This method builds and configures the container. In practice, you will use\nextension() to configure different bundles (this is the equivalent\nof what you see in a normal config/packages/* file). You can also register\nservices directly in PHP or load external configuration files (shown below).\n                    ': '这个方法构建并配置服务容器。在实践中，你可以使用 <code translate="no" class="notranslate">extension()</code> 方法来配置不同的组件（这相当于你在常规 <code translate="no" class="notranslate">config/packages/*</code> 文件中所看到的内容）。你还可以直接在 PHP 中注册服务或加载外部配置文件（如下所示）。',
        '\n                            Your job in this method is to add routes to the application. The\nRoutingConfigurator has methods that make adding routes in PHP more\nfun. You can also load external routing files (shown below).\n                    ': '在这个方法中，你的任务是向应用添加路由。<code translate="no" class="notranslate">RoutingConfigurator</code> 提供了一些方法，使得用 PHP 添加路由变得更加有趣。你还可以加载外部路由文件（如下所示）。',
        'Adding Interfaces to "Micro" Kernel': '为“微型”内核添加接口',
        'When using the MicroKernelTrait, you can also implement the\nCompilerPassInterface to automatically register the kernel itself as a\ncompiler pass as explained in the dedicated\ncompiler pass section. If the\nExtensionInterface\nis implemented when using the MicroKernelTrait, then the kernel will\nbe automatically registered as an extension. You can learn more about it in\nthe dedicated section about\nmanaging configuration with extensions.': '当使用 <code translate="no" class="notranslate">MicroKernelTrait</code> 时，你还可以实现 <code translate="no" class="notranslate">CompilerPassInterface</code>，以自动将内核本身注册为编译器传递，具体解释请参阅专门的<a href="../service_container/compiler_passes.html#kernel-as-compiler-pass" class="reference internal">编译器传递章节</a>。如果在使用 <code translate="no" class="notranslate">MicroKernelTrait</code> 时实现了 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/DependencyInjection/Extension/ExtensionInterface.php" class="reference external" title="Symfony\Component\DependencyInjection\Extension\ExtensionInterface" rel="external noopener noreferrer" target="_blank">ExtensionInterface</a>，那么内核将被自动注册为扩展。你可以在此专门<a href="../components/dependency_injection/compilation.html#components-dependency-injection-extension" class="reference internal">管理配置的扩展</a>章节中了解更多相关信息。',
        'It is also possible to implement the EventSubscriberInterface to handle\nevents directly from the kernel, again it will be registered automatically:': '同样，也可以实现 <code translate="no" class="notranslate">EventSubscriberInterface</code> 以便直接从内核处理事件，同样它会被自动注册：',
        'Advanced Example: Twig, Annotations and the Web Debug Toolbar': '高级示例：Twig、注解和 Web 调试工具栏',
        'The purpose of the MicroKernelTrait is not to have a single-file application.\nInstead, its goal is to give you the power to choose your bundles and structure.': '<code translate="no" class="notranslate">MicroKernelTrait</code> 的目的并不是为了创建单文件应用程序。相反，它的目标是赋予你选择组件和结构的灵活性。',
        'First, you\'ll probably want to put your PHP classes in an src/ directory. Configure\nyour composer.json file to load from there:': '首先，你可能希望将 PHP 类放在 <code translate="no" class="notranslate">src/</code> 目录中。配置你的 <code translate="no" class="notranslate">composer.json</code> 文件以便从此处加载：',
        'Then, run composer dump-autoload to dump your new autoload config.': '然后，运行 <code translate="no" class="notranslate">composer dump-autoload</code> 以生成新的自动加载配置。',
        'Now, suppose you want to define a custom configuration for your app,\nuse Twig and load routes via annotations. Instead of putting everything\nin index.php, create a new src/Kernel.php to hold the kernel.\nNow it looks like this:': '现在，假设你想为你的应用定义自定义配置、使用 Twig 并通过注解加载路由。而不是将所有内容都放在 <code translate="no" class="notranslate">index.php</code> 中，可以创建一个新的 <code translate="no" class="notranslate">src/Kernel.php</code> 文件来承载内核。现在它看起来像这样：',
        'Before continuing, run this command to add support for the new dependencies:': '在继续之前，运行以下命令以添加对新依赖的支持：',
        'Next, create a new extension class that defines your app configuration and\nadd a service conditionally based on the foo value:': '接下来，创建一个新的扩展类来定义你的应用配置，并根据 <code translate="no" class="notranslate">foo</code> 的值有条件地添加一个服务：',
        'The AbstractExtension class was introduced in Symfony 6.1.': '<code translate="no" class="notranslate">AbstractExtension</code> 类是在 Symfony 6.1 中引入的。',
        'Unlike the previous kernel, this loads an external config/framework.yaml file,\nbecause the configuration started to get bigger:': '与之前的内核不同，这里加载了一个外部的 <code translate="no" class="notranslate">config/framework.yaml</code> 文件，因为配置开始变得更大了：',
        'This also loads attribute routes from an src/Controller/ directory, which\nhas one file in it:': '这也从 <code translate="no" class="notranslate">src/Controller/</code> 目录加载属性路由，该目录中有一个文件：',
        'Template files should live in the templates/ directory at the root of your project.\nThis template lives at templates/micro/random.html.twig:': '模板文件应当存储在项目根目录下的 <code translate="no" class="notranslate">templates/</code> 目录中。这个模板位于 <code translate="no" class="notranslate">templates/micro/random.html.twig</code>：',
        'Finally, you need a front controller to boot and run the application. Create a\npublic/index.php:': '最后，你需要一个前端控制器来启动并运行应用。创建一个 <code translate="no" class="notranslate">public/index.php</code> 文件：',
        'That\'s it! This /random/10 URL will work, Twig will render, and you\'ll even\nget the web debug toolbar to show up at the bottom. The final structure looks like\nthis:': '就是这样！这个 <code translate="no" class="notranslate">/random/10</code> 的 URL 将会生效，Twig 也会渲染，并且你甚至会在底部看到 Web 调试工具栏。最终的目录结构看起来像这样：',
        'As before you can use the Symfony Local Web Server:': '和之前一样，你可以使用 <a href="../setup/symfony_server.html" class="reference internal">Symfony 本地 Web 服务器</a>：',
        'Then visit the page in your browser: http://localhost:8000/random/10': '然后在浏览器中访问该页面：<a href="http://localhost:8000/random/10" class="reference external" rel="external noopener noreferrer" target="_blank">http://localhost:8000/random/10</a>',
    };

    fanyi(translates, 1);
})($);
