// ==UserScript==
// @name         hook_close
// @namespace    https://github.com/0xsdeo/Hook_JS
// @version      2024-11-09
// @description  重写close方法，以此来避免网站反调试关闭当前页面
// @author       0xsdeo
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536973/hook_close.user.js
// @updateURL https://update.greasyfork.org/scripts/536973/hook_close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.close = function() {};
})();