// ==UserScript==
// @name         Download PDF from FlippingBook
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Patches FlippingBook config
// @author       stuffed
// @match        https://online.flippingbook.com/*
// @grant        none
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/538124/Download%20PDF%20from%20FlippingBook.user.js
// @updateURL https://update.greasyfork.org/scripts/538124/Download%20PDF%20from%20FlippingBook.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const checkInterval = setInterval(() => {
        try {
            if (window.FBO && window.FBO.PreloadedPublicationModel) {
                clearInterval(checkInterval);
                const config = window.FBO.PreloadedPublicationModel.Publication.Configuration;

                console.log("FlippingBook Config:", config);

                // Try to re-enable download
                if (config.buttons.download === false) {
                    console.log("Download was disabled. Attempting to re-enable...");
                    config.buttons.download = true;
                    console.log("Download re-enabled (might not be effective if server enforces it)");
                }
            }
        } catch (err) {
            console.error("Error checking FlippingBook config:", err);
        }
    }, 500); // check every 500ms
})();
