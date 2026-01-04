// ==UserScript==
// @name         Book for Symfony 6 翻译 9-backend.html
// @namespace    fireloong
// @version      0.0.6
// @description  设置管理后端 9-backend.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/9-backend.html
// @match        https://symfony.com/doc/current/the-fast-track/en/9-backend.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502035/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%209-backendhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502035/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%209-backendhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Setting up an Admin Backend\n        \n            ': '设置管理后端',
        'Adding upcoming conferences to the database is the job of project admins. An admin backend is a protected section of the website where project admins can manage the website data, moderate feedback submissions, and more.': '将即将举行的会议添加到数据库是项目管理员的工作。管理员后台是网站的受保护部分，项目管理员可以在其中管理网站数据、审核反馈提交等内容。',
        "How can we create this fast? By using a bundle that is able to generate an admin backend based on the project's model. EasyAdmin fits the bill perfectly.": '我们如何快速做到这一点？通过使用能够根据项目模型生成管理员后端的包。EasyAdmin 完全符合这一要求。',
        'Installing more Dependencies': '安装更多依赖项',
        'Even if the webapp package automatically added many nice packages, for some more specific features, we need to add more dependencies. How can we add more dependencies? Via Composer. Besides "regular" Composer packages, we will work with two "special" kinds of packages:': '即使 <code translate="no" class="notranslate">webapp</code> 包自动添加了许多不错的包，但对于一些更具体的功能，我们需要添加更多依赖项。我们如何添加更多依赖项？通过 Composer。除了“常规”Composer 包之外，我们还将使用两种“特殊”类型的包：',
        'Symfony Components: Packages that implement core features and low level abstractions that most applications need (routing, console, HTTP client, mailer, cache, ...);': '<em>Symfony 组件</em>：实现大多数应用程序所需的核心功能和低级抽象的包（路由、控制台、HTTP 客户端、邮件发送器、缓存、...）；',
        'Symfony Bundles: Packages that add high-level features or provide integrations with third-party libraries (bundles are mostly contributed by the community).': '<em>Symfony Bundles</em>：添加高级功能或与第三方库集成的包（包主要由社区贡献）。',
        "Let's add EasyAdmin as a project dependency:": '让我们将 EasyAdmin 添加为项目依赖项：',
        'admin is an alias for the easycorp/easyadmin-bundle package.': '<code translate="no" class="notranslate">admin</code> 是 <code translate="no" class="notranslate">easycorp/easyadmin-bundle</code> 包的别名。',
        'Aliases are not a Composer feature, but a concept provided by Symfony to make your life easier. Aliases are shortcuts for popular Composer packages. Want an ORM for your application? Require orm. Want to develop an API? Require api. These aliases are automatically resolved to one or more regular Composer packages. They are opinionated choices made by the Symfony core team.': '别名不是 Composer 的功能，而是 Symfony 提供的一个概念，旨在使您的工作更加轻松。别名是流行 Composer 包的快捷方式。想要为您的应用程序添加 ORM 吗？依赖 <code translate="no" class="notranslate">orm</code>。想要开发 API 吗？依赖 <code translate="no" class="notranslate">api</code>。这些别名会自动解析为一个或多个常规的 Composer 包。它们是 Symfony 核心团队的有见地的选择。',
        'Another neat feature is that you can always omit the symfony vendor. Require cache instead of symfony/cache.': '另一个整洁的功能是，您始终可以省略 <code translate="no" class="notranslate">symfony</code> 供应商。依赖 <code translate="no" class="notranslate">cache</code> 而不是 <code translate="no" class="notranslate">symfony/cache</code>。',
        'Do you remember that we mentioned a Composer plugin named symfony/flex before? Aliases are one of its features.': '您还记得我们之前提到的名为 <code translate="no" class="notranslate">symfony/flex</code> 的 Composer 插件吗？别名就是它的功能之一。',
        'Configuring EasyAdmin': '配置 EasyAdmin',
        'EasyAdmin automatically generates an admin area for your application based on specific controllers.': 'EasyAdmin 会根据特定的控制器自动为您的应用程序生成一个管理区域。',
        'To get started with EasyAdmin, let\'s generate a "web admin dashboard" which will be the main entry point to manage the website data:': '要开始使用 EasyAdmin，让我们生成一个“Web 管理仪表板”，这将是管理网站数据的主要入口点：',
        'Accepting the default answers creates the following controller:': '接受默认答案将创建以下控制器：',
        'By convention, all admin controllers are stored under their own App\\Controller\\Admin namespace.': '按照惯例，所有管理控制器都存储在它们自己的 <code translate="no" class="notranslate">App\\Controller\\Admin</code> 命名空间中。',
        'Access the generated admin backend at /admin as configured by the index() method; you can change the URL to anything you like:': '通过 <code translate="no" class="notranslate">index()</code> 方法配置的 <code translate="no" class="notranslate">/admin</code> 路径访问生成的管理员后台；您可以将 URL 更改为任何您喜欢的路径：',
        'Boom! We have a nice looking admin interface shell, ready to be customized to our needs.': '太棒了！我们有一个看起来不错的管理员界面外壳，可以根据我们的需要进行定制。',
        'The next step is to create controllers to manage conferences and comments.': '下一步是创建控制器来管理会议和评论。',
        'In the dashboard controller, you might have noticed the configureMenuItems() method which has a comment about adding links to "CRUDs". CRUD is an acronym for "Create, Read, Update, and Delete", the four basic operations you want to do on any entity. That\'s exactly what we want an admin to perform for us; EasyAdmin even takes it to the next level by also taking care of searching and filtering.': '在仪表板控制器中，您可能已经注意到了 <code translate="no" class="notranslate">configureMenuItems()</code> 方法，该方法包含有关添加指向“CRUD”链接的注释。 <strong>CRUD</strong> 是“创建、读取、更新和删除”的缩写，是您希望在任何实体上执行的四个基本操作。这正是我们希望管理员为我们执行的操作；EasyAdmin 甚至通过处理搜索和过滤将其提升到了新的水平。',
        "Let's generate a CRUD for conferences:": '让我们为会议生成一个 CRUD：',
        'Select 1 to create an admin interface for conferences and use the defaults for the other questions. The following file should be generated:': '选择 <code translate="no" class="notranslate">1</code> 为会议创建管理界面，并使用其它问题的默认值。应生成以下文件：',
        'Do the same for comments:': '对评论执行相同的操作：',
        'The last step is to link the conference and comment admin CRUDs to the dashboard:': '最后一步是将会议和评论管理 CRUD 链接到仪表板：',
        'We have overridden the configureMenuItems() method to add menu items with relevant icons for conferences and comments and to add a link back to the website home page.': '我们已经重写了 <code translate="no" class="notranslate">configureMenuItems()</code> 方法，以便为会议和评论添加带有相关图标的菜单项，并添加了一个链接回到网站主页。',
        'EasyAdmin exposes an API to ease linking to entity CRUDs via the MenuItem::linkToRoute() method.': 'EasyAdmin 提供了一个 API，通过 <code translate="no" class="notranslate">MenuItem::linkToRoute()</code> 方法简化与实体 CRUD 的链接。',
        "The main dashboard page is empty for now. This is where you can display some statistics, or any relevant information. As we don't have any important to display, let's redirect to the conference list:": '目前，主仪表板页面是空的。您可以在此处显示一些统计信息或任何相关信息。由于我们没有要显示的任何重要内容，因此让我们重定向到会议列表：',
        'When displaying entity relationships (the conference linked to a comment), EasyAdmin tries to use a string representation of the conference. By default, it uses a convention that uses the entity name and the primary key (like Conference #1) if the entity does not define the "magic" __toString() method. To make the display more meaningful, add such a method on the Conference class:': '在显示实体关系（与评论相关的会议）时，EasyAdmin 会尝试使用会议的字符串表示形式。默认情况下，如果实体未定义“魔术”的 <code translate="no" class="notranslate">__toString()</code> 方法，它将使用使用实体名称和主键（如 <code translate="no" class="notranslate">Conference #1</code>）的约定。为了使显示更有意义，请在 <code translate="no" class="notranslate">Conference</code> 类上添加此类方法：',
        'You can now add/modify/delete conferences directly from the admin backend. Play with it and add at least one conference.': '现在，您可以直接从管理员后端添加/修改/删除会议。试用一下，并至少添加一个会议。',
        'Customizing EasyAdmin': '自定义 EasyAdmin',
        "The default admin backend works well, but it can be customized in many ways to improve the experience. Let's do some simple changes to the Comment entity to demonstrate some possibilities:": '默认的管理员后端工作得很好，但可以通过多种方式自定义以改善体验。让我们对 Comment 实体进行一些简单的更改，以展示一些可能性：',
        'To customize the Comment section, listing the fields explicitly in the configureFields() method lets us order them the way we want. Some fields are further configured, like hiding the text field on the index page.': '为了自定义 <code translate="no" class="notranslate">Comment</code> 部分，在 <code translate="no" class="notranslate">configureFields()</code> 方法中明确列出字段可以让我们按照我们想要的方式对它们进行排序。一些字段被进一步配置，例如隐藏索引页面上的文本字段。',
        'Add some comments without photos. Set the date manually for now; we will fill-in the createdAt column automatically in a later step.': '添加一些没有照片的评论。现在请手动设置日期；我们将在后续步骤中自动填充 <code translate="no" class="notranslate">createdAt</code> 列。',
        'The configureFilters() method defines which filters to expose on top of the search field.': '<code translate="no" class="notranslate">configureFilters()</code> 方法定义了要在搜索框上方显示哪些过滤器。',
        'These customizations are just a small introduction to the possibilities given by EasyAdmin.': '这些自定义只是 EasyAdmin 提供可能性的简要介绍。',
        "Play with the admin, filter the comments by conference, or search comments by email for instance. The only issue is that anybody can access the backend. Don't worry, we will secure it in a future step.": '使用管理员，按会议筛选评论，或按电子邮件搜索评论。唯一的问题是任何人都可以访问后端。不用担心，我们将在后续步骤中保护它。',
        'Going Further': '深入探索',
        'EasyAdmin docs;': '<a href="https://symfony.com/bundles/EasyAdminBundle/4.x/index.html" class="reference external">EasyAdmin 文档</a>；',
        'Symfony framework configuration reference;': '<a href="https://symfony.com/doc/current/reference/configuration/framework.html" class="reference external">Symfony 框架配置参考</a>；',
        'PHP magic methods.': '<a href="https://www.php.net/manual/zh/language.oop5.magic.php" class="reference external" rel="external noopener noreferrer" target="_blank">PHP 魔术方法</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Describing the Data Structure': '描述数据结构',
        'Building the User Interface': '构建用户界面'
    };

    fanyi(translates, 2);
})($);
