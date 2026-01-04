// ==UserScript==
// @name         Book for Symfony 6 翻译 4-methodology.html
// @namespace    fireloong
// @version      0.0.7
// @description  采用方法 4-methodology.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/4-methodology.html
// @match        https://symfony.com/doc/current/the-fast-track/en/4-methodology.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501682/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%204-methodologyhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/501682/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%204-methodologyhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Adopting a Methodology\n        \n            ': '采用方法',
        "Teaching is about repeating the same thing again and again. I won't do that. I promise. At the end of each step, you should do a little dance and save your work. It is like Ctrl+S but for a website.": '教学就是不断地重复同样的事情。但我不会这么做，我保证。在每个步骤结束时，你应该跳个小舞并保存你的工作。这就像 <code translate="no" class="notranslate">Ctrl+S</code>，但用于网站。',
        'Implementing a Git Strategy': '实施 Git 策略',
        "At the end of each step, don't forget to commit your changes:": '在每个步骤结束时，别忘了提交你的更改：',
        'You can safely add "everything" as Symfony manages a .gitignore file for you. And each package can add more configuration. Have a look at the current content:': '你可以安全地添加“所有内容”，因为 Symfony 会为你管理一个 <code translate="no" class="notranslate">.gitignore</code> 文件。每个包都可以添加更多配置。请查看当前内容：',
        'The funny strings are markers added by Symfony Flex so that it knows what to remove if you decide to uninstall a dependency. I told you, all the tedious work is done by Symfony, not you.': '这些有趣的字符串是 Symfony Flex 添加的标记，以便它知道在你决定卸载依赖项时要删除什么。我说过，所有繁琐的工作都是由 Symfony 来完成的，而不是你。',
        'It could be nice to push your repository to a server somewhere. GitHub, GitLab, or Bitbucket are good choices.': '将你的仓库推送到某个服务器可能是一个不错的选择。GitHub、GitLab 或 Bitbucket 都是很好的选择。',
        'If you are deploying on Platform.sh, you already have a copy of the Git repository as Platform.sh uses Git behind the scenes when you are using cloud:deploy. But you should not rely on the Platform.sh Git repository. It is only for deployment usage. It is not a backup.': '如果你正在 Platform.sh 上部署，你已经有了 Git 仓库的副本，因为当你使用 <code translate="no" class="notranslate">cloud:deploy</code> 时，Platform.sh 在幕后使用了 Git。但你不应该依赖 Platform.sh 的 Git 仓库。它仅用于部署使用，不是备份。',
        'Deploying to Production Continuously': '持续部署到生产环境',
        'Another good habit is to deploy frequently. Deploying at the end of each step is a good pace:': '另一个好习惯是频繁部署。在每个步骤结束时进行部署是一个不错的节奏：',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Going from Zero to Production': '从零到生产',
        'Troubleshooting Problems': '故障排查'
    };

    fanyi(translates, 2);
})($);
