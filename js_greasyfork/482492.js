// ==UserScript==
// @name         Taboola
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Rand Extra
// @author       Groland
// @match        https://www.taboola.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482492/Taboola.user.js
// @updateURL https://update.greasyfork.org/scripts/482492/Taboola.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const dangerAlert = document.querySelector('.text--medium');
        setTimeout(function() {
        if (dangerAlert.textContent === "Exclusive Partnerships with Top Publishers Around the Globe") {
            history.go(-3)();
        }
    }, 1000);
 function closeCurrentWindow() {
  window.close();
}



})();