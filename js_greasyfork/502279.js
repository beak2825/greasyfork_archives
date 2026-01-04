// ==UserScript==
// @name         Book for Symfony 6 翻译 13-lifecycle.html
// @namespace    fireloong
// @version      0.0.6
// @description  管理 Doctrine 对象的生命周期 13-lifecycle.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/13-lifecycle.html
// @match        https://symfony.com/doc/current/the-fast-track/en/13-lifecycle.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502279/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2013-lifecyclehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502279/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2013-lifecyclehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Managing the Lifecycle of Doctrine Objects\n        \n            ': '管理 Doctrine 对象的生命周期',
        'When creating a new comment, it would be great if the createdAt date was set automatically to the current date and time.': '在创建新评论时，如果能将 <code translate="no" class="notranslate">createdAt</code> 日期自动设置为当前日期和时间，那就太好了。',
        'Doctrine has different ways to manipulate objects and their properties during their lifecycle (before the row in the database is created, after the row was updated, ...).': 'Doctrine 在对象生命周期中有不同的方法来操作对象及其属性（在数据库中的行被创建之前，行被更新之后，……）。',
        'Defining Lifecycle Callbacks': '定义生命周期回调',
        'When the behavior does not need any service and should be applied to only one kind of entity, define a callback in the entity class:': '当行为不需要任何服务并且应该仅应用于一种实体时，请在实体类中定义一个回调：',
        'The ORM\\PrePersist event is triggered when the object is stored in the database for the very first time. When that happens, the setCreatedAtValue() method is called and the current date and time is used for the value of the createdAt property.': '当对象首次存储在数据库中时，会触发 <code translate="no" class="notranslate">ORM\\PrePersist</code> 事件。当这种情况发生时，会调用 <code translate="no" class="notranslate">setCreatedAtValue()</code> 方法，并使用当前日期和时间作为 <code translate="no" class="notranslate">createdAt</code> 属性的值。',
        'Adding Slugs to Conferences': '为会议添加 Slugs',
        'The URLs for conferences are not meaningful: /conference/1. More importantly, they depend on an implementation detail (the primary key in the database is leaked).': '会议的 URL 没有意义：<code translate="no" class="notranslate">/conference/1</code>。更重要的是，它们依赖于实现细节（数据库中的主键被泄露）。',
        'What about using URLs like /conference/paris-2020 instead? That would look much better. paris-2020 is what we call the conference slug.': '那么，使用像 <code translate="no" class="notranslate">/conference/paris-2020</code> 这样的 URL 怎么样？那会看起来更好。我们称 <code translate="no" class="notranslate">paris-2020</code> 为会议 <em>slug</em>。',
        'Add a new slug property for conferences (a not nullable string of 255 characters):': '为会议添加一个新的 <code translate="no" class="notranslate">slug</code> 属性（一个不可为空的 255 个字符的字符串）：',
        'Create a migration file to add the new column:': '创建一个迁移文件来添加新列：',
        'And execute that new migration:': '并执行那个新的迁移：',
        "Got an error? This is expected. Why? Because we asked for the slug not to be null but existing entries in the conference database will get a null value when the migration is run. Let's fix that by tweaking the migration:": '遇到错误了吗？这是预料之中的。为什么呢？因为我们要求 slug 不为 <code translate="no" class="notranslate">null</code>，但在迁移运行时，会议数据库中的现有条目将获得 <code translate="no" class="notranslate">null</code> 值。让我们通过调整迁移来解决这个问题：',
        'The trick here is to add the column and allow it to be null, then set the slug to a not null value, and finally, change the slug column to not allow null.': '这里的技巧是先添加列并允许它为 <code translate="no" class="notranslate">null</code>，然后将 slug 设置为非 <code translate="no" class="notranslate">null</code> 值，最后，将 slug 列更改为不允许 <code translate="no" class="notranslate">null</code>。',
        'For a real project, using CONCAT(LOWER(city), \'-\', year) might not be enough. In that case, we would need to use the "real" Slugger.': '对于实际项目，使用 <code translate="no" class="notranslate">CONCAT(LOWER(city), \'-\', year)</code> 可能不够。在这种情况下，我们需要使用“真正的”Slugger。',
        'Migration should run fine now:': '现在迁移应该可以正常运行：',
        "Because the application will soon use slugs to find each conference, let's tweak the Conference entity to ensure that slug values are unique in the database:": '因为应用程序将很快使用 slug 来查找每个会议，让我们调整会议实体以确保在数据库中 slug 值是唯一的：',
        'As you might have guessed, we need to perform the migration dance:': '正如您可能已经猜到的那样，我们需要执行迁移操作：',
        'Generating Slugs': '生成 Slugs',
        'Generating a slug that reads well in a URL (where anything besides ASCII characters should be encoded) is a challenging task, especially for languages other than English. How do you convert é to e for instance?': '生成一个在 URL 中易于阅读的 slug（其中 ASCII 字符以外的任何内容都应进行编码）是一项具有挑战性的任务，特别是对于非英语语言。例如，您如何将 <code translate="no" class="notranslate">é</code> 转换为 <code translate="no" class="notranslate">e</code> ？',
        "Instead of reinventing the wheel, let's use the Symfony String component, which eases the manipulation of strings and provides a slugger.": '与其重新发明轮子，不如使用 Symfony <code translate="no" class="notranslate">String</code> 组件，它简化了字符串的操作并提供了 <em>slugger</em>。',
        'Add a computeSlug() method to the Conference class that computes the slug based on the conference data:': '在 <code translate="no" class="notranslate">Conference</code> 类中添加一个 <code translate="no" class="notranslate">computeSlug()</code> 方法，该方法根据会议数据计算 slug：',
        'The computeSlug() method only computes a slug when the current slug is empty or set to the special - value. Why do we need the - special value? Because when adding a conference in the backend, the slug is required. So, we need a non-empty value that tells the application that we want the slug to be automatically generated.': '<code translate="no" class="notranslate">computeSlug()</code> 方法仅在当前 slug 为空或设置为特殊值 <code translate="no" class="notranslate">-</code> 时才计算 slug。为什么我们需要这个特殊值 <code translate="no" class="notranslate">-</code> ？因为在后台添加会议时，需要 slug。因此，我们需要一个非空值来告诉应用程序我们希望自动生成 slug。',
        'Defining a Complex Lifecycle Callback': '定义复杂的生命周期回调',
        'As for the createdAt property, the slug one should be set automatically whenever the conference is updated by calling the computeSlug() method.': '与 <code translate="no" class="notranslate">createdAt</code> 属性一样，每当通过调用 <code translate="no" class="notranslate">computeSlug()</code> 方法更新会议时，<code translate="no" class="notranslate">slug</code> 也应该自动设置。',
        "But as this method depends on a SluggerInterface implementation, we cannot add a prePersist event like we did (we don't have a way to inject the slugger).": '但是，由于此方法依赖于 <code translate="no" class="notranslate">SluggerInterface</code> 的实现，因此我们无法像之前那样添加 <code translate="no" class="notranslate">prePersist</code> 事件（我们无法注入 slugger）。',
        'Instead, create a Doctrine entity listener:': '相反，创建一个 Doctrine 实体侦听器：',
        'Note that the slug is updated when a new conference is created (prePersist()) and whenever it is updated (preUpdate()).': '请注意，当创建新会议（<code translate="no" class="notranslate">prePersist()</code>）和每次更新会议（<code translate="no" class="notranslate">preUpdate()</code>）时，都会更新 slug。',
        'Configuring a Service in the Container': '在容器中配置服务',
        'Up until now, we have not talked about one key component of Symfony, the dependency injection container. The container is responsible for managing services: creating them and injecting them whenever needed.': '到目前为止，我们还没有谈到 Symfony 的一个关键组件，即依赖注入容器。容器负责管理服务：在需要时创建它们并注入它们。',
        'A service is a "global" object that provides features (e.g. a mailer, a logger, a slugger, etc.) unlike data objects (e.g. Doctrine entity instances).': '服务是一个“全局”对象，提供功能（例如邮件发送者、记录器、slugger 等），这与数据对象（例如 Doctrine 实体实例）不同。',
        'You rarely interact with the container directly as it automatically injects service objects whenever you need them: the container injects the controller argument objects when you type-hint them for instance.': '您很少直接与容器交互，因为它会在您需要时自动注入服务对象：例如，当您为控制器参数对象提供类型提示时，容器会注入它们。',
        'If you wondered how the event listener was registered in the previous step, you now have the answer: the container. When a class implements some specific interfaces, the container knows that the class needs to be registered in a certain way.': '如果您想知道在上一步中事件监听器是如何注册的，那么您现在有了答案：容器。当一个类实现了一些特定的接口时，容器就知道需要以某种方式注册该类。',
        "Here, because our class doesn't implement any interface or extend any base class, Symfony doesn't know how to auto-configure it. Instead, we can use an attribute to tell the Symfony container how to wire it:": '在这里，因为我们的类没有实现任何接口或继承任何基类，所以 Symfony 不知道如何自动配置它。相反，我们可以使用一个属性来告诉 Symfony 容器如何连接它：',
        "Don't confuse Doctrine event listeners with Symfony ones. Even if they look very similar, they are not using the same infrastructure under the hood.": '不要将 Doctrine 事件监听器与 Symfony 事件监听器混淆。即使它们看起来非常相似，但它们的底层基础架构并不相同。',
        'Using Slugs in the Application': '在应用程序中使用 Slugs',
        "Try adding more conferences in the backend and change the city or the year of an existing one; the slug won't be updated except if you use the special - value.": '尝试在后台添加更多会议，并更改现有会议的城市或年份；除非您使用特殊的 <code translate="no" class="notranslate">-</code> 值，否则 slug 不会更新。',
        'The last change is to update the controllers and the templates to use the conference slug instead of the conference id for routes:': '最后一项更改是更新控制器和模板，以便在路由中使用会议 <code translate="no" class="notranslate">slug</code> 而不是会议 <code translate="no" class="notranslate">id</code>：',
        'Accessing conference pages should now be done via its slug:': '现在，应该通过 slug 访问会议页面：',
        'Going Further': '深入探索',
        'The Doctrine event system (lifecycle callbacks and listeners, entity listeners and lifecycle subscribers);': '<a href="https://symfony.com/doc/6.4/doctrine/events.html" class="reference external">Doctrine 事件系统</a>（生命周期回调和监听器、实体监听器和生命周期订阅者）；',
        'The String component docs;': '<a href="https://symfony.com/doc/current/components/string.html" class="reference external">String 组件文档</a>;',
        'The Service container;': '<a href="https://symfony.com/doc/6.4/service_container.html" class="reference external">服务容器</a>；',
        'The Symfony Services Cheat Sheet.': '<a href="https://github.com/andreia/symfony-cheat-sheets/blob/master/Symfony4/services_en_42.pdf" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony 服务速查表</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Listening to Events': '监听事件',
        'Accepting Feedback with Forms': '使用表单接收反馈'
    };

    fanyi(translates, 2);
})($);
