// ==UserScript==
// @name         Zendesk user ticket markdown
// @name:de      Zendesk Kundenticket Markdown
// @namespace    https://github.com/pke/zendesk-markdown
// @version      1.4
// @license      MIT
// @description  Renders markdown in user sent tickets
// @description:de Stellt markdown in Kundentickets dar
// @author       Philipp Kursawe <pke@pke.fyi>
// @match        https://*.zendesk.com/agent/tickets/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zendesk.com
// @run-at       document-end
// @require      https://cdn.jsdelivr.net/npm/marked@9.0.3/marked.min.js#sha256-kFpV+TsMjV61DFL9NPLjLbXsG8KAH88oX1pf7xjkTQY=
// @require      https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js#sha256-QigBQMy2be3IqJD2ezKJUJ5gycSmyYlRHj2VGBuITpU=
// @supportURL   https://github.com/pke/zendesk-markdown/discussions
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/475835/Zendesk%20user%20ticket%20markdown.user.js
// @updateURL https://update.greasyfork.org/scripts/475835/Zendesk%20user%20ticket%20markdown.meta.js
// ==/UserScript==

/* global marked, DOMPurify */

(function() {
    'use strict';

    // GM_log("Loaded");

    function onChange(mutations, observer) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                for (const commentNode of document.getElementsByClassName("zd-comment")) {
                    // GM_log("zd-comment found");
                    // Already processed nodes are marked for not processing them again
                    if (!commentNode.markdowned) {
                        // GM_log("Added node:", commentNode.textContent);
                        // Grab the elements textContent which preserves indentions made
                        // by "  " constructs but strips all markup code.
                        const unmarkedContent = commentNode.textContent;
                        try {
                            const markedContent = marked.parse(unmarkedContent);
                            // GM_log("Marked:", markedContent);
                            const cleanContent = DOMPurify.sanitize(markedContent);
                            // GM_log("Clean:", cleanContent);
                            if (typeof commentNode.setHTML === "function") {
                                // GM_log("setHTML: ", cleanContent);
                                commentNode.setHTML(cleanContent);
                            } else {
                                // GM_log("innerHTML: ", cleanContent);
                                commentNode.innerHTML = cleanContent;
                            }
                        } catch (error) {
                            // GM_log("error: ", error.message);
                        }
                        commentNode.markdowned = true;
                    }
                }
            }
        }
    }

    // Wait for .zd-comment nodes to be created and convert their textContent to markdown, then disconnect
    var observer = new MutationObserver(onChange);
    observer.observe(document.body, { subtree: true, childList: true });
})();