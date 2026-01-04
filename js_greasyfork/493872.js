// ==UserScript==
// @name         Twig 翻译文档 tags/autoescape.html
// @namespace    fireloong
// @version      0.1.1
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/tags/autoescape.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493872/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20tagsautoescapehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/493872/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20tagsautoescapehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let cssStyle='code, pre{background:var(--code-background);}';
    GM_addStyle(cssStyle);

    $('#sln').hide();

    const translates = {
        'Whether automatic escaping is enabled or not, you can mark a section of a\ntemplate to be escaped or not by using the autoescape tag:': '无论是否启用自动转义，您都可以使用 <code translate="no" class="notranslate">autoescape</code> 标签将模板的一部分标记为转义或不转义：',
        'When automatic escaping is enabled everything is escaped by default except for\nvalues explicitly marked as safe. Those can be marked in the template by using\nthe raw filter:': '当启用自动转义时，默认情况下，除了显式标记为安全的值外，所有内容都会转义。这些可以通过使用 <a href="../filters/raw.html" class="reference internal">raw</a> 过滤器在模板中进行标记：',
        'Functions returning template data (like macros and\nparent) always return safe markup.': '返回模板数据的函数(如 <a href="macro.html" class="reference internal">macros</a> 和 <a href="../functions/parent.html" class="reference internal">parent</a>)总是返回安全标记。',
        'Twig is smart enough to not escape an already escaped value by the\nescape filter.': 'Twig 非常聪明，不会通过 <a href="../filters/escape.html" class="reference internal">escape</a> 过滤器转义已经转义的值。',
        'Twig does not escape static expressions:': 'Twig 不转义静态表达式:',
        'Will be rendered "<strong>Hello</strong> world".': '将呈现“&lt;strong&gt;Hello&lt;/strong&gt; <strong>world</strong>”',
        'The chapter Twig for Developers gives more information\nabout when and how automatic escaping is applied.': '<a href="../api.html" class="reference internal">开发人员的 Twig</a> 一章提供了更多关于何时以及如何应用自动转义的信息。',
    };

    $('#doc-toc a,.section h1 a,.section h2 a,.section h3 a,.section p,.section li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);