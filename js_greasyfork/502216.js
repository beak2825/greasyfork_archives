// ==UserScript==
// @name         Book for Symfony 6 翻译 12-event.html
// @namespace    fireloong
// @version      0.0.6
// @description  监听事件 12-event.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/12-event.html
// @match        https://symfony.com/doc/current/the-fast-track/en/12-event.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502216/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2012-eventhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502216/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2012-eventhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Listening to Events\n        \n            ': '监听事件',
        'The current layout is missing a navigation header to go back to the homepage or switch from one conference to the next.': '当前布局缺少一个导航标题，无法返回主页或在各个会议之间切换。',
        'Adding a Website Header': '添加网站标题',
        'Anything that should be displayed on all web pages, like a header, should be part of the main base layout:': '所有网页上都应该显示的内容，如标题，都应该是主基础布局的一部分：',
        'Adding this code to the layout means that all templates extending it must define a conferences variable, which must be created and passed from their controllers.': '将这段代码添加到布局中意味着所有扩展它的模板都必须定义一个 <code translate="no" class="notranslate">conferences</code> 变量，该变量必须由其控制器创建并传递。',
        'As we only have two controllers, you might do the following (do not apply the change to your code as we will learn a better way very soon):': '因为我们只有两个控制器，所以你可以这样做（不要在你的代码中进行更改，因为我们很快就会学到更好的方法）：',
        'Imagine having to update dozens of controllers. And doing the same on all new ones. This is not very practical. There must be a better way.': '想象一下，你不得不更新几十个控制器。并在所有新的控制器上做同样的事情。这不是很实用。一定有更好的方法。',
        'Twig has the notion of global variables. A global variable is available in all rendered templates. You can define them in a configuration file, but it only works for static values. To add all conferences as a Twig global variable, we are going to create a listener.': 'Twig 具有全局变量的概念。全局变量在所有渲染的模板中都是可用的。你可以在配置文件中定义它们，但这仅适用于静态值。为了将所有会议作为 Twig 全局变量添加，我们将创建一个侦听器。',
        'Discovering Symfony Events': '探索 Symfony 事件',
        'Symfony comes built-in with an Event Dispatcher Component. A dispatcher dispatches certain events at specific times that listeners can listen to. Listeners are hooks into the framework internals.': 'Symfony 内置了事件调度器组件。调度器在特定时间分发某些事件，侦听器可以监听这些事件。侦听器是框架内部的钩子。',
        'For instance, some events allow you to interact with the lifecycle of HTTP requests. During the handling of a request, the dispatcher dispatches events when a request has been created, when a controller is about to be executed, when a response is ready to be sent, or when an exception has been thrown. A listener can listen to one or more events and execute some logic based on the event context.': '例如，某些事件允许你与 HTTP 请求的生命周期进行交互。在处理请求期间，当请求被创建、控制器即将执行、响应准备好发送或抛出异常时，调度器会分发事件。侦听器可以监听一个或多个事件，并根据事件上下文执行一些逻辑。',
        'Events are well-defined extension points that make the framework more generic and extensible. Many Symfony Components like Security, Messenger, Workflow, or Mailer use them extensively.': '事件是定义良好的扩展点，使框架更加通用和可扩展。许多 Symfony 组件，如安全性、消息传递、工作流或邮件程序，都大量使用它们。',
        'Another built-in example of events and listeners in action is the lifecycle of a command: you can create a listener to execute code before any command is run.': '事件和侦听器在实际应用中的另一个内置示例是命令的生命周期：你可以创建一个侦听器来在任何命令运行之前执行代码。',
        'Any package or bundle can also dispatch their own events to make their code extensible.': '任何包或捆绑包也可以分发它们自己的事件，以使它们的代码可扩展。',
        'To avoid having a configuration file that describes which events a listener wants to listen to, create a subscriber. A subscriber is a listener with a static getSubscribedEvents() method that returns its configuration. This allows subscribers to be registered in the Symfony dispatcher automatically.': '为了避免使用配置文件来描述侦听器想要监听哪些事件，可以创建一个订阅者。订阅者是一个带有静态 <code translate="no" class="notranslate">getSubscribedEvents()</code> 方法的侦听器，该方法返回其配置。这允许订阅者自动在 Symfony 调度器中注册。',
        'Implementing a Subscriber': '实现订阅者',
        'You know the song by heart now, use the maker bundle to generate a subscriber:': '你现在已经熟记这首歌了，使用 maker bundle 来生成一个订阅者：',
        'The command asks you about which event you want to listen to. Choose the Symfony\\Component\\HttpKernel\\Event\\ControllerEvent event, which is dispatched just before the controller is called. It is the best time to inject the conferences global variable so that Twig will have access to it when the controller renders the template. Update your subscriber as follows:': '该命令会询问你想要监听哪个事件。选择 <code translate="no" class="notranslate">Symfony<wbr>\\Component<wbr>\\HttpKernel<wbr>\\Event<wbr>\\ControllerEvent</wbr></wbr></wbr></wbr></code> 事件，该事件在调用控制器之前分发。这是注入 <code translate="no" class="notranslate">conferences</code> 全局变量的最佳时机，以便当控制器渲染模板时，Twig 可以访问它。更新你的订阅者如下：',
        'Now, you can add as many controllers as you want: the conferences variable will always be available in Twig.': '现在，你可以添加任意数量的控制器：<code translate="no" class="notranslate">conferences</code> 变量在 Twig 中始终可用。',
        'We will talk about a much better alternative performance-wise in a later step.': '在后面的步骤中，我们将讨论一种在性能方面更好的替代方案。',
        'Sorting Conferences by Year and City': '按年份和城市对会议进行排序',
        'Ordering the conference list by year may facilitate browsing. We could create a custom method to retrieve and sort all conferences, but instead, we are going to override the default implementation of the findAll() method to be sure that sorting applies everywhere:': '按年份对会议列表进行排序可能会促进浏览。我们可以创建一个自定义方法来检索和排序所有会议，但相反，我们将覆盖 <code translate="no" class="notranslate">findAll()</code> 方法的默认实现，以确保排序适用于所有地方：',
        'At the end of this step, the website should look like the following:': '在此步骤结束时，网站应如下所示：',
        'Going Further': '深入探索',
        'The Request-Response Flow in Symfony applications;': 'Symfony 应用程序中的<a href="https://symfony.com/doc/6.4/components/http_kernel.html#the-workflow-of-a-request" class="reference external">请求-响应流程</a>；',
        'The built-in Symfony HTTP events;': '<a href="https://symfony.com/doc/6.4/reference/events.html" class="reference external">Symfony 内置的 HTTP 事件</a>；',
        'The built-in Symfony Console events.': '<a href="https://symfony.com/doc/6.4/components/console/events.html" class="reference external">Symfony 内置的 Console 事件</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Branching the Code': '代码分支',
        'Managing the Lifecycle of Doctrine Objects': '管理 Doctrine 对象的生命周期'
    };

    fanyi(translates, 2);
})($);
