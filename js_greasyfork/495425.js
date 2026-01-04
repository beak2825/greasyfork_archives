// ==UserScript==
// @name         Reset user-select properties
// @namespace    http://tampermonkey.net/
// @version      2024-05-18
// @description  Some websites set css param `user-select` to none so you can't select the text. this script forces it to auto so you can
// @author       vincent bruneau
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/495425/Reset%20user-select%20properties.user.js
// @updateURL https://update.greasyfork.org/scripts/495425/Reset%20user-select%20properties.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resetUserSelect() {
        document.body.setAttribute('style', 'user-select: auto !important; -moz-user-select: auto !important; -webkit-user-select: auto !important; -ms-user-select: auto !important; -webkit-touch-callout: auto !important;');
    }

    window.addEventListener('load', ()=>{
        resetUserSelect();

        const observer = new MutationObserver(resetUserSelect);
        observer.observe(document.body, { childList: true, subtree: true });
    }, false);
})();