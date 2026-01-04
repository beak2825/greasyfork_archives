// ==UserScript==
// @name         delete jsoneditoronline ads
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Remove the advertisement section of https://jsoneditoronline.org/.
// @author       jasoncool
// @match        https://jsoneditoronline.org/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471797/delete%20jsoneditoronline%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/471797/delete%20jsoneditoronline%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function removeAds() {
        const adsElement = document.querySelector('.ad-panel'); 
        if (adsElement) {
            adsElement.remove();
        }
    }

    setTimeout(removeAds, 500);
})();