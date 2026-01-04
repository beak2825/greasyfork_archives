// ==UserScript==
// @name         Wide Deepseek
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Make Deepseek wide!
// @author       Kingron
// @run-at       document-start
// @match        *://chat.deepseek.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=deepseek.com
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535462/Wide%20Deepseek.user.js
// @updateURL https://update.greasyfork.org/scripts/535462/Wide%20Deepseek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
    :root, :host {
        --message-list-max-width: none !important;
    }

    ._8f60047 {
        --message-list-max-width: none !important;
    }

    * {
        max-width: none !important;
    }
`);

})();