// ==UserScript==
// @name         Stay Open
// @namespace    https://github.com/Airazone
// @version      v1.1
// @description  Keep Rows Maximized; Neopets Hospital Volunteer Centre.
// @author       Airazon
// @match        https://www.neopets.com/hospital/volunteer.phtml
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/510019/Stay%20Open.user.js
// @updateURL https://update.greasyfork.org/scripts/510019/Stay%20Open.meta.js
// ==/UserScript==

(function() {
    'use strict';

   document.getElementById('Act2Pane').className = 'vc-act maximize';
   document.getElementById('Act3Pane').className = 'vc-act maximize';

    const elements = document.querySelectorAll(".vc-fights");
    elements.forEach(element => {element.style.height = "100%";
    });
})();