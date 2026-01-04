// ==UserScript==
// @name         去他妈的批改网
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除批改网的粘贴限制。
// @author       Kirawii
// @match        https://www.pigai.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541447/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E6%89%B9%E6%94%B9%E7%BD%91.user.js
// @updateURL https://update.greasyfork.org/scripts/541447/%E5%8E%BB%E4%BB%96%E5%A6%88%E7%9A%84%E6%89%B9%E6%94%B9%E7%BD%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('paste', event => event.stopPropagation(), true);
    console.log('粘贴限制已解除');
})();