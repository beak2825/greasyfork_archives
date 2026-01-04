// ==UserScript==
// @name         Symfony 翻译文档 introduction/from_flat_php_to_symfony.html
// @namespace    fireloong
// @version      0.0.2
// @description  翻译文档 introduction/from_flat_php_to_symfony.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/introduction/from_flat_php_to_symfony.html
// @match        https://symfony.com/doc/6.4/introduction/from_flat_php_to_symfony.html
// @match        https://symfony.com/doc/7.1/introduction/from_flat_php_to_symfony.html
// @match        https://symfony.com/doc/7.2/introduction/from_flat_php_to_symfony.html
// @match        https://symfony.com/doc/current/introduction/from_flat_php_to_symfony.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504408/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20introductionfrom_flat_php_to_symfonyhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/504408/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20introductionfrom_flat_php_to_symfonyhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
    };

    fanyi(translates, 1, true);
})($);
