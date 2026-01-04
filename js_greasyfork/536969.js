// ==UserScript==
// @name         hook_clear
// @namespace    https://github.com/0xsdeo/Hook_JS
// @version      2024-11-09
// @description  禁止js清除控制台数据
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536969/hook_clear.user.js
// @updateURL https://update.greasyfork.org/scripts/536969/hook_clear.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.clear = function() {};
})();