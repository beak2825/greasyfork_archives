// ==UserScript==
// @name         Symfony 翻译文档 bundles/best_practices.html
// @namespace    fireloong
// @version      0.0.1
// @description  翻译文档 bundles/best_practices.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/bundles/best_practices.html
// @match        https://symfony.com/doc/6.4/bundles/best_practices.html
// @match        https://symfony.com/doc/7.1/bundles/best_practices.html
// @match        https://symfony.com/doc/7.2/bundles/best_practices.html
// @match        https://symfony.com/doc/current/bundles/best_practices.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510159/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20bundlesbest_practiceshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/510159/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20bundlesbest_practiceshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {};

    fanyi(translates, 1, true);
})($);
