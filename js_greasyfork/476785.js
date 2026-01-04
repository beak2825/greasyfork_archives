// ==UserScript==
// @name         Whereby who is talking better indicator
// @namespace    https://monadical.com
// @version      0.1
// @description  Make the talking indicator more visible than the white border
// @author       Mathieu Virbel <mathieu@monadical.com>
// @match        https://*.whereby.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whereby.com
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/476785/Whereby%20who%20is%20talking%20better%20indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/476785/Whereby%20who%20is%20talking%20better%20indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addStyle(styleText){
        let s = document.createElement('style')
        s.appendChild(document.createTextNode(styleText))
        document.getElementsByTagName('head')[0].appendChild(s)
    }
    addStyle(`
        body .AudioIndicator-3CTQ {
        z-index: 1;
        background: rgba(255, 0, 0, 0.5);
    }`)
})();