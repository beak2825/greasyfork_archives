// ==UserScript==
// @name         mboost.me bypass
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Fast auto bypasser
// @author       olhodocu On Discord
// @match        https://mboost.me/*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483391/mboostme%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/483391/mboostme%20bypass.meta.js
// ==/UserScript==

(function() {
    // Find all script elements on the page
    const scripts = document.getElementsByTagName('script');

    // Loop through all script elements
    for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const scriptContent = script.innerHTML;

        // Check if the script contains the targeturl pattern
        if (scriptContent.includes('"targeturl":')) {
            // Extract the link from the script content
            const targeturlRegex = /"targeturl":\s*"(.*?)"/;
            const match = scriptContent.match(targeturlRegex);

            if (match && match.length > 1) {
                const redirectLink = match[1];

                // Redirect to the extracted link
                window.location.replace(redirectLink);
                break;
            }
        }
    }
})();
