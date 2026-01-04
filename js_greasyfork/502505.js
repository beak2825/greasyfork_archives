// ==UserScript==
// @name         Book for Symfony 6 翻译 25-notifier.html
// @namespace    fireloong
// @version      0.1.0
// @description  用尽一切手段通知 25-notifier.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/25-notifier.html
// @match        https://symfony.com/doc/current/the-fast-track/en/25-notifier.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502505/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2025-notifierhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502505/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2025-notifierhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Notifying by all Means\n        \n            ': '用尽一切手段通知',
        'The Guestbook application gathers feedback about the conferences. But we are not great at giving feedback to our users.': 'Guestbook 应用程序收集了有关会议的反馈。但我们并不擅长给我们的用户提供反馈。',
        'As comments are moderated, they probably don\'t understand why their comments are not published instantly. They might even re-submit them thinking there was some technical problems. Giving them feedback after posting a comment would be great.': '由于评论需要审核，他们可能不明白为什么他们的评论没有立即发布。他们甚至可能会重新提交评论，以为存在某些技术问题。在发布评论后给他们反馈会很好。',
        'Also, we should probably ping them when their comment was published. We ask for their email, so we\'d better use it.': '另外，当他们的评论被发布时，我们应该通知他们。我们要求他们提供电子邮件，所以我们最好使用它。',
        'There are many ways to notify users. Email is the first medium that you might think of, but notifications in the web application is another one. We could even think about sending SMS messages, posting a message on Slack or Telegram. There are many options.': '通知用户有很多方法。电子邮件可能是你首先想到的方式，但网络应用中的通知是另一种方式。我们甚至可以考虑发送短信，在 Slack 或 Telegram 上发布消息。有很多选择。',
        'The Symfony Notifier Component implements many notification strategies.': 'Symfony 的 Notifier 组件实现了许多通知策略。',
        'Sending Web Application Notifications in the Browser': '在浏览器中发送网络应用通知',
        'As a first step, let\'s notify the users that comments are moderated directly in the browser after their submission:': '作为第一步，让我们在用户提交评论后直接在浏览器中通知他们评论正在审核中：',
        'The notifier sends a notification to recipients via a channel.': '通知器通过通道向接收者发送通知。',
        'A notification has a subject, an optional content, and an importance.': '通知有一个主题，一个可选的内容，以及一个重要性。',
        'A notification is sent on one or many channels depending on its importance. You can send urgent notifications by SMS and regular ones by email for instance.': '根据通知的重要性，它可以通过一个或多个通道发送。例如，您可以通过短信发送紧急通知，通过电子邮件发送常规通知。',
        'For browser notifications, we don\'t have recipients.': '对于浏览器通知，我们没有收件人。',
        'The browser notification uses flash messages via the notification section. We need to display them by updating the conference template:': '浏览器通知通过<em>通知</em>部分的<em>闪存消息</em>进行。我们需要通过更新会议模板来显示它们：',
        'The users will now be notified that their submission is moderated:': '现在将通知用户他们的提交正在审核中：',
        'As an added bonus, we have a nice notification at the top of the website if there is a form error:': '作为额外的奖励，如果表单有错误，我们在网站顶部会有一个很好的通知：',
        'Flash messages use the HTTP session system as a storage medium. The main consequence is that the HTTP cache is disabled as the session system must be started to check for messages.': '闪存消息使用 HTTP 会话系统作为存储介质。主要后果是 HTTP 缓存被禁用，因为必须启动会话系统才能检查消息。',
        'This is the reason why we have added the flash messages snippet in the show.html.twig template and not in the base one as we would have lost HTTP cache for the homepage.': '这就是为什么我们在 <code translate="no" class="notranslate">show.html.twig</code> 模板中添加了闪存消息片段，而不是在基础模板中，因为那样我们将失去主页的 HTTP 缓存。',
        'Notifying Admins by Email': '通过电子邮件通知管理员',
        'Instead of sending an email via MailerInterface to notify the admin that a comment has just been posted, switch to use the Notifier component in the message handler:': '不要通过 <code translate="no" class="notranslate">MailerInterface</code> 发送电子邮件来通知管理员有一条评论刚刚被发布，而是在消息处理器中使用 Notifier 组件：',
        'The getAdminRecipients() method returns the admin recipients as configured in the notifier configuration; update it now to add your own email address:': '<code translate="no" class="notranslate">getAdminRecipients()</code> 方法返回在通知器配置中配置的管理员收件人；现在更新它以添加您自己的电子邮件地址：',
        'Now, create the CommentReviewNotification class:': '现在，创建 <code translate="no" class="notranslate">CommentReviewNotification</code> 类：',
        'The asEmailMessage() method from EmailNotificationInterface is optional, but it allows to customize the email.': '来自 <code translate="no" class="notranslate">EmailNotificationInterface</code> 的 <code translate="no" class="notranslate">asEmailMessage()</code> 方法是可选的，但它允许自定义电子邮件。',
        'One benefit of using the Notifier instead of the mailer directly to send emails is that it decouples the notification from the "channel" used for it. As you can see, nothing explicitly says that the notification should be sent by email.': '使用通知器而不是直接通过邮件发送邮件的一个好处是，它将通知与用于发送通知的“通道”解耦。如您所见，没有任何明确说明通知应通过电子邮件发送。',
        'Instead, the channel is configured in config/packages/notifier.yaml depending on the importance of the notification (low by default):': '相反，通道是根据通知的重要性（默认为 <code translate="no" class="notranslate">low</code>）在 <code translate="no" class="notranslate">config/packages/notifier.yaml</code> 中配置的：',
        'We have talked about the browser and the email channels. Let\'s see some fancier ones.': '我们已经讨论了 <code translate="no" class="notranslate">browser</code> 和 <code translate="no" class="notranslate">email</code> 通道。让我们来看看一些更花哨的。',
        'Chatting with Admins': '与管理员聊天',
        'Let\'s be honest, we all wait for positive feedback. Or at least constructive feedback. If someone posts a comment with words like "great" or "awesome", we might want to accept them faster than the others.': '说实话，我们都在等待积极的反馈。或者至少是建设性的反馈。如果有人发表评论说“很好”或“太棒了”，我们可能会比其他人更快地接受他们。',
        'For such messages, we want to be alerted on an instant messaging system like Slack or Telegram in addition to the regular email.': '对于这样的消息，我们希望在常规电子邮件之外，还能在 Slack 或 Telegram 等即时消息系统上收到警报。',
        'Install Slack support for Symfony Notifier:': '为 Symfony Notifier 安装 Slack 支持：',
        'To get started, compose the Slack DSN with a Slack access token and the Slack channel identifier where you want to send messages: slack://ACCESS_TOKEN@default?channel=CHANNEL.': '首先，使用 Slack 访问令牌和要发送消息的 Slack 频道标识符来组合 Slack DSN：<code translate="no" class="notranslate">slack://ACCESS_TOKEN@default?channel=CHANNEL</code>。',
        'As the access token is sensitive, store the Slack DSN in the secret store:': '由于访问令牌是敏感的，请将 Slack DSN 存储在秘密存储中：',
        'Do the same for production:': '对生产环境做同样的操作：',
        'Update the Notification class to route messages depending on the comment text content (a simple regex will do the job):': '更新 Notification 类以根据评论文本内容（一个简单的正则表达式可以完成此工作）路由消息：',
        'We have also changed the importance of "regular" comments as it slightly tweaks the design of the email.': '我们还更改了“常规”评论的重要性，因为它稍微调整了电子邮件的设计。',
        'And done! Submit a comment with "awesome" in the text, you should receive a message on Slack.': '完成！在文本中提交一条包含“太棒了”的评论，您应该在 Slack 上收到一条消息。',
        'As for email, you can implement ChatNotificationInterface to override the default rendering of the Slack message:': '至于电子邮件，您可以实现 <code translate="no" class="notranslate">ChatNotificationInterface</code> 来覆盖 Slack 消息的默认渲染：',
        'It is better, but let\'s go one step further. Wouldn\'t it be awesome to be able to accept or reject a comment directly from Slack?': '这更好了，但让我们更进一步。如果能够直接从 Slack 接受或拒绝评论，那不是太棒了吗？',
        'Change the notification to accept the review URL and add two buttons in the Slack message:': '更改通知以接受审核 URL，并在 Slack 消息中添加两个按钮：',
        'It is now a matter of tracking changes backward. First, update the message handler to pass the review URL:': '现在的问题是向后跟踪更改。首先，更新消息处理程序以传递审核 URL：',
        'As you can see, the review URL should be part of the comment message, let\'s add it now:': '如您所见，审核 URL 应该是评论消息的一部分，让我们现在添加它：',
        'Finally, update the controllers to generate the review URL and pass it in the comment message constructor:': '最后，更新控制器以生成审核 URL 并将其传递给评论消息构造函数：',
        'Code decoupling means changes in more places, but it makes it easier to test, reason about, and reuse.': '代码解耦意味着在更多的地方进行更改，但它使测试、推理和重用变得更加容易。',
        'Try again, the message should be in good shape now:': '再试一次，现在消息应该没问题了：',
        'Going Asynchronous across the Board': '全面实现异步处理',
        'Notifications are sent asynchronously by default, like emails:': '默认情况下，通知是异步发送的，就像电子邮件一样：',
        'If we were to disable asynchronous messages, we would have a slight issue. For each comment, we receive an email and a Slack message. If the Slack message errors (wrong channel id, wrong token, ...), the messenger message will be retried three times before being discarded. But as the email is sent first, we will receive 3 emails and no Slack messages.': '如果我们禁用异步消息，我们将面临一个小问题。对于每条评论，我们都会收到一封电子邮件和一个 Slack 消息。如果 Slack 消息出错（错误的频道 ID、错误的令牌等），则在消息被丢弃之前，messenger 消息将被重试三次。但是，由于电子邮件是首先发送的，因此我们将收到 3 封电子邮件而没有 Slack 消息。',
        'As soon as everything is asynchronous, messages become independent. SMS messages are already configured as asynchronous in case you also want to be notified on your phone.': '一旦所有内容都是异步的，消息就变得独立了。如果您还想在手机上收到通知，短信已经配置为异步。',
        'Notifying Users by Email': '通过电子邮件通知用户',
        'The last task is to notify users when their submission is approved. What about letting you implement that yourself?': '最后一项任务是在用户的提交获得批准时通知他们。你自己来实现这个功能怎么样？',
        'Going Further': '深入探索',
        'Symfony flash messages.': '<a href="https://symfony.com/doc/6.4/controller.html#flash-messages" class="reference external">Symfony 闪存消息</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Running Crons': '运行 Cron 任务（或 Cron 作业）',
        'Exposing an API with API Platform': '使用 API Platform 公开 API'
    };

    fanyi(translates, 2);
})($);
