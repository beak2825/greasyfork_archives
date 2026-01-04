// ==UserScript==
// @name         AD Closer
// @namespace    https://tampermonkey.net/
// @version      0.2
// @description  This is closer for ad-blocking software message
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433896/AD%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/433896/AD%20Closer.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.addEventListener('load', function() {
        window.setTimeout(function() {
            if (/You are seeing this message because ad or script blocking software is interfering with this page./i.test(document.body.innerHTML)) {
                document.querySelectorAll('div[style*="bottom: 0px"][style*="position: fixed"]').forEach(d => d.remove());
            }
        }, 5000);
    })
})();