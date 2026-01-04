// ==UserScript==
// @name         GMail Styles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Some Gmail Styles
// @author       DA25
// @match        https://mail.google.com/mail/u/0/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454746/GMail%20Styles.user.js
// @updateURL https://update.greasyfork.org/scripts/454746/GMail%20Styles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styles = `
    .z0 {
    justify-content: center;
    padding-left: 0.5rem;
    padding-right: 8px;
    }
    .T-I.T-I-KE.L3 {
    justify-content: center;
    flex-grow: 1;
    }`;

    GM_addStyle(styles);
})();