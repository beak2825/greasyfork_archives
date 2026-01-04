// ==UserScript==
// @name         Symfony 翻译文档 service_container/definitions.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 service_container/definitions.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/definitions.html
// @match        https://symfony.com/doc/6.4/service_container/definitions.html
// @match        https://symfony.com/doc/7.1/service_container/definitions.html
// @match        https://symfony.com/doc/7.2/service_container/definitions.html
// @match        https://symfony.com/doc/current/service_container/definitions.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509072/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerdefinitionshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/509072/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerdefinitionshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to work with Service Definition Objects\n        \n            ': '如何使用服务定义对象',
        'Service definitions are the instructions describing how the container should\nbuild a service. They are not the actual services used by your applications.\nThe container will create the actual class instances based on the configuration\nin the definition.': '服务定义是描述容器应如何构建服务的指令。它们并不是应用程序实际使用的服务。容器将根据定义中的配置创建实际的类实例。',
        'Normally, you would use YAML, XML or PHP to describe the service definitions.\nBut if you\'re doing advanced things with the service container, like working\nwith a Compiler Pass or creating a\nDependency Injection Extension, you may need to\nwork directly with the Definition objects that define how a service will be\ninstantiated.': '通常，你会使用 YAML、XML 或 PHP 来描述服务定义。但如果在使用服务容器时进行高级操作，比如处理<a href="compiler_passes.html" class="reference internal">编译器传递（Compiler Pass）</a>或创建<a href="../bundles/extension.html" class="reference internal">依赖注入扩展（Dependency Injection Extension）</a>，你可能需要直接操作定义服务实例化的 <code translate="no" class="notranslate">Definition</code> 对象。',
        'Getting and Setting Service Definitions': '获取和设置服务定义',
        'There are some helpful methods for working with the service definitions:': '有一些有用的方法可以用来处理服务定义：',
        'Working with a Definition': '处理 Definition',
        'Creating a New Definition': '创建一个新的 Definition',
        'In addition to manipulating and retrieving existing definitions, you can also\ndefine new service definitions with the Definition\nclass.': '除了操作和检索现有的定义外，你还可以使用 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/DependencyInjection/Definition.php" class="reference external" title="Symfony\Component\DependencyInjection\Definition" rel="external noopener noreferrer" target="_blank">Definition</a> 类来定义新的服务定义。',
        'Class': '类',
        'The first optional argument of the Definition class is the fully qualified\nclass name of the object returned when the service is fetched from the container:': '<code translate="no" class="notranslate">Definition</code> 类的第一个可选参数是当从容器中获取服务时返回的对象的完全限定类名：',
        'Constructor Arguments': '构造函数参数',
        'The second optional argument of the Definition class is an array with the\narguments passed to the constructor of the object returned when the service is\nfetched from the container:': '<code translate="no" class="notranslate">Definition</code> 类的第二个可选参数是一个数组，包含当从容器中获取服务时返回的对象的构造函数参数：',
        'Don\'t use get() to get a service that you want to inject as constructor\nargument, the service is not yet available. Instead, use a\nReference instance as shown above.': '不要使用 <code translate="no" class="notranslate">get()</code> 来获取你想作为构造函数参数注入的服务，因为此时服务尚未可用。相反，应使用如上所示的 <code translate="no" class="notranslate">Reference</code> 实例。',
        'Method Calls': '方法调用',
        'If the service you are working with uses setter injection then you can manipulate\nany method calls in the definitions as well:': '如果你正在处理的服务使用了 setter 注入，那么你也可以在定义中操作任何方法调用：',
        'There are more examples of specific ways of working with definitions\nin the PHP code blocks of the Service Container articles such as\nUsing a Factory to Create Services and How to Manage Common Dependencies with Parent Services.': '在服务容器的文章中的 PHP 代码块中有更多关于如何具体操作定义的例子，例如 <a href="factories.html" class="reference internal">使用工厂创建服务</a>和<a href="parent_services.html" class="reference internal">如何使用父服务管理常见依赖</a>。',
        'The methods here that change service definitions can only be used before\nthe container is compiled. Once the container is compiled you cannot\nmanipulate service definitions further. To learn more about compiling\nthe container, see Compiling the Container.': '这里更改服务定义的方法只能在容器编译之前使用。一旦容器编译完成，就不能再进一步操作服务定义。要了解有关编译容器的更多信息，请参阅<a href="../components/dependency_injection/compilation.html" class="reference internal">编译容器</a>。',
        'Requiring Files': '加载文件',
        'There might be use cases when you need to include another file just before\nthe service itself gets loaded. To do so, you can use the\nsetFile() method:': '在某些情况下，你可能需要在加载服务本身之前包含另一个文件。为此，你可以使用 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/DependencyInjection/Definition.php#:~:text=function%20setFile" class="reference external" title="Symfony\Component\DependencyInjection\Definition::setFile()" rel="external noopener noreferrer" target="_blank">setFile()</a> 方法：',
        'Notice that Symfony will internally call the PHP statement require_once,\nwhich means that your file will be included only once per request.': '请注意，Symfony 内部会调用 PHP 语句 <code translate="no" class="notranslate">require_once</code>，这意味着你的文件在每次请求中只会被包含一次。',
    };

    fanyi(translates, 1);
})($);
