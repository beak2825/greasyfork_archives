// ==UserScript==
// @name         Symfony 翻译文档 scheduler.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 scheduler.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/scheduler.html
// @match        https://symfony.com/doc/6.4/scheduler.html
// @match        https://symfony.com/doc/7.1/scheduler.html
// @match        https://symfony.com/doc/7.2/scheduler.html
// @match        https://symfony.com/doc/current/scheduler.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496369/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20schedulerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496369/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20schedulerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Scheduler\n        \n            ': '调度器'
    };

    fanyi(translates, 1, true);
})($);
