// ==UserScript==
// @name         Innoreader Mobile Nav Bar Center
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0.1
// @description  Mobile Nav Bar Center for Inoreader
// @author       genio
// @match        *://*.inoreader.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519562/Innoreader%20Mobile%20Nav%20Bar%20Center.user.js
// @updateURL https://update.greasyfork.org/scripts/519562/Innoreader%20Mobile%20Nav%20Bar%20Center.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const mobileFooter = document.querySelector('.mobile_footer');
    if (mobileFooter) {
      let thirdEmptyPart = document.createElement('div');
      thirdEmptyPart.id = 'prefix';
      thirdEmptyPart.className = 'relative flex w-100';
      mobileFooter.prepend(thirdEmptyPart);
    }

})();