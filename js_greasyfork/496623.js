// ==UserScript==
// @name         Symfony 翻译文档 deployment.html
// @namespace    fireloong
// @version      0.0.4
// @description  翻译文档 deployment.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/deployment.html
// @match        https://symfony.com/doc/6.4/deployment.html
// @match        https://symfony.com/doc/7.1/deployment.html
// @match        https://symfony.com/doc/7.2/deployment.html
// @match        https://symfony.com/doc/current/deployment.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496623/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20deploymenthtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496623/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20deploymenthtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Deploy a Symfony Application\n        \n            ': '如何部署 Symfony 应用程序',
    };

    fanyi(translates, 1, true);
})($);
