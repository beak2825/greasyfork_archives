// ==UserScript==
// @name         Google SVG Logo Replacer
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Replace Google’s SVG logo with "Myra's birthday" text on homepage using correct class selector (lnXdpd)
// @match        https://www.google.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534847/Google%20SVG%20Logo%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/534847/Google%20SVG%20Logo%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const tryReplaceSVG = () => {
        const svgLogo = document.querySelector('svg.lnXdpd');
        if (svgLogo) {
            const textLogo = document.createElement('div');
            textLogo.textContent = "Myra's birthday";
            textLogo.style.fontSize = "36px";
            textLogo.style.fontWeight = "bold";
            textLogo.style.fontFamily = "Arial, sans-serif";
            textLogo.style.color = "#4285F4";
            textLogo.style.display = "inline-block";

            svgLogo.parentNode.replaceChild(textLogo, svgLogo);
            return true;
        }
        return false;
    };

    const observer = new MutationObserver(() => {
        if (tryReplaceSVG()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(tryReplaceSVG, 1000);
    });
})();