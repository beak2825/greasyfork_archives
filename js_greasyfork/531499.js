// ==UserScript==
// @name         unblur lenso.ai
// @version      1.0
// @description  dynamically unblur Lenso.ai results
// @author       SH3LL
// @match        https://lenso.ai/*
// @grant        none
// @namespace https://greasyfork.org/users/762057
// @downloadURL https://update.greasyfork.org/scripts/531499/unblur%20lensoai.user.js
// @updateURL https://update.greasyfork.org/scripts/531499/unblur%20lensoai.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLocked() {
        const lockedElements = document.querySelectorAll('[class*="locked"]');
        lockedElements.forEach(element => {
            let classes = element.className.split(' ');
            const newClasses = classes.filter(className => className !== 'locked');
            element.className = newClasses.join(' ');
        });
    }

    // Run the function on startup
    removeLocked();

    // Configure the MutationObserver
    const observer = new MutationObserver(removeLocked);

    // Observe changes to the document body, including sub-elements
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

})();