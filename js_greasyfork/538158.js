// ==UserScript==
// @name         JumpDirectly
// @namespace    http://tampermonkey.net/
// @version      2025-06-03
// @description  1. 链接直接跳转
// @author       popobaba
// @license      MIT
// @match        https://link.juejin.cn/?target=*
// @match        https://link.juejin.cn?target=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538158/JumpDirectly.user.js
// @updateURL https://update.greasyfork.org/scripts/538158/JumpDirectly.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let targetUrl = decodeURIComponent(window.location.search.substring('?.target='.length - 1));
    window.location.href = targetUrl;

})();