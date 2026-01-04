// ==UserScript==
// @name         Symfony 翻译文档 setup/docker.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 setup/docker.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/docker.html
// @match        https://symfony.com/doc/6.4/setup/docker.html
// @match        https://symfony.com/doc/7.1/setup/docker.html
// @match        https://symfony.com/doc/7.2/setup/docker.html
// @match        https://symfony.com/doc/current/setup/docker.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504228/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupdockerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504228/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupdockerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using Docker with Symfony\n        \n            ': '使用 Docker 与 Symfony',
        'Can you use Docker with Symfony? Of course! And several tools exist to help,\ndepending on your needs.': '您可以使用 Docker 与 Symfony 吗？当然可以！根据您的需求，存在几种工具可以帮助您。',
        'Complete Docker Environment': '完整的 Docker 环境',
        'If you\'d like a complete Docker environment (i.e. where PHP, web server, database,\netc. are all in Docker), check out https://github.com/dunglas/symfony-docker.': '如果您想要一个完整的Docker环境（即PHP、Web服务器、数据库等都在Docker中），请查看 <a href="https://github.com/dunglas/symfony-docker" class="reference external" rel="external noopener noreferrer" target="_blank">https://github.com/dunglas/symfony-docker</a>。',
        'Alternatively, you can install PHP on your local machine and use the\nsymfony binary Docker integration. In both cases,\nyou can take advantage of automatic Docker configuration from Symfony Flex.': '或者，您可以在本地计算机上安装 PHP 并使用 <a href="symfony_server.html#symfony-server-docker" class="reference internal">symfony 二进制 Docker 集成</a>。在这两种情况下，您都可以利用 <a href="../setup.html#symfony-flex" class="reference internal">Symfony Flex</a> 的自动 Docker 配置。',
        'Flex Recipes & Docker Configuration': 'Flex Recipes 与 Docker配置',
        'The Flex recipe for some packages also include Docker configuration.\nFor example, when you run composer require doctrine (to get symfony/orm-pack),\nyour compose.yaml file will automatically be updated to include a\ndatabase service.': '一些包的 <a href="../setup.html#symfony-flex" class="reference internal">Flex 配方</a>还包括 Docker 配置。例如，当您运行 <code translate="no" class="notranslate">composer require doctrine</code>（以获得 <code translate="no" class="notranslate">symfony/orm-pack</code>）时，您的 <code translate="no" class="notranslate">compose.yaml</code> 文件将自动更新以包括 <code translate="no" class="notranslate">database</code> 服务。',
        'The first time you install a recipe containing Docker config, Flex will ask you\nif you want to include it. Or, you can set your preference in composer.json,\nby setting the extra.symfony.docker config to true or false.': '当您第一次安装包含 Docker 配置的配方时，Flex 会询问您是否要包含它。或者，您可以在 <code translate="no" class="notranslate">composer.json</code> 中设置您的偏好，通过将 <code translate="no" class="notranslate">extra.symfony.docker</code> 配置设置为 <code translate="no" class="notranslate">true</code> 或 <code translate="no" class="notranslate">false</code> 来实现。',
        'Some recipes also include additions to your Dockerfile. To get those changes,\nyou need to already have a Dockerfile at the root of your app with the\nfollowing code somewhere inside:': '一些配方还包括对您 <code translate="no" class="notranslate">Dockerfile</code> 的补充。要获取这些更改，您需要在应用程序的根目录下已经有一个 <code translate="no" class="notranslate">Dockerfile</code>，并在其中某个位置包含以下代码：',
        'The recipe will find this section and add the changes inside. If you\'re using\nhttps://github.com/dunglas/symfony-docker, you\'ll already have this.': '该配方将找到此部分并在其中添加更改。如果您正在使用 <a href="https://github.com/dunglas/symfony-docker" class="reference external" rel="external noopener noreferrer" target="_blank">https://github.com/dunglas/symfony-docker</a>，那么您已经拥有了它。',
        'After installing the package, rebuild your containers by running:': '安装完软件包后，通过运行以下命令重新构建您的容器：',
        'Symfony Binary Web Server and Docker Support': 'Symfony 二进制 Web 服务器和 Docker 支持',
        'If you\'re using the symfony binary web server (e.g. symfony server:start),\nthen it can automatically detect your Docker services and expose them as environment\nvariables. See Symfony Local Web Server.': '如果你使用的是 <a href="symfony_server.html#symfony-local-web-server" class="reference internal">Symfony 二进制 Web 服务器</a>（例如 <code translate="no" class="notranslate">symfony server:start</code>），那么它可以自动检测你的 Docker 服务并将它们作为环境变量暴露出来。请参阅 <a href="symfony_server.html#symfony-server-docker" class="reference internal">Symfony 本地 Web 服务器</a>。',
        'macOS users need to explicitly allow the default Docker socket to be used\nfor the Docker integration to work as explained in the Docker documentation.': 'macOS 用户需要<a href="https://docs.docker.com/desktop/mac/permission-requirements/" class="reference external" rel="external noopener noreferrer" target="_blank">按照 Docker 文档中所述</a>，明确允许使用默认的 Docker 套接字，以便 Docker 集成正常工作。',
    };

    fanyi(translates, 1);
})($);
