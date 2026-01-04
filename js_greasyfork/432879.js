// ==UserScript==
// @name         可刪改網頁
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可以刪除、新增網頁中的文字
// @author       Microdust
// @match        *://*/*
// @grant        none
// @run-at       context-menu
// @downloadURL https://update.greasyfork.org/scripts/432879/%E5%8F%AF%E5%88%AA%E6%94%B9%E7%B6%B2%E9%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/432879/%E5%8F%AF%E5%88%AA%E6%94%B9%E7%B6%B2%E9%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.body.spellcheck=false;

    document.designMode = trigger(document.designMode);

    function trigger(status) {
        if (status === 'off') return 'on';
        return 'off';
    }

})();