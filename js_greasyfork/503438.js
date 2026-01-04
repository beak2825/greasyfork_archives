// ==UserScript==
// @name         Book for Symfony 6 翻译 29-performance.html
// @namespace    fireloong
// @version      0.1.0
// @description  管理性能 29-performance.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/29-performance.html
// @match        https://symfony.com/doc/current/the-fast-track/en/29-performance.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503438/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2029-performancehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503438/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2029-performancehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Managing Performance\n        \n            ': '管理性能',
        'Premature optimization is the root of all evil.': '过早的优化是万恶之源。',
        'Maybe you have already read this quotation before. But I like to cite it in full:': '也许你以前已经读过这段话。但我喜欢全文引用它：',
        'We should forget about small efficiencies, say about 97% of the time: premature optimization is the root of all evil. Yet we should not pass up our opportunities in that critical 3%.': '我们应该忘掉 97% 的微小优化：过早的优化是万恶之源。然而，我们也不应该放过那关键的 3% 的机会。',
        'Even small performance improvements can make a difference, especially for e-commerce websites. Now that the guestbook application is ready for prime time, let\'s see how we can check its performance.': '即使是微小的性能改进也能产生影响，尤其是对于电子商务网站。既然 Guestbook 应用程序已经准备就绪，让我们来看看如何检查其性能。',
        'The best way to find performance optimizations is to use a profiler. The most popular option nowadays is Blackfire (full disclaimer: I am also the founder of the Blackfire project).': '寻找性能优化的最佳方法是使用性能分析器。现在最受欢迎的选择是 <a href="https://blackfire.io" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire</a>（<em>免责声明</em>：我也是 Blackfire 项目的创始人）。',
        'Introducing Blackfire': '介绍 Blackfire',
        'Blackfire is made of several parts:': 'Blackfire由几个部分组成：',
        'A client that triggers profiles (the Blackfire CLI tool or a browser extension for Google Chrome or Firefox);': '一个触发分析文件的客户端（Blackfire CLI 工具或适用于 Google Chrome 或 Firefox 的浏览器扩展）；',
        'An agent that prepares and aggregates data before sending them to blackfire.io for display;': '一个代理，它在将数据发送到 blackfire.io 进行显示之前对数据进行准备和聚合；',
        'A PHP extension (the probe) that instruments the PHP code.': '一个 PHP 扩展（探针），用于对 PHP 代码进行检测。',
        'To work with Blackfire, you first need to sign up.': '要使用 Blackfire，您首先需要<a href="https://blackfire.io/signup" class="reference external" rel="external noopener noreferrer" target="_blank">注册</a>',
        'Install Blackfire on your local machine by running the following quick installation script:': '通过在本地机器上运行以下快速安装脚本来安装 Blackfire：',
        'This installer downloads and installs the Blackfire CLI Tool.': '此安装程序将下载并安装 Blackfire CLI 工具。',
        'When done, install the PHP probe on all available PHP versions:': '完成后，在所有可用的 PHP 版本上安装 PHP 探针：',
        'And enable the PHP probe for our project:': '并为我们的项目启用 PHP 探针：',
        'Restart the web server so that PHP can load Blackfire:': '重启 Web 服务器，以便 PHP 可以加载 Blackfire：',
        'The Blackfire CLI Tool needs to be configured with your personal client credentials (to store your project profiles under your personal account). Find them at the top of the Settings/Credentials page and execute the following command by replacing the placeholders:': 'Blackfire CLI 工具需要使用您的个人客户端凭据进行配置（以便将您的项目分析文件存储在您的个人帐户下）。在 <code translate="no" class="notranslate">Settings/Credentials</code> <a href="https://blackfire.io/my/settings/credentials" class="reference external" rel="external noopener noreferrer" target="_blank">页面</a>的顶部找到它们，并通过替换占位符来执行以下命令：',
        'Setting Up the Blackfire Agent on Docker': '在 Docker 上设置 Blackfire 代理',
        'The Blackfire agent service has already been configured in the Docker Compose stack:': 'Blackfire 代理服务已在 Docker Compose 堆栈中配置完毕：',
        'To communicate with the server, you need to get your personal server credentials (these credentials identify where you want to store the profiles -- you can create one per project); they can be found at the bottom of the Settings/Credentials page. Store them as secrets:': '要与服务器通信，您需要获取个人服务器凭据（这些凭据用于标识您希望存储分析文件的位置 - 您可以为每个项目创建一个）；它们可以在 <code translate="no" class="notranslate">Settings/Credentials</code> <a href="https://blackfire.io/my/settings/credentials" class="reference external" rel="external noopener noreferrer" target="_blank">页面</a>的底部找到。将它们存储为机密：',
        'You can now launch the new container:': '现在，您可以启动新的容器：',
        'Fixing a non-working Blackfire Installation': '修复无法工作的 Blackfire 安装',
        'If you get an error while profiling, increase the Blackfire log level to get more information in the logs:': '如果在分析时遇到错误，请提高 Blackfire 的日志级别以获取更多日志信息：',
        'Restart the web server:': '重启 Web 服务器：',
        'And tail the logs:': '并跟踪日志：',
        'Profile again and check the log output.': '再次分析并检查日志输出。',
        'Configuring Blackfire in Production': '在生产环境中配置 Blackfire',
        'Blackfire is included by default in all Platform.sh projects.': 'Blackfire 默认包含在所有 Platform.sh 项目中。',
        'Set up the server credentials as production secrets:': '将服务器凭据设置为生产密钥：',
        'The PHP probe is already enabled as any other needed PHP extension:': 'PHP 探针已启用，如同其它必要的 PHP 扩展一样：',
        'Configuring Varnish for Blackfire': '为 Blackfire 配置 Varnish',
        'Before you can deploy to start profiling, you need a way to bypass the Varnish HTTP cache. If not, Blackfire will never hit the PHP application. You are going to authorize the bypass of Varnish only for profiling requests coming from your local machine.': '在部署并开始分析之前，您需要一种方法来绕过 Varnish HTTP 缓存。如果不这样做，Blackfire 将永远不会命中 PHP 应用程序。您将仅授权绕过 Varnish 以进行来自您本地机器的分析请求。',
        'Find your current IP address:': '找到您当前的 IP 地址：',
        'And use it to configure Varnish:': '并使用它来配置 Varnish：',
        'You can now deploy.': '现在您可以部署了。',
        'Profiling Web Pages': '分析网页',
        'You can profile traditional web pages from Firefox or Google Chrome via their dedicated extensions.': '您可以通过 Firefox 或 Google Chrome 的<a href="https://blackfire.io/docs/integrations/browsers/index" class="reference external" rel="external noopener noreferrer" target="_blank">专用扩展</a>程序来分析传统的网页。',
        'On your local machine, don\'t forget to disable the HTTP cache in config/packages/framework.yaml when profiling: if not, you will profile the Symfony HTTP cache layer instead of your own code.': '在您的本地计算机上，进行分析时，请不要忘记在 <code translate="no" class="notranslate">config/packages/framework.yaml</code> 中禁用 HTTP 缓存：如果不这样做，您将分析 Symfony HTTP 缓存层而不是您自己的代码。',
        'To get a better picture of the performance of your application in production, you should also profile the "production" environment. By default, your local environment is using the "development" environment, which adds a significant overhead (mainly to gather data for the web debug toolbar and the Symfony profiler).': '为了更清楚地了解您的应用在生产环境中的性能，您还应该对“生产”环境进行分析。默认情况下，您的本地环境使用的是“开发”环境，这会增加大量开销（主要是为了收集 Web 调试工具栏和 Symfony 分析器的数据）。',
        'As we will profile the "production" environment, there is nothing to change in the configuration as we enabled the Symfony HTTP cache layer only for the "development" environment in a previous chapter.': '由于我们将对“生产”环境进行分析，因此在上一章中，我们只为“开发”环境启用了 Symfony HTTP 缓存层，因此在配置中无需进行任何更改。',
        'Switching your local machine to the production environment can be done by changing the APP_ENV environment variable in the .env.local file:': '通过更改 <code translate="no" class="notranslate">.env.local</code> 文件中的 <code translate="no" class="notranslate">APP_ENV</code> 环境变量，可以将您的本地机器切换到生产环境：',
        'Or you can use the server:prod command:': '或者，您可以使用 <code translate="no" class="notranslate">server:prod</code> 命令：',
        'Don\'t forget to switch it back to dev when your profiling session ends:': '分析会话结束时，请不要忘记将其切换回开发环境：',
        'Profiling API Resources': '分析 API 资源',
        'Profiling the API or the SPA is better done on the CLI via the Blackfire CLI Tool that you have installed previously:': '通过您之前安装的 Blackfire CLI 工具，在 CLI 上对 API 或 SPA 进行分析是更好的选择：',
        'The blackfire curl command accepts the exact same arguments and options as cURL.': '<code translate="no" class="notranslate">blackfire curl</code> 命令接受与 <a href="https://curl.haxx.se/docs/manpage.html" class="reference external" rel="external noopener noreferrer" target="_blank">cURL</a> 完全相同的参数和选项。',
        'Comparing Performance': '比较性能',
        'In the step about "Cache", we added a cache layer to improve the performance of our code, but we did not check nor measure the performance impact of the change. As we are all very bad at guessing what will be fast and what is slow, you might end up in a situation where making some optimization actually makes your application slower.': '在关于“缓存”的步骤中，我们添加了一个缓存层以提高代码的性能，但我们没有检查也没有测量更改对性能的影响。由于我们都很难猜测什么会快什么会慢，您最终可能会遇到一种情况，即进行一些优化实际上会使您的应用程序变慢。',
        'You should always measure the impact of any optimization you do with a profiler. Blackfire makes it visually easier thanks to its comparison feature.': '您应该始终使用分析器来测量您所做的任何优化的影响。Blackfire 的<a href="https://blackfire.io/docs/cookbooks/understanding-comparisons" class="reference external" rel="external noopener noreferrer" target="_blank">比较功能</a>使其在视觉上更加容易。',
        'Writing Black Box Functional Tests': '编写黑盒功能测试',
        'We have seen how to write functional tests with Symfony. Blackfire can be used to write browsing scenarios that can be run on demand via the Blackfire player. Let\'s write a scenario that submits a new comment and validates it via the email link in development, and via the admin in production.': '我们已经了解了如何在 Symfony 中编写功能测试。Blackfire 可用于编写浏览方案，这些方案可以通过 <a href="https://blackfire.io/player" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire 播放器</a>按需运行。让我们编写一个方案，该方案会提交一个新评论，并在开发中通过电子邮件链接进行验证，在生产中通过管理员进行验证。',
        'Create a .blackfire.yaml file with the following content:': '创建一个包含以下内容的 <code translate="no" class="notranslate">.blackfire.yaml</code> 文件：',
        'Download the Blackfire player to be able to run the scenario locally:': '下载 Blackfire 播放器以便在本地运行方案：',
        'Run this scenario in development:': '在开发环境中运行此方案：',
        'Or in production:': '或者在生产环境中：',
        'Blackfire scenarios can also trigger profiles for each request and run performance tests by adding the --blackfire flag.': 'Blackfire 方案还可以通过添加 <code translate="no" class="notranslate">--blackfire</code> 标志来为每个请求触发分析并运行性能测试。',
        'Automating Performance Checks': '自动化性能检查',
        'Managing performance is not only about improving the performance of existing code, it is also about checking that no performance regressions are introduced.': '管理性能不仅涉及提高现有代码的性能，还涉及检查是否引入了性能回归。',
        'The scenario written in the previous section can be run automatically in a Continuous Integration workflow or in production on a regular basis.': '上一节中编写的方案可以在持续集成工作流程中或在生产环境中定期自动运行。',
        'Platform.sh also allows to run the scenarios whenever you create a new branch or deploy to production to check the performance of the new code automatically.': 'Platform.sh 还允许在创建新分支或部署到生产环境时自动<a href="https://blackfire.io/docs/integrations/paas/platformsh#builds-level-enterprise" class="reference external" rel="external noopener noreferrer" target="_blank">运行这些方案</a>，以自动检查新代码的性能。',
        'The Blackfire book: PHP Code Performance Explained;': '<a href="https://blackfire.io/book" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire 书籍：PHP 代码性能解析</a>；',
        'SymfonyCasts Blackfire tutorial.': '<a href="https://symfonycasts.com/screencast/blackfire" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Blackfire 教程</a>。',
        'Going Further': '深入探索',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Localizing an Application': '本地化应用程序',
        'Discovering Symfony Internals': '发现 Symfony 的内部机制'
    };

    fanyi(translates, 2);
})($);
