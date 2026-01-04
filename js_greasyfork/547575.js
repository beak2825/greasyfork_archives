// ==UserScript==
// @name         Virtualized Textarea (Fast for Huge Code)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace laggy textareas with virtualized rendering
// @author       You
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547575/Virtualized%20Textarea%20%28Fast%20for%20Huge%20Code%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547575/Virtualized%20Textarea%20%28Fast%20for%20Huge%20Code%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceTextarea(ta) {
        if (ta.dataset.virtualized) return;
        ta.dataset.virtualized = "true";

        const container = document.createElement("div");
        container.style.cssText = `
            border: 1px solid #ccc;
            font-family: monospace;
            font-size: 13px;
            line-height: 1.4em;
            overflow: auto;
            white-space: pre;
            width: ${ta.offsetWidth}px;
            height: ${ta.offsetHeight}px;
            position: relative;
        `;

        const viewport = document.createElement("div");
        viewport.style.position = "absolute";
        viewport.style.top = "0";
        viewport.style.left = "0";
        container.appendChild(viewport);

        ta.style.display = "none";
        ta.parentNode.insertBefore(container, ta);

        let lines = ta.value.split("\n");
        const lineHeight = 18; // px
        const buffer = 20; // extra lines above/below viewport

        container.addEventListener("scroll", render);

        function render() {
            const scrollTop = container.scrollTop;
            const height = container.clientHeight;

            const startLine = Math.max(0, Math.floor(scrollTop / lineHeight) - buffer);
            const endLine = Math.min(lines.length, Math.ceil((scrollTop + height) / lineHeight) + buffer);

            viewport.style.top = (startLine * lineHeight) + "px";
            viewport.innerText = lines.slice(startLine, endLine).join("\n");
            viewport.style.height = (lines.length * lineHeight) + "px";
        }

        render();
    }

    document.querySelectorAll("textarea").forEach(replaceTextarea);

})();