// ==UserScript==
// @name         Autoclick Truffle point rewards (youtube live)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto-clicks the point reward claim button on the truffle.tv youtube extension. Only clicks once every 60 seconds (point rewards have a 5 minute cooldown).
// @author       xorus
// @match        https://*.truffle.site/channel-points
// @icon         https://www.google.com/s2/favicons?sz=64&domain=truffle.vip
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/461475/Autoclick%20Truffle%20point%20rewards%20%28youtube%20live%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461475/Autoclick%20Truffle%20point%20rewards%20%28youtube%20live%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        document.querySelector('[id*="channel-points"]')?.shadowRoot?.querySelector('.claim')?.click()
    }, 60000);
})();