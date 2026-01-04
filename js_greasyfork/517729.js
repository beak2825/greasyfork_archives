// ==UserScript==
// @name         EpidemicSound NoTrial
// @namespace    -
// @version      1.6
// @description  Hides the trial popup and allows you to scroll without trial subscription on Epidemic Sound.
// @author       Cat-Ling
// @homepageURL  https://github.com/Cat-Ling
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.epidemicsound.com
// @match        *://*.epidemicsound.com/*
// @exclude      *://login.epidemicsound.com/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517729/EpidemicSound%20NoTrial.user.js
// @updateURL https://update.greasyfork.org/scripts/517729/EpidemicSound%20NoTrial.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const enforceScrollbar = () => {
        const style = document.createElement('style');
        style.textContent = `
            html, body {
                overflow: auto !important;
            }
            ::-webkit-scrollbar {
                display: block !important;
            }
        `;
        document.head.appendChild(style);
    };

    const hideBackdrop = () => {
        document.querySelectorAll("[class*='_backdrop_']").forEach((element) => {
            element.style.display = 'none';
        });
    };

    enforceScrollbar();
    hideBackdrop();

    const observer = new MutationObserver(() => {
        enforceScrollbar();
        hideBackdrop();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
