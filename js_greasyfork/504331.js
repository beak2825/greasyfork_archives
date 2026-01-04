// ==UserScript==
// @name         Symfony 翻译文档 setup/web_server_configuration.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 setup/web_server_configuration.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/web_server_configuration.html
// @match        https://symfony.com/doc/6.4/setup/web_server_configuration.html
// @match        https://symfony.com/doc/7.1/setup/web_server_configuration.html
// @match        https://symfony.com/doc/7.2/setup/web_server_configuration.html
// @match        https://symfony.com/doc/current/setup/web_server_configuration.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504331/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupweb_server_configurationhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504331/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupweb_server_configurationhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Configuring a Web Server\n        \n            ': '配置 Web 服务器',
        'The preferred way to develop your Symfony application is to use\nSymfony Local Web Server.': '开发 Symfony 应用程序的首选方式是使用 <a href="symfony_server.html" class="reference internal">Symfony 本地 Web 服务器</a>。',
        'However, when running the application in the production environment, you\'ll need\nto use a fully-featured web server. This article describes how to use Symfony\nwith Apache, Nginx or Caddy.': '然而，当在生产环境中运行应用程序时，您需要使用功能完备的 Web 服务器。本文介绍了如何使用 Symfony 与 Apache、Nginx 或 Caddy。',
        'The public directory': '公共目录',
        'The public directory is the home of all of your application\'s public and\nstatic files, including images, stylesheets and JavaScript files. It is\nalso where the front controller (index.php) lives.': '公共目录是您应用程序的所有公共和静态文件的存放位置，包括图像、样式表和 JavaScript 文件。它也是前端控制器（<code translate="no" class="notranslate">index.php</code>）的存放位置。',
        'The public directory serves as the document root when configuring your\nweb server. In the examples below, the public/ directory will be the\ndocument root. This directory is /var/www/project/public/.': '在配置 Web 服务器时，公共目录用作文档根目录。在以下示例中，<code translate="no" class="notranslate">public/</code> 目录将是文档根目录。此目录是 <code translate="no" class="notranslate">/var/www/project/public/</code>。',
        'If your hosting provider requires you to change the public/ directory to\nanother location (e.g. public_html/) make sure you\noverride the location of the public/ directory.': '如果您的托管服务提供商要求您将 <code translate="no" class="notranslate">public/</code> 目录更改为其它位置（例如 <code translate="no" class="notranslate">public_html/</code>），请确保您<a href="../configuration/override_dir_structure.html#override-web-dir" class="reference internal">覆盖了 <code translate="no" class="notranslate">public/</code> 目录的位置</a>。',
        'Configuring PHP-FPM': '配置 PHP-FPM',
        'All configuration examples below use the PHP FastCGI process manager\n(PHP-FPM). Ensure that you have installed PHP-FPM (for example, on a Debian\nbased system you have to install the php-fpm package).': '以下所有配置示例均使用 PHP FastCGI 进程管理器（PHP-FPM）。请确保您已安装 PHP-FPM（例如，在基于 Debian 的系统上，您需要安装 <code translate="no" class="notranslate">php-fpm</code> 包）。',
        'PHP-FPM uses so-called pools to handle incoming FastCGI requests. You can\nconfigure an arbitrary number of pools in the FPM configuration. In a pool\nyou configure either a TCP socket (IP and port) or a Unix domain socket to\nlisten on. Each pool can also be run under a different UID and GID:': 'PHP-FPM 使用所谓的池来处理传入的 FastCGI 请求。您可以在 FPM 配置中配置任意数量的池。在池中，您可以配置 TCP 套接字（IP 和端口）或 Unix 域套接字以进行侦听。每个池也可以在不同的 UID 和 GID 下运行：',
        'If you are running Apache 2.4+, you can use mod_proxy_fcgi to pass\nincoming requests to PHP-FPM. Install the Apache2 FastCGI mod\n(libapache2-mod-fastcgi on Debian), enable mod_proxy and\nmod_proxy_fcgi in your Apache configuration, and use the SetHandler\ndirective to pass requests for PHP files to PHP FPM:': '如果您正在运行 Apache 2.4+，则可以使用 <code translate="no" class="notranslate">mod_proxy_fcgi</code> 将传入的请求传递给 PHP-FPM。安装 Apache2 FastCGI 模块（Debian 上的 <code translate="no" class="notranslate">libapache2-mod-fastcgi</code>），在 Apache 配置中启用 <code translate="no" class="notranslate">mod_proxy</code> 和 <code translate="no" class="notranslate">mod_proxy_fcgi</code>，并使用 <code translate="no" class="notranslate">SetHandler</code> 指令将 PHP 文件的请求传递给 PHP FPM：',
        'If you are doing some quick tests with Apache, you can also run\ncomposer require symfony/apache-pack. This package creates an .htaccess\nfile in the public/ directory with the necessary rewrite rules needed to serve\nthe Symfony application. However, in production, it\'s recommended to move these\nrules to the main Apache configuration file (as shown above) to improve performance.': '如果您正在使用 Apache 进行一些快速测试，也可以运行 <code translate="no" class="notranslate">composer require symfony/apache-pack</code>。此包在 <code translate="no" class="notranslate">public/</code> 目录中创建一个 <code translate="no" class="notranslate">.htaccess</code> 文件，其中包含运行 Symfony 应用程序所需的必要重写规则。但是，在生产环境中，建议将这些规则移至主 Apache 配置文件（如上所示）以提高性能。',
        'The minimum configuration to get your application running under Nginx is:': '在 Nginx 下运行您的应用程序所需的<strong>最小配置</strong>是：',
        'If you use NGINX Unit, check out the official article about\nHow to run Symfony applications using NGINX Unit.': '如果您使用 NGINX Unit，请查看有关<a href="https://unit.nginx.org/howto/symfony/" class="reference external" rel="external noopener noreferrer" target="_blank">如何使用 NGINX Unit 运行 Symfony 应用程序</a>的官方文章。',
        'This executes only index.php in the public directory. All other files\nending in ".php" will be denied.': '这仅执行 public 目录中的 <code translate="no" class="notranslate">index.php</code>。所有其它以“.php”结尾的文件都将被拒绝。',
        'If you have other PHP files in your public directory that need to be executed,\nbe sure to include them in the location block above.': '如果您在 public 目录中有其它需要执行的 PHP 文件，请确保在上面的 <code translate="no" class="notranslate">location</code> 块中包含它们。',
        'After you deploy to production, make sure that you cannot access the index.php\nscript (i.e. http://example.com/index.php).': '部署到生产环境后，请确保您无法访问 <code translate="no" class="notranslate">index.php</code> 脚本（即 <code translate="no" class="notranslate">http://example.com/index.php</code>）。',
        'For advanced Nginx configuration options, read the official Nginx documentation.': '有关Nginx的高级配置选项，请阅读 <a href="https://www.nginx.com/resources/wiki/start/topics/recipes/symfony/" class="reference external" rel="external noopener noreferrer" target="_blank">Nginx 的官方文档</a>。',
        'When using Caddy on the server, you can use a configuration like this:': '在服务器上使用 Caddy 时，你可以使用这样的配置：',
        'See the official Caddy documentation for more examples, such as using\nCaddy in a container infrastructure.': '查看 <a href="https://caddyserver.com/docs/" class="reference external" rel="external noopener noreferrer" target="_blank">Caddy 的官方文档</a>以获取更多示例，例如在容器基础架构中使用 Caddy。',
    };

    fanyi(translates, 1);
})($);
