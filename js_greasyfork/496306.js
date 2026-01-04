// ==UserScript==
// @name         Symfony 翻译文档 event_dispatcher.html
// @namespace    fireloong
// @version      0.0.5
// @description  翻译文档 event_dispatcher.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/event_dispatcher.html
// @match        https://symfony.com/doc/6.4/event_dispatcher.html
// @match        https://symfony.com/doc/7.1/event_dispatcher.html
// @match        https://symfony.com/doc/7.2/event_dispatcher.html
// @match        https://symfony.com/doc/current/event_dispatcher.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496306/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20event_dispatcherhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496306/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20event_dispatcherhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Events and Event Listeners\n        \n            ': '事件和事件侦听器',
    };

    fanyi(translates, 1, true);
})($);
