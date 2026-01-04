// ==UserScript==
// @name         Remove Popup Content
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Removes the popup content div
// @author       Kenneth Yeung
// @match        *://examtopics.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535736/Remove%20Popup%20Content.user.js
// @updateURL https://update.greasyfork.org/scripts/535736/Remove%20Popup%20Content.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select and remove the popup
    let popup = document.querySelector('.popup-content');
    if (popup) {
        popup.remove();
    }
})();