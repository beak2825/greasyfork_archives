// ==UserScript==
// @name        Texcord
// @namespace   http://tampermonkey.net/
// @version     0.1.1
// @description Typeset (latex) equations in Discord. (uses KaTeX)
// @match       https://discord.com/*
// @resource    katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require     https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require     https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/444846/Texcord.user.js
// @updateURL https://update.greasyfork.org/scripts/444846/Texcord.meta.js
// ==/UserScript==

// Check if an element's class starts with a given prefix.
function hasClassPrefix(element, prefix) {
    var classes = (element.getAttribute("class") || "").split();
    return classes.some(x => x.startsWith(prefix));
}

(function() {
    'use strict';
    // Declare rendering options (see https://katex.org/docs/autorender.html#api for details)
    const options = {
        delimiters: [
            {left: "$$", right: "$$", display: true},  
            // Needs to come last to prevent over-eager matching of delimiters
            {left: "$", right: "$", display: false},
        ],
    };

    // Download CSS
    var katexCSS = GM_getResourceText("katexCSS");
    // Fix URLS  
    var pattern = /url\((.*?)\)/gi;
    katexCSS = katexCSS.replace(pattern, 'url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/$1)');
    // Inject CSS
    GM_addStyle(katexCSS);

    // Monitor the document for changes and render math as necessary
    var config = { childList: true, subtree: true };
    var observer = new MutationObserver(function(mutations, observer) {
        for (let mutation of mutations) {
            var target = mutation.target;
            // If the message list was updated, typeset all added nodes
            if (target.tagName == "OL" && hasClassPrefix(target, "scrollerInner")) {
                for (let added of mutation.addedNodes) {
                    if (added.tagName == "LI" && hasClassPrefix(added, "messageListItem")) {
                        renderMathInElement(added, options);
                    }
                }
            // If a message was changed, typeset it
            } else if (target.tagName == "DIV" && hasClassPrefix(target, "contents")) {    
                for (let added of mutation.addedNodes) {
                    // Hack to fix annoying bug
                    setTimeout(_ => renderMathInElement(added, options), 100);
                }
            }
        }
    });
    observer.observe(document.body, config);
})();
