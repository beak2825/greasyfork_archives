// ==UserScript==
// @name         JUST FER KAPS
// @namespace    Ziticca Script Library
// @version      TWO
// @description  JUST FER KAPS :)
// @author       ZITICCA
// @license      MIT
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/514161/JUST%20FER%20KAPS.user.js
// @updateURL https://update.greasyfork.org/scripts/514161/JUST%20FER%20KAPS.meta.js
// ==/UserScript==
// body :not([class^="chat-box-body"])

(function() {
    'use strict';
    const styles = `
        body {
            text-transform: uppercase !important;
        }

        div[class^="chat-box-body"] {
            text-transform: none !important;
        }

    `
    const isTampermonkeyEnabled = typeof unsafeWindow !== 'undefined';
    if (isTampermonkeyEnabled) {
        GM_addStyle(styles);
    }
})();