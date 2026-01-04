// ==UserScript==
// @name         Book for Symfony 6 翻译 6-controller.html
// @namespace    fireloong
// @version      0.0.9
// @description  创建控制器 6-controller.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/6-controller.html
// @match        https://symfony.com/doc/current/the-fast-track/en/6-controller.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501748/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%206-controllerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501748/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%206-controllerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Creating a Controller\n        \n            ': '创建控制器',
        "Our guestbook project is already live on production servers but we cheated a little bit. The project doesn't have any web pages yet. The homepage is served as a boring 404 error page. Let's fix that.": '我们的留言本项目已经在生产服务器上运行，但我们稍微作弊了一下。该项目还没有任何网页。主页被当作一个无聊的 404 错误页面。让我们来修复它。',
        'When an HTTP request comes in, like for the homepage (http://localhost:8000/), Symfony tries to find a route that matches the request path (/ here). A route is the link between the request path and a PHP callable, a function that creates the HTTP response for that request.': '当 HTTP 请求到达时，例如对主页（<code translate="no" class="notranslate">http://localhost:8000/</code>）的请求，Symfony 会尝试找到一个与请求路径（此处为<code translate="no" class="notranslate">/</code>）相匹配的路由。路由是请求路径和 PHP 可调用对象（一个用于为该请求创建 HTTP 响应的函数）之间的链接。',
        'These callables are called "controllers". In Symfony, most controllers are implemented as PHP classes. You can create such a class manually, but because we like to go fast, let\'s see how Symfony can help us.': '这些可调用对象被称为“控制器”。在 Symfony 中，大多数控制器都作为 PHP 类来实现。你可以手动创建这样的类，但因为我们希望快速进行，让我们看看 Symfony 如何帮助我们。',
        'Being Lazy with the Maker Bundle': '用“Maker Bundle”来提高效率',
        'To generate controllers effortlessly, we can use the symfony/maker-bundle package, which has been installed as part of the webapp package.': '为了毫不费力地生成控制器，我们可以使用 <code translate="no" class="notranslate">symfony/maker-bundle</code> 包，该包已作为 <code translate="no" class="notranslate">webapp</code> 包的一部分安装。',
        'The maker bundle helps you generate a lot of different classes. We will use it all the time in this book. Each "generator" is defined in a command and all commands are part of the make command namespace.': 'Maker Bundle 帮助你生成许多不同的类。在本书中，我们将一直使用它。每个“生成器”都在一个命令中定义，并且所有命令都是 <code translate="no" class="notranslate">make</code> 命令命名空间的一部分。',
        'The Symfony Console built-in list command lists all commands available under a given namespace; use it to discover all generators provided by the maker bundle:': 'Symfony Console 的内置 <code translate="no" class="notranslate">list</code> 命令可以列出给定命名空间下可用的所有命令；使用它来发现 Maker Bundle 提供的所有生成器：',
        'Choosing a Configuration Format': '选择配置格式',
        'Before creating the first controller of the project, we need to decide on the configuration formats we want to use. Symfony supports YAML, XML, PHP, and PHP attributes out of the box.': '在创建项目的第一个控制器之前，我们需要确定想要使用的配置格式。Symfony 默认支持 YAML、XML、PHP 和 PHP 注解。',
        "For configuration related to packages, YAML is the best choice. This is the format used in the config/ directory. Often, when you install a new package, that package's recipe will add a new file ending in .yaml to that directory.": '对于与包相关的配置，<em>YAML</em> 是最佳选择。这是 <code translate="no" class="notranslate">config/</code> 目录中使用的格式。通常，当你安装一个新的包时，该包的配方会将一个以 <code translate="no" class="notranslate">.yaml</code> 结尾的新文件添加到该目录中。',
        'For configuration related to PHP code, attributes are a better choice as they are defined next to the code. Let me explain with an example. When a request comes in, some configuration needs to tell Symfony that the request path should be handled by a specific controller (a PHP class). When using YAML, XML or PHP configuration formats, two files are involved (the configuration file and the PHP controller file). When using attributes, the configuration is done directly in the controller class.': '对于与 PHP 代码相关的配置，注解是一个更好的选择，因为它们是在代码旁边定义的。让我用一个例子来解释。当一个请求进来时，一些配置需要告诉 Symfony 请求路径应该由特定的控制器（一个 PHP 类）处理。当使用 YAML、XML 或 PHP 配置格式时，会涉及两个文件（配置文件和 PHP 控制器文件）。当使用注解时，配置直接在控制器类中完成。',
        "You might wonder how you can guess the package name you need to install for a feature? Most of the time, you don't need to know. In many cases, Symfony contains the package to install in its error messages. Running symfony console make:message without the messenger package for instance would have ended with an exception containing a hint about installing the right package.": '你可能会想，你如何猜测需要安装哪个包来实现某个功能？大多数情况下，你不需要知道。在很多情况下，Symfony 的错误消息中会包含需要安装的包。例如，如果你在没有安装 <code translate="no" class="notranslate">messenger</code> 包的情况下运行 <code translate="no" class="notranslate">symfony console make:message</code> 命令，将会抛出一个异常，其中会提示你安装正确的包。',
        'Generating a Controller': '生成一个控制器',
        'Create your first Controller via the make:controller command:': '通过 <code translate="no" class="notranslate">make:controller</code> 命令创建你的第一个控制器：',
        'The command creates a ConferenceController class under the src/Controller/ directory. The generated class consists of some boilerplate code ready to be fine-tuned:': '该命令在 <code translate="no" class="notranslate">src/Controller/</code> 目录下创建了一个 <code translate="no" class="notranslate">ConferenceController</code> 类。生成的类包含一些可以进行微调的样板代码：',
        "The #[Route('/conference', name: 'app_conference')] attribute is what makes the index() method a controller (the configuration is next to the code that it configures).": '<code translate="no" class="notranslate">#[Route(\'/conference\', name: \'app_conference\')]</code> 注解使 <code translate="no" class="notranslate">index()</code> 方法成为了一个控制器（配置就在它所配置的代码旁边）。',
        'When you hit /conference in a browser, the controller is executed and a response is returned.': '当你在浏览器中访问 <code translate="no" class="notranslate">/conference</code> 时，控制器会被执行并返回一个响应。',
        'Tweak the route to make it match the homepage:': '修改路由以使其匹配主页：',
        'The route name will be useful when we want to reference the homepage in the code. Instead of hard-coding the / path, we will use the route name.': '当我们在代码中想要引用主页时，路由 <code translate="no" class="notranslate">name</code> 将非常有用。我们将使用路由名称而不是硬编码的 <code translate="no" class="notranslate">/</code> 路径。',
        "Instead of the default rendered page, let's return a simple HTML one:": '让我们不返回默认的渲染页面，而是返回一个简单的 HTML 页面：',
        'Refresh the browser:': '刷新浏览器：',
        'The main responsibility of a controller is to return an HTTP Response for the request.': '控制器的主要职责是为请求返回一个 HTTP <code translate="no" class="notranslate">Response</code>。',
        "As the rest of the chapter is about code that we won't keep, let's commit our changes now:": '由于本章的其余部分是关于我们不会保留的代码，让我们现在提交我们的更改：',
        'Adding an Easter Egg': '添加一个彩蛋',
        "To demonstrate how a response can leverage information from the request, let's add a small Easter egg. Whenever the homepage contains a query string like ?hello=Fabien, let's add some text to greet the person:": '为了演示响应如何利用请求中的信息，让我们添加一个小的<a href="https://en.wikipedia.org/wiki/Easter_egg_(media)#In_computing" class="reference external" rel="external noopener noreferrer" target="_blank">彩蛋</a>。每当主页包含像 <code translate="no" class="notranslate">?hello=Fabien</code> 这样的查询字符串时，我们添加一些文本来向该人打招呼：',
        'Symfony exposes the request data through a Request object. When Symfony sees a controller argument with this type-hint, it automatically knows to pass it to you. We can use it to get the name item from the query string and add an <h1> title.': 'Symfony 通过 <code translate="no" class="notranslate">Request</code> 对象公开请求数据。当 Symfony 看到一个具有这种类型提示的控制器参数时，它会自动知道要将其传递给你。我们可以使用它来从查询字符串中获取 <code translate="no" class="notranslate">name</code> 项并添加一个 <code translate="no" class="notranslate">&lt;h1&gt;</code> 标题。',
        'Try hitting / then /?hello=Fabien in a browser to see the difference.': '在浏览器中尝试访问 <code translate="no" class="notranslate">/</code> 然后是 <code translate="no" class="notranslate">/?hello=Fabien</code>，以查看区别。',
        'Notice the call to htmlspecialchars() to avoid XSS issues. This is something that will be done automatically for us when we switch to a proper template engine.': '请注意对 <code translate="no" class="notranslate">htmlspecialchars()</code> 的调用，以避免 XSS 问题。当我们切换到适当的模板引擎时，这将自动为我们完成。',
        'We could also have made the name part of the URL:': '我们还可以将名称作为 URL 的一部分：',
        'The {name} part of the route is a dynamic route parameter - it works like a wildcard. You can now hit /hello then /hello/Fabien in a browser to get the same results as before. You can get the value of the {name} parameter by adding a controller argument with the same name. So, $name.': '路由中的 <code translate="no" class="notranslate">{name}</code> 部分是一个动态路由参数——它就像一个通配符。你现在可以在浏览器中访问 <code translate="no" class="notranslate">/hello</code> 然后是 <code translate="no" class="notranslate">/hello/Fabien</code> 以获得与之前相同的结果。你可以通过添加一个与 <em>name</em> 参数同名的控制器参数来获取 <code translate="no" class="notranslate">{name}</code> 参数的值。所以，<code translate="no" class="notranslate">$name</code>。',
        'Revert the changes we have just made:': '撤销我们刚刚所做的更改：',
        'Debugging Variables': '调试变量',
        'A great debug helper is the Symfony dump() function. It is always available and allows you to dump complex variables in a nice and interactive format.': '一个很好的调试助手是 Symfony 的 <code translate="no" class="notranslate">dump()</code> 函数。它始终可用，并允许你以美观且交互式的格式转储复杂变量。',
        'Temporarily change src/Controller/ConferenceController.php to dump the Request object:': '暂时更改 <code translate="no" class="notranslate">src/Controller/ConferenceController.php</code> 以转储 Request 对象：',
        'When refreshing the page, notice the new "target" icon in the toolbar; it lets you inspect the dump. Click on it to access a full page where navigating is made simpler:': '刷新页面时，请注意工具栏中的新“target”图标；它允许你检查转储。点击它以访问一个全页，使导航变得更简单：',
        'Going Further': '深入探索',
        'The Symfony Routing system;': 'Symfony <a href="https://symfony.com/doc/6.4/routing.html" class="reference external">路由</a>系统；',
        'SymfonyCasts Routes, Controllers & Pages tutorial;': '<a href="https://symfonycasts.com/screencast/symfony/route-controller" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 的路由、控制器和页面教程</a>；',
        'PHP attributes;': '<a href="https://www.php.net/attributes" class="reference external" rel="external noopener noreferrer" target="_blank">PHP 注解</a>；',
        'The HttpFoundation component;': '<a href="https://symfony.com/doc/6.4/components/http_foundation.html" class="reference external">HttpFoundation</a> 组件；',
        'XSS (Cross-Site Scripting) security attacks;': '<a href="https://owasp.org/www-community/attacks/xss/" class="reference external" rel="external noopener noreferrer" target="_blank">XSS（跨站脚本）</a>安全攻击；',
        'The Symfony Routing Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony4/routing_en_part1.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 路由速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Troubleshooting Problems': '故障排查',
        'Adopting a Methodology': '采用方法',
        'Setting up a Database': '设置数据库'
    };

    fanyi(translates, 2);
})($);
