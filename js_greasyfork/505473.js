// ==UserScript==
// @name         Symfony 翻译文档 configuration/multiple_kernels.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 configuration/multiple_kernels.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/configuration/multiple_kernels.html
// @match        https://symfony.com/doc/6.4/configuration/multiple_kernels.html
// @match        https://symfony.com/doc/7.1/configuration/multiple_kernels.html
// @match        https://symfony.com/doc/7.2/configuration/multiple_kernels.html
// @match        https://symfony.com/doc/current/configuration/multiple_kernels.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505473/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationmultiple_kernelshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/505473/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationmultiple_kernelshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Create Multiple Symfony Applications with a Single Kernel\n        \n            ': '如何使用单一内核创建多个 Symfony 应用',
        'In Symfony applications, incoming requests are usually processed by the front\ncontroller at public/index.php, which instantiates the src/Kernel.php\nclass to create the application kernel. This kernel loads the bundles, the\nconfiguration, and handles the request to generate the response.': '在Symfony应用中，接收到的请求通常由位于 <code translate="no" class="notranslate">public/index.php</code> 的前端控制器处理，该控制器实例化 <code translate="no" class="notranslate">src/Kernel.php</code> 类来创建应用内核。这个内核加载组件、配置，并处理请求以生成响应。',
        'The current implementation of the Kernel class serves as a convenient default\nfor a single application. However, it can also manage multiple applications.\nWhile the Kernel typically runs the same application with different\nconfigurations based on various environments,\nit can be adapted to run different applications with specific bundles and configuration.': '当前的 Kernel 类实现作为单个应用的默认选项非常便捷。然而，它也可以管理多个应用。虽然 Kernel 通常根据不同的<a href="../configuration.html#configuration-environments" class="reference internal">环境</a>运行同一个应用但配置不同，但它可以被调整为运行不同的应用，每个应用具有特定的组件和配置。',
        'These are some of the common use cases for creating multiple applications with a\nsingle Kernel:': '以下是使用单一内核创建多个应用的一些常见应用场景：',
        'An application that defines an API can be divided into two segments to improve\nperformance. The first segment serves the regular web application, while the\nsecond segment exclusively responds to API requests. This approach requires\nloading fewer bundles and enabling fewer features for the second part, thus\noptimizing performance;': '一个定义了 API 的应用可以通过划分为两个部分来提升性能。第一部分服务于常规的 Web 应用，而第二部分则专门处理 API 请求。这种方法要求第二部分加载较少的组件并启用较少的功能，从而优化性能；',
        'A highly sensitive application could be divided into two parts for enhanced\nsecurity. The first part would only load routes corresponding to the publicly\nexposed sections of the application. The second part would load the remainder\nof the application, with its access safeguarded by the web server;': '一个高度敏感的应用可以通过划分为两部分来增强安全性。第一部分仅加载与应用公开部分相对应的路由。第二部分则加载应用的其余部分，这部分的访问受到 Web 服务器的安全保护；',
        'A monolithic application could be gradually transformed into a more\ndistributed architecture, such as micro-services. This approach allows for a\nseamless migration of a large application while still sharing common\nconfigurations and components.': '一个单体应用可以逐步转型为更加分布式的架构，例如微服务。这种方法允许大型应用在迁移过程中保持平滑过渡，同时还能共享通用的配置和组件。',
        'Turning a Single Application into Multiple Applications': '将单个应用转变为多个应用',
        'These are the steps required to convert a single application into a new one that\nsupports multiple applications:': '以下是将单个应用转换为支持多个应用的新应用所需的步骤：',
        'Create a new application;': '创建一个新的应用；',
        'Update the Kernel class to support multiple applications;': '更新 Kernel 类以支持多个应用；',
        'Add a new APP_ID environment variable;': '添加一个新的 <code translate="no" class="notranslate">APP_ID</code> 环境变量；',
        'Update the front controllers.': '更新前端控制器。',
        'The following example shows how to create a new application for the API of a new\nSymfony project.': '以下示例展示了如何为新的 Symfony 项目中的 API 创建一个新的应用。',
        'Step 1) Create a new Application': '步骤 1) 创建一个新的应用',
        'This example follows the Shared Kernel pattern: all applications maintain an\nisolated context, but they can share common bundles, configuration, and code if\ndesired. The optimal approach will depend on your specific needs and\nrequirements, so it\'s up to you to decide which best suits your project.': '此示例遵循共享内核模式：所有应用保持独立的上下文，但如果需要，它们可以共享通用的组件、配置和代码。最佳方法将取决于您的具体需求和要求，因此由您决定哪种方式最适合您的项目。',
        'First, create a new apps directory at the root of your project, which will\nhold all the necessary applications. Each application will follow a simplified\ndirectory structure like the one described in Symfony Best Practice:': '首先，在项目的根目录下创建一个新的 <code translate="no" class="notranslate">apps</code> 目录，该目录将包含所有必要的应用。每个应用将遵循一个简化的目录结构，如 <a href="../best_practices.html" class="reference internal">Symfony 最佳实践</a>中所述：',
        'Note that the config/ and src/ directories at the root of the\nproject will represent the shared context among all applications within the\napps/ directory. Therefore, you should carefully consider what is\ncommon and what should be placed in the specific application.': '注意，项目根目录下的 <code translate="no" class="notranslate">config/</code> 和 <code translate="no" class="notranslate">src/</code> 目录将代表 <code translate="no" class="notranslate">apps/</code> 目录内所有应用之间的共享上下文。因此，您应该仔细考虑哪些是通用的，以及哪些应该放在特定的应用目录中。',
        'You might also consider renaming the namespace for the shared context, from\nApp to Shared, as it will make it easier to distinguish and provide\nclearer meaning to this context.': '您还可以考虑将共享上下文的命名空间从 <code translate="no" class="notranslate">App</code> 重命名为 <code translate="no" class="notranslate">Shared</code>，因为这将更容易区分并为这个上下文提供更清晰的意义。',
        'Since the new apps/api/src/ directory will host the PHP code related to the\nAPI, you have to update the composer.json file to include it in the autoload\nsection:': '由于新的 <code translate="no" class="notranslate">apps/api/src/</code> 目录将承载与 API 相关的 PHP 代码，您需要更新 <code translate="no" class="notranslate">composer.json</code> 文件，将其包含在自动加载（autoload）部分中：',
        'Additionally, don\'t forget to run composer dump-autoload to generate the\nautoload files.': '此外，不要忘记运行 <code translate="no" class="notranslate">composer dump-autoload</code> 来生成自动加载文件。',
        'Step 2) Update the Kernel class to support Multiple Applications': '步骤 2) 更新 Kernel 类以支持多个应用',
        'Since there will be multiple applications, it\'s better to add a new property\nstring $id to the Kernel to identify the application being loaded. This\nproperty will also allow you to split the cache, logs, and configuration files\nin order to avoid collisions with other applications. Moreover, it contributes\nto performance optimization, as each application will load only the required\nresources:': '由于存在多个应用，最好在 Kernel 类中添加一个新的属性 <code translate="no" class="notranslate">string $id</code> 以标识正在加载的应用。这个属性还将允许您拆分缓存、日志和配置文件，以避免与其他应用发生冲突。此外，这有助于性能优化，因为每个应用只会加载所需的资源：',
        'This example reuses the default implementation to import the configuration and\nroutes based on a given configuration directory. As shown earlier, this\napproach will import both the shared and the app-specific resources.': '此示例重用了默认实现，根据给定的配置目录导入配置和路由。如前所述，这种方法将导入共享资源和应用特定资源。',
        'Step 3) Add a new APP_ID environment variable': '步骤 3) 添加一个新的 <code translate="no" class="notranslate">APP_ID</code> 环境变量',
        'Next, define a new environment variable that identifies the current application.\nThis new variable can be added to the .env file to provide a default value,\nbut it should typically be added to your web server configuration.': '接下来，定义一个新的环境变量以标识当前应用。这个新变量可以添加到 <code translate="no" class="notranslate">.env</code> 文件中以提供一个默认值，但它通常应被添加到您的Web服务器配置中。',
        'The value of this variable must match the application directory within\napps/ as it is used in the Kernel to load the specific application\nconfiguration.': '这个变量的值必须与 <code translate="no" class="notranslate">apps/</code> 目录中的应用目录相匹配，因为它在 Kernel 中用于加载特定应用的配置。',
        'Step 4) Update the Front Controllers': '步骤 4）更新前端控制器',
        'In this final step, update the front controllers public/index.php and\nbin/console to pass the value of the APP_ID variable to the Kernel\ninstance. This will allow the Kernel to load and run the specified\napplication:': '在这个最后的步骤中，更新前端控制器 <code translate="no" class="notranslate">public/index.php</code> 和 <code translate="no" class="notranslate">bin/console</code>，以便将 <code translate="no" class="notranslate">APP_ID</code> 变量的值传递给 Kernel 实例。这将允许 Kernel 加载并运行指定的应用程序：',
        'Similar to configuring the required APP_ENV and APP_DEBUG values, the\nthird argument of the Kernel constructor is now also necessary to set the\napplication ID, which is derived from an external configuration.': '类似于配置所需的 <code translate="no" class="notranslate">APP_ENV</code> 和 <code translate="no" class="notranslate">APP_DEBUG</code> 值，现在 Kernel 构造函数的第三个参数也是必需的，用于设置从外部配置获取的应用程序 ID。',
        'For the second front controller, define a new console option to allow passing\nthe application ID to run under CLI context:': '对于第二个前端控制器，定义一个新的控制台选项，以允许在 CLI 上下文中传递应用程序 ID 来运行：',
        'That\'s it!': '就这样！',
        'Executing Commands': '执行命令',
        'The bin/console script, which is used to run Symfony commands, always uses\nthe Kernel class to build the application and load the commands. If you\nneed to run console commands for a specific application, you can provide the\n--id option along with the appropriate identity value:': '用于运行 Symfony 命令的 <code translate="no" class="notranslate">bin/console</code> 脚本始终使用 <code translate="no" class="notranslate">Kernel</code> 类来构建应用并加载命令。如果您需要为特定应用运行控制台命令，可以提供 <code translate="no" class="notranslate">--id</code> 选项以及相应的身份值：',
        'You might want to update the composer auto-scripts section to run multiple\ncommands simultaneously. This example shows the commands of two different\napplications called api and admin:': '您可能希望更新 composer 的自动加载脚本部分，以同时运行多个命令。这个示例展示了名为 <code translate="no" class="notranslate">api</code> 和 <code translate="no" class="notranslate">admin</code> 的两个不同应用的命令：',
        'Then, run composer auto-scripts to test it!': '然后，运行 <code translate="no" class="notranslate">composer auto-scripts</code> 来测试它！',
        'The commands available for each console script (e.g. bin/console -iapi\nand bin/console -iadmin) can differ because they depend on the bundles\nenabled for each application, which could be different.': '每个控制台脚本可用的命令（例如 <code translate="no" class="notranslate">bin/console -iapi</code> 和 <code translate="no" class="notranslate">bin/console -iadmin</code>）可能会有所不同，因为它们取决于为每个应用启用的捆绑包，而这些捆绑包可能是不同的。',
        'Rendering Templates': '渲染模板',
        'Let\'s consider that you need to create another app called admin. If you\nfollow the Symfony Best Practices, the shared Kernel\ntemplates will be located in the templates/ directory at the project\'s root.\nFor admin-specific templates, you can create a new directory\napps/admin/templates/ which you will need to manually configure under the\nAdmin application:': '假设你需要创建另一个叫做 <code translate="no" class="notranslate">admin</code> 的应用。如果你遵循 <a href="../best_practices.html" class="reference internal">Symfony 的最佳实践</a>，共享的 Kernel 模板将位于项目根目录下的 <code translate="no" class="notranslate">templates/</code> 目录中。对于特定于 admin 的模板，你可以创建一个新的目录 <code translate="no" class="notranslate">apps/admin/templates/</code>，并且你需要手动在 Admin 应用中配置这个目录。',
        'Then, use this Twig namespace to reference any template within the Admin\napplication only, for example @Admin/form/fields.html.twig.': '然后，使用这个 Twig 命名空间来引用仅在 Admin 应用内的任何模板，例如 <code translate="no" class="notranslate">@Admin/form/fields.html.twig</code>。',
        'Running Tests': '运行测试',
        'In Symfony applications, functional tests typically extend from\nthe WebTestCase class by\ndefault. Within its parent class, KernelTestCase, there is a method called\ncreateKernel() that attempts to create the kernel responsible for running\nthe application during tests. However, the current logic of this method doesn\'t\ninclude the new application ID argument, so you need to update it:': '在 Symfony 应用中，功能测试通常默认继承自 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Test/WebTestCase.php" class="reference external" title="Symfony\Bundle\FrameworkBundle\Test\WebTestCase" rel="external noopener noreferrer" target="_blank">WebTestCase</a> 类。在其父类 <code translate="no" class="notranslate">KernelTestCase</code> 中，有一个名为 <code translate="no" class="notranslate">createKernel()</code> 的方法，该方法尝试创建在测试期间运行应用的 Kernel。然而，该方法当前的逻辑并不包含新的应用 ID 参数，因此你需要更新它：',
        'This examples uses a hardcoded application ID value because the tests\nextending this ApiTestCase class will focus solely on the api tests.': '这个示例使用了一个硬编码的应用 ID 值，因为继承此 <code translate="no" class="notranslate">ApiTestCase</code> 类的测试将仅专注于 <code translate="no" class="notranslate">api</code> 测试。',
        'Now, create a tests/ directory inside the apps/api/ application. Then,\nupdate both the composer.json file and phpunit.xml configuration about\nits existence:': '现在，在 <code translate="no" class="notranslate">apps/api/</code> 应用内创建一个 <code translate="no" class="notranslate">tests/</code> 目录。然后，更新 <code translate="no" class="notranslate">composer.json</code> 文件和 <code translate="no" class="notranslate">phpunit.xml</code> 配置，以反映该目录的存在：',
        'Remember to run composer dump-autoload to generate the autoload files.': '记得运行 <code translate="no" class="notranslate">composer dump-autoload</code> 来生成自动加载文件。',
        'And, here is the update needed for the phpunit.xml file:': '以下是 <code translate="no" class="notranslate">phpunit.xml</code> 文件所需做的更新：',
        'Adding more Applications': '添加更多应用',
        'Now you can begin adding more applications as needed, such as an admin\napplication to manage the project\'s configuration and permissions. To do that,\nyou will have to repeat the step 1 only:': '现在你可以根据需要添加更多的应用，例如一个用于管理项目配置和权限的 <code translate="no" class="notranslate">admin</code> 应用。要做到这一点，你只需要重复第一步即可：',
        'Additionally, you might need to update your web server configuration to set the\nAPP_ID=admin under a different domain.': '此外，你可能还需要更新你的 Web 服务器配置，以在不同的域名下设置 <code translate="no" class="notranslate">APP_ID=admin</code>。',
    };

    fanyi(translates, 1);
})($);
