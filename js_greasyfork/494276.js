// ==UserScript==
// @name         Symfony 翻译文档 page_creation.html
// @namespace    fireloong
// @version      0.1.6
// @description  翻译文档 page_creation.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/page_creation.html
// @match        https://symfony.com/doc/6.4/page_creation.html
// @match        https://symfony.com/doc/7.1/page_creation.html
// @match        https://symfony.com/doc/7.2/page_creation.html
// @match        https://symfony.com/doc/current/page_creation.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494276/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20page_creationhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/494276/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20page_creationhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Create your First Page in Symfony\n        \n            ': '在 Symfony 中创建你的第一个页面',
        'Creating a Page: Route and Controller': '创建页面：路由和控制器',
        'The bin/console Command': 'bin/console 命令',
        'The Web Debug Toolbar: Debugging Dream': 'Web调试工具栏：调试梦想',
        'Rendering a Template': '渲染模板',
        'Checking out the Project Structure': '检查项目结构',
        'What\'s Next?': '下一步是什么？',
        'Go Deeper with HTTP & Framework Fundamentals': '深入了解 HTTP 和框架基础知识',
        "Creating a new page - whether it's an HTML page or a JSON endpoint - is a\ntwo-step process:": '创建一个新页面——无论是 HTML 页面还是 JSON 端点——都需要两个步骤：',
        'Create a controller: A controller is the PHP function you write that\nbuilds the page. You take the incoming request information and use it to\ncreate a Symfony Response object, which can hold HTML content, a JSON\nstring or even a binary file like an image or PDF;': '<strong>创建控制器</strong>：控制器是您编写的用于构建页面的 PHP 函数。获取传入的请求信息并使用它来创建一个 Symfony <code translate="no" class="notranslate">Response</code> 对象，该对象可以保存 HTML 内容、JSON 字符串甚至二进制文件(如图像或PDF)；',
        'Create a route: A route is the URL (e.g. /about) to your page and\npoints to a controller.': '<strong>创建路由</strong>：路由是指向你的页面并指向控制器的URL(例如 <code translate="no" class="notranslate">/about</code>)。',
        'Do you prefer video tutorials? Check out the Harmonious Development with Symfony\nscreencast series.': '你喜欢视频教程吗？看看 <a href="https://symfonycasts.com/screencast/symfony/setup" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 的和谐发展</a>系列视频。',
        'Symfony embraces the HTTP Request-Response lifecycle. To find out more,\nsee Symfony and HTTP Fundamentals.': 'Symfony 支持 HTTP 请求-响应生命周期。要了解更多信息，请参阅 <a href="introduction/http_fundamentals.html" class="reference internal">Symfony 和 HTTP 基础知识</a>。',
        "Before continuing, make sure you've read the Setup\narticle and can access your new Symfony app in the browser.": '在继续之前，请确保您已经阅读了<a href="setup.html" class="reference internal">安装</a>文章，并且可以在浏览器中访问新的 Symfony 应用程序。',
        'Suppose you want to create a page - /lucky/number - that generates a lucky (well,\nrandom) number and prints it. To do that, create a "Controller" class and a\n"controller" method inside of it:': '假设您想创建一个页面——<code translate="no" class="notranslate">/lucky/number</code>——它生成一个幸运(当然是随机的)数字并打印出来。为此，创建一个“Controller”类并在其中创建一个“Controller”方法：',
        'Now you need to associate this controller function with a public URL (e.g. /lucky/number)\nso that the number() method is called when a user browses to it. This association\nis defined with the #[Route] attribute (in PHP, attributes are used to add\nmetadata to code):': '现在你需要将这个控制器函数与一个公共 URL (例如 <code translate="no" class="notranslate">/lucky/number</code>)关联起来，这样当用户浏览到它时，<code translate="no" class="notranslate">number()</code> 方法就会被调用。这种关联是用 <code translate="no" class="notranslate">#[Route]</code> 注解定义的(在 PHP 中，<a href="https://www.php.net/manual/zh/language.attributes.overview.php" class="reference external" rel="external noopener noreferrer" target="_blank">注解</a>用于向代码中添加元数据)：',
        "That's it! If you are using the Symfony web server,\ntry it out by going to: http://localhost:8000/lucky/number": '就是这样！如果您正在使用 <a href="setup/symfony_server.html" class="reference internal">Symfony web 服务器</a>，请访问：<a href="http://localhost:8000/lucky/number" class="reference external" rel="external noopener noreferrer" target="_blank">http://localhost:8000/lucky/number</a> 进行尝试',
        'Symfony recommends defining routes as attributes to have the controller code\nand its route configuration at the same location. However, if you prefer, you can\ndefine routes in separate files using YAML, XML and PHP formats.': 'Symfony 建议将路由定义为注解，以使控制器代码及其路由配置位于相同的位置。不过，如果你愿意，你也可以使用 YAML、XML 和 PHP 格式<a href="routing.html" class="reference internal">在单独的文件中定义路由</a>。',
        'If you see a lucky number being printed back to you, congratulations! But before\nyou run off to play the lottery, check out how this works. Remember the two steps\nto create a page?': '如果你看到一个幸运数字打印回给你，恭喜你！但在你跑去玩彩票之前，看看它是如何工作的。还记得创建页面的两个步骤吗？',
        "Create a controller and a method: This is a function where you build the page and ultimately\nreturn a Response object. You'll learn more about controllers\nin their own section, including how to return JSON responses;": '<em>创建一个控制器和一个方法</em>：这是一个用于构建页面并最终返回 <code translate="no" class="notranslate">Response</code> 对象的函数。你将在它们各自的章节中学习更多关于<a href="controller.html" class="reference internal">控制器</a>的知识，包括如何返回 JSON 响应；',
        "Create a route: In config/routes.yaml, the route defines the URL to your\npage (path) and what controller to call. You'll learn more about routing\nin its own section, including how to make variable URLs.": '<em>创建路由</em>：在 <code translate="no" class="notranslate">config/routes.yaml</code> 文件中，路由定义了到页面的 URL (<code translate="no" class="notranslate">path</code>)和要调用的 <code translate="no" class="notranslate">controller</code>。您将在本节中了解更多关于<a href="routing.html" class="reference internal">路由</a>的知识，包括如何创建<em>可变</em> URL。',
        'Your project already has a powerful debugging tool inside: the bin/console command.\nTry running it:': '您的项目内部已经有一个强大的调试工具：<code translate="no" class="notranslate">bin/console</code> 命令。试着运行它：',
        "You should see a list of commands that can give you debugging information, help generate\ncode, generate database migrations and a lot more. As you install more packages,\nyou'll see more commands.": '您应该看到一个命令列表，这些命令可以为您提供调试信息、帮助生成代码、生成数据库迁移等等。随着安装更多的包，您将看到更多的命令。',
        'To get a list of all of the routes in your system, use the debug:router command:': '要获取系统中所有路由的列表，使用 <code translate="no" class="notranslate">debug:router</code> 命令：',
        'You should see your app_lucky_number route in the list:': '你应该在列表中看到你的 <code translate="no" class="notranslate">app_lucky_number</code> 路由：',
        'You will also see debugging routes besides app_lucky_number -- more on\nthe debugging routes in the next section.': '除了 <code translate="no" class="notranslate">app_lucky_number</code> 之外，您还将看到调试路由——下一节将详细介绍调试路由。',
        "You'll learn about many more commands as you continue!": '在继续学习的过程中，您将了解更多的命令!',
        'If your shell is supported, you can also set up console completion support.\nThis autocompletes commands and other input when using bin/console.\nSee the Console document for more\ninformation on how to set up completion.': '如果支持您的shell，您还可以设置控制台完成支持。当使用 <code translate="no" class="notranslate">bin/console</code> 时，它会自动完成命令和其他输入。有关如何设置完成的更多信息，请参阅<a href="console.html#console-completion-setup" class="reference internal">控制台文档</a>。',
        "One of Symfony's amazing features is the Web Debug Toolbar: a bar that displays\na huge amount of debugging information along the bottom of your page while\ndeveloping. This is all included out of the box using a Symfony pack\ncalled symfony/profiler-pack.": 'Symfony 令人惊叹的功能之一是 Web 调试工具栏：在开发过程中，沿着页面底部显示大量调试信息的工具栏。这些都是使用名为 <code translate="no" class="notranslate">symfony/profiler-pack</code> 的 <a href="setup.html#symfony-packs" class="reference internal">Symfony 包</a> 提供的。',
        "You will see a dark bar along the bottom of the page. You'll learn more about\nall the information it holds along the way, but feel free to experiment: hover\nover and click the different icons to get information about routing,\nperformance, logging and more.": '你会在页面底部看到一个黑色的条。您将在此过程中了解更多关于它所包含的所有信息，但您可以随意尝试：将鼠标悬停在不同的图标上并单击不同的图标以获取有关路由、性能、日志记录等的信息。',
        "If you're returning HTML from your controller, you'll probably want to render\na template. Fortunately, Symfony comes with Twig: a templating language that's\nminimal, powerful and actually quite fun.": '如果要从控制器返回 HTML，则可能需要呈现一个模板。幸运的是，Symfony 附带了 <a href="https://twig.symfony.com" class="reference external">Twig</a>：这是一种最小、功能强大且实际上非常有趣的模板语言。',
        'Install the twig package with:': '使用以下命令安装 twig 包：',
        "Make sure that LuckyController extends Symfony's base\nAbstractController class:": '确保 <code translate="no" class="notranslate">LuckyController</code> 扩展了 Symfony 的基类 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController" rel="external noopener noreferrer" target="_blank">AbstractController</a>：',
        'Now, use the handy render() method to render a template. Pass it a number\nvariable so you can use it in Twig:': '现在，使用方便的 <code translate="no" class="notranslate">render()</code> 方法来渲染模板。传递给它一个 <code translate="no" class="notranslate">number</code> 变量，这样你就可以在 Twig 中使用它：',
        'Template files live in the templates/ directory, which was created for you automatically\nwhen you installed Twig. Create a new templates/lucky directory with a new\nnumber.html.twig file inside:': '模板文件位于 <code translate="no" class="notranslate">templates/</code> 目录中，该目录是在安装 Twig 时自动为您创建的。创建一个新的 <code translate="no" class="notranslate">templates/lucky</code> 目录，其中包含一个新的 <code translate="no" class="notranslate">number.html.twig</code> 文件：',
        'The {{ number }} syntax is used to print variables in Twig. Refresh your browser\nto get your new lucky number!': '<code translate="no" class="notranslate">{{ number }}</code> 语法用于在 Twig 中打印变量。刷新浏览器获取新的幸运号码！',
        "Now you may wonder where the Web Debug Toolbar has gone: that's because there is\nno </body> tag in the current template. You can add the body element yourself,\nor extend base.html.twig, which contains all default HTML elements.": '现在您可能想知道 Web 调试工具栏到哪里去了：这是因为在当前模板中没有 <code translate="no" class="notranslate">&lt;/body&gt;</code> 标记。您可以自己添加 body 元素，或者扩展 <code translate="no" class="notranslate">base.html.twig</code>。它包含所有默认的 HTML 元素。',
        "In the templates article, you'll learn all about Twig: how\nto loop, render other templates and leverage its powerful layout inheritance system.": '在<a href="templates.html" class="reference internal">模板</a>文章中，您将了解有关 Twig 的所有内容：如何循环、渲染其它模板并利用其强大的布局继承系统。',
        "Great news! You've already worked inside the most important directories in your\nproject:": '好消息！你已经在项目中最重要的目录中工作过了：',
        '\n                            Contains... configuration!. You will configure routes,\nservices and packages.\n                    ': '包含…配置！您将配置路由、服务和包。',
        '\n                            All your PHP code lives here.\n                    ': '所有的 PHP 代码都在这里。',
        '\n                            All your Twig templates live here.\n                    ': '所有的 Twig 模板都在这里。',
        "Most of the time, you'll be working in src/, templates/ or config/.\nAs you keep reading, you'll learn what can be done inside each of these.": '大多数情况下，您将在 <code translate="no" class="notranslate">src/</code>、<code translate="no" class="notranslate">templates/</code> 或 <code translate="no" class="notranslate">config/</code> 中工作。当你继续阅读时，你会了解到在每一个里面可以做什么。',
        'So what about the other directories in the project?': '那么项目中的其它目录呢？',
        '\n                            The famous bin/console file lives here (and other, less important\nexecutable files).\n                    ': '著名的 <code translate="no" class="notranslate">bin/console</code> 文件位于此处(以及其它不太重要的可执行文件)。',
        '\n                            This is where automatically-created files are stored, like cache files\n(var/cache/) and logs (var/log/).\n                    ': '这是自动创建的文件存储的地方，比如缓存文件(<code translate="no" class="notranslate">var/cache/</code>)和日志(<code translate="no" class="notranslate">var/log/</code>)。',
        '\n                            Third-party (i.e. "vendor") libraries live here! These are downloaded via the Composer\npackage manager.\n                    ': '第三方(即“供应商”)库就在这里！这些是通过 <a href="https://getcomposer.org" class="reference external" rel="external noopener noreferrer" target="_blank">Composer</a> 包管理器下载的。',
        '\n                            This is the document root for your project: you put any publicly accessible files\nhere.\n                    ': '这是项目的文档根目录：您可以将任何可公开访问的文件放在这里。',
        'And when you install new packages, new directories will be created automatically\nwhen needed.': '当您安装新包时，将根据需要自动创建新目录。',
        "Congrats! You're already starting to master Symfony and learn a whole new\nway of building beautiful, functional, fast and maintainable applications.": '恭喜！您已经开始掌握 Symfony，并学习了一种全新的方式来构建美观、功能强大、快速且可维护的应用程序。',
        'OK, time to finish mastering the fundamentals by reading these articles:': '好了，是时候通过阅读这些文章来掌握基础知识了：',
        'Routing': '<a href="routing.html" class="reference internal">路由</a>',
        'Controller': '<a href="controller.html" class="reference internal">控制器</a>',
        'Creating and Using Templates': '<a href="templates.html" class="reference internal">创建和使用模板</a>',
        'Front-end Tools: Handling CSS & JavaScript': '<a href="frontend.html" class="reference internal">前端工具：处理 CSS 和 JavaScript</a>',
        'Configuring Symfony': '<a href="configuration.html" class="reference internal">配置 Symfony</a>',
        'Then, learn about other important topics like the\nservice container,\nthe form system, using Doctrine\n(if you need to query a database) and more!': '然后，学习其它重要的主题，如<a href="service_container.html" class="reference internal">服务容器</a>、<a href="forms.html" class="reference internal">表单系统</a>、使用 <a href="doctrine.html" class="reference internal">Doctrine</a>(如果您需要查询数据库)等等！',
        'Have fun!': '玩得开心！',
        'Symfony versus Flat PHP': '<a href="introduction/from_flat_php_to_symfony.html">Symfony 与原生 PHP 的对比</a>',
        'Symfony and HTTP Fundamentals': '<a href="introduction/http_fundamentals.html">Symfony 和 HTTP 基础知识</a>'
    };

    fanyi(translates, 1);
})($);
