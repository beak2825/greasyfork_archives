// ==UserScript==
// @name         WhatsApp UI Enhance
// @namespace    facelook.hk
// @version      0.2
// @description  Enhance Whatsapp UI
// @homepage     https://greasyfork.org/en/scripts/404708-whatsapp-ui-enhance
// @author       FacelookHK
// @include      https://web.whatsapp.com*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404708/WhatsApp%20UI%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/404708/WhatsApp%20UI%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log('Custom script loaded');

    var timer = setInterval(function() {
        try {
            var body = document.getElementsByClassName("web");
            body[0].classList.add("dark");
            clearInterval(timer);
        } catch (e) {
        }
    }, 500);
})();