// ==UserScript==
// @name         Book for Symfony 6 翻译 10-twig.html
// @namespace    fireloong
// @version      0.0.6
// @description  构建用户界面 10-twig.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/10-twig.html
// @match        https://symfony.com/doc/current/the-fast-track/en/10-twig.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502060/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2010-twightml.user.js
// @updateURL https://update.greasyfork.org/scripts/502060/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2010-twightml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Building the User Interface\n        \n            ': '构建用户界面',
        "Everything is now in place to create the first version of the website user interface. We won't make it pretty. Just functional for now.": '现在一切准备就绪，可以创建网站用户界面的第一个版本了。我们现在不会让它变得很漂亮，只要能用就行。',
        "Remember the escaping we had to do in the controller for the easter egg to avoid security issues? We won't use PHP for our templates for that reason. Instead, we will use Twig. Besides handling output escaping for us, Twig brings a lot of nice features we will leverage, like template inheritance.": '还记得我们在控制器中为了避开安全问题而不得不做的那个彩蛋吗？出于这个原因，我们不会在模板中使用 PHP。相反，我们将使用 Twig。除了为我们处理输出转义之外，<a href="https://twig.symfony.com/" class="reference external">Twig</a> 还带来了许多我们将利用的好功能，比如模板继承。',
        'Using Twig for the Templates': '在模板中使用 Twig',
        'All pages on the website will share the same layout. When installing Twig, a templates/ directory has been created automatically and a sample layout was created as well in base.html.twig.': '网站上的所有页面都将共享相同的布局。在安装 Twig 时，已自动创建了一个 <code translate="no" class="notranslate">templates/</code> 目录，并在 <code translate="no" class="notranslate">base.html.twig</code> 中创建了一个示例布局。',
        'A layout can define block elements, which are the places where child templates that extend the layout add their contents.': '布局可以定义 <code translate="no" class="notranslate">block</code> 元素，这是扩展布局的子模板添加其内容的位置。',
        "Let's create a template for the project's homepage in templates/conference/index.html.twig:": '让我们在 <code translate="no" class="notranslate">templates/conference/index.html.twig</code> 中为项目的首页创建一个模板：',
        'The template extends base.html.twig and redefines the title and body blocks.': '该模板扩展了 <code translate="no" class="notranslate">base.html.twig</code> 并重新定义了 <code translate="no" class="notranslate">title</code> 和 <code translate="no" class="notranslate">body</code> 块。',
        'The {% %} notation in a template indicates actions and structure.': '模板中的 <code translate="no" class="notranslate">{% %}</code> 符号表示动作和结构。',
        'The {{ }} notation is used to display something. {{ conference }} displays the conference representation (the result of calling __toString on the Conference object).': '<code translate="no" class="notranslate">{{ }}</code> 符号用于显示某些内容。<code translate="no" class="notranslate">{{ conference }}</code> 显示会议代表（对 <code translate="no" class="notranslate">Conference</code> 对象调用 <code translate="no" class="notranslate">__toString</code> 的结果）。',
        'Using Twig in a Controller': '在控制器中使用 Twig',
        'Update the controller to render the Twig template:': '更新控制器以渲染 Twig 模板：',
        'There is a lot going on here.': '这里发生了很多事情。',
        'To be able to render a template, we need the Twig Environment object (the main Twig entry point). Notice that we ask for the Twig instance by type-hinting it in the controller method. Symfony is smart enough to know how to inject the right object.': '为了能够渲染一个模板，我们需要 Twig <code translate="no" class="notranslate">Environment</code> 对象（ Twig 的主要入口点）。请注意，我们在控制器方法中通过类型提示来请求 Twig 实例。Symfony 足够聪明，知道如何注入正确的对象。',
        'We also need the conference repository to get all conferences from the database.': '我们还需要会议仓库来从数据库中获取所有会议。',
        'In the controller code, the render() method renders the template and passes an array of variables to the template. We are passing the list of Conference objects as a conferences variable.': '在控制器代码中，<code translate="no" class="notranslate">render()</code> 方法渲染模板并将变量数组传递给模板。我们正在将 <code translate="no" class="notranslate">Conference</code> 对象列表作为 <code translate="no" class="notranslate">conferences</code> 变量传递。',
        "A controller is a standard PHP class. We don't even need to extend the AbstractController class if we want to be explicit about our dependencies. You can remove it (but don't do it, as we will use the nice shortcuts it provides in future steps).": '控制器是一个标准的 PHP 类。如果我们想明确我们的依赖关系，我们甚至不需要扩展 <code translate="no" class="notranslate">AbstractController</code> 类。你可以删除它（但不要这样做，因为我们在未来的步骤中会用到它提供的很好的快捷方式）。',
        'Creating the Page for a Conference': '为会议创建页面',
        'Each conference should have a dedicated page to list its comments. Adding a new page is a matter of adding a controller, defining a route for it, and creating the related template.': '每个会议都应该有一个专门的页面来列出其评论。添加一个新页面涉及到添加一个控制器，为其定义路由，并创建相关的模板。',
        'Add a show() method in src/Controller/ConferenceController.php:': '在 <code translate="no" class="notranslate">src/Controller/ConferenceController.php</code> 中添加一个 <code translate="no" class="notranslate">show()</code> 方法：',
        'This method has a special behavior we have not seen yet. We ask for a Conference instance to be injected in the method. But there may be many of these in the database. Symfony is able to determine which one you want based on the {id} passed in the request path (id being the primary key of the conference table in the database).': '这个方法有一个我们还没有见过的特殊行为。我们要求将一个 <code translate="no" class="notranslate">Conference</code> 实例注入到方法中。但是数据库中可能有很多这样的实例。Symfony 能够根据请求路径中传递的 <code translate="no" class="notranslate">{id}</code>（<code translate="no" class="notranslate">id</code> 是数据库中 <code translate="no" class="notranslate">conference</code> 表的主键）来确定您想要哪一个。',
        'Retrieving the comments related to the conference can be done via the findBy() method which takes a criteria as a first argument.': '可以通过 <code translate="no" class="notranslate">findBy()</code> 方法来检索与会议相关的评论，该方法的第一个参数是条件。',
        'The last step is to create the templates/conference/show.html.twig file:': '最后一步是创建 <code translate="no" class="notranslate">templates/conference/show.html.twig</code> 文件：',
        "In this template, we are using the | notation to call Twig filters. A filter transforms a value. comments|length returns the number of comments and comment.createdAt|format_datetime('medium', 'short') formats the date in a human readable representation.": '在这个模板中，我们使用 <code translate="no" class="notranslate">|</code> 符号来调用 Twig 过滤器。过滤器用于转换值。<code translate="no" class="notranslate">comments|length</code> 返回评论的数量，而 <code translate="no" class="notranslate">comment.createdAt|format_datetime(\'medium\', \'short\')</code> 则将日期格式化为人类可读的表示形式。',
        'Try to reach the "first" conference via /conference/1, and notice the following error:': '尝试通过 <code translate="no" class="notranslate">/conference/1</code> 访问“第一个”会议，并注意到以下错误：',
        'The error comes from the format_datetime filter as it is not part of Twig core. The error message gives you a hint about which package should be installed to fix the problem:': '该错误来自 <code translate="no" class="notranslate">format_datetime</code> 过滤器，因为它不是 Twig 核心的一部分。错误消息会提示您应该安装哪个包来解决这个问题：',
        'Now the page works properly.': '现在页面可以正常工作了。',
        'Linking Pages Together': '将页面链接在一起',
        'The very last step to finish our first version of the user interface is to link the conference pages from the homepage:': '完成我们用户界面第一个版本的最后一步是将会议页面从主页链接起来：',
        'But hard-coding a path is a bad idea for several reasons. The most important reason is if you change the path (from /conference/{id} to /conferences/{id} for instance), all links must be updated manually.': '但是出于几个原因，硬编码路径是一个坏主意。最重要的原因是，如果你更改了路径（例如从 <code translate="no" class="notranslate">/conference/{id}</code> 改为 <code translate="no" class="notranslate">/conferences/{id}</code>），则必须手动更新所有链接。',
        'Instead, use the path() Twig function and use the route name:': '相反，使用 <code translate="no" class="notranslate">path()</code> Twig 函数并使用路由名称：',
        'The path() function generates the path to a page using its route name. The values of the route parameters are passed as a Twig map.': '<code translate="no" class="notranslate">path()</code> 函数使用路由名称生成到页面的路径。路由参数的值作为 Twig 映射传递。',
        'Paginating the Comments': '对评论进行分页',
        'With thousands of attendees, we can expect quite a few comments. If we display them all on a single page, it will grow very fast.': '由于有成千上万的与会者，我们可以预料到会有相当多的评论。如果我们把它们全部显示在一个页面上，那么页面会很快变得非常长。',
        'Create a getCommentPaginator() method in the Comment Repository that returns a Comment Paginator based on a conference and an offset (where to start):': '在 Comment Repository 中创建一个 <code translate="no" class="notranslate">getCommentPaginator()</code> 方法，该方法根据会议和偏移量（从哪里开始）返回一个 Comment Paginator：',
        'We have set the maximum number of comments per page to 2 to ease testing.': '我们已将每页的最大评论数设置为 2，以便进行测试。',
        'To manage the pagination in the template, pass the Doctrine Paginator instead of the Doctrine Collection to Twig:': '为了在模板中管理分页，请将 Doctrine Paginator 而不是 Doctrine Collection 传递给 Twig：',
        'The controller gets the offset from the Request query string ($request->query) as an integer (getInt()), defaulting to 0 if not available.': '控制器从请求查询字符串（<code translate="no" class="notranslate">$request-&gt;query</code>）中获取 <code translate="no" class="notranslate">offset</code> 作为整数（<code translate="no" class="notranslate">getInt()</code>），如果不可用，则默认为 0。',
        'The previous and next offsets are computed based on all the information we have from the paginator.': '<code translate="no" class="notranslate">previous</code> 和 <code translate="no" class="notranslate">next</code> 偏移量是根据我们从分页器获得的所有信息计算得出的。',
        'Finally, update the template to add links to the next and previous pages:': '最后，更新模板以添加指向下一页和上一页的链接：',
        'You should now be able to navigate the comments via the "Previous" and "Next" links:': '现在您应该能够通过“上一页”和“下一页”链接浏览评论：',
        'Refactoring the Controller': '重构控制器',
        "You might have noticed that both methods in ConferenceController take a Twig environment as an argument. Instead of injecting it into each method, let's leverage the render() helper method provided by the parent class:": '您可能已经注意到，<code translate="no" class="notranslate">ConferenceController</code> 中的两个方法都将 Twig 环境作为参数。与其将它注入到每个方法中，不如利用父类提供的 <code translate="no" class="notranslate">render()</code> 辅助方法：',
        'Going Further': '深入探索',
        'Twig docs;': '<a href="https://twig.symfony.com/doc/" class="reference external">Twig 文档</a>；',
        'Creating and Using Templates in Symfony applications;': '在 Symfony 应用程序中<a href="https://symfony.com/doc/6.4/templates.html" class="reference external">创建和使用模板</a>；',
        'SymfonyCasts Twig tutorial;': '<a href="https://symfonycasts.com/screencast/symfony/twig-recipe" class="reference external" rel="external noopener noreferrer" target="_blank">SymfonyCasts Twig 教程</a>；',
        'Twig functions and filters only available in Symfony;': '<a href="https://symfony.com/doc/6.4/reference/twig_reference.html" class="reference external">仅在 Symfony 中可用的 Twig 函数和过滤器</a>；',
        'The AbstractController base controller.': '<a href="https://symfony.com/doc/6.4/controller.html#the-base-controller-classes-services" class="reference external">AbstractController 基础控制器</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Setting up an Admin Backend': '设置管理后端',
        'Branching the Code': '代码分支',
    };

    fanyi(translates, 2);
})($);
