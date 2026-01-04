// ==UserScript==
// @name         Mathcord
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Typeset equations in Discord messages.
// @author       Till Hoffmann
// @match        https://discordapp.com/*
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/396801/Mathcord.user.js
// @updateURL https://update.greasyfork.org/scripts/396801/Mathcord.meta.js
// ==/UserScript==

/**
 * Evaluate whether an element has a certain class prefix.
 */
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
            {left: "\\(", right: "\\)", display: false},
            {left: "\\[", right: "\\]", display: true},
            // Needs to come last to prevent over-eager matching of delimiters
            {left: "$", right: "$", display: false},
        ],
    };

    // We need to download the CSS, modify any relative urls to be absolute, and inject the CSS
    var katexCSS = GM_getResourceText("katexCSS");
    var pattern = /url\((.*?)\)/gi;
    katexCSS = katexCSS.replace(pattern, 'url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/$1)');
    GM_addStyle(katexCSS);

    // Monitor the document for changes and render math as necessary
    var config = { childList: true, subtree: true };
    var observer = new MutationObserver(function(mutations, observer) {
        for (let mutation of mutations) {
            var target = mutation.target;
            // Iterate over all messages added to the scroller and typeset them
            if (target.tagName == "DIV" && hasClassPrefix(target, "scroller")) {
                for (let added of mutation.addedNodes) {
                    if (added.tagName == "DIV" && hasClassPrefix(added, "message")) {
                        renderMathInElement(added, options);
                    }
                }
            }
            // Respond to edited messages
            else if (target.tagName == "DIV" && hasClassPrefix(target, "container") &&
                       hasClassPrefix(target.parentNode, "message")) {
                for (let added of mutation.addedNodes) {
                    // Do not typeset the interactive edit container
                    if (added.tagName == "DIV" && !added.getAttribute("class")) {
                        continue;
                    }
                    setTimeout(_ => renderMathInElement(added, options), 1000);
                }
            }
        }
    });
    observer.observe(document.body, config);
})();
