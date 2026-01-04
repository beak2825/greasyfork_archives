// ==UserScript==
// @name         Twig 翻译文档 templates.html
// @namespace    fireloong
// @version      0.1.1
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/templates.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492547/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20templateshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/492547/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20templateshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let cssStyle='code, pre{background:var(--code-background);}';
    GM_addStyle(cssStyle);

    $('#sln').hide();

    const translates = {
        'Twig for Template Designers': '模板设计师的 Twig',
        'Synopsis': '概要',
        'IDEs Integration': 'IDE 集成',
        'Variables': '变量',
        'Global Variables': '全局变量',
        'Setting Variables': '设置变量',
        'Filters': '过滤器',
        'Functions': '函数',
        'Named Arguments': '命名参数',
        'Control Structure': '控制结构',
        'Comments': '注释',
        'Including other Templates': '包含其它模板',
        'Template Inheritance': '模板继承',
        'HTML Escaping': 'HTML 转义',
        'Working with Manual Escaping': '使用手动转义',
        'Working with Automatic Escaping': '使用自动转义',
        'Escaping': '转义',
        'Macros': '宏',
        'Expressions': '表达式',
        'Literals': '字面常量',
        'Math': '数学',
        'Logic': '逻辑',
        'Comparisons': '比较',
        'Containment Operator': '控制操作符',
        'Test Operator': '测试操作符',
        'Other Operators': '其它操作符',
        'String Interpolation': '字符串插值',
        'Extensions': '扩展',
        'This document describes the syntax and semantics of the template engine and\nwill be most useful as reference to those creating Twig templates.': '本文档描述了模板引擎的语法和语义，对于创建 Twig 模板的人来说非常有用。',
        "A template is a regular text file. It can generate any text-based format (HTML,\nXML, CSV, LaTeX, etc.). It doesn't have a specific extension, .html or\n.xml are just fine.": '模板是一个常规文本文件。它可以生成任何基于文本的格式（HTML、XML、CSV、LaTeX等）。它没有特定的扩展名，<code translate="no" class="notranslate">.html</code> 或 <code translate="no" class="notranslate">.xml</code> 就可以了。',
        "A template contains variables or expressions, which get replaced with\nvalues when the template is evaluated, and tags, which control the\ntemplate's logic.": '模板包含<strong>变量</strong>或<strong>表达式</strong>，当对模板求值时，这些变量或表达式将被值替换，以及控制模板逻辑的<strong>标记</strong>。',
        'Below is a minimal template that illustrates a few basics. We will cover further\ndetails later on:': '下面是一个简单的模板，说明了一些基本知识。我们稍后将介绍更多细节：',
        'There are two kinds of delimiters: {% ... %} and {{ ... }}. The first\none is used to execute statements such as for-loops, the latter outputs the\nresult of an expression.': '有两种分隔符：<code translate="no" class="notranslate">{% ... %}</code> 和 <code translate="no" class="notranslate">{{ ... }}</code>。第一个用于执行语句，如 for 循环，后者输出表达式的结果。',
        'Many IDEs support syntax highlighting and auto-completion for Twig:': '许多 IDE 支持 Twig 的语法高亮显示和自动完成：',
        'Textmate via the Twig bundle': '<em>Textmate</em> 使用 <a href="https://github.com/Anomareh/PHP-Twig.tmbundle" class="reference external" rel="external noopener noreferrer" target="_blank">Twig bundle</a>',
        'Vim via the Jinja syntax plugin or the vim-twig plugin': '<em>Vim</em> 使用 <a href="http://jinja.pocoo.org/docs/integration/#vim" class="reference external" rel="external noopener noreferrer" target="_blank">Jinja syntax plugin</a> 或 <a href="https://github.com/lumiliet/vim-twig" class="reference external" rel="external noopener noreferrer" target="_blank">vim-twig plugin</a>',
        'Netbeans via the Twig syntax plugin (until 7.1, native as of 7.2)': '<em>Netbeans</em> 使用 <a href="http://plugins.netbeans.org/plugin/37069/php-twig" class="reference external" rel="external noopener noreferrer" target="_blank">Twig syntax plugin</a> (until 7.1, native as of 7.2)',
        'PhpStorm (native as of 2.1)': '<em>PhpStorm</em> (native as of 2.1)',
        'Eclipse via the Twig plugin': '<em>Eclipse</em> 使用 <a href="https://github.com/pulse00/Twig-Eclipse-Plugin" class="reference external" rel="external noopener noreferrer" target="_blank">Twig plugin</a>',
        'Sublime Text via the Twig bundle': '<em>Sublime Text</em> 使用 <a href="https://github.com/Anomareh/PHP-Twig.tmbundle" class="reference external" rel="external noopener noreferrer" target="_blank">Twig bundle</a>',
        'You might also be interested in:': '您可能还对以下内容感兴趣：',
        'TwigFiddle: an online service that allows you to execute Twig templates\nfrom a browser; it supports all versions of Twig': '<a href="https://twigfiddle.com/" class="reference external" rel="external noopener noreferrer" target="_blank">TwigFiddle</a>：一种在线服务，允许您从浏览器执行 Twig 模板；它支持所有版本的 Twig',
        'Twig Language Server: provides some language features like syntax\nhighlighting, diagnostics, auto complete, ...': '<a href="https://github.com/kaermorchen/twig-language-server/tree/master/packages/language-server" class="reference external" rel="external noopener noreferrer" target="_blank">Twig Language Server</a>：提供了一些语言功能，如语法高亮显示、诊断、自动完成等。。。',
        'The application passes variables to the templates for manipulation in the\ntemplate. Variables may have attributes or elements you can access, too. The\nvisual representation of a variable depends heavily on the application providing\nit.': '应用程序将变量传递给模板，以便在模板中进行操作。变量可能也有您可以访问的属性或元素。变量的可视化表示在很大程度上取决于提供它的应用程序。',
        'Use a dot (.) to access attributes of a variable (methods or properties of a\nPHP object, or items of a PHP array):': '使用句点（.）访问变量的属性（PHP对象的方法或属性，或PHP数组的项）：',
        "It's important to know that the curly braces are not part of the\nvariable but the print statement. When accessing variables inside tags,\ndon't put the braces around them.": '重要的是要知道大括号不是变量的一部分，而是 print 语句的一部分。访问标记中的变量时，不要在它们周围加大括号。',
        'If a variable or attribute does not exist, the behavior depends on the\nstrict_variables option value (see environment options):': '如果变量或属性不存在，则行为取决于 <code translate="no" class="notranslate">strict_variables</code> 选项值（请参见<a href="api.html#environment_options_strict_variables" class="reference internal">环境选项</a>）：',
        'When false, it returns null;': '当为 <code translate="no" class="notranslate">false</code> 时，返回 <code translate="no" class="notranslate">null</code>；',
        'When true, it throws an exception.': '如果为 <code translate="no" class="notranslate">true</code>，则抛出异常。',
        'The following variables are always available in templates:': '以下变量在模板中始终可用：',
        '_self: references the current template name;': '<code translate="no" class="notranslate">_self</code>：引用当前模板名称；',
        '_context: references the current context;': '<code translate="no" class="notranslate">_context</code>：引用当前上下文；',
        '_charset: references the current charset.': '<code translate="no" class="notranslate">_charset</code>：引用当前字符集。',
        'You can assign values to variables inside code blocks. Assignments use the\nset tag:': '可以将值分配给代码块内的变量。分配使用 <a href="tags/set.html" class="reference internal">set</a> 标记：',
        'Variables can be modified by filters. Filters are separated from the\nvariable by a pipe symbol (|). Multiple filters can be chained. The output\nof one filter is applied to the next.': '变量可以通过<strong>过滤器</strong>进行修改。过滤器通过管道符号(<code translate="no" class="notranslate">|</code>)与变量分开。多个过滤器可以链接在一起。将一个过滤器的输出应用于下一个过滤器。',
        'The following example removes all HTML tags from the name and title-cases\nit:': '下面的例子从 <code translate="no" class="notranslate">name</code> 中删除所有 HTML 标签并标题化：',
        'Filters that accept arguments have parentheses around the arguments. This\nexample joins the elements of a list by commas:': '接受参数的过滤器在参数周围有圆括号。下面的例子用逗号连接一个列表中的元素：',
        'To apply a filter on a section of code, wrap it with the\napply tag:': '要在一段代码上应用过滤器，用 <a href="tags/apply.html" class="reference internal">apply</a> 标签将其括起来：',
        'Go to the filters page to learn more about built-in\nfilters.': '转到<a href="tags/index.html" class="reference internal">过滤器</a>页面了解更多关于内置过滤器的信息。',
        'Functions can be called to generate content. Functions are called by their\nname followed by parentheses (()) and may have arguments.': '可以调用函数来生成内容。函数通过其名称后跟圆括号(<code translate="no" class="notranslate">()</code>)来调用，并且可以有参数。',
        'For instance, the range function returns a list containing an arithmetic\nprogression of integers:': '例如 <code translate="no" class="notranslate">range</code> 函数返回一个包含整数等差数列的列表：',
        'Go to the functions page to learn more about the\nbuilt-in functions.': '转到<a href="functions/index.html" class="reference internal">函数</a>页面了解更多关于内置函数的信息。',
        'Named arguments are supported in functions, filters and tests.': '函数、过滤器和测试中支持命名参数。',
        'Using named arguments makes your templates more explicit about the meaning of\nthe values you pass as arguments:': '使用命名参数可以使模板更明确地说明作为参数传递值的含义：',
        "Named arguments also allow you to skip some arguments for which you don't want\nto change the default value:": '命名参数也允许你跳过一些你不想改变默认值的参数：',
        'You can also use both positional and named arguments in one call, in which\ncase positional arguments must always come before named arguments:': '你也可以在一次调用中同时使用位置参数和命名参数，在这种情况下，位置参数必须总是出现在命名参数之前：',
        'Each function and filter documentation page has a section where the names\nof all arguments are listed when supported.': '每个函数和过滤器文档页面都有一个部分，其中列出了支持的所有参数的名称。',
        'A control structure refers to all those things that control the flow of a\nprogram - conditionals (i.e. if/elseif/else), for-loops, as\nwell as things like blocks. Control structures appear inside {% ... %}\nblocks.': '控制结构指的是控制程序流程的所有东西——条件语句(如 <code translate="no" class="notranslate">if</code>/<code translate="no" class="notranslate">elseif</code>/<code translate="no" class="notranslate">else</code>)、<code translate="no" class="notranslate">for</code> 循环以及块之类的东西。控制结构出现在 <code translate="no" class="notranslate">{% ... %}</code> 块里面。',
        'For example, to display a list of users provided in a variable called\nusers, use the for tag:': '例如，要显示一个名为 <code translate="no" class="notranslate">users</code> 的变量中提供的用户列表，使用 <a href="tags/for.html" class="reference internal">for</a> 标签：',
        'The if tag can be used to test an expression:': '<a href="tags/if.html" class="reference internal">if</a> 标签可用于测试表达式：',
        'Go to the tags page to learn more about the built-in tags.': '转到<a href="tags/index.html" class="reference internal">标签</a>页面了解更多关于内置标签的信息。',
        'To comment-out part of a line in a template, use the comment syntax {# ...\n#}. This is useful for debugging or to add information for other template\ndesigners or yourself:': '要注释掉模板中一行的一部分，请使用注释语法 <code translate="no" class="notranslate">{# ...#}</code>。这对于调试或为其他模板设计人员或您自己添加信息非常有用:',
        'The include function is useful to include a template\nand return the rendered content of that template into the current one:': '<a href="functions/include.html" class="reference internal">include</a> 函数用于包含模板并将该模板的渲染内容返回到当前模板中：',
        'By default, included templates have access to the same context as the template\nwhich includes them. This means that any variable defined in the main template\nwill be available in the included template too:': '默认情况下，包含的模板可以访问与包含它们的模板相同的上下文。这意味着在主模板中定义的任何变量也将在包含的模板中可用：',
        'The included template render_box.html is able to access the box variable.': '包含的模板 <code translate="no" class="notranslate">render_box.html</code> 能够访问 <code translate="no" class="notranslate">box</code> 变量。',
        'The name of the template depends on the template loader. For instance, the\n\\Twig\\Loader\\FilesystemLoader allows you to access other templates by giving the\nfilename. You can access templates in subdirectories with a slash:': '模板的名称取决于模板加载器。例如，<code translate="no" class="notranslate">\\Twig\\Loader\\FilesystemLoader</code> 允许您通过提供文件名来访问其它模板。你可以用斜杠访问子目录中的模板：',
        'This behavior depends on the application embedding Twig.': '这种行为取决于嵌入 Twig 的应用程序。',
        'The most powerful part of Twig is template inheritance. Template inheritance\nallows you to build a base "skeleton" template that contains all the common\nelements of your site and defines blocks that child templates can\noverride.': 'Twig 最强大的部分是模板继承。模板继承允许您构建一个基本的“骨架”模板，其中包含站点的所有常见元素，并定义子模板可以覆盖的<strong>块</strong>。',
        "It's easier to understand the concept by starting with an example.": '从一个例子开始会更容易理解这个概念。',
        "Let's define a base template, base.html, which defines an HTML skeleton\ndocument that might be used for a two-column page:": '让我们定义一个基本模板 <code translate="no" class="notranslate">base.html</code>，它定义了一个可能用于两列页面的HTML框架文档：',
        'In this example, the block tags define four blocks that\nchild templates can fill in. All the block tag does is to tell the\ntemplate engine that a child template may override those portions of the\ntemplate.': '在这个例子中，<a href="tags/block.html" class="reference internal">块</a>标记定义了四个子模板可以填充的块。<code translate="no" class="notranslate">block</code> 标记所做的就是告诉模板引擎子模板可以覆盖模板的这些部分。',
        'A child template might look like this:': '子模板可能是这样的：',
        'The extends tag is the key here. It tells the template\nengine that this template "extends" another template. When the template system\nevaluates this template, first it locates the parent. The extends tag should\nbe the first tag in the template.': '<a href="tags/extends.html" class="reference internal">extends</a> 标签是这里的关键。它告诉模板引擎这个模板“扩展”了另一个模板。当模板系统评估这个模板时，它首先定位父模板。extends 标签应该是模板中的第一个标签。',
         "Note that since the child template doesn't define the footer block, the\nvalue from the parent template is used instead.": '注意，因为子模板没有定义 <code translate="no" class="notranslate">footer</code> 块，所以使用父模板的值来代替。',
        "It's possible to render the contents of the parent block by using the\nparent function. This gives back the results of the\nparent block:": '可以使用 <a href="functions/parent.html" class="reference internal">parent</a> 函数来渲染父块的内容。这将返回父块的结果：',
        'The documentation page for the extends tag describes\nmore advanced features like block nesting, scope, dynamic inheritance, and\nconditional inheritance.': '<a href="tags/extends.html" class="reference internal">extends</a> 标记的文档页面描述了更高级的特性，如块嵌套、作用域、动态继承和条件继承。',
        'Twig also supports multiple inheritance via "horizontal reuse" with the help\nof the use tag.': '在 <a href="tags/use.html" class="reference internal">use</a> 标记的帮助下，Twig 还通过“水平重用”支持多重继承。',
        "When generating HTML from templates, there's always a risk that a variable\nwill include characters that affect the resulting HTML. There are two\napproaches: manually escaping each variable or automatically escaping\neverything by default.": '当从模板生成 HTML 时，变量中总是有可能包含影响生成 HTML 的字符。有两种方法：手动转义每个变量，或者默认情况下自动转义所有变量。',
        'Twig supports both, automatic escaping is enabled by default.': 'Twig 两者都支持，默认情况下启用自动转义。',
        'The automatic escaping strategy can be configured via the\nautoescape option and defaults to html.': '自动转义策略可以通过 <a href="api.html#environment_options" class="reference internal">autoescape</a> 选项配置，默认为 <code translate="no" class="notranslate">html</code>。',
        'If manual escaping is enabled, it is your responsibility to escape variables\nif needed. What to escape? Any variable that comes from an untrusted source.': '如果启用了手动转义，则您有责任在需要时转义变量。避免什么？来自不受信任来源的任何变量。',
        'Escaping works by using the escape or e filter:': '通过使用 <a href="filters/escape.html" class="reference internal">escape</a> 或 <code translate="no" class="notranslate">e</code> 过滤器进行转义：',
        'By default, the escape filter uses the html strategy, but depending on\nthe escaping context, you might want to explicitly use another strategy:': '默认情况下，<code translate="no" class="notranslate">escape</code> 过滤器使用 <code translate="no" class="notranslate">html</code> 策略，但根据转义上下文，你可能需要显式地使用另一种策略：',
        'Whether automatic escaping is enabled or not, you can mark a section of a\ntemplate to be escaped or not by using the autoescape\ntag:': '无论是否启用自动转义，您都可以使用 <a href="tags/autoescape.html" class="reference internal">autoescape</a> 标签将模板的一部分标记为转义或不转义：',
        'By default, auto-escaping uses the html escaping strategy. If you output\nvariables in other contexts, you need to explicitly escape them with the\nappropriate escaping strategy:': '默认情况下，自动转义使用 <code translate="no" class="notranslate">html</code> 转义策略。如果您在其他上下文中输出变量，则需要使用适当的转义策略显式转义它们：',
        'It is sometimes desirable or even necessary to have Twig ignore parts it would\notherwise handle as variables or blocks. For example if the default syntax is\nused and you want to use {{ as raw string in the template and not start a\nvariable you have to use a trick.': '有时需要甚至有必要让 Twig 忽略部分，否则它将作为变量或块处理。例如，如果使用默认语法，并且您希望在模板中使用 <code translate="no" class="notranslate">{{</code> 作为原始字符串，而不是启动变量，则必须使用技巧。',
        'The easiest way is to output the variable delimiter ({{) by using a variable\nexpression:': '最简单的方法是使用变量表达式输出变量分隔符(<code translate="no" class="notranslate">{{</code>)：',
        'For bigger sections it makes sense to mark a block\nverbatim.': '对于较大的部分，<a href="tags/verbatim.html" class="reference internal">verbatim</a> 标记块是有意义的。',
        'Macros are comparable with functions in regular programming languages. They are\nuseful to reuse HTML fragments to not repeat yourself. They are described in the\nmacro tag documentation.': '宏与常规编程语言中的函数类似。它们有助于重用 HTML 片段，避免重复。它们在<a href="tags/macro.html" class="reference internal">宏</a>标记文档中有描述。',
        'Twig allows expressions everywhere.': 'Twig 允许无处不在的表达式。',
        'The operator precedence is as follows, with the lowest-precedence operators\nlisted first: ?: (ternary operator), b-and, b-xor, b-or,\nor, and, ==, !=, <=>, <, >, >=, <=,\nin, matches, starts with, ends with, has every, has\nsome, .., +, -,\n~, *, /, //, %, is (tests), **, ??, |\n(filters), [], and .:': '操作符优先级如下，优先级最低的操作符首先列出：<code translate="no" class="notranslate">?:</code>(三元操作符)，<code translate="no" class="notranslate">b-and</code>, <code translate="no" class="notranslate">b-xor</code>,<code translate="no" class="notranslate">b-or</code>, <code translate="no" class="notranslate">or</code>, <code translate="no" class="notranslate">and</code>，<code translate="no" class="notranslate">==</code>，<code translate="no" class="notranslate">!=</code>，<code translate="no" class="notranslate">&lt;=&gt;</code>，<code translate="no" class="notranslate">&lt;</code>，<code translate="no" class="notranslate">&gt;</code>，<code translate="no" class="notranslate">&gt;=</code>，<code translate="no" class="notranslate">&lt;=</code>，<code translate="no" class="notranslate">in</code>, <code translate="no" class="notranslate">matches</code>,<code translate="no" class="notranslate">starts with</code>,<code translate="no" class="notranslate">ends with</code>,<code translate="no" class="notranslate">has every</code>,<code translate="no" class="notranslate">has some</code>，<code translate="no" class="notranslate">..</code>,<code translate="no" class="notranslate">+</code>,<code translate="no" class="notranslate">-</code>,<code translate="no" class="notranslate">~</code>,<code translate="no" class="notranslate">*</code>,<code translate="no" class="notranslate">/</code>,<code translate="no" class="notranslate">//</code>,<code translate="no" class="notranslate">%</code>,<code translate="no" class="notranslate">is</code> (测试)，<code translate="no" class="notranslate">**</code>，<code translate="no" class="notranslate">??</code>，<code translate="no" class="notranslate">|</code>(过滤器)，<code translate="no" class="notranslate">[]</code> 和 <code translate="no" class="notranslate">.</code>：',
        'The simplest form of expressions are literals. Literals are representations\nfor PHP types such as strings, numbers, and arrays. The following literals\nexist:': '表达式的最简单形式是字面量。字面量是 PHP 类型(如字符串、数字和数组)的表示形式。存在以下文字：',
        '"Hello World": Everything between two double or single quotes is a\nstring. They are useful whenever you need a string in the template (for\nexample as arguments to function calls, filters or just to extend or include\na template). A string can contain a delimiter if it is preceded by a\nbackslash (\\) -- like in \'It\\\'s good\'. If the string contains a\nbackslash (e.g. \'c:\\Program Files\') escape it by doubling it\n(e.g. \'c:\\\\Program Files\').': '<code translate="no" class="notranslate">"Hello World"</code>：两个双引号或单引号之间的所有内容都是字符串。当你在模板中需要一个字符串时，它们是有用的(例如，作为函数调用的参数，过滤器或只是为了扩展或包含模板)。如果字符串前面有反斜杠(<code translate="no" class="notranslate">\\</code>)，那么它可以包含分隔符——就像 <code translate="no" class="notranslate">\'It\\\'s good\'</code> 一样。如果字符串包含反斜杠(例如：<code translate="no" class="notranslate">\'c:\\Program Files\'</code>)通过加倍来转义它(例如：<code translate="no" class="notranslate">\'c:\\\\Program Files\'</code>)。',
        '42 / 42.23: Integers and floating point numbers are created by\nwriting the number down. If a dot is present the number is a float,\notherwise an integer.': '<code translate="no" class="notranslate">42</code> / <code translate="no" class="notranslate">42.23</code>：整数和浮点数是通过把数字写下来创建的。如果出现点，则数字为浮点数，否则为整数。',
        '["foo", "bar"]: Arrays are defined by a sequence of expressions\nseparated by a comma (,) and wrapped with squared brackets ([]).': '<code translate="no" class="notranslate">["foo", "bar"]</code>：数组由一系列表达式定义，由逗号(<code translate="no" class="notranslate">,</code>)分隔，并用方括号(<code translate="no" class="notranslate">[]</code>)包裹。',
        '{"foo": "bar"}: Hashes are defined by a list of keys and values\nseparated by a comma (,) and wrapped with curly braces ({}):': '<p><code translate="no" class="notranslate">{"foo": "bar"}</code>：哈希是由一个键和值列表定义的，这些键和值由逗号(<code translate="no" class="notranslate">,</code>)分隔，并用花括号(<code translate="no" class="notranslate">{}</code>)括起来：',
        'true / false: true represents the true value, false\nrepresents the false value.': '<code translate="no" class="notranslate">true</code> / <code translate="no" class="notranslate">false</code>：<code translate="no" class="notranslate">true</code> 表示真值，<code translate="no" class="notranslate">false</code> 表示假值。',
        'null: null represents no specific value. This is the value returned\nwhen a variable does not exist. none is an alias for null.': '<code translate="no" class="notranslate">null</code>：<code translate="no" class="notranslate">null</code> 表示没有特定的值。这是当变量不存在时返回的值。<code translate="no" class="notranslate">none</code> 是 <code translate="no" class="notranslate">null</code> 的别名。',
        'Arrays and hashes can be nested:': '数组和散列可以嵌套：',
        'Using double-quoted or single-quoted strings has no impact on performance\nbut string interpolation is only\nsupported in double-quoted strings.': '使用双引号或单引号字符串对性能没有影响，但字符串插值只支持双引号字符串。',
        'Twig allows you to do math in templates; the following operators are supported:': 'Twig 允许你在模板中做数学；支持以下操作符：',
        '+: Adds two numbers together (the operands are casted to numbers). {{\n1 + 1 }} is 2.': '<code translate="no" class="notranslate">+</code>：将两个数字相加(操作数被强制转换为数字)。<code translate="no" class="notranslate">{{1 + 1 }}</code> 是 <code translate="no" class="notranslate">2</code>。',
        '-: Subtracts the second number from the first one. {{ 3 - 2 }} is\n1.': '<code translate="no" class="notranslate">-</code>：用第一个数减去第二个数。<code translate="no" class="notranslate">{{ 3 - 2 }}</code> 是 <code translate="no" class="notranslate">1</code>。',
        '/: Divides two numbers. The returned value will be a floating point\nnumber. {{ 1 / 2 }} is {{ 0.5 }}.': '<code translate="no" class="notranslate">/</code>：两个数字相除。返回的值将是一个浮点数。<code translate="no" class="notranslate">{{ 1 / 2 }}</code> 是 <code translate="no" class="notranslate">{{ 0.5 }}</code>。',
        '%: Calculates the remainder of an integer division. {{ 11 % 7 }} is\n4.': '<code translate="no" class="notranslate">%</code>：计算整数除法的余数。<code translate="no" class="notranslate">{{ 11 % 7 }}</code> 是 <code translate="no" class="notranslate">4</code>。',
        '//: Divides two numbers and returns the floored integer result. {{ 20\n// 7 }} is 2, {{ -20  // 7 }} is -3 (this is just syntactic\nsugar for the round filter).': '<code translate="no" class="notranslate">//</code>：对两个数字进行除法运算，并返回求底整数的结果。<code translate="no" class="notranslate">{{ 20 // 7 }}</code> 是 <code translate="no" class="notranslate">2</code>，<code translate="no" class="notranslate">{{ -20  // 7 }}</code> 是 <code translate="no" class="notranslate">-3</code>（这只是 <a href="filters/round.html" class="reference internal">round</a> 过滤器的语法糖）。',
        '*: Multiplies the left operand with the right one. {{ 2 * 2 }} would\nreturn 4.': '<code translate="no" class="notranslate">*</code>：将左操作数与右操作数相乘。<code translate="no" class="notranslate">{{ 2 * 2 }}</code> 将返回 <code translate="no" class="notranslate">4</code>。',
        '**: Raises the left operand to the power of the right operand. {{ 2 **\n3 }} would return 8.': '<code translate="no" class="notranslate">**</code>：将左操作数提升为右操作数的幂。<code translate="no" class="notranslate">{{ 2 ** 3 }}</code> 将返回 <code translate="no" class="notranslate">8</code>。',
        'You can combine multiple expressions with the following operators:': '可以使用以下操作符组合多个表达式：',
        'and: Returns true if the left and the right operands are both true.': '<code translate="no" class="notranslate">and</code>：如果左右操作数都为真，则返回真。',
        'or: Returns true if the left or the right operand is true.': '<code translate="no" class="notranslate">or</code>：如果左操作数或右操作数为真，则返回真。',
        'not: Negates a statement.': '<code translate="no" class="notranslate">not</code>：否定一个语句。',
        '(expr): Groups an expression.': '<code translate="no" class="notranslate">(expr)</code>：对表达式进行分组。',
        'Twig also supports bitwise operators (b-and, b-xor, and b-or).': 'Twig 还支持位运算符(<code translate="no" class="notranslate">b-and</code>，<code translate="no" class="notranslate">b-xor</code> 和 <code translate="no" class="notranslate">b-or</code>)。',
        'Operators are case sensitive.': '操作符区分大小写。',
        'The following comparison operators are supported in any expression: ==,\n!=, <, >, >=, and <=.': '任何表达式都支持以下比较操作符：<code translate="no" class="notranslate">==</code>，<code translate="no" class="notranslate">!=</code>，<code translate="no" class="notranslate">&lt;</code>，<code translate="no" class="notranslate">&gt;</code>，<code translate="no" class="notranslate">&gt;=</code> 和 <code translate="no" class="notranslate">&lt;=</code>。',
        'Check if a string starts with or ends with another string:': '检查字符串是否 <code translate="no" class="notranslate">starts with</code> 或 <code translate="no" class="notranslate">ends with</code> 是另一个字符串：',
        'Check that a string contains another string via the containment operator (see\nnext section).': '通过包含运算符检查一个字符串是否包含另一个字符串(参见下一节)。',
        'For complex string comparisons, the matches operator allows you to use\nregular expressions:': '对于复杂的字符串比较，<code translate="no" class="notranslate">matches</code> 操作符允许您使用<a href="https://www.php.net/manual/zh/pcre.pattern.php" class="reference external" rel="external noopener noreferrer" target="_blank">正则表达式</a>：',
        'Check that a sequence or a mapping has every or has some of its\nelements return true using an arrow function. The arrow function receives\nthe value of the sequence or mapping:': '使用箭头函数检查序列或映射的 <code translate="no" class="notranslate">has every</code> 或 <code translate="no" class="notranslate">has some</code> 元素是否返回 <code translate="no" class="notranslate">true</code>。箭头函数接收序列或映射的值：',
         'The in operator performs containment test. It returns true if the left\noperand is contained in the right:': '<code translate="no" class="notranslate">in</code> 操作符执行包含测试。如果左操作数包含在右操作数中，则返回 <code translate="no" class="notranslate">true</code>：',
        'You can use this filter to perform a containment test on strings, arrays,\nor objects implementing the Traversable interface.': '您可以使用此过滤器对实现 <code translate="no" class="notranslate">Traversable</code> 接口的字符串、数组或对象执行包含测试。',
        'To perform a negative test, use the not in operator:': '要执行否测试，请使用 <code translate="no" class="notranslate">not in</code> 操作符:',
        'The is operator performs tests. Tests can be used to test a variable against\na common expression. The right operand is name of the test:': '<code translate="no" class="notranslate">is</code> 操作符执行测试。测试可用于根据公共表达式测试变量。右操作数是测试的名称：',
        'Tests can accept arguments too:': '测试也可以接受参数:',
        'Tests can be negated by using the is not operator:': '可以使用 <code translate="no" class="notranslate">is not</code> 操作符来否定测试：',
        'Go to the tests page to learn more about the built-in\ntests.': '转到<a href="tests/index.html" class="reference internal">测试</a>页面以了解有关内置测试的更多信息。',
        "The following operators don't fit into any of the other categories:": '以下操作符不属于任何其它类别：',
        '|: Applies a filter.': '<code translate="no" class="notranslate">|</code>：应用过滤器。',
        '..: Creates a sequence based on the operand before and after the operator\n(this is syntactic sugar for the range function):': '<code translate="no" class="notranslate">..</code>：根据操作符前后的操作数创建一个序列(这是 <a href="functions/range.html" class="reference internal">range</a> 函数的语法糖)：',
         'Note that you must use parentheses when combining it with the filter operator\ndue to the operator precedence rules:': '注意，由于<a href="templates.html#twig-expressions" class="reference internal">运算符优先级规则</a>，在将其与过滤器运算符组合时必须使用括号：',
        '~: Converts all operands into strings and concatenates them. {{ "Hello\n" ~ name ~ "!" }} would return (assuming name is \'John\') Hello\nJohn!.': '将所有操作数转换为字符串并将它们连接起来。<code translate="no" class="notranslate">{{ "Hello" ~ name ~ "!" }}</code> 将返回（假设 <code translate="no" class="notranslate">name</code> 是 <code translate="no" class="notranslate">\'John\'</code>）<code translate="no" class="notranslate">Hello John!</code>。',
        '., []: Gets an attribute of a variable.': '<code translate="no" class="notranslate">.</code>, <code translate="no" class="notranslate">[]</code>：获取变量的属性。',
        '?:: The ternary operator:': '<code translate="no" class="notranslate">?:</code>：三元运算符：',
        '??: The null-coalescing operator:': '<code translate="no" class="notranslate">??</code>：空合并运算符：',
        '...: The spread operator can be used to expand arrays or hashes (it cannot\nbe used to expand the arguments of a function call):': '<code translate="no" class="notranslate">...</code>：扩展操作符可用于展开数组或散列(不能用于展开函数调用的参数)：',
        'String interpolation (#{expression}) allows any valid expression to appear\nwithin a double-quoted string. The result of evaluating that expression is\ninserted into the string:': '字符串插值(<code translate="no" class="notranslate">#{expression}</code>)允许任何有效的表达式出现在双引号字符串中。表达式的求值结果被插入到字符串中：',
        'Whitespace Control': '空格控制',
        'The first newline after a template tag is removed automatically (like in PHP).\nWhitespace is not further modified by the template engine, so each whitespace\n(spaces, tabs, newlines etc.) is returned unchanged.': '模板标记后的第一个换行符会自动删除(与PHP类似)。模板引擎不会进一步修改空白，因此每个空白(空格、制表符、换行符等)都会原样返回。',
        'You can also control whitespace on a per tag level. By using the whitespace\ncontrol modifiers on your tags, you can trim leading and or trailing whitespace.': '您还可以在每个标记级别上控制空白。通过在标记上使用空白控制修饰符，可以修剪前导和/或尾随空白。',
        'Twig supports two modifiers:': 'Twig 支持两个修饰符：',
        'Whitespace trimming via the - modifier: Removes all whitespace\n(including newlines);': '通过 <code translate="no" class="notranslate">-</code> 修饰符<em>修剪空白</em>：删除所有空白(包括换行符)；',
        'Line whitespace trimming via the ~ modifier: Removes all whitespace\n(excluding newlines). Using this modifier on the right disables the default\nremoval of the first newline inherited from PHP.': '通过 <code translate="no" class="notranslate">~</code> 修饰符<em>修剪行空白</em>：删除所有空白(不包括换行符)。在右侧使用此修饰符禁用从 PHP 继承的第一个换行符的默认删除。',
        'The modifiers can be used on either side of the tags like in {%- or -%}\nand they consume all whitespace for that side of the tag. It is possible to use\nthe modifiers on one side of a tag or on both sides:': '修饰符可以在标记的任何一侧使用，例如在 <code translate="no" class="notranslate">{%-</code> 或 <code translate="no" class="notranslate">-%}</code> 中，它们占用标记那一侧的所有空白。修饰语可以用在标签的一面，也可以用在两面：',
        'In addition to the whitespace modifiers, Twig also has a spaceless filter\nthat removes whitespace between HTML tags:': '除了空白修饰符，Twig 还有一个 <code translate="no" class="notranslate">spaceless</code> 过滤器，可以删除 <strong>HTML 标签之间</strong>的空白：',
        'Twig can be extended. If you want to create your own extensions, read the\nCreating an Extension chapter.': 'Twig 可以扩展。如果您想创建自己的扩展，请阅读<a href="advanced.html#creating_extensions" class="reference internal">创建扩展</a>一章。',
    };


    //let arr = [];

    $('#doc-toc a,.section h1 a,.section h2 a,.section h3 a,.section p,.section li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
            //arr.push($(this).text());
        }
    });

    //console.log(arr);
})($);