// ==UserScript==
// @name         Adblock for woomy.app
// @version      1.1
// @description  Removes ads and the adblock message for woomy.app
// @author       Jekyll (discord: xskt)
// @match        https://*.woomy.app/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woomy.app
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/951187
// @downloadURL https://update.greasyfork.org/scripts/470388/Adblock%20for%20woomyapp.user.js
// @updateURL https://update.greasyfork.org/scripts/470388/Adblock%20for%20woomyapp.meta.js
// ==/UserScript==

(function() {
    "use strict";
    setInterval(function () {
        try {
            document.evaluate("//div[contains(., 'because ad or script')]", document, null, XPathResult.ANY_TYPE, null).iterateNext().remove();
        } catch {}
        try {
            document.getElementById("bottomPageAd").remove();
        } catch {}
    }, 100);
})();