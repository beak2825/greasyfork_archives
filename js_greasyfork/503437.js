// ==UserScript==
// @name         Book for Symfony 6 翻译 28-intl.html
// @namespace    fireloong
// @version      0.1.0
// @description  本地化应用程序 28-intl.html
// @author       Itsky71
// @match        https://symfony.com/doc/6.4/the-fast-track/en/28-intl.html
// @match        https://symfony.com/doc/current/the-fast-track/en/28-intl.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503437/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2028-intlhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/503437/Book%20for%20Symfony%206%20%E7%BF%BB%E8%AF%91%2028-intlhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Localizing an Application\n        \n            ': '本地化应用程序',
        'With an international audience, Symfony has been able to handle internationalization (i18n) and localization (l10n) out of the box since, like, forever. Localizing an application is not just about translating the interface, it is also about plurals, date and currency formatting, URLs, and more.': 'Symfony 拥有国际受众，因此它从一开始就能够处理国际化 (i18n) 和本地化 (l10n)。本地化一个应用程序不仅仅是翻译界面，还包括复数、日期和货币格式、URL 等。',
        'Internationalizing URLs': 'URL 的国际化',
        'The first step to internationalize the website is to internationalize the URLs. When translating a website interface, the URL should be different per locale to play nice with HTTP caches (never use the same URL and store the locale in the session).': '网站国际化的第一步是国际化 URL。在翻译网站界面时，每个地区的 URL 都应该不同，以便与 HTTP 缓存友好相处（永远不要使用相同的 URL 并在会话中存储地区）。',
        'Use the special _locale route parameter to reference the locale in routes:': '使用特殊的 <code translate="no" class="notranslate">_locale</code> 路由参数在路由中引用地区：',
        'On the homepage, the locale is now set internally depending on the URL; for instance, if you hit /fr/, $request->getLocale() returns fr.': '在首页上，地区现在根据 URL 内部设置；例如，如果您点击 <code translate="no" class="notranslate">/fr/</code>，<code translate="no" class="notranslate">$request-&gt;getLocale()</code> 将返回 <code translate="no" class="notranslate">fr</code>。',
        'As you will probably not be able to translate the content in all valid locales, restrict to the ones you want to support:': '由于您可能无法翻译所有有效地区的内容，因此请限制为您想要支持的内容：',
        'Each route parameter can be restricted by a regular expression inside < >. The homepage route now only matches when the _locale parameter is en or fr. Try hitting /es/, you should have a 404 as no route matches.': '每个路由参数都可以在 <code translate="no" class="notranslate">&lt;</code> <code translate="no" class="notranslate">&gt;</code> 内通过正则表达式进行限制。现在，当 <code translate="no" class="notranslate">_locale</code> 参数为 <code translate="no" class="notranslate">en</code> 或 <code translate="no" class="notranslate">fr</code> 时，<code translate="no" class="notranslate">homepage</code> 路由才会匹配。尝试访问 <code translate="no" class="notranslate">/es/</code>，您应该会收到 404 错误，因为没有匹配的路由。',
        'As we will use the same requirement in almost all routes, let\'s move it to a container parameter:': '由于我们几乎在所有路由中都会使用相同的要求，因此让我们将其移动到容器参数中：',
        'Adding a language can be done by updating the app.supported_languages parameter.': '可以通过更新 <code translate="no" class="notranslate">app.supported_languages</code> 参数来添加语言。',
        'Add the same locale route prefix to the other URLs:': '将相同的地区路由前缀添加到其它 URL：',
        'We are almost done. We don\'t have a route that matches / anymore. Let\'s add it back and make it redirect to /en/:': '我们快完成了。我们现在没有匹配 <code translate="no" class="notranslate">/</code> 的路由了。让我们将其添加回来，并将其重定向到 <code translate="no" class="notranslate">/en/</code>：',
        'Now that all main routes are locale aware, notice that generated URLs on the pages take the current locale into account automatically.': '现在所有主要路由都已具有地区意识，请注意，页面上生成的 URL 会自动考虑当前地区。',
        'Adding a Locale Switcher': '添加地区切换器',
        'To allow users to switch from the default en locale to another one, let\'s add a switcher in the header:': '为了允许用户从默认的 <code translate="no" class="notranslate">en</code> 地区切换到其它地区，让我们在页眉中添加一个切换器：',
        'To switch to another locale, we explicitly pass the _locale route parameter to the path() function.': '为了切换到另一个地区，我们明确地将 <code translate="no" class="notranslate">_locale</code> 路由参数传递给 <code translate="no" class="notranslate">path()</code> 函数。',
        'Update the template to display the current locale name instead of the hard-coded "English":': '更新模板以显示当前地区名称，而不是硬编码的“English”：',
        'app is a global Twig variable that gives access to the current request. To convert the locale to a human readable string, we are using the locale_name Twig filter.': '<code translate="no" class="notranslate">app</code> 是一个全局的 Twig 变量，可以访问当前请求。为了将地区转换为人类可读的字符串，我们使用了 <code translate="no" class="notranslate">locale_name</code> Twig 过滤器。',
        'Depending on the locale, the locale name is not always capitalized. To capitalize sentences properly, we need a filter that is Unicode aware, as provided by the Symfony String component and its Twig implementation:': '根据地区，地区名称并不总是大写。为了正确地将句子大写，我们需要一个支持 Unicode 的过滤器，Symfony String 组件及其 Twig 实现提供了这样的过滤器：',
        'You can now switch from French to English via the switcher and the whole interface adapts itself quite nicely:': '现在，您可以通过切换器从法语切换到英语，并且整个界面都会很好地适应：',
        'Translating the Interface': '翻译界面',
        'Translating every single sentence on a large website can be tedious, but fortunately, we only have a handful of messages on our website. Let\'s start with all the sentences on the homepage:': '在大型网站上翻译每一句话可能很繁琐，但幸运的是，我们的网站上只有少数几句话。让我们从主页上的所有句子开始：',
        'The trans Twig filter looks for a translation of the given input to the current locale. If not found, it falls back to the default locale as configured in config/packages/translation.yaml:': '<code translate="no" class="notranslate">trans</code> Twig 过滤器会查找给定输入到当前地区的翻译。如果没有找到，它会回退到 <code translate="no" class="notranslate">config/packages/translation.yaml</code> 中配置的默认地区：',
        'Notice that the web debug toolbar translation "tab" has turned red:': '请注意，Web 调试工具栏的“翻译”选项卡已变为红色：',
        'It tells us that 3 messages are not translated yet.': '它告诉我们还有 3 条消息尚未翻译。',
        'Click on the "tab" to list all messages for which Symfony did not find a translation:': '点击该“选项卡”以列出 Symfony 未找到翻译的所有消息：',
        'Providing Translations': '提供翻译',
        'As you might have seen in config/packages/translation.yaml, translations are stored under a translations/ root directory, which has been created automatically for us.': '正如您可能在 <code translate="no" class="notranslate">config/packages/translation.yaml</code> 中看到的那样，翻译被存储在 <code translate="no" class="notranslate">translations/</code> 根目录下，该目录已自动为我们创建。',
        'Instead of creating the translation files by hand, use the translation:extract command:': '不要手动创建翻译文件，而是使用 <code translate="no" class="notranslate">translation:extract</code> 命令：',
        'This command generates a translation file (--force flag) for the fr locale and the messages domain. The messages domain contains all application messages excluding the ones coming from Symfony itself like validation or security errors.': '此命令为 <code translate="no" class="notranslate">fr</code> 地区和 <code translate="no" class="notranslate">messages</code> 域生成一个翻译文件（<code translate="no" class="notranslate">--force</code> 标志）。<code translate="no" class="notranslate">messages</code> 域包含所有应用程序消息，但不包括来自 Symfony 本身的消息，如验证或安全错误。',
        'Edit the translations/messages+intl-icu.fr.xlf file and translate the messages in French. Don\'t speak French? Let me help you:': '编辑 <code translate="no" class="notranslate">translations/messages+intl-icu.fr.xlf</code> 文件，并将消息翻译成法语。不会法语吗？我来帮你：',
        'Note that we won\'t translate all templates, but feel free to do so:': '请注意，我们不会翻译所有模板，但您可以随意进行翻译：',
        'Translating Forms': '翻译表单',
        'Form labels are automatically displayed by Symfony via the translation system. Go to a conference page and click on the "Translation" tab of the web debug toolbar; you should see all labels ready for translation:': '表单标签由 Symfony 通过翻译系统自动显示。转到会议页面，然后单击 Web 调试工具栏的“翻译”选项卡；您应该看到所有待翻译的标签：',
        'Localizing Dates': '本地化日期',
        'If you switch to French and go to a conference webpage that has some comments, you will notice that the comment dates are automatically localized. This works because we used the format_datetime Twig filter, which is locale-aware ({{ comment.createdAt|format_datetime(\'medium\', \'short\') }}).': '如果您切换到法语并转到包含一些评论的会议网页，您会注意到评论日期已自动本地化。这是因为我们使用了 <code translate="no" class="notranslate">format_datetime</code> Twig 过滤器，它具有地区意识（<code translate="no" class="notranslate">{{ comment.createdAt|format_datetime(\'medium\', \'short\') }}</code>）。',
        'The localization works for dates, times (format_time), currencies (format_currency), and numbers (format_number) in general (percents, durations, spell out, ...).': '本地化通常适用于日期、时间（<code translate="no" class="notranslate">format_time</code>）、货币（<code translate="no" class="notranslate">format_currency</code>）和数字（<code translate="no" class="notranslate">format_number</code>）（百分比、持续时间、拼写等）。',
        'Translating Plurals': '翻译复数形式',
        'Managing plurals in translations is one usage of the more general problem of selecting a translation based on a condition.': '在翻译中管理复数是基于条件选择翻译的更一般问题的一种应用。',
        'On a conference page, we display the number of comments: There are 2 comments. For 1 comment, we display There are 1 comments, which is wrong. Modify the template to convert the sentence to a translatable message:': '在会议页面上，我们显示评论的数量：<code translate="no" class="notranslate">There are 2 comments</code>。对于 1 条评论，我们显示 <code translate="no" class="notranslate">There are 1 comments</code>，这是错误的。修改模板以将句子转换为可翻译的消息：',
        'For this message, we have used another translation strategy. Instead of keeping the English version in the template, we have replaced it with a unique identifier. That strategy works better for complex and large amount of text.': '对于此消息，我们使用了另一种翻译策略。我们没有在模板中保留英文版本，而是用了一个唯一标识符来替换它。这种策略对于复杂且大量的文本效果更好。',
        'Update the translation file by adding the new message:': '通过添加新消息来更新翻译文件：',
        'We have not finished yet as we now need to provide the English translation. Create the translations/messages+intl-icu.en.xlf file:': '我们还没有完成，因为我们现在需要提供英文翻译。创建 <code translate="no" class="notranslate">translations/messages+intl-icu.en.xlf</code> 文件：',
        'Updating Functional Tests': '更新功能测试',
        'Don\'t forget to update the functional tests to take URLs and content changes into account:': '不要忘记更新功能测试，以考虑 URL 和内容的更改：',
        'Going Further': '深入探索',
        'Translating Messages using the ICU formatter;': '<a href="https://symfony.com/doc/6.4/translation/message_format.html" class="reference external">使用 ICU 格式化程序翻译消息</a>；',
        'Using Twig translation filters.': '<a href="https://symfony.com/doc/6.4/translation/templates.html#translation-filters" class="reference external">使用 Twig 翻译过滤器</a>。',
        'Previous page': '上一页',
        'Next page': '下一页',
        'Building an SPA': '构建单页面应用（SPA）',
        'Managing Performance': '管理性能'
    };

    fanyi(translates, 2);
})($);
