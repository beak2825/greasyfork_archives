// ==UserScript==
// @name         Symfony 翻译文档 setup/bundles.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 setup/bundles.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/setup/bundles.html
// @match        https://symfony.com/doc/6.4/setup/bundles.html
// @match        https://symfony.com/doc/7.1/setup/bundles.html
// @match        https://symfony.com/doc/7.2/setup/bundles.html
// @match        https://symfony.com/doc/current/setup/bundles.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504343/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupbundleshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504343/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20setupbundleshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Upgrading a Third-Party Bundle for a Major Symfony Version\n        \n            ': '为主要的 Symfony 版本升级第三方包',
        'Symfony 3 was released in November 2015. Although this version doesn\'t contain\nany new features, it removes all the backward compatibility layers included in\nthe previous 2.8 version. If your bundle uses any deprecated feature and it\'s\npublished as a third-party bundle, applications upgrading to Symfony 3 will no\nlonger be able to use it.': 'Symfony 3 于 2015 年 11 月发布。尽管这个版本不包含任何新功能，但它删除了先前 2.8 版本中包含的所有向后兼容层。如果你的包使用了任何已弃用的功能，并且它是作为第三方包发布的，那么升级到 Symfony 3 的应用程序将不再能够使用它。',
        'Allowing to Install Symfony 3 Components': '允许安装 Symfony 3 组件',
        'Most third-party bundles define their Symfony dependencies using the ~2.N or\n^2.N constraints in the composer.json file. For example:': '大多数第三方包在 <code translate="no" class="notranslate">composer.json</code> 文件中使用 <code translate="no" class="notranslate">~2.N</code> 或 <code translate="no" class="notranslate">^2.N</code> 约束来定义它们的 Symfony 依赖项。例如：',
        'These constraints prevent the bundle from using Symfony 3 components, which\nmeans the bundle cannot be installed in a Symfony 3 based application. Thanks to the\nflexibility of Composer dependencies constraints, you can specify more than one\nmajor version by replacing ~2.N by ~2.N|~3.0 (or ^2.N by ^2.N|~3.0).': '这些约束阻止了包使用 Symfony 3 组件，这意味着该包无法安装在基于 Symfony 3 的应用程序中。由于 Composer 依赖项约束的灵活性，您可以通过将 <code translate="no" class="notranslate">~2.N</code> 替换为 <code translate="no" class="notranslate">~2.N|~3.0</code>（或将 <code translate="no" class="notranslate">^2.N</code> 替换为 <code translate="no" class="notranslate">^2.N|~3.0</code>）来指定多个主版本。',
        'The above example can be updated to work with Symfony 3 as follows:': '上述示例可以更新为与 Symfony 3 一起工作，如下所示：',
        'Another common version constraint found on third-party bundles is >=2.N.\nYou should avoid using that constraint because it\'s too generic (it means\nthat your bundle is compatible with any future Symfony version). Use instead\n~2.N|~3.0 or ^2.N|~3.0 to make your bundle future-proof.': '在第三方包中发现的另一个常见的版本约束是 <code translate="no" class="notranslate">&gt;=2.N</code>。您应该避免使用此约束，因为它太通用（意味着您的包与任何未来的 Symfony 版本都兼容）。相反，请使用 <code translate="no" class="notranslate">~2.N|~3.0</code> 或 <code translate="no" class="notranslate">^2.N|~3.0</code> 来使您的包具有前瞻性。',
        'Look for Deprecations and Fix Them': '查找弃用并修复它们',
        'Besides allowing users to use your bundle with Symfony 3, your bundle must stop using\nany feature deprecated by the 2.8 version because they are removed in 3.0 (you\'ll get\nexceptions or PHP errors). The easiest way to detect deprecations is to install\nthe symfony/phpunit-bridge package and then run the test suite.': '除了允许用户将您的包与 Symfony 3 一起使用外，您的包还必须停止使用 2.8 版本中已弃用的任何功能，因为它们在 3.0 版本中已被删除（您会遇到异常或 PHP 错误）。检测弃用情况的最简单方法是安装 <a href="https://github.com/symfony/phpunit-bridge" class="reference external" rel="external noopener noreferrer" target="_blank">symfony/phpunit-bridge 包</a>，然后运行测试套件。',
        'First, install the component as a dev dependency of your bundle:': '首先，将此组件作为您 bundle 的 <code translate="no" class="notranslate">dev</code> 依赖项进行安装：',
        'Then, run your test suite and look for the deprecation list displayed after the\nPHPUnit test report:': '然后，运行您的测试套件，并查找 PHPUnit 测试报告后显示的弃用列表：',
        'Fix the reported deprecations, run the test suite again and repeat the process\nuntil no deprecation usage is reported.': '修复报告的弃用情况，再次运行测试套件，并重复此过程，直到不再报告弃用情况的使用。',
        'Useful Resources': '有用的资源',
        'There are several resources that can help you detect, understand and fix the use\nof deprecated features:': '有几个资源可以帮助您检测、理解和修复对弃用特性的使用：',
        'Official Symfony Guide to Upgrade from 2.x to 3.0': '<a href="https://github.com/symfony/symfony/blob/2.8/UPGRADE-3.0.md" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 官方从 2.x 升级到 3.0 的指南</a>',
        '\n                            The full list of changes required to upgrade to Symfony 3.0 and grouped\nby component.\n                    ': '升级到 Symfony 3.0 所需更改的完整列表，按组件分组。',
        'SensioLabs DeprecationDetector': '<a href="https://github.com/sensiolabs-de/deprecation-detector" class="reference external" rel="external noopener noreferrer" target="_blank">SensioLabs DeprecationDetector</a>',
        '\n                            It runs a static code analysis against your project\'s source code to find\nusages of deprecated methods, classes and interfaces. It works for any PHP\napplication, but it includes special detectors for Symfony applications,\nwhere it can also detect usages of deprecated services.\n                    ': '它针对您项目的源代码运行静态代码分析，以查找已弃用方法、类和接口的使用情况。它适用于任何 PHP 应用程序，但包括对 Symfony 应用程序的特殊检测器，其中还可以检测已弃用服务的使用情况。',
        'Symfony Upgrade Fixer': '<a href="https://github.com/umpirsky/Symfony-Upgrade-Fixer" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 升级修复器</a>',
        '\n                            It analyzes Symfony projects to find deprecations. In addition it solves\nautomatically some of them thanks to the growing list of supported "fixers".\n                    ': '它分析 Symfony 项目以查找弃用情况。此外，由于支持的“修复器”列表不断增长，它还可以自动解决其中一些问题。',
        'Testing your Bundle in Symfony 3': '在 Symfony 3 中测试您的包',
        'Now that your bundle has removed all deprecations, it\'s time to test it for real\nin a Symfony 3 application. Assuming that you already have a Symfony 3 application,\nyou can test the updated bundle locally without having to install it through\nComposer.': '现在，您的包已经删除了所有弃用情况，是时候在 Symfony 3 应用程序中对其进行实际测试了。假设您已经有一个 Symfony 3 应用程序，您可以在不需要通过 Composer 安装的情况下在本地测试更新的包。',
        'If your operating system supports symbolic links, instead point the appropriate\nvendor directory to your local bundle root directory:': '如果您的操作系统支持符号链接，请将相应的供应商目录指向您的本地包根目录：',
        'If your operating system doesn\'t support symbolic links, you\'ll need to copy\nyour local bundle directory into the appropriate directory inside vendor/.': '如果您的操作系统不支持符号链接，则需要将本地包目录复制到 <code translate="no" class="notranslate">vendor/</code> 内的相应目录中。',
        'Update the Travis CI Configuration': '更新 Travis CI 配置',
        'In addition to running tools locally, it\'s recommended to set-up Travis CI service\nto run the tests of your bundle using different Symfony configurations. Use the\nfollowing recommended configuration as the starting point of your own configuration:': '除了在本地运行工具外，还建议设置 Travis CI 服务，以使用不同的 Symfony 配置来运行包的测试。使用以下推荐配置作为您自己配置的起点：',
        'Updating your Code to Support Symfony 2.x and 3.x at the Same Time': '更新代码以同时支持 Symfony 2.x 和 3.x',
        'The real challenge of adding Symfony 3 support for your bundles is when you want\nto support both Symfony 2.x and 3.x simultaneously using the same code. There\nare some edge cases where you\'ll need to deal with the API differences.': '为您的包添加 Symfony 3 支持的真正挑战在于，当您想使用相同的代码同时支持 Symfony 2.x 和 3.x时。在某些边缘情况下，您需要处理 API 差异。',
        'Before diving into the specifics of the most common edge cases, the general\nrecommendation is to not rely on the Symfony Kernel version to decide which\ncode to use:': '在深入探讨最常见的边界案例的具体细节之前，一般的建议是：<strong>不要依赖 Symfony Kernel 的版本</strong>来决定使用哪段代码：',
        'Instead of checking the Symfony Kernel version, check the version of the specific\ncomponent. For example, the OptionsResolver API changed in its 2.6 version by\nadding a setDefined() method. The recommended check in this case would be:': '相反，应检查特定组件的版本。例如，在 2.6 版本中，OptionsResolver 的 API 通过添加 <code translate="no" class="notranslate">setDefined()</code> 方法发生了变化。在这种情况下，推荐的检查方式应该是：',
        'There is one case when you actually can rely on the\nSymfony\\Component\\HttpKernel\\Kernel::VERSION_ID constant: when trying\nto detect the version of the symfony/http-kernel component, because it\nis the component where this constant is defined.': '有一种情况确实可以依赖 <code translate="no" class="notranslate">Symfony\Component\HttpKernel\Kernel::VERSION_ID</code> 常量：当你试图检测 <code translate="no" class="notranslate">symfony/http-kernel</code> 组件的版本时，因为这个常量正是在这个组件中定义的。',
    };

    fanyi(translates, 1);
})($);
