// ==UserScript==
// @name         Fast Packs
// @namespace    sabbasofa.fastpacks
// @version      0.4
// @description  Removes animations that play when opening supply packs
// @author       Hemicopter [2780600]
// @match        https://www.torn.com/item.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @downloadURL https://update.greasyfork.org/scripts/494656/Fast%20Packs.user.js
// @updateURL https://update.greasyfork.org/scripts/494656/Fast%20Packs.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //Removes all images, leaving only the result text and buttons.
    //This should prevent the "Use Another" button moving most of the time
    let removeVisuals = true;



    // cc Manuito
    let GM_addStyle = function(s) {
        let style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = s;
        document.head.appendChild(style);
    };

    GM_addStyle(`
    .d .pack-open-content.disabled-link .pack-open-msg a.open-another-cache {
	    pointer-events: auto !important;
        cursor: default !important;
        color: var(--default-blue-color) !important;
    }

    .d .pack-open-msg {
	    animation-duration: 0s !important;
        animation-delay: 0s !important;
    }

    .d .animated-fadeIn {
	    opacity: 1 !important;
    }

    .d .animated {
	    animation-duration: 0s !important;
    }

    .d .pack-open-result .cache-item:nth-child(2) {
	    animation-delay: 0s !important;
    }

    .d .pack-open-result .item-amount {
	    animation: none !important;
        animation-delay: 0s !important;
        opacity: 1 !important;
    }

    .r .pack-open-result {
        animation-name: none !important;
        animation-duration: 0s !important;
    }

    .d .pack-open-result-divider.visible {
        transition: none !important;
    }
    `);

    if(removeVisuals) {
        GM_addStyle(`
            .pack-open-result {
	            visibility: hidden !important;
                height: 0px !important;
            }
            .d .cache_wrapper,
            .d .pack-open-result-divider {
                display: none !important
            }
        `);
    }

})();