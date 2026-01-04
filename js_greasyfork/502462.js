// ==UserScript==
// @name         Book for Symfony 6 翻译 22-encore.html
// @namespace    fireloong
// @version      0.1.0
// @description  使用 Webpack 样式化用户界面 22-encore.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/22-encore.html
// @match        https://symfony.com/doc/current/the-fast-track/en/22-encore.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502462/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2022-encorehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502462/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2022-encorehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Styling the User Interface with Webpack\n        \n            ': '使用 Webpack 样式化用户界面',
        'We have spent no time on the design of the user interface. To style like a pro, we will use a modern stack, based on Webpack. And to add a Symfony touch and ease its integration with the application, let\'s use Webpack Encore:': '我们还没有花时间在设计用户界面上。为了像专业人士一样进行样式设计，我们将使用基于 <a href="https://webpack.js.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Webpack</a> 的现代堆栈。为了增加 Symfony 的触感并简化其与应用程序的集成，让我们使用 <em>Webpack Encore</em>：',
        'A full Webpack environment has been created for you: package.json and webpack.config.js have been generated and contain good default configuration. Open webpack.config.js, it uses the Encore abstraction to configure Webpack.': '已经为您创建了一个完整的 Webpack 环境：已经生成了 <code translate="no" class="notranslate">package.json</code> 和 <code translate="no" class="notranslate">webpack.config.js</code>，并包含了良好的默认配置。打开 <code translate="no" class="notranslate">webpack.config.js</code>，它使用 Encore 抽象来配置 Webpack。',
        'The package.json file defines some nice commands that we will use all the time.': '<code translate="no" class="notranslate">package.json</code> 文件定义了一些我们将一直使用的良好命令。',
        'The assets directory contains the main entry points for the project assets: styles/app.css and app.js.': '<code translate="no" class="notranslate">assets</code> 目录包含项目资源的主要入口点：<code translate="no" class="notranslate">styles/app.css</code> 和 <code translate="no" class="notranslate">app.js</code>。',
        'Using Sass': '使用 Sass',
        'Instead of using plain CSS, let\'s switch to Sass:': '与其使用纯 CSS，不如改用 <a href="https://sass.nodejs.cn/" class="reference external" rel="external noopener noreferrer" target="_blank">Sass</a>：',
        'Install the Sass loader:': '安装 Sass 加载器：',
        'And enable the Sass loader in webpack:': '并在 webpack 中启用 Sass 加载器：',
        'How did I know which packages to install? If we had tried to build our assets without them, Encore would have given us a nice error message suggesting the npm install command needed to install dependencies to load .scss files.': '我怎么知道要安装哪些包？如果我们尝试在没有它们的情况下构建我们的资源，Encore 会给我们一个很好的错误消息，提示我们需要使用 <code translate="no" class="notranslate">npm install</code> 命令来安装加载 <code translate="no" class="notranslate">.scss</code> 文件所需的依赖项。',
        'Leveraging Bootstrap': '利用 Bootstrap',
        'To start with good defaults and build a responsive website, a CSS framework like Bootstrap can go a long way. Install it as a package:': '为了以良好的默认值开始并构建响应式网站，像 <a href="https://getbootstrap.com/" class="reference external" rel="external noopener noreferrer" target="_blank">Bootstrap</a> 这样的 CSS 框架可以发挥很大的作用。将其安装为一个包：',
        'Require Bootstrap in the CSS file (we have also cleaned up the file):': '在 CSS 文件中引入 Bootstrap（我们还清理了文件）：',
        'Do the same for the JS file:': '对 JS 文件也做同样的操作：',
        'The Symfony form system supports Bootstrap natively with a special theme, enable it:': 'Symfony 表单系统通过特殊主题原生支持 Bootstrap，启用它：',
        'Styling the HTML': '样式化 HTML',
        'We are now ready to style the application. Download and expand the archive at the root of the project:': '我们现在可以开始对应用程序进行样式设计了。在项目根目录下下载并展开归档文件：',
        'Have a look at the templates, you might learn a trick or two about Twig.': '看看这些模板，您可能会学到一两个关于 Twig 的技巧。',
        'Building Assets': '构建资源',
        'One major change when using Webpack is that CSS and JS files are not usable directly by the application. They need to be "compiled" first.': '使用 Webpack 时的一个主要变化是，CSS 和 JS 文件不能由应用程序直接使用。它们需要先进行“编译”。',
        'In development, compiling the assets can be done via the encore dev command:': '在开发过程中，可以通过 <code translate="no" class="notranslate">encore dev</code> 命令来编译资源：',
        'Instead of executing the command each time there is a change, send it to the background and let it watch JS and CSS changes:': '而不是在每次更改时都执行命令，可以将其发送到后台并让它监视 JS 和 CSS 的更改：',
        'Take the time to discover the visual changes. Have a look at the new design in a browser.': '花点时间发现视觉上的变化。在浏览器中查看新设计。',
        'The generated login form is now styled as well as the Maker bundle uses Bootstrap CSS classes by default:': '现在，生成的登录表单也有了样式，因为 Maker bundle 默认使用 Bootstrap CSS 类：',
        'For production, Platform.sh automatically detects that you are using Encore and compiles the assets for you during the build phase.': '对于生产环境，Platform.sh 会自动检测到您正在使用 Encore，并在构建阶段为您编译资源。',
        'Going Further': '深入探索',
        //'Webpack docs;': '<a href="https://webpack.docschina.org/concepts/" class="reference external" rel="external noopener noreferrer" target="_blank">Webpack 文档</a>；',
        'Symfony Webpack Encore docs;': '<a href="https://symfony.com/doc/6.4/frontend.html" class="reference external">Symfony Webpack Encore 文档</a>；',
        'SymfonyCasts Webpack Encore tutorial.': '<a href="https://symfonycasts.com/screencast/webpack-encore" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Webpack Encore 教程</a>',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Caching for Performance': '缓存以提高性能',
        'Resizing Images': '调整图像大小'
    };

    fanyi(translates, 2);
})($);
