// ==UserScript==
// @name         Waze Share Event on Nextdoor
// @namespace    https://github.com/gncnpk/waze-share-event-on-nextdoor
// @version      0.0.2
// @description  Adds a button to share Waze events on Nextdoor.
// @author       Gavin Canon-Phratsachack (https://github.com/gncnpk)
// @match        https://www.waze.com/events*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546868/Waze%20Share%20Event%20on%20Nextdoor.user.js
// @updateURL https://update.greasyfork.org/scripts/546868/Waze%20Share%20Event%20on%20Nextdoor.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let oldHref = document.location.href;

    function addNextdoorButton() {
        if (!document.location.href.includes("-")) {
            return;
        }
        let sharebar = document.getElementsByClassName("mte-sidebar__share")[0].children[0];
        let nextdoorbutton = document.createElement("a");
        let mailbutton = document.getElementsByClassName("share-email")[0];
        let nextdoorlink = `${mailbutton.href.split("&subject=")[0].replace("mailto:?", "https://nextdoor.com/sharekit/?source=waze&")}&hashtag=waze`
        let houseicon = document.createElement("i");
        houseicon.className = "fa fa-home";
        nextdoorbutton.href = nextdoorlink;
        nextdoorbutton.className = "share-nextdoor";
        nextdoorbutton.target = "_blank";
        nextdoorbutton.appendChild(houseicon);
        sharebar.appendChild(nextdoorbutton)
    }

    // Initialize on DOM ready and watch for URL changes
    document.addEventListener("DOMContentLoaded", function() {
        const bodyList = document.querySelector('body');

        const observer = new MutationObserver(function(mutations) {
            if (oldHref !== document.location.href) {
                oldHref = document.location.href;
                addNextdoorButton();
            }
        });

        observer.observe(bodyList, {
            childList: true,
            subtree: true
        });

        addNextdoorButton();
    });

})();
