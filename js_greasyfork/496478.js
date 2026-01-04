// ==UserScript==
// @name         Symfony 翻译文档 frontend/encore/simple-example.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 frontend/encore/simple-example.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/frontend/encore/simple-example.html
// @match        https://symfony.com/doc/6.4/frontend/encore/simple-example.html
// @match        https://symfony.com/doc/7.1/frontend/encore/simple-example.html
// @match        https://symfony.com/doc/7.2/frontend/encore/simple-example.html
// @match        https://symfony.com/doc/current/frontend/encore/simple-example.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496478/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20frontendencoresimple-examplehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496478/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20frontendencoresimple-examplehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Encore: Setting up your Project\n        \n            ': 'Encore：设置项目',
    };

    fanyi(translates, 1, true);
})($);
