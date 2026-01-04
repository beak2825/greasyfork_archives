// ==UserScript==
// @name         CopyAnything
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Allows highlighting and copying text on websites where it might be disabled by overriding CSS and removing common disabling attributes.
// @author       Aditya Mendiratta
// @match        *://*/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540057/CopyAnything.user.js
// @updateURL https://update.greasyfork.org/scripts/540057/CopyAnything.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function applyCssOverrides() {
        const style = document.createElement('style');
        style.type = 'text/css';

        style.innerHTML = `
            * {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            body {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            input, textarea {
                /* Ensure input fields are always selectable,
                   though 'text' should generally cover this too. */
                user-select: auto !important;
            }
        `;
        document.head.appendChild(style);
        console.log('User select CSS overrides applied.');
    }


    function removeDisablingAttributes() {
        const elements = document.querySelectorAll('*');
        let removedCount = 0;
        elements.forEach(el => {
            if (el.hasAttribute('onselectstart')) {
                el.removeAttribute('onselectstart');
                removedCount++;
            }
            if (el.hasAttribute('ondragstart')) {
                el.removeAttribute('ondragstart');
                removedCount++;
            }
            if (el.hasAttribute('oncontextmenu')) {
                el.removeAttribute('oncontextmenu');
                removedCount++;
            }
        });
        if (removedCount > 0) {
            console.log(`Removed ${removedCount} disabling attributes.`);
        }
    }


    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'onselectstart' ||
                 mutation.attributeName === 'ondragstart' ||
                 mutation.attributeName === 'oncontextmenu')) {
                if (mutation.target.hasAttribute('onselectstart')) { mutation.target.removeAttribute('onselectstart'); }
                if (mutation.target.hasAttribute('ondragstart')) { mutation.target.removeAttribute('ondragstart'); }
                if (mutation.target.hasAttribute('oncontextmenu')) { mutation.target.removeAttribute('oncontextmenu'); }
            }
            else if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        node.style.setProperty('-webkit-user-select', 'text', 'important');
                        node.style.setProperty('-moz-user-select', 'text', 'important');
                        node.style.setProperty('-ms-user-select', 'text', 'important');
                        node.style.setProperty('user-select', 'text', 'important');

                        if (node.hasAttribute('onselectstart')) { node.removeAttribute('onselectstart'); }
                        if (node.hasAttribute('ondragstart')) { node.removeAttribute('ondragstart'); }
                        if (node.hasAttribute('oncontextmenu')) { node.removeAttribute('oncontextmenu'); }

                        node.querySelectorAll('*').forEach(descendant => {
                            if (descendant.hasAttribute('onselectstart')) { descendant.removeAttribute('onselectstart'); }
                            if (descendant.hasAttribute('ondragstart')) { descendant.removeAttribute('ondragstart'); }
                            if (descendant.hasAttribute('oncontextmenu')) { descendant.removeAttribute('oncontextmenu'); }
                        });
                    }
                });
            }
        });
    });


    window.addEventListener('DOMContentLoaded', () => {
        applyCssOverrides();
        removeDisablingAttributes();


        observer.observe(document.body, {
            attributes: true,
            childList: true,
            subtree: true
        });
        console.log('MutationObserver started for dynamic content.');
    });


    window.addEventListener('load', () => {
        applyCssOverrides();
        removeDisablingAttributes();
    });

})();