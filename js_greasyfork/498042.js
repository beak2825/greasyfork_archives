// ==UserScript==
// @name         YouTube Short Remover
// @namespace    https://github.com/CHooverShrimp
// @version      2.0
// @description  Removing brainrot automatically just for (You)!
// @author       Hoover
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498042/YouTube%20Short%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/498042/YouTube%20Short%20Remover.meta.js
// ==/UserScript==

(function() {
    let css = `
     #dismissible.ytd-rich-shelf-renderer {
      display: none;
     }
    `;

    let cssNone = `
        display: none;
    `;

    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }

    function hideSuggestedDivs() {
        var suggestedDivs = document.querySelectorAll('div.ytd-reel-shelf-renderer');
        suggestedDivs.forEach(function(div) {
            div.style.cssText += cssNone;
        });
    }

    // Run once on load
    hideSuggestedDivs();

    // Use MutationObserver to detect changes in the DOM
    const observer = new MutationObserver(hideSuggestedDivs);
    observer.observe(document.body, { childList: true, subtree: true });

})();
