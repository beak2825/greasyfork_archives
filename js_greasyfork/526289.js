// ==UserScript==
// @name         Inject JS and modify shadowroot from closed to open
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  test injecting js
// @author       Jarda
// @match        https://www.kingsbet.cz/sport?page=liveEvent&eventId=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kingsbet.cz
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526289/Inject%20JS%20and%20modify%20shadowroot%20from%20closed%20to%20open.user.js
// @updateURL https://update.greasyfork.org/scripts/526289/Inject%20JS%20and%20modify%20shadowroot%20from%20closed%20to%20open.meta.js
// ==/UserScript==

(function() {
    const originalAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function(init) {
        return originalAttachShadow.call(this, { ...init, mode: "open" });
    };
})();