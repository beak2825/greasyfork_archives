// ==UserScript==
// @name         Symfony 翻译文档 bundles/override.html
// @namespace    fireloong
// @version      0.1.1
// @description  翻译文档 bundles/override.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/bundles/override.html
// @match        https://symfony.com/doc/6.4/bundles/override.html
// @match        https://symfony.com/doc/7.1/bundles/override.html
// @match        https://symfony.com/doc/7.2/bundles/override.html
// @match        https://symfony.com/doc/current/bundles/override.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508701/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20bundlesoverridehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/508701/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20bundlesoverridehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Override any Part of a Bundle\n        \n            ': '如何覆盖捆绑包中的任何部分',
        'When using a third-party bundle, you might want to customize or override some of\nits features. This document describes ways of overriding the most common\nfeatures of a bundle.': '在使用第三方捆绑包时，您可能希望自定义或覆盖其某些功能。本文档介绍了覆盖捆绑包中最常见功能的方法。',
        'Templates': '模板',
        'Third-party bundle templates can be overridden in the\n<your-project>/templates/bundles/<bundle-name>/ directory. The new templates\nmust use the same name and path (relative to <bundle>/templates/) as\nthe original templates.': '第三方捆绑模板可以在 <code translate="no" class="notranslate">&lt;your-project&gt;/templates/bundles/&lt;bundle-name&gt;/</code> 目录中覆盖。新的模板必须使用与原始模板相同的名称和路径（相对于 <code translate="no" class="notranslate">&lt;bundle&gt;/templates/</code>）。',
        'For example, to override the templates/registration/confirmed.html.twig\ntemplate from the AcmeUserBundle, create this template:\n<your-project>/templates/bundles/AcmeUserBundle/registration/confirmed.html.twig': '例如，要覆盖 AcmeUserBundle 中的 <code translate="no" class="notranslate">templates/registration/confirmed.html.twig</code> 模板，可以创建如下模板：<code translate="no" class="notranslate">&lt;your-project&gt;/templates/bundles/AcmeUserBundle/registration/confirmed.html.twig</code>',
        'If you add a template in a new location, you may need to clear your\ncache (php bin/console cache:clear), even if you are in debug mode.': '如果你在一个新的位置添加了模板，你可能需要清除缓存（<code translate="no" class="notranslate">php bin/console cache:clear</code>），即使你处于调试模式。',
        'Instead of overriding an entire template, you may just want to override one or\nmore blocks. However, since you are overriding the template you want to extend\nfrom, you would end up in an infinite loop error. The solution is to use the\nspecial ! prefix in the template name to tell Symfony that you want to\nextend from the original template, not from the overridden one:': '与其覆盖整个模板，你可能只想覆盖一个或多个区块。然而，由于你要覆盖的模板本身是从另一个模板继承的，这样会导致无限循环错误。解决方法是在模板名称前使用特殊的 <code translate="no" class="notranslate">!</code> 前缀，告诉 Symfony 你想从原始模板继承，而不是从被覆盖的模板继承。',
        'Symfony internals use some bundles too, so you can apply the same technique\nto override the core Symfony templates. For example, you can\ncustomize error pages overriding TwigBundle\ntemplates.': 'Symfony 内部也使用了一些 bundles，因此你可以采用相同的技术来覆盖核心的 Symfony 模板。例如，你可以通过覆盖 TwigBundle 的模板来<a href="../controller/error_pages.html" class="reference internal">定制错误页面</a>。',
        'Routing': '路由',
        'Routing is never automatically imported in Symfony. If you want to include\nthe routes from any bundle, then they must be manually imported from somewhere\nin your application (e.g. config/routes.yaml).': '路由在 Symfony 中永远不会自动导入。如果你想包含任何 bundle 中的路由，则必须从应用程序的某个地方（例如 <code translate="no" class="notranslate">config/routes.yaml</code>）手动导入这些路由。',
        'The easiest way to "override" a bundle\'s routing is to never import it at\nall. Instead of importing a third-party bundle\'s routing, copy\nthat routing file into your application, modify it, and import it instead.': '“覆盖”bundle 路由的最简单方法是根本不去导入它。与其导入第三方 bundle 的路由，不如将该路由文件复制到你的应用程序中，对其进行修改，然后导入这个修改后的文件。',
        'Controllers': '控制器',
        'If the controller is a service, see the next section on how to override it.\nOtherwise, define a new route + controller with the same path associated to the\ncontroller you want to override (and make sure that the new route is loaded\nbefore the bundle one).': '如果控制器是一个服务，请参阅下一节了解如何覆盖它。否则，定义一个新的路由 + 控制器，并为其关联与你要覆盖的控制器相同的路径（并确保新路由在捆绑包路由之前加载）。',
        'Services & Configuration': '服务与配置',
        'If you want to modify the services created by a bundle, you can use\nservice decoration.': '如果你想修改由 bundle 创建的服务，可以使用<a href="../service_container/service_decoration.html" class="reference internal">服务装饰（service decoration）</a>。',
        'If you want to do more advanced manipulations, like removing services created by\nother bundles, you must work with service definitions\ninside a compiler pass.': '如果你想进行更高级的操作，比如移除由其它 bundle 创建的服务，你需要在<a href="../service_container/compiler_passes.html" class="reference internal">编译器通道</a>中处理<a href="../service_container/definitions.html" class="reference internal">服务定义</a>。',
        'Entities & Entity Mapping': '实体与实体映射',
        'Overriding entity mapping is only possible if a bundle provides a mapped\nsuperclass (such as the User entity in the FOSUserBundle). It\'s possible to\noverride attributes and associations in this way. Learn more about this feature\nand its limitations in the Doctrine documentation.': '覆盖实体映射只有在捆绑包提供了映射超类（例如 FOSUserBundle 中的 <code translate="no" class="notranslate">User</code> 实体）的情况下才可能。通过这种方式，可以覆盖属性和关联。更多关于此功能及其限制的信息，请参阅 <a href="https://www.doctrine-project.org/projects/doctrine-orm/en/current/reference/inheritance-mapping.html#overrides" class="reference external" rel="external noopener noreferrer" target="_blank">Doctrine 文档</a>。',
        'Forms': '表单',
        'Existing form types can be modified defining\nform type extensions.': '可以通过定义<a href="../form/create_form_type_extension.html" class="reference internal">表单类型扩展</a>来修改现有的表单类型。',
        'Validation Metadata': '验证元数据',
        'Symfony loads all validation configuration files from every bundle and\ncombines them into one validation metadata tree. This means you are able to\nadd new constraints to a property, but you cannot override them.': 'Symfony 会从每个 bundle 中加载所有的验证配置文件，并将它们组合成一个验证元数据树。这意味着你可以向属性添加新的约束，但不能覆盖它们。',
        'To overcome this, the 3rd party bundle needs to have configuration for\nvalidation groups. For instance, the FOSUserBundle\nhas this configuration. To create your own validation, add the constraints\nto a new validation group:': '为了解决这个问题，第三方 bundle 需要有针对<a href="../validation/groups.html" class="reference internal">验证组</a>的配置。例如，FOSUserBundle 就有这样的配置。要创建自己的验证，可以将约束添加到一个新的验证组中：',
        'Now, update the FOSUserBundle configuration, so it uses your validation groups\ninstead of the original ones.': '现在，更新 FOSUserBundle 的配置，使其使用你的验证组而不是原始的验证组。',
        'Translations': '翻译',
        'Translations are not related to bundles, but to translation domains.\nFor this reason, you can override any bundle translation file from the main\ntranslations/ directory, as long as the new file uses the same domain.': '翻译不受 bundle 的限制，而是与翻译域相关。因此，只要新文件使用相同的域，你就可以从主 <code translate="no" class="notranslate">translations/</code> 目录中覆盖任何捆绑包的翻译文件。',
        'For example, to override the translations defined in the\ntranslations/AcmeUserBundle.es.yaml file of the AcmeUserBundle,\ncreate a <your-project>/translations/AcmeUserBundle.es.yaml file.': '例如，要覆盖 AcmeUserBundle 中的 <code translate="no" class="notranslate">translations/AcmeUserBundle.es.yaml</code> 文件中的翻译，可以创建一个 <code translate="no" class="notranslate">&lt;your-project&gt;/translations/AcmeUserBundle.es.yaml</code> 文件。',
    };

    fanyi(translates, 1);
})($);
