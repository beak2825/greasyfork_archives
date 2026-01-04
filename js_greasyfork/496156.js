// ==UserScript==
// @name         Autoconsent for tme.eu (cookies)
// @namespace    http://tampermonkey.net/
// @version      2024-05-26
// @description  Automatically consents (no other option provided by the website) to cookies on https://tme.eu website.
// @author       CZkiniCZ
// @match        https://www.tme.eu/
// @require      http://code.jquery.com/jquery-3.7.1.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tme.eu
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496156/Autoconsent%20for%20tmeeu%20%28cookies%29.user.js
// @updateURL https://update.greasyfork.org/scripts/496156/Autoconsent%20for%20tmeeu%20%28cookies%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const button = document.querySelector('button[class="o-button o-button--medium o-button-filled--blue c-unresolved-cookiebot__submit-button js-cookiebot-unresolved-submit-button"]');
    if(button){
        button.click();
    }

})();