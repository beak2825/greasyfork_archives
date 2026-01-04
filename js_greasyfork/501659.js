// ==UserScript==
// @name         Book for Symfony 6 翻译 3-zero.html
// @namespace    fireloong
// @version      0.0.7
// @description  从零到生产 3-zero.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/3-zero.html
// @match        https://symfony.com/doc/current/the-fast-track/en/3-zero.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501659/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%203-zerohtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501659/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%203-zerohtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Going from Zero to Production\n        \n            ': '从零到生产',
        'I like to go fast. I want our little project to be live as fast as possible. Like now. In production. As we haven\'t developed anything yet, we will start by deploying a nice and simple "Under construction" page. You will love it!': '我喜欢快速行动。我希望我们的小项目能尽快上线。就像现在一样。进入生产环境。既然我们还没有开发任何东西，我们就从部署一个漂亮而简单的“建设中”页面开始。你会爱上它的！',
        'Spend some time trying to find the ideal, old fashioned, and animated "Under construction" GIF on the Internet. Here is the one I\'m going to use:': '花点时间在网上找一个理想的、复古的、动态的“建设中” GIF 图。这是<a href="http://clipartmag.com/images/website-under-construction-image-6.gif" class="reference external" rel="external noopener noreferrer" target="_blank">一张图</a>我将使用的：',
        'I told you, it is going to be a lot of fun.': '我告诉过你，这将会非常有趣。',
        'Initializing the Project': '初始化项目',
        'Create a new Symfony project with the symfony CLI tool we have previously installed together:': '使用我们先前一起安装的 <code translate="no" class="notranslate">symfony</code> CLI 工具创建一个新的 Symfony 项目：',
        'This command is a thin wrapper on top of Composer that eases the creation of Symfony projects. It uses a project skeleton that includes the bare minimum dependencies; the Symfony components that are needed for almost any project: a console tool and the HTTP abstraction needed to create Web applications.': '这个命令是 <code translate="no" class="notranslate">Composer</code> 之上的一个轻量级包装器，可以简化 Symfony 项目的创建。它使用了一个<a href="https://github.com/symfony/skeleton" class="reference external" rel="external noopener noreferrer" target="_blank">项目骨架</a>，其中包含了最少的依赖项；这是几乎任何项目都需要的 Symfony 组件：一个控制台工具和创建 Web 应用程序所需的 HTTP 抽象。',
        'As we are creating a fully-featured web application, we have added a few options that will make our life easier:': '由于我们正在创建一个功能齐全的 Web 应用程序，因此我们添加了一些选项，这些选项将使我们的工作更加轻松：',
        '--webapp: By default, an application with the fewest possible dependencies is created. For most web projects, it is recommended to use the webapp package on top. It contains most of the packages needed for "modern" web applications. The webapp package adds a lot of Symfony packages, including Symfony Messenger and PostgreSQL via Doctrine.': '<code translate="no" class="notranslate">--webapp</code>：默认情况下，将创建一个具有尽可能少依赖项的应用程序。对于大多数 Web 项目，建议使用顶部的 <code translate="no" class="notranslate">webapp</code> 包。它包含了“现代” Web 应用程序所需的大多数包。<code translate="no" class="notranslate">webapp</code> 包添加了许多 Symfony 包，包括通过 Doctrine 提供的 Symfony Messenger 和 PostgreSQL。',
        '--docker: On your local machine, we will use Docker to manage services like PostgreSQL. This option enables Docker so that Symfony will automatically add Docker services based on the required packages (a PostgreSQL service when adding the ORM or a mail catcher when adding Symfony Mailer for instance).': '<code translate="no" class="notranslate">--docker</code>：在你的本地机器上，我们将使用 Docker 来管理 PostgreSQL 等服务。这个选项启用 Docker，以便 Symfony 能够根据所需的包自动添加 Docker 服务（例如，在添加 ORM 时添加 PostgreSQL 服务，或在添加 Symfony Mailer 时添加邮件捕获器）。',
        '--cloud: If you want to deploy your project on Platform.sh, this option automatically generates a sensible Platform.sh configuration. Platform.sh is the preferred and simplest way to deploy testing, staging, and production Symfony environments in the cloud.': '<code translate="no" class="notranslate">--cloud</code>：如果你想在 Platform.sh 上部署你的项目，这个选项会自动生成一个合理的 Platform.sh 配置。Platform.sh 是在云端部署测试、暂存和生产 Symfony 环境的首选且最简单的方式。',
        'If you have a look at the GitHub repository for the skeleton, you will notice that it is almost empty. Just a composer.json file. But the guestbook directory is full of files. How is that even possible? The answer lies in the symfony/flex package. Symfony Flex is a Composer plugin that hooks into the installation process. When it detects a package for which it has a recipe, it executes it.': '如果你查看这个骨架的 GitHub 仓库，你会注意到它几乎是空的。只有一个 <code translate="no" class="notranslate">composer.json</code> 文件。但是 <code translate="no" class="notranslate">guestbook</code> 目录却有很多文件。这怎么可能呢？答案就在 <code translate="no" class="notranslate">symfony/flex</code> 包中。Symfony Flex 是一个 Composer 插件，它会在安装过程中介入。当它检测到有它对应 recipe 的包时，就会执行这个 recipe。',
        'The main entry point of a Symfony Recipe is a manifest file that describes the operations that need to be done to automatically register the package in a Symfony application. You never have to read a README file to install a package with Symfony. Automation is a key feature of Symfony.': 'Symfony Recipe 的主要入口是一个清单文件，它描述了需要在 Symfony 应用程序中自动注册包所需执行的操作。使用 Symfony 安装包时，您无需阅读 README 文件。自动化是 Symfony 的一个关键特性。',
        'As Git is installed on our machine, symfony new also created a Git repository for us and it added the very first commit.': '由于我们的机器上已经安装了 Git，因此 <code translate="no" class="notranslate">symfony new</code> 也为我们创建了一个 Git 仓库，并添加了第一个提交。',
        'Have a look at the directory structure:': '看一下目录结构：',
        'The bin/ directory contains the main CLI entry point: console. You will use it all the time.': '<code translate="no" class="notranslate">bin/</code> 目录包含主要的命令行界面（CLI）入口点：<code translate="no" class="notranslate">console</code>。你将一直使用它。',
        'The config/ directory is made of a set of default and sensible configuration files. One file per package. You will barely change them, trusting the defaults is almost always a good idea.': '<code translate="no" class="notranslate">config/</code> 目录包含一组默认且合理的配置文件。每个包一个文件。你几乎不会更改它们，信任默认设置通常是个好主意。',
        'The public/ directory is the web root directory, and the index.php script is the main entry point for all dynamic HTTP resources.': '<code translate="no" class="notranslate">public/</code> 目录是 Web 根目录，而 <code translate="no" class="notranslate">index.php</code> 脚本是所有动态 HTTP 资源的主要入口点。',
        "The src/ directory hosts all the code you will write; that's where you will spend most of your time. By default, all classes under this directory use the App PHP namespace. It is your home. Your code. Your domain logic. Symfony has very little to say there.": '<code translate="no" class="notranslate">src/</code> 目录包含了你将要编写的所有代码；你将在这里花费大部分时间。默认情况下，此目录下的所有类都使用 <code translate="no" class="notranslate">App</code> PHP 命名空间。这是你的家。你的代码。你的领域逻辑。Symfony 在这里几乎没有发言权。',
        'The var/ directory contains caches, logs, and files generated at runtime by the application. You can leave it alone. It is the only directory that needs to be writable in production.': '<code translate="no" class="notranslate">var/</code> 目录包含应用程序在运行时生成的缓存、日志和文件。你可以不管它。这是在生产环境中唯一需要可写的目录。',
        "The vendor/ directory contains all packages installed by Composer, including Symfony itself. That's our secret weapon to be more productive. Let's not reinvent the wheel. You will rely on existing libraries to do the hard work. The directory is managed by Composer. Never touch it.": '<code translate="no" class="notranslate">vendor/</code> 目录包含由 Composer 安装的所有包，包括 Symfony 本身。这是我们提高生产力的秘密武器。让我们不要重新发明轮子。你会依赖现有的库来完成艰巨的工作。这个目录由 Composer 管理。永远不要去动它。',
        "That's all you need to know for now.": '这是你现在需要知道的所有内容。',
        'Creating some Public Resources': '创建一些公共资源',
        'Anything under public/ is accessible via a browser. For instance, if you move your animated GIF file (name it under-construction.gif) into a new public/images/ directory, it will be available at a URL like https://localhost/images/under-construction.gif.': '通过浏览器可以访问 <code translate="no" class="notranslate">public/</code> 下的所有内容。例如，如果你将你的动态 GIF 文件（命名为 <code translate="no" class="notranslate">under-construction.gif</code>）移动到新的 <code translate="no" class="notranslate">public/images/</code> 目录中，它将可以通过类似 <code translate="no" class="notranslate">https://localhost/images/under-construction.gif</code> 的 URL 进行访问。',
        'Download my GIF image here:': '在这里下载我的 GIF 图片：',
        'Launching a Local Web Server': '启动本地 Web 服务器',
        "The symfony CLI comes with a Web Server that is optimized for development work. You won't be surprised if I tell you that it works nicely with Symfony. Never use it in production though.": '<code translate="no" class="notranslate">symfony</code> CLI 附带了一个针对开发工作进行优化的 Web 服务器。如果我告诉你它与 Symfony 配合得很好，你也不会感到惊讶。但是，永远不要在生产环境中使用它。',
        'From the project directory, start the web server in the background (-d flag):': '从项目目录中，在后台启动 web 服务器（使用 <code translate="no" class="notranslate">-d</code> 标志）：',
        'The server started on the first available port, starting with 8000. As a shortcut, open the website in a browser from the CLI:': '服务器在第一个可用端口上启动，从 8000 端口开始。作为快捷方式，可以从命令行界面（CLI）在浏览器中打开网站：',
        'Your favorite browser should take the focus and open a new tab that displays something similar to the following:': '您最喜欢的浏览器应该会获得焦点，并打开一个新标签页，显示类似于以下内容的东西：',
        'To troubleshoot problems, run symfony server:log; it tails the logs from the web server, PHP, and your application.': '为了排查问题，请运行 <code translate="no" class="notranslate">symfony server:log</code>；它会跟踪来自 Web 服务器、PHP 和您的应用程序的日志。',
        'Browse to /images/under-construction.gif. Does it look like this?': '浏览到 <code translate="no" class="notranslate">/images/under-construction.gif</code>。它看起来是这样的吗？',
        "Satisfied? Let's commit our work:": '满意吗？让我们提交我们的工作：',
        'Preparing for Production': '为生产环境做准备',
        'What about deploying our work to production? I know, we don\'t even have a proper HTML page yet to welcome our users. But being able to see the little "under construction" image on a production server would be a great step forward. And you know the motto: deploy early and often.': '将我们的工作部署到生产环境呢？我知道，我们甚至还没有一个合适的 HTML 页面来欢迎我们的用户。但是，能够在生产服务器上看到小小的“正在建设中”的图片会是一个很大的进步。而且，你知道那句格言：尽早且经常地部署。',
        'You can host this application on any provider supporting PHP... which means almost all hosting providers out there. Check a few things though: we want the latest PHP version and the possibility to host services like a database, a queue, and some more.': '你可以将这个应用程序托管在任何支持 PHP 的提供商上…… 这意味着几乎所有的托管提供商都可以。但是，你需要检查一些事项：我们需要最新的 PHP 版本以及托管如数据库、队列等服务的可能性。',
        "I have made my choice, it's going to be Platform.sh. It provides everything we need and it helps fund the development of Symfony.": '我已经做出了选择，那将是 <a href="https://platform.sh/marketplace/symfony/?utm_source=symfony-cloud-sign-up&amp;utm_medium=backlink&amp;utm_campaign=Symfony-Cloud-sign-up&amp;utm_content=symfony-book" class="reference external" rel="external noopener noreferrer" target="_blank">Platform.sh</a>。它提供了我们所需的一切，并且有助于资助 Symfony 的开发。',
        'As we used the --cloud option when we created the project, Platform.sh has already been initialized with a few files needed by Platform.sh, namely .platform/services.yaml, .platform/routes.yaml, and .platform.app.yaml.': '由于我们在创建项目时使用了 <code translate="no" class="notranslate">--cloud</code> 选项，Platform.sh 已经被初始化为包含 Platform.sh 所需的一些文件，即 <code translate="no" class="notranslate">.platform/services.yaml</code>、<code translate="no" class="notranslate">.platform/routes.yaml</code> 和 <code translate="no" class="notranslate">.platform.app.yaml</code>。',
        'Going to Production': '投入生产',
        'Deploy time?': '部署时间？',
        'Create a new remote Platform.sh project:': '创建一个新的远程 Platform.sh 项目：',
        'This command does a lot:': '这个命令做了很多事：',
        'The first time you launch this command, authenticate with your Platform.sh credentials if not done already.': '第一次运行此命令时，如果尚未进行身份验证，请使用您的 Platform.sh 凭据进行身份验证。',
        'It provisions a new project on Platform.sh (you get 30 days for free on the first project you create).': '它在 Platform.sh 上创建了一个新的项目（您创建的第一个项目可以免费使用 30 天）。',
        'Then, deploy:': '然后，进行部署：',
        'The code is deployed by pushing the Git repository. At the end of the command, the project will have a specific domain name you can use to access it.': '代码是通过推送 Git 仓库来部署的。在命令结束时，项目将具有一个特定的域名，您可以使用该域名来访问它。',
        'Check that everything worked fine:': '检查是否一切正常：',
        'You should get a 404, but browsing to /images/under-construction.gif should reveal our work.': '你应该会得到一个 404 错误，但浏览到 <code translate="no" class="notranslate">/images/under-construction.gif</code> 应该能看到我们的工作成果。',
        "Note that you don't get the beautiful default Symfony page on Platform.sh. Why? You will learn soon that Symfony supports several environments and Platform.sh automatically deployed the code in the production environment.": '请注意，你在 Platform.sh 上看不到美丽的默认 Symfony 页面。为什么呢？你很快就会了解到 Symfony 支持多个环境，而 Platform.sh 自动将代码部署到了生产环境中。',
        'If you want to delete the project on Platform.sh, use the cloud:project:delete command.': '如果你想在 Platform.sh 上删除项目，请使用 <code translate="no" class="notranslate">cloud:project:delete</code> 命令。',
        'Going Further': '进一步了解',
        'The repositories for the official Symfony recipes and for the recipes contributed by the community, where you can submit your own recipes;': '<a href="https://github.com/symfony/recipes" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 官方食谱</a>的存储库和<a href="https://github.com/symfony/recipes-contrib" class="reference external" rel="external noopener noreferrer" target="_blank">社区贡献的食谱</a>的存储库，您可以在其中提交自己的食谱；',
        'The Symfony Local Web Server;': '<a href="https://symfony.com/doc/6.4/setup/symfony_server.html" class="reference external">Symfony 本地 Web 服务器</a>；',
        'The Platform.sh documentation.': '<a href="https://docs.platform.sh/guides/symfony.html?utm_source=symfony-cloud-sign-up&amp;utm_medium=backlink&amp;utm_campaign=Symfony-Cloud-sign-up&amp;utm_content=symfony-book" class="reference external" rel="external noopener noreferrer" target="_blank">Platform.sh 文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Introducing the Project': '项目介绍',
        'Adopting a Methodology': '采用方法'
    };

    fanyi(translates, 2);
})($);
