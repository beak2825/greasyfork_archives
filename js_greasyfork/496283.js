// ==UserScript==
// @name         Symfony 翻译文档 controller.html
// @namespace    fireloong
// @version      0.1.3
// @description  翻译文档 controller.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/controller.html
// @match        https://symfony.com/doc/6.4/controller.html
// @match        https://symfony.com/doc/7.1/controller.html
// @match        https://symfony.com/doc/7.2/controller.html
// @match        https://symfony.com/doc/current/controller.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496283/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496283/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Controller\n        \n            ': '控制器',
        'A controller is a PHP function you create that reads information from the\nRequest object and creates and returns a Response object. The response could\nbe an HTML page, JSON, XML, a file download, a redirect, a 404 error or anything\nelse. The controller runs whatever arbitrary logic your application needs\nto render the content of a page.': '控制器是一个 PHP 函数，它从 <code translate="no" class="notranslate">Request</code> 对象中读取信息，创建并返回一个 <code translate="no" class="notranslate">Response</code> 对象。响应可以是 HTML 页面、JSON、XML、文件下载、重定向、404 错误或其它任何内容。控制器运行应用程序渲染页面内容所需的任意逻辑。',
        "If you haven't already created your first working page, check out\nCreate your First Page in Symfony and then come back!": '如果你还没有创建你的第一个工作页面，看看<a href="page_creation.html" class="reference internal">在 Symfony 中创建你的第一个页面</a>，然后回来!',

        'A Basic Controller': '一个基本控制器',
        'While a controller can be any PHP callable (function, method on an object,\nor a Closure), a controller is usually a method inside a controller\nclass:': '虽然控制器可以是任何 PHP 可调用对象(函数、对象方法或闭包)，但控制器通常是控制器类中的方法：',
        'The controller is the number() method, which lives inside the\ncontroller class LuckyController.': '控制器是 <code translate="no" class="notranslate">number()</code> 方法，它位于控制器类 <code translate="no" class="notranslate">LuckyController</code> 中。',
        'This controller is pretty straightforward:': '这个控制器非常简单：',
        "line 2: Symfony takes advantage of PHP's namespace functionality to\nnamespace the entire controller class.": '<em>第2行</em>：Symfony 利用 PHP 的命名空间功能来命名整个控制器类。',
        "line 4: Symfony again takes advantage of PHP's namespace functionality:\nthe use keyword imports the Response class, which the controller\nmust return.": '<em>第4行</em>：Symfony 再次利用了 PHP 的命名空间功能：<code translate="no" class="notranslate">use</code> 关键字导入了控制器必须返回的 <code translate="no" class="notranslate">Response</code> 类。',
        "line 7: The class can technically be called anything, but it's suffixed\nwith Controller by convention.": '<em>第7行</em>：从技术上讲，这个类可以被称为任何名称，但按照约定，它的后缀是 <code translate="no" class="notranslate">Controller</code>。',
        'line 10: The action method is allowed to have a $max argument thanks to the\n{max} wildcard in the route.': '<em>第10行</em>：由于路由中的 <code translate="no" class="notranslate">{max}</code> 通配符，action 方法可以有一个 <code translate="no" class="notranslate">$max</code> 参数。',
        'line 14: The controller creates and returns a Response object.': '<em>第14行</em>：控制器创建并返回一个 <code translate="no" class="notranslate">Response</code> 对象。',

        'Mapping a URL to a Controller': '将 URL 映射到控制器',
        "In order to view the result of this controller, you need to map a URL to it via\na route. This was done above with the #[Route('/lucky/number/{max}')]\nroute attribute.": '为了查看该控制器的结果，您需要通过路由将 URL 映射到它。这是通过上面的 <code translate="no" class="notranslate">#[Route(\'/lucky/number/{max}\')]</code> <a href="page_creation.html#attribute-routes" class="reference internal">路由注解</a>完成的。',
        'To see your page, go to this URL in your browser: http://localhost:8000/lucky/number/100': '要查看您的页面，请在浏览器中访问以下 URL：<a href="http://localhost:8000/lucky/number/100" class="reference external" rel="external noopener noreferrer" target="_blank">http://localhost:8000/lucky/number/100</a>',
        'For more information on routing, see Routing.': '有关路由的更多信息，请参见<a href="routing.html" class="reference internal">路由</a>。',


        'The Base Controller Class & Services': '基本控制器类和服务',
        'To aid development, Symfony comes with an optional base controller class called\nAbstractController.\nIt can be extended to gain access to helper methods.': '为了帮助开发，Symfony 附带了一个名为 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController" rel="external noopener noreferrer" target="_blank">AbstractController</a> 的可选基控制器类。可以对它进行扩展以获得对助手方法的访问。',
        'Add the use statement atop your controller class and then modify\nLuckyController to extend it:': '在你的控制器类上添加 <code translate="no" class="notranslate">use</code> 语句，然后修改 <code translate="no" class="notranslate">LuckyController</code> 来扩展它：',
        "That's it! You now have access to methods like $this->render()\nand many others that you'll learn about next.": '就是这样!现在，您可以访问诸如 <a href="controller.html#controller-rendering-templates" class="reference internal">$this-&gt;render()</a> 之类的方法以及下面将介绍的许多其它方法。',


        'Generating URLs': '生成 URL',
        'The generateUrl()\nmethod is just a helper method that generates the URL for a given route:': '<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php#:~:text=function%20generateUrl" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController::generateUrl()" rel="external noopener noreferrer" target="_blank">generateUrl()</a> 方法只是一个辅助方法，用于生成给定路由的 URL：',


        'Redirecting': '重定向',
        'If you want to redirect the user to another page, use the redirectToRoute()\nand redirect() methods:': '如果你想将用户重定向到另一个页面，使用 <code translate="no" class="notranslate">redirectToRoute()</code> 和 <code translate="no" class="notranslate">redirect()</code> 方法：',
        'The redirect() method does not check its destination in any way. If you\nredirect to a URL provided by end-users, your application may be open\nto the unvalidated redirects security vulnerability.': '<code translate="no" class="notranslate">redirect()</code> 方法不以任何方式检查其目的地。如果您重定向到最终用户提供的 URL，您的应用程序可能会受到<a href="https://cheatsheetseries.owasp.org/cheatsheets/Unvalidated_Redirects_and_Forwards_Cheat_Sheet.html" class="reference external" rel="external noopener noreferrer" target="_blank">未经验证的重定向安全漏洞</a>的影响。',


        'Rendering Templates': '渲染模板',
        "If you're serving HTML, you'll want to render a template. The render()\nmethod renders a template and puts that content into a Response\nobject for you:": '如果提供 HTML，则需要渲染模板。<code translate="no" class="notranslate">render()</code> 方法渲染一个模板，并把内容放到一个 <code translate="no" class="notranslate">Response</code> 对象中：',
        'Templating and Twig are explained more in the\nCreating and Using Templates article.': '在<a href="templates.html" class="reference internal">创建和使用模板</a>这篇文章中有更多关于模板和 Twig 的解释。',


        'Fetching Services': '获取服务',
        'Symfony comes packed with a lot of useful classes and functionalities, called services.\nThese are used for rendering templates, sending emails, querying the database and\nany other "work" you can think of.': 'Symfony 附带了许多有用的类和功能，称为<a href="service_container.html" class="reference internal">服务</a>。它们用于渲染模板、发送电子邮件、查询数据库和任何你能想到的“工作”。',
        'If you need a service in a controller, type-hint an argument with its class\n(or interface) name. Symfony will automatically pass you the service you need:': '如果你需要一个控制器中的服务，用它的类(或接口)名提示一个参数。Symfony 会自动传递你需要的服务：',
        'Awesome!': '太棒了！',
        'What other services can you type-hint? To see them, use the debug:autowiring console\ncommand:': '你还能输入提示哪些服务？要查看它们，请使用 <code translate="no" class="notranslate">debug:autowiring</code> console 命令：',
        'If you need control over the exact value of an argument, or require a parameter,\nyou can use the #[Autowire] attribute:': '如果你需要控制参数的确切值，或者需要一个形参，你可以使用 <code translate="no" class="notranslate">#[Autowire]</code> 注解：',
        'You can read more about this attribute in Defining Services Dependencies Automatically (Autowiring).': '您可以在<a href="service_container/autowiring.html#autowire-attribute" class="reference internal">自动定义服务依赖项(Autowiring)</a>中了解有关此注解的更多信息。',
        'The #[Autowire] attribute was introduced in Symfony 6.1.': '<code translate="no" class="notranslate">#[Autowire]</code> 注解是在 Symfony 6.1 中引入的。',
        'Like with all services, you can also use regular\nconstructor injection in your\ncontrollers.': '与所有服务一样，你也可以在控制器中使用常规的<a href="service_container.html#services-constructor-injection" class="reference internal">构造函数注入</a>。',
        'For more information about services, see the Service Container article.': '有关服务的更多信息，请参阅<a href="service_container.html" class="reference internal">服务容器</a>文章。',


        'Generating Controllers': '生成控制器',
        'To save time, you can install Symfony Maker and tell Symfony to generate a\nnew controller class:': '为了节省时间，你可以安装 <a href="https://symfony.com/doc/current/bundles/SymfonyMakerBundle/index.html" class="reference external">Symfony Maker</a> 并告诉 Symfony 生成一个新的控制器类：',
        'If you want to generate an entire CRUD from a Doctrine entity,\nuse:': '如果你想从一个 Doctrine <a href="doctrine.html" class="reference internal">实体</a>生成一个完整的 CRUD，使用：',


        'Managing Errors and 404 Pages': '管理错误和404页面',
        'When things are not found, you should return a 404 response. To do this, throw a\nspecial type of exception:': '当没有找到东西时，您应该返回 404 响应。要做到这一点，抛出一个特殊类型的异常：',
        'The createNotFoundException()\nmethod is just a shortcut to create a special\nNotFoundHttpException\nobject, which ultimately triggers a 404 HTTP response inside Symfony.': '<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php#:~:text=function%20createNotFoundException" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController::createNotFoundException()" rel="external noopener noreferrer" target="_blank">createNotFoundException()</a> 方法只是创建一个特殊的 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Exception/NotFoundHttpException.php" class="reference external" title="Symfony\Component\HttpKernel\Exception\NotFoundHttpException" rel="external noopener noreferrer" target="_blank">NotFoundHttpException</a> 对象的快捷方式，该对象最终会在Symfony内部触发404 HTTP响应。',
        'If you throw an exception that extends or is an instance of\nHttpException, Symfony will\nuse the appropriate HTTP status code. Otherwise, the response will have a 500\nHTTP status code:': '如果你抛出的异常扩展了 <code translate="no" class="notranslate">HttpException</a> 或者是 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Exception/HttpException.php" class="reference external" title="Symfony\Component\HttpKernel\Exception\HttpException" rel="external noopener noreferrer" target="_blank">HttpException</a> 的一个实例，Symfony 将使用适当的 HTTP 状态码。否则，响应将有一个500 HTTP 状态码：',
        'In every case, an error page is shown to the end user and a full debug\nerror page is shown to the developer (i.e. when you\'re in "Debug" mode - see\nConfiguring Symfony).': '在每种情况下，都会向最终用户显示一个错误页面，并向开发人员显示一个完整的调试错误页面(例如，当您处于“调试”模式时-请参阅<a href="configuration.html#page-creation-environments" class="reference internal">配置 Symfony</a>)。',
        "To customize the error page that's shown to the user, see the\nHow to Customize Error Pages article.": '若要自定义显示给用户的错误页面，请参阅<a href="controller/error_pages.html" class="reference internal">如何自定义错误页面</a>文章。',


        'The Request object as a Controller Argument': '请求对象作为控制器参数',
        "What if you need to read query parameters, grab a request header or get access\nto an uploaded file? That information is stored in Symfony's Request\nobject. To access it in your controller, add it as an argument and\ntype-hint it with the Request class:": '如果需要读取查询参数、获取请求头或访问上传的文件，该怎么办？该信息存储在 Symfony 的 <code translate="no" class="notranslate">Request</code> 对象中。要在控制器中访问它，将其作为参数添加，并<strong>在 Request 类中对其进行类型提示</strong>：',
        'Keep reading for more information about using the\nRequest object.': '请<a href="controller.html#request-object-info" class="reference internal">继续阅读</a>有关使用 Request 对象的更多信息。',


        'Automatic Mapping Of The Request': '请求的自动映射',
        "It is possible to automatically map request's payload and/or query parameters to\nyour controller's action arguments with attributes.": '可以将请求的有效负载和/或查询参数自动映射到带有属性的控制器的动作参数。',


        'Mapping Query Parameters Individually': '单个映射查询参数',
        "Let's say a user sends you a request with the following query string:\nhttps://example.com/dashboard?firstName=John&lastName=Smith&age=27.\nThanks to the MapQueryParameter\nattribute, arguments of your controller's action can be automatically fulfilled:": '假设一个用户用以下查询字符串向您发送一个请求：<code translate="no" class="notranslate">https://example.com/dashboard?firstName=John&amp;lastName=Smith&amp;age=27</code>。多亏了 <a href="https://github.com/symfony/symfony/blob/6.4/src/Symfony/Component/HttpKernel/Attribute/MapQueryParameter.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapQueryParameter" rel="external noopener noreferrer" target="_blank">MapQueryParameter</a> 注解，你的控制器动作的参数可以自动完成：',
        '#[MapQueryParameter] can take an optional argument called filter. You can use the\nValidate Filters constants defined in PHP:': '<code translate="no" class="notranslate">#[MapQueryParameter]</code> 可以接受一个可选参数 <code translate="no" class="notranslate">filter</code>。你可以使用 PHP 中定义的<a href="https://www.php.net/manual/zh/filter.filters.validate.php" class="reference external" rel="external noopener noreferrer" target="_blank">验证过滤器</a>常量：',
        'The MapQueryParameter attribute\nwas introduced in Symfony 6.3.': '<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Attribute/MapQueryParameter.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapQueryParameter" rel="external noopener noreferrer" target="_blank">MapQueryParameter</a> 注解是在 Symfony 6.3 中引入的。',


        'Mapping The Whole Query String': '映射整个查询字符串',
        "Another possibility is to map the entire query string into an object that will hold\navailable query parameters. Let's say you declare the following DTO with its\noptional validation constraints:": '另一种可能性是将整个查询字符串映射到一个对象，该对象将包含可用的查询参数。假设你声明了以下带有可选验证约束的 DTO：',
        'You can then use the MapQueryString\nattribute in your controller:': '然后你可以在你的控制器中使用 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Attribute/MapQueryString.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapQueryString" rel="external noopener noreferrer" target="_blank">MapQueryString</a> 注解：',
        'You can customize the validation groups used during the mapping and also the\nHTTP status to return if the validation fails:': '你可以自定义映射期间使用的验证组，也可以自定义验证失败时返回的 HTTP 状态：',
        'The default status code returned if the validation fails is 404.': '如果验证失败，返回的默认状态码是 404。',
        'If you need a valid DTO even when the request query string is empty, set a\ndefault value for your controller arguments:': '如果你需要一个有效的 DTO，即使请求查询字符串是空的，为你的控制器参数设置一个默认值：',
        'The MapQueryString attribute\nwas introduced in Symfony 6.3.': '<a href="https://github.com/symfony/symfony/blob/6.4/src/Symfony/Component/HttpKernel/Attribute/MapQueryString.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapQueryString" rel="external noopener noreferrer" target="_blank">MapQueryString</a> 注解是在 Symfony 6.3 中引入的。',
        'The validationFailedStatusCode parameter was introduced in Symfony 6.4.': '<code translate="no" class="notranslate">validationFailedStatusCode</code> 参数是在 Symfony 6.4 中引入的。',


        'Mapping Request Payload': '映射请求负载',
        "When creating an API and dealing with other HTTP methods than GET (like\nPOST or PUT), user's data are not stored in the query string\nbut directly in the request payload, like this:": '当创建 API 并处理 <code translate="no" class="notranslate">GET</code> 以外的其它 HTTP 方法(如 <code translate="no" class="notranslate">POST</code> 或 <code translate="no" class="notranslate">PUT</code>)时，用户的数据不存储在查询字符串中，而是直接存储在请求有效负载中，如下所示：',
        'In this case, it is also possible to directly map this payload to your DTO by\nusing the MapRequestPayload\nattribute:': '在这种情况下，也可以通过使用 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Attribute/MapRequestPayload.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapRequestPayload" rel="external noopener noreferrer" target="_blank">MapRequestPayload</a> 注解直接将此有效负载映射到 DTO：',
        'This attribute allows you to customize the serialization context as well\nas the class responsible of doing the mapping between the request and\nyour DTO:': '此注解允许您自定义序列化上下文以及负责在请求和 DTO 之间进行映射的类：',
        'You can also customize the validation groups used, the status code to return if\nthe validation fails as well as supported payload formats:': '你还可以自定义所使用的验证组、验证失败时返回的状态码以及支持的有效负载格式：',
        'The default status code returned if the validation fails is 422.': '如果验证失败，返回的默认状态码是 422。',
        'If you build a JSON API, make sure to declare your route as using the JSON\nformat. This will make the error handling\noutput a JSON response in case of validation errors, rather than an HTML page:': '如果你构建了一个 JSON API，请确保使用 JSON <a href="routing.html#routing-format-parameter" class="reference internal">格式</a>声明你的路由。这将使错误处理在出现验证错误时输出一个 JSON 响应，而不是一个 HTML 页面：',
        'Make sure to install phpstan/phpdoc-parser and phpdocumentor/type-resolver\nif you want to map a nested array of specific DTOs:': '如果你想映射特定 DTO 的嵌套数组，请确保安装 <a href="https://packagist.org/packages/phpstan/phpdoc-parser" class="reference external" rel="external noopener noreferrer" target="_blank">phpstan/phpdoc-parser</a> 和 <a href="https://packagist.org/packages/phpdocumentor/type-resolver" class="reference external" rel="external noopener noreferrer" target="_blank">phpdocumentor/type-resolver</a>：',
        'The MapRequestPayload attribute\nwas introduced in Symfony 6.3.': '<a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpKernel/Attribute/MapRequestPayload.php" class="reference external" title="Symfony\Component\HttpKernel\Attribute\MapRequestPayload" rel="external noopener noreferrer" target="_blank">MapRequestPayload</a> 注解是在Symfony 6.3中引入的。',


        'Managing the Session': '管理 Session',
        'You can store special messages, called "flash" messages, on the user\'s session.\nBy design, flash messages are meant to be used exactly once: they vanish from\nthe session automatically as soon as you retrieve them. This feature makes\n"flash" messages particularly great for storing user notifications.': '您可以在用户会话中存储称为“flash”消息的特殊消息。根据设计，flash 消息只会被使用一次：一旦您检索到它们，它们就会自动从会话中消失。这个特性使得“flash”消息特别适合存储用户通知。',
        "For example, imagine you're processing a form submission:": '例如，假设您正在处理<a href="forms.html" class="reference internal">表单</a>提交：',
        'Reading for more information about using Sessions.': '<a href="session.html#session-intro" class="reference internal">阅读</a>有关使用会话的更多信息。',


        'The Request and Response Object': '请求和响应对象',
        'As mentioned earlier, Symfony will\npass the Request object to any controller argument that is type-hinted with\nthe Request class:': '<a href="controller.html#controller-request-argument" class="reference internal">如前</a>所述，Symfony 将把 <code translate="no" class="notranslate">Request</code> 对象传递给 <code translate="no" class="notranslate">Request</code> 类类型提示的任何控制器参数：',
        'The Request class has several public properties and methods that return any\ninformation you need about the request.': '<code translate="no" class="notranslate">Request</code> 类有几个公共属性和方法，它们返回您需要的有关请求的任何信息。',
        'Like the Request, the Response object has a public headers property.\nThis object is of the type ResponseHeaderBag\nand provides methods for getting and setting response headers. The header names are\nnormalized. As a result, the name Content-Type is equivalent to\nthe name content-type or content_type.': '与 <code translate="no" class="notranslate">Request</code> 一样，<code translate="no" class="notranslate">Response</code> 对象也有一个公共 <code translate="no" class="notranslate">headers</code> 属性。该对象的类型是 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpFoundation/ResponseHeaderBag.php" class="reference external" title="Symfony\Component\HttpFoundation\ResponseHeaderBag" rel="external noopener noreferrer" target="_blank">ResponseHeaderBag</a>，它提供了获取和设置响应头的方法。标头名称是规范化的。因此，名称 <code translate="no" class="notranslate">Content-Type</code> 相当于名称 <code translate="no" class="notranslate">content-type</code> 或 <code translate="no" class="notranslate">content_type</code>。',
        'In Symfony, a controller is required to return a Response object:': '在 Symfony 中，控制器需要返回一个 <code translate="no" class="notranslate">Response</code> 对象：',
        'To facilitate this, different response objects are included to address different\nresponse types.  Some of these are mentioned below. To learn more about the\nRequest and Response (and different Response classes), see the\nHttpFoundation component documentation.': '为了实现这一点，包含了不同的响应对象来处理不同的响应类型。下面提到了其中的一些。要了解有关 <code translate="no" class="notranslate">Request</code> 和 <code translate="no" class="notranslate">Response</code> (以及不同的 <code translate="no" class="notranslate">Response</code> 类)的更多信息，请参阅 <a href="components/http_foundation.html#component-http-foundation-request" class="reference internal">HttpFoundation 组件文档</a>。',


        'Accessing Configuration Values': '访问配置值',
        'To get the value of any configuration parameter\nfrom a controller, use the getParameter() helper method:': '要从控制器获取任何<a href="configuration.html#configuration-parameters" class="reference internal">配置参数</a>的值，使用 <code translate="no" class="notranslate">getParameter()</code> 辅助方法：',


        'Returning JSON Response': '返回 JSON 响应',
        'To return JSON from a controller, use the json() helper method. This returns a\nJsonResponse object that encodes the data automatically:': '要从控制器返回 JSON，请使用 <code translate="no" class="notranslate">json()</code> 辅助方法。这将返回一个自动编码数据的 <code translate="no" class="notranslate">JsonResponse</code> 对象：',
        'If the serializer service is enabled in your\napplication, it will be used to serialize the data to JSON. Otherwise,\nthe json_encode function is used.': '如果在应用程序中启用了<a href="serializer.html" class="reference internal">序列化器服务</a>，它将用于将数据序列化为 JSON。否则，使用 <a href="https://secure.php.net/manual/zh/function.json-encode.php" class="reference external" title="json_encode" rel="external noopener noreferrer" target="_blank">json_encode</a> 函数。',


        'Streaming File Responses': '流式文件响应',
        'You can use the file()\nhelper to serve a file from inside a controller:': '你可以使用 <a href="https://github.com/symfony/symfony/blob/6.4/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php#:~:text=function%20file" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController::file()" rel="external noopener noreferrer" target="_blank">file()</a> 辅助从控制器内部为文件提供服务：',
        'The file() helper provides some arguments to configure its behavior:': '<code translate="no" class="notranslate">file()</code> 辅助提供了一些参数来配置它的行为：',


        'Sending Early Hints': '发送早期提示',
        'The Early Hints helper of the AbstractController was introduced\nin Symfony 6.3.': '<code translate="no" class="notranslate">AbstractController</code> 的早期提示辅助是在 Symfony 6.3 中引入的。',
        'Early hints tell the browser to start downloading some assets even before the\napplication sends the response content. This improves perceived performance\nbecause the browser can prefetch resources that will be needed once the full\nresponse is finally sent. These resources are commonly Javascript or CSS files,\nbut they can be any type of resource.': '<a href="https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/103" class="reference external" rel="external noopener noreferrer" target="_blank">早期提示</a>告诉浏览器在应用程序发送响应内容之前就开始下载一些资源。这提高了感知性能，因为浏览器可以预取完整响应最终发送后所需的资源。这些资源通常是 Javascript 或 CSS 文件，但也可以是任何类型的资源。',
        "In order to work, the SAPI you're using must support this feature, like\nFrankenPHP.": '为了工作，您使用的 <a href="https://www.php.net/manual/zh/function.php-sapi-name.php" class="reference external" rel="external noopener noreferrer" target="_blank">SAPI</a> 必须支持这个特性，比如 <a href="https://frankenphp.dev/cn/" class="reference external" rel="external noopener noreferrer" target="_blank">FrankenPHP</a>。',
        'You can send early hints from your controller action thanks to the\nsendEarlyHints()\nmethod:': '你可以通过 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php#:~:text=function%20sendEarlyHints" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController::sendEarlyHints()" rel="external noopener noreferrer" target="_blank">sendEarlyHints()</a> 方法从控制器动作发送早期提示：',
        'Technically, Early Hints are an informational HTTP response with the status code\n103. The sendEarlyHints() method creates a Response object with that\nstatus code and sends its headers immediately.': '从技术上讲，早期提示是一个状态码为 <code translate="no" class="notranslate">103</code> 的信息性 HTTP 响应。<code translate="no" class="notranslate">sendEarlyHints()</code> 方法用状态码创建一个 <code translate="no" class="notranslate">Response</code> 对象，并立即发送它的头。',
        'This way, browsers can start downloading the assets immediately; like the\nstyle.css and script.js files in the above example. The\nsendEarlyHints() method also returns the Response object, which you\nmust use to create the full response sent from the controller action.': '这样，浏览器可以立即开始下载资源；就像上面例子中的 <code translate="no" class="notranslate">style.css</code> 和 <code translate="no" class="notranslate">script.js</code> 文件一样。<code translate="no" class="notranslate">sendEarlyHints()</code> 方法还返回 <code translate="no" class="notranslate">Response</code> 对象，您必须使用该对象来创建从控制器动作发送的完整响应。',


        'Final Thoughts': '结束语',
        'In Symfony, a controller is usually a class method which is used to accept\nrequests, and return a Response object. When mapped with a URL, a controller\nbecomes accessible and its response can be viewed.': '在 Symfony 中，控制器通常是一个类方法，用于接受请求，并返回一个 <code translate="no" class="notranslate">Response</code> 对象。当用 URL 映射时，控制器变得可访问，并且可以查看其响应。',
        'To facilitate the development of controllers, Symfony provides an\nAbstractController.  It can be used to extend the controller class allowing\naccess to some frequently used utilities such as render() and\nredirectToRoute(). The AbstractController also provides the\ncreateNotFoundException() utility which is used to return a page not found\nresponse.': '为了方便控制器的开发，Symfony 提供了一个 <code translate="no" class="notranslate">AbstractController</code>。它可以用来扩展控制器类，允许访问一些常用的实用程序，如 <code translate="no" class="notranslate">render()</code> 和 <code translate="no" class="notranslate">redirectToRoute()</code>。<code translate="no" class="notranslate">AbstractController</code> 还提供 <code translate="no" class="notranslate">createNotFoundException()</code> 实用程序，用于返回未找到响应的页面。',
        "In other articles, you'll learn how to use specific services from inside your controller\nthat will help you persist and fetch objects from a database, process form submissions,\nhandle caching and more.": '在其它文章中，您将学习如何在控制器内部使用特定的服务，这些服务将帮助您从数据库中持久化和获取对象、处理表单提交、处理缓存等等。',


        'Keep Going!': '继续前进！',
        'Next, learn all about rendering templates with Twig.': '接下来，学习<a href="templates.html" class="reference internal">使用 Twig 渲染模板</a>的所有知识。',

        'Learn more about Controllers': '了解更多关于控制器的信息',
        'How to Customize Error Pages': '<a href="controller/error_pages.html" class="reference internal">如何自定义错误页面</a>',
        'How to Forward Requests to another Controller': '<a href="controller/forwarding.html">如何将请求转发到另一个控制器</a>',
        'How to Define Controllers as Services': '<a href="controller/service.html">如何将控制器定义为服务</a>',
        'How to Upload Files': '<a href="controller/upload_file.html">如何上传文件</a>',
        'Extending Action Argument Resolving': '<a href="controller/value_resolver.html">扩展动作参数解析</a>'
    };

    fanyi(translates, 1);
})($);
