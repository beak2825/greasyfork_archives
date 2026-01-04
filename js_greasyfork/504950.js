// ==UserScript==
// @name         Symfony 翻译文档 configuration/env_var_processors.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 configuration/env_var_processors.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/configuration/env_var_processors.html
// @match        https://symfony.com/doc/6.4/configuration/env_var_processors.html
// @match        https://symfony.com/doc/7.1/configuration/env_var_processors.html
// @match        https://symfony.com/doc/7.2/configuration/env_var_processors.html
// @match        https://symfony.com/doc/current/configuration/env_var_processors.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504950/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationenv_var_processorshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504950/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationenv_var_processorshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Environment Variable Processors\n        \n            ': '环境变量处理器',
        'Using env vars to configure Symfony applications is a\ncommon practice to make your applications truly dynamic.': '<a href="../configuration.html#config-env-vars" class="reference internal">使用环境变量（env vars）来配置 Symfony 应用程序</a>是一种常见的做法，可以使你的应用程序真正具有动态性。',
        'The main issue of env vars is that their values can only be strings and your\napplication may need other data types (integer, boolean, etc.). Symfony solves\nthis problem with "env var processors", which transform the original contents of\nthe given environment variables. The following example uses the integer\nprocessor to turn the value of the HTTP_PORT env var into an integer:': '环境变量的主要问题是它们的值只能是字符串，而你的应用程序可能需要其它数据类型（如整数、布尔值等）。Symfony 通过“环境变量处理器”解决了这个问题，这些处理器会转换给定环境变量的原始内容。以下示例使用整数处理器将 <code translate="no" class="notranslate">HTTP_PORT</code> 环境变量的值转换为整数：',
        'Built-In Environment Variable Processors': '内置的环境变量处理器',
        'Symfony provides the following env var processors:': 'Symfony 提供了以下环境变量处理器：',
        'Casts FOO to a string:': '将 <code translate="no" class="notranslate">FOO</code> 转换为字符串：',
        'Casts FOO to a bool (true values are \'true\', \'on\', \'yes\',\nall numbers except 0 and 0.0 and all numeric strings except \'0\'\nand \'0.0\'; everything else is false):': '将 <code translate="no" class="notranslate">FOO</code> 转换为布尔值（<code translate="no" class="notranslate">true</code> 的值包括 <code translate="no" class="notranslate">\'true\'</code>、<code translate="no" class="notranslate">\'on\'</code>、<code translate="no" class="notranslate">\'yes\'</code>，以及除 <code translate="no" class="notranslate">0</code> 和 <code translate="no" class="notranslate">0.0</code> 之外的所有数字和数值字符串；其余一切均为 <code translate="no" class="notranslate">false</code>）：',
        'Casts FOO to a bool (just as env(bool:...) does) except it returns the inverted value\n(falsy values are returned as true, truthy values are returned as false):': '将 <code translate="no" class="notranslate">FOO</code> 转换为布尔值（与 <code translate="no" class="notranslate">env(bool:...)</code> 的处理方式相同），但返回的是相反的值（假值会被转换为 <code translate="no" class="notranslate">true</code>，真值会被转换为 <code translate="no" class="notranslate">false</code>）：',
        '\n                            Casts FOO to an int.\n                    ': '将 <code translate="no" class="notranslate">FOO</code> 转换为整数。',
        '\n                            Casts FOO to a float.\n                    ': '将 <code translate="no" class="notranslate">FOO</code> 转换为浮点数。',
        'Finds the const value named in FOO:': '查找名为 <code translate="no" class="notranslate">FOO</code> 的常量值：',
        '\n                            Decodes the content of FOO, which is a base64 encoded string.\n                    ': '解码 <code translate="no" class="notranslate">FOO</code> 的内容，其中 <code translate="no" class="notranslate">FOO</code> 是一个 Base64 编码的字符串。',
        'Decodes the content of FOO, which is a JSON encoded string. It returns\neither an array or null:': '解码 <code translate="no" class="notranslate">FOO</code> 的内容，其中 <code translate="no" class="notranslate">FOO</code> 是一个 JSON 编码的字符串。它返回一个数组或 `null`：',
        'If the content of FOO includes container parameters (with the syntax\n%parameter_name%), it replaces the parameters by their values:': '如果 <code translate="no" class="notranslate">FOO</code> 的内容包含容器参数（语法为 <code translate="no" class="notranslate">%parameter_name%</code>），则用这些参数的实际值来替换：',
        'env(csv:FOO)': '',
        'Decodes the content of FOO, which is a CSV-encoded string:': '解码 <code translate="no" class="notranslate">FOO</code> 的内容，其中 <code translate="no" class="notranslate">FOO</code> 是一个 CSV 编码的字符串：',
        'Randomly shuffles values of the FOO env var, which must be an array.': '随机打乱次序 <code translate="no" class="notranslate">FOO</code> 环境变量的值，该环境变量必须是一个数组。',
        'The env(shuffle:...) env var processor was introduced in Symfony 6.2.': '<code translate="no" class="notranslate">env(shuffle:...)</code> 环境变量处理器是在 Symfony 6.2 中引入的。',
        'Returns the contents of a file whose path is the value of the FOO env var:': '返回一个文件的内容，该文件的路径是 <code translate="no" class="notranslate">FOO</code> 环境变量的值：',
        'require() the PHP file whose path is the value of the FOO\nenv var and return the value returned from it.': '使用 <code translate="no" class="notranslate">require()</code> 包含路径为 <code translate="no" class="notranslate">FOO</code> 环境变量值的 PHP 文件，并返回该文件执行后返回的值。',
        'Trims the content of FOO env var, removing whitespaces from the beginning\nand end of the string. This is especially useful in combination with the\nfile processor, as it\'ll remove newlines at the end of a file.': '修剪 <code translate="no" class="notranslate">FOO</code> 环境变量的内容，去除字符串开头和结尾的空白字符。这与 <code translate="no" class="notranslate">file</code> 处理器结合使用尤其有用，因为它会去掉文件末尾的换行符。',
        'Retrieves the value associated with the key FOO from the array whose\ncontents are stored in the BAR env var:': '从存储于 <code translate="no" class="notranslate">BAR</code> 环境变量的内容数组中获取与键 <code translate="no" class="notranslate">FOO</code> 关联的值：',
        'Retrieves the value of the parameter fallback_param when the BAR env\nvar is not available:': '在 <code translate="no" class="notranslate">BAR</code> 环境变量不可用时，获取参数 <code translate="no" class="notranslate">fallback_param</code> 的值：',
        'When the fallback parameter is omitted (e.g. env(default::API_KEY)), then the\nreturned value is null.': '当备选参数被省略时（例如 <code translate="no" class="notranslate">env(default::API_KEY)</code>），则返回的值为 <code translate="no" class="notranslate">null</code>。',
        'Parses an absolute URL and returns its components as an associative array.': '解析一个绝对 URL 并将其组件作为关联数组返回。',
        'In order to ease extraction of the resource from the URL, the leading\n/ is trimmed from the path component.': '为了便于从 URL 中提取资源，会去掉 <code translate="no" class="notranslate">path</code> 组件前导的 <code translate="no" class="notranslate">/</code>。',
        'Parses the query string part of the given URL and returns its components as\nan associative array.': '解析给定 URL 的查询字符串部分，并将其组件作为关联数组返回。',
        'Tries to convert an environment variable to an actual \\BackedEnum value.\nThis processor takes the fully qualified name of the \\BackedEnum as an argument:': '尝试将环境变量转换为实际的 <code translate="no" class="notranslate">\BackedEnum</code> 值。此处理器接受完全限定的 <code translate="no" class="notranslate">\BackedEnum</code> 名称作为参数：',
        'The value stored in the CARD_SUIT env var would be a string (e.g. \'spades\')\nbut the application will use the enum value (e.g. Suit::Spades).': '存储在 <code translate="no" class="notranslate">CARD_SUIT</code> 环境变量中的值将是一个字符串（例如 <code translate="no" class="notranslate">\'spades\'</code>），但应用程序将使用枚举值（例如 <code translate="no" class="notranslate">Suit::Spades</code>）。',
        'The env(enum:...) env var processor was introduced in Symfony 6.2.': '<code translate="no" class="notranslate">env(enum:...)</code> 环境变量处理器是在 Symfony 6.2 中引入的。',
        'Evaluates to true if the env var exists and its value is not \'\'\n(an empty string) or null; it returns false otherwise.': '如果环境变量存在且其值不是空字符串 <code translate="no" class="notranslate">\'\'</code> 或 <code translate="no" class="notranslate">null</code>，则评估为 <code translate="no" class="notranslate">true</code>；否则返回 <code translate="no" class="notranslate">false</code>。',
        'The env(defined:...) env var processor was introduced in Symfony 6.4.': '<code translate="no" class="notranslate">env(defined:...)</code> 环境变量处理器是在 Symfony 6.4 中引入的。',
        'It is also possible to combine any number of processors:': '也可以组合任意数量的处理器：',
        'Custom Environment Variable Processors': '自定义环境变量处理器',
        'It\'s also possible to add your own processors for environment variables. First,\ncreate a class that implements\nEnvVarProcessorInterface:': '也可以添加自己的环境变量处理器。首先，创建一个实现了 <a href="https://github.com/symfony/symfony/blob/6.4/src/Symfony/Component/DependencyInjection/EnvVarProcessorInterface.php" class="reference external" title="Symfony\Component\DependencyInjection\EnvVarProcessorInterface" rel="external noopener noreferrer" target="_blank">EnvVarProcessorInterface</a> 接口的类：',
        'To enable the new processor in the app, register it as a service and\ntag it with the container.env_var_processor\ntag. If you\'re using the\ndefault services.yaml configuration,\nthis is already done for you, thanks to autoconfiguration.': '要在应用程序中启用新的处理器，需要将其注册为一个服务，并使用 <code translate="no" class="notranslate">container.env_var_processor</code> 标签<a href="../service_container/tags.html" class="reference internal">标记它</a>。如果你使用的是<a href="../service_container.html#service-container-services-load-example" class="reference internal">默认的 <code translate="no" class="notranslate">services.yaml</code> 配置</a>，由于<a href="../service_container.html#services-autoconfigure" class="reference internal">自动配置</a>的缘故，这一步已经为你完成了。',
    };

    fanyi(translates, 1);
})($);
