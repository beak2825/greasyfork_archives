// ==UserScript==
// @name         Default to Comments
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rewrite all gag links on 9gag to directly go to the comment section
// @author       Marco Pfeiffer (https://www.marco.zone/)
// @match        https://9gag.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=9gag.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458058/Default%20to%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/458058/Default%20to%20Comments.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("click", function (evt) {
        const link = evt.target.matches('a[href]') ? evt.target : evt.target.closest('a[href]');
        if (!link) {
            return;
        }

        if (/^\/gag\/[^/]+/.test(link.pathname)) {
            link.hash = 'comment';
        }
    });
})();