// ==UserScript==
// @name         ShopAEW Landing Page Pop-Up Closer
// @namespace    http://tampermonkey.net/
// @version      2024-04-02
// @description  To remove pop-up from landing page of shopaew.com
// @author       You
// @match        https://www.shopaew.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shopaew.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491460/ShopAEW%20Landing%20Page%20Pop-Up%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/491460/ShopAEW%20Landing%20Page%20Pop-Up%20Closer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Close the annoying pop-up when the site launches
const intervalId = setInterval(function() {
    const closeButton = document.querySelector('.mfp-close');
    if (closeButton) {
        closeButton.click();
        clearInterval(intervalId);
    }
}, 1000); // Checks every 1000 milliseconds (1 second)

})();