// ==UserScript==
// @name           Glassdoor Paywall Remover
// @description    This script is designed to bypass visual overlays and restrictive styles (such as paywalls or scrolling blocks) on glassdoor. Derived from https://update.greasyfork.org/scripts/531857/Glassdoor%20Paywall%20Remover%20Update.user.js
// @author         Percio Andrade @ https://github.com/percioandrade
// @author         Jason Axley
// @version        1.1.2025-08-04
// @include        http*://*.glassdoor.*
// @namespace      http://axley.net
// @license MIT    https://opensource.org/license/mit
// @downloadURL https://update.greasyfork.org/scripts/544654/Glassdoor%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/544654/Glassdoor%20Paywall%20Remover.meta.js
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

    function remove() {
        let overlay = document.getElementById('ContentHardsellOverlay');
        if (overlay) {
            overlay.remove();
        }

        let collapsed = document.querySelectorAll('p.review-text_isCollapsed__dPlLp');
        for (let i=0; i < collapsed.length; i++) {
            collapsed[i].classList.remove('review-text_isCollapsed__dPlLp')
        }

        let buttons = document.querySelectorAll('.review-details_showMoreButton__N4hkO');
        for (let i=0; i < buttons.length; i++) {
            buttons[i].remove();
        }
    };

    const observer = new MutationObserver((one, two) => remove());
    observer.observe(document.querySelector('body'), {
        childList: true,
        subtree: true,
    });
})();