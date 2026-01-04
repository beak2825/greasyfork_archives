// ==UserScript==
// @name         My MetLife Hungary - close the popup
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Close the popup modal on page load
// @author       nemzsom
// @match        https://my.metlife.hu/auth/login
// @icon         https://www.google.com/s2/favicons?sz=64&domain=metlife.hu
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/456782/My%20MetLife%20Hungary%20-%20close%20the%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/456782/My%20MetLife%20Hungary%20-%20close%20the%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        setTimeout(function() {
            document.getElementsByTagName("Button")[0].click();
        }, 500);
    }, false);
})();