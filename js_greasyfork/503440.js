// ==UserScript==
// @name         Book for Symfony 6 翻译 30-internals.html
// @namespace    fireloong
// @version      0.1.0
// @description  发现 Symfony 的内部机制 30-internals.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/30-internals.html
// @match        https://symfony.com/doc/current/the-fast-track/en/30-internals.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503440/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2030-internalshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503440/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2030-internalshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Discovering Symfony Internals\n        \n            ': '发现 Symfony 的内部机制',
        'We have been using Symfony to develop a powerful application for quite a while now, but most of the code executed by the application comes from Symfony. A few hundred lines of code versus thousands of lines of code.': '我们一直在使用 Symfony 开发一个功能强大的应用程序，但应用程序执行的大部分代码都来自 Symfony。几百行代码与几千行代码相比。',
        'I like to understand how things work behind the scenes. And I have always been fascinated by tools that help me understand how things work. The first time I used a step by step debugger or the first time I discovered ptrace are magical memories.': '我喜欢了解幕后的事情是如何运作的。我一直对能帮我了解事物运作原理的工具着迷。我第一次使用逐步调试器，或者第一次发现 <code translate="no" class="notranslate">ptrace</code> 时，都是美妙的记忆。',
        'Would you like to better understand how Symfony works? Time to dig into how Symfony makes your application tick. Instead of describing how Symfony handles an HTTP request from a theoretical perspective, which would be quite boring, we are going to use Blackfire to get some visual representations and use it to discover some more advanced topics.': '你想更好地了解 Symfony 是如何工作的吗？是时候深入了解 Symfony 是如何使你的应用程序运作的了。与其从理论的角度描述 Symfony 如何处理 HTTP 请求（这会很无聊），我们将使用 Blackfire 来获得一些视觉表示，并使用它来发现一些更高级的主题。',
        'Understanding Symfony Internals with Blackfire': '使用 Blackfire 理解 Symfony 的内部机制',
        'You already know that all HTTP requests are served by a single entry point: the public/index.php file. But what happens next? How controllers are called?': '你已经知道所有的 HTTP 请求都是由一个单一的入口点服务的：即 <code translate="no" class="notranslate">public/index.php</code> 文件。但接下来发生了什么？控制器是如何被调用的？',
        'Let\'s profile the English homepage in production with Blackfire via the Blackfire browser extension:': '让我们通过 Blackfire 浏览器扩展在生产环境中对英文主页进行性能分析：',
        'Or directly via the command line:': '或者直接通过命令行：',
        'Go to the "Timeline" view of the profile, you should see something similar to the following:': '转到性能分析的“时间线”视图，你应该会看到类似于以下内容的东西：',
        'From the timeline, hover on the colored bars to have more information about each call; you will learn a lot about how Symfony works:': '在时间线上，将鼠标悬停在彩色条上以获得有关每次调用的更多信息；你将学到很多关于 Symfony 是如何工作的：',
        'The main entry point is public/index.php;': '主要的入口点是 <code translate="no" class="notranslate">public/index.php</code>；',
        'The Kernel::handle() method handles the request;': '<code translate="no" class="notranslate">Kernel::handle()</code> 方法处理请求；',
        'It calls the HttpKernel that dispatches some events;': '它调用 <code translate="no" class="notranslate">HttpKernel</code> 来分发一些事件；',
        'The first event is RequestEvent;': '第一个事件是 <code translate="no" class="notranslate">RequestEvent</code>；',
        'The ControllerResolver::getController() method is called to determine which controller should be called for the incoming URL;': '调用 <code translate="no" class="notranslate">ControllerResolver::getController()</code> 方法来确定对于传入的 URL 应该调用哪个控制器；',
        'The ControllerResolver::getArguments() method is called to determine which arguments to pass to the controller (the param converter is called);': '调用 <code translate="no" class="notranslate">ControllerResolver::getArguments()</code> 方法来确定要传递给控制器的哪些参数（调用参数转换器）；',
        'The ConferenceController::index() method is called and most of our code is executed by this call;': '调用 <code translate="no" class="notranslate">ConferenceController::index()</code> 方法，并且我们的大部分代码都是通过这个调用执行的；',
        'The ConferenceRepository::findAll() method gets all conferences from the database (notice the connection to the database via PDO::__construct());': '<code translate="no" class="notranslate">ConferenceRepository::findAll()</code> 方法从数据库中获取所有会议（注意通过 <code translate="no" class="notranslate">PDO::__construct()</code> 与数据库的连接）；',
        'The Twig\\Environment::render() method renders the template;': '<code translate="no" class="notranslate">Twig\\Environment::render()</code> 方法渲染模板；',
        'The ResponseEvent and the FinishRequestEvent are dispatched, but it looks like no listeners are actually registered as they seem to be really fast to execute.': '分发 <code translate="no" class="notranslate">ResponseEvent</code> 和  <code translate="no" class="notranslate">FinishRequestEvent</code>，但看起来实际上没有注册任何监听器，因为它们似乎执行得非常快。',
        'The timeline is a great way to understand how some code works; which is very useful when you get a project developed by someone else.': '时间线是一种很好的理解某些代码工作原理的方式；这对于你接手别人的项目时非常有用。',
        'Now, profile the same page from the local machine in the development environment:': '现在，在开发环境中从本地机器对同一页面进行性能分析：',
        'Open the profile. You should be redirected to the call graph view as the request was really quick and the timeline would be quite empty:': '打开性能分析。你应该被重定向到调用图视图，因为请求非常快，所以时间线将非常空：',
        'Do you understand what\'s going on? The HTTP cache is enabled and as such, we are profiling the Symfony HTTP cache layer. As the page is in the cache, HttpCache\\Store::restoreResponse() is getting the HTTP response from its cache and the controller is never called.': '你明白发生了什么吗？HTTP 缓存已启用，因此，我们正在对 Symfony HTTP 缓存层进行性能分析。由于页面在缓存中，<code translate="no" class="notranslate">HttpCache\\Store::restoreResponse()</code> 正在从其缓存中获取 HTTP 响应，并且从未调用过控制器。',
        'Disable the cache layer in public/index.php as we did in the previous step and try again. You can immediately see that the profile looks very different:': '在 <code translate="no" class="notranslate">public/index.php</code> 中禁用缓存层（如我们在上一步中所做的），然后再次尝试。你可以立即看到，性能分析看起来非常不同：',
        'The main differences are the following:': '主要区别如下：',
        'The TerminateEvent, which was not visible in production, takes a large percentage of the execution time; looking closer, you can see that this is the event responsible for storing the Symfony profiler data gathered during the request;': '在生产环境中不可见的 <code translate="no" class="notranslate">TerminateEvent</code> 占据了大量执行时间；仔细观察，你可以看到这个事件负责存储请求期间收集的 Symfony 分析器数据；',
        'Under the ConferenceController::index() call, notice the SubRequestHandler::handle() method that renders the ESI (that\'s why we have two calls to Profiler::saveProfile(), one for the main request and one for the ESI).': '在 <code translate="no" class="notranslate">ConferenceController::index()</code> 调用下，请注意 <code translate="no" class="notranslate">SubRequestHandler::handle()</code> 方法，它渲染了 ESI（这就是为什么我们有两个 <code translate="no" class="notranslate">Profiler::saveProfile()</code> 调用，一个用于主请求，一个用于 ESI）。',
        'Explore the timeline to learn more; switch to the call graph view to have a different representation of the same data.': '探索时间线以了解更多信息；切换到调用图视图以获得相同数据的不同表示。',
        'As we have just discovered, the code executed in development and production is quite different. The development environment is slower as the Symfony profiler tries to gather many data to ease debugging problems. This is why you should always profile with the production environment, even locally.': '正如我们刚才发现的那样，开发和生产环境中执行的代码有很大不同。开发环境更慢，因为 Symfony 分析器试图收集许多数据以简化调试问题。这就是为什么你应该始终使用生产环境进行性能分析，即使是在本地也是如此。',
        'Some interesting experiments: profile an error page, profile the / page (which is a redirect), or an API resource. Each profile will tell you a bit more about how Symfony works, which class/methods are called, what is expensive to run and what is cheap.': '一些有趣的实验：对错误页面进行性能分析，对 <code translate="no" class="notranslate">/</code> 页面（这是一个重定向）或 API 资源进行性能分析。每个性能分析都会告诉你更多关于 Symfony 如何工作的信息，哪些类/方法被调用，哪些运行成本高，哪些成本低。',
        'Using the Blackfire Debug Addon': '使用 Blackfire 调试插件',
        'By default, Blackfire removes all method calls that are not significant enough to avoid having big payloads and big graphs. When using Blackfire as a debugging tool, it is better to keep all calls. This is provided by the debug addon.': '默认情况下，Blackfire 会移除所有不够重要的方法调用，以避免出现大的有效载荷和大的图形。当将 Blackfire 用作调试工具时，最好保留所有调用。这是由调试插件提供的。',
        'From the command line, use the --debug flag:': '从命令行，使用 <code translate="no" class="notranslate">--debug</code> 标志：',
        'In production, you would see for instance the loading of a file named .env.local.php:': '在生产环境中，你会看到例如名为 <code translate="no" class="notranslate">.env.local.php</code> 文件的加载：',
        'Where does it come from? Platform.sh does some optimizations when deploying a Symfony application like optimizing the Composer autoloader (--optimize-autoloader --apcu-autoloader --classmap-authoritative). It also optimizes environment variables defined in the .env file (to avoid parsing the file for every request) by generating the .env.local.php file:': '它来自哪里？Platform.sh 在部署 Symfony 应用程序时会进行一些优化，如优化 Composer 自动加载器（<code translate="no" class="notranslate">--optimize-autoloader --apcu-autoloader --classmap-authoritative</code>）。它还通过生成 <code translate="no" class="notranslate">.env.local.php</code> 文件来优化 <code translate="no" class="notranslate">.env</code> 文件中定义的环境变量（以避免为每个请求解析文件）：',
        'Blackfire is a very powerful tool that helps understand how code is executed by PHP. Improving performance is just one way to use a profiler.': 'Blackfire 是一个非常强大的工具，有助于了解 PHP 如何执行代码。提高性能只是使用分析器的一种方法。',
        'Using a Step Debugger with Xdebug': '使用 Xdebug 的逐步调试器',
        'Blackfire timelines and call graphs allow developers to visualize which files/functions/methods are executed by the PHP engine to better understand the project\'s code base.': 'Blackfire 的时间线和调用图允许开发人员可视化 PHP 引擎执行了哪些文件/函数/方法，以更好地了解项目的代码库。',
        'Another way to follow code execution is to use a step debugger like Xdebug. A step debugger allows developers to interactively walk through a PHP project code to debug control flow and examine data structures. It is very useful to debug unexpected behaviors and it replaces the common "var_dump()/exit()" debugging technique.': '跟踪代码执行的另一种方法是使用像 <a href="https://xdebug.org" class="reference external" rel="external noopener noreferrer" target="_blank">Xdebug</a> 这样的逐步调试器。逐步调试器允许开发人员交互地遍历 PHP 项目代码，以调试控制流并检查数据结构。它对于调试意外行为非常有用，并且取代了常见的“var_dump()/exit()”调试技术。',
        'First, install the xdebug PHP extension. Check that it is installed by running the following command:': '首先，安装 <code translate="no" class="notranslate">xdebug</code> PHP 扩展。通过运行以下命令来检查它是否已安装：',
        'You should see Xdebug in the output:': '你应该在输出中看到 Xdebug：',
        'You can also check that Xdebug is enabled for PHP-FPM by going in the browser and clicking on the "View phpinfo()" link when hovering on the Symfony logo of the web debug toolbar:': '你还可以通过在浏览器中访问并在 Web 调试工具栏的 Symfony 徽标上悬停时点击“View phpinfo()”链接来检查 Xdebug 是否为 PHP-FPM 启用：',
        'Now, enable the debug mode of Xdebug:': '现在，启用 Xdebug 的调试模式：',
        'By default, Xdebug sends data to port 9003 of the local host.': '默认情况下，Xdebug 将数据发送到本地主机的 9003 端口。',
        'Triggering Xdebug can be done in many ways, but the easiest is to use Xdebug from your IDE. In this chapter, we will use Visual Studio Code to demonstrate how it works. Install the PHP Debug extension by launching the "Quick Open" feature (Ctrl+P), paste the following command, and press enter:': '触发 Xdebug 可以通过多种方式完成，但最简单的是从 IDE 中使用 Xdebug。在本章中，我们将使用 Visual Studio Code 来演示它是如何工作的。通过启动“快速打开”功能（<code translate="no" class="notranslate">Ctrl+P</code>），粘贴以下命令并按Enter键来安装 <a href="https://marketplace.visualstudio.com/items?itemName=felixfbecker.php-debug" class="reference external" rel="external noopener noreferrer" target="_blank">PHP Debug</a> 扩展：',
        'Create the following configuration file:': '创建以下配置文件：',
        'From Visual Studio Code and while being in your project directory, go to the debugger and click on the green play button labelled "Listen for Xdebug":': '从 Visual Studio Code 中，并在你的项目目录中，转到调试器并点击标有“监听 Xdebug”的绿色播放按钮：',
        'If you go to the browser and refresh, the IDE should automatically take the focus, meaning that the debugging session is ready. By default, everything is a breakpoint, so execution stops at the first instruction. It\'s then up to you to inspect the current variables, step over the code, step into the code, ...': '如果你转到浏览器并刷新，IDE 应该会自动获得焦点，这意味着调试会话已准备好。默认情况下，所有内容都是一个断点，因此执行会在第一条指令处停止。然后，你可以检查当前变量，逐步执行代码，逐步进入代码，...',
        'When debugging, you can uncheck the "Everything" breakpoint and explicitly set breakpoints in your code.': '在调试时，你可以取消选中“全部”断点，并在你的代码中明确设置断点。',
        'If you are new to step debuggers, read the excellent tutorial for Visual Studio Code, which explains everything visually.': '如果你对逐步调试器不熟悉，请阅读 <a href="https://code.visualstudio.com/Docs/editor/debugging" class="reference external" rel="external noopener noreferrer" target="_blank">Visual Studio Code 的优秀教程</a>，该教程以视觉方式解释了所有内容。',
        'Going Further': '深入探索',
        'The Xdebug Step Debugging docs;': '<a href="https://xdebug.org/docs/step_debug" class="reference external" rel="external noopener noreferrer" target="_blank">Xdebug 逐步调试文档</a>；',
        'Debugging with Visual Studio Code.': '<a href="https://code.visualstudio.com/Docs/editor/debugging" class="reference external" rel="external noopener noreferrer" target="_blank">使用 Visual Studio Code 进行调试</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Managing Performance': '管理性能',
        'Using Redis to Store Sessions': '使用 Redis 存储会话'
    };

    fanyi(translates, 2);
})($);
