// ==UserScript==
// @name         MathKaiheila
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Typeset equations in Kaiheila messages.
// @author       hnOsmium0001
// @match        https://kaiheila.cn/*
// @resource     katexCSS https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.js
// @require      https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/contrib/auto-render.min.js
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/403421/MathKaiheila.user.js
// @updateURL https://update.greasyfork.org/scripts/403421/MathKaiheila.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!renderMathInElement) throw "Katex did not load correctly!";

    // Declare rendering options (see https://katex.org/docs/autorender.html#api for details)
    const options = {
        delimiters: [
            { left: "$$", right: "$$", display: true },
            { left: "\\(", right: "\\)", display: false },
            { left: "\\[", right: "\\]", display: true },
            // Needs to come last to prevent over-eager matching of delimiters
            { left: "$", right: "$", display: false },
        ],
    };

    // We need to download the CSS, modify any relative urls to be absolute, and inject the CSS
    const pattern = /url\((.*?)\)/gi;
    const katexCSS = GM_getResourceText("katexCSS").replace(pattern, 'url(https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/$1)');
    GM_addStyle(katexCSS);

    const observer = new MutationObserver(function (mutations, observer) {
        for (const mutation of mutations) {
            const target = mutation.target;
            // Respond to newly loaded contents and server switching
            if (target.tagName === "DIV" && target.className === "room-content-left") {
                // Iterate over all messages added to the scroller and typeset them
                for (const added of mutation.addedNodes) {
                    if (added.tagName === "DIV" && added.classList.contains("text-room-container")) {
                        renderMathInElement(added, options);
                    }
                }
            }
            // Respond to replies
            else if (target.tagName === "DIV" && target.classList.contains("text-message-box")) {
                for (const added of mutation.addedNodes) {
                    if (added.tagName === "DIV" && added.classList.contains("text-message-item")) {
                        renderMathInElement(added, options);
                    }
                }
            }
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();