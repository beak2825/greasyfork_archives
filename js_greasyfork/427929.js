// ==UserScript==
// @name         JSTOR enabler
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enables access to JSTOR on CKY's library website.
// @author       abiham
// @match        http://218.188.215.171/common/servlet/presenthomeform.do*
// @downloadURL https://update.greasyfork.org/scripts/427929/JSTOR%20enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/427929/JSTOR%20enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let ref = document.createElement('meta');
    ref.name = "referrer";
    ref.content = "unsafe-url";
    document.head.appendChild(ref);
})();