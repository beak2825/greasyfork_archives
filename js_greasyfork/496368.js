// ==UserScript==
// @name         Symfony 翻译文档 messenger.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 messenger.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/messenger.html
// @match        https://symfony.com/doc/6.4/messenger.html
// @match        https://symfony.com/doc/7.1/messenger.html
// @match        https://symfony.com/doc/7.2/messenger.html
// @match        https://symfony.com/doc/current/messenger.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496368/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20messengerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496368/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20messengerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Messenger: Sync & Queued Message Handling\n        \n            ': 'Messenger：同步和队列消息处理'
    };

    fanyi(translates, 1, true);
})($);
