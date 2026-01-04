// ==UserScript==
// @name         Agartool Fix for Delta
// @namespace    Agartool styling fix
// @version      0.2
// @icon         https://i.imgur.com/zZdqKJu.gif
// @description  Redirects a specific CSS to make it work again.
// @author       𝓝𝑒ⓦ 𝓙ⓐ¢𝓀🕹️
// @match        https://agar.io/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500348/Agartool%20Fix%20for%20Delta.user.js
// @updateURL https://update.greasyfork.org/scripts/500348/Agartool%20Fix%20for%20Delta.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your custom CSS file URL
    const customCssUrl = 'https://stirring-alike-sofa.glitch.me/style.css';

    // Function to redirect CSS
    function redirectCss() {
        const links = document.getElementsByTagName('link');
        for (let i = 0; i < links.length; i++) {
            if (links[i].href.includes('css/styles.37d360a315e30457362e.css')) {
                // Create a new link element for the custom CSS
                const newLink = document.createElement('link');
                newLink.rel = 'stylesheet';
                newLink.type = 'text/css';
                newLink.href = customCssUrl;

                // Replace the old link with the new one
                links[i].parentNode.replaceChild(newLink, links[i]);
            }
        }
    }

    // Delay the execution of the CSS redirect by 5 seconds
    setTimeout(() => {
        // Observe changes in the DOM to catch dynamically added link elements
        const observer = new MutationObserver(redirectCss);
        observer.observe(document.head || document.documentElement, { childList: true, subtree: true });

        // Initial run to catch already present link elements
        redirectCss();
    }, 5000); // 5000 milliseconds = 5 seconds

})();
