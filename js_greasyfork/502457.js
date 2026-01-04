// ==UserScript==
// @name         Book for Symfony 6 翻译 18-async.html
// @namespace    fireloong
// @version      0.1.0
// @description  异步处理 18-async.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/18-async.html
// @match        https://symfony.com/doc/current/the-fast-track/en/18-async.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502457/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2018-asynchtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502457/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2018-asynchtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Going Async\n        \n            ': '异步处理',
        'Checking for spam during the handling of the form submission might lead to some problems. If the Akismet API becomes slow, our website will also be slow for users. But even worse, if we hit a timeout or if the Akismet API is unavailable, we might lose comments.': '在表单提交过程中检查垃圾邮件可能会导致一些问题。如果 Akismet API 变慢，我们的网站对用户来说也会变慢。但更糟糕的是，如果我们遇到超时或 Akismet API 不可用，我们可能会丢失评论。',
        'Ideally, we should store the submitted data without publishing it, and immediately return a response. Checking for spam can then be done out of band.': '理想情况下，我们应该存储提交的数据而不发布它，并立即返回响应。然后可以在带外进行垃圾邮件检查。',
        'Flagging Comments': '标记评论',
        'We need to introduce a state for comments: submitted, spam, and published.': '我们需要为评论引入一个 <code translate="no" class="notranslate">state</code>：<code translate="no" class="notranslate">submitted</code>、<code translate="no" class="notranslate">spam</code> 和 <code translate="no" class="notranslate">published</code>。',
        'Add the state property to the Comment class:': '在 <code translate="no" class="notranslate">Comment</code> 类中添加 <code translate="no" class="notranslate">state</code> 属性：',
        'We should also make sure that, by default, the state is set to submitted:': '我们还应该确保默认情况下，<code translate="no" class="notranslate">state</code> 被设置为 <code translate="no" class="notranslate">submitted</code>：',
        'Create a database migration:': '创建一个数据库迁移：',
        'Modify the migration to update all existing comments to be published by default:': '修改迁移以将所有现有的评论默认更新为 <code translate="no" class="notranslate">published</code>：',
        'Migrate the database:': '迁移数据库：',
        'Update the display logic to avoid non-published comments from appearing on the frontend:': '更新显示逻辑，以避免非发布的评论出现在前端：',
        'Update the EasyAdmin configuration to be able to see the comment\'s state:': '更新 EasyAdmin 配置，以便能够查看评论的状态：',
        'Don\'t forget to also update the tests by setting the state of the fixtures:': '别忘了通过设置测试数据的 <code translate="no" class="notranslate">state</code> 来更新测试：',
        'For the controller tests, simulate the validation:': '对于控制器测试，模拟验证：',
        'From a PHPUnit test, you can get any service from the container via self::getContainer()->get(); it also gives access to non-public services.': '在 PHPUnit 测试中，您可以通过 <code translate="no" class="notranslate">self::getContainer()-&gt;get()</code> 从容器中获取任何服务；它还可以访问非公共服务。',
        'Understanding Messenger': '理解 Messenger',
        'Managing asynchronous code with Symfony is the job of the Messenger Component:': 'Symfony 中管理异步代码的任务是由 Messenger 组件完成的：',
        'When some logic should be executed asynchronously, send a message to a messenger bus. The bus stores the message in a queue and returns immediately to let the flow of operations resume as fast as possible.': '当需要异步执行某些逻辑时，向消息总线发送一条消息。总线将消息存储在队列中，并立即返回，以便尽快恢复操作流。',
        'A consumer runs continuously in the background to read new messages on the queue and execute the associated logic. The consumer can run on the same server as the web application or on a separate one.': '一个消费者在后台连续运行，以读取队列上的新消息并执行相关逻辑。消费者可以在与 Web 应用程序相同的服务器上运行，也可以在单独的服务器上运行。',
        'It is very similar to the way HTTP requests are handled, except that we don\'t have responses.': '它与处理 HTTP 请求的方式非常相似，只是我们没有响应。',
        'Coding a Message Handler': '编写消息处理程序',
        'A message is a data object class that should not hold any logic. It will be serialized to be stored in a queue, so only store "simple" serializable data.': '消息是一个数据对象类，它不应该包含任何逻辑。它将被序列化并存储在队列中，因此只存储“简单”的可序列化数据。',
        'Create the CommentMessage class:': '创建 <code translate="no" class="notranslate">CommentMessage</code> 类：',
        'In the Messenger world, we don\'t have controllers, but message handlers.': '在 Messenger 世界中，我们没有控制器，只有消息处理程序。',
        'Create a CommentMessageHandler class under a new App\\MessageHandler namespace that knows how to handle CommentMessage messages:': '在新的 <code translate="no" class="notranslate">App\\MessageHandler</code> 命名空间下创建一个 <code translate="no" class="notranslate">CommentMessageHandler</code> 类，该类知道如何处理 <code translate="no" class="notranslate">CommentMessage</code> 消息：',
        'AsMessageHandler helps Symfony auto-register and auto-configure the class as a Messenger handler. By convention, the logic of a handler lives in a method called __invoke(). The CommentMessage type hint on this method\'s sole argument tells Messenger which class this will handle.': '<code translate="no" class="notranslate">AsMessageHandler</code> 帮助 Symfony 自动注册和自动配置该类作为 Messenger 处理程序。按照惯例，处理程序的逻辑位于名为 <code translate="no" class="notranslate">__invoke()</code> 的方法中。该方法唯一参数的 <code translate="no" class="notranslate">CommentMessage</code> 类型提示告诉 Messenger 这个处理程序将处理哪个类。',
        'Update the controller to use the new system:': '更新控制器以使用新系统：',
        'Instead of depending on the Spam Checker, we now dispatch a message on the bus. The handler then decides what to do with it.': '现在，我们不依赖于垃圾邮件检查器，而是在总线上分发一条消息。然后，处理程序决定如何处理它。',
        'We have achieved something unexpected. We have decoupled our controller from the Spam Checker and moved the logic to a new class, the handler. It is a perfect use case for the bus. Test the code, it works. Everything is still done synchronously, but the code is probably already "better".': '我们取得了一些意想不到的成果。我们已经将控制器与垃圾邮件检查器解耦，并将逻辑移动到一个新的类中，即处理程序。这是总线的一个完美用例。测试代码，它有效。所有操作仍然是同步进行的，但代码可能已经“更好”了。',
        'Going Async for Real': '真正实现异步操作',
        'By default, handlers are called synchronously. To go async, you need to explicitly configure which queue to use for each handler in the config/packages/messenger.yaml configuration file:': '默认情况下，处理程序是同步调用的。要实现异步，您需要在 <code translate="no" class="notranslate">config/packages/messenger.yaml</code> 配置文件中明确配置每个处理程序要使用的队列：',
        'The configuration tells the bus to send instances of App\\Message\\CommentMessage to the async queue, which is defined by a DSN (MESSENGER_TRANSPORT_DSN), which points to Doctrine as configured in .env. In plain English, we are using PostgreSQL as a queue for our messages.': '该配置告诉总线将 <code translate="no" class="notranslate">App\\Message\\CommentMessage</code> 的实例发送到 <code translate="no" class="notranslate">async</code> 队列，该队列由 DSN（<code translate="no" class="notranslate">MESSENGER_TRANSPORT_DSN</code>）定义，该 DSN 指向 <code translate="no" class="notranslate">.env</code> 中配置的 Doctrine。简单地说，我们正在使用 PostgreSQL 作为消息的队列。',
        'Behind the scenes, Symfony uses the PostgreSQL builtin, performant, scalable, and transactional pub/sub system (LISTEN/NOTIFY). You can also read the RabbitMQ chapter if you want to use it instead of PostgreSQL as a message broker.': '在幕后，Symfony 使用 PostgreSQL 内置的、高性能的、可伸缩的和事务性的发布/订阅系统（<code translate="no" class="notranslate">LISTEN</code>/<code translate="no" class="notranslate">NOTIFY</code>）。如果您想使用 RabbitMQ 作为消息代理而不是 PostgreSQL，也可以阅读 RabbitMQ 章节。',
        'Consuming Messages': '消费消息',
        'If you try to submit a new comment, the spam checker won\'t be called anymore. Add an error_log() call in the getSpamScore() method to confirm. Instead, a message is waiting in the queue, ready to be consumed by some processes.': '如果您尝试提交新评论，则不会再调用垃圾邮件检查器。在 <code translate="no" class="notranslate">getSpamScore()</code> 方法中添加一个 <code translate="no" class="notranslate">error_log()</code> 调用以进行确认。相反，一条消息正在队列中等待，准备被某些进程消费。',
        'As you might imagine, Symfony comes with a consumer command. Run it now:': '如您所想，Symfony 附带了一个消费者命令。现在运行它：',
        'It should immediately consume the message dispatched for the submitted comment:': '它应该立即消费为提交的评论分发的消息：',
        'The message consumer activity is logged, but you get instant feedback on the console by passing the -vv flag. You should even be able to spot the call to the Akismet API.': '消息消费者活动会被记录下来，但您可以通过传递 <code translate="no" class="notranslate">-vv</code> 标志在控制台上立即获得反馈。您甚至应该能够看到对 Akismet API 的调用。',
        'To stop the consumer, press Ctrl+C.': '要停止消费者，请按 <code translate="no" class="notranslate">Ctrl+C</code>。',
        'Running Workers in the Background': '在后台运行工作进程',
        'Instead of launching the consumer every time we post a comment and stopping it immediately after, we want to run it continuously without having too many terminal windows or tabs open.': '我们不想在每次发布评论时都启动消费者并在之后立即停止它，而是希望它在不打开太多终端窗口或选项卡的情况下连续运行。',
        'The Symfony CLI can manage such background commands or workers by using the daemon flag (-d) on the run command.': 'Symfony CLI 可以通过在 <code translate="no" class="notranslate">run</code> 命令上使用 daemon 标志（<code translate="no" class="notranslate">-d</code>）来管理此类后台命令或工作进程。',
        'Run the message consumer again, but send it in the background:': '再次运行消息消费者，但将其发送到后台：',
        'The --watch option tells Symfony that the command must be restarted whenever there is a filesystem change in the config/, src/, templates/, or vendor/ directories.': '<code translate="no" class="notranslate">--watch</code> 选项告诉 Symfony，每当 <code translate="no" class="notranslate">config/</code>、<code translate="no" class="notranslate">src/</code>、<code translate="no" class="notranslate">templates/</code> 或 <code translate="no" class="notranslate">vendor/</code> 目录中的文件系统发生更改时，都必须重新启动命令。',
        'Do not use -vv as you would have duplicated messages in server:log (logged messages and console messages).': '不要使用 <code translate="no" class="notranslate">-vv</code>，因为您将在 <code translate="no" class="notranslate">server:log</code>（记录的消息和控制台消息）中看到重复的消息。',
        'If the consumer stops working for some reason (memory limit, bug, ...), it will be restarted automatically. And if the consumer fails too fast, the Symfony CLI will give up.': '如果由于某种原因（内存限制、错误等）消费者停止工作，它将自动重新启动。如果消费者失败得太快，Symfony CLI 将放弃。',
        'Logs are streamed via symfony server:log with all the other logs coming from PHP, the web server, and the application:': '日志通过 <code translate="no" class="notranslate">symfony server:log</code> 与其它来自 PHP、Web 服务器和应用程序的日志一起流式传输：',
        'Use the server:status command to list all background workers managed for the current project:': '使用 <code translate="no" class="notranslate">server:status</code> 命令列出当前项目管理的所有后台工作进程：',
        'To stop a worker, stop the web server or kill the PID given by the server:status command:': '要停止工作进程，请停止 Web 服务器或终止 <code translate="no" class="notranslate">server:status</code> 命令给出的 PID：',
        'Retrying Failed Messages': '重试失败的消息',
        'What if Akismet is down while consuming a message? There is no impact for people submitting comments, but the message is lost and spam is not checked.': '如果在消费消息时 Akismet 出现故障怎么办？这对提交评论的人来说没有影响，但消息会丢失，并且不会检查垃圾邮件。',
        'Messenger has a retry mechanism for when an exception occurs while handling a message:': '当处理消息时发生异常时，Messenger 有一个重试机制：',
        'If a problem occurs while handling a message, the consumer will retry 3 times before giving up. But instead of discarding the message, it will store it permanently in the failed queue, which uses another database table.': '如果在处理消息时出现问题，消费者将在放弃之前重试3次。但是，它不会丢弃消息，而是会将其永久存储在失败的队列中，该队列使用另一个数据库表。',
        'Inspect failed messages and retry them via the following commands:': '通过以下命令检查失败的消息并重新尝试它们：',
        'Running Workers on Platform.sh': '在 Platform.sh 上运行工作进程',
        'To consume messages from PostgreSQL, we need to run the messenger:consume command continuously. On Platform.sh, this is the role of a worker:': '要从 PostgreSQL 消费消息，我们需要连续运行 <code translate="no" class="notranslate">messenger:consume</code> 命令。在 Platform.sh 上，这是工作进程的角色：',
        'Like for the Symfony CLI, Platform.sh manages restarts and logs.': '与 Symfony CLI 一样，Platform.sh 管理重启和日志。',
        'To get logs for a worker, use:': '要获取工作进程的日志，请使用：',
        'Going Further': '深入探索',
        'SymfonyCasts Messenger tutorial;': '<a href="https://symfonycasts.com/screencast/messenger" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Messenger 教程</a>；',
        'The Enterprise service bus architecture and the CQRS pattern;': '企业服务总线架构和 <a href="https://martinfowler.com/bliki/CQRS.html" class="reference external" rel="external noopener noreferrer" target="_blank">CQRS 模式</a>；',
        'The Symfony Messenger docs;': '<a href="https://symfony.com/doc/6.4/messenger.html" class="reference external">Symfony Messenger 文档</a>；',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Testing': '测试',
        'Making Decisions with a Workflow': '使用工作流程做出决策'
    };

    fanyi(translates, 2);
})($);
