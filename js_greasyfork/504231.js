// ==UserScript==
// @name         Symfony 翻译文档 setup/homestead.html
// @namespace    fireloong
// @version      0.1.2
// @description  翻译文档 setup/homestead.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/homestead.html
// @match        https://symfony.com/doc/6.4/setup/homestead.html
// @match        https://symfony.com/doc/7.1/setup/homestead.html
// @match        https://symfony.com/doc/7.2/setup/homestead.html
// @match        https://symfony.com/doc/current/setup/homestead.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504231/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setuphomesteadhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504231/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setuphomesteadhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using Symfony with Homestead/Vagrant\n        \n            ': '使用 Symfony 与 Homestead/Vagrant',
        'In order to develop a Symfony application, you might want to use a virtual\ndevelopment environment instead of the built-in server or WAMP/LAMP. Homestead\nis an easy-to-use Vagrant box to get a virtual environment up and running\nquickly.': '为了开发 Symfony 应用程序，您可能希望使用虚拟开发环境而不是内置服务器或 WAMP/LAMP。<a href="https://laravel.com/docs/homestead" class="reference external" rel="external noopener noreferrer" target="_blank">Homestead</a> 是一个易于使用的 <a href="https://www.vagrantup.com/" class="reference external" rel="external noopener noreferrer" target="_blank">Vagrant</a> 盒子，可快速启动和运行虚拟环境。',
        'Due to the amount of filesystem operations in Symfony (e.g. updating cache\nfiles and writing to log files), Symfony can slow down significantly. To\nimprove the speed, consider overriding the cache and log directories\nto a location outside the NFS share (for instance, by using\nsys_get_temp_dir). You can read this blog post for more\ntips to speed up Symfony on Vagrant.': '由于 Symfony 中的文件系统操作量很大（例如更新缓存文件和写入日志文件），Symfony 可能会显著减慢速度。为了提高速度，请考虑<a href="../configuration/override_dir_structure.html#override-cache-dir" class="reference internal">将缓存和日志目录覆盖</a>到 NFS 共享之外的位置（例如，使用 <a href="https://secure.php.net/manual/zh/function.sys-get-temp-dir.php" class="reference external" title="sys_get_temp_dir" rel="external noopener noreferrer" target="_blank">sys_get_temp_dir</a>）。您可以阅读<a href="https://beberlei.de/2013/08/19/speedup_symfony2_on_vagrant_boxes.html" class="reference external" rel="external noopener noreferrer" target="_blank">此博客文章</a>，以获取有关在 Vagrant 上加速 Symfony 的更多提示。',
        'Install Vagrant and Homestead': '安装 Vagrant 和 Homestead',
        'Before you can use Homestead, you need to install and configure Vagrant and\nHomestead as explained in the Homestead documentation.': '在您可以使用 Homestead 之前，您需要根据 <a href="https://laravel.com/docs/homestead#installation-and-setup" class="reference external" rel="external noopener noreferrer" target="_blank">Homestead 文档</a>中的说明安装和配置 Vagrant 和 Homestead。',
        'Setting Up a Symfony Application': '设置 Symfony 应用程序',
        'Imagine you\'ve installed your Symfony application in\n~/projects/symfony_demo on your local system. You first need Homestead to\nsync your files in this project. Run homestead edit to edit the\nHomestead configuration and configure the ~/projects directory:': '假设您已经在本地系统的 <code translate="no" class="notranslate">~/projects/symfony_demo</code> 中安装了 Symfony 应用程序。您首先需要 Homestead 来同步此项目中的文件。运行 <code translate="no" class="notranslate">homestead edit</code> 以编辑 Homestead 配置并配置 <code translate="no" class="notranslate">~/projects</code> 目录：',
        'The projects/ directory on your PC is now accessible at\n/home/vagrant/projects in the Homestead environment.': '现在，您 PC 上的 <code translate="no" class="notranslate">projects/</code> 目录在 Homestead 环境中可以通过 <code translate="no" class="notranslate">/home/vagrant/projects</code> 访问。',
        'After you\'ve done this, configure the Symfony application in the Homestead\nconfiguration:': '完成此操作后，在 Homestead 配置中配置 Symfony 应用程序：',
        'The type option tells Homestead to use the Symfony nginx configuration.\nHomestead now supports a Symfony 2 and 3 web layout with app.php and\napp_dev.php when using type symfony2 and an index.php layout when\nusing type symfony4.': '<code translate="no" class="notranslate">type</code> 选项告诉 Homestead 使用 Symfony 的 nginx 配置。现在，当使用 type <code translate="no" class="notranslate">symfony2</code> 时，Homestead 支持具有 <code translate="no" class="notranslate">app.php</code> 和 <code translate="no" class="notranslate">app_dev.php</code> 的 Symfony 2 和 3 网页布局，当使用type <code translate="no" class="notranslate">symfony4</code> 时，它支持 <code translate="no" class="notranslate">index.php</code> 布局。',
        'At last, edit the hosts file on your local machine to map symfony-demo.test\nto 192.168.10.10 (which is the IP used by Homestead):': '最后，在您的本地计算机上编辑 hosts 文件，将 <code translate="no" class="notranslate">symfony-demo.test</code> 映射到 <code translate="no" class="notranslate">192.168.10.10</code>（这是 Homestead 使用的 IP）：',
        'Now, navigate to http://symfony-demo.test in your web browser and enjoy\ndeveloping your Symfony application!': '现在，在您的 Web 浏览器中导航到 <code translate="no" class="notranslate">http://symfony-demo.test</code> 并开始享受开发您的 Symfony 应用程序吧！',
        'To learn more features of Homestead, including Blackfire Profiler\nintegration, automatic creation of MySQL databases and more, read the\nDaily Usage section of the Homestead documentation.': '要了解 Homestead 的更多功能，包括 Blackfire Profiler 集成、自动创建 MySQL 数据库等，请阅读 Homestead 文档的<a href="https://laravel.com/docs/homestead#daily-usage" class="reference external" rel="external noopener noreferrer" target="_blank">日常用法</a>部分。',
    };

    fanyi(translates, 1);
})($);
