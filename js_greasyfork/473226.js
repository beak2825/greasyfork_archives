// ==UserScript==
// @name         No Promo Poe
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Poe with the lower side panel elements removed
// @author       emuyia
// @license      Apache-2.0
// @match        https://poe.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/473226/No%20Promo%20Poe.user.js
// @updateURL https://update.greasyfork.org/scripts/473226/No%20Promo%20Poe.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function cleanPoe() {
        var elements = [
            {selector: '.SidebarFooter_footer__3egHX', style: 'visibility', value: 'hidden'},
        ];

        for (var i = 0; i < elements.length; i++) {
            var el = document.querySelector(elements[i].selector);
            if (el) {
                el.style[elements[i].style] = elements[i].value;
            }
        }
    }

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type == 'childList') {
                cleanPoe();
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });

    cleanPoe();
})();