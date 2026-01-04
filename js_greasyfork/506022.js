// ==UserScript==
// @name         Symfony 翻译文档 configuration/override_dir_structure.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 configuration/override_dir_structure.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/configuration/override_dir_structure.html
// @match        https://symfony.com/doc/6.4/configuration/override_dir_structure.html
// @match        https://symfony.com/doc/7.1/configuration/override_dir_structure.html
// @match        https://symfony.com/doc/7.2/configuration/override_dir_structure.html
// @match        https://symfony.com/doc/current/configuration/override_dir_structure.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506022/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationoverride_dir_structurehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/506022/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationoverride_dir_structurehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Override Symfony\'s default Directory Structure\n        \n            ': '如何覆盖 Symfony 的默认目录结构',
        'Symfony applications have the following default directory structure, but you can\noverride it to create your own structure:': 'Symfony 应用程序具有以下默认目录结构，但你可以覆盖它以创建自己的结构：',
        'Override the Environment (DotEnv) Files Directory': '覆盖环境（DotEnv）文件目录',
        'By default, the .env configuration file is located at\nthe root directory of the project. If you store it in a different location,\ndefine the runtime.dotenv_path option in the composer.json file:': '默认情况下，<a href="../configuration.html#config-dot-env" class="reference internal"><code translate="no" class="notranslate">.env</code> 配置文件</a>位于项目的根目录。如果你将其存储在其他位置，则需要在 <code translate="no" class="notranslate">composer.json</code> 文件中定义 <code translate="no" class="notranslate">runtime.dotenv_path</code> 选项：',
        'Then, update your Composer files (running composer dump-autoload, for instance),\nso that the vendor/autoload_runtime.php files gets regenerated with the new\n.env path.': '然后，更新你的 Composer 文件（例如，通过运行 <code translate="no" class="notranslate">composer dump-autoload</code>），以便 <code translate="no" class="notranslate">vendor/autoload_runtime.php</code> 文件根据新的 <code translate="no" class="notranslate">.env</code> 路径被重新生成。',
        'You can also set up different .env paths for your console and web server\ncalls. Edit the public/index.php and/or bin/console files to define the\nnew file path.': '你还可以为控制台和 Web 服务器调用设置不同的 <code translate="no" class="notranslate">.env</code> 路径。编辑 <code translate="no" class="notranslate">public/index.php</code> 和/或 <code translate="no" class="notranslate">bin/console</code> 文件以定义新的文件路径。',
        'Console script:': '控制台脚本：',
        'Web front-controller:': 'Web 前端控制器：',
        'Override the Configuration Directory': '覆盖配置目录',
        'The configuration directory is the only one which cannot be overridden in a\nSymfony application. Its location is hardcoded as the config/ directory\nat your project root directory.': '配置目录是 Symfony 应用程序中唯一无法覆盖的目录。其位置被硬编码为项目根目录下的 <code translate="no" class="notranslate">config/</code> 目录。',
        'Override the Cache Directory': '覆盖缓存目录',
        'Changing the cache directory can be achieved by overriding the\ngetCacheDir() method in the Kernel class of your application:': '更改缓存目录可以通过覆盖应用程序中 <code translate="no" class="notranslate">Kernel</code> 类的 <code translate="no" class="notranslate">getCacheDir()</code> 方法来实现：',
        'In this code, $this->environment is the current environment (i.e. dev).\nIn this case you have changed the location of the cache directory to\nvar/{environment}/cache/.': '在这段代码中，<code translate="no" class="notranslate">$this-&gt;environment</code> 是当前环境（即 <code translate="no" class="notranslate">dev</code>）。在这种情况下，你已经将缓存目录的位置更改为 <code translate="no" class="notranslate">var/{environment}/cache/</code>。',
        'You can also change the cache directory by defining an environment variable\nnamed APP_CACHE_DIR whose value is the full path of the cache folder.': '你也可以通过定义一个名为 <code translate="no" class="notranslate">APP_CACHE_DIR</code> 的环境变量来更改缓存目录，该变量的值是缓存文件夹的完整路径。',
        'You should keep the cache directory different for each environment,\notherwise some unexpected behavior may happen. Each environment generates\nits own cached configuration files, and so each needs its own directory to\nstore those cache files.': '你应该为每个环境保持不同的缓存目录，否则可能会出现一些意外的行为。每个环境都会生成自己的缓存配置文件，因此每个环境都需要自己的目录来存储这些缓存文件。',
        'Override the Log Directory': '覆盖日志目录',
        'Overriding the var/log/ directory is almost the same as overriding the\nvar/cache/ directory.': '覆盖 <code translate="no" class="notranslate">var/log/</code> 目录几乎与覆盖 <code translate="no" class="notranslate">var/cache/</code> 目录相同。',
        'You can do it overriding the getLogDir() method in the Kernel class of\nyour application:': '你可以通过覆盖应用程序中 <code translate="no" class="notranslate">Kernel</code> 类的 <code translate="no" class="notranslate">getLogDir()</code> 方法来实现这一点：',
        'Here you have changed the location of the directory to var/{environment}/log/.': '在这里，你已经将目录的位置更改为 <code translate="no" class="notranslate">var/{environment}/log/</code>。',
        'You can also change the log directory defining an environment variable named\nAPP_LOG_DIR whose value is the full path of the log folder.': '你也可以通过定义一个名为 <code translate="no" class="notranslate">APP_LOG_DIR</code> 的环境变量来更改日志目录，该变量的值是日志文件夹的完整路径。',
        'Override the Templates Directory': '覆盖模板目录',
        'If your templates are not stored in the default templates/ directory, use\nthe twig.default_path configuration\noption to define your own templates directory (use twig.paths\nfor multiple directories):': '如果你的模板没有存储在默认的 <code translate="no" class="notranslate">templates/</code> 目录中，可以使用  <a href="../reference/configuration/twig.html#config-twig-default-path" class="reference internal">twig.default_path</a> 配置选项来定义自己的模板目录（如果需要多个目录，使用 <a href="../reference/configuration/twig.html#config-twig-paths" class="reference internal">twig.paths</a>）：',
        'Override the Translations Directory': '覆盖翻译目录',
        'If your translation files are not stored in the default translations/\ndirectory, use the framework.translator.default_path\nconfiguration option to define your own translations directory (use framework.translator.paths for multiple directories):': '如果你的翻译文件没有存储在默认的 <code translate="no" class="notranslate">translations/</code> 目录中，可以使用 <a href="../reference/configuration/framework.html#reference-translator-default_path" class="reference internal">framework.translator.default_path</a> 配置选项来定义自己的翻译目录（如果需要多个目录，使用 <a href="../reference/configuration/framework.html#reference-translator-paths" class="reference internal">framework.translator.paths</a>）：',
        'Override the Public Directory': '覆盖公共目录',
        'If you need to rename or move your public/ directory, the only thing you\nneed to guarantee is that the path to the vendor/ directory is still correct in\nyour index.php front controller. If you renamed the directory, you\'re fine.\nBut if you moved it in some way, you may need to modify these paths inside those\nfiles:': '如果你需要重命名或移动 <code translate="no" class="notranslate">public/</code> 目录，唯一需要保证的是 <code translate="no" class="notranslate">index.php</code> 前端控制器中指向 <code translate="no" class="notranslate">vendor/</code> 目录的路径仍然正确。如果你只是重命名了目录，那么没有问题。但如果你以某种方式移动了它，可能需要修改这些文件中的路径：',
        'You also need to change the extra.public-dir option in the composer.json\nfile:': '你还需要在 <code translate="no" class="notranslate">composer.json</code> 文件中更改 <code translate="no" class="notranslate">extra.public-dir</code> 选项：',
        'Some shared hosts have a public_html/ web directory root. Renaming\nyour web directory from public/ to public_html/ is one way to make\nyour Symfony project work on your shared host. Another way is to deploy\nyour application to a directory outside of your web root, delete your\npublic_html/ directory, and then replace it with a symbolic link to\nthe public/ dir in your project.': '一些共享主机的网页目录根目录是 <code translate="no" class="notranslate">public_html/</code>。将你的网页目录从 <code translate="no" class="notranslate">public/</code> 重命名为 <code translate="no" class="notranslate">public_html/</code> 是让你的 Symfony 项目在共享主机上运行的一种方法。另一种方法是将你的应用程序部署到网页根目录之外的一个目录中，然后删除 <code translate="no" class="notranslate">public_html/</code> 目录，并用一个指向你项目中 <code translate="no" class="notranslate">public/</code> 目录的符号链接来替代它。',
        'Override the Vendor Directory': '覆盖供应商目录',
        'To override the vendor/ directory, you need to define the vendor-dir\noption in your composer.json file like this:': '要覆盖 <code translate="no" class="notranslate">vendor/</code> 目录，你需要在你的 <code translate="no" class="notranslate">composer.json</code> 文件中定义 <code translate="no" class="notranslate">vendor-dir</code> 选项，如下所示：',
        'This modification can be of interest if you are working in a virtual\nenvironment and cannot use NFS - for example, if you\'re running a Symfony\napplication using Vagrant/VirtualBox in a guest operating system.': '如果在虚拟环境中工作且无法使用 NFS（例如，在客户操作系统中使用 Vagrant/VirtualBox 运行 Symfony 应用程序），这种修改可能会对你有帮助。',
    };

    fanyi(translates, 1);
})($);
