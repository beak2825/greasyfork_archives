// ==UserScript==
// @name         Symfony 翻译文档 configuration/using_parameters_in_dic.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 configuration/using_parameters_in_dic.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/configuration/using_parameters_in_dic.html
// @match        https://symfony.com/doc/6.4/configuration/using_parameters_in_dic.html
// @match        https://symfony.com/doc/7.1/configuration/using_parameters_in_dic.html
// @match        https://symfony.com/doc/7.2/configuration/using_parameters_in_dic.html
// @match        https://symfony.com/doc/current/configuration/using_parameters_in_dic.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506892/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationusing_parameters_in_dichtml.user.js
// @updateURL https://update.greasyfork.org/scripts/506892/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20configurationusing_parameters_in_dichtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Using Parameters within a Dependency Injection Class\n        \n            ': '在依赖注入类中使用参数',
        'You have seen how to use configuration parameters within\nSymfony service containers.\nThere are special cases such as when you want, for instance, to use the\n%kernel.debug% parameter to make the services in your bundle enter\ndebug mode. For this case there is more work to do in order\nto make the system understand the parameter value. By default,\nyour parameter %kernel.debug% will be treated as a string. Consider the\nfollowing example:': '你已经了解了如何在 <a href="../service_container.html#service-container-parameters" class="reference internal">Symfony 服务容器</a>中使用配置参数。还有一些特殊情况，例如，当你想根据 <code translate="no" class="notranslate">%kernel.debug%</code> 参数让捆绑包中的服务进入调试模式时。在这种情况下，需要做一些额外的工作，以便让系统理解参数的值。默认情况下，你的 <code translate="no" class="notranslate">%kernel.debug%</code> 参数会被当作字符串处理。请考虑以下示例：',
        'Now, examine the results to see this closely:': '现在，检查结果以仔细查看：',
        'In order to support this use case, the Configuration class has to\nbe injected with this parameter via the extension as follows:': '为了支持这种用例，需要通过扩展将这个参数注入到 <code translate="no" class="notranslate">Configuration</code> 类中，如下所示：',
        'And set it in the constructor of Configuration via the Extension class:': '并通过 <code translate="no" class="notranslate">Extension</code> 类在 <code translate="no" class="notranslate">Configuration</code> 类的构造函数中设置它：',
        'There are some instances of %kernel.debug% usage within a\nConfigurator class for example in TwigBundle. However, this is because\nthe default parameter value is set by the Extension class.': '在某些情况下，例如在 TwigBundle 中，<code translate="no" class="notranslate">%kernel.debug%</code> 会在 <code translate="no" class="notranslate">Configurator</code> 类中使用。然而，这是因为默认参数值是由扩展类（Extension 类）设置的。',
    };

    fanyi(translates, 1);
})($);
