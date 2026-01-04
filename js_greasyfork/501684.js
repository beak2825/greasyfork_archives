// ==UserScript==
// @name         Book for Symfony 6 翻译 5-debug.html
// @namespace    fireloong
// @version      0.0.8
// @description  故障排查 5-debug.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/5-debug.html
// @match        https://symfony.com/doc/current/the-fast-track/en/5-debug.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501684/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%205-debughtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501684/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%205-debughtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Troubleshooting Problems\n        \n            ': '故障排查',
        'Setting up a project is also about having the right tools to debug problems. Fortunately, many nice helpers are already included as part of the webapp package.': '设置项目还包括拥有调试问题的正确工具。幸运的是，许多优秀的助手已经被包含在 <code translate="no" class="notranslate">webapp</code> 包中。',
        'Discovering the Symfony Debugging Tools': '发现 Symfony 调试工具',
        'To begin with, the Symfony Profiler is a time saver when you need to find the root cause of a problem.': '首先，Symfony Profiler 会在你需要找到问题根本原因时为你节省时间。',
        'If you have a look at the homepage, you should see a toolbar at the bottom of the screen:': '如果你查看主页，你应该在屏幕底部看到一个工具栏：',
        'The first thing you might notice is the 404 in red. Remember that this page is a placeholder as we have not defined a homepage yet. Even if the default page that welcomes you is beautiful, it is still an error page. So the correct HTTP status code is 404, not 200. Thanks to the web debug toolbar, you have the information right away.': '你可能首先注意到的是红色的 <strong>404</strong>。请记住，这个页面是一个占位符，因为我们还没有定义主页。即使欢迎你的默认页面很漂亮，它仍然是一个错误页面。因此，正确的 HTTP 状态码是 404，而不是 200。感谢网页调试工具栏，你可以立即获得这些信息。',
        'If you click on the small exclamation point, you get the "real" exception message as part of the logs in the Symfony profiler. If you want to see the stack trace, click on the "Exception" link on the left menu.': '如果你点击小的感叹号，你会在 Symfony Profiler 的日志中看到“真正”的异常消息。如果你想看堆栈跟踪，点击左侧菜单中的“Exception”链接。',
        'Whenever there is an issue with your code, you will see an exception page like the following that gives you everything you need to understand the issue and where it comes from:': '每当你的代码出现问题时，你都会看到一个类似于下面的异常页面，它提供了你需要的一切来了解问题和问题的来源：',
        'Take some time to explore the information inside the Symfony profiler by clicking around.': '花点时间通过点击来探索 Symfony Profiler 中的信息。',
        'Logs are also quite useful in debugging sessions. Symfony has a convenient command to tail all the logs (from the web server, PHP, and your application):': '在调试会话中，日志也非常有用。Symfony 提供了一个方便的命令来跟踪所有日志（来自 Web 服务器、PHP 和你的应用程序）：',
        "Let's do a small experiment. Open public/index.php and break the PHP code there (add foobar in the middle of the code for instance). Refresh the page in the browser and observe the log stream:": '让我们做个小实验。打开 <code translate="no" class="notranslate">public/index.php</code> 并破坏那里的 PHP 代码（例如，在代码中间添加 foobar）。在浏览器中刷新页面并观察日志流：',
        'The output is beautifully colored to get your attention on errors.': '输出被精心着色以吸引你对错误的注意。',
        'Understanding Symfony Environments': '了解 Symfony 环境',
        'As the Symfony Profiler is only useful during development, we want to avoid it being installed in production. By default, Symfony automatically installed it only for the dev and test environments.': '由于 Symfony Profiler 仅在开发期间有用，我们希望避免在生产环境中安装它。默认情况下，Symfony 仅自动为 <code translate="no" class="notranslate">dev</code> 和 <code translate="no" class="notranslate">test</code> 环境安装它。',
        'Symfony supports the notion of environments. By default, it has built-in support for three, but you can add as many as you like: dev, prod, and test. All environments share the same code, but they represent different configurations.': 'Symfony 支持环境的概念。默认情况下，它内置了对三个环境的支持，但你可以根据需要添加任意数量的环境：<code translate="no" class="notranslate">dev</code>、<code translate="no" class="notranslate">prod</code> 和 <code translate="no" class="notranslate">test</code>。所有环境共享相同的代码，但它们代表不同的<em>配置</em>。',
        'For instance, all debugging tools are enabled in the dev environment. In the prod one, the application is optimized for performance.': '例如，在 <code translate="no" class="notranslate">dev</code> 环境中启用了所有调试工具。在 <code translate="no" class="notranslate">prod</code> 环境中，应用程序针对性能进行了优化。',
        'Switching from one environment to another can be done by changing the APP_ENV environment variable.': '通过更改 <code translate="no" class="notranslate">APP_ENV</code> 环境变量，可以从一个环境切换到另一个环境。',
        'When you deployed to Platform.sh, the environment (stored in APP_ENV) was automatically switched to prod.': '当你部署到 Platform.sh 时，环境（存储在 <code translate="no" class="notranslate">APP_ENV</code> 中）会自动切换到 <code translate="no" class="notranslate">prod</code>。',
        'Managing Environment Configurations': '管理环境配置',
        'APP_ENV can be set by using "real" environment variables in your terminal:': '可以在终端中使用“真正”的环境变量来设置 <code translate="no" class="notranslate">APP_ENV</code>：',
        'Using real environment variables is the preferred way to set values like APP_ENV on production servers. But on development machines, having to define many environment variables can be cumbersome. Instead, define them in a .env file.': '在生产服务器上，使用真实的环境变量来设置 <code translate="no" class="notranslate">APP_ENV</code> 等值是首选方式。但在开发机器上，定义许多环境变量可能会很麻烦。相反，可以在 <code translate="no" class="notranslate">.env</code> 文件中定义它们。',
        'A sensible .env file was generated automatically for you when the project was created:': '在项目创建时，会自动为你生成一个合理的 <code translate="no" class="notranslate">.env</code> 文件：',
        'Any package can add more environment variables to this file thanks to their recipe used by Symfony Flex.': '由于 Symfony Flex 使用的配方，任何包都可以向此文件添加更多环境变量。',
        "The .env file is committed to the repository and describes the default values from production. You can override these values by creating a .env.local file. This file should not be committed and that's why the .gitignore file is already ignoring it.": '<code translate="no" class="notranslate">.env</code> 文件已提交到仓库，并描述了生产中的默认值。你可以通过创建一个 <code translate="no" class="notranslate">.env.local</code> 文件来覆盖这些值。这个文件不应该被提交，这就是为什么 <code translate="no" class="notranslate">.gitignore</code> 文件已经忽略了它。',
        'Never store secret or sensitive values in these files. We will see how to manage secrets in another step.': '切勿在这些文件中存储秘密或敏感值。我们将在另一步骤中看到如何管理秘密。',
        'Configuring your IDE': '配置你的 IDE',
        "In the development environment, when an exception is thrown, Symfony displays a page with the exception message and its stack trace. When displaying a file path, it adds a link that opens the file at the right line in your favorite IDE. To benefit from this feature, you need to configure your IDE. Symfony supports many IDEs out of the box; I'm using Visual Studio Code for this project:": '在开发环境中，当抛出异常时，Symfony 会显示一个包含异常消息和堆栈跟踪的页面。在显示文件路径时，它会添加一个链接，该链接会在你最喜欢的 IDE 中打开正确行的文件。要利用此功能，你需要配置你的 IDE。Symfony 原生支持许多 IDE；我在这个项目中使用的是 Visual Studio Code：',
        'Linked files are not limited to exceptions. For instance, the controller in the web debug toolbar becomes clickable after configuring the IDE.': '链接文件不仅限于异常。例如，在配置 IDE 后，Web 调试工具栏中的控制器将变为可点击的。',
        'Debugging Production': '调试生产环境中的问题',
        "Debugging production servers is always trickier. You don't have access to the Symfony profiler for instance. Logs are less verbose. But tailing the logs is possible:": '调试生产服务器总是更加棘手。例如，你无法访问 Symfony Profiler。日志不够详细。但跟踪日志是可能的：',
        'You can even connect via SSH on the web container:': '你甚至可以通过 SSH 连接到 Web 容器：',
        "Don't worry, you cannot break anything easily. Most of the filesystem is read-only. You won't be able to do a hot fix in production. But you will learn a much better way later in the book.": '别担心，你不容易破坏任何东西。大多数文件系统是只读的。你将无法在生产中进行热修复。但稍后在本书中，你将学习一种更好的方法。',
        'Going Further': '进一步了解',
        'SymfonyCasts Environments and Config Files tutorial;': '<a href="https://symfonycasts.com/screencast/symfony-fundamentals/environment-config-files" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 环境和配置文件教程</a>；',
        'SymfonyCasts Environment Variables tutorial;': '<a href="https://symfonycasts.com/screencast/symfony-fundamentals/environment-variables" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 环境变量教程</a>；',
        'SymfonyCasts Web Debug Toolbar and Profiler tutorial;': '<a href="https://symfonycasts.com/screencast/symfony/debug-toolbar-profiler" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Web 调试工具栏和 Profiler 教程</a>；',
        'Managing multiple .env files in Symfony applications.': '在 Symfony 应用程序中<a href="https://symfony.com/doc/6.4/configuration.html#managing-multiple-env-files" class="reference external">管理多个 .env 文件</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Adopting a Methodology': '采用方法',
        'Creating a Controller': '创建控制器'
    };

    fanyi(translates, 2);
})($);
