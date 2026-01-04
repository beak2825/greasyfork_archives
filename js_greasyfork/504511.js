// ==UserScript==
// @name         Symfony 翻译文档 setup/flex_private_recipes.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 setup/flex_private_recipes.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/flex_private_recipes.html
// @match        https://symfony.com/doc/6.4/setup/flex_private_recipes.html
// @match        https://symfony.com/doc/7.1/setup/flex_private_recipes.html
// @match        https://symfony.com/doc/7.2/setup/flex_private_recipes.html
// @match        https://symfony.com/doc/current/setup/flex_private_recipes.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504511/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupflex_private_recipeshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504511/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupflex_private_recipeshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How To Configure and Use Flex Private Recipe Repositories\n        \n            ': '如何配置和使用 Flex 私有配方仓库',
        'Since the release of version 1.16 of symfony/flex, you can build your own\nprivate Symfony Flex recipe repositories, and seamlessly integrate them into the\ncomposer package installation and maintenance process.': '自从发布了 <code translate="no" class="notranslate">symfony/flex</code> 的 <a href="https://github.com/symfony/cli" class="reference external" rel="external noopener noreferrer" target="_blank">1.16 版本</a>后，你可以构建自己的私有 Symfony Flex 配方仓库，并将其无缝集成到 <code translate="no" class="notranslate">composer</code> 包的安装和维护流程中。',
        'This is particularly useful when you have private bundles or packages that must\nperform their own installation tasks. To do this, you need to complete several steps:': '当你有一些需要执行自身安装任务的私有组件或包时，这尤其有用。要做到这一点，你需要完成以下几个步骤：',
        'Create a private repository;': '创建一个私有仓库；',
        'Create your private recipes;': '创建你的私有配方；',
        'Create an index to the recipes;': '创建配方索引；',
        'Store your recipes in the private repository;': '将你的配方存储在私有仓库中；',
        'Grant composer access to the private repository;': '授予 <code translate="no" class="notranslate">composer</code> 访问私有仓库的权限；',
        'Configure your project\'s composer.json file; and': '配置你的项目中的 <code translate="no" class="notranslate">composer.json</code> 文件；以及',
        'Install the recipes in your project.': '在你的项目中安装这些配方。',
        'Create a Private Repository': '创建一个私有仓库',
        'Log in to your GitHub.com account, click your account icon in the top-right\ncorner, and select Your Repositories. Then click the New button, fill in\nthe repository name, select the Private radio button, and click the\nCreate Repository button.': '登录到你的 GitHub.com 账户，点击右上角的账户图标，然后选择<strong>你的仓库</strong>。接着点击<strong>新建</strong>按钮，填写<strong>仓库名称</strong>，选择<strong>私有</strong>单选按钮，最后点击<strong>创建仓库</strong>按钮。',
        'Log in to your Gitlab.com account, click the New project button, select\nCreate blank project, fill in the Project name, select the Private\nradio button, and click the Create project button.': '登录到你的 Gitlab.com 账户，点击<strong>新建项目</strong>按钮，选择<strong>创建空白项目</strong>，填写<strong>项目名称</strong>，选择<strong>私有</strong>单选按钮，最后点击<strong>创建项目</strong>按钮。',
        'Create Your Private Recipes': '创建你的私有配方',
        'A symfony/flex recipe is a JSON file that has the following structure:': '一个 <code translate="no" class="notranslate">symfony/flex</code> 配方是一个具有以下结构的 JSON 文件：',
        'If your package is a private Symfony bundle, you will have the following in the recipe:': '如果你的包是一个私有的 Symfony 组件，那么在配方中你会有如下内容：',
        'Replace acme and private-bundle with your own private bundle details.\nThe "ref" entry is a random 40-character string used by composer to\ndetermine if your recipe was modified. Every time that you make changes to your\nrecipe, you also need to generate a new "ref" value.': '将 <code translate="no" class="notranslate">acme</code> 和 <code translate="no" class="notranslate">private-bundle</code> 替换为你自己的私有组件详情。<code translate="no" class="notranslate">"ref"</code> 项是一个由 <code translate="no" class="notranslate">composer</code> 用来判断你的配方是否被修改的随机 40 个字符的字符串。每次你对配方做出更改时，你也需要生成一个新的 <code translate="no" class="notranslate">"ref"</code> 值。',
        'Use the following PHP script to generate a random "ref" value:': '使用以下 PHP 脚本来生成一个随机的 <code translate="no" class="notranslate">"ref"</code> 值：',
        'The "all" entry tells symfony/flex to create an entry in your project\'s\nbundles.php file for all environments. To load your bundle only for the\ndev environment, replace "all" with "dev".': '<code translate="no" class="notranslate">"all"</code> 项告诉 <code translate="no" class="notranslate">symfony/flex</code> 在你的项目的 <code translate="no" class="notranslate">bundles.php</code> 文件中为所有环境创建一个条目。若要仅在 <code translate="no" class="notranslate">dev</code> 环境下加载你的组件，则将 <code translate="no" class="notranslate">"all"</code> 替换为 <code translate="no" class="notranslate">"dev"</code>。',
        'The name of your recipe JSON file must conform to the following convention,\nwhere 1.0 is the version number of your bundle (replace acme and\nprivate-bundle with your own private bundle or package details):': '你的配方 JSON 文件的名称必须遵循以下约定，其中 <code translate="no" class="notranslate">1.0</code> 是你的捆绑包版本号（请将 <code translate="no" class="notranslate">acme</code> 和 <code translate="no" class="notranslate">private-bundle</code> 替换为你自己的私人捆绑包或包详情）：',
        'You will probably also want symfony/flex to create configuration files for\nyour bundle or package in the project\'s /config/packages directory. To do\nthat, change the recipe JSON file as follows:': '你可能还想使用 <code translate="no" class="notranslate">symfony/flex</code> 来在项目的 <code translate="no" class="notranslate">/config/packages</code> 目录下为你的捆绑包或包创建配置文件。为此，请按如下方式修改配方 JSON 文件：',
        'For more examples of what you can include in a recipe file, browse the\nSymfony recipe files.': '要了解更多可以在配方文件中包含的内容示例，请浏览 <a href="https://github.com/symfony/recipes/tree/flex/main" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 的配方文件</a>。',
        'Create an Index to the Recipes': '创建配方索引',
        'The next step is to create an index.json file, which will contain entries\nfor all your private recipes, and other general configuration information.': '下一步是创建一个 <code translate="no" class="notranslate">index.json</code> 文件，该文件将包含所有私有配方的条目以及其他通用配置信息。',
        'The index.json file has the following format:': '<code translate="no" class="notranslate">index.json</code> 文件的格式如下：',
        'Create an entry in "recipes" for each of your bundle recipes. Replace\nyour-github-account-name and your-recipes-repository with your own details.': '为每个捆绑包配方在 <code translate="no" class="notranslate">"recipes"</code> 中创建一个条目。将 <code translate="no" class="notranslate">your-github-account-name</code> 和 <code translate="no" class="notranslate">your-recipes-repository</code> 替换为你自己的详细信息。',
        'Create an entry in "recipes" for each of your bundle recipes. Replace\nyour-gitlab-account-name, your-gitlab-repository and your-gitlab-project-id\nwith your own details.': '为每个捆绑包配方在 <code translate="no" class="notranslate">"recipes"</code> 中创建一个条目。将 <code translate="no" class="notranslate">your-gitlab-account-name</code>、<code translate="no" class="notranslate">your-gitlab-repository</code> 和 <code translate="no" class="notranslate">your-gitlab-project-id</code> 替换为你自己的详细信息。',
        'Store Your Recipes in the Private Repository': '在私有仓库中存储你的配方',
        'Upload the recipe .json file(s) and the index.json file into the root\ndirectory of your private repository.': '将配方 <code translate="no" class="notranslate">.json</code> 文件和 <code translate="no" class="notranslate">index.json</code> 文件上传到你的私有仓库的根目录中。',
        'Grant composer Access to the Private Repository': '授予 <code translate="no" class="notranslate">composer</code> 访问私有仓库的权限',
        'In your GitHub account, click your account icon in the top-right corner, select\nSettings and Developer Settings. Then select Personal Access Tokens.': '在你的 GitHub 账户中，点击右上角的账户图标，选择 <code translate="no" class="notranslate">Settings</code> 和 <code translate="no" class="notranslate">Developer Settings</code>。然后选择 <code translate="no" class="notranslate">Personal Access Tokens</code>。',
        'Generate a new access token with Full control of private repositories\nprivileges. Copy the access token value, switch to the terminal of your local\ncomputer, and execute the following command:': '生成一个新的访问令牌，并赋予其 <code translate="no" class="notranslate">Full control of private repositories</code> 权限。复制访问令牌的值，切换到本地计算机的终端，并执行以下命令：',
        'Replace [token] with the value of your GitHub personal access token.': '将 <code translate="no" class="notranslate">[token]</code> 替换为你的 GitHub 个人访问令牌的值。',
        'In your Gitlab account, click your account icon in the top-right corner, select\nPreferences and Access Tokens.': '在你的 GitLab 账户中，点击右上角的账户图标，选择 <code translate="no" class="notranslate">Preferences</code> 和 <code translate="no" class="notranslate">Access Tokens</code>。',
        'Generate a new personal access token with read_api and read_repository\nscopes. Copy the access token value, switch to the terminal of your local\ncomputer, and execute the following command:': '生成一个新的个人访问令牌，并为其分配 <code translate="no" class="notranslate">read_api</code> 和 <code translate="no" class="notranslate">read_repository</code> 权限范围。复制访问令牌的值，切换到本地计算机的终端，并执行以下命令：',
        'Replace [token] with the value of your Gitlab personal access token.': '将 <code translate="no" class="notranslate">[token]</code> 替换为你的 GitLab 个人访问令牌的值。',
        'Configure Your Project\'s composer.json File': '配置你的项目 <code translate="no" class="notranslate">composer.json</code> 文件',
        'Add the following to your project\'s composer.json file:': '在你的项目 <code translate="no" class="notranslate">composer.json</code> 文件中添加以下内容：',
        'Replace your-github-account-name and your-recipes-repository with your own details.': '将 <code translate="no" class="notranslate">your-github-account-name</code> 和 <code translate="no" class="notranslate">your-recipes-repository</code> 替换为你自己的详细信息。',
        'The extra.symfony key will most probably already exist in your\ncomposer.json. In that case, add the "endpoint" key to the existing\nextra.symfony entry.': '<code translate="no" class="notranslate">extra.symfony</code> 键很可能已经在你的 <code translate="no" class="notranslate">composer.json</code> 中存在。如果是这样，则将 <code translate="no" class="notranslate">"endpoint"</code> 键添加到现有的 <code translate="no" class="notranslate">extra.symfony</code> 条目中。',
        'The endpoint URL must point to https://api.github.com/repos and\nnot to https://www.github.com.': '<code translate="no" class="notranslate">endpoint</code> URL <strong>必须</strong>指向 <code translate="no" class="notranslate">https://api.github.com/repos</code>，而<strong>不是</strong> <code translate="no" class="notranslate">https://www.github.com</code>。',
        'Replace your-gitlab-project-id with your own details.': '将 <code translate="no" class="notranslate">your-gitlab-project-id</code> 替换为你自己的详细信息。',
        'Install the Recipes in Your Project': '在你的项目中安装这些配方',
        'If your private bundles/packages have not yet been installed in your project,\nrun the following command:': '如果你的私有捆绑包/包尚未在你的项目中安装，请运行以下命令：',
        'If the private bundles/packages have already been installed and you just want to\ninstall the new private recipes, run the following command:': '如果私有捆绑包/包已经安装，而你只是想安装新的私有配方，请运行以下命令：',
    };

    fanyi(translates, 1);
})($);
