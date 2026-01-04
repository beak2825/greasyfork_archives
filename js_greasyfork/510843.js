// ==UserScript==
// @name         新建 symfony 文档翻译脚本
// @namespace    fireloong
// @version      0.0.2
// @description  自动填充 symfony 文档翻译初始化脚本
// @author       Itsky71
// @match        https://greasyfork.org/zh-CN/script_versions/new?type=symfony&*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510843/%E6%96%B0%E5%BB%BA%20symfony%20%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/510843/%E6%96%B0%E5%BB%BA%20symfony%20%E6%96%87%E6%A1%A3%E7%BF%BB%E8%AF%91%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const url = new URL(window.location.href);

    const page = url.searchParams.get('page');

    const initScript=`// ==UserScript==
// @name         Symfony 翻译文档 ${page}.html
// @namespace    fireloong
// @version      0.0.1
// @description  翻译文档 ${page}.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/${page}.html
// @match        https://symfony.com/doc/6.4/${page}.html
// @match        https://symfony.com/doc/7.1/${page}.html
// @match        https://symfony.com/doc/7.2/${page}.html
// @match        https://symfony.com/doc/current/${page}.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {};

    fanyi(translates, 1, true);
})($);
`;

    $('#script_version_code').text(initScript);
    $('#script-version-additional-info-0').text('# Symfony 翻译文档 ' + page + '.html');
    $('#script_version_additional_info_0_value_markup_markdown').click();
    $('#enable-source-editor-code').click();
    $('#script_script_type_2').click();
})($);
