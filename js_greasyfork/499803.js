// ==UserScript==
// @name       dayuploads.com - Remove Ad Link Button
// @namespace    https://greasyfork.org/en/users/807108-jeremy-r
// @version      1
// @description  Removes the button with id="ad-link"
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dayuploads.com
// @author       JRem
// @match        https://dayuploads.com/*/file
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499803/dayuploadscom%20-%20Remove%20Ad%20Link%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/499803/dayuploadscom%20-%20Remove%20Ad%20Link%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove button with id="ad-link"
    const adLinkButton = document.getElementById('ad-link');
    if (adLinkButton) {
        adLinkButton.parentNode.removeChild(adLinkButton);
    }

    // Modify button with id="ad-link2"
    const adLink2Button = document.getElementById('ad-link2');
    if (adLink2Button) {
        const currentText = adLink2Button.textContent || adLink2Button.innerText; // Get current text content
        adLink2Button.textContent = "[Cleaned] " + currentText; // Prepend the text
        adLink2Button.classList.remove('hidden');
    }
})();