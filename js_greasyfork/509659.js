// ==UserScript==
// @name         Symfony 翻译文档 service_container/lazy_services.html
// @namespace    fireloong
// @version      0.0.2
// @description  翻译文档 service_container/lazy_services.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/service_container/lazy_services.html
// @match        https://symfony.com/doc/6.4/service_container/lazy_services.html
// @match        https://symfony.com/doc/7.1/service_container/lazy_services.html
// @match        https://symfony.com/doc/7.2/service_container/lazy_services.html
// @match        https://symfony.com/doc/current/service_container/lazy_services.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509659/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerlazy_serviceshtml.user.js
// @updateURL https://update.greasyfork.org/scripts/509659/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20service_containerlazy_serviceshtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {};

    fanyi(translates, 1, true);
})($);
