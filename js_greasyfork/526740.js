// ==UserScript==
// @name         Zaiko name replacer
// @namespace    http://tampermonkey.net/
// @version      2025-02-13
// @description  Replace the name on main tickets on zaiko
// @author       Tekno
// @supportURL   .tekno on discord
// @match        *://zaiko.io/*
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/526740/Zaiko%20name%20replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/526740/Zaiko%20name%20replacer.meta.js
// ==/UserScript==

/*
 * For optimal results, enable instant injection
 * Go to Tampermonkey Settings
 * Set Config Mode -> Advanced
 * Scroll to the bottom to the section "Experimental"
 * Set Inject Mode -> Instant
 * This should make it inject fast enough such that the original name never renders
 * Also replaces text that appears later, in my testing this is also instant
 */

(function() {
    'use strict';

    // Hide page until both loading and replacement is complete
    GM_addStyle('body { opacity: 0; }');

    const replacements = new Map([
        ['Main Ticket Name', 'Your Name'],
        ['Not your last name', 'Your last name'],
        ['Not your first name', 'Your first name'],
    ]);

    function replaceText(node) {
      console.log(node.nodeType,node.nodeValue)
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.nodeValue;
            replacements.forEach((value, key) => {
                const regex = new RegExp(key, 'g');
                text = text.replace(regex, value);
            });
            node.nodeValue = text;
        } else {
            node.childNodes.forEach(replaceText);
        }
    }

    function run() {
        replaceText(document.body);

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    replaceText(node);
                });
            });
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        document.body.style.opacity = '1';
    }


    if (document.readyState !== 'loading') {
        // Document has already loaded, no listener needed
        run();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            run();
        });
    }

})();