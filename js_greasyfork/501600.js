// ==UserScript==
// @name         Book for Symfony 6 翻译 1-tools.html
// @namespace    fireloong
// @version      0.0.11
// @description  检查你的工作环境 1-tools.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/1-tools.html
// @match        https://symfony.com/doc/current/the-fast-track/en/1-tools.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501600/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%201-toolshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501600/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%201-toolshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Checking your Work Environment\n        \n            ': '检查你的工作环境',
        'Before starting to work on the project, we need to check that you have a good working environment. It is very important. The developers tools we have at our disposal today are very different from the ones we had 10 years ago. They have evolved a lot, for the better. It would be a shame to not leverage them. Good tools can get you a long way.': '在开始着手这个项目之前，我们需要检查你是否有一个良好的工作环境。这非常重要。现在我们能够使用的开发者工具与10年前的大不相同。这些工具已经有了很大的发展，且发展势头很好。如果不能很好地利用它们，那就太可惜了。好的工具能助你走得更远。',
        "Please, don't skip this step. Or at least, read the last section about the Symfony CLI.": '请不要跳过这一步。或者至少，阅读最后一部分关于 Symfony CLI 的内容。',
        'A Computer': '一台电脑',
        'You need a computer. The good news is that it can run on any popular OS: macOS, Windows, or Linux. Symfony and all the tools we are going to use are compatible with each of these.': '你需要一台电脑。好消息是，它可以在任何流行的操作系统上运行：macOS、Windows 或 Linux。Symfony 和我们将要使用的所有工具都与这些系统兼容。',
        'Opinionated Choices': '有偏见的选择',
        'I want to move fast with the best options out there. I made opinionated choices for this book.': '我想以最快的速度和最好的选择前进。我为这本书做出了有偏见的选择。',
        'PostgreSQL is going to be our choice for everything: from database to queues, from cache to session storage. For most projects, PostgreSQL is the best solution, scales well, and allows to simplify the infrastructure with only one service to manage.': '我们将选择 <a href="https://www.postgresql.org/" class="reference external" rel="external noopener noreferrer" target="_blank">PostgreSQL</a> 作为所有内容的基础：从数据库到队列，从缓存到会话存储。对于大多数项目来说，PostgreSQL 都是最佳解决方案，扩展性良好，并且允许我们仅通过一种服务来简化基础设施。',
        'At the end of the book, we will learn how to use RabbitMQ for queues and Redis for sessions.': '在本书的结尾，我们将学习如何使用 <a href="https://www.rabbitmq.com/" class="reference external" rel="external noopener noreferrer" target="_blank">RabbitMQ</a> 进行队列管理和 <a href="https://redis.io/" class="reference external" rel="external noopener noreferrer" target="_blank">Redis</a> 进行会话管理。',
        'You can use Notepad if you want to. I would not recommend it though.': '如果你想用记事本也可以，但我不推荐这么做。',
        'I used to work with Textmate. Not anymore. The comfort of using a "real" IDE is priceless. Auto-completion, use statements added and sorted automatically, jumping from one file to another are a few features that will boost your productivity.': '我以前用 Textmate。但现在不用了。使用“真正”的 IDE 所带来的便利是无价的。自动补全、自动添加和排序 <code translate="no" class="notranslate">use</code> 语句、从一个文件跳转到另一个文件等功能都将提高你的生产力。',
        'I would recommend using Visual Studio Code or PhpStorm. The former is free, the latter is not but has a better integration with Symfony (thanks to the Symfony Support Plugin). It is up to you. I know you want to know which IDE I am using. I am writing this book in Visual Studio Code.': '我推荐使用 Visual Studio Code 或 <a href="https://www.jetbrains.com/phpstorm/" class="reference external" rel="external noopener noreferrer" target="_blank">PhpStorm</a>。前者是免费的，后者虽然收费但与 Symfony 有更好的集成（得益于 <a href="https://plugins.jetbrains.com/plugin/7219-symfony-support" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony Support 插件</a>）。选择哪个取决于你。我知道你想知道我正在使用哪个 IDE。我在写这本书时使用的是 Visual Studio Code。',
        'Terminal': '终端',
        "We will switch from the IDE to the command line all the time. You can use your IDE's built-in terminal, but I prefer to use a real one to have more space.": '我们会一直从 IDE 切换到命令行。你可以使用 IDE 内置的终端，但我更喜欢使用真正的终端来获得更多的空间。',
        'Linux comes built-in with Terminal. Use iTerm2 on macOS. On Windows, Hyper works well.': 'Linux 内置了 <code translate="no" class="notranslate">Terminal</code>。在 macOS 上使用 <a href="https://iterm2.com/" class="reference external" rel="external noopener noreferrer" target="_blank">iTerm2</a>。在 Windows 上，<a href="https://hyper.is/" class="reference external" rel="external noopener noreferrer" target="_blank">Hyper</a> 表现良好。',
        'For version control, we will use Git as everybody is using it now.': '对于版本控制，我们将使用 <a href="https://git-scm.com/" class="reference external" rel="external noopener noreferrer" target="_blank">Git</a>，因为现在大家都在使用它。',
        'On Windows, install Git bash.': '在 Windows 上，安装 <a href="https://gitforwindows.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Git bash</a>。',
        'Be sure you know how to do the common operations like running git clone, git log, git show, git diff, git checkout, ...': '确保你知道如何执行常见的操作，比如运行 <code translate="no" class="notranslate">git clone</code>、<code translate="no" class="notranslate">git clone</code>、<code translate="no" class="notranslate">git show</code>、<code translate="no" class="notranslate">git diff</code>、<code translate="no" class="notranslate">git diff</code> 等。',
        'We will use Docker for services, but I like to have PHP installed on my local computer for performance, stability, and simplicity reasons. Call me old school if you like, but the combination of a local PHP and Docker services is the perfect combo for me.': '我们会使用 Docker 作为服务，但我喜欢在我的本地计算机上安装 PHP，因为这样有更好的性能、稳定性和简洁性。如果你喜欢的话，可以叫我老派，但对我来说，本地 PHP 和 Docker 服务的结合是完美的组合。',
        'Use PHP 8.3 and check that the following PHP extensions are installed or install them now: intl, pdo_pgsql, xsl, amqp, gd, openssl, sodium. Optionally install redis, curl, and zip as well.': '使用 PHP 8.3 并检查以下 PHP 扩展是否已安装或立即安装它们：<code translate="no" class="notranslate">intl</code>、<code translate="no" class="notranslate">pdo_pgsql</code>、<code translate="no" class="notranslate">xsl</code>、<code translate="no" class="notranslate">amqp</code>、<code translate="no" class="notranslate">gd</code>、<code translate="no" class="notranslate">openssl</code>、<code translate="no" class="notranslate">sodium</code>。另外，也可以选择性地安装 <code translate="no" class="notranslate">redis</code>、<code translate="no" class="notranslate">curl</code> 和 <code translate="no" class="notranslate">zip</code>。',
        'You can check the extensions currently enabled via php -m.': '你可以通过 <code translate="no" class="notranslate">php -m</code> 来检查当前已启用的扩展。',
        'We also need php-fpm if your platform supports it, php-cgi works as well.': '如果你的平台支持，我们还需要 <code translate="no" class="notranslate">php-fpm</code>，<code translate="no" class="notranslate">php-cgi</code> 也可以。',
        'Managing dependencies is everything nowadays with a Symfony project. Get the latest version of Composer, the package management tool for PHP.': '如今，使用 Symfony 项目时，管理依赖项至关重要。获取最新版本的 <a href="https://getcomposer.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Composer</a>，这是 PHP 的包管理工具。',
        'If you are not familiar with Composer, take some time to read about it.': '如果你不熟悉 Composer，花些时间了解一下它。',
        "You don't need to type the full command names: composer req does the same as composer require, use composer rem instead of composer remove, ...": '你不需要输入完整的命令名称：<code translate="no" class="notranslate">composer req</code> 和 <code translate="no" class="notranslate">composer require</code> 功能相同，使用 <code translate="no" class="notranslate">composer rem</code> 代替 <code translate="no" class="notranslate">composer remove</code>，以此类推...',
        "We won't write much JavaScript code, but we will use JavaScript/NodeJS tools to manage our assets. Check that you have the NodeJS installed.": '我们不会写太多 JavaScript 代码，但我们会使用 JavaScript/NodeJS 工具来管理我们的资源。请检查你是否已经安装了 <a href="https://nodejs.org/" class="reference external" rel="external noopener noreferrer" target="_blank">NodeJS</a>。',
        'Docker and Docker Compose': 'Docker 和 Docker Compose',
        "Services are going to be managed by Docker and Docker Compose. Install them and start Docker. If you are a first time user, get familiar with the tool. Don't panic though, our usage will be very straightforward. No fancy configurations, no complex setup.": '服务将由 Docker 和 Docker Compose 管理。请<a href="https://docs.docker.com/install/" class="reference external" rel="external noopener noreferrer" target="_blank">安装它们</a>并启动 Docker。如果你是第一次使用，请先熟悉这个工具。不过不用紧张，我们的使用方式会非常直接。没有花哨的配置，也没有复杂的设置。',
        'Last, but not least, we will use the symfony CLI to boost our productivity. From the local web server it provides, to full Docker integration and cloud support through Platform.sh, it will be a great time saver.': '最后，同样重要的是，我们将使用 <code translate="no" class="notranslate">symfony</code> CLI 来提高我们的生产力。从它提供的本地 Web 服务器，到完整的 Docker 集成和通过 Platform.sh 提供的云支持，这将是一个巨大的时间节省器。',
        'Install the Symfony CLI now.': '现在安装 <a href="https://symfony.com/download" class="reference external">Symfony CLI</a>。',
        'To use HTTPS locally, we also need to install a certificate authority (CA) to enable TLS support. Run the following command:': '要在本地使用HTTPS，我们还需要<a href="https://symfony.com/doc/current/setup/symfony_server.html#enabling-tls" class="reference external">安装一个证书颁发机构（CA）</a>以启用 TLS 支持。运行以下命令：',
        'Check that your computer has all needed requirements by running the following command:': '通过运行以下命令检查您的计算机是否满足所有要求：',
        'If you want to get fancy, you can also run the Symfony proxy. It is optional but it allows you to get a local domain name ending with .wip for your project.': '如果你想更高级一些，你也可以运行 <a href="https://symfony.com/doc/current/setup/symfony_server.html#setting-up-the-local-proxy" class="reference external">Symfony 代理</a>。它是可选的，但允许你为项目获取以 <code translate="no" class="notranslate">.wip</code> 结尾的本地域名。',
        'When executing a command in a terminal, we will almost always prefix it with symfony like in symfony composer instead of just composer, or symfony console instead of ./bin/console.': '在终端中执行命令时，我们几乎总是会在命令前加上 <code translate="no" class="notranslate">symfony</code> 前缀，如使用 <code translate="no" class="notranslate">symfony composer</code> 而不是仅使用 <code translate="no" class="notranslate">composer</code>，或者使用 <code translate="no" class="notranslate">symfony console</code> 而不是 <code translate="no" class="notranslate">./bin/console</code>。',
        'The main reason is that the Symfony CLI automatically sets some environment variables based on the services running on your machine via Docker. These environment variables are available for HTTP requests because the local web server injects them automatically. So, using symfony on the CLI ensures that you have the same behavior across the board.': '主要原因是 Symfony CLI 会自动基于通过 Docker 在您的机器上运行的服务设置一些环境变量。这些环境变量可用于 HTTP 请求，因为本地 Web 服务器会自动注入它们。因此，在 CLI 上使用 <code translate="no" class="notranslate">symfony</code> 可以确保您在整个过程中具有相同的行为。',
        'Moreover, the Symfony CLI automatically selects the "best" possible PHP version for the project.': '此外，Symfony CLI 会自动为项目选择“最佳”的 PHP 版本。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'What is it about?': '这是关于什么的？',
        'Introducing the Project': '项目介绍',
    };

    fanyi(translates, 2);
})($);
