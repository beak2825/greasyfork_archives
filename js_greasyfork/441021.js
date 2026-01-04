// ==UserScript==
// @name         yuque copy
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除语雀复制限制
// @author       Ravenclaw
// @match        https://www.yuque.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441021/yuque%20copy.user.js
// @updateURL https://update.greasyfork.org/scripts/441021/yuque%20copy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('copy', function(event) {
        event.stopImmediatePropagation();
    }, true);
})();