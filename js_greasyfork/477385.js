// ==UserScript==
// @name         Characters horizontal images support
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Makes horizontal images display as horizontal images instead of a squished image. Collage not supported.
// @author       xrock
// @match        https://f.angiva.re/QYH0c
// @match        https://f.angiva.re/ZLPFE
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477385/Characters%20horizontal%20images%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/477385/Characters%20horizontal%20images%20support.meta.js
// ==/UserScript==

const harem = window.location.href.includes("QYH0c");
let cssInjected = false;

const injectCSS = () => {

    document.head.insertAdjacentHTML("beforeend", `<style type="text/css">
        ${harem ? ".anime" : ".cards"} {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
        }

        .upper_card.land {
            width: 504px !important;
        }

        .upper_card.land .titre {
            max-width: 464px !important;
        }

        .upper_card.land .charimage {
            width: 467px !important;
        }
    </style>`);
}

const refreshCustoms = () => {
    [...document.querySelectorAll(".upper_card")].map((e) => {
        if (e.querySelector(".charimage").naturalWidth === 350) {
            if (!cssInjected) {
                injectCSS();
                cssInjected = true;
            }
            e.classList.add("land");
        }
    })
};

const listenLoad = (mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.className === "upper_card") {
                node.querySelector(".charimage").addEventListener("load", refreshCustoms);
            }
        });
    });
};

(() => {
    'use strict';

    new MutationObserver((mutations) => listenLoad(mutations)).observe(document.querySelector(harem ? "#content" : "#contents"), { childList: true, subtree: true, attributes: true });
})();