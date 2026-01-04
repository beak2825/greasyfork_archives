// ==UserScript==
// @name         Book for Symfony 6 翻译 26-api.html
// @namespace    fireloong
// @version      0.1.0
// @description  使用 API Platform 公开 API 26-api.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/26-api.html
// @match        https://symfony.com/doc/current/the-fast-track/en/26-api.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502506/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2026-apihtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502506/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2026-apihtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Exposing an API with API Platform\n        \n            ': '使用 API Platform 公开 API',
        'We have finished the implementation of the Guestbook website. To allow more usage of the data, what about exposing an API now? An API could be used by a mobile application to display all conferences, their comments, and maybe let attendees submit comments.': '我们已经完成了 Guestbook 网站的实现。为了允许更多地使用数据，现在暴露一个 API 怎么样？API 可以被移动应用程序使用来显示所有会议、它们的评论，并允许与会者提交评论。',
        'In this step, we are going to implement a read-only API.': '在这一步中，我们将实现一个只读 API。',
        'Installing API Platform': '安装 API Platform',
        'Exposing an API by writing some code is possible, but if we want to use standards, we\'d better use a solution that already takes care of the heavy lifting. A solution like API Platform:': '通过编写一些代码来暴露 API 是可能的，但如果我们想要使用标准，那么最好使用一个已经解决了繁重工作的解决方案。比如 API Platform：',
        'Exposing an API for Conferences': '为会议暴露 API',
        'A few attributes on the Conference class is all we need to configure the API:': '我们只需要在 Conference 类上添加几个注解来配置 API：',
        'The main ApiResource attribute configures the API for conferences. It restricts possible operations to get and configures various things: like which fields to display and how to order the conferences.': '主要的 <code translate="no" class="notranslate">ApiResource</code> 属性为会议配置了 API。它限制了可能的操作以进行 <code translate="no" class="notranslate">get</code>，并配置了各种事项：例如要显示的字段以及如何对会议进行排序。',
        'By default, the main entry point for the API is /api thanks to configuration from config/routes/api_platform.yaml that was added by the package\'s recipe.': '由于包配方添加的 <code translate="no" class="notranslate">config/routes/api_platform.yaml</code> 中的配置，API 的默认主要入口点是 <code translate="no" class="notranslate">/api</code>。',
        'A web interface allows you to interact with the API:': 'Web 界面允许您与 API 进行交互：',
        'Use it to test the various possibilities:': '使用它来测试各种可能性：',
        'Imagine the time it would take to implement all of this from scratch!': '想象一下从头开始实现这一切需要多长时间！',
        'Exposing an API for Comments': '为评论暴露 API',
        'Do the same for comments:': '对评论执行相同的操作：',
        'The same kind of attributes are used to configure the class.': '使用相同类型的注解来配置类。',
        'Restricting Comments exposed by the API': '限制 API 公开的评论',
        'By default, API Platform exposes all entries from the database. But for comments, only the published ones should be part of the API.': '默认情况下，API Platform 会公开数据库中的所有条目。但对于评论，只有已发布的评论才应该是 API 的一部分。',
        'When you need to restrict the items returned by the API, create a service that implements QueryCollectionExtensionInterface to control the Doctrine query used for collections and/or QueryItemExtensionInterface to control items:': '当您需要限制 API 返回的项时，请创建一个实现 <code translate="no" class="notranslate">QueryCollectionExtensionInterface</code> 的服务以控制用于集合的 Doctrine 查询，和/或实现 <code translate="no" class="notranslate">QueryItemExtensionInterface</code> 以控制项：',
        'The query extension class applies its logic only for the Comment resource and modify the Doctrine query builder to only consider comments in the published state.': '查询扩展类仅对 <code translate="no" class="notranslate">Comment</code> 资源应用其逻辑，并修改 Doctrine 查询生成器以仅考虑 <code translate="no" class="notranslate">published</code> 状态的评论。',
        'Configuring CORS': '配置 CORS',
        'By default, the same-origin security policy of modern HTTP clients make calling the API from another domain forbidden. The CORS bundle, installed as part of composer req api, sends Cross-Origin Resource Sharing headers based on the CORS_ALLOW_ORIGIN environment variable.': '默认情况下，现代 HTTP 客户端的同源安全策略禁止从另一个域调用 API。作为 <code translate="no" class="notranslate">composer req api</code> 的一部分安装的 CORS 包会根据 <code translate="no" class="notranslate">CORS_ALLOW_ORIGIN</code> 环境变量发送跨源资源共享头。',
        'By default, its value, defined in .env, allows HTTP requests from localhost and 127.0.0.1 on any port. That\'s exactly what we need as for the next step as we will create an SPA that will have its own web server that will call the API.': '默认情况下，它在 <code translate="no" class="notranslate">.env</code> 中定义的值允许来自 <code translate="no" class="notranslate">localhost</code> 和 <code translate="no" class="notranslate">127.0.0.1</code> 上任何端口的 HTTP 请求。这正是我们在下一步所需要的，因为我们将创建一个 SPA，它将拥有自己的 Web 服务器来调用 API。',
        'Going Further': '深入探索',
        'SymfonyCasts API Platform tutorial;': '<a href="https://symfonycasts.com/screencast/api-platform" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts API Platform 教程</a>；',
        'To enable the GraphQL support, run composer require webonyx/graphql-php, then browse to /api/graphql.': '要启用 GraphQL 支持，请运行 <code translate="no" class="notranslate">composer require webonyx/graphql-php</code>，然后浏览到 <code translate="no" class="notranslate">/api/graphql</code>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Notifying by all Means': '用尽一切手段通知',
        'Building an SPA': '构建单页面应用（SPA）'
    };

    fanyi(translates, 2);
})($);
