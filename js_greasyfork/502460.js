// ==UserScript==
// @name         Book for Symfony 6 翻译 21-cache.html
// @namespace    fireloong
// @version      0.1.0
// @description  缓存以提高性能 21-cache.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/21-cache.html
// @match        https://symfony.com/doc/current/the-fast-track/en/21-cache.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/502460/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2021-cachehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/502460/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2021-cachehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Caching for Performance\n        \n            ': '缓存以提高性能',
        'Performance problems might come with popularity. Some typical examples: missing database indexes or tons of SQL requests per page. You won\'t have any problems with an empty database, but with more traffic and growing data, it might arise at some point.': '随着流行度的增加，可能会出现性能问题。一些典型的例子包括：缺少数据库索引或每页有大量的 SQL 请求。在空数据库时，你不会遇到任何问题，但随着流量的增加和数据的增长，它可能会在某个时刻出现。',
        'Adding HTTP Cache Headers': '添加 HTTP 缓存头',
        'Using HTTP caching strategies is a great way to maximize the performance for end users with little effort. Add a reverse proxy cache in production to enable caching, and use a CDN to cache on the edge for even better performance.': '使用 HTTP 缓存策略是最大化终端用户性能的一个很好的方法，而且不需要付出太多努力。在生产环境中添加一个反向代理缓存以启用缓存，并使用 CDN 在边缘进行缓存以获得更好的性能。',
        'Let\'s cache the homepage for an hour:': '让我们将主页缓存一个小时：',
        'The setSharedMaxAge() method configures the cache expiration for reverse proxies. Use setMaxAge() to control the browser cache. Time is expressed in seconds (1 hour = 60 minutes = 3600 seconds).': '<code translate="no" class="notranslate">setSharedMaxAge()</code> 方法配置反向代理的缓存过期时间。使用 <code translate="no" class="notranslate">setMaxAge()</code> 来控制浏览器缓存。时间以秒为单位（1小时=60分钟=3600秒）。',
        'Caching the conference page is more challenging as it is more dynamic. Anyone can add a comment anytime, and nobody wants to wait for an hour to see it online. In such cases, use the HTTP validation strategy.': '缓存会议页面更具挑战性，因为它更具动态性。任何人都可以随时添加评论，而没有人愿意等一个小时才能在网上看到它。在这种情况下，使用 HTTP 验证策略。',
        'Activating the Symfony HTTP Cache Kernel': '激活 Symfony HTTP 缓存内核',
        'To test the HTTP cache strategy, enable the Symfony HTTP reverse proxy, but only in the "development" environment (for the "production" environment, we will use a "more robust" solution):': '为了测试 HTTP 缓存策略，请启用 Symfony HTTP 反向代理，但仅在“开发”环境中（对于“生产”环境，我们将使用“更健壮”的解决方案）：',
        'Besides being a full-fledged HTTP reverse proxy, the Symfony HTTP reverse proxy (via the HttpCache class) adds some nice debug info as HTTP headers. That helps greatly in validating the cache headers we have set.': '除了作为一个功能齐全的 HTTP 反向代理之外，Symfony HTTP 反向代理（通过 <code translate="no" class="notranslate">HttpCache</code> 类）还作为 HTTP 头添加了一些很好的调试信息。这极大地有助于验证我们设置的缓存头。',
        'Check it on the homepage:': '在主页上检查它：',
        'For the very first request, the cache server tells you that it was a miss and that it performed a store to cache the response. Check the cache-control header to see the configured cache strategy.': '对于第一个请求，缓存服务器会告诉您它 <code translate="no" class="notranslate">miss</code>，并且它执行了一个 <code translate="no" class="notranslate">store</code> 来缓存响应。检查 <code translate="no" class="notranslate">cache-control</code> 头以查看配置的缓存策略。',
        'For subsequent requests, the response is cached (the age has also been updated):': '对于后续请求，响应被缓存（<code translate="no" class="notranslate">age</code> 也已更新）：',
        'Avoiding SQL Requests with ESI': '使用 ESI 避免 SQL 请求',
        'The TwigEventSubscriber listener injects a global variable in Twig with all conference objects. It does so for every single page of the website. It is probably a great target for optimization.': '<code translate="no" class="notranslate">TwigEventSubscriber</code> 监听器在 Twig 中注入一个包含所有会议对象的全局变量。它对网站的每一页都这样做。这很可能是一个很好的优化目标。',
        'You won\'t add new conferences every day, so the code is querying the exact same data from the database over and over again.': '你不会每天都添加新的会议，所以代码会一次又一次地从数据库中查询完全相同的数据。',
        'We might want to cache the conference names and slugs with the Symfony Cache, but whenever possible I like to rely on the HTTP caching infrastructure.': '我们可能想使用 Symfony Cache 缓存会议名称和 slug，但每当我可能的时候，我都喜欢依赖 HTTP 缓存基础设施。',
        'When you want to cache a fragment of a page, move it outside of the current HTTP request by creating a sub-request. ESI is a perfect match for this use case. An ESI is a way to embed the result of an HTTP request into another.': '当您想要缓存页面的一个片段时，请通过创建子请求来将其移出当前的 HTTP 请求。ESI 非常适合这种用例。ESI 是一种将 HTTP 请求的结果嵌入到另一个 HTTP 请求中的方法。',
        'Create a controller that only returns the HTML fragment that displays the conferences:': '创建一个控制器，该控制器仅返回显示会议的 HTML 片段：',
        'Create the corresponding template:': '创建相应的模板：',
        'Hit /conference_header to check that everything works fine.': '访问 <code translate="no" class="notranslate">/conference_header</code> 以检查一切是否正常工作。',
        'Time to reveal the trick! Update the Twig layout to call the controller we have just created:': '是时候揭晓秘诀了！更新 Twig 布局以调用我们刚刚创建的控制器：',
        'And voilà. Refresh the page and the website is still displaying the same.': '就是这样。刷新页面，网站仍然显示相同的内容。',
        'Use the "Request / Response" Symfony profiler panel to learn more about the main request and its sub-requests.': '使用“请求/响应”Symfony 性能分析器面板以了解有关主请求及其子请求的更多信息。',
        'Now, every time you hit a page in the browser, two HTTP requests are executed, one for the header and one for the main page. You have made performance worse. Congratulations!': '现在，每次你在浏览器中访问一个页面时，都会执行两个 HTTP 请求，一个用于标题，一个用于主页。你的性能变得更差了。恭喜你！',
        'The conference header HTTP call is currently done internally by Symfony, so no HTTP round-trip is involved. This also means that there is no way to benefit from HTTP cache headers.': '目前，会议标题的 HTTP 调用是由 Symfony 在内部完成的，因此不涉及 HTTP 往返。这也意味着无法从 HTTP 缓存头中受益。',
        'Convert the call to a "real" HTTP one by using an ESI.': '通过使用 ESI 将调用转换为“真正”的 HTTP 调用。',
        'First, enable ESI support:': '首先，启用 ESI 支持：',
        'Then, use render_esi instead of render:': '然后，使用 <code translate="no" class="notranslate">render_esi</code> 代替 <code translate="no" class="notranslate">render</code>：',
        'If Symfony detects a reverse proxy that knows how to deal with ESIs, it enables support automatically (if not, it falls back to render the sub-request synchronously).': '如果 Symfony 检测到知道如何处理 ESI 的反向代理，它将自动启用支持（如果没有，它将回退到同步渲染子请求）。',
        'As the Symfony reverse proxy does support ESIs, let\'s check its logs (remove the cache first - see "Purging" below):': '由于 Symfony 反向代理支持 ESI，让我们检查其日志（首先清除缓存-请参阅下面的“清除”）：',
        'Refresh a few times: the / response is cached and the /conference_header one is not. We have achieved something great: having the whole page in the cache but still having one part dynamic.': '刷新几次：<code translate="no" class="notranslate">/</code> 响应被缓存，而 <code translate="no" class="notranslate">/conference_header</code> 没有被缓存。我们取得了一些伟大的成就：将整个页面缓存在缓存中，但仍然有一个动态部分。',
        'This is not what we want though. Cache the header page for an hour, independently of everything else:': '但这并不是我们想要的。将标题页面缓存一个小时，与其它内容无关：',
        'Cache is now enabled for both requests:': '现在两个请求都启用了缓存：',
        'The x-symfony-cache header contains two elements: the main / request and a sub-request (the conference_header ESI). Both are in the cache (fresh).': '<code translate="no" class="notranslate">x-symfony-cache</code> 头包含两个元素：主 <code translate="no" class="notranslate">/</code> 请求和一个子请求（<code translate="no" class="notranslate">conference_header</code> ESI）。两者都在缓存中（<code translate="no" class="notranslate">fresh</code>）。',
        'The cache strategy can be different from the main page and its ESIs. If we have an "about" page, we might want to store it for a week in the cache, and still have the header be updated every hour.': '缓存策略可以与主页及其 ESI 不同。如果我们有一个“关于”页面，我们可能希望将其在缓存中存储一周，并且仍然每小时更新一次标题。',
        'Remove the listener as we don\'t need it anymore:': '移除监听器，因为我们不再需要它了：',
        'Purging the HTTP Cache for Testing': '清除 HTTP 缓存以进行测试',
        'Testing the website in a browser or via automated tests becomes a little bit more difficult with a caching layer.': '使用缓存层在浏览器中或通过自动化测试测试网站会变得更加困难。',
        'You can manually remove all the HTTP cache by removing the var/cache/dev/http_cache/ directory:': '您可以通过删除 <code translate="no" class="notranslate">var/cache/dev/http_cache/</code> 目录来手动删除所有 HTTP 缓存：',
        'This strategy does not work well if you only want to invalidate some URLs or if you want to integrate cache invalidation in your functional tests. Let\'s add a small, admin only, HTTP endpoint to invalidate some URLs:': '如果您只想使某些 URL 失效，或者想在功能测试中集成缓存失效，那么这种策略就不太好用了。让我们添加一个小的、仅供管理员使用的 HTTP 端点来使某些 URL 失效：',
        'The new controller has been restricted to the PURGE HTTP method. This method is not in the HTTP standard, but it is widely used to invalidate caches.': '新控制器已限制为 <code translate="no" class="notranslate">PURGE</code> HTTP 方法。此方法不在 HTTP 标准中，但广泛用于使缓存失效。',
        'By default, route parameters cannot contain / as it separates URL segments. You can override this restriction for the last route parameter, like uri, by setting your own requirement pattern (.*).': '默认情况下，路由参数不能包含 <code translate="no" class="notranslate">/</code>，因为它分隔了 URL 段。您可以通过设置自己的要求模式（<code translate="no" class="notranslate">.*</code>）来覆盖最后一个路由参数（如 <code translate="no" class="notranslate">uri</code>）的此限制。',
        'The way we get the HttpCache instance can also look a bit strange; we are using an anonymous class as accessing the "real" one is not possible. The HttpCache instance wraps the real kernel, which is unaware of the cache layer as it should be.': '我们获取 <code translate="no" class="notranslate">HttpCache</code> 实例的方式也可能看起来有点奇怪；我们使用了一个匿名类，因为无法访问“真实”的 <code translate="no" class="notranslate">HttpCache</code> 实例。<code translate="no" class="notranslate">HttpCache</code> 实例包装了真实的内核，而真实的内核并不了解缓存层，这是它应该做的。',
        'Invalidate the homepage and the conference header via the following cURL calls:': '通过以下 cURL 调用使主页和会议标题失效：',
        'The symfony var:export SYMFONY_PROJECT_DEFAULT_ROUTE_URL sub-command returns the current URL of the local web server.': '<code translate="no" class="notranslate">symfony var:export SYMFONY_PROJECT_DEFAULT_ROUTE_URL</code> 子命令返回本地 Web 服务器的当前 URL。',
        'The controller does not have a route name as it will never be referenced in the code.': '控制器没有路由名称，因为代码中永远不会引用它。',
        'Grouping similar Routes with a Prefix': '使用前缀对类似路由进行分组',
        'The two routes in the admin controller have the same /admin prefix. Instead of repeating it on all routes, refactor the routes to configure the prefix on the class itself:': '管理员控制器中的两个路由具有相同的 <code translate="no" class="notranslate">/admin</code> 前缀。而不是在所有路由上重复它，请重构路由以在类本身上配置前缀：',
        'Caching CPU/Memory Intensive Operations': '缓存 CPU/内存密集型操作',
        'We don\'t have CPU or memory-intensive algorithms on the website. To talk about local caches, let\'s create a command that displays the current step we are working on (to be more precise, the Git tag name attached to the current Git commit).': '网站上没有 CPU 或内存密集型的算法。为了讨论本地缓存，让我们创建一个命令来显示我们当前正在工作的步骤（更具体地说，是附加到当前 Git 提交的 Git 标签名称）。',
        'The Symfony Process component allows you to run a command and get the result back (standard and error output).': 'Symfony Process 组件允许您运行命令并获取结果（标准和错误输出）。',
        'Implement the command:': '实现命令：',
        'You could have used make:command to create the command:': '您可以使用 <code translate="no" class="notranslate">make:command</code> 来创建命令：',
        'What if we want to cache the output for a few minutes? Use the Symfony Cache.': '如果我们想将输出缓存几分钟怎么办？使用 Symfony Cache。',
        'And wrap the code with the cache logic:': '并用缓存逻辑包装代码：',
        'The process is now only called if the app.current_step item is not in the cache.': '现在，只有当 <code translate="no" class="notranslate">app.current_step</code> 项不在缓存中时，才会调用该进程。',
        'Profiling and Comparing Performance': '分析并比较性能',
        'Never add cache blindly. Keep in mind that adding some cache adds a layer of complexity. And as we are all very bad at guessing what will be fast and what is slow, you might end up in a situation where the cache makes your application slower.': '切勿盲目添加缓存。请记住，添加一些缓存会增加复杂性。由于我们都非常擅长猜测什么会快，什么会慢，因此您可能会遇到缓存使您的应用程序变慢的情况。',
        'Always measure the impact of adding a cache with a profiler tool like Blackfire.': '始终使用 <a href="https://blackfire.io/" class="reference external" rel="external noopener noreferrer" target="_blank">Blackfire</a> 等分析工具测量添加缓存的影响。',
        'Refer to the step about "Performance" to learn more about how you can use Blackfire to test your code before deploying.': '请参阅有关“性能”的步骤，以了解有关如何使用 Blackfire 在部署之前测试代码的更多信息。',
        'Configuring a Reverse Proxy Cache on Production': '在生产环境中配置反向代理缓存',
        'Instead of using the Symfony reverse proxy in production, we are going to use the "more robust" Varnish reverse proxy.': '我们不会在生产环境中使用 Symfony 反向代理，而是会使用更健壮的 Varnish 反向代理。',
        'Add Varnish to the Platform.sh services:': '将 Varnish 添加到 Platform.sh 服务中：',
        'Use Varnish as the main entry point in the routes:': '在路由中使用 Varnish 作为主入口点：',
        'Finally, create a config.vcl file to configure Varnish:': '最后，创建一个 <code translate="no" class="notranslate">config.vcl</code> 文件来配置 Varnish：',
        'Enabling ESI Support on Varnish': '在 Varnish 上启用 ESI 支持',
        'ESI support on Varnish should be enabled explicitly for each request. To make it universal, Symfony uses the standard Surrogate-Capability and Surrogate-Control headers to negotiate ESI support:': 'Varnish 上的 ESI 支持应针对每个请求明确启用。为了使其通用，Symfony 使用标准的 <code translate="no" class="notranslate">Surrogate-Capability</code> 和 <code translate="no" class="notranslate">Surrogate-Control</code> 头来协商 ESI 支持：',
        'Purging the Varnish Cache': '清除 Varnish 缓存',
        'Invalidating the cache in production should probably never be needed, except for emergency purposes and maybe on non-master branches. If you need to purge the cache often, it probably means that the caching strategy should be tweaked (by lowering the TTL or by using a validation strategy instead of an expiration one).': '在生产环境中，除非出于紧急目的或在非 <code translate="no" class="notranslate">master</code> 分支上，否则可能永远不需要使缓存失效。如果您经常需要清除缓存，那么可能意味着需要调整缓存策略（通过降低 TTL 或使用验证策略而不是过期策略）。',
        'Anyway, let\'s see how to configure Varnish for cache invalidation:': '无论如何，让我们看看如何为缓存失效配置 Varnish：',
        'In real life, you would probably restrict by IPs instead like described in the Varnish docs.': '在现实生活中，您可能会像 <a href="https://varnish-cache.org/docs/trunk/users-guide/purging.html" class="reference external" rel="external noopener noreferrer" target="_blank">Varnish 文档</a>中描述的那样通过 IP 进行限制。',
        'Purge some URLs now:': '现在清除一些 URL：',
        'The URLs looks a bit strange because the URLs returned by env:url already ends with /.': 'URL 看起来有点奇怪，因为 <code translate="no" class="notranslate">env:url</code> 返回的 URL 已经以 <code translate="no" class="notranslate">/</code> 结尾。',
        'Going Further': '深入探索',
        'Cloudflare, the global cloud platform;': '<a href="https://www.cloudflare.com" class="reference external" rel="external noopener noreferrer" target="_blank">Cloudflare</a>，全球云平台；',
        'Varnish HTTP Cache docs;': '<a href="https://varnish-cache.org/docs/index.html" class="reference external" rel="external noopener noreferrer" target="_blank">Varnish HTTP 缓存文档</a>；',
        'ESI specification and ESI developer resources;': '<a href="https://www.w3.org/TR/esi-lang" class="reference external" rel="external noopener noreferrer" target="_blank">ESI 规范</a>和 <a href="https://www.akamai.com/us/en/support/esi.jsp" class="reference external" rel="external noopener noreferrer" target="_blank">ESI 开发人员资源</a>；',
        'HTTP cache validation model;': '<a href="https://symfony.com/doc/6.4/http_cache/validation.html" class="reference external">HTTP 缓存验证模型</a>；',
        'HTTP Cache in Platform.sh.': '<a href="https://symfony.com/doc/current/cloud/cookbooks/cache.html" class="reference external">Platform.sh 中的 HTTP 缓存</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Emailing Admins': '向管理员发送电子邮件',
        'Styling the User Interface with Webpack': '使用 Webpack 样式化用户界面'
    };

    fanyi(translates, 2);
})($);
