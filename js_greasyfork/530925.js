// ==UserScript==
// @name         Remove TOEFL KMF Region Restrictions
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Removes regional restrictions and blur effects for TOEFL practice materials on KMF when accessing from outside China
// @author       SAM_BOOM
// @match        https://toefl.kmf.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kmf.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/530925/Remove%20TOEFL%20KMF%20Region%20Restrictions.user.js
// @updateURL https://update.greasyfork.org/scripts/530925/Remove%20TOEFL%20KMF%20Region%20Restrictions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeBlurAndShield() {
        // Remove blur from all elements with 'blur' class
        const blurElements = document.querySelectorAll('.blur');
        blurElements.forEach(element => {
            element.classList.remove('blur');
            removeBlurStyles(element);
        });

        // Remove blur from practice container specifically
        const practiceElements = document.querySelectorAll('.practice-container');
        practiceElements.forEach(element => {
            element.classList.remove('blur');
            removeBlurStyles(element);
        });

        // Remove or hide shield box
        const shieldBoxes = document.querySelectorAll('.shield-box, .js-shield-box');
        shieldBoxes.forEach(shield => {
            shield.style.display = 'none';
            // Alternative: remove the element completely
            // shield.remove();
        });

        // Add style override
        if (!document.getElementById('remove-blur-style')) {
            const style = document.createElement('style');
            style.id = 'remove-blur-style';
            style.textContent = `
                .blur,
                .practice-container,
                .practice-container.blur,
                [class*="blur"] {
                    -webkit-filter: none !important;
                    -moz-filter: none !important;
                    -o-filter: none !important;
                    -ms-filter: none !important;
                    filter: none !important;
                    backdrop-filter: none !important;
                    -webkit-backdrop-filter: none !important;
                }

                .shield-box,
                .js-shield-box {
                    display: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function removeBlurStyles(element) {
        const styles = [
            'filter',
            '-webkit-filter',
            '-moz-filter',
            '-o-filter',
            '-ms-filter',
            'backdrop-filter',
            '-webkit-backdrop-filter'
        ];

        styles.forEach(style => {
            element.style.setProperty(style, 'none', 'important');
        });
    }

    // Run as soon as possible
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeBlurAndShield);
    } else {
        removeBlurAndShield();
    }

    // Create a more specific observer
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.attributeChanged) {
                removeBlurAndShield();
            }
        });
    });

    // Observe both DOM changes and attribute changes
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Run periodically just in case
    setInterval(removeBlurAndShield, 1000);
})();