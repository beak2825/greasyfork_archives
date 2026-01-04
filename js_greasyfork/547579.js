// ==UserScript==
// @name         Virtualized Textarea Replacement
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace large textareas with a virtualized editor to prevent lag on huge text (300kb+)
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547579/Virtualized%20Textarea%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/547579/Virtualized%20Textarea%20Replacement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function virtualizeTextarea(textarea) {
        const container = document.createElement("div");
        container.style.position = "relative";
        container.style.border = "1px solid #ccc";
        container.style.fontFamily = "monospace";
        container.style.overflowY = "auto";
        container.style.height = textarea.offsetHeight + "px";
        container.style.width = textarea.offsetWidth + "px";
        container.style.whiteSpace = "pre";
        container.style.background = "#fff";

        const lineHeight = 20; // px
        let textBuffer = textarea.value.split("\n");

        const viewport = document.createElement("div");
        container.appendChild(viewport);

        function render() {
            const scrollTop = container.scrollTop;
            const startLine = Math.floor(scrollTop / lineHeight);
            const visibleLines = Math.ceil(container.clientHeight / lineHeight) + 1;
            const endLine = Math.min(startLine + visibleLines, textBuffer.length);

            viewport.style.paddingTop = (startLine * lineHeight) + "px";
            viewport.innerText = textBuffer.slice(startLine, endLine).join("\n");
            viewport.style.height = (textBuffer.length * lineHeight) + "px";
        }

        container.addEventListener("scroll", render);

        // Sync textarea with buffer
        textarea.style.display = "none";
        textarea.parentNode.insertBefore(container, textarea);

        // Initial render
        render();

        // Mutation observer for external changes
        const observer = new MutationObserver(() => {
            textBuffer = textarea.value.split("\n");
            render();
        });
        observer.observe(textarea, { attributes: true, characterData: true, childList: true, subtree: true });

        // TODO: Editing support (this version is read-only view)
    }

    function init() {
        document.querySelectorAll("textarea").forEach(ta => {
            if (!ta.dataset.virtualized) {
                ta.dataset.virtualized = "true";
                virtualizeTextarea(ta);
            }
        });
    }

    // Run on page load
    window.addEventListener("load", init);
})();