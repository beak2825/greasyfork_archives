// ==UserScript==
// @name         CloseWindowByName
// @version      0.5
// @description  Simple script to handle a specific Auto Claim case. I won't be answering questions about this script. May or may not update it. May or may not work for you. It's just a workaround in case you don't have an ad blocker.
// @author       satology
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        window.close
// @namespace satology.onrender.com
// @downloadURL https://update.greasyfork.org/scripts/429739/CloseWindowByName.user.js
// @updateURL https://update.greasyfork.org/scripts/429739/CloseWindowByName.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regexs = [/betteradsystem\.com/, /request\-global\.czilladx\.com/, /bmfads\.com/, /coinverti\.com/, /^https\:\/\/faucetcrypto\.com\/$/];

    try {
        if(regexs.some((exp) => document.referrer && document.referrer.match(exp) )) {
            let delay = 11000 + 2000 * Math.random();
            setTimeout(window.close, delay);
        }
    } catch (err) {}
    try {
        if(regexs.some((exp) => window.name && window.name.match(exp) )) {
//            let delay = 11000 + 13000 * Math.random();
            let delay = 11000 + 2000 * Math.random();
            setTimeout(window.close, delay);
        }
    } catch (err) {}
    try {
        if(regexs.some((exp) => window.opener && window.opener.match(exp) )) {
//            let delay = 11000 + 13000 * Math.random();
            let delay = 11000 + 2000 * Math.random();
            setTimeout(window.close, delay);
        }
    } catch (err) {}
})();