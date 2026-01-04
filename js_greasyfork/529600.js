// ==UserScript==
// @name         Freecodecamp No Popup
// @namespace    https://github.com/shin-tran
// @version      0.2
// @description  Removes the donate popup on FreeCodeCamp
// @author       ngocshintran
// @match        https://www.freecodecamp.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=freecodecamp.org
// @grant        GM_addStyle
// @supportURL   https://github.com/shin-tran/freecodecamp-no-popup/issues
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529600/Freecodecamp%20No%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/529600/Freecodecamp%20No%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const observer = new MutationObserver((mutations, obs) => {
        const test = document.getElementById("headlessui-portal-root");
        if (test) {
            test.remove();
            obs.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });
})();
