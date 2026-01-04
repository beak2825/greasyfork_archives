// ==UserScript==
// @name         Symfony 翻译文档 frontend.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 frontend.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/frontend.html
// @match        https://symfony.com/doc/6.4/frontend.html
// @match        https://symfony.com/doc/7.1/frontend.html
// @match        https://symfony.com/doc/7.2/frontend.html
// @match        https://symfony.com/doc/current/frontend.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496432/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20frontendhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496432/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20frontendhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Front-end Tools: Handling CSS & JavaScript\n        \n            ': '前端工具：处理 CSS 和 JavaScript'
    };

    fanyi(translates, 1, true);
})($);
