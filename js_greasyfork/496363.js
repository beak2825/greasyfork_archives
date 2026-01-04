// ==UserScript==
// @name         Symfony 翻译文档 console.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 console.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/console.html
// @match        https://symfony.com/doc/6.4/console.html
// @match        https://symfony.com/doc/7.1/console.html
// @match        https://symfony.com/doc/7.2/console.html
// @match        https://symfony.com/doc/current/console.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496363/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20consolehtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496363/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20consolehtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Console Commands\n        \n            ': '控制台命令'
    };

    fanyi(translates, 1, true);
})($);
