// ==UserScript==
// @name         Observador Premium
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Unblocks the articles, suppresses the ads about premium and removes the AdBlock detection
// @author       lsfe
// @match        https://observador.pt/*
// @icon         https://observador.pt/wp-content/themes/observador-child/assets/build/img/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440852/Observador%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/440852/Observador%20Premium.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
    'use strict';

    const showAsPremium = () => {

        // Remove some banners
        document.getElementById('piano-submenu')?.remove();
        document.getElementById('piano_endofarticle')?.remove();
        document.getElementById('piano-toaster')?.remove();
        document.querySelector('.piano-article-blocker')?.remove();

        // Replace top right button
        document.querySelector('.hide-if-premium-page')?.remove();
        document.querySelector('.show-if-premium-page')?.classList.remove('show-if-premium-page');

        // Deal with ad blocker detection
        document.querySelector('.fc-ab-root')?.classList.remove('fc-ab-root');
        document.body.style.overflow = '';

        // "Expand" the article
        const check = setInterval(() => {
            if (document.querySelector('.article-body-wrapper')?.style.cssText) {
                document.querySelector('.article-body-wrapper').style.cssText = '';
                clearInterval(check);
            }
            else if (!document.querySelector('.article-body-wrapper')) {
                clearInterval(check);
            }
        }, 1500);
    };

    // When you click on links, the page refreshes via AJAX
    if (!window.contextualData?.jsConfig.disableAjaxNavigation) {
        const observer = new MutationObserver(showAsPremium);

        observer.observe(document.querySelector('body'), {
            childList: true
        });
    }
})();