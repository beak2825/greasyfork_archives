// ==UserScript==
// @name         Symfony 翻译文档 setup/file_permissions.html
// @namespace    fireloong
// @version      0.1.2
// @description  翻译文档 setup/file_permissions.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/file_permissions.html
// @match        https://symfony.com/doc/6.4/setup/file_permissions.html
// @match        https://symfony.com/doc/7.1/setup/file_permissions.html
// @match        https://symfony.com/doc/7.2/setup/file_permissions.html
// @match        https://symfony.com/doc/current/setup/file_permissions.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504453/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupfile_permissionshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504453/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupfile_permissionshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Setting up or Fixing File Permissions\n        \n            ': '设置或修复文件权限',
        'Symfony generates certain files in the var/ directory of your project when\nrunning the application. In the dev environment,\nthe bin/console and public/index.php files use umask() to make sure\nthat the directory is writable. This means that you don\'t need to configure\npermissions when developing the application in your local machine.': '当运行 Symfony 应用程序时，它会在项目的 <code translate="no" class="notranslate">var/</code> 目录下生成一些文件。在 <code translate="no" class="notranslate">dev</code> <a href="../configuration.html#configuration-environments" class="reference internal">环境</a>中，<code translate="no" class="notranslate">bin/console</code> 和 <code translate="no" class="notranslate">public/index.php</code> 文件使用 <code translate="no" class="notranslate">umask()</code> 函数来确保该目录可写。这意味着在你的本地机器上开发应用程序时，你不需要手动配置权限。',
        'However, using umask() is not considered safe in production. That\'s why you\noften need to configure some permissions explicitly in your production servers\nas explained in this article.': '然而，在生产环境中使用 <code translate="no" class="notranslate">umask()</code> 并不被认为是安全的做法。因此，通常你需要按照本文档中的说明，在生产服务器上显式地配置一些权限。',
        'Permissions Required by Symfony Applications': 'Symfony 应用程序所需的权限',
        'These are the permissions required to run Symfony applications:': '以下是运行 Symfony 应用程序所需的权限：',
        'The var/log/ directory must exist and must be writable by both your\nweb server user and the terminal user;': '<code translate="no" class="notranslate">var/log/</code> 目录必须存在，并且必须对你的 web 服务器用户和终端用户都可写：',
        'The var/cache/ directory must be writable by the terminal user (the\nuser running cache:warmup or cache:clear commands);': '<code translate="no" class="notranslate">var/cache/</code> 文件夹必须对终端用户（运行 <code translate="no" class="notranslate">cache:warmup</code> 或 <code translate="no" class="notranslate">cache:clear</code> 命令的用户）可写；',
        'The var/cache/ directory must be writable by the web server user if you use\na filesystem-based cache.': '如果使用<a href="../components/cache/adapters/filesystem_adapter.html" class="reference internal">基于文件系统的缓存</a>，则 <code translate="no" class="notranslate">var/cache/</code> 目录必须对 Web 服务器用户可写。',
        'Configuring Permissions for Symfony Applications': '配置 Symfony 应用程序的权限',
        'On Linux and macOS systems, if your web server user is different from your\ncommand line user, you need to configure permissions properly to avoid issues.\nThere are several ways to achieve that:': '在 Linux 和 macOS 系统上，如果你的 Web 服务器用户与命令行用户不同，你需要正确配置权限以避免出现问题。有几种方法可以实现这一点：',
        '1. Using ACL on a System that Supports setfacl (Linux/BSD)': '1. 在支持 <code translate="no" class="notranslate">setfacl</code> 的系统（Linux/BSD）上使用访问控制列表（ACL）',
        'Using Access Control Lists (ACL) permissions is the most safe and\nrecommended method to make the var/ directory writable. You may need to\ninstall setfacl and enable ACL support on your disk partition before\nusing this method. Then, use the following script to determine your web\nserver user and grant the needed permissions:': '使用访问控制列表（ACL）权限是让 <code translate="no" class="notranslate">var/</code> 目录可写最安全且推荐的方法。在使用此方法之前，您可能需要安装 <code translate="no" class="notranslate">setfacl</code> 并在您的磁盘分区上<a href="https://help.ubuntu.com/community/FilePermissionsACLs" class="reference external" rel="external noopener noreferrer" target="_blank">启用 ACL 支持</a>。然后，使用以下脚本来确定您的 Web 服务器用户并授予所需的权限：',
        'Both of these commands assign permissions for the system user (the one\nrunning these commands) and the web server user.': '这两个命令分别为系统用户（即运行这些命令的用户）和网页服务器用户分配权限。',
        'setfacl isn\'t available on NFS mount points. However, storing cache and\nlogs over NFS is strongly discouraged for performance reasons.': '<code translate="no" class="notranslate">setfacl</code> 在 NFS 挂载点上不可用。然而，出于性能考虑，强烈不建议通过 NFS 存储缓存和日志。',
        '2. Use the same User for the CLI and the Web Server': '2. 为命令行界面（CLI）和网页服务器使用相同的用户。',
        'Edit your web server configuration (commonly httpd.conf or apache2.conf\nfor Apache) and set its user to be the same as your CLI user (e.g. for Apache,\nupdate the User and Group directives).': '编辑你的网页服务器配置文件（通常是 <code translate="no" class="notranslate">httpd.conf</code> 或 <code translate="no" class="notranslate">apache2.conf</code> 对于 Apache 来说），并将其用户设置为与你的命令行界面（CLI）用户相同（例如，在 Apache 中，更新 <code translate="no" class="notranslate">User</code> 和 <code translate="no" class="notranslate">Group</code> 指令）。',
        'If this solution is used in a production server, be sure this user only has\nlimited privileges (no access to private data or servers, execution of\nunsafe binaries, etc.) as a compromised server would give to the hacker\nthose privileges.': '如果此解决方案用于生产服务器，请确保该用户只有有限的权限（无法访问私有数据或服务器、执行不安全的二进制文件等），因为被攻破的服务器会赋予黑客这些权限。',
        '3. Without Using ACL': '3. 不使用访问控制列表（ACL）',
        'If none of the previous methods work for you, change the umask so that the\ncache and log directories are group-writable or world-writable (depending\nif the web server user and the command line user are in the same group or not).\nTo achieve this, put the following line at the beginning of the bin/console,\nand public/index.php files:': '如果上述方法都不适用于你的情况，可以更改 <code translate="no" class="notranslate">umask</code> 设置，使得缓存和日志目录对组可写或对所有人可写（这取决于网页服务器用户和命令行用户是否在同一组内）。要实现这一点，在 <code translate="no" class="notranslate">bin/console</code> 和 <code translate="no" class="notranslate">public/index.php</code> 文件的开头加入以下行：',
        'Changing the umask is not thread-safe, so the ACL methods are recommended\nwhen they are available.': '更改 <code translate="no" class="notranslate">umask</code> 并不是线程安全的，因此当可用时推荐使用 ACL（访问控制列表）方法。',
    };

    fanyi(translates, 1);
})($);
