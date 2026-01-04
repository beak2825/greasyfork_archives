// ==UserScript==
// @name         Book for Symfony 6 翻译 20-emails.html
// @namespace    fireloong
// @version      0.1.0
// @description  向管理员发送电子邮件 20-emails.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/20-emails.html
// @match        https://symfony.com/doc/current/the-fast-track/en/20-emails.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502459/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2020-emailshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502459/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2020-emailshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Emailing Admins\n        \n            ': '向管理员发送电子邮件',
        'To ensure high quality feedback, the admin must moderate all comments. When a comment is in the ham or potential_spam state, an email should be sent to the admin with two links: one to accept the comment and one to reject it.': '为了确保高质量的反馈，管理员必须审核所有评论。当评论处于 <code translate="no" class="notranslate">ham</code> 或 <code translate="no" class="notranslate">potential_spam</code> 状态时，应向管理员发送一封包含两个链接的电子邮件：一个用于接受评论，另一个用于拒绝评论。',
        'Setting an Email for the Admin': '为管理员设置电子邮件',
        'To store the admin email, use a container parameter. For demonstration purposes, we also allow it to be set via an environment variable (should not be needed in "real life"):': '为了存储管理员电子邮件，请使用容器参数。为了演示目的，我们还允许通过环境变量进行设置（在“现实生活”中应该不需要）：',
        'An environment variable might be "processed" before being used. Here, we are using the default processor to fall back to the value of the default_admin_email parameter if the ADMIN_EMAIL environment variable does not exist.': '环境变量在使用之前可能会被“处理”。在这里，我们使用 <code translate="no" class="notranslate">default</code> 处理器来回退到 <code translate="no" class="notranslate">default_admin_email</code> 参数的值（如果 <code translate="no" class="notranslate">ADMIN_EMAIL</code> 环境变量不存在）。',
        'Sending a Notification Email': '发送通知电子邮件',
        'To send an email, you can choose between several Email class abstractions; from Message, the lowest level, to NotificationEmail, the highest one. You will probably use the Email class the most, but NotificationEmail is the perfect choice for internal emails.': '要发送电子邮件，您可以在几种 <code translate="no" class="notranslate">Email</code> 类抽象之间进行选择；从最低级别的 <code translate="no" class="notranslate">Message</code> 到最高级别的 <code translate="no" class="notranslate">NotificationEmail</code>。您可能会最常使用 <code translate="no" class="notranslate">Email</code> 类，但 <code translate="no" class="notranslate">NotificationEmail</code> 是内部电子邮件的完美选择。',
        'In the message handler, let\'s replace the auto-validation logic:': '在消息处理器中，让我们替换自动验证逻辑：',
        'The MailerInterface is the main entry point and allows to send() emails.': '<code translate="no" class="notranslate">MailerInterface</code> 是主要的入口点，允许 <code translate="no" class="notranslate">send()</code> 电子邮件。',
        'To send an email, we need a sender (the From/Sender header). Instead of setting it explicitly on the Email instance, define it globally:': '要发送电子邮件，我们需要一个发件人（<code translate="no" class="notranslate">From</code>/<code translate="no" class="notranslate">Sender</code> 标题）。而不是在 Email 实例上明确设置它，而是在全局范围内定义它：',
        'Extending the Notification Email Template': '扩展通知电子邮件模板',
        'The notification email template inherits from the default notification email template that comes with Symfony:': '通知电子邮件模板继承自 Symfony 附带的默认通知电子邮件模板：',
        'The template overrides a few blocks to customize the message of the email and to add some links that allow the admin to accept or reject a comment. Any route argument that is not a valid route parameter is added as a query string item (the reject URL looks like /admin/comment/review/42?reject=true).': '模板重写了一些块以自定义电子邮件的消息，并添加了一些链接，这些链接允许管理员接受或拒绝评论。任何不是有效路由参数的路由参数都将作为查询字符串项添加（拒绝URL看起来像 <code translate="no" class="notranslate">/admin/comment/review/42?reject=true</code>）。',
        'The default NotificationEmail template uses Inky instead of HTML to design emails. It helps create responsive emails that are compatible with all popular email clients.': '默认的 <code translate="no" class="notranslate">NotificationEmail</code> 模板使用 <a href="https://get.foundation/emails/docs/inky.html" class="reference external" rel="external noopener noreferrer" target="_blank">Inky</a> 而不是 HTML 来设计电子邮件。它有助于创建与所有流行的电子邮件客户端兼容的响应式电子邮件。',
        'For maximum compatibility with email readers, the notification base layout inlines all stylesheets (via the CSS inliner package) by default.': '为了与电子邮件阅读器实现最大程度的兼容性，通知基础布局默认会将所有样式表内联（通过 CSS 内联包）。',
        'These two features are part of optional Twig extensions that need to be installed:': '这两个功能是可选的 Twig 扩展的一部分，需要安装：',
        'Generating Absolute URLs in a Symfony Command': '在 Symfony 命令中生成绝对 URL',
        'In emails, generate URLs with url() instead of path() as you need absolute ones (with scheme and host).': '在电子邮件中，使用 <code translate="no" class="notranslate">url()</code> 而不是 <code translate="no" class="notranslate">path()</code> 生成 URL，因为您需要绝对 URL（带有方案和主机）。',
        'The email is sent from the message handler, in a console context. Generating absolute URLs in a Web context is easier as we know the scheme and domain of the current page. This is not the case in a console context.': '电子邮件是从消息处理器在控制台上下文中发送的。在 Web 上下文中生成绝对 URL 更为容易，因为我们知道当前页面的方案和域。在控制台上下文中则不是这样。',
        'Define the domain name and scheme to use explicitly:': '明确定义要使用的域名和方案：',
        'The SYMFONY_DEFAULT_ROUTE_URL environment variable is automatically set locally when using the symfony CLI and determined based on the configuration on Platform.sh.': '当使用 <code translate="no" class="notranslate">symfony</code> CLI 时，<code translate="no" class="notranslate">SYMFONY_DEFAULT_ROUTE_URL</code> 环境变量会在本地自动设置，并根据 Platform.sh 上的配置进行确定。',
        'Wiring a Route to a Controller': '将路由连接到控制器',
        'The review_comment route does not exist yet, let\'s create an admin controller to handle it:': '<code translate="no" class="notranslate">review_comment</code> 路由尚不存在，让我们创建一个管理员控制器来处理它：',
        'The review comment URL starts with /admin/ to protect it with the firewall defined in a previous step. The admin needs to be authenticated to access this resource.': '审核评论的 URL 以 <code translate="no" class="notranslate">/admin/</code> 开头，以通过上一步中定义的防火墙进行保护。管理员需要验证身份才能访问此资源。',
        'Instead of creating a Response instance, we have used render(), a shortcut method provided by the AbstractController controller base class.': '我们没有创建 <code translate="no" class="notranslate">Response</code> 实例，而是使用了由 <code translate="no" class="notranslate">AbstractController</code> 控制器基类提供的 <code translate="no" class="notranslate">render()</code> 快捷方式方法。',
        'When the review is done, a short template thanks the admin for their hard work:': '当审核完成后，一个简短的模板会感谢管理员的辛勤工作：',
        'Using a Mail Catcher': '使用邮件拦截器',
        'Instead of using a "real" SMTP server or a third-party provider to send emails, let\'s use a mail catcher. A mail catcher provides an SMTP server that does not deliver the emails, but makes them available through a Web interface instead. Fortunately, Symfony has already configured such a mail catcher automatically for us:': '与其使用“真实”的 SMTP 服务器或第三方提供商来发送电子邮件，不如我们使用邮件拦截器。邮件拦截器提供了一个 SMTP 服务器，它不发送电子邮件，但可以通过 Web 界面提供这些邮件。幸运的是，Symfony 已经为我们自动配置了这样的邮件拦截器：',
        'Accessing the Webmail': '访问网络邮件',
        'You can open the webmail from a terminal:': '您可以从终端打开网络邮件：',
        'Or from the web debug toolbar:': '或者从网络调试工具栏中：',
        'Submit a comment, you should receive an email in the webmail interface:': '提交评论后，您应该在网络邮件界面中收到一封电子邮件：',
        'Click on the email title on the interface and accept or reject the comment as you see fit:': '点击界面上的电子邮件标题，并根据您的需要接受或拒绝评论：',
        'Check the logs with server:log if that does not work as expected.': '如果未按预期工作，请使用 <code translate="no" class="notranslate">server:log</code> 检查日志。',
        'Managing Long-Running Scripts': '管理长时间运行的脚本',
        'Having long-running scripts comes with behaviors that you should be aware of. Unlike the PHP model used for HTTP where each request starts with a clean state, the message consumer is running continuously in the background. Each handling of a message inherits the current state, including the memory cache. To avoid any issues with Doctrine, its entity managers are automatically cleared after the handling of a message. You should check if your own services need to do the same or not.': '长时间运行的脚本会带来一些你应该注意的行为。与 HTTP 使用的 PHP 模型不同，后者每个请求都以干净的状态开始，消息消费者则在后台连续运行。每条消息的处理都会继承当前状态，包括内存缓存。为了避免与 Doctrine 相关的任何问题，在处理完一条消息后，其实体管理器会自动清除。你应该检查你自己的服务是否需要这样做。',
        'Sending Emails Asynchronously': '异步发送电子邮件',
        'The email sent in the message handler might take some time to be sent. It might even throw an exception. In case of an exception being thrown during the handling of a message, it will be retried. But instead of retrying to consume the comment message, it would be better to actually just retry sending the email.': '消息处理器中发送的电子邮件可能需要一些时间才能发送。它甚至可能引发异常。如果在处理消息时引发异常，则会重试。但是，与其重试消费评论消息，不如实际重试发送电子邮件。',
        'We already know how to do that: send the email message on the bus.': '我们已经知道如何做到这一点：在总线上发送电子邮件消息。',
        'A MailerInterface instance does the hard work: when a bus is defined, it dispatches the email messages on it instead of sending them. No changes are needed in your code.': '<code translate="no" class="notranslate">MailerInterface</code> 实例完成了繁重的工作：当定义了总线时，它会在总线上分发电子邮件消息，而不是发送它们。您的代码无需进行任何更改。',
        'The bus is already sending the email asynchronously as per the default Messenger configuration:': '根据默认的 Messenger 配置，总线已经异步发送电子邮件：',
        'Even if we are using the same transport for comment messages and email messages, it does not have to be the case. You could decide to use another transport to manage different message priorities for instance. Using different transports also gives you the opportunity to have different worker machines handling different kinds of messages. It is flexible and up to you.': '即使我们为评论消息和电子邮件消息使用相同的传输方式，也不必如此。例如，您可以决定使用另一种传输方式来管理不同的消息优先级。使用不同的传输方式还使您有机会拥有处理不同类型消息的不同工作机器。它非常灵活，由您决定。',
        'Testing Emails': '测试邮件',
        'There are many ways to test emails.': '测试电子邮件有很多方法。',
        'You can write unit tests if you write a class per email (by extending Email or TemplatedEmail for instance).': '如果您为每封电子邮件编写一个类（例如，通过扩展 <code translate="no" class="notranslate">Email</code> 或 <code translate="no" class="notranslate">TemplatedEmail</code>），则可以编写单元测试。',
        'The most common tests you will write though are functional tests that check that some actions trigger an email, and probably tests about the content of the emails if they are dynamic.': '不过，您最常编写的测试是功能测试，这些测试会检查某些操作是否会触发电子邮件，以及如果电子邮件是动态的，则可能会测试电子邮件的内容。',
        'Symfony comes with assertions that ease such tests, here is a test example that demonstrates some possibilities:': 'Symfony 提供了简化此类测试的断言，以下是一个测试示例，展示了其中的一些可能性：',
        'These assertions work when emails are sent synchronously or asynchronously.': '这些断言在电子邮件同步或异步发送时都有效。',
        'Sending Emails on Platform.sh': '在 Platform.sh 上发送电子邮件',
        'There is no specific configuration for Platform.sh. All accounts come with a SendGrid account that is automatically used to send emails.': 'Platform.sh 没有特定的配置。所有帐户都附带一个 SendGrid 帐户，该帐户会自动用于发送电子邮件。',
        'To be on the safe side, emails are only sent on the master branch by default. Enable SMTP explicitly on non-master branches if you know what you are doing:': '为了安全起见，默认情况下，仅在 <code translate="no" class="notranslate">master</code> 分支上发送电子邮件。如果您知道自己在做什么，请在非 <code translate="no" class="notranslate">master</code> 分支上明确启用 SMTP：',
        'Going Further': '深入探索',
        'SymfonyCasts Mailer tutorial;': '<a href="https://symfonycasts.com/screencast/mailer" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts 邮件器教程</a>；',
        'The Inky templating language docs;': '<a href="https://get.foundation/emails/docs/inky.html" class="reference external" rel="external noopener noreferrer" target="_blank">Inky 模板语言文档</a>；',
        'The Environment Variable Processors;': '<a href="https://symfony.com/doc/6.4/configuration/env_var_processors.html" class="reference external">环境变量处理器</a>；',
        'The Symfony Framework Mailer documentation;': '<a href="https://symfony.com/doc/6.4/mailer.html" class="reference external">Symfony 框架邮件器文档</a>；',
        'The Platform.sh documentation about Emails.': '<a href="https://symfony.com/doc/current/cloud/services/emails.html" class="reference external">Platform.sh 关于电子邮件的文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Making Decisions with a Workflow': '使用工作流程做出决策',
        'Caching for Performance': '缓存以提高性能'
    };

    fanyi(translates, 2);
})($);
