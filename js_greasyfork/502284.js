// ==UserScript==
// @name         Book for Symfony 6 翻译 17-tests.html
// @namespace    fireloong
// @version      0.1.1
// @description  测试 17-tests.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/17-tests.html
// @match        https://symfony.com/doc/current/the-fast-track/en/17-tests.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502284/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2017-testshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502284/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2017-testshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Testing\n        \n            ': '测试',
        'As we start to add more and more functionality to the application, it is probably the right time to talk about testing.': '随着我们开始在应用程序中添加越来越多的功能，现在可能是谈论测试的正确时机。',
        'Fun fact: I found a bug while writing the tests in this chapter.': '有趣的事实：在编写本章的测试时，我发现了一个错误。',
        'Symfony relies on PHPUnit for unit tests. Let\'s install it:': 'Symfony 依赖于 PHPUnit 进行单元测试。让我们来安装它：',
        'Writing Unit Tests': '编写单元测试',
        'SpamChecker is the first class we are going to write tests for. Generate a unit test:': 'SpamChecker 是我们将要为其编写测试的第一个类。生成一个单元测试：',
        'Testing the SpamChecker is a challenge as we certainly don\'t want to hit the Akismet API. We are going to mock the API.': '测试 SpamChecker 是一个挑战，因为我们当然不想触及 Akismet API。我们将模拟 API。',
        'Let\'s write a first test for when the API returns an error:': '让我们为 API 返回错误时编写第一个测试：',
        'The MockHttpClient class makes it possible to mock any HTTP server. It takes an array of MockResponse instances that contain the expected body and Response headers.': '<code translate="no" class="notranslate">MockHttpClient</code> 类使得模拟任何 HTTP 服务器成为可能。它接受一个 <code translate="no" class="notranslate">MockResponse</code> 实例的数组，这些实例包含预期的主体和响应头。',
        'Then, we call the getSpamScore() method and check that an exception is thrown via the expectException() method of PHPUnit.': '然后，我们调用 <code translate="no" class="notranslate">getSpamScore()</code> 方法，并通过 PHPUnit 的 <code translate="no" class="notranslate">expectException()</code> 方法检查是否抛出了异常。',
        'Run the tests to check that they pass:': '运行测试以检查它们是否通过：',
        'Let\'s add tests for the happy path:': '让我们为顺利的情况添加测试：',
        'PHPUnit data providers allow us to reuse the same test logic for several test cases.': 'PHPUnit 数据提供者允许我们为多个测试用例重用相同的测试逻辑。',
        'Writing Functional Tests for Controllers': '为控制器编写功能测试',
        'Testing controllers is a bit different than testing a "regular" PHP class as we want to run them in the context of an HTTP request.': '测试控制器与测试一个“常规”PHP类有点不同，因为我们希望它们在 HTTP 请求的上下文中运行。',
        'Create a functional test for the Conference controller:': '为 Conference 控制器创建一个功能测试：',
        'Using Symfony\\Bundle\\FrameworkBundle\\Test\\WebTestCase instead of PHPUnit\\Framework\\TestCase as a base class for our tests gives us a nice abstraction for functional tests.': '在我们的测试中，使用 <code translate="no" class="notranslate">Symfony<wbr>\\Bundle<wbr>\\FrameworkBundle<wbr>\\Test<wbr>\\WebTestCase</wbr></wbr></wbr></wbr></code> 作为基类而不是 <code translate="no" class="notranslate">PHPUnit\\Framework\\TestCase</code>，可以为我们提供一个很好的功能测试抽象。',
        'The $client variable simulates a browser. Instead of making HTTP calls to the server though, it calls the Symfony application directly. This strategy has several benefits: it is much faster than having round-trips between the client and the server, but it also allows the tests to introspect the state of the services after each HTTP request.': '<code translate="no" class="notranslate">$client</code> 变量模拟了一个浏览器。不过，它不是向服务器发起 HTTP 调用，而是直接调用 Symfony 应用程序。这种策略有几个好处：它比客户端和服务器之间的往返要快得多，但它还允许测试在每个 HTTP 请求后检查服务的状态。',
        'This first test checks that the homepage returns a 200 HTTP response.': '这个第一个测试检查主页是否返回了 200 HTTP 响应。',
        'Assertions such as assertResponseIsSuccessful are added on top of PHPUnit to ease your work. There are many such assertions defined by Symfony.': '在 PHPUnit 之上添加了诸如 <code translate="no" class="notranslate">assertResponseIsSuccessful</code> 这样的断言，以简化您的工作。Symfony 定义了许多这样的断言。',
        'We have used / for the URL instead of generating it via the router. This is done on purpose as testing end-user URLs is part of what we want to test. If you change the route path, tests will break as a nice reminder that you should probably redirect the old URL to the new one to be nice with search engines and websites that link back to your website.': '我们使用 <code translate="no" class="notranslate">/</code> 作为 URL 而不是通过路由器生成它。这是有意为之，因为测试最终用户 URL 是我们想要测试的一部分。如果您更改路由路径，测试将中断，这是一个很好的提醒，您可能应该将旧 URL 重定向到新 URL，以便与搜索引擎和链接回您网站的网站友好相处。',
        'Configuring the Test Environment': '配置测试环境',
        'By default, PHPUnit tests are run in the test Symfony environment as defined in the PHPUnit configuration file:': '默认情况下，PHPUnit 测试在 PHPUnit 配置文件中定义的 <code translate="no" class="notranslate">test</code> Symfony 环境中运行：',
        'To make tests work, we must set the AKISMET_KEY secret for this test environment:': '为了使测试能够工作，我们必须为这个 <code translate="no" class="notranslate">test</code> 环境设置 <code translate="no" class="notranslate">AKISMET_KEY</code> 密钥：',
        'Working with a Test Database': '使用测试数据库',
        'As we have already seen, the Symfony CLI automatically exposes the DATABASE_URL environment variable. When APP_ENV is test, like set when running PHPUnit, the database name changes from app to app_test so that tests have their very own database:': '正如我们已经看到的，Symfony CLI 会自动公开 <code translate="no" class="notranslate">DATABASE_URL</code> 环境变量。当 <code translate="no" class="notranslate">APP_ENV</code> 设置为 <code translate="no" class="notranslate">test</code>（如运行 PHPUnit 时所设置的那样）时，数据库名称会从 <code translate="no" class="notranslate">app</code> 更改为 <code translate="no" class="notranslate">app_test</code>，以便测试拥有自己的数据库：',
        'This is very important as we will need some stable data to run our tests and we certainly don\'t want to override what we stored in the development database.': '这非常重要，因为我们需要一些稳定的数据来运行我们的测试，而我们当然不想覆盖我们在开发数据库中存储的内容。',
        'Before being able to run the test, we need to "initialize" the test database (create the database and migrate it):': '在能够运行测试之前，我们需要“初始化”测试数据库（创建数据库并迁移它）：',
        'On Linux and similiar OSes, you can use APP_ENV=test instead of\n--env=test:': '在 Linux 和类似的操作系统上，您可以使用 <code translate="no" class="notranslate">APP_ENV=test</code> 而不是 <code translate="no" class="notranslate">--env=test</code>：',
        'If you now run the tests, PHPUnit won\'t interact with your development database anymore. To only run the new tests, pass the path to their class path:': '如果您现在运行测试，PHPUnit 将不再与您的开发数据库交互。要仅运行新测试，请传递它们的类路径的路径：',
        'When a test fails, it might be useful to introspect the Response object. Access it via $client->getResponse() and echo it to see what it looks like.': '当测试失败时，检查 Response 对象可能会很有用。通过 <code translate="no" class="notranslate">$client-&gt;getResponse()</code> 访问它，并将其 <code translate="no" class="notranslate">echo</code> 出来以查看它的外观。',
        'Defining Fixtures': '定义 Fixtures',
        'To be able to test the comment list, the pagination, and the form submission, we need to populate the database with some data. And we want the data to be the same between test runs to make the tests pass. Fixtures are exactly what we need.': '为了能够测试评论列表、分页和表单提交，我们需要用一些数据填充数据库。我们希望在测试运行之间数据保持一致，以便通过测试。这正是我们需要的 Fixtures。',
        'Install the Doctrine Fixtures bundle:': '安装 Doctrine Fixtures 包：',
        'A new src/DataFixtures/ directory has been created during the installation with a sample class, ready to be customized. Add two conferences and one comment for now:': '在安装过程中，创建了一个新的 <code translate="no" class="notranslate">src/DataFixtures/</code> 目录，其中包含一个示例类，可供自定义。现在添加两个会议和一个评论：',
        'When we load the fixtures, all data is removed; including the admin user. To avoid that, let\'s add the admin user in the fixtures:': '当我们加载 fixtures 时，所有数据都会被删除，包括管理员用户。为了避免这种情况，让我们在 fixtures 中添加管理员用户：',
        'If you don\'t remember which service you need to use for a given task, use the debug:autowiring with some keyword:': '如果您不记得需要使用哪个服务来完成某项任务，请使用带有一些关键字的 <code translate="no" class="notranslate">debug:autowiring</code>：',
        'Loading Fixtures': '加载 Fixtures',
        'Load the fixtures for the test environment/database:': '为 <code translate="no" class="notranslate">test</code> 环境/数据库加载 fixtures：',
        'Crawling a Website in Functional Tests': '在功能测试中抓取网站',
        'As we have seen, the HTTP client used in the tests simulates a browser, so we can navigate through the website as if we were using a headless browser.': '正如我们所见，测试中使用的 HTTP 客户端模拟了一个浏览器，因此我们可以像在使用无头浏览器一样浏览网站。',
        'Add a new test that clicks on a conference page from the homepage:': '添加一个新测试，从主页点击一个会议页面：',
        'Let\'s describe what happens in this test in plain English:': '让我们用简单的英语描述这个测试中的情况：',
        'Like the first test, we go to the homepage;': '和第一个测试一样，我们去主页；',
        'The request() method returns a Crawler instance that helps find elements on the page (like links, forms, or anything you can reach with CSS selectors or XPath);': '<code translate="no" class="notranslate">request()</code> 方法返回一个 <code translate="no" class="notranslate">Crawler</code> 实例，该实例有助于在页面上查找元素（如链接、表单或您可以使用 CSS 选择器或 XPath 访问的任何内容）；',
        'Thanks to a CSS selector, we assert that we have two conferences listed on the homepage;': '通过 CSS 选择器，我们断言主页上列出了两个会议；',
        'We then click on the "View" link (as it cannot click on more than one link at a time, Symfony automatically chooses the first one it finds);': '然后我们点击“查看”链接（因为它不能同时点击多个链接，Symfony 会自动选择它找到的第一个链接）；',
        'We assert the page title, the response, and the page <h2> to be sure we are on the right page (we could also have checked for the route that matches);': '我们断言页面标题、响应和页面 <code translate="no" class="notranslate">&lt;h2&gt;</code> 以确保我们位于正确的页面上（我们也可以检查匹配的路由）；',
        'Finally, we assert that there is 1 comment on the page. div:contains() is not a valid CSS selector, but Symfony has some nice additions, borrowed from jQuery.': '最后，我们断言页面上有 1 条评论。<code translate="no" class="notranslate">div:contains()</code> 不是一个有效的 CSS 选择器，但 Symfony 从 jQuery 借鉴了一些不错的补充。',
        'Instead of clicking on text (i.e. View), we could have selected the link via a CSS selector as well:': '除了点击文本（即“查看”）外，我们还可以通过 CSS 选择器来选择链接：',
        'Check that the new test is green:': '检查新测试是否通过：',
        'Submitting a Form in a Functional Test': '在功能测试中提交表单',
        'Do you want to get to the next level? Try adding a new comment with a photo on a conference from a test by simulating a form submission. That seems ambitious, doesn\'t it? Look at the needed code: not more complex than what we already wrote:': '你想更上一层楼吗？尝试通过模拟表单提交来在测试中为会议添加带有照片的新评论。这听起来很有挑战性，不是吗？看看所需的代码：不比我们已经编写的更复杂：',
        'To submit a form via submitForm(), find the input names thanks to the browser DevTools or via the Symfony Profiler Form panel. Note the clever re-use of the under construction image!': '要通过 <code translate="no" class="notranslate">submitForm()</code> 提交表单，请借助浏览器 DevTools 或通过 Symfony Profiler 表单面板找到输入名称。请注意，巧妙地重用了正在构建的图像！',
        'Run the tests again to check that everything is green:': '再次运行测试以检查是否一切正常：',
        'If you want to check the result in a browser, stop the Web server and re-run it for the test environment:': '如果你想在浏览器中检查结果，请停止 Web 服务器，然后以 <code translate="no" class="notranslate">test</code> 环境重新运行它：',
        'Reloading the Fixtures': '重新加载 Fixtures',
        'If you run the tests a second time, they should fail. As there are now more comments in the database, the assertion that checks the number of comments is broken. We need to reset the state of the database between each run by reloading the fixtures before each run:': '如果您第二次运行测试，它们应该会失败。由于数据库中现在有更多评论，因此检查评论数量的断言会失败。我们需要在每次运行之前通过重新加载 fixtures 来重置数据库的状态：',
        'Automating your Workflow with a Makefile': '使用 Makefile 自动化您的工作流程',
        'Having to remember a sequence of commands to run the tests is annoying. This should at least be documented. But documentation should be a last resort. Instead, what about automating day to day activities? That would serve as documentation, help discovery by other developers, and make developer lives easier and fast.': '记住一系列运行测试的命令很麻烦。这至少应该被记录下来。但文档应该是最后的手段。那么，日常活动自动化怎么样？这将作为文档，帮助其他开发人员发现，并使开发人员的生活更加轻松和快速。',
        'Using a Makefile is one way to automate commands:': '使用 <code translate="no" class="notranslate">Makefile</code> 是自动化命令的一种方式：',
        'In a Makefile rule, indentation must consist of a single tab character instead of spaces.': '在 Makefile 规则中，缩进<strong>必须</strong>由一个制表符字符组成，而不是空格。',
        'Note the -n flag on the Doctrine command; it is a global flag on Symfony commands that makes them non interactive.': '请注意 Doctrine 命令上的 <code translate="no" class="notranslate">-n</code> 标志；它是 Symfony 命令上的全局标志，使其变为非交互式。',
        'Whenever you want to run the tests, use make tests:': '每当您想运行测试时，请使用 <code translate="no" class="notranslate">make tests</code>：',
        'Resetting the Database after each Test': '每次测试后重置数据库',
        'Resetting the database after each test run is nice, but having truly independent tests is even better. We don\'t want one test to rely on the results of the previous ones. Changing the order of the tests should not change the outcome. As we\'re going to figure out now, this is not the case for the moment.': '每次测试运行后重置数据库很好，但拥有真正独立的测试甚至更好。我们不希望一个测试依赖于前一个测试的结果。更改测试的顺序不应改变结果。正如我们现在要弄清楚的那样，目前情况并非如此。',
        'Move the testConferencePage test after the testCommentSubmission one:': '将 <code translate="no" class="notranslate">testConferencePage</code> 测试移动到 <code translate="no" class="notranslate">testCommentSubmission</code> 测试之后：',
        'Tests now fail.': '现在测试失败了。',
        'To reset the database between tests, install DoctrineTestBundle:': '为了在测试之间重置数据库，请安装 DoctrineTestBundle：',
        'You will need to confirm the execution of the recipe (as it is not an "officially" supported bundle):': '您将需要确认执行该配方（因为它不是一个“官方”支持的包）：',
        'And done. Any changes done in tests are now automatically rolled-back at the end of each test.': '完成。现在在每个测试的末尾都会自动回滚测试中所做的任何更改。',
        'Tests should be green again:': '测试应该再次通过：',
        'Using a real Browser for Functional Tests': '在功能测试中使用真实浏览器',
        'Functional tests use a special browser that calls the Symfony layer directly. But you can also use a real browser and the real HTTP layer thanks to Symfony Panther:': '功能测试使用一个特殊的浏览器，该浏览器直接调用 Symfony 层。但您也可以使用真实的浏览器和真实的 HTTP 层，这要归功于 Symfony Panther：',
        'You can then write tests that use a real Google Chrome browser with the following changes:': '然后，您可以编写使用真实 Google Chrome 浏览器的测试，并进行以下更改：',
        'The SYMFONY_PROJECT_DEFAULT_ROUTE_URL environment variable contains the URL of the local web server.': '<code translate="no" class="notranslate">SYMFONY_PROJECT_DEFAULT_ROUTE_URL</code> 环境变量包含本地 Web 服务器的 URL。',
        'Choosing the Right Test Type': '选择合适的测试类型',
        'We have created three different types of tests so far. While we have only used the maker bundle to generate the unit test class, we could have used it to generate the other test classes as well:': '到目前为止，我们已经创建了三种不同类型的测试。虽然我们只使用了 maker bundle 来生成单元测试类，但我们也可以使用它来生成其它测试类：',
        'The maker bundle supports generating the following types of tests depending on how you want to test your application:': 'maker bundle 支持根据您希望如何测试应用程序来生成以下类型的测试：',
        'TestCase: Basic PHPUnit tests;': '<code translate="no" class="notranslate">TestCase</code>：基本的 PHPUnit 测试；',
        'KernelTestCase: Basic tests that have access to Symfony services;': '<code translate="no" class="notranslate">KernelTestCase</code>：可以访问 Symfony 服务的基本测试；',
        'WebTestCase: To run browser-like scenarios, but that don\'t execute JavaScript code;': '<code translate="no" class="notranslate">WebTestCase</code>：运行类似浏览器的场景，但不执行 JavaScript 代码；',
        'ApiTestCase: To run API-oriented scenarios;': '<code translate="no" class="notranslate">ApiTestCase</code>：运行面向 API 的场景；',
        'PantherTestCase: To run e2e scenarios, using a real-browser or HTTP client and a real web server.': '<code translate="no" class="notranslate">PantherTestCase</code>：使用真实浏览器或 HTTP 客户端和真实 Web 服务器运行端到端场景。',
        'Running Black Box Functional Tests with Blackfire': '使用 Blackfire 运行黑盒功能测试',
        'Another way to run functional tests is to use the Blackfire player. In addition to what you can do with functional tests, it can also perform performance tests.': '运行功能测试的另一种方法是使用 <a href="https://blackfire.io/player" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire player</a>。除了您可以对功能测试执行的操作之外，它还可以执行性能测试。',
        'Read the Performance step to learn more.': '阅读<a href="29-performance.html" class="reference internal">性能</a>步骤以了解更多信息。',
        'Going Further': '深入探索',
        'List of assertions defined by Symfony for functional tests;': '<a href="https://symfony.com/doc/6.4/testing/functional_tests_assertions.html" class="reference external">Symfony 为功能测试定义的断言列表</a>；',
        'PHPUnit docs;': '<a href="https://phpunit.de/documentation.html" class="reference external" rel="external noopener noreferrer" target="_blank">PHPUnit 文档</a>',
        'The Faker library to generate realistic fixtures data;': '<a href="https://github.com/FakerPHP/Faker" class="reference external" rel="external noopener noreferrer" target="_blank">Faker 库</a>以生成逼真的 fixtures 数据；',
        'The CssSelector component docs;': '<a href="https://symfony.com/doc/current/6.4/css_selector.html" class="reference external">CssSelector 组件文档</a>；',
        'The Symfony Panther library for browser testing and web crawling in Symfony applications;': '<a href="https://github.com/symfony/panther" class="reference external" rel="external noopener noreferrer" target="_blank">Symfony Panther</a> 库，用于在 Symfony 应用程序中进行浏览器测试和网页抓取；',
        'The Make/Makefile docs.': '<a href="https://www.gnu.org/software/make/manual/make.html" class="reference external" rel="external noopener noreferrer" target="_blank">Make/Makefile 文档</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Preventing Spam with an API': '使用 API 防止垃圾邮件',
        'Going Async': '异步处理'
    };

    fanyi(translates, 2, true);
})($);
