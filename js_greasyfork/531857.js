// ==UserScript==
// @name           Glassdoor Paywall Remover Update
// @description    This script is designed to bypass visual overlays and restrictive styles (such as paywalls or scrolling blocks) on glassdoor.
// @author         Percio Andrade @ https://github.com/percioandrade
// @version        1.1
// @include        http*://*glassdoor.*
// @namespace      http://www.greasyfork.org
// @license MIT    https://opensource.org/license/mit
// @downloadURL https://update.greasyfork.org/scripts/531857/Glassdoor%20Paywall%20Remover%20Update.user.js
// @updateURL https://update.greasyfork.org/scripts/531857/Glassdoor%20Paywall%20Remover%20Update.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function addGlobalStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function removeElementById(id) {
        const element = document.getElementById(id);
        if (element) {
            element.remove();
        }
    }

    function cleanMainStyles(element) {
        if (!element) return;

        // Remove inline styles que travam o layout
        element.style.removeProperty('height');
        element.style.removeProperty('width');
        element.style.removeProperty('position');
        element.style.overflow = 'auto';
    }

    function observeStyleChanges(target) {
        const observer = new MutationObserver(() => {
            cleanMainStyles(target);
        });

        observer.observe(target, {
            attributes: true,
            attributeFilter: ['style']
        });
    }

    window.addEventListener('load', function() {
        // Esconde overlays
        addGlobalStyle("#HardsellOverlay { display: none !important; }");
        removeElementById('ContentWallHardsell');
        removeElementById('UserAlert');

        // Permite scroll no main
        addGlobalStyle("main { overflow: auto !important; }");

        // Alvo: body.main
        const mainElement = document.querySelector('body.main');
        if (mainElement) {
            cleanMainStyles(mainElement);
            observeStyleChanges(mainElement);
        }

        // Libera scroll no body também
        document.body.onscroll = null;
    });
})();