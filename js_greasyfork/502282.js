// ==UserScript==
// @name         Book for Symfony 6 翻译 15-security.html
// @namespace    fireloong
// @version      0.0.6
// @description  保护管理后台的安全 15-security.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/15-security.html
// @match        https://symfony.com/doc/current/the-fast-track/en/15-security.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502282/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2015-securityhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502282/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2015-securityhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Securing the Admin Backend\n        \n            ': '保护管理后台的安全',
        'The admin backend interface should only be accessible by trusted people. Securing this area of the website can be done using the Symfony Security component.': '只有受信任的人员才能访问管理后端界面。可以使用 Symfony 安全组件来保护网站的这个区域。',
        'Defining a User Entity': '定义一个用户实体',
        'Even though attendees won\'t be able to create their own accounts on the website, we are going to create a fully functional authentication system for the admin. We will therefore only have one user, the website admin.': '尽管参会者无法在网站上创建自己的帐户，但我们将为管理员创建一个功能齐全的身份验证系统。因此，我们将只有一个用户，即网站管理员。',
        'The first step is to define a User entity. To avoid any confusions, let\'s name it Admin instead.': '第一步是定义一个 <code translate="no" class="notranslate">User</code> 实体。为了避免任何混淆，我们将其命名为 <code translate="no" class="notranslate">Admin</code>。',
        'To integrate the Admin entity with the Symfony Security authentication system, it needs to follow some specific requirements. For instance, it needs a password property.': '要将 <code translate="no" class="notranslate">Admin</code> 实体与 Symfony Security 身份验证系统集成，它需要遵循一些特定的要求。例如，它需要一个 <code translate="no" class="notranslate">password</code> 属性。',
        'Use the dedicated make:user command to create the Admin entity instead of the traditional make:entity one:': '使用专用的 <code translate="no" class="notranslate">make:user</code> 命令来创建 <code translate="no" class="notranslate">Admin</code> 实体，而不是传统的 <code translate="no" class="notranslate">make:entity</code> 命令：',
        'Answer the interactive questions: we want to use Doctrine to store the admins (yes), use username for the unique display name of admins, and each user will have a password (yes).': '回答交互式问题：我们希望使用 Doctrine 来存储管理员（<code translate="no" class="notranslate">yes</code>），使用用户名作为管理员的唯一显示名称，并且每个用户都将有一个密码（<code translate="no" class="notranslate">yes</code>）。',
        'The generated class contains methods like getRoles(), eraseCredentials(), and a few others that are needed by the Symfony authentication system.': '生成的类包含如 <code translate="no" class="notranslate">getRoles()</code>、<code translate="no" class="notranslate">eraseCredentials()</code> 等 Symfony 身份验证系统所需的方法以及其它几个方法。',
        'If you want to add more properties to the Admin user, use make:entity.': '如果你想向 <code translate="no" class="notranslate">Admin</code> 用户添加更多属性，请使用 <code translate="no" class="notranslate">make:entity</code>。',
        'In addition to generating the Admin entity, the command also updated the security configuration to wire the entity with the authentication system:': '除了生成 <code translate="no" class="notranslate">Admin</code> 实体之外，该命令还更新了安全配置，以将实体与身份验证系统集成：',
        'We let Symfony select the best possible algorithm for hashing passwords (which will evolve over time).': '我们让 Symfony 选择最适合散列密码的算法（这将随着时间的推移而发展）。',
        'Time to generate a migration and migrate the database:': '是时候生成迁移并迁移数据库了：',
        'Generating a Password for the Admin User': '为管理员用户生成密码',
        'We won\'t develop a dedicated system to create admin accounts. Again, we will only ever have one admin. The login will be admin and we need to generate the password hash.': '我们不会开发一个专门用于创建管理员帐户的系统。同样，我们永远只有一个管理员。登录名将是 <code translate="no" class="notranslate">admin</code>，我们需要生成密码哈希值。',
        'Choose whatever you like as a password and run the following command to generate the password hash:': '选择你喜欢的任何密码，并运行以下命令来生成密码哈希值：',
        'Creating an Admin': '创建一个管理员',
        'Insert the admin user via an SQL statement:': '通过 SQL 语句插入管理员用户：',
        'Note the escaping of the $ sign in the password column value; escape them all!': '请注意在密码列值中对 <code translate="no" class="notranslate">$</code> 符号的转义；全部转义！',
        'Configuring the Security Authentication': '配置安全身份验证',
        'Now that we have an admin user, we can secure the admin backend. Symfony supports several authentication strategies. Let\'s use a classic and popular form authentication system.': '既然我们有了管理员用户，我们就可以保护管理后端。Symfony 支持多种身份验证策略。让我们使用经典且流行的表单身份验证系统。',
        'Run the make:security:form-login command to update the security configuration, generate a login template, and create an authenticator:': '运行 <code translate="no" class="notranslate">make:security:form-login</code> 命令以更新安全配置，生成登录模板，并创建身份验证器：',
        'Name the controller SecurityController and generate a /logout URL (yes).': '将控制器命名为 <code translate="no" class="notranslate">SecurityController</code> 并生成 <code translate="no" class="notranslate">/logout</code> URL（<code translate="no" class="notranslate">yes</code>）。',
        'The command updated the security configuration to wire the generated classes:': '该命令更新了安全配置以连接生成的类：',
        'How do I remember that the EasyAdmin route is admin (as configured in App\\Controller\\Admin\\DashboardController)? I don\'t. You can have a look at the file, but you can also run the following command that shows the association between route names and paths:': '我如何记住 EasyAdmin 的路由是 <code translate="no" class="notranslate">admin</code>（如 <code translate="no" class="notranslate">App\\Controller\\Admin\\DashboardController</code> 中配置的那样）？我不记得了。你可以查看文件，但你也可以运行以下命令来显示路由名称和路径之间的关联：',
        'Adding Authorization Access Control Rules': '添加授权访问控制规则',
        'A security system is made of two parts: authentication and authorization. When creating the admin user, we gave them the ROLE_ADMIN role. Let\'s restrict the /admin section to users having this role by adding a rule to access_control:': '安全系统由两部分组成：身份验证和授权。在创建管理员用户时，我们为他们分配了 <code translate="no" class="notranslate">ROLE_ADMIN</code> 角色。让我们通过在 <code translate="no" class="notranslate">access_control</code> 中添加规则来限制只有具有此角色的用户才能访问 <code translate="no" class="notranslate">/admin</code> 部分：',
        'The access_control rules restrict access by regular expressions. When trying to access a URL that starts with /admin, the security system will check for the ROLE_ADMIN role on the logged-in user.': '<code translate="no" class="notranslate">access_control</code> 规则通过正则表达式限制访问。当尝试访问以 <code translate="no" class="notranslate">/admin</code> 开头的 URL 时，安全系统将检查登录用户是否具有 <code translate="no" class="notranslate">ROLE_ADMIN</code> 角色。',
        'Authenticating via the Login Form': '通过登录表单进行身份验证',
        'If you try to access the admin backend, you should now be redirected to the login page and prompted to enter a login and a password:': '如果你现在尝试访问管理后端，你应该会被重定向到登录页面，并提示你输入登录名和密码：',
        'Log in using admin and whatever plain-text password you chose earlier. If you copied my SQL command exactly, the password is admin.': '使用 <code translate="no" class="notranslate">admin</code> 和你之前选择的任何纯文本密码登录。如果你完全复制了我的 SQL 命令，密码就是 <code translate="no" class="notranslate">admin</code>。',
        'Note that EasyAdmin automatically recognizes the Symfony authentication system:': '请注意，EasyAdmin 会自动识别 Symfony 身份验证系统：',
        'Try to click on the "Sign out" link. You have it! A fully-secured backend admin.': '尝试点击“注销”链接。你做到了！一个完全安全的后端管理员。',
        'If you want to create a fully-featured form authentication system, have a look at the make:registration-form command.': '如果你想创建一个功能齐全的表单身份验证系统，请查看 <code translate="no" class="notranslate">make:registration-form</code> 命令。',
        'Going Further': '深入探索',
        'The Symfony Security docs;': '<a href="https://symfony.com/doc/6.4/security.html" class="reference external">Symfony 安全文档</a>；',
        'SymfonyCasts Security tutorial;': '<a href="https://symfonycasts.com/screencast/symfony-security" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 安全教程</a>；',
        'How to Build a Login Form in Symfony applications;': '如何在 Symfony 应用程序中<a href="https://symfony.com/doc/6.4/security/form_login_setup.html" class="reference external">构建登录表单</a>；',
        'The Symfony Security Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony4/security_en_44.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 安全速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Accepting Feedback with Forms': '使用表单接收反馈',
        'Preventing Spam with an API': '使用 API 防止垃圾邮件'
    };

    fanyi(translates, 2);
})($);
