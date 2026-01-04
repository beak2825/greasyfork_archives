// ==UserScript==
// @name         Kill CSDN popup
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove CSDN Blog's annoying code scanning pop-ups
// @author       roshanca
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @license      MIT License;
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454082/Kill%20CSDN%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/454082/Kill%20CSDN%20popup.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const POPUP_CLS = 'passport-login-container';
    const config = {
      attributes: false,
      childList: true,
      subtree: true
    };
    let DOMObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
            if (mutation.type === 'childList') {
                const { classList } = mutation.previousSibling;
                if (classList.contains(POPUP_CLS)) {
                    document.body.removeChild(mutation.previousSibling);
                    DOMObserver.disconnect();
                    console.log('Kill one popup which className is:', '"' + POPUP_CLS + '"');
                }
            }
        }
    });
    setTimeout(() => DOMObserver.observe(document.body, config), 500);
})();