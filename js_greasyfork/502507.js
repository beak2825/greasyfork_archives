// ==UserScript==
// @name         Book for Symfony 6 翻译 27-spa.html
// @namespace    fireloong
// @version      0.1.0
// @description  构建单页面应用（SPA） 27-spa.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/27-spa.html
// @match        https://symfony.com/doc/current/the-fast-track/en/27-spa.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502507/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2027-spahtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502507/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2027-spahtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Building an SPA\n        \n            ': '构建单页面应用（SPA）',
        'Most of the comments will be submitted during the conference where some people do not bring a laptop. But they probably have a smartphone. What about creating a mobile app to quickly check the conference comments?': '大多数评论将在会议期间提交，而有些人没有带笔记本电脑。但他们可能有一部智能手机。那么制作一个可以快速查看会议评论的移动应用程序怎么样呢？',
        'One way to create such a mobile application is to build a Javascript Single Page Application (SPA). An SPA runs locally, can use local storage, can call a remote HTTP API, and can leverage service workers to create an almost native experience.': '创建这种移动应用程序的一种方法是构建一个 JavaScript 单页应用程序（SPA）。SPA 在本地运行，可以使用本地存储，可以调用远程 HTTP API，并且可以利用服务工作线程来创建几乎接近本地体验的体验。',
        'Creating the Application': '创建应用程序',
        'To create the mobile application, we are going to use Preact and Symfony Encore. Preact is a small and efficient foundation well-suited for the Guestbook SPA.': '为了创建移动应用程序，我们将使用 <a href="https://preactjs.com/" class="reference external" rel="external noopener noreferrer" target="_blank">Preact</a> 和 <strong>Symfony Encore</strong>。<strong>Preact</strong> 是一个小巧且高效的框架，非常适合用于 Guestbook SPA。',
        'To make both the website and the SPA consistent, we are going to reuse the Sass stylesheets of the website for the mobile application.': '为了使网站和 SPA 保持一致，我们将为移动应用程序重用网站的 Sass 样式表。',
        'Create the SPA application under the spa directory and copy the website stylesheets:': '在 sp a目录下创建 SPA 应用程序并复制网站样式表：',
        'We have created a public directory as we will mainly interact with the SPA via a browser. We could have named it build if we only wanted to build a mobile application.': '我们创建了一个 public 目录，因为我们主要通过浏览器与 SPA 进行交互。如果我们只想构建一个移动应用程序，我们可以将其命名为 build。',
        'For good measure, add a .gitignore file:': '为了保险起见，添加一个 <code translate="no" class="notranslate">.gitignore</code> 文件：',
        'Initialize the package.json file (equivalent of the composer.json file for JavaScript):': '初始化 <code translate="no" class="notranslate">package.json</code> 文件（相当于 JavaScript 的 <code translate="no" class="notranslate">composer.json</code> 文件）：',
        'Now, add some required dependencies:': '现在，添加一些必要的依赖项：',
        'The last configuration step is to create the Webpack Encore configuration:': '最后一步配置是创建 Webpack Encore 配置：',
        'Creating the SPA Main Template': '创建 SPA 主模板',
        'Time to create the initial template in which Preact will render the application:': '是时候创建 Preact 将在其中渲染应用程序的初始模板了：',
        'The <div> tag is where the application will be rendered by JavaScript. Here is the first version of the code that renders the "Hello World" view:': '<code translate="no" class="notranslate">&lt;div&gt;</code> 标签是 JavaScript 将要渲染应用程序的地方。这是渲染“Hello World”视图的代码的第一个版本：',
        'The last line registers the App() function on the #app element of the HTML page.': '最后一行在 HTML 页面的 <code translate="no" class="notranslate">#app</code> 元素上注册了 <code translate="no" class="notranslate">App()</code> 函数。',
        'Everything is now ready!': '现在一切准备就绪！',
        'Running an SPA in the Browser': '在浏览器中运行 SPA',
        'As this application is independent of the main website, we need to run another web server:': '由于此应用程序与主网站独立，我们需要运行另一个 Web 服务器：',
        'The --passthru flag tells the web server to pass all HTTP requests to the public/index.html file (public/ is the web server default web root directory). This page is managed by the Preact application and it gets the page to render via the "browser" history.': '<code translate="no" class="notranslate">--passthru</code> 标志告诉 Web 服务器将所有 HTTP 请求传递到 <code translate="no" class="notranslate">public/index.html</code> 文件（<code translate="no" class="notranslate">public/</code> 是 Web 服务器的默认 Web 根目录）。此页面由 Preact 应用程序管理，它通过“浏览器”历史记录获取要渲染的页面。',
        'To compile the CSS and the JavaScript files, run npm:': '要编译 CSS 和 JavaScript 文件，请运行 <code translate="no" class="notranslate">npm</code>：',
        'Open the SPA in a browser:': '在浏览器中打开 SPA：',
        'And look at our hello world SPA:': '然后看看我们的 hello world SPA：',
        'Adding a Router to handle States': '添加一个路由器来处理状态',
        'The SPA is currently not able to handle different pages. To implement several pages, we need a router, like for Symfony. We are going to use preact-router. It takes a URL as input and matches a Preact component to display.': '当前的 SPA 还不能处理不同的页面。为了实现多个页面，我们需要一个路由器，就像 Symfony 一样。我们将使用 <strong>preact-router</strong>。它接受一个 URL 作为输入，并匹配一个 Preact 组件以进行显示。',
        'Install preact-router:': '安装 preact-router',
        'Create a page for the homepage (a Preact component):': '为主页创建一个页面（一个 Preact 组件）：',
        'And another for the conference page:': '为会议页面创建另一个页面：',
        'Replace the "Hello World" div with the Router component:': '用 <code translate="no" class="notranslate">Router</code> 组件替换“Hello World”<code translate="no" class="notranslate">div</code>：',
        'Rebuild the application:': '重新构建应用程序：',
        'If you refresh the application in the browser, you can now click on the "Home" and conference links. Note that the browser URL and the back/forward buttons of your browser work as you would expect it.': '如果您在浏览器中刷新应用程序，现在可以单击“主页”和会议链接。请注意，浏览器 URL 和浏览器的后退/前进按钮将按预期工作。',
        'Styling the SPA': '为 SPA 设置样式',
        'As for the website, let\'s add the Sass loader:': '就像网站一样，让我们添加 Sass 加载器：',
        'Enable the Sass loader in Webpack and add a reference to the stylesheet:': '在 Webpack 中启用 Sass 加载器并添加对样式表的引用：',
        'We can now update the application to use the stylesheets:': '现在我们可以更新应用程序以使用样式表：',
        'Rebuild the application once more:': '再次重新构建应用程序：',
        'You can now enjoy a fully styled SPA:': '现在，您可以享受一个完全设置样式的 SPA：',
        'Fetching Data from the API': '从 API 获取数据',
        'The Preact application structure is now finished: Preact Router handles the page states - including the conference slug placeholder - and the main application stylesheet is used to style the SPA.': 'Preact 应用程序结构现已完成：Preact Router 处理页面状态（包括会议 slug 占位符），并且主要的应用程序样式表用于为 SPA 设置样式。',
        'To make the SPA dynamic, we need to fetch the data from the API via HTTP calls.': '为了使 SPA 具有动态性，我们需要通过 HTTP 调用从 API 获取数据。',
        'Configure Webpack to expose the API endpoint environment variable:': '配置 Webpack 以公开 API 端点环境变量：',
        'The API_ENDPOINT environment variable should point to the web server of the website where we have the API endpoint under /api. We will configure it properly when we run npm soon.': '<code translate="no" class="notranslate">API_ENDPOINT</code> 环境变量应指向包含 <code translate="no" class="notranslate">/api</code> 下 API 端点的网站 Web 服务器。我们将在稍后运行 <code translate="no" class="notranslate">npm</code> 时正确配置它。',
        'Create an api.js file that abstracts data retrieval from the API:': '创建一个 <code translate="no" class="notranslate">api.js</code> 文件，该文件从 API 中抽象出数据检索：',
        'You can now adapt the header and home components:': '现在，您可以调整标题和主页组件：',
        'Finally, Preact Router is passing the "slug" placeholder to the Conference component as a property. Use it to display the proper conference and its comments, again using the API; and adapt the rendering to use the API data:': '最后，Preact Router 将“slug”占位符作为属性传递给 Conference 组件。使用它来显示正确的会议及其评论，再次使用 API；并调整渲染以使用 API 数据：',
        'The SPA now needs to know the URL to our API, via the API_ENDPOINT environment variable. Set it to the API web server URL (running in the .. directory):': '现在，SPA 需要通过 <code translate="no" class="notranslate">API_ENDPOINT</code> 环境变量知道我们 API 的 URL。将其设置为 API Web 服务器 URL（在 <code translate="no" class="notranslate">..</code> 目录中运行）：',
        'You could also run in the background now:': '您现在也可以在后台运行：',
        'And the application in the browser should now work properly:': '现在，浏览器中的应用程序应该可以正常工作了：',
        'Wow! We now have a fully-functional, SPA with router and real data. We could organize the Preact app further if we wanted, but it is already working great.': '哇！我们现在有一个功能齐全、带有路由器和真实数据的 SPA。如果我们愿意，我们可以进一步组织 Preact 应用程序，但它现在工作得很好。',
        'Deploying the SPA to Production': '将 SPA 部署到生产环境',
        'Platform.sh allows deploying multiple applications per project. Adding another application can be done by creating a .platform.app.yaml file in any sub-directory. Create one under spa/ named spa:': 'Platform.sh 允许在每个项目中部署多个应用程序。通过在任何子目录中创建一个 <code translate="no" class="notranslate">.platform.app.yaml</code> 文件，可以添加另一个应用程序。在 <code translate="no" class="notranslate">spa/</code> 下创建一个名为 <code translate="no" class="notranslate">spa</code> 的文件：',
        'Edit the .platform/routes.yaml file to route the spa. subdomain to the spa application stored in the project root directory:': '编辑 <code translate="no" class="notranslate">.platform/routes.yaml</code> 文件，将 <code translate="no" class="notranslate">spa.</code> 子域路由到存储在项目根目录下的 <code translate="no" class="notranslate">spa</code> 应用程序：',
        'Configuring CORS for the SPA': '为 SPA 配置 CORS',
        'If you deploy the code now, it won\'t work as a browser would block the API request. We need to explicitly allow the SPA to access the API. Get the current domain name attached to your application:': '如果你现在部署代码，它将无法正常工作，因为浏览器会阻止 API 请求。我们需要明确允许 SPA 访问API。获取当前附加到您的应用程序的域名：',
        'Define the CORS_ALLOW_ORIGIN environment variable accordingly:': '相应地定义 <code translate="no" class="notranslate">CORS_ALLOW_ORIGIN</code> 环境变量：',
        'If your domain is https://master-5szvwec-hzhac461b3a6o.eu-5.platformsh.site/, the sed calls will convert it to https://spa.master-5szvwec-hzhac461b3a6o.eu-5.platformsh.site.': '如果你的域名是 <code translate="no" class="notranslate">https://master-5szvwec-hzhac461b3a6o.eu-5.platformsh.site/</code>，那么使用 <code translate="no" class="notranslate">sed</code> 命令会将其转换为 <code translate="no" class="notranslate">https://spa.master-5szvwec-hzhac461b3a6o.eu-5.platformsh.site</code>。',
        'We also need to set the API_ENDPOINT environment variable:': '我们还需要设置 <code translate="no" class="notranslate">API_ENDPOINT</code> 环境变量：',
        'Commit and deploy:': '提交并部署：',
        'Access the SPA in a browser by specifying the application as a flag:': '通过在浏览器中以标志的形式指定应用程序来访问 SPA：',
        'Using Cordova to build a Smartphone Application': '使用 Cordova 构建智能手机应用程序',
        'Apache Cordova is a tool that builds cross-platform smartphone applications. And good news, it can use the SPA that we have just created.': '<strong>Apache Cordova</strong> 是一个构建跨平台智能手机应用程序的工具。好消息是，它可以使用我们刚刚创建的 SPA（单页面应用程序）。',
        'Let\'s install it:': '让我们安装它：',
        'You also need to install the Android SDK. This section only mentions Android, but Cordova works with all mobile platforms, including iOS.': '您还需要安装 Android SDK。本部分仅提及 Android，但 Cordova 适用于所有移动平台，包括 iOS。',
        'Create the application directory structure:': '创建应用程序目录结构：',
        'And generate the Android application:': '并生成 Android 应用程序：',
        'That\'s all you need. You can now build the production files and move them to Cordova:': '这就是你所需要的。现在你可以构建生产文件并将其移动到 Cordova：',
        'Run the application on a smartphone or an emulator:': '在智能手机或模拟器上运行应用程序：',
        'Going Further': '深入探索',
        'The official Preact website;': '<a href="https://preactjs.com/" class="reference external" rel="external noopener noreferrer" target="_blank">Preact 的官方网站</a>；',
        'The official Cordova website.': '<a href="https://cordova.apache.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Cordova 的官方网站</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Exposing an API with API Platform': '使用 API Platform 公开 API',
        'Localizing an Application': '本地化应用程序'
    };

    fanyi(translates, 2);
})($);
