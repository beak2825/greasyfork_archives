// ==UserScript==
// @name         Symfony 翻译文档 components/yaml.html
// @namespace    fireloong
// @version      0.0.3
// @description  翻译文档 components/yaml.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/components/yaml.html
// @match        https://symfony.com/doc/6.4/components/yaml.html
// @match        https://symfony.com/doc/7.1/components/yaml.html
// @match        https://symfony.com/doc/7.2/components/yaml.html
// @match        https://symfony.com/doc/current/components/yaml.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496621/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20componentsyamlhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496621/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20componentsyamlhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    The Yaml Component\n        \n            ': 'Yaml 组件',
    };

    fanyi(translates, 1, true);
})($);
