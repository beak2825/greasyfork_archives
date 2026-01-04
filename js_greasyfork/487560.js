// ==UserScript==
// @name         Krunker CSS editor
// @version      6.9.5
// @description  The best Krunker CSS editor
// @author       iCottage
// @match        *://krunker.io/*
// @exclude      *://krunker.io/editor*
// @exclude      *://krunker.io/social*
// @run-at       document-end
// @license      MIT
// @grant        none
// @icon         https://www.google.com/s2/favicons?domain=krunker.io
// @namespace https://greasyfork.org/users/1229506
// @downloadURL https://update.greasyfork.org/scripts/487560/Krunker%20CSS%20editor.user.js
// @updateURL https://update.greasyfork.org/scripts/487560/Krunker%20CSS%20editor.meta.js
// ==/UserScript==

(function () {
    const defaultCssUrl = "https://css.reizu.moe/reizu/main_custom.css";
    let cssUrl = defaultCssUrl;

    // Create CSS input field
    const cssInputField = document.createElement('input');
    cssInputField.type = 'text';
    cssInputField.value = cssUrl;
    cssInputField.placeholder = 'Enter CSS URL';
    cssInputField.style.position = 'fixed';
    cssInputField.style.top = '10px';
    cssInputField.style.left = '10px';
    cssInputField.style.zIndex = '9999';
    cssInputField.style.display = 'none';
    document.body.appendChild(cssInputField);

    // Function to toggle CSS input field visibility
    function toggleCssInputField() {
        cssInputField.style.display = (cssInputField.style.display === 'none') ? 'block' : 'none';
        if (cssInputField.style.display === 'block') {
            releaseMouseLock();
        }
    }

    // Function to release mouse lock
    function releaseMouseLock() {
        document.exitPointerLock();
    }

    // Function to apply new CSS
    function applyNewCss() {
        Array.from(document.styleSheets).forEach(css => {
            if (css.href && css.href.includes("main_custom.css")) {
                if (cssUrl.startsWith("http") && cssUrl.endsWith(".css")) {
                    css.ownerNode.href = cssUrl;
                }
            }
        });
    }

    // Event listener to toggle CSS input field on P key press
    window.addEventListener('keydown', (event) => {
        if (event.key.toUpperCase() === 'P') {
            toggleCssInputField();
        }
    });

    // Event listener to apply new CSS on Enter key press
    cssInputField.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            cssUrl = cssInputField.value.trim() || defaultCssUrl;
            applyNewCss();
            toggleCssInputField();
        }
    });

    // Event listener to hide CSS input field when clicked outside
    document.addEventListener('click', (event) => {
        if (!cssInputField.contains(event.target)) {
            cssInputField.style.display = 'none';
        }
    });

    // Apply initial CSS on page load
    window.addEventListener('DOMContentLoaded', applyNewCss);
})();
