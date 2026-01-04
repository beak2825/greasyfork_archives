// ==UserScript==
// @name         SMRT Create Order Button Enabler
// @version      0.1
// @description  Enable the SMRT Create Order Button on Web UI
// @author       Grant Gould
// @match        https://*.smrtapp.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smrtapp.com
// @license Public Domain
// @namespace https://greasyfork.org/users/1080242
// @downloadURL https://update.greasyfork.org/scripts/466467/SMRT%20Create%20Order%20Button%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/466467/SMRT%20Create%20Order%20Button%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        removeDisabledClass(document.querySelector("[data-cy='new-order-button']"));
    }, 1000);

    function removeDisabledClass(el){
        const button = el;

        if (button){
            button.classList.remove("disabled");
        }
    }
})();