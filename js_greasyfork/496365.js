// ==UserScript==
// @name         Symfony 翻译文档 mailer.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 mailer.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/mailer.html
// @match        https://symfony.com/doc/6.4/mailer.html
// @match        https://symfony.com/doc/7.1/mailer.html
// @match        https://symfony.com/doc/7.2/mailer.html
// @match        https://symfony.com/doc/current/mailer.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496365/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20mailerhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496365/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20mailerhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    Sending Emails with Mailer\n        \n            ': '用 Mailer 发送电子邮件'
    };

    fanyi(translates, 1, true);
})($);
