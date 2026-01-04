// ==UserScript==
// @name         Symfony 翻译文档 setup/unstable_versions.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 setup/unstable_versions.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/unstable_versions.html
// @match        https://symfony.com/doc/6.4/setup/unstable_versions.html
// @match        https://symfony.com/doc/7.1/setup/unstable_versions.html
// @match        https://symfony.com/doc/7.2/setup/unstable_versions.html
// @match        https://symfony.com/doc/current/setup/unstable_versions.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504908/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupunstable_versionshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504908/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupunstable_versionshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Install or Upgrade to the Latest, Unreleased Symfony Version\n        \n            ': '如何安装或升级到最新版和未发布的 Symfony 版本',
        'In this article, you\'ll learn how to install and use new Symfony versions before\nthey are released as stable versions.': '在本文中，你将学习如何在新版本的 Symfony 发布为稳定版之前安装并使用它们。',
        'Creating a New Project Based on an Unstable Symfony Version': '基于不稳定版本的 Symfony 创建新项目',
        'Suppose that the Symfony 6.0 version hasn\'t been released yet and you want to create\na new project to test its features. First, install the Composer package manager.\nThen, open a command console, enter your project\'s directory and\nrun the following command:': '假设 Symfony 6.0 版本尚未发布，你想创建一个新项目来测试其功能。首先，<a href="https://getcomposer.org/download/" class="reference external" rel="external noopener noreferrer" target="_blank">安装 Composer 包管理器</a>。然后，打开命令控制台，进入你的项目目录，并运行以下命令：',
        'Once the command finishes, you\'ll have a new Symfony project created\nin the my_project/ directory.': '一旦命令执行完成，你将在 <code translate="no" class="notranslate">my_project/</code> 目录下创建一个新的 Symfony 项目。',
        'Upgrading your Project to an Unstable Symfony Version': '将你的项目升级到不稳定版本的 Symfony',
        'Suppose again that Symfony 6.0 hasn\'t been released yet and you want to upgrade\nan existing application to test that your project works with it.': '假设 Symfony 6.0 版本尚未发布，你想将现有的应用程序升级以测试你的项目是否能与其兼容。',
        'First, open the composer.json file located in the root directory of your\nproject. Then, edit the value of all of the symfony/* libraries to the\nnew version and change your minimum-stability to beta:': '首先，打开位于项目根目录下的 <code translate="no" class="notranslate">composer.json</code> 文件。然后，将所有 <code translate="no" class="notranslate">symfony/*</code> 库的版本值修改为新版本，并将 <code translate="no" class="notranslate">minimum-stability</code> 设置为 <code translate="no" class="notranslate">beta</code>：',
        'You can also use set minimum-stability to dev, or omit this line\nentirely, and opt into your stability on each package by using constraints\nlike 6.0.*@beta.': '你也可以将 <code translate="no" class="notranslate">minimum-stability</code> 设置为 <code translate="no" class="notranslate">dev</code>，或者完全省略这一行，并通过使用如 <code translate="no" class="notranslate">6.0.*@beta</code> 这样的约束来为每个包单独选择稳定性。',
        'Finally, from a terminal, update your project\'s dependencies:': '最后，在终端中更新你的项目依赖：',
        'After upgrading the Symfony version, read the Symfony Upgrading Guide\nto learn how you should proceed to update your application\'s code in case the new\nSymfony version has deprecated some of its features.': '升级 Symfony 版本后，阅读 <a href="upgrade_major.html#upgrade-major-symfony-deprecations" class="reference internal">Symfony 升级指南</a>，了解如果新版本的 Symfony 弃用了某些功能，你应该如何更新应用程序的代码。',
        'If you use Git to manage the project\'s code, it\'s a good practice to create\na new branch to test the new Symfony version. This solution avoids introducing\nany issue in your application and allows you to test the new version with\ntotal confidence:': '如果你使用 Git 来管理项目的代码，最好创建一个新的分支来测试新的 Symfony 版本。这样可以避免在你的应用中引入任何问题，并让你能够完全放心地测试新版本。',
    };

    fanyi(translates, 1);
})($);
