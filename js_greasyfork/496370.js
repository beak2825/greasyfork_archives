// ==UserScript==
// @name         Symfony 翻译文档 notifier.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 notifier.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/notifier.html
// @match        https://symfony.com/doc/6.4/notifier.html
// @match        https://symfony.com/doc/7.1/notifier.html
// @match        https://symfony.com/doc/7.2/notifier.html
// @match        https://symfony.com/doc/current/notifier.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496370/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20notifierhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496370/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20notifierhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Creating and Sending Notifications\n        \n            ': '创建和发送通知'
    };

    fanyi(translates, 1, true);
})($);
