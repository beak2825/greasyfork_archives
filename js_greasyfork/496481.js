// ==UserScript==
// @name         Symfony 翻译文档 http_client.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 http_client.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/http_client.html
// @match        https://symfony.com/doc/6.4/http_client.html
// @match        https://symfony.com/doc/7.1/http_client.html
// @match        https://symfony.com/doc/7.2/http_client.html
// @match        https://symfony.com/doc/current/http_client.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496481/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20http_clienthtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496481/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20http_clienthtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    HTTP Client\n        \n            ': 'HTTP 客户端',
    };

    fanyi(translates, 1, true);
})($);
