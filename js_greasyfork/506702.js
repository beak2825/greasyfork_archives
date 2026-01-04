// ==UserScript==
// @name         53AI宽屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove right sidebar on 53AI website
// @author       dst1213
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/506702/53AI%E5%AE%BD%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/506702/53AI%E5%AE%BD%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeRightSidebar() {
        let rightSidebar = document.querySelector('.new-right');
        if (rightSidebar) {
            rightSidebar.remove();
        }
    }

    new MutationObserver(removeRightSidebar).observe(document, {
        childList: true,
        subtree: true
    });

    removeRightSidebar();

})();
