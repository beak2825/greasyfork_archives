// ==UserScript==
// @name         Book for Symfony 6 翻译 19-workflow.html
// @namespace    fireloong
// @version      0.1.0
// @description  使用工作流程做出决策 19-workflow.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/19-workflow.html
// @match        https://symfony.com/doc/current/the-fast-track/en/19-workflow.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502458/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2019-workflowhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502458/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2019-workflowhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Making Decisions with a Workflow\n        \n            ': '使用工作流程做出决策',
        'Having a state for a model is quite common. The comment state is only determined by the spam checker. What if we add more decision factors?': '为模型添加一个状态是很常见的。评论状态只由垃圾邮件检查器决定。如果我们添加更多的决策因素会怎样？',
        'We might want to let the website admin moderate all comments after the spam checker. The process would be something along the lines of:': '我们可能希望让网站管理员在垃圾邮件检查器之后审核所有评论。流程大致如下：',
        'Start with a submitted state when a comment is submitted by a user;': '当用户提交评论时，从 <code translate="no" class="notranslate">submitted</code> 状态开始；',
        'Let the spam checker analyze the comment and switch the state to either potential_spam, ham, or rejected;': '让垃圾邮件检查器分析评论，并将状态更改为 <code translate="no" class="notranslate">potential_spam</code>、<code translate="no" class="notranslate">ham</code> 或 <code translate="no" class="notranslate">rejected</code>；',
        'If not rejected, wait for the website admin to decide if the comment is good enough by switching the state to published or rejected.': '如果评论未被拒绝，请等待网站管理员决定评论是否足够好，将状态更改为 <code translate="no" class="notranslate">published</code> 或 <code translate="no" class="notranslate">rejected</code>。',
        'Implementing this logic is not too complex, but you can imagine that adding more rules would greatly increase the complexity. Instead of coding the logic ourselves, we can use the Symfony Workflow Component:': '实现这个逻辑并不太复杂，但你可以想象添加更多规则会大大增加复杂性。与其我们自己编写逻辑，我们可以使用 Symfony Workflow 组件：',
        'Describing Workflows': '描述工作流',
        'The comment workflow can be described in the config/packages/workflow.yaml file:': '可以在 <code translate="no" class="notranslate">config/packages/workflow.yaml</code> 文件中描述评论工作流：',
        'To validate the workflow, generate a visual representation:': '为了验证工作流，生成一个可视化表示：',
        'The dot command is a part of the Graphviz utility.': '<code translate="no" class="notranslate">dot</code> 命令是 <a href="https://www.graphviz.org/" class="reference external" rel="external noopener noreferrer" target="_blank">Graphviz</a> 工具的一部分。',
        'Using a Workflow': '使用工作流',
        'Replace the current logic in the message handler with the workflow:': '用工作流替换消息处理器中的当前逻辑：',
        'The new logic reads as follows:': '新的逻辑如下：',
        'If the accept transition is available for the comment in the message, check for spam;': '如果消息中的评论可以进行 <code translate="no" class="notranslate">accept</code> 转换，请检查是否为垃圾邮件；',
        'Depending on the outcome, choose the right transition to apply;': '根据结果，选择合适的转换来应用；',
        'Call apply() to update the Comment via a call to the setState() method;': '通过调用 <code translate="no" class="notranslate">setState()</code> 方法调用 <code translate="no" class="notranslate">apply()</code> 来更新 Comment；',
        'Call flush() to commit the changes to the database;': '调用 <code translate="no" class="notranslate">flush()</code> 将更改提交到数据库；',
        'Re-dispatch the message to allow the workflow to transition again.': '重新分发消息以允许工作流再次转换。',
        'As we haven\'t implemented the admin validation, the next time the message is consumed, the "Dropping comment message" will be logged.': '由于我们尚未实现管理员验证，因此下次消费消息时，将记录“删除评论消息”。',
        'Let\'s implement an auto-validation until the next chapter:': '让我们在下一章中实现自动验证：',
        'Run symfony server:log and add a comment in the frontend to see all transitions happening one after the other.': '运行 <code translate="no" class="notranslate">symfony server:log</code> 并在前端添加评论，以查看一个接一个发生的所有转换。',
        'Finding Services from the Dependency Injection Container': '从依赖注入容器中查找服务',
        'When using dependency injection, we get services from the dependency injection container by type hinting an interface or sometimes a concrete implementation class name. But when an interface has several implementations, Symfony cannot guess which one you need. We need a way to be explicit.': '当使用依赖注入时，我们通过类型提示接口或有时通过具体的实现类名从依赖注入容器中获取服务。但是，当一个接口有多个实现时，Symfony 无法猜测您需要哪一个。我们需要一种明确的方式。',
        'We have just come across such an example with the injection of a WorkflowInterface in the previous section.': '在上一节中，我们在注入 <code translate="no" class="notranslate">WorkflowInterface</code> 时刚刚遇到了这样一个例子。',
        'As we inject any instance of the generic WorkflowInterface interface in the contructor, how can Symfony guess which workflow implementation to use? Symfony uses a convention based on the argument name: $commentStateMachine refers to the comment workflow in the configuration (which type is state_machine). Try any other argument name and it will fail.': '由于我们在构造函数中注入了通用  <code translate="no" class="notranslate">WorkflowInterface</code> 接口的任何实例，因此 Symfony 如何猜测要使用哪个工作流实现？Symfony 使用基于参数名称的约定：<code translate="no" class="notranslate">$commentStateMachine</code> 指的是配置中的 <code translate="no" class="notranslate">comment</code> 工作流（其类型为 <code translate="no" class="notranslate">state_machine</code>）。尝试其它任何参数名称都将失败。',
        'If you don\'t remember the convention, use the debug:container command. Search for all services containing "workflow":': '如果您不记得该约定，请使用 <code translate="no" class="notranslate">debug:container</code> 命令。搜索包含“workflow”的所有服务：',
        'Notice choice 8, Symfony\\Component\\Workflow\\WorkflowInterface $commentStateMachine which tells you that using $commentStateMachine as an argument name has a special meaning.': '注意第 <code translate="no" class="notranslate">8</code> 个选项，<code translate="no" class="notranslate">Symfony\\Component\\Workflow\\WorkflowInterface $commentStateMachine</code>，它告诉您使用 <code translate="no" class="notranslate">$commentStateMachine</code> 作为参数名称具有特殊含义。',
        'We could have used the debug:autowiring command as seen in a previous chapter:': '我们本可以使用上一章中看到的 <code translate="no" class="notranslate">debug:autowiring</code> 命令：',
        'Going Further': '深入探索',
        'Workflows and State Machines and when to choose each one;': '<a href="https://symfony.com/doc/6.4/workflow/workflow-and-state-machine.html" class="reference external">工作流和状态机</a>以及何时选择它们；',
        'The Symfony Workflow docs.': '<a href="https://symfony.com/doc/6.4/workflow.html" class="reference external">Symfony 工作流文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Going Async': '异步处理',
        'Emailing Admins': '向管理员发送电子邮件'
    };

    fanyi(translates, 2);
})($);
