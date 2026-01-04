// ==UserScript==
// @name         Adjust Iframe Height on emploi-public
// @namespace    http://your-namespace.org
// @version      1.1
// @description  Adjust the height of the iframe in the Bootstrap modal
// @author       Yassine.N
// @match        https://www.emploi-public.ma/extranet/concours_candidatures_fiche.asp*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478400/Adjust%20Iframe%20Height%20on%20emploi-public.user.js
// @updateURL https://update.greasyfork.org/scripts/478400/Adjust%20Iframe%20Height%20on%20emploi-public.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Select the iframe element within the modal
    var iframe = document.querySelector("#myModal > div > div > div.modal-body > iframe"); // Change 'yourIframeId' to the actual ID of your iframe
    var modal = document.querySelector("#myModal > div");


    // Set the desired height (e.g., 500px)
    var desiredHeight = '1600px';
    var desiredModalWidth = '1600px';

    // Adjust the iframe's height and set zoom to 1
    if (iframe) {
        iframe.style.height = desiredHeight;
        modal.style.width = desiredModalWidth;
        iframe.style.zoom = '1';
    }
})();