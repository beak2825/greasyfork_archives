// ==UserScript==
// @name         Book for Symfony 6 翻译 24-cron.html
// @namespace    fireloong
// @version      0.1.0
// @description  运行 Cron 任务（或 Cron 作业） 24-cron.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/24-cron.html
// @match        https://symfony.com/doc/current/the-fast-track/en/24-cron.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502504/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2024-cronhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502504/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2024-cronhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Running Crons\n        \n            ': '运行 Cron 任务（或 Cron 作业）',
        'Crons are useful to do maintenance tasks. Unlike workers, they run on a schedule for a short period of time.': 'Cron 非常适合执行维护任务。与工作人员不同，它们会在短时间内按照计划运行。',
        'Cleaning up Comments': '清理评论',
        'Comments marked as spam or rejected by the admin are kept in the database as the admin might want to inspect them for a little while. But they should probably be removed after some time. Keeping them around for a week after their creation is probably enough.': '管理员标记为垃圾邮件或拒绝的评论将保留在数据库中，因为管理员可能希望对其进行一段时间的检查。但是它们可能需要在一段时间后删除。创建后保留它们大约一周可能就足够了。',
        'Create some utility methods in the comment repository to find rejected comments, count them, and delete them:': '在评论存储库中创建一些实用方法来查找被拒绝的评论、统计它们并删除它们：',
        'For more complex queries, it is sometimes useful to have a look at the generated SQL statements (they can be found in the logs and in the profiler for Web requests).': '对于更复杂的查询，有时查看生成的 SQL 语句（它们可以在日志和 Web 请求的分析器中找到）是有用的。',
        'Using Class Constants, Container Parameters, and Environment Variables': '使用类常量、容器参数和环境变量',
        '7 days? We could have chosen another number, maybe 10 or 20. This number might evolve over time. We have decided to store it as a constant on the class, but we might have stored it as a parameter in the container, or we might have even defined it as an environment variable.': '7天？我们本可以选择另一个数字，比如10或20。这个数字可能会随着时间的推移而演变。我们决定将其作为类上的常量存储，但我们也可以将其作为容器中的参数存储，或者甚至将其作为环境变量定义。',
        'Here are some rules of thumb to decide which abstraction to use:': '这里有一些决定使用哪种抽象的一般规则：',
        'If the value is sensitive (passwords, API tokens, ...), use the Symfony secret storage or a Vault;': '如果值是敏感的（密码、API 令牌等），请使用 Symfony 秘密存储或 Vault；',
        'If the value is dynamic and you should be able to change it without re-deploying, use an environment variable;': '如果值是动态的，并且您应该能够在不重新部署的情况下更改它，请使用环境变量；',
        'If the value can be different between environments, use a container parameter;': '如果值在不同环境之间可能不同，请使用容器参数；',
        'For everything else, store the value in code, like in a class constant.': '对于其它所有内容，请在代码中存储值，例如在类常量中。',
        'Creating a CLI Command': '创建一个 CLI 命令',
        'Removing the old comments is the perfect task for a cron job. It should be done on a regular basis, and a little delay does not have any major impact.': '删除旧评论是 Cron 作业的理想任务。它应该定期执行，并且一点延迟也没有太大影响。',
        'Create a CLI command named app:comment:cleanup by creating a src/Command/CommentCleanupCommand.php file:': '通过创建一个名为 <code translate="no" class="notranslate">src/Command/CommentCleanupCommand.php</code> 的文件来创建一个名为 <code translate="no" class="notranslate">app:comment:cleanup</code> 的 CLI 命令：',
        'All application commands are registered alongside Symfony built-in ones and they are all accessible via symfony console. As the number of available commands can be large, you should namespace them. By convention, the application commands should be stored under the app namespace. Add any number of sub-namespaces by separating them by a colon (:).': '所有应用程序命令都与 Symfony 内置命令一起注册，并且都可以通过 <code translate="no" class="notranslate">symfony console</code> 访问。由于可用命令的数量可能很大，因此您应该对它们进行命名空间划分。按照惯例，应用程序命令应存储在 <code translate="no" class="notranslate">app</code> 命名空间下。通过在它们之间添加冒号(<code translate="no" class="notranslate">:</code>)来添加任意数量的子命名空间。',
        'A command gets the input (arguments and options passed to the command) and you can use the output to write to the console.': '命令获取输入（传递给命令的参数和选项），您可以使用输出来写入控制台。',
        'Clean up the database by running the command:': '通过运行命令来清理数据库：',
        'Setting up a Cron on Platform.sh': '在 Platform.sh 上设置 Cron',
        'One of the nice things about Platform.sh is that most of the configuration is stored in one file: .platform.app.yaml. The web container, the workers, and the cron jobs are described together to help maintenance:': 'Platform.sh 的一个优点是，大多数配置都存储在一个文件中：<code translate="no" class="notranslate">.platform.app.yaml</code>。Web 容器、工作程序和 Cron 作业一起描述，以帮助维护：',
        'The crons section defines all cron jobs. Each cron runs according to a spec schedule.': '<code translate="no" class="notranslate">crons</code> 部分定义了所有 Cron 作业。每个 Cron 作业都根据 <code translate="no" class="notranslate">spec</code> 的时间表运行。',
        'The croncape utility monitors the execution of the command and sends an email to the addresses defined in the MAILTO environment variable if the command returns any exit code different than 0.': '<code translate="no" class="notranslate">croncape</code> 实用程序监控命令的执行，如果命令返回除 <code translate="no" class="notranslate">0</code> 以外的任何退出代码，则会向 <code translate="no" class="notranslate">MAILTO</code> 环境变量中定义的地址发送电子邮件。',
        'Configure the MAILTO environment variable:': '配置 <code translate="no" class="notranslate">MAILTO</code> 环境变量：',
        'Note that crons are set up on all Platform.sh branches. If you don\'t want to run some on non-production environments, check the $PLATFORM_ENVIRONMENT_TYPE environment variable:': '请注意，Cron 作业在所有 Platform.sh 分支上均已设置。如果您不想在非生产环境中运行某些 Cron 作业，请检查 <code translate="no" class="notranslate">$PLATFORM_ENVIRONMENT_TYPE</code> E环境变量：',
        'Going Further': '深入探索',
        'Cron/crontab syntax;': '<a href="https://en.wikipedia.org/wiki/Cron" class="reference external" rel="external noopener noreferrer" target="_blank">Cron/crontab 语法</a>；',
        'Croncape repository;': '<a href="https://github.com/symfonycorp/croncape" class="reference external" rel="external noopener noreferrer" target="_blank">Croncape 仓库</a>；',
        'Symfony Console commands;': '<a href="https://symfony.com/doc/current/console.html" class="reference external">Symfony Console 命令</a>；',
        'The Symfony Console Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony4/console_en_42.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony Console 速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Resizing Images': '调整图像大小',
        'Notifying by all Means': '用尽一切手段通知'
    };

    fanyi(translates, 2);
})($);
