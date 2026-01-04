// ==UserScript==
// @name         Twig 翻译文档 tags/apply.html
// @namespace    fireloong
// @version      0.1.1
// @description  Twig 翻译文档
// @author       Itsky71
// @match        https://twig.symfony.com/doc/3.x/tags/apply.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493871/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20tagsapplyhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/493871/Twig%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20tagsapplyhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    let cssStyle='code, pre{background:var(--code-background);}';
    GM_addStyle(cssStyle);

    $('#sln').hide();

    const translates = {
        'The apply tag allows you to apply Twig filters on a block of template data:': '<code translate="no" class="notranslate">apply</code> 标签允许你在模板数据块上应用 Twig 过滤器：',
        'You can also chain filters and pass arguments to them:': '你也可以链接过滤器并传递参数给它们:',
    };

    $('#doc-toc a,.section h1 a,.section h2 a,.section h3 a,.section p,.section li').each(function(i,v){
        if(translates.hasOwnProperty($(this).text())) {
            $(this).html(translates[$(this).text()]);
        }else{
            console.log(i,v,$(this).text());
        }
    });
})($);